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
        mdexFactoryContract: "0xbc176e3dDe3c18bCd4633FdE4A205D4c421FB0ed",
        mdexRouterContract: "0x65BdcCC55DAc4BB91B53205F3944e6d164dbca06",
        mdexPoolContract: "0x59908c4184CC0f5d26fED6BFa293103Ebb81D1A9",
        mdexToken: '0xA7ADac24706c3b8414A6b81bCd179b54e01653f0',
        WETH: "0x32d5b14863C398b3Dc15284b02FfE6Bb143c587B",

        backToken: "0xc0Ff7641b73790d2521b4f3baE605A16F8C6787B",
        backPlatformContract: "0xFD5FFd539F8739545Fc003a8271c0eF47738e14b",
        mdexSwapperContract: '0x51Cfd03a5c1d0f44ca427cA624408D76cDB39191',
        backFactoryContract: '0x834edB598bDac7F1a65Cf6DC0c759Ef2ad81EEB3',

        backPoolFactoryContract: "0x029A8AB17324B790522c21043c306Ff86ab7FA77",
        backPairFactoryContract: "0x2b762A14F3AE4Fd22a46230cfD74FB0975E4e66e",
        backConfigContract: '0xb5f8b4643C581a16Cd2e74F09AD17A7E12D7d415',
        backQueryContract: "0x8778e2bBDFd9B42fBa07c05b314E770dA6fE5402",
        usdtmdex: '0x30686895109247C0376bcaE60Fcb6Cbc03165f33',
    },
    128: {
        mdexToken: '0x012b9af79C4DdD265D581108A5642FC46F32076f',
        backPoolContract: '0x861C705de36080bfF4Aec6ad46450Ab098801e1A',

        backConfigContract: '0xb5f8b4643C581a16Cd2e74F09AD17A7E12D7d415',
        backPairFactoryContract: "0x2b762A14F3AE4Fd22a46230cfD74FB0975E4e66e",
        backPlatformContract: "0xFD5FFd539F8739545Fc003a8271c0eF47738e14b",
        mdexFactoryContract: "0xbc176e3dDe3c18bCd4633FdE4A205D4c421FB0ed",
        backPoolFactoryContract: "0x029A8AB17324B790522c21043c306Ff86ab7FA77",
    }
}

export const tokenAddres = {
    97: {
        USDT: '0x721aEda9c81ADAc92dFc9248127C219D91036671',
        BTC: '0xC367646D668e2c6427315c057fa8620eaf652d19',
        ETH: '0x976044D531C5F1820a355969C1318819dC17CEA3',
        BACK: "0xc0Ff7641b73790d2521b4f3baE605A16F8C6787B",
        MDEX: "0xA7ADac24706c3b8414A6b81bCd179b54e01653f0",
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
        BTCUSDT: '0xC2F571112A253e357b4214e40830d5Ca7ff22012',
        USDTETH: '0x1F6E1b2864E430A09ad88e3C9E2cf40463897AD1',
    },
    128: {
        BTCUSDT: '0x0e0C06C329F7ED91ffc951cef48f90FC98ee8Ae6',
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