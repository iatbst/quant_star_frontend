<template>
  <div :style="editableBackground()" align="left">
    <!-------------------------------------------------------------------- 交易标的 ---------------------------------------------------------------------------->
    <el-row class="grid-content" style="background-color: white">
      <h3 style="margin-left: 30px">交易标的</h3>
      <el-col :span="2" v-if="editable">
        <div align="center">
          <i
            style="font-size: 30px; color: gray; margin-top: 25px"
            class="el-icon-success"
            v-if="productParamsState == false"
          ></i>
          <i
            style="font-size: 30px; color: lightgreen; margin-top: 25px"
            class="el-icon-success"
            v-else
          ></i>
        </div>
      </el-col>


      <el-col :span="6" v-if="editable">
        <!-- 配置区 -->
        <div style="margin-top: 20px">
          <el-select
            v-model="backtestParams.products.datas"
            multiple
            collapse-tags
            placeholder="选择标的"
            style="width: 50%"
          >
            <el-option
              v-for="item in paramsConfig.productOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <!-- K线 -->
        <div style="margin-top: 20px">
          <el-select
            v-model="backtestParams.products.bar_level"
            placeholder="选择K线级别"
            style="width: 50%"
          >
            <el-option
              v-for="item in paramsConfig.productBarLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <!-- 时间段 -->
        <div style="margin-top: 20px">
          <el-date-picker
            v-model="backtestParams.products.from_date"
            type="date"
            placeholder="选择开始日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 50%"
          >
          </el-date-picker>
        </div>

        <div style="margin-top: 20px; margin-bottom: 20px">
          <el-switch @change="productsToDateChange" v-model="setToDate"
            inactive-text="今日为结束日期"
            active-text="自定义结束日期" height="60"></el-switch>
        </div>

        <div style="margin-bottom: 20px" v-if="setToDate">
          <el-date-picker
            v-model="backtestParams.products.to_date"
            type="date"
            placeholder="选择结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 50%"
          >
          </el-date-picker>
        </div>
      </el-col>

      <el-col :span="editableSpan()" align="center">
        <!-- 展示区 -->
        <div style="margin-top: 0px; margin-bottom: 20px; width: 95%">
          <el-table
          :data="backtestParams.products.datas"
          :cell-style="{padding: '5px'}"
          :header-cell-style="{background: '#e5e9f2', padding: '5px'}"
          >
              <el-table-column align="center" type="index" min-width="5%">
              </el-table-column>

              <el-table-column align="center" label="交易所" min-width="15%">
                  <template slot-scope="scope">
                  {{ getExchange(scope.row) }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="类型" min-width="15%">
                  <template slot-scope="scope">
                  {{ getSubtype(scope.row) }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="标的" min-width="15%">
                  <template slot-scope="scope">
                  {{ getSymbol(scope.row) }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="K线" min-width="15%">
                  <template slot-scope="scope">
                  {{ backtestParams.products.bar_level }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="开始日期" min-width="15%">
                  <template slot-scope="scope">
                  {{ backtestParams.products.from_date }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="结束日期" min-width="15%">
                  <template slot-scope="scope">
                  {{ backtestParams.products.to_date }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="" min-width="5%">
                  <template slot-scope="scope">
                    <i style="font-size:18px; color: gray; cursor: pointer " @click="deleteFromArray(backtestParams.products.datas, scope.row)" class="el-icon-delete" v-if="editable">
                      
                    </i>
                  </template>
              </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-------------------------------------------------------------------- 交易策略 ---------------------------------------------------------------------------->
    <el-row class="grid-content" style="background-color: white">
      <h3 style="margin-left: 30px">交易策略</h3>
      <el-col :span="2" v-if="editable">
        <div align="center">
          <i
            style="font-size: 30px; color: gray; margin-top: 25px"
            class="el-icon-success"
            v-if="strategyParamsState == false"
          ></i>
          <i
            style="font-size: 30px; color: lightgreen; margin-top: 25px"
            class="el-icon-success"
            v-else
          ></i>
        </div>
      </el-col>

      <el-col :span="6" v-if="editable">
        <class-param
          v-bind:class-obj="currentStrategy"
          v-bind:class-type="strategyClassType"
          v-bind:options-map="paramsConfig.optionsMap"
          v-bind:params-map="paramsConfig.paramsMap"
          v-bind:refresh-counter="refreshStrategyParam"
          @refreshSubComp="refreshSubComp"
          style="margin-top: 20px"
        >
        </class-param>

        <!-- 添加Button -->
        <div v-if="currentStrategy.cls_name != null">
          <el-button
            type="primary"
            size="small"
            style="width: 25%; margin-top: 20px; margin-bottom: 20px"
            @click="addStrategy()"
            >添加</el-button
          >
        </div>
      </el-col>

      <el-col :span="editableSpan()" align="center">
        <!-- 展示区 -->
        <div style="margin-top: 0px; margin-bottom: 20px; width: 95%">
          <el-table
          :data="backtestParams.strategies"
          :cell-style="{padding: '5px'}"
          :header-cell-style="{background: '#e5e9f2', padding: '5px'}"
          >
              <el-table-column align="center" label="ID" min-width="5%">
                  <template slot-scope="scope">
                  {{ scope.row.params.strategy_id }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="策略" min-width="20%">
                  <template slot-scope="scope">
                  {{ scope.row.cls_name }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="参数" min-width="70%">
                  <template slot-scope="scope">
                  {{ scope.row.params}}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="" min-width="5%">
                  <template slot-scope="scope">
                    <i style="font-size:18px; color: gray; cursor: pointer " @click="deleteFromArray(backtestParams.strategies, scope.row)" class="el-icon-delete" v-if="editable">
                    </i>
                  </template>
              </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-------------------------------------------------------------------- 交易过滤器 ---------------------------------------------------------------------------->
    <el-row class="grid-content" style="background-color: white">
      <h3 style="margin-left: 30px">过滤器</h3>
      <el-col :span="2" v-if="editable">
        <div align="center">
          <i
            style="font-size: 30px; color: gray; margin-top: 25px"
            class="el-icon-success"
            v-if="filterParamsState == false"
          ></i>
          <i
            style="font-size: 30px; color: lightgreen; margin-top: 25px"
            class="el-icon-success"
            v-else
          ></i>
        </div>
      </el-col>

      <el-col :span="6" v-if="editable">
        <class-param
          v-bind:class-obj="currentFilter"
          v-bind:class-type="filterClassType"
          v-bind:options-map="paramsConfig.optionsMap"
          v-bind:params-map="paramsConfig.paramsMap"
          v-bind:refresh-counter="refreshFilterParam"
          @refreshSubComp="refreshSubComp"
          style="margin-top: 20px"
        >
        </class-param>
        <!-- 添加Button -->
        <div v-if="currentFilter.cls_name != null">
          <el-button
            type="primary"
            size="small"
            style="width: 25%; margin-top: 20px; margin-bottom: 20px"
            @click="addFilter()"
            >添加</el-button
          >
        </div>
      </el-col>

      <el-col :span="editableSpan()" align="center">
        <!-- 展示区 -->
        <div style="margin-top: 0px; margin-bottom: 20px; width: 95%">
          <el-table
          :data="backtestParams.trade_filters"
          :cell-style="{padding: '5px'}"
          :header-cell-style="{background: '#e5e9f2', padding: '5px'}"
          >
              <el-table-column align="center" type="index" min-width="5%">
              </el-table-column>

              <el-table-column align="center" label="过滤器" min-width="20%">
                  <template slot-scope="scope">
                  {{ scope.row.cls_name }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="参数" min-width="70%">
                  <template slot-scope="scope">
                  {{ scope.row.params}}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="" min-width="5%">
                  <template slot-scope="scope">
                    <i style="font-size:18px; color: gray; cursor: pointer " @click="deleteFromArray(backtestParams.trade_filters, scope.row)" class="el-icon-delete" v-if="editable">
                      
                    </i>
                  </template>
              </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-------------------------------------------------------------------- 建仓器 ---------------------------------------------------------------------------->
    <el-row class="grid-content" style="background-color: white">
      <h3 style="margin-left: 30px">建仓器</h3>
      <el-col :span="2" v-if="editable">
        <div align="center">
          <i
            style="font-size: 30px; color: gray; margin-top: 25px"
            class="el-icon-success"
            v-if="sizerParamsState == false"
          ></i>
          <i
            style="font-size: 30px; color: lightgreen; margin-top: 25px"
            class="el-icon-success"
            v-else
          ></i>
        </div>
      </el-col>

      <el-col :span="6" v-if="editable">
        <class-param
          v-bind:class-obj="currentSizer"
          v-bind:class-type="sizerClassType"
          v-bind:options-map="paramsConfig.optionsMap"
          v-bind:params-map="paramsConfig.paramsMap"
          v-bind:refresh-counter="refreshSizerParam"
          @refreshSubComp="refreshSubComp"
          style="margin-top: 20px; margin-bottom: 20px"
        >
        </class-param>

        <!-- 添加Button -->
        <div v-if="currentSizer.cls_name != null">
          <el-button
            type="primary"
            size="small"
            style="width: 25%; margin-top: 20px; margin-bottom: 20px"
            @click="addSizer()"
            v-if="backtestParams.sizer == null"
            >添加</el-button
          >
          <el-button
            type="primary"
            size="small"
            style="width: 25%; margin-top: 20px; margin-bottom: 20px"
            @click="addSizer()"
            v-else disabled>添加</el-button
          >
        </div>
      </el-col>

      <el-col :span="editableSpan()" align="center">
        <!-- 展示区 -->
        <div style="margin-top: 0px; margin-bottom: 20px; width: 95%">
          <el-table
          :data="sizerList"
          :cell-style="{padding: '5px'}"
          :header-cell-style="{background: '#e5e9f2', padding: '5px'}"
          >

              <el-table-column align="center" type="index" min-width="5%">
              </el-table-column>

              <el-table-column align="center" label="建仓器" min-width="20%">
                  <template slot-scope="scope">
                  {{ scope.row.cls_name }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="参数" min-width="70%">
                  <template slot-scope="scope">
                    <pre align="left">{{ JSON.stringify(scope.row.params,null,2) }}</pre>
                  </template>
              </el-table-column>

              <el-table-column align="center" label="" min-width="5%">
                  <template slot-scope="scope">
                    <i style="font-size:18px; color: gray; cursor: pointer " @click="delelteSizer(sizerList, scope.row)" class="el-icon-delete" v-if="editable">
                      
                    </i>
                  </template>
              </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-------------------------------------------------------------------- 交易资金&费用 ---------------------------------------------------------------------------->
    <el-row class="grid-content" style="background-color: white">
      <h3 style="margin-left: 30px">资金 & 费率</h3>
      <el-col :span="2" v-if="editable">
        <div align="center">
          <i
            style="font-size: 30px; color: gray; margin-top: 25px"
            class="el-icon-success"
            v-if="brokerParamsState == false"
          ></i>
          <i
            style="font-size: 30px; color: lightgreen; margin-top: 25px"
            class="el-icon-success"
            v-else
          ></i>
        </div>
      </el-col>

      <el-col :span="6" v-if="editable">
        <div style="margin-top: 20px">
          初始资金:
          <el-input
            v-model="backtestParams.broker.cash"
            style="width: 20%"
            size="small"
          ></el-input>
        </div>

        <div style="margin-top: 20px">
          手续费:
          <el-switch v-model="backtestParams.broker.enable_commission" style="margin-top: 6px; margin-bottom: 6px"
          active-text=""></el-switch>&nbsp;&nbsp;
          <el-input
            v-model="backtestParams.broker.commission"
            style="width: 20%"
            size="small"
            v-if="backtestParams.broker.enable_commission"
          ></el-input>
        </div>

        <div style="margin-top: 20px; margin-bottom: 20px;">
          滑点: <el-switch v-model="backtestParams.broker.enable_slippage" style="margin-top: 6px; margin-bottom: 6px"></el-switch>&nbsp;&nbsp;
          <el-input
            v-model="backtestParams.broker.slippage"
            style="width: 20%"
            size="small"
            v-if="backtestParams.broker.enable_slippage"
          ></el-input>
        </div>

      </el-col>

      <el-col :span="editableSpan()" align="center">
        <!-- 展示区 -->
        <div style="margin-top: 0px; margin-bottom: 20px; width: 95%">
          <el-table
          :data="brokerList"
          :cell-style="{padding: '5px'}"
          :header-cell-style="{background: '#e5e9f2', padding: '5px'}"
          >
              <el-table-column align="center" label="初始资金" min-width="20%">
                <template slot-scope="scope">
                  {{ scope.row.cash }}
                </template>
              </el-table-column>

              <el-table-column align="center" label="手续费" min-width="20%">
                <template slot-scope="scope">
                  <div v-if="scope.row.enable_commission">
                    {{ backtestParams.broker.commission }}
                  </div>
                  <div v-else>
                    无
                  </div>
                </template>
              </el-table-column>

              <el-table-column align="center" label="滑点" min-width="20%">
                <template slot-scope="scope">
                  <div v-if="scope.row.enable_slippage">
                  {{ backtestParams.broker.slippage }}
                  </div>
                  <div v-else>
                    无
                  </div>
                </template>
              </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-------------------------------------------------------------------- 分析器 ---------------------------------------------------------------------------->
    <el-row class="grid-content" style="background-color: white">
      <h3 style="margin-left: 30px">分析器</h3>
      <el-col :span="2" v-if="editable">
        <div align="center">
          <i
            style="font-size: 30px; color: gray; margin-top: 25px"
            class="el-icon-success"
            v-if="analyzerParamsState == false"
          ></i>
          <i
            style="font-size: 30px; color: lightgreen; margin-top: 25px"
            class="el-icon-success"
            v-else
          ></i>
        </div>
      </el-col>

      <el-col :span="6" v-if="editable">
        <class-param
          v-bind:class-obj="currentAnalyzer"
          v-bind:class-type="analyzerClassType"
          v-bind:options-map="paramsConfig.optionsMap"
          v-bind:params-map="paramsConfig.paramsMap"
          v-bind:refresh-counter="refreshAnalyzerParam"
          @refreshSubComp="refreshSubComp"
          style="margin-top: 20px"
        >
        </class-param>
        <!-- 添加Button -->
        <div v-if="currentAnalyzer.cls_name != null">
          <el-button
            type="primary"
            size="small"
            style="width: 25%; margin-top: 20px; margin-bottom: 20px"
            @click="addAnalyzer()"
            >添加</el-button>

        </div>
      </el-col>

      <el-col :span="editableSpan()" align="center">
        <!-- 展示区 -->
        <div style="margin-top: 0px; margin-bottom: 20px; width: 95%">
          <el-table
          :data="backtestParams.analyzers"
          :cell-style="{padding: '5px'}"
          :header-cell-style="{background: '#e5e9f2', padding: '5px'}"
          >
              <el-table-column align="center" type="index" min-width="5%">
              </el-table-column>

              <el-table-column align="center" label="分析器" min-width="20%">
                  <template slot-scope="scope">
                  {{ scope.row.cls_name }}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="参数" min-width="70%">
                  <template slot-scope="scope">
                  {{ scope.row.params}}
                  </template>
              </el-table-column>

              <el-table-column align="center" label="" min-width="5%">
                  <template slot-scope="scope">
                    <i style="font-size:18px; color: gray; cursor: pointer " @click="deleteFromArray(backtestParams.analyzers, scope.row)" class="el-icon-delete" v-if="editable">
                      
                    </i>
                  </template>
              </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import classParam from "@/views/backtest/_params/_class_param";
import config from "@/configs/system_configs";
import { deleteFromArray, dateToString} from "@/utils/general";
import paramsConfig from "@/views/backtest/_params/config"

export default {
  props: {
    // 回测参数
    backtestParams: {
      type: Object,
      default: {},
    },

    // 重新加载回测参数(可能重新初始化, 或者载入新的参数)
    reloadParams: {
      type: Number,
      default: 0
    },

    // 保持传入参数
    keepParams: {
      type: Boolean,
      default: false
    },

    // 是否可编辑参数
    editable: {
      type: Boolean,
      default: true
    }
  },

  components: {
    classParam,
  },

  data() {
    return {
      paramsConfig: paramsConfig,

      /* ------ 标的 ------ */
      productParamsState: false,
      bar_level: '1h',
      setToDate: false,

      /* ------ 策略 ------ */
      strategyParamsState: false,
      currentStrategy: null,
      strategyClassType: "strategy",
      refreshStrategyParam: 0,

      /* ------ 过滤器 ------ */
      filterParamsState: false,
      currentFilter: null,
      filterClassType: "filter",
      refreshFilterParam: 0,

      /* ------ 建仓器 ------ */
      sizerParamsState: false,
      currentSizer: null,
      sizerClassType: "sizer",
      refreshSizerParam: 0,
      sizerList: [],

      /* ------ 分析器 ------ */
      analyzerParamsState: false,
      currentAnalyzer: null,
      analyzerClassType: "analyzer",
      refreshAnalyzerParam: 0,

      /* ------ 资金&费用 ------ */
      brokerParamsState: false,
      cash: 10000,
      slippage: 0.003,
      commission: 0.001,
      enableCommission: false,
      enableSlippage: false,
      brokerList: null,
    };
  },

  watch: {
    reloadParams(val){
      this.init()
      if(this.keepParams == false){
        // 回测参数初始化
        this.initBacktestParams()
      } else {
        // backtestParams不初始化, 只需要设置brokerList和sizerList
        this.brokerList = [this.backtestParams.broker]
        this.sizerList = [this.backtestParams.sizer]
      }

    },

    "backtestParams.products.datas"(val) {
      this.checkProductParams()
    },
    "backtestParams.products.bar_level"(val) {
      this.checkProductParams()
    },
    "backtestParams.products.from_date"(val) {
      this.checkProductParams()
    },
    "backtestParams.products.to_date"(val) {
      this.checkProductParams()
    },

    "backtestParams.strategies"(val) {
      this.checkStrategyParams()
    },

    "backtestParams.trade_filters"(val) {
      this.checkTradeFilterParams()
    },

    "backtestParams.sizer"(val) {
      this.checkSizerParams()
    },

    "backtestParams.analyzers"(val) {
      this.checkAnalyzerParams()
    },

    "backtestParams.broker"(val) {
      this.checkBrokerParams()
    },
    "backtestParams.broker.cash"(val) {
      this.checkBrokerParams()
    },
  },

    created() {
      this.init()
      if(this.keepParams == false){
        // 回测参数初始化
        this.initBacktestParams()
      } else {
        // backtestParams不初始化, 只需要设置brokerList和sizerList
        this.brokerList = [this.backtestParams.broker]
        this.sizerList = [this.backtestParams.sizer]
      }

      this.checkAllParams()
    },

    methods: {
        // 其他初始化
        init() {
            this.currentStrategy = {
                cls_name: null,
                params: {},
            };
            this.currentFilter = {
                cls_name: null,
                params: {},
            };
            this.currentSizer = {
                cls_name: null,
                params: {},
            };
            this.currentAnalyzer = {
                cls_name: null,
                params: {},
            };
        },

        // 初始化所有/单独的params: 格式要严格按照backtest_runner.py中的定义
        initBacktestParams(type = "all") {
            if ((type == "all" || type == "product") && !this.backtestParams.hasOwnProperty('products')) {
              this.$set(this.backtestParams, "products", {})
              this.$set(this.backtestParams.products, "bar_level", this.bar_level)
              this.$set(this.backtestParams.products, "from_date", null)
              this.$set(this.backtestParams.products, "to_date", null)
              this.$set(this.backtestParams.products, "datas", [])
              this.setToDate = false
            }
            if ((type == "all" || type == "broker") && !this.backtestParams.hasOwnProperty('broker')) {
              this.$set(this.backtestParams, "broker", {})
              this.$set(this.backtestParams.broker, "cash", this.cash)
              this.$set(this.backtestParams.broker, "enable_commission", this.enableCommission)
              this.$set(this.backtestParams.broker, "commission", this.commission)
              this.$set(this.backtestParams.broker, "enable_slippage", this.enableSlippage)
              this.$set(this.backtestParams.broker, "slippage", this.slippage)
              this.brokerList = [this.backtestParams.broker]
            }
            if ((type == "all" || type == "strategy") && !this.backtestParams.hasOwnProperty('strategies')) {
              this.$set(this.backtestParams, "strategies", [])
            }
            if ((type == "all" || type == "filter") && !this.backtestParams.hasOwnProperty('trade_filters')) {
              this.$set(this.backtestParams, "trade_filters", [])
            }
            if ((type == "all" || type == "sizer") && !this.backtestParams.hasOwnProperty('sizer')) {
              this.$set(this.backtestParams, "sizer", null)
            }
            if ((type == "all" || type == "analyzer") && !this.backtestParams.hasOwnProperty('analyzers')) {
              this.$set(this.backtestParams, "analyzers", [])
            }
        },

        // strategy添加id(加入list时添加): 如果strategies为空, id=1; 否则id比strategies中的最大id大1
        addStrategyId() {
            var strategyId = 1
            for(var i = 0; i < this.backtestParams.strategies.length; i++){
              if(parseInt(this.backtestParams.strategies[i].params.strategy_id) >= strategyId){
                strategyId = parseInt(this.backtestParams.strategies[i].params.strategy_id) + 1
              }
            }
            this.currentStrategy.params["strategy_id"] = strategyId.toString();
        },

        addStrategy() {
            var ret = this.checkBeforeAdd(
                this.currentStrategy,
                paramsConfig.paramsMap.strategy
            );
            if (ret) {
                this.addStrategyId();
                this.backtestParams.strategies.push(
                    JSON.parse(JSON.stringify(this.currentStrategy))
                );
            }
            this.refreshStrategyParam += 1; // 不知为何alert不能实时更新, 必须刷新子组件!
        },

        addFilter() {
            var ret = this.checkBeforeAdd(this.currentFilter, paramsConfig.paramsMap.filter);
            if (ret) {
                this.backtestParams.trade_filters.push(
                    JSON.parse(JSON.stringify(this.currentFilter))
                );
            }
            this.refreshFilterParam += 1; // 不知为何alert不能实时更新, 必须刷新子组件!
        },

        addSizer() {
            var ret = this.checkBeforeAdd(this.currentSizer, paramsConfig.paramsMap.sizer);
            if (ret) {
                this.backtestParams.sizer = JSON.parse(JSON.stringify(this.currentSizer))
                this.sizerList = [this.backtestParams.sizer]
            }
            this.refreshSizerParam += 1; // 不知为何alert不能实时更新, 必须刷新子组件!
        },

        delelteSizer(sizerList, sizer){
          deleteFromArray(sizerList, sizer)
          this.backtestParams.sizer = null
        },

        addAnalyzer() {            
            var ret = this.checkBeforeAdd(
                this.currentAnalyzer,
                paramsConfig.paramsMap.analyzer
            );
            if (ret) {
                // 添加report writer: 必须添加, 否则rets不会写入backtest_report.analyzer_rets中
                this.currentAnalyzer.params['writer'] = {cls_name: 'report', params: {}}
                
                this.backtestParams.analyzers.push(
                    JSON.parse(JSON.stringify(this.currentAnalyzer))
                );
            }
            this.refreshAnalyzerParam += 1; // 不知为何alert不能实时更新, 必须刷新子组件!
        },

        // 检查classObj的参数是否正确
        checkBeforeAdd(currentObj, paramMap) {
            var checkSuccess = true;
            for (let ix in paramMap[currentObj.cls_name]) {
                var param = paramMap[currentObj.cls_name][ix];
                // 1 检查参数是否可空
                var ret = this.checkNullable(param, param.name, currentObj.params);
                if (!ret) {
                    checkSuccess = false;
                    param.alert = "此参数不能为空";
                } else {
                    param.alert = null;
                }

                // 2 检查object的格式是否正确(Json?)

                // 3 检查Number是否格式正确
            }

            return checkSuccess;
        },

        // 检查参数是否可空
        checkNullable(param, name, obj) {
            if ( param.nullable === false && (!obj.hasOwnProperty(name) || obj[name] === "")) {
                return false;
            } else {
                return true;
            }
        },

        checkAllParams(){
          this.checkProductParams()
          this.checkSizerParams()
          this.checkStrategyParams()
          this.checkTradeFilterParams()
          this.checkAnalyzerParams()
          this.checkBrokerParams()
        },
  
        checkProductParams(){
          if (
            this.backtestParams.products.datas.length > 0 &&
            this.backtestParams.products.bar_level != null &&
            this.backtestParams.products.from_date != null
          ) {
            this.productParamsState = true;
          } else {
            this.productParamsState = false;
          }
        },

        checkStrategyParams(){
          if (this.backtestParams.strategies.length > 0) {
            this.strategyParamsState = true;
          } else {
            this.strategyParamsState = false;
          }
        },

        checkTradeFilterParams(){
          if (this.backtestParams.trade_filters.length >= 0) {  // trade_filters可以为空
            this.filterParamsState = true;
          } else {
            this.filterParamsState = false;
          }
        },

        checkSizerParams(){
          // 默认sizer为下单量1个单位
          this.sizerParamsState = true
        },

        checkAnalyzerParams(){
          if (this.backtestParams.analyzers.length >= 0) {
            this.analyzerParamsState = true;
          } else {
            this.analyzerParamsState = false;
          }
        },

        checkBrokerParams(){
          if ( this.backtestParams.broker.cash > 0 ) {
            this.brokerParamsState = true;
          } else {
            this.brokerParamsState = false;
          }
        },

        // 自顶向下render对应的子组件
        refreshSubComp(classType) {
            if (classType === "sizer" || classType === "sizer_leverager") {
                this.refreshSizerParam += 1;
            } else if (classType == "strategy") {
                this.refreshStrategyParam += 1;
            } else if (classType == "filter") {
                this.refreshFilterParam += 1;
            } else if (classType == "analyzer" || classType === "analyzer_writer") {
                this.refreshAnalyzerParam += 1;
            }
        },

        // 从product name获取交易所名称, eg: crypto_binance_margin_btc/usdt -> binance
        getExchange(productName){
          return productName.split('_')[1]
        },
        // 从product name获取类型名称, eg: crypto_binance_margin_btc/usdt -> margin
        getSubtype(productName){
          return productName.split('_')[2]
        },
        // 从product name获取类型名称, eg: crypto_binance_margin_btc/usdt -> margin
        getSymbol(productName){
          return productName.split('_')[3].toUpperCase()
        },

        // Product to_date变更
        productsToDateChange(state){
          if (state === false){
            this.backtestParams.products.to_date = null
          }
        },

        // 格式: editable模式下动态调整展示区域span
        editableSpan(){
          if(this.editable){
            return 16
          } else {
            return 24
          }
        },

        editableBackground(){
          if(this.editable){
            return {background: 'lightgray'}
          } else {
            return {background: 'white'}
          }         
        },

        deleteFromArray: deleteFromArray,
    },
};
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

.el-switch__label *{
    font-size:16px;
    font-weight: 400;
}



</style>