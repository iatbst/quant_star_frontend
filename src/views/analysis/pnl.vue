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

            <el-row>
                <!--- 说明 --->
                <ul>
                    <li align="left" style="font-size: 15px">
                        时间段: {{ startDt }} ~ {{ endDt }}
                    </li>
                </ul>
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

                    <el-table-column align="center" label="收益($)" min-width="25%">
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

                    <el-table-column align="center" label="收益率(%)" min-width="25%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.pnl_ptg !== null">
                                <span style="color: red" v-if="scope.row.pnl_ptg < 0">
                                {{ Number((scope.row.pnl_ptg*100).toFixed(3)) }}
                                </span>
                                <span style="color: green" v-else>
                                {{ Number((scope.row.pnl_ptg*100).toFixed(3)) }}
                                </span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="回测收益率(%)" min-width="25%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.bt_pnl_ptg !== null">
                                <span style="color: red" v-if="scope.row.bt_pnl_ptg < 0">
                                {{ Number((scope.row.bt_pnl_ptg*100).toFixed(3)) }}
                                </span>
                                <span style="color: green" v-else>
                                {{ Number((scope.row.bt_pnl_ptg*100).toFixed(3)) }}
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

                            <el-table-column align="center" label="收益($)" min-width="25%">
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

                            <el-table-column align="center" label="收益率(%)" min-width="25%">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.pnl_ptg !== null">
                                        <span style="color: red" v-if="scope.row.pnl_ptg < 0">
                                        {{ Number((scope.row.pnl_ptg*100).toFixed(3)) }}
                                        </span>
                                        <span style="color: green" v-else>
                                        {{ Number((scope.row.pnl_ptg*100).toFixed(3)) }}
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="回测收益率(%)" min-width="25%">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.bt_pnl_ptg !== null">
                                        <span style="color: red" v-if="scope.row.bt_pnl_ptg < 0">
                                        {{ Number((scope.row.bt_pnl_ptg*100).toFixed(3)) }}
                                        </span>
                                        <span style="color: green" v-else>
                                        {{ Number((scope.row.bt_pnl_ptg*100).toFixed(3)) }}
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

            <el-row>
                <!--- 说明 --->
                <ul>
                    <li align="left" style="font-size: 10px">
                        时间范围:默认展示昨天24H的收益排名分析;时间范围选择遵守左开右闭原则(00:00:00 ~ 12:00:00表示零点到11点结束时的收益);最多展示最近14天收益数据
                    </li>
                    <li align="left" style="font-size: 10px">
                        刷新频率:实盘收益每个小时更新一次;回测收益每日更新一次(凌晨1点开始更新, 回测收益不能显示今日值)
                    </li>
                    <li align="left" style="font-size: 10px">
                        收益率计算方式:收益除以时间范围初始资产值;实盘和回测的资产值按照平台区分
                    </li>
                    <li align="left" style="font-size: 10px">
                        第一层表格展示策略层面的收益(即使收益为0也显示);第二层表格展示Worker层面的收益(如果收益为0则不显示);目前支持实盘worker订单的展示(不支持回测订单展示)
                    </li>
                </ul>
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
import { getWalletDatas } from '@/api/wallet'
import { getNormalWorkerDatas } from '@/api/worker'
import trades from '@/views/trade/_worker_trades'
import { getTradesByWorker } from '@/api/trade'
import { getBacktestReportByName } from '@/api/backtest_report'


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

            pnlDatas: [],
            pnlDatasLoading: false,
            workerPnlDatas: [],

            btPnlDatas: {},

            startDt: null,
            endDt: null
        }
    },

    created() {
        // 初始化
        this.search()
    },


    methods: {
        search(){
            // 获取pnl
            this.getPnl()
        },

        // 先获取回测pnl; 再获取实盘pnl
        // 为了方便对比,按照实盘的时间标准
        getPnl(){
            // 准备回测start/end
            // 注意: 回测pnl的时间是Beiing时间(实盘是utc时间);回测pnl是K线结束时的pnl(实盘pnl是K线开始时的pnl)
            var keepDays = 14   // 最多查询天数
            var ep = Math.round(Date.now()/1000)
            var currentDt = new Date((ep - ep%3600 - 3600 + 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')   // Beijing
            var earlyDt = new Date((ep - ep%3600 - 3600*24*keepDays + 3600 + 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')   // Beijing
            if(this.datetimeRange.length == 2){
                var rangeStart = new Date(this.datetimeRange[0].getTime())
                var rangeEnd = new Date(this.datetimeRange[1].getTime())
                rangeStart.setHours(rangeStart.getHours() - 1 + 8)
                rangeEnd.setHours(rangeEnd.getHours() - 1 + 8)
                var startDt = rangeStart.toISOString().slice(0, 19).replace('T', ' ')    // Beijing
                var endDt = rangeEnd.toISOString().slice(0, 19).replace('T', ' ')    // Beijing
                if (endDt > currentDt){
                    alert('结束时间不能超过当前小时!')
                    return
                }
                if (startDt < earlyDt){
                    alert('只支持查询最近'+keepDays+'天的数据!')
                    return
                }
            } else {
                // 默认昨天24H的pnl
                ep += 3600*8
                var startDt = new Date((ep - ep%86400 - 86400 - 3600)*1000).toISOString().slice(0, 19).replace('T', ' ')     // Beijing
                var endDt = new Date((ep - ep%86400 - 3600)*1000).toISOString().slice(0, 19).replace('T', ' ')     // Beijing                 
            }

            // 展示时间范围
            this.startDt = new Date(startDt)
            this.startDt.setHours(this.startDt.getHours() + 9)
            this.startDt = this.startDt.toISOString().slice(0, 19).replace('T', ' ') 
            this.endDt = new Date(endDt)
            this.endDt.setHours(this.endDt.getHours() + 9)
            this.endDt = this.endDt.toISOString().slice(0, 19).replace('T', ' ') 

            // 获取回测pnl
            this.pnlDatasLoading = true
            this.btPnlDatas = {}
            var count = 0
            var exchanges = [
                'binance',
                'okex',
                'bybit',
                'bitget'
            ]
            for(const exchange of exchanges){
                var reportName = exchange + '_backtest'
                getBacktestReportByName(config.masterHost, reportName).then(response => {
                        count += 1
                        var data = response.results[0].analyzer_rets.worker_pnls

                        // 提取信息
                        var startValue = data.valueline[startDt]
                        for(const worker in data.pnl_lines){
                            var line = data.pnl_lines[worker]
                            // debugger
                            if(startDt in line && endDt in line && startDt in data.valueline){
                                // 只处理startDt和endDt都存在的pnl
                                this.btPnlDatas[worker] = {
                                    // 'pnl': line[endDt] - line[startDt],
                                    'pnl_ptg': (line[endDt] - line[startDt])/startValue,
                                    // 'startValue': startValue,
                                    // 'exchange': worker.split('_')[0],  //worker第一位表示平台
                                    // 'strategy': worker.split('_')[1],
                                    // 'strategyID': worker.split('_')[2],  //worker最后一位表示子策略
                                    // 'symbol': worker.split('_')[3],
                                }
                            }
                        }

                        // 回测数据获取后再获取实盘数据
                        if (count === exchanges.length){
                            debugger
                            this.getLivePnl()
                        }
                    }
                )
            }
        },

        // 获取实盘pnl
        getLivePnl(){
            // 准备实盘start/end
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
                // 默认昨天24H的pnl
                ep += 3600*8
                var startDt = new Date((ep - ep%86400 - 3600*8 - 86400)*1000).toISOString().slice(0, 19).replace('T', ' ')    // UTC
                var endDt = new Date((ep - ep%86400 - 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')    // UTC                  
            }

            // 获取pnl
            this.pnlDatas = []
            this.pnlDatasLoading = true
            var count = 0
            var workerPnls = []
            for(var i = 0; i < this.pfoHosts.length; i++){
                // 获取wallet.data.value_line
                getWalletDatas(this.pfoHosts[i], 'value_line').then(response => {
                    // 每个host只有一个pfo/wallet
                    var valueLine = response.results[0].value_line
                    var host = response.config.baseURL

                    // 获取worker.data.pnl_line
                    getNormalWorkerDatas(host, 'worker,pnl_line').then(response => {
                            count += 1

                            // 提取信息
                            var pnls = []
                            for(var i = 0; i < response.results.length; i++){
                                if(response.results[i].pnl_line !== null && startDt in response.results[i].pnl_line && endDt in response.results[i].pnl_line){
                                    // 只处理startDt和endDt都存在的pnl
                                    var pnl = response.results[i]["pnl_line"][endDt] - response.results[i]["pnl_line"][startDt]
                                    var exchange = response.results[i].worker.name.split('_')[0]    //worker第一位表示平台
                                    var strategy = response.results[i].worker.strategy_name
                                    var strategyID = response.results[i].worker.name.slice(-1,)     //worker最后一位表示子策略
                                    var symbol = response.results[i].worker.product.symbol

                                    // TODO: 需要refactor!
                                    // - bt_key目前需要根据不同的策略单独生成(否则无法和btPnlDatas中的key对应!)
                                    // - boll/rsi策略应该根据bar_level展开显示
                                    if (strategy == 'long-short-ratio'){
                                        var bt_key = exchange + '_' + 'lr'  + '_' + symbol
                                    } else if(strategy == 'rsi-mini'){
                                        var rsiId = response.results[i].worker.name.split('_').slice(-2, ).join('_')
                                        var bt_key = exchange + '_' + 'rsi_mini'  + '_' + rsiId + '_' + symbol
                                    } else if(strategy == 'boll-mini'){
                                        var bollId = response.results[i].worker.name.split('_').slice(-2, ).join('_')
                                        var bt_key = exchange + '_' + 'boll'  + '_' + bollId + '_' + symbol
                                    } else {
                                        // 通用(目前只适用于tb策略)
                                        var bt_key = exchange + '_' + strategy + '_' + strategyID + '_' + symbol
                                    }
                                    // if (!(bt_key in this.btPnlDatas) && bt_key.includes('boll')){
                                    //     debugger
                                    // }

                                    pnls.push({
                                        'pnl': pnl,
                                        'pnl_ptg': startDt in valueLine ? pnl/valueLine[startDt] : null,    // 实盘收益率
                                        'bt_pnl_ptg': bt_key in this.btPnlDatas ? this.btPnlDatas[bt_key].pnl_ptg : null,   // 回测收益率
                                        'host': response.config.baseURL,
                                        'worker': response.results[i].worker.name,
                                        'worker_id': response.results[i].worker.id,
                                        'symbol': symbol,
                                        'strategy': strategy,
                                        'strategyID': strategyID,  //worker最后一位表示子策略
                                        'exchange': exchange
                                    })
                                    // 删除key
                                    if (bt_key in this.btPnlDatas){
                                        delete this.btPnlDatas[bt_key]
                                    }
                                }
                            }
                            workerPnls = workerPnls.concat(pnls)

                            if (count === this.pfoHosts.length){
                                // 处理数据
                                this.parsePnl(workerPnls)
                                this.pnlDatasLoading = false
                                
                                // 最后检查btPnlDatas是否为空(非空则表示部分回测worker的pnl未被实盘对比!)
                                console.log('btPnlDatas(非空则表示部分回测worker的pnl未被实盘对比):' + Object.keys(this.btPnlDatas))
                            }
                        }
                    )
                })
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
                        'pnl_ptg': 0,
                        'bt_pnl_ptg': 0,
                        'workerPnls': [],
                        'exchange': data.exchange,
                        'strategy': data.strategy,
                        'strategyID': data.strategyID
                    }                  
                }
                if ((data.pnl != null && data.pnl != 0) || (data.bt_pnl_ptg != null && data.bt_pnl_ptg != 0)){
                    // 只展示非零的workerPnl
                    groupDatas[group].pnl += data.pnl
                    groupDatas[group].workerPnls.push(data)  
                    if (data.pnl_ptg !== null){
                        groupDatas[group].pnl_ptg += data.pnl_ptg
                    } 
                    if (data.bt_pnl_ptg !== null){
                        groupDatas[group].bt_pnl_ptg += data.bt_pnl_ptg
                    }                   
                }
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
                // 内表
                var tableSumCol = [4, 5, 6]
            } else {
                // 外表
                var tableSumCol = [3, 4, 5]
            }
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            } else if(tableSumCol.includes(index)){
                var sum = 0
                for(let i = 0; i < data.length; i++){
                    if (index == tableSumCol[0]){
                        sum += data[i].pnl
                    } else if(index == tableSumCol[1]) {
                        sum += data[i].pnl_ptg
                    } else {
                        sum += data[i].bt_pnl_ptg
                    }
                }
                if (index == tableSumCol[0]){
                    sums[index] = toThousands(Math.round(sum))
                } else if(index == tableSumCol[1]) {
                    sums[index] = (sum*100).toFixed(3)
                } else {
                    sums[index] = (sum*100).toFixed(3)
                }            
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

    }
}
</script>