<template>
    <!--- 表2: 仓位 --->
    <div>
        <el-table
        :data="positionDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">

            <el-table-column label="总仓位" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.totalPosition + scope.row.holdPosition >= 0">
                        {{toThousands(scope.row.totalPosition + scope.row.holdPosition)}}
                    </span>   
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.totalPosition + scope.row.holdPosition)}}
                    </span>             
                </template>   
            </el-table-column>

            <el-table-column label="总多头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.longPosition + scope.row.holdPosition)}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="总空头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red">
                        {{toThousands(-scope.row.shortPosition)}}
                    </span>               
                </template>
            </el-table-column>

            <el-table-column label="大多头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.prLongPosition)}}
                    </span>               
                </template>       
            </el-table-column>

            <el-table-column label="大空头" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red">
                        {{toThousands(scope.row.prShortPosition)}}
                    </span>        
                </template>
            </el-table-column>

            <el-table-column label="底头寸" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.pbPosition)}}
                    </span>          
                </template>
            </el-table-column>

            <el-table-column label="下头寸" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red">
                        {{toThousands(scope.row.dePosition)}}
                    </span>          
                </template>
            </el-table-column>

            <el-table-column label="币头寸" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.holdPosition)}}
                    </span>          
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="" :visible.sync="dialogHistoryAtrptgVisible" width="60%" >
            <!-- 展示波动率历史曲线 -->
            <highcharts :options="historyAtrptgOptions" style="margin-top: 0px"></highcharts>
        </el-dialog>
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
        parentPfoAtrptg: {
            type:Object,
            default:{}
        },
        subaccountDatas: {
            type:Object,
            default:{}
        }           
    },

    watch: {
        parentPfoPositions: {
            handler(val, oldVal){
                this.parseParentPfoPositions()
            },
            deep: true
        },

        parentPfoAtrptg: {
            handler(val, oldVal){
                this.parseParentPfoPositions()
            },
            deep: true
        },

        subaccountDatas: {
            handler(val, oldVal){
                this.parseSubaccountDatas()
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
                totalPosition: null,
                longPosition: null,
                shortPosition: null,

                prLongPosition: null,
                prShortPosition: null,
                pbPosition: null,
                dePosition: null,
                holdPosition: null,

                atrptg: null
            }],

            dialogHistoryAtrptgVisible: false,
        }
    },

    created() {
        // 分析Data
        this.parseSubaccountDatas()
        this.parseParentPfoPositions()
    },

    methods: {
        parseParentPfoPositions(){
            // 策略仓位信息从系统后台获取
            var prData = this.parentPfoPositions.pivot_reversal
            var pbData = this.parentPfoPositions.plunge_back
            var deData = this.parentPfoPositions.delist
            var holdData = this.parentPfoPositions.hold
            this.positionDatas[0].prLongPosition = Math.round(prData.long)
            this.positionDatas[0].prShortPosition = Math.round(prData.short)
            this.positionDatas[0].pbPosition = Math.round(pbData.long)
            this.positionDatas[0].dePosition = Math.round(deData.short)
            this.positionDatas[0].holdPosition = Math.round(holdData.long)

            // 币头寸叠加到总头寸
            // this.positionDatas[0].totalPosition += this.positionDatas[0].holdPosition
            // this.positionDatas[0].longPosition += this.positionDatas[0].holdPosition
            
            this.positionDatas[0].atrptg = this.parentPfoAtrptg.latest
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
        showHistoryAtrptg(){
            this.dialogHistoryAtrptgVisible = true
            if (this.historyAtrptgOptions.series.length == 0){
                addSingleLine('波动率历史值', this.parentPfoAtrptg.history_values, this.historyAtrptgOptions, true, 4)
            }
        },

        toThousands: toThousands,
    },
}


</script>