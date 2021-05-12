# `ld-frame`后台管理页

## 效果图

  ![效果图](../effect/ld-frame.png)

## `ld-frame` 参数

> `ld-page-tabs` 只有简单的几个参数

|关键字|类型|解释|默认值|是否必须|说明|
|-|-|-|-|-|-|
|menuTreeUniqueOpened|Boolean|菜单树是否只打开一个|||菜单树是否只打开一个|
|menuTree|Array|菜单树参数|||详情参考[菜单树参数](./ld-menu-tree.md##`ld-menu-tree`属性)|
|leftHeadInfo|Object||头部左侧信息||{image:'logo图片',label:'右侧第一行文字',text:'右侧第二行文字'}||
|passEventUp|Boolean|是否向上传递事件|true||详细说明见[页面事件向上传递](##页面事件向上传递约定)|
|showConfirm|Boolean|关闭窗口时，是否弹框提示|true|||


## Event 事件
 > 无


## Slot 插槽（作用域插槽）
|名称|类型|插槽入参|说明|
|-|-|-|-|
|headCenter|默认插槽||头部内容插槽|
|logo|作用域插槽||自定义左侧图标和文字|
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
