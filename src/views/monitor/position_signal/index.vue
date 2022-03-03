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
                <el-button style="width: 100%" type="primary" v-on:click="fetchPositionMonitorStatsByPfo(scope.row)" plain>
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
            :data="Object.values(positionMonitorStat)"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px;"
            header-cell-style="background: lightgray; padding:5px"
            border
            cell-style="padding:5px"
          >
            <el-table-column align="center" label="交易所" min-width="8%">
              <template slot-scope="scope">
                {{ scope.row.exchange }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="账号" min-width="19%">
              <template slot-scope="scope">
                {{ scope.row.username }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="类型" min-width="8%">
              <template slot-scope="scope">
                {{ scope.row.sub_type }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="数量" min-width="5%">
              <template slot-scope="scope">
                {{ symbolCount }}
              </template>ß
            </el-table-column>

            <el-table-column align="center" label="持仓" min-width="5%">
              <template slot-scope="scope">
                {{ positionRate }}%
              </template>
            </el-table-column>

            <el-table-column align="center" label="平台仓位相等" min-width="15%">
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

            <el-table-column align="center" label="信号仓位一致" min-width="20%">
              <template slot-scope="scope">
                <div v-if="scope.row.signal_fail == 0">
                  <i style="font-size:20px; color: lightgreen " class="el-icon-success"></i>
                  ({{ signalSuccessRate}}%)
                </div>
                <div v-else>
                  <span style="color: red">
                    {{ scope.row.signal_fail }}
                  </span>({{ signalSuccessRate}}%)              
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="回测信号一致" min-width="20%">
              <template slot-scope="scope">
                <div v-if="scope.row.backtest_fail == 0">
                  <i style="font-size:20px; color: lightgreen " class="el-icon-success"></i>
                  ({{ backtestSuccessRate}}%)
                </div>
                <div v-else>
                  <span style="color: red">
                    {{ scope.row.backtest_fail }}
                  </span>({{ backtestSuccessRate}}%)             
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 明细 -->
          <el-table
            v-loading="detailTableLoading"
            :data="detailTableDataList"
            style="width: 100%;"
            cell-style="padding:0"
            :span-method="arraySpanMethod"
            :row-style="rowStyle"
            header-cell-style="background: lightgray; padding:5px"
            border=""
          >

            <el-table-column align="center" label="子策略" prop="strategy" min-width="10%">
            </el-table-column>        


            <el-table-column align="center" label="信号" prop="sig_type" min-width="5%">
              <template slot-scope="scope">
                <span style="color:green" v-if="scope.row.sig_type == 'long'">
                  多
                </span>
                <span style="color:red" v-else-if="scope.row.sig_type == 'short'">
                  空
                </span>
                <span style="color: lightgray" v-else>
                  N/A
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="仓位" prop="position" min-width="5%">
            </el-table-column>

            <el-table-column align="center" label="信号仓位" prop="signal_status" min-width="5%">
              <template slot-scope="scope">
                <span v-html="statusIcon(scope.row.signal_status)"> </span>
              </template>
            </el-table-column>   

            <el-table-column align="center" label="信号仓位状态说明" prop="signal_message" min-width="20%">
            </el-table-column>   

            <el-table-column align="center" label="回测信号" prop="backtest_status" min-width="5%">
              <template slot-scope="scope">
                <span v-html="statusIcon(scope.row.backtest_status)"> </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="回测信号状态说明" prop="backtest_message" min-width="25%">
            </el-table-column>   

            <el-table-column align="center" label="" min-width="25%">
              <template slot-scope="scope">
                <div v-if="(scope.row.signal_status === 'fail' || scope.row.signal_status === 'warn') || (scope.row.backtest_status === 'fail' || scope.row.backtest_status === 'warn')">
                  <el-form :inline="true" :model="spState" class="demo-form-inline" size="mini">
                    <el-form-item label="" style="width: 70px; height: 10px">
                      <el-select v-model="spState.final_state" placeholder="最终状态" size="mini">
                        <el-option label="error" value="error"></el-option>
                        <el-option label="success" value="success"></el-option>
                        <el-option label="manual" value="manual"></el-option>
                        <el-option label="none" value="none"></el-option>
                      </el-select>
                    </el-form-item>  
                    <el-form-item label="" style="width: 70px; height: 10px">
                      <el-select v-model="spState.mismatch_type" placeholder="错误类型">
                        <el-option :label="type" :value="type" v-bind:key="type" v-for="type in spErrorTypes"></el-option>
                      </el-select>
                    </el-form-item>                     
                    <el-form-item label="" style="width: 70px; height: 10px">
                      <el-input v-model="spState.note" placeholder="原因"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" size="mini" @click="onSubmitSpState(scope.row.worker_id, scope.row)">标记</el-button>
                    </el-form-item>
                  </el-form>    
                </div>
              </template>    
            </el-table-column>
          </el-table>       
  
        </div>
      </el-col>
    </el-row>

    <el-dialog width="80%" title="JSON详情" :visible.sync="dialogJsonVisible">
      <pre>{{ jsonData }}</pre>
    </el-dialog>
  </div>


</template>


<script>
import config from '@/configs/system_configs'
import { getPortfolios } from '@/api/portfolio'
import { getPositionMonitorStatsByPortfolio } from '@/api/monitor_stat'
import { markCurrentSpFinalState } from '@/api/signal_point'
import moment from 'moment'
import { countDecimals, toString2 } from '@/utils/general'

export default {
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
      host: null,
      portfolioList: null,
      portfolioListLoading: true,
      positionRate: null,   // 入池率
      
      symbolCount: 0,       // Symbol数量

      positionMonitorStat: null,
      summaryTableLoading: true,
      signalSuccessRate: null,  // 信号成功率
      backtestSuccessRate: null,  // 回测成功率
      //summaryTableDataList: [],
      detailTableLoading: true,
      detailTableDataList: [],


      jsonData: null,
      dialogJsonVisible: false,

      spState: {
        final_state: null,
        mismatch_type: null,   // final_state = 'error'
        note: null,
      },
      spErrorTypes: ['signal_mismatch', 'backtest_mismatch'],
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
      for (var i = 0; i < config.pfoHosts.length; i++){
        getPortfolios(config.pfoHosts[i]).then(response => {
          response.results[0]['sort_id'] = config.pfoSortWeights[response.results[0]['name']]
          this.portfolioList = this.portfolioList.concat(response.results)
          if (this.portfolioList.length == config.pfoHosts.length){
            // pfo加载完成
            this.portfolioList.sort((a, b) => a.sort_id - b.sort_id)
            this.portfolioListLoading = false
            this.choosePortfolio(this.portfolioList[0])
          }
        })
      }
    },
    choosePortfolio(pfo) {
      this.host = pfo.host
      this.fetchPositionMonitorStatsByPfo(this.portfolioList[0])
    },
    fetchPositionMonitorStatsByPfo(pfo) {
      this.host = pfo.host
      this.summaryTableLoading = true
      this.detailTableLoading = true
      getPositionMonitorStatsByPortfolio(pfo).then(response => {
        this.positionMonitorStat = response.results[0].data
        this.summaryTableLoading = false
        this.detailTableLoading = false
        this.parsePositionMonitorStat()
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      })
      // document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    parsePositionMonitorStat(){
      // Summary Table
      var workerCount = 0
      var positionWorkerCount = 0
      var signalSuccessCount = 0
      var backtestSuccessCount = 0

      // Detail Table
      this.detailTableDataList = []
      this.symbolCount = 0
      for (var key1 in this.positionMonitorStat){
        var data = this.positionMonitorStat[key1]
        for (var symbol in data.worker_groups){
          this.symbolCount += 1
          var _data = data.worker_groups[symbol]
          _data.workers.sort((a, b) => parseInt(a.worker_tag) - parseInt(b.worker_tag))
          for (var ix in _data.workers){
            var __data = _data.workers[ix]
            this.detailTableDataList.push({
              exchange: data.exchange,
              sub_type: data.sub_type,
              strategy: symbol + '_' + __data.worker_tag,
              position: countDecimals(__data.position) > 3 ? __data.position.toFixed(3) : __data.position,
              sig_type: __data.signal_position_check.sig_type,
              signal_status: __data.signal_position_check.status,
              signal_message: __data.signal_position_check.message,
              backtest_status: __data.backtest_check.status,
              backtest_message: __data.backtest_check.message,
              // message: toString2(__data.signal_position_check.message) + toString2(__data.backtest_check.message),
              // reason: __data.reason,
              // sp_marked: __data.sp_marked,
              worker_id: __data.worker_id
            })

            workerCount += 1
            if (__data.position != 0){
              positionWorkerCount += 1  // 统计入池率
            }
            if (__data.signal_position_check.status == 'success'){
              signalSuccessCount += 1   // 信号成功率
            }
            if (__data.backtest_check.status == 'success'){
              backtestSuccessCount += 1   // 回测成功率
            }            
          }
          this.detailTableDataList.push({
            strategy: '策略合计: ' + _data.position, 
            signal_message: '平台合计: ' + _data.exchange_position, 
            summary: true,
            fail: _data.status === 'fail',
          })
        }
      }

      this.positionRate = parseInt((positionWorkerCount * 100)/workerCount)
      this.signalSuccessRate = parseInt((signalSuccessCount * 100)/workerCount)
      this.backtestSuccessRate = parseInt((backtestSuccessCount * 100)/workerCount)
    },

    onSubmitSpState(worker_id, row) {
      // 发送ajax, 更新后台
      markCurrentSpFinalState(worker_id, this.spState, this.host).then(response => {
        // 更新UI
        console.log(response)

        if (this.spState.mismatch_type == 'signal_mismatch'){
          row.signal_status = 'mark'
          row.signal_message += '(' + this.spState.note + ')'
        } else {
          row.backtest_status = 'mark'
          row.backtest_message += '(' + this.spState.note + ')'
        }
      })
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.summary){
        if (columnIndex % 4 === 0){
          return [1, 4]
        } else {
          return [0, 0]
        }
      }
    },
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