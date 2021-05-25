export default {
	data() {
		return {
			searchText: '',
			art: [],
			vod:[],
			speechEngine: 'baidu',
			hList: uni.getStorageSync('search_cache'),
			keywords: [],
			hotList: [],
			timer: null,
			type: '',
			placeholder: '',
			isGoSearch: false,
			searchList: {
				vod: {
					list: [],
					page: 1,
					load: false,
					loadStatus: 'loadmore',
					sortVal: 'time'
				},
				art: {
					list: [],
					page: 1,
					load: false,
					loadStatus: 'loadmore',
					sortVal: 'time'
				},
				topic: {
					list: [],
					page: 1,
					load: false,
					loadStatus: 'loadmore',
					sortVal: 'time'
				}
			},
		}
	},
	methods: {
		getSearch(type, page = 1, pageSize = 10) {
			this.$api.getSearch(type, this.searchText, this.searchList[type].sortVal, page, pageSize).then(res => {
				for (let i = 0; i < res.data.list.length; i++) {
					let oReg = new RegExp(this.searchText,"g");
					let replaceString;
					switch (type) {
						case 'vod':
							replaceString = '<text class="main-color">' + this.searchText + '</text>';
							res.data.list[i].vod_actor = res.data.list[i].vod_actor.replace(oReg, replaceString);
							replaceString = '<text class="main-color">' + this.searchText + '</text>';
							res.data.list[i].vod_director = res.data.list[i].vod_director.replace(oReg, replaceString);
							replaceString = '<text class="main-color movie_name">' + this.searchText + '</text>';
							res.data.list[i].vod_name = res.data.list[i].vod_name.replace(oReg, replaceString);
							break;
						case 'art':
							replaceString = '<text class="art-title main-color">' + this.searchText + '</text>';
							res.data.list[i].art_name = res.data.list[i].art_name.replace(oReg, replaceString);
							break;
						case 'topic':
							replaceString = '<text class="main-color">' + this.searchText + '</text>';
							res.data.list[i].topic_name = res.data.list[i].topic_name.replace(oReg, replaceString);
							break;
					}
				}
				if (page == 1) {
					this.searchList[type].list = res.data.list;
				} else {
					this.searchList[type].list = this.searchList[type].list.concat(res.data.list);
				}
				this.saveSearchLog();
				this.searchList[type].loadStatus = 'loadmore';
				if (res.data.list.length < 10) this.searchList[type].loadStatus = 'nomore';
				uni.hideKeyboard();
				setTimeout(() => {
					this.searchList[type].load = true;
				}, 200);
			});
		},
		saveSearchLog() {
			uni.getStorage({
				key: 'search_cache',
				success: (res) => {
					let list = res.data;
					if (list.length > 5) {
						for (let item of list) {
							if (item == this.searchText) {
								return;
							}
						}
						list.pop();
						list.unshift(this.searchText);
					} else {
						for (let item of list) {
							if (item == this.searchText) {
								return;
							}
						}
						list.unshift(this.searchText);
					}
					this.hList = list;
					uni.setStorage({
						key: 'search_cache',
						data: this.hList
					});
				},
				fail: () => {
					this.hList = [];
					this.hList.push(this.searchText);
					uni.setStorage({
						key: 'search_cache',
						data: this.hList
					});
				}
			})
		},
		keywordsClick(item) { //关键词搜索与历史搜索
			this.searchText = item;
			this.searchStart(this.type);
		},
		delhistory() { //清空搜索记录
			this.hList = [];
			uni.setStorage({
				key: 'search_cache',
				data: []
			});
		},
		drawCorrelativeKeyword(keyword) {
			this.$api.getSearchThink(this.type, keyword).then(res => {
				let arr = [];
				for (let i = 0; i < res.data.list.length; i++) {
					let key = this.type + '_name';
					let name = res.data.list[i][key];
					let searchWord = '|' + keyword + '|';
					let replaceString = '<span style="color: #ff6022;">' + keyword + '</span>';
					arr.push({
						keyword: res.data.list[i][key].replace(/\|/g,''),
						htmlStr: name.replace(searchWord, replaceString)
					});
				}
				this.keywords = arr;
			});
		},
		startRecognize() { //语音输入
			let options = {};
			options.engine = this.speechEngine;
			options.punctuation = false; // 是否需要标点符号 
			options.timeout = 10 * 1000;
			plus.speech.startRecognize(options, (s) => {
				this.searchText = this.searchText + s;
				this.drawCorrelativeKeyword(this.searchText);
			});
		},
		getArt() {
			this.$api.getNews('art', {
				page:1,
				pageSize: 5
			}).then(res => {
				this.art = res.data.list;
			})
		},
		getVod() {
			this.$api.getNews('vod', {
				page:1,
				pageSize: 12
			}).then(res => {
				this.vod = res.data.list;
			})
		},
		getHot() {
			this.$api.getHotSearch().then(res => {
				this.hotList = res.data.list;
			});
		}
	}
}
