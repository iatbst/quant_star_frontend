<!-- 
    模板: 展示传入的portfolios
-->
<template>
  <div>
    <el-table
    v-loading="portfoliosLoading"
    :data="portfolios"
    style="width: 100%"
    height="750"
    >
    <el-table-column align="center" label="投资组合">
        <template slot-scope="scope">
        <el-button style="width: 100%" v-bind:class="{currentPfo: currentPfo.name == scope.row.name}" type="primary" v-on:click="onClickPfo(scope.row)" plain>
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
      portfolios: {
          type:Array,
          default:[]
      },
      portfoliosLoading: {
          type: Boolean,
          default: true
      },
      currentPfo: {
          type: Object,
          defautl: {}
      }
  },

  created() {
      // pfo排序
      //debugger
      //this.portfolios.sort((a, b) => a.name.localeCompare(b.name))
  },

  methods: {
    onClickPfo(pfo) {
        this.$emit('onClickPfo', pfo)
    },
  }
}
</script>

<style>

.currentPfo {
  color: #FFF !important;
  background-color:#409EFF !important;
  border-color: #409EFF !important;
}


</style>
