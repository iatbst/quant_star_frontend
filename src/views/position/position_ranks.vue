<template>
    <div>
        <el-row :gutter="0" type="flex" v-bind:key="colOption.title.text" v-for="colOption in optionList">
            <!-- 仓位排名 -->
            <el-col :span="24">
                <highcharts :options="colOption"></highcharts>
            </el-col>   
        </el-row>  

        <!-- Diaglog: 经典三联组件 -->
        <el-dialog title="" :visible.sync="dialog3CmpVisible" width="60%" >
            <pfo-worker-sp
            v-bind:portfolios="portfolios"
            v-bind:portfolios-loading="portfoliosLoading"
            v-bind:workers="workers"
            v-bind:workers-loading="workersLoading"
            v-bind:signal-points="signalPoints"
            v-bind:signal-points-loading="signalPointsLoading"
            v-bind:current-worker="currentWorker"
            v-bind:host="host"
            @onClickPfo="onClickPfo"
            @onClickWorker="onClickWorker"
            ></pfo-worker-sp>
        </el-dialog>
    </div> 
</template>

<script>
import {Chart} from 'highcharts-vue'
import {addSingleColumn} from '@/utils/chart'
import {quoteToUSD} from '@/utils/general'
import {deepCopy} from '@/utils/general'
import pfoWorkerSp from '@/views/pfo_worker_sp/_pfo_worker_sp'

export default {
    components: {
        highcharts: Chart,
        pfoWorkerSp
    },

    props: {
        subaccountDatas: {
            type:Array,
            default:[]
        }
    },

    watch: {
        subaccountDatas: {
            handler(val, oldVal){
                this.parseData()
            },
            deep: true
        }
    },

    data() {
        return {
            colsPerRow: 35,     // 根据具体symbol数量调节, 防止最后一行col太少!
            positionRanks: null,
            optionList: [],
            positionOptions: {
                chart: {
                    type: 'column',
                    height: 300
                },

                title: {
                    text: null,
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '仓位($)'
                    },
                },
                
                exporting: { enabled: false },
                
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false,
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}$'
                },
                plotOptions: {
                    column: {
                        //stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: '仓位',
                    data: [],
                }],
            },

            dialog3CmpVisible: false,

            // Dialog: 点击某个symbol column之后, 展示对应经典三联
            host: null,
            currentWorker: null,

            portfolios: null,
            portfoliosLoading: true,

            workers: null,
            workersLoading: true,

            signalPoints: null,
            signalPointsLoading: false,
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        // 点击column后的处理函数
        onClickPosition(portfolios, symbol){
            this.portfolios = portfolios
            this.dialog3CmpVisible = true
            if (portfolios.length > 0){
                this.onClickPfo(portfolios[0], symbol)
            }
        },

        onClickPfo(pfo, symbol) {
            this.host = pfo.host
        },

        onClickWorker(worker) {

        },

        // 处理父组件建传入data: pfoDatas
        parseData() {    
            this.positionRanks = {}        
            for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let symbol in this.subaccountDatas[i].positions.data){
                    var usdtAmount = this.subaccountDatas[i].positions.data[symbol]

                    // 币种排名
                    var _symbol = quoteToUSD(symbol)
                    if (_symbol in this.positionRanks){
                        // 更新
                        this.positionRanks[_symbol]._y += usdtAmount
                        this.positionRanks[_symbol].y = parseInt(Math.abs(this.positionRanks[_symbol]._y))
                        this.positionRanks[_symbol].color = this.positionRanks[_symbol]._y >= 0 ? 'green' : 'red'
                    } else {
                        // 新symbol
                        this.positionRanks[_symbol] = {
                            x: _symbol,
                            y: parseInt(Math.abs(usdtAmount)),
                            _y: usdtAmount,
                            color: usdtAmount >= 0 ? 'green' : 'red'
                        }
                    }
                }
            }

            // 按行呈现
            this.optionList = []
            var sortedPositionRanks = Object.values(this.positionRanks).filter(function(val){
                return Math.abs(val.y) >= 10;   // USD < 10不呈现!
            }).sort((a, b) => Math.abs(b.y) - Math.abs(a.y))
            for(var i = 0; i < Math.ceil(sortedPositionRanks.length/this.colsPerRow); i++){
                var option = deepCopy(this.positionOptions)
                var start = i*this.colsPerRow+1
                var end = (i+1)*this.colsPerRow
                if (end > sortedPositionRanks.length){
                    end = sortedPositionRanks.length
                }
                option.title.text = start + ' - ' + end
                this.optionList.push(option)
                addSingleColumn(sortedPositionRanks.slice(i*this.colsPerRow, (i+1)*this.colsPerRow), option)
            }     
        },
    }
}
</script>