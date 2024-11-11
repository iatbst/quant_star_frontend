<template>
  <div class="app-container" style="background-color: lightgray" align="center">
    <div style="background-color: white; margin-bottom: 0px;">
        <!-- 保持底部20px margin ! -->
        <div>
            <el-row style="margin-bottom: 20px">
            </el-row>
        </div>

        <div style="margin-left: 50px; margin-right: 50px; margin-bottom: 50px;">
            <el-row style="margin-bottom: 20px">
                <!-- 孙毅投资币种 -->
                <el-col :span="24">
                    <highcharts :options="sunTradesOptions"></highcharts>
                </el-col>   
            </el-row>
        </div> 

        <div style="margin-left: 50px; margin-right: 50px; margin-bottom: 50px;">
            <el-row style="margin-bottom: 20px">
                <!-- 杨嘉投资币种 -->
                <el-col :span="24">
                    <highcharts :options="jiaTradesOptions"></highcharts>
                </el-col> 
            </el-row>  
        </div> 

        <h4>
            当前持仓
        </h4>
        <div style="margin-left: 50px; margin-right: 50px; margin-bottom: 50px;">
            <el-row :gutter="0" type="flex" >
                <!----------------------------------- 持仓详情 --------------------------------------->
                <el-table
                :data="openPositions"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="openPositionsLoading"
                show-summary
                :summary-method="getSummaries1"
                >
                    <el-table-column align="center" label="币种" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.coin.toUpperCase() }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="持仓量" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.position }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="持仓额($)" min-width="10%">
                        <template slot-scope="scope">
                            {{ toThousands(toFixed(scope.row.position_sum, 0)) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="持仓均价($)" min-width="10%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.entry_price >= 1">
                                {{ toFixed(scope.row.entry_price, 2) }}
                            </span>
                            <span v-else>
                                {{ scope.row.entry_price }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="实时价格($)" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.last_tick }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="价格变动" min-width="10%">
                        <template slot-scope="scope">
                            <span style="color: green" v-if="scope.row.entry_price_diff >= 0">
                                {{ toFixed(scope.row.entry_price_diff*100, 2) }}%
                            </span>
                            <span style="color: red" v-else>
                                {{ toFixed(scope.row.entry_price_diff*100, 2) }}%
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="持仓收益($)" min-width="10%">
                        <template slot-scope="scope">
                            <span style="color: green" v-if="scope.row.pnl >= 0">
                                {{ toThousands(toFixed(scope.row.pnl, 0)) }}
                            </span>
                            <span style="color: red" v-else>
                                {{ toThousands(toFixed(scope.row.pnl, 0)) }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table> 
            </el-row>
        </div>

        <h4>
            平仓记录
        </h4>
        <div style="margin-left: 50px; margin-right: 50px; margin-bottom: 50px;">
            <el-row :gutter="0" type="flex" >
                <!----------------------------------- 持仓详情 --------------------------------------->
                <el-table
                :data="closePositions"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="closePositionsLoading"
                show-summary
                :summary-method="getSummaries2"
                >
                    <el-table-column align="center" label="币种" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.coin.toUpperCase() }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="平仓量" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.position }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="平仓额($)" min-width="10%">
                        <template slot-scope="scope">
                            {{ toThousands(toFixed(scope.row.position_sum, 0)) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="平仓均价($)" min-width="10%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.exit_price >= 1">
                                {{ toFixed(scope.row.exit_price, 2) }}
                            </span>
                            <span v-else>
                                {{ scope.row.exit_price }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="平仓收益($)" min-width="10%">
                        <template slot-scope="scope">
                            <span style="color: green" v-if="scope.row.pnl >= 0">
                                {{ toThousands(toFixed(scope.row.pnl, 0)) }}
                            </span>
                            <span style="color: red" v-else>
                                {{ toThousands(toFixed(scope.row.pnl, 0)) }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table> 
            </el-row>
        </div>
        
        <h4>
            订单详情
        </h4>
        <div style="margin-left: 50px; margin-right: 50px;">
            <el-row :gutter="0" type="flex" >
                <!----------------------------------- 订单详情 --------------------------------------->
                <el-table
                :data="orders"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="ordersLoading"
                >
                    <el-table-column align="center" label="币种" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.symbol.split('/')[0] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="时间" min-width="10%">
                        <template slot-scope="scope">
                            {{ utcToLocalTimestamp(scope.row.created_ts) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易所" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.worker.name.split('_')[0] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易" min-width="10%">
                        <template slot-scope="scope">
                            <span style="color: red" v-if="scope.row.side === 'sell'">
                            {{ chineseString(scope.row.side) }}
                            </span>
                            <span style="color: green" v-else>
                            {{ chineseString(scope.row.side) }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="数量" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.exec_size !== null">
                                {{ scope.row.exec_size }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="价格($)" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.exec_avg_price !== null">
                                {{ toFixed(scope.row.exec_avg_price, 2) }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="成交额($)" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.exec_size !== null && scope.row.exec_avg_price !== null">
                                {{ toThousands(toFixed(scope.row.exec_avg_price * scope.row.exec_size, 0)) }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table> 

            </el-row>
        </div>

        <!-- 保持底部20px margin ! -->
        <div>
            <el-row style="margin-top: 20px">
            </el-row>
        </div>
    </div>
  </div>
</template>

<script>
// Components
import {Chart} from 'highcharts-vue'
import orders from '@/views/orders/_orders'
import config from '@/configs/system_configs'
import { utcToLocalTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { getOrders } from '@/api/order'
import { getTradesByFinalFlag } from '@/api/trade'
import { chineseString } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'
import {addSingleColumn} from '@/utils/chart'


export default {
    components: {
        highcharts: Chart,
    },

    data() {
        return {
            sunTradesOptions: {
                chart: {
                    type: 'column',
                    height: 400
                },

                title: {
                    text: '孙毅投资收益',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '收益(k$)'
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
                    name: '收益',
                    data: [],
                }],
            },

            jiaTradesOptions: {
                chart: {
                    type: 'column',
                    height: 400
                },

                title: {
                    text: '杨嘉投资收益',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '收益(k$)'
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
                    name: '收益',
                    data: [],
                }],
            },

            masterHost: config.masterHost,
            orders: [],
            ordersLoading: false,

            openPositions: [],
            openPositionsLoading: false,

            closePositions: [],
            closePositionsLoading: false,

            sunTrades: [],
            jiaTrades: [],
        }
    },

    created() {
        this.fetchManualTrades()
        this.fetchOrders()
    },

    methods: {   
        // 获取所有的人工持仓
        fetchManualTrades(){
            this.openPositions = []
            this.openPositionsLoading = true
            this.closePositions = []
            this.closePositionsLoading = true
            var sunPnl = []
            var jiaPnl = []
            var sunPnlSum = 0
            var jiaPnlSum = 0
            getTradesByFinalFlag('manual', this.masterHost).then(response => {
                    var trades = response.results
                    var openData = {}   // key: coin
                    var closeData = {}  // key: coin

                    for(let trade of trades){
                        var coin = trade.worker.name.split('/')[0].split('_').slice(-1)[0]

                        // 持仓
                        if(trade.position > 0){
                            if (!(coin in openData)){
                                openData[coin] = {
                                    'position': 0,
                                    'entry_price_sum': 0,
                                    'last_tick': null,
                                    'last_tick_ts': null,
                                    'pnl': 0
                                }
                            } 
                            openData[coin].position += trade.position
                            openData[coin].entry_price_sum += trade.entry_avg_price * trade.position
                            openData[coin].pnl += trade.position_pnl  
                            if (openData[coin].last_tick == null || trade.flags.last_tick_ts > openData[coin].last_tick_ts){
                                openData[coin].last_tick = trade.flags.last_tick
                                openData[coin].last_tick_ts = trade.flags.last_tick_ts
                            }               
                        }

                        // 平仓
                        for(let order of trade.orders){
                            if(order.order_type == 'close'){
                                // 平仓order
                                if (!(coin in closeData)){
                                    closeData[coin] = {
                                        'position': 0,
                                        'position_sum': 0,
                                        'pnl': 0
                                    }
                                } 
                                closeData[coin].position += order.exec_size
                                closeData[coin].position_sum += order.exec_size * order.exec_avg_price
                                closeData[coin].pnl += order.pnl                                
                            }
                        }

                        // Sun VS Jia
                        if (trade.flag_codes == 'sun'){
                            var coin = trade.worker.product.symbol.split('/')[0]
                            var pnl = trade.position_pnl    // 持仓收益
                            if (trade.pnl != null){
                                pnl += trade.pnl            // 平仓收益
                            }
                            sunPnl.push({
                                'coin': coin,
                                'pnl': pnl
                            })
                            sunPnlSum += pnl
                        }
                        if (trade.flag_codes == 'jia'){
                            var coin = trade.worker.product.symbol.split('/')[0]
                            var pnl = trade.position_pnl    // 持仓收益
                            if (trade.pnl != null){
                                pnl += trade.pnl            // 平仓收益
                            }
                            jiaPnl.push({
                                'coin': coin,
                                'pnl': pnl
                            })
                            jiaPnlSum += pnl
                        }                       
                    }

                    // Sun VS Jia
                    sunPnl.sort((a, b)=> b.pnl - a.pnl)
                    jiaPnl.sort((a, b)=> b.pnl - a.pnl)
                    var sunColDatas = []
                    var jiaColDatas = []
                    for(const data of sunPnl){
                        sunColDatas.push({
                            'x': data.coin,
                            'y': Number((Math.abs((data.pnl/1000))).toFixed(1)),
                            'color': data.pnl >= 0 ? 'green' : 'red'
                        })                   
                    }
                    for(const data of jiaPnl){
                        jiaColDatas.push({
                            'x': data.coin,
                            'y': Number((Math.abs((data.pnl/1000))).toFixed(1)),
                            'color': data.pnl >= 0 ? 'green' : 'red'
                        })                   
                    }
                    addSingleColumn(sunColDatas, this.sunTradesOptions)  
                    addSingleColumn(jiaColDatas, this.jiaTradesOptions)  
                    this.sunTradesOptions.title.text += '($' + toThousands(Math.round(sunPnlSum)) + ')'
                    this.jiaTradesOptions.title.text += '($' + toThousands(Math.round(jiaPnlSum)) + ')'           

                    // 持仓总结
                    for(let coin in openData){
                        var data = openData[coin]
                        data['coin'] = coin
                        data['entry_price'] = data.entry_price_sum / data.position  // 持仓均价
                        data['entry_price_diff'] = (data.last_tick - data.entry_price) / data.entry_price  // 价格变动
                        data['position_sum'] = data.position * data.last_tick       // 持仓额度

                        // 加入list
                        this.openPositions.push(data)

                        // 排序
                        this.openPositions.sort((a, b) => b.position_sum - a.position_sum)
                    }
                    this.openPositionsLoading = false

                    // 平仓总结
                    for(let coin in closeData){
                        var data = closeData[coin]
                        data['coin'] = coin
                        data['exit_price'] = data.position_sum / data.position  // 关仓均价

                        // 加入list
                        this.closePositions.push(data)

                        // 排序
                        this.closePositions.sort((a, b) => b.position_sum - a.position_sum)
                    }
                    this.closePositionsLoading = false
                }
            )
        },

        fetchOrders(){
            this.orders = []
            this.ordersLoading = true
            var filters = 'show_worker=true&exec_mode=manual'
            getOrders(this.masterHost, null, filters).then(response => {
                    this.orders = this.orders.concat(response.results)

                    // 排序
                    this.orders.sort((a, b) => a.created_ts.localeCompare(b.created_ts))
                    this.ordersLoading = false
                }
            )
        },

        getSummaries1(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            } else if(index == 2){
                // 持仓额
                var sum = 0
                for(let i = 0; i < data.length; i++){
                    sum += data[i].position_sum
                }
                sums[index] = toThousands(Math.round(sum))         
                return;
            } else if(index == 6){
                // 持仓收益
                var sum = 0
                for(let i = 0; i < data.length; i++){
                    sum += data[i].pnl
                }
                sums[index] = toThousands(Math.round(sum))         
                return;              
            } else {        
                sums[index] = null
                return;
            }
            });

            return sums;
        },

        getSummaries2(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            } else if(index == 2){
                // 持仓额
                var sum = 0
                for(let i = 0; i < data.length; i++){
                    sum += data[i].position_sum
                }
                sums[index] = toThousands(Math.round(sum))         
                return;
            } else if(index == 4){
                // 持仓收益
                var sum = 0
                for(let i = 0; i < data.length; i++){
                    sum += data[i].pnl
                }
                sums[index] = toThousands(Math.round(sum))         
                return;              
            } else {        
                sums[index] = null
                return;
            }
            });

            return sums;
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,
     
    },
}
</script>