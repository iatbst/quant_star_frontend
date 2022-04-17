<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 总表 + 长短仓位分布 --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="16">
        <div style="margin-left: 20px; margin-right: 20px; margin-top: 40px; margin-bottom: 40px">
            <summary-table 
            v-bind:summary-datas="[pfoMasterDatas, subaccountDatas, pfoDatas]" 
            v-if="pfoMasterDatasAvailable && subaccountDatasAvailable && pfoDatasAvailable" 
            style="margin-bottom: 20px">
            </summary-table>
        </div>
      </el-col>

      <el-col :span="8">
          <div style="margin-left: 0px; margin-top: 20px">
            <strategy-level-positions
            v-bind:pfo-datas="pfoMasterDatas" 
            v-if="pfoMasterDatasAvailable" 
            style="margin-bottom: 20px">
            </strategy-level-positions>
          </div>
      </el-col>
    </el-row>   

    <!---------------------------------- 资产曲线 + 交易所资金分布 ----------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
      <el-col :span="16">
          <div style="margin-bottom: 20px">
            <value-line 
            v-bind:pfo-datas="pfoMasterDatas" 
            v-if="pfoMasterDatasAvailable" 
            style="margin-bottom: 20px">
            </value-line>
          </div>
      </el-col>

      <el-col :span="8">
          <div style="margin-left: 0px; margin-top: 20px">
            <exchange-balance-distributions
            v-bind:subaccount-datas="subaccountDatas" 
            v-if="subaccountDatasAvailable"
            style="margin-bottom: 20px">
            </exchange-balance-distributions>
          </div>
      </el-col>
    </el-row> 
  </div>
</template>

<script>
// Components
import summaryTable from '@/views/dashboard/v2/summary_table'
import valueLine from '@/views/balance/_value_line'
import strategyLevelPositions from '@/views/position/_strategy_level_positions'
import exchangeBalanceDistributions from '@/views/balance/_exchange_balance_distributions'

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

export default {
    components: {
        summaryTable,

        valueLine,

        strategyLevelPositions,

        exchangeBalanceDistributions,




        totalBalance,
        pfoBalances,
        balanceDistributions,

        totalPosition,
        positionRanks,
        positionMap,

        pfoPerfs,
        totalPerf,
        profitRanks
    },

    data() {
        return {
          
            pfoHosts: config.pfoHosts,

            summaryDatas: [],

            pfoDatas: [],
            pfoDatasAvailable: false,

            pfoMasterDatas: [],     
            pfoMasterDatasAvailable: false,

            subaccountDatas: [],
            subaccountDatasAvailable: false,

            delegateWorkerDatas: [],

            positions: [],
            positionsAvailable: false,
            positionsLoading: false,
            
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
            this.fetchPfoDatasFromMaster()

            // 获取Subaccount Datas (Master)
            this.fetchSubAccountDatas()
            
            // 获取WorkerDatas (Pfo)
            // this.fetchDelegateWorkerDatas()

            // 获取Positions (Pfo)
            // this.fetchPositions()
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

        // 从Master获取所有pfo的wallet/position data
        fetchPfoDatasFromMaster() {
            this.pfoMasterDatas = []
            getPortfolioDatas(config.masterHost, 'portfolio,wallet,positions').then(response => {
                    this.pfoMasterDatas = response.results
                    this.pfoMasterDatasAvailable = true
                    // 排序
                    for(var i = 0; i < this.pfoMasterDatas.length; i++){
                        this.pfoMasterDatas[i]['sort_id'] = config.pfoSortWeights[this.pfoMasterDatas[i].portfolio.name]
                    }
                    this.pfoMasterDatas.sort((a, b) => a.sort_id - b.sort_id)                   
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
                            this.positionsLoading = false
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