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
		setToken
	} from '@/utils/auth'

	export default {
		data:{
			weixin: {
				token:'',
				code: '',
				unionId: '',
				avatar: '',
				city: '',
				country:'',
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
					if(response.wxuser){
						response.wxuser.id = parseInt(response.wxuser.id);
						response.wxuser.token = response.token;
						setUser(JSON.stringify(response.wxuser));
					}else{
						insertWxUser({
							avatar: '',
							city: '',
							country: '',
							gender: '未知',
							nickName: '微信用户' + (new Date()).valueOf(),
							openId: response.openid,
							province: '',
							unionId: '',
							phone: '',
							email: '',
							birthday: '',
							educational: '',
							interest: '',
						}).then(res => {
							res.id = parseInt(res.id);
							res.token = response.token;
							setUser(JSON.stringify(res));
							// that.navSwitchPage('/pages/mine');
						})
					}
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
	.content{
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
	.nodata{
		padding: 100rpx 0;
		text-align: center;
		image{
			width: 80%;
		}
	}
</style>