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
                        {{toThousands(scope.row.day1Diff)}}
                    </span>
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.day1Diff)}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column prop="day7Diff" label="7日变化" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.day7Diff > 0" style="color: green">
                        {{toThousands(scope.row.day7Diff)}}
                    </span>
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.day7Diff)}}
                    </span>              
                </template>          
            </el-table-column>

            <el-table-column prop="day30Diff" label="30日变化" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.day30Diff > 0" style="color: green">
                        {{toThousands(scope.row.day30Diff)}}
                    </span>
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.day30Diff)}}
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
            </el-table-column>

            <el-table-column prop="maxDrawdown" label="最大回撤" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red">
                        {{ scope.row.maxDrawdown}}%
                    </span>
                </template>         
            </el-table-column>

            <el-table-column prop="usdTotalBalance" label="美元资产" min-width="10%" align="center">
            </el-table-column>

            <el-table-column prop="coinTotalBalance" label="币资产($)" min-width="10%" align="center">
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

            <el-table-column label="USD多头" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span style="color: green">
                        {{toThousands(scope.row.usdtLongPosition)}}
                    </span>               
                </template>       
            </el-table-column>

            <el-table-column label="USD空头" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span style="color: red">
                        {{toThousands(scope.row.usdtShortPosition)}}
                    </span>                
                </template>         
            </el-table-column>

            <el-table-column label="BTC多头" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span style="color: green">
                        {{toThousands(scope.row.btcLongPosition)}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="BTC空头" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span style="color: red">
                        {{toThousands(scope.row.btcShortPosition)}}
                    </span>               
                </template>       
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
            </el-table-column>
        </el-table>     

        <!--- 策略 --->
        <el-table
        :data="perfDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">

            <el-table-column label="总收益($)" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalProfit > 0" style="color: green">
                        {{toThousands(scope.row.totalProfit)}}
                    </span>
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.totalProfit)}}
                    </span>             
                </template>   
            </el-table-column>

            <el-table-column label="交易次数" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span>
                        {{toThousands(scope.row.totalCount)}}
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="胜率" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span>
                        {{scope.row.winRate}}%
                    </span>               
                </template>
            </el-table-column>

            <el-table-column label="盈亏比" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span>
                        {{scope.row.plRate}}
                    </span>               
                </template>       
            </el-table-column>

            <el-table-column label="加权滑点" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.slippage > 0" style="color: green">
                        {{toThousands(scope.row.slippage)}}%
                    </span>
                    <span style="color: red" v-else>
                        {{toThousands(scope.row.slippage)}}%
                    </span>               
                </template>         
            </el-table-column>

            <el-table-column label="子策略数" min-width="10%" align="center">
                <template slot-scope="scope">           
                </template>
            </el-table-column>

            <el-table-column label="USD币对数" min-width="10%" align="center">
                <template slot-scope="scope">          
                </template>       
            </el-table-column>

            <el-table-column label="BTC币对数" min-width="10%" align="center">
                <template slot-scope="scope">          
                </template>       
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
            </el-table-column>
        </el-table>   

        <!--- 风险 --->
        <el-table
        :data="riskDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">


            <el-table-column label="总杠杆率" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span v-if="scope.row.leverage < 2">
                        {{scope.row.leverage}}X
                    </span>
                   <span style="color: orange" v-else-if="scope.row.leverage < 2.5">
                        {{scope.row.leverage}}X
                    </span> 
                   <span style="color: red" v-else>
                        <b>{{scope.row.leverage}}X</b>
                    </span>                  
                </template>
            </el-table-column>

            <el-table-column label="USD杠杆率" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.usdtLeverage < 2">
                        {{scope.row.usdtLeverage}}X
                    </span>
                   <span style="color: orange" v-else-if="scope.row.usdtLeverage < 2.5">
                        {{scope.row.usdtLeverage}}X
                    </span> 
                   <span style="color: red" v-else>
                        <b>{{scope.row.usdtLeverage}}X</b>
                    </span>             
                </template>
            </el-table-column>

            <el-table-column label="BTC杠杆率" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span v-if="scope.row.btcLeverage < 2">
                        {{scope.row.btcLeverage}}X
                    </span>
                   <span style="color: orange" v-else-if="scope.row.btcLeverage < 2.5">
                        {{scope.row.btcLeverage}}X
                    </span> 
                   <span style="color: red" v-else>
                        <b>{{scope.row.btcLeverage}}X</b>
                    </span>             
                </template>
            </el-table-column>

            <el-table-column :label="'资金池-' + subacct.toUpperCase()" min-width="10%" v-bind:key="subacct" align="center" v-for="subacct in subacctPfoAlias">    
                <template slot-scope="scope">
                   <span v-if="scope.row[subacct] < 2">
                        {{scope.row[subacct]}}X
                    </span>
                   <span style="color: orange" v-else-if="scope.row[subacct] < 2.5">
                        {{scope.row[subacct]}}X
                    </span> 
                   <span style="color: red" v-else>
                        <b>{{scope.row[subacct]}}X</b>
                    </span>             
                </template>  
            </el-table-column>

            <el-table-column label="风险系数" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span>
                        {{ scope.row.riskRatio }}
                    </span>          
                </template>   
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
            </el-table-column>
        </el-table>    

        <!--- 监控 --->
        <el-table
        :data="monitorDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">

            <el-table-column label="交易成功率" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span>
                        {{scope.row.totalTradeSuccessRate}}%
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="交易失败率" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span>
                        {{scope.row.totalTradeErrorRate}}%
                    </span>              
                </template>
            </el-table-column>

            <el-table-column label="交易干预率" min-width="10%" align="center">
                <template slot-scope="scope">
                   <span>
                        {{scope.row.totalTradeManualRate}}%
                    </span>              
                </template>
            </el-table-column>

            <el-table-column :label="'组合-'+pfo.toUpperCase()" min-width="10%" v-bind:key="pfo" align="center" v-for="pfo in pfoAlias">    
                <template slot-scope="scope">
                   <span v-if="scope.row[pfo].currentError == 0">
                        <i style="color: lightgreen; font-size:20px;" class="el-icon-success"></i>    
                    </span>
                   <span style="color: red" v-else>
                        {{ scope.row[pfo].currentError }}
                    </span>
                    <span>
                        ({{ scope.row[pfo].successRate }}%)
                    </span>           
                </template>  
            </el-table-column>

            <el-table-column label="程序运行" min-width="10%" align="center">
            </el-table-column>

            <el-table-column label="主机状态" min-width="10%" align="center">
            </el-table-column>
        </el-table>     
    </div>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands} from '@/utils/general'
