import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/pages/Hello'
import example from '@/pages/example'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/example',
      name: 'example',
      component: example
    }
  ]
})
