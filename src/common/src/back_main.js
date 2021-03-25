import { BACK_ABI } from './back_abi.js'
import { chainIdDict, ContractAddress, tokenAddres, pairAddress, tokensPrice } from './back_const.js';
import { convertBigNumberToNormal, convertNormalToBigNumber, findToken } from './back_utils.js'

var BACK_MAIN = {
    resMsg: {
        code: -300,
        msg: "not install MetaMask",
        data: {
            currentChain: "",
            account: "",
        }
    },
    account: "",
    chainId: "",
    web3: null,
    tokenDic: {},
    pairList: [], 
    poolList: [],
    backInfo: {}
}

export function _getTokenPrice(token) {
    let pool = BACK_MAIN.poolList.find(i => i.supplyToken === token);
    return pool ? pool.price: 0;
}

export function getLPPrice(pair) {
    let reserve0 = pair.reserve0;
    let reserve1 = pair.reserve1;
    let totalSupply = pair.lpSupply;

    let price0 = _getTokenPrice(pair.token0);
    let price1 = _getTokenPrice(pair.token1);

    return (reserve0 * price0 + reserve1 * price1) / totalSupply;
}

async function _getBackPrice() {//bk价格   $0.4
    return 0.4;
}

async function _getLPPrice() {//lp价格
    return 540;
}

export async function _getKeepInsterestRatio(_address) {//利息保留比例
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let keepInstestRatio = await backQueryContract.methods.batchGetConfigValues(_address, [BACK_MAIN.web3.utils.utf8ToHex("BACK_TEAM_REWARD")]).call();
    return convertBigNumberToNormal(keepInstestRatio);
}

export function setupTokenList(list) { //存储到数据中心
    BACK_MAIN.tokenDic = {};
    for (let i = 0; i < list.length; i++) {
        BACK_MAIN.tokenDic[list[i].address] = list[i];
    }
}

export async function fetchData() {
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let pairList = await backQueryContract.methods.pairList().call({from:BACK_MAIN.account});
    let poolList = await backQueryContract.methods.poolList().call({from:BACK_MAIN.account});
    console.log("---------poolList--------",poolList)
    let info = await backQueryContract.methods.getBackInfo().call();
    BACK_MAIN.pairList = [];
    BACK_MAIN.poolList = [];

    BACK_MAIN.backInfo = {
        amountPerBlock: convertBigNumberToNormal(info.amountPerBlock),
        price: convertBigNumberToNormal(info.price),
        totalWeight: convertBigNumberToNormal(info.totalWeight),
    };
    for(let item of pairList) {
        let pair = {};
        pair.borrow0 = parseFloat(convertBigNumberToNormal(item["borrow0"]));
        pair.borrow1 = parseFloat(convertBigNumberToNormal(item["borrow1"]));
        pair.lpSupply = parseFloat(convertBigNumberToNormal(item["lpSupply"]));
        pair.mdxLP = item["mdxLP"];
        pair.address = item["pair"];
        pair.pid = item["pid"];
        pair.reserve0 = parseFloat(convertBigNumberToNormal(item["reserve0"]));
        pair.reserve1 = parseFloat(convertBigNumberToNormal(item["reserve1"]));
        pair.strategy = item["strategy"];
        pair.token0 = item["token0"];
        pair.token1 = item["token1"];
        pair.totalPledge = parseFloat(convertBigNumberToNormal(item["totalPledge"]));
        BACK_MAIN.pairList.push(pair);
    }

    for(let item of poolList) {
        let pool = {};
        pool.backPerBorrow = parseFloat(convertBigNumberToNormal(item["backPerBorrow"]));
        pool.backPerDeposit = parseFloat(convertBigNumberToNormal(item["backPerDeposit"]))
        pool.interestPerBorrow = parseFloat(convertBigNumberToNormal(item["interestPerBorrow"]));
        pool.interestRate = parseFloat(convertBigNumberToNormal(item["interestRate"]));
        pool.address = item["pool"];
        pool.price = parseFloat(convertBigNumberToNormal(item["price"]));
        pool.supplyToken = item["supplyToken"];
        pool.balance = parseFloat(convertBigNumberToNormal(item["balance"]));
        pool.totalBorrow = parseFloat(convertBigNumberToNormal(item["totalBorrow"]));
        pool.totalShare = parseFloat(convertBigNumberToNormal(item["totalShare"]));
        pool.totalSupply = parseFloat(convertBigNumberToNormal(item["totalSupply"]));
        pool.backWeight = 3333;
        pool.depositPercent = parseInt(item["depositPercent"]);
        BACK_MAIN.poolList.push(pool);
    }

    console.log(BACK_MAIN.pairList, BACK_MAIN.poolList, BACK_MAIN.backInfo);
}

