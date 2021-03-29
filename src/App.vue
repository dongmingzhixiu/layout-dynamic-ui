<template>
  <div id="app" class="w h-vh box-b">
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
  @import url('./../static/css/theme.css');
  @import url('./../static/css/base.css');
  @import url('./../static/css/other.css');

</style>
