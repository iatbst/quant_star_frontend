<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div class="app-container" align="center" >
        <div style="width: 90%; margin-top: 0px">
            <!--- 实盘-回测: 仓位曲线对比 -->
            <h4>仓位</h4>
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
                <!-- Binance -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.binance.name,
                            data: positionLiveLines.binance.data,
                        },
                        {
                            title: positionBtLines.binance.name,
                            data: positionBtLines.binance.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Okex -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.okex.name,
                            data: positionLiveLines.okex.data,
                        },
                        {
                            title: positionBtLines.okex.name,
                            data: positionBtLines.okex.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bybit -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.bybit.name,
                            data: positionLiveLines.bybit.data,
                        },
                        {
                            title: positionBtLines.bybit.name,
                            data: positionBtLines.bybit.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bitget -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionLiveLines.bitget.name,
                            data: positionLiveLines.bitget.data,
                        },
                        {
                            title: positionBtLines.bitget.name,
                            data: positionBtLines.bitget.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 仓位曲线差对比 -->
            <h4>仓位差</h4>
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
                <!-- Binance -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionDiffLines.binance.name,
                            data: positionDiffLines.binance.data,
                        }
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Okex -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionDiffLines.okex.name,
                            data: positionDiffLines.okex.data,
                        }
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bybit -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionDiffLines.bybit.name,
                            data: positionDiffLines.bybit.data,
                        }
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bitget -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: positionDiffLines.bitget.name,
                            data: positionDiffLines.bitget.data,
                        }
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 资金曲线对比 -->
            <h4>资金</h4>
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
                <!-- Binance -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.binance.name,
                            data: balanceLiveLines.binance.data,
                        },
                        {
                            title: balanceBtLines.binance.name,
                            data: balanceBtLines.binance.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Okex -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.okex.name,
                            data: balanceLiveLines.okex.data,
                        },
                        {
                            title: balanceBtLines.okex.name,
                            data: balanceBtLines.okex.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bybit -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.bybit.name,
                            data: balanceLiveLines.bybit.data,
                        },
                        {
                            title: balanceBtLines.bybit.name,
                            data: balanceBtLines.bybit.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bitget -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceLiveLines.bitget.name,
                            data: balanceLiveLines.bitget.data,
                        },
                        {
                            title: balanceBtLines.bitget.name,
                            data: balanceBtLines.bitget.data,
                            color: 'lightgray'
                        },
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 资金曲线差对比 -->
            <h4>资金差</h4>
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 20px">
                <!-- Binance -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceDiffLines.binance.name,
                            data: balanceDiffLines.binance.data,
                        }
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Okex -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceDiffLines.okex.name,
                            data: balanceDiffLines.okex.data,
                        }
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bybit -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceDiffLines.bybit.name,
                            data: balanceDiffLines.bybit.data,
                        }
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>

                <!-- Bitget -->
                <el-col :span="6" align="center">
                    <div style="margin-bottom: 20px; width: 100%">
                    <exchange-value-lines
                    v-bind:values="
                    [
                        {
                            title: balanceDiffLines.bitget.name,
                            data: balanceDiffLines.bitget.data,
                        }
                    ]
                    "
                    v-if="backtestDataAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import tradeOrders from '@/views/orders/_trade_orders'
import valueLine from '@/views/balance/_value_line'
import config from '@/configs/system_configs'
import { utcToLocalTimestamp } from '@/utils/general'
import {toThousands} from '@/utils/general'
import { chineseString, chineseStrategyID } from '@/utils/chinese'
import { toFixed } from  '@/utils/general'
import { getReport } from '@/api/report'
import { getPortfolioByName } from '@/api/portfolio'
import { getTradeById } from '@/api/trade'
import {Chart} from 'highcharts-vue'
import { exchangeColors } from '@/utils/chart'
import moment from 'moment'
import exchangeValueLines from '@/views/report/exchange_valuelines'
import { getPortfolioDatas, getPortfolioDataByName } from '@/api/portfolio' 


