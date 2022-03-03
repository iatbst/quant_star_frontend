<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-table
            :data="masterList"
            style="width: 100%"
          >
            <el-table-column align="center" label="Master主机">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary" v-on:click="fetchErrors(scope.row.host)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
        <div class="grid-content bg-purple">
          <!-- 所有的Portfolios -->
          <el-table
            v-loading="portfolioListLoading"
            :data="portfolioList"
            style="width: 100%"
            :highlight-current-row="true"
          >
            <el-table-column align="center" label="投资组合">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary"  v-on:click="fetchErrors(scope.row.host)" plain>
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
            :data="Object.values(errorTableDict)"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px"
            :header-cell-style="{ background: 'lightgray' }"
          >

            <el-table-column align="center" type="expand">
              <template slot-scope="scope">


                    <!-- Errors.messages表 -->
                    <el-table
                      :data="Object.values(scope.row.messages)"
                      style="width: 100%; margin-bottom: 20px"
                      :header-cell-style="{ background: 'white' }"
                      :show-header="false"
                    >
                      <el-table-column align="center" label="时间" min-width="15%">
                        <template slot-scope="_scope">
                          {{ _scope.row.ts }}
                        </template>
                      </el-table-column>    

                      <el-table-column align="center" label="消息" min-width="65%">
                        <template slot-scope="_scope">
                          {{ _scope.row.message }}
                        </template>
                      </el-table-column> 

                      <el-table-column align="center" label="次数" min-width="10%">
                        <template slot-scope="_scope">
                          <el-link type="text" @click="showTsDialog(_scope.row.tsList)">
                            {{ _scope.row.count }}次
                          </el-link>
                        </template>
                      </el-table-column>   

                      <el-table-column align="center" label="" min-width="10%">
                        <template slot-scope="_scope">
                          <el-link type="text" @click="showJsonDialog(_scope.row.data)">JSON</el-link>
                        </template>
                      </el-table-column>                     
                    </el-table>
              </template>
            </el-table-column>

            <el-table-column align="left" label="级别" min-width="5%">
              <template slot-scope="scope">
                <span v-html="levelIcon(scope.row.level)"> </span>
              </template>
            </el-table-column> 

           <el-table-column align="left" label="时间" min-width="15%">
              <template slot-scope="scope">
                {{ scope.row.ts }}
              </template>
            </el-table-column>    

            <el-table-column align="left" label="类型" min-width="65%">
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column> 

            <el-table-column align="left" label="次数" min-width="15%">
              <template slot-scope="scope">
                {{ scope.row.count }}
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
      masterList: null,
      portfolioList: null,
      portfolioListLoading: true,
      // currentPfo: null,
      currentHost: null,

      errorTableLoading: true,
      errorTableList: [],
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
    this.fetchMasterHosts()
    this.fetchPortfolios()
  },
  methods: {
    levelIcon(level) {
      if (level === 'critical'){
        return "<i style=\"font-size:20px; color: black \" class=\"el-icon-error\"></i>"
      } else if (level === 'exception'){
        return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-warning\"></i>"
      } else if (level === 'error') {
        return "<i style=\"font-size:20px; color: red \" class=\"el-icon-error\"></i>"
      } else if (level === 'warn') {
        return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-question\"></i>"
      } else {
        return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-warning\"></i>"
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
    fetchMasterHosts() {
      this.masterList = [{
        name: 'master',
        hostRole: 'master',
        host: config.masterHost,
      }, {
       name: 'backtest',
        hostRole: 'backtest',
        host: config.backtestHost
      }]
      this.fetchErrors(config.masterHost)  // 默认展示master的Errors
    },
    fetchErrors(host, page=null) {
      this.currentHost = host
      this.errorTableLoading = true
      if (page){
        this.currentPage = page
      } else {
        this.currentPage = 1
      }
      getErrors(host, page).then(response => {
        this.errorTableList = response.results
        this.totalCount = response.count
        this.errorTableLoading = false
        this.parseErrorList()
      })
    },
    fetchErrorsByPage(page) {
      this.fetchErrors(this.currentHost, page)
    },
    fetchPortfolios() {
      this.portfolioListLoading = true
      this.portfolioList = []
      for (var i = 0; i < config.pfoHosts.length; i++){
        getPortfolios(config.pfoHosts[i]).then(response => {
          response.results[0]['sort_id'] = config.pfoSortWeights[response.results[0]['name']]
          this.portfolioList = this.portfolioList.concat(response.results)
          if (this.portfolioList.length == config.pfoHosts.length){
            // pfo加载完成
            this.portfolioList.sort((a, b) => a.sort_id - b.sort_id)
            this.portfolioListLoading = false
          }
        })
      }
    },
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
      this.errorTableDict = {}
      for(var i=0; i < this.errorTableList.length; i++ ){
        var type = this.errorTableList[i].type
        var level = this.errorTableList[i].level
        var ts = this.formatTimestamp(this.errorTableList[i].ts)
        var data = this.errorTableList[i].data
        var message = data.message
        if (!this.errorTableDict.hasOwnProperty(type)){
          // 新type
          this.errorTableDict[type] = {
            type: type,
            ts: ts,
            level: level,
            count: 1,
            messages: {
              [message]: {
                message: message,
                ts: ts,
                count: 1,
                tsList: [ts],
                data: data,
              } 
            }
          }
        } else {
          // type存在
          this.errorTableDict[type].count += 1
          if (ts > this.errorTableDict.ts){
            // 相同type记录最新的ts
            this.errorTableDict.ts = ts
          }
          if (!this.errorTableDict[type].messages.hasOwnProperty(message)){
            // 新message
            this.errorTableDict[type].messages[message] = {
              message: message,
              ts: ts,
              count: 1,
              tsList: [ts],
              data: data,
            }
          } else {
            // message存在
            this.errorTableDict[type].messages[message].count += 1
            if (ts > this.errorTableDict[type].messages[message].ts){
              // 相同message记录最新的ts
              this.errorTableDict[type].messages[message].ts = ts
            }
            this.errorTableDict[type].messages[message].tsList.push(ts)
          }
        }
      }
      //console.log(this.errorTableDict)
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