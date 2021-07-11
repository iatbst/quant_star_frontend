import config from '@/configs/system_configs'

// 加入千位逗号(eg, 1000000 -> 1,000,000)
export function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

// 如果quote是usd的稳定币, 转为USD(eg, USDT )
export function quoteToUSD(symbol) {
    var quote = symbol.split('/')[1]
    if (config.usdStableCoins.indexOf(quote) != -1 && quote != 'USD'){
        var base = symbol.split('/')[0]
        return base + '/USD'
    } else {
        return symbol
    }
}

// 深拷贝: https://www.cnblogs.com/xiyouchen/p/10366236.html
// 缺点:
//  会忽略 undefined
//  会忽略 symbol
//  不能序列化函数
//  不能解决循环引用的对象
export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}