<template>
   <el-row :gutter="0" type="flex" >
        <!-- Pfo收益曲线 -->
        <el-col :span="12">
            <!-- 曲线 -->
            <highcharts :options="pfoProfitOptions"></highcharts>
        </el-col>

        <el-col :span="10" :offset="1">
            <!-- 统计信息 -->
            <el-table
                :data="pfoPerfs"
                style="width: 100%; margin-bottom: 20px; margin-top: 45px"
                :header-cell-style="{ background: '#f2f2f2' }"
            >
                <el-table-column label="投资组合" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.pfo }}
                  </template>
                </el-table-column>

                <el-table-column label="收益率" min-width="20%" align="center">
                  <template slot-scope="scope">
                      <span style="color: green" v-if="scope.row.usd_profit >= 0">
                          {{ (scope.row.usd_profit*100/pfoInitUSD[scope.row.pfo]).toFixed(2) }}%
                      </span>
                      <span style="color: red" v-else>
                          {{ (scope.row.usd_profit*100/pfoInitUSD[scope.row.pfo]).toFixed(2) }}%
                      </span>  
                  </template>
                </el-table-column>

                <el-table-column label="收益($)" min-width="20%" align="center">
                  <template slot-scope="scope">
                      <span style="color: green" v-if="scope.row.usd_profit >= 0">
                          {{ (scope.row.usd_profit).toFixed(0) }}
                      </span>
                      <span style="color: red" v-else>
                          {{ (scope.row.usd_profit).toFixed(0) }}
                      </span>                    
                  </template>
                </el-table-column>

                <el-table-column label="次数" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.count }}
                  </template>
                </el-table-column>

                <el-table-column label="胜率" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ (scope.row.win_ptg * 100).toFixed(2) }}%
                  </template>
                </el-table-column>

                <el-table-column label="盈亏比" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.pl_ratio.toFixed(2) }}
                  </template>
                </el-table-column>
            </el-table>          
        </el-col>
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'
import {addMultiLine, addMultiLineX} from '@/utils/chart'

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
            // Pfo策略表现   
            pfoPerfs: null,
            pfoInitUSD: config.pfoInitUSD,

            // Pfo收益曲线图(1 - 4)
            pfoProfitOptions: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: '投资组合收益',
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
            this.pfoPerfs = []
            this.pfoProfitOptions.xAxis.categories = []
            this.pfoProfitOptions.series = []
            for(var i = 0; i < this.pfoDatas.length; i++){
                // 添加xAxis(日期)
                const perf = this.pfoDatas[i][0].performance
                const pfo =  this.pfoDatas[i][0].portfolio.alias
                addMultiLineX(perf.history_values.usd_profit, this.pfoProfitOptions)

                // pfo表现
                perf.data['pfo'] = pfo
                this.pfoPerfs.push(perf.data)
            }
            for(var i = 0; i < this.pfoDatas.length; i++){
                // 添加Lines
                const perf = this.pfoDatas[i][0].performance
                const pfo =  this.pfoDatas[i][0].portfolio.alias
                addMultiLine(pfo, perf.history_values.usd_profit, this.pfoProfitOptions)
            }
        },
    }
}
</script>
