<template>
	<view>
		<u-navbar :is-back="false" :border-bottom="false">
			<view class="flex flex-column">
				<view class="flex search align-center justify-between">
					<view class="input">
						<input maxlength="50" type="text" @input="inputHandle" value="" confirm-type="search" @confirm="searchStart(type)"
						 :placeholder="placeholder" v-model.trim="searchText" />
					</view>
					<!-- #ifdef APP-PLUS -->
					<view class="voice-icon" @click="startRecognize()" v-if="!searchText.length">
						<u-icon name="mic" color="#ff6022" size="41"></u-icon>
					</view>
					<!-- #endif -->
					<view class="close-icon" @touchend.prevent="clear()" v-if="searchText.length">
						<u-icon name="close" color="#999696" size="25"></u-icon>
					</view>
					<view class="search-icon">
						<myp-icon name="search" iconStyle="font-size:38rpx" type="second"></myp-icon>
					</view>
					<view @click="cancel" style="margin-right: 33rpx;">
						<text style="font-size: 30rpx;font-weight: 400;">取消</text>
					</view>
				</view>
				<template v-if="!isGoSearch">
					<view class="border" style="background-color: #FFFFFF;height: 10rpx;"></view>
				</template>
			</view>
		</u-navbar>
		<template v-if="isGoSearch">
			<view class="flex flex-column search-header">
				<view class="flex align-center justify-between flex-1 mr-2 ml-1 mt-1">
					<view style="width: 255rpx;">
						<u-tabs :list="tabs" :is-scroll="false" :current="current" @change="changeTbs" font-size="28rpx" bar-width="35"
						 :bold="false" active-color="#ff6022"></u-tabs>
					</view>
					<view class="flex align-center">
						<view class="sort-text ml-2" :class="'time' == searchList[typeArr[current]].sortVal ? 'main-color' : ''" @click="changeSort('time')">按时间</view>
						<view class="sort-text ml-2" :class="'hits' == searchList[typeArr[current]].sortVal ? 'main-color' : ''" @click="changeSort('hits')">按人气</view>
						<view class="sort-text ml-2" :class="'score' == searchList[typeArr[current]].sortVal ? 'main-color' : ''" @click="changeSort('score')"
						 v-if="typeArr[current] == 'vod'">按评分</view>
						<view class="sort-text ml-2" :class="'up' == searchList[typeArr[current]].sortVal ? 'main-color' : ''" @click="changeSort('up')">按点赞</view>
					</view>
				</view>
				<view class="border" style="background-color: #FFFFFF;height: 10rpx;"></view>
			</view>
		</template>
		<template v-if="isGoSearch == false">
			<template v-if="searchText.length < 1">
				<view class="s-circle">
					<view class="header">
						搜索记录
						<image src="../../static/ui/delete.svg" mode="aspectFit" @click="delhistory"></image>
					</view>
					<view class="list">
						<view v-for="(item,index) in hList" :key="index" @click="keywordsClick(item)">{{item}}</view>
					</view>
				</view>
				<view class="wanted-circle">
					<view class="header">大家都在搜</view>
					<view class="list">
						<view v-for="(item,index) in hotList" :key="index" @click="keywordsClick(item.keyword)">{{item.keyword}}</view>
					</view>
				</view>
				<view class="wanted-circle" v-if="vod">
					<view class="header">猜你想看</view>
					<myp-scroll-h height="200">
						<view class="flex myp-flex-row myp-justify-between ml-2 mt-15">
							<movie-list v-for="(item,index) in vod" :key="index" :item="item" listClass="mr-1 animated fadeIn faster"></movie-list>
						</view>
					</myp-scroll-h>
				</view>
				<view class="wanted-circle" v-if="art">
					<view class="header">热门资讯</view>
					<view class="myp-flex-row-reverse mx-2 mt-1">
						<art-list :item="item" v-for="(item,index) in art" :key="index"></art-list>
					</view>
				</view>
			</template>
			<template v-else>
				<block v-for="(item,index) in keywords" :key="index">
					<view class="keyword-entry" hover-class="keyword-entry-hover">
						<view class="keyword-text" @tap.stop="keywordsClick(item.keyword)">
							<rich-text :nodes="item.htmlStr"></rich-text>
						</view>
					</view>
				</block>
			</template>
		</template>
		<template v-else>
			<view style="margin-top: 120rpx;"></view>
			<view class="flex align-center justify-center">
				<u-loading :show="!searchList[typeArr[current]].load" color="#ff6022" size="35"></u-loading>
			</view>
			<template v-if="current == 0">
				<view v-if="searchList.vod.load">
					<template v-if="searchList.vod.list.length >= 1">
						<search-movie-list v-for="(item,index) in searchList.vod.list" :key="index" :item="item" :index="index"
						 @doCollect="collect"></search-movie-list>
						<u-loadmore :status="searchList.vod.loadStatus" />
					</template>
					<template v-else>
						<u-empty text="暂无搜索结果" mode="search" icon-size="200" margin-top="250"></u-empty>
					</template>
				</view>
			</template>
			<template v-if="current == 1">
				<view class="mx-2" v-if="searchList.art.load">
					<template v-if="searchList.art.list.length >= 1">
						<search-art-list v-for="(item,index) in searchList.art.list" :key="index" :item="item"></search-art-list>
						<u-loadmore :status="searchList.art.loadStatus" />
					</template>
					<template v-else>
						<u-empty text="暂无搜索结果" mode="search" icon-size="200" margin-top="230"></u-empty>
					</template>
				</view>
			</template>

			<template v-if="current == 2">
				<view :class="searchList.topic.list.length >= 1 ? 'myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2' : ''"
				 v-if="searchList.topic.load">
					<template v-if="searchList.topic.list.length >= 1">
						<search-special-list v-for="(item,index) in searchList.topic.list" :key="index" :item="item"></search-special-list>
						<u-loadmore :status="searchList.topic.loadStatus" />
					</template>
					<template v-else>
						<u-empty text="暂无搜索结果" mode="search" icon-size="200" margin-top="230"></u-empty>
					</template>
				</view>
			</template>
		</template>
	</view>
