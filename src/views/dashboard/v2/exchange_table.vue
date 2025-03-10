<template>
    <!--- 表3: 平台 --->
    <div>
        <el-table
        :data="exchangeDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">
            <el-table-column label="BINANCE资金(k)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(Math.round(scope.row.binanceBalance/1000))}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="BINANCE仓位(k)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.binancePosition >= 0">
                        {{toThousands(Math.round(scope.row.binancePosition/1000))}}
                    </span>   
                    <span style="color: red" v-else>
                        {{toThousands(Math.round(scope.row.binancePosition/1000))}}
                    </span>  
                    &nbsp|&nbsp{{ (Math.abs(scope.row.binancePosition)/scope.row.binanceBalance).toFixed(2) }}X          
                </template>   
            </el-table-column>

            <el-table-column label="OKEX资金(k)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(Math.round(scope.row.okexBalance/1000))}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="OKEX仓位(k)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.okexPosition >= 0">
                        {{toThousands(Math.round(scope.row.okexPosition/1000))}}
                    </span>   
                    <span style="color: red" v-else>
                        {{toThousands(Math.round(scope.row.okexPosition/1000))}}
                    </span> 
                    &nbsp|&nbsp{{ (Math.abs(scope.row.okexPosition)/scope.row.okexBalance).toFixed(2) }}X              
                </template>   
            </el-table-column>

            <el-table-column label="BYBIT资金(k)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(Math.round(scope.row.bybitBalance/1000))}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="BYBIT仓位(k)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.bybitPosition >= 0">
                        {{toThousands(Math.round(scope.row.bybitPosition/1000))}}
                    </span>   
                    <span style="color: red" v-else>
                        {{toThousands(Math.round(scope.row.bybitPosition/1000))}}
                    </span>  
                    &nbsp|&nbsp{{ (Math.abs(scope.row.bybitPosition)/scope.row.bybitBalance).toFixed(2) }}X             
                </template>   
            </el-table-column>

            <el-table-column label="BITGET资金(k)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="">
                        {{toThousands(Math.round(scope.row.bitgetBalance/1000))}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="BITGET仓位(k)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: green" v-if="scope.row.bitgetPosition >= 0">
                        {{toThousands(Math.round(scope.row.bitgetPosition/1000))}}
                    </span>   
                    <span style="color: red" v-else>
                        {{toThousands(Math.round(scope.row.bitgetPosition/1000))}}
                    </span> 
                    &nbsp|&nbsp{{ (Math.abs(scope.row.bitgetPosition)/scope.row.bitgetBalance).toFixed(2) }}X              
                </template>   
            </el-table-column>                   
        </el-table>
    </div>
</template>

<script>
import {toThousands, getAnnualReturn, getMaxDrawdown} from '@/utils/general'


export default {
    props: {
        subaccountDatas: {
            type:Object,
            default:{}
        },
        // jiaPnl: {
        //     type: Number,
        //     default: 0
        // },
        // sunPnl: {
        //     type: Number,
        //     default: 0
        // },         
    },

    watch: {
        subaccountDatas: {
            handler(val, oldVal){
                this.parseSubaccountDatas()
            },
            deep: true
        },
    },

    data() {
        return {
            // 仓位
            exchangeDatas: [{
                binancePosition: null,
                okexPosition: null,
                bybitPosition: null,
                bitgetPosition: null,
                binanceBalance: null,
                okexBalance: null,
                bybitBalance: null,
                bitgetBalance: null,
                // sunPnl: null,
                // jiaPnl: null
            }],
        }
    },

    created() {
        // 分析Data
        this.parseSubaccountDatas()
    },

    methods: {
        parseSubaccountDatas(){  
            // 更新平台资产和仓位
            for(let data of this.subaccountDatas){
                if(data.subaccount.account.name == 'binance_69174462@qq.com'){
                    this.exchangeDatas[0].binanceBalance = data.wallet.usdt_amount
                    this.exchangeDatas[0].binancePosition = data.positions.summary.usdt_long + data.positions.summary.usdt_short
                }
                if(data.subaccount.account.name == 'okex_sunyoung.capital@gmail.com'){
                    this.exchangeDatas[0].okexBalance = data.wallet.usdt_amount
                    this.exchangeDatas[0].okexPosition = data.positions.summary.usdt_long + data.positions.summary.usdt_short
                }   
                if(data.subaccount.account.name == 'bybit_475492692@qq.com'){
                    this.exchangeDatas[0].bybitBalance = data.wallet.usdt_amount
                    this.exchangeDatas[0].bybitPosition = data.positions.summary.usdt_long + data.positions.summary.usdt_short
                }  
                if(data.subaccount.account.name == 'bitget_475492692@qq.com'){
                    this.exchangeDatas[0].bitgetBalance = data.wallet.usdt_amount
                    this.exchangeDatas[0].bitgetPosition = data.positions.summary.usdt_long + data.positions.summary.usdt_short
                }               
            }
        },

        toThousands: toThousands,
    },
}


</script>