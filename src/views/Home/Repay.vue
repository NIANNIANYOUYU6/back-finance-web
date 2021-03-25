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
          swapperName: pairsItem.swapperName,
          tokenA: pairsItem.symbol0,
          tokenB: pairsItem.symbol1,
          name: '还贷',
        }"
      />
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <div class="line-h-40">
          当前总负债 :
          {{
            $tranNumber(pairsItem.debtAmount, 4) +
            pairsItem.borrowSymbol +
            '+' +
            $tranNumber(pairsItem.debtInterest, 4) +
            pairsItem.borrowSymbol
          }}
        </div>
        <div style="display: flex">
          <span>还贷</span>
          <div style="flex: 1; margin-left: 10px">
            <a-input
              :suffix="pairsItem.borrowSymbol"
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
          还贷数量 :
          {{
            $tranNumber(form.borrowRepay, 4) +
            pairsItem.borrowSymbol +
            '+' +
            $tranNumber(form.interestRepay, 4) +
            pairsItem.borrowSymbol
          }}
        </div>
        <div class="line-h-40">
          还贷后负债 :
          {{
            $tranNumber(form.borrowRemain, 4) +
            pairsItem.borrowSymbol +
            '+' +
            $tranNumber(form.interestRemain, 4) +
            pairsItem.borrowSymbol
          }}
        </div>
        <div class="line-h-40">
          还贷后风险值
          <a-tooltip placement="top">
            <template #title>
              <span> 请注意：当风险值超过100时，资产将会被清算。</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          : {{ $tranNumber(form.health * 100, 2) }}
        </div>
      </div>
      <div class="deposit-card-footer">
        <div class="deposit-card-footer_button">
          <a-button
            :disabled="form.allowance && form.errorText !== '授权额度不足'"
            type="primary"
            @click="approveTokenFunc()"
            >授权</a-button
          >
          <a-button :disabled="!!form.errorText" type="primary" @click="handleOk">确认</a-button>
        </div>
        <div class="deposit-card-footer_text"
          >钱包余额 :
          <a-button type="link">
            {{ $tranNumber(form.balance, 8) }}
          </a-button>
          {{ pairsItem.borrowSymbol }}</div
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
  getRepayInfo,
} from '../../common/src/back_main';

export default {
  components: { CardTitle, QuestionCircleOutlined },
  props: {
    pairsItem: Object,
    onClose: Function,
  },
  data() {
    return {
      balance: '',
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
      this.loading = true;
      try {
        this.currentTotalDebt = this.pairsItem.debtAmount + this.pairsItem.debtInterest;
        const address = this.pairsItem.borrowToken;
        const p1 = await this.getBalanceNum(address);
        const p2 = await this.getAllowanceFunc(address);

        // 同步加载数据
        await Promise.all([p1, p2, this.getRepayInfo()]);
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
    // getRepayInfo(pairAddress, borrowToken, amountRepay) {

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