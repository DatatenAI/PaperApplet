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
					<view class="content">
						<view class="title" @click="navTo(`/pages/applications/conference/detail?id=${item.id}`)" v-if="item.id">
							{{ item.id }}总结
						</view>
					</view>
					<view class="thumb" @click="navTo(`/pages/applications/conference/detail?id=${item.id}`)" v-if="item.id">
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
					{id: "ICML2023"},
					{id: "CVPR2023"},
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
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			// align-content: center;
			background-color: #fff;
			width: 90%;

			margin-bottom: 30rpx;
			border: 1px solid #333; 
			border-radius: 12rpx;
			// padding: 20rpx 15rpx;
	
			.content {
				width: calc(100% - 150rpx);
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background-color: #fff;
	
				.title {
					// height: 120rpx;
					color: #333;
					font-size: 16px;
					word-break: normal;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					// margin-bottom: 10rpx;
				}
			}
	
			.thumb {
				width: 150rpx;
				height: 150rpx;
				padding: 5rpx 5rpx;
				image {
					width: 100%;
					height: 100%;
				}
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
	

</style>