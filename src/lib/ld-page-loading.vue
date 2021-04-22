<template>
  <div class="w h box-b" style="position: relative;" :style="{'z-index':loading?zIndex:1}">
    <template v-if="!$slots.loading">
      <div v-if="loadings" class="w h f-c align-items-center" style="position: absolute;"
        :style="{'z-index':zIndex,'background':backgrounds?backgrounds:skins=='dark'?'rgba(0, 0 ,0, 0.5)':'#fff'}">
        <div class="t-c">
          <div class="w f-c fs26 c-p">
            <div :class="loadingType">
              <template v-for="i in (loadingTypes[loadingType]||3)">
                <div v-if="!isBorder.includes(loadingType)" :key="i"
                  :style="{'background-color':colors?colors:skins=='dark'?'':'rgb(64, 158, 255)'}"></div>
                <div v-else :key="i" :style="getStyle(i)"></div>
              </template>
            </div>
          </div>
          <div class="w f-c p-t10 c-f m-t10 a-i-c o6"
            :style="{'color':colors?colors:skins=='dark'?'#fff':'rgb(64, 158, 255)'}">{{loadingTexts}}
            <div class="ball-grid-pulse" style="width: 25px;">
              <div style="width: 4px;height: 4px;"
                :style="{'background-color':colors?colors:skins=='dark'?'#fff':'rgb(64, 158, 255)'}"></div>
              <div style="width: 4px;height: 4px;"
                :style="{'background-color':colors?colors:skins=='dark'?'#fff':'rgb(64, 158, 255)'}"></div>
              <div style="width: 4px;height: 4px;"
                :style="{'background-color':colors?colors:skins=='dark'?'#fff':'rgb(64, 158, 255)'}"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="box-b w h f-c align-items-center" style="position: absolute;top: 0;left: 0;">
        <slot name="loading"></slot>
      </div>
    </template>
    <div class="w h">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import 'loaders.css';
  import res from './config/ld-loading-res.js'
  export default {
    name: 'ld-page-loading',
    props: {
      /**
       * css z-index的值
       */
      zIndex: {
        type: Number,
        default: 1002
      },
      /**
       * 主题
       */
      skin: {
        type: String,
        default: 'light', //dark
      },
      /**
       *背景色
       */
      background: {
        type: String,
        default: ''
      },
      /**
       * 动画或文字颜色
       */
      color: {
        type: String,
        default: ''
      },
      /**
       * loadingTtype
       */
      loadingType: {
        type: String,
        default: 'ball-grid-pulse',
        // ball-pulse
        // ball-grid-pulse
        // ball-clip-rotate
        // ball-clip-rotate-pulse
        // square-spin
        // ball-clip-rotate-multiple
        // ball-pulse-rise

        // ball-rotate
        // cube-transition
        // ball-zig-zag
        // ball-zig-zag-deflect
        // ball-triangle-path
        // ball-scale
        // line-scale

        // line-scale-party

        // ball-scale-multiple
        // ball-scale-multiple

        // ball-beat

        // line-scale-pulse-out

        // line-scale-pulse-out-rapid

        // ball-scale-ripple
        // ball-scale-ripple-multiple
        // ball-spin-fade-loader
        // line-spin-fade-loader
        // triangle-skew-spin
        // pacman
        // ball-grid-beat
        // semi-circle-spin
        // ball-scale-random
      },
      /**
       * 是否加载
       */
      loading: {
        type: Boolean,
        default: true
      },
      /**
       * 加载文字
       */
      loadingText: {
        type: String,
        default: '加载中'
      }
    },
    watch: {
      loading(news) {
        this.loadings = news;
      },
      loadingText(news) {
        this.loadingTexts = news;
        this.createTextAnimal();
      },
      loadingType(news) {
        this.types = news;
      },
      color(news) {
        this.colors = news;
      },
      background(news) {
        this.backgrounds = news;
      },
      skin(news) {
        this.skins = news;
      }

    },
    data() {
      return {
        skins: this.skin,
        isBorder: res.isBorder,
        onlyDark: res.isDark,
        loadingTypes: res.loadingTypes,
        loadingTexts: this.loadingText,
        loadings: this.loading,
        textAnimal: null,
        opacity: 1,
        types: this.loadingType,
        colors: this.color,
        backgrounds: this.background,
      };
    },
    methods: {
      getStyle(i) {
        if (this.loadingType == 'ball-clip-rotate-pulse' && i == 1) {
          return {
            'background': this.colors ? `${this.colors}` : this.skins == 'dark' ? '' : 'rgb(64, 158, 255)'
          }
        }
        if (this.loadingType == 'pacman') {
          return i < 3 ? {
            'border': `25px solid ${this.colors ? this.colors: this.skins == 'dark' ? '#fff' :'rgb(64, 158, 255)'}`,
            'border-right': `25px solid ${this.backgrounds?this.backgrounds:this.skins=='dark'?'transparent':'#fff'}`,
            'background': ''
          } : {
            'background': this.colors ? `${this.colors}` : this.skins == 'dark' ? '#fff' : 'rgb(64, 158, 255)'
          }
        }
        if (this.loadingType == 'semi-circle-spin') {
          return {
            'background': `-webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(70%, transparent), color-stop(30%, #00bcd400), to(${ this.colors ? this.colors : this.skins == 'dark' ? '#fff' :'rgb(64, 158, 255)'}))`
          }
        }
        if (this.loadingType == 'ball-scale-ripple-multiple' || this.loadingType == 'ball-clip-rotate') {
          return {
            'border': `2px solid ${this.colors ? this.colors : this.skins == 'dark' ? '#fff' :'rgb(64, 158, 255)'}`,
            'border-bottom-color': this.loadingType == 'ball-clip-rotate' ? 'transparent' :
              `${this.colors ? this.colors : this.skins == 'dark' ? '#fff' :'rgb(64, 158, 255)'}`
          }
        }

        // if (this.loadingType == 'triangle-skew-spin') {
        //   return {
        //     'border': `25px solid ${this.colors ? this.colors: this.skins == 'dark' ? '' :'rgb(64, 158, 255)'}`,
        //     'border-right': '25px solid transparent',
        //     'background': ''
        //   }
        // }

        return {
          'border-color': this.colors ? `${this.colors} transparent ${this.colors} transparent` : this.skins == 'dark' ?
            '' : 'rgb(64, 158, 255) transparent rgb(64, 158, 255) transparent'
        }
      }
    },
    created() {
      if (this.onlyDark.includes(this.loadingType)) {
        this.skins = "dark";
      }
    }
  }
</script>

<style>
  .square-spin>div {
    border: none !important;
  }
</style>
