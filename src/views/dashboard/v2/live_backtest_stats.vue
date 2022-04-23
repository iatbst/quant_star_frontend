<template>
    <div>
        <el-table
            :data="liveBacktestStatDatas"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px"
            :header-cell-style="{ background: '#f2f2f2' }"
        >
            <el-table-column label="" min-width="16%" align="center">
                <template slot-scope="scope">
                {{ scope.row.stats }}
                </template>
            </el-table-column>

            <el-table-column label="实盘-半年" min-width="16%" align="center">
                <template slot-scope="scope">
                {{ scope.row.live }}
                </template>
            </el-table-column>

            <el-table-column label="回测15币-半年" min-width="16%" align="center">
                <template slot-scope="scope">
                {{ scope.row.btShortTerm }}
                </template>
            </el-table-column>

            <el-table-column label="回测15币-3年" min-width="16%" align="center">
                <template slot-scope="scope">
                {{ scope.row.btLongTerm }}
                </template>
            </el-table-column>
        </el-table> 
    </div>
</template>

<script>

export default {
    props: {
        liveBacktestStatDatas: {
            type:Array,
            default:[]
        },
        liveRets: {
            type:Object,
            default:{}         
        }
    },

    watch: {
        liveBacktestStatDatas: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        },
    },

    data() {
        return {
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        parseData(){
            // 注意: 实盘数据在summary_table中更新(因为summary_table中有对应的数据)
            this.liveBacktestStatDatas[0].live = (this.liveRets.annualReturn*100).toFixed(2) + '%'
            this.liveBacktestStatDatas[1].live = (this.liveRets.maxDrawdown*100).toFixed(2) + '%'
            this.liveBacktestStatDatas[2].live = (this.liveRets.countPerSymbol).toFixed(0)
            this.liveBacktestStatDatas[3].live = this.liveRets.winRatio + '%'
            this.liveBacktestStatDatas[4].live = this.liveRets.plRatio
        }
        
    },
}


</script>