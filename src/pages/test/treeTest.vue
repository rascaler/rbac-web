<template>
  <div>
    <el-tree
      :data="data2"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
    <!-- <el-button size="mini" on-click={ () => this.append(store, data) }>Append</el-button> -->
    <!-- <el-button size="mini" on-click={ () => this.remove(store, data) }>Delete</el-button> -->
  </div>
</template>


<script>
  let id = 1000

  export default {
    data () {
      return {
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },

    methods: {
      append (store, data) {
        store.append({ id: id++, label: 'testtest', children: [] }, data)
      },

      remove (store, data) {
        store.remove(data)
      },
      renderContent (h, { node, data, store }) {
        return (
          <span>
            <span>
               <span class="el-tree-node__label">{node.label}</span>
            </span>
              <i class="el-icon-setting" style="line-height:36px;position:absolute;right:16px;">
              </i>
        </span>)
      }
//      renderContent: function (createElement, { node, data, store }) {
//        return createElement('span', [
//          createElement('span', node.label),
//          createElement('span', {
//              attrs: {
//            style: 'float: right; margin-right: 20px'
//          }}, [
//            createElement('el-button', {
//             attrs: {
//              size: 'mini'
//             },
//              on: {
//              click: function () {
//                console.info('点击了节点' + data.id + '的添加按钮')
//                store.append({ id: self.baseId++, label: 'testtest', children: [] }, data)
//              }
//            }}, '添加'),
//            createElement('el-button', {
//              attrs: {
//                size: 'mini'
//            },
//              on: {
//              click: function () {
//                console.info('点击了节点' + data.id + '的添加按钮')
//                store.remove(data)
//              }
//            }}, '删除')
//          ])
//        ])
//      }
    }
  }
</script>
