import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import {
	login,
	logout,
	getInfo
} from '@/api/login'
import { getToken, setToken, removeToken} from '@/utils/auth'

const baseUrl = config.baseUrl

const user = {
	state: {
		token: getToken(),
		name: storage.get(constant.name),
		avatar: storage.get(constant.avatar),
		userId:undefined,
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_NAME: (state, name) => {
			state.name = name
			storage.set(constant.name, name)
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
			storage.set(constant.avatar, avatar)
		},
		SET_USERID: (state, userId) => {
		      state.userId = userId
		},
	},

	actions: {
		// 登录
		Login({
			commit
		}, userInfo) {
			const username = userInfo.username.trim()
			const password = userInfo.password
			const code = userInfo.code
			const uuid = userInfo.uuid
			return new Promise((resolve, reject) => {
				login(username, password, code, uuid).then(res => {
					setToken(res.data)
					commit('SET_TOKEN', res.data)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 获取用户信息
		GetInfo({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				getInfo().then(res => {
					const name = res.data.name;
					setName(res.data.name)
					commit('SET_NAME', res.data.name)
					commit('SET_USERID', res.data.id)
					setMajor(res.data.aiMajor);
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 退出系统
		LogOut({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				logout(state.token).then(() => {
					commit('SET_TOKEN', '')
					commit('SET_ROLES', [])
					commit('SET_PERMISSIONS', [])
					removeToken()
					removeName()
					removeMajor()
					storage.clean()
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}
	}
}

export default user