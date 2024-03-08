<template>
    <div>

        <!--- 表1: 资产 --->
        <el-table
        :data="balanceDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">

            <el-table-column prop="totalBalance" label="总资产" min-width="10%" align="center">
                <template slot-scope="scope">
                    <b><u>${{toThousands(scope.row.totalBalance)}}</u></b>
                </template>
            </el-table-column>

            <el-table-column prop="totalReturn" label="收益率" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalReturn > 0" style="color: green">
                        {{scope.row.totalReturn}}%
                    </span>
                    <span v-else style="color: red">
                        {{scope.row.totalReturn}}%
                    </span>              
                </template>
            </el-table-column>

            <el-table-column prop="day1Diff" label="今日变化" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.day1Diff > 0" style="color: green">
                        <i class="el-icon-top"></i>
                        {{toThousands(scope.row.day1Diff)}}
                    </span>
                    <span style="color: red" v-else>
                        <i class="el-icon-bottom"></i>
                        {{toThousands(scope.row.day1Diff)}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column prop="yearDiff" label="今年变化" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.yearDiff > 0" style="color: green">
                        <i class="el-icon-top"></i>
                        {{toThousands(scope.row.yearDiff)}}
                    </span>
                    <span style="color: red" v-else>
                        <i class="el-icon-bottom"></i>
                        {{toThousands(scope.row.yearDiff)}}
                    </span>              
                </template>          
            </el-table-column>

            <el-table-column prop="drawdown" label="当前回撤" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red">
                        {{ scope.row.drawdown}}%
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="drawdownDays" label="回撤天数" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span>
                        {{ scope.row.drawdownDays}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="maxDrawdown" label="最大回撤" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red">
                        {{ scope.row.maxDrawdown}}%
                    </span>
                </template>         
            </el-table-column>
        </el-table>

        <!--- 表2: 仓位 --->
        <el-table
        :data="positionDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">

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
                        {{toThousands(-scope.row.shortPosition)}}
                    </span>               
                </template>
            </el-table-column>

            <el-table-column label="大PV多头" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span style="color: green">
                        {{toThousands(scope.row.prLongPosition)}}
                    </span>               
                </template>       
            </el-table-column>

            <el-table-column label="大PV空头" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span style="color: red">
                        {{toThousands(scope.row.prShortPosition)}}
                    </span>        
                </template>
            </el-table-column>

            <el-table-column label="小PV头寸" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span style="color: red">
                        {{toThousands(scope.row.prmPosition)}}
                    </span>              
                </template>       
            </el-table-column>

            <el-table-column label="抄底头寸" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span style="color: green">
                        {{toThousands(scope.row.pbPosition)}}
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
        parentPfoData: {
            type:Object,
            default:{}
        },
        todayOrders: {
            type:Array,
            default:[]
        },
        todayOrdersLoading: {
            type: Boolean,
            default: true
        }             
    },

    watch: {
        parentPfoData: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        },
    },

    data() {
        return {
            // 今日分类数据
            todayDatas: {
                'pivot_reversal': {
                    strategy: '大PV',
                    initPosition: null,
                    position: null,
                    openVol: null,
                    flipVol: null,
                    timerVol: null,
                    winStopVol: null,
                    pnl: null,
                    slippage: null,
                    fee: null,
                    swapFee: null,
                },
                'plunge_back': {
                    strategy: '抄底',
                    initPosition: null,
                    position: null,
                    openVol: null,
                    flipVol: null,
                    timerVol: null,
                    winStopVol: null,
                    pnl: null,
                    slippage: null,
                    fee: null,
                    swapFee: null,
                },
                'pivot_reversal_mini': {
                    strategy: '小PV',
                    initPosition: null,
                    position: null,
                    openVol: null,
                    flipVol: null,
                    timerVol: null,
                    winStopVol: null,
                    pnl: null,
                    slippage: null,
                    fee: null,
                    swapFee: null,
                },
                'all': {
                    strategy: '合计',
                    initPosition: 0,
                    position: 0,
                    openVol: 0,
                    flipVol: 0,
                    timerVol: 0,
                    winStopVol: 0,
                    pnl: 0,
                    slippage: 0,
                    fee: 0,
                    swapFee: 0,
                }
            }
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData(){  
            // 资产数据          
            var totalBalanceInfo = this.parentPfoData.wallet

            this.balanceDatas[0].totalBalance = parseInt(totalBalanceInfo.usdt_amount)
            this.balanceDatas[0].totalReturn = (((totalBalanceInfo.usdt_amount/config.initFundUSD) - 1)*100).toFixed(2)

            this.balanceDatas[0].day1Diff = parseInt(totalBalanceInfo.day_diff)
            const day7 = moment().subtract(6, 'day').format('YYYY-MM-DD')
            const yearStart = moment().startOf('year').format('YYYY-MM-DD')
            this.balanceDatas[0].day7Diff = parseInt(totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[day7])
            this.balanceDatas[0].yearDiff = parseInt(totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[yearStart])
            
            this.balanceDatas[0].drawdown = (totalBalanceInfo.drawdown*100).toFixed(2)
            this.balanceDatas[0].maxDrawdown = (totalBalanceInfo.max_drawdown*100).toFixed(2)
            this.balanceDatas[0].drawdownDays = totalBalanceInfo.drawdown_days

            // 仓位数据
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
            // 策略仓位信息从系统后台获取
            var prData = this.parentPfoData.positions.pivot_reversal
            var pbData = this.parentPfoData.positions.plunge_back
            var prmData = this.parentPfoData.positions.pivot_reversal_mini
            this.positionDatas[0].totalPosition = parseInt(totalPosition)
            this.positionDatas[0].longPosition = parseInt(longPosition)
            this.positionDatas[0].shortPosition = parseInt(shortPosition)
            this.positionDatas[0].prLongPosition = parseInt(prData.long)
            this.positionDatas[0].prShortPosition = parseInt(prData.short)
            this.positionDatas[0].pbPosition = parseInt(pbData.long)
            this.positionDatas[0].prmPosition = parseInt(prmData.short)

            // 
            // 策略表现(trade_stats)
            var prData = this.parentPfoData.trade_stats.pivot_reversal
            var pbData = this.parentPfoData.trade_stats.plunge_back
            var prmData = this.parentPfoData.trade_stats.pivot_reversal_mini
            // 第一行
            this.perfData1[0].col1 = parseInt(prData.all.year_now.total_pnl) + this.prPnlOffset
            this.perfData1[0].col2 = prData.all.year_now.weight_slippage != null ? (prData.all.year_now.weight_slippage*100).toFixed(3) : null
            this.perfData1[0].col3 = parseInt(prmData.all.year_now.total_pnl)
            this.perfData1[0].col4 = prmData.all.year_now.weight_slippage != null ? (prmData.all.year_now.weight_slippage*100).toFixed(3) : null
            this.perfData1[0].col5 = parseInt(pbData.all.year_now.total_pnl)
            this.perfData1[0].col6 = pbData.all.year_now.weight_slippage != null ? (pbData.all.year_now.weight_slippage*100).toFixed(3) : null
            // 第二行
            this.perfData2[0].col1 = prData.all.year_now.count
            this.perfData2[0].col2 = (prData.all.year_now.win_ratio*100).toFixed(1)
            this.perfData2[0].col3 = parseInt(prmData.pivot_reversal_mini_1.year_now.total_pnl)     //PV10
            this.perfData2[0].col4 = parseInt(prmData.pivot_reversal_mini_2.year_now.total_pnl)     //PV20
            this.perfData2[0].col5 = pbData.plunge_back_1.year_now.count
            this.perfData2[0].col6 = pbData.plunge_back_2.year_now.count
            this.perfData2[0].col7 = pbData.plunge_back_3.year_now.count
            // 第三行
            this.perfData3[0].col1 = parseInt(prData.all.year_now.avg_pnl)
            this.perfData3[0].col2 = prData.all.year_now.symbol_count
            this.perfData3[0].col3 = prmData.all.year_now.count
            this.perfData3[0].col32 = prmData.all.year_now.symbol_count
            this.perfData3[0].col4 = parseInt(prmData.all.year_now.avg_pnl)
            this.perfData3[0].col5 = parseInt(pbData.plunge_back_1.year_now.total_pnl)
            this.perfData3[0].col6 = parseInt(pbData.plunge_back_2.year_now.total_pnl)
            this.perfData3[0].col7 = parseInt(pbData.plunge_back_3.year_now.total_pnl)
        },

        addRightBorder({rowIndex, columnIndex}){
            if(columnIndex == 1 || columnIndex == 3){
                return {'border-right': '2px solid #f2f2f2'}
            } else {
                return {}
            }
        },

        toThousands: toThousands,
    },
}


</script>