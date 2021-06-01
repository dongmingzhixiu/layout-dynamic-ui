<template>
  <div class="ld-image" :class="`ld-image-${hash}`">
    <el-upload :file-list="fileList" :limit="limits" :multiple="multiple" action="#" list-type="picture-card"
      :on-change="fileListChange" :before-remove="beforeRemove" :auto-upload="false" :on-exceed="selectImages" :accept="accept">
      <i slot="default" class="el-icon-plus" @click="selectImages"></i>
      <div slot="file" slot-scope="{file}" class="w h position-relative">
        <el-image :id="`image-${file.uid}`" :ref="`image-${file.uid}`" class="w h" fit="cover " :src="file.url" alt=""
          :preview-src-list="[file.url]" :style="{transform:`rotate(${file.rotate||0}deg)`}">
        </el-image>
        <div class="b-i5 p6 p-t3 p-b3 r2 a-i-c item-hover image-tools" style=" position: absolute;top:0;right:0; z-index: 2;pointer-events: none;">
          <i class="el-icon-zoom-in c-f cur-p m-r4" style="pointer-events: none;z-index: 1;" @focus="isPreview=true"></i>
          <i class="el-icon-delete c-f cur-p" style="pointer-events:auto;z-index: 1;" @click="removeImage(file)"></i>
          <i v-if="showRotate" class="m-l4 el-icon-refresh-right c-f cur-p" style="pointer-events:auto;z-index: 1;"
            @click="rotateImage(file)"></i>
        </div>
      </div>
    </el-upload>
  </div>
</template>
<script>
  export default {
    name: 'ld-images',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      limit: {
        type: Number,
        default: 4
      },
      value: {
        type: [Array, String],
        default: () => {
          return [];
        }
      },
      getImagePath: {
        type: Function,
        default: null
      },
      accept: {
        type: String,
        default: "image/x-png,image/gif,image/jpeg,image/jpg,image/bmp",
      },
      isSplit: {
        type: Boolean,
        default: true,
      },
      splitChart: {
        type: String,
        default: ','
      },
      /**
       * 是否显示图片旋转按钮
       */
      showRotate: {
        type: Boolean,
        default: false,
      },
      multiple: {
        type: Boolean,
        default: true,
      }
    },
    watch: {
      limit(news) {
        this.limits = news;
      },
      value(news) {
        this.fileListChange();
        setTimeout(() => {
          this.showAddButton();
        }, 250);
      }
    },
    data() {
      return {

        limits: this.limit,
        isPreview: false,
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: [],
        hash: this.$ld.util.randomChar(6),
        rotate: 0
      };
    },
    methods: {
      /**
       * 旋转图片
       */
      rotateImage(_file) {
        let index = this.fileList.indexOf(_file);
        let el = this.$refs[`image-${_file.uid}`];
        if (el) {
          _file.rotate = _file.rotate || 0;
          _file.rotate += 90;
          _file.rotate = _file.rotate % 360;
          this.$set(this.fileList, index, _file);
          this.$emit("image", this.fileList);
        }
      },
      changeFileList() {
        if (!this.value || this.value.length <= 0) {
          return;
        }
        let arr = typeof this.value == 'string' ?
          this.value.indexOf(this.splitChart) > 0 ?
          this.isSplit && this.value.split(this.splitChart) : [this.value] : this.value;
        if (arr.length <= 0) {
          return;
        }
        arr.map(key => {
          if (!key) {
            return;
          }
          let obj = this.$ld.util.urlToObj(key, true);
          //key = key.indexOf("?") > 0 ? key.substring(0, key.indexOf('?')) : key;
          let name = obj['action']; // key.substring(key.lastIndexOf('/') + 1);
          let url = "";
          if (typeof this.$ld.getImagePath == 'function') {
            url = this.$ld.getImagePath(key);
          } else if (typeof this.getImagePath == 'function') {
            url = this.getImagePath(key);
          } else {
            url = key;
          }
          this.$set(this.fileList, this.fileList.length, {
            name: name,
            rotate: obj['rotate'] || 0,
            url: url
          })
        });
        this.$nextTick(()=>{
          this.showAddButton();
        })
      },
      fileListChange(file, fileList) {
        if (!file || !fileList) {
          return;
        }
        this.fileList = fileList;
        this.$emit("image", this.fileList);
        this.showAddButton();
      },
      selectImages(files, fileList) {
        // this.showAddButton();
        if (this.limits <= 1) {
          return;
        }
      },
      removeImage(file) {
        this.fileList = this.fileList.filter(item => item.uid != file.uid);
        this.$emit("image", this.fileList);
        this.showAddButton();
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
        // this.setAccept();
      },
      showAddButton() {
        if (!document.querySelector(`.ld-image-${this.hash} .el-upload.el-upload--picture-card`)) {
          return;
        }
        document.querySelector(`.ld-image-${this.hash} .el-upload.el-upload--picture-card`).style.display =
          this.fileList.length < this.limits ? 'inline-block' : 'none';
      }
    },
    created() {
      this.changeFileList();
    },
    mounted() {}

  }
</script>
<style>
  .item-hover {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }

  .item-hover:hover {
    background-color: rgba(0, 0, 0, 0.2) !important;
    pointer-events: auto;
  }

  .el-icon-zoom-in:hover {
    pointer-events: auto;
  }
</style>
