import config from '@/configs/system_configs'
import moment from 'moment'

// 删除Array中指定元素
export function deleteFromArray(array, item){
    var ix = array.indexOf(item)
    if (ix > -1){
        array.splice(ix, 1)
    }
}

// 转化秒数为: x小时x分钟x秒
export function hourMinSecTimestamp(sec){
    var ret = null
    var min = null
    var hour = null
    if(sec <= 60){
        ret = sec + '秒'
    } else if (sec <= 3600){
        min = parseInt(sec/60)
        sec -= min*60
        ret = min + '分' + sec + '秒'
    } else {
        hour = parseInt(sec/3600)
        sec -= hour*3600
        min = parseInt(sec/60)
        sec -= min*60
        ret = hour + '时' + min + '分' + sec + '秒'
    }
    return ret
}

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

// utc时间戳转化为本地时间戳
export function utcToLocalTimestamp(utcTs) {
    if (utcTs[utcTs.length - 1] !== 'Z'){
        utcTs = utcTs + 'Z'
    }
    const stillUtc = new Date(utcTs)
    return moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
}

// 简化时间戳(2022-01-12T06:20:39.626186 -> 2022-01-12 06:20:39)
export function standardTimestamp(ts){
    if(ts){
        return ts.replace('T', ' ').slice(0, 19) 
    }
}

// 把Date转化为string
export function dateToString(date){
    var year = date.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var day = date.getDate(); //获取当前日(1-31)
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    var dateString =  year + "-" + month + "-" + day;
    return dateString
}

// 加入千位逗号(eg, 1000000 -> 1,000,000)
export function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

// 千位逗号转为Integer(eg, 1,000,000 -> 1000000)
export function thousandsToInt(str) {
    return  parseInt(str.replaceAll(',', ''))
}

// 统计小数位数
export function countDecimals(value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0; 
}

// 自定义版本toFiexed: 
// - value >= 1: 返回小数点后dec位
// - value < 1: 返回dec位有效的数字(不包括0) eg, dec=2, 0.000000168 -> 0.00000017
export function toFixed(value, dec){
    if (value >= 1){
        // 3.13159 -> 3.13
        return Number(value.toFixed(dec))
    } else {
        for(let i =0; i < 15; i++){
            if (Number(value.toFixed(i+1)) != 0){
                return Number(value.toFixed(i+dec))
            }
        }
    }
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