export async function queryAssetList() {
    let data = [];
    for (let key in tokenAddres[BACK_MAIN.chainId]) {
        let _temp = await getAssetInfo(tokenAddres[BACK_MAIN.chainId][key]);
        data.push(_temp.data);
    }
    return { data: data };
}

export async function queryPairsList() {
    let data = [];
    for (let key in pairAddress[BACK_MAIN.chainId]) {
        let _temp = await getPairInfo(pairAddress[BACK_MAIN.chainId][key]);
        data.push(_temp.data);
    }
    return { data: data };
}


export async function  getTitles() {
    let totalDeposit = 0;
    let totalBorrow = 0;
    for(let pool of BACK_MAIN.poolList) {
        totalDeposit += pool.totalShare * pool["price"];
        totalBorrow += pool.totalBorrow * pool["price"];
    }

    let totalPledge = 0;
    for(let pair of BACK_MAIN.pairList) {
        totalPledge += convertBigNumberToNormal(pair.totalPledge) * getLPPrice(pair);
    }

    let _backInfo = await getBackInfo();

    let backTokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_TOKEN, ContractAddress[BACK_MAIN.chainId].backToken);
    let _backSupply = await backTokenContract.methods.totalSupply().call();
    let backSupply = convertBigNumberToNormal(_backSupply);

    return {
        data: {
            backBalance: await getBalance(ContractAddress[BACK_MAIN.chainId].backToken),
            queryBack: _backInfo.data.queryBack,
            totalLock: totalPledge,
            totalDeposit: totalDeposit,
            totalBorrow: totalBorrow,
            backSupply: backSupply,
        }
    }
}

export async function getBackInfo() {
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    let _queryBack = await backPlatformContract.methods.queryBack().call();                    //back总量
    let queryBack = convertBigNumberToNormal(_queryBack, getDecimal(ContractAddress[BACK_MAIN.chainId].backToken));
    return { data: { queryBack: queryBack } };
}

export function getTokenAddress(symbol) {//获取token地址
    return tokenAddres[BACK_MAIN.chainId][symbol] || "not know";
}

export function getPlatformAddress() {     //获取platform的地址
    return ContractAddress[BACK_MAIN.chainId].backPlatformContract;
}

export function getTokenSymbol(token_address) {//获取symbol
    let symbol = findToken(tokenAddres[BACK_MAIN.chainId], token_address);
    return symbol || "not know";
}

export async function getBalance(token_address) { //查币的余额
    let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    let balance = await tokenContract.methods.balanceOf(BACK_MAIN.account).call();
    return convertBigNumberToNormal(balance);
}

export function getDecimal(token) {//获取币的精度位数
    return BACK_MAIN.tokenDic[token] ? BACK_MAIN.tokenDic[token].decimals : 18;
}

export async function getTokenInfo(token_address) {//获取币的信息
    let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    let address = token_address;
    let symbol = await tokenContract.methods.symbol().call();
    let balance = await getBalance(token_address);
    let decimals = await tokenContract.methods.decimals().call();
    return { data: { address, symbol, balance, decimals } };
}

export async function isApprovedToken(token_address) {//是否授权过   approve
    let amount = await getAllowance(token_address)
    return { data: { isApproved: amount > 0 } };
}

export async function getAllowance(token_address) { //获取授权值
    let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    let allowance = await tokenContract.methods.allowance(BACK_MAIN.account, getPlatformAddress()).call();
    return convertBigNumberToNormal(allowance, getDecimal(token_address));
}

