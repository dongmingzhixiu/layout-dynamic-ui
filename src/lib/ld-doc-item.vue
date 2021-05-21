<template>
  <div class="ld-doc-item">
    <template v-if="typeof doc=='string'">
      <markdown-preview :initial-value="doc"></markdown-preview>
    </template>
    <template v-else-if="typeof doc=='object'&&!Array.isArray(doc)">
      <template v-for="(key,i) in Object.keys(doc)">
        <template v-if="typeof doc[key]=='object'">
          <ld-doc-item :hash="hash" :doc="doc[key]" :key="`${index}_${i}`" :index="i" :is-frist="false">
            <template v-slot:[keys]="e" v-for="(keys,j) in Object.keys($scopedSlots)">
              <div :key="`slot_${index}_${j}`">
                <slot :name="keys" :item="doc[key]"  :hash="hash"></slot>
              </div>
            </template>
          </ld-doc-item>
        </template>
        <template v-else>
          <p v-if="key.toLocaleLowerCase()=='p'" :key="`${index}_${i}`" v-html="getHtml(doc[key])"></p>
          <h1 v-else-if="key.toLocaleLowerCase()=='h1'||key.toLocaleLowerCase()=='title'" :key="`${index}_${i}`">
            <a :id="getHrefKey(`${key}_${doc[key]}`)" :name="getHrefKey(`${key}_${doc[key]}`)"
              v-html="getHtml(doc[key])">
            </a>
          </h1>
          <h2 v-else-if="key.toLocaleLowerCase()=='h2'" :key="`${index}_${i}`">
            <a :id="getHrefKey(`${key}_${doc[key]}`)" :name="getHrefKey(`${key}_${doc[key]}`)"
              v-html="getHtml(doc[key])"></a>
          </h2>
          <h3 v-else-if="key.toLocaleLowerCase()=='h3'" :key="`${index}_${i}`">
            <a :id="getHrefKey(`${key}_${doc[key]}`)" :name="getHrefKey(`${key}_${doc[key]}`)"
              v-html="getHtml(doc[key])"></a>
          </h3>

          <div v-else-if="key.toLocaleLowerCase()=='slot'" :key="`${index}_${i}`" class="m-b5">
            <slot :name="`${doc[key]}`" :item="doc"  :hash="hash"></slot>
          </div>
          <div v-else-if="key.toLocaleLowerCase().indexOf('tip')==0" :key="`${index}_${i}`" :class="getTipClass(key)"
            v-html="getHtml(doc[key])"></div>
          <div v-else-if="['md','markdown'].includes( key.toLocaleLowerCase())" :key="`${index}_${i}`">
            <markdown-preview class="ld-doc-markdown-preview" :initial-value="doc[key]"></markdown-preview>
          </div>
          <div v-else-if="isCode(key).isCode" :key="`${index}_${i}`" class="v-show-content m-b5"
            style="white-space:pre-wrap" :style="{'height':isShowLineNumber(doc[key])?'':'90px'}">
            <div class="w b-i5 f-b a-i-c p10 box-b" style="left: 0;height: 38px;min-height: 38px;line-height: 38px;">
              <div style="color: rgb(225 171 252);font-weight: bold;">{{key.toLocaleLowerCase()}} </div>
              <div @click="copValToClipboard(`${key}_${index}_${i}`)" class="t-r c-f w-60 h-30 cur-p">复制</div>
            </div>
            <pre :class="{'line-numbers':isShowLineNumber(doc[key]),'no-line-numbers':!isShowLineNumber(doc[key])}"
              style="margin-top: 0;padding-top: 0;padding-left: 5.8em;">
              <code :id="`${key}_${index}_${i}`" :class="`language-${key.toLocaleLowerCase()}`" v-html="getPreCode(doc,key)" style="position:relative;"></code></pre>
          </div>
          <div class="p10 p-l5 bor-ef c6" v-else :key="`${index}_${i}`" v-html="getHtml(doc[key])"></div>
        </template>
      </template>
    </template>
    <template v-else>
      <template v-for="(item ,i) in (Array.isArray(doc)?doc:[doc])">
        <ld-doc-item :hash="hash" :doc="item" :key="`${index}_${i}`" :index="i" :is-frist="false">

          <!-- 向上传递插槽： -->
          <template v-slot:[keys]="e" v-for="(keys,j) in Object.keys($scopedSlots)">
            <div :key="`slot_${index}_${j}`">
              <slot :name="keys" :item="item"  :hash="hash"></slot>
            </div>
          </template>

        </ld-doc-item>
      </template>
    </template>
    <slot></slot>
  </div>
