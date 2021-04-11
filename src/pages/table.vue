<template>
	<div class="w over-h" style="height: calc(100vh);">
		<div class="w box-b p2">
			<ld-forms :form="{}" :layout="whereLayout" :is-row="true">
				<template #buttons="e">
					<el-button class="el-icon-search m-l4" type="primary">搜索</el-button>
					<el-button class="el-icon-plus m-l4" type="danger" @click="isAdd=true">新增</el-button>
				</template>
			</ld-forms>
		</div>
		<div class="f-b" style="height: calc(100% - 48px);">
			<div class="h" style="flex-grow: 2;">
				<ld-table class="w h" :layout="tableLayout" :list="list" :auto-load-data-api="autoLoadDataApi"
					:span-method="objectSpanMethod" :show-page-helper="showPageHelper">
					<!-- -->
					<!-- <template #expand="e">
							</template> -->
					<template #tools="e">
						<el-button size="mini" type="text" @click="editorForm(e)">编辑</el-button>
					</template>
					<template #toolsHeader="e">
						操作
					</template>

				</ld-table>
			</div>
			<div class="h" style="width: 500px;">
				<el-card class="h">
					<div class="tip-p b-p1">编辑数据</div>
					<ld-forms ref="editorForms" :form="{}" :layout="ediforLayout"
						:editorFormsInitApi="editorFormsInitApi" :auto-save-api="autoSaveApi"
						:save-forms-data-before="saveFormsDataBefore">
						<template #buttons="e">
							<div class="f-s">
								<el-button :loading="loading" @click="saveData" style="flex-grow: 2;" type="primary"> 保存
								</el-button>
								<el-button>重置</el-button>
							</div>
						</template>
					</ld-forms>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script>
	import info from '@/pages/table.js';
	export default {
		name: 'App',
		data() {
			return {
				isAdd: true,
				loginLoading: false,
				loading: false,
				showPageHelper: true,
				autoLoadDataApi: {
					remotePath: 'test/getPage',
					remoteParam: {
						phone: '',
						nickName: ''
					},
					remoteMethodType: "get",
					remoteTimeout: null,
					//是否是第三方请求
					remoteIsThirdRequest: false,
				},
				forms: {},
				list: [],
				whereLayout: info.whereLayout,
				tableLayout: info.tableLayout(this.$ld),
				ediforLayout: info.ediforLayout,
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
				},

				editorFormsInitApi: {
					//请求路径
					remotePath: 'test/getUserById',
					//请求参数
					remoteParam: {},
					//请求方法
					remoteMethodType: "get",
					//得到数据后对数据的预处理
					getDataAfter: (data) => {
						return data;
					}
				},
				autoSaveApi: {
					remotePath: 'test/add',
					remoteMethodType: "post",
				},
				saveFormsDataBefore: (data) => {
					debugger
					data['createdTime'] = new Date(data['createdTime']);
					data['updatedTime'] = new Date(data['updatedTime']);
					return data;
				},
			}
		},
		methods: {
			saveData() {
				this.loading = true;
				this.autoSaveApi['remotePath'] = this.isAdd ? "test/add" : "test/upd"
				this.$refs.editorForms.formSave((res) => {
					res = res.data || res;
					this.loading = false;
					if (res.code == 0) {
						this.$message.success("保持成功！");
						return;
					}
					this.$message.error(res.msg || '保存失败！');
				}, () => {
					this.loading = false;
				});
			},
			editorForm(e) {
				debugger
				this.isAdd = false;
				let temp = this.editorFormsInitApi;
				this.editorFormsInitApi = null;
				temp['remoteParam'] = {
					id: e['item']['id']
				}
				// this.$set(this.editorFormsInitApi,'remoteParam', {id: e['item']['id']})
				this.editorFormsInitApi = temp;
				this.$set(this, 'editorFormsInitApi', temp)
			}
		},
		created() {
			setTimeout(() => {
				this.loading = false;
			}, 1000);
		}
	}
</script>
