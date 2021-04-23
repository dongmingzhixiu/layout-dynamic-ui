<template>
  <div class="f-s-w">
    <ld-forms class="m-t10 m-b10" :form="forms" :layout="formLayout" :is-row="true">
      <template v-slot:buttons="e">
        <el-button type="primary m-l10">定制</el-button>
      </template>
    </ld-forms>
    <div class="f-s-w">
      <div class="cur-p" @click="copy(key)" v-for="(key,i) in Object.keys(loadingTypes)" :key="i">
        <ld-page-loading :background="forms['background']" :color="forms['color']" :loading-text="forms['loadingText']"
          :skin="forms['skin']" class="w-200 h-200" :loading-type="key" :loading="true">
          <div class="w h position-relative">
            <div :id="key" style="z-index: 1004;position: absolute;bottom: 0;text-align: center;" class="w p10 box-b">
              {{key}}
            </div>
          </div>
        </ld-page-loading>
      </div>
    </div>
  </div>
</template>

<script>
  import res from '@/lib/config/ld-loading-res.js'
  import res2 from '@/pages/loading-res.js'
  export default {
    data() {
      return {
        loadingTypes: res.loadingTypes,
        forms: {
          skin: 'light'
        },
        formLayout: res2.layout,
      };
    },
    methods: {
      copy(key) {
        let flg = this.$ld.util.copyToClipboard(key);
        this.$message[flg ? 'success' : 'error'](flg ? "复制成功！" : "复制失败，请选中代码使用Ctrl+C进行复制,Ctrl+V进行黏贴！");
      }
    },
    beforeCreate() {
      //配置全局参数
      this.$ld.component.ldLoadingPage = {
        loadingType: 'line-scale'
      }
    },

    created() {

    }
  }
</script>

<style>
</style>
