<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 资产 --------------------------------------->
    <!-- 总资产 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>
                    资金
                </h2>    
            </el-col>
        </el-row>
        <!-- 总资产 -->
        <total-balance v-bind:pfo-datas="pfoWalletDatas" v-if="pfoWalletDatasAvailable" style="margin-bottom: 20px"></total-balance>
        <!-- 日收益 -->
        <daily-profit v-bind:pfo-datas="pfoWalletDatas" v-if="pfoWalletDatasAvailable"></daily-profit> 
        <!-- Pfo资产 -->
        <pfo-balances v-bind:pfo-datas="pfoWalletDatas" v-if="pfoWalletDatasAvailable"></pfo-balances> 
        <!-- 资产分布 -->
        <balance-distributions v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable" style="background-color: white; margin-bottom: 20px"></balance-distributions>
    </div>

    <!----------------------------------- 仓位 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>
                    仓位
                </h2>    
            </el-col>
        </el-row>
        <!-- 总仓位 -->
        <total-position v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable" style="margin-bottom: 20px"></total-position> 
        <!-- 仓位排名 -->
        <position-ranks v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable"></position-ranks> 
        <!-- Pfo仓位 -->
        <pfo-positions v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable"></pfo-positions>
    </div>

    <!----------------------------------- 策略(表现) --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>
                    策略
                </h2>    
            </el-col>
        </el-row>
        <!-- 总收益 -->
        <total-perf v-bind:pfo-datas="pfoPerfDatas" v-if="pfoPerfDatas.length === pfoHosts.length" style="margin-bottom: 20px"></total-perf>
        <!-- Pfo收益 -->
        <pfo-perfs v-bind:pfo-datas="pfoPerfDatas" v-if="pfoPerfDatas.length === pfoHosts.length" style="margin-bottom: 20px"></pfo-perfs>
        <!-- 日收益 -->
        <daily-total-profit v-bind:pfo-datas="pfoPerfDatas" v-if="pfoPerfDatas.length === pfoHosts.length" style="margin-bottom: 20px"></daily-total-profit>
        <!-- 收益排名 -->
        <profit-ranks v-bind:delegate-worker-datas="delegateWorkerDatas" v-if="delegateWorkerDatas.length === pfoHosts.length"></profit-ranks>
    </div>
  </div>
</template>

<script>
// Components
import totalBalance from '@/views/balance/total_balance'
import dailyProfit from '@/views/balance/daily_profit'
import pfoBalances from '@/views/balance/pfo_balances'
import balanceDistributions from '@/views/balance/balance_distributions'
import totalPosition from '@/views/position/total_position'
import positionRanks from '@/views/position/position_ranks'
import pfoPositions from '@/views/position/pfo_positions'
import totalPerf from '@/views/performance/total_perf'
import pfoPerfs from '@/views/performance/pfo_perfs'
import dailyTotalProfit from '@/views/performance/daily_profit'
import profitRanks from '@/views/performance/profit_ranks'

import config from '@/configs/system_configs'
import { getPortfolioDatas } from '@/api/portfolio' 
import { getSubAccountDatas} from '@/api/subaccount'
import { getDelegateWorkerDatas } from '@/api/worker'

export default {
    components: {
        totalBalance,
        dailyProfit,
        pfoBalances,
        balanceDistributions,

        totalPosition,
        positionRanks,
        pfoPositions,

        pfoPerfs,
        totalPerf,
        dailyTotalProfit,
        profitRanks,
    },

    data() {
        return {
            pfoWalletDatas: [],     
            pfoWalletDatasAvailable: false,

            subaccountDatas: [],
            subaccountDatasAvailable: false,

            pfoHosts: config.pfoHosts,
            pfoPerfDatas: [],
            delegateWorkerDatas: [],
            
            refreshInterval: 300000,
            intervalId: null
        }
    },

    created() {
        this.fetchDatas()
        this.dataRefreh()
    },

    methods: {
        // 获取所有数据
        fetchDatas(){
            // 1: 获取Balance Data (Master)
            this.fetchPfoWalletDatas()
            this.fetchSubAccountDatas()

            // 2: 获取Position Data (Master)

            // 3: 获取Perf Data (Pfo)
            this.fetchPfoPerfDatas()
            // 获取WorkerDatas
            this.fetchDelegateWorkerDatas()
        },

        // 从Master获取所有pfo的wallet data
        fetchPfoWalletDatas() {
            this.pfoWalletDatas = []
            getPortfolioDatas(config.masterHost, 'portfolio,wallet').then(response => {
                    this.pfoWalletDatas = response.results
                    this.pfoWalletDatasAvailable = true
                }
            )
        },

        // 从Master获取所有subaccount data
        fetchSubAccountDatas() {
            this.subaccountDatas = []
            getSubAccountDatas(config.masterHost).then(response => {
                    this.subaccountDatas = response.results
                    this.subaccountDatasAvailable = true
                }
            )
        },

        // 从Pfo获取所有pfo performance data
        fetchPfoPerfDatas() {
            this.pfoPerfDatas = []
            for(var i = 0; i < this.pfoHosts.length; i++){
                getPortfolioDatas(this.pfoHosts[i], 'portfolio,performance').then(response => {
                        this.pfoPerfDatas.push(response.results)
                    }
                )
            }
        },

        // 从Pfo获取所有 delegate worker performance data
        fetchDelegateWorkerDatas() {
            this.delegateWorkerDatas = []
            for(var i = 0; i < this.pfoHosts.length; i++){
                getDelegateWorkerDatas(this.pfoHosts[i], 'worker,performance').then(response => {
                        this.delegateWorkerDatas.push(response.results)
                    }
                )
            }
        },

        // 定时刷新数据函数
        dataRefreh() {
            // 计时器正在进行中，退出函数
            if (this.intervalId != null) {
                return;
            }

            // 计时器为空，操作
            this.intervalId = setInterval(() => {
                    console.log("刷新" + new Date());
                    this.fetchDatas(); //加载数据函数
                }, this.refreshInterval);
        }, 

        // 停止定时器
        clear() {
            clearInterval(this.intervalId); //清除计时器
            this.intervalId = null; //设置为null
        },
    },

    destroyed(){
        // 在页面销毁后，清除计时器
        this.clear();
    }
}
</script>