<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-table
            :data="hostsList"
            style="width: 100%"
          >
            <el-table-column align="center" label="">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary" v-on:click="fetchErrors(scope.row.hosts)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
      </el-col>


      <el-col :span="20">
        <div class="grid-content bg-purple">
          <!-- Errors.type表 -->
          <el-table
            v-loading="errorTableLoading"
            :data="errorList"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px"
            :header-cell-style="{ background: 'lightgray' }"
          >

            <el-table-column align="left" label="级别" min-width="5%">
              <template slot-scope="scope">
                <span v-html="levelIcon(scope.row.level)"> </span>
              </template>
            </el-table-column> 

           <el-table-column align="left" label="时间" min-width="15%">
              <template slot-scope="scope">
                {{ formatTimestamp(scope.row.ts) }}
              </template>
            </el-table-column>    

            <el-table-column align="left" label="类型" min-width="15%">
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column> 

            <el-table-column align="left" label="内容" min-width="65%">
              <template slot-scope="scope">
                {{ scope.row.data.message }}
              </template>
            </el-table-column> 


          </el-table>
  
        </div>

        <div align="center">
            <el-pagination
                layout="prev, pager, next"
                :page-size="500"
                :current-page.sync="currentPage"
                @current-change="fetchErrorsByPage"
                :total="totalCount">
            </el-pagination>
        </div>
      </el-col>
    </el-row>

    <el-dialog width="80%" title="JSON详情" :visible.sync="dialogJsonVisible">
      <pre>{{ jsonData }}</pre>
    </el-dialog>

    <el-dialog width="20%" title="Timestamps详情" :visible.sync="dialogTsVisible">
      <pre>{{ tsList }}</pre>
    </el-dialog>
  </div>


</template>


<script>
import config from '@/configs/system_configs'
import { getPortfolios } from '@/api/portfolio'
import { getErrorsByPortfolio, getErrors } from '@/api/error'
import moment from 'moment'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    epochToTimestamp(ts) {
      if (ts) {
        const stillUtc = moment.utc(ts*1000).toDate()
        return moment(stillUtc)
        .local()
        .format('YYYY-MM-DD HH:mm:ss')
      } else {
        return '--'
      }
      return ts.replace('T', ' ').slice(0, 19)
    },
    chineseString(s) {
      var cs
      if (s === 'error'){
        cs = '错误'
      } else if (s === 'exception'){
        cs = '异常'
      } else {
        cs = s
      }
      return cs
    },
  },
  data() {
    return {
      host: null,
      hostsList: [{
        name: 'master',
        hostRole: 'master',
        hosts: [config.masterHost],
      }, {
       name: 'backtest',
        hostRole: 'backtest',
        hosts: [config.backtestHost]
      }, {
       name: 'portfolios',
        hostRole: 'pfo',
        hosts: config.pfoHosts
      }],
      portfolioList: null,
      portfolioListLoading: true,
      // currentPfo: null,
      currentHosts: null,

      errorTableLoading: true,
      errorList: [],
      errorTableDict: {},

      jsonData: null,
      dialogJsonVisible: false,

      tsList: null,
      dialogTsVisible: false,

      totalCount: null,
      currentPage: null
    }
  },
  created() {
    this.fetchErrors(config.pfoHosts)  // 默认展示portfolios的Errors
  },
  methods: {
    levelIcon(level) {
      if (level === 'critical'){
        return "<i style=\"font-size:20px; color: red \" class=\"el-icon-error\"></i>"
      } else if (level === 'exception'){
        return "<i style=\"font-size:20px; color: red \" class=\"el-icon-warning\"></i>"
      } else if (level === 'error') {
        return "<i style=\"font-size:20px; color: red \" class=\"el-icon-error\"></i>"
      } else if (level === 'warn') {
        return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-question\"></i>"
      } else {
        return "<i style=\"font-size:20px; color: lightgray \" class=\"el-icon-warning\"></i>"
      }
    },
    showJsonDialog(data) {
      this.jsonData = JSON.stringify(data,null,2).replace(/\\n/g,"\n").replace(/\\"/g,"'")
      // console.log(this.jsonData)
      // debugger;
      this.dialogJsonVisible = true
    },
    showTsDialog(list){
      this.tsList = list
      this.dialogTsVisible = true
    },
    fetchErrors(hosts, page=null) {
      this.errorList = []
      this.totalCount = 0
      this.currentHosts = hosts
      this.errorTableLoading = true
      var request_count = 0
      for(const host of hosts){
        getErrors(host, page).then(response => {
          this.errorList = this.errorList.concat(response.results)
          this.totalCount += response.count
          request_count += 1
          if (request_count == hosts.length){  
            // 获取到全部errors
            if (page){
              this.currentPage = page
            } else {
              this.currentPage = 1
            }
            this.errorTableLoading = false
            this.parseErrorList()         
          }
        })       
      }
    },
    fetchErrorsByPage(page) {
      this.fetchErrors(this.currentHosts, page)
    },
    // fetchPortfolios() {
    //   this.portfolioListLoading = true
    //   this.portfolioList = []
    //   var request_count = 0
    //   for (var i = 0; i < config.pfoHosts.length; i++){
    //     getPortfolios(config.pfoHosts[i]).then(response => {
    //       this.portfolioList = this.portfolioList.concat(response.results)
    //       request_count += 1
    //       if (request_count == config.pfoHosts.length){
    //         // pfo加载完成
    //         this.portfolioList.sort((a, b) => a.name.localeCompare(b.name))
    //         this.portfolioListLoading = false
    //       }
    //     })
    //   }
    // },
    formatTimestamp(ts) {
      if (ts) {
        const stillUtc = moment.utc(ts).toDate()
        return moment(stillUtc)
        .local()
        .format('YYYY-MM-DD HH:mm:ss')
      } else {
        return '--'
      }
      return ts.replace('T', ' ').slice(0, 19)
    },
    parseErrorList(){
      // 
      // 按照时间排序
      this.errorList.sort((a, b) => a.ts.localeCompare(b.ts)).reverse()
    }
  }
}
</script>

<style>
  pre {
    display: inline;
  }

  .el-table__row>td{
    border: none;
    padding: 5px;
  }
</style>

<style scoped>
.el-table tbody tr:hover>td { 
    background-color:#ffffff!important
}
</style>