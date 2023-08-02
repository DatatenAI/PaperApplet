const TokenKey = 'App-Token'
const UserKey = 'App-User'
const WeixinKey = 'App-Weixin'
export function getToken() {
  return uni.getStorageSync(TokenKey)
}

export function setToken(token) {
  return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey)
}

export function getUser() {
  return uni.getStorageSync(UserKey)
}

export function setUser(user) {
  return uni.setStorageSync(UserKey, user)
}

export function removeUser() {
  return uni.removeStorageSync(UserKey)
}


export function getWeixin() {
  return uni.getStorageSync(WeixinKey)
}

export function setWeixin(weixin) {
  return uni.setStorageSync(WeixinKey, weixin)
}

export function removeWeixin() {
  return uni.removeStorageSync(WeixinKey)
}