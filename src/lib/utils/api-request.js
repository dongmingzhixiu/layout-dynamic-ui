import axios from 'axios'


const serverRequestPath = {
	production: '',
	development: ''
}



const request = {

	//拦截器
	interceptor: {
		/**
		 * 请求之前调用的方法
		 * @param {object} 请求之前的所构造参数
		 * @return {Boolean|Promise} ,
		 *        Boolean true,继续执行，false:终止执行
		 *        Promise 需要使用 Promise.resolve(Boolean:true|false) true,false 表示是否继续执行
		 */
		before: (event) => {
			return true;
		},
		/**
		 * 请求之后调用的方法,对返回数据进行加工操作
		 * @param {object} 请求之前的所构造参数
		 * @return {Promise,Object}  ,
		 *        Object 被加工后的数据
		 *        Promise 需要使用 Promise.resolve(event) ;event 表示加工后返回的数据
		 */
		after: (event) => {
			return event;
		}
	},


	/**
	 * 设置 axios的其他参数或设置
	 */
	axiosInit: (axios) => {
		return axios;
	},

	/**
	 * 请求路径配置
	 */
	serverRequestPath: {
		/**
		 * 生产路径
		 */
		production: {
			get: () => {
				return serverRequestPath['production'];
			},
			set: (val) => {
				serverRequestPath['production'] = val;
			}
		},
		/**
		 * 调试路径
		 */
		development: {
			get: () => {
				return serverRequestPath['development'];
			},
			set: (val) => {
				serverRequestPath['development'] = val;
			}
		},
		/**
		 * 获取当前环境请求路径
		 */
		get: () => {
			return serverRequestPath[process.env.NODE_ENV === 'development' ? 'development' : 'production'];
		},

		/**
		 * 设置当前环境请求路径
		 */
		set: (val) => {
			serverRequestPath[process.env.NODE_ENV === 'development' ? 'development' : 'production'] = val;
		}
	},
	/**
	 * 请求方法
	 */
	request: function(router, method, params = {}) {
		// 为没个请求添加token拦截
		var url =
			`${serverRequestPath[process.env.NODE_ENV === 'development' ?'development':'production']}${router}`;
		var option = {
			method,
			url
		}
		option[method.toLocaleLowerCase() === 'get' ? 'params' : 'data'] = params

		const getinterceptor = () => {
			try {
				return (this.$ld && this.$ld.requestSetting ? this.$ld.requestSetting : this.requestSetting)
					.interceptor;
			} catch (e) {
				return {
					before: (event) => true,
					after: (event) => event,
				};
			}
		}
		//执行拦截器
		const execinterceptor = (methodName, data, fn, fnData) => {
			let result = methodName(data)
			if (result instanceof Promise) {
				return result.then(res => {
					if (res || data['interceptor'] == 'after') {
						return fn(data['interceptor'] == 'before' ? fnData : res);
					}
					return Promise['reject']({
						error: `An error occurred in the interceptor ${data['interceptor']} the request was executed`,
						data: data,
					});
				})
				return;
			}
			if ((typeof result == 'boolean' && !result) && data['interceptor'] == 'before') {
				return Promise.resolve(!result ? 'return' : 'continue')
			}
			return fn(data['interceptor'] == 'before' ? fnData : result);
		}

		//获取设置的axios
		let _axios = axios;
		try {
			_axios = (this.$ld && this.$ld.requestSetting ? this.$ld.requestSetting : this.requestSetting).init(
				axios);
		} catch (e) {}

		//执行拦截器
		let interceptor = getinterceptor();
		let _data = {
			options: option,
			data: null,
			interceptor: 'before',
		}
		//执行 拦截器和请求等方法
		return execinterceptor(interceptor.before, _data, (option) => {
			return _axios(option).then((res) => {
				_data['data'] = res;
				_data['interceptor'] = 'after';
				return execinterceptor(interceptor.after, res, (res) => {
					return Promise.resolve(res);
				}, res);
			}).catch((err) => {
				return Promise.reject(err)
			});
		}, option);
	},

	//POST请求
	postRequest: function(router, params = {}) {
		debugger
		return this.request(router, 'post', params);
	},
	
	//GET请求
	getRequest: function(router, params = {}) {
		debugger
		return this.request(router, 'get', params);
	},


}
export default request
