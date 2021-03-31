<style lang='scss' scoped >
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
      <div class="deposit-account_title">
        <img style="height: 26px; margin-right: 10px" src="../../assets/icon.png" alt="" />
        {{ $t('Farm.user.title') }}</div
      >
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
        <template #borrowSymbol>
          <span>{{ $t('Farm.borrowSymbol') }} </span>
        </template>
        <template #totalAssets>
          <span>{{ $t('Farm.totalAssets') }} </span>
        </template>
        <template #totalDebt>
          <span>{{ $t('Farm.user.totalDebt') }} </span>
        </template>
        <template #pendingReward>
          <span>{{ $t('Farm.user.pendingReward') }} </span>
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
            @click="openCard(record, 'add')"
          >
            {{ $t('Operation.add') }}</a-button
          >
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'repay')"
            >{{ $t('Operation.repay') }}</a-button
          >
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'divest')"
            >{{ $t('Operation.divest') }}</a-button
          >
          <a-button type="primary" size="small" @click="openCard(record, 'reinvestOrClaim')"
            >{{ $t('Operation.reinvest') }}/{{ $t('Operation.claim') }}</a-button
          >
        </template>
      </a-table>
    </div>
    <div class="deposit-account">
      <div class="deposit-account_title">
        <img style="height: 26px; margin-right: 10px" src="../../assets/icon.png" alt="" />
        {{ $t('Farm.all.title') }}
      </div>
      <a-table
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
          <a-tooltip placement="right">
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
          <a-tooltip placement="right">
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
    </div>
    <AddWarehouse :pairsItem="pairsItem" v-if="openCardMode === 'add'" @close="closeCard" />
    <Divest :pairsItem="pairsItem" v-if="openCardMode === 'divest'" @close="closeCard" />
    <Repay :pairsItem="pairsItem" v-if="openCardMode === 'repay'" @close="closeCard" />
    <Farm :pairsItem="pairsItem" v-if="openCardMode === 'farm'" @close="closeCard" />
    <ReinvestOrClaim
      :pairsItem="pairsItem"
      v-if="openCardMode === 'reinvestOrClaim'"
      @close="closeCard"
    />
  </div>
</template>
<script>
import AddWarehouse from './AddWarehouse';
import Farm from './Farm';
import Divest from './Divest';
import Repay from './Repay';
import ReinvestOrClaim from './ReinvestOrClaim';

import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { lever } from '../../common/const.js';

// 引入方法
import { getPairList, getUserInfoList, fetchData } from '../../common/src/back_main';

export default {
  components: {
    AddWarehouse,
    Repay,
    Divest,
    Farm,
    ReinvestOrClaim,
    QuestionCircleOutlined,
    InfoCircleOutlined,
  },
  data() {
    return {
      openCardMode: '',
      pairsList: [],
      userInfoList: [],
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