<template>
    <!--- 表3: 今日数据 --->
    <el-table
    :data="todayDatas"
    :header-cell-style="{ background: '#f2f2f2' }"
    v-loading="todayDatasLoading"
    style="width: 100%">

        <el-table-column label="策略/交易所" min-width="10%" align="center">
            <template slot-scope="scope">
                {{ scope.row.name }}
            </template>
        </el-table-column>

        <el-table-column label="初始仓位(k)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.initPosition > 0" style="color: green">
                    {{toThousands(Math.round(scope.row.initPosition/1000))}}
                </span>
                <span v-else style="color: red">
                    {{toThousands(Math.round(scope.row.initPosition/1000))}}
                </span>              
            </template>
        </el-table-column>

        <el-table-column label="实时仓位(k)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.position > 0" style="color: green">
                    {{toThousands(Math.round(scope.row.position/1000))}}
                </span>
                <span v-else style="color: red">
                    {{toThousands(Math.round(scope.row.position/1000))}}
                </span>              
            </template>
        </el-table-column>

        <el-table-column label="开仓额(k)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.longOpen > 0 && scope.row.shortOpen > 0">
                    <span style="color: green">{{toThousands(Math.round(scope.row.longOpen/1000))}}</span>&nbsp&nbsp|&nbsp&nbsp
                    <span style="color: red">{{toThousands(Math.round(scope.row.shortOpen/1000))}}</span>
                </span>
                <span v-else-if="scope.row.longOpen > 0" style="color: green">
                    {{toThousands(Math.round(scope.row.longOpen/1000))}}
                </span>    
                <span v-else-if="scope.row.shortOpen > 0" style="color: red">
                    {{toThousands(Math.round(scope.row.shortOpen/1000))}}
                </span>
                <span v-else-if="scope.row.longOpen != null" style="color: green">
                    {{0}}
                </span>
                <span v-else-if="scope.row.shortOpen != null" style="color: red">
                    {{0}}
                </span>     
                <span v-else>
                    /
                </span>    
            </template>
        </el-table-column>

        <el-table-column label="反转额(k)" min-width="10%" align="center">
            <template slot-scope="scope">  
                <span v-if="scope.row.longFlip > 0 && scope.row.shortFlip > 0">
                    <span style="color: green">{{toThousands(Math.round(scope.row.longFlip/1000))}}</span>&nbsp&nbsp|&nbsp&nbsp
                    <span style="color: red">{{toThousands(Math.round(scope.row.shortFlip/1000))}}</span>
                </span>
                <span v-else-if="scope.row.longFlip > 0" style="color: green">
                    {{toThousands(Math.round(scope.row.longFlip/1000))}}
                </span>    
                <span v-else-if="scope.row.shortFlip > 0" style="color: red">
                    {{toThousands(Math.round(scope.row.shortFlip/1000))}}
                </span>
                <span v-else-if="scope.row.longFlip != null" style="color: green">
                    {{0}}
                </span>
                <span v-else-if="scope.row.shortFlip != null" style="color: red">
                    {{0}}
                </span>     
                <span v-else>
                    /
                </span>     
            </template>
        </el-table-column>

        <el-table-column label="定时额(k)" min-width="10%" align="center">
            <template slot-scope="scope"> 
                <span v-if="scope.row.longTimer > 0 && scope.row.shortTimer > 0">
                    <span style="color: green">{{toThousands(Math.round(scope.row.longTimer/1000))}}</span>&nbsp&nbsp|&nbsp&nbsp
                    <span style="color: red">{{toThousands(Math.round(scope.row.shortTimer/1000))}}</span>
                </span>
                <span v-else-if="scope.row.longTimer > 0" style="color: green">
                    {{toThousands(Math.round(scope.row.longTimer/1000))}}
                </span>    
                <span v-else-if="scope.row.shortTimer > 0" style="color: red">
                    {{toThousands(Math.round(scope.row.shortTimer/1000))}}
                </span>
                <span v-else-if="scope.row.longTimer != null" style="color: green">
                    {{0}}
                </span>
                <span v-else-if="scope.row.shortTimer != null" style="color: red">
                    {{0}}
                </span>     
                <span v-else>
                    /
                </span>   
            </template>
        </el-table-column>

        <el-table-column label="止盈额(k)" min-width="10%" align="center">
            <template slot-scope="scope">  
                <span v-if="scope.row.longWinStop > 0 && scope.row.shortWinStop > 0">
                    <span style="color: green">{{toThousands(Math.round(scope.row.longWinStop/1000))}}</span>&nbsp&nbsp|&nbsp&nbsp
                    <span style="color: red">{{toThousands(Math.round(scope.row.shortWinStop/1000))}}</span>
                </span>
                <span v-else-if="scope.row.longWinStop > 0" style="color: green">
                    {{toThousands(Math.round(scope.row.longWinStop/1000))}}
                </span>    
                <span v-else-if="scope.row.shortWinStop > 0" style="color: red">
                    {{toThousands(Math.round(scope.row.shortWinStop/1000))}}
                </span>
                <span v-else-if="scope.row.longWinStop != null" style="color: green">
                    {{0}}
                </span>
                <span v-else-if="scope.row.shortWinStop != null" style="color: red">
                    {{0}}
                </span>     
                <span v-else>
                    /
                </span>        
            </template>
        </el-table-column>

        <el-table-column label="盈亏" min-width="10%" align="center">
            <template slot-scope="scope"> 
                <span v-if="scope.row.pnl >= 0" style="color: green">
                    {{ toThousands(Math.round(scope.row.pnl)) }}
                </span>
                <span v-else style="color: red">
                    {{ toThousands(Math.round(scope.row.pnl)) }}
                </span>          
            </template>
        </el-table-column> 

        <el-table-column label="滑点" min-width="10%" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.slippage !== null">
                    <span v-if="scope.row.slippage >= 0" style="color: green">
                        {{ (scope.row.slippage*100).toFixed(3) }}% 
                    </span>
                    <span v-else style="color: red">
                        {{ (scope.row.slippage*100).toFixed(3) }}% 
                    </span>                    
                </span>          
            </template>
        </el-table-column>

        <el-table-column label="手续费" min-width="10%" align="center">
            <template slot-scope="scope">
                {{ Math.round(scope.row.fee) }}            
            </template>
        </el-table-column>

        <el-table-column label="资金费" min-width="10%" align="center">
            <template slot-scope="scope">  
                <span v-if="scope.row.fundingFees !== null">
                    <span v-if="scope.row.fundingFees >= 0" style="color: green">
                        {{ Math.round(scope.row.fundingFees) }}
                    </span>
                    <span v-else style="color: red">
                        {{ Math.round(scope.row.fundingFees) }} 
                    </span>                    
                </span> 
                <span v-else>
                    /
                </span>

            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands, getAnnualReturn, getMaxDrawdown} from '@/utils/general'
