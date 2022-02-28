<template>
   <el-row :gutter="0" type="flex" >
        <!-- 总收益日柱线图 -->
        <el-col :span="24">
            <!-- 曲线 -->
            <highcharts :options="dailyProfitOptions"></highcharts>
        </el-col>
    </el-row>
</template>

<script>
import {Chart} from 'highcharts-vue'
import moment from 'moment'
import {addSingleColumn} from '@/utils/chart'
import config from '@/configs/system_configs'

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
            dailyProfitOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '日收益($)',
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
            var balanceHistory = {}
            var dailyProfit = []
            var day_diff = null
            for(var i = 0; i < this.pfoDatas.length; i++){
                if (this.pfoDatas[i].portfolio.name === config.cryptoParentPfo){
                    // Crypto父pfo
                    balanceHistory = this.pfoDatas[i].wallet.history_values
                    day_diff = this.pfoDatas[i].wallet.day_diff
                    break;
                }               
            }

            var day_profit = null
            for(let date in balanceHistory){
                var date2 = moment(date).add('day',1).format('YYYY-MM-DD')
                if (balanceHistory.hasOwnProperty(date2)){
                    day_profit = balanceHistory[date2] - balanceHistory[date]
                    dailyProfit.push({
                        x: date,
                        y: parseInt(day_profit),
                        color: day_profit >= 0 ? 'green' : 'red'
                    })
                }
            }

            // 排序并添加今日profit
            dailyProfit.sort((a, b) => moment(a.x).format('X') - moment(b.x).format('X'))
            var today = moment().format('YYYY-MM-DD')
            dailyProfit.push({
                x: today,
                y: parseInt(day_diff),
                color: day_diff >= 0 ? 'green' : 'red'
            })

            // 渲染Line Chart
            addSingleColumn(dailyProfit, this.dailyProfitOptions)
        },
    }
}
</script>
