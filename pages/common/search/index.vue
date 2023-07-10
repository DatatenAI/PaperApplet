<template>
	<view class="rf-search">
		<view class="search-box">
			<mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="hotSearchDefault || '请输入关键字'"
				@search="doSearch(false)" @confirm="doSearch(false)" v-model="keyword"></mSearch>
		</view>
		<view class="search-keyword" @touchstart="blur">
			<scroll-view class="keyword-list-box" v-if="isShowKeywordList" scroll-y>
				<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="row in keywordList"
					:key="row.keyword">
					<view class="keyword-text" @tap="doSearch(row.keyword)"><rich-text :nodes="row.htmlStr"></rich-text>
					</view>
					<view class="keyword-img" @tap="setkeyword(row)">
						<!--<image src="/static/HM-search/back.png"></image>--></view>
				</view>
			</scroll-view>
			<scroll-view class="keyword-box" v-if="!isShowKeywordList" scroll-y>
				<view class="keyword-block">
					<view class="keyword-list-header">
						<view>搜索历史</view>
						<view><text class="iconfont iconiconfontshanchu1 oldDeleteiconfont"
								@tap="oldDelete">&#xe69a;</text></view>
					</view>
					<view class="keyword">
						<view v-for="(keyword, index) in oldKeywordList" @tap="doSearch(keyword)" :key="index">
							{{ keyword }}</view>
					</view>
					<view class="hide-hot-tis" v-if="oldKeywordList.length === 0">
						<view>暂无记录</view>
					</view>
				</view>
				<!-- <view class="keyword-block" v-if="hotKeywordList">
					<view class="keyword-list-header">
						<view>搜索推荐</view>
						<view>
							<text class="iconfont forbidiconfont" @tap="hotToggle">
								<text v-if="forbid == true">&#xe616;</text>
								<text v-else>&#xe626;</text>
							</text>
						</view>
					</view>
					<view class="keyword" v-if="forbid == true">
						<view v-for="(keyword, index) in hotKeywordList" @tap="doSearch(keyword)" :key="index"
							v-if="keyword!=''">{{ keyword }}</view>
					</view>
					<view class="hide-hot-tis" v-else>
						<view>当前搜索推荐已隐藏</view>
					</view>
				</view> -->
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import config from '@/config.js';
	import mSearch from '@/pages/common/components/rf-search/rf-search';
	export default {
		data() {
			return {
				uploadStaticUrl: config.uploadStaticUrl,
				keyword: '',
				oldKeywordList: [],
				hotKeywordList: ['热吃',"AI","大学","JAVA"],
				keywordList: [],
				forbid: true,
				isShowKeywordList: false,
				hotSearchDefault: '',
				inputFocus: true,
				type: null // 搜索类型
			};
		},
		onLoad(options) {
			this.initData(options);
		},
		components: {
			mSearch
		},
		methods: {
			async initData(options) {
				this.type = options.type;
				const search = JSON.parse(options.data || '{}');
				this.hotSearchDefault = search.hot_search_default || options.keyword;
				this.loadOldKeyword();
				this.hotKeyword();
			},
			blur() {
				uni.hideKeyboard();
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: res => {
						let OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: res => {
						if (res.confirm) {
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {}
					}
				});
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid === true ? false : true;
			},
			//执行搜索
			doSearch(key) {
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				this.keyword = key;
				if (this.keyword == undefined || this.keyword == '' || this.keyword == null) {
					uni.showModal({
						content: "请输入搜索关键字!"
					});

					return false;
				}
				this.saveKeyword(key); //保存为历史
				
				uni.navigateTo({
					url: `/pages/common/search/list?keyword=${key}`
				});
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: res => {
						let OldKeys = JSON.parse(res.data);
						let findIndex = OldKeys.indexOf(keyword);
						if (findIndex === -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: () => {
						let OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			},
			//搜索推荐
			hotKeyword() {
				// $api.sendRequest({
				// 	url: config.apiUrl + api.apiHotKeywords,
				// 	method: 'get',
				// 	success: res => {
				// 		this.hotKeywordList = res.data.item; //更新历史搜索
				// 	},
				// 	fail: e => {

				// 	},
				// 	complete: () => {

				// 	}
				// });
			}
		}
	};
</script>
<style lang="scss">
	@import '/static/fonts/iconfont.css';

	.oldDeleteiconfont,
	.forbidiconfont {
		color: #777;
	}

	.rf-search {
		box-sizing: border-box;
	}

	.rf-search {
		.search-box {
			width: 100%;
			background-color: rgb(242, 242, 242);
			padding: 15upx 2.5%;
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;

			.mSearch-input-box {
				width: 100%;
			}

			.input-box>input {
				width: 100%;
				height: 60upx;
				font-size: 32upx;
				border: 0;
				border-radius: 60upx;
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				padding: 0 3%;
				margin: 0;
				background-color: #ffffff;
			}
		}

		.search-keyword {
			box-sizing: border-box;
			background-color: rgb(242, 242, 242);

			.keyword-list-box {
				height: calc(100vh - 110upx);
				padding-top: 10upx;
				border-radius: 20upx 20upx 0 0;
				background-color: #fff;
			}

			.keyword-entry {
				width: 94%;
				height: 80upx;
				margin: 0 3%;
				font-size: 30upx;
				color: #333;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: solid 1upx #e7e7e7;

				image {
					width: 60upx;
					height: 60upx;
				}

				.keyword-text {
					width: 90%;
				}

				.keyword-img {
					width: 10%;
					justify-content: center;
				}
			}

			.keyword-box {
				border-radius: 20upx 20upx 0 0;
				background-color: #fff;

				.keyword-block {
					padding: 10upx 0;

					.keyword-list-header {
						width: 100vw;
						padding: 10upx 3%;
						font-size: 27upx;
						color: #333;
						display: flex;
						justify-content: space-between;
						box-sizing: border-box;

						image {
							width: 40upx;
							height: 40upx;
						}
					}

					.keyword {
						width: 100vw;
						padding: 3px 3%;
						display: flex;
						flex-flow: wrap;
						justify-content: flex-start;
					}

					.hide-hot-tis {
						display: flex;
						justify-content: center;
						font-size: 28upx;
						color: #6b6b6b;
					}

					.keyword>view {
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 60upx;
						padding: 0 20upx;
						margin: 10upx 20upx 10upx 0;
						height: 60upx;
						font-size: 28upx;
						background-color: rgb(242, 242, 242);
						color: #6b6b6b;
					}
				}
			}
		}

		.iconfont {
			font-size: $font-lg + 12upx;
		}
	}
</style>