<template>
	<view class="mb-2" @click="openDetail(item.topic_id)">
		<view style="width: 350rpx;">
			<image :src="$U.checkUrl(item.topic_pic)" mode="aspectFill" style="width: 350rpx;height: 220rpx;border-radius: 10rpx;"
			 lazy-load></image>
			<view class="flex align-center justify-between flex-1 icon-position mx-1">
				<view class="myp-flex-row myp-align-center">
					<myp-icon name="eye" type="inverse" size="l"></myp-icon>
					<text style="font-size: 23rpx;" class="bai ml-1">{{$U.numberToShort(item.topic_hits)}}</text>
				</view>
				<view class="myp-flex-row myp-align-center">
					<myp-icon name="thumb" type="inverse" size="l"></myp-icon>
					<text style="font-size: 23rpx;" class="bai ml-1">{{$U.numberToShort(item.topic_up)}}</text>
				</view>
			</view>
			<view class="mt-1 name text-ellipsis2" style="height: 60rpx;margin-top: -35rpx;">
				<text v-html="item.topic_name"></text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			iconText: String
		},
		methods: {
			openDetail(id) {
				console.log('打开专题详情ID' + id);
			}
		}
	}
</script>

<style>
	.icon-position {
		position: relative;
		bottom: 53rpx;
	}

	.name {
		font-size: 25rpx;
		color: #212121;
		line-height: 16px;
	}
</style>
