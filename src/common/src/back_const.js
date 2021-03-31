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
        mdexToken: '0x6fCcb735bE2D332214E10ba536edBeAf15F04E7A',
        backToken: '0xFE325b64bd7B40c40771F8Bea21D2FF5dF6B4937',
        mdexSwapperContract: '0x08FF1683d2182a87C099e6113Cb4aEa74923a379',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0x4c63BA37C9De2417be4de705cD6c5d0C842B3612",

        backConfigContract: '0xE57d8bb24fE7C82fA9f241Efd4c1eA9dA2880654',
        backPairFactoryContract: "0x0f3a9b9f7fd2D507061978cCef2a82C15c969E66",
        backPlatformContract: "0x99bd63aA558de807AE9A74c7575a47832Ba248f2",
        backPoolFactoryContract: "0x8b5A0a18c277b5a4F50686811c816DD4E8B02bec",
        mdexFactoryContract: "0x27F7F8eAfbb770B9fD48c3164fAe66DDCcD79553",
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
        USDT: '0x6959bd1FE1a3380695734F5c0c74462C4e02E4CE',
        BTC: '0xBEd39cd6f7993f0078325eB0Baaa7DB86dfD6792',
        ETH: '0x715e8F5648F8e4BF77A9095277118ef1EF546028',
        BACK: "0xFE325b64bd7B40c40771F8Bea21D2FF5dF6B4937",
        MDEX: "0x6fCcb735bE2D332214E10ba536edBeAf15F04E7A",
        BXH: "0x569b1d1afA8485C4d4b2B0FFFe8363D2a7473eAb",
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
