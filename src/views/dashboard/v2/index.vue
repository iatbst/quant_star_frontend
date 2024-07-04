<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 表格 --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="24" align="center">
        <div style="margin-left: 20px; margin-right: 20px; margin-top: 40px; margin-bottom: 40px; width: 95%">
            <!--- 资产表 ---
                函数: fetchParentPfoWallet
            -->
            <balance-table 
            v-bind:parentPfoWallet="parentPfoWallet" 
            v-if="parentPfoWalletAvailable" >
            </balance-table>

            <!--- 仓位表 ---
                函数: 
                    - fetchParentPfoPositions
                    - fetchSubAccountDatas
                    - fetchParentPfoAtrptg
            --->
            <position-table 
            v-bind:parentPfoPositions="parentPfoPositions" 
            v-bind:subaccountDatas="subaccountDatas" 
            v-bind:parentPfoAtrptg="parentPfoAtrptg" 
            v-if="parentPfoPositionsAvailable && subaccountDatasAvailable && parentPfoAtrptgAvailable">
            </position-table>

            <!--- 今日表 ---
                函数: 
                    - fetchParentPfoPositions
                    - fetchTodayOrders
                    - fetchTodayPnls
                    - fetchTodayFundingFees
            --->
            <today-table 
            v-bind:parentPfoPositions="parentPfoPositions" 
            v-bind:parentPfoPositionsHistory="parentPfoPositionsHistory" 
            v-bind:todayOrders="todayOrders" 
            v-bind:todayStrategyPnl="todayStrategyPnl"
            v-bind:todayFundingFees="todayFundingFees" 
            v-if="parentPfoPositionsAvailable && todayOrdersAvailable && todayPnlAvailable && todayFundingFeesAvailable"
            >
            </today-table>
            
            <!--- Perf统计表 ---
                函数: fetchParentPfoTradeStats
            --->
            <perf-table 
            v-bind:parentPfoTradeStats="parentPfoTradeStats" 
            v-bind:binanceBalancePtg="binanceBalancePtg"
            v-bind:okexBalancePtg="okexBalancePtg"
            v-if="parentPfoTradeStatsAvailable && subaccountDatasAvailable">
            </perf-table>

            <!--- 刷新说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        资产表格: 每分钟第5秒刷新1次
                        <br/>
                        仓位表格: 每分钟第5秒刷新1次
                        <br />
                        今日表格: 每间隔5分钟刷新1次(非整点);盈亏列每小时第5分钟刷新1次;资金费每小时第30分钟刷新1次
                        <br/>
                        策略今年表现表格: 每小时第5分钟刷新1次
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-refresh"></i>说明</span>
                </el-tooltip>
            </div>
        </div>
      </el-col>
    </el-row>   

    <!---------------------------------- 资产曲线 -----------------------------------
        函数:
            - fetchLiveValueline 
            - fetchBacktestValuelines
        更新频率: ?
    --->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <two-value-line 
            v-bind:values="
            [
                {
                    title: liveValueName,
                    data: totalBalanceValues
                },
                {
                    title: btValueLines.all.name,
                    data: btValueLines.all.data
                },
            ]
            "
            v-if="totalBalanceValuesAvailable && btValueLines.all.available" 
            style="margin-bottom: 20px">
            </two-value-line>

            <!--- 刷新说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        实盘资产曲线: 每天00:01:00刷新1次
                        <br/>
                        回测资产曲线: 每天09:00:00刷新1次
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-refresh"></i>说明</span>
                </el-tooltip>
            </div>
          </div>
      </el-col>
    </el-row>

    <!---------------------------------- 策略的Pnl Lines -----------------------------------
        函数:fetchPnlLines 
        更新频率: ?
    --->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <multi-value-line 
            v-bind:values="
            [
                {
                    title: pnlLines.pivot_reversal.name,
                    data: pnlLines.pivot_reversal.data
                },
                {
                    title: pnlLines.plunge_back.name,
                    data: pnlLines.plunge_back.data
                },
            ]
            " 
            v-if="
            pnlLines.pivot_reversal.available && 
            pnlLines.plunge_back.available
            " 
            style="margin-bottom: 20px">
            </multi-value-line>

            <!--- 刷新说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        策略收益曲线: 每天00:30:00刷新1次
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-refresh"></i>说明</span>
                </el-tooltip>
            </div>
          </div>
      </el-col>
    </el-row>

    <!----------------------------------- 仓位ranks ---------------------------------------
        函数:fetchPositions 
        更新频率: ?
    --->  
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <position-ranks2
            v-bind:positions="positions"
            v-if="prBinancePositionsAvailable && prOkexPositionsAvailable && 
            pbBinancePositionsAvailable && pbOkexPositionsAvailable" 
            ></position-ranks2> 

            <!--- 刷新说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        仓位排名: 每间隔5分钟刷新1次(非整点)
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-refresh"></i>说明</span>
                </el-tooltip>
            </div>
          </div>
      </el-col>
    </el-row>

    <!----------------------------------- 策略仓位 ---------------------------------------
        函数:fetchPositions 
        更新频率: ?
    --->  
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <strategy-positions
            v-bind:positions="positions"
            v-if="prBinancePositionsAvailable && prOkexPositionsAvailable && 
            pbBinancePositionsAvailable && pbOkexPositionsAvailable" 
            ></strategy-positions> 

            <!--- 刷新说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        策略仓位: 每间隔5分钟刷新1次(非整点)
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-refresh"></i>说明</span>
                </el-tooltip>
            </div>
          </div>
      </el-col>
    </el-row>

    <!----------------------------------- 仓位 ---------------------------------------
        函数:fetchPositions 
        更新频率: ?
    --->  
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <!-- pr_binance -->
            <position-map2 
            v-bind:positions="prBinancePositions" 
            v-bind:positions-loading="prBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'大'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prBinanceSortWeights"
            ></position-map2> 

            <!-- pr_okex -->
            <position-map2 
            v-bind:positions="prOkexPositions" 
            v-bind:positions-loading="prOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'大'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prOkexSortWeights"
            ></position-map2> 

            <!-- pb_binance -->
            <position-map2 
            v-bind:positions="pbBinancePositions" 
            v-bind:positions-loading="pbBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'底'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
            ></position-map2> 

            <!-- pb_okex -->
            <position-map2 
            v-bind:positions="pbOkexPositions" 
            v-bind:positions-loading="pbOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'底'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
            ></position-map2> 

            <!--- 刷新说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        策略仓位明细: 每间隔5分钟刷新1次(非整点)
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-refresh"></i>说明</span>
                </el-tooltip>
            </div>
         </div>
      </el-col>
    </el-row>

    <!----------------------------------- 订单(1天内) ---------------------------------------
        函数:fetchOrders
        更新频率: ?
    ---> 
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <!-- 仓位详情 -->
            <orders 
            v-bind:orders="orders" 
            v-bind:orders-loading="ordersLoading"
            ></orders>

            <!--- 刷新说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        24H内订单: 每间隔5分钟刷新1次(非整点)
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-refresh"></i>说明</span>
                </el-tooltip>
            </div>
         </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
