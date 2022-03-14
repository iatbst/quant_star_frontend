<template>
   <el-row :gutter="0" type="flex"
   v-loading="delegateWorkerDatasLoading"
   >
        <!-- 收益排名柱状图 -->
        <el-col :span="24">
            <highcharts :options="profitRanksOptions"></highcharts>
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
        delegateWorkerDatas: {
            type:Array,
            default:[]
        },

        delegateWorkerDatasLoading: {
            type:Boolean,
            default:false     
        }
    },

    watch: {
        delegateWorkerDatas: {
            handler(val, oldVal){
                if (this.delegateWorkerDatasLoading === false){
                  this.parseData()
                }
            },
            deep: true
        }
    },

    data() {
        return {
            profitRanksOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '币种收益排名',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: '收益($)'
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
            var symbolProfitRanks = {}
            for(var i = 0; i < this.delegateWorkerDatas.length; i++){
                for(var j = 0; j < this.delegateWorkerDatas[i].length; j++){
                    var worker = this.delegateWorkerDatas[i][j].worker
                    var perf = this.delegateWorkerDatas[i][j].performance.summary
                    // debugger;
                    var symbol = worker.name.split('_')[2].toUpperCase()
                    symbol = this.quoteToUSD(symbol)
                    if (symbolProfitRanks.hasOwnProperty(symbol)){
                        symbolProfitRanks[symbol].y += parseInt(perf.usd_profit)
                        symbolProfitRanks[symbol].color = ( symbolProfitRanks[symbol].y >= 0 ? 'green' : 'red' )
                    } else {
                        symbolProfitRanks[symbol] = {
                            x: symbol,
                            y: parseInt(perf.usd_profit),
                            color: perf.usd_profit >= 0 ? 'green' : 'red'
                        }
                    }
                }
            }

            // 排序
            var rank = 10 // 前后10名
            var sortedSymbolProfitRanks = Object.values(symbolProfitRanks).sort((a, b) => b.y - a.y)
            var ranks = sortedSymbolProfitRanks.slice(0, rank)
            ranks = ranks.concat(sortedSymbolProfitRanks.slice(-rank, ))

            // 渲染Line Chart
            addSingleColumn(ranks, this.profitRanksOptions)
        },

        // 如果quote是usd的稳定币, 转为USD(eg, USDT )
        quoteToUSD(symbol) {
            var quote = symbol.split('/')[1]
            if (config.usdStableCoins.indexOf(quote) != -1 && quote != 'USD'){
                var base = symbol.split('/')[0]
                return base + '/USD'
            } else {
                return symbol
            }
        },

        // addSingleColumn(title, data_list, options){
        //     options.title.text = title
        //     for (var i = 0; i < data_list.length; i++){
        //         options.series[0].data.push({
        //             y: data_list[i].y,
        //             color: data_list[i].color
        //         })  
        //         options.xAxis.categories.push(data_list[i].x)           
        //     }
        // },
    }
}
</script>

<style scoped>
.el-table tbody tr:hover>td { 
    background-color:#ffffff!important
}
</style>
