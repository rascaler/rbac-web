<style rel="stylesheet/less" lang="less">
  @import "../styles/commons/common";
  #organizaionContainer {
    #orgTree {
      .show {display: block;}
      .hide {display: none;}
      .tree-operator-container {right: 0px; margin-right: 5px;position:absolute;}
      .tree-container {position: absolute;width: 100%;}
      .el-dropdown-menu {left:20px;top:-6px;width:120px;}
    }
    .el-form { width: 400px;}
  }
</style>
<template>
  <div id="organizaionContainer">
    <el-row :gutter="15">
      <el-col class="row-mtb15" :span="5">
        <el-row>
          <el-input placeholder="组织名称" v-model="orgTreeConfig.filterText"></el-input>
        </el-row>
        <el-row>
          <div class="tree-container">
            <el-tree id="orgTree"
                     :data="orgTreeConfig.data"
                     :props="orgTreeConfig.props"
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
          </div>
        </el-row>
      </el-col>
      <el-col class="row-mtb15" :span="19">
        <!-- 搜索栏-->
        <el-row :gutter="10">
          <el-col :span="5">
            <el-col :span="8">账户状态</el-col>
            <el-col :span="16">
              <el-select v-model="userQuery.postState" placeholder="请选择">
                <el-option
                  v-for="item in userQueryConfig.postStateOption.options"
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
                  v-for="item in userQueryConfig.stateOption.options"
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
          <el-button type="primary" icon="plus" @click="userDialogOpen($event ,'add')">添加</el-button>
        </el-row>
        <!-- 表格-->
        <el-row>
          <el-table
            border
            :data="dataGridConfig.list"
            style="width: 100%">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="sex" label="性别" width="65" :formatter="dataGridConfig.formatter.sex"></el-table-column>
            <el-table-column prop="state" label="账户状态" width="95" :formatter="dataGridConfig.formatter.state"></el-table-column>
            <el-table-column prop="postState" label="在职情况" width="95" :formatter="dataGridConfig.formatter.postState"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="phone" label="手机"></el-table-column>
            <el-table-column label="操作" width="260">
              <template scope="scope">
                <el-button
                  size="small"
                  @click="leave(scope.row.id, scope.row.postState === 0 ? 1 : 0)">{{scope.row.postState === 0 ? '复职' : '离职'}}</el-button>
                <el-button
                  size="small"
                  @click="updateState(scope.row.id, scope.row.state === 0 ? 1 : 0)">{{scope.row.state === 0 ? '启用' : '禁用'}}</el-button>
                <el-button
                  size="small"
                  @click="userDialogOpen($event, 'update', scope.row)">编辑</el-button>
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

        <!-- 添加用户对话框-->
        <el-row>
          <el-dialog :title="userDialogConfig.title" :visible.sync="userDialogConfig.visible" @close="closeUserDialog">
            <el-form :model="userFormConfig.data" :rules="userFormConfig.rules" ref="userForm" :label-width="userFormConfig.style.labelWidth">
              <el-form-item label="用户类型">
                <el-radio-group v-model="userFormConfig.data.type">
                  <el-radio v-for="item in userFormConfig.typeOption.options"
                            :key="item.label"
                            :label="item.label"
                  >{{item.text}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用户名" prop="username" v-if="userFormConfig.data.id != null && userFormConfig.data.id != ''? false : true">
                <el-input v-model="userFormConfig.data.username" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" v-if="userFormConfig.data.id != null && userFormConfig.data.id != ''? false : true">
                <el-input type="password" v-model="userFormConfig.data.password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="passwordConfirm" v-if="userFormConfig.data.id != null && userFormConfig.data.id != ''? false : true">
                <el-input type="password" v-model="userFormConfig.data.passwordConfirm" auto-complete="off"></el-input>
              </el-form-item>
              <!--<el-form-item label="账户状态">-->
                <!--<el-radio-group v-model="userFormConfig.data.state">-->
                  <!--<el-radio v-for="item in userFormConfig.stateOption.options"-->
                            <!--:key="item.label"-->
                            <!--:label="item.label"-->
                            <!--&gt;{{item.text}}</el-radio>-->
                <!--</el-radio-group>-->
              <!--</el-form-item>-->
              <el-form-item label="真实姓名" prop="name">
                <el-input v-model="userFormConfig.data.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="userFormConfig.data.sex">
                  <el-radio v-for="item in userFormConfig.sexOption.options"
                            :key="item.label"
                            :label="item.label"
                  >{{item.text}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="职务" prop="roleIds">
                <el-select v-model="userFormConfig.data.roleIds" multiple>
                  <el-option
                    v-for="item in userFormConfig.postOption.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="userFormConfig.data.nickName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userFormConfig.data.email" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="userFormConfig.data.phone" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeUserDialog">取 消</el-button>
              <el-button type="primary" @click="userSaveOrUpdate">确 定</el-button>
            </div>
          </el-dialog>
        </el-row>

        <!-- 添加组织对话框-->
        <el-row>
          <el-dialog :size="organizationDialogConfig.size" :title="organizationDialogConfig.title" :visible.sync="organizationDialogConfig.visible" @close = "clearOrganizationForm">
            <el-tabs v-model="organizationTabConfig.activeName" type="border-card" @tab-click="handleClick">
              <el-tab-pane label="部门信息" name="first">
                <el-form :model="organizationFormConfig.data" ref="organizationFormConfig" :label-width="organizationFormConfig.style.labelWidth">
                  <el-form-item prop="parentName" label="上级部门">
                    <el-select v-model="organizationFormConfig.data.parentName" placeholder="请选择父组织" disabled>
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="name" label="部门名称">
                    <el-input v-model="organizationFormConfig.data.name" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input type="textarea" v-model="organizationFormConfig.data.description"></el-input>
                  </el-form-item>
                </el-form>
                <el-row>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="角色配置" name="second">
                <el-row type="flex" justify="center">
                  <el-transfer
                               v-model="roleTransferConfig.selectValue"
                               :props="roleTransferConfig.props"
                               :data="roleTransferConfig.data"
                               :titles="roleTransferConfig.titles">
                  </el-transfer>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
              <el-button @click="organizationDialogConfig.visible = false">取 消</el-button>
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

  const userFormInit = {
      id: '',
      username: '',
      name: '',
      password: '',
      passwordConfirm: '',
      state: 0,
      nickName: '',
      email: '',
      wechat: '',
      phone: '',
      sex: 0,
      roleIds: [],
      postState: 1,
      type: 0,
      organizationIds: []
  }
  const organizationFormConfigInit = {
    data: {
      roleIds: [],
      parentId: '',
      name: '',
      parentName: '',
      id: '',
      description: ''
    },
    style: {
      labelWidth: '80px'
    }
  }

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
          this.organizationFormConfig.data.roleIds = newVal
        },
        deep: true
      }
    },
    methods: {
      test () { alert(1) },
      clearOrganizationForm () {
//          this.organizationFormConfig = Object.assign({}, organizationFormConfigInit)
      },
      organizationDialogOpen (e, data) {
        // 重置表单
        if (this.$refs['organizationFormConfig']) this.$refs['organizationFormConfig'].resetFields()
        this.roleTransferConfig.selectValue = []
        // 重置选项卡
        this.organizationTabConfig.activeName = 'first'
        // 判断是否有选中组织，必须先选中父组织
        this.organizationFormConfig.data.parentId = data.id
        this.organizationFormConfig.data.parentName = data.name
        // 查询所有角色
        this.$http.get(CONSTANT.API_URL.ROLE.GET_USER_ROLES, {
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            // 写入结果
            this.roleTransferConfig.data = res.data
            // 打开模态框
            this.organizationDialogConfig.visible = true
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
      orgTreeConfig_initData (currentData) {
        this.$http.get(CONSTANT.API_URL.ORGANIZATION.GET_ORG_TREE, {
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            this.orgTreeConfig.data = res.data
            // 加载后选中第一条，查询第一组织用户
            if (res.data && res.data.length > 0) {
                if (currentData) {
                  this.orgTreeConfig.currentKey = currentData.id
                  this.orgTreeConfig.currentNodeData = currentData
                  this.orgTreeConfig.expandedKeys = [currentData.id]
                  this.userQuery.organizationId = currentData.id
                } else {
                  this.orgTreeConfig.currentKey = res.data[0].id
                  this.orgTreeConfig.currentNodeData = res.data[0]
                  this.orgTreeConfig.expandedKeys = [res.data[0].id]
                  this.userQuery.organizationId = res.data[0].id
                }
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
      orgTreeConfig_operatorShow (e, data) {
        e.stopPropagation()
        this.orgTreeConfig.nodeId = data.id
      },
      orgTreeConfig_renderContent (h, { node, data, store }) {
        return (
          <span>
            <span>{data.name}</span>
            <span class="el-tree-node__label tree-operator-container">
              <i class="el-icon-setting" on-click={ (e) => this.orgTreeConfig_operatorShow(e, data) }></i>
              <ul class={'el-dropdown-menu ' + (this.orgTreeConfig.nodeId === data.id ? 'show' : 'hide')} on-click={ (e) => e.stopPropagation() } on-mouseleave={ () => { this.orgTreeConfig.nodeId = null } }>
                <li class="el-dropdown-menu__item node" on-click={ (e) => this.organizationDialogOpen(e, data) }>
                  <i class="el-icon-plus"></i> &nbsp;添加子组织</li>
                <li class="el-dropdown-menu__item" on-click={ (e) => this.getOrganizationDetail(e, data) }><i class="el-icon-edit"></i> &nbsp;修改</li>
                <li class="el-dropdown-menu__item" on-click={ (e) => this.removeConfirm(e, store, data) }><i class="el-icon-delete"></i> &nbsp;删除</li>
                <li class="el-dropdown-menu__item el-dropdown-menu__item--divided is-disabled is-divided" >&nbsp;ID: {data.id}</li>
              </ul>
            </span>
          </span>
        )
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
      userSaveOrUpdate () {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            let formData = this.userFormConfig.data
            let url
            if (formData.id !== null && formData.id !== '') url = CONSTANT.API_URL.USER.UPDATE
            else url = CONSTANT.API_URL.USER.SAVE
            this.userFormConfig.data.organizationIds.push(this.orgTreeConfig.currentNodeData.id)
            this.$http.post(url, JSON.stringify(this.userFormConfig.data))
              .then((response) => {
                let res = response.data
                if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                  this.$message.success(res.msg)
                } else {
                  this.$message.error(res.msg)
                }
                // 关闭对话框
                this.closeUserDialog()
                // 刷新
                this.pageUsers()
              }).catch(function (response) {
              console.log(response)
            })
          } else {
            return false
          }
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
      saveOrganization (e, store, data) {
        this.$http.post(CONSTANT.API_URL.ORGANIZATION.SAVE_OR_UPDATE, JSON.stringify(this.organizationFormConfig.data))
          .then((response) => {
            let res = response.data
            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
              this.$message.success(res.msg)
              // 关闭弹窗
              this.organizationDialogConfig.visible = false
              // 刷新组织树，并选中新添加的节点
              this.orgTreeConfig_initData(res.data)
            } else {
              this.$message.error(res.msg)
            }
        }).catch(function (response) {
          console.log(response)
        })
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
      getOrganizationDetail (e, data) {
        this.$http.get(CONSTANT.API_URL.ORGANIZATION.DETAIL, {
            params: {
                id: data.id
            }
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            let formData = this.organizationFormConfig.data
            // 写入结果
            formData.roleIds = res.data.roleIds
            console.log(res.data.roleIds)
            this.roleTransferConfig.selectValue = res.data.roleIds ? res.data.roleIds : []
            formData.description = res.data.description
            formData.id = res.data.id
            formData.name = res.data.name
//            formData.parentId = res.data.parentId
//            formData.parentName
            // 打开模态框
            this.organizationDialogConfig.visible = true
            this.organizationDialogConfig.title = '修改'
          }
        }).catch(function (response) {
          console.log(response)
        })
        // 先查询详情
        this.organizationDialogOpen(e, data)
      },
      // >>>>>>>>>>>>>>>>>>userDialogConfig<<<<<<<<<<<<<<<<<<<<<<
      userDialogOpen (e, type, data) {
        if (type === 'add') { // 添加
           // 获取当前用户角色
          this.getUserRoles()
        } else { // 修改
          // 查询用户详情
          // 隐藏不能修改的输入框
          this.getUserRoles()
          this.getUserDetail(data.id)
        }
      },
      closeUserDialog () {
        // 清理dialog
        this.userFormConfig.data = JSON.parse(JSON.stringify(userFormInit))
        this.userDialogConfig.visible = false
      },
      getUserDetail (id) {
        this.$http.get(CONSTANT.API_URL.USER.DETAIL, {
            params: {id: id}
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            let data = res.data
            if (res.data) {
              this.userFormConfig.data.id = data.id
              this.userFormConfig.data.nickName = data.nickName
              this.userFormConfig.data.postState = data.postState
              this.userFormConfig.data.state = null
              this.userFormConfig.data.organizationIds = data.organizations ? data.organizations.map(o => o.id) : []
              this.userFormConfig.data.roleIds = data.roles ? data.roles.map(r => r.id) : []
              this.userFormConfig.data.name = data.name
              this.userFormConfig.data.email = data.email
              this.userFormConfig.data.phone = data.phone
              this.userFormConfig.data.sex = data.sex
              this.userFormConfig.data.type = data.type
              this.userFormConfig.data.wechat = data.wechat
            }
          }
          this.userDialogConfig.visible = true
        }).catch(function (response) {
          console.log(response)
        })
      },
      getUserRoles (callback) {
        this.$http.get(CONSTANT.API_URL.ROLE.GET_USER_ROLES, {
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
            if (res.data) {
              this.userFormConfig.postOption.options = []
              for (let item of res.data) {
                this.userFormConfig.postOption.options.push({value: item.id, label: item.name})
              }
            }
          }
          return response
        }).then((response) => {
          if (callback) callback()
          this.userDialogConfig.visible = true
        }).catch(function (response) {
          console.log(response)
        })
      },
      leave (id, postState) {
        this.$confirm('确认修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 离职
          this.$http.post(CONSTANT.API_URL.USER.LEAVE, {id: id, postState: postState}, {emulateJSON: true})
            .then((response) => {
              let res = response.data
              if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
              // 刷新分页
              this.pageUsers()
            }).catch(function (response) {
            console.log(response)
          })
        }).catch(() => {

        })
      },
      updateState (id, state) {
        this.$confirm('确认修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 修改账户状态
          this.$http.post(CONSTANT.API_URL.USER.UPDATE_STATE, {id: id, state: state}, {emulateJSON: true})
            .then((response) => {
              let res = response.data
              if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
              // 刷新分页
              this.pageUsers()
            }).catch(function (response) {
            console.log(response)
          })
        }).catch(() => {

        })
      }
    },

    data () {
      // userForm验证
      let validatePass = (rule, value, callback) => {
        if (this.userFormConfig.data.password !== '') {
          this.$refs.userForm.validateField('passwordConfirm')
        }
        callback()
      }
      let validatePassConfirm = (rule, value, callback) => {
        if (value !== this.userFormConfig.data.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      // 手机号码验证
      let validatePhone = (rule, value, callback) => {
        if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(this.userFormConfig.data.phone))) {
          callback(new Error('手机号码不正确!'))
        } else {
          callback()
        }
      }

      // organizationForm验证
      return {
        test: '',
        activeName2: 'first',
        userQueryConfig: {
          stateOption: {
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
          postStateOption: {
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
          }
        },
        userDialogConfig: {
            visible: false,
            title: '添加'
        },
        organizationDialogConfig: {
          visible: false,
          title: '添加',
          style: {
              width: '120px'
          },
          size: 'small'
        },
        userFormConfig: {
          data: JSON.parse(JSON.stringify(userFormInit)),
          rules: {
            phone: [
              { required: true, message: '请输入11位手机号码', trigger: 'blur' },
              { validator: validatePhone, trigger: 'blur,change' }
            ],
            email: [
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
            ],
            username: [
              { required: true, message: '请输入用户名（由字母、数字、下划线组成）', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 20 个字符（由字母、数字、下划线组成）', trigger: 'blur,change' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validatePass, trigger: 'blur' }
            ],
            passwordConfirm: [
              { required: true, message: '请再次输入密码', trigger: 'blur' },
              { validator: validatePassConfirm, trigger: 'blur' }
            ],
            nickName: [
              { required: true, message: '请输入昵称', trigger: 'blur' },
              { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur,change' }
            ],
            name: [
              { required: true, message: '请输入真实姓名', trigger: 'blur' },
              { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur,change' }
            ],
            roleIds: [
              { type: 'array', required: true, message: '请选择职务', trigger: 'change' }
            ]
          },
          style: {
            labelWidth: '80px'
          },
          stateOption: {
            options: [{
              label: 1,
              text: '启用'
            }, {
              label: 0,
              text: '禁用'
            }]
          },
          sexOption: {
            default: 0,
            options: [{
              label: 0,
              text: '未知'
            }, {
              label: 1,
              text: '男'
            }, {
              label: 2,
              text: '女'
            }]
          },
          postStateOption: {
            default: 0,
            options: [{
              label: 0,
              text: '离职'
            }, {
              label: 1,
              text: '在职'
            }]
          },
          typeOption: {
            default: 0,
            options: [{
              label: 0,
              text: '用户'
            }, {
              label: 1,
              text: '管理员'
            }, {
              label: 2,
              text: '用户兼管理员'
            }]
          },
          postOption: {
            value: [],
            options: [{
              value: 0,
              label: '管理员'
            }, {
              value: 1,
              label: '用户'
            }]
          }
        },
        organizationFormConfig: JSON.parse(JSON.stringify(organizationFormConfigInit)),
        formLabelWidth: '80px',
        orgTreeConfig: {
          props: {
            children: 'children',
            label: 'name'
          },
          data: [],
          filterText: '',
          expandedKeys: [],
          currentKey: '',
          currentNodeData: null,
          nodeId: null
        },
        userQuery: {
          organizationId: null,
          state: null,
          keyword: null,
          postState: null,
          pageNum: 1,
          pageSize: 10
        },
        dataGridConfig: {
            total: 0,
            list: [],
            pageNum: 1,
            pageNumInit: 1,
            pageSize: 10,
            pageSizes: [10, 20, 30, 40],
            formatter: {
                state (row, column) {
                    if (row.state === 1) return '启用'
                    else return '禁用'
                },
                postState (row, column) {
                  if (row.postState === 1) return '在职'
                  else return '离职'
                },
                sex (row, column) {
                  if (row.sex === 0) return '未知'
                  else if (row.sex === 1) return '男'
                  else return '女'
                }
            }
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
          titles: ['可分配角色', '已分配角色']
        }
      }
    }
  }
</script>
