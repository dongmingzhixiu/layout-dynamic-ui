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
        //设置开发地址
        this.$ld.requestSetting.serverPath.development.set('http://127.0.0.1:18085/frame/');
        //设置生产地址
        this.$ld.requestSetting.serverPath.production.set('http://127.0.0.1:8085/frame/');

        //重写请求拦截器
        this.$ld.requestSetting.intercept = {
          /**
           * 请求之前调用的方法
           * @param {object} 请求之前的返回参数
           * @return Boolean|Promise ,
           *        Boolean true,继续执行，false:终止执行
           *        Promise 需要使用 Promise.resolve(Boolean:true|false) true,false 表示是否继续执行
           */
          before: (event) => {
            console.log("before:进入拦截器。。。。");
            //支持方式


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


        this.$ld.requestSetting.init = (axios) => {
          alert('设置axios信息！');
          return axios;
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
  @import url('../static/css/basic.css');
  @import url('./../static/css/base.css');
  @import url('./../static/css/other.css');
  @import url('./../static/css/theme.less');
</style>
