import $U from '@/common/util.js';
export default {
	data() {
		return {
			dtask: null,
			// 当前下载进度
			progress: [],
			// 下载总大小
			totalSize: [],
			// 已下载大小
			downSize: [],
			// 上次下载时间戳
			beforeTime: [],
			// 当前下载网速
			networkSpeed: [],
			// 状态说明文
			stateTextArr: ['正在连接服务器', '正在建立网络连接', '等待服务器响应', '正在下载', '已完成', '已暂停'],
			// 正在下载数
			downloading: []
		}
	},
	methods: {
		/**
		 * 创建下载任务
		 * @param {Object} requestUrl 请求下载地址
		 * @param {Boolean} isStart 是否立即开始下载  
		 */
		createTask(requestUrl,isStart = true) {
			let nowTask = plus.downloader.createDownload(requestUrl);
			if (isStart) nowTask.start();
			this.dtask = nowTask;
			return nowTask;
		},
		/**
		 * 设置任务缓存数据
		 * @param {Object} task
		 */
		setTaskCache(task) {
			let ids = uni.getStorageSync('vodCache_vids');
			let data = uni.getStorageSync('vodCache');
			if (!data) return;
			for (var i = 0; i < ids.length; i++) {
				let index = data.findIndex(v => v.vod_id == ids[i]);
				let index2 = data[index].download.findIndex(v => v.task_id == task.id);
				if(index2 == '-1') return;
				if (data[index].download[index2].task.state == 4) this.progress[task.id] == 100;
				if (this.progress[task.id] == 100) task.filename = plus.io.convertLocalFileSystemURL(task.filename);
				let info = {
					filename: task.filename,
					state: task.state,
					totalSize: task.totalSize,
					downloadSize: task.downloadedSize,
					stateText: this.stateTextArr[task.state] || '等待中',
					progress: this.progress[task.id] || 0,
					networkSpeed: this.networkSpeed[task.id] || 0
				};
				data[index].download[index2].task = info;
				uni.setStorageSync('vodCache', data);
				return data;
			}
		},
		/**
		 * 监听下载任务状态
		 * @param {Object} task
		 * @param {Object} status
		 */
		onStateChanged(task, status) {
			if (task.state == 3) {
				this.networkSpeed[task.id] = this.countNetworkSpeed(task.downloadedSize, this.downSize[task.id], this.beforeTime[
					task.id]);
				this.downSize[task.id] = task.downloadedSize;
				this.totalSize[task.id] = task.totalSize;
				this.beforeTime[task.id] = new Date().getTime();
				let nowProgress = Math.floor(task.downloadedSize * 100 / task.totalSize);
				if (this.progress[task.id] != nowProgress) {
					this.progress[task.id] = nowProgress;
					this.setTaskCache(task);
				}
			} else {
				this.networkSpeed[task.id] = 0;
				this.totalSize[task.id] = task.totalSize || 0;
				this.downSize[task.id] = task.downloadedSize || 0;
				this.progress[task.id] = Math.floor(task.downloadedSize * 100 / task.totalSize) || 0;
				this.beforeTime[task.id] = 0;
				this.setTaskCache(task);
			}
		},
		/** 
		 * 计算网速
		 * @param {Object} downloadedSize
		 * @param {Object} downloadSize
		 * @param {Object} beforeTime
		 */
		countNetworkSpeed(downloadedSize, downloadSize, beforeTime) {
			let nowTime = new Date().getTime();
			return (downloadedSize - downloadSize) * (1000 / (nowTime - beforeTime)) || 0;
		},
		/**
		 *  修改请求头信息
		 */
		setRequestHeader(name = 'Access-Control-Allow-Origin', value = '*') {
			this.dtask.setRequestHeader(name, value);
		},
		/**
		 * 开始下载所有任务
		 */
		startAllDownload() {
			plus.downloader.startAll();
		},
		/**
		 * 清理任务
		 * @param {Object} state 任务状态 
		 * 可参考onStateChanged方法中的state 代表你要清理什么状态的任务
		 * 如果没有指定state的值 则清除所有未完成的下载任务。
		 */
		clearDownload(state) {
			plus.downloader.clear(state);
		},
		/**
		 * 获取设备可用存储空间
		 */
		getSystemFreeSpace() {
			// #ifdef APP-PLUS
			let BundleClass = plus.ios.importClass("NSBundle");
			let BundleObj = BundleClass.mainBundle();
			let filenamagerobj = plus.ios.newObject("NSFileManager");
			let FileAttr = plus.ios.invoke(filenamagerobj, "attributesOfFileSystemForPath:error:", BundleObj.bundlePath(), null);
			// NSFileSystemFreeSize 参数获取剩余空间  
			// NSFileSystemSize  获取手机总存储空间  
			let freeSpace = plus.ios.invoke(FileAttr, "objectForKey:", "NSFileSystemFreeSize");
			let numberFormatterObj = plus.ios.newObject("NSNumberFormatter");
			let FreeSpaceStr = plus.ios.invoke(numberFormatterObj, "stringFromNumber:", freeSpace);
			return $U.changeSize(FreeSpaceStr);
			// #endif
		}
	}
}
