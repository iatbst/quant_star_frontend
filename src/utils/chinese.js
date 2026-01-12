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
            case 'trade_open': cs = '持仓中'; break;
            case 'trade_close': cs = '已平仓'; break;
    
            // 订单
            case 'open': cs = '开仓'; break;
            case 'close': cs = '关仓'; break;
            case 'adjust': cs = '调整'; break;
            case 'win_stop': cs = '止盈'; break;
            case 'lose_stop': cs = '止损'; break;
            case 'increase': cs = '补仓'; break;
            case 'decrease': cs = '减仓'; break;
            case 'rollback': cs = '回撤'; break;
            case 'timer': cs = '定时'; break;
            case 'offline': cs = '下线'; break;
            case 'flip': cs = '反转'; break;
            case 'temp': cs = '手动'; break;

            // 费用
            case 'trade': cs = '交易费'; break;
            case 'swap_funding': cs = '合约费'; break;
            case 'interest': cs = '借贷利息'; break;    
            
            // Worker状态
            case 'live': cs = '在线'; break;
            case 'suspend': cs = '暂停'; break;
            case 'normal': cs = '在线'; break;
            case 'disable': cs = '下线'; break;

            // 报告
            case 'day_report': cs = '日报'; break;
            case 'week_report': cs = '周报'; break;
            case 'month_report': cs = '月报'; break;
            case 'quarter_report': cs = '季报'; break;
            case 'year_report': cs = '年报'; break;  
            
            // 表现
            case 'pnl': cs = '收益'; break;
            case 'pnl_ptg': cs = '收益率'; break;   
            case 'volume': cs = '交易金额'; break;
            case 'trade_count': cs = '交易次数'; break;  
            case 'order_count': cs = '订单次数'; break;
            case 'slippage': cs = '滑点'; break;  
            case 'fee': cs = '手续费'; break;
            case 'swap_funding': cs = '合约费'; break;  
            case 'op_fee': cs = '运维费'; break; 
            
            // 订单
            case 'completed': cs = '成交'; break;
            case 'partial': cs = '部分'; break;
            case 'canceled': cs = '取消'; break;

            default: cs = '翻译失败:' + s 
        }
        return cs
    } else {
        return s
    }
}

import config from '@/configs/system_configs'
export function chineseStrategyID(strategyID, showID=true, subStrategy=true) {
    if (subStrategy){
        // strategyID是子策略: eg trendline_break_1
        var strategy = strategyID.split('_').slice(0, -1).join('_')
    } else {
        // strategyID是主策略: eg boll_mini, long_short_ratio
        var strategy = strategyID
    }
    if (showID){
        var strategyId = strategyID.split('_').slice(-1,)[0]
        return config.strategyAlias[strategy] + '-' + strategyId
    } else {
        return config.strategyAlias[strategy]
    }
}