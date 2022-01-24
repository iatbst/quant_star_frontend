// 回测平台参数配置: 参数格式要和后台格式一致!

// 标的
const productOptions = [
    {
        label: "BTC/USDT",
        value: "crypto_binance_margin_btc/usdt",
    },
    {
        label: "ETH/USDT",
        value: "crypto_binance_margin_eth/usdt",
    },
    {
        label: "LTC/USDT",
        value: "crypto_binance_margin_ltc/usdt",
    },
    {
        label: "ETC/USDT",
        value: "crypto_binance_margin_etc/usdt",
    },
    {
        label: "XRP/USDT",
        value: "crypto_binance_margin_xrp/usdt",
    },

    {
        label: "ADA/USDT",
        value: "crypto_binance_margin_ada/usdt",
    },
    {
        label: "BNB/USDT",
        value: "crypto_binance_margin_bnb/usdt",
    },
    {
        label: "EOS/USDT",
        value: "crypto_binance_margin_eos/usdt",
    },
    {
        label: "IOTA/USDT",
        value: "crypto_binance_margin_iota/usdt",
    },
    {
        label: "NEO/USDT",
        value: "crypto_binance_margin_neo/usdt",
    },

    {
        label: "ONT/USDT",
        value: "crypto_binance_margin_ont/usdt",
    },
    {
        label: "QTUM/USDT",
        value: "crypto_binance_margin_qtum/usdt",
    },
    {
        label: "TRX/USDT",
        value: "crypto_binance_margin_trx/usdt",
    },
    {
        label: "VET/USDT",
        value: "crypto_binance_margin_vet/usdt",
    },
    {
        label: "XLM/USDT",
        value: "crypto_binance_margin_xlm/usdt",
    },
]

// K线级别
const productBarLevelOptions = [
    {
        label: "1小时",
        value: "1h",
    },
    {
        label: "天",
        value: "1d",
    },
]


// 回测参数的options(按照大类区分)
const optionsMap = {
    // strategy
    strategy: [
      {
        label: "Pivot Reversal",
        value: "pivot_reversal_bt",
      },
      {
        label: "Donchian Channel",
        value: "donchian_channel_bt",
      },
    ],

    // filter
    filter: [
      {
        label: "日期过滤器",
        value: "time_range",
      },
      {
        label: "上笔利润过滤器",
        value: "last_profit",
      },
      {
        label: "多空过滤器",
        value: "long_short",
      },
    ],

    // sizer
    sizer: [
      {
        label: "全额建仓器",
        value: "all_in",
      },
      {
        label: "动态风险建仓器",
        value: "dyn_risk",
      },
      {
        label: "固定风险建仓器",
        value: "fix_risk",
      },
    ],
    // sizer_leverager
    sizer_leverager: [
        {
        label: "不使用杠杆",
        value: null,
        },
        {
            label: "上笔利润杠杆",
            value: "last_profit",
        },
    ],

    // analyzer
    analyzer: [
      {
        label: "资产曲线图",
        value: "value_line",
      },
      {
        label: "最大回撤",
        value: "drawdown",
      },
    ],
}

// 回测参数
const paramsMap = {
    // strategy
    strategy: {
      pivot_reversal_bt: [
        {
          name: "left_bars",
          type: "number",
          label: "左侧Bar数量",
          default: 1,
          nullable: false,
        },
        {
          name: "right_bars",
          type: "number",
          label: "右侧Bar数量",
          default: 1,
          nullable: false,
        },
        {
          name: "use_day_period",
          type: "bool",
          active_label: "按天计算",
          inactive_label: "按Bar计算",
          default: true,
        },
      ],
      donchian_channel_bt: [
        {
          name: "bars",
          type: "number",
          label: "Bar数量",
          default: 1,
          nullable: false,
        },
        {
          name: "use_day_period",
          type: "bool",
          active_label: "按天计算",
          inactive_label: "按Bar计算",
          default: true,
        },
      ],
    },

    // filter
    filter: {
      time_range: [
        {
          name: "trade_start_date",
          type: "date",
          label: "交易开始日期",
        },
        {
          name: "trade_end_date",
          type: "date",
          label: "交易结束日期",
        },
      ],
      last_profit: [
        {
          name: "pivot_profit",
          type: "number",
          label: "利润分界",
          default: 0,
          nullable: false,
        },
        {
          name: "right_filter",
          type: "bool",
          active_label: "过滤右侧",
          inactive_label: "过滤左侧",
          default: true,
        },
      ],
      long_short: [
          {
            name: "sell_filter",
            type: "bool",
            active_label: "过滤空头",
            inactive_label: "过滤多头",
            default: true,              
          }
      ]
    },

    // sizer
    sizer: {
      all_in: [
        {
          name: "leverager",
          type: "class",
          class_type: "sizer_leverager",
          label: "杠杆",
        },
      ],
      dyn_risk: [
        {
          name: "val_risk_ptg",
          type: "number",
          label: "风险系数",
          default: 0.4,
          nullable: false,
        },
        {
          name: "last_n_low",
          type: "number",
          label: "过去X天资产低值",
          default: 14,
          nullable: false,
        },
        {
          name: "strategy_weight_map",
          type: "object",
          label: "策略权重表",
          default: JSON.stringify({
            1: 1,
            2: 1.5,
            3: 2,
            4: 2.5,
            5: 3,
          }),
        },
        {
            name: "leverager",
            type: "class",
            class_type: "sizer_leverager",
            label: "杠杆",
        },
      ],
      fix_risk: [
        {
            name: "ptg_mode",
            type: "bool",
            active_label: "百分比计算",
            inactive_label: "金额计算",
            default: true,
        },  
        {
            name: "base_risk",
            type: "number",
            label: "损失金额",
            default: 100,
            if_visible: false,
            visible_param: 'ptg_mode'
        },
        {
            name: "base_risk_ptg",
            type: "number",
            label: "损失百分比",
            default: 0.1,
            if_visible: true,
            visible_param: 'ptg_mode'
        }, 
        {
            name: "leverager",
            type: "class",
            class_type: "sizer_leverager",
            label: "杠杆",
          },    
      ]
    },
    // sizer leverager
    sizer_leverager: {
      last_profit: [
        {
          name: "pivot_profit",
          type: "number",
          label: "利润分界",
          default: 0,
          nullable: false,
        },
        {
          name: "left_leverage",
          type: "number",
          label: "左侧杠杆率",
          default: 1,
          nullable: false,
        },
        {
          name: "right_leverage",
          type: "number",
          label: "右侧杠杆率",
          default: 1,
          nullable: false,
        },
      ],
    },

    // analyzer
    analyzer: {
      value_line: [
        {
          name: "write_interval",
          type: "select",
          label: "颗粒度",
          options: [
            {
              label: "日",
              value: "day",
            },
            {
              label: "月",
              value: "month",
            },
          ],
          default: "day",
        },
      ],
      drawdown: [
        {
          name: "tops",
          type: "number",
          label: "最大X回撤",
          default: 3,
        },
      ],
    },
}

export default {
    productOptions,
    productBarLevelOptions,
    optionsMap,
    paramsMap
}
