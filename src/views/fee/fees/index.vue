<template>
  <div class="app-container" style="background-color: lightgray" align="center">
    <!----------------------------------- 表1: 总费用曲线 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <total-fee
        v-bind:subaccount-datas="subaccountDatas"
        v-if="subaccountDatasAvailable"
        >
        </total-fee>
        <div style="margin-right: 65px; margin-top: 0px" align="right">
            <el-button style="" type="text" @click="fetchDatas()" >
                <i style="font-size:30px; color: gray " v-bind:class="{'el-icon-refresh': iconRefreshActive, 'el-icon-loading': iconLoadingActive}"></i>
            </el-button>   
        </div>    
    </div>

    <!----------------------------------- 表2: 月度柱状图 --------------------------------------->
    <!-- 总资产 -->
    <div style="background-color: white; margin-bottom: 20px">
        <month-fees
        v-bind:subaccount-datas="subaccountDatas"
        v-if="subaccountDatasAvailable"
        >
        </month-fees>
    </div>

    <!----------------------------------- 表3: 分布饼图 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <fee-distributions
        v-bind:subaccount-datas="subaccountDatas"
        v-if="subaccountDatasAvailable"
        >
        </fee-distributions> 
    </div>

    <!----------------------------------- 表格: 费率 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <fee-rates
        v-bind:subaccount-datas="subaccountDatas"
        v-if="subaccountDatasAvailable"
        >
        </fee-rates> 
    </div>

    <!----------------------------------- 表格: 费用明细 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <fee-details
        v-bind:subaccount-datas="subaccountDatas"
        v-if="subaccountDatasAvailable"
        >
        </fee-details> 
    </div>
  </div>
</template>

<script>
// Components
import totalFee from '@/views/fee/fees/total_fee'
import monthFees from '@/views/fee/fees/month_fees'
import feeDistributions from '@/views/fee/fees/fee_distributions'
import feeDetails from '@/views/fee/fees/fee_details'
import feeRates from '@/views/fee/fees/fee_rates'


import config from '@/configs/system_configs'
import { getSubAccountDatas } from '@/api/subaccount' 


export default {
    components: {
        totalFee,
        monthFees,
        feeDistributions,
        feeDetails,
        feeRates
    },

    data() {
        return {
            subaccountDatas: null,
            subaccountDatasAvailable: false,
            iconRefreshActive: true,
            iconLoadingActive: false
        }
    },

    created() {
        this.fetchDatas()
    },

    methods: {
        // 获取原始fee datas
        fetchDatas() {
            this.iconRefreshActive = false
            this.iconLoadingActive = true
            getSubAccountDatas(config.masterHost, 'subaccount,fees,fee_rates').then(response => {
                    this.subaccountDatas = response.results    
                    this.subaccountDatasAvailable = true     
                    // this.$message.success('费用数据已更新.')  
                    this.$message({
                        message: '费用数据已更新.',
                        type: 'success',
                        offset: 100
                    })
                    this.iconRefreshActive = true
                    this.iconLoadingActive = false
                }
            )
        }
     
    },
}
</script>