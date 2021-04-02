<style lang='scss' scoped>
.border-card {
  width: 100%;
  padding: 0 20px;
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
    <div class="bgu-img">
      <img src="../assets/border-top.png" alt="" />
    </div>
    <div style="padding: 0px 15px">
      <slot />
    </div>
    <div class="bgu-img">
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