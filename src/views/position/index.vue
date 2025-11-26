<template>
  <div class="app-container" style="background-color: lightgray">
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
            v-bind:sort-coin-weights="tbBinanceSortWeights"
            ></position-map2> 
            
            <position-map2 
            v-bind:positions="tbOkexPositions" 
            v-bind:positions-loading="tbOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'T'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="tbOkexSortWeights"
            ></position-map2> 

            <position-map2 
            v-bind:positions="tbBybitPositions" 
            v-bind:positions-loading="tbBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'T'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="tbBybitSortWeights"
            ></position-map2>

            <position-map2 
            v-bind:positions="tbBitgetPositions" 
            v-bind:positions-loading="tbBitgetPositionsLoading"
            v-bind:exchange="'Bitget'"
            v-bind:strategy="'T'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="tbBitgetSortWeights"
            ></position-map2> 

            <position-map2 
            v-bind:positions="inBinancePositions" 
            v-bind:positions-loading="inBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'IN'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="inOkexPositions" 
            v-bind:positions-loading="inOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'IN'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="inBybitPositions" 
            v-bind:positions-loading="inBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'IN'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            ></position-map2> 


            <position-map2 
            v-bind:positions="prmBinancePositions" 
            v-bind:positions-loading="prmBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'PRM'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="prmOkexPositions" 
            v-bind:positions-loading="prmOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'PRM'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="prmBybitPositions" 
            v-bind:positions-loading="prmBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'PRM'"
            v-bind:col-count="10"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="rsiBinancePositions" 
            v-bind:positions-loading="rsiBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="rsiOkexPositions" 
            v-bind:positions-loading="rsiOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="rsiBybitPositions" 
            v-bind:positions-loading="rsiBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
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
            v-bind:positions="lrBinancePositions" 
            v-bind:positions-loading="lrBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'LR'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="lrOkexPositions" 
            v-bind:positions-loading="lrOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'LR'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="lrBybitPositions" 
            v-bind:positions-loading="lrBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'LR'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="pbBinancePositions" 
            v-bind:positions-loading="pbBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'B'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="pbOkexPositions" 
            v-bind:positions-loading="pbOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'B'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
            ></position-map2> 

            <position-map2 
            v-bind:positions="pbBybitPositions" 
            v-bind:positions-loading="pbBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'B'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
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


