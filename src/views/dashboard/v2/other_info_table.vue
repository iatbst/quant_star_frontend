<template>
    <!--- 表2: 仓位 --->
    <div>
        <el-table
        :data="otherInfoDatas"
        :header-cell-style="{ background: '#f2f2f2' }"
        style="width: 100%">

            <el-table-column label="VS状态" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red" v-if="scope.row.vsState">
                        <b>激活</b>
                    </span>   
                    <span style="" v-else>
                        未激活
                    </span> 
                </template>
            </el-table-column>

            <el-table-column label="VS低点日期" min-width="10%" align="center">
                <template slot-scope="scope">
                    {{ scope.row.vsCandidateDt }}
                </template>
            </el-table-column>

            <el-table-column label="VS低点距今" min-width="10%" align="center">
                <template slot-scope="scope">
                    {{ scope.row.vsCandidateRight }}日
                </template>
            </el-table-column>

            <el-table-column label="VS低点涨幅" min-width="10%" align="center">
                <template slot-scope="scope">
                    {{ scope.row.vsCandidateSurge }}%
                </template>
            </el-table-column>

            <el-table-column label="24H抄底订单" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span style="color: red" v-if="scope.row.todayPbOrderCount > 0">
                        <b>{{ scope.row.todayPbOrderCount }}</b>
                    </span>   
                    <span style="" v-else>
                        {{ scope.row.todayPbOrderCount }}
                    </span> 
                </template>
            </el-table-column>

            <el-table-column label="最新多头占比" min-width="10%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.longShortRatio == null">
                        N/A
                    </span>
                    <span style="" v-else>
                        <span style="color: green" v-if="scope.row.longShortRatio > 60">
                            {{ scope.row.longShortRatio }}%
                        </span>   
                        <span style="" v-else>
                            {{ scope.row.longShortRatio }}%
                        </span> 
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
                <template slot-scope="scope">
                </template>
            </el-table-column>

            <el-table-column label="" min-width="10%" align="center">
                <template slot-scope="scope">
                </template>
            </el-table-column>  
        </el-table>
    </div>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands, getAnnualReturn, getMaxDrawdown} from '@/utils/general'
import moment from 'moment'
import {addSingleLine} from '@/utils/chart'
import {Chart} from 'highcharts-vue'


export default {
    components: {
        highcharts: Chart
    },

    props: {
        parentPfoMacroStrategies: {
            type:Object,
            default:{}
        }, 
        todayPbOrderCount: {
            type: Number,
            default: null
        },   
        longShortRatios: {
            type: Array,
            default: []
        }      
    },

    watch: {
        parentPfoMacroStrategies: {
            handler(val, oldVal){
                this.parseMacroStrategies()
            },
            deep: true
        },
    },

    data() {
        return {
            otherInfoDatas: [{
                // 宏观策略: value_surge
                vsState: null,
                vsCandidateDt: null,
                vsCandidateRight: null,
                vsCandidateSurge: null,

                // 24H内抄底订单
                todayPbOrderCount: null,

                // 最近的多空数据(平均值)
                longShortRatio: null
            }],

            // dialogHistoryAtrptgVisible: false,
        }
    },

    created() {
        // 分析Data
        this.parseMacroStrategies()
    },

    methods: {
        parseMacroStrategies(){
            // 宏观策略仓位信息从系统后台获取
            // debugger
            var vsData = this.parentPfoMacroStrategies.value_surge
            this.otherInfoDatas[0].vsState = vsData.active
            this.otherInfoDatas[0].vsCandidateDt = vsData.candidate_dt
            this.otherInfoDatas[0].vsCandidateRight = vsData.candidate_right
            this.otherInfoDatas[0].vsCandidateSurge = (vsData.candidate_surge*100).toFixed(1)
            this.otherInfoDatas[0].todayPbOrderCount = this.todayPbOrderCount

            // 分析long_short_ratios
            this.otherInfoDatas[0].longShortRatio = this.getLastLongShortRatio()
        },

        getLastLongShortRatio(){
            // 从4大平台的数据中分析出最近的值
            this.longShortRatios.sort((a, b) => b.mts - a.mts)
            var last_mts = null
            var count = 0
            var sum = 0
            for(let data of this.longShortRatios){
                // 找到第一组4个数据的mts值都一致的数据
                if(last_mts == null || data.mts == last_mts){
                    count += 1
                    sum += data.long
                    if (count == 4){
                        return ((sum/4)*100).toFixed(1)
                    }
                } else {
                    count = 1
                    sum = data.long
                    last_mts = data.mts
                }
            }

            // 没找到
            return null
        },

        // 获取最近24H的多空数据
        fetchLongShortRatios(){
            this.longShortRatios = []
            this.longShortRatiosAvailable = true
            var startMts = Date.now() - 25 * 3600 * 1000
            var filters = 'show_exchange=true&mts__gte=' + startMts
            getLongShortRatios(config.masterHost, filters).then(response => {
                    this.longShortRatios = response.results
                    this.longShortRatiosAvailable = true
                }
            )
        },

        toThousands: toThousands,
    },
}


</script>