<template>
	<view class="myp-flex-row justify-center align-center my-2">
		<view class="myp-flex-row align-center btn" :class="rightText != false ? 'btn-left' : ''" 
		 v-if="leftText != false" @click="leftClick()">
			<myp-icon name="circle-play" size="l" @iconClicked="leftClick()" type="main"></myp-icon>
			<text class="ml-1 btn-text">{{leftText}}</text>
		</view>
		<view class="myp-flex-row align-center btn" :class="leftText != false ? 'btn-right' : ''" 
		v-if="rightText != false" @click="rightClick()">
			<myp-icon name="refresh" size="l" @iconClicked="rightClick()" type="main"></myp-icon>
			<text class="ml-1 btn-text">{{rightText}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			leftText: {
				type: [String, Boolean],
				default: '查看更多'
			},
			rightText: {
				type: String,
				default: '换一换'
			},
		},
		methods: {
			leftClick() {
				this.$emit('leftClick');
			},
			rightClick() {
				this.$emit('rightClick');
			},
		}
	}
</script>

<style lang="less" scoped>
	.btn{
		height: 55rpx;
		&-left{
			margin-right: 70rpx;
		}
		&-right{
			margin-left: 70rpx;
		}
		&-text{
			font-size: 25rpx;color: gray;line-height: 55rpx;
		}
	}
</style>
