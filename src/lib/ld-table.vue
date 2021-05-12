<template>
  <div class="ld-table w h box-b">
    <!-- 普通table -->
    <el-table ref="elTable" :row-key="rowKey" :data="lists "
      :default-expand-all="elTableProperty.defaultExpandAll||false" @selection-change="changeCheckBoxValue"
      @select="rowSelect" @select-all="selectAll" empty-text="没有找到相关数据" :fit="elTableProperty.fit||true"
      :border="elTableProperty.border||true" :stripe="elTableProperty.stripe"
      :highlight-current-row="elTableProperty.highlightCurrentRow||false" :default-sort="elTableProperty.defaultSort"
      :tooltip-effect="elTableProperty.tooltipEffect||'light'" :show-summary="elTableProperty.showSummary||false"
      :sum-text="elTableProperty.sumText||'合计'" :summary-method="getSummaries" :indent="elTableProperty.indent||16"
      :span-method="elTableProperty.spanMethod" :height="`calc(100% - ${showPageHelpers?'100px':'20px'})`"
      :style="{'min-height':`calc(100% - ${showPageHelpers?'60px':'20px'} - ${elTableProperty&&elTableProperty['showSummary']==true?'48px':'0px'})`}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :lazy="false" :class="{'show-summary':elTableProperty&&elTableProperty['showSummary']==true}">

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
            <template v-for="(item,c) in col.label['children']">
              <ld-table-column-item :table-config="tableConfig" :item="item" :key="c">
                <template #replace="{item,row}">
                  <template v-if="row[`${item['prop']}_reqplace_val`]">
                    <div v-if="loadingReaplce" class="el-icon-loading"></div>
                  </template>
                  <template>{{getNullReplaceEmptyVal(row[item.prop])||''}}</template>
                </template>
              </ld-table-column-item>
            </template>
          </template>
          <template slot-scope="scope">
            <ld-table-item :item="col" :row="scope.row">
              <template #replace="{item,row}">
                <template v-if="row[`${item['prop']}_reqplace_val`]">
                  <div v-if="loadingReaplce" class="el-icon-loading"></div>
                </template>
                <template>{{getNullReplaceEmptyVal(row[item.prop])||''}}</template>
              </template>
            </ld-table-item>
          </template>
        </el-table-column>
      </template>

      <!-- 操作按钮列  -->
      <el-table-column v-if="$scopedSlots.tools" class="t-c" label="操作" :width="tableConfig.defaultToolsWidth">
        <template v-if="$scopedSlots.toolsHeader" slot="header" slot-scope="scope">
          <slot name="toolsHeader" :item="scope.row"></slot>
        </template>
        <template slot-scope="scope">
          <slot name="tools" :item="scope.row"> </slot>
        </template>
      </el-table-column>

      <template #append>
        <slot name="append" v-if="$slots.append"> </slot>
      </template>

    </el-table>
    <template v-if="showPageHelpers&&lists&&lists.length>0">
      <div class="f-e p-r2 m-t5">
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPages"
          :page-sizes="elPaginations.pageSizes" :page-size="pageSizes" layout="total, sizes, prev, pager, next, jumper"
          :total="totals">
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  const {
    config
  } = require("@/lib/config/components-conf.js");

  import ldTableItem from './ld-table-item.vue'
  import ldTableColumnItem from './ld-table-column-item.vue'
  export default {
    name: "ld-table",
    components: {
      ldTableItem,
      ldTableColumnItem
    },
    props: {
      /**
       * el-table 常用属性
       */
      elTableProperty: {
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
        default: 0,
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
            pageSizes: [10, 20, 30, 50],
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
          return [];
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
        this.lists = news || [];
      },
      lists(news){
        if(this.elTableProperty&&this.elTableProperty['showSummary']==true){
          let height=document.querySelector('.show-summary').style.height;
          document.querySelector('.show-summary').style.height="100%";
          setTimeout(()=>{
            document.querySelector('.show-summary').style.height=height;
          },2000);
        }
      },
      pageSize(news) {
        this.pageSizes = news;
      },
      total(news) {
        this.totals = news;
      },
      currentPage(news) {
        this.currentPages = news;
      },
      elPagination(news) {
        this.elPaginations = news;
      },
      showPageHelper(news) {
        this.showPageHelpers = news;
      }
    },
    data() {
      return {
        loading: false,
        currentPages: this.currentPage,
        showPageHelpers: this.showPageHelper,
        elPaginations: this.elPagination,
        pageSizes: this.pageSize,
        tableConfig: config.tableConfig,
        layouts: this.layout,
        lists: this.list || [],
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
        return typeof val !== 'string' ? val : this.tableConfig.isReplaceNull ? val.replace(/^\s?null\s?$/gi, "") :
          val;
      },
      /**
       * 计算选中数据
       * @param {Object} val
       */
      changeCheckBoxValue(val) {
        this.$emit("checkbox", val);
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
        if (typeof this.elTableProperty['spanMethod'] == "function") {
          return this.elTableProperty['spanMethod'](e);
        }
      },
      /**
       * 求和
       */
      getSummaries(e) {
        let sum = [];
        if (typeof this.elTableProperty['summaryMethod'] == 'function') {
          sum = this.elTableProperty['summaryMethod'](e);
        }
        e.columns.forEach((column, index) => {
          sum[index] = index == 0 ? this.elTableProperty.sumText : "-";
        })
        sum[sum.length - 1] = this.$scopedSlots.tools ? "" : "-";
        if (this.isEnabledCheckBox) {
          sum[0] = "";
          sum[1] = this.elTableProperty.sumText;
        }
        return sum;
      },
      /**
       * 每页条数变化时发生
       * @param {Object} val
       */
      sizeChange(val) {
        this.pageSizes = val;
        this.$nextTick(() => {
          this.getPageData();
        })
      },
      /**
       * 当前页变化时发生
       * @param {Object} val
       */
      currentChange(val) {
        this.currentPages = val;
        this.$nextTick(() => {
          this.getPageData();
        })
      },

      /**
       * 获取后台数据
       */
      getPageData() {
        if (!this.isAutoLoadData) {
          return;
        }
        this.loading = true;
        try {
          //查询数据
          let options = this.autoLoadDataApi;
          let param = options['remoteParam'] || {};
          if (this.showPageHelpers) {
            param['pageNum'] = this.currentPages;
            param["pageSize"] = this.pageSizes;
          }
          param["isPageHelper"] = this.showPageHelpers;
          this.$ld.request(options['remotePath'], options['remoteMethodType'], param, options['remoteTimeout'] ||
              null)
            .then(res => {
              this.loading = false;
              let d = res.data.data;
              if (typeof this.getTableRemoteDataAfter == 'function') {
                d = this.getTableRemoteDataAfter(res.data, this.showPageHelpers);
              } else {
                d = this.$ld.getTableRemoteDataAfter(res.data, this.showPageHelpers);
              }
              let data = Object.keys(d).includes('data') ? d.data : d || res.data.data;

              //判断是否是分页
              if (this.showPageHelpers) {
                if (!data) {
                  this.currPage = 1;
                  this.totals = 0;
                  this.lists = [];
                } else {
                  this.currPage = data['currentPage'] || data['currPage'] || data['pageNum'];
                  this.totals = data['total'] || data['list'].length;
                  this.lists = data['list'] || data['data'];
                  this.pageSizes = data['pageSize'];
                }
              } else {
                this.lists = Array.isArray(data) ? data : data.data;
              }
              this.replaceValToList();
            });
        } catch (e) {
          //TODO handle the exception
        }
      },


      /**
       * 替换数据 ,通过外键编号，获取显示到页面的字符
       */
      replaceValToList() {
        this.loadingReaplce = true;
        setTimeout(() => {
          this.loadingReaplce = false;
          this.$forceUpdate();
        }, 1200);
        let list = this.lists;
        let map = {};
        const getRemote = (lay, list) => {
          if (typeof lay['label'] == 'object' && lay['label']['children'] && lay['label']['children']
            .length > 0) {
            lay['label']['children'].map(item => {
              getRemote(item, list);
            });
          }
          if (lay['replace'] && typeof lay['replace'] == 'object') {
            let prop = lay['prop'];
            let remoteKey = this.getRemoteKey(lay);
            list.map(item => {
              let index = this.lists.indexOf(item);

              let val = item[prop];
              let mapKey = `${remoteKey}_${val}`;
              map[mapKey] = "";

              item[`${prop}_reqplace_val`] = true;
              setTimeout(() => {
                this.$set(this.lists[index], `${prop}_reqplace_val`, false);
              }, 1000);

              item['_table_layout_repplace_val'] = item['_table_layout_repplace_val'] || {};
              item['_table_layout_repplace_val'][`${mapKey}_${prop}`] = mapKey;

              this.$set(this.lists, index, item);
            });

          }
        }

        this.layouts.map(lay => {
          getRemote(lay, list);
        });
        this.getRemoteReplaceValToMap(map);
      },
      //加载map所对应的值
      getRemoteReplaceValToMap(map) {
        let count = 0;
        Object.keys(map).map(key => {
          let info = key.split("_");
          if (!info[4] || info[4].trim().toLocaleLowerCase() == 'null' || info[4] == 'undefined') {
            count++;
            map[key] = "";
            if (count >= Object.keys(map).length) {
              this.replaceMapToList(map);
            }

          } else {
            let param = {};
            param[info[3]] = info[4];
            this.$ld.request(info[0], info[1], param).then(res => {
              count++;
              let d = res.data.data || res.data;
              map[key] = d[info[2]] || '';
              if (count >= Object.keys(map).length) {
                this.replaceMapToList(map);
              }
            });
          }
        });
      },
      //将map替换到list中
      replaceMapToList(map) {
        let list = this.lists;
        list.map(item => {
          let index = this.lists.indexOf(item);
          let obj = item['_table_layout_repplace_val'];
          Object.keys(obj).map(replace => {
            let replaceInfo = replace.split("_");
            let replaceFeild = replaceInfo[replaceInfo.length - 1];
            this.$set(this.lists[index], `${replaceFeild}_reqplace_val`, false);
            let remoteKey = obj[replace];
            let replaceValue = map[remoteKey];
            this.$set(this.lists[index], replaceFeild, replaceValue);
          });
        });

      },

      /**
       * 获取数据key
       */
      getRemoteKey(item) {
        let remoteInfo = item['replace'];
        return `${remoteInfo['remotePath']}_${remoteInfo['remoteMethodType']}_${remoteInfo['label']}_${remoteInfo['value']}`;
      },


    },
    created() {
      this.getPageData();
    }
  }
</script>

<style>

  .el-table tr.el-table__row[class*="el-table__row--level"] td:first-child .cell {
    display: flex !important;
  }

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
