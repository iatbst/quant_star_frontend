<template>
   <el-row :gutter="0" type="flex">
        <!-- 总仓位 -->
        <el-col :span="12">
            <!-- USDT/BTC Pie -->
            <highcharts :options="totalPositionOptions"></highcharts>
        </el-col>

        <el-col :span="10" :offset="1">
            <!-- 统计信息 -->
            <el-card class="box-card" style="min-height: 80%;margin-top: 20px; border-color: black">
                <div>
                    <el-row :gutter="0" type="flex" align="middle">
                        <el-col :span="16" align="center">
                            <h1 style="font-size: 450%; color: green" v-if="totalUsdtAmount >= 0">
                                ${{ toThousands(Math.round(totalUsdtAmount)) }}
                            </h1>
                            <h1 style="font-size: 450%; color: red" v-else>
                                ${{ toThousands(Math.round(-totalUsdtAmount)) }}
                            </h1>                            
                        </el-col>
                        <el-col :span="8" align="left">
                            <h1 style="font-size: 150%; color: green" >
                                多: {{ toThousands(Math.round(totalLongAmount)) }}
                            </h1> 
                             <h1 style="font-size: 150%; color: red" >
                                空: {{ toThousands(Math.round(totalShortAmount)) }}
                            </h1>                                                 
                        </el-col>                        
                    </el-row>

                    <div>
                        <!-- N行展示pfoRowCount个pfo的数据 -->
                        <div v-for="row_ix in Math.ceil(pfoAlias.length/pfoRowCount)">
                            <el-row :gutter="0" type="flex" align="middle">
                                <el-col :span="24/pfoRowCount" align="center" v-for="col_ix in pfoRowCount">
                                    <h3 v-if="(row_ix - 1)*pfoRowCount + col_ix - 1 < pfoAlias.length">
                                        {{ pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1].toUpperCase() }}:
                                        <span style="color: green" v-if="positionSummaryByPfos[pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1]] >= 0">
                                            {{ toThousands(Math.round(positionSummaryByPfos[pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1]])) }}
                                        </span>
                                        <span style="color: red" v-else>
                                            {{ toThousands(Math.round(-positionSummaryByPfos[pfoAlias[(row_ix - 1)*pfoRowCount + col_ix - 1]])) }}
                                        </span>                                
                                    </h3>                          
                                </el-col>                  
                            </el-row> 
                        </div>
                    </div>
                                       
                </div>
            </el-card>
        </el-col> 
    </el-row>       
</template>
   
<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'
import {fillPieByArray} from '@/utils/chart/'
import {toThousands} from '@/utils/general'

export default {
    components: {
        highcharts: Chart
    },

    props: {
        subaccountDatas: {
            type:Array,
            default:[]
        }
    },

    watch: {
        subaccountDatas: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        }
    },

    data() {
        return {
            positionsByCoins: null,
            totalUsdtAmount: null,
            totalLongAmount: null,
            totalShortAmount: null,
            positionSummaryByPfos: null,
            pfoRowCount: 3, // 右侧框下部每行展示几个pfo
            pfoAlias: config.pfoAlias,

            // 总分布: USDT vs BTC, Long vs Short
            totalPositionOptions: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: null
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>$'
                },
                accessibility: {
                    point: {
                        valueSuffix: '$'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y:,.0f}$'
                        },
                        // showInLegend: true
                    }
                },
                series: [{
                    name: '头寸',
                    colorByPoint: true,
                    data: [
                        // {
                        //     name: 'USDT',
                        //     y: 60,
                        // },...
                    ]
                }]               
            },
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data: subaccountDatas
        parseData() {   
            this.positionsByCoins = {}
            this.positionSummaryByPfos = {}    
            this.totalUsdtAmount = 0
            this.totalLongAmount = 0
            this.totalShortAmount = 0 
            for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let symbol in this.subaccountDatas[i].positions.data){
                    var pfo = this.subaccountDatas[i].subaccount.portfolio.alias
                    var usdtAmount = this.subaccountDatas[i].positions.data[symbol]
                    this.totalUsdtAmount += usdtAmount
                    if (usdtAmount >= 0){
                        this.totalLongAmount += usdtAmount
                    } else {
                        this.totalShortAmount += Math.abs(usdtAmount)
                    }

                    // 币种分布(USD vs BTC)
                    var quote = symbol.split('/')[1]
                    if (config.usdStableCoins.includes(quote)) {
                        quote = 'USD'
                    }
                    var side = usdtAmount >= 0 ? 'long' : 'short'
                    var coinKey = quote + '_' + side
                    if (coinKey in this.positionsByCoins){
                        this.positionsByCoins[coinKey] += usdtAmount
                    } else {
                        this.positionsByCoins[coinKey] = usdtAmount
                    } 

                    // 投资组合分布
                    if (!(pfo in this.positionSummaryByPfos)){
                        this.positionSummaryByPfos[pfo] = 0
                    }
                    this.positionSummaryByPfos[pfo] += usdtAmount 
                }
            }

            // Object -> Array
            var positionList = []
            for(let key in this.positionsByCoins){
                positionList.push({
                    name: this.chineseString(key),
                    y: parseInt(Math.abs(this.positionsByCoins[key])),
                    color: this.colorMap(key)
                })
            }

            fillPieByArray(positionList, this.totalPositionOptions)       
        },

        toThousands: toThousands,

        chineseString(s) {
            var cs
            if (s === 'swap'){
            cs = '永续合约'
            } else if (s === 'margin'){
            cs = '杠杆现货'       
            } else if (s === 'coin'){
            cs = '币本位'
            } else if (s === 'usdt'){
            cs = 'U本位'
            } else if (s === 'usdt_share'){
            cs = '全仓U本位'
            } else if (s === 'isolate'){
            cs = '逐仓'
            } else if (s === 'share'){
            cs = '全仓'
            } else if (s === 'USD_long'){
                cs = 'USD-多头'
            } else if (s === 'USD_short'){
                cs = 'USD-空头'
            } else if (s === 'BTC_long'){
                cs = 'BTC-多头'
            } else if (s === 'BTC_short'){
                cs = 'BTC-空头'
            }
            return cs
        }, 

        colorMap(key) {
            if (key === 'USD_long'){
                return 'green'
            } else if (key === 'USD_short'){
                return 'red'
            } else if (key === 'BTC_long'){
                return 'lightgreen'
            } else if (key === 'BTC_short'){
                return 'pink'
            }
        },
    }
}
</script>