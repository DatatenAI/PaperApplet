<template>
	<view class="container">
		<view class="example">
			<uni-forms ref="form" :model="form" labelWidth="80px">
				<uni-forms-item label="专辑名称" name="favoriteName">
					<uni-easyinput v-model="form.favoriteName" placeholder="请输入专辑名称after edition" clearable />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="submit" style="background-color: #3B00FF;">提交submit</button>
		</view>
	</view>
</template>

<script>
	import {
		getUser,
		setUser,
		removeUser,
	} from '@/utils/auth';
	import config from '@/config'
	import {
		addFavorite,
		editFavorite,
		deleteFavorite
	} from '@/api/mine/index.js';
	export default {
		data() {
			return {
				user: {},
				form: {
					favoriteName: ''
				},
				config:config,
				query:{
					favoriteId:0,
					pageNum: 1,
					pageSize: 10
				},
				list: []
			}
		},
		onLoad(option) {
			this.query.favoriteId = parseInt(option.id);
			console.log("@@@edit album id",this.query.favoriteId)
		},
		onReady() {},
		onShow() {
			var that = this;
			if(getUser()){
				that.user = JSON.parse(getUser()) || {}
			};
			this.list = [];
			this.editFavoritePaper();
		},
		methods: {
			editFavoritePaper() {
				var that = this;
				console.log("------id-----",that.user.openId,that.query.favoriteId)
				
			},
			submit(ref) {
				var that = this;
				console.log("------id-----",that.user.openId,that.query.favoriteId)
				editFavorite({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					favoriteName: that.form.favoriteName,
					favoriteId: that.query.favoriteId || 0,
				}).then(
				response => {
					console.log("response from edit",response);
					// that.list = that.list.concat(response);
				})
				// addFavorite({
				// 	userId: that.user.id || null,
				// 	openId: that.user.openId || '',
				// 	favoriteName: that.form.favoriteName,
				// }).then(response => {
				// 	that.$modal.msg('创建专辑成功');
				// 	setTimeout(function() {
				// 		that.navSwitchPage('/pages/mine');
				// 	}, 1500)
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