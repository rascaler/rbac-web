<style rel="stylesheet/less" lang="less">
  .el-table_1_column_2 {
    .cell{
      padding: 0px !important;
    }
  }
</style>
<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="datas"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        label="应用"
        width="240">
        <template scope="scope">{{ scope.row.module }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单"
        width="240">
        <template scope="scope">
          <el-tree
            :data="scope.row.menus"
            show-checkbox
            default-expand-all
            highlight-current
            :props="defaultProps">
          </el-tree>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        datas: [{
          id: 1,
          module: '组织',
          menus: [{
              id: 1,
              name: '组织管理',
              children: [{
                id: 1,
                name: '组织列表',
                children: [{
                    id: 1,
                    name: '查询',
                    isMenu: false
                }, {
                  id: 2,
                  name: '编辑',
                  isMenu: false
                }, {
                  id: 3,
                  name: '删除',
                  isMenu: false
                }]
              }],
              privileges: null
          }]
        }],
        multipleSelection: [],
        defaultProps: {
        children: 'children',
        label: 'name'
      }
      }
    },
    methods: {
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      }
    }
  }
</script>
