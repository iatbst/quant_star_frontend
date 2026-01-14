<template>
    <div class="app-container" style="background-color: lightgray">
        <!-- 总体指标 -->
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 20px; width: 100%">
                <!-- 总体指标1 -->
                <el-col :span="17" align="center">
                    <el-table
                    :data="statsData1"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!(reportBtcStatsAvailable && reportSymbolstatsAvailable)"
                    style="width: 100%;">
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.rowName }}
                            </template>
                        </el-table-column>

                        <el-table-column label="ATR(BTC)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.atrBtc.toFixed(3) }}
                            </template>
                        </el-table-column>
        
                        <el-table-column label="ATR(24币)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.atrSymbols.toFixed(3) }}
                            </template>
                        </el-table-column>

                        <el-table-column label="ATR标准差(BTC)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.atrStdevBtc.toFixed(3) }}
                            </template>
                        </el-table-column>
        
                        <el-table-column label="ATR标准差(24币)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.atrStdevSymbols.toFixed(3) }}
                            </template>
                        </el-table-column>

                        <el-table-column label="上涨惯性(BTC)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.upTrendBtc.toFixed(3) }}
                            </template>
                        </el-table-column>
        
                        <el-table-column label="上涨惯性(24币)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.upTrendSymbols.toFixed(3) }}
                            </template>
                        </el-table-column>

                        <el-table-column label="下跌惯性(BTC)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.downTrendBtc.toFixed(3) }}
                            </template>
                        </el-table-column>
        
                        <el-table-column label="下跌惯性(24币)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.downTrendSymbols.toFixed(3) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>

                <!-- 总体指标2 -->
                <el-col :span="6" align="center" :offset="1">
                    <el-table
                    :data="statsData2"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!(reportBtcStatsAvailable && reportSymbolstatsAvailable)"
                    style="width: 100%">
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.rowName }}
                            </template>
                        </el-table-column>

                        <el-table-column label="ATR极值比率(BTC)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.atrTopRatioBtc.toFixed(3) }}
                            </template>
                        </el-table-column>
        
                        <el-table-column label="ATR极值比率(24币)" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.atrTopRatioSymbols.toFixed(3) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </el-row>
        <div align="left">
            <span style="font-size: 12px;">
                数据更新时间: {{ statsUpdateTs | epochToTimestamp }}
            </span>
        </div>

        <!-- 总体月度收益率表头 -->
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 0px; width: 100%">
                <!-- 2021 ~ Now -->
                <el-col :span="4" align="center" v-for="headerData in monthPnlHeaders">
                    <el-table
                    :data="headerData"
                    :show-header="false"
                    :cell-style="{ background: '#f2f2f2' }"
                    v-loading="!reportAllPerfAvailable"
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

        <!-- 总体月度收益率 -->
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 0px; margin-bottom: 20px; width: 100%">
                <!-- 2021 ~ Now -->
                <el-col :span="4" align="center" v-for="monthPnl in monthPnls">
                    <el-table
                    :data="monthPnl"
                    :show-header="false"
                    v-loading="!reportAllPerfAvailable"
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

        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 20px; width: 100%">
                <!-- 夏普/索提诺比率 -->
                <el-col :span="12" align="center">
                    <el-table
                    :data="sharpeRatioData"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!reportAllPerfAvailable"
                    style="width: 100%;">
                        <el-table-column label="" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.rowName }}
                            </template>
                        </el-table-column>

                        <el-table-column label="夏普比率" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sharpeRatio.toFixed(3) }}
                            </template>
                        </el-table-column>
        
                        <el-table-column label="索提诺比率" min-width="10%" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sortinoRatio.toFixed(3) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>

                <!-- 回撤数据 -->
                <el-col :span="11" align="center" :offset="1">
                    <el-table
                    :data="drawBackData"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!reportAllPerfAvailable"
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
            reportBtcStatsAvailable: false,
            reportSymbolstatsAvailable: false,
            reportAllPerfAvailable: false,

            // 总体指标1
            statsData1: [
                {
                    rowName: '滚动90日',
                    atrBtc: null,
                    atrSymbols: null,
                    atrStdevBtc: null,
                    atrStdevSymbols: null,
                    upTrendBtc: null,
                    upTrendSymbols: null,
                    downTrendBtc: null,
                    downTrendSymbols: null,
                },
                {
                    rowName: '2021年至今',
                    atrBtc: null,
                    atrSymbols: null,
                    atrStdevBtc: null,
                    atrStdevSymbols: null,
                    upTrendBtc: null,
                    upTrendSymbols: null,
                    downTrendBtc: null,
                    downTrendSymbols: null,
                }
            ],

            // 总体指标2
            statsData2: [
                 {
                    rowName: '滚动2年',
                    atrTopRatioBtc: null,
                    atrTopRatioSymbols: null,
                },
                {
                    rowName: '2021年至今',
                    atrTopRatioBtc: null,
                    atrTopRatioSymbols: null,
                }               
            ],

            // 月度收益
            monthPnlHeaders: [],
            monthPnls: [],
            statsUpdateTs: null,
            updateTs: null,

            // sharpe/sortino Ratios
            sharpeRatioData: [
                {
                    rowName: '滚动90日',
                    sharpeRatio: null,
                    sortinoRatio: null,
                },
                {
                    rowName: '2021年至今',
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
        }
    },

    created() {
        // 分析Data
        this.fetchReportBtcStats()
        this.fetchReportSymbolsStats()
        this.fetchReportAllPerf()
    },

    methods: {
        fetchReportBtcStats(){
            var reportName = 'btc_stats'
            this.reportBtcStatsAvailable = false
            getBacktestReportByName(config.masterHost, reportName).then(response => {
                var data = response.results[0].data
                this.statsData1[0].atrBtc = data.atr_ptg_90d
                this.statsData1[0].atrStdevBtc = data.atr_ptg_std_90d
                this.statsData1[0].upTrendBtc = data.up_trend_ptg_90d
                this.statsData1[0].downTrendBtc = data.down_trend_ptg_90d
                this.statsData1[1].atrBtc = data.atr_ptg
                this.statsData1[1].atrStdevBtc = data.atr_ptg_std
                this.statsData1[1].upTrendBtc = data.up_trend_ptg
                this.statsData1[1].downTrendBtc = data.down_trend_ptg
                this.statsData2[0].atrTopRatioBtc = data.atr_top_ratio_2y
                this.statsData2[1].atrTopRatioBtc = data.atr_top_ratio
                this.reportBtcStatsAvailable = true
                this.statsUpdateTs = response.results[0].run_ts
            })
        },

        fetchReportSymbolsStats(){
            var reportName = 'symbols_stats'
            this.reportSymbolstatsAvailable = false
            getBacktestReportByName(config.masterHost, reportName).then(response => {
                var data = response.results[0].data
                this.statsData1[0].atrSymbols = data.atr_ptg_90d
                this.statsData1[0].atrStdevSymbols= data.atr_ptg_std_90d
                this.statsData1[0].upTrendSymbols = data.up_trend_ptg_90d
                this.statsData1[0].downTrendSymbols = data.down_trend_ptg_90d
                this.statsData1[1].atrSymbols = data.atr_ptg
                this.statsData1[1].atrStdevSymbols = data.atr_ptg_std
                this.statsData1[1].upTrendSymbols = data.up_trend_ptg
                this.statsData1[1].downTrendSymbols = data.down_trend_ptg
                this.statsData2[0].atrTopRatioSymbols = data.atr_top_ratio_2y
                this.statsData2[1].atrTopRatioSymbols = data.atr_top_ratio
                this.reportSymbolstatsAvailable = true
            })
        },

        fetchReportAllPerf(){
            var reportName = 'all_performance'
            this.reportAllPerfAvailable = false
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

                // 夏普比率
                this.sharpeRatioData[0].sharpeRatio = response.results[0].data.sharp_ratio_90
                this.sharpeRatioData[0].sortinoRatio = response.results[0].data.sortino_ratio_90
                this.sharpeRatioData[1].sharpeRatio = response.results[0].data.sharp_ratio
                this.sharpeRatioData[1].sortinoRatio = response.results[0].data.sortino_ratio
                

                // 回撤数据
                this.drawBackData[0].dd = response.results[0].data.mdd_data.dd
                this.drawBackData[0].mdd = response.results[0].data.mdd_data.mdd
                this.drawBackData[0].ddDays = response.results[0].data.mdd_data.dd_days
                this.drawBackData[0].mddDays = response.results[0].data.mdd_data.max_dd_days
                
                this.reportAllPerfAvailable = true
            })
        },

        toThousands: toThousands,
    },
}


</script>