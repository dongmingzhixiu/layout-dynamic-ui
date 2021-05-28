export default {
	whereLayout: [{
			prop: 'nickName',
			label: '昵称',
			type: 'text'
		},
		{
			prop: 'phone',
			label: '电话号码',
			type: 'text'
		},
		{
			prop: 'sex',
			label: '性别',
			type: 'select',
			options: [{
				label: '男',
				value: '1'
			}, {
				label: '女',
				value: '0'
			}]
		},
	],
	tableLayout: (that) => {
		return [{
        label: '用户信息',
        children: [{
            prop: 'nickName',
            label: '用户名称'
          },
          {
            prop: 'phone',
            label: '电话号码'
          },
          {
            prop: 'sex',
            label: '性别',
            html: (val) => {
              return `<div class="${val==1?'c-d':'c-s'}">${val==1?'男':'女'}</div>`
            },
            width:'40px',
          },
          {
            prop: 'userType',
            label: '用户类别',
            html: (val) => {
              return `<div class="${val==1?'el-icon-s-custom':'el-icon-s-shop'}"></div>`
            }
          },
          {
            prop: 'birthday',
            label: '出生日期',
            format: (val) => {
              return !val ? '' : that.util.getNowD(0, new Date(val))
            },
            width:'100px'
          },
          {
            prop: 'createdTime',
            label: '创建时间',
            format: (val) => {
              return !val ? '' : that.util.getNowDT(0, new Date(val))
            },
            width:'180px'
          },
          {
            prop: 'updatedTime',
            label: '修改时间',
            format: (val) => {
              return !val ? '' : that.util.getNowDT(0, new Date(val))
            },
            width:'180px'
          },
          {prop: 'createdBy',label: '创建人', replace: {  remotePath: 'test/getUserById',remoteMethodType:'get', label: 'nickName', value: 'id'} },
          {
            prop: '',
            label: '地址',
            children: [{
                prop: 'province',
                label: '省份',
                format: (val) => {
                  return "甘肃省"
                }
              },
              {
                prop: 'city',
                label: '市区',
                format: (val) => {
                  return "兰州市"
                }
              },
              {
                prop: 'address',
                label: '地址',
                format: (val) => {
                  return "城关区"
                }
              },
            ]
          },
        ]
			},
			{
				label: '用户职责',
				prop: 'duty',
				format:(val)=>{
					return "无"
				},
				width:'50px'
			}
		]
	},
	ediforLayout: [{
			prop: 'phone',
			label: '电话',
			type: 'text',
			require: true,
		},
		{
			prop: 'nickName',
			label: '昵称',
			type: 'text',
		},
		{
			prop: 'sex',
			label: '性别',
			type: 'select',
			options: [{
				label: '男',
				value: '1'
			}, {
				label: '女',
				value: '0'
			}],
			value: "1"
		},
		{
			prop: 'userType',
			label: '用户类型',
			type: 'select',
			options: [{
				label: '管理员',
				value: '1'
			}, {
				label: '普通用户',
				value: '0'
			}],
			value: "0"
		},
		{
			prop: 'remake',
			label: '备注',
			type: 'textarea',
			rows: 5
		},
		{
			prop: 'createdBy',
			label: '指派人',
			type: 'select',
			getOptions: {
				remotePath: 'test/getUserInfo',
				remoteMethodType: "get",
				label: '${nickName}(${phone})',
				value: '${id}'
			},
		},
		{
			prop: 'createdTime',
			label: '创建日期',
			type: 'sysdate',
			update: false
		},
		{
			prop: 'updatedTime',
			label: '修改日期',
			type: 'sysdate',
			update: true
		},
	]
}
