<template>
    <el-row :gutter="0" type="flex">
        <!-- 总费用曲线 -->
        <el-col :span="12">
            <!-- 曲线 -->
            <div style="margin-top: 50px">
                <highcharts :options="totalFeeOptions"></highcharts>
            </div>
        </el-col>

        <el-col :span="10" :offset="1">
            <!-- 统计信息 -->
            <div style="margin-top: 50px">
                <el-card class="box-card" style="min-height: 80%;margin-top: 20px; margin-bottom: 20px; border-color: black">
                    <div>
                        <el-row :gutter="0" type="flex" align="middle">
                            <el-col :span="24" align="center">
                                <h1 style="font-size: 450%">
                                    ${{ toThousands(Math.round(totalFees)) }}
                                </h1>
                            </el-col>                      
                        </el-row>  

                        <el-row :gutter="0" type="flex" align="middle">
                            <el-col :span="12" align="center">
                                <h2 style="font-size: 150%;color: gray">
                                    本月累计: 
                                    <span style="color: gray" v-if="currentMonthFees > 0">
                                        {{ toThousands(Math.round(currentMonthFees)) }}
                                    </span>
                                    <span style="color: green" v-else>
                                        {{ toThousands(Math.round(currentMonthFees)) }}
                                    </span>
                                </h2> 
                            </el-col>
                            <el-col :span="12" align="center">
                                <h2 style="font-size: 150%;;color: gray">
                                    本年累计:
                                    <span style="color: gray" v-if="currentYearFees > 0">
                                        {{ toThousands(Math.round(currentYearFees)) }}
                                    </span>
                                    <span style="color: green" v-else>
                                        {{ toThousands(Math.round(currentYearFees)) }}
                                    </span>                                
                                </h2>                                                 
                            </el-col>                     
                        </el-row>  
    
                        <el-row :gutter="0" type="flex" align="middle">
                            <el-col :span="8" align="center">
                                <h2 style="font-size: 150%;color: gray">
                                    交易费: 
                                    <span style="color: gray" v-if="tradeFees > 0">
                                        {{ toThousands(Math.round(tradeFees)) }}
                                    </span>
                                    <span style="color: green" v-else>
                                        {{ toThousands(Math.round(tradeFees)) }}
                                    </span>
                                </h2> 
                            </el-col>
                            <el-col :span="8" align="center">
                                <h2 style="font-size: 150%;color: gray">
                                    资金费: 
                                    <span style="color: gray" v-if="swapFundingFees > 0">
                                        {{ toThousands(Math.round(swapFundingFees)) }}
                                    </span>
                                    <span style="color: green" v-else>
                                        {{ toThousands(Math.round(swapFundingFees)) }}
                                    </span>
                                </h2> 
                            </el-col>
                            <el-col :span="8" align="center">
                                <h2 style="font-size: 150%;color: gray">
                                    利息:
                                    <span style="color: gray" v-if="interestFees > 0">
                                        {{ toThousands(Math.round(interestFees)) }}
                                    </span>
                                    <span style="color: green" v-else>
                                        {{ toThousands(Math.round(interestFees)) }}
                                    </span>                                
                                </h2>                                                 
                            </el-col>                     
                        </el-row>  
                                    
                    </div>
                </el-card>
            </div>
        </el-col> 
    </el-row>
</template>

<script>
import moment from 'moment'
import {addSingleLine} from '@/utils/chart'
import {Chart} from 'highcharts-vue'
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
        subaccountDatas(val){
            this.parseData()
        }
    },

    data() {
        return {
            totalFeeLine: null,
            totalFees: null,
            currentMonthFees: null,
            currentYearFees: null,
            tradeFees: null,
            swapFundingFees: null,
            interestFees: null,

            // 总费用曲线图
            totalFeeOptions: {
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
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData() {
            this.totalFees = 0
            this.currentMonthFees = 0
            this.currentYearFees = 0
            this.tradeFees = 0
            this.swapFundingFees = 0
            this.interestFees = 0

            this.prepareTotalFeeDatas()
            addSingleLine('总费用', this.totalFeeLine, this.totalFeeOptions)
        },

        // 为totalFee准备数据
        prepareTotalFeeDatas(){
            // 计算total fee line
            this.totalFeeLine = {}
            for(let i = 0; i < this.subaccountDatas.length; i++){
                for(let type in this.subaccountDatas[i].fees.types){
                    var monthCumuDatas = this.subaccountDatas[i].fees.types[type].month_cumu_records
                    var sum = this.subaccountDatas[i].fees.types[type].sum
                    this.totalFees -= sum

                    // 确定当月值和当年值
                    var currentYear = moment().format('YYYY')
                    var currentMonth = moment().format('YYYY-MM')
                    for(let month in this.subaccountDatas[i].fees.types[type].month_records){
                        if (month == currentMonth){
                            this.currentMonthFees -= this.subaccountDatas[i].fees.types[type].month_records[month]
                        }
                        if (month.indexOf(currentYear) != -1){
                            this.currentYearFees -= this.subaccountDatas[i].fees.types[type].month_records[month]
                        }
                    }

                    // 确定feeType
                    if (type == 'trade'){
                        this.tradeFees -= sum
                    } else if(type == 'interest'){
                        this.interestFees -= sum
                    } else {
                        this.swapFundingFees -= sum
                    }

                    for(let month in monthCumuDatas){
                        // 后台fee的负值代表支出;正值代表收入.前台图表需要正负颠倒!
                        if(this.totalFeeLine.hasOwnProperty(month)){
                            this.totalFeeLine[month] -= monthCumuDatas[month]
                        } else {
                            this.totalFeeLine[month] = -monthCumuDatas[month]
                        }
                    }

                    // 修正: 刚进入新月份时monthCumuDatas可能没有对应值, 使用上月的值代替填充(否则totalFeeLine显示异常!) 
                    if (!monthCumuDatas.hasOwnProperty(currentMonth)){
                        var lastMonth = moment(new Date()).subtract(1,'months').format('YYYY-MM')
                        if (monthCumuDatas.hasOwnProperty(lastMonth)){
                            if(this.totalFeeLine.hasOwnProperty(currentMonth)){
                                this.totalFeeLine[currentMonth] -= monthCumuDatas[lastMonth]
                            } else {
                                this.totalFeeLine[currentMonth] = -monthCumuDatas[lastMonth]
                            }                           
                        }
                    }
                }
            }
        },

        toThousands: toThousands,
    }
}
</script>