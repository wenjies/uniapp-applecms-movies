<template>
	<view>
		<u-navbar title="选择缓存的集数" class="font-weight-7" style="font-size: 28rpx;" title-color="#333" back-icon-color="#333"
		 :border-bottom="false">
			<view slot="right" class="mr-3 font-weight-6" @click="toDownloadPage">
				下载管理
			</view>
		</u-navbar>
		<view class="flex align-center justify-center top" :style="{'top': top+'px'}">
			<text class="mr-1">当前下载源： </text>
			<view class="flex myp-flex-row align-center" @click="showOptions()">
				<view class="main-color font-weight-6" style="margin-right: 5rpx;">
					{{downFrom[currentFrom] ? downFrom[currentFrom].text : ''}}
				</view>
				<myp-icon name="triangle-down" size="l" type="main" @iconClicked="showOptions()"></myp-icon>
			</view>
		</view>
		<view class="mt-2 mr-1 flex align-center flex-wrap justify-start" v-if="episode[currentFrom]">
			<view class="item flex align-center justify-center" v-for="(item,index) in episode[currentFrom]" :key="index" style="position: relative;"
			 @click.stop="addCacheTask(item)">
				<text :class="watching-1 == index ? 'main-color' : 'hei'">
					{{index+1}}
				</text>
				<view style="position: absolute;top: 0;left: 10rpx;" v-if="item.isDownload">
					<u-icon name="download" color="#ff6022" size="26" @click="addCacheTask(item)"></u-icon>
				</view>
				<view style="position: absolute;bottom: 0;right: 10rpx;" v-if="watching-1 == index">
					<myp-icon name="eye" size="l" type="main" @iconClicked="addCacheTask(item)"></myp-icon>
				</view>
			</view>
		</view>
		<u-action-sheet :list="downFrom" @click="changeOptions" v-model="show" border-radius="20" :tips="tips"></u-action-sheet>
	</view>
</template>

<script>
	import downloadMixin from '@/pages/detail/movie/mixin/downloadMixin.js';
	export default {
		mixins: [downloadMixin],
		onLoad(e) {
			this.watching = e.watching;
			this.getDetail(e.vid);
			let sysInfo = uni.getSystemInfoSync();
			this.top = sysInfo.statusBarHeight + uni.upx2px(70);
		},
		data() {
			return {
				userCacheList: uni.getStorageSync('vodCache') || [],
				top: 0,
				downFrom: [],
				currentFrom: 0,
				watching: 0,
				detail: [],
				episode: [],
				show: false,
				tips: {
					text: '在此可修改下载源，每个下载源可下载的内容不一定相同',
					color: '#909399',
					fontSize: 24
				},
			}
		},
		methods: {
			getDetail(id) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.$api.getDetail('vod', id).then(res => {
					this.detail = res.data.list;
					this.episode = res.data.list.vod_down_url;
					this.parseEpisode();
					this.parseFrom(res.data.list.vod_down_from);
					setTimeout(() => {
						uni.hideLoading();
					}, 500);
				});
			},
			parseEpisode() {
				let obj = [];
				for (var i = 0; i < this.episode[this.currentFrom].length; i++) {
					let list = this.episode[this.currentFrom][i];
					list.src = encodeURI(list.src);
					obj.push({
						name: list.episode,
						src: list.src,
						isDownload: this.isDownload(list.src)
					});
				}
				this.episode[this.currentFrom] = obj;
			},
			parseFrom(data) {
				if (!data[0]) return this.downFrom = [];
				let obj = [];
				for (var i = 0; i < data.length; i++) {
					if (i == this.currentFrom) {
						obj.push({
							text: data[i],
							color: '#ff6022',
							fontSize: 30
						});
					} else {
						obj.push({
							text: data[i],
							color: '#333',
							fontSize: 30
						});
					}
				}
				this.downFrom = obj;
			},
			showOptions() {
				this.show = true;
			},
			changeOptions(index) {
				this.show = false;
				if (this.currentFrom == index) return;
				this.downFrom[this.currentFrom].color = '#333';
				this.downFrom[index].color = '#ff6022';
				this.currentFrom = index;
				this.parseEpisode();
			},
			isDownload(url) {
				let index = this.isAddBefore();
				if (index === false) return;
				let index2 = this.userCacheList[index].download.findIndex(v => v.url === url);
				if (index2 != '-1') {
					return true;
				} else {
					return false;
				}
			},
			isAddBefore() {
				let index = this.userCacheList.findIndex(v => v.vod_id === this.detail.vod_id);
				return index == '-1' ? false : index;
			},
			toDownloadPage() {
				uni.navigateTo({
					url: '/pages/download/download'
				});
			},
			saveCache(info) {
				// 影片缓存记录
				let data = {
					vod_id: this.detail.vod_id,
					vod_pic: this.detail.vod_pic,
					vod_name: this.detail.vod_name,
					download: []
				}
				// 影片中的缓存集数信息
				let data_item = {
					vod_id: this.detail.vod_id,
					vod_pic: this.detail.vod_pic,
					vod_name: this.detail.vod_name,
					url: info.url,
					episode: info.item,
					from: this.downFrom[this.currentFrom].text,
					fromCurrent: this.currentFrom,
					task_id: info.taskId,
					task: info.task ? info.task : [],
				}
				// 该影片是否过缓存记录
				let index = this.isAddBefore();
				if (index === false) { //没有添加过
					data.download = [data_item, ...data.download];
					this.userCacheList = [data, ...this.userCacheList];
					uni.setStorageSync('vodCache', this.userCacheList);
				} else { // 已经添加过 新增缓存剧集
					this.userCacheList[index].download = [data_item, ...this.userCacheList[index].download];
					uni.setStorageSync('vodCache', this.userCacheList);
				}
				this.getDetail(this.detail.vod_id);
			},
			addCacheTask(item) {
				let url = item.src;
				if (this.$U.getFileType(url) != 'mp4') return this.$U.msg('该下载源地址错误，暂时无法下载，请尝试切换下载源');
				if (this.isDownload(item.src)) return this.$U.msg('你已添加过该集缓存记录');
				let vid = uni.getStorageSync('vodCache_vids') || [];
				let isExit = vid.findIndex(v => v == this.detail.vod_id);
				if (isExit == '-1') {
					vid = [this.detail.vod_id, ...vid];
					uni.setStorageSync('vodCache_vids', vid);
				}
				let nowNum = 0;
				plus.downloader.enumerate(downloads => {
					if (!downloads.length) {
						this.createTask(url);
						this.saveCache({
							url: url,
							item: item,
							taskId: this.dtask.id
						});
						nowNum += 1;
					}
					for (let i = 0; i < downloads.length; i++) {
						let dtask = downloads[i];
						if (dtask.state != 5 && dtask.state != undefined) {
							nowNum += 1;
						}
						if (nowNum < 1) {
							this.createTask(url);
							this.saveCache({
								url: url,
								item: item,
								taskId: this.dtask.id
							});
							continue;
						}
						if (nowNum >= 1) {
							nowNum = 0;
							this.createTask(url, false);
							this.saveCache({
								url: url,
								item: item,
								taskId: this.dtask.id
							});
						}
					}
				});
			}
		},
	}
</script>

<style lang="less" scoped>
	.item {
		background-color: #f7f9fb;
		border-radius: 8rpx;
		margin: 0 10rpx 25rpx 20rpx;
		width: 95rpx;
		height: 95rpx;
	}

	.top {
		font-size: 29rpx;
		position: sticky;
		width: 100%;
		height: 100rpx;
		z-index: 1;
		background-color: #FFFFFF;
	}
</style>
