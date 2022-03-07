<template>
    <div class="app-container" align="center" >
        <div style="width: 95%; margin-top: 20px; margin-bottom: 20px">
            <h3 style="font-weight: normal">当前交易费率</h3>
            <el-table
            :data="feeRateDatas"
            :header-cell-style="{background: '#e5e9f2'}"
            >
                <el-table-column align="center" label="账户" min-width="20%">
                    <template slot-scope="scope">
                        {{ scope.row.acctName }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="产品类型" min-width="20%">
                    <template slot-scope="scope">
                        {{ chineseString(scope.row.subType) }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="Maker费率" min-width="20%">
                    <template slot-scope="scope">
                        {{ (scope.row.feeRate.trade.maker*100).toFixed(3) }}%
                    </template>
                </el-table-column>

                <el-table-column align="center" label="Taker费率" min-width="20%">
                    <template slot-scope="scope">
                        {{ (scope.row.feeRate.trade.taker*100).toFixed(3) }}%
                    </template>
                </el-table-column>         

            </el-table>  
        </div>
    </div>
</template>

<script>
import {toThousands} from '@/utils/general'
import {chineseString} from '@/utils/chinese'

export default {
  props: {
        // 接收从父传入data
        subaccountDatas: {
            type:Array,
            default:[]
        }
  },

    watch: {
        subaccountDatas(val){
            this.parseData()
        }
    },
    
  data() {
      return {
          feeRateDatas: null,
      }
  },

    created() {
        // 分析Data
        this.parseData()
    },

  methods: {
        // 处理父组件建传入data: pfoDatas
        parseData() {
            this.prepareFeeRateDatas()
        },

        // 为feeRates准备数据
        prepareFeeRateDatas(){
            // 计算total fee line
            this.feeRateDatas = []
            for(let i = 0; i < this.subaccountDatas.length; i++){
                var acctName = this.subaccountDatas[i].subaccount.account.name
                var subType = this.subaccountDatas[i].subaccount.sub_type
                this.feeRateDatas.push({
                    acctName: acctName,
                    subType: subType,
                    feeRate: this.subaccountDatas[i].fee_rates
                })
            }
        },
        chineseString: chineseString
  }
}

</script>
