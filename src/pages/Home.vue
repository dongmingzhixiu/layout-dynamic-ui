<template>
  <ld-frame class="h-vh" :menu-tree="menuTree"></ld-frame>
</template>

<script>

  import layout from './layout.js'
  export default {
    data(){
      return {
        menuTree:layout.menuTree,
      }
    }
  }
</script>

<style>
</style>
