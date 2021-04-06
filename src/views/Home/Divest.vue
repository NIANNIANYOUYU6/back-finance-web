
<template>
  <a-modal class="back-modal" visible @cancel="$emit('close')">
    <template #title>
      <CardTitle
        :title="{
          swapperName: pairsItem.swapperName,
          tokenA: pairsItem.symbol0,
          tokenB: pairsItem.symbol1,
          name: $t('Operation.divest'),
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
        <span class="text-c">{{ $t('Farm.display.divest1') }}</span>
      </div>
      <a-input-group compact class="model-input-group">
        <a-input-number
          v-model:value="form.radio"
          :min="0"
          :max="100"
          @change="updateAmount()"
          @keydown="(e) => (e.target.value = e.target.value.match(/^\d*(\.?\d{0,7})/g)[0] || null)"
          placeholder="100"
          :precision="8"
        />
        <span class="model-input-suffix">%</span>
      </a-input-group>
      <!-- <a-input
        class="modal-input"
        suffix="%"
        v-model:value="form.radio"
        :placeholder="100"
        @change="updateAmount()"
      /> -->
      <div class="error-text">{{ form.errorText }}</div>
      <a-radio-group
        class="back-radio-group"
        v-model:value="form.radio"
        button-style="solid"
        @change="updateAmount"
      >
        <a-radio-button :value="25">25%</a-radio-button>
        <a-radio-button :value="50">50%</a-radio-button>
        <a-radio-button :value="75">75%</a-radio-button>
        <a-radio-button :value="100">100%</a-radio-button>
      </a-radio-group>
      <div class="text-space">
        <span class="text-c"> {{ $t('Farm.display.divest2') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(form.amount0, 4) }} {{ pairsItem.symbol0 }}
          +
          {{ $tranNumber(form.amount1, 4) }} {{ pairsItem.symbol1 }}
          <a-tooltip placement="top" color="#2b4a77">
            <template #title>
              <span>
                {{ $t('Farm.debt') }} :{{
                  $tranNumber(form.amountToPay, 4) + pairsItem.borrowSymbol
                }}+ {{ $tranNumber(form.interestToPay, 4) + pairsItem.borrowSymbol }}</span
              >
            </template>
            <QuestionCircleOutlined /> </a-tooltip
        ></span>
      </div>
      <div class="text-space">
        <span class="text-c" style="line-height: 54px">
          {{ $t('Farm.display.divest3') }}
          <a-tooltip color="#2b4a77" placement="top">
            <template #title>
              <span> {{ $t('Farm.display.divest3Remind') }}</span>
            </template>
            <QuestionCircleOutlined /> </a-tooltip
        ></span>
        <a-radio-group
          class="back-radio-group"
          v-model:value="form.type"
          button-style="solid"
          @change="getDivestInfo"
        >
          <a-radio-button value="default">{{ $t('Farm.display.default') }}</a-radio-button>
          <a-radio-button value="0">{{ pairsItem.symbol0 }}</a-radio-button>
          <a-radio-button value="1">{{ pairsItem.symbol1 }}</a-radio-button>
        </a-radio-group>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.display.divest4')
          }}<a-tooltip color="#2b4a77" placement="top">
            <template #title>
              <span> {{ $t('Farm.display.divest4Remind') }}。</span>
            </template>
            <QuestionCircleOutlined /> </a-tooltip
        ></span>
        <span class="fw-fff">
          {{ $tranNumber(form.amountOut0, 4) }} {{ pairsItem.symbol0 }}
          +
          {{ $tranNumber(form.amountOut1, 4) }} {{ pairsItem.symbol1 }}
        </span>
      </div>
    </div>
    <div class="back-card-footer">
      <a-button
        :loading="loading"
        class="btn-one"
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
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

import { divest, getDivestInfo } from '../../common/src/back_main';

export default {
  components: { CardTitle, QuestionCircleOutlined },
  props: {
    pairsItem: Object,
    onClose: Function,
  },
  data() {
    return {
      loading: false,
      form: {
        amount0: 0,
        amount1: 0,
        type: 'default',
        radio: 100,
        errorText: '',
        amountOut0: 0,
        amountOut1: 0,
        amountToPay: 0, //偿还负债本金,
        interestToPay: 0, // 偿还负债利息,
        amountBorrowAfter: 0,
        interestAfter: 0,
      },
    };
  },
  async mounted() {
    this.getDivestInfo();
  },
  methods: {
    async getDivestInfo() {
      const address = '0x0000000000000000000000000000000000000000';
      const receiveToken =
        this.form.type === 'default' ? address : this.pairsItem['token' + this.form.type];
      const res = await getDivestInfo(
        this.pairsItem.address,
        this.form.radio / 100,
        this.pairsItem.borrowToken,
        receiveToken
      );
      console.log(res);
      Object.assign(this.form, res);
    },
    updateAmount() {
      let err = '';
      if (this.form.radio === '' || +this.form.radio === 0) {
        err = this.$t('Prompt.error4');
      } else if (+this.form.radio > 100) {
        err = this.$t('Prompt.error7');
      }
      this.form.errorText = err;
      this.getDivestInfo();
    },
    async handleOk() {
      if (!this.form.errorText) {
        // 选择默认时,给一个非tokenA和B的地址
        const address = '0x0000000000000000000000000000000000000000';
        const token_address = this.pairsItem['token' + this.form.type] || address;
        this.loading = true;
        console.log(
          '-->',
          this.pairsItem.address,
          +this.form.radio,
          this.pairsItem.borrowToken,
          token_address,
          Math.floor(+new Date() / 1000) + ''
        );
        divest(
          this.pairsItem.address,
          +this.form.radio,
          this.pairsItem.borrowToken,
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
  },
};
</script>