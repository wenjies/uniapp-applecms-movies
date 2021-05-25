<template>
	<view>
		<u-navbar is-back backgroundColor="#FFFFFF" :border-bottom="false" back-icon-name="arrow-left" back-icon-size="38"></u-navbar>
		<view class="flex justify-start flex-column">
			<text class="title hei">登录</text>
			<text class="gray" style="font-size: 27rpx;margin-left: 80rpx;
		margin-top: 20rpx;">未验证的手机号将自动创建新用户</text>
		</view>
		<view class="flex align-center justify-center flex-column inputBox">
			<template v-if="loginType == 'username'">
				<view class="flex align-center inputBox-item">
					<myp-icon name="user-check" size="lll" type="main" class="mr-1 mb-3"></myp-icon>
					<input type="text" maxlength="25" class="inputBox-text-input" :adjust-position="false" placeholder="请输入用户名/手机号/邮箱"
					 v-model="username" @input="checkInputLen" />
				</view>
				<view class="flex align-center inputBox-item">
					<myp-icon name="lock" size="ll" type="main" class="mr-1 mb-3"></myp-icon>
					<input type="text" maxlength="25" :adjust-position="false" class="inputBox-text-input" password placeholder="请输入登录密码"
					 v-model="password" @input="checkInputLen" />
				</view>
			</template>
			<template v-else>
				<view class="flex align-center inputBox-item">
					<myp-icon name="phone" size="ll" type="main" class="mr-1 mb-3"></myp-icon>
					<input type="number" maxlength="11" :adjust-position="false" class="inputBox-text-input" placeholder="请输入手机号"
					 v-model="phone" @input="checkInputLen" />
				</view>
				<view class="flex align-center inputBox-item">
					<myp-icon name="lock" size="ll" type="main" class="mr-1 mb-3"></myp-icon>
					<view class="flex align-center justify-between">
						<input type="number" :maxlength="codeLen" :adjust-position="false" class="inputBox-code-input" placeholder="请输入验证码"
						 v-model="code" @input="checkInputLen" />
						<view class="mr-3 mb-3 text-align-center" style="width: 240rpx;" @click="getCode">
							{{getCodeTime === 0 ? '获取验证码' : getCodeTime+' 秒后重新获取'}}
						</view>
					</view>
				</view>
			</template>
			<view class="submit" :class="!disabled ? 'bg-disable gray disabled' : 'bg-main bai'" @click="submit">
				<text class="submit-text">登 录</text>
			</view>
		</view>
		<view class="flex align-center justify-between flex-1 other">
			<template v-if="loginType == 'username'">
				<view class="other-text" @click="changeLoginType('phone')">
					验证码登录
				</view>
			</template>
			<template v-else>
				<view class="other-text" @click="changeLoginType('username')">
					密码登录
				</view>
			</template>
		</view>
		<view class="agree">
			<view class="flex align-center justify-center mt-5">
				<view class="agree-icon">
					<u-checkbox-group>
						<u-checkbox icon-size="13" active-color="#ff6022" shape="circle" v-model="agree"></u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="ml-1" style="color: gray;">我已阅读并同意</view>
				<view style="color: #2B85E4;">《用户协议和隐私政策》</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agree: true,
				loginType: 'phone',
				disabled: false,
				getCodeTime: 0,
				username: '',
				password: '',
				phone: '',
				codeLen: 4,
				code: ''
			}
		},
		methods: {
			changeLoginType(val) {
				this.crearInput();
				this.loginType = val;
			},
			checkInputLen() {
				if(this.loginType == 'phone'){
					if (this.$U.isMobile(this.phone) && this.code.length == this.codeLen) return this.disabled = true;
					return this.disabled = false;
				}
				if (this.username.length >= 5 && this.password.length >= 6) {
					return this.disabled = true;
				}
				return this.disabled = false;
			},
			isEmpty(value) {
				return this.$u.test.isEmpty(value);
			},
			createDevice() {
				// #ifdef APP-PLUS
				plus.device.getInfo({
					success: (e) => {
						let info = uni.getSystemInfoSync();
						this.$api.createDevice({
							model: info.model,
							system: info.system,
							platform: info.platform,
							deviceId: e.uuid,
							brand: info.brand
						});
					}

				});
				// #endif
				// #ifndef APP-PLUS
				let info = uni.getSystemInfoSync();
				let params = {
					model: info.model,
					system: info.system,
					platform: info.platform,
					deviceId: 'noApp',
					brand: 'noApp'
				};
				this.$api.createDevice(params);
				// #endif
			},
			getInfo(token) {
				this.$http.get('/user/info', {
					header: {
						authorization: token
					}
				}).then(res => {
					if (res.errorCode) return this.$U.msg(res.msg);
					this.$store.commit('saveUser', res.data);
					return uni.navigateBack({
						delta: 1
					});
				});
			},
			crearInput() {
				this.username = '';
				this.password = '';
				this.code = '';
				this.phone = '';
				this.disabled = false;
				return true;
			},
			getCode() {
				if (this.getCodeTime > 0) return false;
				if (this.phone.length != 11) return this.$U.msg('请输入11位手机号码');
				if (!this.$U.isMobile(this.phone)) return this.$U.msg('手机号码格式不正确');
				this.$api.sendCode(this.phone).then(res => {
					if (res.errorCode && res.errorCode != 30002) return this.$U.msg(res.msg);
					if (res.errorCode == 30002) {
						this.code = res.msg;
						this.disabled = true;
						this.$U.msg('获取成功');
					}
					this.getCodeTime = 60;
					let timer = setInterval(() => {
						if (this.getCodeTime >= 1) {
							this.getCodeTime--;
						} else {
							this.getCodeTime = 0;
							clearInterval(timer);
						}
					}, 1000);
				});
			},
			async login() {
				let res = false;
				if (this.loginType == 'phone') {
					if (!this.$U.isMobile(this.phone)) return this.$U.msg('请输入正确的手机号码');
					res = await this.$api.phoneLogin(this.phone, this.code);
				}
				if (this.loginType == 'username') {
					res = await this.$api.login(this.username, this.password);
				}
				if (res) {
					if (res.errorCode) return this.$U.msg(res.msg);
					this.$store.commit('login', res.data.token);
					this.createDevice();
					this.getInfo(res.data.token);
				}
			},
			submit() {
				if (!this.disabled) return this.$U.msg('非法提交');
				if (!this.agree) return this.$U.msg('请勾选我已阅读并同意协议');
				if (!this.isReg) return this.login();
			}
		}
	}
</script>

<style lang="less" scoped>
	.title {
		margin-left: 80rpx;
		margin-top: 10rpx;
		font-weight: bold;
		font-size: 46rpx;
	}

	.inputBox {
		margin-top: 60rpx;

		&-item {
			border-bottom: 1rpx solid #f5f5f5;
			margin-bottom: 50rpx;
		}

		&-code-input {
			width: 260rpx;
			margin-bottom: 30rpx;
		}

		&-text-input {
			width: 540rpx;
			margin-bottom: 30rpx;
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

	.other {
		margin: 50rpx 85rpx 0 85rpx;

		&-text {
			color: gray;
			font-size: 27rpx;
		}
	}

	.agree {
		position: absolute;
		bottom: 50rpx;
		left: 90rpx;
		right: 90rpx;

		&-icon {
			margin-right: -30rpx;
			margin-bottom: 8rpx;
		}
	}

	.hover-class {
		background-color: #CCCCCC;
	}
</style>
