<template>
	<view class="page">
		<!-- 状态栏占位 -->
		<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>

		<view class="bar_box">
			<uni-icons type="bars" size="24" color="#fff" @click="showDrawer('showLeft')"></uni-icons>
		</view>

		<view class="info_box" v-if="!user.openId">
			<view class="avatar_box">
				<image :src="'https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/my-avatar.png'"
					mode="widthFix" />
			</view>
			<view class="login_box" @click="navTo('/pages/login')">
				<text>请登录/注册</text>
				<text>ID:xxxxxx</text>
			</view>
		</view>

		<view class="info_box" v-else>
			<view class="avatar_box scale2">
				<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image :src="user.avatar || '/static/images/tabbar/mine.png'" mode="widthFix" />
				</button>
				<!-- <image :src="user.avatar" mode="widthFix" />  @click="navTo(`/pages/mine/info/index`)"-->
			</view>

			<view class="login_box" @click="navTo(`/pages/mine/info/index`)">
				<text>{{user.nickName}}</text>
				<text>ID:{{user.id}}</text>
			</view>
		</view>

		<view class="per_box" @click="navTo(`/pages/mine/info/edit`)" v-if="user.openId">
			{{ user.intro || "请填写自定义介绍"}}
		</view>

		<view class="per_box" @click="navTo(`/pages/login`)" v-else>
			登录后自定义个人介绍
		</view>

		<view class="section_box_1">
			<!-- @click="navToPageAuth(`/pages/community/list?openid=${user.openid}`)" -->
			<view class="item">
				<view class="num">{{ report.keywordsSize || 0}}</view>
				<view class="title">订阅</view>
			</view>
			<view class="item">
				<view class="num">{{ report.favoriteSize || 0}}</view>
				<view class="title">收藏</view>
			</view>
			<view class="item">
				<view class="num">{{ report.likeSize || 0}}</view>
				<view class="title">赞同</view>
			</view>
			<view class="item">
				<view class="num">{{ report.historySize || 0}}</view>
				<view class="title">历史</view>
			</view>
		</view>

		<view class="no-login" @click="navTo('/pages/login')" v-if="!user.openId">
			<uni-icons type="person" size="100" color="#999"></uni-icons>
			<view class="text">请登录后查看</view>
		</view>

		<view v-else>
			<view class="topBar">
				<view class="notice_box" @click="navTo('/pages/common/notice/list')">
					<!-- <uni-icons type="notification" size="24"></uni-icons> -->
				</view>
				<view class="tab_box">
					<view class="item" :class="{'active':tabIndex == 0}" @click="changeTab(0)">收藏</view>
					<view class="item" :class="{'active':tabIndex == 1}" @click="changeTab(1)">赞同</view>
					<view class="item" :class="{'active':tabIndex == 2}" @click="changeTab(2)">历史</view>
				</view>

				<view class="search_box" @click="navTo('/pages/common/search/index')">
					<!-- <uni-icons type="search" size="24"></uni-icons> -->
				</view>

			</view>

			<view class="subTab_box" v-if="tabIndex == 0">
				<view class="item" :class="{'active':subTabIndex1 == 0}" @click="changeSubTab(0,0)">文章 <text
						class="circle"></text> {{ report.favoriteSize || 0}} </view>
				<view class="item" :class="{'active':subTabIndex1 == 1}" @click="changeSubTab(0,1)">专辑 <text
						class="circle"></text> {{ albumList.length || 0}}</view>
			</view>

			<view class="list_1" v-if="tabIndex == 0 && subTabIndex1 == 0">
				<view class="item" v-for="item in articleList"
					@click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)">
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
				</view>

				<view class="nodata" v-if="articleList.length == 0">
					<image src="https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/nodata.png"
						mode="widthFix"></image>
				</view>
			</view>

			<view v-if="tabIndex == 0 && subTabIndex1 == 1">
				<view class="uni-list album">
					<uni-list-item :showArrow="true" showExtraIcon="true" :extraIcon="{type: 'folder-add-filled'}"
						title="创建新专辑" clickable @click="navTo(`/pages/mine/album/create`)" />
				</view>

				<view class="list_2">
					<view class="notice">
						<view class="notice-item" v-for="item in albumList">
							<view class="content" @click="navTo(`/pages/mine/album/list?id=${item.id}`)">
								<text class="title">{{item.name}}</text>
								<view class="image_list">
									<view class="image_item" v-for="subItem in item.favoriteDetails.slice(0,4)">
										<!-- <image
											src="https://img2.baidu.com/it/u=435937141,731061479&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=430"
											mode="widthFix"></image> -->
										<view class="thumb" @click="navTo(`/pages/home/detail/detail?id=${subItem.paperInfo.id}`)" v-if="subItem.paperInfo.imgUrl">
											<image
												:src="config.staticUrl + subItem.paperInfo.imgUrl.split(',')[0]"
												mode="widthFix"></image>
										</view>
									</view>
									
								</view>
								<view class="bot b-t">
									<text>查看更多</text>
									<uni-icons type="forward" size="18" color="#666"></uni-icons>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="nodata" v-if="albumList.length == 0">
					<image src="https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/nodata.png"
						mode="widthFix"></image>
				</view>
			</view>

			<view class="list" v-if="tabIndex == 1">
				<view class="item" v-for="item in approveList">
					<view class="thumb" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)" v-if="item.paperInfo.imgUrl">
						<image
							:src="config.staticUrl + item.paperInfo.pdfHash + '/' + item.paperInfo.imgUrl.split(',')[0]"
							mode="widthFix"></image>
					</view>
					<!-- <view class="title" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)">
						{{ item.paperInfo.title || '' }}
					</view> -->
					<view class="title bolder" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)">
						{{ item.paperInfo.title }}
					</view>
					<view class="title color" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)"
						v-if="item.summary[0]">{{ item.paperInfo.summary[0].titleZh }}
					</view>
					<view class="bottom">
						<view class="source_box">
							<!-- <image :src="item.avatar" mode="widthFix" class="avatar"></image> -->
							<!-- <text>{{ item.paperInfo.authors || ''}}</text> -->
						</view>
						<view class="btn_box">
							<!-- <view class="btn" v-if="item.isJoin">加入待阅</view>
						<view class="join-btn" v-else>已加入</view> -->
							<!-- <uni-icons type="hand-up" size="14"></uni-icons> 123 -->
						</view>
					</view>
				</view>


			</view>

			<view class="subTab_box" v-if="tabIndex == 2">
				<view class="item" :class="{'active':subTabIndex2 == 0}" @click="changeSubTab(2,0)">浏览历史</view>
				<view class="item" :class="{'active':subTabIndex2 == 1}" @click="changeSubTab(2,1)">总结历史</view>
			</view>
			
			<view class="list" v-if="tabIndex == 2 && subTabIndex2 == 0">
				<view class="item" v-for="item in sHistoryList">
					<view class="thumb" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)" v-if="item.paperInfo && item.paperInfo.imgUrl">
						<image
							:src="config.staticUrl + item.paperInfo.pdfHash + '/' + item.paperInfo.imgUrl.split(',')[0]"
							mode="widthFix"></image>
					</view>
					<!-- <view class="title" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)">
						{{ item.paperInfo.title }}
					</view> -->
					<view class="title bolder" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)">
						{{ item.paperInfo.title }}
					</view>
					<view class="title color" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)"
						v-if="item.summary[0]">{{ item.paperInfo.summary[0].titleZh }}
					</view>
					<view class="bottom">
						<view class="source_box">
							<!-- <image :src="item.avatar" mode="widthFix" class="avatar"></image> -->
							<!-- <text>{{ item.paperInfo.authors || ''}}</text> -->
						</view>
						<view class="btn_box">
							<!-- <view class="btn" v-if="item.isJoin">加入待阅</view>
						<view class="join-btn" v-else>已加入</view> -->
							<!-- <uni-icons type="hand-up" size="14"></uni-icons> 123 -->
						</view>
					</view>
				</view>

			</view>

			<view class="list" v-if="tabIndex == 2 && subTabIndex2 == 1">
				<view class="item" v-for="item in zHistoryList">
					<view class="thumb" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)" v-if="item.paperInfo.imgUrl">
						<image
							:src="config.staticUrl + item.paperInfo.pdfHash + '/' + item.paperInfo.imgUrl.split(',')[0]"
							mode="widthFix"></image>
					</view>
					<!-- <view class="title" @click="navTo(`/pages/home/detail/detail?id=${item.paperInfo.id}`)">
						{{ item.paperInfo.title }}
					</view> -->
					<view class="title bolder" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)">
						{{ item.paperInfo.title }}
					</view>
					<view class="title color" @click="navTo(`/pages/home/detail/detail?id=${item.id}`)"
						v-if="item.summary[0]">{{ item.paperInfo.summary[0].titleZh }}
					</view>
					<view class="bottom">
						<view class="source_box">
							<!-- <image :src="item.avatar" mode="widthFix" class="avatar"></image> -->
							<!-- <text>{{ item.paperInfo.authors || ''}}</text> -->
						</view>
						<view class="btn_box">
							<!-- <view class="btn" v-if="item.isJoin">加入待阅</view>
						<view class="join-btn" v-else>已加入</view> -->
							<!-- <uni-icons type="hand-up" size="14"></uni-icons> 123 -->
						</view>
					</view>
				</view>

			</view>
		</view>
		<uni-drawer ref="showLeft" mode="left" :width="220" @change="change($event,'showLeft')">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- @click="closeDrawer('showLeft')" -->
			<view class="logo_box">
				<view class="logo">
					<image src="/static/logo.png" mode="widthFix"></image>
					<text>量拾</text>
				</view>
				<uni-icons type="closeempty" size="18" color="#999" @click="closeDrawer('showLeft')"></uni-icons>
			</view>

			<view class="card_box">
				<view class="item" @click="navTo(`/pages/mine/info/index`)">
					<text>个人资料</text>
					<uni-icons type="forward" size="16" color="#999"></uni-icons>
				</view>
				<view class="item" @click="navTo(`/pages/public/about`)">
					<text>关于我们</text>
					<uni-icons type="forward" size="16" color="#999"></uni-icons>
				</view>
			</view>

			<view class="card_box">
				<view class="item" @click="navTo(`/pages/public/weixin`)">
					<text>公众号</text>
					<uni-icons type="forward" size="16" color="#999"></uni-icons>
				</view>
				<view class="item" @click="navTo(`/pages/public/join`)">
					<text>加入交流群</text>
					<uni-icons type="forward" size="16" color="#999"></uni-icons>
				</view>
				<view class="item" @click="navTo(`/pages/public/feedback`)">
					<text>用户反馈</text>
					<uni-icons type="forward" size="16" color="#999"></uni-icons>
				</view>
				<view class="item" @click="navTo(`/pages/public/protocol`)">
					<text>用户协议</text>
					<uni-icons type="forward" size="16" color="#999"></uni-icons>
				</view>

				<view class="item" @click="navTo(`/pages/public/privacy`)">
					<text>隐私政策</text>
					<uni-icons type="forward" size="16" color="#999"></uni-icons>
				</view>

				<view class="item" @click="handleLogout">
					<text>退出登录</text>
					<uni-icons type="forward" size="16" color="#999"></uni-icons>
				</view>

			</view>

		</uni-drawer>

		<view class="nodata" v-if="approveList.length == 0 && tabIndex == 1 && user.openId">
			<image src="https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/nodata.png" mode="widthFix">
			</image>
		</view>

		<view class="nodata" v-if="sHistoryList.length == 0 && tabIndex == 2 && subTabIndex2 == 0 && user.openId">
			<image src="https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/nodata.png" mode="widthFix">
			</image>
		</view>

		<view class="nodata" v-if="zHistoryList.length == 0 && tabIndex == 2 && subTabIndex2 == 1 && user.openId">
			<image src="https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/nodata.png" mode="widthFix">
			</image>
		</view>
	</view>
