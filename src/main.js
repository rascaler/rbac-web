// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Login from './Login'
import router from './router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import ResponseCode from './commons/ResponseCode'
import Validator from './commons/validator'
import CONSTANT from './commons/constant'
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI)
Vue.use(VueResource)
// mock dev prod
const env = 'dev'

// 分环境配置
if (env === 'dev' || env === 'prod') {
  let API_URL = require('./router/ApiUrl').default
  buildUrl('http://localhost:9090/rbac/', API_URL)
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

Vue.config.productionTip = false

// 跨域携带cookie
Vue.http.interceptors.push(function (request, next) {
  request.credentials = true
  next()
})
// 查询身份认证
Vue.http.get(CONSTANT.API_URL.AUTH.VALIDATE_AUTH, {
  params: {}
}).then((response) => {
  let res = response.data
  if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
    Vue.auth = res.data
    let app = new Vue({
      el: '#app',
      router,
      template: Vue.auth ? '<App/>' : '<Login/>',
      components: Vue.auth ? { App } : { Login }
    })
    console.log(app)
  } else {}
}).catch((response) => {
})
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   template: Vue.auth ? '<App>' : '<Login/>',
//   components: Vue.auth ? { App } : { Login }
// })

// new Vue({
//   el: '#app',
//   router,
//   template: '<test1/>',
//   components: { test1 }
// })
// new Vue({
//   el: '#app2',
//   router,
//   template: '<App/>',
//   components: { App }
// })
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
