// Master的Host地址
const masterHost = 'http://ec2-54-169-201-152.ap-southeast-1.compute.amazonaws.com:8000/api'

// 当前投资组合的Hosts地址(由环境变量VUE_APP_PFO_HOSTS决定)
const pfoHosts = process.env.VUE_APP_PFO_HOSTS.split(',')

// Backtest Host地址(存储K线的Host)
const backtestHost = 'http://localhost:8000/api'

// 当前投资组合的初始资金
const pfoInitUSD = {
    btcusd: 750000,
    top_altcoin: 877000,
    altcoin: 750000,
    altbtc: 750000,
}
const totalInitUSD = 3127000

// Crypto父pfo的名称
const cryptoParentPfo = 'crypto_pfo'

// Pfo的展示顺序
const pfoSortWeights = {
    crypto_cta_pr_binance: 1,
    crypto_cta_pr_huobi: 2,
    crypto_cta_pr_okex: 3,
    crypto_cta_pr_ftx: 4,
    crypto_cta_pr_altbtc: 5,
}

// 不同Asset的Round Level
const assetRoundLevel = {
    USDT: 0,
    BTC: 3,
    ETH: 2,
    LTC: 2,
    ETC: 2,
    XRP: 0,
    BCH: 3,
    BSV: 3,
    TRX: 0,
    EOS: 2,
    ADA: 0,
    DOT: 1,
    FIL: 1,
    UNI: 1,
    DOGE: 0,
    LINK: 1,
    SUSHI: 1
}

// USD 稳定币
const usdStableCoins = [
    'USDT',
    'USD',
    'USDC',
    'TUSD',
    'PAX',
    'HUSD',
    'BUSD',
    'DAI',
]

export default {
pfoHosts,
    masterHost,
    backtestHost,
    cryptoParentPfo,
    assetRoundLevel,
    usdStableCoins,
    pfoInitUSD,
    totalInitUSD,
    pfoSortWeights
}











