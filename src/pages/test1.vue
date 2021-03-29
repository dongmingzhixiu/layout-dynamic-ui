<template>
  <div class="b-i1 w h box-b p10">
    <el-card style="width: 500px;padding: 10px;">
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
          label: '下拉框', //[String]
          type: 'select',
          options: [{
              label: '文本一',
              value: '1'
            },
            {
              label: '文本二',
              value: '2'
            },
            {
              label: '文本三',
              value: '3'
            },
            {
              label: '文本四',
              value: '4'
            },
          ],
        }],
        forms: {},
      }
    }
  }
</script>

<style>
</style>
