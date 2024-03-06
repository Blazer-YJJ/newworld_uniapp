import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from '@/store/index.js';
import $H from './common/request.js'


Vue.config.productionTip = false
Vue.prototype.$H = $H
Vue.prototype.$store = store
// 权限验证
Vue.prototype.authJump = (options) => {
	if(!store.state.token) {
		uni.showToast({
			title: '未登录，请先登录~',
			icon: 'none'
		});
		
		return setTimeout(() => {
			uni.navigateTo({
				url: '/pages/login/login'
			});
		}, 2000);
	}
	uni.navigateTo(options);
}
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif