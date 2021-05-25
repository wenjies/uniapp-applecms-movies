<template>
	<myp-list ref="re" extra="210rpx" :showScrollbar="false" :autoUpdate="false" @down="toLoadPage()">
		<myp-list-cell>
			<index-swiper-img :list="imgList"></index-swiper-img>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="今日更新" rightText="查看更多" @toMore="goMore('today')"></index-title-h>
			<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2 mt-15">
				<index-movie-list :item="item" iconText="最新" v-for="(item,index) in recommendList.vod.today.list" :key="index"></index-movie-list>
			</view>
			<index-bottom-reload leftText="查看更多" @rightClick="reload('today')" @leftClick="goMore('today')"></index-bottom-reload>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="最新专题" rightText="更多专题" @toMore="toSwitchTab('special/special')"></index-title-h>
			<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2 mt-15">
				<index-special-list :item="item" v-for="(item,index) in recommendList.topic.list" :key="index"></index-special-list>
			</view>
			<index-bottom-reload leftText="更多专题" @rightClick="reload('topic')" @leftClick="toSwitchTab('special/special')"></index-bottom-reload>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="最新资讯" rightText="更多资讯" @toMore="toSwitchTab('art/art')"></index-title-h>
			<view class="myp-flex-row-reverse mx-2 mt-2">
				<index-art-list :item="item" v-for="(item,index) in recommendList.art.list" :key="index"></index-art-list>
			</view>
			<index-bottom-reload leftText="更多资讯" @rightClick="reload('art')" @leftClick="toSwitchTab('art/art')"></index-bottom-reload>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="同步剧场" @toMore="toChangeTab(2)"></index-title-h>
			<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2 mt-15">
				<index-movie-list :item="item" v-for="(item,index) in recommendList.vod.hits.tv.list" :key="index">
				</index-movie-list>
			</view>
			<index-bottom-reload leftText="更多电视剧" @rightClick="reload('tv')" @leftClick="toChangeTab(2)"></index-bottom-reload>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="热门电影" @toMore="toChangeTab(1)"></index-title-h>
			<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2 mt-15">
				<index-movie-list :item="item" v-for="(item,index) in recommendList.vod.hits.movie.list" :key="index">
				</index-movie-list>
			</view>
			<index-bottom-reload leftText="更多电影" @rightClick="reload('movie')" @leftClick="toChangeTab(1)"></index-bottom-reload>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="热门综艺" @toMore="toChangeTab(3)"></index-title-h>
			<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2 mt-15">
				<index-movie-list :item="item" v-for="(item,index) in recommendList.vod.hits.variety.list" :key="index">
				</index-movie-list>
			</view>
			<index-bottom-reload leftText="更多综艺" @rightClick="reload('variety')" @leftClick="toChangeTab(3)"></index-bottom-reload>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="热门动漫" @toMore="toChangeTab(4)"></index-title-h>
			<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2 mt-15">
				<index-movie-list :item="item" v-for="(item,index) in recommendList.vod.hits.comic.list" :key="index">
				</index-movie-list>
			</view>
			<index-bottom-reload leftText="更多动漫" @rightClick="reload('comic')" @leftClick="toChangeTab(4)"></index-bottom-reload>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="人气最高" @toMore="goMore('hot')"></index-title-h>
			<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2 mt-15">
				<index-movie-list :item="item" v-for="(item,index) in recommendList.vod.hits.all.list" :key="index">
				</index-movie-list>
			</view>
			<index-bottom-reload @rightClick="reload('all')" @leftClick="goMore('hot')"></index-bottom-reload>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="今日热榜" rightText="false"></index-title-h>
			<myp-scroll-h height="220">
				<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap ml-2 mt-15">
					<index-movie-list :item="item" iconText="hits_day" listClass="mr-2" v-for="(item,index) in recommendList.vod.hits.day.list"
					 :key="index">
					</index-movie-list>
				</view>
			</myp-scroll-h>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="本周热榜" rightText="false"></index-title-h>
			<myp-scroll-h height="220">
				<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap ml-2 mt-15">
					<index-movie-list :item="item" iconText="hits_week" listClass="mr-2" v-for="(item,index) in recommendList.vod.hits.week.list"
					 :key="index">
					</index-movie-list>
				</view>
			</myp-scroll-h>
		</myp-list-cell>
		<myp-list-cell>
			<index-title-h title="本月热榜" rightText="false"></index-title-h>
			<myp-scroll-h height="220">
				<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap ml-2 mt-15">
					<index-movie-list :item="item" iconText="hits_month" listClass="mr-2" v-for="(item,index) in recommendList.vod.hits.month.list"
					 :key="index">
					</index-movie-list>
				</view>
			</myp-scroll-h>
		</myp-list-cell>
	</myp-list>
	</view>
