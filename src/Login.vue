<template>
  <div id="loginContainer">
    <div style="display: block;margin: 0 auto;width: 350px;margin-top: 200px;text-align:center;">
      <el-form :model="loginFormConfig.data" :rules="loginFormConfig.rules" ref="loginForm" label-width="100px" >
        <el-form-item>
          <span>RBAC后台管理</span>
        </el-form-item>
        <el-form-item label="用户" prop="username">
          <el-input v-model.number="loginFormConfig.data.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="loginFormConfig.data.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="securityCode">
          <el-col :span="11">
            <el-input v-model="loginFormConfig.data.securityCode" auto-complete="off" ></el-input>
          </el-col>
          <el-col class="line" :span="2">&nbsp;</el-col>
          <el-col :span="11">
            <img :src="kaptcha" @click="refreshKaptcha"/>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script>
  import CONSTANT from './commons/constant'
//  import App from './App'
  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        }
      }
      return {
        loginFormConfig: {
          data: {
            password: '',
            username: '',
            securityCode: ''
          },
          rules: {
            password: [
              { validator: validatePass, trigger: 'blur' }
            ]
           }
        },
        kaptcha: CONSTANT.API_URL.KAPTCHA
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      refreshKaptcha () {
        this.kaptcha = CONSTANT.API_URL.KAPTCHA + '?t=' + Math.random()
      },
      login () {
          this.$router.push('App')
//        this.$http.post(CONSTANT.API_URL.LOGIN, this.loginFormConfig.data, {emulateJSON: true})
//          .then((response) => {
//            let res = response.data
//            if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
//
//            } else {
//              this.$message.error(res.msg)
//            }
//            // 将新节点加入
//          }).catch((response) => {
//          this.$message.error('保存失败')
//        })
      }
    }
  }
</script>
