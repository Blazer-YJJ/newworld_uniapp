
-  nxs "oa 频-类 =l">n e t( nec
m/ou C@/cvfo    i  $/.hte .  rn cnTe tta;oP {
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

<style></style>
