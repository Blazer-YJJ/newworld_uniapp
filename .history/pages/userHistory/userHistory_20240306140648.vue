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
			当前栏目暂无数据~~~
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
					text: '删除记录',
					style: {
						backgroundColor: '#f21d18'
					}
				}
			],
			list: []
		}
	},
	onLoad() {
		this.getData()
	},
	onNavigationBarButtonTap() {
		uni.removeStorage({
			key: 'historyVideo',
			success: (res) => {
				uni.showToast({
					title: '删除成功~',
					icon: 'none'
				})
			}
		});
		this.list = [];
	},
	computed: {
		...mapState({
			user_id: state => state.user.id
		})
	},
	methods: {
		bindClick(event, item) {
			let index = this.list.findIndex(vtem => vtem.id === item.id);

			if (index !== -1) {
				this.list.splice(index, 1);
				uni.setStorage({
					key: 'historyVideo',
					data: JSON.stringify(this.list)
				})
				uni.showToast({
					title: '删除成功~',
					icon: 'none'
				})
			}
		},
		getData() {
			let list = uni.getStorageSync('historyVideo');
			this.list = list ? JSON.parse(list) : [];
		}
	}
}
</script>

<style></style>
