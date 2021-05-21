# **`ld-util`常用函数说明**

# 一、目的

>  对使用频率较高的函数进行封装，便于快速开发，避免重复 造轮子。

## 1.[`changeImagePath` ]("#changeImagePath")修改图片路径，通常在加载服务器图片时使用。
## 2.[`uuid`](#uuid) 获取到唯一编码
## 3.[`getDateByNumber`](#getDateByNumber) 根据数字获取日期。当日期为时间戳时调用。
## 4.[`getYearDiff`](#getYearDiff) 获取日期之间的年份差。
## 4.[`getMonthDiff`](#getMonthDiff) 获取日期之间的月份差。
## 4.[`getDayDiff`](#getDayDiff) 获取日期之间的天数差。
## 5.[`getDate`](#getDate) 获取日期。
## 6.[`getTime`](#getTime) 获取时间。
## 7.[`getDateTime`](#getDateTime) 获取日期时间。
## 8.[`getTimeSplit`](#getTimeSplit) 获取时间段，形如：早晨，中午，上午，晚上，凌晨等。
## 9.[`pingyin`](#pingyin)  获取拼音检索码
<!-- ## 9.[`encryption`](#encryption) 加解密字符串。 -->
## 10.[`randomNum`](#randomNum) 得到随机数字 (包前不包后)。
## 11.[`randomNumFormula`](#randomNumFormula) 得到随机计算公式，常用到验证码加减乘除验证。
## 12.[`randomChar`](#randomChar) 得到随机字符[0-9a-z]。
## 13.[`bigHumpToSmall`](#bigHumpToSmall) 大驼峰转小驼峰。 getName=>get_name
## 14.[`smallHumpToBig`](#smallHumpToBig) 小驼峰转大驼峰。 get_name=>getName
## 15.[`firstCharCmallHumpToBig`](#firstCharCmallHumpToBig) 小驼峰转大驼峰，并首字母大写。 get_name=>GetName
## 16.[`objConverArray`](#objConverArray) 将对象转换成数组。 {a:1,b:2,c:3}=>[{"$key":"a","$value":1},{"$key":"b","$value":2},{"$key":"c","$value":3}]
## 17.[`hashCode`](#hashCode) 得到hashCode。
## 18.[`getDataType`](#getDataType) 获取数据类型。int float string object array
## 19.[`objToParam`](#objToParam) 对象转url字符串。{a:1,b:2,c:3} => a=1&b=2&c=3& 或者 ?a=1&b=2&c=3&
## 20.[`urlToObj`](#urlToObj)  url字符串 转成 将对象。a=1&b=2&c=3& 或者 ?a=1&b=2&c=3& =>{a:1,b:2,c:3}
## 21.[`digitUppercase`](#digitUppercase)  金额大写。 123123213.34 =>壹拾贰万叁仟肆佰伍拾陆元叁角肆分
## 22.[`insertToStr`](#insertToStr)  指定下标位置插入字符串。insertToStr("123456",2,"a")  => 12a3456
## 23.[`insertAndReplaceToStr`](#insertAndReplaceToStr)  指定下标位置插入字符串。insertAndReplaceToStr("12345",2,4,"ab") => 12ab5
## 25.[`idCardCheck`](#idCardCheck)  验证身份证号码
## 26.[`getIp`](#getIp)  获取ip
## 27.[`cookie`](#cookie) cookie操作
## 28.[`copyToClipboard`](#copyToClipboard)复制内容到剪贴板
# 二、函数说明

## changeImagePath

 > 修改图片路径，通常在加载服务器图片时使用。

### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|url|String|可为空|图片地址|
|serverPath|String|可为空|服务器地址前缀|
|defaultPath|String|可为空|当图片地址为空时，返回一个默认的地址|

### 示例
```javascript

this.$ld.util.changeImagePath ("fileUpload/1/2/3/4.png","http://127.0.0.1:8080/test"); //"http://127.0.0.1:8080/test/fileUpload/1/2/3/4.png"

this.$ld.util.changeImagePath ("","http://127.0.0.1:8080/test","http://127.0.0.1:8080/test/default/default.png");//"http://127.0.0.1:8080/test/default/default.png"

```

## uuid

 > 获取到唯一编码

### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|len|Number|可为空|uuid长度;取值范围为（2-36),默认为16位|
|binary|Number|可为空|参数进制，如16进制，2进制，8进制等;取值范围为（2-36)|

### 示例
```javascript

//1.普通使用
this.$ld.util.uuid(); //81869db0-cdb6-48a2-83dd-f9c7d7132aa3

//2.限制长度
this.$ld.util.uuid(32);//89dc93f8-f242-447f-9348-85f40f3a

//3.指定进制编码
this.$ld.util.uuid(32,34);//segpemtu-jk11-49r2-atkd-ui0v87pf

```

## getDateByNumber

 > 根据数字获取日期。当日期为时间戳时调用。


### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|date|Date|不可为空|要转换的日期数字格式|

### 示例
```javascript

//1.普通使用 将1593317580211转成日期
this.$ld.util.getDateByNumber ('1593317580211');//"2020-06-28 12:13:00"
```

## getYearDiff

 > 获取日期之间的年份差

### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|endDate|String\Date|不为空|结束日期|
|startDate|String\Date|不为空|开始日期|

### 示例
```javascript

//1.普通使用
this.$ld.util.getYearDiff('2020-6-28 11:43:08','2020-5-28 11:43:20'); //0

//2.结束日期小于开始日期 ，返回负值
this.$ld.util.getYearDiff('2021-6-28 11:43:08','2020-7-28 11:43:20');//1

```

## getMonthDiff

 > 获取日期之间的月份差

### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|endDate|String\Date|不为空|结束日期|
|startDate|String\Date|不为空|开始日期|

### 示例
```javascript

//1.普通使用
this.$ld.util.getMonthDiff('2020-6-28 11:43:08','2020-5-28 11:43:20'); //1

//2.结束日期小于开始日期 ，返回负值
this.$ld.util.getMonthDiff('2021-6-28 11:43:08','2020-7-28 11:43:20');//11

```

## getDayDiff

 > 获取日期之间的天数差

### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|endDate|String\Date|不为空|结束日期|
|startDate|String\Date|不为空|开始日期|

### 示例
```javascript

//1.普通使用
this.$ld.util.getDayDiff('2020-6-28 11:43:08','2020-5-28 11:43:20'); //30

//2.结束日期小于开始日期 ，返回负值
this.$ld.util.getDayDiff('2020-6-28 11:43:08','2020-7-28 11:43:20');//-30

```


## getDate

 > 获取日期

### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|addDay|Number|可为空|要添加的天数|
|date|Date|可为空|计算的日期，默认为当前日期|

### 示例
```javascript

//1.普通使用
this.$ld.util.getDate(); //"2020-06-28"

//2.在当前日期的基础上 +3天
this.$ld.util.getDate(3);//"2020-07-01"

//3.在当前日期的基础上 -10天
this.$ld.util.getDate(-10);//"2020-06-18"

//4.在指定的日期的基础上计算添加天数后的日期
this.$ld.util.getDate(3,new Date('2020-6-30'));//"2020-07-03"

```

## getTime

 > 获取时间

### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|addMillisecond|Number|可为空|要在添加的毫毛（1分钟 = `1*60*1000`）|
|date|Date|可为空|计算的日期，不传时默认为当前日期|

### 示例
```javascript

//1.普通使用
this.$ld.util.getTime(); //"11:31:59"

//2.在当前时间的基础上 +30分钟
this.$ld.util.getTime(30*60*1000);//"11:36:57"

//3.在当前时间的基础上 -1小时
this.$ld.util.getTime(-1*60*60*1000);//"10:37:47"

//4.在指定的日期的基础上计算添加后的时间
this.$ld.util.getTime(1*60*1000,new Date('2020-6-30 11:20:22'));//"11:21:22"

```


<!-- ## `使用前准备工作，使用前请将该文件在main.js中引入并挂载`
```javascript
    /**
     *
    在 import Vue from 'vue'
       import App from './App'
    之后
     */
    import orangeUtil from './utl/orange-util.js'; //orange-util.js 所在文件目录
    Vue.use(orangeUtil);
```
* 准备好之后可以尽情的使用以下方法了 -->
--------------------------------------------------
## getDateTime

 > 获取日期时间

### 参数

|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|addDay|Number|可为空|要在添加的毫毛（1分钟 = `1*60*1000`）|
|date|Date|可为空|计算的日期，不传时默认为当前日期|

