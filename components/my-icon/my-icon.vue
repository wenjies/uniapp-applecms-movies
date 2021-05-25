<template>
	<view bubble="true" class="icon-box" @tap.stop="toClickIcon">
		<text class="my-iconfont" :class="['myp-color-'+type, 'myp-size-'+size]" :style="iconStyle">{{icons[name]}}</text>
		<slot></slot>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	dom.addRule('fontFace', {
		'fontFamily': "myiconfont",
		'src': "url('http://at.alicdn.com/t/font_2101710_7k9532er07l.ttf')"
	})
	// #endif

	import icons from './icons.js'

	export default {
		props: {
			name: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: ''
			},
			size: {
				type: String,
				default: 'l'
			},
			iconStyle: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				icons: icons
			}
		},
		methods: {
			toClickIcon(e) {
				this.$emit("click")
				e.stopPropagation && e.stopPropagation()
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	@font-face {
		font-family: 'myiconfont';
		/* project id 2101710 */
		src: url('http://at.alicdn.com/t/font_2101710_7k9532er07l.eot');
		src: url('http://at.alicdn.com/t/font_2101710_7k9532er07l.eot?#iefix') format('embedded-opentype'),
			url('http://at.alicdn.com/t/font_2101710_7k9532er07l.woff2') format('woff2'),
			url('http://at.alicdn.com/t/font_2101710_7k9532er07l.woff') format('woff'),
			url('http://at.alicdn.com/t/font_2101710_7k9532er07l.ttf') format('truetype'),
			url('http://at.alicdn.com/t/font_2101710_7k9532er07l.svg#myiconfont') format('svg');
	}

	/* #endif */

	.my-iconfont {
		font-family: myiconfont;
		text-decoration: none;
		text-align: center;
	}

	.icon-box {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		justify-content: center;
		align-items: center;
	}
</style>
