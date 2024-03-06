<template>
	<view>
		<image src="https://s3.bmp.ovh/imgs/2022/06/23/0cd9efa193f613b4.jpg" mode="aspectFill"
			style="height: 350rpx; width: 750rpx;">
		</image>
		<view class="border-bottom" style="height: 350rpx;">
			<view class="flex align-center justify-between px-3">
				<image :src="user.avatar || '/static/demo/cate/1%20(13).png'"
					style="width: 150rpx; height: 150rpx; margin-top: -60rpx;" class="rounded-circle">
				</image>
				<view class="flex align-center justify-center rounded bg-main text-white px-2 py-1"
					hover-class="bg-main-hover" v-if="user_id != x_user_id" @click="isFollow">
					<text class="font">{{ followStatus ? '已关注' : '关 注' }}</text>
				</view>
			</view>
			<view class="px-4 flex align-center py-1">
				<view class="font-lg text-main font-weight-bold mr-2">{{ user.username || user.nickename }}</view>
				<text class="font-sm text-light-muted mr-2">{{ user.sex }}</text>
				<text class="font-sm text-light-muted">userID: {{ user.id }}</text>
			</view>
			<view class="flex align-center px-4 mt-2">
				<view class="font-md text-dark flex align-center">
					{{ followCount }} <text class="ml-2 font-sm text-light-muted">关注</text>
				</view>
				<view class="font-md text-dark flex align-center ml-2">
					{{ fansCount }} <text class="ml-2 font-sm text-light-muted">粉丝</text>
				</view>
			</view>
			<view class="px-4">
				<view class="text-ellipsis fpnt-sm text-light-muted" style="line-height: 1.5;">
					{{ user.desc || '这个人很懒，什么都没留下~' }}
				</view>
			</view>
		</view>
		<view class="flex align-center" style="height: 44px;">
			<view class="flex-1 flex align-center justify-center" v-for="(item, index) in tabBars" :key="index"
				@click="changeTab(index)">
				<text class="font-md" :class="tabIndex === index ? 'text-main' : ''">
					{{ item.name }}
				</text>
			</view>
		</view>
		<swiper :current="tabIndex" :duration="1000" :style="'height:' + scrollHeight + 'px;'" @change="changeSwiper">
			<swiper-item v-for="(tab, tabI) in tabBars" :key="tabI">
				<scroll-view scroll-y="true" :style="'height:' + scrollHeight + 'px;'"
					@scrolltolower="scrolltolower(tabI)">
					<view class="f-divider"></view>
					<media-list v-for="(item, index) in list[tabI].data" :key="index" :item="item" :index="index">
					</media-list>
					<!-- 默认提示 -->
					<view v-if="list[tabI].data.length === 0"
						class="font-md text-secondary flex align-center justify-center" style="height: 250rpx;">
						当前暂无数据~~~
					</view>
					<view class="flex font-md text-secondary align-center justify-center" style="height: 80rpx;"
						hover-class="bg-light" v-else-if="list[tabI].data.length > 10">
						{{ tab.loadText }}
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import mediaList from "@/components/common/media-list.vue";
import { mapState } from "vuex";

export default {
	components: {
		mediaList
	},
	data() {
		return {
			tabIndex: 0,
			tabBars: [
				{
					name: '首页',
					key: 'video_list',
					page: 1,
					loadText: '上拉加载更多'
				},
				{
					name: '收藏',
					key: 'fava_list',
					page: 1,
					loadText: '上拉加载更多~'
				}
			],
			scrollHeight: 0,
			list: [
				{
					data: []
				},
				{
					data: []
				}
			],
			user: [
				{
					avatar: '',
					desc: '',
					email: '',
					id: 0,
					nickname: '',
					phone: '',
					sex: '保密',
					username: ''
				}
			],
			fansCount: 0,
			followCount: 0,
			followStatus: false,
			user_id: 0
		}
	},
	computed: {
		tab() {
			return this.tabBars[this.tabIndex];
		},
		url() {
			let t = this.tab;

			return `/${t.key}/${t.page}?user_id=${this.user_id}`;
		},
		...mapState({
			x_user_id: state => {
				return state.user ? state.user.id : 0;
			}
		})
	},
	created() {
		let res = uni.getSystemInfoSync();
		this.scrollHeight = res.windowHeight - 44 - 44 - res.statusBarHeight;
	},
	onLoad(e) {
		if (!e.user_id) {
			uni.showToast({
				title: '页面参数错误',
				icon: 'none'
			})
			return uni.navigateBack({
				delta: -1
			});
		}
		this.user_id = e.user_id;
		this.getUserInfo(e.user_id);
		this.getData();
	},
	methods: {
		changeTab(index) {
			this.tabIndex = index;
		},
		changeSwiper(e) {
			this.tabIndex = e.detail.current;
			this.tabBars[this.tabIndex].page = 1;
			this.getData();
		},
		getUserInfo(user_id) {
			this.$H.get('/user/user_info?user_id=' + user_id, {
				token: true,
				onJump: true,
				toast: false
			}).then(res => {
				this.user = res.user;
				this.fansCount = res.fansCount;
				this.followCount = res.followCount;
				this.followStatus = res.follow;
			});
		},
		getData() {
			let page = this.tab.page;
			let index = this.tabIndex;

			this.$H.get(this.url).then(res => {
				this.list[index].data = page === 1 ? res : [...this.list[index].data, ...res];
				this.tabBars[index].loadText === 10 ? '上拉加载更多~' : '没有更多啦~';
			}).catch(err => {
				if (page > 1) {
					this.tabBars[index].page--;
				}

				this.tabBars[index].loadText = '上拉加载更多~'
			})
		},
		scrolltolower(index) {
			this.tabBars[index].page++;
			this.getData();
		},
		isFollow() {
			let url = this.followStatus ? '/user/unfollow' : '/user/follow';
			let msg = this.followStatus ? '取关成功~' : '关注成功~';

			this.$H.post(url, {
				follow_id: this.user_id
			}, {
				token: true
			}).then(res => {
				this.followStatus = !this.followStatus;
				uni.showToast({
					title: msg,
					icon: 'success'
				})
			});
		}
	}
}
</script>

<style></style>
