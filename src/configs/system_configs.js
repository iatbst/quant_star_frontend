// Master的Host地址
const masterHost = 'http://ec2-18-138-152-197.ap-southeast-1.compute.amazonaws.com:8000/api'

// 当前投资组合的Hosts地址(由环境变量VUE_APP_PFO_HOSTS决定)
// if (process.env.VUE_APP_PFO_HOSTS === ''){
//     var pfoHostList = []
// } else {
//     var pfoHostList = process.env.VUE_APP_PFO_HOSTS.split(',')
// }
// const pfoHosts = pfoHostList

var production_hosts = [
    // 香港: Okex
    'http://ec2-52-76-137-43.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-163-74-159.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-139-27-246.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-143-129-146.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-52-221-230-97.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-136-104-195.ap-southeast-1.compute.amazonaws.com:8000/api',

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
    
]
// 当前投资组合的Hosts地址
if (process.env.ENV === 'development'){
    // 开发环境
    var hostList = development_hosts
} else {
    // 线上环境
    var hostList = production_hosts
}
const pfoHosts = hostList

// Backtest Host地址(运行回测的Host)
// const backtestHost = 'http://localhost:8000/api'
const backtestHost = 'http://ec2-13-214-122-117.ap-southeast-1.compute.amazonaws.com:8000/api'

// 常用exchanges
const exchanges = [
    'binance',
    'okex',
    'huobi'
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
    'pivot reversal',
    'plunge back'
]

const strategyAlias = {
    'pr': '大PV',
    'prm': '小PV',
    'pb': '抄底'
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

// Pfo的展示顺序
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
    riskRatio,
    subacctPfoAlias,
    spErrorTypes,
    strategyAlias,
    exchanges,
    strategies
}












