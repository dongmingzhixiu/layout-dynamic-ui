<template>
  <div id="app" class="w h-vh box-b">
    <router-view class="wh box-b over-a-y" />
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      init() {
        //设置请求地址
        this.$ld.requestSetting.serverPath.set('http://127.0.0.1:18085/frame/');

        this.$ld.requestSetting.init = (axios) => {
          return axios;
        }

        this.$ld.requestSetting.config.timeout = 2000;




        //重写请求拦截器
        this.$ld.requestSetting.interceptor = {
          before: (event) => {
            console.log("before:进入拦截器。。。。");
            if(event.options.method=='get'){
              return true;
            }
            return this.$confirm('确定保存数据吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              return Promise.resolve(true);
            }).catch(() => {
              this.$message.info("用户取消了操作！");
              return Promise.resolve(false);
            });
            // return true;
          },
          after: (event) => {
            return Promise.resolve(event.data)
            // return event.data;
          }
        }


      }
    },
    created() {
      this.init();
    }
  }
</script>

<style>
  /*每个页面公共css */
 /* @import url('lib/static/css/basic.css');
  @import url('lib/static/css/base.css');
  @import url('lib/static/css/other.css');
  @import url('lib/static/css/theme.less'); */
</style>
