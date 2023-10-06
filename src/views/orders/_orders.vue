<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div class="app-container" align="center" >
        <div style="width: 95%; margin-top: 20px">
            <el-row :gutter="0" type="flex">
                <!----------------------------------- 订单详情 --------------------------------------->
                <el-table
                :data="orders"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="ordersLoading"
                >
                    <el-table-column align="center" label="时间" min-width="10%">
                        <template slot-scope="scope">
                            {{ utcToLocalTimestamp(scope.row.created_ts) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易所" min-width="5%">
                        <template slot-scope="scope">
                            {{ scope.row.worker.name.split('_')[0] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="标的" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.symbol }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="策略" min-width="8%">
                        <template slot-scope="scope">
                            {{ strategyAlias[scope.row.worker.name.split('_').slice(-1)[0].slice(0,-1)] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="策略ID" min-width="5%">
                        <template slot-scope="scope">
                            {{ scope.row.order_type == 'temp' ? 'N/A' : scope.row.worker.name.slice(-1,) }}
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
import { utcToLocalTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { chineseString } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'


export default {
    props: {
        orders: {
            type:Array,
            default:[]
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
        }
    },

    methods: {

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,

    }
}
</script>