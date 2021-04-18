<template>
	<div class="f-c box-b">
		<el-card class="w p10" style="width: 600px;">
			<ld-forms :editor-forms-init-api="editorFormsInitApi" :save-forms-data-before="saveFormsDataBefore" ref="editorForms" :form="forms" :layout="layouts"
				:auto-save-api="autoSaveApi">
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
</template>

<script>
	export default {
		name: 'saveTest',
		data() {
			let util = this.$ld.util;
			return {
				editorFormsInitApi:{
					//请求路径
					remotePath: 'test/getUserById',
					//请求参数
					remoteParam: {id:3},
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
					data['createdTime'] = new Date(data['createdTime']);
					data['updatedTime'] = new Date(data['updatedTime']);
					return data;
				},
				loading: false,
				forms: {},
				layouts: [
					{
						prop: 'phone',
						label: '电话',
						type: 'text',
						value: '1829311' + util.randomNum(1000, 9999),
						require: true,
					},
					{
						prop: 'nickName',
						label: '昵称',
						type: 'text',
						value: util.randomChar(5)
					},
					{
						prop: 'sex',
						label: '性别',
						type: 'select',
						options: [{
							label: '男',
							value: '1'
						}, {
							label: '女',
							value: '0'
						}],
						value: "1"
					},
					{
						prop: 'userType',
						label: '用户类型',
						type: 'select',
						options: [{
							label: '管理员',
							value: '1'
						}, {
							label: '普通用户',
							value: '0'
						}],
						value: "0"
					},
					{
						prop: 'remake',
						label: '备注',
						type: 'textarea',
						rows: 5
					},
					{
						prop: 'createdBy',
						label: '指派人',
						type: 'select',
						getOptions:{
							remotePath: 'test/getUserInfo',
							remoteMethodType: "get",
							label:'${nickName}(${phone})',
							value:'${id}'
						},
					},
					{
						prop: 'createdTime',
						label: '创建日期',
						type: 'sysdate',
						update: false
					},
					{
						prop: 'updatedTime',
						label: '修改日期',
						type: 'sysdate',
						update: true
					},
				]
			};
		},
		methods: {
			saveData() {
				this.$emit("events",{eventMethod:'saveBefore',eventParam:{1:1,a:'2111'}})
				this.loading = true;
				this.autoSaveApi['remotePath']="test/upd"
				this.$refs.editorForms.formSave((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.$message.success("保持成功！");
						return;
					}
					this.$message.error(res.msg || '保存失败！');
				}, () => {
					this.loading = false;
				});
			}
		}
	}
</script>

<style>
</style>
