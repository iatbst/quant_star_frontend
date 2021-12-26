import config from '@/configs/system_configs'
import moment from 'moment'


// epoch转换为时间戳(ts为10位数字)
export function formatTimestamp(ts) {
    if (ts) {
        // 转化为13位
        if (ts < 10000000000){
            ts *= 1000
        }
        const stillUtc = moment.utc(ts).toDate()
        return moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
    } else {
        return '--'
    }
}

// 加入千位逗号(eg, 1000000 -> 1,000,000)
export function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

// 统计小数位数
export function countDecimals(value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0; 
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

// 根据bar_level返回秒数
export function barLevelSeconds(barLevel) {
    const mp = {
        '1m': 60,
        '5m': 300,
        '1h': 3600
    }
    return mp[barLevel]
}

// 把undefined转化为empty string
export function toString2(str) {
    if (str === undefined){
        return ''
    } else {
        return str
    }
}