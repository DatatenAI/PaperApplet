<template>
	<view class="container">
		<view class="example">
			<uni-forms ref="form" :model="user" labelWidth="80px">
				<uni-forms-item label="专辑名称" name="email">
					<uni-easyinput v-model="user.email" placeholder="请输入专辑名称" clearable />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="submit" style="background-color: #3B00FF;">提交</button>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				single: '',
				value: 0,
				range: [{
						value: 0,
						text: "中小学"
					},
					{
						value: 1,
						text: "中学"
					},
					{
						value: 2,
						text: "职高"
					},
					{
						value: 3,
						text: "高中"
					},
					{
						value: 4,
						text: "专科"
					},
					{
						value: 5,
						text: "本科"
					},
					{
						value: 6,
						text: "硕士研究生"
					},
					{
						value: 7,
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
					phonenumber: "",
					email: "",
					sex: ""
				},
				sexs: [{
					text: '男',
					value: "0"
				}, {
					text: '女',
					value: "1"
				}],
				rules: {
					nickName: {
						rules: [{
							required: true,
							errorMessage: '用户昵称不能为空'
						}]
					},
					phonenumber: {
						rules: [{
							required: true,
							errorMessage: '手机号码不能为空'
						}, {
							pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
							errorMessage: '请输入正确的手机号码'
						}]
					},
					email: {
						rules: [{
							required: true,
							errorMessage: '邮箱地址不能为空'
						}, {
							format: 'email',
							errorMessage: '请输入正确的邮箱地址'
						}]
					}
				}
			}
		},
		onLoad() {
			this.getUser()
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
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
				this.$refs.form.validate().then(res => {
					updateUserProfile(this.user).then(response => {
						this.$modal.msgSuccess("修改成功")
					})
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
	
	.form-line{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		button::after {
		  border: none;
		}
		button {
		  background-color: #3B00FF;
		  border-radius:5rpx;
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