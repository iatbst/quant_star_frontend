<template>
  <div class="app-container" style="background-color: lightgray" align="center">
    <div style="background-color: white; margin-bottom: 20px;">
        <!----------------------------------- 查询Bar --------------------------------------->
        <div>
            <el-row style="margin-top: 20px">
                <el-col :span="7">
                    <el-date-picker
                    style="margin-top: 50px; margin-left: 50px"
                    v-model="datetimeRange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>

                <el-col :span="2">
                    <el-row style="margin-top: 50px; margin-left: 0px">
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
                    <el-row style="margin-top: 50px; margin-left: 20px">
                        <el-input
                            v-model="orderFilter.symbol"
                            placeholder="标的"
                        ></el-input> 
                    </el-row>      
                </el-col>

                <el-col :span="2">
                    <el-row style="margin-top: 50px; margin-left: 20px">
                    <el-select v-model="orderFilter.strategy" placeholder="策略">
                        <el-option
                        v-for="item in ['any'].concat(config.strategies)"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>  
                    </el-row>      
                </el-col>

                <el-col :span="2">
                    <el-row style="margin-top: 50px; margin-left: 20px">
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
                    <el-row style="margin-top: 50px; margin-left: 20px">
                    <el-select v-model="orderFilter.order_type" placeholder="类型">
                        <el-option
                        v-for="item in ['any', 'open', 'close', 'temp']"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>  
                    </el-row>      
                </el-col>

                <el-col :span="5">
                    <el-row style="margin-top: 50px; margin-left: 20px">
                        <el-col :span="10" :offset="2">
                            <el-button style="width: 100%" type="primary" @click="search()">
                                查询
                            </el-button>                             
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>

        <orders 
        v-bind:orders="orders" 
        v-bind:orders-loading="ordersLoading"
        style="margin-bottom: 0px">
        </orders>

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
import orders from '@/views/orders/_orders'
import config from '@/configs/system_configs'
import { utcToLocalTimestamp, calSlippage } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { getOrders } from '@/api/order'
import { chineseString } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'


export default {
    components: {
        orders
    },

    data() {
        return {
            pfoHosts: config.pfoHosts,
            
            datetimeRange: [],
            orders: [],
            allSymbolPositionsButton: true,
            topSymbolPositionsButton: false,
            snapshotSummaryLoading: false,
            snapshotSymbolPositionsLoading: false,
            ordersLoading: false,
            allOrdersButton: true,
            latestOrdersButton: false,

            snapshotStart: null,
            snapshotEnd: null,

            strategyAlias: config.strategyAlias,

            orderFilter: {
                'exchange': null,
                'symbol': null,
                'strategy': null,
                'strategy_id': null,
                'order_type': null
            },
            strategy_ids: ['1', '2', '3', '4'],  

            config: config,
        }
    },

    created() {
        this.orders = []
        this.ordersLoading = true
        var days = 7    // 默认展示最近7天
        var startDt = new Date(Date.now() - 24 * 3600 * 1000 * days).toISOString().slice(0, 19).replace('T', ' ')    // UTC
        var endDt = new Date().toISOString().slice(0, 19).replace('T', ' ')      // UTC
        this.searchOrders(startDt, endDt)
    },

    methods: {
        // 获取原始datas
        search(){
            if(this.datetimeRange.length == 2){
                this.orders = []
                this.ordersLoading = true
                var startDt = this.datetimeRange[0].toISOString().slice(0, 19).replace('T', ' ')    // UTC
                var endDt = this.datetimeRange[1].toISOString().slice(0, 19).replace('T', ' ')      // UTC
                this.searchOrders(startDt, endDt)
            } else {
                alert('请选择开始/结束日期时间!')
            }
        },

        // 搜索指定时间范围内的订单
        searchOrders(startDt, endDt){
            this.orders = []
            this.ordersLoading = true
            var count = 0
            for(var i = 0; i < this.pfoHosts.length; i++){
                var filters = 'show_worker=true&no_parent_order=true&exec_size__gt=0&created_ts__gte=' + startDt + '&created_ts__lte=' + endDt
                getOrders(this.pfoHosts[i], null, filters).then(response => {
                        count += 1
                        // this.orders = this.orders.concat(response.results)

                        // 过滤
                        var _orders = []
                        for(var i = 0; i < response.results.length; i++){
                            if (this.filterOrder(response.results[i])){
                                _orders.push(response.results[i])
                            }
                        }
                        this.orders = this.orders.concat(_orders)

                        if (count === this.pfoHosts.length){
                            // 排序
                            this.orders.sort((a, b) => b.created_ts.localeCompare(a.created_ts))
                            for(let i =0; i < this.orders.length; i++){
                                this.orders[i]['slippage'] = calSlippage(this.orders[i])
                            }
                            this.ordersLoading = false
                        }
                    }
                )
            }
        },

        filterOrder(order){
            var exchange = order.worker.name.split('_')[0]
            var symbol = order.symbol
            var strategy = config.strategyAlias[order.worker.name.split('_').slice(-1)[0].slice(0,-1)]
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

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,
     
    },
}
</script>