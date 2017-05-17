<style>
  .row-mt20{
    margin-top: 20px;
  }
  .row-ml10{
    margin-left: 10px;
  }
  .col-ml10{
    margin-left: 10px;
  }
  .wd-persent100{
    width: 100%;
  }
</style>
<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-button type="primary" class="row-mt20 wd-persent100" icon="plus">添加</el-button>
        <el-input
          placeholder="组织名称"
          v-model="orgTreeConfig.filterText">
        </el-input>

        <el-tree
          class="filter-tree"
          :data="orgTreeConfig.data"
          :props="orgTreeConfig.defaultProps"
          accordion
          highlight-current
          node-key="id"
          :default-expanded-keys = "orgTreeConfig.expandedKeys"
          :filter-node-method="orgTreeConfig_filterNode"
          @node-click="orgTreeConfig_handleNodeClick"
          ref="tree2">
        </el-tree>
      </el-col>
      <el-col :span="19">
        <!-- 搜索栏-->
        <el-row :gutter="10">
          <el-col :span="5">
            <el-col :span="8">启用状态</el-col>
            <el-col :span="16">
              <el-select v-model="useStateOption.value" placeholder="请选择">
                <el-option
                  v-for="item in useStateOption.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="5" class="col-ml10">
            <el-input
              placeholder="姓名/手机/邮箱"
              icon="search"
              v-model="searchParams.keyword"
              :on-icon-click="handleIconClick">
            </el-input>
          </el-col>
        </el-row>
        <!-- 操作栏-->
        <el-row>
          <el-button type="primary" icon="plus" @click="dialogOption.visible = true">添加</el-button>
        </el-row>
        <!-- 表格-->
        <el-row>
          <el-table
            border
            :data="pageResult.list"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageResult.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="sizes, prev, pager, next"
            :total="pageResult.total">
          </el-pagination>
        </el-row>

        <!-- 对话框-->
        <el-row>
          <el-dialog :title="dialogOption.title" :visible.sync="dialogOption.visible">
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
              <el-button @click="dialogOption.visible = false">取 消</el-button>
              <el-button type="primary" @click="dialogOption.visible = false">确 定</el-button>
            </div>
          </el-dialog>
        </el-row>

      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'organization',
    mounted () {
        let vm = this
      // orgTreeConfig
      vm.orgTreeConfig_initData()
    },
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },
    methods: {
      // >>>>>>>>>>>>>>>>>>orgTreeConfig<<<<<<<<<<<<<<<<<<<<<<
      orgTreeConfig_filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      orgTreeConfig_initData () {
        let vm = this
        this.$http.get(this.API_URL.ORGANIZATION.GET_ORG_TREE, {
        }).then((response) => {
          let res = response.data
          if (res && res.ecode === '1000') {
            vm.orgTreeConfig.data = res.data
          }
        }).catch(function (response) {
          console.log(response)
        })
      },
      getOrgUsers (params) {
        let vm = this
        this.$http.get(this.API_URL.USER.GET_ORG_USERS, {
          params: params
        }).then((response) => {
            let data = response.data
            vm.pageResult.list = data
          }).catch(function (response) {
            console.log(response)
          })
      },
      orgTreeConfig_handleNodeClick (data) {
        let vm = this
        vm.getOrgUsers({
            keyword: 1
        })
      },
      handleSizeChange (data) {},
      handleCurrentChange (data) {},
      handleIconClick (data) {}
    },

    data () {
      return {
        tableData: [],
        currentPage: 1,
        searchParams: {
            keyword: ''
        },
        useStateOption: {
            value: '',
            options: [{
              value: '',
              label: '全部'
            }, {
              value: '1',
              label: '启用'
            }, {
              value: '0',
              label: '禁用'
            }]
        },
        pageResult: {
            total: 100,
            list: [],
            currentPage: 1
        },
        dialogOption: {
            visible: false,
            title: '添加'
        },
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        orgTreeConfig: {
          defaultProps: {
            children: 'children',
            label: 'name'
          },
          data: [],
          filterText: '',
          expandedKeys: [1]
        }
      }
    }
  }
</script>
