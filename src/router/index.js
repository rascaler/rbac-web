import Vue from 'vue'
import Router from 'vue-router'
import example from '@/pages/example'
import organization from '@/pages/organization'
import test from '@/pages/test'
import treeTest from '@/pages/test/treeTest'
import formTest from '@/pages/test/formTest'
import validateTest from '@/pages/test/validateTest'
import role from '@/pages/role'
import tableTest2 from '@/pages/test/tableTest2'
// import sysInfo from '@/pages/sysInfo'
import login from '@/pages/login'
import tableTest from '@/pages/test/tableTest'
import privilege from '@/pages/privilege'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
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
    },
    {
      path: '/validateTest',
      name: 'validateTest',
      component: validateTest
    },
    {
      path: '/role',
      name: 'role',
      component: role
    },
    {
      path: '/tableTest',
      name: 'tableTest',
      component: tableTest
    },
    {
      path: '/tableTest2',
      name: 'tableTest2',
      component: tableTest2
    },
    {
      path: '/privilege',
      name: 'privilege',
      component: privilege
    }
  ]
})
