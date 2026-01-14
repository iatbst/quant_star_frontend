<template>
    <div class="app-container" align="center" style="background-color: lightgray">
        <div style="width: 100%; margin-top: 0px">
            <!--- 总表 --->
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
                <!-- 仓位 -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.all.name,
                            data: positionLiveLines.all.data,
                        },
                        {
                            title: positionBtLines.all.name,
                            data: positionBtLines.all.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- 仓位差 -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                        <div>
                            <highcharts :options="positionDiffColumns.all" style="margin-top: 20px"></highcharts>
                        </div>
                    </div>
                </el-col>

                <!-- 资金 -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.all.name,
                            data: balanceLiveLines.all.data,
                        },
                        {
                            title: balanceBtLines.all.name,
                            data: balanceBtLines.all.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- 资金差 -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                        <div>
                            <highcharts :options="balanceDiffColumns.all" style="margin-top: 20px"></highcharts>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 仓位曲线对比 -->
            <div style="background-color: white; margin-top: 20px">
                <h4 style="margin-top: 20px">仓位</h4>
            </div>
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: -22px">
                <!-- Binance -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.binance.name,
                            data: positionLiveLines.binance.data,
                        },
                        {
                            title: positionBtLines.binance.name,
                            data: positionBtLines.binance.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Okex -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.okex.name,
                            data: positionLiveLines.okex.data,
                        },
                        {
                            title: positionBtLines.okex.name,
                            data: positionBtLines.okex.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bybit -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.bybit.name,
                            data: positionLiveLines.bybit.data,
                        },
                        {
                            title: positionBtLines.bybit.name,
                            data: positionBtLines.bybit.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bitget -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.bitget.name,
                            data: positionLiveLines.bitget.data,
                        },
                        {
                            title: positionBtLines.bitget.name,
                            data: positionBtLines.bitget.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 仓位曲线差对比 -->
            <div style="background-color: white; margin-top: 20px">
                <h4 style="margin-top: 20px">仓位差</h4>
            </div>
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: -22px">
                <!-- Binance -->
                <el-col :span="6" align="center">
                    <div>
                        <highcharts :options="positionDiffColumns.binance" style="margin-top: 20px"></highcharts>
                    </div>
                </el-col>

                <!-- Okex -->
                <el-col :span="6" align="center">
                    <div>
                        <highcharts :options="positionDiffColumns.okex" style="margin-top: 20px"></highcharts>
                    </div>
                </el-col>

                <!-- Bybit -->
                <el-col :span="6" align="center">
                    <div>
                        <highcharts :options="positionDiffColumns.bybit" style="margin-top: 20px"></highcharts>
                    </div>
                </el-col>

                <!-- Bitget -->
                <el-col :span="6" align="center">
                    <div>
                        <highcharts :options="positionDiffColumns.bitget" style="margin-top: 20px"></highcharts>
                    </div>
                </el-col>         
            </el-row>

            <!--- 实盘-回测: 资金曲线对比 -->
            <div style="background-color: white; margin-top: 20px">
                <h4 style="margin-top: 20px">资金</h4>
            </div>
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: -22px">
                <!-- Binance -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.binance.name,
                            data: balanceLiveLines.binance.data,
                        },
                        {
                            title: balanceBtLines.binance.name,
                            data: balanceBtLines.binance.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Okex -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.okex.name,
                            data: balanceLiveLines.okex.data,
                        },
                        {
                            title: balanceBtLines.okex.name,
                            data: balanceBtLines.okex.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bybit -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.bybit.name,
                            data: balanceLiveLines.bybit.data,
                        },
                        {
                            title: balanceBtLines.bybit.name,
                            data: balanceBtLines.bybit.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bitget -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.bitget.name,
                            data: balanceLiveLines.bitget.data,
                        },
                        {
                            title: balanceBtLines.bitget.name,
                            data: balanceBtLines.bitget.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 资金曲线差对比 -->
            <div style="background-color: white; margin-top: 20px">
                <h4 style="margin-top: 20px">资金差</h4>
            </div>
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: -22px">
                <!-- Binance -->
                <el-col :span="6" align="center">
                    <div>
                        <highcharts :options="balanceDiffColumns.binance" style="margin-top: 20px"></highcharts>
                    </div>
                </el-col>

                <!-- Okex -->
                <el-col :span="6" align="center">
                    <div>
                        <highcharts :options="balanceDiffColumns.okex" style="margin-top: 20px"></highcharts>
                    </div>
                </el-col>

                <!-- Bybit -->
                <el-col :span="6" align="center">
                    <div>
                        <highcharts :options="balanceDiffColumns.bybit" style="margin-top: 20px"></highcharts>
                    </div>
                </el-col>

                <!-- Bitget -->
                <el-col :span="6" align="center">
                    <div>
                        <highcharts :options="balanceDiffColumns.bitget" style="margin-top: 20px"></highcharts>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import tradeOrders from '@/views/orders/_trade_orders'
import valueLine from '@/views/balance/_value_line'
import config from '@/configs/system_configs'
import { utcToLocalTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { chineseString, chineseStrategyID } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'
import { getReport } from '@/api/report'
import { getPortfolioByName } from '@/api/portfolio'
import { getTradeById } from '@/api/trade'
import {Chart} from 'highcharts-vue'
import { exchangeColors } from '@/utils/chart'
import moment from 'moment'
import exchangeValueLines from '@/views/report/exchange_valuelines'
import { getPortfolioDatas, getPortfolioDataByName } from '@/api/portfolio' 
import { addSingleColumn} from '@/utils/chart'


export default {
    components: {
        tradeOrders,
        valueLine,
        highcharts: Chart,
        exchangeValueLines
    },

    watch: {

    },

    data() {
        return {
            backtestDataAvailable: false,
            

            // 平台实盘资产曲线
            balanceLiveLines: {
                'all': {
                    'name': '实盘资金',
                    'data': null
                }, 
                'binance': {
                    'name': 'Binance实盘',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex实盘',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit实盘',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget实盘',
                    'data': null
                },                                           
            },

            // 平台回测资产曲线
            balanceBtLines: {
                'all': {
                    'name': '回测资金',
                    'data': null
                }, 
                'binance': {
                    'name': 'Binance回测',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex回测',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit回测',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget回测',
                    'data': null
                },                                           
            },

            // 平台仓位差柱状图
            positionDiffColumns: {
                'all': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: '仓位差',
                        data: [],
                    }],
                },  
                'binance': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: 'Binance',
                        data: [],
                    }],
                },  
                'okex': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: 'Okex',
                        data: [],
                    }],
                }, 
                'bybit': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: 'Bybit',
                        data: [],
                    }],
                }, 
                'bitget': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: 'Bitget',
                        data: [],
                    }],
                },                                          
            },

            // 平台资金差柱状图
            balanceDiffColumns: {
                'all': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: '资金差',
                        data: [],
                    }],
                },  
                'binance': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: 'Binance',
                        data: [],
                    }],
                },  
                'okex': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: 'Okex',
                        data: [],
                    }],
                }, 
                'bybit': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: 'Bybit',
                        data: [],
                    }],
                }, 
                'bitget': {
                    chart: {
                        type: 'column',
                        height: 400
                    },

                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    
                    exporting: { enabled: false },
                    
                    // legend: {
                    //     enabled: false
                    // },

                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '${point.y}'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                    series: [{
                        name: 'Bitget',
                        data: [],
                    }],
                },                                          
            },

            // 平台实盘仓位曲线
            positionLiveLines: {
                'all': {
                    'name': '实盘仓位',
                    'data': null
                }, 
                'binance': {
                    'name': 'Binance实盘',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex实盘',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit实盘',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget实盘',
                    'data': null
                },                                           
            },

            // 平台回测仓位曲线
            positionBtLines: {
                'all': {
                    'name': '回测仓位',
                    'data': null
                }, 
                'binance': {
                    'name': 'Binance回测',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex回测',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit回测',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget回测',
                    'data': null
                },                                           
            },

            strategyAlias: config.strategyAlias, 
            config: config,
            pfoHosts: config.pfoHosts,
            dataRefresh: null,
            refreshInterval: 60000,
            refreshIntervalId: null,

        
        }
    },

    created(){
        this.parseDatas()
        this.refresh()
    },

    methods: {
        parseDatas(){
            this.dataRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'backtest_hour_history').then(response => {
                var historyData = response.results[0].backtest_hour_history
    

                // 准备实盘-回测: 资金曲线对比
                for(let exchange in this.balanceLiveLines){
                    this.balanceLiveLines[exchange].data = this.getRangeData(historyData.balances.balance_live[exchange])
                }
                for(let exchange in this.balanceBtLines){
                    this.balanceBtLines[exchange].data = this.getRangeData(historyData.balances.balance_bt[exchange])
                }

                // 准备实盘-回测: 资金差柱状图
                for(let exchange in this.balanceLiveLines){
                    var colDatas = []
                    for(let ts in this.getRangeData(historyData.balances.balance_diff[exchange])){
                        var val = historyData.balances.balance_diff[exchange][ts]
                        colDatas.push({
                            'x': ts,
                            'y': Math.abs(Number(val.toFixed(0))),
                            'color': Number(val) >= 0 ? 'green' : 'red'
                        })                   
                    }
                    // debugger
                    addSingleColumn(colDatas, this.balanceDiffColumns[exchange]) 
                }

                // 准备实盘-回测: 仓位曲线对比
                for(let exchange in this.positionLiveLines){
                    this.positionLiveLines[exchange].data = this.getRangeData(historyData.positions.position_live[exchange])
                }
                for(let exchange in this.positionBtLines){
                    this.positionBtLines[exchange].data = this.getRangeData(historyData.positions.position_bt[exchange])
                }


                // 准备实盘-回测: 仓位差柱状图
                for(let exchange in this.positionLiveLines){
                    var colDatas = []
                    for(let ts in this.getRangeData(historyData.positions.position_diff[exchange])){
                        var val = historyData.positions.position_diff[exchange][ts]
                        colDatas.push({
                            'x': ts,
                            'y': Math.abs(Number(val.toFixed(0))),
                            'color': Number(val) >= 0 ? 'green' : 'red'
                        })                   
                    }
                    // debugger
                    addSingleColumn(colDatas, this.positionDiffColumns[exchange]) 
                }

                this.backtestDataAvailable = true
            })
        },
        
        // 最近N天的数据
        getRangeData(data){
            var keepDays = 3
            var startDate = moment(new Date()).subtract(keepDays,'days').format('YYYY-MM-DD')
            var rangeData = {}
            for(let dt in data){
                if (dt >= startDate){
                    rangeData[dt] = data[dt]
                }
            }  
            return rangeData 
        },

        // 定时刷新数据函数
        refresh() {
            // 计时器正在进行中，退出函数
            if (this.refreshIntervalId != null) {
                return;
            }

            // 计时器为空，操作
            this.refreshIntervalId = setInterval(() => {
                var now = new Date();
                // var hour = now.getHours()
                // var minute = now.getMinutes()
                // var second = now.getSeconds()
                // var date = now.getDate()

                console.log("刷新检查:" + now);
                // 资产表格
                if(now - this.dataRefresh > 300*1000){
                    console.log(now + ': 数据刷新.');
                    this.parseDatas()
                }
                
            }, this.refreshInterval);
        }, 

        // 停止定时器
        clear() {
            clearInterval(this.refreshIntervalId); //清除计时器
            this.refreshIntervalId = null; //设置为null
        },
    },

    destroyed(){
        // 在页面销毁后，清除计时器
        this.clear();
    }
}
</script>

<style>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-2024 {
    background: #d3dce6;
  }
  .bg-2025 {
    background: lightpink;
  }
  .bg-2026 {
    background: lightblue;
  }
  .bg-week {
    background: #f2f2f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    display:flex;
    align-items:center;
    justify-content: center;
    cursor: pointer;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>