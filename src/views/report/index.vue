<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div class="app-container" align="center" >
        <div style="width: 90%; margin-top: 0px">
            <el-row :gutter="0" type="flex" style="margin-bottom: 10px">
                <!----------------------------------- 查询Bar --------------------------------------->
                <el-col :span="3" align="left">
                    <el-row style="margin-left: 20px">
                    <el-select v-model="reportFilter.level" placeholder="类型">
                        <el-option
                        v-for="level in Object.keys(reportLevels)"
                        :key="level"
                        :label="reportLevels[level]"
                        :value="level">
                        </el-option>
                    </el-select>  
                    </el-row>   
                </el-col>

                <el-col :span="3" align="left">
                    <el-row style="margin-left: 20px">
                        <el-input
                            v-model="reportFilter.dt_label"
                            placeholder="起始日期:年-月-日"
                        ></el-input> 
                    </el-row>      
                </el-col>

                <el-col :span="6" align="left">
                    <el-row style="margin-left: 20px">
                        <el-col :span="12" :offset="0">
                            <el-button style="width: 100%" type="primary" @click="search()">
                                查询
                            </el-button>                             
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <el-row v-if="reportAvailable">
                <!--- 说明 --->
                <h1>
                    {{ chineseString(reportFilter.level) }}
                </h1>
                <h5 style="font-weight: 500">
                    {{ reportFilter.dt_label }}
                </h5>
            </el-row>

            <!--- 资产变化 --->
            <el-row :gutter="0" type="flex" style="background: #f2f2f2" v-if="reportAvailable">
                <el-col :span="3">
                    <h3>
                        初
                    </h3>
                </el-col>
                <el-col :span="6">
                    <h3>
                        {{ toThousands(beginValue) }}
                    </h3>
                </el-col>
                <el-col :span="6">
                    <h3 style="color: green" v-if="valueChange >= 0">
                        <i class="el-icon-top"></i>{{ (valueChange*100).toFixed(2)}}%
                    </h3>
                    <h3 style="color: red" v-else>
                        <i class="el-icon-bottom"></i>{{ (valueChange*100).toFixed(2)}}%
                    </h3>
                </el-col>
                <el-col :span="6">
                    <h3>
                        {{ toThousands(endValue) }}
                    </h3>
                </el-col>
                <el-col :span="3">
                    <h3>
                        末
                    </h3>
                </el-col>                  
            </el-row>

            <!--- 资产曲线 --->
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-bottom: 20px" v-if="reportAvailable">
                <el-col :span="24" align="center">
                    <div style="margin-bottom: 20px;">
                        <value-line 
                        v-bind:values="report.value_line" 
                        v-bind:title="'日资产曲线'"
                        v-bind:range="'all'"
                        v-bind:showRange="false">
                        </value-line>
                    </div>
                </el-col>
            </el-row>

            <!--- 策略收益表格 --->
            <el-row :gutter="0" type="flex" style="margin-bottom: 50px" v-if="reportAvailable">
                <el-table
                :data="report.strategy_pnls.rows"
                :header-cell-style="{ background: '#f2f2f2' }"
                >
                    <template v-for="col in [''].concat(report.strategy_pnls.col_header)">
                        <el-table-column align="center" :label="getStrategyCol(col)">
                            <template slot-scope="scope">
                                <div v-if="col == ''">
                                    {{ chineseString(scope.row.row_head) }}
                                </div>
                                <div v-else>
                                    {{ formatStrategyPnls(scope.row.row_head, scope.row[col]) }}
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </el-row>

            <!--- 策略统计表格 --->
            <el-row :gutter="0" type="flex" style="margin-bottom: 50px" v-if="reportAvailable">
                <el-table
                :data="report.strategy_stats.rows"
                :header-cell-style="{ background: '#f2f2f2' }"
                >
                    <template v-for="col in [''].concat(report.strategy_stats.col_header)">
                        <el-table-column align="center" :label="getStrategyCol(col)">
                            <template slot-scope="scope">
                                <div v-if="col == ''">
                                    {{ chineseString(scope.row.row_head) }}
                                </div>
                                <div v-else>
                                    {{ formatStrategyStats(scope.row.row_head, scope.row[col]) }}
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </el-row>

            <!--- 延迟统计表格 --->
            <el-row :gutter="0" type="flex" style="margin-bottom: 50px" v-if="reportAvailable">
                <el-table
                :data="report.delay_stats.rows"
                :header-cell-style="{ background: '#f2f2f2' }"
                >
                    <template v-for="col in [''].concat(report.delay_stats.col_header)">
                        <el-table-column align="center" :label="getDelayCol(col)">
                            <template slot-scope="scope">
                                <div v-if="col == ''">
                                    {{ scope.row.row_head }}
                                </div>
                                <div v-else>
                                    {{ formatDelayStats(col, scope.row) }}
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </el-row>

            <el-row>
                <!--- 说明 --->
            </el-row>
        </div>
    </div>
