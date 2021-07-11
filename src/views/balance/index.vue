<template>
  <div class="app-container" style="background-color: lightgray">
    <!-- 总资产 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>              
                </h2>    
            </el-col>
        </el-row>
        <total-balance v-bind:pfo-datas="pfoDatas" v-if="pfoDatasAvailable"></total-balance> 
    </div>
    
    <!-- 日资产变化 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>          
                </h2>    
            </el-col>
        </el-row>
        <daily-profit v-bind:pfo-datas="pfoDatas" v-if="pfoDatasAvailable"></daily-profit> 
    </div>

    <!-- Pfo资产 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>          
                </h2>    
            </el-col>
        </el-row>
        <pfo-balances v-bind:pfo-datas="pfoDatas" v-if="pfoDatasAvailable" style="background-color: white; margin-bottom: 20px"></pfo-balances> 
    </div>

    <!-- 资产分布 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>          
                </h2>    
            </el-col>
        </el-row>
        <balance-distributions v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable" style="background-color: white; margin-bottom: 20px"></balance-distributions>
    </div>

    <!-- 资产明细 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h3>  
                    资产明细        
                </h3>    
            </el-col>
        </el-row>
        <balance-details v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable" style="background-color: white; margin-bottom: 20px"></balance-details>      
    </div>
  </div>
</template>


<script>
import totalBalance from '@/views/balance/total_balance'
import dailyProfit from '@/views/balance/daily_profit'
import pfoBalances from '@/views/balance/pfo_balances'
import balanceDistributions from '@/views/balance/balance_distributions'
import balanceDetails from '@/views/balance/balance_details'

import config from '@/configs/system_configs'
import { getSubAccountWalletDatas } from '@/api/subaccount'
import { getPortfolioDatas } from '@/api/portfolio' 


export default {
    components: {
        totalBalance,
        dailyProfit,
        pfoBalances,
        balanceDistributions,
        balanceDetails
    },

    data() {
        return {
            pfoDatas: null,    
            subaccountDatas: null,  
            subaccountDatasAvailable: false,
            pfoDatasAvailable: false,
        }
    },

    created() {
        // 初始化
        this.pfoDatas = []
        this.subaccountDatas = []

        // 获取Data
        this.fetchPfoWalletDatas()
        this.fetchSubAccountWalletDatas()
    },

    methods: {
        fetchSubAccountWalletDatas() {
            getSubAccountWalletDatas(config.masterHost, 'wallet,subaccount,portfolio').then(response => {
                    this.subaccountDatas = response.results
                    this.subaccountDatasAvailable = true
                }
            )
        },

        fetchPfoWalletDatas() {
            // 获取所有pfo的wallet data
            getPortfolioDatas(config.masterHost, 'portfolio,wallet').then(response => {
                    this.pfoDatas = response.results
                    this.pfoDatasAvailable = true
                }
            )
        }
    }
}
</script>