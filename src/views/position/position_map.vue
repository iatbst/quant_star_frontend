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
                            {{ productVolumes[scope.row] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" :label="'策略' + tag + '仓位($)'" v-bind:key="tag" v-for="tag in tagList">
                        <template slot-scope="scope">
                            <div style="cursor: pointer;" @click="showSignalPoints(positionList[scope.row].host, positionList[scope.row].worker[tag])">
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

            <!-- Diaglog: SignalPoints -->
            <el-dialog title="" :visible.sync="dialogSpVisible" width="60%" >
            <!-- 指定worker的runs -->
            <signal-points 
            v-bind:signal-points="signalPoints"
            v-bind:current-worker="currentWorker"
            v-bind:current-pfo="currentPfo"
            v-bind:signal-points-loading="signalPointsLoading"
            ></signal-points>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {toThousands} from '@/utils/general'
import signalPoints from '@/views/signal_point/_worker_sps'
import { getSignalPointsByWorker } from '@/api/signal_point'


export default {
    components: {
        signalPoints,
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

        productVolumes: {
           type: Object,
           default: {} 
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
            dialogSpVisible: false,

            signalPoints: null,
            signalPointsLoading: false,
            currentWorker: null,
            currentPfo: null,

            positionList: null,
            tagList: [
                '1',
                '2',
                '3',
                '4',
                '5'
            ]
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
        showSignalPoints(host, worker){
            this.dialogSpVisible = true
            this.signalPointsLoading = true
            this.currentPfo = {host: host}
            this.currentWorker = worker
            getSignalPointsByWorker(worker, this.currentPfo.host).then(response => {
                this.signalPoints = response.results
                this.signalPointsLoading = false
            })
        },

        toThousands: toThousands,
    }
}
</script>