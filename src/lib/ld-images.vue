<template>
  <div>
    <el-upload :file-list="fileList" :limit="limit" multiple action="#" list-type="picture-card"
      :on-change="fileListChange" :before-remove="beforeRemove" :auto-upload="false" :on-exceed="selectImages">
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
    },
    data() {
      return {
        isPreview: false,
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: [],
      };
    },
    methods: {
      fileListChange(file, fileList) {
        this.fileList = fileList;
        this.$emit("image", this.fileList);
      },
      selectImages(files, fileList) {
        if (this.limit <= 1) {
          return;
        }
        this.$message.warning(`当前限制选择${this.limit}个文件，共选择了 ${this.fileList.length} 个文件`);
      },
      removeImage(file) {
        this.fileList = this.fileList.filter(item => item.uid != file.uid);
        this.$emit("image", this.fileList);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }


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