export async function getLiquidityAmount(tokenA_address, tokenB_address, amount0, amount1) {
    // let pairSwapContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_MDEXSWAPPER, ContractAddress[BACK_MAIN.chainId].mdexSwapperContract);
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let _amount0 = convertNormalToBigNumber(amount0, getDecimal(tokenA_address));
    let _amount1 = convertNormalToBigNumber(amount1, getDecimal(tokenB_address));
    let res = await backQueryContract.methods.getLiquidityAmount2(tokenA_address, tokenB_address, _amount0, _amount1).call();
    let amountIn0 = convertBigNumberToNormal(res.amountIn0);     //实际:加进去tokenA的值
    let amountIn1 = convertBigNumberToNormal(res.amountIn1);     //实际:加进去tokenB的值
    let liquidity = convertBigNumberToNormal(res.liquidity);     //实际:lp的数量
    return { data: { amountIn0, amountIn1, liquidity } };
}

export function getTokenPrices(token_symbol) { //拿价格 用symbol
    return tokensPrice[token_symbol];
}

export async function getTokenPricesByAddress(token_address) {//拿价格  用地址
    let configContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_CONFIG, ContractAddress[BACK_MAIN.chainId].backConfigContract);
    let prices = await configContract.methods.prices(token_address).call();
    return { data: { prices: convertBigNumberToNormal(prices, getDecimal(token_address)) } };
}

