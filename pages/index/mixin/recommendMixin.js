import api from '@/api/index.js';
import $U from '@/common/util.js';
export default {
	data() {
		return {
			recommendList:$U.cache('index_tabs_page_0') || {
				vod: {
					today: {
						page: 1,
						pageSize: 12,
						list: []
					},
					hits: {
						'day': {
							page: 1,
							pageSize: 10,
							list: []
						},
						'week': {
							page: 1,
							pageSize: 10,
							list: []
						},
						'month': {
							page: 1,
							pageSize: 10,
							list: []
						},
						'all': {
							page: 1,
							pageSize: 12,
							list: []
						},
						'tv': {
							page: 1,
							pageSize: 12,
							list: []
						},
						'movie': {
							page: 1,
							pageSize: 12,
							list: []
						},
						'variety': {
							page: 1,
							pageSize: 12,
							list: []
						},
						'comic': {
							page: 1,
							pageSize: 12,
							list: []
						}
					},
				},
				topic: {
					page: 1,
					pageSize: 8,
					list: []
				},
				art: {
					page: 1,
					pageSize: 5,
					list: []
				},
				load: false
			},
			hotIdArr:{
				tv:2,
				movie:1,
				variety:3,
				comic:4
			}
		}
	},
	methods: {
		toRecommendLoad() {
			let loading = false;
		    if(!$U.cache('index_tabs_page_0')){
				uni.showLoading({
					title:'加载中...',
					mask:true
				});
				loading = true;
			}
			const ins =  this.$refs['re'];
			const cp = ins.mypCurrentPage;
			const data = this.recommendList;
			this.vodToday(cp, data.vod.today.pageSize);
			this.loadNews('topic',cp, data.topic.pageSize);
			this.loadNews('art',cp, data.art.pageSize);
			this.loadHotList();
			this.loadRanks();
			this.recommendList.load = true;
			setTimeout(()=>{
				if(loading) uni.hideLoading();
			},1000);
			setTimeout(() => {
				$U.cache('index_tabs_page_0', this.recommendList);
				return ins.mypEndSuccess(0);
			}, 500);
		},
		loadHotList(page) {
			let data = this.recommendList.vod.hits;
			setTimeout(() => {
				this.vodHotList('tv', 'week', page, data.tv.pageSize);
				this.vodHotList('movie', 'week', page, page, data.movie.pageSize);
				this.vodHotList('variety', 'week', page, data.variety.pageSize);
				this.vodHotList('comic', 'week', page, data.comic.pageSize);
			}, 100);
		},
		loadRanks(page) {
			let data = this.recommendList.vod.hits;
			setTimeout(() => {
				this.vodRanks('all', page, data.all.pageSize);
				this.vodRanks('day', page, data.day.pageSize);
				this.vodRanks('week', page, data.week.pageSize);
				this.vodRanks('month', page, data.month.pageSize);
			}, 200);
		},
		loadNews(type,page,pageSize){
			api.getNews(type, {
				page: page,
				pageSize: pageSize
			}).then(res => {
				this.recommendList[type] = res.data;
				if ((res.data.total - page * pageSize) <= pageSize) {
					this.recommendList[type].page = 1;
				}
			})
		},
		vodRanks(time, page, pageSize) {
			api.getHits('vod', time, {
				page: page,
				pageSize: pageSize
			}).then(res => {
				this.recommendList.vod.hits[time] = res.data;
				if ((res.data.total - page * pageSize) <= pageSize) {
					this.recommendList.vod.hits[time].page = 1;
				}
			})
		},
		vodHotList(arrKey, time, page, pageSize) {
			api.getHits('vod', time, {
				page: page,
				pageSize: pageSize,
				class_type: 'parent_id',
				class_id: this.hotIdArr[arrKey]
			}).then(res => {
				this.recommendList.vod.hits[arrKey] = res.data;
				if ((res.data.total - page * pageSize) <= pageSize) {
					this.recommendList.vod.hits[arrKey].page = 1;
				}
			})
		},
		vodToday(page, pageSize) {
			api.getVodToday({
				page: page,
				pageSize: pageSize
			}).then(res => {
				this.recommendList.vod.today = res.data;
				if ((res.data.total - page * pageSize) <= pageSize) {
					this.recommendList.vod.today.page = 1;
				}
				setTimeout(() => {
					$U.cache('index_tabs_page_0', this.recommendList);
				}, 3000);
			});
		}
	}
}
