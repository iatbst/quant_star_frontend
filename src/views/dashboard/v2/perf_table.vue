<template>
    <div>
        <!--- 表3: 策略表现(row0) --->
        <el-table
        :data="[{col1: 'P今年', col2: 'M今年', col3: 'B今年'}]"
        :show-header="false"
        :cell-style="{ background: '#f2f2f2' }"
        style="width: 100%; background: #f2f2f2">
            <el-table-column prop="col1" min-width="30%" align="center"> 
            </el-table-column>
            <el-table-column prop="col2" min-width="30%" align="center"> 
            </el-table-column>
            <el-table-column prop="col3" min-width="40%" align="center"> 
            </el-table-column>
        </el-table>

        <!--- 策略表现(row1) --->
        <el-table
        :data="perfData1"
        :header-cell-style="addRightBorder"
        :cell-style="addRightBorder"
        style="width: 100%">
            <el-table-column label="收益" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col1 >= 0">
                        {{toThousands(scope.row.col1)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col1)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="胜率/盈亏比" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{scope.row.col2_1}}%|{{scope.row.col2_2}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="滑点" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col3 >= 0">
                        {{scope.row.col3}}%
                    </span>  
                    <span style="color: red" v-else>
                        {{scope.row.col3}}%
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="收益" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col4 >= 0">
                        {{toThousands(scope.row.col4)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col4)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="胜率/盈亏比" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{scope.row.col5_1}}%|{{scope.row.col5_2}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="滑点" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col6 >= 0">
                        {{scope.row.col6}}%
                    </span>  
                    <span style="color: red" v-else>
                        {{scope.row.col6}}%
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="收益" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col7 >= 0">
                        {{toThousands(scope.row.col7)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col7)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="交易次/笔均盈亏" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        <span>
                            {{scope.row.col8_1}}
                        </span>
                        |
                        <span style="color: green" v-if="scope.row.col8_2 >= 0">
                            {{toThousands(scope.row.col8_2)}}
                        </span>  
                        <span style="color: red" v-else>
                            {{toThousands(scope.row.col8_2)}}
                        </span> 
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="胜率/盈亏比" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{scope.row.col9_1}}%|{{scope.row.col9_2}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="滑点" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col10 >= 0">
                        {{scope.row.col10}}%
                    </span>  
                    <span style="color: red" v-else>
                        {{scope.row.col10}}%
                    </span>               
                </template>  
            </el-table-column>       
        </el-table> 

        <!--- 策略表现(row2) --->
        <el-table
        :data="perfData2"
        :header-cell-style="addRightBorder"
        :cell-style="addRightBorder"
        style="width: 100%">
            <el-table-column label="交易次" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col1)}}
                    </span>               
                </template> 
            </el-table-column>
                <el-table-column label="胜次" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col2)}}
                    </span>               
                </template> 
            </el-table-column>
                <el-table-column label="负次" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col3)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="交易次" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col4)}}
                    </span>               
                </template> 
            </el-table-column>
                <el-table-column label="胜次" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col5)}}
                    </span>               
                </template> 
            </el-table-column>
                <el-table-column label="负次" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col6)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="一层次" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col7)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="二层次" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col8)}}
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="三层次" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col9)}}
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="四层次" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col10)}}
                    </span>               
                </template>  
            </el-table-column>   
        </el-table> 
        
        <!--- 策略表现(row3) --->
        <el-table
        :data="perfData3"
        :header-cell-style="addRightBorder"
        :cell-style="addRightBorder"
        style="width: 100%">
            <el-table-column label="笔均盈亏" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col1 >= 0">
                        {{toThousands(scope.row.col1)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col1)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="胜盈" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.col2)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="负亏" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: red">
                        {{toThousands(scope.row.col3)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="笔均盈亏" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col4 >= 0">
                        {{toThousands(scope.row.col4)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col4)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="胜盈" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green">
                        {{toThousands(scope.row.col5)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="负亏" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: red">
                        {{toThousands(scope.row.col6)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="笔均盈亏" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col7 >= 0">
                        {{toThousands(scope.row.col7)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col7)}}
                    </span>             
                </template> 
            </el-table-column>
            <el-table-column label="笔均盈亏" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col8 >= 0">
                        {{toThousands(scope.row.col8)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col8)}}
                    </span>             
                </template> 
            </el-table-column>
            <el-table-column label="笔均盈亏" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col9 >= 0">
                        {{toThousands(scope.row.col9)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col9)}}
                    </span>             
                </template> 
            </el-table-column>
            <el-table-column label="笔均盈亏" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col10 >= 0">
                        {{toThousands(scope.row.col10)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col10)}}
                    </span>             
                </template> 
            </el-table-column>                         
        </el-table>  
        <!-- 
        <el-dialog title="" :visible.sync="dialogHistoryAtrptgVisible" width="60%" >
            <highcharts :options="historyAtrptgOptions" style="margin-top: 0px"></highcharts>
        </el-dialog>
        -->
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
        parentPfoTradeStats: {
            type:Object,
            default:{}
        },
    },

    watch: {
        parentPfoTradeStats: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        },

        // parentPfoAtrptg: {
        //     handler(val, oldVal){
        //         this.parseParentPfoPositions()
        //     },
        //     deep: true
        // },
    },

    data() {
        return {
            // 策略表现
            perfData1: [{
                col1: null,
                col2: null,
                col3: null,
                col4: null,
                col5: null,
                col6: null,
                col7: null,
                col8: null,
                col9: null,
                col10: null,
                col11: null,
                col12: null               
            }],
            perfData2: [{
                col1: null,
                col2: null,
                col3: null,
                col4: null,
                col5: null,
                col6: null,
                col7: null,
                col8: null,
                col9: null,
                col10: null,
                col11: null,
                col12: null   
            }],
            perfData3: [{
                col1: null,
                col2: null,
                col3: null,
                col4: null,
                col5: null,
                col6: null,
                col7: null,
                col8: null,
                col9: null,
                col10: null,
                col11: null,
                col12: null   
            }],
            
            // 大PV策略年初始时归零(和pnl曲线保持一致)
            prPnlOffset: 0,

            // dialogHistoryAtrptgVisible: false,

            // atrptg曲线图
            // historyAtrptgOptions: {
            //     chart: {
            //         type: 'line',
            //         zoomType: 'x'
            //     },
            //     title: {
            //         text: '',
            //     },
            //     xAxis: {
            //         categories: []
            //     },
            //     yAxis: {
            //         type: this.yType,
            //         title: {
            //             text: ''
            //         }
            //     },
            //     exporting: { enabled: false },
                
            //     plotOptions: {
            //         series: {
            //             label: {
            //                 connectorAllowed: false
            //             },
            //         },
            //         line: {
            //             marker: {
            //                 enabled: false
            //             },
            //         }			        
            //     },
                
            //     series: [],  
            // },
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData(){  
            // 策略表现(trade_stats)
            var prData = this.parentPfoTradeStats.pivot_reversal
            var pbData = this.parentPfoTradeStats.plunge_back
            var mczData = this.parentPfoTradeStats.macd_cross_zero

            // 第一行
            this.perfData1[0].col1 = parseInt(prData.all.year_now.total_pnl) + this.prPnlOffset
            this.perfData1[0].col2_1 = (prData.all.year_now.win_ratio*100).toFixed(1)
            this.perfData1[0].col2_2 = prData.all.year_now.win_lose_pnl_ratio != null ? prData.all.year_now.win_lose_pnl_ratio.toFixed(3) : null  
            this.perfData1[0].col3 = prData.all.year_now.weight_slippage != null ? (prData.all.year_now.weight_slippage*100).toFixed(3) : null

            this.perfData1[0].col4 = parseInt(mczData.all.year_now.total_pnl)
            this.perfData1[0].col5_1 = (mczData.all.year_now.win_ratio*100).toFixed(1)
            this.perfData1[0].col5_2 = mczData.all.year_now.win_lose_pnl_ratio != null ? mczData.all.year_now.win_lose_pnl_ratio.toFixed(3) : null  
            this.perfData1[0].col6 = mczData.all.year_now.weight_slippage != null ? (mczData.all.year_now.weight_slippage*100).toFixed(3) : null

            this.perfData1[0].col7 = parseInt(pbData.all.year_now.total_pnl)
            this.perfData1[0].col8_1 = pbData.all.year_now.count
            this.perfData1[0].col8_2 = parseInt(pbData.all.year_now.avg_pnl)
            this.perfData1[0].col9_1 = (pbData.all.year_now.win_ratio*100).toFixed(1)
            this.perfData1[0].col9_2 = pbData.all.year_now.win_lose_pnl_ratio != null ? pbData.all.year_now.win_lose_pnl_ratio.toFixed(3) : null 
            this.perfData1[0].col10 = pbData.all.year_now.weight_slippage != null ? (pbData.all.year_now.weight_slippage*100).toFixed(3) : null 

            // 第二行
            this.perfData2[0].col1 = prData.all.year_now.count
            this.perfData2[0].col2 = prData.all.year_now.win_count
            this.perfData2[0].col3 = prData.all.year_now.lose_count

            this.perfData2[0].col4 = mczData.all.year_now.count
            this.perfData2[0].col5 = mczData.all.year_now.win_count
            this.perfData2[0].col6 = mczData.all.year_now.lose_count

            this.perfData2[0].col7 = pbData.plunge_back_1.year_now.count
            this.perfData2[0].col8 = pbData.plunge_back_2.year_now.count
            this.perfData2[0].col9 = pbData.plunge_back_3.year_now.count
            this.perfData2[0].col10 = pbData.plunge_back_4.year_now.count
            // debugger

            // 第三行
            this.perfData3[0].col1 = parseInt(prData.all.year_now.avg_pnl)
            this.perfData3[0].col2 = parseInt(prData.all.year_now.win_avg_pnl)
            this.perfData3[0].col3 = parseInt(prData.all.year_now.lose_avg_pnl)

            this.perfData3[0].col4 = parseInt(mczData.all.year_now.avg_pnl)
            this.perfData3[0].col5 = parseInt(mczData.all.year_now.win_avg_pnl)
            this.perfData3[0].col6 = parseInt(mczData.all.year_now.lose_avg_pnl)

            this.perfData3[0].col7 = parseInt(pbData.plunge_back_1.year_now.avg_pnl)
            this.perfData3[0].col8 = parseInt(pbData.plunge_back_2.year_now.avg_pnl)
            this.perfData3[0].col9 = parseInt(pbData.plunge_back_3.year_now.avg_pnl)
            this.perfData3[0].col10 = parseInt(pbData.plunge_back_4.year_now.avg_pnl)                    
        },

        // 通过Dialog展示trades(注意, worker只包含id和name)
        // showHistoryAtrptg(){
        //     this.dialogHistoryAtrptgVisible = true
        //     if (this.historyAtrptgOptions.series.length == 0){
        //         addSingleLine('波动率历史值', this.parentPfoAtrptg.history_values, this.historyAtrptgOptions, true, 4)
        //     }
        // },

        addRightBorder({rowIndex, columnIndex}){
            if(columnIndex == 2 || columnIndex == 5 ){
                return {'border-right': '2px solid #f2f2f2'}
            } else {
                return {}
            }
        },

        // addRightBorder2({rowIndex, columnIndex}){
        //     if(columnIndex == 2 || columnIndex == 5 || columnIndex == 7 || columnIndex == 9){
        //         return {'border-right': '2px solid #f2f2f2'}
        //     } else {
        //         return {}
        //     }
        // },

        toThousands: toThousands,
    },
}


</script>