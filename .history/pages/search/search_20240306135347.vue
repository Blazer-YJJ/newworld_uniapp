<template>
	<view>
		<!-- 微信小程序端导航栏 -->
		<!-- #ifdef MP -->
		<view class="flex align-center fixd-top bg-white" 
			  style="height: 44px;" 
		>
			<!-- 搜索框 -->
			<input type="text"
				   placeholder="点击搜索作品/视频"
				   class="iconfont icon-sousuoxiao ml-2 flex align-center flex-1 rounded-circle py-1 px-1" 
				   style="background-color: #f6f7f8; color: #959aa0;"
				   v-model="keyword"
			>
			<!-- 按钮选项 -->
			<view class="flex align-center px2 mx-2" style="color: #959aa0;" @click="handleSearch">搜索</view>
		</view>
		<!-- #endif -->
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
			当前暂无数据~~~
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
	import MediaList from "@/components/common/media-list.vue";
	
	export default {
		components: {
			MediaList
		},
		data() {
			return {
				keyword: '',
				page: 1,
				list: [],
				loadText: '上拉加载更多~'
			}
		},
		onNavigationBarButtonTap() {
			if(this.keyword === '') {
				return uni.showToast({
					title: '查找的内容不能为空！',
					icon: 'none'
				});
			}
			this.page = 1;
			this.search();
		},
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text;
		},
		onReachBottom() {
			this.handleSearch();
		},
		methods: {
			search() {
				let page = this.page;
				let keyword = this.keyword;
				
				this.$H.get(`/video_search/${page}?keyword=${keyword}`).then(res => {
					this.list = page === 1 ? res : [...this.list, ...res];
					this.loadText = res.length === 10 ? '上拉加载更多~' : '没有更多了~';
				}).catch(err => {
					if(page > 1) {
						this.page --;
						this.loadText = '上拉加载更多~';
					}
				});
			},
			handleSearch() {
				if(this.keyword === '') {
					return uni.showToast({
						title: '查找的内容不能为空！',
						icon: 'none'
					});
				}
				this.page = 1;
				this.search();
			}
		}
	}
</script>

<style>

</style>
