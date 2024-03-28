<template>
    <el-row :gutter="0" type="flex" >
        <!-- 月度柱状图 -->
        <el-col :span="24">
            <div style="margin-top: 50px;">
                <highcharts :options="monthVolumesOptions"></highcharts>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import {addStackedColumn} from '@/utils/chart'
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
            // 格式:
            // { month1: {'binance': xxx, 'huobi': xxx, 'okex': xxx}, month2: {xxx}, ...}
            monthVolumes: null,
            exchanges: null,

            colors: {
                'binance': '#70ace9',
                'okex': '#85ea72',
                'ftx': 'orange',
                'huobi': 'yellow'

            },

            // 月度柱状图
            monthVolumesOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '月度成交量(百万)'
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    // min: 0,
                    title: {
                        text: '美元'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 0,
                    floating: true,
                    backgroundColor: 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 100,
                                fontSize: '10px',
                                textOutline: 0
                            },
                            color: 'black'
                        },
                        borderWidth: 0
                    }
                },
                series: [] 
            },            
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData() {
            this.prepareMonthVolumesDatas()
            addStackedColumn(this.monthVolumes, this.exchanges, this.monthVolumesOptions, this.colors)
        },

        prepareMonthVolumesDatas(){
            this.monthVolumes = {}
            this.exchanges = [] // stack column按照exchange分类
            for(let i = 0; i < this.subaccountDatas.length; i++){
                var exchange = this.subaccountDatas[i].subaccount.account.name.split('_')[0]
                var monthDatas = this.subaccountDatas[i].volumes.month_records
                if (!this.exchanges.includes(exchange)){
                    this.exchanges.push(exchange)
                }
                for(let month in monthDatas){
                    if(this.monthVolumes.hasOwnProperty(month)){
                        if (this.monthVolumes[month].hasOwnProperty(exchange)){
                            this.monthVolumes[month][exchange] += Math.round(monthDatas[month])
                        } else {
                            this.monthVolumes[month][exchange] = Math.round(monthDatas[month])
                        }
                    } else {
                        // 新月份
                        this.monthVolumes[month] = {}
                        this.monthVolumes[month][exchange] = Math.round(monthDatas[month])
                    }
                }
            }

            for(let month in this.monthVolumes){
                for(let exchange in this.monthVolumes[month]){
                    this.monthVolumes[month][exchange] = Number((this.monthVolumes[month][exchange]/1000000).toFixed(1))
                }
            }

        },

        toThousands: toThousands,
    }
}
</script>