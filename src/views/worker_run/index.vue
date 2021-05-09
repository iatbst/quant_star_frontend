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
                <el-button style="width: 100%" type="primary" v-on:click="choosePortfolio(scope.row)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- 指定portfolio的所有workers -->
          <el-table
            v-loading="workerListLoading"
            :data="workerList"
            style="width: 100%"
          >
            <el-table-column align="center" label="策略工人">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary" v-on:click="fetchSignalPointsByWorker(scope.row)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
      </el-col>

      <el-col :span="16">
        <div class="grid-content bg-purple">
          <!-- 指定worker的runs -->
          <el-table
            v-loading="signalPointListLoading"
            :data="signalPointList"
            style="width: 100%"
          >
            <el-table-column align="center" label="策略执行详情">
              <template slot-scope="scope" style="padding: 0px">
                <el-card :class="{'box-card': true, 'el-card': true, 'short-card': scope.row.sig_type === 'short',
                'long-card': scope.row.sig_type === 'long'}">
                  <div slot="header" class="clearfix" style="margin-bottom: -50px;margin-top: -10px;">
                    <!-- Signal Point -->
                    <el-row :gutter="15" class="el-row">
                      <el-col :span="3" align="left">
                        {{ scope.row.sig_type | chineseString }} ({{ scope.row.id }})
                      </el-col>
                      <el-col :span="5" align="left">
                        {{ scope.row.sig_ts | formatTimestamp}}
                      </el-col>
                     <el-col :span="3" align="left">
                        {{ scope.row.sig_price }}
                      </el-col>
                     <el-col :span="13">
                        <el-button style="float: right; padding: 3px 0" type="text"
                                   v-on:click="fetchLogsByWorker(currentWorker, scope.row.sig_ts)" plain>
                        日志</el-button>
                      </el-col>
                    </el-row>
                  </div>

                  <div v-for="order in scope.row.orders" :key="order.sys_id">
                    <el-row>
                      <!-- 算法订单 -->
                      <el-col :span="2" @click.native="showOrderJsonDialog(order)" style="cursor: pointer" v-html="statusIcon(order.status)">
                      </el-col>
                      <el-col :span="3" align="left">
                        {{ order.order_type | chineseString}}:{{ order.side | chineseString}} ({{ order.id }})
                      </el-col>
                      <el-col :span="5" align="left">
                        {{ order.created_ts | formatTimestamp}}
                      </el-col>
                      
                      <el-col :span="10" align="left">
                        {{ order.size }} / <b>{{ order.exec_size }}</b> ({{ String(order.exec_avg_price) }})
                      </el-col>
                      <el-col :span="3" align="right">
                        <el-button style="margin-top: -6px" type="text" @click="showOrderJsonDialog(order)" v-if="order.exec_algo == 'simple'">JSON</el-button>
                        <el-button style="margin-top: -6px" type="text" @click="fetchSubOrdersByParentOrder(order)" v-else>子订单</el-button>
                      </el-col>
                      <el-col :span="1"></el-col>
                    </el-row>
                  </div>
                </el-card>
              </template>
            </el-table-column>


          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="订单详情" :visible.sync="dialogOrderJsonVisible">
      <pre>{{ orderJson }}</pre>
    </el-dialog>

    <el-dialog title="算法订单(父/子订单)" :visible.sync="dialogSubOrdersVisible" width="65%">
      <hr />
      <el-table :data="[parentOrder]" style="width: 100%;" :show-header="false">
        <el-table-column min-width="10%">
            <div v-html="statusIcon(parentOrder.status)">
            </div>
        </el-table-column>
        <el-table-column min-width="10%">
          {{ parentOrder.side | chineseString}} ({{ parentOrder.id }})
        </el-table-column>
        <el-table-column min-width="20%">
          {{ parentOrder.created_ts | formatTimestamp}}
        </el-table-column>
        <el-table-column min-width="10%">
          {{ parentOrder.price}}
        </el-table-column>
        <el-table-column min-width="20%">
          算法:{{ parentOrder.exec_algo }}
        </el-table-column>
        <el-table-column min-width="20%">
          {{ parentOrder.size }} / <b>{{ parentOrder.exec_size }}</b> ({{ String(parentOrder.exec_avg_price) }})
        </el-table-column>
        <el-table-column min-width="10%">
          <el-button type="text" @click="showOrderJsonDialog(parentOrder)">JSON</el-button>
        </el-table-column>
      </el-table>
      <hr />
      <el-table :data="subOrderList" style="width: 100%" :show-header="false">
        <el-table-column min-width="10%">
          <template slot-scope="scope" >
            <div v-html="statusIcon(scope.row.status)">
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.side | chineseString}} ({{ scope.row.id }})
          </template>
        </el-table-column>
        <el-table-column min-width="20%">
          <template slot-scope="scope">
            {{scope.row.created_ts | formatTimestamp}}
          </template>
        </el-table-column>
        <el-table-column min-width="10%">
          <template slot-scope="scope">
            {{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column min-width="20%">
          <template slot-scope="scope">
            {{scope.row.orig_type}}
          </template>
        </el-table-column>
        <el-table-column min-width="20%">
          <template slot-scope="scope">
            {{ scope.row.size }} / <b>{{ scope.row.exec_size }}</b> ({{ String(scope.row.exec_avg_price) }})
          </template>
        </el-table-column>
        <el-table-column min-width="10%">
          <template slot-scope="scope">
            <el-button type="text" @click="showOrderJsonDialog(scope.row)">JSON</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="日志" :visible.sync="dialogLogVisible" width="80%" >
      <div v-for="log in logList" :key="log.ts" class="text item">
        <!-- log -->
        <el-row>
          <el-col :span="3">
            {{ log.ts | formatTimestamp}}
          </el-col>
          <el-col :span="2">
            [ {{ log.level.toUpperCase() }} ]:
          </el-col>
          <el-col :span="19">
            <span style="white-space: pre-line">{{ log.message }}</span>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { getPortfolios } from '@/api/portfolio'
import { getWorkersByPfo } from '@/api/worker'
import { getSignalPointsByWorker } from '@/api/signal_point'
import { getSubOrdersByParentOrder } from '@/api/order'
import { getLogsByWorkerAndTs } from '@/api/log'
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
    chineseString(s) {
      var cs
      if (s === 'long'){
        cs = '多'
      } else if (s === 'short'){
        cs = '空'
      } else if (s === 'buy'){
        cs = '买'
      } else if (s === 'sell'){
        cs = '卖'
      } else if (s === 'open'){
        cs = '开仓'
      } else if (s === 'close'){
        cs = '关仓'
      } else if (s === 'adjust'){
        cs = '调整'
      } else if (s === 'lose_stop'){
        cs = '止损'
      } else if (s === 'increase'){
        cs = '补仓'
      } else if (s === 'decrease'){
        cs = '减仓'
      } else if (s === 'rollback'){
        cs = '回撤'
      }else {
        cs = s
      }
      return cs
    }
  },
  data() {
    return {
      host: null,
      pfo_hosts: [
        'http://ec2-3-101-132-250.us-west-1.compute.amazonaws.com:8000/api',
        'http://ec2-13-250-43-118.ap-southeast-1.compute.amazonaws.com:8000/api'
      ],

      portfolioList: [],
      portfolioListLoading: true,

      workerList: null,
      workerListLoading: true,
      currentWorker: null,

      signalPointList: null,
      signalPointListLoading: true,

      subOrderList: null,
      orderJson: null,
      subOrderListLoading: true,
      dialogSubOrdersVisible: false,
      dialogOrderJsonVisible: false,
      parentOrder: {},

      logList: null,
      logListLoading: true,
      dialogLogVisible: false,

    }
  },
  created() {
    this.fetchPortfolios()
  },
  methods: {
    statusIcon(status) {
      if (status === 'completed'){
        return "<i style=\"font-size:20px; color: lightgreen \" class=\"el-icon-success\"></i>"
      } else if (status === 'canceled' || status === 'rejected' || status === 'expired') {
        return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-warning\"></i>"
      } else {
        return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-loading\"></i>"
      }
    },
    fetchPortfolios() {
      this.portfolioListLoading = true
      this.portfolioList = []
      for (var i = 0; i < this.pfo_hosts.length; i++){
        getPortfolios(this.pfo_hosts[i]).then(response => {
          this.portfolioList = this.portfolioList.concat(response.results)
          if (this.portfolioList.length == this.pfo_hosts.length){
            // pfo加载完成
            this.portfolioListLoading = false
            this.choosePortfolio(this.portfolioList[0])
          }
        })
      }
    },
    choosePortfolio(pfo) {
      this.host = pfo.host
      this.fetchWorkersByPfo(pfo)
    },
    fetchWorkersByPfo(pfo) {
      this.workerListLoading = true
      getWorkersByPfo(pfo).then(response => {
        this.workerList = response.results
        this.workerListLoading = false
        this.fetchSignalPointsByWorker(this.workerList[0])
      })
    },
    fetchSignalPointsByWorker(worker) {
      this.signalPointListLoading = true
      getSignalPointsByWorker(worker, this.host).then(response => {
        this.signalPointList = response.results
        this.signalPointListLoading = false
        this.currentWorker = worker
      })
    },
    fetchSubOrdersByParentOrder(order) {
      this.subOrderListLoading = true
      getSubOrdersByParentOrder(order, this.host).then(response => {
        this.dialogSubOrdersVisible = true
        this.subOrderList = response.results
        this.subOrderListLoading = false
      })
      this.parentOrder = order
    },
    showOrderJsonDialog(order) {
      this.orderJson = JSON.stringify(order,null,2)
      this.dialogOrderJsonVisible = true
    },
    fetchLogsByWorker(worker, ts) {
      this.logListLoading = true
      // TODO: 优化datetime的操作
      var ts_obj = new Date(ts)
      var min_ts = ts_obj.setHours(ts_obj.getHours() - 1)   // ts之前1个小时
      var max_ts = ts_obj.setHours(ts_obj.getHours() + 2)   // ts之后1个小时
      min_ts = new Date(min_ts)
      max_ts = new Date(max_ts)
      min_ts = moment(min_ts).format("YYYY-MM-DD HH:mm:ss")
      max_ts = moment(max_ts).format("YYYY-MM-DD HH:mm:ss")
      getLogsByWorkerAndTs(worker, min_ts, max_ts, this.host).then(response => {
        this.dialogLogVisible = true
        this.logList = response.results
        this.logListLoading = false
      })
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
