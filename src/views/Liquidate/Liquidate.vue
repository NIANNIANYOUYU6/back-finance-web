<style lang='scss' scoped>
</style>
<template>
  <div class="combination">
    <div class="combination-account">
      <div class="combination-account_title">
        <img style="height: 26px; margin-right: 10px" src="../../assets/icon.png" alt="" />
        <span>{{ $t('Liquidate.title') }}</span>
      </div>
      <BorderCard>
        <a-table
          class="back-table"
          rowKey="pair"
          :dataSource="liquidationList"
          :columns="columns"
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
            <a-tooltip placement="right" color="#2b4a77">
              <template #title>
                <span>{{ $t('Farm.healthyRemind') }}</span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
          </template>
          <template #currentTotalAsset="{ text, record }">
            ${{ $tranNumber(text * record.lpPrice, 2) }}
            <a-tooltip placement="right" color="#5C5CE6">
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
            ${{ $tranNumber((text + record.borrowInterest) * record.borrowPrice, 2) }}
            <a-tooltip placement="right" color="#5C5CE6">
              <template #title>
                {{ $t('Farm.debt') }}:
                <span>{{
                  $tranNumber(text, 4) +
                  record.borrowSymbol +
                  '+' +
                  $tranNumber(record.borrowInterest, 4) +
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
              :disabled="record.health < 1"
              style="margin-right: 10px"
              type="primary"
              size="small"
              @click="openCard(record, 'modal')"
              >{{ $t('Operation.liquidate') }}</a-button
            >
          </template>
        </a-table>
      </BorderCard>
    </div>
    <Modal :pairsItem="pairsItem" v-if="openCardMode === 'modal'" @close="closeCard" />
  </div>
</template>
<script>
import Modal from './Modal';
import BorderCard from '../../components/BorderCard';

import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';

// 引入方法
import { getLiquidationList, fetchData } from '../../common/src/back_main';

export default {
  components: {
    Modal,
    BorderCard,
    QuestionCircleOutlined,
    InfoCircleOutlined,
  },
  data() {
    return {
      openCardMode: '',
      liquidationList: [],
      loading: false,
      columns: [
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
          dataIndex: 'lpAmount',
          align: 'center',
          slots: { customRender: 'currentTotalAsset', title: 'mortgage' },
        },
        {
          dataIndex: 'borrowAmount',
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
          dataIndex: 'health',
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
        const res = await getLiquidationList();
        console.log('清算池获取getLiquidationList--->', res);
        this.liquidationList = res;
      } finally {
        this.loading = false;
      }
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