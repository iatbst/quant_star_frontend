<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 总表 + 长短仓位分布 --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="24">
        <div style="margin-left: 20px; margin-right: 20px; margin-top: 40px; margin-bottom: 40px">
            <summary-table 
            v-bind:parentPfoData="parentPfoData" 
            v-bind:subaccountDatas="subaccountDatas" 
            v-if="pfoMasterDatasAvailable && subaccountDatasAvailable" 
            style="margin-bottom: 20px">
            </summary-table>
        </div>
      </el-col>
    </el-row>   

    <!---------------------------------- 资产曲线 + 交易所资金分布 ----------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
      <el-col :span="16">
          <div style="margin-bottom: 20px">
            <value-line 
            v-bind:values="totalBalanceValues" 
            v-bind:title="liveValueName"
            v-if="totalBalanceValuesAvailable" 
            style="margin-bottom: 20px">
            </value-line>
          </div>
      </el-col>

      <el-col :span="8">
          <div style="margin-left: 0px; margin-top: 20px">
            <exchange-balance-distributions
            v-bind:subaccount-datas="subaccountDatas" 
            v-if="subaccountDatasAvailable"
            style="margin-bottom: 20px">
            </exchange-balance-distributions>
          </div>
      </el-col>
    </el-row> 

    <!---------------------------------- 策略的Pnl Lines ----------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="22" :offset="1">
          <div style="margin-bottom: 20px">
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
                {
                    title: pnlLines.pivot_reversal_mini.name,
                    data: pnlLines.pivot_reversal_mini.data
                },
            ]
            " 
            v-if="
            pnlLines.pivot_reversal.available && 
            pnlLines.plunge_back.available &&
            pnlLines.pivot_reversal_mini.available
            " 
            style="margin-bottom: 20px">
            </multi-value-line>
          </div>
      </el-col>
    </el-row>


    <!---------------------------------- Benchbark 回测比较 -----------------------------------
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
      <el-col :span="16">
          <div style="margin-bottom: 20px">
            <value-line 
            v-bind:values="btValueLines.all.data" 
            v-bind:title="btValueLines.all.name"
            v-bind:y-type="btValueLineType"
            v-bind:range="btValueLineRange"
            v-if="btValueLines.all.available" 
            style="margin-bottom: 20px">
            </value-line>
          </div>
      </el-col>

      <el-col :span="8">
          <div style="margin-left: 20px; margin-right: 20px; margin-top: 40px; margin-bottom: 40px">
            <live-backtest-stats
            v-bind:live-backtest-stat-datas="liveBacktestStatDatas" 
            v-bind:live-rets="liveRets"
            v-if="liveRets.available && backtest1RetsAvailable && backtest2RetsAvailable" 
            style="margin-bottom: 20px">
            </live-backtest-stats>
          </div>
      </el-col>
    </el-row> 
    ------->

    <!---------------------------------- 回测曲线与仓位 -----------------------------------
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
      <el-col :span="16">
          <div style="margin-bottom: 20px">
            <multi-value-line 
            v-bind:values="
            [
                {
                    title: btValueLines.pivot_reversal.name,
                    data: btValueLines.pivot_reversal.data
                },
                {
                    title: btValueLines.pivot_reversal_v1.name,
                    data: btValueLines.pivot_reversal_v1.data
                },
                {
                    title: btValueLines.pivot_reversal_v2.name,
                    data: btValueLines.pivot_reversal_v2.data
                },
            ]
            " 
            v-bind:y-type="btValueLineType"
            v-bind:range="btValueLineRange"
            v-if="
            btValueLines.pivot_reversal.available && 
            btValueLines.pivot_reversal_v1.available &&
            btValueLines.pivot_reversal_v2.available
            " 
            style="margin-bottom: 20px">
            </multi-value-line>
          </div>
      </el-col>

      <el-col :span="8">
          <div style="margin-left: 20px; margin-right: 20px; margin-top: 40px; margin-bottom: 40px">
            <strategy-positions
            v-bind:pos-summary="parentPfoData.positions.summary" 
            v-bind:strategy-alias-list="strategyAlias.pivot_reversal"
            v-if="pfoMasterDatasAvailable" 
            style="margin-bottom: 20px">
            </strategy-positions>
          </div>
      </el-col>
    </el-row> 

    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="16">
          <div style="margin-bottom: 20px">
            <value-line 
            v-bind:values="btValueLines.plunge_back.data" 
            v-bind:title="btValueLines.plunge_back.name"
            v-bind:y-type="btValueLineType"
            v-bind:range="btValueLineRange"
            v-if="btValueLines.plunge_back.available" 
            style="margin-bottom: 20px">
            </value-line>
          </div>
      </el-col>

      <el-col :span="8">
          <div style="margin-left: 20px; margin-right: 20px; margin-top: 40px; margin-bottom: 40px">
            <strategy-positions
            v-bind:pos-summary="parentPfoData.positions.summary" 
            v-bind:strategy-alias-list="strategyAlias.plunge_back"
            v-if="pfoMasterDatasAvailable" 
            style="margin-bottom: 20px">
            </strategy-positions>
          </div>
      </el-col>
    </el-row> 
    ------->

    <!----------------------------------- 仓位 ---------------------------------------
    <div style="background-color: white; margin-bottom: 20px; margin-top: 20px">
        <position-map 
        v-bind:positions="positions" 
        v-bind:positions-loading="positionsLoading"
        ></position-map> 
    </div>
    -------->

    <!----------------------------------- 仓位 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px; margin-top: 20px">
        <!-- pr_binance -->
        <position-map2 
        v-bind:positions="prBinancePositions" 
        v-bind:positions-loading="prBinancePositionsLoading"
        v-bind:exchange="'Binance'"
        v-bind:strategy="'大PV'"
        v-bind:col-count="5"
        v-bind:show-zero="true"
        ></position-map2> 

        <!-- pr_okex -->
        <position-map2 
        v-bind:positions="prOkexPositions" 
        v-bind:positions-loading="prOkexPositionsLoading"
        v-bind:exchange="'Okex'"
        v-bind:strategy="'大PV'"
        v-bind:col-count="5"
        v-bind:show-zero="true"
        ></position-map2> 

        <!-- pb_binance -->
        <position-map2 
        v-bind:positions="pbBinancePositions" 
        v-bind:positions-loading="pbBinancePositionsLoading"
        v-bind:exchange="'Binance'"
        v-bind:strategy="'抄底'"
        v-bind:col-count="7"
        v-bind:show-zero="false"
        ></position-map2> 

        <!-- pb_okex -->
        <position-map2 
        v-bind:positions="pbOkexPositions" 
        v-bind:positions-loading="pbOkexPositionsLoading"
        v-bind:exchange="'Okex'"
        v-bind:strategy="'抄底'"
        v-bind:col-count="7"
        v-bind:show-zero="false"
        ></position-map2> 

        <!-- prm_binance -->
        <position-map2 
        v-bind:positions="prmBinancePositions" 
        v-bind:positions-loading="prmBinancePositionsLoading"
        v-bind:exchange="'Binance'"
        v-bind:strategy="'小PV'"
        v-bind:col-count="20"
        v-bind:show-zero="false"
        ></position-map2> 

        <!-- prm_okex -->
        <position-map2 
        v-bind:positions="prmOkexPositions" 
        v-bind:positions-loading="prmOkexPositionsLoading"
        v-bind:exchange="'Okex'"
        v-bind:strategy="'小PV'"
        v-bind:col-count="20"
        v-bind:show-zero="false"
        ></position-map2> 
    </div>

    <!----------------------------------- 订单(3天内) --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px; margin-top: 20px">
        <!-- 仓位详情 -->
        <orders 
        v-bind:orders="orders" 
        v-bind:orders-loading="ordersLoading"
        ></orders>
    </div>

  </div>
