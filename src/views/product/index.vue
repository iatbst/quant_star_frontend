<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.product_type }}
        </template>
      </el-table-column>

      <el-table-column label="交易所">
        <template slot-scope="scope">
          {{ scope.row.exchange.name }}
        </template>
      </el-table-column>

      <el-table-column label="代码">
        <template slot-scope="scope">
          {{ scope.row.symbol }}
        </template>
      </el-table-column>

      <el-table-column label="平台代码">
        <template slot-scope="scope">
          {{ scope.row.exchange_symbol }}
        </template>
      </el-table-column>

      <el-table-column label="子类">
        <template slot-scope="scope">
          {{ scope.row.sub_type }}
        </template>
      </el-table-column>

      <el-table-column label="结算资产">
        <template slot-scope="scope">
          {{ scope.row.settle_currency }}
        </template>
      </el-table-column>

      <el-table-column label="交易单位">
        <template slot-scope="scope">
          {{ scope.row.size_type }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getProductList } from '@/api/product'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getProductList().then(response => {
        // console.log(response)
        this.list = response.results
        this.listLoading = false
      })
    }
  }
}
</script>
