<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 币种仓位ranks ---------------------------------------
        函数:fetchPositions 
        更新频率: ?
    --->  
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <position-ranks2
            v-bind:positions="positions"
            v-bind:title="'数字货币仓位排名'"
            v-if="
            tbBinancePositionsAvailable && tbOkexPositionsAvailable && tbBybitPositionsAvailable && tbBitgetPositionsAvailable &&
            rsiOkexPositionsAvailable && rsiBybitPositionsAvailable && rsiBinancePositionsAvailable &&
            inOkexPositionsAvailable && inBybitPositionsAvailable && inBinancePositionsAvailable &&
            prmOkexPositionsAvailable && prmBybitPositionsAvailable && prmBinancePositionsAvailable &&
            dadOkexPositionsAvailable && dadBybitPositionsAvailable && dadBinancePositionsAvailable
            "
            ></position-ranks2> 

            <!--- 刷新说明 
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        仓位排名: 每间隔5分钟刷新1次(非整点)
                    </div>
                    <span style="color: gray; font-size: 12px"><i class="el-icon-info"></i>说明</span>
                </el-tooltip>
            </div>
            -->
          </div>
      </el-col>
    </el-row>

    <!----------------------------------- 仓位 ---------------------------------------
        函数:fetchPositions 
        更新频率: ?
    --->  
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <!-- tb_binance -->
            <position-map2 
            v-bind:positions="tbBinancePositions" 
            v-bind:positions-loading="tbBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'T'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="binanceSortWeights"
            v-if="tbBinancePositionsAvailable"
            ></position-map2> 
            
            <position-map2 
            v-bind:positions="tbOkexPositions" 
            v-bind:positions-loading="tbOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'T'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="okexSortWeights"
            v-if="tbOkexPositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="tbBybitPositions" 
            v-bind:positions-loading="tbBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'T'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="bybitSortWeights"
            v-if="tbBybitPositionsAvailable"
            ></position-map2>

            <position-map2 
            v-bind:positions="tbBitgetPositions" 
            v-bind:positions-loading="tbBitgetPositionsLoading"
            v-bind:exchange="'Bitget'"
            v-bind:strategy="'T'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="bitgetSortWeights"
            v-if="tbBitgetPositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="inBinancePositions" 
            v-bind:positions-loading="inBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'IN'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="binanceSortWeights"
            v-if="tbBinancePositionsAvailable && inBinancePositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="inOkexPositions" 
            v-bind:positions-loading="inOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'IN'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="okexSortWeights"
            v-if="tbOkexPositionsAvailable && inOkexPositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="inBybitPositions" 
            v-bind:positions-loading="inBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'IN'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="bybitSortWeights"
            v-if="tbBybitPositionsAvailable && inBybitPositionsAvailable"
            ></position-map2> 


            <position-map2 
            v-bind:positions="prmBinancePositions" 
            v-bind:positions-loading="prmBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'PRM'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="binanceSortWeights"
            v-if="tbBinancePositionsAvailable && prmBinancePositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="prmOkexPositions" 
            v-bind:positions-loading="prmOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'PRM'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="okexSortWeights"
            v-if="tbOkexPositionsAvailable && prmOkexPositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="prmBybitPositions" 
            v-bind:positions-loading="prmBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'PRM'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="bybitSortWeights"
            v-if="tbBybitPositionsAvailable && prmBybitPositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="rsiBinancePositions" 
            v-bind:positions-loading="rsiBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="binanceSortWeights"
            v-if="tbBinancePositionsAvailable && rsiBinancePositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="rsiOkexPositions" 
            v-bind:positions-loading="rsiOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="okexSortWeights"
            v-if="tbOkexPositionsAvailable && rsiOkexPositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="rsiBybitPositions" 
            v-bind:positions-loading="rsiBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="bybitSortWeights"
            v-if="tbBybitPositionsAvailable && rsiBybitPositionsAvailable"
            ></position-map2> 
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        策略展示顺序: 外循环根据k线级别;内循环根据参数顺序.(eg, 6h_1, 6h_2, 6h_3, 6h_4,  .... 48h_3, 48h_4)
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-info"></i>RSI策略顺序说明</span>
                </el-tooltip>
            </div>

            <position-map2 
            v-bind:positions="dadBinancePositions" 
            v-bind:positions-loading="dadBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'AD'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="binanceSortWeights"
            ></position-map2> 

            <position-map2 
            v-bind:positions="dadOkexPositions" 
            v-bind:positions-loading="dadOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'AD'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="okexSortWeights"
            ></position-map2> 

            <position-map2 
            v-bind:positions="dadBybitPositions" 
            v-bind:positions-loading="dadBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'AD'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="bybitSortWeights"
            ></position-map2> 

            <!--- 刷新说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        策略仓位明细: 每间隔5分钟刷新1次(非整点)
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-refresh"></i>说明</span>
                </el-tooltip>
            </div>
         </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// Components
