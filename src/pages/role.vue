<style rel="stylesheet/less" lang="less">
  @import "../styles/commons/common";
  .el-edit-form { width: 400px;}
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
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row class="no-margin">
    <el-button type="primary" @click="openEditDialog('add')">添加</el-button>
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
          <el-button size="small" @click="operation_detail(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" @click="operation_updateState(scope.$index, scope.row)">启用</el-button>
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
    <el-dialog  :title="editDialogConfig.title" :visible.sync="editDialogConfig.visible" @close="closeEditDialog" size="tiny">

      <el-form :model="roleFormConfig.data" :rules="roleFormConfig.rules" ref="roleForm" :label-width="roleFormConfig.style.labelWidth">
        <el-form-item label="父角色" prop="parentId">
          <el-select clearable v-model="roleFormConfig.data.parentId" placeholder="请选择父角色">
            <el-option
              v-for="item in roleFormConfig.parentRole.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="roleFormConfig.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="roleFormConfig.data.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="privilegeIds">
          <el-table
            :data="privDataGridConfig.list"
            border
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40">
            </el-table-column>
            <el-table-column prop="name" label="角色名" width="180"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="roleSaveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
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
  const roleFormInit = {
      id: '',
      name: '',
      state: '',
      description: '',
      parentId: '',
      privilegeIds: []
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
      openEditDialog (type) {
        this.editDialogConfig.visible = true
        this.getRoles()
        this.getPrivileges()
        if (type === 'add') {
            this.editDialogConfig.title = '添加'
        } else {
            this.editDialogConfig.title = '修改'
        }
      },
      closeEditDialog () {
        // 重置表单
        this.editDialogConfig.visible = false
        this.roleFormConfig.data = JSON.parse(JSON.stringify(roleFormInit))
      },
      roleSaveOrUpdate () {
//        this.$loading({target: document.getElementById('editDialog')})
        let id = this.roleFormConfig.data.id
        let url = id !== null && id !== '' ? CONSTANT.API_URL.ROLE.UPDATE : CONSTANT.API_URL.ROLE.SAVE
        this.$http.post(url, JSON.stringify(this.roleFormConfig.data))
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                this.$message.success(res.msg)
            } else {
                this.$message.error(res.msg)
            }
          }).catch((response) => {
            this.$message.error('保存失败')
        })
        this.closeEditDialog()
      },
      getRoles () {
          this.$http.get(CONSTANT.API_URL.ROLE.GET_ALL, {
          }).then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              let options = []
              for (let value of res.data) {
                  options.push({
                      label: value.name,
                      value: value.id
                  })
              }
              this.roleFormConfig.parentRole.options = options
            }
          }).catch((response) => {

          })
      },
      getPrivileges () {
          this.$http.get(CONSTANT.API_URL.PRIVILEGE.GET_PRIVILEGES, {
            params: {id: 1}
          }).then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              this.privDataGridConfig.list = res.data
            }
          }).catch((response) => {

          })
      },
      handleSelectionChange (rows) {
        let privIds = []
        for (let row of rows) {
          privIds.push(row.id)
        }
        this.roleFormConfig.data.privilegeIds = privIds
      },
      // >>>>>>>>>>>>>>>>>>dataGridConfig<<<<<<<<<<<<<<<<<<<<<<<<
      operation_detail (index, row) {
          this.openEditDialog('update')
          // 查询详情
          this.$http.get(CONSTANT.API_URL.ROLE.DETAIL, {
              params: {id: row.id}
          }).then((response) => {
              let res = response.data
              if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                  let roleFormData = this.roleFormConfig.data
                  roleFormData.id = res.data.id
                  roleFormData.name = res.data.name
                  roleFormData.description = res.data.description
                  roleFormData.parentId = res.data.parentId
              } else {
                  this.$message.error(res.msg)
              }
          }).catch((response) => {
              this.$message.error('无法查询角色详情')
          })
      },
      operation_updateState (index, row) {
          let state = 0
          if (row.state === 0) state = 1
          // todo get => post
          this.$http.get(CONSTANT.API_URL.ROLE.UPDATE_STATE, {id: row.id, state: state}, {
            emulateJSON: true
          }).then((response) => {
            let res = response.data
            if (res.ecode === CONSTANT.ResponseCode.SUCCESS) this.$message.success(res.msg)
            else this.$message.error(res.msg)
          }).catch((response) => {
            this.$message.error('修改失败')
          })
      },
      operation_delete (index, row) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            console.log(row)
          this.$message.success('删除成功')
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
      // 手机号码验证
//      let validatePhone = (rule, value, callback) => {
//        if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(this.userFormConfig.data.phone))) {
//          callback(new Error('手机号码不正确!'))
//        } else {
//          callback()
//        }
//      }

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
        },
        editDialogConfig: {
            title: '编辑',
            visible: false
        },
        roleFormConfig: {
           data: JSON.parse(JSON.stringify(roleFormInit)),
           rules: {
            name: [
              { required: true, message: '请输入角色名', trigger: 'blur' }
            ],
            description: [
              { required: true, message: '请输入角色描述', trigger: 'blur' }
            ]
           },
           style: {
              labelWidth: '70px'
           },
           parentRole: {
            default: 0,
            options: []
          }
        },
        privDataGridConfig: {
            list: []
        }

      }
    }
  }
</script>
