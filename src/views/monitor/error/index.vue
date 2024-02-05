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
                <el-button style="width: 100%" type="primary" v-on:click="fetchDatas(scope.row.hosts)" plain>
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
                      <el-table-column align="left" label="时间" min-width="15%">
                        <template slot-scope="_scope">
                          {{ _scope.row.ts }}
                        </template>
                      </el-table-column>    

                      <el-table-column align="left" label="" min-width="10%" v-if="showPfo">
                        <template slot-scope="_scope">
                          {{ _scope.row.pfo }}
                        </template>
                      </el-table-column>   

                      <el-table-column align="left" label="消息" min-width="63%">
                        <template slot-scope="_scope">
                          {{ _scope.row.message }}
                        </template>
                      </el-table-column> 

                      <el-table-column align="center" label="次数" min-width="6%">
                        <template slot-scope="_scope">
                          <el-link type="text" @click="showTsDialog(_scope.row.tsList)">
                            {{ _scope.row.count }}次
                          </el-link>
                        </template>
                      </el-table-column>   

                      <el-table-column align="center" label="" min-width="6%">
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

        <div align="center" v-if="showPage">
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
      }, 
      // {
      //  name: 'backtest',
      //   hostRole: 'backtest',
      //   hosts: [config.backtestHost]
      // }, 
      {
       name: 'portfolios',
        hostRole: 'pfo',
        hosts: config.pfoHosts
      }],
      portfolioList: null,
      portfolioListLoading: true,
      // currentPfo: null,
      currentHosts: null,

      errorTableLoading: true,
      errorTableList: [],
      errorTableDict: {},

      hostPfoMap: {},
      showPfo: false,
      showPage: false,  // 只有从单一host获取errors时才能启用pages

      jsonData: null,
      dialogJsonVisible: false,

      tsList: null,
      dialogTsVisible: false,

      totalCount: null,
      currentPage: null,

      refreshInterval: 300000,
      intervalId: null
    }
  },

  created() {
    this.fetchDatas(config.pfoHosts)  // 默认展示portfolios的Errors
    this.dataRefreh()
  },

  methods: {
    levelIcon(level) {
      if (level === 'alert'){
        return "<i style=\"font-size:20px; color: orange \" class=\"el-icon-warning\"></i>"
      } else if (level === 'exception'){
        return "<i style=\"font-size:20px; color: black \" class=\"el-icon-question\"></i>"
      } else if (level === 'error') {
        return "<i style=\"font-size:20px; color: red \" class=\"el-icon-error\"></i>"
      } else if (level === 'warn') {
        return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-info\"></i>"
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

    fetchDatas(hosts, page=null){
      if (hosts.length == 1){
        this.showPfo = false
        this.showPage = true
      } else {
        this.showPfo = true
        this.showPage = false
      }
      var request_count = 0
      if (this.showPfo){
        // 需要先获取所有的pfo
        for(const host of hosts){
          getPortfolios(host).then(response => {
            var pfo = response.results[0].alias // 每个pfo host上只能有一个pfo
            this.hostPfoMap[host] = pfo
            request_count += 1
            if (request_count == hosts.length){
              // hostPfoMap生成 
              this.fetchErrors(hosts, page)
            }
          })
        }      
      } else {
        // 不需要pfo数据
        this.fetchErrors(hosts, page)
      }
    },

    fetchErrors(hosts, page=null) {
      this.errorTableList = []
      this.totalCount = 0
      this.currentHosts = hosts
      this.errorTableLoading = true
      var request_count = 0
      if (!this.showPage){
        page = null
      }
      for(const host of hosts){
        getErrors(host, page).then(response => {
          // 添加pfo
          if (this.showPfo){
            for(var i=0; i < response.results.length; i++){
              response.results[i]['pfo'] = this.hostPfoMap[response.config.baseURL]
            }
          }
          this.errorTableList = this.errorTableList.concat(response.results)
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
      this.fetchDatas(this.currentHosts, page)
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
      // 按照时间排序: 新 -> 旧
      this.errorTableList.sort((a, b) => a.ts.localeCompare(b.ts)).reverse()

      this.errorTableDict = {}
      for(var i=0; i < this.errorTableList.length; i++ ){
        var type = this.errorTableList[i].type
        var level = this.errorTableList[i].level
        var pfo = this.errorTableList[i].pfo
        var ts = this.formatTimestamp(this.errorTableList[i].ts)
        var data = this.errorTableList[i].data
        var message = data.message
        if (!this.errorTableDict.hasOwnProperty(type)){
          // 新type
          var key = pfo+message
          this.errorTableDict[type] = {
            type: type,
            ts: ts,
            level: level,
            count: 1,
            messages: {
              [key]: {
                pfo: pfo,
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
          var key = pfo+message
          if (!this.errorTableDict[type].messages.hasOwnProperty(key)){
            // 新message
            this.errorTableDict[type].messages[key] = {
              pfo: pfo,
              message: message,
              ts: ts,
              count: 1,
              tsList: [ts],
              data: data,
            }
          } else {
            // message存在
            this.errorTableDict[type].messages[key].count += 1
            this.errorTableDict[type].messages[key].tsList.push(ts)
          }
        }
      }
      //console.log(this.errorTableDict)
    },

    // 定时刷新数据函数
    dataRefreh() {
        // 计时器正在进行中，退出函数
        if (this.intervalId != null) {
            return;
        }

        // 计时器为空，操作
        this.intervalId = setInterval(() => {
                console.log("刷新" + new Date());
                this.fetchDatas(config.pfoHosts); //加载数据函数
            }, this.refreshInterval);
    }, 

    // 停止定时器
    clear() {
        clearInterval(this.intervalId); //清除计时器
        this.intervalId = null; //设置为null
    },
  },

  destroyed(){
      // 在页面销毁后，清除计时器
      this.clear();
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