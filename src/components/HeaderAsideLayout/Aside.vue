<style lang='scss' scoped>
.aside {
  height: 100%;
  padding: 16px 0;
  display: flex;
  flex-flow: column;
  background-color: #141031;
  font-family: 'pmzd' !important;
  border-right: 1px solid;
  border-image: linear-gradient(#141031, #35e9ef, #141031) 1;
  .logo {
    margin: 10px 20px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    background: url(../../assets/logo.png) no-repeat;
    background-size: contain;
  }
  .aside-menu {
    flex: 1;
    background-color: #141031;
    .aside-menu_item {
      font-size: 16px;
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
      background-color: #1f2b4d;
      color: #35e9ef;
    }
  }
  .aside-footer {
    text-align: center;
    padding: 20px;
    .lang-switch {
      color: #35e9ef;
      margin-top: 10px;
    }
    .ant-btn-primary:hover,
    .ant-btn-primary:focus {
      background-image: linear-gradient(to right, #b15ff1, #556cf5);
    }
  }
}
</style>
<template>
  <div class="aside">
    <div class="logo" />
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
    <div class="aside-footer">
      <div>
        <a-button class="gradient-bg" @click="reward = true" type="primary">
          <i class="icon iconfont icon-lingquguanggao pr-10" />
          {{ $t('Sidebar.button') }}
        </a-button>
      </div>
      <div>
        <a-button class="lang-switch" type="link">
          <i class="icon iconfont icon-caiyouduo_renzhengshuoming-renzhengziliao pr-10" />
          <a
            style="color: #35e9ef"
            href="https://back-finance.gitbook.io/back-finance/"
            target="new"
            >{{ $t('Sidebar.docs') }}
          </a>
        </a-button>
      </div>
      <div>
        <a-button class="lang-switch" @click="langSwitch" type="link">
          <i
            v-if="$t('switchLang') === 'English'"
            class="icon iconfont icon-zhongyingwenyingwen02-01 pr-10"
          />
          <i v-else class="iconfont icon-zhongyingwen2zhongwen" />
          {{ $t('switchLang') }}
        </a-button>
      </div>
    </div>
    <Reward v-if="reward" @close="reward = false" />
  </div>
</template>
<script>
import Reward from './Reward';
export default {
  components: { Reward },
  props: {
    title: Object,
  },
  data() {
    return {
      reward: false,
    };
  },
  computed: {
    selectedKeys() {
      return [this.$route.path] || ['/home'];
    },
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
  },
};
</script>