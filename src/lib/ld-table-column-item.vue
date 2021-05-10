<template>
  <el-table-column :prop="item['prop']" :label="typeof item.label=='string'?item.label:item.label['label']"
    :align="item['align']||'center'" :width="item.width?item.width:tableConfig.defaultWidth">

    <template v-if="typeof item.label=='object'&&item.label&&item.label['children']&&item.label['children'].length>0">
      <template v-for="(item2,c) in  item.label['children']">
        <ld-table-column-item :table-config="tableConfig" :item="item2" :key="c">
          <template #replace="{item,row}">
            <slot name="replace" :item="item" :row="row"></slot>
          </template>
        </ld-table-column-item>
      </template>
    </template>

    <template slot-scope="scope">
      <ld-table-item :item="item" :row="scope.row">
        <template #replace="{item,row}">
          <slot name="replace" :item="item" :row="scope.row"></slot>
        </template>
      </ld-table-item>
    </template>
  </el-table-column>
</template>

<script>
  import ldTableItem from "./ld-table-item.vue"
  export default {
    name: 'ld-table-column-item',
    props: {
      tableConfig: {
        type: Object,
        default: () => {
          return {}
        }
      },
      item: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    components: {
      ldTableItem
    },
    watch: {
      item(news) {
        this.items = news;
      },
    },
    data() {
      return {
        items: this.item,
      }
    },
    methods: {
      /**
       * 出现null字符串是处理
       * @param {Object} val
       */
      getNullReplaceEmptyVal(val) {
        return typeof val !== 'string' ? val : this.tableConfig.isReplaceNull ? val.replace(/^\s?null\s?$/gi, "") :
          val;
      },
    },
    created() {
    }
  }
</script>

<style>
</style>
