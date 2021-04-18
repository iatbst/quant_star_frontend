<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- 所有的Portfolios -->
          <el-table
            v-loading="portfolioListLoading"
            :data="portfolioList"
            style="width: 100%"
          >
            <el-table-column align="center" label="投资组合">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary" v-on:click="fetchMonitorStatsByPortfolioId(scope.row.id)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
      </el-col>


      <el-col :span="20">
        <div class="grid-content" style="margin-top: 20px">
          <!-- Strategy Feeds -->
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px">
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
              >
                <el-table-column label="标的">
                  <template slot-scope="scope">
                    {{ scope.row }}
                  </template>
                </el-table-column>

                <el-table-column label="Bar级别1">
                  <template slot-scope="scope">
                    {{ Object.values(monitorStatStyFeedData[scope.row])[0].data.bar_level }}
                  </template>
                </el-table-column>

                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span v-html="statusIcon(Object.values(monitorStatStyFeedData[scope.row])[0].status)"> </span>
                  </template>
                </el-table-column>

                <el-table-column label="更新时间">
                  <template slot-scope="scope">
                    {{ Object.values(monitorStatStyFeedData[scope.row])[0].data.ts | epochToTimestamp}}
                  </template>
                </el-table-column>

                <el-table-column label="Bar级别2">
                  <template slot-scope="scope">
                    {{ Object.values(monitorStatStyFeedData[scope.row])[1].data.bar_level }}
                  </template>
                </el-table-column>

                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span v-html="statusIcon(Object.values(monitorStatStyFeedData[scope.row])[1].status)"> </span>
                  </template>
                </el-table-column>


                <el-table-column label="更新时间">
                  <template slot-scope="scope">
                    {{ Object.values(monitorStatStyFeedData[scope.row])[1].data.ts | epochToTimestamp}}
                  </template>
                </el-table-column>

              </el-table>
            </div>
          </el-card>

          <!-- Gateways -->
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px">
            <div slot="header" class="clearfix" style="">
              <el-row :gutter="15" class="el-row">
                <el-col :span="8" align="left">   
                  Gateways状态        
                </el-col>
                <el-col :span="8" align="left">   
                  此时: <b style="color: green">{{ gwHourSuccess }}</b>
                  /
                  <b> {{ gwHourCount }} </b> 
                </el-col>
                <el-col :span="8" align="left">   
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

                  <el-col :span="3" align="left">
                    <span v-html="statusIcon(getGatewayStatus(data))" > </span>   
                  </el-col>


                  <el-col :span="8" align="left"> 
                    此时:<span style="color: green">{{ data.data.api_stat['1h'].total.success}}</span>
                    /
                    {{ data.data.api_stat['1h'].total.count}}
                  </el-col>

                  <el-col :span="6" align="left"> 
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

          <!-- Threads -->
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px">
            <div class="text item">
              <el-row :gutter="15" class="el-row" style="margin-top: 10px; margin-bottom: 10px">
                <el-col :span="5" align="left">   
                  子线程状态        
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
          <el-card :class="{'box-card': true, 'el-card': true}" style="margin-bottom: 20px">
            <div class="text item">
              <el-row :gutter="15" class="el-row" style="margin-top: 10px; margin-bottom: 10px">
                <el-col :span="5" align="left">   
                  云主机状态 
                </el-col>
                <el-col :span="1" align="left">   
                  <span v-html="statusIcon(getStatus(monitorStatOSData))"> </span>
                </el-col>
                <el-col :span="4" align="right">  
                  磁盘:{{monitorStatOSData == null ? 'N/A' : monitorStatOSData.data.disk_usage}}
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

        </div>
      </el-col>
    </el-row>

    <el-dialog width="80%" title="JSON详情" :visible.sync="dialogJsonVisible">
      <pre>{{ jsonData }}</pre>
    </el-dialog>
  </div>


</template>


<script>
import { getPortfolioList } from '@/api/portfolio'
import { getMonitorStatListByPortfolio } from '@/api/monitor_stat'
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
      portfolioList: null,
      portfolioListLoading: true,

      monitorStatList: null,
      monitorStatListLoading: true,

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
      monitorStatStyFeedData: {},
      styFeedCount: 0,
      styFeedSuccess: 0,

      jsonData: null,
      dialogJsonVisible: false,

    }
  },
  created() {
    this.fetchPortfolios()

  },
  methods: {
    statusIcon(status) {
      if (status === 'success'){
        return "<i style=\"font-size:20px; color: lightgreen \" class=\"el-icon-success\"></i>"
      } else if (status === 'fail') {
        return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-error\"></i>"
      } else {
        return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-question\"></i>"
      }
    },
    showJsonDialog(data) {
      this.jsonData = JSON.stringify(data,null,2)
      this.dialogJsonVisible = true
    },
    fetchPortfolios() {
      this.portfolioListLoading = true
      getPortfolioList().then(response => {
        this.portfolioList = response.results
        this.portfolioListLoading = false
        this.fetchMonitorStatsByPortfolioId(this.portfolioList[0].id)
      })
    },
    fetchMonitorStatsByPortfolioId(pfo_id) {
      //this.clearMonitorStatData()
      this.monitorStatListLoading = true
      getMonitorStatListByPortfolio(pfo_id).then(response => {
        this.monitorStatList = response.results
        this.monitorStatListLoading = false
        this.parseMonitorStatList()
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
    parseMonitorStatList(){
      // 清零
      this.styFeedCount = 0
      this.styFeedSuccess = 0
      this.monitorStatStyFeedData = {}
      this.monitorStatGatewayData = []
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
        } else if (this.monitorStatList[i].type == 'event_mt_gateway'){
          // 监控Gateways
          var data = this.monitorStatList[i]
          this.monitorStatGatewayData.push(this.monitorStatList[i])
          this.gwDayCount += data.data.api_stat['1d'].total.count
          this.gwDaySuccess+= data.data.api_stat['1d'].total.success
          this.gwHourCount += data.data.api_stat['1h'].total.count
          this.gwHourSuccess +=  data.data.api_stat['1h'].total.success

        } else if (this.monitorStatList[i].type == 'event_mt_sty_feed'){
          // 监控Strategy Feeds
          this.styFeedCount += 1
          var status = this.monitorStatList[i].status
          var symbol = this.monitorStatList[i].data['symbol']
          var bar_level = this.monitorStatList[i].data['bar_level']
          var ts = this.monitorStatList[i].data['ts']
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
