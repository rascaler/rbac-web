<style rel="stylesheet/less" lang="less">
  @import "../styles/commons/common";
</style>
<template>
  <div id="privilegeContainer" class="row-mtb15">
    <el-row>
      <el-form ref="searchForm" :inline="true" :model="searchFormConfig.data">
        <el-form-item label="编码">
            <el-input v-model="searchFormConfig.data.code" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item label="权限名">
          <el-input v-model="searchFormConfig.data.name" placeholder="权限名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table ref="dataGrid" border :data="dataGridConfig.list">
        <el-table-column label="权限名" prop="name"></el-table-column>
        <el-table-column label="编码" prop="code"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="创建日期" prop="createdDate"></el-table-column>
        <el-table-column label="修改日期" prop="updatedDate"></el-table-column>
        <el-table-column label="启用状态" prop="state" :formatter="dataGridConfig.columns.state.formatter"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="operation_updateState(scope.$index, scope.row)">启用</el-button>
            <el-button
              size="small"
              @click="operation_detail(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="operation_delete(scope.$index, scope.row)">删除</el-button>
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
    </el-row>
  </div>
</template>
<script>
  import CONSTANT from '../commons/constant'
  const searchFormInit = {
    code: '',
    name: ''
  }
  export default {
    name: 'privilege',
    mounted () {
      this.pagePrivileges()
    },
    methods: {
      search () {
        this.searchFormConfig.data.pageNum = this.dataGridConfig.paginationConfig.pageNum
        this.searchFormConfig.data.pageSize = this.dataGridConfig.paginationConfig.pageSize
        this.pagePrivileges()
      },
      pagePrivileges () {
        this.$http.get(CONSTANT.API_URL.PRIVILEGE.PAGE_PRIVILEGE, {params: this.searchFormConfig.data})
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              this.dataGridConfig.list = res.data.list
              this.dataGridConfig.paginationConfig.total = res.data.total
            }
          })
      },
      operation_detail (index, row) {
      },
      operation_delete (index, row) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // todo get -> post
          this.$http.get(CONSTANT.API_URL.PRIVILEGE.DELETE, {id: row.id}, {
            emulateJSON: true
          }).then((response) => {
            let res = response.data
            if (res.ecode === CONSTANT.ResponseCode.SUCCESS) this.$message.success(res.msg)
            else this.$message.error(res.msg)
            // 刷新列表
            this.pagePrivileges()
          }).catch((response) => {
            this.$message.error('删除失败')
          })
        })
      },
      operation_updateState (index, row) {
        let state = 0
        if (row.state === 0) state = 1
        // todo get -> post
        this.$http.get(CONSTANT.API_URL.PRIVILEGE.UPDATE_STATE, {id: row.id, state: state}, {
          emulateJSON: true
        }).then((response) => {
          let res = response.data
          if (res.ecode === CONSTANT.ResponseCode.SUCCESS) this.$message.success(res.msg)
          else this.$message.error(res.msg)
          this.pagePrivileges()
        }).catch((response) => {
          this.$message.error('修改失败')
        })
      },
      // >>>>>>>>>>>>>>>>>>paginationConfig<<<<<<<<<<<<<<<<<<<<<<<<
      // 改变每页显示条数触发
      handleSizeChange (pageSize) {
        this.searchFormConfig.data.pageSize = pageSize
        this.dataGridConfig.paginationConfig.pageSize = pageSize
        this.pagePrivileges()
      },
      // 改变当前页触发
      handleCurrentChange (pageNum) {
        this.searchFormConfig.data.pageNum = this.dataGridConfig.paginationConfig.pageNum
        this.pagePrivileges()
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
