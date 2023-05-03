<template>
    <div class="app-container" align="center" >
        <div style="width: 95%; margin-top: 20px">
            <el-row :gutter="0" type="flex">
                <!-- Positions -->
                <el-table
                    :data="Object.keys(positionList).sort()"
                    style="width: 95%; margin-bottom: 20px; margin-top: 45px"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    border
                    v-loading="positionsLoading"
                    cell-style="padding:0px"
                >
                    <el-table-column align="center" prop="name"  label="币种">
                        <template slot-scope="scope">
                            {{ scope.row.split('_')[2].split('/')[0].toUpperCase() }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" prop="name"  label="币基">
                        <template slot-scope="scope">
                            {{ scope.row.split('_')[2].split('/')[1].toUpperCase()  }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" prop="name"  label="交易所">
                        <template slot-scope="scope">
                            {{ scope.row.split('_')[0] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" prop="name"  label="风险权重">
                        <template slot-scope="scope">
                            {{ symbolWeights[scope.row.split('_')[0]][scope.row.split('_')[2].toUpperCase()] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" :label="'策略' + tag + '仓位($)'" v-bind:key="tag" v-for="tag in tagList">
                        <template slot-scope="scope">
                            <div style="cursor: pointer;" @click="showWorkerTrades(positionList[scope.row].host, positionList[scope.row].worker[tag])">
                                <span style="color: green" v-if="positionList[scope.row].size[tag] > 0">
                                    {{ toThousands(positionList[scope.row].size[tag]) }}
                                </span>
                                <span style="color: red" v-else-if="positionList[scope.row].size[tag] < 0">
                                    {{ toThousands(positionList[scope.row].size[tag]) }}
                                </span>
                                <span v-else>
                                    {{ positionList[scope.row].size[tag] }}
                                </span>  
                            </div>                  
                        </template>               
                    </el-table-column>
                </el-table>
            </el-row>

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
            currentPfo: null,

            workerTrades: null,
            dialogWorkerTradesVisible: false,
            workerTradesLoading: false,

            positionList: null,
            tagList: [
                '1',
                '2',
                '3',
                '4'
            ],

            // 临时设置symbol的weights(临时解决方案)
            symbolWeights:{
                'binance':{
                    "BTC/USDT": 18,
                    "ETH/USDT": 6,

                    "SOL/USDT": 3,
                    "DOGE/USDT": 3,
                    "XRP/USDT": 3,
                    "BNB/USDT": 3,
                    "GALA/USDT": 3,
                    "OP/USDT": 3,
                    "ETC/USDT": 3,
                    "MATIC/USDT": 3,

                    "DOT/USDT": 1,
                    "FTM/USDT": 1,
                    "AXS/USDT": 1,
                    "ADA/USDT": 1,
                    "AVAX/USDT": 1,
                    "LTC/USDT": 1,
                    "LINK/USDT": 1,
                    "DYDX/USDT": 1,
                    "FIL/USDT": 1,
                    "EOS/USDT": 1,
                    "ATOM/USDT": 1,
                    "CHZ/USDT": 1,
                    "CRV/USDT": 1,
                    "BCH/USDT": 1,
                    "NEAR/USDT": 1,
                    "GRT/USDT": 1,
                    "MASK/USDT": 1,
                    "WAVES/USDT": 1,
                    "GMT/USDT": 1,
                    "APE/USDT": 1,
                    "MANA/USDT": 1,
                    "SAND/USDT": 1
                }, 
                'okex':{
                    "BTC/USDT": 18,
                    "ETH/USDT": 6,

                    "SOL/USDT": 3,
                    "DOGE/USDT": 3,
                    "LTC/USDT": 3,
                    "GALA/USDT": 3,
                    "OP/USDT": 3,
                    "ETC/USDT": 3,
                    "DYDX/USDT": 3,
                    "FIL/USDT": 3,

                    "MATIC/USDT": 1,
                    "SHIB/USDT": 1,
                    "XRP/USDT": 1,
                    "DOT/USDT": 1,
                    "FTM/USDT": 1,
                    "AXS/USDT": 1,
                    "ADA/USDT": 1,
                    "AVAX/USDT": 1,
                    "LINK/USDT": 1,
                    "EOS/USDT": 1,
                    "ATOM/USDT": 1,
                    "CHZ/USDT": 1,
                    "CRV/USDT": 1,
                    "BCH/USDT": 1,
                    "NEAR/USDT": 1,
                    "GRT/USDT": 1,
                    "MASK/USDT": 1,
                    "WAVES/USDT": 1,
                    "GMT/USDT": 1,
                    "APE/USDT": 1,
                    "MANA/USDT": 1,
                    "SAND/USDT": 1
                }
            }
        }
    },

    created() {
        // 初始化
        this.positionList = {}

        // 分析Data
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData() {  
            for(var i = 0; i < this.positions.length; i++){
                var workerName = this.positions[i].worker.name
                var workerGroup = workerName.split('_').slice(0, -1).join('_')
                var posTag = workerName[workerName.length-1]
                var posSize = Math.round(this.positions[i].usdt_size)
                // if (workerGroup.indexOf('margin') != -1){
                //     // Margin需要省略小数点后尾数
                //     var baseSymbol = workerGroup.split('_').slice(-1)[0].split('/')[0].toUpperCase()
                //     if (baseSymbol in config.assetRoundLevel){
                //         posSize = posSize.toFixed(config.assetRoundLevel[baseSymbol])
                //     }
                // }
                if (!(workerGroup in this.positionList)){
                    this.positionList[workerGroup] = {
                        size: {}, 
                        worker: {},
                        host: this.positions[i].host}
                }
                this.positionList[workerGroup].size[posTag] = posSize
                this.positionList[workerGroup].worker[posTag] = this.positions[i].worker
            }
            // this.positionLoading = false
        },

        // 通过Dialog展示signalPoints(注意, worker只包含id和name)
        // showSignalPoints(host, worker){
        //     this.dialogSpVisible = true
        //     this.signalPointsLoading = true
        //     this.currentPfo = {host: host}
        //     this.currentWorker = worker
        //     getSignalPointsByWorker(worker, this.currentPfo.host).then(response => {
        //         this.signalPoints = response.results
        //         this.signalPointsLoading = false
        //     })
        // },

        // 通过Dialog展示signalPoints(注意, worker只包含id和name)
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