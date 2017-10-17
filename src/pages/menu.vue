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
          <el-button type="primary" icon="plus" @click="openEditDialog('add')" style="width: 100% "></el-button>
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
          <el-input placeholder="菜单名" v-model="menuTreeConfig.filterText"></el-input>
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
                     :filter-node-method="orgTreeConfig_filterNode"
                     @node-click="orgTreeConfig_handleNodeClick"
                     ref="menuTree"
                     :expand-on-click-node="false"
                     :render-content="orgTreeConfig_renderContent">
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
            <el-table-column prop="parentId" label="父节点" ></el-table-column>
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
        <el-form-item label="父节点" prop="parentId">
          <el-input v-model="menuFormConfig.data.parentId" auto-complete="off"></el-input>
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
        <el-button type="primary" >确 定</el-button>
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
    sequence: '',
    url: '',
    appId: '',
    parentId: '',
    type: 1,
    description: ''
  }

  export default {
    name: 'menu',
    mounted () {
      this.menuTreeConfig_initData()
      this.pageMenus()
    },
    watch: {
      'menuTreeConfig.filterText': {
        handler (newVal, oldVal) {
          this.$refs['menuTree'].filter(newVal)
        },
        deep: true
      }
    },
    methods: {
      search () {

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
      orgTreeConfig_filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      menuTreeConfig_initData () {
        this.$http.get(CONSTANT.API_URL.MENU.GET_APP_MENUS, {
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            this.menuTreeConfig.data = res.data
          }
        }).catch(function (response) {
          console.log(response)
        })
      },
      orgTreeConfig_handleNodeClick (data) {
        this.userQuery.organizationId = data.id
        this.orgTreeConfig.currentNodeData = data
        this.dataGridConfig.pageNum = this.dataGridConfig.pageNumInit
        // 查询
        this.pageUsers()
      },
      orgTreeConfig_operatorShow (e, data) {
        e.stopPropagation()
        this.menuTreeConfig.nodeId = data.id
      },
      orgTreeConfig_renderContent (h, { node, data, store }) {
        return (
          <span>
          <span>{data.name}</span>
        <span class="el-tree-node__label tree-operator-container">
          <i class="el-icon-setting" on-click={ (e) => this.orgTreeConfig_operatorShow(e, data) }></i>
        <ul class={'el-dropdown-menu ' + (this.menuTreeConfig.nodeId === data.id ? 'show' : 'hide')} on-click={ (e) => e.stopPropagation() } on-mouseleave={ () => { this.menuTreeConfig.nodeId = null } }>
      <li class="el-dropdown-menu__item node" on-click={ (e) => this.organizationDialogOpen(e, data) }>
      <i class="el-icon-plus"></i> &nbsp;添加子菜单</li>
        <li class="el-dropdown-menu__item" on-click={ (e) => this.getOrganizationDetail(e, data) }><i class="el-icon-edit"></i> &nbsp;修改</li>
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
        this.$confirm('此操作将永久删除该组织, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeOrganziaton(e, store, data)
        }).catch(() => {

        })
      },
      removeOrganziaton (e, store, data) {
        this.$http.post(CONSTANT.API_URL.ORGANIZATION.REMOVE, {id: data.id}, {
          emulateJSON: true
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            this.$message.success(res.msg)
            // 刷新组织树，并选中被删除的组织的父节点
            this.orgTreeConfig_initData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(function (response) {
          let res = response.data
          if (res) this.$message.error(res.msg)
        })
      },
      openEditDialog (type) {
        this.editDialogConfig.visible = true
      },
      closeEditDialog () {
        this.editDialogConfig.visible = false
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
           visible: true,
           title: '编辑 '
        },
        menuFormConfig: {
          data: JSON.parse(JSON.stringify(menuFormInit)),
          style: {
            labelWidth: '70px'
          },
          typeOption: {
              options: [{
                  value: 1,
                  label: '菜单'
              }, {
                  value: 0,
                  label: '操作'
              }]
          }
        }
      }
    }
  }
</script>
