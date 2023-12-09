<template>
    <div>

        <!--- 资产 --->
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

        <!--- 仓位 --->
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
        summaryDatas: {
            type:Array,
            default:[]
        },

        liveRets: {
            type:Object,
            default:{}         
        }
    },

    watch: {
        summaryDatas: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        },
    },

    data() {
        return {
            // 资产
            pfoMasterDatas: null,
            totalBalance: null,
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

            // 仓位
            subaccountDatas: null,
            totalPosition: 0,
            longPosition: 0,
            shortPosition: 0, 
            shortLevelPosition: 0,
            longLevelPosition: 0,
            positionDatas: [{
                totalPosition: null,
                longPosition: null,
                shortPosition: null,

                prLongPosition: null,
                prShortPosition: null,
                prmPosition: null,
                pbPosition: null
            }],

            // 策略
            pfoDatas: null,
            perfDatas: [{
                totalProfit: null,
                totalCount: null,
                winRatio: null,
                plRatio: null,
                slippage: null,
                totalSty: null,
                usdtSymbol: null,
                btcSymbol: null,
            }],  
            usdtSymbols: new Set(),
            absUsdtSymbols: 0,  // 绝对交易数量, 不去重复
            // btcSymbols: new Set(),
            btcSymbolsCount: 18,    // 暂时手工统计btc交易数量

            // 风险
            // subacctPfoAlias: config.subacctPfoAlias, 
            // riskDatas: [{
            //     riskRatio: null,
            //     leverage: null,
            //     usdtLeverage: null,
            //     btcLeverage: null,
            // }],   

            // 监控
            // pfoAlias: config.pfoAlias, 
            // monitorDatas: [{
            //     totalTradeSuccessRate: null,
            //     totalTradeErrorRate: null,
            //     totalTradeManualRate: null,
            //     allProcessStatus: null,
            //     allHostStatus: null,
            // }],
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData(){
            this.pfoMasterDatas = this.summaryDatas[0]
            this.subaccountDatas = this.summaryDatas[1]
            this.pfoDatas = this.summaryDatas[2]

            this.parseBalanceData()
            // this.parsePositionData()
            this.parsePerfData()
        },

        // 分析资产数据
        parseBalanceData(){            
            for(var i = 0; i < this.pfoMasterDatas.length; i++){
                if (this.pfoMasterDatas[i].portfolio.name === config.cryptoParentPfo){
                    // Crypto父pfo
                    var totalBalanceInfo = this.pfoMasterDatas[i].wallet

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

                    // 仓位信息
                    var posData = this.pfoMasterDatas[i].positions.all
                    var prData = this.pfoMasterDatas[i].positions.pivot_reversal
                    var pbData = this.pfoMasterDatas[i].positions.plunge_back
                    var prmData = this.pfoMasterDatas[i].positions.pivot_reversal_mini
                    this.positionDatas[0].totalPosition = parseInt(posData.long + posData.short)
                    this.positionDatas[0].longPosition = parseInt(posData.long)
                    this.positionDatas[0].shortPosition = parseInt(posData.short)
                    this.positionDatas[0].prLongPosition = parseInt(prData.long)
                    this.positionDatas[0].prShortPosition = parseInt(prData.short)
                    this.positionDatas[0].pbPosition = parseInt(pbData.long)
                    this.positionDatas[0].prmPosition = parseInt(prmData.short)
                }        
            }  
            this.totalBalance = this.balanceDatas[0].totalBalance   // 计算总体杠杆率
        },

        // 分析仓位数据
        parsePositionData() {   
            var positionsByCoins = {USD_long: 0, USD_short: 0, BTC_long: 0, BTC_short: 0} 
            this.totalPosition = 0
            this.longPosition = 0
            this.shortPosition = 0 
            this.absUsdtSymbols = 0
            for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let symbol in this.subaccountDatas[i].positions.data){
                    var usdtAmount = this.subaccountDatas[i].positions.data[symbol]
                    this.totalPosition += usdtAmount
                    if (usdtAmount >= 0){
                        this.longPosition += usdtAmount
                    } else {
                        this.shortPosition += Math.abs(usdtAmount)
                    }

                    // 币种分布(USD vs BTC)
                    var quote = symbol.split('/')[1]
                    if (config.usdStableCoins.includes(quote)) {
                        quote = 'USD'
                    }
                    var side = usdtAmount >= 0 ? 'long' : 'short'
                    var coinKey = quote + '_' + side
                    if (coinKey in positionsByCoins){
                        positionsByCoins[coinKey] += usdtAmount
                    } else {
                        positionsByCoins[coinKey] = usdtAmount
                    } 

                    // 统计币种数量(目前只统计quote是usdt的交易对)
                    var base = symbol.split('/')[0]
                    if (quote === 'USD'){
                        if (!this.usdtSymbols.has(base)){
                            this.usdtSymbols.add(base)
                        }
                        this.absUsdtSymbols += 1
                    } 
                    // else if(quote === 'BTC'){
                    //     if (!this.btcSymbols.has(base)){
                    //         this.btcSymbols.add(base)
                    //     }
                    // }
                }
            }
            this.positionDatas[0].totalPosition = parseInt(this.totalPosition)
            this.positionDatas[0].longPosition = parseInt(this.longPosition)
            this.positionDatas[0].shortPosition = parseInt(this.shortPosition)
            this.positionDatas[0].usdtLongPosition = parseInt(positionsByCoins['USD_long'])
            this.positionDatas[0].usdtShortPosition = parseInt(positionsByCoins['USD_short'])
            this.positionDatas[0].usdtPosition = parseInt(positionsByCoins['USD_long'] + positionsByCoins['USD_short'])

            this.positionDatas[0].btcLongPosition = parseInt(positionsByCoins['BTC_long'])
            this.positionDatas[0].btcShortPosition = parseInt(positionsByCoins['BTC_short'])
            this.positionDatas[0].btcPosition = parseInt(positionsByCoins['BTC_long'] + positionsByCoins['BTC_short'])
        },

        // 分析策略数据(最近6m)
        parsePerfData() {
            var perf_range = '6m'
            var totalProfit = 0
            var totalCount = 0
            var totalWinCount = 0
            var totalWinPtg = 0
            var totalLosePtg = 0
            var totalPtg = 0
            var totalWeightSlippage = 0
            var totalUsdVolume = 0

            for(var i = 0; i < this.pfoDatas.length; i++){
                const data = this.pfoDatas[i][0].performance.range_perfs[perf_range].data
                totalProfit += data.usd_profit
                totalCount += data.count
                totalWinCount += data.win_count
                totalWinPtg += data.win_pnl_ptg
                totalLosePtg += data.lose_pnl_ptg
                totalPtg += data.total_pnl_ptg
                totalWeightSlippage += data.total_weighted_slippage
                totalUsdVolume += data.usd_volume
            }

            this.perfDatas[0].totalProfit = parseInt(totalProfit)
            this.perfDatas[0].totalCount = totalCount
            this.perfDatas[0].winRatio = (totalWinCount*100/totalCount).toFixed(2)
            this.perfDatas[0].winAvgPtg = (totalWinPtg*100 / totalWinCount).toFixed(2)
            this.perfDatas[0].loseAvgPtg = (totalLosePtg*100 / (totalCount - totalWinCount)).toFixed(2)
            this.perfDatas[0].avgPtg = (totalPtg*100 / totalCount).toFixed(2)
            this.perfDatas[0].plRatio = ( this.perfDatas[0].winAvgPtg / Math.abs(this.perfDatas[0].loseAvgPtg )).toFixed(2)
            this.perfDatas[0].slippage = (totalWeightSlippage*100/totalUsdVolume).toFixed(2)

            // 更新liveRets
            this.liveRets.winRatio = this.perfDatas[0].winRatio
            this.liveRets.plRatio = this.perfDatas[0].plRatio
            this.liveRets.countPerSymbol = totalCount/(this.absUsdtSymbols + this.btcSymbolsCount)
            for(var i = 0; i < this.pfoMasterDatas.length; i++){
                if (this.pfoMasterDatas[i].portfolio.name === config.cryptoParentPfo){
                    var valueLine = this.pfoMasterDatas[i].wallet.history_values
                    var date = new Date()
                    date.setMonth(date.getMonth() - 6)
                    var firstDate = date.toISOString().slice(0, 10)
                    this.liveRets.annualReturn = getAnnualReturn(valueLine, firstDate)
                    this.liveRets.maxDrawdown = getMaxDrawdown(valueLine, firstDate)
                }
            }
            this.liveRets.available = true
        },


        toThousands: toThousands,
    },
}


</script>