export default {
    components: {
        tradeOrders,
        valueLine,
        highcharts: Chart,
        exchangeValueLines
    },

    watch: {

    },

    data() {
        return {
            backtestDataAvailable: false,
            

            // 平台实盘资产曲线
            balanceLiveLines: {
                'binance': {
                    'name': 'Binance实盘',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex实盘',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit实盘',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget实盘',
                    'data': null
                },                                           
            },

            // 平台回测资产曲线
            balanceBtLines: {
                'binance': {
                    'name': 'Binance回测',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex回测',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit回测',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget回测',
                    'data': null
                },                                           
            },

            // 平台资产差曲线
            balanceDiffLines: {
                'binance': {
                    'name': 'Binance',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget',
                    'data': null
                },                                           
            },

            // 平台仓位差曲线
            positionDiffLines: {
                'binance': {
                    'name': 'Binance',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget',
                    'data': null
                },                                           
            },

            // 平台实盘仓位曲线
            positionLiveLines: {
                'binance': {
                    'name': 'Binance实盘',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex实盘',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit实盘',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget实盘',
                    'data': null
                },                                           
            },

            // 平台回测仓位曲线
            positionBtLines: {
                'binance': {
                    'name': 'Binance回测',
                    'data': null
                },  
                'okex': {
                    'name': 'Okex回测',
                    'data': null
                },
                'bybit': {
                    'name': 'Bybit回测',
                    'data': null
                },
                'bitget': {
                    'name': 'Bitget回测',
                    'data': null
                },                                           
            },

            strategyAlias: config.strategyAlias, 
            config: config,
            pfoHosts: config.pfoHosts,
            dataRefresh: null,
            refreshInterval: 60000,
            refreshIntervalId: null,

        
        }
    },

    created(){
        this.parseDatas()
        this.refresh()
    },

    methods: {
        parseDatas(){
            this.dataRefresh = new Date()
            getPortfolioDataByName(config.cryptoParentPfo, config.masterHost, 'backtest_hour_history').then(response => {
                var historyData = response.results[0].backtest_hour_history
    

                // 准备实盘-回测: 资金曲线对比
                for(let exchange in this.balanceLiveLines){
                    this.balanceLiveLines[exchange].data = historyData.balances.balance_live[exchange]
                }
                for(let exchange in this.balanceBtLines){
                    this.balanceBtLines[exchange].data = historyData.balances.balance_bt[exchange]
                }

                // 准备实盘-回测: 资金曲线差对比
                for(let exchange in this.balanceDiffLines){
                    this.balanceDiffLines[exchange].data = historyData.balances.balance_diff[exchange]
                }

                // 准备实盘-回测: 仓位曲线对比
                for(let exchange in this.positionLiveLines){
                    this.positionLiveLines[exchange].data = historyData.positions.position_live[exchange]
                }
                for(let exchange in this.positionBtLines){
                    this.positionBtLines[exchange].data = historyData.positions.position_bt[exchange]
                }

                // 准备实盘-回测: 仓位曲线差对比
                for(let exchange in this.positionDiffLines){
                    this.positionDiffLines[exchange].data = historyData.positions.position_diff[exchange]
                }

                this.backtestDataAvailable = true
            })
        },

        // 定时刷新数据函数
        refresh() {
            // 计时器正在进行中，退出函数
            if (this.refreshIntervalId != null) {
                return;
            }

            // 计时器为空，操作
            this.refreshIntervalId = setInterval(() => {
                var now = new Date();
                // var hour = now.getHours()
                // var minute = now.getMinutes()
                // var second = now.getSeconds()
                // var date = now.getDate()

                console.log("刷新检查:" + now);
                // 资产表格
                if(now - this.dataRefresh > 300*1000){
                    console.log(now + ': 数据刷新.');
                    this.parseDatas()
                }
                
            }, this.refreshInterval);
        }, 

        // 停止定时器
        clear() {
            clearInterval(this.refreshIntervalId); //清除计时器
            this.refreshIntervalId = null; //设置为null
        },
    },

    destroyed(){
        // 在页面销毁后，清除计时器
        this.clear();
    }
}
</script>

<style>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-2024 {
    background: #d3dce6;
  }
  .bg-2025 {
    background: lightpink;
  }
  .bg-2026 {
    background: lightblue;
  }
  .bg-week {
    background: #f2f2f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    display:flex;
    align-items:center;
    justify-content: center;
    cursor: pointer;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>