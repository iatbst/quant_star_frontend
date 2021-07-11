<template>
   <el-row :gutter="0" type="flex" >
        <!-- 总收益日柱线图 -->
        <el-col :span="24">
            <!-- 曲线 -->
            <highcharts :options="dailyTotalProfitOptions"></highcharts>
        </el-col>
    </el-row>
</template>

<script>
import {Chart} from 'highcharts-vue'
import moment from 'moment'
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
            dailyTotalProfitOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '日收益',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: '日收益($)'
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
                    pointFormat: '{series.name}: {point.y}$'
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
                    name: '收益',
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
        // 处理父组件建传入data: pfoDatas
        parseData() {
            var totalProfitHistory = {}
            var dailyTotalProfit = []
            for(var i = 0; i < this.pfoDatas.length; i++){
                const perf = this.pfoDatas[i][0].performance
                for(let date in perf.history_values.usd_profit){
                    if (totalProfitHistory.hasOwnProperty(date)){
                        totalProfitHistory[date] += perf.history_values.usd_profit[date]
                    } else {
                        totalProfitHistory[date] = perf.history_values.usd_profit[date]
                    }
                }
            }
            var day_profit = null
            for(let date in totalProfitHistory){
                var date2 = moment(date).add('day',1).format('YYYY-MM-DD')
                if (totalProfitHistory.hasOwnProperty(date2)){
                    day_profit = totalProfitHistory[date2] - totalProfitHistory[date]
                    dailyTotalProfit.push({
                        x: date,
                        y: parseInt(day_profit),
                        color: day_profit >= 0 ? 'green' : 'red'
                    })
                }
            }

            // 渲染Line Chart
            dailyTotalProfit.sort((a, b) => moment(a.x).format('X') - moment(b.x).format('X'))
            addSingleColumn(dailyTotalProfit, this.dailyTotalProfitOptions)
        },
    }
}
</script>