export async function getPairInfo(pair_address) {//获取借款信息
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let [clearLine, maxDebtRatio] = await backQueryContract.methods.batchGetConfigValues(pair_address,
        [BACK_MAIN.web3.utils.utf8ToHex("PAIR_LIQUIDATION_RATE"),
        BACK_MAIN.web3.utils.utf8ToHex("PAIR_LEVERAGE_RATE")]).call();

    let res = await backQueryContract.methods.getPairInfo(pair_address).call({ from: BACK_MAIN.account });
    let totalBorrowTokenA = convertBigNumberToNormal(res._totalBorrowTokenA, getDecimal(res._tokenA));
    let totalBorrowTokenB = convertBigNumberToNormal(res._totalBorrowTokenB, getDecimal(res._tokenB));

    let tokenA_borrowInfo = res._tokenA_borrowInfo;
    let tokenB_borrowInfo = res._tokenB_borrowInfo;

    let tokenAPledge = convertBigNumberToNormal(res._tokenAPledge);                                            //pair的tokenAPledge 
    let tokenBPledge = convertBigNumberToNormal(res._tokenBPledge);                                            //pair的tokenBPledge  
    let totalPledge = convertBigNumberToNormal(res._totalPledge);
    //pair的amountPledge  

    let reserves = res.reserve;
    console.log(reserves)
    let totalLP = convertBigNumberToNormal(reserves.totalLP);
    let reservesA = convertBigNumberToNormal(reserves.reserveA, getDecimal(res._tokenA));
    let reservesB = convertBigNumberToNormal(reserves.reserveB, getDecimal(res._tokenB));

    let tokenAPoolInfo = await getAssetInfo(res._tokenA);
    let totalSupplyA = tokenAPoolInfo.data.totalSupply;
    let interestAPerBlock = tokenAPoolInfo.data.interestPerBorrow;
    let debtAAPY = tokenAPoolInfo.data.debtAPY;
    let remainA = tokenAPoolInfo.data.remain;

    let tokenBPoolInfo = await getAssetInfo(res._tokenB);
    let totalSupplyB = tokenBPoolInfo.data.totalSupply;
    let interestBPerBlock = tokenBPoolInfo.data.interestPerBorrow;
    let debtBAPY = tokenBPoolInfo.data.debtAPY;
    let remainB = tokenBPoolInfo.data.remain;

    let _liquidityAMiningAPY = 0;
    let _liquidityBMiningAPY = 0;

    let mdexAPY = getLPAPR([getTokenSymbol(res._tokenA) + '/' + getTokenSymbol(res._tokenB)]);

    if (totalPledge > 0) {
        _liquidityAMiningAPY = mdexAPY[0].apr / (totalPledge * await _getLPPrice()) * 10512000;
        _liquidityBMiningAPY = mdexAPY[0].apr / (totalPledge * await _getLPPrice()) * 10512000;
    }

    let totalBorrowValue = totalBorrowTokenA * tokensPrice[getTokenSymbol(res._tokenA)] + totalBorrowTokenB * tokensPrice[getTokenSymbol(res._tokenB)];                             //价格由预言机给
    let platformDebtAAPY = 0;
    let platformDebtBAPY = 0;
    if (totalBorrowValue > 0) {
        platformDebtAAPY = (
            (interestAPerBlock * await _getBackPrice()) /
            (totalBorrowValue * tokensPrice[getTokenSymbol(res._tokenA)])
        ) * 10512000;
        platformDebtBAPY = (
            (interestBPerBlock * await _getBackPrice()) /
            (totalBorrowValue * tokensPrice[getTokenSymbol(res._tokenB)])
        ) * 10512000;
    }
    let supplyANumberA = 0;
    let supplyBNumberA = 0;
    let supplyANumberB = 0;
    let supplyBNumberB = 0;
    if (totalSupplyA > 0) {
        supplyANumberA = tokenAPledge / totalSupplyA * reservesA;
        supplyBNumberA = tokenBPledge / totalSupplyA * reservesA;
    }

    if (totalSupplyB > 0) {
        supplyANumberB = tokenAPledge / totalSupplyB * reservesB;
        supplyBNumberB = tokenBPledge / totalSupplyB * reservesB;
    }
    // let priceA = await getTokenPricesByAddress(res._tokenA);
    // let priceB = await getTokenPricesByAddress(res._tokenB);
    console.log(totalLP)
    return {
        data: {
            pairAddress: pair_address,
            source: "Mdex",
            bourse: 0,
            mdexLPAPY: mdexAPY[0].apr,
            maxDebtRatio: convertBigNumberToNormal(maxDebtRatio),
            BACK: 0.4,
            LP: 540,
            totalPledge: totalPledge,
            tokenA: {
                address: res._tokenA,
                symbol: getTokenSymbol(res._tokenA),
                prices: tokensPrice[getTokenSymbol(res._tokenA)],
                supplyNumberA: supplyANumberA,
                supplyNumberB: supplyANumberB,
                currentTotalAsset: tokenAPledge,
                currentTotalDebt: convertBigNumberToNormal(tokenA_borrowInfo.amount),
                interest: convertBigNumberToNormal(tokenA_borrowInfo.interest),
                totalLockedPosition: reservesA * totalPledge / totalLP,
                liquidityMiningAPY: _liquidityAMiningAPY,
                platformMiningAPY: platformDebtAAPY,
                debtAPY: debtAAPY,
                remain: remainA,
                clearLine: convertBigNumberToNormal(clearLine),
            },
            tokenB: {
                address: res._tokenB,
                symbol: getTokenSymbol(res._tokenB),
                supplyNumberA: supplyBNumberA,
                supplyNumberB: supplyBNumberB,
                prices: tokensPrice[getTokenSymbol(res._tokenB)],
                currentTotalAsset: tokenBPledge,
                currentTotalDebt: convertBigNumberToNormal(tokenB_borrowInfo.amount),
                interest: convertBigNumberToNormal(tokenB_borrowInfo.interest),
                totalLockedPosition: reservesB * totalPledge / totalLP,
                liquidityMiningAPY: _liquidityBMiningAPY,
                platformMiningAPY: platformDebtBAPY,
                debtAPY: debtBAPY,
                remain: remainB,
                clearLine: convertBigNumberToNormal(clearLine),
            },
        }
    };
}


