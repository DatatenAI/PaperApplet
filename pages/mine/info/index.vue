<template>
	<view class="container">
		<!-- <view class="photo-box">
			<image src="/static/images/tabbar/mine.png" mode="widthFix" @click="navTo(`/pages/mine/avatar/index`)">
			</image>
		</view> -->
		<uni-list>
			<uni-list-item showExtraIcon="true" :rightText="'头像'" :showArrow="true" :thumb="user.avatar" thumb-size="lg"
				clickable  @click="navTo(`/pages/mine/info/edit`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'person-filled'}" title="用户昵称"
				:rightText="user.nickName" clickable @click="navTo(`/pages/mine/info/edit`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'phone-filled'}" title="手机号码"
				:rightText="user.phone" clickable @click="navTo(`/pages/mine/info/edit`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'email-filled'}" title="邮箱"
				:rightText="user.email" clickable @click="navTo(`/pages/mine/info/bindEmail`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'staff-filled'}" title="性别"
				:rightText="user.gender" clickable @click="navTo(`/pages/mine/info/edit`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'person-filled'}" title="学历"
				:rightText="user.educational" clickable @click="navTo(`/pages/mine/info/edit`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'flag'}" title="兴趣"
				:rightText="user.interest" clickable @click="navTo(`/pages/mine/info/edit`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'calendar'}" title="出生年月"
				:rightText="user.birthday" clickable @click="navTo(`/pages/mine/info/edit`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'location-filled'}" title="城市"
				:rightText="user.city" clickable @click="navTo(`/pages/mine/info/edit`)" />
			<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'medal-filled'}" title="个人介绍"
				:rightText="user.intro" clickable @click="navTo(`/pages/mine/info/edit`)" />
		</uni-list>
	</view>
</template>

<script>
	import {
		getUser,
		setUser,
		removeUser,
	} from '@/utils/auth'
	import {

	} from '@/api/mine/index.js'
	export default {
		data() {
			return {
				user: {},

			}
		},
		onLoad() {},
		onShow() {
			var that = this;
			if(getUser()){
				that.user = JSON.parse(getUser()) || {}
			}
		},
		methods: {
			navTo(url) {
				this.$tab.navigateTo(url)
			},
			getUser() {
				getUserProfile().then(response => {
					this.user = response.data
					this.roleGroup = response.roleGroup
					this.postGroup = response.postGroup
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.photo-box {
		text-align: center;

		image {
			width: 120rpx;
		}

		margin-bottom: 10rpx;
	}
</style>