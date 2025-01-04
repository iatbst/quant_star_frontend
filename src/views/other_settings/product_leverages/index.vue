<template>
  <div class="app-container" >
    <el-row :gutter="0" type="flex"  style="margin-bottom: 50px">
      <!-- 所有的Normal Subaccount -->
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <el-table
            v-loading="subaccountListLoading"
            :data="subaccountList"
            style="width: 100%"
          >
            <el-table-column align="center" label="所有账户类">
              <template slot-scope="scope">
                <el-button style="width: 100%" type="primary" v-on:click="fetchSubaccountData(scope.row)" plain>
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
      </el-col>

      <el-col :span="19">
        <div class="grid-content" style="margin-top: 50px" >
            <!----------------------------------- Summary --------------------------------------->
            <el-table
            :data="leverageSumamry"
            :header-cell-style="{ background: '#f2f2f2' }"
            v-loading="subaccountDataLoading"
            >
                <el-table-column align="center" label="账户类" min-width="30%">
                    <template slot-scope="scope">
                        {{ scope.row.subaccount }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="更新时间" min-width="15%">
                    <template slot-scope="scope">
                        {{ formatTimestamp(scope.row.update_ts) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="标的数量" min-width="10%">
                    <template slot-scope="scope">
                        {{ scope.row.symbols }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="低杠杆标的" min-width="10%">
                    <template slot-scope="scope">
                        <span style="color: red" v-if="scope.row.low_leverages > 0">
                            {{ scope.row.low_leverages }}
                        </span>
                        <span v-else>
                            {{ scope.row.low_leverages }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="加权平均杠杆" min-width="10%">
                    <template slot-scope="scope">
                        <span>
                            {{ scope.row.leverage_avg }}X
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="账户资金(k$)" min-width="15%">
                    <template slot-scope="scope">
                        {{ toThousands(Math.round(scope.row.usdt_amount/1000)) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="不满足计划建仓" min-width="10%">
                    <template slot-scope="scope">
                        <span style="color: red;font-weight: bold;text-decoration: underline" v-if="scope.row.fatal_symbols > 0">
                            {{ scope.row.fatal_symbols }}
                        </span>
                        <span v-else>
                            {{ scope.row.fatal_symbols }}
                        </span>
                        &nbsp/&nbsp                   
                        <span style="color: red" v-if="scope.row.min_symbols > 0">
                            {{ scope.row.min_symbols }}
                        </span>
                        <span v-else>
                            {{ scope.row.min_symbols }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="杠杆设置错误" min-width="10%">
                    <template slot-scope="scope">
                        <span style="color: red" v-if="scope.row.errors > 0">
                            {{ scope.row.errors }}
                        </span>
                        <span v-else>
                            {{ scope.row.errors }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="参数" min-width="5%">
                    <template slot-scope="scope">
                        <span style="cursor: pointer" @click="showParamsDialog(scope.row.params)">
                            <u>
                                详情
                            </u>
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- Diaglog: 配置 -->
            <el-dialog title="订单详情" :visible.sync="dialogParamsVisible" append-to-body>
                <pre>{{ paramsJson }}</pre>
            </el-dialog>
        </div>

        <div class="grid-content" style="margin-top: 20px" >
            <!----------------------------------- 杠杆详情 --------------------------------------->
            <el-table
            :data="leverageDatas"
            :header-cell-style="{ background: '#f2f2f2' }"
            v-loading="subaccountDataLoading"
            >
                <el-table-column align="center" label="标的" min-width="15%">
                    <template slot-scope="scope">
                        {{ scope.row.symbol }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="杠杆率" min-width="15%">
                    <template slot-scope="scope">
                        <span style="color: red" v-if="scope.row.leverage < low_leverage">
                            {{ scope.row.leverage }}X
                        </span>
                        <span v-else>
                            {{ scope.row.leverage }}X
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="最大建仓(个/张)" min-width="15%">
                    <template slot-scope="scope">
                        <span v-if="scope.row.max_size">
                            {{ toThousands(Math.round(scope.row.max_size)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="最大建仓(k$)" min-width="15%">
                    <template slot-scope="scope">
                        <span style="color: red" v-if="scope.row.max_usdt_size < scope.row.target_usdt_position * 0.8">
                            {{ toThousands(Math.round(scope.row.max_usdt_size/1000)) }}
                        </span>
                        <span style="color: orange" v-else-if="scope.row.max_usdt_size < scope.row.target_usdt_position">
                            {{ toThousands(Math.round(scope.row.max_usdt_size/1000)) }}
                        </span>                        
                        <span v-else>
                            {{ toThousands(Math.round(scope.row.max_usdt_size/1000)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="计划最大建仓(k$)" min-width="15%">
                    <template slot-scope="scope">
                        {{ toThousands(Math.round(scope.row.target_usdt_position/1000)) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="最近更新错误" min-width="25%">
                    <template slot-scope="scope">
                        {{ scope.row.error }}
                    </template>
                </el-table-column>
            </el-table> 
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
import { getSubAccounts, getSubAccountDataByName } from '@/api/subaccount'
import { getBasicMonitorStatsByPortfolio, getBasicMonitorStats } from '@/api/monitor_stat'
import moment from 'moment'
import {toThousands, formatTimestamp} from '@/utils/general'

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
      subaccountList: null,
      subaccountListLoading: false,
      subaccountDataLoading: false,
      leverageDatas: null,
      leverageSumamry: null,
      low_leverage: 2.5,
      paramsJson: null,
      dialogParamsVisible: false
    }
  },
  created() {
    this.fetchSubaccounts()

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
        return "<i style=\"font-size:20px; color: lightsalmon \" class=\"el-icon-error\"></i>"
      } else {
        return "<i style=\"font-size:20px; color: gray \" class=\"el-icon-question\"></i>"
      }
    },
    showJsonDialog(data) {
      this.jsonData = JSON.stringify(data,null,2)
      this.dialogJsonVisible = true
    },

    fetchSubaccountData(subaccount) {
      //this.clearMonitorStatData()
      this.subaccountDataLoading = true
      getSubAccountDataByName(subaccount.name, config.masterHost, 'product_leverages').then(response => {
        this.leverageDatas = []
        var errors = 0
        var min_symbols = 0
        var fatal_symbols = 0
        var low_leverages = 0
        for(let symbol in response.results[0].product_leverages.data){
            var data = response.results[0].product_leverages.data[symbol]
            data['symbol'] = symbol
            this.leverageDatas.push(data)
            if (data.error != null){
                errors += 1
            }
            if (data.max_usdt_size < data.target_usdt_position){
                min_symbols += 1
            }
            if (data.max_usdt_size < data.target_usdt_position * 0.8){
                fatal_symbols += 1
            }            
            if (data.leverage < this.low_leverage){
                low_leverages += 1
            }
        }
        //排序: 计划建仓从大到小
        this.leverageDatas.sort((a, b) => b.target_usdt_position - a.target_usdt_position)
        var summary = response.results[0].product_leverages.summary
        this.leverageSumamry = [{
            subaccount: subaccount.name,
            usdt_amount: summary.usdt_amount,
            update_ts: summary.update_ts,
            leverage_avg: summary.leverage_avg,
            errors: errors,
            min_symbols: min_symbols,
            fatal_symbols: fatal_symbols,
            low_leverages: low_leverages,
            symbols: Object.keys(response.results[0].product_leverages.data).length,
            params: response.results[0].product_leverages.params
        }]
        this.subaccountDataLoading = false
      })
    },

    showParamsDialog(params) {
        this.paramsJson = JSON.stringify(params,null,2)
        this.dialogParamsVisible = true
    },

    fetchSubaccounts() {
        this.subaccountListLoading = true
        this.subaccountList = []
        getSubAccounts(config.masterHost).then(response => {
            this.subaccountList = response.results
            this.subaccountList.sort((a, b) => a.name.localeCompare(b.name))
            this.subaccountListLoading = false

            // 加载第一个subaccount的杠杆信息
            this.fetchSubaccountData(this.subaccountList[0])
        })
    },

    toThousands: toThousands,
    formatTimestamp: formatTimestamp,
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