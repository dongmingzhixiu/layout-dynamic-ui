<template>
 <el-menu :mode="mode" :collapse="collapse" :background-color="backgroundColor" :text-color="textColor"
    :active-text-color="activeTextColor" :default-active="defaultActive" :unique-opened="uniqueOpened"
    :menu-trigger="menuTrigger" :collapse-transition="collapseTransition" :default-openeds="opens">
    <template v-for="(item,i) in trees">
      <ld-menu-tree-item :collapse="collapse" v-if="Object.keys(item).includes('children') &&item['children']&&item['children'].length>0" :item="item" :key='i' :index="`${i}`"
        @click="menuClick">
        <template #title="e">
          <i v-if="e['item']['icon']" :class="e['item']['icon']"></i>
          <div class="el-menu-text-info ellipsis">{{e['item']['label']}}</div>
        </template>
      </ld-menu-tree-item>
      <template v-else>
        <el-menu-item :index="`${i}`" :key="i" @click="menuClick(item)">
          <template v-if="collapse">
            <el-tooltip placement="right">
              <div slot="content">
                <div class="el-menu-text-info ellipsis ">{{item['label']}}</div>
              </div>
              <i v-if="item['icon']" :class="item['icon']" style="font-size:18px;width: 24px;height: 18px;text-align: center;"></i>
              <div v-if="!collapse||!item['icon']" class="el-menu-text-info ellipsis">{{item['label']}}</div>
            </el-tooltip>
          </template>
          <template v-else>
            <i v-if="item['icon']" :class="item['icon']"></i>
            <div v-if="!collapse||!item['icon']" class="el-menu-text-info ellipsis">{{item['label']}}</div>
          </template>
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
        default: false
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

      /**
       * 是否只展开所有子节点
       */
      defaultExpandAll: {
        type: Boolean,
        default: false
      },
    },
    watch: {
      defaultExpandAll(news) {
        this.defaultExpandAlls = news;
        this.initExportAll();
      },
      tree(news) {
        this.trees = news;
        this.initExportAll();
      }

    },
    data() {
      return {
        defaultExpandAlls: this.defaultExpandAll,
        activeIndex: '0',
        opens: [],
        trees: [],
      }
    },
    methods: {
      menuClick(e) {
        this.$nextTick(() => {
          this.$emit("click", e);
        });
      },
      getOpens(item, opens, index) {
        if (this.defaultExpandAlls) {
          opens[opens.length] = index+'';
        }
        if (Object.keys(item).includes('children') && item['children'] && item['children'].length > 0) {
          let _index = 0;
          item['children']=item['children'].map(citem => {
            let _i = index + '_' + _index;
            citem = this.getOpens(citem, opens, _i);
            citem['index'] = _i;
            _index++;
            return citem;
          });
        }
        item['index'] = index + '';
        return item;
      },
      initExportAll() {
        let index = 1;
        this.tree.map(item => {
          item = this.getOpens(item, this.opens, index);
          this.$set(this.trees,index-1,item);
          index++;
        });
      }


    },
    created() {
      this.initExportAll();
    }
  }
</script>

<style>
  .el-submenu__title,
  .el-menu-item {
    display: flex !important;
    justify-content: flex-start !important;
    align-items: center !important;
  }
</style>
