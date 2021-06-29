<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex" style="margin-bottom: 100px">
        <!-- 总仓位 -->
        <el-col :span="12">
            <!-- USDT/BTC Pie -->
            <highcharts :options="allPieOptions"></highcharts>
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
                    <el-row :gutter="0" type="flex" align="middle">
                        <el-col :span="12" align="center">
                            <h3>
                                BTCUSD:
                                <span style="color: green" v-if="positionSummaryByPfos['btcusd'] >= 0">
                                    {{ toThousands(Math.round(positionSummaryByPfos['btcusd'])) }}
                                </span>
                                <span style="color: red" v-else>
                                    {{ toThousands(Math.round(-positionSummaryByPfos['btcusd'])) }}
                                </span>                                
                            </h3>                          
                        </el-col>
                        <el-col :span="12" align="center">
                            <h3>
                                TOP_ALTCOIN:
                                <span style="color: green" v-if="positionSummaryByPfos['top_altcoin'] >= 0">
                                    {{ toThousands(Math.round(positionSummaryByPfos['top_altcoin'])) }}
                                </span>
                                <span style="color: red" v-else>
                                    {{ toThousands(Math.round(-positionSummaryByPfos['top_altcoin'])) }}
                                </span>                                
                            </h3>   
                        </el-col>                    
                    </el-row> 

                    <el-row :gutter="0" type="flex" align="middle">
                        <el-col :span="12" align="center">
                            <h3>
                                ALTCOIN:
                                <span style="color: green" v-if="positionSummaryByPfos['altcoin'] >= 0">
                                    {{ toThousands(Math.round(positionSummaryByPfos['altcoin'])) }}
                                </span>
                                <span style="color: red" v-else>
                                    {{ toThousands(Math.round(-positionSummaryByPfos['altcoin'])) }}
                                </span>                                
                            </h3>                          
                        </el-col>
                        <el-col :span="12" align="center">
                            <h3>
                                ALTBTC:
                                <span style="color: green" v-if="positionSummaryByPfos['altbtc'] >= 0">
                                    {{ toThousands(Math.round(positionSummaryByPfos['altbtc'])) }}
                                </span>
                                <span style="color: red" v-else>
                                    {{ toThousands(Math.round(-positionSummaryByPfos['altbtc'])) }}
                                </span>                                
                            </h3>   
                        </el-col>                    
                    </el-row>                                        
                </div>
            </el-card>
        </el-col> 
    </el-row>            

    <el-row :gutter="0" type="flex" style="margin-bottom: 50px">
        <!-- 仓位排名 -->
         <el-col :span="24">
            <highcharts :options="rankColumnOptions"></highcharts>
        </el-col>   
    </el-row>

    <el-row :gutter="0" type="flex" style="margin-bottom: 50px">
        <!-- Pfo仓位 -->
        <el-col :span="6">
            <!-- pfo1 -->
            <highcharts :options="pfo1PieOptions"></highcharts>
        </el-col>

        <el-col :span="6">
            <!-- pfo2 -->
            <highcharts :options="pfo2PieOptions"></highcharts>
        </el-col>  

        <el-col :span="6">
            <!-- pfo3 -->
            <highcharts :options="pfo3PieOptions"></highcharts>
        </el-col>
        
        <el-col :span="6">
            <!-- pfo4 -->
            <highcharts :options="pfo4PieOptions"></highcharts>
        </el-col>                   
    </el-row>
  

    <el-row :gutter="0" type="flex"  style="margin-bottom: 20px">
          <!-- 资金Summary -->
          <el-table
            v-loading="summaryTableLoading"
            :data="positionList"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px"
            :header-cell-style="{ background: '#f2f2f2' }"
            border
          >
            <el-table-column align="center" prop="portfolio"  sortable label="投资组合">
            </el-table-column>

            <el-table-column align="center" prop="exchange"  sortable label="交易所">
            </el-table-column>

            <el-table-column align="center" prop="username"  sortable label="账号">
            </el-table-column>

            <el-table-column align="center" prop="subType"  sortable label="类型">
            </el-table-column>

            <el-table-column align="center" prop="subMode"  sortable label="子类">
            </el-table-column>

            <el-table-column align="center" prop="symbol"  sortable label="交易对">
            </el-table-column>

            <el-table-column align="center" prop="usdtAmount"  sortable label="仓位($)">
            </el-table-column>
          </el-table>
    </el-row>

  </div>


</template>


<script>
import config from '@/configs/system_configs'
import { toThousands } from '@/utils/general'
import { getSubAccountPositionDatas } from '@/api/subaccount'
import {Chart} from 'highcharts-vue'

