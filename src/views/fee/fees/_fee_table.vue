<!-- 
    模板: 展示传入的backtest_plan list
-->
<template>
    <div>
        <el-table
        :data="feeDatas"
        :header-cell-style="{background: '#e5e9f2'}"
        show-summary
        sum-text="合计"
        :summary-method="getSummaries"
        >
            <el-table-column align="center" label="账户" min-width="20%">
                <template slot-scope="scope">
                    {{ scope.row.acctName }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="Subaccount状态" min-width="10%">
                <template slot-scope="scope">
                    <span style="color: red" v-if="scope.row.status == 'disable'">
                        {{ chineseString(scope.row.status) }}
                    </span>
                    <span style="color: green" v-else>
                        {{ chineseString(scope.row.status) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="产品类型" min-width="10%">
                <template slot-scope="scope">
                    {{ chineseString(scope.row.subType) }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="费用类型" min-width="20%">
                <template slot-scope="scope">
                    {{ chineseString(scope.row.feeType) }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="时间范围" min-width="20%">
                <template slot-scope="scope">
                    {{ scope.row.startMonth }} ~ {{ scope.row.endMonth }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="金额($)" min-width="20%">
                <template slot-scope="scope">
                    <span style="color: red" v-if="scope.row.sum > 0">
                        {{ toThousands(Math.round(scope.row.sum)) }}
                    </span>
                    <span style="color: green" v-else>
                        {{ toThousands(Math.round(scope.row.sum)) }}
                    </span>
                </template>
            </el-table-column>

        </el-table>  
  </div>
</template>

<script>
import {toThousands} from '@/utils/general'
import {chineseString} from '@/utils/chinese'

export default {
  props: {
      // 接收从父传入data
      feeDatas: {
          type:Array,
          default:[]
      }
  },

  data() {
      return {
      }
  },

  methods: {
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          } else if(index !== 5){
            sums[index] = null
            return;
          } else {
            var sum = 0
            for(let i = 0; i < data.length; i++){
                sum += data[i].sum
            }
            sums[index] = toThousands(Math.round(sum))
            return;
          }
        });

        return sums;
      },
      toThousands: toThousands,
      chineseString: chineseString
  }
}

</script>
