<template>
	<view style="line-height: 1; overflow-y: hidden;">
		<!-- #ifndef APP-PLUS -->
		<video :src="src" 
			   :poster="poster" 
			   controls
			   style="height: 225px; width: 750rpx;"
			   id='myVideo'
		>
		</video>
		<!-- #endif -->
		<scroll-view scroll-y="true" 
					 :style="'height:' + scrollHeight + 'px;'"
		>
			<view class="border-bottom border-light-secondary flex align-center bg-white"
				  style="height: 80rpx;position: fixed; left: 0; right: 0; z-index: 100;"
			>
				<view class="flex-1 flex align-center justify-center"
					  v-for="(item, index) in tabBars"
					  :key="index"
					  @click="changeTab(index)"
				>
					<text class="font py-1" 
						  :class="tabIndex === index ? 'text-main border-main' : ''"
						  :style="tabIndex === index ? 'border-bottom: 5rpx solid;' : ''"
					>
						{{ item.name }}
					</text>
				</view>
			</view>
			<view style="height: 80rpx;"></view>
			<!-- 发布者简介 -->
			<view v-if="tabIndex === 0" class="animated fadeIn fast">
				<view class="px-3 py-2 flex align-center">
					<image :src="detail.user.avatar || '/static/demo/cate/1%20(2).png'" 
						   mode="aspectFill"
						   style="width: 80rpx; height: 80rpx;"
						   class="ml-3 rounded-circle mr-3"
						   @click="openUserSpace"
					>
					</image>
					<view class="flex flex-column" style="line-height: 1.2;">
						<text class="text-main font-md">{{ detail.user.username || detail.user.nickname }}</text>
						<text class="font-sm text-muted">{{ fansCount }} 粉丝</text>
					</view>
					<view class="flex align-center justify-center rounded bg-main text-white px-2 py-1 ml-auto"
						  hover-class="bg-main-hover"
						  v-if="detail.user.id !== user_id"
						  @click="isFollow"
					>
						<text class="font">{{ followStatus ? '已关注' : '关 注' }}</text>
					</view>
				</view>
				<view class="px-3 font-md">{{ detail.title }}</view>
				<view class="px-3 flex justify-between align-center text-muted">
					<view class="flex align-center">
						<text class="iconfont icon-bofang1 font-md mr-1"></text>
						<text class="font-sm">{{ detail.play_count }}</text>
						<text class="iconfont icon-bofangqi-danmugundongkai font-md mx-1"></text>
						<text class="font-sm">{{ detail.danmu_count }}</text>
						<text class="iconfont icon-bianji font-md mx-1"></text>
						<text class="font-sm">{{ detail.created_time }}</text>
					</view>
					<view class="flex align-center justify-center rounded bg-main text-white px-2 py-1 ml-auto"
						  hover-class="bg-main-hover"
						  v-if="detail.user.id !== user_id"
						  @click="isFava"
					>
						<text class="font-sm">{{ favaStatus ? '已收藏' : '收藏' }}</text>
					</view>
				</view>
				<view class="py-3 border-top border-bottom border-light-secondary">
					<view class="px-3 flex align-center">
						<text class="font-md">合集</text>
						<view class="flex align-center text-muted ml-auto" 
							  @click="openPopup"
						>
							共{{ videos.length }}集
							<text class="ml-1 iconfont icon-jinru"></text>
						</view>
					</view>
				</view>
				<scroll-view scroll-x="true" class="scroll-row py-2">
					<view class="scroll-row-item border text-muted mx-1 p-1"
					      style="height: 120rpx; width: 250rpx;border-radius: 25rpx;"
						  v-for="(item, index) in videos"
						  :key="index"
						  :class="activeIndex === index ? 'border-main text-main' : 'text-muted border-light-secondary'"
						  @click="changeVideo(item, index)"
					>
						<text class="font-md">第{{ index + 1 }}集</text>
						<view class="font-sm text-ellipsis">
							<text>{{ item.title }}</text>
						</view>
					</view>
				</scroll-view>
				<view class="f-list">
					<media-list v-for="(item, index) in hotVideoList" 
								:key="index"
								:item="item" 
								:index="index"
					>
					</media-list>
				</view>
			</view>
			<!-- 评论 -->
			<view v-else class="animated fadeIn fast px-3 py-1">
				<view class="uni-comment-list"
					  v-for="(item, index) in comments"
					  :key="index"
				>
					<view class="uni-comment-face">
						<image :src="item.send_user.avatar || '/static/demo/cate/1%20(11).png'" 
							   style="width: 80rpx; height: 80rpx;"
							   class="rounded-circle"
							   mode="aspectFill"
						>
						</image>
					</view>
					<!-- 一级评论 -->
					<view class="uni-comment-body">
						<view class="uni-comment-top">
							<text class="font text-main">{{ item.send_user.username || item.send_user.nickname }}</text>
						</view>
						<view class="uni-comment-date">
							<text class="font-sm text-muted">{{ item.created_time | formatTime }}</text>
						</view>
						<view class="uni-comment-content"
							  @click="openComment(item.id, item.send_user)"
						>
							{{ item.content }}
						</view>
						<!-- 二级评论 -->
						<view class="felx flex-wrap rounded p-2 bg-light"
							  v-for="(item2, index2) in item.comments"
							  :key="index2"
						>
							<text class="font text-main">{{ item2.send_user.username || item2.send_user.nickname }}</text>
							<text class="font text-dark">回复：</text>
							<text class="font text-main">{{ item2.reply_user.username || item2.reply_user.nickname }}:</text>
							<text @click="openComment(item.id, item2.send_user)">{{ item2.content }}</text>
						</view>
					</view>
				</view>
				<view class="position-fixed flex align-center justify-center bg-main rounded-circle" 
					  style="width: 120rpx; height: 120rpx; right: 50rpx; bottom: 50rpx;"
					  hover-class="animated fast pulse bg-main-hover"
					  @click="openComment(0)"
				>
					<text class="iconfont icon-jiahao text-white"></text>
				</view>
			</view>
		</scroll-view>
		<!-- 选集弹出框 -->
		<f-popup ref="popup">
			<view class="position-absolute bottom-0 right-0 left-0 bg-white animated faster fadeIn"
				  @click.stop="stop"
			>
				<view style="height: 650rpx;">
					<view class="flex align-center px-3 py-2">
						<text class="font-md">合集</text>
						<view style="height: 80rpx; height: 80rpx;"
							  class="ml-auto font-md"
							  hover-class="text-main"
							  @click="closeTab"
						>
							<text class="iconfont icon-guanbi"></text>
						</view>
					</view>
					<scroll-view scroll-y="true" style="height: 540rpx;">
						<view class="flex flex-wrap">
							<view style="width: 50%; box-sizing: border-box;"
								  v-for="(item, index) in videos"
								  :key='index'
								  class="p-2"
							>
								<view class="border text-muted pl-1"
								      style="height: 120rpx; border-radius: 25rpx;"
									  :class="activeIndex === index ? 'border-main text-main' : 'text-muted border-light-secondary'"
									  @click="changeVideo(item, index)"
								>
									<text class="font-md">第{{ index + 1 }}集</text>
									<view class="font-sm text-ellipsis">
										<text>{{ item.title }}</text>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</f-popup>
		<!-- 评论弹出框 -->
		<f-popup ref="comment">
			<view class="position-absolute bottom-0 left-0 right-0 bg-white animated faster fadeIn" 
				  @click.stop="stop"
			>
				<view style="height: 100rpx;" class="flex align-center px-3">
					<input type="text" 
					       class="bg-light rounded mr-3 px-2 flex-1" 
						   style="height: 60rpx;" 
						   :placeholder="reply_user.id ? '回复@' + reply_user.name : '皮一下~'"
						   v-model="content"
					/>
					<view class="flex align-center justify-center rounded bg-main text-white py-1 px-2 ml-auto"
						  hover-class="bg-main-hover"
						  @click="sendContent"
					>
						<text class="font">评 论</text>
					</view>
				</view>
			</view>
		</f-popup>
	</view>
