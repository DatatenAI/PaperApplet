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
		<!-- <uni-swiper-dot class="uni-swiper-dot-box" :info="dataImage" :current="current" field="content">
			<swiper class="swiper-box" :current="swiperDotIndex" @change="changeSwiper">
				<swiper-item v-for="(item, index) in dataImage" :key="index">
					<view class="swiper-item" @click="clickBannerItem(item)">
						<image :src="item.image" mode="aspectFill" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
 -->
		<view class="content">
			<view class="information">
				<view class="title">
					{{data.title}}
				</view>
				<view class="infobox">
					<view class="box1 left">
						<text class="label">来源：</text>
						<text class="value">{{data.authors}}</text>
					</view>
					<view class="box1 time">
						<text class="label">时间：{{data.createTime | formatDate}}</text>
						<text class="value"></text>
					</view>
					<!-- <view class="box1 author">
				    <text class="label">作者：</text>
				    <text class="value">{{data.writer}}</text>
				</view> -->
				</view>
				<view class="contentbox">
					<u-parse :content="data.summary[0].content" :tag-style="style"></u-parse>
				</view>
			</view>
		</view>

		<view class="fun_btn">
			<view class="left">
				<view class="item">
					<button id="shareBtn" open-type="share">
						<uni-icons type="redo" size="24" color="#333"></uni-icons>
						<text>
							分享
						</text>
					</button>
				</view>
			</view>
			<view class="right">
				<view class="item" @click="doLike()" v-if="!data.likeFlag">
					<uni-icons type="hand-up" size="24" color="#333"></uni-icons>
					<text>点赞</text>
				</view>
				<view class="item" @click="doLike()" v-else>
					<uni-icons type="hand-up" size="24" color="#3B00FF" ></uni-icons>
					<text>取消点赞</text>
				</view>
				<view class="item" @click="toggle('bottom')" v-if="!data.favoriteFlag">
					<uni-icons type="star" size="24" color="#333"></uni-icons>
					<text>收藏</text>
				</view>
				<view class="item" @click="doFavorite()" v-else>
					<uni-icons type="star" size="24" color="#3B00FF"></uni-icons>
					<text>取消收藏</text>
				</view>
			</view>
		</view>

		<!-- 普通弹窗  @click="doFavorite()"-->
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<uni-section title="收藏夹" type="line">
					<uni-list>
						<uni-list-item :title="item.name" v-for="item in albumList" clickable showArrow @click="doFavorite(item.id)"/>
					</uni-list>
				</uni-section>
			</view>
		</uni-popup>
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
		cancelLike,
		addFavoritePaper,
		scarchFavorite,
		cancelFavorite
	} from '@/api/home/index.js'

	import config from '@/config.js';

	import uParse from '@/components/u-parse/u-parse.vue';

	export default {
		components: {
			uParse
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
				current: 0,
				swiperDotIndex: 0,
				dataImage: [{
						image: '/static/banner/banner011.jpg'
					},
					{
						image: '/static/banner/banner022.jpg'
					},
					{
						image: '/static/banner/banner033.jpg'
					}
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
				// data: {
				// 	avatar: 'http://vue.ruoyi.vip/static/img/profile.473f5971.jpg',
				// 	title: '测试通知',
				// 	source: '筑园科技',
				// 	isJoin: true,
				// 	createTime: '2023.6.12',
				// 	content: '通知公告通知公告通知公告通知公告通知公告通知公告通知公告通知公告',
				// 	collectionStatus: '',
				// },
				albumList: [],
				data: {

				},
				id: '',
			}
		},
		onLoad(options) {
			wx.showShareMenu({
				withShareTicket: true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus: ["shareAppMessage", "shareTimeline"]
			})
			this.id = options.id;
			var that = this;
			that.user = JSON.parse(getUser()) || {}
			that.getArticles();
			that.getScarchFavorite();
			// this.getNews();
		},
		onShow() {

		},
		created() {},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: that.data.title, //分享的名称
				path: '/pages/home/detail/detail',
				// imageUrl: `${that.data.thumb}`, // 封面图
				// mpId:config.appId //此处配置微信小程序的AppId
			}
		},
		//分享到朋友圈
		onShareTimeline(res) {
			return {
				title: that.data.title,
				type: 0,
				summary: "",
			}
		},
		methods: {
			change(e) {
				console.log('当前模式：' + e.type + ',状态：' + e.show);
			},
			toggle(type) {
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			doLike() {
				var that = this;
				if (!that.data.likeFlag) {
					addLike({
						userId: that.user.id || '',
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
					}).then(response => {
						that.data.likeFlag = true;
						that.$modal.msg('点赞成功');
					})
				} else {
					cancelLike({
						userId: that.user.id || '',
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
					}).then(response => {
						that.data.likeFlag = false;
						that.$modal.msg('取消点赞成功');
					})
				}

			},
			doFavorite(id) {
				var that = this;
				if(!that.data.favoriteFlag){
					addFavoritePaper({
						userId: that.user.id || '',
						openId: that.user.openId || '',
						paperId: parseInt(that.data.id),
						favoriteId:parseInt(id),
						source:'微信小程序'
					}).then(response => {
						that.data.favoriteFlag = true;
						that.$modal.msg('收藏成功');
						that.$refs.popup.close();
					})	
				}else{
					cancelFavorite({
						userId: that.user.id || '',
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
					userId: that.user.id || '',
					openId: that.user.openId || '',
				}).then(response => {
					that.albumList = response;
				})
			},
			getArticles() {
				var that = this;
				paperDetail({
					userId: that.user.id || '',
					openId: that.user.openId || '',
					paperId: parseInt(that.id),
				}).then(response => {
					that.data = response;

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
			margin-right: 10rpx;

			text {
				margin-right: 5rpx;
			}
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
</style>