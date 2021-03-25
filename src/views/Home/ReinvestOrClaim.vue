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
          name: '复投/收获',
        }"
      />
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <div class="line-h-40">
          挖矿收益 :
          {{ $tranNumber(pairsItem.pendingReward, 4) }}
          {{ pairsItem.rewardSymbol }}
        </div>
        <div class="line-h-40">
          复投仓位拆分明细
          <a-tooltip placement="top">
            <template #title>
              <span>根据当前交易所价格预计投入的矿池交易对数量</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          :{{ $tranNumber(form.amount0, 4) }} {{ pairsItem.symbol0 }} +
          {{ $tranNumber(form.amount1, 4) }} {{ pairsItem.symbol1 }}
        </div>
        <!-- <div class="line-h-40"> 复投后风险值 : </div>
        <div class="line-h-40 prompt-text">
          <ExclamationCircleFilled />
          请注意:当风险值超过100时,资产将会被清算
        </div> -->
      </div>

      <div class="deposit-card-footer">
        <div class="deposit-card-footer_button">
          <a-button type="primary" :disabled="pairsItem.pendingReward === 0" @click="claimFunc()"
            >收获</a-button
          >
          <a-button type="primary" @click="handleOk">复投</a-button>
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

import { reinvest, getBalance, claim, getReinvestAmount } from '../../common/src/back_main';

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
      form: {
        balance: '',
        amount0: 0,
        amount1: 0,
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
        await Promise.all([this.getBalanceNum(), this.getReinvestAmountFunc()]);
      } catch (error) {
        console.log('getBalance  error');
      } finally {
        this.loading = false;
      }
    },
    async getReinvestAmountFunc() {
      // 3秒更新一次
      console.log(this.pairsItem.pendingReward, this.pairsItem.token0, this.pairsItem.token1);
      const res = await getReinvestAmount(
        this.pairsItem.pendingReward,
        this.pairsItem.token0,
        this.pairsItem.token1
      );
      Object.assign(this.form, res.data);
      console.log(res);
    },
    // 查询币的余额
    async getBalanceNum() {
      this.form.balance = await getBalance(this.pairsItem.borrowToken);
    },
    // 复投
    async handleOk() {
      this.loading = true;
      reinvest(
        this.pairsItem.address,
        this.pairsItem.borrowToken,
        Math.floor(+new Date() / 1000) + '',
        (code, msg) => {
          //  0 小狐狸提交成功
          //  1 区块链确认成功
          console.log('reinvest err---->', code, msg);
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
    },
    // 收获
    claimFunc() {
      this.loading = true;
      claim(this.pairsItem.address, this.pairsItem.borrowToken, async (code, msg) => {
        console.log('approve result ', code, msg);
        if (code === 1) {
          this.$emit('close', 'update');
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