export default {
    components: {
        highcharts: Chart
    },

    data() {
        return {
            positionList: [],
            summaryTableLoading: true,
            totalUsdtAmount: 0,
            totalLongAmount: 0,
            totalShortAmount: 0,

            // 总分布: USDT vs BTC, Long vs Short
            positionsByCoins: {},
            allPieOptions: {
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

            positionRanks: {},
            rankColumnOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: null,
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '仓位($)'
                    },
                },
                
                exporting: { enabled: false },
                
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false,
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}$'
                },
                plotOptions: {
                    column: {
                        //stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: '仓位',
                    data: [],
                }],
            },

            // Pfo分布: USDT vs BTC, Long vs Short
            positionsByPfos: {},
            positionSummaryByPfos: {},
            pfo1PieOptions: {
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
            pfo2PieOptions: {
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
            pfo3PieOptions: {
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
            pfo4PieOptions: {
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
        // this.fetchPfoDatas()
        this.fetchSubAccountDatas()
    },
    methods: {
        fillPieChart(positions, chartOptions, title){
            // 填充仓位分布
            for (let key in positions) {
                chartOptions.title.text = title
                chartOptions.series[0].data.push({
                    name: this.chineseString(key),
                    y: parseInt(Math.abs(positions[key])),
                    color: this.colorMap(key)
                })
            }
        },

        fillColumnChart(positions, chartOptions, title){
            // 填充仓位分布
            var rankNum = 20
            var positionList = Object.values(positions).sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
            for (var i = 0; i < positionList.length; i++){
                chartOptions.title.text = title
                chartOptions.series[0].data.push({
                    y: parseInt(Math.abs(positionList[i].amount)),
                    color: positionList[i].amount >= 0 ? 'green' : 'red'
                })  
                chartOptions.xAxis.categories.push(positionList[i].symbol)
                if (i == rankNum - 1){ break }             
            }
        },

        fetchSubAccountDatas() {
            this.summaryTableLoading = true
            getSubAccountPositionDatas(config.masterHost).then(response => {
                    this.positionList = this.parseSubAccountPositionDatas(response.results)
                    // 总仓位Pie图
                    this.fillPieChart(this.positionsByCoins, this.allPieOptions, '多空分布($)')

                    // 仓位排名Column图
                    this.fillColumnChart(this.positionRanks, this.rankColumnOptions, '前20仓位')

                    // Pfo Pie图(Refactor!)
                    for (let pfo in this.positionsByPfos){
                        if (pfo === 'btcusd'){
                            this.fillPieChart(this.positionsByPfos[pfo], this.pfo1PieOptions, pfo + '($)')
                        } else if (pfo === 'top_altcoin'){
                            this.fillPieChart(this.positionsByPfos[pfo], this.pfo2PieOptions, pfo + '($)')
                        } else if (pfo === 'altcoin'){
                            this.fillPieChart(this.positionsByPfos[pfo], this.pfo3PieOptions, pfo + '($)')
                        } else if (pfo === 'altbtc'){
                            this.fillPieChart(this.positionsByPfos[pfo], this.pfo4PieOptions, pfo + '($)')
                        }
                    }
                    this.summaryTableLoading = false
                }
            )
        },


        parseSubAccountPositionDatas(saDataList){
            // 把subaccount data list转化为balance list
            var positionList = []
            
            for(var i = 0; i < saDataList.length; i++){
                for(let symbol in saDataList[i].positions.data){
                    if (Math.abs(saDataList[i].positions.data[symbol]) > 100){
                        var usdtAmount = saDataList[i].positions.data[symbol]
                        var exchange = saDataList[i].subaccount.account.name.split('_')[0]
                        var pfo = saDataList[i].subaccount.portfolio.alias
                        positionList.push({
                            portfolio: pfo,
                            exchange: exchange,
                            username: saDataList[i].subaccount.account.username,
                            subType: this.chineseString(saDataList[i].subaccount.sub_type),
                            subMode: this.chineseString(saDataList[i].subaccount.sub_mode),
                            symbol: symbol,
                            usdtAmount: parseInt(usdtAmount)
                        })
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

                        // 币种排名
                        var base = symbol.split('/')[0]
                        var _symbol = base + '/' + quote
                        if (_symbol in this.positionRanks){
                            // 更新
                            this.positionRanks[_symbol].amount += usdtAmount
                        } else {
                            // 新symbol
                            this.positionRanks[_symbol] = {
                                symbol: _symbol,
                                amount: usdtAmount,
                            }
                        }

                        // 投资组合分布
                        if (!(pfo in this.positionsByPfos)){
                            this.positionsByPfos[pfo] = {}
                            this.positionSummaryByPfos[pfo] = 0
                        }
                        if (coinKey in this.positionsByPfos[pfo]){
                            this.positionsByPfos[pfo][coinKey] += usdtAmount
                        } else {
                            this.positionsByPfos[pfo][coinKey] = usdtAmount
                        }   
                        this.positionSummaryByPfos[pfo] += usdtAmount           
                    }
                }
            }
            
            return positionList
        },

        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (row.summary){
            if (columnIndex % 4 === 0){
                return [1, 4]
            } else {
                return [0, 0]
            }
            }
        },

        toThousands(num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },  

        rowStyle({ row, rowIndex}){
            if ( row.fail ) {
            return {'color': 'red'}
            } else {
            return ''
            }
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

<style scoped>
.el-table tbody tr:hover>td { 
    background-color:#ffffff!important
}
</style>