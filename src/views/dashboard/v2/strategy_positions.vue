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
import {addSingleColumn, addTwoColumns} from '@/utils/chart'
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
        },
        btPositions: {
            type:Object,
            default:{}      
        }
    },

    watch: {
        positions: {
            handler(val, oldVal){
                this.parseData()
            }
        },
        btPositions: {
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
                    enabled: true
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
                series: [
                    {
                        name: '实盘仓位',
                        data: [],
                    },
                    {
                        name: '回测仓位',
                        data: [],
                    },
                ],
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
            var livePositions = []
            var btPositions = []
            for(const data of this.positions){
                if (config.mergeStrategyIDs.includes(data['sty'])){
                    var styID = data['sty']
                } else {
                    var styID = data['sty'] + '_' + data.worker.name.slice(-1,)
                }
                if (!(styID in styPositions)){
                    styPositions[styID] = {
                        'styID': styID,
                        'size': 0
                    }
                }
                styPositions[styID].size += data.usdt_size
            }
            // debugger

            
            // 实盘仓位
            for(const styID of config.activeStrategyIDs){
                if (config.mergeStrategyIDs.includes(styID)){
                    var data = styPositions[styID]
                    if (data.size >= 0){
                        livePositions.push({
                            'x': chineseStrategyID(data.styID, false),
                            'y': Math.round((data.size/1000)),
                            'color': 'green'
                        })                   
                    } else {
                        livePositions.push({
                            'x': chineseStrategyID(data.styID, false),
                            'y': Math.round((Math.abs(data.size/1000))),
                            'color': 'red'
                        })                      
                    }
                } else {
                    var data = styPositions[styID]
                    if (data.size >= 0){
                        livePositions.push({
                            'x': chineseStrategyID(data.styID),
                            'y': Math.round((data.size/1000)),
                            'color': 'green'
                        })                   
                    } else {
                        livePositions.push({
                            'x': chineseStrategyID(data.styID),
                            'y': Math.round((Math.abs(data.size/1000))),
                            'color': 'red'
                        })                      
                    }
                }
            }

            // 回测仓位(只加载和实盘策略名称完全一致的, eg, 不加载pb策略)
            for(const styID in this.btPositions){
                if (styID.replace('-', '_') in styPositions){
                    var position = this.btPositions[styID]
                    if (position >= 0){
                        btPositions.push({
                            'x': chineseStrategyID(styID),
                            'y': Math.round((position/1000)),
                            'color': 'lightgreen'
                        })                   
                    } else {
                        btPositions.push({
                            'x': chineseStrategyID(styID),
                            'y': Math.round((Math.abs(position/1000))),
                            'color': 'orange'
                        })                      
                    }                  
                }
            }

            // addSingleColumn(livePositions, this.positionOptions)  
            addTwoColumns(livePositions, btPositions, this.positionOptions)
        },
    }
}
</script>