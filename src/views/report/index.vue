<!-- 
    模板: 展示worker的所有sp和对应的orders
-->
<template>
    <div class="app-container" align="center" >
        <div style="width: 90%; margin-top: 0px">
            <el-row :gutter="5" type="flex" style="margin-bottom: 10px">
                <!----------------------------------- 2024 年/季/月报选择 --------------------------------------->
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('year', '2024-01-01')">2024</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" ></div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('quarter', '2024-04-01')">2024-S2</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('quarter', '2024-07-01')">2024-S3</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('quarter', '2024-10-01')">2024-S4</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" ></div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" ></div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-03-01')">2024-M3</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-04-01')">2024-M4</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-05-01')">2024-M5</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-06-01')">2024-M6</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-07-01')">2024-M7</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-08-01')">2024-M8</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-09-01')">2024-M9</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-10-01')">2024-M10</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-11-01')">2024-M11</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2024" @click="choose('month', '2024-12-01')">2024-M12</div></el-col>
            </el-row>
            <el-row :gutter="5" type="flex" style="margin-bottom: 10px">
                <!----------------------------------- 2025 年/季/月报选择 --------------------------------------->
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('year', '2025-01-01')">2025</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('quarter', '2025-01-01')">2025-S1</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('quarter', '2025-04-01')">2025-S2</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('quarter', '2025-07-01')">2025-S3</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('quarter', '2025-10-01')">2025-S4</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-01-01')">2025-M1</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-02-01')">2025-M2</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-03-01')">2025-M3</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-04-01')">2025-M4</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-05-01')">2025-M5</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-06-01')">2025-M6</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-07-01')">2025-M7</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-08-01')">2025-M8</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-09-01')">2025-M9</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-10-01')">2025-M10</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-11-01')">2025-M11</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2025" @click="choose('month', '2025-12-01')">2025-M12</div></el-col>
            </el-row>
            <el-row :gutter="5" type="flex" style="margin-bottom: 10px">
                <!----------------------------------- 2026 年/季/月报选择 --------------------------------------->
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('year', '2026-01-01')">2026</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('quarter', '2026-01-01')">2026-S1</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('quarter', '2026-04-01')">2026-S2</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('quarter', '2026-07-01')">2026-S3</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('quarter', '2026-10-01')">2026-S4</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-01-01')">2026-M1</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-02-01')">2026-M2</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-03-01')">2026-M3</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-04-01')">2026-M4</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-05-01')">2026-M5</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-06-01')">2026-M6</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-07-01')">2026-M7</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-08-01')">2026-M8</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-09-01')">2026-M9</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-10-01')">2026-M10</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-11-01')">2026-M11</div></el-col>
                <el-col :span="3"><div class="grid-content bg-2026" @click="choose('month', '2026-12-01')">2026-M12</div></el-col>
            </el-row>
            <el-row :gutter="5" type="flex" style="margin-bottom: 10px">
                <!----------------------------------- 最近14周周报选择 --------------------------------------->
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[13])">{{ lastWeeks[13] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[12])">{{ lastWeeks[12] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[11])">{{ lastWeeks[11] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[10])">{{ lastWeeks[10] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[9])">{{ lastWeeks[9] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[8])">{{ lastWeeks[8] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[7])">{{ lastWeeks[7] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[6])">{{ lastWeeks[6] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[5])">{{ lastWeeks[5] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[4])">{{ lastWeeks[4] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[3])">{{ lastWeeks[3] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[2])">{{ lastWeeks[2] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[1])">{{ lastWeeks[1] }}</div></el-col>
                <el-col :span="3"><div class="grid-content bg-week" @click="choose('week', lastWeeks[0])">{{ lastWeeks[0] }}</div></el-col>
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
                    {{ chineseString(level) }}
                </h1>
                <h5 style="font-weight: 500">
                    {{ dt_label }}
                </h5>
            </el-row>

            <!--- 资产变化 --->
            <el-row :gutter="0" type="flex" style="background: #f2f2f2" v-if="reportAvailable" v-loading="reportLoading">
                <el-col :span="3">
                    <h3>
                        初
                    </h3>
                </el-col>
                <el-col :span="6">
                    <h3>
                        {{ toThousands(beginValue) }}
                    </h3>
                </el-col>
                <el-col :span="6">
                    <h3 style="color: green" v-if="valueChange >= 0">
                        <i class="el-icon-top"></i>{{ (valueChange*100).toFixed(2)}}%
                    </h3>
                    <h3 style="color: red" v-else>
                        <i class="el-icon-bottom"></i>{{ (valueChange*100).toFixed(2)}}%
                    </h3>
                </el-col>
                <el-col :span="6">
                    <h3>
                        {{ toThousands(endValue) }}
                    </h3>
                </el-col>
                <el-col :span="3">
                    <h3>
                        末
                    </h3>
                </el-col>                  
            </el-row>

            <!--- 资产曲线 --->
            <el-row :gutter="0" type="flex"  style="background-color: white; margin-bottom: 20px" v-if="reportAvailable" v-loading="reportLoading">
                <el-col :span="24" align="center">
                    <div style="margin-bottom: 20px;">
                        <value-line 
                        v-bind:values="report.value_line" 
                        v-bind:title="'日资产曲线'"
                        v-bind:range="'all'"
                        v-bind:showRange="false">
                        </value-line>
                    </div>
                </el-col>
            </el-row>

            <!--- 策略收益表格 --->
            <el-row :gutter="0" type="flex" v-if="reportAvailable" v-loading="reportLoading">
                <el-table
                :data="report.strategy_pnls.rows"
                :header-cell-style="{ background: '#f2f2f2' }"
                >
                    <template v-for="col in [''].concat(report.strategy_pnls.col_header)">
                        <el-table-column align="center" :label="getStrategyCol(col)">
                            <template slot-scope="scope">
                                <div v-if="col == ''">
                                    {{ chineseString(scope.row.row_head) }}
                                </div>
                                <div v-else>
                                    <span style="color: red" v-if="scope.row[col] < 0">
                                        {{ formatStrategyPnls(scope.row.row_head, scope.row[col]) }}
                                    </span>
                                    <span style="color: green" v-else>
                                        {{ formatStrategyPnls(scope.row.row_head, scope.row[col]) }}
                                    </span>                                    
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </el-row>
            <div style="margin-bottom: 50px" align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        此表格展示周期内不同策略的收益情况.
                        <br/>
                        收益率计算方式: 收益 / 初始总资金
                    </div>
                    <span style="color: gray; font-size: 12px"><i class="el-icon-info"></i>说明</span>
                </el-tooltip>
            </div>

            <!--- 策略收益柱状图 --->
            <el-row :gutter="0" type="flex" v-if="reportAvailable" v-loading="reportLoading">
                <el-col :span="24">
                    <highcharts :options="exchangePnlChart"></highcharts>
                </el-col>           
            </el-row>

            <!--- 策略统计表格 --->
            <el-row :gutter="0" type="flex" v-if="reportAvailable" v-loading="reportLoading">
                <el-table
                :data="report.strategy_stats.rows"
                :header-cell-style="{ background: '#f2f2f2' }"
                >
                    <template v-for="col in [''].concat(report.strategy_stats.col_header)">
                        <el-table-column align="center" :label="getStrategyCol(col)">
                            <template slot-scope="scope">
                                <div v-if="col == ''">
                                    {{ chineseString(scope.row.row_head) }}
                                </div>
                                <div v-else>
                                    <span v-if="scope.row.row_head == 'slippage'">
                                        <span style="color: red" v-if="scope.row[col] < 0">
                                            {{ formatStrategyStats(scope.row.row_head, scope.row[col]) }}
                                        </span>
                                        <span style="color: green" v-else>
                                            {{ formatStrategyStats(scope.row.row_head, scope.row[col]) }}
                                        </span>                                        
                                    </span>
                                    <span v-else-if="scope.row.row_head == 'swap_funding'">
                                        <span style="color: green" v-if="scope.row[col] >= 0">
                                            {{ formatStrategyStats(scope.row.row_head, scope.row[col]) }}
                                        </span>
                                        <span v-else>
                                            {{ formatStrategyStats(scope.row.row_head, scope.row[col]) }}
                                        </span>                                        
                                    </span>
                                    <span v-else>
                                        {{ formatStrategyStats(scope.row.row_head, scope.row[col]) }}
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </el-row>
            <div style="margin-bottom: 50px" align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        此表格展示周期内不同策略的交易情况.
                        <br/>
                        交易次数: 开仓+关仓为一次交易.
                        <br/>
                        费用说明: 负数表示支出;正数表示收入(目前只有合约费可能为正数).
                        <br/>
                        运维费: 根据近半年云服务(AWS)支出近似估计,每半年评估一次.
                    </div>
                    <span style="color: gray; font-size: 12px"><i class="el-icon-info"></i>说明</span>
                </el-tooltip>
            </div>

            <!--- 延迟统计表格 --->
            <el-row :gutter="0" type="flex" v-if="reportAvailable" v-loading="reportLoading">
                <el-table
                :data="report.delay_stats.rows"
                :header-cell-style="{ background: '#f2f2f2' }"
                >
                    <template v-for="col in [''].concat(report.delay_stats.col_header)">
                        <el-table-column align="center" :label="getDelayCol(col)">
                            <template slot-scope="scope">
                                <div v-if="col == ''">
                                    {{ scope.row.row_head }}
                                </div>
                                <div v-else>
                                    <span style="color: green" v-if="col == 'super_low_count'">
                                        {{ formatDelayStats(col, scope.row) }}
                                    </span>
                                    <span style="color: orange" v-else-if="col == 'high_count'">
                                        {{ formatDelayStats(col, scope.row) }}
                                    </span>  
                                    <span style="color: red" v-else-if="col == 'super_high_count'">
                                        {{ formatDelayStats(col, scope.row) }}
                                    </span>   
                                    <span v-else>
                                        {{ formatDelayStats(col, scope.row) }}
                                    </span>                                                                    
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </el-row>
            <div style="margin-bottom: 50px" align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        此表格展示周期内不同交易所订单延迟情况.
                        <br/>
                        统计订单: 所有的非定时退出订单(定时退出订单暂不方便统计).
                        <br/>
                        延迟说明: 信号价格实际发生时间和系统接收到该价格的时间差.
                        <br/>
                        延迟可能原因: 交易所繁忙;网络延迟;自身系统繁忙(CPU/内存不够导致)等等.
                    </div>
                    <span style="color: gray; font-size: 12px"><i class="el-icon-info"></i>说明</span>
                </el-tooltip>
            </div>

            <!--- 错误交易表格 --->
            <el-row :gutter="0" type="flex" v-if="reportAvailable" v-loading="reportLoading">
                <el-table
                :data="report.error_trades"
                :header-cell-style="{ background: '#f2f2f2' }"
                @row-click="clickErrorTrade"
                :cell-style="{cursor: 'pointer'}"
                >
                    <el-table-column align="center" label="建仓时间" min-width="10%">
                        <template slot-scope="scope">
                            {{ utcToLocalTimestamp(scope.row.entry_dt) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="交易所" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.exchange }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="策略" min-width="10%">
                        <template slot-scope="scope">
                            {{ chineseStrategyID(scope.row.strategy_id) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="标的" min-width="10%">
                        <template slot-scope="scope">
                            {{ scope.row.symbol }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="错误" min-width="30%">
                        <template slot-scope="scope">
                            {{ config.tradeFinalErrors[scope.row.error] }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="补充说明" min-width="30%">
                        <template slot-scope="scope">
                            {{ scope.row.note }}
                        </template>
                    </el-table-column>
                </el-table> 

                <!-- Diaglog: Trade -->
                <el-dialog title="" :visible.sync="dialogErrorTradeVisible"  width="80%" append-to-body>
                    <div style="background-color: white; margin-bottom: 10px; margin-top: -20px">
                        <!-- 仓位详情 -->
                        <trade-orders 
                        v-bind:trade="errorTrade"
                        v-bind:orders-loading="errorTradeOrdersLoading"
                        v-bind:only-exec-order="false"
                        v-if="errorTradeAvailable" 
                        ></trade-orders>
                    </div>
                </el-dialog>
            </el-row>
            <div style="margin-bottom: 50px" align="left">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        此表格展示周期内所有错误的交易.
                        <br/>
                        错误交易: 分为开仓错误和关仓错误.
                        <br/>
                        开仓错误: 因为某种原因导致未能开仓(eg, 保证金不足,杠杆率限制,etc).
                        <br/>
                        关仓错误: 因为某种原因导致关仓不够或者过量关仓等等.
                        <br/>
                        点击行可以查看交易详情.
                    </div>
                    <span style="color: gray; font-size: 12px"><i class="el-icon-info"></i>说明</span>
                </el-tooltip>
            </div>

            <!--- pivot_reversal_mini上线/下线表格 --->
            <el-row :gutter="0" type="flex" v-if="reportAvailable && report.temp_stats.prm_online_offline" v-loading="reportLoading">
                <el-table
                :data="prmOnlineOffline"
                :header-cell-style="{ background: '#f2f2f2' }"
                >
                    <el-table-column align="center" label="交易所" min-width="15%">
                        <template slot-scope="scope">
                            {{ scope.row.exchange }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="期末标的" min-width="15%">
                        <template slot-scope="scope">
                            <span style="cursor: pointer" @click="clickPrmActiveCount(scope.row.exchange, scope.row.activeSymbols)">
                                {{ scope.row.activeCount }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="上线标的" min-width="15%">
                        <template slot-scope="scope">
                            <span style="cursor: pointer" @click="clickPrmSymbols(scope.row.exchange, scope.row.onlineSymbols, '上线标的')">
                                {{ scope.row.onlineCount }}
                            </span> 
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="实际上线标的" min-width="15%">
                        <template slot-scope="scope">
                            <span style="cursor: pointer" @click="clickPrmSymbols(scope.row.exchange, scope.row.validOnlineSymbols, '实际上线标的')">
                                {{ scope.row.validOnlineCount }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="定时下线标的" min-width="15%">
                        <template slot-scope="scope">
                            <span style="cursor: pointer" @click="clickPrmSymbols(scope.row.exchange, scope.row.timerDisableSymbols, '定时下线标的')">
                                {{ scope.row.timerDisableCount}}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="不达标下线标的" min-width="15%">
                        <template slot-scope="scope">
                            <span style="cursor: pointer" @click="clickPrmSymbols(scope.row.exchange, scope.row.volumeDisableSymbols, '不达标下线标的')">
                                {{ scope.row.volumeDisableCount }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table> 

                <!-- Diaglogs -->
                <el-dialog title="" :visible.sync="dialogActiveSymbolsVisible"  width="10%" append-to-body>
                    <div style="background-color: white; margin-bottom: 10px; margin-top: -20px">
                        <h3 align="center">
                            {{ prmExchange }}期末标的
                        </h3>
                        <ul v-for="symbol in activeSymbols">
                            <li>
                                {{ symbol }}
                            </li>
                        </ul>
                    </div>
                </el-dialog>
                <el-dialog title="" :visible.sync="dialogPrmSymbolsVisible"  width="20%" append-to-body>
                    <div style="background-color: white; margin-bottom: 10px; margin-top: -20px">
                        <h3 align="center">
                            {{ prmExchange }}{{prmDialogTitle}}
                        </h3>
                        <el-table
                        :data="prmSymbols"
                        :header-cell-style="{ background: '#f2f2f2' }"
                        >
                            <el-table-column align="center" label="标的" min-width="15%">
                                <template slot-scope="scope">
                                    {{ scope.row.symbol }}
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="日期" min-width="15%">
                                <template slot-scope="scope">
                                    {{ scope.row.dt }}
                                </template>
                            </el-table-column>
                        </el-table> 
                    </div>
                </el-dialog>
            </el-row>
            <div style="margin-bottom: 50px" align="left" v-if="reportAvailable && report.temp_stats.prm_online_offline">
                <el-tooltip placement="top-start" align="left">
                    <div slot="content">
                        此表格展示周期内小PV策略上线/下线标的.
                        <br/>
                        期末标的: 周期结束时仍在线运行的标的.
                        <br/>
                        上线标的: 周期内交易所上线的新标的.
                        <br/>
                        实际上线标的: 周期内交易所上线的新标的中符合成交量要求而运行的标的.
                        <br/>
                        定时下线标的: 周期内因为定时原因下线的标的(eg, 只运行49天).
                        <br/>
                        成交量下线标的: 周期内因为初期成交量不足原因下线的标的(eg, 最初24H成交量不够).
                        <br/>
                        点击数字可以查看标的详情(上线/下线时间).
                    </div>
                    <span style="color: gray; font-size: 12px"><i class="el-icon-info"></i>说明</span>
                </el-tooltip>
            </div>

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


export default {
    components: {
        tradeOrders,
        valueLine,
        highcharts: Chart
    },

    watch: {

    },

    data() {
        return {
            level: null,
            dt_label: null,

            reportLevels: {
                'week': '周报',
                'month': '月报',
                'quarter': '季报',
                'year': '年报'
            },

            lastWeeks: [],
            reportLoading: false,

            reportFilter: {
                'level': null,
                'dt_label': null
            },

            report: null,
            reportAvailable: false,

            beginValue: null,
            endValue: null,
            valueChange: null,

            dialogErrorTradeVisible: false,
            errorTrade: null,
            errorTradeAvailable: false,
            errorTradeOrdersLoading: false,

            //临时表格
            prmOnlineOffline: [],
            dialogActiveSymbolsVisible: false,
            activeSymbols: null,
            prmExchange: null,
            prmDialogTitle: null,
            dialogPrmSymbolsVisible: false,
            prmSymbols: null,

            strategyAlias: config.strategyAlias, 
            config: config,
            pfoHosts: config.pfoHosts,

            exchangePnlChart: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '平台/策略收益',
                },
                xAxis: {
                    categories: ['s1', 's2', 's3']
                },
                yAxis: {
                    title: {
                        text: '收益($)'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: 'gray'
                        }
                    }
                },
                
                exporting: { enabled: false },
                
                legend: {
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}'
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                textOutline: 0
                            },                                        
                        },
                        borderWidth: 0
                    }
                },
                series: [
                    {
                        name: 'binance',
                        data: [1, 2, 3]
                    },
                    {
                        name: 'okex',
                        data: [4, 5, 6]
                    },                    
                ],                   
            }
        }
    },

    created(){
        // 初始化lastWeeks
        for (let offset = 1; offset < 15; offset++) {
            this.lastWeeks.push(this.getLastMonday(new Date(), offset))
        }

        this.search()
    },

    methods: {
        search(){
            // 默认展示上个周度报告
            if (this.reportFilter.level == null){
                this.reportFilter.level = 'week'
            }
            if (this.reportFilter.dt_label == null){
                // TEST
                // this.reportFilter.dt_label = '2024-04-01'

                // 获取上周一的日期: %Y-%m-%d
                this.reportFilter.dt_label = this.getLastMonday(new Date(), 1)
            }

            var filters = 'level=' + this.reportFilter.level + '&dt_label=' + this.reportFilter.dt_label
            this.reportLoading = true
            getReport(this.config.masterHost, null, filters).then(response => {
                if (response.results.length == 0){
                    alert(this.reportLevels[this.reportFilter.level] + ':' + this.reportFilter.dt_label + '不存在.')
                    this.reportLoading = false
                    return
                }

                this.level = this.reportFilter.level
                this.dt_label = this.reportFilter.dt_label
                this.report = response.results[0]
                this.reportAvailable = true
                this.beginValue = Math.round(this.report.summary.begin_value)
                this.endValue = Math.round(this.report.summary.end_value)
                this.valueChange = (this.endValue - this.beginValue)/this.beginValue
                this.reportLoading = false

                // 准备pivot_reversal_mini策略上线/下线数据
                if (this.report.temp_stats.prm_online_offline){
                    this.preparePrmOnlineOffline()
                }
            })
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
                this.beginValue = Math.round(this.report.summary.begin_value)
                this.endValue = Math.round(this.report.summary.end_value)
                this.valueChange = (this.endValue - this.beginValue)/this.beginValue
                this.reportLoading = false

                // 准备pivot_reversal_mini策略上线/下线数据
                if (this.report.temp_stats.prm_online_offline){
                    this.preparePrmOnlineOffline()
                }
            })
        },

        // 准备pivot_reversal_mini策略上线/下线数据
        preparePrmOnlineOffline(){
            this.prmOnlineOffline = []
            for(let exchange in this.report.temp_stats.prm_online_offline){
                var data = this.report.temp_stats.prm_online_offline[exchange]
                var row = {}
                row.exchange = exchange
                row.activeCount = data.active_symbols.length
                row.activeSymbols = data.active_symbols
                row.onlineCount = Object.keys(data.online_symbols).length
                row.onlineSymbols = data.online_symbols
                row.validOnlineCount = Object.keys(data.valid_online_symbols).length
                row.validOnlineSymbols = data.valid_online_symbols
                row.timerDisableCount = Object.keys(data.timer_disable_symbols).length
                row.timerDisableSymbols = data.timer_disable_symbols
                row.volumeDisableCount = Object.keys(data.volume_disable_symbols).length
                row.volumeDisableSymbols = data.volume_disable_symbols
                this.prmOnlineOffline.push(row)
            }
        },

        clickPrmActiveCount(exchange, symbols){
            this.activeSymbols = symbols
            this.prmExchange = exchange
            this.dialogActiveSymbolsVisible = true
        },

        clickPrmSymbols(exchange, symbols, title){
            this.prmSymbols = []
            for(let symbol in symbols){
                this.prmSymbols.push({
                    symbol: symbol,
                    dt: symbols[symbol]
                })
            }
            this.prmExchange = exchange
            this.prmDialogTitle = title
            this.dialogPrmSymbolsVisible = true
        },

        // 策略表格表头汉化
        getStrategyCol(col){
            if (col == ''){
                return col
            } else if (col == 'all'){
                return '合计'
            } else {
                return chineseStrategyID(col)
                // var strategy = col.split('_').slice(0, -1).join('_')
                // var strategyId = col.split('_').slice(-1,)[0]
                // return this.strategyAlias[strategy] + '-' + strategyId
            }
        },

        // 

        // 延迟表格表头汉化
        getDelayCol(col){
            if (col == ''){
                return col
            } else if (col == 'count'){
                return '统计订单次数'
            } else if (col == 'super_low_count'){
                return '超低延迟(0~0.2秒)'
            } else if (col == 'low_count'){
                return '低延迟(0.2~1秒)'
            } else if (col == 'medium_count'){
                return '中延迟(1~5秒)'
            } else if (col == 'high_count'){
                return '高延迟(5~25秒)'
            } else {
                return '超高延迟(>25秒)'
            }
        },

        // 策略收益格式化
        formatStrategyPnls(row_head, data){
            if(data == null){
                return data
            }
            if (row_head == 'pnl'){
                return toThousands(Math.round(data))
            } else if (row_head == 'pnl_ptg'){
                return (data*100).toFixed(2) + '%'
            } else {
                return data
            }
        },

        // 策略统计格式化
        formatStrategyStats(row_head, data){
            if(data == null){
                return data
            }
            if (row_head == 'volume'){
                return toThousands(Math.round(data))
            } else if (row_head == 'slippage'){
                return (data*100).toFixed(2) + '%'
            } else if (row_head == 'fee' || row_head == 'swap_funding' || row_head == 'op_fee'){
                return toThousands(Math.round(data))
            } else {
                return data
            }
        },

        // 策略统计格式化
        formatDelayStats(col, data){
            if(col == 'count'){
                return data[col]
            } else {
                if(data['count'] > 0){
                    return data[col] + ' / ' + (data[col]*100/data['count']).toFixed(1) + '%'
                } else {
                    return '0 / 0%'
                }
            }
        },

        // 获取之前的monday日期
        getLastMonday(date, offset=0) {
            var day = date.getDay() || 7
            date.setHours(-24 * (day - 1) - 24 * 7 * offset)
            var dateStr = date.toLocaleDateString("en-GB").split('/')
            return dateStr[2] + '-' + dateStr[1] + '-' + dateStr[0]
        },

        //点击ErrorTrade
        clickErrorTrade(row, ix){
            this.errorTradeAvailable = false
            this.errorTradeOrdersLoading = true
            this.dialogErrorTradeVisible = true
            this.fetchErrorTrade(row.trade_id, row.pfo)
        },

        // 从对应的host获取trade
        fetchErrorTrade(id, pfo) {
            getPortfolioByName(pfo, config.masterHost, 'host').then(response => {
                var host = response.results[0].host
                getTradeById(id, host).then(response => {
                    this.errorTrade = response.results[0]
                    this.errorTradeOrdersLoading = false
                    this.errorTradeAvailable = true
                })          
            })
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
    background: lightsalmon;
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