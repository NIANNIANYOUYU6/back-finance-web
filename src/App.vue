<style lang="scss">
#app {
  height: 100%;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #161b27;

  .router-view {
    height: 100%;
    min-height: 600px;
  }
}
</style>

<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view class="router-view" />
    </a-config-provider>
  </div>
</template>
<script>
import zh_CN from 'ant-design-vue/es/locale/zh_CN';
import en_GB from 'ant-design-vue/es/locale/en_GB';
export default {
  data() {
    return {};
  },
  computed: {
    locale() {
      // 判断当前语言环境
      return this.$i18n.locale === 'ch' ? zh_CN : en_GB;
    },
  },
};
</script>