<style lang='scss' scoped>
.border-card {
  width: 100%;
  .bgu-img {
    height: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<template>
  <div class="border-card">
    <div class="bgu-img" style="margin-right: 24px">
      <img src="../assets/border-top.png" alt="" />
    </div>
    <div style="padding: 10px 36px">
      <slot />
    </div>
    <div class="bgu-img" style="margin-left: 24px">
      <img src="../assets/border-bottom.png" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>