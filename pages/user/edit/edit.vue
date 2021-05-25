<template>
	<view>
		<u-navbar title="编辑资料" title-color="#333" back-icon-color="#333" :border-bottom="false" class="font-weight-7" style="font-size: 28rpx;">
			<view slot="right" class="mr-2">
				<text class="main-color font-weight-7" style="font-size: 29rpx;" @click="submit()">完成</text>
			</view>
		</u-navbar>
		<view class="mt-5 mx-3">
			<view class="flex flex-column justify-center align-center">
				<u-avatar size="160" :src="userInfo.user_portrait" @click="setAvatar()">
				</u-avatar>
				<view class="mt-2" @click="setAvatar()" style="font-size: 27rpx;">点击更换头像</view>
			</view>
			<view class="flex flex-column justify-center info">
				<view class="flex align-center justify-between border-bottom-hui mb-3">
					<text class="mb-2 info-title">昵称:</text>
					<input type="text" v-model="userInfo.user_nick_name" maxlength="15" class="pb-2" style="width: 615rpx;line-height: 40rpx;height: 40rpx;"
					 :adjust-position="false" />
				</view>
				<view class="flex align-center justify-between border-bottom-hui mb-3">
					<text class="mb-2 info-title">QQ:</text>
					<input type="number" v-model="userInfo.user_qq" class="pb-2" style="width: 625rpx;" :adjust-position="false">
				</view>
				<view class="flex align-center justify-between border-bottom-hui mb-3">
					<text class="mb-2 info-title">邮箱:</text>
					<input type="text" v-model="userInfo.user_email" class="pb-2" style="width: 615rpx;" :adjust-position="false">
				</view>
			</view>
			<!-- 	<view class="flex align-center justify-center mt-3">
				<view class="submit bg-main bai" @click="submit">
					<text class="submit-text">保存修改</text>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
			}
		},
		onLoad(e) {
			this.userInfo = JSON.parse(decodeURIComponent(e.userInfo));
		},
		methods: {
			setAvatar() {
				this.checkAuth(() => {
					uni.chooseImage({
						count: 1,
						success: res => {
							this.$api.changeAvatar(res.tempFilePaths[0]).then(req => {
								// #ifdef APP-PLUS
								uni.saveFile({
									tempFilePath: res.tempFilePaths[0],
									success: save => {
										this.$U.msg(req.msg);
										this.userInfo.user_portrait = save.savedFilePath;
										this.$store.commit('saveUser', this.userInfo);
										return;
									}
								});
								// #endif
								this.$U.msg(req.msg);
								this.userInfo.user_portrait = req.data.url;
								this.$store.commit('saveUser', this.userInfo);
							});
						}
					});
				});
			},
			submit() {
				if (!this.$U.isNullOrEmpty(this.userInfo.user_email) && !this.$U.isEmail(this.userInfo.user_email)) {
					this.$U.msg('请输入正确的邮箱地址');
				}
				if (!this.$U.isNullOrEmpty(this.userInfo.user_qq) && !this.$U.isQQ(this.userInfo.user_qq)) {
					this.$U.msg('请输入正确的QQ号码');
				}
				this.$api.changeInfo({
					nickname: this.userInfo.user_nick_name,
					email: this.userInfo.user_email,
					qq: this.userInfo.user_qq
				}).then(res => {
					if (res.errorCode) return this.$U.msg(res.data.msg);
					this.$store.commit('saveUser', this.userInfo);
					uni.navigateBack({
						delta: 1
					});
				});
			}
		}
	}
</script>

<style lang="less">
	.info {
		margin-top: 70rpx;

		&-title {
			font-size: 28rpx;
			font-weight: 500;
		}

		input {
			font-size: 28rpx;
			color: gray;
		}
	}

	.submit {
		width: 570rpx;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;

		&-text {
			line-height: 90rpx;
			font-size: 32rpx;
		}
	}
</style>
