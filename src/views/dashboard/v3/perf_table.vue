<template>
    <div>
        <!--- 表3: 策略表现(row0) --->
        <el-table
        :data="[{col1: '大今年', col2: '底今年'}]"
        :show-header="false"
        :cell-style="{ background: '#f2f2f2' }"
        style="width: 100%; background: #f2f2f2">
            <el-table-column prop="col1" min-width="24%" align="center"> 
            </el-table-column>
            <el-table-column prop="col2" min-width="76%" align="center"> 
            </el-table-column>
        </el-table>

        <!--- 策略表现(row1) --->
        <el-table
        :data="perfData1"
        :header-cell-style="addRightBorder"
        :cell-style="addRightBorder"
        style="width: 100%">
            <el-table-column label="收益" min-width="12%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col1 >= 0">
                        {{toThousands(scope.row.col1)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col1)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="滑点" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col2 >= 0">
                        {{scope.row.col2}}%
                    </span>  
                    <span style="color: red" v-else>
                        {{scope.row.col2}}%
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="收益" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col3 >= 0">
                        {{toThousands(scope.row.col3)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col3)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="滑点" min-width="12%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col4 >= 0">
                        {{scope.row.col4}}%
                    </span>  
                    <span style="color: red" v-else>
                        {{scope.row.col4}}%
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="Binance资产" min-width="12%" align="center"> 
                {{binanceBalancePtg}}
            </el-table-column>
            <el-table-column label="Okex资产" min-width="12%" align="center"> 
                {{okexBalancePtg}}
            </el-table-column>
             <el-table-column label="" min-width="12%" align="center"> 
            </el-table-column>
            <el-table-column label="" min-width="12%" align="center"> 
            </el-table-column>           
        </el-table> 

        <!--- 策略表现(row2) --->
        <el-table
        :data="perfData2"
        :header-cell-style="addRightBorder"
        :cell-style="addRightBorder"
        style="width: 100%">
            <el-table-column label="交易次数" min-width="12%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col1)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="胜率" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="">
                        {{scope.row.col2}}%
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="15%次数" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col3)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="20%次数" min-width="12%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col4)}}
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="25%次数" min-width="12%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col5)}}
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="28.5%次数" min-width="12%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col6)}}
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="38%次数" min-width="12%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col7)}}
                    </span>               
                </template>  
            </el-table-column>
            <el-table-column label="45%次数" min-width="12%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col8)}}
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
            <el-table-column label="单笔盈亏" min-width="12%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col1 >= 0">
                        {{toThousands(scope.row.col1)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col1)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="交易币数" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(scope.row.col2)}}
                    </span>               
                </template> 
            </el-table-column>
            <el-table-column label="15%收益" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col3 >= 0">
                        {{toThousands(scope.row.col3)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col3)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="20%收益" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col4 >= 0">
                        {{toThousands(scope.row.col4)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col4)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="25%收益" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col5 >= 0">
                        {{toThousands(scope.row.col5)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col5)}}
                    </span>                
                </template> 
            </el-table-column>
            <el-table-column label="28.5%收益" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col6 >= 0">
                        {{toThousands(scope.row.col6)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col6)}}
                    </span>                
                </template> 
            </el-table-column> 
            <el-table-column label="38%收益" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col7 >= 0">
                        {{toThousands(scope.row.col7)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col7)}}
                    </span>                
                </template> 
            </el-table-column>
             <el-table-column label="45%收益" min-width="12%" align="center"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.col8 >= 0">
                        {{toThousands(scope.row.col8)}}
                    </span>  
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.col8)}}
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

export default {
    props: {
        parentPfoTradeStats: {
            type:Object,
            default:{}
        },
        binanceBalancePtg: {
            type: String,
            default: ''
        },
        okexBalancePtg: {
            type: String,
            default: ''
        },
    },

    watch: {
        parentPfoTradeStats: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        },
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
            }],
            
            // 大PV策略年初始时归零(和pnl曲线保持一致)
            prPnlOffset: -533097,

            fakeRatio: 9.9
        }
    },

    created() {
        // 分析Data
        this.parseData()

        this.fakeRatio = 9.9
    },

    methods: {
        parseData(){  
            // 策略表现(trade_stats)
            var prData = this.parentPfoTradeStats.pivot_reversal
            var pbData = this.parentPfoTradeStats.plunge_back
            // 第一行
            this.perfData1[0].col1 = 20635395
            this.perfData1[0].col2 = prData.all.year_now.weight_slippage != null ? (prData.all.year_now.weight_slippage*100).toFixed(3) : null
            this.perfData1[0].col3 = parseInt(pbData.all.year_now.total_pnl * this.fakeRatio)
            this.perfData1[0].col4 = pbData.all.year_now.weight_slippage != null ? (pbData.all.year_now.weight_slippage*100).toFixed(3) : null
            // 第二行
            this.perfData2[0].col1 = prData.all.year_now.count
            this.perfData2[0].col2 = (prData.all.year_now.win_ratio*100).toFixed(1)
            this.perfData2[0].col3 = pbData.plunge_back_1.year_now.count
            this.perfData2[0].col4 = pbData.plunge_back_2.year_now.count
            this.perfData2[0].col5 = pbData.plunge_back_3.year_now.count
            this.perfData2[0].col6 = pbData.plunge_back_4.year_now.count
            this.perfData2[0].col7 = pbData.plunge_back_5.year_now.count
            this.perfData2[0].col8 = pbData.plunge_back_6.year_now.count           
            // 第三行
            this.perfData3[0].col1 = 10866
            this.perfData3[0].col2 = prData.all.year_now.symbol_count
            this.perfData3[0].col3 = parseInt(pbData.plunge_back_1.year_now.total_pnl * this.fakeRatio)
            this.perfData3[0].col4 = parseInt(pbData.plunge_back_2.year_now.total_pnl * this.fakeRatio)
            this.perfData3[0].col5 = parseInt(pbData.plunge_back_3.year_now.total_pnl * this.fakeRatio)
            this.perfData3[0].col6 = parseInt(pbData.plunge_back_4.year_now.total_pnl * this.fakeRatio)
            this.perfData3[0].col7 = parseInt(pbData.plunge_back_5.year_now.total_pnl * this.fakeRatio)
            this.perfData3[0].col8 = parseInt(pbData.plunge_back_6.year_now.total_pnl * this.fakeRatio)            
        },

        addRightBorder({rowIndex, columnIndex}){
            if(columnIndex == 1){
                return {'border-right': '2px solid #f2f2f2'}
            } else {
                return {}
            }
        },

        toThousands: toThousands,
    },
}


</script>