</template>

<script>
// Components
import orders from '@/views/orders/_orders'

import summaryTable from '@/views/dashboard/v2/summary_table'
import valueLine from '@/views/balance/_value_line'
import multiValueLine from '@/views/balance/_multi_value_line'
import strategyLevelPositions from '@/views/position/_strategy_level_positions'
import strategyPositions from '@/views/position/_strategy_positions'
import exchangeBalanceDistributions from '@/views/balance/_exchange_balance_distributions'
import liveBacktestStats from '@/views/dashboard/v2/live_backtest_stats'
import positionMap2 from '@/views/position/position_map2'

import totalBalance from '@/views/balance/total_balance'
import pfoBalances from '@/views/balance/pfo_balances'
import balanceDistributions from '@/views/balance/balance_distributions'
import totalPosition from '@/views/position/total_position'
import positionRanks from '@/views/position/position_ranks'
import totalPerf from '@/views/performance/total_perf'
import pfoPerfs from '@/views/performance/pfo_perfs'
import profitRanks from '@/views/performance/profit_ranks'

import config from '@/configs/system_configs'
import { getPortfolioDatas } from '@/api/portfolio' 
import { getSubAccountDatas} from '@/api/subaccount'
import { getDelegateWorkerDatas } from '@/api/worker'
import { getPositions } from '@/api/position'
import { getBacktestPlanByName } from '@/api/backtest_plan'
import { getBacktestReportById } from '@/api/backtest_report'
import { getOrders } from '@/api/order'
import { getAnnualReturn, getMaxDrawdown } from '@/utils/general'


