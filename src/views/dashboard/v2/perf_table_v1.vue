<template>
    <div>
        <!--- 表3: 策略表现(row0) --->
        <el-table
        :data="[{col1: 'T今年', col2: 'B今年'}]"
        :show-header="false"
        :cell-style="{ background: '#f2f2f2' }"
        style="width: 100%; background: #f2f2f2">
            <el-table-column prop="col1" min-width="60%" align="center"> 
            </el-table-column>
            <el-table-column prop="col2" min-width="40%" align="center"> 
            </el-table-column>
        </el-table>

        <!--- 策略表现 --->
        <el-table
        :data="perfData"
        :header-cell-style="addRightBorder"
        :cell-style="addRightBorder"
        style="width: 100%">
            <el-table-column label="" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                        {{ scope.row.name }}               
                </template> 
            </el-table-column>

            <el-table-column label="TB-1" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styTb + '_1'] }}   
                    </span>                
                </template> 
            </el-table-column>

            <el-table-column label="TB-2" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styTb + '_2'] }}   
                    </span>                
                </template> 
            </el-table-column>   

            <el-table-column label="TB-3" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styTb + '_3'] }}   
                    </span>                
                </template> 
            </el-table-column>

            <el-table-column label="TB-4" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styTb + '_4'] }}   
                    </span>                
                </template> 
            </el-table-column>  

            <el-table-column label="TB-5" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styTb + '_5'] }}   
                    </span>                
                </template> 
            </el-table-column>

            <el-table-column label="TB-6" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styTb + '_6'] }}   
                    </span>                
                </template> 
            </el-table-column> 

            <el-table-column label="PB-1" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styPb + '_1'] }}   
                    </span>                
                </template> 
            </el-table-column>  

            <el-table-column label="PB-2" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styPb + '_2'] }}   
                    </span>                
                </template> 
            </el-table-column>

            <el-table-column label="PB-3" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styPb + '_3'] }}   
                    </span>                
                </template> 
            </el-table-column>

            <el-table-column label="PB-4" min-width="10%" align="center"> 
                <template slot-scope="scope">
                    <span>
                        {{ scope.row[styPb + '_4'] }}   
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
            perfData: [],
            styTb: 'trendline_break',
            styPb: 'plunge_back',
            tbList: [
                this.styTb + '_1', 
                this.styTb + '_2', 
                this.styTb + '_3', 
                this.styTb + '_4', 
                this.styTb + '_5', 
                this.styTb + '_6' 
            ],
            pbList: [
                this.styPb + '_1', 
                this.styPb + '_2', 
                this.styPb + '_3', 
                this.styPb + '_4',                
            ]
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData(){  
            this.perfData = []
            
             // 策略表现(trade_stats)
            var tbData = this.parentPfoTradeStats.trendline_break
            var pbData = this.parentPfoTradeStats.plunge_back
            var tbList = [
                this.styTb + '_1', 
                this.styTb + '_2', 
                this.styTb + '_3', 
                this.styTb + '_4', 
                this.styTb + '_5', 
                this.styTb + '_6' 
            ]
            var pbList = [
                this.styPb + '_1', 
                this.styPb + '_2', 
                this.styPb + '_3', 
                this.styPb + '_4'
            ]

            // row1: 次数
            var row = {'name': '交易次数'}
            for(let key of tbList){
                row[key] = tbData[key].year_now.count
            }
            for(let key of pbList){
                row[key] = pbData[key].year_now.count
            }
            this.perfData.push(row)

            // row2: 胜次
            row = {'name': '胜次'}
            for(let key of tbList){
                row[key] = tbData[key].year_now.win_count
            }
            for(let key of pbList){
                row[key] = pbData[key].year_now.win_count
            }
            this.perfData.push(row)

            // row3: 负次
            row = {'name': '负次'}
            for(let key of tbList){
                row[key] = tbData[key].year_now.lose_count
            }
            for(let key of pbList){
                row[key] = pbData[key].year_now.lose_count
            }
            this.perfData.push(row)

            // row4: 胜率
            row = {'name': '胜率'}
            for(let key of tbList){
                row[key] = tbData[key].year_now.win_ratio != null ? (tbData[key].year_now.win_ratio*100).toFixed(1) + '%' : null
            }
            for(let key of pbList){
                row[key] = pbData[key].year_now.win_ratio != null ? (pbData[key].year_now.win_ratio*100).toFixed(1) + '%' : null
            }
            this.perfData.push(row)

            // row5: 平均胜时损益率
            row = {'name': '平均胜时损益率'}
            for(let key of tbList){
                row[key] = tbData[key].year_now.win_avg_pnl_ptg != null ? (tbData[key].year_now.win_avg_pnl_ptg*100).toFixed(1) + '%' : null
            }
            for(let key of pbList){
                row[key] = pbData[key].year_now.win_avg_pnl_ptg != null ? (pbData[key].year_now.win_avg_pnl_ptg*100).toFixed(1) + '%' : null
            }
            this.perfData.push(row)

            // row6: 平均负时损益率
            row = {'name': '平均负时损益率'}
            for(let key of tbList){
                row[key] = tbData[key].year_now.lose_avg_pnl_ptg != null ? (tbData[key].year_now.lose_avg_pnl_ptg*100).toFixed(1) + '%' : null
            }
            for(let key of pbList){
                row[key] = pbData[key].year_now.lose_avg_pnl_ptg != null ? (pbData[key].year_now.lose_avg_pnl_ptg*100).toFixed(1) + '%' : null
            }
            this.perfData.push(row)

            // row7: 平均损益率
            row = {'name': '平均损益率'}
            for(let key of tbList){
                row[key] = tbData[key].year_now.avg_pnl_ptg != null ? (tbData[key].year_now.avg_pnl_ptg*100).toFixed(1) + '%' : null
            }
            for(let key of pbList){
                row[key] = pbData[key].year_now.avg_pnl_ptg != null ? (pbData[key].year_now.avg_pnl_ptg*100).toFixed(1) + '%' : null
            }
            this.perfData.push(row)

            // row8: 滑点
            row = {'name': '滑点'}
            for(let key of tbList){
                row[key] = tbData[key].year_now.weight_slippage != null ? (tbData[key].year_now.weight_slippage*100).toFixed(3) + '%' : null
            }
            for(let key of pbList){
                row[key] = pbData[key].year_now.weight_slippage != null ? (pbData[key].year_now.weight_slippage*100).toFixed(3) + '%' : null
            }
            this.perfData.push(row)

            // row9: 总损益额
            row = {'name': '总损益额'}
            for(let key of tbList){
                row[key] = toThousands(parseInt(tbData[key].year_now.total_pnl))
            }
            for(let key of pbList){
                row[key] = toThousands(parseInt(pbData[key].year_now.total_pnl))
            }
            this.perfData.push(row)

            // // 策略表现(trade_stats)
            // var tbData = this.parentPfoTradeStats.trendline_break
            // var pbData = this.parentPfoTradeStats.plunge_back

            // // 第一行
            // this.perfData1[0].col1 = parseInt(tbData.all.year_now.total_pnl) + this.prPnlOffset
            // this.perfData1[0].col2_1 = (tbData.all.year_now.win_ratio*100).toFixed(1)
            // this.perfData1[0].col2_2 = tbData.all.year_now.win_lose_pnl_ratio != null ? tbData.all.year_now.win_lose_pnl_ratio.toFixed(3) : null  
            // this.perfData1[0].col3 = tbData.all.year_now.weight_slippage != null ? (tbData.all.year_now.weight_slippage*100).toFixed(3) : null

            // // this.perfData1[0].col4 = parseInt(mczData.all.year_now.total_pnl) + this.mczPnlPffset
            // // this.perfData1[0].col5_1 = (mczData.all.year_now.win_ratio*100).toFixed(1)
            // // this.perfData1[0].col5_2 = mczData.all.year_now.win_lose_pnl_ratio != null ? mczData.all.year_now.win_lose_pnl_ratio.toFixed(3) : null  
            // // this.perfData1[0].col6 = mczData.all.year_now.weight_slippage != null ? (mczData.all.year_now.weight_slippage*100).toFixed(3) : null

            // this.perfData1[0].col7 = parseInt(pbData.all.year_now.total_pnl)
            // this.perfData1[0].col8_1 = pbData.all.year_now.count
            // this.perfData1[0].col8_2 = parseInt(pbData.all.year_now.avg_pnl)
            // this.perfData1[0].col9_1 = (pbData.all.year_now.win_ratio*100).toFixed(1)
            // this.perfData1[0].col9_2 = pbData.all.year_now.win_lose_pnl_ratio != null ? pbData.all.year_now.win_lose_pnl_ratio.toFixed(3) : null 
            // this.perfData1[0].col10 = pbData.all.year_now.weight_slippage != null ? (pbData.all.year_now.weight_slippage*100).toFixed(3) : null 

            // // 第二行
            // this.perfData2[0].col1 = tbData.all.year_now.count
            // this.perfData2[0].col2 = tbData.all.year_now.win_count
            // this.perfData2[0].col3 = tbData.all.year_now.lose_count

            // // this.perfData2[0].col4 = mczData.all.year_now.count
            // // this.perfData2[0].col5 = mczData.all.year_now.win_count
            // // this.perfData2[0].col6 = mczData.all.year_now.lose_count

            // this.perfData2[0].col7 = pbData.plunge_back_1.year_now.count
            // this.perfData2[0].col8 = pbData.plunge_back_2.year_now.count
            // this.perfData2[0].col9 = pbData.plunge_back_3.year_now.count
            // this.perfData2[0].col10 = pbData.plunge_back_4.year_now.count
            // // debugger

            // // 第三行
            // this.perfData3[0].col1 = parseInt(tbData.all.year_now.avg_pnl)
            // this.perfData3[0].col2 = parseInt(tbData.all.year_now.win_avg_pnl)
            // this.perfData3[0].col3 = parseInt(tbData.all.year_now.lose_avg_pnl)

            // // this.perfData3[0].col4 = parseInt(mczData.all.year_now.avg_pnl)
            // // this.perfData3[0].col5 = parseInt(mczData.all.year_now.win_avg_pnl)
            // // this.perfData3[0].col6 = parseInt(mczData.all.year_now.lose_avg_pnl)

            // this.perfData3[0].col7 = parseInt(pbData.plunge_back_1.year_now.avg_pnl)
            // this.perfData3[0].col8 = parseInt(pbData.plunge_back_2.year_now.avg_pnl)
            // this.perfData3[0].col9 = parseInt(pbData.plunge_back_3.year_now.avg_pnl)
            // this.perfData3[0].col10 = parseInt(pbData.plunge_back_4.year_now.avg_pnl)                    
        },


        addRightBorder({rowIndex, columnIndex}){
            if(columnIndex == 6 ){
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