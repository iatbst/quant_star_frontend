<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 仓位 ---------------------------------------
        函数:fetchPositions 
        更新频率: ?
    --->  
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px;">
      <el-col :span="24" align="center">
          <div style="margin-bottom: 20px; width: 95%">
            <!-- pr_binance -->
            <position-map2 
            v-bind:positions="prBinancePositions" 
            v-bind:positions-loading="prBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'P'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prBinanceSortWeights"
            ></position-map2> 

            <!-- pr_okex -->
            <position-map2 
            v-bind:positions="prOkexPositions" 
            v-bind:positions-loading="prOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'P'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prOkexSortWeights"
            ></position-map2> 

            <!-- pr_bybit -->
            <position-map2 
            v-bind:positions="prBybitPositions" 
            v-bind:positions-loading="prBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'P'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prBybitSortWeights"
            ></position-map2> 

            <!-- pr_bitget -->
            <position-map2 
            v-bind:positions="prBitgetPositions" 
            v-bind:positions-loading="prBitgetPositionsLoading"
            v-bind:exchange="'Bitget'"
            v-bind:strategy="'P'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prBitgetSortWeights"
            ></position-map2> 

            <!-- pb_binance -->
            <position-map2 
            v-bind:positions="pbBinancePositions" 
            v-bind:positions-loading="pbBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'B'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
            ></position-map2> 

            <!-- pb_okex -->
            <position-map2 
            v-bind:positions="pbOkexPositions" 
            v-bind:positions-loading="pbOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'B'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
            ></position-map2> 

            <!-- pb_bybit -->
            <position-map2 
            v-bind:positions="pbBybitPositions" 
            v-bind:positions-loading="pbBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'B'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
            ></position-map2> 

            <!-- pb_bitget -->
            <position-map2 
            v-bind:positions="pbBitgetPositions" 
            v-bind:positions-loading="pbBitgetPositionsLoading"
            v-bind:exchange="'Bitget'"
            v-bind:strategy="'B'"
            v-bind:col-count="5"
            v-bind:show-zero="false"
            ></position-map2> 

            <!-- mcz_binance -->
            <position-map2 
            v-bind:positions="mczBinancePositions" 
            v-bind:positions-loading="mczBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'M'"
            v-bind:col-count="13"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prBinanceSortWeights"
            ></position-map2> 

            <!-- mcz_okex -->
            <position-map2 
            v-bind:positions="mczOkexPositions" 
            v-bind:positions-loading="mczOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'M'"
            v-bind:col-count="13"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prOkexSortWeights"
            ></position-map2> 

            <!-- mcz_bybit -->
            <position-map2 
            v-bind:positions="mczBybitPositions" 
            v-bind:positions-loading="mczBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'M'"
            v-bind:col-count="13"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prBybitSortWeights"
            ></position-map2> 

            <!-- mcz_bitget -->
            <position-map2 
            v-bind:positions="mczBitgetPositions" 
            v-bind:positions-loading="mczBitgetPositionsLoading"
            v-bind:exchange="'Bitget'"
            v-bind:strategy="'M'"
            v-bind:col-count="13"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="prBitgetSortWeights"
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
            prBinanceHosts: config.prBinanceHosts,
            prOkexHosts: config.prOkexHosts,
            prBybitHosts: config.prBybitHosts,
            prBitgetHosts: config.prBitgetHosts,
            pbBinanceHosts: config.pbBinanceHosts,
            pbOkexHosts: config.pbOkexHosts,
            pbBybitHosts: config.pbBybitHosts,
            pbBitgetHosts: config.pbBitgetHosts,
            mczBinanceHosts: config.mczBinanceHosts,
            mczOkexHosts: config.mczOkexHosts,
            mczBybitHosts: config.mczBybitHosts,
            mczBitgetHosts: config.mczBitgetHosts,
            prBinanceSortWeights: config.prBinanceSortWeights,
            prOkexSortWeights: config.prOkexSortWeights,
            prBybitSortWeights: config.prOkexSortWeights,
            prBitgetSortWeights: config.prOkexSortWeights,

            positions: [],
            positionsAvailable: false,
            positionsLoading: false,

            prBinancePositions: [],
            prBinancePositionsAvailable: false,
            prBinancePositionsLoading: false,
            prOkexPositions: [],
            prOkexPositionsAvailable: false,
            prOkexPositionsLoading: false,
            prBybitPositions: [],
            prBybitPositionsAvailable: false,
            prBybitPositionsLoading: false,
            prBitgetositions: [],
            prBitgetPositionsAvailable: false,
            prBitgetPositionsLoading: false,
            pbBinancePositions: [],
            pbBinancePositionsAvailable: false,
            pbBinancePositionsLoading: false,
            pbOkexPositions: [],
            pbOkexPositionsAvailable: false,
            pbOkexPositionsLoading: false,
            pbBybitPositions: [],
            pbBybitPositionsAvailable: false,
            pbBybitPositionsLoading: false,
            pbBitgetPositions: [],
            pbBitgetPositionsAvailable: false,
            pbBitgetPositionsLoading: false,
            mczBinancePositions: [],
            mczBinancePositionsAvailable: false,
            mczBinancePositionsLoading: false,
            mczOkexPositions: [],
            mczOkexPositionsAvailable: false,
            mczOkexPositionsLoading: false,
            mczBybitPositions: [],
            mczBybitPositionsAvailable: false,
            mczBybitPositionsLoading: false,
            mczBitgetPositions: [],
            mczBitgetPositionsAvailable: false,
            mczBitgetPositionsLoading: false,

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

            // pr binance
            this.prBinancePositions = []
            var prBinanceCount = 0
            this.prBinancePositionsLoading = true
            this.prBinancePositionsAvailable = false
            for(var i = 0; i < this.prBinanceHosts.length; i++){
                getPositions(this.prBinanceHosts[i], 'normal').then(response => {
                        prBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.prBinancePositions = this.prBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prBinanceCount === this.prBinanceHosts.length ){
                            // 排序
                            this.prBinancePositionsAvailable = true
                            this.prBinancePositionsLoading = false
                        }
                    }
                )
            }

            // pr okex
            this.prOkexPositions = []
            var prOkexCount = 0
            this.prOkexPositionsLoading = true
            this.prOkexPositionsAvailable = false
            for(var i = 0; i < this.prOkexHosts.length; i++){
                getPositions(this.prOkexHosts[i], 'normal').then(response => {
                        prOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.prOkexPositions = this.prOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prOkexCount === this.prOkexHosts.length ){
                            // 排序
                            this.prOkexPositionsAvailable = true
                            this.prOkexPositionsLoading = false
                        }
                    }
                )
            }

            // pr bybit
            this.prBybitPositions = []
            var prBybitCount = 0
            this.prBybitPositionsLoading = true
            this.prBybitPositionsAvailable = false
            for(var i = 0; i < this.prBybitHosts.length; i++){
                getPositions(this.prBybitHosts[i], 'normal').then(response => {
                        prBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.prBybitPositions = this.prBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prBybitCount === this.prBybitHosts.length ){
                            // 排序
                            this.prBybitPositionsAvailable = true
                            this.prBybitPositionsLoading = false
                        }
                    }
                )
            }

            // pr bitget
            this.prBitgetPositions = []
            var prBitgetCount = 0
            this.prBitgetPositionsLoading = true
            this.prBitgetPositionsAvailable = false
            for(var i = 0; i < this.prBitgetHosts.length; i++){
                getPositions(this.prBitgetHosts[i], 'normal').then(response => {
                        prBitgetCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.prBitgetPositions = this.prBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (prBitgetCount === this.prBitgetHosts.length ){
                            // 排序
                            this.prBitgetPositionsAvailable = true
                            this.prBitgetPositionsLoading = false
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

            // pb bitget
            this.pbBitgetPositions = []
            var pbBitgetCount = 0
            this.pbBitgetPositionsLoading = true
            this.pbBitgetPositionsAvailable = false
            for(var i = 0; i < this.pbBitgetHosts.length; i++){
                getPositions(this.pbBitgetHosts[i], 'normal').then(response => {
                        pbBitgetCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'plunge_back'
                        }
                        this.pbBitgetPositions = this.pbBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (pbBitgetCount === this.pbBitgetHosts.length ){
                            // 排序
                            this.pbBitgetPositionsAvailable = true
                            this.pbBitgetPositionsLoading = false
                        }
                    }
                )
            }

            // mcz binance
            this.mczBinancePositions = []
            var mczBinanceCount = 0
            this.mczBinancePositionsLoading = true
            this.mczBinancePositionsAvailable = false
            for(var i = 0; i < this.mczBinanceHosts.length; i++){
                getPositions(this.mczBinanceHosts[i], 'normal').then(response => {
                        mczBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'macd_cross_zero'
                        }
                        this.mczBinancePositions = this.mczBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (mczBinanceCount === this.mczBinanceHosts.length ){
                            // 排序
                            this.mczBinancePositionsAvailable = true
                            this.mczBinancePositionsLoading = false
                        }
                    }
                )
            }

            // mcz okex
            this.mczOkexPositions = []
            var mczOkexCount = 0
            this.mczOkexPositionsLoading = true
            this.mczOkexPositionsAvailable = false
            for(var i = 0; i < this.mczOkexHosts.length; i++){
                getPositions(this.mczOkexHosts[i], 'normal').then(response => {
                        mczOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'macd_cross_zero'
                        }
                        this.mczOkexPositions = this.mczOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (mczOkexCount === this.mczOkexHosts.length ){
                            // 排序
                            this.mczOkexPositionsAvailable = true
                            this.mczOkexPositionsLoading = false
                        }
                    }
                )
            }

            // mcz bybit
            this.mczBybitPositions = []
            var mczBybitCount = 0
            this.mczBybitPositionsLoading = true
            this.mczBybitPositionsAvailable = false
            for(var i = 0; i < this.mczBybitHosts.length; i++){
                getPositions(this.mczBybitHosts[i], 'normal').then(response => {
                        mczBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'macd_cross_zero'
                        }
                        this.mczBybitPositions = this.mczBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (mczBybitCount === this.mczBybitHosts.length ){
                            // 排序
                            this.mczBybitPositionsAvailable = true
                            this.mczBybitPositionsLoading = false
                        }
                    }
                )
            }

            // mcz bitget
            this.mczBitgetPositions = []
            var mczBitgetCount = 0
            this.mczBitgetPositionsLoading = true
            this.mczBitgetPositionsAvailable = false
            for(var i = 0; i < this.mczBitgetHosts.length; i++){
                getPositions(this.mczBitgetHosts[i], 'normal').then(response => {
                        mczBitgetCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'macd_cross_zero'
                        }
                        this.mczBitgetPositions = this.mczBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (mczBitgetCount === this.mczBitgetHosts.length ){
                            // 排序
                            this.mczBitgetPositionsAvailable = true
                            this.mczBitgetPositionsLoading = false
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