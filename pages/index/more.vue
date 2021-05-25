<template>
	<view>
		<u-navbar :title="title" title-width="320" class="font-weight-7" style="font-size: 28rpx;" title-color="#333"
		 back-icon-color="#333" :border-bottom="false">
		</u-navbar>
		<view style="padding-top: 20rpx;">
			<view class="flex align-center justify-center" v-if="!list.load">
				<u-loading :show="!list.load" color="#ff6022" size="35"></u-loading>
			</view>
			<template v-if="list.load">
				<view class="flex align-center justify-between flex-wrap mx-2">
					<movie-list v-for="(item,index) in list.list" :key="index" :item="item" iconText="class"></movie-list>
				</view>
				<u-loadmore class="pt-2" :status="list.loadStatus" />
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		async onLoad(e) {
			this.type = e.type;
			this.loadData();
		},
		data() {
			return {
				list: {
					page: 1,
					pageSize: 12,
					total: 0,
					list: [],
					loadStatus: 'loadmore',
					load: false
				},
				title: '',
				type: ''
			}
		},
		methods: {
			async loadData() {
				let res = false;
				if (this.type == 'today') {
					res = await this.$api.getVodToday({
						page: this.list.page,
						pageSize: this.list.pageSize
					})
					this.title = '今日更新' + res.data.total + '部影片';
				}
				if (this.type == 'hot') {
					res = await this.$api.getHits('vod', 'all', {
						page: this.list.page,
						pageSize: this.list.pageSize
					})
					this.title = '人气最高';
				}
				if(res){
					if (res.data.page == 1) {
						this.list.list = res.data.list;
					} else {
						this.list.list = this.list.list.concat(res.data.list);
					}
					this.list.total = res.data.total;
					this.list.loadStatus = 'loadmore';
					if (res.data.list.length < 10) this.list.loadStatus = 'nomore';
					setTimeout(() => {
						this.list.load = true;
					}, 300);
				}
			},
			onReachBottom() {
				if (this.list.loadStatus != 'loadmore') return;
				this.list.page += 1;
				this.list.loadStatus = 'loading';
				this.loadData();
			}
		}
	}
</script>

<style lang="less">

</style>
