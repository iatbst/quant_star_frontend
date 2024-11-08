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
    'http://ec2-54-250-145-172.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const prOkexHosts = [
    'http://ec2-18-163-61-14.ap-east-1.compute.amazonaws.com:8000/api'
]
const deBinanceHosts = [
    'http://ec2-18-179-212-104.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const deOkexHosts = [
    'http://ec2-18-166-189-96.ap-east-1.compute.amazonaws.com:8000/api'
]
const mczBinanceHosts = [
    'http://ec2-13-114-16-29.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const mczOkexHosts = [
    'http://ec2-18-162-230-116.ap-east-1.compute.amazonaws.com:8000/api'
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
    'http://ec2-18-163-61-14.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-163-74-159.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-166-113-187.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-43-198-14-240.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-166-31-102.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-16-163-154-133.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-166-189-96.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-162-230-116.ap-east-1.compute.amazonaws.com:8000/api',

    // 东京: Binance
    'http://ec2-54-250-145-172.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-52-195-149-42.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-35-78-72-28.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-35-76-111-12.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-249-205-73.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-183-193-63.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-92-118-229.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-248-26-173.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-179-212-104.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-13-114-16-29.ap-northeast-1.compute.amazonaws.com:8000/api'
]

var development_hosts = [
    // 开发/测试
    // 'http://ec2-18-162-149-69.ap-east-1.compute.amazonaws.com:8000/api',
    // 'http://ec2-43-199-75-34.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-43-199-78-74.ap-east-1.compute.amazonaws.com:8000/api',
    // 'http://ec2-16-163-139-195.ap-east-1.compute.amazonaws.com:8000/api',
    // 'http://ec2-18-166-60-255.ap-east-1.compute.amazonaws.com:8000/api',
    // 'http://ec2-43-198-84-207.ap-east-1.compute.amazonaws.com:8000/api',
    // 'http://ec2-16-163-154-184.ap-east-1.compute.amazonaws.com:8000/api',
]
// 当前投资组合的Hosts地址
if (process.env.NODE_ENV === 'development'){
    // 开发环境
    var hostList = production_hosts
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
    'macd-cross-zero',
    'delist'
    // 'pivot-reversal-mini',
]

const activeStrategyIDs = [
    'pivot_reversal_1',
    'pivot_reversal_2',
    'pivot_reversal_3',
    'pivot_reversal_4',
    'plunge_back_1',
    'plunge_back_2',
    'plunge_back_3',
    'plunge_back_4',
    'plunge_back_5',
    'plunge_back_6',
    'delist_1',
    'macd_cross_zero_1'
]

const strategyAlias = {
    'pivot-reversal': '大',
    'pivot_reversal': '大',
    'pr': '大',

    'delist': '下',
    'de': '下',

    'macd-cross-zero': 'M',
    'macd_cross_zero': 'M',
    'mcz': 'M',

    'plunge-back': '底',
    'plunge_back': '底',
    'pb': '底'
}



// Trade错误代码(和后端的TRADE_FLAG_CODES保持一致)
const tradeFlagCodes = {
    '0': '正常.',

    '101': '交易没有建立任何头寸.',
    '102': '交易被过滤, 不应该有任何订单.',

    '201': '交易方向仓位值不一致.',

    '301': '交易已结束, 仍有仓位.',
    '302': '入场和离场执行头寸不一致.',

    '401': '未获取到回测的当前交易.',
    '402': '没有从回测的当前交易中找到对应交易.',
    '403': '回测交易的对应属性不一致.',

    '501': '订单被交易所取消.'
}
const tradeFinalErrors = {
    '101': '账户保证金不足,无法开仓.',
    '102': '平台标的杠杆率限制,无法开仓.',
    '103': '信号延迟太大,未能及时开仓',
    '104': '开仓订单被交易所取消,详情参考补充说明.',

    '201': '账户保证金不足,无法关仓.',
    '202': '平台标的杠杆率限制,无法关仓.',
    '203': '同时发送离场订单,仓位更新不及时导致过量离场.',
    '204': '关仓订单被交易所取消,详情参考补充说明.',

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
    deBinanceHosts,
    deOkexHosts,
    mczBinanceHosts,
    mczOkexHosts,
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
    tradeFinalErrors,
    tradeFlagCodes,
    activeStrategyIDs
}












