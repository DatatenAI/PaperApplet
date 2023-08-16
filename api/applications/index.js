import request from '@/utils/request'

// 查询文章 订阅
export function searchConferencePaper(query) {
  return request({
    url: '/api/trpc/wepaper.searchConferencePaper',
    method: 'get',
    data: query
  })
}