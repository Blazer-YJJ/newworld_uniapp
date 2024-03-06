<template>
  <view>
    <!-- 微信小程序端导航栏 -->
    <!-- #ifdef MP -->
    <view
      class="flex align-center fixd-top bg-white"
      style="height: 44px"
      @click="openSearch"
    >
      <!-- 搜索框 -->
      <view
        class="mx-2 flex align-center flex-1 rounded-circle py-1 px-1"
        style="background-color: #f6f7f8; color: #959aa0"
      >
        <text class="iconfont icon-sousuoxiao"></text>
        <text>点击搜索作品/视频</text>
      </view>
    </view>
    <!-- #endif -->
    <!-- 分类一 -->
    <card title="热门分类" :showRefresh="false">
      <scroll-view scroll-x="true" class="scroll-row">
        <icon-cate
          v-for="(item, index) in list"
          :key="index"
          :item="item"
          :index="index"
        >
        </icon-cate>
      </scroll-view>
    </card>
    <view class="f-divider"></view>
    <!-- 分类二 -->
    <card title="全部分类" :showRefresh="false">
      <icon-cate
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        :index="index"
      >
      </icon-cate>
    </card>
  </view>
</template>

<script>
import card from "@/components/common/card.vue";
import iconCate from "@/components/common/icon-cate.vue";

export default {
  components: {
    card,
    iconCate,
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    getData() {
      uni.showLoading();
      return this.$H
        .get("/category")
        .then((res) => {
          this.list = res;
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    openSearch() {
      uni.navigateTo({
        url: "../search/search",
      });
    },
  },
  onLoad() {
    this.getData();
  },
  onPullDownRefresh() {
    this.getData()
      .then((res) => {
        uni.showToast({
          title: "刷新成功",
          icon: "none",
        });
        uni.stopPullDownRefresh();
      })
      .catch((err) => {
        uni.stopPullDownRefresh();
      });
  },
};
</script>

<style>
</style>
