<template>
	<view class="mb-2" @click="openDetail(item.topic_id)">
		<view style="width: 350rpx;">
			<image :src="isUrl(item.topic_pic)" mode="aspectFill" style="width: 350rpx;height: 220rpx;border-radius: 10rpx;"
			 lazy-load></image>
			<view class="myp-flex-row myp-align-center eye">
				<myp-icon name="eye" type="inverse" size="l"></myp-icon>
				<text style="font-size: 23rpx;" class="bai ml-1">{{numberToShort(item.topic_hits)}}</text>
			</view>
			<view class="myp-flex-row myp-align-center thumb">
				<myp-icon name="thumb" type="inverse" size="l"></myp-icon>
				<text style="font-size: 23rpx;" class="bai ml-1">{{numberToShort(item.topic_up)}}</text>
			</view>
			<view class="mt-1" style="height: 60rpx;">
				<text class="hei name">{{item.topic_name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import $U from '@/common/util.js';
	export default {
		props: {
			item: Object,
			iconText: String
		},
		methods: {
			numberToShort(int) {
				return $U.numberToShort(int);
			},
			openDetail(id) {
				console.log('打开专题详情ID' + id);
			},
			isUrl(url) {
				return $U.checkUrl(url)
			}
		}
	}
</script>

<style>
	.eye {
		position: absolute;
		bottom: 75rpx;
		left: 12rpx;
	}

	.thumb {
		position: absolute;
		bottom: 75rpx;
		right: 12rpx;
	}

	.name {
		font-size: 25rpx;
		color: #212121;
		lines: 2;
		text-overflow: ellipsis;
		line-height: 16px;
	}
</style>
