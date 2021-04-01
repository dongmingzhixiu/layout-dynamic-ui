<template>
  <ld-page-loading :loading="loading" class="box-b b-i1">
    <div class="w h f-c over-a-y p10  box-b a-i-c">
      <el-card class="w b-f p10" style="width:350px;height: auto;padding: 80px 40px;">
        <ld-forms ref="loginForm" :cols="1" :form="forms" :layout="layouts">
          <template v-slot:buttons="e">
            <div class="w f-b">
              <el-button type="primary" style="flex-grow: 2;" :loading="loginLoading" @click="loginData">登陆
              </el-button>
              <el-button @click="resetData">重置</el-button>
            </div>
          </template>
        </ld-forms>
      </el-card>
    </div>
  </ld-page-loading>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        loginLoading: false,
        loading: false,
        forms: {},
        layouts: [{
            prop: 'phone',
            type: 'text',
            label: '',
            placeholder: '请输入电话号码',
            regex: /^[1][0-9]{10}$/,
            require:true,
          },
          {
            prop: 'password',
            type: 'text',
            label: '',
            placeholder: '请输入用户密码',
            regex: /^[1][0-9]{10}$/,
            require:true,
          },
        ]
      }
    },
    methods: {
      loginData() {
        console.log('login')

        //验证数据
        let result=this.$refs.loginForm.checkForm();
        if(result['error']){
          this.$message.error(result['msg'])
          return;
        }

        this.loginLoading = true;
        //模拟请求耗时
        setTimeout(() => {
          this.loginLoading = false;
        }, 2000);



      },
      resetData() {
        this.forms = {};
      }
    },
    created() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
</script>
