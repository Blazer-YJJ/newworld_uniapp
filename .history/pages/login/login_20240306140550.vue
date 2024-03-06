<template>
	<view>
		<view :style="'height:' + statusBarHeight + 'px'"></view>
		<view class="flex align-center" style="height: 44px;">
			<view class="flex align-center justify-center animation fast" style="height: 44px; width: 44px;"
				hover-class="text-main pulse">
				<text class="iconfont icon-houtui font-lg"></text>
			</view>
		</view>
		<view class="flex align-center justify-center font-lg text-muted"
			style="margin-top: 100rpx; margin-bottom: 80rpx;">
			{{ type === "login" ? "欢迎回来！请登录" : "新用户注册" }}
		</view>
		<view class="px-4">
			<input type="text" class="uni-input mb-4 bg-light rounded" placeholder="请输入手机号/邮箱/用户名"
				v-model="form.username" />
			<input type="password" class="uni-input mb-4 bg-light rounded" placeholder="请输入密码"
				v-model="form.password" />
			<input type="password" class="uni-input mb-4 bg-light rounded" placeholder="请确认密码" v-if="type === 'reg'"
				v-model="form.repassword" />
		</view>
		<view class="px-4">
			<main-big-buttom @click="submit">{{ type === "login" ? "登 录" : "注 册" }}</main-big-buttom>
		</view>
		<view class="flex align-center justify-center py-5">
			<view style="height: 1rpx; width: 100rpx; background-color: #B2B2B2;"></view>
			<view class="text-muted mx-2 font-sm">其他登录方式</view>
			<view style="height: 1rpx; width: 100rpx; background-color: #B2B2B2;"></view>
		</view>
		<view class="flex align-center px-5">
			<view class="rounded-circle align-center justify-center flex flex-1 bg-light"
				style="width: 100rpx; height: 100rpx;">
				<text class="iconfont icon-weixin" style="font-size: 20px;"></text>
			</view>
			<view class="rounded-circle align-center justify-center flex flex-1 bg-light"
				style="width: 100rpx; height: 100rpx;">
				<text class="iconfont icon-xinlangweibo" style="font-size: 20px;"></text>
			</view>
			<view class="rounded-circle align-center justify-center flex flex-1 bg-light"
				style="width: 100rpx; height: 100rpx;">
				<text class="iconfont icon-QQ" style="font-size: 20px;"></text>
			</view>
		</view>
		<view class="flex align-center justify-center py-5">
			<view class="text-muted mx-2 font-sm" @click="changeType">
				{{ type === "login" ? "没有账号？注册" : "登录" }}
			</view>
		</view>
	</view>
</template>

<script>
import mainBigButtom from "@/components/common/main-big-button.vue";

export default {
	components: {
		mainBigButtom
	},
	data() {
		return {
			statusBarHeight: 0,
			type: "login",
			form: {
				username: '',
				password: '',
				repassword: ''
			}
		}
	},
	onLoad() {
		this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
	},
	methods: {
		changeType() {
			this.type = this.type === "login" ? "reg" : "login";
			// 清除注册后的用户名及密码
			this.form = {
				username: '',
				password: '',
				repassword: ''
			};
		},
		submit() {
			let msg = this.type === 'reg' ? '账户注册成功' : '账户登陆成功';

			this.$H.post('/' + this.type, this.form).then(res => {
				if (this.type === 'reg') {
					this.changeType();
				} else {
					this.$store.dispatch('userLogin', res);
					uni.switchTab({
						url: '../index/index'
					});
				}
				uni.showToast({
					title: msg,
					icon: 'none'
				});
			});
		}
	}
}
</script>

<style></style>
