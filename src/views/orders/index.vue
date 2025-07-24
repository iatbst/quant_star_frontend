<template>
  <div class="app-container" style="background-color: lightgray" align="center">
    <div style="background-color: white; margin-bottom: 20px;">
        <orders 
        v-bind:orders="orders" 
        v-bind:orders-loading="ordersLoading"
        style="margin-bottom: 0px">
        </orders>

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
            pfoHosts: config.pfoHosts,
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
            var days = 3    // 默认展示最近3天
            var startDt = new Date(Date.now() - 24 * 3600 * 1000 * days).toISOString().slice(0, 19).replace('T', ' ')    // UTC
            var endDt = new Date().toISOString().slice(0, 19).replace('T', ' ')      // UTC
            var count = 0
            for(var i = 0; i < this.pfoHosts.length; i++){
                var host = this.pfoHosts[i]
                var filters = 'show_worker=true&no_parent_order=true&exec_size__gt=0&created_ts__gte=' + startDt + '&created_ts__lte=' + endDt
                getOrders(host, null, filters).then(response => {
                        count += 1
                        // 添加host
                        for(var i = 0; i < response.results.length; i++){
                            // 点击获取对应的trade时知道从那个host获取
                            response.results[i]["host"] = response.config.baseURL
                        }

                        this.orders = this.orders.concat(response.results)

                        if (count === this.pfoHosts.length){
                            // 排序
                            this.orders.sort((a, b) => b.created_ts.localeCompare(a.created_ts))
                            this.ordersLoading = false
                        }
                    }
                )
            }
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        toFixed: toFixed,
     
    },
}
</script>