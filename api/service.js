// 引入全局配置文件
import $C from '@/common/config.js';
import Request from '@/utils/luch-request/index.js'

const getTokenStorage = () => {
	let token = ''
	try {
		token = uni.getStorageSync('token')
	} catch (e) {}
	return token
}

const http = new Request()

http.setConfig((config) => { /* 设置全局配置 */
	config.baseURL = $C.apiUrl
	return config
})

http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
	config.header = {
		...config.header,
		authorization: getTokenStorage()
	}
	return config
}, (config) => {
	return Promise.reject(config)
})


http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
	if (response.data.errorCode == 20003) {
		uni.showToast({
			title: '请先登录',
			icon: 'none',
			duration: 2000
		});
		return uni.navigateTo({
			url: '/pages/user/login/login'
		});
	}
	return response.data
}, (response) => {
	if (response.data.errorCode) {
		return uni.showToast({
			title: response.data.msg,
			icon: 'none',
			duration: 2000
		});
	}
	return Promise.reject(response)
})

export {
	http
}
