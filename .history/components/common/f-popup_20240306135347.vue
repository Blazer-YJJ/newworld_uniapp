<template>
	<view>
		<view class="user-but-frame position-fixed top-0 left-0 right-0 bottom-0 animated faster fadeIn"
	      v-if="showButFrame"
		  @click.stop="hide"
		>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showButFrame: false
			}
		},
		methods: {
			// 弹框显示
			show() {
				this.showButFrame = true
			},
			// 弹框隐藏
			hide() {
				this.showButFrame = false
			}
		}
	}
</script>

<style>
	.user-but-frame {
		background-color: rgba(0,0,0,0.3);
		z-index: 999;
	}
</style>
