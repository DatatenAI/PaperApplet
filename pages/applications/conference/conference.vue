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
		<!-- <view class="content">
			<view class="information">
				<view class="title hr">
					{{data.id}}
				</view>
			</view>
		</view> -->
		<uni-transition ref="ani" :mode-class="animationSetting[0].modeClass" :show="animationSetting[0].show">
			<view class="list_1"  v-if="tbrList.length > 0">
				<!-- @touchstart="touchStart" @touchend="touchEnd" -->
				<view class="item" v-for="(item,index) in tbrList">
					<view class="content" @click="navTo(`/pages/applications/conference/detail?id=${item.id}&year=${item.year}`)">
						<view class="title" v-if="item.id">
							{{ item.id }}合集
						</view>
						<view class="bottom" v-if="item.id">
							{{ item.full_name }}
						</view>
					</view>
					<view class="thumb" @click="navTo(`/pages/applications/conference/detail?id=${item.id}&year=${item.year}`)" v-if="item.id">
						<!-- <image
							:src="config.staticUrl + item.paperInfo.pdfHash + '/' + item.paperInfo.imgUrl.split(',')[0]"
							mode="widthFix"></image> -->
						<image
							src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/app_star.png"
							mode="widthFix"></image>
					</view>
				</view>
				
				
				<view class="nodata" v-if="tbrList.length == 0">
					<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/nodata.svg" mode="widthFix"></image>
				</view>
			</view>
		</uni-transition>
		

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
				animationSetting: [{
					name: '',
					duration: 1000,
					show: true,
					modeClass: [],
				}],
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
					id: "顶会总结"
				},
				
				id: '',
				tbrList: [
					{id: "ICML", full_name:"International Conference on Machine Learning"},
					{id: "CVPR", full_name:"Computer Vision and Pattern Recognition"},
					{id: "ICLR", full_name:"International Conference on Learning Representations"},
				]
			}
		},
		onLoad(options) {
			console.log("详情页：" + JSON.stringify(options));
			// wx.showShareMenu({
			// 	withShareTicket: true,
			// 	//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
			// 	menus: ["shareAppMessage", "shareTimeline"]
			// })
			this.id = options.id;
			var that = this;
			// that.data.id = options.id;
		},
		onShow() {

		},
		created() {},
		methods: {
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

		// .hr {
		// 	padding-bottom: 10rpx;
		// 	margin-bottom: 20rpx;
		// 	border-bottom: 1px solid #aaa;
		// }
	}
	
	.list_1 {
		position: relative;
		padding-top: 84rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		// width: 90%;
	
		.item {
			// display: flex;
			// flex-direction: row;
			
			// justify-content: space-between;
			// align-items: center;
			// align-content: center;
			
			// background-color: #fff;
			width: 90%;

			// margin-bottom: 30rpx;
			border: 2px solid #333; 
			border-radius: 6rpx;
			// border-radius: 15rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			align-content: center;
			background-color: #fff;
			margin-bottom: 30rpx;
			// padding: 20rpx 15rpx;
			// padding: 20rpx 15rpx;
	
			.content {
				width: calc(100% - 220rpx);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				background-color: #fff;
				
				.title {
					// height: 120rpx;
					color: #333;
					word-break: normal;
					font-size: 30rpx;
					font-weight: bold;
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
				width: 220rpx;
				height: 220rpx;
				padding: 30rpx 30rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	

</style>