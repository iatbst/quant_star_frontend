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
            <el-table-column align="center" label="交易所">
              <template slot-scope="scope">
                {{ scope.row.exchange }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="账号">
              <template slot-scope="scope">
                {{ scope.row.username }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="类型">
              <template slot-scope="scope">
                {{ scope.row.sub_type }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="平台仓位不一致">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 'success'">
                  <i style="font-size:20px; color: lightgreen " class="el-icon-success"></i>
                </div>
                <div v-else>
                  <span style="color: red">
                    {{ scope.row.fail }}
                  </span>              
                </div>
              </template>            
            </el-table-column>

            <el-table-column align="center" label="信号仓位不一致">
              <template slot-scope="scope">
                <div v-if="scope.row.signal_fail == 0">
                  <i style="font-size:20px; color: lightgreen " class="el-icon-success"></i>
                </div>
                <div v-else>
                  <span style="color: red">
                    {{ scope.row.signal_fail }}
                  </span>              
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
            <el-table-column align="center" label="交易所" prop="exchange" min-width="10%">
            </el-table-column>

            <el-table-column align="center" label="类型" prop="sub_type" min-width="10%">
            </el-table-column>   

            <el-table-column align="center" label="子策略" prop="strategy" min-width="10%">
            </el-table-column>        


            <el-table-column align="center" label="周期" prop="sig_type" min-width="5%">
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

            <el-table-column align="center" label="仓位" prop="position" min-width="10%">
            </el-table-column>

            <el-table-column align="center" label="状态" prop="status" min-width="5%">
              <template slot-scope="scope">
                <span v-html="statusIcon(scope.row.status)"> </span>
              </template>
            </el-table-column>   

            <el-table-column align="center" label="状态说明" prop="message" min-width="30%">
            </el-table-column>        

            <el-table-column align="center" label="原因" prop="reason" min-width="20%">
              <template slot-scope="scope">
                <div v-if="scope.row.status !== 'success' && scope.row.reason === undefined">
                  <el-form :inline="true" :model="errorReason" class="demo-form-inline" size="mini">
                    <el-form-item label="">
                      <el-input v-model="errorReason.reason" placeholder="原因"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmitErrorReason(scope.row.worker_id, scope.row)">标记</el-button>
                    </el-form-item>
                  </el-form>      
                </div>
                <div v-else>
                  {{ scope.row.reason }}
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
import { markErrorPositionReason } from '@/api/signal_point'
import moment from 'moment'
import { countDecimals } from '@/utils/general'


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

      positionMonitorStat: null,
      summaryTableLoading: true,
      //summaryTableDataList: [],
      detailTableLoading: true,
      detailTableDataList: [],


      jsonData: null,
      dialogJsonVisible: false,

      errorReason: {
        reason: null,
      }
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
      } else {
        return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-warning\"></i>"
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
      

      // Detail Table
      this.detailTableDataList = []
      for (var key1 in this.positionMonitorStat){
        var data = this.positionMonitorStat[key1]
        for (var symbol in data.worker_groups){
          var _data = data.worker_groups[symbol]
          // debugger;
          _data.workers.sort((a, b) => parseInt(a.worker_tag) - parseInt(b.worker_tag))
          for (var ix in _data.workers){
            var __data = _data.workers[ix]
            this.detailTableDataList.push({
              exchange: data.exchange,
              sub_type: data.sub_type,
              strategy: symbol + '_' + __data.worker_tag,
              position: countDecimals(__data.position) > 3 ? __data.position.toFixed(3) : __data.position,
              sig_type: __data.signal_position_check.sig_type,
              status: __data.signal_position_check.status,
              message: __data.signal_position_check.message,
              reason: __data.signal_position_check.reason,
              worker_id: __data.worker_id
            })
          }
          this.detailTableDataList.push({
            exchange: '策略合计: ' + _data.position, 
            position: '平台合计: ' + _data.exchange_position, 
            summary: true,
            fail: _data.status === 'fail',
          })
        }
      }
    },

    onSubmitErrorReason(worker_id, row) {
      // 发送ajax, 更新后台
      markErrorPositionReason(worker_id, this.errorReason.reason, this.host).then(response => {
        // 更新UI
        console.log(response.results)
        row.status = 'mark'
        row.reason = this.errorReason.reason
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
      if ( row.fail ) {
        return {'color': 'red'}
      } else {
        return ''
      }
    },
  }
}
</script>

<style scoped>
.el-table tbody tr:hover>td { 
    background-color:#ffffff!important
}

</style>