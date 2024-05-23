<template>
    <div>
        <!-- 策略仓位 -->
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
import { chineseString, chineseStrategyID } from '@/utils/chinese'

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
                    text: '策略仓位',
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
            var styPositions = {}     
            var columnDatas = []
            for(const data of this.positions){
                var styID = data['sty'] + '_' + data.worker.name.slice(-1,)
                if (!(styID in styPositions)){
                    styPositions[styID] = {
                        'styID': styID,
                        'size': 0
                    }
                }
                styPositions[styID].size += data.usdt_size
            }

            
            // 多头tops
            for(const styID of config.activeStrategyIDs){
                var data = styPositions[styID]
                if (data.size >= 0){
                    columnDatas.push({
                        'x': chineseStrategyID(data.styID),
                        'y': Math.round((data.size/1000)),
                        'color': 'green'
                    })                   
                } else {
                    columnDatas.push({
                        'x': chineseStrategyID(data.styID),
                        'y': Math.round((Math.abs(data.size/1000))),
                        'color': 'red'
                    })                      
                }
            }

            addSingleColumn(columnDatas, this.positionOptions)  
        },
    }
}
</script>