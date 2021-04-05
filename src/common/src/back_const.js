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

export const backNode = "http://18.181.217.60:8000/subgraphs/name/example";

export const MAXNUM = 9999 * 99999 * 100000;
export const ContractAddress = {
    97: {
        mdexToken: '0xaaE0d85526cA55D933704c7707B6a1A233Df5Fe8',
        backToken: '0x28A0A2aE5b2f3459dDE1C541FcC90e8b3033438c',
        mdexSwapperContract: '0xe889eA0b0Dc1f60902c4DCC4b1f9B16eF2728450',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0x3d04B6AcAC25feC4684324A792441732280B0458",

        backConfigContract: '0xe86cba30B44F3818934c580aDCC52E365DB6767B',
        backPairFactoryContract: "0xD7498a8dE66D41412373B84b12d0AA65147E2aCc",
        backPlatformContract: "0x8aE30A4fd6eF1bdb27f9E5B727F2D3816c363DcC",
        backPoolFactoryContract: "0x6ca2cD674Ec312479ecD71e6b4142eb4a7599E08",
        mdexFactoryContract: "0x9B1bDEA897c643649D0D826b777Fd8F123AD70af",
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
        USDT: '0xf79e65Ad5b5E4EC6e0b6C1D846a8c6B832318402',
        BTC: '0xd2326A915E94578E3c8b7d859DfEa2b9C1aCb1e1',
        ETH: '0xA9F648E832AB544289055335bb120E75893c06C8',
        BACK: "0x28A0A2aE5b2f3459dDE1C541FcC90e8b3033438c",
        MDEX: "0xaaE0d85526cA55D933704c7707B6a1A233Df5Fe8",
        BXH: "0xA38714ef007e17Bfbb631c820588D490Dd5191E1",
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
