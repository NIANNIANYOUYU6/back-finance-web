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
          name: '撤资',
        }"
      />
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <div class="line-h-40">
          当前总资产 : {{ $tranNumber(pairsItem.amount0, 4) }} {{ pairsItem.symbol0 }} +
          {{ $tranNumber(pairsItem.amount1, 4) }}
          {{ pairsItem.symbol1 }}
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
                @click="(form.radio = 25), getDivestInfo()"
                :class="{ active: form.radio === 25 }"
              >
                25%
              </a-button>
              <a-button
                size="small"
                @click="(form.radio = 50), getDivestInfo()"
                :class="{ active: form.radio === 50 }"
              >
                50%
              </a-button>
              <a-button
                size="small"
                @click="(form.radio = 75), getDivestInfo()"
                :class="{ active: form.radio === 75 }"
              >
                75%
              </a-button>
              <a-button
                size="small"
                @click="(form.radio = 100), getDivestInfo()"
                :class="{ active: form.radio === 100 }"
              >
                100%
              </a-button>
            </div>
          </div>
        </div>
        <div class="line-h-40">
          撤资资产 :
          {{ $tranNumber(form.amount0, 4) }}
          {{ pairsItem.symbol0 }} +
          {{ $tranNumber(form.amount1, 4) }}
          {{ pairsItem.symbol1 }}
          <a-tooltip placement="top">
            <template #title>
              <span
                >负债 :{{ $tranNumber(form.amountToPay, 4) + pairsItem.borrowSymbol }}+
                {{ $tranNumber(form.interestToPay, 4) + pairsItem.borrowSymbol }}</span
              >
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
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
              @click="(form.type = 'default'), getDivestInfo()"
              :class="{ active: form.type === 'default' }"
            >
              默认
            </a-button>
            <a-button
              size="small"
              @click="(form.type = '0'), getDivestInfo()"
              :class="{ active: form.type === '0' }"
            >
              {{ pairsItem.symbol0 }}
            </a-button>
            <a-button
              size="small"
              @click="(form.type = '1'), getDivestInfo()"
              :class="{ active: form.type === '1' }"
            >
              {{ pairsItem.symbol1 }}
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
          : {{ $tranNumber(form.amountOut0, 4) }}{{ pairsItem.symbol0 }} +
          {{ $tranNumber(form.amountOut1, 4) }}
          {{ pairsItem.symbol1 }}
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
      Object.assign(this.form, res);
    },
    updateAmount() {
      let err = '';
      if (this.form.radio === '' || +this.form.radio === 0) {
        err = `不能为空或零`;
      } else if (+this.form.radio > 100) {
        err = `比例最多为100%`;
      } else if (!+this.form.radio) {
        err = `只能为数字`;
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