<template>
  <div class="ld-table w h box-b">
    <!-- 普通table -->
    <el-table ref="elTable" :row-key="rowKey" :data="lists "
      :default-expand-all="elTablProperty.defaultExpandAll||false" @selection-change="changeCheckBoxValue"
      @select="rowSelect" @select-all="selectAll" empty-text="没有找到相关数据" :fit="elTablProperty.fit||true"
      :border="elTablProperty.border||true" :stripe="elTablProperty.stripe"
      :highlight-current-row="elTablProperty.highlightCurrentRow||false" :default-sort="elTablProperty.defaultSort"
      :tooltip-effect="elTablProperty.tooltipEffect" :show-summary="elTablProperty.showSummary||false"
      :sum-text="elTablProperty.sumText||'合计'" :summary-method="getSummaries" :indent="elTablProperty.indent||16"
      :span-method="elTabSpanMethod" :max-height="`calc(100% - ${showPageHelper?'100px':'20px'})`"
      :style="{'min-height':`calc(100% - ${showPageHelper?'60px':'20px'})`}">

      <!-- 选择框 -->
      <el-table-column v-if="isEnabledCheckBox" width="55" type="selection">
      </el-table-column>

      <!--使用详情行 -->
      <el-table-column type="expand" v-if="$scopedSlots.expand">
        <template slot-scope="scope">
          <slot name="expand" :item="scope.row"></slot>
        </template>
      </el-table-column>

      <!-- 数据列 -->
      <template v-if="col['visabled']!=false" v-for="(col,i) in layouts">
        <el-table-column :align="col['align']||'center'" :prop="col.prop"
          :label="typeof col.label=='string'?col.label:col.label['label']"
          :width="col.width?col.width:tableConfig.defaultWidth" :sortable="col.sortable||false" :key="i">
          <template v-if="typeof col.label=='object'&&col.label&&col.label['children']&&col.label['children'].length>0">
            <el-table-column v-for="(item,c) in col.label['children']" :prop="item['prop']" :label="item['label']"
              :key="c" :align="item['align']||'center'" :width="item.width?item.width:tableConfig.defaultWidth">
              <template slot-scope="scope">
                <div v-if="typeof item.html=='function'" v-html="getHtmlResult(item,scope.row)"></div>
                <div v-else-if="typeof item.format=='function'">{{getFormatResult(item,scope.row)}}</div>
                <div v-else class="ellipsis" :style="{'width':item.width}">
                  <template v-if="scope.row[item.prop]">{{getNullReplaceEmptyVal(scope.row[item.prop])}}</template>
                </div>
              </template>
            </el-table-column>
          </template>
          <template slot-scope="scope">
            <div v-if="typeof col.html=='function'" v-html="getHtmlResult(col,scope.row)"></div>
            <div v-else-if="typeof col.format=='function'">{{getFormatResult(col,scope.row)}}</div>
            <div v-else class="ellipsis" :style="{'width':col.width}">
              <template v-if="scope.row[col.prop]">{{getNullReplaceEmptyVal(scope.row[col.prop])}}</template>
            </div>
          </template>
        </el-table-column>
      </template>

      <!-- 操作按钮列  -->
      <el-table-column v-if="$scopedSlots.tools" class="t-c" label="操作" :width="tableConfig.defaultToolsWidth">
        <template v-if="$scopedSlots.toolsHeader" slot="header" slot-scope="scope">
          <slot name="toolsHeader" :item="scope.row"> </slot>
        </template>
        <template slot-scope="scope">
          <slot name="tools" :item="scope.row"> </slot>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="showPageHelper&&lists&&lists.length>0">
      <div class="f-e p-r2 m-t5">
        <el-pagination @size-change="sizeChange" @current-change="currentChange" @prev-click="" @next-click=""
          :current-page="currentPage" :page-sizes="elPagination.pageSizes||[10, 20, 30, 50]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  const {
    config
  } = require("@/lib/config/components-conf.js");
  export default {
    name: "ld-table",
    props: {
      /**
       * el-table 常用属性
       */
      elTablProperty: {
        type: Object,
        default: () => {
          return {
            indent: 20,
            border: true,
            fit: true,
            stripe: true,
            highlightCurrentRow: true,
            defaultExpandAll: true,
            defaultSort: {
              id: 'descending'
            },
            tooltipEffect: 'light', //dark/light
            showSummary: false,
            sumText: '合计',
            /**
             * 求和
             */
            summaryMethod: null,
            /**
             * 合并列或行
             */
            spanMethod: null,
          }
        }
      },

      /**
       * 每页条数
       */
      pageSize: {
        type: Number,
        default: 30,
      },
      total: {
        type: Number,
        default: 30,
      },
      currentPage: {
        type: Number,
        default: 1,
      },
      /**
       * 分页
       */
      elPagination: {
        type: Object,
        default: () => {
          return {
            pageSizes: [10, 20, 30, 50, 80, 100],
          }
        }
      },

      /**
       * 布局参数
       */
      layout: {
        type: Array,
        default: () => {
          return [];
        }
      },
      /**
       * 布局显示值
       */
      list: {
        type: Array,
        default: () => {
          return {};
        }
      },

      /**
       * 是否自动加载数据
       */
      isAutoLoadData: {
        type: Boolean,
        default: true,
      },
      /**
       *自动加载数据时，设置的request请求参数信息
       */
      autoLoadDataApi: {
        type: Object,
        default: () => {
          return {
            remotePath: '',
            remoteParam: {},
            remoteMethodType: "get",
            remoteTimeout: 1200,
            //是否是第三方请求
            remoteIsThirdRequest: false,
          }
        }
      },
      /**
       * 是否启用checkBox
       */
      isEnabledCheckBox: {
        type: Boolean,
        default: false
      },
      /**
       * 行数据的 Key，用来优化 Table 的渲染；在使用树形数据时，该属性是必填的。
       */
      rowKey: {
        type: String,
        default: "id"
      },
      /**
       * 是否显示pageHelper
       */
      showPageHelper: {
        type: Boolean,
        default: true
      },
      /**
       * 获取表单数据之后，装载数据之前，调用的装饰函数
       */
      getTableRemoteDataAfter: {
        type: Function,
        default: null,
      },

    },
    watch: {
      layout(news) {
        this.layouts = news;
      },
      list(news) {
        this.lists = news;
      }
    },
    data() {
      return {
        loading: false,
        tableConfig: config.tableConfig,
        layouts: this.layout,
        lists: this.list,
      }
    },
    methods: {
      /**
       * 获取html
       * @param {Object} col
       * @param {Object} row
       */
      getHtmlResult(col, row) {
        try {
          return col['html'](row[col.prop]);
        } catch (e) {
          throw "获取html数据出错！";
        }
      },
      /**
       * 格式化数据
       * @param {Object} col
       * @param {Object} row
       */
      getFormatResult(col, row) {
        debugger
        try {
          return col['format'](row[col.prop]);
        } catch (e) {
          throw "格式化数据出错！" + e;
        }
      },
      /**
       * 出现null字符串是处理
       * @param {Object} val
       */
      getNullReplaceEmptyVal(val) {
        return typeof val !== 'string' ? val : this.tableConfig.isReplaceNull ? val.replace(/^\s?null\s?$/gi, "") : val;
      },
      /**
       * 计算选中数据
       * @param {Object} val
       */
      changeCheckBoxValue(val) {
        this.$emit("checkbox", {
          data: this.$refs.elTable.data,
          selection: this.$refs.elTable.selection
        });
      },
      /**
       * 注意在获取初始数据时，所有节点（包括子节点）都增加一个isChecked 标志参数
       */
      rowSelect(selection, row) {
        if (row.children) { //只对有子节点的行响应
          if (!row.isChecked) { //由行数据中的元素isChecked判断当前是否被选中
            row.children.map((item) => { //遍历所有子节点
              this.$refs.elTable.toggleRowSelection(item, true); //切换该子节点选中状态
              /*
              方法名                    说明                                      参数
                                   用于多选表格，切换某一行的选中状态，         row, selected
              toggleRowSelection   如果使用了第二个参数，则是设置这一行
                                   选中与否（selected 为 true 则选中）
               */
              item.isChecked = true;
            });
            row.isChecked = true; //当前行isChecked标志元素切换为false
          } else {
            row.children.map((item) => {
              this.$refs.elTable.toggleRowSelection(item, false);
              item.isChecked = false;
            });
            row.isChecked = false;
          }
        }
        // this.$emit("checkbox", this.$refs.elTable.selection);
      },
      /**
       * 选中所有
       * @param {Object} selection
       */
      selectAll(selection) {
        // selection 是选中的数据集合
        this.$refs.elTable.data.map((items) => { //使用$ref获取注册的子组件信息，用data获取所有行，并用map函数遍历行
          if (items.children) {
            if (!items.isChecked) { //若遍历出来的行未选中
              this.$refs.elTable.toggleRowSelection(items, true); //行变为选中状态
              items.isChecked = true; //更新标志参数
              items.children.map((item) => { //遍历子节点并改变状态与标志参数
                this.$refs.elTable.toggleRowSelection(item, true);
                item.isChecked = true;
              });
            } else { //选中状态同理
              this.$refs.elTable.toggleRowSelection(items, false);
              items.isChecked = false;
              items.children.map((item) => {
                this.$refs.elTable.toggleRowSelection(item, false);
                item.isChecked = false;
              });
            }
          } else {
            if (!items.isChecked) items.isChecked = true;
            else items.isChecked = false;
          }
        });
        // this.$emit("checkbox", this.$refs.elTable.selection);
      },
      /**
       * 合并列或行
       */
      elTabSpanMethod(e) {
        if (typeof this.elTablProperty['spanMethod'] == "function") {
          return this.elTablProperty['spanMethod'](e);
        }
      },
      /**
       * 求和
       */
      getSummaries(e) {
        let sum = [];
        if (typeof this.elTablProperty['summaryMethod'] == 'function') {
          sum = this.elTablProperty['summaryMethod'](e);
        }
        e.columns.forEach((column, index) => {
          sum[index] = index == 0 ? this.elTablProperty.sumText : "-";
        })
        sum[sum.length - 1] = this.$scopedSlots.tools ? "" : "-";
        if (this.isEnabledCheckBox) {
          sum[0] = "";
          sum[1] = this.elTablProperty.sumText;
        }
        return sum;
      },
      /**
       * 每页条数变化时发生
       * @param {Object} val
       */
      sizeChange(val) {
        this.pageSize = val;
        this.$nextTick(() => {
          this.getPageData();
        })
      },
      /**
       * 当前页变化时发生
       * @param {Object} val
       */
      currentChange(val) {
        this.currentPage = val;
        this.$nextTick(() => {
          this.getPageData();
        })
      },

      /**
       * 获取后台数据
       */
      getPageData() {
        this.loading = true;
        try {
          //查询数据
          let options = this.autoLoadDataApi;
          let param = options['remoteParam'];
          if (this.showPageHelper) {
            param['pageNumber'] = this.currentPage;
            param["pageSize"] = this.pageSize;
          }
          this.$ld.request(options['remotePath'], options['remoteMethodType'], param, options['remoteTimeout'] || null)
            .then(res => {
              debugger;
              let d = data;
              if (typeof this.getTableRemoteDataAfter == 'function') {
                d = this.getTableRemoteDataAfter(res.data, this.showPageHelper);
              } else {
                d = this.$ld.getTableRemoteDataAfter(res.data, this.showPageHelper);
              }
              let data = d || res.data;

              //判断是否是分页
              if (this.showPageHelper) {
                this.currPage = data['currPage'] || data['pageNum'];
                this.total = data['total'] || data['list'].length;
                this.lists = data['list'] || data['data'];
              } else {
                this.lists = data;
              }

            });

        } catch (e) {
          //TODO handle the exception
        }
      }
    },
    created() {
      this.getPageData();
    }
  }
</script>

<style scoped>
  /*  .ld-table tr.el-table__row.el-table__row--level-1 td:first-child div.cell div {
    padding-left: 12px;
  }

  .ld-table tr.el-table__row.el-table__row--level-2 td:first-child div.cell div {
    padding-left: 24px;
  }

  .ld-table tr.el-table__row.el-table__row--level-3 td:first-child div.cell div {
    padding-left: 36px;
  } */
</style>
