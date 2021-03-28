<template>
  <div id="app" class="w box-b">
    <router-view class="wh box-b over-a-y" />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>

  /*每个页面公共css */
  @import url('../static/css/basic.css');
  @import url('./../static/css/base.css');
  @import url('./../static/css/other.css');
  @import url('./../static/css/theme.less');

</style>
