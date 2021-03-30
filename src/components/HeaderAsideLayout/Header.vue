<style lang='scss' scoped>
.header {
  height: 100%;
  padding: 0 20px 0 10px;
  .header-title {
    color: #35e9ef;
    text-align: end;
    margin-bottom: 20px;
    .header-title_link {
      cursor: pointer;
      display: flex;
      padding: 6px 20px;
      display: inline-block;
      background-image: linear-gradient(to right, #b15ff1, #556cf5);
      border-radius: 10px;
      .header-title_link-num {
        color: #000;
        font-weight: 700;
      }
    }
    .header-title_link-err {
      background-image: linear-gradient(to right, #671966, #671966);
      color: #e363a5;
    }
  }
  .header-list {
    color: aliceblue;
    display: flex;
    .header-item {
      flex: 1;
      display: flex;
      min-width: 0;
      background-color: #141031;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      margin-right: 10px;
      padding: 10px;
      .icon {
        font-size: 36px;
        line-height: 60px;
        color: #666ae1;
      }
      .header-item_title {
        margin-left: 10px;
        line-height: 24px;
        .header-item_name {
          color: #35e9ef;
          font-family: 'pmzd' !important;
        }
        .header-item_num {
        }
      }

      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
</style>
<template>
  <div class="header">
    <div class="header-title">
      <div class="header-title_link" v-if="$store.state.currentChain === 'BSCTest'">
        <span class="header-title_link-num">{{ $tranNumber(title.backBalance, 2) }} BK</span>
        <a-divider style="background: #333" type="vertical" />
        <span> {{ account }} </span>
        <a-divider style="background: #333" type="vertical" />
        <span> {{ $store.state.currentChain }} </span>
      </div>
      <div class="header-title_link header-title_link-err" v-else-if="$store.state.account">
        <span>0 BK</span>
        <a-divider style="background: #333" type="vertical" />
        <span> Wrong Network </span>
        <a-divider style="background: #333" type="vertical" />
        <span> {{ $store.state.currentChain }} </span>
      </div>
      <div class="header-title_link" v-else @click="connectMetaMask"> 未连接MetaMask,点击连接 </div>
    </div>
    <BorderCard>
      <div class="header-list">
        <div class="header-item">
          <i class="icon iconfont icon-Dollar-circle-fill"></i>
          <div class="header-item_title">
            <div class="header-item_name">{{ $t('Header.lockUp') }}</div>
            <div class="header-item_num"> $ {{ $tranNumber(title.totalLock, 2) }} </div>
          </div>
        </div>
        <div class="header-item">
          <i class="icon iconfont icon-qianbao"></i>
          <div class="header-item_title">
            <div class="header-item_name">{{ $t('Header.deposit') }}</div>
            <div class="header-item_num"> $ {{ $tranNumber(title.totalDeposit, 2) }} </div>
          </div>
        </div>
        <div class="header-item">
          <i class="icon iconfont icon-xiaofangzhanzongliangbeijing"></i>
          <div class="header-item_title">
            <div class="header-item_name">{{ $t('Header.allocation') }}</div>
            <div class="header-item_num"> $ {{ $tranNumber(title.totalBorrow, 2) }} </div>
          </div>
        </div>
        <div class="header-item">
          <i class="icon iconfont icon-qian"></i>
          <div class="header-item_title">
            <div class="header-item_name">{{ $t('Header.price') }}</div>
            <div class="header-item_num">$ {{ $tranNumber(title.backPrice, 2) }} </div>
          </div>
        </div>
        <div class="header-item">
          <i class="icon iconfont icon--wakuangjiankong"></i>
          <div class="header-item_title">
            <div class="header-item_name">{{ $t('Header.output') }}</div>
            <div class="header-item_num"> {{ $tranNumber(title.backSupply, 2) }} </div>
          </div>
        </div>
      </div>
    </BorderCard>
  </div>
</template>
<script>
import { message } from 'ant-design-vue';
import { connect, fetchData } from '../../common/src/back_main';
import BorderCard from '../../components/BorderCard';
export default {
  components: { BorderCard },
  props: {
    title: Object,
    onHandleLoad: Function,
  },
  computed: {
    account() {
      const str = this.$store.state.account;
      var subStr1 = str.substr(0, 5);
      var subStr2 = str.substr(str.length - 4, 4);
      var subStr = subStr1 + '...' + subStr2;
      return subStr;
    },
  },

  created() {
    this.connectMetaMask();
  },
  methods: {
    connectMetaMask() {
      console.log('--->我在连接');
      // 开始连接
      connect((action, data) => {
        // 监听链的变化
        this.$store.commit('setState', { ...data, updatePage: +new Date() });
        this.$emit('handleLoad');
      })
        .then((res) => {
          if (res.code === 200) {
            this.$store.commit('setState', { ...res.data, updatePage: +new Date() });
          } else if (res.code === -200) {
            message.error(res.msg);
          }
        })
        .then(fetchData)
        .then(() => {
          // 触发重新获取数据
          this.$emit('handleLoad');
        });
    },
  },
};
</script>