<template>
	<view class="flex flex-column mt-2 vod" :class="fadeIn ? 'animated fadeIn faster' : ''" @click="openPlayDetail(item.vod.vod_id)">
		<view class="vod-pic-position">
			<image :src="$U.checkUrl(item.vod.vod_pic)" class="vod-pic" mode="aspectFill" lazy-load>
			</image>
			<view class="vod-remarks-position">
				<text style="font-size: 23rpx;" class="bai ml-1 text-ellipsis">{{item.vod.vod_remarks}}</text>
			</view>
		</view>
		<view style="font-size: 27rpx;" class="hei mt-1 flex myp-flex-row">
			<view class="text-ellipsis2" style="width: 295rpx;">{{item.vod.vod_name}} {{item.ulog_nid_name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: [Array, Object],
			fadeIn:true
		},
		methods: {
			openPlayDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/movie/movie?id=' + id
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.vod {
		height: 250rpx;
		margin-right: 5rpx;

		&-pic-position {
			position: relative;
			width: 310rpx;
			height: 170rpx;
		}

		&-remarks-position {
			position: absolute;
			bottom: 1rpx;
			right: 10rpx;
		}

		&-pic {
			will-change: transform;
			height: 170rpx;
			width: 310rpx;
		}
	}
</style>
