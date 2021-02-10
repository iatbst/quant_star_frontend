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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>

      <el-table-column label="Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="Exchange" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.exchange.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Gateway" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gateway.name }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getWorkerList } from '@/api/worker'

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
      getWorkerList().then(response => {
        // console.log(response)
        this.list = response
        this.listLoading = false
      })
    }
  }
}
</script>
