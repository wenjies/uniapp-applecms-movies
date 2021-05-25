<template>
	<view >
		<swiper style="height: 410rpx;width: 750rpx;" :indicator-dots="false" 
		:autoplay="true" circular="true"  next-margin="10"
		:interval="4000">
			<swiper-item v-for="(item,index) in list" :key="index">
				<image :src="item.vod_pic_slide" class="swiper-image" mode="aspectFill" @click="openDetail(item.vod_id)"></image>
				<view class="myp-align-center myp-justify-center">
					<text class="swiper-image-text">{{item.vod_name}}</text>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props:{
			list:{
				type:[Object,Array]
			}
		},
		methods:{
			openDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/movie/movie?id=' + id
				});
			}
		}
	}
</script>

<style>
	.swiper-image {
		width: 750rpx;
		height: 400rpx;
		/* border-radius: 10rpx; */
	}

	.swiper-image-text {
		position: relative;
		bottom: 45rpx;
		color: #FFFFFF;
		font-size: 25rpx;
	}
</style>
