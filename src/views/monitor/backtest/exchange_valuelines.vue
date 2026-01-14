<template>
   <el-row :gutter="0" type="flex" >
        <!-- 总资金曲线 -->
        <el-col :span="24">
            <!-- 曲线 -->
            <highcharts :options="totalBalanceOptions" style="margin-top: 0px"></highcharts>     
        </el-col>
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {addSingleLine, addTwoLine} from '@/utils/chart'
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
            default: ''      // 默认对数坐标
        },
        range: {
            type: String,
            default: '1M'               // 默认时间范围
        }
    },

    watch: {
        values: {
            handler(val, oldVal){
                this.parseData(this.range)
            },
            deep: true
        },
    },
    
    data() {
        return {
            buttonAllPlain: true,
            buttonThisYearPlain: true,
            buttonThisYearHalf2Plain: true,
            button1MPlain: true,
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
                yAxis: [
                    {
                        type: this.yType,
                        title: {
                            text: '美元'
                        }  
                    }                     
                ],
                
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
            // debugger
            this.totalBalanceOptions.series = []
            this.totalBalanceOptions.xAxis.categories = []
            this._clearButtons()
            if (this.values.length == 2){
                this.fillMissingData(this.values[0].data, this.values[1].data)
            }
            for(let i = 0; i < this.values.length; i++){
               addSingleLine(this.values[i].title, this.filterDates(this.values[i].data, range), this.totalBalanceOptions, false, 0, this.values[i].color)
            }
        },
        
        // 缺失的key赋值null(否则valueline无法正常展示)
        fillMissingData(data1, data2){
            for(const dt in data1){
                if(!(dt in data2)){
                    data2[dt] = null
                }
            }
            for(const dt in data2){
                if(!(dt in data1)){
                    data1[dt] = null
                }
            }
        },

        switchLineType(){
            if (this.totalBalanceOptions.yAxis[0].type === ''){
                this.totalBalanceOptions.yAxis[0].type = 'logarithmic'
                this.buttonLogPlain = false
            } else {
                this.totalBalanceOptions.yAxis[0].type = ''
                this.buttonLogPlain = true
            }
        },

        _clearButtons(){
            this.buttonAllPlain = true
            this.button1MPlain = true
            this.button12MPlain = true
            this.button2YPlain = true
            this.button3YPlain = true
            this.buttonThisYearPlain = true
            this.buttonThisYearHalf2Plain = true
        },

        filterDates(history_values, range){
            var startDate = null
            if (range === '1M'){
                // 过去1月
                startDate = moment(new Date()).subtract(1,'months').format('YYYY-MM-DD')
                this.button1MPlain = false
            } else if (range == '12M') {
                // 过去12月
                startDate = moment(new Date()).subtract(12,'months').format('YYYY-MM-DD')
                this.button12MPlain = false
            } else if (range == 'thisYear'){
                // 今年
                startDate = moment().year() - 1 + '-' + '12-31'
                this.buttonThisYearPlain = false
            } else if (range == 'thisYearHalf2'){
                // 今年下半年
                startDate = moment().year() + '-' + '06-30'
                this.buttonThisYearHalf2Plain = false
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
            } else if (range == 'all') {
                // 全部
                this.buttonAllPlain = false
                return history_values
            } else {
                // 根据当前时间展示
                if(moment().month < 7){
                    // 上半年
                    startDate = moment().year() - 1 + '-' + '12-31'
                    this.buttonThisYearPlain = false                   
                } else {
                    // 下半年
                    startDate = moment().year() + '-' + '06-30'
                    this.buttonThisYearHalf2Plain = false                   
                }
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
