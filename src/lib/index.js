//引入axios 请求封装方法
import apiRequest from '@/lib/utils/api-request.js';

//引入公共函数
import ldUtil from '@/lib/utils/ld-util.js'

// 引入资源和配置
import iconList from '@/lib/config/ld-icon-res.js'
import addressItem from '@/lib/config/ld-address-item-res.js'

//引入组件
import ldPageLoading from '@/lib/ld-page-loading.vue'
import ldForms from '@/lib/ld-forms.vue'
import ldIcon from '@/lib/ld-icon.vue'
import ldTags from '@/lib/ld-tags.vue'
import ldAddress from '@/lib/ld-address.vue'
import ldParams from '@/lib/ld-params.vue'
import ldImages from '@/lib/ld-images.vue'
import locale from 'element-ui/src/locale';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';




const install = (Vue,opts={})=> {
	locale.use(opts.locale);
	locale.i18n(opts.i18n);
	
	Vue.use(ElementUI);
	
	Vue.prototype.$requestInit = function(axios) {
		return apiRequest.axiosInit(axios);
	};

	Vue.prototype.$serverRequestPath = apiRequest.serverRequestPath;
	Vue.prototype.$request = apiRequest.request;
	Vue.prototype.$screen = screen;
	Vue.prototype.$ldIconList = iconList;
	Vue.prototype.$ldaddressItem = addressItem;
	Vue.prototype.$ld = {
		util: ldUtil,
		config: {

		}
	};

	Vue.component('ld-page-loading', ldPageLoading);

	Vue.component('ld-forms', ldForms);

	Vue.component('ld-icon', ldIcon);

	Vue.component('ld-tags', ldTags);

	Vue.component('ld-address', ldAddress);

	Vue.component('ld-params', ldParams);

	Vue.component('ld-images', ldImages);


}


/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
}
export default { 
	version: '1.0.0',
	// locale: locale.use,
	// i18n: locale.i18n,
	install,
	ldPageLoading,
	ldForms,
	ldIcon,
	ldTags,
	ldAddress,
	ldParams,
	ldImages,
	
}

