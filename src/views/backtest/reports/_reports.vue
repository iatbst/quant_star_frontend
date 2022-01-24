<!-- 
    模板: 展示传入的backtest_reports list
-->
<template>
  <div>
    <el-table
      :data="reports"
      :header-cell-style="{background: '#e5e9f2'}"
    >
        <el-table-column align="center" label="回测" min-width="10%">
            <template slot-scope="scope">
            {{ scope.row.name }}
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="15%">
            <template slot-scope="scope">
            {{ standardTimestamp(scope.row.created_ts) }}
            </template>
        </el-table-column>

        <el-table-column align="center" label="方案" min-width="15%">
            <template slot-scope="scope">
            {{ scope.row.plan }}
            </template>
        </el-table-column>

        <el-table-column align="left" label="状态" min-width="8%">
            <template slot-scope="scope">
                <span v-html="statusIcon(scope.row.task.status)"> </span>
                <span v-if="scope.row.task.status === 'running'" style="font-size: 16px">{{ parseInt(scope.row.task.progress*100)}}%</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="回测时长" min-width="10%">
            <template slot-scope="scope">
                <span v-if="scope.row.task.status === 'success' || scope.row.task.status === 'warn'">{{ hourMinSecTimestamp(scope.row.run_seconds) }}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="运行参数" min-width="10%">
            <template slot-scope="scope">
                <el-button style="margin-top: -6px" type="text" @click="showParamsDialog(scope.row.id)">
                    <i style="font-size:20px; color: gray " class="el-icon-s-tools"></i>
                </el-button>
            </template>
        </el-table-column>

        <el-table-column align="center" label="报告" min-width="10%">
            <template slot-scope="scope">
                <el-button style="margin-top: -6px" type="text" @click="showReportDialog(scope.row.id)">
                    <i style="font-size:20px; color: gray " class="el-icon-document"></i>
                </el-button>
            </template>
        </el-table-column>

        <!-- 调试 -->
        <el-table-column align="center" label="" min-width="8%" v-if="false">
            <template slot-scope="scope">
                <el-button style="margin-top: -6px" type="text" @click="showJsonDialog(scope.row.id, null)">JSON</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- Diaglog: Json -->
    <el-dialog title="Report JSON" :visible.sync="dialogJsonVisible" append-to-body>
        <div v-loading="jsonLoading" align="left">
            <pre>{{ json }}</pre>
        </div>
    </el-dialog> 

    <!-- Diaglog: Report Exception -->
    <el-dialog title="" :visible.sync="dialogExceptionReportVisible" align="left" append-to-body>
        <h2>
            <i style="font-size:20px; color: red; " class="el-icon-error"></i>  程序错误
        </h2>
        <h4>
            {{ taskException }}
        </h4>
        <h4 style="font-weight: normal; white-space: pre-line;">
            {{ taskExceptionTb }}
        </h4>
    </el-dialog> 

    <!-- Diaglog: Params -->
    <el-dialog width="60%" title="回测参数" :visible.sync="dialogParamsVisible" append-to-body>
        <params
        v-bind:backtest-params="backtestParams"
        v-bind:keep-params="true"
        v-bind:reload-params="reloadParams"
        v-bind:editable="false"
        >
        </params>
    </el-dialog> 

    <!-- Diaglog: Report -->
    <el-dialog width="80%" title="" :visible.sync="dialogReportVisible" append-to-body>
        <report
        v-bind:report="currentReport"
        v-bind:report-loading="reportLoading"
        v-bind:reload="reloadReport">
        </report>
    </el-dialog> 
  </div>
</template>

<script>
import report from '@/views/backtest/reports/_report'
import {standardTimestamp, hourMinSecTimestamp} from '@/utils/general'
import {getBacktestReportById} from '@/api/backtest_report'
import config from '@/configs/system_configs'
import params from '@/views/backtest/_params/_params'

export default {
  components: {
    report,
    params
  },

  props: {
      // 接收从父传入data
      reports: {
          type:Array,
          default:[]
      }
  },

  data() {
      return {
            dialogJsonVisible: false,
            jsonLoading: false,
            json: null,

            currentReport: {},
            reportLoading: false,
            dialogReportVisible: false,
            reloadReport: 0,

            paramsLoading: false,
            dialogParamsVisible: false,
            backtestParams: {},
            reloadParams: 0,

            dialogExceptionReportVisible: false,
            taskException: null,
            taskExceptionTb: null
      }
  },

  methods: {
    statusIcon(status) {
      if (status === 'success'){
        return "<i style=\"font-size:20px; color: lightgreen \" class=\"el-icon-success\"></i>"
      } else if (status === 'warn'){
        return "<i style=\"font-size:20px; color: orange \" class=\"el-icon-warning\"></i>"
      } else if (status === 'fail' || status === 'exception') {
        return "<i style=\"font-size:20px; color: red \" class=\"el-icon-error\"></i>"
      } else if (status === 'running') {
        return "<i style=\"font-size:20px; color: #409eff \" class=\"el-icon-loading\"></i>"
      } else {
        return status
      }
    },

    showJsonDialog(report_id, field) {
        this.jsonLoading = true
        this.dialogJsonVisible = true
        getBacktestReportById(config.backtestHost, report_id, field).then(response => {
            this.jsonLoading = false
            this.json = JSON.stringify(response.results[0],null,2)
        })       
    },

    // 展示回测参数(不可编辑)
    showParamsDialog(report_id) {
        this.paramsLoading = true
        getBacktestReportById(config.backtestHost, report_id).then(response => {
            this.paramsLoading = false
            this.backtestParams = response.results[0].params
            this.dialogParamsVisible = true
            this.reloadParams += 1
        })       
    },

    // 展示最新报告
    showReportDialog(report_id, fields=null) {
        this.reportLoading = true
        getBacktestReportById(config.backtestHost, report_id, fields).then(response => {
            this.reportLoading = false
            this.currentReport = response.results[0]

            if (this.currentReport.task.status == 'running'){
                // task仍在运行
                this.$message('回测:' + this.currentReport.name + '仍在运行, 请稍后查看报告.')     
            } else if (this.currentReport.task.ret.ok){
                // 报告正常
                this.dialogReportVisible = true
                this.reloadReport += 1    // 重新加载数据
            } else {
                // 报告异常(对应的task出现exception)
                this.dialogExceptionReportVisible = true
                this.taskException = this.currentReport.task.ret.error
                this.taskExceptionTb = this.currentReport.task.ret.tb
            }
        })       
    },

    standardTimestamp:standardTimestamp,
    hourMinSecTimestamp:hourMinSecTimestamp
  }
}
</script>
