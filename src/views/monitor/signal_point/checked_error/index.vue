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
import { getSignalPointsByWorker, getSignalPointsByFinalState } from '@/api/signal_point'
import pfoWorkerSp from '@/views/pfo_worker_sp/_pfo_worker_sp'

export default {
  components: {
    pfoWorkerSp
  },

  data() {
    return {
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
      this.fetchWorkersBySp('error', this.onClickWorker)
    },

    // 选择Worker时: 更新SignalPoints
    onClickWorker(worker){
      this.currentWorker = worker
      this.fetchSignalPointsByWorker(worker)
    },

    // 获取指定pfo的所有warn workers(有warn sp的workers)
    fetchWorkersBySp(sp_state, onWorkers) {
        this.workersLoading = true
        this.workers = []
        this.workerIDs = new Set()
        getSignalPointsByFinalState(sp_state, this.currentPfo.host, true).then(response => {
          var signalPointList = response.results
          for (var i=0; i < signalPointList.length; i++){
              if (!this.workerIDs.has(signalPointList[i].worker.id)){
                // 新worker
                this.workerIDs.add(signalPointList[i].worker.id)
                this.workers.push(signalPointList[i].worker)
              }
          }
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