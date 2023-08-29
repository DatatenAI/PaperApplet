<template>
	<view class="page">
		<!-- <view class="nodata">
			<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/app_star.svg" style="max-width: 30%;"></image>
		</view>
		<view class="tab_box">
			<view>Coming soon ...</view>
		</view> -->
		
		<view class="app-list">
			<view class="item">
				<view @click="navTo(`/pages/applications/conference/conference`)">
					<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/app_star.png" style="width: 120rpx;" mode="widthFix"></image>
				</view>
				<view class="title bolder" @click="navTo(`/pages/applications/conference/conference`)">
					计算机顶会总结
				</view>
			</view>
			
			
			<view class="item">
				<view @click="navTo(`/pages/public/join`)">
					<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/app_noready.png" style="width: 120rpx;" mode="widthFix"></image>
				</view>
				<view class="title bolder" @click="navTo(`/pages/public/join`)">
					提点意见?
				</view>
			</view>
			
		</view>
		<!-- <xWxmlToCanvas ref="xWxmlToCanvas" :hide="false" :width="350" :height="500" :xStyle="style" :xWxml="wxml">
		</xWxmlToCanvas> -->
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
		cancelRead,
		searchMyRead
	} from '@/api/home/index.js'
	import config from '@/config'
	import fastTab from '@/components/fast-tab/fast-tab';
	// import xWxmlToCanvas from 'x-wxml-to-canvas/x-wxml-to-canvas'
	export default {
		onLoad() {
			var that = this;

			// that.getSubscribe();

		},
		methods: {
			navTo(url) {
				console.log("Nav to", url);
				this.$tab.navigateTo(url)
			}
		}
	}
</script>


<style lang="scss">
	.page {
		padding-top: 40%;
		// background-image: url("https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/app_background.svg");
		// background-size:     cover;                      /* <------ */
		// background-repeat:   no-repeat;
		// background-position: center center;
	}
	.tab_box {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		font-weight: bold;
	}
	
	
	.app-list {
		padding-top: 50%;
		display: flex;
		flex-wrap: wrap;
		// flex-direction: row;
		align-items: flex-start;
		align-content: flex-start;
		justify-content: left;
		// justify-content: space-around;
		
		// width: 100%;
		// column-count: 2;
		// column-gap: 5rpx;
		// padding-top: 150rpx;
	
		.item {
			display: flex;
			flex-direction: column;
			// justify-content: center;
			// /* align-self: center;    <---- REMOVE */
			align-items: center;
			
			width: calc(50% - 40rpx);
			break-inside: avoid;
			margin: 20rpx;
	
			.title {
				width: 100%;
				// max-height: 86rpx;
				text-align: center;
				// margin-top: 4px;
				
				// padding: 0rpx 0rpx;
				color: #333;
				font-size: 32rpx;
				word-break: normal;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// -webkit-line-clamp: 2;
				// display: -webkit-box;
				// -webkit-box-orient: vertical
			}
			
		}
	}
	
</style>