</template>

<script>
	import searchMixin from './searchMixin.js';
	export default {
		mixins: [searchMixin],
		data() {
			return {
				tabs: [{
						name: '影片'
					},
					{
						name: '文章'
					},
					{
						name: '专题'
					}
				],
				current: 0,
				typeArr: ['vod', 'art', 'topic']
			};
		},
		onLoad(e) {
			this.type = e.type;
			this.changeCurrent(e.type);
			this.getHot();
			this.getVod();
			this.getArt();
		},
		onReachBottom() {
			if (this.searchText == '') return;
			let key = this.nowAct;
			let need = this.searchList[key];
			if (need.loadStatus != 'loadmore') return;
			need.page += 1;
			need.loadStatus = 'loading';
			this.getSearch(key, need.page);
		},
		computed:{
			nowAct(){
				return this.typeArr[this.current];
			}
		},
		methods: {
			changeSort(index) {
				if (this.sortVal == index) return false;
				this.searchList[this.nowAct].sortVal = index;
				this.searchList[this.nowAct].load = false;
				this.searchList[this.nowAct].page = 1;
				this.searchList[this.nowAct].loadStatus = 'loadmore';
				this.changeSearch(this.current);
			},
			changeTbs(index) {
				this.current = index;
				this.changeSearch(index);
			},
			changeSearch(index) {
				if (this.searchList[this.typeArr[index]].load) return false;
				this.getSearch(this.typeArr[index]);
			},
			changeCurrent(type) {
				switch (type) {
					case 'vod':
						this.current = 0;
						this.placeholder = '输入影片名称、演员或导演';
						break;
					case 'art':
						this.current = 1;
						this.placeholder = '请输入要搜索的文章标题';
						break;
					case 'topic':
						this.current = 2;
						this.placeholder = '请输入要搜索的专题名称';
						break;
				}
			},
			inputHandle(e) {
				this.searchText = e.detail.value;
				this.isGoSearch = false;
				if (e.detail.value == '') this.clear();
				if (!this.searchText.length) this.keywords = [];
				if (this.timer) clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					if (this.searchText.length) {
						this.drawCorrelativeKeyword(this.searchText);
					}
				}, 100);
			},
			collect(index, id) {
				this.$U.checkLogin(this.$store.state.loginStatus);
				this.$api.collect('vod', id).then(res => {
					if (res.msg != 'ok') return;
					let data = this.searchList.vod.list[index];
					if (!data.isCollect) {
						data.isCollect = true;
						this.$U.msg('收藏成功');
					} else {
						data.isCollect = false;
					}
				});
			},
			cancel() {
				uni.navigateBack({
					delta: getCurrentPages() - 1
				});
			},
			searchStart(type) { //触发搜索
				if (this.searchText == '') {
					uni.showToast({
						title: '请输入搜索内容',
						icon: 'none',
						duration: 1000
					});
				} else {
					this.clearData();
					this.isGoSearch = true;
					this.getSearch(type);
				}
			},
			clear() {
				this.keywords = [];
				this.searchText = '';
				this.isGoSearch = false;
				this.clearData();
			},
			clearData() {
				this.changeCurrent(this.type);
				this.searchList.vod = {
					list: [],
					page: 1,
					load: false,
					loadStatus: 'loadmore',
					sortVal: 'time'
				};
				this.searchList.art = {
					list: [],
					page: 1,
					load: false,
					loadStatus: 'loadmore',
					sortVal: 'time'
				};
				this.searchList.topic = {
					list: [],
					page: 1,
					load: false,
					loadStatus: 'loadmore',
					sortVal: 'time'
				};
			},
		}
	}
