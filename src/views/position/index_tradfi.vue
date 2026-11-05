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
            v-bind:positions="tbTradfiBinancePositions" 
            v-bind:positions-loading="tbTradfiBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'T-Tradfi'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            ></position-map2> 
            
            <position-map2 
            v-bind:positions="tbTradfiOkexPositions" 
            v-bind:positions-loading="tbTradfiOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'T-Tradfi'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            ></position-map2> 

            <position-map2 
            v-bind:positions="tbTradfiBybitPositions" 
            v-bind:positions-loading="tbTradfiBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'T-Tradfi'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            ></position-map2>

            <position-map2 
            v-bind:positions="tbTradfiBitgetPositions" 
            v-bind:positions-loading="tbTradfiBitgetPositionsLoading"
            v-bind:exchange="'Bitget'"
            v-bind:strategy="'T-Tradfi'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
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
            tbTradfiBinanceHosts: config.tbTradfiBinanceHosts,
            tbTradfiOkexHosts: config.tbTradfiOkexHosts,
            tbTradfiBybitHosts: config.tbTradfiBybitHosts,
            tbTradfiBitgetHosts: config.tbTradfiBitgetHosts,
            // tbTradfiBinanceSortWeights: config.tbTradfiBinanceSortWeights,
            // tbOkexSortWeights: config.tbOkexSortWeights,
            // tbBybitSortWeights: config.tbOkexSortWeights,
            // tbBitgetSortWeights: config.tbOkexSortWeights,

            positions: [],
            positionsAvailable: false,
            positionsLoading: false,

            tbTradfiBinancePositions: [],
            tbTradfiBinancePositionsAvailable: false,
            tbTradfiBinancePositionsLoading: false,
            tbTradfiOkexPositions: [],
            tbTradfiOkexPositionsAvailable: false,
            tbTradfiOkexPositionsLoading: false,
            tbTradfiBybitPositions: [],
            tbTradfiBybitPositionsAvailable: false,
            tbTradfiBybitPositionsLoading: false,
            tbTradfiBitgetPositions: [],
            tbTradfiBitgetPositionsAvailable: false,
            tbTradfiBitgetPositionsLoading: false,

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
        // 从Tradfi Pfo获取所有positions(normal workers)
        fetchPositions() {
            this.positionsRefresh = new Date()

            // 所有positions
            this.positions = []
            this.positionsAvailable = false
            this.positionsLoading = true

            // tb_tradfi binance
            this.tbTradfiBinancePositions = []
            var tbTradfiBinanceCount = 0
            this.tbTradfiBinancePositionsLoading = true
            this.tbTradfiBinancePositionsAvailable = false
            for(var i = 0; i < this.tbTradfiBinanceHosts.length; i++){
                getPositions(this.tbTradfiBinanceHosts[i], 'normal').then(response => {
                        tbTradfiBinanceCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            // positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.tbTradfiBinancePositions = this.tbTradfiBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbTradfiBinanceCount === this.tbTradfiBinanceHosts.length ){
                            // 排序
                            this.tbTradfiBinancePositionsAvailable = true
                            this.tbTradfiBinancePositionsLoading = false
                        }
                    }
                )
            }
            
            // 暂时取消除了binance_tb之外的其他pfo
            // tb okex
            this.tbTradfiOkexPositions = []
            var tbTradfiOkexCount = 0
            this.tbTradfiOkexPositionsLoading = true
            this.tbTradfiOkexPositionsAvailable = false
            for(var i = 0; i < this.tbTradfiOkexHosts.length; i++){
                getPositions(this.tbTradfiOkexHosts[i], 'normal').then(response => {
                        tbTradfiOkexCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            // positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.tbTradfiOkexPositions = this.tbTradfiOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbTradfiOkexCount === this.tbTradfiOkexHosts.length ){
                            // 排序
                            this.tbTradfiOkexPositionsAvailable = true
                            this.tbTradfiOkexPositionsLoading = false
                        }
                    }
                )
            }

            // tb bybit
            this.tbTradfiBybitPositions = []
            var tbTradfiBybitCount = 0
            this.tbTradfiBybitPositionsLoading = true
            this.tbTradfiBybitPositionsAvailable = false
            for(var i = 0; i < this.tbTradfiBybitHosts.length; i++){
                getPositions(this.tbTradfiBybitHosts[i], 'normal').then(response => {
                        tbTradfiBybitCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            // positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.tbTradfiBybitPositions = this.tbTradfiBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbTradfiBybitCount === this.tbTradfiBybitHosts.length ){
                            // 排序
                            this.tbTradfiBybitPositionsAvailable = true
                            this.tbTradfiBybitPositionsLoading = false
                        }
                    }
                )
            }

            // tb bitget
            this.tbTradfiBitgetPositions = []
            var tbTradfiBitgetCount = 0
            this.tbTradfiBitgetPositionsLoading = true
            this.tbTradfiBitgetPositionsAvailable = false
            for(var i = 0; i < this.tbTradfiBitgetHosts.length; i++){
                getPositions(this.tbTradfiBitgetHosts[i], 'normal').then(response => {
                        tbTradfiBitgetCount += 1
                        var positions = response.results
                        // 每个position添加其他信息
                        for (let j = 0; j < positions.length; j++){
                            positions[j]['host'] = response.config.baseURL
                            // positions[j]['sty'] = 'pivot_reversal'
                        }
                        this.tbTradfiBitgetPositions = this.tbTradfiBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbTradfiBitgetCount === this.tbTradfiBitgetHosts.length ){
                            // 排序
                            this.tbTradfiBitgetPositionsAvailable = true
                            this.tbTradfiBitgetPositionsLoading = false
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