</template>

<script>
	import config from '@/config'
	import {
		getUser,
		setUser,
		removeToken,
		removeUser
	} from '@/utils/auth'

	import {
		searchHistory,
		statistic,
		searchMyLike,
		searchSummaryHistory,
		scarchFavorite,
		scarchFavoritePaper
	} from '@/api/mine/index.js'

	import {
		insertWxUser,
		getOpenId
	} from '@/api/login.js'

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
				tabIndex: 1,
				subTabIndex1: 1,
				subTabIndex2: 0,
				showLeft: false,
				statusBarHeight: 40,
				user: {},
				sHistoryQuery: {
					pageNum: 1,
					pageSize: 10
				},
				sHistoryList: [],
				zHistoryQuery: {
					pageNum: 1,
					pageSize: 10
				},
				zHistoryList: [],
				approveList: [],
				approveQuery: {
					pageNum: 1,
					pageSize: 10
				},
				articleList: [],
				articleQuery: {
					favoriteId: '',
					pageNum: 1,
					pageSize: 10,
				},
				albumList: [],
				albumQuery: {
					pageNum: 1,
					pageSize: 10
				},
				report: {},
			}
		},
		onLoad() {
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()["statusBarHeight"] || 44;
			// if (getMajor()) {
			// 	this.aiMajor = getMajor().split(',');
			// }
			// this.getDict('pap_specialty_type');
			// this.getUser()
		},
		onReady() {
			// this.$refs.form.setRules(this.rules)
		},
		onShow() {
			if (this.showLeft) {
				this.$refs.showLeft.close()
			}
			this.sHistoryList = [];
			this.zHistoryList = [];
			this.approveList = [];
			this.articleList = [];
			this.albumList = [];
			this.sHistoryQuery = {
				pageNum: 1,
				pageSize: 10
			};
			this.zHistoryQuery = {
				pageNum: 1,
				pageSize: 10
			};
			this.approveQuery = {
				pageNum: 1,
				pageSize: 10
			};
			this.articleQuery = {
				favoriteId: '',
				pageNum: 1,
				pageSize: 10,
			};
			this.albumQuery = {
				pageNum: 1,
				pageSize: 10
			};
			if (getUser()) {
				this.user = JSON.parse(getUser()) || {};
				this.getSearchMyLike();
				this.getSearchHistory();
				this.getSearchSummaryHistory();
				this.getStatistic();
				this.getScarchFavorite();
				this.getScarchFavoritePaper();
			}
		},
		// onNavigationBarButtonTap(e) {
		// 	if (this.showLeft) {
		// 		this.$refs.showLeft.close()
		// 	} else {
		// 		this.$refs.showLeft.open()
		// 	}
		// },
		onUnload() {
			if (this.showLeft) {
				this.$refs.showLeft.close()
			}
		},
		// 下拉到底部后加载新数据
		onReachBottom() {
			var that = this;
			// 判断下一页是否存在数据，不存在将显示暂无数据等提示语
			// if (that.activityList.length == that.query.total) {
			// 	that.noMoreData = true;
			// 	return false;
			// }
			// if(this.tabIndex == 0){
			// 	that.queryRead.pageNum++; //页数加一
			// 	that.getArticlesRead(); //回调接口
			// }
			// if(this.tabIndex == 1){
			// 	that.query.pageNum++; //页数加一
			// 	that.getArticles(); //回调接口
			// }

			if (that.tabIndex == 0) {
				if (that.subTabIndex1 == 1) {
					that.articleQuery.pageNum++; //页数加一
					that.getScarchFavoritePaper();
				}

				if (that.subTabIndex2 == 2) {
					// that.getScarchFavorite();
				}
			}

			if (that.tabIndex == 1) {
				that.approveQuery.pageNum++; //页数加一
				that.getSearchMyLike();
			}

			if (that.tabIndex == 2) {
				if (that.subTabIndex2 == 1) {
					that.sHistoryQuery.pageNum++; //页数加一
					that.getSearchHistory();
				}

				if (that.subTabIndex2 == 2) {
					that.zHistoryQuery.pageNum++; //页数加一
					that.getSearchSummaryHistory();
				}
			}
		},
		// app端拦截返回事件 ，仅app端生效
		onBackPress() {
			if (this.showRight || this.showLeft) {
				this.$refs.showLeft.close()
				this.$refs.showRight.close()
				return true
			}
		},
		methods: {
			resetData(){
				this.sHistoryQuery = {
					pageNum: 1,
					pageSize: 10
				};
				this.sHistoryList = [];
				this.zHistoryQuery =  {
					pageNum: 1,
					pageSize: 10
				};
				this.zHistoryList = [],
				this.approveList =  [],
				this.approveQuery =  {
					pageNum: 1,
					pageSize: 10
				};
				this.articleList =  [];
				this.articleQuery =  {
					favoriteId: '',
					pageNum: 1,
					pageSize: 10,
				};
				this.albumList =  [];
				this.albumQuery =  {
					pageNum: 1,
					pageSize: 10
				};
			},
			onChooseAvatar(e) {
				var that = this;
				const {
					avatarUrl
				} = e.detail;

				that.user.avatar = avatarUrl;

				that.submit();
			},
			getScarchFavorite() {
				var that = this;
				scarchFavorite({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					// pageNum: that.approveQuery.pageNum,
					// pageSize: that.approveQuery.pageSize,
				}).then(response => {
					that.albumList = that.albumList.concat(response);
				})
			},
			getScarchFavoritePaper() {
				var that = this;
				scarchFavoritePaper({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					favoriteId: that.articleQuery.favoriteId || 0,
					pageNum: that.articleQuery.pageNum,
					pageSize: that.articleQuery.pageSize,
				}).then(response => {
					that.articleList = that.articleList.concat(response);
				})
			},
			getSearchMyLike() {
				var that = this;
				searchMyLike({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					pageNum: that.approveQuery.pageNum,
					pageSize: that.approveQuery.pageSize,
				}).then(response => {
					that.approveList = that.approveList.concat(response);
				})
			},
			getStatistic() {
				var that = this;
				statistic({
					userId: that.user.id || null,
					openId: that.user.openId || '',
				}).then(response => {
					that.report = response;
				})
			},
			getSearchHistory() {
				var that = this;
				searchHistory({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					pageNum: that.sHistoryQuery.pageNum,
					pageSize: that.sHistoryQuery.pageSize,
				}).then(response => {
					that.sHistoryList = that.sHistoryList.concat(response);
					console.log(that.sHistoryList);
				})
			},
			getSearchSummaryHistory() {
				var that = this;
				searchSummaryHistory({
					userId: that.user.id || null,
					openId: that.user.openId || '',
					email: that.user.email || '',
					pageNum: that.zHistoryQuery.pageNum,
					pageSize: that.zHistoryQuery.pageSize,
				}).then(response => {
					that.zHistoryList = that.zHistoryList.concat(response);
				})
			},
			changeSubTab(type, index) {
				var that = this;
				this.resetData();
				if (type == 0) {
					this.subTabIndex1 = index;
					
					this.getStatistic();
					
					if(this.subTabIndex1 == 0){
						this.getScarchFavoritePaper();
					}
					
					if(this.subTabIndex1 == 1){
						this.getScarchFavorite();
					}
					
					// if(this.subTabIndex1 == 1){
					// 	this.articleList = [];
					// 	this.articleQuery = {
					// 		pageNum: 1,
					// 		pageSize: 10,
					// 	}
					// 	this.getScarchFavoritePaper();
					// }

					// if(this.subTabIndex1 == 2){
					// 	this.albumList = [];
					// 	this.albumQuery = {
					// 		pageNum: 1,
					// 		pageSize: 10,
					// 	}
					// 	this.getScarchFavorite();
					// }
				}

				if (type == 2) {
					this.subTabIndex2 = index;
					
					if(this.subTabIndex2 == 0){
						this.getSearchHistory();
					}
					
					if (index == 1 && ! this.user.email) {
						uni.showModal({
							title: '提示',
							content: "请进行邮箱绑定！",
							cancelText: '取消',
							confirmText: '确定',
							success: function(res) {
								if(res.confirm){
									that.navTo('/pages/mine/info/bindEmail');
								}
							}
						})
						
						return false;
					}else{
						this.getSearchSummaryHistory();
					}
					
					// if(this.subTabIndex2 == 1){
					// 	this.sHistoryList = [];
					// 	this.sHistoryQuery = {
					// 		pageNum: 1,
					// 		pageSize: 10,
					// 	}
					// 	this.getSearchHistory();
					// }

					// if(this.subTabIndex2 == 2){
					// 	this.zHistoryList = [];
					// 	this.zHistoryQuery = {
					// 		pageNum: 1,
					// 		pageSize: 10,
					// 	}
					// 	this.getSearchSummaryHistory();
					// }

				}
			},
			changeTab(index) {
				if (this.tabIndex == index) {
					return false;
				}

				this.tabIndex = index;
				this.resetData();
				this.getStatistic();
				
				if(this.tabIndex == 0){
					this.getScarchFavorite();
				}
				
				if(this.tabIndex == 1){
					this.getSearchMyLike();
				}
				
				if(this.tabIndex == 2){
					this.getSearchHistory();
				}
				// if(this.tabIndex == 0){
				// 	this.articleList = [];
				// 	this.articleQuery = {
				// 		pageNum: 1,
				// 		pageSize: 10,
				// 	}
				// 	this.getScarchFavoritePaper();
				// }

				// if(this.tabIndex == 1){
				// 	this.approveList = [];
				// 	this.approveQuery = {
				// 		pageNum: 1,
				// 		pageSize: 10,
				// 	}
				// 	this.getSearchMyLike();
				// }

				// if(this.tabIndex == 2){
				// 	this.zHistoryList = [];
				// 	this.zHistoryQuery = {
				// 		pageNum: 1,
				// 		pageSize: 10,
				// 	}
				// 	this.getSearchHistory();
				// }

				// 	if (this.tabIndex == 0) {
				// 		this.animationSetting[1].modeClass = ['fade', 'slide-right'];
				// 		this.animationSetting[1].show = false;
				// 		this.animationSetting[0].modeClass = ['fade', 'slide-left'];
				// 		this.animationSetting[0].show = true;
				// 	}

				// 	if (this.tabIndex == 1) {
				// 		this.animationSetting[1].modeClass = ['fade', 'slide-right'];
				// 		this.animationSetting[1].show = true;
				// 		this.animationSetting[0].modeClass = ['fade', 'slide-left'];
				// 		this.animationSetting[0].show = false;
				// 	}
			},
			// 打开窗口
			showDrawer(e) {
				this.$refs[e].open()
			},
			// 关闭窗口
			closeDrawer(e) {
				this.$refs[e].close()
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
					birthday: that.user.birthday,
					educational: that.user.educational,
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
			navTo(url) {
				this.$refs.showLeft.close();
				this.$tab.navigateTo(url)
			},
			handleLogout() {
				this.$modal.confirm('确定注销并退出系统吗？').then(() => {
					removeToken();
					removeUser();
					this.$tab.reLaunch('/pages/index')
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		background-image: url("https://btgongpluss.oss-cn-beijing.aliyuncs.com/wxapp/images/mine-chatpaper-bg.png");
		background-repeat: no-repeat;
		background-size: 100% auto;
	}

	.bar_box {
		height: 72rpx;
		line-height: 72rpx;
	}

	/deep/ .uni-drawer__content {
		background-color: #0e0e10 !important;
		padding: 30rpx 20rpx;
	}

	.logo_box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		align-self: center;
		margin-bottom: 30rpx;

		.logo {
			display: flex;
			flex-direction: row;
			align-items: center;
			align-content: center;
			align-self: center;

			text {
				font-size: 36rpx;
				color: #fff;
				margin-left: 20rpx;
				font-weight: bolder;
			}
		}



		image {
			width: 64rpx;
		}
	}

	.per_box {
		height: 80rpx;
		color: #fff;
		font-size: 28rpx;
		padding: 10rpx 20rpx;
		margin: 20rpx 0;
	}

	.card_box {
		width: 100%;
		background-color: #1a191e;
		border-radius: 6rpx;
		margin-bottom: 30rpx;
		padding: 0rpx 20rpx;



		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			align-content: center;
			align-self: center;
			color: #999;
			border-bottom: 1rpx solid #5a595c;
			font-size: 26rpx;
			padding: 30rpx 0rpx;
		}

		.item:last-child {
			border-bottom: none;
		}
	}

	.info_box {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		padding-top: 20rpx;
		margin-top: 20rpx;

		.scale2 {
			image {
				transform: scale(2);
			}
		}

		.avatar_box {
			width: 120rpx;
			height: 120rpx;
			background: #E1E6EF;
			box-shadow: 0rpx 4rpx 26rpx 0rpx rgba(0, 101, 224, 0.25);
			border-radius: 50%;
			border: 4rpx solid #fff;
			box-sizing: border-box;
			overflow: hidden;

			image {
				border-radius: 50%;
				width: 120rpx;
				height: 120rpx;

			}

			button {
				width: 114rpx;
				height: 114rpx;
				border: none;
				background: none !important;
				outline: none;
				display: flex;
				align-items: center;
				// margin-top: -2px;
				// margin-left: -2rpx;
			}

			button::after {
				border: none;
			}
		}

		.login_box {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: center;
			color: #fff;
			margin-left: 20rpx;
			font-size: 28rpx;

			text:first-child {
				margin-bottom: 20rpx;
			}

		}

	}

	.section_box_1 {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		padding: 40upx 0;

		.item {
			width: 33%;
			color: #fff;
			text-align: center;
			border-right: 1px solid #fff;

			.num {
				font-size: 28upx;
				font-weight: bold;
			}

			.title {
				margin-top: 10upx;
				font-size: 28upx;
				letter-spacing: 2upx;
			}
		}

		.item:last-child {
			border-right: none;
		}
	}

	.topBar {
		// position: absolute;
		/*#ifdef  H5*/
		// top: 0;
		/*#endif*/
		// top: -1rpx;
		// left: 0;
		width: 100%;
		// padding-left: 20rpx;
		// padding-right: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		// margin-bottom: 30rpx;
		padding-bottom: 15rpx;
		// z-index: 66;
		background-color: #f5f8fa;
		margin: 20rpx 0;
	}

	.tab_box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		font-size: 32rpx;

		.item {
			margin: 0 30rpx;
			padding: 10rpx 0;
		}

		.active {
			color: #3B00FF;
			font-weight: bold;
			border-bottom: 4rpx solid #3B00FF;
		}
	}

	.list {
		position: relative;
		column-count: 2;
		column-gap: 30rpx;
		// padding-top: 150rpx;

		.item {
			width: 100%;
			margin-bottom: 30rpx;
			padding-bottom: 10rpx;
			break-inside: avoid;
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 6rpx;

			image {
				width: 100%;
				display: block;
				border-radius: 6rpx;
			}

			.title {
				width: 100%;
				// max-height: 86rpx;
				padding: 10rpx 15rpx;
				color: #333;
				word-break: normal;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// -webkit-line-clamp: 2;
				// display: -webkit-box;
				// -webkit-box-orient: vertical
			}

			.bottom {
				padding: 10rpx 15rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				align-content: center;

				.source_box {
					display: flex;
					flex-direction: row;
					align-items: center;
					align-content: center;

					.avatar {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
					}

					text {
						font-size: 24rpx;
						color: #999;
						margin-left: 10rpx;
					}
				}

				.btn_box {
					font-size: 24rpx;

					.btn {
						background-color: #3B00FF;
						color: #fff;
						border-radius: 20rpx;
						padding: 5rpx 15rpx;
					}

					.join-btn {
						color: #3B00FF;
						border: 1px solid #3B00FF;
						border-radius: 20rpx;
						padding: 5rpx 15rpx;
					}
				}

			}

		}
	}

	.subTab_box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		border-top: 1px solid #E1E6EF;
		border-bottom: 1px solid #E1E6EF;
		margin-bottom: 30rpx;
		margin-top: -15rpx;

		.item {
			color: #666;
			font-size: 28rpx;
			padding: 10rpx 30rpx;
			margin: 20rpx 30rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			.circle {
				display: inline-block;
				width: 8rpx;
				height: 8rpx;
				background: #666666;
				border-radius: 50%;
				margin: 0 10rpx;
			}
		}

		.active {
			background-color: #3B00FF;
			color: #fff;
			border-radius: 50rpx;

			.circle {
				background: #fff;
			}
		}
	}

	.list_1 {
		position: relative;
		// padding-top: 84rpx;

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

	.album {
		margin-bottom: 30rpx;

		/deep/.uni-icons {
			color: #3B00FF !important;
			font-size: 50rpx !important;
		}

		/deep/.uni-list-item__content-title {
			color: #3B00FF;
			font-size: 32rpx;
		}

	}

	.list_2 {
		position: relative;

		.notice {
			padding-bottom: 40rpx;

			.notice-item {
				margin-bottom: 30rpx;

				.image_list {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					align-content: center;

					.image_item {
						width: 22%;
						margin-right: 3%;

						image {
							width: 100%;
						}
					}
				}
			}
		}

		.time {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 60rpx;
			padding-top: 10rpx;
			font-size: 28rpx;
			color: #999;
		}

		.content {
			width: 100%;
			padding: 30rpx 20rpx;
			background-color: #fff;
			border-radius: 2rpx;

			.title {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid #eee;
			}

			.bot {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				color: #666;
				position: relative;
			}
		}
	}

	.no-login {
		margin-top: 100rpx;
		color: #999;
		text-align: center;

		.text {
			margin-top: 20rpx;
			font-weight: bold;
			font-size: 36rpx;
		}
	}
</style>