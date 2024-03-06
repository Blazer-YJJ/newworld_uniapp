<template>
	<view>
		<uni-swipe-action v-for="(item, index) in list" :key="index">
			<uni-swipe-action-item :options="options" @click="bindClick($event, item)">
				<media-list :item="item" :index="index" style="width: 750rpx;"></media-list>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<!-- 默认提示 -->
		<view v-if="list.length === 0" class="font-md text-secondary flex align-center justify-center"
			style="height: 250rpx;">
			当前暂无数据~~~
		</view>
		<view class="flex font-md text-secondary align-center justify-center" style="height: 80rpx;"
			hover-class="bg-light" v-else-if="list.length > 10">
			{{ loadText }}
		</view>
	</view>

</template>

<script>
import MediaList from "@/components/common/media-list.vue";
import uniSwipeAction from "@/components/uni-ui/uni-swipe-action/uni-swipe-action.vue";
import uniSwipeActionItem from "@/components/uni-ui/uni-swipe-action-item/uni-swipe-action-item.vue";
import { mapState } from 'vuex';

export default {
	components: {
		MediaList,
		uniSwipeAction,
		uniSwipeActionItem
	},
	data() {
		return {
			options: [
				{
					text: '取消收藏',
					style: {
						backgroundColor: '#f21d18'
					}
				}
			],
			list: [],
			webPage: 0,
			loadText: '上拉加载更多~'
		}
	},
	onLoad() {
		this.getData()
	},
	onPullDownRefresh() {
		this.getData().then(res => {
			uni.showToast({
				title: '刷新成功~',
				icon: 'none'
			});
			uni.stopPullDownRefresh();
		}).catch(err => {
			uni.showToast({
				title: '刷新失败~',
				icon: 'none'
			});
			uni.stopPullDownRefresh();
		})
	},
	onReachBottom() {
		if (this.loadText !== '上拉加载更多~') {
			return;
		}

		this.loadText = '正在加载中...';
		this.webPage++;
		this.getData();
	},
	computed: {
		...mapState({
			user_id: state => state.user.id
		})
	},
	methods: {
		bindClick(event, item) {
			this.$H.post('/fava/video', {
				video_id: item.id
			}, {
				token: true
			}).then(res => {
				uni.showToast({
					title: '取消收藏成功~',
					icon: 'success'
				});
				this.webPage = 1;
				this.getData();
			});
			uni.showToast({
				title: '收藏已取消',
				icon: 'none'
			})
		},
		getData() {
			let page = this.webPage;

			return this.$H.get(`/fava_list/${this.webPage}?user_id=${this.user_id}`).then(res => {
				this.list = page === 1 ? res : [...this.list, ...res];
				this.loadText = res.length === 10 ? '上拉加载更多~' : '没有更多了~';
			}).catch(err => {
				if (page > 1) {
					this.webPage--;
				}

				this.loadText = '上拉加载更多~';
			});
		}
	}
}
</script>

<style></style>
