<template>
	<view>
		<media-list v-for="(item, index) in list" 
			        :key="index"
					:item="item"
					:index="index"
		>
		</media-list>
		<!-- 默认提示 -->
		<view v-if="list.length === 0"
			  class="font-md text-secondary flex align-center justify-center"
			  style="height: 250rpx;"
		>
			当前栏目暂无数据~~~
		</view>
		<view class="flex font-md text-secondary align-center justify-center" 
			  style="height: 80rpx;"
			  hover-class="bg-light"
			  v-else-if="list.length > 10"
		>
			{{ loadText }}
		</view>
	</view>
</template>

<script>
	import mediaList from '@/components/common/media-list.vue';
	
	export default {
		components: {
			mediaList
		},
		data() {
			return {
				list: [],
				category_id: 0,
				webPage: 1,
				loadText: '上拉加载更多'
			}
		},
		onLoad(e) {
			if(e.id) {
				this.category_id = e.id
			}
			if(e.title) {
				uni.setNavigationBarTitle({
					title: e.title
				})
			}
			this.getDate();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.webPage = 1;
			this.getDate().then(res => {
				uni.showToast({
					title: '刷新成功',
					icon: 'none'
				});
				uni.stopPullDownRefresh()
			}).catch(err => {
				uni.showToast({
					title: '刷新失败',
					icon: 'onne'
				});
				uni.stopPullDownRefresh()
			});
		},
		// 上拉加载
		onReachBottom() {
			if(this.loadText === '正在加载中...') {
				return 
			}
			
			this.loadText = '正在加载中';
			this.webPage += 1;
			this.getDate();
		},
		methods: {
			getDate() {
				let url = `/category/${this.category_id}/video/${this.webPage}`;
				let page = this.webPage;
				
				return this.$H.get(url).then(res => {
					if(page === 1) {
						this.list = res;
					} else {
						this.list = [...this.list, ...res]
					}
					this.loadText = res.length === 10 ? '上拉加载更多' : '没有更多了';
				}).catch(err => {
					if(this.webPage > 1) {
						this.webPage--;
					}
					
					this.loadText = '上拉加载更多';
				});
			}
		}
	}
</script>

<style>

</style>