// Components
import orders from '@/views/orders/_orders'

import todayTable from '@/views/dashboard/v2/today_table'
import perfTable from '@/views/dashboard/v2/perf_table'
import positionTable from '@/views/dashboard/v2/position_table'
import balanceTable from '@/views/dashboard/v2/balance_table'
import valueLine from '@/views/balance/_value_line'
import twoValueLine from '@/views/balance/_two_value_line'
import multiValueLine from '@/views/balance/_multi_value_line'
import strategyLevelPositions from '@/views/position/_strategy_level_positions'
// import strategyPositions from '@/views/position/_strategy_positions'
import exchangeBalanceDistributions from '@/views/balance/_exchange_balance_distributions'
import positionMap2 from '@/views/position/position_map2'

import totalBalance from '@/views/balance/total_balance'
import pfoBalances from '@/views/balance/pfo_balances'
import balanceDistributions from '@/views/balance/balance_distributions'
import totalPosition from '@/views/position/total_position'
import positionRanks2 from '@/views/position/position_ranks2'
import strategyPositions from '@/views/dashboard/v2/strategy_positions'
import totalPerf from '@/views/performance/total_perf'
import pfoPerfs from '@/views/performance/pfo_perfs'
import profitRanks from '@/views/performance/profit_ranks'

import config from '@/configs/system_configs'
import { getPortfolioDatas, getPortfolioDataByName } from '@/api/portfolio' 
import { getSubAccountDatas} from '@/api/subaccount'
import { getDelegateWorkerDatas } from '@/api/worker'
import { getPositions } from '@/api/position'
import { getBacktestPlanByName } from '@/api/backtest_plan'
import { getBacktestReportById, getBacktestReportByName } from '@/api/backtest_report'
import { getOrders } from '@/api/order'
import { getNormalWorkerDatas } from '@/api/worker'
import { getFees } from '@/api/fee'


