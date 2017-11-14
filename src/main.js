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
  // request.headers.set('x-requested-with', 'vue-resource-request')
  next((response) => {
    let res = response.data
    if (res && res.ecode === CONSTANT.ResponseCode.USER_ERR_UNLOGINED) {
      ElementUI.Message.error('您尚未登录或登录时间过长,请重新登录!')
        setTimeout(() => {
          window.location.href = CONSTANT.API_URL.ORIGIN
        }, 3000)
    }
    return response
  })
})
// 查询身份认证
Vue.http.get(CONSTANT.API_URL.AUTH.VALIDATE_AUTH, {
  params: {}
}).then((response) => {
  let res = response.data
  if (res && res.ecode === CONSTANT.ResponseCode.SUCCESS) {
    Vue.auth = res.data
    initApp(Vue.auth)
  } else {
    initApp(false)
  }
}).catch((response) => {
  initApp(false)
})
/* eslint-disable no-new */

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

function initApp (auth) {
  let app = new Vue({
    el: '#app',
    router,
    template: auth ? '<App/>' : '<Login/>',
    components: auth ? { App } : { Login }
  })
  console.log(app.name)
}
