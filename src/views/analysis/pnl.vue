<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div class="app-container" align="center" >
        <div style="width: 90%; margin-top: 0px">
            <el-row :gutter="0" type="flex" style="margin-bottom: 10px">
                <!----------------------------------- 查询Bar --------------------------------------->
                <el-col :span="7" align="left">
                    <el-date-picker
                    style="margin-left: 50px"
                    v-model="datetimeRange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
                    </el-date-picker>
                </el-col>

                <el-col :span="6" align="left">
                    <el-row style="margin-left: 20px">
                        <el-col :span="12" :offset="0">
                            <el-button style="width: 100%" type="primary" @click="search()">
                                查询
                            </el-button>                             
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <el-row :gutter="0" type="flex">
                <!----------------------------------- 分组pnl --------------------------------------->
                <el-table
                :data="pnlDatas"
                :header-cell-style="{ background: '#f2f2f2' }"
                @row-click="clickGroupPnl"
                v-loading="pnlDatasLoading"
                :cell-style="{cursor: 'pointer'}"
                show-summary
                :summary-method="getSummaries"
                >

                    <el-table-column align="center" label="交易所" min-width="25%">
                        <template slot-scope="scope">
                            {{ scope.row.exchange }}
                        </template>
                    </el-table-column>


                    <el-table-column align="center" label="策略" min-width="25%">
                        <template slot-scope="scope">
                            {{ strategyAlias[scope.row.strategy] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="策略ID" min-width="25%">
                        <template slot-scope="scope">
                            {{ scope.row.strategyID }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="收益" min-width="25%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.pnl !== null">
                                <span style="color: red" v-if="scope.row.pnl < 0">
                                {{ Number(scope.row.pnl.toFixed(0)) }}
                                </span>
                                <span style="color: green" v-else>
                                {{ Number(scope.row.pnl.toFixed(0)) }}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table> 

                <!-- Diaglog: workerPnls -->
                <el-dialog title="" :visible.sync="dialogWorkerPnlsVisible"  width="80%" append-to-body>
                    <div style="background-color: white; margin-bottom: 10px; margin-top: -20px">
                        <el-table
                        :data="workerPnlDatas"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        :cell-style="{cursor: 'pointer'}"
                        show-summary
                        :summary-method="getSummaries"
                        >

                            <el-table-column align="center" label="交易所" min-width="25%">
                                <template slot-scope="scope">
                                    {{ scope.row.exchange }}
                                </template>
                            </el-table-column>


                            <el-table-column align="center" label="策略" min-width="25%">
                                <template slot-scope="scope">
                                    {{ strategyAlias[scope.row.strategy] }}
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="策略ID" min-width="25%">
                                <template slot-scope="scope">
                                    {{ scope.row.strategyID }}
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="Symbol" min-width="25%">
                                <template slot-scope="scope">
                                    {{ scope.row.symbol }}
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="收益" min-width="25%">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.pnl !== null" @click="showWorkerTrades(scope.row.host, {id: scope.row.worker_id, name: scope.row.worker})">
                                        <span style="color: red" v-if="scope.row.pnl < 0">
                                        {{ scope.row.pnl.toFixed(0) }}
                                        </span>
                                        <span style="color: green" v-else>
                                        {{ scope.row.pnl.toFixed(0) }}
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table> 
                    </div>
                </el-dialog>

                <el-dialog title="" :visible.sync="dialogWorkerTradesVisible" width="60%" >
                    <!-- 指定worker的runs -->
                    <trades 
                        v-bind:trades="workerTrades"
                        v-bind:current-worker="currentWorker"
                        v-bind:current-pfo="currentPfo"
                        v-bind:trades-loading="workerTradesLoading"
                    ></trades>
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
import { getNormalWorkerDatas } from '@/api/worker'
import trades from '@/views/trade/_worker_trades'
import { getTradesByWorker } from '@/api/trade'


export default {
    components: {
        trades,
    },

    watch: {

    },

    data() {
        return {
            strategyAlias: config.strategyAlias, 
            config: config,
            pfoHosts: config.pfoHosts,

            dialogWorkerPnlsVisible: false,
            tradeOrdersLoading: false,
            trade: null,
            tradeAvailable: false,

            currentWorker: null,
            currentPfo: null,
            workerTrades: null,
            dialogWorkerTradesVisible: false,
            workerTradesLoading: false,

            datetimeRange: [],
            orderFilter: {
                'exchange': null,
                'symbol': null,
                'strategy': null,
                'strategy_id': null,
                'order_type': null
            },
            strategy_ids: ['1', '2', '3', '4'],  
            order_types: ['any', 'open', 'win_stop', 'timer', 'flip', 'close'],

            pnlDatas: [],
            pnlDatasLoading: false,
            workerPnlDatas: []
        }
    },

    created() {
        // 初始化
        this.search()
    },


    methods: {
        // 获取原始datas
        search(){
            var keepDays = 14   // 最多查询天数
            var ep = Math.round(Date.now()/1000)
            var currentDt = new Date((ep - ep%3600)*1000).toISOString().slice(0, 19).replace('T', ' ')
            var earlyDt = new Date((ep - ep%3600 - 3600*24*keepDays + 3600)*1000).toISOString().slice(0, 19).replace('T', ' ')
            if(this.datetimeRange.length == 2){
                var startDt = this.datetimeRange[0].toISOString().slice(0, 19).replace('T', ' ')    // UTC
                var endDt = this.datetimeRange[1].toISOString().slice(0, 19).replace('T', ' ')      // UTC
                if (endDt > currentDt){
                    alert('结束时间不能超过当前小时!')
                    return
                }
                if (startDt < earlyDt){
                    alert('只支持查询最近'+keepDays+'天的数据!')
                    return
                }
            } else {
                // 默认从今天0点到现在
                ep += 3600*8
                var startDt = new Date((ep - ep%86400 - 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')    // UTC
                var endDt = currentDt      // UTC                     
            }
            this.searchWorkerPnl(startDt, endDt)
        },

        // 搜索指定时间范围内pnl
        searchWorkerPnl(startDt, endDt){
            this.pnlDatas = []
            this.pnlDatasLoading = true
            var count = 0
            var workerPnls = []
            for(var i = 0; i < this.pfoHosts.length; i++){
                // var fields = 'worker,pnl_line'
                var fields = null
                getNormalWorkerDatas(this.pfoHosts[i], fields).then(response => {
                        count += 1

                        // 提取信息
                        var pnls = []
                        for(var i = 0; i < response.results.length; i++){
                            if(response.results[i].pnl_line !== null && startDt in response.results[i].pnl_line && endDt in response.results[i].pnl_line){
                                // 只处理startDt和endDt都存在的pnl
                                pnls.push({
                                    'pnl': response.results[i]["pnl_line"][endDt] - response.results[i]["pnl_line"][startDt],
                                    'host': response.config.baseURL,
                                    'worker': response.results[i].worker.name,
                                    'worker_id': response.results[i].worker.id,
                                    'symbol': response.results[i].worker.product.symbol,
                                    'strategy': response.results[i].worker.strategy_name,
                                    'strategyID': response.results[i].worker.name.slice(-1,),  //worker最后一位表示子策略
                                    'exchange': response.results[i].worker.name.split('_')[0],  //worker第一位表示平台
                                })
                            }
                        }
                        workerPnls = workerPnls.concat(pnls)

                        if (count === this.pfoHosts.length){
                            // 处理数据
                            this.parsePnl(workerPnls)
                            this.pnlDatasLoading = false
                        }
                    }
                )
            }
        },

        // 把原始的workerPnl进行分组: 相同的exchange+strategy+strategyID分为一组
        parsePnl(workerPnls){
            var groupDatas = {}
            for(const data of workerPnls){
                var group = data.exchange + '_' + data.strategy + '_' + data.strategyID
                if (!(group in groupDatas)){
                    groupDatas[group] = {
                        'pnl': 0,
                        'workerPnls': [],
                        'exchange': data.exchange,
                        'strategy': data.strategy,
                        'strategyID': data.strategyID
                    }                  
                }
                if (data.pnl != 0){
                    // 只展示非零的workerPnl
                    groupDatas[group].pnl += data.pnl
                    groupDatas[group].workerPnls.push(data)                   
                }
                // if (group in groupDatas){
                //     groupDatas[group].pnl += data.pnl
                //     groupDatas[group].workerPnls.push(data)
                // } else {
                //     groupDatas[group] = {
                //         'pnl': data.pnl,
                //         'workerPnls': [data],
                //         'exchange': data.exchange,
                //         'strategy': data.strategy,
                //         'strategyID': data.strategyID
                //     }
                // }
            }

            this.pnlDatas = Object.values(groupDatas)
            this.pnlDatas.sort((a, b) => b.pnl - a.pnl)
        },

        //展开workerPnl
        clickGroupPnl(row, ix){
            this.workerPnlDatas = row.workerPnls
            this.workerPnlDatas.sort((a, b) => b.pnl - a.pnl)
            this.dialogWorkerPnlsVisible = true
        },

        clickWorkerPnl(row, ix){

            this.dialogWorkerTradesVisible = true
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

        getSummaries(param) {
            if (this.dialogWorkerPnlsVisible){
                var tableSumCol = 4
            } else {
                var tableSumCol = 3
            }
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            } else if(index !== tableSumCol){
                sums[index] = null
                return;
            } else {
                var sum = 0
                for(let i = 0; i < data.length; i++){
                    sum += data[i].pnl
                }
                sums[index] = toThousands(Math.round(sum))
                return;
            }
            });

            return sums;
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,

    }
}
</script>