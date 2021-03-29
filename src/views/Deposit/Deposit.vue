<style lang='scss' >
.deposit {
  padding: 10px 20px;
  color: #eee;
  .font-small {
    font-size: 12px;
    color: #999;
  }
  .b-icon {
    height: 20px;
  }
  .b-icon-name {
    margin-left: 10px;
    vertical-align: middle;
  }
  .deposit-account {
    .deposit-account_title {
      font-weight: 500;
      font-size: 16px;
      line-height: 40px;
    }
    .deposit-account_title-sub {
      color: #eb8834;
    }
  }
}
</style>
<template>
  <div class="deposit">
    <div class="deposit-account">
      <div class="deposit-account_title">{{ $t('Deposit.account.title') }}</div>
      <div class="deposit-account_title-sub">
        <ExclamationCircleFilled />
        {{ $t('Deposit.account.remind') }}
      </div>
      <a-table
        rowKey="symbol"
        :dataSource="assetList.filter((item) => item.amountDeposit)"
        :columns="depositColumns"
        :pagination="false"
        :loading="loading"
      >
        <template #symbol>
          <span>{{ $t('Deposit.symbol') }} </span>
        </template>
        <template #rewardTooltip>
          <span>{{ $t('Deposit.income') }} </span>
          <a-tooltip placement="right">
            <template #title>
              <span>{{ $t('Deposit.incomeRemind') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template #amountSupply>
          <span>{{ $t('Deposit.account.amountSupply') }} </span>
        </template>
        <template #operating>
          <span>{{ $t('Operation.operating') }} </span>
        </template>
        <template #action="{ record }">
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'withdrawal')"
            >{{ $t('Operation.takeBtn') }}</a-button
          >
          <a-button type="primary" size="small" @click="openCard(record, 'deposit')">{{
            $t('Operation.depositBtn')
          }}</a-button>
        </template>
      </a-table>
    </div>
    <div class="deposit-account">
      <div class="deposit-account_title">{{ $t('Deposit.all.title') }}</div>
      <a-table
        rowKey="symbol"
        :dataSource="assetList"
        :columns="poolColumns"
        :pagination="false"
        :loading="loading"
      >
        <template #symbol>
          <span>{{ $t('Deposit.symbol') }} </span>
        </template>
        <template #profitTooltip>
          <span>{{ $t('Deposit.income') }} </span>
          <a-tooltip placement="right">
            <template #title>
              <span>{{ $t('Deposit.incomeRemind') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template #totalShare>
          <span>{{ $t('Deposit.all.totalShare') }} </span>
        </template>
        <template #remain>
          <span>{{ $t('Deposit.all.remain') }} </span>
        </template>
        <template #useRatio>
          <span>{{ $t('Deposit.all.useRatio') }} </span>
        </template>
        <template #operating>
          <span>{{ $t('Operation.operating') }} </span>
        </template>
        <template #action="{ record }">
          <a-button type="primary" size="small" @click="openCard(record, 'deposit')">{{
            $t('Operation.depositBtn')
          }}</a-button>
        </template>
      </a-table>
    </div>
    <Withdrawal
      :depositItem="depositItem"
      v-if="openCardMode === 'withdrawal'"
      @close="closeCard"
    />
    <DepositCard :depositItem="depositItem" v-if="openCardMode === 'deposit'" @close="closeCard" />
  </div>
</template>
<script>
import Withdrawal from './Withdrawal';
import DepositCard from './DepositCard';
import { ExclamationCircleFilled, QuestionCircleOutlined } from '@ant-design/icons-vue';

// 引入方法
import { getAssetsList, fetchData } from '../../common/src/back_main';

export default {
  components: { Withdrawal, DepositCard, ExclamationCircleFilled, QuestionCircleOutlined },
  data() {
    return {
      openCardMode: '',
      assetList: [],
      loading: false,
      depositColumns: [
        {
          dataIndex: 'symbol',
          align: 'center',
          slots: { title: 'symbol' },
          customRender: ({ text }) => {
            return {
              children: (
                <div>
                  <img class="b-icon" src={'./img/icon/' + text + '.png'} />
                  <span class="b-icon-name">{text}</span>
                </div>
              ),
            };
          },
        },
        {
          // 收益率
          dataIndex: 'earningsAPY',
          align: 'center',
          slots: { title: 'rewardTooltip' },
          customRender: ({ text, record }) => {
            text;
            return {
              children: (
                <div>
                  <div> {this.$tranNumber((record.depositAPY + record.platformAPY) * 100, 2)}%</div>
                  <div>
                    = {this.$tranNumber(record.depositAPY * 100, 2)}% +
                    {this.$tranNumber(record.platformAPY * 100, 2)}%
                  </div>
                </div>
              ),
            };
          },
        },
        {
          dataIndex: 'amountDeposit',
          align: 'center',
          slots: { title: 'amountSupply' },
          customRender: ({ text, record }) => {
            return {
              children: (
                <div>
                  <div> $ {this.$tranNumber(text * record.price, 2)}</div>
                  <div class="font-small">
                    {this.$tranNumber(text, 4)} {record.symbol}
                  </div>
                </div>
              ),
            };
          },
        },
        {
          align: 'center',
          width: 200,
          slots: { customRender: 'action', title: 'operating' },
        },
      ],
      depositItem: {},
      poolColumns: [
        {
          dataIndex: 'symbol',
          align: 'center',
          slots: { title: 'symbol' },
          customRender: ({ text }) => {
            return {
              children: (
                <div>
                  <img class="b-icon" src={'./img/icon/' + text + '.png'} />
                  <span class="b-icon-name">{text}</span>
                </div>
              ),
            };
          },
        },
        {
          // 收益率
          dataIndex: 'earningsAPY',
          align: 'center',
          slots: { title: 'profitTooltip' },
          customRender: ({ text, record }) => {
            text;
            return {
              children: (
                <div>
                  <div> {this.$tranNumber((record.depositAPY + record.platformAPY) * 100, 2)}%</div>
                  <div>
                    = {this.$tranNumber(record.depositAPY * 100, 2)}% +
                    {this.$tranNumber(record.platformAPY * 100, 2)}%
                  </div>
                </div>
              ),
            };
          },
        },
        {
          dataIndex: 'totalDeposit',
          align: 'center',
          slots: { title: 'totalShare' },
          customRender: ({ text, record }) => {
            return {
              children: (
                <div>
                  <div> $ {this.$tranNumber(text * record.price, 2)} </div>
                  <div>
                    {this.$tranNumber(text, 4)} {record.symbol}
                  </div>
                </div>
              ),
            };
          },
        },
        {
          dataIndex: 'remainBorrow',
          align: 'center',
          slots: { title: 'remain' },
          customRender: ({ text, record }) => {
            return {
              children: (
                <div>
                  <div> $ {this.$tranNumber(text * record.price, 2)} </div>
                  <div>
                    {this.$tranNumber(text, 4)} {record.symbol}
                  </div>
                </div>
              ),
            };
          },
        },
        {
          dataIndex: 'useRatio',
          align: 'center',
          slots: { title: 'useRatio' },
          customRender: ({ text }) => {
            return {
              children: (
                <div>
                  <div> {this.$tranNumber(text * 100, 2)}%</div>
                </div>
              ),
            };
          },
        },
        {
          dataIndex: 'operating',
          align: 'center',
          width: 100,
          slots: { customRender: 'action', title: 'operating' },
        },
      ],
    };
  },
  created() {
    if (this.$store.state.updatePage) {
      this.getAssetList();
    }
  },
  methods: {
    async getAssetList() {
      this.loading = true;
      try {
        await fetchData();
        const res = await getAssetsList();
        this.assetList = res;
        console.log('存款列表获取---》', res);
      } finally {
        this.loading = false;
      }
    },
    openCard(item, type) {
      this.depositItem = item;
      this.openCardMode = type;
    },
    closeCard(type) {
      this.openCardMode = '';
      this.depositItem = {};
      if (type) {
        this.getAssetList();
        // 更新totle
        this.$store.commit('setState', { updatePage: +new Date() });
      }
    },
  },
};
</script>