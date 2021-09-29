<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div>
        <el-table
        v-loading="signalPointsLoading"
        :data="signalPoints"
        style="width: 100%"
        height="750"
        >
            <el-table-column align="center" :label="'订单详情 ( ' + currentWorker.name + ' )'" v-if="currentWorker">
                <template slot-scope="scope" style="padding: 0px">
                <el-card :class="{'box-card': true, 'el-card': true, 'short-card': scope.row.sig_type === 'short', 'long-card': scope.row.sig_type === 'long'}">
                    <div slot="header" class="clearfix" style="margin-bottom: -50px;margin-top: -10px;">
                    <!-- Signal Point -->
                    <el-row :gutter="15" class="el-row">
                        <el-col :span="1" align="left">
                            <div v-html="spStatusIcon(scope.row.final_state)">
                            </div>
                        </el-col>

                        <el-col :span="3" align="left">
                            {{ chineseString(scope.row.sig_type) }} ({{ scope.row.id }})
                        </el-col>

                        <el-col :span="5" align="left">
                            {{ formatTimestamp(scope.row.sig_ts) }}
                        </el-col>

                        <el-col :span="3" align="left">
                            {{ scope.row.sig_price }}
                        </el-col>

                        <el-col :span="10" align="left" style="color: red">
                            {{ scope.row.flags.final_state_message }}
                            <span v-if="scope.row.flags.final_state_error_type">
                                ({{ scope.row.flags.final_state_error_type }})
                            </span>
                        </el-col>

                        <el-col :span="scope.row.flags.final_state_message ? 2 : 12">
                            <el-button style="float: right; padding: 3px 0" type="text"
                                        v-on:click="fetchLogsByWorker(currentWorker, scope.row.sig_ts)" plain>
                            日志</el-button>
                        </el-col>
                    </el-row>
                    </div>

                    <div v-for="order in scope.row.orders" :key="order.sys_id">
                        <el-row>
                            <!-- 算法订单 -->
                            <el-col :span="2" @click.native="showOrderJsonDialog(order)" style="cursor: pointer" v-html="orderStatusIcon(order.status)">
                            </el-col>
                            <el-col :span="3" align="left">
                            {{ chineseString(order.order_type) }}:{{ chineseString(order.side) }} ({{ order.id }})
                            </el-col>
                            <el-col :span="5" align="left">
                            {{ formatTimestamp(order.created_ts) }}
                            </el-col>
                            
                            <el-col :span="10" align="left">
                            {{ order.size }} / <b>{{ order.exec_size }}</b> ({{ String(order.exec_avg_price) }})
                            </el-col>
                            <el-col :span="3" align="right">
                            <el-button style="margin-top: -6px" type="text" @click="showOrderJsonDialog(order)" v-if="order.exec_algo == 'simple'">JSON</el-button>
                            <el-button style="margin-top: -6px" type="text" @click="fetchSubOrdersByParentOrder(order)" v-else>子订单</el-button>
                            </el-col>
                            <el-col :span="1"></el-col>
                        </el-row>          
                    </div>

                    <div v-if="scope.row.flags.final_state_note">
                        <el-row>
                        <el-col :span="24" align="left" style="color: red">
                            {{ scope.row.flags.final_state_note }}
                        </el-col>
                        </el-row>
                    </div>

                    <div v-if="(scope.row.final_state == 'error' && scope.row.checked != true) || scope.row.final_state == 'warn'">
                        <!-- 填写并发送note(warn或者unchecked的error状态) -->
                        <el-row>
                            <el-col :span="24" align="left">
                                <el-form :inline="true" :model="spState" class="demo-form-inline" size="mini">
                                <el-form-item label="">
                                    <el-select v-model="spState.final_state" placeholder="最终状态">
                                        <el-option label="error" value="error"></el-option>
                                        <el-option label="success" value="success"></el-option>
                                        <el-option label="manual" value="manual"></el-option>
                                        <el-option label="history" value="history"></el-option>
                                    </el-select>
                                </el-form-item>  
                                <el-form-item label="" v-if="spState.final_state == 'error'">
                                    <el-select v-model="spState.error_type" placeholder="错误类型">
                                    <el-option :label="type" :value="type" v-bind:key="type" v-for="type in spErrorTypes"></el-option>
                                    </el-select>
                                </el-form-item>                     
                                <el-form-item label="">
                                    <el-input v-model="spState.note" placeholder="原因"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmitSpState(scope.row.id, scope.row)">标记</el-button>
                                </el-form-item>
                                </el-form> 
                            </el-col>
                        </el-row>                           
                  </div>
                </el-card>
                </template>
            </el-table-column>
        </el-table>  

        <!-- Diaglog: 订单Json -->
        <el-dialog title="订单详情" :visible.sync="dialogOrderJsonVisible">
            <pre>{{ orderJson }}</pre>
        </el-dialog>

        <!-- Diaglog: 父子订单 -->
        <el-dialog title="算法订单(父/子订单)" :visible.sync="dialogSubOrdersVisible" width="65%">
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
                {{ formatTimestamp(parentOrder.created_ts) }}
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
                    {{ formatTimestamp(scope.row.created_ts) }}
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
        <el-dialog title="日志" :visible.sync="dialogLogVisible" width="80%" >
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
import { getLogsByWorkerAndTs } from '@/api/log'
import { formatTimestamp } from '@/utils/general'
import { chineseString } from '@/utils/chinese'
import { markSpFinalState } from '@/api/signal_point'
import moment from 'moment'


