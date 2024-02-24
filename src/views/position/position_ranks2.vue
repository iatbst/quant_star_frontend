<template>
    <div>
        <!-- 仓位排名 -->
        <el-col :span="24" style="margin-top: 20px;margin-bottom: 20px;">
            <highcharts :options="positionOptions"></highcharts>
        </el-col>   
    </div> 
</template>

<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'
import {getWorkersBySymbol} from '@/api/worker'
import {addSingleColumn} from '@/utils/chart'
import {quoteToUSD} from '@/utils/general'
import {deepCopy} from '@/utils/general'
import { getSignalPointsByWorker } from '@/api/signal_point'

export default {
    components: {
        highcharts: Chart,
    },

    props: {
        positions: {
            type:Array,
            default:[]
        }
    },

    watch: {
        positions: {
            handler(val, oldVal){
                this.parseData()
            }
        }
    },

    data() {
        return {
            positionOptions: {
                chart: {
                    type: 'column',
                    height: 400
                },

                title: {
                    text: '币种仓位排名',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '仓位(k$)'
                    },
                },
                
                exporting: { enabled: false },
                
                legend: {
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: ${point.y}k'
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true
                        }
                    },
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
        // 处理父组件建传入data: positions
        parseData() {    
            var coinPositions = {}   
            var tops = 10     
            var columnDatas = []
            for(const data of this.positions){
                var workerName = data.worker.name
                var coin = workerName.split('/')[0].split('_').slice(-1,)[0].toUpperCase()
                if (!(coin in coinPositions)){
                    coinPositions[coin] = {
                        'coin': coin,
                        'size': 0
                    }
                }
                coinPositions[coin].size += data.usdt_size
            }

            var sortPositions = Object.values(coinPositions).sort((a, b)=> b.size - a.size)
            // 多头tops
            for(const data of sortPositions.slice(0, tops)){
                if (data.size > 0){
                    columnDatas.push({
                        'x': data.coin,
                        'y': Number((data.size/1000).toFixed(1)),
                        'color': 'green'
                    })                   
                }
            }
            // 空头tops
            for(const data of sortPositions.slice(-tops,)){
                if (data.size < 0){
                    columnDatas.push({
                        'x': data.coin,
                        'y': Number((Math.abs(data.size/1000)).toFixed(1)),
                        'color': 'red'
                    })                   
                }
            }

            addSingleColumn(columnDatas, this.positionOptions)  
        },
    }
}
</script>