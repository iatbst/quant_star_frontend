<template>
    <div>
        <!--- 策略表现 --->
        <el-table
        :data="perfData"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">
            <el-table-column label="策略" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                        {{ scope.row.name }}               
                </template> 
            </el-table-column>

            <el-table-column label="交易次数" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                        {{ scope.row.count }}               
                </template> 
            </el-table-column>

            <el-table-column label="胜次" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                        {{ scope.row.win_count }}               
                </template> 
            </el-table-column>

            <el-table-column label="负次" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                        {{ scope.row.lose_count }}               
                </template> 
            </el-table-column>

            <el-table-column label="胜率" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                        {{ scope.row.win_ratio }}               
                </template> 
            </el-table-column> 

            <el-table-column label="平均胜时损益率" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                        {{ scope.row.win_avg_pnl_ptg }}               
                </template> 
            </el-table-column> 

            <el-table-column label="平均负时损益率" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                        {{ scope.row.lose_avg_pnl_ptg }}               
                </template> 
            </el-table-column> 

            <el-table-column label="平均损益率" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.avg_pnl_ptg >= 0">
                        {{ (scope.row.avg_pnl_ptg*100).toFixed(1) }}%
                    </span>   
                    <span style="color: red" v-else>
                        {{ (scope.row.avg_pnl_ptg*100).toFixed(1) }}%
                    </span>   
                </template>      
            </el-table-column> 

            <el-table-column label="滑点" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.weight_slippage >= 0">
                        {{ (scope.row.weight_slippage*100).toFixed(3) }}%
                    </span>   
                    <span style="color: red" v-else>
                        {{ (scope.row.weight_slippage*100).toFixed(3) }}%
                    </span>               
                </template> 
            </el-table-column>  

            <el-table-column label="总损益额" min-width="10%" align="center" style="background: white"> 
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.total_pnl >= 0">
                        {{ toThousands(parseInt(scope.row.total_pnl)) }}
                    </span>   
                    <span style="color: red" v-else>
                        {{ toThousands(parseInt(scope.row.total_pnl)) }}
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
            styRsi: 'rsi_mini',
            strategyAlias: config.strategyAlias, 
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
            var rsiData = this.parentPfoTradeStats.rsi_mini
            var tbList = [
                [this.styTb + '_1', 'T_1'],
                [this.styTb + '_2', 'T_2'],
                [this.styTb + '_3', 'T_3'],
                [this.styTb + '_4', 'T_4'],
                [this.styTb + '_5', 'T_5'],
                [this.styTb + '_6', 'T_6'],
            ]
            var pbList = [
                [this.styPb + '_1', 'B_1'],
                [this.styPb + '_2', 'B_2'],
                [this.styPb + '_3', 'B_3'],
                [this.styPb + '_4', 'B_4']
            ]
            var rsiList = [
                ['all', 'RSI']
            ]   // 只展示合并stats
            var dataList = [
                [tbList, tbData],
                [pbList, pbData],
                [rsiList, rsiData],
            ]
            for(let data of dataList){
                var styData = data[1]
                for(let _data of data[0]){
                    var key = _data[0]
                    this.perfData.push({
                        name: _data[1],
                        count: styData[key].year_now.count,
                        win_count: styData[key].year_now.win_count,
                        lose_count: styData[key].year_now.lose_count,
                        win_ratio: styData[key].year_now.win_ratio != null ? (styData[key].year_now.win_ratio*100).toFixed(1) + '%' : null,
                        win_avg_pnl_ptg: styData[key].year_now.win_avg_pnl_ptg != null ? (styData[key].year_now.win_avg_pnl_ptg*100).toFixed(1) + '%' : null,
                        lose_avg_pnl_ptg: styData[key].year_now.lose_avg_pnl_ptg != null ? (styData[key].year_now.lose_avg_pnl_ptg*100).toFixed(1) + '%' : null,
                        avg_pnl_ptg: styData[key].year_now.avg_pnl_ptg != null ? styData[key].year_now.avg_pnl_ptg : null,
                        weight_slippage: styData[key].year_now.weight_slippage != null ? styData[key].year_now.weight_slippage : null,
                        total_pnl: styData[key].year_now.total_pnl
                    })
                }
            }

            // // row1: 次数
            // var row = {'name': '交易次数'}
            // for(let key of tbList){
            //     row[key] = tbData[key].year_now.count
            // }
            // for(let key of pbList){
            //     row[key] = pbData[key].year_now.count
            // }
            // this.perfData.push(row)

            // // row2: 胜次
            // row = {'name': '胜次'}
            // for(let key of tbList){
            //     row[key] = tbData[key].year_now.win_count
            // }
            // for(let key of pbList){
            //     row[key] = pbData[key].year_now.win_count
            // }
            // this.perfData.push(row)

            // // row3: 负次
            // row = {'name': '负次'}
            // for(let key of tbList){
            //     row[key] = tbData[key].year_now.lose_count
            // }
            // for(let key of pbList){
            //     row[key] = pbData[key].year_now.lose_count
            // }
            // this.perfData.push(row)

            // // row4: 胜率
            // row = {'name': '胜率'}
            // for(let key of tbList){
            //     row[key] = tbData[key].year_now.win_ratio != null ? (tbData[key].year_now.win_ratio*100).toFixed(1) + '%' : null
            // }
            // for(let key of pbList){
            //     row[key] = pbData[key].year_now.win_ratio != null ? (pbData[key].year_now.win_ratio*100).toFixed(1) + '%' : null
            // }
            // this.perfData.push(row)

            // // row5: 平均胜时损益率
            // row = {'name': '平均胜时损益率'}
            // for(let key of tbList){
            //     row[key] = tbData[key].year_now.win_avg_pnl_ptg != null ? (tbData[key].year_now.win_avg_pnl_ptg*100).toFixed(1) + '%' : null
            // }
            // for(let key of pbList){
            //     row[key] = pbData[key].year_now.win_avg_pnl_ptg != null ? (pbData[key].year_now.win_avg_pnl_ptg*100).toFixed(1) + '%' : null
            // }
            // this.perfData.push(row)

            // // row6: 平均负时损益率
            // row = {'name': '平均负时损益率'}
            // for(let key of tbList){
            //     row[key] = tbData[key].year_now.lose_avg_pnl_ptg != null ? (tbData[key].year_now.lose_avg_pnl_ptg*100).toFixed(1) + '%' : null
            // }
            // for(let key of pbList){
            //     row[key] = pbData[key].year_now.lose_avg_pnl_ptg != null ? (pbData[key].year_now.lose_avg_pnl_ptg*100).toFixed(1) + '%' : null
            // }
            // this.perfData.push(row)

            // // row7: 平均损益率
            // row = {'name': '平均损益率'}
            // for(let key of tbList){
            //     row[key] = tbData[key].year_now.avg_pnl_ptg != null ? (tbData[key].year_now.avg_pnl_ptg*100).toFixed(1) + '%' : null
            // }
            // for(let key of pbList){
            //     row[key] = pbData[key].year_now.avg_pnl_ptg != null ? (pbData[key].year_now.avg_pnl_ptg*100).toFixed(1) + '%' : null
            // }
            // this.perfData.push(row)

            // // row8: 滑点
            // row = {'name': '滑点'}
            // for(let key of tbList){
            //     row[key] = tbData[key].year_now.weight_slippage != null ? (tbData[key].year_now.weight_slippage*100).toFixed(3) + '%' : null
            // }
            // for(let key of pbList){
            //     row[key] = pbData[key].year_now.weight_slippage != null ? (pbData[key].year_now.weight_slippage*100).toFixed(3) + '%' : null
            // }
            // this.perfData.push(row)

            // // row9: 总损益额
            // row = {'name': '总损益额'}
            // for(let key of tbList){
            //     row[key] = toThousands(parseInt(tbData[key].year_now.total_pnl))
            // }
            // for(let key of pbList){
            //     row[key] = toThousands(parseInt(pbData[key].year_now.total_pnl))
            // }
            // this.perfData.push(row)

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