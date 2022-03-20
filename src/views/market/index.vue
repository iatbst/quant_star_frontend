<template>
  <div class="app-container" style="">   
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <el-col :span="4">
        <div class="grid-content">
          <!-- 所有的Portfolios -->
          <portfolios 
          v-bind:portfolios="portfolios"
          v-bind:portfolios-loading="portfoliosLoading"
          v-bind:current-pfo="currentPfo"
          @onClickPfo="onClickPfo"></portfolios>
        </div>
      </el-col>

      <el-col :span="20">
        <div class="grid-content" align="center">
            <!-- 表1: Normal Symbols -->
            <el-table
                :data="workerDatas"
                style="width: 95%; margin-bottom: 20px; margin-top: 45px"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="workerDatasLoading"
            >
                <el-table-column label="标的" min-width="20%" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.symbol }}
                    </template>
                </el-table-column>

                <el-table-column label="状态" min-width="20%" align="center">
                    <template slot-scope="scope">
                        <span style="color: green" v-if="scope.row.status === 'live'">
                            {{ chineseString(scope.row.status) }}
                        </span>
                        <span style="color: red" v-else>
                            {{ chineseString(scope.row.status) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="近期成交量($/天)" min-width="20%" align="center">
                    <template slot-scope="scope">
                        {{ toThousands(scope.row.avg_usdt_volume) }}
                    </template>
                </el-table-column>

                <el-table-column label="成交量级别" prop="count" min-width="20%" align="center">
                    <template slot-scope="scope">
                    {{ scope.row.volume_weight }}
                    </template>
                </el-table-column>

                <el-table-column label="近期滑点" min-width="20%" align="center">
                    <template slot-scope="scope">
                        <span style="color: green" v-if="scope.row.late_weighted_slippage >= 0">
                            {{ (scope.row.late_weighted_slippage*100).toFixed(2) }}%
                        </span>
                        <span style="color: red" v-else>
                            {{ (scope.row.late_weighted_slippage*100).toFixed(2) }}%
                        </span> 
                    </template>
                </el-table-column>

                <el-table-column label="总滑点" min-width="20%" align="center">
                    <template slot-scope="scope">
                        <span style="color: green" v-if="scope.row.weighted_slippage >= 0">
                            {{ (scope.row.weighted_slippage*100).toFixed(2) }}%
                        </span>
                        <span style="color: red" v-else>
                            {{ (scope.row.weighted_slippage*100).toFixed(2) }}%
                        </span> 
                    </template>
                </el-table-column>

                <el-table-column label="上线天数" min-width="20%" align="center">
                <template slot-scope="scope">
                    {{ scope.row.live_days }}
                </template>
                </el-table-column>

                <el-table-column label="交易次数" min-width="20%" align="center">
                <template slot-scope="scope">
                    {{ scope.row.count }}
                </template>
                </el-table-column>

                <el-table-column label="胜率" min-width="20%" align="center">
                <template slot-scope="scope">
                    {{ (scope.row.win_ptg*100).toFixed(2) }}%
                </template>
                </el-table-column>

                <el-table-column label="历史总收益($)" min-width="20%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.profit >= 0">
                        {{ toThousands(scope.row.profit) }}
                    </span>
                    <span style="color: red" v-else>
                        {{ toThousands(scope.row.profit) }}
                    </span>
                </template>
                </el-table-column>
            </el-table>            


            <!-- 表2: Potential Symbols -->
                <el-table
                    :data="potentialSymbolDatas"
                    style="width: 95%; margin-bottom: 20px; margin-top: 45px"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    v-loading="potentialSymbolDatasLoading"
                >
                    <el-table-column label="标的" min-width="20%" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.symbol }}
                        </template>
                    </el-table-column>

                    <el-table-column label="近期成交量($/天)" min-width="20%" align="center">
                        <template slot-scope="scope">
                            {{ toThousands(scope.row.avg_usdt_volume) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="成交量级别" prop="count" min-width="20%" align="center">
                        <template slot-scope="scope">
                        {{ scope.row.volume_weight }}
                        </template>
                    </el-table-column>

                    <el-table-column label="存续月数" min-width="20%" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.alive_months }}
                    </template>
                    </el-table-column>
                </el-table>             
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import portfolios from '@/views/portfolio/_portfolios'
import config from '@/configs/system_configs'
import { getDelegateWorkerDatas } from '@/api/worker'
import { getPortfolioDatas, getPortfolioDataByName } from '@/api/portfolio' 
import { getPortfolios } from '@/api/portfolio' 
import {toThousands} from '@/utils/general'
import { chineseString } from '@/utils/chinese'

