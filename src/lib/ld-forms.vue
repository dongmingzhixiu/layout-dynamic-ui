<template>
  <div class="layout-dynamic-form">
    <template v-if="$scopedSlots.custom">
      <slot name="custom" :form="forms" :layout="layouts"></slot>
    </template>
    <div v-else class="form wh">
      <div v-if="forms&&Object.keys(forms).length>0&&showTipButton" class="f-e w m-b10 m-t10">
        <div class="el-icon-question fs38 c-w b-t" style="z-index: 2;" @click="showDefaultTips=!showDefaultTips"></div>
      </div>
      <div v-if="forms&&Object.keys(forms).length>0" class="el-form w h p-b10" :class="{'over-a-y':isOverflowY}">
        <div class="a-i-c w" :class="{'f-b-w':!isRow,'f-s':isRow}">
          <div v-if="item['visabled']!=false" v-for="(item,i) in layouts" class="el-form-item position-relative w"
            :key='i' :style="{'max-width':isRow?'250px':'','flex-grow': '2'}"
            :class="{'w':isRow,'cols_1':fcols==1||!fcols,'cols_2':fcols==2,'cols_3':fcols==3,'cols_4':fcols==4}">
            <div class="w" :class="{'el-disabled':getDisabled(item),'el-readonly':getDisabled(item)}">
              <div v-if="layoutType.includes(item['type'].toLocaleLowerCase())" class="a-i-c w"
                style="position: relative;"
                :class="{'a-i-c':labelPosition!='top', 'f-s':labelPosition!='top','item':item['error']!=true,'error-item':item['error']==true}">
                <div v-if="item['label']||item['showLabel']" class="el-form-item__label f-n-c-w a-i-c f-r"
                  :class="{'f-s':labelPosition=='left','f-e':labelPosition=='right'}" :style="{'width':labelWidth}"
                  style="flex-shrink: 0;">
                  <div v-if="item['require']==true" class="c-d">*</div>
                  <div :class="{'c8':getDisabled(item)}">
                    {{item['label']||''}}
                  </div>
                </div>
                <div v-if="item['prepend']&&!isControlsType(item,'text')" class="f-n-c-w c7 p-l2 p-r2 c8">
                  {{item['prepend']}}
                </div>
                <template v-if="$scopedSlots.rowCustom">
                  <div class="w  el-input--suffix box-b" :style="{'cursor':getDisabled(item)?'no-drop':'default'}">
                    <slot name="rowCustom" :item="item"></slot>
                  </div>
                </template>
                <div v-else class="el-input--suffix box-b over-h" style="flex-grow: 2;"
                  :style="{'cursor':getDisabled(item)?'no-drop':'default'}">
                  <!-- ================ 组件开始 start ================ -->

                  <!-- 解释说明文字 -->
                  <template v-if="(typeof item['tip']!='undefined'&&showDefaultTips)||isControlsType(item,'tip')">
                    <div v-if="typeof item['tip']!='undefined'&&showDefaultTips" v-html="item['tip']"
                      :class="item['tipClass']?item['tipClass']:'tip-w b-w1 c7'">
                    </div>
                    <div v-else v-html="item['tip']" class="el-input__inner color3 a-i-c over-h-y r0 bor-trb0"
                      :class="item['tipClass']?item['tipClass']:'tip-w b-w1 c7'">
                    </div>
                  </template>

                  <!-- 数据键 -->
                  <div v-if="isControlsType(item,'datakey')" class="el-disabled w  el-input--suffix">
                    <el-input v-model="forms[item['prop']]" v-show="false"></el-input>
                    <div class="el-input__inner fs color8" :class="item['css']" :style="item['style']">数据键，无需更改！</div>
                  </div>


                  <!-- 作用域插槽，插槽名称为 prop值 -->
                  <template v-if="isControlsType(item,'slot')">
                    <slot :name="item['prop']" :item="item" :layout="layouts" :form="forms" :onRegex="regexFormVal">
                    </slot>
                  </template>


                  <!-- 文本框 -->
                  <template v-if="isControlsType(item,'text')">
                    <!-- :class="{'error-bor-d':item['error']==true}" -->
                    <el-input v-model="forms[item['prop']]"
                      :class="getStyleOrCss({'error-bor-d':item['error']==true},item,'css')" :style="item['style']"
                      clearable :show-password="item['password']" :placeholder="getPlaceholder(item)"
                      :disabled="getDisabled(item)" @change="regexFormVal(item,i,true)" @input="regexFormVal(item,i)"
                      @blur="regexFormVal(item,i)" @focus="regexFormVal(item,i)">
                      <template v-if="item['prepend']" slot="prepend">{{item['prepend']}}</template>
                      <template v-if="item['append']" slot="suffix">{{item['append']}}</template>
                    </el-input>
                  </template>

                  <!-- 文本域 -->
                  <template v-if="isControlsType(item,'textarea')">
                    <el-input v-model="forms[item['prop']]"
                      :class="getStyleOrCss({'error-bor-d':item['error']==true},item,'css')" :style="item['style']"
                      :disabled="getDisabled(item)" type="textarea" clearable :show-password="item['password']"
                      :placeholder="getPlaceholder(item)" :rows="item['rows']||4" @change="regexFormVal(item,i,true)"
                      @input="regexFormVal(item,i)" @blur="regexFormVal(item,i)" @focus="regexFormVal(item,i)">
                    </el-input>
                  </template>

                  <!-- 下拉框 -->
                  <template v-if="isControlsType(item,'select')">
                    <el-select class="w m-l0" v-model="forms[item['prop']]"
                      :class="getStyleOrCss({'error-bor-d':item['error']==true},item,'css')" :style="item['style']"
                      :disabled="getDisabled(item)" clearable :allow-create="item['allowCreate']||false"
                      :filterable="item['filterable']||item['allowCreate']||false" :multiple="item['multiple']||false"
                      collapse-tags style="margin-left: 20px;" placeholder="请选择" @change="regexFormVal(item,i,true)"
                      @blur="regexFormVal(item,i)" @focus="regexFormVal(item,i)">
                      <el-option v-for="opt in item['options']" :key="opt.value" :label="opt.label" :value="opt.value"
                        :disabled="opt.disabled||false">
                        <slot :name="`options_${item['prop']}`" :option="opt"></slot>
                      </el-option>
                    </el-select>
                  </template>

                  <!-- 单选框   -->
                  <template v-if="isControlsType(item,'radio')">
                    <div class="box-b f-s a-i-c bor-ff box-b"
                      :class="getStyleOrCss({'el-input el-input__inner':!item['isButton'],'bor-d':item['error']==true},item,'css')"
                      :style="item['style']" style="height: auto;">
                      <el-radio-group v-model="forms[item['prop']]" @change="regexFormVal(item,i,true)"
                        :disabled="getDisabled(item)">
                        <template v-if="item['isButton']===true">
                          <el-radio-button v-for="(opt,j) in item['options']" class="p-b2 p-t2" :label="opt.value"
                            :border="item[' border']||false" :key="j">
                            {{opt.label}}
                          </el-radio-button>
                        </template>
                        <template v-else>
                          <el-radio v-for="(opt,j) in item['options']" class="p-b2 p-t2" :label="opt.value" :key="j">
                            {{opt.label}}
                          </el-radio>
                        </template>
                      </el-radio-group>
                    </div>
                  </template>

                  <!-- 复选框   -->
                  <template v-if="isControlsType(item,'checkbox')">
                    <div class="el-input box-b el-input__inner f-s a-i-c box-b"
                      :class="getStyleOrCss({'bor-d':item['error']==true},item,'css')" :style="item['style']"
                      style="height: auto;">
                      <el-checkbox-group v-model="forms[item['prop']]" @change="regexFormVal(item,i,true)"
                        :disabled="getDisabled(item)">
                        <el-checkbox v-for="(opt,j) in item['options']" :label="opt.value" :key="j">
                          {{opt.label}}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </template>


                  <!-- 日期控件 -->
                  <template v-if="isControlsType(item,'date')">
                    <el-date-picker class="w" style="width: 100%;"
                      :class="getStyleOrCss({'error-bor-d':item['error']==true},item,'css')" :style="item['style']"
                      :align="item['align']||'left'" :value-format="layoutDateFormat[item['dateType']||'date']"
                      :type="item['dateType']||'date'" :placeholder="item['placeholder']" v-model="forms[item['prop']]"
                      :readonly="getDisabled(item)" :picker-options="item['pickerOptions']"
                      @change="regexFormVal(item,i,true)" @blur="regexFormVal(item,i)" @focus="regexFormVal(item,i)">
                    </el-date-picker>
                  </template>

                  <!-- 图标控件 -->
                  <template v-if="isControlsType(item,'icon')">
                    <div class="w" :class="getStyleOrCss({'error-bor-d':item['error']==true},item,'css')"
                      :style="item['style']" @mouseenter="regexFormVal(item,i)" @mouseleave="regexFormVal(item,i)">
                      <ld-icon class="w" :disabled="getDisabled(item)" :value="forms[item['prop']]"
                        @icon="ldChangeValToForm(item,$event,i)" :clearable="false">
                      </ld-icon>
                    </div>
                  </template>

                  <!-- 标签 -->
                  <template v-if="isControlsType(item,'tag')">
                    <div class="w" :class="getStyleOrCss({'error-bor-d':item['error']==true},item,'css')"
                      :style="item['style']" @mouseenter="regexFormVal(item,i)" @mouseleave="regexFormVal(item,i)">
                      <ld-tags :disabled="getDisabled(item)" class="w" :tag="forms[item['prop']]"
                        :title="item['title']||''" @tag="ldChangeValToForm(item,$event,i)" :clearable="false">
                      </ld-tags>
                    </div>
                  </template>

                  <!-- 地址 -->
                  <template v-if="isControlsType(item,'address')">
                    <div class="w" :class="getStyleOrCss({'error-bor-d':item['error']==true},item,'css')"
                      :style="item['style']" @mouseenter="regexFormVal(item,i)" @mouseleave="regexFormVal(item,i)">
                      <input :name="item['prop']" v-model="forms[item['prop']]"
                        class="el-input__inner color3 fs14 over-h-y" v-show="false" />
                      <ld-address :disabled="getDisabled(item)" :addr="forms[item['prop']]"
                        @addr="ldChangeValToForm(item,$event,i,'text')">
                      </ld-address>
                    </div>
                  </template>

                  <!-- 系统日期 -->
                  <template v-if="isControlsType(item,'sysdate')">
                    <div class="el-input__inner color3 fs14 over-h-y f-s a-i-c">
                      {{getDateOrTime(item)}}
                    </div>
                  </template>

                  <!-- 数据参数类型 -->
                  <template v-if="isControlsType(item,'param')">
                    <ld-params :disabled="getDisabled(item)" :type="item['dataType']" :param="forms[item['prop']]"
                      @param="forms[item['prop']]=$event"></ld-params>
                  </template>


                  <!-- 图片控件 -->
                  <template v-if="isControlsType(item,'image')">
                    <!-- TODO  :disabled="getDisabled(item)" -->
                    <ld-images :disabled="getDisabled(item)" :limit="item['limit']||1" :value="forms[item['prop']]"
                      @image="ldChangeValToForm(item,$event,i)" :clearable="false"></ld-images>
                  </template>

                  <!-- 计数器 -->
                  <template v-if="isControlsType(item,'number')">
                    <!-- precision 小数点位数 -->
                    <el-input-number :disabled="getDisabled(item)" size="small" v-model="forms[item['prop']]"
                      :min="parseInt(item['min'])||0" :max="parseInt(item['max'])||1000" :step="item['step']||1"
                      :step-strictly="item['stepStrictly']||false" :precision="item['precision ']||0"
                      :placeholder="getPlaceholder(item)">
                    </el-input-number>
                  </template>

                  <!-- 开关 -->
                  <template v-if="isControlsType(item,'switch')">
                    <el-switch :disabled="getDisabled(item)" v-model="forms[item['prop']]"
                      :active-text="item['activeText']||''" :inactive-text="item['inactiveText']||''">
                    </el-switch>
                  </template>

                  <!-- 滑块 -->
                  <template v-if="isControlsType(item,'slider')">
                    <el-slider :disabled="getDisabled(item)" v-model="forms[item['prop']]" class="m-l6 m-r6"
                      :marks="item['marks']||{}" :min="parseInt(item['min']) ||0" :max="parseInt(item['max'])||100"
                      :step="item['step']||1" :format-tooltip="item['formatTooltip']||null"
                      :show-stops="item['showStops']||true">
                    </el-slider>
                  </template>

                  <!-- 评分 -->
                  <template v-if="isControlsType(item,'rate')">
                    <el-rate :disabled="getDisabled(item)" v-model="forms[item['prop']]"
                      :show-text="item['showText']||false" :show-score="item['showScore']||false"
                      :texts="item['texts']||['极差', '失望', '一般', '满意', '惊喜']"
                      :colors="item['colors']||['#99A9BF', '#F7BA2A', '#FF9900']">
                    </el-rate>
                  </template>

                  <!-- 颜色 -->
                  <template v-if="isControlsType(item,'color')">
                    <el-color-picker :disabled="getDisabled(item)" v-model="forms[item['prop']]"
                      :show-alpha="item['showAlpha']||true"
                      :predefine="item['predefine']||layoutColorPacikerDefaultList">
                    </el-color-picker>
                  </template>

                  <!-- 穿梭框 -->
                  <template v-if="isControlsType(item,'transfer')">
                    <el-card class="box-card" shadow="always">
                      <!-- TODO :disabled="getDisabled(item)"  -->
                      <el-transfer v-model="forms[item['prop']]"
                        :titles="item['title']?typeof item['title']=='string'?item['title'].split(layoutTypeEmitParser.ArraySplit.chart):item['title']:['原数据','设置数据']"
                        :props="{key: 'value', label: 'label' }" :data="item['options']"
                        :left-default-checked="item['leftDefaultChecked']"
                        :right-default-checked="item['rightDefaultChecked']">
                      </el-transfer>
                    </el-card>
                  </template>
                  <!-- ================ 组件开始 end ================ -->

                </div>
                <div v-if="item['append']&&!isControlsType(item,'text')" class="f-n-c-w c7 p-l2 p-r2 c8">
                  {{item['append']}}
                </div>
                <div class="a-i-c over-h-y box-b f-e" style="position: absolute;right: 10px; z-index: 3;"
                  :style="{'right':getErrorMsgPosition(item),'bottom':item['tip']?'12px':'auto'}">
                  <div v-if="item['error']==true" class="c-d fs">
                    <div v-if="isControlsType(item,'checkbox')" class="p4 <b-i2></b-i2> r4">{{item['errorMsg']}}</div>
                    <template v-else>{{item['errorMsg']}}</template>
                  </div>
                  <div
                    v-if="!getDisabled(item)&&forms[item['prop']]&&forms[item['prop']].length>0&&hasClearButton.includes(item['type'].toLocaleLowerCase())"
                    class="forms-clear-button el-icon-circle-close fs14 el-input__clear" style="color: #C0C4CC;"
                    @click="forms[item['prop']]=''">
                  </div>

                </div>
              </div>

            </div>
            <div v-if="isRow">
              <slot name="buttons" :form="forms" :layout="layouts"></slot>
            </div>
          </div>
          <div class="w" v-if="!isRow">
            <slot name="buttons" :form="forms" :layout="layouts"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const {
    config
  } = require("@/lib/config/components-conf.js");
  export default {
    name: 'ld-forms',
    props: {
      isOverflowY: {
        type: Boolean,
        default: false,
      },
      /**
       * 是否显示tip按钮
       */
      showTipButton: {
        type: Boolean,
        default: false,
      },
      /**
       * 是否默认显示tip文字
       */
      showDefaultTip: {
        type: Boolean,
        default: false,
      },
      /**
       * 左侧文字高度
       */
      labelWidth: {
        type: String,
        default: '100px',
      },
      /**
       * 是否是行模式
       */
      isRow: {
        type: Boolean,
        default: false,
      },
      /**
       * 列数
       */
      cols: {
        type: Number,
        default: 1
      },
      /**
       * 文字位置
       */
      labelPosition: {
        type: String,
        default: 'right',
      },
      /**
       * 是否自动保存
       */
      autoSave: {
        type: Boolean,
        default: true,
      },
      /**
       * 当前组件封装层数过多时，element-date日期控件会出现，
       * 不能及时刷新的问题，此时需要设置该属性为 true
       */
      isMoreLevelUpdateElDate: {
        type: Boolean,
        default: false,
      },

      //布局、参数和按钮
      /**
       * 默认表单数据
       */
      form: {
        type: Object,
        default: () => {
          return {};
        }
      },
      /**
       * 布局参数值
       */
      layout: {
        type: Array,
        default: () => {
          return [];
        }
      },

    },
    data() {
      return {
        /**
         * layout-dynamic 支持的插件类型
         */
        layoutType: config.layoutType,
        /**
         * 在操作过程中需要 将指定类型的数据值转成 Array
         */
        layoutTypeArray: config.layoutTypeArray,
        /**
         * 在操作过程中需要 将指定类型的数据值转成 Object
         */
        layoutTypeObject: config.layoutTypeObject,
        /**
         * 最终获取数据之前，数据是否进行特殊处理
         */
        layoutTypeEmitParser: config.layoutTypeEmitParser,
        /**
         * 格式化日期字符串
         */
        layoutDateFormat: config.layoutDateFormat,
        /**
         * ColorPicker 预定义颜色
         */
        layoutColorPacikerDefaultList: config.layoutColorPacikerDefaultList,
        /**
         * 有清除按钮的组件
         */
        hasClearButton: config._hasClearButton,
        /**
         * 类型提示文字
         */
        errTextPrefix: config._errTextPrefix,



        showDefaultTips: this.showDefaultTip,
        fcols: this.cols,
        forms: this.form,
        layouts: this.layout,
        loading: false,
      }
    },
    watch: {
      form(news) {
        this.forms = news;
        this.formReset(null);
      },
      layout(news) {
        this.layouts = news;
        //获取远程加载数据
        this.getRemoteOptions();
      },
      cols(news) {
        this.fcols = news;
      },
      showDefaultTip(news) {
        this.showDefaultTips = news;
      }
    },
    methods: {
      /**
       *
       */
      getErrorMsgPosition(item) {
        let size = 10;
        if (this.isControlsType(item, 'text') && item['password']) {
          size = this.forms[item['prop']] ? 50 : 30;
        } else if ((this.isControlsType(item, 'select') || this.forms[item['prop']]) && !this.isControlsType(item,
            'checkbox')) {
          size = 30;
        }
        size += item['append'] && item['append'].length ? item['append'].length *
          17 : 0;
        size += this.isControlsType(item, 'text') ? item['append'] ? -8 : 0 : 0;
        return `${size}px`;
      },

      /**
       * 获取设置的css或style
       * /
       */
      getStyleOrCss(obj = {}, item, type) {
        type = type || 'css';
        let s = Object.assign({}, obj);
        s[item[type]] = true;
        return s;
      },

      /**
       * 生成日期或时间
       * @param {Object} item
       */
      getDateOrTime(item) {
        let isUpdate = item['update'] || false;
        if (this.forms[item['prop']] && !isUpdate) {
          return this.forms[item['prop']];
        }
        let date = "";
        if (!item['dateType'] || item['dateType'].toLowerCase() == 'datetime') {
          date = this.$ld.util.getNowDT();
        } else
        if (item['dateType'].toLowerCase() == 'date') {
          date = this.$ld.util.getNowD();
        } else if (item['dateType'].toLowerCase() == 'time') {
          date = this.$ld.util.getNowT();
        }
        this.$set(this.forms, item['prop'], date);
        return date;
      },
      /**
       * 是否是期望的数据类型
       * @param {Object} item
       * @param {Object} layoutType
       */
      isControlsType(item, layoutType) {
        return item['type'] == layoutType || item['type'].toLocaleLowerCase() == layoutType.toLocaleLowerCase();
      },
      /**
       * 是否禁用
       * @param {Object} item
       */
      getDisabled(item) {
        return item['disabled'] == true || item['readonly'] == true;
      },
      /**
       * 获取提示文字
       */
      getPlaceholder(item) {
        const msg = this.errTextPrefix.select.includes(item['type']) ? '请选择' : this.errTextPrefix.write.includes(
          item['type']) ? '请填写' : '请输入';

        let text = item['placeholder'] ||
          `${msg}${item['label']||''}`;
        return this.getDisabled(item) ? `${item['label']||''}` : text;
      },
      /**
       * 加载远程数据
       */
      getRemoteOptions() {

      },
      /**
       * 重置
       */
      formReset() {
        this.forms = this.forms || {};
        this.layouts.map(item => {
          let val = "";
          try {
            val = this.forms && this.forms[item['prop']] ? this.forms[item['prop']] : '';
            val = val ? val : item['value'] ? item['value'] : '';
            //转换数据类型 Array
            if (this.layoutTypeEmitParser.isParse && this.layoutTypeArray && this.layoutTypeArray
              .length > 0 &&
              this.layoutTypeArray.includes(item['type'])) {
              if (this.layoutTypeEmitParser.ArraySplit.isJSON && !item['parseType']) {
                try {
                  val = JSON.parse(val);
                } catch (e) {
                  val = eval(`(${val})`);
                  val = typeof val == 'string' ? eval(`(${val})`) : val;
                }
              } else {
                val = Array.isArray(val) ? val : typeof val == 'string' ? val.split(item[
                    'splitChart'] || this
                  .layoutTypeEmitParser
                  .ArraySplit.chart) : [];
                val = val.map(v => v.trim());
              }
            }
            //转换数据类型为 Object
            if (this.layoutTypeEmitParser.isParse && this.layoutTypeObject && this.layoutTypeObject
              .length > 0 &&
              this.layoutTypeObject.includes(item['type'])) {
              //使用 JSON.parse转换，传入参数必须是json 或者url
              if (this.layoutTypeEmitParser.ObjectSplit.isJSON) {
                if (!item['parseType'] || item['parseType'].toLocaleLowerCase() == 'json') {
                  try {
                    val = JSON.parse(val);
                  } catch (e) {
                    val = eval(`(${val})`);
                    val = typeof val == 'string' ? eval(`(${val})`) : val;
                  }
                }
              }
              if (this.layoutTypeEmitParser.ObjectSplit.isJSON) {
                if (item['parseType'] && item['parseType'].toLocaleLowerCase() != 'json') {
                  try {
                    val = typeof val == 'string' && val.indexOf('&') > 0 && val.indexOf('=') >
                      0 ? this.$ld.util
                      .urlToObj(val.indexOf('?') >= 0 ? val : `?${val}`) : {};
                  } catch (e) {}
                }
              }
              val = typeof val == 'object' ? val : {};
            }
            //
          } catch (e2) {}
          this.$set(this.forms, item['prop'], val);
        });
      },
      /**
       *赋值
       */
      ldChangeValToForm(item, event, index, key) {
        let prop = item['prop'];
        this.$set(this.forms, prop, key ? event[key] : event);
        this.regexFormVal(item, index, true);
      },

      /**
       * 验证数据
       * 在form保存数据之前操作
       */
      checkForm() {
        //校验数据
        for (let i = 0; i < this.layouts.length; i++) {
          if (!this.layoutType.includes(this.layouts[i]['type'])) {
            continue;
          }
          let flg = this.regexFormVal(this.layouts[i], i);
          if (!flg) {
            break;
          }
        }
        let errList = this.layouts.filter(item => item['error'] == true);
        if (errList.length > 0) {
          return {
            error: true,
            msg: errList[0]['errorMsg'],
            item: errList[0],
          };
        }
        return {
          error: false,
          msg: '验证通过!'
        }
      },


      /**
       * 数据校验
       */
      regexFormVal(item, i, change) {

        let value = this.forms[item['prop']] ? this.forms[item['prop']] : this.layoutTypeArray.includes(item['type']) ?
          [] : this.layoutTypeObject.includes(item['type']) ? {} : '';
        if (change) {
          this.setChange(item, value)
        }
        //当使用布局参数联动进行操作布局是，布局已发生改变，不能在进行校验
        if (!this.layouts || this.layouts.length <= 0 || !this.layouts[i] || this.layouts[i] != item) {
          return true;
        }

        this.$set(this.layouts[i], "error", false)
        this.$set(this.layouts[i], "errorMsg", `验证通！`)
        let readonly = this.getDisabled(item);
        if (readonly == true) {
          return true;
        }
        let _requir = item['require'] || false;
        let _val = this.forms[item['prop']] || '';
        _val = !_val ? "" : _val;
        if (_requir == false && !_val) {
          this.$set(this.layouts[i], "error", false)
          this.$set(this.layouts[i], "errorMsg", `验证通！`)
          return true;
        }
        if (_requir == true && _val.length <= 0) {
          this.$set(this.layouts[i], "error", true)
          const msg = this.errTextPrefix.select.includes(item['type']) ? '未选择' : this.errTextPrefix.write
            .includes(item['type']) ? '不能为空' : '不能为空';

          this.$set(this.layouts[i], "errorMsg",
            `${item['label']||item['placeholder'].replace(/^请输入/,'') ||''}${msg}`
          )
          if (this.errorType == 'alert') {
            this.$message.error(this.layouts[i]['errorMsg'])
          }
          return false;
        }
        let msg = item['msg'] || `${(item['label']||item['placeholder'] ||'').replace(/^请输入/,'')}不符合验证规则！`;
        let _regex = item['regex'];
        try {
          if (_regex instanceof RegExp && _val) {
            let flg = _regex && !_regex.test(_val)
            this.$set(this.layouts[i], "error", flg)
            this.$set(this.layouts[i], "errorMsg", !flg ? '验证通过' : msg)
            if (this.errorType == 'alert' && flg) {
              this.$message.error(this.layouts[i]['errorMsg'])
            }
            return !flg;
          }
        } catch (e) {
          //TODO handle the exception
        }
        if (typeof _regex == 'function') {
          let flg = !_regex(_val)
          this.$set(this.layouts[i], "error", flg)
          this.$set(this.layouts[i], "errorMsg", !flg ? '验证通过' : msg)
          if (this.errorType == 'alert' && flg) {
            this.$message.error(this.layouts[i]['errorMsg'])
          }
          return !flg;
        }
        return true;

      },
      /**
       * 联动
       */
      setChange(item, value) {
        let event = {
          prop: item['prop'],
          value: value,
          form: this.forms
        }
        this.$emit("rowChangeBefore", Object.assign({}, event, {
          layout: this.layouts
        }));
        let change = item['change'];
        if (typeof change == 'function') {
          let changeResult = change(value, event);
          Object.keys(changeResult).map(key => {
            if (['form', 'layout'].includes(key)) {
              let _v = changeResult[key];
              if (typeof _v == "function") {
                _v = _v(value, Object.assign({}, event, {
                  layout: this.layouts
                }));
              }
              if (key == 'form') {
                this.forms = _v;
              } else if (key == 'layout') {
                this.$set(this, 'layouts', _v || this.layouts)
                this.$forceUpdate();
              }
              return;
            }
            let lays = this.layouts.filter(la => la['prop'] == key);
            if (lays.length <= 0) {
              return;
            }

            let _i = this.layouts.indexOf(lays[0]);
            Object.keys(changeResult[key]).map(_key => {
              let _v = changeResult[key][_key];
              if (typeof _v == "function") {
                _v = _v(value, event);
              }
              this.$nextTick(() => {
                this.$set(this.layouts[_i], _key, _v);
              });
            });
          });
        }
      },

    },
    created() {
      this.formReset();
    }
  }