export default {
    components: {
        orders,

        summaryTable,

        valueLine,
        multiValueLine,
        

        strategyLevelPositions,
        strategyPositions,

        exchangeBalanceDistributions,

        liveBacktestStats,


        totalBalance,
        pfoBalances,
        balanceDistributions,

        totalPosition,
        positionRanks,
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
            prmBinanceHosts: config.prmBinanceHosts,
            prmOkexHosts: config.prmOkexHosts,

            summaryDatas: [],

            pfoDatas: [],
            pfoDatasAvailable: false,

            orders: [],
            ordersLoading: false,

            trades: [],
            tradesLoading: false,

            pfoMasterDatas: [],     
            pfoMasterDatasAvailable: false,
            totalBalanceValues: {},
            totalBalanceValuesAvailable: false,
            parentPfoData: null,

            subaccountDatas: [],
            subaccountDatasAvailable: false,

            delegateWorkerDatas: [],

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
            prmBinancePositions: [],
            prmBinancePositionsAvailable: false,
            prmBinancePositionsLoading: false,
            prmOkexPositions: [],
            prmOkexPositionsAvailable: false,
            prmOkexPositionsLoading: false,

            productVolumes: {},
            productVolumesAvailable: false,

            liveValueName: '实盘资金',
            btValueName: '15币回测资金',

            // 记录策略回测资产曲线
            btValueLines: {
                'pivot_reversal': {
                    'name': 'Pivot Reversal',
                    'data': null,
                    'available': false
                },
                'pivot_reversal_v1': {
                    'name': 'Pivot Reversal(V1)',
                    'data': null,
                    'available': false
                }, 
                'pivot_reversal_v2': {
                    'name': 'Pivot Reversal(V2)',
                    'data': null,
                    'available': false
                }, 
                'plunge_back': {
                    'name': 'Plunge Back回测资金曲线',
                    'data': null,
                    'available': false
                },                               
            },

            // 策略的Pnl Line(今年)
            pnlLines: {
                'pivot_reversal': {
                    'name': '大PV',
                    'data': null,
                    'available': false
                },
                'plunge_back': {
                    'name': '抄底',
                    'data': null,
                    'available': false
                },
                'pivot_reversal_mini': {
                    'name': '小PV',
                    'data': null,
                    'available': false
                },                                 
            },
            btValueLineType: 'logarithmic',
            pnlLineRange: 'thisYear',

            // 不同策略的Alias
            strategyAlias: {
                'pivot_reversal': ['pr1', 'pr2', 'pr3', 'pr4'],
                'pivot_reversal_short': ['prs1', 'prs2'],
                'plunge_back': ['pb1', 'pb2'],
            },

            btValueLineType: 'logarithmic',
            btValueLineRange: 'all',

            backtest1Rets: {},  // top15-6m
            backtest1RetsAvailable: false,
            backtest2Rets: {},  // top15-3y
            backtest2RetsAvailable: false,
            liveRets: {
                available: false,
                annualReturn: null,
                maxDrawdown: null,
                countPerSymbol: null,
                winRatio: null,
                plRatio: null,
            },

            liveBacktestStatDatas: [{
                stats: '年化收益率',
                live: null,
                btShortTerm: null,
                btLongTerm: null
            },{
                stats: '最大回撤',
                live: null,
                btShortTerm: null,
                btLongTerm: null              
            },{
                stats: '交易次数/币',
                live: null,
                btShortTerm: null,
                btLongTerm: null                  
            },{
                stats: '胜率',
                live: null,
                btShortTerm: null,
                btLongTerm: null                  
            },{
                stats: '盈亏比',
                live: null,
                btShortTerm: null,
                btLongTerm: null                  
            }],

            refreshInterval: 300000,
            intervalId: null
        }
    },

    created() {
        this.fetchDatas()
        this.dataRefreh()
    },

    methods: {
        // 获取所有数据
        fetchDatas(){
            // 获取Pfo Datas (Pfo)
            this.fetchPfoDatas()

            // 获取Pfo Wallet Data (Master)
            this.fetchPfoDatasFromMaster()

            // 获取Subaccount Datas (Master)
            this.fetchSubAccountDatas()

            // 获取Benchmark 回测数据 (Backtest)
            this.fetchBacktestDatas()

            // 获取策略的回测资产曲线
            this.fetchStrategyValuelines()
            
            // 获取Positions (Pfo)
            this.fetchPositions()

            // 获取Orders
            this.fetchOrders()
        },

        fetchOrders(){
            this.orders = []
            this.ordersLoading = true
            var days = 3    // 默认展示最近3天
            var startDt = new Date(Date.now() - 24 * 3600 * 1000 * days).toISOString().slice(0, 19).replace('T', ' ')    // UTC
            var endDt = new Date().toISOString().slice(0, 19).replace('T', ' ')      // UTC
            var count = 0
            for(var i = 0; i < this.pfoHosts.length; i++){
                var host = this.pfoHosts[i]
                var filters = 'show_worker=true&no_parent_order=true&exec_size__gt=0&created_ts__gte=' + startDt + '&created_ts__lte=' + endDt
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
                            this.orders.sort((a, b) => b.created_ts.localeCompare(a.created_ts))
                            this.ordersLoading = false
                        }
                    }
                )
            }
        },

        // 从Backtest获取benchmark回测数据
        fetchBacktestDatas(){
            var btSymbols = 15
            // pr策略_top15币种_6月
            var planName = 'pr_top15_6m_backtest'
            this.backtest1RetsAvailable = false
            getBacktestPlanByName(config.backtestHost, planName).then(response => {
                var plan = response.results[0]
                getBacktestReportById(config.backtestHost, plan.latest_report_id).then(response => {
                    var report = response.results[0]
                    this.backtest1Rets = report.analyzer_rets
                    
                    // 6月的annual_return和max_drawdown需要从3年的value_line中截取, 否则不能直接和实盘对比
                    // this.liveBacktestStatDatas[0].btShortTerm = (this.backtest1Rets.value.annual_return*100).toFixed(2) + '%'
                    // this.liveBacktestStatDatas[1].btShortTerm = (this.backtest1Rets.drawdown.top1*100).toFixed(2) + '%'
                    this.liveBacktestStatDatas[2].btShortTerm = (this.backtest1Rets.trade_stats.count/btSymbols).toFixed(0)
                    this.liveBacktestStatDatas[3].btShortTerm = (this.backtest1Rets.trade_stats.win_ratio*100).toFixed(2) + '%'
                    this.liveBacktestStatDatas[4].btShortTerm = (Math.abs(this.backtest1Rets.trade_stats.win_avg_pnl_ptg/this.backtest1Rets.trade_stats.lose_avg_pnl_ptg)).toFixed(2)

                    this.backtest1RetsAvailable = true
                })
            })

            // pr策略_top15币种_3年
            var planName = 'pr_top15_3y_backtest'
            getBacktestPlanByName(config.backtestHost, planName).then(response => {
                var plan = response.results[0]
                this.backtest2RetsAvailable = false
                getBacktestReportById(config.backtestHost, plan.latest_report_id).then(response => {
                    var report = response.results[0]
                    this.backtest2Rets = report.analyzer_rets

                    this.liveBacktestStatDatas[0].btLongTerm = (this.backtest2Rets.value.annual_return*100).toFixed(2) + '%'
                    this.liveBacktestStatDatas[1].btLongTerm = (this.backtest2Rets.drawdown.top1*100).toFixed() + '%'
                    this.liveBacktestStatDatas[2].btLongTerm = (this.backtest2Rets.trade_stats.count/btSymbols).toFixed(0)
                    this.liveBacktestStatDatas[3].btLongTerm = (this.backtest2Rets.trade_stats.win_ratio*100).toFixed(2) + '%'
                    this.liveBacktestStatDatas[4].btLongTerm = (Math.abs(this.backtest2Rets.trade_stats.win_avg_pnl_ptg/this.backtest2Rets.trade_stats.lose_avg_pnl_ptg)).toFixed(2)

                    // 6月的annual_return和max_drawdown需要从3年的value_line中截取, 否则不能直接和实盘对比
                    var valueLine3y = report.analyzer_rets.value_line
                    var date = new Date()
                    date.setMonth(date.getMonth() - 6)
                    var firstDate = date.toISOString().slice(0, 10)
                    this.liveBacktestStatDatas[0].btShortTerm = (getAnnualReturn(valueLine3y, firstDate)*100).toFixed(2) + '%'
                    this.liveBacktestStatDatas[1].btShortTerm = (getMaxDrawdown(valueLine3y, firstDate)*100).toFixed(2) + '%'

                    this.backtest2RetsAvailable = true
                })
            })
        },

        // 从Backtest获取各个策略的回测资产曲线
        fetchStrategyValuelines(){
            for (const sty in this.btValueLines){
                var planName = sty + '_backtest'
                this.btValueLines[sty].available = false
                getBacktestPlanByName(config.backtestHost, planName).then(response => {
                    var plan = response.results[0]
                    getBacktestReportById(config.backtestHost, plan.latest_report_id).then(response => {
                        this.btValueLines[sty].data = response.results[0].analyzer_rets.value_line
                        this.btValueLines[sty].available = true
                    })
                })
            }
        },


        // 从Pfo获取所有pfo data
        fetchPfoDatas() {
            this.pfoDatas = []
            if (this.pfoHosts.length > 0){
                for(var i = 0; i < this.pfoHosts.length; i++){
                    getPortfolioDatas(this.pfoHosts[i]).then(response => {
                            var data = response.results
                            data['sort_id'] = config.pfoAliasSortWeights[data[0].portfolio.alias]
                            this.pfoDatas.push(data)
                            if (this.pfoDatas.length === this.pfoHosts.length ){
                                // pfo排序
                                this.pfoDatas.sort((a, b) => a.sort_id - b.sort_id)
                                this.pfoDatasAvailable = true
                            }
                        }
                    )
                }
            } else {
                this.pfoDatasAvailable = true
            }
        },

        // 从Master获取所有pfo的wallet/position data
        fetchPfoDatasFromMaster() {
            this.pfoMasterDatas = []
            getPortfolioDatas(config.masterHost, 'portfolio,wallet,positions,trade_stats,pnl_line').then(response => {
                    this.pfoMasterDatas = response.results
                    // 排序
                    for(var i = 0; i < this.pfoMasterDatas.length; i++){
                        this.pfoMasterDatas[i]['sort_id'] = config.pfoSortWeights[this.pfoMasterDatas[i].portfolio.name]
                        if (this.pfoMasterDatas[i].portfolio.name === config.cryptoParentPfo){
                            // Parent Pfo
                            this.totalBalanceValues = this.pfoMasterDatas[i].wallet.history_values
                            this.totalBalanceValuesAvailable = true
                        }
                    }
                    this.pfoMasterDatas.sort((a, b) => a.sort_id - b.sort_id)       
                    
                    // 标记父pfo
                    for(var i = 0; i < this.pfoMasterDatas.length; i++){
                        if (this.pfoMasterDatas[i].portfolio.name === config.cryptoParentPfo){
                            this.parentPfoData = this.pfoMasterDatas[i]
                        }
                    }

                    // Pnl Line
                    this.pnlLines.pivot_reversal.data = this.parentPfoData.pnl_line.pivot_reversal.year_now
                    this.pnlLines.pivot_reversal.available = true
                    this.pnlLines.plunge_back.data = this.parentPfoData.pnl_line.plunge_back.year_now
                    this.pnlLines.plunge_back.available = true
                    this.pnlLines.pivot_reversal_mini.data = this.parentPfoData.pnl_line.pivot_reversal_mini.year_now
                    this.pnlLines.pivot_reversal_mini.available = true                    

                    this.pfoMasterDatasAvailable = true
                }
            )
        },

        // 从Master获取所有subaccount data
        fetchSubAccountDatas() {
            this.subaccountDatas = []
            getSubAccountDatas(config.masterHost).then(response => {
                    this.subaccountDatas = response.results
                    this.subaccountDatasAvailable = true
                }
            )
        },

        // 从Pfo获取所有positions(normal workers)
        fetchPositions() {
            // pr binance
            this.prBinancePositions = []
            var prBinanceCount = 0
            this.prBinancePositionsLoading = true
            this.prBinancePositionsAvailable = false
            for(var i = 0; i < this.prBinanceHosts.length; i++){
                getPositions(this.prBinanceHosts[i], 'normal').then(response => {
                        prBinanceCount += 1
                        var positions = response.results
                        // 每个position添加host信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.prBinancePositions = this.prBinancePositions.concat(positions)
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
                        // 每个position添加host信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.prOkexPositions = this.prOkexPositions.concat(positions)
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
                        // 每个position添加host信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.pbBinancePositions = this.pbBinancePositions.concat(positions)
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
                        // 每个position添加host信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.pbOkexPositions = this.pbOkexPositions.concat(positions)
                        if (pbOkexCount === this.pbOkexHosts.length ){
                            // 排序
                            this.pbOkexPositionsAvailable = true
                            this.pbOkexPositionsLoading = false
                        }
                    }
                )
            }
    
            // prm binance
            this.prmBinancePositions = []
            var prmBinanceCount = 0
            this.prmBinancePositionsLoading = true
            this.prmBinancePositionsAvailable = false
            for(var i = 0; i < this.prmBinanceHosts.length; i++){
                getPositions(this.prmBinanceHosts[i], 'normal').then(response => {
                        prmBinanceCount += 1
                        var positions = response.results
                        // 每个position添加host信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.prmBinancePositions = this.prmBinancePositions.concat(positions)
                        if (prmBinanceCount === this.prmBinanceHosts.length ){
                            // 排序
                            this.prmBinancePositionsAvailable = true
                            this.prmBinancePositionsLoading = false
                        }
                    }
                )
            }

            // prm okex
            this.prmOkexPositions = []
            var prmOkexCount = 0
            this.prmOkexPositionsLoading = true
            this.prmOkexPositionsAvailable = false
            for(var i = 0; i < this.prmOkexHosts.length; i++){
                getPositions(this.prmOkexHosts[i], 'normal').then(response => {
                        prmOkexCount += 1
                        var positions = response.results
                        // 每个position添加host信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.prmOkexPositions = this.prmOkexPositions.concat(positions)
                        if (prmOkexCount === this.prmOkexHosts.length ){
                            // 排序
                            this.prmOkexPositionsAvailable = true
                            this.prmOkexPositionsLoading = false
                        }
                    }
                )
            }
        },

        // 从Pfo获取所有的volume data
        // fetchProductVolumes(){
        //     this.productVolumes = {}
        //     var productVolumesCount = 0
        //     this.productVolumesAvailable = false
        //     for(var i = 0; i < this.pfoHosts.length; i++){
        //         getProductDatas(this.pfoHosts[i], 'product,volumes').then(response => {
        //                 for(var i=0; i < response.results.length; i++){
        //                     var key = response.results[i].product.name.split('_').slice(1, 4).join('_')   // 转化为: exchange_sub-type_symbol形式， eg binance_swap_btc/usdt
        //                     this.productVolumes[key] = response.results[i].volumes.volume_weight
        //                 }
        //                 productVolumesCount += 1
        //                 if (productVolumesCount === this.pfoHosts.length ){
        //                     this.productVolumesAvailable = true
        //                     if (this.positionsAvailable) {
        //                        this.positionsLoading = false 
        //                     }
        //                 }
        //             }
        //         )
        //     }
        // },   

        // 从Pfo获取所有 delegate worker performance data
        fetchDelegateWorkerDatas() {
            this.delegateWorkerDatas = []
            for(var i = 0; i < this.pfoHosts.length; i++){
                getDelegateWorkerDatas(this.pfoHosts[i], 'worker,performance').then(response => {
                        this.delegateWorkerDatas.push(response.results)
                    }
                )
            }
        },

        // 定时刷新数据函数
        dataRefreh() {
            // 计时器正在进行中，退出函数
            if (this.intervalId != null) {
                return;
            }

            // 计时器为空，操作
            this.intervalId = setInterval(() => {
                    console.log("刷新" + new Date());
                    this.fetchDatas(); //加载数据函数
                }, this.refreshInterval);
        }, 

        // 停止定时器
        clear() {
            clearInterval(this.intervalId); //清除计时器
            this.intervalId = null; //设置为null
        },
    },

    destroyed(){
        // 在页面销毁后，清除计时器
        this.clear();
    }
}
</script>