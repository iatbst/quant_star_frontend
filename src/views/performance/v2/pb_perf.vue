<template>
    <div class="app-container" style="background-color: lightgray">
        <!-- 月度收益率表头 -->
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 0px; width: 100%">
                <!-- 2021 ~ Now -->
                <el-col :span="4" align="center" v-for="headerData in monthPnlHeaders">
                    <el-table
                    :data="headerData"
                    :show-header="false"
                    :cell-style="{ background: '#f2f2f2' }"
                    v-loading="!reportAvailable"
                    style="width: 100%">
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <b>{{ scope.row.rowName }}</b>
                            </template>
                        </el-table-column>
        
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.value < 0" style="color: red">
                                    <b>{{ (scope.row.value*100).toFixed(1) }}%</b>
                                </span>
                                <span v-else>
                                    <b>{{ (scope.row.value*100).toFixed(1) }}%</b>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </el-row>

        <!-- 月度收益率 -->
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 0px; margin-bottom: 20px; width: 100%">
                <!-- 2021 ~ Now -->
                <el-col :span="4" align="center" v-for="monthPnl in monthPnls">
                    <el-table
                    :data="monthPnl"
                    :show-header="false"
                    v-loading="!reportAvailable"
                    style="width: 100%">
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.rowName }}
                            </template>
                        </el-table-column>
        
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.pnl < 0" style="color: red">
                                    {{ (scope.row.pnl*100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.pnl*100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </el-row>
        <div align="left">
            <span style="font-size: 12px;">
                数据更新时间: {{ updateTs | epochToTimestamp }}
            </span>
        </div>
        
        <!-- 子策略表现 -->
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 20px; width: 100%">
                <el-col :span="24" align="center">
                    <el-table
                    :data="strategyStatsData"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!reportAvailable"
                    style="width: 100%;">
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.rowName }}
                            </template>
                        </el-table-column>

                        <el-table-column label="PB-1-1" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty1.count }} x 
                                <span v-if="scope.row.sty1.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty1.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty1.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="PB-1-2" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty2.count }} x 
                                <span v-if="scope.row.sty2.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty2.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty2.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="PB-1-3" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty3.count }} x 
                                <span v-if="scope.row.sty3.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty3.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty3.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="PB-1-4" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty4.count }} x 
                                <span v-if="scope.row.sty4.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty4.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty4.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="PB-2-1" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty5.count }} x 
                                <span v-if="scope.row.sty5.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty5.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty5.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="PB-2-2" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty6.count }} x 
                                <span v-if="scope.row.sty6.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty6.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty6.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="PB-2-3" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty7.count }} x 
                                <span v-if="scope.row.sty7.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty7.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty7.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="PB-2-4" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty8.count }} x 
                                <span v-if="scope.row.sty8.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty8.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty8.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </el-row>

        <!-- 策略总体表现 + 回撤 -->
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 20px; width: 100%">
                <!-- 策略总体表现 -->
                <el-col :span="12" align="center">
                    <el-table
                    :data="tradeStatsData"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!reportAvailable"
                    style="width: 100%;">
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.rowName }}
                            </template>
                        </el-table-column>

                        <el-table-column label="平均损益" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.avgPnl < 0" style="color: red">
                                    {{ (scope.row.avgPnl*100).toFixed(2) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.avgPnl*100).toFixed(2) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="胜率" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ (scope.row.winRatio*100).toFixed(1) }}%
                            </template>
                        </el-table-column>

                        <el-table-column label="盈亏比" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.winLoseRatio.toFixed(3) }}
                            </template>
                        </el-table-column>

                        <el-table-column label="夏普比率" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sharpeRatio < 0" style="color: red">
                                    {{ scope.row.sharpeRatio.toFixed(3) }}
                                </span>
                                <span v-else>
                                    {{ scope.row.sharpeRatio.toFixed(3) }}
                                </span>
                            </template>
                        </el-table-column>
        
                        <el-table-column label="索提诺比率" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sortinoRatio == null" style="color: lightgray">
                                    N/A
                                </span>
                                <span v-else-if="scope.row.sortinoRatio < 0" style="color: red">
                                    {{ scope.row.sortinoRatio.toFixed(3) }}
                                </span>
                                <span v-else>
                                    {{ scope.row.sortinoRatio.toFixed(3) }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>

                <!-- 回撤 -->
                <el-col :span="11" align="center" :offset="1">
                    <el-table
                    :data="drawBackData"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!reportAvailable"
                    style="width: 100%">
                        <el-table-column label="实时回撤" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ (scope.row.dd*100).toFixed(1) }}%
                            </template>
                        </el-table-column>

                        <el-table-column label="历史最大回撤" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ (scope.row.mdd*100).toFixed(1) }}%
                            </template>
                        </el-table-column>
        
                        <el-table-column label="实时回撤日数" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.ddDays }}
                            </template>
                        </el-table-column>

                        <el-table-column label="历史最大回撤日数" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.mddDays }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </el-row>

        <!-- 特定trades表现 -->
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 20px; width: 100%">
                <el-row :gutter="0" type="flex" >
                    <!-- 小批过滤 -->
                    <el-col :span="8" align="center">
                        <el-table
                        :data="openTradesCountTradeStats"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        v-loading="!reportAvailable"
                        style="width: 100%;">
                            <el-table-column label="小批过滤" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.rowName }}
                                </template>
                            </el-table-column>

                            <el-table-column label="符合过滤条件订单" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.notFiltered.count }} x 
                                    <span v-if="scope.row.notFiltered.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.notFiltered.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.notFiltered.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>
 
                            <el-table-column label="不符合过滤条件订单" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.filtered.count }} x 
                                    <span v-if="scope.row.filtered.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.filtered.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.filtered.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>   
                        </el-table>
                    </el-col>

                    <!-- BTC-EMA50过滤 -->
                    <el-col :span="8" align="center" :offset="1">
                        <el-table
                        :data="btcEmaTradeStats"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        v-loading="!reportAvailable"
                        style="width: 100%;">
                            <el-table-column label="BTC-EMA50日过滤" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.rowName }}
                                </template>
                            </el-table-column>

                            <el-table-column label="1-2层订单BTC-EMA50日上" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.up.count }} x 
                                    <span v-if="scope.row.up.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.up.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.up.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>
 
                            <el-table-column label="1-2层订单BTC-EMA50日下" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.down.count }} x 
                                    <span v-if="scope.row.down.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.down.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.down.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>  
                        </el-table>
                    </el-col> 

                    <!-- 止盈 -->
                    <el-col :span="8" align="center" :offset="1">
                        <el-table
                        :data="winStopTradeStats"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        v-loading="!reportAvailable"
                        style="width: 100%;">
                            <el-table-column label="止盈" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.rowName }}
                                </template>
                            </el-table-column>

                            <el-table-column label="有止盈" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.ws.count }} x 
                                    <span v-if="scope.row.ws.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.ws.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.ws.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>
 
                            <el-table-column label="无止盈" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.noWs.count }} x 
                                    <span v-if="scope.row.noWs.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.noWs.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.noWs.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>  
                        </el-table>
                    </el-col> 
                </el-row>
            </div>
        </el-row>
    </div>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands} from '@/utils/general'
