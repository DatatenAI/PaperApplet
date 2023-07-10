<template>
	<view class="page">
		<view ref="container" class="container">
			asadsdaaaaaaaaaaaaaaaaaaaaaaaaaa
			asadsdaaaaaaaaaaaaaaaaaaaaaaaaaa
			asadsdaaaaaaaaaaaaaaaaaaaaaaaaaa
		</view>
		<canvas canvas-id="mycanvas" id="canvas">

		</canvas>
		<view class="btn" @click="generateImage()">图片生成</view>
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
		addSubscribe,
		cancelSubscribe
	} from '@/api/home/index.js'
	import config from '@/config.js';
	import html2canvas from "html2canvas";

	export default {
		data() {
			return {
				user: {},
			};
		},
		onLoad(options) {

		},
		onShow() {
			var that = this;
			if (getUser()) {
				that.user = JSON.parse(getUser()) || {}
			}
		},
		methods: {
			generateImage() {
				
				 const query = wx.createSelectorQuery().in(this);
				    query.select('.container').boundingClientRect(res => {
						debugger
				      const scale = 1; //截图倍数，如果图片模糊可以调大
				      const width = res.width * scale;
				      const height = res.height * scale;
				      const canvas = wx.createCanvasContext('mycanvas', this);
				
				      // 将canvas标签设置为图片大小，准备将网页截图绘制上去
				      canvas.width = width;
				      canvas.height = height;
				
				      // 将网页内容绘制到canvas上
				      wx.canvasToTempFilePath({
				        x: 0,
				        y: 0,
				        width,
				        height,
				        destWidth: width,
				        destHeight: height,
				        canvasId: 'mycanvas',
				        success: ({tempFilePath}) => {
				          wx.saveImageToPhotosAlbum({
				            filePath: tempFilePath,
				            success: () => {
				              wx.showToast({
				                title: '保存成功',
				              })
				            },
				            fail: () => {
				              wx.showToast({
				                title: '保存失败',
				                icon: 'none'
				              })
				            }
				          })
				        }
				      }, this);
				    }).exec();

				// 获取canvas对象
				// const ctx = uni.createCanvasContext('mycanvas', this);
				// // 绘制canvas内容
				// ctx.draw();
				// // canvasToTempFilePath API将canvas转为图片
				// uni.canvasToTempFilePath({
				// 	canvasId: 'mycanvas',
				// 	success: (res) => {
				// 		// 图片保存成功后的回调
				// 		uni.saveImageToPhotosAlbum({
				// 			filePath: res.tempFilePath,
				// 			success: () => {
				// 				uni.showToast({
				// 					icon: 'none',
				// 					title: '保存成功'
				// 				})
				// 			},
				// 			fail: () => {
				// 				uni.showToast({
				// 					icon: 'none',
				// 					title: '保存失败'
				// 				})
				// 			}
				// 		})
				// 	}
				// })

				// var that = this;
				// var query = wx.createSelectorQuery().in(this);
				// query.select('#source').boundingClientRect(element => {
				// 	html2canvas(element).then((canvas) => {
				// 		debugger
				// 	    const imgData = canvas.toDataURL("image/png");
				// 	    console.log(imgData);
				// 	});
				// }).exec();
			}
		}
	};
</script>

<style lang="scss">

</style>