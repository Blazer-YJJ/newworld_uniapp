<template>
	<view>
		<!-- 微信小程序端导航栏 -->
		<!-- #ifdef MP -->
		<view class="flex align-center fixd-top bg-white" style="height: 44px;" @click="openSearch">
			<!-- 搜索框 -->
			<view class="ml-2 flex align-center flex-1 rounded-circle py-1 px-1"
				style="background-color: #f6f7f8; color: #959aa0;">
				<text class="iconfont icon-sousuoxiao"></text>
				<text>点击搜索作品/视频</text>
			</view>
			<!-- 按钮选项 -->
			<view class="flex align-center px2 mx-2" style="color: #959aa0;" @click="openCate">分类</view>
		</view>
		<!-- #endif -->
		<!-- 轮播图组件 -->
		<view class="px-3 py-2">
			<swiper-dot :info="swipers" :current="current">
				<swiper :current="current" circular :autoplay="true" :interval="3000" :duration="150"
					style="height: 250rpx;" @change="changeSwiper">
					<swiper-item v-for="(item, index) in swipers" :key="index" @click="openDetailVideo(item.video_id)">
						<image :src="item.cover" mode="aspectFill" style="height: 250rpx; width: 100%;"
							class="rounded-lg flex-shrink">
						</image>
					</swiper-item>
				</swiper>
			</swiper-dot>
		</view>
		<!-- 卡片区域 -->
		<card title="为你推荐">
			<!-- 列表样式一 -->
			<view class="f-list">
				<view class="f-card rounded-lg border" v-for="(item, index) in listOne" :key="index"
					@click="openDetailVideo(item.id)">
					<image :src="item.cover" class="f-card-img rounded-top-lg"></image>
					<view class="f-card-title text-white flex align-center">
						<text class="iconfont icon-bofang1 font-md mx-1"></text>
						<text class="font-sm">{{ item.play_count }}</text>
						<text class="iconfont icon-bofangqi-danmugundongkai font-md mx-1"></text>
						<text class="font-sm">{{ item.danmu_count }}</text>
					</view>
					<view class="px-1 pb-1">
						<view class="font">{{ item.title }}</view>
						<view class="flex align-center justify-between text-light-muted">
							<text class="font">{{ item.category.title }}</text>
							<text class="iconfont icon-gengduo"></text>
						</view>
					</view>
				</view>
			</view>
		</card>
		<view class="f-divider"></view>
		<card title="热点视频">
			<!-- 列表样式二 -->
			<view class="f-list">
				<view class="f-card rounded-lg" style="width: 210rpx;" v-for="(item, index) in listTwo" :key="index"
					@click="openDetailVideo(item.id)">
					<image :src="item.cover" class="f-card-img rounded-lg" style="height: 280rpx;" mode="aspectFill">
					</image>
					<view class="f-card-title text-white flex align-center rounded-bottom" style="top: 215rpx;">
						<text class="iconfont icon-bofang1 font-md mx-1"></text>
						<text class="font-sm">{{ item.play_count }}</text>
					</view>
					<view class="font">
						{{ item.title }}
					</view>
				</view>
			</view>
		</card>
		<view class="f-divider"></view>
		<card title="热点快讯">
			<!-- 列表样式三 -->
			<view class="f-list">
				<view v-for="(item, index) in listOne" :key="index" style="width: 100%;">
					<media-list :item="item" :index="index"></media-list>
				</view>
			</view>
		</card>
	</view>
</template>

<script>
import SwiperDot from '@/components/common/swiper-dot.vue';
import Card from '@/components/common/card.vue';
import MediaList from '@/components/common/media-list.vue';

export default {
	components: {
		SwiperDot,
		Card,
		MediaList
	},
	data() {
		return {
			current: 0,
			swipers: [],
			listOne: [],
			listTwo: []
		}
	},
	onLoad() {
		this.$H.get('/home_data_one').then(res => {
			this.listOne = res;
		});
		this.$H.get('/home_data_two').then(res => {
			this.listTwo = res;
		})
		this.$H.get('/home_swiper/list').then(res => {
			this.swipers = res;
		});
	},
	onNavigationBarSearchInputClicked() {
		uni.navigateTo({
			url: '../search/search'
		})
	},
	onNavigationBarButtonTap() {
		uni.switchTab({
			url: '../cate/cate'
		})
	},
	methods: {
		changeSwiper(e) {
			this.current = e.detail.current;
		},
		openDetailVideo(id) {
			uni.navigateTo({
				url: '../detailVideo/detailVideo?id=' + id
			})
		},
		openCate() {
			uni.navigateTo({
				url: '../cate/cate'
			});
		},
		openSearch() {
			uni.navigateTo({
				url: '../search/search'
			});
		}
	}
}
</script>

<style>
.f-list {
	display: flex;
	flex-wrap: wrap;
	padding-left: 15rpx;
	padding-right: 15rpx;
	padding-bottom: 30rpx;
}

.f-card {
	margin-left: 15rpx;
	margin-right: 15rpx;
	margin-bottom: 15rpx;
	min-height: 5rpx;
	width: 328rpx;
	position: relative;
}

.f-card-img {
	width: 100%;
	height: 220rpx;
}

.f-card-title {
	height: 65rpx;
	background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
	position: absolute;
	left: 0;
	right: 0;
	top: 155rpx;
}
</style>
