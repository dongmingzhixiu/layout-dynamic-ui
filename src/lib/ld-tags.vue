<template>
  <!-- 标签控件 -->
  <div class="m-t4">
    <div v-if="title" class="color8 p2" style="height: 28px;">{{title}}</div>
    <div class="f-s-w w">
      <el-tag v-for="(item,i) in tags" :key="i" effect="plain" closable class="m-r4 m-t1 m-b1" @close="closeTags(item)">
        {{item}}
      </el-tag>
      <el-input v-if="isAdd" v-model="text" placeholder="请输入内容" size="small" class="input-new-tag  m-r4 m-t1 m-b1"
        style="width: 100px;" />
      <div style="width: 80px;">
        <el-button type="primary" size="mini" plain class="m-t1 m-b1"
          :class="{'el-icon-plus':!isAdd,'el-icon-check':isAdd}" style="height: 32px;" @click="addTag">
          {{!isAdd?'Add':'确定'}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {	
		name: "ld-tags",
    props: {
      tag: {
        type: [Array, String],
        default: () => {
          return [];
        }
      },
      title: {
        type: String,
        default: ''
      }
    },
    watch: {
      tag(news) {
        this.tags = typeof news == 'object' ? news : typeof news == 'string' && !news ? [] : [news];
      }
    },
    data() {
      return {
        isAdd: false,
        tags: typeof this.tag == 'object' ? this.tag : typeof this.tag == 'string' && !this.tag ? [] : [this.tag],
        text: '',
      }
    },
    methods: {
      closeTags(item) {
        this.tags = this.tags.filter(ite => ite != item);
        this.$emit("tag", this.tags);
      },
      addTag() {

        if (this.isAdd) {
          //确定保存标签
          if (!this.text.trim()) {
            this.$message.error("请输入内容！");
            return;
          }
          if (this.tags.indexOf(this.text.trim()) >= 0) {
            this.$message.error("已存在相同的内容！");
            return;
          }
          this.$set(this.tags, this.tags.length, this.text.trim());
          this.text = "";
          this.$emit("tag", this.tags);
        }
        this.isAdd = !this.isAdd;
      }
    }
  }
</script>

<style>
  .el-input .input-placeholder,
  .el-input input {
    font-size: 14px !important;
    color: #409eff;
  }
</style>
