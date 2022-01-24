<template>
    <div class="app-container" align="center" >
        <div style="width: 95%">
            <div align="left">
                <el-button style="margin-top: 0px; margin-bottom: 10px" type="primary" @click="showCreatePlanDialog()">
                    创建方案
                </el-button>
            </div>

            <!-- 所有的Plans -->
            <plans
            v-bind:plans="plans"
            @asyncRunPlan="asyncRunPlan"
            >
            </plans>
        </div>

        <div>
            <el-pagination
                layout="prev, pager, next"
                :page-size="10"
                @current-change="loadPlans"
                :total="totalCount">
            </el-pagination>
        </div>

        <!-- Diaglog: 创建新方案 -->
        <el-dialog width="85%" title="" :visible.sync="dialogCreatePlanVisible" >
            <div align="left">
                <h2>基本信息</h2>
                <hr/>
                <el-row class="grid-content" style="margin-bottom: 20px;">
                    <el-col :span="20" :offset="1">
                        <div style="margin-top: 20px">
                            <el-input
                                v-model="newPlan.name"
                                placeholder="请输入方案名称"
                                style="width: 50%"
                            ></el-input>
                        </div>
                        <div style="margin-top: 20px; margin-bottom: 20px">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 10}"
                                placeholder="请输入方案描述..."
                                v-model="newPlan.description"
                                style="width: 50%"
                            ></el-input>
                        </div>
                    </el-col>
                </el-row>

                <h2>回测参数</h2>
                <hr/>
                <params
                v-bind:backtest-params="newPlan.params"
                v-bind:reload-params="reloadParams"
                >
                </params>

                <el-row>
                    <el-col :span="4" :offset="1">
                        <!-- 创建 Button -->
                        <div align="center">
                        <el-button type="primary" size="medium" style="width: 90%; margin-top: 20px" @click="createPlan()">创建</el-button>
                        </div>
                    </el-col>

                    <el-col :span="4">
                        <!-- 创建 & 运行 Button -->
                        <div align="center">
                        <el-button type="info" size="medium" style="width: 90%; margin-top: 20px" @click="cancelCreatePlan()">取消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog> 
    </div>
</template>
    
<script>
import plans from '@/views/backtest/plans/_plans'
import {getBacktestPlans, createBacktestPlan, runBacktestPlan} from '@/api/backtest_plan'
import config from '@/configs/system_configs'
import params from '@/views/backtest/_params/_params'
import {checkPlanParams} from '@/views/backtest/plans/utils'


export default {
  components: {
    plans,
    params
  },

  data() {
    return {
        plans: null,

        dialogCreatePlanVisible: false,
        newPlan: {},

        needLoadPlans: false,

        refreshInterval: 5000,
        intervalId: null,

        reloadParams: 0,

        totalCount: null,
    }
  },
  
  created() {
    this.init(),
    this.startTimer()
  },

  methods: {
        init(){
            this.loadPlans()
            this.initNewPlan()  
        } ,

        // 更新plans
        loadPlans(page=null){
            var plan_fields = 'id,name,created_ts,last_run_ts,description,report_count,running_report_count,latest_report_id'
            getBacktestPlans(config.backtestHost, plan_fields, page).then(response => {
                this.plans = response.results
                this.totalCount = response.count

                // 更新needLoadPlans状态
                if(this.plansRunning(this.plans)){
                    this.needLoadPlans = true
                } else {
                    this.needLoadPlans = false
                }
            })
        },

        // 检查是否还有正在运行的plans(只要有1个plan在run就算)
        plansRunning(plans){
            for(var i = 0; i < plans.length; i++){
                if(plans[i].running_report_count > 0){
                    return true
                } 
            }
            return false
        },

        initNewPlan(){
            this.$set(this.newPlan, 'name', '')
            this.$set(this.newPlan, 'description', '')
            this.$set(this.newPlan, 'params', {})
        },

        // 展现创建plan dialog
        showCreatePlanDialog(){
            this.dialogCreatePlanVisible = true
            this.initNewPlan()
            this.reloadParams += 1    // 迫使component params初始化
        },

        // 创建New Plan
        createPlan(){
            var ret = checkPlanParams(this.newPlan)
            
            if (ret.ok){
                // 检查成功: 发送创建请求
                createBacktestPlan(config.backtestHost, this.newPlan).then(response => {
                    console.log(response)
                    if (response.ok){
                        this.$message({
                            message: '回测方案:' + this.newPlan.name + '创建成功.',
                            type: 'success'
                        })

                        // 更新plan table
                        this.loadPlans()
                    } else {
                        this.$message.error('回测方案:' + this.newPlan.name + '创建失败!')
                    }
                })
                this.dialogCreatePlanVisible = false
            } else {
                // 检查失败
                this.$alert(ret.error, '', {
                confirmButtonText: '确定',
                type: 'warning'
                });
            }
        }, 

        // 检查plan参数


        // 异步运行Plan
        asyncRunPlan(plan_id, plan_name){
            // 发送运行请求
            var data = { id: plan_id }
            runBacktestPlan(config.backtestHost, data).then(response => {
                console.log(response)
                if (response.ok){
                    this.$message({
                        message: '回测方案:' + plan_name + '开始运行, 结束后可查看运行报告.',
                        type: 'success'
                    })
                } else {
                    this.$message.error('回测方案:' + plan_name + '运行请求失败, 查看日志获取错误细节.')
                    console.log(response)
                }

                // 设置为需要更新
                this.restartTimer()
                this.needLoadPlans = true
            })     
        }, 

        // 取消创建plan
        cancelCreatePlan(){
            this.dialogCreatePlanVisible = false  
        },

        // 定时刷新plans
        startTimer() {
            // 计时器正在进行中，退出函数
            if (this.intervalId != null) {
                return;
            }

            // 计时器为空，操作
            this.intervalId = setInterval(() => {
                    console.log("刷新" + new Date());
                    if (this.needLoadPlans){
                        this.loadPlans()
                        console.log("更新plans.")
                    }
                }, this.refreshInterval);
        }, 

        // 停止定时器
        stopTimer() {
            clearInterval(this.intervalId); //清除计时器
            this.intervalId = null; //设置为null
        },

        // 重启定时器
        restartTimer() {
            this.stopTimer()
            this.startTimer()
        },
    },

    destroyed(){
        // 在页面销毁后，清除计时器
        this.stopTimer();
    }
}
</script>