
<template>
  <a-modal class="back-modal" visible @cancel="$emit('close')" width="480px">
    <template #title>
      <div class="title_name">{{ $t('Operation.depositBtn') }}</div>
      <div class="title_icon">
        <img class="icon" :src="'./assets/' + form.symbol + '.png'" />
        <span class="name"> {{ form.symbol }}</span>
      </div>
    </template>

    <div class="modal-body-content">
      <a-input
        class="modal-input"
        :suffix="form.symbol"
        v-model:value="amount"
        @change="updateAmount"
        :placeholder="balance"
      />
      <div class="error-text">{{ errorText }}</div>
      <a-radio-group
        class="back-radio-group"
        v-model:value="scale"
        button-style="solid"
        @change="switchScale"
      >
        <a-radio-button :value="0.25">25%</a-radio-button>
        <a-radio-button :value="0.5">50%</a-radio-button>
        <a-radio-button :value="0.75">75%</a-radio-button>
        <a-radio-button :value="1">100%</a-radio-button>
      </a-radio-group>
      <div class="text-space">
        <span class="text-c">{{ $t('Sidebar.balance') }}</span>
        <span class="fw-fff">{{ $tranNumber(balance, 8) }} {{ form.symbol }}</span>
      </div>
    </div>
    <div class="back-card-footer">
      <a-button
        :loading="loading"
        class="btn-one"
        v-if="allowance === 0 || errorText === $t('Prompt.error1')"
        type="primary"
        @click="approveTokenFunc"
        >{{ $t('Operation.warrant') }} {{ form.symbol }}</a-button
      >
      <a-button
        :loading="loading"
        class="btn-one"
        v-else
        :disabled="!+amount"
        type="primary"
        @click="handleOk"
        >{{ $t('Operation.ok') }}</a-button
      >
    </div>
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
      amount: '',
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
      console.log(this.allowance);
    },
    switchScale() {
      this.amount = this.balance * this.scale;
      this.updateAmount();
    },
    updateAmount() {
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