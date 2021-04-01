import { BACK_ABI } from './back_abi.js'
import { chainIdDict, ContractAddress, backNode } from './back_const.js';
import { convertBigNumberToNormal, convertNormalToBigNumber } from './back_utils.js'
import { request, gql } from 'graphql-request'

let YEAR = 10512000;
const swapper = {
    0: "MDEX",
    1: "BXH"
}
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
    loading: false,
    currentBlock: 0,
    tokenDic: {},
    pairList: [], 
    poolList: [],
    infoList: [],
    dataList: [],
    tokenList: [],
    liquidationList: [],
    backInfo: {}
}

async function fetchLiquidityList() {
    const query = gql`
      {
        records {
          owner
          pair
          borrowToken
          borrowAmount
          pledgeAmount
          interestAmount
          interestSettle
        }
      }
    `
    request(backNode, query).then(data => {
        BACK_MAIN.liquidationList = [];
        for(let item of data.records) {
            let liquidity = {}
            liquidity.pair = BACK_MAIN.web3.utils.toChecksumAddress(item["pair"]);
            let pair = BACK_MAIN.pairList.find(i => i.address === liquidity.pair);
            if(!pair) {
                continue;
            }
            liquidity.token0 = pair.token0;
            liquidity.token1 = pair.token1;
            liquidity.symbol0 = pair.symbol0;
            liquidity.symbol1 = pair.symbol1;
            liquidity.swapperName = swapper[pair.pid];
            liquidity.lpAmount = parseFloat(convertBigNumberToNormal(item["pledgeAmount"]));
            liquidity.owner = BACK_MAIN.web3.utils.toChecksumAddress(item["owner"]);
            liquidity.lpPrice = getLPPrice(pair);
            liquidity.borrowToken = BACK_MAIN.web3.utils.toChecksumAddress(item["borrowToken"]);
            liquidity.borrowInterest = parseFloat(convertBigNumberToNormal(item["interestAmount"], getDecimal(liquidity.borrowToken)));
            liquidity.borrowAmount = parseFloat(convertBigNumberToNormal(item["borrowAmount"], getDecimal(liquidity.borrowToken)));
            liquidity.borrowSymbol = getTokenSymbol(liquidity.borrowToken);
            let totalDebt = (liquidity.borrowInterest + liquidity.borrowAmount) * _getTokenPrice(liquidity.borrowToken);
            let totalAsset = liquidity.lpAmount * liquidity.lpPrice;
            liquidity.discount = 0.95;
            liquidity.health = totalDebt / totalAsset / pair.liquidationRate;
            BACK_MAIN.liquidationList.push(liquidity);
        }

        BACK_MAIN.liquidationList.sort((a, b) => b.health - a.health);
        BACK_MAIN.loading = false;
    });
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

export function _getAmountSwap(amount0, amount1, reserve0, reserve1) {
    let a = 997;
    let b = reserve0 * 1997;
    let _c = amount0 * reserve1 - (amount1 * reserve0);
    let c = (_c * 1000 / (amount1 + reserve1)) * reserve0;
    let d = a * c * 4;
    let e = Math.sqrt(b * b + d);
    return (e - b) / (a * 2);
}

export function _getAmountOut(amountIn, reserveIn, reserveOut) {
    let amountInWithFee = amountIn * 0.997;
    return amountInWithFee * reserveOut / (reserveIn + amountInWithFee);
}

export function _getAmountIn(amountOut, reserveIn, reserveOut) {
    return  reserveIn * amountOut / ((reserveOut - amountOut) * 0.997);
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
    if(BACK_MAIN.loading) {
        return
    }
    BACK_MAIN.loading = true;
    BACK_MAIN.currentBlock = await BACK_MAIN.web3.eth.getBlockNumber();
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let pairList = await backQueryContract.methods.pairList().call({from: BACK_MAIN.account});
    let poolList = await backQueryContract.methods.poolList().call({from: BACK_MAIN.account});
    let info = await backQueryContract.methods.getBackInfo().call({from: BACK_MAIN.account});
    let addressList = pairList.map(i => i["pair"]);
    let infoList = await backQueryContract.methods.getUserInfo(addressList).call({from: BACK_MAIN.account});
    // let infoList = [];
    let tokens = [...poolList.map(i => i["supplyToken"]), ...infoList.map(i => i["rewardToken"]), ...[ContractAddress[BACK_MAIN.chainId].backToken]];
    tokens = Array.from(new Set(tokens));
    let tokenList = await backQueryContract.methods.tokenBasicInfo(tokens).call({from: BACK_MAIN.account});

    BACK_MAIN.pairList = [];
    BACK_MAIN.poolList = [];
    BACK_MAIN.infoList = [];
    BACK_MAIN.dataList = [];
    BACK_MAIN.tokenList = [];


    for(let item of tokenList) {
        let token = {};
        token.token = item["token"];
        token.symbol = item["symbol"];
        token.decimal = parseInt(item["decimal"]);
        token.totalSupply = parseFloat(convertBigNumberToNormal(item["totalSupply"], token.decimal));
        token.balance = parseFloat(convertBigNumberToNormal(item["balance"], token.decimal));
        token.allowance = parseFloat(convertBigNumberToNormal(item["allowance"], token.decimal));
        BACK_MAIN.tokenList.push(token);
    }

    BACK_MAIN.backInfo = {
        amountPerBlock: convertBigNumberToNormal(info.amountPerBlock),
        price: convertBigNumberToNormal(info.price),
        totalWeight: parseInt(info.totalWeight),
    };


    for(let item of poolList) {
        let pool = {};
        pool.interestPerBorrow = parseFloat(convertBigNumberToNormal(item["interestPerBorrow"]));
        pool.interestRate = parseFloat(convertBigNumberToNormal(item["interestRate"]));
        pool.address = item["pool"];
        pool.price = parseFloat(convertBigNumberToNormal(item["price"]));
        pool.supplyToken = item["supplyToken"];
        pool.balance = parseFloat(convertBigNumberToNormal(item["balance"]));
        pool.totalBorrow = parseFloat(convertBigNumberToNormal(item["totalBorrow"]));
        pool.totalShare = parseFloat(convertBigNumberToNormal(item["totalShare"]));
        pool.totalSupply = parseFloat(convertBigNumberToNormal(item["totalSupply"]));
        pool.backWeight = parseInt(item["backWeight"]);
        pool.depositPercent = parseInt(item["depositPercent"]) / 10000;
        pool.reservePercent = parseInt(item["reservePercent"]) / 10000;
        pool.symbol = getTokenSymbol(pool.supplyToken);
        pool.lastUpdateBlock = parseInt(item["lastUpdateBlock"]);
        if(pool.totalBorrow > 0) {
            let addInterest = pool.interestRate * pool.totalBorrow * (BACK_MAIN.currentBlock - pool.lastUpdateBlock) * (1 - pool.reservePercent);
            pool.interestPerBorrow += addInterest / pool.totalBorrow;
        }
        pool.remain = parseFloat(convertBigNumberToNormal(item["remain"]));
        tokens.push(pool.supplyToken);
        BACK_MAIN.poolList.push(pool);
    }

    for(let item of pairList) {
        let pair = {};
        pair.borrow0 = parseFloat(convertBigNumberToNormal(item["borrow0"]));
        pair.borrow1 = parseFloat(convertBigNumberToNormal(item["borrow1"]));
        pair.lpSupply = parseFloat(convertBigNumberToNormal(item["lpSupply"]));
        pair.pid = parseInt(item["pid"]);
        pair.address = item["pair"];
        pair.reserve0 = parseFloat(convertBigNumberToNormal(item["reserve0"]));
        pair.reserve1 = parseFloat(convertBigNumberToNormal(item["reserve1"]));
        pair.token0 = item["token0"];
        pair.token1 = item["token1"];
        pair.totalPledge = parseFloat(convertBigNumberToNormal(item["totalPledge"]));
        pair.leverageRate = parseFloat(convertBigNumberToNormal(item["leverageRate"]));
        pair.liquidationRate = parseFloat(convertBigNumberToNormal(item["liquidationRate"]));
        pair.symbol0 = getTokenSymbol(pair.token0);
        pair.symbol1 = getTokenSymbol(pair.token1);

        let token0Pool = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token0);
        let token1Pool = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token1);
        let token0PerBack = BACK_MAIN.backInfo.amountPerBlock * token0Pool.backWeight / BACK_MAIN.backInfo.totalWeight * (1 - token0Pool.depositPercent) / 10000 * YEAR;
        let token1PerBack = BACK_MAIN.backInfo.amountPerBlock * token1Pool.backWeight / BACK_MAIN.backInfo.totalWeight * (1 - token1Pool.depositPercent) / 10000 * YEAR;
        let borrowAmount0 = token0Pool.totalBorrow * token0Pool.price;
        let borrowAmount1 = token1Pool.totalBorrow * token1Pool.price;
        pair.interestAPY0 = token0Pool.interestRate * YEAR;
        pair.interestAPY1 = token1Pool.interestRate * YEAR;
        pair.platformAPY0 = borrowAmount0 === 0 ? 0: token0PerBack * BACK_MAIN.backInfo.price / borrowAmount0,
        pair.platformAPY1 = borrowAmount1 === 0 ? 0: token1PerBack * BACK_MAIN.backInfo.price / borrowAmount1,
        BACK_MAIN.pairList.push(pair);
    }

    for(let item of infoList) {
        let info = {};
        info.amountPledge0 = parseFloat(convertBigNumberToNormal(item["amountPledge0"]));
        info.amountPledge1 = parseFloat(convertBigNumberToNormal(item["amountPledge1"]));
        info.amountReward0 = parseFloat(convertBigNumberToNormal(item["amountReward0"]));
        info.amountReward1 = parseFloat(convertBigNumberToNormal(item["amountReward1"]));
        info.amountBorrow0 = parseFloat(convertBigNumberToNormal(item["amountBorrow0"]));
        info.amountBorrow1 = parseFloat(convertBigNumberToNormal(item["amountBorrow1"]));
        info.amountSettle0 = parseFloat(convertBigNumberToNormal(item["amountSettle0"]));
        info.amountSettle1 = parseFloat(convertBigNumberToNormal(item["amountSettle1"]));
        info.amountInterest0 = parseFloat(convertBigNumberToNormal(item["amountInterest0"]));
        info.amountInterest1 = parseFloat(convertBigNumberToNormal(item["amountInterest1"]));
        info.rewardToken = item["rewardToken"];
        info.rewardPrice = parseFloat(convertBigNumberToNormal(item["rewardPrice"]))
        info.address = item["pair"];
        let pair = BACK_MAIN.pairList.find(i => i.address === info.address);
        pair.rewardToken = info.rewardToken;
        info.token0 = pair.token0;
        info.token1 = pair.token1;

        let token0Pool = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token0);
        let token1Pool = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token1);
        info.amountInterest0 += (token0Pool.interestPerBorrow - info.amountSettle0) * info.amountBorrow0;
        info.amountInterest1 += (token1Pool.interestPerBorrow - info.amountSettle1) * info.amountBorrow1;
        BACK_MAIN.infoList.push(info);
    }

    BACK_MAIN.dataList = [];
    for(let info of BACK_MAIN.infoList) {
        let pair = BACK_MAIN.pairList.find(i => i.address === info.address);
        let price0 = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token0).price;
        let price1 = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token1).price;
        if(info.amountPledge0 > 0 || info.amountReward0 > 0) {
            let item = {
                address: pair.address,
                token0 : pair.token0,
                token1 : pair.token1,
                borrowToken: pair.token0,
                borrowSymbol: getTokenSymbol(pair.token0),
                symbol0: getTokenSymbol(pair.token0),
                symbol1: getTokenSymbol(pair.token1),
                rewardToken: info.rewardToken,
                rewardSymbol: getTokenSymbol(info.rewardToken),
                totalAssets: getLPPrice(pair) * info.amountPledge0,
                amount0: info.amountPledge0 / pair.lpSupply * pair.reserve0,
                amount1: info.amountPledge0 / pair.lpSupply * pair.reserve1,
                debtAmount: info.amountBorrow0,
                debtInterest: info.amountInterest0,
                totalDebt: (info.amountBorrow0 + info.amountInterest0) * price0,
                pendingReward: info.amountReward0,
                swapperName: swapper[pair.pid]
            };
            item.healthy = item.totalDebt / item.totalAssets / pair.liquidationRate;
            BACK_MAIN.dataList.push(item);
        }

        if(info.amountPledge1 > 0 || info.amountReward0 > 0) {
            let item = {
                address: pair.address,
                token0 : pair.token0,
                token1 : pair.token1,
                borrowToken: pair.token1,
                borrowSymbol: getTokenSymbol(pair.token1),
                symbol0: getTokenSymbol(pair.token0),
                symbol1: getTokenSymbol(pair.token1),
                rewardToken: info.rewardToken,
                rewardSymbol: getTokenSymbol(info.rewardToken),
                totalAssets: getLPPrice(pair) * info.amountPledge1,
                amount0: info.amountPledge1 / pair.lpSupply * pair.reserve0,
                amount1: info.amountPledge1 / pair.lpSupply * pair.reserve1,
                totalDebt: (info.amountBorrow1 + info.amountInterest1) * price1,
                pendingReward: info.amountReward1,
                debtAmount: info.amountBorrow1,
                debtInterest: info.amountInterest1,
                swapperName: swapper[pair.pid]
            };
            item.healthy = item.totalDebt / item.totalAssets / pair.liquidationRate;
            BACK_MAIN.dataList.push(item);
        }

    }

    await fetchLiquidityList();
    console.log("fetch data", BACK_MAIN.tokenList, BACK_MAIN.pairList, BACK_MAIN.poolList, BACK_MAIN.backInfo, BACK_MAIN.dataList);
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
        totalPledge += pair.totalPledge * getLPPrice(pair);
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
            backPrice: BACK_MAIN.backInfo.price
        }
    }
}

