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

            <!--- 平台表 ---
                函数: 
                    - fetchSubAccountDatas
            --->
            <exchange-table 
            v-bind:subaccountDatas="subaccountDatas" 
            v-bind:parentPfoWallet="parentPfoWallet" 
            v-if="subaccountDatasAvailable && parentPfoWalletAvailable">
            </exchange-table>

            <!--- 其他信息 ---
                函数: 
                    - fetchParentPfoBacktest
                    - fetchTodayPbOrderCount
                    - fetchLongShortRatios
                    - fetchSwapFundingRates
                    - fetchBullBearData
            --->
            <other-info-table 
            v-bind:parentPfoBacktest="parentPfoBacktest"
            v-bind:todayPbOrderCount="todayPbOrderCount"
            v-bind:longShortRatios="longShortRatios"
            v-bind:swapFundingRates="swapFundingRates"
            v-bind:subaccountDatas="subaccountDatas" 
            v-bind:parentPfoWallet="parentPfoWallet"
            v-bind:bullBearData="bullBearData" 
            v-if="longShortRatiosAvailable && swapFundingRatesAvailable && subaccountDatasAvailable && parentPfoWalletAvailable && bullBearDataAvailable && parentPfoBacktestAvailable">
            </other-info-table>

            <!--- 仓位表 ---
                函数: 
                    - fetchParentPfoPositions
                    - fetchSubAccountDatas
                    - fetchParentPfoAtrptg
            --->
            <position-table 
            v-bind:parentPfoPositions="parentPfoPositions" 
            v-bind:subaccountDatas="subaccountDatas" 
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
            v-bind:todayExchangePnl="todayExchangePnl"
            v-bind:todayFundingFees="todayFundingFees" 
            v-if="parentPfoPositionsAvailable && todayOrdersAvailable && todayPnlAvailable && todayFundingFeesAvailable"
            >
            </today-table>
        </div>
      </el-col>
    </el-row>   

    <!---------------------------------- 资产曲线 -----------------------------------
        函数:
            - fetchLiveValuelines
            - fetchBacktestValueline
        更新频率: ?
    --->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
      <el-col :span="12" align="center">
          <div style="margin-bottom: 20px; width: 100%">
            <hour-value-line 
            v-bind:values="
            [
                {
                    title: '小时实盘资金',
                    data: hourBalanceValues
                },
            ]
            "
            v-if="hourBalanceValuesAvailable" 
            style="margin-bottom: 20px">
            </hour-value-line>
          </div>
      </el-col>        
      <el-col :span="12" align="center">
          <div style="margin-bottom: 20px; width: 100%">
            <total-value-line 
            v-bind:values="
            [
                {
                    title: liveValueName,
                    data: totalBalanceValues
                },
            ]
            "
            v-if="totalBalanceValuesAvailable" 
            style="margin-bottom: 20px">
            </total-value-line>
          </div>
      </el-col>
    </el-row>

    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
        <!-- Binance -->
        <el-col :span="6" align="center">
            <div style="margin-bottom: 20px; width: 100%">
            <exchange-value-lines
            v-bind:values="
            [
                {
                    title: liveValueLines.binance.name,
                    data: liveValueLines.binance.data,
                },
                {
                    title: btValueLines.binance.name,
                    data: btValueLines.binance.data,
                    color: 'lightgray'
                },
            ]
            "
            v-if="liveValueLines.binance.available && btValueLines.binance.available" 
            style="margin-bottom: 20px">
            </exchange-value-lines>

            </div>
        </el-col>

        <!-- Okex -->
        <el-col :span="6" align="center">
            <div style="margin-bottom: 20px; width: 100%">
            <exchange-value-lines
            v-bind:values="
            [
                {
                    title: liveValueLines.okex.name,
                    data: liveValueLines.okex.data,
                },
                {
                    title: btValueLines.okex.name,
                    data: btValueLines.okex.data,
                    color: 'lightgray'
                },
            ]
            "
            v-if="liveValueLines.okex.available && btValueLines.okex.available" 
            style="margin-bottom: 20px">
            </exchange-value-lines>

            </div>
        </el-col>

        <!-- Bybit -->
        <el-col :span="6" align="center">
            <div style="margin-bottom: 20px; width: 100%">
            <exchange-value-lines
            v-bind:values="
            [
                {
                    title: liveValueLines.bybit.name,
                    data: liveValueLines.bybit.data,
                },
                {
                    title: btValueLines.bybit.name,
                    data: btValueLines.bybit.data,
                    color: 'lightgray'
                },
            ]
            "
            v-if="liveValueLines.bybit.available && btValueLines.bybit.available" 
            style="margin-bottom: 20px">
            </exchange-value-lines>

            </div>
        </el-col>

        <!-- Bitget -->
        <el-col :span="6" align="center">
            <div style="margin-bottom: 20px; width: 100%">
            <exchange-value-lines
            v-bind:values="
            [
                {
                    title: liveValueLines.bitget.name,
                    data: liveValueLines.bitget.data,
                },
                {
                    title: btValueLines.bitget.name,
                    data: btValueLines.bitget.data,
                    color: 'lightgray'
                },
            ]
            "
            v-if="liveValueLines.bitget.available && btValueLines.bitget.available" 
            style="margin-bottom: 20px">
            </exchange-value-lines>

            </div>
        </el-col>
    </el-row>

    <!---------------------------------- Perf Table -----------------------------------
        函数: fetchParentPfoTradeStats
    --->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; margin-top: 20px; width: 95%">
            <perf-table 
            v-bind:parentPfoTradeStats="parentPfoTradeStats" 
            v-if="parentPfoTradeStatsAvailable">
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
                    title: pnlLines.trendline_break.name,
                    data: pnlLines.trendline_break.data
                },
                {
                    title: pnlLines.plunge_back.name,
                    data: pnlLines.plunge_back.data
                },
                {
                    title: pnlLines.rsi_mini.name,
                    data: pnlLines.rsi_mini.data
                },
                {
                    title: pnlLines.id_nr.name,
                    data: pnlLines.id_nr.data
                },
                {
                    title: pnlLines.pivot_reversal_mini.name,
                    data: pnlLines.pivot_reversal_mini.data
                }                                  
            ]
            " 
            v-if="
            pnlLines.trendline_break.available && 
            pnlLines.plunge_back.available &&
            pnlLines.rsi_mini.available && 
            pnlLines.id_nr.available &&
            pnlLines.pivot_reversal_mini.available
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

    <!----------------------------------- 币种仓位ranks ---------------------------------------
        函数:fetchPositions 
        更新频率: ?
    --->  
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <position-ranks2
            v-bind:positions="positions"
            v-if="
            tbBinancePositionsAvailable 
            && tbOkexPositionsAvailable && tbBybitPositionsAvailable && tbBitgetPositionsAvailable &&
            pbOkexPositionsAvailable && pbBybitPositionsAvailable && pbBinancePositionsAvailable &&
            rsiOkexPositionsAvailable && rsiBybitPositionsAvailable && rsiBinancePositionsAvailable &&
            inOkexPositionsAvailable && inBybitPositionsAvailable && inBinancePositionsAvailable &&
            prmOkexPositionsAvailable && prmBybitPositionsAvailable && prmBinancePositionsAvailable
            "
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

    <!----------------------------------- 策略仓位ranks ---------------------------------------
        函数:fetchPositions 
        更新频率: ?
    --->  
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <strategy-positions
            v-bind:positions="positions"
            v-if="
            tbBinancePositionsAvailable 
            && tbOkexPositionsAvailable && tbBybitPositionsAvailable && tbBitgetPositionsAvailable &&
            pbOkexPositionsAvailable && pbBybitPositionsAvailable && pbBinancePositionsAvailable &&
            rsiOkexPositionsAvailable && rsiBybitPositionsAvailable && rsiBinancePositionsAvailable &&
            inOkexPositionsAvailable && inBybitPositionsAvailable && inBinancePositionsAvailable &&
            prmOkexPositionsAvailable && prmBybitPositionsAvailable && prmBinancePositionsAvailable
            "
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
import otherInfoTable from '@/views/dashboard/v2/other_info_table'
import exchangeTable from '@/views/dashboard/v2/exchange_table'
import balanceTable from '@/views/dashboard/v2/balance_table'
import valueLine from '@/views/balance/_value_line'
import totalValueLine from '@/views/dashboard/v2/total_valueline'
import hourValueLine from '@/views/dashboard/v2/hour_valueline'
import exchangeValueLines from '@/views/dashboard/v2/exchange_valuelines'
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
import { getTradesByFlagCodes } from '@/api/trade'
import { getPositions } from '@/api/position'
import { getBacktestPlanByName } from '@/api/backtest_plan'
import { getBacktestReportById, getBacktestReportByName } from '@/api/backtest_report'
import { getLongShortRatios } from '@/api/long_short_ratio'
import { getSwapFundingRates } from '@/api/swap_funding_rate'
import { getOrders } from '@/api/order'
import { getNormalWorkerDatas } from '@/api/worker'
import { getFees } from '@/api/fee'
import moment from 'moment' 
import { offset } from 'highcharts'


