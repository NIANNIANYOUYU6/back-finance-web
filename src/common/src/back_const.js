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
        mdexToken: '0x9EcF1F8fFbF7a24249D7f699b697bbEFaa615811',
        backToken: '0x5c8e4afcd7Ec17fD9c2594672026659C35b2CE0b',
        mdexSwapperContract: '0x8C8AB9d1DdE4c6675e569cE81d35e73350C6a05F',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0x367ed0ED00c6a92BEEA6DAF21609Dae56b8A4114",

        backConfigContract: '0x17Ca3C758239417082E33C94Efc7d6E060d8Df28',
        backPairFactoryContract: "0xE04517b19eBEDDd232B4fB3170e855247C6251d0",
        backPlatformContract: "0xDCA88950627c583e529fa0062FE58d1407facACA",
        backPoolFactoryContract: "0xa576627245a744808288eA83aB2F9803f03a9145",
        mdexFactoryContract: "0xec6ae3Eabd0FbEFaf25af4b4D00D08109eC7DEA4",
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
        USDT: '0x5fae81544068EA2955c2102eFE212D9a869A01Ea',
        BTC: '0x9A05C90a89d6452336754501F600AFF648f172c7',
        ETH: '0xB7F95EaA2001b15290eaC5983a45577E31Ac17f1',
        BACK: "0x5c8e4afcd7Ec17fD9c2594672026659C35b2CE0b",
        MDEX: "0x9EcF1F8fFbF7a24249D7f699b697bbEFaa615811",
        BXH: "0xFD2D605D9b8C0b1A1e41a4908759b3C6d9ADFf48",
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
