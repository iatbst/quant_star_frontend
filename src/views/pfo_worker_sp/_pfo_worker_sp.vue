<!-- 
    模板: 三联组经典展示(pfo/worker/sp)
    - 此模板是中间组件(上有父组件, 下有子组件)
    - 参数1: 展示哪些pfo
    - 参数2: 展示pfo的哪些workers, 如下
        - 展示pfo的所有workers
        - 展示pfo的warn workers (有warn sp的workers)
        - 展示pfo的error workers
        - 展示符合特定条件的, eg 某个symbol的workers
        - etc
-->

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
import signalPoints from '@/views/signal_point/_worker_sps'
import workers from '@/views/worker/_workers'
import portfolios from '@/views/portfolio/_portfolios'

export default {
  components: {
    signalPoints,
    workers,
    portfolios,
  },

  props: {
    portfolios: {
        type:Array,
        default:[]
    },
    portfoliosLoading: {
        type: Boolean,
        default: true
    },
    workers: {
        type:Array,
        default:[]
    },
    workersLoading: {
        type: Boolean,
        default: true
    },
    signalPoints: {
        type:Array,
        default:[]
    },
    signalPointsLoading: {
        type: Boolean,
        default: true
    },
    currentWorker: {
        type: Object,
        default: {}
    },
    host: {
        type: String,
        default: ''
    }
  },

  methods: {  
    // 选择Pfo时: 由父组件处理
    onClickPfo(pfo){
      this.$emit('onClickPfo', pfo)
    },

    // 选择Worker时: 由父组件处理
    onClickWorker(worker){
      this.$emit('onClickWorker', worker)
    },
  }
}
</script>
