<script>
	import config from './config'
	import {
		insertWxUser,
		getOpenId,
	} from '@/api/login.js'
	import store from '@/store'
	import {
		getToken,
		setUser,
		setToken,
		setWeixin
	} from '@/utils/auth'

	export default {
		data: {
			weixin: {
				token: '',
				code: '',
				unionId: '',
				avatar: '',
				city: '',
				country: '',
				gender: '',
				nickName: '',
				openId: '',
				province: '',
				unionId: '',
				phone: '',
				email: '',
				birthday: '',
				educational: '',
				interest: '',
			}
		},
		onLaunch: function(option) {
			console.log("首页：" + JSON.stringify(option.query.id));
			this.getWeixinCode();
			try {
				this.autoUpdate();
				// 	const updateManager = uni.getUpdateManager;
				// 	updateManager.onCheckForUpdate(function(res) {
				// 		// 请求完新版本信息的回调
				// 		if (res.hasUpdate) {
				// 			updateManager.onUpdateReady(function(res2) {
				// 				uni.showModal({
				// 					title: '更新提示',
				// 					content: '发现新版本，是否重启应用?',
				// 					cancelColor: '#eeeeee',
				// 					confirmColor: '#FF0000',
				// 					success(res2) {
				// 						if (res2.confirm) {
				// 							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				// 							updateManager.applyUpdate();
				// 						}
				// 					}
				// 				});
				// 			});
				// 		}
				// 	});

				// 	updateManager.onUpdateFailed(function(res) {
				// 		// 新的版本下载失败
				// 		uni.showModal({
				// 			title: '提示',
				// 			content: '检查到有新版本，但下载失败，请检查网络设置',
				// 			success(res) {
				// 				if (res.confirm) {
				// 					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				// 					updateManager.applyUpdate();
				// 				}
				// 			}
				// 		});
				// 	});
			} catch (e) {
				console.log('error=' + e)
			}

			this.initApp()
		},
		methods: {
			autoUpdate: function() {
				console.log(new Date())
				var self = this
				// 获取小程序更新机制兼容
				if (wx.canIUse('getUpdateManager')) {
					const updateManager = wx.getUpdateManager()
					//1. 检查小程序是否有新版本发布
					updateManager.onCheckForUpdate(function(res) {
						// 请求完新版本信息的回调
						if (res.hasUpdate) {
							//2. 小程序有新版本，则静默下载新版本，做好更新准备
							updateManager.onUpdateReady(function() {
								console.log(new Date())
								wx.showModal({
									title: '更新提示',
									content: '新版本已经准备好，是否重启应用？',
									success: function(res) {
										if (res.confirm) {
											//3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
											updateManager.applyUpdate()
										} else if (res.cancel) {
											//如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
											wx.showModal({
												title: '温馨提示~',
												content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
												success: function(res) {
													self.autoUpdate()
													return;
													//第二次提示后，强制更新           
													if (res.confirm) {
														// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
														updateManager
															.applyUpdate()
													} else if (res.cancel) {
														//重新回到版本更新提示
														self.autoUpdate()
													}
												}
											})
										}
									}
								})
							})
							updateManager.onUpdateFailed(function() {
								// 新的版本下载失败
								wx.showModal({
									title: '已经有新版本了哟~',
									content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
								})
							})
						}
					})
				} else {
					// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
					wx.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
					})
				}
			},
			// 初始化应用
			initApp() {
				// 初始化应用配置
				this.initConfig()
				// 检查用户登录状态
				//#ifdef H5
				// this.checkLogin()
				//#endif
			},
			initConfig() {
				this.globalData.config = config
			},
			checkLogin() {
				if (!getToken()) {
					this.$tab.reLaunch('/pages/login')
				}
			},
			getWeixinCode() {
				var that = this;
				uni.login({
					provider: 'weixin',
					success: res => {
						console.log(res.code);
						that.weixin.code = res.code;
						that.getWeixinOpenid();
					}
				});
			},
			getWeixinOpenid() {
				var that = this;
				getOpenId({
					code: that.weixin.code
				}).then(response => {
					that.weixin.openId = response.openid;
					that.weixin.session_key = response.session_key;
					that.weixin.token = response.token;

					if (response.wxuser) {
						that.weixin.isExit = true;
						that.weixin.wxuser = response.wxuser;
					} else {
						that.weixin.isExit = false;
						that.weixin.wxuser = null;
					}
					setWeixin(JSON.stringify(that.weixin));
					// if(response.wxuser){
					// 	response.wxuser.id = parseInt(response.wxuser.id);
					// 	response.wxuser.token = response.token;
					// 	setUser(JSON.stringify(response.wxuser));
					// }else{
					// 	insertWxUser({
					// 		avatar: '',
					// 		city: '',
					// 		country: '',
					// 		gender: '未知',
					// 		nickName: '微信用户' + (new Date()).valueOf(),
					// 		openId: response.openid,
					// 		province: '',
					// 		unionId: '',
					// 		phone: '',
					// 		email: '',
					// 		birthday: '',
					// 		educational: '',
					// 		interest: '',
					// 	}).then(res => {
					// 		res.id = parseInt(res.id);
					// 		res.token = response.token;
					// 		setUser(JSON.stringify(res));
					// 		// that.navSwitchPage('/pages/mine');
					// 	})
					// }
					setToken(response.token);
					// that.getWeixinCode();
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '@/static/scss/index.scss';

	.page {
		position: relative;
		width: 100%;
		min-height: 100vh;
		box-sizing: border-box;
		background-color: #f5f8fa;
		/*#ifdef  H5*/
		// padding-top: 44px;
		/*#endif*/
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.content {
		position: relative;
		width: 100%;
		box-sizing: border-box;
		background-color: #f5f8fa;
		/*#ifdef  H5*/
		// padding-top: 44px;
		/*#endif*/
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.bolder {
		font-weight: bolder;
	}

	.color {
		color: #c8a48c !important;
	}

	.nodata {
		padding: 100rpx 0;
		text-align: center;

		image {
			width: 80%;
		}
	}
</style>