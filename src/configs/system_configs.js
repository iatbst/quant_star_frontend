// Master的Host地址
const masterHost = 'http://ec2-16-163-25-203.ap-east-1.compute.amazonaws.com:8000/api'

// 当前投资组合的Hosts地址(由环境变量VUE_APP_PFO_HOSTS决定)
// if (process.env.VUE_APP_PFO_HOSTS === ''){
//     var pfoHostList = []
// } else {
//     var pfoHostList = process.env.VUE_APP_PFO_HOSTS.split(',')
// }
// const pfoHosts = pfoHostList

const prBinanceHosts = [
    'http://ec2-35-78-113-187.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const prOkexHosts = [
    'http://ec2-18-162-154-126.ap-east-1.compute.amazonaws.com:8000/api'
]
const prmBinanceHosts = [
    'http://ec2-18-181-211-216.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const prmOkexHosts = [
    'http://ec2-16-162-187-219.ap-east-1.compute.amazonaws.com:8000/api'
]
const pbBinanceHosts = [
    'http://ec2-54-248-26-173.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-92-118-229.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-183-193-63.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-249-205-73.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-35-76-111-12.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-35-78-72-28.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-52-195-149-42.ap-northeast-1.compute.amazonaws.com:8000/api',
]

const pbOkexHosts = [
    'http://ec2-18-163-74-159.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-166-113-187.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-43-198-14-240.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-166-31-102.ap-east-1.compute.amazonaws.com:8000/api',  
    'http://ec2-16-163-154-133.ap-east-1.compute.amazonaws.com:8000/api',  
]

var production_hosts = [
    // 香港: Okex
    'http://ec2-18-162-154-126.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-163-74-159.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-166-113-187.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-43-198-14-240.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-166-31-102.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-16-163-154-133.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-16-162-187-219.ap-east-1.compute.amazonaws.com:8000/api',

    // 东京: Binance
    'http://ec2-35-78-113-187.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-181-211-216.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-52-195-149-42.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-35-78-72-28.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-35-76-111-12.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-249-205-73.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-183-193-63.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-92-118-229.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-248-26-173.ap-northeast-1.compute.amazonaws.com:8000/api'
]

var development_hosts = [
    // 开发/测试
    'http://ec2-16-162-190-1.ap-east-1.compute.amazonaws.com:8000/api',
    // 'http://ec2-18-163-56-233.ap-east-1.compute.amazonaws.com:8000/api'
]
// 当前投资组合的Hosts地址
if (process.env.NODE_ENV === 'development'){
    // 开发环境
    var hostList = development_hosts
} else {
    // 线上环境
    var hostList = production_hosts
}
// alert(JSON.stringify(process.env))

const pfoHosts = hostList

// Backtest Host地址(运行回测的Host)
// const backtestHost = 'http://localhost:8000/api'
const backtestHost = 'http://ec2-52-195-236-169.ap-northeast-1.compute.amazonaws.com:8000/api'

// 常用exchanges
const exchanges = [
    'binance',
    'okex',
    //'huobi'
]

// 当前投资组合的别名(product)
const pfoAlias = [
    'binance',
    'huobi',
    'okex',
    'ftx',
    'altbtc'
]

// 当前子账户(subaccount)对应pfo的别名(product)
const subacctPfoAlias = [
    'binance',
    'huobi',
    'okex',
    'ftx',
    'altbtc'
]

// 策略名称和缩写的映射
const strategies = [
    'pivot-reversal',
    'plunge-back',
    'pivot-reversal-mini',
]

const strategyAlias = {
    'pivot-reversal': '大',
    'pivot_reversal': '大',
    'pr': '大',

    'pivot-reversal-mini': '小',
    'pivot_reversal_mini': '小',
    'prm': '小',

    'plunge-back': '底',
    'plunge_back': '底',
    'pb': '底'
}

// Trade错误代码(和后端的TRADE_FINAL_ERRORS保持一致)
const tradeFinalErrors = {
    '101': '账户保证金不足,无法开仓.',
    '102': '平台标的杠杆率限制,无法开仓.',
    '103': '信号延迟太大,未能及时开仓',

    '201': '账户保证金不足,无法关仓.',
    '202': '平台标的杠杆率限制,无法关仓.',
    '203': '同时发送离场订单,仓位更新不及时导致过量离场.',

    '301': '未知BUG,详情参考补充说明.'
}

// 当前投资组合的初始资金
const pfoInitUSD = {
    binance: 1436000,
    huobi: 874000,
    okex: 641000,
    ftx: 673000,
    altbtc: 400000,
}
const totalInitUSD = 3127000
const initFundUSD = 1000000     // 基金初始本金

// SP错误类型: 如果是常见错误, 有固定分类, 否则为其他
const spErrorTypes = [
    '杠杆借贷额度限制',
    '合约持仓额度限制',
    '其他'
]

// 当前风险系数
const riskRatio = 0.48

// Crypto父pfo的名称
const cryptoParentPfo = 'crypto_pfo'

// 展示顺序
const pfoSortWeights = {
    crypto_cta_pr_binance: 1,
    crypto_cta_pr_huobi: 2,
    crypto_cta_pr_okex: 3,
    crypto_cta_pr_ftx: 4,
    crypto_cta_pr_altbtc: 5,
}
const pfoAliasSortWeights = {
    binance: 1,
    huobi: 2,
    okex: 3,
    ftx: 4,
    altbtc: 5,
}
const prBinanceSortWeights = {
    btc: 3,
    eth: 2,
    sol: 1,
    ordi: 1,
    avax: 1,
    xrp: 1,
    doge: 1,
    '1000sats': 1,
    gas: 1,
    link: 1
}
const prOkexSortWeights = {
    btc: 3,
    eth: 2,  
    ltc: 1,
    xrp: 1,
    etc: 1,
    ada: 1,
    bnb: 1,
    sol: 1,
    doge: 1,
    matic: 1  
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
    SUSHI: 1,
    BNB: 2,
    CHZ: 0,
    MATIC: 0,
    VET: 0,
    XLM: 0,
    THETA: 1,
    SOL: 2,
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
    masterHost,
    pfoHosts,
    prBinanceHosts,
    prOkexHosts,
    pbBinanceHosts,
    pbOkexHosts,
    prmBinanceHosts,
    prmOkexHosts,
    pfoAlias,
    backtestHost,
    cryptoParentPfo,
    assetRoundLevel,
    usdStableCoins,
    pfoInitUSD,
    totalInitUSD,
    initFundUSD,
    pfoSortWeights,
    pfoAliasSortWeights,
    prBinanceSortWeights,
    prOkexSortWeights,
    riskRatio,
    subacctPfoAlias,
    spErrorTypes,
    strategyAlias,
    exchanges,
    strategies,
    tradeFinalErrors
}