import moment from 'moment'

export default {
    props: {
        parentPfoPositions: {
            type:Object,
            default:{}
        },
        parentPfoPositionsHistory: {
            type:Object,
            default:{}
        },
        todayOrders: {
            type:Array,
            default:[]
        },
        todayStrategyPnl: {
            type:Object,
            default:{}
        },
        todayExchangePnl: {
            type:Object,
            default:{}
        },        
        todayFundingFees: {
            type:Array,
            default:[]
        }             
    },

    watch: {
        parentPfoPositions: {
            handler(val, oldVal){
                this.parseParentPfoPositions()
            },
            deep: true
        },

        todayOrders: {
            handler(val, oldVal){
                this.parseTodayOrders()
            },
            deep: true
        },

        todayStrategyPnl: {
            handler(val, oldVal){
                this.parseTodayPnl()
            },
            deep: true
        },

        todayFundingFees: {
            handler(val, oldVal){
                this.parseTodayFundingFees()
            },
            deep: true
        },
    },

    data() {
        return {
            // 今日分类数据
            todayDatas: [],
            todayDatasLoading: true,
            exchanges: [
                'binance',
                'okex',
                'bybit',
                'bitget'
            ],
            keys: [
                'trendline_break',
                'plunge_back',
                'rsi_mini',
                'boll_mini',
                'long_short_ratio',
                'binance',
                'okex',
                'bybit',
                'bitget',                
                'all'
            ],
            todayObj: {
                'trendline_break': {
                    name: 'T',
                    initPosition: null,
                    position: null,
                    fundingFees: null
                },
                'plunge_back': {
                    name: 'B',
                    initPosition: null,
                    position: null,
                    fundingFees: null
                },
                 'rsi_mini': {
                    name: 'RSI',
                    initPosition: null,
                    position: null,
                    fundingFees: null
                }, 
                'boll_mini': {
                    name: 'BOLL',
                    initPosition: null,
                    position: null,
                    fundingFees: null
                }, 
                'long_short_ratio': {
                    name: 'LR',
                    initPosition: null,
                    position: null,
                    fundingFees: null
                },                              
                'binance': {
                    name: 'Binance',
                    initPosition: null,
                    position: null,
                    fundingFees: 0
                },
                'okex': {
                    name: 'Okex',
                    initPosition: null,
                    position: null,
                    fundingFees: 0
                },
                'bybit': {
                    name: 'Bybit',
                    initPosition: null,
                    position: null,
                    fundingFees: 0
                },              
                'bitget': {
                    name: 'Bitget',
                    initPosition: 0,
                    position: 0,
                    fundingFees: 0
                },                           
                'all': {
                    name: '合计',
                    initPosition: 0,
                    position: 0,
                    fundingFees: 0
                }
            }
        }
    },

    created() {
        // 分析1
        this.parseParentPfoPositions()

        // 分析2
        this.parseTodayOrders()

        // 分析3
        this.parseTodayPnl()

        // 分析4
        this.parseTodayFundingFees()

        // 加入list
        for (let key of this.keys){
            this.todayDatas.push(this.todayObj[key])
        }

        this.todayDatasLoading = false
    },

    methods: { 
        initTodayOrders(){
            for(let key in this.todayObj){
                this.todayObj[key].longOpen = 0
                this.todayObj[key].shortOpen = 0
                this.todayObj[key].longFlip = 0
                this.todayObj[key].shortFlip = 0    
                this.todayObj[key].longTimer = 0
                this.todayObj[key].shortTimer = 0 
                this.todayObj[key].longWinStop = 0
                this.todayObj[key].shortWinStop = 0 
                this.todayObj[key].volume = 0
                this.todayObj[key].slippage = null 
                this.todayObj[key].slippageSum = 0      
                this.todayObj[key].fee = 0  

                // 特例
                if (key == 'trendline_break'){
                    this.todayObj[key].longWinStop = null
                    this.todayObj[key].longTimer = null     
                    this.todayObj[key].shortTimer = null                     
                } else if (key == 'plunge_back') {
                    this.todayObj[key].shortOpen = null
                    this.todayObj[key].longFlip = null
                    this.todayObj[key].shortFlip = null  
                    this.todayObj[key].shortWinStop = null  
                    this.todayObj[key].shortTimer = null                                 
                } else if (key == 'rsi_mini') {
                    this.todayObj[key].shortOpen = null
                    this.todayObj[key].shortFlip = null   
                    this.todayObj[key].longTimer = null     
                    this.todayObj[key].shortTimer = null
                    this.todayObj[key].longWinStop = null
                    this.todayObj[key].shortWinStop = null                   
                } else if (key == 'boll_mini') {
                    this.todayObj[key].shortOpen = null
                    this.todayObj[key].shortFlip = null   
                    this.todayObj[key].longTimer = null     
                    this.todayObj[key].shortTimer = null
                    this.todayObj[key].longWinStop = null
                    this.todayObj[key].shortWinStop = null                   
                } else if (key == 'long_short_ratio') {
                    this.todayObj[key].longOpen = null
                    this.todayObj[key].longFlip = null   
                    this.todayObj[key].longTimer = null     
                    this.todayObj[key].shortTimer = null
                    this.todayObj[key].longWinStop = null
                    this.todayObj[key].shortWinStop = null                    
                }
            }
        },

        // 根据todayStrategyPnl/todayExchangePnl分析
        parseTodayPnl(){
            this.todayObj.all.pnl = 0
            for(let sty in this.todayStrategyPnl){
                this.todayObj[sty].pnl = this.todayStrategyPnl[sty]
                this.todayObj.all.pnl += this.todayStrategyPnl[sty]
            }
            for(let exchange in this.todayExchangePnl){
                this.todayObj[exchange].pnl = this.todayExchangePnl[exchange]
            }
            // alert('parseTodayStrategyPnl')
        },

        // 根据todayFundingFees分析
        parseTodayFundingFees(){
            this.todayObj.all.fundingFees = 0
            for(let exchange of this.exchanges){
                this.todayObj[exchange].fundingFees = 0
            }
            for(let fee of this.todayFundingFees){
                var exchange = fee.exchange_name
                this.todayObj[exchange].fundingFees += fee.amount
                this.todayObj.all.fundingFees += fee.amount
            }
        },

        // 根据parentPfoData分析
        parseParentPfoPositions(){  
            // 仓位数据(初始/此刻)
            for(let label in this.parentPfoPositions){
                if (label in this.todayObj){
                    var positionData = this.parentPfoPositions[label]
                    this.todayObj[label].position = Math.round(positionData.long + positionData.short)
                }
            }
            var ep = Math.round(Date.now()/1000)
            var yesterday = new Date((ep - 86400 + 3600*8)*1000).toISOString().slice(0, 10).replace('T', ' ')   // Beijing
            for(let label in this.parentPfoPositionsHistory){
                if (label in this.todayObj){
                    var positionHistoryData = this.parentPfoPositionsHistory[label]
                    if(yesterday in positionHistoryData){
                        this.todayObj[label].initPosition = Math.round(positionHistoryData[yesterday].long + positionHistoryData[yesterday].short)
                    }
                }
            }
            // alert(JSON.stringify(this.todayStrategyPnl))
            // console.log(JSON.stringify(this.todayStrategyPnl))
        },

        // 根据todayOrders分析
        parseTodayOrders(){
            this.initTodayOrders()

            for(let order of this.todayOrders){
                var sty = order.worker.strategy_name.replaceAll('-', '_')
                var exchange = order.worker.name.split('_')[0]

                // 交易额
                if (order.volume !== null){
                    if (order.order_type == 'open'){
                        // 开仓
                        if(order.side == 'buy'){
                            this.todayObj[sty].longOpen += order.volume
                            this.todayObj[exchange].longOpen += order.volume
                            this.todayObj.all.longOpen += order.volume
                        } else {
                            this.todayObj[sty].shortOpen += order.volume
                            this.todayObj[exchange].shortOpen += order.volume
                            this.todayObj.all.shortOpen += order.volume
                        }
                    } else {
                        // 关仓
                        if(order.order_type == 'flip' || order.order_type == 'lose_stop'){  // 止损暂时也算做flip
                            if(order.side == 'buy'){
                                this.todayObj[sty].shortFlip += order.volume
                                this.todayObj[exchange].shortFlip += order.volume
                                this.todayObj.all.shortFlip += order.volume
                            } else {
                                this.todayObj[sty].longFlip += order.volume
                                this.todayObj[exchange].longFlip += order.volume
                                this.todayObj.all.longFlip += order.volume
                            }
                        } else if(order.order_type == 'timer'){
                            if(order.side == 'buy'){
                                this.todayObj[sty].shortTimer += order.volume
                                this.todayObj[exchange].shortTimer += order.volume
                                this.todayObj.all.shortTimer += order.volume
                            } else {
                                this.todayObj[sty].longTimer += order.volume
                                this.todayObj[exchange].longTimer += order.volume
                                this.todayObj.all.longTimer += order.volume
                            }
                        } else if(order.order_type == 'win_stop'){
                            if(order.side == 'buy'){
                                this.todayObj[sty].shortWinStop += order.volume
                                this.todayObj[exchange].shortWinStop += order.volume
                                this.todayObj.all.shortWinStop += order.volume
                            } else {
                                this.todayObj[sty].longWinStop += order.volume
                                this.todayObj[exchange].longWinStop += order.volume
                                this.todayObj.all.longWinStop += order.volume
                            }                      
                        }
                    }
                }

                // 滑点
                if (order.slippage !== null && order.volume !== null){
                    this.todayObj[sty].slippageSum += order.slippage*order.volume
                    this.todayObj[exchange].slippageSum += order.slippage*order.volume
                    this.todayObj.all.slippageSum += order.slippage*order.volume
                    this.todayObj[sty].volume += order.volume
                    this.todayObj[exchange].volume += order.volume
                    this.todayObj.all.volume += order.volume
                }

                // 手续费
                if (order.fee !== null){
                    this.todayObj[sty].fee += order.fee
                    this.todayObj[exchange].fee += order.fee
                    this.todayObj.all.fee += order.fee
                }
            }

            // 滑点汇总
            for(let label in this.todayObj){
                if (this.todayObj[label].volume > 0){
                    this.todayObj[label].slippage = this.todayObj[label].slippageSum/this.todayObj[label].volume
                }
            }
        },

        toThousands: toThousands,
    },
}


</script>