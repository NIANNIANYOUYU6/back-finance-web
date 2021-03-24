<style lang='scss' scoped>
.aside {
  height: 100%;
  padding: 16px 0;
  background-color: #161b27;
  .metaMask-status {
    color: #fff;
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid #999;
  }
  .logo {
    margin: 30px 20px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    background: url(../../assets/logo.png) no-repeat;
    background-size: contain;
  }
  .aside-info {
    padding: 0px 0 40px;
    color: #fff;
    display: flex;
    flex-flow: column;
    border-bottom: 1px solid #999;
    .aside-info_item {
      line-height: 32px;
      text-align: center;
      margin-top: 10px;
    }
  }
  .aside-menu {
    background-color: #161b27;
    .aside-menu_item {
      .icon {
        font-size: 24px;
        line-height: 40px;
        margin-right: 5px;
        vertical-align: middle;
      }
      .aside-menu_name {
        vertical-align: middle;
      }
    }
    .ant-menu-item-selected,
    .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
      background-color: #161b27;
      color: #35e9ef;
    }
  }
  .lang-switch {
    padding: 20px;
    button {
      color: #fff;
      background-color: #161b27;
    }
  }
}
</style>
<template>
  <div class="aside">
    <div class="metaMask-status">
      <div v-if="$store.state.account && $store.state.currentChain">
        <!-- <div> {{ $store.state.account }} </div> -->
        <div v-if="$store.state.currentChain !== 'BSCTest'"> 请连接到 BSCTest</div>
        <div v-else> 已连接 {{ $store.state.currentChain }} MetaMask </div>
      </div>
      <div v-else @click="connectMetaMask"> 未连接MetaMask,点击连接 </div>
    </div>
    <div class="logo" />
    <div class="aside-info">
      <div class="aside-info_item">
        <span>{{ $t('Sidebar.balance') }} : </span>
        <span> {{ $tranNumber(title.backBalance, 2) }} BK</span>
      </div>
      <div class="aside-info_item">
        <span>{{ $t('Sidebar.profit') }} : </span>
        <span>{{ $tranNumber(title.queryBack, 2) }} BK</span>
      </div>
      <div class="aside-info_item" style="margin-top: 10px">
        <a-button class="gradient-bg" @click="getAllRewardFunc" type="primary" size="small">{{
          $t('Sidebar.button')
        }}</a-button>
      </div>
    </div>
    <a-menu
      class="aside-menu"
      theme="dark"
      v-model:selectedKeys="selectedKeys"
      @click="handleClick"
    >
      <a-menu-item key="/home" class="aside-menu_item">
        <i class="icon iconfont icon-ganggan"></i>
        <span class="aside-menu_name">{{ $t('Sidebar.router.title1') }}</span>
      </a-menu-item>
      <a-menu-item key="/deposit" class="aside-menu_item">
        <i class="icon iconfont icon-iconset0219" style="font-size: 18px"></i>
        <span class="aside-menu_name">{{ $t('Sidebar.router.title2') }}</span>
      </a-menu-item>
    </a-menu>
    <div class="lang-switch">
      <a-button size="small" @click="langSwitch">
        {{ $t('switchLang') }}
      </a-button>
    </div>
  </div>
</template>
<script>
import { message } from 'ant-design-vue';
import { connect, getAllReward } from '../../common/src/back_main';

export default {
  props: {
    title: String,
  },
  data() {},
  computed: {
    selectedKeys() {
      return [this.$route.path] || ['/home'];
    },
  },
  created() {
    this.connectMetaMask();
  },
  methods: {
    langSwitch() {
      this.$i18n.locale = this.$i18n.locale === 'ch' ? 'en' : 'ch';
    },
    handleClick(e) {
      if (e.key != this.$route.path) {
        this.$router.push(e.key);
      }
    },
    getAllRewardFunc() {
      getAllReward((code, msg) => {
        //  0 小狐狸提交成功
        //  1 区块链确认成功
        if (code !== 0 && code !== 1) {
          // 发生错误时
          message.error(msg);
        }
      });
    },
    connectMetaMask() {
      // 开始连接
      connect((action, data) => {
        // 监听链的变化
        this.$store.commit('setState', data);
        this.$emit('handleLoad');
      })
        .then((res) => {
          if (res.code === 200) {
            this.$store.commit('setState', res.data);
          } else if (res.code === -200) {
            message.error(res.msg);
          }
        })
        .then(() => {
          // 触发重新获取数据
          this.$emit('handleLoad');
        });
    },
  },
};
</script>