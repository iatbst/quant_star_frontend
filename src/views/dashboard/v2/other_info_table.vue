<template>
    <!--- 表2: 仓位 --->
    <div>
        <el-table
        :data="otherInfoDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">
            <el-table-column label="加权杠杆率" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.weight_leverage >= 0">
                        {{(scope.row.weight_leverage).toFixed(2)}}X
                    </span>   
                    <span style="color: red" v-else>
                        {{(scope.row.weight_leverage).toFixed(2)}}X
                    </span>        
                </template>
            </el-table-column> 

            <el-table-column label="实盘&回测仓位差" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="Math.abs(scope.row.btPositions.position_diff) < 0.0003">
                        {{(scope.row.btPositions.position_diff*100).toFixed(3)}}%
                    </span>   
                    <span style="color: orange" v-else-if="Math.abs(scope.row.btPositions.position_diff) < 0.001">
                        {{(scope.row.btPositions.position_diff*100).toFixed(3)}}%
                    </span>  
                    <span style="color: red" v-else>
                        {{(scope.row.btPositions.position_diff*100).toFixed(3)}}%
                    </span> 
                    
                    <el-tooltip placement="top-start" align="left">
                        <div slot="content">
                            更新时间: {{ scope.row.btPositions.check_ts | epochToTimestamp}}
                            <br/>
                            总实盘仓位($): {{ scope.row.btPositions.live_positions.toFixed(0) }}
                            <br />
                            总回测仓位($): {{ scope.row.btPositions.bt_positions.toFixed(0) }}
                            <br/>
                        </div>
                        <span style=""><i class="el-icon-info"></i></span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="实盘&回测资金差($)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.btBalances.balance_diff >= 0">
                        {{(scope.row.btBalances.balance_diff).toFixed(0)}}
                    </span>   
                    <span style="color: red" v-else>
                        {{(scope.row.btBalances.balance_diff).toFixed(0)}}
                    </span> 
                    
                    <el-tooltip placement="top-start" align="left">
                        <div slot="content">
                            更新时间: {{ scope.row.btBalances.check_ts | epochToTimestamp}}
                        </div>
                        <div slot="content">
                            <li v-for="data in scope.row.btBalances.exchange_balance_diffs">
                                <span style="font-size: 15px">{{ data.exchange }}: 
                                    <span style="color: green" v-if="data.balance_diff >= 0">
                                        {{ data.balance_diff.toFixed(0) }}
                                    </span>
                                    <span style="color: red" v-else>
                                        {{ data.balance_diff.toFixed(0) }}
                                    </span>                                    
                                </span>
                            </li>
                        </div>
                        <span style=""><i class="el-icon-info"></i></span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="实盘&回测调整资金差($)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.btBalances.adjust_balance_diff >= 0">
                        {{(scope.row.btBalances.adjust_balance_diff).toFixed(0)}}
                    </span>   
                    <span style="color: red" v-else>
                        {{(scope.row.btBalances.adjust_balance_diff).toFixed(0)}}
                    </span> 
                    
                    <el-tooltip placement="top-start" align="left">
                        <div slot="content">
                            <div>
                                手续费调整金额($): 
                                <span style="color: green;font-size: 15px" v-if="scope.row.btBalances.bt_fee_rewards >= 0">
                                    {{ scope.row.btBalances.bt_fee_rewards.toFixed(0) }}
                                </span>
                                <span style="color: red;font-size: 15px" v-else>
                                    {{ scope.row.btBalances.bt_fee_rewards.toFixed(0) }}
                                </span>  
                            </div>
                        
                            <div>
                                滑点调整金额($):
                                <span style="color: green;font-size: 15px" v-if="scope.row.btBalances.bt_slippage_rewards >= 0">
                                    {{ scope.row.btBalances.bt_slippage_rewards.toFixed(0) }}
                                </span>
                                <span style="color: red;font-size: 15px" v-else>
                                    {{ scope.row.btBalances.bt_slippage_rewards.toFixed(0) }}
                                </span>   
                            </div>                          
                            
                        </div>
                        <span style=""><i class="el-icon-info"></i></span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="资金滚动变化率" min-width="10%" align="center" >
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.btValueLineChange[0] >= 0">
                        {{ scope.row.btValueLineChange[0]  }}%
                    </span>   
                    <span style="color: red" v-else>
                        {{ scope.row.btValueLineChange[0]  }}%
                    </span> 
                    |
                    <span style="color: green" v-if="scope.row.btValueLineChange[1] >= 0">
                        {{ scope.row.btValueLineChange[1]  }}%
                    </span>   
                    <span style="color: red" v-else>
                        {{ scope.row.btValueLineChange[1]  }}%
                    </span> 
                    |
                    <span style="color: green" v-if="scope.row.btValueLineChange[2] >= 0">
                        {{ scope.row.btValueLineChange[2]  }}%
                    </span>   
                    <span style="color: red" v-else>
                        {{ scope.row.btValueLineChange[2]  }}%
                    </span> 
                    |
                    <span style="color: green" v-if="scope.row.btValueLineChange[3] >= 0">
                        {{ scope.row.btValueLineChange[3]  }}%
                    </span>   
                    <span style="color: red" v-else>
                        {{ scope.row.btValueLineChange[3]  }}%
                    </span> 
                </template>
            </el-table-column>


            <el-table-column label="24H抄底订单" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red" v-if="scope.row.todayPbOrderCount > 0">
                        <b>{{ scope.row.todayPbOrderCount }}</b>
                    </span>   
                    <span style="" v-else>
                        {{ scope.row.todayPbOrderCount }}
                    </span> 
                </template>
            </el-table-column>

            <el-table-column label="最新多头占比" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.longShortRatio == null">
                        N/A
                    </span>
                    <span style="" v-else>
                        <span style="color: green" v-if="scope.row.longShortRatio > 60">
                            {{ scope.row.longShortRatio }}%
                        </span>   
                        <span style="" v-else>
                            {{ scope.row.longShortRatio }}%
                        </span> 
                    </span>
                    <i class="el-icon-data-line" v-on:click="showLongShortRatioDialog()" style="cursor: pointer"></i>
                </template>
            </el-table-column>

            <el-table-column label="最新资金费率" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.swapFundingRate == null">
                        N/A
                    </span>
                    <span style="" v-else>
                        <span style="color: green" v-if="scope.row.swapFundingRate > 0">
                            {{ scope.row.swapFundingRate }}%
                        </span>   
                        <span style="" v-else>
                            {{ scope.row.swapFundingRate }}%
                        </span> 
                    </span>
                    <i class="el-icon-data-line" v-on:click="showSwapFundingRateDialog()" style="cursor: pointer"></i>
                </template>
            </el-table-column>

            <el-table-column label="最新趋势分" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.bullBearScore == null">
                        N/A
                    </span>
                    <span style="" v-else>
                        <span style="color: green" v-if="scope.row.bullBearScore >= 0.6">
                            {{ scope.row.bullBearScore }}
                        </span>   
                        <span style="color: red" v-else>
                            {{ scope.row.bullBearScore }}
                        </span> 
                    </span>
                    <i class="el-icon-data-line" v-on:click="showBullBearDialog()" style="cursor: pointer"></i>
                </template>
            </el-table-column>  
        </el-table>

        <el-dialog width="80%" title="多空人数占比" :visible.sync="longShortRatioDialogVisible">
            <div>
                <highcharts :options="longShortRatiosOptions" style="margin-top: 20px"></highcharts>
            </div>
        </el-dialog>

        <el-dialog width="80%" title="" :visible.sync="swapFundingRateDialogVisible">
            <div>
                <highcharts :options="swapFundingRatesOptions" style="margin-top: 20px"></highcharts>
            </div>
        </el-dialog> 

        <el-dialog width="80%" title="" :visible.sync="bullBearDialogVisible">
            <div>
                <highcharts :options="bullBearOptions" style="margin-top: 20px"></highcharts>
            </div>
        </el-dialog>        
    </div>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands, getAnnualReturn, getMaxDrawdown} from '@/utils/general'
