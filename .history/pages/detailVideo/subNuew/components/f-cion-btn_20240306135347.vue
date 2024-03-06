<template>
	<view class="flex align-stretch" style="height: 44px;">
		<view class="video-btn" @click="$emit('click')">
			<text class="iconfont text-white" :style="'font-size:' + fontSize + 'px;'">{{ icon }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			icon: {
				type: String,
				default: ''
			},
			fontSize: {
				type: [String, Number],
				default: 15
			}
		}
	}
</script>

<style>
	.video-btn {
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
	}
</style>
