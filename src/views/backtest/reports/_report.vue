<!-- 
    模板: 展示报告
-->
<template>
  <div>
    <div style="margin-top: 20px;" align="center">
        <el-table
        :data="abnormals"
        style="width: 90%; margin-bottom: 20px"
        :header-cell-style="{background: '#e5e9f2'}"
        v-if="abnormals.length > 0">
            <el-table-column align="center" label="策略ID" min-width="15%">
                <template slot-scope="scope">
                {{ scope.row.strategyId }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="异常类型" min-width="15%">
                <template slot-scope="scope">
                {{ scope.row.type }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="详情" min-width="70%">
                <template slot-scope="scope">
                {{ scope.row.info }}
                </template>
            </el-table-column>
        </el-table>

        <div style="border:1px solid red; width: 90%; margin-bottom: 20px" v-if="abnormals.length > 0">
            <h2>
                <i style="font-size:20px; color: red; " class="el-icon-error"></i> 注意: 在回测期间发生了如上异常, 如下回测统计结果不可采用, 请检查后重新运行, 确保无异常发生!
            </h2>
        </div>

        <el-table
        :data="basicStats"
        style="width: 90%"
        :header-cell-style="{background: '#e5e9f2'}"
        >
            <el-table-column align="center" label="收益率" min-width="8%">
                <template slot-scope="scope">
                    <b style="color: green" v-if="scope.row.pnl_ptg >= 0">
                        {{ scope.row.pnl_ptg }}%
                    </b>
                    <b style="color: red" v-else>
                        {{ scope.row.pnl_ptg }}%
                    </b>
                </template>
            </el-table-column>

            <el-table-column align="center" label="交易次数" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.count }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="胜率" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.win_ratio }}%
                </template>
            </el-table-column>

            <el-table-column align="center" label="平均盈利率" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.win_avg_pnl_ptg }}%
                </template>
            </el-table-column>

            <el-table-column align="center" label="平均亏损率" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.lose_avg_pnl_ptg }}%
                </template>
            </el-table-column>

            <el-table-column align="center" label="平均收益率" min-width="8%">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.avg_pnl_ptg >= 0">
                        {{ scope.row.avg_pnl_ptg }}%
                    </span>
                    <span style="color: red" v-else>
                        {{ scope.row.avg_pnl_ptg }}%
                    </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="盈亏率比" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.win_lose_ratio_ptg }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="平均盈利($)" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.win_avg_pnl }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="平均亏损($)" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.lose_avg_pnl }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="平均收益($)" min-width="8%">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.avg_pnl >= 0">
                        {{ scope.row.avg_pnl }}
                    </span>
                    <span style="color: red" v-else>
                        {{ scope.row.avg_pnl }}
                    </span>                   
                </template>
            </el-table-column>

            <el-table-column align="center" label="盈亏比" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.win_lose_ratio }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="最大回撤" min-width="8%">
                <template slot-scope="scope">
                {{ scope.row.max_drawdown }}%
                </template>
            </el-table-column>
        </el-table>  
    </div>

    <div style="margin-top: 20px;" align="center">
        <highcharts :options="valueLineOptions" style="width: 90%"></highcharts>
    </div>
  </div>
</template>

<script>
import {standardTimestamp, hourMinSecTimestamp} from '@/utils/general'
import {Chart} from 'highcharts-vue'
import {addSingleLine} from '@/utils/chart'


