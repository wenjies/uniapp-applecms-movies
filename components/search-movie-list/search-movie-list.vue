<template>
	<view class="animated fadeIn faster">
			<view class="flex mx-2 flex-1 myp-flex-row">
				<view style="height: 328rpx;width: 235rpx;">
					<image :src="$U.checkUrl(item.vod_pic)" mode="aspectFill" style="width: 235rpx;height: 328rpx;" @click="openDetail(item.vod_id)"></image>
					<view class="flex align-center justify-between mx-1" style="position: relative;bottom:35rpx;">
						<text class="bai" style="font-size: 23rpx;">{{item.vod_remarks.length > 8 ? '' :item.vod_remarks}}</text>
						<text class="main-color" style="font-size: 23rpx;">{{item.vod_score}}</text>
					</view>
				</view>
				<view class="flex flex-column">
					<view class="movie">
						<view class="movie-textBox">
							<view class="text-ellipsis">
								<view class="movie_name">
									<text v-html="item.vod_name"></text>
								</view>
							</view>
							<view class="movie-text">{{item.vod_year || '未知'}}·{{item.parentType ? item.parentType.type_name : '未知'}}·{{item.vod_area || '未知'}}·{{item.vod_lang || '未知'}}</view>
							<view class="movie-text text-ellipsis2">
								导演：<text v-html="replaceCon(item.vod_director)"></text>
							</view>
							<view class="movie-text text-ellipsis2">
								主演：<text v-html="replaceCon(item.vod_actor)"></text>
							</view>
						</view>
						<view class="movie-btn">
							<view class="text-align-center movie-btn-box" @click="openDetail(item.vod_id)">
								<text class="movie-btn-box-text">立即播放</text>
							</view>
							<view class="movie-btn-box2 flex myp-flex-row myp-align-center justify-center" @click="collect(index,item.vod_id)">
								<my-icon :name="item.isCollect ? 'wseed' : 'wsee'" iconStyle="font-size:38rpx" :type="item.isCollect ? 'main' : ''" @click="collect(index,item.vod_id)"></my-icon>
								<text class="movie-btn-box2-text2 ml-1" :class="item.isCollect ? 'main-color' : 'hei'">{{item.isCollect ? '已收藏' : '收藏'}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="border mx-2 my-3"></view>
	</view>
</template>

<script>
	export default {
		props: {
			item: [Object, Array],
			index:Number
		},
		data() {
			return {}
		},
		methods: {
			replaceCon(con) {
				return con.replace(/,/g, '  ') || '未知';
			},
			openDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/movie/movie?id=' + id
				});
			},
			collect(index,id) {
				this.$emit('doCollect',index,id);
			}
		}
	}
</script>

<style lang="less" scoped>
	.movie {
		line-height: 45rpx;
		margin-top: -8rpx;
		margin-left: 20rpx;

		&-name {
			font-size: 28rpx;
		}

		&-textBox {
			height: 270rpx;
		}

		&-text {
			width: 450rpx;
			font-size: 24rpx;
			color: gray;
		}

		&-btn {
			display: flex;
			align-items: center;
			justify-content: space-between;

			&-box {
				width: 210rpx;
				height: 65rpx;
				background-color: #ff6022;
				border-radius: 8rpx;

				&-text {
					color: #FFFFFF;
					line-height: 65rpx;
				}
			}

			&-box2 {
				margin-left: 20rpx;
				width: 200rpx;
				height: 65rpx;
				background-color: #f6f7f9;
				border-radius: 8rpx;

				&-text2 {
					line-height: 65rpx;
				}
			}
		}
	}
</style>
