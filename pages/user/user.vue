<template>
	<view>
		<u-navbar :border-bottom="false" :is-back="false" height="60">
			<view class="mx-3 user">
				<view class="flex align-center">
					<u-avatar size="80" :src="userInfo.user_portrait" @click="changeUserInfo()" style="will-change: transform;">
					</u-avatar>
					<view class="flex justify-between align-center">
						<view class="ml-2 flex flex-column">
							<view class="user-nick text-ellipsis" @click="changeUserInfo()">{{nickname}}</view>
						</view>
						<view class="flex align-center" style="position: absolute;right: 30rpx;">
							<u-icon name="download" size="42" class="mr-3" @click="toDownload(0)"></u-icon>
							<u-icon name="search" size="42" class="mr-3" @click="toSearch()"></u-icon>
							<u-icon name="bell" size="42"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</u-navbar>
		<template v-if="!list.load">
			<view class="flex align-center justify-center mt-1">
				<myp-loading-indicator width="80rpx" height="80rpx"></myp-loading-indicator>
			</view>
		</template>
		<template v-if="list.load">
			<view class="mx-3">
				<view class="mt-2 mb-1" @click="navigateTo({url: '/pages/collect/index'})">
					<title-h title="我的收藏"></title-h>
				</view>
			</view>
			<myp-scroll-h height="230">
				<view class="flex myp-flex-row ml-3 mt-15">
					<movie-list v-for="(item,index) in list.collect.list" :key="index" :item="item.vod" listClass="mr-1"></movie-list>
					<view style="padding-right: 30rpx;"></view>
				</view>
			</myp-scroll-h>
			<view class="mx-3">
				<view class="mb-1" @click="navigateTo({url: '/pages/history/index'})">
					<title-h title="观看历史"></title-h>
				</view>
			</view>
			<myp-scroll-h height="230">
				<view class="flex myp-flex-row ml-3">
					<user-history-playlist v-for="(item,index) in list.hisPlay.list" :key="index" :item="item" :fadeIn="true"></user-history-playlist>
					<view style="padding-right: 30rpx;"></view>
				</view>
			</myp-scroll-h>
		</template>
		<view class="mx-3">
			<view class="mt-2">
				<title-h title="更多功能" more="false"></title-h>
			</view>
		</view>
		<u-grid col="4" :border="false">
			<u-grid-item @click="toDownload(1)">
				<uni-icons type="cloud-download" size="21" color="#333" @click="toDownload(1)"></uni-icons>
				<view class="grid-text">我的下载</view>
			</u-grid-item>
			<u-grid-item @click="navigateTo({url: '/pages/support/index'})">
				<my-icon name="like" iconStyle="font-size:38rpx" @click="navigateTo({url: '/pages/support/index'})"></my-icon>
				<view class="grid-text">点赞记录</view>
			</u-grid-item>
			<u-grid-item @click="navigateTo({url: '/pages/history/index'})">
				<myp-icon name="circle-play" size="lll" @iconClicked="navigateTo({url: '/pages/history/index'})"></myp-icon>
				<view class="grid-text">影片记录</view>
			</u-grid-item>
			<u-grid-item @click="navigateTo({url: '/pages/history/index?current=1'})">
				<myp-icon name="book" size="lll" @iconClicked="navigateTo({url: '/pages/history/index?current=1'})"></myp-icon>
				<view class="grid-text">文章记录</view>
			</u-grid-item>
			<u-grid-item @click="navigateTo({url: '/pages/history/index?current=2'})">
				<myp-icon name="link" size="lll" @iconClicked="navigateTo({url: '/pages/history/index?current=1'})"></myp-icon>
				<view class="grid-text">专题记录</view>
			</u-grid-item>
			<u-grid-item @click="navigateTo({url: '/pages/collect/index'})">
				<my-icon name="wsee" iconStyle="font-size:40rpx" @click="navigateTo({url: '/pages/collect/index'})"></my-icon>
				<view class="grid-text" @click="navigateTo({url: '/pages/collect/index'})">我的收藏</view>
			</u-grid-item>
			<u-grid-item>
				<myp-icon name="bell" size="lll"></myp-icon>
				<view class="grid-text">消息通知</view>
			</u-grid-item>
		</u-grid>
		<view class="mx-3 pb-2">
			<view class="mt-4 mb-2" @click="toSetting">
				<title-h title="设置" more=""></title-h>
			</view>
			<view class="mt-5 mb-1" @click="clearCache">
				<title-h title="清除系统缓存" :more="sysCacheSize"></title-h>
			</view>
			<view class="mt-5 mb-1">
				<title-h title="检测更新" more="V1.0"></title-h>
			</view>
		</view>
	</view>
</template>

<script>
	import titleH from '@/pages/user/components/title-h/title-h.vue';
	const storageInfo = uni.getStorageInfoSync();
	export default {
		components: {
			titleH
		},
		data() {
			return {
				userInfo: this.$store.state.user || [],
				list: this.$U.cache(this.$store.state.token + '_user') || {
					hisPlay: [],
					collect: [],
					load: false
				},
				sysCacheSize: ''
			}
		},
		onLoad() {
			if (storageInfo.currentSize < 1024) {
				this.sysCacheSize = storageInfo.currentSize + ".00K";
			} else {
				this.sysCacheSize = (storageInfo.currentSize / 1024).toFixed(2) + 'M';
			}
		},
		onShow() {
			this.userInfo = this.$store.state.user;
			if (!this.$store.state.loginStatus) return this.list.load = true;
			this.loadData();
		},
		computed: {
			nickname() {
				if (!this.$store.state.loginStatus) return '点击登录';
				return this.userInfo.user_nick_name || '点击设置昵称';
			}
		},
		methods: {
			loadData() {
				this.getVodPlay();
				this.getVodCollect();
				setTimeout(() => {
					this.list.load = true;
					this.$U.cache(this.$store.state.token + '_user', this.list);
				}, 200);
			},
			getVodPlay() {
				this.$api.getUserHistory('vod', {
					pageSize: 12
				}).then(res => {
					this.list.hisPlay = res.data;
				});
			},
			getVodCollect() {
				this.$api.getUserVodCollect({
					pageSize: 12
				}).then(res => {
					this.list.collect = res.data;
				});
			},
			clearCache() {
				uni.showModal({
					title: '温馨提示',
					content: '您确定要清空系统缓存吗',
					success: res => {
						if (res.confirm) {
							this.sysCacheSize = '0.00K';
							let arrs = storageInfo.keys;
							for (let i = 0; i < arrs.length; i++) {
								if (arrs[i].indexOf(this.$U.cacheSign) == '-1') continue;
								uni.removeStorageSync(arrs[i]);
							}
							return this.$U.msg('清理成功');
						}
					}
				});
			},
			toSearch() {
				return uni.navigateTo({
					url: '/pages/search/search?type=vod'
				});
			},
			toDownload(id) {
				return uni.navigateTo({
					url: '/pages/download/download?current=' + id
				});
			},
			toSetting() {
				return uni.navigateTo({
					url: '/pages/setting/setting'
				});
			},
			changeUserInfo() {
				this.checkAuth(() => {
					uni.navigateTo({
						url: '/pages/user/edit/edit?userInfo=' + encodeURIComponent(JSON.stringify(this.userInfo))
					});
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.user {
		&-nick {
			max-width: 360rpx;
			font-weight: bold;
			font-size: 32rpx;
		}

		&-name {
			font-size: 27rpx;
		}
	}

	.grid-text {
		font-size: 26rpx;
	}
</style>
