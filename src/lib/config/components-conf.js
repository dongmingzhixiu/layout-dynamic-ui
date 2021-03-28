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
export {
	config
}
