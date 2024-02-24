<!-- 
    模板: 展示worker的所有trades和对应的orders
-->
<template>
    <div>
        <el-table
        v-loading="tradesLoading"
        :data="trades"
        style="width: 100%"
        height="750"
        >
            <el-table-column align="center" :label="currentWorker.name + ' ( ' + currentWorker.status + ' )'" v-if="currentWorker">
                <template slot-scope="scope" style="padding: 0px">
                <el-card :class="{'box-card': true, 'el-card': true, 'close-card': scope.row.status === 'close', 'short-card': scope.row.side === 'short', 'long-card': scope.row.side === 'long'}">
                    <div slot="header" class="clearfix" style="margin-bottom: -50px;margin-top: -10px;">
                    <!-- Trade -->
                    <el-row :gutter="15" class="el-row">
                        <el-col :span="1" align="left">
                            <div v-html="tradeStatusIcon(scope.row.final_flag)" v-on:click="fetchLogsByTrade(scope.row)" style="cursor: pointer">
                            </div>
                        </el-col>

                        <el-col :span="3" align="left">
                            {{ chineseString(scope.row.side) }} (<el-button style="margin-top: -8px" type="text" @click="showTradeJsonDialog(scope.row)">
                                {{ scope.row.id }}</el-button>)
                        </el-col>

                        <el-col :span="4" align="left">
                            {{ utcToLocalTimestamp(scope.row.entry_dt) }}
                        </el-col>

                        <el-col :span="3" align="left">
                            {{ scope.row.entry_price }}
                        </el-col>

                        <el-col :span="3" align="left">
                            |&nbsp仓位:<b>{{ scope.row.position }}</b>&nbsp|
                        </el-col>

                        <el-col :span="4" align="left">
                            {{ utcToLocalTimestamp(scope.row.exit_dt) }}
                        </el-col>

                        <el-col :span="4" align="left">
                            {{ scope.row.exit_price }}
                        </el-col>
                    </el-row>
                    </div>

                    <div v-for="order in scope.row.orders" :key="order.sys_id">
                            <!-- 算法订单 -->
                            <el-col :span="2" @click.native="showOrderJsonDialog(order)" style="cursor: pointer" v-html="orderStatusIcon(order.status)">
                            </el-col>

                            <el-col :span="3" align="left">
                                <span style="text-decoration: underline;" v-if="order.exec_mode === 'manual'">
                                    {{ chineseString(order.order_type) }}:{{ chineseString(order.side) }} ({{ order.id }})
                                </span>
                                <span v-else>
                                    {{ chineseString(order.order_type) }}:{{ chineseString(order.side) }} ({{ order.id }})
                                </span>
                            </el-col>

                            <el-col :span="5" align="left">
                            {{ formatTimestamp(order.exec_ts) }}
                            </el-col>
                            
                            <el-col :span="10" align="left">
                            {{ order.size }} / <b>{{ order.exec_size }}</b> ({{ String(order.exec_avg_price) }})
                            </el-col>
                            <el-col :span="3" align="right">
                            <el-button style="margin-top: -6px" type="text" @click="showOrderJsonDialog(order)" v-if="order.exec_algo == 'simple'">JSON</el-button>
                            <el-button style="margin-top: -6px" type="text" @click="fetchSubOrdersByParentOrder(order)" v-else>子订单</el-button>
                            </el-col>
                            <el-col :span="1"></el-col>         
                    </div>

                    <div v-if="scope.row.flags.final_flag_note">
                        <el-col :span="24" align="left" style="color: red">
                            {{ scope.row.flags.final_flag_note }}
                        </el-col>
                    </div>
                </el-card>
                </template>
            </el-table-column>
        </el-table>  

        <!-- Diaglog: 订单Json -->
        <el-dialog title="订单详情" :visible.sync="dialogOrderJsonVisible" append-to-body>
            <pre>{{ orderJson }}</pre>
        </el-dialog>

        <!-- Diaglog: 交易Json -->
        <el-dialog title="交易详情" :visible.sync="dialogTradeJsonVisible" append-to-body>
            <pre>{{ tradeJson }}</pre>
        </el-dialog>

        <!-- Diaglog: 父子订单 -->
        <el-dialog title="算法订单(父/子订单)" :visible.sync="dialogSubOrdersVisible" width="65%" append-to-body>
            <hr />
            <el-table :data="[parentOrder]" style="width: 100%;" :show-header="false">
                <el-table-column min-width="10%">
                    <div v-html="orderStatusIcon(parentOrder.status)">
                    </div>
                </el-table-column>
                <el-table-column min-width="10%">
                {{ chineseString(parentOrder.side) }} ({{ parentOrder.id }})
                </el-table-column>
                <el-table-column min-width="20%">
                {{ formatTimestamp(parentOrder.exec_ts) }}
                </el-table-column>
                <el-table-column min-width="10%">
                {{ parentOrder.price}}
                </el-table-column>
                <el-table-column min-width="20%">
                算法:{{ parentOrder.exec_algo }}
                </el-table-column>
                <el-table-column min-width="20%">
                {{ parentOrder.size }} / <b>{{ parentOrder.exec_size }}</b> ({{ String(parentOrder.exec_avg_price) }})
                </el-table-column>
                <el-table-column min-width="10%">
                <el-button type="text" @click="showOrderJsonDialog(parentOrder)">JSON</el-button>
                </el-table-column>
            </el-table>
            <hr />
            <el-table 
            v-loading="subOrdersLoading"
            :data="subOrders" 
            style="width: 100%" 
            :show-header="false">
                <el-table-column min-width="10%">
                <template slot-scope="scope" >
                    <div v-html="orderStatusIcon(scope.row.status)">
                    </div>
                </template>
                </el-table-column>
                <el-table-column min-width="10%">
                <template slot-scope="scope">
                    {{ chineseString(scope.row.side) }} ({{ scope.row.id }})
                </template>
                </el-table-column>
                <el-table-column min-width="20%">
                <template slot-scope="scope">
                    {{ formatTimestamp(scope.row.exec_ts) }}
                </template>
                </el-table-column>
                <el-table-column min-width="10%">
                <template slot-scope="scope">
                    {{scope.row.price}}
                </template>
                </el-table-column>
                <el-table-column min-width="20%">
                <template slot-scope="scope">
                    {{scope.row.orig_type}}
                </template>
                </el-table-column>
                <el-table-column min-width="20%">
                <template slot-scope="scope">
                    {{ scope.row.size }} / <b>{{ scope.row.exec_size }}</b> ({{ String(scope.row.exec_avg_price) }})
                </template>
                </el-table-column>
                <el-table-column min-width="10%">
                <template slot-scope="scope">
                    <el-button type="text" @click="showOrderJsonDialog(scope.row)">JSON</el-button>
                </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- Diaglog: 日志 -->
        <el-dialog title="日志" :visible.sync="dialogLogVisible" width="80%" append-to-body>
            <div v-loading="logsLoading">
                <div v-for="log in logs" :key="log.ts" class="text item" >
                    <!-- log -->
                    <el-row>
                    <el-col :span="3">
                        {{ formatTimestamp(log.ts) }}
                    </el-col>
                    <el-col :span="2">
                        [ {{ log.level.toUpperCase() }} ]:
                    </el-col>
                    <el-col :span="19">
                        <span style="white-space: pre-line">{{ log.message }}</span>
                    </el-col>
                    </el-row>
                </div>
            </div>
        </el-dialog>
    </div> 
