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
                <el-button type="info" size="mini"  @click="parseData('1D')" :plain="button1DPlain">
                    1日
                </el-button> 
                <el-button type="info" size="mini"  @click="parseData('3D')" :plain="button3DPlain">
                    3日
                </el-button> 
            </div>       
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
            default: '3D'    // 默认展示
        }
    },

    watch: {
        // values: {
        //     handler(val, oldVal){
        //         this.parseData(this.range)
        //     },
        //     deep: true
        // },
    },
    
    data() {
        return {
            buttonAllPlain: true,
            button1DPlain: true,
            button3DPlain: true,
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

                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '${point.y}'
                },

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
            for(let i = 0; i < this.values.length; i++){
               addSingleLine(this.values[i].title, this.filterDates(this.values[i].data, range), this.totalBalanceOptions, false, 0, this.values[i].color)
            }
            // addTwoLine(this.title1, this.filterDates(this.values1, range), this.title2, this.filterDates(this.values2, range), this.totalBalanceOptions)
            // debugger
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
            this.button1DPlain = true
            this.button3DPlain = true
        },

        filterDates(history_values, range){
            var startDate = null
            if (range === '1D'){
                // 过去24H
                startDate = moment(new Date()).subtract(24,'hours').format('YYYY-MM-DD HH:mm:ss')
                this.button1DPlain = false
            } else if (range == '3D') {
                // 过去72H
                startDate = moment(new Date()).subtract(72,'hours').format('YYYY-MM-DD HH:mm:ss')
                this.button3DPlain = false
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
