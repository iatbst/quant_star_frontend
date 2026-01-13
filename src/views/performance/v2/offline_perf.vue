<template>
    <div class="app-container" style="background-color: lightgray">
        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 20px; width: 100%">
                <!-- 策略DC -->
                <el-col :span="12" align="center">
                    <h4>策略: Donchian Channel</h4>
                    <el-table
                    :data="dcPerfData"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!dcReportAvailable"
                    style="width: 95%">
                        <el-table-column label="总收益" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.pnl < 0" style="color: red">
                                    {{ (scope.row.pnl*100).toFixed(2) }}%
                                </span>
                                <span style="color: green" v-else>
                                    {{ (scope.row.pnl*100).toFixed(2) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="今年收益" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.yearPnl < 0" style="color: red">
                                    {{ (scope.row.yearPnl*100).toFixed(2) }}%
                                </span>
                                <span style="color: green" v-else>
                                    {{ (scope.row.yearPnl*100).toFixed(2) }}%
                                </span>
                            </template>
                        </el-table-column>

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

                <!-- 策略PR -->
                <el-col :span="12" align="center">
                    <h4>策略: Pivot Reversal</h4>
                    <el-table
                    :data="prPerfData"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="!prReportAvailable"
                    style="width: 95%">
                        <el-table-column label="总收益" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.pnl < 0" style="color: red">
                                    {{ (scope.row.pnl*100).toFixed(2) }}%
                                </span>
                                <span style="color: green" v-else>
                                    {{ (scope.row.pnl*100).toFixed(2) }}%
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="今年收益" min-width="10%" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.yearPnl < 0" style="color: red">
                                    {{ (scope.row.yearPnl*100).toFixed(2) }}%
                                </span>
                                <span style="color: green"v-else>
                                    {{ (scope.row.yearPnl*100).toFixed(2) }}%
                                </span>
                            </template>
                        </el-table-column>

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

        <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
            <div style="margin-left: 20px; margin-right: 20px; margin-top: 20px; margin-bottom: 20px; width: 100%">
                <!-- 策略DC -->
                <el-col :span="12" align="center">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: 'DC资产曲线',
                            data: dcValueline,
                        }
                    ]
                    "
                    v-if="dcReportAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>
                </el-col>

                <!-- 策略PR -->
                <el-col :span="12" align="center">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: 'PR资产曲线',
                            data: prValueline,
                        }
                    ]
                    "
                    v-if="prReportAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines> 
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
import exchangeValueLines from '@/views/performance/v2/exchange_valuelines'

export default {
    components: {
        exchangeValueLines
    },

    data() {
        return {
            dcReportAvailable: false,
            prReportAvailable: false,
            dcValueline: null,
            prValueline: null,

            // DC
            dcPerfData: [
                {
                    pnl: null,
                    yearPnl: null,
                    dd: null,
                    mdd: null,
                    ddDays: null,
                    mddDays: null,
                }
            ], 
            
            // PR
            prPerfData: [
                {
                    pnl: null,
                    yearPnl: null,
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
        this.fetchDcReport()
        this.fetchPrReport()
    },

    methods: {
        fetchDcReport(){
            var reportName = 'offline_dc_performance'
            this.dcReportAvailable = false
            getBacktestReportByName(config.masterHost, reportName).then(response => {
                // 收益
                this.dcPerfData[0].pnl = response.results[0].data.pnl_data.pnl
                this.dcPerfData[0].yearPnl = response.results[0].data.pnl_data.current_year_pnl

                // 回撤
                this.dcPerfData[0].dd = response.results[0].data.mdd_data.dd
                this.dcPerfData[0].mdd = response.results[0].data.mdd_data.mdd
                this.dcPerfData[0].ddDays = response.results[0].data.mdd_data.dd_days
                this.dcPerfData[0].mddDays = response.results[0].data.mdd_data.max_dd_days
                
                // 资产曲线
                this.dcValueline = response.results[0].data.valueline

                this.dcReportAvailable = true
            })
        },

        fetchPrReport(){
            var reportName = 'offline_pr_performance'
            this.prReportAvailable = false
            getBacktestReportByName(config.masterHost, reportName).then(response => {
                // 收益
                this.prPerfData[0].pnl = response.results[0].data.pnl_data.pnl
                this.prPerfData[0].yearPnl = response.results[0].data.pnl_data.current_year_pnl

                // 回撤
                this.prPerfData[0].dd = response.results[0].data.mdd_data.dd
                this.prPerfData[0].mdd = response.results[0].data.mdd_data.mdd
                this.prPerfData[0].ddDays = response.results[0].data.mdd_data.dd_days
                this.prPerfData[0].mddDays = response.results[0].data.mdd_data.max_dd_days

                // 资产曲线
                this.prValueline = response.results[0].data.valueline

                this.prReportAvailable = true
            })
        },

        toThousands: toThousands,
    },
}


</script>