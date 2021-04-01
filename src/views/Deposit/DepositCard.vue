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
  <a-modal class="deposit-card" visible @cancel="$emit('close')" width="480px">
    <template #title>
      <div class="title">
        <div class="title_icon">
          <img class="icon" :src="'./assets/' + form.symbol + '.png'" />
          <span class="name"> {{ form.symbol }}</span>
        </div>
        <div class="title_name">{{ $t('Operation.depositBtn') }}</div>
      </div>
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <a-input :suffix="form.symbol" v-model:value="amount" @change="updateAmount" />
        <div class="error-text">{{ errorText }}</div>
        <div class="select-percentage">
          <a-button size="small" @click="switchScale(0.25)" :class="{ active: scale === 0.25 }">
            25%
          </a-button>
          <a-button size="small" @click="switchScale(0.5)" :class="{ active: scale === 0.5 }">
            50%
          </a-button>
          <a-button size="small" @click="switchScale(0.75)" :class="{ active: scale === 0.75 }">
            75%
          </a-button>
          <a-button size="small" @click="switchScale(1)" :class="{ active: scale === 1 }">
            100%
          </a-button>
        </div>
      </div>
      <div class="deposit-card-footer">
        <div class="deposit-card-footer_button">
          <a-button
            :disabled="allowance > 0 && errorText !== $t('Prompt.error1')"
            type="primary"
            @click="approveTokenFunc"
            >{{ $t('Operation.warrant') }}</a-button
          >
          <a-button
            :disabled="!allowance || !!errorText || !+amount"
            type="primary"
            @click="handleOk"
            >{{ $t('Operation.ok') }}</a-button
          >
        </div>
        <div class="deposit-card-footer_text"
          >{{ $t('Sidebar.balance') }} :
          <a-button type="link">
            {{ $tranNumber(balance, 8) }}
          </a-button>
          {{ form.symbol }}</div
        >
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue';
import {
  getTokenAddress,
  deposit,
  getAllowance,
  approveToken,
  getBalance,
  fetchData,
} from '../../common/src/back_main';

export default {
  props: {
    depositItem: Object,
    onClose: Function,
  },
  data() {
    return {
      balance: '',
      loading: false,
      amount: '0.00',
      errorText: '',
      scale: '',
      allowance: 0,
      form: {
        symbol: '',
      },
    };
  },
  async mounted() {
    Object.assign(this.form, this.depositItem);
    this.loading = true;
    try {
      this._address = getTokenAddress(this.form.symbol);
      await Promise.all([this.getAllowanceFunc(), this.getBalanceNum()]);
    } catch (error) {
      console.log('getBalance or getAllowance error');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    // 查询币的余额
    async getBalanceNum() {
      this.balance = await getBalance(this._address);
    },
    // 获取授权额度
    async getAllowanceFunc() {
      this.allowance = await getAllowance(this._address);
    },
    switchScale(scale) {
      this.amount = this.balance * scale;
      this.updateAmount();
    },
    updateAmount() {
      this.scale = this.amount / this.balance;
      let err = '';
      if (!+this.amount && +this.amount !== 0) {
        err = this.$t('Prompt.error3');
      } else if (this.amount > +this.balance) {
        err = this.$t('Prompt.error2');
      } else if (this.amount > +this.allowance) {
        err = this.$t('Prompt.error1');
      }
      this.errorText = err;
    },
    async handleOk() {
      if (!this.errorText) {
        this.loading = true;
        // 转账金额为字符串格式的
        const num = this.amount + '';
        deposit(this._address, num, (code, msg) => {
          //  0 小狐狸提交成功
          //  1 区块链确认成功
          console.log('deposit ---->', code, msg);
          if (code === 1) {
            this.loading = false;
            this.$emit('close', 'update');
          } else if (code !== 0) {
            // 发生错误时
            message.error(msg);
            this.loading = false;
          }
        });
      }
    },
    // 授权
    approveTokenFunc() {
      this.loading = true;
      approveToken(this._address, async (code, msg) => {
        console.log('approve result ', code, msg);
        if (code === 1) {
          await fetchData();
          await this.getAllowanceFunc();
          this.updateAmount();
          this.loading = false;
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