</template>
	
<script>
	import mediaList from "@/components/common/media-list.vue";
	import fPopup from "@/components/common/f-popup.vue";
	import timer from "@/common/time.js";
	import { mapState } from "vuex";
	
	let videoCTX = null;
	
	export default {
		components: {
			mediaList,
			fPopup
		},
		data() {
			return {
				detail: {
					category_id: 0,			// 作品分类
					cover: '',				// 作品封面图
					created_time: 0,		// 作品创建时间
					danmu_count: 0,			// 作品弹幕数量
					desc: '',				// 作品详情介绍
					duration: 0,			// 视频总时长
					id: 0,					// 视频ID
					play_count: 0,			// 作品播放量
					title: '',				// 作品标题
					user: {					// 发布用户个人信息
						avatar: '',			// 用户头像
						id: 0,				// 用户ID
						nickname: '',		// 用户昵称
						username: ''		// 用户名
					}
				},
				src: '',					// 视频URL
				poster: '',					// 视频封面
				scrollHeight: 500,
				tabBars: [
					{name: '简介'},
					{name: '评论'}
				],
				tabIndex: 0,
				hotVideoList: [],
				videoID: 0,
				videos: [],
				activeIndex: 0,
				followStatus: false,
				favaStatus: false,
				fansCount: 0,
				comments: [],
				reply_id: 0,
				reply_user: {
					id: 0,
					name: ''
				},
				content: ''
			}
		},
		onLoad(e) {
			let result = uni.getSystemInfoSync();
			
			this.scrollHeight = result.windowHeight - 270;
			
			if(!e.id) {
				uni.showToast({
					title: '当前视频丢失~',
					icon: 'error'
				});
				uni.navigateBack({
					delta: 1
				});
			}
			
			this.videoID = e.id;
			// 获取视频页详情内容
			this.$H.get('/video_read/' + this.videoID, {
				token: true,
				noJump: false,
				toast: false
			}).then(res => {
				this.hotVideoList = res.hotVideoOne;
				this.detail = res.video;
				this.poster = this.detail.cover;
				this.videos = res.video.video_details || [];
				this.src = this.videos[this.activeIndex] ? this.videos[this.activeIndex].url : '';
				// 将数据传送至nvue文件
				uni.$emit('video', {
					event: 'init',
					params: {
						videos: this.videos,
						activeIndex: this.activeIndex,
						poster: this.detail.cover
					}
				});
				this.detail.created_time = timer.gettime(this.detail.created_time);
				this.followStatus = res.follow;
				this.favaStatus = res.fava;
				this.getComments();
				this.getUserInfo();
			});
		},
		computed: {
			...mapState({
				user_id: state => {
					return state.user ? state.user.id : 0;
				}
			}),
		},
		filters: {
			formatTime(value) {
				return timer.gettime(value);
			}
		},
		mounted() {
			videoCTX = uni.createVideoContext('myVideo', this);
		},
		methods: {
			stop() {},
			changeTab(index) {
				this.tabIndex = index;
			},
			openPopup() {
				this.$refs.popup.show();
			},
			closeTab() {
				this.$refs.popup.hide();
			},
			openComment(reply_id = 0, reply_user = {
				id: 0,
				username: '',
				nickname: ''
			}) {
				this.reply_id = reply_id;
				this.reply_user = {
					id: reply_user.id,
					name: reply_user.nickname || reply_user.username
				};
				this.content = '';
				this.$refs.comment.show();
			},
			// 获取用户粉丝量
			getUserInfo() {
				this.$H.get('/user/user_info?user_id=' + this.detail.user.id).then(res => {
					this.fansCount = res.fansCount;
				});
			},
			// 关注或取关作者
			isFollow() {
				let url = this.followStatus ? '/user/unfollow' : '/user/follow';
				let msg = this.followStatus ? '取关成功~' : '关注成功~';
				
				this.$H.post(url, {
					follow_id: this.detail.user.id
				}, {
					token: true
				}).then(res => {
					this.followStatus = !this.followStatus;
					uni.showToast({
						title: msg,
						icon: 'success'
					})
				});
			},
			// 收藏或取消收藏作品
			isFava() {
				let msg = this.favaStatus ? '作品已取消收藏' : '作品收藏成功';
				
				this.$H.post('/fava/video', {
					video_id: this.detail.id
				}, {
					token: true
				}).then(res => {
					this.favaStatus = !this.favaStatus;
					uni.showToast({
						title: msg,
						icon: 'success'
					})
				});
			},
			// 作品合集选集切换
			changeVideo(item, index) {
				videoCTX.pause();
				this.activeIndex = index;
				this.src = item.url;
				// #ifndef APP-PLUS
				setTimeout(() => {
					videoCTX.play();
				}, 200);
				// #endif
				// #ifdef APP-PLUS
				uni.$emit('video', {
					event: 'change',
					params: {
						activeIndex: this.activeIndex
					}
				})
				// #endif
			},
			openUserSpace() {
				uni.navigateTo({
					url: '../userSpace/userSpace?user_id=' + this.detail.user.id
				})
			},
			// 作品评论
			getComments() {
				this.$H.get('/video_comment/' + this.detail.id).then(res => {
					this.comments = res;
				});
			},
			// 发布提交评论
			sendContent() {
				if(this.content === '') {
					uni.showToast({
						title: '评论内容不能为空~',
						icon: 'none'
					})
				}
				
				this.$H.post('/comment', {
					content: this.content,
					reply_id: this.reply_id,
					reply_user_id: this.reply_user.id,
					video_id: this.detail.id
				}, {
					token: true
				}).then(res => {
					this.getComments();
					uni.showToast({
						title: '评论成功~',
						icon: 'none'
					})
					this.$refs.comment.hide();
				})
			}
		}
	}
</script>

<style>

</style>
