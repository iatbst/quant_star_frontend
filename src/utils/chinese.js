export function chineseString(s) {
    if (typeof(s) == 'string'){
        var cs = null
        s = s.toLowerCase()     // 输入不区分大小写!
    
        switch (s) {
            // 产品
            case 'crypto': cs = '数字货币';break;
            case 'swap': cs = '永续合约';break;
            case 'margin': cs = '杠杆现货';break;
            case 'coin': cs = '币本位';break;
            case 'usdt': cs = 'U本位';break;
            case 'usdt_share': cs = '全仓U本位';break;
            case 'usdt_isolate': cs = '逐仓U本位';break;
            case 'isolate': cs = '逐仓';break;
            case 'share': cs = '全仓';break;
    
            // 仓位
            case 'usd_long': cs = 'USD-多头';break;
            case 'usd_short': cs = 'USD-空头';break;
            case 'btc_long': cs = 'BTC-多头';break;
            case 'btc_short': cs = 'BTC-空头';break;
            
            // 交易
            case 'long': cs = '多'; break;
            case 'short': cs = '空'; break;
            case 'buy': cs = '买'; break;
            case 'sell': cs = '卖'; break;
    
            // 订单
            case 'open': cs = '开仓'; break;
            case 'close': cs = '关仓'; break;
            case 'adjust': cs = '调整'; break;
            case 'lose_stop': cs = '止损'; break;
            case 'increase': cs = '补仓'; break;
            case 'decrease': cs = '减仓'; break;
            case 'rollback': cs = '回撤'; break;
            case 'temp': cs = '手动'; break;

            // 费用
            case 'trade': cs = '交易费'; break;
            case 'swap_funding': cs = '永续资金费'; break;
            case 'interest': cs = '借贷利息'; break;    
            
            // Worker状态
            case 'live': cs = '在线'; break;
            case 'suspend': cs = '暂停'; break;
            case 'normal': cs = '在线'; break;
            case 'disable': cs = '下线'; break;

            default: cs = '翻译失败:' + s 
        }
        return cs
    } else {
        return s
    }
}