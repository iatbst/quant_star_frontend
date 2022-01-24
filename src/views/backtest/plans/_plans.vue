<!-- 
    模板: 展示传入的backtest_plan list
-->
<template>
    <div>
        <el-table
        :data="plans"
        :header-cell-style="{background: '#e5e9f2'}"
        >
            <el-table-column align="center" label="方案" min-width="10%">
                <template slot-scope="scope">
                {{ scope.row.name }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间" min-width="15%">
                <template slot-scope="scope">
                    {{ standardTimestamp(scope.row.created_ts) }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="最新运行" min-width="15%">
                <template slot-scope="scope">
                    {{ standardTimestamp(scope.row.last_run_ts) }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="描述" min-width="25%">
                <template slot-scope="scope">
                    {{ scope.row.description }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="所有回测" min-width="10%">
                <template slot-scope="scope">
                    <el-button style="margin-top: -6px" type="text" @click="showReportsDialog(scope.row.id)">
                        <i style="font-size:20px; color: gray " class="el-icon-document-copy"></i><span style="color: gray">({{ scope.row.report_count }})</span>
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" label="最新报告" min-width="10%">
                <template slot-scope="scope">
                    <el-button style="margin-top: -6px" type="text" @click="showLatestReportDialog(scope.row.latest_report_id, 'analyzer_rets,task,plan')" v-if="scope.row.report_count > 0">
                        <i style="font-size:20px; color: gray " class="el-icon-document"></i>
                    </el-button>
                    <el-button style="margin-top: -6px" type="text" @click="showLatestReportDialog(scope.row.latest_report_id, 'analyzer_rets')" disabled v-else>
                        <i style="font-size:20px; color: gray " class="el-icon-document"></i>
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" label="" min-width="10%">
                <template slot-scope="scope">
                    <div v-if="scope.row.running_report_count == 0">
                        <el-button style="margin-top: -6px" type="text" @click="scope.row.running_report_count = 1; asyncRunPlan(scope.row.id, scope.row.name)" >
                            <i style="font-size:20px; color: gray " class="el-icon-video-play"></i>
                        </el-button>
                    </div>
                    <div v-else>
                        <i style="font-size:20px; color: #409eff" class="el-icon-loading"></i>
                    </div>

                </template>
            </el-table-column>

            <el-table-column align="center" label="" min-width="10%">
                <template slot-scope="scope">
                    <el-button style="margin-top: -6px" type="text" @click="showUpdatePlanDialog(scope.row)">
                        <i style="font-size:20px; color: gray " class="el-icon-setting"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>  

        <!-- Diaglog: Reports -->
        <el-dialog width="85%" title="方案所有报告" :visible.sync="dialogReportsVisible">
            <reports
            v-loading="reportsLoading"
            v-bind:reports="reports">
            </reports>
            <div>
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="10"
                    @current-change="loadPlanReports"
                    :total="totalPlanReportsCount">
                </el-pagination>
            </div>
        </el-dialog> 

        <!-- Diaglog: Latest Report -->
        <el-dialog width="80%" title="" :visible.sync="dialogLatestReportVisible">
            <report
            v-bind:report="latestReport"
            v-bind:report-loading="latestReportLoading"
            v-bind:reload="reloadLatestReport">
            </report>
        </el-dialog> 

        <!-- Diaglog: Report Exception -->
        <el-dialog title="" :visible.sync="dialogExceptionReportVisible" align="left">
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

        <!-- Diaglog: 更新方案 -->
        <el-dialog width="85%" title="" :visible.sync="dialogUpdatePlanVisible" align="left">
            <div v-loading="planLoading">
                <h2>基本信息</h2>
                <hr/>
                <el-row class="grid-content" style="margin-bottom: 20px;">
                    <el-col :span="20" :offset="1">
                        <div style="margin-top: 20px">
                            <el-input
                                v-model="currentPlan.name"
                                placeholder="请输入方案名称"
                                style="width: 50%"
                            ></el-input>
                        </div>
                        <div style="margin-top: 20px; margin-bottom: 20px">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 10}"
                                placeholder="请输入方案描述..."
                                v-model="currentPlan.description"
                                style="width: 50%"
                            ></el-input>
                        </div>
                    </el-col>
                </el-row>

                <h2>回测参数</h2>
                <hr/>
                <params
                v-bind:backtest-params="currentPlan.params"
                v-bind:keep-params="true"
                v-bind:reload-params="reloadParams"
                >
                </params>

                <el-row>
                    <el-col :span="4" :offset="1">
                        <!-- 创建 Button -->
                        <div align="center">
                        <el-button type="primary" size="large" style="width: 90%; margin-top: 20px" @click="updatePlan()">更新</el-button>
                        </div>
                    </el-col>

                    <el-col :span="4">
                        <!-- 创建 & 运行 Button -->
                        <div align="center">
                        <el-button type="info" size="large" style="width: 90%; margin-top: 20px" @click="cancelUpdatePlan()" >取消</el-button>
                        </div>
                    </el-col>

                    <el-col :span="4" :offset="10">
                        <!-- 创建 & 运行 Button -->
                        <div align="center">
                        <el-button type="danger" size="large" style="width: 90%; margin-top: 20px" @click="deletePlan()">删除方案</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog> 
  </div>
</template>

<script>
import reports from '@/views/backtest/reports/_reports'
import report from '@/views/backtest/reports/_report'
import {deleteFromArray, standardTimestamp} from '@/utils/general'
import {getBacktestReportsByPlanId, getBacktestReportById} from '@/api/backtest_report'
import {getBacktestPlanById, updateBacktestPlan, deleteBacktestPlan} from '@/api/backtest_plan'
import config from '@/configs/system_configs'
import params from '@/views/backtest/_params/_params'
import {checkPlanParams} from '@/views/backtest/plans/utils'

export default {
  components: {
    reports,
    params,
    report,
  },

  props: {
      // 接收从父传入data
      plans: {
          type:Array,
          default:[]
      }
  },

  data() {
      return {
            dialogJsonVisible: false,
            jsonLoading: false,
            json: null,

            reports: null,
            reportsLoading: false,
            dialogReportsVisible: false,

            planLoading: false,
            dialogUpdatePlanVisible: false,
            currentPlan: {},
            currentRow: null,
            currentPlanId: null,
            
            latestReport: {},
            latestReportLoading: false,
            dialogLatestReportVisible: false,
            reloadLatestReport: 0,

            reloadParams: 0,

            dialogExceptionReportVisible: false,
            taskException: null,
            taskExceptionTb: null,

            totalPlanReportsCount: null
      }
  },

  methods: {
    // 修改plan: 展示
    showUpdatePlanDialog(row) {
        this.currentRow = row
        this.currentPlan['id'] = row.id
        this.planLoading = true
        getBacktestPlanById(config.backtestHost, row.id).then(response => {
            this.planLoading = false
            this.currentPlan = response.results[0]
            this.reloadParams += 1  
            this.dialogUpdatePlanVisible = true // 注意顺序: visible变量一般放最后!
        })       
    },

    // 修改plan: 发送到后台
    updatePlan(){
        var ret = checkPlanParams(this.currentPlan)
        
        if (ret.ok){
            // 检查成功: 发送更新请求
            updateBacktestPlan(config.backtestHost, this.currentPlan).then(response => {
                console.log(response)
                if (response.ok){
                    this.$message({
                        message: '回测方案:' + this.currentPlan.name + '更新成功.',
                        type: 'success'
                    })

                    // 更新name,descriptions(params的更新在table中不用体现)
                    this.currentRow.name = this.currentPlan.name
                    this.currentRow.description = this.currentPlan.description
                } else {
                    this.$message.error('回测方案:' + this.currentPlan.name + '更新失败!')
                }
            })
            this.dialogUpdatePlanVisible = false
        } else {
            // 检查失败
            this.$alert(ret.error, '', {
            confirmButtonText: '确定',
            type: 'warning'
            });
        }
    },

    // 删除plan: 发送到后台
    deletePlan(){
        this.$confirm('确定删除方案:' + this.currentRow.name + ' ?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // 发送更新请求
            deleteBacktestPlan(config.backtestHost, {id: this.currentRow.id}).then(response => {
                console.log(response)
                if (response.ok){
                    this.$message({
                        message: '回测方案:' + this.currentRow.name + '删除成功.',
                        type: 'success'
                    })

                    // 从table中删除row
                    deleteFromArray(this.plans, this.currentRow)
                } else {
                    this.$message.error('回测方案:' + this.currentPlan.name + '删除失败!')
                }
            }) 
            this.dialogUpdatePlanVisible = false
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });     
        });
    },

    // 展示该方案的所有报告
    showReportsDialog(plan_id, page=null) {
        this.reportsLoading = true
        this.dialogReportsVisible = true
        this.currentPlanId = plan_id
        var report_fields = 'id,name,task,created_ts,plan,run_seconds'
        getBacktestReportsByPlanId(config.backtestHost, plan_id, report_fields, page).then(response => {
            this.reports = response.results
            this.reportsLoading = false
            this.totalPlanReportsCount = response.count
        })       
    },

    loadPlanReports(page=null) {
        this.showReportsDialog(this.currentPlanId, page)
    },

    // 展示最新报告
    showLatestReportDialog(report_id, fields=null) {
        this.latestReportLoading = true
        getBacktestReportById(config.backtestHost, report_id, fields).then(response => {
            this.latestReportLoading = false
            this.latestReport = response.results[0]

            if (this.latestReport.task.status == 'running'){
                // task仍在运行
                this.$message('方案:' + this.latestReport.plan + '的最新回测仍在运行, 请稍后查看报告.')
            } else if (this.latestReport.task.ret.ok){
                // 报告正常
                this.dialogLatestReportVisible = true
                this.reloadLatestReport += 1    // 重新加载数据
            } else {
                // 报告异常(对应的task出现exception)
                this.dialogExceptionReportVisible = true
                this.taskException = this.latestReport.task.ret.error
                this.taskExceptionTb = this.latestReport.task.ret.tb
            }
        })       
    },

    // 取消创建plan
    cancelUpdatePlan(){
        this.dialogUpdatePlanVisible = false  
    },

    // 调用父组件函数
    asyncRunPlan(plan_id, plan_name){
      this.$emit('asyncRunPlan', plan_id, plan_name)
    },

    standardTimestamp:standardTimestamp,
  }
}
</script>
