<template>
	<view class="official">
		<view class="top">
			<view class="logo">
				<image src="/static/logo200.png" mode="widthFix">
			</view>
			<view class="name">
				<view class="title">
					量拾
				</view>
				<view class="title1">
					量拾公众号
				</view>
			</view>
		</view>
		
		<!-- 状态栏占位 -->
		<view class="columnBar"></view>
	
		<view class="content">
			<view class="label">
				公众号
			</view>
			<view class="title">
				关注量拾公众号
			</view>
			<view class="tip">
				<view class="line"></view>
				<view class="text">长按识别二维码关注</view>
				<view class="line1"></view>
			</view>
			<view class="img">
				<image src="/static//images/mine/ewm.jpg" mode="widthFix" show-menu-by-longpress="true"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import config from '@/config'
	export default {
		data() {
			return {
				uploadStaticUrl:config.uploadStaticUrl,
				staticUrl:config.staticUrl,
				url: config.appInfo.site_url,
				version: config.appInfo.version
			}
		},
		methods: {
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
	.columnBar{
		width: 100%;
		height: 2upx;
		-webkit-transform: scaleY(0.7);
		transform: scaleY(0.7);
		background: #DFDFDF;
		margin:  24upx 0;
	}
	.official {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		background: #fff;
		padding:32rpx;
		padding-bottom: 180rpx;
	}
	.top{
		display: flex;
		align-items: center;
		width:100%;
		.logo{
			width: 72rpx;
			height: 72rpx;
			margin-right:8rpx;
			image{
				width:100%;
				height:100%;
			}
		}
		.title{
			color: #333333;
			font-weight: 500;
			font-size: 32rpx;
		}
		.title1{
			color: #999;
			font-weight:400;
			font-size: 24rpx;
		}
	}

	
	.content{
		width:100%;
		font-size: 24rpx;
		color: #999999;
		padding-top: 20rpx;
		padding-bottom:20rpx ;
		.label{
			font-size: 24rpx;
			color: #999999;
		}
		.title{
			margin: 30rpx 0;
			color: #333333;
			font-weight: 700;
			font-size: 38rpx;
			text-align: center;
		}
		.tip{
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #333;
			padding:0 80rpx;
			.line{
				width: 131rpx;
				height: 1px;
				background: linear-gradient(90deg, #223333 0%, rgba(27, 83, 197, 0) 50.38%);
				transform: matrix(-1, 0, 0, 1, 0, 0);
			}
			.line1{
				width: 131rpx;
				height: 1px;
				background: linear-gradient(90deg, #223333 0%, rgba(27, 83, 197, 0) 50.38%);
			}
		}
		.img{
			display:flex;
			justify-content:center;
			margin-top: 32rpx;
			image {
				margin: 30rpx;
				width: 129px;
				height: 129px;
			}
		}
	}
</style>
