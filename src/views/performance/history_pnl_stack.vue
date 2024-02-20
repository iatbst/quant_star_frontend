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
import {addStackedColumn, addSingleLine} from '@/utils/chart'


export default {
    components: {
        highcharts: Chart
    },

    data() {
        return {
            pnlDatas: {
                'binance': {
                    'pnl_week': [],
                    'pnl_month': {},
                    'pnl_quarter': {},
                    'pnl_week_chart': {},
                    'pnl_month_chart': {},
                    'pnl_quarter_chart': {},
                    'available': false,
                },
                'okex': {
                    'pnl_week': [],
                    'pnl_month': {},
                    'pnl_quarter': {},
                    'pnl_week_chart': {},
                    'pnl_month_chart': {},
                    'pnl_quarter_chart': {},
                    'available': false
                },
            }
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
                                        fontSize: '10px',
                                        color: 'gray'
                                    },
                                    align: 'center',
                                            formatter: function() {
                                        var sum = 0;
                                        var series = this.axis.series;

                                        for (var i in series) {
                                            if (series[i].visible && series[i].options.stacking == 'normal') 
                                                sum += series[i].yData[this.x];
                                        }
                                        if(this.total > 0 ) {
                                            return Math.round(sum*10)/10; 
                                        } else {
                                            return '';    
                                        }
                                    }
                                }
                            },
                            
                            exporting: { enabled: false },
                            
                            legend: {
                                align: 'right',
                                x: -30,
                                verticalAlign: 'top',
                                y: 0,
                                floating: true,
                                backgroundColor: 'white',
                                borderColor: '#CCC',
                                borderWidth: 1,
                                shadow: false,
                                enable: true
                            },

                            tooltip: {
                                headerFormat: '<b>{point.x}</b><br/>',
                                pointFormat: '{series.name}: {point.y}'
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal',
                                    dataLabels: {
                                        enabled: true,
                                        style: {
                                            fontWeight: 100,
                                            fontSize: '10px',
                                            textOutline: 0
                                        },
                                        color: 'black'
                                    },
                                    borderWidth: 0
                                }
                            },
                            series: [],                        
                        }                       
                    }
                }
            }
        },

        // 处理pnl数据为指定格式
        parsePnlDatas(strategyPnl, pnlData){
            for (const strategy in strategyPnl){
                for (const date in strategyPnl[strategy]){
                    if (!(date in pnlData)){
                        pnlData[date] = {}
                    } 
                    pnlData[date][strategy] = Math.round(strategyPnl[strategy][date]*1000)/10
                }
            }
        },

        // 从master获取report.analyzer_rets数据
        fetchDatas(){
            var strategies = [
                'plunge_back',
                'pivot_reversal',
                'pivot_reversal_mini'
            ]
            var strategyColors = {
                'plunge_back': '#70ace9',
                'pivot_reversal': '#85ea72',
                'pivot_reversal_mini': 'orange',   
            }
            for (const exchange in this.pnlDatas){
                var reportName = 'all_' + exchange + '_backtest'
                this.pnlDatas[exchange].available = false
                getBacktestReportByName(config.masterHost, reportName).then(response => {
                    var pnl_week = response.results[0].analyzer_rets.pnl_week

                    var pb_month = response.results[0].analyzer_rets.pb_month
                    var pb_quarter = response.results[0].analyzer_rets.pb_quarter
                    var pr_month = response.results[0].analyzer_rets.pr_month
                    var pr_quarter = response.results[0].analyzer_rets.pr_quarter
                    var prm_month = response.results[0].analyzer_rets.prm_month
                    var prm_quarter = response.results[0].analyzer_rets.prm_quarter
                    var strategyMonthPnl = {
                        'plunge_back': pb_month,
                        'pivot_reversal': pr_month,
                        'pivot_reversal_mini': prm_month
                    }
                    var strategyQuarterPnl = {
                        'plunge_back': pb_quarter,
                        'pivot_reversal': pr_quarter,
                        'pivot_reversal_mini': prm_quarter
                    }
                    this.parsePnlDatas(strategyMonthPnl, this.pnlDatas[exchange].pnl_month)
                    this.parsePnlDatas(strategyQuarterPnl, this.pnlDatas[exchange].pnl_quarter)

                    // 渲染Line Chart
                    for(const date in pnl_week){
                        pnl_week[date] = pnl_week[date]*100
                    }
                    addSingleLine('收益', pnl_week, this.pnlDatas[exchange].pnl_week_chart, true, 2)
                    addStackedColumn(this.pnlDatas[exchange].pnl_month, strategies, this.pnlDatas[exchange].pnl_month_chart, strategyColors)
                    addStackedColumn(this.pnlDatas[exchange].pnl_quarter, strategies, this.pnlDatas[exchange].pnl_quarter_chart, strategyColors)

                    // addSingleColumn(this.pnlDatas[exchange].pnl_month, this.pnlDatas[exchange].pnl_month_chart)
                    // addSingleColumn(this.pnlDatas[exchange].pnl_quarter, this.pnlDatas[exchange].pnl_quarter_chart)

                    this.pnlDatas[exchange].available = true
                    // debugger
                })
            }
        },

    },
}
</script>