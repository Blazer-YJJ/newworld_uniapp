<template>
	<view>
		<view class="bg-light position-relative" style="height: 350rpx;" hover-class="bg-hover-light" @tap="upload">
			<image v-if="form.cover" :src="form.cover" mode="aspectFill" style="width: 750rpx; height: 350rpx;">
			</image>
			<view class="position-absolute left-0 right-0 top-0 bottom-0 flex flex-column align-center justify-center"
				style="background-color: rgba(255,255,255,0.3);">
				<text class="iconfont icon-jiahao" style="font-size: 50rpx;" v-if="!form.cover">
				</text>
				<text class="font text-muted">点击{{ form.cover ? '更换' : '添加' }}视频封面</text>
			</view>
		</view>
		<form-item title="发布标题">
			<input type="text" placeholder="请填写发布视频标题" placeholder-class="text-light-munted" class="w-100 pr-5"
				v-model="form.title" />
		</form-item>
		<picker mode="selector" :range="range" @change="change">
			<form-item title="视频分类" rightIcon>
				<input type="text" disabled v-model="categoryTitle" />
			</form-item>
		</picker>
		<form-item title="视频描述">
			<textarea placeholder="请填写视频描述" class="py-3" style="width: 500rpx;" v-model="form.desc" />
		</form-item>
		<!-- #ifdef MP -->
		<view class="py-2 px-3">
			<main-big-button>
				<text class="iconfont icon-guanzhu px-2" @tap="submit"></text>
				发 布
			</main-big-button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import formItem from "@/components/common/form-item.vue";
import mainBigButton from "@/components/common/main-big-button.vue";

export default {
	components: {
		formItem,
		mainBigButton
	},
	data() {
		return {
			form: {
				cover: "",
				title: "",
				category_id: 0,
				desc: ""
			},
			category: [],
			range: [],
			id: 0
		}
	},
	onLoad(e) {
		if (e.data) {
			// 将编码过的字符进行解码
			let item = JSON.parse(decodeURIComponent(e.data));

			this.form = {
				cover: item.cover,
				title: item.title,
				category_id: item.category_id,
				desc: item.desc
			}
			this.id = item.id;
		}

		this.$H.get('/category').then(res => {
			this.category = res;
			this.range = res.map(item => item.title)
		});
	},
	onNavigationBarButtonTap() {
		this.submit()
	},
	computed: {
		categoryTitle() {
			let index = this.category.findIndex(item => item.id === this.form.category_id);

			if (index === -1) {
				return ''
			} else {
				return this.category[index].title;
			}
		}
	},
	// 添加视频封面图
	methods: {
		upload() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: (res) => {
					this.$H.upload('/upload', {
						filePath: res.tempFilePaths[0]
					}).then(res => {
						// this.form.cover = res.tempFilePaths[0];
						this.form.cover = res.url;
						uni.showToast({
							title: '上传成功',
							icon: 'none'
						});
					})
				}
			});
		},
		change(e) {
			this.form.category_id = this.category[e.detail.value].id
		},
		submit() {
			let url = this.id === 0 ? '/video' : '/video/' + this.id;
			let msg = this.id === 0 ? '作品发布' : '作品修改';

			this.$H.post(url, this.form, {
				token: true
			}).then(res => {
				uni.showToast({
					title: msg + '成功！',
					icon: 'none'
				});
				uni.navigateBack({
					delta: 1
				})
			});
		}
	}
}
</script>

<style></style>
