<template>
    <!--- 表1: 资产 --->
    <el-table
    :data="balanceDatas"
    :header-cell-style="{ background: '#f2f2f2' }"
    style="width: 100%">
        <el-table-column label="总资产" min-width="10%" align="center">
            <template slot-scope="scope">
                <b><u>${{toThousands(scope.row.totalBalance)}}</u></b>
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

        <el-table-column prop="day1DiffPtg" label="今日变化率" min-width="10%" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.day1DiffPtg > 0" style="color: green">
                    <i class="el-icon-top"></i>
                    {{(scope.row.day1DiffPtg*100).toFixed(1)}}%
                </span>
                <span style="color: red" v-else>
                    <i class="el-icon-bottom"></i>
                    {{(scope.row.day1DiffPtg*100).toFixed(1)}}%
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

        <el-table-column prop="yearDiffPtg" label="今年变化率" min-width="10%" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.yearDiffPtg > 0" style="color: green">
                    <i class="el-icon-top"></i>
                    {{(scope.row.yearDiffPtg*100).toFixed(1)}}%
                </span>
                <span style="color: red" v-else>
                    <i class="el-icon-bottom"></i>
                    {{(scope.row.yearDiffPtg*100).toFixed(1)}}%
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

        <el-table-column prop="maxDrawdown" label="历史最高" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="">
                    {{ toThousands(scope.row.maxValue) }}
                </span>
            </template>         
        </el-table-column>
    </el-table>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands} from '@/utils/general'
import moment from 'moment'

export default {
    props: {
        parentPfoWallet: {
            type:Object,
            default:{}
        }, 
    },

    watch: {
        parentPfoWallet: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        },   
    },

    data() {
        return {
            // 资产
            balanceDatas: [{
                totalBalance: null,
                totalReturn: null,
                day1Diff: null,
                day7Diff: null,
                yearDiff: null,
                drawdown: null,
                drawdownDays: null,
                maxDrawdown: null,
                usdTotalBalance: null,
                coinTotalBalance: null,
                leverage: null
            }],
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData(){  
            // 资产数据          
            var totalBalanceInfo = this.parentPfoWallet

            this.balanceDatas[0].totalBalance = parseInt(totalBalanceInfo.usdt_amount)
            this.balanceDatas[0].totalReturn = (((totalBalanceInfo.usdt_amount/config.initFundUSD) - 1)*100).toFixed(2)

            this.balanceDatas[0].day1Diff = parseInt(totalBalanceInfo.day_diff)
            const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')
            this.balanceDatas[0].day1DiffPtg = (totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[yesterday])/totalBalanceInfo.history_values[yesterday]
            // const day7 = moment().subtract(6, 'day').format('YYYY-MM-DD')
            // this.balanceDatas[0].day7Diff = parseInt(totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[day7])
            const yearStart = moment().startOf('year').subtract(1, 'day').format('YYYY-MM-DD')  // 去年最后一天
            this.balanceDatas[0].yearDiff = parseInt(totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[yearStart])
            this.balanceDatas[0].yearDiffPtg = (totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[yearStart])/totalBalanceInfo.history_values[yearStart]
            
            this.balanceDatas[0].drawdown = (totalBalanceInfo.drawdown*100).toFixed(2)
            this.balanceDatas[0].maxDrawdown = (totalBalanceInfo.max_drawdown*100).toFixed(2)
            this.balanceDatas[0].drawdownDays = totalBalanceInfo.drawdown_days
            this.balanceDatas[0].maxValue = parseInt(totalBalanceInfo.max_value)

            // 当前系统杠杆率
            // var holdData = this.parentPfoPositions.hold
            // var totalPosition = 0
            // for(var i = 0; i < this.subaccountDatas.length; i++){
            //     var summary = this.subaccountDatas[i].positions.summary
            //     totalPosition += summary.usdt_long
            //     totalPosition += summary.usdt_short
            // }
            // this.balanceDatas[0].leverage = (totalPosition + holdData.long)/this.balanceDatas[0].totalBalance          
        },

        toThousands: toThousands,
    },
}


</script>