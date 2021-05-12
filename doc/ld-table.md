# `ld-table` 表格显示组件
> 通过简单的参数配置，加载数据到界面

# 效果图

![显示表格](../effect/ld-table.png)

## `ld-table` 属性

|关键字|类型|解释|默认值|是否必须|说明|
|-|-|-|-|-|-|
|layout|Array[Object]|布局显示参数||√|一组可配置的对象集合[{visabled:true,width:'',replace:{},aligin:'',prop:'',label:'',format:(val)=>{},html:(val)=>{}}],[详情参考](###layout)|
|is-auto-load-data|true|是否自动加载数据|true|√|当true时，必须配置`auto-load-data-api`有效[如下详情](###auto-load-data-api)|
|auto-load-data-api|{}|自动加载数据，请求参数信息|{}|√|`auto-load-data-api`详情查看[如下详情](###auto-load-data-api)|
|list|Array|布局数据值|||通常情况下，推荐使用自动装载数据;|
|is-enabled-check-box|Boolean|是否显示复选框|false|-|当使用复选框时。如需获取选择状态，需要实现`checkbox(e)`方法|
|row-key|String|行数据的key|id||行数据的 Key，用来优化 Table 的渲染；在使用树形数据时，该属性是必填的。|
|el-table-property|Object|Element-ui表格参数|||Element-ui表格参数,详情查看[如下详情](###el-table-property)|
|get-table-remote-data-after|Function(data)|获取表单数据之后，装载数据之前，调用的装饰函数|||获取表单数据之后，装载数据之前，调用的装饰函数|
|show-page-helper|Boolean|是否使用分页显示数据|true|-|当使用分页时，每页的数据会通过，分页的方式，发送请求加载数据|
|page-size|Number|每页条数|30||当`showPageHelper`为true时有效，且该参数会受分页组件中的条数进行更改|
|total|Number|总条数|0||在不适用自动加载数据时使用|
|currentPage|Number|当前页|1||当前页|
|el-pagination|Object|分页组件的参数|`{pageSizes: [10, 20, 30, 50, 80, 100]}`||分页组件的参数，其他更多参数，设计中...|

## layout
 > 布局参数，该参数为必填参数，决定了表格布局的结构，他是一组布局子项的集合
### layout 子项布局参数解释说明
|关键字|类型|解释|是否必须|补充|
|-|-|-|-|-|
|prop|String|关健字|√|-|
|label|String\|Object|显示文字|√|如需要多级表头时，此处需要配置为Object,[详情如下](#多级表头)|
|format|Function(val)|格式化值函数||具体详见[format](##format)注意：replace、format、html，多个存在时，按照以上顺序只有一个会生效|
|html|Function(val)|使用hetml处理显示内容||具体详见[html](##html)；注意：replace、format、html，多个存在时，按照以上顺序只有一个会生效|
|replace|Object|需要替换的请求方法参数||在加载表格式，有时需要将外键关联的另一张表数据中的字符显示到表格中。这时需要该参数。比如：需要显示创建人名称，而该字段所对应的值为人员表的编号，此时可以通过该参数配置。具体详见[replace](##replace)；注意：replace、format、html，多个存在时，按照以上顺序只有一个会生效|
|visabled|Boolean|是否显示||默认值为true；false不显示|
|sortable|Boolean|是否排序列||默认为false|
|width|String|宽度||形如`100px` `80%` `calc(100% - 100px)`等,默认值为'auto'|

### layout布局参数结构如下
```javascript
layout:[
	{prop: 'nickName',label: '用户名称' },
	{prop: 'phone',label: '电话号码' },
	{prop: 'remake',label: '描述'},
	{prop: 'sex',label: '性别',html:(val)=>{return `<div class="${val==1?'c-d':'c-s'}">${val==1?'男':'女'}</div>`}},
	{prop: 'userType',label: '用户类别',format:(val)=>{return val==1?'普通用户':'超级管理员'} },
	{prop: 'birthday',label: '出生日期',format:(val)=>{ return !val?'': this.$ld.util.getNowD(0,new Date(val))} },
	{prop: 'createdTime',label: '创建时间',format:(val)=>{ return !val?'': this.$ld.util.getNowDT(0,new Date(val))	} },
	{prop: 'updatedTime',label: '修改时间',format:(val)=>{  return !val?'': this.$ld.util.getNowDT(0,new Date(val))} },
	{prop: 'createdBy',label: '创建人', replace: {  remotePath: 'test/getUserById',remoteMethodType:'get', label: 'nickName', value: 'id'} },
	{prop: 'updatedBy',label: '修改人', replace: {  remotePath: 'test/getUserById',remoteMethodType:'get', label: 'nickName', value: 'id'} },
]
```




## auto-load-data-api
 > 自动加载数据配置参数；以下参数只能是大驼峰；当时用小驼峰时，参数值无效。

|关键字|类型|解释|可选值|是否必须|默认值|
|-|-|-|-|-|-|
|remotePath|String|请求方法地址，如`test/getPage`;当使用第三方请求时，`remotePath`为完整的请求路径,如：`http://localhost:8081/test4/getPage||√||
|remoteParam|Object|是否为斑马纹 table||√|{}|
|remoteMethodType|String|请求方式`get``post``delete``post``put``patch``head`||√|get|
|remoteTimeout|Number|请求超时时间|2000ms|√|-|



### el-table-property
 > Element-ui表格参数；以下参数只能是大驼峰；当时用小驼峰时，参数值无效。

|关键字|类型|解释|可选值|是否必须|默认值|
|-|-|-|-|-|-|
|border|Boolean|是否带有纵向边框|||true|
|stripe|Boolean|是否为斑马纹 table|||true|
|indent|Number|展示树形数据时，树节点的缩进|||20|
|tooltipEffect|String|tooltip effect 属性|dark/light||-|
|fit|Boolean|列的宽度是否自撑开|||true|
|highlightCurrentRow|Boolean|是否要高亮当前行|||true|
|defaultExpandAll|Boolean|是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效|||false|
|defaultSort|Object|默认的排序列的 prop 和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序|`order`: ascending, descending||如果只指定了prop, 没有指定order, 则默认顺序是ascending|
|showSummary|Boolean|是否在表尾显示合计行|||false|
|sumText|String|合计行第一列的文本|||合计|
|summaryMethod|Function({ columns, data })|自定义的合计计算方法||||
|spanMethod|Function({ row, column, rowIndex, columnIndex })|	合并行或列的计算方法||||

## format
> 用来格式化显示表格数据，如下举2个示例
-  当数据为字典值，但需要显示在页面的为可阅读字符串时，其形如下

```javascript
layout:[
	{
		prop:'sex',
		label:'性别',
		format:(val)=>{
			return val==1?'男':'女'
		}
	}
]
```

-  当数据为日期不便阅读的结构式，其形如下

```javascript
layout:[
	{
		prop:'birthday',
		label:'生日',
		format:(val)=>{
			return !val?'未填写出生日期':this.$ld.util.getDate(0,new Date(val)); //该函数详情见https://github.com/dongmingzhixiu/layout-dynamic-ui/blob/main/doc/ld-util.md#getDate
		}
	}
]
```

## html
> 用来美化页面显示信息，如下举2个示例
-  当数据为字典值，但需要显示在页面的为可阅读字符串时，其形如下

```javascript
layout:[
	{
		prop:'sex',
		label:'性别',
		html:(val)=>{
			return `<div style="${val==1?'color:red':'color:green'}">${val==1?'男':'女'}</div>`
		}
	}
]
```

-  当数据为图片地址时，我们希望显示一张图片

```javascript
layout:[
	{
		prop:'birthday',
		label:'生日',
		html:(val)=>{
			return `<img src="${val}"/>` //图片样式和图片的地址需要进行处理
		}
	}
]
```

## replace
 > 配置一组请求参数，通过自动请求的方式，显示另一张表的字段字符。
 >
 > 比如在数据中，只包含创建人编号，而创建人信息在另一张表，此时即可使用该参数，动态替换创建人编号
 >
 >该方式加载数据目前已使用局部缓存(只在当前组件内部缓存，当组件整体刷新时，会重新获取！后期根据使用反馈进行调整全局缓存等方式)

|关键字|类型|解释|是否必须|补充|
|-|-|-|-|-|
|remotePath|String|请求路径|√|形如:`test/getUserById`,当为第三方请求时，请填写完整请求路径|
|remoteMethodType|String|请求方式|√|请求方式`get``post``delete``post``put``patch``head`|
|label|String|显示到界面上的数据关键字|√|比如：'createdName'|
|id|String|查询数据的字段|√|当前数据中关联其他数据的关联键；比如'id'|


# 插槽

|slot name|类型|说明|插槽值|
|-|-|-|-|
|expand|作用域插槽|展开行|-|
|tools|作用域插槽|这表格每一行的末尾设置操作元素|-|
|toolsHeader|作用域插槽|显示在表格头的内容|-|
|append|具名插槽|插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上。||


# 多级表头的使用
>多级表头使用非常简单，只需要对布局参数的`label`进行深层嵌套即可；只需遵从`label:{label:'表头名称',children:[{...}...]}`即可实现多层表格嵌套,参数格式如下

```javascript
layout:[{
	label: {
		label: '用户信息',
		children:[
			{prop: 'nickName',label: '用户名称' },
			{prop: 'phone',label: '电话号码' },
			{prop: 'remake',label: '描述'},
			{prop: 'sex',label: '性别',html:(val)=>{return `<div class="${val==1?'c-d':'c-s'}">${val==1?'男':'女'}</div>`}},
			{prop: 'userType',label: '用户类别',format:(val)=>{return val==1?'普通用户':'超级管理员'} },
			{prop: 'birthday',label: '出生日期',format:(val)=>{ return !val?'': this.$ld.util.getNowD(0,new Date(val))} },
			{prop: 'createdTime',label: '创建时间',format:(val)=>{ return !val?'': this.$ld.util.getNowDT(0,new Date(val))	} },
			{prop: 'updatedTime',label: '修改时间',format:(val)=>{  return !val?'': this.$ld.util.getNowDT(0,new Date(val))} },
			{prop: 'createdBy',label: '创建人', replace: {  method: 'test/getUserById',methodType:'get', label: 'nickName', value: 'id'} },
			{prop: 'updatedBy',label: '修改人', replace: {  method: 'test/getUserById',methodType:'get', label: 'nickName', value: 'id'} },
			//理论上，可以无限使用{label:'',children:[{}]}结构进行嵌套，但实际中为了节省资源，请谨慎使用
			{prop: '',label:{
				label:'地址',
				children:[
					{prop:'province',label:'省份',format:(val)=>{return"甘肃省"}},
					{prop:'city',label:'市区',format:(val)=>{return"兰州市"}},
					{prop:'address',label:'地址',format:(val)=>{return"城关区"}},
				]
			}},
		]
	}
},
{
	label:'用户职责',
	prop:'duty'
}]
```

- 效果图如下

![效果图](../effect/ld-table-more-head.png)

# 树形数据
> 树形结构显示数据。
> 1.需要参数为指定格式[{key1:'',key2:'',children:[{key1:'',key2:''}]}] 包含关键字 children
> 2.需要使用`row-key`参数设置用于树形结构更新的 key,key的值具有唯一性

- 数据结构如下

```javascript
list:[
	{id:1,name:'张三',sex:'1',age:20,remake:'描述',phone:'18888888888'},
	{id:2,name:'张三',sex:'1',age:20,remake:'描述',phone:'18888888888',
	//为id=2,的张三添加树形子数据，同样可以嵌套搓成，理论上是无限的，但实际上为了资源，请谨慎使用
	children:[
		{id:21,name:'张三1',sex:'1',age:20,remake:'描述',phone:'18888888888'},
		{id:22,name:'张三2',sex:'1',age:20,remake:'描述',phone:'18888888888'},
		{id:23,name:'张三3',sex:'1',age:20,remake:'描述',phone:'18888888888'},
	]},
	{id:3,name:'张三',sex:'1',age:20,remake:'描述',phone:'18888888888'},
]
```
> 以上数据的 `row-key`就可以设置为`row-key='id'`

# `ld-table`表格获取数据装载到布局之前的装饰函数
 >重写 `this.$ld.getTableRemoteDataAfter`(全局作用)，也可通过`ld-table`的`get-table-remote-data-after`的参数设置装饰函数。
 >
 >通过全局设置，在多处使用`ld-table`组件时，会自动调用处理数据
 >
 >获取表格数据之后，装载数据到表格之前，处理数据的函数
```javascript
this.$ld.getTableRemoteDataAfter=function(data, isPagination) {
	if (isPagination) {
		data = data['data'] || data;
		let list = Array.isArray(data) ? data : data['list'] ? data['list'] : data;
		return {
			list: list,
			currentPage: data['pageNum'],
			pageSize: data['pageSize'],
			total: data['total']
		}
	} //分页
	return !Array.isArray(data) && data && data['list'] ? data['list'] : data;
},
```
- 如上，分页所具备基本的函数变量和值，如下表
## 分页所需返回值参数说明 ，返回类型为`Object`=>{list:[],currentPage:1,pageSize:30,total:300}
|关键字|类型|解释|是否必须|补充|
|-|-|-|-|-|
|list|Array|分页获取当前页的数据|√|形如:[{a:1,b:2,c:3},{a:1,b:2,c:3},{a:1,b:2,c:3}]|
|currentPage|Number|当前页|√|当前分页数据所查询的所在页|
|pageSize|Number|每页显示条数|√||
|total|Number|总条数|√|通过总条数会计算总页数等相关信息|
## 不分页所需的返回值说明，返回类型为`Array`=>[{a:1,b:2,c:3},{a:1,b:2,c:3},{a:1,b:2,c:3}]
