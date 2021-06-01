<template>
  <ld-page-loading :loading="loading" class="box-b" style="height: calc(100vh - 20px);">
    <div class="w h f-c over-a-y ">
      <ld-forms :cols="1" :form="forms" :show-tip-button="true" :layout="layouts" class="w h box-b"
        style="width:820px;">
        <!-- 单独行插槽 -->
        <!-- <template v-slot:rowCustom="e">{{e}}</template> -->
        <!-- 单独行的 录入元素插槽 -->
        <template v-slot:testSlot="e">
          <div class="tip-w b-w1 ellipsis w"> {{e}}</div>
        </template>
        <template v-slot:dataInfo="e">
          <div class="tip-d b-d1"> {{e.form}}</div>
        </template>


        <!-- form表单插槽 -->
        <!-- <template v-slot:custom="e">{{e}}</template> -->

        <!-- form按钮插槽-->
        <template v-slot:buttons="e">
          <div class="w f-c">
            <el-button @click="saveData">保存</el-button>
          </div>
        </template>


      </ld-forms>
    </div>
  </ld-page-loading>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        loading: true,
        forms: {

        },
        layouts: [{
            prop: 'id',
            type: 'tip',
            tip: `这是一段测试文字！`,
            tipClass: 'tip-p b-p1',
            label: 'tip',
            showLabel: true
          }, {
            prop: 'id2',
            type: 'datakey',
            label: 'id'
          }, {
            prop: 'name',
            type: 'text',
            label: '姓名',
            css: 'c-d',
            style: 'color:red;',
            tip: `<div>姓名必须是<span class="c-d">3-6</span>个字符</div>`,
            tipClass: 'tip-d b-d1 p1 fs12',
            require: true
          }, {
            prop: 'password',
            type: 'text',
            password: true,
            tip: `<div>密码必须是<span class="c-d">6-12</span>个字符</div>`,
            label: '密码'
          }, {
            prop: 'testSlot',
            type: 'slot',
            label: '测试插槽',
          }, {
            prop: 'testSelect',
            type: 'select',
            label: '下拉框',
            options: [{
                label: '男',
                value: '1'
              },
              {
                label: '女',
                value: '0'
              },
            ],
            change: (val, event) => {
              return {
                height: {
                  label: val == '1' ? '男生身高' : '女生身高'
                },
                birthday: {
                  require: val == '1'
                }
              }
            },
            value: '1',
            regex: (val) => {
              return val == 1
            },
            require: true
          },
          {
            prop: 'height',
            type: 'text',
            label: '身高',

          },
          {
            prop: 'testSlider',
            type: 'slider',
            label: '滑块',
            value: 50,
          },
          {
            prop: 'rateTest',
            type: 'rate',
            label: '评分',
            value: 3,
            showScore: true
          },
          {
            prop: 'birthday',
            dateType: 'date',
            type: 'date',
            label: '出生日期',
            value: "1994-3-25",
            pickerOptions: {
              shortcuts: [{
                text: '去年',
                onClick(picker) {
                  const start = new Date();
                  start.setFullYear(start.getFullYear() - 1);
                  picker.$emit('pick', start);
                }
              }, {
                text: '今年',
                onClick(picker) {
                  const date = new Date();
                  picker.$emit('pick', date);
                }
              }, {
                text: '最近六个月',
                onClick(picker) {
                  const start = new Date();
                  start.setMonth(start.getMonth() - 6);
                  picker.$emit('pick', start);
                }
              }]
            },
            require: true,
          },
          {
            prop: 'menuIcon',
            type: 'icon',
            label: '菜单图标',
            require: true,
          },
          {
            prop: 'textNumber',
            type: 'number',
            label: '计数器',
            placeholder: '折扣',
            min: '1',
            max: '10',
            value: '1',
          }, {
            prop: 'switchTest',
            type: 'switch',
            label: '是否提醒',
            value: 'true',
            activeText: "开启",
            inactiveText: "不开启",
          }, {
            prop: 'tagList',
            type: 'tag',
            label: '姓氏',
            parseType: 'split',
            value: '张|王|李|赵| 钱 |孙',
            require: true,
          },
          {
            prop: 'addressPath',
            type: 'address',
            label: '活动地址',
            require: true,
          },
          {
            prop: 'createdTime',
            dateType: 'dateTime',
            type: 'sysdate',
            label: '创建日期',
            update: false,
            value: '2021-03-26 09:28:00'
          },
          {
            prop: 'updatedTime',
            dateType: 'dateTime',
            type: 'sysdate',
            label: '修改日期',
            update: true,
            value: '2021-03-26 09:28:00'
          },
          {
            prop: 'testRadio',
            type: 'radio',
            label: '特殊资源',
            isButton: true,
            options: [{
                label: '线下场地免费',
                value: '1'
              },
              {
                label: '线上品牌商赞助',
                value: '0'
              }
            ],
            value: '1',
            require: true,
            change:(val,event)=>{
              return {
                addressName:{
                  visabled:val==1
                },
                sponsorship:{
                  visabled:val==0
                },
              }
            }
          },
          {
            prop: 'addressName',
            type: 'textarea',
            label: '场地名称',
            visabled:true,
          },
          {
            prop: 'sponsorship',
            type: 'text',
            label: '赞助商名称',
            visabled:false,
          },
          {
            prop: 'testRadio2',
            type: 'radio',
            label: '特殊资源2',
            options: [{
                label: '线下场地免费',
                value: '1'
              },
              {
                label: '线上品牌商赞助',
                value: '0'
              }
            ],
            value: '1',
            require: true,
          },
          {
            prop: 'colorTest',
            type: 'color',
            label: '色板',
          },
          {
            prop: 'testCheckBox',
            type: 'checkbox',
            label: '活动性质',
            options: [{
                label: '美食/餐厅线上活动',
                value: '1'
              },
              {
                label: '地推活动',
                value: '2'
              },
              {
                label: '线下主题活动',
                value: '3'
              },
              {
                label: '单纯品牌曝光',
                value: '4'
              },
            ],
            parseType: 'split',
            require: true,
            value: "1|2 |4 "
          }, {
            prop: 'orderBy',
            type: 'param',
            label: '排序列',
            dataType: 'object',
            parseType: 'json',
            value: JSON.stringify({
              "sort": "asc"
            })
          }, {
            prop: 'likeys',
            type: 'param',
            label: '数组',
            dataType: 'arra',
            parseType: 'json',
            value: JSON.stringify(["参数。。。", "参数1"])
          }, {
            prop: 'remake',
            type: 'textarea',
            password: true,
            label: '备注信息',
            regex: /^.{4,}$/,
            rows: 5
          }, {
            prop: 'photo',
            type: 'image',
            label: '头像',
            limit: 4,
            isSplit:true,
            splitChart:',',
						value:'http://ki.orange-info.cn:80/kin/static/img/logo.png?rotate=90,http://ki.orange-info.cn:80/kin/static/img/logo.png?rotate=90,http://ki.orange-info.cn:80/kin/static/img/logo.png?rotate=180&,http://ki.orange-info.cn:80/kin/static/img/logo.png'
          }, {
            prop: 'dataInfo',
            type: 'slot',
            label: '表单数据',
          },
          {
            prop: 'transferTest',
            type: 'transfer',
            label: '穿梭框',
            parseType: 'split', //-------------
            options: [{
                label: '菜单编辑',
                value: '1'
              },
              {
                label: '菜单修改',
                value: '2'
              },
              {
                label: '菜单新增',
                value: '3'
              },
            ],
            splitChart: ','
          }
        ],
      };

    },
    methods: {
      saveData() {
        this.$ld.getRequest('test/getUserInfo').then(res => {
          console.log(res)
          if (res.code == 0) {
            return;
          }
        }, error => {
          console.log(error);
        })
        // this.$ld.request('test/getUserInfo', 'get', {}).then(res => {
        // 	debugger
        // 	console.log(res)
        // 	if (res.code == 0) {
        // 		return;
        // 	}
        // }, error => {
        // 	console.log(error);
        // })
      },
    },
    created() {
				alert("你好");
      setTimeout(() => {
        this.loading = false;
      }, 200);
    }
  }
</script>
