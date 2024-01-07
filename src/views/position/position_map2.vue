<template>
    <div class="app-container" align="center" >
        <div style="width: 95%; margin-top: 0px">
            <span>
                {{ exchange }} {{ strategy }}
            </span>
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
                        cell-style="padding:0px"
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
                        cell-style="padding:0px"
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
                                                <b>{{ toThousands((data.position/1000).toFixed(2))}}</b>
                                            </span> 
                                             <span style="color: red" v-else>
                                                <b>{{ toThousands((data.position/1000).toFixed(2))}}</b>
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
        }

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
            // debugger

            // 转化2 -> positionList2
            var currentRow = {}
            var count = 1
            for (const coin of Object.keys(this.positionList1).sort()){
                currentRow['col' + count] = {
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