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
          name: $t('Operation.reinvest') + '/' + $t('Operation.claim'),
        }"
      />
    </template>
    <a-spin :spinning="loading">
      <div class="deposit-card-content">
        <div class="line-h-40">
          {{ $t('Farm.display.claim1') }} :
          {{ $tranNumber(pairsItem.pendingReward, 4) }}
          {{ pairsItem.rewardSymbol }}
        </div>
        <div class="line-h-40">
          {{ $t('Farm.display.reinvest1') }} :
          <a-tooltip placement="top">
            <template #title>
              <span> {{ $t('Farm.display.transform') }} </span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          :{{ $tranNumber(form.amount0, 4) }} {{ pairsItem.symbol0 }} +
          {{ $tranNumber(form.amount1, 4) }} {{ pairsItem.symbol1 }}
        </div>
        <!-- <div class="line-h-40">  {{ $t('Farm.display.reinvest2') }} : </div>
        <div class="line-h-40 prompt-text">
          <ExclamationCircleFilled />
          {{ $t('Farm.healthyRemind') }}
        </div> -->
      </div>

      <div class="deposit-card-footer">
        <div class="deposit-card-footer_button">
          <a-button type="primary" :disabled="pairsItem.pendingReward === 0" @click="claimFunc()">{{
            $t('Operation.claim')
          }}</a-button>
          <a-button type="primary" @click="handleOk">{{ $t('Operation.reinvest') }}</a-button>
        </div>
        <div class="deposit-card-footer_text"
          >{{ $t('Sidebar.balance') }} :
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

import { reinvest, getBalance, claim, getReinvestInfo } from '../../common/src/back_main';

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
      // 以后需要3秒更新一次
      try {
        console.log(this.pairsItem.pendingReward, this.pairsItem.address);
        const res = await getReinvestInfo(
          this.pairsItem.pendingReward,
          this.pairsItem.address,
            this.pairsItem.borrowToken
        );
        Object.assign(this.form, res.data);
        console.log(res.data);
      } catch (error) {
        console.log('getReinvestAmount--->', error);
      }
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