export default {

    props: {
        signalPoints: {
            type:Array,
            default:[]
        },
        signalPointsLoading: {
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
            dialogSubOrdersVisible: false,
            dialogOrderJsonVisible: false,
            parentOrder: {},

            logs: null,
            logsLoading: false,
            dialogLogVisible: false,   

            spState: {
                final_state: null,
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
            } else if (status === 'deleted' || status === 'rejected') {
                return "<i style=\"font-size:20px; color: red \" class=\"el-icon-circle-close\"></i>"
            } else {
                return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-loading\"></i>"
            }
        },

        spStatusIcon(status) {
            if (status === 'success'){
                return "<i style=\"font-size:20px; color: lightgreen \" class=\"el-icon-success\"></i>"
            } else if (status === 'error') {
                return "<i style=\"font-size:20px; color: red \" class=\"el-icon-error\"></i>"
            } else if (status === 'warn') {
                return "<i style=\"font-size:20px; color: orange \" class=\"el-icon-warning\"></i>"
            } else if (status === 'manual') {
                return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-user\"></i>"
            } else if (status === 'history') {
                return "<i style=\"font-size:20px; color: lightgray \" class=\"el-icon-time\"></i>"
            } else {
                // 当前sp
                return "<i style=\"font-size:20px; color: green \" class=\"el-icon-refresh\"></i>"
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

        fetchLogsByWorker(worker, ts) {
            this.logsLoading = true
            this.dialogLogVisible = true
            // TODO: 优化datetime的操作
            var ts_obj = new Date(ts)
            var min_ts = ts_obj.setHours(ts_obj.getHours() - 1)   // ts之前1个小时
            var max_ts = ts_obj.setHours(ts_obj.getHours() + 2)   // ts之后1个小时
            min_ts = new Date(min_ts)
            max_ts = new Date(max_ts)
            min_ts = moment(min_ts).format("YYYY-MM-DD HH:mm:ss")
            max_ts = moment(max_ts).format("YYYY-MM-DD HH:mm:ss")
            getLogsByWorkerAndTs(worker, min_ts, max_ts, this.currentPfo.host).then(response => {
                this.logs = response.results
                this.logsLoading = false
            })
        },

        onSubmitSpState(sp_id, row) {
            // 发送ajax, 更新后台
            markSpFinalState(sp_id, this.spState, this.currentPfo.host).then(response => {
                // 更新UI
                console.log(response)
                if (response.ok){
                    row.final_state = this.spState.final_state
                    row.flags.final_state_note = this.spState.note
                } else {
                    alert('更新SP(' + sp_id + ')的final_state失败!')
                }
            })
        },

        formatTimestamp: formatTimestamp,
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