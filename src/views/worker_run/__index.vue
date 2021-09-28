<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- 所有的Portfolios -->
          <portfolios 
          v-bind:portfolios="portfolios"
          v-bind:portfolios-loading="portfoliosLoading"
          @onClickPfo="onClickPfo"></portfolios>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- 指定portfolio的所有workers -->
          <workers 
          v-bind:workers="workers"
          v-bind:workers-loading="workersLoading"
          @onClickWorker="onClickWorker"></workers>
        </div>
      </el-col>

      <el-col :span="16">
        <div class="grid-content bg-purple">
          <!-- 指定worker的runs -->
          <signal-points 
          v-bind:signal-points="signalPoints"
          v-bind:current-worker="currentWorker"
          v-bind:host="host"
          v-bind:signal-points-loading="signalPointsLoading"
          ></signal-points>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import config from '@/configs/system_configs'
import { getPortfolios } from '@/api/portfolio'
import { getWorkersByPfo } from '@/api/worker'
import { getSignalPointsByWorker } from '@/api/signal_point'
import signalPoints from '@/views/signal_point/_worker_sps'
import workers from '@/views/worker/_workers'
import portfolios from '@/views/portfolio/_portfolios'

export default {
  components: {
    signalPoints,
    workers,
    portfolios,
  },

  data() {
    return {
      host: null,
      pfo_hosts: config.pfoHosts,

      portfolios: null,
      portfoliosLoading: true,

      workers: null,
      workersLoading: true,
      currentWorker: null,

      signalPoints: null,
      signalPointsLoading: false,
    }
  },
  created() {
    this.fetchPortfolios()
  },
  methods: {  
    fetchPortfolios() {
      this.portfoliosLoading = true
      this.portfolios = []
      var request_count = 0
      for (var i = 0; i < this.pfo_hosts.length; i++){
        getPortfolios(this.pfo_hosts[i]).then(response => {
          response.results[0]['sort_id'] = config.pfoSortWeights[response.results[0]['name']]
          this.portfolios = this.portfolios.concat(response.results)
          request_count += 1
          if (request_count == this.pfo_hosts.length){
            // pfo加载完成
            this.portfolios.sort((a, b) => a.sort_id - b.sort_id)
            this.portfoliosLoading = false
            if (this.portfolios.length > 0){
              this.onClickPfo(this.portfolios[0])
            }
          }
        })
      }
    },

    // 选择Pfo时: 更新Workers/SignalPoints
    onClickPfo(pfo){
      this.host = pfo.host
      this.fetchWorkersByPfo(pfo, this.onClickWorker)
    },

    // 选择Worker时: 更新SignalPoints
    onClickWorker(worker){
      this.currentWorker = worker
      this.fetchSignalPointsByWorker(worker)
    },

    fetchWorkersByPfo(pfo, onWorkers) {
      this.workersLoading = true
      getWorkersByPfo(pfo).then(response => {
        response.results.sort(function(a,b){return a.name.localeCompare(b.name)})
        this.workers = response.results
        this.workersLoading = false
        if (this.workers.length > 0){
          // 回调
          onWorkers(this.workers[0])
        } else {
          this.signalPoints = []
        }
      })
    },

    fetchSignalPointsByWorker(worker) {
      this.signalPointsLoading = true
      getSignalPointsByWorker(worker, this.host).then(response => {
        this.signalPoints = response.results
        this.signalPointsLoading = false
      })
    },
  }
}
</script>

<style>
  .el-row {
    margin-bottom: -40px;
    &:last-child {
      margin-bottom: 0;
    };
    &:first-child {
      margin-top: 0px;
    };
    padding: 0px;
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
  .el-table__row>td{
    border: none;
    padding: 5px;
  }
  .el-table::before {
    height: 0px;
  }
</style>
