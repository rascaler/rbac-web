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
    <el-row class="no-margin">
      <el-button type="primary" @click="openEditDialog('add')">添加</el-button>
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

      <!-- 添加修改对话框  -->
      <el-dialog  :title="editDialogConfig.title" :visible.sync="editDialogConfig.visible" @close="closeEditDialog" size="tiny">

        <el-form :model="privilegeFormConfig.data" :rules="privilegeFormConfig.rules" ref="privilegeForm" :label-width="privilegeFormConfig.style.labelWidth">
          <el-form-item label="权限名" prop="name">
            <el-input v-model="privilegeFormConfig.data.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限编码" prop="code">
            <el-input v-model="privilegeFormConfig.data.code" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="privilegeFormConfig.data.description" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="应用" prop="appId">
            <el-select v-model="privilegeFormConfig.data.appId">
              <el-option
                v-for="item in appOption.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-tree
              ref="menuTree"
              :data="menuTreeConfig.data"
              show-checkbox
              default-expand-all
              highlight-current
              node-key="id"
              :props="menuTreeConfig.prop">
            </el-tree>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogConfig.visible = false">取 消</el-button>
          <el-button type="primary" @click="privilegeSaveOrUpdate">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
  import CONSTANT from '../commons/constant'
  const searchFormInit = {
    code: '',
    name: ''
  }

  const privilegeFormInit = {
    id: '',
    name: '',
    code: '',
    description: '',
    appId: '',
    menuIds: []
  }

  export default {
    name: 'privilege',
    mounted () {
      this.search()
    },
    watch: {
        'privilegeFormConfig.data.appId': {
          handler (newVal, oldVal) {
            this.appChange(newVal)
          },
          deep: true
        },
        'menuTreeConfig.data': {
          handler (newVal, oldVal) {
            let menuIds = this.privilegeFormConfig.data.menuIds
            if (newVal !== null && newVal.length > 0 && menuIds !== null && menuIds.length > 0) this.refreshPrivMenus()
          },
          deep: true
        },
        'privilegeFormConfig.data.menuIds': {
          handler (newVal, oldVal) {
            let treeData = this.menuTreeConfig.data
            if (newVal !== null && newVal.length > 0 && treeData !== null && treeData.length > 0) this.refreshPrivMenus()
          },
          deep: true
        }
    },
    methods: {
      search () {
        this.searchFormConfig.data.pageNum = this.dataGridConfig.paginationConfig.pageNum
        this.searchFormConfig.data.pageSize = this.dataGridConfig.paginationConfig.pageSize
        this.pagePrivileges()
      },
      pagePrivileges () {
        this.$http.get(CONSTANT.API_URL.PRIVILEGE.PAGE_PRIVILEGES, {params: this.searchFormConfig.data})
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              this.dataGridConfig.list = res.data.list
              this.dataGridConfig.paginationConfig.total = res.data.total
            }
          })
      },
      operation_detail (index, row) {
        this.$http.get(CONSTANT.API_URL.PRIVILEGE.GET_EDIT_DETAIL, {params: {id: row.id}})
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              if (res.data === null) return
              // 获取详情未表单赋值
              let privData = this.privilegeFormConfig.data
              privData.id = res.data.id
              privData.name = res.data.name
              privData.code = res.data.code
              privData.description = res.data.description
              privData.appId = res.data.appId
              privData.menuIds = res.data.menuIds === null ? [] : res.data.menuIds
              privData.description = res.data.description
              // 打开对话框
              this.openEditDialog('update')
            }
          })
      },
      operation_delete (index, row) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(CONSTANT.API_URL.PRIVILEGE.DELETE, {id: row.id}, {
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
        this.$http.post(CONSTANT.API_URL.PRIVILEGE.UPDATE_STATE, {id: row.id, state: state}, {
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
      },
      openEditDialog (type) {
        this.editDialogConfig.visible = true
        this.getApps()
      },
      closeEditDialog () {
          // 重置表单
          this.editDialogConfig.visible = false
          this.menuTreeConfig.data = []
          this.$refs['privilegeForm'].resetFields()
          this.appOption.options = []
          this.privilegeFormConfig.data = JSON.parse(JSON.stringify(privilegeFormInit))
      },
      privilegeSaveOrUpdate () {
        // 获取选中节点
        let nodes = this.$refs.menuTree.getCheckedNodes(false)
        console.log(this.$refs.menuTree.getCheckedKeys(false))
        let checkedMenus = []
        nodes.forEach(n => checkedMenus.push(n.id))
        this.privilegeFormConfig.data.menuIds = checkedMenus
        this.$refs['privilegeForm'].validate((valid) => {
          if (valid) {
            // 获取选中菜单和操作id
            let id = this.privilegeFormConfig.data.id
            let url = id !== null && id !== '' ? CONSTANT.API_URL.PRIVILEGE.UPDATE : CONSTANT.API_URL.PRIVILEGE.SAVE
            this.$http.post(url, JSON.stringify(this.privilegeFormConfig.data))
              .then((response) => {
                let res = response.data
                if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                  this.$message.success(res.msg)
                } else {
                  this.$message.error(res.msg)
                }
                // 刷新列表
                this.pagePrivileges()
              }).catch((response) => {
              this.$message.error('保存失败')
            })
            this.closeEditDialog()
          } else {
            return false
          }
        })
      },
      appChange (appId) {
        if (appId === null || appId === '') return
        this.$http.get(CONSTANT.API_URL.MENU.GET_MENU_TREE, {params: {appId: appId}})
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              this.menuTreeConfig.data = res.data
            }
          })
      },
      getApps () {
        this.$http.get(CONSTANT.API_URL.APP.GET_ALL)
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                if (res.data === null) return
                  res.data.forEach(i => {
                    this.appOption.options.push({
                      value: i.id,
                      label: i.name
                    })
                  })
            }
          })
      },
      refreshPrivMenus () {
        let formMenuIds = this.privilegeFormConfig.data.menuIds
        let gridList = this.menuTreeConfig.data
        if (formMenuIds != null && formMenuIds.length > 0 &&
            gridList !== null && gridList.length > 0) {
            this.$refs.menuTree.setCheckedKeys(formMenuIds) // 菜单选中
        }
      }
