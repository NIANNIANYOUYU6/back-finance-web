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
        backToken: '0x98B01F1B064fC6B6c9b2BC008F506ddc75d3b054',
        mdexSwapperContract: '0x1E54Ed1416a8a7B46e8d762d46e201f229F4f305',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0x593616a02de1269404115cFc5e225dAAF8C65Ce2",

        backConfigContract: '0xF371a4Fecf3A75fb27e05670F55117150a6a18EB',
        backPairFactoryContract: "0x373960bf69B56A134Ed0120Aba063c3c1881A99A",
        backPlatformContract: "0xd9B933ec56ACD63307a7b35DFF7A040785787CAd",
        backPoolFactoryContract: "0x75b05627E29B65fF569B46864a15670FC08c0B67",
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
