(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory();
	else
		root["index"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "1fd1");
/******/ })
/************************************************************************/
/******/ ({

/***/ "0a06":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var buildURL = __webpack_require__("30b5");
var InterceptorManager = __webpack_require__("f6b4");
var dispatchRequest = __webpack_require__("5270");
var mergeConfig = __webpack_require__("4a7b");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "0df6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "0f60":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_images_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c2d1");
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_images_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_images_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "1d2b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "1fd1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("508e")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/axios/index.js
var node_modules_axios = __webpack_require__("bc3a");
var axios_default = /*#__PURE__*/__webpack_require__.n(node_modules_axios);

// CONCATENATED MODULE: ./src/lib/utils/api-request.js



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
			return serverRequestPath[ false ? undefined : 'production'];
		},

		/**
		 * 设置当前环境请求路径
		 */
		set: (val) => {
			serverRequestPath[ false ? undefined : 'production'] = val;
		}
	},
	/**
	 * 请求方法
	 */
	request: function(router, method, params = {}) {
		// 为没个请求添加token拦截
		var url =
			`${serverRequestPath[ false ?undefined:'production']}${router}`
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
		let _axios = axios_default.a;
		try {
			_axios = this.axiosInit(axios_default.a);
		} catch (e) {
			_axios = this.$requestInit(axios_default.a);
		}
		let __axios = _axios ? _axios : axios_default.a;

		return axios_default()(option).then((res) => {
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


/* harmony default export */ var api_request = (request);

// EXTERNAL MODULE: ./src/lib/utils/ld-util.js
var ld_util = __webpack_require__("f4bb");

// CONCATENATED MODULE: ./src/lib/config/ld-icon-res.js
const resource = [
  //elment-ui
  "el-icon-platform-eleme",
  "el-icon-eleme",
  "el-icon-delete-solid",
  "el-icon-delete",
  "el-icon-s-tools",
  "el-icon-setting",
  "el-icon-user-solid",
  "el-icon-user",
  "el-icon-phone",
  "el-icon-phone-outline",
  "el-icon-more",
  "el-icon-more-outline",
  "el-icon-star-on",
  "el-icon-star-off",
  "el-icon-s-goods",
  "el-icon-goods",
  "el-icon-warning",
  "el-icon-warning-outline",
  "el-icon-question",
  "el-icon-info",
  "el-icon-remove",
  "el-icon-circle-plus",
  "el-icon-success",
  "el-icon-error",
  "el-icon-zoom-in",
  "el-icon-zoom-out",
  "el-icon-remove-outline",
  "el-icon-circle-plus-outline",
  "el-icon-circle-check",
  "el-icon-circle-close",
  "el-icon-s-help",
  "el-icon-help",
  "el-icon-minus",
  "el-icon-plus",
  "el-icon-check",
  "el-icon-close",
  "el-icon-picture",
  "el-icon-picture-outline",
  "el-icon-picture-outline-round",
  "el-icon-upload",
  "el-icon-upload2",
  "el-icon-download",
  "el-icon-camera-solid",
  "el-icon-camera",
  "el-icon-video-camera-solid",
  "el-icon-video-camera",
  "el-icon-message-solid",
  "el-icon-bell",
  "el-icon-s-cooperation",
  "el-icon-s-order",
  "el-icon-s-platform",
  "el-icon-s-fold",
  "el-icon-s-unfold",
  "el-icon-s-operation",
  "el-icon-s-promotion",
  "el-icon-s-home",
  "el-icon-s-release",
  "el-icon-s-ticket",
  "el-icon-s-management",
  "el-icon-s-open",
  "el-icon-s-shop",
  "el-icon-s-marketing",
  "el-icon-s-flag",
  "el-icon-s-comment",
  "el-icon-s-finance",
  "el-icon-s-claim",
  "el-icon-s-custom",
  "el-icon-s-opportunity",
  "el-icon-s-data",
  "el-icon-s-check",
  "el-icon-s-grid",
  "el-icon-menu",
  "el-icon-share",
  "el-icon-d-caret",
  "el-icon-caret-left",
  "el-icon-caret-right",
  "el-icon-caret-bottom",
  "el-icon-caret-top",
  "el-icon-bottom-left",
  "el-icon-bottom-right",
  "el-icon-back",
  "el-icon-right",
  "el-icon-bottom",
  "el-icon-top",
  "el-icon-top-left",
  "el-icon-top-right",
  "el-icon-arrow-left",
  "el-icon-arrow-right",
  "el-icon-arrow-down",
  "el-icon-arrow-up",
  "el-icon-d-arrow-left",
  "el-icon-d-arrow-right",
  "el-icon-video-pause",
  "el-icon-video-play",
  "el-icon-refresh",
  "el-icon-refresh-right",
  "el-icon-refresh-left",
  "el-icon-finished",
  "el-icon-sort",
  "el-icon-sort-up",
  "el-icon-sort-down",
  "el-icon-rank",
  "el-icon-loading",
  "el-icon-view",
  "el-icon-c-scale-to-original",
  "el-icon-date",
  "el-icon-edit",
  "el-icon-edit-outline",
  "el-icon-folder",
  "el-icon-folder-opened",
  "el-icon-folder-add",
  "el-icon-folder-remove",
  "el-icon-folder-delete",
  "el-icon-folder-checked",
  "el-icon-tickets",
  "el-icon-document-remove",
  "el-icon-document-delete",
  "el-icon-document-copy",
  "el-icon-document-checked",
  "el-icon-document",
  "el-icon-document-add",
  "el-icon-printer",
  "el-icon-paperclip",
  "el-icon-takeaway-box",
  "el-icon-search",
  "el-icon-monitor",
  "el-icon-attract",
  "el-icon-mobile",
  "el-icon-scissors",
  "el-icon-umbrella",
  "el-icon-headset",
  "el-icon-brush",
  "el-icon-mouse",
  "el-icon-coordinate",
  "el-icon-magic-stick",
  "el-icon-reading",
  "el-icon-data-line",
  "el-icon-data-board",
  "el-icon-pie-chart",
  "el-icon-data-analysis",
  "el-icon-collection-tag",
  "el-icon-film",
  "el-icon-suitcase",
  "el-icon-suitcase-1",
  "el-icon-receiving",
  "el-icon-collection",
  "el-icon-files",
  "el-icon-notebook-1",
  "el-icon-notebook-2",
  "el-icon-toilet-paper",
  "el-icon-office-building",
  "el-icon-school",
  "el-icon-table-lamp",
  "el-icon-house",
  "el-icon-no-smoking",
  "el-icon-smoking",
  "el-icon-shopping-cart-full",
  "el-icon-shopping-cart-1",
  "el-icon-shopping-cart-2",
  "el-icon-shopping-bag-1",
  "el-icon-shopping-bag-2",
  "el-icon-sold-out",
  "el-icon-sell",
  "el-icon-present",
  "el-icon-box",
  "el-icon-bank-card",
  "el-icon-money",
  "el-icon-coin",
  "el-icon-wallet",
  "el-icon-discount",
  "el-icon-price-tag",
  "el-icon-news",
  "el-icon-guide",
  "el-icon-male",
  "el-icon-female",
  "el-icon-thumb",
  "el-icon-cpu",
  "el-icon-link",
  "el-icon-connection",
  "el-icon-open",
  "el-icon-turn-off",
  "el-icon-set-up",
  "el-icon-chat-round",
  "el-icon-chat-line-round",
  "el-icon-chat-square",
  "el-icon-chat-dot-round",
  "el-icon-chat-dot-square",
  "el-icon-chat-line-square",
  "el-icon-message",
  "el-icon-postcard",
  "el-icon-position",
  "el-icon-turn-off-microphone",
  "el-icon-microphone",
  "el-icon-close-notification",
  "el-icon-bangzhu",
  "el-icon-time",
  "el-icon-odometer",
  "el-icon-crop",
  "el-icon-aim",
  "el-icon-switch-button",
  "el-icon-full-screen",
  "el-icon-copy-document",
  "el-icon-mic",
  "el-icon-stopwatch",
  "el-icon-medal-1",
  "el-icon-medal",
  "el-icon-trophy",
  "el-icon-trophy-1",
  "el-icon-first-aid-kit",
  "el-icon-discover",
  "el-icon-place",
  "el-icon-location",
  "el-icon-location-outline",
  "el-icon-location-information",
  "el-icon-add-location",
  "el-icon-delete-location",
  "el-icon-map-location",
  "el-icon-alarm-clock",
  "el-icon-timer",
  "el-icon-watch-1",
  "el-icon-watch",
  "el-icon-lock",
  "el-icon-unlock",
  "el-icon-key",
  "el-icon-service",
  "el-icon-mobile-phone",
  "el-icon-bicycle",
  "el-icon-truck",
  "el-icon-ship",
  "el-icon-basketball",
  "el-icon-football",
  "el-icon-soccer",
  "el-icon-baseball",
  "el-icon-wind-power",
  "el-icon-light-rain",
  "el-icon-lightning",
  "el-icon-heavy-rain",
  "el-icon-sunrise",
  "el-icon-sunrise-1",
  "el-icon-sunset",
  "el-icon-sunny",
  "el-icon-cloudy",
  "el-icon-partly-cloudy",
  "el-icon-cloudy-and-sunny",
  "el-icon-moon",
  "el-icon-moon-night",
  "el-icon-dish",
  "el-icon-dish-1",
  "el-icon-food",
  "el-icon-chicken",
  "el-icon-fork-spoon",
  "el-icon-knife-fork",
  "el-icon-burger",
  "el-icon-tableware",
  "el-icon-sugar",
  "el-icon-dessert",
  "el-icon-ice-cream",
  "el-icon-hot-water",
  "el-icon-water-cup",
  "el-icon-coffee-cup",
  "el-icon-cold-drink",
  "el-icon-goblet",
  "el-icon-goblet-full",
  "el-icon-goblet-square",
  "el-icon-goblet-square-full",
  "el-icon-refrigerator",
  "el-icon-grape",
  "el-icon-watermelon",
  "el-icon-cherry",
  "el-icon-apple",
  "el-icon-pear",
  "el-icon-orange",
  "el-icon-coffee",
  "el-icon-ice-tea",
  "el-icon-ice-drink",
  "el-icon-milk-tea",
  "el-icon-potato-strips",
  "el-icon-lollipop",
  "el-icon-ice-cream-square",
  "el-icon-ice-cream-round"
]
/* harmony default export */ var ld_icon_res = ({
  resource
});

// CONCATENATED MODULE: ./src/lib/config/ld-address-item-res.js
const tb = [{
	"label": "北京",
	"value": "2",
	"children": [{
		"label": "北京市",
		"value": "52",
		"children": [{
			"label": "东城区",
			"value": "500",
		}, {
			"label": "西城区",
			"value": "501",
		}, {
			"label": "海淀区",
			"value": "502",
		}, {
			"label": "朝阳区",
			"value": "503",
		}, {
			"label": "崇文区",
			"value": "504",
		}, {
			"label": "宣武区",
			"value": "505",
		}, {
			"label": "丰台区",
			"value": "506",
		}, {
			"label": "石景山区",
			"value": "507",
		}, {
			"label": "房山区",
			"value": "508",
		}, {
			"label": "门头沟区",
			"value": "509",
		}, {
			"label": "通州区",
			"value": "510",
		}, {
			"label": "顺义区",
			"value": "511",
		}, {
			"label": "昌平区",
			"value": "512",
		}, {
			"label": "怀柔区",
			"value": "513",
		}, {
			"label": "平谷区",
			"value": "514",
		}, {
			"label": "大兴区",
			"value": "515",
		}, {
			"label": "密云县",
			"value": "516",
		}, {
			"label": "延庆县",
			"value": "517",
		}]
	}]
}, {
	"label": "安徽省",
	"value": "3",
	"children": [{
		"label": "安庆市",
		"value": "36",
		"children": [{
			"label": "迎江区",
			"value": "398",
		}, {
			"label": "大观区",
			"value": "399",
		}, {
			"label": "宜秀区",
			"value": "400",
		}, {
			"label": "桐城市",
			"value": "401",
		}, {
			"label": "怀宁县",
			"value": "402",
		}, {
			"label": "枞阳县",
			"value": "403",
		}, {
			"label": "潜山县",
			"value": "404",
		}, {
			"label": "太湖县",
			"value": "405",
		}, {
			"label": "宿松县",
			"value": "406",
		}, {
			"label": "望江县",
			"value": "407",
		}, {
			"label": "岳西县",
			"value": "408",
		}]
	}, {
		"label": "蚌埠市",
		"value": "37",
		"children": [{
			"label": "中市区",
			"value": "409",
		}, {
			"label": "东市区",
			"value": "410",
		}, {
			"label": "西市区",
			"value": "411",
		}, {
			"label": "郊区",
			"value": "412",
		}, {
			"label": "怀远县",
			"value": "413",
		}, {
			"label": "五河县",
			"value": "414",
		}, {
			"label": "固镇县",
			"value": "415",
		}]
	}, {
		"label": "巢湖市",
		"value": "38",
		"children": [{
			"label": "居巢区",
			"value": "416",
		}, {
			"label": "庐江县",
			"value": "417",
		}, {
			"label": "无为县",
			"value": "418",
		}, {
			"label": "含山县",
			"value": "419",
		}, {
			"label": "和县",
			"value": "420",
		}]
	}, {
		"label": "池州市",
		"value": "39",
		"children": [{
			"label": "贵池区",
			"value": "421",
		}, {
			"label": "东至县",
			"value": "422",
		}, {
			"label": "石台县",
			"value": "423",
		}, {
			"label": "青阳县",
			"value": "424",
		}]
	}, {
		"label": "滁州市",
		"value": "40",
		"children": [{
			"label": "琅琊区",
			"value": "425",
		}, {
			"label": "南谯区",
			"value": "426",
		}, {
			"label": "天长市",
			"value": "427",
		}, {
			"label": "明光市",
			"value": "428",
		}, {
			"label": "来安县",
			"value": "429",
		}, {
			"label": "全椒县",
			"value": "430",
		}, {
			"label": "定远县",
			"value": "431",
		}, {
			"label": "凤阳县",
			"value": "432",
		}]
	}, {
		"label": "阜阳市",
		"value": "41",
		"children": [{
			"label": "蚌山区",
			"value": "433",
		}, {
			"label": "龙子湖区",
			"value": "434",
		}, {
			"label": "禹会区",
			"value": "435",
		}, {
			"label": "淮上区",
			"value": "436",
		}, {
			"label": "颍州区",
			"value": "437",
		}, {
			"label": "颍东区",
			"value": "438",
		}, {
			"label": "颍泉区",
			"value": "439",
		}, {
			"label": "界首市",
			"value": "440",
		}, {
			"label": "临泉县",
			"value": "441",
		}, {
			"label": "太和县",
			"value": "442",
		}, {
			"label": "阜南县",
			"value": "443",
		}, {
			"label": "颖上县",
			"value": "444",
		}]
	}, {
		"label": "淮北市",
		"value": "42",
		"children": [{
			"label": "相山区",
			"value": "445",
		}, {
			"label": "杜集区",
			"value": "446",
		}, {
			"label": "烈山区",
			"value": "447",
		}, {
			"label": "濉溪县",
			"value": "448",
		}]
	}, {
		"label": "淮南市",
		"value": "43",
		"children": [{
			"label": "田家庵区",
			"value": "449",
		}, {
			"label": "大通区",
			"value": "450",
		}, {
			"label": "谢家集区",
			"value": "451",
		}, {
			"label": "八公山区",
			"value": "452",
		}, {
			"label": "潘集区",
			"value": "453",
		}, {
			"label": "凤台县",
			"value": "454",
		}]
	}, {
		"label": "黄山市",
		"value": "44",
		"children": [{
			"label": "屯溪区",
			"value": "455",
		}, {
			"label": "黄山区",
			"value": "456",
		}, {
			"label": "徽州区",
			"value": "457",
		}, {
			"label": "歙县",
			"value": "458",
		}, {
			"label": "休宁县",
			"value": "459",
		}, {
			"label": "黟县",
			"value": "460",
		}, {
			"label": "祁门县",
			"value": "461",
		}]
	}, {
		"label": "六安市",
		"value": "45",
		"children": [{
			"label": "金安区",
			"value": "462",
		}, {
			"label": "裕安区",
			"value": "463",
		}, {
			"label": "寿县",
			"value": "464",
		}, {
			"label": "霍邱县",
			"value": "465",
		}, {
			"label": "舒城县",
			"value": "466",
		}, {
			"label": "金寨县",
			"value": "467",
		}, {
			"label": "霍山县",
			"value": "468",
		}]
	}, {
		"label": "马鞍山市",
		"value": "46",
		"children": [{
			"label": "雨山区",
			"value": "469",
		}, {
			"label": "花山区",
			"value": "470",
		}, {
			"label": "金家庄区",
			"value": "471",
		}, {
			"label": "当涂县",
			"value": "472",
		}]
	}, {
		"label": "宿州市",
		"value": "47",
		"children": [{
			"label": "埇桥区",
			"value": "473",
		}, {
			"label": "砀山县",
			"value": "474",
		}, {
			"label": "萧县",
			"value": "475",
		}, {
			"label": "灵璧县",
			"value": "476",
		}, {
			"label": "泗县",
			"value": "477",
		}]
	}, {
		"label": "铜陵市",
		"value": "48",
		"children": [{
			"label": "铜官山区",
			"value": "478",
		}, {
			"label": "狮子山区",
			"value": "479",
		}, {
			"label": "郊区",
			"value": "480",
		}, {
			"label": "铜陵县",
			"value": "481",
		}]
	}, {
		"label": "芜湖市",
		"value": "49",
		"children": [{
			"label": "镜湖区",
			"value": "482",
		}, {
			"label": "弋江区",
			"value": "483",
		}, {
			"label": "鸠江区",
			"value": "484",
		}, {
			"label": "三山区",
			"value": "485",
		}, {
			"label": "芜湖县",
			"value": "486",
		}, {
			"label": "繁昌县",
			"value": "487",
		}, {
			"label": "南陵县",
			"value": "488",
		}]
	}, {
		"label": "宣城市",
		"value": "50",
		"children": [{
			"label": "宣州区",
			"value": "489",
		}, {
			"label": "宁国市",
			"value": "490",
		}, {
			"label": "郎溪县",
			"value": "491",
		}, {
			"label": "广德县",
			"value": "492",
		}, {
			"label": "泾县",
			"value": "493",
		}, {
			"label": "绩溪县",
			"value": "494",
		}, {
			"label": "旌德县",
			"value": "495",
		}]
	}, {
		"label": "亳州市",
		"value": "51",
		"children": [{
			"label": "涡阳县",
			"value": "496",
		}, {
			"label": "蒙城县",
			"value": "497",
		}, {
			"label": "利辛县",
			"value": "498",
		}, {
			"label": "谯城区",
			"value": "499",
		}]
	}, {
		"label": "合肥市",
		"value": "3401",
		"children": [{
			"label": "庐阳区",
			"value": "3402",
		}, {
			"label": "瑶海区",
			"value": "3403",
		}, {
			"label": "蜀山区",
			"value": "3404",
		}, {
			"label": "包河区",
			"value": "3405",
		}, {
			"label": "长丰县",
			"value": "3406",
		}, {
			"label": "肥东县",
			"value": "3407",
		}, {
			"label": "肥西县",
			"value": "3408",
		}]
	}]
}, {
	"label": "福建省",
	"value": "4",
	"children": [{
		"label": "福州市",
		"value": "53",
		"children": [{
			"label": "鼓楼区",
			"value": "518",
		}, {
			"label": "台江区",
			"value": "519",
		}, {
			"label": "仓山区",
			"value": "520",
		}, {
			"label": "马尾区",
			"value": "521",
		}, {
			"label": "晋安区",
			"value": "522",
		}, {
			"label": "福清市",
			"value": "523",
		}, {
			"label": "长乐市",
			"value": "524",
		}, {
			"label": "闽侯县",
			"value": "525",
		}, {
			"label": "连江县",
			"value": "526",
		}, {
			"label": "罗源县",
			"value": "527",
		}, {
			"label": "闽清县",
			"value": "528",
		}, {
			"label": "永泰县",
			"value": "529",
		}, {
			"label": "平潭县",
			"value": "530",
		}]
	}, {
		"label": "龙岩市",
		"value": "54",
		"children": [{
			"label": "新罗区",
			"value": "531",
		}, {
			"label": "漳平市",
			"value": "532",
		}, {
			"label": "长汀县",
			"value": "533",
		}, {
			"label": "永定县",
			"value": "534",
		}, {
			"label": "上杭县",
			"value": "535",
		}, {
			"label": "武平县",
			"value": "536",
		}, {
			"label": "连城县",
			"value": "537",
		}]
	}, {
		"label": "南平市",
		"value": "55",
		"children": [{
			"label": "延平区",
			"value": "538",
		}, {
			"label": "邵武市",
			"value": "539",
		}, {
			"label": "武夷山市",
			"value": "540",
		}, {
			"label": "建瓯市",
			"value": "541",
		}, {
			"label": "建阳市",
			"value": "542",
		}, {
			"label": "顺昌县",
			"value": "543",
		}, {
			"label": "浦城县",
			"value": "544",
		}, {
			"label": "光泽县",
			"value": "545",
		}, {
			"label": "松溪县",
			"value": "546",
		}, {
			"label": "政和县",
			"value": "547",
		}]
	}, {
		"label": "宁德市",
		"value": "56",
		"children": [{
			"label": "蕉城区",
			"value": "548",
		}, {
			"label": "福安市",
			"value": "549",
		}, {
			"label": "福鼎市",
			"value": "550",
		}, {
			"label": "霞浦县",
			"value": "551",
		}, {
			"label": "古田县",
			"value": "552",
		}, {
			"label": "屏南县",
			"value": "553",
		}, {
			"label": "寿宁县",
			"value": "554",
		}, {
			"label": "周宁县",
			"value": "555",
		}, {
			"label": "柘荣县",
			"value": "556",
		}]
	}, {
		"label": "莆田市",
		"value": "57",
		"children": [{
			"label": "城厢区",
			"value": "557",
		}, {
			"label": "涵江区",
			"value": "558",
		}, {
			"label": "荔城区",
			"value": "559",
		}, {
			"label": "秀屿区",
			"value": "560",
		}, {
			"label": "仙游县",
			"value": "561",
		}]
	}, {
		"label": "泉州市",
		"value": "58",
		"children": [{
			"label": "鲤城区",
			"value": "562",
		}, {
			"label": "丰泽区",
			"value": "563",
		}, {
			"label": "洛江区",
			"value": "564",
		}, {
			"label": "清濛开发区",
			"value": "565",
		}, {
			"label": "泉港区",
			"value": "566",
		}, {
			"label": "石狮市",
			"value": "567",
		}, {
			"label": "晋江市",
			"value": "568",
		}, {
			"label": "南安市",
			"value": "569",
		}, {
			"label": "惠安县",
			"value": "570",
		}, {
			"label": "安溪县",
			"value": "571",
		}, {
			"label": "永春县",
			"value": "572",
		}, {
			"label": "德化县",
			"value": "573",
		}, {
			"label": "金门县",
			"value": "574",
		}]
	}, {
		"label": "三明市",
		"value": "59",
		"children": [{
			"label": "梅列区",
			"value": "575",
		}, {
			"label": "三元区",
			"value": "576",
		}, {
			"label": "永安市",
			"value": "577",
		}, {
			"label": "明溪县",
			"value": "578",
		}, {
			"label": "清流县",
			"value": "579",
		}, {
			"label": "宁化县",
			"value": "580",
		}, {
			"label": "大田县",
			"value": "581",
		}, {
			"label": "尤溪县",
			"value": "582",
		}, {
			"label": "沙县",
			"value": "583",
		}, {
			"label": "将乐县",
			"value": "584",
		}, {
			"label": "泰宁县",
			"value": "585",
		}, {
			"label": "建宁县",
			"value": "586",
		}]
	}, {
		"label": "厦门市",
		"value": "60",
		"children": [{
			"label": "思明区",
			"value": "587",
		}, {
			"label": "海沧区",
			"value": "588",
		}, {
			"label": "湖里区",
			"value": "589",
		}, {
			"label": "集美区",
			"value": "590",
		}, {
			"label": "同安区",
			"value": "591",
		}, {
			"label": "翔安区",
			"value": "592",
		}]
	}, {
		"label": "漳州市",
		"value": "61",
		"children": [{
			"label": "芗城区",
			"value": "593",
		}, {
			"label": "龙文区",
			"value": "594",
		}, {
			"label": "龙海市",
			"value": "595",
		}, {
			"label": "云霄县",
			"value": "596",
		}, {
			"label": "漳浦县",
			"value": "597",
		}, {
			"label": "诏安县",
			"value": "598",
		}, {
			"label": "长泰县",
			"value": "599",
		}, {
			"label": "东山县",
			"value": "600",
		}, {
			"label": "南靖县",
			"value": "601",
		}, {
			"label": "平和县",
			"value": "602",
		}, {
			"label": "华安县",
			"value": "603",
		}]
	}]
}, {
	"label": "甘肃省",
	"value": "5",
	"children": [{
		"label": "兰州市",
		"value": "62",
		"children": [{
			"label": "皋兰县",
			"value": "604",
		}, {
			"label": "城关区",
			"value": "605",
		}, {
			"label": "七里河区",
			"value": "606",
		}, {
			"label": "西固区",
			"value": "607",
		}, {
			"label": "安宁区",
			"value": "608",
		}, {
			"label": "红古区",
			"value": "609",
		}, {
			"label": "永登县",
			"value": "610",
		}, {
			"label": "榆中县",
			"value": "611",
		}]
	}, {
		"label": "白银市",
		"value": "63",
		"children": [{
			"label": "白银区",
			"value": "612",
		}, {
			"label": "平川区",
			"value": "613",
		}, {
			"label": "会宁县",
			"value": "614",
		}, {
			"label": "景泰县",
			"value": "615",
		}, {
			"label": "靖远县",
			"value": "616",
		}]
	}, {
		"label": "定西市",
		"value": "64",
		"children": [{
			"label": "临洮县",
			"value": "617",
		}, {
			"label": "陇西县",
			"value": "618",
		}, {
			"label": "通渭县",
			"value": "619",
		}, {
			"label": "渭源县",
			"value": "620",
		}, {
			"label": "漳县",
			"value": "621",
		}, {
			"label": "岷县",
			"value": "622",
		}, {
			"label": "安定区",
			"value": "623",
		}, {
			"label": "安定区",
			"value": "624",
		}]
	}, {
		"label": "甘南市",
		"value": "65",
		"children": [{
			"label": "合作市",
			"value": "625",
		}, {
			"label": "临潭县",
			"value": "626",
		}, {
			"label": "卓尼县",
			"value": "627",
		}, {
			"label": "舟曲县",
			"value": "628",
		}, {
			"label": "迭部县",
			"value": "629",
		}, {
			"label": "玛曲县",
			"value": "630",
		}, {
			"label": "碌曲县",
			"value": "631",
		}, {
			"label": "夏河县",
			"value": "632",
		}]
	}, {
		"label": "嘉峪关市",
		"value": "66",
		"children": [{
			"label": "嘉峪关市",
			"value": "633",
		}]
	}, {
		"label": "金昌市",
		"value": "67",
		"children": [{
			"label": "金川区",
			"value": "634",
		}, {
			"label": "永昌县",
			"value": "635",
		}]
	}, {
		"label": "酒泉市",
		"value": "68",
		"children": [{
			"label": "肃州区",
			"value": "636",
		}, {
			"label": "玉门市",
			"value": "637",
		}, {
			"label": "敦煌市",
			"value": "638",
		}, {
			"label": "金塔县",
			"value": "639",
		}, {
			"label": "瓜州县",
			"value": "640",
		}, {
			"label": "肃北",
			"value": "641",
		}, {
			"label": "阿克塞",
			"value": "642",
		}]
	}, {
		"label": "临夏市",
		"value": "69",
		"children": [{
			"label": "临夏市",
			"value": "643",
		}, {
			"label": "临夏县",
			"value": "644",
		}, {
			"label": "康乐县",
			"value": "645",
		}, {
			"label": "永靖县",
			"value": "646",
		}, {
			"label": "广河县",
			"value": "647",
		}, {
			"label": "和政县",
			"value": "648",
		}, {
			"label": "东乡族自治县",
			"value": "649",
		}, {
			"label": "积石山",
			"value": "650",
		}]
	}, {
		"label": "陇南市",
		"value": "70",
		"children": [{
			"label": "成县",
			"value": "651",
		}, {
			"label": "徽县",
			"value": "652",
		}, {
			"label": "康县",
			"value": "653",
		}, {
			"label": "礼县",
			"value": "654",
		}, {
			"label": "两当县",
			"value": "655",
		}, {
			"label": "文县",
			"value": "656",
		}, {
			"label": "西和县",
			"value": "657",
		}, {
			"label": "宕昌县",
			"value": "658",
		}, {
			"label": "武都区",
			"value": "659",
		}]
	}, {
		"label": "平凉市",
		"value": "71",
		"children": [{
			"label": "崇信县",
			"value": "660",
		}, {
			"label": "华亭县",
			"value": "661",
		}, {
			"label": "静宁县",
			"value": "662",
		}, {
			"label": "灵台县",
			"value": "663",
		}, {
			"label": "崆峒区",
			"value": "664",
		}, {
			"label": "庄浪县",
			"value": "665",
		}, {
			"label": "泾川县",
			"value": "666",
		}]
	}, {
		"label": "庆阳市",
		"value": "72",
		"children": [{
			"label": "合水县",
			"value": "667",
		}, {
			"label": "华池县",
			"value": "668",
		}, {
			"label": "环县",
			"value": "669",
		}, {
			"label": "宁县",
			"value": "670",
		}, {
			"label": "庆城县",
			"value": "671",
		}, {
			"label": "西峰区",
			"value": "672",
		}, {
			"label": "镇原县",
			"value": "673",
		}, {
			"label": "正宁县",
			"value": "674",
		}]
	}, {
		"label": "天水市",
		"value": "73",
		"children": [{
			"label": "甘谷县",
			"value": "675",
		}, {
			"label": "秦安县",
			"value": "676",
		}, {
			"label": "清水县",
			"value": "677",
		}, {
			"label": "秦州区",
			"value": "678",
		}, {
			"label": "麦积区",
			"value": "679",
		}, {
			"label": "武山县",
			"value": "680",
		}, {
			"label": "张家川",
			"value": "681",
		}]
	}, {
		"label": "武威市",
		"value": "74",
		"children": [{
			"label": "古浪县",
			"value": "682",
		}, {
			"label": "民勤县",
			"value": "683",
		}, {
			"label": "天祝",
			"value": "684",
		}, {
			"label": "凉州区",
			"value": "685",
		}]
	}, {
		"label": "张掖市",
		"value": "75",
		"children": [{
			"label": "高台县",
			"value": "686",
		}, {
			"label": "临泽县",
			"value": "687",
		}, {
			"label": "民乐县",
			"value": "688",
		}, {
			"label": "山丹县",
			"value": "689",
		}, {
			"label": "肃南",
			"value": "690",
		}, {
			"label": "甘州区",
			"value": "691",
		}]
	}]
}, {
	"label": "广东省",
	"value": "6",
	"children": [{
		"label": "广州市",
		"value": "76",
		"children": [{
			"label": "从化市",
			"value": "692",
		}, {
			"label": "天河区",
			"value": "693",
		}, {
			"label": "东山区",
			"value": "694",
		}, {
			"label": "白云区",
			"value": "695",
		}, {
			"label": "海珠区",
			"value": "696",
		}, {
			"label": "荔湾区",
			"value": "697",
		}, {
			"label": "越秀区",
			"value": "698",
		}, {
			"label": "黄埔区",
			"value": "699",
		}, {
			"label": "番禺区",
			"value": "700",
		}, {
			"label": "花都区",
			"value": "701",
		}, {
			"label": "增城区",
			"value": "702",
		}, {
			"label": "从化区",
			"value": "703",
		}, {
			"label": "市郊",
			"value": "704",
		}]
	}, {
		"label": "深圳市",
		"value": "77",
		"children": [{
			"label": "福田区",
			"value": "705",
		}, {
			"label": "罗湖区",
			"value": "706",
		}, {
			"label": "南山区",
			"value": "707",
		}, {
			"label": "宝安区",
			"value": "708",
		}, {
			"label": "龙岗区",
			"value": "709",
		}, {
			"label": "盐田区",
			"value": "710",
		}]
	}, {
		"label": "潮州市",
		"value": "78",
		"children": [{
			"label": "湘桥区",
			"value": "711",
		}, {
			"label": "潮安县",
			"value": "712",
		}, {
			"label": "饶平县",
			"value": "713",
		}]
	}, {
		"label": "东莞市",
		"value": "79",
		"children": [{
			"label": "南城区",
			"value": "714",
		}, {
			"label": "东城区",
			"value": "715",
		}, {
			"label": "万江区",
			"value": "716",
		}, {
			"label": "莞城区",
			"value": "717",
		}, {
			"label": "石龙镇",
			"value": "718",
		}, {
			"label": "虎门镇",
			"value": "719",
		}, {
			"label": "麻涌镇",
			"value": "720",
		}, {
			"label": "道滘镇",
			"value": "721",
		}, {
			"label": "石碣镇",
			"value": "722",
		}, {
			"label": "沙田镇",
			"value": "723",
		}, {
			"label": "望牛墩镇",
			"value": "724",
		}, {
			"label": "洪梅镇",
			"value": "725",
		}, {
			"label": "茶山镇",
			"value": "726",
		}, {
			"label": "寮步镇",
			"value": "727",
		}, {
			"label": "大岭山镇",
			"value": "728",
		}, {
			"label": "大朗镇",
			"value": "729",
		}, {
			"label": "黄江镇",
			"value": "730",
		}, {
			"label": "樟木头",
			"value": "731",
		}, {
			"label": "凤岗镇",
			"value": "732",
		}, {
			"label": "塘厦镇",
			"value": "733",
		}, {
			"label": "谢岗镇",
			"value": "734",
		}, {
			"label": "厚街镇",
			"value": "735",
		}, {
			"label": "清溪镇",
			"value": "736",
		}, {
			"label": "常平镇",
			"value": "737",
		}, {
			"label": "桥头镇",
			"value": "738",
		}, {
			"label": "横沥镇",
			"value": "739",
		}, {
			"label": "东坑镇",
			"value": "740",
		}, {
			"label": "企石镇",
			"value": "741",
		}, {
			"label": "石排镇",
			"value": "742",
		}, {
			"label": "长安镇",
			"value": "743",
		}, {
			"label": "中堂镇",
			"value": "744",
		}, {
			"label": "高埗镇",
			"value": "745",
		}]
	}, {
		"label": "佛山市",
		"value": "80",
		"children": [{
			"label": "禅城区",
			"value": "746",
		}, {
			"label": "南海区",
			"value": "747",
		}, {
			"label": "顺德区",
			"value": "748",
		}, {
			"label": "三水区",
			"value": "749",
		}, {
			"label": "高明区",
			"value": "750",
		}]
	}, {
		"label": "河源市",
		"value": "81",
		"children": [{
			"label": "东源县",
			"value": "751",
		}, {
			"label": "和平县",
			"value": "752",
		}, {
			"label": "源城区",
			"value": "753",
		}, {
			"label": "连平县",
			"value": "754",
		}, {
			"label": "龙川县",
			"value": "755",
		}, {
			"label": "紫金县",
			"value": "756",
		}]
	}, {
		"label": "惠州市",
		"value": "82",
		"children": [{
			"label": "惠阳区",
			"value": "757",
		}, {
			"label": "惠城区",
			"value": "758",
		}, {
			"label": "大亚湾",
			"value": "759",
		}, {
			"label": "博罗县",
			"value": "760",
		}, {
			"label": "惠东县",
			"value": "761",
		}, {
			"label": "龙门县",
			"value": "762",
		}]
	}, {
		"label": "江门市",
		"value": "83",
		"children": [{
			"label": "江海区",
			"value": "763",
		}, {
			"label": "蓬江区",
			"value": "764",
		}, {
			"label": "新会区",
			"value": "765",
		}, {
			"label": "台山市",
			"value": "766",
		}, {
			"label": "开平市",
			"value": "767",
		}, {
			"label": "鹤山市",
			"value": "768",
		}, {
			"label": "恩平市",
			"value": "769",
		}]
	}, {
		"label": "揭阳市",
		"value": "84",
		"children": [{
			"label": "榕城区",
			"value": "770",
		}, {
			"label": "普宁市",
			"value": "771",
		}, {
			"label": "揭东县",
			"value": "772",
		}, {
			"label": "揭西县",
			"value": "773",
		}, {
			"label": "惠来县",
			"value": "774",
		}]
	}, {
		"label": "茂名市",
		"value": "85",
		"children": [{
			"label": "茂南区",
			"value": "775",
		}, {
			"label": "茂港区",
			"value": "776",
		}, {
			"label": "高州市",
			"value": "777",
		}, {
			"label": "化州市",
			"value": "778",
		}, {
			"label": "信宜市",
			"value": "779",
		}, {
			"label": "电白县",
			"value": "780",
		}]
	}, {
		"label": "梅州市",
		"value": "86",
		"children": [{
			"label": "梅县",
			"value": "781",
		}, {
			"label": "梅江区",
			"value": "782",
		}, {
			"label": "兴宁市",
			"value": "783",
		}, {
			"label": "大埔县",
			"value": "784",
		}, {
			"label": "丰顺县",
			"value": "785",
		}, {
			"label": "五华县",
			"value": "786",
		}, {
			"label": "平远县",
			"value": "787",
		}, {
			"label": "蕉岭县",
			"value": "788",
		}]
	}, {
		"label": "清远市",
		"value": "87",
		"children": [{
			"label": "清城区",
			"value": "789",
		}, {
			"label": "英德市",
			"value": "790",
		}, {
			"label": "连州市",
			"value": "791",
		}, {
			"label": "佛冈县",
			"value": "792",
		}, {
			"label": "阳山县",
			"value": "793",
		}, {
			"label": "清新县",
			"value": "794",
		}, {
			"label": "连山",
			"value": "795",
		}, {
			"label": "连南",
			"value": "796",
		}]
	}, {
		"label": "汕头市",
		"value": "88",
		"children": [{
			"label": "南澳县",
			"value": "797",
		}, {
			"label": "潮阳区",
			"value": "798",
		}, {
			"label": "澄海区",
			"value": "799",
		}, {
			"label": "龙湖区",
			"value": "800",
		}, {
			"label": "金平区",
			"value": "801",
		}, {
			"label": "濠江区",
			"value": "802",
		}, {
			"label": "潮南区",
			"value": "803",
		}]
	}, {
		"label": "汕尾市",
		"value": "89",
		"children": [{
			"label": "城区",
			"value": "804",
		}, {
			"label": "陆丰市",
			"value": "805",
		}, {
			"label": "海丰县",
			"value": "806",
		}, {
			"label": "陆河县",
			"value": "807",
		}]
	}, {
		"label": "韶关市",
		"value": "90",
		"children": [{
			"label": "曲江县",
			"value": "808",
		}, {
			"label": "浈江区",
			"value": "809",
		}, {
			"label": "武江区",
			"value": "810",
		}, {
			"label": "曲江区",
			"value": "811",
		}, {
			"label": "乐昌市",
			"value": "812",
		}, {
			"label": "南雄市",
			"value": "813",
		}, {
			"label": "始兴县",
			"value": "814",
		}, {
			"label": "仁化县",
			"value": "815",
		}, {
			"label": "翁源县",
			"value": "816",
		}, {
			"label": "新丰县",
			"value": "817",
		}, {
			"label": "乳源",
			"value": "818",
		}]
	}, {
		"label": "阳江市",
		"value": "91",
		"children": [{
			"label": "江城区",
			"value": "819",
		}, {
			"label": "阳春市",
			"value": "820",
		}, {
			"label": "阳西县",
			"value": "821",
		}, {
			"label": "阳东县",
			"value": "822",
		}]
	}, {
		"label": "云浮市",
		"value": "92",
		"children": [{
			"label": "云城区",
			"value": "823",
		}, {
			"label": "罗定市",
			"value": "824",
		}, {
			"label": "新兴县",
			"value": "825",
		}, {
			"label": "郁南县",
			"value": "826",
		}, {
			"label": "云安县",
			"value": "827",
		}]
	}, {
		"label": "湛江市",
		"value": "93",
		"children": [{
			"label": "赤坎区",
			"value": "828",
		}, {
			"label": "霞山区",
			"value": "829",
		}, {
			"label": "坡头区",
			"value": "830",
		}, {
			"label": "麻章区",
			"value": "831",
		}, {
			"label": "廉江市",
			"value": "832",
		}, {
			"label": "雷州市",
			"value": "833",
		}, {
			"label": "吴川市",
			"value": "834",
		}, {
			"label": "遂溪县",
			"value": "835",
		}, {
			"label": "徐闻县",
			"value": "836",
		}]
	}, {
		"label": "肇庆市",
		"value": "94",
		"children": [{
			"label": "肇庆市",
			"value": "837",
		}, {
			"label": "高要市",
			"value": "838",
		}, {
			"label": "四会市",
			"value": "839",
		}, {
			"label": "广宁县",
			"value": "840",
		}, {
			"label": "怀集县",
			"value": "841",
		}, {
			"label": "封开县",
			"value": "842",
		}, {
			"label": "德庆县",
			"value": "843",
		}]
	}, {
		"label": "中山市",
		"value": "95",
		"children": [{
			"label": "石岐街道",
			"value": "844",
		}, {
			"label": "东区街道",
			"value": "845",
		}, {
			"label": "西区街道",
			"value": "846",
		}, {
			"label": "环城街道",
			"value": "847",
		}, {
			"label": "中山港街道",
			"value": "848",
		}, {
			"label": "五桂山街道",
			"value": "849",
		}]
	}, {
		"label": "珠海市",
		"value": "96",
		"children": [{
			"label": "香洲区",
			"value": "850",
		}, {
			"label": "斗门区",
			"value": "851",
		}, {
			"label": "金湾区",
			"value": "852",
		}]
	}]
}, {
	"label": "广西壮族自治区",
	"value": "7",
	"children": [{
		"label": "南宁市",
		"value": "97",
		"children": [{
			"label": "邕宁区",
			"value": "853",
		}, {
			"label": "青秀区",
			"value": "854",
		}, {
			"label": "兴宁区",
			"value": "855",
		}, {
			"label": "良庆区",
			"value": "856",
		}, {
			"label": "西乡塘区",
			"value": "857",
		}, {
			"label": "江南区",
			"value": "858",
		}, {
			"label": "武鸣县",
			"value": "859",
		}, {
			"label": "隆安县",
			"value": "860",
		}, {
			"label": "马山县",
			"value": "861",
		}, {
			"label": "上林县",
			"value": "862",
		}, {
			"label": "宾阳县",
			"value": "863",
		}, {
			"label": "横县",
			"value": "864",
		}]
	}, {
		"label": "桂林市",
		"value": "98",
		"children": [{
			"label": "秀峰区",
			"value": "865",
		}, {
			"label": "叠彩区",
			"value": "866",
		}, {
			"label": "象山区",
			"value": "867",
		}, {
			"label": "七星区",
			"value": "868",
		}, {
			"label": "雁山区",
			"value": "869",
		}, {
			"label": "阳朔县",
			"value": "870",
		}, {
			"label": "临桂县",
			"value": "871",
		}, {
			"label": "灵川县",
			"value": "872",
		}, {
			"label": "全州县",
			"value": "873",
		}, {
			"label": "平乐县",
			"value": "874",
		}, {
			"label": "兴安县",
			"value": "875",
		}, {
			"label": "灌阳县",
			"value": "876",
		}, {
			"label": "荔浦县",
			"value": "877",
		}, {
			"label": "资源县",
			"value": "878",
		}, {
			"label": "永福县",
			"value": "879",
		}, {
			"label": "龙胜",
			"value": "880",
		}, {
			"label": "恭城",
			"value": "881",
		}]
	}, {
		"label": "百色市",
		"value": "99",
		"children": [{
			"label": "右江区",
			"value": "882",
		}, {
			"label": "凌云县",
			"value": "883",
		}, {
			"label": "平果县",
			"value": "884",
		}, {
			"label": "西林县",
			"value": "885",
		}, {
			"label": "乐业县",
			"value": "886",
		}, {
			"label": "德保县",
			"value": "887",
		}, {
			"label": "田林县",
			"value": "888",
		}, {
			"label": "田阳县",
			"value": "889",
		}, {
			"label": "靖西县",
			"value": "890",
		}, {
			"label": "田东县",
			"value": "891",
		}, {
			"label": "那坡县",
			"value": "892",
		}, {
			"label": "隆林",
			"value": "893",
		}]
	}, {
		"label": "北海市",
		"value": "100",
		"children": [{
			"label": "海城区",
			"value": "894",
		}, {
			"label": "银海区",
			"value": "895",
		}, {
			"label": "铁山港区",
			"value": "896",
		}, {
			"label": "合浦县",
			"value": "897",
		}]
	}, {
		"label": "崇左市",
		"value": "101",
		"children": [{
			"label": "江州区",
			"value": "898",
		}, {
			"label": "凭祥市",
			"value": "899",
		}, {
			"label": "宁明县",
			"value": "900",
		}, {
			"label": "扶绥县",
			"value": "901",
		}, {
			"label": "龙州县",
			"value": "902",
		}, {
			"label": "大新县",
			"value": "903",
		}, {
			"label": "天等县",
			"value": "904",
		}]
	}, {
		"label": "防城港市",
		"value": "102",
		"children": [{
			"label": "港口区",
			"value": "905",
		}, {
			"label": "防城区",
			"value": "906",
		}, {
			"label": "东兴市",
			"value": "907",
		}, {
			"label": "上思县",
			"value": "908",
		}]
	}, {
		"label": "贵港市",
		"value": "103",
		"children": [{
			"label": "港北区",
			"value": "909",
		}, {
			"label": "港南区",
			"value": "910",
		}, {
			"label": "覃塘区",
			"value": "911",
		}, {
			"label": "桂平市",
			"value": "912",
		}, {
			"label": "平南县",
			"value": "913",
		}]
	}, {
		"label": "河池市",
		"value": "104",
		"children": [{
			"label": "金城江区",
			"value": "914",
		}, {
			"label": "宜州市",
			"value": "915",
		}, {
			"label": "天峨县",
			"value": "916",
		}, {
			"label": "凤山县",
			"value": "917",
		}, {
			"label": "南丹县",
			"value": "918",
		}, {
			"label": "东兰县",
			"value": "919",
		}, {
			"label": "都安",
			"value": "920",
		}, {
			"label": "罗城",
			"value": "921",
		}, {
			"label": "巴马",
			"value": "922",
		}, {
			"label": "环江",
			"value": "923",
		}, {
			"label": "大化",
			"value": "924",
		}]
	}, {
		"label": "贺州市",
		"value": "105",
		"children": [{
			"label": "八步区",
			"value": "925",
		}, {
			"label": "钟山县",
			"value": "926",
		}, {
			"label": "昭平县",
			"value": "927",
		}, {
			"label": "富川",
			"value": "928",
		}]
	}, {
		"label": "来宾市",
		"value": "106",
		"children": [{
			"label": "兴宾区",
			"value": "929",
		}, {
			"label": "合山市",
			"value": "930",
		}, {
			"label": "象州县",
			"value": "931",
		}, {
			"label": "武宣县",
			"value": "932",
		}, {
			"label": "忻城县",
			"value": "933",
		}, {
			"label": "金秀",
			"value": "934",
		}]
	}, {
		"label": "柳州市",
		"value": "107",
		"children": [{
			"label": "城中区",
			"value": "935",
		}, {
			"label": "鱼峰区",
			"value": "936",
		}, {
			"label": "柳北区",
			"value": "937",
		}, {
			"label": "柳南区",
			"value": "938",
		}, {
			"label": "柳江县",
			"value": "939",
		}, {
			"label": "柳城县",
			"value": "940",
		}, {
			"label": "鹿寨县",
			"value": "941",
		}, {
			"label": "融安县",
			"value": "942",
		}, {
			"label": "融水",
			"value": "943",
		}, {
			"label": "三江",
			"value": "944",
		}]
	}, {
		"label": "钦州市",
		"value": "108",
		"children": [{
			"label": "钦南区",
			"value": "945",
		}, {
			"label": "钦北区",
			"value": "946",
		}, {
			"label": "灵山县",
			"value": "947",
		}, {
			"label": "浦北县",
			"value": "948",
		}]
	}, {
		"label": "梧州市",
		"value": "109",
		"children": [{
			"label": "万秀区",
			"value": "949",
		}, {
			"label": "蝶山区",
			"value": "950",
		}, {
			"label": "长洲区",
			"value": "951",
		}, {
			"label": "岑溪市",
			"value": "952",
		}, {
			"label": "苍梧县",
			"value": "953",
		}, {
			"label": "藤县",
			"value": "954",
		}, {
			"label": "蒙山县",
			"value": "955",
		}]
	}, {
		"label": "玉林市",
		"value": "110",
		"children": [{
			"label": "玉州区",
			"value": "956",
		}, {
			"label": "北流市",
			"value": "957",
		}, {
			"label": "容县",
			"value": "958",
		}, {
			"label": "陆川县",
			"value": "959",
		}, {
			"label": "博白县",
			"value": "960",
		}, {
			"label": "兴业县",
			"value": "961",
		}]
	}]
}, {
	"label": "贵州省",
	"value": "8",
	"children": [{
		"label": "贵阳市",
		"value": "111",
		"children": [{
			"label": "南明区",
			"value": "962",
		}, {
			"label": "云岩区",
			"value": "963",
		}, {
			"label": "花溪区",
			"value": "964",
		}, {
			"label": "乌当区",
			"value": "965",
		}, {
			"label": "白云区",
			"value": "966",
		}, {
			"label": "小河区",
			"value": "967",
		}, {
			"label": "金阳新区",
			"value": "968",
		}, {
			"label": "新天园区",
			"value": "969",
		}, {
			"label": "清镇市",
			"value": "970",
		}, {
			"label": "开阳县",
			"value": "971",
		}, {
			"label": "修文县",
			"value": "972",
		}, {
			"label": "息烽县",
			"value": "973",
		}]
	}, {
		"label": "安顺市",
		"value": "112",
		"children": [{
			"label": "西秀区",
			"value": "974",
		}, {
			"label": "关岭",
			"value": "975",
		}, {
			"label": "镇宁",
			"value": "976",
		}, {
			"label": "紫云",
			"value": "977",
		}, {
			"label": "平坝县",
			"value": "978",
		}, {
			"label": "普定县",
			"value": "979",
		}]
	}, {
		"label": "毕节市",
		"value": "113",
		"children": [{
			"label": "毕节市",
			"value": "980",
		}, {
			"label": "大方县",
			"value": "981",
		}, {
			"label": "黔西县",
			"value": "982",
		}, {
			"label": "金沙县",
			"value": "983",
		}, {
			"label": "织金县",
			"value": "984",
		}, {
			"label": "纳雍县",
			"value": "985",
		}, {
			"label": "赫章县",
			"value": "986",
		}, {
			"label": "威宁",
			"value": "987",
		}]
	}, {
		"label": "六盘水市",
		"value": "114",
		"children": [{
			"label": "钟山区",
			"value": "988",
		}, {
			"label": "六枝特区",
			"value": "989",
		}, {
			"label": "水城县",
			"value": "990",
		}, {
			"label": "盘县",
			"value": "991",
		}]
	}, {
		"label": "黔东南苗族侗族自治州",
		"value": "115",
		"children": [{
			"label": "凯里市",
			"value": "992",
		}, {
			"label": "黄平县",
			"value": "993",
		}, {
			"label": "施秉县",
			"value": "994",
		}, {
			"label": "三穗县",
			"value": "995",
		}, {
			"label": "镇远县",
			"value": "996",
		}, {
			"label": "岑巩县",
			"value": "997",
		}, {
			"label": "天柱县",
			"value": "998",
		}, {
			"label": "锦屏县",
			"value": "999",
		}, {
			"label": "剑河县",
			"value": "1000",
		}, {
			"label": "台江县",
			"value": "1001",
		}, {
			"label": "黎平县",
			"value": "1002",
		}, {
			"label": "榕江县",
			"value": "1003",
		}, {
			"label": "从江县",
			"value": "1004",
		}, {
			"label": "雷山县",
			"value": "1005",
		}, {
			"label": "麻江县",
			"value": "1006",
		}, {
			"label": "丹寨县",
			"value": "1007",
		}]
	}, {
		"label": "黔南布依族苗族自治州",
		"value": "116",
		"children": [{
			"label": "都匀市",
			"value": "1008",
		}, {
			"label": "福泉市",
			"value": "1009",
		}, {
			"label": "荔波县",
			"value": "1010",
		}, {
			"label": "贵定县",
			"value": "1011",
		}, {
			"label": "瓮安县",
			"value": "1012",
		}, {
			"label": "独山县",
			"value": "1013",
		}, {
			"label": "平塘县",
			"value": "1014",
		}, {
			"label": "罗甸县",
			"value": "1015",
		}, {
			"label": "长顺县",
			"value": "1016",
		}, {
			"label": "龙里县",
			"value": "1017",
		}, {
			"label": "惠水县",
			"value": "1018",
		}, {
			"label": "三都",
			"value": "1019",
		}]
	}, {
		"label": "黔西南布依族苗族自治州",
		"value": "117",
		"children": [{
			"label": "兴义市",
			"value": "1020",
		}, {
			"label": "兴仁县",
			"value": "1021",
		}, {
			"label": "普安县",
			"value": "1022",
		}, {
			"label": "晴隆县",
			"value": "1023",
		}, {
			"label": "贞丰县",
			"value": "1024",
		}, {
			"label": "望谟县",
			"value": "1025",
		}, {
			"label": "册亨县",
			"value": "1026",
		}, {
			"label": "安龙县",
			"value": "1027",
		}]
	}, {
		"label": "铜仁市",
		"value": "118",
		"children": [{
			"label": "铜仁市",
			"value": "1028",
		}, {
			"label": "江口县",
			"value": "1029",
		}, {
			"label": "石阡县",
			"value": "1030",
		}, {
			"label": "思南县",
			"value": "1031",
		}, {
			"label": "德江县",
			"value": "1032",
		}, {
			"label": "玉屏",
			"value": "1033",
		}, {
			"label": "印江",
			"value": "1034",
		}, {
			"label": "沿河",
			"value": "1035",
		}, {
			"label": "松桃",
			"value": "1036",
		}, {
			"label": "万山特区",
			"value": "1037",
		}]
	}, {
		"label": "遵义市",
		"value": "119",
		"children": [{
			"label": "红花岗区",
			"value": "1038",
		}, {
			"label": "务川县",
			"value": "1039",
		}, {
			"label": "道真县",
			"value": "1040",
		}, {
			"label": "汇川区",
			"value": "1041",
		}, {
			"label": "赤水市",
			"value": "1042",
		}, {
			"label": "仁怀市",
			"value": "1043",
		}, {
			"label": "遵义县",
			"value": "1044",
		}, {
			"label": "桐梓县",
			"value": "1045",
		}, {
			"label": "绥阳县",
			"value": "1046",
		}, {
			"label": "正安县",
			"value": "1047",
		}, {
			"label": "凤冈县",
			"value": "1048",
		}, {
			"label": "湄潭县",
			"value": "1049",
		}, {
			"label": "余庆县",
			"value": "1050",
		}, {
			"label": "习水县",
			"value": "1051",
		}, {
			"label": "道真",
			"value": "1052",
		}, {
			"label": "务川",
			"value": "1053",
		}]
	}]
}, {
	"label": "海南省",
	"value": "9",
	"children": [{
		"label": "海口市",
		"value": "120",
		"children": [{
			"label": "秀英区",
			"value": "1054",
		}, {
			"label": "龙华区",
			"value": "1055",
		}, {
			"label": "琼山区",
			"value": "1056",
		}, {
			"label": "美兰区",
			"value": "1057",
		}]
	}, {
		"label": "三亚市",
		"value": "121",
		"children": []
	}, {
		"label": "白沙黎族自治县",
		"value": "122",
		"children": []
	}, {
		"label": "保亭黎族苗族自治县",
		"value": "123",
		"children": []
	}, {
		"label": "昌江黎族自治县",
		"value": "124",
		"children": []
	}, {
		"label": "澄迈县市",
		"value": "125",
		"children": []
	}, {
		"label": "定安县市",
		"value": "126",
		"children": []
	}, {
		"label": "东方市",
		"value": "127",
		"children": []
	}, {
		"label": "乐东黎族自治县",
		"value": "128",
		"children": []
	}, {
		"label": "临高县市",
		"value": "129",
		"children": []
	}, {
		"label": "陵水黎族自治县",
		"value": "130",
		"children": []
	}, {
		"label": "琼海市",
		"value": "131",
		"children": []
	}, {
		"label": "琼中黎族苗族自治县",
		"value": "132",
		"children": []
	}, {
		"label": "屯昌县市",
		"value": "133",
		"children": []
	}, {
		"label": "万宁市",
		"value": "134",
		"children": []
	}, {
		"label": "文昌市",
		"value": "135",
		"children": []
	}, {
		"label": "五指山市",
		"value": "136",
		"children": []
	}, {
		"label": "儋州市",
		"value": "137",
		"children": [{
			"label": "市区",
			"value": "1058",
		}, {
			"label": "洋浦开发区",
			"value": "1059",
		}, {
			"label": "那大镇",
			"value": "1060",
		}, {
			"label": "王五镇",
			"value": "1061",
		}, {
			"label": "雅星镇",
			"value": "1062",
		}, {
			"label": "大成镇",
			"value": "1063",
		}, {
			"label": "中和镇",
			"value": "1064",
		}, {
			"label": "峨蔓镇",
			"value": "1065",
		}, {
			"label": "南丰镇",
			"value": "1066",
		}, {
			"label": "白马井镇",
			"value": "1067",
		}, {
			"label": "兰洋镇",
			"value": "1068",
		}, {
			"label": "和庆镇",
			"value": "1069",
		}, {
			"label": "海头镇",
			"value": "1070",
		}, {
			"label": "排浦镇",
			"value": "1071",
		}, {
			"label": "东成镇",
			"value": "1072",
		}, {
			"label": "光村镇",
			"value": "1073",
		}, {
			"label": "木棠镇",
			"value": "1074",
		}, {
			"label": "新州镇",
			"value": "1075",
		}, {
			"label": "三都镇",
			"value": "1076",
		}, {
			"label": "其他",
			"value": "1077",
		}]
	}]
}, {
	"label": "河北省",
	"value": "10",
	"children": [{
		"label": "石家庄市",
		"value": "138",
		"children": [{
			"label": "长安区",
			"value": "1078",
		}, {
			"label": "桥东区",
			"value": "1079",
		}, {
			"label": "桥西区",
			"value": "1080",
		}, {
			"label": "新华区",
			"value": "1081",
		}, {
			"label": "裕华区",
			"value": "1082",
		}, {
			"label": "井陉矿区",
			"value": "1083",
		}, {
			"label": "高新区",
			"value": "1084",
		}, {
			"label": "辛集市",
			"value": "1085",
		}, {
			"label": "藁城市",
			"value": "1086",
		}, {
			"label": "晋州市",
			"value": "1087",
		}, {
			"label": "新乐市",
			"value": "1088",
		}, {
			"label": "鹿泉市",
			"value": "1089",
		}, {
			"label": "井陉县",
			"value": "1090",
		}, {
			"label": "正定县",
			"value": "1091",
		}, {
			"label": "栾城县",
			"value": "1092",
		}, {
			"label": "行唐县",
			"value": "1093",
		}, {
			"label": "灵寿县",
			"value": "1094",
		}, {
			"label": "高邑县",
			"value": "1095",
		}, {
			"label": "深泽县",
			"value": "1096",
		}, {
			"label": "赞皇县",
			"value": "1097",
		}, {
			"label": "无极县",
			"value": "1098",
		}, {
			"label": "平山县",
			"value": "1099",
		}, {
			"label": "元氏县",
			"value": "1100",
		}, {
			"label": "赵县",
			"value": "1101",
		}]
	}, {
		"label": "保定市",
		"value": "139",
		"children": [{
			"label": "新市区",
			"value": "1102",
		}, {
			"label": "南市区",
			"value": "1103",
		}, {
			"label": "北市区",
			"value": "1104",
		}, {
			"label": "涿州市",
			"value": "1105",
		}, {
			"label": "定州市",
			"value": "1106",
		}, {
			"label": "安国市",
			"value": "1107",
		}, {
			"label": "高碑店市",
			"value": "1108",
		}, {
			"label": "满城县",
			"value": "1109",
		}, {
			"label": "清苑县",
			"value": "1110",
		}, {
			"label": "涞水县",
			"value": "1111",
		}, {
			"label": "阜平县",
			"value": "1112",
		}, {
			"label": "徐水县",
			"value": "1113",
		}, {
			"label": "定兴县",
			"value": "1114",
		}, {
			"label": "唐县",
			"value": "1115",
		}, {
			"label": "高阳县",
			"value": "1116",
		}, {
			"label": "容城县",
			"value": "1117",
		}, {
			"label": "涞源县",
			"value": "1118",
		}, {
			"label": "望都县",
			"value": "1119",
		}, {
			"label": "安新县",
			"value": "1120",
		}, {
			"label": "易县",
			"value": "1121",
		}, {
			"label": "曲阳县",
			"value": "1122",
		}, {
			"label": "蠡县",
			"value": "1123",
		}, {
			"label": "顺平县",
			"value": "1124",
		}, {
			"label": "博野县",
			"value": "1125",
		}, {
			"label": "雄县",
			"value": "1126",
		}]
	}, {
		"label": "沧州市",
		"value": "140",
		"children": [{
			"label": "运河区",
			"value": "1127",
		}, {
			"label": "新华区",
			"value": "1128",
		}, {
			"label": "泊头市",
			"value": "1129",
		}, {
			"label": "任丘市",
			"value": "1130",
		}, {
			"label": "黄骅市",
			"value": "1131",
		}, {
			"label": "河间市",
			"value": "1132",
		}, {
			"label": "沧县",
			"value": "1133",
		}, {
			"label": "青县",
			"value": "1134",
		}, {
			"label": "东光县",
			"value": "1135",
		}, {
			"label": "海兴县",
			"value": "1136",
		}, {
			"label": "盐山县",
			"value": "1137",
		}, {
			"label": "肃宁县",
			"value": "1138",
		}, {
			"label": "南皮县",
			"value": "1139",
		}, {
			"label": "吴桥县",
			"value": "1140",
		}, {
			"label": "献县",
			"value": "1141",
		}, {
			"label": "孟村",
			"value": "1142",
		}]
	}, {
		"label": "承德市",
		"value": "141",
		"children": [{
			"label": "双桥区",
			"value": "1143",
		}, {
			"label": "双滦区",
			"value": "1144",
		}, {
			"label": "鹰手营子矿区",
			"value": "1145",
		}, {
			"label": "承德县",
			"value": "1146",
		}, {
			"label": "兴隆县",
			"value": "1147",
		}, {
			"label": "平泉县",
			"value": "1148",
		}, {
			"label": "滦平县",
			"value": "1149",
		}, {
			"label": "隆化县",
			"value": "1150",
		}, {
			"label": "丰宁",
			"value": "1151",
		}, {
			"label": "宽城",
			"value": "1152",
		}, {
			"label": "围场",
			"value": "1153",
		}]
	}, {
		"label": "邯郸市",
		"value": "142",
		"children": [{
			"label": "从台区",
			"value": "1154",
		}, {
			"label": "复兴区",
			"value": "1155",
		}, {
			"label": "邯山区",
			"value": "1156",
		}, {
			"label": "峰峰矿区",
			"value": "1157",
		}, {
			"label": "武安市",
			"value": "1158",
		}, {
			"label": "邯郸县",
			"value": "1159",
		}, {
			"label": "临漳县",
			"value": "1160",
		}, {
			"label": "成安县",
			"value": "1161",
		}, {
			"label": "大名县",
			"value": "1162",
		}, {
			"label": "涉县",
			"value": "1163",
		}, {
			"label": "磁县",
			"value": "1164",
		}, {
			"label": "肥乡县",
			"value": "1165",
		}, {
			"label": "永年县",
			"value": "1166",
		}, {
			"label": "邱县",
			"value": "1167",
		}, {
			"label": "鸡泽县",
			"value": "1168",
		}, {
			"label": "广平县",
			"value": "1169",
		}, {
			"label": "馆陶县",
			"value": "1170",
		}, {
			"label": "魏县",
			"value": "1171",
		}, {
			"label": "曲周县",
			"value": "1172",
		}]
	}, {
		"label": "衡水市",
		"value": "143",
		"children": [{
			"label": "桃城区",
			"value": "1173",
		}, {
			"label": "冀州市",
			"value": "1174",
		}, {
			"label": "深州市",
			"value": "1175",
		}, {
			"label": "枣强县",
			"value": "1176",
		}, {
			"label": "武邑县",
			"value": "1177",
		}, {
			"label": "武强县",
			"value": "1178",
		}, {
			"label": "饶阳县",
			"value": "1179",
		}, {
			"label": "安平县",
			"value": "1180",
		}, {
			"label": "故城县",
			"value": "1181",
		}, {
			"label": "景县",
			"value": "1182",
		}, {
			"label": "阜城县",
			"value": "1183",
		}]
	}, {
		"label": "廊坊市",
		"value": "144",
		"children": [{
			"label": "安次区",
			"value": "1184",
		}, {
			"label": "广阳区",
			"value": "1185",
		}, {
			"label": "霸州市",
			"value": "1186",
		}, {
			"label": "三河市",
			"value": "1187",
		}, {
			"label": "固安县",
			"value": "1188",
		}, {
			"label": "永清县",
			"value": "1189",
		}, {
			"label": "香河县",
			"value": "1190",
		}, {
			"label": "大城县",
			"value": "1191",
		}, {
			"label": "文安县",
			"value": "1192",
		}, {
			"label": "大厂",
			"value": "1193",
		}]
	}, {
		"label": "秦皇岛市",
		"value": "145",
		"children": [{
			"label": "海港区",
			"value": "1194",
		}, {
			"label": "山海关区",
			"value": "1195",
		}, {
			"label": "北戴河区",
			"value": "1196",
		}, {
			"label": "昌黎县",
			"value": "1197",
		}, {
			"label": "抚宁县",
			"value": "1198",
		}, {
			"label": "卢龙县",
			"value": "1199",
		}, {
			"label": "青龙",
			"value": "1200",
		}]
	}, {
		"label": "唐山市",
		"value": "146",
		"children": [{
			"label": "路北区",
			"value": "1201",
		}, {
			"label": "路南区",
			"value": "1202",
		}, {
			"label": "古冶区",
			"value": "1203",
		}, {
			"label": "开平区",
			"value": "1204",
		}, {
			"label": "丰南区",
			"value": "1205",
		}, {
			"label": "丰润区",
			"value": "1206",
		}, {
			"label": "遵化市",
			"value": "1207",
		}, {
			"label": "迁安市",
			"value": "1208",
		}, {
			"label": "滦县",
			"value": "1209",
		}, {
			"label": "滦南县",
			"value": "1210",
		}, {
			"label": "乐亭县",
			"value": "1211",
		}, {
			"label": "迁西县",
			"value": "1212",
		}, {
			"label": "玉田县",
			"value": "1213",
		}, {
			"label": "唐海县",
			"value": "1214",
		}]
	}, {
		"label": "邢台市",
		"value": "147",
		"children": [{
			"label": "桥东区",
			"value": "1215",
		}, {
			"label": "桥西区",
			"value": "1216",
		}, {
			"label": "南宫市",
			"value": "1217",
		}, {
			"label": "沙河市",
			"value": "1218",
		}, {
			"label": "邢台县",
			"value": "1219",
		}, {
			"label": "临城县",
			"value": "1220",
		}, {
			"label": "内丘县",
			"value": "1221",
		}, {
			"label": "柏乡县",
			"value": "1222",
		}, {
			"label": "隆尧县",
			"value": "1223",
		}, {
			"label": "任县",
			"value": "1224",
		}, {
			"label": "南和县",
			"value": "1225",
		}, {
			"label": "宁晋县",
			"value": "1226",
		}, {
			"label": "巨鹿县",
			"value": "1227",
		}, {
			"label": "新河县",
			"value": "1228",
		}, {
			"label": "广宗县",
			"value": "1229",
		}, {
			"label": "平乡县",
			"value": "1230",
		}, {
			"label": "威县",
			"value": "1231",
		}, {
			"label": "清河县",
			"value": "1232",
		}, {
			"label": "临西县",
			"value": "1233",
		}]
	}, {
		"label": "张家口市",
		"value": "148",
		"children": [{
			"label": "桥西区",
			"value": "1234",
		}, {
			"label": "桥东区",
			"value": "1235",
		}, {
			"label": "宣化区",
			"value": "1236",
		}, {
			"label": "下花园区",
			"value": "1237",
		}, {
			"label": "宣化县",
			"value": "1238",
		}, {
			"label": "张北县",
			"value": "1239",
		}, {
			"label": "康保县",
			"value": "1240",
		}, {
			"label": "沽源县",
			"value": "1241",
		}, {
			"label": "尚义县",
			"value": "1242",
		}, {
			"label": "蔚县",
			"value": "1243",
		}, {
			"label": "阳原县",
			"value": "1244",
		}, {
			"label": "怀安县",
			"value": "1245",
		}, {
			"label": "万全县",
			"value": "1246",
		}, {
			"label": "怀来县",
			"value": "1247",
		}, {
			"label": "涿鹿县",
			"value": "1248",
		}, {
			"label": "赤城县",
			"value": "1249",
		}, {
			"label": "崇礼县",
			"value": "1250",
		}]
	}]
}, {
	"label": "河南省",
	"value": "11",
	"children": [{
		"label": "郑州市",
		"value": "149",
		"children": [{
			"label": "金水区",
			"value": "1251",
		}, {
			"label": "邙山区",
			"value": "1252",
		}, {
			"label": "二七区",
			"value": "1253",
		}, {
			"label": "管城区",
			"value": "1254",
		}, {
			"label": "中原区",
			"value": "1255",
		}, {
			"label": "上街区",
			"value": "1256",
		}, {
			"label": "惠济区",
			"value": "1257",
		}, {
			"label": "郑东新区",
			"value": "1258",
		}, {
			"label": "经济技术开发区",
			"value": "1259",
		}, {
			"label": "高新开发区",
			"value": "1260",
		}, {
			"label": "出口加工区",
			"value": "1261",
		}, {
			"label": "巩义市",
			"value": "1262",
		}, {
			"label": "荥阳市",
			"value": "1263",
		}, {
			"label": "新密市",
			"value": "1264",
		}, {
			"label": "新郑市",
			"value": "1265",
		}, {
			"label": "登封市",
			"value": "1266",
		}, {
			"label": "中牟县",
			"value": "1267",
		}]
	}, {
		"label": "洛阳市",
		"value": "150",
		"children": [{
			"label": "西工区",
			"value": "1268",
		}, {
			"label": "老城区",
			"value": "1269",
		}, {
			"label": "涧西区",
			"value": "1270",
		}, {
			"label": "瀍河回族区",
			"value": "1271",
		}, {
			"label": "洛龙区",
			"value": "1272",
		}, {
			"label": "吉利区",
			"value": "1273",
		}, {
			"label": "偃师市",
			"value": "1274",
		}, {
			"label": "孟津县",
			"value": "1275",
		}, {
			"label": "新安县",
			"value": "1276",
		}, {
			"label": "栾川县",
			"value": "1277",
		}, {
			"label": "嵩县",
			"value": "1278",
		}, {
			"label": "汝阳县",
			"value": "1279",
		}, {
			"label": "宜阳县",
			"value": "1280",
		}, {
			"label": "洛宁县",
			"value": "1281",
		}, {
			"label": "伊川县",
			"value": "1282",
		}]
	}, {
		"label": "开封市",
		"value": "151",
		"children": [{
			"label": "鼓楼区",
			"value": "1283",
		}, {
			"label": "龙亭区",
			"value": "1284",
		}, {
			"label": "顺河回族区",
			"value": "1285",
		}, {
			"label": "金明区",
			"value": "1286",
		}, {
			"label": "禹王台区",
			"value": "1287",
		}, {
			"label": "杞县",
			"value": "1288",
		}, {
			"label": "通许县",
			"value": "1289",
		}, {
			"label": "尉氏县",
			"value": "1290",
		}, {
			"label": "开封县",
			"value": "1291",
		}, {
			"label": "兰考县",
			"value": "1292",
		}]
	}, {
		"label": "安阳市",
		"value": "152",
		"children": [{
			"label": "北关区",
			"value": "1293",
		}, {
			"label": "文峰区",
			"value": "1294",
		}, {
			"label": "殷都区",
			"value": "1295",
		}, {
			"label": "龙安区",
			"value": "1296",
		}, {
			"label": "林州市",
			"value": "1297",
		}, {
			"label": "安阳县",
			"value": "1298",
		}, {
			"label": "汤阴县",
			"value": "1299",
		}, {
			"label": "滑县",
			"value": "1300",
		}, {
			"label": "内黄县",
			"value": "1301",
		}]
	}, {
		"label": "鹤壁市",
		"value": "153",
		"children": [{
			"label": "淇滨区",
			"value": "1302",
		}, {
			"label": "山城区",
			"value": "1303",
		}, {
			"label": "鹤山区",
			"value": "1304",
		}, {
			"label": "浚县",
			"value": "1305",
		}, {
			"label": "淇县",
			"value": "1306",
		}]
	}, {
		"label": "济源市",
		"value": "154",
		"children": [{
			"label": "济源市",
			"value": "1307",
		}]
	}, {
		"label": "焦作市",
		"value": "155",
		"children": [{
			"label": "解放区",
			"value": "1308",
		}, {
			"label": "中站区",
			"value": "1309",
		}, {
			"label": "马村区",
			"value": "1310",
		}, {
			"label": "山阳区",
			"value": "1311",
		}, {
			"label": "沁阳市",
			"value": "1312",
		}, {
			"label": "孟州市",
			"value": "1313",
		}, {
			"label": "修武县",
			"value": "1314",
		}, {
			"label": "博爱县",
			"value": "1315",
		}, {
			"label": "武陟县",
			"value": "1316",
		}, {
			"label": "温县",
			"value": "1317",
		}]
	}, {
		"label": "南阳市",
		"value": "156",
		"children": [{
			"label": "卧龙区",
			"value": "1318",
		}, {
			"label": "宛城区",
			"value": "1319",
		}, {
			"label": "邓州市",
			"value": "1320",
		}, {
			"label": "南召县",
			"value": "1321",
		}, {
			"label": "方城县",
			"value": "1322",
		}, {
			"label": "西峡县",
			"value": "1323",
		}, {
			"label": "镇平县",
			"value": "1324",
		}, {
			"label": "内乡县",
			"value": "1325",
		}, {
			"label": "淅川县",
			"value": "1326",
		}, {
			"label": "社旗县",
			"value": "1327",
		}, {
			"label": "唐河县",
			"value": "1328",
		}, {
			"label": "新野县",
			"value": "1329",
		}, {
			"label": "桐柏县",
			"value": "1330",
		}]
	}, {
		"label": "平顶山市",
		"value": "157",
		"children": [{
			"label": "新华区",
			"value": "1331",
		}, {
			"label": "卫东区",
			"value": "1332",
		}, {
			"label": "湛河区",
			"value": "1333",
		}, {
			"label": "石龙区",
			"value": "1334",
		}, {
			"label": "舞钢市",
			"value": "1335",
		}, {
			"label": "汝州市",
			"value": "1336",
		}, {
			"label": "宝丰县",
			"value": "1337",
		}, {
			"label": "叶县",
			"value": "1338",
		}, {
			"label": "鲁山县",
			"value": "1339",
		}, {
			"label": "郏县",
			"value": "1340",
		}]
	}, {
		"label": "三门峡市",
		"value": "158",
		"children": [{
			"label": "湖滨区",
			"value": "1341",
		}, {
			"label": "义马市",
			"value": "1342",
		}, {
			"label": "灵宝市",
			"value": "1343",
		}, {
			"label": "渑池县",
			"value": "1344",
		}, {
			"label": "陕县",
			"value": "1345",
		}, {
			"label": "卢氏县",
			"value": "1346",
		}]
	}, {
		"label": "商丘市",
		"value": "159",
		"children": [{
			"label": "梁园区",
			"value": "1347",
		}, {
			"label": "睢阳区",
			"value": "1348",
		}, {
			"label": "永城市",
			"value": "1349",
		}, {
			"label": "民权县",
			"value": "1350",
		}, {
			"label": "睢县",
			"value": "1351",
		}, {
			"label": "宁陵县",
			"value": "1352",
		}, {
			"label": "虞城县",
			"value": "1353",
		}, {
			"label": "柘城县",
			"value": "1354",
		}, {
			"label": "夏邑县",
			"value": "1355",
		}]
	}, {
		"label": "新乡市",
		"value": "160",
		"children": [{
			"label": "卫滨区",
			"value": "1356",
		}, {
			"label": "红旗区",
			"value": "1357",
		}, {
			"label": "凤泉区",
			"value": "1358",
		}, {
			"label": "牧野区",
			"value": "1359",
		}, {
			"label": "卫辉市",
			"value": "1360",
		}, {
			"label": "辉县市",
			"value": "1361",
		}, {
			"label": "新乡县",
			"value": "1362",
		}, {
			"label": "获嘉县",
			"value": "1363",
		}, {
			"label": "原阳县",
			"value": "1364",
		}, {
			"label": "延津县",
			"value": "1365",
		}, {
			"label": "封丘县",
			"value": "1366",
		}, {
			"label": "长垣县",
			"value": "1367",
		}]
	}, {
		"label": "信阳市",
		"value": "161",
		"children": [{
			"label": "浉河区",
			"value": "1368",
		}, {
			"label": "平桥区",
			"value": "1369",
		}, {
			"label": "罗山县",
			"value": "1370",
		}, {
			"label": "光山县",
			"value": "1371",
		}, {
			"label": "新县",
			"value": "1372",
		}, {
			"label": "商城县",
			"value": "1373",
		}, {
			"label": "固始县",
			"value": "1374",
		}, {
			"label": "潢川县",
			"value": "1375",
		}, {
			"label": "淮滨县",
			"value": "1376",
		}, {
			"label": "息县",
			"value": "1377",
		}]
	}, {
		"label": "许昌市",
		"value": "162",
		"children": [{
			"label": "魏都区",
			"value": "1378",
		}, {
			"label": "禹州市",
			"value": "1379",
		}, {
			"label": "长葛市",
			"value": "1380",
		}, {
			"label": "许昌县",
			"value": "1381",
		}, {
			"label": "鄢陵县",
			"value": "1382",
		}, {
			"label": "襄城县",
			"value": "1383",
		}]
	}, {
		"label": "周口市",
		"value": "163",
		"children": [{
			"label": "川汇区",
			"value": "1384",
		}, {
			"label": "项城市",
			"value": "1385",
		}, {
			"label": "扶沟县",
			"value": "1386",
		}, {
			"label": "西华县",
			"value": "1387",
		}, {
			"label": "商水县",
			"value": "1388",
		}, {
			"label": "沈丘县",
			"value": "1389",
		}, {
			"label": "郸城县",
			"value": "1390",
		}, {
			"label": "淮阳县",
			"value": "1391",
		}, {
			"label": "太康县",
			"value": "1392",
		}, {
			"label": "鹿邑县",
			"value": "1393",
		}]
	}, {
		"label": "驻马店市",
		"value": "164",
		"children": [{
			"label": "驿城区",
			"value": "1394",
		}, {
			"label": "西平县",
			"value": "1395",
		}, {
			"label": "上蔡县",
			"value": "1396",
		}, {
			"label": "平舆县",
			"value": "1397",
		}, {
			"label": "正阳县",
			"value": "1398",
		}, {
			"label": "确山县",
			"value": "1399",
		}, {
			"label": "泌阳县",
			"value": "1400",
		}, {
			"label": "汝南县",
			"value": "1401",
		}, {
			"label": "遂平县",
			"value": "1402",
		}, {
			"label": "新蔡县",
			"value": "1403",
		}]
	}, {
		"label": "漯河市",
		"value": "165",
		"children": [{
			"label": "郾城区",
			"value": "1404",
		}, {
			"label": "源汇区",
			"value": "1405",
		}, {
			"label": "召陵区",
			"value": "1406",
		}, {
			"label": "舞阳县",
			"value": "1407",
		}, {
			"label": "临颍县",
			"value": "1408",
		}]
	}, {
		"label": "濮阳市",
		"value": "166",
		"children": [{
			"label": "华龙区",
			"value": "1409",
		}, {
			"label": "清丰县",
			"value": "1410",
		}, {
			"label": "南乐县",
			"value": "1411",
		}, {
			"label": "范县",
			"value": "1412",
		}, {
			"label": "台前县",
			"value": "1413",
		}, {
			"label": "濮阳县",
			"value": "1414",
		}]
	}]
}, {
	"label": "黑龙江省",
	"value": "12",
	"children": [{
		"label": "哈尔滨市",
		"value": "167",
		"children": [{
			"label": "道里区",
			"value": "1415",
		}, {
			"label": "南岗区",
			"value": "1416",
		}, {
			"label": "动力区",
			"value": "1417",
		}, {
			"label": "平房区",
			"value": "1418",
		}, {
			"label": "香坊区",
			"value": "1419",
		}, {
			"label": "太平区",
			"value": "1420",
		}, {
			"label": "道外区",
			"value": "1421",
		}, {
			"label": "阿城区",
			"value": "1422",
		}, {
			"label": "呼兰区",
			"value": "1423",
		}, {
			"label": "松北区",
			"value": "1424",
		}, {
			"label": "尚志市",
			"value": "1425",
		}, {
			"label": "双城市",
			"value": "1426",
		}, {
			"label": "五常市",
			"value": "1427",
		}, {
			"label": "方正县",
			"value": "1428",
		}, {
			"label": "宾县",
			"value": "1429",
		}, {
			"label": "依兰县",
			"value": "1430",
		}, {
			"label": "巴彦县",
			"value": "1431",
		}, {
			"label": "通河县",
			"value": "1432",
		}, {
			"label": "木兰县",
			"value": "1433",
		}, {
			"label": "延寿县",
			"value": "1434",
		}]
	}, {
		"label": "大庆市",
		"value": "168",
		"children": [{
			"label": "萨尔图区",
			"value": "1435",
		}, {
			"label": "红岗区",
			"value": "1436",
		}, {
			"label": "龙凤区",
			"value": "1437",
		}, {
			"label": "让胡路区",
			"value": "1438",
		}, {
			"label": "大同区",
			"value": "1439",
		}, {
			"label": "肇州县",
			"value": "1440",
		}, {
			"label": "肇源县",
			"value": "1441",
		}, {
			"label": "林甸县",
			"value": "1442",
		}, {
			"label": "杜尔伯特",
			"value": "1443",
		}]
	}, {
		"label": "大兴安岭市",
		"value": "169",
		"children": [{
			"label": "呼玛县",
			"value": "1444",
		}, {
			"label": "漠河县",
			"value": "1445",
		}, {
			"label": "塔河县",
			"value": "1446",
		}]
	}, {
		"label": "鹤岗市",
		"value": "170",
		"children": [{
			"label": "兴山区",
			"value": "1447",
		}, {
			"label": "工农区",
			"value": "1448",
		}, {
			"label": "南山区",
			"value": "1449",
		}, {
			"label": "兴安区",
			"value": "1450",
		}, {
			"label": "向阳区",
			"value": "1451",
		}, {
			"label": "东山区",
			"value": "1452",
		}, {
			"label": "萝北县",
			"value": "1453",
		}, {
			"label": "绥滨县",
			"value": "1454",
		}]
	}, {
		"label": "黑河市",
		"value": "171",
		"children": [{
			"label": "爱辉区",
			"value": "1455",
		}, {
			"label": "五大连池市",
			"value": "1456",
		}, {
			"label": "北安市",
			"value": "1457",
		}, {
			"label": "嫩江县",
			"value": "1458",
		}, {
			"label": "逊克县",
			"value": "1459",
		}, {
			"label": "孙吴县",
			"value": "1460",
		}]
	}, {
		"label": "鸡西市",
		"value": "172",
		"children": [{
			"label": "鸡冠区",
			"value": "1461",
		}, {
			"label": "恒山区",
			"value": "1462",
		}, {
			"label": "城子河区",
			"value": "1463",
		}, {
			"label": "滴道区",
			"value": "1464",
		}, {
			"label": "梨树区",
			"value": "1465",
		}, {
			"label": "虎林市",
			"value": "1466",
		}, {
			"label": "密山市",
			"value": "1467",
		}, {
			"label": "鸡东县",
			"value": "1468",
		}]
	}, {
		"label": "佳木斯市",
		"value": "173",
		"children": [{
			"label": "前进区",
			"value": "1469",
		}, {
			"label": "郊区",
			"value": "1470",
		}, {
			"label": "向阳区",
			"value": "1471",
		}, {
			"label": "东风区",
			"value": "1472",
		}, {
			"label": "同江市",
			"value": "1473",
		}, {
			"label": "富锦市",
			"value": "1474",
		}, {
			"label": "桦南县",
			"value": "1475",
		}, {
			"label": "桦川县",
			"value": "1476",
		}, {
			"label": "汤原县",
			"value": "1477",
		}, {
			"label": "抚远县",
			"value": "1478",
		}]
	}, {
		"label": "牡丹江市",
		"value": "174",
		"children": [{
			"label": "爱民区",
			"value": "1479",
		}, {
			"label": "东安区",
			"value": "1480",
		}, {
			"label": "阳明区",
			"value": "1481",
		}, {
			"label": "西安区",
			"value": "1482",
		}, {
			"label": "绥芬河市",
			"value": "1483",
		}, {
			"label": "海林市",
			"value": "1484",
		}, {
			"label": "宁安市",
			"value": "1485",
		}, {
			"label": "穆棱市",
			"value": "1486",
		}, {
			"label": "东宁县",
			"value": "1487",
		}, {
			"label": "林口县",
			"value": "1488",
		}]
	}, {
		"label": "七台河市",
		"value": "175",
		"children": [{
			"label": "桃山区",
			"value": "1489",
		}, {
			"label": "新兴区",
			"value": "1490",
		}, {
			"label": "茄子河区",
			"value": "1491",
		}, {
			"label": "勃利县",
			"value": "1492",
		}]
	}, {
		"label": "齐齐哈尔市",
		"value": "176",
		"children": [{
			"label": "龙沙区",
			"value": "1493",
		}, {
			"label": "昂昂溪区",
			"value": "1494",
		}, {
			"label": "铁峰区",
			"value": "1495",
		}, {
			"label": "建华区",
			"value": "1496",
		}, {
			"label": "富拉尔基区",
			"value": "1497",
		}, {
			"label": "碾子山区",
			"value": "1498",
		}, {
			"label": "梅里斯达斡尔区",
			"value": "1499",
		}, {
			"label": "讷河市",
			"value": "1500",
		}, {
			"label": "龙江县",
			"value": "1501",
		}, {
			"label": "依安县",
			"value": "1502",
		}, {
			"label": "泰来县",
			"value": "1503",
		}, {
			"label": "甘南县",
			"value": "1504",
		}, {
			"label": "富裕县",
			"value": "1505",
		}, {
			"label": "克山县",
			"value": "1506",
		}, {
			"label": "克东县",
			"value": "1507",
		}, {
			"label": "拜泉县",
			"value": "1508",
		}]
	}, {
		"label": "双鸭山市",
		"value": "177",
		"children": [{
			"label": "尖山区",
			"value": "1509",
		}, {
			"label": "岭东区",
			"value": "1510",
		}, {
			"label": "四方台区",
			"value": "1511",
		}, {
			"label": "宝山区",
			"value": "1512",
		}, {
			"label": "集贤县",
			"value": "1513",
		}, {
			"label": "友谊县",
			"value": "1514",
		}, {
			"label": "宝清县",
			"value": "1515",
		}, {
			"label": "饶河县",
			"value": "1516",
		}]
	}, {
		"label": "绥化市",
		"value": "178",
		"children": [{
			"label": "北林区",
			"value": "1517",
		}, {
			"label": "安达市",
			"value": "1518",
		}, {
			"label": "肇东市",
			"value": "1519",
		}, {
			"label": "海伦市",
			"value": "1520",
		}, {
			"label": "望奎县",
			"value": "1521",
		}, {
			"label": "兰西县",
			"value": "1522",
		}, {
			"label": "青冈县",
			"value": "1523",
		}, {
			"label": "庆安县",
			"value": "1524",
		}, {
			"label": "明水县",
			"value": "1525",
		}, {
			"label": "绥棱县",
			"value": "1526",
		}]
	}, {
		"label": "伊春市",
		"value": "179",
		"children": [{
			"label": "伊春区",
			"value": "1527",
		}, {
			"label": "带岭区",
			"value": "1528",
		}, {
			"label": "南岔区",
			"value": "1529",
		}, {
			"label": "金山屯区",
			"value": "1530",
		}, {
			"label": "西林区",
			"value": "1531",
		}, {
			"label": "美溪区",
			"value": "1532",
		}, {
			"label": "乌马河区",
			"value": "1533",
		}, {
			"label": "翠峦区",
			"value": "1534",
		}, {
			"label": "友好区",
			"value": "1535",
		}, {
			"label": "上甘岭区",
			"value": "1536",
		}, {
			"label": "五营区",
			"value": "1537",
		}, {
			"label": "红星区",
			"value": "1538",
		}, {
			"label": "新青区",
			"value": "1539",
		}, {
			"label": "汤旺河区",
			"value": "1540",
		}, {
			"label": "乌伊岭区",
			"value": "1541",
		}, {
			"label": "铁力市",
			"value": "1542",
		}, {
			"label": "嘉荫县",
			"value": "1543",
		}]
	}]
}, {
	"label": "湖北省",
	"value": "13",
	"children": [{
		"label": "武汉市",
		"value": "180",
		"children": [{
			"label": "江岸区",
			"value": "1544",
		}, {
			"label": "武昌区",
			"value": "1545",
		}, {
			"label": "江汉区",
			"value": "1546",
		}, {
			"label": "硚口区",
			"value": "1547",
		}, {
			"label": "汉阳区",
			"value": "1548",
		}, {
			"label": "青山区",
			"value": "1549",
		}, {
			"label": "洪山区",
			"value": "1550",
		}, {
			"label": "东西湖区",
			"value": "1551",
		}, {
			"label": "汉南区",
			"value": "1552",
		}, {
			"label": "蔡甸区",
			"value": "1553",
		}, {
			"label": "江夏区",
			"value": "1554",
		}, {
			"label": "黄陂区",
			"value": "1555",
		}, {
			"label": "新洲区",
			"value": "1556",
		}, {
			"label": "经济开发区",
			"value": "1557",
		}]
	}, {
		"label": "仙桃市",
		"value": "181",
		"children": [{
			"label": "仙桃市",
			"value": "1558",
		}]
	}, {
		"label": "鄂州市",
		"value": "182",
		"children": [{
			"label": "鄂城区",
			"value": "1559",
		}, {
			"label": "华容区",
			"value": "1560",
		}, {
			"label": "梁子湖区",
			"value": "1561",
		}]
	}, {
		"label": "黄冈市",
		"value": "183",
		"children": [{
			"label": "黄州区",
			"value": "1562",
		}, {
			"label": "麻城市",
			"value": "1563",
		}, {
			"label": "武穴市",
			"value": "1564",
		}, {
			"label": "团风县",
			"value": "1565",
		}, {
			"label": "红安县",
			"value": "1566",
		}, {
			"label": "罗田县",
			"value": "1567",
		}, {
			"label": "英山县",
			"value": "1568",
		}, {
			"label": "浠水县",
			"value": "1569",
		}, {
			"label": "蕲春县",
			"value": "1570",
		}, {
			"label": "黄梅县",
			"value": "1571",
		}]
	}, {
		"label": "黄石市",
		"value": "184",
		"children": [{
			"label": "黄石港区",
			"value": "1572",
		}, {
			"label": "西塞山区",
			"value": "1573",
		}, {
			"label": "下陆区",
			"value": "1574",
		}, {
			"label": "铁山区",
			"value": "1575",
		}, {
			"label": "大冶市",
			"value": "1576",
		}, {
			"label": "阳新县",
			"value": "1577",
		}]
	}, {
		"label": "荆门市",
		"value": "185",
		"children": [{
			"label": "东宝区",
			"value": "1578",
		}, {
			"label": "掇刀区",
			"value": "1579",
		}, {
			"label": "钟祥市",
			"value": "1580",
		}, {
			"label": "京山县",
			"value": "1581",
		}, {
			"label": "沙洋县",
			"value": "1582",
		}]
	}, {
		"label": "荆州市",
		"value": "186",
		"children": [{
			"label": "沙市区",
			"value": "1583",
		}, {
			"label": "荆州区",
			"value": "1584",
		}, {
			"label": "石首市",
			"value": "1585",
		}, {
			"label": "洪湖市",
			"value": "1586",
		}, {
			"label": "松滋市",
			"value": "1587",
		}, {
			"label": "公安县",
			"value": "1588",
		}, {
			"label": "监利县",
			"value": "1589",
		}, {
			"label": "江陵县",
			"value": "1590",
		}]
	}, {
		"label": "潜江市",
		"value": "187",
		"children": [{
			"label": "潜江市",
			"value": "1591",
		}]
	}, {
		"label": "神农架林区",
		"value": "188",
		"children": [{
			"label": "神农架林区",
			"value": "1592",
		}]
	}, {
		"label": "十堰市",
		"value": "189",
		"children": [{
			"label": "张湾区",
			"value": "1593",
		}, {
			"label": "茅箭区",
			"value": "1594",
		}, {
			"label": "丹江口市",
			"value": "1595",
		}, {
			"label": "郧县",
			"value": "1596",
		}, {
			"label": "郧西县",
			"value": "1597",
		}, {
			"label": "竹山县",
			"value": "1598",
		}, {
			"label": "竹溪县",
			"value": "1599",
		}, {
			"label": "房县",
			"value": "1600",
		}]
	}, {
		"label": "随州市",
		"value": "190",
		"children": [{
			"label": "曾都区",
			"value": "1601",
		}, {
			"label": "广水市",
			"value": "1602",
		}]
	}, {
		"label": "天门市",
		"value": "191",
		"children": [{
			"label": "天门市",
			"value": "1603",
		}]
	}, {
		"label": "咸宁市",
		"value": "192",
		"children": [{
			"label": "咸安区",
			"value": "1604",
		}, {
			"label": "赤壁市",
			"value": "1605",
		}, {
			"label": "嘉鱼县",
			"value": "1606",
		}, {
			"label": "通城县",
			"value": "1607",
		}, {
			"label": "崇阳县",
			"value": "1608",
		}, {
			"label": "通山县",
			"value": "1609",
		}]
	}, {
		"label": "襄樊市",
		"value": "193",
		"children": [{
			"label": "襄城区",
			"value": "1610",
		}, {
			"label": "樊城区",
			"value": "1611",
		}, {
			"label": "襄阳区",
			"value": "1612",
		}, {
			"label": "老河口市",
			"value": "1613",
		}, {
			"label": "枣阳市",
			"value": "1614",
		}, {
			"label": "宜城市",
			"value": "1615",
		}, {
			"label": "南漳县",
			"value": "1616",
		}, {
			"label": "谷城县",
			"value": "1617",
		}, {
			"label": "保康县",
			"value": "1618",
		}]
	}, {
		"label": "孝感市",
		"value": "194",
		"children": [{
			"label": "孝南区",
			"value": "1619",
		}, {
			"label": "应城市",
			"value": "1620",
		}, {
			"label": "安陆市",
			"value": "1621",
		}, {
			"label": "汉川市",
			"value": "1622",
		}, {
			"label": "孝昌县",
			"value": "1623",
		}, {
			"label": "大悟县",
			"value": "1624",
		}, {
			"label": "云梦县",
			"value": "1625",
		}]
	}, {
		"label": "宜昌市",
		"value": "195",
		"children": [{
			"label": "长阳",
			"value": "1626",
		}, {
			"label": "五峰",
			"value": "1627",
		}, {
			"label": "西陵区",
			"value": "1628",
		}, {
			"label": "伍家岗区",
			"value": "1629",
		}, {
			"label": "点军区",
			"value": "1630",
		}, {
			"label": "猇亭区",
			"value": "1631",
		}, {
			"label": "夷陵区",
			"value": "1632",
		}, {
			"label": "宜都市",
			"value": "1633",
		}, {
			"label": "当阳市",
			"value": "1634",
		}, {
			"label": "枝江市",
			"value": "1635",
		}, {
			"label": "远安县",
			"value": "1636",
		}, {
			"label": "兴山县",
			"value": "1637",
		}, {
			"label": "秭归县",
			"value": "1638",
		}]
	}, {
		"label": "恩施土家族苗族自治州",
		"value": "196",
		"children": [{
			"label": "恩施市",
			"value": "1639",
		}, {
			"label": "利川市",
			"value": "1640",
		}, {
			"label": "建始县",
			"value": "1641",
		}, {
			"label": "巴东县",
			"value": "1642",
		}, {
			"label": "宣恩县",
			"value": "1643",
		}, {
			"label": "咸丰县",
			"value": "1644",
		}, {
			"label": "来凤县",
			"value": "1645",
		}, {
			"label": "鹤峰县",
			"value": "1646",
		}]
	}]
}, {
	"label": "湖南省",
	"value": "14",
	"children": [{
		"label": "长沙市",
		"value": "197",
		"children": [{
			"label": "岳麓区",
			"value": "1647",
		}, {
			"label": "芙蓉区",
			"value": "1648",
		}, {
			"label": "天心区",
			"value": "1649",
		}, {
			"label": "开福区",
			"value": "1650",
		}, {
			"label": "雨花区",
			"value": "1651",
		}, {
			"label": "开发区",
			"value": "1652",
		}, {
			"label": "浏阳市",
			"value": "1653",
		}, {
			"label": "长沙县",
			"value": "1654",
		}, {
			"label": "望城县",
			"value": "1655",
		}, {
			"label": "宁乡县",
			"value": "1656",
		}]
	}, {
		"label": "张家界市",
		"value": "198",
		"children": [{
			"label": "永定区",
			"value": "1657",
		}, {
			"label": "武陵源区",
			"value": "1658",
		}, {
			"label": "慈利县",
			"value": "1659",
		}, {
			"label": "桑植县",
			"value": "1660",
		}]
	}, {
		"label": "常德市",
		"value": "199",
		"children": [{
			"label": "武陵区",
			"value": "1661",
		}, {
			"label": "鼎城区",
			"value": "1662",
		}, {
			"label": "津市市",
			"value": "1663",
		}, {
			"label": "安乡县",
			"value": "1664",
		}, {
			"label": "汉寿县",
			"value": "1665",
		}, {
			"label": "澧县",
			"value": "1666",
		}, {
			"label": "临澧县",
			"value": "1667",
		}, {
			"label": "桃源县",
			"value": "1668",
		}, {
			"label": "石门县",
			"value": "1669",
		}]
	}, {
		"label": "郴州市",
		"value": "200",
		"children": [{
			"label": "北湖区",
			"value": "1670",
		}, {
			"label": "苏仙区",
			"value": "1671",
		}, {
			"label": "资兴市",
			"value": "1672",
		}, {
			"label": "桂阳县",
			"value": "1673",
		}, {
			"label": "宜章县",
			"value": "1674",
		}, {
			"label": "永兴县",
			"value": "1675",
		}, {
			"label": "嘉禾县",
			"value": "1676",
		}, {
			"label": "临武县",
			"value": "1677",
		}, {
			"label": "汝城县",
			"value": "1678",
		}, {
			"label": "桂东县",
			"value": "1679",
		}, {
			"label": "安仁县",
			"value": "1680",
		}]
	}, {
		"label": "衡阳市",
		"value": "201",
		"children": [{
			"label": "雁峰区",
			"value": "1681",
		}, {
			"label": "珠晖区",
			"value": "1682",
		}, {
			"label": "石鼓区",
			"value": "1683",
		}, {
			"label": "蒸湘区",
			"value": "1684",
		}, {
			"label": "南岳区",
			"value": "1685",
		}, {
			"label": "耒阳市",
			"value": "1686",
		}, {
			"label": "常宁市",
			"value": "1687",
		}, {
			"label": "衡阳县",
			"value": "1688",
		}, {
			"label": "衡南县",
			"value": "1689",
		}, {
			"label": "衡山县",
			"value": "1690",
		}, {
			"label": "衡东县",
			"value": "1691",
		}, {
			"label": "祁东县",
			"value": "1692",
		}]
	}, {
		"label": "怀化市",
		"value": "202",
		"children": [{
			"label": "鹤城区",
			"value": "1693",
		}, {
			"label": "靖州",
			"value": "1694",
		}, {
			"label": "麻阳",
			"value": "1695",
		}, {
			"label": "通道",
			"value": "1696",
		}, {
			"label": "新晃",
			"value": "1697",
		}, {
			"label": "芷江",
			"value": "1698",
		}, {
			"label": "沅陵县",
			"value": "1699",
		}, {
			"label": "辰溪县",
			"value": "1700",
		}, {
			"label": "溆浦县",
			"value": "1701",
		}, {
			"label": "中方县",
			"value": "1702",
		}, {
			"label": "会同县",
			"value": "1703",
		}, {
			"label": "洪江市",
			"value": "1704",
		}]
	}, {
		"label": "娄底市",
		"value": "203",
		"children": [{
			"label": "娄星区",
			"value": "1705",
		}, {
			"label": "冷水江市",
			"value": "1706",
		}, {
			"label": "涟源市",
			"value": "1707",
		}, {
			"label": "双峰县",
			"value": "1708",
		}, {
			"label": "新化县",
			"value": "1709",
		}]
	}, {
		"label": "邵阳市",
		"value": "204",
		"children": [{
			"label": "城步",
			"value": "1710",
		}, {
			"label": "双清区",
			"value": "1711",
		}, {
			"label": "大祥区",
			"value": "1712",
		}, {
			"label": "北塔区",
			"value": "1713",
		}, {
			"label": "武冈市",
			"value": "1714",
		}, {
			"label": "邵东县",
			"value": "1715",
		}, {
			"label": "新邵县",
			"value": "1716",
		}, {
			"label": "邵阳县",
			"value": "1717",
		}, {
			"label": "隆回县",
			"value": "1718",
		}, {
			"label": "洞口县",
			"value": "1719",
		}, {
			"label": "绥宁县",
			"value": "1720",
		}, {
			"label": "新宁县",
			"value": "1721",
		}]
	}, {
		"label": "湘潭市",
		"value": "205",
		"children": [{
			"label": "岳塘区",
			"value": "1722",
		}, {
			"label": "雨湖区",
			"value": "1723",
		}, {
			"label": "湘乡市",
			"value": "1724",
		}, {
			"label": "韶山市",
			"value": "1725",
		}, {
			"label": "湘潭县",
			"value": "1726",
		}]
	}, {
		"label": "湘西土家族苗族自治州",
		"value": "206",
		"children": [{
			"label": "吉首市",
			"value": "1727",
		}, {
			"label": "泸溪县",
			"value": "1728",
		}, {
			"label": "凤凰县",
			"value": "1729",
		}, {
			"label": "花垣县",
			"value": "1730",
		}, {
			"label": "保靖县",
			"value": "1731",
		}, {
			"label": "古丈县",
			"value": "1732",
		}, {
			"label": "永顺县",
			"value": "1733",
		}, {
			"label": "龙山县",
			"value": "1734",
		}]
	}, {
		"label": "益阳市",
		"value": "207",
		"children": [{
			"label": "赫山区",
			"value": "1735",
		}, {
			"label": "资阳区",
			"value": "1736",
		}, {
			"label": "沅江市",
			"value": "1737",
		}, {
			"label": "南县",
			"value": "1738",
		}, {
			"label": "桃江县",
			"value": "1739",
		}, {
			"label": "安化县",
			"value": "1740",
		}]
	}, {
		"label": "永州市",
		"value": "208",
		"children": [{
			"label": "江华",
			"value": "1741",
		}, {
			"label": "冷水滩区",
			"value": "1742",
		}, {
			"label": "零陵区",
			"value": "1743",
		}, {
			"label": "祁阳县",
			"value": "1744",
		}, {
			"label": "东安县",
			"value": "1745",
		}, {
			"label": "双牌县",
			"value": "1746",
		}, {
			"label": "道县",
			"value": "1747",
		}, {
			"label": "江永县",
			"value": "1748",
		}, {
			"label": "宁远县",
			"value": "1749",
		}, {
			"label": "蓝山县",
			"value": "1750",
		}, {
			"label": "新田县",
			"value": "1751",
		}]
	}, {
		"label": "岳阳市",
		"value": "209",
		"children": [{
			"label": "岳阳楼区",
			"value": "1752",
		}, {
			"label": "君山区",
			"value": "1753",
		}, {
			"label": "云溪区",
			"value": "1754",
		}, {
			"label": "汨罗市",
			"value": "1755",
		}, {
			"label": "临湘市",
			"value": "1756",
		}, {
			"label": "岳阳县",
			"value": "1757",
		}, {
			"label": "华容县",
			"value": "1758",
		}, {
			"label": "湘阴县",
			"value": "1759",
		}, {
			"label": "平江县",
			"value": "1760",
		}]
	}, {
		"label": "株洲市",
		"value": "210",
		"children": [{
			"label": "天元区",
			"value": "1761",
		}, {
			"label": "荷塘区",
			"value": "1762",
		}, {
			"label": "芦淞区",
			"value": "1763",
		}, {
			"label": "石峰区",
			"value": "1764",
		}, {
			"label": "醴陵市",
			"value": "1765",
		}, {
			"label": "株洲县",
			"value": "1766",
		}, {
			"label": "攸县",
			"value": "1767",
		}, {
			"label": "茶陵县",
			"value": "1768",
		}, {
			"label": "炎陵县",
			"value": "1769",
		}]
	}]
}, {
	"label": "吉林省",
	"value": "15",
	"children": [{
		"label": "长春市",
		"value": "211",
		"children": [{
			"label": "朝阳区",
			"value": "1770",
		}, {
			"label": "宽城区",
			"value": "1771",
		}, {
			"label": "二道区",
			"value": "1772",
		}, {
			"label": "南关区",
			"value": "1773",
		}, {
			"label": "绿园区",
			"value": "1774",
		}, {
			"label": "双阳区",
			"value": "1775",
		}, {
			"label": "净月潭开发区",
			"value": "1776",
		}, {
			"label": "高新技术开发区",
			"value": "1777",
		}, {
			"label": "经济技术开发区",
			"value": "1778",
		}, {
			"label": "汽车产业开发区",
			"value": "1779",
		}, {
			"label": "德惠市",
			"value": "1780",
		}, {
			"label": "九台市",
			"value": "1781",
		}, {
			"label": "榆树市",
			"value": "1782",
		}, {
			"label": "农安县",
			"value": "1783",
		}]
	}, {
		"label": "吉林市",
		"value": "212",
		"children": [{
			"label": "船营区",
			"value": "1784",
		}, {
			"label": "昌邑区",
			"value": "1785",
		}, {
			"label": "龙潭区",
			"value": "1786",
		}, {
			"label": "丰满区",
			"value": "1787",
		}, {
			"label": "蛟河市",
			"value": "1788",
		}, {
			"label": "桦甸市",
			"value": "1789",
		}, {
			"label": "舒兰市",
			"value": "1790",
		}, {
			"label": "磐石市",
			"value": "1791",
		}, {
			"label": "永吉县",
			"value": "1792",
		}]
	}, {
		"label": "白城市",
		"value": "213",
		"children": [{
			"label": "洮北区",
			"value": "1793",
		}, {
			"label": "洮南市",
			"value": "1794",
		}, {
			"label": "大安市",
			"value": "1795",
		}, {
			"label": "镇赉县",
			"value": "1796",
		}, {
			"label": "通榆县",
			"value": "1797",
		}]
	}, {
		"label": "白山市",
		"value": "214",
		"children": [{
			"label": "江源区",
			"value": "1798",
		}, {
			"label": "八道江区",
			"value": "1799",
		}, {
			"label": "长白",
			"value": "1800",
		}, {
			"label": "临江市",
			"value": "1801",
		}, {
			"label": "抚松县",
			"value": "1802",
		}, {
			"label": "靖宇县",
			"value": "1803",
		}]
	}, {
		"label": "辽源市",
		"value": "215",
		"children": [{
			"label": "龙山区",
			"value": "1804",
		}, {
			"label": "西安区",
			"value": "1805",
		}, {
			"label": "东丰县",
			"value": "1806",
		}, {
			"label": "东辽县",
			"value": "1807",
		}]
	}, {
		"label": "四平市",
		"value": "216",
		"children": [{
			"label": "铁西区",
			"value": "1808",
		}, {
			"label": "铁东区",
			"value": "1809",
		}, {
			"label": "伊通",
			"value": "1810",
		}, {
			"label": "公主岭市",
			"value": "1811",
		}, {
			"label": "双辽市",
			"value": "1812",
		}, {
			"label": "梨树县",
			"value": "1813",
		}]
	}, {
		"label": "松原市",
		"value": "217",
		"children": [{
			"label": "前郭尔罗斯",
			"value": "1814",
		}, {
			"label": "宁江区",
			"value": "1815",
		}, {
			"label": "长岭县",
			"value": "1816",
		}, {
			"label": "乾安县",
			"value": "1817",
		}, {
			"label": "扶余县",
			"value": "1818",
		}]
	}, {
		"label": "通化市",
		"value": "218",
		"children": [{
			"label": "东昌区",
			"value": "1819",
		}, {
			"label": "二道江区",
			"value": "1820",
		}, {
			"label": "梅河口市",
			"value": "1821",
		}, {
			"label": "集安市",
			"value": "1822",
		}, {
			"label": "通化县",
			"value": "1823",
		}, {
			"label": "辉南县",
			"value": "1824",
		}, {
			"label": "柳河县",
			"value": "1825",
		}]
	}, {
		"label": "延边朝鲜族自治州",
		"value": "219",
		"children": [{
			"label": "延吉市",
			"value": "1826",
		}, {
			"label": "图们市",
			"value": "1827",
		}, {
			"label": "敦化市",
			"value": "1828",
		}, {
			"label": "珲春市",
			"value": "1829",
		}, {
			"label": "龙井市",
			"value": "1830",
		}, {
			"label": "和龙市",
			"value": "1831",
		}, {
			"label": "安图县",
			"value": "1832",
		}, {
			"label": "汪清县",
			"value": "1833",
		}]
	}]
}, {
	"label": "江苏省",
	"value": "16",
	"children": [{
		"label": "南京市",
		"value": "220",
		"children": [{
			"label": "玄武区",
			"value": "1834",
		}, {
			"label": "鼓楼区",
			"value": "1835",
		}, {
			"label": "白下区",
			"value": "1836",
		}, {
			"label": "建邺区",
			"value": "1837",
		}, {
			"label": "秦淮区",
			"value": "1838",
		}, {
			"label": "雨花台区",
			"value": "1839",
		}, {
			"label": "下关区",
			"value": "1840",
		}, {
			"label": "栖霞区",
			"value": "1841",
		}, {
			"label": "浦口区",
			"value": "1842",
		}, {
			"label": "江宁区",
			"value": "1843",
		}, {
			"label": "六合区",
			"value": "1844",
		}, {
			"label": "溧水县",
			"value": "1845",
		}, {
			"label": "高淳县",
			"value": "1846",
		}]
	}, {
		"label": "苏州市",
		"value": "221",
		"children": [{
			"label": "沧浪区",
			"value": "1847",
		}, {
			"label": "金阊区",
			"value": "1848",
		}, {
			"label": "平江区",
			"value": "1849",
		}, {
			"label": "虎丘区",
			"value": "1850",
		}, {
			"label": "吴中区",
			"value": "1851",
		}, {
			"label": "相城区",
			"value": "1852",
		}, {
			"label": "园区",
			"value": "1853",
		}, {
			"label": "新区",
			"value": "1854",
		}, {
			"label": "常熟市",
			"value": "1855",
		}, {
			"label": "张家港市",
			"value": "1856",
		}, {
			"label": "玉山镇",
			"value": "1857",
		}, {
			"label": "巴城镇",
			"value": "1858",
		}, {
			"label": "周市镇",
			"value": "1859",
		}, {
			"label": "陆家镇",
			"value": "1860",
		}, {
			"label": "花桥镇",
			"value": "1861",
		}, {
			"label": "淀山湖镇",
			"value": "1862",
		}, {
			"label": "张浦镇",
			"value": "1863",
		}, {
			"label": "周庄镇",
			"value": "1864",
		}, {
			"label": "千灯镇",
			"value": "1865",
		}, {
			"label": "锦溪镇",
			"value": "1866",
		}, {
			"label": "开发区",
			"value": "1867",
		}, {
			"label": "吴江市",
			"value": "1868",
		}, {
			"label": "太仓市",
			"value": "1869",
		}]
	}, {
		"label": "无锡市",
		"value": "222",
		"children": [{
			"label": "崇安区",
			"value": "1870",
		}, {
			"label": "北塘区",
			"value": "1871",
		}, {
			"label": "南长区",
			"value": "1872",
		}, {
			"label": "锡山区",
			"value": "1873",
		}, {
			"label": "惠山区",
			"value": "1874",
		}, {
			"label": "滨湖区",
			"value": "1875",
		}, {
			"label": "新区",
			"value": "1876",
		}, {
			"label": "江阴市",
			"value": "1877",
		}, {
			"label": "宜兴市",
			"value": "1878",
		}]
	}, {
		"label": "常州市",
		"value": "223",
		"children": [{
			"label": "天宁区",
			"value": "1879",
		}, {
			"label": "钟楼区",
			"value": "1880",
		}, {
			"label": "戚墅堰区",
			"value": "1881",
		}, {
			"label": "郊区",
			"value": "1882",
		}, {
			"label": "新北区",
			"value": "1883",
		}, {
			"label": "武进区",
			"value": "1884",
		}, {
			"label": "溧阳市",
			"value": "1885",
		}, {
			"label": "金坛市",
			"value": "1886",
		}]
	}, {
		"label": "淮安市",
		"value": "224",
		"children": [{
			"label": "清河区",
			"value": "1887",
		}, {
			"label": "清浦区",
			"value": "1888",
		}, {
			"label": "楚州区",
			"value": "1889",
		}, {
			"label": "淮阴区",
			"value": "1890",
		}, {
			"label": "涟水县",
			"value": "1891",
		}, {
			"label": "洪泽县",
			"value": "1892",
		}, {
			"label": "盱眙县",
			"value": "1893",
		}, {
			"label": "金湖县",
			"value": "1894",
		}]
	}, {
		"label": "连云港市",
		"value": "225",
		"children": [{
			"label": "新浦区",
			"value": "1895",
		}, {
			"label": "连云区",
			"value": "1896",
		}, {
			"label": "海州区",
			"value": "1897",
		}, {
			"label": "赣榆县",
			"value": "1898",
		}, {
			"label": "东海县",
			"value": "1899",
		}, {
			"label": "灌云县",
			"value": "1900",
		}, {
			"label": "灌南县",
			"value": "1901",
		}]
	}, {
		"label": "南通市",
		"value": "226",
		"children": [{
			"label": "崇川区",
			"value": "1902",
		}, {
			"label": "港闸区",
			"value": "1903",
		}, {
			"label": "经济开发区",
			"value": "1904",
		}, {
			"label": "启东市",
			"value": "1905",
		}, {
			"label": "如皋市",
			"value": "1906",
		}, {
			"label": "通州市",
			"value": "1907",
		}, {
			"label": "海门市",
			"value": "1908",
		}, {
			"label": "海安县",
			"value": "1909",
		}, {
			"label": "如东县",
			"value": "1910",
		}]
	}, {
		"label": "宿迁市",
		"value": "227",
		"children": [{
			"label": "宿城区",
			"value": "1911",
		}, {
			"label": "宿豫区",
			"value": "1912",
		}, {
			"label": "宿豫县",
			"value": "1913",
		}, {
			"label": "沭阳县",
			"value": "1914",
		}, {
			"label": "泗阳县",
			"value": "1915",
		}, {
			"label": "泗洪县",
			"value": "1916",
		}]
	}, {
		"label": "泰州市",
		"value": "228",
		"children": [{
			"label": "海陵区",
			"value": "1917",
		}, {
			"label": "高港区",
			"value": "1918",
		}, {
			"label": "兴化市",
			"value": "1919",
		}, {
			"label": "靖江市",
			"value": "1920",
		}, {
			"label": "泰兴市",
			"value": "1921",
		}, {
			"label": "姜堰市",
			"value": "1922",
		}]
	}, {
		"label": "徐州市",
		"value": "229",
		"children": [{
			"label": "云龙区",
			"value": "1923",
		}, {
			"label": "鼓楼区",
			"value": "1924",
		}, {
			"label": "九里区",
			"value": "1925",
		}, {
			"label": "贾汪区",
			"value": "1926",
		}, {
			"label": "泉山区",
			"value": "1927",
		}, {
			"label": "新沂市",
			"value": "1928",
		}, {
			"label": "邳州市",
			"value": "1929",
		}, {
			"label": "丰县",
			"value": "1930",
		}, {
			"label": "沛县",
			"value": "1931",
		}, {
			"label": "铜山县",
			"value": "1932",
		}, {
			"label": "睢宁县",
			"value": "1933",
		}]
	}, {
		"label": "盐城市",
		"value": "230",
		"children": [{
			"label": "城区",
			"value": "1934",
		}, {
			"label": "亭湖区",
			"value": "1935",
		}, {
			"label": "盐都区",
			"value": "1936",
		}, {
			"label": "盐都县",
			"value": "1937",
		}, {
			"label": "东台市",
			"value": "1938",
		}, {
			"label": "大丰市",
			"value": "1939",
		}, {
			"label": "响水县",
			"value": "1940",
		}, {
			"label": "滨海县",
			"value": "1941",
		}, {
			"label": "阜宁县",
			"value": "1942",
		}, {
			"label": "射阳县",
			"value": "1943",
		}, {
			"label": "建湖县",
			"value": "1944",
		}]
	}, {
		"label": "扬州市",
		"value": "231",
		"children": [{
			"label": "广陵区",
			"value": "1945",
		}, {
			"label": "维扬区",
			"value": "1946",
		}, {
			"label": "邗江区",
			"value": "1947",
		}, {
			"label": "仪征市",
			"value": "1948",
		}, {
			"label": "高邮市",
			"value": "1949",
		}, {
			"label": "江都市",
			"value": "1950",
		}, {
			"label": "宝应县",
			"value": "1951",
		}]
	}, {
		"label": "镇江市",
		"value": "232",
		"children": [{
			"label": "京口区",
			"value": "1952",
		}, {
			"label": "润州区",
			"value": "1953",
		}, {
			"label": "丹徒区",
			"value": "1954",
		}, {
			"label": "丹阳市",
			"value": "1955",
		}, {
			"label": "扬中市",
			"value": "1956",
		}, {
			"label": "句容市",
			"value": "1957",
		}]
	}]
}, {
	"label": "江西省",
	"value": "17",
	"children": [{
		"label": "南昌市",
		"value": "233",
		"children": [{
			"label": "东湖区",
			"value": "1958",
		}, {
			"label": "西湖区",
			"value": "1959",
		}, {
			"label": "青云谱区",
			"value": "1960",
		}, {
			"label": "湾里区",
			"value": "1961",
		}, {
			"label": "青山湖区",
			"value": "1962",
		}, {
			"label": "红谷滩新区",
			"value": "1963",
		}, {
			"label": "昌北区",
			"value": "1964",
		}, {
			"label": "高新区",
			"value": "1965",
		}, {
			"label": "南昌县",
			"value": "1966",
		}, {
			"label": "新建县",
			"value": "1967",
		}, {
			"label": "安义县",
			"value": "1968",
		}, {
			"label": "进贤县",
			"value": "1969",
		}]
	}, {
		"label": "抚州市",
		"value": "234",
		"children": [{
			"label": "临川区",
			"value": "1970",
		}, {
			"label": "南城县",
			"value": "1971",
		}, {
			"label": "黎川县",
			"value": "1972",
		}, {
			"label": "南丰县",
			"value": "1973",
		}, {
			"label": "崇仁县",
			"value": "1974",
		}, {
			"label": "乐安县",
			"value": "1975",
		}, {
			"label": "宜黄县",
			"value": "1976",
		}, {
			"label": "金溪县",
			"value": "1977",
		}, {
			"label": "资溪县",
			"value": "1978",
		}, {
			"label": "东乡县",
			"value": "1979",
		}, {
			"label": "广昌县",
			"value": "1980",
		}]
	}, {
		"label": "赣州市",
		"value": "235",
		"children": [{
			"label": "章贡区",
			"value": "1981",
		}, {
			"label": "于都县",
			"value": "1982",
		}, {
			"label": "瑞金市",
			"value": "1983",
		}, {
			"label": "南康市",
			"value": "1984",
		}, {
			"label": "赣县",
			"value": "1985",
		}, {
			"label": "信丰县",
			"value": "1986",
		}, {
			"label": "大余县",
			"value": "1987",
		}, {
			"label": "上犹县",
			"value": "1988",
		}, {
			"label": "崇义县",
			"value": "1989",
		}, {
			"label": "安远县",
			"value": "1990",
		}, {
			"label": "龙南县",
			"value": "1991",
		}, {
			"label": "定南县",
			"value": "1992",
		}, {
			"label": "全南县",
			"value": "1993",
		}, {
			"label": "宁都县",
			"value": "1994",
		}, {
			"label": "兴国县",
			"value": "1995",
		}, {
			"label": "会昌县",
			"value": "1996",
		}, {
			"label": "寻乌县",
			"value": "1997",
		}, {
			"label": "石城县",
			"value": "1998",
		}]
	}, {
		"label": "吉安市",
		"value": "236",
		"children": [{
			"label": "安福县",
			"value": "1999",
		}, {
			"label": "吉州区",
			"value": "2000",
		}, {
			"label": "青原区",
			"value": "2001",
		}, {
			"label": "井冈山市",
			"value": "2002",
		}, {
			"label": "吉安县",
			"value": "2003",
		}, {
			"label": "吉水县",
			"value": "2004",
		}, {
			"label": "峡江县",
			"value": "2005",
		}, {
			"label": "新干县",
			"value": "2006",
		}, {
			"label": "永丰县",
			"value": "2007",
		}, {
			"label": "泰和县",
			"value": "2008",
		}, {
			"label": "遂川县",
			"value": "2009",
		}, {
			"label": "万安县",
			"value": "2010",
		}, {
			"label": "永新县",
			"value": "2011",
		}]
	}, {
		"label": "景德镇市",
		"value": "237",
		"children": [{
			"label": "珠山区",
			"value": "2012",
		}, {
			"label": "昌江区",
			"value": "2013",
		}, {
			"label": "乐平市",
			"value": "2014",
		}, {
			"label": "浮梁县",
			"value": "2015",
		}]
	}, {
		"label": "九江市",
		"value": "238",
		"children": [{
			"label": "浔阳区",
			"value": "2016",
		}, {
			"label": "庐山区",
			"value": "2017",
		}, {
			"label": "瑞昌市",
			"value": "2018",
		}, {
			"label": "九江县",
			"value": "2019",
		}, {
			"label": "武宁县",
			"value": "2020",
		}, {
			"label": "修水县",
			"value": "2021",
		}, {
			"label": "永修县",
			"value": "2022",
		}, {
			"label": "德安县",
			"value": "2023",
		}, {
			"label": "星子县",
			"value": "2024",
		}, {
			"label": "都昌县",
			"value": "2025",
		}, {
			"label": "湖口县",
			"value": "2026",
		}, {
			"label": "彭泽县",
			"value": "2027",
		}]
	}, {
		"label": "萍乡市",
		"value": "239",
		"children": [{
			"label": "安源区",
			"value": "2028",
		}, {
			"label": "湘东区",
			"value": "2029",
		}, {
			"label": "莲花县",
			"value": "2030",
		}, {
			"label": "芦溪县",
			"value": "2031",
		}, {
			"label": "上栗县",
			"value": "2032",
		}]
	}, {
		"label": "上饶市",
		"value": "240",
		"children": [{
			"label": "信州区",
			"value": "2033",
		}, {
			"label": "德兴市",
			"value": "2034",
		}, {
			"label": "上饶县",
			"value": "2035",
		}, {
			"label": "广丰县",
			"value": "2036",
		}, {
			"label": "玉山县",
			"value": "2037",
		}, {
			"label": "铅山县",
			"value": "2038",
		}, {
			"label": "横峰县",
			"value": "2039",
		}, {
			"label": "弋阳县",
			"value": "2040",
		}, {
			"label": "余干县",
			"value": "2041",
		}, {
			"label": "波阳县",
			"value": "2042",
		}, {
			"label": "万年县",
			"value": "2043",
		}, {
			"label": "婺源县",
			"value": "2044",
		}]
	}, {
		"label": "新余市",
		"value": "241",
		"children": [{
			"label": "渝水区",
			"value": "2045",
		}, {
			"label": "分宜县",
			"value": "2046",
		}]
	}, {
		"label": "宜春市",
		"value": "242",
		"children": [{
			"label": "袁州区",
			"value": "2047",
		}, {
			"label": "丰城市",
			"value": "2048",
		}, {
			"label": "樟树市",
			"value": "2049",
		}, {
			"label": "高安市",
			"value": "2050",
		}, {
			"label": "奉新县",
			"value": "2051",
		}, {
			"label": "万载县",
			"value": "2052",
		}, {
			"label": "上高县",
			"value": "2053",
		}, {
			"label": "宜丰县",
			"value": "2054",
		}, {
			"label": "靖安县",
			"value": "2055",
		}, {
			"label": "铜鼓县",
			"value": "2056",
		}]
	}, {
		"label": "鹰潭市",
		"value": "243",
		"children": [{
			"label": "月湖区",
			"value": "2057",
		}, {
			"label": "贵溪市",
			"value": "2058",
		}, {
			"label": "余江县",
			"value": "2059",
		}]
	}]
}, {
	"label": "辽宁省",
	"value": "18",
	"children": [{
		"label": "沈阳市",
		"value": "244",
		"children": [{
			"label": "沈河区",
			"value": "2060",
		}, {
			"label": "皇姑区",
			"value": "2061",
		}, {
			"label": "和平区",
			"value": "2062",
		}, {
			"label": "大东区",
			"value": "2063",
		}, {
			"label": "铁西区",
			"value": "2064",
		}, {
			"label": "苏家屯区",
			"value": "2065",
		}, {
			"label": "东陵区",
			"value": "2066",
		}, {
			"label": "沈北新区",
			"value": "2067",
		}, {
			"label": "于洪区",
			"value": "2068",
		}, {
			"label": "浑南新区",
			"value": "2069",
		}, {
			"label": "新民市",
			"value": "2070",
		}, {
			"label": "辽中县",
			"value": "2071",
		}, {
			"label": "康平县",
			"value": "2072",
		}, {
			"label": "法库县",
			"value": "2073",
		}]
	}, {
		"label": "大连市",
		"value": "245",
		"children": [{
			"label": "西岗区",
			"value": "2074",
		}, {
			"label": "中山区",
			"value": "2075",
		}, {
			"label": "沙河口区",
			"value": "2076",
		}, {
			"label": "甘井子区",
			"value": "2077",
		}, {
			"label": "旅顺口区",
			"value": "2078",
		}, {
			"label": "金州区",
			"value": "2079",
		}, {
			"label": "开发区",
			"value": "2080",
		}, {
			"label": "瓦房店市",
			"value": "2081",
		}, {
			"label": "普兰店市",
			"value": "2082",
		}, {
			"label": "庄河市",
			"value": "2083",
		}, {
			"label": "长海县",
			"value": "2084",
		}]
	}, {
		"label": "鞍山市",
		"value": "246",
		"children": [{
			"label": "铁东区",
			"value": "2085",
		}, {
			"label": "铁西区",
			"value": "2086",
		}, {
			"label": "立山区",
			"value": "2087",
		}, {
			"label": "千山区",
			"value": "2088",
		}, {
			"label": "岫岩",
			"value": "2089",
		}, {
			"label": "海城市",
			"value": "2090",
		}, {
			"label": "台安县",
			"value": "2091",
		}]
	}, {
		"label": "本溪市",
		"value": "247",
		"children": [{
			"label": "本溪",
			"value": "2092",
		}, {
			"label": "平山区",
			"value": "2093",
		}, {
			"label": "明山区",
			"value": "2094",
		}, {
			"label": "溪湖区",
			"value": "2095",
		}, {
			"label": "南芬区",
			"value": "2096",
		}, {
			"label": "桓仁",
			"value": "2097",
		}]
	}, {
		"label": "朝阳市",
		"value": "248",
		"children": [{
			"label": "双塔区",
			"value": "2098",
		}, {
			"label": "龙城区",
			"value": "2099",
		}, {
			"label": "喀喇沁左翼蒙古族自治县",
			"value": "2100",
		}, {
			"label": "北票市",
			"value": "2101",
		}, {
			"label": "凌源市",
			"value": "2102",
		}, {
			"label": "朝阳县",
			"value": "2103",
		}, {
			"label": "建平县",
			"value": "2104",
		}]
	}, {
		"label": "丹东市",
		"value": "249",
		"children": [{
			"label": "振兴区",
			"value": "2105",
		}, {
			"label": "元宝区",
			"value": "2106",
		}, {
			"label": "振安区",
			"value": "2107",
		}, {
			"label": "宽甸",
			"value": "2108",
		}, {
			"label": "东港市",
			"value": "2109",
		}, {
			"label": "凤城市",
			"value": "2110",
		}]
	}, {
		"label": "抚顺市",
		"value": "250",
		"children": [{
			"label": "顺城区",
			"value": "2111",
		}, {
			"label": "新抚区",
			"value": "2112",
		}, {
			"label": "东洲区",
			"value": "2113",
		}, {
			"label": "望花区",
			"value": "2114",
		}, {
			"label": "清原",
			"value": "2115",
		}, {
			"label": "新宾",
			"value": "2116",
		}, {
			"label": "抚顺县",
			"value": "2117",
		}]
	}, {
		"label": "阜新市",
		"value": "251",
		"children": [{
			"label": "阜新",
			"value": "2118",
		}, {
			"label": "海州区",
			"value": "2119",
		}, {
			"label": "新邱区",
			"value": "2120",
		}, {
			"label": "太平区",
			"value": "2121",
		}, {
			"label": "清河门区",
			"value": "2122",
		}, {
			"label": "细河区",
			"value": "2123",
		}, {
			"label": "彰武县",
			"value": "2124",
		}]
	}, {
		"label": "葫芦岛市",
		"value": "252",
		"children": [{
			"label": "龙港区",
			"value": "2125",
		}, {
			"label": "南票区",
			"value": "2126",
		}, {
			"label": "连山区",
			"value": "2127",
		}, {
			"label": "兴城市",
			"value": "2128",
		}, {
			"label": "绥中县",
			"value": "2129",
		}, {
			"label": "建昌县",
			"value": "2130",
		}]
	}, {
		"label": "锦州市",
		"value": "253",
		"children": [{
			"label": "太和区",
			"value": "2131",
		}, {
			"label": "古塔区",
			"value": "2132",
		}, {
			"label": "凌河区",
			"value": "2133",
		}, {
			"label": "凌海市",
			"value": "2134",
		}, {
			"label": "北镇市",
			"value": "2135",
		}, {
			"label": "黑山县",
			"value": "2136",
		}, {
			"label": "义县",
			"value": "2137",
		}]
	}, {
		"label": "辽阳市",
		"value": "254",
		"children": [{
			"label": "白塔区",
			"value": "2138",
		}, {
			"label": "文圣区",
			"value": "2139",
		}, {
			"label": "宏伟区",
			"value": "2140",
		}, {
			"label": "太子河区",
			"value": "2141",
		}, {
			"label": "弓长岭区",
			"value": "2142",
		}, {
			"label": "灯塔市",
			"value": "2143",
		}, {
			"label": "辽阳县",
			"value": "2144",
		}]
	}, {
		"label": "盘锦市",
		"value": "255",
		"children": [{
			"label": "双台子区",
			"value": "2145",
		}, {
			"label": "兴隆台区",
			"value": "2146",
		}, {
			"label": "大洼县",
			"value": "2147",
		}, {
			"label": "盘山县",
			"value": "2148",
		}]
	}, {
		"label": "铁岭市",
		"value": "256",
		"children": [{
			"label": "银州区",
			"value": "2149",
		}, {
			"label": "清河区",
			"value": "2150",
		}, {
			"label": "调兵山市",
			"value": "2151",
		}, {
			"label": "开原市",
			"value": "2152",
		}, {
			"label": "铁岭县",
			"value": "2153",
		}, {
			"label": "西丰县",
			"value": "2154",
		}, {
			"label": "昌图县",
			"value": "2155",
		}]
	}, {
		"label": "营口市",
		"value": "257",
		"children": [{
			"label": "站前区",
			"value": "2156",
		}, {
			"label": "西市区",
			"value": "2157",
		}, {
			"label": "鲅鱼圈区",
			"value": "2158",
		}, {
			"label": "老边区",
			"value": "2159",
		}, {
			"label": "盖州市",
			"value": "2160",
		}, {
			"label": "大石桥市",
			"value": "2161",
		}]
	}]
}, {
	"label": "内蒙古自治区",
	"value": "19",
	"children": [{
		"label": "呼和浩特市",
		"value": "258",
		"children": [{
			"label": "回民区",
			"value": "2162",
		}, {
			"label": "玉泉区",
			"value": "2163",
		}, {
			"label": "新城区",
			"value": "2164",
		}, {
			"label": "赛罕区",
			"value": "2165",
		}, {
			"label": "清水河县",
			"value": "2166",
		}, {
			"label": "土默特左旗",
			"value": "2167",
		}, {
			"label": "托克托县",
			"value": "2168",
		}, {
			"label": "和林格尔县",
			"value": "2169",
		}, {
			"label": "武川县",
			"value": "2170",
		}]
	}, {
		"label": "阿拉善盟",
		"value": "259",
		"children": [{
			"label": "阿拉善左旗",
			"value": "2171",
		}, {
			"label": "阿拉善右旗",
			"value": "2172",
		}, {
			"label": "额济纳旗",
			"value": "2173",
		}]
	}, {
		"label": "巴彦淖尔市",
		"value": "260",
		"children": [{
			"label": "临河区",
			"value": "2174",
		}, {
			"label": "五原县",
			"value": "2175",
		}, {
			"label": "磴口县",
			"value": "2176",
		}, {
			"label": "乌拉特前旗",
			"value": "2177",
		}, {
			"label": "乌拉特中旗",
			"value": "2178",
		}, {
			"label": "乌拉特后旗",
			"value": "2179",
		}, {
			"label": "杭锦后旗",
			"value": "2180",
		}]
	}, {
		"label": "包头市",
		"value": "261",
		"children": [{
			"label": "昆都仑区",
			"value": "2181",
		}, {
			"label": "青山区",
			"value": "2182",
		}, {
			"label": "东河区",
			"value": "2183",
		}, {
			"label": "九原区",
			"value": "2184",
		}, {
			"label": "石拐区",
			"value": "2185",
		}, {
			"label": "白云矿区",
			"value": "2186",
		}, {
			"label": "土默特右旗",
			"value": "2187",
		}, {
			"label": "固阳县",
			"value": "2188",
		}, {
			"label": "达尔罕茂明安联合旗",
			"value": "2189",
		}]
	}, {
		"label": "赤峰市",
		"value": "262",
		"children": [{
			"label": "红山区",
			"value": "2190",
		}, {
			"label": "元宝山区",
			"value": "2191",
		}, {
			"label": "松山区",
			"value": "2192",
		}, {
			"label": "阿鲁科尔沁旗",
			"value": "2193",
		}, {
			"label": "巴林左旗",
			"value": "2194",
		}, {
			"label": "巴林右旗",
			"value": "2195",
		}, {
			"label": "林西县",
			"value": "2196",
		}, {
			"label": "克什克腾旗",
			"value": "2197",
		}, {
			"label": "翁牛特旗",
			"value": "2198",
		}, {
			"label": "喀喇沁旗",
			"value": "2199",
		}, {
			"label": "宁城县",
			"value": "2200",
		}, {
			"label": "敖汉旗",
			"value": "2201",
		}]
	}, {
		"label": "鄂尔多斯市",
		"value": "263",
		"children": [{
			"label": "东胜区",
			"value": "2202",
		}, {
			"label": "达拉特旗",
			"value": "2203",
		}, {
			"label": "准格尔旗",
			"value": "2204",
		}, {
			"label": "鄂托克前旗",
			"value": "2205",
		}, {
			"label": "鄂托克旗",
			"value": "2206",
		}, {
			"label": "杭锦旗",
			"value": "2207",
		}, {
			"label": "乌审旗",
			"value": "2208",
		}, {
			"label": "伊金霍洛旗",
			"value": "2209",
		}]
	}, {
		"label": "呼伦贝尔市",
		"value": "264",
		"children": [{
			"label": "海拉尔区",
			"value": "2210",
		}, {
			"label": "莫力达瓦",
			"value": "2211",
		}, {
			"label": "满洲里市",
			"value": "2212",
		}, {
			"label": "牙克石市",
			"value": "2213",
		}, {
			"label": "扎兰屯市",
			"value": "2214",
		}, {
			"label": "额尔古纳市",
			"value": "2215",
		}, {
			"label": "根河市",
			"value": "2216",
		}, {
			"label": "阿荣旗",
			"value": "2217",
		}, {
			"label": "鄂伦春自治旗",
			"value": "2218",
		}, {
			"label": "鄂温克族自治旗",
			"value": "2219",
		}, {
			"label": "陈巴尔虎旗",
			"value": "2220",
		}, {
			"label": "新巴尔虎左旗",
			"value": "2221",
		}, {
			"label": "新巴尔虎右旗",
			"value": "2222",
		}]
	}, {
		"label": "通辽市",
		"value": "265",
		"children": [{
			"label": "科尔沁区",
			"value": "2223",
		}, {
			"label": "霍林郭勒市",
			"value": "2224",
		}, {
			"label": "科尔沁左翼中旗",
			"value": "2225",
		}, {
			"label": "科尔沁左翼后旗",
			"value": "2226",
		}, {
			"label": "开鲁县",
			"value": "2227",
		}, {
			"label": "库伦旗",
			"value": "2228",
		}, {
			"label": "奈曼旗",
			"value": "2229",
		}, {
			"label": "扎鲁特旗",
			"value": "2230",
		}]
	}, {
		"label": "乌海市",
		"value": "266",
		"children": [{
			"label": "海勃湾区",
			"value": "2231",
		}, {
			"label": "乌达区",
			"value": "2232",
		}, {
			"label": "海南区",
			"value": "2233",
		}]
	}, {
		"label": "乌兰察布市市",
		"value": "267",
		"children": [{
			"label": "化德县",
			"value": "2234",
		}, {
			"label": "集宁区",
			"value": "2235",
		}, {
			"label": "丰镇市",
			"value": "2236",
		}, {
			"label": "卓资县",
			"value": "2237",
		}, {
			"label": "商都县",
			"value": "2238",
		}, {
			"label": "兴和县",
			"value": "2239",
		}, {
			"label": "凉城县",
			"value": "2240",
		}, {
			"label": "察哈尔右翼前旗",
			"value": "2241",
		}, {
			"label": "察哈尔右翼中旗",
			"value": "2242",
		}, {
			"label": "察哈尔右翼后旗",
			"value": "2243",
		}, {
			"label": "四子王旗",
			"value": "2244",
		}]
	}, {
		"label": "锡林郭勒盟",
		"value": "268",
		"children": [{
			"label": "二连浩特市",
			"value": "2245",
		}, {
			"label": "锡林浩特市",
			"value": "2246",
		}, {
			"label": "阿巴嘎旗",
			"value": "2247",
		}, {
			"label": "苏尼特左旗",
			"value": "2248",
		}, {
			"label": "苏尼特右旗",
			"value": "2249",
		}, {
			"label": "东乌珠穆沁旗",
			"value": "2250",
		}, {
			"label": "西乌珠穆沁旗",
			"value": "2251",
		}, {
			"label": "太仆寺旗",
			"value": "2252",
		}, {
			"label": "镶黄旗",
			"value": "2253",
		}, {
			"label": "正镶白旗",
			"value": "2254",
		}, {
			"label": "正蓝旗",
			"value": "2255",
		}, {
			"label": "多伦县",
			"value": "2256",
		}]
	}, {
		"label": "兴安盟",
		"value": "269",
		"children": [{
			"label": "乌兰浩特市",
			"value": "2257",
		}, {
			"label": "阿尔山市",
			"value": "2258",
		}, {
			"label": "科尔沁右翼前旗",
			"value": "2259",
		}, {
			"label": "科尔沁右翼中旗",
			"value": "2260",
		}, {
			"label": "扎赉特旗",
			"value": "2261",
		}, {
			"label": "突泉县",
			"value": "2262",
		}]
	}]
}, {
	"label": "宁夏回族自治区",
	"value": "20",
	"children": [{
		"label": "银川市",
		"value": "270",
		"children": [{
			"label": "西夏区",
			"value": "2263",
		}, {
			"label": "金凤区",
			"value": "2264",
		}, {
			"label": "兴庆区",
			"value": "2265",
		}, {
			"label": "灵武市",
			"value": "2266",
		}, {
			"label": "永宁县",
			"value": "2267",
		}, {
			"label": "贺兰县",
			"value": "2268",
		}]
	}, {
		"label": "固原市",
		"value": "271",
		"children": [{
			"label": "原州区",
			"value": "2269",
		}, {
			"label": "海原县",
			"value": "2270",
		}, {
			"label": "西吉县",
			"value": "2271",
		}, {
			"label": "隆德县",
			"value": "2272",
		}, {
			"label": "泾源县",
			"value": "2273",
		}, {
			"label": "彭阳县",
			"value": "2274",
		}]
	}, {
		"label": "石嘴山市",
		"value": "272",
		"children": [{
			"label": "惠农县",
			"value": "2275",
		}, {
			"label": "大武口区",
			"value": "2276",
		}, {
			"label": "惠农区",
			"value": "2277",
		}, {
			"label": "陶乐县",
			"value": "2278",
		}, {
			"label": "平罗县",
			"value": "2279",
		}]
	}, {
		"label": "吴忠市",
		"value": "273",
		"children": [{
			"label": "利通区",
			"value": "2280",
		}, {
			"label": "中卫县",
			"value": "2281",
		}, {
			"label": "青铜峡市",
			"value": "2282",
		}, {
			"label": "中宁县",
			"value": "2283",
		}, {
			"label": "盐池县",
			"value": "2284",
		}, {
			"label": "同心县",
			"value": "2285",
		}]
	}, {
		"label": "中卫市",
		"value": "274",
		"children": [{
			"label": "沙坡头区",
			"value": "2286",
		}, {
			"label": "海原县",
			"value": "2287",
		}, {
			"label": "中宁县",
			"value": "2288",
		}]
	}]
}, {
	"label": "青海省",
	"value": "21",
	"children": [{
		"label": "西宁市",
		"value": "275",
		"children": [{
			"label": "城中区",
			"value": "2289",
		}, {
			"label": "城东区",
			"value": "2290",
		}, {
			"label": "城西区",
			"value": "2291",
		}, {
			"label": "城北区",
			"value": "2292",
		}, {
			"label": "湟中县",
			"value": "2293",
		}, {
			"label": "湟源县",
			"value": "2294",
		}, {
			"label": "大通",
			"value": "2295",
		}]
	}, {
		"label": "果洛藏族自治州",
		"value": "276",
		"children": [{
			"label": "玛沁县",
			"value": "2296",
		}, {
			"label": "班玛县",
			"value": "2297",
		}, {
			"label": "甘德县",
			"value": "2298",
		}, {
			"label": "达日县",
			"value": "2299",
		}, {
			"label": "久治县",
			"value": "2300",
		}, {
			"label": "玛多县",
			"value": "2301",
		}]
	}, {
		"label": "海北藏族自治州",
		"value": "277",
		"children": [{
			"label": "海晏县",
			"value": "2302",
		}, {
			"label": "祁连县",
			"value": "2303",
		}, {
			"label": "刚察县",
			"value": "2304",
		}, {
			"label": "门源",
			"value": "2305",
		}]
	}, {
		"label": "海东市",
		"value": "278",
		"children": [{
			"label": "平安县",
			"value": "2306",
		}, {
			"label": "乐都县",
			"value": "2307",
		}, {
			"label": "民和",
			"value": "2308",
		}, {
			"label": "互助",
			"value": "2309",
		}, {
			"label": "化隆",
			"value": "2310",
		}, {
			"label": "循化",
			"value": "2311",
		}]
	}, {
		"label": "海南藏族自治州",
		"value": "279",
		"children": [{
			"label": "共和县",
			"value": "2312",
		}, {
			"label": "同德县",
			"value": "2313",
		}, {
			"label": "贵德县",
			"value": "2314",
		}, {
			"label": "兴海县",
			"value": "2315",
		}, {
			"label": "贵南县",
			"value": "2316",
		}]
	}, {
		"label": "海西蒙古族藏族自治州",
		"value": "280",
		"children": [{
			"label": "德令哈市",
			"value": "2317",
		}, {
			"label": "格尔木市",
			"value": "2318",
		}, {
			"label": "乌兰县",
			"value": "2319",
		}, {
			"label": "都兰县",
			"value": "2320",
		}, {
			"label": "天峻县",
			"value": "2321",
		}]
	}, {
		"label": "黄南藏族自治州",
		"value": "281",
		"children": [{
			"label": "同仁县",
			"value": "2322",
		}, {
			"label": "尖扎县",
			"value": "2323",
		}, {
			"label": "泽库县",
			"value": "2324",
		}, {
			"label": "河南蒙古族自治县",
			"value": "2325",
		}]
	}, {
		"label": "玉树藏族自治州",
		"value": "282",
		"children": [{
			"label": "玉树县",
			"value": "2326",
		}, {
			"label": "杂多县",
			"value": "2327",
		}, {
			"label": "称多县",
			"value": "2328",
		}, {
			"label": "治多县",
			"value": "2329",
		}, {
			"label": "囊谦县",
			"value": "2330",
		}, {
			"label": "曲麻莱县",
			"value": "2331",
		}]
	}]
}, {
	"label": "山东省",
	"value": "22",
	"children": [{
		"label": "济南市",
		"value": "283",
		"children": [{
			"label": "市中区",
			"value": "2332",
		}, {
			"label": "历下区",
			"value": "2333",
		}, {
			"label": "天桥区",
			"value": "2334",
		}, {
			"label": "槐荫区",
			"value": "2335",
		}, {
			"label": "历城区",
			"value": "2336",
		}, {
			"label": "长清区",
			"value": "2337",
		}, {
			"label": "章丘市",
			"value": "2338",
		}, {
			"label": "平阴县",
			"value": "2339",
		}, {
			"label": "济阳县",
			"value": "2340",
		}, {
			"label": "商河县",
			"value": "2341",
		}]
	}, {
		"label": "青岛市",
		"value": "284",
		"children": [{
			"label": "市南区",
			"value": "2342",
		}, {
			"label": "市北区",
			"value": "2343",
		}, {
			"label": "城阳区",
			"value": "2344",
		}, {
			"label": "四方区",
			"value": "2345",
		}, {
			"label": "李沧区",
			"value": "2346",
		}, {
			"label": "黄岛区",
			"value": "2347",
		}, {
			"label": "崂山区",
			"value": "2348",
		}, {
			"label": "胶州市",
			"value": "2349",
		}, {
			"label": "即墨市",
			"value": "2350",
		}, {
			"label": "平度市",
			"value": "2351",
		}, {
			"label": "胶南市",
			"value": "2352",
		}, {
			"label": "莱西市",
			"value": "2353",
		}]
	}, {
		"label": "滨州市",
		"value": "285",
		"children": [{
			"label": "滨城区",
			"value": "2354",
		}, {
			"label": "惠民县",
			"value": "2355",
		}, {
			"label": "阳信县",
			"value": "2356",
		}, {
			"label": "无棣县",
			"value": "2357",
		}, {
			"label": "沾化县",
			"value": "2358",
		}, {
			"label": "博兴县",
			"value": "2359",
		}, {
			"label": "邹平县",
			"value": "2360",
		}]
	}, {
		"label": "德州市",
		"value": "286",
		"children": [{
			"label": "德城区",
			"value": "2361",
		}, {
			"label": "陵县",
			"value": "2362",
		}, {
			"label": "乐陵市",
			"value": "2363",
		}, {
			"label": "禹城市",
			"value": "2364",
		}, {
			"label": "宁津县",
			"value": "2365",
		}, {
			"label": "庆云县",
			"value": "2366",
		}, {
			"label": "临邑县",
			"value": "2367",
		}, {
			"label": "齐河县",
			"value": "2368",
		}, {
			"label": "平原县",
			"value": "2369",
		}, {
			"label": "夏津县",
			"value": "2370",
		}, {
			"label": "武城县",
			"value": "2371",
		}]
	}, {
		"label": "东营市",
		"value": "287",
		"children": [{
			"label": "东营区",
			"value": "2372",
		}, {
			"label": "河口区",
			"value": "2373",
		}, {
			"label": "垦利县",
			"value": "2374",
		}, {
			"label": "利津县",
			"value": "2375",
		}, {
			"label": "广饶县",
			"value": "2376",
		}]
	}, {
		"label": "菏泽市",
		"value": "288",
		"children": [{
			"label": "牡丹区",
			"value": "2377",
		}, {
			"label": "曹县",
			"value": "2378",
		}, {
			"label": "单县",
			"value": "2379",
		}, {
			"label": "成武县",
			"value": "2380",
		}, {
			"label": "巨野县",
			"value": "2381",
		}, {
			"label": "郓城县",
			"value": "2382",
		}, {
			"label": "鄄城县",
			"value": "2383",
		}, {
			"label": "定陶县",
			"value": "2384",
		}, {
			"label": "东明县",
			"value": "2385",
		}]
	}, {
		"label": "济宁市",
		"value": "289",
		"children": [{
			"label": "市中区",
			"value": "2386",
		}, {
			"label": "任城区",
			"value": "2387",
		}, {
			"label": "曲阜市",
			"value": "2388",
		}, {
			"label": "兖州市",
			"value": "2389",
		}, {
			"label": "邹城市",
			"value": "2390",
		}, {
			"label": "微山县",
			"value": "2391",
		}, {
			"label": "鱼台县",
			"value": "2392",
		}, {
			"label": "金乡县",
			"value": "2393",
		}, {
			"label": "嘉祥县",
			"value": "2394",
		}, {
			"label": "汶上县",
			"value": "2395",
		}, {
			"label": "泗水县",
			"value": "2396",
		}, {
			"label": "梁山县",
			"value": "2397",
		}]
	}, {
		"label": "莱芜市",
		"value": "290",
		"children": [{
			"label": "莱城区",
			"value": "2398",
		}, {
			"label": "钢城区",
			"value": "2399",
		}]
	}, {
		"label": "聊城市",
		"value": "291",
		"children": [{
			"label": "东昌府区",
			"value": "2400",
		}, {
			"label": "临清市",
			"value": "2401",
		}, {
			"label": "阳谷县",
			"value": "2402",
		}, {
			"label": "莘县",
			"value": "2403",
		}, {
			"label": "茌平县",
			"value": "2404",
		}, {
			"label": "东阿县",
			"value": "2405",
		}, {
			"label": "冠县",
			"value": "2406",
		}, {
			"label": "高唐县",
			"value": "2407",
		}]
	}, {
		"label": "临沂市",
		"value": "292",
		"children": [{
			"label": "兰山区",
			"value": "2408",
		}, {
			"label": "罗庄区",
			"value": "2409",
		}, {
			"label": "河东区",
			"value": "2410",
		}, {
			"label": "沂南县",
			"value": "2411",
		}, {
			"label": "郯城县",
			"value": "2412",
		}, {
			"label": "沂水县",
			"value": "2413",
		}, {
			"label": "苍山县",
			"value": "2414",
		}, {
			"label": "费县",
			"value": "2415",
		}, {
			"label": "平邑县",
			"value": "2416",
		}, {
			"label": "莒南县",
			"value": "2417",
		}, {
			"label": "蒙阴县",
			"value": "2418",
		}, {
			"label": "临沭县",
			"value": "2419",
		}]
	}, {
		"label": "日照市",
		"value": "293",
		"children": [{
			"label": "东港区",
			"value": "2420",
		}, {
			"label": "岚山区",
			"value": "2421",
		}, {
			"label": "五莲县",
			"value": "2422",
		}, {
			"label": "莒县",
			"value": "2423",
		}]
	}, {
		"label": "泰安市",
		"value": "294",
		"children": [{
			"label": "泰山区",
			"value": "2424",
		}, {
			"label": "岱岳区",
			"value": "2425",
		}, {
			"label": "新泰市",
			"value": "2426",
		}, {
			"label": "肥城市",
			"value": "2427",
		}, {
			"label": "宁阳县",
			"value": "2428",
		}, {
			"label": "东平县",
			"value": "2429",
		}]
	}, {
		"label": "威海市",
		"value": "295",
		"children": [{
			"label": "荣成市",
			"value": "2430",
		}, {
			"label": "乳山市",
			"value": "2431",
		}, {
			"label": "环翠区",
			"value": "2432",
		}, {
			"label": "文登市",
			"value": "2433",
		}]
	}, {
		"label": "潍坊市",
		"value": "296",
		"children": [{
			"label": "潍城区",
			"value": "2434",
		}, {
			"label": "寒亭区",
			"value": "2435",
		}, {
			"label": "坊子区",
			"value": "2436",
		}, {
			"label": "奎文区",
			"value": "2437",
		}, {
			"label": "青州市",
			"value": "2438",
		}, {
			"label": "诸城市",
			"value": "2439",
		}, {
			"label": "寿光市",
			"value": "2440",
		}, {
			"label": "安丘市",
			"value": "2441",
		}, {
			"label": "高密市",
			"value": "2442",
		}, {
			"label": "昌邑市",
			"value": "2443",
		}, {
			"label": "临朐县",
			"value": "2444",
		}, {
			"label": "昌乐县",
			"value": "2445",
		}]
	}, {
		"label": "烟台市",
		"value": "297",
		"children": [{
			"label": "芝罘区",
			"value": "2446",
		}, {
			"label": "福山区",
			"value": "2447",
		}, {
			"label": "牟平区",
			"value": "2448",
		}, {
			"label": "莱山区",
			"value": "2449",
		}, {
			"label": "开发区",
			"value": "2450",
		}, {
			"label": "龙口市",
			"value": "2451",
		}, {
			"label": "莱阳市",
			"value": "2452",
		}, {
			"label": "莱州市",
			"value": "2453",
		}, {
			"label": "蓬莱市",
			"value": "2454",
		}, {
			"label": "招远市",
			"value": "2455",
		}, {
			"label": "栖霞市",
			"value": "2456",
		}, {
			"label": "海阳市",
			"value": "2457",
		}, {
			"label": "长岛县",
			"value": "2458",
		}]
	}, {
		"label": "枣庄市",
		"value": "298",
		"children": [{
			"label": "市中区",
			"value": "2459",
		}, {
			"label": "山亭区",
			"value": "2460",
		}, {
			"label": "峄城区",
			"value": "2461",
		}, {
			"label": "台儿庄区",
			"value": "2462",
		}, {
			"label": "薛城区",
			"value": "2463",
		}, {
			"label": "滕州市",
			"value": "2464",
		}]
	}, {
		"label": "淄博市",
		"value": "299",
		"children": [{
			"label": "张店区",
			"value": "2465",
		}, {
			"label": "临淄区",
			"value": "2466",
		}, {
			"label": "淄川区",
			"value": "2467",
		}, {
			"label": "博山区",
			"value": "2468",
		}, {
			"label": "周村区",
			"value": "2469",
		}, {
			"label": "桓台县",
			"value": "2470",
		}, {
			"label": "高青县",
			"value": "2471",
		}, {
			"label": "沂源县",
			"value": "2472",
		}]
	}]
}, {
	"label": "山西省",
	"value": "23",
	"children": [{
		"label": "太原市",
		"value": "300",
		"children": [{
			"label": "杏花岭区",
			"value": "2473",
		}, {
			"label": "小店区",
			"value": "2474",
		}, {
			"label": "迎泽区",
			"value": "2475",
		}, {
			"label": "尖草坪区",
			"value": "2476",
		}, {
			"label": "万柏林区",
			"value": "2477",
		}, {
			"label": "晋源区",
			"value": "2478",
		}, {
			"label": "高新开发区",
			"value": "2479",
		}, {
			"label": "民营经济开发区",
			"value": "2480",
		}, {
			"label": "经济技术开发区",
			"value": "2481",
		}, {
			"label": "清徐县",
			"value": "2482",
		}, {
			"label": "阳曲县",
			"value": "2483",
		}, {
			"label": "娄烦县",
			"value": "2484",
		}, {
			"label": "古交市",
			"value": "2485",
		}]
	}, {
		"label": "长治市",
		"value": "301",
		"children": [{
			"label": "城区",
			"value": "2486",
		}, {
			"label": "郊区",
			"value": "2487",
		}, {
			"label": "沁县",
			"value": "2488",
		}, {
			"label": "潞城市",
			"value": "2489",
		}, {
			"label": "长治县",
			"value": "2490",
		}, {
			"label": "襄垣县",
			"value": "2491",
		}, {
			"label": "屯留县",
			"value": "2492",
		}, {
			"label": "平顺县",
			"value": "2493",
		}, {
			"label": "黎城县",
			"value": "2494",
		}, {
			"label": "壶关县",
			"value": "2495",
		}, {
			"label": "长子县",
			"value": "2496",
		}, {
			"label": "武乡县",
			"value": "2497",
		}, {
			"label": "沁源县",
			"value": "2498",
		}]
	}, {
		"label": "大同市",
		"value": "302",
		"children": [{
			"label": "城区",
			"value": "2499",
		}, {
			"label": "矿区",
			"value": "2500",
		}, {
			"label": "南郊区",
			"value": "2501",
		}, {
			"label": "新荣区",
			"value": "2502",
		}, {
			"label": "阳高县",
			"value": "2503",
		}, {
			"label": "天镇县",
			"value": "2504",
		}, {
			"label": "广灵县",
			"value": "2505",
		}, {
			"label": "灵丘县",
			"value": "2506",
		}, {
			"label": "浑源县",
			"value": "2507",
		}, {
			"label": "左云县",
			"value": "2508",
		}, {
			"label": "大同县",
			"value": "2509",
		}]
	}, {
		"label": "晋城市",
		"value": "303",
		"children": [{
			"label": "城区",
			"value": "2510",
		}, {
			"label": "高平市",
			"value": "2511",
		}, {
			"label": "沁水县",
			"value": "2512",
		}, {
			"label": "阳城县",
			"value": "2513",
		}, {
			"label": "陵川县",
			"value": "2514",
		}, {
			"label": "泽州县",
			"value": "2515",
		}]
	}, {
		"label": "晋中市",
		"value": "304",
		"children": [{
			"label": "榆次区",
			"value": "2516",
		}, {
			"label": "介休市",
			"value": "2517",
		}, {
			"label": "榆社县",
			"value": "2518",
		}, {
			"label": "左权县",
			"value": "2519",
		}, {
			"label": "和顺县",
			"value": "2520",
		}, {
			"label": "昔阳县",
			"value": "2521",
		}, {
			"label": "寿阳县",
			"value": "2522",
		}, {
			"label": "太谷县",
			"value": "2523",
		}, {
			"label": "祁县",
			"value": "2524",
		}, {
			"label": "平遥县",
			"value": "2525",
		}, {
			"label": "灵石县",
			"value": "2526",
		}]
	}, {
		"label": "临汾市",
		"value": "305",
		"children": [{
			"label": "尧都区",
			"value": "2527",
		}, {
			"label": "侯马市",
			"value": "2528",
		}, {
			"label": "霍州市",
			"value": "2529",
		}, {
			"label": "曲沃县",
			"value": "2530",
		}, {
			"label": "翼城县",
			"value": "2531",
		}, {
			"label": "襄汾县",
			"value": "2532",
		}, {
			"label": "洪洞县",
			"value": "2533",
		}, {
			"label": "吉县",
			"value": "2534",
		}, {
			"label": "安泽县",
			"value": "2535",
		}, {
			"label": "浮山县",
			"value": "2536",
		}, {
			"label": "古县",
			"value": "2537",
		}, {
			"label": "乡宁县",
			"value": "2538",
		}, {
			"label": "大宁县",
			"value": "2539",
		}, {
			"label": "隰县",
			"value": "2540",
		}, {
			"label": "永和县",
			"value": "2541",
		}, {
			"label": "蒲县",
			"value": "2542",
		}, {
			"label": "汾西县",
			"value": "2543",
		}]
	}, {
		"label": "吕梁市",
		"value": "306",
		"children": [{
			"label": "离石市",
			"value": "2544",
		}, {
			"label": "离石区",
			"value": "2545",
		}, {
			"label": "孝义市",
			"value": "2546",
		}, {
			"label": "汾阳市",
			"value": "2547",
		}, {
			"label": "文水县",
			"value": "2548",
		}, {
			"label": "交城县",
			"value": "2549",
		}, {
			"label": "兴县",
			"value": "2550",
		}, {
			"label": "临县",
			"value": "2551",
		}, {
			"label": "柳林县",
			"value": "2552",
		}, {
			"label": "石楼县",
			"value": "2553",
		}, {
			"label": "岚县",
			"value": "2554",
		}, {
			"label": "方山县",
			"value": "2555",
		}, {
			"label": "中阳县",
			"value": "2556",
		}, {
			"label": "交口县",
			"value": "2557",
		}]
	}, {
		"label": "朔州市",
		"value": "307",
		"children": [{
			"label": "朔城区",
			"value": "2558",
		}, {
			"label": "平鲁区",
			"value": "2559",
		}, {
			"label": "山阴县",
			"value": "2560",
		}, {
			"label": "应县",
			"value": "2561",
		}, {
			"label": "右玉县",
			"value": "2562",
		}, {
			"label": "怀仁县",
			"value": "2563",
		}]
	}, {
		"label": "忻州市",
		"value": "308",
		"children": [{
			"label": "忻府区",
			"value": "2564",
		}, {
			"label": "原平市",
			"value": "2565",
		}, {
			"label": "定襄县",
			"value": "2566",
		}, {
			"label": "五台县",
			"value": "2567",
		}, {
			"label": "代县",
			"value": "2568",
		}, {
			"label": "繁峙县",
			"value": "2569",
		}, {
			"label": "宁武县",
			"value": "2570",
		}, {
			"label": "静乐县",
			"value": "2571",
		}, {
			"label": "神池县",
			"value": "2572",
		}, {
			"label": "五寨县",
			"value": "2573",
		}, {
			"label": "岢岚县",
			"value": "2574",
		}, {
			"label": "河曲县",
			"value": "2575",
		}, {
			"label": "保德县",
			"value": "2576",
		}, {
			"label": "偏关县",
			"value": "2577",
		}]
	}, {
		"label": "阳泉市",
		"value": "309",
		"children": [{
			"label": "城区",
			"value": "2578",
		}, {
			"label": "矿区",
			"value": "2579",
		}, {
			"label": "郊区",
			"value": "2580",
		}, {
			"label": "平定县",
			"value": "2581",
		}, {
			"label": "盂县",
			"value": "2582",
		}]
	}, {
		"label": "运城市",
		"value": "310",
		"children": [{
			"label": "盐湖区",
			"value": "2583",
		}, {
			"label": "永济市",
			"value": "2584",
		}, {
			"label": "河津市",
			"value": "2585",
		}, {
			"label": "临猗县",
			"value": "2586",
		}, {
			"label": "万荣县",
			"value": "2587",
		}, {
			"label": "闻喜县",
			"value": "2588",
		}, {
			"label": "稷山县",
			"value": "2589",
		}, {
			"label": "新绛县",
			"value": "2590",
		}, {
			"label": "绛县",
			"value": "2591",
		}, {
			"label": "垣曲县",
			"value": "2592",
		}, {
			"label": "夏县",
			"value": "2593",
		}, {
			"label": "平陆县",
			"value": "2594",
		}, {
			"label": "芮城县",
			"value": "2595",
		}]
	}]
}, {
	"label": "陕西省",
	"value": "24",
	"children": [{
		"label": "西安市",
		"value": "311",
		"children": [{
			"label": "莲湖区",
			"value": "2596",
		}, {
			"label": "新城区",
			"value": "2597",
		}, {
			"label": "碑林区",
			"value": "2598",
		}, {
			"label": "雁塔区",
			"value": "2599",
		}, {
			"label": "灞桥区",
			"value": "2600",
		}, {
			"label": "未央区",
			"value": "2601",
		}, {
			"label": "阎良区",
			"value": "2602",
		}, {
			"label": "临潼区",
			"value": "2603",
		}, {
			"label": "长安区",
			"value": "2604",
		}, {
			"label": "蓝田县",
			"value": "2605",
		}, {
			"label": "周至县",
			"value": "2606",
		}, {
			"label": "户县",
			"value": "2607",
		}, {
			"label": "高陵县",
			"value": "2608",
		}]
	}, {
		"label": "安康市",
		"value": "312",
		"children": [{
			"label": "汉滨区",
			"value": "2609",
		}, {
			"label": "汉阴县",
			"value": "2610",
		}, {
			"label": "石泉县",
			"value": "2611",
		}, {
			"label": "宁陕县",
			"value": "2612",
		}, {
			"label": "紫阳县",
			"value": "2613",
		}, {
			"label": "岚皋县",
			"value": "2614",
		}, {
			"label": "平利县",
			"value": "2615",
		}, {
			"label": "镇坪县",
			"value": "2616",
		}, {
			"label": "旬阳县",
			"value": "2617",
		}, {
			"label": "白河县",
			"value": "2618",
		}]
	}, {
		"label": "宝鸡市",
		"value": "313",
		"children": [{
			"label": "陈仓区",
			"value": "2619",
		}, {
			"label": "渭滨区",
			"value": "2620",
		}, {
			"label": "金台区",
			"value": "2621",
		}, {
			"label": "凤翔县",
			"value": "2622",
		}, {
			"label": "岐山县",
			"value": "2623",
		}, {
			"label": "扶风县",
			"value": "2624",
		}, {
			"label": "眉县",
			"value": "2625",
		}, {
			"label": "陇县",
			"value": "2626",
		}, {
			"label": "千阳县",
			"value": "2627",
		}, {
			"label": "麟游县",
			"value": "2628",
		}, {
			"label": "凤县",
			"value": "2629",
		}, {
			"label": "太白县",
			"value": "2630",
		}]
	}, {
		"label": "汉中市",
		"value": "314",
		"children": [{
			"label": "汉台区",
			"value": "2631",
		}, {
			"label": "南郑县",
			"value": "2632",
		}, {
			"label": "城固县",
			"value": "2633",
		}, {
			"label": "洋县",
			"value": "2634",
		}, {
			"label": "西乡县",
			"value": "2635",
		}, {
			"label": "勉县",
			"value": "2636",
		}, {
			"label": "宁强县",
			"value": "2637",
		}, {
			"label": "略阳县",
			"value": "2638",
		}, {
			"label": "镇巴县",
			"value": "2639",
		}, {
			"label": "留坝县",
			"value": "2640",
		}, {
			"label": "佛坪县",
			"value": "2641",
		}]
	}, {
		"label": "商洛市",
		"value": "315",
		"children": [{
			"label": "商州区",
			"value": "2642",
		}, {
			"label": "洛南县",
			"value": "2643",
		}, {
			"label": "丹凤县",
			"value": "2644",
		}, {
			"label": "商南县",
			"value": "2645",
		}, {
			"label": "山阳县",
			"value": "2646",
		}, {
			"label": "镇安县",
			"value": "2647",
		}, {
			"label": "柞水县",
			"value": "2648",
		}]
	}, {
		"label": "铜川市",
		"value": "316",
		"children": [{
			"label": "耀州区",
			"value": "2649",
		}, {
			"label": "王益区",
			"value": "2650",
		}, {
			"label": "印台区",
			"value": "2651",
		}, {
			"label": "宜君县",
			"value": "2652",
		}]
	}, {
		"label": "渭南市",
		"value": "317",
		"children": [{
			"label": "临渭区",
			"value": "2653",
		}, {
			"label": "韩城市",
			"value": "2654",
		}, {
			"label": "华阴市",
			"value": "2655",
		}, {
			"label": "华县",
			"value": "2656",
		}, {
			"label": "潼关县",
			"value": "2657",
		}, {
			"label": "大荔县",
			"value": "2658",
		}, {
			"label": "合阳县",
			"value": "2659",
		}, {
			"label": "澄城县",
			"value": "2660",
		}, {
			"label": "蒲城县",
			"value": "2661",
		}, {
			"label": "白水县",
			"value": "2662",
		}, {
			"label": "富平县",
			"value": "2663",
		}]
	}, {
		"label": "咸阳市",
		"value": "318",
		"children": [{
			"label": "秦都区",
			"value": "2664",
		}, {
			"label": "渭城区",
			"value": "2665",
		}, {
			"label": "杨陵区",
			"value": "2666",
		}, {
			"label": "兴平市",
			"value": "2667",
		}, {
			"label": "三原县",
			"value": "2668",
		}, {
			"label": "泾阳县",
			"value": "2669",
		}, {
			"label": "乾县",
			"value": "2670",
		}, {
			"label": "礼泉县",
			"value": "2671",
		}, {
			"label": "永寿县",
			"value": "2672",
		}, {
			"label": "彬县",
			"value": "2673",
		}, {
			"label": "长武县",
			"value": "2674",
		}, {
			"label": "旬邑县",
			"value": "2675",
		}, {
			"label": "淳化县",
			"value": "2676",
		}, {
			"label": "武功县",
			"value": "2677",
		}]
	}, {
		"label": "延安市",
		"value": "319",
		"children": [{
			"label": "吴起县",
			"value": "2678",
		}, {
			"label": "宝塔区",
			"value": "2679",
		}, {
			"label": "延长县",
			"value": "2680",
		}, {
			"label": "延川县",
			"value": "2681",
		}, {
			"label": "子长县",
			"value": "2682",
		}, {
			"label": "安塞县",
			"value": "2683",
		}, {
			"label": "志丹县",
			"value": "2684",
		}, {
			"label": "甘泉县",
			"value": "2685",
		}, {
			"label": "富县",
			"value": "2686",
		}, {
			"label": "洛川县",
			"value": "2687",
		}, {
			"label": "宜川县",
			"value": "2688",
		}, {
			"label": "黄龙县",
			"value": "2689",
		}, {
			"label": "黄陵县",
			"value": "2690",
		}]
	}, {
		"label": "榆林市",
		"value": "320",
		"children": [{
			"label": "榆阳区",
			"value": "2691",
		}, {
			"label": "神木县",
			"value": "2692",
		}, {
			"label": "府谷县",
			"value": "2693",
		}, {
			"label": "横山县",
			"value": "2694",
		}, {
			"label": "靖边县",
			"value": "2695",
		}, {
			"label": "定边县",
			"value": "2696",
		}, {
			"label": "绥德县",
			"value": "2697",
		}, {
			"label": "米脂县",
			"value": "2698",
		}, {
			"label": "佳县",
			"value": "2699",
		}, {
			"label": "吴堡县",
			"value": "2700",
		}, {
			"label": "清涧县",
			"value": "2701",
		}, {
			"label": "子洲县",
			"value": "2702",
		}]
	}]
}, {
	"label": "上海",
	"value": "25",
	"children": [{
		"label": "上海市",
		"value": "321",
		"children": [{
			"label": "长宁区",
			"value": "2703",
		}, {
			"label": "闸北区",
			"value": "2704",
		}, {
			"label": "闵行区",
			"value": "2705",
		}, {
			"label": "徐汇区",
			"value": "2706",
		}, {
			"label": "浦东新区",
			"value": "2707",
		}, {
			"label": "杨浦区",
			"value": "2708",
		}, {
			"label": "普陀区",
			"value": "2709",
		}, {
			"label": "静安区",
			"value": "2710",
		}, {
			"label": "卢湾区",
			"value": "2711",
		}, {
			"label": "虹口区",
			"value": "2712",
		}, {
			"label": "黄浦区",
			"value": "2713",
		}, {
			"label": "南汇区",
			"value": "2714",
		}, {
			"label": "松江区",
			"value": "2715",
		}, {
			"label": "嘉定区",
			"value": "2716",
		}, {
			"label": "宝山区",
			"value": "2717",
		}, {
			"label": "青浦区",
			"value": "2718",
		}, {
			"label": "金山区",
			"value": "2719",
		}, {
			"label": "奉贤区",
			"value": "2720",
		}, {
			"label": "崇明县",
			"value": "2721",
		}]
	}]
}, {
	"label": "四川省",
	"value": "26",
	"children": [{
		"label": "成都市",
		"value": "322",
		"children": [{
			"label": "青羊区",
			"value": "2722",
		}, {
			"label": "锦江区",
			"value": "2723",
		}, {
			"label": "金牛区",
			"value": "2724",
		}, {
			"label": "武侯区",
			"value": "2725",
		}, {
			"label": "成华区",
			"value": "2726",
		}, {
			"label": "龙泉驿区",
			"value": "2727",
		}, {
			"label": "青白江区",
			"value": "2728",
		}, {
			"label": "新都区",
			"value": "2729",
		}, {
			"label": "温江区",
			"value": "2730",
		}, {
			"label": "高新区",
			"value": "2731",
		}, {
			"label": "高新西区",
			"value": "2732",
		}, {
			"label": "都江堰市",
			"value": "2733",
		}, {
			"label": "彭州市",
			"value": "2734",
		}, {
			"label": "邛崃市",
			"value": "2735",
		}, {
			"label": "崇州市",
			"value": "2736",
		}, {
			"label": "金堂县",
			"value": "2737",
		}, {
			"label": "双流县",
			"value": "2738",
		}, {
			"label": "郫县",
			"value": "2739",
		}, {
			"label": "大邑县",
			"value": "2740",
		}, {
			"label": "蒲江县",
			"value": "2741",
		}, {
			"label": "新津县",
			"value": "2742",
		}, {
			"label": "都江堰市",
			"value": "2743",
		}, {
			"label": "彭州市",
			"value": "2744",
		}, {
			"label": "邛崃市",
			"value": "2745",
		}, {
			"label": "崇州市",
			"value": "2746",
		}, {
			"label": "金堂县",
			"value": "2747",
		}, {
			"label": "双流县",
			"value": "2748",
		}, {
			"label": "郫县",
			"value": "2749",
		}, {
			"label": "大邑县",
			"value": "2750",
		}, {
			"label": "蒲江县",
			"value": "2751",
		}, {
			"label": "新津县",
			"value": "2752",
		}]
	}, {
		"label": "绵阳市",
		"value": "323",
		"children": [{
			"label": "涪城区",
			"value": "2753",
		}, {
			"label": "游仙区",
			"value": "2754",
		}, {
			"label": "江油市",
			"value": "2755",
		}, {
			"label": "盐亭县",
			"value": "2756",
		}, {
			"label": "三台县",
			"value": "2757",
		}, {
			"label": "平武县",
			"value": "2758",
		}, {
			"label": "安县",
			"value": "2759",
		}, {
			"label": "梓潼县",
			"value": "2760",
		}, {
			"label": "北川县",
			"value": "2761",
		}]
	}, {
		"label": "阿坝藏族羌族自治州",
		"value": "324",
		"children": [{
			"label": "马尔康县",
			"value": "2762",
		}, {
			"label": "汶川县",
			"value": "2763",
		}, {
			"label": "理县",
			"value": "2764",
		}, {
			"label": "茂县",
			"value": "2765",
		}, {
			"label": "松潘县",
			"value": "2766",
		}, {
			"label": "九寨沟县",
			"value": "2767",
		}, {
			"label": "金川县",
			"value": "2768",
		}, {
			"label": "小金县",
			"value": "2769",
		}, {
			"label": "黑水县",
			"value": "2770",
		}, {
			"label": "壤塘县",
			"value": "2771",
		}, {
			"label": "阿坝县",
			"value": "2772",
		}, {
			"label": "若尔盖县",
			"value": "2773",
		}, {
			"label": "红原县",
			"value": "2774",
		}]
	}, {
		"label": "巴中市",
		"value": "325",
		"children": [{
			"label": "巴州区",
			"value": "2775",
		}, {
			"label": "通江县",
			"value": "2776",
		}, {
			"label": "南江县",
			"value": "2777",
		}, {
			"label": "平昌县",
			"value": "2778",
		}]
	}, {
		"label": "达州市",
		"value": "326",
		"children": [{
			"label": "通川区",
			"value": "2779",
		}, {
			"label": "万源市",
			"value": "2780",
		}, {
			"label": "达县",
			"value": "2781",
		}, {
			"label": "宣汉县",
			"value": "2782",
		}, {
			"label": "开江县",
			"value": "2783",
		}, {
			"label": "大竹县",
			"value": "2784",
		}, {
			"label": "渠县",
			"value": "2785",
		}]
	}, {
		"label": "德阳市",
		"value": "327",
		"children": [{
			"label": "旌阳区",
			"value": "2786",
		}, {
			"label": "广汉市",
			"value": "2787",
		}, {
			"label": "什邡市",
			"value": "2788",
		}, {
			"label": "绵竹市",
			"value": "2789",
		}, {
			"label": "罗江县",
			"value": "2790",
		}, {
			"label": "中江县",
			"value": "2791",
		}]
	}, {
		"label": "甘孜藏族自治州",
		"value": "328",
		"children": [{
			"label": "康定县",
			"value": "2792",
		}, {
			"label": "丹巴县",
			"value": "2793",
		}, {
			"label": "泸定县",
			"value": "2794",
		}, {
			"label": "炉霍县",
			"value": "2795",
		}, {
			"label": "九龙县",
			"value": "2796",
		}, {
			"label": "甘孜县",
			"value": "2797",
		}, {
			"label": "雅江县",
			"value": "2798",
		}, {
			"label": "新龙县",
			"value": "2799",
		}, {
			"label": "道孚县",
			"value": "2800",
		}, {
			"label": "白玉县",
			"value": "2801",
		}, {
			"label": "理塘县",
			"value": "2802",
		}, {
			"label": "德格县",
			"value": "2803",
		}, {
			"label": "乡城县",
			"value": "2804",
		}, {
			"label": "石渠县",
			"value": "2805",
		}, {
			"label": "稻城县",
			"value": "2806",
		}, {
			"label": "色达县",
			"value": "2807",
		}, {
			"label": "巴塘县",
			"value": "2808",
		}, {
			"label": "得荣县",
			"value": "2809",
		}]
	}, {
		"label": "广安市",
		"value": "329",
		"children": [{
			"label": "广安区",
			"value": "2810",
		}, {
			"label": "华蓥市",
			"value": "2811",
		}, {
			"label": "岳池县",
			"value": "2812",
		}, {
			"label": "武胜县",
			"value": "2813",
		}, {
			"label": "邻水县",
			"value": "2814",
		}]
	}, {
		"label": "广元市",
		"value": "330",
		"children": [{
			"label": "利州区",
			"value": "2815",
		}, {
			"label": "元坝区",
			"value": "2816",
		}, {
			"label": "朝天区",
			"value": "2817",
		}, {
			"label": "旺苍县",
			"value": "2818",
		}, {
			"label": "青川县",
			"value": "2819",
		}, {
			"label": "剑阁县",
			"value": "2820",
		}, {
			"label": "苍溪县",
			"value": "2821",
		}]
	}, {
		"label": "乐山市",
		"value": "331",
		"children": [{
			"label": "峨眉山市",
			"value": "2822",
		}, {
			"label": "乐山市",
			"value": "2823",
		}, {
			"label": "犍为县",
			"value": "2824",
		}, {
			"label": "井研县",
			"value": "2825",
		}, {
			"label": "夹江县",
			"value": "2826",
		}, {
			"label": "沐川县",
			"value": "2827",
		}, {
			"label": "峨边",
			"value": "2828",
		}, {
			"label": "马边",
			"value": "2829",
		}]
	}, {
		"label": "凉山市",
		"value": "332",
		"children": [{
			"label": "西昌市",
			"value": "2830",
		}, {
			"label": "盐源县",
			"value": "2831",
		}, {
			"label": "德昌县",
			"value": "2832",
		}, {
			"label": "会理县",
			"value": "2833",
		}, {
			"label": "会东县",
			"value": "2834",
		}, {
			"label": "宁南县",
			"value": "2835",
		}, {
			"label": "普格县",
			"value": "2836",
		}, {
			"label": "布拖县",
			"value": "2837",
		}, {
			"label": "金阳县",
			"value": "2838",
		}, {
			"label": "昭觉县",
			"value": "2839",
		}, {
			"label": "喜德县",
			"value": "2840",
		}, {
			"label": "冕宁县",
			"value": "2841",
		}, {
			"label": "越西县",
			"value": "2842",
		}, {
			"label": "甘洛县",
			"value": "2843",
		}, {
			"label": "美姑县",
			"value": "2844",
		}, {
			"label": "雷波县",
			"value": "2845",
		}, {
			"label": "木里",
			"value": "2846",
		}]
	}, {
		"label": "眉山市",
		"value": "333",
		"children": [{
			"label": "东坡区",
			"value": "2847",
		}, {
			"label": "仁寿县",
			"value": "2848",
		}, {
			"label": "彭山县",
			"value": "2849",
		}, {
			"label": "洪雅县",
			"value": "2850",
		}, {
			"label": "丹棱县",
			"value": "2851",
		}, {
			"label": "青神县",
			"value": "2852",
		}]
	}, {
		"label": "南充市",
		"value": "334",
		"children": [{
			"label": "阆中市",
			"value": "2853",
		}, {
			"label": "南部县",
			"value": "2854",
		}, {
			"label": "营山县",
			"value": "2855",
		}, {
			"label": "蓬安县",
			"value": "2856",
		}, {
			"label": "仪陇县",
			"value": "2857",
		}, {
			"label": "顺庆区",
			"value": "2858",
		}, {
			"label": "高坪区",
			"value": "2859",
		}, {
			"label": "嘉陵区",
			"value": "2860",
		}, {
			"label": "西充县",
			"value": "2861",
		}]
	}, {
		"label": "内江市",
		"value": "335",
		"children": [{
			"label": "市中区",
			"value": "2862",
		}, {
			"label": "东兴区",
			"value": "2863",
		}, {
			"label": "威远县",
			"value": "2864",
		}, {
			"label": "资中县",
			"value": "2865",
		}, {
			"label": "隆昌县",
			"value": "2866",
		}]
	}, {
		"label": "攀枝花市",
		"value": "336",
		"children": [{
			"label": "东  区",
			"value": "2867",
		}, {
			"label": "西  区",
			"value": "2868",
		}, {
			"label": "仁和区",
			"value": "2869",
		}, {
			"label": "米易县",
			"value": "2870",
		}, {
			"label": "盐边县",
			"value": "2871",
		}]
	}, {
		"label": "遂宁市",
		"value": "337",
		"children": [{
			"label": "船山区",
			"value": "2872",
		}, {
			"label": "安居区",
			"value": "2873",
		}, {
			"label": "蓬溪县",
			"value": "2874",
		}, {
			"label": "射洪县",
			"value": "2875",
		}, {
			"label": "大英县",
			"value": "2876",
		}]
	}, {
		"label": "雅安市",
		"value": "338",
		"children": [{
			"label": "雨城区",
			"value": "2877",
		}, {
			"label": "名山县",
			"value": "2878",
		}, {
			"label": "荥经县",
			"value": "2879",
		}, {
			"label": "汉源县",
			"value": "2880",
		}, {
			"label": "石棉县",
			"value": "2881",
		}, {
			"label": "天全县",
			"value": "2882",
		}, {
			"label": "芦山县",
			"value": "2883",
		}, {
			"label": "宝兴县",
			"value": "2884",
		}]
	}, {
		"label": "宜宾市",
		"value": "339",
		"children": [{
			"label": "翠屏区",
			"value": "2885",
		}, {
			"label": "宜宾县",
			"value": "2886",
		}, {
			"label": "南溪县",
			"value": "2887",
		}, {
			"label": "江安县",
			"value": "2888",
		}, {
			"label": "长宁县",
			"value": "2889",
		}, {
			"label": "高县",
			"value": "2890",
		}, {
			"label": "珙县",
			"value": "2891",
		}, {
			"label": "筠连县",
			"value": "2892",
		}, {
			"label": "兴文县",
			"value": "2893",
		}, {
			"label": "屏山县",
			"value": "2894",
		}]
	}, {
		"label": "资阳市",
		"value": "340",
		"children": [{
			"label": "雁江区",
			"value": "2895",
		}, {
			"label": "简阳市",
			"value": "2896",
		}, {
			"label": "安岳县",
			"value": "2897",
		}, {
			"label": "乐至县",
			"value": "2898",
		}]
	}, {
		"label": "自贡市",
		"value": "341",
		"children": [{
			"label": "大安区",
			"value": "2899",
		}, {
			"label": "自流井区",
			"value": "2900",
		}, {
			"label": "贡井区",
			"value": "2901",
		}, {
			"label": "沿滩区",
			"value": "2902",
		}, {
			"label": "荣县",
			"value": "2903",
		}, {
			"label": "富顺县",
			"value": "2904",
		}]
	}, {
		"label": "泸州市",
		"value": "342",
		"children": [{
			"label": "江阳区",
			"value": "2905",
		}, {
			"label": "纳溪区",
			"value": "2906",
		}, {
			"label": "龙马潭区",
			"value": "2907",
		}, {
			"label": "泸县",
			"value": "2908",
		}, {
			"label": "合江县",
			"value": "2909",
		}, {
			"label": "叙永县",
			"value": "2910",
		}, {
			"label": "古蔺县",
			"value": "2911",
		}]
	}]
}, {
	"label": "天津",
	"value": "27",
	"children": [{
		"label": "天津市",
		"value": "343",
		"children": [{
			"label": "和平区",
			"value": "2912",
		}, {
			"label": "河西区",
			"value": "2913",
		}, {
			"label": "南开区",
			"value": "2914",
		}, {
			"label": "河北区",
			"value": "2915",
		}, {
			"label": "河东区",
			"value": "2916",
		}, {
			"label": "红桥区",
			"value": "2917",
		}, {
			"label": "东丽区",
			"value": "2918",
		}, {
			"label": "津南区",
			"value": "2919",
		}, {
			"label": "西青区",
			"value": "2920",
		}, {
			"label": "北辰区",
			"value": "2921",
		}, {
			"label": "塘沽区",
			"value": "2922",
		}, {
			"label": "汉沽区",
			"value": "2923",
		}, {
			"label": "大港区",
			"value": "2924",
		}, {
			"label": "武清区",
			"value": "2925",
		}, {
			"label": "宝坻区",
			"value": "2926",
		}, {
			"label": "经济开发区",
			"value": "2927",
		}, {
			"label": "宁河县",
			"value": "2928",
		}, {
			"label": "静海县",
			"value": "2929",
		}, {
			"label": "蓟县",
			"value": "2930",
		}]
	}]
}, {
	"label": "西藏自治区",
	"value": "28",
	"children": [{
		"label": "拉萨市",
		"value": "344",
		"children": [{
			"label": "城关区",
			"value": "2931",
		}, {
			"label": "林周县",
			"value": "2932",
		}, {
			"label": "当雄县",
			"value": "2933",
		}, {
			"label": "尼木县",
			"value": "2934",
		}, {
			"label": "曲水县",
			"value": "2935",
		}, {
			"label": "堆龙德庆县",
			"value": "2936",
		}, {
			"label": "达孜县",
			"value": "2937",
		}, {
			"label": "墨竹工卡县",
			"value": "2938",
		}]
	}, {
		"label": "阿里市",
		"value": "345",
		"children": [{
			"label": "噶尔县",
			"value": "2939",
		}, {
			"label": "普兰县",
			"value": "2940",
		}, {
			"label": "札达县",
			"value": "2941",
		}, {
			"label": "日土县",
			"value": "2942",
		}, {
			"label": "革吉县",
			"value": "2943",
		}, {
			"label": "改则县",
			"value": "2944",
		}, {
			"label": "措勤县",
			"value": "2945",
		}]
	}, {
		"label": "昌都市",
		"value": "346",
		"children": [{
			"label": "昌都县",
			"value": "2946",
		}, {
			"label": "江达县",
			"value": "2947",
		}, {
			"label": "贡觉县",
			"value": "2948",
		}, {
			"label": "类乌齐县",
			"value": "2949",
		}, {
			"label": "丁青县",
			"value": "2950",
		}, {
			"label": "察雅县",
			"value": "2951",
		}, {
			"label": "八宿县",
			"value": "2952",
		}, {
			"label": "左贡县",
			"value": "2953",
		}, {
			"label": "芒康县",
			"value": "2954",
		}, {
			"label": "洛隆县",
			"value": "2955",
		}, {
			"label": "边坝县",
			"value": "2956",
		}]
	}, {
		"label": "林芝市",
		"value": "347",
		"children": [{
			"label": "林芝县",
			"value": "2957",
		}, {
			"label": "工布江达县",
			"value": "2958",
		}, {
			"label": "米林县",
			"value": "2959",
		}, {
			"label": "墨脱县",
			"value": "2960",
		}, {
			"label": "波密县",
			"value": "2961",
		}, {
			"label": "察隅县",
			"value": "2962",
		}, {
			"label": "朗县",
			"value": "2963",
		}]
	}, {
		"label": "那曲市",
		"value": "348",
		"children": [{
			"label": "那曲县",
			"value": "2964",
		}, {
			"label": "嘉黎县",
			"value": "2965",
		}, {
			"label": "比如县",
			"value": "2966",
		}, {
			"label": "聂荣县",
			"value": "2967",
		}, {
			"label": "安多县",
			"value": "2968",
		}, {
			"label": "申扎县",
			"value": "2969",
		}, {
			"label": "索县",
			"value": "2970",
		}, {
			"label": "班戈县",
			"value": "2971",
		}, {
			"label": "巴青县",
			"value": "2972",
		}, {
			"label": "尼玛县",
			"value": "2973",
		}]
	}, {
		"label": "日喀则市",
		"value": "349",
		"children": [{
			"label": "日喀则市",
			"value": "2974",
		}, {
			"label": "南木林县",
			"value": "2975",
		}, {
			"label": "江孜县",
			"value": "2976",
		}, {
			"label": "定日县",
			"value": "2977",
		}, {
			"label": "萨迦县",
			"value": "2978",
		}, {
			"label": "拉孜县",
			"value": "2979",
		}, {
			"label": "昂仁县",
			"value": "2980",
		}, {
			"label": "谢通门县",
			"value": "2981",
		}, {
			"label": "白朗县",
			"value": "2982",
		}, {
			"label": "仁布县",
			"value": "2983",
		}, {
			"label": "康马县",
			"value": "2984",
		}, {
			"label": "定结县",
			"value": "2985",
		}, {
			"label": "仲巴县",
			"value": "2986",
		}, {
			"label": "亚东县",
			"value": "2987",
		}, {
			"label": "吉隆县",
			"value": "2988",
		}, {
			"label": "聂拉木县",
			"value": "2989",
		}, {
			"label": "萨嘎县",
			"value": "2990",
		}, {
			"label": "岗巴县",
			"value": "2991",
		}]
	}, {
		"label": "山南市",
		"value": "350",
		"children": [{
			"label": "乃东县",
			"value": "2992",
		}, {
			"label": "扎囊县",
			"value": "2993",
		}, {
			"label": "贡嘎县",
			"value": "2994",
		}, {
			"label": "桑日县",
			"value": "2995",
		}, {
			"label": "琼结县",
			"value": "2996",
		}, {
			"label": "曲松县",
			"value": "2997",
		}, {
			"label": "措美县",
			"value": "2998",
		}, {
			"label": "洛扎县",
			"value": "2999",
		}, {
			"label": "加查县",
			"value": "3000",
		}, {
			"label": "隆子县",
			"value": "3001",
		}, {
			"label": "错那县",
			"value": "3002",
		}, {
			"label": "浪卡子县",
			"value": "3003",
		}]
	}]
}, {
	"label": "新疆维吾尔自治区",
	"value": "29",
	"children": [{
		"label": "乌鲁木齐市",
		"value": "351",
		"children": [{
			"label": "天山区",
			"value": "3004",
		}, {
			"label": "沙依巴克区",
			"value": "3005",
		}, {
			"label": "新市区",
			"value": "3006",
		}, {
			"label": "水磨沟区",
			"value": "3007",
		}, {
			"label": "头屯河区",
			"value": "3008",
		}, {
			"label": "达坂城区",
			"value": "3009",
		}, {
			"label": "米东区",
			"value": "3010",
		}, {
			"label": "乌鲁木齐县",
			"value": "3011",
		}]
	}, {
		"label": "阿克苏地区",
		"value": "352",
		"children": [{
			"label": "阿克苏市",
			"value": "3012",
		}, {
			"label": "温宿县",
			"value": "3013",
		}, {
			"label": "库车县",
			"value": "3014",
		}, {
			"label": "沙雅县",
			"value": "3015",
		}, {
			"label": "新和县",
			"value": "3016",
		}, {
			"label": "拜城县",
			"value": "3017",
		}, {
			"label": "乌什县",
			"value": "3018",
		}, {
			"label": "阿瓦提县",
			"value": "3019",
		}, {
			"label": "柯坪县",
			"value": "3020",
		}]
	}, {
		"label": "阿拉尔市",
		"value": "353",
		"children": [{
			"label": "阿拉尔市",
			"value": "3021",
		}]
	}, {
		"label": "巴音郭楞蒙古自治州",
		"value": "354",
		"children": [{
			"label": "库尔勒市",
			"value": "3022",
		}, {
			"label": "轮台县",
			"value": "3023",
		}, {
			"label": "尉犁县",
			"value": "3024",
		}, {
			"label": "若羌县",
			"value": "3025",
		}, {
			"label": "且末县",
			"value": "3026",
		}, {
			"label": "焉耆",
			"value": "3027",
		}, {
			"label": "和静县",
			"value": "3028",
		}, {
			"label": "和硕县",
			"value": "3029",
		}, {
			"label": "博湖县",
			"value": "3030",
		}]
	}, {
		"label": "博尔塔拉蒙古自治州",
		"value": "355",
		"children": [{
			"label": "博乐市",
			"value": "3031",
		}, {
			"label": "精河县",
			"value": "3032",
		}, {
			"label": "温泉县",
			"value": "3033",
		}]
	}, {
		"label": "昌吉回族自治州",
		"value": "356",
		"children": [{
			"label": "呼图壁县",
			"value": "3034",
		}, {
			"label": "米泉市",
			"value": "3035",
		}, {
			"label": "昌吉市",
			"value": "3036",
		}, {
			"label": "阜康市",
			"value": "3037",
		}, {
			"label": "玛纳斯县",
			"value": "3038",
		}, {
			"label": "奇台县",
			"value": "3039",
		}, {
			"label": "吉木萨尔县",
			"value": "3040",
		}, {
			"label": "木垒",
			"value": "3041",
		}]
	}, {
		"label": "哈密市",
		"value": "357",
		"children": [{
			"label": "哈密市",
			"value": "3042",
		}, {
			"label": "伊吾县",
			"value": "3043",
		}, {
			"label": "巴里坤",
			"value": "3044",
		}]
	}, {
		"label": "和田地区",
		"value": "358",
		"children": [{
			"label": "和田市",
			"value": "3045",
		}, {
			"label": "和田县",
			"value": "3046",
		}, {
			"label": "墨玉县",
			"value": "3047",
		}, {
			"label": "皮山县",
			"value": "3048",
		}, {
			"label": "洛浦县",
			"value": "3049",
		}, {
			"label": "策勒县",
			"value": "3050",
		}, {
			"label": "于田县",
			"value": "3051",
		}, {
			"label": "民丰县",
			"value": "3052",
		}]
	}, {
		"label": "喀什地区",
		"value": "359",
		"children": [{
			"label": "喀什市",
			"value": "3053",
		}, {
			"label": "疏附县",
			"value": "3054",
		}, {
			"label": "疏勒县",
			"value": "3055",
		}, {
			"label": "英吉沙县",
			"value": "3056",
		}, {
			"label": "泽普县",
			"value": "3057",
		}, {
			"label": "莎车县",
			"value": "3058",
		}, {
			"label": "叶城县",
			"value": "3059",
		}, {
			"label": "麦盖提县",
			"value": "3060",
		}, {
			"label": "岳普湖县",
			"value": "3061",
		}, {
			"label": "伽师县",
			"value": "3062",
		}, {
			"label": "巴楚县",
			"value": "3063",
		}, {
			"label": "塔什库尔干",
			"value": "3064",
		}]
	}, {
		"label": "克拉玛依市",
		"value": "360",
		"children": [{
			"label": "克拉玛依市",
			"value": "3065",
		}]
	}, {
		"label": "克孜勒苏柯尔克孜自治州",
		"value": "361",
		"children": [{
			"label": "阿图什市",
			"value": "3066",
		}, {
			"label": "阿克陶县",
			"value": "3067",
		}, {
			"label": "阿合奇县",
			"value": "3068",
		}, {
			"label": "乌恰县",
			"value": "3069",
		}]
	}, {
		"label": "石河子市",
		"value": "362",
		"children": [{
			"label": "石河子市",
			"value": "3070",
		}]
	}, {
		"label": "图木舒克市",
		"value": "363",
		"children": [{
			"label": "图木舒克市",
			"value": "3071",
		}]
	}, {
		"label": "吐鲁番市",
		"value": "364",
		"children": [{
			"label": "吐鲁番市",
			"value": "3072",
		}, {
			"label": "鄯善县",
			"value": "3073",
		}, {
			"label": "托克逊县",
			"value": "3074",
		}]
	}, {
		"label": "五家渠市",
		"value": "365",
		"children": [{
			"label": "五家渠市",
			"value": "3075",
		}]
	}, {
		"label": "伊犁哈萨克自治州",
		"value": "366",
		"children": [{
			"label": "阿勒泰市",
			"value": "3076",
		}, {
			"label": "布克赛尔",
			"value": "3077",
		}, {
			"label": "伊宁市",
			"value": "3078",
		}, {
			"label": "布尔津县",
			"value": "3079",
		}, {
			"label": "奎屯市",
			"value": "3080",
		}, {
			"label": "乌苏市",
			"value": "3081",
		}, {
			"label": "额敏县",
			"value": "3082",
		}, {
			"label": "富蕴县",
			"value": "3083",
		}, {
			"label": "伊宁县",
			"value": "3084",
		}, {
			"label": "福海县",
			"value": "3085",
		}, {
			"label": "霍城县",
			"value": "3086",
		}, {
			"label": "沙湾县",
			"value": "3087",
		}, {
			"label": "巩留县",
			"value": "3088",
		}, {
			"label": "哈巴河县",
			"value": "3089",
		}, {
			"label": "托里县",
			"value": "3090",
		}, {
			"label": "青河县",
			"value": "3091",
		}, {
			"label": "新源县",
			"value": "3092",
		}, {
			"label": "裕民县",
			"value": "3093",
		}, {
			"label": "和布克赛尔",
			"value": "3094",
		}, {
			"label": "吉木乃县",
			"value": "3095",
		}, {
			"label": "昭苏县",
			"value": "3096",
		}, {
			"label": "特克斯县",
			"value": "3097",
		}, {
			"label": "尼勒克县",
			"value": "3098",
		}, {
			"label": "察布查尔",
			"value": "3099",
		}]
	}]
}, {
	"label": "云南省",
	"value": "30",
	"children": [{
		"label": "昆明市",
		"value": "367",
		"children": [{
			"label": "盘龙区",
			"value": "3100",
		}, {
			"label": "五华区",
			"value": "3101",
		}, {
			"label": "官渡区",
			"value": "3102",
		}, {
			"label": "西山区",
			"value": "3103",
		}, {
			"label": "东川区",
			"value": "3104",
		}, {
			"label": "安宁市",
			"value": "3105",
		}, {
			"label": "呈贡县",
			"value": "3106",
		}, {
			"label": "晋宁县",
			"value": "3107",
		}, {
			"label": "富民县",
			"value": "3108",
		}, {
			"label": "宜良县",
			"value": "3109",
		}, {
			"label": "嵩明县",
			"value": "3110",
		}, {
			"label": "石林县",
			"value": "3111",
		}, {
			"label": "禄劝",
			"value": "3112",
		}, {
			"label": "寻甸",
			"value": "3113",
		}]
	}, {
		"label": "怒江傈傈族自治州",
		"value": "368",
		"children": [{
			"label": "兰坪",
			"value": "3114",
		}, {
			"label": "泸水县",
			"value": "3115",
		}, {
			"label": "福贡县",
			"value": "3116",
		}, {
			"label": "贡山",
			"value": "3117",
		}]
	}, {
		"label": "普洱市",
		"value": "369",
		"children": [{
			"label": "宁洱",
			"value": "3118",
		}, {
			"label": "思茅区",
			"value": "3119",
		}, {
			"label": "墨江",
			"value": "3120",
		}, {
			"label": "景东",
			"value": "3121",
		}, {
			"label": "景谷",
			"value": "3122",
		}, {
			"label": "镇沅",
			"value": "3123",
		}, {
			"label": "江城",
			"value": "3124",
		}, {
			"label": "孟连",
			"value": "3125",
		}, {
			"label": "澜沧",
			"value": "3126",
		}, {
			"label": "西盟",
			"value": "3127",
		}]
	}, {
		"label": "丽江市",
		"value": "370",
		"children": [{
			"label": "古城区",
			"value": "3128",
		}, {
			"label": "宁蒗",
			"value": "3129",
		}, {
			"label": "玉龙",
			"value": "3130",
		}, {
			"label": "永胜县",
			"value": "3131",
		}, {
			"label": "华坪县",
			"value": "3132",
		}]
	}, {
		"label": "保山市",
		"value": "371",
		"children": [{
			"label": "隆阳区",
			"value": "3133",
		}, {
			"label": "施甸县",
			"value": "3134",
		}, {
			"label": "腾冲县",
			"value": "3135",
		}, {
			"label": "龙陵县",
			"value": "3136",
		}, {
			"label": "昌宁县",
			"value": "3137",
		}]
	}, {
		"label": "楚雄彝族自治州",
		"value": "372",
		"children": [{
			"label": "楚雄市",
			"value": "3138",
		}, {
			"label": "双柏县",
			"value": "3139",
		}, {
			"label": "牟定县",
			"value": "3140",
		}, {
			"label": "南华县",
			"value": "3141",
		}, {
			"label": "姚安县",
			"value": "3142",
		}, {
			"label": "大姚县",
			"value": "3143",
		}, {
			"label": "永仁县",
			"value": "3144",
		}, {
			"label": "元谋县",
			"value": "3145",
		}, {
			"label": "武定县",
			"value": "3146",
		}, {
			"label": "禄丰县",
			"value": "3147",
		}]
	}, {
		"label": "大理白簇自治州",
		"value": "373",
		"children": [{
			"label": "大理市",
			"value": "3148",
		}, {
			"label": "祥云县",
			"value": "3149",
		}, {
			"label": "宾川县",
			"value": "3150",
		}, {
			"label": "弥渡县",
			"value": "3151",
		}, {
			"label": "永平县",
			"value": "3152",
		}, {
			"label": "云龙县",
			"value": "3153",
		}, {
			"label": "洱源县",
			"value": "3154",
		}, {
			"label": "剑川县",
			"value": "3155",
		}, {
			"label": "鹤庆县",
			"value": "3156",
		}, {
			"label": "漾濞",
			"value": "3157",
		}, {
			"label": "南涧",
			"value": "3158",
		}, {
			"label": "巍山",
			"value": "3159",
		}]
	}, {
		"label": "德宏傣族景颇族自治州",
		"value": "374",
		"children": [{
			"label": "潞西市",
			"value": "3160",
		}, {
			"label": "瑞丽市",
			"value": "3161",
		}, {
			"label": "梁河县",
			"value": "3162",
		}, {
			"label": "盈江县",
			"value": "3163",
		}, {
			"label": "陇川县",
			"value": "3164",
		}]
	}, {
		"label": "迪庆藏族自治州",
		"value": "375",
		"children": [{
			"label": "香格里拉县",
			"value": "3165",
		}, {
			"label": "德钦县",
			"value": "3166",
		}, {
			"label": "维西",
			"value": "3167",
		}]
	}, {
		"label": "红河哈尼族彝族自治州",
		"value": "376",
		"children": [{
			"label": "泸西县",
			"value": "3168",
		}, {
			"label": "蒙自县",
			"value": "3169",
		}, {
			"label": "个旧市",
			"value": "3170",
		}, {
			"label": "开远市",
			"value": "3171",
		}, {
			"label": "绿春县",
			"value": "3172",
		}, {
			"label": "建水县",
			"value": "3173",
		}, {
			"label": "石屏县",
			"value": "3174",
		}, {
			"label": "弥勒县",
			"value": "3175",
		}, {
			"label": "元阳县",
			"value": "3176",
		}, {
			"label": "红河县",
			"value": "3177",
		}, {
			"label": "金平",
			"value": "3178",
		}, {
			"label": "河口",
			"value": "3179",
		}, {
			"label": "屏边",
			"value": "3180",
		}]
	}, {
		"label": "临沧市",
		"value": "377",
		"children": [{
			"label": "临翔区",
			"value": "3181",
		}, {
			"label": "凤庆县",
			"value": "3182",
		}, {
			"label": "云县",
			"value": "3183",
		}, {
			"label": "永德县",
			"value": "3184",
		}, {
			"label": "镇康县",
			"value": "3185",
		}, {
			"label": "双江",
			"value": "3186",
		}, {
			"label": "耿马",
			"value": "3187",
		}, {
			"label": "沧源",
			"value": "3188",
		}]
	}, {
		"label": "曲靖市",
		"value": "378",
		"children": [{
			"label": "麒麟区",
			"value": "3189",
		}, {
			"label": "宣威市",
			"value": "3190",
		}, {
			"label": "马龙县",
			"value": "3191",
		}, {
			"label": "陆良县",
			"value": "3192",
		}, {
			"label": "师宗县",
			"value": "3193",
		}, {
			"label": "罗平县",
			"value": "3194",
		}, {
			"label": "富源县",
			"value": "3195",
		}, {
			"label": "会泽县",
			"value": "3196",
		}, {
			"label": "沾益县",
			"value": "3197",
		}]
	}, {
		"label": "文山壮族苗族自治州",
		"value": "379",
		"children": [{
			"label": "文山县",
			"value": "3198",
		}, {
			"label": "砚山县",
			"value": "3199",
		}, {
			"label": "西畴县",
			"value": "3200",
		}, {
			"label": "麻栗坡县",
			"value": "3201",
		}, {
			"label": "马关县",
			"value": "3202",
		}, {
			"label": "丘北县",
			"value": "3203",
		}, {
			"label": "广南县",
			"value": "3204",
		}, {
			"label": "富宁县",
			"value": "3205",
		}]
	}, {
		"label": "西双版纳傣族自治州",
		"value": "380",
		"children": [{
			"label": "景洪市",
			"value": "3206",
		}, {
			"label": "勐海县",
			"value": "3207",
		}, {
			"label": "勐腊县",
			"value": "3208",
		}]
	}, {
		"label": "玉溪市",
		"value": "381",
		"children": [{
			"label": "红塔区",
			"value": "3209",
		}, {
			"label": "江川县",
			"value": "3210",
		}, {
			"label": "澄江县",
			"value": "3211",
		}, {
			"label": "通海县",
			"value": "3212",
		}, {
			"label": "华宁县",
			"value": "3213",
		}, {
			"label": "易门县",
			"value": "3214",
		}, {
			"label": "峨山",
			"value": "3215",
		}, {
			"label": "新平",
			"value": "3216",
		}, {
			"label": "元江",
			"value": "3217",
		}]
	}, {
		"label": "昭通市",
		"value": "382",
		"children": [{
			"label": "昭阳区",
			"value": "3218",
		}, {
			"label": "鲁甸县",
			"value": "3219",
		}, {
			"label": "巧家县",
			"value": "3220",
		}, {
			"label": "盐津县",
			"value": "3221",
		}, {
			"label": "大关县",
			"value": "3222",
		}, {
			"label": "永善县",
			"value": "3223",
		}, {
			"label": "绥江县",
			"value": "3224",
		}, {
			"label": "镇雄县",
			"value": "3225",
		}, {
			"label": "彝良县",
			"value": "3226",
		}, {
			"label": "威信县",
			"value": "3227",
		}, {
			"label": "水富县",
			"value": "3228",
		}]
	}]
}, {
	"label": "浙江省",
	"value": "31",
	"children": [{
		"label": "杭州市",
		"value": "383",
		"children": [{
			"label": "西湖区",
			"value": "3229",
		}, {
			"label": "上城区",
			"value": "3230",
		}, {
			"label": "下城区",
			"value": "3231",
		}, {
			"label": "拱墅区",
			"value": "3232",
		}, {
			"label": "滨江区",
			"value": "3233",
		}, {
			"label": "江干区",
			"value": "3234",
		}, {
			"label": "萧山区",
			"value": "3235",
		}, {
			"label": "余杭区",
			"value": "3236",
		}, {
			"label": "市郊",
			"value": "3237",
		}, {
			"label": "建德市",
			"value": "3238",
		}, {
			"label": "富阳市",
			"value": "3239",
		}, {
			"label": "临安市",
			"value": "3240",
		}, {
			"label": "桐庐县",
			"value": "3241",
		}, {
			"label": "淳安县",
			"value": "3242",
		}]
	}, {
		"label": "湖州市",
		"value": "384",
		"children": [{
			"label": "吴兴区",
			"value": "3243",
		}, {
			"label": "南浔区",
			"value": "3244",
		}, {
			"label": "德清县",
			"value": "3245",
		}, {
			"label": "长兴县",
			"value": "3246",
		}, {
			"label": "安吉县",
			"value": "3247",
		}]
	}, {
		"label": "嘉兴市",
		"value": "385",
		"children": [{
			"label": "南湖区",
			"value": "3248",
		}, {
			"label": "秀洲区",
			"value": "3249",
		}, {
			"label": "海宁市",
			"value": "3250",
		}, {
			"label": "嘉善县",
			"value": "3251",
		}, {
			"label": "平湖市",
			"value": "3252",
		}, {
			"label": "桐乡市",
			"value": "3253",
		}, {
			"label": "海盐县",
			"value": "3254",
		}]
	}, {
		"label": "金华市",
		"value": "386",
		"children": [{
			"label": "婺城区",
			"value": "3255",
		}, {
			"label": "金东区",
			"value": "3256",
		}, {
			"label": "兰溪市",
			"value": "3257",
		}, {
			"label": "市区",
			"value": "3258",
		}, {
			"label": "佛堂镇",
			"value": "3259",
		}, {
			"label": "上溪镇",
			"value": "3260",
		}, {
			"label": "义亭镇",
			"value": "3261",
		}, {
			"label": "大陈镇",
			"value": "3262",
		}, {
			"label": "苏溪镇",
			"value": "3263",
		}, {
			"label": "赤岸镇",
			"value": "3264",
		}, {
			"label": "东阳市",
			"value": "3265",
		}, {
			"label": "永康市",
			"value": "3266",
		}, {
			"label": "武义县",
			"value": "3267",
		}, {
			"label": "浦江县",
			"value": "3268",
		}, {
			"label": "磐安县",
			"value": "3269",
		}]
	}, {
		"label": "丽水市",
		"value": "387",
		"children": [{
			"label": "莲都区",
			"value": "3270",
		}, {
			"label": "龙泉市",
			"value": "3271",
		}, {
			"label": "青田县",
			"value": "3272",
		}, {
			"label": "缙云县",
			"value": "3273",
		}, {
			"label": "遂昌县",
			"value": "3274",
		}, {
			"label": "松阳县",
			"value": "3275",
		}, {
			"label": "云和县",
			"value": "3276",
		}, {
			"label": "庆元县",
			"value": "3277",
		}, {
			"label": "景宁",
			"value": "3278",
		}]
	}, {
		"label": "宁波市",
		"value": "388",
		"children": [{
			"label": "海曙区",
			"value": "3279",
		}, {
			"label": "江东区",
			"value": "3280",
		}, {
			"label": "江北区",
			"value": "3281",
		}, {
			"label": "镇海区",
			"value": "3282",
		}, {
			"label": "北仑区",
			"value": "3283",
		}, {
			"label": "鄞州区",
			"value": "3284",
		}, {
			"label": "余姚市",
			"value": "3285",
		}, {
			"label": "慈溪市",
			"value": "3286",
		}, {
			"label": "奉化市",
			"value": "3287",
		}, {
			"label": "象山县",
			"value": "3288",
		}, {
			"label": "宁海县",
			"value": "3289",
		}]
	}, {
		"label": "绍兴市",
		"value": "389",
		"children": [{
			"label": "越城区",
			"value": "3290",
		}, {
			"label": "上虞市",
			"value": "3291",
		}, {
			"label": "嵊州市",
			"value": "3292",
		}, {
			"label": "绍兴县",
			"value": "3293",
		}, {
			"label": "新昌县",
			"value": "3294",
		}, {
			"label": "诸暨市",
			"value": "3295",
		}]
	}, {
		"label": "台州市",
		"value": "390",
		"children": [{
			"label": "椒江区",
			"value": "3296",
		}, {
			"label": "黄岩区",
			"value": "3297",
		}, {
			"label": "路桥区",
			"value": "3298",
		}, {
			"label": "温岭市",
			"value": "3299",
		}, {
			"label": "临海市",
			"value": "3300",
		}, {
			"label": "玉环县",
			"value": "3301",
		}, {
			"label": "三门县",
			"value": "3302",
		}, {
			"label": "天台县",
			"value": "3303",
		}, {
			"label": "仙居县",
			"value": "3304",
		}]
	}, {
		"label": "温州市",
		"value": "391",
		"children": [{
			"label": "鹿城区",
			"value": "3305",
		}, {
			"label": "龙湾区",
			"value": "3306",
		}, {
			"label": "瓯海区",
			"value": "3307",
		}, {
			"label": "瑞安市",
			"value": "3308",
		}, {
			"label": "乐清市",
			"value": "3309",
		}, {
			"label": "洞头县",
			"value": "3310",
		}, {
			"label": "永嘉县",
			"value": "3311",
		}, {
			"label": "平阳县",
			"value": "3312",
		}, {
			"label": "苍南县",
			"value": "3313",
		}, {
			"label": "文成县",
			"value": "3314",
		}, {
			"label": "泰顺县",
			"value": "3315",
		}]
	}, {
		"label": "舟山市",
		"value": "392",
		"children": [{
			"label": "定海区",
			"value": "3316",
		}, {
			"label": "普陀区",
			"value": "3317",
		}, {
			"label": "岱山县",
			"value": "3318",
		}, {
			"label": "嵊泗县",
			"value": "3319",
		}]
	}, {
		"label": "衢州市",
		"value": "393",
		"children": [{
			"label": "衢州市",
			"value": "3320",
		}, {
			"label": "江山市",
			"value": "3321",
		}, {
			"label": "常山县",
			"value": "3322",
		}, {
			"label": "开化县",
			"value": "3323",
		}, {
			"label": "龙游县",
			"value": "3324",
		}]
	}]
}, {
	"label": "重庆",
	"value": "32",
	"children": [{
		"label": "重庆市",
		"value": "394",
		"children": [{
			"label": "合川区",
			"value": "3325",
		}, {
			"label": "江津区",
			"value": "3326",
		}, {
			"label": "南川区",
			"value": "3327",
		}, {
			"label": "永川区",
			"value": "3328",
		}, {
			"label": "南岸区",
			"value": "3329",
		}, {
			"label": "渝北区",
			"value": "3330",
		}, {
			"label": "万盛区",
			"value": "3331",
		}, {
			"label": "大渡口区",
			"value": "3332",
		}, {
			"label": "万州区",
			"value": "3333",
		}, {
			"label": "北碚区",
			"value": "3334",
		}, {
			"label": "沙坪坝区",
			"value": "3335",
		}, {
			"label": "巴南区",
			"value": "3336",
		}, {
			"label": "涪陵区",
			"value": "3337",
		}, {
			"label": "江北区",
			"value": "3338",
		}, {
			"label": "九龙坡区",
			"value": "3339",
		}, {
			"label": "渝中区",
			"value": "3340",
		}, {
			"label": "黔江开发区",
			"value": "3341",
		}, {
			"label": "长寿区",
			"value": "3342",
		}, {
			"label": "双桥区",
			"value": "3343",
		}, {
			"label": "綦江县",
			"value": "3344",
		}, {
			"label": "潼南县",
			"value": "3345",
		}, {
			"label": "铜梁县",
			"value": "3346",
		}, {
			"label": "大足县",
			"value": "3347",
		}, {
			"label": "荣昌县",
			"value": "3348",
		}, {
			"label": "璧山县",
			"value": "3349",
		}, {
			"label": "垫江县",
			"value": "3350",
		}, {
			"label": "武隆县",
			"value": "3351",
		}, {
			"label": "丰都县",
			"value": "3352",
		}, {
			"label": "城口县",
			"value": "3353",
		}, {
			"label": "梁平县",
			"value": "3354",
		}, {
			"label": "开县",
			"value": "3355",
		}, {
			"label": "巫溪县",
			"value": "3356",
		}, {
			"label": "巫山县",
			"value": "3357",
		}, {
			"label": "奉节县",
			"value": "3358",
		}, {
			"label": "云阳县",
			"value": "3359",
		}, {
			"label": "忠县",
			"value": "3360",
		}, {
			"label": "石柱",
			"value": "3361",
		}, {
			"label": "彭水",
			"value": "3362",
		}, {
			"label": "酉阳",
			"value": "3363",
		}, {
			"label": "秀山",
			"value": "3364",
		}]
	}]
}, {
	"label": "香港",
	"value": "33",
	"children": [{
		"label": "香港",
		"value": "395",
		"children": [{
			"label": "沙田区",
			"value": "3365",
		}, {
			"label": "东区",
			"value": "3366",
		}, {
			"label": "观塘区",
			"value": "3367",
		}, {
			"label": "黄大仙区",
			"value": "3368",
		}, {
			"label": "九龙城区",
			"value": "3369",
		}, {
			"label": "屯门区",
			"value": "3370",
		}, {
			"label": "葵青区",
			"value": "3371",
		}, {
			"label": "元朗区",
			"value": "3372",
		}, {
			"label": "深水埗区",
			"value": "3373",
		}, {
			"label": "西贡区",
			"value": "3374",
		}, {
			"label": "大埔区",
			"value": "3375",
		}, {
			"label": "湾仔区",
			"value": "3376",
		}, {
			"label": "油尖旺区",
			"value": "3377",
		}, {
			"label": "北区",
			"value": "3378",
		}, {
			"label": "南区",
			"value": "3379",
		}, {
			"label": "荃湾区",
			"value": "3380",
		}, {
			"label": "中西区",
			"value": "3381",
		}, {
			"label": "离岛区",
			"value": "3382",
		}]
	}]
}, {
	"label": "澳门",
	"value": "34",
	"children": [{
		"label": "澳门",
		"value": "396",
		"children": [{
			"label": "澳门",
			"value": "3383",
		}]
	}]
}, {
	"label": "台湾",
	"value": "35",
	"children": [{
		"label": "台湾",
		"value": "397",
		"children": [{
			"label": "台北",
			"value": "3384",
		}, {
			"label": "高雄",
			"value": "3385",
		}, {
			"label": "基隆",
			"value": "3386",
		}, {
			"label": "台中",
			"value": "3387",
		}, {
			"label": "台南",
			"value": "3388",
		}, {
			"label": "新竹",
			"value": "3389",
		}, {
			"label": "嘉义",
			"value": "3390",
		}, {
			"label": "宜兰县",
			"value": "3391",
		}, {
			"label": "桃园县",
			"value": "3392",
		}, {
			"label": "苗栗县",
			"value": "3393",
		}, {
			"label": "彰化县",
			"value": "3394",
		}, {
			"label": "南投县",
			"value": "3395",
		}, {
			"label": "云林县",
			"value": "3396",
		}, {
			"label": "屏东县",
			"value": "3397",
		}, {
			"label": "台东县",
			"value": "3398",
		}, {
			"label": "花莲县",
			"value": "3399",
		}, {
			"label": "澎湖县",
			"value": "3400",
		}]
	}]
}]
const jd = [{
	"label": "北京",
	"value": "1",
	"children": [{
		"label": "朝阳区",
		"value": "72",
		"children": [{
			"label": "三环以内",
			"value": "2799",
		}, {
			"label": "三环到四环之间",
			"value": "2819",
		}, {
			"label": "四环到五环之间",
			"value": "2839",
		}, {
			"label": "五环到六环之间",
			"value": "2840",
		}, {
			"label": "管庄",
			"value": "4137",
		}, {
			"label": "北苑",
			"value": "4139",
		}, {
			"label": "定福庄",
			"value": "4211",
		}]
	}, {
		"label": "海淀区",
		"value": "2800",
		"children": [{
			"label": "三环以内",
			"value": "2848",
		}, {
			"label": "三环到四环之间",
			"value": "2849",
		}, {
			"label": "四环到五环之间",
			"value": "2850",
		}, {
			"label": "五环到六环之间",
			"value": "2851",
		}, {
			"label": "六环以外",
			"value": "2852",
		}, {
			"label": "西三旗",
			"value": "4134",
		}, {
			"label": "西二旗",
			"value": "4209",
		}]
	}, {
		"label": "西城区",
		"value": "2801",
		"children": [{
			"label": "内环到二环里",
			"value": "2827",
		}, {
			"label": "二环到三环",
			"value": "2853",
		}]
	}, {
		"label": "东城区",
		"value": "2802",
		"children": [{
			"label": "内环到三环里",
			"value": "2821",
		}]
	}, {
		"label": "崇文区",
		"value": "2803",
		"children": [{
			"label": "一环到二环",
			"value": "2829",
		}, {
			"label": "二环到三环",
			"value": "2842",
		}]
	}, {
		"label": "宣武区",
		"value": "2804",
		"children": [{
			"label": "内环到三环里",
			"value": "2828",
		}]
	}, {
		"label": "丰台区",
		"value": "2805",
		"children": [{
			"label": "四环到五环之间",
			"value": "2832",
		}, {
			"label": "二环到三环",
			"value": "2854",
		}, {
			"label": "三环到四环之间",
			"value": "2855",
		}, {
			"label": "五环到六环之间",
			"value": "10339",
		}, {
			"label": "六环之外",
			"value": "10340",
		}]
	}, {
		"label": "石景山区",
		"value": "2806",
		"children": [{
			"label": "四环到五环内",
			"value": "2831",
		}, {
			"label": "石景山城区",
			"value": "4187",
		}, {
			"label": "八大处科技园区",
			"value": "4188",
		}]
	}, {
		"label": "门头沟",
		"value": "2807",
		"children": [{
			"label": "龙泉镇",
			"value": "2843",
		}, {
			"label": "城区",
			"value": "6491",
		}, {
			"label": "永定镇",
			"value": "10341",
		}, {
			"label": "大台镇",
			"value": "10342",
		}, {
			"label": "潭柘寺镇",
			"value": "51528",
		}, {
			"label": "王平镇",
			"value": "51529",
		}, {
			"label": "军庄镇",
			"value": "51530",
		}, {
			"label": "妙峰山镇",
			"value": "51531",
		}, {
			"label": "雁翅镇",
			"value": "51532",
		}, {
			"label": "斋堂镇",
			"value": "51533",
		}, {
			"label": "清水镇",
			"value": "51534",
		}]
	}, {
		"label": "房山区",
		"value": "2808",
		"children": [{
			"label": "城区",
			"value": "2844",
		}, {
			"label": "大安山乡",
			"value": "6492",
		}, {
			"label": "大石窝镇",
			"value": "51535",
		}, {
			"label": "窦店镇",
			"value": "51536",
		}, {
			"label": "佛子庄乡",
			"value": "51537",
		}, {
			"label": "韩村河镇",
			"value": "51538",
		}, {
			"label": "河北镇",
			"value": "51539",
		}, {
			"label": "良乡镇",
			"value": "51540",
		}, {
			"label": "琉璃河镇",
			"value": "51541",
		}, {
			"label": "南窑乡",
			"value": "51542",
		}, {
			"label": "蒲洼乡",
			"value": "51543",
		}, {
			"label": "青龙湖镇",
			"value": "51544",
		}, {
			"label": "十渡镇",
			"value": "51545",
		}, {
			"label": "石楼镇",
			"value": "51546",
		}, {
			"label": "史家营乡",
			"value": "51547",
		}, {
			"label": "霞云岭乡",
			"value": "51548",
		}, {
			"label": "新镇",
			"value": "51549",
		}, {
			"label": "阎村镇",
			"value": "51550",
		}, {
			"label": "燕山地区",
			"value": "51551",
		}, {
			"label": "张坊镇",
			"value": "51552",
		}, {
			"label": "长沟镇",
			"value": "51553",
		}, {
			"label": "长阳镇",
			"value": "51554",
		}, {
			"label": "周口店镇",
			"value": "51555",
		}]
	}, {
		"label": "通州区",
		"value": "2809",
		"children": [{
			"label": "六环内（马驹桥镇）",
			"value": "51556",
		}, {
			"label": "六环外（马驹桥镇）",
			"value": "51557",
		}, {
			"label": "永顺镇",
			"value": "51558",
		}, {
			"label": "梨园镇",
			"value": "51559",
		}, {
			"label": "宋庄镇",
			"value": "51560",
		}, {
			"label": "漷县镇",
			"value": "51561",
		}, {
			"label": "张家湾镇",
			"value": "51562",
		}, {
			"label": "西集镇",
			"value": "51563",
		}, {
			"label": "永乐店镇",
			"value": "51564",
		}, {
			"label": "潞城镇",
			"value": "51565",
		}, {
			"label": "台湖镇",
			"value": "51566",
		}, {
			"label": "于家务乡",
			"value": "51567",
		}, {
			"label": "中仓街道",
			"value": "51568",
		}, {
			"label": "新华街道",
			"value": "51569",
		}, {
			"label": "玉桥街道",
			"value": "51570",
		}, {
			"label": "北苑街道",
			"value": "51571",
		}, {
			"label": "次渠镇",
			"value": "51572",
		}]
	}, {
		"label": "大兴区",
		"value": "2810",
		"children": [{
			"label": "四环至五环之间",
			"value": "4194",
		}, {
			"label": "六环以外",
			"value": "4205",
		}, {
			"label": "五环至六环之间",
			"value": "6501",
		}, {
			"label": "亦庄经济开发区",
			"value": "51573",
		}]
	}, {
		"label": "顺义区",
		"value": "2812",
		"children": [{
			"label": "李桥镇",
			"value": "51574",
		}, {
			"label": "李遂镇",
			"value": "51575",
		}, {
			"label": "龙湾屯镇",
			"value": "51576",
		}, {
			"label": "马坡地镇",
			"value": "51577",
		}, {
			"label": "木林镇",
			"value": "51578",
		}, {
			"label": "南彩镇",
			"value": "51579",
		}, {
			"label": "南法信地区",
			"value": "51580",
		}, {
			"label": "牛栏山地区",
			"value": "51581",
		}, {
			"label": "仁和地区",
			"value": "51582",
		}, {
			"label": "胜利街道",
			"value": "51583",
		}, {
			"label": "石园街道",
			"value": "51584",
		}, {
			"label": "双丰街道",
			"value": "51585",
		}, {
			"label": "天竺地区",
			"value": "51586",
		}, {
			"label": "旺泉街道",
			"value": "51587",
		}, {
			"label": "杨镇地区",
			"value": "51588",
		}, {
			"label": "张镇",
			"value": "51589",
		}, {
			"label": "赵全营镇",
			"value": "51590",
		}]
	}, {
		"label": "怀柔区",
		"value": "2814",
		"children": [{
			"label": "郊区",
			"value": "2847",
		}, {
			"label": "城区以内",
			"value": "6115",
		}]
	}, {
		"label": "密云区",
		"value": "2816",
		"children": [{
			"label": "城区以外",
			"value": "2862",
		}, {
			"label": "城区",
			"value": "6667",
		}]
	}, {
		"label": "昌平区",
		"value": "2901",
		"children": [{
			"label": "城区以外",
			"value": "2906",
		}, {
			"label": "六环以内",
			"value": "4135",
		}, {
			"label": "城区",
			"value": "4136",
		}]
	}, {
		"label": "平谷区",
		"value": "2953",
		"children": [{
			"label": "城区以外",
			"value": "2954",
		}, {
			"label": "城区",
			"value": "6666",
		}]
	}, {
		"label": "延庆县",
		"value": "3065",
		"children": [{
			"label": "延庆镇",
			"value": "51591",
		}, {
			"label": "城区",
			"value": "51592",
		}, {
			"label": "康庄镇",
			"value": "51593",
		}, {
			"label": "八达岭镇",
			"value": "51594",
		}, {
			"label": "永宁镇",
			"value": "51595",
		}, {
			"label": "旧县镇",
			"value": "51596",
		}, {
			"label": "张山营镇",
			"value": "51597",
		}, {
			"label": "四海镇",
			"value": "51598",
		}, {
			"label": "千家店镇",
			"value": "51599",
		}, {
			"label": "沈家营镇",
			"value": "51600",
		}, {
			"label": "大榆树镇",
			"value": "51601",
		}, {
			"label": "井庄镇",
			"value": "51602",
		}, {
			"label": "大庄科乡",
			"value": "51603",
		}, {
			"label": "刘斌堡乡",
			"value": "51604",
		}, {
			"label": "香营乡",
			"value": "51605",
		}, {
			"label": "珍珠泉乡",
			"value": "51606",
		}]
	}]
}, {
	"label": "上海",
	"value": "2",
	"children": [{
		"label": "黄浦区",
		"value": "78",
		"children": [{
			"label": "城区",
			"value": "79",
		}]
	}, {
		"label": "徐汇区",
		"value": "2813",
		"children": [{
			"label": "城区",
			"value": "2863",
		}]
	}, {
		"label": "长宁区",
		"value": "2815",
		"children": [{
			"label": "城区",
			"value": "2870",
		}]
	}, {
		"label": "静安区",
		"value": "2817",
		"children": [{
			"label": "城区",
			"value": "2873",
		}]
	}, {
		"label": "闸北区",
		"value": "2820",
		"children": [{
			"label": "城区",
			"value": "2879",
		}]
	}, {
		"label": "虹口区",
		"value": "2822",
		"children": [{
			"label": "城区",
			"value": "2856",
		}]
	}, {
		"label": "杨浦区",
		"value": "2823",
		"children": [{
			"label": "城区",
			"value": "2884",
		}]
	}, {
		"label": "宝山区",
		"value": "2824",
		"children": [{
			"label": "罗店镇",
			"value": "2889",
		}, {
			"label": "大场镇",
			"value": "2890",
		}, {
			"label": "杨行镇",
			"value": "2891",
		}, {
			"label": "月浦镇",
			"value": "51607",
		}, {
			"label": "罗泾镇",
			"value": "51608",
		}, {
			"label": "顾村镇",
			"value": "51609",
		}, {
			"label": "高境镇",
			"value": "51610",
		}, {
			"label": "庙行镇",
			"value": "51611",
		}, {
			"label": "淞南镇",
			"value": "51612",
		}, {
			"label": "宝山城市工业园区",
			"value": "51613",
		}, {
			"label": "城区",
			"value": "51614",
		}]
	}, {
		"label": "闵行区",
		"value": "2825",
		"children": [{
			"label": "城区",
			"value": "2892",
		}, {
			"label": "莘庄镇",
			"value": "51615",
		}, {
			"label": "七宝镇",
			"value": "51616",
		}, {
			"label": "浦江镇",
			"value": "51617",
		}, {
			"label": "梅陇镇",
			"value": "51618",
		}, {
			"label": "虹桥镇",
			"value": "51619",
		}, {
			"label": "马桥镇",
			"value": "51620",
		}, {
			"label": "吴泾镇",
			"value": "51621",
		}, {
			"label": "华漕镇",
			"value": "51622",
		}, {
			"label": "颛桥镇",
			"value": "51623",
		}]
	}, {
		"label": "嘉定区",
		"value": "2826",
		"children": [{
			"label": "城区",
			"value": "2864",
		}, {
			"label": "南翔镇",
			"value": "51624",
		}, {
			"label": "马陆镇",
			"value": "51625",
		}, {
			"label": "华亭镇",
			"value": "51626",
		}, {
			"label": "江桥镇",
			"value": "51627",
		}, {
			"label": "菊园新区",
			"value": "51628",
		}, {
			"label": "安亭镇",
			"value": "51629",
		}, {
			"label": "徐行镇",
			"value": "51630",
		}, {
			"label": "嘉定工业区",
			"value": "51631",
		}, {
			"label": "外冈镇",
			"value": "51632",
		}]
	}, {
		"label": "浦东新区",
		"value": "2830",
		"children": [{
			"label": "城区",
			"value": "2894",
		}, {
			"label": "川沙新区",
			"value": "2895",
		}, {
			"label": "高桥镇",
			"value": "2897",
		}, {
			"label": "北蔡镇",
			"value": "51633",
		}, {
			"label": "合庆镇",
			"value": "51634",
		}, {
			"label": "唐镇",
			"value": "51635",
		}, {
			"label": "曹路镇",
			"value": "51636",
		}, {
			"label": "金桥镇",
			"value": "51637",
		}, {
			"label": "高行镇",
			"value": "51638",
		}, {
			"label": "高东镇",
			"value": "51639",
		}, {
			"label": "张江镇",
			"value": "51640",
		}, {
			"label": "三林镇",
			"value": "51641",
		}, {
			"label": "南汇新城镇",
			"value": "51642",
		}, {
			"label": "祝桥镇",
			"value": "51643",
		}, {
			"label": "新场镇",
			"value": "51644",
		}, {
			"label": "惠南镇",
			"value": "51645",
		}, {
			"label": "康桥镇",
			"value": "51646",
		}, {
			"label": "宣桥镇",
			"value": "51647",
		}, {
			"label": "书院镇",
			"value": "51648",
		}, {
			"label": "大团镇",
			"value": "51649",
		}, {
			"label": "周浦镇",
			"value": "51650",
		}, {
			"label": "芦潮港镇",
			"value": "51651",
		}, {
			"label": "泥城镇",
			"value": "51652",
		}, {
			"label": "航头镇",
			"value": "51653",
		}, {
			"label": "万祥镇",
			"value": "51654",
		}, {
			"label": "老港镇",
			"value": "51655",
		}]
	}, {
		"label": "青浦区",
		"value": "2833",
		"children": [{
			"label": "城区",
			"value": "2869",
		}, {
			"label": "朱家角镇",
			"value": "51657",
		}, {
			"label": "赵巷镇",
			"value": "51658",
		}, {
			"label": "徐泾镇",
			"value": "51659",
		}, {
			"label": "华新镇",
			"value": "51660",
		}, {
			"label": "重固镇",
			"value": "51661",
		}, {
			"label": "白鹤镇",
			"value": "51662",
		}, {
			"label": "练塘镇",
			"value": "51663",
		}, {
			"label": "金泽镇",
			"value": "51664",
		}]
	}, {
		"label": "松江区",
		"value": "2834",
		"children": [{
			"label": "城区",
			"value": "2866",
		}, {
			"label": "泗泾镇",
			"value": "51665",
		}, {
			"label": "佘山镇",
			"value": "51666",
		}, {
			"label": "车墩镇",
			"value": "51667",
		}, {
			"label": "新桥镇",
			"value": "51668",
		}, {
			"label": "洞泾镇",
			"value": "51669",
		}, {
			"label": "九亭镇",
			"value": "51670",
		}, {
			"label": "泖港镇",
			"value": "51671",
		}, {
			"label": "石湖荡镇",
			"value": "51672",
		}, {
			"label": "新浜镇",
			"value": "51673",
		}, {
			"label": "叶榭镇",
			"value": "51674",
		}, {
			"label": "小昆山镇",
			"value": "51675",
		}]
	}, {
		"label": "金山区",
		"value": "2835",
		"children": [{
			"label": "城区",
			"value": "2868",
		}, {
			"label": "金山工业区",
			"value": "51676",
		}, {
			"label": "朱泾镇",
			"value": "51677",
		}, {
			"label": "枫泾镇",
			"value": "51678",
		}, {
			"label": "张堰镇",
			"value": "51679",
		}, {
			"label": "亭林镇",
			"value": "51680",
		}, {
			"label": "吕巷镇",
			"value": "51681",
		}, {
			"label": "廊下镇",
			"value": "51682",
		}, {
			"label": "金山卫镇",
			"value": "51683",
		}, {
			"label": "漕泾镇",
			"value": "51684",
		}, {
			"label": "山阳镇",
			"value": "51685",
		}]
	}, {
		"label": "南汇区",
		"value": "2836",
		"children": [{
			"label": "祝桥镇",
			"value": "2903",
		}, {
			"label": "新场镇",
			"value": "2904",
		}, {
			"label": "惠南镇",
			"value": "2935",
		}, {
			"label": "康桥镇",
			"value": "2937",
		}, {
			"label": "宣桥镇",
			"value": "2938",
		}, {
			"label": "书院镇",
			"value": "2939",
		}, {
			"label": "大团镇",
			"value": "2940",
		}, {
			"label": "周浦镇",
			"value": "2941",
		}, {
			"label": "芦潮港镇",
			"value": "2942",
		}, {
			"label": "泥城镇",
			"value": "2943",
		}, {
			"label": "六灶镇",
			"value": "2944",
		}, {
			"label": "航头镇",
			"value": "2945",
		}, {
			"label": "万祥镇",
			"value": "2946",
		}, {
			"label": "老港镇",
			"value": "2947",
		}, {
			"label": "申港街道",
			"value": "4159",
		}, {
			"label": "临港新城",
			"value": "4180",
		}]
	}, {
		"label": "奉贤区",
		"value": "2837",
		"children": [{
			"label": "南桥镇",
			"value": "2888",
		}, {
			"label": "奉城镇",
			"value": "51686",
		}, {
			"label": "四团镇",
			"value": "51687",
		}, {
			"label": "柘林镇",
			"value": "51688",
		}, {
			"label": "庄行镇",
			"value": "51689",
		}, {
			"label": "金汇镇",
			"value": "51690",
		}, {
			"label": "青村镇",
			"value": "51691",
		}, {
			"label": "海湾镇",
			"value": "51692",
		}]
	}, {
		"label": "普陀区",
		"value": "2841",
		"children": [{
			"label": "城区",
			"value": "2876",
		}]
	}, {
		"label": "崇明县",
		"value": "2919",
		"children": [{
			"label": "堡镇",
			"value": "51693",
		}, {
			"label": "庙镇",
			"value": "51694",
		}, {
			"label": "陈家镇",
			"value": "51695",
		}, {
			"label": "城桥镇",
			"value": "51696",
		}, {
			"label": "东平镇",
			"value": "51697",
		}, {
			"label": "港西镇",
			"value": "51698",
		}, {
			"label": "港沿镇",
			"value": "51699",
		}, {
			"label": "建设镇",
			"value": "51700",
		}, {
			"label": "绿华镇",
			"value": "51701",
		}, {
			"label": "三星镇",
			"value": "51702",
		}, {
			"label": "竖新镇",
			"value": "51703",
		}, {
			"label": "向化镇",
			"value": "51704",
		}, {
			"label": "新海镇",
			"value": "51705",
		}, {
			"label": "新河镇",
			"value": "51706",
		}, {
			"label": "中兴镇",
			"value": "51707",
		}, {
			"label": "长兴乡",
			"value": "51708",
		}, {
			"label": "横沙乡",
			"value": "51709",
		}, {
			"label": "新村乡",
			"value": "51710",
		}]
	}]
}, {
	"label": "天津",
	"value": "3",
	"children": [{
		"label": "东丽区",
		"value": "51711",
		"children": [{
			"label": "全境",
			"value": "51729",
		}]
	}, {
		"label": "和平区",
		"value": "51712",
		"children": [{
			"label": "全境",
			"value": "51731",
		}]
	}, {
		"label": "河北区",
		"value": "51713",
		"children": [{
			"label": "全境",
			"value": "51732",
		}]
	}, {
		"label": "河东区",
		"value": "51714",
		"children": [{
			"label": "全境",
			"value": "51733",
		}]
	}, {
		"label": "河西区",
		"value": "51715",
		"children": [{
			"label": "全境",
			"value": "51734",
		}]
	}, {
		"label": "红桥区",
		"value": "51716",
		"children": [{
			"label": "全境",
			"value": "51735",
		}]
	}, {
		"label": "蓟县",
		"value": "51717",
		"children": [{
			"label": "全境",
			"value": "51736",
		}]
	}, {
		"label": "静海县",
		"value": "51718",
		"children": [{
			"label": "全境",
			"value": "51737",
		}]
	}, {
		"label": "南开区",
		"value": "51719",
		"children": [{
			"label": "全境",
			"value": "51738",
		}]
	}, {
		"label": "塘沽区",
		"value": "51720",
		"children": [{
			"label": "全境",
			"value": "51739",
		}]
	}, {
		"label": "西青区",
		"value": "51721",
		"children": [{
			"label": "全境",
			"value": "51740",
		}, {
			"label": "其他地区",
			"value": "51741",
		}, {
			"label": "杨柳青，中北，精武，大寺镇，环外海泰及外环内",
			"value": "51742",
		}]
	}, {
		"label": "武清区",
		"value": "51722",
		"children": [{
			"label": "全境",
			"value": "51743",
		}]
	}, {
		"label": "津南区",
		"value": "51723",
		"children": [{
			"label": "咸水沽镇，海河教育园，海河科技园",
			"value": "51744",
		}, {
			"label": "双港，辛庄",
			"value": "51745",
		}, {
			"label": "其他地区",
			"value": "51746",
		}]
	}, {
		"label": "汉沽区",
		"value": "51724",
		"children": [{
			"label": "汉沽区街里，汉沽开发区",
			"value": "51747",
		}, {
			"label": "其他地区",
			"value": "51748",
		}]
	}, {
		"label": "大港区",
		"value": "51725",
		"children": [{
			"label": "大港油田",
			"value": "51749",
		}, {
			"label": "主城区内",
			"value": "51750",
		}, {
			"label": "主城区外",
			"value": "51751",
		}]
	}, {
		"label": "北辰区",
		"value": "51726",
		"children": [{
			"label": "外环内",
			"value": "51752",
		}, {
			"label": "外环外双街镇，河北工大新校，屈店工业园",
			"value": "51753",
		}, {
			"label": "外环外其他地区",
			"value": "51754",
		}]
	}, {
		"label": "宝坻区",
		"value": "51727",
		"children": [{
			"label": "城关镇，马家店开发区，天宝工业园",
			"value": "51755",
		}, {
			"label": "其他地区",
			"value": "51756",
		}]
	}, {
		"label": "宁河县",
		"value": "51728",
		"children": [{
			"label": "芦台镇，经济开发区，贸易开发区",
			"value": "51757",
		}, {
			"label": "其他地区",
			"value": "51758",
		}]
	}, {
		"label": "城区",
		"value": "52047",
		"children": []
	}, {
		"label": "长寿湖镇",
		"value": "52048",
		"children": []
	}, {
		"label": "领封镇",
		"value": "52049",
		"children": []
	}, {
		"label": "但渡镇",
		"value": "52050",
		"children": []
	}, {
		"label": "云集镇",
		"value": "52051",
		"children": []
	}, {
		"label": "双龙镇",
		"value": "52052",
		"children": []
	}, {
		"label": "龙河镇",
		"value": "52053",
		"children": []
	}, {
		"label": "石堰镇",
		"value": "52054",
		"children": []
	}, {
		"label": "云台镇",
		"value": "52055",
		"children": []
	}, {
		"label": "海棠镇",
		"value": "52056",
		"children": []
	}, {
		"label": "葛兰镇",
		"value": "52057",
		"children": []
	}, {
		"label": "新市镇",
		"value": "52058",
		"children": []
	}, {
		"label": "八颗镇",
		"value": "52059",
		"children": []
	}, {
		"label": "洪湖镇",
		"value": "52060",
		"children": []
	}, {
		"label": "万顺镇",
		"value": "52061",
		"children": []
	}]
}, {
	"label": "重庆",
	"value": "4",
	"children": [{
		"label": "万州区",
		"value": "113",
		"children": [{
			"label": "城区",
			"value": "9775",
		}, {
			"label": "白土镇",
			"value": "9786",
		}, {
			"label": "白羊镇",
			"value": "9787",
		}, {
			"label": "大周镇",
			"value": "9788",
		}, {
			"label": "弹子镇",
			"value": "9789",
		}, {
			"label": "分水镇",
			"value": "9790",
		}, {
			"label": "甘宁镇",
			"value": "9791",
		}, {
			"label": "高峰镇",
			"value": "9792",
		}, {
			"label": "高梁镇",
			"value": "9793",
		}, {
			"label": "后山镇",
			"value": "9794",
		}, {
			"label": "李河镇",
			"value": "9795",
		}, {
			"label": "龙驹镇",
			"value": "9796",
		}, {
			"label": "龙沙镇",
			"value": "9797",
		}, {
			"label": "罗田镇",
			"value": "9798",
		}, {
			"label": "孙家镇",
			"value": "9799",
		}, {
			"label": "太安镇",
			"value": "9800",
		}, {
			"label": "太龙镇",
			"value": "9801",
		}, {
			"label": "天城镇",
			"value": "9802",
		}, {
			"label": "武陵镇",
			"value": "9803",
		}, {
			"label": "响水镇",
			"value": "9804",
		}, {
			"label": "小周镇",
			"value": "9805",
		}, {
			"label": "新田镇",
			"value": "9806",
		}, {
			"label": "新乡镇",
			"value": "9807",
		}, {
			"label": "熊家镇",
			"value": "9808",
		}, {
			"label": "余家镇",
			"value": "9809",
		}, {
			"label": "长岭镇",
			"value": "9810",
		}, {
			"label": "长坪镇",
			"value": "9811",
		}, {
			"label": "长滩镇",
			"value": "9812",
		}, {
			"label": "走马镇",
			"value": "9813",
		}, {
			"label": "瀼渡镇",
			"value": "9814",
		}, {
			"label": "茨竹乡",
			"value": "9815",
		}, {
			"label": "柱山乡",
			"value": "9816",
		}, {
			"label": "燕山乡",
			"value": "9817",
		}, {
			"label": "溪口乡",
			"value": "9818",
		}, {
			"label": "普子乡",
			"value": "9819",
		}, {
			"label": "地宝乡",
			"value": "9820",
		}, {
			"label": "铁峰乡",
			"value": "9821",
		}, {
			"label": "黄柏乡",
			"value": "9822",
		}, {
			"label": "九池乡",
			"value": "9823",
		}, {
			"label": "梨树乡",
			"value": "9824",
		}, {
			"label": "郭村乡",
			"value": "9825",
		}, {
			"label": "恒合乡",
			"value": "9826",
		}]
	}, {
		"label": "涪陵区",
		"value": "114",
		"children": [{
			"label": "城区",
			"value": "9893",
		}, {
			"label": "李渡镇",
			"value": "9898",
		}, {
			"label": "白涛镇",
			"value": "9899",
		}, {
			"label": "百胜镇",
			"value": "9900",
		}, {
			"label": "堡子镇",
			"value": "9901",
		}, {
			"label": "焦石镇",
			"value": "9902",
		}, {
			"label": "蔺市镇",
			"value": "9903",
		}, {
			"label": "龙桥镇",
			"value": "9904",
		}, {
			"label": "龙潭镇",
			"value": "9905",
		}, {
			"label": "马武镇",
			"value": "9906",
		}, {
			"label": "南沱镇",
			"value": "9907",
		}, {
			"label": "青羊镇",
			"value": "9908",
		}, {
			"label": "清溪镇",
			"value": "9909",
		}, {
			"label": "石沱镇",
			"value": "9910",
		}, {
			"label": "新妙镇",
			"value": "9911",
		}, {
			"label": "义和镇",
			"value": "9912",
		}, {
			"label": "增福乡",
			"value": "9913",
		}, {
			"label": "珍溪镇",
			"value": "9914",
		}, {
			"label": "镇安镇",
			"value": "9915",
		}, {
			"label": "致韩镇",
			"value": "9916",
		}, {
			"label": "土地坡乡",
			"value": "9917",
		}, {
			"label": "武陵山乡",
			"value": "9918",
		}, {
			"label": "中峰乡",
			"value": "9919",
		}, {
			"label": "梓里乡",
			"value": "9920",
		}, {
			"label": "丛林乡",
			"value": "9921",
		}, {
			"label": "大木乡",
			"value": "9922",
		}, {
			"label": "惠民乡",
			"value": "9923",
		}, {
			"label": "酒店乡",
			"value": "9924",
		}, {
			"label": "聚宝乡",
			"value": "9925",
		}, {
			"label": "卷洞乡",
			"value": "9926",
		}, {
			"label": "两汇乡",
			"value": "9927",
		}, {
			"label": "罗云乡",
			"value": "9928",
		}, {
			"label": "明家乡",
			"value": "9929",
		}, {
			"label": "仁义乡",
			"value": "9930",
		}, {
			"label": "山窝乡",
			"value": "9931",
		}, {
			"label": "石和乡",
			"value": "9932",
		}, {
			"label": "石龙乡",
			"value": "9933",
		}, {
			"label": "太和乡",
			"value": "9934",
		}, {
			"label": "天台乡",
			"value": "9935",
		}, {
			"label": "同乐乡",
			"value": "9936",
		}, {
			"label": "新村乡",
			"value": "9937",
		}]
	}, {
		"label": "梁平区",
		"value": "115",
		"children": [{
			"label": "梁山镇",
			"value": "9938",
		}, {
			"label": "柏家镇",
			"value": "9939",
		}, {
			"label": "碧山镇",
			"value": "9940",
		}, {
			"label": "大观镇",
			"value": "9941",
		}, {
			"label": "福禄镇",
			"value": "9942",
		}, {
			"label": "合兴镇",
			"value": "9943",
		}, {
			"label": "和林镇",
			"value": "9944",
		}, {
			"label": "虎城镇",
			"value": "9945",
		}, {
			"label": "回龙镇",
			"value": "9946",
		}, {
			"label": "金带镇",
			"value": "9947",
		}, {
			"label": "聚奎镇",
			"value": "9948",
		}, {
			"label": "礼让镇",
			"value": "9949",
		}, {
			"label": "龙门镇",
			"value": "9950",
		}, {
			"label": "明达镇",
			"value": "9951",
		}, {
			"label": "蟠龙镇",
			"value": "9952",
		}, {
			"label": "屏锦镇",
			"value": "9953",
		}, {
			"label": "仁贤镇",
			"value": "9954",
		}, {
			"label": "石安镇",
			"value": "9955",
		}, {
			"label": "文化镇",
			"value": "9956",
		}, {
			"label": "新盛镇",
			"value": "9957",
		}, {
			"label": "荫平镇",
			"value": "9958",
		}, {
			"label": "袁驿镇",
			"value": "9959",
		}, {
			"label": "云龙镇",
			"value": "9960",
		}, {
			"label": "竹山镇",
			"value": "9961",
		}, {
			"label": "安胜乡",
			"value": "9962",
		}, {
			"label": "铁门乡",
			"value": "9963",
		}, {
			"label": "紫照乡",
			"value": "9964",
		}, {
			"label": "曲水乡",
			"value": "9965",
		}, {
			"label": "龙胜乡",
			"value": "9966",
		}, {
			"label": "城北乡",
			"value": "9967",
		}, {
			"label": "城东乡",
			"value": "9968",
		}, {
			"label": "复平乡",
			"value": "9969",
		}, {
			"label": "县城内",
			"value": "51759",
		}]
	}, {
		"label": "南川区",
		"value": "119",
		"children": [{
			"label": "城区",
			"value": "9970",
		}, {
			"label": "大观镇",
			"value": "9974",
		}, {
			"label": "大有镇",
			"value": "9975",
		}, {
			"label": "合溪镇",
			"value": "9976",
		}, {
			"label": "金山镇",
			"value": "9977",
		}, {
			"label": "鸣玉镇",
			"value": "9978",
		}, {
			"label": "南平镇",
			"value": "9979",
		}, {
			"label": "三泉镇",
			"value": "9980",
		}, {
			"label": "神童镇",
			"value": "9981",
		}, {
			"label": "石墙镇",
			"value": "9982",
		}, {
			"label": "水江镇",
			"value": "9983",
		}, {
			"label": "头渡镇",
			"value": "9984",
		}, {
			"label": "兴隆镇",
			"value": "9985",
		}, {
			"label": "冷水关乡",
			"value": "9986",
		}, {
			"label": "德隆乡",
			"value": "9987",
		}, {
			"label": "峰岩乡",
			"value": "9988",
		}, {
			"label": "福寿乡",
			"value": "9989",
		}, {
			"label": "古花乡",
			"value": "9990",
		}, {
			"label": "河图乡",
			"value": "9991",
		}, {
			"label": "民主乡",
			"value": "9992",
		}, {
			"label": "木凉乡",
			"value": "9993",
		}, {
			"label": "乾丰乡",
			"value": "9994",
		}, {
			"label": "庆元乡",
			"value": "9995",
		}, {
			"label": "石莲乡",
			"value": "9996",
		}, {
			"label": "石溪乡",
			"value": "9997",
		}, {
			"label": "铁村乡",
			"value": "9998",
		}, {
			"label": "土溪乡",
			"value": "9999",
		}, {
			"label": "鱼泉乡",
			"value": "10000",
		}, {
			"label": "中桥乡",
			"value": "10001",
		}, {
			"label": "太平场镇",
			"value": "51760",
		}]
	}, {
		"label": "潼南区",
		"value": "123",
		"children": [{
			"label": "县城内",
			"value": "9754",
		}, {
			"label": "柏梓镇",
			"value": "9756",
		}, {
			"label": "宝龙镇",
			"value": "9757",
		}, {
			"label": "崇龛镇",
			"value": "9758",
		}, {
			"label": "古溪镇",
			"value": "9759",
		}, {
			"label": "龙形镇",
			"value": "9760",
		}, {
			"label": "米心镇",
			"value": "9761",
		}, {
			"label": "群力镇",
			"value": "9762",
		}, {
			"label": "上和镇",
			"value": "9763",
		}, {
			"label": "双江镇",
			"value": "9764",
		}, {
			"label": "太安镇",
			"value": "9765",
		}, {
			"label": "塘坝镇",
			"value": "9766",
		}, {
			"label": "卧佛镇",
			"value": "9767",
		}, {
			"label": "五桂镇",
			"value": "9768",
		}, {
			"label": "小渡镇",
			"value": "9769",
		}, {
			"label": "新胜镇",
			"value": "9770",
		}, {
			"label": "玉溪镇",
			"value": "9771",
		}, {
			"label": "别口乡",
			"value": "9772",
		}, {
			"label": "田家乡",
			"value": "9773",
		}, {
			"label": "寿桥乡",
			"value": "9774",
		}]
	}, {
		"label": "大足区",
		"value": "126",
		"children": [{
			"label": "龙滩子区",
			"value": "51761",
		}, {
			"label": "龙水镇",
			"value": "51762",
		}, {
			"label": "智凤镇",
			"value": "51763",
		}, {
			"label": "宝顶镇",
			"value": "51764",
		}, {
			"label": "中敖镇",
			"value": "51765",
		}, {
			"label": "三驱镇",
			"value": "51766",
		}, {
			"label": "宝兴镇",
			"value": "51767",
		}, {
			"label": "玉龙镇",
			"value": "51768",
		}, {
			"label": "石马镇",
			"value": "51769",
		}, {
			"label": "拾万镇",
			"value": "51770",
		}, {
			"label": "回龙镇",
			"value": "51771",
		}, {
			"label": "金山镇",
			"value": "51772",
		}, {
			"label": "万古镇",
			"value": "51773",
		}, {
			"label": "国梁镇",
			"value": "51774",
		}, {
			"label": "雍溪镇",
			"value": "51775",
		}, {
			"label": "珠溪镇",
			"value": "51776",
		}, {
			"label": "龙石镇",
			"value": "51777",
		}, {
			"label": "邮亭镇",
			"value": "51778",
		}, {
			"label": "铁山镇",
			"value": "51779",
		}, {
			"label": "高升镇",
			"value": "51780",
		}, {
			"label": "季家镇",
			"value": "51781",
		}, {
			"label": "古龙镇",
			"value": "51782",
		}, {
			"label": "高坪镇",
			"value": "51783",
		}, {
			"label": "双路镇",
			"value": "51784",
		}, {
			"label": "通桥镇",
			"value": "51785",
		}, {
			"label": "城区",
			"value": "51786",
		}]
	}, {
		"label": "黔江区",
		"value": "128",
		"children": [{
			"label": "城区",
			"value": "10002",
		}, {
			"label": "阿蓬江镇",
			"value": "10007",
		}, {
			"label": "小南海镇",
			"value": "10008",
		}, {
			"label": "鹅池镇",
			"value": "10009",
		}, {
			"label": "冯家镇",
			"value": "10010",
		}, {
			"label": "黑溪镇",
			"value": "10011",
		}, {
			"label": "黄溪镇",
			"value": "10012",
		}, {
			"label": "金溪镇",
			"value": "10013",
		}, {
			"label": "黎水镇",
			"value": "10014",
		}, {
			"label": "邻鄂镇",
			"value": "10015",
		}, {
			"label": "马喇镇",
			"value": "10016",
		}, {
			"label": "石会镇",
			"value": "10017",
		}, {
			"label": "石家镇",
			"value": "10018",
		}, {
			"label": "濯水镇",
			"value": "10019",
		}, {
			"label": "白石乡",
			"value": "10020",
		}, {
			"label": "白土乡",
			"value": "10021",
		}, {
			"label": "金洞乡",
			"value": "10022",
		}, {
			"label": "蓬东乡",
			"value": "10023",
		}, {
			"label": "沙坝乡",
			"value": "10024",
		}, {
			"label": "杉岭乡",
			"value": "10025",
		}, {
			"label": "水市乡",
			"value": "10026",
		}, {
			"label": "水田乡",
			"value": "10027",
		}, {
			"label": "太极乡",
			"value": "10028",
		}, {
			"label": "五里乡",
			"value": "10029",
		}, {
			"label": "新华乡",
			"value": "10030",
		}, {
			"label": "中塘乡",
			"value": "10031",
		}, {
			"label": "正阳镇",
			"value": "51787",
		}, {
			"label": "舟白镇",
			"value": "51788",
		}]
	}, {
		"label": "武隆区",
		"value": "129",
		"children": [{
			"label": "仙女山镇",
			"value": "10032",
		}, {
			"label": "巷口镇",
			"value": "10033",
		}, {
			"label": "白马镇",
			"value": "10034",
		}, {
			"label": "火炉镇",
			"value": "10035",
		}, {
			"label": "江口镇",
			"value": "10036",
		}, {
			"label": "平桥镇",
			"value": "10037",
		}, {
			"label": "桐梓镇",
			"value": "10038",
		}, {
			"label": "土坎镇",
			"value": "10039",
		}, {
			"label": "鸭江镇",
			"value": "10040",
		}, {
			"label": "羊角镇",
			"value": "10041",
		}, {
			"label": "长坝镇",
			"value": "10042",
		}, {
			"label": "白云乡",
			"value": "10043",
		}, {
			"label": "沧沟乡",
			"value": "10044",
		}, {
			"label": "凤来乡",
			"value": "10045",
		}, {
			"label": "浩口乡",
			"value": "10046",
		}, {
			"label": "和顺乡",
			"value": "10047",
		}, {
			"label": "后坪乡",
			"value": "10048",
		}, {
			"label": "黄莺乡",
			"value": "10049",
		}, {
			"label": "接龙乡",
			"value": "10050",
		}, {
			"label": "庙垭乡",
			"value": "10051",
		}, {
			"label": "石桥乡",
			"value": "10052",
		}, {
			"label": "双河乡",
			"value": "10053",
		}, {
			"label": "铁矿乡",
			"value": "10054",
		}, {
			"label": "土地乡",
			"value": "10055",
		}, {
			"label": "文复乡",
			"value": "10056",
		}, {
			"label": "赵家乡",
			"value": "10057",
		}, {
			"label": "县城内",
			"value": "51789",
		}]
	}, {
		"label": "丰都县",
		"value": "130",
		"children": [{
			"label": "县城内",
			"value": "10058",
		}, {
			"label": "南天湖镇",
			"value": "10059",
		}, {
			"label": "许明寺镇",
			"value": "10060",
		}, {
			"label": "包鸾镇",
			"value": "10061",
		}, {
			"label": "董家镇",
			"value": "10062",
		}, {
			"label": "高家镇",
			"value": "10063",
		}, {
			"label": "虎威镇",
			"value": "10064",
		}, {
			"label": "江池镇",
			"value": "10065",
		}, {
			"label": "龙河镇",
			"value": "10066",
		}, {
			"label": "名山镇",
			"value": "10067",
		}, {
			"label": "三元镇",
			"value": "10068",
		}, {
			"label": "社坛镇",
			"value": "10069",
		}, {
			"label": "十直镇",
			"value": "10070",
		}, {
			"label": "树人镇",
			"value": "10071",
		}, {
			"label": "双路镇",
			"value": "10072",
		}, {
			"label": "武平镇",
			"value": "10073",
		}, {
			"label": "兴义镇",
			"value": "10074",
		}, {
			"label": "湛普镇",
			"value": "10075",
		}, {
			"label": "镇江镇",
			"value": "10076",
		}, {
			"label": "太平坝乡",
			"value": "10077",
		}, {
			"label": "双龙场乡",
			"value": "10078",
		}, {
			"label": "保合乡",
			"value": "10079",
		}, {
			"label": "崇兴乡",
			"value": "10080",
		}, {
			"label": "都督乡",
			"value": "10081",
		}, {
			"label": "暨龙乡",
			"value": "10082",
		}, {
			"label": "栗子乡",
			"value": "10083",
		}, {
			"label": "龙孔乡",
			"value": "10084",
		}, {
			"label": "青龙乡",
			"value": "10085",
		}, {
			"label": "仁沙乡",
			"value": "10086",
		}, {
			"label": "三坝乡",
			"value": "10087",
		}, {
			"label": "三建乡",
			"value": "10088",
		}]
	}, {
		"label": "奉节县",
		"value": "131",
		"children": [{
			"label": "县城内",
			"value": "51790",
		}, {
			"label": "永安镇",
			"value": "51791",
		}, {
			"label": "白帝镇",
			"value": "51792",
		}, {
			"label": "草堂镇",
			"value": "51793",
		}, {
			"label": "大树镇",
			"value": "51794",
		}, {
			"label": "汾河镇",
			"value": "51795",
		}, {
			"label": "公平镇",
			"value": "51796",
		}, {
			"label": "甲高镇",
			"value": "51797",
		}, {
			"label": "康乐镇",
			"value": "51798",
		}, {
			"label": "青龙镇",
			"value": "51799",
		}, {
			"label": "吐祥镇",
			"value": "51800",
		}, {
			"label": "新民镇",
			"value": "51801",
		}, {
			"label": "兴隆镇",
			"value": "51802",
		}, {
			"label": "羊市镇",
			"value": "51803",
		}, {
			"label": "朱衣镇",
			"value": "51804",
		}, {
			"label": "竹园镇",
			"value": "51805",
		}, {
			"label": "安坪乡",
			"value": "51806",
		}, {
			"label": "冯坪乡",
			"value": "51807",
		}, {
			"label": "鹤峰乡",
			"value": "51808",
		}, {
			"label": "红土乡",
			"value": "51809",
		}, {
			"label": "康坪乡",
			"value": "51810",
		}, {
			"label": "龙桥乡",
			"value": "51811",
		}, {
			"label": "平安乡",
			"value": "51812",
		}, {
			"label": "石岗乡",
			"value": "51813",
		}, {
			"label": "太和乡",
			"value": "51814",
		}, {
			"label": "五马乡",
			"value": "51815",
		}, {
			"label": "新政乡",
			"value": "51816",
		}, {
			"label": "岩湾乡",
			"value": "51817",
		}, {
			"label": "云雾乡",
			"value": "51818",
		}, {
			"label": "长安乡",
			"value": "51819",
		}]
	}, {
		"label": "开县",
		"value": "132",
		"children": [{
			"label": "九龙山镇",
			"value": "9831",
		}, {
			"label": "大进镇",
			"value": "9832",
		}, {
			"label": "敦好镇",
			"value": "9833",
		}, {
			"label": "高桥镇",
			"value": "9834",
		}, {
			"label": "郭家镇",
			"value": "9835",
		}, {
			"label": "和谦镇",
			"value": "9836",
		}, {
			"label": "河堰镇",
			"value": "9837",
		}, {
			"label": "厚坝镇",
			"value": "9838",
		}, {
			"label": "临江镇",
			"value": "9839",
		}, {
			"label": "南门镇",
			"value": "9840",
		}, {
			"label": "南雅镇",
			"value": "9841",
		}, {
			"label": "渠口镇",
			"value": "9842",
		}, {
			"label": "铁桥镇",
			"value": "9843",
		}, {
			"label": "温泉镇",
			"value": "9844",
		}, {
			"label": "义和镇",
			"value": "9845",
		}, {
			"label": "长沙镇",
			"value": "9846",
		}, {
			"label": "赵家镇",
			"value": "9847",
		}, {
			"label": "镇安镇",
			"value": "9848",
		}, {
			"label": "中和镇",
			"value": "9849",
		}, {
			"label": "竹溪镇",
			"value": "9850",
		}, {
			"label": "三汇口乡",
			"value": "9851",
		}, {
			"label": "白桥乡",
			"value": "9852",
		}, {
			"label": "大德乡",
			"value": "9853",
		}, {
			"label": "关面乡",
			"value": "9854",
		}, {
			"label": "金峰乡",
			"value": "9855",
		}, {
			"label": "麻柳乡",
			"value": "9856",
		}, {
			"label": "满月乡",
			"value": "9857",
		}, {
			"label": "谭家乡",
			"value": "9858",
		}, {
			"label": "天和乡",
			"value": "9859",
		}, {
			"label": "巫山镇",
			"value": "9860",
		}, {
			"label": "五通乡",
			"value": "9861",
		}, {
			"label": "紫水乡",
			"value": "9862",
		}, {
			"label": "县城内",
			"value": "51821",
		}, {
			"label": "白桥镇",
			"value": "51822",
		}, {
			"label": "大德镇",
			"value": "51823",
		}, {
			"label": "金峰镇",
			"value": "51824",
		}, {
			"label": "谭家镇",
			"value": "51825",
		}, {
			"label": "天和镇",
			"value": "51826",
		}, {
			"label": "白泉乡",
			"value": "51827",
		}, {
			"label": "岳溪镇",
			"value": "51828",
		}]
	}, {
		"label": "云阳县",
		"value": "133",
		"children": [{
			"label": "县城内",
			"value": "10089",
		}, {
			"label": "云阳镇",
			"value": "10091",
		}, {
			"label": "巴阳镇",
			"value": "10092",
		}, {
			"label": "凤鸣镇",
			"value": "10093",
		}, {
			"label": "高阳镇",
			"value": "10094",
		}, {
			"label": "故陵镇",
			"value": "10095",
		}, {
			"label": "红狮镇",
			"value": "10096",
		}, {
			"label": "黄石镇",
			"value": "10097",
		}, {
			"label": "江口镇",
			"value": "10098",
		}, {
			"label": "龙角镇",
			"value": "10099",
		}, {
			"label": "路阳镇",
			"value": "10100",
		}, {
			"label": "南溪镇",
			"value": "10101",
		}, {
			"label": "农坝镇",
			"value": "10102",
		}, {
			"label": "盘龙镇",
			"value": "10103",
		}, {
			"label": "平安镇",
			"value": "10104",
		}, {
			"label": "渠马镇",
			"value": "10105",
		}, {
			"label": "人和镇",
			"value": "10106",
		}, {
			"label": "桑坪镇",
			"value": "10107",
		}, {
			"label": "沙市镇",
			"value": "10108",
		}, {
			"label": "双土镇",
			"value": "10109",
		}, {
			"label": "鱼泉镇",
			"value": "10110",
		}, {
			"label": "云安镇",
			"value": "10111",
		}, {
			"label": "洞鹿乡",
			"value": "10112",
		}, {
			"label": "后叶乡",
			"value": "10113",
		}, {
			"label": "龙洞乡",
			"value": "10114",
		}, {
			"label": "毛坝乡",
			"value": "10115",
		}, {
			"label": "泥溪乡",
			"value": "10116",
		}, {
			"label": "票草乡",
			"value": "10117",
		}, {
			"label": "普安乡",
			"value": "10118",
		}, {
			"label": "栖霞乡",
			"value": "10119",
		}, {
			"label": "清水乡",
			"value": "10120",
		}, {
			"label": "上坝乡",
			"value": "10121",
		}, {
			"label": "石门乡",
			"value": "10122",
		}, {
			"label": "双龙乡",
			"value": "10123",
		}, {
			"label": "水口乡",
			"value": "10124",
		}, {
			"label": "外郎乡",
			"value": "10125",
		}, {
			"label": "新津乡",
			"value": "10126",
		}, {
			"label": "堰坪乡",
			"value": "10127",
		}, {
			"label": "养鹿乡",
			"value": "10128",
		}, {
			"label": "耀灵乡",
			"value": "10129",
		}, {
			"label": "云硐乡",
			"value": "10130",
		}]
	}, {
		"label": "忠县",
		"value": "134",
		"children": [{
			"label": "忠州镇",
			"value": "10131",
		}, {
			"label": "拔山镇",
			"value": "10132",
		}, {
			"label": "白石镇",
			"value": "10133",
		}, {
			"label": "东溪镇",
			"value": "10134",
		}, {
			"label": "复兴镇",
			"value": "10135",
		}, {
			"label": "官坝镇",
			"value": "10136",
		}, {
			"label": "花桥镇",
			"value": "10137",
		}, {
			"label": "黄金镇",
			"value": "10138",
		}, {
			"label": "金鸡镇",
			"value": "10139",
		}, {
			"label": "马灌镇",
			"value": "10140",
		}, {
			"label": "任家镇",
			"value": "10141",
		}, {
			"label": "汝溪镇",
			"value": "10142",
		}, {
			"label": "三汇镇",
			"value": "10143",
		}, {
			"label": "石宝镇",
			"value": "10144",
		}, {
			"label": "石黄镇",
			"value": "10145",
		}, {
			"label": "双桂镇",
			"value": "10146",
		}, {
			"label": "乌杨镇",
			"value": "10147",
		}, {
			"label": "新生镇",
			"value": "10148",
		}, {
			"label": "洋渡镇",
			"value": "10149",
		}, {
			"label": "野鹤镇",
			"value": "10150",
		}, {
			"label": "永丰镇",
			"value": "10151",
		}, {
			"label": "金声乡",
			"value": "10152",
		}, {
			"label": "磨子乡",
			"value": "10153",
		}, {
			"label": "善广乡",
			"value": "10154",
		}, {
			"label": "石子乡",
			"value": "10155",
		}, {
			"label": "涂井乡",
			"value": "10156",
		}, {
			"label": "兴峰乡",
			"value": "10157",
		}, {
			"label": "新立镇",
			"value": "51829",
		}, {
			"label": "县城内",
			"value": "51830",
		}]
	}, {
		"label": "巫溪县",
		"value": "135",
		"children": [{
			"label": "城厢镇",
			"value": "10158",
		}, {
			"label": "凤凰镇",
			"value": "10159",
		}, {
			"label": "古路镇",
			"value": "10160",
		}, {
			"label": "尖山镇",
			"value": "10161",
		}, {
			"label": "宁厂镇",
			"value": "10162",
		}, {
			"label": "上磺镇",
			"value": "10163",
		}, {
			"label": "文峰镇",
			"value": "10164",
		}, {
			"label": "下堡镇",
			"value": "10165",
		}, {
			"label": "徐家镇",
			"value": "10166",
		}, {
			"label": "朝阳洞乡",
			"value": "10167",
		}, {
			"label": "大河乡",
			"value": "10168",
		}, {
			"label": "峰灵乡",
			"value": "10169",
		}, {
			"label": "花台乡",
			"value": "10170",
		}, {
			"label": "兰英乡",
			"value": "10171",
		}, {
			"label": "菱角乡",
			"value": "10172",
		}, {
			"label": "蒲莲乡",
			"value": "10173",
		}, {
			"label": "胜利乡",
			"value": "10174",
		}, {
			"label": "双阳乡",
			"value": "10175",
		}, {
			"label": "塘坊乡",
			"value": "10176",
		}, {
			"label": "天星乡",
			"value": "10177",
		}, {
			"label": "天元乡",
			"value": "10178",
		}, {
			"label": "田坝乡",
			"value": "10179",
		}, {
			"label": "通城乡",
			"value": "10180",
		}, {
			"label": "土城乡",
			"value": "10181",
		}, {
			"label": "乌龙乡",
			"value": "10182",
		}, {
			"label": "鱼鳞乡",
			"value": "10183",
		}, {
			"label": "长桂乡",
			"value": "10184",
		}, {
			"label": "中岗乡",
			"value": "10185",
		}, {
			"label": "中梁乡",
			"value": "10186",
		}, {
			"label": "县城内",
			"value": "51831",
		}]
	}, {
		"label": "巫山县",
		"value": "136",
		"children": [{
			"label": "巫峡镇",
			"value": "10187",
		}, {
			"label": "大昌镇",
			"value": "10188",
		}, {
			"label": "福田镇",
			"value": "10189",
		}, {
			"label": "官渡镇",
			"value": "10190",
		}, {
			"label": "官阳镇",
			"value": "10191",
		}, {
			"label": "龙溪镇",
			"value": "10192",
		}, {
			"label": "骡坪镇",
			"value": "10193",
		}, {
			"label": "庙堂乡",
			"value": "10194",
		}, {
			"label": "庙宇镇",
			"value": "10195",
		}, {
			"label": "双龙镇",
			"value": "10196",
		}, {
			"label": "铜鼓镇",
			"value": "10197",
		}, {
			"label": "抱龙镇",
			"value": "10198",
		}, {
			"label": "大溪乡",
			"value": "10199",
		}, {
			"label": "当阳乡",
			"value": "10200",
		}, {
			"label": "邓家乡",
			"value": "10201",
		}, {
			"label": "笃坪乡",
			"value": "10202",
		}, {
			"label": "红椿乡",
			"value": "10203",
		}, {
			"label": "建平乡",
			"value": "10204",
		}, {
			"label": "金坪乡",
			"value": "10205",
		}, {
			"label": "两坪乡",
			"value": "10206",
		}, {
			"label": "龙井乡",
			"value": "10207",
		}, {
			"label": "培石乡",
			"value": "10208",
		}, {
			"label": "平河乡",
			"value": "10209",
		}, {
			"label": "曲尺乡",
			"value": "10210",
		}, {
			"label": "三溪乡",
			"value": "10211",
		}, {
			"label": "竹贤乡",
			"value": "10212",
		}, {
			"label": "县城内",
			"value": "51832",
		}]
	}, {
		"label": "石柱县",
		"value": "137",
		"children": [{
			"label": "南宾镇",
			"value": "10213",
		}, {
			"label": "黄水镇",
			"value": "10214",
		}, {
			"label": "临溪镇",
			"value": "10215",
		}, {
			"label": "龙沙镇",
			"value": "10216",
		}, {
			"label": "马武镇",
			"value": "10217",
		}, {
			"label": "沙子镇",
			"value": "10218",
		}, {
			"label": "王场镇",
			"value": "10219",
		}, {
			"label": "西沱镇",
			"value": "10220",
		}, {
			"label": "下路镇",
			"value": "10221",
		}, {
			"label": "沿溪镇",
			"value": "10222",
		}, {
			"label": "渔池镇",
			"value": "10223",
		}, {
			"label": "悦崃镇",
			"value": "10224",
		}, {
			"label": "大歇乡",
			"value": "10225",
		}, {
			"label": "枫木乡",
			"value": "10226",
		}, {
			"label": "河嘴乡",
			"value": "10227",
		}, {
			"label": "黄鹤乡",
			"value": "10228",
		}, {
			"label": "金铃乡",
			"value": "10229",
		}, {
			"label": "金竹乡",
			"value": "10230",
		}, {
			"label": "冷水乡",
			"value": "10231",
		}, {
			"label": "黎场乡",
			"value": "10232",
		}, {
			"label": "六塘乡",
			"value": "10233",
		}, {
			"label": "龙潭乡",
			"value": "10234",
		}, {
			"label": "桥头乡",
			"value": "10235",
		}, {
			"label": "三河乡",
			"value": "10236",
		}, {
			"label": "三益乡",
			"value": "10237",
		}, {
			"label": "石家乡",
			"value": "10238",
		}, {
			"label": "万朝乡",
			"value": "10239",
		}, {
			"label": "王家乡",
			"value": "10240",
		}, {
			"label": "洗新乡",
			"value": "10241",
		}, {
			"label": "新乐乡",
			"value": "10242",
		}, {
			"label": "中益乡",
			"value": "10243",
		}, {
			"label": "县城内",
			"value": "51833",
		}]
	}, {
		"label": "彭水县",
		"value": "138",
		"children": [{
			"label": "县城内",
			"value": "10244",
		}, {
			"label": "保家镇",
			"value": "10245",
		}, {
			"label": "高谷镇",
			"value": "10246",
		}, {
			"label": "黄家镇",
			"value": "10247",
		}, {
			"label": "连湖镇",
			"value": "10248",
		}, {
			"label": "龙射镇",
			"value": "10249",
		}, {
			"label": "鹿角镇",
			"value": "10250",
		}, {
			"label": "普子镇",
			"value": "10251",
		}, {
			"label": "桑柘镇",
			"value": "10252",
		}, {
			"label": "万足镇",
			"value": "10253",
		}, {
			"label": "郁山镇",
			"value": "10254",
		}, {
			"label": "梅子垭乡",
			"value": "10255",
		}, {
			"label": "鞍子乡",
			"value": "10256",
		}, {
			"label": "大垭乡",
			"value": "10257",
		}, {
			"label": "棣棠乡",
			"value": "10258",
		}, {
			"label": "靛水乡",
			"value": "10259",
		}, {
			"label": "朗溪乡",
			"value": "10260",
		}, {
			"label": "联合乡",
			"value": "10261",
		}, {
			"label": "龙塘乡",
			"value": "10262",
		}, {
			"label": "龙溪乡",
			"value": "10263",
		}, {
			"label": "芦塘乡",
			"value": "10264",
		}, {
			"label": "鹿鸣乡",
			"value": "10265",
		}, {
			"label": "平安乡",
			"value": "10266",
		}, {
			"label": "迁乔乡",
			"value": "10267",
		}, {
			"label": "乔梓乡",
			"value": "10268",
		}, {
			"label": "润溪乡",
			"value": "10269",
		}, {
			"label": "三义乡",
			"value": "10270",
		}, {
			"label": "善感乡",
			"value": "10271",
		}, {
			"label": "石柳乡",
			"value": "10272",
		}, {
			"label": "石盘乡",
			"value": "10273",
		}, {
			"label": "双龙乡",
			"value": "10274",
		}, {
			"label": "太原乡",
			"value": "10275",
		}, {
			"label": "桐楼乡",
			"value": "10276",
		}, {
			"label": "小厂乡",
			"value": "10277",
		}, {
			"label": "新田乡",
			"value": "10278",
		}, {
			"label": "岩东乡",
			"value": "10279",
		}, {
			"label": "长滩乡",
			"value": "10280",
		}, {
			"label": "诸佛乡",
			"value": "10281",
		}, {
			"label": "走马乡",
			"value": "10282",
		}]
	}, {
		"label": "垫江县",
		"value": "139",
		"children": [{
			"label": "桂溪镇",
			"value": "10283",
		}, {
			"label": "澄溪镇",
			"value": "10284",
		}, {
			"label": "高安镇",
			"value": "10285",
		}, {
			"label": "高峰镇",
			"value": "10286",
		}, {
			"label": "鹤游镇",
			"value": "10287",
		}, {
			"label": "普顺镇",
			"value": "10288",
		}, {
			"label": "沙坪镇",
			"value": "10289",
		}, {
			"label": "太平镇",
			"value": "10290",
		}, {
			"label": "五洞镇",
			"value": "10291",
		}, {
			"label": "新民镇",
			"value": "10292",
		}, {
			"label": "砚台镇",
			"value": "10293",
		}, {
			"label": "永安镇",
			"value": "10294",
		}, {
			"label": "周嘉镇",
			"value": "10295",
		}, {
			"label": "白家乡",
			"value": "10296",
		}, {
			"label": "包家乡",
			"value": "10297",
		}, {
			"label": "曹回乡",
			"value": "10298",
		}, {
			"label": "大石乡",
			"value": "10299",
		}, {
			"label": "杠家乡",
			"value": "10300",
		}, {
			"label": "黄沙乡",
			"value": "10301",
		}, {
			"label": "裴兴乡",
			"value": "10302",
		}, {
			"label": "三溪乡",
			"value": "10303",
		}, {
			"label": "沙河乡",
			"value": "10304",
		}, {
			"label": "永平乡",
			"value": "10305",
		}, {
			"label": "长龙乡",
			"value": "10306",
		}, {
			"label": "坪山镇",
			"value": "51834",
		}, {
			"label": "县城内",
			"value": "51835",
		}]
	}, {
		"label": "酉阳县",
		"value": "140",
		"children": [{
			"label": "钟多镇",
			"value": "10307",
		}, {
			"label": "苍岭镇",
			"value": "10308",
		}, {
			"label": "车田乡",
			"value": "10309",
		}, {
			"label": "大溪镇",
			"value": "10310",
		}, {
			"label": "丁市镇",
			"value": "10311",
		}, {
			"label": "泔溪镇",
			"value": "10312",
		}, {
			"label": "龚滩镇",
			"value": "10313",
		}, {
			"label": "黑水镇",
			"value": "10314",
		}, {
			"label": "后溪镇",
			"value": "10315",
		}, {
			"label": "李溪镇",
			"value": "10316",
		}, {
			"label": "龙潭镇",
			"value": "10317",
		}, {
			"label": "麻旺镇",
			"value": "10318",
		}, {
			"label": "小河镇",
			"value": "10319",
		}, {
			"label": "兴隆镇",
			"value": "10320",
		}, {
			"label": "酉酬镇",
			"value": "10321",
		}, {
			"label": "南腰界乡",
			"value": "10322",
		}, {
			"label": "后坪坝乡",
			"value": "10323",
		}, {
			"label": "板溪乡",
			"value": "10324",
		}, {
			"label": "官清乡",
			"value": "10325",
		}, {
			"label": "花田乡",
			"value": "10326",
		}, {
			"label": "江丰乡",
			"value": "10327",
		}, {
			"label": "可大乡",
			"value": "10328",
		}, {
			"label": "浪坪乡",
			"value": "10329",
		}, {
			"label": "两罾乡",
			"value": "10330",
		}, {
			"label": "毛坝乡",
			"value": "10331",
		}, {
			"label": "庙溪乡",
			"value": "10332",
		}, {
			"label": "木叶乡",
			"value": "10333",
		}, {
			"label": "楠木乡",
			"value": "10334",
		}, {
			"label": "偏柏乡",
			"value": "10335",
		}, {
			"label": "清泉乡",
			"value": "10336",
		}, {
			"label": "双泉乡",
			"value": "10337",
		}, {
			"label": "天馆乡",
			"value": "10338",
		}, {
			"label": "铜鼓乡",
			"value": "51836",
		}, {
			"label": "涂市乡",
			"value": "51837",
		}, {
			"label": "万木乡",
			"value": "51838",
		}, {
			"label": "五福乡",
			"value": "51839",
		}, {
			"label": "宜居乡",
			"value": "51840",
		}, {
			"label": "腴地乡",
			"value": "51841",
		}, {
			"label": "板桥乡",
			"value": "51842",
		}, {
			"label": "县城内",
			"value": "51843",
		}]
	}, {
		"label": "秀山县",
		"value": "141",
		"children": [{
			"label": "清溪场镇",
			"value": "51844",
		}, {
			"label": "中和镇",
			"value": "51845",
		}, {
			"label": "隘口镇",
			"value": "51846",
		}, {
			"label": "峨溶镇",
			"value": "51847",
		}, {
			"label": "官庄镇",
			"value": "51848",
		}, {
			"label": "洪安镇",
			"value": "51849",
		}, {
			"label": "蓝桥镇",
			"value": "51850",
		}, {
			"label": "龙池镇",
			"value": "51851",
		}, {
			"label": "梅江镇",
			"value": "51852",
		}, {
			"label": "平凯镇",
			"value": "51853",
		}, {
			"label": "溶溪镇",
			"value": "51854",
		}, {
			"label": "石堤镇",
			"value": "51855",
		}, {
			"label": "石耶镇",
			"value": "51856",
		}, {
			"label": "雅江镇",
			"value": "51857",
		}, {
			"label": "巴家乡",
			"value": "51858",
		}, {
			"label": "保安乡",
			"value": "51859",
		}, {
			"label": "岑溪乡",
			"value": "51860",
		}, {
			"label": "大溪乡",
			"value": "51861",
		}, {
			"label": "干川乡",
			"value": "51862",
		}, {
			"label": "膏田乡",
			"value": "51863",
		}, {
			"label": "官舟乡",
			"value": "51864",
		}, {
			"label": "海洋乡",
			"value": "51865",
		}, {
			"label": "里仁乡",
			"value": "51866",
		}, {
			"label": "妙泉乡",
			"value": "51867",
		}, {
			"label": "平马乡",
			"value": "51868",
		}, {
			"label": "宋农乡",
			"value": "51869",
		}, {
			"label": "溪口乡",
			"value": "51870",
		}, {
			"label": "孝溪乡",
			"value": "51871",
		}, {
			"label": "涌洞乡",
			"value": "51872",
		}, {
			"label": "中平乡",
			"value": "51873",
		}, {
			"label": "钟灵乡",
			"value": "51874",
		}, {
			"label": "县城内",
			"value": "51875",
		}]
	}, {
		"label": "城口县",
		"value": "4164",
		"children": [{
			"label": "龙田乡",
			"value": "51876",
		}, {
			"label": "明中乡",
			"value": "51877",
		}, {
			"label": "双河乡",
			"value": "51878",
		}, {
			"label": "咸宜乡",
			"value": "51879",
		}, {
			"label": "沿河乡",
			"value": "51880",
		}, {
			"label": "治平乡",
			"value": "51881",
		}, {
			"label": "周溪乡",
			"value": "51882",
		}, {
			"label": "左岚乡",
			"value": "51883",
		}, {
			"label": "县城内",
			"value": "51884",
		}]
	}, {
		"label": "璧山区",
		"value": "51885",
		"children": [{
			"label": "县城内",
			"value": "51904",
		}, {
			"label": "青杠镇",
			"value": "51905",
		}, {
			"label": "来凤镇",
			"value": "51906",
		}, {
			"label": "丁家镇",
			"value": "51907",
		}, {
			"label": "大路镇",
			"value": "51908",
		}, {
			"label": "八塘镇",
			"value": "51909",
		}, {
			"label": "七塘镇",
			"value": "51910",
		}, {
			"label": "河边镇",
			"value": "51911",
		}, {
			"label": "福禄镇",
			"value": "51912",
		}, {
			"label": "大兴镇",
			"value": "51913",
		}, {
			"label": "正兴镇",
			"value": "51914",
		}, {
			"label": "广普镇",
			"value": "51915",
		}, {
			"label": "三合镇",
			"value": "51916",
		}, {
			"label": "健龙镇",
			"value": "51917",
		}]
	}, {
		"label": "荣昌区",
		"value": "51886",
		"children": [{
			"label": "县城内",
			"value": "51918",
		}, {
			"label": "广顺镇",
			"value": "51919",
		}, {
			"label": "安富镇",
			"value": "51920",
		}, {
			"label": "峰高镇",
			"value": "51921",
		}, {
			"label": "双河镇",
			"value": "51922",
		}, {
			"label": "直升镇",
			"value": "51923",
		}, {
			"label": "路孔镇",
			"value": "51924",
		}, {
			"label": "清江镇",
			"value": "51925",
		}, {
			"label": "仁义镇",
			"value": "51926",
		}, {
			"label": "河包镇",
			"value": "51927",
		}, {
			"label": "古昌镇",
			"value": "51928",
		}, {
			"label": "吴家镇",
			"value": "51929",
		}, {
			"label": "观胜镇",
			"value": "51930",
		}, {
			"label": "铜鼓镇",
			"value": "51931",
		}, {
			"label": "清流镇",
			"value": "51932",
		}, {
			"label": "盘龙镇",
			"value": "51933",
		}, {
			"label": "远觉镇",
			"value": "51934",
		}, {
			"label": "清升镇",
			"value": "51935",
		}, {
			"label": "荣隆镇",
			"value": "51936",
		}, {
			"label": "龙集镇",
			"value": "51937",
		}]
	}, {
		"label": "铜梁区",
		"value": "51887",
		"children": [{
			"label": "县城内",
			"value": "51938",
		}, {
			"label": "土桥镇",
			"value": "51939",
		}, {
			"label": "二坪镇",
			"value": "51940",
		}, {
			"label": "水口镇",
			"value": "51941",
		}, {
			"label": "安居镇",
			"value": "51942",
		}, {
			"label": "白羊镇",
			"value": "51943",
		}, {
			"label": "平潭镇",
			"value": "51944",
		}, {
			"label": "石鱼镇",
			"value": "51945",
		}, {
			"label": "福果镇",
			"value": "51946",
		}, {
			"label": "维新镇",
			"value": "51947",
		}, {
			"label": "高楼镇",
			"value": "51948",
		}, {
			"label": "大庙镇",
			"value": "51949",
		}, {
			"label": "围龙镇",
			"value": "51950",
		}, {
			"label": "华兴镇",
			"value": "51951",
		}, {
			"label": "永嘉镇",
			"value": "51952",
		}, {
			"label": "安溪镇",
			"value": "51953",
		}, {
			"label": "西河镇",
			"value": "51954",
		}, {
			"label": "太平镇",
			"value": "51955",
		}, {
			"label": "旧县镇",
			"value": "51956",
		}, {
			"label": "龙峰镇",
			"value": "51957",
		}, {
			"label": "少云镇",
			"value": "51958",
		}, {
			"label": "蒲吕镇",
			"value": "51959",
		}, {
			"label": "侣俸镇",
			"value": "51960",
		}, {
			"label": "小林乡",
			"value": "51961",
		}, {
			"label": "双山乡",
			"value": "51962",
		}, {
			"label": "庆隆乡",
			"value": "51963",
		}]
	}, {
		"label": "合川区",
		"value": "51888",
		"children": [{
			"label": "香龙镇",
			"value": "51964",
		}, {
			"label": "钱塘镇",
			"value": "51965",
		}, {
			"label": "龙市镇",
			"value": "51966",
		}, {
			"label": "燕窝镇",
			"value": "51967",
		}, {
			"label": "太和镇",
			"value": "51968",
		}, {
			"label": "渭沱镇",
			"value": "51969",
		}, {
			"label": "双槐镇",
			"value": "51970",
		}, {
			"label": "城区",
			"value": "51971",
		}]
	}, {
		"label": "巴南区",
		"value": "51889",
		"children": [{
			"label": "南泉镇",
			"value": "51972",
		}, {
			"label": "一品镇",
			"value": "51973",
		}, {
			"label": "南彭镇",
			"value": "51974",
		}, {
			"label": "惠民镇",
			"value": "51975",
		}, {
			"label": "麻柳嘴镇",
			"value": "51976",
		}, {
			"label": "天星寺镇",
			"value": "51977",
		}, {
			"label": "双河口镇",
			"value": "51978",
		}, {
			"label": "届石镇",
			"value": "51979",
		}, {
			"label": "安澜镇",
			"value": "51980",
		}, {
			"label": "跳石镇",
			"value": "51981",
		}, {
			"label": "木洞镇",
			"value": "51982",
		}, {
			"label": "丰盛镇",
			"value": "51983",
		}, {
			"label": "二圣镇",
			"value": "51984",
		}, {
			"label": "东泉镇",
			"value": "51985",
		}, {
			"label": "姜家镇",
			"value": "51986",
		}, {
			"label": "接龙镇",
			"value": "51987",
		}, {
			"label": "石滩镇",
			"value": "51988",
		}, {
			"label": "石龙镇",
			"value": "51989",
		}, {
			"label": "城区",
			"value": "51990",
		}]
	}, {
		"label": "北碚区",
		"value": "51890",
		"children": [{
			"label": "城区",
			"value": "51991",
		}, {
			"label": "三圣镇",
			"value": "51992",
		}, {
			"label": "东阳镇",
			"value": "51993",
		}, {
			"label": "蔡家岗镇",
			"value": "51994",
		}, {
			"label": "童家溪镇",
			"value": "51995",
		}, {
			"label": "施家梁镇",
			"value": "51996",
		}, {
			"label": "金刀峡镇",
			"value": "51997",
		}, {
			"label": "澄江镇",
			"value": "51998",
		}, {
			"label": "水土镇",
			"value": "51999",
		}, {
			"label": "歇马镇",
			"value": "52000",
		}, {
			"label": "天府镇",
			"value": "52001",
		}, {
			"label": "复兴镇",
			"value": "52002",
		}, {
			"label": "静观镇",
			"value": "52003",
		}, {
			"label": "柳荫镇",
			"value": "52004",
		}]
	}, {
		"label": "江津区",
		"value": "51891",
		"children": [{
			"label": "城区",
			"value": "52005",
		}, {
			"label": "双福镇",
			"value": "52006",
		}, {
			"label": "四面山镇",
			"value": "52007",
		}, {
			"label": "支坪镇",
			"value": "52008",
		}, {
			"label": "白沙镇",
			"value": "52009",
		}, {
			"label": "珞璜镇",
			"value": "52010",
		}, {
			"label": "柏林镇",
			"value": "52011",
		}, {
			"label": "蔡家镇",
			"value": "52012",
		}, {
			"label": "慈云镇",
			"value": "52013",
		}, {
			"label": "杜市镇",
			"value": "52014",
		}, {
			"label": "广兴镇",
			"value": "52015",
		}, {
			"label": "嘉平镇",
			"value": "52016",
		}, {
			"label": "贾嗣镇",
			"value": "52017",
		}, {
			"label": "李市镇",
			"value": "52018",
		}, {
			"label": "龙华镇",
			"value": "52019",
		}, {
			"label": "石蟆镇",
			"value": "52020",
		}, {
			"label": "石门镇",
			"value": "52021",
		}, {
			"label": "塘河镇",
			"value": "52022",
		}, {
			"label": "吴滩镇",
			"value": "52023",
		}, {
			"label": "西湖镇",
			"value": "52024",
		}, {
			"label": "夏坝镇",
			"value": "52025",
		}, {
			"label": "先锋镇",
			"value": "52026",
		}, {
			"label": "永兴镇",
			"value": "52027",
		}, {
			"label": "油溪镇",
			"value": "52028",
		}, {
			"label": "中山镇",
			"value": "52029",
		}, {
			"label": "朱阳镇",
			"value": "52030",
		}]
	}, {
		"label": "渝北区",
		"value": "51892",
		"children": [{
			"label": "城区",
			"value": "52031",
		}, {
			"label": "兴隆镇",
			"value": "52032",
		}, {
			"label": "统景镇",
			"value": "52033",
		}, {
			"label": "石船镇",
			"value": "52034",
		}, {
			"label": "木耳镇",
			"value": "52035",
		}, {
			"label": "洛碛镇",
			"value": "52036",
		}, {
			"label": "龙兴镇",
			"value": "52037",
		}, {
			"label": "古路镇",
			"value": "52038",
		}, {
			"label": "大塆镇",
			"value": "52039",
		}, {
			"label": "大盛镇",
			"value": "52040",
		}, {
			"label": "茨竹镇",
			"value": "52041",
		}, {
			"label": "玉峰山镇",
			"value": "52042",
		}, {
			"label": "悦来镇",
			"value": "52043",
		}, {
			"label": "王家镇",
			"value": "52044",
		}, {
			"label": "两路镇",
			"value": "52045",
		}, {
			"label": "礼嘉镇",
			"value": "52046",
		}]
	}, {
		"label": "长寿区",
		"value": "51893",
		"children": []
	}, {
		"label": "永川区",
		"value": "51894",
		"children": [{
			"label": "城区",
			"value": "52062",
		}, {
			"label": "双竹镇",
			"value": "52063",
		}, {
			"label": "三教镇",
			"value": "52064",
		}, {
			"label": "大安镇",
			"value": "52065",
		}, {
			"label": "陈食镇",
			"value": "52066",
		}, {
			"label": "板桥镇",
			"value": "52067",
		}, {
			"label": "宝峰镇",
			"value": "52068",
		}, {
			"label": "临江镇",
			"value": "52069",
		}, {
			"label": "红炉镇",
			"value": "52070",
		}, {
			"label": "吉安镇",
			"value": "52071",
		}, {
			"label": "金龙镇",
			"value": "52072",
		}, {
			"label": "来苏镇",
			"value": "52073",
		}, {
			"label": "青峰镇",
			"value": "52074",
		}, {
			"label": "双石镇",
			"value": "52075",
		}, {
			"label": "松溉镇",
			"value": "52076",
		}, {
			"label": "五间镇",
			"value": "52077",
		}, {
			"label": "仙龙镇",
			"value": "52078",
		}, {
			"label": "永荣镇",
			"value": "52079",
		}, {
			"label": "朱沱镇",
			"value": "52080",
		}, {
			"label": "何埂镇",
			"value": "52081",
		}]
	}, {
		"label": "江北区",
		"value": "51895",
		"children": [{
			"label": "内环以内",
			"value": "52082",
		}, {
			"label": "寸滩镇",
			"value": "52083",
		}, {
			"label": "郭家沱镇",
			"value": "52084",
		}, {
			"label": "铁山坪镇",
			"value": "52085",
		}, {
			"label": "鱼嘴镇",
			"value": "52086",
		}, {
			"label": "复盛镇",
			"value": "52087",
		}, {
			"label": "五宝镇",
			"value": "52088",
		}, {
			"label": "大石坝镇",
			"value": "52089",
		}]
	}, {
		"label": "南岸区",
		"value": "51896",
		"children": [{
			"label": "城区",
			"value": "52090",
		}, {
			"label": "内环以内",
			"value": "52091",
		}, {
			"label": "茶园新区",
			"value": "52092",
		}, {
			"label": "鸡冠石镇",
			"value": "52093",
		}, {
			"label": "长生桥镇",
			"value": "52094",
		}, {
			"label": "峡口镇",
			"value": "52095",
		}, {
			"label": "广阳镇",
			"value": "52096",
		}, {
			"label": "迎龙镇",
			"value": "52097",
		}]
	}, {
		"label": "九龙坡区",
		"value": "51897",
		"children": [{
			"label": "内环以内",
			"value": "52098",
		}, {
			"label": "白市驿镇",
			"value": "52099",
		}, {
			"label": "铜罐驿镇",
			"value": "52100",
		}, {
			"label": "华岩镇",
			"value": "52101",
		}, {
			"label": "巴福镇",
			"value": "52102",
		}, {
			"label": "含谷镇",
			"value": "52103",
		}, {
			"label": "金凤镇",
			"value": "52104",
		}, {
			"label": "石板镇",
			"value": "52105",
		}, {
			"label": "陶家镇",
			"value": "52106",
		}, {
			"label": "西彭镇",
			"value": "52107",
		}, {
			"label": "走马镇",
			"value": "52108",
		}]
	}, {
		"label": "沙坪坝区",
		"value": "51898",
		"children": [{
			"label": "内环以内",
			"value": "52109",
		}, {
			"label": "陈家桥镇",
			"value": "52110",
		}, {
			"label": "歌乐山镇",
			"value": "52111",
		}, {
			"label": "青木关镇",
			"value": "52112",
		}, {
			"label": "回龙坝镇",
			"value": "52113",
		}, {
			"label": "大学城",
			"value": "52114",
		}, {
			"label": "虎溪镇",
			"value": "52115",
		}, {
			"label": "西永镇",
			"value": "52116",
		}, {
			"label": "土主镇",
			"value": "52117",
		}, {
			"label": "井口镇",
			"value": "52118",
		}, {
			"label": "曾家镇",
			"value": "52119",
		}, {
			"label": "凤凰镇",
			"value": "52120",
		}, {
			"label": "中梁镇",
			"value": "52121",
		}]
	}, {
		"label": "大渡口区",
		"value": "51899",
		"children": [{
			"label": "内环以内",
			"value": "52123",
		}, {
			"label": "茄子溪镇",
			"value": "52124",
		}, {
			"label": "建胜镇",
			"value": "52125",
		}, {
			"label": "跳蹬镇",
			"value": "52126",
		}]
	}, {
		"label": "綦江区",
		"value": "51900",
		"children": [{
			"label": "城区",
			"value": "52127",
		}, {
			"label": "三江镇",
			"value": "52128",
		}, {
			"label": "安稳镇",
			"value": "52129",
		}, {
			"label": "打通镇",
			"value": "52130",
		}, {
			"label": "丁山镇",
			"value": "52131",
		}, {
			"label": "东溪镇",
			"value": "52132",
		}, {
			"label": "扶欢镇",
			"value": "52133",
		}, {
			"label": "赶水镇",
			"value": "52134",
		}, {
			"label": "郭扶镇",
			"value": "52135",
		}, {
			"label": "横山镇",
			"value": "52136",
		}, {
			"label": "隆盛镇",
			"value": "52137",
		}, {
			"label": "三角镇",
			"value": "52138",
		}, {
			"label": "石壕镇",
			"value": "52139",
		}, {
			"label": "石角镇",
			"value": "52140",
		}, {
			"label": "新盛镇",
			"value": "52141",
		}, {
			"label": "永城镇",
			"value": "52142",
		}, {
			"label": "永新镇",
			"value": "52143",
		}, {
			"label": "中峰镇",
			"value": "52144",
		}, {
			"label": "纂塘镇",
			"value": "52145",
		}, {
			"label": "丛林镇",
			"value": "52146",
		}, {
			"label": "关坝镇",
			"value": "52147",
		}, {
			"label": "黑山镇",
			"value": "52148",
		}, {
			"label": "金桥镇",
			"value": "52149",
		}, {
			"label": "南桐镇",
			"value": "52150",
		}, {
			"label": "青年镇",
			"value": "52151",
		}, {
			"label": "石林镇",
			"value": "52152",
		}, {
			"label": "万东镇",
			"value": "52153",
		}]
	}, {
		"label": "渝中区",
		"value": "51901",
		"children": [{
			"label": "全境",
			"value": "52155",
		}]
	}, {
		"label": "高新区",
		"value": "51902",
		"children": [{
			"label": "全境",
			"value": "52156",
		}]
	}, {
		"label": "北部新区",
		"value": "51903",
		"children": [{
			"label": "全境",
			"value": "52157",
		}]
	}]
}, {
	"label": "河北",
	"value": "5",
	"children": [{
		"label": "石家庄市",
		"value": "142",
		"children": [{
			"label": "辛集市",
			"value": "143",
			"children": [{
				"label": "辛集镇",
				"value": "5008",
				"children": []
			}, {
				"label": "旧城镇",
				"value": "5009",
				"children": []
			}, {
				"label": "张古庄镇",
				"value": "5010",
				"children": []
			}, {
				"label": "位伯镇",
				"value": "5011",
				"children": []
			}, {
				"label": "新垒头镇",
				"value": "5012",
				"children": []
			}, {
				"label": "新城镇",
				"value": "5013",
				"children": []
			}, {
				"label": "南智丘镇",
				"value": "5014",
				"children": []
			}, {
				"label": "王口镇",
				"value": "5015",
				"children": []
			}, {
				"label": "天宫营乡",
				"value": "5016",
				"children": []
			}, {
				"label": "前营乡",
				"value": "5017",
				"children": []
			}, {
				"label": "马庄乡",
				"value": "5018",
				"children": []
			}, {
				"label": "和睦井乡",
				"value": "5019",
				"children": []
			}, {
				"label": "田家庄乡",
				"value": "5020",
				"children": []
			}, {
				"label": "中里厢乡",
				"value": "5021",
				"children": []
			}, {
				"label": "小辛庄乡",
				"value": "5022",
				"children": []
			}]
		}, {
			"label": "晋州市",
			"value": "145",
			"children": [{
				"label": "晋州镇",
				"value": "5037",
				"children": []
			}, {
				"label": "总十庄镇",
				"value": "5038",
				"children": []
			}, {
				"label": "营里镇",
				"value": "5039",
				"children": []
			}, {
				"label": "桃园镇",
				"value": "5040",
				"children": []
			}, {
				"label": "东卓宿镇",
				"value": "5041",
				"children": []
			}, {
				"label": "马于镇",
				"value": "5042",
				"children": []
			}, {
				"label": "小樵镇",
				"value": "5043",
				"children": []
			}, {
				"label": "槐树镇",
				"value": "5044",
				"children": []
			}, {
				"label": "东里庄镇",
				"value": "5045",
				"children": []
			}, {
				"label": "周家庄乡",
				"value": "5046",
				"children": []
			}, {
				"label": "城区",
				"value": "52166",
				"children": []
			}]
		}, {
			"label": "新乐市",
			"value": "146",
			"children": [{
				"label": "城区",
				"value": "5047",
				"children": []
			}, {
				"label": "化皮镇",
				"value": "5048",
				"children": []
			}, {
				"label": "承安镇",
				"value": "5049",
				"children": []
			}, {
				"label": "正莫镇",
				"value": "5050",
				"children": []
			}, {
				"label": "南大岳镇",
				"value": "5051",
				"children": []
			}, {
				"label": "杜固镇",
				"value": "5052",
				"children": []
			}, {
				"label": "邯邰镇",
				"value": "5053",
				"children": []
			}, {
				"label": "东王镇",
				"value": "5054",
				"children": []
			}, {
				"label": "马头铺镇",
				"value": "5055",
				"children": []
			}, {
				"label": "协神乡",
				"value": "5056",
				"children": []
			}, {
				"label": "木村乡",
				"value": "5057",
				"children": []
			}, {
				"label": "大岳镇",
				"value": "52167",
				"children": []
			}, {
				"label": "彭家庄乡",
				"value": "52168",
				"children": []
			}]
		}, {
			"label": "井陉县",
			"value": "153",
			"children": [{
				"label": "城区",
				"value": "52169",
				"children": []
			}, {
				"label": "微水镇",
				"value": "52170",
				"children": []
			}, {
				"label": "南障城镇",
				"value": "52171",
				"children": []
			}, {
				"label": "苍岩山镇",
				"value": "52172",
				"children": []
			}, {
				"label": "天长镇",
				"value": "52173",
				"children": []
			}, {
				"label": "秀林镇",
				"value": "52174",
				"children": []
			}, {
				"label": "南峪镇",
				"value": "52175",
				"children": []
			}, {
				"label": "上安镇",
				"value": "52176",
				"children": []
			}, {
				"label": "威州镇",
				"value": "52177",
				"children": []
			}, {
				"label": "小作镇",
				"value": "52178",
				"children": []
			}, {
				"label": "测鱼镇",
				"value": "52179",
				"children": []
			}, {
				"label": "吴家窑乡",
				"value": "52180",
				"children": []
			}, {
				"label": "南王庄乡",
				"value": "52181",
				"children": []
			}, {
				"label": "于家乡",
				"value": "52182",
				"children": []
			}, {
				"label": "北正乡",
				"value": "52183",
				"children": []
			}, {
				"label": "孙庄乡",
				"value": "52184",
				"children": []
			}, {
				"label": "南陉乡",
				"value": "52185",
				"children": []
			}, {
				"label": "辛庄乡",
				"value": "52186",
				"children": []
			}]
		}, {
			"label": "栾城县",
			"value": "154",
			"children": [{
				"label": "城区",
				"value": "52188",
				"children": []
			}, {
				"label": "栾城镇",
				"value": "52189",
				"children": []
			}, {
				"label": "楼底镇",
				"value": "52190",
				"children": []
			}, {
				"label": "窦妪镇",
				"value": "52191",
				"children": []
			}, {
				"label": "冶河镇",
				"value": "52192",
				"children": []
			}, {
				"label": "郄马镇",
				"value": "52193",
				"children": []
			}, {
				"label": "柳林屯乡",
				"value": "52194",
				"children": []
			}, {
				"label": "南高乡",
				"value": "52195",
				"children": []
			}, {
				"label": "西营乡",
				"value": "52196",
				"children": []
			}]
		}, {
			"label": "行唐县",
			"value": "156",
			"children": [{
				"label": "城区",
				"value": "52197",
				"children": []
			}, {
				"label": "龙州镇",
				"value": "52198",
				"children": []
			}, {
				"label": "口头镇",
				"value": "52199",
				"children": []
			}, {
				"label": "南桥镇",
				"value": "52200",
				"children": []
			}, {
				"label": "上碑镇",
				"value": "52201",
				"children": []
			}, {
				"label": "九口子乡",
				"value": "52202",
				"children": []
			}, {
				"label": "独羊岗乡",
				"value": "52203",
				"children": []
			}, {
				"label": "上阎庄乡",
				"value": "52204",
				"children": []
			}, {
				"label": "安乡县",
				"value": "52205",
				"children": []
			}, {
				"label": "城寨乡",
				"value": "52206",
				"children": []
			}, {
				"label": "只里乡",
				"value": "52207",
				"children": []
			}, {
				"label": "市同乡",
				"value": "52208",
				"children": []
			}, {
				"label": "翟营乡",
				"value": "52209",
				"children": []
			}, {
				"label": "玉亭乡",
				"value": "52210",
				"children": []
			}, {
				"label": "北河乡",
				"value": "52211",
				"children": []
			}, {
				"label": "上方乡",
				"value": "52212",
				"children": []
			}]
		}, {
			"label": "灵寿县",
			"value": "157",
			"children": [{
				"label": "城区",
				"value": "52213",
				"children": []
			}, {
				"label": "灵寿镇",
				"value": "52214",
				"children": []
			}, {
				"label": "青同镇",
				"value": "52215",
				"children": []
			}, {
				"label": "塔上镇",
				"value": "52216",
				"children": []
			}, {
				"label": "陈庄镇",
				"value": "52217",
				"children": []
			}, {
				"label": "慈峪镇",
				"value": "52218",
				"children": []
			}, {
				"label": "岔头镇",
				"value": "52219",
				"children": []
			}, {
				"label": "三圣院乡",
				"value": "52220",
				"children": []
			}, {
				"label": "北谭庄乡",
				"value": "52221",
				"children": []
			}, {
				"label": "北洼乡",
				"value": "52222",
				"children": []
			}, {
				"label": "牛城乡",
				"value": "52223",
				"children": []
			}, {
				"label": "狗台乡",
				"value": "52224",
				"children": []
			}, {
				"label": "南寨乡",
				"value": "52225",
				"children": []
			}, {
				"label": "燕川乡",
				"value": "52226",
				"children": []
			}, {
				"label": "南营乡",
				"value": "52227",
				"children": []
			}, {
				"label": "寨头乡",
				"value": "52228",
				"children": []
			}]
		}, {
			"label": "高邑县",
			"value": "158",
			"children": [{
				"label": "城区",
				"value": "52229",
				"children": []
			}, {
				"label": "高邑镇",
				"value": "52230",
				"children": []
			}, {
				"label": "大营镇",
				"value": "52231",
				"children": []
			}, {
				"label": "富村镇",
				"value": "52232",
				"children": []
			}, {
				"label": "中韩乡",
				"value": "52233",
				"children": []
			}, {
				"label": "万城乡",
				"value": "52234",
				"children": []
			}]
		}, {
			"label": "赵县",
			"value": "159",
			"children": [{
				"label": "城区",
				"value": "52235",
				"children": []
			}, {
				"label": "赵州镇",
				"value": "52236",
				"children": []
			}, {
				"label": "北王里镇",
				"value": "52237",
				"children": []
			}, {
				"label": "新寨店镇",
				"value": "52238",
				"children": []
			}, {
				"label": "南柏舍镇",
				"value": "52239",
				"children": []
			}, {
				"label": "沙河店镇",
				"value": "52240",
				"children": []
			}, {
				"label": "范庄镇",
				"value": "52241",
				"children": []
			}, {
				"label": "韩村镇",
				"value": "52242",
				"children": []
			}, {
				"label": "前大章乡",
				"value": "52243",
				"children": []
			}, {
				"label": "王西章乡",
				"value": "52244",
				"children": []
			}, {
				"label": "谢庄乡",
				"value": "52245",
				"children": []
			}, {
				"label": "高村乡",
				"value": "52246",
				"children": []
			}]
		}, {
			"label": "赞皇县",
			"value": "160",
			"children": [{
				"label": "城区",
				"value": "52247",
				"children": []
			}, {
				"label": "赞皇镇",
				"value": "52248",
				"children": []
			}, {
				"label": "院头镇",
				"value": "52249",
				"children": []
			}, {
				"label": "南邢郭乡",
				"value": "52250",
				"children": []
			}, {
				"label": "南清河乡",
				"value": "52251",
				"children": []
			}, {
				"label": "西阳泽乡",
				"value": "52252",
				"children": []
			}, {
				"label": "黄北坪乡",
				"value": "52253",
				"children": []
			}, {
				"label": "嶂石岩乡",
				"value": "52254",
				"children": []
			}, {
				"label": "石龙门乡",
				"value": "52255",
				"children": []
			}, {
				"label": "徐亭乡",
				"value": "52256",
				"children": []
			}, {
				"label": "张楞乡",
				"value": "52257",
				"children": []
			}, {
				"label": "土门乡",
				"value": "52258",
				"children": []
			}]
		}, {
			"label": "深泽县",
			"value": "161",
			"children": [{
				"label": "城区",
				"value": "52259",
				"children": []
			}, {
				"label": "深泽镇",
				"value": "52260",
				"children": []
			}, {
				"label": "铁杆镇",
				"value": "52261",
				"children": []
			}, {
				"label": "白庄乡",
				"value": "52262",
				"children": []
			}, {
				"label": "赵八乡",
				"value": "52263",
				"children": []
			}, {
				"label": "桥头乡",
				"value": "52264",
				"children": []
			}, {
				"label": "留村乡",
				"value": "52265",
				"children": []
			}]
		}, {
			"label": "无极县",
			"value": "162",
			"children": [{
				"label": "城区",
				"value": "52278",
				"children": []
			}, {
				"label": "无极镇",
				"value": "52279",
				"children": []
			}, {
				"label": "张段固镇",
				"value": "52280",
				"children": []
			}, {
				"label": "郭庄镇",
				"value": "52281",
				"children": []
			}, {
				"label": "大陈镇",
				"value": "52282",
				"children": []
			}, {
				"label": "北苏镇",
				"value": "52283",
				"children": []
			}, {
				"label": "七汲镇",
				"value": "52284",
				"children": []
			}, {
				"label": "里城道乡",
				"value": "52285",
				"children": []
			}, {
				"label": "东侯坊乡",
				"value": "52286",
				"children": []
			}, {
				"label": "高头乡",
				"value": "52287",
				"children": []
			}, {
				"label": "郝庄乡",
				"value": "52288",
				"children": []
			}, {
				"label": "南流乡",
				"value": "52289",
				"children": []
			}]
		}, {
			"label": "元氏县",
			"value": "163",
			"children": [{
				"label": "城区",
				"value": "52290",
				"children": []
			}, {
				"label": "槐阳镇",
				"value": "52291",
				"children": []
			}, {
				"label": "宋曹镇",
				"value": "52292",
				"children": []
			}, {
				"label": "南因镇",
				"value": "52293",
				"children": []
			}, {
				"label": "殷村镇",
				"value": "52294",
				"children": []
			}, {
				"label": "姬村镇",
				"value": "52295",
				"children": []
			}, {
				"label": "南佐镇",
				"value": "52296",
				"children": []
			}, {
				"label": "黑水河乡",
				"value": "52297",
				"children": []
			}, {
				"label": "东张乡",
				"value": "52298",
				"children": []
			}, {
				"label": "苏阳乡",
				"value": "52299",
				"children": []
			}, {
				"label": "赵同乡",
				"value": "52300",
				"children": []
			}, {
				"label": "北褚乡",
				"value": "52301",
				"children": []
			}, {
				"label": "马村乡",
				"value": "52302",
				"children": []
			}, {
				"label": "北正乡",
				"value": "52303",
				"children": []
			}, {
				"label": "苏村乡",
				"value": "52304",
				"children": []
			}, {
				"label": "前仙乡",
				"value": "52305",
				"children": []
			}]
		}, {
			"label": "井陉矿区",
			"value": "3182",
			"children": [{
				"label": "城区",
				"value": "52306",
				"children": []
			}, {
				"label": "贾庄镇",
				"value": "52307",
				"children": []
			}, {
				"label": "凤山镇",
				"value": "52308",
				"children": []
			}, {
				"label": "横涧乡",
				"value": "52309",
				"children": []
			}]
		}, {
			"label": "平山县",
			"value": "4158",
			"children": [{
				"label": "县城内",
				"value": "52310",
				"children": []
			}, {
				"label": "平山镇",
				"value": "52311",
				"children": []
			}, {
				"label": "东回舍镇",
				"value": "52312",
				"children": []
			}, {
				"label": "孟家庄镇",
				"value": "52313",
				"children": []
			}, {
				"label": "蛟潭庄镇",
				"value": "52314",
				"children": []
			}, {
				"label": "西柏坡镇",
				"value": "52315",
				"children": []
			}, {
				"label": "古月镇",
				"value": "52316",
				"children": []
			}, {
				"label": "温塘镇",
				"value": "52317",
				"children": []
			}, {
				"label": "南甸镇",
				"value": "52318",
				"children": []
			}, {
				"label": "岗南镇",
				"value": "52319",
				"children": []
			}, {
				"label": "下槐镇",
				"value": "52320",
				"children": []
			}, {
				"label": "小觉镇",
				"value": "52321",
				"children": []
			}, {
				"label": "下口镇",
				"value": "52322",
				"children": []
			}, {
				"label": "上观音堂乡",
				"value": "52323",
				"children": []
			}, {
				"label": "西大吾乡",
				"value": "52324",
				"children": []
			}, {
				"label": "上三汲乡",
				"value": "52325",
				"children": []
			}, {
				"label": "东王坡乡",
				"value": "52326",
				"children": []
			}, {
				"label": "苏家庄乡",
				"value": "52327",
				"children": []
			}, {
				"label": "杨家桥乡",
				"value": "52328",
				"children": []
			}, {
				"label": "合河口乡",
				"value": "52329",
				"children": []
			}, {
				"label": "两河乡",
				"value": "52330",
				"children": []
			}, {
				"label": "宅北乡",
				"value": "52331",
				"children": []
			}, {
				"label": "北冶乡",
				"value": "52332",
				"children": []
			}, {
				"label": "营里乡",
				"value": "52333",
				"children": []
			}]
		}, {
			"label": "藁城区",
			"value": "52158",
			"children": [{
				"label": "廉州镇",
				"value": "52334",
				"children": []
			}, {
				"label": "贾市庄镇",
				"value": "52335",
				"children": []
			}, {
				"label": "张家庄镇",
				"value": "52336",
				"children": []
			}, {
				"label": "前西关镇",
				"value": "52337",
				"children": []
			}, {
				"label": "兴安镇",
				"value": "52338",
				"children": []
			}, {
				"label": "常安镇",
				"value": "52339",
				"children": []
			}, {
				"label": "梅花镇",
				"value": "52340",
				"children": []
			}, {
				"label": "丘头镇",
				"value": "52341",
				"children": []
			}, {
				"label": "岗上镇",
				"value": "52342",
				"children": []
			}, {
				"label": "南董镇",
				"value": "52343",
				"children": []
			}, {
				"label": "南孟镇",
				"value": "52344",
				"children": []
			}, {
				"label": "西关镇",
				"value": "52345",
				"children": []
			}, {
				"label": "增村镇",
				"value": "52346",
				"children": []
			}, {
				"label": "九门乡",
				"value": "52347",
				"children": []
			}]
		}, {
			"label": "鹿泉市",
			"value": "52159",
			"children": [{
				"label": "城区",
				"value": "52348",
				"children": []
			}, {
				"label": "获鹿镇",
				"value": "52349",
				"children": []
			}, {
				"label": "信息产业园",
				"value": "52350",
				"children": []
			}, {
				"label": "寺家庄镇",
				"value": "52351",
				"children": []
			}, {
				"label": "黄壁庄镇",
				"value": "52352",
				"children": []
			}, {
				"label": "山尹村镇",
				"value": "52353",
				"children": []
			}, {
				"label": "铜冶镇",
				"value": "52354",
				"children": []
			}, {
				"label": "上庄镇",
				"value": "52355",
				"children": []
			}, {
				"label": "李村镇",
				"value": "52356",
				"children": []
			}, {
				"label": "宜安镇",
				"value": "52357",
				"children": []
			}, {
				"label": "大河镇",
				"value": "52358",
				"children": []
			}, {
				"label": "白鹿泉乡",
				"value": "52359",
				"children": []
			}, {
				"label": "石井乡",
				"value": "52360",
				"children": []
			}, {
				"label": "上寨乡",
				"value": "52361",
				"children": []
			}]
		}, {
			"label": "正定县",
			"value": "52160",
			"children": [{
				"label": "城区",
				"value": "52362",
				"children": []
			}, {
				"label": "正定镇",
				"value": "52363",
				"children": []
			}, {
				"label": "曲阳桥乡",
				"value": "52364",
				"children": []
			}, {
				"label": "西平乐乡",
				"value": "52365",
				"children": []
			}, {
				"label": "北早现乡",
				"value": "52366",
				"children": []
			}, {
				"label": "南牛乡",
				"value": "52367",
				"children": []
			}, {
				"label": "南楼乡",
				"value": "52368",
				"children": []
			}, {
				"label": "诸福屯镇",
				"value": "52369",
				"children": []
			}, {
				"label": "新城铺镇",
				"value": "52370",
				"children": []
			}, {
				"label": "新安镇",
				"value": "52371",
				"children": []
			}]
		}, {
			"label": "新华区",
			"value": "52161",
			"children": [{
				"label": "城区",
				"value": "52372",
				"children": []
			}, {
				"label": "杜北乡",
				"value": "52373",
				"children": []
			}, {
				"label": "西三庄乡",
				"value": "52374",
				"children": []
			}, {
				"label": "大郭镇",
				"value": "52375",
				"children": []
			}, {
				"label": "赵陵铺镇",
				"value": "52376",
				"children": []
			}]
		}, {
			"label": "桥西区",
			"value": "52162",
		}, {
			"label": "桥东区",
			"value": "52163",
			"children": [{
				"label": "城区",
				"value": "52377",
				"children": []
			}, {
				"label": "桃园镇",
				"value": "52378",
				"children": []
			}]
		}, {
			"label": "裕华区",
			"value": "52164",
			"children": [{
				"label": "宋营镇",
				"value": "52379",
				"children": []
			}, {
				"label": "方村镇",
				"value": "52380",
				"children": []
			}, {
				"label": "城区",
				"value": "52381",
				"children": []
			}]
		}, {
			"label": "长安区",
			"value": "52165",
			"children": [{
				"label": "城区",
				"value": "52382",
				"children": []
			}, {
				"label": "西兆通镇",
				"value": "52383",
				"children": []
			}, {
				"label": "南村镇",
				"value": "52384",
				"children": []
			}, {
				"label": "高营镇",
				"value": "52385",
				"children": []
			}]
		}]
	}, {
		"label": "邯郸市",
		"value": "148",
		"children": [{
			"label": "邯郸县",
			"value": "167",
			"children": [{
				"label": "河沙镇镇",
				"value": "52390",
				"children": []
			}, {
				"label": "黄粱梦镇",
				"value": "52391",
				"children": []
			}, {
				"label": "户村镇",
				"value": "52392",
				"children": []
			}, {
				"label": "尚璧镇",
				"value": "52393",
				"children": []
			}, {
				"label": "南吕固乡",
				"value": "52394",
				"children": []
			}, {
				"label": "兼庄乡",
				"value": "52395",
				"children": []
			}, {
				"label": "代召乡",
				"value": "52396",
				"children": []
			}, {
				"label": "三陵乡",
				"value": "52397",
				"children": []
			}, {
				"label": "康庄乡",
				"value": "52398",
				"children": []
			}, {
				"label": "南堡乡",
				"value": "52399",
				"children": []
			}, {
				"label": "城区",
				"value": "52400",
				"children": []
			}]
		}, {
			"label": "峰峰矿区",
			"value": "168",
			"children": [{
				"label": "临水镇",
				"value": "52401",
				"children": []
			}, {
				"label": "峰峰镇",
				"value": "52402",
				"children": []
			}, {
				"label": "彭城镇",
				"value": "52403",
				"children": []
			}, {
				"label": "和村镇",
				"value": "52404",
				"children": []
			}, {
				"label": "义井镇",
				"value": "52405",
				"children": []
			}, {
				"label": "界城镇",
				"value": "52406",
				"children": []
			}, {
				"label": "新坡镇",
				"value": "52407",
				"children": []
			}, {
				"label": "大峪镇",
				"value": "52408",
				"children": []
			}, {
				"label": "大社镇",
				"value": "52409",
				"children": []
			}]
		}, {
			"label": "曲周县",
			"value": "169",
			"children": [{
				"label": "河南疃镇",
				"value": "52434",
				"children": []
			}, {
				"label": "第四疃镇",
				"value": "52435",
				"children": []
			}, {
				"label": "曲周镇",
				"value": "52436",
				"children": []
			}, {
				"label": "安寨镇",
				"value": "52437",
				"children": []
			}, {
				"label": "南里岳乡",
				"value": "62438",
				"children": []
			}, {
				"label": "大河道乡",
				"value": "62440",
				"children": []
			}, {
				"label": "槐桥乡",
				"value": "62441",
				"children": []
			}, {
				"label": "白寨乡",
				"value": "62442",
				"children": []
			}, {
				"label": "依庄乡",
				"value": "62443",
				"children": []
			}, {
				"label": "城区",
				"value": "62445",
				"children": []
			}]
		}, {
			"label": "馆陶县",
			"value": "170",
			"children": [{
				"label": "魏僧寨镇",
				"value": "62450",
				"children": []
			}, {
				"label": "馆陶镇",
				"value": "62451",
				"children": []
			}, {
				"label": "房寨镇",
				"value": "62453",
				"children": []
			}, {
				"label": "柴堡镇",
				"value": "62455",
				"children": []
			}, {
				"label": "寿山寺乡",
				"value": "62457",
				"children": []
			}, {
				"label": "南徐村乡",
				"value": "62459",
				"children": []
			}, {
				"label": "王桥乡",
				"value": "62460",
				"children": []
			}, {
				"label": "路桥乡",
				"value": "62461",
				"children": []
			}, {
				"label": "城区",
				"value": "62462",
				"children": []
			}]
		}, {
			"label": "魏县",
			"value": "171",
			"children": [{
				"label": "张二庄镇",
				"value": "62470",
				"children": []
			}, {
				"label": "魏城镇",
				"value": "62471",
				"children": []
			}, {
				"label": "德政镇",
				"value": "62472",
				"children": []
			}, {
				"label": "北皋镇",
				"value": "62473",
				"children": []
			}, {
				"label": "双井镇",
				"value": "62475",
				"children": []
			}, {
				"label": "牙里镇",
				"value": "62476",
				"children": []
			}, {
				"label": "车往镇",
				"value": "62478",
				"children": []
			}, {
				"label": "回隆镇",
				"value": "62479",
				"children": []
			}, {
				"label": "东代固乡",
				"value": "62481",
				"children": []
			}, {
				"label": "棘针寨乡",
				"value": "62484",
				"children": []
			}, {
				"label": "沙口集乡",
				"value": "62485",
				"children": []
			}, {
				"label": "野胡拐乡",
				"value": "62486",
				"children": []
			}, {
				"label": "仕望集乡",
				"value": "62487",
				"children": []
			}, {
				"label": "南双庙乡",
				"value": "62488",
				"children": []
			}, {
				"label": "大辛庄乡",
				"value": "62489",
				"children": []
			}, {
				"label": "大马村乡",
				"value": "62490",
				"children": []
			}, {
				"label": "北台头乡",
				"value": "62491",
				"children": []
			}, {
				"label": "大磨乡",
				"value": "62492",
				"children": []
			}, {
				"label": "院堡乡",
				"value": "62493",
				"children": []
			}, {
				"label": "边马乡",
				"value": "62494",
				"children": []
			}, {
				"label": "泊口乡",
				"value": "62495",
				"children": []
			}, {
				"label": "泊空乡",
				"value": "62496",
				"children": []
			}, {
				"label": "前大磨乡",
				"value": "62497",
				"children": []
			}, {
				"label": "城区",
				"value": "62498",
				"children": []
			}]
		}, {
			"label": "成安县",
			"value": "172",
			"children": [{
				"label": "漳河店镇",
				"value": "52506",
				"children": []
			}, {
				"label": "李家疃镇",
				"value": "52507",
				"children": []
			}, {
				"label": "成安镇",
				"value": "52508",
				"children": []
			}, {
				"label": "商城镇",
				"value": "52509",
				"children": []
			}, {
				"label": "柏寺营乡",
				"value": "52510",
				"children": []
			}, {
				"label": "北乡义乡",
				"value": "52511",
				"children": []
			}, {
				"label": "道东堡乡",
				"value": "52512",
				"children": []
			}, {
				"label": "辛义乡",
				"value": "52513",
				"children": []
			}, {
				"label": "长巷巷",
				"value": "52514",
				"children": []
			}, {
				"label": "城区",
				"value": "52515",
				"children": []
			}]
		}, {
			"label": "大名县",
			"value": "173",
			"children": [{
				"label": "龙王庙镇",
				"value": "52516",
				"children": []
			}, {
				"label": "大名镇",
				"value": "52517",
				"children": []
			}, {
				"label": "杨桥镇",
				"value": "52518",
				"children": []
			}, {
				"label": "万堤镇",
				"value": "52521",
				"children": []
			}, {
				"label": "束馆镇",
				"value": "52522",
				"children": []
			}, {
				"label": "金滩镇",
				"value": "52523",
				"children": []
			}, {
				"label": "西付集乡",
				"value": "52524",
				"children": []
			}, {
				"label": "西未庄乡",
				"value": "52525",
				"children": []
			}, {
				"label": "沙圪塔乡",
				"value": "52529",
				"children": []
			}, {
				"label": "黄金堤乡",
				"value": "52530",
				"children": []
			}, {
				"label": "张铁集乡",
				"value": "52531",
				"children": []
			}, {
				"label": "孙甘店乡\\r\\n",
				"value": "52532",
				"children": []
			}, {
				"label": "红庙乡",
				"value": "52533",
				"children": []
			}, {
				"label": "旧治乡",
				"value": "52535",
				"children": []
			}, {
				"label": "王村乡",
				"value": "52536",
				"children": []
			}, {
				"label": "铺上乡",
				"value": "52538",
				"children": []
			}, {
				"label": "大街乡",
				"value": "52540",
				"children": []
			}, {
				"label": "埝头乡\\r\\n",
				"value": "52542",
				"children": []
			}, {
				"label": "北峰乡",
				"value": "52543",
				"children": []
			}, {
				"label": "营镇乡",
				"value": "52545",
				"children": []
			}]
		}, {
			"label": "涉县",
			"value": "174",
			"children": [{
				"label": "城区",
				"value": "52548",
				"children": []
			}, {
				"label": "河南店镇",
				"value": "52549",
				"children": []
			}, {
				"label": "涉城镇\\r\\n",
				"value": "52551",
				"children": []
			}, {
				"label": "索堡镇\\r\\n",
				"value": "52552",
				"children": []
			}, {
				"label": "西戌镇",
				"value": "52553",
				"children": []
			}, {
				"label": "井店镇",
				"value": "52554",
				"children": []
			}, {
				"label": "更乐镇\\r\\n",
				"value": "52555",
				"children": []
			}, {
				"label": "西达镇\\r\\n",
				"value": "52556",
				"children": []
			}, {
				"label": "固新镇",
				"value": "52557",
				"children": []
			}, {
				"label": "偏城镇",
				"value": "52558",
				"children": []
			}, {
				"label": "神头乡",
				"value": "52559",
				"children": []
			}, {
				"label": "辽城乡",
				"value": "52560",
				"children": []
			}, {
				"label": "偏店乡",
				"value": "52561",
				"children": []
			}, {
				"label": "龙虎乡\\r\\n",
				"value": "52562",
				"children": []
			}, {
				"label": "木井乡\\r\\n",
				"value": "52563",
				"children": []
			}, {
				"label": "关防乡\\r\\n",
				"value": "52564",
				"children": []
			}, {
				"label": "合漳乡",
				"value": "52565",
				"children": []
			}, {
				"label": "鹿头乡\\r\\n",
				"value": "52566",
				"children": []
			}]
		}, {
			"label": "鸡泽县",
			"value": "175",
			"children": [{
				"label": "城区",
				"value": "52567",
				"children": []
			}, {
				"label": "鸡泽镇",
				"value": "52568",
				"children": []
			}, {
				"label": "小寨镇\\r\\n",
				"value": "52569",
				"children": []
			}, {
				"label": "双塔镇\\r\\n",
				"value": "52570",
				"children": []
			}, {
				"label": "曹庄镇",
				"value": "52571",
				"children": []
			}, {
				"label": "浮图店乡",
				"value": "52572",
				"children": []
			}, {
				"label": "吴官营乡",
				"value": "52573",
				"children": []
			}, {
				"label": "凤正乡",
				"value": "52574",
				"children": []
			}]
		}, {
			"label": "邱县",
			"value": "176",
			"children": [{
				"label": "城区",
				"value": "52575",
				"children": []
			}, {
				"label": "新马头镇\\r\\n",
				"value": "52576",
				"children": []
			}, {
				"label": "香城固镇\\r\\n",
				"value": "52577",
				"children": []
			}, {
				"label": "梁二庄镇\\r\\n",
				"value": "52578",
				"children": []
			}, {
				"label": "邱城镇\\r\\n",
				"value": "52579",
				"children": []
			}, {
				"label": "古城营乡\\r\\n",
				"value": "52581",
				"children": []
			}, {
				"label": "南辛店乡\\r\\n",
				"value": "52583",
				"children": []
			}, {
				"label": "陈村乡\\r\\n",
				"value": "52584",
				"children": []
			}]
		}, {
			"label": "广平县",
			"value": "177",
			"children": [{
				"label": "城区",
				"value": "52588",
				"children": []
			}, {
				"label": "平固店镇",
				"value": "52589",
				"children": []
			}, {
				"label": "广平镇\\r\\n",
				"value": "52590",
				"children": []
			}, {
				"label": "胜营镇\\r\\n",
				"value": "52591",
				"children": []
			}, {
				"label": "十里铺乡\\r\\n",
				"value": "52592",
				"children": []
			}, {
				"label": "南韩村乡",
				"value": "52593",
				"children": []
			}, {
				"label": "南阳堡乡\\r\\n",
				"value": "52594",
				"children": []
			}, {
				"label": "东张孟乡\\r\\n",
				"value": "52595",
				"children": []
			}]
		}, {
			"label": "肥乡县",
			"value": "178",
			"children": [{
				"label": "城区",
				"value": "52596",
				"children": []
			}, {
				"label": "天台山镇\\r\\n",
				"value": "52597",
				"children": []
			}, {
				"label": "肥乡镇\\r\\n",
				"value": "52598",
				"children": []
			}, {
				"label": "大西韩乡\\r\\n",
				"value": "52599",
				"children": []
			}, {
				"label": "辛安镇乡",
				"value": "52600",
				"children": []
			}, {
				"label": "毛演堡乡\\r\\n",
				"value": "52601",
				"children": []
			}, {
				"label": "屯庄营乡",
				"value": "52603",
				"children": []
			}, {
				"label": "东漳堡乡",
				"value": "52606",
				"children": []
			}, {
				"label": "元固乡",
				"value": "52608",
				"children": []
			}, {
				"label": "旧店乡",
				"value": "52626",
				"children": []
			}]
		}, {
			"label": "磁县",
			"value": "180",
			"children": [{
				"label": "城区",
				"value": "52627",
				"children": []
			}, {
				"label": "讲武城镇\\r\\n",
				"value": "52628",
				"children": []
			}, {
				"label": "西光录镇",
				"value": "52629",
				"children": []
			}, {
				"label": "林坦镇",
				"value": "52630",
				"children": []
			}, {
				"label": "观台镇\\r\\n",
				"value": "52631",
				"children": []
			}, {
				"label": "高臾镇",
				"value": "52632",
				"children": []
			}, {
				"label": "岳城镇",
				"value": "52633",
				"children": []
			}, {
				"label": "白土镇",
				"value": "52634",
				"children": []
			}, {
				"label": "磁州镇",
				"value": "52635",
				"children": []
			}, {
				"label": "黄沙镇",
				"value": "52636",
				"children": []
			}, {
				"label": "时村营乡\\r\\n",
				"value": "52637",
				"children": []
			}, {
				"label": "辛庄营乡",
				"value": "52638",
				"children": []
			}, {
				"label": "花官营乡",
				"value": "52639",
				"children": []
			}, {
				"label": "路村营乡\\r\\n",
				"value": "52640",
				"children": []
			}, {
				"label": "西固义乡\\r\\n",
				"value": "52641",
				"children": []
			}, {
				"label": "北贾壁乡\\r\\n",
				"value": "52642",
				"children": []
			}, {
				"label": "台城乡",
				"value": "52643",
				"children": []
			}, {
				"label": "都党乡\\r\\n",
				"value": "52644",
				"children": []
			}, {
				"label": "南城乡",
				"value": "52645",
				"children": []
			}, {
				"label": "陶泉乡",
				"value": "52646",
				"children": []
			}]
		}, {
			"label": "临漳县",
			"value": "3077",
		}, {
			"label": "永年县",
			"value": "3187",
		}, {
			"label": "丛台区",
			"value": "52386",
		}, {
			"label": "邯山区",
			"value": "52387",
		}, {
			"label": "复兴区",
			"value": "52388",
		}, {
			"label": "武安市",
			"value": "52389",
		}]
	}, {
		"label": "邢台市",
		"value": "164",
		"children": [{
			"label": "邢台县",
			"value": "183",
		}, {
			"label": "南宫市",
			"value": "184",
			"children": [{
				"label": "苏村镇",
				"value": "5218",
				"children": []
			}, {
				"label": "高村镇",
				"value": "5219",
				"children": []
			}, {
				"label": "垂杨镇",
				"value": "5220",
				"children": []
			}, {
				"label": "明化镇",
				"value": "5221",
				"children": []
			}, {
				"label": "段芦头镇",
				"value": "5222",
				"children": []
			}, {
				"label": "紫冢镇",
				"value": "5223",
				"children": []
			}, {
				"label": "大村乡",
				"value": "5224",
				"children": []
			}, {
				"label": "南便乡",
				"value": "5225",
				"children": []
			}, {
				"label": "大屯乡",
				"value": "5226",
				"children": []
			}, {
				"label": "王道寨乡",
				"value": "5227",
				"children": []
			}, {
				"label": "吴村乡",
				"value": "5228",
				"children": []
			}]
		}, {
			"label": "沙河市",
			"value": "185",
			"children": [{
				"label": "褡裢街道",
				"value": "5229",
				"children": []
			}, {
				"label": "桥东街道",
				"value": "5230",
				"children": []
			}, {
				"label": "桥西街道",
				"value": "5231",
				"children": []
			}, {
				"label": "赞善街道",
				"value": "5232",
				"children": []
			}, {
				"label": "周庄街道",
				"value": "5233",
				"children": []
			}, {
				"label": "沙河城镇",
				"value": "5234",
				"children": []
			}, {
				"label": "新城镇",
				"value": "5235",
				"children": []
			}, {
				"label": "白塔镇",
				"value": "5236",
				"children": []
			}, {
				"label": "十里亭镇",
				"value": "5237",
				"children": []
			}, {
				"label": "綦村镇",
				"value": "5238",
				"children": []
			}, {
				"label": "留村乡",
				"value": "5239",
				"children": []
			}, {
				"label": "册井乡",
				"value": "5240",
				"children": []
			}, {
				"label": "刘石岗乡",
				"value": "5241",
				"children": []
			}, {
				"label": "柴关乡",
				"value": "5242",
				"children": []
			}, {
				"label": "蝉房乡",
				"value": "5243",
				"children": []
			}]
		}, {
			"label": "柏乡县",
			"value": "186",
		}, {
			"label": "任县",
			"value": "187",
		}, {
			"label": "清河县",
			"value": "188",
		}, {
			"label": "隆尧县",
			"value": "189",
		}, {
			"label": "临城县",
			"value": "190",
		}, {
			"label": "广宗县",
			"value": "191",
		}, {
			"label": "临西县",
			"value": "192",
		}, {
			"label": "内丘县",
			"value": "193",
		}, {
			"label": "平乡县",
			"value": "194",
		}, {
			"label": "巨鹿县",
			"value": "195",
		}, {
			"label": "新河县",
			"value": "196",
		}, {
			"label": "南和县",
			"value": "197",
		}, {
			"label": "宁晋县",
			"value": "257",
		}, {
			"label": "威县",
			"value": "3098",
		}, {
			"label": "桥西区",
			"value": "52983",
		}, {
			"label": "桥东区",
			"value": "52984",
		}]
	}, {
		"label": "保定市",
		"value": "199",
		"children": [{
			"label": "安国市",
			"value": "203",
			"children": [{
				"label": "祁州药市街道",
				"value": "5283",
				"children": []
			}, {
				"label": "祁州镇",
				"value": "5284",
				"children": []
			}, {
				"label": "伍仁桥镇",
				"value": "5285",
				"children": []
			}, {
				"label": "石佛镇",
				"value": "5286",
				"children": []
			}, {
				"label": "郑章镇",
				"value": "5287",
				"children": []
			}, {
				"label": "大五女镇",
				"value": "5288",
				"children": []
			}, {
				"label": "明官店乡",
				"value": "5289",
				"children": []
			}, {
				"label": "南娄底乡",
				"value": "5290",
				"children": []
			}, {
				"label": "西安国城乡",
				"value": "5291",
				"children": []
			}, {
				"label": "西佛落乡",
				"value": "5292",
				"children": []
			}, {
				"label": "北段村乡",
				"value": "5293",
				"children": []
			}]
		}, {
			"label": "满城区",
			"value": "205",
		}, {
			"label": "清苑县",
			"value": "206",
		}, {
			"label": "涞水县",
			"value": "207",
		}, {
			"label": "阜平县",
			"value": "208",
		}, {
			"label": "定兴县",
			"value": "210",
		}, {
			"label": "唐县",
			"value": "211",
		}, {
			"label": "高阳县",
			"value": "212",
		}, {
			"label": "容城县",
			"value": "213",
		}, {
			"label": "涞源县",
			"value": "214",
		}, {
			"label": "望都县",
			"value": "215",
		}, {
			"label": "易县",
			"value": "217",
		}, {
			"label": "曲阳县",
			"value": "218",
		}, {
			"label": "蠡县",
			"value": "219",
		}, {
			"label": "顺平县",
			"value": "220",
		}, {
			"label": "博野县",
			"value": "221",
		}, {
			"label": "雄县",
			"value": "222",
		}, {
			"label": "新市区",
			"value": "3190",
		}, {
			"label": "北市区",
			"value": "3191",
		}, {
			"label": "南市区",
			"value": "3192",
		}, {
			"label": "安新县",
			"value": "3193",
		}, {
			"label": "涿州市",
			"value": "52988",
		}, {
			"label": "定州市",
			"value": "52989",
		}, {
			"label": "高碑店市",
			"value": "52990",
		}, {
			"label": "莲池区",
			"value": "52991",
		}]
	}, {
		"label": "张家口市",
		"value": "224",
		"children": [{
			"label": "宣化县",
			"value": "225",
		}, {
			"label": "康保县",
			"value": "226",
		}, {
			"label": "张北县",
			"value": "227",
		}, {
			"label": "阳原县",
			"value": "228",
		}, {
			"label": "赤城县",
			"value": "229",
		}, {
			"label": "怀安县",
			"value": "230",
		}, {
			"label": "怀来县",
			"value": "231",
		}, {
			"label": "崇礼县",
			"value": "232",
		}, {
			"label": "尚义县",
			"value": "233",
		}, {
			"label": "蔚县",
			"value": "234",
		}, {
			"label": "涿鹿县",
			"value": "235",
		}, {
			"label": "万全县",
			"value": "236",
		}, {
			"label": "下花园区",
			"value": "238",
		}, {
			"label": "沽源县",
			"value": "3156",
		}, {
			"label": "宣化区",
			"value": "4046",
		}, {
			"label": "桥西区",
			"value": "52995",
		}, {
			"label": "桥东区",
			"value": "52996",
		}]
	}, {
		"label": "承德市",
		"value": "239",
		"children": [{
			"label": "兴隆县",
			"value": "241",
		}, {
			"label": "平泉县",
			"value": "242",
		}, {
			"label": "滦平县",
			"value": "243",
		}, {
			"label": "丰宁县",
			"value": "245",
		}, {
			"label": "围场县",
			"value": "246",
		}, {
			"label": "宽城县",
			"value": "247",
		}, {
			"label": "隆化县",
			"value": "2767",
		}, {
			"label": "承德县",
			"value": "3092",
		}, {
			"label": "双滦区",
			"value": "3197",
		}, {
			"label": "鹰手营子矿区",
			"value": "3198",
		}, {
			"label": "双桥区",
			"value": "52997",
		}]
	}, {
		"label": "秦皇岛市",
		"value": "248",
		"children": [{
			"label": "卢龙县",
			"value": "261",
		}, {
			"label": "青龙县",
			"value": "262",
		}, {
			"label": "昌黎县",
			"value": "263",
		}, {
			"label": "北戴河区",
			"value": "2990",
		}, {
			"label": "抚宁县",
			"value": "4093",
		}, {
			"label": "海港区",
			"value": "52998",
		}, {
			"label": "山海关区",
			"value": "52999",
		}]
	}, {
		"label": "唐山市",
		"value": "258",
		"children": [{
			"label": "遵化市",
			"value": "2756",
			"children": [{
				"label": "遵化镇",
				"value": "5071",
				"children": []
			}, {
				"label": "堡子店镇",
				"value": "5072",
				"children": []
			}, {
				"label": "马兰峪镇",
				"value": "5073",
				"children": []
			}, {
				"label": "平安城镇",
				"value": "5074",
				"children": []
			}, {
				"label": "东新庄镇",
				"value": "5075",
				"children": []
			}, {
				"label": "新店子镇",
				"value": "5076",
				"children": []
			}, {
				"label": "党峪镇",
				"value": "5077",
				"children": []
			}, {
				"label": "地北头镇",
				"value": "5078",
				"children": []
			}, {
				"label": "东旧寨镇",
				"value": "5079",
				"children": []
			}, {
				"label": "铁厂镇",
				"value": "5080",
				"children": []
			}, {
				"label": "苏家洼镇",
				"value": "5081",
				"children": []
			}, {
				"label": "建明镇",
				"value": "5082",
				"children": []
			}, {
				"label": "石门镇",
				"value": "5083",
				"children": []
			}, {
				"label": "崔家庄乡",
				"value": "5084",
				"children": []
			}, {
				"label": "西留村乡",
				"value": "5085",
				"children": []
			}, {
				"label": "西下营乡",
				"value": "5086",
				"children": []
			}, {
				"label": "汤泉乡",
				"value": "5087",
				"children": []
			}, {
				"label": "兴旺寨乡",
				"value": "5088",
				"children": []
			}, {
				"label": "东陵乡",
				"value": "5089",
				"children": []
			}, {
				"label": "刘备寨乡",
				"value": "5090",
				"children": []
			}, {
				"label": "团瓢庄乡",
				"value": "5091",
				"children": []
			}, {
				"label": "娘娘庄乡",
				"value": "5092",
				"children": []
			}, {
				"label": "西三里乡",
				"value": "5093",
				"children": []
			}, {
				"label": "侯家寨乡",
				"value": "5094",
				"children": []
			}, {
				"label": "小厂乡",
				"value": "5095",
				"children": []
			}]
		}, {
			"label": "丰南区",
			"value": "2757",
		}, {
			"label": "迁西县",
			"value": "2759",
		}, {
			"label": "滦南县",
			"value": "2760",
		}, {
			"label": "玉田县",
			"value": "2762",
		}, {
			"label": "曹妃甸区",
			"value": "2763",
		}, {
			"label": "乐亭县",
			"value": "2764",
		}, {
			"label": "滦县",
			"value": "2765",
		}, {
			"label": "古冶区",
			"value": "3202",
		}, {
			"label": "开平区",
			"value": "3203",
		}, {
			"label": "路北区",
			"value": "53004",
		}, {
			"label": "路南区",
			"value": "53006",
		}, {
			"label": "迁安市",
			"value": "53007",
		}, {
			"label": "丰润区",
			"value": "53008",
		}]
	}, {
		"label": "沧州市",
		"value": "264",
		"children": [{
			"label": "沧县",
			"value": "265",
		}, {
			"label": "泊头市",
			"value": "266",
			"children": [{
				"label": "解放街道",
				"value": "5115",
				"children": []
			}, {
				"label": "河东街道",
				"value": "5116",
				"children": []
			}, {
				"label": "古楼街道",
				"value": "5117",
				"children": []
			}, {
				"label": "泊镇",
				"value": "5118",
				"children": []
			}, {
				"label": "交河镇",
				"value": "5119",
				"children": []
			}, {
				"label": "齐桥镇",
				"value": "5120",
				"children": []
			}, {
				"label": "寺门村镇",
				"value": "5121",
				"children": []
			}, {
				"label": "郝村镇",
				"value": "5122",
				"children": []
			}, {
				"label": "富镇",
				"value": "5123",
				"children": []
			}, {
				"label": "文庙镇",
				"value": "5124",
				"children": []
			}, {
				"label": "洼里王镇",
				"value": "5125",
				"children": []
			}, {
				"label": "王武镇",
				"value": "5126",
				"children": []
			}, {
				"label": "营子镇",
				"value": "5127",
				"children": []
			}, {
				"label": "四营乡",
				"value": "5128",
				"children": []
			}, {
				"label": "西辛店乡",
				"value": "5129",
				"children": []
			}]
		}, {
			"label": "河间市",
			"value": "268",
			"children": [{
				"label": "瀛州镇",
				"value": "5130",
				"children": []
			}, {
				"label": "米各庄镇",
				"value": "5131",
				"children": []
			}, {
				"label": "景和镇",
				"value": "5132",
				"children": []
			}, {
				"label": "卧佛堂镇",
				"value": "5133",
				"children": []
			}, {
				"label": "束城镇",
				"value": "5134",
				"children": []
			}, {
				"label": "留古寺镇",
				"value": "5135",
				"children": []
			}, {
				"label": "沙河桥镇",
				"value": "5136",
				"children": []
			}, {
				"label": "故仙乡",
				"value": "5137",
				"children": []
			}, {
				"label": "黎民居乡",
				"value": "5138",
				"children": []
			}, {
				"label": "兴村乡",
				"value": "5139",
				"children": []
			}, {
				"label": "沙洼乡",
				"value": "5140",
				"children": []
			}, {
				"label": "西九吉乡",
				"value": "5141",
				"children": []
			}, {
				"label": "北石槽乡",
				"value": "5142",
				"children": []
			}, {
				"label": "诗经村乡",
				"value": "5143",
				"children": []
			}, {
				"label": "郭家村乡",
				"value": "5144",
				"children": []
			}, {
				"label": "时村乡",
				"value": "5145",
				"children": []
			}, {
				"label": "行别营乡",
				"value": "5146",
				"children": []
			}, {
				"label": "尊祖庄乡",
				"value": "5147",
				"children": []
			}, {
				"label": "龙华店乡",
				"value": "5148",
				"children": []
			}, {
				"label": "果子洼回族乡",
				"value": "5149",
				"children": []
			}]
		}, {
			"label": "献县",
			"value": "269",
		}, {
			"label": "肃宁县",
			"value": "270",
		}, {
			"label": "青县",
			"value": "271",
		}, {
			"label": "东光县",
			"value": "272",
		}, {
			"label": "吴桥县",
			"value": "273",
		}, {
			"label": "南皮县",
			"value": "276",
		}, {
			"label": "盐山县",
			"value": "277",
		}, {
			"label": "海兴县",
			"value": "278",
		}, {
			"label": "孟村县",
			"value": "279",
		}, {
			"label": "运河区",
			"value": "53009",
		}, {
			"label": "新华区",
			"value": "53010",
		}, {
			"label": "任丘市",
			"value": "53011",
		}, {
			"label": "黄骅市",
			"value": "53012",
		}]
	}, {
		"label": "廊坊市",
		"value": "274",
		"children": [{
			"label": "固安县",
			"value": "284",
		}, {
			"label": "永清县",
			"value": "285",
		}, {
			"label": "香河县",
			"value": "286",
		}, {
			"label": "大城县",
			"value": "287",
		}, {
			"label": "文安县",
			"value": "288",
		}, {
			"label": "大厂县",
			"value": "289",
		}, {
			"label": "安次区",
			"value": "3206",
		}, {
			"label": "广阳区",
			"value": "3207",
		}, {
			"label": "开发区",
			"value": "4097",
		}, {
			"label": "三河市",
			"value": "53013",
		}, {
			"label": "霸州市",
			"value": "53014",
		}]
	}, {
		"label": "衡水市",
		"value": "275",
		"children": [{
			"label": "冀州市",
			"value": "291",
			"children": [{
				"label": "冀州镇",
				"value": "5186",
				"children": []
			}, {
				"label": "魏屯镇",
				"value": "5187",
				"children": []
			}, {
				"label": "官道李镇",
				"value": "5188",
				"children": []
			}, {
				"label": "南午村镇",
				"value": "5189",
				"children": []
			}, {
				"label": "周村镇",
				"value": "5190",
				"children": []
			}, {
				"label": "码头李镇",
				"value": "5191",
				"children": []
			}, {
				"label": "西王镇",
				"value": "5192",
				"children": []
			}, {
				"label": "门庄乡",
				"value": "5193",
				"children": []
			}, {
				"label": "徐家庄乡",
				"value": "5194",
				"children": []
			}, {
				"label": "北漳淮乡",
				"value": "5195",
				"children": []
			}, {
				"label": "小寨乡",
				"value": "5196",
				"children": []
			}]
		}, {
			"label": "深州市",
			"value": "292",
			"children": [{
				"label": "唐奉镇",
				"value": "5197",
				"children": []
			}, {
				"label": "深州镇",
				"value": "5198",
				"children": []
			}, {
				"label": "辰时镇",
				"value": "5199",
				"children": []
			}, {
				"label": "榆科镇",
				"value": "5200",
				"children": []
			}, {
				"label": "魏桥镇",
				"value": "5201",
				"children": []
			}, {
				"label": "大堤镇",
				"value": "5202",
				"children": []
			}, {
				"label": "前磨头镇",
				"value": "5203",
				"children": []
			}, {
				"label": "王家井镇",
				"value": "5204",
				"children": []
			}, {
				"label": "护驾迟镇",
				"value": "5205",
				"children": []
			}, {
				"label": "兵曹乡",
				"value": "5206",
				"children": []
			}, {
				"label": "穆村乡",
				"value": "5207",
				"children": []
			}, {
				"label": "东安庄乡",
				"value": "5208",
				"children": []
			}, {
				"label": "北溪村乡",
				"value": "5209",
				"children": []
			}, {
				"label": "大冯营乡",
				"value": "5210",
				"children": []
			}, {
				"label": "乔屯乡",
				"value": "5211",
				"children": []
			}, {
				"label": "太古庄乡",
				"value": "5212",
				"children": []
			}, {
				"label": "大屯乡",
				"value": "5213",
				"children": []
			}]
		}, {
			"label": "饶阳县",
			"value": "293",
		}, {
			"label": "枣强县",
			"value": "294",
		}, {
			"label": "故城县",
			"value": "295",
		}, {
			"label": "阜城县",
			"value": "296",
		}, {
			"label": "安平县",
			"value": "297",
		}, {
			"label": "武邑县",
			"value": "298",
		}, {
			"label": "景县",
			"value": "299",
		}, {
			"label": "武强县",
			"value": "300",
		}, {
			"label": "桃城区",
			"value": "53015",
		}]
	}]
}, {
	"label": "山西",
	"value": "6",
	"children": [{
		"label": "太原市",
		"value": "303",
		"children": [{
			"label": "阳曲县",
			"value": "304",
		}, {
			"label": "古交市",
			"value": "305",
			"children": [{
				"label": "东曲街道",
				"value": "5318",
				"children": []
			}, {
				"label": "西曲街道",
				"value": "5319",
				"children": []
			}, {
				"label": "桃园街道",
				"value": "5320",
				"children": []
			}, {
				"label": "屯兰街道",
				"value": "5321",
				"children": []
			}, {
				"label": "河口镇",
				"value": "5322",
				"children": []
			}, {
				"label": "镇城底镇",
				"value": "5323",
				"children": []
			}, {
				"label": "马兰镇",
				"value": "5324",
				"children": []
			}, {
				"label": "阁上乡",
				"value": "5325",
				"children": []
			}, {
				"label": "加乐泉乡",
				"value": "5326",
				"children": []
			}, {
				"label": "梭峪乡",
				"value": "5327",
				"children": []
			}, {
				"label": "岔口乡",
				"value": "5328",
				"children": []
			}, {
				"label": "常安乡",
				"value": "5329",
				"children": []
			}, {
				"label": "原相乡",
				"value": "5330",
				"children": []
			}, {
				"label": "邢家社乡",
				"value": "5331",
				"children": []
			}]
		}, {
			"label": "娄烦县",
			"value": "306",
		}, {
			"label": "清徐县",
			"value": "307",
		}, {
			"label": "小店区",
			"value": "53515",
		}, {
			"label": "迎泽区",
			"value": "53516",
		}, {
			"label": "晋源区",
			"value": "53517",
		}, {
			"label": "万柏林区",
			"value": "53518",
		}, {
			"label": "尖草坪区",
			"value": "53519",
		}, {
			"label": "杏花岭区",
			"value": "53520",
		}]
	}, {
		"label": "大同市",
		"value": "309",
		"children": [{
			"label": "大同县",
			"value": "310",
		}, {
			"label": "天镇县",
			"value": "311",
		}, {
			"label": "灵丘县",
			"value": "312",
		}, {
			"label": "阳高县",
			"value": "313",
		}, {
			"label": "左云县",
			"value": "314",
		}, {
			"label": "浑源县",
			"value": "315",
		}, {
			"label": "广灵县",
			"value": "316",
		}, {
			"label": "新荣区",
			"value": "3214",
		}, {
			"label": "南郊区",
			"value": "3216",
		}, {
			"label": "矿区",
			"value": "3217",
		}, {
			"label": "城区",
			"value": "53521",
		}]
	}, {
		"label": "阳泉市",
		"value": "318",
		"children": [{
			"label": "盂县",
			"value": "319",
		}, {
			"label": "平定县",
			"value": "320",
		}, {
			"label": "郊区",
			"value": "321",
		}, {
			"label": "矿区",
			"value": "3219",
		}, {
			"label": "城区",
			"value": "53522",
		}]
	}, {
		"label": "晋城市",
		"value": "325",
		"children": [{
			"label": "高平市",
			"value": "326",
			"children": [{
				"label": "北城街道",
				"value": "5332",
				"children": []
			}, {
				"label": "东城街道",
				"value": "5333",
				"children": []
			}, {
				"label": "南城街道",
				"value": "5334",
				"children": []
			}, {
				"label": "米山镇",
				"value": "5335",
				"children": []
			}, {
				"label": "三甲镇",
				"value": "5336",
				"children": []
			}, {
				"label": "陈区镇",
				"value": "5337",
				"children": []
			}, {
				"label": "北诗镇",
				"value": "5338",
				"children": []
			}, {
				"label": "河西镇",
				"value": "5339",
				"children": []
			}, {
				"label": "马村镇",
				"value": "5340",
				"children": []
			}, {
				"label": "野川镇",
				"value": "5341",
				"children": []
			}, {
				"label": "寺庄镇",
				"value": "5342",
				"children": []
			}, {
				"label": "神农镇",
				"value": "5343",
				"children": []
			}, {
				"label": "建宁乡",
				"value": "5344",
				"children": []
			}, {
				"label": "石末乡",
				"value": "5345",
				"children": []
			}, {
				"label": "原村乡",
				"value": "5346",
				"children": []
			}, {
				"label": "永录乡",
				"value": "5347",
				"children": []
			}]
		}, {
			"label": "阳城县",
			"value": "327",
		}, {
			"label": "沁水县",
			"value": "328",
		}, {
			"label": "陵川县",
			"value": "329",
		}, {
			"label": "泽州县",
			"value": "2967",
		}, {
			"label": "城 区",
			"value": "3073",
		}]
	}, {
		"label": "朔州市",
		"value": "330",
		"children": [{
			"label": "山阴县",
			"value": "331",
		}, {
			"label": "右玉县",
			"value": "332",
		}, {
			"label": "应县",
			"value": "333",
		}, {
			"label": "怀仁县",
			"value": "334",
		}, {
			"label": "朔城区",
			"value": "335",
		}, {
			"label": "平鲁区",
			"value": "3118",
		}]
	}, {
		"label": "晋中市",
		"value": "336",
		"children": [{
			"label": "介休市",
			"value": "338",
			"children": [{
				"label": "北关街道",
				"value": "5348",
				"children": []
			}, {
				"label": "西关街道",
				"value": "5349",
				"children": []
			}, {
				"label": "东南街道",
				"value": "5350",
				"children": []
			}, {
				"label": "西南街道",
				"value": "5351",
				"children": []
			}, {
				"label": "北坛街道",
				"value": "5352",
				"children": []
			}, {
				"label": "义安镇",
				"value": "5353",
				"children": []
			}, {
				"label": "张兰镇",
				"value": "5354",
				"children": []
			}, {
				"label": "连福镇",
				"value": "5355",
				"children": []
			}, {
				"label": "洪山镇",
				"value": "5356",
				"children": []
			}, {
				"label": "龙凤镇",
				"value": "5357",
				"children": []
			}, {
				"label": "绵山镇",
				"value": "5358",
				"children": []
			}, {
				"label": "义棠镇",
				"value": "5359",
				"children": []
			}, {
				"label": "城关乡",
				"value": "5360",
				"children": []
			}, {
				"label": "宋古乡",
				"value": "5361",
				"children": []
			}, {
				"label": "三佳乡",
				"value": "5362",
				"children": []
			}]
		}, {
			"label": "昔阳县",
			"value": "339",
		}, {
			"label": "祁县",
			"value": "341",
		}, {
			"label": "左权县",
			"value": "342",
		}, {
			"label": "寿阳县",
			"value": "343",
		}, {
			"label": "太谷县",
			"value": "344",
		}, {
			"label": "和顺县",
			"value": "345",
		}, {
			"label": "灵石县",
			"value": "346",
		}, {
			"label": "平遥县",
			"value": "347",
		}, {
			"label": "榆社县",
			"value": "348",
		}, {
			"label": "榆次区",
			"value": "53523",
		}]
	}, {
		"label": "忻州市",
		"value": "350",
		"children": [{
			"label": "原平市",
			"value": "351",
			"children": [{
				"label": "北城街道",
				"value": "5363",
				"children": []
			}, {
				"label": "南城街道",
				"value": "5364",
				"children": []
			}, {
				"label": "东社镇",
				"value": "5365",
				"children": []
			}, {
				"label": "苏龙口镇",
				"value": "5366",
				"children": []
			}, {
				"label": "崞阳镇",
				"value": "5367",
				"children": []
			}, {
				"label": "大牛店镇",
				"value": "5368",
				"children": []
			}, {
				"label": "长梁沟镇",
				"value": "5370",
				"children": []
			}, {
				"label": "轩岗镇",
				"value": "5371",
				"children": []
			}, {
				"label": "新原乡",
				"value": "5372",
				"children": []
			}, {
				"label": "南白乡",
				"value": "5373",
				"children": []
			}, {
				"label": "子干乡",
				"value": "5374",
				"children": []
			}, {
				"label": "沿沟乡",
				"value": "5376",
				"children": []
			}, {
				"label": "大林乡",
				"value": "5377",
				"children": []
			}, {
				"label": "西镇乡",
				"value": "5378",
				"children": []
			}, {
				"label": "解村乡",
				"value": "5379",
				"children": []
			}, {
				"label": "王家庄乡",
				"value": "5380",
				"children": []
			}, {
				"label": "楼板寨乡",
				"value": "5381",
				"children": []
			}, {
				"label": "段家堡乡",
				"value": "5382",
				"children": []
			}]
		}, {
			"label": "代县",
			"value": "352",
		}, {
			"label": "神池县",
			"value": "353",
		}, {
			"label": "五寨县",
			"value": "354",
		}, {
			"label": "五台县",
			"value": "358",
		}, {
			"label": "偏关县",
			"value": "359",
		}, {
			"label": "宁武县",
			"value": "360",
		}, {
			"label": "静乐县",
			"value": "361",
		}, {
			"label": "繁峙县",
			"value": "362",
		}, {
			"label": "河曲县",
			"value": "363",
		}, {
			"label": "保德县",
			"value": "364",
		}, {
			"label": "定襄县",
			"value": "365",
		}, {
			"label": "忻府区",
			"value": "366",
		}, {
			"label": "岢岚县",
			"value": "367",
		}]
	}, {
		"label": "吕梁市",
		"value": "368",
		"children": [{
			"label": "离石区",
			"value": "369",
		}, {
			"label": "孝义市",
			"value": "370",
			"children": [{
				"label": "新义街道",
				"value": "5383",
				"children": []
			}, {
				"label": "中阳楼街道",
				"value": "5384",
				"children": []
			}, {
				"label": "振兴街道",
				"value": "5385",
				"children": []
			}, {
				"label": "阳泉曲镇",
				"value": "5387",
				"children": []
			}, {
				"label": "下堡镇",
				"value": "5388",
				"children": []
			}, {
				"label": "西辛庄镇",
				"value": "5389",
				"children": []
			}, {
				"label": "高阳镇",
				"value": "5390",
				"children": []
			}, {
				"label": "梧桐镇",
				"value": "5391",
				"children": []
			}, {
				"label": "柱濮镇",
				"value": "5392",
				"children": []
			}, {
				"label": "大孝堡乡",
				"value": "5393",
				"children": []
			}, {
				"label": "下栅乡",
				"value": "5394",
				"children": []
			}, {
				"label": "驿马乡",
				"value": "5395",
				"children": []
			}, {
				"label": "南阳乡",
				"value": "5396",
				"children": []
			}, {
				"label": "杜村乡",
				"value": "5397",
				"children": []
			}]
		}, {
			"label": "汾阳市",
			"value": "371",
			"children": [{
				"label": "文峰街道",
				"value": "5398",
				"children": []
			}, {
				"label": "太和桥街道",
				"value": "5399",
				"children": []
			}, {
				"label": "贾家庄镇",
				"value": "5400",
				"children": []
			}, {
				"label": "杏花村镇",
				"value": "5401",
				"children": []
			}, {
				"label": "冀村镇",
				"value": "5402",
				"children": []
			}, {
				"label": "肖家庄镇",
				"value": "5403",
				"children": []
			}, {
				"label": "演武镇",
				"value": "5404",
				"children": []
			}, {
				"label": "三泉镇",
				"value": "5405",
				"children": []
			}, {
				"label": "石庄镇",
				"value": "5406",
				"children": []
			}, {
				"label": "杨家庄镇",
				"value": "5407",
				"children": []
			}, {
				"label": "峪道河镇",
				"value": "5408",
				"children": []
			}, {
				"label": "西河乡",
				"value": "5409",
				"children": []
			}, {
				"label": "阳城乡",
				"value": "5410",
				"children": []
			}, {
				"label": "栗家庄乡",
				"value": "5411",
				"children": []
			}]
		}, {
			"label": "文水县",
			"value": "372",
		}, {
			"label": "中阳县",
			"value": "373",
		}, {
			"label": "兴县",
			"value": "374",
		}, {
			"label": "临县",
			"value": "375",
		}, {
			"label": "方山县",
			"value": "376",
		}, {
			"label": "柳林县",
			"value": "377",
		}, {
			"label": "岚县",
			"value": "378",
		}, {
			"label": "交口县",
			"value": "3235",
		}, {
			"label": "交城县",
			"value": "3236",
		}, {
			"label": "石楼县",
			"value": "3237",
		}]
	}, {
		"label": "临汾市",
		"value": "379",
		"children": [{
			"label": "侯马市",
			"value": "380",
			"children": [{
				"label": "路东街道",
				"value": "5412",
				"children": []
			}, {
				"label": "路西街道",
				"value": "5413",
				"children": []
			}, {
				"label": "浍滨街道",
				"value": "5414",
				"children": []
			}, {
				"label": "上马街道",
				"value": "5415",
				"children": []
			}, {
				"label": "张村街道",
				"value": "5416",
				"children": []
			}, {
				"label": "新田乡",
				"value": "5417",
				"children": []
			}, {
				"label": "高村乡",
				"value": "5418",
				"children": []
			}, {
				"label": "凤城乡",
				"value": "5419",
				"children": []
			}]
		}, {
			"label": "霍州市",
			"value": "381",
			"children": [{
				"label": "鼓楼街道",
				"value": "5420",
				"children": []
			}, {
				"label": "北环路街道",
				"value": "5421",
				"children": []
			}, {
				"label": "南环路街道",
				"value": "5422",
				"children": []
			}, {
				"label": "开元街道",
				"value": "5423",
				"children": []
			}, {
				"label": "退沙街道",
				"value": "5424",
				"children": []
			}, {
				"label": "白龙镇",
				"value": "5425",
				"children": []
			}, {
				"label": "辛置镇",
				"value": "5426",
				"children": []
			}, {
				"label": "大张镇",
				"value": "5427",
				"children": []
			}, {
				"label": "李曹镇",
				"value": "5428",
				"children": []
			}, {
				"label": "陶唐峪乡",
				"value": "5429",
				"children": []
			}, {
				"label": "三教乡",
				"value": "5430",
				"children": []
			}, {
				"label": "师庄乡",
				"value": "5431",
				"children": []
			}]
		}, {
			"label": "汾西县",
			"value": "382",
		}, {
			"label": "吉县",
			"value": "383",
		}, {
			"label": "安泽县",
			"value": "384",
		}, {
			"label": "浮山县",
			"value": "386",
		}, {
			"label": "大宁县",
			"value": "387",
		}, {
			"label": "古县",
			"value": "388",
		}, {
			"label": "隰县",
			"value": "389",
		}, {
			"label": "襄汾县",
			"value": "390",
		}, {
			"label": "翼城县",
			"value": "391",
		}, {
			"label": "永和县",
			"value": "392",
		}, {
			"label": "乡宁县",
			"value": "393",
		}, {
			"label": "洪洞县",
			"value": "395",
		}, {
			"label": "蒲县",
			"value": "396",
		}, {
			"label": "曲沃县",
			"value": "3136",
		}, {
			"label": "尧都区",
			"value": "53524",
		}]
	}, {
		"label": "运城市",
		"value": "398",
		"children": [{
			"label": "河津市",
			"value": "399",
			"children": [{
				"label": "城区街道",
				"value": "5432",
				"children": []
			}, {
				"label": "清涧街道",
				"value": "5433",
				"children": []
			}, {
				"label": "樊村镇",
				"value": "5434",
				"children": []
			}, {
				"label": "僧楼镇",
				"value": "5435",
				"children": []
			}, {
				"label": "小梁乡",
				"value": "5436",
				"children": []
			}, {
				"label": "柴家乡",
				"value": "5437",
				"children": []
			}, {
				"label": "赵家庄乡",
				"value": "5438",
				"children": []
			}, {
				"label": "下化乡",
				"value": "5439",
				"children": []
			}, {
				"label": "阳村乡",
				"value": "5440",
				"children": []
			}]
		}, {
			"label": "永济市",
			"value": "400",
			"children": [{
				"label": "城西街道",
				"value": "5441",
				"children": []
			}, {
				"label": "城北街道",
				"value": "5442",
				"children": []
			}, {
				"label": "城东街道",
				"value": "5443",
				"children": []
			}, {
				"label": "虞乡镇",
				"value": "5444",
				"children": []
			}, {
				"label": "卿头镇",
				"value": "5445",
				"children": []
			}, {
				"label": "开张镇",
				"value": "5446",
				"children": []
			}, {
				"label": "枵栳镇",
				"value": "5447",
				"children": []
			}, {
				"label": "蒲州镇",
				"value": "5448",
				"children": []
			}, {
				"label": "韩阳镇",
				"value": "5449",
				"children": []
			}, {
				"label": "张营镇",
				"value": "5450",
				"children": []
			}]
		}, {
			"label": "新绛县",
			"value": "402",
		}, {
			"label": "平陆县",
			"value": "403",
		}, {
			"label": "垣曲县",
			"value": "404",
		}, {
			"label": "绛县",
			"value": "405",
		}, {
			"label": "稷山县",
			"value": "406",
		}, {
			"label": "芮城县",
			"value": "407",
		}, {
			"label": "夏县",
			"value": "408",
		}, {
			"label": "临猗县",
			"value": "409",
		}, {
			"label": "万荣县",
			"value": "410",
		}, {
			"label": "闻喜县",
			"value": "3233",
		}, {
			"label": "盐湖区",
			"value": "53525",
		}]
	}, {
		"label": "长治市",
		"value": "3074",
		"children": [{
			"label": "长治县",
			"value": "3075",
		}, {
			"label": "潞城市",
			"value": "3109",
			"children": [{
				"label": "潞华街道",
				"value": "5309",
				"children": []
			}, {
				"label": "成家川街道",
				"value": "5310",
				"children": []
			}, {
				"label": "店上镇",
				"value": "5311",
				"children": []
			}, {
				"label": "微子镇",
				"value": "5312",
				"children": []
			}, {
				"label": "辛安泉镇",
				"value": "5313",
				"children": []
			}, {
				"label": "翟店镇",
				"value": "5314",
				"children": []
			}, {
				"label": "合室乡",
				"value": "5315",
				"children": []
			}, {
				"label": "黄牛蹄乡",
				"value": "5316",
				"children": []
			}, {
				"label": "史迥乡",
				"value": "5317",
				"children": []
			}]
		}, {
			"label": "郊区",
			"value": "3222",
		}, {
			"label": "襄垣县",
			"value": "3223",
		}, {
			"label": "屯留县",
			"value": "3224",
		}, {
			"label": "平顺县",
			"value": "3225",
		}, {
			"label": "黎城县",
			"value": "3226",
		}, {
			"label": "壶关县",
			"value": "3227",
		}, {
			"label": "长子县",
			"value": "3228",
		}, {
			"label": "武乡县",
			"value": "3229",
		}, {
			"label": "沁县",
			"value": "3230",
		}, {
			"label": "沁源县",
			"value": "3231",
		}, {
			"label": "城区",
			"value": "53526",
		}]
	}]
}, {
	"label": "河南",
	"value": "7",
	"children": [{
		"label": "郑州市",
		"value": "412",
		"children": [{
			"label": "新密市",
			"value": "415",
		}, {
			"label": "登封市",
			"value": "416",
		}, {
			"label": "上街区",
			"value": "2782",
		}, {
			"label": "惠济区",
			"value": "3544",
		}, {
			"label": "金水区",
			"value": "3545",
		}, {
			"label": "管城区",
			"value": "3546",
		}, {
			"label": "二七区",
			"value": "3547",
		}, {
			"label": "中原区",
			"value": "3548",
		}, {
			"label": "郑东新区",
			"value": "4337",
		}, {
			"label": "新郑区",
			"value": "53175",
		}, {
			"label": "巩义市",
			"value": "53176",
		}, {
			"label": "荥阳区",
			"value": "53177",
		}, {
			"label": "中牟县",
			"value": "53178",
		}, {
			"label": "经济开发区",
			"value": "53179",
		}, {
			"label": "高新技术开发区",
			"value": "53180",
		}]
	}, {
		"label": "开封市",
		"value": "420",
		"children": [{
			"label": "开封县",
			"value": "421",
		}, {
			"label": "杞县",
			"value": "422",
		}, {
			"label": "兰考县",
			"value": "423",
		}, {
			"label": "尉氏县",
			"value": "425",
		}, {
			"label": "通许县",
			"value": "3127",
		}, {
			"label": "金明区",
			"value": "53181",
		}, {
			"label": "龙亭区",
			"value": "53182",
		}, {
			"label": "顺河区",
			"value": "53183",
		}, {
			"label": "鼓楼区",
			"value": "53184",
		}, {
			"label": "禹王台区",
			"value": "53185",
		}]
	}, {
		"label": "洛阳市",
		"value": "427",
		"children": [{
			"label": "偃师市",
			"value": "428",
			"children": [{
				"label": "城关镇",
				"value": "5684",
				"children": []
			}, {
				"label": "首阳山镇",
				"value": "5685",
				"children": []
			}, {
				"label": "翟镇镇",
				"value": "5687",
				"children": []
			}, {
				"label": "岳滩镇",
				"value": "5688",
				"children": []
			}, {
				"label": "顾县镇",
				"value": "5689",
				"children": []
			}, {
				"label": "缑氏镇",
				"value": "5690",
				"children": []
			}, {
				"label": "府店镇",
				"value": "5691",
				"children": []
			}, {
				"label": "高龙镇",
				"value": "5692",
				"children": []
			}, {
				"label": "诸葛镇",
				"value": "5696",
				"children": []
			}, {
				"label": "山化乡",
				"value": "5697",
				"children": []
			}, {
				"label": "邙岭乡",
				"value": "5698",
				"children": []
			}, {
				"label": "大口乡",
				"value": "5699",
				"children": []
			}]
		}, {
			"label": "孟津县",
			"value": "429",
		}, {
			"label": "汝阳县",
			"value": "430",
		}, {
			"label": "伊川县",
			"value": "431",
		}, {
			"label": "洛宁县",
			"value": "432",
		}, {
			"label": "宜阳县",
			"value": "434",
		}, {
			"label": "栾川县",
			"value": "435",
		}, {
			"label": "新安县",
			"value": "436",
		}, {
			"label": "吉利区",
			"value": "3555",
		}, {
			"label": "涧西区",
			"value": "3556",
		}, {
			"label": "瀍河区",
			"value": "3557",
		}, {
			"label": "老城区",
			"value": "3558",
		}, {
			"label": "西工区",
			"value": "3559",
		}, {
			"label": "嵩县",
			"value": "4150",
		}, {
			"label": "伊滨区",
			"value": "53186",
		}, {
			"label": "洛龙区",
			"value": "53187",
		}]
	}, {
		"label": "平顶山市",
		"value": "438",
		"children": [{
			"label": "汝州市",
			"value": "439",
			"children": [{
				"label": "煤山街道",
				"value": "5700",
				"children": []
			}, {
				"label": "风穴路街道",
				"value": "5701",
				"children": []
			}, {
				"label": "钟楼街道",
				"value": "5702",
				"children": []
			}, {
				"label": "洗耳河街道",
				"value": "5703",
				"children": []
			}, {
				"label": "汝南街道",
				"value": "5704",
				"children": []
			}, {
				"label": "寄料镇",
				"value": "5705",
				"children": []
			}, {
				"label": "温泉镇",
				"value": "5706",
				"children": []
			}, {
				"label": "临汝镇",
				"value": "5707",
				"children": []
			}, {
				"label": "小屯镇",
				"value": "5708",
				"children": []
			}, {
				"label": "杨楼镇",
				"value": "5709",
				"children": []
			}, {
				"label": "蟒川镇",
				"value": "5710",
				"children": []
			}, {
				"label": "王寨乡",
				"value": "5711",
				"children": []
			}, {
				"label": "陵头镇",
				"value": "5712",
				"children": []
			}, {
				"label": "庙下乡",
				"value": "5713",
				"children": []
			}, {
				"label": "纸坊乡",
				"value": "5714",
				"children": []
			}, {
				"label": "米庙镇",
				"value": "5715",
				"children": []
			}, {
				"label": "骑岭乡",
				"value": "5716",
				"children": []
			}, {
				"label": "大峪乡",
				"value": "5717",
				"children": []
			}, {
				"label": "夏店乡",
				"value": "5718",
				"children": []
			}, {
				"label": "焦村乡",
				"value": "5719",
				"children": []
			}]
		}, {
			"label": "舞钢市",
			"value": "440",
			"children": [{
				"label": "垭口街道",
				"value": "5720",
				"children": []
			}, {
				"label": "寺坡街道",
				"value": "5721",
				"children": []
			}, {
				"label": "朱兰街道",
				"value": "5722",
				"children": []
			}, {
				"label": "院岭街道",
				"value": "5723",
				"children": []
			}, {
				"label": "尚店镇",
				"value": "5724",
				"children": []
			}, {
				"label": "八台镇",
				"value": "5725",
				"children": []
			}, {
				"label": "尹集镇",
				"value": "5726",
				"children": []
			}, {
				"label": "枣林乡",
				"value": "5727",
				"children": []
			}, {
				"label": "庙街乡",
				"value": "5728",
				"children": []
			}, {
				"label": "铁山乡",
				"value": "5729",
				"children": []
			}, {
				"label": "武功乡",
				"value": "5730",
				"children": []
			}, {
				"label": "杨庄乡",
				"value": "5731",
				"children": []
			}]
		}, {
			"label": "郏县",
			"value": "441",
		}, {
			"label": "叶县",
			"value": "442",
		}, {
			"label": "鲁山县",
			"value": "443",
		}, {
			"label": "宝丰县",
			"value": "444",
		}, {
			"label": "石龙区",
			"value": "3560",
		}, {
			"label": "湛河区",
			"value": "53188",
		}, {
			"label": "卫东区",
			"value": "53189",
		}, {
			"label": "新华区",
			"value": "53190",
		}]
	}, {
		"label": "焦作市",
		"value": "446",
		"children": [{
			"label": "沁阳市",
			"value": "447",
			"children": [{
				"label": "覃怀街道",
				"value": "5732",
				"children": []
			}, {
				"label": "怀庆街道",
				"value": "5733",
				"children": []
			}, {
				"label": "太行街道",
				"value": "5734",
				"children": []
			}, {
				"label": "沁园街道",
				"value": "5735",
				"children": []
			}, {
				"label": "崇义镇",
				"value": "5736",
				"children": []
			}, {
				"label": "西向镇",
				"value": "5737",
				"children": []
			}, {
				"label": "西万镇",
				"value": "5738",
				"children": []
			}, {
				"label": "柏香镇",
				"value": "5739",
				"children": []
			}, {
				"label": "山王庄镇",
				"value": "5740",
				"children": []
			}, {
				"label": "紫陵镇",
				"value": "5741",
				"children": []
			}, {
				"label": "常平乡",
				"value": "5742",
				"children": []
			}, {
				"label": "王召乡",
				"value": "5743",
				"children": []
			}, {
				"label": "王曲乡",
				"value": "5744",
				"children": []
			}]
		}, {
			"label": "孟州市",
			"value": "448",
			"children": [{
				"label": "大定街道",
				"value": "5745",
				"children": []
			}, {
				"label": "会昌街道",
				"value": "5746",
				"children": []
			}, {
				"label": "河阳街道",
				"value": "5747",
				"children": []
			}, {
				"label": "河雍街道",
				"value": "5748",
				"children": []
			}, {
				"label": "化工镇",
				"value": "5749",
				"children": []
			}, {
				"label": "南庄镇",
				"value": "5750",
				"children": []
			}, {
				"label": "城伯镇",
				"value": "5751",
				"children": []
			}, {
				"label": "谷旦镇",
				"value": "5752",
				"children": []
			}, {
				"label": "西虢镇",
				"value": "5753",
				"children": []
			}, {
				"label": "赵和镇",
				"value": "5754",
				"children": []
			}, {
				"label": "槐树乡",
				"value": "5755",
				"children": []
			}]
		}, {
			"label": "修武县",
			"value": "449",
		}, {
			"label": "温县",
			"value": "450",
		}, {
			"label": "武陟县",
			"value": "451",
		}, {
			"label": "博爱县",
			"value": "452",
		}, {
			"label": "山阳区",
			"value": "453",
		}, {
			"label": "解放区",
			"value": "3566",
		}, {
			"label": "马村区",
			"value": "53191",
		}, {
			"label": "中站区",
			"value": "53192",
		}]
	}, {
		"label": "鹤壁市",
		"value": "454",
		"children": [{
			"label": "浚县",
			"value": "455",
		}, {
			"label": "淇县",
			"value": "456",
		}, {
			"label": "鹤山区",
			"value": "457",
		}, {
			"label": "山城区",
			"value": "3567",
		}, {
			"label": "淇滨区",
			"value": "53193",
		}]
	}, {
		"label": "新乡市",
		"value": "458",
		"children": [{
			"label": "卫辉市",
			"value": "459",
			"children": [{
				"label": "汲水镇",
				"value": "5756",
				"children": []
			}, {
				"label": "太公泉镇",
				"value": "5757",
				"children": []
			}, {
				"label": "孙杏村镇",
				"value": "5758",
				"children": []
			}, {
				"label": "后河镇",
				"value": "5759",
				"children": []
			}, {
				"label": "李源屯镇",
				"value": "5760",
				"children": []
			}, {
				"label": "唐庄镇",
				"value": "5761",
				"children": []
			}, {
				"label": "上乐村镇",
				"value": "5762",
				"children": []
			}, {
				"label": "狮豹头乡",
				"value": "5763",
				"children": []
			}, {
				"label": "安都乡",
				"value": "5764",
				"children": []
			}, {
				"label": "顿坊店乡",
				"value": "5765",
				"children": []
			}, {
				"label": "柳庄乡",
				"value": "5766",
				"children": []
			}, {
				"label": "庞寨乡",
				"value": "5767",
				"children": []
			}, {
				"label": "城郊乡",
				"value": "5768",
				"children": []
			}]
		}, {
			"label": "辉县市",
			"value": "460",
			"children": [{
				"label": "城关街道",
				"value": "5769",
				"children": []
			}, {
				"label": "胡桥街道",
				"value": "5770",
				"children": []
			}, {
				"label": "薄壁镇",
				"value": "5771",
				"children": []
			}, {
				"label": "峪河镇",
				"value": "5772",
				"children": []
			}, {
				"label": "百泉镇",
				"value": "5773",
				"children": []
			}, {
				"label": "孟庄镇",
				"value": "5774",
				"children": []
			}, {
				"label": "常村镇",
				"value": "5775",
				"children": []
			}, {
				"label": "吴村镇",
				"value": "5776",
				"children": []
			}, {
				"label": "南村镇",
				"value": "5777",
				"children": []
			}, {
				"label": "南寨镇",
				"value": "5778",
				"children": []
			}, {
				"label": "上八里镇",
				"value": "5779",
				"children": []
			}, {
				"label": "北云门镇",
				"value": "5780",
				"children": []
			}, {
				"label": "占城镇",
				"value": "5781",
				"children": []
			}, {
				"label": "黄水乡",
				"value": "5782",
				"children": []
			}, {
				"label": "高庄乡",
				"value": "5783",
				"children": []
			}, {
				"label": "张村乡",
				"value": "5784",
				"children": []
			}, {
				"label": "洪洲乡",
				"value": "5785",
				"children": []
			}, {
				"label": "西平罗乡",
				"value": "5786",
				"children": []
			}, {
				"label": "拍石头乡",
				"value": "5787",
				"children": []
			}, {
				"label": "赵固乡",
				"value": "5788",
				"children": []
			}, {
				"label": "沙窑乡",
				"value": "5789",
				"children": []
			}, {
				"label": "冀屯镇",
				"value": "5790",
				"children": []
			}]
		}, {
			"label": "新乡县",
			"value": "461",
		}, {
			"label": "获嘉县",
			"value": "462",
		}, {
			"label": "原阳县",
			"value": "463",
		}, {
			"label": "长垣县",
			"value": "464",
		}, {
			"label": "延津县",
			"value": "465",
		}, {
			"label": "封丘县",
			"value": "466",
		}, {
			"label": "凤泉区",
			"value": "3570",
		}, {
			"label": "牧野区",
			"value": "53194",
		}, {
			"label": "红旗区",
			"value": "53195",
		}, {
			"label": "卫滨区",
			"value": "53196",
		}]
	}, {
		"label": "安阳市",
		"value": "468",
		"children": [{
			"label": "林州市",
			"value": "469",
			"children": [{
				"label": "开元街道",
				"value": "5622",
				"children": []
			}, {
				"label": "振林街道",
				"value": "5623",
				"children": []
			}, {
				"label": "龙山街道",
				"value": "5624",
				"children": []
			}, {
				"label": "桂园街道",
				"value": "5625",
				"children": []
			}, {
				"label": "合涧镇",
				"value": "5626",
				"children": []
			}, {
				"label": "临淇镇",
				"value": "5627",
				"children": []
			}, {
				"label": "东姚镇",
				"value": "5628",
				"children": []
			}, {
				"label": "横水镇",
				"value": "5629",
				"children": []
			}, {
				"label": "河顺镇",
				"value": "5630",
				"children": []
			}, {
				"label": "任村镇",
				"value": "5631",
				"children": []
			}, {
				"label": "姚村镇",
				"value": "5632",
				"children": []
			}, {
				"label": "陵阳镇",
				"value": "5633",
				"children": []
			}, {
				"label": "原康镇",
				"value": "5634",
				"children": []
			}, {
				"label": "五龙镇",
				"value": "5635",
				"children": []
			}, {
				"label": "采桑镇",
				"value": "5636",
				"children": []
			}, {
				"label": "东岗镇",
				"value": "5637",
				"children": []
			}, {
				"label": "桂林镇",
				"value": "5638",
				"children": []
			}, {
				"label": "城郊乡",
				"value": "5639",
				"children": []
			}, {
				"label": "茶店乡",
				"value": "5640",
				"children": []
			}, {
				"label": "石板岩乡",
				"value": "5641",
				"children": []
			}]
		}, {
			"label": "安阳县",
			"value": "470",
		}, {
			"label": "滑县",
			"value": "471",
		}, {
			"label": "汤阴县",
			"value": "472",
		}, {
			"label": "内黄县",
			"value": "473",
		}, {
			"label": "龙安区",
			"value": "53197",
		}, {
			"label": "殷都区",
			"value": "53198",
		}, {
			"label": "文峰区",
			"value": "53199",
		}, {
			"label": "开发区",
			"value": "53200",
		}, {
			"label": "北关区",
			"value": "53201",
		}]
	}, {
		"label": "濮阳市",
		"value": "475",
		"children": [{
			"label": "濮阳县",
			"value": "476",
		}, {
			"label": "南乐县",
			"value": "477",
		}, {
			"label": "台前县",
			"value": "478",
		}, {
			"label": "清丰县",
			"value": "479",
		}, {
			"label": "范县",
			"value": "480",
		}, {
			"label": "华龙区",
			"value": "481",
		}]
	}, {
		"label": "许昌市",
		"value": "482",
		"children": [{
			"label": "禹州市",
			"value": "483",
			"children": [{
				"label": "颍川街道",
				"value": "5642",
				"children": []
			}, {
				"label": "夏都街道",
				"value": "5643",
				"children": []
			}, {
				"label": "韩城街道",
				"value": "5644",
				"children": []
			}, {
				"label": "钧台街道",
				"value": "5645",
				"children": []
			}, {
				"label": "火龙镇",
				"value": "5646",
				"children": []
			}, {
				"label": "顺店镇",
				"value": "5647",
				"children": []
			}, {
				"label": "方山镇",
				"value": "5648",
				"children": []
			}, {
				"label": "神垕镇",
				"value": "5649",
				"children": []
			}, {
				"label": "鸿畅镇",
				"value": "5650",
				"children": []
			}, {
				"label": "梁北镇",
				"value": "5651",
				"children": []
			}, {
				"label": "古城镇",
				"value": "5652",
				"children": []
			}, {
				"label": "无梁镇",
				"value": "5653",
				"children": []
			}, {
				"label": "文殊镇",
				"value": "5654",
				"children": []
			}, {
				"label": "朱阁镇",
				"value": "5655",
				"children": []
			}, {
				"label": "苌庄乡",
				"value": "5656",
				"children": []
			}, {
				"label": "花石乡",
				"value": "5657",
				"children": []
			}, {
				"label": "鸠山镇",
				"value": "5658",
				"children": []
			}, {
				"label": "磨街乡",
				"value": "5659",
				"children": []
			}, {
				"label": "张得乡",
				"value": "5660",
				"children": []
			}, {
				"label": "小吕乡",
				"value": "5661",
				"children": []
			}, {
				"label": "范坡镇",
				"value": "5662",
				"children": []
			}, {
				"label": "褚河镇",
				"value": "5663",
				"children": []
			}, {
				"label": "郭连镇",
				"value": "5664",
				"children": []
			}, {
				"label": "山货乡",
				"value": "5665",
				"children": []
			}, {
				"label": "浅井镇",
				"value": "5666",
				"children": []
			}, {
				"label": "方岗乡",
				"value": "5667",
				"children": []
			}]
		}, {
			"label": "长葛市",
			"value": "484",
			"children": [{
				"label": "建设路街道",
				"value": "5668",
				"children": []
			}, {
				"label": "长兴路街道",
				"value": "5669",
				"children": []
			}, {
				"label": "长社路街道",
				"value": "5670",
				"children": []
			}, {
				"label": "金桥路街道",
				"value": "5671",
				"children": []
			}, {
				"label": "和尚桥镇",
				"value": "5672",
				"children": []
			}, {
				"label": "坡胡镇",
				"value": "5673",
				"children": []
			}, {
				"label": "后河镇",
				"value": "5674",
				"children": []
			}, {
				"label": "石固镇",
				"value": "5675",
				"children": []
			}, {
				"label": "老城镇",
				"value": "5676",
				"children": []
			}, {
				"label": "南席镇",
				"value": "5677",
				"children": []
			}, {
				"label": "大周镇",
				"value": "5678",
				"children": []
			}, {
				"label": "董村镇",
				"value": "5679",
				"children": []
			}, {
				"label": "增福庙乡",
				"value": "5680",
				"children": []
			}, {
				"label": "官亭乡",
				"value": "5681",
				"children": []
			}, {
				"label": "石象乡",
				"value": "5682",
				"children": []
			}, {
				"label": "古桥乡",
				"value": "5683",
				"children": []
			}]
		}, {
			"label": "许昌县",
			"value": "485",
		}, {
			"label": "鄢陵县",
			"value": "486",
		}, {
			"label": "襄城县",
			"value": "487",
		}, {
			"label": "魏都区",
			"value": "488",
		}]
	}, {
		"label": "漯河市",
		"value": "489",
		"children": [{
			"label": "郾城区",
			"value": "490",
		}, {
			"label": "临颍县",
			"value": "492",
		}, {
			"label": "召陵区",
			"value": "493",
		}, {
			"label": "舞阳县",
			"value": "494",
		}, {
			"label": "源汇区",
			"value": "3576",
		}]
	}, {
		"label": "三门峡市",
		"value": "495",
		"children": [{
			"label": "义马市",
			"value": "496",
			"children": [{
				"label": "千秋路街道",
				"value": "5841",
				"children": []
			}, {
				"label": "朝阳路街道",
				"value": "5842",
				"children": []
			}, {
				"label": "新义街街道",
				"value": "5843",
				"children": []
			}, {
				"label": "常村路街道",
				"value": "5844",
				"children": []
			}, {
				"label": "泰山路街道",
				"value": "5845",
				"children": []
			}, {
				"label": "新区街道",
				"value": "5846",
				"children": []
			}, {
				"label": "东区街道",
				"value": "5847",
				"children": []
			}]
		}, {
			"label": "灵宝市",
			"value": "497",
			"children": [{
				"label": "城关镇",
				"value": "5848",
				"children": []
			}, {
				"label": "尹庄镇",
				"value": "5849",
				"children": []
			}, {
				"label": "朱阳镇",
				"value": "5850",
				"children": []
			}, {
				"label": "阳平镇",
				"value": "5851",
				"children": []
			}, {
				"label": "故县镇",
				"value": "5852",
				"children": []
			}, {
				"label": "豫灵镇",
				"value": "5853",
				"children": []
			}, {
				"label": "大王镇",
				"value": "5854",
				"children": []
			}, {
				"label": "阳店镇",
				"value": "5855",
				"children": []
			}, {
				"label": "函谷关镇",
				"value": "5856",
				"children": []
			}, {
				"label": "焦村镇",
				"value": "5857",
				"children": []
			}, {
				"label": "川口乡",
				"value": "5858",
				"children": []
			}, {
				"label": "寺河乡",
				"value": "5859",
				"children": []
			}, {
				"label": "苏村乡",
				"value": "5860",
				"children": []
			}, {
				"label": "五亩乡",
				"value": "5861",
				"children": []
			}, {
				"label": "西阎乡",
				"value": "5862",
				"children": []
			}]
		}, {
			"label": "陕县",
			"value": "498",
		}, {
			"label": "卢氏县",
			"value": "499",
		}, {
			"label": "渑池县",
			"value": "3113",
		}, {
			"label": "湖滨区",
			"value": "53202",
		}]
	}, {
		"label": "南阳市",
		"value": "502",
		"children": [{
			"label": "邓州市",
			"value": "503",
			"children": [{
				"label": "古城街道",
				"value": "5595",
				"children": []
			}, {
				"label": "花洲街道",
				"value": "5596",
				"children": []
			}, {
				"label": "湍河街道",
				"value": "5597",
				"children": []
			}, {
				"label": "罗庄镇",
				"value": "5598",
				"children": []
			}, {
				"label": "汲滩镇",
				"value": "5599",
				"children": []
			}, {
				"label": "穰东镇",
				"value": "5600",
				"children": []
			}, {
				"label": "孟楼镇",
				"value": "5601",
				"children": []
			}, {
				"label": "林扒镇",
				"value": "5602",
				"children": []
			}, {
				"label": "构林镇",
				"value": "5603",
				"children": []
			}, {
				"label": "十林镇",
				"value": "5604",
				"children": []
			}, {
				"label": "张村镇",
				"value": "5605",
				"children": []
			}, {
				"label": "都司镇",
				"value": "5606",
				"children": []
			}, {
				"label": "赵集镇",
				"value": "5607",
				"children": []
			}, {
				"label": "刘集镇",
				"value": "5608",
				"children": []
			}, {
				"label": "桑庄镇",
				"value": "5609",
				"children": []
			}, {
				"label": "彭桥镇",
				"value": "5610",
				"children": []
			}, {
				"label": "张楼乡",
				"value": "5611",
				"children": []
			}, {
				"label": "白牛乡",
				"value": "5612",
				"children": []
			}, {
				"label": "夏集乡",
				"value": "5613",
				"children": []
			}, {
				"label": "裴营乡",
				"value": "5614",
				"children": []
			}, {
				"label": "文渠乡",
				"value": "5615",
				"children": []
			}, {
				"label": "高集乡",
				"value": "5616",
				"children": []
			}, {
				"label": "陶营乡",
				"value": "5617",
				"children": []
			}, {
				"label": "小杨营乡",
				"value": "5618",
				"children": []
			}, {
				"label": "腰店乡",
				"value": "5619",
				"children": []
			}, {
				"label": "龙堰乡",
				"value": "5620",
				"children": []
			}, {
				"label": "九龙乡",
				"value": "5621",
				"children": []
			}]
		}, {
			"label": "桐柏县",
			"value": "504",
		}, {
			"label": "方城县",
			"value": "505",
		}, {
			"label": "淅川县",
			"value": "506",
		}, {
			"label": "镇平县",
			"value": "507",
		}, {
			"label": "唐河县",
			"value": "508",
		}, {
			"label": "南召县",
			"value": "509",
		}, {
			"label": "内乡县",
			"value": "510",
		}, {
			"label": "新野县",
			"value": "511",
		}, {
			"label": "社旗县",
			"value": "512",
		}, {
			"label": "西峡县",
			"value": "515",
		}, {
			"label": "卧龙区",
			"value": "53203",
		}, {
			"label": "宛城区",
			"value": "53204",
		}]
	}, {
		"label": "商丘市",
		"value": "517",
		"children": [{
			"label": "永城市",
			"value": "518",
			"children": [{
				"label": "演集镇",
				"value": "5791",
				"children": []
			}, {
				"label": "城关镇",
				"value": "5792",
				"children": []
			}, {
				"label": "芒山镇",
				"value": "5793",
				"children": []
			}, {
				"label": "高庄镇",
				"value": "5794",
				"children": []
			}, {
				"label": "酂城镇",
				"value": "5795",
				"children": []
			}, {
				"label": "裴桥镇",
				"value": "5796",
				"children": []
			}, {
				"label": "马桥镇",
				"value": "5797",
				"children": []
			}, {
				"label": "薛湖镇",
				"value": "5798",
				"children": []
			}, {
				"label": "蒋口镇",
				"value": "5799",
				"children": []
			}, {
				"label": "陈集镇",
				"value": "5800",
				"children": []
			}, {
				"label": "十八里镇",
				"value": "5801",
				"children": []
			}, {
				"label": "城厢乡",
				"value": "5802",
				"children": []
			}, {
				"label": "候岭乡",
				"value": "5803",
				"children": []
			}, {
				"label": "黄口乡",
				"value": "5804",
				"children": []
			}, {
				"label": "新桥乡",
				"value": "5805",
				"children": []
			}, {
				"label": "双桥乡",
				"value": "5806",
				"children": []
			}, {
				"label": "王集乡",
				"value": "5807",
				"children": []
			}, {
				"label": "条河乡",
				"value": "5815",
				"children": []
			}, {
				"label": "刘河乡",
				"value": "5816",
				"children": []
			}, {
				"label": "陈官庄乡",
				"value": "5817",
				"children": []
			}]
		}, {
			"label": "宁陵县",
			"value": "519",
		}, {
			"label": "虞城县",
			"value": "520",
		}, {
			"label": "民权县",
			"value": "521",
		}, {
			"label": "夏邑县",
			"value": "522",
		}, {
			"label": "柘城县",
			"value": "523",
		}, {
			"label": "睢县",
			"value": "524",
		}, {
			"label": "睢阳区",
			"value": "53205",
		}, {
			"label": "梁园区",
			"value": "53206",
		}]
	}, {
		"label": "周口市",
		"value": "527",
		"children": [{
			"label": "项城市",
			"value": "529",
			"children": [{
				"label": "花园街道",
				"value": "5820",
				"children": []
			}, {
				"label": "水寨街道",
				"value": "5821",
				"children": []
			}, {
				"label": "东方街道",
				"value": "5822",
				"children": []
			}, {
				"label": "莲花街道",
				"value": "5823",
				"children": []
			}, {
				"label": "光武街道",
				"value": "5824",
				"children": []
			}, {
				"label": "千佛阁街道",
				"value": "5825",
				"children": []
			}, {
				"label": "南顿镇",
				"value": "5826",
				"children": []
			}, {
				"label": "孙店镇",
				"value": "5827",
				"children": []
			}, {
				"label": "李寨镇",
				"value": "5828",
				"children": []
			}, {
				"label": "贾岭镇",
				"value": "5829",
				"children": []
			}, {
				"label": "高寺镇",
				"value": "5830",
				"children": []
			}, {
				"label": "新桥镇",
				"value": "5831",
				"children": []
			}, {
				"label": "付集镇",
				"value": "5832",
				"children": []
			}, {
				"label": "官会镇",
				"value": "5833",
				"children": []
			}, {
				"label": "丁集镇",
				"value": "5834",
				"children": []
			}, {
				"label": "郑郭镇",
				"value": "5835",
				"children": []
			}, {
				"label": "秣陵镇",
				"value": "5836",
				"children": []
			}, {
				"label": "王明口镇",
				"value": "5837",
				"children": []
			}, {
				"label": "永丰乡",
				"value": "5838",
				"children": []
			}, {
				"label": "范集镇",
				"value": "5839",
				"children": []
			}, {
				"label": "三店乡",
				"value": "5840",
				"children": []
			}]
		}, {
			"label": "商水县",
			"value": "530",
		}, {
			"label": "淮阳县",
			"value": "531",
		}, {
			"label": "太康县",
			"value": "532",
		}, {
			"label": "鹿邑县",
			"value": "533",
		}, {
			"label": "西华县",
			"value": "534",
		}, {
			"label": "扶沟县",
			"value": "535",
		}, {
			"label": "沈丘县",
			"value": "536",
		}, {
			"label": "郸城县",
			"value": "537",
		}, {
			"label": "东新区",
			"value": "53207",
		}, {
			"label": "经济开发区",
			"value": "53208",
		}, {
			"label": "川汇区",
			"value": "53209",
		}]
	}, {
		"label": "驻马店市",
		"value": "538",
		"children": [{
			"label": "确山县",
			"value": "540",
		}, {
			"label": "新蔡县",
			"value": "541",
		}, {
			"label": "上蔡县",
			"value": "542",
		}, {
			"label": "泌阳县",
			"value": "543",
		}, {
			"label": "西平县",
			"value": "544",
		}, {
			"label": "遂平县",
			"value": "545",
		}, {
			"label": "汝南县",
			"value": "546",
		}, {
			"label": "平舆县",
			"value": "547",
		}, {
			"label": "正阳县",
			"value": "548",
		}, {
			"label": "驿城区",
			"value": "53210",
		}]
	}, {
		"label": "信阳市",
		"value": "549",
		"children": [{
			"label": "潢川县",
			"value": "551",
		}, {
			"label": "淮滨县",
			"value": "552",
		}, {
			"label": "息县",
			"value": "553",
		}, {
			"label": "新县",
			"value": "554",
		}, {
			"label": "固始县",
			"value": "556",
		}, {
			"label": "罗山县",
			"value": "557",
		}, {
			"label": "光山县",
			"value": "558",
		}, {
			"label": "商城县",
			"value": "3119",
		}, {
			"label": "平桥区",
			"value": "53211",
		}, {
			"label": "浉河区",
			"value": "53212",
		}]
	}, {
		"label": "济源市",
		"value": "2780",
		"children": [{
			"label": "五龙口镇",
			"value": "53213",
		}, {
			"label": "下冶镇",
			"value": "53214",
		}, {
			"label": "轵城镇",
			"value": "53215",
		}, {
			"label": "王屋镇",
			"value": "53216",
		}, {
			"label": "思礼镇",
			"value": "53217",
		}, {
			"label": "邵原镇",
			"value": "53218",
		}, {
			"label": "坡头镇",
			"value": "53219",
		}, {
			"label": "梨林镇",
			"value": "53220",
		}, {
			"label": "克井镇",
			"value": "53221",
		}, {
			"label": "大峪镇",
			"value": "53222",
		}, {
			"label": "承留镇",
			"value": "53223",
		}, {
			"label": "城区",
			"value": "53224",
		}]
	}]
}, {
	"label": "辽宁",
	"value": "8",
	"children": [{
		"label": "沈阳市",
		"value": "560",
		"children": [{
			"label": "苏家屯区",
			"value": "567",
		}, {
			"label": "新民市",
			"value": "569",
		}, {
			"label": "法库县",
			"value": "570",
		}, {
			"label": "辽中县",
			"value": "571",
		}, {
			"label": "康平县",
			"value": "572",
		}, {
			"label": "皇姑区",
			"value": "53402",
		}, {
			"label": "铁西区",
			"value": "53403",
		}, {
			"label": "大东区",
			"value": "53404",
		}, {
			"label": "沈河区",
			"value": "53405",
		}, {
			"label": "东陵区",
			"value": "53406",
		}, {
			"label": "于洪区",
			"value": "53407",
		}, {
			"label": "和平区",
			"value": "53408",
		}, {
			"label": "浑南新区",
			"value": "53409",
		}, {
			"label": "沈北新区",
			"value": "53410",
		}]
	}, {
		"label": "大连市",
		"value": "573",
		"children": [{
			"label": "普兰店市",
			"value": "574",
		}, {
			"label": "瓦房店市",
			"value": "575",
		}, {
			"label": "庄河市",
			"value": "576",
		}, {
			"label": "长海县",
			"value": "577",
		}, {
			"label": "沙河口区",
			"value": "3261",
		}, {
			"label": "西岗区",
			"value": "3263",
		}, {
			"label": "中山区",
			"value": "4468",
		}, {
			"label": "甘井子区",
			"value": "5909",
		}, {
			"label": "高新园区",
			"value": "6561",
		}, {
			"label": "大连开发区",
			"value": "6627",
		}, {
			"label": "金州区",
			"value": "53411",
		}, {
			"label": "旅顺口区",
			"value": "53412",
		}]
	}, {
		"label": "鞍山市",
		"value": "579",
		"children": [{
			"label": "台安县",
			"value": "580",
		}, {
			"label": "海城市",
			"value": "581",
		}, {
			"label": "岫岩县",
			"value": "583",
		}, {
			"label": "铁东区",
			"value": "3264",
		}, {
			"label": "立山区",
			"value": "3266",
		}, {
			"label": "铁西区",
			"value": "53413",
		}, {
			"label": "千山区",
			"value": "53414",
		}]
	}, {
		"label": "抚顺市",
		"value": "584",
		"children": [{
			"label": "抚顺县",
			"value": "585",
		}, {
			"label": "新宾县",
			"value": "586",
		}, {
			"label": "清原县",
			"value": "587",
		}, {
			"label": "望花区",
			"value": "3268",
		}, {
			"label": "东洲区",
			"value": "3269",
		}, {
			"label": "新抚区",
			"value": "3270",
		}, {
			"label": "顺城区",
			"value": "3271",
		}]
	}, {
		"label": "本溪市",
		"value": "589",
		"children": [{
			"label": "桓仁县",
			"value": "591",
		}, {
			"label": "南芬区",
			"value": "3275",
		}, {
			"label": "本溪县",
			"value": "53415",
		}, {
			"label": "平山区",
			"value": "53416",
		}, {
			"label": "溪湖区",
			"value": "53417",
		}, {
			"label": "明山区",
			"value": "53418",
		}]
	}, {
		"label": "丹东市",
		"value": "593",
		"children": [{
			"label": "宽甸县",
			"value": "596",
		}, {
			"label": "元宝区",
			"value": "53419",
		}, {
			"label": "振兴区",
			"value": "53420",
		}, {
			"label": "振安区",
			"value": "53421",
		}, {
			"label": "东港市",
			"value": "53422",
		}, {
			"label": "凤城市",
			"value": "53423",
		}]
	}, {
		"label": "锦州市",
		"value": "598",
		"children": [{
			"label": "义县",
			"value": "599",
		}, {
			"label": "凌海市",
			"value": "600",
		}, {
			"label": "北镇市",
			"value": "601",
		}, {
			"label": "黑山县",
			"value": "602",
		}, {
			"label": "古塔区",
			"value": "4912",
		}, {
			"label": "凌河区",
			"value": "4913",
		}, {
			"label": "太和区",
			"value": "4914",
		}, {
			"label": "经济技术开发区",
			"value": "6790",
		}]
	}, {
		"label": "葫芦岛市",
		"value": "604",
		"children": [{
			"label": "绥中县",
			"value": "606",
		}, {
			"label": "建昌县",
			"value": "607",
		}, {
			"label": "南票区",
			"value": "608",
		}, {
			"label": "龙港区",
			"value": "3300",
		}, {
			"label": "连山区",
			"value": "53424",
		}, {
			"label": "兴城区",
			"value": "53425",
		}]
	}, {
		"label": "营口市",
		"value": "609",
		"children": [{
			"label": "大石桥市",
			"value": "610",
		}, {
			"label": "盖州市",
			"value": "611",
		}, {
			"label": "老边区",
			"value": "3282",
		}, {
			"label": "西市区",
			"value": "3283",
		}, {
			"label": "站前区",
			"value": "6628",
		}, {
			"label": "鲅鱼圈区",
			"value": "53426",
		}]
	}, {
		"label": "盘锦市",
		"value": "613",
		"children": [{
			"label": "盘山县",
			"value": "614",
		}, {
			"label": "大洼县",
			"value": "615",
		}, {
			"label": "兴隆台区",
			"value": "53427",
		}, {
			"label": "双台子区",
			"value": "53428",
		}]
	}, {
		"label": "阜新市",
		"value": "617",
		"children": [{
			"label": "阜新县",
			"value": "618",
		}, {
			"label": "彰武县",
			"value": "619",
		}, {
			"label": "清河门区",
			"value": "3286",
		}, {
			"label": "新邱区",
			"value": "3288",
		}, {
			"label": "海州区",
			"value": "53429",
		}, {
			"label": "太平区",
			"value": "53430",
		}, {
			"label": "细河区",
			"value": "53431",
		}]
	}, {
		"label": "辽阳市",
		"value": "621",
		"children": [{
			"label": "辽阳县",
			"value": "623",
		}, {
			"label": "太子河区",
			"value": "3290",
		}, {
			"label": "弓长岭区",
			"value": "3291",
		}, {
			"label": "宏伟区",
			"value": "3292",
		}, {
			"label": "白塔区",
			"value": "53432",
		}, {
			"label": "文圣区",
			"value": "53433",
		}, {
			"label": "灯塔市",
			"value": "53434",
		}]
	}, {
		"label": "朝阳市",
		"value": "632",
		"children": [{
			"label": "凌源市",
			"value": "633",
		}, {
			"label": "北票市",
			"value": "634",
		}, {
			"label": "喀喇沁左翼县",
			"value": "635",
		}, {
			"label": "朝阳县",
			"value": "636",
		}, {
			"label": "建平县",
			"value": "637",
		}, {
			"label": "龙城区",
			"value": "3299",
		}, {
			"label": "双塔区",
			"value": "53435",
		}]
	}, {
		"label": "铁岭市",
		"value": "6858",
		"children": [{
			"label": "银州区",
			"value": "6859",
		}, {
			"label": "清河区",
			"value": "6860",
		}, {
			"label": "开原市",
			"value": "6862",
		}, {
			"label": "铁岭县",
			"value": "6863",
		}, {
			"label": "西丰县",
			"value": "6864",
		}, {
			"label": "昌图县",
			"value": "6865",
		}, {
			"label": "调兵山市",
			"value": "53436",
		}]
	}]
}, {
	"label": "吉林",
	"value": "9",
	"children": [{
		"label": "长春市",
		"value": "639",
		"children": [{
			"label": "榆树市",
			"value": "640",
		}, {
			"label": "九台市",
			"value": "641",
		}, {
			"label": "农安县",
			"value": "642",
		}, {
			"label": "德惠市",
			"value": "3172",
		}, {
			"label": "双阳区",
			"value": "3306",
		}, {
			"label": "朝阳区",
			"value": "53441",
		}, {
			"label": "南关区",
			"value": "53442",
		}, {
			"label": "宽城区",
			"value": "53443",
		}, {
			"label": "二道区",
			"value": "53444",
		}, {
			"label": "绿园区",
			"value": "53445",
		}, {
			"label": "净月区",
			"value": "53446",
		}, {
			"label": "汽车产业开发区",
			"value": "53447",
		}, {
			"label": "高新技术开发区",
			"value": "53448",
		}, {
			"label": "经济技术开发区",
			"value": "53449",
		}]
	}, {
		"label": "吉林市",
		"value": "644",
		"children": [{
			"label": "舒兰市",
			"value": "645",
		}, {
			"label": "桦甸市",
			"value": "646",
		}, {
			"label": "蛟河市",
			"value": "647",
		}, {
			"label": "磐石市",
			"value": "648",
		}, {
			"label": "永吉县",
			"value": "649",
		}, {
			"label": "昌邑区",
			"value": "53437",
		}, {
			"label": "龙潭区",
			"value": "53438",
		}, {
			"label": "船营区",
			"value": "53439",
		}, {
			"label": "丰满区",
			"value": "53440",
		}]
	}, {
		"label": "四平市",
		"value": "651",
		"children": [{
			"label": "公主岭市",
			"value": "652",
		}, {
			"label": "双辽市",
			"value": "653",
		}, {
			"label": "梨树县",
			"value": "654",
		}, {
			"label": "伊通县",
			"value": "656",
		}, {
			"label": "铁东区",
			"value": "6641",
		}, {
			"label": "铁西区",
			"value": "6642",
		}]
	}, {
		"label": "通化市",
		"value": "657",
		"children": [{
			"label": "梅河口市",
			"value": "658",
		}, {
			"label": "集安市",
			"value": "659",
		}, {
			"label": "通化县",
			"value": "660",
		}, {
			"label": "辉南县",
			"value": "661",
		}, {
			"label": "柳河县",
			"value": "662",
		}, {
			"label": "二道江区",
			"value": "663",
		}, {
			"label": "东昌区",
			"value": "3311",
		}]
	}, {
		"label": "白山市",
		"value": "664",
		"children": [{
			"label": "临江市",
			"value": "665",
		}, {
			"label": "江源区",
			"value": "669",
		}, {
			"label": "靖宇县",
			"value": "671",
		}, {
			"label": "抚松县",
			"value": "672",
		}, {
			"label": "长白县",
			"value": "673",
		}, {
			"label": "浑江区",
			"value": "53450",
		}]
	}, {
		"label": "松原市",
		"value": "674",
		"children": [{
			"label": "乾安县",
			"value": "675",
		}, {
			"label": "长岭县",
			"value": "676",
		}, {
			"label": "扶余县",
			"value": "677",
		}, {
			"label": "宁江区",
			"value": "53451",
		}, {
			"label": "前郭县",
			"value": "53452",
		}]
	}, {
		"label": "白城市",
		"value": "681",
		"children": [{
			"label": "大安市",
			"value": "682",
		}, {
			"label": "洮南市",
			"value": "683",
		}, {
			"label": "通榆县",
			"value": "684",
		}, {
			"label": "镇赉县",
			"value": "685",
		}, {
			"label": "洮北区",
			"value": "686",
		}]
	}, {
		"label": "延边州",
		"value": "687",
		"children": [{
			"label": "图们市",
			"value": "3312",
		}, {
			"label": "敦化市",
			"value": "3313",
		}, {
			"label": "珲春市",
			"value": "3314",
		}, {
			"label": "龙井市",
			"value": "3315",
		}, {
			"label": "和龙市",
			"value": "3316",
		}, {
			"label": "汪清县",
			"value": "3317",
		}, {
			"label": "安图县",
			"value": "3318",
		}, {
			"label": "延吉市",
			"value": "53453",
		}]
	}, {
		"label": "辽源市",
		"value": "2992",
		"children": [{
			"label": "龙山区",
			"value": "2993",
		}, {
			"label": "西安区",
			"value": "2994",
		}, {
			"label": "东丰县",
			"value": "2995",
		}, {
			"label": "东辽县",
			"value": "2996",
		}]
	}]
}, {
	"label": "黑龙江",
	"value": "10",
	"children": [{
		"label": "哈尔滨市",
		"value": "698",
		"children": [{
			"label": "阿城区",
			"value": "699",
		}, {
			"label": "尚志市",
			"value": "700",
		}, {
			"label": "双城市",
			"value": "701",
		}, {
			"label": "五常市",
			"value": "702",
		}, {
			"label": "方正县",
			"value": "704",
		}, {
			"label": "宾县",
			"value": "705",
		}, {
			"label": "依兰县",
			"value": "706",
		}, {
			"label": "巴彦县",
			"value": "707",
		}, {
			"label": "通河县",
			"value": "708",
		}, {
			"label": "木兰县",
			"value": "709",
		}, {
			"label": "延寿县",
			"value": "710",
		}, {
			"label": "呼兰区",
			"value": "53454",
		}, {
			"label": "松北区",
			"value": "53455",
		}, {
			"label": "道里区",
			"value": "53456",
		}, {
			"label": "南岗区",
			"value": "53457",
		}, {
			"label": "道外区",
			"value": "53458",
		}, {
			"label": "香坊区",
			"value": "53459",
		}, {
			"label": "平房区",
			"value": "53460",
		}]
	}, {
		"label": "齐齐哈尔市",
		"value": "712",
		"children": [{
			"label": "梅里斯区",
			"value": "713",
		}, {
			"label": "昂昂溪区",
			"value": "714",
		}, {
			"label": "富拉尔基区",
			"value": "715",
		}, {
			"label": "碾子山区",
			"value": "716",
		}, {
			"label": "讷河市",
			"value": "717",
		}, {
			"label": "富裕县",
			"value": "718",
		}, {
			"label": "拜泉县",
			"value": "719",
		}, {
			"label": "甘南县",
			"value": "720",
		}, {
			"label": "依安县",
			"value": "721",
		}, {
			"label": "克山县",
			"value": "722",
		}, {
			"label": "龙江县",
			"value": "723",
		}, {
			"label": "克东县",
			"value": "724",
		}, {
			"label": "泰来县",
			"value": "725",
		}, {
			"label": "建华区",
			"value": "53461",
		}, {
			"label": "龙沙区",
			"value": "53462",
		}, {
			"label": "铁锋区",
			"value": "53463",
		}]
	}, {
		"label": "鹤岗市",
		"value": "727",
		"children": [{
			"label": "萝北县",
			"value": "728",
		}, {
			"label": "绥滨县",
			"value": "729",
		}, {
			"label": "兴山区",
			"value": "3334",
		}, {
			"label": "向阳区",
			"value": "3335",
		}, {
			"label": "工农区",
			"value": "3336",
		}, {
			"label": "南山区",
			"value": "3337",
		}, {
			"label": "兴安区",
			"value": "3338",
		}, {
			"label": "东山区",
			"value": "3339",
		}]
	}, {
		"label": "双鸭山市",
		"value": "731",
		"children": [{
			"label": "集贤县",
			"value": "733",
		}, {
			"label": "宝清县",
			"value": "734",
		}, {
			"label": "友谊县",
			"value": "735",
		}, {
			"label": "饶河县",
			"value": "736",
		}, {
			"label": "尖山区",
			"value": "3340",
		}, {
			"label": "岭东区",
			"value": "3341",
		}, {
			"label": "四方台区",
			"value": "3342",
		}, {
			"label": "宝山区",
			"value": "3343",
		}]
	}, {
		"label": "鸡西市",
		"value": "737",
		"children": [{
			"label": "密山市",
			"value": "739",
		}, {
			"label": "虎林市",
			"value": "740",
		}, {
			"label": "鸡东县",
			"value": "741",
		}, {
			"label": "恒山区",
			"value": "3329",
		}, {
			"label": "滴道区",
			"value": "3330",
		}, {
			"label": "梨树区",
			"value": "3331",
		}, {
			"label": "城子河区",
			"value": "3332",
		}, {
			"label": "麻山区",
			"value": "3333",
		}, {
			"label": "鸡冠区",
			"value": "53464",
		}]
	}, {
		"label": "大庆市",
		"value": "742",
		"children": [{
			"label": "萨尔图区",
			"value": "744",
		}, {
			"label": "龙凤区",
			"value": "745",
		}, {
			"label": "让胡路区",
			"value": "746",
		}, {
			"label": "红岗区",
			"value": "747",
		}, {
			"label": "大同区",
			"value": "748",
		}, {
			"label": "林甸县",
			"value": "749",
		}, {
			"label": "肇州县",
			"value": "750",
		}, {
			"label": "肇源县",
			"value": "751",
		}, {
			"label": "杜尔伯特县",
			"value": "752",
		}]
	}, {
		"label": "伊春市",
		"value": "753",
		"children": [{
			"label": "铁力市",
			"value": "754",
		}, {
			"label": "嘉荫县",
			"value": "755",
		}, {
			"label": "伊春区",
			"value": "3344",
		}, {
			"label": "南岔区",
			"value": "3345",
		}, {
			"label": "友好区",
			"value": "3346",
		}, {
			"label": "西林区",
			"value": "3347",
		}, {
			"label": "翠峦区",
			"value": "3348",
		}, {
			"label": "新青区",
			"value": "3349",
		}, {
			"label": "美溪区",
			"value": "3350",
		}, {
			"label": "金山屯区",
			"value": "3351",
		}, {
			"label": "五营区",
			"value": "3352",
		}, {
			"label": "乌马河区",
			"value": "3353",
		}, {
			"label": "汤旺河区",
			"value": "3354",
		}, {
			"label": "带岭区",
			"value": "3355",
		}, {
			"label": "乌伊岭区",
			"value": "3356",
		}, {
			"label": "红星区",
			"value": "3357",
		}, {
			"label": "上甘岭区",
			"value": "3358",
		}]
	}, {
		"label": "牡丹江市",
		"value": "757",
		"children": [{
			"label": "海林市",
			"value": "758",
		}, {
			"label": "宁安市",
			"value": "760",
		}, {
			"label": "穆棱市",
			"value": "761",
		}, {
			"label": "林口县",
			"value": "762",
		}, {
			"label": "东宁县",
			"value": "763",
		}, {
			"label": "爱民区",
			"value": "3367",
		}, {
			"label": "东安区",
			"value": "3368",
		}, {
			"label": "阳明区",
			"value": "3369",
		}, {
			"label": "西安区",
			"value": "3370",
		}, {
			"label": "绥芬河市",
			"value": "4148",
		}]
	}, {
		"label": "佳木斯市",
		"value": "765",
		"children": [{
			"label": "同江市",
			"value": "766",
		}, {
			"label": "富锦市",
			"value": "767",
		}, {
			"label": "桦川县",
			"value": "768",
		}, {
			"label": "抚远县",
			"value": "769",
		}, {
			"label": "桦南县",
			"value": "770",
		}, {
			"label": "汤原县",
			"value": "771",
		}, {
			"label": "前进区",
			"value": "53465",
		}, {
			"label": "向阳区",
			"value": "53466",
		}, {
			"label": "东风区",
			"value": "53467",
		}, {
			"label": "郊区",
			"value": "53468",
		}]
	}, {
		"label": "七台河市",
		"value": "773",
		"children": [{
			"label": "勃利县",
			"value": "774",
		}, {
			"label": "桃山区",
			"value": "3364",
		}, {
			"label": "新兴区",
			"value": "3365",
		}, {
			"label": "茄子河区",
			"value": "3366",
		}, {
			"label": "金沙新区",
			"value": "53469",
		}]
	}, {
		"label": "黑河市",
		"value": "776",
		"children": [{
			"label": "北安市",
			"value": "777",
		}, {
			"label": "五大连池市",
			"value": "778",
		}, {
			"label": "逊克县",
			"value": "779",
		}, {
			"label": "孙吴县",
			"value": "780",
		}, {
			"label": "嫩江县",
			"value": "3096",
		}, {
			"label": "爱辉区",
			"value": "3371",
		}]
	}, {
		"label": "绥化市",
		"value": "782",
		"children": [{
			"label": "安达市",
			"value": "784",
		}, {
			"label": "肇东市",
			"value": "785",
		}, {
			"label": "海伦市",
			"value": "786",
		}, {
			"label": "绥棱县",
			"value": "787",
		}, {
			"label": "兰西县",
			"value": "788",
		}, {
			"label": "明水县",
			"value": "789",
		}, {
			"label": "青冈县",
			"value": "790",
		}, {
			"label": "庆安县",
			"value": "791",
		}, {
			"label": "望奎县",
			"value": "792",
		}, {
			"label": "北林区",
			"value": "6712",
		}]
	}, {
		"label": "大兴安岭地区",
		"value": "793",
		"children": [{
			"label": "呼玛县",
			"value": "794",
		}, {
			"label": "塔河县",
			"value": "795",
		}, {
			"label": "漠河县",
			"value": "796",
		}, {
			"label": "加格达奇区",
			"value": "4114",
		}, {
			"label": "松岭区",
			"value": "4115",
		}, {
			"label": "呼中区",
			"value": "4116",
		}, {
			"label": "新林区",
			"value": "53470",
		}]
	}]
}, {
	"label": "内蒙古",
	"value": "11",
	"children": [{
		"label": "呼和浩特市",
		"value": "799",
		"children": [{
			"label": "土默特左旗",
			"value": "801",
		}, {
			"label": "和林格尔县",
			"value": "802",
		}, {
			"label": "武川县",
			"value": "803",
		}, {
			"label": "托克托县",
			"value": "804",
		}, {
			"label": "清水河县",
			"value": "3133",
		}, {
			"label": "玉泉区",
			"value": "3240",
		}, {
			"label": "赛罕区",
			"value": "3241",
		}, {
			"label": "回民区",
			"value": "53471",
		}, {
			"label": "新城区",
			"value": "53472",
		}]
	}, {
		"label": "包头市",
		"value": "805",
		"children": [{
			"label": "固阳县",
			"value": "807",
		}, {
			"label": "土默特右旗",
			"value": "808",
		}, {
			"label": "达茂联合旗",
			"value": "809",
		}, {
			"label": "石拐区",
			"value": "3245",
		}, {
			"label": "白云矿区",
			"value": "3246",
		}, {
			"label": "东河区",
			"value": "53473",
		}, {
			"label": "九原区",
			"value": "53474",
		}, {
			"label": "青山区",
			"value": "53475",
		}, {
			"label": "昆都仑区",
			"value": "53476",
		}]
	}, {
		"label": "乌海市",
		"value": "810",
		"children": [{
			"label": "海勃湾区",
			"value": "811",
		}, {
			"label": "海南区",
			"value": "3248",
		}, {
			"label": "乌达区",
			"value": "3249",
		}]
	}, {
		"label": "赤峰市",
		"value": "812",
		"children": [{
			"label": "宁城县",
			"value": "814",
		}, {
			"label": "敖汉旗",
			"value": "815",
		}, {
			"label": "喀喇沁旗",
			"value": "816",
		}, {
			"label": "翁牛特旗",
			"value": "817",
		}, {
			"label": "巴林右旗",
			"value": "818",
		}, {
			"label": "林西县",
			"value": "819",
		}, {
			"label": "克什克腾旗",
			"value": "820",
		}, {
			"label": "巴林左旗",
			"value": "821",
		}, {
			"label": "阿鲁科尔沁旗",
			"value": "822",
		}, {
			"label": "元宝山区",
			"value": "3199",
		}, {
			"label": "松山区",
			"value": "3251",
		}, {
			"label": "红山区",
			"value": "53477",
		}]
	}, {
		"label": "乌兰察布市",
		"value": "823",
		"children": [{
			"label": "集宁区",
			"value": "824",
		}, {
			"label": "丰镇市",
			"value": "825",
		}, {
			"label": "兴和县",
			"value": "826",
		}, {
			"label": "卓资县",
			"value": "827",
		}, {
			"label": "商都县",
			"value": "828",
		}, {
			"label": "凉城县",
			"value": "829",
		}, {
			"label": "化德县",
			"value": "830",
		}, {
			"label": "察哈尔右翼前旗",
			"value": "831",
		}, {
			"label": "察哈尔右翼中旗",
			"value": "832",
		}, {
			"label": "察哈尔右翼后旗",
			"value": "833",
		}, {
			"label": "四子王旗",
			"value": "834",
		}]
	}, {
		"label": "锡林郭勒盟",
		"value": "835",
		"children": [{
			"label": "锡林浩特市",
			"value": "836",
		}, {
			"label": "二连浩特市",
			"value": "837",
		}, {
			"label": "多伦县",
			"value": "838",
		}, {
			"label": "阿巴嘎旗",
			"value": "839",
		}, {
			"label": "西乌珠穆沁旗",
			"value": "840",
		}, {
			"label": "东乌珠穆沁旗",
			"value": "841",
		}, {
			"label": "苏尼特右旗",
			"value": "842",
		}, {
			"label": "苏尼特左旗",
			"value": "843",
		}, {
			"label": "太仆寺旗",
			"value": "844",
		}, {
			"label": "正镶白旗",
			"value": "845",
		}, {
			"label": "正蓝旗",
			"value": "846",
		}, {
			"label": "镶黄旗",
			"value": "847",
		}]
	}, {
		"label": "呼伦贝尔市",
		"value": "848",
		"children": [{
			"label": "海拉尔区",
			"value": "849",
		}, {
			"label": "满洲里市",
			"value": "850",
		}, {
			"label": "牙克石市",
			"value": "851",
		}, {
			"label": "扎兰屯市",
			"value": "852",
		}, {
			"label": "根河市",
			"value": "853",
		}, {
			"label": "额尔古纳市",
			"value": "854",
		}, {
			"label": "陈巴尔虎旗",
			"value": "855",
		}, {
			"label": "阿荣旗",
			"value": "856",
		}, {
			"label": "新巴尔虎左旗",
			"value": "857",
		}, {
			"label": "新巴尔虎右旗",
			"value": "858",
		}, {
			"label": "鄂伦春旗",
			"value": "859",
		}, {
			"label": "莫力达瓦旗",
			"value": "860",
		}, {
			"label": "鄂温克族旗",
			"value": "861",
		}]
	}, {
		"label": "鄂尔多斯市",
		"value": "870",
		"children": [{
			"label": "东胜区",
			"value": "871",
		}, {
			"label": "准格尔旗",
			"value": "872",
		}, {
			"label": "伊金霍洛旗",
			"value": "874",
		}, {
			"label": "乌审旗",
			"value": "875",
		}, {
			"label": "杭锦旗",
			"value": "876",
		}, {
			"label": "鄂托克旗",
			"value": "877",
		}, {
			"label": "鄂托克前旗",
			"value": "878",
		}, {
			"label": "达拉特旗",
			"value": "879",
		}, {
			"label": "康巴什新区",
			"value": "53478",
		}]
	}, {
		"label": "巴彦淖尔市",
		"value": "880",
		"children": [{
			"label": "临河区",
			"value": "881",
		}, {
			"label": "五原县",
			"value": "882",
		}, {
			"label": "磴口县",
			"value": "883",
		}, {
			"label": "杭锦后旗",
			"value": "884",
		}, {
			"label": "乌拉特中旗",
			"value": "885",
		}, {
			"label": "乌拉特后旗",
			"value": "888",
		}, {
			"label": "乌拉特前旗",
			"value": "890",
		}]
	}, {
		"label": "阿拉善盟",
		"value": "891",
		"children": [{
			"label": "阿拉善右旗",
			"value": "892",
		}, {
			"label": "阿拉善左旗",
			"value": "893",
		}, {
			"label": "额济纳旗",
			"value": "894",
		}]
	}, {
		"label": "兴安盟",
		"value": "895",
		"children": [{
			"label": "乌兰浩特市",
			"value": "896",
		}, {
			"label": "阿尔山市",
			"value": "897",
		}, {
			"label": "突泉县",
			"value": "898",
		}, {
			"label": "扎赍特旗",
			"value": "899",
		}, {
			"label": "科尔沁右翼前旗",
			"value": "900",
		}, {
			"label": "科尔沁右翼中旗",
			"value": "901",
		}]
	}, {
		"label": "通辽市",
		"value": "902",
		"children": [{
			"label": "霍林郭勒市",
			"value": "3142",
		}, {
			"label": "开鲁县",
			"value": "3252",
		}, {
			"label": "库伦旗",
			"value": "3253",
		}, {
			"label": "奈曼旗",
			"value": "3254",
		}, {
			"label": "扎鲁特旗",
			"value": "3255",
		}, {
			"label": "科尔沁左翼中旗",
			"value": "3256",
		}, {
			"label": "科尔沁左翼后旗",
			"value": "3258",
		}, {
			"label": "科尔沁区",
			"value": "53479",
		}]
	}]
}, {
	"label": "江苏",
	"value": "12",
	"children": [{
		"label": "南京市",
		"value": "904",
		"children": [{
			"label": "江宁区",
			"value": "905",
			"children": [{
				"label": "丹阳镇",
				"value": "52411",
				"children": []
			}, {
				"label": "谷里镇",
				"value": "52412",
				"children": []
			}, {
				"label": "横溪镇",
				"value": "52413",
				"children": []
			}, {
				"label": "江宁镇",
				"value": "52414",
				"children": []
			}, {
				"label": "陆郎镇",
				"value": "52415",
				"children": []
			}, {
				"label": "秣陵镇",
				"value": "52416",
				"children": []
			}, {
				"label": "禄口镇",
				"value": "52417",
				"children": []
			}, {
				"label": "陶吴镇",
				"value": "52418",
				"children": []
			}, {
				"label": "铜山镇",
				"value": "52419",
				"children": []
			}, {
				"label": "朱门镇",
				"value": "52420",
				"children": []
			}, {
				"label": "东善桥镇",
				"value": "52421",
				"children": []
			}, {
				"label": "淳化镇",
				"value": "52422",
				"children": []
			}, {
				"label": "湖熟镇",
				"value": "52423",
				"children": []
			}, {
				"label": "汤山镇",
				"value": "52424",
				"children": []
			}, {
				"label": "城区",
				"value": "52425",
				"children": []
			}]
		}, {
			"label": "高淳区",
			"value": "907",
			"children": [{
				"label": "淳溪镇",
				"value": "52426",
				"children": []
			}, {
				"label": "东坝镇",
				"value": "52427",
				"children": []
			}, {
				"label": "古柏镇",
				"value": "52428",
				"children": []
			}, {
				"label": "固城镇",
				"value": "52429",
				"children": []
			}, {
				"label": "漆桥镇",
				"value": "52430",
				"children": []
			}, {
				"label": "桠溪镇",
				"value": "52431",
				"children": []
			}, {
				"label": "阳江镇",
				"value": "52432",
				"children": []
			}, {
				"label": "砖墙镇",
				"value": "52433",
				"children": []
			}]
		}, {
			"label": "六合区",
			"value": "908",
			"children": [{
				"label": "竹镇",
				"value": "52439",
				"children": []
			}, {
				"label": "东沟镇",
				"value": "52444",
				"children": []
			}, {
				"label": "瓜埠镇",
				"value": "52446",
				"children": []
			}, {
				"label": "龙袍镇",
				"value": "52447",
				"children": []
			}, {
				"label": "马鞍镇",
				"value": "52448",
				"children": []
			}, {
				"label": "马集镇",
				"value": "52449",
				"children": []
			}, {
				"label": "心篁镇",
				"value": "52452",
				"children": []
			}, {
				"label": "玉带镇",
				"value": "52454",
				"children": []
			}, {
				"label": "八百镇",
				"value": "52456",
				"children": []
			}, {
				"label": "新集镇",
				"value": "52458",
				"children": []
			}, {
				"label": "梵集街镇",
				"value": "52463",
				"children": []
			}, {
				"label": "化工园区",
				"value": "52464",
				"children": []
			}, {
				"label": "沿江工业开发区",
				"value": "52465",
				"children": []
			}, {
				"label": "城区",
				"value": "52466",
				"children": []
			}, {
				"label": "冶山镇",
				"value": "52467",
				"children": []
			}, {
				"label": "横梁镇",
				"value": "52468",
				"children": []
			}, {
				"label": "八百桥镇",
				"value": "52469",
				"children": []
			}]
		}, {
			"label": "溧水区",
			"value": "3024",
			"children": [{
				"label": "白马镇",
				"value": "52474",
				"children": []
			}, {
				"label": "东屏镇",
				"value": "52477",
				"children": []
			}, {
				"label": "和凤镇",
				"value": "52480",
				"children": []
			}, {
				"label": "洪蓝镇",
				"value": "52482",
				"children": []
			}, {
				"label": "晶桥镇",
				"value": "52483",
				"children": []
			}, {
				"label": "永阳镇",
				"value": "52503",
				"children": []
			}, {
				"label": "柘塘镇",
				"value": "52504",
				"children": []
			}, {
				"label": "石湫镇",
				"value": "52505",
				"children": []
			}]
		}, {
			"label": "玄武区",
			"value": "3373",
		}, {
			"label": "秦淮区",
			"value": "3375",
		}, {
			"label": "建邺区",
			"value": "3376",
			"children": [{
				"label": "江心洲",
				"value": "52519",
				"children": []
			}, {
				"label": "城区",
				"value": "52520",
				"children": []
			}]
		}, {
			"label": "鼓楼区",
			"value": "3377",
		}, {
			"label": "栖霞区",
			"value": "3378",
			"children": [{
				"label": "龙潭镇",
				"value": "52526",
				"children": []
			}, {
				"label": "城区",
				"value": "52527",
				"children": []
			}, {
				"label": "八卦洲",
				"value": "52528",
				"children": []
			}]
		}, {
			"label": "雨花台区",
			"value": "3379",
		}, {
			"label": "浦口区",
			"value": "52410",
			"children": [{
				"label": "城区",
				"value": "52534",
				"children": []
			}, {
				"label": "桥林镇",
				"value": "52537",
				"children": []
			}, {
				"label": "汤泉镇",
				"value": "52539",
				"children": []
			}, {
				"label": "珠江镇",
				"value": "52541",
				"children": []
			}, {
				"label": "乌江镇",
				"value": "52544",
				"children": []
			}, {
				"label": "永宁镇",
				"value": "52546",
				"children": []
			}, {
				"label": "星甸镇",
				"value": "52547",
				"children": []
			}, {
				"label": "石桥镇",
				"value": "52550",
				"children": []
			}]
		}]
	}, {
		"label": "徐州市",
		"value": "911",
		"children": [{
			"label": "铜山区",
			"value": "914",
			"children": [{
				"label": "城区",
				"value": "52602",
				"children": []
			}, {
				"label": "伊庄镇",
				"value": "52604",
				"children": []
			}, {
				"label": "徐庄镇",
				"value": "52605",
				"children": []
			}, {
				"label": "棠张镇",
				"value": "52607",
				"children": []
			}, {
				"label": "大许镇",
				"value": "52609",
				"children": []
			}, {
				"label": "柳新镇",
				"value": "52610",
				"children": []
			}, {
				"label": "汉王镇",
				"value": "52611",
				"children": []
			}, {
				"label": "铜山镇",
				"value": "52612",
				"children": []
			}, {
				"label": "柳泉镇",
				"value": "52613",
				"children": []
			}, {
				"label": "何桥镇",
				"value": "52614",
				"children": []
			}, {
				"label": "马坡镇",
				"value": "52615",
				"children": []
			}, {
				"label": "大彭镇",
				"value": "52616",
				"children": []
			}, {
				"label": "郑集镇",
				"value": "52617",
				"children": []
			}, {
				"label": "张集镇",
				"value": "52618",
				"children": []
			}, {
				"label": "刘集镇",
				"value": "52619",
				"children": []
			}, {
				"label": "黄集镇",
				"value": "52620",
				"children": []
			}, {
				"label": "单集镇",
				"value": "52621",
				"children": []
			}, {
				"label": "利国镇",
				"value": "52622",
				"children": []
			}, {
				"label": "茅村镇",
				"value": "52623",
				"children": []
			}, {
				"label": "房村镇",
				"value": "52624",
				"children": []
			}, {
				"label": "三堡镇",
				"value": "52625",
				"children": []
			}]
		}, {
			"label": "睢宁县",
			"value": "915",
			"children": [{
				"label": "高作镇",
				"value": "52647",
				"children": []
			}, {
				"label": "桃园镇",
				"value": "52648",
				"children": []
			}, {
				"label": "岚山镇",
				"value": "52649",
				"children": []
			}, {
				"label": "官山镇",
				"value": "52650",
				"children": []
			}, {
				"label": "古邳镇",
				"value": "52651",
				"children": []
			}, {
				"label": "姚集镇",
				"value": "52652",
				"children": []
			}, {
				"label": "魏集镇",
				"value": "52653",
				"children": []
			}, {
				"label": "王集镇",
				"value": "52654",
				"children": []
			}, {
				"label": "沙集镇",
				"value": "52655",
				"children": []
			}, {
				"label": "邱集镇",
				"value": "52656",
				"children": []
			}, {
				"label": "梁集镇",
				"value": "52657",
				"children": []
			}, {
				"label": "李集镇",
				"value": "52658",
				"children": []
			}, {
				"label": "双沟镇",
				"value": "52659",
				"children": []
			}, {
				"label": "睢城镇",
				"value": "52660",
				"children": []
			}, {
				"label": "凌城镇",
				"value": "52661",
				"children": []
			}, {
				"label": "庆安镇",
				"value": "52662",
				"children": []
			}, {
				"label": "城区",
				"value": "52663",
				"children": []
			}]
		}, {
			"label": "沛县",
			"value": "916",
			"children": [{
				"label": "张庄镇",
				"value": "52664",
				"children": []
			}, {
				"label": "朱寨镇",
				"value": "52665",
				"children": []
			}, {
				"label": "张寨镇",
				"value": "52666",
				"children": []
			}, {
				"label": "胡寨镇",
				"value": "52667",
				"children": []
			}, {
				"label": "杨屯镇",
				"value": "52668",
				"children": []
			}, {
				"label": "大屯镇",
				"value": "52669",
				"children": []
			}, {
				"label": "栖山镇",
				"value": "52670",
				"children": []
			}, {
				"label": "魏庙镇",
				"value": "52671",
				"children": []
			}, {
				"label": "鹿楼镇",
				"value": "52672",
				"children": []
			}, {
				"label": "河口镇",
				"value": "52673",
				"children": []
			}, {
				"label": "安国镇",
				"value": "52674",
				"children": []
			}, {
				"label": "龙固镇",
				"value": "52675",
				"children": []
			}, {
				"label": "五段镇",
				"value": "52676",
				"children": []
			}, {
				"label": "沛城镇",
				"value": "52677",
				"children": []
			}, {
				"label": "敬安镇",
				"value": "52678",
				"children": []
			}, {
				"label": "城区",
				"value": "52679",
				"children": []
			}]
		}, {
			"label": "丰县",
			"value": "917",
			"children": [{
				"label": "大沙河镇",
				"value": "52680",
				"children": []
			}, {
				"label": "赵庄镇",
				"value": "52681",
				"children": []
			}, {
				"label": "师寨镇",
				"value": "52682",
				"children": []
			}, {
				"label": "梁寨镇",
				"value": "52683",
				"children": []
			}, {
				"label": "首羡镇",
				"value": "52684",
				"children": []
			}, {
				"label": "华山镇",
				"value": "52685",
				"children": []
			}, {
				"label": "孙楼镇",
				"value": "52686",
				"children": []
			}, {
				"label": "宋楼镇",
				"value": "52687",
				"children": []
			}, {
				"label": "范楼镇",
				"value": "52688",
				"children": []
			}, {
				"label": "欢口镇",
				"value": "52689",
				"children": []
			}, {
				"label": "顺河镇",
				"value": "52690",
				"children": []
			}, {
				"label": "王沟镇",
				"value": "52691",
				"children": []
			}, {
				"label": "常店镇",
				"value": "52692",
				"children": []
			}, {
				"label": "凤城镇",
				"value": "52693",
				"children": []
			}, {
				"label": "城区",
				"value": "52694",
				"children": []
			}]
		}, {
			"label": "贾汪区",
			"value": "3388",
			"children": [{
				"label": "城区",
				"value": "52695",
				"children": []
			}, {
				"label": "青山泉镇",
				"value": "52696",
				"children": []
			}, {
				"label": "紫庄镇",
				"value": "52697",
				"children": []
			}, {
				"label": "江庄镇",
				"value": "52698",
				"children": []
			}, {
				"label": "大吴镇",
				"value": "52699",
				"children": []
			}, {
				"label": "贾汪镇",
				"value": "52700",
				"children": []
			}, {
				"label": "汴塘镇",
				"value": "52701",
				"children": []
			}, {
				"label": "塔山镇",
				"value": "52702",
				"children": []
			}]
		}, {
			"label": "金山桥开发区",
			"value": "4223",
		}, {
			"label": "铜山经济技术开发区",
			"value": "4224",
		}, {
			"label": "八段工业园区",
			"value": "4228",
		}, {
			"label": "鼓楼区",
			"value": "52580",
			"children": [{
				"label": "城区",
				"value": "52703",
				"children": []
			}, {
				"label": "大黄山镇",
				"value": "52704",
				"children": []
			}, {
				"label": "大庙镇",
				"value": "52705",
				"children": []
			}]
		}, {
			"label": "邳州市",
			"value": "52582",
			"children": [{
				"label": "宿羊山镇",
				"value": "52706",
				"children": []
			}, {
				"label": "车辐山镇",
				"value": "52707",
				"children": []
			}, {
				"label": "燕子埠镇",
				"value": "52708",
				"children": []
			}, {
				"label": "八义集镇",
				"value": "52709",
				"children": []
			}, {
				"label": "邹庄镇",
				"value": "52710",
				"children": []
			}, {
				"label": "碾庄镇",
				"value": "52711",
				"children": []
			}, {
				"label": "戴庄镇",
				"value": "52712",
				"children": []
			}, {
				"label": "戴圩镇",
				"value": "52713",
				"children": []
			}, {
				"label": "港上镇",
				"value": "52714",
				"children": []
			}, {
				"label": "议堂镇",
				"value": "52715",
				"children": []
			}, {
				"label": "土山镇",
				"value": "52716",
				"children": []
			}, {
				"label": "八路镇",
				"value": "52717",
				"children": []
			}, {
				"label": "邢楼镇",
				"value": "52718",
				"children": []
			}, {
				"label": "陈楼镇",
				"value": "52719",
				"children": []
			}, {
				"label": "四户镇",
				"value": "52720",
				"children": []
			}, {
				"label": "官湖镇",
				"value": "52721",
				"children": []
			}, {
				"label": "运河镇",
				"value": "52722",
				"children": []
			}, {
				"label": "新河镇",
				"value": "52723",
				"children": []
			}, {
				"label": "岔河镇",
				"value": "52724",
				"children": []
			}, {
				"label": "铁富镇",
				"value": "52725",
				"children": []
			}, {
				"label": "赵墩镇",
				"value": "52726",
				"children": []
			}, {
				"label": "占城镇",
				"value": "52727",
				"children": []
			}, {
				"label": "邳城镇",
				"value": "52728",
				"children": []
			}, {
				"label": "炮车镇",
				"value": "52729",
				"children": []
			}]
		}, {
			"label": "泉山区",
			"value": "52585",
		}, {
			"label": "新沂市",
			"value": "52586",
			"children": [{
				"label": "双塘镇",
				"value": "52730",
				"children": []
			}, {
				"label": "新安镇",
				"value": "52731",
				"children": []
			}, {
				"label": "北沟镇",
				"value": "52732",
				"children": []
			}, {
				"label": "瓦窑镇",
				"value": "52733",
				"children": []
			}, {
				"label": "高流镇",
				"value": "52734",
				"children": []
			}, {
				"label": "唐店镇",
				"value": "52735",
				"children": []
			}, {
				"label": "合沟镇",
				"value": "52736",
				"children": []
			}, {
				"label": "港头镇",
				"value": "52737",
				"children": []
			}, {
				"label": "时集镇",
				"value": "52738",
				"children": []
			}, {
				"label": "棋盘镇",
				"value": "52739",
				"children": []
			}, {
				"label": "窑湾镇",
				"value": "52740",
				"children": []
			}, {
				"label": "阿湖镇",
				"value": "52741",
				"children": []
			}, {
				"label": "邵店镇",
				"value": "52742",
				"children": []
			}, {
				"label": "草桥镇",
				"value": "52743",
				"children": []
			}, {
				"label": "新店镇",
				"value": "52744",
				"children": []
			}, {
				"label": "马陵山镇",
				"value": "52745",
				"children": []
			}]
		}, {
			"label": "云龙区",
			"value": "52587",
		}]
	}, {
		"label": "连云港市",
		"value": "919",
		"children": [{
			"label": "赣榆县",
			"value": "920",
			"children": [{
				"label": "城区",
				"value": "52747",
				"children": []
			}, {
				"label": "宋庄镇",
				"value": "52748",
				"children": []
			}, {
				"label": "厉庄镇",
				"value": "52749",
				"children": []
			}, {
				"label": "班庄镇",
				"value": "52750",
				"children": []
			}, {
				"label": "罗阳镇",
				"value": "52751",
				"children": []
			}, {
				"label": "城西镇",
				"value": "52752",
				"children": []
			}, {
				"label": "柘汪镇",
				"value": "52753",
				"children": []
			}, {
				"label": "海头镇",
				"value": "52754",
				"children": []
			}, {
				"label": "城头镇",
				"value": "52755",
				"children": []
			}, {
				"label": "墩尚镇",
				"value": "52756",
				"children": []
			}, {
				"label": "塔山镇",
				"value": "52757",
				"children": []
			}, {
				"label": "金山镇",
				"value": "52758",
				"children": []
			}, {
				"label": "石桥镇",
				"value": "52759",
				"children": []
			}, {
				"label": "赣马镇",
				"value": "52760",
				"children": []
			}, {
				"label": "黑林镇",
				"value": "52761",
				"children": []
			}, {
				"label": "青口镇",
				"value": "52762",
				"children": []
			}, {
				"label": "沙河镇",
				"value": "52763",
				"children": []
			}, {
				"label": "门河镇",
				"value": "52764",
				"children": []
			}, {
				"label": "欢墩镇",
				"value": "52765",
				"children": []
			}]
		}, {
			"label": "灌云县",
			"value": "921",
			"children": [{
				"label": "城区",
				"value": "52766",
				"children": []
			}, {
				"label": "燕尾港镇",
				"value": "52767",
				"children": []
			}, {
				"label": "同兴镇",
				"value": "52768",
				"children": []
			}, {
				"label": "伊山镇",
				"value": "52769",
				"children": []
			}, {
				"label": "龙苴镇",
				"value": "52770",
				"children": []
			}, {
				"label": "杨集镇",
				"value": "52771",
				"children": []
			}, {
				"label": "圩丰镇",
				"value": "52772",
				"children": []
			}, {
				"label": "四队镇",
				"value": "52773",
				"children": []
			}, {
				"label": "东王集乡",
				"value": "52774",
				"children": []
			}, {
				"label": "侍庄乡",
				"value": "52775",
				"children": []
			}, {
				"label": "小伊乡",
				"value": "52776",
				"children": []
			}, {
				"label": "白蚬乡",
				"value": "52777",
				"children": []
			}, {
				"label": "穆圩乡",
				"value": "52778",
				"children": []
			}, {
				"label": "伊芦乡",
				"value": "52779",
				"children": []
			}, {
				"label": "图河乡",
				"value": "52780",
				"children": []
			}, {
				"label": "鲁河乡",
				"value": "52781",
				"children": []
			}, {
				"label": "陡沟乡",
				"value": "52782",
				"children": []
			}, {
				"label": "南岗乡",
				"value": "52783",
				"children": []
			}, {
				"label": "下车乡",
				"value": "52784",
				"children": []
			}, {
				"label": "沂北乡",
				"value": "52785",
				"children": []
			}]
		}, {
			"label": "东海县",
			"value": "922",
			"children": [{
				"label": "城区",
				"value": "52786",
				"children": []
			}, {
				"label": "石梁河镇",
				"value": "52787",
				"children": []
			}, {
				"label": "白塔埠镇",
				"value": "52788",
				"children": []
			}, {
				"label": "洪庄镇",
				"value": "52789",
				"children": []
			}, {
				"label": "牛山镇",
				"value": "52790",
				"children": []
			}, {
				"label": "房山镇",
				"value": "52791",
				"children": []
			}, {
				"label": "温泉镇",
				"value": "52792",
				"children": []
			}, {
				"label": "平明镇",
				"value": "52793",
				"children": []
			}, {
				"label": "石榴镇",
				"value": "52794",
				"children": []
			}, {
				"label": "桃林镇",
				"value": "52795",
				"children": []
			}, {
				"label": "青湖镇",
				"value": "52796",
				"children": []
			}, {
				"label": "安峰镇",
				"value": "52797",
				"children": []
			}, {
				"label": "双店镇",
				"value": "52798",
				"children": []
			}, {
				"label": "黄川镇",
				"value": "52799",
				"children": []
			}, {
				"label": "山左口乡",
				"value": "52800",
				"children": []
			}, {
				"label": "曲阳乡",
				"value": "52801",
				"children": []
			}, {
				"label": "张湾乡",
				"value": "52802",
				"children": []
			}, {
				"label": "李埝乡",
				"value": "52803",
				"children": []
			}, {
				"label": "石湖乡",
				"value": "52804",
				"children": []
			}, {
				"label": "横沟乡",
				"value": "52805",
				"children": []
			}, {
				"label": "驼峰乡",
				"value": "52806",
				"children": []
			}, {
				"label": "南辰乡",
				"value": "52807",
				"children": []
			}]
		}, {
			"label": "灌南县",
			"value": "923",
			"children": [{
				"label": "城区",
				"value": "52808",
				"children": []
			}, {
				"label": "孟兴庄镇",
				"value": "52809",
				"children": []
			}, {
				"label": "北陈集镇",
				"value": "52810",
				"children": []
			}, {
				"label": "堆沟港镇",
				"value": "52811",
				"children": []
			}, {
				"label": "长茂镇",
				"value": "52812",
				"children": []
			}, {
				"label": "百禄镇",
				"value": "52813",
				"children": []
			}, {
				"label": "三口镇",
				"value": "52814",
				"children": []
			}, {
				"label": "汤沟镇",
				"value": "52815",
				"children": []
			}, {
				"label": "张店镇",
				"value": "52816",
				"children": []
			}, {
				"label": "新安镇",
				"value": "52817",
				"children": []
			}, {
				"label": "花园乡",
				"value": "52818",
				"children": []
			}, {
				"label": "田楼乡",
				"value": "52819",
				"children": []
			}, {
				"label": "新集乡",
				"value": "52820",
				"children": []
			}, {
				"label": "李集乡",
				"value": "52821",
				"children": []
			}, {
				"label": "五队乡",
				"value": "52822",
				"children": []
			}]
		}, {
			"label": "连云区",
			"value": "4248",
			"children": [{
				"label": "城区",
				"value": "52823",
				"children": []
			}, {
				"label": "板桥镇",
				"value": "52824",
				"children": []
			}, {
				"label": "徐圩镇",
				"value": "52825",
				"children": []
			}, {
				"label": "东辛农场",
				"value": "52826",
				"children": []
			}, {
				"label": "连岛",
				"value": "52827",
				"children": []
			}, {
				"label": "朝阳镇",
				"value": "52828",
				"children": []
			}, {
				"label": "前三岛乡",
				"value": "52829",
				"children": []
			}, {
				"label": "高公岛乡",
				"value": "52830",
				"children": []
			}, {
				"label": "宿城乡",
				"value": "52831",
				"children": []
			}]
		}, {
			"label": "海州区",
			"value": "52746",
			"children": [{
				"label": "城区",
				"value": "52832",
				"children": []
			}, {
				"label": "南城镇",
				"value": "52833",
				"children": []
			}, {
				"label": "浦南镇",
				"value": "52834",
				"children": []
			}, {
				"label": "云台乡",
				"value": "52835",
				"children": []
			}, {
				"label": "岗埠农场",
				"value": "52836",
				"children": []
			}, {
				"label": "板浦镇",
				"value": "52837",
				"children": []
			}, {
				"label": "锦屏镇",
				"value": "52838",
				"children": []
			}, {
				"label": "新坝镇",
				"value": "52839",
				"children": []
			}, {
				"label": "宁海乡",
				"value": "52840",
				"children": []
			}]
		}]
	}, {
		"label": "淮安市",
		"value": "925",
		"children": [{
			"label": "洪泽县",
			"value": "929",
			"children": [{
				"label": "城区",
				"value": "52847",
				"children": []
			}, {
				"label": "高良涧镇",
				"value": "52848",
				"children": []
			}, {
				"label": "东双沟镇",
				"value": "52849",
				"children": []
			}, {
				"label": "老子山镇",
				"value": "52850",
				"children": []
			}, {
				"label": "西顺河镇",
				"value": "52851",
				"children": []
			}, {
				"label": "岔河镇",
				"value": "52852",
				"children": []
			}, {
				"label": "共和镇",
				"value": "52853",
				"children": []
			}, {
				"label": "黄集镇",
				"value": "52854",
				"children": []
			}, {
				"label": "蒋坝镇",
				"value": "52855",
				"children": []
			}, {
				"label": "仁和镇",
				"value": "52856",
				"children": []
			}, {
				"label": "三河镇",
				"value": "52857",
				"children": []
			}, {
				"label": "万集镇",
				"value": "52858",
				"children": []
			}, {
				"label": "朱坝镇",
				"value": "52859",
				"children": []
			}]
		}, {
			"label": "金湖县",
			"value": "930",
			"children": [{
				"label": "城区",
				"value": "52860",
				"children": []
			}, {
				"label": "黎城镇",
				"value": "52861",
				"children": []
			}, {
				"label": "陈桥镇",
				"value": "52862",
				"children": []
			}, {
				"label": "戴楼镇",
				"value": "52863",
				"children": []
			}, {
				"label": "金北镇",
				"value": "52864",
				"children": []
			}, {
				"label": "金南镇",
				"value": "52865",
				"children": []
			}, {
				"label": "吕良镇",
				"value": "52866",
				"children": []
			}, {
				"label": "闵桥镇",
				"value": "52867",
				"children": []
			}, {
				"label": "前锋镇",
				"value": "52868",
				"children": []
			}, {
				"label": "塔集镇",
				"value": "52869",
				"children": []
			}, {
				"label": "涂沟镇",
				"value": "52870",
				"children": []
			}, {
				"label": "银集镇",
				"value": "52871",
				"children": []
			}]
		}, {
			"label": "盱眙县",
			"value": "931",
			"children": [{
				"label": "城区",
				"value": "52872",
				"children": []
			}, {
				"label": "盱城镇",
				"value": "52873",
				"children": []
			}, {
				"label": "鲍集镇",
				"value": "52874",
				"children": []
			}, {
				"label": "仇集镇",
				"value": "52875",
				"children": []
			}, {
				"label": "官滩镇",
				"value": "52876",
				"children": []
			}, {
				"label": "管镇镇",
				"value": "52877",
				"children": []
			}, {
				"label": "桂五镇",
				"value": "52878",
				"children": []
			}, {
				"label": "河桥镇",
				"value": "52879",
				"children": []
			}, {
				"label": "淮河镇",
				"value": "52880",
				"children": []
			}, {
				"label": "旧铺镇",
				"value": "52881",
				"children": []
			}, {
				"label": "马坝镇",
				"value": "52882",
				"children": []
			}, {
				"label": "铁佛镇",
				"value": "52883",
				"children": []
			}, {
				"label": "观音寺镇",
				"value": "52884",
				"children": []
			}, {
				"label": "黄花塘镇",
				"value": "52885",
				"children": []
			}, {
				"label": "明祖陵镇",
				"value": "52886",
				"children": []
			}, {
				"label": "古桑乡",
				"value": "52887",
				"children": []
			}, {
				"label": "穆店乡",
				"value": "52888",
				"children": []
			}, {
				"label": "王店乡",
				"value": "52889",
				"children": []
			}, {
				"label": "维桥乡",
				"value": "52890",
				"children": []
			}, {
				"label": "兴隆乡",
				"value": "52891",
				"children": []
			}]
		}, {
			"label": "经济开发区",
			"value": "4305",
		}, {
			"label": "淮安区",
			"value": "52841",
			"children": [{
				"label": "博里镇",
				"value": "52892",
				"children": []
			}, {
				"label": "车桥镇",
				"value": "52893",
				"children": []
			}, {
				"label": "仇桥镇",
				"value": "52894",
				"children": []
			}, {
				"label": "范集镇",
				"value": "52895",
				"children": []
			}, {
				"label": "复兴镇",
				"value": "52896",
				"children": []
			}, {
				"label": "淮城镇",
				"value": "52897",
				"children": []
			}, {
				"label": "季桥镇",
				"value": "52898",
				"children": []
			}, {
				"label": "泾口镇",
				"value": "52899",
				"children": []
			}, {
				"label": "林集镇",
				"value": "52900",
				"children": []
			}, {
				"label": "流均镇",
				"value": "52901",
				"children": []
			}, {
				"label": "马甸镇",
				"value": "52902",
				"children": []
			}, {
				"label": "南闸镇",
				"value": "52903",
				"children": []
			}, {
				"label": "平桥镇",
				"value": "52904",
				"children": []
			}, {
				"label": "钦工镇",
				"value": "52905",
				"children": []
			}, {
				"label": "上河镇",
				"value": "52906",
				"children": []
			}, {
				"label": "施河镇",
				"value": "52907",
				"children": []
			}, {
				"label": "顺河镇",
				"value": "52908",
				"children": []
			}, {
				"label": "苏嘴镇",
				"value": "52909",
				"children": []
			}, {
				"label": "溪河镇",
				"value": "52910",
				"children": []
			}, {
				"label": "席桥镇",
				"value": "52911",
				"children": []
			}, {
				"label": "朱桥镇",
				"value": "52912",
				"children": []
			}, {
				"label": "建淮乡",
				"value": "52913",
				"children": []
			}, {
				"label": "城东乡",
				"value": "52914",
				"children": []
			}, {
				"label": "茭陵乡",
				"value": "52915",
				"children": []
			}, {
				"label": "三堡乡",
				"value": "52916",
				"children": []
			}, {
				"label": "宋集乡",
				"value": "52917",
				"children": []
			}]
		}, {
			"label": "清河区",
			"value": "52842",
			"children": [{
				"label": "城区",
				"value": "52918",
				"children": []
			}, {
				"label": "南马厂乡",
				"value": "52919",
				"children": []
			}, {
				"label": "钵池乡",
				"value": "52920",
				"children": []
			}, {
				"label": "徐杨乡",
				"value": "52921",
				"children": []
			}]
		}, {
			"label": "淮阴区",
			"value": "52843",
			"children": [{
				"label": "三树镇",
				"value": "52922",
				"children": []
			}, {
				"label": "王兴镇",
				"value": "52923",
				"children": []
			}, {
				"label": "吴城镇",
				"value": "52924",
				"children": []
			}, {
				"label": "吴集镇",
				"value": "52925",
				"children": []
			}, {
				"label": "五里镇",
				"value": "52926",
				"children": []
			}, {
				"label": "徐溜镇",
				"value": "52927",
				"children": []
			}, {
				"label": "渔沟镇",
				"value": "52928",
				"children": []
			}, {
				"label": "赵集镇",
				"value": "52929",
				"children": []
			}, {
				"label": "王营镇",
				"value": "52930",
				"children": []
			}, {
				"label": "老张集乡",
				"value": "52931",
				"children": []
			}, {
				"label": "刘老庄乡",
				"value": "52932",
				"children": []
			}, {
				"label": "古寨乡",
				"value": "52933",
				"children": []
			}, {
				"label": "韩桥乡",
				"value": "52934",
				"children": []
			}, {
				"label": "凌桥乡",
				"value": "52935",
				"children": []
			}, {
				"label": "新渡乡",
				"value": "52936",
				"children": []
			}, {
				"label": "袁集乡",
				"value": "52937",
				"children": []
			}, {
				"label": "棉花庄镇",
				"value": "52938",
				"children": []
			}, {
				"label": "南陈集镇",
				"value": "52939",
				"children": []
			}, {
				"label": "西宋集镇",
				"value": "52940",
				"children": []
			}, {
				"label": "丁集镇",
				"value": "52941",
				"children": []
			}, {
				"label": "码头镇",
				"value": "52942",
				"children": []
			}]
		}, {
			"label": "清浦区",
			"value": "52844",
			"children": [{
				"label": "城区",
				"value": "52943",
				"children": []
			}, {
				"label": "和平镇",
				"value": "52944",
				"children": []
			}, {
				"label": "武墩镇",
				"value": "52945",
				"children": []
			}, {
				"label": "盐河镇",
				"value": "52946",
				"children": []
			}, {
				"label": "黄码乡",
				"value": "52947",
				"children": []
			}, {
				"label": "城南乡",
				"value": "52948",
				"children": []
			}]
		}, {
			"label": "涟水县",
			"value": "52845",
			"children": [{
				"label": "城区",
				"value": "52949",
				"children": []
			}, {
				"label": "涟城镇",
				"value": "52950",
				"children": []
			}, {
				"label": "陈师镇",
				"value": "52951",
				"children": []
			}, {
				"label": "高沟镇",
				"value": "52952",
				"children": []
			}, {
				"label": "朱码镇",
				"value": "52953",
				"children": []
			}, {
				"label": "保滩镇",
				"value": "52954",
				"children": []
			}, {
				"label": "岔庙镇",
				"value": "52955",
				"children": []
			}, {
				"label": "成集镇",
				"value": "52956",
				"children": []
			}, {
				"label": "大东镇",
				"value": "52957",
				"children": []
			}, {
				"label": "红窑镇",
				"value": "52958",
				"children": []
			}, {
				"label": "梁岔镇",
				"value": "52959",
				"children": []
			}, {
				"label": "南集镇",
				"value": "52960",
				"children": []
			}, {
				"label": "前进镇",
				"value": "52961",
				"children": []
			}, {
				"label": "石湖镇",
				"value": "52962",
				"children": []
			}, {
				"label": "唐集镇",
				"value": "52963",
				"children": []
			}, {
				"label": "五港镇",
				"value": "52964",
				"children": []
			}, {
				"label": "义兴镇",
				"value": "52965",
				"children": []
			}, {
				"label": "东胡集镇",
				"value": "52966",
				"children": []
			}, {
				"label": "黄营乡",
				"value": "52967",
				"children": []
			}, {
				"label": "徐集乡",
				"value": "52968",
				"children": []
			}]
		}, {
			"label": "清江浦区",
			"value": "52846",
			"children": [{
				"label": "黄码乡",
				"value": "52969",
				"children": []
			}, {
				"label": "盐河镇",
				"value": "52970",
				"children": []
			}, {
				"label": "城区",
				"value": "52971",
				"children": []
			}, {
				"label": "和平镇",
				"value": "52972",
				"children": []
			}, {
				"label": "武墩镇",
				"value": "52973",
				"children": []
			}]
		}]
	}, {
		"label": "宿迁市",
		"value": "933",
		"children": [{
			"label": "宿豫区",
			"value": "934",
		}, {
			"label": "泗洪县",
			"value": "937",
		}, {
			"label": "宿城区",
			"value": "3407",
		}, {
			"label": "沭阳县",
			"value": "8558",
		}, {
			"label": "泗阳县",
			"value": "8559",
		}, {
			"label": "宿迁经济开发区",
			"value": "52974",
		}]
	}, {
		"label": "盐城市",
		"value": "939",
		"children": [{
			"label": "东台市",
			"value": "940",
		}, {
			"label": "大丰市",
			"value": "941",
		}, {
			"label": "建湖县",
			"value": "945",
		}, {
			"label": "响水县",
			"value": "946",
		}, {
			"label": "阜宁县",
			"value": "948",
		}, {
			"label": "滨海县",
			"value": "949",
		}, {
			"label": "射阳县",
			"value": "52975",
		}, {
			"label": "亭湖区",
			"value": "52976",
		}, {
			"label": "盐都区",
			"value": "52977",
		}]
	}, {
		"label": "扬州市",
		"value": "951",
		"children": [{
			"label": "广陵区",
			"value": "955",
		}, {
			"label": "邗江区",
			"value": "956",
		}, {
			"label": "宝应县",
			"value": "957",
		}, {
			"label": "仪征市",
			"value": "52978",
		}, {
			"label": "高邮市",
			"value": "52979",
		}, {
			"label": "江都区",
			"value": "52980",
		}]
	}, {
		"label": "泰州市",
		"value": "959",
		"children": [{
			"label": "泰兴市",
			"value": "960",
		}, {
			"label": "靖江市",
			"value": "962",
		}, {
			"label": "兴化市",
			"value": "963",
		}, {
			"label": "高港区",
			"value": "3405",
		}, {
			"label": "海陵区",
			"value": "3406",
		}, {
			"label": "泰州医药高新区",
			"value": "52981",
		}, {
			"label": "姜堰区",
			"value": "52982",
		}]
	}, {
		"label": "南通市",
		"value": "965",
		"children": [{
			"label": "通州区",
			"value": "967",
		}, {
			"label": "如东县",
			"value": "970",
		}, {
			"label": "海安县",
			"value": "2774",
		}, {
			"label": "港闸区",
			"value": "3394",
		}, {
			"label": "崇川区",
			"value": "3395",
		}, {
			"label": "南通经济技术开发区",
			"value": "4385",
		}, {
			"label": "如皋市",
			"value": "52985",
		}, {
			"label": "海门市",
			"value": "52986",
		}, {
			"label": "启东市",
			"value": "52987",
		}]
	}, {
		"label": "镇江市",
		"value": "972",
		"children": [{
			"label": "扬中市",
			"value": "973",
		}, {
			"label": "丹徒区",
			"value": "976",
		}, {
			"label": "润州区",
			"value": "3403",
		}, {
			"label": "京口区",
			"value": "3404",
		}, {
			"label": "镇江新区",
			"value": "4916",
		}, {
			"label": "丹阳市",
			"value": "52992",
		}, {
			"label": "句容市",
			"value": "52993",
		}, {
			"label": "丹徒新区",
			"value": "52994",
		}]
	}, {
		"label": "常州市",
		"value": "978",
		"children": [{
			"label": "金坛市",
			"value": "980",
		}, {
			"label": "溧阳市",
			"value": "981",
		}, {
			"label": "新北区",
			"value": "2927",
		}, {
			"label": "钟楼区",
			"value": "3392",
		}, {
			"label": "天宁区",
			"value": "3393",
		}, {
			"label": "武进区",
			"value": "4459",
		}]
	}, {
		"label": "无锡市",
		"value": "984",
		"children": [{
			"label": "崇安区",
			"value": "3381",
		}, {
			"label": "南长区",
			"value": "3382",
		}, {
			"label": "北塘区",
			"value": "3383",
		}, {
			"label": "锡山区",
			"value": "3384",
		}, {
			"label": "惠山区",
			"value": "3385",
		}, {
			"label": "新区",
			"value": "4029",
		}, {
			"label": "江阴市",
			"value": "53000",
		}, {
			"label": "宜兴市",
			"value": "53001",
		}, {
			"label": "滨湖区",
			"value": "53002",
		}, {
			"label": "新吴区",
			"value": "53003",
		}, {
			"label": "梁溪区",
			"value": "53005",
		}]
	}, {
		"label": "苏州市",
		"value": "988",
		"children": [{
			"label": "常熟市",
			"value": "993",
		}, {
			"label": "张家港市",
			"value": "994",
		}, {
			"label": "相城区",
			"value": "3082",
		}, {
			"label": "金阊区",
			"value": "3083",
		}, {
			"label": "虎丘区",
			"value": "3085",
		}, {
			"label": "平江区",
			"value": "3087",
		}, {
			"label": "沧浪区",
			"value": "3088",
		}, {
			"label": "工业园区",
			"value": "3444",
		}, {
			"label": "高新区",
			"value": "3742",
		}, {
			"label": "太仓市",
			"value": "4346",
		}, {
			"label": "吴江区",
			"value": "53016",
		}, {
			"label": "吴中区",
			"value": "53017",
		}, {
			"label": "姑苏区",
			"value": "53018",
		}, {
			"label": "昆山市",
			"value": "53019",
		}]
	}]
}, {
	"label": "山东",
	"value": "13",
	"children": [{
		"label": "济南市",
		"value": "1000",
		"children": [{
			"label": "长清区",
			"value": "1002",
		}, {
			"label": "平阴县",
			"value": "1003",
		}, {
			"label": "济阳县",
			"value": "1004",
		}, {
			"label": "商河县",
			"value": "1005",
		}, {
			"label": "高新区",
			"value": "4277",
		}, {
			"label": "历城区",
			"value": "53527",
		}, {
			"label": "天桥区",
			"value": "53528",
		}, {
			"label": "槐荫区",
			"value": "53529",
		}, {
			"label": "历下区",
			"value": "53530",
		}, {
			"label": "市中区",
			"value": "53531",
		}, {
			"label": "章丘区",
			"value": "53532",
		}]
	}, {
		"label": "青岛市",
		"value": "1007",
		"children": [{
			"label": "莱西市",
			"value": "1014",
		}, {
			"label": "四方区",
			"value": "3519",
		}, {
			"label": "市北区",
			"value": "3520",
		}, {
			"label": "市南区",
			"value": "3521",
		}, {
			"label": "李沧区",
			"value": "4909",
		}, {
			"label": "黄岛区",
			"value": "5505",
		}, {
			"label": "即墨区",
			"value": "53533",
		}, {
			"label": "城阳区",
			"value": "53534",
		}, {
			"label": "崂山区",
			"value": "53535",
		}, {
			"label": "胶州市",
			"value": "53536",
		}, {
			"label": "平度市",
			"value": "53537",
		}]
	}, {
		"label": "淄博市",
		"value": "1016",
		"children": [{
			"label": "高青县",
			"value": "1019",
		}, {
			"label": "沂源县",
			"value": "1020",
		}, {
			"label": "桓台县",
			"value": "1021",
		}, {
			"label": "周村区",
			"value": "2924",
		}, {
			"label": "淄川区",
			"value": "2962",
		}, {
			"label": "博山区",
			"value": "2968",
		}, {
			"label": "临淄区",
			"value": "2969",
		}, {
			"label": "张店区",
			"value": "53538",
		}]
	}, {
		"label": "枣庄市",
		"value": "1022",
		"children": [{
			"label": "山亭区",
			"value": "3522",
		}, {
			"label": "台儿庄区",
			"value": "3523",
		}, {
			"label": "峄城区",
			"value": "3524",
		}, {
			"label": "薛城区",
			"value": "3525",
		}, {
			"label": "市中区",
			"value": "3526",
		}, {
			"label": "滕州区",
			"value": "53539",
		}]
	}, {
		"label": "东营市",
		"value": "1025",
		"children": [{
			"label": "河口区",
			"value": "1026",
		}, {
			"label": "广饶县",
			"value": "1027",
		}, {
			"label": "利津县",
			"value": "1028",
		}, {
			"label": "垦利县",
			"value": "1029",
		}, {
			"label": "东营区",
			"value": "53540",
		}]
	}, {
		"label": "潍坊市",
		"value": "1032",
		"children": [{
			"label": "青州市",
			"value": "1033",
		}, {
			"label": "诸城市",
			"value": "1034",
		}, {
			"label": "安丘市",
			"value": "1036",
		}, {
			"label": "高密市",
			"value": "1037",
		}, {
			"label": "昌邑市",
			"value": "1038",
		}, {
			"label": "昌乐县",
			"value": "1039",
		}, {
			"label": "临朐县",
			"value": "1041",
		}, {
			"label": "坊子区",
			"value": "3530",
		}, {
			"label": "潍城区",
			"value": "53541",
		}, {
			"label": "奎文区",
			"value": "53542",
		}, {
			"label": "高新区",
			"value": "53543",
		}, {
			"label": "寒亭区",
			"value": "53544",
		}, {
			"label": "寿光市",
			"value": "53545",
		}]
	}, {
		"label": "烟台市",
		"value": "1042",
		"children": [{
			"label": "莱阳市",
			"value": "1044",
		}, {
			"label": "招远市",
			"value": "1047",
		}, {
			"label": "蓬莱市",
			"value": "1048",
		}, {
			"label": "栖霞市",
			"value": "1049",
		}, {
			"label": "海阳市",
			"value": "1050",
		}, {
			"label": "长岛县",
			"value": "1051",
		}, {
			"label": "芝罘区",
			"value": "3126",
		}, {
			"label": "莱山区",
			"value": "3528",
		}, {
			"label": "开发区",
			"value": "53546",
		}]
	}, {
		"label": "威海市",
		"value": "1053",
		"children": [{
			"label": "乳山市",
			"value": "1054",
		}, {
			"label": "环翠区",
			"value": "4144",
		}, {
			"label": "荣成市",
			"value": "53547",
		}, {
			"label": "文登市",
			"value": "53548",
		}]
	}, {
		"label": "莱芜市",
		"value": "1058",
		"children": [{
			"label": "莱城区",
			"value": "1059",
		}, {
			"label": "钢城区",
			"value": "3539",
		}]
	}, {
		"label": "德州市",
		"value": "1060",
		"children": [{
			"label": "乐陵市",
			"value": "1061",
		}, {
			"label": "禹城市",
			"value": "1062",
		}, {
			"label": "陵县",
			"value": "1063",
		}, {
			"label": "宁津县",
			"value": "1064",
		}, {
			"label": "武城县",
			"value": "1066",
		}, {
			"label": "庆云县",
			"value": "1067",
		}, {
			"label": "平原县",
			"value": "1068",
		}, {
			"label": "临邑县",
			"value": "1069",
		}, {
			"label": "夏津县",
			"value": "1071",
		}, {
			"label": "德城区",
			"value": "3542",
		}, {
			"label": "齐河县",
			"value": "53549",
		}]
	}, {
		"label": "临沂市",
		"value": "1072",
		"children": [{
			"label": "沂南县",
			"value": "1073",
		}, {
			"label": "沂水县",
			"value": "1074",
		}, {
			"label": "苍山县",
			"value": "1075",
		}, {
			"label": "费县",
			"value": "1076",
		}, {
			"label": "平邑县",
			"value": "1077",
		}, {
			"label": "蒙阴县",
			"value": "1078",
		}, {
			"label": "临沭县",
			"value": "1079",
		}, {
			"label": "莒南县",
			"value": "2926",
		}, {
			"label": "郯城县",
			"value": "2974",
		}, {
			"label": "罗庄区",
			"value": "3540",
		}, {
			"label": "兰山区",
			"value": "53550",
		}, {
			"label": "河东区",
			"value": "53551",
		}, {
			"label": "兰陵县",
			"value": "53552",
		}]
	}, {
		"label": "聊城市",
		"value": "1081",
		"children": [{
			"label": "临清市",
			"value": "1082",
		}, {
			"label": "阳谷县",
			"value": "1084",
		}, {
			"label": "茌平县",
			"value": "1085",
		}, {
			"label": "莘县",
			"value": "1086",
		}, {
			"label": "东阿县",
			"value": "1087",
		}, {
			"label": "冠县",
			"value": "1088",
		}, {
			"label": "高唐县",
			"value": "4043",
		}, {
			"label": "东昌府区",
			"value": "53554",
		}]
	}, {
		"label": "滨州市",
		"value": "1090",
		"children": [{
			"label": "邹平县",
			"value": "1092",
		}, {
			"label": "沾化县",
			"value": "1093",
		}, {
			"label": "惠民县",
			"value": "1094",
		}, {
			"label": "博兴县",
			"value": "1095",
		}, {
			"label": "阳信县",
			"value": "1096",
		}, {
			"label": "无棣县",
			"value": "2772",
		}, {
			"label": "北海新区",
			"value": "53555",
		}, {
			"label": "滨城区",
			"value": "53556",
		}]
	}, {
		"label": "菏泽市",
		"value": "1099",
		"children": [{
			"label": "单县",
			"value": "1101",
		}, {
			"label": "曹县",
			"value": "1102",
		}, {
			"label": "定陶县",
			"value": "1103",
		}, {
			"label": "巨野县",
			"value": "1104",
		}, {
			"label": "成武县",
			"value": "1105",
		}, {
			"label": "东明县",
			"value": "1106",
		}, {
			"label": "郓城县",
			"value": "1107",
		}, {
			"label": "鄄城县",
			"value": "2773",
		}, {
			"label": "牡丹区",
			"value": "3543",
		}]
	}, {
		"label": "日照市",
		"value": "1108",
		"children": [{
			"label": "五莲县",
			"value": "2934",
		}, {
			"label": "莒县",
			"value": "3068",
		}, {
			"label": "岚山区",
			"value": "4113",
		}, {
			"label": "新市区",
			"value": "4196",
		}, {
			"label": "东港区",
			"value": "53557",
		}]
	}, {
		"label": "泰安市",
		"value": "1112",
		"children": [{
			"label": "东平县",
			"value": "3132",
		}, {
			"label": "宁阳县",
			"value": "3535",
		}, {
			"label": "岱岳区",
			"value": "53558",
		}, {
			"label": "泰山区",
			"value": "53559",
		}, {
			"label": "肥城市",
			"value": "53560",
		}, {
			"label": "新泰市",
			"value": "53561",
		}]
	}, {
		"label": "济宁市",
		"value": "2900",
		"children": [{
			"label": "梁山县",
			"value": "2908",
		}, {
			"label": "兖州市",
			"value": "2910",
		}, {
			"label": "微山县",
			"value": "2912",
		}, {
			"label": "汶上县",
			"value": "2913",
		}, {
			"label": "泗水县",
			"value": "2914",
		}, {
			"label": "嘉祥县",
			"value": "2915",
		}, {
			"label": "鱼台县",
			"value": "2916",
		}, {
			"label": "金乡县",
			"value": "2917",
		}, {
			"label": "任城区",
			"value": "3533",
		}, {
			"label": "邹城市",
			"value": "53562",
		}, {
			"label": "市中区",
			"value": "53563",
		}, {
			"label": "曲阜市",
			"value": "53564",
		}, {
			"label": "高新区",
			"value": "53565",
		}]
	}]
}, {
	"label": "安徽",
	"value": "14",
	"children": [{
		"label": "铜陵市",
		"value": "1114",
		"children": [{
			"label": "郊区",
			"value": "53480",
		}, {
			"label": "义安区",
			"value": "53481",
		}, {
			"label": "铜官区",
			"value": "53482",
		}, {
			"label": "枞阳县",
			"value": "53483",
		}]
	}, {
		"label": "合肥市",
		"value": "1116",
		"children": [{
			"label": "肥东县",
			"value": "1119",
		}, {
			"label": "庐江县",
			"value": "1190",
		}, {
			"label": "包河区",
			"value": "3431",
		}, {
			"label": "蜀山区",
			"value": "3432",
		}, {
			"label": "瑶海区",
			"value": "3433",
		}, {
			"label": "庐阳区",
			"value": "3434",
		}, {
			"label": "经济技术开发区",
			"value": "4173",
		}, {
			"label": "高新技术开发区",
			"value": "4192",
		}, {
			"label": "北城新区",
			"value": "6117",
		}, {
			"label": "滨湖新区",
			"value": "6118",
		}, {
			"label": "政务文化新区",
			"value": "6119",
		}, {
			"label": "新站综合开发试验区",
			"value": "6120",
		}, {
			"label": "肥西县",
			"value": "53484",
		}, {
			"label": "巢湖市",
			"value": "53485",
		}, {
			"label": "长丰县",
			"value": "53486",
		}]
	}, {
		"label": "淮南市",
		"value": "1121",
		"children": [{
			"label": "凤台县",
			"value": "1122",
			"children": [{
				"label": "夏集镇",
				"value": "8167",
				"children": []
			}, {
				"label": "尚塘乡",
				"value": "8168",
				"children": []
			}, {
				"label": "朱马店镇",
				"value": "8169",
				"children": []
			}, {
				"label": "顾桥镇",
				"value": "8170",
				"children": []
			}, {
				"label": "经济开发区",
				"value": "8171",
				"children": []
			}, {
				"label": "岳张集镇",
				"value": "8172",
				"children": []
			}, {
				"label": "新集镇",
				"value": "8173",
				"children": []
			}, {
				"label": "丁集乡",
				"value": "8174",
				"children": []
			}, {
				"label": "桂集镇",
				"value": "8175",
				"children": []
			}, {
				"label": "钱庙乡",
				"value": "8176",
				"children": []
			}, {
				"label": "大兴集乡",
				"value": "8177",
				"children": []
			}, {
				"label": "李冲回族乡",
				"value": "8178",
				"children": []
			}, {
				"label": "杨村乡",
				"value": "8179",
				"children": []
			}, {
				"label": "凤凰镇",
				"value": "8180",
				"children": []
			}, {
				"label": "毛集镇",
				"value": "8181",
				"children": []
			}, {
				"label": "古店乡",
				"value": "8182",
				"children": []
			}, {
				"label": "焦岗湖镇",
				"value": "8183",
				"children": []
			}, {
				"label": "刘集乡",
				"value": "8184",
				"children": []
			}, {
				"label": "城关镇",
				"value": "8185",
				"children": []
			}, {
				"label": "关店乡",
				"value": "8186",
				"children": []
			}]
		}, {
			"label": "田家庵区",
			"value": "3447",
			"children": [{
				"label": "淮滨街道",
				"value": "8239",
				"children": []
			}, {
				"label": "史院乡",
				"value": "8240",
				"children": []
			}, {
				"label": "洞山街道",
				"value": "8241",
				"children": []
			}, {
				"label": "泉山街道",
				"value": "8242",
				"children": []
			}, {
				"label": "曹庵镇",
				"value": "8243",
				"children": []
			}, {
				"label": "公园街道",
				"value": "8244",
				"children": []
			}, {
				"label": "新淮街道",
				"value": "8245",
				"children": []
			}, {
				"label": "龙泉街道",
				"value": "8246",
				"children": []
			}, {
				"label": "国庆街道",
				"value": "8247",
				"children": []
			}, {
				"label": "田东街道",
				"value": "8248",
				"children": []
			}, {
				"label": "安成镇",
				"value": "8249",
				"children": []
			}, {
				"label": "朝阳街道",
				"value": "8250",
				"children": []
			}, {
				"label": "舜耕镇",
				"value": "8251",
				"children": []
			}, {
				"label": "三和乡",
				"value": "8252",
				"children": []
			}]
		}, {
			"label": "大通区",
			"value": "3448",
			"children": [{
				"label": "大通街道",
				"value": "8233",
				"children": []
			}, {
				"label": "上窑镇",
				"value": "8234",
				"children": []
			}, {
				"label": "孔店乡",
				"value": "8235",
				"children": []
			}, {
				"label": "洛河镇",
				"value": "8236",
				"children": []
			}, {
				"label": "九龙岗镇",
				"value": "8237",
				"children": []
			}, {
				"label": "淮南经济开发区",
				"value": "8238",
				"children": []
			}]
		}, {
			"label": "谢家集区",
			"value": "3449",
			"children": [{
				"label": "唐山镇",
				"value": "8253",
				"children": []
			}, {
				"label": "李郢孜镇",
				"value": "8254",
				"children": []
			}, {
				"label": "平山街道",
				"value": "8255",
				"children": []
			}, {
				"label": "孤堆乡",
				"value": "8256",
				"children": []
			}, {
				"label": "谢家集街道",
				"value": "8257",
				"children": []
			}, {
				"label": "望峰岗镇",
				"value": "8258",
				"children": []
			}, {
				"label": "谢三村街道",
				"value": "8259",
				"children": []
			}, {
				"label": "蔡家岗街道",
				"value": "8260",
				"children": []
			}, {
				"label": "孙庙乡",
				"value": "8261",
				"children": []
			}, {
				"label": "立新街道",
				"value": "8262",
				"children": []
			}, {
				"label": "杨公镇",
				"value": "8263",
				"children": []
			}]
		}, {
			"label": "八公山区",
			"value": "3450",
			"children": [{
				"label": "毕家岗街道",
				"value": "8227",
				"children": []
			}, {
				"label": "妙山林场",
				"value": "8228",
				"children": []
			}, {
				"label": "土坝孜街道",
				"value": "8229",
				"children": []
			}, {
				"label": "八公山镇",
				"value": "8230",
				"children": []
			}, {
				"label": "新庄孜街道",
				"value": "8231",
				"children": []
			}, {
				"label": "山王镇",
				"value": "8232",
				"children": []
			}]
		}, {
			"label": "潘集区",
			"value": "3451",
			"children": [{
				"label": "架河镇",
				"value": "8156",
				"children": []
			}, {
				"label": "平圩镇",
				"value": "8157",
				"children": []
			}, {
				"label": "潘集镇",
				"value": "8158",
				"children": []
			}, {
				"label": "田集街道",
				"value": "8159",
				"children": []
			}, {
				"label": "贺疃乡",
				"value": "8160",
				"children": []
			}, {
				"label": "祁集乡",
				"value": "8161",
				"children": []
			}, {
				"label": "芦集镇",
				"value": "8162",
				"children": []
			}, {
				"label": "古沟回族乡",
				"value": "8163",
				"children": []
			}, {
				"label": "泥河镇",
				"value": "8164",
				"children": []
			}, {
				"label": "高皇镇",
				"value": "8165",
				"children": []
			}, {
				"label": "夹沟乡",
				"value": "8166",
				"children": []
			}]
		}, {
			"label": "淮南高新技术开发区",
			"value": "4960",
		}, {
			"label": "寿县",
			"value": "53487",
		}]
	}, {
		"label": "淮北市",
		"value": "1124",
		"children": [{
			"label": "杜集区",
			"value": "53488",
		}, {
			"label": "烈山区",
			"value": "53489",
		}, {
			"label": "濉溪县",
			"value": "53490",
		}, {
			"label": "相山区",
			"value": "53491",
		}]
	}, {
		"label": "芜湖市",
		"value": "1127",
		"children": [{
			"label": "芜湖县",
			"value": "1128",
		}, {
			"label": "繁昌县",
			"value": "1129",
		}, {
			"label": "南陵县",
			"value": "1130",
		}, {
			"label": "无为县",
			"value": "1189",
		}, {
			"label": "镜湖区",
			"value": "3438",
		}, {
			"label": "弋江区",
			"value": "4172",
		}, {
			"label": "鸠江区",
			"value": "53492",
		}, {
			"label": "三山区",
			"value": "53493",
		}]
	}, {
		"label": "蚌埠市",
		"value": "1132",
		"children": [{
			"label": "怀远县",
			"value": "1133",
		}, {
			"label": "固镇县",
			"value": "1134",
		}, {
			"label": "五河县",
			"value": "1135",
		}, {
			"label": "蚌山区",
			"value": "3442",
		}, {
			"label": "淮上区",
			"value": "53494",
		}, {
			"label": "龙子湖区",
			"value": "53495",
		}, {
			"label": "禹会区",
			"value": "53496",
		}]
	}, {
		"label": "马鞍山市",
		"value": "1137",
		"children": [{
			"label": "当涂县",
			"value": "1138",
		}, {
			"label": "含山县",
			"value": "1187",
		}, {
			"label": "和县",
			"value": "1188",
		}, {
			"label": "博望区",
			"value": "6963",
		}, {
			"label": "花山区",
			"value": "53497",
		}, {
			"label": "雨山区",
			"value": "53498",
		}]
	}, {
		"label": "安庆市",
		"value": "1140",
		"children": [{
			"label": "桐城市",
			"value": "1141",
		}, {
			"label": "宿松县",
			"value": "1142",
		}, {
			"label": "枞阳县",
			"value": "1143",
		}, {
			"label": "太湖县",
			"value": "1144",
		}, {
			"label": "怀宁县",
			"value": "1145",
		}, {
			"label": "岳西县",
			"value": "1146",
		}, {
			"label": "望江县",
			"value": "1147",
		}, {
			"label": "潜山县",
			"value": "1148",
		}, {
			"label": "大观区",
			"value": "4075",
		}, {
			"label": "宜秀区",
			"value": "53499",
		}, {
			"label": "迎江区",
			"value": "53500",
		}]
	}, {
		"label": "黄山市",
		"value": "1151",
		"children": [{
			"label": "休宁县",
			"value": "1153",
		}, {
			"label": "歙县",
			"value": "1154",
		}, {
			"label": "黟县",
			"value": "1155",
		}, {
			"label": "祁门县",
			"value": "1156",
		}, {
			"label": "黄山区",
			"value": "3464",
		}, {
			"label": "徽州区",
			"value": "53501",
		}, {
			"label": "屯溪区",
			"value": "53502",
		}]
	}, {
		"label": "滁州市",
		"value": "1159",
		"children": [{
			"label": "明光市",
			"value": "1161",
		}, {
			"label": "全椒县",
			"value": "1162",
		}, {
			"label": "来安县",
			"value": "1163",
		}, {
			"label": "定远县",
			"value": "1164",
		}, {
			"label": "凤阳县",
			"value": "1165",
		}, {
			"label": "南谯区",
			"value": "3467",
		}, {
			"label": "琅琊区",
			"value": "53503",
		}, {
			"label": "天长市",
			"value": "53504",
		}]
	}, {
		"label": "阜阳市",
		"value": "1167",
		"children": [{
			"label": "界首市",
			"value": "1168",
		}, {
			"label": "太和县",
			"value": "1169",
		}, {
			"label": "阜南县",
			"value": "1170",
		}, {
			"label": "颍上县",
			"value": "1171",
		}, {
			"label": "临泉县",
			"value": "1172",
		}, {
			"label": "经济开发区",
			"value": "4832",
		}, {
			"label": "颍泉区",
			"value": "53505",
		}, {
			"label": "颍州区",
			"value": "53506",
		}, {
			"label": "颍东区",
			"value": "53507",
		}]
	}, {
		"label": "亳州市",
		"value": "1174",
		"children": [{
			"label": "利辛县",
			"value": "1176",
		}, {
			"label": "蒙城县",
			"value": "1177",
		}, {
			"label": "涡阳县",
			"value": "1178",
		}, {
			"label": "谯城区",
			"value": "53508",
		}]
	}, {
		"label": "宿州市",
		"value": "1180",
		"children": [{
			"label": "灵璧县",
			"value": "1181",
		}, {
			"label": "泗县",
			"value": "1182",
		}, {
			"label": "萧县",
			"value": "1183",
		}, {
			"label": "砀山县",
			"value": "1184",
		}, {
			"label": "经济开发区",
			"value": "6006",
		}, {
			"label": "埇桥区",
			"value": "53509",
		}]
	}, {
		"label": "池州市",
		"value": "1201",
		"children": [{
			"label": "东至县",
			"value": "1202",
		}, {
			"label": "石台县",
			"value": "1203",
		}, {
			"label": "青阳县",
			"value": "1204",
		}, {
			"label": "贵池区",
			"value": "53510",
		}]
	}, {
		"label": "六安市",
		"value": "1206",
		"children": [{
			"label": "寿县",
			"value": "1207",
		}, {
			"label": "霍山县",
			"value": "1208",
		}, {
			"label": "金寨县",
			"value": "1209",
		}, {
			"label": "霍邱县",
			"value": "1210",
		}, {
			"label": "舒城县",
			"value": "1211",
		}, {
			"label": "金安区",
			"value": "53511",
		}, {
			"label": "裕安区",
			"value": "53512",
		}, {
			"label": "叶集区",
			"value": "53513",
		}]
	}, {
		"label": "宣城市",
		"value": "2971",
		"children": [{
			"label": "泾县",
			"value": "2972",
		}, {
			"label": "旌德县",
			"value": "3128",
		}, {
			"label": "宁国市",
			"value": "3147",
		}, {
			"label": "郎溪县",
			"value": "3477",
		}, {
			"label": "广德县",
			"value": "3478",
		}, {
			"label": "绩溪县",
			"value": "3479",
		}, {
			"label": "宣州区",
			"value": "53514",
		}]
	}]
}, {
	"label": "浙江",
	"value": "15",
	"children": [{
		"label": "宁波市",
		"value": "1158",
		"children": [{
			"label": "慈溪市",
			"value": "1224",
		}, {
			"label": "奉化市",
			"value": "1226",
		}, {
			"label": "宁海县",
			"value": "1227",
		}, {
			"label": "象山县",
			"value": "1228",
		}, {
			"label": "海曙区",
			"value": "3412",
		}, {
			"label": "江东区",
			"value": "3413",
		}, {
			"label": "高新科技开发区",
			"value": "4253",
		}, {
			"label": "北仑区",
			"value": "53108",
		}, {
			"label": "镇海区",
			"value": "53109",
		}, {
			"label": "鄞州区",
			"value": "53110",
		}, {
			"label": "江北区",
			"value": "53111",
		}, {
			"label": "余姚市",
			"value": "53112",
		}]
	}, {
		"label": "杭州市",
		"value": "1213",
		"children": [{
			"label": "余杭区",
			"value": "1214",
		}, {
			"label": "萧山区",
			"value": "1215",
		}, {
			"label": "富阳市",
			"value": "1217",
		}, {
			"label": "桐庐县",
			"value": "1218",
		}, {
			"label": "建德市",
			"value": "1219",
		}, {
			"label": "淳安县",
			"value": "1220",
		}, {
			"label": "江干区",
			"value": "2963",
		}, {
			"label": "滨江区",
			"value": "3038",
		}, {
			"label": "上城区",
			"value": "3408",
		}, {
			"label": "下城区",
			"value": "3409",
		}, {
			"label": "拱墅区",
			"value": "3410",
		}, {
			"label": "西湖区",
			"value": "3411",
		}, {
			"label": "下沙区",
			"value": "4285",
		}, {
			"label": "临安市",
			"value": "53113",
		}]
	}, {
		"label": "温州市",
		"value": "1233",
		"children": [{
			"label": "文成县",
			"value": "1237",
		}, {
			"label": "平阳县",
			"value": "1238",
		}, {
			"label": "泰顺县",
			"value": "1239",
		}, {
			"label": "洞头县",
			"value": "1240",
		}, {
			"label": "苍南县",
			"value": "1241",
		}, {
			"label": "龙湾区",
			"value": "3416",
		}, {
			"label": "茶山高教园区",
			"value": "4342",
		}, {
			"label": "瑞安市",
			"value": "53114",
		}, {
			"label": "乐青市",
			"value": "53115",
		}, {
			"label": "鹿城区",
			"value": "53116",
		}, {
			"label": "瓯海区",
			"value": "53117",
		}, {
			"label": "永嘉县",
			"value": "53118",
		}]
	}, {
		"label": "嘉兴市",
		"value": "1243",
		"children": [{
			"label": "海宁市",
			"value": "1244",
		}, {
			"label": "海盐县",
			"value": "1248",
		}, {
			"label": "南湖区",
			"value": "3418",
		}, {
			"label": "秀洲区",
			"value": "3419",
		}, {
			"label": "桐乡市",
			"value": "4429",
		}, {
			"label": "平湖市",
			"value": "4430",
		}, {
			"label": "嘉善县",
			"value": "4431",
		}]
	}, {
		"label": "湖州市",
		"value": "1250",
		"children": [{
			"label": "长兴县",
			"value": "1251",
		}, {
			"label": "德清县",
			"value": "1252",
		}, {
			"label": "安吉县",
			"value": "1253",
		}, {
			"label": "南浔区",
			"value": "4130",
		}, {
			"label": "吴兴区",
			"value": "53119",
		}]
	}, {
		"label": "绍兴市",
		"value": "1255",
		"children": [{
			"label": "诸暨市",
			"value": "1257",
		}, {
			"label": "上虞区",
			"value": "1258",
		}, {
			"label": "嵊州市",
			"value": "1259",
		}, {
			"label": "新昌县",
			"value": "1260",
		}, {
			"label": "柯桥区",
			"value": "53120",
		}, {
			"label": "越城区",
			"value": "53121",
		}]
	}, {
		"label": "金华市",
		"value": "1262",
		"children": [{
			"label": "金东区",
			"value": "1263",
			"children": [{
				"label": "孝顺镇",
				"value": "8307",
				"children": []
			}, {
				"label": "赤松镇",
				"value": "8308",
				"children": []
			}, {
				"label": "曹宅镇",
				"value": "8309",
				"children": []
			}, {
				"label": "傅村镇",
				"value": "8310",
				"children": []
			}, {
				"label": "岭下镇",
				"value": "8311",
				"children": []
			}, {
				"label": "源东乡",
				"value": "8312",
				"children": []
			}, {
				"label": "东孝街道",
				"value": "8313",
				"children": []
			}, {
				"label": "塘雅镇",
				"value": "8314",
				"children": []
			}, {
				"label": "江东镇",
				"value": "8315",
				"children": []
			}, {
				"label": "澧浦镇",
				"value": "8316",
				"children": []
			}, {
				"label": "多湖街道",
				"value": "8317",
				"children": []
			}]
		}, {
			"label": "兰溪市",
			"value": "1264",
			"children": [{
				"label": "女埠街道",
				"value": "8264",
				"children": []
			}, {
				"label": "马涧镇",
				"value": "8265",
				"children": []
			}, {
				"label": "水亭畲族乡",
				"value": "8266",
				"children": []
			}, {
				"label": "赤溪街道",
				"value": "8267",
				"children": []
			}, {
				"label": "灵洞乡",
				"value": "8268",
				"children": []
			}, {
				"label": "黄店镇",
				"value": "8269",
				"children": []
			}, {
				"label": "横溪镇",
				"value": "8270",
				"children": []
			}, {
				"label": "诸葛镇",
				"value": "8271",
				"children": []
			}, {
				"label": "香溪镇",
				"value": "8272",
				"children": []
			}, {
				"label": "云山街道",
				"value": "8273",
				"children": []
			}, {
				"label": "兰江街道",
				"value": "8274",
				"children": []
			}, {
				"label": "柏社乡",
				"value": "8275",
				"children": []
			}, {
				"label": "梅江镇",
				"value": "8276",
				"children": []
			}, {
				"label": "上华街道",
				"value": "8277",
				"children": []
			}, {
				"label": "游埠镇",
				"value": "8278",
				"children": []
			}, {
				"label": "永昌街道",
				"value": "8279",
				"children": []
			}]
		}, {
			"label": "婺城区",
			"value": "1265",
			"children": [{
				"label": "安地镇",
				"value": "8280",
				"children": []
			}, {
				"label": "琅琊镇",
				"value": "8281",
				"children": []
			}, {
				"label": "竹马乡",
				"value": "8282",
				"children": []
			}, {
				"label": "新狮街道",
				"value": "8283",
				"children": []
			}, {
				"label": "江南街道",
				"value": "8284",
				"children": []
			}, {
				"label": "沙畈乡",
				"value": "8285",
				"children": []
			}, {
				"label": "城东街道",
				"value": "8286",
				"children": []
			}, {
				"label": "苏孟乡",
				"value": "8287",
				"children": []
			}, {
				"label": "汤溪镇",
				"value": "8288",
				"children": []
			}, {
				"label": "雅畈镇",
				"value": "8289",
				"children": []
			}, {
				"label": "洋埠镇",
				"value": "8290",
				"children": []
			}, {
				"label": "白龙桥镇",
				"value": "8291",
				"children": []
			}, {
				"label": "城中街道",
				"value": "8292",
				"children": []
			}, {
				"label": "箬阳乡",
				"value": "8293",
				"children": []
			}, {
				"label": "城西街道",
				"value": "8294",
				"children": []
			}, {
				"label": "长山乡",
				"value": "8295",
				"children": []
			}, {
				"label": "蒋堂镇",
				"value": "8296",
				"children": []
			}, {
				"label": "罗店镇",
				"value": "8297",
				"children": []
			}, {
				"label": "西关街道",
				"value": "8298",
				"children": []
			}, {
				"label": "城北街道",
				"value": "8299",
				"children": []
			}, {
				"label": "莘畈乡",
				"value": "8300",
				"children": []
			}, {
				"label": "乾西乡",
				"value": "8301",
				"children": []
			}, {
				"label": "塔石乡",
				"value": "8302",
				"children": []
			}, {
				"label": "罗埠镇",
				"value": "8303",
				"children": []
			}, {
				"label": "秋滨街道",
				"value": "8304",
				"children": []
			}, {
				"label": "岭上乡",
				"value": "8305",
				"children": []
			}, {
				"label": "三江街道",
				"value": "8306",
				"children": []
			}]
		}, {
			"label": "义乌市",
			"value": "1266",
			"children": [{
				"label": "城西街道",
				"value": "8372",
				"children": []
			}, {
				"label": "北苑街道",
				"value": "8373",
				"children": []
			}, {
				"label": "廿三里街道",
				"value": "8374",
				"children": []
			}, {
				"label": "稠城街道",
				"value": "8375",
				"children": []
			}, {
				"label": "上溪镇",
				"value": "8376",
				"children": []
			}, {
				"label": "苏溪镇",
				"value": "8377",
				"children": []
			}, {
				"label": "江东街道",
				"value": "8378",
				"children": []
			}, {
				"label": "佛堂镇",
				"value": "8379",
				"children": []
			}, {
				"label": "后宅街道",
				"value": "8380",
				"children": []
			}, {
				"label": "义亭镇",
				"value": "8381",
				"children": []
			}, {
				"label": "大陈镇",
				"value": "8382",
				"children": []
			}, {
				"label": "赤岸镇",
				"value": "8383",
				"children": []
			}, {
				"label": "稠江街道",
				"value": "8384",
				"children": []
			}]
		}, {
			"label": "东阳市",
			"value": "1267",
			"children": [{
				"label": "湖溪镇",
				"value": "8385",
				"children": []
			}, {
				"label": "三单乡",
				"value": "8386",
				"children": []
			}, {
				"label": "吴宁街道",
				"value": "8387",
				"children": []
			}, {
				"label": "城东街道",
				"value": "8388",
				"children": []
			}, {
				"label": "白云街道",
				"value": "8389",
				"children": []
			}, {
				"label": "东阳江镇",
				"value": "8390",
				"children": []
			}, {
				"label": "横店镇",
				"value": "8391",
				"children": []
			}, {
				"label": "南市街道",
				"value": "8392",
				"children": []
			}, {
				"label": "虎鹿镇",
				"value": "8393",
				"children": []
			}, {
				"label": "马宅镇",
				"value": "8394",
				"children": []
			}, {
				"label": "歌山镇",
				"value": "8395",
				"children": []
			}, {
				"label": "画水镇",
				"value": "8396",
				"children": []
			}, {
				"label": "佐村镇",
				"value": "8397",
				"children": []
			}, {
				"label": "南马镇",
				"value": "8398",
				"children": []
			}, {
				"label": "千祥镇",
				"value": "8399",
				"children": []
			}, {
				"label": "六石街道",
				"value": "8400",
				"children": []
			}, {
				"label": "江北街道",
				"value": "8401",
				"children": []
			}, {
				"label": "巍山镇",
				"value": "8402",
				"children": []
			}]
		}, {
			"label": "永康市",
			"value": "1268",
			"children": [{
				"label": "花街镇",
				"value": "8403",
				"children": []
			}, {
				"label": "芝英镇",
				"value": "8404",
				"children": []
			}, {
				"label": "江南街道",
				"value": "8405",
				"children": []
			}, {
				"label": "前仓镇",
				"value": "8406",
				"children": []
			}, {
				"label": "龙山镇",
				"value": "8407",
				"children": []
			}, {
				"label": "西城街道",
				"value": "8408",
				"children": []
			}, {
				"label": "舟山镇",
				"value": "8409",
				"children": []
			}, {
				"label": "方岩镇",
				"value": "8410",
				"children": []
			}, {
				"label": "东城街道",
				"value": "8411",
				"children": []
			}, {
				"label": "桥下镇",
				"value": "8412",
				"children": []
			}, {
				"label": "古山镇",
				"value": "8413",
				"children": []
			}, {
				"label": "西溪镇",
				"value": "8414",
				"children": []
			}, {
				"label": "八字墙乡",
				"value": "8415",
				"children": []
			}, {
				"label": "清溪镇",
				"value": "8416",
				"children": []
			}, {
				"label": "石柱镇",
				"value": "8417",
				"children": []
			}, {
				"label": "唐先镇",
				"value": "8418",
				"children": []
			}, {
				"label": "象珠镇",
				"value": "8419",
				"children": []
			}]
		}, {
			"label": "武义县",
			"value": "1269",
			"children": [{
				"label": "三港乡",
				"value": "8318",
				"children": []
			}, {
				"label": "桃溪镇",
				"value": "8319",
				"children": []
			}, {
				"label": "履坦镇",
				"value": "8320",
				"children": []
			}, {
				"label": "壶山街道",
				"value": "8321",
				"children": []
			}, {
				"label": "熟溪街道",
				"value": "8322",
				"children": []
			}, {
				"label": "新宅镇",
				"value": "8323",
				"children": []
			}, {
				"label": "大溪口乡",
				"value": "8324",
				"children": []
			}, {
				"label": "坦洪乡",
				"value": "8325",
				"children": []
			}, {
				"label": "大田乡",
				"value": "8326",
				"children": []
			}, {
				"label": "桐琴镇",
				"value": "8327",
				"children": []
			}, {
				"label": "白洋街道",
				"value": "8328",
				"children": []
			}, {
				"label": "王宅镇",
				"value": "8329",
				"children": []
			}, {
				"label": "泉溪镇",
				"value": "8330",
				"children": []
			}, {
				"label": "西联乡",
				"value": "8331",
				"children": []
			}, {
				"label": "茭道镇",
				"value": "8332",
				"children": []
			}, {
				"label": "俞源乡",
				"value": "8333",
				"children": []
			}, {
				"label": "柳城畲族镇",
				"value": "8334",
				"children": []
			}, {
				"label": "白姆乡",
				"value": "8335",
				"children": []
			}]
		}, {
			"label": "浦江县",
			"value": "1270",
			"children": [{
				"label": "仙华街道",
				"value": "8336",
				"children": []
			}, {
				"label": "花桥乡",
				"value": "8337",
				"children": []
			}, {
				"label": "浦南街道",
				"value": "8338",
				"children": []
			}, {
				"label": "中余乡",
				"value": "8339",
				"children": []
			}, {
				"label": "郑家坞镇",
				"value": "8340",
				"children": []
			}, {
				"label": "岩头镇",
				"value": "8341",
				"children": []
			}, {
				"label": "治平乡",
				"value": "8342",
				"children": []
			}, {
				"label": "白马镇",
				"value": "8343",
				"children": []
			}, {
				"label": "郑宅镇",
				"value": "8344",
				"children": []
			}, {
				"label": "大畈乡",
				"value": "8345",
				"children": []
			}, {
				"label": "虞宅乡",
				"value": "8346",
				"children": []
			}, {
				"label": "浦阳街道",
				"value": "8347",
				"children": []
			}, {
				"label": "杭坪镇",
				"value": "8348",
				"children": []
			}, {
				"label": "前吴乡",
				"value": "8349",
				"children": []
			}, {
				"label": "黄宅镇",
				"value": "8350",
				"children": []
			}, {
				"label": "檀溪镇",
				"value": "8351",
				"children": []
			}, {
				"label": "潘宅镇",
				"value": "8352",
				"children": []
			}]
		}, {
			"label": "磐安县",
			"value": "1271",
			"children": [{
				"label": "胡宅乡",
				"value": "8353",
				"children": []
			}, {
				"label": "玉山镇",
				"value": "8354",
				"children": []
			}, {
				"label": "方前镇",
				"value": "8355",
				"children": []
			}, {
				"label": "双溪乡",
				"value": "8356",
				"children": []
			}, {
				"label": "窈川乡",
				"value": "8357",
				"children": []
			}, {
				"label": "仁川镇",
				"value": "8358",
				"children": []
			}, {
				"label": "万苍乡",
				"value": "8359",
				"children": []
			}, {
				"label": "尚湖镇",
				"value": "8360",
				"children": []
			}, {
				"label": "双峰乡",
				"value": "8361",
				"children": []
			}, {
				"label": "大盘镇",
				"value": "8362",
				"children": []
			}, {
				"label": "高二乡",
				"value": "8363",
				"children": []
			}, {
				"label": "安文镇",
				"value": "8364",
				"children": []
			}, {
				"label": "深泽乡",
				"value": "8365",
				"children": []
			}, {
				"label": "九和乡",
				"value": "8366",
				"children": []
			}, {
				"label": "维新乡",
				"value": "8367",
				"children": []
			}, {
				"label": "新渥镇",
				"value": "8368",
				"children": []
			}, {
				"label": "尖山镇",
				"value": "8369",
				"children": []
			}, {
				"label": "冷水镇",
				"value": "8370",
				"children": []
			}, {
				"label": "盘峰乡",
				"value": "8371",
				"children": []
			}]
		}]
	}, {
		"label": "衢州市",
		"value": "1273",
		"children": [{
			"label": "江山市",
			"value": "1275",
		}, {
			"label": "常山县",
			"value": "1276",
		}, {
			"label": "开化县",
			"value": "1277",
		}, {
			"label": "龙游县",
			"value": "1278",
		}, {
			"label": "柯城区",
			"value": "53122",
		}, {
			"label": "衢江区",
			"value": "53123",
		}]
	}, {
		"label": "丽水市",
		"value": "1280",
		"children": [{
			"label": "龙泉市",
			"value": "1281",
		}, {
			"label": "缙云县",
			"value": "1282",
		}, {
			"label": "遂昌县",
			"value": "1283",
		}, {
			"label": "松阳县",
			"value": "1284",
		}, {
			"label": "景宁县",
			"value": "1285",
		}, {
			"label": "云和县",
			"value": "1286",
		}, {
			"label": "青田县",
			"value": "1288",
		}, {
			"label": "庆元县",
			"value": "3045",
		}, {
			"label": "莲都区",
			"value": "53124",
		}]
	}, {
		"label": "台州市",
		"value": "1290",
		"children": [{
			"label": "临海市",
			"value": "1291",
		}, {
			"label": "三门县",
			"value": "1294",
		}, {
			"label": "天台县",
			"value": "1295",
		}, {
			"label": "仙居县",
			"value": "1296",
		}, {
			"label": "黄岩区",
			"value": "53125",
		}, {
			"label": "椒江区",
			"value": "53126",
		}, {
			"label": "路桥区",
			"value": "53127",
		}, {
			"label": "温岭区",
			"value": "53128",
		}, {
			"label": "玉环县",
			"value": "53129",
		}]
	}, {
		"label": "舟山市",
		"value": "1298",
		"children": [{
			"label": "岱山县",
			"value": "1300",
		}, {
			"label": "嵊泗县",
			"value": "1301",
		}, {
			"label": "普陀区",
			"value": "53131",
		}, {
			"label": "定海区",
			"value": "53132",
		}]
	}]
}, {
	"label": "福建",
	"value": "16",
	"children": [{
		"label": "福州市",
		"value": "1303",
		"children": [{
			"label": "长乐市",
			"value": "1305",
		}, {
			"label": "平潭县",
			"value": "1308",
		}, {
			"label": "连江县",
			"value": "1309",
		}, {
			"label": "罗源县",
			"value": "1312",
		}, {
			"label": "永泰县",
			"value": "1313",
		}, {
			"label": "闽清县",
			"value": "1314",
		}, {
			"label": "台江区",
			"value": "3483",
		}, {
			"label": "鼓楼区",
			"value": "3484",
		}, {
			"label": "晋安区",
			"value": "53133",
		}, {
			"label": "仓山区",
			"value": "53134",
		}, {
			"label": "马尾区",
			"value": "53135",
		}, {
			"label": "福清市",
			"value": "53136",
		}, {
			"label": "闽侯县",
			"value": "53137",
		}]
	}, {
		"label": "厦门市",
		"value": "1315",
		"children": [{
			"label": "思明区",
			"value": "1316",
		}, {
			"label": "湖里区",
			"value": "3486",
		}, {
			"label": "翔安区",
			"value": "3489",
		}, {
			"label": "海沧区",
			"value": "53138",
		}, {
			"label": "集美区",
			"value": "53139",
		}, {
			"label": "同安区",
			"value": "53140",
		}]
	}, {
		"label": "三明市",
		"value": "1317",
		"children": [{
			"label": "永安市",
			"value": "1319",
		}, {
			"label": "明溪县",
			"value": "1320",
		}, {
			"label": "将乐县",
			"value": "1321",
		}, {
			"label": "大田县",
			"value": "1322",
		}, {
			"label": "宁化县",
			"value": "1323",
		}, {
			"label": "建宁县",
			"value": "1324",
		}, {
			"label": "沙县",
			"value": "1325",
		}, {
			"label": "尤溪县",
			"value": "1326",
		}, {
			"label": "清流县",
			"value": "1327",
		}, {
			"label": "泰宁县",
			"value": "1328",
		}, {
			"label": "梅列区",
			"value": "53141",
		}, {
			"label": "三元区",
			"value": "53142",
		}]
	}, {
		"label": "莆田市",
		"value": "1329",
		"children": [{
			"label": "仙游县",
			"value": "1331",
		}, {
			"label": "涵江区",
			"value": "3022",
		}, {
			"label": "秀屿区",
			"value": "3492",
		}, {
			"label": "城厢区",
			"value": "53143",
		}, {
			"label": "荔城区",
			"value": "53144",
		}]
	}, {
		"label": "泉州市",
		"value": "1332",
		"children": [{
			"label": "石狮市",
			"value": "1334",
		}, {
			"label": "南安市",
			"value": "1336",
		}, {
			"label": "惠安县",
			"value": "1337",
		}, {
			"label": "安溪县",
			"value": "1338",
		}, {
			"label": "德化县",
			"value": "1339",
		}, {
			"label": "永春县",
			"value": "1340",
		}, {
			"label": "泉港区",
			"value": "3117",
		}, {
			"label": "金门县",
			"value": "3495",
		}, {
			"label": "洛江区",
			"value": "3498",
		}, {
			"label": "鲤城区",
			"value": "53145",
		}, {
			"label": "丰泽区",
			"value": "53146",
		}, {
			"label": "晋江区",
			"value": "53147",
		}]
	}, {
		"label": "漳州市",
		"value": "1341",
		"children": [{
			"label": "龙海市",
			"value": "1343",
		}, {
			"label": "平和县",
			"value": "1344",
		}, {
			"label": "南靖县",
			"value": "1345",
		}, {
			"label": "诏安县",
			"value": "1346",
		}, {
			"label": "漳浦县",
			"value": "1347",
		}, {
			"label": "华安县",
			"value": "1348",
		}, {
			"label": "云霄县",
			"value": "1349",
		}, {
			"label": "东山县",
			"value": "1350",
		}, {
			"label": "长泰县",
			"value": "1351",
		}, {
			"label": "芗城区",
			"value": "3499",
		}, {
			"label": "龙文区",
			"value": "3500",
		}]
	}, {
		"label": "南平市",
		"value": "1352",
		"children": [{
			"label": "建瓯市",
			"value": "1354",
		}, {
			"label": "邵武市",
			"value": "1355",
		}, {
			"label": "武夷山市",
			"value": "1356",
		}, {
			"label": "建阳市",
			"value": "1357",
		}, {
			"label": "松溪县",
			"value": "1358",
		}, {
			"label": "顺昌县",
			"value": "1359",
		}, {
			"label": "浦城县",
			"value": "1360",
		}, {
			"label": "政和县",
			"value": "1361",
		}, {
			"label": "光泽县",
			"value": "2956",
		}, {
			"label": "延平区",
			"value": "53148",
		}]
	}, {
		"label": "龙岩市",
		"value": "1362",
		"children": [{
			"label": "漳平市",
			"value": "1364",
		}, {
			"label": "长汀县",
			"value": "1365",
		}, {
			"label": "武平县",
			"value": "1366",
		}, {
			"label": "永定县",
			"value": "1367",
		}, {
			"label": "上杭县",
			"value": "1368",
		}, {
			"label": "连城县",
			"value": "1369",
		}, {
			"label": "新罗区",
			"value": "53149",
		}]
	}, {
		"label": "宁德市",
		"value": "1370",
		"children": [{
			"label": "福安市",
			"value": "1372",
		}, {
			"label": "福鼎市",
			"value": "1373",
		}, {
			"label": "寿宁县",
			"value": "1374",
		}, {
			"label": "霞浦县",
			"value": "1375",
		}, {
			"label": "柘荣县",
			"value": "1376",
		}, {
			"label": "屏南县",
			"value": "1377",
		}, {
			"label": "古田县",
			"value": "1378",
		}, {
			"label": "周宁县",
			"value": "1379",
		}, {
			"label": "蕉城区",
			"value": "53150",
		}, {
			"label": "东侨开发区",
			"value": "53151",
		}]
	}]
}, {
	"label": "湖北",
	"value": "17",
	"children": [{
		"label": "武汉市",
		"value": "1381",
		"children": [{
			"label": "江岸区",
			"value": "1386",
		}, {
			"label": "武昌区",
			"value": "3079",
		}, {
			"label": "江汉区",
			"value": "3582",
		}, {
			"label": "硚口区",
			"value": "3583",
		}, {
			"label": "武汉经济技术开发区",
			"value": "4424",
		}, {
			"label": "蔡甸区",
			"value": "53566",
		}, {
			"label": "江夏区",
			"value": "53567",
		}, {
			"label": "新洲区",
			"value": "53568",
		}, {
			"label": "黄陂区",
			"value": "53569",
		}, {
			"label": "汉阳区",
			"value": "53570",
		}, {
			"label": "青山区",
			"value": "53571",
		}, {
			"label": "洪山区",
			"value": "53572",
		}, {
			"label": "汉南区",
			"value": "53573",
		}, {
			"label": "东西湖区",
			"value": "53574",
		}]
	}, {
		"label": "黄石市",
		"value": "1387",
		"children": [{
			"label": "黄石港区",
			"value": "1389",
		}, {
			"label": "铁山区",
			"value": "1392",
		}, {
			"label": "大冶市",
			"value": "1393",
		}, {
			"label": "阳新县",
			"value": "1394",
		}, {
			"label": "下陆区",
			"value": "53575",
		}, {
			"label": "西塞山区",
			"value": "53576",
		}, {
			"label": "经济技术开发区",
			"value": "53577",
		}]
	}, {
		"label": "襄阳市",
		"value": "1396",
		"children": [{
			"label": "老河口市",
			"value": "1397",
		}, {
			"label": "枣阳市",
			"value": "1398",
		}, {
			"label": "宜城市",
			"value": "1399",
		}, {
			"label": "南漳县",
			"value": "1401",
		}, {
			"label": "保康县",
			"value": "1402",
		}, {
			"label": "谷城县",
			"value": "1403",
		}, {
			"label": "樊城区",
			"value": "53578",
		}, {
			"label": "襄城区",
			"value": "53579",
		}, {
			"label": "襄州区",
			"value": "53580",
		}]
	}, {
		"label": "十堰市",
		"value": "1405",
		"children": [{
			"label": "丹江口市",
			"value": "1406",
		}, {
			"label": "房县",
			"value": "1407",
		}, {
			"label": "竹山县",
			"value": "1408",
		}, {
			"label": "竹溪县",
			"value": "1409",
		}, {
			"label": "郧县",
			"value": "1410",
		}, {
			"label": "郧西县",
			"value": "1411",
		}, {
			"label": "茅箭区",
			"value": "53581",
		}, {
			"label": "张湾区",
			"value": "53582",
		}]
	}, {
		"label": "荆州市",
		"value": "1413",
		"children": [{
			"label": "江陵县",
			"value": "1414",
			"children": [{
				"label": "资市镇",
				"value": "7632",
				"children": []
			}, {
				"label": "滩桥镇",
				"value": "7633",
				"children": []
			}, {
				"label": "熊河镇",
				"value": "7634",
				"children": []
			}, {
				"label": "白马寺镇",
				"value": "7635",
				"children": []
			}, {
				"label": "沙岗镇",
				"value": "7636",
				"children": []
			}, {
				"label": "普济镇",
				"value": "7637",
				"children": []
			}, {
				"label": "郝穴镇",
				"value": "7638",
				"children": []
			}, {
				"label": "马家寨乡",
				"value": "7639",
				"children": []
			}, {
				"label": "秦市乡",
				"value": "7640",
				"children": []
			}, {
				"label": "江北监狱",
				"value": "7641",
				"children": []
			}, {
				"label": "江陵县工业园区",
				"value": "7642",
				"children": []
			}, {
				"label": "三湖管理区",
				"value": "7643",
				"children": []
			}, {
				"label": "六合垸管理区",
				"value": "7644",
				"children": []
			}]
		}, {
			"label": "洪湖市",
			"value": "1415",
			"children": [{
				"label": "新堤街道",
				"value": "7589",
				"children": []
			}, {
				"label": "滨湖街道",
				"value": "7590",
				"children": []
			}, {
				"label": "螺山镇",
				"value": "7591",
				"children": []
			}, {
				"label": "乌林镇",
				"value": "7592",
				"children": []
			}, {
				"label": "龙口镇",
				"value": "7593",
				"children": []
			}, {
				"label": "燕窝镇",
				"value": "7594",
				"children": []
			}, {
				"label": "新滩镇",
				"value": "7595",
				"children": []
			}, {
				"label": "峰口镇",
				"value": "7596",
				"children": []
			}, {
				"label": "曹市镇",
				"value": "7597",
				"children": []
			}, {
				"label": "府场镇",
				"value": "7598",
				"children": []
			}, {
				"label": "戴家场镇",
				"value": "7599",
				"children": []
			}, {
				"label": "瞿家湾镇",
				"value": "7600",
				"children": []
			}, {
				"label": "沙口镇",
				"value": "7601",
				"children": []
			}, {
				"label": "万全镇",
				"value": "7602",
				"children": []
			}, {
				"label": "汊河镇",
				"value": "7603",
				"children": []
			}, {
				"label": "黄家口镇",
				"value": "7604",
				"children": []
			}, {
				"label": "老湾乡",
				"value": "7605",
				"children": []
			}, {
				"label": "小港管理区",
				"value": "7606",
				"children": []
			}, {
				"label": "大同湖管理区",
				"value": "7607",
				"children": []
			}, {
				"label": "大沙湖管理区",
				"value": "7608",
				"children": []
			}]
		}, {
			"label": "石首市",
			"value": "1416",
			"children": [{
				"label": "绣林街道",
				"value": "7670",
				"children": []
			}, {
				"label": "笔架山街道",
				"value": "7671",
				"children": []
			}, {
				"label": "新厂镇",
				"value": "7672",
				"children": []
			}, {
				"label": "横沟市镇",
				"value": "7673",
				"children": []
			}, {
				"label": "大垸镇",
				"value": "7674",
				"children": []
			}, {
				"label": "小河口镇",
				"value": "7675",
				"children": []
			}, {
				"label": "桃花山镇",
				"value": "7676",
				"children": []
			}, {
				"label": "调关镇",
				"value": "7677",
				"children": []
			}, {
				"label": "东升镇",
				"value": "7678",
				"children": []
			}, {
				"label": "高基庙镇",
				"value": "7679",
				"children": []
			}, {
				"label": "南口镇",
				"value": "7680",
				"children": []
			}, {
				"label": "高陵镇",
				"value": "7681",
				"children": []
			}, {
				"label": "团山寺镇",
				"value": "7682",
				"children": []
			}, {
				"label": "久合垸乡",
				"value": "7683",
				"children": []
			}, {
				"label": "天鹅洲开发区",
				"value": "7684",
				"children": []
			}]
		}, {
			"label": "松滋市",
			"value": "1417",
			"children": [{
				"label": "新江口镇",
				"value": "7685",
				"children": []
			}, {
				"label": "南海镇",
				"value": "7686",
				"children": []
			}, {
				"label": "八宝镇",
				"value": "7687",
				"children": []
			}, {
				"label": "宛市镇",
				"value": "7688",
				"children": []
			}, {
				"label": "老城镇",
				"value": "7689",
				"children": []
			}, {
				"label": "陈店镇",
				"value": "7690",
				"children": []
			}, {
				"label": "王家桥镇",
				"value": "7691",
				"children": []
			}, {
				"label": "斯家场镇",
				"value": "7692",
				"children": []
			}, {
				"label": "杨林市镇",
				"value": "7693",
				"children": []
			}, {
				"label": "纸厂河镇",
				"value": "7694",
				"children": []
			}, {
				"label": "街河市镇",
				"value": "7695",
				"children": []
			}, {
				"label": "危水镇",
				"value": "7696",
				"children": []
			}, {
				"label": "刘家场镇",
				"value": "7697",
				"children": []
			}, {
				"label": "沙道观镇",
				"value": "7698",
				"children": []
			}, {
				"label": "万家乡",
				"value": "7699",
				"children": []
			}, {
				"label": "卸甲坪土家族乡",
				"value": "7700",
				"children": []
			}]
		}, {
			"label": "监利县",
			"value": "1418",
			"children": [{
				"label": "容城镇",
				"value": "7609",
				"children": []
			}, {
				"label": "朱河镇",
				"value": "7610",
				"children": []
			}, {
				"label": "新沟镇",
				"value": "7611",
				"children": []
			}, {
				"label": "龚场镇",
				"value": "7612",
				"children": []
			}, {
				"label": "周老嘴镇",
				"value": "7613",
				"children": []
			}, {
				"label": "黄歇口镇",
				"value": "7614",
				"children": []
			}, {
				"label": "汪桥镇",
				"value": "7615",
				"children": []
			}, {
				"label": "程集镇",
				"value": "7616",
				"children": []
			}, {
				"label": "分盐镇",
				"value": "7617",
				"children": []
			}, {
				"label": "毛市镇",
				"value": "7618",
				"children": []
			}, {
				"label": "福田寺镇",
				"value": "7619",
				"children": []
			}, {
				"label": "上车湾镇",
				"value": "7620",
				"children": []
			}, {
				"label": "汴河镇",
				"value": "7621",
				"children": []
			}, {
				"label": "尺八镇",
				"value": "7622",
				"children": []
			}, {
				"label": "白螺镇",
				"value": "7623",
				"children": []
			}, {
				"label": "网市镇",
				"value": "7624",
				"children": []
			}, {
				"label": "三洲镇",
				"value": "7625",
				"children": []
			}, {
				"label": "桥市镇",
				"value": "7626",
				"children": []
			}, {
				"label": "红城乡",
				"value": "7627",
				"children": []
			}, {
				"label": "棋盘乡",
				"value": "7628",
				"children": []
			}, {
				"label": "柘木乡",
				"value": "7629",
				"children": []
			}, {
				"label": "人民大垸农场管理区",
				"value": "7630",
				"children": []
			}, {
				"label": "荒湖农场管理区",
				"value": "7631",
				"children": []
			}]
		}, {
			"label": "公安县",
			"value": "1419",
			"children": [{
				"label": "埠河镇",
				"value": "7573",
				"children": []
			}, {
				"label": "斗湖堤镇",
				"value": "7574",
				"children": []
			}, {
				"label": "夹竹园镇",
				"value": "7575",
				"children": []
			}, {
				"label": "闸口镇",
				"value": "7576",
				"children": []
			}, {
				"label": "杨家厂镇",
				"value": "7577",
				"children": []
			}, {
				"label": "麻豪口镇",
				"value": "7578",
				"children": []
			}, {
				"label": "藕池镇",
				"value": "7579",
				"children": []
			}, {
				"label": "黄山头镇",
				"value": "7580",
				"children": []
			}, {
				"label": "孟家溪镇",
				"value": "7581",
				"children": []
			}, {
				"label": "南平镇",
				"value": "7582",
				"children": []
			}, {
				"label": "章庄铺镇",
				"value": "7583",
				"children": []
			}, {
				"label": "狮子口镇",
				"value": "7584",
				"children": []
			}, {
				"label": "斑竹垱镇",
				"value": "7585",
				"children": []
			}, {
				"label": "毛家港镇",
				"value": "7586",
				"children": []
			}, {
				"label": "甘家厂乡",
				"value": "7587",
				"children": []
			}, {
				"label": "章田寺乡",
				"value": "7588",
				"children": []
			}]
		}, {
			"label": "沙市区",
			"value": "3593",
			"children": [{
				"label": "中山街道",
				"value": "7657",
				"children": []
			}, {
				"label": "崇文街道",
				"value": "7658",
				"children": []
			}, {
				"label": "解放街道",
				"value": "7659",
				"children": []
			}, {
				"label": "胜利街道",
				"value": "7660",
				"children": []
			}, {
				"label": "朝阳街道",
				"value": "7661",
				"children": []
			}, {
				"label": "联合街道",
				"value": "7662",
				"children": []
			}, {
				"label": "锣场镇",
				"value": "7663",
				"children": []
			}, {
				"label": "岑河镇",
				"value": "7664",
				"children": []
			}, {
				"label": "观音当镇",
				"value": "7665",
				"children": []
			}, {
				"label": "关沮镇",
				"value": "7666",
				"children": []
			}, {
				"label": "立新乡",
				"value": "7667",
				"children": []
			}, {
				"label": "岑河原种场",
				"value": "7668",
				"children": []
			}, {
				"label": "沙市农场",
				"value": "7669",
				"children": []
			}]
		}, {
			"label": "荆州区",
			"value": "4078",
			"children": [{
				"label": "西城街道",
				"value": "7645",
				"children": []
			}, {
				"label": "东城街道",
				"value": "7646",
				"children": []
			}, {
				"label": "城南街道",
				"value": "7647",
				"children": []
			}, {
				"label": "纪南镇",
				"value": "7648",
				"children": []
			}, {
				"label": "川店镇",
				"value": "7649",
				"children": []
			}, {
				"label": "马山镇",
				"value": "7650",
				"children": []
			}, {
				"label": "八岭山镇",
				"value": "7651",
				"children": []
			}, {
				"label": "李埠镇",
				"value": "7652",
				"children": []
			}, {
				"label": "弥市镇",
				"value": "7653",
				"children": []
			}, {
				"label": "郢城镇",
				"value": "7654",
				"children": []
			}, {
				"label": "太湖港管理区",
				"value": "7655",
				"children": []
			}, {
				"label": "菱角湖管理区",
				"value": "7656",
				"children": []
			}]
		}]
	}, {
		"label": "宜昌市",
		"value": "1421",
		"children": [{
			"label": "当阳市",
			"value": "1423",
			"children": [{
				"label": "玉阳街道",
				"value": "7493",
				"children": []
			}, {
				"label": "坝陵街道",
				"value": "7494",
				"children": []
			}, {
				"label": "玉泉街道",
				"value": "7495",
				"children": []
			}, {
				"label": "两河镇",
				"value": "7496",
				"children": []
			}, {
				"label": "河溶镇",
				"value": "7497",
				"children": []
			}, {
				"label": "育溪镇",
				"value": "7498",
				"children": []
			}, {
				"label": "庙前镇",
				"value": "7499",
				"children": []
			}, {
				"label": "王店镇",
				"value": "7500",
				"children": []
			}, {
				"label": "半月镇",
				"value": "7501",
				"children": []
			}, {
				"label": "草埠湖镇",
				"value": "7502",
				"children": []
			}]
		}, {
			"label": "枝江市",
			"value": "1424",
			"children": [{
				"label": "马家店街道",
				"value": "7503",
				"children": []
			}, {
				"label": "安福寺镇",
				"value": "7504",
				"children": []
			}, {
				"label": "白洋镇",
				"value": "7505",
				"children": []
			}, {
				"label": "顾家店镇",
				"value": "7506",
				"children": []
			}, {
				"label": "董市镇",
				"value": "7507",
				"children": []
			}, {
				"label": "仙女镇",
				"value": "7508",
				"children": []
			}, {
				"label": "问安镇",
				"value": "7509",
				"children": []
			}, {
				"label": "七星台镇",
				"value": "7510",
				"children": []
			}, {
				"label": "百里洲镇",
				"value": "7511",
				"children": []
			}]
		}, {
			"label": "夷陵区",
			"value": "1425",
			"children": [{
				"label": "小溪塔街道办",
				"value": "7422",
				"children": []
			}, {
				"label": "夷陵经济开发区",
				"value": "7423",
				"children": []
			}, {
				"label": "樟村坪镇",
				"value": "7424",
				"children": []
			}, {
				"label": "雾渡河镇",
				"value": "7425",
				"children": []
			}, {
				"label": "分乡镇",
				"value": "7426",
				"children": []
			}, {
				"label": "太平溪镇",
				"value": "7427",
				"children": []
			}, {
				"label": "三斗坪镇",
				"value": "7428",
				"children": []
			}, {
				"label": "乐天溪镇",
				"value": "7429",
				"children": []
			}, {
				"label": "龙泉镇",
				"value": "7430",
				"children": []
			}, {
				"label": "鸦鹊岭镇",
				"value": "7431",
				"children": []
			}, {
				"label": "下堡坪乡",
				"value": "7432",
				"children": []
			}, {
				"label": "邓村乡",
				"value": "7433",
				"children": []
			}, {
				"label": "黄花乡",
				"value": "7434",
				"children": []
			}, {
				"label": "三峡坝区",
				"value": "7435",
				"children": []
			}]
		}, {
			"label": "秭归县",
			"value": "1426",
			"children": [{
				"label": "茅坪镇",
				"value": "7451",
				"children": []
			}, {
				"label": "归州镇",
				"value": "7452",
				"children": []
			}, {
				"label": "屈原镇",
				"value": "7453",
				"children": []
			}, {
				"label": "沙镇溪镇",
				"value": "7454",
				"children": []
			}, {
				"label": "两河口镇",
				"value": "7455",
				"children": []
			}, {
				"label": "郭家坝镇",
				"value": "7456",
				"children": []
			}, {
				"label": "杨林桥镇",
				"value": "7457",
				"children": []
			}, {
				"label": "九畹溪镇",
				"value": "7458",
				"children": []
			}, {
				"label": "水田坝乡",
				"value": "7459",
				"children": []
			}, {
				"label": "泄滩乡",
				"value": "7460",
				"children": []
			}, {
				"label": "梅家河乡",
				"value": "7461",
				"children": []
			}, {
				"label": "磨坪乡",
				"value": "7462",
				"children": []
			}]
		}, {
			"label": "兴山县",
			"value": "1427",
			"children": [{
				"label": "古夫镇",
				"value": "7443",
				"children": []
			}, {
				"label": "昭君镇",
				"value": "7444",
				"children": []
			}, {
				"label": "峡口镇",
				"value": "7445",
				"children": []
			}, {
				"label": "南阳镇",
				"value": "7446",
				"children": []
			}, {
				"label": "黄粮镇",
				"value": "7447",
				"children": []
			}, {
				"label": "水月寺镇",
				"value": "7448",
				"children": []
			}, {
				"label": "高桥乡",
				"value": "7449",
				"children": []
			}, {
				"label": "榛子乡",
				"value": "7450",
				"children": []
			}]
		}, {
			"label": "远安县",
			"value": "1428",
			"children": [{
				"label": "鸣凤镇",
				"value": "7436",
				"children": []
			}, {
				"label": "花林寺镇",
				"value": "7437",
				"children": []
			}, {
				"label": "旧县镇",
				"value": "7438",
				"children": []
			}, {
				"label": "洋坪镇",
				"value": "7439",
				"children": []
			}, {
				"label": "茅坪场镇",
				"value": "7440",
				"children": []
			}, {
				"label": "荷花镇",
				"value": "7441",
				"children": []
			}, {
				"label": "河口乡",
				"value": "7442",
				"children": []
			}]
		}, {
			"label": "五峰土家族自治县",
			"value": "1429",
			"children": [{
				"label": "五峰镇",
				"value": "7474",
				"children": []
			}, {
				"label": "长乐坪镇",
				"value": "7475",
				"children": []
			}, {
				"label": "渔洋关镇",
				"value": "7476",
				"children": []
			}, {
				"label": "仁和坪镇",
				"value": "7477",
				"children": []
			}, {
				"label": "湾潭镇",
				"value": "7478",
				"children": []
			}, {
				"label": "付家堰乡",
				"value": "7479",
				"children": []
			}, {
				"label": "牛庄乡",
				"value": "7480",
				"children": []
			}, {
				"label": "采花乡",
				"value": "7481",
				"children": []
			}]
		}, {
			"label": "长阳土家族自治县",
			"value": "1430",
			"children": [{
				"label": "龙舟坪镇",
				"value": "7463",
				"children": []
			}, {
				"label": "高家堰镇",
				"value": "7464",
				"children": []
			}, {
				"label": "磨市镇",
				"value": "7465",
				"children": []
			}, {
				"label": "都镇湾镇",
				"value": "7466",
				"children": []
			}, {
				"label": "资丘镇",
				"value": "7467",
				"children": []
			}, {
				"label": "渔峡口镇",
				"value": "7468",
				"children": []
			}, {
				"label": "榔坪镇",
				"value": "7469",
				"children": []
			}, {
				"label": "贺家坪镇",
				"value": "7470",
				"children": []
			}, {
				"label": "大堰乡",
				"value": "7471",
				"children": []
			}, {
				"label": "鸭子口乡",
				"value": "7472",
				"children": []
			}, {
				"label": "火烧坪乡",
				"value": "7473",
				"children": []
			}]
		}, {
			"label": "宜都市",
			"value": "3594",
			"children": [{
				"label": "陆城街道",
				"value": "8098",
				"children": []
			}, {
				"label": "红花套镇",
				"value": "8099",
				"children": []
			}, {
				"label": "高坝洲镇",
				"value": "8100",
				"children": []
			}, {
				"label": "聂家河镇",
				"value": "8101",
				"children": []
			}, {
				"label": "松木坪镇",
				"value": "8102",
				"children": []
			}, {
				"label": "枝城镇",
				"value": "8103",
				"children": []
			}, {
				"label": "姚家店镇",
				"value": "8104",
				"children": []
			}, {
				"label": "五眼泉镇",
				"value": "8105",
				"children": []
			}, {
				"label": "潘家湾土家族乡",
				"value": "8106",
				"children": []
			}, {
				"label": "王家畈乡",
				"value": "8107",
				"children": []
			}, {
				"label": "松宜矿区管理委员会",
				"value": "8137",
				"children": []
			}]
		}, {
			"label": "猇亭区",
			"value": "3595",
			"children": [{
				"label": "古老背街道",
				"value": "7419",
				"children": []
			}, {
				"label": "虎牙街道",
				"value": "7420",
				"children": []
			}, {
				"label": "云池街道",
				"value": "7421",
				"children": []
			}]
		}, {
			"label": "点军区",
			"value": "3596",
			"children": [{
				"label": "点军街道",
				"value": "7414",
				"children": []
			}, {
				"label": "艾家镇",
				"value": "7415",
				"children": []
			}, {
				"label": "桥边镇",
				"value": "7416",
				"children": []
			}, {
				"label": "联棚乡",
				"value": "7417",
				"children": []
			}, {
				"label": "土城乡",
				"value": "7418",
				"children": []
			}]
		}, {
			"label": "伍家岗区",
			"value": "3597",
			"children": [{
				"label": "大公桥街道",
				"value": "7409",
				"children": []
			}, {
				"label": "万寿桥街道",
				"value": "7410",
				"children": []
			}, {
				"label": "宝塔河街道",
				"value": "7411",
				"children": []
			}, {
				"label": "伍家岗街道",
				"value": "7412",
				"children": []
			}, {
				"label": "伍家乡",
				"value": "7413",
				"children": []
			}]
		}, {
			"label": "西陵区",
			"value": "3598",
			"children": [{
				"label": "西陵街道",
				"value": "7400",
				"children": []
			}, {
				"label": "学院街道",
				"value": "7401",
				"children": []
			}, {
				"label": "云集街道",
				"value": "7402",
				"children": []
			}, {
				"label": "西坝街道",
				"value": "7403",
				"children": []
			}, {
				"label": "葛洲坝街道",
				"value": "7404",
				"children": []
			}, {
				"label": "夜明珠街道",
				"value": "7405",
				"children": []
			}, {
				"label": "开发区",
				"value": "7406",
				"children": []
			}, {
				"label": "窑湾乡",
				"value": "7407",
				"children": []
			}, {
				"label": "峡口风景区",
				"value": "7408",
				"children": []
			}]
		}]
	}, {
		"label": "孝感市",
		"value": "1432",
		"children": [{
			"label": "汉川市",
			"value": "1435",
		}, {
			"label": "云梦县",
			"value": "1437",
		}, {
			"label": "大悟县",
			"value": "1438",
		}, {
			"label": "孝昌县",
			"value": "1439",
		}, {
			"label": "孝南区",
			"value": "53583",
		}, {
			"label": "应城市",
			"value": "53584",
		}, {
			"label": "安陆市",
			"value": "53585",
		}]
	}, {
		"label": "黄冈市",
		"value": "1441",
		"children": [{
			"label": "红安县",
			"value": "1444",
		}, {
			"label": "罗田县",
			"value": "1445",
		}, {
			"label": "黄梅县",
			"value": "1447",
		}, {
			"label": "英山县",
			"value": "1448",
		}, {
			"label": "团风县",
			"value": "1449",
		}, {
			"label": "黄州区",
			"value": "53586",
		}, {
			"label": "蕲春县",
			"value": "53587",
		}, {
			"label": "麻城市",
			"value": "53588",
		}, {
			"label": "武穴市",
			"value": "53589",
		}, {
			"label": "浠水县",
			"value": "53590",
		}]
	}, {
		"label": "咸宁市",
		"value": "1458",
		"children": [{
			"label": "嘉鱼县",
			"value": "1461",
		}, {
			"label": "通山县",
			"value": "1462",
		}, {
			"label": "崇阳县",
			"value": "1463",
		}, {
			"label": "通城县",
			"value": "1464",
		}, {
			"label": "咸安区",
			"value": "53591",
		}, {
			"label": "赤壁市",
			"value": "53592",
		}]
	}, {
		"label": "恩施州",
		"value": "1466",
		"children": [{
			"label": "恩施市",
			"value": "1467",
		}, {
			"label": "利川市",
			"value": "1468",
		}, {
			"label": "建始县",
			"value": "1469",
		}, {
			"label": "来凤县",
			"value": "1470",
		}, {
			"label": "巴东县",
			"value": "1471",
		}, {
			"label": "鹤峰县",
			"value": "1472",
		}, {
			"label": "宣恩县",
			"value": "1473",
		}, {
			"label": "咸丰县",
			"value": "1474",
		}]
	}, {
		"label": "鄂州市",
		"value": "1475",
		"children": [{
			"label": "梁子湖区",
			"value": "3601",
		}, {
			"label": "华容区",
			"value": "3602",
		}, {
			"label": "鄂城区",
			"value": "53593",
		}]
	}, {
		"label": "荆门市",
		"value": "1477",
		"children": [{
			"label": "京山县",
			"value": "1478",
			"children": [{
				"label": "新市镇",
				"value": "7527",
				"children": []
			}, {
				"label": "永兴镇",
				"value": "7528",
				"children": []
			}, {
				"label": "曹武镇",
				"value": "7529",
				"children": []
			}, {
				"label": "罗店镇",
				"value": "7530",
				"children": []
			}, {
				"label": "宋河镇",
				"value": "7531",
				"children": []
			}, {
				"label": "坪坝镇",
				"value": "7532",
				"children": []
			}, {
				"label": "三阳镇",
				"value": "7533",
				"children": []
			}, {
				"label": "绿林镇",
				"value": "7534",
				"children": []
			}, {
				"label": "杨集镇",
				"value": "7535",
				"children": []
			}, {
				"label": "孙桥镇",
				"value": "7536",
				"children": []
			}, {
				"label": "石龙镇",
				"value": "7537",
				"children": []
			}, {
				"label": "永漋镇",
				"value": "7538",
				"children": []
			}, {
				"label": "雁门口镇",
				"value": "7539",
				"children": []
			}, {
				"label": "钱场镇",
				"value": "7540",
				"children": []
			}, {
				"label": "八里途开发区",
				"value": "7541",
				"children": []
			}, {
				"label": "县原种场",
				"value": "7542",
				"children": []
			}, {
				"label": "屈家岭管理区",
				"value": "8144",
				"children": []
			}]
		}, {
			"label": "钟祥市",
			"value": "2973",
			"children": [{
				"label": "郢中街道",
				"value": "7556",
				"children": []
			}, {
				"label": "洋梓镇",
				"value": "7557",
				"children": []
			}, {
				"label": "长寿镇",
				"value": "7558",
				"children": []
			}, {
				"label": "丰乐镇",
				"value": "7559",
				"children": []
			}, {
				"label": "胡集镇",
				"value": "7560",
				"children": []
			}, {
				"label": "双河镇",
				"value": "7561",
				"children": []
			}, {
				"label": "磷矿镇",
				"value": "7562",
				"children": []
			}, {
				"label": "文集镇",
				"value": "7563",
				"children": []
			}, {
				"label": "冷水镇",
				"value": "7564",
				"children": []
			}, {
				"label": "石牌镇",
				"value": "7565",
				"children": []
			}, {
				"label": "旧口镇",
				"value": "7566",
				"children": []
			}, {
				"label": "柴湖镇",
				"value": "7567",
				"children": []
			}, {
				"label": "长滩镇",
				"value": "7568",
				"children": []
			}, {
				"label": "东桥镇",
				"value": "7569",
				"children": []
			}, {
				"label": "客店镇",
				"value": "7570",
				"children": []
			}, {
				"label": "张集镇",
				"value": "7571",
				"children": []
			}, {
				"label": "九里回族乡",
				"value": "7572",
				"children": []
			}]
		}, {
			"label": "沙洋县",
			"value": "3055",
			"children": [{
				"label": "沙洋镇",
				"value": "7543",
				"children": []
			}, {
				"label": "五里铺镇",
				"value": "7544",
				"children": []
			}, {
				"label": "十里铺镇",
				"value": "7545",
				"children": []
			}, {
				"label": "纪山镇",
				"value": "7546",
				"children": []
			}, {
				"label": "拾回桥镇",
				"value": "7547",
				"children": []
			}, {
				"label": "后港镇",
				"value": "7548",
				"children": []
			}, {
				"label": "毛李镇",
				"value": "7549",
				"children": []
			}, {
				"label": "官当镇",
				"value": "7550",
				"children": []
			}, {
				"label": "李市镇",
				"value": "7551",
				"children": []
			}, {
				"label": "马良镇",
				"value": "7552",
				"children": []
			}, {
				"label": "高阳镇",
				"value": "7553",
				"children": []
			}, {
				"label": "沈集镇",
				"value": "7554",
				"children": []
			}, {
				"label": "曾集镇",
				"value": "7555",
				"children": []
			}]
		}, {
			"label": "掇刀区",
			"value": "3599",
			"children": [{
				"label": "掇刀石街道",
				"value": "7522",
				"children": []
			}, {
				"label": "白庙街道",
				"value": "7523",
				"children": []
			}, {
				"label": "团林铺镇",
				"value": "7524",
				"children": []
			}, {
				"label": "麻城镇",
				"value": "7525",
				"children": []
			}, {
				"label": "荆门经济开发区",
				"value": "7526",
				"children": []
			}]
		}, {
			"label": "东宝区",
			"value": "3600",
			"children": [{
				"label": "龙泉街道",
				"value": "7512",
				"children": []
			}, {
				"label": "泉口街道",
				"value": "7513",
				"children": []
			}, {
				"label": "栗溪镇",
				"value": "7514",
				"children": []
			}, {
				"label": "子陵镇",
				"value": "7515",
				"children": []
			}, {
				"label": "漳河镇",
				"value": "7516",
				"children": []
			}, {
				"label": "马河镇",
				"value": "7517",
				"children": []
			}, {
				"label": "石桥驿镇",
				"value": "7518",
				"children": []
			}, {
				"label": "牌楼镇",
				"value": "7519",
				"children": []
			}, {
				"label": "仙居乡",
				"value": "7520",
				"children": []
			}, {
				"label": "东宝工业园区",
				"value": "7521",
				"children": []
			}]
		}]
	}, {
		"label": "随州市",
		"value": "1479",
		"children": [{
			"label": "广水市",
			"value": "3163",
			"children": [{
				"label": "应山街道",
				"value": "7013",
				"children": []
			}, {
				"label": "广水街道",
				"value": "7014",
				"children": []
			}, {
				"label": "武胜关镇",
				"value": "7015",
				"children": []
			}, {
				"label": "杨寨镇",
				"value": "7016",
				"children": []
			}, {
				"label": "陈巷镇",
				"value": "7017",
				"children": []
			}, {
				"label": "长岭镇",
				"value": "7018",
				"children": []
			}, {
				"label": "马坪镇",
				"value": "7019",
				"children": []
			}, {
				"label": "关庙镇",
				"value": "7020",
				"children": []
			}, {
				"label": "余店镇",
				"value": "7021",
				"children": []
			}, {
				"label": "吴店镇",
				"value": "7022",
				"children": []
			}, {
				"label": "郝店镇",
				"value": "7023",
				"children": []
			}, {
				"label": "蔡河镇",
				"value": "7024",
				"children": []
			}, {
				"label": "城郊乡",
				"value": "7025",
				"children": []
			}, {
				"label": "李店乡",
				"value": "7026",
				"children": []
			}, {
				"label": "太平乡",
				"value": "7027",
				"children": []
			}, {
				"label": "骆店乡",
				"value": "7028",
				"children": []
			}, {
				"label": "中华山林场",
				"value": "7029",
				"children": []
			}, {
				"label": "三潭风景区",
				"value": "7030",
				"children": []
			}]
		}, {
			"label": "曾都区",
			"value": "3164",
			"children": [{
				"label": "北郊",
				"value": "7031",
				"children": []
			}, {
				"label": "南郊",
				"value": "7032",
				"children": []
			}, {
				"label": "东城",
				"value": "7033",
				"children": []
			}, {
				"label": "西城",
				"value": "7034",
				"children": []
			}, {
				"label": "城东新区",
				"value": "7035",
				"children": []
			}, {
				"label": "城南新区",
				"value": "7036",
				"children": []
			}, {
				"label": "万店镇",
				"value": "7037",
				"children": []
			}, {
				"label": "何店镇",
				"value": "7038",
				"children": []
			}, {
				"label": "洛阳镇",
				"value": "7039",
				"children": []
			}, {
				"label": "府河镇",
				"value": "7040",
				"children": []
			}, {
				"label": "淅河镇",
				"value": "7041",
				"children": []
			}, {
				"label": "新型工业基地",
				"value": "7042",
				"children": []
			}, {
				"label": "经济开发区",
				"value": "7043",
				"children": []
			}]
		}, {
			"label": "随县",
			"value": "7357",
			"children": [{
				"label": "厉山镇",
				"value": "7358",
				"children": []
			}, {
				"label": "高城镇",
				"value": "7377",
				"children": []
			}, {
				"label": "殷店镇",
				"value": "7378",
				"children": []
			}, {
				"label": "草店镇",
				"value": "7379",
				"children": []
			}, {
				"label": "小林镇",
				"value": "7380",
				"children": []
			}, {
				"label": "淮河镇",
				"value": "7381",
				"children": []
			}, {
				"label": "万和镇",
				"value": "7382",
				"children": []
			}, {
				"label": "尚市镇",
				"value": "7383",
				"children": []
			}, {
				"label": "唐县镇",
				"value": "7384",
				"children": []
			}, {
				"label": "吴山镇",
				"value": "7385",
				"children": []
			}, {
				"label": "新街镇",
				"value": "7386",
				"children": []
			}, {
				"label": "安居镇",
				"value": "7387",
				"children": []
			}, {
				"label": "环潭镇",
				"value": "7388",
				"children": []
			}, {
				"label": "洪山镇",
				"value": "7389",
				"children": []
			}, {
				"label": "长岗镇",
				"value": "7390",
				"children": []
			}, {
				"label": "三里岗镇",
				"value": "7391",
				"children": []
			}, {
				"label": "柳林镇",
				"value": "7392",
				"children": []
			}, {
				"label": "均川镇",
				"value": "7393",
				"children": []
			}, {
				"label": "万福店镇",
				"value": "7394",
				"children": []
			}]
		}]
	}, {
		"label": "潜江市",
		"value": "2922",
		"children": [{
			"label": "园林",
			"value": "53594",
		}, {
			"label": "杨市",
			"value": "53595",
		}, {
			"label": "周矶",
			"value": "53596",
		}, {
			"label": "广华",
			"value": "53597",
		}, {
			"label": "泰丰",
			"value": "53598",
		}, {
			"label": "竹根滩镇",
			"value": "53599",
		}, {
			"label": "高石碑镇",
			"value": "53600",
		}, {
			"label": "积玉口镇",
			"value": "53601",
		}, {
			"label": "渔洋镇",
			"value": "53602",
		}, {
			"label": "王场镇",
			"value": "53603",
		}, {
			"label": "熊口镇",
			"value": "53604",
		}, {
			"label": "老新镇",
			"value": "53605",
		}, {
			"label": "浩口镇",
			"value": "53606",
		}, {
			"label": "张金镇",
			"value": "53607",
		}, {
			"label": "龙湾镇",
			"value": "53608",
		}, {
			"label": "江汉石油管理局",
			"value": "53609",
		}, {
			"label": "钱江经济开发区",
			"value": "53610",
		}, {
			"label": "西大垸管理区",
			"value": "53611",
		}, {
			"label": "运粮湖管理区",
			"value": "53612",
		}, {
			"label": "周矶管理区",
			"value": "53613",
		}, {
			"label": "后湖管理区",
			"value": "53614",
		}, {
			"label": "熊口管理区",
			"value": "53615",
		}, {
			"label": "总口管理区",
			"value": "53616",
		}, {
			"label": "高场原种场",
			"value": "53617",
		}, {
			"label": "浩口原种场",
			"value": "53618",
		}]
	}, {
		"label": "天门市",
		"value": "2980",
		"children": [{
			"label": "侨乡街道开发区",
			"value": "53619",
		}, {
			"label": "竟陵街道",
			"value": "53620",
		}, {
			"label": "杨林街道",
			"value": "53621",
		}, {
			"label": "佛子山镇",
			"value": "53622",
		}, {
			"label": "多宝镇",
			"value": "53623",
		}, {
			"label": "拖市镇",
			"value": "53624",
		}, {
			"label": "张港镇",
			"value": "53625",
		}, {
			"label": "蒋场镇",
			"value": "53626",
		}, {
			"label": "汪场镇",
			"value": "53627",
		}, {
			"label": "渔薪镇",
			"value": "53628",
		}, {
			"label": "黄坛镇",
			"value": "53629",
		}, {
			"label": "岳口镇",
			"value": "53630",
		}, {
			"label": "横林镇",
			"value": "53631",
		}, {
			"label": "彭市镇",
			"value": "53632",
		}, {
			"label": "麻洋镇",
			"value": "53633",
		}, {
			"label": "多祥镇",
			"value": "53634",
		}, {
			"label": "干驿镇",
			"value": "53635",
		}, {
			"label": "马湾镇",
			"value": "53636",
		}, {
			"label": "卢市镇",
			"value": "53637",
		}, {
			"label": "小板镇",
			"value": "53638",
		}, {
			"label": "九真镇",
			"value": "53639",
		}, {
			"label": "皂市镇",
			"value": "53640",
		}, {
			"label": "胡市镇",
			"value": "53641",
		}, {
			"label": "石河镇",
			"value": "53642",
		}, {
			"label": "净潭乡",
			"value": "53643",
		}, {
			"label": "蒋湖农场",
			"value": "53644",
		}, {
			"label": "白茅湖农场",
			"value": "53645",
		}, {
			"label": "沉湖管委会",
			"value": "53646",
		}]
	}, {
		"label": "仙桃市",
		"value": "2983",
		"children": [{
			"label": "郑场镇",
			"value": "53647",
		}, {
			"label": "毛嘴镇",
			"value": "53648",
		}, {
			"label": "豆河镇",
			"value": "53649",
		}, {
			"label": "三伏潭镇",
			"value": "53650",
		}, {
			"label": "胡场镇",
			"value": "53651",
		}, {
			"label": "长埫口镇",
			"value": "53652",
		}, {
			"label": "西流河镇",
			"value": "53653",
		}, {
			"label": "沙湖镇",
			"value": "53654",
		}, {
			"label": "杨林尾镇",
			"value": "53655",
		}, {
			"label": "彭场镇",
			"value": "53656",
		}, {
			"label": "张沟镇",
			"value": "53657",
		}, {
			"label": "郭河镇",
			"value": "53658",
		}, {
			"label": "沔城镇",
			"value": "53659",
		}, {
			"label": "通海口镇",
			"value": "53660",
		}, {
			"label": "陈场镇",
			"value": "53661",
		}, {
			"label": "工业园区",
			"value": "53662",
		}, {
			"label": "久合垸原种场",
			"value": "53663",
		}, {
			"label": "沙湖原种场",
			"value": "53664",
		}, {
			"label": "排湖渔场",
			"value": "53665",
		}, {
			"label": "五湖渔场",
			"value": "53666",
		}, {
			"label": "赵西垸林场",
			"value": "53667",
		}, {
			"label": "畜禽良种场",
			"value": "53668",
		}, {
			"label": "城区",
			"value": "53669",
		}]
	}, {
		"label": "神农架林区",
		"value": "3154",
		"children": [{
			"label": "松柏镇",
			"value": "53670",
		}, {
			"label": "阳日镇",
			"value": "53671",
		}, {
			"label": "木鱼镇",
			"value": "53672",
		}, {
			"label": "红坪镇",
			"value": "53673",
		}, {
			"label": "新华镇",
			"value": "53674",
		}, {
			"label": "宋洛乡",
			"value": "53675",
		}, {
			"label": "九湖乡",
			"value": "53676",
		}, {
			"label": "下谷坪乡",
			"value": "53677",
		}]
	}]
}, {
	"label": "湖南",
	"value": "18",
	"children": [{
		"label": "长沙市",
		"value": "1482",
		"children": [{
			"label": "望城区",
			"value": "1485",
		}, {
			"label": "芙蓉区",
			"value": "3606",
		}, {
			"label": "岳麓区",
			"value": "53225",
		}, {
			"label": "雨花区",
			"value": "53226",
		}, {
			"label": "开福区",
			"value": "53227",
		}, {
			"label": "天心区",
			"value": "53228",
		}, {
			"label": "浏阳区",
			"value": "53229",
		}, {
			"label": "长沙县",
			"value": "53230",
		}, {
			"label": "宁乡县",
			"value": "53231",
		}]
	}, {
		"label": "株洲市",
		"value": "1488",
		"children": [{
			"label": "醴陵市",
			"value": "1489",
		}, {
			"label": "株洲县",
			"value": "1490",
		}, {
			"label": "攸县",
			"value": "1491",
		}, {
			"label": "茶陵县",
			"value": "1492",
		}, {
			"label": "炎陵县",
			"value": "1493",
		}, {
			"label": "天元区",
			"value": "53232",
		}, {
			"label": "石峰区",
			"value": "53233",
		}, {
			"label": "芦淞区",
			"value": "53234",
		}, {
			"label": "荷塘区",
			"value": "53235",
		}, {
			"label": "云龙示范区",
			"value": "53236",
		}]
	}, {
		"label": "湘潭市",
		"value": "1495",
		"children": [{
			"label": "湘乡市",
			"value": "1496",
		}, {
			"label": "湘潭县",
			"value": "1497",
		}, {
			"label": "韶山市",
			"value": "1498",
		}, {
			"label": "雨湖区",
			"value": "53237",
		}, {
			"label": "岳塘区",
			"value": "53238",
		}]
	}, {
		"label": "韶山市",
		"value": "1499",
		"children": [{
			"label": "韶山市区内",
			"value": "1500",
		}]
	}, {
		"label": "衡阳市",
		"value": "1501",
		"children": [{
			"label": "常宁市",
			"value": "1502",
		}, {
			"label": "衡阳县",
			"value": "1503",
		}, {
			"label": "耒阳市",
			"value": "1504",
		}, {
			"label": "衡东县",
			"value": "1505",
		}, {
			"label": "衡南县",
			"value": "1506",
		}, {
			"label": "衡山县",
			"value": "1507",
		}, {
			"label": "祁东县",
			"value": "1508",
		}, {
			"label": "南岳区",
			"value": "1509",
		}, {
			"label": "蒸湘区",
			"value": "53239",
		}, {
			"label": "石鼓区",
			"value": "53240",
		}, {
			"label": "珠晖区",
			"value": "53241",
		}, {
			"label": "雁峰区",
			"value": "53242",
		}]
	}, {
		"label": "邵阳市",
		"value": "1511",
		"children": [{
			"label": "武冈市",
			"value": "1512",
		}, {
			"label": "邵东县",
			"value": "1513",
		}, {
			"label": "洞口县",
			"value": "1514",
		}, {
			"label": "新邵县",
			"value": "1515",
		}, {
			"label": "绥宁县",
			"value": "1516",
		}, {
			"label": "新宁县",
			"value": "1517",
		}, {
			"label": "邵阳县",
			"value": "1518",
		}, {
			"label": "隆回县",
			"value": "1519",
		}, {
			"label": "城步县",
			"value": "1520",
		}, {
			"label": "大祥区",
			"value": "53243",
		}, {
			"label": "双清区",
			"value": "53244",
		}, {
			"label": "北塔区",
			"value": "53245",
		}]
	}, {
		"label": "岳阳市",
		"value": "1522",
		"children": [{
			"label": "临湘市",
			"value": "1523",
		}, {
			"label": "汨罗市",
			"value": "1524",
		}, {
			"label": "岳阳县",
			"value": "1525",
		}, {
			"label": "湘阴县",
			"value": "1526",
		}, {
			"label": "华容县",
			"value": "1527",
		}, {
			"label": "平江县",
			"value": "1528",
		}, {
			"label": "君山区",
			"value": "3619",
		}, {
			"label": "云溪区",
			"value": "3620",
		}, {
			"label": "岳阳楼区",
			"value": "53246",
		}]
	}, {
		"label": "常德市",
		"value": "1530",
		"children": [{
			"label": "津市市",
			"value": "1532",
		}, {
			"label": "澧县",
			"value": "1533",
		}, {
			"label": "临澧县",
			"value": "1534",
		}, {
			"label": "桃源县",
			"value": "1535",
		}, {
			"label": "汉寿县",
			"value": "1536",
		}, {
			"label": "石门县",
			"value": "1537",
		}, {
			"label": "安乡县",
			"value": "1538",
		}, {
			"label": "鼎城区",
			"value": "53247",
		}, {
			"label": "武陵区",
			"value": "53248",
		}]
	}, {
		"label": "张家界市",
		"value": "1540",
		"children": [{
			"label": "慈利县",
			"value": "1541",
		}, {
			"label": "桑植县",
			"value": "1542",
		}, {
			"label": "武陵源区",
			"value": "1543",
		}, {
			"label": "永定区",
			"value": "3622",
		}]
	}, {
		"label": "郴州市",
		"value": "1544",
		"children": [{
			"label": "资兴市",
			"value": "1545",
		}, {
			"label": "宜章县",
			"value": "1546",
		}, {
			"label": "安仁县",
			"value": "1547",
		}, {
			"label": "汝城县",
			"value": "1548",
		}, {
			"label": "嘉禾县",
			"value": "1549",
		}, {
			"label": "临武县",
			"value": "1550",
		}, {
			"label": "桂东县",
			"value": "1551",
		}, {
			"label": "永兴县",
			"value": "1552",
		}, {
			"label": "桂阳县",
			"value": "1553",
		}, {
			"label": "北湖区",
			"value": "53249",
		}, {
			"label": "苏仙区",
			"value": "53250",
		}]
	}, {
		"label": "益阳市",
		"value": "1555",
		"children": [{
			"label": "南县",
			"value": "1556",
		}, {
			"label": "桃江县",
			"value": "1557",
		}, {
			"label": "安化县",
			"value": "1558",
		}, {
			"label": "沅江市",
			"value": "1565",
		}, {
			"label": "赫山区",
			"value": "53251",
		}, {
			"label": "资阳区",
			"value": "53252",
		}]
	}, {
		"label": "永州市",
		"value": "1560",
		"children": [{
			"label": "祁阳县",
			"value": "1563",
		}, {
			"label": "双牌县",
			"value": "1564",
		}, {
			"label": "道县",
			"value": "1566",
		}, {
			"label": "江永县",
			"value": "1567",
		}, {
			"label": "江华县",
			"value": "1568",
		}, {
			"label": "宁远县",
			"value": "1569",
		}, {
			"label": "新田县",
			"value": "1570",
		}, {
			"label": "蓝山县",
			"value": "1571",
		}, {
			"label": "东安县",
			"value": "1572",
		}, {
			"label": "零陵区",
			"value": "1573",
		}, {
			"label": "冷水滩区",
			"value": "53253",
		}]
	}, {
		"label": "怀化市",
		"value": "1574",
		"children": [{
			"label": "洪江市",
			"value": "1575",
		}, {
			"label": "会同县",
			"value": "1576",
		}, {
			"label": "溆浦县",
			"value": "1578",
		}, {
			"label": "辰溪县",
			"value": "1579",
		}, {
			"label": "靖州县",
			"value": "1580",
		}, {
			"label": "通道县",
			"value": "1581",
		}, {
			"label": "芷江县",
			"value": "1582",
		}, {
			"label": "新晃县",
			"value": "1583",
		}, {
			"label": "麻阳县",
			"value": "1584",
		}, {
			"label": "沅陵县",
			"value": "3070",
		}, {
			"label": "中方县",
			"value": "3626",
		}, {
			"label": "中方县",
			"value": "53254",
		}, {
			"label": "鹤城区",
			"value": "53255",
		}]
	}, {
		"label": "娄底市",
		"value": "1586",
		"children": [{
			"label": "冷水江市",
			"value": "1588",
		}, {
			"label": "涟源市",
			"value": "1589",
		}, {
			"label": "新化县",
			"value": "1590",
		}, {
			"label": "双峰县",
			"value": "1591",
		}, {
			"label": "娄星区",
			"value": "53256",
		}]
	}, {
		"label": "湘西州",
		"value": "1592",
		"children": [{
			"label": "吉首市",
			"value": "1593",
		}, {
			"label": "古丈县",
			"value": "1594",
		}, {
			"label": "龙山县",
			"value": "1595",
		}, {
			"label": "永顺县",
			"value": "1596",
		}, {
			"label": "泸溪县",
			"value": "1597",
		}, {
			"label": "凤凰县",
			"value": "1598",
		}, {
			"label": "花垣县",
			"value": "1599",
		}, {
			"label": "保靖县",
			"value": "1600",
		}]
	}]
}, {
	"label": "广东",
	"value": "19",
	"children": [{
		"label": "广州市",
		"value": "1601",
		"children": [{
			"label": "天河区",
			"value": "3633",
		}, {
			"label": "海珠区",
			"value": "3634",
		}, {
			"label": "荔湾区",
			"value": "3635",
		}, {
			"label": "越秀区",
			"value": "3637",
		}, {
			"label": "番禺区",
			"value": "53039",
		}, {
			"label": "花都区",
			"value": "53040",
		}, {
			"label": "白云区",
			"value": "53041",
		}, {
			"label": "南沙区",
			"value": "53042",
		}, {
			"label": "黄埔区",
			"value": "53043",
		}, {
			"label": "增城区",
			"value": "53044",
		}, {
			"label": "从化区",
			"value": "53045",
		}, {
			"label": "广州大学城",
			"value": "53046",
		}]
	}, {
		"label": "深圳市",
		"value": "1607",
		"children": [{
			"label": "南山区",
			"value": "3155",
		}, {
			"label": "罗湖区",
			"value": "3638",
		}, {
			"label": "福田区",
			"value": "3639",
		}, {
			"label": "宝安区",
			"value": "4773",
		}, {
			"label": "光明新区",
			"value": "6675",
		}, {
			"label": "坪山新区",
			"value": "6736",
		}, {
			"label": "大鹏新区",
			"value": "6737",
		}, {
			"label": "龙岗区",
			"value": "53047",
		}, {
			"label": "盐田区",
			"value": "53048",
		}, {
			"label": "龙华区",
			"value": "53049",
		}]
	}, {
		"label": "珠海市",
		"value": "1609",
		"children": [{
			"label": "斗门区",
			"value": "53050",
		}, {
			"label": "金湾区",
			"value": "53051",
		}, {
			"label": "香洲区",
			"value": "53052",
		}]
	}, {
		"label": "汕头市",
		"value": "1611",
		"children": [{
			"label": "南澳县",
			"value": "1614",
		}, {
			"label": "龙湖区",
			"value": "53053",
		}, {
			"label": "金平区",
			"value": "53054",
		}, {
			"label": "澄海区",
			"value": "53055",
		}, {
			"label": "潮阳区",
			"value": "53056",
		}, {
			"label": "潮南区",
			"value": "53057",
		}, {
			"label": "濠江区",
			"value": "53058",
		}]
	}, {
		"label": "韶关市",
		"value": "1617",
		"children": [{
			"label": "南雄市",
			"value": "1618",
			"children": [{
				"label": "百顺镇",
				"value": "6275",
				"children": []
			}, {
				"label": "邓坊镇",
				"value": "6276",
				"children": []
			}, {
				"label": "湖口镇",
				"value": "6277",
				"children": []
			}, {
				"label": "黄坑镇",
				"value": "6278",
				"children": []
			}, {
				"label": "江头镇",
				"value": "6279",
				"children": []
			}, {
				"label": "界址镇",
				"value": "6280",
				"children": []
			}, {
				"label": "澜河镇",
				"value": "6281",
				"children": []
			}, {
				"label": "帽子峰镇",
				"value": "6282",
				"children": []
			}, {
				"label": "南亩镇",
				"value": "6283",
				"children": []
			}, {
				"label": "水口镇",
				"value": "6284",
				"children": []
			}, {
				"label": "坪田镇",
				"value": "6285",
				"children": []
			}, {
				"label": "全安镇",
				"value": "6286",
				"children": []
			}, {
				"label": "乌迳镇",
				"value": "6287",
				"children": []
			}, {
				"label": "油山镇",
				"value": "6289",
				"children": []
			}, {
				"label": "珠玑镇",
				"value": "6290",
				"children": []
			}, {
				"label": "主田镇",
				"value": "6291",
				"children": []
			}, {
				"label": "古市镇",
				"value": "6292",
				"children": []
			}, {
				"label": "精细化工基地",
				"value": "9162",
				"children": []
			}]
		}, {
			"label": "乐昌市",
			"value": "1619",
			"children": [{
				"label": "白石镇",
				"value": "6293",
				"children": []
			}, {
				"label": "北乡镇",
				"value": "6294",
				"children": []
			}, {
				"label": "大源镇",
				"value": "6295",
				"children": []
			}, {
				"label": "黄圃镇",
				"value": "6296",
				"children": []
			}, {
				"label": "九峰镇",
				"value": "6297",
				"children": []
			}, {
				"label": "廊田镇",
				"value": "6298",
				"children": []
			}, {
				"label": "两江镇",
				"value": "6300",
				"children": []
			}, {
				"label": "梅花镇",
				"value": "6301",
				"children": []
			}, {
				"label": "坪石镇",
				"value": "6302",
				"children": []
			}, {
				"label": "庆云镇",
				"value": "6303",
				"children": []
			}, {
				"label": "三溪镇",
				"value": "6304",
				"children": []
			}, {
				"label": "沙坪镇",
				"value": "6305",
				"children": []
			}, {
				"label": "五山镇",
				"value": "6306",
				"children": []
			}, {
				"label": "秀水镇",
				"value": "6307",
				"children": []
			}, {
				"label": "云岩镇",
				"value": "6308",
				"children": []
			}, {
				"label": "长来镇",
				"value": "6309",
				"children": []
			}, {
				"label": "河南镇",
				"value": "9160",
				"children": []
			}, {
				"label": "乐城镇",
				"value": "9161",
				"children": []
			}]
		}, {
			"label": "仁化县",
			"value": "1620",
			"children": [{
				"label": "城口镇",
				"value": "6310",
				"children": []
			}, {
				"label": "大桥镇",
				"value": "6311",
				"children": []
			}, {
				"label": "董塘镇",
				"value": "6313",
				"children": []
			}, {
				"label": "扶溪镇",
				"value": "6314",
				"children": []
			}, {
				"label": "红山镇",
				"value": "6315",
				"children": []
			}, {
				"label": "黄坑镇",
				"value": "6316",
				"children": []
			}, {
				"label": "石塘镇",
				"value": "6317",
				"children": []
			}, {
				"label": "闻韶镇",
				"value": "6318",
				"children": []
			}, {
				"label": "长江镇",
				"value": "6319",
				"children": []
			}, {
				"label": "周田镇",
				"value": "6320",
				"children": []
			}]
		}, {
			"label": "始兴县",
			"value": "1621",
			"children": [{
				"label": "隘子镇",
				"value": "6321",
				"children": []
			}, {
				"label": "城南镇",
				"value": "6322",
				"children": []
			}, {
				"label": "澄江镇",
				"value": "6323",
				"children": []
			}, {
				"label": "顿岗镇",
				"value": "6324",
				"children": []
			}, {
				"label": "罗坝镇",
				"value": "6325",
				"children": []
			}, {
				"label": "马市镇",
				"value": "6326",
				"children": []
			}, {
				"label": "深渡水瑶族乡",
				"value": "6327",
				"children": []
			}, {
				"label": "沈所镇",
				"value": "6328",
				"children": []
			}, {
				"label": "司前镇",
				"value": "6329",
				"children": []
			}, {
				"label": "太平镇",
				"value": "6330",
				"children": []
			}]
		}, {
			"label": "翁源县",
			"value": "1622",
			"children": [{
				"label": "坝仔镇",
				"value": "6331",
				"children": []
			}, {
				"label": "官渡镇",
				"value": "6332",
				"children": []
			}, {
				"label": "江尾镇",
				"value": "6333",
				"children": []
			}, {
				"label": "龙仙镇",
				"value": "6334",
				"children": []
			}, {
				"label": "翁城镇",
				"value": "6335",
				"children": []
			}, {
				"label": "新江镇",
				"value": "6336",
				"children": []
			}, {
				"label": "周陂镇",
				"value": "6337",
				"children": []
			}, {
				"label": "铁龙林场",
				"value": "9155",
				"children": []
			}]
		}, {
			"label": "新丰县",
			"value": "1624",
			"children": [{
				"label": "黄礤镇",
				"value": "6348",
				"children": []
			}, {
				"label": "回龙镇",
				"value": "6349",
				"children": []
			}, {
				"label": "马头镇",
				"value": "6350",
				"children": []
			}, {
				"label": "梅坑镇",
				"value": "6351",
				"children": []
			}, {
				"label": "沙田镇",
				"value": "6352",
				"children": []
			}, {
				"label": "遥田镇",
				"value": "6353",
				"children": []
			}]
		}, {
			"label": "乳源瑶族自治县",
			"value": "1625",
			"children": [{
				"label": "必背镇",
				"value": "6354",
				"children": []
			}, {
				"label": "大布镇",
				"value": "6355",
				"children": []
			}, {
				"label": "大桥镇",
				"value": "6356",
				"children": []
			}, {
				"label": "东坪镇",
				"value": "6357",
				"children": []
			}, {
				"label": "桂头镇",
				"value": "6358",
				"children": []
			}, {
				"label": "洛阳镇",
				"value": "6359",
				"children": []
			}, {
				"label": "乳城镇",
				"value": "6360",
				"children": []
			}, {
				"label": "一六镇",
				"value": "6361",
				"children": []
			}, {
				"label": "游溪镇",
				"value": "6362",
				"children": []
			}, {
				"label": "天井山林场",
				"value": "9156",
				"children": []
			}, {
				"label": "乳阳林业局",
				"value": "9157",
				"children": []
			}]
		}, {
			"label": "曲江区",
			"value": "1626",
			"children": [{
				"label": "马坝镇",
				"value": "8193",
				"children": []
			}, {
				"label": "樟市镇",
				"value": "8194",
				"children": []
			}, {
				"label": "韶关冶炼厂",
				"value": "8195",
				"children": []
			}, {
				"label": "沙溪镇",
				"value": "8196",
				"children": []
			}, {
				"label": "韶关钢铁集团有限公司",
				"value": "8197",
				"children": []
			}, {
				"label": "小坑镇",
				"value": "8198",
				"children": []
			}, {
				"label": "乌石镇",
				"value": "8199",
				"children": []
			}, {
				"label": "枫湾镇",
				"value": "8200",
				"children": []
			}, {
				"label": "罗坑镇",
				"value": "8201",
				"children": []
			}, {
				"label": "韶关十六冶金建设公司",
				"value": "8202",
				"children": []
			}, {
				"label": "白土镇",
				"value": "8203",
				"children": []
			}, {
				"label": "大塘镇",
				"value": "8204",
				"children": []
			}, {
				"label": "韶关发电厂",
				"value": "8205",
				"children": []
			}, {
				"label": "曲江区大宝山矿",
				"value": "8206",
				"children": []
			}]
		}, {
			"label": "武江区",
			"value": "3643",
			"children": [{
				"label": "重阳镇",
				"value": "8207",
				"children": []
			}, {
				"label": "西河片区",
				"value": "8208",
				"children": []
			}, {
				"label": "江湾镇",
				"value": "8209",
				"children": []
			}, {
				"label": "龙归镇",
				"value": "8210",
				"children": []
			}, {
				"label": "沙洲尾",
				"value": "8211",
				"children": []
			}, {
				"label": "西联镇",
				"value": "8212",
				"children": []
			}, {
				"label": "沐溪工业园",
				"value": "8213",
				"children": []
			}]
		}, {
			"label": "浈江区",
			"value": "3644",
			"children": [{
				"label": "东联片区",
				"value": "8214",
				"children": []
			}, {
				"label": "东河片区",
				"value": "8216",
				"children": []
			}, {
				"label": "韶关大学",
				"value": "8217",
				"children": []
			}, {
				"label": "犁市镇",
				"value": "8219",
				"children": []
			}, {
				"label": "花坪镇",
				"value": "8221",
				"children": []
			}, {
				"label": "乐园镇",
				"value": "8222",
				"children": []
			}, {
				"label": "五里亭",
				"value": "8223",
				"children": []
			}, {
				"label": "十里亭镇",
				"value": "8225",
				"children": []
			}, {
				"label": "南郊片区",
				"value": "8226",
				"children": []
			}]
		}]
	}, {
		"label": "河源市",
		"value": "1627",
		"children": [{
			"label": "和平县",
			"value": "1628",
			"children": [{
				"label": "阳明镇",
				"value": "6010",
				"children": []
			}, {
				"label": "彭寨镇",
				"value": "6011",
				"children": []
			}, {
				"label": "东水镇",
				"value": "6012",
				"children": []
			}, {
				"label": "林寨镇",
				"value": "6013",
				"children": []
			}, {
				"label": "热水镇",
				"value": "6014",
				"children": []
			}, {
				"label": "大坝镇",
				"value": "6015",
				"children": []
			}, {
				"label": "上陵镇",
				"value": "6016",
				"children": []
			}, {
				"label": "下车镇",
				"value": "6017",
				"children": []
			}, {
				"label": "贝墩镇",
				"value": "6018",
				"children": []
			}, {
				"label": "古寨镇",
				"value": "6019",
				"children": []
			}, {
				"label": "礼士镇",
				"value": "6020",
				"children": []
			}, {
				"label": "公白镇",
				"value": "6021",
				"children": []
			}, {
				"label": "合水镇",
				"value": "6022",
				"children": []
			}, {
				"label": "青州镇",
				"value": "6023",
				"children": []
			}, {
				"label": "浰源镇",
				"value": "6024",
				"children": []
			}, {
				"label": "优胜镇",
				"value": "6025",
				"children": []
			}]
		}, {
			"label": "龙川县",
			"value": "1629",
			"children": [{
				"label": "老隆镇",
				"value": "6026",
				"children": []
			}, {
				"label": "四都镇",
				"value": "6027",
				"children": []
			}, {
				"label": "黄石镇",
				"value": "6028",
				"children": []
			}, {
				"label": "细坳镇",
				"value": "6029",
				"children": []
			}, {
				"label": "车田镇",
				"value": "6030",
				"children": []
			}, {
				"label": "贝岭镇",
				"value": "6031",
				"children": []
			}, {
				"label": "黎咀镇",
				"value": "6032",
				"children": []
			}, {
				"label": "上坪镇",
				"value": "6033",
				"children": []
			}, {
				"label": "丰稔镇",
				"value": "6034",
				"children": []
			}, {
				"label": "赤光镇",
				"value": "6035",
				"children": []
			}, {
				"label": "龙母镇",
				"value": "6036",
				"children": []
			}, {
				"label": "回龙镇",
				"value": "6037",
				"children": []
			}, {
				"label": "铁场镇",
				"value": "6038",
				"children": []
			}, {
				"label": "登云镇",
				"value": "6039",
				"children": []
			}, {
				"label": "通衢镇",
				"value": "6040",
				"children": []
			}, {
				"label": "鹤市镇",
				"value": "6041",
				"children": []
			}, {
				"label": "黄布镇",
				"value": "6043",
				"children": []
			}, {
				"label": "紫市镇",
				"value": "6044",
				"children": []
			}, {
				"label": "佗城镇",
				"value": "6045",
				"children": []
			}, {
				"label": "岩镇",
				"value": "6046",
				"children": []
			}, {
				"label": "新田镇",
				"value": "6047",
				"children": []
			}, {
				"label": "附城镇",
				"value": "6048",
				"children": []
			}, {
				"label": "义都镇",
				"value": "6049",
				"children": []
			}, {
				"label": "麻布岗镇",
				"value": "6050",
				"children": []
			}]
		}, {
			"label": "紫金县",
			"value": "1630",
			"children": [{
				"label": "紫城镇",
				"value": "6051",
				"children": []
			}, {
				"label": "附城镇",
				"value": "6052",
				"children": []
			}, {
				"label": "九和镇",
				"value": "6053",
				"children": []
			}, {
				"label": "上义镇",
				"value": "6054",
				"children": []
			}, {
				"label": "蓝塘镇",
				"value": "6055",
				"children": []
			}, {
				"label": "凤安镇",
				"value": "6056",
				"children": []
			}, {
				"label": "义容镇",
				"value": "6057",
				"children": []
			}, {
				"label": "古竹镇",
				"value": "6058",
				"children": []
			}, {
				"label": "临江镇",
				"value": "6059",
				"children": []
			}, {
				"label": "柏埔镇",
				"value": "6060",
				"children": []
			}, {
				"label": "敬梓镇",
				"value": "6061",
				"children": []
			}, {
				"label": "乌石镇",
				"value": "6062",
				"children": []
			}, {
				"label": "水墩镇",
				"value": "6063",
				"children": []
			}, {
				"label": "南岭镇",
				"value": "6064",
				"children": []
			}, {
				"label": "苏区镇",
				"value": "6065",
				"children": []
			}, {
				"label": "瓦溪镇",
				"value": "6066",
				"children": []
			}, {
				"label": "好义镇",
				"value": "6067",
				"children": []
			}, {
				"label": "中坝镇",
				"value": "6068",
				"children": []
			}, {
				"label": "龙窝镇",
				"value": "6069",
				"children": []
			}]
		}, {
			"label": "连平县",
			"value": "1631",
			"children": [{
				"label": "元善镇",
				"value": "6071",
				"children": []
			}, {
				"label": "上坪镇",
				"value": "6072",
				"children": []
			}, {
				"label": "内莞镇",
				"value": "6073",
				"children": []
			}, {
				"label": "陂头镇",
				"value": "6074",
				"children": []
			}, {
				"label": "溪山镇",
				"value": "6075",
				"children": []
			}, {
				"label": "隆街镇",
				"value": "6076",
				"children": []
			}, {
				"label": "田源镇",
				"value": "6077",
				"children": []
			}, {
				"label": "油溪镇",
				"value": "6078",
				"children": []
			}, {
				"label": "忠信镇",
				"value": "6079",
				"children": []
			}, {
				"label": "高莞镇",
				"value": "6080",
				"children": []
			}, {
				"label": "大湖镇",
				"value": "6081",
				"children": []
			}, {
				"label": "三角镇",
				"value": "6082",
				"children": []
			}, {
				"label": "绣缎镇",
				"value": "6083",
				"children": []
			}]
		}, {
			"label": "源城区",
			"value": "53059",
		}, {
			"label": "东源县",
			"value": "53060",
		}]
	}, {
		"label": "梅州市",
		"value": "1634",
		"children": [{
			"label": "兴宁市",
			"value": "1635",
			"children": [{
				"label": "罗浮镇",
				"value": "8519",
				"children": []
			}, {
				"label": "罗岗镇",
				"value": "8520",
				"children": []
			}, {
				"label": "坭陂镇",
				"value": "8521",
				"children": []
			}, {
				"label": "石马镇",
				"value": "8522",
				"children": []
			}, {
				"label": "合水镇",
				"value": "8523",
				"children": []
			}, {
				"label": "新陂镇",
				"value": "8524",
				"children": []
			}, {
				"label": "永和镇",
				"value": "8525",
				"children": []
			}, {
				"label": "刁坊镇",
				"value": "8526",
				"children": []
			}, {
				"label": "径南镇",
				"value": "8527",
				"children": []
			}, {
				"label": "水口镇",
				"value": "8528",
				"children": []
			}, {
				"label": "黄陂镇",
				"value": "8529",
				"children": []
			}, {
				"label": "黄槐镇",
				"value": "8531",
				"children": []
			}, {
				"label": "宁中镇",
				"value": "8532",
				"children": []
			}, {
				"label": "龙田镇",
				"value": "8533",
				"children": []
			}, {
				"label": "叶塘镇",
				"value": "8534",
				"children": []
			}, {
				"label": "新圩镇",
				"value": "8535",
				"children": []
			}, {
				"label": "大坪镇",
				"value": "8536",
				"children": []
			}]
		}, {
			"label": "梅县",
			"value": "1636",
			"children": [{
				"label": "畲江镇",
				"value": "8420",
				"children": []
			}, {
				"label": "雁洋镇",
				"value": "8421",
				"children": []
			}, {
				"label": "石扇镇",
				"value": "8422",
				"children": []
			}, {
				"label": "白渡镇",
				"value": "8423",
				"children": []
			}, {
				"label": "梅西镇",
				"value": "8424",
				"children": []
			}, {
				"label": "南口镇",
				"value": "8425",
				"children": []
			}, {
				"label": "城东镇",
				"value": "8426",
				"children": []
			}, {
				"label": "梅县新城",
				"value": "8427",
				"children": []
			}, {
				"label": "梅南镇",
				"value": "8428",
				"children": []
			}, {
				"label": "程江镇",
				"value": "8429",
				"children": []
			}, {
				"label": "西阳镇",
				"value": "8430",
				"children": []
			}, {
				"label": "水车镇",
				"value": "8431",
				"children": []
			}, {
				"label": "松源镇",
				"value": "8432",
				"children": []
			}, {
				"label": "松口镇",
				"value": "8433",
				"children": []
			}, {
				"label": "梅西水库",
				"value": "8434",
				"children": []
			}, {
				"label": "桃尧镇",
				"value": "8435",
				"children": []
			}, {
				"label": "丙村镇",
				"value": "8436",
				"children": []
			}, {
				"label": "隆文镇",
				"value": "8437",
				"children": []
			}, {
				"label": "扶大镇",
				"value": "8438",
				"children": []
			}, {
				"label": "大坪镇",
				"value": "8439",
				"children": []
			}, {
				"label": "石坑镇",
				"value": "8440",
				"children": []
			}]
		}, {
			"label": "蕉岭县",
			"value": "1637",
			"children": [{
				"label": "文福镇",
				"value": "8509",
				"children": []
			}, {
				"label": "新铺镇",
				"value": "8510",
				"children": []
			}, {
				"label": "三圳镇",
				"value": "8511",
				"children": []
			}, {
				"label": "蓝坊镇",
				"value": "8512",
				"children": []
			}, {
				"label": "南礤镇",
				"value": "8513",
				"children": []
			}, {
				"label": "广福镇",
				"value": "8514",
				"children": []
			}, {
				"label": "华侨农场",
				"value": "8515",
				"children": []
			}, {
				"label": "蕉城镇",
				"value": "8516",
				"children": []
			}, {
				"label": "长潭镇",
				"value": "8517",
				"children": []
			}]
		}, {
			"label": "大埔县",
			"value": "1638",
			"children": [{
				"label": "青溪镇",
				"value": "8447",
				"children": []
			}, {
				"label": "银江镇",
				"value": "8448",
				"children": []
			}, {
				"label": "湖寮镇",
				"value": "8449",
				"children": []
			}, {
				"label": "三河镇",
				"value": "8450",
				"children": []
			}, {
				"label": "大麻镇",
				"value": "8451",
				"children": []
			}, {
				"label": "洲瑞镇",
				"value": "8452",
				"children": []
			}, {
				"label": "桃源镇",
				"value": "8453",
				"children": []
			}, {
				"label": "丰溪林场",
				"value": "8454",
				"children": []
			}, {
				"label": "光德镇",
				"value": "8455",
				"children": []
			}, {
				"label": "枫朗镇",
				"value": "8456",
				"children": []
			}, {
				"label": "洲瑞林场",
				"value": "8457",
				"children": []
			}, {
				"label": "高陂镇",
				"value": "8458",
				"children": []
			}, {
				"label": "大埔林场",
				"value": "8459",
				"children": []
			}, {
				"label": "大东镇",
				"value": "8460",
				"children": []
			}, {
				"label": "茶阳镇",
				"value": "8461",
				"children": []
			}, {
				"label": "百侯镇",
				"value": "8462",
				"children": []
			}, {
				"label": "西河镇",
				"value": "8463",
				"children": []
			}]
		}, {
			"label": "丰顺县",
			"value": "1639",
			"children": [{
				"label": "汤南镇",
				"value": "8464",
				"children": []
			}, {
				"label": "汤西镇",
				"value": "8465",
				"children": []
			}, {
				"label": "砂田镇",
				"value": "8466",
				"children": []
			}, {
				"label": "大龙华镇",
				"value": "8467",
				"children": []
			}, {
				"label": "埔寨镇",
				"value": "8468",
				"children": []
			}, {
				"label": "八乡山镇",
				"value": "8469",
				"children": []
			}, {
				"label": "潘田镇",
				"value": "8470",
				"children": []
			}, {
				"label": "龙岗镇",
				"value": "8471",
				"children": []
			}, {
				"label": "黄金镇",
				"value": "8472",
				"children": []
			}, {
				"label": "建桥镇",
				"value": "8473",
				"children": []
			}, {
				"label": "汤坑镇",
				"value": "8474",
				"children": []
			}, {
				"label": "留隍镇",
				"value": "8475",
				"children": []
			}, {
				"label": "北斗镇",
				"value": "8476",
				"children": []
			}, {
				"label": "埔寨农场",
				"value": "8477",
				"children": []
			}, {
				"label": "丰良镇",
				"value": "8478",
				"children": []
			}, {
				"label": "潭江镇",
				"value": "8479",
				"children": []
			}, {
				"label": "小胜镇",
				"value": "8480",
				"children": []
			}]
		}, {
			"label": "五华县",
			"value": "1640",
			"children": [{
				"label": "棉洋镇",
				"value": "8481",
				"children": []
			}, {
				"label": "郭田镇",
				"value": "8482",
				"children": []
			}, {
				"label": "潭下镇",
				"value": "8483",
				"children": []
			}, {
				"label": "周江镇",
				"value": "8484",
				"children": []
			}, {
				"label": "岐岭镇",
				"value": "8485",
				"children": []
			}, {
				"label": "横陂镇",
				"value": "8486",
				"children": []
			}, {
				"label": "华城镇",
				"value": "8487",
				"children": []
			}, {
				"label": "安流镇",
				"value": "8488",
				"children": []
			}, {
				"label": "转水镇",
				"value": "8489",
				"children": []
			}, {
				"label": "华阳镇",
				"value": "8490",
				"children": []
			}, {
				"label": "长布镇",
				"value": "8491",
				"children": []
			}, {
				"label": "水寨镇",
				"value": "8492",
				"children": []
			}, {
				"label": "河东镇",
				"value": "8493",
				"children": []
			}, {
				"label": "梅林镇",
				"value": "8494",
				"children": []
			}, {
				"label": "龙村镇",
				"value": "8495",
				"children": []
			}, {
				"label": "双华镇",
				"value": "8496",
				"children": []
			}]
		}, {
			"label": "平远县",
			"value": "1641",
			"children": [{
				"label": "热柘镇",
				"value": "8497",
				"children": []
			}, {
				"label": "长田镇",
				"value": "8498",
				"children": []
			}, {
				"label": "大柘镇",
				"value": "8499",
				"children": []
			}, {
				"label": "仁居镇",
				"value": "8500",
				"children": []
			}, {
				"label": "泗水镇",
				"value": "8501",
				"children": []
			}, {
				"label": "河头镇",
				"value": "8502",
				"children": []
			}, {
				"label": "上举镇",
				"value": "8503",
				"children": []
			}, {
				"label": "差干镇",
				"value": "8504",
				"children": []
			}, {
				"label": "八尺镇",
				"value": "8505",
				"children": []
			}, {
				"label": "石正镇",
				"value": "8506",
				"children": []
			}, {
				"label": "东石镇",
				"value": "8507",
				"children": []
			}, {
				"label": "中行镇",
				"value": "8508",
				"children": []
			}]
		}, {
			"label": "梅江区",
			"value": "1642",
			"children": [{
				"label": "江北片区",
				"value": "8441",
				"children": []
			}, {
				"label": "三角镇",
				"value": "8442",
				"children": []
			}, {
				"label": "城北镇",
				"value": "8444",
				"children": []
			}, {
				"label": "江南市区",
				"value": "8445",
				"children": []
			}, {
				"label": "长沙镇",
				"value": "8446",
				"children": []
			}]
		}]
	}, {
		"label": "惠州市",
		"value": "1643",
		"children": [{
			"label": "龙门县",
			"value": "1647",
		}, {
			"label": "惠阳区",
			"value": "53061",
		}, {
			"label": "大亚湾区",
			"value": "53062",
		}, {
			"label": "惠城区",
			"value": "53063",
		}, {
			"label": "惠东县",
			"value": "53064",
		}, {
			"label": "博罗县",
			"value": "53065",
		}]
	}, {
		"label": "汕尾市",
		"value": "1650",
		"children": [{
			"label": "陆河县",
			"value": "1653",
			"children": [{
				"label": "河田镇",
				"value": "6145",
				"children": []
			}, {
				"label": "新田镇",
				"value": "6146",
				"children": []
			}, {
				"label": "南万镇",
				"value": "6147",
				"children": []
			}, {
				"label": "螺溪镇",
				"value": "6148",
				"children": []
			}, {
				"label": "河口镇",
				"value": "6149",
				"children": []
			}, {
				"label": "东坑镇",
				"value": "6150",
				"children": []
			}, {
				"label": "水唇镇",
				"value": "6151",
				"children": []
			}, {
				"label": "上护镇",
				"value": "6152",
				"children": []
			}]
		}, {
			"label": "海丰县",
			"value": "3037",
			"children": [{
				"label": "海城镇",
				"value": "6153",
				"children": []
			}, {
				"label": "梅陇镇",
				"value": "6154",
				"children": []
			}, {
				"label": "附城镇",
				"value": "6155",
				"children": []
			}, {
				"label": "联安镇",
				"value": "6156",
				"children": []
			}, {
				"label": "陶河镇",
				"value": "6157",
				"children": []
			}, {
				"label": "可塘镇",
				"value": "6158",
				"children": []
			}, {
				"label": "赤坑镇",
				"value": "6159",
				"children": []
			}, {
				"label": "公平镇",
				"value": "6160",
				"children": []
			}, {
				"label": "城东镇",
				"value": "6161",
				"children": []
			}, {
				"label": "黄羌镇",
				"value": "6162",
				"children": []
			}, {
				"label": "平东镇",
				"value": "6163",
				"children": []
			}, {
				"label": "鹅埠镇",
				"value": "6164",
				"children": []
			}, {
				"label": "赤石镇",
				"value": "6165",
				"children": []
			}, {
				"label": "鮜门镇",
				"value": "6166",
				"children": []
			}, {
				"label": "小漠镇",
				"value": "6167",
				"children": []
			}, {
				"label": "大湖镇",
				"value": "6168",
				"children": []
			}]
		}, {
			"label": "城区",
			"value": "53067",
		}, {
			"label": "陆丰市",
			"value": "53068",
		}]
	}, {
		"label": "东莞市",
		"value": "1655",
		"children": [{
			"label": "中堂镇",
			"value": "2950",
		}, {
			"label": "东坑镇",
			"value": "3041",
		}, {
			"label": "道滘镇",
			"value": "3078",
		}, {
			"label": "沙田镇",
			"value": "3097",
		}, {
			"label": "高埗镇",
			"value": "3100",
		}, {
			"label": "石龙镇",
			"value": "3102",
		}, {
			"label": "石排镇",
			"value": "3104",
		}, {
			"label": "企石镇",
			"value": "3105",
		}, {
			"label": "石碣镇",
			"value": "3111",
		}, {
			"label": "洪梅镇",
			"value": "3116",
		}, {
			"label": "麻涌镇",
			"value": "3120",
		}, {
			"label": "桥头镇",
			"value": "3134",
		}, {
			"label": "望牛墩镇",
			"value": "3151",
		}, {
			"label": "茶山镇",
			"value": "3171",
		}, {
			"label": "谢岗镇",
			"value": "4087",
		}, {
			"label": "松山湖",
			"value": "4147",
		}, {
			"label": "莞城区",
			"value": "4255",
		}, {
			"label": "南城区",
			"value": "4256",
		}, {
			"label": "长安镇",
			"value": "4760",
		}, {
			"label": "寮步镇",
			"value": "4866",
		}, {
			"label": "大岭山镇",
			"value": "4871",
		}, {
			"label": "常平镇",
			"value": "4886",
		}, {
			"label": "厚街镇",
			"value": "4910",
		}, {
			"label": "万江区",
			"value": "4911",
		}, {
			"label": "樟木头镇",
			"value": "4932",
		}, {
			"label": "大朗镇",
			"value": "4980",
		}, {
			"label": "塘厦镇",
			"value": "5457",
		}, {
			"label": "凤岗镇",
			"value": "5473",
		}, {
			"label": "清溪镇",
			"value": "5869",
		}, {
			"label": "横沥镇",
			"value": "5905",
		}, {
			"label": "东城区",
			"value": "53069",
		}, {
			"label": "黄江镇",
			"value": "53070",
		}, {
			"label": "虎门镇",
			"value": "53071",
		}]
	}, {
		"label": "中山市",
		"value": "1657",
		"children": [{
			"label": "南朗镇",
			"value": "2777",
		}, {
			"label": "小榄镇",
			"value": "2902",
		}, {
			"label": "古镇",
			"value": "2957",
		}, {
			"label": "坦洲镇",
			"value": "3001",
		}, {
			"label": "黄圃镇",
			"value": "3007",
		}, {
			"label": "三乡镇",
			"value": "3016",
		}, {
			"label": "东凤镇",
			"value": "3067",
		}, {
			"label": "横栏镇",
			"value": "3112",
		}, {
			"label": "三角镇",
			"value": "3143",
		}, {
			"label": "南头镇",
			"value": "3176",
		}, {
			"label": "沙溪镇",
			"value": "3743",
		}, {
			"label": "五桂山镇",
			"value": "4042",
		}, {
			"label": "阜沙镇",
			"value": "4076",
		}, {
			"label": "东升镇",
			"value": "4080",
		}, {
			"label": "板芙镇",
			"value": "4102",
		}, {
			"label": "神湾镇",
			"value": "4127",
		}, {
			"label": "港口镇",
			"value": "4141",
		}, {
			"label": "大涌镇",
			"value": "4190",
		}, {
			"label": "火炬开发区",
			"value": "4852",
		}, {
			"label": "民众镇",
			"value": "8540",
		}, {
			"label": "沙朗镇",
			"value": "53072",
		}, {
			"label": "城区",
			"value": "53073",
		}]
	}, {
		"label": "江门市",
		"value": "1659",
		"children": [{
			"label": "台山市",
			"value": "53074",
		}, {
			"label": "新会区",
			"value": "53075",
		}, {
			"label": "鹤山市",
			"value": "53076",
		}, {
			"label": "江海区",
			"value": "53077",
		}, {
			"label": "蓬江区",
			"value": "53078",
		}, {
			"label": "开平市",
			"value": "53079",
		}, {
			"label": "恩平市",
			"value": "53080",
		}]
	}, {
		"label": "佛山市",
		"value": "1666",
		"children": [{
			"label": "顺德区",
			"value": "1669",
		}, {
			"label": "禅城区",
			"value": "53081",
		}, {
			"label": "高明区",
			"value": "53082",
		}, {
			"label": "三水区",
			"value": "53083",
		}, {
			"label": "南海区",
			"value": "53084",
		}]
	}, {
		"label": "阳江市",
		"value": "1672",
		"children": [{
			"label": "阳春市",
			"value": "1673",
			"children": [{
				"label": "八甲镇",
				"value": "6475",
				"children": []
			}, {
				"label": "陂面镇",
				"value": "6476",
				"children": []
			}, {
				"label": "合水镇",
				"value": "6477",
				"children": []
			}, {
				"label": "春湾镇",
				"value": "6479",
				"children": []
			}, {
				"label": "岗美镇",
				"value": "6480",
				"children": []
			}, {
				"label": "圭岗镇",
				"value": "6481",
				"children": []
			}, {
				"label": "石望镇",
				"value": "6482",
				"children": []
			}, {
				"label": "河口镇",
				"value": "6483",
				"children": []
			}, {
				"label": "河塱镇",
				"value": "6484",
				"children": []
			}, {
				"label": "松柏镇",
				"value": "6485",
				"children": []
			}, {
				"label": "马水镇",
				"value": "6486",
				"children": []
			}, {
				"label": "三甲镇",
				"value": "6487",
				"children": []
			}, {
				"label": "双窖镇",
				"value": "6488",
				"children": []
			}, {
				"label": "潭水镇",
				"value": "6489",
				"children": []
			}, {
				"label": "永宁镇",
				"value": "6490",
				"children": []
			}]
		}, {
			"label": "阳西县",
			"value": "1674",
			"children": [{
				"label": "织篢镇",
				"value": "6493",
				"children": []
			}, {
				"label": "程村镇",
				"value": "6494",
				"children": []
			}, {
				"label": "溪头镇",
				"value": "6495",
				"children": []
			}, {
				"label": "上洋镇",
				"value": "6496",
				"children": []
			}, {
				"label": "沙扒镇",
				"value": "6497",
				"children": []
			}, {
				"label": "儒洞镇",
				"value": "6498",
				"children": []
			}, {
				"label": "新圩镇",
				"value": "6499",
				"children": []
			}, {
				"label": "塘口镇",
				"value": "6500",
				"children": []
			}]
		}, {
			"label": "江城区",
			"value": "53085",
		}, {
			"label": "阳东县",
			"value": "53086",
		}]
	}, {
		"label": "湛江市",
		"value": "1677",
		"children": [{
			"label": "雷州市",
			"value": "1679",
			"children": [{
				"label": "白沙镇",
				"value": "6385",
				"children": []
			}, {
				"label": "北和镇",
				"value": "6386",
				"children": []
			}, {
				"label": "东里镇",
				"value": "6387",
				"children": []
			}, {
				"label": "附城镇",
				"value": "6388",
				"children": []
			}, {
				"label": "纪家镇",
				"value": "6389",
				"children": []
			}, {
				"label": "雷高镇",
				"value": "6391",
				"children": []
			}, {
				"label": "龙门镇",
				"value": "6392",
				"children": []
			}, {
				"label": "南兴镇",
				"value": "6393",
				"children": []
			}, {
				"label": "企水镇",
				"value": "6394",
				"children": []
			}, {
				"label": "沈塘镇",
				"value": "6395",
				"children": []
			}, {
				"label": "松竹镇",
				"value": "6396",
				"children": []
			}, {
				"label": "覃斗镇",
				"value": "6397",
				"children": []
			}, {
				"label": "唐家镇",
				"value": "6398",
				"children": []
			}, {
				"label": "调风镇",
				"value": "6399",
				"children": []
			}, {
				"label": "乌石镇",
				"value": "6400",
				"children": []
			}, {
				"label": "客路镇",
				"value": "6402",
				"children": []
			}, {
				"label": "杨家镇",
				"value": "6404",
				"children": []
			}, {
				"label": "英利镇",
				"value": "6405",
				"children": []
			}]
		}, {
			"label": "吴川市",
			"value": "1680",
			"children": [{
				"label": "黄坡镇",
				"value": "6410",
				"children": []
			}, {
				"label": "兰石镇",
				"value": "6411",
				"children": []
			}, {
				"label": "覃巴镇",
				"value": "6413",
				"children": []
			}, {
				"label": "塘缀镇",
				"value": "6415",
				"children": []
			}, {
				"label": "王村港",
				"value": "6416",
				"children": []
			}, {
				"label": "吴阳镇",
				"value": "6417",
				"children": []
			}, {
				"label": "樟铺镇",
				"value": "6418",
				"children": []
			}, {
				"label": "长岐镇",
				"value": "6419",
				"children": []
			}, {
				"label": "振文镇",
				"value": "6420",
				"children": []
			}, {
				"label": "浅水镇",
				"value": "6422",
				"children": []
			}]
		}, {
			"label": "徐闻县",
			"value": "1682",
			"children": [{
				"label": "和安镇",
				"value": "6424",
				"children": []
			}, {
				"label": "曲界镇",
				"value": "6425",
				"children": []
			}, {
				"label": "锦和镇",
				"value": "6426",
				"children": []
			}, {
				"label": "新寮镇",
				"value": "6427",
				"children": []
			}, {
				"label": "下洋镇",
				"value": "6428",
				"children": []
			}, {
				"label": "前山镇",
				"value": "6429",
				"children": []
			}, {
				"label": "龙塘镇",
				"value": "6430",
				"children": []
			}, {
				"label": "海安镇",
				"value": "6431",
				"children": []
			}, {
				"label": "迈陈镇",
				"value": "6432",
				"children": []
			}, {
				"label": "西连镇",
				"value": "6433",
				"children": []
			}, {
				"label": "下桥镇",
				"value": "6434",
				"children": []
			}, {
				"label": "南山镇",
				"value": "6435",
				"children": []
			}, {
				"label": "城北乡",
				"value": "6436",
				"children": []
			}, {
				"label": "角尾乡",
				"value": "6437",
				"children": []
			}]
		}, {
			"label": "坡头区",
			"value": "3646",
			"children": [{
				"label": "坡头镇",
				"value": "6447",
				"children": []
			}, {
				"label": "龙头镇",
				"value": "6448",
				"children": []
			}, {
				"label": "乾塘镇",
				"value": "6449",
				"children": []
			}, {
				"label": "南三镇",
				"value": "6450",
				"children": []
			}, {
				"label": "官渡镇",
				"value": "6451",
				"children": []
			}]
		}, {
			"label": "赤坎区",
			"value": "53087",
		}, {
			"label": "霞山区",
			"value": "53088",
		}, {
			"label": "经济技术开发区",
			"value": "53089",
		}, {
			"label": "麻章区",
			"value": "53090",
		}, {
			"label": "遂溪县",
			"value": "53091",
		}, {
			"label": "廉江市",
			"value": "53092",
		}]
	}, {
		"label": "茂名市",
		"value": "1684",
		"children": [{
			"label": "信宜市",
			"value": "1687",
			"children": [{
				"label": "白石镇",
				"value": "6219",
				"children": []
			}, {
				"label": "北界镇",
				"value": "6220",
				"children": []
			}, {
				"label": "茶山镇",
				"value": "6221",
				"children": []
			}, {
				"label": "池洞镇",
				"value": "6222",
				"children": []
			}, {
				"label": "大成镇",
				"value": "6223",
				"children": []
			}, {
				"label": "丁堡镇",
				"value": "6224",
				"children": []
			}, {
				"label": "贵子镇",
				"value": "6226",
				"children": []
			}, {
				"label": "合水镇",
				"value": "6227",
				"children": []
			}, {
				"label": "洪冠镇",
				"value": "6228",
				"children": []
			}, {
				"label": "怀乡镇",
				"value": "6229",
				"children": []
			}, {
				"label": "金垌镇",
				"value": "6230",
				"children": []
			}, {
				"label": "平塘镇",
				"value": "6231",
				"children": []
			}, {
				"label": "钱排镇",
				"value": "6232",
				"children": []
			}, {
				"label": "水口镇",
				"value": "6233",
				"children": []
			}, {
				"label": "思贺镇",
				"value": "6234",
				"children": []
			}, {
				"label": "新宝镇",
				"value": "6235",
				"children": []
			}, {
				"label": "镇隆镇",
				"value": "6236",
				"children": []
			}, {
				"label": "朱砂镇",
				"value": "6237",
				"children": []
			}]
		}, {
			"label": "茂南区",
			"value": "53093",
		}, {
			"label": "电白区",
			"value": "53094",
		}, {
			"label": "高州市",
			"value": "53095",
		}, {
			"label": "化州市",
			"value": "53096",
		}]
	}, {
		"label": "肇庆市",
		"value": "1690",
		"children": [{
			"label": "广宁县",
			"value": "1693",
		}, {
			"label": "德庆县",
			"value": "1694",
		}, {
			"label": "怀集县",
			"value": "1695",
		}, {
			"label": "封开县",
			"value": "1696",
		}, {
			"label": "鼎湖区",
			"value": "1697",
		}, {
			"label": "端州区",
			"value": "4781",
		}, {
			"label": "四会市",
			"value": "53097",
		}, {
			"label": "高要市",
			"value": "53098",
		}]
	}, {
		"label": "云浮市",
		"value": "1698",
		"children": [{
			"label": "云安县",
			"value": "1700",
			"children": [{
				"label": "六都镇",
				"value": "6525",
				"children": []
			}, {
				"label": "前锋镇",
				"value": "6526",
				"children": []
			}, {
				"label": "南盛镇",
				"value": "6527",
				"children": []
			}, {
				"label": "富林镇",
				"value": "6528",
				"children": []
			}, {
				"label": "镇安镇",
				"value": "6529",
				"children": []
			}, {
				"label": "白石镇",
				"value": "6530",
				"children": []
			}, {
				"label": "高村镇",
				"value": "6531",
				"children": []
			}, {
				"label": "石城镇",
				"value": "6532",
				"children": []
			}]
		}, {
			"label": "新兴县",
			"value": "1701",
			"children": [{
				"label": "新城镇",
				"value": "6533",
				"children": []
			}, {
				"label": "水台镇",
				"value": "6534",
				"children": []
			}, {
				"label": "车岗镇",
				"value": "6535",
				"children": []
			}, {
				"label": "东成镇",
				"value": "6536",
				"children": []
			}, {
				"label": "稔村镇",
				"value": "6537",
				"children": []
			}, {
				"label": "太平镇",
				"value": "6538",
				"children": []
			}, {
				"label": "六祖镇",
				"value": "6539",
				"children": []
			}, {
				"label": "大江镇",
				"value": "6540",
				"children": []
			}, {
				"label": "河头镇",
				"value": "6541",
				"children": []
			}, {
				"label": "天堂镇",
				"value": "6542",
				"children": []
			}, {
				"label": "簕竹镇",
				"value": "6543",
				"children": []
			}, {
				"label": "里洞镇",
				"value": "6544",
				"children": []
			}]
		}, {
			"label": "郁南县",
			"value": "1702",
			"children": [{
				"label": "都城镇",
				"value": "6545",
				"children": []
			}, {
				"label": "东坝镇",
				"value": "6546",
				"children": []
			}, {
				"label": "宋桂镇",
				"value": "6547",
				"children": []
			}, {
				"label": "连滩镇",
				"value": "6548",
				"children": []
			}, {
				"label": "大湾镇",
				"value": "6549",
				"children": []
			}, {
				"label": "建城镇",
				"value": "6551",
				"children": []
			}, {
				"label": "千官镇",
				"value": "6552",
				"children": []
			}, {
				"label": "通门镇",
				"value": "6553",
				"children": []
			}, {
				"label": "桂圩镇",
				"value": "6554",
				"children": []
			}, {
				"label": "宝珠镇",
				"value": "6555",
				"children": []
			}, {
				"label": "历洞镇",
				"value": "6556",
				"children": []
			}, {
				"label": "大方镇",
				"value": "6557",
				"children": []
			}, {
				"label": "南江口镇",
				"value": "6558",
				"children": []
			}, {
				"label": "平台镇",
				"value": "6559",
				"children": []
			}]
		}, {
			"label": "云城区",
			"value": "53100",
		}, {
			"label": "罗定市",
			"value": "53101",
		}]
	}, {
		"label": "清远市",
		"value": "1704",
		"children": [{
			"label": "连州市",
			"value": "1795",
		}, {
			"label": "佛冈县",
			"value": "1796",
		}, {
			"label": "阳山县",
			"value": "1797",
		}, {
			"label": "清新县",
			"value": "1798",
		}, {
			"label": "连山县",
			"value": "1799",
		}, {
			"label": "连南县",
			"value": "1800",
		}, {
			"label": "清城区",
			"value": "53102",
		}, {
			"label": "英德市",
			"value": "53103",
		}]
	}, {
		"label": "潮州市",
		"value": "1705",
		"children": [{
			"label": "饶平县",
			"value": "1707",
		}, {
			"label": "枫溪区",
			"value": "4238",
		}, {
			"label": "湘桥区",
			"value": "53104",
		}, {
			"label": "潮安区",
			"value": "53105",
		}]
	}, {
		"label": "揭阳市",
		"value": "1709",
		"children": [{
			"label": "揭西县",
			"value": "1712",
			"children": [{
				"label": "龙潭镇",
				"value": "6086",
				"children": []
			}, {
				"label": "南山镇",
				"value": "6087",
				"children": []
			}, {
				"label": "五经富镇",
				"value": "6088",
				"children": []
			}, {
				"label": "京溪园镇",
				"value": "6089",
				"children": []
			}, {
				"label": "灰寨镇",
				"value": "6090",
				"children": []
			}, {
				"label": "塔头镇",
				"value": "6091",
				"children": []
			}, {
				"label": "东园镇",
				"value": "6092",
				"children": []
			}, {
				"label": "棉湖镇",
				"value": "6093",
				"children": []
			}, {
				"label": "金和镇",
				"value": "6094",
				"children": []
			}, {
				"label": "大溪镇",
				"value": "6095",
				"children": []
			}, {
				"label": "钱坑镇",
				"value": "6096",
				"children": []
			}, {
				"label": "坪上镇",
				"value": "6097",
				"children": []
			}, {
				"label": "五云镇",
				"value": "6098",
				"children": []
			}, {
				"label": "上砂镇",
				"value": "6099",
				"children": []
			}, {
				"label": "良田乡",
				"value": "6100",
				"children": []
			}]
		}, {
			"label": "惠来县",
			"value": "1713",
			"children": [{
				"label": "惠城镇",
				"value": "6101",
				"children": []
			}, {
				"label": "华湖镇",
				"value": "6102",
				"children": []
			}, {
				"label": "仙庵镇",
				"value": "6103",
				"children": []
			}, {
				"label": "靖海镇",
				"value": "6104",
				"children": []
			}, {
				"label": "周田镇",
				"value": "6105",
				"children": []
			}, {
				"label": "前詹镇",
				"value": "6106",
				"children": []
			}, {
				"label": "神泉镇",
				"value": "6107",
				"children": []
			}, {
				"label": "东陇镇",
				"value": "6108",
				"children": []
			}, {
				"label": "岐石镇",
				"value": "6109",
				"children": []
			}, {
				"label": "隆江镇",
				"value": "6110",
				"children": []
			}, {
				"label": "溪西镇",
				"value": "6111",
				"children": []
			}, {
				"label": "鳌江镇",
				"value": "6112",
				"children": []
			}, {
				"label": "东港镇",
				"value": "6113",
				"children": []
			}, {
				"label": "葵潭镇",
				"value": "6114",
				"children": []
			}]
		}, {
			"label": "东山区",
			"value": "5484",
		}, {
			"label": "普宁市",
			"value": "5864",
		}, {
			"label": "榕城区",
			"value": "53106",
		}, {
			"label": "揭东县",
			"value": "53107",
		}]
	}]
}, {
	"label": "广西",
	"value": "20",
	"children": [{
		"label": "南宁市",
		"value": "1715",
		"children": [{
			"label": "武鸣县",
			"value": "1716",
		}, {
			"label": "邕宁区",
			"value": "1724",
		}, {
			"label": "宾阳县",
			"value": "3005",
		}, {
			"label": "横县",
			"value": "3650",
		}, {
			"label": "上林县",
			"value": "3651",
		}, {
			"label": "隆安县",
			"value": "3652",
		}, {
			"label": "马山县",
			"value": "3653",
		}, {
			"label": "良庆区",
			"value": "53678",
		}, {
			"label": "江南区",
			"value": "53679",
		}, {
			"label": "兴宁区",
			"value": "53680",
		}, {
			"label": "青秀区",
			"value": "53681",
		}, {
			"label": "西乡塘区",
			"value": "53682",
		}]
	}, {
		"label": "柳州市",
		"value": "1720",
		"children": [{
			"label": "柳江县",
			"value": "1721",
		}, {
			"label": "柳城县",
			"value": "1722",
		}, {
			"label": "鹿寨县",
			"value": "1725",
		}, {
			"label": "融安县",
			"value": "3659",
		}, {
			"label": "三江县",
			"value": "3660",
		}, {
			"label": "融水县",
			"value": "3661",
		}, {
			"label": "鱼峰区",
			"value": "53683",
		}, {
			"label": "城中区",
			"value": "53684",
		}, {
			"label": "柳南区",
			"value": "53685",
		}, {
			"label": "柳北区",
			"value": "53686",
		}]
	}, {
		"label": "桂林市",
		"value": "1726",
		"children": [{
			"label": "阳朔县",
			"value": "1727",
		}, {
			"label": "临桂县",
			"value": "1728",
		}, {
			"label": "灵川县",
			"value": "1729",
		}, {
			"label": "全州县",
			"value": "1730",
		}, {
			"label": "平乐县",
			"value": "1731",
		}, {
			"label": "兴安县",
			"value": "1732",
		}, {
			"label": "灌阳县",
			"value": "1733",
		}, {
			"label": "荔浦县",
			"value": "1734",
		}, {
			"label": "资源县",
			"value": "1735",
		}, {
			"label": "永福县",
			"value": "1736",
		}, {
			"label": "龙胜县",
			"value": "1738",
		}, {
			"label": "恭城县",
			"value": "3666",
		}, {
			"label": "象山区",
			"value": "3670",
		}, {
			"label": "雁山区",
			"value": "4457",
		}, {
			"label": "秀峰区",
			"value": "53687",
		}, {
			"label": "叠彩区",
			"value": "53688",
		}, {
			"label": "七星区",
			"value": "53689",
		}]
	}, {
		"label": "梧州市",
		"value": "1740",
		"children": [{
			"label": "岑溪市",
			"value": "1741",
		}, {
			"label": "苍梧县",
			"value": "1742",
		}, {
			"label": "藤县",
			"value": "1743",
		}, {
			"label": "蒙山县",
			"value": "1744",
		}, {
			"label": "万秀区",
			"value": "53690",
		}, {
			"label": "蝶山区",
			"value": "53691",
		}, {
			"label": "长洲区",
			"value": "53692",
		}, {
			"label": "龙圩区",
			"value": "53693",
		}]
	}, {
		"label": "北海市",
		"value": "1746",
		"children": [{
			"label": "合浦县",
			"value": "1747",
		}, {
			"label": "铁山港区",
			"value": "1748",
		}, {
			"label": "海城区",
			"value": "53694",
		}, {
			"label": "银海区",
			"value": "53695",
		}]
	}, {
		"label": "防城港市",
		"value": "1749",
		"children": [{
			"label": "东兴市",
			"value": "1750",
		}, {
			"label": "上思县",
			"value": "1751",
		}, {
			"label": "防城区",
			"value": "53696",
		}, {
			"label": "港口区",
			"value": "53697",
		}]
	}, {
		"label": "钦州市",
		"value": "1753",
		"children": [{
			"label": "浦北县",
			"value": "1754",
		}, {
			"label": "灵山县",
			"value": "1755",
		}, {
			"label": "钦北区",
			"value": "2999",
		}, {
			"label": "钦南区",
			"value": "53698",
		}]
	}, {
		"label": "贵港市",
		"value": "1757",
		"children": [{
			"label": "桂平市",
			"value": "1758",
		}, {
			"label": "平南县",
			"value": "1759",
		}, {
			"label": "覃塘区",
			"value": "1760",
		}, {
			"label": "港南区",
			"value": "53699",
		}, {
			"label": "港北区",
			"value": "53700",
		}]
	}, {
		"label": "玉林市",
		"value": "1761",
		"children": [{
			"label": "北流市",
			"value": "1762",
		}, {
			"label": "容县",
			"value": "1763",
		}, {
			"label": "博白县",
			"value": "1764",
		}, {
			"label": "陆川县",
			"value": "1765",
		}, {
			"label": "兴业县",
			"value": "1766",
		}, {
			"label": "玉州区",
			"value": "53701",
		}, {
			"label": "福绵区",
			"value": "53702",
		}]
	}, {
		"label": "贺州市",
		"value": "1792",
		"children": [{
			"label": "钟山县",
			"value": "1803",
		}, {
			"label": "昭平县",
			"value": "1804",
		}, {
			"label": "富川县",
			"value": "1805",
		}, {
			"label": "平桂管理区",
			"value": "53703",
		}, {
			"label": "八步区",
			"value": "53704",
		}]
	}, {
		"label": "百色市",
		"value": "1806",
		"children": [{
			"label": "右江区",
			"value": "1807",
		}, {
			"label": "平果县",
			"value": "1808",
		}, {
			"label": "乐业县",
			"value": "1809",
		}, {
			"label": "田阳县",
			"value": "1810",
		}, {
			"label": "西林县",
			"value": "1811",
		}, {
			"label": "田林县",
			"value": "1812",
		}, {
			"label": "德保县",
			"value": "1813",
		}, {
			"label": "靖西县",
			"value": "1814",
		}, {
			"label": "田东县",
			"value": "1815",
		}, {
			"label": "那坡县",
			"value": "1816",
		}, {
			"label": "隆林县",
			"value": "1817",
		}, {
			"label": "凌云县",
			"value": "3678",
		}]
	}, {
		"label": "河池市",
		"value": "1818",
		"children": [{
			"label": "宜州市",
			"value": "1820",
		}, {
			"label": "天峨县",
			"value": "1821",
		}, {
			"label": "凤山县",
			"value": "1822",
		}, {
			"label": "南丹县",
			"value": "1823",
		}, {
			"label": "东兰县",
			"value": "1824",
		}, {
			"label": "巴马县",
			"value": "1825",
		}, {
			"label": "环江县",
			"value": "1826",
		}, {
			"label": "罗城县",
			"value": "2991",
		}, {
			"label": "大化县",
			"value": "3152",
		}, {
			"label": "都安县",
			"value": "3679",
		}, {
			"label": "金城江区",
			"value": "3680",
		}]
	}, {
		"label": "来宾市",
		"value": "3044",
		"children": [{
			"label": "兴宾区",
			"value": "3046",
		}, {
			"label": "合山市",
			"value": "3047",
		}, {
			"label": "忻城县",
			"value": "3048",
		}, {
			"label": "武宣县",
			"value": "3049",
		}, {
			"label": "象州县",
			"value": "3050",
		}, {
			"label": "金秀县",
			"value": "3051",
		}]
	}, {
		"label": "崇左市",
		"value": "3168",
		"children": [{
			"label": "江州区",
			"value": "3169",
		}, {
			"label": "凭祥市",
			"value": "3681",
		}, {
			"label": "扶绥县",
			"value": "3682",
		}, {
			"label": "大新县",
			"value": "3683",
		}, {
			"label": "天等县",
			"value": "3684",
		}, {
			"label": "宁明县",
			"value": "3685",
		}, {
			"label": "龙州县",
			"value": "3686",
		}]
	}]
}, {
	"label": "江西",
	"value": "21",
	"children": [{
		"label": "南昌市",
		"value": "1827",
		"children": [{
			"label": "南昌县",
			"value": "1828",
		}, {
			"label": "进贤县",
			"value": "1829",
		}, {
			"label": "安义县",
			"value": "1830",
		}, {
			"label": "新建县",
			"value": "3502",
		}, {
			"label": "湾里区",
			"value": "3504",
		}, {
			"label": "青云谱区",
			"value": "3505",
		}, {
			"label": "西湖区",
			"value": "3506",
		}, {
			"label": "东湖区",
			"value": "3507",
		}, {
			"label": "高新区",
			"value": "4039",
		}, {
			"label": "昌北区",
			"value": "4101",
		}, {
			"label": "青山湖区",
			"value": "53705",
		}, {
			"label": "红谷滩新区",
			"value": "53706",
		}]
	}, {
		"label": "景德镇市",
		"value": "1832",
		"children": [{
			"label": "乐平市",
			"value": "1833",
		}, {
			"label": "浮梁县",
			"value": "1834",
		}, {
			"label": "珠山区",
			"value": "3508",
		}, {
			"label": "昌江区",
			"value": "53707",
		}]
	}, {
		"label": "萍乡市",
		"value": "1836",
		"children": [{
			"label": "湘东区",
			"value": "1837",
		}, {
			"label": "莲花县",
			"value": "1838",
		}, {
			"label": "上栗县",
			"value": "1839",
		}, {
			"label": "芦溪县",
			"value": "1840",
		}, {
			"label": "安源区",
			"value": "53708",
		}]
	}, {
		"label": "新余市",
		"value": "1842",
		"children": [{
			"label": "分宜县",
			"value": "1843",
		}, {
			"label": "渝水区",
			"value": "53709",
		}]
	}, {
		"label": "九江市",
		"value": "1845",
		"children": [{
			"label": "柴桑区",
			"value": "1846",
		}, {
			"label": "瑞昌市",
			"value": "1847",
		}, {
			"label": "泸州市",
			"value": "1848",
		}, {
			"label": "武宁县",
			"value": "1849",
		}, {
			"label": "彭泽县",
			"value": "1850",
		}, {
			"label": "永修县",
			"value": "1851",
		}, {
			"label": "修水县",
			"value": "1852",
		}, {
			"label": "湖口县",
			"value": "1853",
		}, {
			"label": "德安县",
			"value": "1854",
		}, {
			"label": "都昌县",
			"value": "1855",
		}, {
			"label": "共青城市",
			"value": "4161",
		}, {
			"label": "经济技术开发区",
			"value": "53710",
		}, {
			"label": "八里湖新区",
			"value": "53711",
		}, {
			"label": "庐山风景名胜区",
			"value": "53712",
		}, {
			"label": "濂溪区",
			"value": "53713",
		}, {
			"label": "浔阳区",
			"value": "53714",
		}]
	}, {
		"label": "鹰潭市",
		"value": "1857",
		"children": [{
			"label": "余江县",
			"value": "1858",
		}, {
			"label": "贵溪市",
			"value": "1859",
		}, {
			"label": "月湖区",
			"value": "1860",
		}, {
			"label": "龙虎山风景旅游区",
			"value": "53715",
		}]
	}, {
		"label": "上饶市",
		"value": "1861",
		"children": [{
			"label": "德兴市",
			"value": "1863",
		}, {
			"label": "广丰县",
			"value": "1864",
		}, {
			"label": "鄱阳县",
			"value": "1865",
		}, {
			"label": "婺源县",
			"value": "1866",
		}, {
			"label": "余干县",
			"value": "1867",
		}, {
			"label": "横峰县",
			"value": "1868",
		}, {
			"label": "弋阳县",
			"value": "1869",
		}, {
			"label": "铅山县",
			"value": "1870",
		}, {
			"label": "玉山县",
			"value": "1871",
		}, {
			"label": "万年县",
			"value": "1872",
		}, {
			"label": "信州区",
			"value": "53716",
		}, {
			"label": "上饶县",
			"value": "53717",
		}]
	}, {
		"label": "宜春市",
		"value": "1874",
		"children": [{
			"label": "丰城市",
			"value": "1875",
		}, {
			"label": "樟树市",
			"value": "1876",
		}, {
			"label": "高安市",
			"value": "1877",
		}, {
			"label": "铜鼓县",
			"value": "1878",
		}, {
			"label": "靖安县",
			"value": "1879",
		}, {
			"label": "宜丰县",
			"value": "1880",
		}, {
			"label": "奉新县",
			"value": "1881",
		}, {
			"label": "万载县",
			"value": "1882",
		}, {
			"label": "上高县",
			"value": "1883",
		}, {
			"label": "袁州区",
			"value": "53718",
		}]
	}, {
		"label": "抚州市",
		"value": "1885",
		"children": [{
			"label": "南丰县",
			"value": "1887",
		}, {
			"label": "乐安县",
			"value": "1888",
		}, {
			"label": "金溪县",
			"value": "1889",
		}, {
			"label": "南城县",
			"value": "1890",
		}, {
			"label": "东乡县",
			"value": "1891",
		}, {
			"label": "资溪县",
			"value": "1892",
		}, {
			"label": "宜黄县",
			"value": "1893",
		}, {
			"label": "崇仁县",
			"value": "1894",
		}, {
			"label": "黎川县",
			"value": "1895",
		}, {
			"label": "广昌县",
			"value": "1896",
		}, {
			"label": "临川区",
			"value": "53719",
		}]
	}, {
		"label": "吉安市",
		"value": "1898",
		"children": [{
			"label": "井冈山市",
			"value": "1899",
		}, {
			"label": "吉安县",
			"value": "1900",
		}, {
			"label": "永丰县",
			"value": "1901",
		}, {
			"label": "永新县",
			"value": "1902",
		}, {
			"label": "新干县",
			"value": "1903",
		}, {
			"label": "泰和县",
			"value": "1904",
		}, {
			"label": "峡江县",
			"value": "1905",
		}, {
			"label": "遂川县",
			"value": "1906",
		}, {
			"label": "安福县",
			"value": "1907",
		}, {
			"label": "吉水县",
			"value": "1908",
		}, {
			"label": "万安县",
			"value": "1909",
		}, {
			"label": "青原区",
			"value": "53720",
		}, {
			"label": "吉州区",
			"value": "53721",
		}]
	}, {
		"label": "赣州市",
		"value": "1911",
		"children": [{
			"label": "南康市",
			"value": "1912",
		}, {
			"label": "瑞金市",
			"value": "1913",
		}, {
			"label": "石城县",
			"value": "1914",
		}, {
			"label": "安远县",
			"value": "1915",
		}, {
			"label": "赣县",
			"value": "1916",
		}, {
			"label": "宁都县",
			"value": "1917",
		}, {
			"label": "寻乌县",
			"value": "1918",
		}, {
			"label": "兴国县",
			"value": "1919",
		}, {
			"label": "定南县",
			"value": "1920",
		}, {
			"label": "上犹县",
			"value": "1921",
		}, {
			"label": "于都县",
			"value": "1922",
		}, {
			"label": "龙南县",
			"value": "1923",
		}, {
			"label": "崇义县",
			"value": "1924",
		}, {
			"label": "大余县",
			"value": "1925",
		}, {
			"label": "信丰县",
			"value": "1926",
		}, {
			"label": "全南县",
			"value": "1927",
		}, {
			"label": "会昌县",
			"value": "1928",
		}, {
			"label": "章贡区",
			"value": "53722",
		}]
	}]
}, {
	"label": "四川",
	"value": "22",
	"children": [{
		"label": "成都市",
		"value": "1930",
		"children": [{
			"label": "高新西区",
			"value": "4284",
		}, {
			"label": "新都区",
			"value": "53257",
		}, {
			"label": "温江区",
			"value": "53258",
		}, {
			"label": "龙泉驿区",
			"value": "53259",
		}, {
			"label": "青白江区",
			"value": "53260",
		}, {
			"label": "彭州市",
			"value": "53261",
		}, {
			"label": "崇州市",
			"value": "53262",
		}, {
			"label": "邛崃市",
			"value": "53263",
		}, {
			"label": "都江堰市",
			"value": "53264",
		}, {
			"label": "郫都区",
			"value": "53265",
		}, {
			"label": "新津县",
			"value": "53266",
		}, {
			"label": "双流区",
			"value": "53267",
		}, {
			"label": "大邑县",
			"value": "53268",
		}, {
			"label": "蒲江县",
			"value": "53269",
		}, {
			"label": "金堂县",
			"value": "53270",
		}, {
			"label": "青羊区",
			"value": "53271",
		}, {
			"label": "锦江区",
			"value": "53272",
		}, {
			"label": "金牛区",
			"value": "53273",
		}, {
			"label": "武侯区",
			"value": "53274",
		}, {
			"label": "成华区",
			"value": "53275",
		}, {
			"label": "高新区",
			"value": "53276",
		}, {
			"label": "简阳市",
			"value": "53277",
		}]
	}, {
		"label": "自贡市",
		"value": "1946",
		"children": [{
			"label": "荣县",
			"value": "1947",
		}, {
			"label": "富顺县",
			"value": "1948",
		}, {
			"label": "自流井区",
			"value": "1949",
		}, {
			"label": "沿滩区",
			"value": "3895",
		}, {
			"label": "大安区",
			"value": "53278",
		}, {
			"label": "贡井区",
			"value": "53279",
		}]
	}, {
		"label": "攀枝花市",
		"value": "1950",
		"children": [{
			"label": "米易县",
			"value": "1951",
		}, {
			"label": "盐边县",
			"value": "1952",
		}, {
			"label": "仁和区",
			"value": "1953",
		}, {
			"label": "西区",
			"value": "3896",
		}, {
			"label": "东区",
			"value": "53280",
		}]
	}, {
		"label": "泸州市",
		"value": "1954",
		"children": [{
			"label": "泸县",
			"value": "1955",
		}, {
			"label": "合江县",
			"value": "1956",
		}, {
			"label": "叙永县",
			"value": "1957",
		}, {
			"label": "古蔺县",
			"value": "1958",
		}, {
			"label": "纳溪区",
			"value": "3898",
		}, {
			"label": "江阳区",
			"value": "53281",
		}, {
			"label": "龙马潭区",
			"value": "53282",
		}]
	}, {
		"label": "绵阳市",
		"value": "1960",
		"children": [{
			"label": "盐亭县",
			"value": "1970",
		}, {
			"label": "三台县",
			"value": "1971",
		}, {
			"label": "平武县",
			"value": "1972",
		}, {
			"label": "北川县",
			"value": "1973",
		}, {
			"label": "安县",
			"value": "1974",
		}, {
			"label": "梓潼县",
			"value": "1975",
		}, {
			"label": "江油市",
			"value": "53283",
		}, {
			"label": "涪城区",
			"value": "53284",
		}, {
			"label": "游仙区",
			"value": "53285",
		}, {
			"label": "高新区",
			"value": "53286",
		}, {
			"label": "经开区",
			"value": "53287",
		}]
	}, {
		"label": "德阳市",
		"value": "1962",
		"children": [{
			"label": "罗江县",
			"value": "1965",
		}, {
			"label": "中江县",
			"value": "1966",
		}, {
			"label": "广汉市",
			"value": "53288",
		}, {
			"label": "什邡市",
			"value": "53289",
		}, {
			"label": "旌阳区",
			"value": "53290",
		}, {
			"label": "绵竹市",
			"value": "53291",
		}]
	}, {
		"label": "广元市",
		"value": "1977",
		"children": [{
			"label": "青川县",
			"value": "1978",
		}, {
			"label": "旺苍县",
			"value": "1979",
		}, {
			"label": "剑阁县",
			"value": "1980",
		}, {
			"label": "苍溪县",
			"value": "1981",
		}, {
			"label": "元坝区",
			"value": "3901",
		}, {
			"label": "朝天区",
			"value": "3902",
		}, {
			"label": "利州区",
			"value": "53292",
		}]
	}, {
		"label": "遂宁市",
		"value": "1983",
		"children": [{
			"label": "射洪县",
			"value": "1984",
			"children": [{
				"label": "太和镇",
				"value": "7771",
				"children": []
			}, {
				"label": "大榆镇",
				"value": "8108",
				"children": []
			}, {
				"label": "广兴镇",
				"value": "8109",
				"children": []
			}, {
				"label": "金华镇",
				"value": "8110",
				"children": []
			}, {
				"label": "沱牌镇",
				"value": "8111",
				"children": []
			}, {
				"label": "太乙镇",
				"value": "8112",
				"children": []
			}, {
				"label": "金家镇",
				"value": "8113",
				"children": []
			}, {
				"label": "复兴镇",
				"value": "8114",
				"children": []
			}, {
				"label": "天仙镇",
				"value": "8115",
				"children": []
			}, {
				"label": "仁和镇",
				"value": "8116",
				"children": []
			}, {
				"label": "青岗镇",
				"value": "8117",
				"children": []
			}, {
				"label": "洋溪镇",
				"value": "8118",
				"children": []
			}, {
				"label": "香山镇",
				"value": "8119",
				"children": []
			}, {
				"label": "明星镇",
				"value": "8120",
				"children": []
			}, {
				"label": "涪西镇",
				"value": "8121",
				"children": []
			}, {
				"label": "陈古镇",
				"value": "8122",
				"children": []
			}, {
				"label": "凤来镇",
				"value": "8123",
				"children": []
			}, {
				"label": "潼射镇",
				"value": "8124",
				"children": []
			}, {
				"label": "曹碑镇",
				"value": "8125",
				"children": []
			}, {
				"label": "官升镇",
				"value": "8126",
				"children": []
			}, {
				"label": "瞿河乡",
				"value": "8127",
				"children": []
			}, {
				"label": "伏河乡",
				"value": "8128",
				"children": []
			}, {
				"label": "青堤乡",
				"value": "8129",
				"children": []
			}, {
				"label": "双溪乡",
				"value": "8130",
				"children": []
			}, {
				"label": "文升乡",
				"value": "8131",
				"children": []
			}, {
				"label": "万林乡",
				"value": "8132",
				"children": []
			}, {
				"label": "太兴乡",
				"value": "8133",
				"children": []
			}, {
				"label": "东岳乡",
				"value": "8134",
				"children": []
			}, {
				"label": "金鹤乡",
				"value": "8135",
				"children": []
			}, {
				"label": "玉太乡",
				"value": "8136",
				"children": []
			}]
		}, {
			"label": "蓬溪县",
			"value": "1985",
			"children": [{
				"label": "赤城镇",
				"value": "7738",
				"children": []
			}, {
				"label": "新会镇",
				"value": "7739",
				"children": []
			}, {
				"label": "文井镇",
				"value": "7740",
				"children": []
			}, {
				"label": "明月镇",
				"value": "7741",
				"children": []
			}, {
				"label": "常乐镇",
				"value": "7742",
				"children": []
			}, {
				"label": "天福镇",
				"value": "7743",
				"children": []
			}, {
				"label": "红江镇",
				"value": "7744",
				"children": []
			}, {
				"label": "宝梵镇",
				"value": "7745",
				"children": []
			}, {
				"label": "大石镇",
				"value": "7746",
				"children": []
			}, {
				"label": "吉祥镇",
				"value": "7747",
				"children": []
			}, {
				"label": "鸣凤镇",
				"value": "7748",
				"children": []
			}, {
				"label": "任隆镇",
				"value": "7749",
				"children": []
			}, {
				"label": "三凤镇",
				"value": "7750",
				"children": []
			}, {
				"label": "高坪镇",
				"value": "7751",
				"children": []
			}, {
				"label": "蓬南镇",
				"value": "7752",
				"children": []
			}, {
				"label": "群利镇",
				"value": "7753",
				"children": []
			}, {
				"label": "下东乡",
				"value": "7754",
				"children": []
			}, {
				"label": "新星乡",
				"value": "7755",
				"children": []
			}, {
				"label": "罗戈乡",
				"value": "7756",
				"children": []
			}, {
				"label": "板桥乡",
				"value": "7757",
				"children": []
			}, {
				"label": "槐花乡",
				"value": "7758",
				"children": []
			}, {
				"label": "吉星乡",
				"value": "7759",
				"children": []
			}, {
				"label": "黄泥乡",
				"value": "7760",
				"children": []
			}, {
				"label": "荷叶乡",
				"value": "7761",
				"children": []
			}, {
				"label": "金龙乡",
				"value": "7762",
				"children": []
			}, {
				"label": "农兴乡",
				"value": "7763",
				"children": []
			}, {
				"label": "新胜乡",
				"value": "7764",
				"children": []
			}, {
				"label": "回水乡",
				"value": "7765",
				"children": []
			}, {
				"label": "群力乡",
				"value": "7766",
				"children": []
			}, {
				"label": "高升乡",
				"value": "7767",
				"children": []
			}, {
				"label": "金桥乡",
				"value": "7768",
				"children": []
			}, {
				"label": "城南新区",
				"value": "7769",
				"children": []
			}, {
				"label": "上游工业园管理委员会",
				"value": "7770",
				"children": []
			}]
		}, {
			"label": "大英县",
			"value": "1986",
			"children": [{
				"label": "蓬莱镇",
				"value": "7772",
				"children": []
			}, {
				"label": "隆盛镇",
				"value": "7773",
				"children": []
			}, {
				"label": "回马镇",
				"value": "7774",
				"children": []
			}, {
				"label": "天保镇",
				"value": "7775",
				"children": []
			}, {
				"label": "河边镇",
				"value": "7776",
				"children": []
			}, {
				"label": "卓筒井镇",
				"value": "7777",
				"children": []
			}, {
				"label": "玉峰镇",
				"value": "7778",
				"children": []
			}, {
				"label": "象山镇",
				"value": "7779",
				"children": []
			}, {
				"label": "通仙乡",
				"value": "7780",
				"children": []
			}, {
				"label": "金元乡",
				"value": "7781",
				"children": []
			}, {
				"label": "智水乡",
				"value": "7782",
				"children": []
			}, {
				"label": "寸塘口乡",
				"value": "8148",
				"children": []
			}, {
				"label": "福禄乡",
				"value": "8149",
				"children": []
			}, {
				"label": "民主镇",
				"value": "8150",
				"children": []
			}, {
				"label": "郪口镇",
				"value": "8151",
				"children": []
			}, {
				"label": "石门镇",
				"value": "8152",
				"children": []
			}, {
				"label": "五方乡",
				"value": "8153",
				"children": []
			}, {
				"label": "星花乡",
				"value": "8154",
				"children": []
			}]
		}, {
			"label": "安居区",
			"value": "1987",
			"children": [{
				"label": "安居镇",
				"value": "7717",
				"children": []
			}, {
				"label": "东禅镇",
				"value": "7718",
				"children": []
			}, {
				"label": "分水镇",
				"value": "7719",
				"children": []
			}, {
				"label": "石洞镇",
				"value": "7720",
				"children": []
			}, {
				"label": "拦江镇",
				"value": "7721",
				"children": []
			}, {
				"label": "保石镇",
				"value": "7722",
				"children": []
			}, {
				"label": "白马镇",
				"value": "7723",
				"children": []
			}, {
				"label": "中兴镇",
				"value": "7724",
				"children": []
			}, {
				"label": "横山镇",
				"value": "7725",
				"children": []
			}, {
				"label": "会龙镇",
				"value": "7726",
				"children": []
			}, {
				"label": "三家镇",
				"value": "7727",
				"children": []
			}, {
				"label": "玉丰镇",
				"value": "7728",
				"children": []
			}, {
				"label": "西眉镇",
				"value": "7729",
				"children": []
			}, {
				"label": "磨溪镇",
				"value": "7730",
				"children": []
			}, {
				"label": "聚贤乡",
				"value": "7731",
				"children": []
			}, {
				"label": "莲花乡",
				"value": "7732",
				"children": []
			}, {
				"label": "观音乡",
				"value": "7733",
				"children": []
			}, {
				"label": "步云乡",
				"value": "7734",
				"children": []
			}, {
				"label": "常理乡",
				"value": "7735",
				"children": []
			}, {
				"label": "大安乡",
				"value": "7736",
				"children": []
			}, {
				"label": "马家乡",
				"value": "7737",
				"children": []
			}]
		}, {
			"label": "船山区",
			"value": "4961",
			"children": [{
				"label": "慈音街道",
				"value": "7701",
				"children": []
			}, {
				"label": "九莲街道",
				"value": "7702",
				"children": []
			}, {
				"label": "龙凤镇",
				"value": "7703",
				"children": []
			}, {
				"label": "仁里镇",
				"value": "7704",
				"children": []
			}, {
				"label": "复桥镇",
				"value": "7705",
				"children": []
			}, {
				"label": "永兴镇",
				"value": "7706",
				"children": []
			}, {
				"label": "河沙镇",
				"value": "7707",
				"children": []
			}, {
				"label": "新桥镇",
				"value": "7708",
				"children": []
			}, {
				"label": "桂花镇",
				"value": "7709",
				"children": []
			}, {
				"label": "西宁乡",
				"value": "7710",
				"children": []
			}, {
				"label": "老池乡",
				"value": "7711",
				"children": []
			}, {
				"label": "保升乡",
				"value": "7712",
				"children": []
			}, {
				"label": "唐家乡",
				"value": "7713",
				"children": []
			}, {
				"label": "高升街街道",
				"value": "8036",
				"children": []
			}, {
				"label": "凯旋路街道",
				"value": "8037",
				"children": []
			}, {
				"label": "南津路街道",
				"value": "8038",
				"children": []
			}, {
				"label": "镇江寺街道",
				"value": "8039",
				"children": []
			}, {
				"label": "育才路街道",
				"value": "8040",
				"children": []
			}, {
				"label": "介福路街道",
				"value": "8041",
				"children": []
			}, {
				"label": "嘉禾街道",
				"value": "8042",
				"children": []
			}, {
				"label": "广德寺街道",
				"value": "8043",
				"children": []
			}, {
				"label": "富源路街道",
				"value": "8044",
				"children": []
			}, {
				"label": "龙坪街道",
				"value": "8045",
				"children": []
			}, {
				"label": "灵泉寺街道",
				"value": "8046",
				"children": []
			}, {
				"label": "南强镇",
				"value": "8147",
				"children": []
			}, {
				"label": "西山路街道",
				"value": "8189",
				"children": []
			}, {
				"label": "北固乡",
				"value": "8190",
				"children": []
			}, {
				"label": "微电子工业园",
				"value": "8191",
				"children": []
			}, {
				"label": "河东新区",
				"value": "8192",
				"children": []
			}]
		}]
	}, {
		"label": "内江市",
		"value": "1988",
		"children": [{
			"label": "资中县",
			"value": "1989",
			"children": [{
				"label": "重龙镇",
				"value": "7833",
				"children": []
			}, {
				"label": "水南镇",
				"value": "7834",
				"children": []
			}, {
				"label": "甘露镇",
				"value": "7835",
				"children": []
			}, {
				"label": "归德镇",
				"value": "7836",
				"children": []
			}, {
				"label": "鱼溪镇",
				"value": "7837",
				"children": []
			}, {
				"label": "金李井镇",
				"value": "7838",
				"children": []
			}, {
				"label": "铁佛镇",
				"value": "7839",
				"children": []
			}, {
				"label": "球溪镇",
				"value": "7840",
				"children": []
			}, {
				"label": "顺河场镇",
				"value": "7841",
				"children": []
			}, {
				"label": "龙结镇",
				"value": "7842",
				"children": []
			}, {
				"label": "罗泉镇",
				"value": "7843",
				"children": []
			}, {
				"label": "发轮镇",
				"value": "7844",
				"children": []
			}, {
				"label": "兴隆街镇",
				"value": "7845",
				"children": []
			}, {
				"label": "银山镇",
				"value": "7846",
				"children": []
			}, {
				"label": "宋家镇",
				"value": "7847",
				"children": []
			}, {
				"label": "太平镇",
				"value": "7848",
				"children": []
			}, {
				"label": "骝马镇",
				"value": "7849",
				"children": []
			}, {
				"label": "苏家湾镇",
				"value": "7850",
				"children": []
			}, {
				"label": "新桥镇",
				"value": "7851",
				"children": []
			}, {
				"label": "明心寺镇",
				"value": "7852",
				"children": []
			}, {
				"label": "双河镇",
				"value": "7853",
				"children": []
			}, {
				"label": "公民镇",
				"value": "7854",
				"children": []
			}, {
				"label": "龙江镇",
				"value": "7855",
				"children": []
			}, {
				"label": "双龙镇",
				"value": "7856",
				"children": []
			}, {
				"label": "高楼镇",
				"value": "7857",
				"children": []
			}, {
				"label": "陈家镇",
				"value": "7858",
				"children": []
			}, {
				"label": "配龙镇",
				"value": "7859",
				"children": []
			}, {
				"label": "走马镇",
				"value": "7860",
				"children": []
			}, {
				"label": "孟塘镇",
				"value": "7861",
				"children": []
			}, {
				"label": "马鞍镇",
				"value": "7862",
				"children": []
			}, {
				"label": "狮子镇",
				"value": "7863",
				"children": []
			}, {
				"label": "板栗桠乡",
				"value": "7864",
				"children": []
			}, {
				"label": "龙山乡",
				"value": "7865",
				"children": []
			}]
		}, {
			"label": "隆昌县",
			"value": "1990",
			"children": [{
				"label": "金鹅镇",
				"value": "7866",
				"children": []
			}, {
				"label": "古湖街道",
				"value": "7867",
				"children": []
			}, {
				"label": "山川镇",
				"value": "7868",
				"children": []
			}, {
				"label": "响石镇",
				"value": "7869",
				"children": []
			}, {
				"label": "圣灯镇",
				"value": "7870",
				"children": []
			}, {
				"label": "黄家镇",
				"value": "7871",
				"children": []
			}, {
				"label": "双凤镇",
				"value": "7872",
				"children": []
			}, {
				"label": "龙市镇",
				"value": "7873",
				"children": []
			}, {
				"label": "迎祥镇",
				"value": "7874",
				"children": []
			}, {
				"label": "界市镇",
				"value": "7875",
				"children": []
			}, {
				"label": "石碾镇",
				"value": "7876",
				"children": []
			}, {
				"label": "周兴镇",
				"value": "7877",
				"children": []
			}, {
				"label": "渔箭镇",
				"value": "7878",
				"children": []
			}, {
				"label": "石燕桥镇",
				"value": "7879",
				"children": []
			}, {
				"label": "李市镇",
				"value": "7880",
				"children": []
			}, {
				"label": "胡家镇",
				"value": "7881",
				"children": []
			}, {
				"label": "云顶镇",
				"value": "7882",
				"children": []
			}, {
				"label": "桂花井乡",
				"value": "7883",
				"children": []
			}, {
				"label": "普润乡",
				"value": "7884",
				"children": []
			}]
		}, {
			"label": "威远县",
			"value": "1991",
			"children": [{
				"label": "严陵镇",
				"value": "7832",
				"children": []
			}, {
				"label": "铺子湾镇",
				"value": "8048",
				"children": []
			}, {
				"label": "新店镇",
				"value": "8049",
				"children": []
			}, {
				"label": "向义镇",
				"value": "8050",
				"children": []
			}, {
				"label": "界牌镇",
				"value": "8051",
				"children": []
			}, {
				"label": "龙会镇",
				"value": "8052",
				"children": []
			}, {
				"label": "高石镇",
				"value": "8053",
				"children": []
			}, {
				"label": "东联镇",
				"value": "8054",
				"children": []
			}, {
				"label": "靖和镇",
				"value": "8055",
				"children": []
			}, {
				"label": "镇西镇",
				"value": "8056",
				"children": []
			}, {
				"label": "庆卫镇",
				"value": "8057",
				"children": []
			}, {
				"label": "山王镇",
				"value": "8058",
				"children": []
			}, {
				"label": "黄荆沟镇",
				"value": "8059",
				"children": []
			}, {
				"label": "观英滩镇",
				"value": "8060",
				"children": []
			}, {
				"label": "新场镇",
				"value": "8061",
				"children": []
			}, {
				"label": "连界镇",
				"value": "8062",
				"children": []
			}, {
				"label": "越溪镇",
				"value": "8063",
				"children": []
			}, {
				"label": "两河镇",
				"value": "8064",
				"children": []
			}, {
				"label": "碗厂镇",
				"value": "8065",
				"children": []
			}, {
				"label": "小河镇",
				"value": "8066",
				"children": []
			}]
		}, {
			"label": "市中区",
			"value": "1992",
			"children": [{
				"label": "城东街道",
				"value": "7783",
				"children": []
			}, {
				"label": "城南街道",
				"value": "7784",
				"children": []
			}, {
				"label": "城西街道",
				"value": "7785",
				"children": []
			}, {
				"label": "玉溪街道",
				"value": "7786",
				"children": []
			}, {
				"label": "牌楼街道",
				"value": "7787",
				"children": []
			}, {
				"label": "壕子口街道",
				"value": "7788",
				"children": []
			}, {
				"label": "白马镇",
				"value": "7789",
				"children": []
			}, {
				"label": "史家镇",
				"value": "7790",
				"children": []
			}, {
				"label": "凌家镇",
				"value": "7791",
				"children": []
			}, {
				"label": "朝阳镇",
				"value": "7792",
				"children": []
			}, {
				"label": "永安镇",
				"value": "7793",
				"children": []
			}, {
				"label": "全安镇",
				"value": "7794",
				"children": []
			}, {
				"label": "靖民镇",
				"value": "7795",
				"children": []
			}, {
				"label": "乐贤镇",
				"value": "7796",
				"children": []
			}, {
				"label": "沱江乡",
				"value": "7797",
				"children": []
			}, {
				"label": "交通乡",
				"value": "7798",
				"children": []
			}, {
				"label": "四合乡",
				"value": "7799",
				"children": []
			}, {
				"label": "凤鸣乡",
				"value": "7800",
				"children": []
			}, {
				"label": "伏龙乡",
				"value": "7801",
				"children": []
			}, {
				"label": "龚家乡",
				"value": "7802",
				"children": []
			}]
		}, {
			"label": "东兴区",
			"value": "3121",
			"children": [{
				"label": "东兴街道",
				"value": "7803",
				"children": []
			}, {
				"label": "西林街道",
				"value": "7804",
				"children": []
			}, {
				"label": "新江街道",
				"value": "7805",
				"children": []
			}, {
				"label": "田家镇",
				"value": "7806",
				"children": []
			}, {
				"label": "郭北镇",
				"value": "7807",
				"children": []
			}, {
				"label": "高梁镇",
				"value": "7808",
				"children": []
			}, {
				"label": "白合镇",
				"value": "7809",
				"children": []
			}, {
				"label": "顺河镇",
				"value": "7810",
				"children": []
			}, {
				"label": "胜利镇",
				"value": "7811",
				"children": []
			}, {
				"label": "高桥镇",
				"value": "7812",
				"children": []
			}, {
				"label": "双才镇",
				"value": "7813",
				"children": []
			}, {
				"label": "小河口镇",
				"value": "7814",
				"children": []
			}, {
				"label": "杨家镇",
				"value": "7815",
				"children": []
			}, {
				"label": "椑木镇",
				"value": "7816",
				"children": []
			}, {
				"label": "石子镇",
				"value": "7817",
				"children": []
			}, {
				"label": "太安乡",
				"value": "7818",
				"children": []
			}, {
				"label": "苏家乡",
				"value": "7819",
				"children": []
			}, {
				"label": "富溪乡",
				"value": "7820",
				"children": []
			}, {
				"label": "同福乡",
				"value": "7821",
				"children": []
			}, {
				"label": "椑南乡",
				"value": "7822",
				"children": []
			}, {
				"label": "永东乡",
				"value": "7823",
				"children": []
			}, {
				"label": "永福乡",
				"value": "7824",
				"children": []
			}, {
				"label": "新店乡",
				"value": "7825",
				"children": []
			}, {
				"label": "双桥乡",
				"value": "7826",
				"children": []
			}, {
				"label": "平坦乡",
				"value": "7827",
				"children": []
			}, {
				"label": "中山乡",
				"value": "7828",
				"children": []
			}, {
				"label": "大治乡",
				"value": "7829",
				"children": []
			}, {
				"label": "柳桥乡",
				"value": "7830",
				"children": []
			}, {
				"label": "三烈乡",
				"value": "7831",
				"children": []
			}]
		}]
	}, {
		"label": "乐山市",
		"value": "1993",
		"children": [{
			"label": "五通桥区",
			"value": "1994",
		}, {
			"label": "沙湾区",
			"value": "1995",
		}, {
			"label": "金口河区",
			"value": "1996",
		}, {
			"label": "夹江县",
			"value": "1998",
		}, {
			"label": "井研县",
			"value": "1999",
		}, {
			"label": "犍为县",
			"value": "2000",
		}, {
			"label": "沐川县",
			"value": "2001",
		}, {
			"label": "峨边县",
			"value": "2002",
		}, {
			"label": "马边县",
			"value": "2003",
		}, {
			"label": "市中区",
			"value": "53293",
		}, {
			"label": "峨眉山市",
			"value": "53294",
		}]
	}, {
		"label": "宜宾市",
		"value": "2005",
		"children": [{
			"label": "宜宾县",
			"value": "2006",
			"children": [{
				"label": "柏溪镇",
				"value": "6971",
				"children": []
			}, {
				"label": "喜捷镇",
				"value": "6972",
				"children": []
			}, {
				"label": "观音镇",
				"value": "6973",
				"children": []
			}, {
				"label": "横江镇",
				"value": "6974",
				"children": []
			}, {
				"label": "永兴镇",
				"value": "6975",
				"children": []
			}, {
				"label": "白花镇",
				"value": "6976",
				"children": []
			}, {
				"label": "柳嘉镇",
				"value": "6977",
				"children": []
			}, {
				"label": "泥溪镇",
				"value": "6978",
				"children": []
			}, {
				"label": "蕨溪镇",
				"value": "6979",
				"children": []
			}, {
				"label": "商州镇",
				"value": "6980",
				"children": []
			}, {
				"label": "高场镇",
				"value": "6981",
				"children": []
			}, {
				"label": "安边镇",
				"value": "6982",
				"children": []
			}, {
				"label": "双龙镇",
				"value": "6983",
				"children": []
			}, {
				"label": "李场镇",
				"value": "6984",
				"children": []
			}, {
				"label": "合什镇",
				"value": "6985",
				"children": []
			}, {
				"label": "古罗镇",
				"value": "6986",
				"children": []
			}, {
				"label": "孔滩镇",
				"value": "6987",
				"children": []
			}, {
				"label": "复龙镇",
				"value": "6988",
				"children": []
			}, {
				"label": "古柏乡",
				"value": "6989",
				"children": []
			}, {
				"label": "王场乡",
				"value": "6990",
				"children": []
			}, {
				"label": "双谊乡",
				"value": "6991",
				"children": []
			}, {
				"label": "隆兴乡",
				"value": "6992",
				"children": []
			}, {
				"label": "泥南乡",
				"value": "6993",
				"children": []
			}, {
				"label": "龙池乡",
				"value": "6994",
				"children": []
			}, {
				"label": "普安乡",
				"value": "6995",
				"children": []
			}, {
				"label": "凤仪乡",
				"value": "6996",
				"children": []
			}]
		}, {
			"label": "南溪区",
			"value": "2007",
		}, {
			"label": "江安县",
			"value": "2008",
		}, {
			"label": "长宁县",
			"value": "2009",
		}, {
			"label": "兴文县",
			"value": "2010",
		}, {
			"label": "珙县",
			"value": "2011",
		}, {
			"label": "高县",
			"value": "2012",
		}, {
			"label": "屏山县",
			"value": "2013",
		}, {
			"label": "筠连县",
			"value": "2015",
		}, {
			"label": "翠屏区",
			"value": "53295",
		}]
	}, {
		"label": "广安市",
		"value": "2016",
		"children": [{
			"label": "岳池县",
			"value": "2017",
			"children": [{
				"label": "九龙镇",
				"value": "7934",
				"children": []
			}, {
				"label": "花园镇",
				"value": "7935",
				"children": []
			}, {
				"label": "坪滩镇",
				"value": "7936",
				"children": []
			}, {
				"label": "龙孔镇",
				"value": "7937",
				"children": []
			}, {
				"label": "镇裕镇",
				"value": "7938",
				"children": []
			}, {
				"label": "白庙镇",
				"value": "7939",
				"children": []
			}, {
				"label": "酉溪镇",
				"value": "7940",
				"children": []
			}, {
				"label": "同兴镇",
				"value": "7941",
				"children": []
			}, {
				"label": "兴隆镇",
				"value": "7942",
				"children": []
			}, {
				"label": "秦溪镇",
				"value": "7943",
				"children": []
			}, {
				"label": "顾县镇",
				"value": "7944",
				"children": []
			}, {
				"label": "苟角镇",
				"value": "7945",
				"children": []
			}, {
				"label": "天平镇",
				"value": "7946",
				"children": []
			}, {
				"label": "石垭镇",
				"value": "7947",
				"children": []
			}, {
				"label": "乔家镇",
				"value": "7948",
				"children": []
			}, {
				"label": "罗渡镇",
				"value": "7949",
				"children": []
			}, {
				"label": "裕民镇",
				"value": "7950",
				"children": []
			}, {
				"label": "中和镇",
				"value": "7951",
				"children": []
			}, {
				"label": "新场镇",
				"value": "7952",
				"children": []
			}, {
				"label": "普安镇",
				"value": "7953",
				"children": []
			}, {
				"label": "赛龙镇",
				"value": "7954",
				"children": []
			}, {
				"label": "临溪镇",
				"value": "7955",
				"children": []
			}, {
				"label": "朝阳乡",
				"value": "7956",
				"children": []
			}, {
				"label": "北城乡",
				"value": "7957",
				"children": []
			}, {
				"label": "镇龙乡",
				"value": "7958",
				"children": []
			}, {
				"label": "粽粑乡",
				"value": "7959",
				"children": []
			}, {
				"label": "排楼乡",
				"value": "7960",
				"children": []
			}, {
				"label": "西板乡",
				"value": "7961",
				"children": []
			}, {
				"label": "嘉陵乡",
				"value": "7962",
				"children": []
			}, {
				"label": "石鼓乡",
				"value": "7963",
				"children": []
			}, {
				"label": "平安乡",
				"value": "7964",
				"children": []
			}, {
				"label": "恐龙乡",
				"value": "7965",
				"children": []
			}, {
				"label": "团结乡",
				"value": "7966",
				"children": []
			}, {
				"label": "黄龙乡",
				"value": "7967",
				"children": []
			}, {
				"label": "双鄢乡",
				"value": "7968",
				"children": []
			}, {
				"label": "东板乡",
				"value": "7969",
				"children": []
			}, {
				"label": "长田乡",
				"value": "7970",
				"children": []
			}, {
				"label": "鱼峰乡",
				"value": "7971",
				"children": []
			}, {
				"label": "大石乡",
				"value": "7972",
				"children": []
			}, {
				"label": "花板乡",
				"value": "7973",
				"children": []
			}, {
				"label": "大佛乡",
				"value": "7974",
				"children": []
			}, {
				"label": "齐福乡",
				"value": "7975",
				"children": []
			}, {
				"label": "伏龙乡",
				"value": "7976",
				"children": []
			}]
		}, {
			"label": "武胜县",
			"value": "2018",
			"children": [{
				"label": "沿口镇",
				"value": "7977",
				"children": []
			}, {
				"label": "中心镇",
				"value": "8068",
				"children": []
			}, {
				"label": "烈面镇",
				"value": "8069",
				"children": []
			}, {
				"label": "飞龙镇",
				"value": "8070",
				"children": []
			}, {
				"label": "乐善镇",
				"value": "8071",
				"children": []
			}, {
				"label": "万善镇",
				"value": "8072",
				"children": []
			}, {
				"label": "龙女镇",
				"value": "8073",
				"children": []
			}, {
				"label": "三溪镇",
				"value": "8074",
				"children": []
			}, {
				"label": "赛马镇",
				"value": "8075",
				"children": []
			}, {
				"label": "胜利镇",
				"value": "8076",
				"children": []
			}, {
				"label": "金牛镇",
				"value": "8077",
				"children": []
			}, {
				"label": "清平镇",
				"value": "8078",
				"children": []
			}, {
				"label": "街子镇",
				"value": "8079",
				"children": []
			}, {
				"label": "万隆镇",
				"value": "8080",
				"children": []
			}, {
				"label": "礼安镇",
				"value": "8081",
				"children": []
			}, {
				"label": "华封镇",
				"value": "8082",
				"children": []
			}, {
				"label": "鸣钟乡",
				"value": "8083",
				"children": []
			}, {
				"label": "真静乡",
				"value": "8084",
				"children": []
			}, {
				"label": "猛山乡",
				"value": "8085",
				"children": []
			}, {
				"label": "双星乡",
				"value": "8086",
				"children": []
			}, {
				"label": "龙庭乡",
				"value": "8087",
				"children": []
			}, {
				"label": "石盘乡",
				"value": "8088",
				"children": []
			}, {
				"label": "旧县乡",
				"value": "8089",
				"children": []
			}, {
				"label": "鼓匠乡",
				"value": "8090",
				"children": []
			}, {
				"label": "白坪乡",
				"value": "8091",
				"children": []
			}, {
				"label": "永胜乡",
				"value": "8092",
				"children": []
			}, {
				"label": "新学乡",
				"value": "8093",
				"children": []
			}, {
				"label": "宝箴塞乡",
				"value": "8094",
				"children": []
			}, {
				"label": "金光乡",
				"value": "8095",
				"children": []
			}, {
				"label": "八一乡",
				"value": "8096",
				"children": []
			}, {
				"label": "高石乡",
				"value": "8097",
				"children": []
			}]
		}, {
			"label": "邻水县",
			"value": "2019",
			"children": [{
				"label": "鼎屏镇",
				"value": "7978",
				"children": []
			}, {
				"label": "城北镇",
				"value": "7979",
				"children": []
			}, {
				"label": "城南镇",
				"value": "7980",
				"children": []
			}, {
				"label": "柑子镇",
				"value": "7981",
				"children": []
			}, {
				"label": "龙安镇",
				"value": "7982",
				"children": []
			}, {
				"label": "观音桥镇",
				"value": "7983",
				"children": []
			}, {
				"label": "牟家镇",
				"value": "7984",
				"children": []
			}, {
				"label": "合流镇",
				"value": "7985",
				"children": []
			}, {
				"label": "坛同镇",
				"value": "7986",
				"children": []
			}, {
				"label": "高滩镇",
				"value": "7987",
				"children": []
			}, {
				"label": "九龙镇",
				"value": "7988",
				"children": []
			}, {
				"label": "御临镇",
				"value": "7989",
				"children": []
			}, {
				"label": "袁市镇",
				"value": "7990",
				"children": []
			}, {
				"label": "丰禾镇",
				"value": "7991",
				"children": []
			}, {
				"label": "八耳镇",
				"value": "7992",
				"children": []
			}, {
				"label": "石永镇",
				"value": "7993",
				"children": []
			}, {
				"label": "兴仁镇",
				"value": "7994",
				"children": []
			}, {
				"label": "王家镇",
				"value": "7995",
				"children": []
			}, {
				"label": "太和乡",
				"value": "7996",
				"children": []
			}, {
				"label": "新镇乡",
				"value": "7997",
				"children": []
			}, {
				"label": "冷家乡",
				"value": "7998",
				"children": []
			}, {
				"label": "长安乡",
				"value": "7999",
				"children": []
			}, {
				"label": "西天乡",
				"value": "8000",
				"children": []
			}, {
				"label": "梁板乡",
				"value": "8001",
				"children": []
			}, {
				"label": "甘坝乡",
				"value": "8002",
				"children": []
			}, {
				"label": "四海乡",
				"value": "8003",
				"children": []
			}, {
				"label": "九峰乡",
				"value": "8004",
				"children": []
			}, {
				"label": "椿木乡",
				"value": "8005",
				"children": []
			}, {
				"label": "华蓥乡",
				"value": "8006",
				"children": []
			}, {
				"label": "子中乡",
				"value": "8007",
				"children": []
			}, {
				"label": "风垭乡",
				"value": "8008",
				"children": []
			}, {
				"label": "黎家乡",
				"value": "8009",
				"children": []
			}, {
				"label": "龙桥乡",
				"value": "8010",
				"children": []
			}, {
				"label": "关河乡",
				"value": "8011",
				"children": []
			}, {
				"label": "两河乡",
				"value": "8012",
				"children": []
			}, {
				"label": "长滩乡",
				"value": "8013",
				"children": []
			}, {
				"label": "凉山乡",
				"value": "8014",
				"children": []
			}, {
				"label": "复盛乡",
				"value": "8015",
				"children": []
			}, {
				"label": "古路乡",
				"value": "8016",
				"children": []
			}, {
				"label": "荆坪乡",
				"value": "8017",
				"children": []
			}, {
				"label": "柳塘乡",
				"value": "8018",
				"children": []
			}, {
				"label": "石滓乡",
				"value": "8019",
				"children": []
			}, {
				"label": "护邻乡",
				"value": "8020",
				"children": []
			}, {
				"label": "同石乡",
				"value": "8021",
				"children": []
			}, {
				"label": "三古乡",
				"value": "8022",
				"children": []
			}]
		}, {
			"label": "广安区",
			"value": "2020",
			"children": [{
				"label": "浓洄街道",
				"value": "7885",
				"children": []
			}, {
				"label": "北辰街道",
				"value": "7886",
				"children": []
			}, {
				"label": "奎阁街道",
				"value": "7887",
				"children": []
			}, {
				"label": "广福街道",
				"value": "7888",
				"children": []
			}, {
				"label": "万盛街道",
				"value": "7889",
				"children": []
			}, {
				"label": "中桥街道",
				"value": "7890",
				"children": []
			}, {
				"label": "枣山镇",
				"value": "7891",
				"children": []
			}, {
				"label": "官盛镇",
				"value": "7892",
				"children": []
			}, {
				"label": "协兴镇",
				"value": "7893",
				"children": []
			}, {
				"label": "浓溪镇",
				"value": "7894",
				"children": []
			}, {
				"label": "悦来镇",
				"value": "7895",
				"children": []
			}, {
				"label": "兴平镇",
				"value": "7896",
				"children": []
			}, {
				"label": "井河镇",
				"value": "7897",
				"children": []
			}, {
				"label": "花桥镇",
				"value": "7898",
				"children": []
			}, {
				"label": "龙台镇",
				"value": "7899",
				"children": []
			}, {
				"label": "肖溪镇",
				"value": "7900",
				"children": []
			}, {
				"label": "恒升镇",
				"value": "7901",
				"children": []
			}, {
				"label": "石笋镇",
				"value": "7902",
				"children": []
			}, {
				"label": "白市镇",
				"value": "7903",
				"children": []
			}, {
				"label": "大安镇",
				"value": "7904",
				"children": []
			}, {
				"label": "观阁镇",
				"value": "7905",
				"children": []
			}, {
				"label": "广兴镇",
				"value": "7906",
				"children": []
			}, {
				"label": "前锋镇",
				"value": "7907",
				"children": []
			}, {
				"label": "桂兴镇",
				"value": "7908",
				"children": []
			}, {
				"label": "代市镇",
				"value": "7909",
				"children": []
			}, {
				"label": "观塘镇",
				"value": "7910",
				"children": []
			}, {
				"label": "护安镇",
				"value": "7911",
				"children": []
			}, {
				"label": "穿石乡",
				"value": "7912",
				"children": []
			}, {
				"label": "广门乡",
				"value": "7913",
				"children": []
			}, {
				"label": "广罗乡",
				"value": "7914",
				"children": []
			}, {
				"label": "方坪乡",
				"value": "7915",
				"children": []
			}, {
				"label": "化龙乡",
				"value": "7916",
				"children": []
			}, {
				"label": "大龙乡",
				"value": "7917",
				"children": []
			}, {
				"label": "崇望乡",
				"value": "7918",
				"children": []
			}, {
				"label": "龙安乡",
				"value": "7919",
				"children": []
			}, {
				"label": "彭家乡",
				"value": "7920",
				"children": []
			}, {
				"label": "杨坪乡",
				"value": "7921",
				"children": []
			}, {
				"label": "郑山乡",
				"value": "7922",
				"children": []
			}, {
				"label": "蒲莲乡",
				"value": "7923",
				"children": []
			}, {
				"label": "大有乡",
				"value": "7924",
				"children": []
			}, {
				"label": "消河乡",
				"value": "7925",
				"children": []
			}, {
				"label": "东岳乡",
				"value": "7926",
				"children": []
			}, {
				"label": "苏溪乡",
				"value": "7927",
				"children": []
			}, {
				"label": "白马乡",
				"value": "7928",
				"children": []
			}, {
				"label": "光辉乡",
				"value": "7929",
				"children": []
			}, {
				"label": "龙滩乡",
				"value": "7930",
				"children": []
			}, {
				"label": "小井乡",
				"value": "7931",
				"children": []
			}, {
				"label": "新桥乡",
				"value": "7932",
				"children": []
			}, {
				"label": "虎城乡",
				"value": "7933",
				"children": []
			}]
		}, {
			"label": "华蓥市",
			"value": "2021",
			"children": [{
				"label": "双河街道",
				"value": "8023",
				"children": []
			}, {
				"label": "古桥街道",
				"value": "8024",
				"children": []
			}, {
				"label": "华龙街道",
				"value": "8025",
				"children": []
			}, {
				"label": "天池镇",
				"value": "8026",
				"children": []
			}, {
				"label": "禄市镇",
				"value": "8027",
				"children": []
			}, {
				"label": "永兴镇",
				"value": "8028",
				"children": []
			}, {
				"label": "明月镇",
				"value": "8029",
				"children": []
			}, {
				"label": "阳和镇",
				"value": "8030",
				"children": []
			}, {
				"label": "高兴镇",
				"value": "8031",
				"children": []
			}, {
				"label": "观音溪镇",
				"value": "8032",
				"children": []
			}, {
				"label": "溪口镇",
				"value": "8033",
				"children": []
			}, {
				"label": "庆华镇",
				"value": "8034",
				"children": []
			}, {
				"label": "红岩乡",
				"value": "8035",
				"children": []
			}]
		}, {
			"label": "前锋区",
			"value": "53296",
		}]
	}, {
		"label": "南充市",
		"value": "2022",
		"children": [{
			"label": "仪陇县",
			"value": "2028",
		}, {
			"label": "蓬安县",
			"value": "2029",
		}, {
			"label": "营山县",
			"value": "2030",
		}, {
			"label": "南部县",
			"value": "53297",
		}, {
			"label": "顺庆区",
			"value": "53298",
		}, {
			"label": "高坪区",
			"value": "53299",
		}, {
			"label": "嘉陵区",
			"value": "53300",
		}, {
			"label": "西充县",
			"value": "53301",
		}, {
			"label": "阆中市",
			"value": "53302",
		}]
	}, {
		"label": "达州市",
		"value": "2033",
		"children": [{
			"label": "通川区",
			"value": "2034",
			"children": [{
				"label": "东城街道",
				"value": "7044",
				"children": []
			}, {
				"label": "西城街道",
				"value": "7045",
				"children": []
			}, {
				"label": "朝阳街道",
				"value": "7046",
				"children": []
			}, {
				"label": "西外镇",
				"value": "7047",
				"children": []
			}, {
				"label": "北外镇",
				"value": "7048",
				"children": []
			}, {
				"label": "罗江镇",
				"value": "7049",
				"children": []
			}, {
				"label": "蒲家镇",
				"value": "7050",
				"children": []
			}, {
				"label": "复兴镇",
				"value": "7051",
				"children": []
			}, {
				"label": "双龙镇",
				"value": "7052",
				"children": []
			}, {
				"label": "魏兴镇",
				"value": "7053",
				"children": []
			}, {
				"label": "盘石乡",
				"value": "7054",
				"children": []
			}, {
				"label": "东岳乡",
				"value": "7055",
				"children": []
			}, {
				"label": "新村乡",
				"value": "7056",
				"children": []
			}]
		}, {
			"label": "达县",
			"value": "2035",
			"children": [{
				"label": "南外镇",
				"value": "7057",
				"children": []
			}, {
				"label": "亭子镇",
				"value": "7058",
				"children": []
			}, {
				"label": "福善镇",
				"value": "7059",
				"children": []
			}, {
				"label": "麻柳镇",
				"value": "7060",
				"children": []
			}, {
				"label": "檀木镇",
				"value": "7061",
				"children": []
			}, {
				"label": "大树镇",
				"value": "7062",
				"children": []
			}, {
				"label": "南岳镇",
				"value": "7063",
				"children": []
			}, {
				"label": "万家镇",
				"value": "7064",
				"children": []
			}, {
				"label": "景市镇",
				"value": "7065",
				"children": []
			}, {
				"label": "百节镇",
				"value": "7066",
				"children": []
			}, {
				"label": "赵家镇",
				"value": "7067",
				"children": []
			}, {
				"label": "河市镇",
				"value": "7068",
				"children": []
			}, {
				"label": "石板镇",
				"value": "7069",
				"children": []
			}, {
				"label": "金垭镇",
				"value": "7070",
				"children": []
			}, {
				"label": "渡市镇",
				"value": "7071",
				"children": []
			}, {
				"label": "管村镇",
				"value": "7072",
				"children": []
			}, {
				"label": "石梯镇",
				"value": "7073",
				"children": []
			}, {
				"label": "石桥镇",
				"value": "7074",
				"children": []
			}, {
				"label": "堡子镇",
				"value": "7075",
				"children": []
			}, {
				"label": "江陵镇",
				"value": "7076",
				"children": []
			}, {
				"label": "碑庙镇",
				"value": "7077",
				"children": []
			}, {
				"label": "大风乡",
				"value": "7078",
				"children": []
			}, {
				"label": "江阳乡",
				"value": "7079",
				"children": []
			}, {
				"label": "东兴乡",
				"value": "7080",
				"children": []
			}, {
				"label": "安仁乡",
				"value": "7081",
				"children": []
			}, {
				"label": "葫芦乡",
				"value": "7082",
				"children": []
			}, {
				"label": "大滩乡",
				"value": "7083",
				"children": []
			}, {
				"label": "花红乡",
				"value": "7084",
				"children": []
			}, {
				"label": "黄庭乡",
				"value": "7085",
				"children": []
			}, {
				"label": "黄都乡",
				"value": "7086",
				"children": []
			}, {
				"label": "平滩乡",
				"value": "7087",
				"children": []
			}, {
				"label": "碑高乡",
				"value": "7088",
				"children": []
			}, {
				"label": "马家乡",
				"value": "7089",
				"children": []
			}, {
				"label": "木子乡",
				"value": "7090",
				"children": []
			}, {
				"label": "双庙乡",
				"value": "7091",
				"children": []
			}, {
				"label": "斌郎乡",
				"value": "7092",
				"children": []
			}, {
				"label": "幺塘乡",
				"value": "7093",
				"children": []
			}, {
				"label": "陈家乡",
				"value": "7094",
				"children": []
			}, {
				"label": "龙会乡",
				"value": "7095",
				"children": []
			}, {
				"label": "罐子乡",
				"value": "7096",
				"children": []
			}, {
				"label": "申家乡",
				"value": "7097",
				"children": []
			}, {
				"label": "草兴乡",
				"value": "7098",
				"children": []
			}, {
				"label": "木头乡",
				"value": "7099",
				"children": []
			}, {
				"label": "金檀乡",
				"value": "7100",
				"children": []
			}, {
				"label": "大堰乡",
				"value": "7101",
				"children": []
			}, {
				"label": "赵固乡",
				"value": "7102",
				"children": []
			}, {
				"label": "九岭乡",
				"value": "7103",
				"children": []
			}, {
				"label": "桥湾乡",
				"value": "7104",
				"children": []
			}, {
				"label": "五四乡",
				"value": "7105",
				"children": []
			}, {
				"label": "银铁乡",
				"value": "7106",
				"children": []
			}, {
				"label": "沿河乡",
				"value": "7107",
				"children": []
			}, {
				"label": "香隆乡",
				"value": "7108",
				"children": []
			}, {
				"label": "永进乡",
				"value": "7109",
				"children": []
			}, {
				"label": "洛车乡",
				"value": "7110",
				"children": []
			}, {
				"label": "道让乡",
				"value": "7111",
				"children": []
			}, {
				"label": "虎让乡",
				"value": "7112",
				"children": []
			}, {
				"label": "米城乡",
				"value": "7113",
				"children": []
			}, {
				"label": "龙滩乡",
				"value": "7114",
				"children": []
			}, {
				"label": "梓桐乡",
				"value": "7115",
				"children": []
			}, {
				"label": "北山乡",
				"value": "7116",
				"children": []
			}, {
				"label": "金石乡",
				"value": "7117",
				"children": []
			}, {
				"label": "安云乡",
				"value": "7118",
				"children": []
			}, {
				"label": "青宁乡",
				"value": "7119",
				"children": []
			}, {
				"label": "檬双乡",
				"value": "7120",
				"children": []
			}]
		}, {
			"label": "大竹县",
			"value": "2036",
			"children": [{
				"label": "竹阳镇",
				"value": "7195",
				"children": []
			}, {
				"label": "乌木镇",
				"value": "7196",
				"children": []
			}, {
				"label": "团坝镇",
				"value": "7197",
				"children": []
			}, {
				"label": "杨家镇",
				"value": "7198",
				"children": []
			}, {
				"label": "清河镇",
				"value": "7199",
				"children": []
			}, {
				"label": "柏林镇",
				"value": "7200",
				"children": []
			}, {
				"label": "石河镇",
				"value": "7201",
				"children": []
			}, {
				"label": "双拱镇",
				"value": "7202",
				"children": []
			}, {
				"label": "石桥铺镇",
				"value": "7203",
				"children": []
			}, {
				"label": "观音镇",
				"value": "7204",
				"children": []
			}, {
				"label": "周家镇",
				"value": "7205",
				"children": []
			}, {
				"label": "石子镇",
				"value": "7206",
				"children": []
			}, {
				"label": "文星镇",
				"value": "7207",
				"children": []
			}, {
				"label": "妈妈镇",
				"value": "7208",
				"children": []
			}, {
				"label": "高穴镇",
				"value": "7209",
				"children": []
			}, {
				"label": "欧家镇",
				"value": "7210",
				"children": []
			}, {
				"label": "庙坝镇",
				"value": "7211",
				"children": []
			}, {
				"label": "清水镇",
				"value": "7212",
				"children": []
			}, {
				"label": "城西乡",
				"value": "7213",
				"children": []
			}, {
				"label": "竹北乡",
				"value": "7214",
				"children": []
			}, {
				"label": "东柳乡",
				"value": "7215",
				"children": []
			}, {
				"label": "朝阳乡",
				"value": "7216",
				"children": []
			}, {
				"label": "人和乡",
				"value": "7217",
				"children": []
			}, {
				"label": "中华乡",
				"value": "7218",
				"children": []
			}, {
				"label": "黄家乡",
				"value": "7219",
				"children": []
			}, {
				"label": "柏家乡",
				"value": "7220",
				"children": []
			}, {
				"label": "李家乡",
				"value": "7221",
				"children": []
			}, {
				"label": "月华乡",
				"value": "7222",
				"children": []
			}, {
				"label": "二郎乡",
				"value": "7223",
				"children": []
			}, {
				"label": "蒲包乡",
				"value": "7224",
				"children": []
			}, {
				"label": "永胜乡",
				"value": "7225",
				"children": []
			}, {
				"label": "新生乡",
				"value": "7226",
				"children": []
			}, {
				"label": "安吉乡",
				"value": "7227",
				"children": []
			}, {
				"label": "白坝乡",
				"value": "7228",
				"children": []
			}, {
				"label": "双溪乡",
				"value": "7229",
				"children": []
			}, {
				"label": "高明乡",
				"value": "7230",
				"children": []
			}, {
				"label": "八渡乡",
				"value": "7231",
				"children": []
			}, {
				"label": "中和乡",
				"value": "7232",
				"children": []
			}, {
				"label": "杨通乡",
				"value": "7233",
				"children": []
			}, {
				"label": "天城乡",
				"value": "7234",
				"children": []
			}, {
				"label": "四合乡",
				"value": "7235",
				"children": []
			}, {
				"label": "张家乡",
				"value": "7236",
				"children": []
			}, {
				"label": "童家乡",
				"value": "7237",
				"children": []
			}, {
				"label": "神合乡",
				"value": "7238",
				"children": []
			}, {
				"label": "金鸡乡",
				"value": "7239",
				"children": []
			}, {
				"label": "黄滩乡",
				"value": "7240",
				"children": []
			}, {
				"label": "牌坊乡",
				"value": "7241",
				"children": []
			}, {
				"label": "姚市乡",
				"value": "7242",
				"children": []
			}, {
				"label": "莲印乡",
				"value": "7243",
				"children": []
			}, {
				"label": "川主乡",
				"value": "7244",
				"children": []
			}]
		}, {
			"label": "渠县",
			"value": "2037",
			"children": [{
				"label": "渠江镇",
				"value": "7245",
				"children": []
			}, {
				"label": "天星镇",
				"value": "7246",
				"children": []
			}, {
				"label": "临巴镇",
				"value": "7247",
				"children": []
			}, {
				"label": "土溪镇",
				"value": "7248",
				"children": []
			}, {
				"label": "三汇镇",
				"value": "7249",
				"children": []
			}, {
				"label": "文崇镇",
				"value": "7250",
				"children": []
			}, {
				"label": "涌兴镇",
				"value": "7251",
				"children": []
			}, {
				"label": "贵福镇",
				"value": "7252",
				"children": []
			}, {
				"label": "岩峰镇",
				"value": "7253",
				"children": []
			}, {
				"label": "静边镇",
				"value": "7254",
				"children": []
			}, {
				"label": "清溪场镇",
				"value": "7255",
				"children": []
			}, {
				"label": "宝城镇",
				"value": "7256",
				"children": []
			}, {
				"label": "有庆镇",
				"value": "7257",
				"children": []
			}, {
				"label": "鲜渡镇",
				"value": "7258",
				"children": []
			}, {
				"label": "琅琊镇",
				"value": "7259",
				"children": []
			}, {
				"label": "渠南乡",
				"value": "7260",
				"children": []
			}, {
				"label": "渠北乡",
				"value": "7261",
				"children": []
			}, {
				"label": "青龙乡",
				"value": "7262",
				"children": []
			}, {
				"label": "板桥乡",
				"value": "7263",
				"children": []
			}, {
				"label": "锡溪乡",
				"value": "7264",
				"children": []
			}, {
				"label": "龙潭乡",
				"value": "7265",
				"children": []
			}, {
				"label": "河东乡",
				"value": "7266",
				"children": []
			}, {
				"label": "李馥乡",
				"value": "7267",
				"children": []
			}, {
				"label": "青神乡",
				"value": "7268",
				"children": []
			}, {
				"label": "流溪乡",
				"value": "7269",
				"children": []
			}, {
				"label": "东安乡",
				"value": "7270",
				"children": []
			}, {
				"label": "汇东乡",
				"value": "7271",
				"children": []
			}, {
				"label": "汇南乡",
				"value": "7272",
				"children": []
			}, {
				"label": "汇北乡",
				"value": "7273",
				"children": []
			}, {
				"label": "丰乐乡",
				"value": "7274",
				"children": []
			}, {
				"label": "报恩乡",
				"value": "7275",
				"children": []
			}, {
				"label": "安北乡",
				"value": "7276",
				"children": []
			}, {
				"label": "平安乡",
				"value": "7277",
				"children": []
			}, {
				"label": "千佛乡",
				"value": "7278",
				"children": []
			}, {
				"label": "柏水乡",
				"value": "7279",
				"children": []
			}, {
				"label": "大义乡",
				"value": "7280",
				"children": []
			}, {
				"label": "义和乡",
				"value": "7281",
				"children": []
			}, {
				"label": "水口乡",
				"value": "7282",
				"children": []
			}, {
				"label": "三板乡",
				"value": "7283",
				"children": []
			}, {
				"label": "巨光乡",
				"value": "7284",
				"children": []
			}, {
				"label": "蔡和乡",
				"value": "7285",
				"children": []
			}, {
				"label": "鹤林乡",
				"value": "7286",
				"children": []
			}, {
				"label": "白兔乡",
				"value": "7287",
				"children": []
			}, {
				"label": "青丝乡",
				"value": "7288",
				"children": []
			}, {
				"label": "万寿乡",
				"value": "7289",
				"children": []
			}, {
				"label": "射洪乡",
				"value": "7290",
				"children": []
			}, {
				"label": "望江乡",
				"value": "7291",
				"children": []
			}, {
				"label": "和乐乡",
				"value": "7292",
				"children": []
			}, {
				"label": "龙凤乡",
				"value": "7293",
				"children": []
			}, {
				"label": "新市乡",
				"value": "7294",
				"children": []
			}, {
				"label": "宋家乡",
				"value": "7295",
				"children": []
			}, {
				"label": "拱市乡",
				"value": "7296",
				"children": []
			}, {
				"label": "中滩乡",
				"value": "7297",
				"children": []
			}, {
				"label": "屏西乡",
				"value": "7298",
				"children": []
			}, {
				"label": "定远乡",
				"value": "7299",
				"children": []
			}, {
				"label": "嘉禾乡",
				"value": "7300",
				"children": []
			}, {
				"label": "李渡乡",
				"value": "7301",
				"children": []
			}, {
				"label": "望溪乡",
				"value": "7302",
				"children": []
			}, {
				"label": "双土乡",
				"value": "7303",
				"children": []
			}, {
				"label": "卷硐乡",
				"value": "7304",
				"children": []
			}]
		}, {
			"label": "万源市",
			"value": "2038",
			"children": [{
				"label": "太平镇",
				"value": "7305",
				"children": []
			}, {
				"label": "青花镇",
				"value": "7306",
				"children": []
			}, {
				"label": "旧院镇",
				"value": "7307",
				"children": []
			}, {
				"label": "罗文镇",
				"value": "7308",
				"children": []
			}, {
				"label": "河口镇",
				"value": "7309",
				"children": []
			}, {
				"label": "草坝镇",
				"value": "7310",
				"children": []
			}, {
				"label": "竹峪镇",
				"value": "7311",
				"children": []
			}, {
				"label": "大竹镇",
				"value": "7312",
				"children": []
			}, {
				"label": "黄钟镇",
				"value": "7313",
				"children": []
			}, {
				"label": "官渡镇",
				"value": "7314",
				"children": []
			}, {
				"label": "白沙镇",
				"value": "7315",
				"children": []
			}, {
				"label": "沙滩镇",
				"value": "7316",
				"children": []
			}, {
				"label": "茶垭乡",
				"value": "7317",
				"children": []
			}, {
				"label": "长石乡",
				"value": "7318",
				"children": []
			}, {
				"label": "白羊乡",
				"value": "7319",
				"children": []
			}, {
				"label": "铁矿乡",
				"value": "7320",
				"children": []
			}, {
				"label": "固军乡",
				"value": "7321",
				"children": []
			}, {
				"label": "井溪乡",
				"value": "7322",
				"children": []
			}, {
				"label": "堰塘乡",
				"value": "7323",
				"children": []
			}, {
				"label": "蜂桶乡",
				"value": "7324",
				"children": []
			}, {
				"label": "花楼乡",
				"value": "7325",
				"children": []
			}, {
				"label": "长坝乡",
				"value": "7326",
				"children": []
			}, {
				"label": "曾家乡",
				"value": "7327",
				"children": []
			}, {
				"label": "大沙乡",
				"value": "7328",
				"children": []
			}, {
				"label": "秦河乡",
				"value": "7329",
				"children": []
			}, {
				"label": "庙垭乡",
				"value": "7330",
				"children": []
			}, {
				"label": "鹰背乡",
				"value": "7331",
				"children": []
			}, {
				"label": "石窝乡",
				"value": "7332",
				"children": []
			}, {
				"label": "玉带乡",
				"value": "7333",
				"children": []
			}, {
				"label": "新店乡",
				"value": "7334",
				"children": []
			}, {
				"label": "魏家乡",
				"value": "7335",
				"children": []
			}, {
				"label": "柳黄乡",
				"value": "7336",
				"children": []
			}, {
				"label": "溪口乡",
				"value": "7337",
				"children": []
			}, {
				"label": "永宁乡",
				"value": "7338",
				"children": []
			}, {
				"label": "虹桥乡",
				"value": "7339",
				"children": []
			}, {
				"label": "康乐乡",
				"value": "7340",
				"children": []
			}, {
				"label": "白果乡",
				"value": "7341",
				"children": []
			}, {
				"label": "钟亭乡",
				"value": "7342",
				"children": []
			}, {
				"label": "庙子乡",
				"value": "7343",
				"children": []
			}, {
				"label": "紫溪乡",
				"value": "7344",
				"children": []
			}, {
				"label": "庙坡乡",
				"value": "7345",
				"children": []
			}, {
				"label": "梨树乡",
				"value": "7346",
				"children": []
			}, {
				"label": "皮窝乡",
				"value": "7347",
				"children": []
			}, {
				"label": "丝罗乡",
				"value": "7348",
				"children": []
			}, {
				"label": "罐坝乡",
				"value": "7349",
				"children": []
			}, {
				"label": "石人乡",
				"value": "7350",
				"children": []
			}, {
				"label": "赵塘乡",
				"value": "7351",
				"children": []
			}, {
				"label": "中坪乡",
				"value": "7352",
				"children": []
			}, {
				"label": "八台乡",
				"value": "7353",
				"children": []
			}, {
				"label": "花萼乡",
				"value": "7354",
				"children": []
			}, {
				"label": "曹家乡",
				"value": "7355",
				"children": []
			}, {
				"label": "石塘乡",
				"value": "7356",
				"children": []
			}]
		}, {
			"label": "宣汉县",
			"value": "2039",
			"children": [{
				"label": "东乡镇",
				"value": "7121",
				"children": []
			}, {
				"label": "君塘镇",
				"value": "7122",
				"children": []
			}, {
				"label": "清溪镇",
				"value": "7123",
				"children": []
			}, {
				"label": "普光镇",
				"value": "7124",
				"children": []
			}, {
				"label": "天生镇",
				"value": "7125",
				"children": []
			}, {
				"label": "柏树镇",
				"value": "7126",
				"children": []
			}, {
				"label": "芭蕉镇",
				"value": "7127",
				"children": []
			}, {
				"label": "南坝镇",
				"value": "7128",
				"children": []
			}, {
				"label": "五宝镇",
				"value": "7129",
				"children": []
			}, {
				"label": "峰城镇",
				"value": "7130",
				"children": []
			}, {
				"label": "土黄镇",
				"value": "7131",
				"children": []
			}, {
				"label": "华景镇",
				"value": "7132",
				"children": []
			}, {
				"label": "樊哙镇",
				"value": "7133",
				"children": []
			}, {
				"label": "新华镇",
				"value": "7134",
				"children": []
			}, {
				"label": "黄金镇",
				"value": "7135",
				"children": []
			}, {
				"label": "胡家镇",
				"value": "7136",
				"children": []
			}, {
				"label": "毛坝镇",
				"value": "7137",
				"children": []
			}, {
				"label": "双河镇",
				"value": "7138",
				"children": []
			}, {
				"label": "大成镇",
				"value": "7139",
				"children": []
			}, {
				"label": "明月乡",
				"value": "7140",
				"children": []
			}, {
				"label": "红岭乡",
				"value": "7141",
				"children": []
			}, {
				"label": "柳池乡",
				"value": "7142",
				"children": []
			}, {
				"label": "三河乡",
				"value": "7143",
				"children": []
			}, {
				"label": "老君乡",
				"value": "7144",
				"children": []
			}, {
				"label": "黄石乡",
				"value": "7145",
				"children": []
			}, {
				"label": "七里乡",
				"value": "7146",
				"children": []
			}, {
				"label": "庙安乡",
				"value": "7147",
				"children": []
			}, {
				"label": "天宝乡",
				"value": "7148",
				"children": []
			}, {
				"label": "东林乡",
				"value": "7149",
				"children": []
			}, {
				"label": "下八乡",
				"value": "7150",
				"children": []
			}, {
				"label": "凉风乡",
				"value": "7151",
				"children": []
			}, {
				"label": "上峡乡",
				"value": "7152",
				"children": []
			}, {
				"label": "塔河乡",
				"value": "7153",
				"children": []
			}, {
				"label": "茶河乡",
				"value": "7154",
				"children": []
			}, {
				"label": "天台乡",
				"value": "7155",
				"children": []
			}, {
				"label": "观山乡",
				"value": "7156",
				"children": []
			}, {
				"label": "南坪乡",
				"value": "7157",
				"children": []
			}, {
				"label": "凤林乡",
				"value": "7158",
				"children": []
			}, {
				"label": "桃花乡",
				"value": "7159",
				"children": []
			}, {
				"label": "白马乡",
				"value": "7160",
				"children": []
			}, {
				"label": "漆碑乡",
				"value": "7161",
				"children": []
			}, {
				"label": "三墩土家族乡",
				"value": "7162",
				"children": []
			}, {
				"label": "漆树土家族乡",
				"value": "7163",
				"children": []
			}, {
				"label": "龙泉土家族乡",
				"value": "7164",
				"children": []
			}, {
				"label": "渡口土家族乡",
				"value": "7165",
				"children": []
			}, {
				"label": "石铁乡",
				"value": "7166",
				"children": []
			}, {
				"label": "厂溪乡",
				"value": "7167",
				"children": []
			}, {
				"label": "红峰乡",
				"value": "7168",
				"children": []
			}, {
				"label": "凤鸣乡",
				"value": "7169",
				"children": []
			}, {
				"label": "花池乡",
				"value": "7170",
				"children": []
			}, {
				"label": "土主乡",
				"value": "7171",
				"children": []
			}, {
				"label": "庆云乡",
				"value": "7172",
				"children": []
			}, {
				"label": "马渡乡",
				"value": "7173",
				"children": []
			}, {
				"label": "隘口乡",
				"value": "7174",
				"children": []
			}]
		}, {
			"label": "开江县",
			"value": "2040",
			"children": [{
				"label": "新宁镇",
				"value": "7175",
				"children": []
			}, {
				"label": "普安镇",
				"value": "7176",
				"children": []
			}, {
				"label": "回龙镇",
				"value": "7177",
				"children": []
			}, {
				"label": "天师镇",
				"value": "7178",
				"children": []
			}, {
				"label": "永兴镇",
				"value": "7179",
				"children": []
			}, {
				"label": "讲治镇",
				"value": "7180",
				"children": []
			}, {
				"label": "甘棠镇",
				"value": "7181",
				"children": []
			}, {
				"label": "任市镇",
				"value": "7182",
				"children": []
			}, {
				"label": "广福镇",
				"value": "7183",
				"children": []
			}, {
				"label": "长岭镇",
				"value": "7184",
				"children": []
			}, {
				"label": "长田乡",
				"value": "7185",
				"children": []
			}, {
				"label": "骑龙乡",
				"value": "7186",
				"children": []
			}, {
				"label": "新太乡",
				"value": "7187",
				"children": []
			}, {
				"label": "灵岩乡",
				"value": "7188",
				"children": []
			}, {
				"label": "沙坝场乡",
				"value": "7189",
				"children": []
			}, {
				"label": "梅家乡",
				"value": "7190",
				"children": []
			}, {
				"label": "宝石乡",
				"value": "7191",
				"children": []
			}, {
				"label": "靖安乡",
				"value": "7192",
				"children": []
			}, {
				"label": "新街乡",
				"value": "7193",
				"children": []
			}, {
				"label": "拔妙乡",
				"value": "7194",
				"children": []
			}]
		}]
	}, {
		"label": "巴中市",
		"value": "2042",
		"children": [{
			"label": "南江县",
			"value": "2044",
		}, {
			"label": "平昌县",
			"value": "2045",
		}, {
			"label": "通江县",
			"value": "2046",
		}, {
			"label": "巴州区",
			"value": "3904",
		}, {
			"label": "恩阳区",
			"value": "53303",
		}]
	}, {
		"label": "雅安市",
		"value": "2047",
		"children": [{
			"label": "芦山县",
			"value": "2049",
		}, {
			"label": "石棉县",
			"value": "2052",
		}, {
			"label": "名山区",
			"value": "2053",
		}, {
			"label": "天全县",
			"value": "2054",
		}, {
			"label": "荥经县",
			"value": "2055",
		}, {
			"label": "汉源县",
			"value": "2056",
		}, {
			"label": "宝兴县",
			"value": "2057",
		}, {
			"label": "雨城区",
			"value": "53304",
		}]
	}, {
		"label": "眉山市",
		"value": "2058",
		"children": [{
			"label": "仁寿县",
			"value": "2060",
		}, {
			"label": "彭山县",
			"value": "2061",
		}, {
			"label": "洪雅县",
			"value": "2062",
		}, {
			"label": "丹棱县",
			"value": "2063",
		}, {
			"label": "青神县",
			"value": "2064",
		}, {
			"label": "东坡区",
			"value": "53305",
		}]
	}, {
		"label": "资阳市",
		"value": "2065",
		"children": [{
			"label": "安岳县",
			"value": "2068",
		}, {
			"label": "乐至县",
			"value": "2069",
		}, {
			"label": "雁江区",
			"value": "3905",
		}, {
			"label": "简阳市",
			"value": "53306",
		}]
	}, {
		"label": "阿坝州",
		"value": "2070",
		"children": [{
			"label": "马尔康县",
			"value": "2071",
		}, {
			"label": "九寨沟县",
			"value": "2072",
		}, {
			"label": "红原县",
			"value": "2073",
		}, {
			"label": "阿坝县",
			"value": "2075",
		}, {
			"label": "理县",
			"value": "2076",
		}, {
			"label": "若尔盖县",
			"value": "2077",
		}, {
			"label": "金川县",
			"value": "2078",
		}, {
			"label": "小金县",
			"value": "2079",
		}, {
			"label": "黑水县",
			"value": "2080",
		}, {
			"label": "松潘县",
			"value": "2081",
		}, {
			"label": "壤塘县",
			"value": "2082",
		}, {
			"label": "茂县",
			"value": "2083",
		}, {
			"label": "汶川县",
			"value": "53307",
		}]
	}, {
		"label": "甘孜州",
		"value": "2084",
		"children": [{
			"label": "康定县",
			"value": "2085",
		}, {
			"label": "泸定县",
			"value": "2086",
		}, {
			"label": "九龙县",
			"value": "2087",
		}, {
			"label": "丹巴县",
			"value": "2088",
		}, {
			"label": "道孚县",
			"value": "2089",
		}, {
			"label": "炉霍县",
			"value": "2090",
		}, {
			"label": "色达县",
			"value": "2091",
		}, {
			"label": "甘孜县",
			"value": "2092",
		}, {
			"label": "新龙县",
			"value": "2093",
		}, {
			"label": "白玉县",
			"value": "2094",
		}, {
			"label": "德格县",
			"value": "2095",
		}, {
			"label": "石渠县",
			"value": "2096",
		}, {
			"label": "雅江县",
			"value": "2097",
		}, {
			"label": "理塘县",
			"value": "2098",
		}, {
			"label": "巴塘县",
			"value": "2099",
		}, {
			"label": "稻城县",
			"value": "2100",
		}, {
			"label": "乡城县",
			"value": "2101",
		}, {
			"label": "得荣县",
			"value": "2102",
		}]
	}, {
		"label": "凉山州",
		"value": "2103",
		"children": [{
			"label": "美姑县",
			"value": "2105",
		}, {
			"label": "昭觉县",
			"value": "2106",
		}, {
			"label": "会理县",
			"value": "2107",
		}, {
			"label": "会东县",
			"value": "2108",
		}, {
			"label": "普格县",
			"value": "2109",
		}, {
			"label": "宁南县",
			"value": "2110",
		}, {
			"label": "德昌县",
			"value": "2111",
		}, {
			"label": "冕宁县",
			"value": "2112",
		}, {
			"label": "盐源县",
			"value": "2113",
		}, {
			"label": "金阳县",
			"value": "2114",
		}, {
			"label": "布拖县",
			"value": "2115",
		}, {
			"label": "雷波县",
			"value": "2116",
		}, {
			"label": "越西县",
			"value": "2117",
		}, {
			"label": "喜德县",
			"value": "2118",
		}, {
			"label": "甘洛县",
			"value": "2119",
		}, {
			"label": "木里县",
			"value": "2120",
		}, {
			"label": "西昌市",
			"value": "53308",
		}]
	}]
}, {
	"label": "海南",
	"value": "23",
	"children": [{
		"label": "海口市",
		"value": "2121",
		"children": [{
			"label": "秀英区",
			"value": "53309",
		}, {
			"label": "龙华区",
			"value": "53310",
		}, {
			"label": "琼山区",
			"value": "53311",
		}, {
			"label": "美兰区",
			"value": "53312",
		}]
	}, {
		"label": "儋州市",
		"value": "3034",
		"children": [{
			"label": "那大镇",
			"value": "3125",
		}, {
			"label": "和庆镇",
			"value": "3733",
		}, {
			"label": "南丰镇",
			"value": "3734",
		}, {
			"label": "大成镇",
			"value": "3735",
		}, {
			"label": "雅星镇",
			"value": "3736",
		}, {
			"label": "兰洋镇",
			"value": "3737",
		}, {
			"label": "光村镇",
			"value": "3738",
		}, {
			"label": "木棠镇",
			"value": "3739",
		}, {
			"label": "海头镇",
			"value": "3740",
		}, {
			"label": "峨蔓镇",
			"value": "3741",
		}, {
			"label": "三都镇",
			"value": "3744",
		}, {
			"label": "王五镇",
			"value": "3745",
		}, {
			"label": "白马井镇",
			"value": "3746",
		}, {
			"label": "中和镇",
			"value": "3747",
		}, {
			"label": "排浦镇",
			"value": "3748",
		}, {
			"label": "东成镇",
			"value": "3749",
		}, {
			"label": "新州镇",
			"value": "3750",
		}, {
			"label": "洋浦经济开发区",
			"value": "3751",
		}, {
			"label": "富克镇",
			"value": "4214",
		}, {
			"label": "西培农场",
			"value": "53313",
		}, {
			"label": "西联农场",
			"value": "53314",
		}, {
			"label": "蓝洋农场",
			"value": "53315",
		}, {
			"label": "八一农场",
			"value": "53316",
		}, {
			"label": "西华农场",
			"value": "53317",
		}, {
			"label": "西庆农场",
			"value": "53318",
		}, {
			"label": "西流农场",
			"value": "53319",
		}, {
			"label": "新盈农场",
			"value": "53320",
		}, {
			"label": "龙山农场",
			"value": "53321",
		}, {
			"label": "红岭农场",
			"value": "53322",
		}, {
			"label": "热作学院",
			"value": "53323",
		}]
	}, {
		"label": "琼海市",
		"value": "3115",
		"children": [{
			"label": "嘉积镇",
			"value": "3720",
		}, {
			"label": "万泉镇",
			"value": "3721",
		}, {
			"label": "石壁镇",
			"value": "3722",
		}, {
			"label": "中原镇",
			"value": "3723",
		}, {
			"label": "博鳌镇",
			"value": "3724",
		}, {
			"label": "阳江镇",
			"value": "3725",
		}, {
			"label": "龙江镇",
			"value": "3727",
		}, {
			"label": "潭门镇",
			"value": "3728",
		}, {
			"label": "塔洋镇",
			"value": "3729",
		}, {
			"label": "长坡镇",
			"value": "3730",
		}, {
			"label": "大路镇",
			"value": "3731",
		}, {
			"label": "会山镇",
			"value": "3732",
		}, {
			"label": "彬村山华侨农场",
			"value": "53324",
		}, {
			"label": "东太农场",
			"value": "53325",
		}, {
			"label": "东红农场",
			"value": "53326",
		}, {
			"label": "东升农场",
			"value": "53327",
		}, {
			"label": "南俸农场",
			"value": "53328",
		}]
	}, {
		"label": "万宁市",
		"value": "3137",
		"children": [{
			"label": "万城镇",
			"value": "3768",
		}, {
			"label": "龙滚镇",
			"value": "3769",
		}, {
			"label": "和乐镇",
			"value": "3770",
		}, {
			"label": "后安镇",
			"value": "3771",
		}, {
			"label": "大茂镇",
			"value": "3772",
		}, {
			"label": "东澳镇",
			"value": "3773",
		}, {
			"label": "礼纪镇",
			"value": "3774",
		}, {
			"label": "长丰镇",
			"value": "3775",
		}, {
			"label": "山根镇",
			"value": "3776",
		}, {
			"label": "北大镇",
			"value": "3777",
		}, {
			"label": "南桥镇",
			"value": "3778",
		}, {
			"label": "三更罗镇",
			"value": "3779",
		}, {
			"label": "六连林场",
			"value": "53329",
		}, {
			"label": "东兴农场",
			"value": "53330",
		}, {
			"label": "东和农场",
			"value": "53331",
		}, {
			"label": "新中农场",
			"value": "53332",
		}, {
			"label": "兴隆华侨农场",
			"value": "53333",
		}, {
			"label": "兴隆镇",
			"value": "53334",
		}, {
			"label": "南林农场",
			"value": "53335",
		}]
	}, {
		"label": "东方市",
		"value": "3173",
		"children": [{
			"label": "八所镇",
			"value": "3780",
		}, {
			"label": "东河镇",
			"value": "3781",
		}, {
			"label": "大田镇",
			"value": "3782",
		}, {
			"label": "感城镇",
			"value": "3783",
		}, {
			"label": "板桥镇",
			"value": "3784",
		}, {
			"label": "三家镇",
			"value": "3785",
		}, {
			"label": "四更镇",
			"value": "3786",
		}, {
			"label": "新龙镇",
			"value": "3787",
		}, {
			"label": "天安乡",
			"value": "3788",
		}, {
			"label": "江边乡",
			"value": "3789",
		}, {
			"label": "广坝农场",
			"value": "53336",
		}, {
			"label": "东方华侨农场",
			"value": "53337",
		}]
	}, {
		"label": "三亚市",
		"value": "3690",
		"children": [{
			"label": "海棠区",
			"value": "3693",
		}, {
			"label": "吉阳区",
			"value": "3694",
		}, {
			"label": "天涯区",
			"value": "3696",
		}, {
			"label": "崖州区",
			"value": "3697",
		}]
	}, {
		"label": "文昌市",
		"value": "3698",
		"children": [{
			"label": "文城镇",
			"value": "3752",
		}, {
			"label": "重兴镇",
			"value": "3753",
		}, {
			"label": "蓬莱镇",
			"value": "3754",
		}, {
			"label": "会文镇",
			"value": "3755",
		}, {
			"label": "东路镇",
			"value": "3756",
		}, {
			"label": "潭牛镇",
			"value": "3757",
		}, {
			"label": "东阁镇",
			"value": "3758",
		}, {
			"label": "文教镇",
			"value": "3759",
		}, {
			"label": "东郊镇",
			"value": "3760",
		}, {
			"label": "龙楼镇",
			"value": "3761",
		}, {
			"label": "昌洒镇",
			"value": "3762",
		}, {
			"label": "翁田镇",
			"value": "3763",
		}, {
			"label": "抱罗镇",
			"value": "3764",
		}, {
			"label": "冯坡镇",
			"value": "3765",
		}, {
			"label": "锦山镇",
			"value": "3766",
		}, {
			"label": "铺前镇",
			"value": "3767",
		}, {
			"label": "公坡镇",
			"value": "53338",
		}, {
			"label": "迈号镇",
			"value": "53339",
		}, {
			"label": "清谰镇",
			"value": "53340",
		}, {
			"label": "南阳镇",
			"value": "53341",
		}, {
			"label": "新桥镇",
			"value": "53342",
		}, {
			"label": "头苑镇",
			"value": "53343",
		}, {
			"label": "宝芳乡",
			"value": "53344",
		}, {
			"label": "龙马乡",
			"value": "53345",
		}, {
			"label": "湖山乡",
			"value": "53346",
		}, {
			"label": "东路农场",
			"value": "53347",
		}, {
			"label": "南阳农场",
			"value": "53348",
		}, {
			"label": "罗豆农场",
			"value": "53349",
		}, {
			"label": "橡胶研究所",
			"value": "53350",
		}]
	}, {
		"label": "五指山市",
		"value": "3699",
		"children": [{
			"label": "通什镇",
			"value": "3712",
		}, {
			"label": "南圣镇",
			"value": "3713",
		}, {
			"label": "毛阳镇",
			"value": "3714",
		}, {
			"label": "番阳镇",
			"value": "3715",
		}, {
			"label": "畅好乡",
			"value": "3716",
		}, {
			"label": "毛道乡",
			"value": "3717",
		}, {
			"label": "水满乡",
			"value": "3719",
		}, {
			"label": "畅好农场",
			"value": "53351",
		}]
	}, {
		"label": "临高县",
		"value": "3701",
		"children": [{
			"label": "临城镇",
			"value": "3790",
		}, {
			"label": "波莲镇",
			"value": "3791",
		}, {
			"label": "东英镇",
			"value": "3792",
		}, {
			"label": "博厚镇",
			"value": "3793",
		}, {
			"label": "皇桐镇",
			"value": "3794",
		}, {
			"label": "多文镇",
			"value": "3795",
		}, {
			"label": "和舍镇",
			"value": "3796",
		}, {
			"label": "南宝镇",
			"value": "3797",
		}, {
			"label": "新盈镇",
			"value": "3798",
		}, {
			"label": "调楼镇",
			"value": "3799",
		}, {
			"label": "加来镇",
			"value": "3800",
		}, {
			"label": "红华农场",
			"value": "53352",
		}, {
			"label": "加来农场",
			"value": "53353",
		}, {
			"label": "城区",
			"value": "53354",
		}]
	}, {
		"label": "澄迈县",
		"value": "3702",
		"children": [{
			"label": "金江镇",
			"value": "3801",
		}, {
			"label": "老城镇",
			"value": "3802",
		}, {
			"label": "瑞溪镇",
			"value": "3803",
		}, {
			"label": "永发镇",
			"value": "3804",
		}, {
			"label": "加乐镇",
			"value": "3805",
		}, {
			"label": "文儒镇",
			"value": "3806",
		}, {
			"label": "中兴镇",
			"value": "3807",
		}, {
			"label": "仁兴镇",
			"value": "3808",
		}, {
			"label": "福山镇",
			"value": "3809",
		}, {
			"label": "桥头镇",
			"value": "3810",
		}, {
			"label": "大丰镇",
			"value": "53355",
		}, {
			"label": "红光农场",
			"value": "53356",
		}, {
			"label": "西达农场",
			"value": "53357",
		}, {
			"label": "金安农场",
			"value": "53358",
		}, {
			"label": "城区",
			"value": "53359",
		}]
	}, {
		"label": "定安县",
		"value": "3703",
		"children": [{
			"label": "定城镇",
			"value": "3811",
		}, {
			"label": "新竹镇",
			"value": "3812",
		}, {
			"label": "龙湖镇",
			"value": "3813",
		}, {
			"label": "雷鸣镇",
			"value": "3814",
		}, {
			"label": "龙门镇",
			"value": "3815",
		}, {
			"label": "龙河镇",
			"value": "3816",
		}, {
			"label": "岭口镇",
			"value": "3817",
		}, {
			"label": "翰林镇",
			"value": "3818",
		}, {
			"label": "富文镇",
			"value": "3819",
		}, {
			"label": "黄竹镇",
			"value": "4498",
		}, {
			"label": "金鸡岭农场",
			"value": "53361",
		}, {
			"label": "中瑞农场",
			"value": "53362",
		}, {
			"label": "南海农场",
			"value": "53363",
		}, {
			"label": "城区",
			"value": "53364",
		}]
	}, {
		"label": "屯昌县",
		"value": "3704",
		"children": [{
			"label": "屯城镇",
			"value": "3820",
		}, {
			"label": "新兴镇",
			"value": "3821",
		}, {
			"label": "枫木镇",
			"value": "3822",
		}, {
			"label": "乌坡镇",
			"value": "3823",
		}, {
			"label": "南吕镇",
			"value": "3824",
		}, {
			"label": "南坤镇",
			"value": "3825",
		}, {
			"label": "坡心镇",
			"value": "3826",
		}, {
			"label": "西昌镇",
			"value": "3827",
		}, {
			"label": "中建农场",
			"value": "53365",
		}, {
			"label": "中坤农场",
			"value": "53366",
		}, {
			"label": "县城内",
			"value": "53367",
		}]
	}, {
		"label": "昌江县",
		"value": "3705",
		"children": [{
			"label": "石碌镇",
			"value": "3828",
		}, {
			"label": "叉河镇",
			"value": "3829",
		}, {
			"label": "十月田镇",
			"value": "3830",
		}, {
			"label": "乌烈镇",
			"value": "3831",
		}, {
			"label": "昌化镇",
			"value": "3832",
		}, {
			"label": "海尾镇",
			"value": "3833",
		}, {
			"label": "七叉镇",
			"value": "53368",
		}, {
			"label": "王下乡",
			"value": "53369",
		}, {
			"label": "海南矿业公司",
			"value": "53370",
		}, {
			"label": "霸王岭林场",
			"value": "53371",
		}, {
			"label": "红林农场",
			"value": "53372",
		}, {
			"label": "城区",
			"value": "53373",
		}]
	}, {
		"label": "白沙县",
		"value": "3706",
		"children": [{
			"label": "牙叉镇",
			"value": "3834",
		}, {
			"label": "七坊镇",
			"value": "3835",
		}, {
			"label": "邦溪镇",
			"value": "3836",
		}, {
			"label": "打安镇",
			"value": "3837",
		}, {
			"label": "细水乡",
			"value": "3838",
		}, {
			"label": "元门乡",
			"value": "3839",
		}, {
			"label": "南开乡",
			"value": "3840",
		}, {
			"label": "阜龙乡",
			"value": "3841",
		}, {
			"label": "青松乡",
			"value": "3842",
		}, {
			"label": "金波乡",
			"value": "3843",
		}, {
			"label": "荣邦乡",
			"value": "3844",
		}, {
			"label": "白沙农场",
			"value": "53374",
		}, {
			"label": "龙江农场",
			"value": "53375",
		}, {
			"label": "邦溪农场",
			"value": "53376",
		}, {
			"label": "城区",
			"value": "53377",
		}]
	}, {
		"label": "琼中县",
		"value": "3707",
		"children": [{
			"label": "营根镇",
			"value": "3878",
		}, {
			"label": "湾岭镇",
			"value": "3879",
		}, {
			"label": "黎母山镇",
			"value": "3880",
		}, {
			"label": "和平镇",
			"value": "3881",
		}, {
			"label": "长征镇",
			"value": "3882",
		}, {
			"label": "红毛镇",
			"value": "3883",
		}, {
			"label": "中平镇",
			"value": "3884",
		}, {
			"label": "上安乡",
			"value": "3885",
		}, {
			"label": "什运乡",
			"value": "3886",
		}, {
			"label": "吊罗山乡",
			"value": "53378",
		}, {
			"label": "黎母山林业公司",
			"value": "53379",
		}, {
			"label": "阳江农场",
			"value": "53380",
		}, {
			"label": "乌石农场",
			"value": "53381",
		}, {
			"label": "加钗农场",
			"value": "53382",
		}, {
			"label": "长征农场",
			"value": "53383",
		}, {
			"label": "城区",
			"value": "53384",
		}]
	}, {
		"label": "陵水县",
		"value": "3708",
		"children": [{
			"label": "椰林镇",
			"value": "3858",
		}, {
			"label": "光坡镇",
			"value": "3859",
		}, {
			"label": "三才镇",
			"value": "3860",
		}, {
			"label": "英州镇",
			"value": "3861",
		}, {
			"label": "隆广镇",
			"value": "3862",
		}, {
			"label": "文罗镇",
			"value": "3863",
		}, {
			"label": "本号镇",
			"value": "3864",
		}, {
			"label": "新村镇",
			"value": "3865",
		}, {
			"label": "黎安镇",
			"value": "3866",
		}, {
			"label": "提蒙乡",
			"value": "3867",
		}, {
			"label": "群英乡",
			"value": "3868",
		}, {
			"label": "吊罗山林业公司",
			"value": "53385",
		}, {
			"label": "岭门农场",
			"value": "53386",
		}, {
			"label": "南平农场",
			"value": "53387",
		}, {
			"label": "城区",
			"value": "53388",
		}, {
			"label": "东华镇",
			"value": "53389",
		}, {
			"label": "南平镇",
			"value": "53390",
		}]
	}, {
		"label": "保亭县",
		"value": "3709",
		"children": [{
			"label": "保城镇",
			"value": "3869",
		}, {
			"label": "什玲镇",
			"value": "3870",
		}, {
			"label": "加茂镇",
			"value": "3871",
		}, {
			"label": "响水镇",
			"value": "3872",
		}, {
			"label": "新政镇",
			"value": "3873",
		}, {
			"label": "三道镇",
			"value": "3874",
		}, {
			"label": "六弓乡",
			"value": "3875",
		}, {
			"label": "南林乡",
			"value": "3876",
		}, {
			"label": "毛感乡",
			"value": "3877",
		}, {
			"label": "保亭研究所",
			"value": "53391",
		}, {
			"label": "新星农场",
			"value": "53392",
		}, {
			"label": "金江农场",
			"value": "53393",
		}, {
			"label": "三道农场",
			"value": "53394",
		}]
	}, {
		"label": "乐东县",
		"value": "3710",
		"children": [{
			"label": "抱由镇",
			"value": "3845",
		}, {
			"label": "万冲镇",
			"value": "3846",
		}, {
			"label": "大安镇",
			"value": "3847",
		}, {
			"label": "志仲镇",
			"value": "3849",
		}, {
			"label": "千家镇",
			"value": "3851",
		}, {
			"label": "九所镇",
			"value": "3852",
		}, {
			"label": "利国镇",
			"value": "3853",
		}, {
			"label": "黄流镇",
			"value": "3854",
		}, {
			"label": "佛罗镇",
			"value": "3855",
		}, {
			"label": "尖峰镇",
			"value": "3856",
		}, {
			"label": "莺歌海镇",
			"value": "3857",
		}, {
			"label": "尖峰岭林业公司",
			"value": "53395",
		}, {
			"label": "莺歌海盐场",
			"value": "53396",
		}, {
			"label": "山荣农场",
			"value": "53397",
		}, {
			"label": "乐光农场",
			"value": "53398",
		}, {
			"label": "保国农场",
			"value": "53399",
		}, {
			"label": "城区",
			"value": "53400",
		}]
	}, {
		"label": "三沙市",
		"value": "3711",
		"children": [{
			"label": "西沙群岛",
			"value": "3887",
		}, {
			"label": "南沙群岛",
			"value": "3888",
		}, {
			"label": "中沙群岛",
			"value": "53401",
		}]
	}]
}, {
	"label": "贵州",
	"value": "24",
	"children": [{
		"label": "贵阳市",
		"value": "2144",
		"children": [{
			"label": "清镇市",
			"value": "2145",
		}, {
			"label": "开阳县",
			"value": "2146",
		}, {
			"label": "修文县",
			"value": "2147",
		}, {
			"label": "息烽县",
			"value": "2148",
		}, {
			"label": "乌当区",
			"value": "2149",
		}, {
			"label": "南明区",
			"value": "3906",
		}, {
			"label": "白云区",
			"value": "3909",
		}, {
			"label": "云岩区",
			"value": "53723",
		}, {
			"label": "花溪区",
			"value": "53724",
		}, {
			"label": "小河区",
			"value": "53725",
		}, {
			"label": "观山湖区",
			"value": "53726",
		}]
	}, {
		"label": "六盘水市",
		"value": "2150",
		"children": [{
			"label": "盘县",
			"value": "2151",
			"children": [{
				"label": "红果镇",
				"value": "8569",
				"children": []
			}, {
				"label": "城关镇",
				"value": "8570",
				"children": []
			}, {
				"label": "板桥镇",
				"value": "8571",
				"children": []
			}, {
				"label": "水塘镇",
				"value": "8572",
				"children": []
			}, {
				"label": "民主镇",
				"value": "8573",
				"children": []
			}, {
				"label": "大山镇",
				"value": "8574",
				"children": []
			}, {
				"label": "保田镇",
				"value": "8575",
				"children": []
			}, {
				"label": "老厂镇",
				"value": "8576",
				"children": []
			}, {
				"label": "玛依镇",
				"value": "8577",
				"children": []
			}, {
				"label": "石桥镇",
				"value": "8578",
				"children": []
			}, {
				"label": "平关镇",
				"value": "8579",
				"children": []
			}, {
				"label": "响水镇",
				"value": "8580",
				"children": []
			}, {
				"label": "火铺镇",
				"value": "8581",
				"children": []
			}, {
				"label": "乐民镇",
				"value": "8582",
				"children": []
			}, {
				"label": "西冲镇",
				"value": "8583",
				"children": []
			}, {
				"label": "断江镇",
				"value": "8584",
				"children": []
			}, {
				"label": "盘江镇",
				"value": "8585",
				"children": []
			}, {
				"label": "柏果镇",
				"value": "8586",
				"children": []
			}, {
				"label": "洒基镇",
				"value": "8587",
				"children": []
			}, {
				"label": "刘官镇",
				"value": "8588",
				"children": []
			}, {
				"label": "忠义乡",
				"value": "8589",
				"children": []
			}, {
				"label": "新民乡",
				"value": "8590",
				"children": []
			}, {
				"label": "普田乡",
				"value": "8591",
				"children": []
			}, {
				"label": "珠东乡",
				"value": "8592",
				"children": []
			}, {
				"label": "两河乡",
				"value": "8593",
				"children": []
			}, {
				"label": "滑石乡",
				"value": "8594",
				"children": []
			}, {
				"label": "鸡场坪乡",
				"value": "8595",
				"children": []
			}, {
				"label": "松河乡",
				"value": "8596",
				"children": []
			}, {
				"label": "坪地乡",
				"value": "8597",
				"children": []
			}, {
				"label": "四格乡",
				"value": "8598",
				"children": []
			}, {
				"label": "淤泥乡",
				"value": "8599",
				"children": []
			}, {
				"label": "普古乡",
				"value": "8600",
				"children": []
			}, {
				"label": "旧营乡",
				"value": "8601",
				"children": []
			}, {
				"label": "羊场乡",
				"value": "8602",
				"children": []
			}, {
				"label": "保基乡",
				"value": "8603",
				"children": []
			}, {
				"label": "英武乡",
				"value": "8604",
				"children": []
			}, {
				"label": "马场乡",
				"value": "8605",
				"children": []
			}]
		}, {
			"label": "六枝特区",
			"value": "2152",
			"children": [{
				"label": "平寨镇",
				"value": "8639",
				"children": []
			}, {
				"label": "郎岱镇",
				"value": "8640",
				"children": []
			}, {
				"label": "岩脚镇",
				"value": "8641",
				"children": []
			}, {
				"label": "木岗镇",
				"value": "8642",
				"children": []
			}, {
				"label": "大用镇",
				"value": "8643",
				"children": []
			}, {
				"label": "新窑乡",
				"value": "8644",
				"children": []
			}, {
				"label": "落别乡",
				"value": "8645",
				"children": []
			}, {
				"label": "折溪乡",
				"value": "8646",
				"children": []
			}, {
				"label": "牛场乡",
				"value": "8647",
				"children": []
			}, {
				"label": "新场乡",
				"value": "8648",
				"children": []
			}, {
				"label": "中寨乡",
				"value": "8649",
				"children": []
			}, {
				"label": "堕却乡",
				"value": "8650",
				"children": []
			}, {
				"label": "箐口乡",
				"value": "8651",
				"children": []
			}, {
				"label": "洒志乡",
				"value": "8652",
				"children": []
			}, {
				"label": "毛口乡",
				"value": "8653",
				"children": []
			}, {
				"label": "龙场乡",
				"value": "8654",
				"children": []
			}, {
				"label": "新华乡",
				"value": "8655",
				"children": []
			}, {
				"label": "梭戛乡",
				"value": "8656",
				"children": []
			}, {
				"label": "陇脚乡",
				"value": "8657",
				"children": []
			}]
		}, {
			"label": "水城县",
			"value": "2153",
			"children": [{
				"label": "滥坝镇",
				"value": "8606",
				"children": []
			}, {
				"label": "董地乡",
				"value": "8607",
				"children": []
			}, {
				"label": "陡箐乡",
				"value": "8608",
				"children": []
			}, {
				"label": "比德乡",
				"value": "8609",
				"children": []
			}, {
				"label": "化乐乡",
				"value": "8610",
				"children": []
			}, {
				"label": "南开乡",
				"value": "8611",
				"children": []
			}, {
				"label": "青林乡",
				"value": "8612",
				"children": []
			}, {
				"label": "保华乡",
				"value": "8613",
				"children": []
			}, {
				"label": "金盆乡",
				"value": "8614",
				"children": []
			}, {
				"label": "木果乡",
				"value": "8615",
				"children": []
			}, {
				"label": "发箐乡",
				"value": "8616",
				"children": []
			}, {
				"label": "双戛乡",
				"value": "8617",
				"children": []
			}, {
				"label": "玉舍乡",
				"value": "8618",
				"children": []
			}, {
				"label": "勺米乡",
				"value": "8619",
				"children": []
			}, {
				"label": "纸厂乡",
				"value": "8620",
				"children": []
			}, {
				"label": "坪寨乡",
				"value": "8621",
				"children": []
			}, {
				"label": "发耳乡",
				"value": "8622",
				"children": []
			}, {
				"label": "都格乡",
				"value": "8623",
				"children": []
			}, {
				"label": "鸡场乡",
				"value": "8624",
				"children": []
			}, {
				"label": "龙场乡",
				"value": "8625",
				"children": []
			}, {
				"label": "营盘乡",
				"value": "8626",
				"children": []
			}, {
				"label": "顺场乡",
				"value": "8627",
				"children": []
			}, {
				"label": "花嘎乡",
				"value": "8628",
				"children": []
			}, {
				"label": "杨梅乡",
				"value": "8629",
				"children": []
			}, {
				"label": "新街乡",
				"value": "8630",
				"children": []
			}, {
				"label": "野钟乡",
				"value": "8631",
				"children": []
			}, {
				"label": "果布嘎乡",
				"value": "8632",
				"children": []
			}, {
				"label": "米箩乡",
				"value": "8633",
				"children": []
			}, {
				"label": "阿戛乡",
				"value": "8634",
				"children": []
			}, {
				"label": "盐井乡",
				"value": "8635",
				"children": []
			}, {
				"label": "蟠龙乡",
				"value": "8636",
				"children": []
			}, {
				"label": "猴场乡",
				"value": "8637",
				"children": []
			}, {
				"label": "红岩乡",
				"value": "8638",
				"children": []
			}]
		}, {
			"label": "钟山区",
			"value": "2154",
			"children": [{
				"label": "黄土坡街道",
				"value": "8560",
				"children": []
			}, {
				"label": "荷城街道",
				"value": "8561",
				"children": []
			}, {
				"label": "凤凰街道",
				"value": "8562",
				"children": []
			}, {
				"label": "德坞街道",
				"value": "8563",
				"children": []
			}, {
				"label": "老鹰山镇",
				"value": "8564",
				"children": []
			}, {
				"label": "大河镇",
				"value": "8565",
				"children": []
			}, {
				"label": "汪家寨镇",
				"value": "8566",
				"children": []
			}, {
				"label": "大湾镇",
				"value": "8567",
				"children": []
			}, {
				"label": "月照乡",
				"value": "8568",
				"children": []
			}]
		}]
	}, {
		"label": "遵义市",
		"value": "2155",
		"children": [{
			"label": "赤水市",
			"value": "2156",
		}, {
			"label": "仁怀市",
			"value": "2157",
		}, {
			"label": "遵义县",
			"value": "2158",
		}, {
			"label": "桐梓县",
			"value": "2159",
		}, {
			"label": "绥阳县",
			"value": "2160",
		}, {
			"label": "习水县",
			"value": "2161",
		}, {
			"label": "凤冈县",
			"value": "2162",
		}, {
			"label": "正安县",
			"value": "2163",
		}, {
			"label": "湄潭县",
			"value": "2164",
		}, {
			"label": "余庆县",
			"value": "2165",
		}, {
			"label": "道真县",
			"value": "2166",
		}, {
			"label": "务川县",
			"value": "2167",
		}, {
			"label": "红花岗区",
			"value": "53727",
		}, {
			"label": "汇川区",
			"value": "53728",
		}]
	}, {
		"label": "铜仁市",
		"value": "2169",
		"children": [{
			"label": "碧江区",
			"value": "2170",
			"children": [{
				"label": "市中街道",
				"value": "9142",
				"children": []
			}, {
				"label": "环北街道",
				"value": "9143",
				"children": []
			}, {
				"label": "河西街道",
				"value": "9144",
				"children": []
			}, {
				"label": "灯塔街道",
				"value": "9145",
				"children": []
			}, {
				"label": "云场坪镇",
				"value": "9146",
				"children": []
			}, {
				"label": "川硐镇",
				"value": "9147",
				"children": []
			}, {
				"label": "坝黄镇",
				"value": "9148",
				"children": []
			}, {
				"label": "漾头镇",
				"value": "9149",
				"children": []
			}, {
				"label": "桐木坪乡",
				"value": "9150",
				"children": []
			}, {
				"label": "六龙山乡",
				"value": "9151",
				"children": []
			}, {
				"label": "滑石乡",
				"value": "9152",
				"children": []
			}, {
				"label": "和平乡",
				"value": "9153",
				"children": []
			}, {
				"label": "瓦屋乡",
				"value": "9154",
				"children": []
			}]
		}, {
			"label": "德江县",
			"value": "2171",
			"children": [{
				"label": "枫香溪镇",
				"value": "8735",
				"children": []
			}, {
				"label": "青龙镇",
				"value": "8736",
				"children": []
			}, {
				"label": "煎茶镇",
				"value": "8737",
				"children": []
			}, {
				"label": "潮砥镇",
				"value": "8738",
				"children": []
			}, {
				"label": "稳坪镇",
				"value": "8739",
				"children": []
			}, {
				"label": "共和乡",
				"value": "8740",
				"children": []
			}, {
				"label": "堰塘乡",
				"value": "8741",
				"children": []
			}, {
				"label": "龙泉乡",
				"value": "8742",
				"children": []
			}, {
				"label": "钱家乡",
				"value": "8743",
				"children": []
			}, {
				"label": "沙溪乡",
				"value": "8744",
				"children": []
			}, {
				"label": "楠杆乡",
				"value": "8745",
				"children": []
			}, {
				"label": "平原乡",
				"value": "8746",
				"children": []
			}, {
				"label": "复兴乡",
				"value": "8747",
				"children": []
			}, {
				"label": "合兴乡",
				"value": "8748",
				"children": []
			}, {
				"label": "长堡乡",
				"value": "8749",
				"children": []
			}, {
				"label": "桶井乡",
				"value": "8750",
				"children": []
			}, {
				"label": "荆角乡",
				"value": "8751",
				"children": []
			}, {
				"label": "长丰乡",
				"value": "8752",
				"children": []
			}, {
				"label": "高山乡",
				"value": "8753",
				"children": []
			}, {
				"label": "泉口乡",
				"value": "8754",
				"children": []
			}]
		}, {
			"label": "江口县",
			"value": "2172",
			"children": [{
				"label": "双江镇",
				"value": "8823",
				"children": []
			}, {
				"label": "闵孝镇",
				"value": "8824",
				"children": []
			}, {
				"label": "太平乡",
				"value": "8825",
				"children": []
			}, {
				"label": "坝盘乡",
				"value": "8826",
				"children": []
			}, {
				"label": "德旺乡",
				"value": "8827",
				"children": []
			}, {
				"label": "民和乡",
				"value": "8828",
				"children": []
			}, {
				"label": "官和乡",
				"value": "8829",
				"children": []
			}, {
				"label": "桃映乡",
				"value": "8830",
				"children": []
			}, {
				"label": "怒溪乡",
				"value": "8831",
				"children": []
			}]
		}, {
			"label": "思南县",
			"value": "2173",
			"children": [{
				"label": "许家坝镇",
				"value": "8772",
				"children": []
			}, {
				"label": "大坝场镇",
				"value": "8773",
				"children": []
			}, {
				"label": "文家店镇",
				"value": "8774",
				"children": []
			}, {
				"label": "鹦鹉溪镇",
				"value": "8775",
				"children": []
			}, {
				"label": "合朋溪镇",
				"value": "8776",
				"children": []
			}, {
				"label": "张家寨镇",
				"value": "8777",
				"children": []
			}, {
				"label": "孙家坝镇",
				"value": "8778",
				"children": []
			}, {
				"label": "青杠坡镇",
				"value": "8779",
				"children": []
			}, {
				"label": "凉水井镇",
				"value": "8780",
				"children": []
			}, {
				"label": "邵家桥镇",
				"value": "8781",
				"children": []
			}, {
				"label": "思唐镇",
				"value": "8782",
				"children": []
			}, {
				"label": "塘头镇",
				"value": "8783",
				"children": []
			}, {
				"label": "瓮溪镇",
				"value": "8784",
				"children": []
			}, {
				"label": "大河坝乡",
				"value": "8785",
				"children": []
			}, {
				"label": "胡家湾乡",
				"value": "8786",
				"children": []
			}, {
				"label": "亭子坝乡",
				"value": "8787",
				"children": []
			}, {
				"label": "三道水乡",
				"value": "8788",
				"children": []
			}, {
				"label": "杨家坳乡",
				"value": "8789",
				"children": []
			}, {
				"label": "思林乡",
				"value": "8790",
				"children": []
			}, {
				"label": "东华乡",
				"value": "8791",
				"children": []
			}, {
				"label": "宽坪乡",
				"value": "8792",
				"children": []
			}, {
				"label": "枫芸乡",
				"value": "8793",
				"children": []
			}, {
				"label": "香坝乡",
				"value": "8794",
				"children": []
			}, {
				"label": "长坝乡",
				"value": "8795",
				"children": []
			}, {
				"label": "板桥乡",
				"value": "8796",
				"children": []
			}, {
				"label": "天桥乡",
				"value": "8797",
				"children": []
			}, {
				"label": "兴隆乡",
				"value": "8798",
				"children": []
			}]
		}, {
			"label": "万山区",
			"value": "2174",
			"children": [{
				"label": "谢桥街道",
				"value": "8832",
				"children": []
			}, {
				"label": "万山镇",
				"value": "8833",
				"children": []
			}, {
				"label": "茶店镇",
				"value": "8834",
				"children": []
			}, {
				"label": "高楼坪乡",
				"value": "8835",
				"children": []
			}, {
				"label": "黄道乡",
				"value": "8836",
				"children": []
			}, {
				"label": "敖寨乡",
				"value": "8837",
				"children": []
			}, {
				"label": "下溪乡",
				"value": "8838",
				"children": []
			}, {
				"label": "鱼塘乡",
				"value": "8839",
				"children": []
			}, {
				"label": "大坪乡",
				"value": "8840",
				"children": []
			}]
		}, {
			"label": "石阡县",
			"value": "2175",
			"children": [{
				"label": "汤山镇",
				"value": "8799",
				"children": []
			}, {
				"label": "本庄镇",
				"value": "8800",
				"children": []
			}, {
				"label": "白沙镇",
				"value": "8801",
				"children": []
			}, {
				"label": "龙塘镇",
				"value": "8802",
				"children": []
			}, {
				"label": "花桥镇",
				"value": "8803",
				"children": []
			}, {
				"label": "五德镇",
				"value": "8804",
				"children": []
			}, {
				"label": "中坝镇",
				"value": "8805",
				"children": []
			}, {
				"label": "国荣乡",
				"value": "8806",
				"children": []
			}, {
				"label": "聚凤乡",
				"value": "8807",
				"children": []
			}, {
				"label": "龙井乡",
				"value": "8808",
				"children": []
			}, {
				"label": "枫香乡",
				"value": "8809",
				"children": []
			}, {
				"label": "青阳乡",
				"value": "8810",
				"children": []
			}, {
				"label": "石固乡",
				"value": "8811",
				"children": []
			}, {
				"label": "甘溪乡",
				"value": "8812",
				"children": []
			}, {
				"label": "坪山乡",
				"value": "8813",
				"children": []
			}, {
				"label": "河坝场乡",
				"value": "8814",
				"children": []
			}, {
				"label": "坪地场乡",
				"value": "8815",
				"children": []
			}, {
				"label": "大沙坝乡",
				"value": "8816",
				"children": []
			}]
		}, {
			"label": "玉屏侗族自治县",
			"value": "2176",
			"children": [{
				"label": "平溪镇",
				"value": "8817",
				"children": []
			}, {
				"label": "大龙镇",
				"value": "8818",
				"children": []
			}, {
				"label": "朱家场镇",
				"value": "8819",
				"children": []
			}, {
				"label": "田坪镇",
				"value": "8820",
				"children": []
			}, {
				"label": "新店乡",
				"value": "8821",
				"children": []
			}, {
				"label": "亚鱼乡",
				"value": "8822",
				"children": []
			}]
		}, {
			"label": "松桃苗族自治县",
			"value": "2177",
			"children": [{
				"label": "蓼皋镇",
				"value": "8863",
				"children": []
			}, {
				"label": "盘石镇",
				"value": "8864",
				"children": []
			}, {
				"label": "盘信镇",
				"value": "8865",
				"children": []
			}, {
				"label": "大坪场镇",
				"value": "8866",
				"children": []
			}, {
				"label": "普觉镇",
				"value": "8867",
				"children": []
			}, {
				"label": "寨英镇",
				"value": "8868",
				"children": []
			}, {
				"label": "孟溪镇",
				"value": "8869",
				"children": []
			}, {
				"label": "乌罗镇",
				"value": "8870",
				"children": []
			}, {
				"label": "甘龙镇",
				"value": "8871",
				"children": []
			}, {
				"label": "长兴堡镇",
				"value": "8872",
				"children": []
			}, {
				"label": "迓驾镇",
				"value": "8873",
				"children": []
			}, {
				"label": "大兴镇",
				"value": "8874",
				"children": []
			}, {
				"label": "牛郎镇",
				"value": "8875",
				"children": []
			}, {
				"label": "九江乡",
				"value": "8876",
				"children": []
			}, {
				"label": "世昌乡",
				"value": "8877",
				"children": []
			}, {
				"label": "正大乡",
				"value": "8878",
				"children": []
			}, {
				"label": "长坪乡",
				"value": "8879",
				"children": []
			}, {
				"label": "太平营乡",
				"value": "8880",
				"children": []
			}, {
				"label": "平头乡",
				"value": "8881",
				"children": []
			}, {
				"label": "大路乡",
				"value": "8882",
				"children": []
			}, {
				"label": "妙隘乡",
				"value": "8883",
				"children": []
			}, {
				"label": "冷水溪乡",
				"value": "8884",
				"children": []
			}, {
				"label": "石梁乡",
				"value": "8885",
				"children": []
			}, {
				"label": "瓦溪乡",
				"value": "8886",
				"children": []
			}, {
				"label": "永安乡",
				"value": "8887",
				"children": []
			}, {
				"label": "木树乡",
				"value": "8888",
				"children": []
			}, {
				"label": "黄板乡",
				"value": "8889",
				"children": []
			}, {
				"label": "沙坝河乡",
				"value": "8890",
				"children": []
			}]
		}, {
			"label": "印江土家族苗族自治县",
			"value": "2178",
			"children": [{
				"label": "峨岭镇",
				"value": "8755",
				"children": []
			}, {
				"label": "板溪镇",
				"value": "8756",
				"children": []
			}, {
				"label": "沙子坡镇",
				"value": "8757",
				"children": []
			}, {
				"label": "天堂镇",
				"value": "8758",
				"children": []
			}, {
				"label": "木黄镇",
				"value": "8759",
				"children": []
			}, {
				"label": "合水镇",
				"value": "8760",
				"children": []
			}, {
				"label": "朗溪镇",
				"value": "8761",
				"children": []
			}, {
				"label": "缠溪镇",
				"value": "8762",
				"children": []
			}, {
				"label": "洋溪镇",
				"value": "8763",
				"children": []
			}, {
				"label": "新寨乡",
				"value": "8764",
				"children": []
			}, {
				"label": "中坝乡",
				"value": "8765",
				"children": []
			}, {
				"label": "杉树乡",
				"value": "8766",
				"children": []
			}, {
				"label": "刀坝乡",
				"value": "8767",
				"children": []
			}, {
				"label": "新业乡",
				"value": "8768",
				"children": []
			}, {
				"label": "永义乡",
				"value": "8769",
				"children": []
			}, {
				"label": "罗场乡",
				"value": "8770",
				"children": []
			}, {
				"label": "杨柳乡",
				"value": "8771",
				"children": []
			}]
		}, {
			"label": "沿河土家族自治县",
			"value": "2179",
			"children": [{
				"label": "土地坳镇",
				"value": "8841",
				"children": []
			}, {
				"label": "和平镇",
				"value": "8842",
				"children": []
			}, {
				"label": "沙子镇",
				"value": "8843",
				"children": []
			}, {
				"label": "谯家镇",
				"value": "8844",
				"children": []
			}, {
				"label": "夹石镇",
				"value": "8845",
				"children": []
			}, {
				"label": "淇滩镇",
				"value": "8846",
				"children": []
			}, {
				"label": "官舟镇",
				"value": "8847",
				"children": []
			}, {
				"label": "思渠镇",
				"value": "8848",
				"children": []
			}, {
				"label": "客田镇",
				"value": "8849",
				"children": []
			}, {
				"label": "洪渡镇",
				"value": "8850",
				"children": []
			}, {
				"label": "黑獭乡",
				"value": "8851",
				"children": []
			}, {
				"label": "黑水乡",
				"value": "8852",
				"children": []
			}, {
				"label": "中界乡",
				"value": "8853",
				"children": []
			}, {
				"label": "晓景乡",
				"value": "8854",
				"children": []
			}, {
				"label": "甘溪乡",
				"value": "8855",
				"children": []
			}, {
				"label": "板场乡",
				"value": "8856",
				"children": []
			}, {
				"label": "泉坝乡",
				"value": "8857",
				"children": []
			}, {
				"label": "中寨乡",
				"value": "8858",
				"children": []
			}, {
				"label": "黄土乡",
				"value": "8859",
				"children": []
			}, {
				"label": "新景乡",
				"value": "8860",
				"children": []
			}, {
				"label": "塘坝乡",
				"value": "8861",
				"children": []
			}, {
				"label": "后坪乡",
				"value": "8862",
				"children": []
			}]
		}]
	}, {
		"label": "毕节市",
		"value": "2180",
		"children": [{
			"label": "黔西县",
			"value": "2182",
			"children": [{
				"label": "城关镇",
				"value": "8969",
				"children": []
			}, {
				"label": "金碧镇",
				"value": "8970",
				"children": []
			}, {
				"label": "雨朵镇",
				"value": "8971",
				"children": []
			}, {
				"label": "大关镇",
				"value": "8972",
				"children": []
			}, {
				"label": "谷里镇",
				"value": "8973",
				"children": []
			}, {
				"label": "素朴镇",
				"value": "8974",
				"children": []
			}, {
				"label": "中坪镇",
				"value": "8975",
				"children": []
			}, {
				"label": "重新镇",
				"value": "8976",
				"children": []
			}, {
				"label": "林泉镇",
				"value": "8977",
				"children": []
			}, {
				"label": "五里乡",
				"value": "8978",
				"children": []
			}, {
				"label": "沙井乡",
				"value": "8979",
				"children": []
			}, {
				"label": "羊场乡",
				"value": "8980",
				"children": []
			}, {
				"label": "绿化乡",
				"value": "8981",
				"children": []
			}, {
				"label": "新仁乡",
				"value": "8982",
				"children": []
			}, {
				"label": "钟山乡",
				"value": "8983",
				"children": []
			}, {
				"label": "铁石乡",
				"value": "8984",
				"children": []
			}, {
				"label": "协和乡",
				"value": "8985",
				"children": []
			}, {
				"label": "太来乡",
				"value": "8986",
				"children": []
			}, {
				"label": "甘棠乡",
				"value": "8987",
				"children": []
			}, {
				"label": "永燊乡",
				"value": "8988",
				"children": []
			}, {
				"label": "中建乡",
				"value": "8989",
				"children": []
			}, {
				"label": "花溪乡",
				"value": "8990",
				"children": []
			}, {
				"label": "定新乡",
				"value": "8991",
				"children": []
			}, {
				"label": "洪水乡",
				"value": "8992",
				"children": []
			}, {
				"label": "金坡乡",
				"value": "8993",
				"children": []
			}, {
				"label": "仁和乡",
				"value": "8994",
				"children": []
			}, {
				"label": "红林乡",
				"value": "8995",
				"children": []
			}, {
				"label": "锦星乡",
				"value": "8996",
				"children": []
			}]
		}, {
			"label": "大方县",
			"value": "2183",
			"children": [{
				"label": "黄泥塘镇",
				"value": "8933",
				"children": []
			}, {
				"label": "大方镇",
				"value": "8934",
				"children": []
			}, {
				"label": "双山镇",
				"value": "8935",
				"children": []
			}, {
				"label": "猫场镇",
				"value": "8936",
				"children": []
			}, {
				"label": "马场镇",
				"value": "8937",
				"children": []
			}, {
				"label": "羊场镇",
				"value": "8938",
				"children": []
			}, {
				"label": "六龙镇",
				"value": "8939",
				"children": []
			}, {
				"label": "达溪镇",
				"value": "8940",
				"children": []
			}, {
				"label": "瓢井镇",
				"value": "8941",
				"children": []
			}, {
				"label": "长石镇",
				"value": "8942",
				"children": []
			}, {
				"label": "东关乡",
				"value": "8943",
				"children": []
			}, {
				"label": "竹园乡",
				"value": "8944",
				"children": []
			}, {
				"label": "响水乡",
				"value": "8945",
				"children": []
			}, {
				"label": "文阁乡",
				"value": "8946",
				"children": []
			}, {
				"label": "绿塘乡",
				"value": "8947",
				"children": []
			}, {
				"label": "鼎新乡",
				"value": "8948",
				"children": []
			}, {
				"label": "牛场乡",
				"value": "8949",
				"children": []
			}, {
				"label": "高店乡",
				"value": "8950",
				"children": []
			}, {
				"label": "小屯乡",
				"value": "8951",
				"children": []
			}, {
				"label": "理化乡",
				"value": "8952",
				"children": []
			}, {
				"label": "鸡场乡",
				"value": "8953",
				"children": []
			}, {
				"label": "凤山乡",
				"value": "8954",
				"children": []
			}, {
				"label": "安乐乡",
				"value": "8955",
				"children": []
			}, {
				"label": "核桃乡",
				"value": "8956",
				"children": []
			}, {
				"label": "八堡乡",
				"value": "8957",
				"children": []
			}, {
				"label": "兴隆乡",
				"value": "8958",
				"children": []
			}, {
				"label": "果瓦乡",
				"value": "8959",
				"children": []
			}, {
				"label": "大山乡",
				"value": "8960",
				"children": []
			}, {
				"label": "雨冲乡",
				"value": "8961",
				"children": []
			}, {
				"label": "黄泥乡",
				"value": "8962",
				"children": []
			}, {
				"label": "大水乡",
				"value": "8963",
				"children": []
			}, {
				"label": "沙厂乡",
				"value": "8964",
				"children": []
			}, {
				"label": "普底乡",
				"value": "8965",
				"children": []
			}, {
				"label": "百纳乡",
				"value": "8966",
				"children": []
			}, {
				"label": "三元乡",
				"value": "8967",
				"children": []
			}, {
				"label": "星宿乡",
				"value": "8968",
				"children": []
			}]
		}, {
			"label": "织金县",
			"value": "2184",
			"children": [{
				"label": "城关镇",
				"value": "9023",
				"children": []
			}, {
				"label": "桂果镇",
				"value": "9024",
				"children": []
			}, {
				"label": "牛场镇",
				"value": "9025",
				"children": []
			}, {
				"label": "猫场镇",
				"value": "9026",
				"children": []
			}, {
				"label": "化起镇",
				"value": "9027",
				"children": []
			}, {
				"label": "龙场镇",
				"value": "9028",
				"children": []
			}, {
				"label": "八步镇",
				"value": "9029",
				"children": []
			}, {
				"label": "以那镇",
				"value": "9030",
				"children": []
			}, {
				"label": "三塘镇",
				"value": "9031",
				"children": []
			}, {
				"label": "阿弓镇",
				"value": "9032",
				"children": []
			}, {
				"label": "珠藏镇",
				"value": "9033",
				"children": []
			}, {
				"label": "三甲乡",
				"value": "9034",
				"children": []
			}, {
				"label": "自强乡",
				"value": "9035",
				"children": []
			}, {
				"label": "大平乡",
				"value": "9036",
				"children": []
			}, {
				"label": "官寨乡",
				"value": "9037",
				"children": []
			}, {
				"label": "茶店乡",
				"value": "9038",
				"children": []
			}, {
				"label": "金龙乡",
				"value": "9039",
				"children": []
			}, {
				"label": "后寨乡",
				"value": "9040",
				"children": []
			}, {
				"label": "鸡场乡",
				"value": "9041",
				"children": []
			}, {
				"label": "中寨乡",
				"value": "9042",
				"children": []
			}, {
				"label": "绮陌乡",
				"value": "9043",
				"children": []
			}, {
				"label": "普翁乡",
				"value": "9044",
				"children": []
			}, {
				"label": "实兴乡",
				"value": "9045",
				"children": []
			}, {
				"label": "马场乡",
				"value": "9046",
				"children": []
			}, {
				"label": "上坪寨乡",
				"value": "9047",
				"children": []
			}, {
				"label": "营合乡",
				"value": "9048",
				"children": []
			}, {
				"label": "纳雍乡",
				"value": "9049",
				"children": []
			}, {
				"label": "板桥乡",
				"value": "9050",
				"children": []
			}, {
				"label": "白泥乡",
				"value": "9051",
				"children": []
			}, {
				"label": "少普乡",
				"value": "9052",
				"children": []
			}, {
				"label": "熊家场乡",
				"value": "9053",
				"children": []
			}, {
				"label": "黑土乡",
				"value": "9054",
				"children": []
			}]
		}, {
			"label": "金沙县",
			"value": "2185",
			"children": [{
				"label": "城关镇",
				"value": "8997",
				"children": []
			}, {
				"label": "安底镇",
				"value": "8998",
				"children": []
			}, {
				"label": "沙土镇",
				"value": "8999",
				"children": []
			}, {
				"label": "岩孔镇",
				"value": "9000",
				"children": []
			}, {
				"label": "禹谟镇",
				"value": "9001",
				"children": []
			}, {
				"label": "岚头镇",
				"value": "9002",
				"children": []
			}, {
				"label": "清池镇",
				"value": "9003",
				"children": []
			}, {
				"label": "平坝乡",
				"value": "9004",
				"children": []
			}, {
				"label": "西洛乡",
				"value": "9005",
				"children": []
			}, {
				"label": "石场乡",
				"value": "9006",
				"children": []
			}, {
				"label": "桂花乡",
				"value": "9007",
				"children": []
			}, {
				"label": "太平乡",
				"value": "9008",
				"children": []
			}, {
				"label": "箐门乡",
				"value": "9009",
				"children": []
			}, {
				"label": "龙坝乡",
				"value": "9010",
				"children": []
			}, {
				"label": "高坪乡",
				"value": "9011",
				"children": []
			}, {
				"label": "化觉乡",
				"value": "9012",
				"children": []
			}, {
				"label": "茶园乡",
				"value": "9013",
				"children": []
			}, {
				"label": "木孔乡",
				"value": "9014",
				"children": []
			}, {
				"label": "长坝乡",
				"value": "9015",
				"children": []
			}, {
				"label": "源村乡",
				"value": "9016",
				"children": []
			}, {
				"label": "官田乡",
				"value": "9017",
				"children": []
			}, {
				"label": "后山乡",
				"value": "9018",
				"children": []
			}, {
				"label": "安洛乡",
				"value": "9019",
				"children": []
			}, {
				"label": "新化乡",
				"value": "9020",
				"children": []
			}, {
				"label": "大田乡",
				"value": "9021",
				"children": []
			}, {
				"label": "马路乡",
				"value": "9022",
				"children": []
			}]
		}, {
			"label": "赫章县",
			"value": "2186",
			"children": [{
				"label": "城关镇",
				"value": "9115",
				"children": []
			}, {
				"label": "六曲河镇",
				"value": "9116",
				"children": []
			}, {
				"label": "野马川镇",
				"value": "9117",
				"children": []
			}, {
				"label": "白果镇",
				"value": "9118",
				"children": []
			}, {
				"label": "妈姑镇",
				"value": "9119",
				"children": []
			}, {
				"label": "财神镇",
				"value": "9120",
				"children": []
			}, {
				"label": "松林坡乡",
				"value": "9121",
				"children": []
			}, {
				"label": "水塘堡乡",
				"value": "9122",
				"children": []
			}, {
				"label": "安乐溪乡",
				"value": "9123",
				"children": []
			}, {
				"label": "兴发乡",
				"value": "9124",
				"children": []
			}, {
				"label": "达依乡",
				"value": "9125",
				"children": []
			}, {
				"label": "雉街乡",
				"value": "9126",
				"children": []
			}, {
				"label": "珠市乡",
				"value": "9127",
				"children": []
			}, {
				"label": "罗州乡",
				"value": "9128",
				"children": []
			}, {
				"label": "双坪乡",
				"value": "9129",
				"children": []
			}, {
				"label": "铁匠乡",
				"value": "9130",
				"children": []
			}, {
				"label": "辅处乡",
				"value": "9131",
				"children": []
			}, {
				"label": "可乐乡",
				"value": "9132",
				"children": []
			}, {
				"label": "河镇乡",
				"value": "9133",
				"children": []
			}, {
				"label": "德卓乡",
				"value": "9134",
				"children": []
			}, {
				"label": "朱明乡",
				"value": "9135",
				"children": []
			}, {
				"label": "结构乡",
				"value": "9136",
				"children": []
			}, {
				"label": "古基乡",
				"value": "9137",
				"children": []
			}, {
				"label": "哲庄乡",
				"value": "9138",
				"children": []
			}, {
				"label": "平山乡",
				"value": "9139",
				"children": []
			}, {
				"label": "古达乡",
				"value": "9140",
				"children": []
			}, {
				"label": "威奢乡",
				"value": "9141",
				"children": []
			}]
		}, {
			"label": "纳雍县",
			"value": "2187",
			"children": [{
				"label": "王家寨镇",
				"value": "9055",
				"children": []
			}, {
				"label": "张家湾镇",
				"value": "9056",
				"children": []
			}, {
				"label": "雍熙镇",
				"value": "9057",
				"children": []
			}, {
				"label": "中岭镇",
				"value": "9058",
				"children": []
			}, {
				"label": "阳长镇",
				"value": "9059",
				"children": []
			}, {
				"label": "维新镇",
				"value": "9060",
				"children": []
			}, {
				"label": "龙场镇",
				"value": "9061",
				"children": []
			}, {
				"label": "乐治镇",
				"value": "9062",
				"children": []
			}, {
				"label": "百兴镇",
				"value": "9063",
				"children": []
			}, {
				"label": "厍东关乡",
				"value": "9064",
				"children": []
			}, {
				"label": "老凹坝乡",
				"value": "9065",
				"children": []
			}, {
				"label": "锅圈岩乡",
				"value": "9066",
				"children": []
			}, {
				"label": "左鸠戛乡",
				"value": "9067",
				"children": []
			}, {
				"label": "勺窝乡",
				"value": "9068",
				"children": []
			}, {
				"label": "新房乡",
				"value": "9069",
				"children": []
			}, {
				"label": "董地乡",
				"value": "9070",
				"children": []
			}, {
				"label": "寨乐乡",
				"value": "9071",
				"children": []
			}, {
				"label": "化作乡",
				"value": "9072",
				"children": []
			}, {
				"label": "沙包乡",
				"value": "9073",
				"children": []
			}, {
				"label": "水东乡",
				"value": "9074",
				"children": []
			}, {
				"label": "曙光乡",
				"value": "9075",
				"children": []
			}, {
				"label": "姑开乡",
				"value": "9076",
				"children": []
			}, {
				"label": "羊场乡",
				"value": "9077",
				"children": []
			}, {
				"label": "昆寨乡",
				"value": "9078",
				"children": []
			}, {
				"label": "猪场乡",
				"value": "9079",
				"children": []
			}]
		}, {
			"label": "威宁彝族回族苗族自治县",
			"value": "2188",
			"children": [{
				"label": "观风海镇",
				"value": "9080",
				"children": []
			}, {
				"label": "草海镇",
				"value": "9081",
				"children": []
			}, {
				"label": "么站镇",
				"value": "9082",
				"children": []
			}, {
				"label": "金钟镇",
				"value": "9083",
				"children": []
			}, {
				"label": "炉山镇",
				"value": "9084",
				"children": []
			}, {
				"label": "龙场镇",
				"value": "9085",
				"children": []
			}, {
				"label": "黑石镇",
				"value": "9086",
				"children": []
			}, {
				"label": "哲觉镇",
				"value": "9087",
				"children": []
			}, {
				"label": "牛棚镇",
				"value": "9088",
				"children": []
			}, {
				"label": "迤那镇",
				"value": "9089",
				"children": []
			}, {
				"label": "中水镇",
				"value": "9090",
				"children": []
			}, {
				"label": "龙街镇",
				"value": "9091",
				"children": []
			}, {
				"label": "雪山镇",
				"value": "9092",
				"children": []
			}, {
				"label": "羊街镇",
				"value": "9093",
				"children": []
			}, {
				"label": "小海镇",
				"value": "9094",
				"children": []
			}, {
				"label": "盐仓镇",
				"value": "9095",
				"children": []
			}, {
				"label": "东风镇",
				"value": "9096",
				"children": []
			}, {
				"label": "二塘镇",
				"value": "9097",
				"children": []
			}, {
				"label": "猴场镇",
				"value": "9098",
				"children": []
			}, {
				"label": "黑土河乡",
				"value": "9099",
				"children": []
			}, {
				"label": "哈喇河乡",
				"value": "9100",
				"children": []
			}, {
				"label": "金斗乡",
				"value": "9101",
				"children": []
			}, {
				"label": "新发乡",
				"value": "9102",
				"children": []
			}, {
				"label": "岔河乡",
				"value": "9103",
				"children": []
			}, {
				"label": "麻乍乡",
				"value": "9104",
				"children": []
			}, {
				"label": "海拉乡",
				"value": "9105",
				"children": []
			}, {
				"label": "秀水乡",
				"value": "9106",
				"children": []
			}, {
				"label": "斗古乡",
				"value": "9107",
				"children": []
			}, {
				"label": "玉龙乡",
				"value": "9108",
				"children": []
			}, {
				"label": "石门乡",
				"value": "9109",
				"children": []
			}, {
				"label": "云贵乡",
				"value": "9110",
				"children": []
			}, {
				"label": "兔街乡",
				"value": "9111",
				"children": []
			}, {
				"label": "双龙乡",
				"value": "9112",
				"children": []
			}, {
				"label": "板底乡",
				"value": "9113",
				"children": []
			}, {
				"label": "大街乡",
				"value": "9374",
				"children": []
			}]
		}, {
			"label": "七星关区",
			"value": "8891",
			"children": [{
				"label": "市西街道",
				"value": "8892",
				"children": []
			}, {
				"label": "市东街道",
				"value": "8893",
				"children": []
			}, {
				"label": "三板桥街道",
				"value": "8894",
				"children": []
			}, {
				"label": "流沧桥街道",
				"value": "8895",
				"children": []
			}, {
				"label": "大新桥街道",
				"value": "8896",
				"children": []
			}, {
				"label": "观音桥街道",
				"value": "8897",
				"children": []
			}, {
				"label": "何官屯镇",
				"value": "8898",
				"children": []
			}, {
				"label": "长春堡镇",
				"value": "8899",
				"children": []
			}, {
				"label": "撒拉溪镇",
				"value": "8900",
				"children": []
			}, {
				"label": "杨家湾镇",
				"value": "8901",
				"children": []
			}, {
				"label": "清水铺镇",
				"value": "8902",
				"children": []
			}, {
				"label": "燕子口镇",
				"value": "8903",
				"children": []
			}, {
				"label": "田坝桥镇",
				"value": "8904",
				"children": []
			}, {
				"label": "海子街镇",
				"value": "8905",
				"children": []
			}, {
				"label": "小吉场镇",
				"value": "8906",
				"children": []
			}, {
				"label": "龙场营镇",
				"value": "8907",
				"children": []
			}, {
				"label": "鸭池镇",
				"value": "8908",
				"children": []
			}, {
				"label": "梨树镇",
				"value": "8909",
				"children": []
			}, {
				"label": "岔河镇",
				"value": "8910",
				"children": []
			}, {
				"label": "朱昌镇",
				"value": "8911",
				"children": []
			}, {
				"label": "田坝镇",
				"value": "8912",
				"children": []
			}, {
				"label": "放珠镇",
				"value": "8913",
				"children": []
			}, {
				"label": "青场镇",
				"value": "8914",
				"children": []
			}, {
				"label": "水箐镇",
				"value": "8915",
				"children": []
			}, {
				"label": "对坡镇",
				"value": "8916",
				"children": []
			}, {
				"label": "大银镇",
				"value": "8917",
				"children": []
			}, {
				"label": "林口镇",
				"value": "8918",
				"children": []
			}, {
				"label": "生机镇",
				"value": "8919",
				"children": []
			}, {
				"label": "亮岩镇",
				"value": "8920",
				"children": []
			}, {
				"label": "八寨镇",
				"value": "8921",
				"children": []
			}, {
				"label": "小坝镇",
				"value": "8922",
				"children": []
			}, {
				"label": "层台镇",
				"value": "8923",
				"children": []
			}, {
				"label": "普宜镇",
				"value": "8924",
				"children": []
			}, {
				"label": "千溪乡",
				"value": "8925",
				"children": []
			}, {
				"label": "阴底乡",
				"value": "8926",
				"children": []
			}, {
				"label": "野角乡",
				"value": "8927",
				"children": []
			}, {
				"label": "大河乡",
				"value": "8928",
				"children": []
			}, {
				"label": "团结乡",
				"value": "8929",
				"children": []
			}, {
				"label": "阿市乡",
				"value": "8930",
				"children": []
			}, {
				"label": "大屯乡",
				"value": "8931",
				"children": []
			}, {
				"label": "田坎乡",
				"value": "8932",
				"children": []
			}]
		}]
	}, {
		"label": "安顺市",
		"value": "2189",
		"children": [{
			"label": "西秀区",
			"value": "2190",
			"children": [{
				"label": "南街街道",
				"value": "8711",
				"children": []
			}, {
				"label": "东街街道",
				"value": "8712",
				"children": []
			}, {
				"label": "西街街道",
				"value": "8713",
				"children": []
			}, {
				"label": "北街街道",
				"value": "8714",
				"children": []
			}, {
				"label": "东关街道",
				"value": "8715",
				"children": []
			}, {
				"label": "华西街道",
				"value": "8716",
				"children": []
			}, {
				"label": "西航街道",
				"value": "8717",
				"children": []
			}, {
				"label": "大西桥镇",
				"value": "8718",
				"children": []
			}, {
				"label": "七眼桥镇",
				"value": "8719",
				"children": []
			}, {
				"label": "轿子山镇",
				"value": "8720",
				"children": []
			}, {
				"label": "宋旗镇",
				"value": "8721",
				"children": []
			}, {
				"label": "幺铺镇",
				"value": "8722",
				"children": []
			}, {
				"label": "宁谷镇",
				"value": "8723",
				"children": []
			}, {
				"label": "龙宫镇",
				"value": "8724",
				"children": []
			}, {
				"label": "双堡镇",
				"value": "8725",
				"children": []
			}, {
				"label": "蔡官镇",
				"value": "8726",
				"children": []
			}, {
				"label": "旧州镇",
				"value": "8727",
				"children": []
			}, {
				"label": "新场乡",
				"value": "8728",
				"children": []
			}, {
				"label": "岩腊乡",
				"value": "8729",
				"children": []
			}, {
				"label": "鸡场乡",
				"value": "8730",
				"children": []
			}, {
				"label": "杨武乡",
				"value": "8731",
				"children": []
			}, {
				"label": "东屯乡",
				"value": "8732",
				"children": []
			}, {
				"label": "黄腊乡",
				"value": "8733",
				"children": []
			}, {
				"label": "刘官乡",
				"value": "8734",
				"children": []
			}]
		}, {
			"label": "普定县",
			"value": "2191",
			"children": [{
				"label": "城关镇",
				"value": "8658",
				"children": []
			}, {
				"label": "马官镇",
				"value": "8659",
				"children": []
			}, {
				"label": "化处镇",
				"value": "8660",
				"children": []
			}, {
				"label": "马场镇",
				"value": "8661",
				"children": []
			}, {
				"label": "白岩镇",
				"value": "8662",
				"children": []
			}, {
				"label": "龙场乡",
				"value": "8663",
				"children": []
			}, {
				"label": "鸡场坡乡",
				"value": "8664",
				"children": []
			}, {
				"label": "坪上乡",
				"value": "8665",
				"children": []
			}, {
				"label": "补郎乡",
				"value": "8666",
				"children": []
			}, {
				"label": "猴场乡",
				"value": "8667",
				"children": []
			}, {
				"label": "猫洞乡",
				"value": "8668",
				"children": []
			}]
		}, {
			"label": "平坝县",
			"value": "2192",
			"children": [{
				"label": "城关镇",
				"value": "8548",
				"children": []
			}, {
				"label": "白云镇",
				"value": "8549",
				"children": []
			}, {
				"label": "高峰镇",
				"value": "8550",
				"children": []
			}, {
				"label": "天龙镇",
				"value": "8551",
				"children": []
			}, {
				"label": "夏云镇",
				"value": "8552",
				"children": []
			}, {
				"label": "马场镇",
				"value": "8553",
				"children": []
			}, {
				"label": "乐平乡",
				"value": "8554",
				"children": []
			}, {
				"label": "齐伯乡",
				"value": "8555",
				"children": []
			}, {
				"label": "十字乡",
				"value": "8556",
				"children": []
			}, {
				"label": "羊昌乡",
				"value": "8557",
				"children": []
			}]
		}, {
			"label": "镇宁布依族苗族自治县",
			"value": "2193",
			"children": [{
				"label": "城关镇",
				"value": "8669",
				"children": []
			}, {
				"label": "丁旗镇",
				"value": "8670",
				"children": []
			}, {
				"label": "黄果树镇",
				"value": "8671",
				"children": []
			}, {
				"label": "江龙镇",
				"value": "8672",
				"children": []
			}, {
				"label": "大山乡",
				"value": "8673",
				"children": []
			}, {
				"label": "扁担山乡",
				"value": "8674",
				"children": []
			}, {
				"label": "募役乡",
				"value": "8675",
				"children": []
			}, {
				"label": "马厂乡",
				"value": "8676",
				"children": []
			}, {
				"label": "沙子乡",
				"value": "8677",
				"children": []
			}, {
				"label": "朵卜陇乡",
				"value": "8678",
				"children": []
			}, {
				"label": "革利乡",
				"value": "8679",
				"children": []
			}, {
				"label": "本寨乡",
				"value": "8680",
				"children": []
			}, {
				"label": "六马乡",
				"value": "8681",
				"children": []
			}, {
				"label": "良田乡",
				"value": "8682",
				"children": []
			}, {
				"label": "简嘎乡",
				"value": "8683",
				"children": []
			}, {
				"label": "打帮乡",
				"value": "8684",
				"children": []
			}]
		}, {
			"label": "关岭布依族苗族自治县",
			"value": "2194",
			"children": [{
				"label": "关索镇",
				"value": "8685",
				"children": []
			}, {
				"label": "花江镇",
				"value": "8686",
				"children": []
			}, {
				"label": "永宁镇",
				"value": "8687",
				"children": []
			}, {
				"label": "岗乌镇",
				"value": "8688",
				"children": []
			}, {
				"label": "上关镇",
				"value": "8689",
				"children": []
			}, {
				"label": "坡贡镇",
				"value": "8690",
				"children": []
			}, {
				"label": "断桥镇",
				"value": "8691",
				"children": []
			}, {
				"label": "白水镇",
				"value": "8692",
				"children": []
			}, {
				"label": "八德乡",
				"value": "8693",
				"children": []
			}, {
				"label": "顶云乡",
				"value": "8694",
				"children": []
			}, {
				"label": "普利乡",
				"value": "8695",
				"children": []
			}, {
				"label": "板贵乡",
				"value": "8696",
				"children": []
			}, {
				"label": "新铺乡",
				"value": "8697",
				"children": []
			}, {
				"label": "沙营乡",
				"value": "8698",
				"children": []
			}]
		}, {
			"label": "紫云苗族布依族自治县",
			"value": "2195",
			"children": [{
				"label": "松山镇",
				"value": "8699",
				"children": []
			}, {
				"label": "水塘镇",
				"value": "8700",
				"children": []
			}, {
				"label": "猴场镇",
				"value": "8701",
				"children": []
			}, {
				"label": "猫营镇",
				"value": "8702",
				"children": []
			}, {
				"label": "板当镇",
				"value": "8703",
				"children": []
			}, {
				"label": "白石岩乡",
				"value": "8704",
				"children": []
			}, {
				"label": "宗地乡",
				"value": "8705",
				"children": []
			}, {
				"label": "大营乡",
				"value": "8706",
				"children": []
			}, {
				"label": "四大寨乡",
				"value": "8707",
				"children": []
			}, {
				"label": "坝羊乡",
				"value": "8708",
				"children": []
			}, {
				"label": "火花乡",
				"value": "8709",
				"children": []
			}, {
				"label": "达帮乡",
				"value": "8710",
				"children": []
			}]
		}]
	}, {
		"label": "黔西南州",
		"value": "2196",
		"children": [{
			"label": "兴义市",
			"value": "2197",
			"children": [{
				"label": "黄草街道",
				"value": "9722",
				"children": []
			}, {
				"label": "兴泰街道",
				"value": "9723",
				"children": []
			}, {
				"label": "桔山街道",
				"value": "9724",
				"children": []
			}, {
				"label": "丰都街道",
				"value": "9725",
				"children": []
			}, {
				"label": "坪东街道",
				"value": "9726",
				"children": []
			}, {
				"label": "木贾街道",
				"value": "9727",
				"children": []
			}, {
				"label": "下五屯街道",
				"value": "9728",
				"children": []
			}, {
				"label": "万峰林街道",
				"value": "9729",
				"children": []
			}, {
				"label": "鲁布格镇",
				"value": "9730",
				"children": []
			}, {
				"label": "三江口镇",
				"value": "9731",
				"children": []
			}, {
				"label": "白碗窑镇",
				"value": "9732",
				"children": []
			}, {
				"label": "清水河镇",
				"value": "9733",
				"children": []
			}, {
				"label": "敬南镇",
				"value": "9734",
				"children": []
			}, {
				"label": "泥凼镇",
				"value": "9735",
				"children": []
			}, {
				"label": "巴结镇",
				"value": "9736",
				"children": []
			}, {
				"label": "捧鲊镇",
				"value": "9737",
				"children": []
			}, {
				"label": "乌沙镇",
				"value": "9738",
				"children": []
			}, {
				"label": "马岭镇",
				"value": "9739",
				"children": []
			}, {
				"label": "威舍镇",
				"value": "9740",
				"children": []
			}, {
				"label": "顶效镇",
				"value": "9741",
				"children": []
			}, {
				"label": "郑屯镇",
				"value": "9742",
				"children": []
			}, {
				"label": "万屯镇",
				"value": "9743",
				"children": []
			}, {
				"label": "鲁屯镇",
				"value": "9744",
				"children": []
			}, {
				"label": "仓更镇",
				"value": "9745",
				"children": []
			}, {
				"label": "七舍镇",
				"value": "9746",
				"children": []
			}, {
				"label": "则戎乡",
				"value": "9747",
				"children": []
			}, {
				"label": "沧江乡",
				"value": "9748",
				"children": []
			}, {
				"label": "洛万乡",
				"value": "9749",
				"children": []
			}, {
				"label": "雄武乡",
				"value": "9750",
				"children": []
			}, {
				"label": "猪场坪乡",
				"value": "9751",
				"children": []
			}]
		}, {
			"label": "望谟县",
			"value": "2198",
			"children": [{
				"label": "复兴镇",
				"value": "9646",
				"children": []
			}, {
				"label": "乐元镇",
				"value": "9647",
				"children": []
			}, {
				"label": "打易镇",
				"value": "9648",
				"children": []
			}, {
				"label": "乐旺镇",
				"value": "9649",
				"children": []
			}, {
				"label": "桑郎镇",
				"value": "9650",
				"children": []
			}, {
				"label": "纳夜镇",
				"value": "9651",
				"children": []
			}, {
				"label": "新屯镇",
				"value": "9652",
				"children": []
			}, {
				"label": "石屯镇",
				"value": "9653",
				"children": []
			}, {
				"label": "坎边乡",
				"value": "9654",
				"children": []
			}, {
				"label": "岜饶乡",
				"value": "9655",
				"children": []
			}, {
				"label": "郊纳乡",
				"value": "9656",
				"children": []
			}, {
				"label": "大观乡",
				"value": "9657",
				"children": []
			}, {
				"label": "蔗香乡",
				"value": "9658",
				"children": []
			}, {
				"label": "昂武乡",
				"value": "9659",
				"children": []
			}, {
				"label": "油迈乡",
				"value": "9660",
				"children": []
			}, {
				"label": "麻山乡",
				"value": "9661",
				"children": []
			}, {
				"label": "打尖乡",
				"value": "9662",
				"children": []
			}]
		}, {
			"label": "兴仁县",
			"value": "2199",
			"children": [{
				"label": "真武山街道",
				"value": "9704",
				"children": []
			}, {
				"label": "东湖街道",
				"value": "9705",
				"children": []
			}, {
				"label": "城南街道",
				"value": "9706",
				"children": []
			}, {
				"label": "城北街道",
				"value": "9707",
				"children": []
			}, {
				"label": "潘家庄镇",
				"value": "9708",
				"children": []
			}, {
				"label": "新龙场镇",
				"value": "9709",
				"children": []
			}, {
				"label": "屯脚镇",
				"value": "9710",
				"children": []
			}, {
				"label": "巴铃镇",
				"value": "9711",
				"children": []
			}, {
				"label": "百德镇",
				"value": "9712",
				"children": []
			}, {
				"label": "雨樟镇",
				"value": "9713",
				"children": []
			}, {
				"label": "回龙镇",
				"value": "9714",
				"children": []
			}, {
				"label": "下山镇",
				"value": "9715",
				"children": []
			}, {
				"label": "新马场乡",
				"value": "9716",
				"children": []
			}, {
				"label": "鲁础营乡",
				"value": "9717",
				"children": []
			}, {
				"label": "大山乡",
				"value": "9718",
				"children": []
			}, {
				"label": "李关乡",
				"value": "9719",
				"children": []
			}, {
				"label": "田湾乡",
				"value": "9720",
				"children": []
			}, {
				"label": "民建乡",
				"value": "9721",
				"children": []
			}]
		}, {
			"label": "普安县",
			"value": "2200",
			"children": [{
				"label": "罐子窑镇",
				"value": "9690",
				"children": []
			}, {
				"label": "江西坡镇",
				"value": "9691",
				"children": []
			}, {
				"label": "三板桥镇",
				"value": "9692",
				"children": []
			}, {
				"label": "盘水镇",
				"value": "9693",
				"children": []
			}, {
				"label": "龙吟镇",
				"value": "9694",
				"children": []
			}, {
				"label": "地瓜镇",
				"value": "9695",
				"children": []
			}, {
				"label": "青山镇",
				"value": "9696",
				"children": []
			}, {
				"label": "楼下镇",
				"value": "9697",
				"children": []
			}, {
				"label": "白沙乡",
				"value": "9698",
				"children": []
			}, {
				"label": "高棉乡",
				"value": "9699",
				"children": []
			}, {
				"label": "窝沿乡",
				"value": "9700",
				"children": []
			}, {
				"label": "罗汉乡",
				"value": "9701",
				"children": []
			}, {
				"label": "新店乡",
				"value": "9702",
				"children": []
			}, {
				"label": "雪浦乡",
				"value": "9703",
				"children": []
			}]
		}, {
			"label": "册亨县",
			"value": "2201",
			"children": [{
				"label": "者楼镇",
				"value": "9632",
				"children": []
			}, {
				"label": "坡妹镇",
				"value": "9633",
				"children": []
			}, {
				"label": "冗渡镇",
				"value": "9634",
				"children": []
			}, {
				"label": "丫他镇",
				"value": "9635",
				"children": []
			}, {
				"label": "巧马镇",
				"value": "9636",
				"children": []
			}, {
				"label": "秧坝镇",
				"value": "9637",
				"children": []
			}, {
				"label": "双江镇",
				"value": "9638",
				"children": []
			}, {
				"label": "岩架镇",
				"value": "9639",
				"children": []
			}, {
				"label": "八渡镇",
				"value": "9640",
				"children": []
			}, {
				"label": "庆坪乡",
				"value": "9641",
				"children": []
			}, {
				"label": "达央乡",
				"value": "9642",
				"children": []
			}, {
				"label": "威旁乡",
				"value": "9643",
				"children": []
			}, {
				"label": "弼佑乡",
				"value": "9644",
				"children": []
			}, {
				"label": "百口乡",
				"value": "9645",
				"children": []
			}]
		}, {
			"label": "晴隆县",
			"value": "2202",
			"children": [{
				"label": "莲城镇",
				"value": "9676",
				"children": []
			}, {
				"label": "沙子镇",
				"value": "9677",
				"children": []
			}, {
				"label": "碧痕镇",
				"value": "9678",
				"children": []
			}, {
				"label": "大厂镇",
				"value": "9679",
				"children": []
			}, {
				"label": "鸡场镇",
				"value": "9680",
				"children": []
			}, {
				"label": "花贡镇",
				"value": "9681",
				"children": []
			}, {
				"label": "中营镇",
				"value": "9682",
				"children": []
			}, {
				"label": "光照镇",
				"value": "9683",
				"children": []
			}, {
				"label": "长流乡",
				"value": "9684",
				"children": []
			}, {
				"label": "大田乡",
				"value": "9685",
				"children": []
			}, {
				"label": "马场乡",
				"value": "9686",
				"children": []
			}, {
				"label": "紫马乡",
				"value": "9687",
				"children": []
			}, {
				"label": "安谷乡",
				"value": "9688",
				"children": []
			}, {
				"label": "三宝乡",
				"value": "9689",
				"children": []
			}]
		}, {
			"label": "贞丰县",
			"value": "2203",
			"children": [{
				"label": "北盘江镇",
				"value": "9663",
				"children": []
			}, {
				"label": "珉谷镇",
				"value": "9664",
				"children": []
			}, {
				"label": "龙场镇",
				"value": "9665",
				"children": []
			}, {
				"label": "者相镇",
				"value": "9666",
				"children": []
			}, {
				"label": "白层镇",
				"value": "9667",
				"children": []
			}, {
				"label": "鲁贡镇",
				"value": "9668",
				"children": []
			}, {
				"label": "连环乡",
				"value": "9669",
				"children": []
			}, {
				"label": "挽澜乡",
				"value": "9670",
				"children": []
			}, {
				"label": "小屯乡",
				"value": "9671",
				"children": []
			}, {
				"label": "长田乡",
				"value": "9672",
				"children": []
			}, {
				"label": "平街乡",
				"value": "9673",
				"children": []
			}, {
				"label": "鲁容乡",
				"value": "9674",
				"children": []
			}, {
				"label": "沙坪乡",
				"value": "9675",
				"children": []
			}]
		}, {
			"label": "安龙县",
			"value": "2204",
			"children": [{
				"label": "万峰湖镇",
				"value": "9616",
				"children": []
			}, {
				"label": "新安镇",
				"value": "9617",
				"children": []
			}, {
				"label": "龙广镇",
				"value": "9618",
				"children": []
			}, {
				"label": "德卧镇",
				"value": "9619",
				"children": []
			}, {
				"label": "木咱镇",
				"value": "9620",
				"children": []
			}, {
				"label": "洒雨镇",
				"value": "9621",
				"children": []
			}, {
				"label": "普坪镇",
				"value": "9622",
				"children": []
			}, {
				"label": "龙山镇",
				"value": "9623",
				"children": []
			}, {
				"label": "戈塘镇",
				"value": "9624",
				"children": []
			}, {
				"label": "兴隆镇",
				"value": "9625",
				"children": []
			}, {
				"label": "新桥镇",
				"value": "9626",
				"children": []
			}, {
				"label": "海子乡",
				"value": "9627",
				"children": []
			}, {
				"label": "笃山乡",
				"value": "9628",
				"children": []
			}, {
				"label": "平乐乡",
				"value": "9629",
				"children": []
			}, {
				"label": "钱相乡",
				"value": "9630",
				"children": []
			}, {
				"label": "坡脚乡",
				"value": "9631",
				"children": []
			}]
		}]
	}, {
		"label": "黔东南州",
		"value": "2205",
		"children": [{
			"label": "凯里市",
			"value": "2206",
			"children": [{
				"label": "洗马河街道",
				"value": "9163",
				"children": []
			}, {
				"label": "大十字街道",
				"value": "9164",
				"children": []
			}, {
				"label": "城西街道",
				"value": "9165",
				"children": []
			}, {
				"label": "西门街道",
				"value": "9166",
				"children": []
			}, {
				"label": "湾溪街道",
				"value": "9167",
				"children": []
			}, {
				"label": "鸭塘街道",
				"value": "9168",
				"children": []
			}, {
				"label": "开怀街道",
				"value": "9169",
				"children": []
			}, {
				"label": "三棵树镇",
				"value": "9170",
				"children": []
			}, {
				"label": "舟溪镇",
				"value": "9171",
				"children": []
			}, {
				"label": "旁海镇",
				"value": "9172",
				"children": []
			}, {
				"label": "湾水镇",
				"value": "9173",
				"children": []
			}, {
				"label": "炉山镇",
				"value": "9174",
				"children": []
			}, {
				"label": "万潮镇",
				"value": "9175",
				"children": []
			}, {
				"label": "龙场镇",
				"value": "9176",
				"children": []
			}, {
				"label": "凯棠乡",
				"value": "9177",
				"children": []
			}, {
				"label": "大风洞乡",
				"value": "9178",
				"children": []
			}]
		}, {
			"label": "施秉市",
			"value": "2207",
			"children": [{
				"label": "城关镇",
				"value": "9179",
				"children": []
			}, {
				"label": "杨柳塘镇",
				"value": "9180",
				"children": []
			}, {
				"label": "牛大场镇",
				"value": "9181",
				"children": []
			}, {
				"label": "双井镇",
				"value": "9182",
				"children": []
			}, {
				"label": "白垛乡",
				"value": "9183",
				"children": []
			}, {
				"label": "甘溪乡",
				"value": "9184",
				"children": []
			}, {
				"label": "马号乡",
				"value": "9185",
				"children": []
			}, {
				"label": "马溪乡",
				"value": "9186",
				"children": []
			}]
		}, {
			"label": "从江县",
			"value": "2208",
			"children": [{
				"label": "丙妹镇",
				"value": "9328",
				"children": []
			}, {
				"label": "贯洞镇",
				"value": "9329",
				"children": []
			}, {
				"label": "洛香镇",
				"value": "9330",
				"children": []
			}, {
				"label": "下江镇",
				"value": "9331",
				"children": []
			}, {
				"label": "宰便镇",
				"value": "9332",
				"children": []
			}, {
				"label": "西山镇",
				"value": "9333",
				"children": []
			}, {
				"label": "停洞镇",
				"value": "9334",
				"children": []
			}, {
				"label": "高增乡",
				"value": "9335",
				"children": []
			}, {
				"label": "谷坪乡",
				"value": "9336",
				"children": []
			}, {
				"label": "雍里乡",
				"value": "9337",
				"children": []
			}, {
				"label": "庆云乡",
				"value": "9338",
				"children": []
			}, {
				"label": "刚边乡",
				"value": "9339",
				"children": []
			}, {
				"label": "加榜乡",
				"value": "9340",
				"children": []
			}, {
				"label": "秀塘乡",
				"value": "9341",
				"children": []
			}, {
				"label": "斗里乡",
				"value": "9342",
				"children": []
			}, {
				"label": "翠里乡",
				"value": "9343",
				"children": []
			}, {
				"label": "往洞乡",
				"value": "9344",
				"children": []
			}, {
				"label": "东朗乡",
				"value": "9345",
				"children": []
			}, {
				"label": "加鸠乡",
				"value": "9346",
				"children": []
			}, {
				"label": "加勉乡",
				"value": "9347",
				"children": []
			}, {
				"label": "光辉乡",
				"value": "9348",
				"children": []
			}]
		}, {
			"label": "锦屏县",
			"value": "2209",
			"children": [{
				"label": "三江镇",
				"value": "9249",
				"children": []
			}, {
				"label": "茅坪镇",
				"value": "9250",
				"children": []
			}, {
				"label": "敦寨镇",
				"value": "9251",
				"children": []
			}, {
				"label": "启蒙镇",
				"value": "9252",
				"children": []
			}, {
				"label": "平秋镇",
				"value": "9253",
				"children": []
			}, {
				"label": "铜鼓镇",
				"value": "9254",
				"children": []
			}, {
				"label": "平略镇",
				"value": "9255",
				"children": []
			}, {
				"label": "大同乡",
				"value": "9256",
				"children": []
			}, {
				"label": "新化乡",
				"value": "9257",
				"children": []
			}, {
				"label": "隆里乡",
				"value": "9258",
				"children": []
			}, {
				"label": "钟灵乡",
				"value": "9259",
				"children": []
			}, {
				"label": "偶里乡",
				"value": "9260",
				"children": []
			}, {
				"label": "固本乡",
				"value": "9261",
				"children": []
			}, {
				"label": "河口乡",
				"value": "9262",
				"children": []
			}, {
				"label": "彦洞乡",
				"value": "9263",
				"children": []
			}]
		}, {
			"label": "镇远县",
			"value": "2210",
			"children": [{
				"label": "舞阳镇",
				"value": "9210",
				"children": []
			}, {
				"label": "蕉溪镇",
				"value": "9211",
				"children": []
			}, {
				"label": "青溪镇",
				"value": "9212",
				"children": []
			}, {
				"label": "羊坪镇",
				"value": "9213",
				"children": []
			}, {
				"label": "羊场镇",
				"value": "9214",
				"children": []
			}, {
				"label": "都坪镇",
				"value": "9215",
				"children": []
			}, {
				"label": "江古乡",
				"value": "9216",
				"children": []
			}, {
				"label": "涌溪乡",
				"value": "9217",
				"children": []
			}, {
				"label": "金堡乡",
				"value": "9218",
				"children": []
			}, {
				"label": "报京乡",
				"value": "9219",
				"children": []
			}, {
				"label": "大地乡",
				"value": "9220",
				"children": []
			}, {
				"label": "尚寨乡",
				"value": "9221",
				"children": []
			}]
		}, {
			"label": "麻江县",
			"value": "2211",
			"children": [{
				"label": "杏山镇",
				"value": "9358",
				"children": []
			}, {
				"label": "谷硐镇",
				"value": "9359",
				"children": []
			}, {
				"label": "下司镇",
				"value": "9360",
				"children": []
			}, {
				"label": "宣威镇",
				"value": "9361",
				"children": []
			}, {
				"label": "碧波乡",
				"value": "9362",
				"children": []
			}, {
				"label": "龙山乡",
				"value": "9363",
				"children": []
			}, {
				"label": "贤昌乡",
				"value": "9364",
				"children": []
			}, {
				"label": "坝芒乡",
				"value": "9365",
				"children": []
			}, {
				"label": "景阳乡",
				"value": "9366",
				"children": []
			}]
		}, {
			"label": "台江县",
			"value": "2212",
			"children": [{
				"label": "台拱镇",
				"value": "9276",
				"children": []
			}, {
				"label": "施洞镇",
				"value": "9277",
				"children": []
			}, {
				"label": "南宫乡",
				"value": "9278",
				"children": []
			}, {
				"label": "排羊乡",
				"value": "9279",
				"children": []
			}, {
				"label": "台盘乡",
				"value": "9280",
				"children": []
			}, {
				"label": "革一乡",
				"value": "9281",
				"children": []
			}, {
				"label": "老屯乡",
				"value": "9282",
				"children": []
			}, {
				"label": "方召乡",
				"value": "9283",
				"children": []
			}]
		}, {
			"label": "天柱县",
			"value": "2213",
			"children": [{
				"label": "凤城镇",
				"value": "9233",
				"children": []
			}, {
				"label": "邦洞镇",
				"value": "9234",
				"children": []
			}, {
				"label": "坪地镇",
				"value": "9235",
				"children": []
			}, {
				"label": "兰田镇",
				"value": "9236",
				"children": []
			}, {
				"label": "瓮洞镇",
				"value": "9237",
				"children": []
			}, {
				"label": "高酿镇",
				"value": "9238",
				"children": []
			}, {
				"label": "石洞镇",
				"value": "9239",
				"children": []
			}, {
				"label": "远口镇",
				"value": "9240",
				"children": []
			}, {
				"label": "坌处镇",
				"value": "9241",
				"children": []
			}, {
				"label": "白市镇",
				"value": "9242",
				"children": []
			}, {
				"label": "社学乡",
				"value": "9243",
				"children": []
			}, {
				"label": "渡马乡",
				"value": "9244",
				"children": []
			}, {
				"label": "注溪乡",
				"value": "9245",
				"children": []
			}, {
				"label": "地湖乡",
				"value": "9246",
				"children": []
			}, {
				"label": "竹林乡",
				"value": "9247",
				"children": []
			}, {
				"label": "江东乡",
				"value": "9248",
				"children": []
			}]
		}, {
			"label": "黄平县",
			"value": "2214",
			"children": [{
				"label": "新州镇",
				"value": "9187",
				"children": []
			}, {
				"label": "旧州镇",
				"value": "9188",
				"children": []
			}, {
				"label": "重安镇",
				"value": "9189",
				"children": []
			}, {
				"label": "谷陇镇",
				"value": "9190",
				"children": []
			}, {
				"label": "平溪镇",
				"value": "9191",
				"children": []
			}, {
				"label": "黄飘乡",
				"value": "9192",
				"children": []
			}, {
				"label": "上塘乡",
				"value": "9193",
				"children": []
			}, {
				"label": "纸房乡",
				"value": "9194",
				"children": []
			}, {
				"label": "浪洞乡",
				"value": "9195",
				"children": []
			}, {
				"label": "翁坪乡",
				"value": "9196",
				"children": []
			}, {
				"label": "重兴乡",
				"value": "9197",
				"children": []
			}, {
				"label": "苗陇乡",
				"value": "9198",
				"children": []
			}, {
				"label": "野洞河乡",
				"value": "9199",
				"children": []
			}, {
				"label": "一碗水乡",
				"value": "9200",
				"children": []
			}]
		}, {
			"label": "榕江县",
			"value": "2215",
			"children": [{
				"label": "古州镇",
				"value": "9309",
				"children": []
			}, {
				"label": "忠诚镇",
				"value": "9310",
				"children": []
			}, {
				"label": "寨蒿镇",
				"value": "9311",
				"children": []
			}, {
				"label": "平永镇",
				"value": "9312",
				"children": []
			}, {
				"label": "乐里镇",
				"value": "9313",
				"children": []
			}, {
				"label": "朗洞镇",
				"value": "9314",
				"children": []
			}, {
				"label": "栽麻乡",
				"value": "9315",
				"children": []
			}, {
				"label": "崇义乡",
				"value": "9316",
				"children": []
			}, {
				"label": "平江乡",
				"value": "9317",
				"children": []
			}, {
				"label": "三江乡",
				"value": "9318",
				"children": []
			}, {
				"label": "仁里乡",
				"value": "9319",
				"children": []
			}, {
				"label": "塔石乡",
				"value": "9320",
				"children": []
			}, {
				"label": "八开乡",
				"value": "9321",
				"children": []
			}, {
				"label": "定威乡",
				"value": "9322",
				"children": []
			}, {
				"label": "兴华乡",
				"value": "9323",
				"children": []
			}, {
				"label": "计划乡",
				"value": "9324",
				"children": []
			}, {
				"label": "水尾乡",
				"value": "9325",
				"children": []
			}, {
				"label": "平阳乡",
				"value": "9326",
				"children": []
			}, {
				"label": "两汪乡",
				"value": "9327",
				"children": []
			}]
		}, {
			"label": "剑河县",
			"value": "2216",
			"children": [{
				"label": "柳川镇",
				"value": "9264",
				"children": []
			}, {
				"label": "岑松镇",
				"value": "9265",
				"children": []
			}, {
				"label": "南加镇",
				"value": "9266",
				"children": []
			}, {
				"label": "南明镇",
				"value": "9267",
				"children": []
			}, {
				"label": "革东镇",
				"value": "9268",
				"children": []
			}, {
				"label": "久仰乡",
				"value": "9269",
				"children": []
			}, {
				"label": "太拥乡",
				"value": "9270",
				"children": []
			}, {
				"label": "南哨乡",
				"value": "9271",
				"children": []
			}, {
				"label": "南寨乡",
				"value": "9272",
				"children": []
			}, {
				"label": "盘溪乡",
				"value": "9273",
				"children": []
			}, {
				"label": "敏洞乡",
				"value": "9274",
				"children": []
			}, {
				"label": "观么乡",
				"value": "9275",
				"children": []
			}]
		}, {
			"label": "三穗县",
			"value": "2217",
			"children": [{
				"label": "八弓镇",
				"value": "9201",
				"children": []
			}, {
				"label": "台烈镇",
				"value": "9202",
				"children": []
			}, {
				"label": "瓦寨镇",
				"value": "9203",
				"children": []
			}, {
				"label": "桐林镇",
				"value": "9204",
				"children": []
			}, {
				"label": "雪洞镇",
				"value": "9205",
				"children": []
			}, {
				"label": "滚马乡",
				"value": "9206",
				"children": []
			}, {
				"label": "长吉乡",
				"value": "9207",
				"children": []
			}, {
				"label": "款场乡",
				"value": "9208",
				"children": []
			}, {
				"label": "良上乡",
				"value": "9209",
				"children": []
			}]
		}, {
			"label": "雷山县",
			"value": "2218",
			"children": [{
				"label": "丹江镇",
				"value": "9349",
				"children": []
			}, {
				"label": "西江镇",
				"value": "9350",
				"children": []
			}, {
				"label": "永乐镇",
				"value": "9351",
				"children": []
			}, {
				"label": "郎德镇",
				"value": "9352",
				"children": []
			}, {
				"label": "望丰乡",
				"value": "9353",
				"children": []
			}, {
				"label": "大塘乡",
				"value": "9354",
				"children": []
			}, {
				"label": "桃江乡",
				"value": "9355",
				"children": []
			}, {
				"label": "达地乡",
				"value": "9356",
				"children": []
			}, {
				"label": "方祥乡",
				"value": "9357",
				"children": []
			}]
		}, {
			"label": "黎平县",
			"value": "2219",
			"children": [{
				"label": "德凤镇",
				"value": "9284",
				"children": []
			}, {
				"label": "高屯镇",
				"value": "9285",
				"children": []
			}, {
				"label": "中潮镇",
				"value": "9286",
				"children": []
			}, {
				"label": "孟彦镇",
				"value": "9287",
				"children": []
			}, {
				"label": "敖市镇",
				"value": "9288",
				"children": []
			}, {
				"label": "九潮镇",
				"value": "9289",
				"children": []
			}, {
				"label": "岩洞镇",
				"value": "9290",
				"children": []
			}, {
				"label": "水口镇",
				"value": "9291",
				"children": []
			}, {
				"label": "洪州镇",
				"value": "9292",
				"children": []
			}, {
				"label": "尚重镇",
				"value": "9293",
				"children": []
			}, {
				"label": "顺化乡",
				"value": "9294",
				"children": []
			}, {
				"label": "雷洞乡",
				"value": "9295",
				"children": []
			}, {
				"label": "永从乡",
				"value": "9296",
				"children": []
			}, {
				"label": "罗里乡",
				"value": "9297",
				"children": []
			}, {
				"label": "茅贡乡",
				"value": "9298",
				"children": []
			}, {
				"label": "坝寨乡",
				"value": "9299",
				"children": []
			}, {
				"label": "口江乡",
				"value": "9300",
				"children": []
			}, {
				"label": "双江乡",
				"value": "9301",
				"children": []
			}, {
				"label": "肇兴乡",
				"value": "9302",
				"children": []
			}, {
				"label": "龙额乡",
				"value": "9303",
				"children": []
			}, {
				"label": "地坪乡",
				"value": "9304",
				"children": []
			}, {
				"label": "德顺乡",
				"value": "9305",
				"children": []
			}, {
				"label": "大稼乡",
				"value": "9306",
				"children": []
			}, {
				"label": "平寨乡",
				"value": "9307",
				"children": []
			}, {
				"label": "德化乡",
				"value": "9308",
				"children": []
			}]
		}, {
			"label": "岑巩县",
			"value": "2220",
			"children": [{
				"label": "思旸镇",
				"value": "9222",
				"children": []
			}, {
				"label": "水尾镇",
				"value": "9223",
				"children": []
			}, {
				"label": "天马镇",
				"value": "9224",
				"children": []
			}, {
				"label": "龙田镇",
				"value": "9225",
				"children": []
			}, {
				"label": "大有乡",
				"value": "9226",
				"children": []
			}, {
				"label": "注溪乡",
				"value": "9227",
				"children": []
			}, {
				"label": "天星乡",
				"value": "9228",
				"children": []
			}, {
				"label": "羊桥乡",
				"value": "9229",
				"children": []
			}, {
				"label": "凯本乡",
				"value": "9230",
				"children": []
			}, {
				"label": "平庄乡",
				"value": "9231",
				"children": []
			}, {
				"label": "客楼乡",
				"value": "9232",
				"children": []
			}]
		}, {
			"label": "丹寨县",
			"value": "2221",
			"children": [{
				"label": "龙泉镇",
				"value": "9367",
				"children": []
			}, {
				"label": "兴仁镇",
				"value": "9368",
				"children": []
			}, {
				"label": "排调镇",
				"value": "9369",
				"children": []
			}, {
				"label": "长青乡",
				"value": "9370",
				"children": []
			}, {
				"label": "扬武乡",
				"value": "9371",
				"children": []
			}, {
				"label": "雅灰乡",
				"value": "9372",
				"children": []
			}, {
				"label": "南皋乡",
				"value": "9373",
				"children": []
			}]
		}]
	}, {
		"label": "黔南州",
		"value": "2222",
		"children": [{
			"label": "都匀市",
			"value": "2223",
			"children": [{
				"label": "广惠街道",
				"value": "9375",
				"children": []
			}, {
				"label": "文峰街道",
				"value": "9376",
				"children": []
			}, {
				"label": "新华街道",
				"value": "9377",
				"children": []
			}, {
				"label": "小围寨街道",
				"value": "9378",
				"children": []
			}, {
				"label": "沙包堡街道",
				"value": "9379",
				"children": []
			}, {
				"label": "杨柳街镇",
				"value": "9380",
				"children": []
			}, {
				"label": "甘塘镇",
				"value": "9381",
				"children": []
			}, {
				"label": "洛邦镇",
				"value": "9382",
				"children": []
			}, {
				"label": "坝固镇",
				"value": "9383",
				"children": []
			}, {
				"label": "大坪镇",
				"value": "9384",
				"children": []
			}, {
				"label": "王司镇",
				"value": "9385",
				"children": []
			}, {
				"label": "墨冲镇",
				"value": "9386",
				"children": []
			}, {
				"label": "平浪镇",
				"value": "9387",
				"children": []
			}, {
				"label": "凯口镇",
				"value": "9388",
				"children": []
			}, {
				"label": "江洲镇",
				"value": "9389",
				"children": []
			}, {
				"label": "奉合乡",
				"value": "9390",
				"children": []
			}, {
				"label": "阳和乡",
				"value": "9391",
				"children": []
			}, {
				"label": "基场乡",
				"value": "9392",
				"children": []
			}, {
				"label": "良亩乡",
				"value": "9393",
				"children": []
			}, {
				"label": "河阳乡",
				"value": "9394",
				"children": []
			}, {
				"label": "沙寨乡",
				"value": "9395",
				"children": []
			}, {
				"label": "石龙乡",
				"value": "9396",
				"children": []
			}, {
				"label": "摆忙乡",
				"value": "9397",
				"children": []
			}]
		}, {
			"label": "福泉市",
			"value": "2224",
			"children": [{
				"label": "金山街道",
				"value": "9398",
				"children": []
			}, {
				"label": "马场坪街道",
				"value": "9399",
				"children": []
			}, {
				"label": "城厢镇",
				"value": "9400",
				"children": []
			}, {
				"label": "黄丝镇",
				"value": "9401",
				"children": []
			}, {
				"label": "凤山镇",
				"value": "9402",
				"children": []
			}, {
				"label": "陆坪镇",
				"value": "9403",
				"children": []
			}, {
				"label": "地松镇",
				"value": "9404",
				"children": []
			}, {
				"label": "龙昌镇",
				"value": "9405",
				"children": []
			}, {
				"label": "牛场镇",
				"value": "9406",
				"children": []
			}, {
				"label": "道坪镇",
				"value": "9407",
				"children": []
			}, {
				"label": "高坪镇",
				"value": "9408",
				"children": []
			}, {
				"label": "兴隆乡",
				"value": "9409",
				"children": []
			}, {
				"label": "藜山乡",
				"value": "9410",
				"children": []
			}, {
				"label": "岔河乡",
				"value": "9411",
				"children": []
			}, {
				"label": "仙桥乡",
				"value": "9412",
				"children": []
			}, {
				"label": "高石乡",
				"value": "9413",
				"children": []
			}, {
				"label": "谷汪乡",
				"value": "9414",
				"children": []
			}]
		}, {
			"label": "贵定市",
			"value": "2225",
			"children": [{
				"label": "城关镇",
				"value": "9432",
				"children": []
			}, {
				"label": "德新镇",
				"value": "9433",
				"children": []
			}, {
				"label": "新巴镇",
				"value": "9434",
				"children": []
			}, {
				"label": "盘江镇",
				"value": "9435",
				"children": []
			}, {
				"label": "沿山镇",
				"value": "9436",
				"children": []
			}, {
				"label": "旧治镇",
				"value": "9437",
				"children": []
			}, {
				"label": "昌明镇",
				"value": "9438",
				"children": []
			}, {
				"label": "云雾镇",
				"value": "9439",
				"children": []
			}, {
				"label": "新铺乡",
				"value": "9440",
				"children": []
			}, {
				"label": "定东乡",
				"value": "9441",
				"children": []
			}, {
				"label": "定南乡",
				"value": "9442",
				"children": []
			}, {
				"label": "巩固乡",
				"value": "9443",
				"children": []
			}, {
				"label": "都六乡",
				"value": "9444",
				"children": []
			}, {
				"label": "岩下乡",
				"value": "9445",
				"children": []
			}, {
				"label": "抱管乡",
				"value": "9446",
				"children": []
			}, {
				"label": "铁厂乡",
				"value": "9447",
				"children": []
			}, {
				"label": "窑上乡",
				"value": "9448",
				"children": []
			}, {
				"label": "猴场堡乡",
				"value": "9449",
				"children": []
			}, {
				"label": "落北河乡",
				"value": "9450",
				"children": []
			}, {
				"label": "马场河乡",
				"value": "9451",
				"children": []
			}]
		}, {
			"label": "惠水县",
			"value": "2226",
			"children": [{
				"label": "和平镇",
				"value": "9570",
				"children": []
			}, {
				"label": "高镇镇",
				"value": "9571",
				"children": []
			}, {
				"label": "三都镇",
				"value": "9572",
				"children": []
			}, {
				"label": "摆金镇",
				"value": "9573",
				"children": []
			}, {
				"label": "雅水镇",
				"value": "9574",
				"children": []
			}, {
				"label": "断杉镇",
				"value": "9575",
				"children": []
			}, {
				"label": "芦山镇",
				"value": "9576",
				"children": []
			}, {
				"label": "王佑镇",
				"value": "9577",
				"children": []
			}, {
				"label": "长田乡",
				"value": "9578",
				"children": []
			}, {
				"label": "摆榜乡",
				"value": "9579",
				"children": []
			}, {
				"label": "斗底乡",
				"value": "9580",
				"children": []
			}, {
				"label": "甲烈乡",
				"value": "9581",
				"children": []
			}, {
				"label": "岗度乡",
				"value": "9582",
				"children": []
			}, {
				"label": "宁旺乡",
				"value": "9583",
				"children": []
			}, {
				"label": "鸭绒乡",
				"value": "9584",
				"children": []
			}, {
				"label": "太阳乡",
				"value": "9585",
				"children": []
			}, {
				"label": "羡塘乡",
				"value": "9586",
				"children": []
			}, {
				"label": "甲戎乡",
				"value": "9587",
				"children": []
			}, {
				"label": "抵季乡",
				"value": "9588",
				"children": []
			}, {
				"label": "大龙乡",
				"value": "9589",
				"children": []
			}, {
				"label": "大坝乡",
				"value": "9590",
				"children": []
			}, {
				"label": "抵麻乡",
				"value": "9591",
				"children": []
			}, {
				"label": "长安乡",
				"value": "9592",
				"children": []
			}, {
				"label": "打引乡",
				"value": "9593",
				"children": []
			}, {
				"label": "好花红乡",
				"value": "9594",
				"children": []
			}]
		}, {
			"label": "罗甸县",
			"value": "2227",
			"children": [{
				"label": "龙坪镇",
				"value": "9512",
				"children": []
			}, {
				"label": "边阳镇",
				"value": "9513",
				"children": []
			}, {
				"label": "逢亭镇",
				"value": "9514",
				"children": []
			}, {
				"label": "沫阳镇",
				"value": "9515",
				"children": []
			}, {
				"label": "茂井镇",
				"value": "9516",
				"children": []
			}, {
				"label": "罗悃镇",
				"value": "9517",
				"children": []
			}, {
				"label": "红水河镇",
				"value": "9518",
				"children": []
			}, {
				"label": "板庚乡",
				"value": "9519",
				"children": []
			}, {
				"label": "云干乡",
				"value": "9520",
				"children": []
			}, {
				"label": "八总乡",
				"value": "9521",
				"children": []
			}, {
				"label": "栗木乡",
				"value": "9522",
				"children": []
			}, {
				"label": "罗沙乡",
				"value": "9523",
				"children": []
			}, {
				"label": "交砚乡",
				"value": "9524",
				"children": []
			}, {
				"label": "董王乡",
				"value": "9525",
				"children": []
			}, {
				"label": "木引乡",
				"value": "9526",
				"children": []
			}, {
				"label": "纳坪乡",
				"value": "9527",
				"children": []
			}, {
				"label": "董当乡",
				"value": "9528",
				"children": []
			}, {
				"label": "董架乡",
				"value": "9529",
				"children": []
			}, {
				"label": "平岩乡",
				"value": "9530",
				"children": []
			}, {
				"label": "凤亭乡",
				"value": "9531",
				"children": []
			}, {
				"label": "大亭乡",
				"value": "9532",
				"children": []
			}, {
				"label": "班仁乡",
				"value": "9533",
				"children": []
			}, {
				"label": "罗苏乡",
				"value": "9534",
				"children": []
			}, {
				"label": "罗暮乡",
				"value": "9535",
				"children": []
			}, {
				"label": "沟亭乡",
				"value": "9536",
				"children": []
			}, {
				"label": "罗妥乡",
				"value": "9537",
				"children": []
			}]
		}, {
			"label": "瓮安县",
			"value": "2228",
			"children": [{
				"label": "平定营镇",
				"value": "9452",
				"children": []
			}, {
				"label": "雍阳镇",
				"value": "9453",
				"children": []
			}, {
				"label": "草塘镇",
				"value": "9454",
				"children": []
			}, {
				"label": "中坪镇",
				"value": "9455",
				"children": []
			}, {
				"label": "建中镇",
				"value": "9456",
				"children": []
			}, {
				"label": "永和镇",
				"value": "9457",
				"children": []
			}, {
				"label": "珠藏镇",
				"value": "9458",
				"children": []
			}, {
				"label": "玉山镇",
				"value": "9459",
				"children": []
			}, {
				"label": "天文镇",
				"value": "9460",
				"children": []
			}, {
				"label": "玉华乡",
				"value": "9461",
				"children": []
			}, {
				"label": "银盏乡",
				"value": "9462",
				"children": []
			}, {
				"label": "松坪乡",
				"value": "9463",
				"children": []
			}, {
				"label": "白沙乡",
				"value": "9464",
				"children": []
			}, {
				"label": "岚关乡",
				"value": "9465",
				"children": []
			}, {
				"label": "高水乡",
				"value": "9466",
				"children": []
			}, {
				"label": "铜锣乡",
				"value": "9467",
				"children": []
			}, {
				"label": "鱼河乡",
				"value": "9468",
				"children": []
			}, {
				"label": "龙塘乡",
				"value": "9469",
				"children": []
			}, {
				"label": "老坟嘴乡",
				"value": "9470",
				"children": []
			}, {
				"label": "木引槽乡",
				"value": "9471",
				"children": []
			}, {
				"label": "牛场坝乡",
				"value": "9472",
				"children": []
			}, {
				"label": "小河山乡",
				"value": "9473",
				"children": []
			}, {
				"label": "木老坪乡",
				"value": "9474",
				"children": []
			}]
		}, {
			"label": "荔波县",
			"value": "2229",
			"children": [{
				"label": "玉屏镇",
				"value": "9415",
				"children": []
			}, {
				"label": "朝阳镇",
				"value": "9416",
				"children": []
			}, {
				"label": "茂兰镇",
				"value": "9417",
				"children": []
			}, {
				"label": "立化镇",
				"value": "9418",
				"children": []
			}, {
				"label": "甲良镇",
				"value": "9419",
				"children": []
			}, {
				"label": "佳荣镇",
				"value": "9420",
				"children": []
			}, {
				"label": "永康乡",
				"value": "9421",
				"children": []
			}, {
				"label": "水尧乡",
				"value": "9422",
				"children": []
			}, {
				"label": "水利乡",
				"value": "9423",
				"children": []
			}, {
				"label": "瑶山乡",
				"value": "9424",
				"children": []
			}, {
				"label": "捞村乡",
				"value": "9425",
				"children": []
			}, {
				"label": "翁昂乡",
				"value": "9426",
				"children": []
			}, {
				"label": "驾欧乡",
				"value": "9427",
				"children": []
			}, {
				"label": "瑶麓乡",
				"value": "9428",
				"children": []
			}, {
				"label": "洞塘乡",
				"value": "9429",
				"children": []
			}, {
				"label": "方村乡",
				"value": "9430",
				"children": []
			}, {
				"label": "播尧乡",
				"value": "9431",
				"children": []
			}]
		}, {
			"label": "龙里县",
			"value": "2230",
			"children": [{
				"label": "龙山镇",
				"value": "9556",
				"children": []
			}, {
				"label": "三元镇",
				"value": "9557",
				"children": []
			}, {
				"label": "醒狮镇",
				"value": "9558",
				"children": []
			}, {
				"label": "谷脚镇",
				"value": "9559",
				"children": []
			}, {
				"label": "羊场镇",
				"value": "9560",
				"children": []
			}, {
				"label": "洗马镇",
				"value": "9561",
				"children": []
			}, {
				"label": "草原乡",
				"value": "9562",
				"children": []
			}, {
				"label": "麻芝乡",
				"value": "9563",
				"children": []
			}, {
				"label": "水场乡",
				"value": "9564",
				"children": []
			}, {
				"label": "湾寨乡",
				"value": "9565",
				"children": []
			}, {
				"label": "摆省乡",
				"value": "9566",
				"children": []
			}, {
				"label": "巴江乡",
				"value": "9567",
				"children": []
			}, {
				"label": "谷龙乡",
				"value": "9568",
				"children": []
			}, {
				"label": "哪嗙乡",
				"value": "9569",
				"children": []
			}]
		}, {
			"label": "平塘县",
			"value": "2231",
			"children": [{
				"label": "平湖镇",
				"value": "9493",
				"children": []
			}, {
				"label": "牙舟镇",
				"value": "9494",
				"children": []
			}, {
				"label": "通州镇",
				"value": "9495",
				"children": []
			}, {
				"label": "大塘镇",
				"value": "9496",
				"children": []
			}, {
				"label": "克度镇",
				"value": "9497",
				"children": []
			}, {
				"label": "塘边镇",
				"value": "9498",
				"children": []
			}, {
				"label": "摆茹镇",
				"value": "9499",
				"children": []
			}, {
				"label": "者密镇",
				"value": "9500",
				"children": []
			}, {
				"label": "四寨镇",
				"value": "9501",
				"children": []
			}, {
				"label": "苗二河乡",
				"value": "9502",
				"children": []
			}, {
				"label": "卡蒲乡",
				"value": "9503",
				"children": []
			}, {
				"label": "白龙乡",
				"value": "9504",
				"children": []
			}, {
				"label": "甘寨乡",
				"value": "9505",
				"children": []
			}, {
				"label": "卡罗乡",
				"value": "9506",
				"children": []
			}, {
				"label": "谷硐乡",
				"value": "9507",
				"children": []
			}, {
				"label": "鼠场乡",
				"value": "9508",
				"children": []
			}, {
				"label": "新塘乡",
				"value": "9509",
				"children": []
			}, {
				"label": "掌布乡",
				"value": "9510",
				"children": []
			}, {
				"label": "西凉乡",
				"value": "9511",
				"children": []
			}]
		}, {
			"label": "长顺县",
			"value": "2232",
			"children": [{
				"label": "白云山镇",
				"value": "9538",
				"children": []
			}, {
				"label": "长寨镇",
				"value": "9539",
				"children": []
			}, {
				"label": "广顺镇",
				"value": "9540",
				"children": []
			}, {
				"label": "威远镇",
				"value": "9541",
				"children": []
			}, {
				"label": "摆所镇",
				"value": "9542",
				"children": []
			}, {
				"label": "代化镇",
				"value": "9543",
				"children": []
			}, {
				"label": "鼓扬镇",
				"value": "9544",
				"children": []
			}, {
				"label": "马路乡",
				"value": "9545",
				"children": []
			}, {
				"label": "凯佐乡",
				"value": "9546",
				"children": []
			}, {
				"label": "摆塘乡",
				"value": "9547",
				"children": []
			}, {
				"label": "种获乡",
				"value": "9548",
				"children": []
			}, {
				"label": "新寨乡",
				"value": "9549",
				"children": []
			}, {
				"label": "营盘乡",
				"value": "9550",
				"children": []
			}, {
				"label": "中坝乡",
				"value": "9551",
				"children": []
			}, {
				"label": "睦化乡",
				"value": "9552",
				"children": []
			}, {
				"label": "交麻乡",
				"value": "9553",
				"children": []
			}, {
				"label": "敦操乡",
				"value": "9554",
				"children": []
			}, {
				"label": "广顺茶叶果树场",
				"value": "9555",
				"children": []
			}]
		}, {
			"label": "独山县",
			"value": "2233",
			"children": [{
				"label": "城关镇",
				"value": "9475",
				"children": []
			}, {
				"label": "兔场镇",
				"value": "9476",
				"children": []
			}, {
				"label": "麻万镇",
				"value": "9477",
				"children": []
			}, {
				"label": "基长镇",
				"value": "9478",
				"children": []
			}, {
				"label": "上司镇",
				"value": "9479",
				"children": []
			}, {
				"label": "下司镇",
				"value": "9480",
				"children": []
			}, {
				"label": "甲里镇",
				"value": "9481",
				"children": []
			}, {
				"label": "麻尾镇",
				"value": "9482",
				"children": []
			}, {
				"label": "尧梭乡",
				"value": "9483",
				"children": []
			}, {
				"label": "羊凤乡",
				"value": "9484",
				"children": []
			}, {
				"label": "甲定乡",
				"value": "9485",
				"children": []
			}, {
				"label": "翁台乡",
				"value": "9486",
				"children": []
			}, {
				"label": "本寨乡",
				"value": "9487",
				"children": []
			}, {
				"label": "水岩乡",
				"value": "9488",
				"children": []
			}, {
				"label": "打羊乡",
				"value": "9489",
				"children": []
			}, {
				"label": "尧棒乡",
				"value": "9490",
				"children": []
			}, {
				"label": "黄后乡",
				"value": "9491",
				"children": []
			}, {
				"label": "董岭乡",
				"value": "9492",
				"children": []
			}]
		}, {
			"label": "三都县",
			"value": "2234",
			"children": [{
				"label": "三合镇",
				"value": "9595",
				"children": []
			}, {
				"label": "大河镇",
				"value": "9596",
				"children": []
			}, {
				"label": "合江镇",
				"value": "9597",
				"children": []
			}, {
				"label": "丰乐镇",
				"value": "9598",
				"children": []
			}, {
				"label": "普安镇",
				"value": "9599",
				"children": []
			}, {
				"label": "都江镇",
				"value": "9600",
				"children": []
			}, {
				"label": "中和镇",
				"value": "9601",
				"children": []
			}, {
				"label": "周覃镇",
				"value": "9602",
				"children": []
			}, {
				"label": "廷牌镇",
				"value": "9603",
				"children": []
			}, {
				"label": "九阡镇",
				"value": "9604",
				"children": []
			}, {
				"label": "交梨乡",
				"value": "9605",
				"children": []
			}, {
				"label": "拉揽乡",
				"value": "9606",
				"children": []
			}, {
				"label": "打鱼乡",
				"value": "9607",
				"children": []
			}, {
				"label": "坝街乡",
				"value": "9608",
				"children": []
			}, {
				"label": "羊福乡",
				"value": "9609",
				"children": []
			}, {
				"label": "巫不乡",
				"value": "9610",
				"children": []
			}, {
				"label": "水龙乡",
				"value": "9611",
				"children": []
			}, {
				"label": "塘州乡",
				"value": "9612",
				"children": []
			}, {
				"label": "三洞乡",
				"value": "9613",
				"children": []
			}, {
				"label": "恒丰乡",
				"value": "9614",
				"children": []
			}, {
				"label": "扬拱乡",
				"value": "9615",
				"children": []
			}]
		}]
	}]
}, {
	"label": "云南",
	"value": "25",
	"children": [{
		"label": "昆明市",
		"value": "2235",
		"children": [{
			"label": "东川区",
			"value": "2236",
			"children": [{
				"label": "铜都镇",
				"value": "5515",
				"children": []
			}, {
				"label": "汤丹镇",
				"value": "5516",
				"children": []
			}, {
				"label": "因民镇",
				"value": "5517",
				"children": []
			}, {
				"label": "拖布卡镇",
				"value": "5518",
				"children": []
			}, {
				"label": "红土地镇",
				"value": "5519",
				"children": []
			}, {
				"label": "乌龙镇",
				"value": "5520",
				"children": []
			}, {
				"label": "阿旺镇",
				"value": "5521",
				"children": []
			}, {
				"label": "舍块乡",
				"value": "5522",
				"children": []
			}]
		}, {
			"label": "安宁市",
			"value": "2237",
			"children": [{
				"label": "连然街道",
				"value": "5523",
				"children": []
			}, {
				"label": "八街镇",
				"value": "5524",
				"children": []
			}, {
				"label": "禄脿镇",
				"value": "5525",
				"children": []
			}, {
				"label": "温泉镇",
				"value": "5526",
				"children": []
			}, {
				"label": "青龙镇",
				"value": "5527",
				"children": []
			}, {
				"label": "太平镇",
				"value": "5528",
				"children": []
			}, {
				"label": "草铺镇",
				"value": "5529",
				"children": []
			}, {
				"label": "县街镇",
				"value": "5530",
				"children": []
			}]
		}, {
			"label": "富民县",
			"value": "2238",
			"children": [{
				"label": "永定街道",
				"value": "5531",
				"children": []
			}, {
				"label": "罗免镇",
				"value": "5533",
				"children": []
			}, {
				"label": "赤鹫镇",
				"value": "5534",
				"children": []
			}, {
				"label": "款庄镇",
				"value": "5535",
				"children": []
			}, {
				"label": "东村镇",
				"value": "5536",
				"children": []
			}, {
				"label": "散旦镇",
				"value": "5537",
				"children": []
			}]
		}, {
			"label": "嵩明县",
			"value": "2239",
			"children": [{
				"label": "嵩阳镇",
				"value": "5538",
				"children": []
			}, {
				"label": "杨林镇",
				"value": "5539",
				"children": []
			}, {
				"label": "小街镇",
				"value": "5540",
				"children": []
			}, {
				"label": "牛栏江镇",
				"value": "5541",
				"children": []
			}, {
				"label": "滇源镇",
				"value": "5542",
				"children": []
			}, {
				"label": "阿子营乡",
				"value": "5544",
				"children": []
			}]
		}, {
			"label": "晋宁县",
			"value": "2241",
			"children": [{
				"label": "昆阳镇",
				"value": "5552",
				"children": []
			}, {
				"label": "晋城镇",
				"value": "5553",
				"children": []
			}, {
				"label": "二街镇",
				"value": "5555",
				"children": []
			}, {
				"label": "新街乡",
				"value": "5556",
				"children": []
			}, {
				"label": "双河乡",
				"value": "5557",
				"children": []
			}, {
				"label": "夕阳乡",
				"value": "5558",
				"children": []
			}, {
				"label": "上蒜乡",
				"value": "5559",
				"children": []
			}, {
				"label": "六街乡",
				"value": "5560",
				"children": []
			}]
		}, {
			"label": "宜良县",
			"value": "2242",
			"children": [{
				"label": "匡远镇",
				"value": "5561",
				"children": []
			}, {
				"label": "汤池镇",
				"value": "5562",
				"children": []
			}, {
				"label": "狗街镇",
				"value": "5564",
				"children": []
			}, {
				"label": "北古城镇",
				"value": "5565",
				"children": []
			}, {
				"label": "马街乡",
				"value": "5566",
				"children": []
			}, {
				"label": "竹山乡",
				"value": "5567",
				"children": []
			}, {
				"label": "耿家乡",
				"value": "5568",
				"children": []
			}, {
				"label": "九乡乡",
				"value": "5569",
				"children": []
			}]
		}, {
			"label": "禄劝县",
			"value": "2243",
		}, {
			"label": "石林县",
			"value": "2244",
			"children": [{
				"label": "鹿阜镇",
				"value": "5570",
				"children": []
			}, {
				"label": "石林镇",
				"value": "5571",
				"children": []
			}, {
				"label": "板桥镇",
				"value": "5572",
				"children": []
			}, {
				"label": "圭山镇",
				"value": "5573",
				"children": []
			}, {
				"label": "长湖镇",
				"value": "5574",
				"children": []
			}, {
				"label": "西街口镇",
				"value": "5576",
				"children": []
			}, {
				"label": "大可乡",
				"value": "5577",
				"children": []
			}]
		}, {
			"label": "寻甸县",
			"value": "2245",
			"children": [{
				"label": "仁德镇",
				"value": "5578",
				"children": []
			}, {
				"label": "羊街镇",
				"value": "5580",
				"children": []
			}, {
				"label": "柯渡镇",
				"value": "5581",
				"children": []
			}, {
				"label": "倘甸镇",
				"value": "5582",
				"children": []
			}, {
				"label": "功山镇",
				"value": "5583",
				"children": []
			}, {
				"label": "河口乡",
				"value": "5584",
				"children": []
			}, {
				"label": "七星乡",
				"value": "5585",
				"children": []
			}, {
				"label": "先锋乡",
				"value": "5587",
				"children": []
			}, {
				"label": "六哨乡",
				"value": "5588",
				"children": []
			}, {
				"label": "鸡街乡",
				"value": "5589",
				"children": []
			}, {
				"label": "风仪乡",
				"value": "5590",
				"children": []
			}, {
				"label": "联合乡",
				"value": "5591",
				"children": []
			}, {
				"label": "金源乡",
				"value": "5592",
				"children": []
			}, {
				"label": "甸沙乡",
				"value": "5593",
				"children": []
			}]
		}, {
			"label": "盘龙区",
			"value": "2246",
		}, {
			"label": "五华区",
			"value": "3912",
		}, {
			"label": "官渡区",
			"value": "3913",
		}, {
			"label": "西山区",
			"value": "3914",
		}, {
			"label": "呈贡区",
			"value": "53729",
		}]
	}, {
		"label": "曲靖市",
		"value": "2247",
		"children": [{
			"label": "马龙县",
			"value": "2249",
		}, {
			"label": "宣威市",
			"value": "2250",
		}, {
			"label": "富源县",
			"value": "2251",
		}, {
			"label": "会泽县",
			"value": "2252",
		}, {
			"label": "陆良县",
			"value": "2253",
			"children": [{
				"label": "马街镇",
				"value": "5979",
				"children": []
			}, {
				"label": "小百户镇",
				"value": "5980",
				"children": []
			}, {
				"label": "三岔河镇",
				"value": "5981",
				"children": []
			}, {
				"label": "芳华镇",
				"value": "5982",
				"children": []
			}, {
				"label": "中枢镇",
				"value": "5983",
				"children": []
			}, {
				"label": "大莫古镇",
				"value": "5984",
				"children": []
			}, {
				"label": "活水乡",
				"value": "5985",
				"children": []
			}, {
				"label": "召夸镇",
				"value": "5986",
				"children": []
			}, {
				"label": "板桥镇",
				"value": "5987",
				"children": []
			}, {
				"label": "龙海乡",
				"value": "5988",
				"children": []
			}]
		}, {
			"label": "师宗县",
			"value": "2254",
		}, {
			"label": "罗平县",
			"value": "2255",
		}, {
			"label": "沾益县",
			"value": "2256",
		}, {
			"label": "麒麟区",
			"value": "53730",
		}]
	}, {
		"label": "玉溪市",
		"value": "2258",
		"children": [{
			"label": "红塔区",
			"value": "2259",
			"children": [{
				"label": "玉兴路街道",
				"value": "5989",
				"children": []
			}, {
				"label": "凤凰路街道",
				"value": "5990",
				"children": []
			}, {
				"label": "玉带路街道",
				"value": "5991",
				"children": []
			}, {
				"label": "北城街道",
				"value": "5992",
				"children": []
			}, {
				"label": "春和街道",
				"value": "5993",
				"children": []
			}, {
				"label": "李棋街道",
				"value": "5994",
				"children": []
			}, {
				"label": "大营街街道",
				"value": "5995",
				"children": []
			}, {
				"label": "研和街道",
				"value": "5996",
				"children": []
			}, {
				"label": "高仓街道",
				"value": "5997",
				"children": []
			}, {
				"label": "小石桥乡",
				"value": "5998",
				"children": []
			}, {
				"label": "洛河乡",
				"value": "5999",
				"children": []
			}]
		}, {
			"label": "华宁县",
			"value": "2260",
			"children": [{
				"label": "华溪镇",
				"value": "6563",
				"children": []
			}, {
				"label": "宁州街道",
				"value": "6564",
				"children": []
			}, {
				"label": "盘溪镇",
				"value": "6565",
				"children": []
			}, {
				"label": "青龙镇",
				"value": "6566",
				"children": []
			}, {
				"label": "通红甸乡",
				"value": "6567",
				"children": []
			}]
		}, {
			"label": "澄江县",
			"value": "2261",
			"children": [{
				"label": "凤麓街道",
				"value": "6568",
				"children": []
			}, {
				"label": "海口镇",
				"value": "6569",
				"children": []
			}, {
				"label": "九村镇",
				"value": "6570",
				"children": []
			}, {
				"label": "龙街街道",
				"value": "6571",
				"children": []
			}, {
				"label": "阳宗镇",
				"value": "6572",
				"children": []
			}, {
				"label": "右所镇",
				"value": "6573",
				"children": []
			}]
		}, {
			"label": "易门县",
			"value": "2262",
			"children": [{
				"label": "龙泉街道",
				"value": "6574",
				"children": []
			}, {
				"label": "六街街道",
				"value": "6575",
				"children": []
			}, {
				"label": "绿汁镇",
				"value": "6576",
				"children": []
			}, {
				"label": "浦贝乡",
				"value": "6577",
				"children": []
			}, {
				"label": "十街乡",
				"value": "6578",
				"children": []
			}, {
				"label": "铜厂乡",
				"value": "6579",
				"children": []
			}, {
				"label": "小街乡",
				"value": "6580",
				"children": []
			}]
		}, {
			"label": "通海县",
			"value": "2263",
			"children": [{
				"label": "秀山街道",
				"value": "6581",
				"children": []
			}, {
				"label": "杨广镇",
				"value": "6582",
				"children": []
			}, {
				"label": "河西镇",
				"value": "6583",
				"children": []
			}, {
				"label": "九龙街道",
				"value": "6584",
				"children": []
			}, {
				"label": "纳古镇",
				"value": "6585",
				"children": []
			}, {
				"label": "四街镇",
				"value": "6586",
				"children": []
			}, {
				"label": "高大乡",
				"value": "6587",
				"children": []
			}, {
				"label": "里山乡",
				"value": "6588",
				"children": []
			}, {
				"label": "兴蒙乡",
				"value": "6589",
				"children": []
			}]
		}, {
			"label": "江川县",
			"value": "2264",
			"children": [{
				"label": "大街街道",
				"value": "6590",
				"children": []
			}, {
				"label": "江城镇",
				"value": "6591",
				"children": []
			}, {
				"label": "九溪镇",
				"value": "6592",
				"children": []
			}, {
				"label": "路居镇",
				"value": "6593",
				"children": []
			}, {
				"label": "前卫镇",
				"value": "6594",
				"children": []
			}, {
				"label": "雄关乡",
				"value": "6595",
				"children": []
			}, {
				"label": "安化乡",
				"value": "6596",
				"children": []
			}]
		}, {
			"label": "元江县",
			"value": "2265",
			"children": [{
				"label": "澧江街道",
				"value": "6597",
				"children": []
			}, {
				"label": "红河街道",
				"value": "6598",
				"children": []
			}, {
				"label": "龙潭乡",
				"value": "6599",
				"children": []
			}, {
				"label": "咪哩乡",
				"value": "6600",
				"children": []
			}, {
				"label": "那诺乡",
				"value": "6601",
				"children": []
			}, {
				"label": "甘庄街道",
				"value": "6602",
				"children": []
			}, {
				"label": "洼垤乡",
				"value": "6603",
				"children": []
			}, {
				"label": "曼来镇",
				"value": "6604",
				"children": []
			}, {
				"label": "羊街乡",
				"value": "6605",
				"children": []
			}, {
				"label": "因远镇",
				"value": "6606",
				"children": []
			}]
		}, {
			"label": "新平县",
			"value": "2266",
			"children": [{
				"label": "桂山街道",
				"value": "6607",
				"children": []
			}, {
				"label": "戛洒镇",
				"value": "6608",
				"children": []
			}, {
				"label": "建兴乡",
				"value": "6609",
				"children": []
			}, {
				"label": "老厂乡",
				"value": "6610",
				"children": []
			}, {
				"label": "漠沙镇",
				"value": "6611",
				"children": []
			}, {
				"label": "平甸乡",
				"value": "6612",
				"children": []
			}, {
				"label": "平掌乡",
				"value": "6613",
				"children": []
			}, {
				"label": "水塘镇",
				"value": "6614",
				"children": []
			}, {
				"label": "新化乡",
				"value": "6615",
				"children": []
			}, {
				"label": "扬武镇",
				"value": "6616",
				"children": []
			}, {
				"label": "古城街道",
				"value": "6617",
				"children": []
			}, {
				"label": "者鼋乡",
				"value": "6618",
				"children": []
			}]
		}, {
			"label": "峨山县",
			"value": "2267",
			"children": [{
				"label": "双江街道",
				"value": "6619",
				"children": []
			}, {
				"label": "塔甸镇",
				"value": "6620",
				"children": []
			}, {
				"label": "小街街道",
				"value": "6621",
				"children": []
			}, {
				"label": "甸中镇",
				"value": "6622",
				"children": []
			}, {
				"label": "化念镇",
				"value": "6623",
				"children": []
			}, {
				"label": "岔河乡",
				"value": "6624",
				"children": []
			}, {
				"label": "大龙潭乡",
				"value": "6625",
				"children": []
			}, {
				"label": "富良棚乡",
				"value": "6626",
				"children": []
			}]
		}]
	}, {
		"label": "昭通市",
		"value": "2270",
		"children": [{
			"label": "昭阳区",
			"value": "2271",
		}, {
			"label": "镇雄县",
			"value": "2272",
		}, {
			"label": "永善县",
			"value": "2273",
		}, {
			"label": "大关县",
			"value": "2274",
		}, {
			"label": "盐津县",
			"value": "2275",
		}, {
			"label": "彝良县",
			"value": "2276",
		}, {
			"label": "水富县",
			"value": "2277",
		}, {
			"label": "巧家县",
			"value": "2278",
		}, {
			"label": "威信县",
			"value": "2279",
		}, {
			"label": "鲁甸县",
			"value": "3002",
		}, {
			"label": "绥江县",
			"value": "3003",
		}]
	}, {
		"label": "普洱市",
		"value": "2281",
		"children": [{
			"label": "思茅区",
			"value": "2282",
			"children": [{
				"label": "思茅镇",
				"value": "5959",
				"children": []
			}, {
				"label": "南屏镇",
				"value": "5960",
				"children": []
			}, {
				"label": "倚象镇",
				"value": "5961",
				"children": []
			}, {
				"label": "思茅港镇",
				"value": "5962",
				"children": []
			}, {
				"label": "云仙乡",
				"value": "5963",
				"children": []
			}, {
				"label": "六顺乡",
				"value": "5964",
				"children": []
			}, {
				"label": "龙潭乡",
				"value": "5965",
				"children": []
			}, {
				"label": "曼昔农场",
				"value": "5966",
				"children": []
			}, {
				"label": "思茅农场",
				"value": "5967",
				"children": []
			}]
		}, {
			"label": "宁洱县",
			"value": "2283",
		}, {
			"label": "景东县",
			"value": "2284",
		}, {
			"label": "镇沅县",
			"value": "2285",
		}, {
			"label": "景谷县",
			"value": "2286",
		}, {
			"label": "墨江县",
			"value": "2287",
		}, {
			"label": "澜沧县",
			"value": "2288",
		}, {
			"label": "西盟县",
			"value": "2289",
		}, {
			"label": "江城县",
			"value": "2290",
		}, {
			"label": "孟连县",
			"value": "2958",
		}]
	}, {
		"label": "临沧市",
		"value": "2291",
		"children": [{
			"label": "临翔区",
			"value": "2292",
		}, {
			"label": "镇康县",
			"value": "2293",
		}, {
			"label": "凤庆县",
			"value": "2294",
		}, {
			"label": "云县",
			"value": "2295",
		}, {
			"label": "永德县",
			"value": "2296",
		}, {
			"label": "耿马县",
			"value": "2297",
		}, {
			"label": "双江县",
			"value": "3915",
		}, {
			"label": "沧源县",
			"value": "3916",
		}]
	}, {
		"label": "保山市",
		"value": "2298",
		"children": [{
			"label": "隆阳区",
			"value": "2299",
			"children": [{
				"label": "永昌街道",
				"value": "5918",
				"children": []
			}, {
				"label": "兰城街道",
				"value": "5919",
				"children": []
			}, {
				"label": "板桥镇",
				"value": "5920",
				"children": []
			}, {
				"label": "河图镇",
				"value": "5921",
				"children": []
			}, {
				"label": "汉庄镇",
				"value": "5922",
				"children": []
			}, {
				"label": "蒲缥镇",
				"value": "5923",
				"children": []
			}, {
				"label": "瓦窑镇",
				"value": "5924",
				"children": []
			}, {
				"label": "潞江镇",
				"value": "5925",
				"children": []
			}, {
				"label": "金鸡乡",
				"value": "5926",
				"children": []
			}, {
				"label": "辛街乡",
				"value": "5927",
				"children": []
			}, {
				"label": "西邑乡",
				"value": "5928",
				"children": []
			}, {
				"label": "丙麻乡",
				"value": "5929",
				"children": []
			}, {
				"label": "瓦渡乡",
				"value": "5930",
				"children": []
			}, {
				"label": "水寨乡",
				"value": "5931",
				"children": []
			}, {
				"label": "瓦马乡",
				"value": "5932",
				"children": []
			}, {
				"label": "瓦房乡",
				"value": "5933",
				"children": []
			}, {
				"label": "杨柳乡",
				"value": "5934",
				"children": []
			}, {
				"label": "芒宽乡",
				"value": "5935",
				"children": []
			}]
		}, {
			"label": "施甸县",
			"value": "2300",
		}, {
			"label": "昌宁县",
			"value": "2301",
		}, {
			"label": "龙陵县",
			"value": "2302",
		}, {
			"label": "腾冲市",
			"value": "2303",
		}]
	}, {
		"label": "丽江市",
		"value": "2304",
		"children": [{
			"label": "玉龙县",
			"value": "2305",
		}, {
			"label": "华坪县",
			"value": "2306",
		}, {
			"label": "永胜县",
			"value": "2307",
		}, {
			"label": "宁蒗县",
			"value": "2308",
		}, {
			"label": "古城区",
			"value": "53731",
		}]
	}, {
		"label": "文山州",
		"value": "2309",
		"children": [{
			"label": "文山市",
			"value": "2310",
		}, {
			"label": "麻栗坡县",
			"value": "2311",
		}, {
			"label": "砚山县",
			"value": "2312",
		}, {
			"label": "广南县",
			"value": "2313",
		}, {
			"label": "马关县",
			"value": "2314",
		}, {
			"label": "富宁县",
			"value": "2315",
		}, {
			"label": "西畴县",
			"value": "2316",
		}, {
			"label": "丘北县",
			"value": "2317",
		}]
	}, {
		"label": "红河州",
		"value": "2318",
		"children": [{
			"label": "个旧市",
			"value": "2319",
		}, {
			"label": "开远市",
			"value": "2320",
			"children": [{
				"label": "乐百道街道",
				"value": "5911",
				"children": []
			}, {
				"label": "灵泉街道",
				"value": "5912",
				"children": []
			}, {
				"label": "小龙潭镇",
				"value": "5913",
				"children": []
			}, {
				"label": "中和营镇",
				"value": "5914",
				"children": []
			}, {
				"label": "大庄乡",
				"value": "5915",
				"children": []
			}, {
				"label": "羊街乡",
				"value": "5916",
				"children": []
			}, {
				"label": "碑格乡",
				"value": "5917",
				"children": []
			}]
		}, {
			"label": "弥勒县",
			"value": "2321",
		}, {
			"label": "红河县",
			"value": "2322",
		}, {
			"label": "绿春县",
			"value": "2323",
		}, {
			"label": "蒙自市",
			"value": "2324",
			"children": [{
				"label": "文澜镇",
				"value": "5948",
				"children": []
			}, {
				"label": "草坝镇",
				"value": "5949",
				"children": []
			}, {
				"label": "雨过铺镇",
				"value": "5950",
				"children": []
			}, {
				"label": "新安所镇",
				"value": "5951",
				"children": []
			}, {
				"label": "芷村镇",
				"value": "5952",
				"children": []
			}, {
				"label": "鸣鹫镇",
				"value": "5953",
				"children": []
			}, {
				"label": "冷泉镇",
				"value": "5954",
				"children": []
			}, {
				"label": "期路白乡",
				"value": "5955",
				"children": []
			}, {
				"label": "老寨乡",
				"value": "5956",
				"children": []
			}, {
				"label": "水田乡",
				"value": "5957",
				"children": []
			}, {
				"label": "西北勒乡",
				"value": "5958",
				"children": []
			}]
		}, {
			"label": "泸西县",
			"value": "2325",
		}, {
			"label": "建水县",
			"value": "2326",
		}, {
			"label": "元阳县",
			"value": "2327",
		}, {
			"label": "石屏县",
			"value": "2328",
		}, {
			"label": "金平县",
			"value": "2329",
		}, {
			"label": "屏边县",
			"value": "2330",
		}, {
			"label": "河口县",
			"value": "2331",
		}]
	}, {
		"label": "西双版纳州",
		"value": "2332",
		"children": [{
			"label": "景洪市",
			"value": "2333",
		}, {
			"label": "勐海县",
			"value": "2334",
		}, {
			"label": "勐腊县",
			"value": "2335",
		}]
	}, {
		"label": "楚雄州",
		"value": "2336",
		"children": [{
			"label": "元谋县",
			"value": "2338",
		}, {
			"label": "南华县",
			"value": "2339",
		}, {
			"label": "牟定县",
			"value": "2340",
		}, {
			"label": "武定县",
			"value": "2341",
		}, {
			"label": "大姚县",
			"value": "2342",
		}, {
			"label": "双柏县",
			"value": "2343",
		}, {
			"label": "禄丰县",
			"value": "2344",
		}, {
			"label": "永仁县",
			"value": "2345",
		}, {
			"label": "姚安县",
			"value": "3917",
		}, {
			"label": "楚雄市",
			"value": "53732",
		}]
	}, {
		"label": "大理州",
		"value": "2347",
		"children": [{
			"label": "剑川县",
			"value": "2349",
		}, {
			"label": "弥渡县",
			"value": "2350",
		}, {
			"label": "云龙县",
			"value": "2351",
		}, {
			"label": "洱源县",
			"value": "2352",
		}, {
			"label": "鹤庆县",
			"value": "2353",
		}, {
			"label": "宾川县",
			"value": "2354",
		}, {
			"label": "祥云县",
			"value": "2355",
		}, {
			"label": "永平县",
			"value": "2356",
		}, {
			"label": "巍山县",
			"value": "2357",
		}, {
			"label": "漾濞县",
			"value": "2358",
		}, {
			"label": "南涧县",
			"value": "2359",
		}, {
			"label": "大理市",
			"value": "53733",
		}]
	}, {
		"label": "德宏州",
		"value": "2360",
		"children": [{
			"label": "芒市",
			"value": "2361",
			"children": [{
				"label": "遮放镇",
				"value": "5937",
				"children": []
			}, {
				"label": "芒市镇",
				"value": "5938",
				"children": []
			}, {
				"label": "风平镇",
				"value": "5939",
				"children": []
			}, {
				"label": "勐戛镇",
				"value": "5940",
				"children": []
			}, {
				"label": "西山乡",
				"value": "5941",
				"children": []
			}, {
				"label": "中山乡",
				"value": "5942",
				"children": []
			}, {
				"label": "芒海镇",
				"value": "5943",
				"children": []
			}, {
				"label": "江东乡",
				"value": "5944",
				"children": []
			}, {
				"label": "五岔路乡",
				"value": "5945",
				"children": []
			}, {
				"label": "三台山乡",
				"value": "5946",
				"children": []
			}, {
				"label": "轩岗乡",
				"value": "5947",
				"children": []
			}]
		}, {
			"label": "瑞丽市",
			"value": "2362",
		}, {
			"label": "盈江县",
			"value": "2363",
		}, {
			"label": "梁河县",
			"value": "2364",
		}, {
			"label": "陇川县",
			"value": "2365",
		}]
	}, {
		"label": "怒江州",
		"value": "2366",
		"children": [{
			"label": "泸水县",
			"value": "2367",
		}, {
			"label": "福贡县",
			"value": "2368",
		}, {
			"label": "兰坪县",
			"value": "2369",
		}, {
			"label": "贡山县",
			"value": "2370",
		}]
	}, {
		"label": "迪庆州",
		"value": "4108",
		"children": [{
			"label": "香格里拉县",
			"value": "6823",
		}, {
			"label": "德钦县",
			"value": "6824",
		}, {
			"label": "维西县",
			"value": "6825",
		}]
	}]
}, {
	"label": "西藏",
	"value": "26",
	"children": [{
		"label": "拉萨市",
		"value": "2951",
		"children": [{
			"label": "城关区",
			"value": "2952",
		}, {
			"label": "林周县",
			"value": "3123",
		}, {
			"label": "当雄县",
			"value": "3918",
		}, {
			"label": "尼木县",
			"value": "3919",
		}, {
			"label": "曲水县",
			"value": "3920",
		}, {
			"label": "堆龙德庆县",
			"value": "3921",
		}, {
			"label": "达孜县",
			"value": "3922",
		}, {
			"label": "墨竹工卡县",
			"value": "3923",
		}]
	}, {
		"label": "那曲地区",
		"value": "3107",
		"children": [{
			"label": "索县",
			"value": "3108",
		}, {
			"label": "那曲县",
			"value": "3961",
		}, {
			"label": "嘉黎县",
			"value": "3962",
		}, {
			"label": "比如县",
			"value": "3963",
		}, {
			"label": "聂荣县",
			"value": "3964",
		}, {
			"label": "安多县",
			"value": "3965",
		}, {
			"label": "申扎县",
			"value": "3966",
		}, {
			"label": "班戈县",
			"value": "3967",
		}, {
			"label": "巴青县",
			"value": "3968",
		}, {
			"label": "尼玛县",
			"value": "3969",
		}, {
			"label": "双湖县",
			"value": "53734",
		}]
	}, {
		"label": "山南地区",
		"value": "3129",
		"children": [{
			"label": "贡嘎县",
			"value": "3130",
		}, {
			"label": "扎囊县",
			"value": "3934",
		}, {
			"label": "乃东县",
			"value": "3935",
		}, {
			"label": "桑日县",
			"value": "3936",
		}, {
			"label": "琼结县",
			"value": "3937",
		}, {
			"label": "曲松县",
			"value": "3938",
		}, {
			"label": "措美县",
			"value": "3939",
		}, {
			"label": "洛扎县",
			"value": "3940",
		}, {
			"label": "加查县",
			"value": "3941",
		}, {
			"label": "隆子县",
			"value": "3942",
		}, {
			"label": "错那县",
			"value": "3943",
		}, {
			"label": "浪卡子县",
			"value": "3944",
		}]
	}, {
		"label": "昌都地区",
		"value": "3138",
		"children": [{
			"label": "昌都县",
			"value": "3139",
		}, {
			"label": "江达县",
			"value": "3924",
		}, {
			"label": "贡觉县",
			"value": "3925",
		}, {
			"label": "类乌齐县",
			"value": "3926",
		}, {
			"label": "丁青县",
			"value": "3927",
		}, {
			"label": "察雅县",
			"value": "3928",
		}, {
			"label": "八宿县",
			"value": "3929",
		}, {
			"label": "左贡县",
			"value": "3930",
		}, {
			"label": "芒康县",
			"value": "3931",
		}, {
			"label": "洛隆县",
			"value": "3932",
		}, {
			"label": "边坝县",
			"value": "3933",
		}]
	}, {
		"label": "日喀则地区",
		"value": "3144",
		"children": [{
			"label": "聂拉木县",
			"value": "3160",
		}, {
			"label": "昂仁县",
			"value": "3166",
		}, {
			"label": "日喀则市",
			"value": "3945",
		}, {
			"label": "南木林县",
			"value": "3946",
		}, {
			"label": "江孜县",
			"value": "3947",
		}, {
			"label": "定日县",
			"value": "3948",
		}, {
			"label": "萨迦县",
			"value": "3949",
		}, {
			"label": "拉孜县",
			"value": "3950",
		}, {
			"label": "谢通门县",
			"value": "3951",
		}, {
			"label": "白朗县",
			"value": "3952",
		}, {
			"label": "仁布县",
			"value": "3953",
		}, {
			"label": "康马县",
			"value": "3954",
		}, {
			"label": "定结县",
			"value": "3955",
		}, {
			"label": "仲巴县",
			"value": "3956",
		}, {
			"label": "亚东县",
			"value": "3957",
		}, {
			"label": "吉隆县",
			"value": "3958",
		}, {
			"label": "萨嘎县",
			"value": "3959",
		}, {
			"label": "岗巴县",
			"value": "3960",
		}]
	}, {
		"label": "阿里地区",
		"value": "3970",
		"children": [{
			"label": "噶尔县",
			"value": "3972",
		}, {
			"label": "普兰县",
			"value": "3973",
		}, {
			"label": "札达县",
			"value": "3974",
		}, {
			"label": "日土县",
			"value": "3975",
		}, {
			"label": "革吉县",
			"value": "3976",
		}, {
			"label": "改则县",
			"value": "3977",
		}, {
			"label": "措勤县",
			"value": "3978",
		}]
	}, {
		"label": "林芝市",
		"value": "3971",
		"children": [{
			"label": "巴宜区",
			"value": "3979",
		}, {
			"label": "工布江达县",
			"value": "3980",
		}, {
			"label": "米林县",
			"value": "3981",
		}, {
			"label": "墨脱县",
			"value": "3982",
		}, {
			"label": "波密县",
			"value": "3983",
		}, {
			"label": "察隅县",
			"value": "3984",
		}, {
			"label": "朗县",
			"value": "3985",
		}]
	}]
}, {
	"label": "陕西",
	"value": "27",
	"children": [{
		"label": "西安市",
		"value": "2376",
		"children": [{
			"label": "高陵县",
			"value": "2380",
		}, {
			"label": "蓝田县",
			"value": "2381",
		}, {
			"label": "户县",
			"value": "2382",
		}, {
			"label": "周至县",
			"value": "2383",
		}, {
			"label": "雁塔区",
			"value": "4343",
		}, {
			"label": "未央区",
			"value": "53735",
		}, {
			"label": "长安区",
			"value": "53736",
		}, {
			"label": "灞桥区",
			"value": "53737",
		}, {
			"label": "碑林区",
			"value": "53738",
		}, {
			"label": "莲湖区",
			"value": "53739",
		}, {
			"label": "临潼区",
			"value": "53740",
		}, {
			"label": "阎良区",
			"value": "53741",
		}, {
			"label": "新城区",
			"value": "53742",
		}, {
			"label": "西安武警工程学院",
			"value": "53743",
		}]
	}, {
		"label": "铜川市",
		"value": "2386",
		"children": [{
			"label": "印台区",
			"value": "2387",
		}, {
			"label": "宜君县",
			"value": "2388",
		}, {
			"label": "王益区",
			"value": "2389",
		}, {
			"label": "耀州区",
			"value": "3989",
		}]
	}, {
		"label": "宝鸡市",
		"value": "2390",
		"children": [{
			"label": "岐山县",
			"value": "2392",
		}, {
			"label": "太白县",
			"value": "2393",
		}, {
			"label": "凤翔县",
			"value": "2394",
		}, {
			"label": "陇县",
			"value": "2395",
		}, {
			"label": "麟游县",
			"value": "2396",
		}, {
			"label": "千阳县",
			"value": "2397",
		}, {
			"label": "扶风县",
			"value": "2398",
		}, {
			"label": "凤县",
			"value": "2399",
		}, {
			"label": "眉县",
			"value": "2400",
		}, {
			"label": "渭滨区",
			"value": "2401",
		}, {
			"label": "金台区",
			"value": "3990",
		}, {
			"label": "陈仓区",
			"value": "53744",
		}]
	}, {
		"label": "咸阳市",
		"value": "2402",
		"children": [{
			"label": "兴平市",
			"value": "2403",
		}, {
			"label": "礼泉县",
			"value": "2404",
		}, {
			"label": "泾阳县",
			"value": "2405",
		}, {
			"label": "永寿县",
			"value": "2406",
		}, {
			"label": "三原县",
			"value": "2407",
		}, {
			"label": "彬县",
			"value": "2408",
		}, {
			"label": "旬邑县",
			"value": "2409",
		}, {
			"label": "长武县",
			"value": "2411",
		}, {
			"label": "乾县",
			"value": "2412",
		}, {
			"label": "武功县",
			"value": "2413",
		}, {
			"label": "淳化县",
			"value": "2414",
		}, {
			"label": "秦都区",
			"value": "53745",
		}, {
			"label": "渭城区",
			"value": "53746",
		}, {
			"label": "杨陵区",
			"value": "53747",
		}]
	}, {
		"label": "渭南市",
		"value": "2416",
		"children": [{
			"label": "韩城市",
			"value": "2417",
		}, {
			"label": "华阴市",
			"value": "2418",
		}, {
			"label": "蒲城县",
			"value": "2419",
		}, {
			"label": "华县",
			"value": "2420",
		}, {
			"label": "潼关县",
			"value": "2421",
		}, {
			"label": "大荔县",
			"value": "2422",
		}, {
			"label": "澄城县",
			"value": "2423",
		}, {
			"label": "合阳县",
			"value": "2424",
		}, {
			"label": "白水县",
			"value": "2425",
		}, {
			"label": "富平县",
			"value": "2426",
		}, {
			"label": "临渭区",
			"value": "53748",
		}]
	}, {
		"label": "延安市",
		"value": "2428",
		"children": [{
			"label": "安塞县",
			"value": "2429",
		}, {
			"label": "洛川县",
			"value": "2430",
		}, {
			"label": "子长县",
			"value": "2431",
		}, {
			"label": "黄陵县",
			"value": "2432",
		}, {
			"label": "延长县",
			"value": "2433",
		}, {
			"label": "宜川县",
			"value": "2434",
		}, {
			"label": "延川县",
			"value": "2435",
		}, {
			"label": "甘泉县",
			"value": "2436",
		}, {
			"label": "富县",
			"value": "2437",
		}, {
			"label": "志丹县",
			"value": "2438",
		}, {
			"label": "黄龙县",
			"value": "2439",
		}, {
			"label": "吴起县",
			"value": "2440",
		}, {
			"label": "宝塔区",
			"value": "53749",
		}]
	}, {
		"label": "汉中市",
		"value": "2442",
		"children": [{
			"label": "南郑县",
			"value": "2443",
		}, {
			"label": "城固县",
			"value": "2444",
		}, {
			"label": "洋县",
			"value": "2445",
		}, {
			"label": "佛坪县",
			"value": "2446",
		}, {
			"label": "留坝县",
			"value": "2447",
		}, {
			"label": "镇巴县",
			"value": "2448",
		}, {
			"label": "西乡县",
			"value": "2449",
		}, {
			"label": "勉县",
			"value": "2450",
		}, {
			"label": "略阳县",
			"value": "2451",
		}, {
			"label": "宁强县",
			"value": "2452",
		}, {
			"label": "汉台区",
			"value": "53750",
		}, {
			"label": "经济开发区南区",
			"value": "53751",
		}]
	}, {
		"label": "榆林市",
		"value": "2454",
		"children": [{
			"label": "清涧县",
			"value": "2456",
		}, {
			"label": "绥德县",
			"value": "2457",
		}, {
			"label": "佳县",
			"value": "2459",
		}, {
			"label": "神木县",
			"value": "2460",
		}, {
			"label": "府谷县",
			"value": "2461",
		}, {
			"label": "子洲县",
			"value": "2462",
		}, {
			"label": "横山县",
			"value": "2464",
		}, {
			"label": "米脂县",
			"value": "2465",
		}, {
			"label": "吴堡县",
			"value": "2466",
		}, {
			"label": "定边县",
			"value": "2467",
		}, {
			"label": "靖边县",
			"value": "4081",
		}, {
			"label": "榆阳区",
			"value": "53752",
		}]
	}, {
		"label": "商洛市",
		"value": "2468",
		"children": [{
			"label": "商州区",
			"value": "2469",
		}, {
			"label": "镇安县",
			"value": "2470",
		}, {
			"label": "山阳县",
			"value": "2471",
		}, {
			"label": "洛南县",
			"value": "2472",
		}, {
			"label": "商南县",
			"value": "2473",
		}, {
			"label": "丹凤县",
			"value": "2474",
		}, {
			"label": "柞水县",
			"value": "2475",
		}]
	}, {
		"label": "安康市",
		"value": "2476",
		"children": [{
			"label": "紫阳县",
			"value": "2478",
		}, {
			"label": "岚皋县",
			"value": "2479",
		}, {
			"label": "旬阳县",
			"value": "2480",
		}, {
			"label": "镇坪县",
			"value": "2481",
		}, {
			"label": "平利县",
			"value": "2482",
		}, {
			"label": "宁陕县",
			"value": "2483",
		}, {
			"label": "汉阴县",
			"value": "2484",
		}, {
			"label": "石泉县",
			"value": "2485",
		}, {
			"label": "白河县",
			"value": "2486",
		}, {
			"label": "汉滨区",
			"value": "3993",
		}]
	}]
}, {
	"label": "甘肃",
	"value": "28",
	"children": [{
		"label": "兰州市",
		"value": "2487",
		"children": [{
			"label": "永登县",
			"value": "2488",
		}, {
			"label": "榆中县",
			"value": "2489",
		}, {
			"label": "皋兰县",
			"value": "2490",
		}, {
			"label": "西固区",
			"value": "3995",
		}, {
			"label": "红古区",
			"value": "3997",
		}, {
			"label": "七里河区",
			"value": "53753",
		}, {
			"label": "安宁区",
			"value": "53754",
		}, {
			"label": "城关区",
			"value": "53755",
		}]
	}, {
		"label": "金昌市",
		"value": "2492",
		"children": [{
			"label": "永昌县",
			"value": "2493",
		}, {
			"label": "金川区",
			"value": "2494",
		}]
	}, {
		"label": "白银市",
		"value": "2495",
		"children": [{
			"label": "白银区",
			"value": "2496",
		}, {
			"label": "平川区",
			"value": "2497",
		}, {
			"label": "靖远县",
			"value": "2498",
		}, {
			"label": "景泰县",
			"value": "2499",
		}, {
			"label": "会宁县",
			"value": "2500",
		}]
	}, {
		"label": "天水市",
		"value": "2501",
		"children": [{
			"label": "甘谷县",
			"value": "2504",
		}, {
			"label": "武山县",
			"value": "2505",
		}, {
			"label": "清水县",
			"value": "2506",
		}, {
			"label": "秦安县",
			"value": "2507",
		}, {
			"label": "张家川县",
			"value": "2508",
		}, {
			"label": "麦积区",
			"value": "53756",
		}, {
			"label": "秦州区",
			"value": "53757",
		}]
	}, {
		"label": "嘉峪关市",
		"value": "2509",
		"children": [{
			"label": "雄关区",
			"value": "2970",
		}, {
			"label": "长城区",
			"value": "53758",
		}, {
			"label": "镜铁区",
			"value": "53759",
		}]
	}, {
		"label": "平凉市",
		"value": "2518",
		"children": [{
			"label": "华亭县",
			"value": "2519",
		}, {
			"label": "崇信县",
			"value": "2520",
		}, {
			"label": "泾川县",
			"value": "2521",
		}, {
			"label": "灵台县",
			"value": "2522",
		}, {
			"label": "镇原县",
			"value": "2523",
		}, {
			"label": "庄浪县",
			"value": "2524",
		}, {
			"label": "崆峒区",
			"value": "3023",
		}, {
			"label": "静宁县",
			"value": "3998",
		}]
	}, {
		"label": "庆阳市",
		"value": "2525",
		"children": [{
			"label": "西峰区",
			"value": "2526",
		}, {
			"label": "镇原县",
			"value": "2528",
		}, {
			"label": "合水县",
			"value": "2529",
		}, {
			"label": "华池县",
			"value": "2530",
		}, {
			"label": "环县",
			"value": "2531",
		}, {
			"label": "宁县",
			"value": "2532",
		}, {
			"label": "正宁县",
			"value": "2533",
		}, {
			"label": "庆城县",
			"value": "4001",
		}]
	}, {
		"label": "陇南市",
		"value": "2534",
		"children": [{
			"label": "成县",
			"value": "2535",
		}, {
			"label": "礼县",
			"value": "2536",
		}, {
			"label": "康县",
			"value": "2537",
		}, {
			"label": "武都区",
			"value": "2538",
		}, {
			"label": "文县",
			"value": "2539",
		}, {
			"label": "两当县",
			"value": "2540",
		}, {
			"label": "徽县",
			"value": "2541",
		}, {
			"label": "宕昌县",
			"value": "2542",
		}, {
			"label": "西和县",
			"value": "2543",
		}]
	}, {
		"label": "武威市",
		"value": "2544",
		"children": [{
			"label": "凉州区",
			"value": "2545",
		}, {
			"label": "古浪县",
			"value": "2546",
		}, {
			"label": "天祝县",
			"value": "2547",
		}, {
			"label": "民勤县",
			"value": "2548",
		}]
	}, {
		"label": "张掖市",
		"value": "2549",
		"children": [{
			"label": "甘州区",
			"value": "2550",
		}, {
			"label": "山丹县",
			"value": "2551",
		}, {
			"label": "临泽县",
			"value": "2552",
		}, {
			"label": "高台县",
			"value": "2553",
		}, {
			"label": "肃南县",
			"value": "2554",
		}, {
			"label": "民乐县",
			"value": "2555",
		}]
	}, {
		"label": "酒泉市",
		"value": "2556",
		"children": [{
			"label": "玉门市",
			"value": "2558",
		}, {
			"label": "敦煌市",
			"value": "2559",
		}, {
			"label": "金塔县",
			"value": "2560",
		}, {
			"label": "阿克塞县",
			"value": "2562",
		}, {
			"label": "肃北县",
			"value": "2563",
		}, {
			"label": "瓜州县",
			"value": "3999",
		}, {
			"label": "肃州区",
			"value": "4000",
		}]
	}, {
		"label": "甘南州",
		"value": "2564",
		"children": [{
			"label": "合作市",
			"value": "2565",
		}, {
			"label": "夏河县",
			"value": "2566",
		}, {
			"label": "碌曲县",
			"value": "2567",
		}, {
			"label": "舟曲县",
			"value": "2568",
		}, {
			"label": "玛曲县",
			"value": "2569",
		}, {
			"label": "迭部县",
			"value": "2570",
		}, {
			"label": "临潭县",
			"value": "2571",
		}, {
			"label": "卓尼县",
			"value": "2572",
		}]
	}, {
		"label": "临夏州",
		"value": "2573",
		"children": [{
			"label": "临夏县",
			"value": "2574",
		}, {
			"label": "康乐县",
			"value": "2575",
		}, {
			"label": "永靖县",
			"value": "2576",
		}, {
			"label": "和政县",
			"value": "2577",
		}, {
			"label": "东乡族自治县",
			"value": "2578",
		}, {
			"label": "积石山县",
			"value": "2579",
		}, {
			"label": "临夏市",
			"value": "3175",
		}, {
			"label": "广河县",
			"value": "4008",
		}]
	}, {
		"label": "定西市",
		"value": "3080",
		"children": [{
			"label": "岷县",
			"value": "3081",
		}, {
			"label": "安定区",
			"value": "4002",
		}, {
			"label": "通渭县",
			"value": "4003",
		}, {
			"label": "临洮县",
			"value": "4004",
		}, {
			"label": "漳县",
			"value": "4005",
		}, {
			"label": "渭源县",
			"value": "4006",
		}, {
			"label": "陇西县",
			"value": "4007",
		}]
	}]
}, {
	"label": "青海",
	"value": "29",
	"children": [{
		"label": "西宁市",
		"value": "2580",
		"children": [{
			"label": "湟中县",
			"value": "2581",
		}, {
			"label": "湟源县",
			"value": "2582",
		}, {
			"label": "大通县",
			"value": "2583",
		}, {
			"label": "城中区",
			"value": "53760",
		}, {
			"label": "城东区",
			"value": "53761",
		}, {
			"label": "城西区",
			"value": "53762",
		}, {
			"label": "城北区",
			"value": "53763",
		}]
	}, {
		"label": "海东地区",
		"value": "2585",
		"children": [{
			"label": "平安县",
			"value": "2586",
		}, {
			"label": "乐都县",
			"value": "2587",
		}, {
			"label": "民和县",
			"value": "2588",
		}, {
			"label": "互助县",
			"value": "2589",
		}, {
			"label": "化隆县",
			"value": "2590",
		}, {
			"label": "循化县",
			"value": "2591",
		}]
	}, {
		"label": "海北州",
		"value": "2592",
		"children": [{
			"label": "海晏县",
			"value": "2593",
		}, {
			"label": "祁连县",
			"value": "2594",
		}, {
			"label": "刚察县",
			"value": "2595",
		}, {
			"label": "门源县",
			"value": "2596",
		}]
	}, {
		"label": "黄南州",
		"value": "2597",
		"children": [{
			"label": "尖扎县",
			"value": "2598",
		}, {
			"label": "同仁县",
			"value": "2599",
		}, {
			"label": "泽库县",
			"value": "2600",
		}, {
			"label": "河南县",
			"value": "2602",
		}]
	}, {
		"label": "海南州",
		"value": "2603",
		"children": [{
			"label": "共和县",
			"value": "4012",
		}, {
			"label": "同德县",
			"value": "4013",
		}, {
			"label": "贵德县",
			"value": "4014",
		}, {
			"label": "兴海县",
			"value": "4015",
		}, {
			"label": "贵南县",
			"value": "4016",
		}]
	}, {
		"label": "果洛州",
		"value": "2605",
		"children": [{
			"label": "玛沁县",
			"value": "2606",
		}, {
			"label": "甘德县",
			"value": "2607",
		}, {
			"label": "达日县",
			"value": "2608",
		}, {
			"label": "班玛县",
			"value": "2609",
		}, {
			"label": "久治县",
			"value": "2610",
		}, {
			"label": "玛多县",
			"value": "2611",
		}]
	}, {
		"label": "玉树州",
		"value": "2612",
		"children": [{
			"label": "玉树县",
			"value": "2613",
		}, {
			"label": "称多县",
			"value": "2614",
		}, {
			"label": "囊谦县",
			"value": "2615",
		}, {
			"label": "杂多县",
			"value": "2616",
		}, {
			"label": "治多县",
			"value": "2617",
		}, {
			"label": "曲麻莱县",
			"value": "2618",
		}]
	}, {
		"label": "海西州",
		"value": "2620",
		"children": [{
			"label": "德令哈市",
			"value": "2621",
		}, {
			"label": "乌兰县",
			"value": "2622",
		}, {
			"label": "天峻县",
			"value": "2623",
		}, {
			"label": "都兰县",
			"value": "2624",
		}, {
			"label": "大柴旦行委",
			"value": "2625",
		}, {
			"label": "冷湖行委",
			"value": "2626",
		}, {
			"label": "茫崖行委",
			"value": "2627",
		}, {
			"label": "格尔木市",
			"value": "3021",
		}]
	}]
}, {
	"label": "宁夏",
	"value": "30",
	"children": [{
		"label": "银川市",
		"value": "2628",
		"children": [{
			"label": "灵武市",
			"value": "2629",
		}, {
			"label": "永宁县",
			"value": "2630",
		}, {
			"label": "贺兰县",
			"value": "2631",
		}, {
			"label": "兴庆区",
			"value": "53764",
		}, {
			"label": "金凤区",
			"value": "53765",
		}, {
			"label": "西夏区",
			"value": "53766",
		}]
	}, {
		"label": "石嘴山市",
		"value": "2632",
		"children": [{
			"label": "平罗县",
			"value": "2633",
		}, {
			"label": "惠农区",
			"value": "2635",
		}, {
			"label": "大武口区",
			"value": "2636",
		}]
	}, {
		"label": "吴忠市",
		"value": "2637",
		"children": [{
			"label": "青铜峡市",
			"value": "2638",
		}, {
			"label": "同心县",
			"value": "2641",
		}, {
			"label": "盐池县",
			"value": "2642",
		}, {
			"label": "红寺堡开发区",
			"value": "2643",
		}, {
			"label": "利通区",
			"value": "2966",
		}]
	}, {
		"label": "固原市",
		"value": "2644",
		"children": [{
			"label": "西吉县",
			"value": "2647",
		}, {
			"label": "隆德县",
			"value": "2648",
		}, {
			"label": "泾源县",
			"value": "2649",
		}, {
			"label": "彭阳县",
			"value": "2650",
		}, {
			"label": "原州区",
			"value": "2651",
		}]
	}, {
		"label": "中卫市",
		"value": "3071",
		"children": [{
			"label": "中宁县",
			"value": "3072",
		}, {
			"label": "海原县",
			"value": "3148",
		}, {
			"label": "沙坡头区",
			"value": "4020",
		}]
	}]
}, {
	"label": "新疆",
	"value": "31",
	"children": [{
		"label": "乌鲁木齐市",
		"value": "2652",
		"children": [{
			"label": "乌鲁木齐县",
			"value": "2653",
		}, {
			"label": "头屯河区",
			"value": "4024",
		}, {
			"label": "达坂城区",
			"value": "4025",
		}, {
			"label": "米东区",
			"value": "4026",
		}, {
			"label": "天山区",
			"value": "53767",
		}, {
			"label": "新市区",
			"value": "53768",
		}, {
			"label": "沙依巴克区",
			"value": "53769",
		}, {
			"label": "水磨沟区",
			"value": "53770",
		}]
	}, {
		"label": "克拉玛依市",
		"value": "2654",
		"children": [{
			"label": "克拉玛依区",
			"value": "2655",
			"children": [{
				"label": "克拉玛依区",
				"value": "53771",
				"children": []
			}, {
				"label": "独山子区",
				"value": "53772",
				"children": []
			}, {
				"label": "白碱滩区",
				"value": "53773",
				"children": []
			}, {
				"label": "乌尔禾区",
				"value": "53774",
				"children": []
			}]
		}, {
			"label": "独山子区",
			"value": "2930",
		}, {
			"label": "白碱滩区",
			"value": "3006",
		}, {
			"label": "乌尔禾区",
			"value": "4027",
		}]
	}, {
		"label": "石河子市",
		"value": "2656",
		"children": [{
			"label": "石河子市",
			"value": "2657",
		}]
	}, {
		"label": "吐鲁番地区",
		"value": "2658",
		"children": [{
			"label": "吐鲁番市",
			"value": "2659",
		}, {
			"label": "托克逊县",
			"value": "2660",
		}, {
			"label": "鄯善县",
			"value": "2661",
		}]
	}, {
		"label": "哈密地区",
		"value": "2662",
		"children": [{
			"label": "哈密市",
			"value": "2663",
		}, {
			"label": "巴里坤县",
			"value": "2664",
		}, {
			"label": "伊吾县",
			"value": "2665",
		}]
	}, {
		"label": "和田地区",
		"value": "2666",
		"children": [{
			"label": "和田市",
			"value": "2667",
		}, {
			"label": "墨玉县",
			"value": "2669",
		}, {
			"label": "洛浦县",
			"value": "2670",
		}, {
			"label": "策勒县",
			"value": "2671",
		}, {
			"label": "于田县",
			"value": "2672",
		}, {
			"label": "民丰县",
			"value": "2673",
		}, {
			"label": "皮山县",
			"value": "2674",
		}, {
			"label": "和田县",
			"value": "53775",
		}]
	}, {
		"label": "阿克苏地区",
		"value": "2675",
		"children": [{
			"label": "阿克苏市",
			"value": "2676",
		}, {
			"label": "温宿县",
			"value": "2678",
		}, {
			"label": "沙雅县",
			"value": "2679",
		}, {
			"label": "拜城县",
			"value": "2680",
		}, {
			"label": "阿瓦提县",
			"value": "2681",
		}, {
			"label": "库车县",
			"value": "2682",
		}, {
			"label": "柯坪县",
			"value": "2683",
		}, {
			"label": "新和县",
			"value": "2684",
		}, {
			"label": "乌什县",
			"value": "2685",
		}]
	}, {
		"label": "喀什地区",
		"value": "2686",
		"children": [{
			"label": "喀什市",
			"value": "2687",
		}, {
			"label": "巴楚县",
			"value": "2688",
		}, {
			"label": "泽普县",
			"value": "2689",
		}, {
			"label": "伽师县",
			"value": "2690",
		}, {
			"label": "叶城县",
			"value": "2691",
		}, {
			"label": "岳普湖县",
			"value": "2692",
		}, {
			"label": "疏附县",
			"value": "2693",
		}, {
			"label": "疏勒县",
			"value": "2694",
		}, {
			"label": "英吉沙县",
			"value": "2695",
		}, {
			"label": "麦盖提县",
			"value": "2696",
		}, {
			"label": "莎车县",
			"value": "2697",
		}, {
			"label": "塔什库尔干县",
			"value": "2698",
		}]
	}, {
		"label": "克孜勒苏州",
		"value": "2699",
		"children": [{
			"label": "阿图什市",
			"value": "2700",
		}, {
			"label": "阿合奇县",
			"value": "2701",
		}, {
			"label": "乌恰县",
			"value": "2702",
		}, {
			"label": "阿克陶县",
			"value": "2703",
		}]
	}, {
		"label": "巴音郭楞州",
		"value": "2704",
		"children": [{
			"label": "库尔勒市",
			"value": "2705",
		}, {
			"label": "尉犁县",
			"value": "2706",
		}, {
			"label": "和静县",
			"value": "2707",
		}, {
			"label": "博湖县",
			"value": "2708",
		}, {
			"label": "和硕县",
			"value": "2709",
		}, {
			"label": "轮台县",
			"value": "2710",
		}, {
			"label": "若羌县",
			"value": "2711",
		}, {
			"label": "且末县",
			"value": "2712",
		}, {
			"label": "焉耆县",
			"value": "2713",
		}]
	}, {
		"label": "昌吉州",
		"value": "2714",
		"children": [{
			"label": "昌吉市",
			"value": "2715",
		}, {
			"label": "阜康市",
			"value": "2716",
		}, {
			"label": "奇台县",
			"value": "2718",
		}, {
			"label": "玛纳斯县",
			"value": "2719",
		}, {
			"label": "吉木萨尔县",
			"value": "2720",
		}, {
			"label": "呼图壁县",
			"value": "2721",
		}, {
			"label": "木垒县",
			"value": "2722",
		}]
	}, {
		"label": "博尔塔拉州",
		"value": "2723",
		"children": [{
			"label": "博乐市",
			"value": "2724",
		}, {
			"label": "精河县",
			"value": "2725",
		}, {
			"label": "温泉县",
			"value": "2726",
		}, {
			"label": "阿拉山口市",
			"value": "53776",
		}]
	}, {
		"label": "伊犁州",
		"value": "2727",
		"children": [{
			"label": "伊宁市",
			"value": "2728",
		}, {
			"label": "特克斯县",
			"value": "2729",
		}, {
			"label": "尼勒克县",
			"value": "2730",
		}, {
			"label": "昭苏县",
			"value": "2731",
		}, {
			"label": "新源县",
			"value": "2732",
		}, {
			"label": "霍城县",
			"value": "2733",
		}, {
			"label": "察布查尔县",
			"value": "2734",
		}, {
			"label": "巩留县",
			"value": "2735",
		}, {
			"label": "奎屯市",
			"value": "4028",
		}, {
			"label": "伊宁县",
			"value": "4499",
		}, {
			"label": "霍尔果斯市",
			"value": "53777",
		}]
	}, {
		"label": "塔城地区",
		"value": "2736",
		"children": [{
			"label": "塔城市",
			"value": "2737",
		}, {
			"label": "乌苏市",
			"value": "2738",
		}, {
			"label": "额敏县",
			"value": "2739",
		}, {
			"label": "裕民县",
			"value": "2740",
		}, {
			"label": "沙湾县",
			"value": "2741",
		}, {
			"label": "托里县",
			"value": "2742",
		}, {
			"label": "和布克赛尔县",
			"value": "2743",
		}]
	}, {
		"label": "阿勒泰地区",
		"value": "2744",
		"children": [{
			"label": "阿勒泰市",
			"value": "2745",
		}, {
			"label": "富蕴县",
			"value": "2746",
		}, {
			"label": "青河县",
			"value": "2747",
		}, {
			"label": "吉木乃县",
			"value": "2748",
		}, {
			"label": "布尔津县",
			"value": "2749",
		}, {
			"label": "福海县",
			"value": "2750",
		}, {
			"label": "哈巴河县",
			"value": "2751",
		}, {
			"label": "北屯市",
			"value": "6822",
		}]
	}, {
		"label": "五家渠市",
		"value": "4110",
		"children": [{
			"label": "五家渠市",
			"value": "4122",
		}]
	}, {
		"label": "阿拉尔市",
		"value": "53778",
		"children": [{
			"label": "阿拉尔市",
			"value": "53782",
		}]
	}, {
		"label": "铁门关市",
		"value": "53779",
		"children": [{
			"label": "铁门关市",
			"value": "53784",
		}]
	}, {
		"label": "昆玉市",
		"value": "53780",
		"children": [{
			"label": "昆玉市",
			"value": "53785",
		}]
	}, {
		"label": "图木舒克市",
		"value": "53781",
		"children": [{
			"label": "图木舒克市",
			"value": "53783",
		}]
	}]
}, {
	"label": "县城内",
	"value": "51759",
	"children": []
}]
/* harmony default export */ var ld_address_item_res = ({tb,jd});

// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2595f584-vue-loader-template"}!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-page-loading.vue?vue&type=template&id=482e6711&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"w h box-b",staticStyle:{"position":"relative"},style:({'z-index':_vm.loading?_vm.zIndex:1})},[(!_vm.$slots.loading)?[(_vm.loadings)?_c('div',{staticClass:"w h f-c align-items-center b-f",staticStyle:{"position":"absolute"},style:({'z-index':_vm.zIndex})},[_c('div',[_c('div',{staticClass:"w f-c el-icon-loading fs26 c-p"}),_c('div',{staticClass:"p-t10 c-p",style:({'opacity':("0." + _vm.opacity)})},[_vm._v(_vm._s(_vm.loadingTexts))])])]):_vm._e()]:[_c('div',{staticClass:"box-b w h f-c align-items-center",staticStyle:{"position":"absolute","top":"0","left":"0"}},[_vm._t("loading")],2)],_c('div',{staticClass:"w h"},[_vm._t("default")],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/lib/ld-page-loading.vue?vue&type=template&id=482e6711&

// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-page-loading.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ld_page_loadingvue_type_script_lang_js_ = ({
	name: 'ld-page-loading',
	props: {
		/**
		 * css z-index的值
		 */
		zIndex: {
			type: Number,
			default: 1002
		},
		/**
		 * 是否加载
		 */
		loading: {
			type: Boolean,
			default: true
		},
		loadingText: {
			type: String,
			default: '加载中......'
		},
	},
	watch: {
		loading(news) {
			this.loadings = news;
		},
		loadingText(news) {
			this.loadingTexts = news;
			this.createTextAnimal();
		}
	},
	data() {
		return {
			loadingTexts: this.loadingText,
			loadings: this.loading,
			textAnimal: null,
			opacity: 1,
		};
	},
	methods: {
		createTextAnimal() {
			let isAdd = true;
			if (!this.textAnimal && this.loadings) {
				this.textAnimal = setInterval(() => {
					this.opacity = isAdd ? (this.opacity + 1) : (this.opacity - 1);
					if (this.opacity >= 99) {
						isAdd = false;
					}
					if (this.opacity <= 1) {
						isAdd = true;
					}
				}, 20);
				return;
			}
			try {
				if (this.textAnimal)
					clearInterval(this.textAnimal);
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	created() {
		this.createTextAnimal();
	}
});

// CONCATENATED MODULE: ./src/lib/ld-page-loading.vue?vue&type=script&lang=js&
 /* harmony default export */ var lib_ld_page_loadingvue_type_script_lang_js_ = (ld_page_loadingvue_type_script_lang_js_); 
// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/lib/ld-page-loading.vue





/* normalize component */

var component = normalizeComponent(
  lib_ld_page_loadingvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ld_page_loading = (component.exports);
// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2595f584-vue-loader-template"}!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-forms.vue?vue&type=template&id=2c909eb0&
var ld_formsvue_type_template_id_2c909eb0_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"layout-dynamic-form"},[(_vm.$scopedSlots.custom)?[_vm._t("custom",null,{"form":_vm.forms,"layout":_vm.layouts})]:_c('div',{staticClass:"form wh"},[(_vm.forms&&Object.keys(_vm.forms).length>0&&_vm.showTipButton)?_c('div',{staticClass:"f-e w m-b10 m-t10"},[_c('div',{staticClass:"el-icon-question fs38 c-w b-t",staticStyle:{"z-index":"2"},on:{"click":function($event){_vm.showDefaultTips=!_vm.showDefaultTips}}})]):_vm._e(),(_vm.forms&&Object.keys(_vm.forms).length>0)?_c('div',{staticClass:"el-form w h p-b10",class:{'over-a-y':_vm.isOverflowY}},[_c('div',{staticClass:"a-i-c w",class:{'f-b-w':!_vm.isRow,'f-s':_vm.isRow}},[_vm._l((_vm.layout),function(item,i){return (item['visabled']!=false)?_c('div',{key:i,staticClass:"el-form-item position-relative w",class:{'w':_vm.isRow,'cols_1':_vm.fcols==1||!_vm.fcols,'cols_2':_vm.fcols==2,'cols_3':_vm.fcols==3,'cols_4':_vm.fcols==4},style:({'max-width':_vm.isRow?'250px':'','flex-grow': '2'})},[_c('div',{staticClass:"w",class:{'el-disabled':_vm.getDisabled(item),'el-readonly':_vm.getDisabled(item)}},[(_vm.layoutType.includes(item['type'].toLocaleLowerCase()))?_c('div',{staticClass:"a-i-c w",class:{'a-i-c':_vm.labelPosition!='top', 'f-s':_vm.labelPosition!='top','item':item['error']!=true,'error-item':item['error']==true},staticStyle:{"position":"relative"}},[(item['label']||item['showLabel'])?_c('div',{staticClass:"el-form-item__label  w-180 f-n-c-w a-i-c f-r",class:{'f-s':_vm.labelPosition=='left','f-e':_vm.labelPosition=='right'},staticStyle:{"flex-shrink":"0"}},[(item['require']==true)?_c('div',{staticClass:"c-d"},[_vm._v("*")]):_vm._e(),_c('div',{class:{'c8':_vm.getDisabled(item)}},[_vm._v(" "+_vm._s(item['label']||'')+" ")])]):_vm._e(),(_vm.$scopedSlots.rowCustom)?[_c('div',{staticClass:"w  el-input--suffix box-b",style:({'cursor':_vm.getDisabled(item)?'no-drop':'default'})},[_vm._t("rowCustom",null,{"item":item})],2)]:_c('div',{staticClass:"el-input--suffix box-b over-h",staticStyle:{"flex-grow":"2"},style:({'cursor':_vm.getDisabled(item)?'no-drop':'default'})},[((typeof item['tip']!='undefined'&&_vm.showDefaultTips)||_vm.isControlsType(item,'tip'))?[(typeof item['tip']!='undefined'&&_vm.showDefaultTips)?_c('div',{class:item['tipClass']?item['tipClass']:'tip-w b-w1 c7',domProps:{"innerHTML":_vm._s(item['tip'])}}):_c('div',{staticClass:"el-input__inner color3 a-i-c over-h-y r0 bor-trb0",class:item['tipClass']?item['tipClass']:'tip-w b-w1 c7',domProps:{"innerHTML":_vm._s(item['tip'])}})]:_vm._e(),(_vm.isControlsType(item,'datakey'))?_c('div',{staticClass:"el-disabled w  el-input--suffix"},[_c('el-input',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}],model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}}),_c('div',{staticClass:"el-input__inner fs color8"},[_vm._v("数据键，无需更改！")])],1):_vm._e(),(_vm.isControlsType(item,'slot'))?[_vm._t(item['prop'],null,{"item":item,"layout":_vm.layout,"form":_vm.forms,"onRegex":_vm.regexFormVal})]:_vm._e(),(_vm.isControlsType(item,'text'))?[_c('el-input',{class:{'error-bor-d':item['error']==true},attrs:{"clearable":"","show-password":item['password'],"placeholder":_vm.getPlaceholder(item)},on:{"change":function($event){return _vm.regexFormVal(item,i)},"input":function($event){return _vm.regexFormVal(item,i)},"blur":function($event){return _vm.regexFormVal(item,i)},"focus":function($event){return _vm.regexFormVal(item,i)}},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})]:_vm._e(),(_vm.isControlsType(item,'textarea'))?[_c('el-input',{class:{'error-bor-d':item['error']==true},attrs:{"type":"textarea","clearable":"","show-password":item['password'],"placeholder":_vm.getPlaceholder(item),"rows":item['rows']||4},on:{"change":function($event){return _vm.regexFormVal(item,i)},"input":function($event){return _vm.regexFormVal(item,i)},"blur":function($event){return _vm.regexFormVal(item,i)},"focus":function($event){return _vm.regexFormVal(item,i)}},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})]:_vm._e(),(_vm.isControlsType(item,'select'))?[_c('el-select',{staticClass:"w m-l0",class:{'error-bor-d':item['error']==true},staticStyle:{"margin-left":"20px"},attrs:{"clearable":"","allow-create":item['allowCreate']||false,"filterable":item['filterable']||item['allowCreate']||false,"multiple":item['multiple']||false,"collapse-tags":"","placeholder":"请选择"},on:{"change":function($event){return _vm.regexFormVal(item,i)},"blur":function($event){return _vm.regexFormVal(item,i)},"focus":function($event){return _vm.regexFormVal(item,i)}},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}},_vm._l((item['options']),function(opt){return _c('el-option',{key:opt.value,attrs:{"label":opt.label,"value":opt.value,"disabled":opt.disabled||false}},[_vm._t(("options_" + (item['prop'])))],2)}),1)]:_vm._e(),(_vm.isControlsType(item,'radio'))?[_c('div',{staticClass:"box-b f-s a-i-c bor-ff",class:{'el-input':!item['isButton'],'el-input__inner':!item['isButton'],'bor-d':item['error']==true}},[_c('el-radio-group',{on:{"change":function($event){return _vm.regexFormVal(item,i)}},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}},[_vm._l((item['options']),function(opt,j){return (!item['isButton'])?_c('el-radio',{key:j,staticClass:"p-b2 p-t2",attrs:{"label":opt.value}},[_vm._v(" "+_vm._s(opt.label)+" ")]):_vm._e()}),_vm._l((item['options']),function(opt,j){return _c('el-radio-button',{key:j,staticClass:"p-b2 p-t2",attrs:{"label":opt.value,"border":item[' border']||false}},[_vm._v(" "+_vm._s(opt.label)+" ")])})],2)],1)]:_vm._e(),(_vm.isControlsType(item,'checkbox'))?[_c('div',{staticClass:"el-input box-b el-input__inner f-s a-i-c",class:{'bor-d':item['error']==true}},[_c('el-checkbox-group',{on:{"change":function($event){return _vm.regexFormVal(item,i)}},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}},_vm._l((item['options']),function(opt,j){return _c('el-checkbox',{key:j,staticClass:"p-b2 p-t2",attrs:{"label":opt.value}},[_vm._v(" "+_vm._s(opt.label)+" ")])}),1)],1)]:_vm._e(),(_vm.isControlsType(item,'date'))?[_c('el-date-picker',{staticClass:"w",class:{'error-bor-d':item['error']==true},staticStyle:{"width":"100%"},attrs:{"align":item['align']||'left',"value-format":_vm.layoutDateFormat[item['dateType']||'date'],"type":item['dateType']||'date',"placeholder":item['placeholder'],"readonly":_vm.getDisabled(item),"picker-options":item['pickerOptions']},on:{"change":function($event){return _vm.regexFormVal(item,i)},"blur":function($event){return _vm.regexFormVal(item,i)},"focus":function($event){return _vm.regexFormVal(item,i)}},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})]:_vm._e(),(_vm.isControlsType(item,'icon'))?[_c('div',{staticClass:"w",class:{'error-bor-d':item['error']==true},on:{"mouseenter":function($event){return _vm.regexFormVal(item,i)},"mouseleave":function($event){return _vm.regexFormVal(item,i)}}},[_c('ld-icon',{staticClass:"w",attrs:{"value":_vm.forms[item['prop']],"clearable":false},on:{"icon":function($event){return _vm.ldChangeValToForm(item,$event,i)}}})],1)]:_vm._e(),(_vm.isControlsType(item,'tag'))?[_c('div',{staticClass:"w",class:{'error-bor-d':item['error']==true},on:{"mouseenter":function($event){return _vm.regexFormVal(item,i)},"mouseleave":function($event){return _vm.regexFormVal(item,i)}}},[_c('ld-tags',{staticClass:"w",attrs:{"tag":_vm.forms[item['prop']],"title":item['title']||'',"clearable":false},on:{"tag":function($event){return _vm.ldChangeValToForm(item,$event,i)}}})],1)]:_vm._e(),(_vm.isControlsType(item,'address'))?[_c('div',{staticClass:"w",on:{"mouseenter":function($event){return _vm.regexFormVal(item,i)},"mouseleave":function($event){return _vm.regexFormVal(item,i)}}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.forms[item['prop']]),expression:"forms[item['prop']]"},{name:"show",rawName:"v-show",value:(false),expression:"false"}],staticClass:"el-input__inner color3 fs14 over-h-y",attrs:{"name":item['prop']},domProps:{"value":(_vm.forms[item['prop']])},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.forms, item['prop'], $event.target.value)}}}),_c('ld-address',{attrs:{"addr":_vm.forms[item['prop']]},on:{"addr":function($event){return _vm.ldChangeValToForm(item,$event,i,'text')}}})],1)]:_vm._e(),(_vm.isControlsType(item,'sysdate'))?[_c('div',{staticClass:"el-input__inner color3 fs14 over-h-y f-s a-i-c"},[_vm._v(" "+_vm._s(_vm.getDateOrTime(item))+" ")])]:_vm._e(),(_vm.isControlsType(item,'param'))?[_c('ld-params',{attrs:{"type":item['dataType'],"param":_vm.forms[item['prop']]},on:{"param":function($event){_vm.forms[item['prop']]=$event}}})]:_vm._e(),(_vm.isControlsType(item,'image'))?[_c('ld-images',{attrs:{"limit":item['limit']||1,"value":_vm.forms[item['prop']],"clearable":false},on:{"image":function($event){return _vm.ldChangeValToForm(item,$event,i)}}})]:_vm._e(),(_vm.isControlsType(item,'number'))?[_c('el-input-number',{attrs:{"size":"small","min":parseInt(item['min'])||0,"max":parseInt(item['max'])||1000,"step":item['step']||1,"step-strictly":item['stepStrictly']||false,"precision":item['precision ']||0,"placeholder":_vm.getPlaceholder(item)},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})]:_vm._e(),(_vm.isControlsType(item,'switch'))?[_c('el-switch',{attrs:{"active-text":item['activeText']||'',"inactive-text":item['inactiveText']||''},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})]:_vm._e(),(_vm.isControlsType(item,'slider'))?[_c('el-slider',{staticClass:"m-l6 m-r6",attrs:{"marks":item['marks']||{},"min":parseInt(item['min']) ||0,"max":parseInt(item['max'])||100,"step":item['step']||1,"format-tooltip":item['formatTooltip']||null,"show-stops":item['showStops']||true},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})]:_vm._e(),(_vm.isControlsType(item,'rate'))?[_c('el-rate',{attrs:{"show-text":item['showText']||false,"show-score":item['showScore']||false,"colors":item['colors']||['#99A9BF', '#F7BA2A', '#FF9900']},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})]:_vm._e(),(_vm.isControlsType(item,'color'))?[_c('el-color-picker',{attrs:{"show-alpha":"","predefine":_vm.layoutColorPacikerDefaultList},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})]:_vm._e(),(_vm.isControlsType(item,'transfer'))?[_c('el-card',{staticClass:"box-card",attrs:{"shadow":"always"}},[_c('el-transfer',{attrs:{"titles":item['title']?typeof item['title']=='string'?item['title'].split(_vm.layoutTypeEmitParser.ArraySplit.chart):item['title']:['原数据','设置数据'],"props":{key: 'value', label: 'label' },"data":item['options']},model:{value:(_vm.forms[item['prop']]),callback:function ($$v) {_vm.$set(_vm.forms, item['prop'], $$v)},expression:"forms[item['prop']]"}})],1)]:_vm._e()],2),_c('div',{staticClass:"a-i-c over-h-y box-b f-e",staticStyle:{"position":"absolute","right":"10px"}},[(item['error']==true)?_c('div',{staticClass:"c-d fs",class:{'p-r10':_vm.isControlsType(item,'select')||_vm.forms[item['prop']]},staticStyle:{"height":"12px","line-height":"12px"}},[_vm._v(" "+_vm._s(item['errorMsg'])+" ")]):_vm._e(),(!_vm.getDisabled(item)&&_vm.forms[item['prop']]&&_vm.forms[item['prop']].length>0&&_vm.hasClearButton.includes(item['type'].toLocaleLowerCase()))?_c('div',{staticClass:"forms-clear-button el-icon-circle-close fs14 el-input__clear",staticStyle:{"color":"#C0C4CC"},on:{"click":function($event){_vm.forms[item['prop']]=''}}}):_vm._e()])],2):_vm._e()]),(_vm.isRow)?_c('div',[_vm._t("buttons",null,{"form":_vm.forms})],2):_vm._e()]):_vm._e()}),(!_vm.isRow)?_c('div',{staticClass:"w"},[_vm._t("buttons",null,{"form":_vm.forms})],2):_vm._e()],2)]):_vm._e()])],2)}
var ld_formsvue_type_template_id_2c909eb0_staticRenderFns = []


// CONCATENATED MODULE: ./src/lib/ld-forms.vue?vue&type=template&id=2c909eb0&

// EXTERNAL MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-forms.vue?vue&type=script&lang=js&
var ld_formsvue_type_script_lang_js_ = __webpack_require__("aa1d");

// CONCATENATED MODULE: ./src/lib/ld-forms.vue?vue&type=script&lang=js&
 /* harmony default export */ var lib_ld_formsvue_type_script_lang_js_ = (ld_formsvue_type_script_lang_js_["a" /* default */]); 
// EXTERNAL MODULE: ./src/lib/ld-forms.vue?vue&type=style&index=0&lang=css&
var ld_formsvue_type_style_index_0_lang_css_ = __webpack_require__("6e95");

// CONCATENATED MODULE: ./src/lib/ld-forms.vue






/* normalize component */

var ld_forms_component = normalizeComponent(
  lib_ld_formsvue_type_script_lang_js_,
  ld_formsvue_type_template_id_2c909eb0_render,
  ld_formsvue_type_template_id_2c909eb0_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ld_forms = (ld_forms_component.exports);
// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2595f584-vue-loader-template"}!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-icon.vue?vue&type=template&id=514a65f6&
var ld_iconvue_type_template_id_514a65f6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"position-relative"},[_c('div',{},[_c('div',{staticClass:"el-input el-input__inner f-b",on:{"click":function($event){_vm.dialog=!_vm.dialog},"blur":_vm.changeEvent,"focus":_vm.changeEvent}},[_c('div',{staticClass:"ellipsis align-items-center"},[(_vm.icon)?_c('div',{staticClass:"fs20 p-18 ",class:_vm.icon}):_vm._e(),_c('div',{staticClass:"color8 fs14"},[_vm._v(_vm._s(!_vm.icon?'点击选择图标':_vm.icon))])]),(_vm.clearable)?_c('div',[_c('i',{staticClass:"el-icon-circle-close color9",on:{"click":function($event){$event.stopPropagation();_vm.icon=''}}})]):_vm._e()])]),_c('el-dialog',{staticClass:"id-dialog",attrs:{"title":"选择图标","visible":_vm.dialog,"width":"800px","append-to-body":true},on:{"update:visible":function($event){_vm.dialog=$event}}},[_c('div',{staticClass:"w over-h-y h box-b",staticStyle:{"height":"calc(100% - 40px)"}},[_c('div',{staticClass:"tip-p b-p1 w h-40 box-b f-s a-i-c"},[_c('div',{staticClass:"f-n-c-w c8"},[_vm._v("鼠标单击选中，双击选择并退出！")]),_c('el-input',{staticStyle:{"min-width":"200px"},attrs:{"placeholder":"输入内容快速检索","clearable":"","size":"small"},model:{value:(_vm.search),callback:function ($$v) {_vm.search=$$v},expression:"search"}},[_c('template',{slot:"prepend"},[_c('i',{staticClass:"el-icon-search"})])],2),_c('div',{staticClass:"f-n-c-w w-300 f-s a-i-c"},[(_vm.icon)?_c('span',{staticClass:"f-b-w c10 fs24 m4"},[_vm._v("|")]):_vm._e(),(_vm.icon)?_c('div',{staticClass:" b-d2 r2 f-s a-i-c p2 p-l4 p-r4"},[_c('i',{staticClass:"icon-item fs20 p-r2",class:_vm.icon}),_c('span',{staticClass:"fs color6 icon-item p0",staticStyle:{"height":"10px","line-height":"10px"}},[_vm._v(_vm._s(_vm.icon))])]):_vm._e()])],1),_c('div',{staticClass:"w f-s-w over-a-y box-b over-h-x",staticStyle:{"max-height":"calc(100% - 40px)"}},_vm._l((_vm.iconList),function(item,i){return (item.indexOf(_vm.search)>=0)?_c('div',{key:i,staticClass:"m8 icon-item",staticStyle:{"width":"auto","cursor":"pointer"},on:{"dblclick":function($event){$event.stopPropagation();_vm.dialog=!_vm.dialog},"click":function($event){return _vm.checkIcon(item)}}},[_c('div',{staticClass:"t-c l-h40",staticStyle:{"min-width":"40px","height":"40px"}},[_c('i',{staticClass:"fs24",class:item})]),_c('div',{staticClass:"fs color6 icon-item p0",staticStyle:{"height":"10px","line-height":"10px"}},[_vm._v(_vm._s(item))])]):_vm._e()}),0)])])],1)}
var ld_iconvue_type_template_id_514a65f6_staticRenderFns = []


// CONCATENATED MODULE: ./src/lib/ld-icon.vue?vue&type=template&id=514a65f6&

// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-icon.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ld_iconvue_type_script_lang_js_ = ({
	name: 'ld-icon',
	props: {
		readonly: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: ''
		},
		showDialog: {
			type: Boolean,
			default: false,
		},
		clearable: {
			type: Boolean,
			default: true,
		}
	},
	watch: {
		value(news) {
			this.icon = news;
		},
		showDialog(news) {
			this.dialog = news;
		},

	},
	data() {
		return {
			search: '',
			dialog: this.showDialog,
			icon: this.value,
			iconList: this.$ldIconList.resource.concat("el-xxxx")
		}
	},
	methods: {
		changeEvent() {
			debugger
			this.$emit("change", this.icon);
		},
		checkIcon(item) {
			this.icon = item;
			this.$emit("icon", this.icon);
		}
	}
});

// CONCATENATED MODULE: ./src/lib/ld-icon.vue?vue&type=script&lang=js&
 /* harmony default export */ var lib_ld_iconvue_type_script_lang_js_ = (ld_iconvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/lib/ld-icon.vue?vue&type=style&index=0&lang=css&
var ld_iconvue_type_style_index_0_lang_css_ = __webpack_require__("fe37");

// CONCATENATED MODULE: ./src/lib/ld-icon.vue






/* normalize component */

var ld_icon_component = normalizeComponent(
  lib_ld_iconvue_type_script_lang_js_,
  ld_iconvue_type_template_id_514a65f6_render,
  ld_iconvue_type_template_id_514a65f6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ld_icon = (ld_icon_component.exports);
// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2595f584-vue-loader-template"}!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-tags.vue?vue&type=template&id=09af675f&
var ld_tagsvue_type_template_id_09af675f_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"m-t4"},[(_vm.title)?_c('div',{staticClass:"color8 p2",staticStyle:{"height":"28px"}},[_vm._v(_vm._s(_vm.title))]):_vm._e(),_c('div',{staticClass:"f-s-w w"},[_vm._l((_vm.tags),function(item,i){return _c('el-tag',{key:i,staticClass:"m-r4 m-t1 m-b1",attrs:{"effect":"plain","closable":""},on:{"close":function($event){return _vm.closeTags(item)}}},[_vm._v(" "+_vm._s(item)+" ")])}),(_vm.isAdd)?_c('el-input',{staticClass:"input-new-tag  m-r4 m-t1 m-b1",staticStyle:{"width":"100px"},attrs:{"placeholder":"请输入内容","size":"small"},model:{value:(_vm.text),callback:function ($$v) {_vm.text=$$v},expression:"text"}}):_vm._e(),_c('div',{staticStyle:{"width":"80px"}},[_c('el-button',{staticClass:"m-t1 m-b1",class:{'el-icon-plus':!_vm.isAdd,'el-icon-check':_vm.isAdd},staticStyle:{"height":"32px"},attrs:{"type":"primary","size":"mini","plain":""},on:{"click":_vm.addTag}},[_vm._v(" "+_vm._s(!_vm.isAdd?'Add':'确定')+" ")])],1)],2)])}
var ld_tagsvue_type_template_id_09af675f_staticRenderFns = []


// CONCATENATED MODULE: ./src/lib/ld-tags.vue?vue&type=template&id=09af675f&

// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-tags.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

  /* harmony default export */ var ld_tagsvue_type_script_lang_js_ = ({	
		name: "ld-tags",
    props: {
      tag: {
        type: [Array, String],
        default: () => {
          return [];
        }
      },
      title: {
        type: String,
        default: ''
      }
    },
    watch: {
      tag(news) {
        this.tags = typeof news == 'object' ? news : typeof news == 'string' && !news ? [] : [news];
      }
    },
    data() {
      return {
        isAdd: false,
        tags: typeof this.tag == 'object' ? this.tag : typeof this.tag == 'string' && !this.tag ? [] : [this.tag],
        text: '',
      }
    },
    methods: {
      closeTags(item) {
        this.tags = this.tags.filter(ite => ite != item);
        this.$emit("tag", this.tags);
      },
      addTag() {

        if (this.isAdd) {
          //确定保存标签
          if (!this.text.trim()) {
            this.$message.error("请输入内容！");
            return;
          }
          if (this.tags.indexOf(this.text.trim()) >= 0) {
            this.$message.error("已存在相同的内容！");
            return;
          }
          this.$set(this.tags, this.tags.length, this.text.trim());
          this.text = "";
          this.$emit("tag", this.tags);
        }
        this.isAdd = !this.isAdd;
      }
    }
  });

// CONCATENATED MODULE: ./src/lib/ld-tags.vue?vue&type=script&lang=js&
 /* harmony default export */ var lib_ld_tagsvue_type_script_lang_js_ = (ld_tagsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/lib/ld-tags.vue?vue&type=style&index=0&lang=css&
var ld_tagsvue_type_style_index_0_lang_css_ = __webpack_require__("7eef");

// CONCATENATED MODULE: ./src/lib/ld-tags.vue






/* normalize component */

var ld_tags_component = normalizeComponent(
  lib_ld_tagsvue_type_script_lang_js_,
  ld_tagsvue_type_template_id_09af675f_render,
  ld_tagsvue_type_template_id_09af675f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ld_tags = (ld_tags_component.exports);
// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2595f584-vue-loader-template"}!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-address.vue?vue&type=template&id=59eb47d2&
var ld_addressvue_type_template_id_59eb47d2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"w h"},[_c('div',{staticClass:"c8 el-input__inner fs14",on:{"click":_vm.openCheckAddr}},[_vm._v(_vm._s(_vm.addrs.length>0?_vm.addrs:'请选择地址!'))]),_c('el-dialog',{staticClass:"id-dialog over-h-x",attrs:{"title":_vm.addrs||'选择地址',"visible":_vm.dialogVisible,"width":"580px","append-to-body":true},on:{"update:visible":function($event){_vm.dialogVisible=$event}}},[_c('div',{staticClass:"tip-p b-p2 c8 f-s a-i-c"},[_c('div',[_vm._v(" 点击选中，省市县；点击县关闭窗口！ ")]),_c('el-input',{staticClass:"w-240",attrs:{"placeholder":"输入省快速检索","clearable":"","size":"small"},on:{"input":_vm.inputProvince},model:{value:(_vm.provinceName),callback:function ($$v) {_vm.provinceName=$$v},expression:"provinceName"}},[_c('template',{slot:"prepend"},[_c('i',{staticClass:"el-icon-search"})])],2)],1),_c('div',{staticClass:"w f-s over-h-y h",staticStyle:{"height":"calc(100% - 60px)"}},[_c('el-cascader-panel',{staticClass:"h",attrs:{"filterable":"","size":"medium","options":_vm.options},on:{"change":_vm.addressChange},model:{value:(_vm.value),callback:function ($$v) {_vm.value=$$v},expression:"value"}})],1)])],1)}
var ld_addressvue_type_template_id_59eb47d2_staticRenderFns = []


// CONCATENATED MODULE: ./src/lib/ld-address.vue?vue&type=template&id=59eb47d2&

// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-address.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ld_addressvue_type_script_lang_js_ = ({
  name: 'ld-address',
  props: {
    addr: {
      type: String,
      default: ''
    }
  },
  watch: {
    addr(news) {
      this.addrs = news;
    }
  },
  data() {
    return {
      value: [],
      cityList: this.$ldaddressItem['tb'],
      options: [],
      provinceName: '',
      addrs: this.addr,
      dialogVisible: false,
    }
  },
  methods: {
    openCheckAddr(){
      this.dialogVisible=!this.dialogVisible;
    },
    addressChange(value) {
      if(!value||value.length<=0){
        return;
      }
      const getItem=function(data,val){
       let _data= data.filter(item=>item.value==val);
       if(_data.length<=0){
         return {};
       }
       return _data[0];
      }
      let item=null;
      let add="";
      for(let i=0;i<value.length;i++){
        item=getItem(i==0?this.cityList:item['children'],value[i]);
        add +=item['label']?(`${item['label']}${i<value.length-1?',':''}`):item['label'];
        if(!add){
          return;
        }
      }
      this.$emit("addr", {
        text: add,
        code: value.join(',')
      })
      this.openCheckAddr();
    },
    getOptions() {
      this.options = this.cityList.filter(item => item.label.indexOf(this.provinceName) >= 0 || item.pingyinkey
        .indexOf(`${this.provinceName.toLocaleLowerCase()}`) >= 0);
    },
    inputProvince(e) {
      this.getOptions();
    },
    /**
     * 为省生成简拼
     */
    addPingYinKeyToProvice() {
      let temp = this.cityList;
      this.cityList = [];
      temp.map(item => {
        item['pingyinkey'] =
          `${this.$ld.util.pingyin.getFirstChar(item.label)}_${this.$ld.util.pingyin.chineseToPinYin(item.label)}`
          .toLocaleLowerCase()
        return item;
      })
      this.cityList = temp;
    }
  },
  created() {
    this.addPingYinKeyToProvice();
    this.getOptions();
  }
});

// CONCATENATED MODULE: ./src/lib/ld-address.vue?vue&type=script&lang=js&
 /* harmony default export */ var lib_ld_addressvue_type_script_lang_js_ = (ld_addressvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/lib/ld-address.vue?vue&type=style&index=0&lang=css&
var ld_addressvue_type_style_index_0_lang_css_ = __webpack_require__("5514");

// CONCATENATED MODULE: ./src/lib/ld-address.vue






/* normalize component */

var ld_address_component = normalizeComponent(
  lib_ld_addressvue_type_script_lang_js_,
  ld_addressvue_type_template_id_59eb47d2_render,
  ld_addressvue_type_template_id_59eb47d2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ld_address = (ld_address_component.exports);
// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2595f584-vue-loader-template"}!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-params.vue?vue&type=template&id=f5f905e6&
var ld_paramsvue_type_template_id_f5f905e6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"c10 a-i-c f-s p2 el-input__inner"},[_c('el-button',{attrs:{"type":"primary","plain":"","size":"mini"},on:{"click":_vm.addItem}},[_vm._v("添加一行")])],1),_c('div',{staticClass:"box-b p2"},[(Array.isArray(_vm.params))?[_vm._l((_vm.params),function(item,i){return [_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.params[i]),expression:"params[i]"}],key:i,staticClass:"el-input__inner color3 fs14 over-h-y",attrs:{"placeholder":"请输入参数值","placeholder-class":"c10"},domProps:{"value":(_vm.params[i])},on:{"input":[function($event){if($event.target.composing){ return; }_vm.$set(_vm.params, i, $event.target.value)},_vm.confirmItem],"change":_vm.confirmItem}})]})]:[_vm._l((_vm.keyList),function(item,i){return [_c('div',{key:i,staticClass:"f-s m-b2"},[_c('el-input',{staticClass:" color3 fs14 over-h-y w-200",attrs:{"placeholder":"请输入键","placeholder-class":"c10"},on:{"input":_vm.confirmItem,"change":_vm.confirmItem},model:{value:(_vm.keyList[i]),callback:function ($$v) {_vm.$set(_vm.keyList, i, $$v)},expression:"keyList[i]"}}),_c('el-input',{staticClass:"color3 fs14 over-h-y",attrs:{"placeholder":"请输入参数值","placeholder-class":"c10"},on:{"input":_vm.confirmItem,"change":_vm.confirmItem},model:{value:(_vm.valueList[i]),callback:function ($$v) {_vm.$set(_vm.valueList, i, $$v)},expression:"valueList[i]"}})],1)]})]],2)])}
var ld_paramsvue_type_template_id_f5f905e6_staticRenderFns = []


// CONCATENATED MODULE: ./src/lib/ld-params.vue?vue&type=template&id=f5f905e6&

// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-params.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ld_paramsvue_type_script_lang_js_ = ({
	name:'ld-params',
	props: {
		type: {
			type: String,
			default: 'array'
		},
		param: {
			type: [Object, Array,String],
			default: () => {
				return [];
			}
		},

	},
	watch: {
		param(news) {
			this.params = news;
		},
		type(news) {
			if (news.toLowerCase() == 'array') {
				this.param = !this.param ? [] : this.param;
			} else {
				this.param = !this.param ? {} : this.param;
			}
		}
	},
	data() {
		return {
			params: this.param,
			keyList:Object.keys(this.param)||[],
			valueList:Object.values(this.param)||[],
		};
	},
	methods: {
		getParams() {
			if ((this.params && Array.isArray(this.params) && this.params.length > 0) || (this.params && !Array
					.isArray(this.params) && Object.keys(this.params).length > 0)) {
				return true; //JSON.stringify(this.params);
			}
			return false; // '暂未设计数据'
		},
		addItem() {
			if (this.type.toLowerCase() == 'array') {
				this.params = this.params || [];
				this.$set(this.params, this.params.length, null);
			} else {
				this.$set(this.keyList, this.keyList.length, null);
				this.$set(this.valueList, this.valueList.length, null);
			}
		},
		confirmItem() {
			let params = this.params;
			if (this.type.toLowerCase() == 'array') {
				params = params.filter(item => item);
			}else{
				for(let i=0;i<this.keyList.length;i++){
					this.$set(this.params,this.keyList[i],this.valueList[i])
				}
			}
			this.$emit("params", params);
		}
	}
});

// CONCATENATED MODULE: ./src/lib/ld-params.vue?vue&type=script&lang=js&
 /* harmony default export */ var lib_ld_paramsvue_type_script_lang_js_ = (ld_paramsvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/lib/ld-params.vue





/* normalize component */

var ld_params_component = normalizeComponent(
  lib_ld_paramsvue_type_script_lang_js_,
  ld_paramsvue_type_template_id_f5f905e6_render,
  ld_paramsvue_type_template_id_f5f905e6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ld_params = (ld_params_component.exports);
// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2595f584-vue-loader-template"}!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-images.vue?vue&type=template&id=7410e5ce&
var ld_imagesvue_type_template_id_7410e5ce_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-upload',{attrs:{"file-list":_vm.fileList,"limit":_vm.limit,"multiple":"","action":"#","list-type":"picture-card","on-change":_vm.fileListChange,"before-remove":_vm.beforeRemove,"auto-upload":false,"on-exceed":_vm.selectImages},scopedSlots:_vm._u([{key:"file",fn:function(ref){
var file = ref.file;
return _c('div',{staticClass:"w h position-relative"},[_c('el-image',{staticClass:"w h",attrs:{"fit":"cover ","src":file.url,"alt":"","preview-src-list":[file.url]}}),_c('div',{staticClass:"b-i5 p6 p-t3 p-b3 r2 a-i-c item-hover",staticStyle:{"position":"absolute","top":"0","right":"0","z-index":"2","pointer-events":"none"}},[_c('i',{staticClass:"el-icon-zoom-in c-f cur-p m-r4",staticStyle:{"pointer-events":"none","z-index":"1"},on:{"focus":function($event){_vm.isPreview=true}}}),_c('i',{staticClass:"el-icon-delete c-f cur-p",staticStyle:{"pointer-events":"auto","z-index":"1"},on:{"click":function($event){return _vm.removeImage(file)}}})])],1)}}])},[_c('i',{staticClass:"el-icon-plus",attrs:{"slot":"default"},on:{"click":_vm.selectImages},slot:"default"})])],1)}
var ld_imagesvue_type_template_id_7410e5ce_staticRenderFns = []


// CONCATENATED MODULE: ./src/lib/ld-images.vue?vue&type=template&id=7410e5ce&

// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/lib/ld-images.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

  /* harmony default export */ var ld_imagesvue_type_script_lang_js_ = ({
		name:'ld-images',
    props: {
      limit: {
        type: Number,
        default: 4
      },
      value: {
        type: [Array, String],
        default: () => {
          return [];
        }
      },
    },
    data() {
      return {
        isPreview: false,
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        fileList: [],
      };
    },
    methods: {
      fileListChange(file, fileList) {
        this.fileList = fileList;
        this.$emit("image", this.fileList);
      },
      selectImages(files, fileList) {
        if (this.limit <= 1) {
          return;
        }
        this.$message.warning(`当前限制选择${this.limit}个文件，共选择了 ${this.fileList.length} 个文件`);
      },
      removeImage(file) {
        this.fileList = this.fileList.filter(item => item.uid != file.uid);
        this.$emit("image", this.fileList);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }


    }
  });

// CONCATENATED MODULE: ./src/lib/ld-images.vue?vue&type=script&lang=js&
 /* harmony default export */ var lib_ld_imagesvue_type_script_lang_js_ = (ld_imagesvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/lib/ld-images.vue?vue&type=style&index=0&lang=css&
var ld_imagesvue_type_style_index_0_lang_css_ = __webpack_require__("0f60");

// CONCATENATED MODULE: ./src/lib/ld-images.vue






/* normalize component */

var ld_images_component = normalizeComponent(
  lib_ld_imagesvue_type_script_lang_js_,
  ld_imagesvue_type_template_id_7410e5ce_render,
  ld_imagesvue_type_template_id_7410e5ce_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ld_images = (ld_images_component.exports);
// CONCATENATED MODULE: ./src/lib/index.js
//引入axios 请求封装方法


//引入公共函数


// 引入资源和配置



//引入组件







// import locale from 'element-ui/src/locale';

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';




const install = (Vue)=> {
	// locale.use(opts.locale);
	// locale.i18n(opts.i18n);
	
	// Vue.use(ElementUI);
	
	Vue.prototype.$requestInit = function(axios) {
		return api_request.axiosInit(axios);
	};

	Vue.prototype.$serverRequestPath = api_request.serverRequestPath;
	Vue.prototype.$request = api_request.request;
	Vue.prototype.$screen = screen;
	Vue.prototype.$ldIconList = ld_icon_res;
	Vue.prototype.$ldaddressItem = ld_address_item_res;
	Vue.prototype.$ld = {
		util: ld_util["a" /* default */],
		config: {

		}
	};

	Vue.component('ld-page-loading', ld_page_loading);

	Vue.component('ld-forms', ld_forms);

	Vue.component('ld-icon', ld_icon);

	Vue.component('ld-tags', ld_tags);

	Vue.component('ld-address', ld_address);

	Vue.component('ld-params', ld_params);

	Vue.component('ld-images', ld_images);


}


/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
}
/* harmony default export */ var lib = ({ 
	version: '1.0.0',
	// locale: locale.use,
	// i18n: locale.i18n,
	install,
	ldPageLoading: ld_page_loading,
	ldForms: ld_forms,
	ldIcon: ld_icon,
	ldTags: ld_tags,
	ldAddress: ld_address,
	ldParams: ld_params,
	ldImages: ld_images,
	
});


// CONCATENATED MODULE: C:/Users/Administrator.000/AppData/Roaming/npm/node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (lib);



/***/ }),

/***/ "2444":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("c532");
var normalizeHeaderName = __webpack_require__("c8af");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("b50d");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__("b50d");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("b6d9")))

/***/ }),

/***/ "2d83":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("387f");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "2e67":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "30b5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "387f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "3934":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "467f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("2d83");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "49d5":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "4a7b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "508e":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "5270":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var transformData = __webpack_require__("c401");
var isCancel = __webpack_require__("2e67");
var defaults = __webpack_require__("2444");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "5514":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_address_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("49d5");
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_address_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_address_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "5d41":
/***/ (function(module, exports) {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};


/***/ }),

/***/ "5f02":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "6d29":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
const config = {
	/**
	 * layout-dynamic 支持的插件类型
	 */
	layoutType: [
		'tip',
		'text',
		'image',
		'sysdate',
		'createtime',
		'datakey',
		'address',
		'addr',
		"label",
		"tag",
		'textarea',
		'date',
		'radio',
		'checkbox',
		'select',
		'icon',
		'object',
		'array',
		'param',
		'slot', //插槽
		'number', //计数器
		'switch', //开关
		'slider', //滑块
		'rate', //评分
		'color', //颜色选择器
		'transfer', //穿梭框
	],
	/**
	 * 在操作过程中需要 将指定类型的数据值转成 Array
	 */
	layoutTypeArray: [
		'checkbox',
		'tag',
		'image',
		'transfer'
	],
	/**
	 * 在操作过程中需要 将指定类型的数据值转成 Object
	 */
	layoutTypeObject: [
		'param'
	],
	/**
	 * 最终获取数据之前，数据是否进行特殊处理
	 */
	layoutTypeEmitParser: {
		isParse: true,
		ArraySplit: {
			//开启类型转换 ，json stringify to parse
			isJSON: true,
			//json to url
			chart: '|',
		},
		ObjectSplit: {
			//开启类型转换 ，json stringify to parse
			isJSON: true,
			//json to url
			isURL: true,
		}
	},
	/**
	 * 格式化日期字符串
	 */
	layoutDateFormat: {
		year: 'yyyy',
		month: 'yyyy-MM',
		date: 'yyyy-MM-dd',
		dates: '',
		week: '',
		datetime: 'yyyy-MM-dd HH:mm:ss',
		datetimerange: '',
		daterange: '',
		monthrange: '',
	},
	/**
	 * ColorPicker 预定义颜色
	 */
	layoutColorPacikerDefaultList: [
		'#ff4500',
		'#ff8c00',
		'#ffd700',
		'#90ee90',
		'#00ced1',
		'#1e90ff',
		'#c71585',
		'rgba(255, 69, 0, 0.68)',
		'rgb(255, 120, 0)',
		'hsv(51, 100, 98)',
		'hsva(120, 40, 94, 0.5)',
		'hsl(181, 100%, 37%)',
		'hsla(209, 100%, 56%, 0.73)',
		'#c7158577'
	],
	_hasClearButton: [
		'icon',
		'address',
		'tag'
	],
	_errTextPrefix: {
		select: ['select', 'icon','rate', 'checkbox','radio'],
		write: ['date', 'tag', 'select']
	}
}



/***/ }),

/***/ "6e95":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_forms_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e2b7");
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_forms_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_forms_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "7a77":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "7aac":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "7eef":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_tags_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e186");
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_tags_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_tags_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "8006":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "83b9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__("d925");
var combineURLs = __webpack_require__("e683");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "8df4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("7a77");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "a773":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("b6d9")))

/***/ }),

/***/ "aa1d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const {
	config
} = __webpack_require__("6d29");
/* harmony default export */ __webpack_exports__["a"] = ({
	name: 'ld-forms',
	props: {
		isOverflowY: {
			type: Boolean,
			default: false,
		},
		/**
		 * 是否显示tip按钮
		 */
		showTipButton: {
			type: Boolean,
			default: false,
		},
		/**
		 * 是否默认显示tip文字
		 */
		showDefaultTip: {
			type: Boolean,
			default: false,
		},
		/**
		 * 是否是行模式
		 */
		isRow: {
			type: Boolean,
			default: false,
		},
		/**
		 * 列数
		 */
		cols: {
			type: Number,
			default: 1
		},
		/**
		 * 文字位置
		 */
		labelPosition: {
			type: String,
			default: 'right',
		},
		/**
		 * 是否自动保存
		 */
		autoSave: {
			type: Boolean,
			default: true,
		},
		/**
		 * 当前组件封装层数过多时，element-date日期控件会出现，
		 * 不能及时刷新的问题，此时需要设置该属性为 true
		 */
		isMoreLevelUpdateElDate: {
			type: Boolean,
			default: false,
		},

		//布局、参数和按钮
		/**
		 * 默认表单数据
		 */
		form: {
			type: Object,
			default: () => {
				return {};
			}
		},
		/**
		 * 布局参数
		 */
		layout: {
			type: Array,
			default: () => {
				return [];
			}
		},

	},
	data() {
		return {
			/**
			 * layout-dynamic 支持的插件类型
			 */
			layoutType: config.layoutType,
			/**
			 * 在操作过程中需要 将指定类型的数据值转成 Array
			 */
			layoutTypeArray: config.layoutTypeArray,
			/**
			 * 在操作过程中需要 将指定类型的数据值转成 Object
			 */
			layoutTypeObject: config.layoutTypeObject,
			/**
			 * 最终获取数据之前，数据是否进行特殊处理
			 */
			layoutTypeEmitParser: config.layoutTypeEmitParser,
			/**
			 * 格式化日期字符串
			 */
			layoutDateFormat: config.layoutDateFormat,
			/**
			 * ColorPicker 预定义颜色
			 */
			layoutColorPacikerDefaultList: config.layoutColorPacikerDefaultList,
			/**
			 * 有清除按钮的组件
			 */
			hasClearButton: config._hasClearButton,
			/**
			 * 类型提示文字 
			 */
			errTextPrefix: config._errTextPrefix,



			showDefaultTips: this.showDefaultTip,
			fcols: this.cols,
			forms: this.form,
			layouts: this.layout,
			loading: false,
		}
	},
	watch: {
		form(news) {
			this.forms = news;
			this.formReset(null);
		},
		layout(news) {
			this.layouts = news;
			//获取远程加载数据
			this.getRemoteOptions();
		},
		cols(news) {
			this.fcols = news;
		},
		showDefaultTip(news) {
			this.showDefaultTips = news;
		}
	},
	methods: {
		/**
		 * 生成日期或时间
		 * @param {Object} item
		 */
		getDateOrTime(item) {
			let isUpdate = item['update'] || false;
			if (this.forms[item['prop']] && !isUpdate) {
				return this.forms[item['prop']];
			}
			let date = "";
			if (!item['dateType'] || item['dateType'].toLowerCase() == 'datetime') {
				date = this.$ld.util.getNowDT();
			} else
			if (item['dateType'].toLowerCase() == 'date') {
				date = this.$ld.util.getNowD();
			} else if (item['dateType'].toLowerCase() == 'time') {
				date = this.$ld.util.getNowT();
			}
			this.$set(this.forms, item['prop'], date);
			return date;
		},
		/**
		 * 是否是期望的数据类型
		 * @param {Object} item
		 * @param {Object} layoutType
		 */
		isControlsType(item, layoutType) {
			return item['type'] == layoutType || item['type'].toLocaleLowerCase() == layoutType.toLocaleLowerCase();
		},
		/**
		 * 是否禁用
		 * @param {Object} item
		 */
		getDisabled(item) {
			return item['disabled'] == true || item['readonly'] == true;
		},
		/**
		 * 获取提示文字
		 */
		getPlaceholder(item) {
			const msg = this.errTextPrefix.select.includes(item['type']) ? '请选择' : this.errTextPrefix.write.includes(
				item['type']) ? '请填写' : '请输入';

			let text = item['placeholder'] ||
				`${msg}${item['label']}`;
			return this.getDisabled(item) ? `${item['label']}` : text;
		},
		/**
		 * 加载远程数据
		 */
		getRemoteOptions() {

		},
		/**
		 * 重置
		 */
		formReset() {
			this.forms = this.forms || {};
			this.layouts.map(item => {
				let val = "";
				try {
					val = this.forms && this.forms[item['prop']] ? this.forms[item['prop']] : '';
					val = val ? val : item['value'] ? item['value'] : '';
					//转换数据类型 Array
					if (this.layoutTypeEmitParser.isParse && this.layoutTypeArray && this.layoutTypeArray
						.length > 0 &&
						this.layoutTypeArray.includes(item['type'])) {
						if (this.layoutTypeEmitParser.ArraySplit.isJSON && !item['parseType']) {
							try {
								val = JSON.parse(val);
							} catch (e) {
								val = eval(`(${val})`);
								val = typeof val == 'string' ? eval(`(${val})`) : val;
							}
						} else {
							val = Array.isArray(val) ? val : typeof val == 'string' ? val.split(item[
									'splitChart'] || this
								.layoutTypeEmitParser
								.ArraySplit.chart) : [];
							val = val.map(v => v.trim());
						}
					}
					//转换数据类型为 Object
					if (this.layoutTypeEmitParser.isParse && this.layoutTypeObject && this.layoutTypeObject
						.length > 0 &&
						this.layoutTypeObject.includes(item['type'])) {
						//使用 JSON.parse转换，传入参数必须是json 或者url
						if (this.layoutTypeEmitParser.ObjectSplit.isJSON) {
							if (!item['parseType'] || item['parseType'].toLocaleLowerCase() == 'json') {
								try {
									val = JSON.parse(val);
								} catch (e) {
									val = eval(`(${val})`);
									val = typeof val == 'string' ? eval(`(${val})`) : val;
								}
							}
						}
						if (this.layoutTypeEmitParser.ObjectSplit.isJSON) {
							if (item['parseType'] && item['parseType'].toLocaleLowerCase() != 'json') {
								try {
									val = typeof val == 'string' && val.indexOf('&') > 0 && val.indexOf('=') >
										0 ? this.$ld.util
										.urlToObj(val.indexOf('?') >= 0 ? val : `?${val}`) : {};
								} catch (e) {}
							}
						}
						val = typeof val == 'object' ? val : {};
					}
					//
				} catch (e2) {}
				this.$set(this.forms, item['prop'], val);
			});
		},
		/**
		 *赋值
		 */
		ldChangeValToForm(item, event, index, key) {
			let prop = item['prop'];
			this.$set(this.forms, prop, key ? event[key] : event);
			this.regexFormVal(item, index);
		},

		/**
		 * 数据校验
		 */
		regexFormVal(item, i, info) {
			// if (typeof info == 'object') {
			//   if (info['type'] == 'checkbox') {
			//     let _v = this.forms[item['prop']];
			//     if (info['checked']) {
			//       if (!_v.includes(info['value'])) {
			//         _v[_v.length] = info['value'];
			//       }
			//     } else {
			//       _v = _v.filter(item => item != info['value'])
			//     }
			//     this.$set(this.forms, item['prop'], _v);
			//   }
			// }

			this.$set(this.layouts[i], "error", false)
			this.$set(this.layouts[i], "errorMsg", `验证通！`)
			let readonly = this.getDisabled(item);
			if (readonly == true) {
				return true;
			}
			let _requir = item['require'] || false;
			let _val = this.forms[item['prop']] || '';
			_val = !_val ? "" : _val;
			if (_requir == false && !_val) {
				this.$set(this.layouts[i], "error", false)
				this.$set(this.layouts[i], "errorMsg", `验证通！`)
				return true;
			}
			if (_requir == true && _val.length <= 0) {
				this.$set(this.layouts[i], "error", true)
				const msg = this.errTextPrefix.select.includes(item['type']) ? '未选择' : this.errTextPrefix.write
					.includes(item['type']) ? '不能为空' : '不能为空';

				this.$set(this.layouts[i], "errorMsg",
					`${item['label']||item['placeholder'] ||''}${msg}`
				)
				if (this.errorType == 'alert') {
					this.$message.error(this.layouts[i]['errorMsg'])
				}
				return false;
			}
			let msg = item['msg'] || `${item['label']||item['placeholder'] ||''}不符合验证规则！`;
			let _regex = item['regex'];
			try {
				if (_regex instanceof RegExp && _val) {
					let flg = _regex && !_regex.test(_val)
					this.$set(this.layouts[i], "error", flg)
					this.$set(this.layouts[i], "errorMsg", !flg ? '验证通过' : msg)
					if (this.errorType == 'alert' && flg) {
						this.$message.error(this.layouts[i]['errorMsg'])
					}
					return !flg;
				}
			} catch (e) {
				//TODO handle the exception
			}
			if (typeof _regex == 'function') {
				let flg = !_regex(_val)
				this.$set(this.layouts[i], "error", flg)
				this.$set(this.layouts[i], "errorMsg", !flg ? '验证通过' : msg)
				if (this.errorType == 'alert' && flg) {
					this.$message.error(this.layouts[i]['errorMsg'])
				}
				return !flg;
			}
			return true;

		}

	},
	created() {
		this.formReset();
		console.log(config.layoutType)
	}
});


/***/ }),

/***/ "b50d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var settle = __webpack_require__("467f");
var cookies = __webpack_require__("7aac");
var buildURL = __webpack_require__("30b5");
var buildFullPath = __webpack_require__("83b9");
var parseHeaders = __webpack_require__("c345");
var isURLSameOrigin = __webpack_require__("3934");
var createError = __webpack_require__("2d83");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "b6d9":
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    setTimeout(function () {
        fn.apply(null, args);
    }, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__("a773");
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),

/***/ "bc3a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("cee4");

/***/ }),

/***/ "c2d1":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c345":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "c401":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "c532":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("1d2b");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "c8af":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "cee4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var bind = __webpack_require__("1d2b");
var Axios = __webpack_require__("0a06");
var mergeConfig = __webpack_require__("4a7b");
var defaults = __webpack_require__("2444");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("7a77");
axios.CancelToken = __webpack_require__("8df4");
axios.isCancel = __webpack_require__("2e67");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("0df6");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__("5f02");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "d925":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "e186":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e2b7":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e683":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "f4bb":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _lib_utils_pingying_pingying_util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("faf9");




/**
 *
 * describe: 常用函数工具类
 * author:jpw
 * Date:2019/12/3
 * Time:9:56
 *
 * */
/**
 * 指定下标位置插入字符串
 * @param {String} insertStr 原字符串
 * @param {Number} start 开始下标
 * @param {Number} end  结束下标
 * @param {String} insertStr 插入字符
 */
const insertAndReplaceToStr = function(oldStr, start, end, insertStr) {
  let temp = start;
  start = start > end ? end : start;
  end = start > end ? temp : end;
  return oldStr.slice(0, start) + insertStr + oldStr.slice(end);
};

/**
 * 指定下标位置插入字符串
 * @param {Object} start 开始下标
 * @param {Object} insertStr 插入字符
 */
const insertToStr = function(oldStr, start, insertStr) {
  return oldStr.slice(0, start) + insertStr + oldStr.slice(start);
};



const changeImagePath = function(url, readImgPath, readImgDefaultPath) {
  if (!url || url.trim().length <= 0) {
    return readImgDefaultPath;
  }
  if ((url + "").trim().indexOf("http") < 0) {
    return readImgPath + url;
  }
  return url;
}
const uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 10 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(10);
  });
}

//获取两个日期之间的时间差
const getDayDiff = function(endDate, startDate) {
  startDate = startDate || getNowD();
  startDate = typeof startDate == "string" ? new Date(startDate) : startDate;
  endDate = typeof endDate == "string" ? new Date(endDate) : endDate;
  var s1 = startDate.getTime(),
    s2 = endDate.getTime();
  var total = (s2 - s1) / (1000 * 24 * 60 * 60);
  var day = parseInt(total); //计算整数天数
  return day;
}
/**
 * 得到当前日期  年月日
 */
const getNowD = function(addDay, date) {
  date = date || new Date();
  addDay = addDay || 0;
  date.setDate(date.getDate() + addDay);
  return date.getFullYear() + "-" + padLeft((date.getMonth() + 1), 2) + "-" + padLeft(date.getDate(), 2);
}

/**
 * 得到当前日期  年月日 时分秒
 */
const getNowDT = function(addDay, date) {
  date = date || new Date();
  addDay = addDay || 0;
  date.setDate(date.getDate() + addDay);
  return date.getFullYear() + "-" + padLeft((date.getMonth() + 1), 2) + "-" + padLeft(date.getDate(), 2) +
    " " + padLeft(date.getHours(), 2) + ":" + padLeft(date.getMinutes(), 2) + ":" + padLeft(date.getSeconds(),
      2);
}


/**
 * 得到当前时间 或者在当前时间的基础上 加上一定的时间
 * @param addMinutes  1分钟 = 1*60*1000
 * @param date
 * @return {string}
 */
const getNowT = function(addMinutes, date) {
  date = date || new Date();
  addMinutes = addMinutes || 0;
  date.setTime(date.getTime() + addMinutes);
  return padLeft(date.getHours(), 2) + ":" + padLeft(date.getMinutes(), 2) + ":" + padLeft(date.getSeconds(), 2);
}

/**
 * 将数字串转换成日期格式的字符串
 * @param number
 * @return {*}
 */
const getDateByNumber = function(number) {
  if (!isNaN(number)) {
    number = parseInt(number);
    return getNowDT(0, new Date(number));
  }
  return number;
}

//对数字进行前置补位
const padLeft = function(num, length) {
  return ("0000000000000000" + num).substr(-length);
}
/**-----------样式操作 */
//添加style
const changeStyle = function(className, style) {
  var classList = document.getElementsByClassName(className);
  for (let i = 0; i < classList.length; i++) {
    for (let k in style) {
      classList[i].style[k] = style[k];
    }
  }
}

const getScreenStyle = function() {
  var _w = document.body.clientWidth || document.body.offsetWidth;
  var left = (_w > 1200 ? (_w - 1200) / 2 : 8) + "px";
  var width = _w > 1200 ? "1200px" : (_w - 16) + "px";
  var t = "margin-left:" + left + ";width:" + width;
  return t;
}
/**
 * 对象转字符串
 * @param {Object} obj
 */
const objeToStr = function(obj) {
  var newObj = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] instanceof Function) {
      newObj[key] = obj[key].toString().replace(/[\n\t]/g, "");
      continue;
    }
    newObj[key] = obj[key];
  }
  return JSON.stringify(newObj);
}
/**
 * 对象转字符串
 * @param {Object} obj
 */
const objeToStrUse = function(obj) {
  var _function = "";
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] instanceof Function) {
      _function += ("@" + obj[key].toString()).replace(/^@function/, "") + ",";
      continue;
    }
  }
  return `{${_function}}`;
}
/**
 * 驼峰转换，将小驼峰转成大驼峰
 * @param {String} str
 */
const smallHumpToBig = function(str) {
  str = str.replace(/[-][^-_]{1}|[_][^-_]{1}/g, function(r) {
    return r.toUpperCase().replace(/[_-]/g, '');
  })
  return str;
}

/**
 * 驼峰转换，将大驼峰转成小驼峰
 * @param {String} str
 * @param {String} char 分割字符 default -
 * 
 */
const bigHumpToSmall = function(str, char) {
  char = char || '-';
  str = str.replace(/[A-Z]/g, function(r) {
    return char + (r.toLowerCase());
  })
  return str;
}

/**
 * 小驼峰转大驼峰 test_name-> testName ，并处理首字母
 * @param {String} str
 * @param {Boolean} fristCharToUpper
 */
const firstCharCmallHumpToBig = function(str, fristCharToUpper) {
  fristCharToUpper = fristCharToUpper || false,
    str = str.toLocaleLowerCase();
  str = smallHumpToBig(str);
  return fristCharToUpper ? str.replace(/^[a-z]/, (e) => {
    return e.toLocaleUpperCase()
  }) : str;
}

/**
 * 将对象转换成数组
 * @param {Object} obj 对象
 */
const objConverArray = function(obj) {
  try {
    var ar = [];
    Object.keys(obj).forEach(r => {
      var _o = obj[r];
      _o["$key"] = r;
      ar[ar.length] = _o;
    });
    return ar;
  } catch (e) {
    //TODO handle the exception
    return [];
  }
}

/**
 * 对象复制
 */

const clone = function(target) {
  var buf;
  if (typeof target == "function") {
    return target;
  }
  if (Array.isArray(target)) {
    buf = []; //创建一个空的数组 
    var i = target.length;
    while (i--) {
      buf[i] = clone(target[i]);
    }
    return buf;
  }
  if (target instanceof Object) {
    buf = {}; //创建一个空对象 
    for (var k in target) { //为这个对象添加新的属性 
      buf[k] = clone(target[k]);
    }
    return buf;
  }

  return target;
}

/**
 * 转换数组或对象为字符串
 */
const stringify = function(data) {
  return objToStringify(data).replace(/,[}]/g, "}").replace(/,\]/g, "]")
}
const objToStringify = function(data) {
  if (typeof data == 'function' || typeof data == "number" || typeof data == "boolean") {
    return `${data}`;
  }
  if (typeof data == 'string') {
    return `'${data}'`;
  }
  if (Array.isArray(data)) {
    let str = '[';
    let end = ']';
    data.forEach(item => {
      str += `${stringify(item)},`;
    });
    return str + end;
  }
  if (data instanceof Object) {
    let str = '{';
    let end = '}';
    Object.keys(data).map(key => {
      str += `${key}:${stringify(data[key])},`;
    });
    return str + end;
  }
  return data + '';
}

/**
 * String转换成对象或数组
 * @param {String} strObj 转换的字符串
 * @param {Object} global {key:'_Vue'[String],val:_Vue[Object]} 全局变量key:在转换的代码中出现的全局变量名称，val:出现的全局变量名称所代表的值
 * @param {any} error 错误信息
 */
const parseObj = function(strObj, global, error) {
  try {
    return eval(!global ? `(${strObj})` : `((${global.key})=>{ return ${strObj} })(${global.val})`);
  } catch (e) {
    if (error) {
      throw e;
    }
    return strObj;
  }
}

/**
 * 加解密字符串
 * @param {Object} str
 */
const encryptionChar = "水果是橙子"
const encryption = {
  /**
   * 加密
   * @param {Object} str
   */
  set: function(str) {

      /**
       * 根据字符串获取进制编码
       * @param {Object} char
       * @param {Object} binary
       */
      var getCode = function(char, binary) {
        binary = binary || 16;
        return parseInt(char.charCodeAt(0).toString(binary))
      }
      /**
       * 获取加盐值
       */
      var _encry = (function() {
        let n = 0;
        for (let j = 0; j < encryptionChar.length; j++) {
          var _s = encryptionChar[j];
          n += parseInt(getCode(_s, 7));
        }
        return n;
      })();
      var _str = '';
      for (let i = 0; i < str.length; i++) {
        var _b = parseInt(getCode(str[i], 9));
        _b += _encry;
        _str += _b + (i < str.length - 1 ? "0y" : '');
      }
      return encodeURI(_str);
    }
    /**
     * 解密
     * @param {Object} str
     */
    ,
  get: function(str) {
    /**
     * 根据字符串获取进制编码
     * @param {Object} char
     * @param {Object} binary
     */
    var getCode = function(char, binary) {
      binary = binary || 16;
      return parseInt(char.charCodeAt(0).toString(binary))
    }
    /**
     * 获取加盐值
     */
    var _encry = (function() {
      let n = 0;
      for (let j = 0; j < encryptionChar.length; j++) {
        var _s = encryptionChar[j];
        n += parseInt(getCode(_s, 7));
      }
      return n;
    })();
    str = decodeURI(str);
    let ar = str.split("0y");
    var _str = '';
    for (let i = 0; i < ar.length; i++) {
      var n = parseInt(ar[i]);
      n -= _encry;
      _str += String.fromCharCode(parseInt(n + "", 9));
    }
    return _str;
  }
}

/**
 * @param {Object} str
 */
const hashCode = function(str) {
  var hash = 0,
    i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * 获取data的数据类型 int float string object array
 * @param {Object} data
 */
const getDataType = function(data) {
  return typeof data == 'boolean' ? 'boolean' :
    typeof data == 'number' && (data + '').indexOf('.') < 0 ? 'int' :
    typeof data == 'number' && (data + '').indexOf('.') > 0 ? 'float' :
    typeof data == 'string' ? 'string' :
    Object.prototype.toString.call(data) == '[object Object]' ? 'object' :
    Array.isArray(data) ? 'array' : 'string';
}

/**
 * 得到随机数字 (包前不包后)
 * @param {Object} min 最小值
 * @param {Object} max 最大值
 * @param {Object} type 类型
 * 						0		  只保留整数(默认值)
 * 						1 		  向上取整
 * 						2 		  向下取整
 * 						3 		  四舍五入
 * 
 */
const randomNum = function(min, max, type) {
  var random = Math.random() * (max - min) + min;
  switch (type) {
    case 1:
      return Math.ceil(random);
    case 2:
      return Math.floor(random);
    case 3:
      return Math.round(random);
    default:
      return parseInt(random);
  }
}

/**
 * 随机产生计算
 */
const randomNumFormula = function() {
  var yinshi = ['+', '-', '*', '/'];
  var y = randomNum(0, yinshi.length - 1);

  var num1 = randomNum(0, y > 1 ? 10 : 20, 0);
  var num2 = randomNum(4, 10, 0);
  return `${num1}${yinshi[y]}${num2}`
}

/**
 * 根据日期生成对应的时段
 */
const _hourSplitArray = [{
    hour: 6,
    text: '凌晨'
  },
  {
    hour: 9,
    text: '早上'
  },
  {
    hour: 12,
    text: '上午'
  },
  {
    hour: 14,
    text: '中午'
  },
  {
    hour: 17,
    text: '下午'
  },
  {
    hour: 19,
    text: '傍晚'
  },
  {
    hour: 22,
    text: '晚上'
  },
  {
    hour: 24,
    text: '夜里'
  }
]
const getTimeSplit = function() {
  var now = new Date()
  var hour = now.getHours()
  for (let i = 0; i < _hourSplitArray.length; i++) {
    var _h = _hourSplitArray[i]['hour'];
    if (hour < _h) {
      return _hourSplitArray[i]['text']
    }
  }
  return txet = ''
}



const idCardCheck = function(code) {

  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  var tip = "";
  var pass = true;

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "校验位错误";
        pass = false;
      }
    }
  }
  if (!pass) alert(tip);
  return pass;
}
/**
 * 对象转url字符串
 * @param {Object} obj
 * @param {Object} isStartChart
 */
const objToParam = function(obj, isStartChart) {
  var url = "";
  Object.keys(obj).map(r => {
    url += `${r}=${obj[r]}&`;
  });
  return isStartChart ? '?' + url : url;
}
/**
 * url字符串 转成 将对象
 * @param {Object} obj
 * @param {Object} isStartChart
 */
const urlToObj = function(url) {
  let _url = url.split("?");
  if (_url.length <= 1) {
    return {
      action: _url[0]
    };
  }
  let l = ('{"' + _url[1].replace(/&=/g, '').replace(/[=]/g, '":"').replace(/[&]/g, '","') + '"}').replace('","}',
    '"}');
  l = JSON.parse(l);
  if (_url[0] && _url[0].length > 0) {
    l['action'] = _url[0];
  }
  return l;
}

/**
 * 金额大写
 * @param {Object} n
 */
const digitUppercase = function(n) {
  let _n = n.indexOf(".") < 0 ? (n + ".") : n;
  _n = _n.replace(/[.][0-9]*$/g, "");
  if (_n.length > 12) {
    return "数字太大，请确认金额！"
  }
  var fraction = ['角', '分'];
  var digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  var s = '';
  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

const randomChar = function(len) {
  var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var tmp = "";
  var timestamp = new Date().getTime();
  for (var i = 0; i < 5; i++) {
    tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
  }
  return tmp;
}
//获取ip
const os = __webpack_require__("5d41");
const getIp = function() {
  let ip = '127.0.0.1';
  let ifaces = os.networkInterfaces();
  for (var i in ifaces) {
    for (var j in ifaces[i]) {
      var val = ifaces[i][j]
      if (val.family === 'IPv4' && val.address !== '127.0.0.1') {
        ip = val.address
        break
      }
    }
  }
  return ip;
}




/* harmony default export */ __webpack_exports__["a"] = ({
  changeImagePath,
  uuid,
  getDateByNumber,
  getDayDiff,
  getNowD,
  getNowDT,
  getNowT,
  getTimeSplit,

  encryption,

  randomNum,
  randomNumFormula,
  randomChar,

  changeStyle,
  getScreenStyle,
  objeToStr,
  objeToStrUse,
  bigHumpToSmall,
  smallHumpToBig,
  firstCharCmallHumpToBig,
  objConverArray,
  hashCode,
  getDataType,
  objToParam,
  urlToObj,

  digitUppercase,

  clone,
  parseObj,
  stringify,
  insertToStr,
  insertAndReplaceToStr,

  //拼音
  pingyin: _lib_utils_pingying_pingying_util_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"],
  idCardCheck,

  getIp,

});


/***/ }),

/***/ "f6b4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "faf9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./src/lib/utils/pingying/pinyin_dict_firstletter.js
 
const pinyin = {
    'a': '\u554a\u963f\u9515',
    'ai': '\u57c3\u6328\u54ce\u5509\u54c0\u7691\u764c\u853c\u77ee\u827e\u788d\u7231\u9698\u8bf6\u6371\u55f3\u55cc\u5ad2\u7477\u66a7\u7839\u953f\u972d',
    'an': '\u978d\u6c28\u5b89\u4ffa\u6309\u6697\u5cb8\u80fa\u6848\u8c19\u57ef\u63de\u72b4\u5eb5\u6849\u94f5\u9e4c\u9878\u9eef',
    'ang': '\u80ae\u6602\u76ce',
    'ao': '\u51f9\u6556\u71ac\u7ff1\u8884\u50b2\u5965\u61ca\u6fb3\u5773\u62d7\u55f7\u5662\u5c99\u5ed2\u9068\u5aaa\u9a9c\u8071\u87af\u93ca\u9ccc\u93d6',
    'ba': '\u82ad\u634c\u6252\u53ed\u5427\u7b06\u516b\u75a4\u5df4\u62d4\u8dcb\u9776\u628a\u8019\u575d\u9738\u7f62\u7238\u8307\u83dd\u8406\u636d\u5c9c\u705e\u6777\u94af\u7c91\u9c85\u9b43',
    'bai': '\u767d\u67cf\u767e\u6446\u4f70\u8d25\u62dc\u7a17\u859c\u63b0\u97b4',
    'ban': '\u6591\u73ed\u642c\u6273\u822c\u9881\u677f\u7248\u626e\u62cc\u4f34\u74e3\u534a\u529e\u7eca\u962a\u5742\u8c73\u94a3\u7622\u764d\u8228',
    'bang': '\u90a6\u5e2e\u6886\u699c\u8180\u7ed1\u68d2\u78c5\u868c\u9551\u508d\u8c24\u84a1\u8783',
    'bao': '\u82de\u80de\u5305\u8912\u96f9\u4fdd\u5821\u9971\u5b9d\u62b1\u62a5\u66b4\u8c79\u9c8d\u7206\u52f9\u8446\u5b80\u5b62\u7172\u9e28\u8913\u8db5\u9f85',
    'bo': '\u5265\u8584\u73bb\u83e0\u64ad\u62e8\u94b5\u6ce2\u535a\u52c3\u640f\u94c2\u7b94\u4f2f\u5e1b\u8236\u8116\u818a\u6e24\u6cca\u9a73\u4eb3\u8543\u5575\u997d\u6a97\u64d8\u7934\u94b9\u9e41\u7c38\u8ddb',
    'bei': '\u676f\u7891\u60b2\u5351\u5317\u8f88\u80cc\u8d1d\u94a1\u500d\u72c8\u5907\u60eb\u7119\u88ab\u5b5b\u9642\u90b6\u57e4\u84d3\u5457\u602b\u6096\u789a\u9e4e\u8919\u943e',
    'ben': '\u5954\u82ef\u672c\u7b28\u755a\u574c\u951b',
    'beng': '\u5d29\u7ef7\u752d\u6cf5\u8e66\u8ff8\u552a\u5623\u750f',
    'bi': '\u903c\u9f3b\u6bd4\u9119\u7b14\u5f7c\u78a7\u84d6\u853d\u6bd5\u6bd9\u6bd6\u5e01\u5e87\u75f9\u95ed\u655d\u5f0a\u5fc5\u8f9f\u58c1\u81c2\u907f\u965b\u5315\u4ef3\u4ffe\u8298\u835c\u8378\u5421\u54d4\u72f4\u5eb3\u610e\u6ed7\u6fde\u5f3c\u59a3\u5a62\u5b16\u74a7\u8d32\u7540\u94cb\u79d5\u88e8\u7b5a\u7b85\u7be6\u822d\u895e\u8df8\u9ac0',
    'bian': '\u97ad\u8fb9\u7f16\u8d2c\u6241\u4fbf\u53d8\u535e\u8fa8\u8fa9\u8fab\u904d\u533e\u5f01\u82c4\u5fed\u6c74\u7f0f\u7178\u782d\u78a5\u7a39\u7a86\u8759\u7b3e\u9cca',
    'biao': '\u6807\u5f6a\u8198\u8868\u5a4a\u9aa0\u98d1\u98d9\u98da\u706c\u9556\u9573\u762d\u88f1\u9cd4',
    'bie': '\u9cd6\u618b\u522b\u762a\u8e69\u9cd8',
    'bin': '\u5f6c\u658c\u6fd2\u6ee8\u5bbe\u6448\u50a7\u6d5c\u7f24\u73a2\u6ba1\u8191\u9554\u9acc\u9b13',
    'bing': '\u5175\u51b0\u67c4\u4e19\u79c9\u997c\u70b3\u75c5\u5e76\u7980\u90b4\u6452\u7ee0\u678b\u69df\u71f9',
    'bu': '\u6355\u535c\u54fa\u8865\u57e0\u4e0d\u5e03\u6b65\u7c3f\u90e8\u6016\u62ca\u535f\u900b\u74ff\u6661\u949a\u91ad',
    'ca': '\u64e6\u5693\u7924',
    'cai': '\u731c\u88c1\u6750\u624d\u8d22\u776c\u8e29\u91c7\u5f69\u83dc\u8521',
    'can': '\u9910\u53c2\u8695\u6b8b\u60ed\u60e8\u707f\u9a96\u74a8\u7cb2\u9eea',
    'cang': '\u82cd\u8231\u4ed3\u6ca7\u85cf\u4f27',
    'cao': '\u64cd\u7cd9\u69fd\u66f9\u8349\u8279\u5608\u6f15\u87ac\u825a',
    'ce': '\u5395\u7b56\u4fa7\u518c\u6d4b\u5202\u5e3b\u607b',
    'ceng': '\u5c42\u8e6d\u564c',
    'cha': '\u63d2\u53c9\u832c\u8336\u67e5\u78b4\u643d\u5bdf\u5c94\u5dee\u8be7\u7339\u9987\u6c4a\u59f9\u6748\u6942\u69ce\u6aab\u9497\u9538\u9572\u8869',
    'chai': '\u62c6\u67f4\u8c7a\u4faa\u8308\u7625\u867f\u9f87',
    'chan': '\u6400\u63ba\u8749\u998b\u8c17\u7f20\u94f2\u4ea7\u9610\u98a4\u5181\u8c04\u8c36\u8487\u5edb\u5fcf\u6f7a\u6fb6\u5b71\u7fbc\u5a75\u5b17\u9aa3\u89c7\u7985\u9561\u88e3\u87fe\u8e94',
    'chang': '\u660c\u7316\u573a\u5c1d\u5e38\u957f\u507f\u80a0\u5382\u655e\u7545\u5531\u5021\u4f25\u9b2f\u82cc\u83d6\u5f9c\u6005\u60dd\u960a\u5a3c\u5ae6\u6636\u6c05\u9cb3',
    'chao': '\u8d85\u6284\u949e\u671d\u5632\u6f6e\u5de2\u5435\u7092\u600a\u7ec9\u6641\u8016',
    'che': '\u8f66\u626f\u64a4\u63a3\u5f7b\u6f88\u577c\u5c6e\u7817',
    'chen': '\u90f4\u81e3\u8fb0\u5c18\u6668\u5ff1\u6c89\u9648\u8d81\u886c\u79f0\u8c0c\u62bb\u55d4\u5bb8\u741b\u6987\u809c\u80c2\u789c\u9f80',
    'cheng': '\u6491\u57ce\u6a59\u6210\u5448\u4e58\u7a0b\u60e9\u6f84\u8bda\u627f\u901e\u9a8b\u79e4\u57d5\u5d4a\u5fb5\u6d48\u67a8\u67fd\u6a18\u665f\u584d\u77a0\u94d6\u88ce\u86cf\u9172',
    'chi': '\u5403\u75f4\u6301\u5319\u6c60\u8fdf\u5f1b\u9a70\u803b\u9f7f\u4f88\u5c3a\u8d64\u7fc5\u65a5\u70bd\u50ba\u5880\u82aa\u830c\u640b\u53f1\u54e7\u557b\u55e4\u5f73\u996c\u6cb2\u5ab8\u6555\u80dd\u7719\u7735\u9e31\u761b\u892b\u86a9\u87ad\u7b1e\u7bea\u8c49\u8e05\u8e1f\u9b51',
    'chong': '\u5145\u51b2\u866b\u5d07\u5ba0\u833a\u5fe1\u61a7\u94f3\u825f',
    'chou': '\u62bd\u916c\u7574\u8e0c\u7a20\u6101\u7b79\u4ec7\u7ef8\u7785\u4e11\u4fe6\u5733\u5e31\u60c6\u6eb4\u59af\u7633\u96e0\u9c8b',
    'chu': '\u81ed\u521d\u51fa\u6a71\u53a8\u8e87\u9504\u96cf\u6ec1\u9664\u695a\u7840\u50a8\u77d7\u6410\u89e6\u5904\u4e8d\u520d\u61b7\u7ecc\u6775\u696e\u6a17\u870d\u8e70\u9edc',
    'chuan': '\u63e3\u5ddd\u7a7f\u693d\u4f20\u8239\u5598\u4e32\u63be\u821b\u60f4\u9044\u5ddb\u6c1a\u948f\u9569\u8221',
    'chuang': '\u75ae\u7a97\u5e62\u5e8a\u95ef\u521b\u6006',
    'chui': '\u5439\u708a\u6376\u9524\u5782\u9672\u68f0\u69cc',
    'chun': '\u6625\u693f\u9187\u5507\u6df3\u7eaf\u8822\u4fc3\u83bc\u6c8c\u80ab\u6710\u9e51\u877d',
    'chuo': '\u6233\u7ef0\u851f\u8fb6\u8f8d\u955e\u8e14\u9f8a',
    'ci': '\u75b5\u8328\u78c1\u96cc\u8f9e\u6148\u74f7\u8bcd\u6b64\u523a\u8d50\u6b21\u8360\u5472\u5d6f\u9e5a\u8785\u7ccd\u8d91',
    'cong': '\u806a\u8471\u56f1\u5306\u4ece\u4e1b\u506c\u82c1\u6dd9\u9aa2\u742e\u7481\u679e',
    'cu': '\u51d1\u7c97\u918b\u7c07\u731d\u6b82\u8e59',
    'cuan': '\u8e7f\u7be1\u7a9c\u6c46\u64ba\u6615\u7228',
    'cui': '\u6467\u5d14\u50ac\u8106\u7601\u7cb9\u6dec\u7fe0\u8403\u60b4\u7480\u69b1\u96b9',
    'cun': '\u6751\u5b58\u5bf8\u78cb\u5fd6\u76b4',
    'cuo': '\u64ae\u6413\u63aa\u632b\u9519\u539d\u811e\u9509\u77ec\u75e4\u9e7e\u8e49\u8e9c',
    'da': '\u642d\u8fbe\u7b54\u7629\u6253\u5927\u8037\u54d2\u55d2\u601b\u59b2\u75b8\u8921\u7b2a\u977c\u9791',
    'dai': '\u5446\u6b79\u50a3\u6234\u5e26\u6b86\u4ee3\u8d37\u888b\u5f85\u902e\u6020\u57ed\u7519\u5454\u5cb1\u8fe8\u902f\u9a80\u7ed0\u73b3\u9edb',
    'dan': '\u803d\u62c5\u4e39\u5355\u90f8\u63b8\u80c6\u65e6\u6c2e\u4f46\u60ee\u6de1\u8bde\u5f39\u86cb\u4ebb\u510b\u5369\u840f\u5556\u6fb9\u6a90\u6b9a\u8d55\u7708\u7605\u8043\u7baa',
    'dang': '\u5f53\u6321\u515a\u8361\u6863\u8c20\u51fc\u83ea\u5b95\u7800\u94db\u88c6',
    'dao': '\u5200\u6363\u8e48\u5012\u5c9b\u7977\u5bfc\u5230\u7a3b\u60bc\u9053\u76d7\u53e8\u5541\u5fc9\u6d2e\u6c18\u7118\u5fd1\u7e9b',
    'de': '\u5fb7\u5f97\u7684\u951d',
    'deng': '\u8e6c\u706f\u767b\u7b49\u77aa\u51f3\u9093\u5654\u5d9d\u6225\u78f4\u956b\u7c26',
    'di': '\u5824\u4f4e\u6ef4\u8fea\u654c\u7b1b\u72c4\u6da4\u7fdf\u5ae1\u62b5\u5e95\u5730\u8482\u7b2c\u5e1d\u5f1f\u9012\u7f14\u6c10\u7c74\u8bcb\u8c1b\u90b8\u577b\u839c\u837b\u5600\u5a23\u67e2\u68e3\u89cc\u7825\u78b2\u7747\u955d\u7f9d\u9ab6',
    'dian': '\u98a0\u6382\u6ec7\u7898\u70b9\u5178\u975b\u57ab\u7535\u4f43\u7538\u5e97\u60e6\u5960\u6dc0\u6bbf\u4e36\u963d\u576b\u57dd\u5dc5\u73b7\u765c\u766b\u7c1f\u8e2e',
    'diao': '\u7889\u53fc\u96d5\u51cb\u5201\u6389\u540a\u9493\u8c03\u8f7a\u94de\u8729\u7c9c\u8c82',
    'die': '\u8dcc\u7239\u789f\u8776\u8fed\u8c0d\u53e0\u4f5a\u57a4\u581e\u63f2\u558b\u6e2b\u8f76\u7252\u74de\u8936\u800b\u8e40\u9cbd\u9cce',
    'ding': '\u4e01\u76ef\u53ee\u9489\u9876\u9f0e\u952d\u5b9a\u8ba2\u4e22\u4ec3\u5576\u738e\u815a\u7887\u753a\u94e4\u7594\u8035\u914a',
    'dong': '\u4e1c\u51ac\u8463\u61c2\u52a8\u680b\u4f97\u606b\u51bb\u6d1e\u578c\u549a\u5cbd\u5cd2\u5902\u6c21\u80e8\u80f4\u7850\u9e2b',
    'dou': '\u515c\u6296\u6597\u9661\u8c46\u9017\u75d8\u8538\u94ad\u7aa6\u7aac\u86aa\u7bfc\u9161',
    'du': '\u90fd\u7763\u6bd2\u728a\u72ec\u8bfb\u5835\u7779\u8d4c\u675c\u9540\u809a\u5ea6\u6e21\u5992\u828f\u561f\u6e0e\u691f\u6a50\u724d\u8839\u7b03\u9ad1\u9ee9',
    'duan': '\u7aef\u77ed\u953b\u6bb5\u65ad\u7f0e\u5f56\u6934\u7145\u7c16',
    'dui': '\u5806\u5151\u961f\u5bf9\u603c\u619d\u7893',
    'dun': '\u58a9\u5428\u8e72\u6566\u987f\u56e4\u949d\u76fe\u9041\u7096\u7818\u7905\u76f9\u9566\u8db8',
    'duo': '\u6387\u54c6\u591a\u593a\u579b\u8eb2\u6735\u8dfa\u8235\u5241\u60f0\u5815\u5484\u54da\u7f0d\u67c1\u94ce\u88f0\u8e31',
    'e': '\u86fe\u5ce8\u9e45\u4fc4\u989d\u8bb9\u5a25\u6076\u5384\u627c\u904f\u9102\u997f\u5669\u8c14\u57a9\u57ad\u82ca\u83aa\u843c\u5443\u6115\u5c59\u5a40\u8f6d\u66f7\u816d\u786a\u9507\u9537\u9e57\u989a\u9cc4',
    'en': '\u6069\u84bd\u6441\u5514\u55ef',
    'er': '\u800c\u513f\u8033\u5c14\u9975\u6d31\u4e8c\u8d30\u8fe9\u73e5\u94d2\u9e38\u9c95',
    'fa': '\u53d1\u7f5a\u7b4f\u4f10\u4e4f\u9600\u6cd5\u73d0\u57a1\u781d',
    'fan': '\u85e9\u5e06\u756a\u7ffb\u6a0a\u77fe\u9492\u7e41\u51e1\u70e6\u53cd\u8fd4\u8303\u8d29\u72af\u996d\u6cdb\u8629\u5e61\u72ad\u68b5\u6535\u71d4\u7548\u8e6f',
    'fang': '\u574a\u82b3\u65b9\u80aa\u623f\u9632\u59a8\u4eff\u8bbf\u7eba\u653e\u531a\u90a1\u5f77\u94ab\u822b\u9c82',
    'fei': '\u83f2\u975e\u5561\u98de\u80a5\u532a\u8bfd\u5420\u80ba\u5e9f\u6cb8\u8d39\u82be\u72d2\u60b1\u6ddd\u5983\u7ecb\u7eef\u69a7\u8153\u6590\u6249\u7953\u7829\u9544\u75f1\u871a\u7bda\u7fe1\u970f\u9cb1',
    'fen': '\u82ac\u915a\u5429\u6c1b\u5206\u7eb7\u575f\u711a\u6c7e\u7c89\u594b\u4efd\u5fff\u6124\u7caa\u507e\u7035\u68fc\u610d\u9cbc\u9f22',
    'feng': '\u4e30\u5c01\u67ab\u8702\u5cf0\u950b\u98ce\u75af\u70fd\u9022\u51af\u7f1d\u8bbd\u5949\u51e4\u4ff8\u9146\u8451\u6ca3\u781c',
    'fu': '\u4f5b\u5426\u592b\u6577\u80a4\u5b75\u6276\u62c2\u8f90\u5e45\u6c1f\u7b26\u4f0f\u4fd8\u670d\u6d6e\u6daa\u798f\u88b1\u5f17\u752b\u629a\u8f85\u4fef\u91dc\u65a7\u812f\u8151\u5e9c\u8150\u8d74\u526f\u8986\u8d4b\u590d\u5085\u4ed8\u961c\u7236\u8179\u8d1f\u5bcc\u8ba3\u9644\u5987\u7f1a\u5490\u5310\u51eb\u90db\u8299\u82fb\u832f\u83a9\u83d4\u544b\u5e5e\u6ecf\u8274\u5b5a\u9a78\u7ec2\u6874\u8d59\u9efb\u9efc\u7f58\u7a03\u99a5\u864d\u86a8\u8709\u8760\u876e\u9eb8\u8dba\u8dd7\u9cc6',
    'ga': '\u5676\u560e\u86e4\u5c2c\u5477\u5c15\u5c1c\u65ee\u9486',
    'gai': '\u8be5\u6539\u6982\u9499\u76d6\u6e89\u4e10\u9654\u5793\u6224\u8d45\u80f2',
    'gan': '\u5e72\u7518\u6746\u67d1\u7aff\u809d\u8d76\u611f\u79c6\u6562\u8d63\u5769\u82f7\u5c34\u64c0\u6cd4\u6de6\u6f89\u7ec0\u6a44\u65f0\u77f8\u75b3\u9150',
    'gang': '\u5188\u521a\u94a2\u7f38\u809b\u7eb2\u5c97\u6e2f\u6206\u7f61\u9883\u7b7b',
    'gong': '\u6760\u5de5\u653b\u529f\u606d\u9f9a\u4f9b\u8eac\u516c\u5bab\u5f13\u5de9\u6c5e\u62f1\u8d21\u5171\u857b\u5efe\u54a3\u73d9\u80b1\u86a3\u86e9\u89e5',
    'gao': '\u7bd9\u768b\u9ad8\u818f\u7f94\u7cd5\u641e\u9550\u7a3f\u544a\u777e\u8bf0\u90dc\u84bf\u85c1\u7f1f\u69d4\u69c1\u6772\u9506',
    'ge': '\u54e5\u6b4c\u6401\u6208\u9e3d\u80f3\u7599\u5272\u9769\u845b\u683c\u9601\u9694\u94ec\u4e2a\u5404\u9b32\u4ee1\u54ff\u5865\u55dd\u7ea5\u643f\u8188\u784c\u94ea\u9549\u88bc\u988c\u867c\u8238\u9abc\u9ac2',
    'gei': '\u7ed9',
    'gen': '\u6839\u8ddf\u4e98\u831b\u54cf\u826e',
    'geng': '\u8015\u66f4\u5e9a\u7fb9\u57c2\u803f\u6897\u54fd\u8d53\u9ca0',
    'gou': '\u94a9\u52fe\u6c9f\u82df\u72d7\u57a2\u6784\u8d2d\u591f\u4f5d\u8bdf\u5ca3\u9058\u5abe\u7f11\u89cf\u5f40\u9e32\u7b31\u7bdd\u97b2',
    'gu': '\u8f9c\u83c7\u5495\u7b8d\u4f30\u6cbd\u5b64\u59d1\u9f13\u53e4\u86ca\u9aa8\u8c37\u80a1\u6545\u987e\u56fa\u96c7\u560f\u8bc2\u83f0\u54cc\u5d2e\u6c69\u688f\u8f71\u726f\u727f\u80cd\u81cc\u6bc2\u77bd\u7f5f\u94b4\u9522\u74e0\u9e2a\u9e44\u75fc\u86c4\u9164\u89da\u9cb4\u9ab0\u9e58',
    'gua': '\u522e\u74dc\u5250\u5be1\u6302\u8902\u5366\u8bd6\u5471\u681d\u9e39',
    'guai': '\u4e56\u62d0\u602a\u54d9',
    'guan': '\u68fa\u5173\u5b98\u51a0\u89c2\u7ba1\u9986\u7f50\u60ef\u704c\u8d2f\u500c\u839e\u63bc\u6dab\u76e5\u9e73\u9ccf',
    'guang': '\u5149\u5e7f\u901b\u72b7\u6844\u80f1\u7592',
    'gui': '\u7470\u89c4\u572d\u7845\u5f52\u9f9f\u95fa\u8f68\u9b3c\u8be1\u7678\u6842\u67dc\u8dea\u8d35\u523d\u5326\u523f\u5e8b\u5b84\u59ab\u6867\u7085\u6677\u7688\u7c0b\u9c91\u9cdc',
    'gun': '\u8f8a\u6eda\u68cd\u4e28\u886e\u7ef2\u78d9\u9ca7',
    'guo': '\u9505\u90ed\u56fd\u679c\u88f9\u8fc7\u9998\u8803\u57da\u63b4\u5459\u56d7\u5e3c\u5d1e\u7313\u6901\u8662\u951e\u8052\u872e\u873e\u8748',
    'ha': '\u54c8',
    'hai': '\u9ab8\u5b69\u6d77\u6c26\u4ea5\u5bb3\u9a87\u54b4\u55e8\u988f\u91a2',
    'han': '\u9163\u61a8\u90af\u97e9\u542b\u6db5\u5bd2\u51fd\u558a\u7f55\u7ff0\u64bc\u634d\u65f1\u61be\u608d\u710a\u6c57\u6c49\u9097\u83e1\u6496\u961a\u701a\u6657\u7113\u9894\u86b6\u9f3e',
    'hen': '\u592f\u75d5\u5f88\u72e0\u6068',
    'hang': '\u676d\u822a\u6c86\u7ed7\u73e9\u6841',
    'hao': '\u58d5\u568e\u8c6a\u6beb\u90dd\u597d\u8017\u53f7\u6d69\u8585\u55e5\u5686\u6fe0\u704f\u660a\u7693\u98a2\u869d',
    'he': '\u5475\u559d\u8377\u83cf\u6838\u79be\u548c\u4f55\u5408\u76d2\u8c89\u9602\u6cb3\u6db8\u8d6b\u8910\u9e64\u8d3a\u8bc3\u52be\u58d1\u85ff\u55d1\u55ec\u9616\u76cd\u86b5\u7fee',
    'hei': '\u563f\u9ed1',
    'heng': '\u54fc\u4ea8\u6a2a\u8861\u6052\u8a07\u8605',
    'hong': '\u8f70\u54c4\u70d8\u8679\u9e3f\u6d2a\u5b8f\u5f18\u7ea2\u9ec9\u8ba7\u836d\u85a8\u95f3\u6cd3',
    'hou': '\u5589\u4faf\u7334\u543c\u539a\u5019\u540e\u5820\u5f8c\u9005\u760a\u7bcc\u7cc7\u9c8e\u9aba',
    'hu': '\u547c\u4e4e\u5ffd\u745a\u58f6\u846b\u80e1\u8774\u72d0\u7cca\u6e56\u5f27\u864e\u552c\u62a4\u4e92\u6caa\u6237\u51b1\u553f\u56eb\u5cb5\u7322\u6019\u60da\u6d52\u6ef9\u7425\u69f2\u8f77\u89f3\u70c0\u7173\u623d\u6248\u795c\u9e55\u9e71\u7b0f\u9190\u659b',
    'hua': '\u82b1\u54d7\u534e\u733e\u6ed1\u753b\u5212\u5316\u8bdd\u5290\u6d4d\u9a85\u6866\u94e7\u7a1e',
    'huai': '\u69d0\u5f8a\u6000\u6dee\u574f\u8fd8\u8e1d',
    'huan': '\u6b22\u73af\u6853\u7f13\u6362\u60a3\u5524\u75ea\u8c62\u7115\u6da3\u5ba6\u5e7b\u90c7\u5942\u57b8\u64d0\u571c\u6d39\u6d63\u6f36\u5bf0\u902d\u7f33\u953e\u9ca9\u9b1f',
    'huang': '\u8352\u614c\u9ec4\u78fa\u8757\u7c27\u7687\u51f0\u60f6\u714c\u6643\u5e4c\u604d\u8c0e\u968d\u5fa8\u6e5f\u6f62\u9051\u749c\u8093\u7640\u87e5\u7bc1\u9cc7',
    'hui': '\u7070\u6325\u8f89\u5fbd\u6062\u86d4\u56de\u6bc1\u6094\u6167\u5349\u60e0\u6666\u8d3f\u79fd\u4f1a\u70e9\u6c47\u8bb3\u8bf2\u7ed8\u8bd9\u8334\u835f\u8559\u54d5\u5599\u96b3\u6d04\u5f57\u7f0b\u73f2\u6656\u605a\u867a\u87ea\u9ebe',
    'hun': '\u8364\u660f\u5a5a\u9b42\u6d51\u6df7\u8be8\u9984\u960d\u6eb7\u7f17',
    'huo': '\u8c41\u6d3b\u4f19\u706b\u83b7\u6216\u60d1\u970d\u8d27\u7978\u6509\u56af\u5925\u94ac\u952a\u956c\u8020\u8816',
    'ji': '\u51fb\u573e\u57fa\u673a\u7578\u7a3d\u79ef\u7b95\u808c\u9965\u8ff9\u6fc0\u8ba5\u9e21\u59ec\u7ee9\u7f09\u5409\u6781\u68d8\u8f91\u7c4d\u96c6\u53ca\u6025\u75be\u6c72\u5373\u5ac9\u7ea7\u6324\u51e0\u810a\u5df1\u84df\u6280\u5180\u5b63\u4f0e\u796d\u5242\u60b8\u6d4e\u5bc4\u5bc2\u8ba1\u8bb0\u65e2\u5fcc\u9645\u5993\u7ee7\u7eaa\u5c45\u4e0c\u4e69\u525e\u4f76\u4f74\u8114\u58bc\u82a8\u82b0\u8401\u84ba\u857a\u638e\u53fd\u54ad\u54dc\u5527\u5c8c\u5d74\u6d0e\u5f50\u5c50\u9aa5\u757f\u7391\u696b\u6b9b\u621f\u6222\u8d4d\u89ca\u7284\u9f51\u77f6\u7f81\u5d47\u7a37\u7620\u7635\u866e\u7b08\u7b04\u66a8\u8dfb\u8dfd\u9701\u9c9a\u9cab\u9afb\u9e82',
    'jia': '\u5609\u67b7\u5939\u4f73\u5bb6\u52a0\u835a\u988a\u8d3e\u7532\u94be\u5047\u7a3c\u4ef7\u67b6\u9a7e\u5ac1\u4f3d\u90cf\u62ee\u5cac\u6d43\u8fe6\u73c8\u621b\u80db\u605d\u94d7\u9553\u75c2\u86f1\u7b33\u8888\u8dcf',
    'jian': '\u6b7c\u76d1\u575a\u5c16\u7b3a\u95f4\u714e\u517c\u80a9\u8270\u5978\u7f04\u8327\u68c0\u67ec\u78b1\u7877\u62e3\u6361\u7b80\u4fed\u526a\u51cf\u8350\u69db\u9274\u8df5\u8d31\u89c1\u952e\u7bad\u4ef6\u5065\u8230\u5251\u996f\u6e10\u6e85\u6da7\u5efa\u50ed\u8c0f\u8c2b\u83c5\u84b9\u641b\u56dd\u6e54\u8e47\u8b07\u7f23\u67a7\u67d9\u6957\u620b\u622c\u726e\u728d\u6bfd\u8171\u7751\u950f\u9e63\u88e5\u7b15\u7bb4\u7fe6\u8dbc\u8e3a\u9ca3\u97af',
    'jiang': '\u50f5\u59dc\u5c06\u6d46\u6c5f\u7586\u848b\u6868\u5956\u8bb2\u5320\u9171\u964d\u8333\u6d1a\u7edb\u7f30\u729f\u7913\u8029\u7ce8\u8c47',
    'jiao': '\u8549\u6912\u7901\u7126\u80f6\u4ea4\u90ca\u6d47\u9a84\u5a07\u56bc\u6405\u94f0\u77eb\u4fa5\u811a\u72e1\u89d2\u997a\u7f34\u7ede\u527f\u6559\u9175\u8f7f\u8f83\u53eb\u4f7c\u50ec\u832d\u6322\u564d\u5ce4\u5fbc\u59e3\u7e9f\u656b\u768e\u9e6a\u86df\u91ae\u8de4\u9c9b',
    'jie': '\u7a96\u63ed\u63a5\u7686\u79f8\u8857\u9636\u622a\u52ab\u8282\u6854\u6770\u6377\u776b\u7aed\u6d01\u7ed3\u89e3\u59d0\u6212\u85c9\u82a5\u754c\u501f\u4ecb\u75a5\u8beb\u5c4a\u5048\u8ba6\u8bd8\u5588\u55df\u736c\u5a55\u5b51\u6840\u7352\u78a3\u9534\u7596\u88b7\u9889\u86a7\u7faf\u9c92\u9ab1\u9aeb',
    'jin': '\u5dfe\u7b4b\u65a4\u91d1\u4eca\u6d25\u895f\u7d27\u9526\u4ec5\u8c28\u8fdb\u9773\u664b\u7981\u8fd1\u70ec\u6d78\u5c3d\u537a\u8369\u5807\u5664\u9991\u5ed1\u5997\u7f19\u747e\u69ff\u8d46\u89d0\u9485\u9513\u887f\u77dc',
    'jing': '\u52b2\u8346\u5162\u830e\u775b\u6676\u9cb8\u4eac\u60ca\u7cbe\u7cb3\u7ecf\u4e95\u8b66\u666f\u9888\u9759\u5883\u656c\u955c\u5f84\u75c9\u9756\u7adf\u7ade\u51c0\u522d\u5106\u9631\u83c1\u734d\u61ac\u6cfe\u8ff3\u5f2a\u5a67\u80bc\u80eb\u8148\u65cc',
    'jiong': '\u70af\u7a98\u5182\u8fe5\u6243',
    'jiu': '\u63ea\u7a76\u7ea0\u7396\u97ed\u4e45\u7078\u4e5d\u9152\u53a9\u6551\u65e7\u81fc\u8205\u548e\u5c31\u759a\u50e6\u557e\u9604\u67e9\u6855\u9e6b\u8d73\u9b0f',
    'ju': '\u97a0\u62d8\u72d9\u75bd\u9a79\u83ca\u5c40\u5480\u77e9\u4e3e\u6cae\u805a\u62d2\u636e\u5de8\u5177\u8ddd\u8e1e\u952f\u4ff1\u53e5\u60e7\u70ac\u5267\u5028\u8bb5\u82e3\u82f4\u8392\u63ac\u907d\u5c66\u741a\u67b8\u6910\u6998\u6989\u6a58\u728b\u98d3\u949c\u9514\u7aad\u88fe\u8d84\u91b5\u8e3d\u9f83\u96ce\u97ab',
    'juan': '\u6350\u9e43\u5a1f\u5026\u7737\u5377\u7ee2\u9104\u72f7\u6d93\u684a\u8832\u9529\u954c\u96bd',
    'jue': '\u6485\u652b\u6289\u6398\u5014\u7235\u89c9\u51b3\u8bc0\u7edd\u53a5\u5282\u8c32\u77cd\u8568\u5658\u5d1b\u7357\u5b53\u73cf\u6877\u6a5b\u721d\u9562\u8e76\u89d6',
    'jun': '\u5747\u83cc\u94a7\u519b\u541b\u5cfb\u4fca\u7ae3\u6d5a\u90e1\u9a8f\u6343\u72fb\u76b2\u7b60\u9e87',
    'ka': '\u5580\u5496\u5361\u4f67\u5494\u80e9',
    'ke': '\u54af\u5777\u82db\u67ef\u68f5\u78d5\u9897\u79d1\u58f3\u54b3\u53ef\u6e34\u514b\u523b\u5ba2\u8bfe\u5ca2\u606a\u6e98\u9a92\u7f02\u73c2\u8f72\u6c2a\u778c\u94b6\u75b4\u7aa0\u874c\u9ac1',
    'kai': '\u5f00\u63e9\u6977\u51ef\u6168\u5240\u57b2\u8488\u5ffe\u607a\u94e0\u950e',
    'kan': '\u520a\u582a\u52d8\u574e\u780d\u770b\u4f83\u51f5\u83b0\u83b6\u6221\u9f9b\u77b0',
    'kang': '\u5eb7\u6177\u7ce0\u625b\u6297\u4ea2\u7095\u5751\u4f09\u95f6\u94aa',
    'kao': '\u8003\u62f7\u70e4\u9760\u5c3b\u6832\u7292\u94d0',
    'ken': '\u80af\u5543\u57a6\u6073\u57a0\u88c9\u9880',
    'keng': '\u542d\u5fd0\u94ff',
    'kong': '\u7a7a\u6050\u5b54\u63a7\u5025\u5d06\u7b9c',
    'kou': '\u62a0\u53e3\u6263\u5bc7\u82a4\u853b\u53e9\u770d\u7b58',
    'ku': '\u67af\u54ed\u7a9f\u82e6\u9177\u5e93\u88e4\u5233\u5800\u55be\u7ed4\u9ab7',
    'kua': '\u5938\u57ae\u630e\u8de8\u80ef\u4f89',
    'kuai': '\u5757\u7b77\u4fa9\u5feb\u84af\u90d0\u8489\u72ef\u810d',
    'kuan': '\u5bbd\u6b3e\u9acb',
    'kuang': '\u5321\u7b50\u72c2\u6846\u77ff\u7736\u65f7\u51b5\u8bd3\u8bf3\u909d\u5739\u593c\u54d0\u7ea9\u8d36',
    'kui': '\u4e8f\u76d4\u5cbf\u7aa5\u8475\u594e\u9b41\u5080\u9988\u6127\u6e83\u9997\u532e\u5914\u9697\u63c6\u55b9\u559f\u609d\u6126\u9615\u9035\u668c\u777d\u8069\u8770\u7bd1\u81fe\u8dec',
    'kun': '\u5764\u6606\u6346\u56f0\u6083\u9603\u7428\u951f\u918c\u9cb2\u9ae1',
    'kuo': '\u62ec\u6269\u5ed3\u9614\u86de',
    'la': '\u5783\u62c9\u5587\u8721\u814a\u8fa3\u5566\u524c\u647a\u908b\u65ef\u782c\u760c',
    'lai': '\u83b1\u6765\u8d56\u5d03\u5f95\u6d9e\u6fd1\u8d49\u7750\u94fc\u765e\u7c41',
    'lan': '\u84dd\u5a6a\u680f\u62e6\u7bee\u9611\u5170\u6f9c\u8c30\u63fd\u89c8\u61d2\u7f06\u70c2\u6ee5\u5549\u5c9a\u61d4\u6f24\u6984\u6593\u7f71\u9567\u8934',
    'lang': '\u7405\u6994\u72fc\u5eca\u90ce\u6717\u6d6a\u83a8\u8497\u5577\u9606\u9512\u7a02\u8782',
    'lao': '\u635e\u52b3\u7262\u8001\u4f6c\u59e5\u916a\u70d9\u6d9d\u5520\u5d02\u6833\u94d1\u94f9\u75e8\u91aa',
    'le': '\u52d2\u4e50\u808b\u4ec2\u53fb\u561e\u6cd0\u9cd3',
    'lei': '\u96f7\u956d\u857e\u78ca\u7d2f\u5121\u5792\u64c2\u7c7b\u6cea\u7fb8\u8bd4\u837d\u54a7\u6f2f\u5ad8\u7f27\u6a91\u8012\u9179',
    'ling': '\u68f1\u51b7\u62ce\u73b2\u83f1\u96f6\u9f84\u94c3\u4f36\u7f9a\u51cc\u7075\u9675\u5cad\u9886\u53e6\u4ee4\u9143\u5844\u82d3\u5464\u56f9\u6ce0\u7eeb\u67c3\u68c2\u74f4\u8046\u86c9\u7fce\u9cae',
    'leng': '\u695e\u6123',
    'li': '\u5398\u68a8\u7281\u9ece\u7bf1\u72f8\u79bb\u6f13\u7406\u674e\u91cc\u9ca4\u793c\u8389\u8354\u540f\u6817\u4e3d\u5389\u52b1\u783e\u5386\u5229\u5088\u4f8b\u4fd0\u75e2\u7acb\u7c92\u6ca5\u96b6\u529b\u7483\u54e9\u4fea\u4fda\u90e6\u575c\u82c8\u8385\u84e0\u85dc\u6369\u5456\u5533\u55b1\u7301\u6ea7\u6fa7\u9026\u5a0c\u5ae0\u9a8a\u7f21\u73de\u67a5\u680e\u8f79\u623e\u783a\u8a48\u7f79\u9502\u9e42\u75a0\u75ac\u86ce\u870a\u8821\u7b20\u7be5\u7c9d\u91b4\u8dde\u96f3\u9ca1\u9ce2\u9ee7',
    'lian': '\u4fe9\u8054\u83b2\u8fde\u9570\u5ec9\u601c\u6d9f\u5e18\u655b\u8138\u94fe\u604b\u70bc\u7ec3\u631b\u8539\u5941\u6f4b\u6fc2\u5a08\u740f\u695d\u6b93\u81c1\u81a6\u88e2\u880a\u9ca2',
    'liang': '\u7cae\u51c9\u6881\u7cb1\u826f\u4e24\u8f86\u91cf\u667e\u4eae\u8c05\u589a\u690b\u8e09\u9753\u9b49',
    'liao': '\u64a9\u804a\u50da\u7597\u71ce\u5be5\u8fbd\u6f66\u4e86\u6482\u9563\u5ed6\u6599\u84fc\u5c25\u5639\u7360\u5bee\u7f2d\u948c\u9e69\u8022',
    'lie': '\u5217\u88c2\u70c8\u52a3\u730e\u51bd\u57d2\u6d0c\u8d94\u8e90\u9b23',
    'lin': '\u7433\u6797\u78f7\u9716\u4e34\u90bb\u9cde\u6dcb\u51db\u8d41\u541d\u853a\u5d99\u5eea\u9074\u6aa9\u8f9a\u77b5\u7cbc\u8e8f\u9e9f',
    'liu': '\u6e9c\u7409\u69b4\u786b\u998f\u7559\u5218\u7624\u6d41\u67f3\u516d\u62a1\u507b\u848c\u6cd6\u6d4f\u905b\u9a9d\u7efa\u65d2\u7198\u950d\u954f\u9e68\u938f',
    'long': '\u9f99\u804b\u5499\u7b3c\u7abf\u9686\u5784\u62e2\u9647\u5f04\u5785\u830f\u6cf7\u73d1\u680a\u80e7\u783b\u7643',
    'lou': '\u697c\u5a04\u6402\u7bd3\u6f0f\u964b\u55bd\u5d5d\u9542\u7618\u8027\u877c\u9ac5',
    'lu': '\u82a6\u5362\u9885\u5e90\u7089\u63b3\u5364\u864f\u9c81\u9e93\u788c\u9732\u8def\u8d42\u9e7f\u6f5e\u7984\u5f55\u9646\u622e\u5786\u6445\u64b8\u565c\u6cf8\u6e0c\u6f09\u7490\u680c\u6a79\u8f73\u8f82\u8f98\u6c07\u80ea\u9565\u9e2c\u9e6d\u7c0f\u823b\u9c88',
    'lv': '\u9a74\u5415\u94dd\u4fa3\u65c5\u5c65\u5c61\u7f15\u8651\u6c2f\u5f8b\u7387\u6ee4\u7eff\u634b\u95fe\u6988\u8182\u7a06\u891b',
    'luan': '\u5ce6\u5b6a\u6ee6\u5375\u4e71\u683e\u9e3e\u92ae',
    'lue': '\u63a0\u7565\u950a',
    'lun': '\u8f6e\u4f26\u4ed1\u6ca6\u7eb6\u8bba\u56f5',
    'luo': '\u841d\u87ba\u7f57\u903b\u9523\u7ba9\u9aa1\u88f8\u843d\u6d1b\u9a86\u7edc\u502e\u8366\u645e\u7321\u6cfa\u6924\u8136\u9559\u7630\u96d2',
    'ma': '\u5988\u9ebb\u739b\u7801\u8682\u9a6c\u9a82\u561b\u5417\u551b\u72b8\u5b37\u6769\u9ebd',
    'mai': '\u57cb\u4e70\u9ea6\u5356\u8fc8\u8109\u52a2\u836c\u54aa\u973e',
    'man': '\u7792\u9992\u86ee\u6ee1\u8513\u66fc\u6162\u6f2b\u8c29\u5881\u5e54\u7f26\u71b3\u9558\u989f\u87a8\u9cd7\u9794',
    'mang': '\u8292\u832b\u76f2\u5fd9\u83bd\u9099\u6f2d\u6726\u786d\u87d2',
    'meng': '\u6c13\u840c\u8499\u6aac\u76df\u9530\u731b\u68a6\u5b5f\u52d0\u750d\u77a2\u61f5\u791e\u867b\u8722\u8813\u824b\u8268\u9efe',
    'miao': '\u732b\u82d7\u63cf\u7784\u85d0\u79d2\u6e3a\u5e99\u5999\u55b5\u9088\u7f08\u7f2a\u676a\u6dfc\u7707\u9e4b\u8731',
    'mao': '\u8305\u951a\u6bdb\u77db\u94c6\u536f\u8302\u5192\u5e3d\u8c8c\u8d38\u4f94\u88a4\u52d6\u8306\u5cc1\u7441\u6634\u7266\u8004\u65c4\u61cb\u7780\u86d1\u8765\u87ca\u9ae6',
    'me': '\u4e48',
    'mei': '\u73ab\u679a\u6885\u9176\u9709\u7164\u6ca1\u7709\u5a92\u9541\u6bcf\u7f8e\u6627\u5bd0\u59b9\u5a9a\u5776\u8393\u5d4b\u7338\u6d7c\u6e44\u6963\u9545\u9e5b\u8882\u9b45',
    'men': '\u95e8\u95f7\u4eec\u626a\u739f\u7116\u61d1\u9494',
    'mi': '\u772f\u919a\u9761\u7cdc\u8ff7\u8c1c\u5f25\u7c73\u79d8\u89c5\u6ccc\u871c\u5bc6\u5e42\u8288\u5196\u8c27\u863c\u5627\u7315\u736f\u6c68\u5b93\u5f2d\u8112\u6549\u7cf8\u7e3b\u9e8b',
    'mian': '\u68c9\u7720\u7ef5\u5195\u514d\u52c9\u5a29\u7f05\u9762\u6c94\u6e4e\u817c\u7704',
    'mie': '\u8511\u706d\u54a9\u881b\u7bfe',
    'min': '\u6c11\u62bf\u76bf\u654f\u60af\u95fd\u82e0\u5cb7\u95f5\u6cef\u73c9',
    'ming': '\u660e\u879f\u9e23\u94ed\u540d\u547d\u51a5\u8317\u6e9f\u669d\u7791\u9169',
    'miu': '\u8c2c',
    'mo': '\u6478\u6479\u8611\u6a21\u819c\u78e8\u6469\u9b54\u62b9\u672b\u83ab\u58a8\u9ed8\u6cab\u6f20\u5bde\u964c\u8c1f\u8309\u84e6\u998d\u5aeb\u9546\u79e3\u763c\u8031\u87c6\u8c8a\u8c98',
    'mou': '\u8c0b\u725f\u67d0\u53b6\u54de\u5a7a\u7738\u936a',
    'mu': '\u62c7\u7261\u4ea9\u59c6\u6bcd\u5893\u66ae\u5e55\u52df\u6155\u6728\u76ee\u7766\u7267\u7a46\u4eeb\u82dc\u5452\u6c90\u6bea\u94bc',
    'na': '\u62ff\u54ea\u5450\u94a0\u90a3\u5a1c\u7eb3\u5185\u637a\u80ad\u954e\u8872\u7bac',
    'nai': '\u6c16\u4e43\u5976\u8010\u5948\u9f10\u827f\u8418\u67f0',
    'nan': '\u5357\u7537\u96be\u56ca\u5583\u56e1\u6960\u8169\u877b\u8d67',
    'nao': '\u6320\u8111\u607c\u95f9\u5b6c\u57b4\u7331\u7459\u7847\u94d9\u86f2',
    'ne': '\u6dd6\u5462\u8bb7',
    'nei': '\u9981',
    'nen': '\u5ae9\u80fd\u6798\u6041',
    'ni': '\u59ae\u9713\u502a\u6ce5\u5c3c\u62df\u4f60\u533f\u817b\u9006\u6eba\u4f32\u576d\u730a\u6029\u6ee0\u6635\u65ce\u7962\u615d\u7768\u94cc\u9cb5',
    'nian': '\u852b\u62c8\u5e74\u78be\u64b5\u637b\u5ff5\u5eff\u8f87\u9ecf\u9c87\u9cb6',
    'niang': '\u5a18\u917f',
    'niao': '\u9e1f\u5c3f\u8311\u5b32\u8132\u8885',
    'nie': '\u634f\u8042\u5b7d\u556e\u954a\u954d\u6d85\u4e5c\u9667\u8616\u55eb\u8080\u989e\u81ec\u8e51',
    'nin': '\u60a8\u67e0',
    'ning': '\u72de\u51dd\u5b81\u62e7\u6cde\u4f5e\u84e5\u549b\u752f\u804d',
    'niu': '\u725b\u626d\u94ae\u7ebd\u72c3\u5ff8\u599e\u86b4',
    'nong': '\u8113\u6d53\u519c\u4fac',
    'nu': '\u5974\u52aa\u6012\u5476\u5e11\u5f29\u80ec\u5b65\u9a7d',
    'nv': '\u5973\u6067\u9495\u8844',
    'nuan': '\u6696',
    'nuenue': '\u8650',
    'nue': '\u759f\u8c11',
    'nuo': '\u632a\u61e6\u7cef\u8bfa\u50a9\u6426\u558f\u9518',
    'ou': '\u54e6\u6b27\u9e25\u6bb4\u85d5\u5455\u5076\u6ca4\u6004\u74ef\u8026',
    'pa': '\u556a\u8db4\u722c\u5e15\u6015\u7436\u8469\u7b62',
    'pai': '\u62cd\u6392\u724c\u5f98\u6e43\u6d3e\u4ff3\u848e',
    'pan': '\u6500\u6f58\u76d8\u78d0\u76fc\u7554\u5224\u53db\u723f\u6cee\u88a2\u897b\u87e0\u8e52',
    'pang': '\u4e53\u5e9e\u65c1\u802a\u80d6\u6ec2\u9004',
    'pao': '\u629b\u5486\u5228\u70ae\u888d\u8dd1\u6ce1\u530f\u72cd\u5e96\u812c\u75b1',
    'pei': '\u5478\u80da\u57f9\u88f4\u8d54\u966a\u914d\u4f69\u6c9b\u638a\u8f94\u5e14\u6de0\u65c6\u952b\u9185\u9708',
    'pen': '\u55b7\u76c6\u6e53',
    'peng': '\u7830\u62a8\u70f9\u6f8e\u5f6d\u84ec\u68da\u787c\u7bf7\u81a8\u670b\u9e4f\u6367\u78b0\u576f\u580b\u562d\u6026\u87db',
    'pi': '\u7812\u9739\u6279\u62ab\u5288\u7435\u6bd7\u5564\u813e\u75b2\u76ae\u5339\u75de\u50fb\u5c41\u8b6c\u4e15\u9674\u90b3\u90eb\u572e\u9f19\u64d7\u567c\u5e80\u5ab2\u7eb0\u6787\u7513\u7765\u7f74\u94cd\u75e6\u7656\u758b\u868d\u8c94',
    'pian': '\u7bc7\u504f\u7247\u9a97\u8c1d\u9a88\u728f\u80fc\u890a\u7fe9\u8e41',
    'piao': '\u98d8\u6f02\u74e2\u7968\u527d\u560c\u5ad6\u7f25\u6b8d\u779f\u87b5',
    'pie': '\u6487\u77a5\u4e3f\u82e4\u6c15',
    'pin': '\u62fc\u9891\u8d2b\u54c1\u8058\u62da\u59d8\u5ad4\u6980\u725d\u98a6',
    'ping': '\u4e52\u576a\u82f9\u840d\u5e73\u51ed\u74f6\u8bc4\u5c4f\u4fdc\u5a09\u67b0\u9c86',
    'po': '\u5761\u6cfc\u9887\u5a46\u7834\u9b44\u8feb\u7c95\u53f5\u9131\u6ea5\u73c0\u948b\u94b7\u76a4\u7b38',
    'pou': '\u5256\u88d2\u8e23',
    'pu': '\u6251\u94fa\u4ec6\u8386\u8461\u83e9\u84b2\u57d4\u6734\u5703\u666e\u6d66\u8c31\u66dd\u7011\u530d\u5657\u6fee\u749e\u6c06\u9564\u9568\u8e7c',
    'qi': '\u671f\u6b3a\u6816\u621a\u59bb\u4e03\u51c4\u6f06\u67d2\u6c8f\u5176\u68cb\u5947\u6b67\u7566\u5d0e\u8110\u9f50\u65d7\u7948\u7941\u9a91\u8d77\u5c82\u4e5e\u4f01\u542f\u5951\u780c\u5668\u6c14\u8fc4\u5f03\u6c7d\u6ce3\u8bab\u4e9f\u4e93\u573b\u8291\u840b\u847a\u5601\u5c7a\u5c90\u6c54\u6dc7\u9a90\u7eee\u742a\u7426\u675e\u6864\u69ed\u6b39\u797a\u61a9\u789b\u86f4\u871e\u7da6\u7dae\u8dbf\u8e4a\u9ccd\u9e92',
    'qia': '\u6390\u6070\u6d3d\u845c',
    'qian': '\u7275\u6266\u948e\u94c5\u5343\u8fc1\u7b7e\u4edf\u8c26\u4e7e\u9ed4\u94b1\u94b3\u524d\u6f5c\u9063\u6d45\u8c34\u5811\u5d4c\u6b20\u6b49\u4f65\u9621\u828a\u82a1\u8368\u63ae\u5c8d\u60ad\u614a\u9a9e\u6434\u8930\u7f31\u6920\u80b7\u6106\u94a4\u8654\u7b9d',
    'qiang': '\u67aa\u545b\u8154\u7f8c\u5899\u8537\u5f3a\u62a2\u5af1\u6a2f\u6217\u709d\u9516\u9535\u956a\u8941\u8723\u7f9f\u8deb\u8dc4',
    'qiao': '\u6a47\u9539\u6572\u6084\u6865\u77a7\u4e54\u4fa8\u5de7\u9798\u64ac\u7fd8\u5ced\u4fcf\u7a8d\u5281\u8bee\u8c2f\u835e\u6100\u6194\u7f32\u6a35\u6bf3\u7857\u8df7\u9792',
    'qie': '\u5207\u8304\u4e14\u602f\u7a83\u90c4\u553c\u60ec\u59be\u6308\u9532\u7ba7',
    'qin': '\u94a6\u4fb5\u4eb2\u79e6\u7434\u52e4\u82b9\u64d2\u79bd\u5bdd\u6c81\u82a9\u84c1\u8572\u63ff\u5423\u55ea\u5659\u6eb1\u6a8e\u8793\u887e',
    'qing': '\u9752\u8f7b\u6c22\u503e\u537f\u6e05\u64ce\u6674\u6c30\u60c5\u9877\u8bf7\u5e86\u5029\u82d8\u570a\u6aa0\u78ec\u873b\u7f44\u7b90\u8b26\u9cad\u9ee5',
    'qiong': '\u743c\u7a77\u909b\u8315\u7a79\u7b47\u928e',
    'qiu': '\u79cb\u4e18\u90b1\u7403\u6c42\u56da\u914b\u6cc5\u4fc5\u6c3d\u5def\u827d\u72b0\u6e6b\u9011\u9052\u6978\u8d47\u9e20\u866c\u86af\u8764\u88d8\u7cd7\u9cc5\u9f3d',
    'qu': '\u8d8b\u533a\u86c6\u66f2\u8eaf\u5c48\u9a71\u6e20\u53d6\u5a36\u9f8b\u8da3\u53bb\u8bce\u52ac\u8556\u8627\u5c96\u8862\u9612\u74a9\u89d1\u6c0d\u795b\u78f2\u766f\u86d0\u883c\u9eb4\u77bf\u9ee2',
    'quan': '\u5708\u98a7\u6743\u919b\u6cc9\u5168\u75ca\u62f3\u72ac\u5238\u529d\u8be0\u8343\u737e\u609b\u7efb\u8f81\u754e\u94e8\u8737\u7b4c\u9b08',
    'que': '\u7f3a\u7094\u7638\u5374\u9e4a\u69b7\u786e\u96c0\u9619\u60ab',
    'qun': '\u88d9\u7fa4\u9021',
    'ran': '\u7136\u71c3\u5189\u67d3\u82d2\u9aef',
    'rang': '\u74e4\u58e4\u6518\u56b7\u8ba9\u79b3\u7a70',
    'rao': '\u9976\u6270\u7ed5\u835b\u5a06\u6861',
    'ruo': '\u60f9\u82e5\u5f31',
    're': '\u70ed\u504c',
    'ren': '\u58ec\u4ec1\u4eba\u5fcd\u97e7\u4efb\u8ba4\u5203\u598a\u7eab\u4ede\u834f\u845a\u996a\u8f6b\u7a14\u887d',
    'reng': '\u6254\u4ecd',
    'ri': '\u65e5',
    'rong': '\u620e\u8338\u84c9\u8363\u878d\u7194\u6eb6\u5bb9\u7ed2\u5197\u5d58\u72e8\u7f1b\u6995\u877e',
    'rou': '\u63c9\u67d4\u8089\u7cc5\u8e42\u97a3',
    'ru': '\u8339\u8815\u5112\u5b7a\u5982\u8fb1\u4e73\u6c5d\u5165\u8925\u84d0\u85b7\u5685\u6d33\u6ebd\u6fe1\u94f7\u8966\u98a5',
    'ruan': '\u8f6f\u962e\u670a',
    'rui': '\u854a\u745e\u9510\u82ae\u8564\u777f\u868b',
    'run': '\u95f0\u6da6',
    'sa': '\u6492\u6d12\u8428\u5345\u4ee8\u6332\u98d2',
    'sai': '\u816e\u9cc3\u585e\u8d5b\u567b',
    'san': '\u4e09\u53c1\u4f1e\u6563\u5f61\u9993\u6c35\u6bf5\u7cc1\u9730',
    'sang': '\u6851\u55d3\u4e27\u6421\u78c9\u98a1',
    'sao': '\u6414\u9a9a\u626b\u5ac2\u57fd\u81ca\u7619\u9ccb',
    'se': '\u745f\u8272\u6da9\u556c\u94e9\u94ef\u7a51',
    'sen': '\u68ee',
    'seng': '\u50e7',
    'sha': '\u838e\u7802\u6740\u5239\u6c99\u7eb1\u50bb\u5565\u715e\u810e\u6b43\u75e7\u88df\u970e\u9ca8',
    'shai': '\u7b5b\u6652\u917e',
    'shan': '\u73ca\u82eb\u6749\u5c71\u5220\u717d\u886b\u95ea\u9655\u64c5\u8d61\u81b3\u5584\u6c55\u6247\u7f2e\u5261\u8baa\u912f\u57cf\u829f\u6f78\u59d7\u9a9f\u81bb\u9490\u759d\u87ee\u8222\u8dda\u9cdd',
    'shang': '\u5892\u4f24\u5546\u8d4f\u664c\u4e0a\u5c1a\u88f3\u57a7\u7ef1\u6b87\u71b5\u89de',
    'shao': '\u68a2\u634e\u7a0d\u70e7\u828d\u52fa\u97f6\u5c11\u54e8\u90b5\u7ecd\u52ad\u82d5\u6f72\u86f8\u7b24\u7b72\u8244',
    'she': '\u5962\u8d4a\u86c7\u820c\u820d\u8d66\u6444\u5c04\u6151\u6d89\u793e\u8bbe\u538d\u4f58\u731e\u7572\u9e9d',
    'shen': '\u7837\u7533\u547b\u4f38\u8eab\u6df1\u5a20\u7ec5\u795e\u6c88\u5ba1\u5a76\u751a\u80be\u614e\u6e17\u8bdc\u8c02\u5432\u54c2\u6e16\u6939\u77e7\u8703',
    'sheng': '\u58f0\u751f\u7525\u7272\u5347\u7ef3\u7701\u76db\u5269\u80dc\u5723\u4e1e\u6e11\u5ab5\u771a\u7b19',
    'shi': '\u5e08\u5931\u72ee\u65bd\u6e7f\u8bd7\u5c38\u8671\u5341\u77f3\u62fe\u65f6\u4ec0\u98df\u8680\u5b9e\u8bc6\u53f2\u77e2\u4f7f\u5c4e\u9a76\u59cb\u5f0f\u793a\u58eb\u4e16\u67ff\u4e8b\u62ed\u8a93\u901d\u52bf\u662f\u55dc\u566c\u9002\u4ed5\u4f8d\u91ca\u9970\u6c0f\u5e02\u6043\u5ba4\u89c6\u8bd5\u8c25\u57d8\u83b3\u84cd\u5f11\u5511\u9963\u8f7c\u8006\u8d33\u70bb\u793b\u94c8\u94ca\u87ab\u8210\u7b6e\u8c55\u9ca5\u9cba',
    'shou': '\u6536\u624b\u9996\u5b88\u5bff\u6388\u552e\u53d7\u7626\u517d\u624c\u72e9\u7ef6\u824f',
    'shu': '\u852c\u67a2\u68b3\u6b8a\u6292\u8f93\u53d4\u8212\u6dd1\u758f\u4e66\u8d4e\u5b70\u719f\u85af\u6691\u66d9\u7f72\u8700\u9ecd\u9f20\u5c5e\u672f\u8ff0\u6811\u675f\u620d\u7ad6\u5885\u5eb6\u6570\u6f31\u6055\u500f\u587e\u83fd\u5fc4\u6cad\u6d91\u6f8d\u59dd\u7ebe\u6bf9\u8167\u6bb3\u956f\u79eb\u9e6c',
    'shua': '\u5237\u800d\u5530\u6dae',
    'shuai': '\u6454\u8870\u7529\u5e05\u87c0',
    'shuan': '\u6813\u62f4\u95e9',
    'shuang': '\u971c\u53cc\u723d\u5b40',
    'shui': '\u8c01\u6c34\u7761\u7a0e',
    'shun': '\u542e\u77ac\u987a\u821c\u6042',
    'shuo': '\u8bf4\u7855\u6714\u70c1\u84b4\u6420\u55cd\u6fef\u5981\u69ca\u94c4',
    'si': '\u65af\u6495\u5636\u601d\u79c1\u53f8\u4e1d\u6b7b\u8086\u5bfa\u55e3\u56db\u4f3a\u4f3c\u9972\u5df3\u53ae\u4fdf\u5155\u83e5\u549d\u6c5c\u6cd7\u6f8c\u59d2\u9a77\u7f0c\u7940\u7960\u9536\u9e36\u801c\u86f3\u7b25',
    'song': '\u677e\u8038\u6002\u9882\u9001\u5b8b\u8bbc\u8bf5\u51c7\u83d8\u5d27\u5d69\u5fea\u609a\u6dde\u7ae6',
    'sou': '\u641c\u8258\u64de\u55fd\u53df\u55d6\u55fe\u998a\u6eb2\u98d5\u778d\u953c\u878b',
    'su': '\u82cf\u9165\u4fd7\u7d20\u901f\u7c9f\u50f3\u5851\u6eaf\u5bbf\u8bc9\u8083\u5919\u8c21\u850c\u55c9\u612b\u7c0c\u89eb\u7a23',
    'suan': '\u9178\u849c\u7b97',
    'sui': '\u867d\u968b\u968f\u7ee5\u9ad3\u788e\u5c81\u7a57\u9042\u96a7\u795f\u84d1\u51ab\u8c07\u6fc9\u9083\u71e7\u772d\u7762',
    'sun': '\u5b59\u635f\u7b0b\u836a\u72f2\u98e7\u69ab\u8de3\u96bc',
    'suo': '\u68ad\u5506\u7f29\u7410\u7d22\u9501\u6240\u5522\u55e6\u5a11\u686b\u7743\u7fa7',
    'ta': '\u584c\u4ed6\u5b83\u5979\u5854\u736d\u631e\u8e4b\u8e0f\u95fc\u6ebb\u9062\u69bb\u6c93',
    'tai': '\u80ce\u82d4\u62ac\u53f0\u6cf0\u915e\u592a\u6001\u6c70\u90b0\u85b9\u80bd\u70b1\u949b\u8dc6\u9c90',
    'tan': '\u574d\u644a\u8d2a\u762b\u6ee9\u575b\u6a80\u75f0\u6f6d\u8c2d\u8c08\u5766\u6bef\u8892\u78b3\u63a2\u53f9\u70ad\u90ef\u8548\u6619\u94bd\u952c\u8983',
    'tang': '\u6c64\u5858\u642a\u5802\u68e0\u819b\u5510\u7cd6\u50a5\u9967\u6e8f\u746d\u94f4\u9557\u8025\u8797\u87b3\u7fb0\u91a3',
    'thang': '\u5018\u8eba\u6dcc',
    'theng': '\u8d9f\u70eb',
    'tao': '\u638f\u6d9b\u6ed4\u7ee6\u8404\u6843\u9003\u6dd8\u9676\u8ba8\u5957\u6311\u9f17\u5555\u97ec\u9955',
    'te': '\u7279',
    'teng': '\u85e4\u817e\u75bc\u8a8a\u6ed5',
    'ti': '\u68af\u5254\u8e22\u9511\u63d0\u9898\u8e44\u557c\u4f53\u66ff\u568f\u60d5\u6d95\u5243\u5c49\u8351\u608c\u9016\u7ee8\u7f07\u9e48\u88fc\u918d',
    'tian': '\u5929\u6dfb\u586b\u7530\u751c\u606c\u8214\u8146\u63ad\u5fdd\u9617\u6b84\u754b\u94bf\u86ba',
    'tiao': '\u6761\u8fe2\u773a\u8df3\u4f7b\u7967\u94eb\u7a95\u9f86\u9ca6',
    'tie': '\u8d34\u94c1\u5e16\u841c\u992e',
    'ting': '\u5385\u542c\u70c3\u6c40\u5ef7\u505c\u4ead\u5ead\u633a\u8247\u839b\u8476\u5a77\u6883\u8713\u9706',
    'tong': '\u901a\u6850\u916e\u77b3\u540c\u94dc\u5f64\u7ae5\u6876\u6345\u7b52\u7edf\u75db\u4f5f\u50ee\u4edd\u833c\u55f5\u6078\u6f7c\u783c',
    'tou': '\u5077\u6295\u5934\u900f\u4ea0',
    'tu': '\u51f8\u79c3\u7a81\u56fe\u5f92\u9014\u6d82\u5c60\u571f\u5410\u5154\u580d\u837c\u83df\u948d\u9174',
    'tuan': '\u6e4d\u56e2\u7583',
    'tui': '\u63a8\u9893\u817f\u8715\u892a\u9000\u5fd2\u717a',
    'tun': '\u541e\u5c6f\u81c0\u9968\u66be\u8c5a\u7a80',
    'tuo': '\u62d6\u6258\u8131\u9e35\u9640\u9a6e\u9a7c\u692d\u59a5\u62d3\u553e\u4e47\u4f57\u5768\u5eb9\u6cb1\u67dd\u7823\u7ba8\u8204\u8dce\u9f0d',
    'wa': '\u6316\u54c7\u86d9\u6d3c\u5a03\u74e6\u889c\u4f64\u5a32\u817d',
    'wai': '\u6b6a\u5916',
    'wan': '\u8c4c\u5f2f\u6e7e\u73a9\u987d\u4e38\u70f7\u5b8c\u7897\u633d\u665a\u7696\u60cb\u5b9b\u5a49\u4e07\u8155\u525c\u8284\u82cb\u83c0\u7ea8\u7efe\u742c\u8118\u7579\u873f\u7ba2',
    'wang': '\u6c6a\u738b\u4ea1\u6789\u7f51\u5f80\u65fa\u671b\u5fd8\u5984\u7f54\u5c22\u60d8\u8f8b\u9b4d',
    'wei': '\u5a01\u5dcd\u5fae\u5371\u97e6\u8fdd\u6845\u56f4\u552f\u60df\u4e3a\u6f4d\u7ef4\u82c7\u840e\u59d4\u4f1f\u4f2a\u5c3e\u7eac\u672a\u851a\u5473\u754f\u80c3\u5582\u9b4f\u4f4d\u6e2d\u8c13\u5c09\u6170\u536b\u502d\u504e\u8bff\u9688\u8473\u8587\u5e0f\u5e37\u5d34\u5d6c\u7325\u732c\u95f1\u6ca9\u6d27\u6da0\u9036\u5a13\u73ae\u97ea\u8ece\u709c\u7168\u71a8\u75ff\u8249\u9c94',
    'wen': '\u761f\u6e29\u868a\u6587\u95fb\u7eb9\u543b\u7a33\u7d0a\u95ee\u520e\u6120\u960c\u6c76\u74ba\u97eb\u6b81\u96ef',
    'weng': '\u55e1\u7fc1\u74ee\u84ca\u8579',
    'wo': '\u631d\u8717\u6da1\u7a9d\u6211\u65a1\u5367\u63e1\u6c83\u83b4\u5e44\u6e25\u674c\u809f\u9f8c',
    'wu': '\u5deb\u545c\u94a8\u4e4c\u6c61\u8bec\u5c4b\u65e0\u829c\u68a7\u543e\u5434\u6bcb\u6b66\u4e94\u6342\u5348\u821e\u4f0d\u4fae\u575e\u620a\u96fe\u6664\u7269\u52ff\u52a1\u609f\u8bef\u5140\u4ef5\u9622\u90ac\u572c\u82b4\u5e91\u6003\u5fe4\u6d6f\u5be4\u8fd5\u59a9\u9a9b\u727e\u7110\u9e49\u9e5c\u8708\u92c8\u9f2f',
    'xi': '\u6614\u7199\u6790\u897f\u7852\u77fd\u6670\u563b\u5438\u9521\u727a\u7a00\u606f\u5e0c\u6089\u819d\u5915\u60dc\u7184\u70ef\u6eaa\u6c50\u7280\u6a84\u88ad\u5e2d\u4e60\u5ab3\u559c\u94e3\u6d17\u7cfb\u9699\u620f\u7ec6\u50d6\u516e\u96b0\u90d7\u831c\u8478\u84f0\u595a\u550f\u5f99\u9969\u960b\u6d60\u6dc5\u5c63\u5b09\u73ba\u6a28\u66e6\u89cb\u6b37\u71b9\u798a\u79a7\u94b8\u7699\u7a78\u8725\u87cb\u823e\u7fb2\u7c9e\u7fd5\u91af\u9f37',
    'xia': '\u778e\u867e\u5323\u971e\u8f96\u6687\u5ce1\u4fa0\u72ed\u4e0b\u53a6\u590f\u5413\u6380\u846d\u55c4\u72ce\u9050\u7455\u7856\u7615\u7f45\u9ee0',
    'xian': '\u9528\u5148\u4ed9\u9c9c\u7ea4\u54b8\u8d24\u8854\u8237\u95f2\u6d8e\u5f26\u5acc\u663e\u9669\u73b0\u732e\u53bf\u817a\u9985\u7fa1\u5baa\u9677\u9650\u7ebf\u51bc\u85d3\u5c98\u7303\u66b9\u5a34\u6c19\u7946\u9e47\u75eb\u86ac\u7b45\u7c7c\u9170\u8df9',
    'xiang': '\u76f8\u53a2\u9576\u9999\u7bb1\u8944\u6e58\u4e61\u7fd4\u7965\u8be6\u60f3\u54cd\u4eab\u9879\u5df7\u6a61\u50cf\u5411\u8c61\u8297\u8459\u9977\u5ea0\u9aa7\u7f03\u87d3\u9c9e\u98e8',
    'xiao': '\u8427\u785d\u9704\u524a\u54ee\u56a3\u9500\u6d88\u5bb5\u6dc6\u6653\u5c0f\u5b5d\u6821\u8096\u5578\u7b11\u6548\u54d3\u54bb\u5d24\u6f47\u900d\u9a81\u7ee1\u67ad\u67b5\u7b71\u7bab\u9b48',
    'xie': '\u6954\u4e9b\u6b47\u874e\u978b\u534f\u631f\u643a\u90aa\u659c\u80c1\u8c10\u5199\u68b0\u5378\u87f9\u61c8\u6cc4\u6cfb\u8c22\u5c51\u5055\u4eb5\u52f0\u71ee\u85a4\u64b7\u5ee8\u7023\u9082\u7ec1\u7f2c\u69ad\u698d\u6b59\u8e9e',
    'xin': '\u85aa\u82af\u950c\u6b23\u8f9b\u65b0\u5ffb\u5fc3\u4fe1\u8845\u56df\u99a8\u8398\u6b46\u94fd\u946b',
    'xing': '\u661f\u8165\u7329\u60fa\u5174\u5211\u578b\u5f62\u90a2\u884c\u9192\u5e78\u674f\u6027\u59d3\u9649\u8347\u8365\u64e4\u60bb\u784e',
    'xiong': '\u5144\u51f6\u80f8\u5308\u6c79\u96c4\u718a\u828e',
    'xiu': '\u4f11\u4fee\u7f9e\u673d\u55c5\u9508\u79c0\u8896\u7ee3\u83a0\u5cab\u9990\u5ea5\u9e3a\u8c85\u9af9',
    'xu': '\u589f\u620c\u9700\u865a\u5618\u987b\u5f90\u8bb8\u84c4\u9157\u53d9\u65ed\u5e8f\u755c\u6064\u7d6e\u5a7f\u7eea\u7eed\u8bb4\u8be9\u5729\u84ff\u6035\u6d2b\u6e86\u987c\u6829\u7166\u7809\u76f1\u80e5\u7cc8\u9191',
    'xuan': '\u8f69\u55a7\u5ba3\u60ac\u65cb\u7384\u9009\u7663\u7729\u7eda\u5107\u8c16\u8431\u63ce\u9994\u6ceb\u6d35\u6e32\u6f29\u7487\u6966\u6684\u70ab\u714a\u78b9\u94c9\u955f\u75c3',
    'xue': '\u9774\u859b\u5b66\u7a74\u96ea\u8840\u5671\u6cf6\u9cd5',
    'xun': '\u52cb\u718f\u5faa\u65ec\u8be2\u5bfb\u9a6f\u5de1\u6b89\u6c5b\u8bad\u8baf\u900a\u8fc5\u5dfd\u57d9\u8340\u85b0\u5ccb\u5f87\u6d54\u66db\u7aa8\u91ba\u9c9f',
    'ya': '\u538b\u62bc\u9e26\u9e2d\u5440\u4e2b\u82bd\u7259\u869c\u5d16\u8859\u6daf\u96c5\u54d1\u4e9a\u8bb6\u4f22\u63e0\u5416\u5c88\u8fd3\u5a05\u740a\u6860\u6c29\u7811\u775a\u75d6',
    'yan': '\u7109\u54bd\u9609\u70df\u6df9\u76d0\u4e25\u7814\u8712\u5ca9\u5ef6\u8a00\u989c\u960e\u708e\u6cbf\u5944\u63a9\u773c\u884d\u6f14\u8273\u5830\u71d5\u538c\u781a\u96c1\u5501\u5f66\u7130\u5bb4\u8c1a\u9a8c\u53a3\u9765\u8d5d\u4fe8\u5043\u5156\u8ba0\u8c33\u90fe\u9122\u82ab\u83f8\u5d26\u6079\u95eb\u960f\u6d07\u6e6e\u6edf\u598d\u5ae3\u7430\u664f\u80ed\u814c\u7131\u7f68\u7b75\u917d\u9b47\u990d\u9f39',
    'yang': '\u6b83\u592e\u9e2f\u79e7\u6768\u626c\u4f6f\u75a1\u7f8a\u6d0b\u9633\u6c27\u4ef0\u75d2\u517b\u6837\u6f3e\u5f89\u600f\u6cf1\u7080\u70ca\u6059\u86d8\u9785',
    'yao': '\u9080\u8170\u5996\u7476\u6447\u5c27\u9065\u7a91\u8c23\u59da\u54ac\u8200\u836f\u8981\u8000\u592d\u723b\u5406\u5d3e\u5fad\u7039\u5e7a\u73e7\u6773\u66dc\u80b4\u9e5e\u7a88\u7e47\u9cd0',
    'ye': '\u6930\u564e\u8036\u7237\u91ce\u51b6\u4e5f\u9875\u6396\u4e1a\u53f6\u66f3\u814b\u591c\u6db2\u8c12\u90ba\u63f6\u9980\u6654\u70e8\u94d8',
    'yi': '\u4e00\u58f9\u533b\u63d6\u94f1\u4f9d\u4f0a\u8863\u9890\u5937\u9057\u79fb\u4eea\u80f0\u7591\u6c82\u5b9c\u59e8\u5f5d\u6905\u8681\u501a\u5df2\u4e59\u77e3\u4ee5\u827a\u6291\u6613\u9091\u5c79\u4ebf\u5f79\u81c6\u9038\u8084\u75ab\u4ea6\u88d4\u610f\u6bc5\u5fc6\u4e49\u76ca\u6ea2\u8be3\u8bae\u8c0a\u8bd1\u5f02\u7ffc\u7fcc\u7ece\u5208\u5293\u4f7e\u8bd2\u572a\u572f\u57f8\u61ff\u82e1\u858f\u5f08\u5955\u6339\u5f0b\u5453\u54a6\u54bf\u566b\u5cc4\u5db7\u7317\u9974\u603f\u6021\u6092\u6f2a\u8fe4\u9a7f\u7f22\u6baa\u8d3b\u65d6\u71a0\u9487\u9552\u9571\u75cd\u7617\u7654\u7fca\u8864\u8734\u8223\u7fbf\u7ff3\u914f\u9edf',
    'yin': '\u8335\u836b\u56e0\u6bb7\u97f3\u9634\u59fb\u541f\u94f6\u6deb\u5bc5\u996e\u5c39\u5f15\u9690\u5370\u80e4\u911e\u5819\u831a\u5591\u72fa\u5924\u6c24\u94df\u763e\u8693\u972a\u9f88',
    'ying': '\u82f1\u6a31\u5a74\u9e70\u5e94\u7f28\u83b9\u8424\u8425\u8367\u8747\u8fce\u8d62\u76c8\u5f71\u9896\u786c\u6620\u5b34\u90e2\u8314\u83ba\u8426\u6484\u5624\u81ba\u6ee2\u6f46\u701b\u745b\u748e\u6979\u9e66\u763f\u988d\u7f42',
    'yo': '\u54df\u5537',
    'yong': '\u62e5\u4f63\u81c3\u75c8\u5eb8\u96cd\u8e0a\u86f9\u548f\u6cf3\u6d8c\u6c38\u607f\u52c7\u7528\u4fd1\u58c5\u5889\u6175\u9095\u955b\u752c\u9cd9\u9954',
    'you': '\u5e7d\u4f18\u60a0\u5fe7\u5c24\u7531\u90ae\u94c0\u72b9\u6cb9\u6e38\u9149\u6709\u53cb\u53f3\u4f51\u91c9\u8bf1\u53c8\u5e7c\u5363\u6538\u4f91\u83b8\u5466\u56ff\u5ba5\u67da\u7337\u7256\u94d5\u75a3\u8763\u9c7f\u9edd\u9f2c',
    'yu': '\u8fc2\u6de4\u4e8e\u76c2\u6986\u865e\u611a\u8206\u4f59\u4fde\u903e\u9c7c\u6109\u6e1d\u6e14\u9685\u4e88\u5a31\u96e8\u4e0e\u5c7f\u79b9\u5b87\u8bed\u7fbd\u7389\u57df\u828b\u90c1\u5401\u9047\u55bb\u5cea\u5fa1\u6108\u6b32\u72f1\u80b2\u8a89\u6d74\u5bd3\u88d5\u9884\u8c6b\u9a6d\u79ba\u6bd3\u4f1b\u4fe3\u8c00\u8c15\u8438\u84e3\u63c4\u5581\u5704\u5709\u5d5b\u72f3\u996b\u5ebe\u9608\u59aa\u59a4\u7ea1\u745c\u6631\u89ce\u8174\u6b24\u65bc\u715c\u71e0\u807f\u94b0\u9e46\u7610\u7600\u7ab3\u8753\u7afd\u8201\u96e9\u9f89',
    'yuan': '\u9e33\u6e0a\u51a4\u5143\u57a3\u8881\u539f\u63f4\u8f95\u56ed\u5458\u5706\u733f\u6e90\u7f18\u8fdc\u82d1\u613f\u6028\u9662\u586c\u6c85\u5a9b\u7457\u6a7c\u7230\u7722\u9e22\u8788\u9f0b',
    'yue': '\u66f0\u7ea6\u8d8a\u8dc3\u94a5\u5cb3\u7ca4\u6708\u60a6\u9605\u9fa0\u6a3e\u5216\u94ba',
    'yun': '\u8018\u4e91\u90e7\u5300\u9668\u5141\u8fd0\u8574\u915d\u6655\u97f5\u5b55\u90d3\u82b8\u72c1\u607d\u7ead\u6b92\u6600\u6c32',
    'za': '\u531d\u7838\u6742\u62f6\u5482',
    'zai': '\u683d\u54c9\u707e\u5bb0\u8f7d\u518d\u5728\u54b1\u5d3d\u753e',
    'zan': '\u6512\u6682\u8d5e\u74d2\u661d\u7c2a\u7ccc\u8db1\u933e',
    'zang': '\u8d43\u810f\u846c\u5958\u6215\u81e7',
    'zao': '\u906d\u7cdf\u51ff\u85fb\u67a3\u65e9\u6fa1\u86a4\u8e81\u566a\u9020\u7682\u7076\u71e5\u5523\u7f2b',
    'ze': '\u8d23\u62e9\u5219\u6cfd\u4ec4\u8d5c\u5567\u8fee\u6603\u7b2e\u7ba6\u8234',
    'zei': '\u8d3c',
    'zen': '\u600e\u8c2e',
    'zeng': '\u589e\u618e\u66fe\u8d60\u7f2f\u7511\u7f7e\u9503',
    'zha': '\u624e\u55b3\u6e23\u672d\u8f67\u94e1\u95f8\u7728\u6805\u69a8\u548b\u4e4d\u70b8\u8bc8\u63f8\u5412\u54a4\u54f3\u600d\u781f\u75c4\u86b1\u9f44',
    'zhai': '\u6458\u658b\u5b85\u7a84\u503a\u5be8\u7826',
    'zhan': '\u77bb\u6be1\u8a79\u7c98\u6cbe\u76cf\u65a9\u8f97\u5d2d\u5c55\u8638\u6808\u5360\u6218\u7ad9\u6e5b\u7efd\u8c35\u640c\u65c3',
    'zhang': '\u6a1f\u7ae0\u5f70\u6f33\u5f20\u638c\u6da8\u6756\u4e08\u5e10\u8d26\u4ed7\u80c0\u7634\u969c\u4ec9\u9123\u5e5b\u5d82\u7350\u5adc\u748b\u87d1',
    'zhao': '\u62db\u662d\u627e\u6cbc\u8d75\u7167\u7f69\u5146\u8087\u53ec\u722a\u8bcf\u68f9\u948a\u7b0a',
    'zhe': '\u906e\u6298\u54f2\u86f0\u8f99\u8005\u9517\u8517\u8fd9\u6d59\u8c2a\u966c\u67d8\u8f84\u78d4\u9e67\u891a\u8707\u8d6d',
    'zhen': '\u73cd\u659f\u771f\u7504\u7827\u81fb\u8d1e\u9488\u4fa6\u6795\u75b9\u8bca\u9707\u632f\u9547\u9635\u7f1c\u6862\u699b\u8f78\u8d48\u80d7\u6715\u796f\u755b\u9e29',
    'zheng': '\u84b8\u6323\u7741\u5f81\u72f0\u4e89\u6014\u6574\u62ef\u6b63\u653f\u5e27\u75c7\u90d1\u8bc1\u8be4\u5ce5\u94b2\u94ee\u7b5d',
    'zhi': '\u829d\u679d\u652f\u5431\u8718\u77e5\u80a2\u8102\u6c41\u4e4b\u7ec7\u804c\u76f4\u690d\u6b96\u6267\u503c\u4f84\u5740\u6307\u6b62\u8dbe\u53ea\u65e8\u7eb8\u5fd7\u631a\u63b7\u81f3\u81f4\u7f6e\u5e1c\u5cd9\u5236\u667a\u79e9\u7a1a\u8d28\u7099\u75d4\u6ede\u6cbb\u7a92\u536e\u965f\u90c5\u57f4\u82b7\u646d\u5e19\u5fee\u5f58\u54ab\u9a98\u6809\u67b3\u6800\u684e\u8f75\u8f7e\u6534\u8d3d\u81a3\u7949\u7957\u9ef9\u96c9\u9e37\u75e3\u86ed\u7d77\u916f\u8dd6\u8e2c\u8e2f\u8c78\u89ef',
    'zhong': '\u4e2d\u76c5\u5fe0\u949f\u8877\u7ec8\u79cd\u80bf\u91cd\u4ef2\u4f17\u51a2\u953a\u87bd\u8202\u822f\u8e35',
    'zhou': '\u821f\u5468\u5dde\u6d32\u8bcc\u7ca5\u8f74\u8098\u5e1a\u5492\u76b1\u5b99\u663c\u9aa4\u5544\u7740\u501c\u8bf9\u836e\u9b3b\u7ea3\u80c4\u78a1\u7c40\u8233\u914e\u9cb7',
    'zhu': '\u73e0\u682a\u86db\u6731\u732a\u8bf8\u8bdb\u9010\u7af9\u70db\u716e\u62c4\u77a9\u5631\u4e3b\u8457\u67f1\u52a9\u86c0\u8d2e\u94f8\u7b51\u4f4f\u6ce8\u795d\u9a7b\u4f2b\u4f8f\u90be\u82ce\u8331\u6d19\u6e1a\u6f74\u9a7a\u677c\u69e0\u6a65\u70b7\u94e2\u75b0\u7603\u86b0\u7afa\u7bb8\u7fe5\u8e85\u9e88',
    'zhua': '\u6293',
    'zhuai': '\u62fd',
    'zhuan': '\u4e13\u7816\u8f6c\u64b0\u8d5a\u7bc6\u629f\u556d\u989b',
    'zhuang': '\u6869\u5e84\u88c5\u5986\u649e\u58ee\u72b6\u4e2c',
    'zhui': '\u690e\u9525\u8ffd\u8d58\u5760\u7f00\u8411\u9a93\u7f12',
    'zhun': '\u8c06\u51c6',
    'zhuo': '\u6349\u62d9\u5353\u684c\u7422\u8301\u914c\u707c\u6d4a\u502c\u8bfc\u5ef4\u855e\u64e2\u555c\u6d5e\u6dbf\u6753\u712f\u799a\u65ab',
    'zi': '\u5179\u54a8\u8d44\u59ff\u6ecb\u6dc4\u5b5c\u7d2b\u4ed4\u7c7d\u6ed3\u5b50\u81ea\u6e0d\u5b57\u8c18\u5d6b\u59ca\u5b73\u7f01\u6893\u8f8e\u8d40\u6063\u7726\u9531\u79ed\u8014\u7b2b\u7ca2\u89dc\u8a3e\u9cbb\u9aed',
    'zong': '\u9b03\u68d5\u8e2a\u5b97\u7efc\u603b\u7eb5\u8159\u7cbd',
    'zou': '\u90b9\u8d70\u594f\u63cd\u9139\u9cb0',
    'zu': '\u79df\u8db3\u5352\u65cf\u7956\u8bc5\u963b\u7ec4\u4fce\u83f9\u5550\u5f82\u9a75\u8e74',
    'zuan': '\u94bb\u7e82\u6525\u7f35',
    'zui': '\u5634\u9189\u6700\u7f6a',
    'zun': '\u5c0a\u9075\u6499\u6a3d\u9cdf',
    'zuo': '\u6628\u5de6\u4f50\u67de\u505a\u4f5c\u5750\u5ea7\u961d\u963c\u80d9\u795a\u9162',
    'cou': '\u85ae\u6971\u8f8f\u8160',
    'nang': '\u652e\u54dd\u56d4\u9995\u66e9',
    'o': '\u5594',
    'dia': '\u55f2',
    'chuai': '\u562c\u81aa\u8e39',
    'cen': '\u5c91\u6d94',
    'diu': '\u94e5',
    'nou': '\u8028',
    'fou': '\u7f36',
    'bia': '\u9adf'
};
// CONCATENATED MODULE: ./src/lib/utils/pingying/pingying-util.js

/* harmony default export */ var pingying_util = __webpack_exports__["a"] = ({
    chineseToPinYin: function (l1) {
        var l2 = l1.length;
        var I1 = '';
        var reg = new RegExp('[a-zA-Z0-9]');
        for (var i = 0; i < l2; i++) {
            var val = l1.substr(i, 1);
            var name = this.arraySearch(val, pinyin);
            if (reg.test(val)) {
                I1 += val;
            } else if (name !== false) {
                I1 += name;
            }
        }
        I1 = I1.replace(/ /g, '-');
        while (I1.indexOf('--') > 0) {
            I1 = I1.replace('--', '-');
        }
        return I1;
    },
    arraySearch: function (l1, l2) {
        for (var name in pinyin) {
            if (pinyin[name].indexOf(l1) !== -1) {
                return this.ucfirst(name);
            }
        }
        return false;
    },
    ucfirst: function (l1) {
        if (l1.length > 0) {
            var first = l1.substr(0, 1).toUpperCase();
            var spare = l1.substr(1, l1.length);
            return first + spare;
        }
    },
	getFirstChar:function(str){
		if(/[\u4e00-\u9fa5]/.test(str)){
			str=this.chineseToPinYin(str);
		}
		let SX = '';
		for (var i = 0; i < str.length; i++) {
		  var c = str.charAt(i);
		  if (/^[A-Z]+$/.test(c)) {
		     SX += c;
		  }
		}
		return SX;
	}
	
});

/***/ }),

/***/ "fe37":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_icon_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8006");
/* harmony import */ var _C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_icon_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_C_Users_Administrator_000_AppData_Roaming_npm_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ld_icon_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ })

/******/ });
});
//# sourceMappingURL=index.umd.js.map