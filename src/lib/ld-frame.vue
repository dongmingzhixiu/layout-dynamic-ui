<template>
  <div class="w h f-s box-b">
    <!-- 左侧 -->
    <div class="w h f-n-c-w box-b over-h " :class="{'w-200 move_right':collapse,'w-64 move_left':!collapse}"
      style="background-color: #545c64;color: #fff;">
      <div v-if="!$scopedSlots.logo" class="logo f-c a-i-c b-i2" style="height: 60px;">
        <img v-if="!collapse" class="w-40 h-40 b-t" :src="leftHeadInfo.image"
          :title="`${leftHeadInfo.label} \r\n ${leftHeadInfo.text}`"></img>
        <div v-else>
          <div class="fs14 c-f fs-w-b">{{leftHeadInfo.label}}</div>
          <div class="fs14 f-s a-i-c c-f">{{leftHeadInfo.text}}</div>
        </div>
      </div>
      <slot name="logo" :item="{collapse:collapse}"></slot>
      <div class="w box-b" style="height: calc(100% - 60px); overflow: auto;">
        <ld-menu-tree :uniqueOpened="menuTreeUniqueOpened" class="w h" :default-active="menuTreeDefaultActive"
          :tree="menuTrees" @click="menuClick" :collapse="!collapse" background-color="#545c64" text-color="#fff"
          :collapse-transition="false" active-text-color="#ffd04b"></ld-menu-tree>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="h b-i1 box-b" style="flex-grow: 2;" :style="{'width':`calc(100% - ${!collapse?'65px':'200px'})`}">
      <!-- 头部 -->
      <div class="w f-s b-f a-i-c box-b" style="height: 60px;">
        <div class="m-l10 fs20 c6 head-select" @click="collapse=!collapse"
          :class="{'el-icon-s-fold':collapse,'el-icon-s-unfold':!collapse}"></div>
        <div style="flex-grow: 2;">
          <slot name="headCenter"></slot>
        </div>
      </div>
      <!-- 主体 -->
      <div class="w box-b" style="height: calc(100% - 60px);">
        <ld-page-tabs class="w h" :tabs="pageTabs" :selected="tabSelected" @close="closeTabPage" @events="getEvents">
          <template v-if="$scopedSlots.page" v-slot:page="e">
            <slot name="page" :item="e.item"></slot>
          </template>
        </ld-page-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ld-frame',
    props: {
      /**
       * 菜单树是否只打开一个
       */
      menuTreeUniqueOpened: {
        type: Boolean,
        default: true
      },
      /**
       * 菜单树参数
       */
      menuTree: {
        type: Array,
        default: () => {
          return []
        }
      },
      /**
       * 头部左侧信息
       */
      leftHeadInfo: {
        type: Object,
        default: () => {
          return {
            image: 'data:image/png;base64,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',
            label: 'Layout-Dynamic-UI',
            text: '用参数构建布局'
          };
        }
      },
      /**
       * 是否向上传递事件，true 继续 向上传递，false散播事件
       */
      passEventUp: {
        type: Boolean,
        default: true,
      },


    },
    watch: {
      menuTree(news) {
        this.menuTrees = news;
        this.selectFirstPage();
      }
    },
    data() {
      return {
        collapse: true,
        menuTreeDefaultActive: '',
        menuTrees: this.menuTree || [],
        headHeight: '80px',
        pageTabs: [],
        tabSelected: 0,
      }
    },
    methods: {
      menuClick(e) {
        if (!e['prop']) {
          return;
        }
        let item = this.pageTabs.filter(item => item.prop == e.prop);
        if (item.length <= 0) {
          this.$set(this.pageTabs, this.pageTabs.length, e);
        }
        //选中
        this.$nextTick(() => {
          this.tabSelected = this.pageTabs.indexOf(e);
        })
      },
      /**
       * 选中第一个
       */
      selectFirstPage() {
        if (this.menuTrees.length <= 0) {
          return;
        }
        let isChildren = this.menuTrees && this.menuTrees.length > 0 && this.menuTrees[0]['children'] && this.menuTrees[
          0]['children'].length > 0;
        this.pageTabs = this.pageTabs.length > 0 ? this.pageTabs : isChildren ? [this.menuTrees[0]['children'][0]] : [
          this.menuTrees[0]
        ];
        this.menuTreeDefaultActive = isChildren ? '0_0' : '0';
        this.$nextTick(() => {
          this.tabSelected = this.tabSelected < 0 ? 0 : this.tabSelected;
        })
      },
      /**
       * 处理页面事件
       * @param {Object} e
       */
      getEvents(event) {
        if (this.passEventUp) {
          this.$emit("events", event);
          return;
        }
        this.$emit(event['eventMethod'], event['eventParam'])
      },
      /**
       * 关闭时间
       */
      closeTabPage($event) {
        this.pageTabs = $event.tabs;
        this.tabSelected = $event.selected;
      },
      /**
       * 通过prop关闭tab
       * @param {Object} prop
       */
      closeTabPageByProp(prop) {
        if (!prop) {
          return;
        }
        this.pageTabs = this.pageTabs.filter(item => item['prop'] != prop);
        if (this.pageTabs.length - 1 < this.tabSelected) {
          this.tabSelected = this.pageTabs.length - 1;
        }
      }
    },
    created() {
      this.selectFirstPage();
    }
  }
</script>

<style>
  .w-64 {
    width: 64px;
  }

  .head-select {
    border: 2px solid transparent;
  }

  .head-select:hover {
    border-bottom: 2px solid #282828;
  }


  /* 动画绑定 */
  .move_right {
    animation-name: move_right;
    animation-duration: 0.3s;
  }

  .move_left {
    animation-name: move_left;
    animation-duration: 0.1s;
  }

  @keyframes move_right {
    from {
      width: 64px;
    }

    to {
      width: 200px;
      transition: all 0.5s
    }
  }

  @keyframes move_left {
    from {
      width: 200px;
    }

    to {
      width: 64px;
      transition: all 0.1s;
    }
  }

  .el-menu {
    border-right: none !important;
  }


  .el-tabs__item {}

  .el-tabs__content {
    padding: 0 !important;
    background-color: rgba(244, 244, 244, 0.5) !important;
  }

  .el-tabs--border-card>.el-tabs__header {
    /* box-shadow: 0 var(--x4) var(--x12) 0 rgba(0, 0, 0, 0.1); */
  }
</style>
