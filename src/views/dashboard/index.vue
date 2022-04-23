<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 总表 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <summary-table 
        v-bind:summary-datas="[pfoWalletDatas, subaccountDatas, pfoDatas]" 
        v-if="pfoWalletDatasAvailable && subaccountDatasAvailable && pfoDatasAvailable" style="margin-bottom: 20px"></summary-table>
    </div>

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
        <!-- Pfo资产 -->
        <pfo-balances v-bind:pfo-datas="pfoWalletDatas" v-if="pfoWalletDatasAvailable"></pfo-balances> 
        <!-- 资产分布 -->
        <balance-distributions v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable" style="background-color: white; margin-bottom: 20px"></balance-distributions>
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
        <total-perf v-bind:pfo-datas="pfoDatas" v-if="pfoDatasAvailable" style="margin-bottom: 20px"></total-perf>
        <!-- Pfo收益 -->
        <pfo-perfs v-bind:pfo-datas="pfoDatas" v-if="pfoDatasAvailable" style="margin-bottom: 20px"></pfo-perfs>
        <!-- 收益排名 -->
        <profit-ranks v-bind:delegate-worker-datas="delegateWorkerDatas" v-if="delegateWorkerDatas.length === pfoHosts.length"></profit-ranks>
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
        <!-- 仓位详情 -->
        <position-map 
        v-bind:positions="positions" 
        v-bind:positions-loading="positionsLoading"
        v-bind:product-volumes="productVolumes"
        ></position-map> 
    </div>
  </div>
</template>

<script>
// Components
import summaryTable from '@/views/dashboard/summary_table'
import totalBalance from '@/views/balance/total_balance'
import pfoBalances from '@/views/balance/pfo_balances'
import balanceDistributions from '@/views/balance/balance_distributions'
import totalPosition from '@/views/position/total_position'
import positionRanks from '@/views/position/position_ranks'
import totalPerf from '@/views/performance/total_perf'
import pfoPerfs from '@/views/performance/pfo_perfs'
import profitRanks from '@/views/performance/profit_ranks'
import positionMap from '@/views/position/position_map'

import config from '@/configs/system_configs'
import { getPortfolioDatas } from '@/api/portfolio' 
import { getSubAccountDatas} from '@/api/subaccount'
import { getDelegateWorkerDatas } from '@/api/worker'
import { getPositions } from '@/api/position'
import { getProductDatas } from '@/api/product'

export default {
    components: {
        summaryTable,

        totalBalance,
        pfoBalances,
        balanceDistributions,

        totalPosition,
        positionRanks,
        positionMap,

        pfoPerfs,
        totalPerf,
        profitRanks,
    },

    data() {
        return {
            pfoHosts: config.pfoHosts,

            summaryDatas: [],

            pfoDatas: [],
            pfoDatasAvailable: false,

            pfoWalletDatas: [],     
            pfoWalletDatasAvailable: false,

            subaccountDatas: [],
            subaccountDatasAvailable: false,

            delegateWorkerDatas: [],

            positions: [],
            positionsAvailable: false,
            positionsLoading: false,

            productVolumes: {},
            productVolumesAvailable: false,
            
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
            // 获取Pfo Datas (Pfo)
            this.fetchPfoDatas()

            // 获取Pfo Wallet Data (Master)
            this.fetchPfoWalletDatas()

            // 获取Subaccount Datas (Master)
            this.fetchSubAccountDatas()
            
            // 获取WorkerDatas (Pfo)
            this.fetchDelegateWorkerDatas()

            // 获取Positions (Pfo)
            this.fetchPositions()

            // 获取Product Volumes (Pfo)
            this.fetchProductVolumes()
        },

        // 从Pfo获取所有的volume data
        fetchProductVolumes(){
            this.productVolumes = {}
            var productVolumesCount = 0
            this.productVolumesAvailable = false
            for(var i = 0; i < this.pfoHosts.length; i++){
                getProductDatas(this.pfoHosts[i], 'product,volumes').then(response => {
                        for(var i=0; i < response.results.length; i++){
                            var key = response.results[i].product.name.slice(1).join('_')   // 转化为: exchange_sub-type_symbol形式， eg binance_swap_btc/usdt
                            this.productVolumes[key] = response.results[i].volumes.volume_weight
                        }
                        productVolumesCount += 1
                        if (productVolumesCount === this.pfoHosts.length ){
                            this.productVolumesAvailable = true
                            if (this.positionsAvailable) {
                               this.positionsLoading = false 
                            }
                        }
                    }
                )
            }
        },            

        // 从Pfo获取所有pfo data
        fetchPfoDatas() {
            this.pfoDatas = []
            for(var i = 0; i < this.pfoHosts.length; i++){
                getPortfolioDatas(this.pfoHosts[i]).then(response => {
                        var data = response.results
                        data['sort_id'] = config.pfoAliasSortWeights[data[0].portfolio.alias]
                        this.pfoDatas.push(data)
                        if (this.pfoDatas.length === this.pfoHosts.length ){
                            // pfo排序
                            this.pfoDatas.sort((a, b) => a.sort_id - b.sort_id)
                            this.pfoDatasAvailable = true
                        }
                    }
                )
            }
        },

        // 从Master获取所有pfo的wallet data
        fetchPfoWalletDatas() {
            this.pfoWalletDatas = []
            getPortfolioDatas(config.masterHost, 'portfolio,wallet').then(response => {
                    this.pfoWalletDatas = response.results
                    this.pfoWalletDatasAvailable = true
                    // 排序
                    for(var i = 0; i < this.pfoWalletDatas.length; i++){
                        this.pfoWalletDatas[i]['sort_id'] = config.pfoSortWeights[this.pfoWalletDatas[i].portfolio.name]
                    }
                    this.pfoWalletDatas.sort((a, b) => a.sort_id - b.sort_id)                   
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

        // 从Pfo获取所有positions(normal workers)
        fetchPositions() {
            this.positions = []
            var count = 0
            this.positionsLoading = true
            this.positionsAvailable = false
            for(var i = 0; i < this.pfoHosts.length; i++){
                getPositions(this.pfoHosts[i], 'normal').then(response => {
                        count += 1
                        var pfoPositions = response.results
                        // 每个position添加host信息
                        for (let j = 0; j < pfoPositions.length; j++){
                            pfoPositions[j]['host'] = response.config.baseURL
                        }
                        this.positions = this.positions.concat(pfoPositions)
                        if (count === this.pfoHosts.length ){
                            // 排序
                            // this.positions.sort((a, b) => a.worker - b.worker)
                            this.positionsAvailable = true
                            if (this.productVolumesAvailable){
                               this.positionsLoading = false 
                            }
                        }
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