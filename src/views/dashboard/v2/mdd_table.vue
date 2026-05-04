<template>
    <!--- 表1: 回撤 --->
    <el-table
    :data="mddRows"
    :header-cell-style="{ background: '#f2f2f2' }"
    style="width: 100%">
        <el-table-column label="策略平台" min-width="10%" align="center">
            <template slot-scope="scope">
                <b>{{ scope.row.name1 }}</b>
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="实时回撤(%/日)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{(scope.row.dd1 * 100).toFixed(1)}}%
                </span> / 
                <span>
                    {{ scope.row.dd_days1 }}
                </span>           
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="第一回撤(%/日)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{(scope.row.mdd11[0] * 100).toFixed(1)}}%
                </span> / 
                <span>
                    {{ scope.row.mdd11[1] }}
                </span>           
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="第二回撤(%/日)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{(scope.row.mdd21[0] * 100).toFixed(1)}}%
                </span> / 
                <span>
                    {{ scope.row.mdd21[1] }}
                </span>           
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="第三回撤(%/日)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{(scope.row.mdd31[0] * 100).toFixed(1)}}%
                </span> / 
                <span>
                    {{ scope.row.mdd31[1] }}
                </span>           
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="" min-width="10%" align="center">
            <template slot-scope="scope">      
            </template>
        </el-table-column>

        <el-table-column label="策略单独" min-width="10%" align="center">
            <template slot-scope="scope">
                <b>{{ scope.row.name2 }}</b>
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="实时回撤(%/日)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{(scope.row.dd2 * 100).toFixed(1)}}%
                </span> / 
                <span>
                    {{ scope.row.dd_days2 }}
                </span>           
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="第一回撤(%/日)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{(scope.row.mdd12[0] * 100).toFixed(1)}}%
                </span> / 
                <span>
                    {{ scope.row.mdd12[1] }}
                </span>           
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="第二回撤(%/日)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{(scope.row.mdd22[0] * 100).toFixed(1)}}%
                </span> / 
                <span>
                    {{ scope.row.mdd22[1] }}
                </span>           
            </template>
        </el-table-column>

        <el-table-column prop="day1Diff" label="第三回撤(%/日)" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{(scope.row.mdd32[0] * 100).toFixed(1)}}%
                </span> / 
                <span>
                    {{ scope.row.mdd32[1] }}
                </span>           
            </template>
        </el-table-column>

    </el-table>
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands} from '@/utils/general'
import moment from 'moment'

export default {
    props: {
        mddDatas: {
            type:Object,
            default:{}
        }, 
    },

    watch: {
        mddDatas: {
            handler(val, oldVal){
                this.parseData()
            },
        },   
    },

    data() {
        return {
            mddRows: [],
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData(){  
            this.mddRows = []

            // 第一行
            var row1 = {}
            row1.name1 = '单TB'
            row1.dd1 = this.mddDatas.low_tb_performance.dd
            row1.dd_days1 = this.mddDatas.low_tb_performance.dd_days
            row1.mdd11 = this.mddDatas.low_tb_performance.mdd_list[0]   
            row1.mdd21 = this.mddDatas.low_tb_performance.mdd_list[1]   
            row1.mdd31 = this.mddDatas.low_tb_performance.mdd_list[2]  
            row1.name2 = 'TB'
            row1.dd2 = this.mddDatas.tb_performance.dd
            row1.dd_days2 = this.mddDatas.tb_performance.dd_days
            row1.mdd12 = this.mddDatas.tb_performance.mdd_list[0]   
            row1.mdd22 = this.mddDatas.tb_performance.mdd_list[1]   
            row1.mdd32 = this.mddDatas.tb_performance.mdd_list[2]  
            this.mddRows.push(row1) 
            
            // 第二行
            var row2 = {}
            row2.name1 = '5S-L'
            row2.dd1 = this.mddDatas.low_5s_performance.dd
            row2.dd_days1 = this.mddDatas.low_5s_performance.dd_days
            row2.mdd11 = this.mddDatas.low_5s_performance.mdd_list[0]   
            row2.mdd21 = this.mddDatas.low_5s_performance.mdd_list[1]   
            row2.mdd31 = this.mddDatas.low_5s_performance.mdd_list[2]  
            row2.name2 = 'RS'
            row2.dd2 = this.mddDatas.rsi_performance.dd
            row2.dd_days2 = this.mddDatas.rsi_performance.dd_days
            row2.mdd12 = this.mddDatas.rsi_performance.mdd_list[0]   
            row2.mdd22 = this.mddDatas.rsi_performance.mdd_list[1]   
            row2.mdd32 = this.mddDatas.rsi_performance.mdd_list[2]  
            this.mddRows.push(row2) 

            // 第三行
            var row3 = {}
            row3.name1 = '5S-M'
            row3.dd1 = this.mddDatas.mid_5s_performance.dd
            row3.dd_days1 = this.mddDatas.mid_5s_performance.dd_days
            row3.mdd11 = this.mddDatas.mid_5s_performance.mdd_list[0]   
            row3.mdd21 = this.mddDatas.mid_5s_performance.mdd_list[1]   
            row3.mdd31 = this.mddDatas.mid_5s_performance.mdd_list[2]  
            row3.name2 = 'IN'
            row3.dd2 = this.mddDatas.in_performance.dd
            row3.dd_days2 = this.mddDatas.in_performance.dd_days
            row3.mdd12 = this.mddDatas.in_performance.mdd_list[0]   
            row3.mdd22 = this.mddDatas.in_performance.mdd_list[1]   
            row3.mdd32 = this.mddDatas.in_performance.mdd_list[2]  
            this.mddRows.push(row3) 

            // 第四行
            var row4 = {}
            row4.name1 = '5S-H'
            row4.dd1 = this.mddDatas.high_5s_performance.dd
            row4.dd_days1 = this.mddDatas.high_5s_performance.dd_days
            row4.mdd11 = this.mddDatas.high_5s_performance.mdd_list[0]   
            row4.mdd21 = this.mddDatas.high_5s_performance.mdd_list[1]   
            row4.mdd31 = this.mddDatas.high_5s_performance.mdd_list[2]  
            row4.name2 = 'PM'
            row4.dd2 = this.mddDatas.pm_performance.dd
            row4.dd_days2 = this.mddDatas.pm_performance.dd_days
            row4.mdd12 = this.mddDatas.pm_performance.mdd_list[0]   
            row4.mdd22 = this.mddDatas.pm_performance.mdd_list[1]   
            row4.mdd32 = this.mddDatas.pm_performance.mdd_list[2]  
            this.mddRows.push(row4) 

            // 第五行
            var row5 = {}
            row5.name1 = '3S-H'
            row5.dd1 = this.mddDatas.super_high_3s_performance.dd
            row5.dd_days1 = this.mddDatas.super_high_3s_performance.dd_days
            row5.mdd11 = this.mddDatas.super_high_3s_performance.mdd_list[0]   
            row5.mdd21 = this.mddDatas.super_high_3s_performance.mdd_list[1]   
            row5.mdd31 = this.mddDatas.super_high_3s_performance.mdd_list[2]  
            row5.name2 = 'PB'
            row5.dd2 = this.mddDatas.pb_performance.dd
            row5.dd_days2 = this.mddDatas.pb_performance.dd_days
            row5.mdd12 = this.mddDatas.pb_performance.mdd_list[0]   
            row5.mdd22 = this.mddDatas.pb_performance.mdd_list[1]   
            row5.mdd32 = this.mddDatas.pb_performance.mdd_list[2]  
            this.mddRows.push(row5) 
        },

        toThousands: toThousands,
    },
}


</script>