<template>
  <div class="ld-doc h w position-relative over-h" :style="{'background':background}">
    <div v-if="align=='center'&&outline.length>0&&showOutlines">
      <template v-if="$scopedSlots.outline">
        <slot name="outline" :item="outline"></slot>
      </template>
      <template v-else>
        <ld-menu-tree mode="horizontal" :tree="outline" :background-color="menuTree['background-color']"
          :text-color="menuTree['text-color']" :active-text-color="menuTree['active-text-color']" @click="outLineClick">
        </ld-menu-tree>
      </template>
    </div>
    <div class="f-s h" :style="{'height':`calc(100% - ${align=='center'?'80px':'20px'})`}">
      <template v-if="align=='left'&&outline.length>0&&showOutlines">
        <template v-if="$scopedSlots.outline">
          <slot name="outline" :item="outline"></slot>
        </template>
        <template v-else>
          <div v-if="expansion" class="m-r10 over-a-y h p10 box-b f-n-c-w"
            style="border-right: 1px solid #efefef;width: 420px;box-shadow: 1px -6px 11px 0px rgb(0 0 0 / 15%);"
            :style="{'background':menuTree['background-color']}">
            <div v-if="title" class="fs26 c8 p-b10 p-t10 f-b a-i-c">
              <div class="ellipsis">{{title}}</div>
              <div class="el-icon-s-operation m-r10" @click="expansion=!expansion"></div>
            </div>
            <ld-menu-tree :tree="outline" :background-color="menuTree['background-color']"
              :text-color="menuTree['text-color']" :active-text-color="menuTree['active-text-color']"
              @click="outLineClick"></ld-menu-tree>
          </div>
          <div v-else class="el-icon-s-operation m-r10 fs26 c-p m-t10 p-t4 pos-l0" @click="expansion=!expansion"></div>
        </template>
      </template>
      <div style="flex-grow: 2;" class="h over-a-y p10 box-b f-c">
        <div class="p-b10" :class="{'box-shadow':docWidths!='100%'}" :style="{'width':docWidths}">
          <ld-doc-item class="b-f p10 r4" :doc="docs" :is-first="true" :codeLanguages="codeLanguages">
            <!-- 向上传递插槽： -->
            <template v-slot:[keys]="e" v-for="(keys,j) in Object.keys($scopedSlots)">
              <div :key="`${j}`">
                <slot :name="keys" :item="e['item']"></slot>
              </div>
            </template>
          </ld-doc-item>
          <div class="h-20 w"></div>
        </div>
      </div>
      <template v-if="align=='right'&&outline.length>0&&showOutlines">
        <template v-if="$scopedSlots.outline">
          <slot name="outline" :item="outline"></slot>
        </template>
        <template v-else>
          <div v-if="expansion" class="over-a-y h p10 box-b  f-n-c-w"
            style="border-left: 1px solid #efefef;width: 420px;-6px -3px 11px 0 rgb(0 0 0 / 15%)"
            :style="{'background':menuTree['background-color']}">
            <div v-if="title" class="fs26 c8 p-b10 p-t10 f-b a-i-c">
              <div class="el-icon-s-operation m-r10" @click="expansion=!expansion"></div>
              <div class="ellipsis">{{title}}</div>
            </div>
            <ld-menu-tree :tree="outline" :background-color="menuTree['background-color']"
              :text-color="menuTree['text-color']" :active-text-color="menuTree['active-text-color']"
              @click="outLineClick"></ld-menu-tree>
          </div>
          <div v-else class="el-icon-s-operation m-l10 fs26 c-p m-t10 p-t4 pos-r0" @click="expansion=!expansion"></div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  const drakBack = '#fff'; //'#00000080';
  import ldDocItem from './ld-doc-item.vue';
  export default {
    name: 'doc',
    components: {
      ldDocItem
    },
    props: {
      doc: {
        type: [Array, Object, String],
        default: ''
      },
      codeLanguages: {
        type: Array,
        default: () => {
          return ["csharp", "html", "css", "javascript", "php", "dart", "bash", "shell", "sql", 'vue'];
        }
      },
      skin: {
        type: String,
        default: 'light',
      },
      aligns: {
        type: String,
        default: 'left',
      },
      docWidth: {
        type: String,
        default: '100%',
      },
      showOutline: {
        type: Boolean,
        default: true,
      },
      /**
       * 锚链接时，点击打开方式
       */
      MdAnchorLinkTarget: {
        type: String,
        default: '_self'
      }
    },
    watch: {
      skin(news) {
        this.skins = news;
        this.background = this.skin == 'light' ? '#fff' : drakBack;
        this.menuTree = this.skin == 'light' ? {
          'background-color': "",
          'text-color': "",
          'active-text-color': ""
        } : {
          'background-color': "#545c64",
          'text-color': "#fff",
          'active-text-color': "#ffd04b"
        }
      },
      aligns(news) {
        this.align = news;
      },
      docWidth(news) {
        this.docWidths = news;
      },
      showOutline(news) {
        this.showOutlines = news;
      },
      doc(news) {
        this.docs = news;
      }
    },
    data() {
      return {
        docs: this.doc,
        docWidths: this.docWidth,
        align: this.aligns,
        languages: this.codeLanguages,
        outline: [],
        showOutlines: this.showOutline,
        title: '',
        expansion: true,
        skins: this.skin,
        background: this.skin == 'light' ? '#fff' : drakBack,
        menuTree: this.skin == 'light' ? {
          'background-color': "",
          'text-color': "",
          'active-text-color': ""
        } : {
          'background-color': "#545c64",
          'text-color': "#fff",
          'active-text-color': "#ffd04b"
        }
      }
    },
    methods: {
      outLineClick(e) {
        if (!e || !e['label']) {
          return;
        }
        let maodian = `#`;
        window.location.hash = maodian;
        let _v = e['label'].replace(/[.=*#\^\$"'`]/g, "_");
        let el = document.querySelector(`[name$="${_v}"]`)
        el = el[0] || el;
        maodian = `#${el.getAttribute("name")}`;
        window.location.hash = maodian;
      },
      getOutLine() {
        //根据doc获取到大纲
        let info = [];
        this.getDocInfo(this.docs, info);
        this.outline = info;
        this.title = this.title || (info && info.length > 0 ? info[0]['label'] : '') || '';
      },
      getDocInfo(doc, info) {
        info = info || [];
        if (typeof doc == 'string' && doc.length <= 40) {
          return info[info.length] = doc;
        }
        if (!Array.isArray(doc) && typeof doc == 'object') {
          Object.keys(doc).map(keys => {
            let _val = {
              label: doc[keys].replace(/[\^\$"`']/g, "")
            };
            if (['h1', 'h2', 'h3', 'title'].includes(keys.toLocaleLowerCase())) {
              if (keys.toLocaleLowerCase() == 'title') {
                this.title = doc[keys];
              }
              if (keys.toLocaleLowerCase() == 'h1') {
                info.push(_val);
                return info;
              }
              if (keys.toLocaleLowerCase() == 'h2') {
                info[info.length - 1] = info[info.length - 1] || {
                  label: '未设置'
                };
                info[info.length - 1]['children'] = info[info.length - 1]['children'] || [];
                info[info.length - 1]['children'].push(_val);
                return info;
              }
              if (keys.toLocaleLowerCase() == 'h3') {
                info[info.length - 1] = info[info.length - 1] || {
                  label: '未设置'
                };
                info[info.length - 1]['children'] = info[info.length - 1]['children'] || [];
                info[info.length - 1]['children'][info[info.length - 1]['children'].length - 1] = info[info.length -
                  1]['children'][info[info.length - 1]['children'].length - 1] || {
                  label: '未设置'
                };
                info[info.length - 1]['children'][info[info.length - 1]['children'].length - 1]['children'] = info[
                  info.length - 1]['children'][info[info.length - 1]['children'].length - 1]['children'] || [];
                info[info.length - 1]['children'][info[info.length - 1]['children'].length - 1]['children'].push(
                  _val);
                return info;
              }
            }
          });
        }
        if (Array.isArray(doc)) {
          doc.map(item => {
            this.getDocInfo(item, info);
          });
        }
        return info;
      },
      createMdAnchorLinkTarget() {
        setInterval(()=>{
          let a=document.querySelectorAll('.ld-doc-markdown-preview a[href^="#"]');
          for(let i=0;i<a.length;i++){
            let _a=a[i];
            _a.setAttribute("target",this.MdAnchorLinkTarget);
          }
        },1000);
      }
    },
    created() {
      this.createMdAnchorLinkTarget();
      this.getOutLine();
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

  .ld-doc .markdown-preview table,
    {
    margin-top: 0 !important;
  }

  .ld-doc .markdown-preview.markdown-theme-light {
    padding-top: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .ld-doc .markdown-theme-light code {
    display: inline-block;
    background: #f7f7f7;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    margin: 0 3px;
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid #eee;
    color: #e91e98fc !important;
  }

  .el-menu {
    border-right: 0px !important;
  }
</style>
