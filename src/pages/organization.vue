<template>
  <div>
    <div style="width: 300px;float: left">
      <el-input
        placeholder="组织名称"
        v-model="filterText">
      </el-input>

      <el-tree
        class="filter-tree"
        :data="data2"
        :props="defaultProps"
        accordion
        :filter-node-method="filterNode"
        ref="tree2">
      </el-tree>
    </div>
    <div style="border: 1px solid;float: left;display: block;">
      员工列表
    </div>
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
      }
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
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  }
</script>
