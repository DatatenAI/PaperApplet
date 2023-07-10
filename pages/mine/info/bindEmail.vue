<template>
	<view class="container">
		<view class="example">
			<uni-forms ref="form" :model="user" labelWidth="80px">
				<uni-forms-item label="绑定邮箱" name="email">
					<view class="form-line">
						<uni-easyinput v-model="user.email" placeholder="请输入邮箱" />
						<button  @click="doCode()">获取验证码</button>
					</view>
				</uni-forms-item>
				<uni-forms-item label="验证码" name="code">
					<view class="form-line">
						<uni-easyinput v-model="user.code" placeholder="请输入验证码" />
					</view>
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="submit" style="background-color: #3B00FF;">提交</button>
		</view>
	</view>
</template>

<script>
	var WXBizDataCrypt = require('@/utils/WXBizDataCrypt');
	
	import {
		getUser,
		setUser,
		removeUser,
	} from '@/utils/auth'
	import {
		insertWxUser,
		getOpenId
	} from '@/api/login.js'
	import {
		bindEmail,
		getCode
	} from '@/api/mine/index.js';
	
	import config from '@/config'
	
	export default {
		data() {
			return {
				user: {
					code:'',
					nickName: "",
					phone: "",
					email: "",
					gender: "",
					educational: "",
					interest: "",
					birthday: "",
					city: '',
					intro: "",
				},
				weixin: {
					code: '',
				},
			}
		},
		onLoad() {
			var that = this;
			// this.getUser()
			that.getWeixinCode();
		},
		onShow() {
			var that = this;
			if(getUser()){
				that.user = JSON.parse(getUser()) || {}
				that.user.code = '';
			}
		},
		onReady() {
			// this.$refs.form.setRules(this.rules)
		},
		methods: {
			doCode(){
				var that = this;
				if(that.user.email.indexOf('@gmail.com') == -1){
					that.$modal.msg('请输入正确的谷歌邮箱');
					
					return false;
				}
				
				getCode({
					email: that.user.email
				}).then(response => {
					that.$modal.msg('验证码发送成功');
				})
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
					that.weixin.openid = response.openid;
					that.weixin.openId = response.openid;
					that.weixin.session_key = response.session_key;
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

				that.weixin.encryptedData = e.detail.encryptedData;
				that.weixin.iv = e.detail.iv;
				var pc = new WXBizDataCrypt(config.appId, that.weixin.session_key)
				var data = pc.decryptData(that.weixin.encryptedData, that.weixin.iv)
				console.log(data);
				that.user.phone = data.phoneNumber;
			},
			iconClick(type) {
				uni.showToast({
					title: `点击了${type==='prefix'?'左侧':'右侧'}的图标`,
					icon: 'none'
				})
			},
			navTo(url) {
				this.$tab.navigateTo(url)
			},
			maskClick(e) {
				console.log('maskClick事件:', e);
			},
			onnodeclick(e) {
				console.log(e);
			},
			onpopupopened(e) {
				console.log('popupopened');
			},
			onpopupclosed(e) {
				console.log('popupclosed');
			},
			onchange(e) {
				console.log('onchange:', e);
			},
			getUser() {
				getUserProfile().then(response => {
					this.user = response.data
				})
			},
			submit(ref) {
				var that = this;
				if(that.user.email.indexOf('@gmail.com') == -1){
					that.$modal.msg('请输入正确的谷歌邮箱');
					
					return false;
				}
				
				if(that.user.code == ''){
					that.$modal.msg('请输入邮箱验证码');
					
					return false;
				}
				
				bindEmail({
					userId: that.user.id,
					openId: that.user.openId,
					email: that.user.email,
					code: that.user.code,
				}).then(response => {
					that.user.id = parseInt(that.user.id);
					setUser(JSON.stringify(that.user));
					that.navSwitchPage('/pages/mine');
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
	page {
		background-color: #ffffff;
	}

	.example {
		padding: 15px;
		background-color: #fff;
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.form-line {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;

		button::after {
			border: none;
		}

		button {
			background-color: #3B00FF;
			border-radius: 5rpx;
			font-size: 26rpx;
			color: #fff;
		}
	}

	.photo-box {
		text-align: center;

		image {
			width: 120rpx;
		}

		margin-bottom: 10rpx;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.button {
		display: flex;
		align-items: center;
		height: 35px;
		line-height: 35px;
		margin-left: 10px;
	}
</style>