<template>
   <el-row :gutter="0" type="flex"  style="margin-bottom: 20px">
          <!-- 资金Summary -->
          <el-table
            :data="balanceList"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px"
            :header-cell-style="{ background: '#f2f2f2' }"
            border
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column align="center" prop="portfolio"  sortable label="投资组合">
            </el-table-column>

            <el-table-column align="center" prop="exchange"  sortable label="交易所">
            </el-table-column>

            <el-table-column align="center" prop="username"  sortable label="账号">
            </el-table-column>

            <el-table-column align="center" prop="subType"  sortable label="类型">
            </el-table-column>

            <el-table-column align="center" prop="subMode"  sortable label="子类">
            </el-table-column>

            <el-table-column align="center" prop="asset"  sortable label="资产">
            </el-table-column>

            <el-table-column align="center" prop="amount"  label="数量">
            </el-table-column>

            <el-table-column align="center" prop="usdtAmount" sortable label="USDT">
            </el-table-column>
          </el-table>
    </el-row>
</template>

<script>
import config from '@/configs/system_configs'
import {Chart} from 'highcharts-vue'
import {toThousands} from '@/utils/general'


export default {
    components: {
        highcharts: Chart
    },

    props: {
        subaccountDatas: {
            type:Array,
            default:[]
        }
    },

    data() {
        return {
            balanceList: null,         
        }
    },

    created() {
        this.balanceList = []

        // 分析Data
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData() {
           for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let asset in this.subaccountDatas[i].wallet.balances.total){
                    if (Math.abs(this.subaccountDatas[i].wallet.usdt_balances[asset]) > 100) {
                        var usdtAmount = parseInt(this.subaccountDatas[i].wallet.usdt_balances[asset])
                        var exchange = this.subaccountDatas[i].subaccount.name.split('_')[0]
                        var pfo = this.subaccountDatas[i].subaccount.portfolio.alias
                        this.balanceList.push({
                            portfolio: pfo,
                            exchange: exchange,
                            username: this.subaccountDatas[i].subaccount.account.username,
                            subType: this.chineseString(this.subaccountDatas[i].subaccount.sub_type),
                            subMode: this.chineseString(this.subaccountDatas[i].subaccount.sub_mode),
                            asset: asset,
                            amount: this.subaccountDatas[i].wallet.balances.total[asset].toFixed(config.assetRoundLevel[asset]),
                            usdtAmount: usdtAmount
                        })
                    }
                }
            }   
        },

        chineseString(s) {
            var cs
            if (s === 'swap'){
            cs = '永续合约'
            } else if (s === 'margin'){
            cs = '杠杆现货'       
            } else if (s === 'coin'){
            cs = '币本位'
            } else if (s === 'usdt'){
            cs = 'U本位'
            } else if (s === 'usdt_share'){
            cs = '全仓U本位'
            } else if (s === 'isolate'){
            cs = '逐仓'
            } else if (s === 'share'){
            cs = '全仓'
            }
            return cs
        },

        toThousands: toThousands,

        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                } else if (index === 7) {
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' $';
                    } else {
                        sums[index] = '';
                    }
                } else {
                    sums[index] = '';
                }
            });
            return sums;
        }
    }
}
</script>