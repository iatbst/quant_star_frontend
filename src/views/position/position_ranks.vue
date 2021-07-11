<template>
    <el-row :gutter="0" type="flex">
        <!-- 仓位排名 -->
         <el-col :span="24">
            <highcharts :options="positionRanksOptions"></highcharts>
        </el-col>   
    </el-row>   
</template>

<script>
import {Chart} from 'highcharts-vue'
import {addSingleColumn} from '@/utils/chart'
import {quoteToUSD} from '@/utils/general'

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
        subaccountDatas: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        }
    },

    data() {
        return {
            ranks: 20,
            positionRanks: null,
            positionRanksOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: null,
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '仓位($)'
                    },
                },
                
                exporting: { enabled: false },
                
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false,
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}$'
                },
                plotOptions: {
                    column: {
                        //stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: '仓位',
                    data: [],
                }],
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
            this.positionRanks = {}        
            for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let symbol in this.subaccountDatas[i].positions.data){
                    var usdtAmount = this.subaccountDatas[i].positions.data[symbol]

                    // 币种排名
                    var _symbol = quoteToUSD(symbol)
                    if (_symbol in this.positionRanks){
                        // 更新
                        this.positionRanks[_symbol]._y += usdtAmount
                        this.positionRanks[_symbol].y = parseInt(Math.abs(this.positionRanks[_symbol]._y))
                        this.positionRanks[_symbol].color = this.positionRanks[_symbol]._y >= 0 ? 'green' : 'red'
                    } else {
                        // 新symbol
                        this.positionRanks[_symbol] = {
                            x: _symbol,
                            y: parseInt(Math.abs(usdtAmount)),
                            _y: usdtAmount,
                            color: usdtAmount >= 0 ? 'green' : 'red'
                        }
                    }
                }
            }

            var sortedPositionRanks = Object.values(this.positionRanks).sort((a, b) => Math.abs(b.y) - Math.abs(a.y)).slice(0, this.ranks)

            addSingleColumn(sortedPositionRanks, this.positionRanksOptions)     
            this.positionRanksOptions.title.text = '前' + this.ranks + '仓位'
        },
    }
}
</script>