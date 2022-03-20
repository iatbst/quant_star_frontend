<template>
  <!-- 经典3组件(pfo/worker/sp) -->
  <pfo-worker-sp
  v-bind:portfolios="portfolios"
  v-bind:portfolios-loading="portfoliosLoading"
  v-bind:currentPfo="currentPfo"

  v-bind:workers="workers"
  v-bind:workers-loading="workersLoading"
  v-bind:current-worker="currentWorker"

  v-bind:signal-points="signalPoints"
  v-bind:signal-points-loading="signalPointsLoading"

  @onClickPfo="onClickPfo"
  @onClickWorker="onClickWorker"
  ></pfo-worker-sp>
</template>


<script>
import config from '@/configs/system_configs'
import { getPortfolios } from '@/api/portfolio'
import { getWorkersByPfo } from '@/api/worker'
import { getSignalPointsByWorker } from '@/api/signal_point'
import pfoWorkerSp from '@/views/pfo_worker_sp/_pfo_worker_sp'

export default {
  components: {
    pfoWorkerSp
  },

  data() {
    return {
      host: null,
      pfo_hosts: config.pfoHosts,

      portfolios: null,
      portfoliosLoading: true,
      currentPfo: null,

      workers: null,
      workersLoading: true,
      currentWorker: null,

      signalPoints: null,
      signalPointsLoading: false,
    }
  },

  created() {
    this.init()
  },

  methods: { 
    // 初始化: 展示所有pfo;展示默认pfo的所有workers; 展示默认worker的所有sp 
    init() {
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
      this.currentPfo = pfo
      this.fetchWorkersByPfo(pfo, this.onClickWorker)
    },

    // 选择Worker时: 更新SignalPoints
    onClickWorker(worker){
      this.currentWorker = worker
      this.fetchSignalPointsByWorker(worker)
    },

    fetchWorkersByPfo(pfo, onWorkers) {
      this.workersLoading = true
      if (this.$route.query.status === 'all'){
        var status = null   // all 代表所有workers
      } else if (this.$route.query.status === null) {
        var status = 'normal' // 不指定只返回normal workers
      } else {
        var status = this.$route.query.status
      }
      getWorkersByPfo(pfo, status).then(response => {
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
      getSignalPointsByWorker(worker, this.currentPfo.host).then(response => {
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
