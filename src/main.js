// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import ResponseCode from './commons/ResponseCode'
import CONSTANT from './commons/constant'
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI)
Vue.use(VueResource)

// 分环境配置
if (process.env.NODE_ENV === 'development') {
  let API_URL = require('./router/ApiUrl').default
  buildUrl('http://localhost:9090/rbac/', API_URL)
  CONSTANT.API_URL = API_URL
} else {
  let API_URL = require('./router/ApiUrl').default
  buildUrl('http://localhost:8888/rbac/', API_URL)
  CONSTANT.API_URL = API_URL
}
CONSTANT.ResponseCode = ResponseCode

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
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
