import axios from 'axios'


const serverRequestPath = {
	production: '',
	development: ''
}



const request = {
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
			`${serverRequestPath[process.env.NODE_ENV === 'development' ?'development':'production']}${router}`
		var option = {
			method,
			url
		}
		if (method.toLocaleLowerCase() === 'get') {
			option['params'] = params
		} else {
			option['data'] = params
		}
		//获取设置的axios
		let _axios = axios;
		try {
			_axios = this.axiosInit(axios);
		} catch (e) {
			_axios = this.$requestInit(axios);
		}
		let __axios = _axios ? _axios : axios;

		return axios(option).then((res) => {
			// 根据返回结果操作
			if (res.data.code == -1 && res.data.msg == 'noLogin') {
				let param = util.objToParam(res.data.data, true)
				window.location.href = '#/error' + param
				return
			}
			return Promise.resolve(res.data)
		}).catch((err) => {
			return Promise.reject(err)
		})
	}
}


export default request