export async function getBackInfo() {
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    let _queryBack = await backPlatformContract.methods.queryBack().call({ from: BACK_MAIN.account });                    //back总量
    let queryBack = convertBigNumberToNormal(_queryBack, getDecimal(ContractAddress[BACK_MAIN.chainId].backToken));
    return { data: { queryBack: queryBack } };
}

export function getTokenAddress(symbol) {//获取token地址
    let token = BACK_MAIN.tokenList.find(i => i.symbol === symbol);
    return token ? token.token: "";
}

export function getPlatformAddress() {     //获取platform的地址
    return ContractAddress[BACK_MAIN.chainId].backPlatformContract;
}

export function getTokenSymbol(token_address) {//获取symbol
    let token = BACK_MAIN.tokenList.find(i => i.token === token_address);
    return token ? token.symbol: "not know";
}

export async function getBalance(token_address) { //查币的余额
    // let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    // let balance = await tokenContract.methods.balanceOf(BACK_MAIN.account).call();
    // return convertBigNumberToNormal(balance);
    let token = BACK_MAIN.tokenList.find(i => i.token === token_address);
    return token ? token.balance: 0;
}

export function getDecimal(token) {//获取币的精度位数
    let item = BACK_MAIN.tokenList.find(i => i.token === token);
    return item? item.decimal : 18;
}

