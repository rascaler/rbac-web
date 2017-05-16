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
</style>
<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-input
          placeholder="组织名称"
          v-model="filterText">
        </el-input>

        <el-tree
          class="filter-tree"
          :data="data2"
          :props="defaultProps"
          accordion
          highlight-current
          node-key="id"
          :default-expanded-keys = "expandedKeys"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          ref="tree2">
        </el-tree>
      </el-col>
      <el-col :span="19">
        <!-- 搜索栏-->
        <el-row class="row-mt20 row-ml10">
          <form>
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
          </form>
        </el-row>
        <!-- 操作栏-->
        <el-row class="row-mt20 row-ml10">
          <el-button type="primary" icon="plus" @click="dialogOption.visible = true">添加</el-button>
        </el-row>
        <!-- 表格-->
        <el-row class="row-mt20 row-ml10">
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
        <el-row class="row-mt20 row-ml10">
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
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },

    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getOrgUsers (params) {
        let vm = this
        this.$http.get(this.CONSTANT.USER.GET_ORG_USERS, {
          params: params
        }).then((response) => {
            let data = response.data
            vm.pageResult.list = data
          }).catch(function (response) {
            console.log(response)
          })
      },
      handleNodeClick (data) {
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
        filterText: '',
        data2: [{
          id: 1,
          label: 'XXXX公司',
          children: [{
            id: 4,
            label: '研发部门',
            children: [{
              id: 9,
              label: 'A组'
            }, {
              id: 10,
              label: 'B组'
            }]
          }, {
            id: 2,
            label: '运营部门',
            children: [{
              id: 5,
              label: 'A组'
            }, {
              id: 6,
              label: 'B组'
            }]
          }, {
            id: 3,
            label: '客服部门',
            children: [{
              id: 7,
              label: 'A组'
            }, {
              id: 8,
              label: 'B组'
            }]
          }]
        }],
        expandedKeys: [1],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
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
        formLabelWidth: '120px'
      }
    }
  }
</script>
