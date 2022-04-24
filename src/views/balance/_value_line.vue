<template>
   <el-row :gutter="0" type="flex" >
        <!-- 总资金曲线 -->
        <el-col :span="24">
            <!-- 曲线 -->
            <highcharts :options="totalBalanceOptions" style="margin-top: 20px"></highcharts>
            <div align="center" style="margin-bottom: 20px">
                <el-button style="margin-left: 0px" type="info" size="mini"  @click="parseData()" plain>
                    全部
                </el-button> 
                <el-button type="info" size="mini"  @click="parseData('thisYear')" plain>
                    今年
                </el-button> 
                <el-button type="info" size="mini"  @click="parseData('6M')" plain>
                    6个月
                </el-button>   
                <el-button type="info" size="mini"  @click="parseData('12M')" plain>
                    12个月
                </el-button>  
                <el-button type="info" size="mini"  @click="parseData('2Y')" plain>
                    2年
                </el-button>  
                <el-button type="info" size="mini"  @click="parseData('3Y')" plain>
                    3年
                </el-button>  
                <el-button type="info" size="mini"  @click.native="switchLineType()" plain>
                    对数坐标
                </el-button>  
            </div>       
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
        values: {
            type:Object,
            default:{}
        },
        title: {
            type: String,
            default: ''
        },
        yType: {
            type: String,
            default: ''
        }
    },

    watch: {
        values: {
            handler(val, oldVal){
                this.parseData('6M')
            },
            deep: true
        }
    },
    
    data() {
        return {
            currentType: '',

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
                    type: this.yType,
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
        this.currentType = this.yType
        this.parseData('6M')
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData(range=null) {
            this.totalBalanceOptions.series = []
            addSingleLine(this.title, this.filterDates(this.values, range), this.totalBalanceOptions)
            // for(var i = 0; i < this.pfoDatas.length; i++){
            //     if (this.pfoDatas[i].portfolio.name === config.cryptoParentPfo){
            //         // Crypto父pfo
            //         addSingleLine('总资金', this.filterDates(this.pfoDatas[i].wallet.history_values, range), this.totalBalanceOptions)
            //     }               
            // }
        },

        switchLineType(){
            if (this.totalBalanceOptions.yAxis.type === ''){
                this.totalBalanceOptions.yAxis.type = 'logarithmic'
                this.$set('type', 'success')
            } else {
                this.totalBalanceOptions.yAxis.type = ''
                this.$set('type', 'info')
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
