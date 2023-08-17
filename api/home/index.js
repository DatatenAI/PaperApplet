import request from '@/utils/request'

// 查询文章 订阅
export function searchPaper(query) {
  return request({
    url: '/api/trpc/wepaper.searchPaper',
    method: 'get',
    data: query
  })
}

// 查询文章 详情
export function paperDetail(query) {
  return request({
    url: '/api/trpc/wepaper.paperDetail',
    method: 'get',
    data: query
  })
}

// 查询文章 待阅
export function searchMyRead(query) {
  return request({
    url: '/api/trpc/wepaper.searchMyRead',
    method: 'get',
    data: query
  })
}


// 添加订阅关键字
export function subscribeKeywords(query) {
  return request({
    url: '/api/trpc/wepaper.subscribeKeywords',
    method: 'get',
    data: query
  })
}

// 查询所有关键词 我的
export function searchKeyWords(query) {
  return request({
    url: '/api/trpc/wepaper.searchKeyWords',
    method: 'get',
    data: query
  })
}


// 订阅关键字 我的
export function searchMyKeyWords(query) {
  return request({
    url: '/api/trpc/wepaper.searchMyKeyWords',
    method: 'get',
    data: query
  })
}

// 添加待阅
export function addRead(query) {
  return request({
    url: '/api/trpc/wepaper.addRead',
    method: 'get',
    data: query
  })
}


// 添加订阅
export function addSubscribe(query) {
  return request({
    url: '/api/trpc/wepaper.addSubscribe',
    method: 'get',
    data: query
  })
}


// 取消订阅 
export function cancelSubscribe(query) {
  return request({
    url: '/api/trpc/wepaper.cancelSubscribe',
    method: 'get',
    data: query
  })
}


// 取消待阅
export function cancelRead(query) {
  return request({
    url: '/api/trpc/wepaper.cancelRead',
    method: 'get',
    data: query
  })
}

// 通知公告
export function searchInform(query) {
  return request({
    url: '/api/trpc/weapp.searchInform',
    method: 'get',
    data: query
  })
}

// 通知公告
export function informDetail(query) {
  return request({
    url: '/api/trpc/weapp.informDetail',
    method: 'get',
    data: query
  })
}

// 添加点赞
export function addLike(query) {
  return request({
    url: '/api/trpc/wxLike.addLike',
    method: 'get',
    data: query
  })
}

// 更新点踩
export function addDislike(query) {
  return request({
    url: '/api/trpc/wxLike.addDislike',
    method: 'get',
    data: query
  })
}

// 更新点赞
export function updateLike(query) {
  return request({
    url: '/api/trpc/wxLike.updateLike',
    method: 'Post',
    data: query,
	timeout: 20000
  })
}

// 取消点赞或点踩
export function cancelLike(query) {
  return request({
    url: '/api/trpc/wxLike.cancelLike',
    method: 'get',
    data: query
  })
}

// 点赞历史
export function searchMyLike(query) {
  return request({
    url: '/api/trpc/weapp.searchMyLike',
    method: 'get',
    data: query
  })
}


// 添加收藏
export function addFavoritePaper(query) {
  return request({
    url: '/api/trpc/wxFavorite.addFavoritePaper',
    method: 'post',
    data: query
  })
}

// 添加收藏
export function cancelFavorite(query) {
  return request({
    url: '/api/trpc/wxFavorite.cancelFavorite',
    method: 'get',
    data: query
  })
}

// 添加收藏
export function scarchFavorite(query) {
  return request({
    url: '/api/trpc/wxFavorite.scarchFavorite',
    method: 'get',
    data: query
  })
}

// 添加收藏
export function scarchFavoritePaper(query) {
  return request({
    url: '/api/trpc/wxFavorite.scarchFavoritePaper',
    method: 'get',
    data: query
  })
}
