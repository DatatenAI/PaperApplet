<template>
	<view v-if="params.url" class="content">
		<web-view :webview-styles="webviewStyles"
			:src="params.url"
			@message="getMessage"></web-view>
	</view>
</template>

<script>
	import config from '@/config';
	export default {
		data() {
			return {
				config: config,
				params: {},
				url:'',
				webviewStyles: {
					progress: {
						color: "#FF3333"
					}
				}
			}
		},
		props: {
			src: {
				type: [String],
				default: null
			}
		},
		onLoad(event) {
			this.params = event;
			this.params.url = `${config.webViewUrl}?userId=${this.params.id}&openId=${this.params.openId}&id=${this.params.id}`;
			console.log(JSON.stringify(this.url));
			console.log(JSON.stringify(this.params));
			if (event.title) {
				uni.setNavigationBarTitle({
					title: event.title
				})
			}
			// this.saveAlbum();
		},
		methods: {
			saveAlbum() { //获取权限保存相册
				uni.getSetting({ //获取用户的当前设置
					success: (res) => {
						// console.log("获取权限",res);
						if (res.authSetting['scope.writePhotosAlbum']) { //验证用户是否授权可以访问相册
							this.saveImageToPhotosAlbum();
						} else {
							uni.authorize({ //如果没有授权，向用户发起请求
								scope: 'scope.writePhotosAlbum',
								success: () => {
									this.saveImageToPhotosAlbum();
								},
								fail: () => {
									uni.showToast({
										title: "请打开保存相册权限，再点击保存相册分享",
										icon: "none",
										duration: 3000
									});
									setTimeout(() => {
										uni.openSetting({ //调起客户端小程序设置界面,让用户开启访问相册
											success: (res2) => {
												// console.log(res2.authSetting)
											}
										});
									}, 3000);
								}
							})
						}
					}
				})
			},
			saveImageToPhotosAlbum() {
				var that = this;
				// let base64 = maskData.replace(/^data:image\/\w+;BASE64,/, ""); //去掉data:image/png;base64,
				let base64 = that.imageData.replace('data:image/octet-stream;base64,', ""); //去掉data:image/png;base64,
				let filePath = wx.env.USER_DATA_PATH + `/hym_pay${Date.parse(new Date())}_qrcode.png`;
				uni.getFileSystemManager().writeFile({
					filePath: filePath, //创建一个临时文件名
					data: base64, //写入的文本或二进制数据
					encoding: 'base64', //写入当前文件的字符编码
					success: res => {
						uni.saveImageToPhotosAlbum({
							filePath: filePath,
							success: function(res2) {
								uni.showToast({
									title: '保存成功，请从相册选择再分享',
									icon: "none",
									duration: 5000
								})
							},
							fail: function(err) {
								// console.log(err.errMsg);
							}
						})
					},
					fail: err => {
						//console.log(err)
					}
				})
			},
			getMessage(e) {
				var that = this;
				that.imageData = e.detail.data[0].imgData;
				this.saveAlbum();
				// wx.getFileSystemManager().writeFile({
				// 	filePath: wx.env.USER_DATA_PATH + "/qrcode.png", //这里先把文件写到临时目录里.
				// 	data: imageData.slice(22), // 注意这里
				// 	encoding: "base64",
				// 	// encoding:'utf8',
				// 	success: (res) => {
				// 		that.$modal.msg('图片保存成功');
				// 		console.log(res);
				// 	},
				// 	fail: (error) => {
				// 		console.log(error);
				// 	},
				// });
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100%;
		height: 100vh;
	}
</style>