<style rel="stylesheet/less" lang="less">
  @import "../styles/commons/common";
</style>
<template>
<div id="roleContainer" class="row-mtb15">
  <el-row>
    <el-form :inline="true" :model="searchFormConfig.data" class="demo-form-inline">
      <el-form-item label="角色名">
        <el-input v-model="searchFormConfig.data.name" placeholder="请输入角色名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchFormConfig.data.state">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row class="no-margin">
    <el-button type="primary" @click="search">查询</el-button>
  </el-row>
  <el-row>
    <el-table
      :data="dataGridConfig.list"
      border
      style="width: 100%">
      <el-table-column prop="name" label="角色名" width="180"></el-table-column>
      <el-table-column prop="state" label="状态" width="180" :formatter="dataGridConfig.columns.state.formatter"></el-table-column>
      <el-table-column prop="parentId" label="父节点" width="180"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="operation_detail(scope.$index, scope.row)">详情</el-button>
          <el-button size="small" @click="operation_delete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="dataGridConfig.paginationConfig.pageNum"
      :page-sizes="dataGridConfig.paginationConfig.pageSizes"
      :page-size="dataGridConfig.paginationConfig.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataGridConfig.paginationConfig.total">
    </el-pagination>

    <!-- 添加修改对话框  -->
    <!-- 查看详情对话框 -->
  </el-row>

</div>
</template>
<script>
  import CONSTANT from '../commons/constant'
  const searchFormInit = {
      name: '',
      state: '',
      pageNum: 1,
      pageSize: 10
  }
  export default {
    name: 'role',
    mounted () {
      this.pageRoles()
    },
    methods: {
      // >>>>>>>>>>>>>>>>>>searchFormConfig<<<<<<<<<<<<<<<<<<<<<<<<
      search () {
        this.searchFormConfig.data.pageNum = this.dataGridConfig.paginationConfig.pageNum
        this.searchFormConfig.data.pageSize = this.dataGridConfig.paginationConfig.pageSize
        this.pageRoles()
      },
      // >>>>>>>>>>>>>>>>>>dataGridConfig<<<<<<<<<<<<<<<<<<<<<<<<
      operation_detail (index, row) {
      },
      operation_delete (index, row) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            console.log(row)
          this.$message.success('删除成功')
        }).catch(() => {
          this.$message.success('删除失败')
        })
      },
      // >>>>>>>>>>>>>>>>>>paginationConfig<<<<<<<<<<<<<<<<<<<<<<<<
      // 改变每页显示条数触发
      handleSizeChange (pageSize) {
        this.searchFormConfig.data.pageSize = pageSize
        this.dataGridConfig.paginationConfig.pageSize = pageSize
        this.pageRoles()
      },
      // 改变当前页触发
      handleCurrentChange (pageNum) {
        this.searchFormConfig.data.pageNum = this.dataGridConfig.paginationConfig.pageNum
        this.pageRoles()
      },
      pageRoles () {
        this.$http.get(CONSTANT.API_URL.ROLE.PAGE_ROLE, {params: this.searchFormConfig.data})
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              this.dataGridConfig.list = res.data.list
              this.dataGridConfig.paginationConfig.total = res.data.total
            }
          })
      }
    },
    data () {
      return {
        searchFormConfig: {
          data: JSON.parse(JSON.stringify(searchFormInit))
        },
        dataGridConfig: {
          list: [],
          columns: {
            state: {
                formatter (row, column) {
                  if (row.state === 1) return '启用'
                  else return '禁用'
                }
            }
          },
          paginationConfig: {
            pageNum: 1,
            pageSize: 10,
            pageSizes: [10, 20, 30, 40],
            total: 0,
            currentPage: 1
          }
        }
      }
    }
  }
</script>