</template>

<script>
import { getSubOrdersByParentOrder } from '@/api/order'
import { getLogsByWorkerAndTs, getLogsByTrade } from '@/api/log'
import { formatTimestamp, utcToLocalTimestamp } from '@/utils/general'
import { chineseString } from '@/utils/chinese'
import { markTradeFinalFlag } from '@/api/trade'
import moment from 'moment'


export default {

    props: {
        trades: {
            type:Array,
            default:[]
        },
        tradesLoading: {
            type: Boolean,
            default: true
        },
        currentWorker: {
            type: Object,
            default: {}
        },
        currentPfo: {
            type: Object,
            default: {}
        }
    },

    watch: {

    },

    data() {
        return {
            subOrdersLoading: false,
            subOrders: null,
            parentOrder: null, 
            orderJson: null,
            tradeJson: null,
            dialogSubOrdersVisible: false,
            dialogOrderJsonVisible: false,
            dialogTradeJsonVisible: false,
            parentOrder: {},

            logs: null,
            logsLoading: false,
            dialogLogVisible: false,   

            tradeFlag: {
                final_flag: null,
                error_type: null,
                note: null,
            }
        }
    },

    methods: {
        orderStatusIcon(status) {
            if (status === 'completed'){
                return "<i style=\"font-size:20px; color: lightgreen \" class=\"el-icon-check\"></i>"
            } else if (status === 'canceled' || status === 'expired' || status === 'partial_canceled') {
                return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-warning-outline\"></i>"
            } else if (status === 'deleted' || status === 'rejected' || status === 'place_error') {
                return "<i style=\"font-size:20px; color: red \" class=\"el-icon-circle-close\"></i>"
            } else {
                return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-loading\"></i>"
            }
        },

        tradeStatusIcon(status) {
            if (status === 'success'){
                return "<i style=\"font-size:20px; color: lightgreen \" class=\"el-icon-success\"></i>"
            } else if (status === 'error') {
                return "<i style=\"font-size:20px; color: red \" class=\"el-icon-error\"></i>"
            } else if (status === 'backfill') {
                return "<i style=\"font-size:20px; color: lightgray \" class=\"el-icon-time\"></i>"
            } else {
                // 当前trade
                return "<i style=\"font-size:20px; color: blue \" class=\"el-icon-loading\"></i>"
            }
        }, 

        fetchSubOrdersByParentOrder(order) {
            this.subOrdersLoading = true
            this.dialogSubOrdersVisible = true
            getSubOrdersByParentOrder(order, this.currentPfo.host).then(response => {
                this.subOrders = response.results
                this.subOrdersLoading = false
            })
            this.parentOrder = order
        },

        showOrderJsonDialog(order) {
            this.orderJson = JSON.stringify(order,null,2)
            this.dialogOrderJsonVisible = true
        },

        showTradeJsonDialog(trade) {
            this.tradeJson = JSON.stringify(trade,null,2)
            this.dialogTradeJsonVisible = true
        },

        fetchLogsByTrade(trade) {
            this.logsLoading = true
            this.dialogLogVisible = true
            getLogsByTrade(trade, this.currentPfo.host).then(response => {
                this.logs = response.results
                this.logsLoading = false
            })
        },

        fetchLogsByWorker(worker, dt) {
            this.logsLoading = true
            this.dialogLogVisible = true
            // TODO: 优化datetime的操作
            var ts_obj = new Date(dt)
            var min_ts = ts_obj.setHours(ts_obj.getHours() - 1)   // ts之前1个小时
            var max_ts = ts_obj.setHours(ts_obj.getHours() + 3)   // ts之后2个小时(可能tick错过信号导致1个小时延迟)
            min_ts = new Date(min_ts)
            max_ts = new Date(max_ts)
            min_ts = moment(min_ts).format("YYYY-MM-DD HH:mm:ss")
            max_ts = moment(max_ts).format("YYYY-MM-DD HH:mm:ss")
            getLogsByWorkerAndTs(worker, min_ts, max_ts, this.currentPfo.host).then(response => {
                this.logs = response.results
                this.logsLoading = false
            })
        },

        onSubmitTradeFlag(trade_id, row) {
            // 发送ajax, 更新后台
            markTradeFinalFlag(trade_id, this.tradeFlag, this.currentPfo.host).then(response => {
                // 更新UI TODO: 更新失败!
                console.log(response)
                if (response.ok){
                    row.final_flag = this.tradeFlag.final_flag
                    row.flags.final_flag_note = this.tradeFlag.note
                } else {
                    alert('更新Trade(' + trade_id + ')的final_flag失败!')
                }
            })
        },

        formatTimestamp: formatTimestamp,
        utcToLocalTimestamp: utcToLocalTimestamp,
        chineseString: chineseString,

    }
}
</script>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
    height: 10px;
  }
  .box-card {
    width: 100%;
  }
  .short-card {
    border-color: lightsalmon;
  }
  .long-card {
    border-color: lightgreen;
  }
  .close-card {
    background-color: rgb(240, 240, 240);
  }
  .el-card {
    min-width: 100%;
    height: 100%;
    margin-right: 20px;
    transition: all .5s;
  }
  .el-card__body {
    padding: 10px;
  }
  .el-card__header {
    padding: 10px;
    padding-bottom: 15px;
    padding-top: 15px;
  }
</style>