<template>
	<view>
		<u-navbar title="我的下载" class="font-weight-7" style="font-size: 28rpx;" title-color="#333" back-icon-color="#333"
		 :border-bottom="false">
			<view slot="right" class="mr-3 font-weight-6">
				编辑
			</view>
		</u-navbar>
		<view style="position: sticky;width: 100%;z-index: 1;" :style="{'top': top+'px'}" class="pt-1">
			<u-tabs :list="tbs" :is-scroll="false" :current="current" @change="change" active-color="#ff6022" style="height: 85rpx;"></u-tabs>
		</view>
		<view class="flex align-center justify-between mx-2 mb-3 mt-2">
			<view class="bg-hui flex align-center justify-center top-btn-text">全部开始</view>
			<view class="bg-hui flex align-center justify-center top-btn-text">同时缓存个数1</view>
		</view>
		<view class="m-2">
			<view class="flex vod mb-3" v-for="(item,index) in list" :key="index" v-if="list" @click.stop="doTouch(item)">
				<image :src="$U.checkUrl(item.vod_pic)" mode="aspectFill" lazy-load>
				</image>
				<view class="ml-2 mt-1">
					<view class="mb-1 vod-title text-ellipsis">{{item.vod_name}}<text class="ml-1">({{item.episode.name}})</text></view>
					<view class="mb-1 vod-progress">
						<progress :percent="item.task.progress ? item.task.progress : 0" :activeColor="activeColor(item.task.state)"
						 stroke-width="3" border-radius="8" />
					</view>
					<view class="hui flex align-center justify-between flex-1 vod-info">
						<view>{{hasNetworkSpeed(item)}}</view>
						<view>{{item.task.totalSize ? $U.changeSize(item.task.totalSize) : ''}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import downloadMixin from '@/pages/detail/movie/mixin/downloadMixin.js';
	export default {
		mixins: [downloadMixin],
		onLoad(e) {
			this.current = e.current || 0;
			let sysInfo = uni.getSystemInfoSync();
			// uni.removeStorageSync('vodCache')
			// uni.removeStorageSync('vodCache_vids')
			// this.clearDownload();
			this.top = sysInfo.statusBarHeight + uni.upx2px(70);
			plus.downloader.enumerate(downloads => {
				for (let i = 0; i < downloads.length; i++) {
					this.loadData(downloads[i]);
				}
			}, -1);
			this.listenDownload();
		},
		data() {
			return {
				top: 0,
				tbs: [{
					name: '正在缓存'
				}, {
					name: '已完成'
				}],
				current: 0,
				list: {},
				task: [],
				sort: 0,
			}
		},
		methods: {
			loadData(task = false, status) {
				let arrs = [],
					changed = [];
				if (task) {
					changed = this.onStateChanged(task, status);
				}
				let data = changed ? changed : uni.getStorageSync('vodCache');
				for (let i = 0; i < data.length; i++) {
					let download = data[i].download;
					download.sort((a, b) => {
						if (this.downloading.length) {
							a = a.task.state == 5 || a.task.state == undefined ? 0 : a.task.progress;
							b = b.task.state == 5 || b.task.state == undefined ? 0 : b.task.progress;
						} else {
							a = a.task.progress || 0;
							b = b.task.progress || 0;
						}
						return b - a;
					});
					for (let n = 0; n < download.length; n++) {
						let item = download[n];
						if (item.task.state == 4) {
							if (this.downloading.findIndex(v => v === item.task_id) != '-1') {
								this.rmDownloading(item.task_id);
								this.$U.msg(item.vod_name + '-' + item.episode.name + '缓存完成', 3000);
								this.listenDownload();
							}
							continue;
						}
						arrs.push(item);
					}
				}
				if (arrs) this.list = arrs;
			},
			activeColor(state) {
				if (state != undefined && state != 5) {
					return '#ff6022';
				}
				return '#d3cfcf';
			},
			doTouch(item) {
				let index = this.task.findIndex(v => v.id === item.task_id);
				if(item.task.state == undefined || item.task.state == 5){
					if(this.downloading.length >= 1){
						return this.$U.msg('当前下载数超过限制');
					}
				}
				this.task[index].addEventListener("statechanged", this.loadData, false);
				if (item.task.state == undefined) {
					this.addDownloading(item.task_id);
					this.task[index].start();
				} else if (item.task.state == 5) {
					this.addDownloading(item.task_id);
					this.task[index].resume();
				} else {
					this.rmDownloading(item.task_id);
					this.task[index].pause();
				}
			},
			hasNetworkSpeed(item) {
				if (item.task.networkSpeed && item.task.state != undefined && item.task.state != 5) {
					return this.$U.changeSize(item.task.networkSpeed) + '/s';
				}
				return item.task.stateText || '等待中';
			},
			addDownloading(task_id) {
				if (this.downloading.findIndex(v => v == task_id) != '-1') return;
				this.downloading = [task_id, ...this.downloading];
			},
			rmDownloading(task_id) {
				let index = this.downloading.findIndex(v => v == task_id);
				if (index == '-1') return;
				this.downloading.splice(index, 1);
			},
			// 监听任务
			listenDownload() {
				plus.downloader.enumerate(downloads => {
					for (let i = 0; i < downloads.length; i++) {
						let task = downloads[i];
						this.task = [task, ...this.task];
						if (task.state == 5) {
							this.loadData(task);
							continue;
						}
						
						if (task.state != 5 && task.state != undefined) {
							this.addDownloading(task.id);
							task.addEventListener("statechanged", this.loadData, false);
							continue;
						}
						
						if (this.downloading.length < 1) {
							if (task.state == undefined) {
								this.addDownloading(task.id);
								task.addEventListener("statechanged", this.loadData, false);
								task.start();
								continue;
							}
						}
					}
				});
			},
			change(index) {
				this.current = index;
			},
		}
	}
</script>

<style lang="less" scoped>
	.top-btn {
		&-text {
			width: 345rpx;
			height: 65rpx;
		}
	}

	.vod {
		image {
			height: 115rpx;
			width: 195rpx;
		}

		&-title {
			font-size: 26rpx;
		}

		&-progress {
			width: 495rpx;
		}

		&-info {
			font-size: 24rpx;
		}
	}
</style>
