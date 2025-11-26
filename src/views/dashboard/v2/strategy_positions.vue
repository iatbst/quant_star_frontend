<template>
    <div>
        <!-- 策略仓位 -->
        <el-col :span="4" style="margin-top: 20px;margin-bottom: 20px;">
            <highcharts :options="tbPositionOptions"></highcharts>
        </el-col>
        <!-- 策略仓位 -->
        <el-col :span="20" style="margin-top: 20px;margin-bottom: 20px;">
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
            tbPositionOptions: {
                chart: {
                    type: 'column',
                    height: 400
                },

                title: {
                    text: 'TB策略仓位合计',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    // min: 0,
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
                    // min: 0,
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
            var tbLivePositions = 0
            var tbBtPositions = 0
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

            
            // 实盘仓位
            for(const styID of config.activeStrategyIDs){
                if (config.mergeStrategyIDs.includes(styID)){
                    var data = styPositions[styID]
                    livePositions.push({
                        'x': chineseStrategyID(data.styID, false, false),
                        'y': Math.round((data.size/1000)),
                    })                   
                } else {
                    var data = styPositions[styID]
                    livePositions.push({
                        'x': chineseStrategyID(data.styID),
                        'y': Math.round((data.size/1000)),
                    })                   
                }

                // tb策略合计实盘仓位统计
                if(styID.includes('trendline_break')){
                    tbLivePositions += data.size/1000
                }
            }

            // 回测仓位(只加载和实盘策略名称完全一致的, eg, 不加载pb等短线策略)
            for(const styID in this.btPositions){
                var position = this.btPositions[styID]
                if (styID.replace('-', '_') in styPositions){
                    btPositions.push({
                        'x': chineseStrategyID(styID),
                        'y': Math.round((position/1000)),
                    })                                   
                }
 
                 // tb策略合计回测仓位统计
                if(styID.replace('-', '_').includes('trendline_break')){
                    tbBtPositions += position/1000
                }
            }

            addTwoColumns([{'x': 'TB-合计', 'y': Math.round(tbLivePositions)}], [{'x': 'T-合计', 'y': Math.round(tbBtPositions)}], this.tbPositionOptions)
            addTwoColumns(livePositions, btPositions, this.positionOptions)
        },
    }
}
</script>