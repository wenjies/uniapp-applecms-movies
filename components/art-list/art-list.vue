<template>
	<view class="mb-2 animated fadeIn faster" @click="edit ? doCheck():openDetail(item.art_id)">
		<u-checkbox-group>
			<view class="flex align-center">
				<u-checkbox active-color="#ff6022" shape="circle" v-model="checked" v-if="edit"></u-checkbox>
				<image :src="$U.checkUrl(item.art_pic)" class="mr-15 img" :style="edit ? 'width: 260rpx;' : 'width: 270rpx;'" mode="aspectFill"></image>
				<view class="myp-flex-row-reverse">
					<view style="height: 145rpx;" :style="edit ? 'width: 370rpx;' : 'width: 425rpx;'">
						<text class="art-title">{{item.art_name}}</text>
					</view>
					<view class="myp-flex-row myp-align-center myp-justify-between">
						<text class="bottom-text">{{$U.friendlyDate(item.art_time * 1000)}}</text>
						<view class="myp-flex-row myp-align-center mr-1">
							<myp-icon name="thumb" type="disabled" size="s"></myp-icon>
							<text class="bottom-text" style="margin-left: 8rpx;">{{$U.numberToShort(item.art_up,2)}}</text>
						</view>
						<view class="myp-flex-row myp-align-center mr-1">
							<myp-icon name="eye" type="disabled" size="s"></myp-icon>
							<text class="bottom-text" style="margin-left: 8rpx;">{{$U.numberToShort(item.art_hits,2)}}人看过</text>
						</view>
					</view>
				</view>
			</view>
		</u-checkbox-group>
	</view>
</template>

<script>
	import $U from '@/common/util.js';
	export default {
		props: {
			item: Object,
			edit: {
				type: Boolean,
				default: false
			},
			ulogId: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				checked: false
			}
		},
		watch: {
			checked(val, oldVal) {
				this.doCheck(val);
			}
		},
		methods: {
			openDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/art/art?id=' + id
				})
			},
			// 单选
			doCheck(val = null) {
				this.checked = val !== null ? val : !this.checked;
				if (val !== null) this.$emit('checked', this.ulogId, this.checked);
			},
			// 取消
			doCancel() {
				this.checked = false;
			}
		},
	}
</script>

<style>
	.art-title {
		font-size: 30rpx;
		text-overflow: ellipsis;
		word-break: break-word;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.bottom-text {
		font-size: 24rpx;
		color: #C0C0C0;
	}

	.img {
		will-change: transform;
		height: 170rpx;
		border-radius: 10rpx;
	}
</style>
