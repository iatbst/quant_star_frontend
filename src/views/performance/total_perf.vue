<template>
   <el-row :gutter="0" type="flex">
        <!-- 总收益曲线 -->
        <el-col :span="12">
            <!-- 曲线 -->
            <highcharts :options="totalProfitOptions"></highcharts>
        </el-col>

        <el-col :span="10" :offset="1">
            <!-- 统计信息 -->
            <el-card class="box-card" style="min-height: 80%;margin-top: 20px; border-color: black">
                <div>
                    <el-row :gutter="0" type="flex" align="middle">
                        <el-col :span="16" align="center">
                            <h1 style="font-size: 450%; color: green" v-if="totalProfit >= 0">
                                ${{ toThousands(Math.round(totalProfit)) }}
                            </h1>
                            <h1 style="font-size: 450%; color: red" v-else>
                                -${{ toThousands(Math.round(-totalProfit)) }}
                            </h1>                            
                        </el-col>
                        <el-col :span="8" align="left">
                            <h2 style="font-size: 250%; color: green" v-if="totalProfit >= 0">
                                {{ (totalProfit * 100/totalInitUSD).toFixed(2) }}%
                            </h2>
                            <h2 style="font-size: 250%; color: red" v-else>
                                {{ (totalProfit * 100/totalInitUSD).toFixed(2) }}%
                            </h2>                                                 
                        </el-col>                        
                    </el-row>

                     <div>
                        <!-- N行展示pfoRowCount个pfo的数据 -->
                        <div v-for="row_ix in Math.ceil(pfoAlias.length/pfoRowCount)">
                            <el-row :gutter="0" type="flex" align="middle">
                                <el-col :span="24/pfoRowCount" align="center" v-for="col_ix in pfoRowCount">
                                    <h3 v-if="(row_ix - 1)*pfoRowCount + col_ix - 1 < pfoAlias.length">
                                        {{ pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1].toUpperCase() }}:
                                        <span style="color: green" v-if="pfoProfits[pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1]] >= 0">
                                            {{ (pfoProfits[pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1]] * 100/pfoInitUSD[pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1]]).toFixed(2) }}%
                                        </span>
                                        <span style="color: red" v-else>
                                            {{ (pfoProfits[pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1]] * 100/pfoInitUSD[pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1]]).toFixed(2) }}%
                                        </span>                                
                                    </h3>                          
                                </el-col>                  
                            </el-row> 
                        </div>
                    </div>

                </div>
            </el-card>
        </el-col> 
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'
import {addSingleLine} from '@/utils/chart'
import {toThousands} from '@/utils/general'

export default {
    components: {
        highcharts: Chart
    },
    props: {
        pfoDatas: {
            type:Array,
            default:[]
        }
    },

    watch: {
        pfoDatas: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        }
    },

    data() {
        return {
            // 历史总收益
            totalProfitHistory: null,
            pfoRowCount: 3,
            pfoAlias: config.pfoAlias,

            totalProfit: 0,
            pfoProfits: null,
            totalInitUSD: config.totalInitUSD,
            pfoInitUSD: config.pfoInitUSD,

            // 总收益曲线图
            totalProfitOptions: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: '总收益',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: '美元'
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
    created() {
        // 分析Data
        this.parseData()
    },
    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData() {
            this.totalProfit = 0
            this.pfoProfits = {}
            var totalProfitHistory = {}
            for(var i = 0; i < this.pfoDatas.length; i++){
                const perf = this.pfoDatas[i][0].performance
                const pfo = this.pfoDatas[i][0].portfolio.alias
                for(let date in perf.history_values.usd_profit){
                    if (totalProfitHistory.hasOwnProperty(date)){
                        totalProfitHistory[date] += perf.history_values.usd_profit[date]
                    } else {
                        totalProfitHistory[date] = perf.history_values.usd_profit[date]
                    }
                }
                this.pfoProfits[pfo] = perf.data.usd_profit
                this.totalProfit += perf.data.usd_profit
            }

            // 渲染Line Chart
            addSingleLine('总收益', totalProfitHistory, this.totalProfitOptions)
        },
        toThousands: toThousands     
    }
}
</script>