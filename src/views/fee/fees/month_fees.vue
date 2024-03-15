<template>
    <el-row :gutter="0" type="flex" >
        <!-- 月度柱状图 -->
        <el-col :span="24">
            <div style="margin-top: 50px">
                <highcharts :options="monthFeesOptions"></highcharts>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {addStackedColumn, clearStackedColumn} from '@/utils/chart'
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
            // clearStackedColumn(this.monthFeesOptions)
            this.parseData()
        }
    },

    data() {
        return {
            // 格式:
            // { month1: {'trade': xxx, 'swap_funding': xxx, 'interest': xxx}, month2: {xxx}, ...}
            monthFees: null,

            colors: {
                'trade': '#70ace9',
                'swap_funding': '#85ea72',
                'interest': 'orange',   
            },

            // 月度柱状图
            monthFeesOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '月度费用'
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
                        },
                        align: 'center',
                        formatter: function() {
                            var sum = 0;
                            var series = this.axis.series;

                            for (var i in series) {
                                if (series[i].visible && series[i].options.stacking == 'normal') 
                                    sum += series[i].yData[this.x];
                            }
                            if(this.total > 0 ) {
                                return Math.round(sum*10)/10; 
                            } else {
                                return '';    
                            }
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
        // 处理父组件建传入data: pfoDatas
        parseData() {
            this.prepareMonthFeesDatas()
            var feeTypes = ['trade', 'swap_funding', 'interest']
            addStackedColumn(this.monthFees, feeTypes, this.monthFeesOptions, this.colors)
        },

        // 为totalFee准备数据
        prepareMonthFeesDatas(){
            // 计算total fee line
            this.monthFees = {}
            for(let i = 0; i < this.subaccountDatas.length; i++){
                for(let type in this.subaccountDatas[i].fees.types){
                    var monthDatas = this.subaccountDatas[i].fees.types[type].month_records
                    for(let month in monthDatas){
                        // 后台fee的负值代表支出;正值代表收入.前台图表需要正负颠倒!
                        if(this.monthFees.hasOwnProperty(month)){
                            if (this.monthFees[month].hasOwnProperty(type)){
                                this.monthFees[month][type] -= Math.round(monthDatas[month])
                            } else {
                                this.monthFees[month][type] = -Math.round(monthDatas[month])
                            }
                        } else {
                            // 新月份
                            this.monthFees[month] = {}
                            this.monthFees[month][type] = -Math.round(monthDatas[month])
                        }
                    }
                }
            }
        },

        toThousands: toThousands,
    }
}
</script>