import { getBacktestReportById, getBacktestReportByName } from '@/api/backtest_report'
import moment from 'moment'
import { offset } from 'highcharts'

export default {
    filters: {
        epochToTimestamp(ts) {
        if (ts) {
            const stillUtc = moment.utc(ts*1000).toDate()
            return moment(stillUtc)
            .local()
            .format('YYYY-MM-DD HH:mm:ss')
        } else {
            return '--'
        }
        return ts.replace('T', ' ').slice(0, 19)
        },
    },
    data() {
        return {
            reportAvailable: false,

            // 月度收益
            monthPnlHeaders: [],
            monthPnls: [],
            
            // 子策略表现
            strategyStatsData: [
                {
                    rowName: '滚动90日',
                    sty1: null,
                    sty2: null,
                    sty3: null,
                    sty4: null,
                    sty5: null,
                    sty6: null,
                    sty7: null,
                    sty8: null
                },
                {
                    rowName: '2021年至今',
                    sty1: null,
                    sty2: null,
                    sty3: null,
                    sty4: null,
                    sty5: null,
                    sty6: null,
                    sty7: null,
                    sty8: null
                },
            ],

            // 策略总体表现
            tradeStatsData: [
                {
                    rowName: '滚动90日',
                    avgPnl: null,
                    winRatio: null,
                    winLoseRatio: null,
                    sharpeRatio: null,
                    sortinoRatio: null,
                },
                {
                    rowName: '2021年至今',
                    avgPnl: null,
                    winRatio: null,
                    winLoseRatio: null,
                    sharpeRatio: null,
                    sortinoRatio: null,
                }
            ],     

            // 回撤数据
            drawBackData: [
                {
                    dd: null,
                    mdd: null,
                    ddDays: null,
                    mddDays: null,
                }
            ], 
            updateTs: null,
            
            // 小批过滤
            openTradesCountTradeStats: [
                {
                    rowName: '滚动90日',
                    filtered: null,
                    notFiltered: null,
                },
                {
                    rowName: '2021年至今',
                    filtered: null,
                    notFiltered: null,
                },   
            ],

            // EMA均线过滤
            btcEmaTradeStats: [
                {
                    rowName: '滚动90日',
                    up: null,
                    down: null,
                },
                {
                    rowName: '2021年至今',
                    up: null,
                    down: null,
                },   
            ],

            // 止盈
            winStopTradeStats: [
                {
                    rowName: '滚动90日',
                    ws: null,
                    noWs: null,
                },
                {
                    rowName: '2021年至今',
                    ws: null,
                    noWs: null,
                },   
            ],
        }
    },

    created() {
        // 分析Data
        this.fetchReport()
    },

    methods: {
        fetchReport(){
            var reportName = 'pb_performance'
            this.reportAvailable = false
            getBacktestReportByName(config.masterHost, reportName).then(response => {
                // 月度收益
                var data = response.results[0].data.month_pnl
     
                for(let yearData of data){
                    var header = [
                        {
                            rowName: yearData.year,
                            value: yearData.pnl,
                        },
                        {
                            rowName: '平均',
                            value: yearData.avg_month_pnl,
                        },                          
                    ]
                    this.monthPnlHeaders.push(header)
                    
                    var monthPnl = []
                    for(let monthData of yearData.data){
                        monthPnl.push({
                            rowName: monthData.month + '月',
                            pnl: monthData.pnl
                        })
                    }
                    this.monthPnls.push(monthPnl)

                }
                this.updateTs = response.results[0].run_ts
                
                // 子策略表现
                this.strategyStatsData[0].sty1 = response.results[0].data.strategy_tradestats_90d["2"]
                this.strategyStatsData[0].sty2 = response.results[0].data.strategy_tradestats_90d["3"]
                this.strategyStatsData[0].sty3 = response.results[0].data.strategy_tradestats_90d["4"]
                this.strategyStatsData[0].sty4 = response.results[0].data.strategy_tradestats_90d["5"]
                this.strategyStatsData[0].sty5 = response.results[0].data.strategy_tradestats_90d["7"]
                this.strategyStatsData[0].sty6 = response.results[0].data.strategy_tradestats_90d["8"]
                this.strategyStatsData[0].sty7 = response.results[0].data.strategy_tradestats_90d["9"]
                this.strategyStatsData[0].sty8 = response.results[0].data.strategy_tradestats_90d["10"]
                this.strategyStatsData[1].sty1 = response.results[0].data.strategy_tradestats["2"]
                this.strategyStatsData[1].sty2 = response.results[0].data.strategy_tradestats["3"]
                this.strategyStatsData[1].sty3 = response.results[0].data.strategy_tradestats["4"]
                this.strategyStatsData[1].sty4 = response.results[0].data.strategy_tradestats["5"]
                this.strategyStatsData[1].sty5 = response.results[0].data.strategy_tradestats["7"]
                this.strategyStatsData[1].sty6 = response.results[0].data.strategy_tradestats["8"]
                this.strategyStatsData[1].sty7 = response.results[0].data.strategy_tradestats["9"]
                this.strategyStatsData[1].sty8 = response.results[0].data.strategy_tradestats["10"]

                // 策略总体表现
                this.tradeStatsData[0].avgPnl = response.results[0].data.tradestats_90d.all.avg_pnl_ptg
                this.tradeStatsData[0].winRatio = response.results[0].data.tradestats_90d.all.win_ratio
                this.tradeStatsData[0].winLoseRatio = response.results[0].data.tradestats_90d.all.win_lose_pnl_ratio
                this.tradeStatsData[0].sharpeRatio = response.results[0].data.sharp_ratio_90
                this.tradeStatsData[0].sortinoRatio = response.results[0].data.sortino_ratio_90
                this.tradeStatsData[1].avgPnl = response.results[0].data.tradestats.all.avg_pnl_ptg
                this.tradeStatsData[1].winRatio = response.results[0].data.tradestats.all.win_ratio
                this.tradeStatsData[1].winLoseRatio = response.results[0].data.tradestats.all.win_lose_pnl_ratio
                this.tradeStatsData[1].sharpeRatio = response.results[0].data.sharp_ratio
                this.tradeStatsData[1].sortinoRatio = response.results[0].data.sortino_ratio


                // 回撤数据
                this.drawBackData[0].dd = response.results[0].data.mdd_data.dd
                this.drawBackData[0].mdd = response.results[0].data.mdd_data.mdd
                this.drawBackData[0].ddDays = response.results[0].data.mdd_data.dd_days
                this.drawBackData[0].mddDays = response.results[0].data.mdd_data.max_dd_days
                
                // 小批过滤
                this.openTradesCountTradeStats[0].filtered = response.results[0].data.open_trades_count_filtered_90d.all
                this.openTradesCountTradeStats[0].notFiltered = response.results[0].data.open_trades_count_not_filtered_90d.all
                this.openTradesCountTradeStats[1].filtered = response.results[0].data.open_trades_count_filtered.all
                this.openTradesCountTradeStats[1].notFiltered = response.results[0].data.open_trades_count_not_filtered.all


                // EMA均线过滤
                this.btcEmaTradeStats[0].up = response.results[0].data.indicator_price_up_90d.all
                this.btcEmaTradeStats[0].down = response.results[0].data.indicator_price_down_90d.all
                this.btcEmaTradeStats[1].up = response.results[0].data.indicator_price_up.all
                this.btcEmaTradeStats[1].down = response.results[0].data.indicator_price_down.all

                // 止盈
                this.winStopTradeStats[0].ws = response.results[0].data.ws_90d.all
                this.winStopTradeStats[0].noWs = response.results[0].data.no_ws_90d.all
                this.winStopTradeStats[1].ws = response.results[0].data.ws.all
                this.winStopTradeStats[1].noWs = response.results[0].data.no_ws.all

                this.reportAvailable = true
            })
        },

        toThousands: toThousands,
    },
}


</script>