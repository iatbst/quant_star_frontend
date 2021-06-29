<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex" style="margin-bottom: 100px">
        <!-- 总资金曲线 -->
        <el-col :span="12">
            <!-- 曲线 -->
            <highcharts :options="allChartOptions"></highcharts>
        </el-col>

        <el-col :span="10" :offset="1">
            <!-- 统计信息 -->
            <el-card class="box-card" style="min-height: 80%;margin-top: 20px; border-color: black">
                <div>
                    <el-row :gutter="0" type="flex" align="middle">
                        <el-col :span="16" align="center">
                            <h1 style="font-size: 450%">
                                ${{ toThousands(Math.round(allBalanceStats.usdt_amount)) }}
                            </h1>
                        </el-col>
                        <el-col :span="8" align="center">
                            <h1 style="font-size: 250%; color: green" v-if="allBalanceStats.day_diff >= 0">
                                <i class="el-icon-top"></i>{{ toThousands(Math.round(allBalanceStats.day_diff)) }}
                            </h1> 
                             <h1 style="font-size: 250%; color: red" v-else>
                                <i class="el-icon-bottom"></i>{{ toThousands(-Math.round(allBalanceStats.day_diff)) }}
                            </h1>                                                 
                        </el-col>                        
                    </el-row>
                    <el-row :gutter="0" type="flex" align="middle">
                        <el-col :span="12" align="center">
                            <h2>
                                <i class="el-icon-bottom" style="color: red"></i>{{ (allBalanceStats.drawdown*100).toFixed(2) }}%
                            </h2>
                        </el-col>
                        <el-col :span="12" align="center">
                            <h2>
                                MAX<i class="el-icon-bottom" style="color: red"></i>{{ (allBalanceStats.max_drawdown*100).toFixed(2) }}%
                            </h2>
                        </el-col>                    
                    </el-row>                    
                </div>
            </el-card>
        </el-col> 
    </el-row>
    
    <el-row :gutter="0" type="flex" style="margin-bottom: 50px">
        <!-- Pfo资金曲线 -->
        <el-col :span="12">
            <!-- 曲线 -->
            <highcharts :options="pfoChartOptions"></highcharts>
        </el-col>

        <el-col :span="10" :offset="1">
            <!-- 统计信息 -->
            <el-table
                v-loading="pfoTableLoading"
                :data="pfoBalancesStats"
                style="width: 100%; margin-bottom: 20px; margin-top: 45px"
                :header-cell-style="{ background: '#f2f2f2' }"
            >
                <el-table-column label="投资组合" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.pfo }}
                  </template>
                </el-table-column>

                <el-table-column label="资金" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ toThousands(Math.round(scope.row.usdt_amount)) }}
                  </template>
                </el-table-column>

                <el-table-column label="今日变动" min-width="20%" align="center">
                  <template slot-scope="scope">
                      <span style="color: green" v-if="scope.row.day_diff >= 0">
                          {{ toThousands(Math.round(scope.row.day_diff)) }}
                      </span>
                      <span style="color: red" v-else>
                          {{ toThousands(Math.round(scope.row.day_diff)) }}
                      </span>                      
                  </template>
                </el-table-column>

                <el-table-column label="当前回撤" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ (scope.row.drawdown*100).toFixed(2) }}%
                  </template>
                </el-table-column>

                <el-table-column label="最大回撤" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ (scope.row.max_drawdown*100).toFixed(2) }}%
                  </template>
                </el-table-column>
            </el-table>          
        </el-col> 
    </el-row>

    <el-row :gutter="0" type="flex" style="margin-bottom: 50px">
        <!-- 资金图表 -->
        <el-col :span="8">
            <!-- 资金分布: USDT vs Coin -->
            <highcharts :options="coinsChartOptions"></highcharts>
        </el-col>

        <el-col :span="8">
            <!-- 资金分布: 交易所 -->
            <highcharts :options="exchangesChartOptions"></highcharts>
        </el-col>

        <el-col :span="8">
            <!-- 资金分布: 投资组合 -->
            <highcharts :options="pfosChartOptions"></highcharts>
        </el-col>                      
    </el-row>

    <el-row :gutter="0" type="flex"  style="margin-bottom: 20px">
          <!-- 资金Summary -->
          <el-table
            v-loading="summaryTableLoading"
            :data="balanceList"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px"
            :header-cell-style="{ background: '#f2f2f2' }"
            border
            show-summary
            :summary-method="getSummaries"
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

            <el-table-column align="center" prop="asset"  sortable label="资产">
            </el-table-column>

            <el-table-column align="center" prop="amount"  label="数量">
            </el-table-column>

            <el-table-column align="center" prop="usdtAmount" sortable label="USDT">
            </el-table-column>
          </el-table>
    </el-row>

  </div>


</template>


<script>
import config from '@/configs/system_configs'
import { getSubAccountWalletDatas } from '@/api/subaccount'
import { getPortfolioDatas } from '@/api/portfolio' 
import {Chart} from 'highcharts-vue'

