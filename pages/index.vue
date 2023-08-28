<template>
	<view class="page">
		<view class="header_box">
			<view class="topBar">
				<view class="notice_box" @click="navTo('/pages/common/notice/list')">
					<uni-icons type="notification" size="18" color="#0f80ff"></uni-icons>
				</view>
				<view class="tab_box">
					<view class="item" :class="{'active':tabIndex == 0}" @click="changeTab(0)"
						v-if="user.id && user.openId">待阅</view>
					<view class="item" :class="{'active':tabIndex == 1}" @click="changeTab(1)">订阅</view>
					<!-- <view class="item" :class="{'active':tabIndex == 2}" @click="changeTab(2)">热榜</view> -->
				</view>
				<view class="search_box" @click="navTo('/pages/common/search/index') ">
					<uni-icons type="search" size="18" color="#0f80ff"></uni-icons>
				</view>
			</view>

			<view class="list_tab" v-if="tabIndex == 1 && tabIndexStatus">
				<fastTab :list="tabData" :active-index.sync="activeIndex" @on-change="change" class="tab_box">
				</fastTab>

				<uni-icons type="plusempty" size="18" color="#0f80ff" class="more"
					@click="navTo(`/pages/home/subscribe/index`)"></uni-icons>
			</view>
			<view class="list_empty_tab" v-if="tabIndex == 1 && !tabIndexStatus">
				登录后查看更多板块
			</view>
		</view>
		<uni-transition ref="ani" :mode-class="animationSetting[1].modeClass" :show="animationSetting[1].show">
			<view class="list" v-if="tabIndex == 1">
				<view class="item" v-for="(item,index) in list">
					<view class="thumb" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)" v-if="item.imgUrl">
						<image
							:src="config.staticUrl + item.pdfHash + '/' + item.imgUrl.split(',')[0]"
							mode="widthFix"></image>
					</view>
					<view class="title bolder" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)">
						{{ item.title }}
					</view>
					<view class="title color" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)"
						v-if="item.summary[0]">{{ item.summary[0].titleZh }}
					</view>
					<view class="bottom">
						<text style="color:#999">{{ item.pubTime | formatDate }}</text>
					</view>
					<view class="bottom">
						<view class="source_box">
							<!-- <image :src="item.avatar" mode="widthFix" class="avatar"></image> -->
							<!-- <text>{{ item.authors }}</text> -->
						</view>
						<view class="btn_box">
							<view class="btn" v-if="!item.waitFlag" @click="doRead(index,item.id,true)">加入待阅</view>
							<view class="join-btn" v-else @click="doRead(index,item.id,false)">已加入</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="nodata" v-if="list.length == 0">
				<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/nodata.svg" mode="widthFix"></image>
			</view>
		</uni-transition>

		<uni-transition ref="ani" :mode-class="animationSetting[0].modeClass" :show="animationSetting[0].show">
			<view class="list_1" v-if="tabIndex == 0">
				<!-- @touchstart="touchStart" @touchend="touchEnd" -->
				<view class="item" v-for="(item,index) in tbrList">
					<view class="content">
						<view class="title" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)">
							{{ item.paperInfo.title || '' }}
						</view>
						<view class="bottom">
							<text>{{ item.createTime | formatDate }}</text>
							<!-- <text>{{ item.paperInfo.authors || ''}}</text> -->
						</view>
					</view>
					<!-- <view class="thumb" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)" v-if="item.paperInfo.imgUrl">
						<image
							:src="config.staticUrl + item.paperInfo.pdfHash + '/' + item.paperInfo.imgUrl.split(',')[0]"
							mode="widthFix"></image>
					</view> -->
					<view class="bottom">
						<!-- <view class="source_box" v-if="item.paperInfo.imgUrl">
								<image
									:src="config.staticUrl + item.paperInfo.pdfHash + '/' + item.paperInfo.imgUrl.split(',')[0]"
									mode="widthFix"></image>
						</view> -->
						<view class="btn_box">
							<view class="btn" v-if="!(tbrCancelList[index])" @click="undoRead(index, item.paperId, true)">取消待阅</view>
							<view class="join-btn" v-else @click="undoRead(index, item.paperId, false)">已取消</view>
						</view>
					</view>
				</view>
				
				
				<view class="nodata" v-if="tbrList.length == 0">
					<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/nodata.svg" mode="widthFix"></image>
				</view>
			</view>
		</uni-transition>
		
		
		<!-- <xWxmlToCanvas ref="xWxmlToCanvas" :hide="false" :width="350" :height="500" :xStyle="style" :xWxml="wxml">
		</xWxmlToCanvas> -->
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
		addRead,
		cancelRead,
		searchMyRead
	} from '@/api/home/index.js'
	import config from '@/config'
	import fastTab from '@/components/fast-tab/fast-tab';
	// import xWxmlToCanvas from 'x-wxml-to-canvas/x-wxml-to-canvas'
	const mode = 'aspectFill';
	
	const wxml = `
			<view class="container">
				<view><image class="img" src="/static/logon200.png" mode="aspectFill" isMode="true"></image></view>
				<view class="wrap">
					<view>
						<text class="wraptext">窗前明月光，疑是地上霜。举头望明月，低头思故乡</text>
					</view>
				</view>
			</view>
	`;
	
	const style = {
		container: {
			width: 350,
			height: 500,
			backgroundColor: '#fff',
			borderRadius: 20,
			padding: 20,
		},
		img: {
			width: 310,
			height: 150
		},
		wrap: {
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		wraptext: {
			width: 350,
			height: 60,
			fontSize: 13,
			paddingRight: 10
		}
	};
	export default {
		components: {
			fastTab,
			// xWxmlToCanvas
		},
		data() {

			return {
				config:config,
				imgSrc:'/static/logo200.png',
				wxml: wxml,
				style: style,
				imgMode: mode,
				tabIndexStatus: false,
				tabData: [],
				originTabData: [{
					id: 0,
					keywordShort: "全部",
					searchKeywords: "全部"
				}],
				activeIndex: 0,
				tabIndex: 1,
				startX: 0,
				user: {},
				queryRead: {
					keywords: '',
					pageNum: 1,
					pageSize: 10
				},
				query: {
					keywords: '',
					pageNum: 1,
					pageSize: 10
				},
				animationSetting: [{
					name: '',
					duration: 1000,
					show: false,
					modeClass: [],
				}, {
					name: '',
					duration: 1000,
					show: true,
					modeClass: [],
				}],
				list: [],
				tbrList: [],
				tbrCancelList: [],
			}
		},
		filters: {
			generateCanvas(txt) {
				const ctx = uni.createCanvasContext('imgCanvas');
				ctx.font = 'bold 18rpx serif'
				ctx.setTextAlign('center')
				ctx.setFillStyle("#000000")
				ctx.fillText(txt, this.windowWidth * 0.55 / 2, 60, this.windowWidth * 0.55)
				ctx.draw(true, () => {
					setTimeout(function() {
						uni.canvasToTempFilePath({
							canvasId: 'imgCanvas',
							fileType: 'jpg',
							x: 0,
							y: 0,
							width: this.windowWidth * 0.6,
							height: 100,
							destWidth: this.windowWidth * 0.6,
							height: 100,
							success: function(res) {
								console.log(res.tempFilePath)
								// this.imgPath = res.tempFilePath
								return res.tempFilePath;
								console.log(this.imgPath)
								// 在这里保存图片
							},
							fail: function(error) {
								console.log(error)
							},
						})
					}, 100)
				})
			},
			formatDate(time) {
				if (!time) { //当时间是null或者无效格式时返回空
					return ' '
				} else {
					// String localDate = LocalDateTime.parse(time,DateTimeFormatter.ISO_OFFSET_DATE_TIME).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

					// return localDate;
					return time.substr(0, 19).replace('T', ' ').replace(/-/g, '.');
					// const timeLen = time.length; //传入的时候时间戳类型应为字符串，因为要根据length判断是10/13的时间戳
					// const oneDate = new Date(parseInt(time) * 1000); // 10位时间戳
					// const twoDate = new Date(parseInt(time)); // 13位时间戳
					// const date = timeLen == 10 ? oneDate : twoDate;
					// const dateNumFun = (num) => num < 10 ? `0${num}` : num
					// console.log(time)
					// const [Y, M, D, h, m, s] = [
					// 	date.getFullYear(),
					// 	dateNumFun(date.getMonth() + 1),
					// 	dateNumFun(date.getDate()),
					// 	dateNumFun(date.getHours()),
					// 	dateNumFun(date.getMinutes()),
					// ]
					// return `${Y}-${M}-${D}`
				}
			},
		},
		onLoad() {
			var that = this;

			// that.getSubscribe();

		},
		onShow() {
			var that = this;
			that.tabIndexStatus = false;
			that.list = [];
			that.tbrList = [];
			that.tbrCancelList = []
			that.queryRead = {
				keywords: '',
				pageNum: 1,
				pageSize: 10
			};
			that.query = {
				keywords: '',
				pageNum: 1,
				pageSize: 10
			};

			if (getUser()) {
				that.user = JSON.parse(getUser()) || {}
				that.getArticlesRead();
				that.getMySubscribe();
			}
			that.getArticles();
			// that.getSubscribe();
			
			// that.$refs.xWxmlToCanvas.renderToCanvas();
			// this.$refs.xWxmlToCanvas.canvasToTempFilePath().then(res => {
			// 	debugger
			// 	this.src = res;
			// });
		},
		onReady() {

		},
		// 下拉到底部后加载新数据
		onReachBottom() {
			var that = this;
			// 判断下一页是否存在数据，不存在将显示暂无数据等提示语
			// if (that.activityList.length == that.query.total) {
			// 	that.noMoreData = true;
			// 	return false;
			// }
			if (this.tabIndex == 0) {
				that.queryRead.pageNum++; //页数加一
				that.getArticlesRead(); //回调接口
			}
			if (this.tabIndex == 1) {
				that.query.pageNum++; //页数加一
				that.getArticles(); //回调接口
			}

		},
		methods: {
			getArticlesRead() {
				var that = this;
				searchMyRead({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					keywords: that.queryRead.keywords,
					pageNum: that.queryRead.pageNum,
					pageSize: that.queryRead.pageSize,
				}).then(response => {
					that.tbrList = that.tbrList.concat(response);
					const responseCancelList = Array.from({length: response.length}, () => false);
					that.tbrCancelList = that.tbrCancelList.concat(responseCancelList)
				})
			},
			getArticles() {
				var that = this;
				searchPaper({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					keywords: that.query.keywords,
					pageNum: that.query.pageNum,
					pageSize: that.query.pageSize,
				}).then(response => {
					that.list = that.list.concat(response);
				})
			},
			getSubscribe() {
				var that = this;
				searchKeyWords().then(response => {
					// 
				})
			},
			getMySubscribe() {
				var that = this;
				that.tabData = [];
				that.originTabData = [{
					id: 0,
					keywordShort: "全部",
					searchKeywords: "全部"
				}];
				searchMyKeyWords({
					userId: that.user.id || null,
					openId: that.user.openId || '',
				}).then(response => {
					if (response.mykeywords.length > 0) {
						that.tabData = that.originTabData;
						for (var i = 0; i < response.mykeywords.length; i++) {
							that.tabData.push(response.mykeywords[i].keywords);
						}
						// that.tabData = that.originTabData.concat(response.mykeywords);
					} else {
						that.tabData = that.originTabData.concat(response.defKeyWords);
					}

					that.tabIndexStatus = true;
				})
			},
			change(key, item) {
				var that = this;
				if (item.keywordShort == '全部') {
					that.query.keywords = '';
				} else {
					that.query.keywords = item.keywordShort
				}
				that.query.pageNum = 1;
				that.list = [];
				that.getArticles();
				// uni.showModal({
				// 	content: `当前索${key},当前数据${JSON.stringify(item.searchKeyWords)}`
				// })
			},
			doRead(index, id, status) {
				var that = this;
				if (!that.user.id || !that.user.openId) {
					that.$modal.msg('请登录');
					return false;
				}

				if (status) {
					addRead({
						paperId: parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('添加待阅成功');
						that.list[index].waitFlag = true;
					})
				} else {
					cancelRead({
						paperId: parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('取消待阅成功');
						that.list[index].waitFlag = false;
					})
				}
			},
			undoRead(index, id, status) {
				var that = this;
				if (!that.user.id || !that.user.openId) {
					that.$modal.msg('请登录');
					return false;
				}
				
				if (status) {
					cancelRead({
						paperId: parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('取消待阅成功');
						that.$set(that.tbrCancelList, index, true);
					})
				} else {
					addRead({
						paperId: parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('添加待阅成功');
						that.$set(that.tbrCancelList, index, false);
					})
				}
				
			},
			changeTab(index) {
				if (this.tabIndex == index) {
					return false;
				}

				this.tabIndex = index;

				if (this.tabIndex == 0) {
					this.animationSetting[1].modeClass = ['fade', 'slide-right'];
					this.animationSetting[1].show = false;
					this.animationSetting[0].modeClass = ['fade', 'slide-left'];
					this.animationSetting[0].show = true;
					
					this.queryRead = {
						keywords: '',
						pageNum: 1,
						pageSize: 10
					}
					this.tbrList = [];
					this.tbrCancelList = [];
					this.getArticlesRead();
				}

				if (this.tabIndex == 1) {
					this.animationSetting[1].modeClass = ['fade', 'slide-right'];
					this.animationSetting[1].show = true;
					this.animationSetting[0].modeClass = ['fade', 'slide-left'];
					this.animationSetting[0].show = false;
					
					this.query = {
						keywords: '',
						pageNum: 1,
						pageSize: 10
					}
					
					this.list = [];
					this.getArticles();
				}
			},
			// change(e) {
			// 	console.log("e:", e);
			// },
			generate() {
				if (!this.$store.state.user.token) {
					this.$modal.showToast('请先登录!')
					return false;
				};
				if (this.reqForm.specialized == '') {
					this.$modal.showToast('请选择专业!')
					return false;
				}

				if (this.reqForm.describe == '') {
					this.$modal.showToast('请输入相关描述!')
					return false;
				}
				this.navTo(
					`/pages/article/index?specialized=${this.reqForm.specialized}&describe=${this.reqForm.describe}`)
			},
			getDict(type) {
				pap_specialty_type({
					type: type
				}).then(res => {

					this.dictOri = res.data;
					this.dict = [];

					if (this.$store.state.user.token && this.aiMajor.length > 0) {
						for (var i = 0; i < this.dictOri.length; i++) {
							if (this.aiMajor.includes(this.dictOri[i].dictValue)) {
								// this.dict.push(this.dictOri[i]);
								this.dict.push({
									text: this.dictOri[i].dictLabel,
									value: this.dictOri[i].dictLabel,
								});
							}
						}
					} else {
						this.dict = this.dictOri;
					}
					console.log(res)
				});
			},
			getUser() {
				getUserProfile().then(response => {
					this.user = response.data
				})
			},
			submit(ref) {
				this.$refs.form.validate().then(res => {
					updateUserProfile(this.user).then(response => {
						this.$modal.msgSuccess("修改成功")
					})
				})
			},
			/**
			 * 触摸开始
			 * @param {Object} e
			 */
			touchStart: function(e) {
				var that = this;
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX;
				}
			},
			/**
			 * 触摸结束
			 * @param {Object} e
			 */
			touchEnd: function(e) {
				var that = this;
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					let diff = endX - this.startX;
					if (Math.abs(diff) > 50) {
						if (diff > 0) {
							console.log("左滑...");
							if (that.tabIndex != 0) {
								that.changeTab(0)
							}
						} else {
							console.log("右滑...");
							if (that.tabIndex != 1) {
								that.changeTab(1)
							}
						}

					}
				}

			},
			navTo(url) {
				this.$tab.navigateTo(url)
			}
		}
	}
