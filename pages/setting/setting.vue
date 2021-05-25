<template>
	<view>
		<u-navbar title="设置" class="font-weight-7" style="font-size: 28rpx;" title-color="#333" back-icon-color="#333"
		 :border-bottom="false">
		</u-navbar>
		<uni-list>
			<uni-list-item class="mb-2">
				<template v-slot:left="">
					<view><text>清理缓存</text></view>
				</template>
				<template v-slot:right="">
					<text class="text-gray" style="font-size: 24rpx;">17.03M</text>
				</template>
			</uni-list-item>
			<uni-list-item>
				<template v-slot:left="">
					<view><text>版本更新</text></view>
				</template>
				<template v-slot:right="">
					<text class="text-gray" style="font-size: 24rpx;">v1.0.0</text>
				</template>
			</uni-list-item>
			<uni-list-item>
				<template v-slot:left="">
					<view><text>关于我们</text></view>
				</template>
			</uni-list-item>
			<uni-list-item>
				<template v-slot:left="">
					<view><text>意见反馈</text></view>
				</template>
			</uni-list-item>
			<uni-list-item>
				<template v-slot:left="">
					<view><text>消息通知</text></view>
				</template>
			</uni-list-item>
		</uni-list>
		<view class="p-2">
			<view @click="logout" class="border-bai bg-main" style="border-radius: 50rpx;margin-top: 35rpx;">
				<view style="height: 90rpx;" class="flex align-center justify-center font-weight-bold">注销登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			logout() {
				this.$store.commit('logout');
				this.$U.msg('注销登陆成功');
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style></style>
