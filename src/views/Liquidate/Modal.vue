
<template>
  <a-modal class="back-modal" visible @cancel="$emit('close')" width="460px">
    <template #title>
      <CardTitle
        :title="{
          swapperName: pairsItem.swapperName,
          tokenA: pairsItem.symbol0,
          tokenB: pairsItem.symbol1,
          name: $t('Operation.liquidate'),
        }"
      />
    </template>
    <div class="modal-body-content">
      <div class="text-space">
        <span class="text-c"> {{ $t('Liquidate.liquidateTotal') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(pairsItem.lpAmount, 4) }} LP
          <a-tooltip placement="right" color="#5C5CE6">
            <template #title>
              {{ $t('Farm.lp') }}:
              <span>{{
                $tranNumber(pairsItem.amount0, 4) +
                pairsItem.symbol0 +
                '+' +
                $tranNumber(pairsItem.amount1, 4) +
                pairsItem.symbol1
              }}</span>
            </template>
            <InfoCircleOutlined />
          </a-tooltip>
        </span>
      </div>
      <div class="text-space">
        <span class="text-c"> {{ $t('Liquidate.totalDebt') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(pairsItem.borrowAmount, 4) }} {{ pairsItem.borrowSymbol }}
          +
          {{ $tranNumber(pairsItem.borrowInterest, 8) }} {{ pairsItem.borrowSymbol }}</span
        >
      </div>
      <div class="text-space">
        <span class="text-c">{{ $t('Liquidate.liquidate1') }}</span>
        <span class="fw-fff"> {{ $tranNumber(pairsItem.discount * 100, 2) }} % </span>
      </div>
      <div class="text-space">
        <span class="text-c">{{ $t('Liquidate.liquidate2') }}</span>
      </div>
      <a-input
        class="modal-input"
        suffix="%"
        v-model:value="form.radio"
        :placeholder="100"
        @change="updateAmount()"
      />
      <div class="error-text">{{ form.errorText }}</div>
      <a-radio-group
        class="back-radio-group"
        v-model:value="form.radio"
        button-style="solid"
        @change="updateAmount()"
      >
        <a-radio-button :value="25">25%</a-radio-button>
        <a-radio-button :value="50">50%</a-radio-button>
        <a-radio-button :value="75">75%</a-radio-button>
        <a-radio-button :value="100">100%</a-radio-button>
      </a-radio-group>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Liquidate.liquidate3') }}
          <a-tooltip placement="right" color="#5C5CE6">
            <template #title>
              {{ $t('Liquidate.liquidate3Remind') }}
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </span>
        <span class="fw-fff">
          {{ $tranNumber((pairsItem.debtAmount * pairsItem.discount * form.radio) / 100, 4) }}
          {{ pairsItem.borrowSymbol }}
        </span>
      </div>
      <div class="text-space">
        <span class="text-c"> {{ $t('Liquidate.liquidate4') }}</span>
        <span class="fw-fff">
          {{ $tranNumber((pairsItem.lpAmount * form.radio) / 100, 8) }} LP</span
        >
      </div>
      <div class="text-space" style="margin-top: 10px">
        <span class="text-c"> {{ $t('Sidebar.balance') }}</span>
        <span class="fw-fff"> {{ $tranNumber(form.balance, 8) }} {{ pairsItem.borrowSymbol }}</span>
      </div>
    </div>
    <div class="back-card-footer" v-if="initLoading">
      <a-button :loading="initLoading" class="btn-one" type="primary"
        >{{ $t('Operation.loading') }}
      </a-button>
    </div>
    <div class="back-card-footer" v-else>
      <a-button
        :loading="loading"
        class="btn-one"
        :disabled="form.allowance !== 0 && form.errorText !== $t('Prompt.error1')"
        type="primary"
        @click="approveTokenFunc"
        >{{ $t('Operation.warrant') }} {{ pairsItem.borrowSymbol }}</a-button
      >
      <a-button
        :loading="loading"
        class="btn-one ml-10"
        :disabled="
          form.allowance === 0 || form.errorText === $t('Prompt.error1') || !!form.errorText
        "
        type="primary"
        @click="handleOk"
        >{{ $t('Operation.ok') }}</a-button
      >
    </div>
  </a-modal>
</template>
<script>
import CardTitle from '../Home/CardTitle';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';

import {
  fetchData,
  getAllowance,
  approveToken,
  getBalance,
  liquidate,
} from '../../common/src/back_main';

export default {
  components: { CardTitle, QuestionCircleOutlined, InfoCircleOutlined },
  props: {
    pairsItem: Object,
    onClose: Function,
  },
  data() {
    return {
      initLoading: false,
      loading: false,
      form: {
        radio: '',
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
        const address = this.pairsItem.borrowToken;
        const p1 = await this.getBalanceNum(address);
        const p2 = await this.getAllowanceFunc(address);
        // 同步加载数据
        await Promise.all([p1, p2]);
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
      console.log(this.form.allowance);
    },
    updateAmount() {
      let err = '';
      if (this.form.radio === '' || +this.form.radio === 0) {
        err = this.$t('Prompt.error4');
      } else if (+this.form.radio > 100) {
        err = this.$t('Prompt.error7');
      } else if (
        (this.pairsItem.debtAmount * this.pairsItem.discount * this.form.radio) / 100 >
        +this.form.allowance
      ) {
        err = this.$t('Prompt.error1');
      }
      this.form.errorText = err;
    },
    async handleOk() {
      if (!this.form.errorText) {
        this.loading = true;
        console.log(
          this.pairsItem.pair,
          this.pairsItem.owner,
          this.pairsItem.borrowToken,
          this.form.radio / 100
        );
        liquidate(
          this.pairsItem.pair,
          this.pairsItem.owner,
          this.pairsItem.borrowToken,
          this.form.radio / 100,
          (code, msg) => {
            //  0 小狐狸提交成功
            //  1 区块链确认成功
            console.log('liquidate ---->', code, msg);
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