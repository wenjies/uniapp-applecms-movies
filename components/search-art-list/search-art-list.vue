<template>
	<view class="myp-flex-row mb-2 animated fadeIn faster" @click="openDetail(item.art_id)">
		<view class="myp-flex-row-reverse">
			<view style="height: 145rpx;width: 435rpx;">
				<view class="art-title text-ellipsis3">
					<text v-html="item.art_name"></text>
				</view>
			</view>
			<view class="myp-flex-row myp-align-center myp-justify-between">
				<text class="bottom-text">{{$U.friendlyDate(item.art_time * 1000)}}</text>
				<view class="myp-flex-row myp-align-center mr-1">
					<myp-icon name="thumb" type="disabled" size="s"></myp-icon>
					<text class="bottom-text" style="margin-left: 8rpx;">{{$U.numberToShort(item.art_up, 2)}}</text>
				</view>
				<view class="myp-flex-row myp-align-center mr-1">
					<myp-icon name="eye" type="disabled" size="s"></myp-icon>
					<text class="bottom-text" style="margin-left: 8rpx;">{{$U.numberToShort(item.art_hits,2)}}人看过</text>
				</view>
			</view>
		</view>
		<image :src="$U.checkUrl(item.art_pic)" class="ml-1 img" mode="aspectFill" v-if="$U.checkUrl(item.art_pic)"></image>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
		},
		methods: {
			openDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/art/art?id=' + id
				})
			}
		},
	}
</script>

<style>
	.art-title {
		font-size: 30rpx;
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
