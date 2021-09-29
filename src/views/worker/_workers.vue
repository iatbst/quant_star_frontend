<!-- 
    模板: 展示传入的workers
-->
<template>
  <div>
    <el-table
      v-loading="workersLoading"
      :data="workers"
      style="width: 100%"
      height="750"
    >
      <el-table-column align="center" label="策略机器人">
        <template slot-scope="scope">
          <el-button style="width: 100%" v-bind:class="{currentWorker: currentWorker.id == scope.row.id}" type="primary" v-on:click="onClickWorker(scope.row)" plain>
            {{ scope.row.name }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>   
  </div>
</template>

<script>


export default {

  props: {
      // 接收从父传入data
      workers: {
          type:Array,
          default:[]
      },
      workersLoading: {
          type: Boolean,
          default: true
      },
      currentWorker: {
          type: Object,
          default: {}
      }
  },

  methods: {
    onClickWorker(worker) {
      this.$emit('onClickWorker', worker)
    },
  }
}
</script>

<style>

.currentWorker {
  color: #FFF !important;
  background-color:#409EFF !important;
  border-color: #409EFF !important;
}

</style>