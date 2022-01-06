<template>
  <div class="app-container">
    <!-------------------------------------------------------------------- 交易标的 ---------------------------------------------------------------------------->
    <h3>交易标的</h3>
    <el-row class="grid-content bg-purple-light">
      <el-col :span="2">
        <div align="center">
          <i style="font-size:30px; color: gray; margin-top: 25px" class="el-icon-success"></i>
        </div>
      </el-col>

      <el-col :span="22">
        <!-- 模式 -->
        <el-row>
          <el-col :span="24">
            <div style="margin-top: 20px">
              <!-- 选择模式 -->
              <el-select v-model="product_add_mode" placeholder="添加模式">
                <el-option
                  v-for="item in product_add_mode_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>

        <!-- 标的 -->
        <el-row>
          <el-col :span="12">
            <div style="margin-top: 10px">
              <el-select
                v-model="product_params.datas"
                multiple
                collapse-tags
                placeholder="选择标的">
                <el-option
                  v-for="item in product_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="12">
            <div style="margin-top: 10px">
              回测标的: {{ product_params.datas }}
            </div>
          </el-col>
        </el-row>

        <!-- K线 -->
        <el-row>
          <el-col :span="12">
            <div style="margin-top: 10px">
              <el-select v-model="product_params.bar_level" placeholder="选择K线级别">
                <el-option
                  v-for="item in product_bar_level_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="12">
            <div style="margin-top: 10px">
              K线级别: {{ product_params.bar_level }}
            </div>
          </el-col>
        </el-row>

        <!-- 时间段 -->
        <el-row>
          <el-col :span="12">
            <div style="margin-top: 10px">
              <el-date-picker
                v-model="product_params.from_date"
                type="date"
                placeholder="开始日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="margin-top: 10px">
              开始日期: {{ product_params.from_date}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div style="margin-top: 10px">
              <el-date-picker
                v-model="product_params.to_date"
                type="date"
                placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">                
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="margin-top: 10px">
              结束日期: {{ product_params.to_date}}
            </div>
          </el-col>
        </el-row>

      </el-col>
    </el-row>

    <!-------------------------------------------------------------------- 交易策略 ---------------------------------------------------------------------------->
    <h3>交易策略</h3>
    <el-row class="grid-content bg-purple-light">
      <el-col :span="2">
        <div align="center">
          <i style="font-size:30px; color: gray; margin-top: 25px" class="el-icon-success"></i>
        </div>
      </el-col>

      <el-col :span="22">
        <el-row>
          <el-col :span="12">
            <!-- 策略 -->
            <div style="margin-top: 20px">
              <el-select
                v-model="current_strategy.cls_name"
                placeholder="选择策略"
                @change="init_current_obj_params(current_strategy, strategy_param_map)"
                >
                <el-option
                  v-for="item in strategy_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>            
            <!-- 参数 -->
            <div v-if="current_strategy.cls_name != null">
              <div v-for="param in strategy_param_map[current_strategy.cls_name]" :key="param.name">
                <div v-if="param.type == 'number' || param.type == 'string'" style="margin-top: 10px">
                  {{ param.label }}: <el-input v-model="current_strategy.params[param.name]" style="width: 20%" size="mini"></el-input>
                  <span style="color: red">{{ param.alert }}</span>
                </div>
                <div v-else-if="param.type == 'bool'" style="margin-top: 10px">
                  {{ param.label }}: <el-switch v-model="current_strategy.params[param.name]"></el-switch>
                </div>
              </div>
            </div>
            <!-- 添加Button -->
            <div v-if="current_strategy.cls_name != null">
              <el-button type="primary" size="small" style="width: 20%; margin-top: 20px" @click="add_strategy_id();add_obj(current_strategy, strategy_param_map, strategy_params)">添加</el-button>
            </div>

          </el-col>

          <el-col :span="12">
            <div style="margin-top: 20px">
              当前策略: {{ current_strategy }}
            </div>
            <div style="margin-top: 20px">
              已添加策略: {{ strategy_params }}
            </div>
          </el-col>
        </el-row>
      </el-col> 
    </el-row>

    <!-------------------------------------------------------------------- 交易过滤器 ---------------------------------------------------------------------------->
    <h3>过滤器(全局)</h3>
    <el-row class="grid-content bg-purple-light">
      <el-col :span="2">
        <div align="center">
          <i style="font-size:30px; color: gray; margin-top: 25px" class="el-icon-success"></i>
        </div>
      </el-col>

      <el-col :span="22">
        <el-row>
          <el-col :span="12">
            <!-- 过滤器 -->
            <div style="margin-top: 20px">
              <el-select
                v-model="current_filter.cls_name"
                placeholder="选择过滤器"
                @change="init_current_obj_params(current_filter, filter_param_map)"
                >
                <el-option
                  v-for="item in filter_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>            
            <!-- 参数 -->
            <div v-if="current_filter.cls_name != null">
              <div v-for="param in filter_param_map[current_filter.cls_name]" :key="param.name">
                <div v-if="param.type == 'number' || param.type == 'string'" style="margin-top: 10px">
                  {{ param.label }}: <el-input v-model="current_filter.params[param.name]" style="width: 20%" size="mini"></el-input>
                  <span style="color: red">{{ param.alert }}</span>
                </div>
                <div v-else-if="param.type == 'bool'" style="margin-top: 10px">
                  {{ param.label }}: <el-switch v-model="current_filter.params[param.name]"></el-switch>
                </div>
                <div v-else-if="param.type == 'date'" style="margin-top: 10px">
                  {{ param.label }}: 
                  <el-date-picker
                    v-model="current_filter.params[param.name]"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
              </div>
            </div>
            <!-- 添加Button -->
            <div v-if="current_filter.cls_name != null">
              <el-button type="primary" size="small" style="width: 20%; margin-top: 20px" @click="add_obj(current_filter, filter_param_map, filter_params)">添加</el-button>
            </div>

          </el-col>

          <el-col :span="12">
            <div style="margin-top: 20px">
              当前过滤器: {{ current_filter }}
            </div>
            <div style="margin-top: 20px">
              已添加过滤器: {{ filter_params }}
            </div>
          </el-col>
        </el-row>
      </el-col> 
    </el-row>

    <!-------------------------------------------------------------------- 建仓器 ---------------------------------------------------------------------------->
    <h3>建仓器</h3>
    <el-row class="grid-content bg-purple-light">
      <el-col :span="2">
        <div align="center">
          <i style="font-size:30px; color: gray; margin-top: 25px" class="el-icon-success"></i>
        </div>
      </el-col>

      <el-col :span="22">
        <el-row>
          <el-col :span="12">
            <!-- 建仓器 -->
            <div style="margin-top: 20px">
              <el-select
                v-model="sizer_params.cls_name"
                placeholder="选择建仓器"
                >
                <el-option
                  v-for="item in sizer_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>            
            <!-- 参数 -->
            <div v-if="sizer_params.cls_name != null">
              <div v-for="param in sizer_param_map[sizer_params.cls_name]" :key="param.name">
                <div v-if="param.type == 'number' || param.type == 'string'" style="margin-top: 10px">
                  {{ param.label }}: <el-input v-model="sizer_params.params[param.name]" style="width: 20%" size="mini"></el-input>
                  <span style="color: red">{{ param.alert }}</span>
                </div>
                <div v-else-if="param.type == 'bool'" style="margin-top: 10px">
                  {{ param.label }}: <el-switch v-model="sizer_params.params[param.name]"></el-switch>
                </div>
                <div v-else-if="param.type == 'object'" style="margin-top: 10px">
                  {{ param.label }}: 
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    style="width: 40%"
                    v-model="sizer_params.params[param.name]">
                  </el-input>
                </div>
              </div>
            </div>

          </el-col>

          <el-col :span="12">
            <div style="margin-top: 20px">
              建仓器: {{ sizer_params }}
            </div>
          </el-col>
        </el-row>
      </el-col> 
    </el-row>
  </div>
</template>

<script>
import { formatTimestamp } from '@/utils/general'
import { chineseString } from '@/utils/chinese'
import config from '@/configs/system_configs'
import { getBarSummaries } from '@/api/bar'
import { runTask } from '@/api/task'
import { barLevelSeconds } from '@/utils/general'


export default {
  data() {
    return {

      /* ------ 标的 ------ */
      product_params: null,
      // 模式
      product_add_mode: '',
      product_add_mode_options: [
        {
          label: '手工添加',
          value: 'manual'
        }, {
          label: '批量添加',
          value: 'group'          
        }
      ],
      // 标的
      product_options: [
        {
          label: 'BTC/USDT',
          value: 'crypto_binance_margin_btc/usdt'
        }, 
        {
          label: 'ETH/USDT',
          value: 'crypto_binance_margin_eth/usdt'      
        },
        {
          label: 'LTC/USDT',
          value: 'crypto_binance_margin_ltc/usdt'
        }, 
        {
          label: 'ETC/USDT',
          value: 'crypto_binance_margin_etc/usdt'      
        },
        {
          label: 'XRP/USDT',
          value: 'crypto_binance_margin_xrp/usdt'
        }
      ],   // refactor: 从DB后台自动获取
      // K线级别
      product_bar_level_options: [
        {
          label: '1小时',
          value: '1h'
        },
        {
          label: '天',
          value: '1d'
        },
      ],


      /* ------ 策略 ------ */
      strategy_params: null,
      current_strategy: null,
      strategy_id: 1,
      strategy_options: [
        {
          label: 'Pivot Reversal',
          value: 'pivot_reversal_bt'
        },
        {
          label: 'Donchian Channel',
          value: 'donchian_channel_bt'
        },        
      ], // mock: 从DB后台获取后生成
      strategy_param_map: {
        pivot_reversal_bt: [
          {
            name: 'left_bars',
            type: 'number',
            label: '左侧Bar数量',
            default: 3,
            nullable: false,
          },
          {
            name: 'right_bars',
            type: 'number',
            label: '右侧Bar数量',
            default: 3,
            nullable: false,
          },
          {
            name: 'use_day_period',
            type: 'bool',
            label: '按天计算',
            default: true,
          },          
        ],
        donchian_channel_bt: [
          {
            name: 'bars',
            type: 'number',
            label: 'Bar数量',
            default: 3,
            nullable: false,
          },
          {
            name: 'use_day_period',
            type: 'bool',
            label: '按天计算',
            default: true,
          },          
        ],        
      },  // mock: 从DB后台获取后生成

      /* ------ 过滤器 ------ */
      filter_params: null,
      current_filter: null,
      // strategies: 从DB后台自动获取
      filter_options: [
        {
          label: '日期过滤器',
          value: 'time_range'
        },
        {
          label: '上笔利润过滤器',
          value: 'last_profit'
        },        
      ], // mock: 从DB后台获取后生成
      filter_param_map: {
        time_range: [
          {
            name: 'trade_start_date',
            type: 'date',
            label: '交易开始日期',
          },
          {
            name: 'trade_end_date',
            type: 'date',
            label: '交易结束日期',
          }          
        ],
        last_profit: [
          {
            name: 'pivot_profit',
            type: 'number',
            label: '利润分界',
            default: 0,
            nullable: false,
          },
          {
            name: 'right_filter',
            type: 'bool',
            label: '过滤右侧',
            default: true,
          },        
        ],        
      },  // mock: 从DB后台获取后生成

      /* ------ 建仓器 ------ */
      sizer_params: null,
      sizer_options: [
        {
          label: '全额建仓器',
          value: 'all_in'
        },
        {
          label: '动态风险建仓器',
          value: 'dyn_risk'
        },        
      ], // mock: 从DB后台获取后生成
      sizer_param_map: {
        all_in: [],
        dyn_risk: [
          {
            name: 'val_risk_ptg',
            type: 'number',
            label: '风险系数',
            default: 0.4,
          },
          {
            name: 'last_n_low',
            type: 'number',
            label: '过去N天资产低值',
            default: 14,
          },  
          {
            name: 'strategy_weight_map',
            type: 'object',
            label: '策略权重表',
            default: {
              1: 1,
              2: 1.5,
              3: 2,
              4: 2.5,
              5: 3
            },
          },       
        ],        
      },  // mock: 从DB后台获取后生成
    }
  },

  created() {
    this.init_params()
  },

  methods: {
    // 初始化所有/单独的params: 格式要严格按照backtest_runner.py中的定义
    init_params(type='all'){
      if (type == 'all' || type == 'product'){
        this.product_params = {
          bar_level: null,
          from_date: null,
          to_date: null,
          datas: []
        }       
      }
      if (type == 'all' || type == 'strategy'){
        this.strategy_params = []
        this.strategy_id = 1
        this.current_strategy = {
          cls_name: null,
          params: {},
        }
      }
      if (type == 'all' || type == 'filter'){
        this.filter_params = []
        this.current_filter = {
          cls_name: null,
          params: {},
        }
      }
      if (type == 'all' || type == 'sizer'){
        this.sizer_params = {
          cls_name: null,
          params: {},
        }       
      }
    },

    // 初始化当前obj的params: obj可以是strategy/filter/analyzer
    init_current_obj_params(current_obj, param_map){
      current_obj.params = {}
      for(let ix in param_map[current_obj.cls_name]){
        // 清空alert
        var param = param_map[current_obj.cls_name][ix]
        param.alert = null

        // 更新初始值
        // 注意: 要使用$set更新, 否则input无法编辑(参考: https://blog.csdn.net/weixin_44314609/article/details/107894733)
        if (param.default !== undefined){
          this.$set(current_obj.params, param.name, param.default)
        }
      }
    },

    // strategy添加id(加入list时添加)
    add_strategy_id(){
      this.current_strategy.params['strategy_id'] = this.strategy_id
      this.strategy_id += 1
    },

    // 把当前obj添加到对应的list: obj可以是strategy/filter/analyzer
    add_obj(current_obj, param_map, obj_list){
      // 检查参数
      var check_success = true
      for(let ix in param_map[current_obj.cls_name]){
        var param = param_map[current_obj.cls_name][ix]
        var ret = this.check_nullable(param, param.name, current_obj.params)
        if (!ret){
          check_success = false
          param.alert = '此参数不能为空'
        } else {
          param.alert = null
        }
      }
      if (check_success){
        obj_list.push(JSON.parse(JSON.stringify(current_obj)))
      }
      this.$forceUpdate() // 不知为何alert不能实时更新, 必须刷新组件!
    },

    // 检查参数是否可空
    check_nullable(param, name, obj){
      if (param.nullable === false && (!obj.hasOwnProperty(name) || obj[name] === "")){
        return false
      } else {
        return true
      }
    },

 
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>