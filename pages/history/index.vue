<template>
	<view>
		<u-navbar title="观看历史" class="font-weight-7" style="font-size: 28rpx;" title-color="#333" back-icon-color="#333"
		 :border-bottom="false">
			<view slot="right" style="font-size: 28rpx;" class="mr-3 font-weight-6 main-color" @click="edit()">
				{{isEdit ? '取消' : '编辑'}}
			</view>
		</u-navbar>
		<view style="position: sticky;width: 100%;z-index: 1;" :style="{'top': top+'px'}" class="pt-1">
			<u-tabs :list="tbs" :is-scroll="false" :current="current" @change="change" active-color="#ff6022" style="height: 85rpx;"></u-tabs>
		</view>
		<view class="mx-3 mt-1">
			<view class="flex align-center justify-center mt-2" v-if="!list[typeArr[current]].load">
				<u-loading :show="!list[typeArr[current]].load" color="#ff6022" size="35"></u-loading>
			</view>
			<template v-if="current == 0">
				<history-playlist ref="vod" :index="index" v-for="(item,index) in list.vod.list" :key="index" :item="item" @checked="checked"
				 :edit="isEdit" v-if="list.vod.load"></history-playlist>
				<u-loadmore class="pt-2" :status="list.vod.loadStatus" v-if="list.vod.load" />
			</template>
			<template v-if="current == 1">
				<view class="flex flex-column mt-2">
					<art-list ref="art" v-for="(item,index) in list.art.list" :key="index" :item="item.art" @checked="checked" :edit="isEdit"
					 :ulogId="item.ulog_id" v-if="list.art.load"></art-list>
				</view>
				<u-loadmore class="pt-2" :status="list.art.loadStatus" v-if="list.art.load" />
			</template>
			<template v-if="current == 2">
				<history-playlist :index="index" v-for="(item,index) in list.topic.list" :key="index" :item="item.topic" v-if="list.topic.load"></history-playlist>
				<u-loadmore class="pt-2" :status="list.topic.loadStatus" v-if="list.topic.load" />
			</template>
		</view>
		<view style="padding-top: 130rpx;" v-if="isEdit"></view>
		<bottom-menu ref="bottomMenu" :deleteNumber="deleteNumber" @doCheckedAll="doCheckedAll()" @doDelete="doDelete()"></bottom-menu>
	</view>
</template>

<script>
	export default {
		async onLoad(e) {
			this.current = e.current || 0;
			let sysInfo = uni.getSystemInfoSync();
			this.top = sysInfo.statusBarHeight + uni.upx2px(70);
			this.loadData();
		},
		data() {
			return {
				list: {
					vod: {
						page: 1,
						pageSize: 10,
						list: [],
						loadStatus: 'loadmore',
						load: false
					},
					art: {
						page: 1,
						pageSize: 10,
						list: [],
						loadStatus: 'loadmore',
						load: false
					},
					topic: {
						page: 1,
						pageSize: 10,
						list: [],
						loadStatus: 'loadmore',
						load: false
					}
				},
				typeArr: ['vod', 'art', 'topic'],
				top: 0,
				tbs: [{
					name: '影片'
				}, {
					name: '文章'
				}, {
					name: '专题'
				}],
				current: 0,
				isEdit: false,
				deleteNumber: 0,
			}
		},
		computed: {
			nowAct() {
				return this.typeArr[this.current];
			}
		},
		methods: {
			async loadData(reset = false) {
				let res = await this.$api.getUserHistory(this.nowAct, {
					page: this.list[this.nowAct].page,
					pageSize: this.list[this.nowAct].pageSize
				});
				if (res) {
					if (res.data.page == 1 || reset === true) {
						this.list[this.nowAct].list = res.data.list;
					} else {
						this.list[this.nowAct].list = this.list[this.nowAct].list.concat(res.data.list);
					}
					this.list[this.nowAct].loadStatus = 'loadmore';
					if (res.data.list.length < 10) this.list[this.nowAct].loadStatus = 'nomore';
					setTimeout(() => {
						this.list[this.nowAct].load = true;
					}, 300);
				}
			},
			edit() {
				if (this.isEdit) {
					this.doCancelAll();
					this.$refs['bottomMenu'].close();
				} else {
					this.$refs['bottomMenu'].open();
				}
				this.isEdit = !this.isEdit;
			},
			checked(id, checked) {
				let index = this.list[this.nowAct].list.findIndex(v => v.ulog_id === id);
				if (index == '-1') return;
				if (checked === true) {
					this.deleteNumber += 1;
				} else {
					this.deleteNumber -= 1;
				}
				this.list[this.nowAct].list[index].checked = checked;
			},
			doCheckedAll() {
				for (let i = 0; i < this.list[this.nowAct].list.length; i++) {
					this.$refs[this.nowAct][i].doCheck();
				}
			},
			doCancelAll() {
				for (let i = 0; i < this.list[this.nowAct].list.length; i++) {
					this.$refs[this.nowAct][i].doCancel();
				}
			},
			doDelete() {
				let del = [],
				delIndex = [];
				if (!this.deleteNumber) return this.$U.msg('请先勾选删除项');
				uni.showModal({
					title: '温馨提示',
					content: '您确定执行删除吗？',
					success: res => {
						if (!res.confirm) return;
						for (let i = 0; i < this.list[this.nowAct].list.length; i++) {
							let act = this.list[this.nowAct].list[i];
							if (act.checked === true) {
								del = [act.ulog_id, ...del];
								delIndex = [i, ...delIndex];
							}
						}
						for (let i = 0; i < delIndex.length; i++) {
							this.list[this.nowAct].list.splice(delIndex[i], 1);
						}
						if(this.list[this.nowAct].list.length < this.list[this.nowAct].pageSize){
							this.loadMore();
						}
						this.edit();
						this.doCancelAll();
						this.$api.deletesUlog(del.join(',')).then(res => {
							this.$U.msg(res.msg);
						});
					}
				});
			},
			change(index) {
				this.deleteNumber = 0;
				this.doCancelAll();
				this.current = index;
				if (this.list[this.typeArr[index]].load) return false;
				this.loadData();
			},
			loadMore(){
				if (this.list[this.nowAct].loadStatus != 'loadmore') return;
				this.list[this.nowAct].page += 1;
				this.list[this.nowAct].loadStatus = 'loading';
				this.loadData();
			},
			onReachBottom() {
				this.loadMore();
			},
		}
	}
</script>

<style lang="less">

</style>