export default {
    components: {
        positionMap2
    },

    data() {
        return { 
            pfoHosts: config.pfoHosts,
            tbBinanceHosts: config.tbBinanceHosts,
            tbOkexHosts: config.tbOkexHosts,
            tbBybitHosts: config.tbBybitHosts,
            tbBitgetHosts: config.tbBitgetHosts,
            pbOkexHosts: config.pbOkexHosts,
            pbBybitHosts: config.pbBybitHosts,
            pbBinanceHosts: config.pbBinanceHosts,
            rsiOkexHosts: config.rsiOkexHosts,
            rsiBybitHosts: config.rsiBybitHosts,
            rsiBinanceHosts: config.rsiBinanceHosts,
            lrOkexHosts: config.lrOkexHosts,
            lrBybitHosts: config.lrBybitHosts,
            lrBinanceHosts: config.lrBinanceHosts,
            inOkexHosts: config.inOkexHosts,
            inBybitHosts: config.inBybitHosts,
            inBinanceHosts: config.inBinanceHosts,
            prmOkexHosts: config.prmOkexHosts,
            prmBybitHosts: config.prmBybitHosts,
            prmBinanceHosts: config.prmBinanceHosts,
            tbBinanceSortWeights: config.tbBinanceSortWeights,
            tbOkexSortWeights: config.tbOkexSortWeights,
            tbBybitSortWeights: config.tbOkexSortWeights,
            tbBitgetSortWeights: config.tbOkexSortWeights,

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
            pbOkexPositions: [],
            pbOkexPositionsAvailable: false,
            pbOkexPositionsLoading: false,
            pbBybitPositions: [],
            pbBybitPositionsAvailable: false,
            pbBybitPositionsLoading: false,
            pbBinancePositions: [],
            pbBinancePositionsAvailable: false,
            pbBinancePositionsLoading: false,
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
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.tbBinancePositions = this.tbBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBinanceCount === this.tbBinanceHosts.length ){
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
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.tbOkexPositions = this.tbOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbOkexCount === this.tbOkexHosts.length ){
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
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.tbBybitPositions = this.tbBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBybitCount === this.tbBybitHosts.length ){
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
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.tbBitgetPositions = this.tbBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbBitgetCount === this.tbBitgetHosts.length ){
                            // 排序
                            this.tbBitgetPositionsAvailable = true
                            this.tbBitgetPositionsLoading = false
                        }
                    }
                )
            }

            // pb okex
            this.pbOkexPositions = []
            var pbOkexCount = 0
            this.pbOkexPositionsLoading = true
            this.pbOkexPositionsAvailable = false
            for(var i = 0; i < this.pbOkexHosts.length; i++){
                getPositions(this.pbOkexHosts[i], 'normal').then(response => {
                        pbOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'plunge_back'
                        }
                        this.pbOkexPositions = this.pbOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (pbOkexCount === this.pbOkexHosts.length ){
                            // 排序
                            this.pbOkexPositionsAvailable = true
                            this.pbOkexPositionsLoading = false
                        }
                    }
                )
            }

            // pb bybit
            this.pbBybitPositions = []
            var pbBybitCount = 0
            this.pbBybitPositionsLoading = true
            this.pbBybitPositionsAvailable = false
            for(var i = 0; i < this.pbBybitHosts.length; i++){
                getPositions(this.pbBybitHosts[i], 'normal').then(response => {
                        pbBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'plunge_back'
                        }
                        this.pbBybitPositions = this.pbBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (pbBybitCount === this.pbBybitHosts.length ){
                            // 排序
                            this.pbBybitPositionsAvailable = true
                            this.pbBybitPositionsLoading = false
                        }
                    }
                )
            }

            // pb binance
            this.pbBinancePositions = []
            var pbBinanceCount = 0
            this.pbBinancePositionsLoading = true
            this.pbBinancePositionsAvailable = false
            for(var i = 0; i < this.pbBinanceHosts.length; i++){
                getPositions(this.pbBinanceHosts[i], 'normal').then(response => {
                        pbBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'plunge_back'
                        }
                        this.pbBinancePositions = this.pbBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (pbBinanceCount === this.pbBinanceHosts.length ){
                            // 排序
                            this.pbBinancePositionsAvailable = true
                            this.pbBinancePositionsLoading = false
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
                            positions[j]['sty'] = 'rsi_mini'
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
                            positions[j]['sty'] = 'rsi_mini'
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
                            positions[j]['sty'] = 'rsi_mini'
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

            // lr okex
            this.lrOkexPositions = []
            var lrOkexCount = 0
            this.lrOkexPositionsLoading = true
            this.lrOkexPositionsAvailable = false
            for(var i = 0; i < this.lrOkexHosts.length; i++){
                getPositions(this.lrOkexHosts[i], 'normal').then(response => {
                        lrOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'long_short_ratio'
                        }
                        this.lrOkexPositions = this.lrOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (lrOkexCount === this.lrOkexHosts.length ){
                            // 排序
                            this.lrOkexPositionsAvailable = true
                            this.lrOkexPositionsLoading = false
                        }
                    }
                )
            }

            // lr bybit
            this.lrBybitPositions = []
            var lrBybitCount = 0
            this.lrBybitPositionsLoading = true
            this.lrBybitPositionsAvailable = false
            for(var i = 0; i < this.lrBybitHosts.length; i++){
                getPositions(this.lrBybitHosts[i], 'normal').then(response => {
                        lrBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'long_short_ratio'
                        }
                        this.lrBybitPositions = this.lrBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (lrBybitCount === this.lrBybitHosts.length ){
                            // 排序
                            this.lrBybitPositionsAvailable = true
                            this.lrBybitPositionsLoading = false
                        }
                    }
                )
            }

            // lr binance
            this.lrBinancePositions = []
            var lrBinanceCount = 0
            this.lrBinancePositionsLoading = true
            this.lrBinancePositionsAvailable = false
            for(var i = 0; i < this.lrBinanceHosts.length; i++){
                getPositions(this.lrBinanceHosts[i], 'normal').then(response => {
                        lrBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'long_short_ratio'
                        }
                        this.lrBinancePositions = this.lrBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (lrBinanceCount === this.lrBinanceHosts.length ){
                            // 排序
                            this.lrBinancePositionsAvailable = true
                            this.lrBinancePositionsLoading = false
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
                            positions[j]['sty'] = 'id_nr'
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
                            positions[j]['sty'] = 'id_nr'
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
                            positions[j]['sty'] = 'id_nr'
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
                            positions[j]['sty'] = 'pivot_reversal_mini'
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
                            positions[j]['sty'] = 'pivot_reversal_mini'
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
                            positions[j]['sty'] = 'pivot_reversal_mini'
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