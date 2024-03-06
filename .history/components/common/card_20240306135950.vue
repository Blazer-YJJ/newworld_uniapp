<template>
	<view>
		<view class="flex align-center py-2 px-3">
			<text class="font-md font-weight-bolder">{{ title }}</text>
		</view>
		<!-- 卡片区域 -->
		<slot></slot>
		<!-- 刷新 -->
		<view v-if="showRefresh" class="flex align-center justify-center py-2 text-main" hover-class="text-main-hover"
			@click="$emit('refresh')">
			<text class="iconfont icon-shuaxin"></text>
			换一批
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: String,
		showRefresh: {
			type: Boolean,
			default: true
		}
	}
}
</script>

<style></style>
