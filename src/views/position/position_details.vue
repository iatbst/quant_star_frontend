<template>
    <el-row :gutter="0" type="flex">
          <!-- 资金Summary -->
          <el-table
            :data="positionList"
            style="width: 100%; margin-bottom: 20px; margin-top: 45px"
            :header-cell-style="{ background: '#f2f2f2' }"
            border
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

            <el-table-column align="center" prop="symbol"  sortable label="交易对">
            </el-table-column>

            <el-table-column align="center" prop="usdtAmount"  sortable label="仓位($)">
            </el-table-column>
          </el-table>
    </el-row>
</template>

<script>
import {chineseString} from '@/utils/chinese'


export default {
    props: {
        subaccountDatas: {
            type:Array,
            default:[]
        }
    },

    data() {
        return {
            positionList: null,
        }
    },

    created() {
        // 初始化
        this.positionList = []

        // 分析Data
        this.parseData()
    },

    methods: {
        // 处理父组件建传入data: pfoDatas
        parseData() {            
            for(var i = 0; i < this.subaccountDatas.length; i++){
                for(let symbol in this.subaccountDatas[i].positions.data){
                    var usdtAmount = this.subaccountDatas[i].positions.data[symbol]
                    var pfo = this.subaccountDatas[i].subaccount.portfolio.alias
                    var exchange = this.subaccountDatas[i].subaccount.account.name.split('_')[0]
                    this.positionList.push({
                        portfolio: pfo,
                        exchange: exchange,
                        username: this.subaccountDatas[i].subaccount.account.username,
                        subType: chineseString(this.subaccountDatas[i].subaccount.sub_type),
                        subMode: chineseString(this.subaccountDatas[i].subaccount.sub_mode),
                        symbol: symbol,
                        usdtAmount: parseInt(usdtAmount)
                    })                    
                }
            }
        },
    }
}
</script>