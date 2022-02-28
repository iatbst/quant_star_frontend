<template>
    <div>
        <el-row :gutter="0" type="flex" v-bind:key="colOption.title.text" v-for="colOption in optionList">
            <!-- 仓位排名 -->
            <el-col :span="24">
                <highcharts :options="colOption"></highcharts>
            </el-col>   
        </el-row>  

        <!-- Diaglog: 经典三联组件 -->
        <el-dialog title="" :visible.sync="dialog3CmpVisible" width="80%" >
            <pfo-worker-sp
                v-bind:portfolios="portfolios"
                v-bind:portfolios-loading="portfoliosLoading"
                v-bind:currentPfo="currentPfo"

                v-bind:workers="workers"
                v-bind:workers-loading="workersLoading"
                v-bind:current-worker="currentWorker"

                v-bind:signal-points="signalPoints"
                v-bind:signal-points-loading="signalPointsLoading"

                @onClickPfo="onClickPfo"
                @onClickWorker="onClickWorker"
            ></pfo-worker-sp>
        </el-dialog>
    </div> 
</template>

<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'
import {getWorkersBySymbol} from '@/api/worker'
import {addSingleClickableColumn} from '@/utils/chart'
import {quoteToUSD} from '@/utils/general'
import {deepCopy} from '@/utils/general'
import pfoWorkerSp from '@/views/pfo_worker_sp/_pfo_worker_sp'
import { getSignalPointsByWorker } from '@/api/signal_point'

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
            colsPerRow: 38,     // 根据具体symbol数量调节, 防止最后一行col太少!
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
                    pointFormat: '{series.name}: ${point.y}'
                },
                plotOptions: {
                    // series: {
                    //     cursor: 'pointer',
                    //     point: {
                    //         events: {
                    //             click: function () {
                    //                 // this.onClickColumn(this.pfoDatas);
                    //                 // alert(this.y);
                    //                 alert('click col');
                    //             }
                    //         }
                    //     }
                    // },

                    column: {
                        //stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                },
                series: [{
                    name: '仓位',
                    data: [],
                }],
            },

            dialog3CmpVisible: false,

            // Dialog: 点击某个symbol column之后, 展示对应经典三联
            portfolios: null,
            portfoliosLoading: true,
            currentPfo: null,

            workers: null,
            workersLoading: true,
            currentWorker: null,

            signalPoints: null,
            signalPointsLoading: false,
        }
    },

    created() {
        // 分析Data
        this.parseData()
    },

    methods: {
        // 点击column后的处理函数, portfolioDatas格式:
        // [{name: pfoName, host: xxx, symbol: xxx}, {name: pfoName, host: xxx, symbol: xxx}, xxx]
        // 注意: symbol是pfo的指定workers
        onClickColumn(portfolioDatas){
            portfolioDatas.sort((a, b) => a.sort_id - b.sort_id)
            this.portfolios = portfolioDatas
            this.portfoliosLoading = false
            this.dialog3CmpVisible = true
            if (portfolioDatas.length > 0) {
                this.onClickPfo(portfolioDatas[0])
            }
        },

        onClickPfo(pfoData) {
            this.currentPfo = pfoData
            this.fetchWorkersBySymbol(pfoData.symbol, this.onClickWorker)
        },

        onClickWorker(worker) {
            this.currentWorker = worker
            this.fetchSignalPointsByWorker(worker)
        },

        fetchWorkersBySymbol(symbol, onWorkers) {
            this.workersLoading = true
            getWorkersBySymbol(symbol, this.currentPfo.host).then(response => {
                response.results.sort(function(a,b){return a.name.localeCompare(b.name)})
                this.workers = response.results
                this.workersLoading = false
                if (this.workers.length > 0){
                    // 回调
                    onWorkers(this.workers[0])
                } else {
                    this.signalPoints = []
                }
            })
        },

        fetchSignalPointsByWorker(worker) {
            this.signalPointsLoading = true
            getSignalPointsByWorker(worker, this.currentPfo.host).then(response => {
                this.signalPoints = response.results
                this.signalPointsLoading = false
            })
        },

        // 处理父组件建传入data: pfoDatas
        parseData() {    
            this.positionRanks = {}        
            for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let symbol in this.subaccountDatas[i].positions.data){
                    var usdtAmount = this.subaccountDatas[i].positions.data[symbol]
                    var pfoName = this.subaccountDatas[i].subaccount.portfolio.name
                    var host = this.subaccountDatas[i].subaccount.portfolio.host
                    // 币种排名
                    var _symbol = quoteToUSD(symbol)
                    if (_symbol in this.positionRanks){
                        // 更新
                        this.positionRanks[_symbol]._y += usdtAmount
                        this.positionRanks[_symbol].y = parseInt(Math.abs(this.positionRanks[_symbol]._y))
                        this.positionRanks[_symbol].color = this.positionRanks[_symbol]._y >= 0 ? 'green' : 'red'
                        this.positionRanks[_symbol].pfoDatas.push({
                            name: pfoName,
                            symbol: symbol.toLowerCase(),
                            host: host, 
                            sort_id: config.pfoSortWeights[pfoName]                           
                        })
                    } else {
                        // 新symbol
                        this.positionRanks[_symbol] = {
                            x: _symbol,
                            y: parseInt(Math.abs(usdtAmount)),
                            _y: usdtAmount,
                            color: usdtAmount >= 0 ? 'green' : 'red',
                            pfoDatas: [{
                                name: pfoName,
                                symbol: symbol.toLowerCase(),
                                host: host,
                                sort_id: config.pfoSortWeights[pfoName]
                            }]
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
                addSingleClickableColumn(sortedPositionRanks.slice(i*this.colsPerRow, (i+1)*this.colsPerRow), option, this.onClickColumn, 'pfoDatas')
            }     
        },

        // addSingleClickableColumn(data_list, options, onClick) {
        //     options.xAxis.categories = []
        //     options.series[0].data = []
        //     for (var i = 0; i < data_list.length; i++){
        //         options.series[0].data.push({
        //             y: data_list[i].y,
        //             color: data_list[i].color,
        //             pfoDatas: data_list[i].pfoDatas
        //         })  
        //         options.xAxis.categories.push(data_list[i].x)           
        //     }
        //     options.plotOptions['series'] = {
        //         cursor: 'pointer',
        //         point: {
        //             events: {
        //                 click: function (){
        //                     // alert(JSON.stringify(this.pfoDatas, null, 4));
        //                     onClick(this.pfoDatas)
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}
</script>