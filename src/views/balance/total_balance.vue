<template>
    <el-row :gutter="0" type="flex">
        <!-- 总资金曲线 -->
        <el-col :span="12">
            <!-- 曲线 -->
            <highcharts :options="totalBalanceOptions"></highcharts>
            <div align="center">
                <el-button style="margin-left: 0px" type="info" size="mini"  @click="parseData()">
                    全部
                </el-button> 
                <el-button type="info" size="mini"  @click="parseData('thisYear')">
                    今年
                </el-button> 
                <el-button type="info" size="mini"  @click="parseData('6M')">
                    6个月
                </el-button>   
                <el-button type="info" size="mini"  @click="parseData('12M')">
                    12个月
                </el-button>  
                <el-button type="info" size="mini"  @click="parseData('2Y')">
                    2年
                </el-button>  
                <el-button type="info" size="mini"  @click="parseData('3Y')">
                    3年
                </el-button>  
            </div>       
        </el-col>

        <el-col :span="10" :offset="1">
            <!-- 统计信息 -->
            <el-card class="box-card" style="min-height: 80%;margin-top: 20px; border-color: black">
                <div>
                    <el-row :gutter="0" type="flex" align="middle">
                        <el-col :span="16" align="center">
                            <h1 style="font-size: 450%">
                                ${{ toThousands(Math.round(totalBalanceInfo.usdt_amount)) }}
                            </h1>
                        </el-col>
                        <el-col :span="8" align="center">
                            <h1 style="font-size: 250%; color: green" v-if="totalBalanceInfo.day_diff >= 0">
                                <i class="el-icon-top"></i>{{ toThousands(Math.round(totalBalanceInfo.day_diff)) }}
                            </h1> 
                             <h1 style="font-size: 250%; color: red" v-else>
                                <i class="el-icon-bottom"></i>{{ toThousands(-Math.round(totalBalanceInfo.day_diff)) }}
                            </h1>                                                 
                        </el-col>                        
                    </el-row>
                    <el-row :gutter="0" type="flex" align="middle">
                        <el-col :span="12" align="center">
                            <h2>
                                <i class="el-icon-bottom" style="color: red"></i>{{ (totalBalanceInfo.drawdown*100).toFixed(2) }}%
                            </h2>
                        </el-col>
                        <el-col :span="12" align="center">
                            <h2>
                                MAX<i class="el-icon-bottom" style="color: red"></i>{{ (totalBalanceInfo.max_drawdown*100).toFixed(2) }}%
                            </h2>
                        </el-col>                    
                    </el-row>                    
                </div>
            </el-card>
        </el-col> 
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {addSingleLine} from '@/utils/chart'
import {Chart} from 'highcharts-vue'
import {toThousands} from '@/utils/general'
import moment from 'moment' 

export default {
    components: {
        highcharts: Chart
    },

    props: {
        pfoDatas: {
            type:Array,
            default:[]
        }
    },

    watch: {
        pfoDatas: {
            handler(val, oldVal){
                this.parseData('6M')
            },
            deep: true
        }
    },

    data() {
        return {
            totalBalanceInfo: null,

            // 总资产曲线图
            totalBalanceOptions: {
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
        }
    },

    created() {
        // 分析Data
        this.parseData('6M')
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData(range=null) {
            this.totalBalanceInfo = {}
            this.totalBalanceOptions.series = []
            for(var i = 0; i < this.pfoDatas.length; i++){
                if (this.pfoDatas[i].portfolio.name === config.cryptoParentPfo){
                    // Crypto父pfo
                    addSingleLine('总资金', this.filterDates(this.pfoDatas[i].wallet.history_values, range), this.totalBalanceOptions)
                    this.totalBalanceInfo = this.pfoDatas[i].wallet
                }               
            }
        },

        filterDates(history_values, range){
            if (range === null){
                return history_values
            } else {
                var startDate = null
                if (range === '6M'){
                    // 过去6月
                    startDate = moment(new Date()).subtract(6,'months').format('YYYY-MM-DD')
                } else if (range == '12M') {
                    // 过去12月
                    startDate = moment(new Date()).subtract(12,'months').format('YYYY-MM-DD')
                } else if (range == 'thisYear'){
                    // 今年
                    startDate = moment().year() + '-' + '01-01'
                } else if (range == '2Y') {
                    // 过去2年
                    startDate = moment(new Date()).subtract(2,'years').format('YYYY-MM-DD')
                } else if (range == '3Y') {
                    // 过去3年
                    startDate = moment(new Date()).subtract(3,'years').format('YYYY-MM-DD')
                } else if (range == '4Y') {
                    // 过去4年
                    startDate = moment(new Date()).subtract(4,'years').format('YYYY-MM-DD')
                } else {
                    // 全部
                    return history_values
                }
                var values = {}
                for(let date in history_values){
                    if (date >= startDate){
                        values[date] = history_values[date]
                    }
                }  
                return values             
            }
        },

        toThousands: toThousands,
    }
}
</script>