export async function getAllowance(token_address) { //获取授权值
    // let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    // let allowance = await tokenContract.methods.allowance(BACK_MAIN.account, getPlatformAddress()).call();
    // return convertBigNumberToNormal(allowance, getDecimal(token_address));
    let token = BACK_MAIN.tokenList.find(i => i.token === token_address);
    return token ? token.allowance: 0;
}

export async function getAssetsList() {
    let amountPerBlock = BACK_MAIN.backInfo.amountPerBlock;
    let list = [];
    for(let pool of BACK_MAIN.poolList) {
        let totalAmount = pool.price * pool.totalShare;
        let poolPerBack = amountPerBlock * pool.backWeight / BACK_MAIN.backInfo.totalWeight  * pool.depositPercent * 10512000;
        // console.log(poolPerBack, BACK_MAIN.backInfo.totalWeight, totalAmount);
        // console.log('log', poolPerBack, amountPerBlock * pool.backWeight / BACK_MAIN.backInfo.totalWeight, pool.depositPercent, totalAmount);
        let item = {
            platformAPY: totalAmount === 0 ? 0: poolPerBack * BACK_MAIN.backInfo.price / totalAmount,
            depositAPY:  pool.totalShare === 0 ? 0: pool.interestRate * 0.9 * pool.totalBorrow / pool.totalShare * 10512000,
            totalDeposit: pool.totalShare,
            remainBorrow: pool.remain,
            price: pool.price,
            useRatio: pool.totalShare === 0 ? 0: pool.totalBorrow / pool.totalShare,
            address: pool.address,
            token: pool.supplyToken,
            symbol: getTokenSymbol(pool.supplyToken),
            balance: pool.balance,
            amountDeposit: pool.totalShare === 0 ? 0: pool.balance / pool.totalSupply * pool.totalShare
        }
        list.push(item);
    }
    return list;
}

