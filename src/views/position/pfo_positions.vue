<template>
    <!-- N行展示pfoRowCount个pfo的数据 -->
    <div>
        <div v-for="row_ix in Math.ceil(pfoOptions.length/pfoRowCount)">
            <el-row :gutter="0" type="flex" align="middle">
                <el-col :span="24/pfoRowCount" align="center" v-for="col_ix in pfoRowCount">
                    <highcharts :options="pfoOptions[(row_ix - 1)*pfoRowCount + col_ix - 1]" v-if="(row_ix - 1)*pfoRowCount + col_ix - 1 < pfoOptions.length"></highcharts>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import {Chart} from 'highcharts-vue'
import {deepCopy} from '@/utils/general'
import {fillPieByArray} from '@/utils/chart'
import config from '@/configs/system_configs'
import { options } from '_runjs@4.3.2@runjs'


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
            // Pfo分布: USDT vs BTC, Long vs Short
            positionsByPfos: null,
            pfoRowCount: 3,
            // pfo1PositionOptions: null,
            // pfo2PositionOptions: null,
            // pfo3PositionOptions: null,
            // pfo4PositionOptions: null,
            pfoOptions: [],
            pfoPositionOptions: {
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
                            format: '{point.y:,.0f}$'
                        },
                        showInLegend: true,
                        size: '60%'
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
        // 处理父组件建传入data: pfoDatas
        parseData() {         
            this.positionsByPfos = {}   
            for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let symbol in this.subaccountDatas[i].positions.data){
                    var usdtAmount = this.subaccountDatas[i].positions.data[symbol]
                    var pfo = this.subaccountDatas[i].subaccount.portfolio.alias
                    var quote = symbol.split('/')[1]
                    if (config.usdStableCoins.includes(quote)) {
                        quote = 'USD'
                    }
                    var side = usdtAmount >= 0 ? 'long' : 'short'
                    var key = quote + '_' + side

                    // 投资组合分布
                    if (!(pfo in this.positionsByPfos)){
                        this.positionsByPfos[pfo] = {}
                    }
                    if (key in this.positionsByPfos[pfo]){
                        this.positionsByPfos[pfo][key]._y += usdtAmount
                        this.positionsByPfos[pfo][key].y = parseInt(Math.abs(this.positionsByPfos[pfo][key]._y))
                    } else {
                        this.positionsByPfos[pfo][key] = {
                            name: this.chineseString(key),
                            _y: usdtAmount,
                            y: parseInt(Math.abs(usdtAmount)),
                            color: this.colorMap(key)
                        }
                    } 
                }
            }

            // Pfo Pie图(Refactor!)
            for (let pfo in this.positionsByPfos){
                var option = deepCopy(this.pfoPositionOptions)
                option.title.text = pfo
                option.sort_id = config.pfoAliasSortWeights[pfo]
                fillPieByArray(Object.values(this.positionsByPfos[pfo]), option)
                this.pfoOptions.push(option)

                // if (pfo === 'btcusd'){
                //     this.pfo1PositionOptions = deepCopy(this.pfoPositionOptions)
                //     this.pfo1PositionOptions.title.text = pfo
                //     fillPieByArray(Object.values(this.positionsByPfos[pfo]), this.pfo1PositionOptions)
                // } else if (pfo === 'top_altcoin'){
                //     this.pfo2PositionOptions = deepCopy(this.pfoPositionOptions)
                //     this.pfo2PositionOptions.title.text = pfo
                //     fillPieByArray(Object.values(this.positionsByPfos[pfo]), this.pfo2PositionOptions)
                // } else if (pfo === 'altcoin'){
                //     this.pfo3PositionOptions = deepCopy(this.pfoPositionOptions)
                //     this.pfo3PositionOptions.title.text = pfo
                //     fillPieByArray(Object.values(this.positionsByPfos[pfo]), this.pfo3PositionOptions)
                // } else if (pfo === 'altbtc'){
                //     this.pfo4PositionOptions = deepCopy(this.pfoPositionOptions)
                //     this.pfo4PositionOptions.title.text = pfo
                //     fillPieByArray(Object.values(this.positionsByPfos[pfo]), this.pfo4PositionOptions)
                // }
            }
            this.pfoOptions.sort((a, b) => a.sort_id - b.sort_id)
        },

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