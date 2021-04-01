import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import formChange from '@/pages/forms-change.vue'
import test1 from '@/pages/test1'
import test2 from '@/pages/test2'

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
      component: test1},
    {
      path: '/test2',
      name: 'test2',
      component: test2
    },
    {
      path: '/formChange',
      name: 'formChange',
      component: formChange
    },

  ]
})
