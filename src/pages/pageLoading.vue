<template>
  <div class="f-s-w">
    <div class="cur-p" @click="copy(key)" v-for="(key,i) in Object.keys(loadingTypes)" :key="i">
      <ld-page-loading class="w-200 h-200" :loading-type="key" :loading="true">
        <div class="w h position-relative">
          <div :id="key" style="z-index: 1004;position: absolute;bottom: 0;text-align: center;" class="w p10 box-b">{{key}}</div>
        </div>
      </ld-page-loading>
    </div>
  </div>
</template>

<script>
  import res from '@/lib/config/ld-loading-res.js'
  export default {
    data() {
      return {
        loadingTypes: res.loadingTypes,
      };
    },
    methods: {
      copy(key) {
        let el = document.getElementById(key);
        try {
          if (document.selection) { // IE8 以下处理
            var oRange = document.body.createTextRange();
            oRange.moveToElementText(el);
            oRange.select();
          } else {
            var range = document.createRange();
            // create new range object
            range.selectNodeContents(el); // set range to encompass desired element text
            var selection = window.getSelection(); // get Selection object from currently user selected text
            selection.removeAllRanges(); // unselect any user selected text (if any)
            selection.addRange(range); // add range to Selection object to select it
          }
          let flg = document.execCommand("copy");
          this.$message[flg ? 'success' : 'error'](flg ? "复制成功！" : "复制失败，请选中代码使用Ctrl+C进行复制,Ctrl+V进行黏贴！");
        } catch (e) {
          this.$message.error("复制失败，请选中代码使用Ctrl+C进行复制,Ctrl+V进行黏贴！");
        }
      }
    },

    created() {

    }
  }
</script>

<style>
</style>
