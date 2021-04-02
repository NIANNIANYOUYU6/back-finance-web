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
  <a-modal class="back-modal" visible @cancel="$emit('close')" width="540px">
    <template #title>
      <CardTitle
        :title="{
          swapperName: pairsItem.swapperName,
          tokenA: pairsItem.symbol0,
          tokenB: pairsItem.symbol1,
          name: $t('Operation.farm'),
        }"
      />
    </template>
    <div class="modal-body-content">
      <div class="text-space">
        <span class="text-c"> {{ $t('Farm.farm.farm1') }}</span>
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
          {{ $t('Farm.all.lever') }}
          <a-tooltip placement="top" color="#2b4a77">
            <template #title>
              <span> {{ $t('Farm.all.leverRemind') }}</span>
            </template>
            <QuestionCircleOutlined /> </a-tooltip
        ></span>
        <div style="flex: 1; margin-left: 10px">
          <a-slider
            v-model:value="form.debtRatio"
            :min="1"
            :max="+pairsItem.leverageRate"
            :marks="pairsItem.marks"
            :step="null"
            @change="getInvestInfo()"
          />
        </div>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.borrowSymbol') }}
        </span>
        <a-radio-group v-model:value="form.debtToken" @change="getInvestInfo()">
          <a-radio class="fw-fff" value="0">{{ pairsItem.symbol0 }}</a-radio>
          <a-radio class="fw-fff" value="1">{{ pairsItem.symbol1 }}</a-radio>
        </a-radio-group>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.farm.farm2') }}
        </span>
        <span class="fw-fff">
          {{ $tranNumber(form.investInfo.amountBorrow, 4) }}
          {{ pairsItem['symbol' + form.debtToken] }}
        </span>
      </div>
      <div
        class="text-space"
        v-if="form.investInfo.amountBorrow > form.investInfo['remainAmount' + form.debtToken]"
      >
        <span></span>
        <span class="error-text">
          {{ $t('Farm.farm.farm3') }} ({{ $t('Farm.farm.farm4') }}
          {{ $tranNumber(form.investInfo['remainAmount' + form.debtToken], 4) }})
        </span>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.farm.farm5') }}
          <a-tooltip placement="top" color="#2b4a77">
            <template #title>
              <span>{{ $t('Farm.display.transform') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </span>
        <span class="fw-fff">
          {{ $tranNumber(form.investInfo.amountIn0, 4) }} {{ pairsItem.symbol0 }}
          +
          {{ $tranNumber(form.investInfo.amountIn1, 4) }} {{ pairsItem.symbol1 }}
        </span>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.healthy') }}
        </span>
        <span class="fw-fff">
          {{ $tranNumber(form.investInfo.healthy * 100, 2) }}
        </span>
      </div>
      <div
        v-if="pairsItem?.swapperName?.toLowerCase() === 'Mdex'.toLowerCase()"
        class="prompt-text"
        style="line-height: 16px; margin-bottom: 10px"
      >
        <ExclamationCircleFilled />
        {{ $t('Farm.healthyRemind1') }}
      </div>
      <div v-else class="prompt-text" style="line-height: 16px; margin-bottom: 10px">
        <ExclamationCircleFilled />
        {{ $t('Farm.healthyRemind2') }}
      </div>
      <div class="text-space" style="border-top: 1px solid#354375">
        <span class="text-c">
          {{ $t('Farm.all.income') }}
        </span>
        <span class="fw-fff">
          {{
            $tranNumber(
              (pairsItem.liquidityAPY * form.debtRatio +
                form.investInfo['platformAPY' + form.debtToken] -
                form.investInfo.interestAPY) *
                100,
              2
            )
          }}%
        </span>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.farm.liquidityAPY') }}
          <a-tooltip placement="top" color="#2b4a77">
            <template #title>
              <span> {{ $t('Farm.farm.liquidityAPYRemind') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </span>
        <span class="fw-fff">
          {{ $tranNumber(pairsItem.liquidityAPY * form.debtRatio * 100, 2) }}%
        </span>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.farm.platformAPY') }}
          <a-tooltip placement="top" color="#2b4a77">
            <template #title>
              <span> {{ $t('Farm.farm.platformAPYRemind') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </span>
        <span class="fw-fff">
          {{
            $tranNumber(
              (form.debtRatio - 1) * form.investInfo['platformAPY' + form.debtToken] * 100,
              2
            )
          }}%
        </span>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.farm.remainAmount') }}
        </span>
        <span class="fw-fff">
          {{ $tranNumber((form.debtRatio - 1) * form.investInfo.interestAPY * 100, 2) }} %
        </span>
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
          (!+form.tokenA.amount && !+form.tokenB.amount) ||
          form.investInfo.amountBorrow > form.investInfo['remainAmount' + form.debtToken]
        "
        type="primary"
        @click="handleOk"
        >{{ $t('Farm.farm.farm6') }} {{ form.debtRatio }}x</a-button
      >
    </div>
  </a-modal>
</template>
<script>
import CardTitle from './CardTitle';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue';
import { lever } from '../../common/const.js';
import {
  invest,
  getAllowance,
  approveToken,
  getBalance,
  getInvestInfo,
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
      marks: {},
      form: {
        debtRatio: '',
        debtToken: '',
        investInfo: {
          amountBorrow: 0,
          amountIn0: 0,
          amountIn1: 0,
          healthy: 0,
          interestAPY: 0,
          platformAPY0: 0,
          platformAPY1: 0,
          remainAmount0: 0,
          remainAmount1: 0,
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
    this.form.debtRatio = this.pairsItem.debtRatio;
    this.form.debtToken = this.pairsItem.debtToken;
    this.marks = lever[this.pairsItem.leverageRate];
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
        const p5 = await this.getInvestInfo();

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
      console.log(this.form[token].allowance);
    },
    switchScale(type, scale) {
      this.form[type].amount = this.form[type].balance * scale;
      this.updateAmount(type);
    },
    updateAmount(type) {
      this.form[type].scale = this.form[type].amount / this.form[type].balance;
      let err = '';
      if (!+this.form[type].amount && this.form[type].amount != 0) {
        err = this.$t('Prompt.error3');
      } else if (this.form[type].amount > +this.form[type].balance) {
        err = this.$t('Prompt.error2');
      } else if (this.form[type].amount > +this.form[type].allowance) {
        err = this.$t('Prompt.error1');
      }
      this.form[type].errorText = err;
      this.getInvestInfo();
    },
    // 投资信息
    async getInvestInfo() {
      if (!this.form.tokenA.errorText && !this.form.tokenB.errorText) {
        const borrowToken = this.pairsItem['token' + this.form.debtToken];
        console.log(
          'getInvestInfo参数--》',
          this.pairsItem.address,
          +this.form.tokenA.amount,
          +this.form.tokenB.amount,
          borrowToken,
          this.form.debtRatio
        );
        const res = await getInvestInfo(
          this.pairsItem.address,
          +this.form.tokenA.amount,
          +this.form.tokenB.amount,
          borrowToken,
          this.form.debtRatio
        );
        console.log(res);
        this.form.investInfo = res;
      }
    },
    async handleOk() {
      this.updateAmount('tokenA');
      this.updateAmount('tokenB');
      if (!this.form.tokenA.errorText && !this.form.tokenB.errorText) {
        // 没有错误提醒时提交,数字为钱包余额
        const amountA = +this.form.tokenA.amount || 0;
        const amountB = +this.form.tokenB.amount || 0;
        const debtToken_address = this.pairsItem['token' + this.form.debtToken];
        this.loading = true;
        console.log(
          this.pairsItem.address,
          amountA,
          amountB,
          debtToken_address,
          this.form.investInfo.amountBorrow,
          Math.floor(+new Date() / 1000) + ''
        );
        invest(
          this.pairsItem.address,
          amountA,
          amountB,
          debtToken_address,
          this.form.investInfo.amountBorrow,
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