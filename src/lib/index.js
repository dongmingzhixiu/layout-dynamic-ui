//引入样式
import '@/lib/static/css/basic.css';
import '@/lib/static/css/base.css';
import '@/lib/static/css/other.css';

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
import ldTable from '@/lib/ld-table.vue'




const install = (Vue, opts = {}) => {

  Vue.prototype.$requestInit = function(axios) {
    return apiRequest.axiosInit(axios);
  };
  Vue.prototype.$ld = {
    //请求
    requestSetting: {
      //设置请求服务地址
      serverPath: apiRequest.serverRequestPath,
      //初始化设置
      init: function(axios) {
        return apiRequest.axiosInit(axios);
      },
      //配置
      config: apiRequest.config || {
        timeout: '1000*60'
      },
      //拦截器
      interceptor: apiRequest.interceptor,
    },
    //资源
    resource: {
      iconList: iconList,
      addressItem: addressItem,
    },
    //请求方法
    request: apiRequest.request,
    postRequest: apiRequest.postRequest,
    getRequest: apiRequest.getRequest,

    //获取表格数据之后，装载数据到表格之前，处理数据的函数
    getTableRemoteDataAfter: function(data, isPagination) {
			debugger
      if (isPagination) {
        let list = Array.isArray(data) ? data : data['list'] ? data['list'] : data;
        return {
          list: list,
          currentPage: data['pageNum'],
          pageSize: data['pageSize'],
          total : data['total']
        }
      } //分页
      return !Array.isArray(data) && data && data['list'] ? data['list'] : data;
    },

    //工具包
    util: ldUtil,
    //配置
  };

  Vue.component('ld-page-loading', ldPageLoading);

  Vue.component('ld-forms', ldForms);

  Vue.component('ld-icon', ldIcon);

  Vue.component('ld-tags', ldTags);

  Vue.component('ld-address', ldAddress);

  Vue.component('ld-params', ldParams);

  Vue.component('ld-images', ldImages);

  Vue.component('ld-table', ldTable);


}


/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default {
  install,
  ldPageLoading,
  ldForms,
  ldIcon,
  ldTags,
  ldAddress,
  ldParams,
  ldImages,

}