export async function getPairList() {
    let list = [];
    for(let pair of BACK_MAIN.pairList) {
        let item = {
            address: pair.address,
            token0 : pair.token0,
            token1 : pair.token1,
            symbol0: getTokenSymbol(pair.token0),
            symbol1: getTokenSymbol(pair.token1),
            platformAPY0: pair.platformAPY0,
            platformAPY1: pair.platformAPY1,
            amount0: pair.totalPledge / pair.lpSupply * pair.reserve0,
            amount1: pair.totalPledge / pair.lpSupply * pair.reserve1,
            leverageRate: pair.leverageRate + 1,
            interestAPY0: pair.interestAPY0,
            interestAPY1: pair.interestAPY1,
            swapperName: swapper[pair.pid],
            liquidityAPY: getLPAPR([getTokenSymbol(pair.token0) + "/" + getTokenSymbol(pair.token1)])[0].apr,
        };
        list.push(item);
    }
    return list;
}

export async function getUserInfoList() {
    return BACK_MAIN.dataList;
}

export async function getLiquidationList() {
    return BACK_MAIN.liquidationList;
}

export async function getAddInfo(pairAddress, amount0, amount1, borrowToken) {
    let pair = BACK_MAIN.pairList.find(i => i.address === pairAddress);
    let pool0 = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token0);
    let pool1 = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token1);
    let list = await getUserInfoList();
    // console.log(list);
    let info = list.find(i => i.address === pair.address && borrowToken === i.borrowToken);
    let amountIn0 = amount0;
    let amountIn1 = amount1;

    if(amountIn0 * pair.reserve1 >= amountIn1 * pair.reserve0) {
        let swapAmount = _getAmountSwap(amountIn0, amountIn1, pair.reserve0, pair.reserve1);
        amountIn0 -= swapAmount;
        amountIn1 += _getAmountOut(swapAmount, pair.reserve0, pair.reserve1);
    } else {
        let swapAmount = _getAmountSwap(amountIn1, amountIn0, pair.reserve1, pair.reserve0);
        amountIn1 -= swapAmount;
        amountIn0 += _getAmountOut(swapAmount, pair.reserve1, pair.reserve0);
    }
    let addAssets = amountIn0 * pool0.price + amountIn1 * pool1.price;

    return {
        amountIn0: amountIn0,
        amountIn1: amountIn1,
        amountAfter0: amountIn0 + info.amount0,
        amountAfter1: amountIn1 + info.amount1,
        healthy: info.totalDebt / (info.totalAssets + addAssets) / pair.liquidationRate
    }
}

