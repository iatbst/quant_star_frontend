<template>
  <div class="app-container" style="background-color: lightgray" align="center">
    <div style="background-color: white; margin-bottom: 0px;">
        <!-- 保持底部20px margin ! -->
        <div>
            <el-row style="margin-bottom: 20px">
            </el-row>
        </div>

        <div style="margin-left: 20px; margin-right: 20px;">
            <el-row :gutter="0" type="flex" >
                <!----------------------------------- 订单详情 --------------------------------------->
                <el-table
                :data="orders"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="ordersLoading"
                :cell-style="{cursor: 'pointer'}"
                >
                    <el-table-column align="center" label="币种" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.symbol.split('/')[0] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="时间" min-width="10%">
                        <template slot-scope="scope">
                            {{ utcToLocalTimestamp(scope.row.created_ts) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易所" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.worker.name.split('_')[0] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易" min-width="10%">
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
                            <div v-if="scope.row.exec_size !== null">
                                {{ scope.row.exec_size }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="价格" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.exec_avg_price !== null">
                                {{ toFixed(scope.row.exec_avg_price, 2) }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="成交额" min-width="10%">
                        <template slot-scope="scope">
                            <div v-if="scope.row.exec_size !== null && scope.row.exec_avg_price !== null">
                                {{ toThousands(toFixed(scope.row.exec_avg_price * scope.row.exec_size, 0)) }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table> 

            </el-row>
        </div>

        <!-- 保持底部20px margin ! -->
        <div>
            <el-row style="margin-top: 20px">
            </el-row>
        </div>
    </div>
  </div>
</template>

<script>
// Components
import orders from '@/views/orders/_orders'
import config from '@/configs/system_configs'
import { utcToLocalTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { getOrders } from '@/api/order'
import { chineseString } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'


export default {
    components: {
        orders
    },

    data() {
        return {
            masterHost: config.masterHost,
            orders: [],
            ordersLoading: false,
        }
    },

    created() {
        this.fetchOrders()
    },

    methods: {   
        fetchOrders(){
            this.orders = []
            this.ordersLoading = true
            var filters = 'show_worker=true&exec_mode=manual'
            getOrders(this.masterHost, null, filters).then(response => {
                    this.orders = this.orders.concat(response.results)

                    // 排序
                    this.orders.sort((a, b) => b.created_ts.localeCompare(a.created_ts))
                    this.ordersLoading = false
                }
            )
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,
     
    },
}
</script>