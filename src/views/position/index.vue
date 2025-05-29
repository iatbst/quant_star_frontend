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

            <!-- tb_okex -->
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

            <!-- tb_bybit -->
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

            <!-- tb_bitget -->
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

            <!-- rsi_binance -->
            <position-map2 
            v-bind:positions="rsiBinancePositions" 
            v-bind:positions-loading="rsiBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 

            <!-- rsi_okex -->
            <position-map2 
            v-bind:positions="rsiOkexPositions" 
            v-bind:positions-loading="rsiOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 

            <!-- rsi_bybit -->
            <position-map2 
            v-bind:positions="rsiBybitPositions" 
            v-bind:positions-loading="rsiBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 

            <!-- rsi_bitget -->
            <position-map2 
            v-bind:positions="rsiBitgetPositions" 
            v-bind:positions-loading="rsiBitgetPositionsLoading"
            v-bind:exchange="'Bitget'"
            v-bind:strategy="'RSI'"
            v-bind:col-count="2"
            v-bind:show-zero="false"
            ></position-map2> 
            <!--- RSI策略排序说明 --->
            <div align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        策略展示顺序: 外循环根据k线级别;内循环根据参数顺序.(eg, 6h_1, 6h_2, 6h_3, 6h_4,  .... 48h_3, 48h_4)
                    </div>
                    <span style="color: gray; font-size: 10px"><i class="el-icon-info"></i>RSI策略顺序说明</span>
                </el-tooltip>
            </div>

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
            pbBinanceHosts: config.pbBinanceHosts,
            pbOkexHosts: config.pbOkexHosts,
            pbBybitHosts: config.pbBybitHosts,
            pbBitgetHosts: config.pbBitgetHosts,
            rsiBinanceHosts: config.rsiBinanceHosts,
            rsiOkexHosts: config.rsiOkexHosts,
            rsiBybitHosts: config.rsiBybitHosts,
            rsiBitgetHosts: config.rsiBitgetHosts,
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
            rsiBinancePositions: [],
            rsiBinancePositionsAvailable: false,
            rsiBinancePositionsLoading: false,
            rsiOkexPositions: [],
            rsiOkexPositionsAvailable: false,
            rsiOkexPositionsLoading: false,
            rsiBybitPositions: [],
            rsiBybitPositionsAvailable: false,
            rsiBybitPositionsLoading: false,
            rsiBitgetPositions: [],
            rsiBitgetPositionsAvailable: false,
            rsiBitgetPositionsLoading: false,

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

            // rsi bitget
            this.rsiBitgetPositions = []
            var rsiBitgetCount = 0
            this.rsiBitgetPositionsLoading = true
            this.rsiBitgetPositionsAvailable = false
            for(var i = 0; i < this.rsiBitgetHosts.length; i++){
                getPositions(this.rsiBitgetHosts[i], 'normal').then(response => {
                        rsiBitgetCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            positions[j]['sty'] = 'rsi_mini'
                        }
                        this.rsiBitgetPositions = this.rsiBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (rsiBitgetCount === this.rsiBitgetHosts.length ){
                            // 排序
                            this.rsiBitgetPositionsAvailable = true
                            this.rsiBitgetPositionsLoading = false
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