export const chainIdDict = {
    1: "Ethereum",
    3: "Ropsten",
    4: "Rinkeby",
    5: "Goerli",
    42: "Kovan",
    56: "BSC",
    97: "BSCTest",
    128: "HECO",
}

export const bourse = {
    0: "mdex",
}

export const MAXNUM = 9999 * 99999 * 100000;
export const ContractAddress = {
    97: {
        mdexFactoryContract: "0xa9E74501a8823Cd31A87E7848ABE91f849aeF2B6",
        mdexRouterContract: "0xa119aEfb3426c4A77ed5c0113789deA1B697c222",
        mdexPoolContract: "0xc97F230a3f18280B4c4Ab1992dC45E4A51a93888",
        mdexToken: '0xA7ADac24706c3b8414A6b81bCd179b54e01653f0',
        WETH: "0x8C6E78e8598511f83280E4c1B18b40de8615224f",

        backToken: "0xc0Ff7641b73790d2521b4f3baE605A16F8C6787B",
        backPlatformContract: "0x5917878B3d5bA8A330755AD5Fb3E22851553ae7F",
        mdexSwapperContract: '0x956136863f81E930357e5599c5C4A3F78278505b',
        backFactoryContract: '0x834edB598bDac7F1a65Cf6DC0c759Ef2ad81EEB3',

        backPoolFactoryContract: "0x03b2149356e93eCa3f1273216B190b82d4D44330",
        backPairFactoryContract: "0x83ca11503620b8823bd1289D7A09D4f34143EceA",
        backConfigContract: '0xAbA043Ff0697df5bCb0E8A7cbfe248a9Ab926109',
        backQueryContract: "0x83B237EfA39bd0DA6064562e4ADC0A2F986CfC50",
        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',

        BXHPoolContract: "0x74c7b7F41cFC55a52347800aDC1A46e2D03Fdb24",
        BXHFactoryContract: "0xe18B48a42cCE7E731FD5694c9eD9d35720FcBBA9",
        BXHRouterContract: "0xbE1d4d1824Af7cC9D575065800725fdecE2176Fe",
        BXHSwapperContract: "0x213146FE40511Dcda9451E7b734F82c892085D47",
        bxhlpUSDTBTC: "0x8597bde001778030623646a91169201163fA49C1",
        bxhlpUSDTETH: "0x794F16D9AbeE365d3Cf469F230c9b1AFDd9FD38d",
        bxhlpETHBTC: "0xa394eFFaaA75120358bf955Ac08CDe7BeA2A02cD",
    },
    128: {
        mdexToken: '0x012b9af79C4DdD265D581108A5642FC46F32076f',
        backPoolContract: '0x861C705de36080bfF4Aec6ad46450Ab098801e1A',

        backConfigContract: '0xAbA043Ff0697df5bCb0E8A7cbfe248a9Ab926109',
        backPairFactoryContract: "0x83ca11503620b8823bd1289D7A09D4f34143EceA",
        backPlatformContract: "0x5917878B3d5bA8A330755AD5Fb3E22851553ae7F",
        mdexFactoryContract: "0xa9E74501a8823Cd31A87E7848ABE91f849aeF2B6",
        backPoolFactoryContract: "0x03b2149356e93eCa3f1273216B190b82d4D44330",
    }
}

export const tokenAddres = {
    97: {
        USDT: '0x4A5Af41EEC79B63a488C5edc2D662936BA2a8AA4',
        BTC: '0xbE9A7590516268839Da944C8C0b1eA61dFB9a401',
        ETH: '0xf9E3CaF57119ACb716Cdd958Ff1F034852212b1D',
        BACK: "0x676254412Ca3BBF1E64bB202b99f5fBFE33Ba5D9",
        MDEX: "0x70E4f10c87B3FAF6bAf53cFD7512322A8C111Da0",
        BXH: "0x80334f525D753dE27339Be2471f7571F4ac010e0",
    },
    128: {
        USDT: '0x721aEda9c81ADAc92dFc9248127C219D91036671',
        BTC: '0xC367646D668e2c6427315c057fa8620eaf652d19',
        ETH: '0x976044D531C5F1820a355969C1318819dC17CEA3',
        BACK: "0xc0Ff7641b73790d2521b4f3baE605A16F8C6787B",
        MDEX: "0xA7ADac24706c3b8414A6b81bCd179b54e01653f0",
    },
}
export const pairAddress = {
    97: {
        BTCUSDT: '0x5f2D5efdE032555130D543245500080b7B0D995a',
        USDTETH: '0x1F6E1b2864E430A09ad88e3C9E2cf40463897AD1',
    },
    128: {
        BTCUSDT: '0x05942031227798516A5ebbc34aFB9db7f88F69BE',
        USDTETH: '0x2d1D1bd324d8D8F824E6f35568fea99A022E958e',
    },
}

export const tokensPrice = {
    BTC: 221.5,
    USDT: 1.0003,
    ETH: 1665.53,
    BACK: 0.4,
    LP: 540,
}