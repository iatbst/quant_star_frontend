import { getProductDatas } from "@/api/product"

// Master的Host地址
const masterHost = 'http://ec2-16-163-25-203.ap-east-1.compute.amazonaws.com:8000/api'

const tbBinanceHosts = [
    'http://ec2-52-69-118-247.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const tbOkexHosts = [
    'http://ec2-16-163-106-126.ap-east-1.compute.amazonaws.com:8000/api'
]
const tbBybitHosts = [
    'http://ec2-13-214-121-142.ap-southeast-1.compute.amazonaws.com:8000/api'
]
const tbBitgetHosts = [
    'http://ec2-18-138-81-17.ap-southeast-1.compute.amazonaws.com:8000/api'
]

const rsiBinanceHosts = [
    'http://ec2-3-112-231-131.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const rsiOkexHosts = [
    'http://ec2-18-166-152-179.ap-east-1.compute.amazonaws.com:8000/api'
]
const rsiBybitHosts = [
    'http://ec2-13-212-71-103.ap-southeast-1.compute.amazonaws.com:8000/api'
]

const inBinanceHosts = [
    'http://ec2-35-74-248-242.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const inOkexHosts = [
    'http://ec2-43-199-194-46.ap-east-1.compute.amazonaws.com:8000/api'
]
const inBybitHosts = [
    'http://ec2-18-142-91-216.ap-southeast-1.compute.amazonaws.com:8000/api'
]

const prmBinanceHosts = [
    'http://ec2-13-158-130-180.ap-northeast-1.compute.amazonaws.com:8000/api'
]
const prmOkexHosts = [
    'http://ec2-54-46-16-152.ap-east-1.compute.amazonaws.com:8000/api'
]
const prmBybitHosts = [
    'http://ec2-13-214-203-89.ap-southeast-1.compute.amazonaws.com:8000/api'
]

const pbBinanceHosts = [
    'http://ec2-13-159-19-87.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-95-90-229.ap-northeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-57-180-249-6.ap-northeast-1.compute.amazonaws.com:8000/api',
]

const pbOkexHosts = [
    'http://ec2-16-163-142-85.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-46-126-24.ap-east-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-162-213-145.ap-east-1.compute.amazonaws.com:8000/api',
]

const pbBybitHosts = [
    'http://ec2-13-229-243-221.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-54-169-8-30.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-141-235-126.ap-southeast-1.compute.amazonaws.com:8000/api',
]



var production_hosts = [
    // 东京: Binance
    'http://ec2-52-69-118-247.ap-northeast-1.compute.amazonaws.com:8000/api',   // binance_tb_1
    'http://ec2-35-74-248-242.ap-northeast-1.compute.amazonaws.com:8000/api',   // binance_in_1
    'http://ec2-13-158-130-180.ap-northeast-1.compute.amazonaws.com:8000/api',  // binance_prm_1
    'http://ec2-3-112-231-131.ap-northeast-1.compute.amazonaws.com:8000/api',   // binance_rsi_1
    'http://ec2-13-159-19-87.ap-northeast-1.compute.amazonaws.com:8000/api',    // binance_pb_1
    'http://ec2-54-95-90-229.ap-northeast-1.compute.amazonaws.com:8000/api',    // binance_pb_2
    'http://ec2-57-180-249-6.ap-northeast-1.compute.amazonaws.com:8000/api',    // binance_pb_3

    // 香港: Okex
    'http://ec2-16-163-106-126.ap-east-1.compute.amazonaws.com:8000/api',       // okex_tb_1
    'http://ec2-43-199-194-46.ap-east-1.compute.amazonaws.com:8000/api',        // okex_in_1
    'http://ec2-54-46-16-152.ap-east-1.compute.amazonaws.com:8000/api',         // okex_prm_1
    'http://ec2-18-166-152-179.ap-east-1.compute.amazonaws.com:8000/api',       // okex_rsi_1
    'http://ec2-16-163-142-85.ap-east-1.compute.amazonaws.com:8000/api',        // okex_pb_1
    'http://ec2-54-46-126-24.ap-east-1.compute.amazonaws.com:8000/api',         // okex_pb_2
    'http://ec2-18-162-213-145.ap-east-1.compute.amazonaws.com:8000/api',       // okex_pb_3

    // 新加坡: Bybit
    'http://ec2-13-214-121-142.ap-southeast-1.compute.amazonaws.com:8000/api',  // bybit_tb_1
    'http://ec2-18-142-91-216.ap-southeast-1.compute.amazonaws.com:8000/api',   // bybit_in_1
    'http://ec2-13-214-203-89.ap-southeast-1.compute.amazonaws.com:8000/api',   // bybit_prm_1
    'http://ec2-13-212-71-103.ap-southeast-1.compute.amazonaws.com:8000/api',   // bybit_rsi_1
    'http://ec2-13-229-243-221.ap-southeast-1.compute.amazonaws.com:8000/api',  // bybit_pb_1
    'http://ec2-54-169-8-30.ap-southeast-1.compute.amazonaws.com:8000/api',     // bybit_pb_2
    'http://ec2-18-141-235-126.ap-southeast-1.compute.amazonaws.com:8000/api',  // bybit_pb_3

    // // 新加坡: Bitget
    'http://ec2-18-138-81-17.ap-southeast-1.compute.amazonaws.com:8000/api',    // bitget_tb_1
]

