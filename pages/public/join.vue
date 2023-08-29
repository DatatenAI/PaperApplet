<template>
	<view class="page">
		<view class="item">
			<view class="uni-icon">
				<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/wechat.png" mode="widthFix">
			</view>
			<view class="content" @click="toggle('center', 'wechat-popup')">
				<view class="name">微信群</view>
				<view class="remark">点击显示二维码</view>
			</view>
		</view>
		<view class="item">
			<view class="uni-icon">
				<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/QQ.png" mode="widthFix">
			</view>
			<view class="content" @click="toggle('center', 'qq-popup')">
				<view class="name">QQ群</view>
				<view class="remark">点击显示二维码</view>
			</view>
		</view>
		<uni-popup ref="wechat-popup" background-color="#fff">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/wechat.png" mode="widthFix">
			</view>
		</uni-popup>
		<uni-popup ref="qq-popup" background-color="#fff">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/QQ.png" mode="widthFix">
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import config from '@/config'

	import {
		getUser,
		setUser,
		removeUser,
	} from '@/utils/auth'
	import {
		searchCommunication
	} from '@/api/mine/index.js'
	export default {
		data() {
			return {
				uploadStaticUrl: config.uploadStaticUrl,
				staticUrl: config.staticUrl,
				query: {
					pageNum: 1,
					pageSize: 10
				},
				list: [
					{imgUrl: "",
					 title: "微信群",
					 remark: "+++++++"
					}, 
					{imgUrl: "",
					 title: "QQ群",
					 remark: "+++++++"
					}
				],
			}
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
		onLoad() {
			var that = this;

			// that.getSubscribe();

		},
		onShow() {
			var that = this;
			that.list = [];
			that.query = {
				pageNum: 1,
				pageSize: 10
			};
			if(getUser()){
				that.user = JSON.parse(getUser()) || {}
			}
			that.getJoinList();
		},
		// 下拉到底部后加载新数据
		onReachBottom() {
			var that = this;
			// 判断下一页是否存在数据，不存在将显示暂无数据等提示语
			// if (that.activityList.length == that.query.total) {
			// 	that.noMoreData = true;
			// 	return false;
			// }
			that.query.pageNum++; //页数加一
			that.getJoinList(); //回调接口

		},
		methods: {
			toggle(type, popup_ref) {
				var that = this;
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs[popup_ref].open(type)
			},
			copyURL(mytext) {
				var that = this;
			    try {
					uni.setClipboardData({
						data: mytext,
						success: () => {
							that.$modal.msg('已复制');
						}
					})
			    } catch($e) {
					that.$modal.msg('复制失败');
					console.log($e);
			    }
			  },
			getJoinList() {
				var that = this;
				searchCommunication({
					// pageNum: that.queryRead.pageNum,
					// pageSize: that.queryRead.pageSize,
				}).then(response => {
					that.list = that.list.concat(response);
				})
			},
			call(tel) {
				uni.makePhoneCall({
					phoneNumber: tel,
					success: function() {
						console.log('拨打电话成功');
					},
					fail() {
						console.log('打电话失败了');
					}
				})
			},
			//下一页
			navToPage(url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 2rpx solid #f0f0f0;
		border-top: 2rpx solid #f0f0f0;

		.uni-icon {
			image {
				width: 100rpx;
				height: 100rpx;
			}
		}

		.content {
			.name {
				font-size: 28rpx;
			}

			.remark {
				font-size: 28rpx;
				margin-top: 20rpx;
				opacity: 0.5;
			}
		}
	}
</style>