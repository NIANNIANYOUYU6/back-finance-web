<style lang='scss' >
.home-card {
  .ant-modal-content {
    padding: 0 60px;
  }
  .ant-modal-body {
    padding-top: 0px;
    .deposit-card-content {
      .icon {
        height: 26px;
      }
      .error-text {
        min-height: 10px;
      }
      .select-percentage {
        margin: 0 0 10px;
      }
    }
  }
}
</style>
<template>
  <a-modal class="deposit-card home-card" visible @cancel="$emit('close')" width="460px">
    <template #title>
      <CardTitle
        :title="{
          source: pairsItem.source,
          tokenA: pairsItem.tokenA.symbol,
          tokenB: pairsItem.tokenB.symbol,
          name: '还贷',
        }"
      />
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <div class="line-h-40">
          当前总负债 : {{ currentTotalDebt }}
          {{ pairsItem[pairsItem.debtToken].symbol }}
        </div>
        <div style="display: flex">
          <span>还贷</span>
          <div style="flex: 1; margin-left: 10px">
            <a-input
              :suffix="pairsItem[pairsItem.debtToken].symbol"
              v-model:value="form.amount"
              :placeholder="currentTotalDebt"
              @change="updateAmount()"
            />
            <div class="error-text">{{ form.errorText }}</div>
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
        </div>
        <div class="line-h-40">
          还贷后负债 : {{ currentTotalDebt - form.amount }}
          {{ pairsItem[pairsItem.debtToken].symbol }}
        </div>
        <div class="line-h-40" v-if="form.amount">
          还贷后风险值
          <a-tooltip placement="top">
            <template #title>
              <span> 请注意：当风险值超过100时，资产将会被清算。</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          : {{ $tranNumber(form.riskValue, 2) }}
        </div>
      </div>
      <div class="deposit-card-footer">
        <div class="deposit-card-footer_button">
          <a-button
            :disabled="form.allowance && form.errorText !== '授权额度不足'"
            type="primary"
            @click="approveTokenFunc(pairsItem.debtToken)"
            >授权</a-button
          >
          <a-button :disabled="!!form.errorText" type="primary" @click="handleOk">确认</a-button>
        </div>
        <div class="deposit-card-footer_text"
          >钱包余额 :
          <a-button type="link">
            {{ $tranNumber(form.balance, 8) }}
          </a-button>
          {{ pairsItem[pairsItem.debtToken].symbol }}</div
        >
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import CardTitle from './CardTitle';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

import {
  repay,
  getAllowance,
  approveToken,
  getBalance,
  getLiquidityAmount,
  getTokenPrices,
} from '../../common/src/back_main';

export default {
  components: { CardTitle, QuestionCircleOutlined },
  props: {
    pairsItem: Object,
  },
  data() {
    return {
      balance: '',
      loading: false,
      scale: '',
      form: {
        amountIn0: 0,
        amountIn1: 0,
        liquidity: 0,
        riskValue: 0,
        pricesLP: 0,
        balance: '',
        amount: '',
        allowance: '',
        errorText: '',
      },
    };
  },
  mounted() {
    this.currentTotalDebt = this.pairsItem[this.pairsItem.debtToken].currentTotalDebt;
    this.dataInit();
  },
  methods: {
    async dataInit() {
      this.loading = true;
      try {
        const debtToken = this.pairsItem.debtToken;
        const address = this.pairsItem[debtToken].address;
        const p1 = await this.getBalanceNum(address);
        const p2 = await this.getAllowanceFunc(address);
        const p3 = await this.getPrices();
        // 同步加载数据
        await Promise.all([p1, p2, p3]);
      } catch (error) {
        console.log('getBalance or getAllowance error');
      } finally {
        this.loading = false;
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
    // 获取lp价格
    async getPrices() {
      this.form.pricesLP = await getTokenPrices('LP');
    },
    switchScale(scale) {
      this.form.amount = this.currentTotalDebt * scale;
      this.updateAmount();
    },
    updateAmount() {
      this.scale = this.form.amount / this.currentTotalDebt;
      let err = '';
      if (this.form.amount === '' || +this.form.amount === 0) {
        err = `不能为空或零`;
      } else if (!+this.form.amount) {
        err = `只能为数字`;
      } else if (this.form.amount > +this.currentTotalDebt) {
        err = `不能大于当前总负债`;
      } else if (this.form.amount > +this.form.balance) {
        err = `钱包余额不足`;
      } else if (this.form.amount > +this.form.allowance) {
        err = `授权额度不足`;
      }
      this.form.errorText = err;
      this.getLiquidityAmountFunc();
    },
    async handleOk() {
      if (!this.form.errorText) {
        const token_address = this.pairsItem[this.pairsItem.debtToken].address;
        const amount = this.form.amount || this.currentTotalDebt;
        this.loading = true;
        repay(this.pairsItem.pairAddress, token_address, amount, (code, msg) => {
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
    async getLiquidityAmountFunc() {
      const amountA = this.pairsItem.debtToken === 'tokenA' ? this.form.amount : 0;
      const amountB = this.pairsItem.debtToken === 'tokenB' ? this.form.amount : 0;
      if (!this.form.errorText) {
        const res = await getLiquidityAmount(
          this.pairsItem.tokenA.address,
          this.pairsItem.tokenB.address,
          amountA || 0,
          amountB || 0
        );
        this.form = { ...this.form, ...res.data };
        // 还贷后风险值
        // (当前负债-还的)/((当前总资产*清仓线)
        // 当前负债-还的
        const token = this.pairsItem.debtToken;
        const num1 = (this.currentTotalDebt - this.form.amount) * this.pairsItem[token].prices;
        // 当前总资产
        const num2 = +this.pairsItem[token].currentTotalAsset * this.pairsItem.LP;
        this.form.riskValue = (num1 / (num2 * +this.pairsItem.tokenA.clearLine)) * 100;
      }
    },
    // 授权
    approveTokenFunc(token) {
      this.loading = true;
      approveToken(this.pairsItem[token].address, async (code, msg) => {
        console.log('approve result ', code, msg);
        if (code === 1) {
          await this.dataInit();
          this.updateAmount();
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