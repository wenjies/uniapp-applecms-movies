<template>
	<view class="mb-2" :class="listClass+' '+animated" @click="openDetail(item.vod_id)" style="position: relative;">
		<image :src="$U.checkUrl(item.vod_pic)" mode="aspectFill" class="movie_image" lazy-load></image>
		<view class="top-title" v-if="iconText">
			{{icon(item,iconText)}}
		</view>
		<text class="movie_remark bai">{{item.vod_remarks.length > 8 ? '' :item.vod_remarks}}</text>
		<text class="myp-color-main movie_remark_score" v-if="isScore">{{item.vod_score}}</text>
		<view style="max-width: 230rpx;text-align: center;">
			<text class="hei movie_name text-ellipsis">{{item.vod_name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			listClass: String,
			animated:{
				type:String,
				default:'animated fadeIn faster'
			},
			iconText: String,
			isScore: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			openDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/movie/movie?id=' + id
				});
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

<style lang="less" scoped>
	.page {
		display: flex;
	}
	.movie_image {
		height: 330rpx;
		width: 230rpx;
		border-radius: 10rpx;
		will-change: transform;
	}

	.movie_remark {
		font-size: 23rpx;
		position: absolute;
		bottom: 40rpx;
		left: 10rpx;
	}

	.movie_remark_score {
		font-size: 23rpx;
		position: absolute;
		bottom: 40rpx;
		right: 10rpx;
	}

	.movie_name {
		font-size: 25rpx;
		line-height: 16px;
	}

	.top-title {
		background-color: #ff6022;
		border-top-left-radius: 10rpx;
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		font-size: 22rpx;
		line-height: 32rpx;
		padding: 2rpx 7rpx 0rpx 7rpx;
	}
</style>