</script>

<style lang="scss">
	.page {
		// padding-top: 56rpx;
		
	}

	.header_box {
		width: calc(100% - 40rpx);
		position: fixed;
		top: 0;
		// background-color: #f5f8fa;
		z-index: 6;
		box-sizing: border-box;
	}

	.topBar {
		// position: absolute;
		/*#ifdef  H5*/
		// top: 0;
		/*#endif*/
		// top: -1rpx;
		// left: 0;
		width: 100%;
		// padding-left: 20rpx;
		// padding-right: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		// margin-bottom: 30rpx;
		padding-bottom: 15rpx;
		// z-index: 66;
		background-color: #f5f8fa;
	}

	.tab_box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		font-size: 36rpx;

		.item {
			margin: 0 30rpx;
			padding: 10rpx 0;
		}

		.active {
			color: #3B00FF;
			font-weight: bold;
			border-bottom: 6rpx solid #3B00FF;
		}
	}

	.list_tab {
		// width: calc(100% - 40rpx);
		// position: absolute;
		// top: 84rpx ;
		background-color: #f5f8fa;
		// z-index: 66;
		width: 100%;
		height: auto;
		position: relative;
		// padding-top: 92rpx;
		padding-bottom: 15rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		box-sizing: border-box;

		.tab_box {
			width: calc(100% - 60rpx) !important;
		}
		
		.item {
			text-align: center;
		}

		.more {
			// width:60rpx ;
			position: relative;
			top: -10rpx;
			// right: 0;
			// z-index: 77;
		}
	}
	
	.list_empty_tab {
		// width: calc(100% - 40rpx);
		// position: absolute;
		// top: 84rpx ;
		background-color: #f5f8fa;
		// z-index: 66;
		width: 100%;
		height: auto;
		position: fixed;
		// padding-top: 92rpx;
		padding-bottom: 15rpx;
		// display: flex;
		// flex-direction: row;
		// justify-content: space-between;
		// align-items: center;
		// align-content: center;
		box-sizing: border-box;
		text-align: center;
		
	}

	.list {
		position: relative;
		column-count: 2;
		column-gap: 30rpx;
		padding-top: 150rpx;

		.item {
			width: 100%;
			margin-bottom: 30rpx;
			padding-bottom: 10rpx;
			break-inside: avoid;
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 6rpx;

			image {
				width: 100%;
				display: block;
				border-radius: 6rpx;
			}

			.title {
				width: 100%;
				// max-height: 86rpx;
				padding: 10rpx 15rpx;
				color: #333;
				word-break: normal;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// -webkit-line-clamp: 2;
				// display: -webkit-box;
				// -webkit-box-orient: vertical
			}

			.bottom {
				padding: 10rpx 15rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				align-content: center;

				.source_box {
					width: calc(100% - 130rpx);
					display: flex;
					flex-direction: row;
					align-items: center;
					align-content: center;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					display: -webkit-box;
					white-space: normal;
					-webkit-box-orient: vertical;

					.avatar {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
					}

					text {
						font-size: 24rpx;
						color: #999;
						margin-left: 10rpx;
					}
				}

				.btn_box {
					font-size: 24rpx;
					white-space: nowrap;

					.btn {
						background-color: #3B00FF;
						color: #fff;
						border-radius: 20rpx;
						padding: 5rpx 15rpx;
					}

					.join-btn {
						color: #3B00FF;
						border: 1px solid #3B00FF;
						border-radius: 20rpx;
						padding: 5rpx 15rpx;
					}
				}

			}

		}
	}

	.list_1 {
		position: relative;
		padding-top: 84rpx;

		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			align-content: center;
			background-color: #fff;
			margin-bottom: 30rpx;
			border-radius: 6rpx;
			padding: 20rpx 15rpx;

			.content {
				width: calc(100% - 180rpx);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				background-color: #fff;

				.title {
					height: 120rpx;
					color: #333;
					word-break: normal;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 3;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					margin-bottom: 10rpx;
				}

				.bottom {
					font-size: 24rpx;
					color: #999;

					text {
						margin-right: 10rpx;
					}
				}
			}

			.thumb {
				width: 200rpx;
				height: 176rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
			.bottom {
				margin-top: 0;
				padding: 15rpx 15rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				align-content: center;
			
				.source_box {
					width: 200rpx;
					height: 176rpx;
					margin-bottom: 30rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					align-content: center;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					display: -webkit-box;
					white-space: normal;
					-webkit-box-orient: vertical;
				}
			
				.btn_box {
					font-size: 24rpx;
					white-space: nowrap;
			
					.btn {
						background-color: #3B00FF;
						color: #fff;
						border-radius: 20rpx;
						padding: 5rpx 15rpx;
					}
					
					.join-btn {
						color: #3B00FF;
						border: 1px solid #3B00FF;
						border-radius: 20rpx;
						padding: 5rpx 15rpx;
					}
				}
			
			}
		}
	}
</style>