export async function getDivestAmount(//撤资
    token0,
    token1,
    deptToken,
    receiveToken,
    token0Amount,
    token1Amount,
    divestAmount) {
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let _token0Amount = convertNormalToBigNumber(token0Amount);
    let _token1Amount = convertNormalToBigNumber(token1Amount);
    let _divestAmount = convertNormalToBigNumber(divestAmount);
    let res = await backQueryContract.methods.getDivestAmount(token0, token1, deptToken, receiveToken, _token0Amount, _token1Amount, _divestAmount).call();
    return {
        data: {
            amount0: convertBigNumberToNormal(res.amount0),
            amount1: convertBigNumberToNormal(res.amount1)
        }
    };
}

export async function getReinvestAmount(//复投
    amountMDEX,
    token0,
    token1
) {
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let _amountMDEX = convertNormalToBigNumber(amountMDEX);
    let mdexTokenAddress = ContractAddress[BACK_MAIN.chainId].mdexToken;
    let res = await backQueryContract.methods.getReinvestAmount(mdexTokenAddress, _amountMDEX, token0, token1).call();
    return {
        data: {
            amount0: convertBigNumberToNormal(res.amount0),
            amount1: convertBigNumberToNormal(res.amount1)
        }
    };
}

export async function getPairAdressFromTokens(tokenA_address, tokenB_address, bourse) {//由tokens获取pair地址
    let backPairFactoryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PAIRFACTORY, ContractAddress[BACK_MAIN.chainId].backPairFactoryContract);
    let pair_address = await backPairFactoryContract.methods.getPair(tokenA_address, tokenB_address, bourse).call();
    return pair_address;
}

export async function getTokensFromPair(pair_address) {//由piar获取tokens
    let pairContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PAIR, pair_address);
    let tokenA_address = await pairContract.methods.token0().call();
    let tokenB_address = await pairContract.methods.token1().call();
    return { data: { tokenA_address: tokenA_address, tokenB_address: tokenB_address } }
}

export async function getAssetsList() {
    let amountPerBlock = BACK_MAIN.backInfo.amountPerBlock;
    let list = [];
    for(let pool of BACK_MAIN.poolList) {
        let totalAmount = pool.price * pool.totalShare;
        let poolPerBack = amountPerBlock * pool.backWeight / 10000 * pool.depositPercent / 10000 * 10512000;
        let item = {
            platformAPY: totalAmount === 0 ? 0: poolPerBack * BACK_MAIN.backInfo.price / totalAmount,
            depositAPY:  pool.totalShare === 0 ? 0: pool.interestRate * 0.9 * pool.totalBorrow / pool.totalShare * 10512000,
            totalDeposit: pool.totalShare,
            remainBorrow: pool.totalShare - pool.totalBorrow,
            price: pool.price,
            useRatio: pool.totalShare === 0 ? 0: pool.totalBorrow / pool.totalShare,
            address: pool.address,
            token: pool.supplyToken,
            symbol: getTokenSymbol(pool.supplyToken),
            amountDeposit: pool.totalShare === 0 ? 0: pool.balance / pool.totalSupply * pool.totalShare
        }
        list.push(item);
    }
    return list;
}

