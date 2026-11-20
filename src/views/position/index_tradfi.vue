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
            v-bind:title="'传统金融仓位排名'"
            v-bind:tops="10"
            v-if="
            tbTradfiBinancePositionsAvailable && tbTradfiOkexPositionsAvailable && tbTradfiBybitPositionsAvailable && tbTradfiBitgetPositionsAvailable
            "
            ></position-ranks2> 
          </div>
      </el-col>
        <!--
        <el-col :span="12" align="center">
            <div style="margin-bottom: 20px; width: 95%">
                <position-ranks2
                v-bind:positions="futurePositions"
                v-bind:title="'期货仓位排名'"
                v-bind:tops="5"
                v-if="
                tbTradfiBinancePositionsAvailable && tbTradfiOkexPositionsAvailable && tbTradfiBybitPositionsAvailable && tbTradfiBitgetPositionsAvailable
                "
                ></position-ranks2> 
            </div>
        </el-col>
        -->
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
            v-bind:positions="tbTradfiBinancePositions" 
            v-bind:positions-loading="tbTradfiBinancePositionsLoading"
            v-bind:exchange="'Binance'"
            v-bind:strategy="'T-Tradfi'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="binanceSortWeights"
            v-if="tbTradfiBinancePositionsAvailable"
            ></position-map2> 
            
            <position-map2 
            v-bind:positions="tbTradfiOkexPositions" 
            v-bind:positions-loading="tbTradfiOkexPositionsLoading"
            v-bind:exchange="'Okex'"
            v-bind:strategy="'T-Tradfi'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="okexSortWeights"
            v-if="tbTradfiOkexPositionsAvailable"
            ></position-map2> 

            <position-map2 
            v-bind:positions="tbTradfiBybitPositions" 
            v-bind:positions-loading="tbTradfiBybitPositionsLoading"
            v-bind:exchange="'Bybit'"
            v-bind:strategy="'T-Tradfi'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="bybitSortWeights"
            v-if="tbTradfiBybitPositionsAvailable"
            ></position-map2>

            <position-map2 
            v-bind:positions="tbTradfiBitgetPositions" 
            v-bind:positions-loading="tbTradfiBitgetPositionsLoading"
            v-bind:exchange="'Bitget'"
            v-bind:strategy="'T-Tradfi'"
            v-bind:col-count="5"
            v-bind:show-zero="true"
            v-bind:sort-coin="true"
            v-bind:sort-coin-weights="bitgetSortWeights"
            v-if="tbTradfiBitgetPositionsAvailable"
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

            binanceSortWeights: {},
            okexSortWeights: {},
            bybitSortWeights: {},
            bitgetSortWeights: {},

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
            this.stockPositions = []
            this.futurePositions = []

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
                            
                            // 区分美股VS期货
                            var coin = positions[j].worker.name.split('/')[0].split('_').slice(-1,)[0]
                            if(positions[j].worker.crypto_product_type == 'stock'){
                                this.stockPositions.push(positions[j])
                                this.binanceSortWeights[coin] = 1   // stock权重 > future权重
                            } else {
                                this.futurePositions.push(positions[j])
                                this.binanceSortWeights[coin] = 0   // stock权重 > future权重
                            }
                        }
                        this.tbTradfiBinancePositions = this.tbTradfiBinancePositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbTradfiBinanceCount === this.tbTradfiBinanceHosts.length ){
                            // weight按照ABC再次排序
                            this.binanceSortWeights = this.rebuildWeights(this.binanceSortWeights)

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

                            // 区分美股VS期货
                            var coin = positions[j].worker.name.split('/')[0].split('_').slice(-1,)[0]
                            if(positions[j].worker.crypto_product_type == 'stock'){
                                this.stockPositions.push(positions[j])
                                this.okexSortWeights[coin] = 1   // stock权重 > future权重
                            } else {
                                this.futurePositions.push(positions[j])
                                this.okexSortWeights[coin] = 0   // stock权重 > future权重
                            }
                        }
                        this.tbTradfiOkexPositions = this.tbTradfiOkexPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbTradfiOkexCount === this.tbTradfiOkexHosts.length ){
                            // weight按照ABC再次排序
                            this.okexSortWeights = this.rebuildWeights(this.okexSortWeights)

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

                            // 区分美股VS期货
                            var coin = positions[j].worker.name.split('/')[0].split('_').slice(-1,)[0]
                            if(positions[j].worker.crypto_product_type == 'stock'){
                                this.stockPositions.push(positions[j])
                                this.bybitSortWeights[coin] = 1   // stock权重 > future权重
                            } else {
                                this.futurePositions.push(positions[j])
                                this.bybitSortWeights[coin] = 0   // stock权重 > future权重
                            }
                        }
                        this.tbTradfiBybitPositions = this.tbTradfiBybitPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbTradfiBybitCount === this.tbTradfiBybitHosts.length ){
                            // weight按照ABC再次排序
                            this.bybitSortWeights = this.rebuildWeights(this.bybitSortWeights)

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

                            // 区分美股VS期货
                            var coin = positions[j].worker.name.split('/')[0].split('_').slice(-1,)[0]
                            if(positions[j].worker.crypto_product_type == 'stock'){
                                this.stockPositions.push(positions[j])
                                this.bitgetSortWeights[coin] = 1   // stock权重 > future权重
                            } else {
                                this.futurePositions.push(positions[j])
                                this.bitgetSortWeights[coin] = 0   // stock权重 > future权重
                            }
                        }
                        this.tbTradfiBitgetPositions = this.tbTradfiBitgetPositions.concat(positions)
                        this.positions = this.positions.concat(positions)
                        if (tbTradfiBitgetCount === this.tbTradfiBitgetHosts.length ){
                            // weight按照ABC再次排序
                            this.bitgetSortWeights = this.rebuildWeights(this.bitgetSortWeights)

                            // 排序
                            this.tbTradfiBitgetPositionsAvailable = true
                            this.tbTradfiBitgetPositionsLoading = false
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