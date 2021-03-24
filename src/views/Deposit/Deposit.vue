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
        :dataSource="assetList.filter((item) => +item.amountSupply)"
        :columns="depositColumns"
        :pagination="false"
        :loading="loading"
      >
        <template #rewardTooltip>
          <span>{{ $t('Deposit.all.income') }} </span>
          <a-tooltip placement="right">
            <template #title>
              <span>{{ $t('Deposit.all.incomeRemind') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template #action="{ record }">
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'withdrawal')"
            >{{ $t('Deposit.account.takeBtn') }}</a-button
          >
          <a-button type="primary" size="small" @click="openCard(record, 'deposit')">{{
            $t('Deposit.account.depositBtn')
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
        <template #profitTooltip>
          <span>{{ $t('Deposit.all.income') }} </span>
          <a-tooltip placement="right">
            <template #title>
              <span>{{ $t('Deposit.all.incomeRemind') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template #action="{ record }">
          <a-button type="primary" size="small" @click="openCard(record, 'deposit')">{{
            $t('Deposit.all.button')
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
import { queryAssetList } from '../../common/src/back_main';

export default {
  components: { Withdrawal, DepositCard, ExclamationCircleFilled, QuestionCircleOutlined },
  data() {
    return {
      openCardMode: '',
      assetList: [],
      loading: false,
      depositColumns: [
        {
          title: this.$t('Deposit.account.symbol'),
          dataIndex: 'symbol',
          align: 'center',
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
            return {
              children: (
                <div>
                  <div>{this.$tranNumber(text * 100, 2)}%</div>
                  <div>
                    = {this.$tranNumber(record.depositAPY * 100, 2)}% +
                    {this.$tranNumber(record.platformRewardAPY * 100, 2)}%
                  </div>
                </div>
              ),
            };
          },
        },
        {
          title: this.$t('Deposit.account.amountSupply'),
          dataIndex: 'amountSupply',
          align: 'center',
          customRender: ({ text, record }) => {
            return {
              children: (
                <div>
                  <div> $ {this.$tranNumber(text * record.prices, 2)}</div>
                  <div class="font-small">
                    {this.$tranNumber(text, 4)} {record.symbol}
                  </div>
                </div>
              ),
            };
          },
        },
        {
          title: this.$t('Deposit.account.operating'),
          align: 'center',
          width: 150,
          slots: { customRender: 'action' },
        },
      ],
      depositItem: {},
      poolColumns: [
        {
          title: this.$t('Deposit.all.symbol'),
          dataIndex: 'symbol',
          align: 'center',
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
            return {
              children: (
                <div>
                  <div> {this.$tranNumber(text * 100, 2)}%</div>
                  <div>
                    = {this.$tranNumber(record.depositAPY * 100, 2)}% +
                    {this.$tranNumber(record.platformRewardAPY * 100, 2)}%
                  </div>
                </div>
              ),
            };
          },
        },
        {
          title: this.$t('Deposit.all.totalShare'),
          dataIndex: 'totalShare',
          align: 'center',
          customRender: ({ text, record }) => {
            return {
              children: (
                <div>
                  <div> $ {this.$tranNumber(text * record.prices, 2)} </div>
                  <div>
                    {this.$tranNumber(text, 4)} {record.symbol}
                  </div>
                </div>
              ),
            };
          },
        },
        {
          title: this.$t('Deposit.all.remain'),
          dataIndex: 'remain',
          align: 'center',
          customRender: ({ text, record }) => {
            return {
              children: (
                <div>
                  <div> $ {this.$tranNumber(text * record.prices, 2)} </div>
                  <div>
                    {this.$tranNumber(text, 4)} {record.symbol}
                  </div>
                </div>
              ),
            };
          },
        },
        {
          title: this.$t('Deposit.all.useRatio'),
          dataIndex: 'useRatio',
          align: 'center',
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
          title: this.$t('Deposit.all.operating'),
          dataIndex: 'operating',
          align: 'center',
          width: 100,
          slots: { customRender: 'action' },
        },
      ],
    };
  },
  created() {
    this.getAssetList();
  },
  methods: {
    async getAssetList() {
      this.loading = true;
      try {
        const res = await queryAssetList();
        this.assetList = res.data;
        console.log('存款列表获取---》', res.data);
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
      }
    },
  },
};
</script>