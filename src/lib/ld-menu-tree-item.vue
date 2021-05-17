<template>
  <el-submenu :popper-append-to-body="popperAppendToBody" :index="item['index']||index" :disabled="item['disabled']||false">
    <template slot="title">
      <i v-if="item['icon']" :class="item['icon']" @click="menuClick(item)"></i>
      <div @click="menuClick(item)" class="el-menu-text-info ellipsis">{{item['label']}}</div>
    </template>
    <template v-if="item&&item['children']&&item['children'].length>0" v-for="(ch,c) in item['children']">
      <ld-menu-tree-item :popper-append-to-body="false" v-if="ch&&ch['children']&&ch['children'].length>0" :item="ch" :key="c" :index="ch['index']||`${index}_${c}`"
        @click="menuClick($event)">
        <template #title="e">
          <slot name="title" :item="e['item']"></slot>
        </template>
      </ld-menu-tree-item>
      <el-menu-item v-else :key="c" :index="ch['index']||`${index}_${c}`" @click="menuClick(ch)" :disabled="ch['disabled']||false">
        <slot name="title" :item="ch"></slot>
      </el-menu-item>
    </template>
    <el-menu-item v-else @click="menuClick(item)" :disabled="item['disabled']||false">
      <slot name="title" :item="item"></slot>
    </el-menu-item>
  </el-submenu>
</template>

<script>
  export default {
    name: 'ld-menu-tree-item',
    props: {
      popperAppendToBody: {
      	type: Boolean,
      	default: false,
      },
      index: {
        type: String,
        default: "1"
      },
      item: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      menuClick(e) {
        this.$emit("click", e);
      }
    }
  }
</script>

<style>
  .el-menu-text-info{
    flex-grow: 2;
  }
</style>