export default {
    components: {
        orders,

        balanceTable,
        positionTable,
        otherInfoTable,
        exchangeTable,
        perfTable,
        todayTable,

        valueLine,
        totalValueLine,
        hourValueLine,
        exchangeValueLines,
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
            tbBinanceHosts: config.tbBinanceHosts,
            tbOkexHosts: config.tbOkexHosts,
            tbBybitHosts: config.tbBybitHosts,
            tbBitgetHosts: config.tbBitgetHosts,
            pbOkexHosts: config.pbOkexHosts,
            pbBybitHosts: config.pbBybitHosts,
            pbBinanceHosts: config.pbBinanceHosts,
            rsiOkexHosts: config.rsiOkexHosts,
            rsiBybitHosts: config.rsiBybitHosts,
            rsiBinanceHosts: config.rsiBinanceHosts,
            inOkexHosts: config.inOkexHosts,
            inBybitHosts: config.inBybitHosts,
            inBinanceHosts: config.inBinanceHosts,
            prmOkexHosts: config.prmOkexHosts,
            prmBybitHosts: config.prmBybitHosts,
            prmBinanceHosts: config.prmBinanceHosts,
            tbBinanceSortWeights: config.tbBinanceSortWeights,
            tbOkexSortWeights: config.tbOkexSortWeights,
            tbBybitSortWeights: config.tbOkexSortWeights,
            tbBitgetSortWeights: config.tbOkexSortWeights,

            orders: [],
            ordersLoading: false,
            todayOrders: [],
            todayFundingFees: [],
            todayOrdersAvailable: false,
            todayPnlAvailable: false,
            todayStrategyPnl: null,
            todayExchangePnl: null,
            todayFundingFeesAvailable: false,
            todayPbOrderCount: null,
            todayPbOrderCountAvailable: false,

            parentPfoTradeStats: null,
            parentPfoTradeStatsAvailable: false,

            parentPfoWallet: null,
            parentPfoWalletAvailable: false,

            parentPfoBacktest: null,
            parentPfoBacktestAvailable: false,

            parentPfoPositions: null,
            parentPfoPositionsAvailable: false,
            parentPfoPositionsHistory: null,

            parentPfoAtrptg: null,
            parentPfoAtrptgAvailable: false,

            totalBalanceValues: {},
            totalBalanceValuesAvailable: false,
            hourBalanceValues: {},
            hourBalanceValuesAvailable: false,

            subaccountDatas: [],
            subaccountDatasAvailable: false,

            positions: [],
            positionsAvailable: false,
            positionsLoading: false,

            longShortRatios: [],
            longShortRatiosAvailable: false,
            swapFundingRates: [],
            swapFundingRatesAvailable: false,

            tbBinancePositions: [],
            tbBinancePositionsAvailable: false,
            tbBinancePositionsLoading: false,
            tbOkexPositions: [],
            tbOkexPositionsAvailable: false,
            tbOkexPositionsLoading: false,
            tbBybitPositions: [],
            tbBybitPositionsAvailable: false,
            tbBybitPositionsLoading: false,
            tbBitgetositions: [],
            tbBitgetPositionsAvailable: false,
            tbBitgetPositionsLoading: false,
            pbOkexPositions: [],
            pbOkexPositionsAvailable: false,
            pbOkexPositionsLoading: false,
            pbBybitPositions: [],
            pbBybitPositionsAvailable: false,
            pbBybitPositionsLoading: false,
            pbBinancePositions: [],
            pbBinancePositionsAvailable: false,
            pbBinancePositionsLoading: false,
            rsiOkexPositions: [],
            rsiOkexPositionsAvailable: false,
            rsiOkexPositionsLoading: false,
            rsiBybitPositions: [],
            rsiBybitPositionsAvailable: false,
            rsiBybitPositionsLoading: false,
            rsiBinancePositions: [],
            rsiBinancePositionsAvailable: false,
            rsiBinancePositionsLoading: false,
            inOkexPositions: [],
            inOkexPositionsAvailable: false,
            inOkexPositionsLoading: false,
            inBybitPositions: [],
            inBybitPositionsAvailable: false,
            inBybitPositionsLoading: false,
            inBinancePositions: [],
            inBinancePositionsAvailable: false,
            inBinancePositionsLoading: false,
            prmOkexPositions: [],
            prmOkexPositionsAvailable: false,
            prmOkexPositionsLoading: false,
            prmBybitPositions: [],
            prmBybitPositionsAvailable: false,
            prmBybitPositionsLoading: false,
            prmBinancePositions: [],
            prmBinancePositionsAvailable: false,
            prmBinancePositionsLoading: false,

            jiaPnl: 0,
            jiaPnlAvailable: false,
            sunPnl: 0,
            sunPnlAvailable: false,

            binanceBalancePtg: null,
            okexBalancePtg: null,

            liveValueName: '实盘资金',

            // 记录不同平台实盘资产曲线
            liveValueLines: {
                'binance': {
                    'name': 'Binance实盘',
                    'data': null,
                    'available': false
                },  
                'okex': {
                    'name': 'Okex实盘',
                    'data': null,
                    'available': false
                },
                'bybit': {
                    'name': 'Bybit实盘',
                    'data': null,
                    'available': false
                },
                'bitget': {
                    'name': 'Bitget实盘',
                    'data': null,
                    'available': false
                },                                           
            },

            // 记录策略回测资产曲线
            btValueLines: {
                // 'all': {
                //     'name': '回测资金',
                //     'data': null,
                //     'available': false
                // }, 
                'binance': {
                    'name': 'Binance回测',
                    'data': null,
                    'available': false
                },  
                'okex': {
                    'name': 'Okex回测',
                    'data': null,
                    'available': false
                },
                'bybit': {
                    'name': 'Bybit回测',
                    'data': null,
                    'available': false
                },
                'bitget': {
                    'name': 'Bitget回测',
                    'data': null,
                    'available': false
                },                                           
            },

            // 策略的Pnl Line(今年)
            pnlLines: {
                'trendline_break': {
                    'name': 'TB',
                    'data': null,
                    'available': false
                },
                'plunge_back': {
                    'name': 'PB',
                    'data': null,
                    'available': false
                },
                'rsi_mini': {
                    'name': 'RS',
                    'data': null,
                    'available': false
                }, 
                'id_nr': {
                    'name': 'IN',
                    'data': null,
                    'available': false
                },  
                'pivot_reversal_mini': {
                    'name': 'PM',
                    'data': null,
                    'available': false
                },                                                               
            },

            refreshInterval: 1000,
            refreshIntervalId: null,

            fastRefreshInterval: 60000,
            fastIntervalId: null,
            slowRefreshInterval: 300000,
            slowIntervalId: null,

            bullBearData: null,
            bullBearDataAvailable: false,

            parentPfoWalletRefresh: null,
            parentPfoBacktestRefresh: null,
            parentPfoPositionsRefresh: null,
            todayOrdersRefresh: null,
            longShortRatioRefresh: null,
            swapFundingRateRefresh: null,
            todayFundingFeesRefresh: null,
            todayPnlsRefresh: null,
            parentPfoTradeStatsRefresh: null,
            liveBalanceValuesRefresh: null,
            btBalanceValuesRefresh: null,
            pnlLinesRefresh: null,
            positionsRefresh: null,
            ordersRefresh: null,
            parentPfoAtrptgRefresh: null,
            jiaSunPnlRefresh: null
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

            // 表格4: 其他信息
            this.fetchParentPfoBacktest()
            // this.fetchTodayPbOrderCount()
            this.fetchLongShortRatios()
            this.fetchSwapFundingRates()
            this.fetchBullBearData()

            // 表格4: 总体今日信息
            this.fetchTodayOrders()
            this.fetchTodayPnls()
            this.fetchTodayFundingFees()

            // 表格5: 总体策略表现
            this.fetchParentPfoTradeStats()

            // 图表1: 实盘资产 VS 回测资产
            this.fetchLiveValuelines()   // 实盘资产曲线
            this.fetchBacktestValueline()  // 策略的回测资产曲线

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
                                var exchange = response.results[i].worker.name.split('_')[0]
                                pnls.push({
                                    'pnl': pnl,
                                    'strategy': strategy,
                                    'exchange': exchange
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
            this.todayExchangePnl = {}
            for(const data of workerPnls){
                var sty = data.strategy
                if (!(sty in this.todayStrategyPnl)){
                    this.todayStrategyPnl[sty] = 0             
                }
                if (data.pnl != null && data.pnl != 0){
                    this.todayStrategyPnl[sty] += data.pnl              
                }

                var exchange = data.exchange
                if (!(exchange in this.todayExchangePnl)){
                    this.todayExchangePnl[exchange] = 0             
                }
                if (data.pnl != null && data.pnl != 0){
                    this.todayExchangePnl[exchange] += data.pnl              
                }
            }
        },

        // 获取最近24H的多空数据
        fetchLongShortRatios(){
            this.longShortRatioRefresh = new Date()
            this.longShortRatios = []
            this.longShortRatiosAvailable = false
            var startMts = Date.now() - 25 * 3600 * 1000
            var filters = 'show_exchange=true&mts__gte=' + startMts
            getLongShortRatios(config.masterHost, filters).then(response => {
                    this.longShortRatios = response.results
                    this.longShortRatiosAvailable = true
                }
            )
        },

        // 获取最近24H的资金费率数据
        fetchSwapFundingRates(){
            this.swapFundingRateRefresh = new Date()
            this.swapFundingRates = []
            this.swapFundingRatesAvailable = false
            var startMts = Date.now() - 25 * 3600 * 1000
            var filters = 'mts__gte=' + startMts
            getSwapFundingRates(config.masterHost, filters).then(response => {
                    this.swapFundingRates = response.results
                    this.swapFundingRatesAvailable = true
                }
            )
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

        // 获取今日抄底orders
        fetchTodayPbOrderCount(){
            this.todayPbOrderCount = 0
            var ep = Math.round(Date.now()/1000)
            ep += 8*3600
            var startDt = new Date((ep - ep%86400 - 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')    // UTC 
            var count = 0
            var pbHosts = this.pbOkexHosts.concat(this.pbBybitHosts).concat(this.pbBinanceHosts)
            for(var i = 0; i < pbHosts.length; i++){
                // debugger
                var host = pbHosts[i]
                var filters = 'no_parent_order=true&exec_size__gt=0&exec_ts__gte=' + startDt
                getOrders(host, null, filters).then(response => {
                        count += 1
                        this.todayPbOrderCount += response.results.length
                        if (count === pbHosts.length){
                            // 排序
                            this.todayPbOrderCountAvailable = true
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
                            // debugger
                            this.todayOrders.sort((a, b) => b.exec_ts.localeCompare(a.exec_ts))
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
            var fields = null
            getFees(host, fields, filters).then(response => {
                    this.todayFundingFees = response.results
                    this.todayFundingFeesAvailable = true
                }
            )
        },

        // 从master获取回测资产曲线和仓位(目前只获取all)
        fetchBacktestValueline(){
            this.btBalanceValuesRefresh = new Date()
            for (const exchange in this.btValueLines){
                var reportName = exchange + '_backtest'
                this.btValueLines[exchange].available = false
                getBacktestReportByName(config.masterHost, reportName).then(response => {
                    this.btValueLines[exchange].data = response.results[0].value_line
                    this.btValueLines[exchange].available = true
                })
            }
        },

        // 从master获取趋势分历史数据(从bitget_backtest中获取)
        fetchBullBearData(){
            // this.btBalanceValuesRefresh = new Date()
            var reportName = 'bitget_backtest'
            this.bullBearDataAvailable = false
            getBacktestReportByName(config.masterHost, reportName).then(response => {
                this.bullBearData = response.results[0].data.bull_bear
                this.bullBearDataAvailable = true
            })
        },

        // 从Master获取实盘资产曲线
        fetchLiveValuelines(){
            this.liveBalanceValuesRefresh = new Date()
            // 获取总资金曲线
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'wallet').then(response => {
                this.totalBalanceValues = response.results[0].wallet.history_values
                this.totalBalanceValuesAvailable = true
                this.hourBalanceValues = response.results[0].wallet.hour_values
                this.hourBalanceValuesAvailable = true
            })
            // 获取各平台资金曲线
            getSubAccountDatas(config.masterHost, 'wallet,subaccount').then(response => {
                    var subaccountDatas = response.results  
                    for (const exchange in this.liveValueLines){
                        var found = false
                        for (const data of subaccountDatas){
                            if (data.subaccount.name.includes(exchange)){
                                this.liveValueLines[exchange].data = data.wallet.history_values
                                this.liveValueLines[exchange].available = true
                                found = true
                                // debugger;
                                break
                            }
                        }
                        if (found == false){
                            // 没有找到对应的数据
                            this.liveValueLines[exchange].data = {} // 空数据
                            this.liveValueLines[exchange].available = true                          
                        }
                    }
                }
            )
        },

        // 从Master获取资产信息
        fetchParentPfoWallet(){
            this.parentPfoWalletRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'wallet').then(response => {
                this.parentPfoWallet = response.results[0].wallet
                this.parentPfoWalletAvailable = true
            })
        },

        // 从Master获取回测信息
        fetchParentPfoBacktest(){
            this.parentPfoBacktestRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'backtest').then(response => {
                this.parentPfoBacktest = response.results[0].backtest
                this.parentPfoBacktestAvailable = true
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

                    // trendline
                    this.pnlLines.trendline_break.data = parentPfoData.pnl_line.trendline_break.year_now
                    this.pnlLines.trendline_break.available = true
                    // 临时修正: 2025-03-11的trendline_break的策略pnl归零,之后的日期都减去这个offset
                    var offsetPnl = this.pnlLines.trendline_break.data['2025-03-11']
                    for(let date in this.pnlLines.trendline_break.data){
                        if(date >= '2025-03-11'){
                            this.pnlLines.trendline_break.data[date] -= offsetPnl
                        }
                    }

                    // plunge_back
                    this.pnlLines.plunge_back.data = parentPfoData.pnl_line.plunge_back.year_now
                    this.pnlLines.plunge_back.available = true  

                    // rsi_mini
                    this.pnlLines.rsi_mini.data = parentPfoData.pnl_line.rsi_mini.year_now
                    this.pnlLines.rsi_mini.available = true  

                    // id_nr
                    this.pnlLines.id_nr.data = parentPfoData.pnl_line.id_nr.year_now
                    this.pnlLines.id_nr.available = true 

                    // pivot_reversal_mini
                    this.pnlLines.pivot_reversal_mini.data = parentPfoData.pnl_line.pivot_reversal_mini.year_now
                    this.pnlLines.pivot_reversal_mini.available = true 

                    // 添加上一年最后一日数据为起点数据(pnl = 0), 否则pnl的起点不是0
                    var firstDate = moment().year() - 1 + '-' + '12-31'
                    this.pnlLines.trendline_break.data[firstDate] = 0
                    this.pnlLines.plunge_back.data[firstDate] = 0
                    this.pnlLines.rsi_mini.data[firstDate] = 0
                    this.pnlLines.id_nr.data[firstDate] = 0
                    this.pnlLines.pivot_reversal_mini.data[firstDate] = 0
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

        // Temp: 从Master获取Sun&Jia的囤币当前收益(DEPRECATED)
        fetchHoldCoinPnl(){
            this.jiaSunPnlRefresh = new Date()
            this.jiaPnlAvailable = false
            this.sunPnlAvailable = false

            // Jia的trades
             getTradesByFlagCodes('jia', config.masterHost, 'pnl,position_pnl').then(response => {
                    this.jiaPnl = 0
                    for(let data of response.results){
                        this.jiaPnl +=  data.position_pnl
                        if (data.pnl != null){
                            this.jiaPnl += data.pnl
                        }
                    }
                    this.jiaPnl /= 1000
                    this.jiaPnlAvailable = true
                }
            )  

            // Sun的trades
             getTradesByFlagCodes('sun', config.masterHost, 'pnl,position_pnl').then(response => {
                    this.sunPnl = 0
                    for(let data of response.results){
                        this.sunPnl +=  data.position_pnl
                        if (data.pnl != null){
                            this.sunPnl += data.pnl
                        }
                    }

                    this.sunPnl /= 1000
                    this.sunPnlAvailable = true
                }
            )  
        },

        // Temp: 临时计算Binance和Okex的资产百分比
        calBalancePtg(){
            var binanceBalance = null
            var okexBalance = null
            for(let data of this.subaccountDatas){
                if(data.subaccount.account.name == 'binance_18812552095@163.com'){
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

            // tb binance
            this.tbBinancePositions = []
            var tbBinanceCount = 0
            this.tbBinancePositionsLoading = true
            this.tbBinancePositionsAvailable = false
            for(var i = 0; i < this.tbBinanceHosts.length; i++){
                getPositions(this.tbBinanceHosts[i], 'normal').then(response => {
                        tbBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'trendline_break'
                        }
                        this.tbBinancePositions = this.tbBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBinanceCount === this.tbBinanceHosts.length ){
                            // 排序
                            this.tbBinancePositionsAvailable = true
                            this.tbBinancePositionsLoading = false
                        }
                    }
                )
            }
            
            // tb okex
            this.tbOkexPositions = []
            var tbOkexCount = 0
            this.tbOkexPositionsLoading = true
            this.tbOkexPositionsAvailable = false
            for(var i = 0; i < this.tbOkexHosts.length; i++){
                getPositions(this.tbOkexHosts[i], 'normal').then(response => {
                        tbOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'trendline_break'
                        }
                        this.tbOkexPositions = this.tbOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbOkexCount === this.tbOkexHosts.length ){
                            // 排序
                            this.tbOkexPositionsAvailable = true
                            this.tbOkexPositionsLoading = false
                        }
                    }
                )
            }

            // tb bybit
            this.tbBybitPositions = []
            var tbBybitCount = 0
            this.tbBybitPositionsLoading = true
            this.tbBybitPositionsAvailable = false
            for(var i = 0; i < this.tbBybitHosts.length; i++){
                getPositions(this.tbBybitHosts[i], 'normal').then(response => {
                        tbBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'trendline_break'
                        }
                        this.tbBybitPositions = this.tbBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBybitCount === this.tbBybitHosts.length ){
                            // 排序
                            this.tbBybitPositionsAvailable = true
                            this.tbBybitPositionsLoading = false
                        }
                    }
                )
            }

            // tb bitget
            this.tbBitgetPositions = []
            var tbBitgetCount = 0
            this.tbBitgetPositionsLoading = true
            this.tbBitgetPositionsAvailable = false
            for(var i = 0; i < this.tbBitgetHosts.length; i++){
                getPositions(this.tbBitgetHosts[i], 'normal').then(response => {
                        tbBitgetCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'trendline_break'
                        }
                        this.tbBitgetPositions = this.tbBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBitgetCount === this.tbBitgetHosts.length ){
                            // 排序
                            this.tbBitgetPositionsAvailable = true
                            this.tbBitgetPositionsLoading = false
                        }
                    }
                )
            }

            // pb okex
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

            // pb bybit
            this.pbBybitPositions = []
            var pbBybitCount = 0
            this.pbBybitPositionsLoading = true
            this.pbBybitPositionsAvailable = false
            for(var i = 0; i < this.pbBybitHosts.length; i++){
                getPositions(this.pbBybitHosts[i], 'normal').then(response => {
                        pbBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'plunge_back'
                        }
                        this.pbBybitPositions = this.pbBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (pbBybitCount === this.pbBybitHosts.length ){
                            // 排序
                            this.pbBybitPositionsAvailable = true
                            this.pbBybitPositionsLoading = false
                        }
                    }
                )
            }

            // pb Binance
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

            // rsi okex
            this.rsiOkexPositions = []
            var rsiOkexCount = 0
            this.rsiOkexPositionsLoading = true
            this.rsiOkexPositionsAvailable = false
            for(var i = 0; i < this.rsiOkexHosts.length; i++){
                getPositions(this.rsiOkexHosts[i], 'normal').then(response => {
                        rsiOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'rsi_mini'
                        }
                        this.rsiOkexPositions = this.rsiOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (rsiOkexCount === this.rsiOkexHosts.length ){
                            // 排序
                            this.rsiOkexPositionsAvailable = true
                            this.rsiOkexPositionsLoading = false
                        }
                    }
                )
            }

            // rsi bybit
            this.rsiBybitPositions = []
            var rsiBybitCount = 0
            this.rsiBybitPositionsLoading = true
            this.rsiBybitPositionsAvailable = false
            for(var i = 0; i < this.rsiBybitHosts.length; i++){
                getPositions(this.rsiBybitHosts[i], 'normal').then(response => {
                        rsiBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'rsi_mini'
                        }
                        this.rsiBybitPositions = this.rsiBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (rsiBybitCount === this.rsiBybitHosts.length ){
                            // 排序
                            this.rsiBybitPositionsAvailable = true
                            this.rsiBybitPositionsLoading = false
                        }
                    }
                )
            }

            // rsi binance
            this.rsiBinancePositions = []
            var rsiBinanceCount = 0
            this.rsiBinancePositionsLoading = true
            this.rsiBinancePositionsAvailable = false
            for(var i = 0; i < this.rsiBinanceHosts.length; i++){
                getPositions(this.rsiBinanceHosts[i], 'normal').then(response => {
                        rsiBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'rsi_mini'
                        }
                        this.rsiBinancePositions = this.rsiBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (rsiBinanceCount === this.rsiBinanceHosts.length ){
                            // 排序
                            this.rsiBinancePositionsAvailable = true
                            this.rsiBinancePositionsLoading = false
                        }
                    }
                )
            }  

            // in okex
            this.inOkexPositions = []
            var inOkexCount = 0
            this.inOkexPositionsLoading = true
            this.inOkexPositionsAvailable = false
            for(var i = 0; i < this.inOkexHosts.length; i++){
                getPositions(this.inOkexHosts[i], 'normal').then(response => {
                        inOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'id_nr'
                        }
                        this.inOkexPositions = this.inOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (inOkexCount === this.inOkexHosts.length ){
                            // 排序
                            this.inOkexPositionsAvailable = true
                            this.inOkexPositionsLoading = false
                        }
                    }
                )
            }

            // in bybit
            this.inBybitPositions = []
            var inBybitCount = 0
            this.inBybitPositionsLoading = true
            this.inBybitPositionsAvailable = false
            for(var i = 0; i < this.inBybitHosts.length; i++){
                getPositions(this.inBybitHosts[i], 'normal').then(response => {
                        inBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'id_nr'
                        }
                        this.inBybitPositions = this.inBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (inBybitCount === this.inBybitHosts.length ){
                            // 排序
                            this.inBybitPositionsAvailable = true
                            this.inBybitPositionsLoading = false
                        }
                    }
                )
            }

            // in binance
            this.inBinancePositions = []
            var inBinanceCount = 0
            this.inBinancePositionsLoading = true
            this.inBinancePositionsAvailable = false
            for(var i = 0; i < this.inBinanceHosts.length; i++){
                getPositions(this.inBinanceHosts[i], 'normal').then(response => {
                        inBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'id_nr'
                        }
                        this.inBinancePositions = this.inBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (inBinanceCount === this.inBinanceHosts.length ){
                            // 排序
                            this.inBinancePositionsAvailable = true
                            this.inBinancePositionsLoading = false
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
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal_mini'
                        }
                        this.prmOkexPositions = this.prmOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prmOkexCount === this.prmOkexHosts.length ){
                            // 排序
                            this.prmOkexPositionsAvailable = true
                            this.prmOkexPositionsLoading = false
                        }
                    }
                )
            }

            // prm bybit
            this.prmBybitPositions = []
            var prmBybitCount = 0
            this.prmBybitPositionsLoading = true
            this.prmBybitPositionsAvailable = false
            for(var i = 0; i < this.prmBybitHosts.length; i++){
                getPositions(this.prmBybitHosts[i], 'normal').then(response => {
                        prmBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal_mini'
                        }
                        this.prmBybitPositions = this.prmBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prmBybitCount === this.prmBybitHosts.length ){
                            // 排序
                            this.prmBybitPositionsAvailable = true
                            this.prmBybitPositionsLoading = false
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
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal_mini'
                        }
                        this.prmBinancePositions = this.prmBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prmBinanceCount === this.prmBinanceHosts.length ){
                            // 排序
                            this.prmBinancePositionsAvailable = true
                            this.prmBinancePositionsLoading = false
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
                // 多空占比数据(后台每个小时的20分钟时爬取多空数据)
                if(minute >= 25 && now - this.longShortRatioRefresh > 3600*1000){
                    console.log(now + '刷新:fetchLongShortRatios');
                    this.fetchLongShortRatios()
                } 
                // 资金费率数据(后台每8个小时爬取资金费率数据)
                if(now - this.swapFundingRateRefresh > 8*3600*1000){
                    console.log(now + '刷新:fetchSwapFundingRates');
                    this.fetchSwapFundingRates()
                }   
                // 回测数据
                if(now - this.parentPfoBacktestRefresh > 60*1000){
                    console.log(now + '刷新:fetchParentPfoBacktest');
                    this.fetchParentPfoBacktest()
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
                    console.log(now + '刷新:fetchLiveValuelines');
                    this.fetchLiveValuelines()                   
                }
                if(hour >= 1 && date != this.btBalanceValuesRefresh.getDate()){
                    console.log(now + '刷新:fetchBacktestValueline');
                    this.fetchBacktestValueline()                   
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