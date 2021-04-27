import pingyin from '@/lib/utils/pingying/pingying-util.js';



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
 * @param {Object} index 开始下标
 * @param {Object} insertStr 插入字符
 */
const insertToStr = function(oldStr, index, insertStr) {
  return oldStr.slice(0, index) + insertStr + oldStr.slice(index);
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
// //添加style
// const changeStyle = function(className, style) {
//   var classList = document.getElementsByClassName(className);
//   for (let i = 0; i < classList.length; i++) {
//     for (let k in style) {
//       classList[i].style[k] = style[k];
//     }
//   }
// }

// const getScreenStyle = function() {
//   var _w = document.body.clientWidth || document.body.offsetWidth;
//   var left = (_w > 1200 ? (_w - 1200) / 2 : 8) + "px";
//   var width = _w > 1200 ? "1200px" : (_w - 16) + "px";
//   var t = "margin-left:" + left + ";width:" + width;
//   return t;
// }
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
      ar[ar.length] = {
        $key: r,
        $value: _o
      };
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
  str = typeof str != "string" ? JSON.stringify(str) : str;
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
  url = isStartChart ? '?' + url : url;
  return url.replace(/&$/, '');
}
/**
 * url字符串 转成 将对象
 * @param {Object} obj
 * @param {Object} isStartChart
 */
const urlToObj = function(url) {
  url = url.indexOf('?') >= 0 ? url : '?' + url;
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
  n = typeof n == 'number' ? n + '' : n;
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
  len = len || 5;
  var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var tmp = "";
  var timestamp = new Date().getTime();
  for (var i = 0; i < len; i++) {
    tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
  }
  return tmp;
}
//获取ip
const os = require('os');
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


const setCookie = function(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

//取回cookie
const getCookie = function(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
}
/**
 * 复制内容到剪贴板
 * @param {Object} selector ES6 document.querySelector支持的选择器 或者文本
 * @param {Object} innerHTML 是否复制innerHTML,true：复制innerHTML,false:复制innerText
 */
const copyToClipboard = function(selector, innerHTML) {
  let info = "";
  try {
    let _el = document.querySelector(selector);
    info = _el ? (innerHTML ? _el.innerHTML : _el.innerText) : (selector);
  } catch (e) {
    info = selector;
  }
  let p = document.createElement("p");
  p.style.opacity = "0";
  p.innerText = info;
  p.id = `copyToClipboard_${randomNum(0,999999999)}`;
  document.body.appendChild(p);
  let el = document.querySelector(`#${p.id}`);
  let flg = false;
  try {
    if (document.selection) { // IE8 以下处理
      var oRange = document.body.createTextRange();
      oRange.moveToElementText(el);
      oRange.select();
    } else {
      var range = document.createRange();
      // create new range object
      range.selectNodeContents(el); // set range to encompass desired element text
      var selection = window.getSelection(); // get Selection object from currently user selected text
      selection.removeAllRanges(); // unselect any user selected text (if any)
      selection.addRange(range); // add range to Selection object to select it
    }
    flg = document.execCommand("copy");
  } catch (e) {
    //no data
  } finally {
    //移除复制的标签
    document.body.removeChild(p);
  }
  return flg;
}


export default {
  changeImagePath,
  uuid,
  getDateByNumber,
  getDayDiff,
  getDate: getNowD,
  getDateTime: getNowDT,
  getTime: getNowT,
  getNowD,
  getNowDT,
  getNowT,
  getTimeSplit,

  encryption,

  randomNum,
  randomNumFormula,
  randomChar,

  // changeStyle,
  // getScreenStyle,
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
  pingyin,
  idCardCheck,

  getIp,

  cookie: {
    get: getCookie,
    set: setCookie
  },

  copyToClipboard
};
