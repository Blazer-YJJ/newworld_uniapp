<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化用户登陆状态
			this.$store.dispatch('initUserState')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 每个页面公共css */
	/* #ifndef APP-NVUE */
	/* 官方样式库 */
	@import url("./common/uni.css");
	/* Animate动画库 */
	@import url("./common/animate.min.css");
	/* #endif */
	/* free样式库 */
	@import url("./common/free.css");
	/* 全局样式库 */
	@import url("./common/common.css");
	/* #ifndef APP-NVUE */
	/* 自定义图标库 */
	@import url("./common/iconfont/iconfont.css");
	/* #endif */
</style>
