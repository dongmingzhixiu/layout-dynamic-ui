<template>
  <!-- 安装 -->
  <div class="box-b p10 ">
    <el-card class="doc w over-a-y">
      <ld-doc :doc="doc" class="w h over-a-y">
        <template v-slot:custom="e">
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
        doc: [{
          h1: '1.安装',
          h2: 'npm安装',
          p: '推荐使用 npm 的方式安装，它能更好地和 webpack 打包工具配合使用。',
          shell: 'npm i layout-dynamic-ui',
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
          code:{
            javascript:
              (`
  import import Vue from 'vue'
  import App from './App'
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
  })`).replace(/^              /g, ' ')
          }
        }]
      }
    }
  }
</script>

<style>
</style>