export default {
    components: {
        portfolios
    },

    data() {
        return {
            portfolios: null,
            portfoliosLoading: true,
            currentPfo: null,

            pfoHosts: config.pfoHosts,
            pfoDatas: null,
            delegateWorkerDatas: null,
            workerDatasLoading: true,

            workerDatas: null,
            pfoMarketDatas: null,
            pfoMarketDatasLoading: true,
            workerSymbols: null,

            potentialSymbolDatas: null,
            potentialSymbolDatasLoading: true,

            invalidPfo: 'crypto_cta_pr_altbtc',
            
            // 潜力symbol对vol和存续期的要求
            potentialSymbolMonths: 3,   // 存续期要求
            potentialSymbolVolWeight: 1,    // 成交量要求
        }
    },
    created() {
        this.fetechAllPfos()

        // 获取WorkerDatas
        // this.fetchAllDelegateWorkerDatas()
    },
    methods: {
        // 初始化: 展示所有pfo(除了invalidPfo)
        fetechAllPfos() {
            this.portfoliosLoading = true
            this.portfolios = []
            var request_count = 0
            for (var i = 0; i < this.pfoHosts.length; i++){
                getPortfolios(this.pfoHosts[i]).then(response => {
                    var pfoName = response.results[0]['name']
                    if (pfoName !== this.invalidPfo){
                        this.portfolios = this.portfolios.concat(response.results)
                    }
                    response.results[0]['sort_id'] = config.pfoSortWeights[pfoName]
                    request_count += 1
                    if (request_count == this.pfoHosts.length){
                        // pfo加载完成
                        this.portfolios.sort((a, b) => a.sort_id - b.sort_id)
                        this.portfoliosLoading = false
                        if (this.portfolios.length > 0){
                            this.onClickPfo(this.portfolios[0])
                        }
                    }
                })
            }
        },

        // 选择Pfo时: 更新3张表格
        onClickPfo(pfo){
            this.currentPfo = pfo
            this.workerDatas = []
            this.pfoMarketDatas = {}
            this.workerSymbols = new Set()
            this.fetchPfoMarketDatas()
            this.fetchDelegateWorkerDatas()
        },

        // market data 和 worker data都准备好了
        allDataReady(marketData, workerDatas){
            // 把vol data添加到workerDatas上
            this.updateVolDatas(marketData, workerDatas)
            
            // 准备potentialSymbolDatas
            this.preparePotentialSymbolDatas(marketData)
        },

        // 筛选出有潜力的symbols
        // 1: 不在当前的worker中
        // 2: 满足成交量和存续要求
        preparePotentialSymbolDatas(marketData){
            this.potentialSymbolDatas = []
            this.potentialSymbolDatasLoading = true
            
            for (let symbol in marketData){
                if (!this.workerSymbols.has(symbol)){
                    if(marketData[symbol].volume_weight >= this.potentialSymbolVolWeight && 
                        marketData[symbol].alive_months >= this.potentialSymbolMonths){
                        // 满足条件
                        this.potentialSymbolDatas.push({
                            symbol: symbol,
                            avg_usdt_volume: Math.round(marketData[symbol].avg_usdt_volume),
                            volume_weight: marketData[symbol].volume_weight,
                            alive_months: marketData[symbol].alive_months,
                        })
                    }
                }
            }
            // 排序
            this.potentialSymbolDatas.sort((a, b) => b.avg_usdt_volume - a.avg_usdt_volume)
            this.potentialSymbolDatasLoading = false
        },

        updateVolDatas(marketData, workerDatas){
            for(let i = 0; i < workerDatas.length; i++){
                var symbol = workerDatas[i].symbol
                // debugger
                workerDatas[i].avg_usdt_volume = Math.round(marketData[symbol].avg_usdt_volume)
                workerDatas[i].volume_weight = marketData[symbol].volume_weight
            }
            // 根据avg_usdt_volume排序
            workerDatas.sort((a, b) => b.avg_usdt_volume - a.avg_usdt_volume)
        },

        fetchPfoMarketDatas() {
            this.pfoMarketDatasLoading = true
            this.potentialSymbolDatasLoading = true
            getPortfolioDataByName(this.currentPfo.name, config.masterHost, 'market').then(response => {
                    this.pfoMarketDatas = response.results[0].market
                    this.pfoMarketDatasLoading = false
                    if (this.workerDatasLoading === false){
                        this.allDataReady(this.pfoMarketDatas, this.workerDatas)
                    }
                }
            )
        },

        fetchDelegateWorkerDatas() {
            this.workerDatasLoading = true
            getDelegateWorkerDatas(this.currentPfo.host, 'worker,performance').then(response => {
                    this.delegateWorkerDatas = response.results
                    // 解析数据
                    for(let i = 0; i < this.delegateWorkerDatas.length; i++){
                        var data = this.delegateWorkerDatas[i]
                        var symbol = data.worker.name.split('_').slice(-2, -1)[0].toUpperCase()
                        this.workerSymbols.add(symbol)
                        this.workerDatas.push({
                            symbol: symbol,
                            status: data.worker.sub_status,
                            avg_usdt_volume: null,
                            volume_weight: null,
                            late_weighted_slippage: data.performance.summary.late_weighted_slippage,
                            weighted_slippage: data.performance.summary.weighted_slippage,
                            live_days: data.performance.summary.live_days,
                            count: data.performance.summary.count,
                            win_ptg: data.performance.summary.win_ptg,
                            profit: Math.round(data.performance.summary.profit)
                        })
                    }
                    this.workerDatasLoading = false
                    if (this.pfoMarketDatasLoading === false){
                        this.allDataReady(this.pfoMarketDatas, this.workerDatas)
                    }
                }
            )
        },

        toThousands: toThousands,
        chineseString: chineseString,

    }
}

</script>

<style>
  .el-row {
    margin-bottom: -40px;
    &:last-child {
      margin-bottom: 0;
    };
    &:first-child {
      margin-top: 0px;
    };
    padding: 0px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-table__row>td{
    border: none;
    padding: 5px;
  }
  .el-table::before {
    height: 0px;
  }
</style>