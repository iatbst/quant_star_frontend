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

                        <el-table-column label="TB-1" min-width="10%" align="center">
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

                        <el-table-column label="TB-2" min-width="10%" align="center">
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

                        <el-table-column label="TB-3" min-width="10%" align="center">
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

                        <el-table-column label="TB-4" min-width="10%" align="center">
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
        
                        <el-table-column label="TB-5" min-width="10%" align="center">
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

                        <el-table-column label="TB-6" min-width="10%" align="center">
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
                    <!-- 趋势分多空过滤 -->
                    <el-col :span="12" align="center">
                        <el-table
                        :data="bbSideTradeStats"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        v-loading="!reportAvailable"
                        style="width: 100%;">
                            <el-table-column label="趋势分多空过滤" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.rowName }}
                                </template>
                            </el-table-column>

                            <el-table-column label="多/牛" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.longBull.count }} x 
                                    <span v-if="scope.row.longBull.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.longBull.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.longBull.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>
 
                            <el-table-column label="多/熊" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.longBear.count }} x 
                                    <span v-if="scope.row.longBear.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.longBear.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.longBear.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>  

                            <el-table-column label="空/牛" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.shortBull.count }} x 
                                    <span v-if="scope.row.shortBull.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.shortBull.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.shortBull.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>  

                            <el-table-column label="空/熊" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.shortBear.count }} x 
                                    <span v-if="scope.row.shortBear.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.shortBear.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.shortBear.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column> 
                        </el-table>
                    </el-col>

                    <!-- 波动率过滤 -->
                    <el-col :span="11" align="center" :offset="1">
                        <el-table
                        :data="atrRatioTradeStats"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        v-loading="!reportAvailable"
                        style="width: 100%;">
                            <el-table-column label="波动率过滤" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.rowName }}
                                </template>
                            </el-table-column>

                            <el-table-column label="波动率: 0.6 ~ 1" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.inRange.count }} x 
                                    <span v-if="scope.row.inRange.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.inRange.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.inRange.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>
 
                            <el-table-column label="波动率: 0.6 ~ 1 之外" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.outRange.count }} x 
                                    <span v-if="scope.row.outRange.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.outRange.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.outRange.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col> 
                </el-row>

                <el-row :gutter="0" type="flex" >
                    <!-- 趋势分长短过滤 -->
                    <el-col :span="12" align="center">
                        <el-table
                        :data="bbPeriodTradeStats"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        v-loading="!reportAvailable"
                        style="width: 100%;">
                            <el-table-column label="趋势分长短过滤" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.rowName }}
                                </template>
                            </el-table-column>

                            <el-table-column label="长/牛" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.longPeriodBull.count }} x 
                                    <span v-if="scope.row.longPeriodBull.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.longPeriodBull.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.longPeriodBull.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>
 
                            <el-table-column label="长/熊" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.longPeriodBear.count }} x 
                                    <span v-if="scope.row.longPeriodBear.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.longPeriodBear.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.longPeriodBear.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>  

                            <el-table-column label="短/牛" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.shortPeriodBull.count }} x 
                                    <span v-if="scope.row.shortPeriodBull.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.shortPeriodBull.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.shortPeriodBull.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>  

                            <el-table-column label="短/熊" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.shortPeriodBear.count }} x 
                                    <span v-if="scope.row.shortPeriodBear.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.shortPeriodBear.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.shortPeriodBear.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column> 
                        </el-table>
                    </el-col>

                    <!-- 趋势惯性过滤 -->
                    <el-col :span="11" align="center" :offset="1">
                        <el-table
                        :data="trendMomTradeStats"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        v-loading="!reportAvailable"
                        style="width: 100%;">
                            <el-table-column label="趋势惯性过滤" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.rowName }}
                                </template>
                            </el-table-column>

                            <el-table-column label="趋势惯性: 0 ~ 0.4" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.outRange.count }} x 
                                    <span v-if="scope.row.outRange.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.outRange.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.outRange.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                </template>
                            </el-table-column>
 
                            <el-table-column label="波动率: 0.4 ~ 1" min-width="10%" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.inRange.count }} x 
                                    <span v-if="scope.row.inRange.avg_pnl_ptg < 0" style="color: red">
                                        {{ (scope.row.inRange.avg_pnl_ptg *100).toFixed(1) }}%
                                    </span>
                                    <span v-else>
                                        {{ (scope.row.inRange.avg_pnl_ptg *100).toFixed(1) }}%
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
                    sty6: null
                },
                {
                    rowName: '2021年至今',
                    sty1: null,
                    sty2: null,
                    sty3: null,
                    sty4: null,
                    sty5: null,
                    sty6: null
                },
            ],

            updateTs: null,

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
                    longBull: null,
                    longBear: null,
                    shortBull: null,
                    shortBear: null,
                },
                {
                    rowName: '2021年至今',
                    longBull: null,
                    longBear: null,
                    shortBull: null,
                    shortBear: null,
                },   
            ],

            // 趋势分长短过滤
            bbPeriodTradeStats: [
                {
                    rowName: '滚动90日',
                    longPeriodBull: null,
                    longPeriodBear: null,
                    shortPeriodBull: null,
                    shortPeriodBear: null,
                },
                {
                    rowName: '2021年至今',
                    longPeriodBull: null,
                    longPeriodBear: null,
                    shortPeriodBull: null,
                    shortPeriodBear: null,
                },   
            ],

            // 波动率过滤
            atrRatioTradeStats: [
                {
                    rowName: '滚动90日',
                    inRange: null,
                    outRange: null,
                },
                {
                    rowName: '2021年至今',
                    inRange: null,
                    outRange: null,
                },   
            ],

            // 趋势惯性过滤
            trendMomTradeStats: [
                {
                    rowName: '滚动90日',
                    inRange: null,
                    outRange: null,
                },
                {
                    rowName: '2021年至今',
                    inRange: null,
                    outRange: null,
                },   
            ]
        }
    },

    created() {
        // 分析Data
        this.fetchReport()
    },

    methods: {
        fetchReport(){
            var reportName = 'tb_performance'
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
                this.strategyStatsData[0].sty1 = response.results[0].data.strategy_tradestats_90d["1"]
                this.strategyStatsData[0].sty2 = response.results[0].data.strategy_tradestats_90d["2"]
                this.strategyStatsData[0].sty3 = response.results[0].data.strategy_tradestats_90d["3"]
                this.strategyStatsData[0].sty4 = response.results[0].data.strategy_tradestats_90d["4"]
                this.strategyStatsData[0].sty5 = response.results[0].data.strategy_tradestats_90d["5"]
                this.strategyStatsData[0].sty6 = response.results[0].data.strategy_tradestats_90d["6"]
                this.strategyStatsData[1].sty1 = response.results[0].data.strategy_tradestats["1"]
                this.strategyStatsData[1].sty2 = response.results[0].data.strategy_tradestats["2"]
                this.strategyStatsData[1].sty3 = response.results[0].data.strategy_tradestats["3"]
                this.strategyStatsData[1].sty4 = response.results[0].data.strategy_tradestats["4"]
                this.strategyStatsData[1].sty5 = response.results[0].data.strategy_tradestats["5"]
                this.strategyStatsData[1].sty6 = response.results[0].data.strategy_tradestats["6"]
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
                
                // 趋势分多空过滤
                this.bbSideTradeStats[0].longBull = response.results[0].data.bb_long_bull_90d.all
                this.bbSideTradeStats[0].longBear = response.results[0].data.bb_long_bear_90d.all
                this.bbSideTradeStats[0].shortBull = response.results[0].data.bb_short_bull_90d.all
                this.bbSideTradeStats[0].shortBear = response.results[0].data.bb_short_bear_90d.all
                this.bbSideTradeStats[1].longBull = response.results[0].data.bb_long_bull.all
                this.bbSideTradeStats[1].longBear = response.results[0].data.bb_long_bear.all
                this.bbSideTradeStats[1].shortBull = response.results[0].data.bb_short_bull.all
                this.bbSideTradeStats[1].shortBear = response.results[0].data.bb_short_bear.all
                this.reportAvailable = true

                // 趋势分长短过滤
                this.bbPeriodTradeStats[0].longPeriodBull = response.results[0].data.bb_long_period_bull_90d.all
                this.bbPeriodTradeStats[0].longPeriodBear = response.results[0].data.bb_long_period_bear_90d.all
                this.bbPeriodTradeStats[0].shortPeriodBull = response.results[0].data.bb_short_period_bull_90d.all
                this.bbPeriodTradeStats[0].shortPeriodBear = response.results[0].data.bb_short_period_bear_90d.all
                this.bbPeriodTradeStats[1].longPeriodBull = response.results[0].data.bb_long_period_bull.all
                this.bbPeriodTradeStats[1].longPeriodBear = response.results[0].data.bb_long_period_bear.all
                this.bbPeriodTradeStats[1].shortPeriodBull = response.results[0].data.bb_short_period_bull.all
                this.bbPeriodTradeStats[1].shortPeriodBear = response.results[0].data.bb_short_period_bear.all

                // 波动率过滤
                this.atrRatioTradeStats[0].inRange = response.results[0].data.btc_atr_ratio_in_90d.all
                this.atrRatioTradeStats[0].outRange = response.results[0].data.btc_atr_ratio_out_90d.all
                this.atrRatioTradeStats[1].inRange = response.results[0].data.btc_atr_ratio_in.all
                this.atrRatioTradeStats[1].outRange = response.results[0].data.btc_atr_ratio_out.all

                // 趋势惯性过滤
                this.trendMomTradeStats[0].inRange = response.results[0].data.trend_momentum_in_90d.all
                this.trendMomTradeStats[0].outRange = response.results[0].data.trend_momentum_out_90d.all
                this.trendMomTradeStats[1].inRange = response.results[0].data.trend_momentum_in.all
                this.trendMomTradeStats[1].outRange = response.results[0].data.trend_momentum_out.all

                this.reportAvailable = true
            })
        },

        toThousands: toThousands,
    },
}


</script>