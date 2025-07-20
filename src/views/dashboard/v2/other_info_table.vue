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

            <el-table-column label="" min-width="10%" align="center">
                <template slot-scope="scope">
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

            <el-table-column label="" min-width="10%" align="center">
                <template slot-scope="scope">
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
        },

        toThousands: toThousands,
    },
}


</script>