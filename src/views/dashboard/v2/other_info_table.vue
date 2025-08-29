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

            <el-table-column label="VS状态" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red" v-if="scope.row.vsState">
                        <b>激活</b>
                    </span>   
                    <span style="" v-else>
                        未激活
                    </span> 
                </template>
            </el-table-column>

            <el-table-column label="VS激活日期" min-width="10%" align="center" v-if="otherInfoDatas[0].vsState">
                <template slot-scope="scope">
                    {{ scope.row.vsActiveDt }}
                </template>
            </el-table-column>
            <el-table-column label="VS低点日期" min-width="10%" align="center" v-else>
                <template slot-scope="scope">
                    {{ scope.row.vsCandidateDt }}
                </template>
            </el-table-column>

            <el-table-column label="VS剩余天数" min-width="10%" align="center" v-if="otherInfoDatas[0].vsState">
                <template slot-scope="scope">
                    {{ scope.row.vsLeftDays }}日
                </template>
            </el-table-column>
            <el-table-column label="VS低点距今" min-width="10%" align="center" v-else>
                <template slot-scope="scope">
                    {{ scope.row.vsCandidateRight }}日
                </template>
            </el-table-column>

           <el-table-column label="VS激活后涨幅" min-width="10%" align="center" v-if="otherInfoDatas[0].vsState">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.vsActiveSurge >= 0">
                        {{ (scope.row.vsActiveSurge*100).toFixed(1) }}%
                    </span>   
                    <span style="color: red" v-else>
                        {{ (scope.row.vsActiveSurge*100).toFixed(1) }}%
                    </span> 
                </template>
            </el-table-column>
            <el-table-column label="VS低点涨幅" min-width="10%" align="center" v-else>
                <template slot-scope="scope">
                    {{ scope.row.vsCandidateSurge }}%
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

            <el-table-column label="" min-width="10%" align="center">
                <template slot-scope="scope">
                </template>
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
                <template slot-scope="scope">
                </template>
            </el-table-column>  
        </el-table>

        <el-dialog width="80%" title="多空人数占比" :visible.sync="longShortRatioDialogVisible">
            <div>
                <highcharts :options="longShortRatiosOptions" style="margin-top: 20px"></highcharts>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands, getAnnualReturn, getMaxDrawdown} from '@/utils/general'
import moment from 'moment'
import {addSingleLine} from '@/utils/chart'
import {Chart} from 'highcharts-vue'
import { getLongShortRatios } from '@/api/long_short_ratio'
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
        parentPfoMacroStrategies: {
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

    data() {
        return {
            otherInfoDatas: [{
                // 加权杠杆率
                weight_leverage: null,

                // 宏观策略: value_surge
                vsState: null,
                vsCandidateDt: null,
                vsCandidateRight: null,
                vsCandidateSurge: null,

                // 24H内抄底订单
                todayPbOrderCount: null,

                // 最近的多空数据(平均值)
                longShortRatio: null
            }],

            // 曲线图
            longShortRatioLineData: null,
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
            // debugger
            var vsData = this.parentPfoMacroStrategies.value_surge
            this.otherInfoDatas[0].vsState = vsData.active
            if(vsData.active){
                // 激活
                this.otherInfoDatas[0].vsActiveDt = vsData.macro_strategy_date
                this.otherInfoDatas[0].vsLeftDays = vsData.left_days.toFixed(1)
                this.otherInfoDatas[0].vsActiveSurge = vsData.active_surge          
            } else {
                // 未激活,展示candidate信息
                this.otherInfoDatas[0].vsCandidateDt = vsData.candidate_dt
                this.otherInfoDatas[0].vsCandidateRight = vsData.candidate_right
                this.otherInfoDatas[0].vsCandidateSurge = (vsData.candidate_surge*100).toFixed(1)                
            }

            // 抄底订单
            this.otherInfoDatas[0].todayPbOrderCount = this.todayPbOrderCount

            // 分析long_short_ratios
            this.otherInfoDatas[0].longShortRatio = this.getLastLongShortRatio()
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

        showLongShortRatioDialog(){
            this.longShortRatioDialogVisible = true
            this.fetchLongShortRatios()
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

        // 获取最近N小时的多空数据
        fetchLongShortRatios(){
            this.longShortRatios = []
            this.longShortRatioLineData = []
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

        toThousands: toThousands,
    },
}


</script>