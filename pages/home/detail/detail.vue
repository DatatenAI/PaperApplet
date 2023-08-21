<template>
	<view class="page-custom">
		<!-- <view class="bottom">
			<view class="source_box">
				<image :src="data.avatar" mode="widthFix" class="avatar"></image>
				<text>{{ data.source }}</text>
			</view>
			<view class="btn_box">
				<view class="btn" v-if="data.isJoin">关注</view>
				<view class="join-btn" v-else>已关注</view>
			</view>
		</view> -->
		<!-- 轮播图 -->
		<uni-swiper-dot class="uni-swiper-dot-box" :info="dataImage" :current="current" field="content" v-if="dataImage.length > 0" :style="{height:Math.floor(dataImageHeight[current]) + 'px' || auto  }" :title="dataImageHeight[current]">
			<swiper class="swiper-box" :current="swiperDotIndex" @change="changeSwiper">
				<swiper-item v-for="(item, index) in dataImage" :key="index">
					<view class="swiper-item" @click="clickBannerItem(item)">
						<image :src="config.staticUrl + data.pdfHash + '/' + item.trim()" mode="aspectFill" :draggable="false" @load="imageLoad" :id="'img'+index" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>

		<view class="content">
			<view class="information">
				<view class="title hr">
					{{data.title}}
				</view>
				<view class="title" v-if="data.summary[0]" style="color: #c8a48c;font-weight: 100;">
					{{data.summary[0].titleZh}}
				</view>
				<view class="infobox">
					<view class="box1 left">
						<text class="label">作者：</text>
						<text class="value">{{data.authors}}</text>
					</view>
					<view class="box1 time">
						<text class="label">时间：{{data.pubTime | formatDate}}</text>
						<text class="value"></text>
					</view>
					<!-- <view class="box1 author">
				    <text class="label">作者：</text>
				    <text class="value">{{data.writer}}</text>
				</view> -->
				</view>
				<view class="contentbox">
					<!-- <u-parse :content="data.summary[0].content" :tag-style="style"></u-parse> -->
					<!-- <MDParserHighlight :resource="data.summary[0].basicInfo"></MDParserHighlight>
					<MDParserHighlight :resource="data.summary[0].briefIntroduction"></MDParserHighlight> -->
					<MDParserHighlight :resource="data.summary[0].content"></MDParserHighlight>
				</view>
				<!-- <view class="pdf-icon"
					@click="navTo(`/pages/common/webview/index?url=https://chatwithpaper.oss-cn-hongkong.aliyuncs.com/uploads/${data.pdfHash}.pdf&title=${data.summary[0].titleZh}`)"> -->
				<view class="pdf-icon"
					@click="openPDF(`https://chatwithpaper.oss-cn-hongkong.aliyuncs.com/uploads/${data.pdfHash}.pdf`)">
					<image :src="'https://chatwithpaper.oss-cn-hongkong.aliyuncs.com/weixin/pdf-icon.png'"
						mode="widthFix"></image>
					<text>{{data.summary[0].titleZh || ''}}.pdf</text>
				</view>
			</view>
		</view>

		<view class="fun_btn">
			<view class="left">
				<view class="item">
					<!-- <button id="shareBtn" open-type="share" >
						<uni-icons type="redo" size="24" color="#333"></uni-icons>
						<text>
							分享
						</text>
					</button> -->
					<button id="shareBtn" @click="shareEvn()">
						<uni-icons type="redo" size="24" color="#333"></uni-icons>
						<text>
							分享
						</text>
					</button>
				</view>
			</view>
			<view class="right">
				<view class="item" @click="doLike()" v-if="data.likeFlag != 2">
					<uni-icons type="hand-up" size="30" color="#333"></uni-icons>
					<!-- <text>点赞</text> -->
				</view>
				<view class="item" @click="doLike()" v-if="data.likeFlag == 2">
					<uni-icons type="hand-up-filled" size="30" color="#3B00FF"></uni-icons>
					<!-- <text>取消点赞</text> -->
				</view>
				
				<view class="item" @click="doDislike()" v-if="data.likeFlag != 1">
					<uni-icons type="hand-down" size="30" color="#333"></uni-icons>
					<!-- <text>点踩</text> -->
				</view>
				<view class="item" @click="doDislike()" v-if="data.likeFlag == 1">
					<uni-icons type="hand-down-filled" size="30" color="#3B00FF"></uni-icons>
					<!-- <text>取消点踩</text> -->
				</view>
				
				<view class="item" @click="toggle('bottom')" v-if="!data.favoriteFlag">
					<uni-icons type="star" size="30" color="#333"></uni-icons>
					<!-- <text>收藏</text> -->
				</view>
				<view class="item" @click="doFavorite()" v-else>
					<uni-icons type="star-filled" size="30" color="#3B00FF"></uni-icons>
					<!-- <text>取消收藏</text> -->
				</view>
			</view>
		</view>

		<!-- 普通弹窗  @click="doFavorite()"-->
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<uni-section title="收藏夹" type="line">
					<uni-list>
						<uni-list-item :title="item.name" v-for="item in albumList" clickable showArrow
							@click="doFavorite(item.id)" />
					</uni-list>
				</uni-section>
			</view>
		</uni-popup>

		<!-- 分享弹窗-->
		<view class="share-pro">
			<view class="share-pro-mask" v-if="deliveryFlag"></view>
			<view class="share-pro-dialog" :class="deliveryFlag ? 'open' : 'close'">
				<view class="close-btn" @click="handleClose">
					<span class="font_family"><uni-icons type="closeempty" size="24"></uni-icons></span>
				</view>
				<view class="share-pro-title">分享</view>
				<view class="share-pro-body">
					<view class="share-item">
						<button open-type="share">
							<view class="font_family share-icon"><uni-icons type="weixin" size="30"
									color="#42ae3c"></uni-icons></view>
						</button>
						<view>分享给好友</view>
					</view>
					<!-- <view class="share-item" @tap="handleShowPoster">
						<button open-type="share">
							<view class="font_family share-icon"><uni-icons type="pyq" size="30"
									color="#42ae3c"></uni-icons></view>
						</button>
						<view>分享给朋友圈</view>
					</view>
					<view class="share-item" @tap="handleShowPoster">
						<button open-type="share">
							<view class="font_family share-icon"><uni-icons type="star" size="30"
									color="#42ae3c"></uni-icons></view>
						</button>
						<view>收藏</view>
					</view> -->
					<view class="share-item" @click="navToAuth(`/pages/common/webview/index?userId=${user.id}&openId=${user.openId}&id=${data.id}`)">
						<button>
							<view class="font_family share-icon"><uni-icons type="images" size="30"
									color="#ff5f33"></uni-icons></view>
						</button>
						<view>生成海报</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- <XQ-GeneratePoster ref="draw" class="poster_box" /> -->
	</view>
