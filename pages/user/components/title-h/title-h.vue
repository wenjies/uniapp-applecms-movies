<template>
	<view class="flex align-center justify-between flex-1">
		<view class="look-more-title">{{title}}</view>
		<view class="flex align-center" v-if="more != 'false'">
			<text class="hui mr-1 look-more-text">{{more}}</text>
			<u-icon name="arrow-right" color="#ff6022" size="30"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			title:String,
			more:{
				type:String,
				default:'更多'
			}
		}
	}
</script>

<style lang="scss">
.look-more {
		&-text {
			font-size: 26rpx;
		}

		&-title {
			font-size: 32rpx;
			font-weight: 600;
		}
	}
</style>