</template>

<script>
import valueLine from '@/views/balance/_value_line'
import config from '@/configs/system_configs'
import { utcToLocalTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { chineseString } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'
import { getReport } from '@/api/report'


export default {
    components: {
        valueLine,
    },

    watch: {

    },

    data() {
        return {
            reportLevels: {
                'week': '周报',
                'month': '月报',
                'quarter': '季报',
                'year': '年报'
            },

            reportFilter: {
                'level': null,
                'dt_label': null
            },

            report: null,
            reportAvailable: false,

            beginValue: null,
            endValue: null,
            valueChange: null,

            strategyAlias: config.strategyAlias, 
            config: config,
            pfoHosts: config.pfoHosts,
        }
    },

    created(){
        this.search()
    },

    methods: {
        search(){
            // 默认展示上个月度报告
            if (this.reportFilter.level == null){
                this.reportFilter.level = 'week'
            }
            if (this.reportFilter.dt_label == null){
                // TEST
                this.reportFilter.dt_label = '2024-04-01'

                // 获取上个月1号的日期: %Y-%m-%d
                // var date = new Date()
                // date.setDate(1)
                // date.setMonth(date.getMonth()-1)
                // var dateStr = date.toLocaleDateString("en-GB").split('/')
                // this.reportFilter.dt_label = dateStr[2] + '-' + dateStr[1] + '-' + dateStr[0]
            }

            var filters = 'level=' + this.reportFilter.level + '&dt_label=' + this.reportFilter.dt_label
            getReport(this.config.masterHost, null, filters).then(response => {
                if (response.results.length == 0){
                    alert('报告:' + this.reportLevels[this.reportFilter.level] + ':' + this.reportFilter.dt_label + '不存在.')
                    return
                }
                this.report = response.results[0]
                this.reportAvailable = true
                this.beginValue = Math.round(this.report.summary.begin_value)
                this.endValue = Math.round(this.report.summary.end_value)
                this.valueChange = (this.endValue - this.beginValue)/this.beginValue
            })
        },

        // 策略表格表头汉化
        getStrategyCol(col){
            if (col == ''){
                return col
            } else if (col == 'all'){
                return '合计'
            } else {
                var strategy = col.split('_').slice(0, -1).join('_')
                var strategyId = col.split('_').slice(-1,)[0]
                return this.strategyAlias[strategy] + '-' + strategyId
            }
        },

        // 延迟表格表头汉化
        getDelayCol(col){
            if (col == ''){
                return col
            } else if (col == 'count'){
                return '统计订单次数'
            } else if (col == 'super_low_count'){
                return '超低延迟(0~0.2秒)'
            } else if (col == 'low_count'){
                return '低延迟(0.2~1秒)'
            } else if (col == 'medium_count'){
                return '中延迟(1~5秒)'
            } else if (col == 'high_count'){
                return '高延迟(5~25秒)'
            } else {
                return '超高延迟(>25秒)'
            }
        },

        // 策略收益格式化
        formatStrategyPnls(row_head, data){
            if(data == null){
                return data
            }
            if (row_head == 'pnl'){
                return toThousands(Math.round(data))
            } else if (row_head == 'pnl_ptg'){
                return (data*100).toFixed(2) + '%'
            } else {
                return data
            }
        },

        // 策略统计格式化
        formatStrategyStats(row_head, data){
            if(data == null){
                return data
            }
            if (row_head == 'volume'){
                return toThousands(Math.round(data))
            } else if (row_head == 'slippage'){
                return (data*100).toFixed(2) + '%'
            } else if (row_head == 'fee' || row_head == 'swap_funding' || row_head == 'op_fee'){
                return toThousands(Math.round(data))
            } else {
                return data
            }
        },

        // 策略统计格式化
        formatDelayStats(col, data){
            if(col == 'count'){
                return data[col]
            } else {
                if(data['count'] > 0){
                    return data[col] + ' / ' + (data[col]*100/data['count']).toFixed(1) + '%'
                } else {
                    return '0 / 0%'
                }
            }
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,
    }
}
</script>