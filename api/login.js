import request from '@/utils/request'

// 完善用户信息
export function insertWxUser(data) {
  return request({
    url: '/api/trpc/weapp.insertWxUser',
    headers: {
      isToken: false
    },
    method: 'post',
	data: data,
    timeout: 20000
  })
}

// 获取openid
export function getOpenId(data) {
  return request({
    url: '/api/trpc/weapp.getOpenId',
    headers: {
      isToken: false
    },
    method: 'get',
	data: data,
    timeout: 20000
  })
}