### 示例
```javascript

//1.普通使用
this.$ld.util.getDateTime(); //"2020-06-28 11:39:29"

//2.在当前日期的基础上 +1天
this.$ld.util.getDateTime(1);//"2020-06-29 11:39:58"

//3.在当前时间的基础上 -1天
this.$ld.util.getDateTime(-1) //"2020-06-27 11:41:10"

//4.在指定的日期的基础上计算添加后的日期
this.$ld.util.getDateTime(1,new Date('2020-6-30 11:20:22'));//"2020-07-01 11:20:22"

```
## getTimeSplit

 > 获取时间段，形如：早晨，中午，上午，晚上，凌晨等。

### 参数
|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|dateTime|String\Date|可为空|要计算的日期[yyyy-MM-dd HH:mm:ss] ，默认为当前日期|

### 示例
```javascript

//1.普通使用 获取当前时间
this.$ld.util.getTimeSplit(); //"上午"

//2.结束日期小于开始日期 ，返回负值
this.$ld.util.getTimeSplit('2020-4-28 17:43:08');//"傍晚"

```
## pingyin

 > 获取拼音检索码

### 参数
|参数名称|类型|参数|说明|
|:---|:---|:---|:---|
|chineseToPinYin|Function|str|计算汉字获得汉字拼音|
|getFirstChar|Function|str|计算汉字获得汉字首字母拼音|

### 示例
```javascript

//1.计算汉字获得汉字拼音
this.$ld.util.pingyin.chineseToPinYin("上午"); //"shangwu"

//2.计算汉字获得汉字首字母拼音
this.$ld.util.pingyin.getFirstChar("上午");//"sw"

```

## randomNum

 > 得到随机数字 (包前不包后)。

### 参数
|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|min|Number|不为空|随机字符产生的最小值 (包含最小值)|
|max|Number|不为空|随机字符产生的最大值 (不包含最大值)|
|type|Number|可为空|产生的随机方式【`0` 只保留整数(默认值)	`1`	向上取整(只对小数起作用)	`2`	向下取整(只对小数起作用)	`3`	四舍五入(只对小数起作用)】|

### 示例
```javascript

//1.普通使用
this.$ld.util.randomNum(0,10);//"2"

//2.使用type
this.$ld.util.randomNum(6.01,60.10,1);//"39"
```

## randomNumFormula

 >  得到随机计算公式，常用到验证码加减乘除验证。

### 参数
无
### 示例
```javascript
//普通使用
this.$ld.util.randomNumFormula();//"5+4"
```

## randomChar

 > 得到随机字符[0-9a-z]。

### 参数
|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|len|Number|不为空|随机字符产生的长度|

### 示例
```javascript
//普通使用
this.$ld.util.randomChar(10);//"3c0qh4ctcj"
```

## bigHumpToSmall

 > 大驼峰转小驼峰。 getName=>get_name

### 参数
|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|str|String|不为空|转换的字符|

### 示例
```javascript
this.$ld.util.bigHumpToSmall("getName");//get_name
```


## smallHumpToBig

 > 小驼峰转大驼峰。 get_name=>getName

### 参数
|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|str|String|不为空|转换的字符|

### 示例
```javascript
this.$ld.util.smallHumpToBig("get_name");//getName
```

## firstCharCmallHumpToBig

 > 小驼峰转大驼峰，并首字母大写。 get_name=>GetName

### 参数
|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|str|String|不为空|转换的字符|

### 示例
```javascript
this.$ld.util.firstCharCmallHumpToBig("get_name");//GetName
```

## objConverArray

 >  将对象转换成数组。 {a:1,b:2,c:3}=>[{"$key":"a","$value":1},{"$key":"b","$value":2},{"$key":"c","$value":3}]

### 参数
|参数名称|类型|为空|说明|
|:---|:---|:---|:---|
|obje|Object|不为空|转换的对象|

### 示例
```javascript
this.$ld.util.firstCharCmallHumpToBig("{a:1,b:2,c:3}");//[{"$key":"a","$value":1},{"$key":"b","$value":2},{"$key":"c","$value":3}]
```

## hashCode

 > 得到hashCode。

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|str|String|要计算的字符串|

