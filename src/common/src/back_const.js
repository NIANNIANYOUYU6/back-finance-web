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
        mdexToken: '0x323Fda0921BDe2089f24301689eAC852c938b7d2',
        backToken: '0x114026Aee0a7D42A0e4BFf01150fc1BBe35d85C8',
        mdexSwapperContract: '0x8BCa2CefBf3996d87210BF85D002e64a88AdD446',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0xb099f126DB80FA6792834065D2ae5E1D614c4471",

        backConfigContract: '0x8101823aBa07fA4fE7B919e72fB6849d388e380f',
        backPairFactoryContract: "0xc38be6d82031B85755951F8FCEcb2ca7d6930c18",
        backPlatformContract: "0xe5943Ca793E436b94665BF5181fae61de4448eAa",
        mdexFactoryContract: "0xD560a21E58912bF4eb8A0c4030C4914B1edF0C89",
        backPoolFactoryContract: "0xF118706c9811c48e756B8FE35BBC8e94bb737045",
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
        USDT: '0xeB4f36d95f8fa23C4eC28ec633299056A8c67585',
        BTC: '0xF6c856f47038970e4064D1D3361943A1Fea53E3C',
        ETH: '0xcb4b8A2a87921d1d985FaE999703555D299Cf01c',
        BACK: "0x114026Aee0a7D42A0e4BFf01150fc1BBe35d85C8",
        MDEX: "0x323Fda0921BDe2089f24301689eAC852c938b7d2",
        BXH: "0x1E190a97dcdB493d7069D9cfb23BcF118705628D",
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
