<template>
	<view class="container">
		<view class="example">
			<uni-forms ref="form" :model="feedback" labelWidth="80upx">
				<uni-forms-item label="类型" name="type">
					<uni-data-select v-model="feedback.type" :localdata="range" @change="change"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="描述" name="intro">
					<uni-easyinput type="textarea" v-model="feedback.content" placeholder="请输入问题描述" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="submit" class="btn">提交</button>
		</view>
	</view>
</template>

<script>
	import config from '@/config.js'
	import {
		addFeedback
	} from '@/api/mine/index.js'
	import {
		getUser,
	} from '@/utils/auth.js'
	export default {
		data() {
			return {
				uploadStaticUrl:config.uploadStaticUrl,
				user: {},
				range: [{
						value: 'BUG',
						text: "功能异常"
					},
					{
						value: 'SUGGEST',
						text: "产品反馈"
					},
				],
				feedback: {
					type: '',
					content: '',
					openId: '',
					userId: '',
				},
				sexs: [{
					text: '男',
					value: "0"
				}, {
					text: '女',
					value: "1"
				}],
				rules: {
					type: {
						rules: [{
							required: true,
							errorMessage: '请选择类型！'
						}]
					},
					intro: {
						rules: [{
							required: true,
							errorMessage: '问题描述不能为空！'
						}]
					},
				}
			}
		},
		onLoad() {
		},
		onShow() {
			var that = this;
			that.user = JSON.parse(getUser()) || {}
		},
		onReady() {
			// this.$refs.form.setRules(this.rules)
		},
		methods: {
			change(e) {
				this.feedback.type = e;
				console.log("e:", e);
			},
			submit(ref) {
				var that = this;
				that.feedback.openId = that.user.openId;
				that.feedback.userId = that.user.id;
				if(that.feedback.openId == ''){
					this.$modal.showToast('用户未登录！')
					return false;
				}
				if(that.feedback.type == ''){
					this.$modal.showToast('请选择问题类型！')
					return false;
				}
				if(that.feedback.intro == ''){
					this.$modal.showToast('问题描述不能为空！')
					return false;
				}
				
				// if(that.feedback.type == 2){
				// 	that.feedback.type = 0
				// }
				
				addFeedback({
					openId:that.user.openId || '',
					userId:that.user.id || '',
					content:that.feedback.content,
					type:that.feedback.type
				}).then(response => {
				  this.$modal.showToast('反馈提交成功！');
				  setTimeout(function(){
					  that.navSwitchPage('/pages/mine');
				  },1500)
				})
				// this.$modal.showToast('模块建设中~')
				// this.$refs.form.validate().then(res => {
				// 	
				//   // updateUserProfile(this.user).then(response => {
				//   //   this.$modal.msgSuccess("修改成功")
				//   // })
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

	.btn {
		background-color: #3B00FF;
	}
</style>