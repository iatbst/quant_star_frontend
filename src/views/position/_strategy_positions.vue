<template>
   <el-row :gutter="0" type="flex">
        <!-- 总仓位 -->
        <el-col :span="24">
            <!-- USDT/BTC Pie -->
            <highcharts :options="chartOptions"></highcharts>
        </el-col>
    </el-row>       
</template>
   
<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'
import {addSingleColumn} from '@/utils/chart'

export default {
    components: {
        highcharts: Chart
    },

    props: {
        posSummary: {
            type:Object,
            default:{}
        },
        strategyAliasList: {
            type:Array,
            default: []
        }
    },

    watch: {
        posSummary: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        }
    },

    data() {
        return {
            // 总分布: USDT vs BTC, Long vs Short
            chartOptions: {
                chart: {
                    type: 'column',
                    height: '60%'
                },
                title: {
                    text: '策略仓位',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: '仓位($)'
                    },
                },
                
                exporting: { enabled: false },
                
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false,
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: ${point.y}'
                },
                plotOptions: {
                    column: {
                        //stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: '仓位',
                    data: [],
                }],                          
            },
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data
        parseData() {   
            this.chartOptions.series = [{
                    name: '仓位',
                    data: [],                
            }]
            var positions = []
            var strategyPositions = {}
            for(let key in this.posSummary){
                var alias = key.split('_')[0]
                if (this.strategyAliasList.includes(alias)){
                    if (!strategyPositions.hasOwnProperty(alias)){
                        strategyPositions[alias] = 0
                    }
                    strategyPositions[alias] += this.posSummary[key]
                }
            }
            for(let alias in strategyPositions){
                positions.push({
                    x: alias,
                    y: Math.abs(parseInt(strategyPositions[alias])),
                    color: strategyPositions[alias] >= 0 ? 'green' : 'red'
                })
            }
            positions = positions.sort((a, b) => a.x - b.x)

            addSingleColumn(positions, this.chartOptions)                
        },
    }
}
</script>