export async function getAssetInfo(token_address) {//获取存款信息 及 全部资产
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let res = await backQueryContract.methods.getAssetInfo(token_address).call({ from: BACK_MAIN.account });
    let _balanceOf = res._balanceOf;
    let _interestPerBorrow = res._interestPerBorrow;
    let _totalBorrow = res._totalBorrow;
    let _totalSupply = res._totalSupply;
    let _interestRate = res._interestRate;
    let _totalShare = res._totalShare;                      //总的存款价值
    let balanceOf = convertBigNumberToNormal(_balanceOf);
    let totalBorrow = convertBigNumberToNormal(_totalBorrow);
    let totalSupply = convertBigNumberToNormal(_totalSupply);
    let totalShare = convertBigNumberToNormal(_totalShare);
    let interestRate = convertBigNumberToNormal(_interestRate);   //存款利率
    let interestPerBorrow = convertBigNumberToNormal(_interestPerBorrow, getDecimal(token_address));
    let _amountSupply = 0;
    let useRatio = 0;
    if (totalSupply > 0) {
        _amountSupply = balanceOf * totalShare / totalSupply;  //个人资产  币的个数
        useRatio = totalBorrow / totalShare;
    }
    let debtAPY = interestRate * 10512000;
    let depositAPY = (1 - await _getKeepInsterestRatio(token_address)) * useRatio * debtAPY;
    let platformRewardAPY = 0;
    if (_amountSupply > 0) {
        let bkPrice = await _getBackPrice();
        let tokenPrice = await getTokenPrices(getTokenSymbol(token_address));
        platformRewardAPY = ((bkPrice * interestPerBorrow) / (totalShare * tokenPrice)) * 10512000;
    }
    let earningsAPY = platformRewardAPY + depositAPY;
    return {
        data: {
            interestPerBorrow: interestPerBorrow,
            amountSupply: _amountSupply,
            depositAPY: depositAPY,
            debtAPY: debtAPY,
            prices: tokensPrice[getTokenSymbol(token_address)],
            totalShare: totalShare,
            platformRewardAPY: platformRewardAPY,
            earningsAPY: earningsAPY,
            totalBorrow: totalBorrow,
            totalSupply: totalSupply,
            useRatio: useRatio,
            remain: totalShare - totalBorrow,
            symbol: getTokenSymbol(token_address),
            address: token_address,
        }
    };
}

export async function getTokenPoolAddress(token_address) {//获取存款池地址
    let backFactoryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_POOLFACTORY, ContractAddress[BACK_MAIN.chainId].backPoolFactoryContract);
    let tokenPool = await backFactoryContract.methods.getPool(token_address).call();
    return { data: { tokenPool: tokenPool } };
}

export async function deposit(token_address, amount, callback) {//存款
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    let bigAmount = convertNormalToBigNumber(amount, getDecimal(token_address));
    executeContract(backPlatformContract, "deposit", 0, [token_address, bigAmount], callback);
}

export async function invest(pair_address, _amount0, _amount1, debtToken_address, _debtAmount, deadline, callback) {//加仓  pairaddress  deadline   当前时间时间戳秒的
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    let amount0 = convertNormalToBigNumber(_amount0, getDecimal(debtToken_address));
    let amount1 = convertNormalToBigNumber(_amount1, getDecimal(debtToken_address));
    let debtAmount = convertNormalToBigNumber(_debtAmount, getDecimal(debtToken_address));
    deadline = deadline + 15 * 60;
    executeContract(backPlatformContract, "invest", 0, [pair_address, amount0, amount1, debtToken_address, debtAmount, deadline], callback);
}

export async function withdraw(token_address, amount, callback) {//取款
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    let bigAmount = convertNormalToBigNumber(amount, getDecimal(token_address));
    executeContract(backPlatformContract, "withdraw", 0, [token_address, bigAmount], callback);
}

export async function divest(pair_address, radio, tokenA_address, tokenB_address, deadline, callback) {//撤资 token:借的token  tokenB:想要的token  radio百分数即可  50%就是50     deadline   当前时间戳秒的
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    radio = radio * 100;
    deadline = deadline + 15 * 60;
    executeContract(backPlatformContract, "divest", 0, [pair_address, radio, tokenA_address, tokenB_address, deadline], callback);
}

export async function repay(pair_address, token_address, amount, callback) {//还贷
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    let bigAmount = convertNormalToBigNumber(amount, getDecimal(token_address));
    executeContract(backPlatformContract, "repay", 0, [pair_address, token_address, bigAmount], callback);
}

export async function reinvest(pair_address, token_address, deadline, callback) {//复投
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    deadline = deadline + 15 * 60;
    executeContract(backPlatformContract, "reinvest", 0, [pair_address, token_address, deadline], callback);
}

export async function claim(pair_address, token_address, callback) {//收取
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    executeContract(backPlatformContract, "claim", 0, [pair_address, token_address], callback);
}

export async function approveToken(token_address, callback) { //approve Token
    let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    let bigAmount = convertNormalToBigNumber("50000000", getDecimal(token_address));
    let platformaddres = getPlatformAddress();
    executeContract(tokenContract, "approve", 0, [platformaddres, bigAmount], callback);
}

