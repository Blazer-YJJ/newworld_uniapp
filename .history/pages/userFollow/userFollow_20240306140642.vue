<template>
	<view>
		<f-iist-item :title="item.name" v-for="(item, index) in list" :key="index">
			<image slot="icon" :src="item.avatar || '/static/demo/cate/005.png'" style="height: 80rpx; width: 80rpx;"
				class="rounded-circle mr-3">
			</image>
		</f-iist-item>
		<!-- 默认提示 -->
		<view v-if="list.length === 0" class="font-md text-secondary flex align-center justify-center"
			style="height: 250rpx;">
			当前栏目暂无数据~~~
		</view>
		<view class="flex font-md text-secondary align-center justify-center" style="height: 80rpx;"
			hover-class="bg-light" v-else-if="list.length > 10">
			{{ loadText }}
		</view>
	</view>
</template>

<script>
import fIistItem from '@/components/common/f-list-item.vue';

export default {
	data() {
		return {
			list: [],
			webPage: 1,
			loadText: '上拉加载更多~'
		}
	},
	components: {
		fIistItem
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
	onLoad() {
		this.getData();
	},
	methods: {
		getData() {
			let page = this.webPage;

			return this.$H.get(`/user/follows/${page}`, {
				token: true
			}).then(res => {
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
