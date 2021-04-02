<style lang='scss' scoped >
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
  .back-user-table {
    min-height: 100px;
    .back-table_item-thead {
      padding: 0 10px;
      line-height: 40px;
    }
    .back-table_item-body {
      display: flex;
      min-height: 80px;
      align-items: center;
      background-color: #0a0221;
      justify-content: space-between;
      &:hover {
        background-color: #0f0120;
      }
      > * {
        padding: 0 10px;
      }
      .back-table_item-body-text {
        flex: 1;
        .text-c {
          color: #6483b9;
          margin-right: 10px;
        }
      }
      .back-table_item-body-btn {
        .back-table_item-body-btn-line {
          display: flex;
          justify-content: space-between;
          > button {
            margin-right: 10px;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="combination home">
    <div class="combination-account">
      <div class="combination-account_title">
        <img style="height: 26px; margin-right: 10px" src="../../assets/icon.png" alt="" />
        {{ $t('Farm.user.title') }}</div
      >
      <BorderCard>
        <a-spin :spinning="loading">
          <div class="back-table back-user-table">
            <a-empty v-if="!userInfoList.length" :image="simpleImage" style="color: #fff" />
            <div class="back-table_item" v-for="(userInfo, index) in userInfoList" :key="index">
              <div class="back-table_item-thead">
                <img class="b-icon" :src="'./assets/' + userInfo.symbol0 + '.png'" />
                <img class="b-icon" :src="'./assets/' + userInfo.symbol1 + '.png'" />
                <span class="fw-fff ml-10"> {{ userInfo.swapperName }}</span>
                <a-divider type="vertical" style="background: #4d4bbf" />
                <span class="fw-fff"> {{ userInfo.symbol0 }}/{{ userInfo.symbol1 }} </span>
              </div>
              <div
                class="back-table_item-body"
                v-for="(child, index) in userInfo.child"
                :key="index"
              >
                <div style="width: 100px">
                  <img class="b-icon" :src="'./assets/' + child.borrowSymbol + '.png'" />
                  <span class="fw-fff ml-10"> {{ child.borrowSymbol }} </span>
                </div>
                <div class="back-table_item-body-text">
                  <span class="text-c">{{ $t('Farm.totalAssets') }} </span>
                  <span class="fw-fff">
                    ${{ $tranNumber(child.totalAssets, 2) }}
                    <a-tooltip placement="right" color="#5C5CE6">
                      <template #title>
                        {{ $t('Farm.lp') }}:
                        <span>{{
                          $tranNumber(child.amount0, 4) +
                          child.symbol0 +
                          '+' +
                          $tranNumber(child.amount1, 4) +
                          child.symbol1
                        }}</span>
                      </template>
                      <InfoCircleOutlined />
                    </a-tooltip>
                  </span>
                </div>
                <div class="back-table_item-body-text">
                  <span class="text-c">{{ $t('Farm.user.totalDebt') }} </span>
                  <span class="fw-fff">
                    ${{ $tranNumber(child.totalDebt, 2) }}
                    <a-tooltip placement="right" color="#5C5CE6">
                      <template #title>
                        {{ $t('Farm.debt') }}:
                        <span>{{
                          $tranNumber(child.debtAmount, 4) +
                          child.borrowSymbol +
                          '+' +
                          $tranNumber(child.debtInterest, 4) +
                          child.borrowSymbol
                        }}</span>
                      </template>
                      <InfoCircleOutlined />
                    </a-tooltip>
                  </span>
                </div>
                <div class="back-table_item-body-text">
                  <span class="text-c">
                    {{ $t('Farm.healthy') }}
                    <a-tooltip placement="right" color="#2b4a77">
                      <template #title>
                        <span>{{ $t('Farm.healthyRemind') }}</span>
                      </template>
                      <QuestionCircleOutlined />
                    </a-tooltip>
                  </span>
                  <span class="fw-fff">{{ $tranNumber(child.healthy * 100, 2) }} </span>
                </div>
                <div class="back-table_item-body-text">
                  <span class="text-c">{{ $t('Farm.user.pendingReward') }} </span>
                  <span class="fw-fff">
                    ${{ $tranNumber(child.pendingReward, 2) }} {{ child.rewardSymbol }}
                  </span>
                </div>
                <div class="back-table_item-body-btn">
                  <div class="back-table_item-body-btn-line">
                    <a-button type="primary" size="small" @click="openCard(child, 'add')">
                      {{ $t('Operation.add') }}</a-button
                    >
                    <a-button type="primary" size="small" @click="openCard(child, 'repay')">{{
                      $t('Operation.repay')
                    }}</a-button>
                    <a-button type="primary" size="small" @click="openCard(child, 'divest')">{{
                      $t('Operation.divest')
                    }}</a-button>
                  </div>
                  <div class="back-table_item-body-btn-line" style="margin-top: 8px">
                    <a-button type="primary" size="small" @click="openCard(child, 'reinvest')"
                      >{{ $t('Operation.reinvest') }}
                    </a-button>
                    <a-button type="primary" size="small" @click="openCard(child, 'claim')">{{
                      $t('Operation.claim')
                    }}</a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-spin>
      </BorderCard>
    </div>
    <div class="combination-account">
      <div class="combination-account_title">
        <img style="height: 26px; margin-right: 10px" src="../../assets/icon.png" alt="" />
        {{ $t('Farm.all.title') }}
      </div>
      <BorderCard>
        <a-table
          class="back-table"
          rowKey="address"
          :dataSource="pairsList"
          :columns="pairsColumns"
          :pagination="false"
          :loading="loading"
        >
          <template #pair>
            <span>{{ $t('Farm.pair') }} </span>
          </template>
          <template #totalLock>
            <span>{{ $t('Farm.all.totalLock') }} </span>
          </template>
          <template #borrowSymbol>
            <span>{{ $t('Farm.borrowSymbol') }} </span>
          </template>
          <template #rewardTooltip>
            <span>{{ $t('Farm.all.income') }}</span>
            <a-tooltip placement="right" color="#2b4a77">
              <template #title>
                <span>{{ $t('Farm.all.incomeRemind') }}</span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
          </template>
          <template #pairEarningsAPY="{ record }">
            <div>
              <div>
                {{
                  $tranNumber(
                    (record.debtRatio * record.liquidityAPY +
                      (record.debtRatio - 1) * record['platformAPY' + record.debtToken] -
                      (record.debtRatio - 1) * record['interestAPY' + record.debtToken]) *
                      100,
                    2
                  )
                }}%
              </div>
              <div>
                {{ $tranNumber(record.debtRatio * record.liquidityAPY * 100, 2) }}% +
                {{
                  $tranNumber(
                    (record.debtRatio - 1) * record['platformAPY' + record.debtToken] * 100,
                    2
                  )
                }}% -
                {{
                  $tranNumber(
                    (record.debtRatio - 1) * record['interestAPY' + record.debtToken] * 100,
                    2
                  )
                }}%
              </div>
            </div>
          </template>
          <template #leverTooltip>
            <span>{{ $t('Farm.all.lever') }}</span>
            <a-tooltip placement="right" color="#2b4a77">
              <template #title>
                <span>{{ $t('Farm.all.leverRemind') }}</span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
          </template>

          <template #debtToken="{ record }">
            <span
              class="debtToken"
              :class="{ 'debtToken-active': record.debtToken === '0' }"
              @click="record.debtToken = '0'"
            >
              {{ record.symbol0 }}
            </span>
            /
            <span
              class="debtToken"
              :class="{ 'debtToken-active': record.debtToken === '1' }"
              @click="record.debtToken = '1'"
            >
              {{ record.symbol1 }}
            </span>
          </template>

          <template #lever="{ record }">
            <a-slider
              class="lever-item"
              v-model:value="record.debtRatio"
              :min="1"
              :max="+record.leverageRate"
              :marks="record.marks"
              :step="null"
            />
          </template>
          <template #operating>
            <span>{{ $t('Operation.operating') }} </span>
          </template>
          <template #action="{ record }">
            <a-button
              style="margin-right: 10px"
              type="primary"
              size="small"
              @click="openCard(record, 'farm')"
              >{{ $t('Operation.farm') }} {{ record.debtRatio }}X</a-button
            >
          </template>
        </a-table>
      </BorderCard>
    </div>
    <AddWarehouse :pairsItem="pairsItem" v-if="openCardMode === 'add'" @close="closeCard" />
    <Divest :pairsItem="pairsItem" v-if="openCardMode === 'divest'" @close="closeCard" />
    <Repay :pairsItem="pairsItem" v-if="openCardMode === 'repay'" @close="closeCard" />
    <Farm :pairsItem="pairsItem" v-if="openCardMode === 'farm'" @close="closeCard" />
    <Reinvest :pairsItem="pairsItem" v-if="openCardMode === 'reinvest'" @close="closeCard" />
    <Claim :pairsItem="pairsItem" v-if="openCardMode === 'claim'" @close="closeCard" />
  </div>
</template>
<script>
import BorderCard from '../../components/BorderCard';
import AddWarehouse from './AddWarehouse';
import Farm from './Farm';
import Divest from './Divest';
import Repay from './Repay';
import Reinvest from './Reinvest';
import Claim from './Claim';

import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { lever } from '../../common/const.js';

// 引入方法
import { getPairList, getUserInfoList, fetchData } from '../../common/src/back_main';
import { Empty } from 'ant-design-vue';
export default {
  components: {
    BorderCard,
    AddWarehouse,
    Repay,
    Divest,
    Farm,
    Reinvest,
    Claim,
    QuestionCircleOutlined,
    InfoCircleOutlined,
  },
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      openCardMode: '',
      pairsList: [],
      userInfoList: [],
      userInfoListAAAAA: [],
      loading: false,
      myColumns: [
        {
          dataIndex: 'swapperName',
          width: 160,
          slots: { title: 'pair' },
          customRender: ({ text, record }) => {
            return {
              children: (
                <div style="display:flex ">
                  <div style="height: 20px;line-height: 44px;margin-right:5px">
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
          dataIndex: 'totalAssets',
          align: 'center',
          slots: { customRender: 'currentTotalAsset', title: 'totalAssets' },
        },
        {
          dataIndex: 'totalDebt',
          align: 'center',
          slots: { customRender: 'totalDebtValue', title: 'totalDebt' },
        },
        {
          dataIndex: 'pendingReward',
          align: 'center',
          slots: { title: 'pendingReward' },
          customRender: ({ text, record }) => {
            text;
            return {
              children: (
                <div>
                  {this.$tranNumber(text, 2)} {record.rewardSymbol}
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
          width: 300,
          slots: { customRender: 'action', title: 'operating' },
        },
      ],
      pairsColumns: [
        {
          dataIndex: 'swapperName',
          width: 170,
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
          // 收益率
          dataIndex: 'pairEarningsAPY',
          align: 'center',
          slots: { title: 'rewardTooltip', customRender: 'pairEarningsAPY' },
        },
        {
          dataIndex: 'Token',
          slots: { title: 'totalLock' },
          customRender: ({ text, record }) => {
            text;
            return {
              children: (
                <div>
                  <div>
                    <img class="b-icon" src={'./assets/' + record.symbol0 + '.png'} />
                    <span style="margin-left:10px">{this.$tranNumber(record.amount0, 4)}</span>
                  </div>
                  <div>
                    <img class="b-icon" src={'./assets/' + record.symbol1 + '.png'} />
                    <span style="margin-left:10px">{this.$tranNumber(record.amount1, 4)}</span>
                  </div>
                </div>
              ),
            };
          },
        },
        {
          dataIndex: 'debtToken',
          align: 'center',
          slots: { customRender: 'debtToken', title: 'borrowSymbol' },
        },
        {
          align: 'center',
          width: 150,
          slots: { customRender: 'lever', title: 'leverTooltip' },
        },
        {
          align: 'center',
          width: 150,
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
        await Promise.all([this.getPairList(), this.getUserInfoList()]);
      } finally {
        this.loading = false;
      }
    },
    async getPairList() {
      const res = await getPairList();
      console.log('getPairList--->', res);
      this.pairsList = res.map((item) => {
        item.marks = lever[item.leverageRate];
        item.debtRatio = +item.leverageRate;
        item.debtToken = '0';
        return item;
      });
    },
    async getUserInfoList() {
      const res = await getUserInfoList();
      console.log('getUserInfoList--->', res);
      let userInfo = {};
      res.forEach((item) => {
        let { address, swapperName, symbol0, symbol1 } = item;
        if (!userInfo[address]) {
          userInfo[address] = {
            swapperName,
            symbol0,
            symbol1,
            child: [],
          };
        }
        userInfo[address].child.push(item);
      });
      this.userInfoList = Object.values(userInfo);
      console.log(this.userInfoList);
      this.userInfoListAAAAA = res;
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