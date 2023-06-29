<template>
	<view class="page">
		<view class="notice">
			<view class="notice-item" v-for="item in announceList">
				<text class="time">{{item.createTime | formatDate}}</text>
				<view class="content" @click="navTo(`/pages/common/notice/detail?id=${item.id}`)">
					<text class="title">{{item.title}}</text>
					<view class="bot b-t">
						<text>查看详情</text>
						<uni-icons type="forward" size="18"  color="#666"></uni-icons>
					</view>
				</view>
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
		searchInform
	} from '@/api/home/index.js';
	export default {
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
				announceList:[],
				user: {},
				query: {
					keywords: '',
					pageNum: 1,
					pageSize: 10
				},
			}
		},
		onShow() {
			var that = this;
			that.announceList = [];
			that.user = JSON.parse(getUser()) || {}
			that.getNotice();
			// that.getSubscribe();
			// that.getMySubscribe();
		},
		onReady() {
		
		},
		// 下拉到底部后加载新数据
		onReachBottom() {
			var that = this;
			that.query.pageNum++; //页数加一
			that.getNotice(); //回调接口
		},
		methods: {
			getNotice() {
				var that = this;
				searchInform({
					// userId: that.user.id || '',
					// openId: that.user.openId || '',
					// keywords: that.query.keywords,
					pageNum: that.query.pageNum,
					pageSize: that.query.pageSize,
				}).then(response => {
					that.announceList = that.announceList.concat(response);
				})
			},
			navTo(url) {
				this.$tab.navigateTo(url)
			}
		}
	}
</script>

<style lang="scss">
	.notice{
		padding-bottom: 40rpx;
	}
	.time{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		padding-top: 10rpx;
		font-size: 28rpx;
		color: #999;
	}
	.content{
		width: 100%;
		padding: 30rpx 20rpx;
		background-color: #fff;
		border-radius: 2rpx;
		
		.title{
		    display: flex;
		    align-items: center;
		    font-size: 32rpx;
		    color: #333;	
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;
		}
		.bot {
			margin-top: 20rpx;
		    display: flex;
		    align-items: center;
		    justify-content: space-between;
		    font-size: 28rpx;
		    color: #666;
		    position: relative;
		}
	}
</style>