</template>

<script>
	import {
		getUser,
		setUser,
		removeUser,
	} from '@/utils/auth'
	import {
		paperDetail,
		addLike,
		addDislike,
		updateLike,
		cancelLike,
		addFavoritePaper,
		scarchFavorite,
		cancelFavorite
	} from '@/api/home/index.js'

	import config from '@/config.js';

	import uParse from '@/components/u-parse/u-parse.vue';
	import MDParserHighlight from '@/pages/home/components/cmder-MDParserHighlight/index.vue';
	// import XQGeneratePoster from '@/pages/home/components/XQGeneratePoster/XQGeneratePoster.vue';
	export default {
		components: {
			uParse,
			MDParserHighlight,
			// XQGeneratePoster
		},
		filters: {
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
		data() {
			return {
				config:config,
				dataImageHeight:[],
				deliveryFlag: false, //
				current: 0,
				swiperDotIndex: 0,
				dataImage: [
					// {
					// 	image: '/static/banner/banner011.jpg'
					// },
					// {
					// 	image: '/static/banner/banner022.jpg'
					// },
					// {
					// 	image: '/static/banner/banner033.jpg'
					// }
				],
				user: {},
				uploadStaticUrl: config.uploadStaticUrl,
				style: {
					// 字符串的形式
					p: 'color: #333;font-size:28rpx;',
					img: 'display:block;width:100%;',
					video: 'width:100%;',
					span: 'font-size: 28rpx;color: #333;'
				},
				config:config,
				// data: {
				// 	avatar: 'http://vue.ruoyi.vip/static/img/profile.473f5971.jpg',
				// 	title: '测试通知',
				// 	source: 'chatPaper',
				// 	isJoin: true,
				// 	createTime: '2023.6.12',
				// 	content: '通知公告通知公告通知公告通知公告通知公告通知公告通知公告通知公告',
				// 	collectionStatus: '',
				// },
				albumList: [],
				data: {

				},
				id: '',
				// option: {
				// 	//绘制海报内容
				// 	codeUrl: 'https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/37879ea971cf0d01783dd34f7340ef8.jpg', //小程序太阳码
				// 	// codeUrl: '/static/tym.jpg', //小程序太阳码
				// 	coverUrl: '', //题库图片
				// 	headUrl: 'https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/6d24bf98fe41c34ccfcb66f27f8f776.png', //头像
				// 	// bgUrl: 'https://pic3.zhimg.com/v2-8fbde0f9ac6a19a23aa839e73394618a_b.jpg', //图片背景填充，和 fillStyle 只能传一个，bgUrl 优先级高于 fillStyle
				// 	fillStyle: '#0688ff', //纯色背景填充颜色
				// 	nickName: 'UNDEFINED', //授权登录的用户名
				// 	miniName: '量拾', //小程序名称
				// 	tkName:
				// 		'题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称~~', //题库名称
				// 	tkAuthor:
				// 		'题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者', //题库作者
				// 	tkType: '', //题库类型
				// 	cost: '', //是否需要收费   免费/付费
				// 	isPub: '' //公开 还是 私有
				// }
			}
		},
		onLoad(options) {
			// console.log("详情页：" + JSON.stringify(options));
			wx.showShareMenu({
				withShareTicket: true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus: ["shareAppMessage", "shareTimeline"]
			})
			this.id = options.id;
			var that = this;
			if (getUser()) {
				that.user = JSON.parse(getUser()) || {}
			}
			that.getArticles();
			that.getScarchFavorite();
			// this.getNews();
		},
		onShow() {

		},
		created() {},
		onShareAppMessage(res) {
			var that = this;
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})


			// return {
			// 	title: that.data.title, //分享的名称
			// 	path: `/pages/home/detail/detail?id=${that.data.id}`,
			// 	// imageUrl: `${that.data.thumb}`, // 封面图
			// 	// mpId:config.appId //此处配置微信小程序的AppId
			// }
		},
		//分享到朋友圈
		onShareTimeline(res) {
			var that = this;
			return {
				title: that.data.title,
				query: `/pages/home/detail/detail?id=${that.data.id}`,
				type: 0,
				summary: "",
			}
		},
		//收藏
		onAddToFavorites: function(options) {
			return {
				title: that.data.title,
				// imageUrl: '图片路径',
				query: `/pages/home/detail/detail?id=${that.data.id}`,
			}
		},
		methods: {
			imageLoad: function(e) {
				var _this = this;
				/* 图片容器的id */
				var id = e.currentTarget.id;
				/* 图片容器对应数组数据的索引 */
				var index = id.substr(3);
				/* 图片容器对应的数据 */
				var item = _this.dataImage[index];
				/* 查询图片容器的宽度 */
				const query = uni.createSelectorQuery().in(this);
				query.select('#' + id).boundingClientRect(data => {
					/* 计算图片容器的宽度 */
					_this.dataImageHeight[index] = data.width * e.detail.height / e.detail.width;
					console.log(JSON.stringify(_this.dataImageHeight));
					/* 强制刷新。如不强制刷新，则图片容器高度不会改变 */
					_this.$forceUpdate();
				}).exec();
			},
			share_qrcode() {
				this.$refs.draw.share_qrcode(this.option);
			},
			/**
			 * @description: 分享弹窗
			 * @param {type}
			 * @return {type}
			 * @author: hch
			 */
			shareEvn(type) {
				
				this.deliveryFlag = true
			},
			/**
			 * @description: 关闭分享弹窗
			 * @param {type}
			 * @return {type}
			 * @author: hch
			 */
			handleClose() {
				this.deliveryFlag = false
			},
			openPDF(url) {
				var that = this;
				switch (uni.getSystemInfoSync().platform) {
					case "android":
						console.log("安卓");
						// 这里直接调用原生的方法，我们上面定义的
						that.androidOpenPdf(url);
						break;
					case "ios":
						console.log("IOS");
						//这里跳转web-view页面
						that.navTo(`/pages/common/webview/index?url=${url}&title=${that.data.summary[0].titleZh}`);
						break;
					default:
						that.androidOpenPdf(url);
						break;
				}
			},
			androidOpenPdf(url) {
				uni.downloadFile({
					url: url,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							success: function(res) {
								console.log("打开文档成功");
							},
						});
					},
				});
			},
			change(e) {
				console.log('当前模式：' + e.type + ',状态：' + e.show);
			},
			toggle(type) {
				var that = this;
				if (!that.user.id || !that.user.openId) {
					that.$modal.msg('请登录');
					return false;
				}
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			doLike() {
				var that = this;
				if (!that.user.id || !that.user.openId) {
					that.$modal.msg('请登录');
					return false;
				}

				if (that.data.likeFlag == 0) {
					addLike({
						userId: that.user.id || null,
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
					}).then(response => {
						that.data.likeFlag = 2;
						that.$modal.msg('点赞成功');
					})
				} else if (that.data.likeFlag == 1) {
					updateLike({
						userId: that.user.id || null,
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
						like: true
					}).then(response => {
						that.data.likeFlag = 2;
						that.$modal.msg('点赞成功');
					})
				} else {
					cancelLike({
						userId: that.user.id || null,
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
					}).then(response => {
						that.data.likeFlag = 0;
						that.$modal.msg('取消点赞成功');
					})
				}

			},
			doDislike() {
				var that = this;
				if (!that.user.id || !that.user.openId) {
					that.$modal.msg('请登录');
					return false;
				}
			
				if (that.data.likeFlag == 0) {
					addDislike({
						userId: that.user.id || null,
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
					}).then(response => {
						that.data.likeFlag = 1;
						that.$modal.msg('点踩成功');
					})
				} else if (that.data.likeFlag == 2) {
					updateLike({
						userId: that.user.id || null,
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
						like: false
					}).then(response => {
						that.data.likeFlag = 1;
						that.$modal.msg('点踩成功');
					})
				} else {
					cancelLike({
						userId: that.user.id || null,
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
					}).then(response => {
						that.data.likeFlag = 0;
						that.$modal.msg('取消点踩成功');
					})
				}
			
			},
			doFavorite(id) {
				var that = this;
				if (!that.user.id || !that.user.openId) {
					that.$modal.msg('请登录');
					return false;
				}
				if (!that.data.favoriteFlag) {
					addFavoritePaper({
						userId: that.user.id || null,
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
						favoriteId: parseInt(id),
						source: '微信小程序'
					}).then(response => {
						that.data.favoriteFlag = true;
						that.$modal.msg('收藏成功');
						that.$refs.popup.close();
					})
				} else {
					cancelFavorite({
						userId: that.user.id || null,
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
						// favoriteId:parseInt(id),
					}).then(response => {
						that.data.favoriteFlag = false;
						that.$modal.msg('取消收藏成功');
					})
				}

			},
			getScarchFavorite() {
				var that = this;
				scarchFavorite({
					userId: that.user.id || null,
					openId: that.user.openId || '',
				}).then(response => {
					that.albumList = response;
				})
			},
			getArticles() {
				var that = this;
				paperDetail({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					paperId: parseInt(that.id),
				}).then(response => {
					that.data = response;
					var imgUrl = [];
					if(response.imgUrl){
						imgUrl = response.imgUrl.split(',');
					}
					that.dataImage = imgUrl;
					that.share = {
						title: that.data.title,
						path: '/pages/home/detail/detail',
					}
				})
			},
			clickBannerItem(item) {
				console.log(item)
			},
			changeSwiper(e) {
				this.current = e.detail.current
			},
			getNews() {
				var that = this;
				newsDetail({
					id: this.id
				}).then(response => {
					that.news = response.data;
				})
			},
			navTo(url) {
				this.$tab.navigateTo(url)
			},
			navToAuth(url){
				var that = this;
				if (!that.user.id || !that.user.openId) {
					that.$modal.msg('请登录');
					return false;
				}
				
				this.$tab.navigateTo(url)
			}
		},
		onUnload() {}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
		margin-top: 30rpx;
		// min-height: calc(100vh - 300rpx);
	}

	.content {
		margin-top: 30rpx;
		padding-bottom: 100rpx;
	}

	.pdf-icon {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: nowrap;
		align-content: center;
		align-items: center;
		padding: 20rpx 10rpx;
		border-radius: 10rpx;
		align-self: center;
		background-color: rgb(230, 230, 230);

		image {
			width: 84rpx;
		}

		text {
			display: block;
			max-width: calc(100% - 180rpx);
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			word-break: break-all;
			-webkit-box-orient: vertical;
		}

		view {
			width: 60rpx
		}
	}

	.information {
		width: 100%;
		padding: 24rpx 24rpx;
		background: #FFFFFF;
		box-sizing: border-box;

		.title {
			font-style: normal;
			font-weight: 550;
			font-size: 36rpx;
			line-height: 28px;
			color: #333333;
		}

		.hr {
			padding-bottom: 10rpx;
			margin-bottom: 20rpx;
			border-bottom: 1px solid #aaa;
		}

		.infobox {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			justify-content: space-between;
			font-style: normal;
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
			align-items: center;
			margin-top: 24rpx;
			padding-bottom: 24rpx;
			border-bottom: 1px solid rgb(230, 230, 230);
			margin-bottom: 24rpx;

			.box1 {
				display: flex;

				.value {
					flex: 1;
					word-break: break-all;
				}
			}

			.left {
				// width:55%;
				margin-bottom: 10rpx;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// display: -webkit-box;
				// -webkit-line-clamp: 1;
				// word-break: break-all;
				// -webkit-box-orient: vertical;
			}

			.time {
				// width:45%;
				margin-bottom: 10rpx;
				text-align: right;
			}

			.author {
				width: 100%;
			}
		}

		.contentbox {
			background: #FFFFFF;
			font-style: normal;
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			margin-bottom: 24rpx;
		}
	}

	.bottom {
		padding: 15rpx 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;

		.source_box {
			display: flex;
			flex-direction: row;
			align-items: center;
			align-content: center;

			.avatar {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
			}

			text {
				font-size: 28rpx;
				color: #333;
				margin-left: 10rpx;
				font-weight: bold;
			}
		}

		.btn_box {
			font-size: 28rpx;

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

	.swiper {
		height: 300rpx;
	}

	.swiper-box {
		height: 150px;
	}

	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		height: 300rpx;
		line-height: 300rpx;
	}

	@media screen and (min-width: 500px) {
		.uni-swiper-dot-box {
			width: 400px;
			/* #ifndef APP-NVUE */
			margin: 0 auto;
			/* #endif */
			margin-top: 8px;
		}

		.image {
			width: 100%;
		}
	}

	.fun_btn {
		padding: 0 20rpx;
		position: fixed;
		z-index: 6;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		padding-bottom: 30rpx;
		
		.right {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			align-content: center;
		}

		.item {
			display: flex;
			flex-direction: row;
			align-items: center;
			align-content: center;
			margin-right: 40rpx;
			// text {
			// 	margin-right: 5rpx;
			// }
		}
	}

	button {
		border: none;
		background: none;
		display: flex;
		align-content: center;
		align-items: center;
	}

	button::after {
		border: none;
	}

	.share-pro-dialog {
		position: relative;
		position: fixed;
		bottom: 0;
		z-index: 7;
		// width: 750rpx;
		width: 100%;
		// height: 310rpx;
		padding-bottom: 20rpx;
		overflow: hidden;
		background-color: #fff;
		border-radius: 24rpx 24rpx 0 0;
		box-sizing: border-box;

		.close-btn {
			position: absolute;
			top: 0rpx;
			right: 29rpx;
			padding: 20rpx 15rpx;
		}

		.share-pro-title {
			padding: 28rpx 41rpx;
			font-size: 28rpx;
			color: #1c1c1c;
			background-color: #f7f7f7;
		}

		.share-pro-body {
			display: flex;
			font-size: 28rpx;
			color: #1c1c1c;
			flex-direction: row;
			justify-content: space-around;

			.share-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				justify-content: space-around;
				text-align: center;
				button {
					height: 80rpx;
				}

				.share-icon {
					// margin-top: 39rpx;
					// margin-bottom: 16rpx;
					// font-size: 70rpx;
					color: #42ae3c;
					text-align: center;
				}

				&:nth-child(2) {
					.share-icon {
						color: #ff5f33;
					}
				}
			}
		}
	}

	/* 显示或关闭内容时动画 */

	.open {
		transform: translateY(0);
		transition: all 0.3s ease-out;
	}

	.close {
		transform: translateY(310rpx);
		transition: all 0.3s ease-out;
	}
	.poster_box{
		position: fixed;
		z-index: 3;
		top:0;
		left:0;
		width: 100%;
		height: calc(100vh - 100rpx);
		// background-color: #f5f8fa;
	}
</style>