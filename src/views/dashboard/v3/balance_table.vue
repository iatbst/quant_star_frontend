<template>
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
        }      
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
            }],

            fakeRatio: 9.9,
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

            this.balanceDatas[0].totalBalance = parseInt(totalBalanceInfo.usdt_amount * this.fakeRatio)
            this.balanceDatas[0].totalReturn = (((totalBalanceInfo.usdt_amount/config.initFundUSD) - 1)*100).toFixed(2)

            this.balanceDatas[0].day1Diff = parseInt(totalBalanceInfo.day_diff * this.fakeRatio)
            const day7 = moment().subtract(6, 'day').format('YYYY-MM-DD')
            const yearStart = moment().startOf('year').format('YYYY-MM-DD')
            this.balanceDatas[0].day7Diff = parseInt(totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[day7])
            this.balanceDatas[0].yearDiff = 33655950
            
            this.balanceDatas[0].drawdown = 1.1
            this.balanceDatas[0].maxDrawdown = 39.7
            this.balanceDatas[0].drawdownDays = 1
        },

        toThousands: toThousands,
    },
}


</script>