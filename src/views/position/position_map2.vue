<template>
    <div class="app-container" align="center" >
        <div style="width: 95%; margin-top: 0px">
            <h4 style="font-weight: normal;">
                {{ exchange }} {{ strategy }}
            </h4>
            <div v-for="rowData in positionList2">
                <!-- 表1: coins -->
                <el-row :gutter="0" type="flex">
                    <el-table
                        :data="[rowData]"
                        :cell-style="{ background: '#f2f2f2' }"
                        :row-style="{ background: '#f2f2f2' }"
                        :show-header="false"
                        border
                        v-loading="positionsLoading"
                    >
                        <el-table-column align="center" v-for="col in Object.keys(rowData).sort()">
                            <template slot-scope="scope">
                                {{ scope.row[col].coin.toUpperCase() }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>

                <!-- 表2: positions -->
                <el-row :gutter="0" type="flex">
                    <el-table
                        :data="[rowData]"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        :show-header="false"
                        border
                        v-loading="positionsLoading"
                    >
                        <el-table-column align="center" v-for="col in Object.keys(rowData).sort()">
                            <template slot-scope="scope">
                                <el-row :gutter="0" type="flex">
                                    <el-col v-for="data in scope.row[col].positions">
                                        <span style="cursor: pointer;" @click="showWorkerTrades(data.host, {id: data.worker_id, name: data.worker_name})">
                                            <span v-if="data.position == 0">
                                                {{ data.position }}
                                            </span>
                                            <span style="color: green" v-else-if="data.position > 0">
                                                {{ toThousands((data.position/1000).toFixed(1))}}
                                            </span> 
                                             <span style="color: red" v-else>
                                                {{ toThousands((data.position/1000).toFixed(1))}}
                                            </span>                                                                                  
                                        </span>
                                    </el-col>
                                </el-row>
                                
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>               
            </div>

            <el-dialog title="" :visible.sync="dialogWorkerTradesVisible" width="60%" >
                <!-- 指定worker的runs -->
                <trades 
                    v-bind:trades="workerTrades"
                    v-bind:current-worker="currentWorker"
                    v-bind:current-pfo="currentPfo"
                    v-bind:trades-loading="workerTradesLoading"
                ></trades>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {toThousands} from '@/utils/general'
import trades from '@/views/trade/_worker_trades'
import { getTradesByWorker } from '@/api/trade'
import config from '@/configs/system_configs'


export default {
    components: {
        trades,
    },
    
    props: {
        positions: {
            type:Array,
            default:[]
        },

        positionsLoading: {
            type: Boolean,
            default: false
        },

        exchange: {
            type: String,
            default: ''
        },

        strategy: {
            type: String,
            default: ''
        },

        colCount: {
            type: Number,
            default: 5
        },

        showZero: {
            type: Boolean,
            default: true
        },

        sortCoin: {
            type: Boolean,
            default: false
        },

        sortCoinWeights: {
            type: Object,
            default: {}
        },
    },

    watch: {
        positions: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        }
    },

    data() {
        return {

            currentWorker: null,
            currentPfo: {host: this.host},

            workerTrades: null,
            dialogWorkerTradesVisible: false,
            workerTradesLoading: false,

            // 转化1
            positionList1: null,
            // 转化2
            positionList2: null,

            // 一行展示几个symbol
            // colCount: 5,

        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData() {  
            // 初始化
            this.positionList1 = {}
            this.positionList2 = []

            // 转化1 -> positionList1
            for(var i = 0; i < this.positions.length; i++){
                var workerName = this.positions[i].worker.name
                var workerId = this.positions[i].worker.id
                var host = this.positions[i].host
                var strategyId = workerName.slice(-1,)   // worker名称最后一位是strategyId
                var coin = workerName.split('/')[0].split('_').slice(-1,)[0]
                // var posTag = workerName[workerName.length-1]
                var posSize = Math.round(this.positions[i].usdt_size)
                // var alias = workerName.split('_').slice(-1)[0].slice(0, -1)
                if (!(coin in this.positionList1)){
                    this.positionList1[coin] = []
                }
                this.positionList1[coin].push({
                    strategy_id: strategyId,
                    position: posSize,
                    host: host,
                    worker_id: workerId,
                    worker_name: workerName
                })
            }

            // 过滤掉子策略仓位都是0的币
            if (!this.showZero){
                for(let coin in this.positionList1){
                    var posSum = 0
                    for(const data of this.positionList1[coin]){
                        posSum += data.position
                    }
                    if (posSum == 0){
                        // 删除
                        delete this.positionList1[coin]
                    }
                }
            }

            // 确定coin顺序
            if (this.sortCoin){
                var weightedCoins = []
                for(const coin of Object.keys(this.positionList1)){
                    if(coin in this.sortCoinWeights){
                        weightedCoins.push({
                            coin: coin,
                            weight: this.sortCoinWeights[coin]
                        })
                    } else {
                        weightedCoins.push({
                            coin: coin,
                            weight: 0
                        })                       
                    }
                }
                weightedCoins.sort((a, b)=> b.weight - a.weight)
                var coins = []
                for(const data of weightedCoins){
                    coins.push(data.coin)
                }
            } else {
                var coins = Object.keys(this.positionList1).sort()
            }

            // 转化2 -> positionList2
            var currentRow = {}
            var count = 1
            for (const coin of coins){
                if (count<10){
                    var colKey = 'col0' + count
                } else {
                    var colKey = 'col' + count
                }
                currentRow[colKey] = {
                    coin: coin,
                    positions: this.positionList1[coin].sort((a, b)=>a.strategy_id - b.strategy_id)
                }
                if (Object.keys(currentRow).length == this.colCount){
                    this.positionList2.push(currentRow)
                    currentRow = {}
                    count = 1
                } else {
                    count += 1
                }
            }
            if (Object.keys(currentRow).length > 0){
                // 按照colCount行补齐
                var colIx = Object.keys(currentRow).length
                var len = Object.keys(currentRow).length
                for(var i=0; i < this.colCount - len; i++){
                    colIx += 1
                    if (colIx<10){
                        var colKey = 'col0' + colIx
                    } else {
                        var colKey = 'col' + colIx
                    }
                    currentRow[colKey] = {
                        coin: '',
                        position: null
                    }
                }
                // debugger
                this.positionList2.push(currentRow)
            }
            // debugger
        },

        // 通过Dialog展示trades(注意, worker只包含id和name)
        showWorkerTrades(host, worker){
            this.dialogWorkerTradesVisible = true
            this.workerTradesLoading = true
            this.currentPfo = {host: host}
            this.currentWorker = worker
            getTradesByWorker(worker, this.currentPfo.host).then(response => {
                this.workerTrades = response.results
                this.workerTradesLoading = false
            })
        },

        toThousands: toThousands,
    }
}
</script>