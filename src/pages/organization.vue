<style rel="stylesheet/less" lang="less">
  @import "../styles/commons/common";
  #organizaionContainer {
  }
</style>
<template>
  <div id="organizaionContainer">
    <el-row :gutter="15">
      <el-col class="row-mtb15" :span="5">
        <el-row>
          <el-button type="primary" class="wd-persent100" icon="plus" @click="departmentDialogOpen">添加</el-button>
        </el-row>
        <el-row>
          <el-input placeholder="组织名称" v-model="orgTreeConfig.filterText"></el-input>
        </el-row>

        <el-tree
          class="filter-tree"
          :data="orgTreeConfig.data"
          :props="orgTreeConfig.props"
          accordion
          highlight-current
          :current-node-key="orgTreeConfig.currentKey"
          node-key="id"
          :default-expanded-keys = "orgTreeConfig.expandedKeys"
          :filter-node-method="orgTreeConfig_filterNode"
          @node-click="orgTreeConfig_handleNodeClick"
          ref="orgTree"
          :expand-on-click-node="false"
          :render-content="orgTreeConfig_renderContent">
        </el-tree>
      </el-col>
      <el-col class="row-mtb15" :span="19">
        <!-- 搜索栏-->
        <el-row :gutter="10">
          <el-col :span="5">
            <el-col :span="8">账户状态</el-col>
            <el-col :span="16">
              <el-select v-model="userQuery.state" placeholder="请选择">
                <el-option
                  v-for="item in useStateOption.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="5">
            <el-col :span="8">在职状态</el-col>
            <el-col :span="16">
              <el-select v-model="userQuery.state" placeholder="请选择">
                <el-option
                  v-for="item in useStateOption.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="5">
            <el-input placeholder="姓名/手机/邮箱" icon="search" v-model="userQuery.keyword" :on-icon-click="handleIconClick"></el-input>
          </el-col>
        </el-row>
        <!-- 操作栏-->
        <el-row>
          <el-button type="primary" icon="plus" @click="dialogConfig.visible = true">添加</el-button>
        </el-row>
        <!-- 表格-->
        <el-row>
          <el-table
            border
            :data="dataGridConfig.list"
            style="width: 100%">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="phone" label="手机"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <!-- 分页-->
        <el-row>
          <el-pagination
            @size-change="dataGrid_handleSizeChange"
            @current-change="dataGrid_handleCurrentChange"
            :current-page.sync="dataGridConfig.pageNum"
            :page-sizes="dataGridConfig.pageSizes"
            :page-size="dataGridConfig.pageSize"
            layout="sizes, prev, pager, next"
            :total="dataGridConfig.total">
          </el-pagination>
        </el-row>

        <!-- 对话框-->
        <el-row>
          <el-dialog :title="dialogConfig.title" :visible.sync="dialogConfig.visible">
            <el-form :model="form">
              <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="活动区域" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogConfig.visible = false">取 消</el-button>
              <el-button type="primary" @click="dialogConfig.visible = false">确 定</el-button>
            </div>
          </el-dialog>
        </el-row>

        <!-- 添加部门对话框-->
        <el-row>
          <el-dialog :size="departmentDialogConfig.size" :title="departmentDialogConfig.title" :visible.sync="departmentDialogConfig.visible">
            <el-tabs v-model="organizationTabConfig.activeName" type="border-card" @tab-click="handleClick">
              <el-tab-pane label="部门信息" name="first">
                <el-form :model="organizationForm" ref="organizationForm">
                  <el-form-item prop="parentName" label="上级部门" :label-width="formLabelWidth">
                    <el-select v-model="organizationForm.parentName" placeholder="请选择父组织" disabled>
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="name" label="部门名称" :label-width="formLabelWidth">
                    <el-input v-model="organizationForm.name" auto-complete="off"></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="角色配置" name="second">
                <el-transfer
                  v-model="roleTransferConfig.selectValue"
                  :props="roleTransferConfig.props"
                  :data="roleTransferConfig.data"
                  :titles="roleTransferConfig.titles">
                </el-transfer>
              </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
              <el-button @click="departmentDialogConfig.visible = false">取 消</el-button>
              <el-button type="primary" @click="saveOrganization">确 定</el-button>
            </div>
          </el-dialog>
        </el-row>

      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CONSTANT from '../commons/constant'
  export default {
    name: 'organization',
    mounted () {
      // orgTreeConfig
      this.orgTreeConfig_initData()
    },
    watch: {
      'orgTreeConfig.filterText': {
        handler (newVal, oldVal) {
          this.$refs['orgTree'].filter(newVal)
        },
        deep: true
      },
      'roleTransferConfig.selectValue': {
        handler (newVal, oldVal) {
          this.organizationForm.roleIds = newVal
        },
        deep: true
      }
    },
    methods: {
      departmentDialogOpen (e) {
        // 重置表单
        if (this.$refs['organizationForm']) this.$refs['organizationForm'].resetFields()
        this.roleTransferConfig.selectValue = []
        // 重置选项卡
        this.organizationTabConfig.activeName = 'first'
        // 判断是否有选中组织，必须先选中父组织
        this.organizationForm.parentId = this.orgTreeConfig.currentNodeData.id
        this.organizationForm.parentName = this.orgTreeConfig.currentNodeData.name
        // 查询所有角色
        this.$http.get(CONSTANT.API_URL.ROLE.GET_ALL, {
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            // 写入结果
            this.roleTransferConfig.data = res.data
            // 打开模态框
            this.departmentDialogConfig.visible = true
          }
        }).catch(function (response) {
          console.log(response)
        })
      },
      // >>>>>>>>>>>>>>>>>>orgTreeConfig<<<<<<<<<<<<<<<<<<<<<<
      orgTreeConfig_filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      orgTreeConfig_initData () {
        this.$http.get(CONSTANT.API_URL.ORGANIZATION.GET_ORG_TREE, {
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            this.orgTreeConfig.data = res.data
            // 加载后选中第一条，查询第一组织用户
            if (res.data && res.data.length > 0) {
              this.orgTreeConfig.currentKey = res.data[0].id
              this.orgTreeConfig.currentNodeData = res.data[0]
              this.userQuery.organizationId = res.data[0].id
            }
            this.pageUsers()
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
      orgTreeConfig_renderContent (h, { node }) {
          let el = document.createElement('span')
        el.innerText = 111
        return el
      },
      pageUsers () {
        this.userQuery.pageNum = this.dataGridConfig.pageNum
        this.userQuery.pageSize = this.dataGridConfig.pageSize
        this.$http.get(CONSTANT.API_URL.USER.PAGE_USERS, {
          params: this.userQuery
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            this.dataGridConfig.list = res.data.list
            this.dataGridConfig.total = res.data.total
          }
        }).catch(function (response) {
          console.log(response)
        })
      },
      dataGrid_handleSizeChange (pageSize) {
        this.dataGridConfig.pageSize = pageSize
        this.pageUsers()
      },
      dataGrid_handleCurrentChange (currentPage) {
        this.pageUsers()
      },
      handleIconClick (e) {
        this.pageUsers()
      },
      handleClick (tab, event) {
//        console.log(tab, event)
        console.log(this.roleTransferConfig.selectValue)
      },
      saveOrganization () {
        this.$http.post(CONSTANT.API_URL.ORGANIZATION.SAVE_OR_UPDATE, JSON.stringify(this.organizationForm))
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
        }).catch(function (response) {
          console.log(response)
        })
      }
    },

    data () {
      return {
        activeName2: 'first',
        useStateOption: {
            value: '',
            options: [{
              value: null,
              label: '全部'
            }, {
              value: 1,
              label: '启用'
            }, {
              value: 0,
              label: '禁用'
            }]
        },
        dialogConfig: {
            visible: false,
            title: '添加'
        },
        departmentDialogConfig: {
          visible: false,
          title: '添加',
          style: {
              width: '120px'

          },
          size: 'small'
        },
        form: {
          name: '',
          region: '1111',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        organizationForm: {
          roleIds: [],
          parentId: '',
          name: '',
          parentName: ''
        },
        formLabelWidth: '80px',
        orgTreeConfig: {
          props: {
            children: 'children',
            label: 'name'
          },
          data: [],
          filterText: '',
          expandedKeys: [1],
          currentKey: '',
          currentNodeData: null
        },
        userQuery: {
          organizationId: null,
          state: null,
          keyword: null,
          pageNum: 1,
          pageSize: 10
        },
        dataGridConfig: {
            total: 0,
            list: [],
            pageNum: 1,
            pageNumInit: 1,
            pageSize: 10,
            pageSizes: [10, 20, 30, 40]
        },
        organizationTabConfig: {
            activeName: 'first'
        },
        roleTransferConfig: {
          props: {
            key: 'id',
            label: 'name'
          },
          data: [],
          selectValue: [],
          titles: ['可选角色', '已选角色']
        }
      }
    }
  }
</script>
