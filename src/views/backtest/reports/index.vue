<template>
    <div class="app-container" align="center">
        <div align="center" style="width: 95%;margin-top: 20px">
            <!-- 所有的Reports -->
            <reports
            v-bind:reports="reports">
            </reports>
        </div>

        <div>
            <el-pagination
                layout="prev, pager, next"
                :page-size="10"
                @current-change="loadReports"
                :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>
    
<script>
import reports from '@/views/backtest/reports/_reports'
import {getBacktestReports} from '@/api/backtest_report'
import config from '@/configs/system_configs'

export default {
    components: {
        reports,
    },

    data() {
        return {
            reports: null,
            totalCount: null,
            currentPage: null,

            refreshInterval: 5000,
            intervalId: null,
        }
    },

    created() {
        this.init()
    },

    methods: {
        init(){
            this.loadReports()
            this.startTimer()
        } ,

        loadReports(page=null) {
            this.currentPage = page
            var report_fields = 'id,name,task,created_ts,plan,run_seconds'
            getBacktestReports(config.backtestHost, report_fields, page).then(response => {
                this.reports = response.results
                this.totalCount = response.count
            })
        },

        // 定时刷新reports
        startTimer() {
            // 计时器正在进行中，退出函数
            if (this.intervalId != null) {
                return;
            }

            // 计时器为空，操作
            this.intervalId = setInterval(() => {
                    console.log("刷新" + new Date());
                    this.loadReports(this.currentPage)
                }, this.refreshInterval);
        }, 

        // 停止定时器
        stopTimer() {
            clearInterval(this.intervalId); //清除计时器
            this.intervalId = null; //设置为null
        },
    },

    destroyed(){
        // 在页面销毁后，清除计时器
        this.stopTimer();
    }
}
</script>