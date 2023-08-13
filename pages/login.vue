<template>
	<view class="content">
		<image src="/static/logo200.png" mode="widthFix" class="logo"></image>
		<view class="login_btn"><button open-type="getUserInfo" @click="getUserProfile">授权登录</button></view>
		<!-- <view class="login_btn"><button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">授权登录</button></view> -->
		<view class="login_back" @click="navSwitchPage('/pages/mine')">退出登录</view>
		<view class="hint">
			<label @click="checkboxChange">
				<checkbox style="transform:scale(0.7);margin-right: 5rpx;color: #3B00FF;" :checked="agree" />登录代表同意
				<text class="link" @click="navToPage('/pages/public/protocol')">《用户协议》</text>、<text class="link"
					@click="navToPage('/pages/public/privacy')">《隐私政策》</text>，
				并授权使用您的账号信息（如昵称、头像）以便您统一管理
			</label>
		</view>
	</view>
</template>


<script>
	import config from '@/config'
	import {
		insertWxUser,
		getOpenId
	} from '@/api/login.js'
	import {
		searchPaper
	} from '@/api/home/index.js'
	import {} from '@/api/mine/index.js'
	import {
		searchKeyWords,
	} from '@/api/system/index.js'
	import {
		setUser,
		setToken
	} from '@/utils/auth.js'
	var WXBizDataCrypt = require('@/utils/WXBizDataCrypt');

	export default {
		data() {
			return {
				agree: false,
				uploadStaticUrl: config.uploadStaticUrl,
				staticUrl: config.staticUrl,
				sex:['未知','男','女'],
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
			}
		},
		onLoad() {
			var that = this;
			that.getWeixinCode();
			// setTimeout(function() {
			// 	that.getWeixinOpenid();
			// }, 1500)
		},
		methods: {
			checkboxChange(e) {
				this.agree = !this.agree
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
					setToken(response.token);
					// that.getWeixinCode();
				})
			},
			// 获取手机号
			getPhoneNumber(e) {
				var that = this;
				// that.getWeixinCode();
				if (!that.weixin.code || !e.detail.encryptedData) {
					return false;
				}

				if (!that.agree) {
					uni.showToast({
						title: "请勾选同意用户须知！",
						icon: 'none'
					})
					return false;
				}

				that.weixin.encryptedData = e.detail.encryptedData;
				that.weixin.iv = e.detail.iv;
				var pc = new WXBizDataCrypt(config.appId, that.weixin.session_key)
				var data = pc.decryptData(that.weixin.encryptedData, that.weixin.iv)
				console.log(data);
				that.weixin.phoneNumber = data.phoneNumber;
				that.weixin.mobilePhone = data.phoneNumber;
				setTimeout(function() {
					saveCustomer(that.weixin).then(response => {
						that.weixin.custId = response.data.id;
						setUser(that.weixin);
						that.navSwitchPage('/pages/mine/index');
					})
				}, 1500)
			},
			// onChooseAvatar(e){
			// 	debugger
			// 	 const { avatarUrl } = e.detail;
			// },
			getUserProfile(e) {
				var that = this;
				if (!that.agree) {
					uni.showToast({
						title: "请勾选同意用户须知！",
						icon: 'none'
					});

					return false;
				}
				// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				wx.getUserProfile({
					desc: '获取您的微信个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						var pc = new WXBizDataCrypt(config.appId, that.weixin.session_key)
						var data = pc.decryptData(res.encryptedData, res.iv)
						console.log(data);
						that.weixin.nickName = data.nickName;
						that.weixin.avatar = data.avatarUrl;
						that.weixin.country = data.country;
						that.weixin.city = data.city;
						that.weixin.gender = data.gender;
						that.weixin.province = data.province;
						that.saveWeixinInfo();
					}
				})
			},
			saveWeixinInfo() {
				var that = this;
				insertWxUser({
					avatar: that.weixin.avatar,
					city: that.weixin.city,
					country: that.weixin.country,
					gender: that.sex[that.weixin.gender],
					nickName: that.weixin.nickName,
					openId: that.weixin.openId,
					province: that.weixin.province,
					unionId: that.weixin.unionId,
					phone: '',
					email: '',
					birthday: '',
					educational: '',
					interest: '',
				}).then(response => {
					response.id = parseInt(response.id);
					response.token = that.weixin.token;
					setUser(JSON.stringify(response));
					that.navSwitchPage('/pages/mine');
				})
			},
			//下一页
			navToPage(url) {
				uni.navigateTo({
					url: url
				})
			},
			//下一页
			navSwitchPage(url) {
				uni.switchTab({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100%;
		height: 100vh;
		padding: 20rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;

		.logo {
			width: 200rpx;
			height: 200rpx;
		}
	}

	.login_btn {
		margin-top: 80rpx;
		width: 80%;
		font-size: 32rpx;
		letter-spacing: 2rpx;
		background-color: #3B00FF;
		color: #fff;
		text-align: center;
		padding: 6rpx 30rpx;
		border-radius: 12rpx;

		button {
			display: inline-block;
			width: 100%;
			outline: none;
			background-color: #3B00FF;
			border: none !important;
			color: #fff;
		}

		button::after {
			border: none;
		}
	}

	.login_back {
		margin-top: 20rpx;
		width: 80%;
		font-size: 32rpx;
		letter-spacing: 2rpx;
		// background-color: #426ad4;
		// color: #fff;
		border: 1px solid #cfcfcf;
		text-align: center;
		padding: 30rpx;
		border-radius: 12rpx;
	}

	.hint {
		padding: 20rpx 40rpx;
		margin-top: 40rpx;
		font-size: 28rpx;

		.link {
			color: #3B00FF;
		}
	}
</style>