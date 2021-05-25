<template>
	<view>
		<uni-popup ref="options" type="bottom">
			<view class="popup flex align-center justify-center">
				<view class="popup-box mr-5" @click="checkedAll()">全选</view>
				<view style="color: gray;">|</view>
				<view class="popup-box ml-5" :class="!deleteNumber ?'popup-del' : 'popup-del2'" @click="doDelete()">{{deleteBtn}}</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		props: {
			deleteNumber: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {

			};
		},
		computed: {
			deleteBtn() {
				return this.deleteNumber ? '删除' + this.deleteNumber + '条' : '删除';
			}
		},
		methods: {
			open() {
				this.$refs.options.open();
			},
			close() {
				this.$refs.options.close();
			},
			// 全选
			checkedAll() {
				this.$emit('doCheckedAll');
			},
			// 删除
			doDelete() {
				this.$emit('doDelete');
			},
		}
	}
</script>

<style lang="less">
	.popup {
		height: 140rpx;
		background-color: #FFFFFF;
		border-top-left-radius: 35rpx;
		border-top-right-radius: 35rpx;

		&-box {
			text-align: center;
			font-size: 29rpx;
			width: 200rpx;
		}

		&-del {
			color: #ff602280;

		}

		&-del2 {
			color: #ff6022;
		}
	}
</style>