export function transfer(token_address, to_address, amount, callback) {//转账
    let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    let bigAmount = convertNormalToBigNumber(amount, getDecimal(token_address));
    executeContract(tokenContract, "transfer", 0, [to_address, bigAmount], callback);
}

export function transferFrom(token_address, from_address, to_address, amount, callback) {//从**转账
    let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    let bigAmount = convertNormalToBigNumber(amount, getDecimal(token_address));
    executeContract(tokenContract, "transferFrom", 0, [from_address, to_address, bigAmount], callback);
}

export async function getAllReward(callback) {//领取收益
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    executeContract(backPlatformContract, "mintBack", 0, [], callback);
}

export function executeContract(contract, methodName, value, params, callback) {
    contract.methods[methodName](...params).send({ from: BACK_MAIN.account, value: value }).on('transactionHash', function (hash) {
        callback(0, hash);
    }).on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 1) {
            callback(1, receipt.transactionHash);
        }
    }).on('error', function (error, message) {
        if (message && message.transactionHash) {
            callback(3, message.transactionHash)
        } else {
            callback(2, error.message);
        }
    })
}

export async function connect(callback) {//链接metamask
    let resMsg = BACK_MAIN.resMsg;
    let _ethereum = window['ethereum'];
    if (!_ethereum) return resMsg;
    try {
        let accounts = await _ethereum.enable();
        BACK_MAIN.web3 = new window['Web3'](_ethereum);
        resMsg.code = 200;
        resMsg.msg = "success";
        resMsg.data.account = accounts[0];
        BACK_MAIN.account = accounts[0];
        resMsg.data.currentChain = chainIdDict[+_ethereum.networkVersion] || "not know";
        BACK_MAIN.chainId = +_ethereum.networkVersion;
        _ethereum.on("accountsChanged", (accounts) => {
            BACK_MAIN.account = accounts[0];
            callback("connectInfo", {
                account: BACK_MAIN.account,
                currentChain: chainIdDict[BACK_MAIN.chainId] || "not know",
            });
        });
        _ethereum.on("chainChanged", (chainId) => {
            BACK_MAIN.chainId = Number(chainId);
            callback("connectInfo", {
                account: BACK_MAIN.account,
                currentChain: chainIdDict[BACK_MAIN.chainId] || "not know",
            });
        });
        // fetchMdexApr()
    } catch (e) {
        console.log(e);
        resMsg.code = -200;
        resMsg.msg = "Wallet may be not loading";
    }
    return resMsg;
}

let mdexAprData = {
    price: 0,
    data: []
}
// let USDT2MDEXPairContract

// async function fetchMdexApr() {
//     fetch("https://gateway.mdex.cc/v2/mingpool/lps?mdex_chainid=128")
//         .then((res) => res.json())
//         .then((data) => {
//             mdexAprData.data = Object.values(data.result);
//         });
//     if (!USDT2MDEXPairContract) {
//         USDT2MDEXPairContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.MDEX_PAIR, ContractAddress[BACK_MAIN.chainId].usdtmdex);
//     }
//     let { _reserve0, _reserve1 } = await USDT2MDEXPairContract.methods.getReserves().call({ from: BACK_MAIN.account });
//     mdexAprData.price = _reserve0 / _reserve1
//     setTimeout(fetchMdexApr, 10 * 1000);
// }

// console.log(getLPAPR(["USDT/WHT",'WHT/ETH']))
export function getLPAPR(pariNameArr) {
    let ret = pariNameArr.map(pair => ({ pair, apr: 1 }))
    if (mdexAprData.data.length === 0) return ret
    for (let i = 0; i < pariNameArr.length; i++) {
        const pair = pariNameArr[i]
        let [tokenA, tokenB] = pair.toUpperCase().split("/")
        let item = mdexAprData.data.find(item => item.pool_name === `${tokenA}/${tokenB}` || item.pool_name === `${tokenB}/${tokenA}`)
        if (item) {
            const apr = item.pool_mdx * 365 * mdexAprData.price / item.pool_mdx
            ret[i].apr = apr
        }
    }
    return ret
}

