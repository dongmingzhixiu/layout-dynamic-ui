import HelloWorld from '@/pages/HelloWorld'
import formChange from '@/pages/forms-change.vue'
import test1 from '@/pages/test1'
import test2 from '@/pages/test2'
import test3 from '@/pages/test3'
import test4 from '@/pages/test4'
import saveForms from '@/pages/saveFormTest.vue'
import tables from '@/pages/table.vue'
import menuTree from '@/pages/menuTree.vue'
import pageTabs from '@/pages/pageTabs.vue'



const install = (Vue, opts = {}) => {
	Vue.component('hello-world', HelloWorld);
	Vue.component('form-Change', formChange);
	Vue.component('test1', test1);
	Vue.component('test2', test2);
	Vue.component('test3', test3);
	Vue.component('test4', test4);
	Vue.component('save-forms', saveForms);
	Vue.component('tables', tables);
	Vue.component('menu-tree', menuTree);
	Vue.component('page-tabs', pageTabs);
}
export default {
	install
}
