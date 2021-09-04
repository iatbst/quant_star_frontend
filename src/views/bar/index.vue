<template>
  <div class="app-container">
    <div style="margin-bottom: 10px"><el-button type="primary" size="small" @click="updateAllBars()">更新所有</el-button></div>
    <el-table
      v-loading="listLoading"
      :data="summarylist"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          {{ chineseString(scope.row.product_type) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="标的">
        <template slot-scope="scope">
          {{ scope.row.symbol }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="K线级别">
        <template slot-scope="scope">
          {{ scope.row.bar_level }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易所">
        <template slot-scope="scope">
          {{ scope.row.exchange }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="子类">
        <template slot-scope="scope">
          {{ chineseString(scope.row.sub_type) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="时长(年)">
        <template slot-scope="scope">
          {{ scope.row.year ? scope.row.year.toFixed(1) : 'N/A' }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="起始时间">
        <template slot-scope="scope">
          {{ scope.row.start_ts ? formatTimestamp(scope.row.start_ts) : 'N/A' }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          {{ scope.row.end_ts ? formatTimestamp(scope.row.end_ts) : 'N/A' }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="饱和度">
        <template slot-scope="scope">
          {{ scope.row.inventory_ratio ? (scope.row.inventory_ratio*100).toFixed(1) + '%' : 'N/A' }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateBars(scope.row.product_name, scope.row.bar_level, scope.row)" v-if="scope.row.need_update">更新</el-button>
          <i style="font-size:20px" class="el-icon-loading" v-if="scope.row.update_status === 'updating'"></i>
          <i style="font-size:20px; color: lightgreen" class="el-icon-success" v-if="scope.row.update_status === 'update_success'"></i>
          <i style="font-size:20px; color: red" class="el-icon-error" v-if="scope.row.update_status === 'update_error'"></i>
          <i style="font-size:20px; color: orange" class="el-icon-warning" v-if="scope.row.update_status === 'update_exception'"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatTimestamp } from '@/utils/general'
import { chineseString } from '@/utils/chinese'
import config from '@/configs/system_configs'
import { getBarSummaries } from '@/api/bar'
import { runTask } from '@/api/task'
import { barLevelSeconds } from '@/utils/general'


export default {
  data() {
    return {
      summarylist: null,
      listLoading: true,
      nextRowIndex: null,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    sleep(time){
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    updateAllBars(){
        // for(var i = 0; i < this.summarylist.length; i++){
        //   // while(this.updating == true) {this.sleep(1000).then(() => {console.log('check updating...')});}
        //   this.updateBars(this.summarylist[i].product_name, this.summarylist[i].bar_level, this.summarylist[i])

        // 递归方式
        this.nextRowIndex = 1
        var firstRow = this.summarylist[0]
        this.updateBars(firstRow.product_name, firstRow.bar_level, firstRow)
    },
    updateBars(product_name, bar_level, row) {
      row.update_status = 'updating'
      row.need_update = false
      // this.updating = true

      // 发送ajax, 更新后台
      var data = {
        name: "fetch_bars", 
        params: {
            product_name: product_name,
  	        bar_level: bar_level
          }
        }
      runTask(config.backtestHost, data).then(response => {
        // 更新UI
        if (response.ok && response.data.ok){
          // 成功
          if (response.data.data.max_mts){
            // 更新最晚的mts
            row.end_ts = response.data.data.max_mts/1000
          }
          if (row.start_ts === null && response.data.data.min_mts){
            // 第一次更新
            row.start_ts = response.data.data.min_mts/1000
            var totalSec = (response.data.data.max_mts - response.data.data.min_mts)/1000
            row.year = totalSec/(3600*24*365)
            row.inventory_ratio = response.data.data.saved/(totalSec/barLevelSeconds(bar_level) + 1)
          }
          row.update_status = 'update_success'
        } else if (response.ok) {
          // 失败: task返回错误
          row.update_status = 'update_error'
          alert('task错误: ' + response.data.error)
        } else {
          // 失败: view返回异常
          row.update_status = 'update_exception'
          alert('task异常: ' + response.error)
        }

        if (this.nextRowIndex && this.nextRowIndex < this.summarylist.length){
          // 需要递归的更新下一个bar
          var nextRow = this.summarylist[this.nextRowIndex]
          this.nextRowIndex += 1
          this.updateBars(nextRow.product_name, nextRow.bar_level, nextRow)
        }
      })
    },

    fetchData() {
      this.listLoading = true
      this.summarylist = null
      getBarSummaries(config.backtestHost).then(response => {
        if (response.ok){
          // 成功
          this.summarylist = response.data
        } else {
          // 失败
          alert('获取bar summaries失败: ' + response.error)
        }
        this.listLoading = false
      })
    },
    formatTimestamp: formatTimestamp,
    chineseString: chineseString,
  }
}
</script>
