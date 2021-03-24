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
          name: '撤资',
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
          <div>撤资比例 : </div>
          <div style="flex: 1; margin-left: 10px">
            <a-input
              suffix="%"
              v-model:value="form.radio"
              :placeholder="100"
              @change="updateAmount()"
            />
            <div class="error-text">{{ form.errorText }}</div>
            <div class="select-percentage">
              <a-button
                size="small"
                @click="form.radio = 25"
                :class="{ active: form.radio === 25 }"
              >
                25%
              </a-button>
              <a-button
                size="small"
                @click="form.radio = 50"
                :class="{ active: form.radio === 50 }"
              >
                50%
              </a-button>
              <a-button
                size="small"
                @click="form.radio = 75"
                :class="{ active: form.radio === 75 }"
              >
                75%
              </a-button>
              <a-button
                size="small"
                @click="form.radio = 100"
                :class="{ active: form.radio === 100 }"
              >
                100%
              </a-button>
            </div>
          </div>
        </div>
        <div class="line-h-40">
          撤资资产 :
          {{ $tranNumber((pairsItem[pairsItem.debtToken].supplyNumberA * form.radio) / 100, 4) }}
          {{ pairsItem.tokenA.symbol }} +
          {{ $tranNumber((pairsItem[pairsItem.debtToken].supplyNumberB * form.radio) / 100, 4) }}
          {{ pairsItem.tokenB.symbol }}
        </div>
        <div class="line-h-40">
          撤资后负债 :
          {{ (pairsItem[pairsItem.debtToken].currentTotalDebt * (100 - form.radio)) / 100 }}
          {{ pairsItem[pairsItem.debtToken].symbol }}
        </div>
        <div class="line-h-40">
          撤资资产选择
          <a-tooltip placement="top">
            <template #title>
              <span>默认按照交易滑点最小的规则返还剩余资产</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          :
          <div class="select-percentage" style="display: contents">
            <a-button
              size="small"
              @click="(form.type = 'default'), getDivestAmountFunc()"
              :class="{ active: form.type === 'default' }"
            >
              默认
            </a-button>
            <a-button
              size="small"
              @click="(form.type = 'tokenA'), getDivestAmountFunc()"
              :class="{ active: form.type === 'tokenA' }"
            >
              {{ pairsItem.tokenA.symbol }}
            </a-button>
            <a-button
              size="small"
              @click="(form.type = 'tokenB'), getDivestAmountFunc()"
              :class="{ active: form.type === 'tokenB' }"
            >
              {{ pairsItem.tokenB.symbol }}
            </a-button>
          </div>
        </div>
        <div class="line-h-40">
          预计撤资收回资产
          <a-tooltip placement="top">
            <template #title>
              <span>完成相应比例的借款+利息还款后剩余资产。</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          : {{ $tranNumber(form.amount0, 4) }}{{ pairsItem.tokenA.symbol }} +
          {{ $tranNumber(form.amount1, 0) }}
          {{ pairsItem.tokenB.symbol }}
        </div>
      </div>
      <div class="deposit-card-footer">
        <a-button :disabled="!!form.errorText" type="primary" @click="handleOk">确认</a-button>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import CardTitle from './CardTitle';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

import { divest, getLiquidityAmount, getDivestAmount } from '../../common/src/back_main';

export default {
  components: { CardTitle, QuestionCircleOutlined },
  props: {
    pairsItem: Object,
  },
  data() {
    return {
      loading: false,
      form: {
        amount0: 0,
        amount1: 0,
        liquidity: 0,
        type: 'tokenA',
        radio: 100,
        errorText: '',
      },
    };
  },
  async mounted() {
    this.getDivestAmountFunc();
  },
  methods: {
    async getDivestAmountFunc() {
      // token0,token1,deptToken,receiveToken,token0Amount,token1Amount,divestAmount
      const debtToken = this.pairsItem.debtToken;
      const address = '0x0000000000000000000000000000000000000000';
      const receiveToken =
        this.form.type === 'default' ? address : this.pairsItem[this.form.type].address;
      const currentTotalDebt =
        +this.pairsItem[debtToken].currentTotalDebt + +this.pairsItem[debtToken].interest;

      console.log(
        this.pairsItem.tokenA.address,
        this.pairsItem.tokenB.address,
        this.pairsItem[debtToken].address,
        receiveToken,
        (this.pairsItem[debtToken].supplyNumberA * this.form.radio) / 100,
        (this.pairsItem[debtToken].supplyNumberB * this.form.radio) / 100,
        (currentTotalDebt * this.form.radio) / 100
      );
      const res = await getDivestAmount(
        this.pairsItem.tokenA.address,
        this.pairsItem.tokenB.address,
        this.pairsItem[debtToken].address,
        receiveToken,
        (this.pairsItem[debtToken].supplyNumberA * this.form.radio) / 100,
        (this.pairsItem[debtToken].supplyNumberB * this.form.radio) / 100,
        (currentTotalDebt * this.form.radio) / 100
      );
      Object.assign(this.form, res.data);
      console.log(res);
    },
    updateAmount() {
      let err = '';
      if (this.form.radio === '' || +this.form.radio === 0) {
        err = `不能为空或零`;
      } else if (!+this.form.radio) {
        err = `只能为数字`;
      }
      this.form.errorText = err;
      this.getLiquidityAmountFunc();
      this.getDivestAmountFunc();
    },
    async handleOk() {
      if (!this.form.errorText) {
        // 选择默认时,给一个非tokenA和B的地址
        const address = '0x0000000000000000000000000000000000000000';
        const token_address =
          this.form.type === 'default' ? address : this.pairsItem[this.form.type].address;
        this.loading = true;
        divest(
          this.pairsItem.pairAddress,
          this.form.radio,
          this.pairsItem[this.pairsItem.debtToken].address,
          token_address,
          Math.floor(+new Date() / 1000) + '',
          (code, msg) => {
            //  0 小狐狸提交成功
            //  1 区块链确认成功
            console.log('divest err---->', code, msg);
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
    // 撤资拆分
    async getLiquidityAmountFunc() {
      const amountA =
        this.pairsItem.debtToken === 'tokenA'
          ? (this.pairsItem.tokenA.currentTotalAsset * this.form.radio) / 100
          : 0;
      const amountB =
        this.pairsItem.debtToken === 'tokenB'
          ? (this.pairsItem.tokenB.currentTotalAsset * this.form.radio) / 100
          : 0;
      if (!this.form.errorText) {
        const res = await getLiquidityAmount(
          this.pairsItem.tokenA.address,
          this.pairsItem.tokenB.address,
          amountA || 0,
          amountB || 0
        );
        this.form = { ...this.form, ...res.data };
      }
    },
  },
};
</script>