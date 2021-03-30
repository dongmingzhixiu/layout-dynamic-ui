<template>
  <div class="w h">
    <!-- 地址选择组件 -->
    <div class="c8 el-input__inner fs14" @click="openCheckAddr">{{addrs.length>0?addrs:'请选择地址!'}}</div>
    <el-dialog class="id-dialog over-h-x" :title="addrs||'选择地址'" :visible.sync="dialogVisible" width="580px"
      :append-to-body="true">
      <div class="tip-p b-p2 c8 f-s a-i-c">
        <div>
          点击选中，省市县；点击县关闭窗口！
        </div>
        <el-input v-model="provinceName" @input="inputProvince" placeholder="输入省快速检索" class="w-240" clearable
          size="small">
          <template slot="prepend">
            <i class="el-icon-search"></i>
          </template>
        </el-input>
      </div>
      <div class="w f-s over-h-y h" style="height: calc(100% - 60px);">
        <el-cascader-panel filterable class="h" size="medium" v-model="value" :options="options" @change="addressChange">
        </el-cascader-panel>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ld-address',
    props: {
      addr: {
        type: String,
        default: ''
      }
    },
    watch: {
      addr(news) {
        this.addrs = news;
      }
    },
    data() {
      return {
        value: [],
        cityList: this.$ld.resource.addressItem['tb'],
        options: [],
        provinceName: '',
        addrs: this.addr,
        dialogVisible: false,
      }
    },
    methods: {
      openCheckAddr(){
        this.dialogVisible=!this.dialogVisible;
      },
      addressChange(value) {
        if(!value||value.length<=0){
          return;
        }
        const getItem=function(data,val){
         let _data= data.filter(item=>item.value==val);
         if(_data.length<=0){
           return {};
         }
         return _data[0];
        }
        let item=null;
        let add="";
        for(let i=0;i<value.length;i++){
          item=getItem(i==0?this.cityList:item['children'],value[i]);
          add +=item['label']?(`${item['label']}${i<value.length-1?',':''}`):item['label'];
          if(!add){
            return;
          }
        }
        this.$emit("addr", {
          text: add,
          code: value.join(',')
        })
        this.openCheckAddr();
      },
      getOptions() {
        this.options = this.cityList.filter(item => item.label.indexOf(this.provinceName) >= 0 || item.pingyinkey
          .indexOf(`${this.provinceName.toLocaleLowerCase()}`) >= 0);
      },
      inputProvince(e) {
        this.getOptions();
      },
      /**
       * 为省生成简拼
       */
      addPingYinKeyToProvice() {
        let temp = this.cityList;
        this.cityList = [];
        temp.map(item => {
          item['pingyinkey'] =
            `${this.$ld.util.pingyin.getFirstChar(item.label)}_${this.$ld.util.pingyin.chineseToPinYin(item.label)}`
            .toLocaleLowerCase()
          return item;
        })
        this.cityList = temp;
      }
    },
    created() {
      this.addPingYinKeyToProvice();
      this.getOptions();
    }
  }
</script>

<style>
  .el-cascader-menu__wrap.el-scrollbar__wrap,
  .el-scrollbar.el-cascader-menu {
    height: 100%;
  }
  .el-scrollbar__view.el-cascader-menu__list.is-empty{
    display: none;
  }
</style>
