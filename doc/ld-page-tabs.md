# `ld-page-tabs`标签页组件

## 效果图

  ![效果图](../effect/ld-page-tabs.png)

## `ld-page-tabs` 参数

> `ld-page-tabs` 只有简单的两个参数

|关键字|类型|解释|默认值|是否必须|说明|
|-|-|-|-|-|-|
|tabs|Array[Object]|关键字||√|组件代码具体的使用代码[组件代码](##`ld-page-tabs`tabs的属性)|
|showClose|Boolean|是否显示关闭按钮|true|√||
|showRefresh|Boolean|是否显示刷新按钮|true|√||
|showConfirm|Boolean|标签页关闭时，是否显示提示框|true|||
|closeBefore|Function(item)|标签关闭之前事件，true,false控制是否继续执行！||||
|refreshTabBefore|Function(item)|标签关闭之前事件，true,false控制是否继续执行！||||
|passEventUp|Boolean|是否向上传递事件|true||详细说明见[页面事件向上传递](##页面事件向上传递约定)|


## `ld-page-tabs` tabs 的属性

>  ld-page-tabs `tabs` 是一组对象的集合，其中对象属性如下：

|关键字|类型|解释|默认值|是否必须|说明|
|-|-|-|-|-|-|
|prop|String|关键字||√||
|label|String|标签页显示文字||√||
|page|String|组件代码\|网页地址(网页地址必须具备http://或https://)||√|组件代码具体的使用代码[组件代码](##ld-page-tabs组件代码)|
|selected|String\|Number|选中的tab|||为tab下标时必须是Number,不是下标则需要设置为要显示的tab的prop值|

>参数里边可以包含其他属性

## ld-page-tabs 组件代码

> 组件代码是指，在使用页面中，通过将页面注册为组件，之后使用`<component :is="page"></component>`
> 标签动态加载页面内容。通常在后台管理系统中，会使用到标签页，此时，通过将页面注册成组件进行使用。
> 具体示例如下：
- 在`main.js`(也可单独使用一个js文件，通过导出`vue 的install方法`)中引入页面，并注册成组件

```javascript
import HelloWorld from '@/pages/HelloWorld'
import formChange from '@/pages/forms-change.vue'
import test1 from '@/pages/test1'
import test2 from '@/pages/test2'
import test3 from '@/pages/test3'
import test4 from '@/pages/test4'
import saveForms from '@/pages/saveFormTest.vue'
import table from '@/pages/table.vue'
import menuTree from '@/pages/menuTree.vue'
import pageTabs from '@/pages/pageTabs.vue'

Vue.component('hello-world', HelloWorld);
Vue.component('form-Change', formChange);
Vue.component('test1', test1);
Vue.component('test2', test2);
Vue.component('test3', test3);
Vue.component('test4', test4);
Vue.component('save-forms', saveForms);
Vue.component('table', table);
Vue.component('menu-tree', menuTree);
```

- 组件注册之后我们就可以进行标签页面的配置和使用

```javascript
//...
data(){
	return {
		tabs:[
			{prop:'1',page:'hello-world',label:'HelloWord'},
			{prop:'2',page:'form-Change',label:'联动'},
			{prop:'3',page:'test1',label:'测试1'},
			{prop:'4',page:'test2',label:'测试2'},
			{prop:'5',page:'test3',label:'测试3'},
			{prop:'6',page:'test4',label:'测试4'},
			{prop:'7',page:'save-forms',label:'form表单和表格'},
			{prop:'8',page:'table',label:'表格'},
			{prop:'9',page:'menu-tree',label:'菜单树'},
		]
	}
}
//..
```
## Event 事件
|名称|类型|返回值|解释|说明|
|-|-|-|-|-|
|click|Function(item)||标签页点击事件|当点击标签页时，触发事件。|
|close|Function(item)||关闭标签页后发生事件|当关闭标签页后，触发事件。|
|refresh|Function(item)||更新标签页后击事件|更新标签页后，触发事件。|

## Slot 插槽（作用域插槽）
|名称|类型|插槽入参|说明|
|-|-|-|-|
|page|作用域插槽|item {} 一个tab元素对象值|使用此插槽意味着你需要自己完成页面相关的显示和操作|


## 页面事件向上传递约定

> 在将页面作为组件进行标签页操作时，有时需要在页面操作后床底到标签页外部以便进行其他关操作，此时便需要使用固定的格式进行参数传递

- 设置 `passEventUp = true` 向上传递数据

-- 在页面中使用如下代码
```javascript
	//向上传递事件名称必须是event，参数必须具备eventMethod和eventParam
	this.$emit('events',{eventMethod:'click',eventParam:{}});
```
此时在`ld-page-tabs`页面中处理函数使用如下代码
```html
<ld-page-tabs @events="getEvent"></ld-page-tabs>
```
```javascript
//....
	getEvent(event){
		//处理 相关事件
	}
//...
```

- 设置 `passEventUp = false` 不向上传递数据，此时事件则会散播
-- 在页面中使用如下代码
```javascript
	//向上传递事件名称必须是event，参数必须具备eventMethod和eventParam
	this.$emit('events',{eventMethod:'click',eventParam:{}});
```
此时在`ld-page-tabs`页面中处理函数使用如下代码
```html
<ld-page-tabs @click="getEvent"></ld-page-tabs>
```
```javascript
//....
	getEvent(event){
		//这里的 event则为eventParam的值
		//处理 相关事件
	}
//...
```