<style lang='scss'  >
.home {
  .debtToken-select {
    width: 100%;
    .ant-select-selector {
      border-color: #403ea1 !important;
      background-color: #1a1744 !important;
      color: #fff;
      font-weight: 700;
    }
    .ant-select-arrow {
      color: #fff;
    }
  }
  .back-user-table {
    background-color: #0c031e;
    min-height: 100px;
    padding: 0px;
    .back-table_item {
      padding: 10px;
      background-color: #15112d;
      border-radius: 15px;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0px;
      }
      .back-table_item-thead {
        display: flex;
        align-items: center;
        background-color: #141031;
        justify-content: space-between;
        line-height: 36px;
        padding-right: 20px;
        .back-table_item-thead-text {
          display: flex;
          .text-c {
            color: #6483b9;
            margin-right: 10px;
          }
          .back-table_item-thead-btn-line {
            > button {
              margin-left: 10px;
            }
          }
        }
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
  .home-lever {
    display: flex;
    cursor: pointer;
    > span {
      flex: 1;
    }
    .home-lever-num {
      background-color: #1e1b50;
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
                <div>
                  <img class="b-icon" :src="'./assets/' + userInfo.symbol0 + '.png'" />
                  <img class="b-icon" :src="'./assets/' + userInfo.symbol1 + '.png'" />
                  <span class="fw-fff ml-10"> {{ userInfo.swapperName }}</span>
                  <a-divider type="vertical" style="background: #4d4bbf" />
                  <span class="fw-fff"> {{ userInfo.symbol0 }}/{{ userInfo.symbol1 }} </span>
                </div>
                <div class="back-table_item-thead-text">
                  <span class="text-c">{{ $t('Farm.user.pendingReward') }} </span>
                  <span class="fw-fff">
                    {{ $tranNumber(userInfo.pendingReward, 2) }} {{ userInfo.rewardSymbol }}
                  </span>
                  <div class="back-table_item-thead-btn-line">
                    <a-button type="primary" size="small" @click="openCard(userInfo, 'reinvest')"
                      >{{ $t('Operation.reinvest') }}
                    </a-button>
                    <a-button type="primary" size="small" @click="openCard(userInfo, 'claim')">{{
                      $t('Operation.claim')
                    }}</a-button>
                  </div>
                </div>
              </div>
              <div class="back-table_item-body" v-if="!!userInfo.totalDebt">
                <div class="back-table_item-body-text">
                  <span class="text-c">{{ $t('Farm.borrowSymbol') }} </span>
                  <span>
                    <img class="b-icon" :src="'./assets/' + userInfo.borrowSymbol + '.png'" />
                    <span class="fw-fff ml-10"> {{ userInfo.borrowSymbol }} </span>
                  </span>
                </div>
                <div class="back-table_item-body-text">
                  <span class="text-c">{{ $t('Farm.totalAssets') }} </span>
                  <span class="fw-fff">
                    ${{ $tranNumber(userInfo.totalAssets, 2) }}
                    <a-tooltip placement="right" color="#5C5CE6">
                      <template #title>
                        {{ $t('Farm.lp') }}:
                        <span>{{
                          $tranNumber(userInfo.amount0, 4) +
                          userInfo.symbol0 +
                          '+' +
                          $tranNumber(userInfo.amount1, 4) +
                          userInfo.symbol1
                        }}</span>
                      </template>
                      <InfoCircleOutlined />
                    </a-tooltip>
                  </span>
                </div>
                <div class="back-table_item-body-text">
                  <span class="text-c">{{ $t('Farm.user.totalDebt') }} </span>
                  <span class="fw-fff">
                    ${{ $tranNumber(userInfo.totalDebt, 2) }}
                    <a-tooltip placement="right" color="#5C5CE6">
                      <template #title>
                        {{ $t('Farm.debt') }}:
                        <span>{{
                          $tranNumber(userInfo.debtAmount, 4) +
                          userInfo.borrowSymbol +
                          '+' +
                          $tranNumber(userInfo.debtInterest, 4) +
                          userInfo.borrowSymbol
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
                  <span
                    style="font-weight: 700"
                    :class="
                      !userInfo.healthy
                        ? 'fw-fff'
                        : userInfo.healthy < 0.2
                        ? 'healthy-text'
                        : userInfo.healthy > 0.8
                        ? 'error-text'
                        : 'prompt-text'
                    "
                    >{{ $tranNumber(userInfo.healthy * 100, 2) }}
                  </span>
                </div>
                <div class="back-table_item-body-btn">
                  <div class="back-table_item-body-btn-line">
                    <a-button type="primary" size="small" @click="openCard(userInfo, 'add')">
                      {{ $t('Operation.add') }}</a-button
                    >
                    <a-button type="primary" size="small" @click="openCard(userInfo, 'repay')">{{
                      $t('Operation.repay')
                    }}</a-button>
                    <a-button type="primary" size="small" @click="openCard(userInfo, 'divest')">{{
                      $t('Operation.divest')
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
            <a-select class="debtToken-select" v-model:value="record.debtToken">
              <a-select-option value="0">
                <div>
                  <img class="b-icon" :src="'./assets/' + record.symbol0 + '.png'" />
                  {{ record.symbol0 }}
                </div>
              </a-select-option>
              <a-select-option value="1">
                <div>
                  <img class="b-icon" :src="'./assets/' + record.symbol1 + '.png'" />
                  {{ record.symbol1 }}
                </div>
              </a-select-option>
            </a-select>
          </template>
          <template #lever="{ record }">
            <div class="home-lever">
              <span @click="uptatelever(record, -1)"> - </span>
              <span class="fw-fff home-lever-num"> {{ record.debtRatio }} </span>
              <span @click="uptatelever(record, 1)"> + </span>
            </div>
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
      loading: false,
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
        item.marks = lever[item.leverageRate].marks;
        item.debtRatio = +item.leverageRate;
        item.debtToken = '0';
        return item;
      });
    },
    async getUserInfoList() {
      const res = await getUserInfoList();
      console.log('getUserInfoList--->', res);
      this.userInfoList = res;
    },
    uptatelever(item, num) {
      const arr = lever[item.leverageRate].arr;
      const index = arr.findIndex((lever) => lever == item.debtRatio) + num;
      item.debtRatio = +arr[index] || item.debtRatio;
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