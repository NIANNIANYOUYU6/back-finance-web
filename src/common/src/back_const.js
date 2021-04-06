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
        mdexToken: '0x59cEcc274ebF18A0B3c51393800360807D868419',
        backToken: '0xdC658b2A40A7c9F6E20Cce520cA73694c91BAAfB',
        mdexSwapperContract: '0xe022607DDAAe2a73a28174a00D12434e6c7F4Ed0',

        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
        backQueryContract: "0xd7410B314A659407786a09E2E3eAAf5c3D2ad72D",

        backConfigContract: '0xa94848Aab553787D507f26641E1b854076494732',
        backPairFactoryContract: "0x3546EcfE44F4A069Cb9Fd031300dbc8d0629A1fe",
        backPlatformContract: "0x77d1ee62e9A98374C6Cd955b54a7CAF90A3A2134",
        backPoolFactoryContract: "0x720d68Acf67B43aF20cd3db27Ad6d70dC72193c7",
        mdexFactoryContract: "0x0F3ab99ec2a2E72231F6e84828b7389D2A6663CC",
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
        USDT: '0x3F145283EEA7118B56b6C5fa794b68D0C0832318',
        BTC: '0x9F4231f4649fF552ca445709e9C69c90B3AF4Bd4',
        ETH: '0xFe9BE12B304ffbDCcC6a7D2189Bf0C6b2CDf2812',
        BACK: "0xdC658b2A40A7c9F6E20Cce520cA73694c91BAAfB",
        MDEX: "0x59cEcc274ebF18A0B3c51393800360807D868419",
        BXH: "0x8775B61F6FBD08971f42C958C460BE2Ef6269962",
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
