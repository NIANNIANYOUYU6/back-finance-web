<style scoped lang="scss">
</style>
<template>
  <a-layout class="frame">
    <a-layout-sider>
      <Aside :title="title" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header> <Header @handleLoad="handleLoad" :title="title" /></a-layout-header>
      <a-layout-content>
        <router-view :key="timer" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script >
import Aside from './Aside';
import Header from './Header';
import { getTitles, fetchData } from '../../common/src/back_main';

export default {
  components: { Aside, Header },
  data() {
    return {
      timer: new Date().getTime(),
      title: {
        backBalance: 0,
        queryBack: 0,
        totalLock: 0,
        totalDeposit: 0,
        totalBorrow: 0,
        backPrice: 0,
        backSupply: 0,
      },
    };
  },
  watch: {
    '$store.state.updatePage'() {
      this.getTitlesFunc();
    },
  },
  methods: {
    async getTitlesFunc() {
      await fetchData();
      const res = await getTitles();
      Object.assign(this.title, res.data);
      console.log('这是获取到的total--->', res.data);
    },
    handleLoad() {
      this.timer = new Date().getTime();
      this.getTitlesFunc();
    },
  },
};
</script>
