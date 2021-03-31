<style lang='scss' scoped>
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
.home {
  .debtToken {
    cursor: pointer;
    font-size: 14px;
    height: 14px;
  }
  .debtToken-active {
    font-weight: 700;
    font-size: 20px;
  }
  .lever-item {
    .ant-slider-mark-text-active,
    .ant-slider-mark-text {
      color: #fff !important;
    }
  }
}
</style>
<template>
  <div class="deposit home">
    <div class="deposit-account">
      <div class="deposit-account_title">{{ $t('Liquidate.title') }}</div>
      <a-table
        rowKey="address"
        :dataSource="userInfoList"
        :columns="myColumns"
        :pagination="false"
        :loading="loading"
      >
        <template #pair>
          <span>{{ $t('Farm.pair') }} </span>
        </template>
        <template #mortgage>
          <span>{{ $t('Liquidate.mortgage') }} </span>
        </template>
        <template #liabilities>
          <span>{{ $t('Liquidate.liabilities') }} </span>
        </template>
        <template #borrowSymbol>
          <span>{{ $t('Farm.borrowSymbol') }} </span>
        </template>
        <template #debtTooltip>
          <span>{{ $t('Farm.healthy') }}</span>
          <a-tooltip placement="right">
            <template #title>
              <span>{{ $t('Farm.healthyRemind') }}</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template #currentTotalAsset="{ text, record }">
          ${{ $tranNumber(text, 2) }}
          <a-tooltip placement="right">
            <template #title>
              {{ $t('Farm.lp') }}:
              <span>{{
                $tranNumber(record.amount0, 4) +
                record.symbol0 +
                '+' +
                $tranNumber(record.amount1, 4) +
                record.symbol1
              }}</span>
            </template>
            <InfoCircleOutlined />
          </a-tooltip>
        </template>
        <template #totalDebtValue="{ text, record }">
          ${{ $tranNumber(text, 2) }}
          <a-tooltip placement="right">
            <template #title>
              {{ $t('Farm.debt') }}:
              <span>{{
                $tranNumber(record.debtAmount, 4) +
                record.borrowSymbol +
                '+' +
                $tranNumber(record.debtInterest, 4) +
                record.borrowSymbol
              }}</span>
            </template>
            <InfoCircleOutlined />
          </a-tooltip>
        </template>
        <template #operating>
          <span>{{ $t('Operation.operating') }} </span>
        </template>
        <template #action="{ record }">
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'modal')"
            >{{ $t('Operation.liquidate') }}</a-button
          >
        </template>
      </a-table>
    </div>
    <!-- <Modal :pairsItem="pairsItem" v-if="openCardMode === 'modal'" @close="closeCard" /> -->
  </div>
</template>
<script>
// import Modal from './Modal';

import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';

// 引入方法
import { getUserInfoList, fetchData } from '../../common/src/back_main';

export default {
  components: {
    // Modal,
    QuestionCircleOutlined,
    InfoCircleOutlined,
  },
  data() {
    return {
      openCardMode: '',
      userInfoList: [],
      loading: false,
      myColumns: [
        {
          title: 'ID',
          dataIndex: 'id',
          align: 'center',
          customRender: ({ text }) => {
            text;
            return {
              children: <div>{text}</div>,
            };
          },
        },
        {
          dataIndex: 'swapperName',
          width: 160,
          slots: { title: 'pair' },
          customRender: ({ text, record }) => {
            return {
              children: (
                <div style="display:flex ">
                  <div style="height: 20px;line-height: 44px;margin-right:10px">
                    <img class="b-icon" src={'./assets/' + record.symbol0 + '.png'} />
                    <img class="b-icon" src={'./assets/' + record.symbol1 + '.png'} />
                  </div>
                  <div>
                    <div>{text}</div>
                    <div>
                      {record.symbol0}/{record.symbol1}
                    </div>
                  </div>
                </div>
              ),
            };
          },
        },
        {
          dataIndex: 'totalAssets',
          align: 'center',
          slots: { customRender: 'currentTotalAsset', title: 'mortgage' },
        },
        {
          dataIndex: 'totalDebt',
          align: 'center',
          slots: { customRender: 'totalDebtValue', title: 'liabilities' },
        },
        {
          dataIndex: 'borrowSymbol',
          align: 'center',
          slots: { title: 'borrowSymbol' },
          customRender: ({ text }) => {
            text;
            return {
              children: (
                <div>
                  <img class="b-icon" src={'./assets/' + text + '.png'} />
                  <span class="b-icon-name">{text}</span>
                </div>
              ),
            };
          },
        },
        {
          // 风险值
          dataIndex: 'healthy',
          align: 'center',
          slots: { title: 'debtTooltip' },
          customRender: ({ text }) => {
            return {
              children: <div>{this.$tranNumber(text * 100, 2)}</div>,
            };
          },
        },
        {
          align: 'center',
          slots: { customRender: 'action', title: 'operating' },
        },
      ],
      pairsItem: {},
    };
  },
  created() {
    if (this.$store.state.updatePage) {
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      this.loading = true;
      try {
        await fetchData();
        await Promise.all([this.getUserInfoList()]);
      } finally {
        this.loading = false;
      }
    },
    async getUserInfoList() {
      const res = await getUserInfoList();
      console.log('getUserInfoList--->', res);
      this.userInfoList = res;
    },
    openCard(item, type) {
      this.pairsItem = item;
      this.openCardMode = type;
    },
    closeCard(type) {
      this.openCardMode = '';
      this.pairsItem = {};
      if (type) {
        this.getInfo();
        // 更新totle
        this.$store.commit('setState', { updatePage: +new Date() });
      }
    },
  },
};
</script>