</script>

<style lang="less" scoped>
	.search-header {
		position: fixed;
		width: 100%;
		z-index: 9999;
		background-color: #FFFFFF;
		height: 100rpx;
	}

	.sort-text {
		font-size: 25rpx;
	}

	.search {
		width: 750rpx;
		height: 80rpx;
		margin-top: 10rpx;
		position: relative;

		input {
			width: 500rpx;
			padding: 10rpx 0 10rpx 75rpx;
			font-size: 31rpx;
			height: 80rpx;
		}

		.voice-icon {
			width: 36rpx;
			height: 36rpx;
			padding: 8rpx 20rpx 16rpx 0;
			position: absolute;
			right: 120rpx;
			top: 13rpx;
			z-index: 10;
		}

		.close-icon {
			width: 36rpx;
			height: 36rpx;
			padding: 8rpx 20rpx 16rpx 0;
			position: absolute;
			right: 110rpx;
			top: 12rpx;
			z-index: 10;
		}

		.search-icon {
			width: 36rpx;
			height: 36rpx;
			padding: 16rpx 20rpx 16rpx 0;
			position: absolute;
			left: 36rpx;
			top: 6rpx;
			z-index: 10;
		}
	}

	.s-circle {
		margin-top: 20rpx;

		.header {
			font-size: 27rpx;
			padding: 20rpx 20rpx 0 20rpx;
			position: relative;

			image {
				width: 32rpx;
				height: 32rpx;
				padding: 10rpx;
				position: absolute;
				right: 20rpx;
				top: 19rpx;
			}
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			padding: 0 20rpx 10rpx;

			view {
				margin-top: 23rpx;
				margin-right: 15rpx;
				padding: 7rpx 20rpx;
				font-size: 26rpx;
				color: #333;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 8rpx;
			}
		}
	}

	.wanted-circle {
		margin-top: 20rpx;

		.header {
			font-size: 27rpx;
			padding: 20rpx 20rpx 0 20rpx;
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			padding: 0 20rpx 10rpx;

			view {
				margin-top: 23rpx;
				margin-right: 15rpx;
				padding: 7rpx 20rpx;
				font-size: 26rpx;
				color: #333;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 8rpx;
			}
		}
	}

	.keyword-entry {
		width: 94%;
		height: 85rpx;
		margin: 0 3%;
		font-size: 30rpx;
		color: #333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: solid 2rpx #F9F9F9;

		&-hover {
			background-color: #F9F9F9;
		}
	}

	.border {
		border-bottom: #F9F9F9 solid 2rpx;
	}

	.keyword-entry .keyword-text {
		width: 740rpx;
		text-overflow: ellipsis;
		word-break: break-word;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
</style>
