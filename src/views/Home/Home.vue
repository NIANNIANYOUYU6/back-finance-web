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
      <div class="deposit-account_title">账户持仓</div>
      <a-table
        rowKey="address"
        :dataSource="userInfoList"
        :columns="myColumns"
        :pagination="false"
        :loading="loading"
      >
        <template #debtTooltip>
          <span>风险值</span>
          <a-tooltip placement="right">
            <template #title>
              <span>风险值超过100会被执行清算，请尽量控制风险值在80以内。</span>
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>

        <template #currentTotalAsset="{ text, record }">
          ${{ $tranNumber(text, 2) }}
          <a-tooltip placement="right">
            <template #title>
              LP预估:
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

        <template #totalDebt="{ text, record }">
          ${{ $tranNumber(text, 2) }}
          <a-tooltip placement="right">
            <template #title>
              负债:
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
        <template #action="{ record }">
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'add')"
            >加仓</a-button
          >
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'repay')"
            >还贷</a-button
          >
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'divest')"
            >撤资</a-button
          >
          <a-button type="primary" size="small" @click="openCard(record, 'reinvestOrClaim')"
            >复投/收获</a-button
          >
        </template>
      </a-table>
    </div>
    <div class="deposit-account">
      <div class="deposit-account_title">全部</div>
      <a-table
        rowKey="address"
        :dataSource="pairsList"
        :columns="pairsColumns"
        :pagination="false"
        :loading="loading"
      >
        <template #rewardTooltip>
          <span>收益率APY</span>
          <a-tooltip placement="right">
            <template #title>
              <span>流动性挖矿APY * 杠杆率+平台挖矿APY-借款APY</span>
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
              <span style="text-decoration: line-through">
                {{
                  $tranNumber(
                    (record.leverageRate * record.liquidityAPY +
                      (record.leverageRate - 1) * record['platformAPY' + record.debtToken] -
                      (record.leverageRate - 1) * record['interestAPY' + record.debtToken]) *
                      100,
                    2
                  )
                }}%
              </span>
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
          <span>杠杆</span>
          <a-tooltip placement="right">
            <template #title>
              <span
                >杠杆值为1x时默认没有借贷，当杠杆值＞1x时，BACK会根据投资的本金金额借贷相应金额一起投入到选中的矿池中，因此你可以获得更高的流动性挖矿收益</span
              >
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
        <template #action="{ record }">
          <a-button
            style="margin-right: 10px"
            type="primary"
            size="small"
            @click="openCard(record, 'farm')"
            >挖矿 {{ record.debtRatio }}X</a-button
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
          title: '矿池',
          dataIndex: 'swapperName',
          width: 160,
          customRender: ({ text, record }) => {
            return {
              children: (
                <div style="display:flex ">
                  <div style="height: 20px;line-height: 44px;margin-right:10px">
                    <img class="b-icon" src={'./img/icon/' + record.symbol0 + '.png'} />
                    <img class="b-icon" src={'./img/icon/' + record.symbol1 + '.png'} />
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
          title: '借贷币种',
          dataIndex: 'borrowSymbol',
          align: 'center',
          customRender: ({ text }) => {
            text;
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
          title: '当前总资产',
          dataIndex: 'totalAssets',
          align: 'center',
          slots: { customRender: 'currentTotalAsset' },
        },
        {
          title: '当前总负债',
          dataIndex: 'totalDebt',
          align: 'center',
          slots: { customRender: 'totalDebt' },
        },
        {
          title: '待领取挖矿收益',
          dataIndex: 'pendingReward',
          align: 'center',
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
          title: '操作',
          align: 'center',
          width: 300,
          slots: { customRender: 'action' },
        },
      ],
      pairsColumns: [
        {
          title: '矿池',
          dataIndex: 'swapperName',
          width: 170,
          customRender: ({ text, record }) => {
            return {
              children: (
                <div style="display:flex ">
                  <div style="height: 20px;line-height: 44px;margin-right:10px">
                    <img class="b-icon" src={'./img/icon/' + record.symbol0 + '.png'} />
                    <img class="b-icon" src={'./img/icon/' + record.symbol1 + '.png'} />
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
          title: '总锁仓Token',
          dataIndex: 'Token',
          customRender: ({ text, record }) => {
            text;
            return {
              children: (
                <div>
                  <div>
                    <img class="b-icon" src={'./img/icon/' + record.symbol0 + '.png'} />
                    <span style="margin-left:10px">{this.$tranNumber(record.amount0, 4)}</span>
                  </div>
                  <div>
                    <img class="b-icon" src={'./img/icon/' + record.symbol1 + '.png'} />
                    <span style="margin-left:10px">{this.$tranNumber(record.amount1, 4)}</span>
                  </div>
                </div>
              ),
            };
          },
        },
        {
          title: '借贷币种',
          dataIndex: 'debtToken',
          align: 'center',
          slots: { customRender: 'debtToken' },
        },
        {
          align: 'center',
          width: 150,
          slots: { customRender: 'lever', title: 'leverTooltip' },
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          slots: { customRender: 'action' },
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