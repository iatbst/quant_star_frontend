<template>
    <div>
        <!-- 总体合计仓位 -->
        <el-col :span="4" style="margin-top: 20px;margin-bottom: 20px;">
            <highcharts :options="allPositionOptions"></highcharts>
        </el-col>
        <!-- TB合计仓位 -->
        <el-col :span="4" style="margin-top: 20px;margin-bottom: 20px;">
            <highcharts :options="tbPositionOptions"></highcharts>
        </el-col>
        <!-- 子策略仓位 -->
        <el-col :span="16" style="margin-top: 20px;margin-bottom: 20px;">
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
            allPositionOptions: {
                chart: {
                    type: 'column',
                    height: 400
                },

                title: {
                    text: '总仓位',
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
                    headerFormat: '',
                    pointFormat: '{series.name}: ${point.y2}'
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

            tbPositionOptions: {
                chart: {
                    type: 'column',
                    height: 400
                },

                title: {
                    text: 'TB总仓位',
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
                    headerFormat: '',
                    pointFormat: '{series.name}: ${point.y2}'
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
                    pointFormat: '{series.name}: ${point.y2}'
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
            var allLivePositions = 0
            var allBtPositions = 0
            for(const data of this.positions){
                if (config.mergeStrategyIDs.includes(data['sty'])){
                    var styID = data['sty']
                } else {
                    var styID = data['sty'] + '_' + data.worker.name.slice(-1,)
                }

                if (!(styID in styPositions)){
                    styPositions[styID] = {
                        'styID': styID,
                        'size': 0,
                        'bt_size': 0
                    }
                }
                styPositions[styID].size += data.usdt_size
                styPositions[styID].bt_size += data.bt_usdt_size
            }

            
            // 实盘仓位(y表示千位值;y2是精确值)
            for(const styID of config.activeStrategyIDs){
                var data = styPositions[styID]
                if (config.mergeStrategyIDs.includes(styID)){
                    livePositions.push({
                        'x': chineseStrategyID(data.styID, false, false),
                        'y': Math.round((data.size/1000)),
                        'y2': Math.round((data.size)),
                    }) 
                    btPositions.push({
                        'x': chineseStrategyID(data.styID, false, false),
                        'y': Math.round((data.bt_size/1000)),
                        'y2': Math.round((data.bt_size)),
                    })                   
                } else {
                    livePositions.push({
                        'x': chineseStrategyID(data.styID),
                        'y': Math.round((data.size/1000)),
                        'y2': Math.round((data.size)),
                    })    
                    btPositions.push({
                        'x': chineseStrategyID(data.styID),
                        'y': Math.round((data.bt_size/1000)),
                        'y2': Math.round((data.bt_size)),
                    })                  
                }

                // tb策略合计实盘仓位统计
                if(styID.includes('trendline_break')){
                    tbLivePositions += data.size
                    tbBtPositions += data.bt_size
                }
                
                // 总仓位
                allLivePositions += data.size
                allBtPositions += data.bt_size
            }
            debugger

            // 回测仓位(只加载和实盘策略名称完全一致的, eg, 不加载pb等短线策略)
            // 先合并仓位
            // var mergeBtPositions = {}
            // for(const exchange in this.btPositions){
            //     for(const styID in this.btPositions[exchange].data){
            //         var position = this.btPositions[exchange].data[styID]
            //         if(styID in mergeBtPositions){
            //             mergeBtPositions[styID] += position
            //         } else {
            //             mergeBtPositions[styID] = position
            //         }
            //     }
            // }
            // for(const styID in mergeBtPositions){
            //     var position = mergeBtPositions[styID]
            //     if (styID.replace('-', '_') in styPositions){
            //         btPositions.push({
            //             'x': chineseStrategyID(styID),
            //             'y': Math.round((position/1000)),
            //         })                                   
            //     }
 
            //      // tb策略合计回测仓位统计
            //     if(styID.replace('-', '_').includes('trendline_break')){
            //         tbBtPositions += position/1000
            //     }
            // }

            addTwoColumns([{'x': '总仓位', 'y': Math.round(allLivePositions/1000), 'y2': Math.round(allLivePositions)}], [{'x': '总仓位', 'y': Math.round(allBtPositions/1000), 'y2': Math.round(allBtPositions)}], this.allPositionOptions)
            addTwoColumns([{'x': 'TB总仓位', 'y': Math.round(tbLivePositions/1000), 'y2': Math.round(tbLivePositions)}], [{'x': 'TB总仓位', 'y': Math.round(tbBtPositions/1000), 'y2': Math.round(tbBtPositions)}], this.tbPositionOptions)
            addTwoColumns(livePositions, btPositions, this.positionOptions)
        },
    }
}
</script>