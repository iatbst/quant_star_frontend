<template>
   <el-row :gutter="0" type="flex" >
        <!-- 表现Table -->
        <el-col :span="24">
            <el-table
                :data="symbolPerfs"
                style="width: 100%; margin-bottom: 20px; margin-top: 45px"
                :header-cell-style="{ background: '#f2f2f2' }"
                v-loading="delegateWorkerDatasLoading"
            >
                <el-table-column label="交易策略组" min-width="20%" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.worker_group_name }}
                  </template>
                </el-table-column>

                <el-table-column label="收益($)" min-width="20%" align="center" sortable>
                  <template slot-scope="scope">
                      <span style="color: green" v-if="scope.row.usd_profit >= 0">
                          {{ (scope.row.usd_profit).toFixed(0) }}
                      </span>
                      <span style="color: red" v-else>
                          {{ (scope.row.usd_profit).toFixed(0) }}
                      </span>                    
                  </template>
                </el-table-column>

                <el-table-column label="次数" prop="count" min-width="20%" align="center" sortable>
                </el-table-column>

                <el-table-column label="胜率" min-width="20%" align="center" sortable>
                  <template slot-scope="scope">
                    {{ (scope.row.win_ptg * 100).toFixed(2) }}%
                  </template>
                </el-table-column>

                <el-table-column label="盈亏比" min-width="20%" align="center" sortable>
                  <template slot-scope="scope">
                    {{ scope.row.pl_ratio ? scope.row.pl_ratio.toFixed(2) : 'N/A' }}
                  </template>
                </el-table-column>

                <el-table-column label="成交量($)" min-width="20%" align="center" sortable>
                  <template slot-scope="scope">
                    {{ scope.row.usd_volume.toFixed(0) }}
                  </template>
                </el-table-column>

                <el-table-column label="加权滑点(vol)" min-width="20%" align="center" sortable>
                  <template slot-scope="scope">
                      <span style="color: green" v-if="scope.row.weighted_slipage >= 0">
                          {{ (scope.row.weighted_slipage*100).toFixed(2) }}%
                      </span>
                      <span style="color: red" v-else>
                          {{ (scope.row.weighted_slipage*100).toFixed(2) }}%
                      </span> 
                  </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'

export default {
    components: {
        highcharts: Chart
    },

    props: {
        delegateWorkerDatas: {
            type:Array,
            default:[]
        },

        delegateWorkerDatasLoading: {
            type:Boolean,
            default:false     
        }
    },

    watch: {
        delegateWorkerDatas: {
            handler(val, oldVal){
                if (this.delegateWorkerDatasLoading === false){
                  this.parseData()
                }
            },
            deep: true
        }
    },

    data() {
        return {
            symbolPerfs: null                          
        }
    },
    
    created() {
        this.symbolPerfs = []

        // 分析Data
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data: delegateWorkerDatas
        parseData() {
            for(var i = 0; i < this.delegateWorkerDatas.length; i++){
                for(var j = 0; j < this.delegateWorkerDatas[i].length; j++){
                    var workerName = this.delegateWorkerDatas[i][j].worker.name
                    var workerGroupName = workerName.split('_').slice(0, -1).join('_')  // _分隔符最后一项代表了不同的子策略
                    var perf = this.delegateWorkerDatas[i][j].performance.summary
                    perf['worker_group_name'] = workerGroupName
                    this.symbolPerfs.push(perf)
                }
            }
        },
    }
}
</script>
