<template>
	<view>
		<view class="myp-flex-row myp-justify-between myp-flex-one title-h">
			<text class="font-weight-7 hei" style="font-size: 30rpx;">{{title}}</text>
			<view class="myp-flex-row myp-align-center" @click="toMore" v-if="rightText != 'false'">
				<text style="font-size: 25rpx;color: gray;">{{rightText}}</text>
				<uni-icons type="arrowright" size="14" color="gray" style="margin-top: 3rpx;" @click="toMore"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components: {
			uniIcons
		},
		props:{
			title:String,
			rightText:{
				type:String,
				default:'查看更多'
			}
		},
		methods:{
			toMore(){
				this.$emit('toMore');
			}
		}
	}
</script>

<style>
	.title-h{
		/* #ifdef APP-PLUS */
		margin: 25rpx 20rpx 15rpx 20rpx;
		/* #endif */
		/* #ifndef APP-PLUS */
		margin: -8rpx 20rpx 15rpx 20rpx;
		/* #endif */
	}
</style>
