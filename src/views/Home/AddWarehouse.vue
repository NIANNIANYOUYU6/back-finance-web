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
          name: '加仓',
        }"
      />
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <div class="line-h-40">
          当前总资产 : {{ $tranNumber(pairsItem[pairsItem.debtToken].supplyNumberA, 4) }}
          {{ pairsItem.tokenA.symbol }} +
          {{ $tranNumber(pairsItem[pairsItem.debtToken].supplyNumberB, 4) }}
          {{ pairsItem.tokenB.symbol }}
        </div>
        <div style="display: flex">
          <img class="icon" :src="'./img/icon/' + pairsItem.tokenA.symbol + '.png'" />
          <div style="flex: 1; margin-left: 10px">
            <a-input
              :suffix="pairsItem.tokenA.symbol"
              v-model:value="form.tokenA.amount"
              :placeholder="$tranNumber(form.tokenA.balance, 8)"
              @change="updateAmount('tokenA')"
            />
            <div class="error-text">{{ form.tokenA.errorText }}</div>
            <div class="select-percentage">
              <a-button
                size="small"
                @click="switchScale('tokenA', 0.25)"
                :class="{ active: form.tokenA.scale === 0.25 }"
              >
                25%
              </a-button>
              <a-button
                size="small"
                @click="switchScale('tokenA', 0.5)"
                :class="{ active: form.tokenA.scale === 0.5 }"
              >
                50%
              </a-button>
              <a-button
                size="small"
                @click="switchScale('tokenA', 0.75)"
                :class="{ active: form.tokenA.scale === 0.75 }"
              >
                75%
              </a-button>
              <a-button
                size="small"
                @click="switchScale('tokenA', 1)"
                :class="{ active: form.tokenA.scale === 1 }"
              >
                100%
              </a-button>
            </div>
          </div>
        </div>
        <div style="display: flex">
          <img class="icon" :src="'./img/icon/' + pairsItem.tokenB.symbol + '.png'" />
          <div style="flex: 1; margin-left: 10px">
            <a-input
              :suffix="pairsItem.tokenB.symbol"
              v-model:value="form.tokenB.amount"
              :placeholder="$tranNumber(form.tokenB.balance, 8)"
              @change="updateAmount('tokenB')"
            />
            <div class="error-text">{{ form.tokenB.errorText }}</div>
            <div class="select-percentage">
              <a-button
                size="small"
                @click="switchScale('tokenB', 0.25)"
                :class="{ active: form.tokenB.scale === 0.25 }"
              >
                25%
              </a-button>
              <a-button
                size="small"
                @click="switchScale('tokenB', 0.5)"
                :class="{ active: form.tokenB.scale === 0.5 }"
              >
                50%
              </a-button>
              <a-button
                size="small"
                @click="switchScale('tokenB', 0.75)"
                :class="{ active: form.tokenB.scale === 0.75 }"
              >
                75%
              </a-button>
              <a-button
                size="small"
                @click="switchScale('tokenB', 1)"
                :class="{ active: form.tokenB.scale === 1 }"
              >
                100%
              </a-button>
            </div>
          </div>
        </div>
        <div class="line-h-40">
          加仓资产转化为
          <a-tooltip placement="top">
            <template #title>
              <span>根据当前交易所价格预计投入的矿池交易对数量</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          : {{ $tranNumber(form.amountIn0, 4) }} {{ pairsItem.tokenA.symbol }} +
          {{ $tranNumber(form.amountIn1, 4) }}{{ pairsItem.tokenB.symbol }}
        </div>
        <div class="line-h-40">
          加仓后总资产 :
          {{ $tranNumber(+form.amountIn0 + +pairsItem[pairsItem.debtToken].supplyNumberA, 4) }}
          {{ pairsItem.tokenA.symbol }} +
          {{ $tranNumber(+form.amountIn1 + +pairsItem[pairsItem.debtToken].supplyNumberB, 4)
          }}{{ pairsItem.tokenB.symbol }}
        </div>
        <!-- 当前负债/当前总资产*清仓线 -->
        <div class="line-h-40" v-if="form.riskValue">
          加仓后风险值 :{{ $tranNumber(form.riskValue, 2) }}
        </div>
      </div>
      <div class="deposit-card-footer">
        <div class="deposit-card-footer_button">
          <!-- 有未授权时可点击 -->
          <!-- 具体授权币种提示 -->
          <a-button
            :disabled="
              form.tokenA.allowance &&
              form.tokenB.allowance &&
              form.tokenA.errorText !== '授权额度不足' &&
              form.tokenB.errorText !== '授权额度不足'
            "
            type="primary"
            @click="
              approveTokenFunc(
                !form.tokenA.allowance || form.tokenA.errorText === '授权额度不足'
                  ? 'tokenA'
                  : !form.tokenB.allowance || form.tokenB.errorText === '授权额度不足'
                  ? 'tokenB'
                  : ''
              )
            "
            >授权</a-button
          >
          <a-button
            :disabled="
              !form.tokenA.allowance ||
              !form.tokenB.allowance ||
              !!form.tokenA.errorText ||
              !!form.tokenB.errorText
            "
            type="primary"
            @click="handleOk"
            >确认</a-button
          >
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import CardTitle from './CardTitle';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

