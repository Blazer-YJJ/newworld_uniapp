<template>
	<view class="flex border-bottom border-light-secondary px-3" style="min-height: 100rpx;">
		<view class="flex align-center justify-center font-md" style="width: 180rpx; height: 100rpx;">
			{{ title }}
		</view>
		<view class="flex-1 flex align-center">
			<slot></slot>
		</view>
		<view v-if="rightIcon" class="flex align-center justify-center" style="height: 100rpx; width: 80rpx;">
			<text class="iconfont icon-jinru text-muted"></text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ""
			},
			rightIcon: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style>
</style>
