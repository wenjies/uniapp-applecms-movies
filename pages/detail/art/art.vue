<template>
	<view>
		<view class="banner animated fadeIn faster" auto-focus>
			<image class="banner-img" 
			:src="$U.checkUrl(detail.art_pic,true) ? detail.art_pic :'/static/image/1.jpg'"
			 mode="aspectFill" lazy-load></image>
			<view class="title-area">
				<text class="title-text">{{$U.ellipsis(detail.art_name,32)}}</text>
			</view>
		</view>
		<view class="mx-2 my-2">
			<view class="flex align-center flex-column">
				<text style="font-size: 40rpx;" class="font-weight-6">{{$U.ellipsis(detail.art_name,35)}}</text>
				<view class="article-meta">
					<text class="article-meta-text article-author">{{detail.art_from || '匿名作者'}}</text>
					<text class="article-meta-text article-text">发表于</text>
					<text class="article-meta-text article-time">{{$U.friendlyDate(detail.art_time * 1000)}}</text>
					<text class="article-meta-text article-text">{{$U.numberToShort(detail.art_hits)}}浏览</text>
				</view>
			</view>
			<u-parse :html="detail.art_content" :selectable="true" :lazy-load="true" :show-with-animation="true" :use-cache="true"></u-parse>
			<view class="mt-5">
				<u-section line-color="#ff6022" title="相关文章" sub-title="查看更多" font-size="35"></u-section>
				<view class="flex flex-column mt-3 ml-1">
					<art-list :item="item" v-for="(item,index) in about" :key="index"></art-list>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
				about: []
			}
		},
		onLoad(e) {
			this.getDetail(e.id);
		},
		methods: {
			getDetail(id) {
				this.$api.getDetail('art', id).then(res => {
					this.detail = res.data.list;
					uni.setNavigationBarTitle({
						title: this.detail.art_name
					});
					setTimeout(() => {
						this.getAbout();
					}, 100);
				});
			},
			getAbout() {
				this.$api.getNews('art', {
					class_type: 'son_id',
					class_id: this.detail.type_id,
					page: 1,
					pageSize: 6
				}).then(res => {
					this.about = res.data.list;
				})
			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS */
	page {
		min-height: 100%;
	}

	/* #endif */

	.banner {
		height: 400rpx;
		position: relative;
		background-color: #ccc;
		flex-direction: row;
		overflow: hidden;
	}

	.banner-img {
		will-change: transform;
		width: 750rpx;
	}

	.title-area {
		position: absolute;
		left: 30rpx;
		right: 30rpx;
		bottom: 30rpx;
		z-index: 11;
	}

	.title-text {
		font-size: 32rpx;
		font-weight: 400;
		line-height: 42rpx;
		lines: 2;
		text-overflow: ellipsis;
		color: #ffffff;
	}

	.article-meta {
		padding: 20rpx 30rpx;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.article-meta-text {
		color: gray;
	}

	.article-text {
		font-size: 26rpx;
		line-height: 50rpx;
		margin: 0 20rpx;
	}

	.article-author {
		font-size: 30rpx;
	}

	.article-time {
		font-size: 30rpx;
	}
</style>