export async function getReinvestInfo(//复投
    amountReward,
    pairAddress,
    borrowToken
) {
    let pair = BACK_MAIN.pairList.find(i => i.address === pairAddress);
    let backQueryContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_QUERY, ContractAddress[BACK_MAIN.chainId].backQueryContract);
    let info = await backQueryContract.methods.getReinvestReserve(pairAddress, pair.rewardToken).call();
    let reserve0 = parseFloat(convertBigNumberToNormal(info["reserve0"], getDecimal(pair.token0)));
    let reserve1 = parseFloat(convertBigNumberToNormal(info["reserve1"], getDecimal(pair.rewardToken)));

    let amountIn0 = _getAmountOut(amountReward, reserve1, reserve0);
    let amountIn1 = 0;
    console.log(reserve1, reserve0, amountIn0, amountReward);

    let swapAmount = _getAmountSwap(amountIn0, amountIn1, pair.reserve0, pair.reserve1);
    amountIn0 -= swapAmount;
    amountIn1 += _getAmountOut(swapAmount, pair.reserve0, pair.reserve1);

    let assetsIn = _getTokenPrice(pair.token0) * amountIn0 + _getTokenPrice(pair.token1) * amountIn1;

    let data = BACK_MAIN.dataList.find(i => i.address === pairAddress && i.borrowToken === borrowToken);
    let health = data.totalDebt / (data.totalAssets + assetsIn) / pair.liquidationRate;
    return {
        data: {
            amount0: amountIn0,
            amount1: amountIn1,
            health: health
        }
    }
}


