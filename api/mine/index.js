import request from '@/utils/request'

// 绑定邮箱 接口
export function bindEmail(data) {
  return request({
    url: '/api/trpc/weapp.bindEmail',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

// 获取绑定邮箱验证码 接口
export function getCode(data) {
  return request({
    url: '/api/trpc/weapp.getCode',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

// 查询历史 接口 参数 userId,openId,pageNum,pageSize
export function searchHistory(data) {
  return request({
    url: '/api/trpc/wxHistory.searchHistory',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

// 创建收藏夹 接口   userId,openId,favoriteName  收藏夹名称
export function addFavorite(data) {
  return request({
    url: '/api/trpc/wxFavorite.addFavorite',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

export function editFavorite(data) {
  return request({
    url: '/api/trpc/wxFavorite.editFavorite',
    method: 'Post',
	data: data,
    timeout: 20000
  })
}

// 创建反馈 接口   userId,openId,favoriteName  收藏夹名称
export function addFeedback(data) {
  return request({
    url: '/api/trpc/weapp.addFeedback',
    method: 'Post',
	data: data,
    timeout: 20000
  })
}

// 创建反馈 接口   userId,openId,favoriteName  收藏夹名称
export function searchCommunication(data) {
  return request({
    url: '/api/trpc/weapp.searchCommunication',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

//总结历史  userId,openId,favoriteName  收藏夹名称  get请求  参数  pageNum,pageSize,email 
export function searchSummaryHistory(data) {
  return request({
    url: '/api/trpc/wxHistory.searchSummaryHistory',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

//点赞 get请求  userId,openId,pageNum,pageSize 点赞历史
export function searchMyLike(data) {
  return request({
    url: '/api/trpc/wxLike.searchMyLike',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

//收藏 专辑列表  参数 userId,openId 
export function scarchFavorite(data) {
  return request({
    url: '/api/trpc/wxFavorite.scarchFavorite',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

//收藏 专辑内容 列表 userId,openId,pageNum,pageSize 分页获取所有收藏文章 
export function scarchFavoritePaper(data) {
  return request({
    url: '/api/trpc/wxFavorite.scarchFavoritePaper',
    method: 'get',
	data: data,
    timeout: 20000
  })
}

//数据统计接口
export function statistic(data) {
  return request({
    url: '/api/trpc/weapp.statistic',
    method: 'get',
	data: data,
    timeout: 20000
  })
}