export default {
    components: {
        highcharts: Chart
    },

    props: {
        // 接收从父传入data
        report: {
            type:Object,
            default:{}
        },
        reportLoading: {
            type: Boolean,
            default: true
        },
        reload: {
            type: Number,
            default: 0
        }
    },

    watch: {
        reload(val){
            this.reloadData()
        }
    },

    data() {
        return {
            basicStats: [],
            hasAbnormal: false,
            abnormals: [],

            // 资产曲线图
            valueLineOptions: {
                chart: {
                    type: 'line',
                    zoomType: 'x'
                },
                title: {
                    text: '资产曲线',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                exporting: { enabled: false },
                
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                    },
                    line: {
                        marker: {
                            enabled: false
                        },
                    }			        
                },
                
                series: [],  
            },   
        }
    },

    created(){
        // 创建时report必须已经准备好
        this.reloadData()
    },


    methods: {
        init(){
            // 初始化basic stats
            this.basicStats = []
            this.basicStats.push({
                pnl_ptg: null,  // 收益率
                count: null,    // 交易次数
                win_ratio: null,    // 胜率
                win_avg_pnl_ptg: null,    // 平均盈利率(价格)
                lose_avg_pnl_ptg: null,    // 平均亏损率(价格)
                avg_pnl_ptg: null,    // 平均收益率(价格)
                win_lose_ratio: null, // 盈亏比(价格)
                max_drawdown: null  // 最大回撤
            })

            // 初始化value line
            this.initValueLine()
        },

        // 根据prop: report重新加载数据
        reloadData(){
            this.init()
            this.checkAbnormal()
            this.reloadBasicStats()
            this.reloadValueLine()
        },

        // 检查是否有abnormal发生
        checkAbnormal(){
            this.abnormals = []
            for(let strategyId in this.report.analyzer_rets.abnormal){
                var abnormalData = this.report.analyzer_rets.abnormal[strategyId]
                if (Object.keys(abnormalData).length > 0){
                    for(let _type in abnormalData){
                        this.abnormals.push({
                            strategyId: strategyId,
                            type: _type,
                            info: this._abnormalInfo(abnormalData[_type])
                        })
                    }
                }
            }
        },

        // 两种统计方式: 是否发生 vs 发生次数
        _abnormalInfo(data){
            if(data === true){
                // 异常发生
                return '异常发生(未统计次数).'
            } else {
                // 发生次数
                return '异常发生了' + data + '次.'
            }
        },

        // 加载value line
        reloadValueLine(){
            addSingleLine('总资金', this.report.analyzer_rets.value_line, this.valueLineOptions)      
        },

        initValueLine(){
            addSingleLine('总资金', {}, this.valueLineOptions)      
        },

        // 加载basic stats
        reloadBasicStats(){
            this.basicStats[0].pnl_ptg = ((this.report.analyzer_rets.value.value_ptg - 1)*100).toFixed(1)  // value analyzer

            // trade stats analyzer
            this.basicStats[0].count = this.report.analyzer_rets.trade_stats.count
            this.basicStats[0].win_ratio = (this.report.analyzer_rets.trade_stats.win_ratio*100).toFixed(1)
            this.basicStats[0].win_avg_pnl_ptg = (this.report.analyzer_rets.trade_stats.win_avg_pnl_ptg*100).toFixed(1)
            this.basicStats[0].lose_avg_pnl_ptg = (this.report.analyzer_rets.trade_stats.lose_avg_pnl_ptg*100).toFixed(1)
            this.basicStats[0].avg_pnl_ptg = (this.report.analyzer_rets.trade_stats.avg_pnl_ptg*100).toFixed(1)
            this.basicStats[0].win_lose_ratio_ptg = (this.basicStats[0].win_avg_pnl_ptg / -this.basicStats[0].lose_avg_pnl_ptg).toFixed(2)
            this.basicStats[0].win_avg_pnl = (this.report.analyzer_rets.trade_stats.win_avg_pnl).toFixed(0)
            this.basicStats[0].lose_avg_pnl = (this.report.analyzer_rets.trade_stats.lose_avg_pnl).toFixed(0)
            this.basicStats[0].avg_pnl = (this.report.analyzer_rets.trade_stats.avg_pnl).toFixed(0)
            this.basicStats[0].win_lose_ratio = (this.basicStats[0].win_avg_pnl / -this.basicStats[0].lose_avg_pnl).toFixed(2)

            this.basicStats[0].max_drawdown = (this.report.analyzer_rets.drawdown.max_drawdown*100).toFixed(1)   // drawdown analyzer
        },
        standardTimestamp:standardTimestamp,
    }
}
</script>
