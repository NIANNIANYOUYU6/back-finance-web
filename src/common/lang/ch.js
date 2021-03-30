module.exports = {
  locale: '中文',
  switchLang: 'English',
  Operation: {
    operating: '操作',
    ok :'确定',
    receive: '领取',
    warrant: '授权',
    depositBtn: '存款',
    takeBtn: '取款',
    add: '加仓',
    repay: '还贷',
    divest: '撤资',
    reinvest : '复投',
    claim:'收获',
    farm:'挖矿',
    liquidate:'清算',
  },
  Prompt: {
    error1:'授权额度不足',
    error2:'钱包余额不足',
    error3:'只能为数字',
    error4:'不能为空或零',
    error5:'存款余额不足',
    error6: '不能大于当前总负债',
    error7: '比例最多为100',
  },
  // 侧边栏菜单
  Sidebar: {
    balance: '钱包余额',
    profit: '待领收益',
    button: '领取收益',
    docs: "产品说明",
    router: {
      title1: '杠杆挖矿',
      title2: '存款市场',
      title3: '清算池',
    },
  },
  // 顶部栏
  Header: {
    lockUp: '总锁仓',
    deposit: '存款总量',
    allocation: '借贷总量',
    price: 'BK 价格',
    output: 'BK 挖矿产出',
  },
  // 存款
  Deposit: {
    symbol: '资产', 
    income: '收益率APY',
    incomeRemind: '存款APY+平台挖矿APY',
    myDeposit: '我的存款',
    account: {
      title: '账户存款',
      remind:
        '  重要提示 : 存款所得到的bkToken (bkUSBT、bkBTC、bkETH、bkHT等)是重要的存款凭证,请不要随意转移给其他人 !',
      amountSupply: '存款金额',
    },
    all: {
      title: '全部',
      totalShare: '存款总额',
      remain: '剩余可借',
      useRatio: '使用率',
    },
  },
  // 杠杆
  Farm:{
    pair: "矿池",
    borrowSymbol: "借贷币种",
    healthy: "风险值",
    healthyRemind: "风险值超过100会被执行清算，请尽量控制风险值在80以内。",
    healthyRemind1: "请注意：当风险值超过100时，资产将会被清算。借币可能会产生SWAP的0.3%成本，请谨慎选择借币币种。注：杠杆开仓的过程中BACK没有收取任何费用",
    healthyRemind2: "请注意：当风险值超过100时，资产将会被清算。借币可能会产生SWAP的0.3%成本，请谨慎选择借币币种。",
    lp: "LP预估",
    debt: "负债",
    totalAssets: "当前总资产",
    user: {
      title: "账户持仓",
      totalDebt: "当前总负债",
      pendingReward: "待领取挖矿收益",
    },
    all: {
      title: "全部",
      income:"收益率APY",
      incomeRemind: "流动性挖矿APY * 杠杆率+平台挖矿APY*(杠杆率-1)-借款APY*(杠杆率-1)",
      totalLock: "总锁仓 Token",
      lever: "杠杆" ,
      leverRemind: "杠杆值为1x时默认没有借贷，当杠杆值＞1x时，BACK会根据投资的本金金额借贷相应金额一起投入到选中的矿池中，因此你可以获得更高的流动性挖矿收益" ,
    },
    display: {
      add1: "加仓资产转化为",
      transform: "根据当前交易所价格预计投入的矿池交易对数量",
      add2: "加仓后总资产",
      add3: "加仓后风险值",
      repay1: "还贷数量",
      repay2: "还贷后负债",
      repay3: "还贷后风险值",
      divest1: "撤资比例",
      divest2: "撤资资产",
      divest3: "撤资资产选择",
      default: "默认",
      divest3Remind: "默认按照交易滑点最小的规则返还剩余资产",
      divest4: "预计撤资收回资产",
      divest4Remind: "完成相应比例借款+利息还款后剩余资产",
      claim1: "挖矿收益",
      reinvest1: "复投资产转化为",
      reinvest2: "复投后风险值",
    },
    farm: {
      farm1: "投资资产",
      farm2: "借贷",
      farm3: "剩余可借不足",
      farm4: "剩余",
      farm5: "投资资产转化为",
      farm6: "开始挖矿",
      liquidityAPY: "流动性挖矿APY",
      liquidityAPYRemind: "交易所流动性挖矿收益，可以随时在账户持仓列表中提取和复投。",
      platformAPY: "平台奖励APY",
      platformAPYRemind: "平台针对流动性挖矿奖励，可以随时提取。",
      remainAmount: "借贷APY"
    }
  },
  Liquidate: {
    title: "全部清算池",
    mortgage :"抵押资产价值",
    liabilities :"负债资产价值",
  }
};
