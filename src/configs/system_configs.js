// 当前投资组合的Hosts地址
const pfoHosts = [
    'http://ec2-54-255-223-240.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-13-250-43-118.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-13-213-63-220.ap-southeast-1.compute.amazonaws.com:8000/api',
    'http://ec2-18-141-185-127.ap-southeast-1.compute.amazonaws.com:8000/api',
]

// Master的Host地址
const masterHost = 'http://ec2-54-169-201-152.ap-southeast-1.compute.amazonaws.com:8000/api'

// Crypto父pfo的名称
const cryptoParentPfo = 'crypto_pfo'

// Crypto子pfo的名称
const cryptoPfo1 = 'crypto_cta_pr_btcusd'
const cryptoPfo2 = 'crypto_cta_pr_top_altcoin'
const cryptoPfo3 = 'crypto_cta_pr_altcoin'
const cryptoPfo4 = 'crypto_cta_pr_altbtc'

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
    cryptoParentPfo,
    cryptoPfo1,
    cryptoPfo2,
    cryptoPfo3,
    cryptoPfo4,
    assetRoundLevel,
    usdStableCoins
}












