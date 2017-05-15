<style>
  .logo{width: 270px;display: block;height: 60px;float: left;}
  .nav-menu{display: block;float: left;}
  .col-menu{display: block;width: 270px;float: left;clear: both;background: #eef1f6;}
  #content{display: block;float: left;}
  footer{border:1px solid;display: block;width: 100%;height: 60px;float: left;}
</style>
<template>
  <div class="container">

    <nav>
      <!-- 导航栏  -->
      <div class="logo">
        LOGO
      </div>
      <div class="nav-menu" :style="navMenuStyle">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">处理中心</el-menu-item>
          <el-menu-item index="2">处理中心</el-menu-item>
          <el-menu-item index="3">订单管理</el-menu-item>
        </el-menu>
      </div>
    </nav>

    <!-- 侧栏 -->
    <div class="col-menu" :style="colMenuStyle">
      <el-row class="tac" style="width: 100%;">
        <el-col :span="8" style="width: 100%;">
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-message"></i>导航一</template>

              <el-menu-item index="1-1"><router-link to="/example" style="display: block;width: 100%;text-decoration: none;color: black;">选项1</router-link></el-menu-item>
              <el-menu-item index="1-2"><router-link to="/organization" style="display: block;width: 100%;text-decoration: none;color: black;">选项2</router-link></el-menu-item>

            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i>导航二</template>

              <el-menu-item index="1-1"><router-link to="/test" style="display: block;width: 100%;text-decoration: none;color: black;">选项1</router-link></el-menu-item>
              <el-menu-item index="1-2"><router-link to="/test2" style="display: block;width: 100%;text-decoration: none;color: black;">选项2</router-link></el-menu-item>

            </el-submenu>
            <el-menu-item index="3"><i class="el-icon-setting"></i>导航三</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>

    <div id="content" :style="contentStyle">
      <router-view></router-view>
    </div>
    <footer>

    </footer>
  </div>
</template>
<script>
  module.exports = {
    created: function () {
    },
    computed: {
      navMenuStyle: function () {
        let width = (this.totalWidth - 270 - 40) + 'px'
        return {'height': '60px', 'width': width}
      },
      contentStyle: function () {
        let width = (this.totalWidth - 270 - 40) + 'px'
        let height = (this.totalHeight - 120 - 10) + 'px'
        return {'height': height, 'width': width}
      },
      colMenuStyle: function () {
        let height = (this.totalHeight - 120 - 10) + 'px'
        return {'height': height, 'width': '270px'}
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
          this.contentStyle['width'] = (this.totalWidth - 270 - 40) + 'px'
          this.contentStyle['height'] = (this.totalHeight - 120 - 10) + 'px'
          this.timer = true
          let that = this
          setTimeout(function () {
            that.init()
            that.timer = false
          }, 400)
        }
      },
      navMenuStyle (val) {
        if (!this.timer) { // 优化 因为 频繁 触发 resize 函数，导致页面很卡的 问题
          this.navMenuStyle['width'] = (this.totalWidth - 270 - 40) + 'px'
          this.timer = true
          let that = this
          setTimeout(function () {
            that.init()
            that.timer = false
          }, 400)
        }
      },
      colMenuStyle (val) {
        if (!this.timer) { // 优化 因为 频繁 触发 resize 函数，导致页面很卡的 问题
          this.colMenuStyle['height'] = (this.totalHeight - 120 - 10) + 'px'
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

    }
  }
</script>