### 示例
```javascript

//1.普通使用 计算字符串
this.$ld.util.hashCode('https://www.jianshu.com/p/96ecaa2cc989');//582844592
//2.使计算其他类型
this.$ld.util.hashCode([1,2,3,42,5]);//-528217203

```

## getDataType

 > 获取数据类型。int float string object array

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|any|any|要计算的数据|

### 示例
```javascript
this.$ld.util.getDataType(1);//int
this.$ld.util.getDataType(1.1);//float
this.$ld.util.getDataType("1");//string
this.$ld.util.hashCode([1,2,3,42,5]);//array
this.$ld.util.hashCode({a:1,b:2,c:3});//object

```

## objToParam

 > 对象转url字符串。{a:1,b:2,c:3} => a=1&b=2&c=3& 或者 ?a=1&b=2&c=3&

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|obj|Object|要转换的对象|
|isStartChart|Boolean|是否是开始字符，是则会追加?|

### 示例
```javascript
this.$ld.util.objToParam({a:1,b:2,c:3});//a=1&b=2&c=3
this.$ld.util.objToParam({a:1,b:2,c:3},true);//?a=1&b=2&c=3
```

## urlToObj

 >  url字符串 转成 将对象。a=1&b=2&c=3& 或者 ?a=1&b=2&c=3& =>{a:1,b:2,c:3}

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|obj|Object|要转换的对象|
|isStartChart|Boolean|是否是开始字符，是则会追加?|

### 示例
```javascript
this.$ld.util.urlToObj("http://127.0.0.1:8080/test/getInfo?a=1&b=2&c=3");//{a: "1", b: "2", c: "3", action: "http://127.0.0.1:8080/test/getInfo"}
this.$ld.util.urlToObj("a=1&b=2&c=3");//{a: "1", b: "2", c: "3"}
this.$ld.util.urlToObj("?a=1&b=2&c=3");//{a: "1", b: "2", c: "3"}
```

## digitUppercase

 > 金额大写。 123123213.34 =>壹拾贰万叁仟肆佰伍拾陆元叁角肆分

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|money|Number|要转换的数字|

### 示例
```javascript
this.$ld.util.digitUppercase(" 123123213.34");//壹拾贰万叁仟肆佰伍拾陆元叁角肆分
```

## insertToStr

 >  指定下标位置插入字符串。insertToStr("123456",2,"a")  => 12a3456

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|oldStr|String|元字符串|
|index|Number|要插入的下标|
|insertStr|String|要插入的字符|

### 示例
```javascript
this.$ld.util.insertToStr("123456",2,"a");// 12a3456
```
## insertAndReplaceToStr

 >  指定下标位置插入字符串。insertAndReplaceToStr("12345",2,4,"ab") => 12ab5

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|oldStr|String|元字符串|
|start|Number|开始下标|
|end|Number|结束下标|
|insertStr|String|要插入的字符|

### 示例
```javascript
this.$ld.util.insertAndReplaceToStr("12345",2,4,"ab");//12ab5
```
## idCardCheck

 > 验证身份证号码

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|cardNo|String|要验证的身份证号|

### 示例
```javascript
this.$ld.util.idCardCheck("622222222222222222");//false
```
## getIp

 >  获取ip

### 参数
无

### 示例
```javascript
this.$ld.util.getIp();//127.0.0.1
```

## cookie
>cookie 进行操作
## 示例
```
this.$ld.util.cookie.get(key);
this.$ld.util.cookie.set(key,value,day);
```

## copyToClipboard
>copyToClipboard 复制内容到剪贴板
> 复制成功，返回true,复制失败返回false;

### 参数
|参数名称|类型|说明|
|:---|:---|:---|
|selector|String|`选择器`或`文本内容`; ES6支持document.querySelector选中器 或者 复制的文字|要验证的身份证号|
|innerHTML|Boolean|是否复制innerHTML,true：复制innerHTML,false:复制innerText ；如果selector为选择器，此时该参数有效。|

## 示例
```
//复制文字
this.$ld.util.copyToClipboard("这是一段要复制的文字");

//复制 <p id="test">中的innerText内容
this.$ld.util.copyToClipboard("#test");
this.$ld.util.copyToClipboard("#test",false);

//复制 <p id="test">中的innerHTML内容
this.$ld.util.copyToClipboard("#test",true);
```
