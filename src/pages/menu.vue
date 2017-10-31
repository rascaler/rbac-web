<style rel="stylesheet/less" lang="less">
  @import "../styles/commons/common";
  #menuContainer {
    #menuTree {
      .show {display: block;}
      .hide {display: none;}
      .tree-operator-container {right: 0px; margin-right: 5px;position:absolute;}
      .tree-container {position: absolute;width: 100%;}
      .el-dropdown-menu {left:20px;top:-6px;width:120px;}
    }
  }
</style>
<template>
  <div id="menuContainer">
    <el-row :gutter="15">
      <el-col class="row-mtb15" :span="5">
        <el-row>
          <el-button type="primary" icon="plus" @click="openEditDialog(event, null, 'add')" style="width: 100% "></el-button>
        </el-row>
        <el-row>
          <el-select v-model="menuTreeConfig.appId" placeholder="请选择应用" style="width: 100%">
            <el-option
              v-for="item in menuTreeConfig.appOption.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-row>
        <el-row>
          <el-input placeholder="搜索" v-model="menuTreeConfig.filterText"></el-input>
        </el-row>
        <el-row>
          <div class="tree-container">
            <el-tree id="menuTree"
                     :data="menuTreeConfig.data"
                     :props="menuTreeConfig.props"
                     highlight-current
                     :current-node-key="menuTreeConfig.currentKey"
                     node-key="id"
                     :default-expanded-keys = "menuTreeConfig.expandedKeys"
                     :filter-node-method="menuTreeConfig_filterNode"
                     @node-click="menuTreeConfig_handleNodeClick"
                     ref="menuTree"
                     :expand-on-click-node="false"
                     :render-content="menuTreeConfig_renderContent">
            </el-tree>
          </div>
        </el-row>
      </el-col>
      <el-col class="row-mtb15" :span="19">
        <!-- 搜索栏-->
        <el-row>
          <el-form ref="searchForm" :inline="true" :model="searchFormConfig.data">
            <el-form-item label="编码">
              <el-input v-model="searchFormConfig.data.code" placeholder="编码"></el-input>
            </el-form-item>
            <el-form-item label="菜单名">
              <el-input v-model="searchFormConfig.data.name" placeholder="菜单名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 表格-->
        <el-row>
          <el-table
            border
            :data="dataGridConfig.list"
            style="width: 100%">
            <el-table-column prop="name" label="菜单名"></el-table-column>
            <el-table-column prop="code" label="编码"></el-table-column>
            <el-table-column prop="url" label="路由" ></el-table-column>
            <el-table-column prop="parentId" label="上级菜单" ></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
          </el-table>
        </el-row>
        <!-- 分页-->
        <el-row>
          <el-pagination
            @size-change="dataGrid_handleSizeChange"
            @current-change="dataGrid_handleCurrentChange"
            :current-page.sync="dataGridConfig.paginationConfig.pageNum"
            :page-sizes="dataGridConfig.paginationConfig.pageSizes"
            :page-size="dataGridConfig.paginationConfig.pageSize"
            layout="sizes, prev, pager, next"
            :total="dataGridConfig.paginationConfig.total">
          </el-pagination>
        </el-row>
      </el-col>
    </el-row>

    <!-- 添加菜单对话框-->
    <el-dialog  :title="editDialogConfig.title" :visible.sync="editDialogConfig.visible" @close="closeEditDialog" size="tiny">
      <el-form :model="menuFormConfig.data" :rules="menuFormConfig.rules" ref="menuForm" :label-width="menuFormConfig.style.labelWidth">
        <el-form-item label="上级菜单" prop="parentId" :style="{display:(menuFormConfig.data.parentId === '' ? 'none' : 'block')}">
          {{menuFormConfig.data.parentName}}
          <el-input style="display: none;" v-model="menuFormConfig.data.parentId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="menuFormConfig.data.type" placeholder="请选择菜单类型">
            <el-option
              v-for="item in menuFormConfig.typeOption.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名" prop="name">
          <el-input v-model="menuFormConfig.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="menuFormConfig.data.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon" >
          <el-input v-model="menuFormConfig.data.icon" auto-complete="off" style="display: inline-block;width: 90%;"></el-input>
          <i class="el-icon-setting" style="display: inline-block"></i>
        </el-form-item>
        <el-form-item label="路由" prop="url">
          <el-input v-model="menuFormConfig.data.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="sequence">
          <el-input v-model="menuFormConfig.data.sequence" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="menuFormConfig.data.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogConfig.visible = false">取 消</el-button>
        <el-button type="primary" @click="menuSaveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import CONSTANT from '../commons/constant'

  const searchFormInit = {
    code: '',
    name: ''
  }

  const menuFormInit = {
    id: '',
    name: '',
    code: '',
    icon: '',
    sequence: '',
    url: '',
    appId: '',
    parentId: '',
    type: 0,
    description: '',
    parentName: ''
  }

  export default {
    name: 'menu',
    mounted () {
      this.menuTreeConfig_initData()
      this.search()
    },
    watch: {
      'menuTreeConfig.filterText': {
        handler (newVal, oldVal) {
          this.$refs['menuTree'].filter(newVal)
        },
        deep: true
      },
      'menuTreeConfig.appId': {
        handler (newVal, oldVal) {
          // 先清理列表
          this.menuTreeConfig.data = []
          this.menuTreeConfig_initData(newVal)
        },
        deep: true
      }
    },
    methods: {
      search () {
        this.searchFormConfig.data.pageNum = this.dataGridConfig.paginationConfig.pageNum
        this.searchFormConfig.data.pageSize = this.dataGridConfig.paginationConfig.pageSize
        this.pageMenus()
      },
      pageMenus () {
        this.$http.get(CONSTANT.API_URL.MENU.PAGE_MENUS, {params: this.searchFormConfig.data})
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              this.dataGridConfig.list = res.data.list
              this.dataGridConfig.paginationConfig.total = res.data.total
            }
          })
      },
      // >>>>>>>>>>>>>>>>>>orgTreeConfig<<<<<<<<<<<<<<<<<<<<<<
      menuTreeConfig_filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      menuTreeConfig_initData (appId) {
        this.$http.get(CONSTANT.API_URL.MENU.GET_MENU_TREE, {
            params: {appId: appId}
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            this.menuTreeConfig.data = res.data
          }
        }).catch(function (response) {
          console.log(response)
        })
      },
      menuTreeConfig_handleNodeClick (data) {
        // 查询
        this.pageMenus()
      },
      orgTreeConfig_operatorShow (e, data) {
        e.stopPropagation()
        this.menuTreeConfig.nodeId = data.id
      },
      menuTreeConfig_renderContent (h, { node, data, store }) {
        return (
          <span>
          <span>{data.name}</span>
        <span class="el-tree-node__label tree-operator-container">
          <i class="el-icon-setting" on-click={ (e) => this.orgTreeConfig_operatorShow(e, data) }></i>
        <ul class={'el-dropdown-menu ' + (this.menuTreeConfig.nodeId === data.id ? 'show' : 'hide')} on-click={ (e) => e.stopPropagation() } on-mouseleave={ () => { this.menuTreeConfig.nodeId = null } }>
          <li class="el-dropdown-menu__item node" on-click={ (e) => this.openEditDialog(e, data, 'add') }>
            <i class="el-icon-plus"></i> &nbsp;添加子菜单
          </li>
          <li class="el-dropdown-menu__item" on-click={ (e) => this.openEditDialog(e, data, 'update') }><i class="el-icon-edit"></i> &nbsp;修改</li>
          <li class="el-dropdown-menu__item" on-click={ (e) => this.removeConfirm(e, store, data) }><i class="el-icon-delete"></i> &nbsp;删除</li>
          <li class="el-dropdown-menu__item el-dropdown-menu__item--divided is-disabled is-divided" >&nbsp;ID: {data.id}</li>
        </ul>
        </span>
        </span>
      )
      },
      dataGrid_handleSizeChange (pageSize) {
        this.dataGridConfig.pageSize = pageSize
        this.pageMenus()
      },
      dataGrid_handleCurrentChange (currentPage) {
        this.pageMenus()
      },
      handleIconClick (e) {
        this.pageMenus()
      },
      removeConfirm (e, store, data) {
        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeMenu(e, store, data)
        }).catch(() => {

        })
      },
      removeMenu (e, store, data) {
        let parentId = data.parentId
        this.$http.post(CONSTANT.API_URL.MENU.REMOVE, {id: data.id}, {
          emulateJSON: true
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            this.$message.success(res.msg)
            // 刷新组织树，并选中被删除的组织的父节点
            this.menuTreeConfig_initData(this.menuTreeConfig.appId)
            if (data && data.parentId !== 0) this.menuTreeConfig.expandedKeys = [parentId]
            // 刷新分页列表
            this.pageMenus()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(function (response) {
          let res = response.data
          if (res) this.$message.error(res.msg)
        })
      },
      openEditDialog (e, data, type) {
        // 初始化表单
        if (data) {
          this.menuFormConfig.data.parentId = data.id
          this.menuFormConfig.data.parentName = data.name
        }
        if (type === 'add') this.menuFormConfig.data.appId = this.menuTreeConfig.appId
        else this.getEditDetail(data.id)
        this.editDialogConfig.visible = true
      },
      closeEditDialog () {
        this.editDialogConfig.visible = false
        // 重置表单
        this.$refs.menuForm.resetFields()
      },
      menuSaveOrUpdate () {
        this.$refs['menuForm'].validate((valid) => {
          if (valid) {
            // 获取选中菜单和操作id
            let id = this.menuFormConfig.data.id
            let url = id !== null && id !== '' ? CONSTANT.API_URL.MENU.UPDATE : CONSTANT.API_URL.MENU.SAVE
            this.$http.post(url, this.menuFormConfig.data, {emulateJSON: true})
              .then((response) => {
                let res = response.data
                if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                  this.$message.success(res.msg)
                  // 刷新树菜单
                  this.menuTreeConfig_initData(this.menuTreeConfig.appId)
                  // 选中刷新的菜单
                  this.menuTreeConfig.expandedKeys = [res.data.id]
                  this.pageMenus()
                } else {
                  this.$message.error(res.msg)
                }
                // 将新节点加入
              }).catch((response) => {
              this.$message.error('保存失败')
            })
            this.closeEditDialog()
          } else {
            return false
          }
        })
      },
      getEditDetail (id) {
          this.$http.get(CONSTANT.API_URL.MENU.GET_EDIT_DETAIL, {
              params: {id: id}
          }).then((response) => {
              let res = response.data
              if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                  let formData = this.menuFormConfig.data
                  formData.id = res.data.id
                  formData.parentId = res.data.prarentId
                  formData.name = res.data.name
                  formData.code = res.data.code
                  formData.url = res.data.url
                  formData.sequence = res.data.sequence
                  formData.type = res.data.type
                  formData.description = res.data.description
                  formData.icon = res.data.icon
              } else {
                this.$message.error(res.msg)
            }
          }).catch((response) => {
            this.$message.error('查询失败')
          })
      }
    },
    data () {
      return {

        formLabelWidth: '80px',
        menuTreeConfig: {
          props: {
            children: 'children',
            label: 'name'
          },
          data: [],
          filterText: '',
          expandedKeys: [],
          currentKey: '',
          currentNodeData: null,
          nodeId: null,
          appOption: {
            default: '',
            options: [{
              label: 'rbac后台管理',
              value: 1
            }, {
              label: '门户网站',
              value: 2
            }]
          },
          appId: ''
        },
        dataGridConfig: {
          list: [],
          paginationConfig: {
            pageNum: 1,
            pageSize: 10,
            pageSizes: [10, 20, 30, 40],
            total: 0,
            currentPage: 1
          }
        },
        searchFormConfig: {
          data: JSON.parse(JSON.stringify(searchFormInit))
        },
        editDialogConfig: {
           visible: false,
           title: '编辑 '
        },
        menuFormConfig: {
          data: JSON.parse(JSON.stringify(menuFormInit)),
          style: {
            labelWidth: '70px'
          },
          typeOption: {
              options: [{
                  value: 0,
                  label: '菜单'
              }, {
                  value: 1,
                  label: '操作'
              }]
          },
          rules: {}
        }
      }
    }
  }
</script>
