export function chineseString(s) {
    var cs = null

    switch (s) {
        case 'crypto': cs = '数字货币';break;
        case 'swap': cs = '永续合约';break;
        case 'margin': cs = '杠杆现货';break;
        case 'coin': cs = '币本位';break;
        case 'usdt': cs = 'U本位';break;
        case 'usdt_share': cs = '全仓U本位';break;
        case 'usdt_isolate': cs = '逐仓U本位';break;
        case 'isolate': cs = '逐仓';break;
        case 'share': cs = '全仓';break;
        case 'USD_long': cs = 'USD-多头';break;
        case 'USD_short': cs = 'USD-空头';break;
        case 'BTC_long': cs = 'BTC-多头';break;
        case 'BTC_short': cs = 'BTC-空头';break;
        default: cs = '翻译失败:' + s 
    }
    return cs
}