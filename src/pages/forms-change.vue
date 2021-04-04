<template>
  <!-- 元素联动 -->
  <div class="b-i1 w h box-b p10">
    <el-card class="f-s" style="width: 500px;padding: 10px;height: 500px;">
      <ld-forms :layout="layout" :form="forms" :show-default-tip="true">
      </ld-forms>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        layout: [
          {
            prop: 'textInfo',
            type: 'text',
            tip:'这是被操纵的悲惨组件',
            label: '文本框',
            readonly: true,
            visabled: true,
          },{
            //必填属性
            prop: 'select',
            tip:'控制属性和验证规则',
            label: '属性验证联动',
            type: 'select',
            options: [{
                label: '修改提示名称',
                value: '1'
              },
              {
                label: '修改为只读',
                value: '2'
              },
              {
                label: '设置为必填项',
                value: '3'
              },
              {
                label: '隐藏文本框',
                value: '4'
              },
              {
                label: '使用函数验证4-6为数字',
                value: '5'
              },
              {
                label: '使用正则验证4-6为汉字',
                value: '6'
              },
              {
                label: '修改为密码框',
                value: '7'
              },
            ],
            change: (val, event) => {
              return {
                textInfo: {
                  label: val == '1' ? '修改后的名称' : '文本框',
                  readonly: val == '2',
                  require: val == '3'||val=='7',
                  visabled: val != '4',
                  password:val=='7',
                  //使用正则和 函数混合使用
                  regex: val=='6' ? /^[\u4e00-\u9fa5]{4,6}$/ : (textVal) => {
                    return function(textVal) {
                      debugger
                      if (val != "5"&&val!='7') {
                        return true;
                      }
                      return /^[0-9]{4,6}$/.test(textVal);
                    }
                  },
                  msg: val=='6' ? '名称必须为汉字' : '',
                },
              }
            }
          },

          {
            //必填属性
            prop: 'changeType',
            tip:`通过<span class='c-d p2'>form</span><span class='c-d p2'>layout</span>控制表单布局和数据`,
            label: '数据布局联动',
            type: 'select',
            options: [{
              label: '修改为select',
              value: '1'
            },{
              label: '修改为text',
              value: '2'
            }],
            change: (val, event) => {
              return {
                /**
                 * 通过form关键字进行操作
                 * 可使用Function(value,event)函数  或者  Object对象进行操作
                 *
                 */

                //方式1： 通过Object进行设置
                // form: {
                //   textInfo: ['7', '8', '9'].includes(val) ? '123456' : ''
                // },
                //方式2；使用function(value,event)函数设置元素的值
                form: (value, event) => {
                  let form = event['form'];
                  form['textInfo'] =val==2 ? '123456' : '';
                  return form;
                },

                /**
                 * 通过layout关键字进行操作
                 * 与from相似，同样可使用Function(value,event)函数  或者  Array对象进行操作
                 *
                 */

                //方式1： 通过Object进行设置
                // layout: [
                //   {
                //     prop: 'textInfo',
                //     type: 'select',
                //     options: [{
                //       label: '测试1',
                //       value: '1'
                //     }, {
                //       label: '测试2',
                //       value: '2'
                //     }],
                //     label: '修改为select'
                //   }
                // ],

                //方式2；使用function(value,event)函数设置元素的值
                layout: (value, event) => {
                  let layout = event['layout'];
                  let item = layout.filter(item => item.prop == 'textInfo');
                  if (item.length <= 0) {
                    return layout;
                  }
                  let index = layout.indexOf(item[0]);
                  item=item[0];
                  //重新修改textInfo结构
                  item['type'] = val != 1 ? 'text' : 'select';
                  item['label'] = val != 1 ? '文本框': '修改为select';
                  item['readonly'] = false;
                  item['options'] = val != 1 ? [] : [{
                    label: '测试1',
                    value: '1'
                  }, {
                    label: '测试2',
                    value: '2'
                  }];
                  layout[index] = item;
                  return layout;
                }
              }
            }

          }
        ],
        forms: {},
      }
    }
  }
</script>

<style>
</style>
