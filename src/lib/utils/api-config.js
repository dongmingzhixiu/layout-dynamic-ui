import Vue from 'Vue'
export default {
	serverPath:{
		development:Vue.prototype.$serverRequestPath&&Vue.prototype.$serverRequestPath.development?Vue.prototype.$serverRequestPath.development: '',
		production:Vue.prototype.$serverRequestPath&&Vue.prototype.$serverRequestPath.production?Vue.prototype.$serverRequestPath.production: '',
	}
}
