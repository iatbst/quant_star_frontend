<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 总表 + 长短仓位分布 --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="16">
        <div style="margin-left: 20px; margin-right: 20px; margin-top: 40px; margin-bottom: 40px">
            <summary-table 
            v-bind:summary-datas="[pfoMasterDatas, subaccountDatas, pfoDatas]" 
            v-bind:live-rets="liveRets"
            v-if="pfoMasterDatasAvailable && subaccountDatasAvailable && pfoDatasAvailable" 
            style="margin-bottom: 20px">
            </summary-table>
        </div>
      </el-col>

      <el-col :span="8">
          <div style="margin-left: 0px; margin-top: 20px">
            <strategy-level-positions
            v-bind:pfo-datas="pfoMasterDatas" 
            v-if="pfoMasterDatasAvailable" 
            style="margin-bottom: 20px">
            </strategy-level-positions>
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

    <!---------------------------------- Benchbark 回测比较 ----------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
      <el-col :span="16">
          <div style="margin-bottom: 20px">
            <value-line 
            v-bind:values="backtest2Rets.value_line" 
            v-bind:title="btValueName"
            v-bind:y-type="btValueLineType"
            v-bind:range="btValueLineRange"
            v-if="backtest2RetsAvailable" 
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

    <!----------------------------------- 仓位 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px; margin-top: 20px">
        <!-- 仓位详情 -->
        <position-map 
        v-bind:positions="positions" 
        v-bind:positions-loading="positionsLoading"
        ></position-map> 
    </div>
  </div>
</template>

<script>
// Components
import summaryTable from '@/views/dashboard/v2/summary_table'
import valueLine from '@/views/balance/_value_line'
import strategyLevelPositions from '@/views/position/_strategy_level_positions'
import exchangeBalanceDistributions from '@/views/balance/_exchange_balance_distributions'
import liveBacktestStats from '@/views/dashboard/v2/live_backtest_stats'
import positionMap from '@/views/position/position_map'

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
import { getProductDatas } from '@/api/product'
import { getAnnualReturn, getMaxDrawdown} from '@/utils/general'


export default {
    components: {
        summaryTable,

        valueLine,

        strategyLevelPositions,

        exchangeBalanceDistributions,

        liveBacktestStats,


        totalBalance,
        pfoBalances,
        balanceDistributions,

        totalPosition,
        positionRanks,
        positionMap,

        pfoPerfs,
        totalPerf,
        profitRanks
    },

    data() {
        return {
          
            pfoHosts: config.pfoHosts,

            summaryDatas: [],

            pfoDatas: [],
            pfoDatasAvailable: false,

            pfoMasterDatas: [],     
            pfoMasterDatasAvailable: false,
            totalBalanceValues: {},
            totalBalanceValuesAvailable: false,

            subaccountDatas: [],
            subaccountDatasAvailable: false,

            delegateWorkerDatas: [],

            positions: [],
            positionsAvailable: false,
            positionsLoading: false,

            productVolumes: {},
            productVolumesAvailable: false,

            liveValueName: '实盘资金',
            btValueName: '15币回测资金',

            btValueLineType: 'logarithmic',
            btValueLineRange: 'all',

            backtest1Rets: {},  // top15-3y
            backtest1RetsAvailable: false,
            backtest2Rets: {},  // top15-6m
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
            
            // 获取Positions (Pfo)
            this.fetchPositions()

            // 获取Product Volumes (Pfo)
            // this.fetchProductVolumes()
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
            getPortfolioDatas(config.masterHost, 'portfolio,wallet,positions').then(response => {
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
            this.positions = []
            var count = 0
            this.positionsLoading = true
            this.positionsAvailable = false
            for(var i = 0; i < this.pfoHosts.length; i++){
                getPositions(this.pfoHosts[i], 'normal').then(response => {
                        count += 1
                        var pfoPositions = response.results
                        // 每个position添加host信息
                        for (let j = 0; j < pfoPositions.length; j++){
                            pfoPositions[j]['host'] = response.config.baseURL
                        }
                        this.positions = this.positions.concat(pfoPositions)
                        if (count === this.pfoHosts.length ){
                            // 排序
                            this.positionsAvailable = true
                            this.positionsLoading = false 
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