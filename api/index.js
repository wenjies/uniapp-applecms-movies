import {
	http
} from '@/api/service.js';

export default {
	/**
	 * 获取顶部Tbs同获取父分类
	 */
	getTabs(type) {
		return http.get('/class/parent/' + type, {})
	},
	/**
	 * 获取父分类下的子分类
	 */
	getSonClass(parent_id) {
		return http.get('/class/son/' + parent_id, {})
	},
	/**
	 * 获取幻灯图
	 * @param {Object} params
	 */
	getSlide(params) {
		return http.get('/vod/slide', {
			params
		})
	},
	/**
	 * 今日更新影片
	 * @param {Object} params
	 */
	getVodToday(params) {
		return http.get('/vod/today', {
			params
		})
	},
	/**
	 * 获取热门数据
	 * @param {Object} type
	 * @param {Object} time
	 * @param {Object} params
	 */
	getHits(type, time, params) {
		return http.get('/' + type + '/hits/' + time, {
			params
		})
	},
	/**
	 * 获取最新数据
	 * @param {Object} type
	 * @param {Object} params
	 */
	getNews(type, params) {
		return http.get('/' + type + '/list', {
			params
		})
	},

	/**
	 * 获取详情数据
	 * @param {Object} type
	 * @param {Object} params
	 */
	getDetail(type, id) {
		return http.get('/' + type + '/detail/' + id)
	},

	/**
	 * 获取搜索关键词联想列表
	 * @param {Object} keyword
	 */
	getSearchThink(type, keyword) {
		return http.post('/search/' + type + '/think', {
			keyword: keyword
		})
	},

	/**
	 * 获取热门搜索
	 */
	getHotSearch() {
		return http.get('/search/hits')
	},

	/**
	 * 通过关键词搜索内容
	 */
	getSearch(type, keyword, sort = 'time', page = 1, pageSize = 12) {
		return http.post('/search/' + type, {
			keyword: keyword,
			sort: sort,
			page: page,
			pageSize: pageSize
		})
	},

	/**
	 * 用户帐号密码登录
	 */
	login(username, password) {
		return http.post('/user/login', {
			username: username,
			password: password
		})
	},

	/**
	 * 用户手机号登录
	 */
	phoneLogin(phone, code) {
		return http.post('/user/phoneLogin', {
			phone: phone,
			code: code
		})
	},

	/**
	 * 获取验证码
	 */
	sendCode(phone) {
		return http.post('/user/sendCode', {
			phone: phone
		})
	},

	/**
	 * 记录用户设备
	 */
	createDevice(params) {
		return http.post('/device/create', {
			model: params.model,
			system: params.system,
			platform: params.platform,
			deviceId: params.deviceId,
			brand: params.brand
		})
	},

	/**
	 * 获取用户信息
	 */
	getUserInfo() {
		return http.get('/user/info');
	},

	/**
	 * 创建影片浏览记录
	 */
	createVodUlog(rid, sid, nid, nid_name) {
		return http.post('/ulog/create/vod', {
			ulog_type: 4,
			ulog_rid: rid,
			ulog_sid: sid,
			ulog_nid: nid,
			ulog_nid_name: nid_name
		});
	},

	/**
	 * 获取用户浏览记录
	 */
	getUserHistory(type, params) {
		return http.get('/ulog/' + type, {
			params
		});
	},

	/**
	 * 获取用户影片收藏记录
	 */
	getUserVodCollect(params) {
		return http.get('/ulog/vodCollect', {
			params
		});
	},

	/**
	 * 获取用户影片点赞记录
	 */
	getUserVodSupport(params) {
		return http.get('/ulog/vodSupport', {
			params
		});
	},
	/**
	 * 更新影片播放记录
	 */
	updateVodUlog(rid, second, duration) {
		return http.post('/ulog/update/vod/progress', {
			ulog_rid: rid,
			second: second,
			duration: duration
		});
	},

	/**
	 * 删除记录
	 * @param {Number} id
	 */
	deleteUlog(id) {
		return http.get('/ulog/delete/' + id);
	},

	/**
	 * 批量删除记录
	 * @param {Array} id
	 */
	deletesUlog(id) {
		return http.post('/ulog/deletes', {
			ulog_ids: id
		});
	},

	/**
	 * 用户点赞
	 * @param {Object} type
	 * @param {Object} params
	 */
	support(type, id) {
		return http.post('/support/' + type + '/' + id);
	},

	/**
	 * 用户收藏
	 * @param {Object} params
	 */
	collect(type, id) {
		return http.post('/collect/' + type + '/' + id);
	},

	/**
	 * 修改头像
	 * @param {Object} path
	 */
	changeAvatar(path) {
		return http.upload('/user/changeAvatar', {
			filePath: path,
			name: 'avatar'
		});
	},

	/**
	 * 修改资料
	 */
	changeInfo(params) {
		return http.post('/user/changeInfo', params);
	}
}
