<style lang='scss'  >
.deposit-card-footer {
  .deposit-card-footer_button {
    display: flex;
    justify-content: space-between;
    button {
      padding: 0 30px;
    }
  }
  .deposit-card-footer_text {
    line-height: 40px;
    font-size: 15px;
    button {
      color: rgba(0, 0, 0, 0.85);
    }
  }
}
</style>
<template>
  <a-modal class="back-modal" visible @cancel="$emit('close')" width="420px">
    <template #title>
      <div class="title_name">{{ $t('Sidebar.button') }}</div>
      <div class="title_icon">
        <img class="icon" src="../../assets/logo.png" />
      </div>
    </template>
    <div class="modal-body-content">
      <div class="text-space">
        <span class="text-c">{{ $t('Sidebar.profit') }}</span>
        <span class="fw-fff">{{ $tranNumber(title.queryBack, 2) }} BK</span>
      </div>
      <div class="text-space">
        <span class="text-c">{{ $t('Sidebar.balance') }}</span>
        <span class="fw-fff">{{ $tranNumber(title.backBalance, 2) }} BK</span>
      </div>
    </div>
    <div class="back-card-footer">
      <a-button
        :loading="loading"
        class="btn-one"
        :disabled="+title.queryBack === 0"
        type="primary"
        @click="handleOk"
        >{{ $t('Operation.receive') }}</a-button
      >
    </div>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue';
import { getAllReward, getTitles } from '../../common/src/back_main';

export default {
  props: {
    onClose: Function,
  },
  data() {
    return {
      loading: false,
      title: {
        backBalance: 0,
        queryBack: 0,
      },
    };
  },
  created() {
    this.getTitles();
  },
  methods: {
    // 查询余额
    async getTitles() {
      this.loading = true;
      try {
        const res = await getTitles();
        Object.assign(this.title, res.data);
        console.log('这是获取到的total--->', res.data);
      } catch (error) {
        console.log('getTitles error');
      } finally {
        this.loading = false;
      }
    },
    handleOk() {
      this.loading = true;
      getAllReward((code, msg) => {
        //  0 小狐狸提交成功
        //  1 区块链确认成功
        console.log('getAllReward ---->', code, msg);
        if (code === 1) {
          this.loading = false;
          this.$emit('close');
          // 更新totle
          this.$store.commit('setState', { updatePage: +new Date() });
        } else if (code !== 0) {
          // 发生错误时
          message.error(msg);
          this.loading = false;
        }
      });
    },
  },
};
</script>