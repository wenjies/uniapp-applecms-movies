<template>
	<view class="myp-flex-row mb-2" @click="openDetail(item.art_id)">
		<image :src="isUrl(item.art_pic)" class="mr-15 img" mode="aspectFill" v-if="isUrl(item.art_pic)"></image>
		<view class="myp-flex-row-reverse">
			<text class="art-title">{{item.art_name}}</text>
			<view class="myp-flex-row myp-align-center myp-justify-between">
				<text class="bottom-text">{{formatTime(item.art_time)}}</text>
				<view class="myp-flex-row myp-align-center mr-1">
					<myp-icon name="thumb" type="disabled" size="s"></myp-icon>
					<text class="bottom-text" style="margin-left: 8rpx;">{{numberToShort(item.art_up)}}</text>
				</view>
				<view class="myp-flex-row myp-align-center mr-1">
					<myp-icon name="eye" type="disabled" size="s"></myp-icon>
					<text class="bottom-text" style="margin-left: 8rpx;">{{numberToShort(item.art_hits)}}人看过</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $U from '@/common/util.js';
	export default {
		props: {
			item: Object,
		},
		methods: {
			numberToShort(int) {
				return $U.numberToShort(int, 2);
			},
			formatTime(int) {
				return $U.friendlyDate(int * 1000);
			},
			openDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/art/art?id=' + id
				})
			},
			isUrl(url) {
				return $U.checkUrl(url)
			}
		},
	}
</script>

<style>
	.art-title {
		height: 145rpx;
		width: 435rpx;
		font-size: 30rpx;
		lines: 3;
		text-overflow: ellipsis;
	}

	.bottom-text {
		font-size: 24rpx;
		color: #C0C0C0;
	}

	.img {
		width: 270rpx;
		height: 170rpx;
		border-radius: 10rpx;
	}
</style>
