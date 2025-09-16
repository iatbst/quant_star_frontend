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
            styBoll: 'boll_mini',
            styLr: 'long_short_ratio',
            styIn: 'id_nr',
            styPrm: 'pivot_reversal_mini',
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
            var bollData = this.parentPfoTradeStats.boll_mini
            var lrData = this.parentPfoTradeStats.long_short_ratio
            var inData = this.parentPfoTradeStats.id_nr
            var prmData = this.parentPfoTradeStats.pivot_reversal_mini
            var tbList = [
                [this.styTb + '_1', 'TB_1'],
                [this.styTb + '_2', 'TB_2'],
                [this.styTb + '_3', 'TB_3'],
                [this.styTb + '_4', 'TB_4'],
                [this.styTb + '_5', 'TB_5'],
                [this.styTb + '_6', 'TB_6'],
            ]
            var pbList = [
                [this.styPb + '_1', 'PB_1'],
                [this.styPb + '_2', 'PB_2'],
                [this.styPb + '_3', 'PB_3'],
                [this.styPb + '_4', 'PB_4']
            ]
            var rsiList = [
                ['all', 'RS']
            ]   // 只展示合并stats
            var bollList = [
                ['all', 'BL']
            ]   // 只展示合并stats
            var lrList = [
                ['all', 'LR']
            ]   // 只展示合并stats
            var inList = [
                ['all', 'IN']
            ]   // 只展示合并stats
            var prmList = [
                ['all', 'PM']
            ]   // 只展示合并stats
            var dataList = [
                [tbList, tbData],
                [pbList, pbData],
                [rsiList, rsiData],
                [bollList, bollData],
                [lrList, lrData],
                [inList, inData],
                [prmList, prmData]
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