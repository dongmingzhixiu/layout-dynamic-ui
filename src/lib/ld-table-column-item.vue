<template>
	<div>
		<el-table-column v-for="(item,c) in lists" :prop="item['prop']" :label="typeof item.label=='string'?item.label:item.label['label']" :key="c"
			:align="item['align']||'center'" :width="item.width?item.width:tableConfig.defaultWidth">

			<template
				v-if="typeof item.label=='object'&&item.label&&item.label['children']&&item.label['children'].length>0">
				<ld-table-column-item :table-config="tableConfig" :list="item.label['children']"></ld-table-column-item>
			</template>

			<template slot-scope="scope">
				<ld-table-item :item="item" :row="scope.row">
					<template #replace="{item,row}">
						<template v-if="row[`${item['prop']}_reqplace_val`]"><label
								class="color11">计算中...</label></template>
						<template>{{getNullReplaceEmptyVal(row[item.prop])}}</template>
					</template>
				</ld-table-item>
			</template>
		</el-table-column>
	</div>
</template>

<script>
	import ldTableItem from "./ld-table-item.vue"
	export default {
		name: 'ld-table-column-item',
		props: {
			tableConfig: {
				type: Object,
				default: () => {
					return {}
				}
			},
			list: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		components: {
			ldTableItem
		},
		watch: {
			list(news) {
				this.lists = news;
			},
		},
		data() {
			return {
				lists: this.list,
			}
		},
		methods: {
			/**
			 * 出现null字符串是处理
			 * @param {Object} val
			 */
			getNullReplaceEmptyVal(val) {
				return typeof val !== 'string' ? val : this.tableConfig.isReplaceNull ? val.replace(/^\s?null\s?$/gi, "") :
					val;
			},
		},
		created() {
			debugger
			console.log(this.lists)
		}
	}
</script>

<style>
</style>