var development_hosts = [
    // 开发/测试
    'http://ec2-95-40-84-131.ap-east-1.compute.amazonaws.com:8000/api',  // test1
    'http://ec2-18-166-30-4.ap-east-1.compute.amazonaws.com:8000/api',  // test2
    // 'http://ec2-18-162-112-22.ap-east-1.compute.amazonaws.com:8000/api', // test3
    // 'http://ec2-43-198-86-129.ap-east-1.compute.amazonaws.com:8000/api', // test4
    // 'http://ec2-16-163-142-19.ap-east-1.compute.amazonaws.com:8000/api', // test5
    // 'http://ec2-43-198-81-10.ap-east-1.compute.amazonaws.com:8000/api'  // test6
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
    'bybit',
    'bitget'
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
    'trendline-break',
    'plunge-back',
    'rsi-mini',
    'id-nr',
    'pivot-reversal-mini'
]

const activeStrategyIDs = [
    'trendline_break_1',
    'trendline_break_2',
    'trendline_break_3',
    'trendline_break_4',
    'trendline_break_5',
    'trendline_break_6',
    'plunge_back_1',
    'plunge_back_2',
    'plunge_back_3',
    'plunge_back_4',
    'rsi_mini',
    'id_nr',
    'pivot_reversal_mini'
]

// 部分策略不展示子策略(只显示合并结果)
const mergeStrategyIDs = [
    'rsi_mini',
    'id_nr',
    'pivot_reversal_mini'
]

const strategyAlias = {
    'trendline-break': 'TB',
    'trendline_break': 'TB',
    'tb': 'TB',

    'plunge-back': 'PB',
    'plunge_back': 'PB',
    'pb': 'PB',

    'rsi-mini': 'RS',
    'rsi_mini': 'RS',
    'rsi': 'RS',

    'id-nr': 'IN',
    'id_nr': 'IN',
    'in': 'IN',

    'pivot-reversal-mini': 'PM',
    'pivot_reversal_mini': 'PM',
    'prm': 'PM',
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
    '105': '平台标的风控限制,无法开仓.',
    '106': '程序被系统kill,无法开仓',

    '201': '账户保证金不足,无法关仓.',
    '202': '平台标的杠杆率限制,无法关仓.',
    '203': '同时发送离场订单,仓位更新不及时导致过量离场.',
    '204': '关仓订单被交易所取消,详情参考补充说明.',
    '205': '程序被系统kill,无法关仓',

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
const tbBinanceSortWeights = {
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
const tbOkexSortWeights = {
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
    tbBinanceHosts,
    tbOkexHosts,
    tbBybitHosts,
    tbBitgetHosts,
    pbOkexHosts,
    pbBybitHosts,
    pbBinanceHosts,
    rsiOkexHosts,
    rsiBybitHosts,
    rsiBinanceHosts,
    inOkexHosts,
    inBybitHosts,
    inBinanceHosts,
    prmOkexHosts,
    prmBybitHosts,
    prmBinanceHosts,
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
    tbBinanceSortWeights,
    tbOkexSortWeights,
    riskRatio,
    subacctPfoAlias,
    spErrorTypes,
    strategyAlias,
    exchanges,
    strategies,
    tradeFinalErrors,
    tradeFlagCodes,
    activeStrategyIDs,
    mergeStrategyIDs
}












