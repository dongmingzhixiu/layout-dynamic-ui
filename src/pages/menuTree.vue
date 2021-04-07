<template>
  <div>
    <div class="tip-d b-d1 h-60">
     当前选中值：<span class="c8"> {{item['label']}}{{item}}</span>
    </div>
    <div class="f-s m-t10 ">
      <div class="w-220 box-b m-r10">
        <div class="tip-p b-p1 f-s a-i-c">
          <div class="m-r2 h-40 a-i-c">菜单展开或折叠</div>
          <el-button @click="collapse=!collapse">{{collapse?'展开':'折叠'}}</el-button>
        </div>
        <ld-menu-tree :tree="tree" @click="menuClick" :collapse="collapse"></ld-menu-tree>
      </div>

      <div class="w-220 box-b m-r10">
        <div class="tip-p b-p1 f-s a-i-c">
          <div class="m-r2 h-40 a-i-c">设置颜色<span class="c8">当前为<span class="c-d">{{!collapse?'折叠':'展开'}}</span>状态</span></div>
        </div>
        <ld-menu-tree :tree="tree" @click="menuClick" :collapse="!collapse"   background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"></ld-menu-tree>
      </div>
      <div class="p10 m-b10">
        <ld-menu-tree :tree="tree" mode="horizontal" @click="menuClick"></ld-menu-tree>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        collapse: false,
        item: {},
        tree: [
          { icon: 'el-icon-user-solid', label: '第一梯队' },
          { icon: 'el-icon-setting', label: '我的车位', disabled: true },
          {
            icon: 'el-icon-platform-eleme',
            label: '我的工作台',
            children: [
              { icon: 'el-icon-s-tools', label: '1-层级2' },
              { icon: 'el-icon-more-outline', label: '1-层级3' },
              { icon: 'el-icon-star-on', label: '1-层级4' },
              {
                icon: 'el-icon-eleme',
                label: '1-层级1',
                children: [
                  { icon: 'el-icon-delete-solid', label: '2-层级2' },
                  { icon: 'el-icon-delete',  label: '2-层级3' }
                ],
              },
              { icon: 'el-icon-star-off', label: '1-层级5'  },
              { icon: 'el-icon-s-goods', label: '1-层级6' },
            ]
          },
          { icon: 'el-icon-user-solid', label: '第一梯队1' },
          { icon: 'el-icon-user', label: '第一梯队2' },
          { icon: 'el-icon-phone', label: '第一梯队3' },
          { icon: 'el-icon-phone-outline', label: '第一梯队4' },
          { icon: 'el-icon-more', label: '第一梯队5' }
        ]
      }
    },
    methods: {
      menuClick(e) {
        this.item = e;
      }
    }
  }
</script>

<style>
</style>
