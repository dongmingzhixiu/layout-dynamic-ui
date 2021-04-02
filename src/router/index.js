import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import formChange from '@/pages/forms-change.vue'
import test1 from '@/pages/test1'
import test2 from '@/pages/test2'
import test3 from '@/pages/test3'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
      path: '/formChange',
      name: 'formChange',
      component: formChange
    },

  ]
})
