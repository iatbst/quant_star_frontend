<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <!-- 所有的Portfolios -->
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-table
            v-loading="portfolioListLoading"
            :data="portfolioList"
            style="width: 100%"
          >
            <el-table-column align="center" label="投资组合">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary" v-on:click="fetchMonitorStatsByPortfolio(scope.row)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
      </el-col>

      <el-col :span="20" v-if="showSummaryTable">
        <div class="grid-content bg-purple" style="margin-top: 20px">
          <!-- 所有Pfo汇总表 -->
          <el-table
            v-loading="summaryTableLoading"
            :data="summaryTable"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px;"
            header-cell-style="background: lightgray; padding:5px"
            border
            cell-style="padding:5px"
          >
            <el-table-column align="center" label="投资组合" min-width="10%">
              <template slot-scope="scope">
                <span style="cursor: pointer" v-on:click="fetchMonitorStatsByPortfolio(scope.row.pfo)">
                  {{ scope.row.pfo.name }}
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="主进程状态" min-width="10%">
              <template slot-scope="scope">
                <span v-html="statusIcon(scope.row.process_status)"> </span>
                <span style="color:red" v-if="moment().unix() - scope.row.process_ts > updateTimeout">
                  ({{ scope.row.process_ts | epochToTimestamp }})
                </span>
                <span v-else>
                  ({{ scope.row.process_ts | epochToTimestamp }})
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="子线程状态" min-width="10%">
              <template slot-scope="scope" v-if="scope.row.thread_status">
                <span v-html="statusIcon(scope.row.thread_status)"> </span>
                <span style="color:red" v-if="moment().unix() - scope.row.thread_ts > updateTimeout">
                  ({{ scope.row.thread_ts | epochToTimestamp }})
                </span>
                <span v-else>
                  ({{ scope.row.thread_ts | epochToTimestamp }})
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="Host状态" min-width="10%">
              <template slot-scope="scope">
                <span v-html="statusIcon(scope.row.os_status)"> </span>
                <span style="color:red" v-if="moment().unix() - scope.row.os_ts > updateTimeout">
                  ({{ scope.row.os_ts | epochToTimestamp }})
                </span>
                <span v-else>
                  ({{ scope.row.os_ts | epochToTimestamp }})
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="Disk" min-width="5%">
              <template slot-scope="scope">
                <span style="color: red" v-if="Number(scope.row.os_disk.slice(0, -1)) >= 90">
                  {{ scope.row.os_disk }}
                </span>
                <span v-else>
                  {{ scope.row.os_disk }}
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="Mem" min-width="5%">
              <template slot-scope="scope">
                <span style="color: red" v-if="Number(scope.row.os_mem.slice(0, -1)) >= 90">
                  {{ scope.row.os_mem }}
                </span>
                <span v-else>
                  {{ scope.row.os_mem }}
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="DB" min-width="3%">
              <template slot-scope="scope">
                <span style="color: red" v-if="Number(scope.row.os_db_conn) >= 20">
                  {{ scope.row.os_db_conn }}
                </span>
                <span v-else>
                  {{ scope.row.os_db_conn }}
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="APIs状态" min-width="10%">
              <template slot-scope="scope" v-if="scope.row.gw_status">
                <span v-html="statusIcon(scope.row.gw_status)"> </span>
                <span style="color:red" v-if="moment().unix() - scope.row.gw_ts > updateTimeout">
                  ({{ scope.row.gw_ts | epochToTimestamp }})
                </span>
                <span v-else>
                  ({{ scope.row.gw_ts | epochToTimestamp }})
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="APIs-小时" min-width="5%">
              <template slot-scope="scope" v-if="scope.row.gw_status">
                  <span style="color:red" v-if="scope.row.gw_hour_ratio < 0.9">
                    {{ (scope.row.gw_hour_ratio*100).toFixed(2) }}%
                  </span>
                  <span v-else>
                    {{ (scope.row.gw_hour_ratio*100).toFixed(2) }}%
                  </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="APIs-今日" min-width="5%">
              <template slot-scope="scope" v-if="scope.row.gw_status">
                  <span style="color:red" v-if="scope.row.gw_day_ratio < 0.9">
                    {{ (scope.row.gw_day_ratio*100).toFixed(2) }}%
                  </span>
                  <span v-else>
                    {{ (scope.row.gw_day_ratio*100).toFixed(2) }}%
                  </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="Feeds" min-width="5%">
              <template slot-scope="scope" v-if="scope.row.feed_count > 0">
                <span style="color: green">{{ scope.row.feed_success_count }}</span>/{{ scope.row.feed_count }}
              </template>
            </el-table-column> 

            <el-table-column align="center" label="FEx" min-width="3%">
              <template slot-scope="scope" v-if="scope.row.feed_count > 0">
                  <span style="color:red" v-if="scope.row.feed_expire_count > 0">
                    {{ scope.row.feed_expire_count }}
                  </span>
                  <span v-else>
                    {{ scope.row.feed_expire_count }}
                  </span>
              </template>
            </el-table-column>           
          </el-table>
        </div>        
      </el-col>

      <el-col :span="20" v-loading="monitorStatListLoading" v-else>
        <div class="grid-content" style="margin-top: 20px" >
          <!-- Processes -->
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px; margin-top: 45px" v-if="monitorStatProcessData">
            <div class="text item">
              <el-row :gutter="15" class="el-row" style="margin-top: 10px; margin-bottom: 10px">
                <el-col :span="5" align="left">   
                  <span style="font-size: 15px">主进程状态</span>
                  <span style="color:red" v-if="moment().unix() - monitorStatProcessData.data.ts > updateTimeout">
                  ({{ monitorStatProcessData.data.ts | epochToTimestamp }})  
                  </span> 
                  <span v-else>
                  ({{ monitorStatProcessData.data.ts | epochToTimestamp }})  
                  </span>                           
                </el-col>
                <el-col :span="8" align="left">   
                  <span v-html="statusIcon(getStatus(monitorStatProcessData))"> </span>
                </el-col>
                <el-col :span="10" align="right">   
                  <el-link type="text" @click="showJsonDialog(monitorStatProcessData)">JSON</el-link>
                </el-col>
              </el-row>              
            </div>
          </el-card>

          <!-- Threads -->
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px" v-if="!masterHost && monitorStatThreadData">
            <div class="text item">
              <el-row :gutter="15" class="el-row" style="margin-top: 10px; margin-bottom: 10px">
                <el-col :span="5" align="left">   
                  <span style="font-size: 15px">子线程状态</span>
                  <span style="color:red" v-if="moment().unix() - monitorStatThreadData.data.ts > updateTimeout">
                    ({{ monitorStatThreadData.data.ts | epochToTimestamp }})  
                  </span> 
                  <span v-else>
                    ({{ monitorStatThreadData.data.ts | epochToTimestamp }})  
                  </span>  
                </el-col>
                <el-col :span="8" align="left">   
                  <span v-html="statusIcon(getStatus(monitorStatThreadData))"> </span>
                </el-col>
                <el-col :span="10" align="right">   
                  <el-link type="text" @click="showJsonDialog(monitorStatThreadData)">JSON</el-link>
                </el-col>
              </el-row>              
            </div>
          </el-card>

          <!-- OS -->
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px" v-if="monitorStatOSData">
            <div class="text item">
              <el-row :gutter="15" class="el-row" style="margin-top: 10px; margin-bottom: 10px">
                <el-col :span="5" align="left">   
                  <span style="font-size: 15px">云主机状态</span>
                  <span style="color:red" v-if="moment().unix() - monitorStatOSData.data.ts > updateTimeout">
                    ({{ monitorStatOSData.data.ts | epochToTimestamp }})
                  </span>
                  <span  v-else>
                    ({{ monitorStatOSData.data.ts | epochToTimestamp }})
                  </span>                  
                </el-col>
                <el-col :span="1" align="left">   
                  <span v-html="statusIcon(getStatus(monitorStatOSData))"> </span>
                </el-col>
                <el-col :span="4" align="right">  
                  磁盘:
                  <span v-if="monitorStatOSData == null">
                    N/A
                  </span>
                  <span style="color: red" v-else-if="Number(monitorStatOSData.data.disk_usage.slice(0, -1)) > 90">
                    {{ monitorStatOSData.data.disk_usage }}
                  </span>
                  <span v-else>
                    {{ monitorStatOSData.data.disk_usage }}
                  </span>
                </el-col>
                <el-col :span="4" align="right">  
                  内存:{{monitorStatOSData == null ? 'N/A' : monitorStatOSData.data.mem_usage}}
                </el-col>
                <el-col :span="4" align="right">  
                  DB连接:{{monitorStatOSData == null ? 'N/A' : monitorStatOSData.data.db_conn}}
                </el-col>
                <el-col :span="5" align="right">   
                  <el-link type="text" @click="showJsonDialog(monitorStatOSData)">JSON</el-link>
                </el-col>
              </el-row>              
            </div>
          </el-card>

          <!-- Gateways -->
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px" v-if="!masterHost && monitorStatGatewayData">
            <div slot="header" class="clearfix" style="">
              <el-row :gutter="15" class="el-row">
                <el-col :span="12" align="left">   
                  Gateways状态        
                </el-col>
                <el-col :span="6" align="left">   
                  此时: <b style="color: green">{{ gwHourSuccess }}</b>
                  /
                  <b> {{ gwHourCount }} </b> 
                </el-col>
                <el-col :span="6" align="left">   
                  今日: <b style="color: green">{{ gwDaySuccess }}</b>   
                  /
                  <b> {{ gwDayCount }} </b>
                </el-col>
              </el-row>
            </div>

            <div class="text item">
              <template v-for="data in monitorStatGatewayData">
                <!-- gateway -->
                <el-row :gutter="15" class="el-row" style="margin-top: 5px; margin-bottom: 0px">
                  <el-col :span="5" align="left"> 
                    {{ getGatewayFromMonitorID(data.monitor_id).toUpperCase() }}       
                  </el-col>

                  <el-col :span="2" align="left">
                    <span v-html="statusIcon(getGatewayStatus(data))" > </span>   
                  </el-col>

                  <el-col :span="5" align="left">
                    <span style="color:red" v-if="moment().unix() - data.data.ts > gatewayTimeout">
                      {{ data.data.ts | epochToTimestamp }}
                    </span>
                    <span v-else>
                      {{ data.data.ts | epochToTimestamp }}
                    </span>                    
                  </el-col>

                  <el-col :span="6" align="left"> 
                    此时:<span style="color: green">{{ data.data.api_stat['1h'].total.success}}</span>
                    /
                    {{ data.data.api_stat['1h'].total.count}}
                  </el-col>

                  <el-col :span="4" align="left"> 
                    今日:<span style="color: green">{{ data.data.api_stat['1d'].total.success}}</span>
                    /
                    {{ data.data.api_stat['1d'].total.count}}
                  </el-col>

                  <el-col :span="2" align="left"> 
                    <el-link type="text" @click="showJsonDialog(data)">JSON</el-link>
                  </el-col>
                </el-row>
              </template>
            </div>
          </el-card>

          <!-- Strategy Feeds -->
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px;" v-if="!masterHost && monitorStatStyFeedData">
            <div slot="header" class="clearfix" style="">
              <el-row :gutter="15" class="el-row">
                <el-col :span="12" align="left">
                  策略Feed数据获取:
                  <b style="color: green">
                    {{ this.styFeedSuccess}}
                  </b>/
                  <b>
                    {{ this.styFeedCount}}
                  </b>
                </el-col>
                <el-col :span="11" align="right">
                  <el-link type="text" @click="showJsonDialog(monitorStatStyFeedData)">JSON</el-link>
                </el-col>
              </el-row>
            </div>

            <div class="text item">
              <el-table
                  :data="Object.keys(monitorStatStyFeedData)"
                  element-loading-text="Loading"
                  :row-style="tableRowStyle"                  
              >
                <el-table-column label="标的" min-width="20%" align="center" style="font-color: black">
                  <template slot-scope="scope">
                    {{ scope.row }}
                  </template>
                </el-table-column>

                <el-table-column label="" min-width="5%">
                  <template slot-scope="scope">
                    {{ barLevel1 }}
                  </template>
                </el-table-column>

                <el-table-column label="状态" min-width="10%" align="center">
                  <template slot-scope="scope">
                    <span v-html="statusIcon(monitorStatStyFeedData[scope.row][barLevel1].status)"> </span>
                  </template>
                </el-table-column>

                <el-table-column label="更新时间" min-width="20%" align="center">
                  <template slot-scope="scope">
                    <span style="color:red" v-if="moment().unix() - monitorStatStyFeedData[scope.row][barLevel1].data.data_ts > barTimeout">
                      {{ monitorStatStyFeedData[scope.row][barLevel1].data.data_ts | epochToTimestamp}}
                    </span>
                    <span v-else>
                      {{ monitorStatStyFeedData[scope.row][barLevel1].data.data_ts | epochToTimestamp}}
                    </span>                    
                  </template>
                </el-table-column>

                <el-table-column label="" min-width="5%">
                  <template slot-scope="scope">
                    {{ barLevel2 }}
                  </template>
                </el-table-column>

                <el-table-column label="状态" min-width="10%" align="center">
                  <template slot-scope="scope">
                    <span v-html="statusIcon(monitorStatStyFeedData[scope.row][barLevel2].status)"> </span>
                  </template>
                </el-table-column>


                <el-table-column label="更新时间" min-width="20%" align="center">
                  <template slot-scope="scope">
                    <span style="color:red" v-if="moment().unix() - monitorStatStyFeedData[scope.row][barLevel2].data.data_ts > tickTimeout">
                      {{ monitorStatStyFeedData[scope.row][barLevel2].data.data_ts | epochToTimestamp}}
                    </span>
                    <span v-else>
                      {{ monitorStatStyFeedData[scope.row][barLevel2].data.data_ts | epochToTimestamp}}
                    </span>
                  </template>
                </el-table-column>

              </el-table>
            </div>
          </el-card>

        </div>
      </el-col>
    </el-row>

    <el-dialog width="80%" title="JSON详情" :visible.sync="dialogJsonVisible">
      <pre>{{ jsonData }}</pre>
    </el-dialog>
  </div>


