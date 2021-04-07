<template>
  <el-menu :mode="mode" :collapse="collapse" :background-color="backgroundColor" :text-color="textColor"
    :active-text-color="activeTextColor" :default-active="defaultActive" :unique-opened="uniqueOpened"
    :menu-trigger="menuTrigger" :collapse-transition="collapseTransition">
    <template v-for="(item,i) in tree">
      <ld-menu-tree-item v-if="item['children']&&item['children'].length>0" :item="item" :key='i' :index="`${i}`"
        @click="menuClick">
        <template #title="e">
          <i v-if="e['item']['icon']" :class="e['item']['icon']"></i>
          <span>{{e['item']['label']}}</span>
        </template>
      </ld-menu-tree-item>
      <template v-else>
        <el-menu-item :index="`${i}`" :key="i" @click="menuClick(item)">
            <i v-if="item['icon']" :class="item['icon']"></i>
            <span>{{item['label']}}</span>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script>
  import ldMenuTreeItem from './ld-menu-tree-item.vue'
  export default {
    name: 'ld-menu-tree',
    components: {
      ldMenuTreeItem
    },
    props: {
      /**
       * 菜单参数
       */
      tree: {
        type: Array,
        default: () => {
          return [];
        }
      },
      /**
       * 类型
       */
      mode: {
        type: String,
        default: 'vertical'
      },
      /**
       * 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
       */
      collapse: {
        type: Boolean,
        default: false
      },
      /**
       * 菜单的背景色（仅支持 hex 格式）
       */
      backgroundColor: {
        type: String,
        default: '#ffffff'
      },
      /**
       * 菜单的文字颜色（仅支持 hex 格式）
       */
      textColor: {
        type: String,
        default: '#303133'
      },
      /**
       *当前激活菜单的文字颜色
       */
      activeTextColor: {
        type: String,
        default: '#409EFF'
      },
      /**
       * 是否开启折叠动画
       */
      collapseTransition: {
        type: Boolean,
        default: true
      },
      /**
       * 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)
       */
      menuTrigger: {
        type: String,
        default: 'click'
      },
      /**
       * 是否只保持一个子菜单的展开
       */
      uniqueOpened: {
        type: Boolean,
        default: false
      },
      /**
       * 当前激活菜单的 index
       */
      defaultActive: {
        type: String,
        default: '0'
      },

    },
    data() {
      return {
        activeIndex: '0',
      }
    },
    methods: {
      menuClick(e) {
        this.$nextTick(() => {
          this.$emit("click", e);
        });
      }
    }
  }
</script>

<style>
</style>
