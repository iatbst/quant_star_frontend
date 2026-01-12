<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div class="app-container" align="center" >
        <div style="width: 90%; margin-top: 0px">
            <el-row :gutter="5" type="flex" style="margin-bottom: 10px">
                <!----------------------------------- 最近14周周报选择 --------------------------------------->
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('day', lastDays[6])">{{ lastDays[6] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('day', lastDays[5])">{{ lastDays[5] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('day', lastDays[4])">{{ lastDays[4] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('day', lastDays[3])">{{ lastDays[3] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('day', lastDays[2])">{{ lastDays[2] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('day', lastDays[1])">{{ lastDays[1] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('day', lastDays[0])">{{ lastDays[0] }}</div></el-col>
                <el-col :span="3">
                    <el-select v-model="reportFilter.level" placeholder="类型">
                        <el-option
                        v-for="level in Object.keys(reportLevels)"
                        :key="level"
                        :label="reportLevels[level]"
                        :value="level">
                        </el-option>
                    </el-select>  
                </el-col>
                <el-col :span="3">
                    <el-input
                        v-model="reportFilter.dt_label"
                        placeholder="起始日期:年-月-日"
                    ></el-input>                
                </el-col>
                <el-col :span="3">
                    <el-button style="width: 100%" type="primary" @click="search()">
                        查询
                    </el-button> 
                </el-col>
            </el-row>

            <el-row v-if="reportAvailable" v-loading="reportLoading">
                <!--- 说明 --->
                <h1>
                    {{ chineseString(level + '_report') }}
                </h1>
                <h5 style="font-weight: 500">
                    {{ dt_label }}
                </h5>
            </el-row>

            <!--- Row1 --->
            <el-row :gutter="0" type="flex" style="background: #f2f2f2" v-if="reportAvailable" v-loading="reportLoading">
                <el-table
                :data="row1Datas"
                :header-cell-style="{ background: '#f2f2f2' }"
                style="width: 100%">
                    <el-table-column label="资金变化" min-width="16%" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.balance_diff > 0" style="color: green">
                                <i class="el-icon-top"></i>
                                {{toThousands(scope.row.balance_diff)}}
                            </span>
                            <span style="color: red" v-else>
                                <i class="el-icon-bottom"></i>
                                {{toThousands(scope.row.balance_diff)}}
                            </span>   
                        </template>
                    </el-table-column>

                    <el-table-column label="仓位变化" min-width="16%" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.position_diff > 0" style="color: green">
                                {{toThousands(scope.row.position_diff)}}
                            </span>
                            <span style="color: red" v-else>
                                {{toThousands(scope.row.position_diff)}}
                            </span>              
                        </template>
                    </el-table-column>

                    <el-table-column label="实盘-回测: 资金差变化" min-width="16%" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.balance_lb_diff_diff > 0" style="color: green">
                                {{scope.row.balance_lb_diff_diff}}
                            </span>
                            <span style="color: red" v-else>
                                {{scope.row.balance_lb_diff_diff}}
                            </span>               
                        </template>
                    </el-table-column>

                    <el-table-column label="交易额" min-width="8%" align="center">
                        <template slot-scope="scope">
                            {{toThousands(scope.row.volume)}}           
                        </template>          
                    </el-table-column>

                    <el-table-column label="开仓额" min-width="8%" align="center">
                        <template slot-scope="scope">
                            {{toThousands(scope.row.open_volume)}}           
                        </template>          
                    </el-table-column>

                    <el-table-column label="关仓额" min-width="8%" align="center">
                        <template slot-scope="scope">
                            {{toThousands(scope.row.close_volume)}}           
                        </template>          
                    </el-table-column>

                    <el-table-column label="滑点" min-width="16%" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.slippage_fee > 0" style="color: green">
                                {{scope.row.slippage_fee}}
                            </span>
                            <span style="color: red" v-else>
                                {{scope.row.slippage_fee}}
                            </span> 
                        </template>
                    </el-table-column>

                    <el-table-column label="BTC波动率" min-width="8%" align="center">
                        <template slot-scope="scope">
                            <span style="">
                                {{ (scope.row.btc_atr_ptg*100).toFixed(2) }}%
                            </span>
                        </template>         
                    </el-table-column>
                </el-table>              
            </el-row>

            <!--- Row2 --->
            <el-row :gutter="0" type="flex" style="background: #f2f2f2" v-if="reportAvailable" v-loading="reportLoading">
                <el-table
                :data="row2Datas"
                :header-cell-style="{ background: '#f2f2f2' }"
                style="width: 100%">
                    <el-table-column label="初资金" min-width="8%" align="center">
                        <template slot-scope="scope">
                            {{toThousands(scope.row.balance_start)}}
                        </template>
                    </el-table-column>

                    <el-table-column label="末资金" min-width="8%" align="center">
                        <template slot-scope="scope">
                            {{toThousands(scope.row.balance_end)}}           
                        </template>
                    </el-table-column>

                    <el-table-column label="初仓位" min-width="8%" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.position_start > 0" style="color: green">
                                {{toThousands(scope.row.position_start)}}
                            </span>
                            <span style="color: red" v-else>
                                {{toThousands(scope.row.position_start)}}
                            </span>      
                        </template>
                    </el-table-column>

                    <el-table-column label="末仓位" min-width="8%" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.position_end > 0" style="color: green">
                                {{toThousands(scope.row.position_end)}}
                            </span>
                            <span style="color: red" v-else>
                                {{toThousands(scope.row.position_end)}}
                            </span>            
                        </template>          
                    </el-table-column>

                    <el-table-column label="实盘-回测: 仓位差变化" min-width="16%" align="center">
                        <template slot-scope="scope">
                            {{scope.row.position_lb_diff_diff}}        
                        </template>          
                    </el-table-column>

                    <el-table-column label="交易次" min-width="8%" align="center">
                        <template slot-scope="scope">
                            {{scope.row.count}}           
                        </template>          
                    </el-table-column>

                    <el-table-column label="开仓次" min-width="8%" align="center">
                        <template slot-scope="scope">
                            {{scope.row.open_count}}     
                        </template>
                    </el-table-column>

                    <el-table-column label="关仓次" min-width="8%" align="center">
                        <template slot-scope="scope">
                            {{scope.row.close_count}}   
                        </template>
                    </el-table-column>

                    <el-table-column label="手续费" min-width="8%" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.fee > 0" style="color: green">
                                {{scope.row.fee}}
                            </span>
                            <span style="color: red" v-else>
                                {{scope.row.fee}}
                            </span> 
                        </template>
                    </el-table-column>

                    <el-table-column label="资金费" min-width="8%" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.swap_funding > 0" style="color: green">
                                {{scope.row.swap_funding}}
                            </span>
                            <span style="color: red" v-else>
                                {{scope.row.swap_funding}}
                            </span>  
                        </template>
                    </el-table-column>

                    <el-table-column label="24币平均波动率" min-width="8%" align="center">
                        <template slot-scope="scope">
                            <span style="">
                                {{ (scope.row.symbols_atr_ptg*100).toFixed(2) }}%
                            </span>
                        </template>         
                    </el-table-column>
                </el-table>              
            </el-row>

            <!--- 实盘-回测: 资金曲线对比 -->
            <h4>实盘-回测: 资金曲线</h4>
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 资金曲线差对比 -->
            <h4>实盘-回测: 资金差曲线</h4>
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 仓位曲线对比 -->
            <h4>实盘-回测: 仓位曲线</h4>
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
                    style="margin-bottom: 20px">
                    </exchange-value-lines>

                    </div>
                </el-col>
            </el-row>

            <!--- 实盘-回测: 仓位曲线差对比 -->
            <h4>实盘-回测: 仓位差曲线</h4>
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
                    v-if="reportAvailable" 
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
            level: null,
            dt_label: null,

            reportLevels: {
                'day': '日报',
                'month': '月报'
            },

            lastDays: [],
            reportLoading: false,

            reportFilter: {
                'level': null,
                'dt_label': null
            },

            report: null,
            reportAvailable: false,
            
            row1Datas: [{
                balance_diff: null,
                position_diff: null,
                balance_lb_diff_diff: null,
                volume: null,
                open_volume: null,
                close_volume: null,
                slippage_fee: null,
                btc_atr_ptg: null
            }],

            row2Datas: [{
                balance_start: null,
                balance_end: null,
                position_start: null,
                position_end: null,
                position_lb_diff_diff: null,
                count: null,
                open_count: null,
                close_count: null,
                fee: null,
                swap_funding: null,
                symbols_atr_ptg: null
            }],

            // 记录不同平台实盘资产曲线
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

            // 记录不同平台回测资产曲线
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

            // 记录不同平台回测资产曲线
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

            // 记录不同平台回测资产曲线
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

            // 记录不同平台实盘仓位曲线
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

            // 记录不同平台回测资产曲线
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

        
        }
    },

    created(){
        // 初始化lastDays
        for (let offset = 1; offset <= 8; offset++) {
            this.lastDays.push(moment(new Date()).subtract(offset,'days').format('YYYY-MM-DD'))
        }

        this.search()
    },

    methods: {
        search(){
            // 默认展示上个周度报告
            if (this.reportFilter.level == null){
                this.reportFilter.level = 'day'
            }
            if (this.reportFilter.dt_label == null){
                // 获取昨日日期: %Y-%m-%d
                var offset = 1
                this.reportFilter.dt_label = moment(new Date()).subtract(offset,'days').format('YYYY-MM-DD')
            }

            this.choose(this.reportFilter.level, this.reportFilter.dt_label)
        },

        choose(level, dt_label){
            var filters = 'level=' + level + '&dt_label=' + dt_label
            this.reportLoading = true
            getReport(this.config.masterHost, null, filters).then(response => {
                if (response.results.length == 0){
                    alert(this.reportLevels[level] + ':' + dt_label + '不存在.')
                    this.reportLoading = false
                    return
                }
                this.level = level
                this.dt_label = dt_label
                this.report = response.results[0]
                this.reportAvailable = true
                // debugger

                // 准备Row1数据
                this.row1Datas[0].balance_diff = this.report.balances.balance_diff
                this.row1Datas[0].position_diff = this.report.positions.position_diff
                this.row1Datas[0].balance_lb_diff_diff = Math.round(this.report.balances.balance_lb_diff_diff)
                this.row1Datas[0].volume = Math.round(this.report.orders.volume)
                this.row1Datas[0].open_volume = Math.round(this.report.orders.open_volume)
                this.row1Datas[0].close_volume = Math.round(this.report.orders.close_volume)
                this.row1Datas[0].slippage_fee = Math.round(this.report.fees.slippage_fee)
                this.row1Datas[0].btc_atr_ptg = this.report.markets.btc_atr_ptg

                // 准备Row2数据
                this.row2Datas[0].balance_start = Math.round(this.report.balances.balance_start)
                this.row2Datas[0].balance_end = Math.round(this.report.balances.balance_end)
                this.row2Datas[0].position_start = Math.round(this.report.positions.position_start)
                this.row2Datas[0].position_end = Math.round(this.report.positions.position_end)
                this.row2Datas[0].position_lb_diff_diff = Math.round(this.report.positions.position_lb_diff_diff)
                this.row2Datas[0].count = this.report.orders.count
                this.row2Datas[0].open_count = this.report.orders.open_count
                this.row2Datas[0].close_count = this.report.orders.close_count
                this.row2Datas[0].fee = Math.round(this.report.fees.fee)
                this.row2Datas[0].swap_funding = Math.round(this.report.fees.swap_funding)
                this.row2Datas[0].symbols_atr_ptg = this.report.markets.symbols_atr_ptg

                // 准备实盘-回测: 资金曲线对比
                for(let exchange in this.balanceLiveLines){
                    this.balanceLiveLines[exchange].data = this.report.history.balance_live[exchange]
                }
                for(let exchange in this.balanceBtLines){
                    this.balanceBtLines[exchange].data = this.report.history.balance_bt[exchange]
                }

                // 准备实盘-回测: 资金曲线差对比
                for(let exchange in this.balanceDiffLines){
                    this.balanceDiffLines[exchange].data = this.report.history.balance_diff[exchange]
                }

                // 准备实盘-回测: 仓位曲线对比
                for(let exchange in this.positionLiveLines){
                    this.positionLiveLines[exchange].data = this.report.history.position_live[exchange]
                }
                for(let exchange in this.positionBtLines){
                    this.positionBtLines[exchange].data = this.report.history.position_bt[exchange]
                }

                // 准备实盘-回测: 仓位曲线差对比
                for(let exchange in this.positionDiffLines){
                    this.positionDiffLines[exchange].data = this.report.history.position_diff[exchange]
                }

                this.reportLoading = false
            })
        },

        

        // 获取之前的monday日期
        getLastMonday(date, offset=0) {
            var day = date.getDay() || 7
            date.setHours(-24 * (day - 1) - 24 * 7 * offset)
            var dateStr = date.toLocaleDateString("en-GB").split('/')
            return dateStr[2] + '-' + dateStr[1] + '-' + dateStr[0]
        },

        utcToLocalTimestamp: utcToLocalTimestamp,
        toThousands: toThousands,
        chineseString: chineseString,
        chineseStrategyID: chineseStrategyID,
        toFixed: toFixed,
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