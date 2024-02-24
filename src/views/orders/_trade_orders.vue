<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div class="app-container" align="center" >
        <div style="width: 95%; margin-top: 20px">
            <div align="left" style="margin-bottom: 3px" v-if="trade.flags.last_tick && trade.status == 'open'">
                <span>
                    [{{ formatTimestamp(trade.flags.last_tick_ts) }}]: {{ trade.flags.last_tick }}
                </span>
                <span v-if="trade.price_diff_ptg">
                    <span v-if="trade.price_diff_ptg > 0" style="color: green">
                        <i class="el-icon-top"></i>
                        {{ trade.price_diff_ptg }}%
                    </span>
                    <span style="color: red" v-else>
                        <i class="el-icon-bottom"></i>
                        {{ trade.price_diff_ptg }}%
                    </span>                    
                </span>
            </div>
            <el-row :gutter="0" type="flex">
                <!----------------------------------- Trade详情 --------------------------------------->
                <el-table
                :data="[trade]"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="ordersLoading"
                >
                    <el-table-column align="center" label="交易所" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.worker.name.split('_')[0] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="标的" min-width="8%">
                        <template slot-scope="scope">
                            {{ scope.row.worker.product.symbol }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="策略" min-width="5%">
                        <template slot-scope="scope">
                            {{ strategyAlias.hasOwnProperty(scope.row.worker.name.split('_').slice(-2, -1)[0]) ? strategyAlias[scope.row.worker.name.split('_').slice(-2, -1)[0]] : '大PV' }}
                            [{{ scope.row.order_type == 'temp' ? 'N/A' : scope.row.worker.name.slice(-1,) }}]
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="方向" min-width="10%">
                        <template slot-scope="scope">
                            <span style="color: green" v-if="scope.row.side == 'long'">
                                {{ chineseString(scope.row.side) }}
                            </span>
                            <span style="color: red" v-else>
                                {{ chineseString(scope.row.side) }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="当前持仓(个/张)" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.position }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="状态" min-width="10%">
                        <template slot-scope="scope">
                            {{ chineseString('trade_' + scope.row.status) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="持仓收益" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.position_pnl !== 0">
                                <span style="color: red" v-if="scope.row.position_pnl < 0">
                                {{ scope.row.position_pnl.toFixed(2) }}
                                </span>
                                <span style="color: green" v-else>
                                {{ scope.row.position_pnl.toFixed(2) }}
                                </span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="平仓收益" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.pnl !== null">
                                <span style="color: red" v-if="scope.row.pnl < 0">
                                {{ scope.row.pnl.toFixed(2) }}
                                </span>
                                <span style="color: green" v-else>
                                {{ scope.row.pnl.toFixed(2) }}
                                </span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="总收益" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.total_pnl !== null">
                                <span style="color: red" v-if="scope.row.total_pnl < 0">
                                {{ scope.row.total_pnl.toFixed(2) }}
                                </span>
                                <span style="color: green" v-else>
                                {{ scope.row.total_pnl.toFixed(2) }}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table> 
            </el-row>

            <el-row :gutter="0" type="flex">
                <!----------------------------------- 订单详情 --------------------------------------->
                <el-table
                :data="orders"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="ordersLoading"
                >
                    <el-table-column align="center" label="时间" min-width="10%">
                        <template slot-scope="scope">
                            {{ utcToLocalTimestamp(scope.row.exec_ts) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="类型" min-width="8%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.order_type === 'open'">
                                <b>
                                    <i class="el-icon-top"></i>
                                    {{ chineseString(scope.row.order_type) }}                                
                                </b>
                            </span>
                            <span v-else>
                                {{ chineseString(scope.row.order_type) }}
                                <span v-if="scope.row.flags.exit_ratio && scope.row.flags.exit_ratio != 0">
                                    ({{ scope.row.flags.exit_ratio*100 }}%)
                                </span>
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易" min-width="5%">
                        <template slot-scope="scope">
                            <span style="color: red" v-if="scope.row.side === 'sell'">
                            {{ chineseString(scope.row.side) }}
                            </span>
                            <span style="color: green" v-else>
                            {{ chineseString(scope.row.side) }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="数量" min-width="10%">
                        <template slot-scope="scope">
                            {{ toThousands(Math.round(scope.row.exec_size)) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="成交额" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.volume !== null">
                                {{ toThousands(Math.round(scope.row.volume)) }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="期望价格" min-width="10%">
                        <template slot-scope="scope">
                            {{ toFixed(scope.row.price, 2) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="成交均价" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.exec_avg_price !== null">
                                {{ toFixed(scope.row.exec_avg_price, 2) }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="收益" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.pnl !== null">
                                <span style="color: red" v-if="scope.row.pnl < 0">
                                {{ scope.row.pnl.toFixed(2) }}({{ (scope.row.pnl_ptg*100).toFixed(2) }}%)
                                </span>
                                <span style="color: green" v-else>
                                {{ scope.row.pnl.toFixed(2) }}({{ (scope.row.pnl_ptg*100).toFixed(2) }}%)
                                </span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="滑点" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.slippage !== null">
                                <span style="color: red" v-if="scope.row.slippage < 0">
                                {{ (scope.row.slippage*100).toFixed(2) }}%
                                </span>
                                <span style="color: green" v-else>
                                {{ (scope.row.slippage*100).toFixed(2) }}%
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table> 
            </el-row>
        </div>
    </div>
</template>

<script>
import config from '@/configs/system_configs'
import { utcToLocalTimestamp, formatTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { chineseString } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'
import { getTradeById } from '@/api/trade'


export default {
    props: {
        trade: {
            type:Object,
            default:{}
        },

        ordersLoading: {
            type: Boolean,
            default: true
        }
    },

    watch: {

    },

    data() {
        return {
            strategyAlias: config.strategyAlias, 
            config: config,
            orders: [],
        }
    },

    created() {
        this.parseData()
    },

    methods: {
        parseData(){
            // 计算总收益
            if (this.trade.pnl !== null){
                this.trade.total_pnl = this.trade.pnl + this.trade.position_pnl
            } else {
                this.trade.total_pnl = this.trade.position_pnl
            }

            // 计算price_diff_ptg(当前价格相对于开仓价格)
            if (this.trade.flags.last_tick){
                this.trade.price_diff_ptg = ((this.trade.flags.last_tick - this.trade.entry_price)*100/this.trade.entry_price).toFixed(2)
            }
            
            // 过滤掉没有成交的orders
            for(var i = 0; i < this.trade.orders.length; i++){
                if (this.trade.orders[i].exec_size > 0){
                    this.orders.push(this.trade.orders[i])
                }
            }
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,
        formatTimestamp: formatTimestamp,

    }
}
</script>