import positionMap2 from '@/views/position/position_map2'
import config from '@/configs/system_configs'
import { getPositions } from '@/api/position'
import positionRanks2 from '@/views/position/position_ranks2'

export default {
    components: {
        positionMap2,
        positionRanks2
    },

    data() {
        return { 
            pfoHosts: config.pfoHosts,
            tbBinanceHosts: config.tbBinanceHosts,
            tbOkexHosts: config.tbOkexHosts,
            tbBybitHosts: config.tbBybitHosts,
            tbBitgetHosts: config.tbBitgetHosts,
            rsiOkexHosts: config.rsiOkexHosts,
            rsiBybitHosts: config.rsiBybitHosts,
            rsiBinanceHosts: config.rsiBinanceHosts,
            inOkexHosts: config.inOkexHosts,
            inBybitHosts: config.inBybitHosts,
            inBinanceHosts: config.inBinanceHosts,
            prmOkexHosts: config.prmOkexHosts,
            prmBybitHosts: config.prmBybitHosts,
            prmBinanceHosts: config.prmBinanceHosts,
            dadOkexHosts: config.dadOkexHosts,
            dadBybitHosts: config.dadBybitHosts,
            dadBinanceHosts: config.dadBinanceHosts,
            binanceSortWeights: {},
            okexSortWeights: {},
            bybitSortWeights: {},
            bitgetSortWeights: {},

            positions: [],
            positionsAvailable: false,
            positionsLoading: false,

            tbBinancePositions: [],
            tbBinancePositionsAvailable: false,
            tbBinancePositionsLoading: false,
            tbOkexPositions: [],
            tbOkexPositionsAvailable: false,
            tbOkexPositionsLoading: false,
            tbBybitPositions: [],
            tbBybitPositionsAvailable: false,
            tbBybitPositionsLoading: false,
            tbBitgetositions: [],
            tbBitgetPositionsAvailable: false,
            tbBitgetPositionsLoading: false,
            rsiOkexPositions: [],
            rsiOkexPositionsAvailable: false,
            rsiOkexPositionsLoading: false,
            rsiBybitPositions: [],
            rsiBybitPositionsAvailable: false,
            rsiBybitPositionsLoading: false,
            rsiBinancePositions: [],
            rsiBinancePositionsAvailable: false,
            rsiBinancePositionsLoading: false,
            lrOkexPositions: [],
            lrOkexPositionsAvailable: false,
            lrOkexPositionsLoading: false,
            lrBybitPositions: [],
            lrBybitPositionsAvailable: false,
            lrBybitPositionsLoading: false,
            lrBinancePositions: [],
            lrBinancePositionsAvailable: false,
            lrBinancePositionsLoading: false,
            inOkexPositions: [],
            inOkexPositionsAvailable: false,
            inOkexPositionsLoading: false,
            inBybitPositions: [],
            inBybitPositionsAvailable: false,
            inBybitPositionsLoading: false,
            inBinancePositions: [],
            inBinancePositionsAvailable: false,
            inBinancePositionsLoading: false,
            prmOkexPositions: [],
            prmOkexPositionsAvailable: false,
            prmOkexPositionsLoading: false,
            prmBybitPositions: [],
            prmBybitPositionsAvailable: false,
            prmBybitPositionsLoading: false,
            prmBinancePositions: [],
            prmBinancePositionsAvailable: false,
            prmBinancePositionsLoading: false,
            dadOkexPositions: [],
            dadOkexPositionsAvailable: false,
            dadOkexPositionsLoading: false,
            dadBybitPositions: [],
            dadBybitPositionsAvailable: false,
            dadBybitPositionsLoading: false,
            dadBinancePositions: [],
            dadBinancePositionsAvailable: false,
            dadBinancePositionsLoading: false,

            refreshInterval: 1000,
            refreshIntervalId: null,
            fastRefreshInterval: 60000,
            fastIntervalId: null,
            slowRefreshInterval: 300000,
            slowIntervalId: null,
            positionsRefresh: null,
        }
    },

    created() {
        this.fetchPositions()
        this.refresh()
    },

    methods: {
        // 从Pfo获取所有positions(normal workers)
        // 注意: 其他pfo必须等待tb加载后才加载(tb负责coin weights的更新), tb pfo的products必须赋值weight, 至少前10大币种要赋值!
        fetchPositions() {
            this.positionsRefresh = new Date()

            // 所有positions
            this.positions = []
            this.positionsAvailable = false
            this.positionsLoading = true

            // tb binance
            this.tbBinancePositions = []
            var tbBinanceCount = 0
            this.tbBinancePositionsLoading = true
            this.tbBinancePositionsAvailable = false
            for(var i = 0; i < this.tbBinanceHosts.length; i++){
                getPositions(this.tbBinanceHosts[i], 'normal').then(response => {
                        tbBinanceCount += 1
                        var positions = response.results

                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL

                            // tb策略负责coin权重
                            var coin = positions[j].worker.name.split('/')[0].split('_').slice(-1,)[0]
                            if (!(coin in this.binanceSortWeights)){
                                this.binanceSortWeights[coin] = positions[j].worker.product_weight == null ? 0 : positions[j].worker.product_weight    // NULL则赋值0
                            }
                        }
                        this.tbBinancePositions = this.tbBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBinanceCount === this.tbBinanceHosts.length ){
                            // tb策略负责coin权重: weight按照ABC再次排序
                            this.binanceSortWeights = this.rebuildWeights(this.binanceSortWeights)

                            // 排序
                            this.tbBinancePositionsAvailable = true
                            this.tbBinancePositionsLoading = false
                        }
                    }
                )
            }
            
            // 暂时取消除了binance_tb之外的其他pfo
            // tb okex
            this.tbOkexPositions = []
            var tbOkexCount = 0
            this.tbOkexPositionsLoading = true
            this.tbOkexPositionsAvailable = false
            for(var i = 0; i < this.tbOkexHosts.length; i++){
                getPositions(this.tbOkexHosts[i], 'normal').then(response => {
                        tbOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL

                            // tb策略负责coin权重
                            var coin = positions[j].worker.name.split('/')[0].split('_').slice(-1,)[0]
                            if (!(coin in this.okexSortWeights)){
                                this.okexSortWeights[coin] = positions[j].worker.product_weight == null ? 0 : positions[j].worker.product_weight    // NULL则赋值0
                            }
                        }
                        this.tbOkexPositions = this.tbOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbOkexCount === this.tbOkexHosts.length ){
                            // tb策略负责coin权重: weight按照ABC再次排序
                            this.okexSortWeights = this.rebuildWeights(this.okexSortWeights)

                            // 排序
                            this.tbOkexPositionsAvailable = true
                            this.tbOkexPositionsLoading = false
                        }
                    }
                )
            }

            // tb bybit
            this.tbBybitPositions = []
            var tbBybitCount = 0
            this.tbBybitPositionsLoading = true
            this.tbBybitPositionsAvailable = false
            for(var i = 0; i < this.tbBybitHosts.length; i++){
                getPositions(this.tbBybitHosts[i], 'normal').then(response => {
                        tbBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL

                            // tb策略负责coin权重
                            var coin = positions[j].worker.name.split('/')[0].split('_').slice(-1,)[0]
                            if (!(coin in this.bybitSortWeights)){
                                this.bybitSortWeights[coin] = positions[j].worker.product_weight == null ? 0 : positions[j].worker.product_weight    // NULL则赋值0
                            }
                        }
                        this.tbBybitPositions = this.tbBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBybitCount === this.tbBybitHosts.length ){
                            // tb策略负责coin权重: weight按照ABC再次排序
                            this.bybitSortWeights = this.rebuildWeights(this.bybitSortWeights)

                            // 排序
                            this.tbBybitPositionsAvailable = true
                            this.tbBybitPositionsLoading = false
                        }
                    }
                )
            }

            // tb bitget
            this.tbBitgetPositions = []
            var tbBitgetCount = 0
            this.tbBitgetPositionsLoading = true
            this.tbBitgetPositionsAvailable = false
            for(var i = 0; i < this.tbBitgetHosts.length; i++){
                getPositions(this.tbBitgetHosts[i], 'normal').then(response => {
                        tbBitgetCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL

                            // tb策略负责coin权重
                            var coin = positions[j].worker.name.split('/')[0].split('_').slice(-1,)[0]
                            if (!(coin in this.bitgetSortWeights)){
                                this.bitgetSortWeights[coin] = positions[j].worker.product_weight == null ? 0 : positions[j].worker.product_weight    // NULL则赋值0
                            }
                        }
                        this.tbBitgetPositions = this.tbBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBitgetCount === this.tbBitgetHosts.length ){
                            // tb策略负责coin权重: weight按照ABC再次排序
                            this.bitgetSortWeights = this.rebuildWeights(this.bitgetSortWeights)

                            // 排序
                            this.tbBitgetPositionsAvailable = true
                            this.tbBitgetPositionsLoading = false
                        }
                    }
                )
            }

            // rsi okex
            this.rsiOkexPositions = []
            var rsiOkexCount = 0
            this.rsiOkexPositionsLoading = true
            this.rsiOkexPositionsAvailable = false
            for(var i = 0; i < this.rsiOkexHosts.length; i++){
                getPositions(this.rsiOkexHosts[i], 'normal').then(response => {
                        rsiOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.rsiOkexPositions = this.rsiOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (rsiOkexCount === this.rsiOkexHosts.length ){
                            // 排序
                            this.rsiOkexPositionsAvailable = true
                            this.rsiOkexPositionsLoading = false
                        }
                    }
                )
            }

            // rsi bybit
            this.rsiBybitPositions = []
            var rsiBybitCount = 0
            this.rsiBybitPositionsLoading = true
            this.rsiBybitPositionsAvailable = false
            for(var i = 0; i < this.rsiBybitHosts.length; i++){
                getPositions(this.rsiBybitHosts[i], 'normal').then(response => {
                        rsiBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.rsiBybitPositions = this.rsiBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (rsiBybitCount === this.rsiBybitHosts.length ){
                            // 排序
                            this.rsiBybitPositionsAvailable = true
                            this.rsiBybitPositionsLoading = false
                        }
                    }
                )
            }

            // rsi binance
            this.rsiBinancePositions = []
            var rsiBinanceCount = 0
            this.rsiBinancePositionsLoading = true
            this.rsiBinancePositionsAvailable = false
            for(var i = 0; i < this.rsiBinanceHosts.length; i++){
                getPositions(this.rsiBinanceHosts[i], 'normal').then(response => {
                        rsiBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.rsiBinancePositions = this.rsiBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (rsiBinanceCount === this.rsiBinanceHosts.length ){
                            // 排序
                            this.rsiBinancePositionsAvailable = true
                            this.rsiBinancePositionsLoading = false
                        }
                    }
                )
            } 

            // in okex
            this.inOkexPositions = []
            var inOkexCount = 0
            this.inOkexPositionsLoading = true
            this.inOkexPositionsAvailable = false
            for(var i = 0; i < this.inOkexHosts.length; i++){
                getPositions(this.inOkexHosts[i], 'normal').then(response => {
                        inOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.inOkexPositions = this.inOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (inOkexCount === this.inOkexHosts.length ){
                            // 排序
                            this.inOkexPositionsAvailable = true
                            this.inOkexPositionsLoading = false
                        }
                    }
                )
            }

            // in bybit
            this.inBybitPositions = []
            var inBybitCount = 0
            this.inBybitPositionsLoading = true
            this.inBybitPositionsAvailable = false
            for(var i = 0; i < this.inBybitHosts.length; i++){
                getPositions(this.inBybitHosts[i], 'normal').then(response => {
                        inBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.inBybitPositions = this.inBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (inBybitCount === this.inBybitHosts.length ){
                            // 排序
                            this.inBybitPositionsAvailable = true
                            this.inBybitPositionsLoading = false
                        }
                    }
                )
            }

            // in binance
            this.inBinancePositions = []
            var inBinanceCount = 0
            this.inBinancePositionsLoading = true
            this.inBinancePositionsAvailable = false
            for(var i = 0; i < this.inBinanceHosts.length; i++){
                getPositions(this.inBinanceHosts[i], 'normal').then(response => {
                        inBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.inBinancePositions = this.inBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (inBinanceCount === this.inBinanceHosts.length ){
                            // 排序
                            this.inBinancePositionsAvailable = true
                            this.inBinancePositionsLoading = false
                        }
                    }
                )
            } 

            // prm okex
            this.prmOkexPositions = []
            var prmOkexCount = 0
            this.prmOkexPositionsLoading = true
            this.prmOkexPositionsAvailable = false
            for(var i = 0; i < this.prmOkexHosts.length; i++){
                getPositions(this.prmOkexHosts[i], 'normal').then(response => {
                        prmOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.prmOkexPositions = this.prmOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prmOkexCount === this.prmOkexHosts.length ){
                            // 排序
                            this.prmOkexPositionsAvailable = true
                            this.prmOkexPositionsLoading = false
                        }
                    }
                )
            }

            // prm bybit
            this.prmBybitPositions = []
            var prmBybitCount = 0
            this.prmBybitPositionsLoading = true
            this.prmBybitPositionsAvailable = false
            for(var i = 0; i < this.prmBybitHosts.length; i++){
                getPositions(this.prmBybitHosts[i], 'normal').then(response => {
                        prmBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.prmBybitPositions = this.prmBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prmBybitCount === this.prmBybitHosts.length ){
                            // 排序
                            this.prmBybitPositionsAvailable = true
                            this.prmBybitPositionsLoading = false
                        }
                    }
                )
            }

            // prm binance
            this.prmBinancePositions = []
            var prmBinanceCount = 0
            this.prmBinancePositionsLoading = true
            this.prmBinancePositionsAvailable = false
            for(var i = 0; i < this.prmBinanceHosts.length; i++){
                getPositions(this.prmBinanceHosts[i], 'normal').then(response => {
                        prmBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.prmBinancePositions = this.prmBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prmBinanceCount === this.prmBinanceHosts.length ){
                            // 排序
                            this.prmBinancePositionsAvailable = true
                            this.prmBinancePositionsLoading = false
                        }
                    }
                )
            } 

            // dad okex
            this.dadOkexPositions = []
            var dadOkexCount = 0
            this.dadOkexPositionsLoading = true
            this.dadOkexPositionsAvailable = false
            for(var i = 0; i < this.dadOkexHosts.length; i++){
                getPositions(this.dadOkexHosts[i], 'normal').then(response => {
                        dadOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.dadOkexPositions = this.dadOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (dadOkexCount === this.dadOkexHosts.length ){
                            // 排序
                            this.dadOkexPositionsAvailable = true
                            this.dadOkexPositionsLoading = false
                        }
                    }
                )
            }

            // dad bybit
            this.dadBybitPositions = []
            var dadBybitCount = 0
            this.dadBybitPositionsLoading = true
            this.dadBybitPositionsAvailable = false
            for(var i = 0; i < this.dadBybitHosts.length; i++){
                getPositions(this.dadBybitHosts[i], 'normal').then(response => {
                        dadBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.dadBybitPositions = this.dadBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (dadBybitCount === this.dadBybitHosts.length ){
                            // 排序
                            this.dadBybitPositionsAvailable = true
                            this.dadBybitPositionsLoading = false
                        }
                    }
                )
            }

            // dad binance
            this.dadBinancePositions = []
            var dadBinanceCount = 0
            this.dadBinancePositionsLoading = true
            this.dadBinancePositionsAvailable = false
            for(var i = 0; i < this.dadBinanceHosts.length; i++){
                getPositions(this.dadBinanceHosts[i], 'normal').then(response => {
                        dadBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                        }
                        this.dadBinancePositions = this.dadBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (dadBinanceCount === this.dadBinanceHosts.length ){
                            // 排序
                            this.dadBinancePositionsAvailable = true
                            this.dadBinancePositionsLoading = false
                        }
                    }
                )
            } 
        },

        rebuildWeights(weights) {
            const result = { ...weights };
            const groups = new Map();

            for (const [key, value] of Object.entries(weights)) {
                if (!groups.has(value)) groups.set(value, []);
                groups.get(value).push(key);
            }

            const values = [...groups.keys()].sort((a, b) => a - b);

            values.forEach((value, index) => {
                const keys = groups.get(value);
                if (keys.length < 2) return;

                keys.sort(); // 按字母顺序排序

                // 将新值限制在当前值与下一个更大值之间，避免改变组间顺序
                const upper = values[index + 1] ?? value + 1;
                const step = (upper - value) / keys.length;

                keys.forEach((key, i) => {
                result[key] = value + step * (keys.length - 1 - i);
                });
            });

            return result;
        },

        // 定时刷新数据函数
        refresh() {
            // 计时器正在进行中，退出函数
            if (this.refreshIntervalId != null) {
                return;
            }

            // 计时器为空，操作
            this.refreshIntervalId = setInterval(() => {
                var now = new Date();
                var hour = now.getHours()
                var minute = now.getMinutes()
                var second = now.getSeconds()
                var date = now.getDate()

                console.log("刷新检查:" + now);
                
                // 仓位表格 + 仓位排名柱状图
                if(now - this.positionsRefresh > 5*60*1000){
                    console.log(now + '刷新:fetchPositions');
                    this.fetchPositions()
                } 
            }, this.refreshInterval);
        }, 

        // 停止定时器
        clear() {
            clearInterval(this.refreshIntervalId); //清除计时器
            this.refreshIntervalId = null; //设置为null
        },
    },

    destroyed(){
        // 在页面销毁后，清除计时器
        this.clear();
    }
}
</script>