export default {
    components: {
        orders,

        balanceTable,
        positionTable,
        perfTable,
        todayTable,

        valueLine,
        twoValueLine,
        multiValueLine,
        

        strategyLevelPositions,
        strategyPositions,

        exchangeBalanceDistributions,


        totalBalance,
        pfoBalances,
        balanceDistributions,

        totalPosition,
        positionRanks2,
        positionMap2,

        pfoPerfs,
        totalPerf,
        profitRanks
    },

    data() {
        return { 
            pfoHosts: config.pfoHosts,
            prBinanceHosts: config.prBinanceHosts,
            prOkexHosts: config.prOkexHosts,
            pbBinanceHosts: config.pbBinanceHosts,
            pbOkexHosts: config.pbOkexHosts,
            prBinanceSortWeights: config.prBinanceSortWeights,
            prOkexSortWeights: config.prOkexSortWeights,

            orders: [],
            ordersLoading: false,
            todayOrders: [],
            todayFundingFees: [],
            todayOrdersAvailable: false,
            todayPnlAvailable: false,
            todayStrategyPnl: null,
            todayFundingFeesAvailable: false,

            parentPfoTradeStats: null,
            parentPfoTradeStatsAvailable: false,

            parentPfoWallet: null,
            parentPfoWalletAvailable: false,

            parentPfoPositions: null,
            parentPfoPositionsAvailable: false,
            parentPfoPositionsHistory: null,

            parentPfoAtrptg: null,
            parentPfoAtrptgAvailable: false,

            totalBalanceValues: {},
            totalBalanceValuesAvailable: false,

            subaccountDatas: [],
            subaccountDatasAvailable: false,

            positions: [],
            positionsAvailable: false,
            positionsLoading: false,

            prBinancePositions: [],
            prBinancePositionsAvailable: false,
            prBinancePositionsLoading: false,
            prOkexPositions: [],
            prOkexPositionsAvailable: false,
            prOkexPositionsLoading: false,
            pbBinancePositions: [],
            pbBinancePositionsAvailable: false,
            pbBinancePositionsLoading: false,
            pbOkexPositions: [],
            pbOkexPositionsAvailable: false,
            pbOkexPositionsLoading: false,
            // prmBinancePositions: [],
            // prmBinancePositionsAvailable: false,
            // prmBinancePositionsLoading: false,
            // prmOkexPositions: [],
            // prmOkexPositionsAvailable: false,
            // prmOkexPositionsLoading: false,

            binanceBalancePtg: null,
            okexBalancePtg: null,

            liveValueName: '实盘资金',

            // 记录策略回测资产曲线
            btValueLines: {
                'all': {
                    'name': '回测资金',
                    'data': null,
                    'available': false
                },                
                // 'pivot_reversal': {
                //     'name': 'Pivot Reversal',
                //     'data': null,
                //     'available': false
                // },
                // 'pivot_reversal_v1': {
                //     'name': 'Pivot Reversal(V1)',
                //     'data': null,
                //     'available': false
                // }, 
                // 'pivot_reversal_v2': {
                //     'name': 'Pivot Reversal(V2)',
                //     'data': null,
                //     'available': false
                // }, 
                // 'plunge_back': {
                //     'name': 'Plunge Back回测资金曲线',
                //     'data': null,
                //     'available': false
                // },                               
            },

            // 策略的Pnl Line(今年)
            pnlLines: {
                'pivot_reversal': {
                    'name': '大',
                    'data': null,
                    'available': false
                },
                'plunge_back': {
                    'name': '底',
                    'data': null,
                    'available': false
                },
                // 'pivot_reversal_mini': {
                //     'name': '小',
                //     'data': null,
                //     'available': false
                // },                                 
            },

            refreshInterval: 1000,
            refreshIntervalId: null,

            fastRefreshInterval: 60000,
            fastIntervalId: null,
            slowRefreshInterval: 300000,
            slowIntervalId: null,

            parentPfoWalletRefresh: null,
            parentPfoPositionsRefresh: null,
            todayOrdersRefresh: null,
            todayFundingFeesRefresh: null,
            todayPnlsRefresh: null,
            parentPfoTradeStatsRefresh: null,
            liveBalanceValuesRefresh: null,
            btBalanceValuesRefresh: null,
            pnlLinesRefresh: null,
            positionsRefresh: null,
            ordersRefresh: null,
            parentPfoAtrptgRefresh: null,
        }
    },

    created() {
        this.fetchDatas()
        this.refresh()
    },

    methods: {
        // 获取所有数据
        fetchDatas(){
            // 表格1: 总体资产信息
            this.fetchParentPfoWallet()

            // 表格2: 总体仓位信息
            this.fetchParentPfoPositions()
            this.fetchParentPfoAtrptg()
            this.fetchSubAccountDatas()

            // 表格3: 总体今日信息
            this.fetchTodayOrders()
            this.fetchTodayPnls()
            this.fetchTodayFundingFees()

            // 表格4: 总体策略表现
            this.fetchParentPfoTradeStats()

            // 图表1: 实盘资产 VS 回测资产
            this.fetchLiveValueline()   // 实盘资产曲线
            this.fetchBacktestValuelines()  // 策略的回测资产曲线

            // 图表2: 策略收益曲线
            this.fetchPnlLines()

            // 图表3: 仓位排名 + 仓位表格
            this.fetchPositions()

            // 订单列表
            this.fetchOrders()
        },

        // 获取worker的pnls
        fetchTodayPnls(){
            this.todayPnlsRefresh = new Date()

            // 准备实盘start/end
            var ep = Math.round(Date.now()/1000)
            ep += 3600*8
            var startDt = new Date((ep - ep%86400 - 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')    // UTC
            var endDt = new Date((ep - ep%3600 - 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')    // UTC                  

            // 获取pnl
            var count = 0
            var workerPnls = []
            for(let host of this.pfoHosts){
                // 获取worker.data.pnl_line
                getNormalWorkerDatas(host, 'worker,pnl_line').then(response => {
                        count += 1

                        // 提取信息
                        var pnls = []
                        for(var i = 0; i < response.results.length; i++){
                            if(response.results[i].pnl_line !== null && startDt in response.results[i].pnl_line && endDt in response.results[i].pnl_line){
                                // 只处理startDt和endDt都存在的pnl
                                var pnl = response.results[i]["pnl_line"][endDt] - response.results[i]["pnl_line"][startDt]
                                var strategy = response.results[i].worker.strategy_name.replaceAll('-', '_')
                                pnls.push({
                                    'pnl': pnl,
                                    'strategy': strategy,
                                })
                            }
                        }
                        workerPnls = workerPnls.concat(pnls)

                        if (count === this.pfoHosts.length){
                            // 处理数据
                            this.parsePnl(workerPnls)
                            this.todayPnlAvailable = true
                        }
                    }
                )
            }
        },

        // 把原始的workerPnl进行分组: 相同的strategy分为一组
        parsePnl(workerPnls){
            this.todayStrategyPnl = {}
            for(const data of workerPnls){
                var sty = data.strategy
                if (!(sty in this.todayStrategyPnl)){
                    this.todayStrategyPnl[sty] = 0             
                }
                if (data.pnl != null && data.pnl != 0){
                    this.todayStrategyPnl[sty] += data.pnl              
                }
            }
        },

        // 获取最近24Horders
        fetchOrders(){
            this.ordersRefresh = new Date()
            this.orders = []
            this.ordersLoading = true
            var days = 1    // 默认展示最近24H
            var startDt = new Date(Date.now() - 24 * 3600 * 1000 * days).toISOString().slice(0, 19).replace('T', ' ')    // UTC
            var endDt = new Date().toISOString().slice(0, 19).replace('T', ' ')      // UTC
            var count = 0
            for(var i = 0; i < this.pfoHosts.length; i++){
                var host = this.pfoHosts[i]
                var filters = 'show_worker=true&no_parent_order=true&exec_size__gt=0&exec_ts__gte=' + startDt
                getOrders(host, null, filters).then(response => {
                        count += 1
                        // 添加host
                        for(var i = 0; i < response.results.length; i++){
                            // 点击获取对应的trade时知道从那个host获取
                            response.results[i]["host"] = response.config.baseURL
                        }

                        this.orders = this.orders.concat(response.results)

                        if (count === this.pfoHosts.length){
                            // 排序
                            this.orders.sort((a, b) => b.exec_ts.localeCompare(a.exec_ts))
                            this.ordersLoading = false
                        }
                    }
                )
            }
        },

        // 获取今日orders
        fetchTodayOrders(){
            this.todayOrdersRefresh = new Date()
            this.todayOrders = []
            var ep = Math.round(Date.now()/1000)
            ep += 8*3600
            var startDt = new Date((ep - ep%86400 - 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')    // UTC 
            var count = 0
            for(var i = 0; i < this.pfoHosts.length; i++){
                var host = this.pfoHosts[i]
                var filters = 'show_worker=true&no_parent_order=true&exec_size__gt=0&exec_ts__gte=' + startDt
                getOrders(host, null, filters).then(response => {
                        count += 1
                        // 添加host
                        // for(var i = 0; i < response.results.length; i++){
                        //     // 点击获取对应的trade时知道从那个host获取
                        //     response.results[i]["host"] = response.config.baseURL
                        // }
                        this.todayOrders = this.todayOrders.concat(response.results)

                        if (count === this.pfoHosts.length){
                            // 排序
                            this.orders.sort((a, b) => b.exec_ts.localeCompare(a.exec_ts))
                            this.todayOrdersAvailable = true
                        }
                    }
                )
            }
        },

        // 获取今日永续合约资金费
        fetchTodayFundingFees(){
            this.todayFundingFeesRefresh = new Date()
            this.todayFundingFees = []
            var ep = Math.round(Date.now()/1000)
            ep += 8*3600
            var startDt = new Date((ep - ep%86400 - 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')    // UTC 
            var host = config.masterHost
            var filters = 'fee_type=swap_funding&ts__gte=' + startDt
            var fields = 'amount'
            getFees(host, fields, filters).then(response => {
                    this.todayFundingFees = response.results
                    this.todayFundingFeesAvailable = true
                }
            )
        },

        // 从master获取各个策略的回测资产曲线
        fetchBacktestValuelines(){
            this.btBalanceValuesRefresh = new Date()
            for (const sty in this.btValueLines){
                var reportName = sty + '_backtest'
                this.btValueLines[sty].available = false
                getBacktestReportByName(config.masterHost, reportName).then(response => {
                    this.btValueLines[sty].data = response.results[0].analyzer_rets.value_line
                    this.btValueLines[sty].available = true
                })
            }
        },

        // 从Master获取实盘资产曲线
        fetchLiveValueline(){
            this.liveBalanceValuesRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'wallet').then(response => {
                this.totalBalanceValues = response.results[0].wallet.history_values
                this.totalBalanceValuesAvailable = true
            })
        },

        // 从Master获取资产信息
        fetchParentPfoWallet(){
            this.parentPfoWalletRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'wallet').then(response => {
                this.parentPfoWallet = response.results[0].wallet
                this.parentPfoWalletAvailable = true
            })
        },


        // 从Master获取Atrptg信息
        fetchParentPfoAtrptg(){
            this.parentPfoAtrptgRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'market').then(response => {
                this.parentPfoAtrptg = response.results[0].market.atrptg
                this.parentPfoAtrptgAvailable = true
            })
        },

        // 从Master获取TradeStats信息
        fetchParentPfoTradeStats(){
            this.parentPfoTradeStatsRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'trade_stats').then(response => {
                this.parentPfoTradeStats = response.results[0].trade_stats
                this.parentPfoTradeStatsAvailable = true
            })
        },

        // 从Master获取仓位信息
        fetchParentPfoPositions(){
            this.parentPfoPositionsRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'positions,positions_history').then(response => {
                this.parentPfoPositions = response.results[0].positions
                this.parentPfoPositionsHistory = response.results[0].positions_history
                this.parentPfoPositionsAvailable = true
            })
        },

        // 从Master获取所pnl lines
        fetchPnlLines(){
            this.pnlLinesRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'pnl_line').then(response => {
                    var parentPfoData = response.results[0]
                    this.pnlLines.pivot_reversal.data = parentPfoData.pnl_line.pivot_reversal.year_now
                    this.pnlLines.pivot_reversal.available = true
                    this.pnlLines.plunge_back.data = parentPfoData.pnl_line.plunge_back.year_now
                    this.pnlLines.plunge_back.available = true
                    // this.pnlLines.pivot_reversal_mini.data = parentPfoData.pnl_line.pivot_reversal_mini.year_now
                    // this.pnlLines.pivot_reversal_mini.available = true                    
                }
            )
        },

        // 从Master获取所有subaccount data
        fetchSubAccountDatas() {
            this.subaccountDatas = []
            getSubAccountDatas(config.masterHost, 'positions,wallet,subaccount').then(response => {
                    this.subaccountDatas = response.results
                    this.calBalancePtg()    // 临时任务   
                    this.subaccountDatasAvailable = true
                }
            )
        },

        // Temp: 临时计算Binance和Okex的资产百分比
        calBalancePtg(){
            var binanceBalance = null
            var okexBalance = null
            for(let data of this.subaccountDatas){
                if(data.subaccount.account.name == 'binance_69174462@qq.com'){
                    binanceBalance = data.wallet.usdt_amount
                }
                if(data.subaccount.account.name == 'okex_sunyoung.capital@gmail.com'){
                    okexBalance = data.wallet.usdt_amount
                }                
            }
            if (binanceBalance != null && okexBalance != null){
                this.binanceBalancePtg = (binanceBalance*100/(binanceBalance + okexBalance)).toFixed(1) + '%'
                this.okexBalancePtg = (okexBalance*100/(binanceBalance + okexBalance)).toFixed(1) + '%'
            } else {
                this.binanceBalancePtg = null
                this.okexBalancePtg = null
            }
        },

        // 从Pfo获取所有positions(normal workers)
        fetchPositions() {
            this.positionsRefresh = new Date()

            // 所有positions
            this.positions = []
            this.positionsAvailable = false
            this.positionsLoading = true

            // pr binance
            this.prBinancePositions = []
            var prBinanceCount = 0
            this.prBinancePositionsLoading = true
            this.prBinancePositionsAvailable = false
            for(var i = 0; i < this.prBinanceHosts.length; i++){
                getPositions(this.prBinanceHosts[i], 'normal').then(response => {
                        prBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.prBinancePositions = this.prBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prBinanceCount === this.prBinanceHosts.length ){
                            // 排序
                            this.prBinancePositionsAvailable = true
                            this.prBinancePositionsLoading = false
                        }
                    }
                )
            }

            // pr okex
            this.prOkexPositions = []
            var prOkexCount = 0
            this.prOkexPositionsLoading = true
            this.prOkexPositionsAvailable = false
            for(var i = 0; i < this.prOkexHosts.length; i++){
                getPositions(this.prOkexHosts[i], 'normal').then(response => {
                        prOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.prOkexPositions = this.prOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prOkexCount === this.prOkexHosts.length ){
                            // 排序
                            this.prOkexPositionsAvailable = true
                            this.prOkexPositionsLoading = false
                        }
                    }
                )
            }

            // pb binance
            this.pbBinancePositions = []
            var pbBinanceCount = 0
            this.pbBinancePositionsLoading = true
            this.pbBinancePositionsAvailable = false
            for(var i = 0; i < this.pbBinanceHosts.length; i++){
                getPositions(this.pbBinanceHosts[i], 'normal').then(response => {
                        pbBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'plunge_back'
                        }
                        this.pbBinancePositions = this.pbBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (pbBinanceCount === this.pbBinanceHosts.length ){
                            // 排序
                            this.pbBinancePositionsAvailable = true
                            this.pbBinancePositionsLoading = false
                        }
                    }
                )
            }

            // pr okex
            this.pbOkexPositions = []
            var pbOkexCount = 0
            this.pbOkexPositionsLoading = true
            this.pbOkexPositionsAvailable = false
            for(var i = 0; i < this.pbOkexHosts.length; i++){
                getPositions(this.pbOkexHosts[i], 'normal').then(response => {
                        pbOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'plunge_back'
                        }
                        this.pbOkexPositions = this.pbOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (pbOkexCount === this.pbOkexHosts.length ){
                            // 排序
                            this.pbOkexPositionsAvailable = true
                            this.pbOkexPositionsLoading = false
                        }
                    }
                )
            }
        },

        // 定时刷新数据函数
        refresh() {
            // 计时器正在进行中，退出函数
            if (this.refreshIntervalId != null) {
                return;
            }

            // 计时器为空，操作
            this.refreshIntervalId = setInterval(() => {
                var now = new Date();
                var hour = now.getHours()
                var minute = now.getMinutes()
                var second = now.getSeconds()
                var date = now.getDate()

                console.log("刷新检查:" + now);
                // 资产表格
                if(second >= 5 && minute != this.parentPfoWalletRefresh.getMinutes()){
                    console.log(now + '刷新:fetchParentPfoWallet');
                    this.fetchParentPfoWallet()
                }
                // 仓位表格
                if(second >= 5 && minute != this.parentPfoPositionsRefresh.getMinutes()){
                    console.log(now + '刷新:fetchParentPfoPositions;fetchSubAccountDatas');
                    this.fetchParentPfoPositions()
                    this.fetchSubAccountDatas()
                }  
                // Atrptg
                if(minute >= 30 && date != this.parentPfoTradeStatsRefresh.getDate()){
                    console.log(now + '刷新:fetchParentPfoAtrptg');
                    this.fetchParentPfoAtrptg()
                }  
                // 今日表格
                if(now - this.todayOrdersRefresh > 5*60*1000){
                    console.log(now + '刷新:fetchTodayOrders');
                    this.fetchTodayOrders()
                }  
                if(minute >= 5 && hour != this.todayPnlsRefresh.getHours()){
                    console.log(now + '刷新:fetchTodayPnls');
                    this.fetchTodayPnls()
                }  
                if(minute >= 30 && hour != this.todayFundingFeesRefresh.getHours()){
                    console.log(now + '刷新:fetchTodayFundingFees');
                    this.fetchTodayFundingFees()
                }  
                // Perf表格
                if(minute >= 5 && hour != this.parentPfoTradeStatsRefresh.getHours()){
                    console.log(now + '刷新:fetchParentPfoTradeStats');
                    this.fetchParentPfoTradeStats()
                }  
                // 实盘资产VS回测资产
                if(minute >= 1 && date != this.liveBalanceValuesRefresh.getDate()){
                    console.log(now + '刷新:fetchLiveValueline');
                    this.fetchLiveValueline()                   
                }
                if(hour >= 9 && date != this.btBalanceValuesRefresh.getDate()){
                    console.log(now + '刷新:fetchBacktestValuelines');
                    this.fetchBacktestValuelines()                   
                }
                // 策略收益曲线
                if(minute >= 30 && date != this.pnlLinesRefresh.getDate()){
                    console.log(now + '刷新:fetchPnlLines');
                    this.fetchPnlLines()
                }  
                // 仓位表格 + 仓位排名柱状图
                if(now - this.positionsRefresh > 5*60*1000){
                    console.log(now + '刷新:fetchPositions');
                    this.fetchPositions()
                } 
                // 订单列表
                if(now - this.ordersRefresh > 5*60*1000){
                    console.log(now + '刷新:fetchOrders');
                    this.fetchOrders()
                } 

            }, this.refreshInterval);
        }, 

        // 停止定时器
        clear() {
            clearInterval(this.refreshIntervalId); //清除计时器
            this.refreshIntervalId = null; //设置为null
        },
    },

    destroyed(){
        // 在页面销毁后，清除计时器
        this.clear();
    }
}
</script>