<template>
  <!-- 元素联动 -->
  <div class="b-i1 w h box-b p10">
    <el-card style="width: 500px;padding: 10px;height: 500px;">
      <ld-forms :layout="layout" :form="forms">
      </ld-forms>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        layout: [{
            //必填属性
            prop: 'select', //[String]
            label: '联动类型', //[String]
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
                label: '通过form设置text值',
                value: '7'
              },
              {
                label: '通过form设置值并添加验证',
                value: '8'
              },
              {
                label: '设置值并添加验证,修改错误提示',
                value: '9'
              },
            ],
            change: (val, event) => {
              return {
                textInfo: {
                  label: val == '1' ? '修改后的名称' : '文本框',
                  readonly: val == '2',
                  require: val == '3',
                  visabled: val != '4',
                  //使用正则和 函数混合使用
                  regex: ['6','8','9'].includes(val)? /^[\u4e00-\u9fa5]{4,6}$/ : (textVal) => {
                    return function(textVal) {
                      if (val != "5") {
                        return true;
                      }
                      return /^[0-9]{4,6}$/.test(textVal);
                    }
                  },
                  msg:['7','9'].includes(val)  ? '名称必须为汉字' : '',
                },
                form:{
                  textInfo: ['7','8','9'].includes(val) ? '123456' : ''
                }
              }
            }
          },
          {
            prop: 'textInfo',
            type: 'text',
            label: '文本框',
            readonly: true,
            visabled: true,
          }
        ],
        forms: {},
      }
    }
  }
</script>

<style>
</style>
