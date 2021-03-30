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
        mdexToken: '0x36AfA24712bD363C56e23E519Fabb4673e555fb7',
        backToken: '0x458A2749b7eb88A83ec25e02537311c4444C8AC0',
        mdexSwapperContract: '0x86F63C292881d8d734C530Fb8645fDb653F856F5',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0xb23169EcdA8049D792F735ACC48482937B35A583",

        backConfigContract: '0xA2389A094A70042B4e69a1dd0aE5eD6dAD7d40F8',
        backPairFactoryContract: "0xCc179285C2FD6284dDb1a81f77fA23b24C00cCf3",
        backPlatformContract: "0xC28f99aB82d57c328f1f87a0a050511100e3f597",
        mdexFactoryContract: "0x708d5E1B6B2C75c44ba0F2f11099F2f597A35fDa",
        backPoolFactoryContract: "0x9C9FcdFbc97119D1fC293782D704e4664eb9C312",
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
        USDT: '0x9Df51602311c38d18CeDA41c57d2fF6C148C1163',
        BTC: '0x1FB26f58A034C8d21A68386a3E3f8F93C66F3c78',
        ETH: '0x59e27C1e8cf207a76689FF45203cfF7EE74335c6',
        BACK: "0x6464c6C3CbD1c16A8F3d01eba9c87e37C540c370",
        MDEX: "0xa2F4BA61BfBF9bf6D15185320e1357C260a0FdD8",
        BXH: "0x0A22ae662B442C67498Cf81C101F8177801334B1",
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
