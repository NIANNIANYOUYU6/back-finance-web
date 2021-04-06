
<template>
  <a-modal class="back-modal" visible @cancel="$emit('close')" width="460px">
    <template #title>
      <CardTitle
        :title="{
          swapperName: pairsItem.swapperName,
          tokenA: pairsItem.symbol0,
          tokenB: pairsItem.symbol1,
          name: $t('Operation.repay'),
        }"
      />
    </template>
    <div class="modal-body-content">
      <div class="text-space">
        <span class="text-c"> {{ $t('Farm.user.totalDebt') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(pairsItem.debtAmount, 4) }} {{ pairsItem.borrowSymbol }}
          +
          {{ $tranNumber(pairsItem.debtInterest, 4) }} {{ pairsItem.borrowSymbol }}</span
        >
      </div>
      <div class="text-space">
        <span class="text-c">{{ $t('Operation.repay') }}</span>
      </div>
      <a-input-group compact class="model-input-group">
        <span class="model-input-suffix">
          <img style="height: 20px" :src="'./assets/' + pairsItem.borrowSymbol + '.png'" />
        </span>
        <a-input-number
          v-model:value="form.amount"
          :min="0"
          @change="updateAmount()"
          @keydown="(e) => (e.target.value = e.target.value.match(/^\d*(\.?\d{0,7})/g)[0] || null)"
          :placeholder="$tranNumber(currentTotalDebt, 8)"
          :precision="8"
        />
        <span class="model-input-suffix">{{ pairsItem.borrowSymbol }} </span>
      </a-input-group>
      <!-- <a-input
        class="modal-input"
        :suffix="pairsItem.borrowSymbol"
        v-model:value="form.amount"
        :placeholder="currentTotalDebt"
        @change="updateAmount()"
      /> -->
      <div class="error-text">{{ form.errorText }}</div>
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
        <span class="text-c"> {{ $t('Farm.display.repay1') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(form.borrowRepay, 4) }} {{ pairsItem.borrowSymbol }}
          +
          {{ $tranNumber(form.interestRepay, 4) }} {{ pairsItem.borrowSymbol }}
        </span>
      </div>
      <div class="text-space">
        <span class="text-c"> {{ $t('Farm.display.repay2') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(form.borrowRemain, 4) }} {{ pairsItem.borrowSymbol }}
          +
          {{ $tranNumber(form.interestRemain, 4) }} {{ pairsItem.borrowSymbol }}
        </span>
      </div>
      <div class="text-space">
        <span class="text-c"> {{ $t('Farm.display.repay3') }}</span>
        <span class="fw-fff">{{ $tranNumber(form.health * 100, 2) }}</span>
      </div>
      <div class="prompt-text" style="line-height: 16px">
        <ExclamationCircleFilled />
        {{ $t('Farm.healthyRemind') }}
      </div>
      <div class="text-space" style="margin-top: 10px">
        <span class="text-c"> {{ $t('Sidebar.balance') }}</span>
        <span class="fw-fff"> {{ $tranNumber(form.balance, 8) }} {{ pairsItem.borrowSymbol }}</span>
      </div>
    </div>
    <div class="back-card-footer">
      <a-button :loading="initLoading" class="btn-one" v-if="initLoading" type="primary"
        >{{ $t('Operation.loading') }}
      </a-button>
      <a-button
        :loading="loading"
        class="btn-one"
        v-else-if="form.allowance === 0 || form.errorText === $t('Prompt.error1')"
        type="primary"
        @click="approveTokenFunc"
        >{{ $t('Operation.warrant') }} {{ pairsItem.borrowSymbol }}</a-button
      >
      <a-button
        :loading="loading"
        class="btn-one"
        v-else
        :disabled="!!form.errorText"
        type="primary"
        @click="handleOk"
        >{{ $t('Operation.ok') }}</a-button
      >
    </div>
  </a-modal>
</template>
<script>
import CardTitle from './CardTitle';
import { message } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';

import {
  repay,
  fetchData,
  getAllowance,
  approveToken,
  getBalance,
  getRepayInfo,
} from '../../common/src/back_main';

export default {
  components: { CardTitle, ExclamationCircleFilled },
  props: {
    pairsItem: Object,
    onClose: Function,
  },
  data() {
    return {
      balance: '',
      initLoading: false,
      loading: false,
      scale: '',
      currentTotalDebt: 0,
      form: {
        borrowAmount: 0,
        interestAmount: 0,
        borrowRepay: 0,
        interestRepay: 0,
        borrowRemain: 0,
        interestRemain: 0,
        health: 0,
        balance: '',
        amount: '',
        allowance: '',
        errorText: '',
      },
    };
  },
  mounted() {
    this.dataInit();
  },
  methods: {
    async dataInit() {
      this.initLoading = true;
      try {
        await fetchData();
        this.currentTotalDebt = this.pairsItem.debtAmount + this.pairsItem.debtInterest;
        const address = this.pairsItem.borrowToken;
        const p1 = await this.getBalanceNum(address);
        const p2 = await this.getAllowanceFunc(address);
        // 同步加载数据
        await Promise.all([p1, p2, this.getRepayInfo()]);
      } catch (error) {
        console.log('getBalance or getAllowance error');
      } finally {
        this.initLoading = false;
      }
    },
    // 查询币的余额
    async getBalanceNum(address) {
      this.form.balance = await getBalance(address);
    },
    async getAllowanceFunc(address) {
      // 获取授权额度
      this.form.allowance = await getAllowance(address);
    },
    switchScale() {
      this.form.amount = this.currentTotalDebt * this.scale;
      this.updateAmount();
    },
    updateAmount() {
      let err = '';
      if (this.form.amount === '' || +this.form.amount === 0) {
        err = this.$t('Prompt.error4');
      } else if (!+this.form.amount) {
        err = this.$t('Prompt.error3');
      } else if (this.form.amount > +this.currentTotalDebt) {
        err = this.$t('Prompt.error6');
      } else if (this.form.amount > +this.form.balance) {
        err = this.$t('Prompt.error2');
      } else if (this.form.amount > +this.form.allowance) {
        err = this.$t('Prompt.error1');
      }
      this.form.errorText = err;
      this.getRepayInfo();
    },
    async handleOk() {
      if (!this.form.errorText) {
        const token_address = this.pairsItem.borrowToken;
        const amount = this.form.amount || this.currentTotalDebt;
        this.loading = true;
        repay(this.pairsItem.address, token_address, +amount, (code, msg) => {
          //  0 小狐狸提交成功
          //  1 区块链确认成功
          console.log('repay err---->', code, msg);
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
    // 还贷拆分
    async getRepayInfo() {
      if (!this.form.errorText) {
        const res = await getRepayInfo(
          this.pairsItem.address,
          this.pairsItem.borrowToken,
          this.form.amount
        );
        console.log(res);
        Object.assign(this.form, res);
      }
    },
    // 授权
    approveTokenFunc() {
      this.loading = true;
      approveToken(this.pairsItem.borrowToken, async (code, msg) => {
        console.log('approve result ', code, msg);
        if (code === 1) {
          await this.dataInit();
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