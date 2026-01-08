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

                        <el-table-column label="RS-6h-1" min-width="10%" align="center">
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

                        <el-table-column label="RS-6h-2" min-width="10%" align="center">
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

                        <el-table-column label="RS-6h-3" min-width="10%" align="center">
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

                       <el-table-column label="RS-6h-4" min-width="10%" align="center">
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

                        <el-table-column label="RS-12h-1" min-width="10%" align="center">
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

                        <el-table-column label="RS-12h-2" min-width="10%" align="center">
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

                        <el-table-column label="RS-12h-3" min-width="10%" align="center">
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

                       <el-table-column label="RS-12h-4" min-width="10%" align="center">
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

                        <el-table-column label="RS-24h-1" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty9.count }} x 
                                <span v-if="scope.row.sty9.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty9.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty9.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="RS-24h-2" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty10.count }} x 
                                <span v-if="scope.row.sty10.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty10.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty10.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="RS-24h-3" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty11.count }} x 
                                <span v-if="scope.row.sty11.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty11.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty11.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                       <el-table-column label="RS-24h-4" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty12.count }} x 
                                <span v-if="scope.row.sty12.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty12.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty12.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="RS-48h-1" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty13.count }} x 
                                <span v-if="scope.row.sty13.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty13.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty13.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="RS-48h-2" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty14.count }} x 
                                <span v-if="scope.row.sty14.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty14.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty14.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="RS-48h-3" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty15.count }} x 
                                <span v-if="scope.row.sty15.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty15.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty15.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                            </template>
                        </el-table-column>

                       <el-table-column label="RS-48h-4" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sty16.count }} x 
                                <span v-if="scope.row.sty16.avg_pnl_ptg < 0" style="color: red">
                                    {{ (scope.row.sty16.avg_pnl_ptg *100).toFixed(1) }}%
                                </span>
                                <span v-else>
                                    {{ (scope.row.sty16.avg_pnl_ptg *100).toFixed(1) }}%
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
                                <span v-if="scope.row.sortinoRatio < 0" style="color: red">
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
                    <!-- 当前open_trades数量 -->
                    <el-col :span="8" align="center">
                        <el-table
                        :data="openTradeCountTradeStats"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        v-loading="!reportAvailable"
                        style="width: 100%;">
                            <el-table-column label="当前仓位计数" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.rowName }}
                                </template>
                            </el-table-column>

                            <el-table-column label="计数 = 0" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.low.count }} x 
                                    <span v-if="scope.row.low.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.low.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.low.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column label="计数 = 1~4" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.mid.count }} x 
                                    <span v-if="scope.row.mid.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.mid.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.mid.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column label="计数 > 4" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.high.count }} x 
                                    <span v-if="scope.row.high.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.high.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.high.avg_pnl_ptg *100).toFixed(1) }}%
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
                    sty8: null,
                    sty9: null,
                    sty10: null,
                    sty11: null,
                    sty12: null,
                    sty13: null,
                    sty14: null,
                    sty15: null,
                    sty16: null
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
                    sty8: null,
                    sty9: null,
                    sty10: null,
                    sty11: null,
                    sty12: null,
                    sty13: null,
                    sty14: null,
                    sty15: null,
                    sty16: null
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
            
            // 趋势分多空过滤
            bbSideTradeStats: [
                {
                    rowName: '滚动90日',
                    shortBull: null,
                    shortBear: null,
                },
                {
                    rowName: '2021年至今',
                    shortBull: null,
                    shortBear: null,
                },   
            ],

            // 多空过滤
            openTradeCountTradeStats: [
                {
                    rowName: '滚动90日',
                    low: null,
                    mid: null,
                    high: null
                },
                {
                    rowName: '2021年至今',
                    low: null,
                    mid: null,
                    high: null
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
            var reportName = 'rsi_performance'
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
                
                // 子策略表现
                this.strategyStatsData[0].sty1 = response.results[0].data.strategy_tradestats_90d["1"]
                this.strategyStatsData[0].sty2 = response.results[0].data.strategy_tradestats_90d["2"]
                this.strategyStatsData[0].sty3 = response.results[0].data.strategy_tradestats_90d["3"]
                this.strategyStatsData[0].sty4 = response.results[0].data.strategy_tradestats_90d["4"]
                this.strategyStatsData[0].sty5 = response.results[0].data.strategy_tradestats_90d["5"]
                this.strategyStatsData[0].sty6 = response.results[0].data.strategy_tradestats_90d["6"]
                this.strategyStatsData[0].sty7 = response.results[0].data.strategy_tradestats_90d["7"]
                this.strategyStatsData[0].sty8 = response.results[0].data.strategy_tradestats_90d["8"]
                this.strategyStatsData[0].sty9 = response.results[0].data.strategy_tradestats_90d["9"]
                this.strategyStatsData[0].sty10 = response.results[0].data.strategy_tradestats_90d["10"]
                this.strategyStatsData[0].sty11 = response.results[0].data.strategy_tradestats_90d["11"]
                this.strategyStatsData[0].sty12 = response.results[0].data.strategy_tradestats_90d["12"]
                this.strategyStatsData[0].sty13 = response.results[0].data.strategy_tradestats_90d["13"]
                this.strategyStatsData[0].sty14 = response.results[0].data.strategy_tradestats_90d["14"]
                this.strategyStatsData[0].sty15 = response.results[0].data.strategy_tradestats_90d["15"]
                this.strategyStatsData[0].sty16 = response.results[0].data.strategy_tradestats_90d["16"]

                this.strategyStatsData[1].sty1 = response.results[0].data.strategy_tradestats["1"]
                this.strategyStatsData[1].sty2 = response.results[0].data.strategy_tradestats["2"]
                this.strategyStatsData[1].sty3 = response.results[0].data.strategy_tradestats["3"]
                this.strategyStatsData[1].sty4 = response.results[0].data.strategy_tradestats["4"]
                this.strategyStatsData[1].sty5 = response.results[0].data.strategy_tradestats["5"]
                this.strategyStatsData[1].sty6 = response.results[0].data.strategy_tradestats["6"]
                this.strategyStatsData[1].sty7 = response.results[0].data.strategy_tradestats["7"]
                this.strategyStatsData[1].sty8 = response.results[0].data.strategy_tradestats["8"]
                this.strategyStatsData[1].sty9 = response.results[0].data.strategy_tradestats["9"]
                this.strategyStatsData[1].sty10 = response.results[0].data.strategy_tradestats["10"]
                this.strategyStatsData[1].sty11 = response.results[0].data.strategy_tradestats["11"]
                this.strategyStatsData[1].sty12 = response.results[0].data.strategy_tradestats["12"]
                this.strategyStatsData[1].sty13 = response.results[0].data.strategy_tradestats["13"]
                this.strategyStatsData[1].sty14 = response.results[0].data.strategy_tradestats["14"]
                this.strategyStatsData[1].sty15 = response.results[0].data.strategy_tradestats["15"]
                this.strategyStatsData[1].sty16 = response.results[0].data.strategy_tradestats["16"]

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

                // 多空
                this.openTradeCountTradeStats[0].low = response.results[0].data.open_trades_count_low_90d.all
                this.openTradeCountTradeStats[0].mid = response.results[0].data.open_trades_count_mid_90d.all
                this.openTradeCountTradeStats[0].high = response.results[0].data.open_trades_count_high_90d.all
                this.openTradeCountTradeStats[1].low = response.results[0].data.open_trades_count_low.all
                this.openTradeCountTradeStats[1].mid = response.results[0].data.open_trades_count_mid.all
                this.openTradeCountTradeStats[1].high = response.results[0].data.open_trades_count_high.all

                this.reportAvailable = true
            })
        },

        toThousands: toThousands,
    },
}


</script>