import moment from 'moment'

export default {
    props: {
        summaryDatas: {
            type:Array,
            default:[]
        },
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
            pfoWalletDatas: null,
            totalBalance: null,
            balanceDatas: [{
                totalBalance: null,
                totalReturn: null,
                day1Diff: null,
                day7Diff: null,
                day30Diff: null,
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
            positionDatas: [{
                totalPosition: null,
                longPosition: null,
                shortPosition: null,
                usdtLongPosition: null,
                usdtShortPosition: null,
                btcLongPosition: null,
                btcShortPosition: null,
            }],

            // 策略
            pfoDatas: null,
            perfDatas: [{
                totalProfit: null,
                totalCount: null,
                winRate: null,
                plRate: null,
                slippage: null,
                totalSty: null,
                usdtSymbol: null,
                btcSymbol: null,
            }],  

            // 风险
            subacctPfoAlias: config.subacctPfoAlias, 
            riskDatas: [{
                riskRatio: null,
                leverage: null,
                usdtLeverage: null,
                btcLeverage: null,
            }],   

            // 监控
            pfoAlias: config.pfoAlias, 
            monitorDatas: [{
                totalTradeSuccessRate: null,
                totalTradeErrorRate: null,
                totalTradeManualRate: null,
                allProcessStatus: null,
                allHostStatus: null,
            }],
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData(){
            this.pfoWalletDatas = this.summaryDatas[0]
            this.subaccountDatas = this.summaryDatas[1]
            this.pfoDatas = this.summaryDatas[2]

            this.parseBalanceData()
            this.parsePositionData()
            this.parsePerfData()
            this.parseRiskData()
            this.parseMonitorData()
        },

        // 分析资产数据
        parseBalanceData(){            
            for(var i = 0; i < this.pfoWalletDatas.length; i++){
                if (this.pfoWalletDatas[i].portfolio.name === config.cryptoParentPfo){
                    // Crypto父pfo
                    var totalBalanceInfo = this.pfoWalletDatas[i].wallet

                    this.balanceDatas[0].totalBalance = parseInt(totalBalanceInfo.usdt_amount)
                    this.balanceDatas[0].totalReturn = (((totalBalanceInfo.usdt_amount/config.initFundUSD) - 1)*100).toFixed(2)

                    this.balanceDatas[0].day1Diff = parseInt(totalBalanceInfo.day_diff)
                    const day7 = moment().subtract(6, 'day').format('YYYY-MM-DD')
                    const day30 = moment().subtract(29, 'day').format('YYYY-MM-DD')
                    this.balanceDatas[0].day7Diff = parseInt(totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[day7])
                    this.balanceDatas[0].day30Diff = parseInt(totalBalanceInfo.usdt_amount - totalBalanceInfo.history_values[day30])
                    
                    this.balanceDatas[0].drawdown = (totalBalanceInfo.drawdown*100).toFixed(2)
                    this.balanceDatas[0].maxDrawdown = (totalBalanceInfo.max_drawdown*100).toFixed(2)
                }        
            }  
            this.totalBalance = this.balanceDatas[0].totalBalance   // 计算总体杠杆率
        },

        // 分析仓位数据
        parsePositionData() {   
            var positionsByCoins = {} 
            this.totalPosition = 0
            this.longPosition = 0
            this.shortPosition = 0 
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
                }
            }
            this.positionDatas[0].totalPosition = parseInt(this.totalPosition)
            this.positionDatas[0].longPosition = parseInt(this.longPosition)
            this.positionDatas[0].shortPosition = parseInt(this.shortPosition)
            this.positionDatas[0].usdtLongPosition = parseInt(positionsByCoins['USD_long'])
            this.positionDatas[0].usdtShortPosition = parseInt(positionsByCoins['USD_short'])
            this.positionDatas[0].btcLongPosition = parseInt(positionsByCoins['BTC_long'])
            this.positionDatas[0].btcShortPosition = parseInt(positionsByCoins['BTC_short'])
        },

        // 分析策略数据
        parsePerfData() {
            var totalProfit = 0
            var totalCount = 0
            var totalWinCount = 0
            var totalWinProfit = 0
            var totalLossProfit = 0

            var usdVolume = 0
            var totalWeightSlippage = 0

            var totalSty = 0
            var usdtSymbol = 0
            var btcSymbol= 0
            for(var i = 0; i < this.pfoDatas.length; i++){
                const data = this.pfoDatas[i][0].performance.data
                totalProfit += data.usd_profit
                totalCount += data.count
                totalWinCount += data.win_count
                totalWinProfit += data.total_win_usd_profit
                totalLossProfit += data.total_loss_usd_profit
                usdVolume += data.usd_volume
                totalWeightSlippage += data.total_weighted_slipage
            }

            this.perfDatas[0].totalProfit = parseInt(totalProfit)
            this.perfDatas[0].totalCount = totalCount
            this.perfDatas[0].winRate = (totalWinCount*100/totalCount).toFixed(2)
            this.perfDatas[0].plRate = ((totalWinProfit/totalWinCount) / (Math.abs(totalLossProfit)/(totalCount - totalWinCount))).toFixed(2)
            this.perfDatas[0].slippage = (totalWeightSlippage*100/usdVolume).toFixed(2)
        },

        // 分析风险数据
        parseRiskData() {
            var positions = {
                'usdt_long': 0, 'usdt_short': 0, 'btc_long': 0, 'btc_short': 0
            }
            var balances = {
                'usdt': 0, 'btc': 0
            }
            for(var i = 0; i < this.subaccountDatas.length; i++){
                var usdt_symbols = true
                var position = 0
                for(let key in this.subaccountDatas[i].positions.summary){
                    var pos = this.subaccountDatas[i].positions.summary[key]
                    positions[key] += pos
                    position += pos
                    if (key.indexOf('btc') != -1){
                        usdt_symbols = false
                    }
                }
                // 区分usdt交易资产和btc交易资产
                if (usdt_symbols){
                    balances.usdt += this.subaccountDatas[i].wallet.usdt_amount
                } else {
                    balances.btc += this.subaccountDatas[i].wallet.usdt_amount
                }

                // 子账户的杠杆率
                const pfo = this.subaccountDatas[i].subaccount.portfolio.alias
                this.riskDatas[0][pfo] = (Math.abs(position)/this.subaccountDatas[i].wallet.usdt_amount).toFixed(2)
            }
            this.riskDatas[0].riskRatio = config.riskRatio
            this.riskDatas[0].leverage = (Math.abs(this.totalPosition)/this.totalBalance).toFixed(2)
            if (balances.usdt > 0){
                this.riskDatas[0].usdtLeverage = (Math.abs(positions['usdt_long'] + positions['usdt_short'])/balances.usdt).toFixed(2)
            }
            if (balances.btc > 0){
                this.riskDatas[0].btcLeverage = (Math.abs(positions['btc_long'] + positions['btc_short'])/balances.btc).toFixed(2)
            }
        },

        parseMonitorData(){
            // 统计sp(trade)
            var totalTrade = 0
            var totalSuccessTrade = 0
            var totalErrorTrade = 0
            var totalManualTrade = 0
            for(var i = 0; i < this.pfoDatas.length; i++){
                const data = this.pfoDatas[i][0].monitor_stats.sp
                totalTrade += data.error + data.success + data.manual + data.warn
                totalSuccessTrade += data.success
                totalErrorTrade += data.error
                totalManualTrade += data.manual

                // Pfo的当前error和历史成功率
                const pfo = this.pfoDatas[i][0].portfolio.alias
                this.monitorDatas[0][pfo]= {
                    currentError: data.current_error,
                    successRate: (data.success_rate*100).toFixed(2)
                }

                // 爬取监控信息

            }

            this.monitorDatas[0].totalTradeSuccessRate = (totalSuccessTrade*100/totalTrade).toFixed(2)
            this.monitorDatas[0].totalTradeErrorRate = (totalErrorTrade*100/totalTrade).toFixed(2)
            this.monitorDatas[0].totalTradeManualRate = (totalManualTrade*100/totalTrade).toFixed(2)
        },

        toThousands: toThousands,
    },
}


</script>