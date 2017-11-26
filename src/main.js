// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Login from './Login'
import router from './router'
// import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import ResponseCode from './commons/ResponseCode'
import Validator from './commons/validator'
import CONSTANT from './commons/constant'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
import qs from 'qs'

Vue.use(ElementUI)
// Vue.use(VueResource)
// mock dev prod
const env = 'dev'

// 分环境配置
if (env === 'dev' || env === 'prod') {
  let API_URL = require('./router/ApiUrl').default
  buildUrl('/rbac/', API_URL)
  CONSTANT.API_URL = API_URL
  CONSTANT.API_URL.ORIGIN = 'http://localhost:8888/'
} else {
  let API_URL = require('./router/devApiUrl').default
  buildUrl('http://localhost:8888/', API_URL)
  CONSTANT.API_URL = API_URL
  CONSTANT.API_URL.ORIGIN = 'http://localhost:8888/'
}
CONSTANT.ResponseCode = ResponseCode
CONSTANT.Validator = Validator

Vue.prototype.$http = axios
Vue.prototype.$qs = qs

axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  let res = response.data
  if (res && res.ecode === CONSTANT.ResponseCode.USER_ERR_UNLOGINED) {
    ElementUI.Message.error('您尚未登录或登录时间过长,请重新登录!')
      setTimeout(() => {
        window.location.href = CONSTANT.API_URL.ORIGIN
      }, 3000)
  }
  return response
}, (error) => {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 查询身份认证
axios.get(CONSTANT.API_URL.AUTH.VALIDATE_AUTH, {
  params: {}
}).then((response) => {
  let res = response.data
  if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
    Vue.auth = res.data
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      template: Vue.auth ? '<App/>' : '<Login/>',
      components: Vue.auth ? { App } : { Login }
    })
  } else {}
}).catch((response) => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<Login/>',
    components: { Login }
  })
})

function buildUrl (domain, apiUrlObj) {
  if (!(apiUrlObj instanceof Object)) return
  for (let item in apiUrlObj) {
    if (apiUrlObj[item] instanceof Object) {
      buildUrl(domain, apiUrlObj[item])
    } else {
      apiUrlObj[item] = domain + apiUrlObj[item]
    }
  }
}
