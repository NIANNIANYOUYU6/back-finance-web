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
        mdexToken: '0xe2A7078a54D5a6FfDFE246bD2408762972C67B06',
        backToken: '0x67811a8425c4Ef8b396ce0D21cBa09b3a574da3B',
        mdexSwapperContract: '0x9B7c27c2Bcb9D9feA6B660620bEB90ed80F16581',
        backFactoryContract: '0xD414F5986f9dD1e98c558ecDCF37a27a02c451a0',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0x692d1CcC55851071B9E5020601EA2087BCf579Fa",

        backConfigContract: '0x03c75F32c28E6a75b9f1266DD98b6715b7804532',
        backPairFactoryContract: "0xED31cCDEB57F48dAb7343152D0F3CeAEF5A1674E",
        backPlatformContract: "0x8D98FDDc7b93c7DB9010ECC669dcE6706751f4F9",
        mdexFactoryContract: "0x0fE3Cb4AD64a7e6EF9F73bC78A6dDC1EF9243C32",
        backPoolFactoryContract: "0xD414F5986f9dD1e98c558ecDCF37a27a02c451a0",
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
        USDT: '0x91EDb7c62e6839EBbD94dC90C8DCbe2da9480a78',
        BTC: '0x0e4dac9Fb5D373C0C8Db85Af9E6Cc38172d39a67',
        ETH: '0x9C94C00C8a370aB290efd6EF67790e9596842a11',
        BACK: "0x67811a8425c4Ef8b396ce0D21cBa09b3a574da3B",
        MDEX: "0xe2A7078a54D5a6FfDFE246bD2408762972C67B06",
        BXH: "0x372bAa4350BCb63bf1de8324115A1c580d590c29",
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