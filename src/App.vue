<style>
  .logo{width: 270px;display: block;height: 60px;float: left;}
  .nav-menu{display: block;float: left;}
  .col-menu{display: block;width: 270px;float: left;clear: both;background: #eef1f6;}
  #content{display: block;float: left;}
  footer{border:1px solid;display: block;width: 100%;height: 60px;float: left;}
</style>
<template>
  <div class="container">
    <el-row style="height: 47px">
      <el-col :span="5"><div class="grid-content bg-purple"><img  src="./assets/images/logo.png" style="float: left"></div></el-col>
      <el-col :span="19"><div class="grid-content bg-purple-light">RBAC管理</div></el-col>
    </el-row>
    <el-row :style="contentStyle">
      <el-col :span="5">
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>组织信息</template>

            <el-menu-item index="1-1"><router-link to="/example" style="display: block;width: 100%;text-decoration: none;color: black;">选项1</router-link></el-menu-item>
            <el-menu-item index="1-2"><router-link to="/organization" style="display: block;width: 100%;text-decoration: none;color: black;">组织</router-link></el-menu-item>
            <el-menu-item index="1-3"><router-link to="/role" style="display: block;width: 100%;text-decoration: none;color: black;">角色</router-link></el-menu-item>

          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>角色权限</template>

            <el-menu-item index="1-1"><router-link to="/privilege" style="display: block;width: 100%;text-decoration: none;color: black;">权限</router-link></el-menu-item>
            <el-menu-item index="1-2"><router-link to="/test2" style="display: block;width: 100%;text-decoration: none;color: black;">选项2</router-link></el-menu-item>

          </el-submenu>
          <el-menu-item index="3"><router-link to="/" style="display: block;width: 100%;text-decoration: none;color: black;"><i class="el-icon-setting"></i>系统设置</router-link></el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="19" style="border: 1px solid #dfe6ec;">
        <div style="margin: 15px;">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  module.exports = {
    created: function () {
    },
    computed: {
      contentStyle () {
        let height = (this.totalHeight - 67) + 'px'
        return {'height': height}
      }
    },
    data: function () {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        totalHeight: document.documentElement.clientHeight,
        totalWidth: document.documentElement.clientWidth
      }
    },
    mounted: function () {
      let vm = this
      window.onresize = () => { // 窗口调整大小时屏幕自适应
        return (() => {
          vm.totalHeight = document.documentElement.clientHeight
          vm.totalWidth = document.documentElement.clientWidth
        })()
      }
    },
    watch: {
      contentStyle (val) {
        if (!this.timer) { // 优化 因为 频繁 触发 resize 函数，导致页面很卡的 问题
          this.contentStyle['height'] = (this.totalHeight - 67) + 'px'
          this.timer = true
          let that = this
          setTimeout(function () {
            that.init()
            that.timer = false
          }, 400)
        }
      }
    },
    beforeDestroy: function () {},
    methods: {
      handleOpen (data) {},
      handleClose (data) {}
    }
  }
</script>