import moment from 'moment'
import {addSingleLine} from '@/utils/chart'
import {addSingleColumn} from '@/utils/chart'
import {Chart} from 'highcharts-vue'
import { getLongShortRatios } from '@/api/long_short_ratio'
import { getSwapFundingRates } from '@/api/swap_funding_rate'
import multiValueLine from '@/views/balance/_multi_value_line'


export default {
    components: {
        highcharts: Chart,
        multiValueLine,
    },

    props: {
        subaccountDatas: {
            type:Object,
            default:{}
        },
        parentPfoWallet: {
            type:Object,
            default:{}
        }, 
        parentPfoBacktest: {
            type:Object,
            default:{}
        }, 
        todayPbOrderCount: {
            type: Number,
            default: null
        },   
        longShortRatios: {
            type: Array,
            default: []
        },   
        swapFundingRates: {
            type: Array,
            default: []
        },
        bullBearData: {
            type:Object,
            default:{}
        },  
        btValueLines: {
            type:Object,
            default:{}           
        }              
    },

    watch: {
        // parentPfoMacroStrategies: {
        //     handler(val, oldVal){
        //         this.parseMacroStrategies()
        //     },
        //     deep: true
        // },
        // todayPbOrderCount: {
        //     handler(val, oldVal){
        //         this.parseMacroStrategies()
        //     },
        //     deep: true
        // },
        // longShortRatios: {
        //     handler(val, oldVal){
        //         this.parseLongShortRatios()
        //     },
        //     deep: true
        // },
    },

    filters: {
        epochToTimestamp(ts) {
        if (ts) {
            const stillUtc = moment.utc(ts*1000).toDate()
            return moment(stillUtc)
            .local()
            .format('YYYY-MM-DD HH:mm:ss')
        } else {
            return '--'
        }
        return ts.replace('T', ' ').slice(0, 19)
        },
    },

    data() {
        return {
            otherInfoDatas: [{
                // 加权杠杆率
                weight_leverage: null,

                // 实盘回测仓位对比数据
                btPositions: null,

                // 实盘回测资金对比数据
                btBalances: null,

                // 回测资产曲线滚动变化率
                btValueLineChange: null,

                // 24H内抄底订单
                todayPbOrderCount: null,

                // 最近的多空数据(平均值)
                longShortRatio: null,

                // 最近的资金费率(Binance:BTC)
                swapFundingRate: null,

                // 最近的趋势分
                bullBearScore: null
            }],

            // 曲线图: 多空占比
            // longShortRatioLineData: null,
            longShortRatioDialogVisible: false,
            longShortRatiosOptions: {
                chart: {
                    type: 'line',
                    zoomType: 'x'
                },
                title: {
                    text: '',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    type: this.yType,
                    title: {
                        text: '%'
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

            // 曲线图: 资金费率
            // swapFundingRateLineData: null,
            swapFundingRateDialogVisible: false,
            // Column
            swapFundingRatesOptions: {
                chart: {
                    type: 'column',
                    height: 400
                },

                title: {
                    text: 'BTC(Binance)资金费率',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: '%'
                    },
                },
                
                exporting: { enabled: false },
                
                legend: {
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}%'
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                },
                series: [{
                    name: '费率',
                    data: [],
                }],
            },
            // Line
            // swapFundingRatesOptions: {
            //     chart: {
            //         type: 'line',
            //         zoomType: 'x'
            //     },
            //     title: {
            //         text: '',
            //     },
            //     xAxis: {
            //         categories: []
            //     },
            //     yAxis: {
            //         type: this.yType,
            //         title: {
            //             text: '%'
            //         }
            //     },
            //     exporting: { enabled: false },
                
            //     plotOptions: {
            //         series: {
            //             label: {
            //                 connectorAllowed: false
            //             },
            //         },
            //         line: {
            //             marker: {
            //                 enabled: false
            //             },
            //         }			        
            //     },
                
            //     series: [],  
            // }, 

            // 曲线图: 多空占比
            bullBearDialogVisible: false,
            bullBearOptions: {
                chart: {
                    type: 'line',
                    zoomType: 'x'
                },
                title: {
                    text: '',
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    type: this.yType,
                    title: {
                        text: ''
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
        }
    },

    created() {
        // 分析Data
        this.parse()
    },

    methods: {
        parse(){
            // 计算加权杠杆率
            this.otherInfoDatas[0].weight_leverage = this.cal_weight_leverage()

            // 宏观策略仓位信息从系统后台获取
            // var vsData = this.parentPfoMacroStrategies.value_surge
            // this.otherInfoDatas[0].vsState = vsData.active
            // if(vsData.active){
            //     // 激活
            //     this.otherInfoDatas[0].vsActiveDt = vsData.macro_strategy_date
            //     this.otherInfoDatas[0].vsLeftDays = vsData.left_days.toFixed(1)
            //     this.otherInfoDatas[0].vsActiveSurge = vsData.active_surge          
            // } else {
            //     // 未激活,展示candidate信息
            //     this.otherInfoDatas[0].vsCandidateDt = vsData.candidate_dt
            //     this.otherInfoDatas[0].vsCandidateRight = vsData.candidate_right
            //     this.otherInfoDatas[0].vsCandidateSurge = (vsData.candidate_surge*100).toFixed(1)                
            // }

            // 实盘回测仓位对比数据
            this.otherInfoDatas[0].btPositions = this.parentPfoBacktest.positions

            // 实盘回测资金对比数据
            this.otherInfoDatas[0].btBalances = this.parentPfoBacktest.balances
            this.otherInfoDatas[0].btBalances['rewards'] = this.otherInfoDatas[0].btBalances['bt_fee_rewards'] + this.otherInfoDatas[0].btBalances['bt_slippage_rewards']
            this.otherInfoDatas[0].btBalances['adjust_balance_diff'] = this.otherInfoDatas[0].btBalances['balance_diff'] + this.otherInfoDatas[0].btBalances['rewards']
            
            // 回测资产变化率
            this.otherInfoDatas[0].btValueLineChange = [
                (this.btValueLines.binance.change*100).toFixed(0), 
                (this.btValueLines.okex.change*100).toFixed(0), 
                (this.btValueLines.bybit.change*100).toFixed(0), 
                (this.btValueLines.bitget.change*100).toFixed(0)
            ]

            // 抄底订单
            this.otherInfoDatas[0].todayPbOrderCount = this.todayPbOrderCount

            // 分析long_short_ratios
            this.otherInfoDatas[0].longShortRatio = this.getLastLongShortRatio()

            // 分析swap_funding_rates
            this.otherInfoDatas[0].swapFundingRate = this.getLastSwapFundingRate()

            // 分析bull_bear
            this.otherInfoDatas[0].bullBearScore = this.getBullBearData()
        },

        cal_weight_leverage(){
            // 计算根据btc/eth加权后的杠杆率
            // 目前加权算法: btc * 0.33, eth * 0.66, 其他币种不变
            var totalPosition = 0
            var totalBtcPosition = 0
            var totalEthPosition = 0
            for(let data of this.subaccountDatas){
                var summary = data.positions.summary
                totalPosition += summary.usdt_long
                totalPosition += summary.usdt_short

                var symbolData = data.positions.data
                for(let symbol in symbolData){
                    if(symbol == 'BTC/USDT'){
                        totalBtcPosition += symbolData[symbol].usdt_position
                    }
                    if(symbol == 'ETH/USDT'){
                        totalEthPosition += symbolData[symbol].usdt_position
                    }
                }          
            }
            var otherPosition = totalPosition - totalBtcPosition - totalEthPosition
            var totalWeightPosition = totalBtcPosition/3 + totalEthPosition*2/3 + otherPosition
            return totalWeightPosition/this.parentPfoWallet.usdt_amount 
        },
        
        parseLongShortRatios(){
            this.otherInfoDatas[0].longShortRatio = this.getLastLongShortRatio()
        },

        parseSwapFundingRates(){
            this.otherInfoDatas[0].swapFundingRate = this.getLastSwapFundingRate()
        },

        showLongShortRatioDialog(){
            this.longShortRatioDialogVisible = true
            this.fetchLongShortRatios()
        },

        showSwapFundingRateDialog(){
            this.swapFundingRateDialogVisible = true
            this.fetchSwapFundingRates()
        },

        showBullBearDialog(){
            this.bullBearDialogVisible = true
            this.parseBullBearData()
        },

        parseBullBearData(){
            // 分析bullBearData
            this.bullBearOptions.series = []

            // Line
            var datas = {}
            for(let dt of Object.keys(this.bullBearData).sort()){
                datas[dt] = this.bullBearData[dt]
            }
            addSingleLine('趋势分(BTC)', datas, this.bullBearOptions, false, 1)

            // Column
            // var colDatas = []
            // for(let data of this.swapFundingRates){
            //     var ts = new Date((data.mts/1000 + 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')
            //     colDatas.push({
            //         'x': ts,
            //         'y': Number(((data.rate*100)).toFixed(4)),
            //         'color': data.rate >= 0 ? 'green' : 'red'
            //     })                   
            // }
            // addSingleColumn(colDatas, this.swapFundingRatesOptions) 

            // 顺便更新
            this.otherInfoDatas[0].bullBearScore = this.getBullBearData()         
        },

        getLastLongShortRatio(){
            // 从4大平台的数据中分析出最近的值
            this.longShortRatios.sort((a, b) => b.mts - a.mts)
            var last_mts = null
            var count = 0
            var sum = 0
            for(let data of this.longShortRatios){
                // 找到第一组4个数据的mts值都一致的数据
                if(last_mts == null || data.mts == last_mts){
                    count += 1
                    sum += data.long
                    if (count == 4){
                        return ((sum/4)*100).toFixed(1)
                    }
                } else {
                    count = 1
                    sum = data.long
                    last_mts = data.mts
                }
            }

            // 没找到
            return null
        },

        getLastSwapFundingRate(){
            // 从数据中分析出最近的值
            this.swapFundingRates.sort((a, b) => b.mts - a.mts)
            // debugger
            if (this.swapFundingRates.length > 0){
                return (this.swapFundingRates[0].rate*100).toFixed(3)
            } else {
                return null
            }
        },

        getBullBearData(){
            // 从数据中分析出最近的值
            var dates = Object.keys(this.bullBearData).sort()
            if (dates.length > 0){
                var last_dt = dates[dates.length - 1]
                return this.bullBearData[last_dt]
            } else {
                return null
            }
        },

        // 获取最近N小时的多空数据
        fetchLongShortRatios(){
            this.longShortRatios = []
            // this.longShortRatioLineData = []
            this.longShortRatiosOptions.series = []
            var hours = 72  // 展示最近多久的数据
            var startMts = Date.now() - hours * 3600 * 1000
            var filters = 'show_exchange=true&mts__gte=' + startMts
            getLongShortRatios(config.masterHost, filters).then(response => {
                    this.longShortRatios = response.results

                    var datas = {}
                    var sampleExchange = null
                    var sampleDates = []
                    for(let data of this.longShortRatios){
                        var exchange = data.exchange.name
                        if (!(exchange in datas)){
                            datas[exchange] = {}
                            if (sampleExchange == null){
                                sampleExchange = exchange
                            }
                        }
                        var ts = new Date((data.mts/1000 + 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')
                        datas[exchange][ts] = data.long*100
                        if (exchange == sampleExchange){
                            sampleDates.push(ts)
                        }
                    }
                    // debugger

                    // 添加合并曲线
                    var avg = {}
                    for(let ts of sampleDates){
                        var sum = 0
                        var valid = true
                        var count = 0
                        for(let exchange in datas){
                            if(ts in datas[exchange]){
                                sum += datas[exchange][ts]
                                count += 1
                            } else {
                                valid = false
                                break
                            }
                        }
                        if (valid){
                            avg[ts] = sum/count
                        }
                    }
                    datas['avg'] = avg

                    for(let exchange in datas){
                        addSingleLine(exchange, datas[exchange], this.longShortRatiosOptions, false, 1)
                    }

                    // 顺便更新
                    this.parseLongShortRatios()
                }
            )
        },

        // 获取最近N小时的资金费率数据
        fetchSwapFundingRates(){
            this.swapFundingRates = []
            // this.swapFundingRateLineData = []
            // this.swapFundingRatesOptions.series = []
            var days = 30  // 展示最近多久的数据
            var startMts = Date.now() - days * 24 * 3600 * 1000
            var filters = 'mts__gte=' + startMts
            getSwapFundingRates(config.masterHost, filters).then(response => {
                    this.swapFundingRates = response.results
                    this.swapFundingRates.sort((a, b) => a.mts - b.mts)

                    // Line
                    // var datas = {}
                    // for(let data of this.swapFundingRates){
                    //     var ts = new Date((data.mts/1000 + 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')
                    //     datas[ts] = data.rate*100
                    // }
                    // addSingleLine('BTC(Binance)资金费率', datas, this.swapFundingRatesOptions, false, 3)

                    // Column
                    var colDatas = []
                    for(let data of this.swapFundingRates){
                        var ts = new Date((data.mts/1000 + 3600*8)*1000).toISOString().slice(0, 19).replace('T', ' ')
                        colDatas.push({
                            'x': ts,
                            'y': Number(((data.rate*100)).toFixed(4)),
                            'color': data.rate >= 0 ? 'green' : 'red'
                        })                   
                    }
                    addSingleColumn(colDatas, this.swapFundingRatesOptions) 

                    // 顺便更新
                    this.parseSwapFundingRates()
                }
            )
        },

        toThousands: toThousands,
    },
}


</script>