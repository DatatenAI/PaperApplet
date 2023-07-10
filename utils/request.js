import store from '@/store'
import config from '@/config'
import {
	getUser,
	getToken
} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {
	toast,
	showConfirm,
	tansParams,
	showLoading,
	hideLoading
} from '@/utils/common'
import qs from 'qs'

let timeout = 320000
const baseUrl = config.baseUrl

const request = config => {
	showLoading();
	// 是否需要设置 token
	const isToken = (config.headers || {}).isToken === false
	config.header = config.header || {}
	if (getToken() && !isToken) {
		// config.header['Authorization'] = 'Bearer ' + getToken()
		// var user =  JSON.parse(getToken())  || {};
		// debugger
		config.header['Authorization'] = getToken();
	}
	// get请求映射params参数
	if (config.params) {
		let url = config.url + '?' + tansParams(config.params)
		url = url.slice(0, -1)
		config.url = url
	}
	return new Promise((resolve, reject) => {
		var reqBody = {
			batch: 1,
			input: {
				"0": {
					"json": config.data
				}
			},
		}

		var reqUrl = config.baseUrl || baseUrl + config.url;

		if (config.method.toLowerCase() == 'post') {
			reqUrl = `${reqUrl}?${qs.stringify({
				batch: 1,
			})}`
			
			reqBody = {
				"0":{
					"json": config.data
				}
			}
		}
		// console.log(reqUrl);
		// console.log(JSON.stringify(reqBody));
		uni.request({
				method: config.method || 'get',
				timeout: config.timeout || timeout,
				url: reqUrl,
				data:reqBody,
				// url: config.baseUrl || baseUrl + config.url,
				// data: {
				// 	batch: 1,
				// 	input: {
				// 		"0": {
				// 			"json": config.data
				// 		}
				// 	},
				// },
				header: config.header,
				dataType: 'json'
			}).then(response => {
				hideLoading();
				// console.log("test:" + JSON.stringify(response));
				let [error, res] = response
				if (error) {
					toast('后端接口连接异常')
					reject('后端接口连接异常')
					return
				}
				const data = res.data[0];
				const code = res.statusCode || 200
				const msg = errorCode[code] || errorCode['default']
				
				if (code === 401) {
					showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login'
							})
							// store.dispatch('LogOut').then(res => {
							// 	uni.reLaunch({
							// 		url: '/pages/login'
							// 	})
							// })
						}
					})
					reject('无效的会话，或者会话已过期，请重新登录。')
				} else if (code === 403) {
					toast(data.error.json.message)
					return false;
					// resolve(data.error.json);
				}else if (code === 500) {
					toast(msg)
					reject('500')
				} else if (code !== 200) {
					toast(msg)
					reject(code)
				}
				resolve(data.result.data.json);
			})
			.catch(error => {
				let {
					message
				} = error
				if (message === 'Network Error') {
					message = '后端接口连接异常'
				} else if (message.includes('timeout')) {
					message = '系统接口请求超时'
				} else if (message.includes('Request failed with status code')) {
					message = '系统接口' + message.substr(message.length - 3) + '异常'
				}
				toast(message)
				reject(error)
			})
	})
}

export default request