</template>

<script>
  //代码高亮
  import Prism from 'prismjs';
  // import 'prismjs/themes/prism-dark.css';
  //markdown 文件展示
  import {
    MarkdownPreview
  } from 'vue-meditor'

  export default {
    name: 'ld-doc-item',
    components: {
      MarkdownPreview
    },
    props: {
      doc: {
        type: [Array, Object, String],
        default: ''
      },
      index: {
        type: Number,
        default: 0
      },
      codeLanguages: {
        type: Array,
        default: () => {
          return ["csharp", "html", "css", "javascript", "php", "dart", "bash", "shell", "sql", 'vue'];
        }
      },
      isFirst: {
        type: Boolean,
        default: true,
      },
      hash:{
        type:String,
        default:"",
      }
    },
    data() {
      return {
        languages: this.codeLanguages,
        outline: [],
      }
    },
    methods: {
      getHrefKey(str) {
        return str.replace(/[\^\$"`']/g, "").replace(/[.=*#\^\$"'`]/g, "_")+this.hash //添加hash
      },
      getTipClass(key) {
        if (key.length <= 0) {
          return ''
        }
        return `tip-${key.substr(-1)} b-${key.substr(-1)}1 m-b5`;
      },
      isCode(key) {
        return {
          isCode: this.languages.includes(key.toLowerCase().trim()),
          key
        };
      },
      isShowLineNumber(val) {
        return /\n/.test(val);
      },
      copValToClipboard(refKey) {
        // let el = document.getElementById(refKey);
        // try {
        //   if (document.selection) { // IE8 以下处理
        //     var oRange = document.body.createTextRange();
        //     oRange.moveToElementText(el);
        //     oRange.select();
        //   } else {
        //     var range = document.createRange();
        //     // create new range object
        //     range.selectNodeContents(el); // set range to encompass desired element text
        //     var selection = window.getSelection(); // get Selection object from currently user selected text
        //     selection.removeAllRanges(); // unselect any user selected text (if any)
        //     selection.addRange(range); // add range to Selection object to select it
        //   }
        //   let flg = document.execCommand("copy");
        //   this.$message[flg ? 'success' : 'error'](flg ? "复制成功！" : "复制失败，请选中代码使用Ctrl+C进行复制,Ctrl+V进行黏贴！");
        // } catch (e) {
        //   this.$message.error("复制失败，请选中代码使用Ctrl+C进行复制,Ctrl+V进行黏贴！");
        // }
        const flg = this.$ld.util.copyToClipboard(JSON.stringify(this.forms));
        this.$message[flg ? 'success' : 'error'](flg ? '复制成功！' : '复制失败，请选中代码使用Ctrl+C进行复制,Ctrl+V进行黏贴！');
      },
      getHtml(doc) {
        let i = -1;
        return doc.replace(/`/g, re => {
          i++;
          return i % 2 == 0 ? '<span class="markdown-theme-light"><code>' : '</code></span>';
        });
      },
      getPreCode(doc, key) {
        let val = doc[key];
        const keyVal = {
          'shell': 'bash',
          'vue': 'javascript'
        };
        key = keyVal[key] ? keyVal[key] : key;
        let comp = Prism.languages[key] || Prism.languages['html'];
        this.setLineNumber();
        return Prism.highlight(val, comp, key);
      },
      setLineNumber() {
        setTimeout(() => {
          let NEW_LINE_EXP = /\n(?!$)/g;
          let PLUGIN_NAME = 'line-numbers';
          let elements = Array.prototype.slice.call(document.querySelectorAll('pre.' + PLUGIN_NAME));
          elements.forEach(per => {
            let element = per.querySelector('code');
            if (element.querySelector(".line-numbers-rows")) {
              return;
            }
            let lineNumberRows = 1;
            var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
            var lineNumberEnd = lineNumberStart + (element.children.length);

            let lineNumberSizer = element.querySelector('.line-numbers-sizer')

            if (!lineNumberSizer) {
              lineNumberSizer = document.createElement('span');
              lineNumberSizer.className = 'line-numbers-sizer';
            }

            lineNumberSizer.innerHTML = '0';
            lineNumberSizer.style.display = 'block';
            var oneLinerHeight = lineNumberSizer.getBoundingClientRect().height;
            lineNumberSizer.innerHTML = '';
            let infoLines = element.textContent.split(NEW_LINE_EXP);
            var lines = new Array(infoLines.length + 1).join('<span></span>');
            var lineNumbersWrapper;
            lineNumbersWrapper = document.createElement('span');
            lineNumbersWrapper.setAttribute('aria-hidden', 'true');
            lineNumbersWrapper.className = 'line-numbers-rows';
            lineNumbersWrapper.innerHTML = lines;
            element.appendChild(lineNumbersWrapper);
          })
        }, 250);
      },

    },
    updated() {
      this.setLineNumber();
    },
    mounted() {
      this.setLineNumber();
    },
    created() {
      this.setLineNumber();
    }
  }
</script>

<style>
  .v-show-content {
    background: #384548;
    border-radius: 0.3em;
    margin-bottom: 10px;
  }

  code[class*="language-"],
  pre {
    color: #f8f8f2;
    background: none;
    text-shadow: 0 1px rgba(0, 0, 0, 0.3);
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  /* Code blocks */
  pre {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
    border-radius: 0.3em;
  }

  :not(pre)>code[class*="language-"],
  pre {
    /*background: #272822;*/
    background: #384548;
  }

  /* Inline code */
  :not(pre)>code[class*="language-"] {
    padding: .1em;
    border-radius: .3em;
    white-space: normal;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: slategray;
  }

  .token.punctuation {
    color: #f8f8f2;
  }

  .namespace {
    opacity: .7;
  }

  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #ffa07a;
  }

  .token.boolean,
  .token.number {
    color: #ae81ff;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #a6e22e;
  }

  .token.operator {
    color: #00e0e0;
  }

  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string,
  .token.variable {
    color: #f8f8f2;
  }

  .token.atrule,
  .token.attr-value,
  .token.function,
  .token.class-name {
    color: #e6db74;
  }

  .token.keyword {
    color: #66d9ef;
  }

  .token.regex,
  .token.important {
    color: #fd971f;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  pre[class*="language-"].line-numbers {
    position: relative;
    /* padding-left: 5.8em; */
    counter-reset: linenumber;
  }

  pre[class*="language-"].line-numbers>code {
    position: relative;
    white-space: inherit;
  }

  .line-numbers .line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 0;
    font-size: 100%;
    left: -10.8em;
    width: 3em;
    /* works for line-numbers below 1000 lines */
    letter-spacing: -1px;
    border-right: 1px solid #999;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

  }

  .line-numbers-rows>span {
    display: block;
    counter-increment: linenumber;
  }

  .line-numbers-rows>span:before {
    content: counter(linenumber);
    color: #9e59c1;
    display: block;
    padding-right: 0.8em;
    text-align: right;
  }

  pre.no-line-numbers {
    padding-left: 0.8em !important;
    margin-left: 0;
  }

  pre.no-line-numbers code {
    margin-left: -5.8em;
  }

  .ld-doc-item .markdown-preview table,
    {
    margin-top: 0 !important;
  }

  .ld-doc-item .markdown-preview.markdown-theme-light {
    padding-top: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .ld-doc-item .markdown-theme-light code {
    display: inline-block;
    background: #f7f7f7;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    margin: 0 3px;
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid #eee;
    color: #e91e98fc !important;
  }
</style>
