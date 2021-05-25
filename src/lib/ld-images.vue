<template>
  <div class="ld-image" :class="`${hash}`">
    <el-upload :file-list="fileList" :limit="limits" multiple action="#" list-type="picture-card"
      :on-change="fileListChange" :before-remove="beforeRemove" :auto-upload="false" :on-exceed="selectImages"
      :accept="accept">
      <i slot="default" class="el-icon-plus" @click="selectImages"></i>
      <div slot="file" slot-scope="{file}" class="w h position-relative">
        <el-image class="w h" fit="cover " :src="file.url" alt="" :preview-src-list="[file.url]">
        </el-image>
        <div class="b-i5 p6 p-t3 p-b3 r2 a-i-c item-hover"
          style=" position: absolute;top:0;right:0; z-index: 2;pointer-events: none;">
          <i class="el-icon-zoom-in c-f cur-p m-r4" style="pointer-events: none;z-index: 1;"
            @focus="isPreview=true"></i>
          <i class="el-icon-delete c-f cur-p" style="pointer-events:auto;z-index: 1;" @click="removeImage(file)"></i>
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
        hash: this.$ld.util.randomChar(6)
      };
    },
    methods: {
      // setAccept() {
      // if(!this.accept){
      //   return;
      // }
      // setTimeout(() => {
      //   try {
      //     document.querySelector(".ld-image").querySelector('input[type="file"]').setAttribute("accept", this
      //       .accept);
      //   } catch (e) {
      //     //TODO handle the exception
      //     this.setAccept();
      //   }
      // }, 250);
      // },

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
          key = key.indexOf("?") > 0 ? key.substring(0, key.indexOf('?')) : key;
          let name = key.substring(key.lastIndexOf('/') + 1);
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
            url: url
          })
        });
        this.showAddButton();
      },
      fileListChange(file, fileList) {
        if (!file || !fileList) {
          return;
        }
        this.fileList = fileList;
        this.$emit("image", this.fileList);
        this.showAddButton();
        // this.setAccept();
      },
      selectImages(files, fileList) {
        this.showAddButton();
        if (this.limits <= 1) {
          return;
        }
        // this.setAccept();
        //this.$message.warning(`当前限制选择${this.limit}个文件，共选择了 ${this.fileList.length} 个文件`);
        // 得到已选文件个数
      },
      removeImage(file) {
        this.fileList = this.fileList.filter(item => item.uid != file.uid);
        this.$emit("image", this.fileList);
        this.showAddButton();
        // this.setAccept();
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
        // this.setAccept();
      },
      showAddButton() {
        try {
          let setInv = setInterval(() => {
            if (document.querySelector(`.${this.hash} .el-upload.el-upload--picture-card`)) {
              document.querySelector(`.${this.hash} .el-upload.el-upload--picture-card`).style.display
              = this.fileList.length < this.limits ? 'inline-block' : 'none';
              clearInterval(setInv);
            }
            return;
          }, 10);

        } catch (e) {}
      }



    },
    created() {
      this.changeFileList();
      this.showAddButton();
    }
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