export default {
    components: {
        highcharts: Chart
    },

    data() {
        return {
            balanceList: [],
            summaryTableLoading: true,
            totalUsdtAmount: 0,
            allBalanceStats: {},
            pfoBalancesStats: null,
            pfoTableLoading: false,

           // 总资产曲线图
            allChartOptions: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: '总资金',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: '美元'
                    }
                },
                exporting: { enabled: false },
                
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                    },
                    line: {
                        marker: {
                            enabled: false
                        },
                    }			        
                },
                
                series: [],  
            },

            // Pfo资产曲线图(1 - 4)
            pfoChartOptions: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: '投资组合资金',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: '美元'
                    }
                },
                exporting: { enabled: false },
                
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                    },
                    line: {
                        marker: {
                            enabled: false
                        },
                    }			        
                },
                
                series: [],  
            },

            // 分布图表配置: USDT vs Coin
            balancesByCoins: {},
            coinsChartOptions: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '币种($)'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        size: '80%'
                    }
                },
                series: [{
                    name: '美元占比',
                    colorByPoint: true,
                    data: [
                        // {
                        //     name: 'USDT',
                        //     y: 60,
                        // },...
                    ]
                }]               
            },

            balancesByExchanges: {},
            exchangesChartOptions: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '交易所($)'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        size: '80%'
                    }
                },
                series: [{
                    name: '美元占比',
                    colorByPoint: true,
                    data: [
                        // {
                        //     name: 'USDT',
                        //     y: 60,
                        // },...
                    ]
                }]               
            }, 
            balancesByPfos: {},
            pfosChartOptions: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '投资组合($)'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        size: '80%'
                    }
                },
                series: [{
                    name: '美元占比',
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
        this.fetchPfoDatas()
        this.fetchSubAccountWalletDatas()
    },
    methods: {
        fillBalanceLineChart(pfo, balanceValues, chartOptions){
            // 填充资金曲线
            var lineData = {name: pfo, data: []}
            if (Object.keys(balanceValues).length > chartOptions.xAxis.categories.length){
                chartOptions.xAxis.categories = Object.keys(balanceValues).sort()
            }
            for (var i = 0; i < chartOptions.xAxis.categories.length; i++){
                var day_ts = chartOptions.xAxis.categories[i]
                lineData.data.push(Math.round(balanceValues[day_ts]))
            }
            chartOptions.series.push(lineData)
        },
        fillBalancePieChart(balances, chartOptions){
            // 填充资金分布
            for (let asset in balances) {
                chartOptions.series[0].data.push({
                    name: asset,
                    y: balances[asset]*100/this.totalUsdtAmount
                })
            }
        },
        fetchSubAccountWalletDatas() {
            this.summaryTableLoading = true
            getSubAccountWalletDatas(config.masterHost).then(response => {
                    this.balanceList = this.parseSubAccountWalletDatas(response.results)
                    this.summaryTableLoading = false
                }
            )
        },
        fetchPfoDatas() {
            this.pfoTableLoading = true
            getPortfolioDatas(config.masterHost).then(response => {
                    this.parsePfoDatas(response.results)
                    this.pfoTableLoading = false
                }
            )
        },
        parsePfoDatas(dataList){
            this.pfoBalancesStats = []
            for(var i = 0; i < dataList.length; i++){
                if (dataList[i].portfolio.name === config.cryptoParentPfo){
                    // Crypto父pfo
                    this.fillBalanceLineChart('总资金', dataList[i].wallet.history_values, this.allChartOptions)
                    this.allBalanceStats = dataList[i].wallet
                } else {
                    // 子Pfo
                    this.fillBalanceLineChart(dataList[i].portfolio.alias, dataList[i].wallet.history_values, this.pfoChartOptions)
                    dataList[i].wallet['pfo'] = dataList[i].portfolio.alias
                    this.pfoBalancesStats.push(dataList[i].wallet)
                }
            }
        },
        parseSubAccountWalletDatas(dataList){
            // 把subaccount.data.wallet list转化为balance list
            var balanceList = []
            for(var i = 0; i < dataList.length; i++){
                for(let asset in dataList[i].wallet.balances.total){
                    if (Math.abs(dataList[i].wallet.usdt_balances[asset]) > 100){
                        var usdtAmount = parseInt(dataList[i].wallet.usdt_balances[asset])
                        var exchange = dataList[i].subaccount.name.split('_')[0]
                        var pfo = dataList[i].subaccount.portfolio.alias
                        balanceList.push({
                            portfolio: pfo,
                            exchange: exchange,
                            username: dataList[i].subaccount.account.username,
                            subType: this.chineseString(dataList[i].subaccount.sub_type),
                            subMode: this.chineseString(dataList[i].subaccount.sub_mode),
                            asset: asset,
                            amount: dataList[i].wallet.balances.total[asset].toFixed(config.assetRoundLevel[asset]),
                            usdtAmount: usdtAmount
                        })
                        this.totalUsdtAmount += usdtAmount

                        // 币种分布
                        if (asset in this.balancesByCoins){
                            this.balancesByCoins[asset] += usdtAmount
                        } else {
                            this.balancesByCoins[asset] = usdtAmount
                        }
 
                        // 交易所分布
                        if (exchange in this.balancesByExchanges){
                            this.balancesByExchanges[exchange] += usdtAmount
                        } else {
                            this.balancesByExchanges[exchange] = usdtAmount
                        }

                        // 投资组合分布
                        if (pfo in this.balancesByPfos){
                            this.balancesByPfos[pfo] += usdtAmount
                        } else {
                            this.balancesByPfos[pfo] = usdtAmount
                        }
                    }
                }
            }

            this.fillBalancePieChart(this.balancesByCoins, this.coinsChartOptions)
            this.fillBalancePieChart(this.balancesByExchanges, this.exchangesChartOptions)
            this.fillBalancePieChart(this.balancesByPfos, this.pfosChartOptions)
            return balanceList
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
            }
            return cs
        },
        toThousands(num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },      
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                } else if (index === 7) {
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' $';
                    } else {
                        sums[index] = '';
                    }
                } else {
                    sums[index] = '';
                }
            });
            return sums;
        }
    }
}
</script>

<style scoped>
.el-table tbody tr:hover>td { 
    background-color:#ffffff!important
}
</style>