<style lang='scss' scoped>
.header {
  color: aliceblue;
  display: flex;
  .header-item {
    flex: 1;
    height: 70px;
    text-align: center;
    border-right: 1px solid #666;
    .header-item_title {
      line-height: 20px;
      color: #35e9ef;
      .icon {
        margin-right: 5px;
      }
    }
    .header-item_num {
      font-size: 18px;
      padding: 0 20px;
    }
    &:last-child {
      border-right: 0;
    }
  }
}
</style>
<template>
  <div class="header">
    <div class="header-item">
      <div class="header-item_title">
        <i class="icon iconfont icon-Dollar-circle-fill"></i>
        <span class="aside-menu_name">{{ $t('Header.lockUp') }}</span>
      </div>
      <div class="header-item_num"> $ {{ $tranNumber(title.totalLock, 2) }} </div>
    </div>
    <div class="header-item">
      <div class="header-item_title">
        <i class="icon iconfont icon-qianbao"></i>
        <span class="aside-menu_name">{{ $t('Header.deposit') }}</span>
      </div>
      <div class="header-item_num"> $ {{ $tranNumber(title.totalDeposit, 2) }} </div>
    </div>
    <div class="header-item">
      <div class="header-item_title">
        <i class="icon iconfont icon-xiaofangzhanzongliangbeijing"></i>
        <span class="aside-menu_name">{{ $t('Header.allocation') }}</span>
      </div>
      <div class="header-item_num"> $ {{ $tranNumber(title.totalBorrow, 2) }} </div>
    </div>
    <div class="header-item">
      <div class="header-item_title">
        <i class="icon iconfont icon-qian"></i>
        <span class="aside-menu_name">{{ $t('Header.price') }}</span>
      </div>
      <div class="header-item_num">$ {{ $tranNumber(title.backPrice, 2) }} </div>
    </div>
    <div class="header-item">
      <div class="header-item_title">
        <i class="icon iconfont icon--wakuangjiankong"></i>
        <span class="aside-menu_name">{{ $t('Header.output') }}</span>
      </div>
      <div class="header-item_num"> {{ $tranNumber(title.backSupply, 2) }} </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
  },
};
</script>