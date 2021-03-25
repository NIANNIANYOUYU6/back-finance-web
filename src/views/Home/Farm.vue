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
  <a-modal class="deposit-card home-card" visible @cancel="$emit('close')" width="520px">
    <template #title>
      <CardTitle
        :title="{
          swapperName: pairsItem.swapperName,
          tokenA: pairsItem.symbol0,
          tokenB: pairsItem.symbol1,
          name: '挖矿',
        }"
      />
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <div class="line-h-40"> 投资资产: </div>
        <div style="display: flex">
          <img class="icon" :src="'./img/icon/' + pairsItem.symbol0 + '.png'" />
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
          <img class="icon" :src="'./img/icon/' + pairsItem.symbol1 + '.png'" />
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
        <div class="line-h-40 disp-f">
          <div>
            杠杆
            <a-tooltip placement="top">
              <template #title>
                <span
                  >杠杆值为1x时默认没有借贷，当杠杆值＞1x时，BACK会根据投资的本金金额借贷相应金额一起投入到选中的矿池中，因此你可以获得更高的流动性挖矿收益。</span
                >
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
            :
          </div>
          <div style="flex: 1">
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
        <div class="line-h-40 disp-f_jusc-sb">
          <div> 借贷币种 : </div>
          <div>
            <a-radio-group v-model:value="form.debtToken" @change="getInvestInfo()">
              <a-radio value="0">{{ pairsItem.symbol0 }}</a-radio>
              <a-radio value="1">{{ pairsItem.symbol1 }}</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="line-h-40 disp-f_jusc-sb">
          <div> 借贷 : </div>
          <div
            >{{ $tranNumber(form.investInfo.amountBorrow, 4) }}
            {{ pairsItem['symbol' + form.debtToken] }}</div
          >
        </div>
        <div
          v-if="form.investInfo.amountBorrow > form.investInfo['remainAmount' + form.debtToken]"
          class="error-text"
          style="text-align: end"
          >剩余可借不足(剩余{{
            $tranNumber(form.investInfo['remainAmount' + form.debtToken], 4)
          }})</div
        >
        <div class="line-h-40 disp-f_jusc-sb">
          <div style="min-width: 125px">
            投资资产转化为
            <a-tooltip placement="top">
              <template #title>
                <span>根据当前交易所价格预计投入的矿池交易对数量</span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
            :
          </div>
          <div>
            {{ $tranNumber(form.investInfo.amountIn0, 4) }} {{ pairsItem.symbol0 }} +
            {{ $tranNumber(form.investInfo.amountIn1, 4) }}{{ pairsItem.symbol1 }}
          </div>
        </div>
        <div class="line-h-40 disp-f_jusc-sb">
          <div>
            风险值
            <a-tooltip placement="top">
              <template #title>
                <span>当前负债/当前总资产*清仓线</span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
            :
          </div>
          <div>
            <!-- 当前负债/当前总资产*清仓线 -->
            {{ $tranNumber(form.investInfo.healthy * 100, 2) }}%
          </div>
        </div>
        <div class="line-h-40 disp-f_jusc-sb" style="border-top: 1px solid #ccc">
          <div> 收益率APY : </div>
          <div>
            <!-- 流动性挖矿APY * 杠杆率+平台挖矿APY-借款APY -->
            {{
              $tranNumber(
                (pairsItem.liquidityAPY * form.debtRatio +
                  form.investInfo['platformAPY' + form.debtToken] -
                  form.investInfo.interestAPY) *
                  100,
                2
              )
            }}%
          </div>
        </div>
        <div class="line-h-40 disp-f_jusc-sb">
          <div>
            流动性挖矿APY
            <a-tooltip placement="top">
              <template #title>
                <span> 交易所流动性挖矿收益，可以随时在账户持仓列表中提取和复投。</span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
            :
          </div>
          <div> {{ $tranNumber(pairsItem.liquidityAPY * 100, 2) }}% </div>
        </div>
        <div class="line-h-40 disp-f_jusc-sb">
          <div>
            平台奖励APY
            <a-tooltip placement="top">
              <template #title>
                <span></span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
            :
          </div>
          <div> {{ $tranNumber(form.investInfo['platformAPY' + form.debtToken] * 100, 2) }}% </div>
        </div>
        <div class="line-h-40 disp-f_jusc-sb">
          <div> 借贷APY : </div>
          <div> {{ $tranNumber(form.investInfo.interestAPY * 100, 2) }} % </div>
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
                  ? '0'
                  : !form.tokenB.allowance || form.tokenB.errorText === '授权额度不足'
                  ? '1'
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
              !!form.tokenB.errorText ||
              (!+form.tokenA.amount && !+form.tokenB.amount) ||
              form.investInfo.amountBorrow > form.investInfo['remainAmount' + form.debtToken]
            "
            type="primary"
            @click="handleOk"
            >开始挖矿{{ form.debtRatio }}x</a-button
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
import { lever } from '../../common/const.js';
import {
  invest,
  getAllowance,
  approveToken,
  getBalance,
  getTokenPrices,
  getInvestInfo,
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
          prices: '',
          balance: '',
          scale: '',
          errorText: '',
          amount: '', // A数量
          allowance: '', // 授权额度
        },
        tokenB: {
          prices: '',
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
      this.loading = true;
      try {
        const addressA = this.pairsItem.token0;
        const addressB = this.pairsItem.token1;
        const p1 = await this.getBalanceNum('tokenA', addressA);
        const p2 = await this.getBalanceNum('tokenB', addressB);
        const p3 = await this.getAllowanceFunc('tokenA', addressA);
        const p4 = await this.getAllowanceFunc('tokenB', addressB);
        const p5 = await this.getPrices('tokenA');
        const p6 = await this.getPrices('tokenB');

        // 同步加载数据
        await Promise.all([p1, p2, p3, p4, p5, p6]);
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
    // 获取价格
    async getPrices(token) {
      this.form[token].prices = await getTokenPrices(this.pairsItem[token].symbol);
    },
    switchScale(type, scale) {
      this.form[type].amount = this.form[type].balance * scale;
      this.updateAmount(type);
    },
    updateAmount(type) {
      this.form[type].scale = this.form[type].amount / this.form[type].balance;
      let err = '';
      if (!+this.form[type].amount && this.form[type].amount != 0) {
        err = `只能为数字`;
      } else if (this.form[type].amount > +this.form[type].balance) {
        err = `钱包余额不足`;
      } else if (this.form[type].amount > +this.form[type].allowance) {
        err = `授权额度不足`;
      }
      this.form[type].errorText = err;
      this.getInvestInfo();
    },
    // 投资信息
    async getInvestInfo() {
      if (
        (this.form.tokenA.amount || this.form.tokenB.amount) &&
        !this.form.tokenA.errorText &&
        !this.form.tokenB.errorText
      ) {
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