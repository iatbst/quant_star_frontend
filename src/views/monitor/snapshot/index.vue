<template>
  <div class="app-container" style="background-color: lightgray" align="center">
    <!----------------------------------- 查询Bar --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px;">
        <el-row style="margin-top: 20px">
            <el-col :span="7">
                <el-date-picker
                style="margin-top: 50px; margin-left: 7px"
                v-model="datetimeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </el-col>

            <el-col :span="6">
                <el-row style="margin-top: 50px">
                    <el-col :span="10" :offset="2">
                        <el-button style="width: 100%" type="primary" @click="searchSnapshots()">
                            查询
                        </el-button>                             
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        

        <div style="margin-top: 50px; margin-left: 50px; margin-right: 50px">
            <!----------------------------------- 快照对比summary --------------------------------------->
            <el-table
            :data="snapshotSummary"
            :header-cell-style="{background: '#e5e9f2'}"
            v-loading="snapshotSummaryLoading"
            >
                <el-table-column align="center" label="日期时间" min-width="20%">
                    <template slot-scope="scope">
                        {{ utcToLocalTimestamp(scope.row.datetime) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="快照时间" min-width="20%">
                    <template slot-scope="scope">
                        {{ utcToLocalTimestamp(scope.row.ts) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="BTC价格" min-width="20%">
                    <template slot-scope="scope">
                        {{ scope.row.prices['BTC/USDT'] }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="总资产($)" min-width="20%">
                    <template slot-scope="scope">
                        {{ toThousands(parseInt(scope.row.balances.total_balance)) }}
                        <span v-if="scope.row.balances.hasOwnProperty('diff_balance')">
                            (
                            <span style="color: green" v-if="scope.row.balances.diff_balance >= 0">
                                <i class="el-icon-top"></i>{{ toThousands(parseInt(scope.row.balances.diff_balance)) }}
                            </span>
                            <span style="color: red" v-else>
                                <i class="el-icon-bottom"></i>{{ toThousands(parseInt(scope.row.balances.diff_balance)) }}
                            </span>  
                            )                          
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="总仓位($)" min-width="20%">
                    <template slot-scope="scope">
                        <span style="color: green" v-if="scope.row.positions.total_position >= 0">
                            {{ toThousands(parseInt(scope.row.positions.total_position)) }}
                        </span>
                        <span style="color: red" v-else>
                            {{ toThousands(parseInt(scope.row.positions.total_position)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="USDT仓位($)" min-width="20%">
                    <template slot-scope="scope">
                        <span style="color: green" v-if="scope.row.positions.usdt_position >= 0">
                            {{ toThousands(parseInt(scope.row.positions.usdt_position)) }}
                        </span>
                        <span style="color: red" v-else>
                            {{ toThousands(parseInt(scope.row.positions.usdt_position)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="BTC仓位($)" min-width="20%">
                    <template slot-scope="scope">
                         <span style="color: green" v-if="scope.row.positions.btc_position >= 0">
                            {{ toThousands(parseInt(scope.row.positions.btc_position)) }}
                        </span>
                        <span style="color: red" v-else>
                            {{ toThousands(parseInt(scope.row.positions.btc_position)) }}
                        </span>
                    </template>
                </el-table-column>
            </el-table> 
        </div>

        <div style="margin-top: 50px; margin-left: 50px; margin-right: 50px">
            <!----------------------------------- 快照仓位对比详情 --------------------------------------->
            <el-table
            :data="snapshotSymbolPositionRows"
            :header-cell-style="{background: '#e5e9f2'}"
            v-loading="snapshotSymbolPositionsLoading"
            >
                <el-table-column align="center" label="标的" min-width="20%">
                    <template slot-scope="scope">
                        {{ scope.row.symbol }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="开始仓位($)" min-width="20%">
                    <template slot-scope="scope">
                         <span style="color: green" v-if="scope.row.start >= 0">
                            {{ toThousands(parseInt(scope.row.start)) }}
                        </span>
                        <span style="color: red" v-else>
                            {{ toThousands(parseInt(scope.row.start)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="结束仓位($)" min-width="20%">
                    <template slot-scope="scope">
                         <span style="color: green" v-if="scope.row.end >= 0">
                            {{ toThousands(parseInt(scope.row.end)) }}
                        </span>
                        <span style="color: red" v-else>
                            {{ toThousands(parseInt(scope.row.end)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="仓位变化($)" min-width="20%">
                    <template slot-scope="scope">
                         <span style="color: green" v-if="scope.row.diff >= 0">
                            {{ toThousands(parseInt(scope.row.diff)) }}
                        </span>
                        <span style="color: red" v-else>
                            {{ toThousands(parseInt(scope.row.diff)) }}
                        </span>
                    </template>
                </el-table-column>
            </el-table> 
            <div align="left" style="margin-top: 10px" v-if="allSymbolPositionsButton & snapshotSymbolPositionRows.length > 0">
                <el-button size="mini" type="primary" @click="showAllSymbolPositions()">显示全部仓位</el-button>
            </div>
            <div align="left" style="margin-top: 10px" v-if="topSymbolPositionsButton & snapshotSymbolPositionRows.length > 0">
                <el-button size="mini" type="primary" @click="showTopSymbolPositions()">显示前10仓位</el-button>
            </div>
        </div>

        <div style="margin-top: 50px; margin-left: 50px; margin-right: 50px; margin-bottom: 20px">
            <!----------------------------------- 订单详情 --------------------------------------->
            <el-table
            :data="orders"
            :header-cell-style="{background: '#e5e9f2'}"
            v-loading="ordersLoading"
            >
                <el-table-column align="center" label="时间" min-width="20%">
                    <template slot-scope="scope">
                        {{ utcToLocalTimestamp(scope.row.created_ts) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="交易所" min-width="20%">
                    <template slot-scope="scope">
                        {{ scope.row.worker.name.split('_')[0] }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="标的" min-width="20%">
                    <template slot-scope="scope">
                        {{ scope.row.symbol }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="策略ID" min-width="20%">
                    <template slot-scope="scope">
                        {{ scope.row.worker.name.slice(-1,) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="方向" min-width="20%">
                    <template slot-scope="scope">
                        <span v-if="scope.row.order_type === 'open'">
                            <i class="el-icon-top"></i>
                        </span>
                        <span v-else>
                            <i class="el-icon-bottom"></i>
                        </span>
                        {{ chineseString(scope.row.order_type) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="交易" min-width="20%">
                    <template slot-scope="scope">
                        <span style="color: red" v-if="scope.row.side === 'sell'">
                        {{ chineseString(scope.row.side) }}
                        </span>
                        <span style="color: green" v-else>
                        {{ chineseString(scope.row.side) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="数量" min-width="20%">
                    <template slot-scope="scope">
                        {{ scope.row.exec_size }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="价格" min-width="20%">
                    <template slot-scope="scope">
                        {{ toFixed(scope.row.exec_avg_price, 2) }}
                    </template>
                </el-table-column>

            </el-table> 
        </div>

    </div>
  </div>
</template>

<script>
import config from '@/configs/system_configs'
import { getSnapshotByDatetime } from '@/api/snapshot' 
import system_configs from '@/configs/system_configs'
import { utcToLocalTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { getOrders } from '@/api/order'
import { chineseString } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'


export default {
    data() {
        return {
            pfoHosts: config.pfoHosts,
            
            datetimeRange: [],
            snapshotSummary: [],
            orders: [],
            snapshotSymbolPositions: [],
            snapshotSymbolPositionRows: [],
            allSymbolPositionsButton: true,
            topSymbolPositionsButton: false,
            snapshotSummaryLoading: false,
            snapshotSymbolPositionsLoading: false,
            ordersLoading: false,

            snapshotStart: null,
            snapshotEnd: null,
        }
    },

    created() {

    },

    methods: {
        // 获取原始fee datas
        searchSnapshots(){
            if(this.datetimeRange.length == 2){
                this.snapshotStart = null
                this.snapshotEnd = null
                this.snapshotSummary = []
                this.snapshotSymbolPositions = []
                this.snapshotSymbolPositionRows = []
                this.orders = []
                this.orders = true
                this.snapshotSummaryLoading = true
                this.snapshotSymbolPositionsLoading = true
                var startDt = this.datetimeRange[0].toISOString().slice(0, 19).replace('T', ' ')    // UTC
                var endDt = this.datetimeRange[1].toISOString().slice(0, 19).replace('T', ' ')      // UTC
                getSnapshotByDatetime(startDt, 'system', system_configs.masterHost).then(response => {
                    if (response.results.length === 0){
                        alert('没有开始时间:' + utcToLocalTimestamp(startDt) + '对应的快照!')
                        this.snapshotSummaryLoading = false
                        this.snapshotSymbolPositionsLoading = false
                    } else {
                        this.snapshotStart = response.results[0]
                        getSnapshotByDatetime(endDt, 'system', system_configs.masterHost).then(response => {
                            if (response.results.length === 0){
                                alert('没有结束时间:' + utcToLocalTimestamp(endDt) + '对应的快照!')
                                this.snapshotSummaryLoading = false
                                this.snapshotSymbolPositionsLoading = false                            
                            } else {
                                // 搜索成功
                                this.snapshotEnd = response.results[0]

                                // Summary Table
                                this.snapshotEnd.balances['diff_balance'] = this.snapshotEnd.balances.total_balance - this.snapshotStart.balances.total_balance
                                this.snapshotStart.positions['total_position'] = this.snapshotStart.positions.usdt_long + this.snapshotStart.positions.usdt_short + this.snapshotStart.positions.btc_long + this.snapshotStart.positions.btc_short
                                this.snapshotEnd.positions['total_position'] = this.snapshotEnd.positions.usdt_long + this.snapshotEnd.positions.usdt_short + this.snapshotEnd.positions.btc_long + this.snapshotEnd.positions.btc_short
                                this.snapshotStart.positions['usdt_position'] = this.snapshotStart.positions.usdt_long + this.snapshotStart.positions.usdt_short
                                this.snapshotEnd.positions['usdt_position'] = this.snapshotEnd.positions.usdt_long + this.snapshotEnd.positions.usdt_short
                                this.snapshotStart.positions['btc_position'] = this.snapshotStart.positions.btc_long + this.snapshotStart.positions.btc_short
                                this.snapshotEnd.positions['btc_position'] = this.snapshotEnd.positions.btc_long + this.snapshotEnd.positions.btc_short
                                this.snapshotSummary.push(this.snapshotStart)
                                this.snapshotSummary.push(this.snapshotEnd)

                                // Symbol Positions Table
                                for(let symbol in this.snapshotStart.positions.symbol_positions){
                                    var data = {
                                        symbol: symbol,
                                        start: this.snapshotStart.positions.symbol_positions[symbol],
                                        end: this.snapshotEnd.positions.symbol_positions[symbol],
                                    }
                                    if (this.snapshotEnd.positions.symbol_positions.hasOwnProperty(symbol)){
                                        data['diff'] = this.snapshotEnd.positions.symbol_positions[symbol] - this.snapshotStart.positions.symbol_positions[symbol]
                                    } else {
                                        // symbol 在Star Snapshot中存在;在End Snapshot中不存在
                                        data['diff'] = -this.snapshotStart.positions.symbol_positions[symbol]
                                    }
                                    this.snapshotSymbolPositions.push(data)
                                }
                                for(let symbol in this.snapshotEnd.positions.symbol_positions){
                                    if (!this.snapshotStart.positions.symbol_positions.hasOwnProperty(symbol)){
                                        // symbol 在End Snapshot中存在;在Start Snapshot中不存在
                                        this.snapshotSymbolPositions.push({
                                            symbol: symbol,
                                            start: null,
                                            end: this.snapshotEnd.positions.symbol_positions[symbol],
                                            diff: this.snapshotEnd.positions.symbol_positions[symbol],
                                        })
                                    }
                                }
                                this.snapshotSymbolPositions.sort((a, b) => Math.abs(Number(b.start)) - Math.abs(Number(a.start)))  // 排序: 大仓位在前
                                this.snapshotSymbolPositionRows = this.snapshotSymbolPositions.slice(0, 10)
                                this.snapshotSummaryLoading = false
                                this.snapshotSymbolPositionsLoading = false   
                                
                                // Orders
                                this.searchOrders(startDt, endDt)
                            }
                        })
                    }
                })
            } else {
                alert('请选择开始/结束日期时间!')
                this.snapshotSummaryLoading = false
                this.snapshotSymbolPositionsLoading = false
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
                        this.orders = this.orders.concat(response.results)
                        if (count === this.pfoHosts.length ){
                            // 排序
                            this.orders.sort((a, b) => a.created_ts - b.created_ts)
                            this.ordersLoading = false
                        }
                    }
                )
            }
        },

        showAllSymbolPositions(){
            this.allSymbolPositionsButton = false
            this.topSymbolPositionsButton = true
            this.snapshotSymbolPositionRows = this.snapshotSymbolPositions
        },

        showTopSymbolPositions(){
            this.allSymbolPositionsButton = true
            this.topSymbolPositionsButton = false
            this.snapshotSymbolPositionRows = this.snapshotSymbolPositions.slice(0, 10)
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,
     
    },
}
</script>