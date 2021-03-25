<style lang='scss' >
.deposit-card {
  .deposit-card-content {
    padding-bottom: 24px;
    border-bottom: 1px solid #ccc;
  }
  .select-percentage {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    button {
      flex: 1;
      margin-right: 5px;
      &:last-child {
        margin-right: 0px;
      }
    }
    .active {
      color: #fff;
      background-color: #ccc;
      border-color: #ccc;
    }
  }
  .content-num {
    text-align: center;
    margin-top: 20px;
    font-size: 16px;
  }
  .deposit-card-footer {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
<template>
  <a-modal class="deposit-card" visible @ok="handleOk" @cancel="$emit('close')" width="420px">
    <template #title>
      <div class="title">
        <div class="title_icon">
          <img class="icon" :src="'./img/icon/' + form.symbol + '.png'" />
          <span class="name"> {{ form.symbol }}</span>
        </div>
        <div class="title_name">提现</div>
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
        <div class="content-num"
          >我的存款 : {{ $tranNumber(form.amountDeposit, 8) }} {{ form.symbol }}</div
        >
      </div>
      <div class="deposit-card-footer">
        <a-button style="padding: 0 30px" type="primary" @click="handleOk">确认</a-button>
        <div class="deposit-card-footer_text"
          >钱包余额 :
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
import { getTokenAddress, getBalance, withdraw } from '../../common/src/back_main';

export default {
  props: {
    depositItem: Object,
  },
  data() {
    return {
      amount: '0.00',
      balance: '',
      loading: false,
      errorText: '',
      scale: '',
      isApproved: false,
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
      await this.getBalanceNum();
    } catch (error) {
      console.log('getBalance or approved error');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    // 查询币的余额
    async getBalanceNum() {
      this.balance = await getBalance(this._address);
    },
    switchScale(scale) {
      this.amount = this.form.amountDeposit * scale;
      this.updateAmount();
    },
    updateAmount() {
      this.scale = this.amount / this.form.amountDeposit;
      let err = '';
      if (this.amount === '' || +this.amount === 0) {
        err = `不能为空或零`;
      } else if (!+this.amount) {
        err = `只能为数字`;
      } else if (this.amount > +this.form.amountDeposit) {
        err = `存款余额不足`;
      }
      this.errorText = err;
    },
    handleOk() {
      if (!this.errorText) {
        this.loading = true;
        // 转账金额为字符串格式的
        const num = this.amount + '';
        withdraw(this._address, num, (code, msg) => {
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
  },
};
</script>