<template>
	<view>
		<view v-for="(item, index) in list" :key="index">
			<media-list :item="item" :index="index"></media-list>
			<view class="flex" style="height: 100rpx;">
				<view class="flex-1 flex align-center justify-center" hover-class="bg-light" @click="edit(item)">
					<text class="iconfont icon-bianji px-1"></text>编辑
				</view>
				<view class="flex-1 flex align-center justify-center" hover-class="bg-light"
					@click="openVideoList(item)">
					<text class="iconfont icon-bofang1 px-1"></text>播放
				</view>
				<view class="flex-1 flex align-center justify-center" hover-class="bg-light" @click="deleteVideo(item)">
					<text class="iconfont icon-shanchu px-1"></text>删除
				</view>
			</view>
			<view class="f-divider"></view>
		</view>
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
import { mapState } from 'vuex';

export default {
	components: {
		MediaList
	},
	data() {
		return {
			list: [
				{
					cover: '',
					title: '',
					createTime: '',
					playCount: 0,
					barrageCount: 0
				}
			],
			webPage: 1,
			loadText: '上拉加载更多'
		}
	},
	// onLoad() {
	// 	this.getData()
	// },
	onShow() {
		this.getData()
	},
	computed: {
		...mapState({
			user_id: state => {
				return state.user ? state.user.id : 0;
			}
		})
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.webPage = 1;
		this.getData().then(res => {
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
	// 触底
	onReachBottom() {
		if (this.loadText !== '上拉加载更多') {
			return
		}

		this.loadText = '正在加载中';
		this.webPage += 1;
		this.getData();
	},
	methods: {
		deleteVideo(item) {
			this.$H.post('/video/destroy', {
				id: item.id
			}, {
				token: true
			}).then(res => {
				console.log(res);
				uni.showToast({
					title: '删除成功',
					icon: 'none'
				});
				this.getData()
			})
		},
		openVideoList(item) {
			uni.navigateTo({
				url: '../userVideoList/userVideoList?id=' + item.id
			})
		},
		edit(item) {
			uni.navigateTo({
				// encodeURIComponent: 把字符串作为URI组件进行编码; 可以防止数据丢失
				url: '../create/create?data=' + encodeURIComponent(JSON.stringify(item))
			})
		},
		getData() {
			let page = this.webPage;

			return this.$H.get(`/video_list/${page}?user_id=${this.user_id}&limit=10`)
				.then(res => {
					if (page === 1) {
						this.list = res;
					} else {
						this.list = [...this.list, ...res];
					}
					this.loadText = res.length < 10 ? '没有更多了' : '上拉加载更多';
				}).catch(err => {
					if (this.webPage > 1) {
						this.webPage--;
					}

					this.loadText = '上拉加载更多';
				});
		}
	}
}
</script>

<style></style>
