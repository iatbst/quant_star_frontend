<template>
   <el-row :gutter="0" type="flex" >
        <!-- 总资金曲线 -->
        <el-col :span="24">
            <!-- 曲线 -->
            <highcharts :options="totalBalanceOptions" style="margin-top: 20px"></highcharts>
            <div align="center" style="margin-bottom: 20px">
                <el-button style="margin-left: 0px" type="info" size="mini"  @click="parseData()" :plain="buttonAllPlain">
                    全部
                </el-button> 
                <el-button type="info" size="mini"  @click="parseData('thisYear')" :plain="buttonThisYearPlain">
                    今年
                </el-button> 
                <el-button type="info" size="mini"  @click="parseData('6M')" :plain="button6MPlain">
                    6个月
                </el-button>   
                <el-button type="info" size="mini"  @click="parseData('12M')" :plain="button12MPlain">
                    12个月
                </el-button>  
                <el-button type="info" size="mini"  @click="parseData('2Y')" :plain="button2YPlain">
                    2年
                </el-button>  
                <el-button type="info" size="mini"  @click="parseData('3Y')" :plain="button3YPlain">
                    3年
                </el-button>  
                <el-button type="info" size="mini"  @click.native="switchLineType()" :plain="buttonLogPlain">
                    对数坐标
                </el-button>  
            </div>       
        </el-col>
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {addSingleLine, addMultiLine} from '@/utils/chart'
import {Chart} from 'highcharts-vue'
import {toThousands} from '@/utils/general'
import moment from 'moment' 

export default {
    components: {
        highcharts: Chart
    },

    props: {
        values: {
            type:Array,
            default: []
        },
        yType: {
            type: String,
            default: ''
        },
        range: {
            type: String,
            default: '6M'
        }
    },

    watch: {
        values: {
            handler(val, oldVal){
                this.parseData(this.range)
            },
            deep: true
        }
    },
    
    data() {
        return {
            buttonAllPlain: true,
            buttonThisYearPlain: true,
            button6MPlain: true,
            button12MPlain: true,
            button2YPlain: true,
            button3YPlain: true,
            buttonLogPlain: true,

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
        if (this.yType === ''){
            this.buttonLogPlain = true
        } else {
            this.buttonLogPlain = false
        }
        this.parseData(this.range)
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData(range=null) {
            this.totalBalanceOptions.series = []
            this._clearButtons()
            for(let i = 0; i < this.values.length; i++){
               addSingleLine(this.values[i].title, this.filterDates(this.values[i].data, range), this.totalBalanceOptions, false)
            }
        },

        switchLineType(){
            if (this.totalBalanceOptions.yAxis.type === ''){
                this.totalBalanceOptions.yAxis.type = 'logarithmic'
                this.buttonLogPlain = false
            } else {
                this.totalBalanceOptions.yAxis.type = ''
                this.buttonLogPlain = true
            }
        },

        _clearButtons(){
            this.buttonAllPlain = true
            this.button6MPlain = true
            this.button12MPlain = true
            this.button2YPlain = true
            this.button3YPlain = true
            this.buttonThisYearPlain = true
        },

        filterDates(history_values, range){
            var startDate = null
            if (range === '6M'){
                // 过去6月
                startDate = moment(new Date()).subtract(6,'months').format('YYYY-MM-DD')
                this.button6MPlain = false
            } else if (range == '12M') {
                // 过去12月
                startDate = moment(new Date()).subtract(12,'months').format('YYYY-MM-DD')
                this.button12MPlain = false
            } else if (range == 'thisYear'){
                // 今年
                startDate = moment().year() + '-' + '01-01'
                this.buttonThisYearPlain = false
            } else if (range == '2Y') {
                // 过去2年
                startDate = moment(new Date()).subtract(2,'years').format('YYYY-MM-DD')
                this.button2YPlain = false
            } else if (range == '3Y') {
                // 过去3年
                startDate = moment(new Date()).subtract(3,'years').format('YYYY-MM-DD')
                this.button3YPlain = false
            } else if (range == '4Y') {
                // 过去4年
                startDate = moment(new Date()).subtract(4,'years').format('YYYY-MM-DD')
            } else {
                // 全部
                this.buttonAllPlain = false
                return history_values
            }
            var values = {}
            for(let date in history_values){
                if (date >= startDate){
                    values[date] = history_values[date]
                }
            }  
            return values             
        },

        toThousands: toThousands,
    }
}
</script>
