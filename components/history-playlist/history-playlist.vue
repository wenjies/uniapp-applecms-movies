<template>
	<view class="animated fadeIn faster">
		<u-checkbox-group>
			<view class="flex align-center">
				<u-checkbox active-color="#ff6022" shape="circle" v-model="checked" v-if="edit"></u-checkbox>
				<view class="flex align-center mt-15 vod" @click="edit ? doCheck() : openPlayDetail(item.vod.vod_id)">
					<view class="vod-pic-position">
						<image :src="$U.checkUrl(item.vod.vod_pic)" class="vod-pic" mode="aspectFill" lazy-load>
						</image>
						<view class="vod-remarks-position">
							<text style="font-size: 23rpx;" class="bai ml-1 text-ellipsis">{{item.vod.vod_remarks}}</text>
						</view>
					</view>
					<view class="flex flex-column" style="margin-left: 15rpx;">
						<view style="font-size: 28rpx;" class="text-ellipsis2 hei">{{item.vod.vod_name}} {{item.ulog_nid_name}}</view>
						<view style="font-size: 24rpx;color: gray;">{{played}}</view>
					</view>
				</view>
			</view>
		</u-checkbox-group>
	</view>
</template>

<script>
	export default {
		props: {
			item: [Object, Array],
			edit: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				checked: false
			}
		},
		watch: {
			checked(val, oldVal){
				this.doCheck(val);
			}
		},
		computed: {
			played() {
				let n = Math.round((this.item.ulog_progress / this.item.ulog_duration) * 100);
				return n > 0 ? '已观看 ' + n + '%' : '观看不足1%';
			}
		},
		methods: {
			// 打开详情页
			openPlayDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/movie/movie?id=' + id
				});
			},
			// 单选
			doCheck(val = null) {
				this.checked = val !== null ? val : !this.checked;
				if(val !== null)this.$emit('checked', this.item.ulog_id, this.checked);
			},
			// 取消
			doCancel() {
				this.checked = false;
			}
		}
	}
</script>

<style lang="less">
	.vod {
		height: 145rpx;
		margin-right: 5rpx;

		&-pic-position {
			position: relative;
			width: 260rpx;
			height: 145rpx;
		}

		&-remarks-position {
			position: absolute;
			bottom: 1rpx;
			right: 10rpx;
		}

		&-pic {
			will-change: transform;
			height: 145rpx;
			width: 260rpx;
		}
	}
</style>