//      ,
//      handleCheckChange (data, checked, indeterminate) {
//        console.log(data, checked, indeterminate)
//        let menuIds = this.privilegeFormConfig.data.menuIds
//        if (checked) menuIds.push(data.id)
//        else {
//            let index = 0
//            while (index < menuIds.length) {
//                if (data.id === menuIds[index]) {
//                    menuIds.splice(index, 1)
//                    break
//                } else {
//                    index++
//                }
//            }
//        }
//        console.log(menuIds)
//      }
    },
    data () {
      // 信息验证
      let validatePrivilegeIds = (rule, value, callback) => {
        let menuIds = this.privilegeFormConfig.data.menuIds
        let appId = this.privilegeFormConfig.data.appId
        if (appId === null || appId === '') callback(new Error('请选择应用!'))
        if (menuIds === null || menuIds.length === 0) {
          callback(new Error('请选择菜单!'))
        } else {
          callback()
        }
      }
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
        privilegeFormConfig: {
          data: JSON.parse(JSON.stringify(privilegeFormInit)),
          rules: {
            name: [
              { required: true, message: '请输入权限名', trigger: 'blur' }
            ],
            code: [
              { required: true, message: '请输入权限编码', trigger: 'blur' }
            ],
            description: [
              { required: true, message: '请输入权限描述', trigger: 'blur' }
            ],
            appId: [
//              { required: true, message: '请选择应用', trigger: 'blur' },
              { validator: validatePrivilegeIds, trigger: 'blur' }
            ]
          },
          style: {
            labelWidth: '70px'
          }
        },
        menuTreeConfig: {
          data: [],
          prop: {
            label: 'name',
            children: 'children'
          }
        },
        appOption: {
          value: '',
          options: []
        }
      }
    }
  }
</script>
