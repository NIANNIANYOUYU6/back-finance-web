
<template>
  <a-modal class="back-modal" visible @ok="handleOk" @cancel="$emit('close')" width="480px">
    <template #title>
      <div class="title_name">{{ $t('Operation.takeBtn') }}</div>
      <div class="title_icon">
        <img class="icon" :src="'./assets/' + form.symbol + '.png'" />
        <span class="name"> {{ form.symbol }}</span>
      </div>
    </template>

    <div class="modal-body-content">
      <a-input-group compact class="model-input-group">
        <a-input-number
          v-model:value="amount"
          :min="0"
          @change="updateAmount"
          @keydown="(e) => (e.target.value = e.target.value.match(/^\d*(\.?\d{0,7})/g)[0] || null)"
          :placeholder="$tranNumber(form.amountDeposit, 8)"
          :precision="8"
        />
        <span class="model-input-suffix">{{ form.symbol }} </span>
      </a-input-group>
      <!-- <a-input
        class="modal-input"
        :suffix="form.symbol"
        v-model:value="amount"
        @change="updateAmount"
        :placeholder="form.amountDeposit"
      /> -->
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
        <span class="text-c">{{ $t('Deposit.myDeposit') }}</span>
        <span class="fw-fff">{{ $tranNumber(form.amountDeposit, 8) }} {{ form.symbol }}</span>
      </div>
      <div class="text-space">
        <span class="text-c">{{ $t('Sidebar.balance') }}</span>
        <span class="fw-fff">{{ $tranNumber(balance, 8) }} {{ form.symbol }}</span>
      </div>
    </div>
    <div class="back-card-footer">
      <a-button
        :loading="loading"
        class="btn-one"
        :disabled="!!errorText || !+amount"
        style="padding: 0 30px"
        type="primary"
        @click="handleOk"
        >{{ $t('Operation.ok') }}</a-button
      >
    </div>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue';
import { getTokenAddress, getBalance, withdraw } from '../../common/src/back_main';

export default {
  props: {
    depositItem: Object,
    onClose: Function,
  },
  data() {
    return {
      amount: '',
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
    switchScale() {
      this.amount = this.form.amountDeposit * this.scale;
      this.updateAmount();
    },
    updateAmount() {
      let err = '';
      if (!+this.amount && +this.amount !== 0) {
        err = this.$t('Prompt.error3');
      } else if (this.amount > +this.form.remainBorrow) {
        err = this.$t('Prompt.error8');
      } else if (this.amount > +this.form.amountDeposit) {
        err = this.$t('Prompt.error5');
      }
      this.errorText = err;
    },
    handleOk() {
      if (!this.errorText) {
        this.loading = true;
        withdraw(this._address, +this.amount, (code, msg) => {
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