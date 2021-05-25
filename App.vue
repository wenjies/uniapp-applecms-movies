<script>
	import systemMixin from '@/mypUI/myp-mixin/systemMixin.js'
	export default {
		globalData: {},
		mixins: [systemMixin],
		onLaunch: function() {
			// 初始化登录
			this.$store.commit('initLogin');
			// 检测网络状态
			uni.getNetworkType({
				success: res => {
					if (res.networkType == 'none') {
						uni.showLoading({
							title: '无网络',
							mask: true
						});
						return false;
					}
					if (res.networkType != 'wifi') {
						uni.showToast({
							duration: 3000,
							title: '当前处于非wifi环境下，请留意流量使用',
							icon: 'none'
						})
					}
				}
			});
			uni.onNetworkStatusChange(res => {
				if (res.isConnected) {
					uni.hideLoading();
				} else {
					uni.showLoading({
						title: '无网络',
						mask: true
					});
					return false;
				}
				if (res.networkType != 'wifi') {
					uni.showToast({
						duration: 4000,
						title: '当前处于非wifi环境下，请留意流量使用',
						icon: 'none'
					})
				}
			});
			// 检测版本更新更新
			// #ifdef APP-PLUS || H5
			this.mypInitSystemInfo()
			// #endif
			// #ifndef APP-PLUS || H5
			setTimeout(() => {
				this.mypInitSystemInfo()
			}, 0)
			// #endif
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁定屏幕
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import '@/mypUI/base.scss';

	/* #ifndef APP-NVUE */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	@import "/common/css/animate.min.css";
	/* #endif */
	/* #ifdef H5 */
	@import '@/mypUI/h5.scss';
	/* #endif */
	@import "/common/css/main.css";
</style>
