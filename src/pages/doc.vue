<template>
  <!-- 安装 -->
  <div class="box-b p10 ">
    <div class="f-s a-i-c">
      <el-button @click="skin=skin=='light'?'dark':'light'">{{skin=='light'?'深色':'浅色'}}</el-button>
      <el-button @click="align='left'">大纲居左</el-button>
      <el-button @click="align='right'">大纲居右</el-button>
      <el-button @click="align='center'">大纲居中</el-button>
      <div class="p-l10">
        内容区大小:
      </div>
      <el-input style="width:300px" placeholder="内容区大小" v-model="docWidth"></el-input>
    </div>
    <el-card class="doc w h">
      <ld-doc :aligns="align" :doc-width="docWidth" :skin="skin" :doc="doc" class="w over-a-y"
        style="height: calc(100vh - 40px);">
        <template v-slot:custom="e">
          <ld-page-loading :loading="true" class="w-200 h-200"></ld-page-loading>
          <div> 这是插槽获取到的数据{{e}}这里可以更具实际情况，结合代码去做示例说明</div>
        </template>
        <template v-slot:test="e">
          <div>content:{{e}}</div>
        </template>
        <template v-slot:test2="e">
          <div>content2：{{e}}</div>
        </template>
      </ld-doc>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'installs',
    data() {
      return {
        skin: 'light',
        align: 'left',
        docWidth: '100%',

        doc: [{
            title: '文章安装文章安装文章安装',
            h1: '1.文章安装文章安装文章安装文章安装文章安装文章安装文章安装文章安装文章安装文章安装文章安装文章安装文章安装文章安装文章安装',
            h2: 'npm安装.文章安装文章安装文章安装文章安装文章安装文章安装文章安装文.文章安装文章安装文章安装文章安装文章安装文章安装文章安装文',
            p: '推荐使用 npm 的方式安装，它能更好地和 webpack 打包工具配合使用。',
            bash: 'npm i layout-dynamic-ui',
            //插槽 插槽名称
            slot: 'custom',
          }, {
            p: '我们期望通过传入简单的数据参数，来控制显示布局，避免同样的重复构建相似的布局。我们甚至可以通过从数据库加载布局信息，来显示不同的表单结构，让开发只需要专注于结构，减少对布局的重复构建。',
          }, {
            tip: '我们期望通过传入简单的数据参数，来控制显示布局，避免同样的重复构建相似的布局。我们甚至可以通过从数据库加载布局信息，来显示不同的表单结构，让开发只需要专注于结构，减少对布局的重复构建。',
            tip_d: '我们期望通过传入简单的数据参数，来控制显示布局，避免同样的重复构建相似的布局。我们甚至可以通过从数据库加载布局信息，来显示不同的表单结构，让开发只需要专注于结构，减少对布局的重复构建。',
            tip_w: '我们期望通过传入简单的数据参数，来控制显示布局，避免同样的重复构建相似的布局。我们甚至可以通过从数据库加载布局信息，来显示不同的表单结构，让开发只需要专注于结构，减少对布局的重复构建。',
            tip_i: '我们期望通过传入简单的数据参数，来控制显示布局，避免同样的重复构建相似的布局。我们甚至可以通过从数据库加载布局信息，来显示不同的表单结构，让开发只需要专注于结构，减少对布局的重复构建。',
            tip_s: '我们期望通过传入简单的数据参数，来控制显示布局，避免同样的重复构建相似的布局。我们甚至可以通过从数据库加载布局信息，来显示不同的表单结构，让开发只需要专注于结构，减少对布局的重复构建。',
          },
          {
            h1: '2.安装',
            h2: '3npm安装',
          },
          {
            h1: '3.安装',
            h2: '4npm安装',
          },
          {
            h1: '4.安装',
            h2: '5npm安装',
          },
          {
            h1: '5.安装',
            h2: '6npm安装',
          },
          {
            code: {
              vue: `
                import Vue from 'vue';
                import App from './App';
                import ElementUI from 'element-ui';
                import 'element-ui/lib/theme-chalk/index.css';

                import layoutDynamicUI from 'layout-dynamic-ui';
                import 'layout-dynamic-ui/lib/index.css';
                Vue.use(ElementUI);
                Vue.use(layoutDynamicUI);
                Vue.config.productionTip = false
                new Vue({
                  el: '#app',
                  components: { App },
                  template: '<App/>'
                })`.replace(/^             /gm, ' ')

            },
            md: `|姓名|年龄|
            |-|-|
            |张三|18|
            |李四|19|
            `
          }
        ]
      }
    }
  }
</script>

<style>
</style>
