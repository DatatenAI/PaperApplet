<script>
	import config from './config'
	import store from '@/store'
	import {
		getToken
	} from '@/utils/auth'

	export default {
		onLaunch: function() {
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
			}
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
</style>