</template>

<script>
	import indexMovieList from '@/pages/index/components/index-movie-list/index-movie-list.vue';
	import indexTitleH from '@/pages/index/components/index-title-h/index-title-h.vue';
	import indexSwiperImg from '@/pages/index/components/index-swiper-img/index-swiper-img.vue';
	import indexArtList from '@/pages/index/components/index-art-list/index-art-list.vue';
	import indexSpecialList from '@/pages/special/components/special-list/special-list.vue';
	import indexBottomReload from '@/pages/index/components/index-bottom-reload/index-bottom-reload.vue';
	import $U from '@/common/util.js';
	import api from '@/api/index.js';
	import recommendMixin from '@/pages/index/mixin/recommendMixin.js';
	export default {
		mixins: [recommendMixin],
		components: {
			indexMovieList,
			indexTitleH,
			indexSwiperImg,
			indexArtList,
			indexSpecialList,
			indexBottomReload,
		},
		data() {
			return {
				imgList: []
			}
		},
		created() {
			this.getSlide();
		},
		methods: {
			// 加载页面
			toLoadPage() {
				let pageCache = $U.cache('index_tabs_page_0');
				const ins = this.$refs['re'];
				if (pageCache) this.recommendList = pageCache;
				ins.mypLoad();
				this.toRecommendLoad();
			},
			// 修改tbs事件
			toChangeTab(index) {
				this.$emit('changeTab', index);
			},
			// 跳转tabbar
			toSwitchTab(path) {
				uni.switchTab({
					url: '/pages/' + path
				});
			},
			reloadPage() {
				if (this.recommendList.load) return;
				this.toLoadPage();
			},
			// 获取轮播图
			async getSlide() {
				let cache = $U.cache('recommend_slide');
				if (cache) return this.imgList = cache;
				let res = await api.getSlide();
				if (!res) return false;
				let arrs = [];
				for (var i = 0; i < res.data.list.length; i++) {
					let list = res.data.list[i]
					arrs.push({
						vod_id: list.vod_id,
						vod_name: list.vod_name + '-' + list.vod_remarks,
						vod_pic_slide: $U.checkUrl(list.vod_pic_slide)
					})
				}
				this.imgList = arrs;
				$U.cache('recommend_slide', this.imgList, 3600);
			},
			// 点击换一换
			reload(type) {
				let data = this.recommendList;
				if (type == 'topic' || type == 'art') {
					let list = data[type];
					if (list.list.length < list.pageSize) return $U.msg('没有更多数据了');
					list.page += 1;
					return this.loadNews(type, list.page, list.pageSize);
				}
				if (type == 'today') {
					if (data.vod.today.list.length < data.vod.today.pageSize) return $U.msg('没有更多数据了');
					data.vod.today.page += 1;
					return this.vodToday(data.vod.today.page, data.vod.today.pageSize);
				}
				if (data.vod.hits[type].list.length < data.vod.hits[type].pageSize) return $U.msg('没有更多数据了');
				data.vod.hits[type].page += 1;
				if (type == 'all') {
					return this.vodRanks('all', data.vod.hits.all.page, data.vod.hits.all.pageSize);
				}
				this.vodHotList(type, 'week', data.vod.hits[type].page, data.vod.hits[type].pageSize);
			},
			// 跳转more页面 今日更新 and 人气最高
			goMore(type) {
				return uni.navigateTo({
					url: '/pages/index/more?type=' + type
				});
			},
		}
	}
</script>

<style>

</style>
