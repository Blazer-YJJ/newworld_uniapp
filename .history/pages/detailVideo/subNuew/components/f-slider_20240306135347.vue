<template>
	<view class="flex align-center position-relative" 
		  style="height: 44px;"
		  @touchstart="touchstart"
		  @touchmove="touchmove"
		  @touchend="touchend"
		  @touchcancel="touchcancel"
	>
		<view class="flex-1 rounded"
			  style="height: 3px;background-color: rgba(255,255,255,0.5);"
		>
			<view class="bg-main" style="height: 3px;" :style="activeStyle"></view>
		</view>
		<view class="position-absolute rounded-circle bg-main-hover" 
			  style="width: 15px;height: 15px;"
			  :style="activeDotStyle"
		>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				width: 0,			// 进度条总长度
				activeWidth: 0,		// 进度条动态变化
				moveStatus: false,	// 移动状态
				left: 0
			}
		},
		inject: ['v'],				// 接收父组件的依赖
		props: {
			currentTime: {
				type: Number,
				default: 0
			},
			duration: {
				type: Number,
				default: 0
			}
		},
		computed: {
			activeStyle() {
				return `width:${this.activeWidth}px;`;
			},
			activeDotStyle() {
				return `left:${this.activeWidth}px;`;
			},
			current() {
				return this.width == 0 ? 0 : (this.activeWidth / this.width) * this.duration;
			}
		},
		created() {
			if(!this.v.fullScreenStatus) {
				this.width = this.v.windowWidth - 44 - 44 - 80 - 15; 
				this.left = 44;
			} else {
				this.width = this.v.windowHeight - 30 - 15;
				 this.left = 15;
			}
			
			this.active();
		},
		watch: {
			currentTime(newValue, oldValue) {
				if(!this.moveStatus) {
					this.active();
				}
			}
		},
		methods: {
			active() {
				this.activeWidth = this.duration == 0 ? 0 : (this.currentTime / this.duration) * this.width;
			},
			// 手指触摸
			touchstart(e) {
				if(this.duration === 0) return; 
				this.moveStatus = true;
				this.activeWidth = e.changedTouches[0].screenX - this.left;
			},
			// 手指移动/拖拽
			touchmove(e) {
				if(this.duration === 0) return;
				this.moveStatus = true;
			
				let dWidth = e.changedTouches[0].screenX - this.left;
				
				// 判断拖拽长度
				if(dWidth <= 0) {
					this.activeWidth = 0;
				} else if(dWidth > this.width) {
					this.activeWidth = this.width;
				} else {
					this.activeWidth = dWidth;
				}
				this.$emit('update', this.current);
			},
			// 操作结束
			touchend(e) {
				if(this.duration === 0) return;
				this.moveStatus = false;
				this.$emit('change', this.current);
			},
			// 手指操作中断
			touchcancel(e) {
				this.touchend(e);
			}
		}
	}
</script>

<style>
</style>
