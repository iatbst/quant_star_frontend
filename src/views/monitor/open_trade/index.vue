<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- 所有的Portfolios -->
          <el-table
            v-loading="portfolioListLoading"
            :data="portfolioList"
            style="width: 14%; position: fixed;"
            height="750"
          >
            <el-table-column align="center" label="投资组合">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary" v-on:click="fetchMonitorStatsByPfo(scope.row)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>


      <el-col :span="20">
        <div class="grid-content bg-purple" style="margin-top: 20px">
          <!-- 总表 -->
          <el-table
            v-loading="summaryTableLoading"
            :data="Object.values(monitorStat)"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px;"
            header-cell-style="background: lightgray; padding:5px"
            border
            cell-style="padding:5px"
          >
            <el-table-column align="center" label="交易所" min-width="5%">
              <template slot-scope="scope">
                {{ scope.row.exchange }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="账号" min-width="15%">
              <template slot-scope="scope">
                {{ scope.row.username }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="类型" min-width="5%">
              <template slot-scope="scope">
                {{ scope.row.sub_type }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="标的" min-width="5%">
              <template slot-scope="scope">
                {{ symbolCount }}
              </template>ß
            </el-table-column>

            <el-table-column align="center" label="持仓" min-width="5%">
              <template slot-scope="scope">
                {{ openTradeCount }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="多头" min-width="5%">
              <template slot-scope="scope">
                <span style="color: green" v-if="longTradeCount > 0"> 
                  {{ longTradeCount }}
                </span>
                <span v-else> 
                  {{ longTradeCount }}
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="空头" min-width="5%">
              <template slot-scope="scope">
                <span style="color: red" v-if="shortTradeCount > 0"> 
                  {{ shortTradeCount }}
                </span>
                <span v-else> 
                  {{ shortTradeCount }}
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="空仓" min-width="5%">
              <template slot-scope="scope">
                <span style="color: orange" v-if="emptyTradeCount > 0"> 
                  {{ emptyTradeCount }}
                </span>
                <span v-else> 
                  {{ emptyTradeCount }}
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="交易异常" min-width="10%">
              <template slot-scope="scope">
                <span style="color:red" v-if="scope.row.code_errors > 0">
                {{ scope.row.code_errors }}
                </span>
                <span v-else>
                  <i style="font-size:20px; color: lightgreen " class="el-icon-success"></i>
                </span>
              </template>
            </el-table-column>


            <el-table-column align="center" label="仓位异常" min-width="10%">
              <template slot-scope="scope">
                <div v-if="scope.row.position_fail == 0">
                  <i style="font-size:20px; color: lightgreen " class="el-icon-success"></i>
                </div>
                <div v-else>
                  <span style="color: red">
                    {{ scope.row.position_fail }}
                  </span>              
                </div>
              </template>            
            </el-table-column>

            <!---
            <el-table-column align="center" label="回测异常" min-width="10%">
              <template slot-scope="scope">
                <div v-if="scope.row.backtest_fail == 0">
                  <i style="font-size:20px; color: lightgreen " class="el-icon-success"></i>
                </div>
                <div v-else @click="showMissedBtTradesDialog()">
                  <span style="color: red; cursor: pointer">
                    {{ scope.row.backtest_fail }}
                  </span>        
                </div>
              </template>
            </el-table-column>
            --->
          </el-table>

          <!-- 明细 -->
          <el-table
            v-loading="detailTableLoading"
            :data="detailTableDataList"
            style="width: 100%;"
            cell-style="padding:0"
            :row-style="rowStyle"
            header-cell-style="background: lightgray; padding:5px"
            border=""
          >
            <el-table-column align="center" label="ID" prop="id" min-width="5%">
              <template slot-scope="scope">
                <span @click="showWorkerTrades(scope.row.workerID, scope.row.worker)" style="cursor: pointer">
                  {{ scope.row.id }}
                </span>
              </template>
            </el-table-column>    

            <el-table-column align="center" label="子策略" prop="worker" min-width="20%">
            </el-table-column>        

            <el-table-column align="center" label="标的" prop="symbol" min-width="15%">
            </el-table-column>  

            <el-table-column align="center" label="状态" prop="status" min-width="5%">
              <template slot-scope="scope">
                <span style="color:orange" v-if="scope.row.status == 'empty'">
                  空仓
                </span>
                <span style="color:green" v-else-if="scope.row.status == 'open'">
                  持仓
                </span>
                <span style="color:grey" v-else-if="scope.row.status == 'close'">
                  关仓
                </span>
              </template>
            </el-table-column>  

            <el-table-column align="center" label="方向" prop="side" min-width="5%">
              <template slot-scope="scope">
                <span style="color:green" v-if="scope.row.side == 'long'">
                  多
                </span>
                <span style="color:red" v-else-if="scope.row.side == 'short'">
                  空
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="仓位" prop="position" min-width="10%">
            </el-table-column>

            <el-table-column align="center" label="Code" prop="status" min-width="10%">
              <template slot-scope="scope">
                <span style="" v-if="scope.row.flag_codes === '0'">
                  <i style="font-size:20px; color: lightgreen " class="el-icon-success"></i>
                </span>
                <span style="color:red" v-else-if="scope.row.summary != true && scope.row.flag_codes == null">
                  N/A
                </span>                
                <span style="color:red" v-else>
                  {{ scope.row.flag_codes }}
                </span>
              </template>
            </el-table-column>  

            <el-table-column align="left" label="" min-width="30%">
              <template slot-scope="scope">
                <div v-if="scope.row.summary != true && scope.row.flag_codes != '0'">
                  <el-form :inline="true" :model="tradeFinal" class="demo-form-inline" size="mini">
                    <el-form-item label="" style="width: 100px; height: 10px">
                      <el-select v-model="tradeFinal.final_flag" placeholder="最终标识" size="mini">
                        <el-option label="error" value="error"></el-option>
                        <el-option label="success" value="success"></el-option>
                        <el-option label="none" value="none"></el-option>
                      </el-select>
                    </el-form-item> 
                    
                    <el-form-item label="" style="width: 100px; height: 10px" v-if="tradeFinal.final_flag == 'error'">
                      <el-select v-model="tradeFinal.final_error" placeholder="错误原因" size="mini">
                          <el-option
                          v-for="code in Object.keys(config.tradeFinalErrors)"
                          :key="code"
                          :label="config.tradeFinalErrors[code]"
                          :value="code">
                          </el-option>
                      </el-select>
                    </el-form-item>                    
                    
                    <el-form-item label="" style="width: 100px; height: 10px">
                      <el-input v-model="tradeFinal.note" placeholder="补充说明"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" size="mini" @click="onSubmitTradeFinal(scope.row.id, scope.row)">标记</el-button>
                    </el-form-item>
                  </el-form>    
                </div>
              </template>    
            </el-table-column>
          </el-table>       
  
        </div>
      </el-col>
    </el-row>

    <!-- Diaglog: SignalPoints -->
    <el-dialog title="" :visible.sync="dialogWorkerTradesVisible" width="60%" >
      <!-- 指定worker的runs -->
      <trades 
          v-bind:trades="workerTrades"
          v-bind:current-worker="currentWorker"
          v-bind:current-pfo="currentPfo"
          v-bind:trades-loading="workerTradesLoading"
      ></trades>
    </el-dialog>

    <el-dialog width="80%" title="当前未执行的回测交易" :visible.sync="dialogMissedBtTradesVisible">
      <div class="grid-content bg-purple" style="margin-top: 0px"> 
          <!-- 系统中丢失的回测交易 -->
          <el-table
            :data="missedBtTrades"
            style="width: 100%; margin-bottom: 20px;"
            header-cell-style="background: lightgray; padding:5px"
            border
            cell-style="padding:5px"
          >
            <el-table-column align="center" label="Worker" min-width="8%">
              <template slot-scope="scope">
                {{ scope.row.worker }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="入场时间" min-width="18%">
              <template slot-scope="scope">
                {{ scope.row.entry_dt }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="方向" min-width="8%">
              <template slot-scope="scope">
                {{ scope.row.side }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="价格" min-width="8%">
              <template slot-scope="scope">
                {{ scope.row.entry_price }}
              </template>ß
            </el-table-column>

            <el-table-column align="center" label="入场ID" min-width="8%">
              <template slot-scope="scope">
                {{ scope.row.entry_id }}
              </template>
            </el-table-column>
          </el-table>
      </div>
    </el-dialog>
  </div>


</template>


<script>
import trades from '@/views/trade/_worker_trades'
import config from '@/configs/system_configs'
import { getPortfolios } from '@/api/portfolio'
import { getOpenTradeMonitorStatsByPortfolio } from '@/api/monitor_stat'
import { markTradeFinalFlag, getTradesByWorker } from '@/api/trade'
import moment from 'moment'
import { countDecimals, toString2 } from '@/utils/general'

export default {
  components: {
      trades,
  },

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    epochToTimestamp(ts) {
      if (ts) {
        const stillUtc = moment.utc(ts*1000).toDate()
        return moment(stillUtc)
        .local()
        .format('YYYY-MM-DD HH:mm:ss')
      } else {
        return '--'
      }
      return ts.replace('T', ' ').slice(0, 19)
    },
  },
  data() {
    return {
      config: config,
      host: null,
      portfolioList: null,
      portfolioListLoading: true,
      positionRate: null,   // 入池率
      
      symbolCount: 0,       // Symbol数量
      tradeCount: 0,        // 交易数量
      openTradeCount: 0,    // 持仓数量
      emptyTradeCount: 0,   // 空仓数量
      longTradeCount: 0,    // 多头数量
      shortTradeCount: 0,   // 空头数量

      monitorStat: {},
      summaryTableLoading: true,
      signalSuccessRate: null,  // 信号成功率
      backtestSuccessRate: null,  // 回测成功率
      //summaryTableDataList: [],
      detailTableLoading: true,
      detailTableDataList: [],

      workerTrades: null,
      dialogWorkerTradesVisible: false,
      workerTradesLoading: false,
      currentWorker: null,
      currentPfo: null,

      missedBtTrades: null,
      dialogMissedBtTradesVisible: false,

      tradeFinal: {
        final_flag: null,
        final_error: null,
        note: null,
      },
    }
  },
  created() {
    this.fetchPortfolios()
  },
  methods: {
    statusIcon(status) {
      if (status === 'success'){
        return "<i style=\"font-size:20px; color: lightgreen \" class=\"el-icon-success\"></i>"
      } else if (status === 'fail') {
        return "<i style=\"font-size:20px; color: red \" class=\"el-icon-error\"></i>"
      } else if (status === 'mark') {
        return "<i style=\"font-size:20px; color: lightgray \" class=\"el-icon-info\"></i>"
      } else if (status === 'warn') {
        return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-warning\"></i>"
      } else {
        return status
      }
    },
    showJsonDialog(data) {
      this.jsonData = JSON.stringify(data,null,2)
      this.dialogJsonVisible = true
    },
    fetchPortfolios() {
      this.portfolioListLoading = true
      this.portfolioList = []
      var request_count = 0
      for (var i = 0; i < config.pfoHosts.length; i++){
        getPortfolios(config.pfoHosts[i]).then(response => {
          this.portfolioList = this.portfolioList.concat(response.results)
          request_count += 1
          if (request_count == config.pfoHosts.length){
            // pfo加载完成
            this.portfolioList.sort((a, b) => a.name.localeCompare(b.name))
            this.portfolioListLoading = false
            this.choosePortfolio(this.portfolioList[0])
          }
        })
      }
    },
    choosePortfolio(pfo) {
      this.host = pfo.host
      this.fetchMonitorStatsByPfo(this.portfolioList[0])
    },
    fetchMonitorStatsByPfo(pfo) {
      this.host = pfo.host
      this.summaryTableLoading = true
      this.detailTableLoading = true
      getOpenTradeMonitorStatsByPortfolio(pfo).then(response => {
        this.monitorStat = response.results[0].data
        this.summaryTableLoading = false
        this.detailTableLoading = false
        this.parseMonitorStat()
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      })
      // document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    parseMonitorStat(){
      // Summary Table
      this.symbolCount = 0
      this.tradeCount = 0
      this.emptyTradeCount = 0
      this.openTradeCount = 0
      this.longTradeCount = 0
      this.shortTradeCount = 0

      // Detail Table
      this.detailTableDataList = []
      for (var key1 in this.monitorStat){
        var data = this.monitorStat[key1]
        this.missedBtTrades = data.missed_bt_trades
        this.currentPfo = {host: data.host}
        for (var symbol in data.symbol_groups){
          this.symbolCount += 1
          var _data = data.symbol_groups[symbol]
          _data.open_trades.sort((a, b) => (a.worker_name > b.worker_name) ? 1 : -1)
          for (var ix in _data.open_trades){
            var __data = _data.open_trades[ix]

            if (__data.status == 'open'){
              if (__data.position == 0){
                  this.emptyTradeCount += 1
                  __data.status = 'empty'
                } else {
                  this.openTradeCount += 1
                  if (__data.side == 'long'){
                    this.longTradeCount += 1
                  } else {
                    this.shortTradeCount += 1
                  }
              }
            }

            this.detailTableDataList.push({
              id: __data.id,
              exchange: data.exchange,
              sub_type: data.sub_type,
              worker: __data.worker_name,
              workerID: __data.worker_id,
              position: countDecimals(__data.position) > 3 ? __data.position.toFixed(3) : __data.position,
              side: __data.side,
              symbol: symbol,
              status: __data.status,
              flag_codes: __data.flag_codes,
            }) 
            this.tradeCount += 1     
          }
          this.detailTableDataList.push({
            worker: symbol + '交易所仓位: ' + _data.exchange_position, 
            position: 'pfo仓位: ' + (countDecimals(_data.position) > 3 ? _data.position.toFixed(3) : _data.position), 
            symbol: '其他pfo仓位: ' + (countDecimals(_data.other_position) > 3 ? _data.other_position.toFixed(3) : _data.other_position), 
            summary: true,
            fail: _data.status === 'fail',
          })
        }
      }

      // this.positionRate = parseInt((positionWorkerCount * 100)/workerCount)
      // this.signalSuccessRate = parseInt((signalSuccessCount * 100)/workerCount)
      // this.backtestSuccessRate = parseInt((backtestSuccessCount * 100)/workerCount)
    },

    // 通过Dialog展示signalPoints(注意, worker只包含id和name)
    showWorkerTrades(workerID, workerName){
        this.dialogWorkerTradesVisible = true
        this.workerTradesLoading = true
        this.currentWorker = {id: workerID, name: workerName}
        getTradesByWorker(this.currentWorker, this.currentPfo.host).then(response => {
            this.workerTrades = response.results
            this.workerTradesLoading = false
        })
    },

    onSubmitTradeFinal(trade_id, row) {
      // 发送ajax, 更新后台
      if (this.tradeFinal.final_flag == 'error' && this.tradeFinal.final_error == null){
          alert('请注明错误原因.')
      } else {
        markTradeFinalFlag(trade_id, this.tradeFinal, this.host).then(response => {
          // 更新UI
          console.log(response)
          row.flag_codes = response.data.trade_final_flag + '(' + response.data.trade_final_error + ')'
          // if (this.tradeFinal.mismatch_type == 'signal_mismatch'){
          //   row.signal_status = 'mark'
          //   row.signal_message += '(' + this.tradeFinal.note + ')'
          // } else {
          //   row.backtest_status = 'mark'
          //   row.backtest_message += '(' + this.tradeFinal.note + ')'
          // }
        })
      }
    },

      showMissedBtTradesDialog() {
          this.dialogMissedBtTradesVisible = true
      },


    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (row.summary){
    //     if (columnIndex % 4 === 0){
    //       return [1, 4]
    //     } else {
    //       return [0, 0]
    //     }
    //   }
    // },
    
    rowStyle({ row, rowIndex}){
      if (row.summary){
        if ( row.fail ) {
          return {'font-weight': 'bold', 'background-color': '#f7f7f7', 'color': 'red'}
        } else {
          return {'background-color': '#f7f7f7'}
        }
      }
    },
  }
}
</script>


<style>
  .el-table__row>td{
    border: none;
    padding: 5px;
  }
</style>

<style scoped>

  .el-table tbody tr:hover>td { 
      background-color:#ffffff!important
  }

</style>