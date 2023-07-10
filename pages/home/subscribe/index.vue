<template>
	<view class="page">
		<view class="subscribe_box">
			<view class="title">我的订阅<text>点击取消订阅</text></view>
			<view class="tag_box">
				<uni-tag class="tag_item" :text="item.keywords.keywordShort" type="primary" size="default" color="#3B00FF"
					v-for="item in myKeyWords" @tap="doSubscribe(item.keywords.id,false)" />
			</view>
		</view>

		<view class="search-box">
			<uni-combox :candidates="keywordListTag" placeholder="请选择订阅关键字" v-model="keyword" empty-tips="无数据" @input="change"></uni-combox>
			<!-- <mSubscribe class="mSearch-input-box" :mode="2" button="inside" :placeholder="hotSearchDefault || '自定义关键字'"
				@search="doSearch(false)" @confirm="doSearch(false)" v-model="keyword"></mSubscribe> -->
		</view>

		<view class="recommend_box">
			<view class="title">
				推荐订阅<text>点击添加订阅</text>
				<uni-icons type="reload" size="16" color="#333" class="more"
					@click="getRandomArr(keywordList,5)" style="float: right;"></uni-icons>
			</view>
			<view class="tag_box">
				<uni-tag class="tag_item" :inverted="true" :text="item.keywordShort" type="primary" size="default" color="#3B00FF"
					v-for="item in hotKeywordList" @tap="doSubscribe(item.id,true)" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUser,
		setUser,
		removeUser,
	} from '@/utils/auth'
	import {
		searchPaper,
		searchKeyWords,
		searchMyKeyWords,
		addSubscribe,
		cancelSubscribe
	} from '@/api/home/index.js'
	import config from '@/config.js';
	import mSubscribe from '@/pages/home/components/rf-subscribe/rf-subscribe';
	export default {
		data() {
			return {
				myKeyWords: [],
				keyword: '',
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				keywordListTag: [],
				forbid: true,
				isShowKeywordList: false,
				hotSearchDefault: '',
				inputFocus: true,
				user: {},
				type: null // 搜索类型
			};
		},
		onLoad(options) {
			// this.initData(options);
		},
		components: {
			mSubscribe
		},
		onShow() {
			var that = this;
			if(getUser()){
				that.user = JSON.parse(getUser()) || {}
			}
			that.getSubscribe();
			that.getMySubscribe();
		},
		methods: {
			change(e){
				if(this.keyword){
					var id = this.keyword.split('/')[0];
					this.doSubscribe(id,true);
				}
			},
			//打乱数组顺序
			getArrRandomly(arr) {
				var len = arr.length;
				for (var i = len - 1; i >= 0; i--) {
					var randomIndex = Math.floor(Math.random() * (i + 1));
					var itemIndex = arr[randomIndex];
					arr[randomIndex] = arr[i];
					arr[i] = itemIndex;
				}
				return arr;
			},
			//截取打乱后的数组的前10（num）位
			getRandomArr(arr, num) {
				const tmpArr = this.getArrRandomly(arr);
				let arrList = [];
				for (let i = 0; i < num; i++) {
					arrList.push(tmpArr[i]);
				};
				console.log(arrList);
				this.hotKeywordList = arrList;
			},
			getSubscribe() {
				var that = this;
				searchKeyWords().then(response => {
					that.keywordList = response;
					for(var i = 0;i < that.keywordList.length; i++){
						that.keywordListTag.push(that.keywordList[i].id+'/'+that.keywordList[i].keywordShort+'/'+that.keywordList[i].searchKeywords);
					}
					
					that.getRandomArr(that.keywordList,5);
					// 
				})
			},
			getMySubscribe() {
				var that = this;
				if(!that.user.id|| !that.user.openId ){
					that.$modal.msg('请登录');
					return false;
				}
				searchMyKeyWords({
					userId: that.user.id || null,
					openId: that.user.openId || '',
				}).then(response => {
					that.myKeyWords = response.mykeywords
				})
			},
			doSubscribe(id,status){
				var that = this;
				if(!that.user.id|| !that.user.openId ){
					that.$modal.msg('请登录');
					return false;
				}
				if(status){
					var result = that.myKeyWords.filter(function(item) {
					  return item.keywordId == id;
					});
					if(result.length > 0){
						that.$modal.msg('已经订阅!');
						
						return false;
					}
					addSubscribe({
						keywordId:parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('订阅成功');
						that.getMySubscribe();
					})
				}else{
					cancelSubscribe({
						keywordId:parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('取消成功')
						that.getMySubscribe();
					})
				}
			},
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
			// oldDelete() {
			// 	uni.showModal({
			// 		content: '确定清除历史搜索记录？',
			// 		success: res => {
			// 			if (res.confirm) {
			// 				this.oldKeywordList = [];
			// 				uni.removeStorage({
			// 					key: 'OldKeys'
			// 				});
			// 			} else if (res.cancel) {}
			// 		}
			// 	});
			// },
			oldDelete(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: res => {
						let OldKeys = JSON.parse(res.data);
						let findIndex = OldKeys.indexOf(keyword);
						if (findIndex > -1) {
							OldKeys.splice(findIndex, 1);
						}

						//最多10个纪录
						// OldKeys.length > 10 && OldKeys.pop();
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
						content: "请输入自定义关键字!"
					});

					return false;
				}
				this.saveKeyword(key); //保存为历史
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
						// OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
						this.keyword = '';
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

	.subscribe_box {
		margin-bottom: 40rpx;

		.title {
			font-size: 32rpx;
			color: #333;
			margin-bottom: 30rpx;

			text {
				margin-left: 10rpx;
				font-size: 24rpx;
				color: #999;
			}
		}

		.tag_box {
			.tag_item {
				display: block;
				// background-color: #3B00FF;
				border: #3B00FF;
				margin-bottom: 30rpx;
				margin-right: 10rpx;
				font-size: 28rpx;
			}
		}
	}

	.recommend_box {
		margin-top: 40rpx;

		.title {
			font-size: 32rpx;
			color: #333;
			margin-bottom: 30rpx;

			text {
				margin-left: 10rpx;
				font-size: 24rpx;
				color: #999;
			}
		}

		.tag_box {
			.tag_item {
				display: block;
				color: #3B00FF;
				// border: 1px solid #3B00FF!important;
				margin-bottom: 30rpx;
				margin-right: 10rpx;
				font-size: 28rpx;
			}
		}
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
	}
</style>