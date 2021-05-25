import Vue from 'vue'
import App from './App'
import store from './store/index.js';
import { http } from '@/api/service.js'
import api from '@/api/index.js';
import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.$store = store;

Vue.prototype.$http = http

Vue.prototype.$api = api;

Vue.config.productionTip = false

// 引入全局配置文件
import $C from '@/common/config.js';
Vue.prototype.$C = $C;

import $U from '@/common/util.js';
Vue.prototype.$U = $U;

Vue.prototype.checkAuth = (callback)=>{
	if(!store.state.loginStatus){
		setTimeout(()=>{
			uni.showToast({
				icon: 'none',
				title: '请先登录'
			});
		},300);
		return uni.navigateTo({
			url: '/pages/user/login/login'
		});
	}
	callback();
}

// 权限验证跳转
Vue.prototype.navigateTo = (options) => {
	if (!store.state.loginStatus) {
		setTimeout(()=>{
			uni.showToast({
				icon: 'none',
				title: '请先登录'
			});
		},300);
		return uni.navigateTo({
			url: '/pages/user/login/login',
		});
	}
	return uni.navigateTo(options);
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
