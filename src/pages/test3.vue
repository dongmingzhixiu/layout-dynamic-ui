<template>
  <ld-page-loading :loading="loading" class="box-b b-i1">
    <ld-table :layout="layouts" :list="list" :auto-load-data-api="autoLoadDataApi" :span-method="objectSpanMethod"
      :show-page-helper="showPageHelper">
      <!-- -->
      <!-- <template #expand="e">
      </template> -->
      <template #tools="e">
        <el-button size="mini" type="text">按钮</el-button>
      </template>
      <template #toolsHeader="e">
        操作
      </template>

    </ld-table>
  </ld-page-loading>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        loginLoading: false,
        loading: false,
        showPageHelper: false,
        autoLoadDataApi: {
          remotePath: 'test/getUserInfo',
          remoteParam: {},
          remoteMethodType: "get",
          remoteTimeout: null,
          //是否是第三方请求
          remoteIsThirdRequest: false,
        },
        forms: {},
        layouts:
          // [{
          //     visabled: true,
          //     prop: 'name',
          //     label: {
          //       label: '家庭信息',
          //       children: [{
          //           prop: 'name',
          //           label: '姓名'
          //         },
          //         {
          //           prop: 'addr',
          //           label: '家庭住址'
          //         },
          //         {
          //           prop: 'phone',
          //           label: '电话'
          //         },
          //       ]
          //     },
          //     html: (val) => {
          //       return `<div class="c-p">${val}</div>`
          //     }
          //   },
          //   {
          //     visabled: true,
          //     prop: 'age',
          //     label: '年龄',
          //     sortable: true,
          //     html: (val) => {
          //       return `<div class="c-d">${val}</div>`
          //     }
          //   },
          //   {
          //     visabled: true,
          //     prop: 'sex',
          //     sortable: true,
          //     label: '性别',
          //     format: (val) => {
          //       return val == 0 ? '男' : '女';
          //     },
          //   },
          // ]
          [{
            label: '用户信息',
            children: [{
                prop: 'nickName',
                label: '用户名称'
              },
              {
                prop: 'phone',
                label: '电话号码'
              },
              {
                prop: 'remake',
                label: '描述'
              },
              {
                prop: 'sex',
                label: '性别',
                html: (val) => {
                  return `<div class="${val==1?'c-d':'c-s'}">${val==1?'男':'女'}</div>`
                }
              },
              {
                prop: 'userType',
                label: '用户类别',
                format: (val) => {
                  return val == 1 ? '普通用户' : '超级管理员'
                }
              },
              {
                prop: 'birthday',
                label: '出生日期',
                format: (val) => {
                  return val ? '' : this.$ld.util.getNowD(val)
                }
              },
              {
                prop: 'createdTime',
                label: '创建时间',
                format: (val) => {
                  return val ? '' : this.$ld.util.getNowDT(val)
                }
              },
              {
                prop: 'updatedTime',
                label: '修改时间',
                format: (val) => {
                  return val ? '' : this.$ld.util.getNowDT(val)
                }
              },
            ]
          }, ],
        list: [],
        objectSpanMethod: ({
          row,
          column,
          rowIndex,
          columnIndex
        }) => {
          if (columnIndex === 1) {
            return {
              rowspan: rowIndex % 2 == 0 ? 2 : 0,
              colspan: rowIndex % 2 == 0 ? 1 : 0
            };
          }
        }
      }
    },
    methods: {},
    created() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
</script>
