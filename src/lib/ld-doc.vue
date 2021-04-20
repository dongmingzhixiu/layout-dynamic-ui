<template>
  <div>
    <p v-if="typeof doc=='string'" v-html="doc"></p>
    <template v-else-if="typeof doc=='object'&&!Array.isArray(doc)">
      <template v-for="(key,i) in Object.keys(doc)">
        <template v-if="typeof doc[key]=='object'">
          <doc :doc="doc[key]" :key="`${index}_${i}`" :index="i">
            <template v-slot:[keys]="e" v-for="(keys,j) in Object.keys($scopedSlots)">
              <div :key="`slot_${index}_${j}`">
                <slot :name="keys" :item="doc[key]"></slot>
              </div>
            </template>
          </doc>
        </template>
        <template v-else>
          <p v-if="key.toLocaleLowerCase()=='p'" :key="`${index}_${i}`" v-html="doc[key]"></p>
          <h1 v-else-if="key.toLocaleLowerCase()=='h1'" :key="`${index}_${i}`" v-html="doc[key]"></h1>
          <h2 v-else-if="key.toLocaleLowerCase()=='h2'" :key="`${index}_${i}`" v-html="doc[key]"></h2>
          <h3 v-else-if="key.toLocaleLowerCase()=='h3'" :key="`${index}_${i}`" v-html="doc[key]"></h3>
          <div v-else-if="key.toLocaleLowerCase()=='slot'" :key="`${index}_${i}`">
            <slot :name="`${doc[key]}`" :item="doc"></slot>
          </div>
          <div v-else-if="key.toLocaleLowerCase().indexOf('tip')==0" :key="`${index}_${i}`" :class="getTipClass(key)" v-html="doc[key]"></div>
          <div v-else-if="isCode(key).isCode" :key="`${index}_${i}`" :class="getTipClass(key)" class="v-show-content">
            <pre><code :class="`language-${key.toLocaleLowerCase()}`" v-html="doc[key]"></code></pre>
          </div>
          <div class="p10 p-l5 bor-ef c6" v-else :key="`${index}_${i}`" v-html="doc[key]"></div>
        </template>
      </template>
    </template>
    <template v-else>
      <template v-for="(item ,i) in (Array.isArray(doc)?doc:[doc])">
        <doc :doc="item" :key="`${index}_${i}`" :index="i">

          <!-- 向上传递插槽： -->
          <template v-slot:[keys]="e" v-for="(keys,j) in Object.keys($scopedSlots)">
            <div :key="`slot_${index}_${j}`">
              <slot :name="keys" :item="item"></slot>
            </div>
          </template>

        </doc>
      </template>
    </template>
    <slot></slot>
  </div>
</template>

<script>
  //代码高亮
  import Prism from 'prismjs';
  export default {
    name: 'doc',
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
          return ["csharp", "html", "css", "javascript", "php", "dart", "bash", "shell", "sql"];
        }
      }
    },
    data() {
      return {
        languages: this.codeLanguages,
      }
    },
    methods: {
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
      initCodeShow() {
        const content = document.querySelector('.v-show-content'),
          codeNodes = content.getElementsByTagName('code');

        this.observer = new MutationObserver(() => {

          let nodesLength = codeNodes.length,
            codeNode, language;

          while (nodesLength--) {
            codeNode = codeNodes[nodesLength];
            language = codeNode.className.split('-')[1];
            if (this.languages.includes(language)) {
              codeNode.innerHTML = Prism.highlight(codeNode.innerText, Prism.languages[language], language);
            }
          }
          this.html = content.innerHTML;
          this.text = content.innerText;
        });

        this.observer.observe(content, {
          childList: true,
          characterData: true,
        });
      }
    },
    mounted() {
      this.initCodeShow();
    },
    updated() {
      this.initCodeShow();
    },
    created() {
      setTimeout(() => {
        this.initCodeShow();
      }, 250);
    }
  }
</script>

<style>
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
</style>
