<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- 所有的Portfolios -->
          <el-table
            v-loading="portfolioListLoading"
            :data="portfolioList"
            style="width: 100%"
          >
            <el-table-column align="center" label="投资组合">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary" v-on:click="fetchPositionMonitorStatByPortfolioId(scope.row.id)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>


      <el-col :span="20">
        <div class="grid-content" style="margin-top: 20px">
          <!-- 总表 -->
          <el-table
            v-loading="summaryTableLoading"
            :data="Object.values(positionMonitorStat)"
            style="width: 100%; margin-bottom: 20px"
            :header-cell-style="{ background: 'lightgray' }"
            border
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
            v-loading="summaryTableLoading"
            :data="detailTableDataList"
            style="width: 100%"
            :span-method="arraySpanMethod"
            :row-style="rowStyle"
            :header-cell-style="{ background: 'lightgray' }"
            border=""
          >
            <el-table-column align="center" label="交易所" prop="exchange" min-width="10%">
            </el-table-column>

            <el-table-column align="center" label="类型" prop="sub_type" min-width="10%">
            </el-table-column>   

            <el-table-column align="center" label="子策略" prop="strategy" min-width="20%">
            </el-table-column>        


            <el-table-column align="center" label="周期" prop="sig_type" min-width="5%">
              <template slot-scope="scope">
                <span style="color:green" v-if="scope.row.sig_type == 'long'">
                  多
                </span>
                <span style="color:red" v-else>
                  空
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

            <el-table-column align="center" label="原因" prop="reason" min-width="10%">
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
import { getPortfolioList } from '@/api/portfolio'
import { getPositionMonitorStatListByPortfolio } from '@/api/monitor_stat'
import moment from 'moment'

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
      portfolioList: null,
      portfolioListLoading: true,

      positionMonitorStat: null,
      summaryTableLoading: true,
      //summaryTableDataList: [],
      detailTableLoading: true,
      detailTableDataList: [],


      jsonData: null,
      dialogJsonVisible: false,

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
      getPortfolioList().then(response => {
        this.portfolioList = response.results
        this.portfolioListLoading = false
        this.fetchPositionMonitorStatByPortfolioId(this.portfolioList[0].id)
      })
    },
    fetchPositionMonitorStatByPortfolioId(pfo_id) {
      //this.clearMonitorStatData()
      this.summaryTableLoading = true
      this.detailTableLoading = true
      getPositionMonitorStatListByPortfolio(pfo_id).then(response => {
        this.positionMonitorStat = response.results[0].data
        this.summaryTableLoading = false
        this.detailTableLoading = false
        this.parsePositionMonitorStat()
      })
    },
    parsePositionMonitorStat(){
      // Summary Table
      

      // Detail Table
      this.detailTableDataList = []
      for (var key1 in this.positionMonitorStat){
        var data = this.positionMonitorStat[key1]
        for (var symbol in data.worker_groups){
          var _data = data.worker_groups[symbol]
          for (var ix in _data.workers){
            var __data = _data.workers[ix]
            this.detailTableDataList.push({
              exchange: data.exchange,
              sub_type: data.sub_type,
              strategy: symbol + '_' + __data.worker_tag,
              position: __data.position,
              sig_type: __data.signal_position_check.sig_type,
              status: __data.signal_position_check.status,
              message: __data.signal_position_check.message,
              reason: '',
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
