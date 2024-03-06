<template>
	<view class="px-2">
		<main-big-button @click="logout">
			<text class="iconfont icon-guanzhu px-2"></text>退出登录
		</main-big-button>
	</view>
</template>

<script>
	import mainBigButton from '@/components/common/main-big-button.vue'
	
	export default {
		components: {
			mainBigButton
		},
		data() {
			return {
				
			}
		},
		methods: {
			logout() {
				this.$store.dispatch('logout').then(res => {
					uni.switchTab({
						url: '../user/user'
					});
					uni.showToast({
						title: '账户已成功退出',
						icon: 'none'
					})
				});
			}
		}
	}
</script>

<style>

</style>
