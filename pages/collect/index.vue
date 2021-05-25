<template>
	<view>
		<u-navbar title="我的收藏" class="font-weight-7" style="font-size: 28rpx;" title-color="#333" back-icon-color="#333"
		 :border-bottom="false">
			<view slot="right" style="font-size: 28rpx;" class="mr-3 font-weight-6 main-color" @click="edit()">
				{{isEdit ? '取消' : '编辑'}}
			</view>
		</u-navbar>
		<view class="mx-3 mt-1">
			<view class="flex align-center justify-center" v-if="!list.load">
				<u-loading :show="!list.load" color="#ff6022" size="35"></u-loading>
			</view>
			<collect-movie-list ref="list" v-for="(item,index) in list.list" :key="index" :item="item" :index="index" :edit="isEdit"
			 v-if="list.load" @checked="checked"></collect-movie-list>
			<u-loadmore class="pt-2" :status="list.loadStatus" v-if="list.load" />
			<view style="padding-top: 130rpx;" v-if="isEdit"></view>
		</view>
		<bottom-menu ref="bottomMenu" :deleteNumber="deleteNumber" @doCheckedAll="doCheckedAll()" @doDelete="doDelete()"></bottom-menu>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.loadData();
		},
		data() {
			return {
				list: {
					page: 1,
					pageSize: 20,
					list: [],
					loadStatus: 'loadmore',
					load: false
				},
				isEdit: false,
				deleteNumber: 0,
			}
		},
		methods: {
			loadData() {
				this.$api.getUserVodCollect({
					page: this.list.page,
					pageSize: this.list.pageSize
				}).then(res => {
					if (res.data.page == 1) {
						this.list.list = res.data.list;
					} else {
						this.list.list = this.list.list.concat(res.data.list);
					}
					this.list.loadStatus = 'loadmore';
					if (res.data.list.length < 10) this.list.loadStatus = 'nomore';
					setTimeout(() => {
						this.list.load = true;
					}, 300);
				});
			},
			onReachBottom() {
				this.loadMore();
			},
			loadMore(){
				if (this.list.loadStatus != 'loadmore') return;
				this.list.page += 1;
				this.list.loadStatus = 'loading';
				this.loadData();
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
				let index = this.list.list.findIndex(v => v.ulog_id === id);
				if (index == '-1') return;
				if (checked === true) {
					this.deleteNumber += 1;
				} else {
					this.deleteNumber -= 1;
				}
				this.list.list[index].checked = checked;
			},
			doCheckedAll() {
				for (let i = 0; i < this.list.list.length; i++) {
					this.$refs.list[i].doCheck();
				}
			},
			doCancelAll() {
				for (let i = 0; i < this.list.list.length; i++) {
					this.$refs.list[i].doCancel();
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
						for (let i = 0; i < this.list.list.length; i++) {
							let act = this.list.list[i];
							if (act.checked === true) {
								del = [act.ulog_id, ...del];
								delIndex = [i, ...delIndex];
							}
						}
						for (let i = 0; i < delIndex.length; i++) {
							this.list.list.splice(delIndex[i], 1);
						}
						if(this.list.list.length < this.list.pageSize){
							this.loadMore();
						}
						this.doCancelAll();
						this.$api.deletesUlog(del.join(',')).then(res => {
							this.$U.msg(res.msg);
						});
					}
				});
			}
		}
	}
</script>

<style lang="less">

</style>
