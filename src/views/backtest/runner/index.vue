<template>
  <div class="app-container" style="background-color: lightgray">
    <params
    v-bind:backtest-params="backtestParams"
    v-bind:reload-params="reloadParams"
    >
    </params>

    <el-row>
      <el-col :span="12">
        <!-- 运行 Button -->
        <div align="center">
          <el-button type="primary" size="large" style="width: 50%; margin-top: 20px" @click="runBacktest()">运行回测</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <!-- 清空 Button -->
        <div align="center">
          <el-button type="info" size="large" style="width: 50%; margin-top: 20px" @click="clearParams()">清空设置</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import params from '@/views/backtest/_params/_params'
import config from '@/configs/system_configs'
import { asyncRunTask } from '@/api/task'
import {checkBacktestParams} from '@/views/backtest/_params/utils'


export default {
  components: {
      params,
  },
  
  data() {
    return {
      // 最终请求params
      backtestParams: {},
      paramsError: '',
      reloadParams: 0,
    }
  },

  created() {
    this.init()
  },

  methods: {
    init(){

    },

    clearParams(){
      this.backtestParams = {}
      this.reloadParams += 1
      this.$message('设置已重置.')
    },

    runBacktest() {
      var ret = checkBacktestParams(this.backtestParams)

      if (ret.ok){
        // 检查通过: 发送回测请求
        var data = {
          name: "run_backtest", 
          params: this.backtestParams
        }

        // 输入回测名称,再次确认
        this.$prompt('请输入回测名称', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          // 开始回测
          this.backtestParams['name'] = value // null则后台指定默认值

          asyncRunTask(config.backtestHost, data).then(response => {
            console.log(response)
          })

          this.$message({
            type: 'success',
            message: '回测:' + value + '开始运行, 结果参考回测报告页面.'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '回测取消'
          });       
        });
      } else {
        // 检查未通过
        this.$alert(ret.error, '', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }
    },

  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>