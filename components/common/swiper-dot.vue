<template>
	<view class="position-relative">
		<slot></slot>
		<view class="flex align-center text-white rounded-bottom-lg px-2"
			style="height: 70rpx; position: absolute; bottom: 0; left: 0; right: 0; background-image: linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.8));">
			<view class="text-ellipsis" style="width: 80%;">
				{{ info[current] ? info[current].title : '暂无描述~' }}
			</view>
			<view class="flex align-center justify-end flex-shrink" style="width: 20%;">
				<view v-for="(item, index) in info" :key="index" class="rounded-circle ml-1"
					style="width: 16rpx; height: 16rpx;"
					:style="index === current ? 'background-color: rgba(255,255,255,1);' : 'background-color: rgba(255,255,255,0.5);'">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		info: Array,
		current: {
			type: Number,
			default: 0
		}
	}
}
</script>

<style></style>
