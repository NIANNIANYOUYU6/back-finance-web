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
          name: $t('Operation.add'),
        }"
      />
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <div class="line-h-40">
          {{ $t('Farm.totalAssets') }} : {{ $tranNumber(pairsItem.amount0, 4) }}
          {{ pairsItem.symbol0 }} +
          {{ $tranNumber(pairsItem.amount1, 4) }}
          {{ pairsItem.symbol1 }}
        </div>
        <div style="display: flex">
          <img class="icon" :src="'./assets/' + pairsItem.symbol0 + '.png'" />
          <div style="flex: 1; margin-left: 10px">
            <a-input
              :suffix="pairsItem.symbol0"
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
          <img class="icon" :src="'./assets/' + pairsItem.symbol1 + '.png'" />
          <div style="flex: 1; margin-left: 10px">
            <a-input
              :suffix="pairsItem.symbol1"
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
          {{ $t('Farm.display.add1') }}
          <a-tooltip placement="top">
            <template #title>
              <span> {{ $t('Farm.display.transform') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          : {{ $tranNumber(form.addInfo.amountIn0, 4) }} {{ pairsItem.symbol0 }} +
          {{ $tranNumber(form.addInfo.amountIn1, 4) }}{{ pairsItem.symbol1 }}
        </div>
        <div class="line-h-40">
          {{ $t('Farm.display.add2') }} :
          {{ $tranNumber(form.addInfo.amountAfter0, 4) }}
          {{ pairsItem.symbol0 }} + {{ $tranNumber(form.addInfo.amountAfter1, 4)
          }}{{ pairsItem.symbol1 }}
        </div>
        <div class="line-h-40">
          {{ $t('Farm.display.add3') }} :{{ $tranNumber(form.addInfo.healthy * 100, 2) }}
          <div class="prompt-text" style="line-height: 16px">
            <ExclamationCircleFilled />
            {{ $t('Farm.healthyRemind') }}
          </div>
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
              form.tokenA.errorText !== $t('Prompt.error1') &&
              form.tokenB.errorText !== $t('Prompt.error1')
            "
            type="primary"
            @click="
              approveTokenFunc(
                !form.tokenA.allowance || form.tokenA.errorText === $t('Prompt.error1')
                  ? '0'
                  : !form.tokenB.allowance || form.tokenB.errorText === $t('Prompt.error1')
                  ? '1'
                  : ''
              )
            "
            >{{ $t('Operation.warrant') }}</a-button
          >
          <a-button
            :disabled="
              !form.tokenA.allowance ||
              !form.tokenB.allowance ||
              !!form.tokenA.errorText ||
              !!form.tokenB.errorText ||
              (!+form.tokenA.amount && !+form.tokenB.amount)
            "
            type="primary"
            @click="handleOk"
            >{{ $t('Operation.ok') }}</a-button
          >
        </div>
      </div>
    </a-spin>
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
      this.loading = true;
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