</script>

<style>
  .layout-dynamic-form .cols_1 {
    width: 100% !important;
  }

  .layout-dynamic-form .cols_2 {
    width: 48% !important;
  }

  .layout-dynamic-form .cols_3 {
    width: 30% !important;
  }

  .layout-dynamic-form .cols_4 {
    width: 20% !important;
  }

  .layout-dynamic-form .el-form-item {
    margin-bottom: 14px !important;
  }

  .el-slider__button-wrapper,
  .el-tooltip.el-slider__button {
    z-index: 2 !important;
  }

  .error-bor-d .el-input.el-input__inner,
  .error-bor-d .el-input__inner,
  .el-checkbox-group.error-bor-d,
  .el-select.error-bor-d input,
  .el-input.el-input--suffix.error-bor-d input,
  .el-textarea.el-input--suffix.error-bor-d textarea .el-input.el-input-group.el-input-group--append.el-input--suffix.error-bor-d {
    border: 1px solid red;
  }

  .el-input.el-input-group.el-input-group--append.el-input--suffix.error-bor-d input {
    border-right: 0px;
  }

  .el-input.el-input-group.el-input-group--append.el-input--suffix.error-bor-d .el-input-group__append {
    border: 1px solid red;
    border-left: 0px;
  }

  .el-input.el-input-group.el-input-group--append.el-input-group--prepend.el-input--suffix.error-bor-d input,
  .el-input.el-input-group.el-input-group--prepend.el-input--suffix.error-bor-d input {
    border-left: 0;
  }

  .el-input.el-input-group.el-input-group--append.el-input-group--prepend.el-input--suffix.error-bor-d .el-input-group__prepend,
  .el-input.el-input-group.el-input-group--prepend.el-input--suffix.error-bor-d .el-input-group__prepend {
    border: 1px solid red;
    border-right: 0;
  }

  .el-input.el-input-group.el-input-group--prepend.el-input--suffix.error-bor-d .el-input-group__prepend {
    padding-right: 0 !important;
  }

  .el-input.el-input-group.el-input-group--prepend.el-input--suffix.error-bor-d input {
    padding-left: 4px;
  }

  .el-input.el-input-group.el-input-group--prepend.el-input--suffix span.el-input__suffix,
  .el-input.el-input--prefix.el-input--suffix span.el-input__suffix,
  .el-input.el-input-group.el-input-group--prepend.el-input--suffix span.el-input__prefix,
  .el-input.el-input--prefix.el-input--suffix span.el-input__prefix {
    align-items: center !important;
    display: flex;
  }

  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 10px !important;
  }
</style>