export async function getInvestInfo(pairAddress, amount0, amount1, borrowToken, leverage) {
    let pair = BACK_MAIN.pairList.find(i => i.address === pairAddress);
    let pool0 = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token0);
    let pool1 = BACK_MAIN.poolList.find(i => i.supplyToken === pair.token1);
    let price0 = pool0.price;
    let price1 = pool1.price;
    let assetIn = amount0 * price0 + amount1 * price1;
    let assetBorrow = assetIn * (leverage - 1);
    let amountBorrow;
    let amountIn0;
    let amountIn1;
    let interestRate;

    if(borrowToken === pair.token0) {
        interestRate = pool0.interestRate * YEAR;
        amountBorrow = assetBorrow / price0;
        amountIn0 = amount0 + amountBorrow;
        amountIn1 = amount1;
    } else {
        interestRate = pool1.interestRate * YEAR;
        amountBorrow = assetBorrow / price1;
        amountIn0 = amount0;
        amountIn1 = amount1 + amountBorrow;
    }

    if(amountIn0 * pair.reserve1 >= amountIn1 * pair.reserve0) {
        let swapAmount = _getAmountSwap(amountIn0, amountIn1, pair.reserve0, pair.reserve1);
        amountIn0 -= swapAmount;
        amountIn1 += _getAmountOut(swapAmount, pair.reserve0, pair.reserve1);
    } else {
        let swapAmount = _getAmountSwap(amountIn1, amountIn0, pair.reserve1, pair.reserve0);
        amountIn1 -= swapAmount;
        amountIn0 += _getAmountOut(swapAmount, pair.reserve1, pair.reserve0);
    }

    return {
        amountBorrow: amountBorrow,
        remainAmount0: pool0.remain,
        remainAmount1: pool1.remain,
        amountIn0: amountIn0,
        amountIn1: amountIn1,
        platformAPY0: pair.platformAPY0,
        platformAPY1: pair.platformAPY1,
        healthy: assetBorrow / (assetBorrow + assetIn) / pair.liquidationRate,
        interestAPY: interestRate
    }
}


export async function getRepayInfo(pairAddress, borrowToken, amountRepay) {
    let pair = BACK_MAIN.pairList.find(i => i.address === pairAddress);
    let data = BACK_MAIN.dataList.find(i => i.address === pairAddress && i.borrowToken === borrowToken);
    let borrowAmount = data.debtAmount;
    let interestAmount = data.debtInterest;
    let totalAssets = data.totalAssets;
    let borrowPrice = _getTokenPrice(borrowToken);

    let borrowRepay = amountRepay * borrowAmount / (borrowAmount + interestAmount);
    let interestRepay = amountRepay * interestAmount / (interestAmount + borrowAmount);
    let borrowRemain = borrowAmount - borrowRepay;
    let interestRemain = interestAmount - interestRepay;

    let health = (borrowRemain + interestRemain) * borrowPrice / totalAssets / pair.liquidationRate;
    return {
        borrowAmount: borrowAmount,
        interestAmount: interestAmount,
        borrowRepay: borrowRepay,
        interestRepay: interestRepay,
        borrowRemain: borrowRemain,
        interestRemain: interestRemain,
        health: health
    }
}

