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
            positionsByCoins: null,
            totalUsdtAmount: null,
            totalLongAmount: null,
            totalShortAmount: null,
            positionSummaryByPfos: null,
            pfoRowCount: 3, // 右侧框下部每行展示几个pfo
            pfoAlias: config.pfoAlias,

            // 总分布: USDT vs BTC, Long vs Short
            chartOptions: {
                chart: {
                    type: 'column',
                    height: '60%'
                },
                title: {
                    text: '长短周期仓位',
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
            var levelPositions = {1: 0, 2: 0, 3: 0, 4: 0} // 指定周期长短序号
            for(var i = 0; i < this.pfoDatas.length; i++){
                if (this.pfoDatas[i].portfolio.name === config.cryptoParentPfo){
                    // Crypto父pfo
                    var posData = this.pfoDatas[i].positions.summary
                    for(let key in posData){
                        var level = key.split('_')[0]
                        if (levelPositions.hasOwnProperty(level)){
                            levelPositions[level] += posData[key]
                        }
                    }
                    for(let level in levelPositions){
                        positions.push({
                            x: level,
                            y: Math.abs(parseInt(levelPositions[level])),
                            color: levelPositions[level] >= 0 ? 'green' : 'red'
                        })
                    }
                    positions = positions.sort((a, b) => a.x - b.x)

                    addSingleColumn(positions, this.chartOptions)
                }               
            }                 
        },
    }
}
</script>