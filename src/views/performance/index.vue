<template>
  <div class="app-container" style="background-color: lightgray">   
    <!-- 总收益 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>              
                </h2>    
            </el-col>
        </el-row>
        <total-perf v-bind:pfo-datas="pfoDatas" v-if="pfoDatas.length === pfoHosts.length"></total-perf>
    </div>

    <!-- Pfo收益 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>              
                </h2>    
            </el-col>
        </el-row>
        <pfo-perfs v-bind:pfo-datas="pfoDatas" v-if="pfoDatas.length === pfoHosts.length"></pfo-perfs>
    </div>

    <!-- 收益排名 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>              
                </h2>    
            </el-col>
        </el-row>
        <profit-ranks 
        v-bind:delegate-worker-datas="delegateWorkerDatas"
        v-bind:delegate-worker-datas-loading="delegateWorkerDatasLoading" 
        ></profit-ranks>
    </div>

    <!-- 表现详情 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h3>   
                    策略表现详情           
                </h3>    
            </el-col>
        </el-row>
        <perf-details 
        v-bind:delegate-worker-datas="delegateWorkerDatas" 
        v-bind:delegate-worker-datas-loading="delegateWorkerDatasLoading" 
        ></perf-details>
    </div>
  </div>
</template>


<script>
// Components
import totalPerf from './total_perf'
import pfoPerfs from './pfo_perfs'
import profitRanks from './profit_ranks'
import perfDetails from './perf_details'

import config from '@/configs/system_configs'
import { getDelegateWorkerDatas } from '@/api/worker'
import { getPortfolioDatas } from '@/api/portfolio' 

export default {
    components: {
        pfoPerfs,
        totalPerf,
        profitRanks,
        perfDetails,
    },

    data() {
        return {
            pfoHosts: config.pfoHosts,
            pfoDatas: null,
            delegateWorkerDatas: null,
            delegateWorkerDatasLoading: true,
        }
    },
    created() {
        // 获取PfoDatas
        this.fetchAllPfoDatas()

        // 获取WorkerDatas
        this.fetchAllDelegateWorkerDatas()
    },
    methods: {
        fetchAllPfoDatas() {
            this.pfoDatas = []
            for(var i = 0; i < this.pfoHosts.length; i++){
                getPortfolioDatas(this.pfoHosts[i], 'portfolio,performance').then(response => {
                        var data = response.results
                        data['sort_id'] = config.pfoAliasSortWeights[data[0].portfolio.alias]
                        this.pfoDatas.push(data)
                        if (this.pfoDatas.length === this.pfoHosts.length ){
                            // pfo排序
                            this.pfoDatas.sort((a, b) => a.sort_id - b.sort_id)
                        }
                    }
                )
            }
        },

        fetchAllDelegateWorkerDatas() {
            this.delegateWorkerDatas = []
            this.delegateWorkerDatasLoading = true
            for(var i = 0; i < this.pfoHosts.length; i++){
                getDelegateWorkerDatas(this.pfoHosts[i], 'worker,performance').then(response => {
                        this.delegateWorkerDatas.push(response.results)
                        if (this.delegateWorkerDatas.length === this.pfoHosts.length){
                            this.delegateWorkerDatasLoading = false
                        }
                    }
                )
            }
        },
    }
}

</script>