</template>


<script>
import config from '@/configs/system_configs'
import { getPortfolios } from '@/api/portfolio'
import { getBasicMonitorStatsByPortfolio, getBasicMonitorStats } from '@/api/monitor_stat'
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
  },
  data() {
    return {
      host: null,
      masterHost: true, // 当前是master hosts or pfo hosts
      masterList: null,
      portfolioList: null,
      portfolioListLoading: false,

      monitorStatList: null,
      monitorStatListLoading: true,

      showSummaryTable: true,
      summaryTableLoading: false,
      summaryTable: [],

      // Process
      monitorStatProcessData: null,

      // OS
      monitorStatOSData: null,

      // Thread
      monitorStatThreadData: null,

      // Gateway
      monitorStatGatewayData: [],
      gwDayCount: 0,
      gwDaySuccess: 0,
      gwHourCount: 0,
      gwHourSuccess: 0,

      // Strategy Feed
      barLevel1: '1h',  // 不应该写死
      barLevel2: 'tick',
      monitorStatStyFeedData: {},
      styFeedCount: 0,
      styFeedSuccess: 0,

      jsonData: null,
      dialogJsonVisible: false,

      // 时间戳过期
      updateTimeout: 1000,
      gatewayTimeout: 3600,
      tickTimeout: 180,  // Tick
      barTimeout: 3600*2  // 小时K线

    }
  },
  created() {
    this.fetchPortfolios()
  },
  methods: {
    moment: moment,

   tableRowStyle({ row, rowIndex }) {
      return {'color': 'black'}
    },

    statusIcon(status) {
      if (status === 'success'){
        return "<i style=\"font-size:20px; color: lightgreen \" class=\"el-icon-success\"></i>"
      } else if (status === 'fail') {
        return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-warning\"></i>"
      } else {
        return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-question\"></i>"
      }
    },
    showJsonDialog(data) {
      this.jsonData = JSON.stringify(data,null,2)
      this.dialogJsonVisible = true
    },

    showSummary(){
      this.summaryTableLoading = true
      this.summaryTable = []
      for(let pfoData of this.portfolioList){
        if(pfoData.name == 'summary'){continue}

        getBasicMonitorStats(pfoData.host).then(response => {
          var summaryData = {
            pfo: pfoData,
            feed_count: 0,
            feed_success_count: 0,
            feed_expire_count: 0
          }
          for(let mtData of response.results){
            if (mtData.type == 'mt_os'){
              // 监控OS
              summaryData.os_status = mtData.status
              summaryData.os_disk = mtData.data.disk_usage
              summaryData.os_mem = mtData.data.mem_usage
              summaryData.os_db_conn = mtData.data.db_conn
              summaryData.os_ts = mtData.data.ts
            } else if (mtData.type == 'mt_thread'){
              // 监控Threads
              summaryData.thread_status = mtData.status
              summaryData.thread_ts = mtData.data.ts              
            } else if (mtData.type == 'mt_process'){
              // 监控Processs
              summaryData.process_status = mtData.status
              summaryData.process_ts = mtData.data.ts
            } else if (mtData.type == 'mt_gateway'){
              // 监控APIs
              var gwDayCount = mtData.data.api_stat['1d'].total.count
              var gwDaySuccess = mtData.data.api_stat['1d'].total.success
              summaryData.gw_day_ratio = gwDaySuccess/gwDayCount
              var gwHourCount = mtData.data.api_stat['1h'].total.count
              var gwHourSuccess = mtData.data.api_stat['1h'].total.success  
              summaryData.gw_hour_ratio = gwHourSuccess/gwHourCount 
              summaryData.gw_status = mtData.status
              summaryData.gw_ts = mtData.data.ts
            } else if (mtData.type == 'mt_sty_feed'){
              // 监控策略Feeds
              summaryData.feed_count += 1
              if(mtData.status == 'success'){
                summaryData.feed_success_count += 1
              }
              if (mtData.data.bar_level == 'tick' && moment().unix() - mtData.data.ts > this.tickTimeout){
                summaryData.feed_expire_count += 1
              } else if(mtData.data.bar_level != 'tick' && moment().unix() - mtData.data.ts > this.barTimeout){
                summaryData.feed_expire_count += 1
              }
            }
          }
          this.summaryTable.push(summaryData)

          if(this.summaryTable.length == this.portfolioList.length - 1){
            this.summaryTableLoading = false
            // Sort
            this.summaryTable.sort((a, b) => b.pfo.name.localeCompare(a.pfo.name))
          }

        })
      }
    },

    fetchPortfolios() {
      this.portfolioListLoading = true
      this.monitorStatListLoading = true
      var headerList = [
        {
          name: 'summary',
        },
        {
          name: 'master',
          host: config.masterHost
        }        
      ]
      this.portfolioList = []
      for (var i = 0; i < config.pfoHosts.length; i++){
        getPortfolios(config.pfoHosts[i]).then(response => {
          response.results[0].host = response.config.baseURL   // 添加host
          this.portfolioList = this.portfolioList.concat(response.results)
          if (this.portfolioList.length == config.pfoHosts.length){
            // pfo加载完成
            this.portfolioList.sort((a, b) => a.name.localeCompare(b.name))

            // 添加summary/master
            this.portfolioList = headerList.concat(this.portfolioList)

            // 默认展示Summary
            this.showSummaryTable = true
            this.showSummary()

            this.portfolioListLoading = false
          }
        })
      }
    },

    fetchMonitorStatsByPortfolio(pfo) {
      this.monitorStatListLoading = true
      if(pfo.name == 'master'){
        // 右侧展示master的基本状态
        this.showSummaryTable = false
        this.masterHost = true
        getBasicMonitorStats(config.masterHost).then(response => {
          this.monitorStatList = response.results
          this.monitorStatListLoading = false
          this.parseMasterMonitorStatList()
        })
      } else if(pfo.name == 'summary'){
        // 右侧展示summary
        this.showSummaryTable = true
        this.showSummary()
      } else {
        // 右侧展示pfo的基本状态
        this.showSummaryTable = false
        this.masterHost = false
        getBasicMonitorStatsByPortfolio(pfo).then(response => {
          this.monitorStatList = response.results
          this.monitorStatListLoading = false
          this.parseMonitorStatList()
          console.log(this.monitorStatStyFeedData)
        })
      }
    },

    fetchMasterMonitorStats() {
      //this.clearMonitorStatData()
      this.monitorStatListLoading = true
      this.masterHost = true
      getBasicMonitorStats(config.masterHost).then(response => {
        this.monitorStatList = response.results
        this.monitorStatListLoading = false
        this.parseMasterMonitorStatList()
      })
    },

    getGatewayFromMonitorID(monitor_id) {
      return  monitor_id.split('_').slice(4).join('_')
    },
    getStatus(data) {
      if (data){
        return data.status
      } else {
        return null
      }
    },
    getOSStatus(data, property) {
      if (data){
        return data.status
      } else {
        return null
      }
    },
    getGatewayStatus(data) {
      var success = data.data.api_stat['1h'].total.success
      var count = data.data.api_stat['1h'].total.count
      if (success == count){
        return 'success'
      } else if (success/count < 0.9){
        return 'fail'
      } else {
        return 'warn'
      }
    },
    parseMasterMonitorStatList(){
      // 清零
      this.monitorStatProcessData = null
      this.monitorStatOSData = null
      for(var i = 0; i < this.monitorStatList.length; i++ ){
        if (this.monitorStatList[i].type == 'mt_os'){
          // 监控OS
          this.monitorStatOSData = this.monitorStatList[i]
        } else if (this.monitorStatList[i].type == 'mt_process'){
          // 监控Processs
          this.monitorStatProcessData = this.monitorStatList[i]
        }
      }
    },
    parseMonitorStatList(){
      // 清零
      this.styFeedCount = 0
      this.styFeedSuccess = 0
      this.monitorStatStyFeedData = {}
      this.monitorStatGatewayData = []
      this.monitorStatProcessData = null
      this.monitorStatThreadData = null
      this.monitorStatOSData = null
      this.gwDayCount = 0
      this.gwDaySuccess = 0
      this.gwHourSuccess = 0
      this.gwHourCount = 0
      for(var i = 0; i < this.monitorStatList.length; i++ ){
        if (this.monitorStatList[i].type == 'mt_os'){
          // 监控OS
          this.monitorStatOSData = this.monitorStatList[i]
        } else if (this.monitorStatList[i].type == 'mt_thread'){
          // 监控Threads
          this.monitorStatThreadData = this.monitorStatList[i]
        } else if (this.monitorStatList[i].type == 'mt_process'){
          // 监控Processs
          this.monitorStatProcessData = this.monitorStatList[i]
        } else if (this.monitorStatList[i].type == 'mt_gateway'){
          // 监控Gateways
          var data = this.monitorStatList[i]
          this.monitorStatGatewayData.push(this.monitorStatList[i])
          this.gwDayCount += data.data.api_stat['1d'].total.count
          this.gwDaySuccess+= data.data.api_stat['1d'].total.success
          this.gwHourCount += data.data.api_stat['1h'].total.count
          this.gwHourSuccess +=  data.data.api_stat['1h'].total.success

        } else if (this.monitorStatList[i].type == 'mt_sty_feed'){
          // 监控Strategy Feeds
          this.styFeedCount += 1
          var status = this.monitorStatList[i].status
          var symbol = this.monitorStatList[i].data['symbol']
          var bar_level = this.monitorStatList[i].data['bar_level']
          if (status == 'success'){ this.styFeedSuccess += 1 }

          if(symbol in this.monitorStatStyFeedData){
            this.monitorStatStyFeedData[symbol][bar_level] = {
              'status': status,
              'data': this.monitorStatList[i].data
            }
          } else {
            this.monitorStatStyFeedData[symbol] = {}
            this.monitorStatStyFeedData[symbol][bar_level] = {
                'status': status,
                'data': this.monitorStatList[i].data
            }
          }
        }
      }
    }
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

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
    height: 10px;
  }

  .box-card {
    width: 100%;
  }

  .short-card {
    border-color: lightsalmon;
  }

  .long-card {
    border-color: lightgreen;
  }

  .el-card {
    min-width: 100%;
    height: 100%;
    margin-right: 20px;
    transition: all .5s;
  }

  .el-card__body {
    padding: 10px;
  }

  .el-card__header {
    padding: 10px;
    padding-bottom: 15px;
    padding-top: 15px;
  }
</style>

<style scoped>
.el-table tbody tr:hover>td { 
    background-color:#ffffff!important
}
</style>