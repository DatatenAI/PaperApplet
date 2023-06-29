<template>
	<view class="container">
		<view class="example">
			<!-- <view class="photo-box">
				<image src="/static/images/tabbar/mine.png" mode="widthFix" @click="navTo(`/pages/mine/avatar/index`)">
				</image>
			</view> -->
			<uni-forms ref="form" :model="user" labelWidth="80px">
				<uni-forms-item label="用户昵称" name="nickName">
					<uni-easyinput v-model="user.nickName" placeholder="请输入昵称" clearable />
				</uni-forms-item>
				<uni-forms-item label="手机号码" name="phone">
					<!-- <uni-easyinput v-model="user.phonenumber" placeholder="请输入手机号码" suffixIcon="search" clearable
						@iconClick="iconClick" /> -->
					<view class="form-line">
						<uni-easyinput v-model="user.phone" placeholder="请输入手机号码" />
						<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号码</button>
					</view>
				</uni-forms-item>
				<!-- <uni-forms-item label="邮箱" name="email">
					<uni-easyinput v-model="user.email" placeholder="请输入邮箱" clearable />
				</uni-forms-item> -->
				<uni-forms-item label="性别" name="gender">
					<uni-data-checkbox v-model="user.gender" :localdata="sexs" />
				</uni-forms-item>
				<uni-forms-item label="学历" name="educational">
					<uni-data-select v-model="user.educational" :localdata="range"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="出生年月" name="birthday">
					<uni-datetime-picker type="date" :clear-icon="false" v-model="user.birthday"
						@maskClick="maskClick" />
				</uni-forms-item>
				<uni-forms-item label="地区" name="city">
					<uni-easyinput v-model="user.city" placeholder="请输入地区,例如合肥市" clearable />
				</uni-forms-item>
				<!-- <uni-forms-item label="地区" name="email">
					<uni-data-picker placeholder="请选择班级" popup-title="请选择所在地区" :localdata="dataTree" v-model="classes"
						@change="onchange" @nodeclick="onnodeclick" @popupopened="onpopupopened"
						@popupclosed="onpopupclosed">
					</uni-data-picker>
				</uni-forms-item> -->
				<uni-forms-item label="兴趣" name="interest">
					<uni-easyinput type="textarea" v-model="user.interest" placeholder="请输入兴趣" clearable />
				</uni-forms-item>
				<uni-forms-item label="个人介绍" name="intro">
					<uni-easyinput type="textarea" v-model="user.intro" placeholder="请输入个人介绍" clearable />
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
	import config from '@/config'
	
	export default {
		data() {
			return {
				single: '',
				value: 0,
				range: [{
						// value: 0,
						value: "中小学",
						text: "中小学"
					},
					{
						// value: 1,
						value: "中学",
						text: "中学"
					},
					{
						// value: 2,
						value: "职高",
						text: "职高"
					},
					{
						// value: 3,
						value: "高中",
						text: "高中"
					},
					{
						// value: 4,
						value: "专科",
						text: "专科"
					},
					{
						// value: 5,'
						value: "本科",
						text: "本科"
					},
					{
						// value: 6,
						value: "硕士研究生",
						text: "硕士研究生"
					},
					{
						// value: 7,
						value: "博士研究生",
						text: "博士研究生"
					},
				],
				classes: '1-2',
				dataTree: [{
					text: "安徽",
					value: "1-0",
					children: [{
							text: "合肥市",
							value: "1-1",
							children: [{
									text: "蜀山区",
									value: "1-1-1"
								},
								{
									text: "高新区",
									value: "1-1-2"
								}
							]
						},
						{
							text: "淮南市",
							value: "1-2"
						}
					]
				}],
				user: {
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
				sexs: [{
					text: '未知',
					value: '未知',
					// value: "0"
				}, {
					text: '男',
					value: '男',
					// value: "1"
				}, {
					text: '女',
					value: '女',
					// value: "2"
				}],
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
			that.user = JSON.parse(getUser()) || {}
		},
		onReady() {
			// this.$refs.form.setRules(this.rules)
		},
		methods: {
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
				insertWxUser({
					avatar: that.user.avatar,
					city: that.user.city,
					// country: that.weixin.country,
					gender: that.user.gender,
					nickName: that.user.nickName,
					openId: that.user.openId,
					// province: that.weixin.province,
					unionId: that.user.unionId,
					phone: that.user.phone,
					// email:that.user.email,
					birthday:that.user.birthday,
					educational:that.user.educational,
					interest: that.user.interest,
					intro: that.user.intro,
				}).then(response => {
					response.id = parseInt(response.id);
					setUser(JSON.stringify(response));
					that.navSwitchPage('/pages/mine');
				})
				// this.$refs.form.validate().then(res => {
				// 	updateUserProfile(this.user).then(response => {
				// 		this.$modal.msgSuccess("修改成功")
				// 	})
				// })
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