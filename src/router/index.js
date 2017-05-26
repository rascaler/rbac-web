import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/pages/Hello'
import example from '@/pages/example'
import organization from '@/pages/organization'
import test from '@/pages/test'
import treeTest from '@/pages/test/treeTest'
import formTest from '@/pages/test/formTest'

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
    },
    {
      path: '/organization',
      name: 'organization',
      component: organization
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/treeTest',
      name: 'treeTest',
      component: treeTest
    },
    {
      path: '/formTest',
      name: 'formTest',
      component: formTest
    }
  ]
})
