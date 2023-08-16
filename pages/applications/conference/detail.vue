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

		<view class="content">
			<view class="information">
				<view class="title hr">
					{{data.conference}}合集
				</view>
			</view>
		</view>
		<uni-transition ref="ani" :mode-class="animationSetting[0].modeClass" :show="animationSetting[0].show">
			<view class="list">
				<view class="item" v-for="(item,index) in conference_list">
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
			
			<view class="nodata" v-if="conference_list.length == 0">
				<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/nodata.svg" mode="widthFix"></image>
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
		searchPaper,
		addRead,
		cancelRead
	} from '@/api/home/index.js'
	import {
		searchConferencePaper
	} from '@/api/applications/index.js'

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
					return time.substr(0, 19).replace('T', ' ').replace(/-/g, '.');
				}
			},
		},
		data() {
			return {
				config:config,
				animationSetting: [{
					name: '',
					duration: 1000,
					show: true,
					modeClass: [],
				}],
				query: {
					keywords: '',
					pageNum: 1,
					pageSize: 10
				},
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
				conference_list: [],
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
			that.data.conference = options.id;
			if (getUser()) {
				that.user = JSON.parse(getUser()) || {}
			}
			that.getArticles();
		},
		onShow() {

		},
		created() {},
		methods: {
			change(e) {
				console.log('当前模式：' + e.type + ',状态：' + e.show);
				this.conference_list = [];
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
						that.conference_list[index].waitFlag = true;
					})
				} else {
					cancelRead({
						paperId: parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('取消待阅成功');
						that.conference_list[index].waitFlag = false;
					})
				}
			},
			getArticles() {
				var that = this;
				console.log("Running conference of", that.data.conference);
				searchConferencePaper({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					conference: that.data.conference,
					pageNum: that.query.pageNum,
					pageSize: that.query.pageSize,
				}).then(response => {
					that.conference_list = that.conference_list.concat(response);
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
		background: #efefef;
		// padding-bottom: 100rpx;
	}
	
	.information {
		width: 100%;
		// padding: 24rpx 24rpx;
		background: #efefef;
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
	}

	
	.list {
		position: relative;
		column-count: 2;
		column-gap: 30rpx;
		// padding-top: 150rpx;
	
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
	
</style>