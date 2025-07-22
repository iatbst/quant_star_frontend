<template>
    <!--- 表2: 仓位 --->
    <div>
        <el-table
        :data="positionDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">

            <el-table-column label="总资产" min-width="10%" align="center">
                <template slot-scope="scope">
                    <b><u>${{toThousands(scope.row.totalBalance)}}</u></b>
                </template>
            </el-table-column>

            <el-table-column label="总仓位" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.totalPosition >= 0">
                        {{toThousands(scope.row.totalPosition)}}
                    </span>   
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.totalPosition)}}
                    </span>             
                </template>   
            </el-table-column>

            <el-table-column label="总多头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.longPosition)}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="总空头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red">
                        {{toThousands(scope.row.shortPosition)}}
                    </span>               
                </template>
            </el-table-column>

            <el-table-column label="T多头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.tbLongPosition)}}
                    </span>               
                </template>       
            </el-table-column>

            <el-table-column label="T空头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red">
                        {{toThousands(scope.row.tbShortPosition)}}
                    </span>        
                </template>
            </el-table-column>

            <el-table-column label="B多头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.pbPosition)}}
                    </span>          
                </template>
            </el-table-column>

            <el-table-column label="RSI多头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.rsiPosition)}}
                    </span>          
                </template>
            </el-table-column>

            <el-table-column label="BOLL多头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.bollPosition)}}
                    </span>          
                </template>
            </el-table-column>

            <el-table-column label="LR空头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.lrPosition)}}
                    </span>          
                </template>
            </el-table-column>

            <el-table-column label="系统杠杆率" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.leverage >= 0">
                        {{(scope.row.leverage).toFixed(2)}}X
                    </span>   
                    <span style="color: red" v-else>
                        {{(scope.row.leverage).toFixed(2)}}X
                    </span>        
                </template>
            </el-table-column>          
        </el-table>
    </div>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands, getAnnualReturn, getMaxDrawdown} from '@/utils/general'
import moment from 'moment'
import {addSingleLine} from '@/utils/chart'
import {Chart} from 'highcharts-vue'


export default {
    components: {
        highcharts: Chart
    },

    props: {
        parentPfoPositions: {
            type:Object,
            default:{}
        },
        subaccountDatas: {
            type:Object,
            default:{}
        },
        parentPfoWallet: {
            type:Object,
            default:{}
        },           
    },

    watch: {
        parentPfoPositions: {
            handler(val, oldVal){
                this.parseParentPfoPositions()
                this.updateBalanceLeverage()
            },
            deep: true
        },

        subaccountDatas: {
            handler(val, oldVal){
                this.parseSubaccountDatas()
                this.updateBalanceLeverage()
            },
            deep: true
        },

        parentPfoWallet: {
            handler(val, oldVal){
                this.updateBalanceLeverage()
            },
            deep: true
        },
    },

    data() {
        return {
            // 总资产曲线图
            historyAtrptgOptions: {
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
                        text: ''
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

            // 仓位
            positionDatas: [{
                totalBalance: null,

                totalPosition: null,
                longPosition: null,
                shortPosition: null,

                tbLongPosition: null,
                tbShortPosition: null,
                pbPosition: null,
                rsiPosition: null,
                bollPosition: null,
                lrPosition: null,


                leverage: null
            }],

            // dialogHistoryAtrptgVisible: false,
        }
    },

    created() {
        // 分析Data
        this.parseSubaccountDatas()
        this.parseParentPfoPositions()
        this.updateBalanceLeverage()
    },

    methods: {
        parseParentPfoPositions(){
            // 策略仓位信息从系统后台获取
            var tbData = this.parentPfoPositions.trendline_break
            var pbData = this.parentPfoPositions.plunge_back
            var rsiData = this.parentPfoPositions.rsi_mini
            var bollData = this.parentPfoPositions.boll_mini
            var lrData = this.parentPfoPositions.long_short_ratio
            this.positionDatas[0].tbLongPosition = Math.round(tbData.long)
            this.positionDatas[0].tbShortPosition = Math.round(tbData.short)
            this.positionDatas[0].pbPosition = Math.round(pbData.long)
            this.positionDatas[0].rsiPosition = Math.round(rsiData.long)
            this.positionDatas[0].bollPosition = Math.round(bollData.long)
            this.positionDatas[0].lrPosition = Math.round(lrData.long)


            // 币头寸叠加到总头寸
            // this.positionDatas[0].totalPosition += this.positionDatas[0].holdPosition
            // this.positionDatas[0].longPosition += this.positionDatas[0].holdPosition
            
            // this.positionDatas[0].atrptg = this.parentPfoAtrptg.latest
        },

        parseSubaccountDatas(){  
            // 总体仓位信息从subaccount(平台)获取
            var totalPosition = 0
            var longPosition = 0
            var shortPosition = 0
            for(var i = 0; i < this.subaccountDatas.length; i++){
                var summary = this.subaccountDatas[i].positions.summary
                totalPosition += summary.usdt_long
                totalPosition += summary.usdt_short
                longPosition += summary.usdt_long
                shortPosition += summary.usdt_short
            }
            this.positionDatas[0].totalPosition = Math.round(totalPosition)
            this.positionDatas[0].longPosition = Math.round(longPosition)
            this.positionDatas[0].shortPosition = Math.round(shortPosition)
        },

        // 通过Dialog展示trades(注意, worker只包含id和name)
        // showHistoryAtrptg(){
        //     this.dialogHistoryAtrptgVisible = true
        //     if (this.historyAtrptgOptions.series.length == 0){
        //         addSingleLine('波动率历史值', this.parentPfoAtrptg.history_values, this.historyAtrptgOptions, true, 4)
        //     }
        // },

        updateBalanceLeverage(){          
            // 当前总资产
            this.positionDatas[0].totalBalance = parseInt(this.parentPfoWallet.usdt_amount)

             // 更新系统杠杆率
            var holdData = this.parentPfoPositions.hold
            var totalPosition = 0
            for(var i = 0; i < this.subaccountDatas.length; i++){
                var summary = this.subaccountDatas[i].positions.summary
                totalPosition += summary.usdt_long
                totalPosition += summary.usdt_short
            }
            // 有时未能获取到subaccountDatas(此时不要更新leverage, 不准确!)
            if (this.subaccountDatas.length > 0){
                this.positionDatas[0].leverage = totalPosition/this.parentPfoWallet.usdt_amount   
            }       
        },

        toThousands: toThousands,
    },
}


</script>