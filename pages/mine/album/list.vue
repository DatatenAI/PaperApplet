<template>
	<view class="page">
		<view class="list_1">
			<view class="item" v-for="item in list" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)">
				<view class="content">
					<view class="title">{{ item.paperInfo.title || ''}}</view>
					<view class="bottom">
						<text>{{ item.createTime | formatDate}}</text>
						<!-- <text>{{ item.paperInfo.authors }}</text> -->
					</view>
				</view>
				<view class="thumb" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)" v-if="item.paperInfo.imgUrl">
					<image
						:src="config.staticUrl + item.paperInfo.pdfHash + '/' + item.paperInfo.imgUrl.split(',')[0]"
						mode="widthFix"></image>
				</view>
				<!-- <view class="thumb">
					<image :src="'https://img2.baidu.com/it/u=435937141,731061479&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=430'" mode="aspectFill"></image>
				</view> -->
			</view>
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
		searchHistory,
		statistic,
		searchMyLike,
		searchSummaryHistory,
		scarchFavorite,
		scarchFavoritePaper
	} from '@/api/mine/index.js'
	
	export default {
		filters: {
			formatDate(time) {
				if (!time) { //当时间是null或者无效格式时返回空
					return ' '
				} else {
					// String localDate = LocalDateTime.parse(time,DateTimeFormatter.ISO_OFFSET_DATE_TIME).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
					
					// return localDate;
					return time.substr(0, 19).replace('T', ' ').replace(/-/g, '.');
					// const timeLen = time.length; //传入的时候时间戳类型应为字符串，因为要根据length判断是10/13的时间戳
					// const oneDate = new Date(parseInt(time) * 1000); // 10位时间戳
					// const twoDate = new Date(parseInt(time)); // 13位时间戳
					// const date = timeLen == 10 ? oneDate : twoDate;
					// const dateNumFun = (num) => num < 10 ? `0${num}` : num
					// console.log(time)
					// const [Y, M, D, h, m, s] = [
					// 	date.getFullYear(),
					// 	dateNumFun(date.getMonth() + 1),
					// 	dateNumFun(date.getDate()),
					// 	dateNumFun(date.getHours()),
					// 	dateNumFun(date.getMinutes()),
					// ]
					// return `${Y}-${M}-${D}`
				}
			},
		},
		data() {
			return {
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
		},
		onShow() {
			if(getUser()){
				this.user = JSON.parse(getUser()) || {};
			}
			this.list = [];
			this.getScarchFavoritePaper();
		},
		onReady() {

		},
		// 下拉到底部后加载新数据
		onReachBottom() {
			var that = this;
			// 判断下一页是否存在数据，不存在将显示暂无数据等提示语
			// if (that.activityList.length == that.query.total) {
			// 	that.noMoreData = true;
			// 	return false;
			// }
			that.query.pageNum++; //页数加一
			that.getScarchFavoritePaper(); //回调接口
			// if(this.tabIndex == 1){
			// 	that.query.pageNum++; //页数加一
			// 	that.getArticles(); //回调接口
			// }
		
		},
		methods: {
			getScarchFavoritePaper() {
				var that = this;
				console.log("------id-----",that.user.openId,that.query.favoriteId)
				scarchFavoritePaper({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					favoriteId: that.query.favoriteId || 0,
					pageNum: that.query.pageNum,
					pageSize: that.query.pageSize,
				}).then(response => {
					that.list = that.list.concat(response);
				})
			},
			change(key, item) {
				uni.showModal({
					content: `当前索${key},当前数据${JSON.stringify(item)}`
				})
			},
			changeTab(index) {
				if (this.tabIndex == index) {
					return false;
				}

				this.tabIndex = index;

				if (this.tabIndex == 0) {
					this.animationSetting[1].modeClass = ['fade', 'slide-right'];
					this.animationSetting[1].show = false;
					this.animationSetting[0].modeClass = ['fade', 'slide-left'];
					this.animationSetting[0].show = true;
				}

				if (this.tabIndex == 1) {
					this.animationSetting[1].modeClass = ['fade', 'slide-right'];
					this.animationSetting[1].show = true;
					this.animationSetting[0].modeClass = ['fade', 'slide-left'];
					this.animationSetting[0].show = false;
				}
			},
			change(e) {
				console.log("e:", e);
			},
			generate() {
				if (!this.$store.state.user.token) {
					this.$modal.showToast('请先登录!')
					return false;
				};
				if (this.reqForm.specialized == '') {
					this.$modal.showToast('请选择专业!')
					return false;
				}

				if (this.reqForm.describe == '') {
					this.$modal.showToast('请输入相关描述!')
					return false;
				}
				this.navTo(
					`/pages/article/index?specialized=${this.reqForm.specialized}&describe=${this.reqForm.describe}`)
			},
			getDict(type) {
				pap_specialty_type({
					type: type
				}).then(res => {

					this.dictOri = res.data;
					this.dict = [];

					if (this.$store.state.user.token && this.aiMajor.length > 0) {
						for (var i = 0; i < this.dictOri.length; i++) {
							if (this.aiMajor.includes(this.dictOri[i].dictValue)) {
								// this.dict.push(this.dictOri[i]);
								this.dict.push({
									text: this.dictOri[i].dictLabel,
									value: this.dictOri[i].dictLabel,
								});
							}
						}
					} else {
						this.dict = this.dictOri;
					}
					console.log(res)
				});
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
			},
			/**
			 * 触摸开始
			 * @param {Object} e
			 */
			touchStart: function(e) {
				var that = this;
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX;
				}
			},
			/**
			 * 触摸结束
			 * @param {Object} e
			 */
			touchEnd: function(e) {
				var that = this;
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					let diff = endX - this.startX;
					if (Math.abs(diff) > 50) {
						if (diff > 0) {
							console.log("左滑...");
							if (that.tabIndex != 0) {
								that.changeTab(0)
							}
						} else {
							console.log("右滑...");
							if (that.tabIndex != 1) {
								that.changeTab(1)
							}
						}

					}
				}

			},
			navTo(url) {
				this.$tab.navigateTo(url)
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

	.list_1 {
		position: relative;
		// padding-top: 84rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;

		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			align-content: center;
			background-color: #fff;
			margin-bottom: 30rpx;
			border-radius: 6rpx;
			padding: 20rpx 15rpx;

			.content {
				width: calc(100% - 220rpx);
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.title {
					height: 120rpx;
					color: #333;
					word-break: normal;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 3;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					margin-bottom: 10rpx;
				}

				.bottom {
					font-size: 24rpx;
					color: #999;

					text {
						margin-right: 10rpx;
					}
				}
			}

			.thumb {
				width: 200rpx;
				height: 176rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>