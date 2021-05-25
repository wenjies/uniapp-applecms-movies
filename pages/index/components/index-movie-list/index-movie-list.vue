<template>
	<view class="mb-2" :class="listClass" @click="openDetail(item.vod_id)">
		<image :src="isUrl(item.vod_pic)" mode="aspectFill" class="movie_image" lazy-load></image>
		<text v-if="iconText"
		 class="top_title">{{icon(item,iconText)}}</text>
		<text class="movie_remark bai">{{item.vod_remarks.length > 8 ? '' :item.vod_remarks}}</text>
		<text class="myp-color-main movie_remark_score" v-if="isScore">{{item.vod_score}}</text>
		<view class="myp-justify-center myp-align-center">
			<text class="hei movie_name text-ellipsis" style="max-width: 230rpx">{{item.vod_name}}</text>
		</view>
	</view>
</template>

<script>
	import $U from '@/common/util.js';
	export default {
		props: {
			item: Object,
			iconText: String,
			isScore: {
				type: Boolean,
				default: true
			},
			listClass: String
		},
		methods: {
			openDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/movie/movie?id=' + id
				});
			},
			numberToShort(int) {
				return $U.numberToShort(int);
			},
			isUrl(url) {
				return $U.checkUrl(url)
			},
			icon(item, text) {
				if (text == 'class') return item.vod_class;
				if (text == 'hits_day') return '今日热度' + item.vod_hits_day;
				if (text == 'hits_week') return '周热度' + item.vod_hits_week;
				if (text == 'hits_month') return '月热度' + item.vod_hits_month;
				if (text == 'hits_all') return '总热度' + item.vod_hits;
				return text;
			}
		}
	}
</script>

<style>
	.movie_image {
		height: 330rpx;
		width: 230rpx;
		border-radius: 10rpx;
	}

	.movie_remark {
		font-size: 23rpx;
		position: absolute;
		bottom: 46rpx;
		left: 10rpx;
	}

	.movie_remark_score {
		font-size: 23rpx;
		position: absolute;
		bottom: 46rpx;
		right: 10rpx;
	}

	.movie_name {
		font-size: 25rpx;
		margin-top: 12rpx;
		line-height: 16px;
	}

	.eye {
		position: absolute;
		bottom: 44rpx;
		left: 10rpx;
	}

	.collection {
		position: absolute;
		bottom: 48rpx;
		right: 10rpx;
	}

	.movie_name2 {
		width: 350rpx;
		font-size: 25rpx;
		color: #212121;
		lines: 1;
		text-overflow: ellipsis;
		line-height: 16px;
	}
	.top_title {
		background-color: #ff6022;
		border-top-left-radius: 10rpx;
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		font-size: 22rpx;
		padding: 5rpx;
	}
</style>
