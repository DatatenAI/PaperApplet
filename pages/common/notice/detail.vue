<template>
	<view class="page">
		<view class="information">
			<view class="title">
				{{data.title || ''}}
			</view>
			<view class="infobox">
				<!-- <view class="box1 left">
					<text class="label">来源：</text>
					<text class="value">{{news.source}}</text>
				</view> -->
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
				<u-parse :content="data.content" :tag-style="style"></u-parse>
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
		informDetail
	} from '@/api/home/index.js';
	import config from '@/config.js';
	import uParse from '@/components/u-parse/u-parse.vue';
	// import {newsDetail} from '@/api/index.js'
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
				uploadStaticUrl:config.uploadStaticUrl,
				style: {
					// 字符串的形式
					p: 'color: #333;font-size:28rpx;',
					img: 'display:block;width:100%;',
					video: 'width:100%;',
					span: 'font-size: 28rpx;color: #333;'
				},
				user:{},
				// data: {
				// 	title: '测试通知',
				// 	source: '',
				// 	createTime: '2023.6.12',
				// 	content: '通知公告通知公告通知公告通知公告通知公告通知公告通知公告通知公告',
				// 	collectionStatus: '',
				// },
				data:{},
				id: '',
			}
		},
		onLoad(options) {
			var that = this;
			this.id = options.id
			that.user = JSON.parse(getUser()) || {}
			that.getNotice();
		},
		created() {},
		methods: {
			getNotice(){
				var that = this;
				informDetail({
					// userId: that.user.id || '',
					// openId: that.user.openId || '',
					// keywords: that.query.keywords,
					// pageNum: that.query.pageNum,
					// pageSize: that.query.pageSize,
					id:that.id
				}).then(response => {
					that.data = response;
				})
			},
		},
		onUnload() {
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
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
			flex-wrap:wrap;
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
			.box1{
				display:flex;
				.value{
					flex:1;
					word-break: break-all;
				}
			}
			.left {
				// width:55%;
				margin-bottom:10rpx;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// display: -webkit-box;
				// -webkit-line-clamp: 1;
				// word-break: break-all;
				// -webkit-box-orient: vertical;
			}
			.time{
				// width:45%;
				margin-bottom:10rpx;
				text-align: right;
			}
			.author{
				width:100%;
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9;
		bottom: 0;
		width: 100%;
		padding: 24rpx;
		background: #FFFFFF;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		.btns {
			flex: 1;
		}
		.btn-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			image {
				width: 36rpx;
				height: 36rpx;
			}
			text {
				font-size: 24rpx;
				font-weight: 500;
				color: #333333;
				line-height: 45rpx;
			}
		}
		.shareicon {
			position: relative;
			margin-left: 10px;
			#shareBtn {
				height: 100%;
				position: absolute;
				left: 50rpx;
				right: 50rpx;
				top: 0;
				opacity: 0;
			}
		}

	}
</style>
