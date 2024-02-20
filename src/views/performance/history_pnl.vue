<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- Binance: Quarter --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="24" v-if="pnlDatas.binance.available">
          <highcharts :options="pnlDatas.binance.pnl_quarter_chart"></highcharts>
      </el-col>
    </el-row>   

    <!----------------------------------- Binance: Month --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="24" v-if="pnlDatas.binance.available">
          <highcharts :options="pnlDatas.binance.pnl_month_chart"></highcharts>
      </el-col>
    </el-row> 

    <!----------------------------------- Binance: Week --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="24" v-if="pnlDatas.binance.available">
          <highcharts :options="pnlDatas.binance.pnl_week_chart"></highcharts>
      </el-col>
    </el-row> 

    <!----------------------------------- Okex: Quarter --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="24" v-if="pnlDatas.okex.available">
          <highcharts :options="pnlDatas.okex.pnl_quarter_chart"></highcharts>
      </el-col>
    </el-row>   

    <!----------------------------------- Okex: Month --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="24" v-if="pnlDatas.okex.available">
          <highcharts :options="pnlDatas.okex.pnl_month_chart"></highcharts>
      </el-col>
    </el-row> 

    <!----------------------------------- Okex: Week --------------------------------------->
    <el-row :gutter="0" type="flex"  style="background-color: white; margin-top: 0px">
      <el-col :span="24" v-if="pnlDatas.okex.available">
          <highcharts :options="pnlDatas.okex.pnl_week_chart"></highcharts>
      </el-col>
    </el-row> 
  </div>
</template>

<script>
import config from '@/configs/system_configs'
import { getBacktestReportByName } from '@/api/backtest_report'
import {Chart} from 'highcharts-vue'
import {addSingleColumn, addSingleLine} from '@/utils/chart'


export default {
    components: {
        highcharts: Chart
    },

    data() {
        return {
            pnlDatas: {
                'binance': {
                    'pnl_week': [],
                    'pnl_month': [],
                    'pnl_quarter': [],
                    'pnl_week_chart': {},
                    'pnl_month_chart': {},
                    'pnl_quarter_chart': {},
                    'available': false,
                },
                'okex': {
                    'pnl_week': [],
                    'pnl_month': [],
                    'pnl_quarter': [],
                    'pnl_week_chart': {},
                    'pnl_month_chart': {},
                    'pnl_quarter_chart': {},
                    'available': false
                },
            },
        }
    },

    created() {
        this.initCharts()
        this.fetchDatas()
    },

    methods: {
        // charts初始化
        initCharts(){
            var intervals = [
                'week',
                'month',
                'quarter'
            ]
            for (const exchange in this.pnlDatas){
                for(const interval of intervals){
                    if (interval == 'week'){
                        // Line Chart
                        this.pnlDatas[exchange]['pnl_week_chart'] = {
                            chart: {
                                type: 'line',
                                zoomType: 'x'
                            },
                            title: {
                                text: exchange + '_' + interval + '历史收益',
                            },
                            xAxis: {
                                categories: []
                            },
                            yAxis: {
                                title: {
                                    text: '收益(%)'
                                },
                            },
                            exporting: { enabled: false },

                            legend: {
                                enabled: false
                            },

                            tooltip: {
                                headerFormat: '<b>{point.x}</b><br/>',
                                pointFormat: '{series.name}: {point.y}%'
                            },

                            plotOptions: {
                                series: {
                                    label: {
                                        connectorAllowed: false
                                    },
                                },
                                line: {
                                    marker: {
                                        enabled: false
                                    },
                                }			        
                            },
                            
                            series: [],                        
                        }
                    } else {
                        // Column Chart
                        this.pnlDatas[exchange]['pnl_'+interval+'_chart'] = {
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: exchange + '_' + interval + '历史收益',
                            },
                            xAxis: {
                                categories: []
                            },
                            yAxis: {
                                title: {
                                    text: '收益(%)'
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
                                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                            series: [{
                                name: '收益',
                                data: []
                            }],                        
                        }
                    }
                }
            }
        },

        // 处理pnl数据为指定格式
        parsePnlDatas(pnlData, pnlList){
            var dateList = Object.keys(pnlData).sort()
            for (const date of dateList){
                pnlList.push({
                    x: date,
                    y: Math.round(pnlData[date]*1000)/10,
                    color: pnlData[date] >= 0 ? 'green' : 'red'
                })
            }
        },

        // 从master获取report.analyzer_rets数据
        fetchDatas(){
            for (const exchange in this.pnlDatas){
                var reportName = 'all_' + exchange + '_backtest'
                this.pnlDatas[exchange].available = false
                getBacktestReportByName(config.masterHost, reportName).then(response => {
                    var pnl_week = response.results[0].analyzer_rets.pnl_week
                    var pnl_month = response.results[0].analyzer_rets.pnl_month
                    var pnl_quarter = response.results[0].analyzer_rets.pnl_quarter
                    this.parsePnlDatas(pnl_month, this.pnlDatas[exchange].pnl_month)
                    this.parsePnlDatas(pnl_quarter, this.pnlDatas[exchange].pnl_quarter)

                    // 渲染Line Chart
                    for(const date in pnl_week){
                        pnl_week[date] = pnl_week[date]*100
                    }
                    addSingleLine('收益', pnl_week, this.pnlDatas[exchange].pnl_week_chart, true, 2)
                    addSingleColumn(this.pnlDatas[exchange].pnl_month, this.pnlDatas[exchange].pnl_month_chart)
                    addSingleColumn(this.pnlDatas[exchange].pnl_quarter, this.pnlDatas[exchange].pnl_quarter_chart)

                    this.pnlDatas[exchange].available = true
                    // debugger
                })
            }
        },

    },
}
</script>