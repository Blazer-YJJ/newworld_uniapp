<template>
	<view class="bg-light" style="min-height: 100vh;">
		<block v-for="(item, index) in list" :key="index">
			<view v-if="!item.isedit" class="bg-white">
				<video style="height: 350rpx;width: 100%;" :src="item.video" controls>
				</video>
				<form-item title="作品标题">
					<text class="font">{{ item.title }}</text>
				</form-item>
				<view class="flex" style="height: 100rpx;">
					<view class="flex-1 font flex align-center justify-center" hover-class="bg-light"
						@click="openEdit(item)">
						<text class="iconfont icon-bianji"></text>
						编辑
					</view>
					<view class="flex-1 font flex align-center justify-center" hover-class="bg-light"
						@click="deleteItem(item)">
						<text class="iconfont icon-shanchu"></text>
						删除
					</view>
				</view>
			</view>
			<view v-else class="bg-white">
				<view style="height: 350rpx;" class="bg-light position-relative" hover-class="bg-hover-light">
					<video v-if="item.video" style="height: 350rpx;width: 100%;" :src="item.video" controls>
					</video>
					<view v-if="!item.video"
						class="position-absolute left-0 right-0 top-0 bottom-0 flex flex-column align-center justify-center"
						style="background-color: rgba(255,255,255,0.2);" @click="upload(item)">
						<text class="iconfont iconjia" style="font-size: 50rpx;"></text>
						<text class="font text-muted">点击添加视频</text>
					</view>
				</view>
				<view v-if="item.video" class="flex align-center justify-center font border-bottom border-top"
					hover-class="bg-light" style="height: 100rpx;" @click="upload(item)">
					点击切换新视频
				</view>
				<form-item title="作品标题">
					<input type="text" v-model="item.title" placeholder="请填写作品发布标题" placeholder-class="text-light-muted"
						class="w-100 pr-5 px-3" />
				</form-item>
				<form-item title="作品描述">
					<textarea v-model="item.desc" placeholder="请填写视频描述" class="px-3" style="width: 100%;" />
				</form-item>
				<view class="flex" style="height: 100rpx;">
					<view class="flex-1 font flex align-center justify-center bg-main text-white"
						hover-class="bg-main-hover" @click="submit(item)">
						<text class="iconfont icon-paizhao"></text>
						完成
					</view>
					<view class="flex-1 font flex align-center justify-center" hover-class="bg-light"
						@click="deleteItem(index)">
						<text class="iconfont icon-shanchu"></text>
						删除
					</view>
				</view>
			</view>
			<view class="f-divider"></view>
		</block>
		<view v-if="showButton" class="flex align-center justify-center bg-main text-white font" style="height: 100rpx;"
			hover-class="bg-main-hover" @click="addNewVideo">
			<text class="iconfont icon-jiahao px-1"></text>
			添加新视频
		</view>
	</view>
</template>

<script>
import formItem from '@/components/common/form-item.vue';
// #ifndef H5
import VodUploader from '@/common/vod-wx-sdk-v2.js';
// #endif


export default {
	components: {
		formItem
	},
	data() {
		return {
			list: [],
			videoId: 0
		}
	},
	computed: {
		// 按钮显示
		showButton() {
			let arr = this.list.filter(item => {
				return item.isedit;
			});
			return arr.length === 0;
		}
	},
	onLoad(e) {
		if (!e.id) {
			uni.showToast({
				title: '作品错误~',
				icon: 'error'
			});
			uni.navigateBack({
				delta: 1
			});
		}

		this.videoId = e.id;
		this.getData();
	},
	methods: {
		// 获取作品下的合集列表
		getData() {
			this.$H.get('/video_detail/' + this.videoId).then(res => {
				this.list = res.map(item => {
					item.video = item.url;
					item.isedit = false;

					return item;
				});
			})
		},
		// 完成
		submit(item) {
			if (!item.video) {
				return uni.showToast({
					title: '视频不能为空！',
					icon: 'none'
				});
			}
			if (!item.title) {
				return uni.showToast({
					title: '标题不能为空！',
					icon: 'none'
				});
			}

			// 作品编辑或创建
			let url = item.id ? '/video_detail' + item.id : '/video_detail';
			let msg = item.id ? '作品修改成功~' : '作品创建成功~';

			// 创建或编辑作品
			this.$H.post(url, {
				title: item.title,
				url: item.video,
				video_id: this.videoId,
				desc: item.desc
			}, {
				token: true
			}).then(res => {
				item.isedit = false;
				uni.showToast({
					title: msg,
					icon: 'none'
				});
				this.getData();
			});
		},
		// 作品删除
		deleteItem(item) {
			// console.log(item);
			uni.showModal({
				content: '是否要删除该视频？',
				success: (res) => {
					if (res.confirm) {
						this.$H.post('/video_detail/destroy', {
							id: item.id
						}, {
							token: true
						}).then(res => {
							// this.list.splice(index, 1);
							this.getData();

							uni.showToast({
								title: '作品删除成功',
								icon: 'success'
							});
						});
					}
				}
			});
		},
		// 添加新视频(合集)
		addNewVideo() {
			this.list.push({
				video: "",
				title: "",
				desc: "",
				isedit: true
			})
		},
		// 上传作品
		upload(item) {
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				success: (res) => {
					// #ifdef H5
					// 获取腾讯vod签名
					let getSignature = (callback) => {
						return this.$H.post('/vod/sign', {}, {
							token: true
						}).then(res => {
							return res;
						});
					};
					// #endif
					// #ifndef H5
					let getSignature = (callback) => {
						this.$H.post('/vod/sign', {}, {
							token: true
						}).then(res => {
							callback(res)
						});
					};
					// #endif
					// 生成作品视频唯一ID
					let mediaName = this.genId(12);

					// 上传过程提示
					uni.showLoading({
						title: '作品正在上传中...',
						mask: false
					});

					// #ifdef H5
					const tcVod = new TcVod.default({
						getSignature: getSignature
					});
					const uploader = tcVod.upload({
						mediaFile: res.tempFile
					});

					uploader.on('media_progress', (info) => {
						console.log('视频上传进度:' + info.percent); // 上传进度
					});
					uploader.done().then((doneResult) => {
						item.video = doneResult.video.url;
						uni.hideLoading();
					}).catch((err) => {
						uni.hideLoading();
						uni.showToast({
							title: '作品上传失败~',
							icon: 'none'
						});
					});
					// #endif
					// #ifndef H5
					VodUploader.start({
						mediaFile: res,
						getSignature: getSignature,
						mediaName: mediaName,
						success: (result) => {
							console.log('success');
							console.log(result);
						},
						error: (result) => {
							uni.hideLoading();
							uni.showToast({
								title: '作品上传失败~',
								content: JSON.stringify(result),
								showCancel: false
							});
						},
						progress: (result) => {
							console.log('progress');
							console.log(result);
						},
						finish: (result) => {
							// 上传后的视频
							item.video = result.videoUrl;
							uni.hideLoading();
						}
					})
					// #endif
				}
			});
		},
		// 编辑状态
		openEdit(item) {
			item.isedit = true;
			console.log(item);
		},
		// 生成唯一作品视频ID
		genId(length) {
			return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
		}
	}
}
</script>

<style></style>
