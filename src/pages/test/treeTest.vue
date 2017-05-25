<template>
  <div>
    <div style="width: 500px;position: relative;">
      <el-tree id="aa"
               :data="data2"
               :props="defaultProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :expand-on-click-node="false"
               :render-content="renderContent">
      </el-tree>
    </div>

  </div>
</template>

<style>
  /*.el-tree-node__content {z-index: 1;background: #fff}*/
  .show {display: block;}
  .hide {display: none;}
  /*.el-tree-node__children {overflow: inherit !important;}*/
</style>
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
        },
        menuState: 'hide',
        nodeId: null
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
            <span>{node.label}</span>
          </span>
          <span class="el-tree-node__label" style="right: 0px; margin-right: 5px;position:absolute;" >
            <i class="el-icon-setting" on-click={ (e) => { this.nodeId = node.id } }></i>
              <ul class={'el-dropdown-menu ' + (this.nodeId === node.id ? 'show' : 'hide')} style="left:20px;top:-6px;width:120px;" on-mouseleave={ () => { this.nodeId = null } }>
                <li class="el-dropdown-menu__item node" on-click={ (e) => console.log(node.id) }>
                <i class="el-icon-plus"></i> &nbsp;添加子组织</li>
                <li class="el-dropdown-menu__item" on-click={ (e) => console.log(node.id) }><i class="el-icon-edit"></i> &nbsp;修改</li>
                <li class="el-dropdown-menu__item" on-click={ (e) => console.log(node.id) }><i class="el-icon-delete"></i> &nbsp;删除</li>
                <li class="el-dropdown-menu__item el-dropdown-menu__item--divided is-disabled is-divided">&nbsp;ID: {node.id}</li>
              </ul>
          </span>
        </span>
      )
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
