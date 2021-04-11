<template>
	<div>
		<ld-page-tabs :tabs="pageTabs"></ld-page-tabs>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				pageTabs:[
						{prop:'1',page:'hello-world',label:'HelloWord'},
						{prop:'2',page:'form-Change',label:'联动'},
						{prop:'3',page:'test1',label:'测试1'},
						{prop:'4',page:'test2',label:'测试2'},
						{prop:'5',page:'test3',label:'测试3'},
						{prop:'6',page:'test4',label:'测试4'},
						{prop:'7',page:'save-forms',label:'form表单和表格'},
						{prop:'8',page:'table',label:'表格'},
						{prop:'9',page:'menu-tree',label:'菜单树'},
				]
			}
		}
	}
</script>

<style>
</style>
