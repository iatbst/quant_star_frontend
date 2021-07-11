<template>
    <el-row :gutter="0" type="flex" style="margin-bottom: 50px">
        <!-- 资金图表 -->
        <el-col :span="8">
            <!-- 资金分布: USDT vs Coin -->
            <highcharts :options="coinBalancesOptions"></highcharts>
        </el-col>

        <el-col :span="8">
            <!-- 资金分布: 交易所 -->
            <highcharts :options="exchangeBalancesOptions"></highcharts>
        </el-col>

        <el-col :span="8">
            <!-- 资金分布: 投资组合 -->
            <highcharts :options="pfoBalancesOptions"></highcharts>
        </el-col>                      
    </el-row>   
</template>

<script>
import {Chart} from 'highcharts-vue'
import {fillPie} from '@/utils/chart/'


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
            totalUsdtAmount: 0,

            // 分布图表配置: USDT vs Coin
            balancesByCoins: null,
            coinBalancesOptions: {
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

            balancesByExchanges: null,
            exchangeBalancesOptions: {
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

            balancesByPfos: null,
            pfoBalancesOptions: {
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
        // 分析Data
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData() {
            this.totalUsdtAmount = 0
            this.balancesByCoins = {}
            this.balancesByExchanges = {}
            this.balancesByPfos = {}

           for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let asset in this.subaccountDatas[i].wallet.balances.total){
                    if (Math.abs(this.subaccountDatas[i].wallet.usdt_balances[asset]) > 100) {
                        var usdtAmount = parseInt(this.subaccountDatas[i].wallet.usdt_balances[asset])
                        var exchange = this.subaccountDatas[i].subaccount.name.split('_')[0]
                        var pfo = this.subaccountDatas[i].subaccount.portfolio.alias
                        this.totalUsdtAmount += usdtAmount

                        // 币种分布
                        // 特例: 负USD转化为USDT(Eg. FTX)
                        if (asset === 'USD' && usdtAmount < 0){
                            asset = 'USDT'
                        }
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

            // 转换为百分比
            for(let key in this.balancesByCoins){
                this.balancesByCoins[key] = this.balancesByCoins[key]*100/this.totalUsdtAmount
            }
            for(let key in this.balancesByExchanges){
                this.balancesByExchanges[key] = this.balancesByExchanges[key]*100/this.totalUsdtAmount
            }
            for(let key in this.balancesByPfos){
                this.balancesByPfos[key] = this.balancesByPfos[key]*100/this.totalUsdtAmount
            }

            // 填充Pie
            fillPie(this.balancesByCoins, this.coinBalancesOptions)
            fillPie(this.balancesByExchanges, this.exchangeBalancesOptions)
            fillPie(this.balancesByPfos, this.pfoBalancesOptions)      
        },
    }
}
</script>
