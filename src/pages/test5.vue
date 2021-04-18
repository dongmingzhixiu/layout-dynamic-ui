<template>
	<!-- 状态 -->
	<ld-forms  :cols="1" ref="searchForm" class="w h m-t2" :form="forms" :layout="layout">
		<template #buttons="e">
			<div class="f-s">
				<el-button class="el-icon-search m-l2" type="primary" @click="search(e)">查询</el-button>
			</div>
		</template>
	</ld-forms>

</template>

<script>
	export default {
		data() {
			return {
				forms: {},
				layout: [{
					prop: 'phone',
					label: '电话',
					type: 'text',
					placeholder: '请输入手机号码',
					msg: '手机号码错误！',
					regex: /^1[0-9]{10}$/,
					width: 'calc(100% - 10px)!important',
					require: true,
				}, {
					prop: 'bookName',
					label: '书籍名称',
					type: 'text',
					regex: /^.{2,10}$/,
					width: 'calc(100% - 10px)!important',
					require: true,
				}, {
					prop: 'remake',
					label: '书籍描述',
					type: 'text',
					width: 'calc(100% - 10px)!important',
				}, 
				{
					prop: 'address',
					label: '地址',
					type: 'address',
					width: 'calc(100% - 10px)!important',
					value:'甘肃省,兰州市,城关区',
					require:true,
				}, 
				
				]
			}
		},
		methods: {
			search(e) {
				let {
					error,
					msg
				} = this.$refs.searchForm.checkForm();
				console.log(error, msg);
			}
		}
	}
</script>

<style>

</style>
