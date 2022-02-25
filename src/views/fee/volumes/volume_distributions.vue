<template>
    <el-row :gutter="0" type="flex">
        <!-- volume产品分布 -->
        <el-col :span="12">
            <div style="margin-top: 50px">
                <highcharts :options="volumeSubTypeDistOptions"></highcharts>
            </div>
        </el-col>

        <!-- volume平台分布 -->
        <el-col :span="12">
            <div style="margin-top: 50px">
                <highcharts :options="volumeExchangeDistOptions"></highcharts>
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

    data() {
        return {
            volumeSubTypeDist: null,
            volumeExchangeDist: null,

            // 产品类型
            volumeSubTypeDistOptions: {
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
            volumeExchangeDistOptions: {
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
            this.prepareVolumeSubTypeDatas()
            fillPie(this.volumeSubTypeDist, this.volumeSubTypeDistOptions)

            this.prepareVolumeExchangeDatas()
            fillPie(this.volumeExchangeDist, this.volumeExchangeDistOptions)
        },

        // 为volumeSubTypeDist准备数据
        prepareVolumeSubTypeDatas(){
            this.volumeSubTypeDist = {}
            var totalVolumes = 0
            for(let i = 0; i < this.subaccountDatas.length; i++){
                var subTypeVolumes = 0
                var subType = this.subaccountDatas[i].subaccount.sub_type
                var sum = this.subaccountDatas[i].volumes.sum
                totalVolumes += sum
                subTypeVolumes += sum

                if(this.volumeSubTypeDist.hasOwnProperty(subType)){
                    this.volumeSubTypeDist[subType] += Math.round(subTypeVolumes)
                } else {
                    this.volumeSubTypeDist[subType] = Math.round(subTypeVolumes)
                }
            }

            // 转化为百分比
            for(let subType in this.volumeSubTypeDist){
                this.volumeSubTypeDist[subType] = this.volumeSubTypeDist[subType] * 100 / totalVolumes
            }
        },

        // 为volumeExchangeDist准备数据
        prepareVolumeExchangeDatas(){
            this.volumeExchangeDist = {}
            var totalVolumes = 0
            for(let i = 0; i < this.subaccountDatas.length; i++){
                var exchangeVolumes = 0
                var exchange = this.subaccountDatas[i].subaccount.account.name.split('_')[0]    // account.name的格式: 交易所 + 账号
                var sum = this.subaccountDatas[i].volumes.sum
                totalVolumes += sum
                exchangeVolumes += sum

                if(this.volumeExchangeDist.hasOwnProperty(exchange)){
                    this.volumeExchangeDist[exchange] += Math.round(exchangeVolumes)
                } else {
                    this.volumeExchangeDist[exchange] = Math.round(exchangeVolumes)
                }
            }

            // 转化为百分比
            for(let exchange in this.volumeExchangeDist){
                this.volumeExchangeDist[exchange] = this.volumeExchangeDist[exchange] * 100 / totalVolumes
            }
        },

        toThousands: toThousands,
    }
}
</script>