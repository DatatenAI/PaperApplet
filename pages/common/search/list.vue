<template>
	<view class="page">
		<view class="list">
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
		cancelRead
	} from '@/api/home/index.js'
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
				list: [],
				user: {},
				query: {
					keywords: '',
					pageNum: 1,
					pageSize: 10
				},
			}
		},
		onLoad(option){
			var that = this;
			that.query.keywords = option.keyword || '';
		},
		onShow() {
			var that = this;
			that.tabIndexStatus = false;
			that.list = [];
			if(getUser()){
				that.user = JSON.parse(getUser()) || {}
			}
			that.getArticles();
			// that.getSubscribe();
			// that.getMySubscribe();
		},
		onReady() {

		},
		// 下拉到底部后加载新数据
		onReachBottom() {
			var that = this;
			that.query.pageNum++; //页数加一
			that.getArticles(); //回调接口
		},
		methods: {
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
			doRead(index,id,status){
				
				var that = this;
				if(!that.user.id|| !that.user.openId){
					that.$modal.msg('请登录');
					return false;
				}
				if(status){
					addRead({
						paperId:parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('添加待阅成功');
						that.list[index].waitFlag = true;
					})
				}else{
					cancelRead({
						paperId:parseInt(id),
						userId: that.user.id || null,
						openId: that.user.openId || '',
					}).then(response => {
						that.$modal.msg('取消待阅成功');
						that.list[index].waitFlag = false;
					})
				}
			},
			navTo(url) {
				this.$tab.navigateTo(url)
			}
		}
	}
</script>

<style lang="scss">
	.list {
		position: relative;
		column-count: 2;
		column-gap: 30rpx;
		padding-top: 20rpx;
	
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
					white-space:normal;
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