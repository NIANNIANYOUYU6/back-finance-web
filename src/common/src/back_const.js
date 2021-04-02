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
        mdexToken: '0xd4D553CACdCBB5E2fe754462d931bB056FFf591E',
        backToken: '0x9c9Ec4eCdC09A2f5FE478Ad8b41A2cc10C5a42Ad',
        mdexSwapperContract: '0x1E54Ed1416a8a7B46e8d762d46e201f229F4f305',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0x27088D9A77687E0123a3767e44F26a0B82dD3A1d",

        backConfigContract: '0x510207612Baa63151C7abaa00Bb128999Ae3F6B1',
        backPairFactoryContract: "0x848cB300311a6e17a8e874d7f70d05dcd007B050",
        backPlatformContract: "0x46f2363F9cd6A9ceB5019963e05692F48046A10d",
        backPoolFactoryContract: "0x5B3615A368030D6Ff1c1E5970dedC4972DEB2F08",
        mdexFactoryContract: "0x1b6192204a91ab721F469F429213f986a6f7928c",
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
        USDT: '0xb876F26ECCAeD1E56C673b7378c29a0a29e37f61',
        BTC: '0x1340ac30CA7a201f8d21AcA93103E445C2eADde0',
        ETH: '0x73A8aB292Cb403391c90E69AD54f21c0b15c8EDB',
        BACK: "0xdF1F58eeA4278fEE89609CE3Ac313bA0a2EB5A03",
        MDEX: "0xd4D553CACdCBB5E2fe754462d931bB056FFf591E",
        BXH: "0xA82Ac6677440e3d0bD3966Fe80C8B9a2001226A0",
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