export async function getDivestInfo(pairAddress, percent, borrowToken, expectToken) {
    let pair = BACK_MAIN.pairList.find(i => i.address === pairAddress);
    let info = BACK_MAIN.infoList.find(i => i.address === pair.address);
    let amountPledge = borrowToken === pair.token0 ? info.amountPledge0: info.amountPledge1;
    let amount0 = amountPledge / pair.lpSupply * pair.reserve0 * percent;
    let amount1 = amountPledge / pair.lpSupply * pair.reserve1 * percent;
    let amountBorrowAfter;
    let interestAfter;
    let amountOut0 = amount0;
    let amountOut1 = amount1;
    let amountToPay;
    let interestToPay;
    if(borrowToken === pair.token0) {
        amountToPay = info.amountBorrow0 * percent;
        interestToPay = info.amountInterest0 * percent;
        amountBorrowAfter = info.amountBorrow0 - amountToPay;
        interestAfter = info.amountInterest0 - interestToPay;

        if(amountOut0 < amountToPay + interestToPay) {
            amountOut1 -= _getAmountIn((amountToPay + interestToPay) - amountOut0, pair.reserve1, pair.reserve0);
            amountOut0 = 0;
        } else {
            amountOut0 -= (amountToPay + interestToPay);
        }
    } else {
        amountToPay = info.amountBorrow1 * percent;
        interestToPay = info.amountInterest1 * percent;
        amountBorrowAfter = info.amountBorrow1 - amountToPay;
        interestAfter = info.amountInterest1 - interestToPay;
        if(amountOut1 < amountToPay + interestToPay) {
            amountOut0 -= _getAmountIn((amountToPay + interestToPay) - amountOut1, pair.reserve0, pair.reserve1);
            amountOut1 = 0;
        } else {
            amountOut1 -= (amountToPay + interestToPay);
        }

    }

    if(expectToken === pair.token0) {
        amountOut0 += _getAmountOut(amountOut1, pair.reserve1, pair.reserve0);
        amountOut1 = 0
    } else if(expectToken === pair.token1) {
        amountOut1 += _getAmountOut(amountOut0, pair.reserve0, pair.reserve1);
        amountOut0 = 0
    }

    return {
        amount0: amount0,
        amount1: amount1,
        amountToPay: amountToPay,
        interestToPay: interestToPay,
        amountOut0: amountOut0,
        amountOut1: amountOut1,
        amountBorrowAfter: amountBorrowAfter,
        interestAfter: interestAfter
    };
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

export async function liquidate(pair_address, owner_address, token_address, radio, callback) {//复投
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    radio = radio * 100;
    executeContract(backPlatformContract, "liquidate", 0, [pair_address, owner_address, token_address, radio], callback);
}

export async function claim(pair_address, token_address, callback) {//收取
    let backPlatformContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.BACK_PLATFORM, ContractAddress[BACK_MAIN.chainId].backPlatformContract);
    executeContract(backPlatformContract, "claim", 0, [pair_address, token_address], callback);
}

export async function approveToken(token_address, callback) { //approve Token
    let tokenContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.ERC20, token_address);
    let bigAmount = convertNormalToBigNumber("500000000000", getDecimal(token_address));
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
        await fetchData();
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
        fetchMdexApr()
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
let USDT2MDEXPairContract

async function fetchMdexApr() {
    fetch("https://gateway.mdex.cc/v2/mingpool/lps?mdex_chainid=128")
        .then((res) => res.json())
        .then((data) => {
            mdexAprData.data = Object.values(data.result);
        });
    if (!USDT2MDEXPairContract) {
        USDT2MDEXPairContract = new BACK_MAIN.web3.eth.Contract(BACK_ABI.MDEX_PAIR, ContractAddress[BACK_MAIN.chainId].usdtmdex);
    }
    let { _reserve0, _reserve1 } = await USDT2MDEXPairContract.methods.getReserves().call({ from: BACK_MAIN.account });
    mdexAprData.price = _reserve0 / _reserve1
    setTimeout(fetchMdexApr, 10 * 1000);
}

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

