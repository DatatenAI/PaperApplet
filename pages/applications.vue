<template>
	<view class="page">
		<view class="nodata">
			<image src="https://miniprogram-public-hk.oss-cn-hongkong.aliyuncs.com/images/app_star.svg" style="max-width: 30%;"></image>
		</view>
		<view class="tab_box">
			<view>Coming soon ...</view>
		</view>

		<!-- <xWxmlToCanvas ref="xWxmlToCanvas" :hide="false" :width="350" :height="500" :xStyle="style" :xWxml="wxml">
		</xWxmlToCanvas> -->
	</view>
</template>


<script>
</script>

<style lang="scss">
	.page {
		padding-top: 10%;
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
</style>