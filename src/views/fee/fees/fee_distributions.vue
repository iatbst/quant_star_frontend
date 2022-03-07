<template>
    <el-row :gutter="0" type="flex">
        <!-- fee类型分布 -->
        <el-col :span="8">
            <div style="margin-top: 50px">
                <highcharts :options="feeTypeDistOptions"></highcharts>
            </div>
        </el-col>

        <!-- fee产品分布 -->
        <el-col :span="8">
            <div style="margin-top: 50px">
                <highcharts :options="feeSubTypeDistOptions"></highcharts>
            </div>
        </el-col>

        <!-- fee平台分布 -->
        <el-col :span="8">
            <div style="margin-top: 50px">
                <highcharts :options="feeExchangeDistOptions"></highcharts>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {addStackedColumn} from '@/utils/chart'
import {Chart} from 'highcharts-vue'
import {toThousands} from '@/utils/general'
import {fillPie} from '@/utils/chart'


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
            feeTypeDist: null,
            feeSubTypeDist: null,
            feeExchangeDist: null,

            // 费用类型
            feeTypeDistOptions: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '费用类型($)'
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
                    data: []
                }]                   
            },  

            // 产品类型
            feeSubTypeDistOptions: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '产品类型($)'
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
                    data: []
                }]                   
            },   

            // 平台类型
            feeExchangeDistOptions: {
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
                    data: []
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
            this.prepareFeeTypeDatas()
            fillPie(this.feeTypeDist, this.feeTypeDistOptions)

            this.prepareFeeSubTypeDatas()
            fillPie(this.feeSubTypeDist, this.feeSubTypeDistOptions)

            this.prepareFeeExchangeDatas()
            fillPie(this.feeExchangeDist, this.feeExchangeDistOptions)
        },

        // 为feeTypeDist准备数据
        prepareFeeTypeDatas(){
            this.feeTypeDist = {}
            var totalFees = 0
            for(let i = 0; i < this.subaccountDatas.length; i++){
                for(let type in this.subaccountDatas[i].fees.types){
                    var sum = this.subaccountDatas[i].fees.types[type].sum
                    totalFees -= sum
                    // 后台fee的负值代表支出;正值代表收入.前台图表需要正负颠倒!
                    if(this.feeTypeDist.hasOwnProperty(type)){
                        this.feeTypeDist[type] -= Math.round(sum)
                    } else {
                        // 新月份
                        this.feeTypeDist[type] = -Math.round(sum)
                    }
                }
            }

            // 转化为百分比
            for(let type in this.feeTypeDist){
                if (this.feeTypeDist[type] < 0){
                    // Pie图无法表示负值: 转化为柱状图
                    this.$message.error('[' + type + ']的总费用为负值:' + this.feeTypeDist[type] + ', 需要转化为柱状图表示.')
                } else {
                    this.feeTypeDist[type] = this.feeTypeDist[type] * 100 / totalFees
                }
            }
        },

        // 为feeSubTypeDist准备数据
        prepareFeeSubTypeDatas(){
            this.feeSubTypeDist = {}
            var totalFees = 0
            for(let i = 0; i < this.subaccountDatas.length; i++){
                var subTypeFees = 0
                var subType = this.subaccountDatas[i].subaccount.sub_type
                for(let type in this.subaccountDatas[i].fees.types){
                    var sum = this.subaccountDatas[i].fees.types[type].sum
                    totalFees -= sum
                    subTypeFees += sum
                }
                // 后台fee的负值代表支出;正值代表收入.前台图表需要正负颠倒!
                if(this.feeSubTypeDist.hasOwnProperty(subType)){
                    this.feeSubTypeDist[subType] -= Math.round(subTypeFees)
                } else {
                    this.feeSubTypeDist[subType] = -Math.round(subTypeFees)
                }
            }

            // 转化为百分比
            for(let subType in this.feeSubTypeDist){
                if (this.feeSubTypeDist[subType] < 0){
                    // Pie图无法表示负值: 转化为柱状图
                    this.$message.error('[' + subType + ']的总费用为负值:' + this.feeSubTypeDist[subType] + ', 需要转化为柱状图表示.')
                } else {
                    this.feeSubTypeDist[subType] = this.feeSubTypeDist[subType] * 100 / totalFees
                }
            }
        },

        // 为feeExchangeDist准备数据
        prepareFeeExchangeDatas(){
            this.feeExchangeDist = {}
            var totalFees = 0
            for(let i = 0; i < this.subaccountDatas.length; i++){
                var exchangeFees = 0
                var exchange = this.subaccountDatas[i].subaccount.account.name.split('_')[0]    // account.name的格式: 交易所 + 账号
                for(let type in this.subaccountDatas[i].fees.types){
                    var sum = this.subaccountDatas[i].fees.types[type].sum
                    totalFees -= sum
                    exchangeFees += sum
                }
                // 后台fee的负值代表支出;正值代表收入.前台图表需要正负颠倒!
                if(this.feeExchangeDist.hasOwnProperty(exchange)){
                    this.feeExchangeDist[exchange] -= Math.round(exchangeFees)
                } else {
                    this.feeExchangeDist[exchange] = -Math.round(exchangeFees)
                }
            }

            // 转化为百分比
            for(let exchange in this.feeExchangeDist){
                if (this.feeExchangeDist[exchange] < 0){
                    // Pie图无法表示负值: 转化为柱状图
                    this.$message.error('[' + exchange + ']的总费用为负值:' + this.feeExchangeDist[exchange] + ', 需要转化为柱状图表示.')
                } else {
                    this.feeExchangeDist[exchange] = this.feeExchangeDist[exchange] * 100 / totalFees
                }
            }
        },

        toThousands: toThousands,
    }
}
</script>