<template>
	<myp-list :ref="refName" extra="210rpx" :showScrollbar="false" :autoUpdate="false" @down="toLoadPage()">
		<myp-list-cell>
			<index-swiper-img :list="imgList"></index-swiper-img>
		</myp-list-cell>
		<myp-list-cell v-if="!list.length">
			<view class="flex align-center justify-center mt-1">
				<myp-loading-indicator width="80rpx" height="80rpx"></myp-loading-indicator>
			</view>
		</myp-list-cell>
		<myp-list-cell v-for="(item,index) in sonClass" :key="index" v-if="list.length">
			<index-title-h :title="'最新'+item.type_name" v-if="list[index]"></index-title-h>
			<view class="myp-flex-row myp-justify-between myp-align-center myp-wrap-wrap mx-2 mt-15" v-if="list[index]">
				<index-movie-list :item="item2" v-for="(item2,index2) in list[index].list" :key="index2">
				</index-movie-list>
			</view>
			<index-bottom-reload :leftText="'更多'+item.type_name" @rightClick="reload(index,item.type_id)" @leftClick="goMore('x')"></index-bottom-reload>
		</myp-list-cell>
	</myp-list>
</template>

<script>
	import indexMovieList from '@/pages/index/components/index-movie-list/index-movie-list.vue';
	import indexSwiperImg from '@/pages/index/components/index-swiper-img/index-swiper-img.vue';
	import indexTitleH from '@/pages/index/components/index-title-h/index-title-h.vue';
	import indexBottomReload from '@/pages/index/components/index-bottom-reload/index-bottom-reload.vue';
	import $U from '@/common/util.js';
	import api from '@/api/index.js';
	export default {
		components: {
			indexMovieList,
			indexSwiperImg,
			indexTitleH,
			indexBottomReload
		},
		props: {
			current: Number,
			refName: String
		},
		async created() {
			this.getSlide();
			let sonClass = $U.cache('index_tabs_page_' + this.refName + '_sonClass');
			if (sonClass) return this.sonClass = sonClass;
		},
		data() {
			return {
				list: [],
				load: false,
				sonClass: {},
				imgList: []
			}
		},
		methods: {
			toLoadPage() {
				const ins = this.$refs[this.refName];
				this.list = $U.cache('index_tabs_page_' + this.refName) || [];
				this.getData(1, 12);
				this.load = true;
				setTimeout(() => {
					return ins.mypEndSuccess(0);
				}, 500);
			},
			// 获取轮播图
			async getSlide() {
				let cache = $U.cache(this.refName + '_slide');
				if (cache) return this.imgList = cache;
				let res = await api.getSlide({
					class_type: 'parent_id',
					class_id: this.current
				});
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
				$U.cache(this.refName + '_slide', this.imgList, 3600);
			},
			reloadPage() {
				if (this.load) return;
				this.toLoadPage();
			},
			// 点击换一换
			reload(index, id) {
				if (this.list[index].length < this.list[index].pageSize) return $U.msg('没有更多数据了');
				this.list[index].page += 1;
				api.getNews('vod', {
					class_type: 'son_id',
					class_id: id,
					page: this.list[index].page,
					pageSize: this.list[index].pageSize
				}).then(res => {
					this.list[index].list = res.data.list;
					if ((res.data.total - this.list[index].page * this.list[index].pageSize) <= this.list[index].pageSize) {
						this.list[index].page = 1;
					}
				});
			},
			getData(page = 1, pageSize = 12) {
				api.getSonClass(this.current).then(res => {
					this.sonClass = res.data.list;
					for (let i = 0; i < res.data.list.length; i++) {
						if (i <= 3) {
							this.getVod(page, pageSize, res.data.list[i].type_id);
						} else {
							setTimeout(() => {
								this.getVod(page, pageSize, res.data.list[i].type_id);
							}, 100 + i * 10);
						}
					}
					setTimeout(() => {
						$U.cache('index_tabs_page_' + this.refName + '_sonClass', this.sonClass, 3600);
					}, 100);
				});
			},
			getVod(page, pageSize, type_id) {
				api.getNews('vod', {
					class_type: 'son_id',
					class_id: type_id,
					page: page,
					pageSize: pageSize
				}).then(res => {
					this.list = this.list.concat(res.data);
					$U.cache('index_tabs_page_' + this.refName, this.list);
				})
			}
		}
	}
</script>

<style lang="less" scoped>

</style>
