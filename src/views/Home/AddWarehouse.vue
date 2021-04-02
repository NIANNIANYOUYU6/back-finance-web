<style lang='scss' >
</style>
<template>
  <a-modal class="back-modal" visible @cancel="$emit('close')">
    <template #title>
      <CardTitle
        :title="{
          swapperName: pairsItem.swapperName,
          tokenA: pairsItem.symbol0,
          tokenB: pairsItem.symbol1,
          name: $t('Operation.add'),
        }"
      />
    </template>

    <div class="modal-body-content">
      <div class="text-space">
        <span class="text-c"> {{ $t('Farm.totalAssets') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(pairsItem.amount0, 4) }} {{ pairsItem.symbol0 }}
          +
          {{ $tranNumber(pairsItem.amount1, 4) }} {{ pairsItem.symbol1 }}</span
        >
      </div>
      <div class="text-space">
        <span class="text-c"> {{ $t('Operation.add') }}</span>
      </div>
      <a-input
        class="modal-input"
        :suffix="pairsItem.symbol0"
        v-model:value="form.tokenA.amount"
        :placeholder="$tranNumber(form.tokenA.balance, 8)"
        @change="updateAmount('tokenA')"
      >
        <template #prefix>
          <img style="height: 20px" :src="'./assets/' + pairsItem.symbol0 + '.png'" />
        </template>
      </a-input>
      <div class="error-text">{{ form.tokenA.errorText }}</div>
      <a-radio-group
        class="back-radio-group"
        v-model:value="form.tokenA.scale"
        button-style="solid"
        @change="switchScale('tokenA', form.tokenA.scale)"
      >
        <a-radio-button :value="0.25">25%</a-radio-button>
        <a-radio-button :value="0.5">50%</a-radio-button>
        <a-radio-button :value="0.75">75%</a-radio-button>
        <a-radio-button :value="1">100%</a-radio-button>
      </a-radio-group>
      <a-input
        class="modal-input"
        :suffix="pairsItem.symbol1"
        v-model:value="form.tokenB.amount"
        :placeholder="$tranNumber(form.tokenB.balance, 8)"
        @change="updateAmount('tokenB')"
      >
        <template #prefix>
          <img style="height: 20px" :src="'./assets/' + pairsItem.symbol1 + '.png'" />
        </template>
      </a-input>
      <div class="error-text">{{ form.tokenB.errorText }}</div>
      <a-radio-group
        class="back-radio-group"
        v-model:value="form.tokenB.scale"
        button-style="solid"
        @change="switchScale('tokenB', form.tokenB.scale)"
      >
        <a-radio-button :value="0.25">25%</a-radio-button>
        <a-radio-button :value="0.5">50%</a-radio-button>
        <a-radio-button :value="0.75">75%</a-radio-button>
        <a-radio-button :value="1">100%</a-radio-button>
      </a-radio-group>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.display.add1') }}
          <a-tooltip placement="top" color="#2b4a77">
            <template #title>
              <span> {{ $t('Farm.display.transform') }}</span>
            </template>
            <QuestionCircleOutlined /> </a-tooltip
        ></span>
        <span class="fw-fff">
          {{ $tranNumber(form.addInfo.amountIn0, 4) }} {{ pairsItem.symbol0 }}
          +
          {{ $tranNumber(form.addInfo.amountIn1, 4) }} {{ pairsItem.symbol1 }}</span
        >
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.display.add2') }}
        </span>
        <span class="fw-fff">
          {{ $tranNumber(form.addInfo.amountAfter0, 4) }} {{ pairsItem.symbol0 }}
          +
          {{ $tranNumber(form.addInfo.amountAfter1, 4) }} {{ pairsItem.symbol1 }}
        </span>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.display.add3') }}
        </span>
        <span class="fw-fff">{{ $tranNumber(form.addInfo.healthy * 100, 2) }}</span>
      </div>
      <div class="prompt-text" style="line-height: 16px">
        <ExclamationCircleFilled />
        {{ $t('Farm.healthyRemind') }}
      </div>
    </div>
    <div
      class="back-card-footer"
      v-if="
        !initLoading &&
        (+form.tokenA.allowance === 0 ||
          form.tokenA.errorText === $t('Prompt.error1') ||
          +form.tokenB.allowance === 0 ||
          form.tokenB.errorText === $t('Prompt.error1'))
      "
    >
      <a-button
        :loading="loading"
        class="btn-one"
        :disabled="+form.tokenA.allowance !== 0 && form.tokenA.errorText !== $t('Prompt.error1')"
        type="primary"
        @click="approveTokenFunc('0')"
        >{{ $t('Operation.warrant') }} {{ pairsItem.symbol0 }}</a-button
      >
      <a-button
        :loading="loading"
        class="btn-one ml-10"
        :disabled="+form.tokenB.allowance !== 0 && form.tokenB.errorText !== $t('Prompt.error1')"
        type="primary"
        @click="approveTokenFunc('1')"
        >{{ $t('Operation.warrant') }} {{ pairsItem.symbol1 }}</a-button
      >
    </div>
    <div class="back-card-footer">
      <a-button :loading="initLoading" class="btn-one" v-if="initLoading" type="primary"
        >{{ $t('Operation.loading') }}
      </a-button>
      <a-button
        :loading="loading"
        class="btn-one"
        v-else
        :disabled="
          +form.tokenA.allowance === 0 ||
          form.tokenA.errorText === $t('Prompt.error1') ||
          +form.tokenB.allowance === 0 ||
          form.tokenB.errorText === $t('Prompt.error1') ||
          (!+form.tokenA.amount && !+form.tokenB.amount)
        "
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
import { QuestionCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue';

import {
  invest,
  getAllowance,
  approveToken,
  getBalance,
  getAddInfo,
  fetchData,
} from '../../common/src/back_main';

export default {
  components: { CardTitle, QuestionCircleOutlined, ExclamationCircleFilled },
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
      form: {
        amountIn0: 0,
        amountIn1: 0,
        liquidity: 0,
        riskValue: 0,
        addInfo: {
          amountAfter0: 0,
          amountAfter1: 0,
          amountIn0: 0,
          amountIn1: 0,
          healthy: 0,
        },
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
      this.initLoading = true;
      try {
        await fetchData();
        const addressA = this.pairsItem.token0;
        const addressB = this.pairsItem.token1;
        const p1 = await this.getBalanceNum('tokenA', addressA);
        const p2 = await this.getBalanceNum('tokenB', addressB);
        const p3 = await this.getAllowanceFunc('tokenA', addressA);
        const p4 = await this.getAllowanceFunc('tokenB', addressB);
        const p5 = await this.getAddInfo();
        // 同步加载数据
        await Promise.all([p1, p2, p3, p4, p5]);
      } catch (error) {
        console.log('getBalance or getAllowance error');
      } finally {
        this.initLoading = false;
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
      if (!+this.form[type].amount && +this.form[type].amount !== 0) {
        err = this.$t('Prompt.error3');
      } else if (this.form[type].amount > +this.form[type].balance) {
        err = this.$t('Prompt.error2');
      } else if (this.form[type].amount > +this.form[type].allowance) {
        err = this.$t('Prompt.error1');
      }
      this.form[type].errorText = err;
      this.getAddInfo();
    },
    async getAddInfo() {
      console.log(
        '----->参数',
        this.pairsItem.address,
        +this.form.tokenA.amount,
        +this.form.tokenB.amount,
        this.pairsItem.borrowToken
      );
      const res = await getAddInfo(
        this.pairsItem.address,
        +this.form.tokenA.amount,
        +this.form.tokenB.amount,
        this.pairsItem.borrowToken
      );
      this.form.addInfo = res;

      console.log(res);
    },

    async handleOk() {
      if (!this.form.tokenA.errorText && !this.form.tokenB.errorText) {
        // 没有错误提醒时提交,数字为钱包余额
        const amountA = this.form.tokenA.amount;
        const amountB = this.form.tokenB.amount;
        this.loading = true;
        console.log(
          this.pairsItem.address,
          +amountA,
          +amountB,
          this.pairsItem.borrowToken,
          0,
          Math.floor(+new Date() / 1000) + ''
        );
        invest(
          this.pairsItem.address,
          +amountA,
          +amountB,
          this.pairsItem.borrowToken,
          0,
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
    // 授权
    approveTokenFunc(token) {
      this.loading = true;
      approveToken(this.pairsItem['token' + token], async (code, msg) => {
        console.log('approve result ', code, msg);
        if (code === 1) {
          await this.dataInit();
          await Promise.all([this.updateAmount('tokenA'), this.updateAmount('tokenB')]);
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