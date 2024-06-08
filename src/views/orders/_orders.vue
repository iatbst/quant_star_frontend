<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div class="app-container" align="center" >
        <div style="margin-top: 0px">
            <el-row :gutter="0" type="flex" style="margin-bottom: 10px">
                <!----------------------------------- 查询Bar --------------------------------------->
                        <el-col :span="7">
                            <el-date-picker
                            style="margin-left: 50px"
                            v-model="datetimeRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                            </el-date-picker>
                        </el-col>

                        <el-col :span="2">
                            <el-row style="margin-left: 20px">
                            <el-select v-model="orderFilter.exchange" placeholder="交易所">
                                <el-option
                                v-for="item in ['any'].concat(config.exchanges)"
                                :key="item"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>  
                            </el-row>      
                        </el-col>

                        <el-col :span="2">
                            <el-row style="margin-left: 20px">
                                <el-input
                                    v-model="orderFilter.symbol"
                                    placeholder="标的"
                                ></el-input> 
                            </el-row>      
                        </el-col>

                        <el-col :span="3">
                            <el-row style="margin-left: 20px">
                            <el-select v-model="orderFilter.strategy" placeholder="策略">
                                <el-option
                                v-for="item in ['any'].concat(config.strategies)"
                                :key="item"
                                :label="config.strategyAlias[item]"
                                :value="item">
                                </el-option>
                            </el-select>  
                            </el-row>      
                        </el-col>

                        <el-col :span="2">
                            <el-row style="margin-left: 20px">
                            <el-select v-model="orderFilter.strategy_id" placeholder="策略ID">
                                <el-option
                                v-for="item in ['any'].concat(strategy_ids)"
                                :key="item"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>  
                            </el-row>      
                        </el-col>

                        <el-col :span="2">
                            <el-row style="margin-left: 20px">
                            <el-select v-model="orderFilter.order_type" placeholder="类型">
                                <el-option
                                v-for="item in order_types"
                                :key="item"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>  
                            </el-row>      
                        </el-col>

                        <el-col :span="5">
                            <el-row style="margin-left: 20px">
                                <el-col :span="10" :offset="2">
                                    <el-button style="width: 100%" type="primary" @click="search()">
                                        查询
                                    </el-button>                             
                                </el-col>
                            </el-row>
                        </el-col>
            </el-row>
            <el-row :gutter="0" type="flex">
                <!----------------------------------- 订单详情 --------------------------------------->
                <el-table
                :data="orders"
                :header-cell-style="{ background: '#f2f2f2' }"
                @row-click="clickOrder"
                v-loading="ordersLoading"
                :cell-style="{cursor: 'pointer'}"
                >
                    <el-table-column align="center" label="时间" min-width="10%">
                        <template slot-scope="scope">
                            {{ utcToLocalTimestamp(scope.row.exec_ts) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易所" min-width="5%">
                        <template slot-scope="scope">
                            {{ scope.row.worker.name.split('_')[0] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="标的" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.symbol }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="策略" min-width="5%">
                        <template slot-scope="scope">
                            {{ strategyAlias.hasOwnProperty(scope.row.worker.name.split('_').slice(-2, -1)[0]) ? strategyAlias[scope.row.worker.name.split('_').slice(-2, -1)[0]] : '大' }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="策略ID" min-width="5%">
                        <template slot-scope="scope">
                            {{ scope.row.order_type == 'temp' ? 'N/A' : scope.row.worker.name.slice(-1,) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="类型" min-width="8%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.order_type === 'open'">
                                <b>
                                    <i class="el-icon-top"></i>
                                    {{ chineseString(scope.row.order_type) }}                                
                                </b>
                            </span>
                            <span v-else>
                                {{ chineseString(scope.row.order_type) }}
                                <span v-if="scope.row.flags.exit_ratio && scope.row.flags.exit_ratio != 0">
                                    ({{ scope.row.flags.exit_ratio*100 }}%)
                                </span>
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易" min-width="5%">
                        <template slot-scope="scope">
                            <span style="color: red" v-if="scope.row.side === 'sell'">
                            {{ chineseString(scope.row.side) }}
                            </span>
                            <span style="color: green" v-else>
                            {{ chineseString(scope.row.side) }}
                            </span>
                        </template>
                    </el-table-column>


                    <!--
                    <el-table-column align="center" label="状态" min-width="8%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status === 'completed'">
                            {{ chineseString(scope.row.status) }}
                            </span>
                            <span style="color: red" v-else>
                            {{ chineseString(scope.row.status) }}({{ (scope.row.exec_size*100/scope.row.size).toFixed(0) }}%)
                            </span>
                        </template>
                    </el-table-column>
                    -->

                    <el-table-column align="center" label="成交额" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.volume !== null">
                                {{ toThousands(Math.round(scope.row.volume)) }}
                                <el-tooltip placement="top-start" align="left" effect="dark" v-if="scope.row.order_type === 'open'">
                                    <div slot="content">
                                        <li v-for="(value, key) in scope.row.size_data">
                                            <span style="font-size: 15px">{{ key }}: {{ value}}</span>
                                        </li>
                                    </div>
                                    <span style="color: lightgray; font-size: 15px"><i class="el-icon-question"></i></span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="期望价格" min-width="10%">
                        <template slot-scope="scope">
                            {{ toFixed(scope.row.price, 2) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="成交均价" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.exec_avg_price !== null">
                                {{ toFixed(scope.row.exec_avg_price, 2) }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="收益" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.pnl !== null">
                                <span style="color: red" v-if="scope.row.pnl < 0">
                                {{ scope.row.pnl.toFixed(2) }}({{ (scope.row.pnl_ptg*100).toFixed(2) }}%)
                                </span>
                                <span style="color: green" v-else>
                                {{ scope.row.pnl.toFixed(2) }}({{ (scope.row.pnl_ptg*100).toFixed(2) }}%)
                                </span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="滑点" min-width="5%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.slippage !== null">
                                <span style="color: red" v-if="scope.row.slippage < 0">
                                {{ (scope.row.slippage*100).toFixed(2) }}%
                                </span>
                                <span style="color: green" v-else>
                                {{ (scope.row.slippage*100).toFixed(2) }}%
                                </span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="延迟(秒)" min-width="5%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.signal_delay !== null">
                                <span style="color: red" v-if="scope.row.signal_delay >= 5">
                                {{ scope.row.signal_delay.toFixed(2) }}
                                </span>
                                <span style="" v-else>
                                {{ scope.row.signal_delay.toFixed(2) }}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table> 

                <!-- Diaglog: Trade -->
                <el-dialog title="" :visible.sync="dialogTradeVisible"  width="80%" append-to-body>
                    <div style="background-color: white; margin-bottom: 10px; margin-top: -20px">
                        <!-- 仓位详情 -->
                        <trade-orders 
                        v-bind:trade="trade"
                        v-bind:orders-loading="tradeOrdersLoading"
                        v-if="tradeAvailable" 
                        ></trade-orders>
                    </div>
                </el-dialog>
            </el-row>
        </div>
    </div>
</template>

<script>
import tradeOrders from '@/views/orders/_trade_orders'
import config from '@/configs/system_configs'
import { utcToLocalTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { chineseString } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'
import { getTradeById } from '@/api/trade'
import { getOrders } from '@/api/order'


export default {
    components: {
        tradeOrders,
    },

    props: {
        orders: {
            type:Array,
            default:[]
        },
        ordersLoading: {
            type: Boolean,
            default: true
        }
    },

    // watch: {

    // },

    data() {
        return {
            strategyAlias: config.strategyAlias, 
            config: config,
            pfoHosts: config.pfoHosts,

            dialogTradeVisible: false,
            tradeOrdersLoading: false,
            trade: null,
            tradeAvailable: false,

            datetimeRange: [],
            orderFilter: {
                'exchange': null,
                'symbol': null,
                'strategy': null,
                'strategy_id': null,
                'order_type': null
            },
            strategy_ids: ['1', '2', '3', '4', '5', '6'],  
            order_types: ['any', 'open', 'win_stop', 'timer', 'flip', 'lose_stop'],

        }
    },

    methods: {
        // 获取原始datas
        search(){
            if(this.datetimeRange.length == 2){
                var startDt = this.datetimeRange[0].toISOString().slice(0, 19).replace('T', ' ')    // UTC
                var endDt = this.datetimeRange[1].toISOString().slice(0, 19).replace('T', ' ')      // UTC
            } else {
                var days = 1    // 默认展示最近24H
                var startDt = new Date(Date.now() - 24 * 3600 * 1000 * days).toISOString().slice(0, 19).replace('T', ' ')    // UTC
                var endDt = new Date().toISOString().slice(0, 19).replace('T', ' ')      // UTC                   
            }
            this.searchOrders(startDt, endDt)
        },

        // 搜索指定时间范围内的订单
        searchOrders(startDt, endDt){
            this.orders = []
            this.ordersLoading = true
            var count = 0
            for(var i = 0; i < this.pfoHosts.length; i++){
                var filters = 'show_worker=true&no_parent_order=true&exec_size__gt=0&exec_ts__gte=' + startDt + '&exec_ts__lte=' + endDt
                getOrders(this.pfoHosts[i], null, filters).then(response => {
                        count += 1
                        // this.orders = this.orders.concat(response.results)

                        // 过滤
                        var _orders = []
                        for(var i = 0; i < response.results.length; i++){
                            if (this.filterOrder(response.results[i])){
                                response.results[i]["host"] = response.config.baseURL   // 添加host
                                _orders.push(response.results[i])
                            }
                        }
                        this.orders = this.orders.concat(_orders)

                        if (count === this.pfoHosts.length){
                            // 排序
                            this.orders.sort((a, b) => b.exec_ts.localeCompare(a.exec_ts))
                            this.ordersLoading = false
                        }
                    }
                )
            }
        },

        filterOrder(order){
            var exchange = order.worker.name.split('_')[0]
            var symbol = order.symbol
            var strategy = order.worker.strategy_name
            var strategy_id = order.worker.name.slice(-1,)
            var order_type = order.order_type
            if (this.orderFilter.exchange && this.orderFilter.exchange != 'any' && exchange != this.orderFilter.exchange){
                return false
            } else if (this.orderFilter.strategy && this.orderFilter.strategy != 'any' && strategy != this.orderFilter.strategy){
                return false
            } else if (this.orderFilter.symbol && !symbol.includes(this.orderFilter.symbol.toUpperCase())){
                return false
            } else if (this.orderFilter.strategy_id && this.orderFilter.strategy_id != 'any' && strategy_id != this.orderFilter.strategy_id){
                return false
            } else if (this.orderFilter.order_type && this.orderFilter.order_type != 'any' && order_type != this.orderFilter.order_type){
                return false
            } else {
                // 通过
                return true
            }
        },

        //点击order
        clickOrder(row, ix){
            this.tradeAvailable = false
            this.tradeOrdersLoading = true
            this.dialogTradeVisible = true
            this.fetchTrade(row.trade, row.host)
        },

        // 获取order对应的trade
        fetchTrade(id, host) {
            console.log(id)
            console.log(host)
            getTradeById(id, host).then(response => {
                this.trade = response.results[0]
                this.tradeOrdersLoading = false
                this.tradeAvailable = true
            })
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,

    }
}
</script>