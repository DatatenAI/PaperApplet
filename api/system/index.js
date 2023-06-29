import request from '@/utils/request'

// 获取所有关键字
export function searchKeyWords(query) {
  return request({
    url: '/api/trpc/weapp.searchKeyWords',
    method: 'get',
    data: query
  })
}

