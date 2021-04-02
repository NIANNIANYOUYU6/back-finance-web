
<template>
  <a-modal class="back-modal" visible @cancel="$emit('close')">
    <template #title>
      <CardTitle
        :title="{
          swapperName: pairsItem.swapperName,
          tokenA: pairsItem.symbol0,
          tokenB: pairsItem.symbol1,
          name: $t('Operation.reinvest'),
        }"
      />
    </template>
    <div class="modal-body-content">
      <div class="text-space">
        <span class="text-c"> {{ $t('Farm.display.claim1') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(pairsItem.pendingReward, 4) }} {{ pairsItem.rewardSymbol }}
        </span>
      </div>
      <div class="text-space">
        <span class="text-c">
          {{ $t('Farm.display.reinvest1') }}
          <a-tooltip placement="top" color="#2b4a77">
            <template #title>
              <span> {{ $t('Farm.display.transform') }} </span>
            </template>
            <QuestionCircleOutlined /> </a-tooltip
        ></span>
        <span class="fw-fff">
          {{ $tranNumber(form.amount0, 4) }} {{ pairsItem.symbol0 }} +
          {{ $tranNumber(form.amount1, 4) }} {{ pairsItem.symbol1 }}
        </span>
      </div>
      <div class="text-space">
        <span class="text-c"> {{ $t('Farm.display.reinvest2') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(form.health * 100, 2) }}
        </span>
      </div>
      <div class="line-h-40 prompt-text">
        <ExclamationCircleFilled />
        {{ $t('Farm.healthyRemind') }}
      </div>
      <div class="text-space">
        <span class="text-c"> {{ $t('Sidebar.balance') }}</span>
        <span class="fw-fff">
          {{ $tranNumber(form.balance, 8) }} {{ pairsItem.rewardSymbol }}
        </span>
      </div>
    </div>
    <div class="back-card-footer">
      <a-button
        :loading="loading"
        class="btn-one"
        type="primary"
        :disabled="pairsItem.pendingReward === 0"
        @click="handleOk"
        style="margin-left: 15px"
        >{{ $t('Operation.reinvest') }}
      </a-button>
    </div>
  </a-modal>
</template>
<script>
import CardTitle from './CardTitle';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue';

import { reinvest, getBalance, claim, getReinvestInfo } from '../../common/src/back_main';

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
        console.log(
          this.pairsItem.pendingReward,
          this.pairsItem.address,
          this.pairsItem.borrowToken
        );
        const res = await getReinvestInfo(
          this.pairsItem.pendingReward,
          this.pairsItem.address,
          this.pairsItem.borrowToken
        );
        Object.assign(this.form, res.data);
        console.log('getReinvestInfo--->', res.data);
      } catch (error) {
        console.log('getReinvestAmount--->', error);
      }
    },
    // 查询币的余额
    async getBalanceNum() {
      this.form.balance = await getBalance(this.pairsItem.rewardToken);
      console.log('getBalance--->', this.pairsItem.rewardToken, '--->', this.form.balance);
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