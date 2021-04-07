import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import formChange from '@/pages/forms-change.vue'
import test1 from '@/pages/test1'
import test2 from '@/pages/test2'
import test3 from '@/pages/test3'
import test4 from '@/pages/test4'
import saveForms from '@/pages/saveFormTest.vue'
import table from '@/pages/table.vue'
import menuTree from '@/pages/menuTree.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/',
      name: 'table',
      component: table
    },
    {
      path: '/test1',
      name: 'test1',
      component: test1
    },
    {
      path: '/test2',
      name: 'test2',
      component: test2
    },
    {
      path: '/test3',
      name: 'test3',
      component: test3
    },
    {
      path: '/test4',
      name: 'test4',
      component: test4
    },
    {
      path: '/saveForms',
      name: 'saveForms',
      component: saveForms
    },
    {
      path: '/formChange',
      name: 'formChange',
      component: formChange
    },
    {
      path: '/menuTree',
      name: 'menuTree',
      component: menuTree
    },


  ]
})