import {
  invest,
  getAllowance,
  approveToken,
  getBalance,
  getLiquidityAmount,
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
        tokenA: {
          balance: '',
          scale: '',
          errorText: '',
          amount: '', // A数量
          allowance: '', // 授权额度
        },
        tokenB: {
          balance: '',
          scale: '',
          errorText: '',
          amount: '', // A数量
          allowance: '', // 授权额度
        },
      },
    };
  },
  mounted() {
    this.dataInit();
  },
  methods: {
    // 数据初始化加载
    async dataInit() {
      this.loading = true;
      try {
        const addressA = this.pairsItem.tokenA.address;
        const addressB = this.pairsItem.tokenB.address;
        const p1 = await this.getBalanceNum('tokenA', addressA);
        const p2 = await this.getBalanceNum('tokenB', addressB);
        const p3 = await this.getAllowanceFunc('tokenA', addressA);
        const p4 = await this.getAllowanceFunc('tokenB', addressB);
        // 同步加载数据
        await Promise.all([p1, p2, p3, p4]);
      } catch (error) {
        console.log('getBalance or getAllowance error');
      } finally {
        this.loading = false;
      }
    },
    // 查询币的余额
    async getBalanceNum(token, address) {
      this.form[token].balance = await getBalance(address);
    },
    async getAllowanceFunc(token, address) {
      // 获取授权额度
      this.form[token].allowance = await getAllowance(address);
    },
    switchScale(type, scale) {
      this.form[type].amount = this.form[type].balance * scale;
      this.updateAmount(type);
    },
    updateAmount(type) {
      this.form[type].scale = this.form[type].amount / this.form[type].balance;
      let err = '';
      if (this.form[type].amount === '') {
        err = `不能为空`;
      } else if (!+this.form[type].amount && +this.form[type].amount !== 0) {
        err = `只能为数字`;
      } else if (this.form[type].amount > +this.form[type].balance) {
        err = `钱包余额不足`;
      } else if (this.form[type].amount > +this.form[type].allowance) {
        err = `授权额度不足`;
      }
      this.form[type].errorText = err;
      this.getLiquidityAmountFunc();
    },
    async handleOk() {
      if (!this.form.tokenA.errorText && !this.form.tokenB.errorText) {
        // 没有错误提醒时提交,数字为钱包余额
        const amountA = this.form.tokenA.amount || 0;
        const amountB = this.form.tokenB.amount || 0;
        this.loading = true;
        invest(
          this.pairsItem.pairAddress,
          amountA,
          amountB,
          this.pairsItem.tokenA.address,
          '0',
          Math.floor(+new Date() / 1000) + '',
          (code, msg) => {
            //  0 小狐狸提交成功
            //  1 区块链确认成功
            console.log('invest ---->', code, msg);
            if (code === 1) {
              this.loading = false;
              this.$emit('close', 'update');
            } else if (code !== 0) {
              // 发生错误时
              message.error(msg);
              this.loading = false;
            }
          }
        );
      }
    },
    // 加仓拆分
    async getLiquidityAmountFunc() {
      if (!this.form.tokenA.errorText && !this.form.tokenB.errorText) {
        if (this.form.tokenA.amount || this.form.tokenB.amount) {
          const res = await getLiquidityAmount(
            this.pairsItem.tokenA.address,
            this.pairsItem.tokenB.address,
            this.form.tokenA.amount || 0,
            this.form.tokenB.amount || 0
          );
          this.form = { ...this.form, ...res.data };
          // 加仓后风险值
          // 当前总负债 / (当前总资产 * 爆仓线)
          const token = this.pairsItem.debtToken;
          // 总负债
          const num1 = +this.pairsItem[token].currentTotalDebt * this.pairsItem[token].prices;
          // 当前总资产
          const num2 =
            (+this.pairsItem[token].currentTotalAsset + +this.form.liquidity) * this.pairsItem.LP;
          this.form.riskValue = (num1 / (num2 * +this.pairsItem.tokenA.clearLine)) * 100;
        }
      }
    },
    // 授权
    approveTokenFunc(token) {
      this.loading = true;
      approveToken(this.pairsItem[token].address, async (code, msg) => {
        console.log('approve result ', code, msg);
        if (code === 1) {
          await this.dataInit();
          this.updateAmount('tokenA');
          this.updateAmount('tokenB');
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