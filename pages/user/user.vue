<template>
	<view>
		<view>
			<navigator v-if="user" :url="'../userSpace/userSpace?user_id=' + user.id">
				<view class="p-3 flex align-center">
					<image :src="user.avatar || '/static/demo/cate/titleimg.png'" class="user-img bg-light rounded-circle flex-shrink"></image>
					<view class="flex flex-column pl-3 flex-1">
						<view class="font-md text-dark">{{ user.username || user.nickname}}<text class="font-sm text-light-muted ml-3">{{ user.sex }}</text></view>
						<text class="font-sm text-muted">{{ user.desc || '这个人很懒~暂无描述'}}</text>
					</view>
				</view>
			</navigator>
			<navigator v-else url="../login/login">
				<view class="p-3 flex align-center">
					<image src="/static/demo/cate/titleimg.png" class="user-img bg-light rounded-circle flex-shrink"></image>
					<view class="flex flex-column pl-3 flex-1">
						<view class="font-md text-main">点击登录</view>
						<text class="font-sm text-muted">请先登录</text>
					</view>
				</view>
			</navigator>
			<view class="f-divider"></view>
			<f-list-item icon="icon-shipintianchong" 
			             title="我的作品" 
						 :rightText="videoCount + '个'" 
						 :showRightIcon="true"
						 @click="navigateTo('userVideos')"
			>
			</f-list-item>
			<f-list-item icon="icon-shoucang1" 
			             title="我的收藏" 
						 :showRightIcon="true"	
						 @click="navigateTo('userFava')"
			>
			</f-list-item>
			<f-list-item icon="icon-guanzhu1" 
			             title="我的关注"
						 :rightText="followCount + '个'"
						 :showRightIcon="true"
						 @click="navigateTo('userFollow')"
			>
			</f-list-item>
			<f-list-item icon="icon-lishixiao" 
			             title="观看历史"
						 :showRightIcon="true"
						 @click="navigateTo('userHistory')"
			>
			</f-list-item>
			<f-list-item icon="icon-bianji"
			             title="账户设置"
						 :showRightIcon="true"
						 @click="navigateTo('userSetting')"
			>
			</f-list-item>
		</view>
		<view class="f-divider"></view>
		<view class="py-2 px-3">
			<main-big-button @click="addVideo"><text class="iconfont icon-shipintianchong px-2"></text>立即投稿
</main-big-button>
		</view>
		<!-- 按钮弹框 -->
		<f-popup ref="popup">
			<view class="position-absolute bottom-0 right-0 left-0 bg-white animated faster fadeIn">
				<view class="flex" style="height: 200rpx;">
					<view class="flex-1 flex align-center justify-center flex-column"
					      hover-class="bg-light"
						  @click="navigateTo('create')"
					>
						<text class="iconfont icon-dingdan flex align-center justify-center text-white bg-primary rounded-circle" 
						      style="width: 80rpx;height: 80rpx;"
						>
						</text>
							<text class="font mt-1 text-muted">普通</text>
						</view>
					<view class="flex-1 flex align-center justify-center flex-column"
					      hover-class="bg-light"
						  @click="navigateTo('create')"
					>
						<text class="iconfont icon-dingdanjihe flex align-center justify-center text-white bg-danger rounded-circle" 
						      style="width: 80rpx; height: 80rpx;"
						>
						</text>
						<text class="md-1 text-muted">合集</text>
					</view>
				</view>
				<view class="f-divider"></view>
				<view class="py-2 flex align-center justify-center font-md" 
				      hover-class="bg-light"
					  @click.stop="hidePopup"
			    >
					取消
				</view>
			</view>
		</f-popup>
	</view>
</template>
 
<script>
	import fListItem from "@/components/common/f-list-item.vue";
	import MainBigButton from "@/components/common/main-big-button.vue";
	import fPopup from "@/components/common/f-popup.vue";
	import { mapState } from 'vuex';
	
	export default {
		components: {
			fListItem,
			MainBigButton,
			fPopup
		},
		data() {
			return {
				showButFrame: false,
				followCount: 0,
				videoCount: 0
			};
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		onShow() {
			this.$H.get('/user/statistics/1', {
				token: true,
				noJump: true,
				toast: false
			}).then(res => {
				this.followCount = res.followCount,
				this.videoCount = res.videoCount
			});
		},
		// 监听原生button
		onNavigationBarButtonTap(e) {
			if(e.index === 0) {
				uni.navigateTo({
					url: '../userSetting/userSetting'
				});
			}
		},
		methods: {
			addVideo() {
				this.$refs.popup.show()
			},
			hidePopup() {
				this.$refs.popup.hide()
			},
			navigateTo(path) {
				this.authJump({
					url: '/pages/'+ path +'/' + path
				})
			}
		}
	}
</script>

<style>
	.user-img {
		width: 120rpx;
		height: 120rpx;
	}

	.user-but-frame {
		background-color: rgba(0,0,0,0.3);
		z-index: 999;
	}
</style>
