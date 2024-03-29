module.exports = {
  locale: 'English',
  switchLang: '中文',
  Operation: {
    operating: 'Action', 
    ok :'Confirm',
    receive: 'Claim',
    warrant: 'Approve',
    depositBtn: 'Deposit',
    takeBtn: 'Withdraw',
    add: 'ADD',
    repay: 'REPAY',
    divest: 'STOP',
    reinvest : 'REINVEST',
    claim:'HARVEST',
    farm:'Farm',
    liquidate:'Liquidate',
    loading :"loading"
  },
  Prompt: {
    error1:'insufficient amount of authorization',
    error2:'insufficient wallet balance',
    error3:'numbers only',
    error4:'cannot be null or zero',
    error5:'insufficient balance',
    error6: 'can not exceed the current total liabilities',
    error7: 'the maximum scale is 100',
    error8: 'insufficient balance in the deposit pool',
  },
  // 侧边栏菜单
  Sidebar: {
    balance: 'Balance ', 
    profit: 'To be claimed',
    button: 'Claim BACK',
    docs: "Doc",
    router: {
      title1: 'Yield farming',
      title2: 'Earn market',
      title3: 'Liquidation pool',
    },
  },
  // 顶部栏
  Header: {
    lockUp: 'Total Value Locked',
    deposit: 'Total Supply',
    allocation: 'Total Borrow',
    price: 'Current Price',
    output: 'Circulating Supply',
  },
  // 存款
  Deposit: {
    symbol: 'Assets', 
    income: 'APY',
    incomeRemind: 'Supply APY+Back Rewards APY',
    myDeposit: 'Balance',
    account: {
      title: 'Your Supply',
      // 这是更新的中文
      remind:
        '  Important note: ibToken (ibUSDT、ibBTC、ibETH etc.) obtained by deposit is an important deposit certificate, please do not transfer it to others！',
      amountSupply: 'Supply Balance',
    },
    all: {
      title: 'All Earn Markets',
      totalShare: 'Total Supply',
      remain: 'Liquidity',
      useRatio: 'Utilization',
    },
  },
  // 杠杆
  Farm:{
    pair: "Pool",
    borrowSymbol: "Loan token",
    healthy: "Risk value",
    healthyRemind: "If the risk value exceeds 100,it will be liquidated.Please try to control the risk value wihtin 80",
    healthyRemind1: "Please note that when the risk value exceeds 100, the asset will be liquidated Borrowing may incur a 0.3% cost of SWAP,please choose the token of borrowing carefully. ",
    healthyRemind2: "Note: BACK will not admit any fees during the leveraged position opening process.",
    lp: "LP estimate",
    debt: "Debt",
    totalAssets: "Total Collateral Value",
    user: {
      title: "Your Positions",
      totalDebt: "Total Debt Value",
      pendingReward: "Earned",
    },
    all: {
      title: "All Farm Pools",
      income:"APY",
      incomeRemind: "Yield Farm APY*leverage+Back Rewards APY*(leverage-1)-Borrow APY*(leverage-1)",
      totalLock: "Underlying Tokens",
      lever: "Leverage" ,
      leverRemind: "1x means no leverage.Anything above 1x means Back Finance will borrow some assets on your behalf to supply more capital(capital you invested + borrowed ) to the selected pool，so you can earn higher yield farming APY." ,
    },
    display: {
      add1: "Converted investment assets into",
      transform: "Based on the current exchange price forecasts into mine pool trading on quantity.",
      add2: "Assets after add position",
      add3: "Risk value after add position",
      repay1: "Loan repayment quantity",
      repay2: "Debt after loan repayment",
      repay3: "Risk value after loan repayment",
      divest1: "Withdrawal proportion",
      divest2: "Withdrawals assets",
      divest3: "Select assets to Withdrawal",
      default: "Default",
      divest3Remind: "The default is to return the remaining assets according to the minimum slip point of the transaction",
      divest4: "Expected Withdrawal of assets",
      divest4Remind: "Remaining assets after completing the corresponding proportion of loan + interest repayment.",
      claim1: "Mining earnings",
      reinvest1: "Converted investment assets into",
      reinvest2: "Risk value after redelivery",
    },
    farm: {
      farm1: "Invested assets",
      farm2: "Loan amount",
      farm3: "The remaining can borrow",
      farm4: "remain",
      farm5: "Converted investment assets into",
      farm6: "Farm",
      liquidityAPY: "Yield Farm APY",
      liquidityAPYRemind: "Liquidity mining proceeds of the exchange can be harvested and reinvested in the account position list at any time.",
      platformAPY: "Back Rewards APY",
      platformAPYRemind: "Back rewards user for liquidity mining.You can claim at any time.",
      remainAmount: "Borrow APY"
    }
  },
  Liquidate: {
    title: "Liquidation zone",
    mortgage :"Mortgage asset value",
    liabilities :"Loan value",
    liquidateTotal: "Total assets to be liquidated",
    totalDebt: "Total assets in debt",
    liquidate1: "Liquidation discount",
    liquidate2: "Proportion of liquidated assets",
    liquidate3: "Estimated liquidation expense",
    liquidate3Remind: "Estimates costs according to assets liquidation discount purchase liquidation assets",
    liquidate4: "Liquidation income",
  }
};