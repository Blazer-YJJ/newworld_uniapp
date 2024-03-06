<template>
	<view>
		<view class="flex flex-1 align-center py-1 border-bottom"
			  @click="open"
		>
			<image :src="item.cover" 
			       class="rounded-lg mx-2 flex-shrink" 
				   style="width: 260rpx; height: 160rpx;"
			>
			</image>
			<view class="flex flex-1 flex-column">
				<text class="font" style="line-height: 1.2;">{{ item.title }}</text>
				<text class="font-sm text-light-muted mt-auto">{{ item.createTime }}</text>
				<view class="flex align-center justify-between text-light-muted line-h mt-1">
					<view class="line-h">
						<text class="iconfont icon-bofang1 font-md mx-1"></text>
						<text class="font-sm">{{ item.playCount }}</text>
					</view>
					<view class="line-h">
						<text class="iconfont icon-bofangqi-danmugundongkai font-md mx-1"></text>
					    <text class="font-sm">{{ item.barrageCount }}</text>
					</view>
					<view class="line-h">
						<text class="iconfont icon-gengduo"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			index: [String, Number]
		},
		methods: {
			// 数组置顶（在历史中观看过的视频进行ID置顶）
			toFirst(arr, index) {
				if(index != 0) {
					arr.unshift(arr.splice(index, 1)[0]);
				}
				
				return arr;
			},
			open() {
				uni.navigateTo({
					url: '/pages/detailVideo/detailVideo?id=' + this.item.id
				})
				// 将点击的视频存放到历史记录
				let list = uni.getStorageSync('historyVideo');
				list = list ? JSON.parse(list) : [];
				let index = list.findIndex(item => {
					return item.id === this.item.id
				});
				
				if(index === -1) {
					list.unshift(this.item);
				} else {
					this.toFirst(list, index);
				}
				uni.setStorage({
					key: 'historyVideo',
					data: JSON.stringify(list)
				})
			}
		}
	}
</script>

<style>
</style>
