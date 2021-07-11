<template>
   <el-row :gutter="0" type="flex">
        <!-- Pfo资金曲线 -->
        <el-col :span="12">
            <!-- 曲线 -->
            <highcharts :options="pfoBalancesOptions"></highcharts>
        </el-col>

        <el-col :span="10" :offset="1">
            <!-- 统计信息 -->
            <el-table
                :data="pfoBalancesData"
                style="width: 100%; margin-bottom: 20px; margin-top: 45px"
                :header-cell-style="{ background: '#f2f2f2' }"
            >
                <el-table-column label="投资组合" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.pfo }}
                  </template>
                </el-table-column>

                <el-table-column label="资金" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ toThousands(Math.round(scope.row.usdt_amount)) }}
                  </template>
                </el-table-column>

                <el-table-column label="今日变动" min-width="20%" align="center">
                  <template slot-scope="scope">
                      <span style="color: green" v-if="scope.row.day_diff >= 0">
                          {{ toThousands(Math.round(scope.row.day_diff)) }}
                      </span>
                      <span style="color: red" v-else>
                          {{ toThousands(Math.round(scope.row.day_diff)) }}
                      </span>                      
                  </template>
                </el-table-column>

                <el-table-column label="当前回撤" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ (scope.row.drawdown*100).toFixed(2) }}%
                  </template>
                </el-table-column>

                <el-table-column label="最大回撤" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ (scope.row.max_drawdown*100).toFixed(2) }}%
                  </template>
                </el-table-column>
            </el-table>          
        </el-col> 
    </el-row>    
</template>

<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'
import {toThousands} from '@/utils/general'
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
            pfoBalancesData: null,

            pfoBalancesOptions: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: '投资组合资金',
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
            this.pfoBalancesData = []
            this.pfoBalancesOptions.xAxis.categories = []
            this.pfoBalancesOptions.series = []
            for(var i = 0; i < this.pfoDatas.length; i++){
                if (this.pfoDatas[i].portfolio.name !== config.cryptoParentPfo){
                    // 普通pfo
                    addMultiLineX(this.pfoDatas[i].wallet.history_values, this.pfoBalancesOptions)
                    this.pfoDatas[i].wallet['pfo'] = this.pfoDatas[i].portfolio.alias
                    this.pfoBalancesData.push(this.pfoDatas[i].wallet)
                }               
            }
            for(var i = 0; i < this.pfoDatas.length; i++){
                if (this.pfoDatas[i].portfolio.name !== config.cryptoParentPfo){
                    // 普通pfo
                    addMultiLine(this.pfoDatas[i].portfolio.alias, this.pfoDatas[i].wallet.history_values, this.pfoBalancesOptions)
                }               
            }
        },

        toThousands: toThousands,
    }
}
</script>