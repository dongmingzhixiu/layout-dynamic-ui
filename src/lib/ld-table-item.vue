<template>
	<div>
		<div v-if="typeof items.html=='function'" v-html="getHtmlResult(items,rows)"></div>
		<div v-else-if="typeof items.format=='function'">{{getFormatResult(items,rows)}}
		</div>
		<template v-else-if="items['replace']&&Object.keys(items['replace']).length>0">
			<slot name="replace" :item="items" :row="rows"></slot>
		</template>
		<div v-else class="ellipsis" :style="{'width':items.width}">
			<template v-if="rows[items['prop']]">{{getNullReplaceEmptyVal(rows[items['prop']])}}</template>
		</div>
	</div>
</template>

<script>
	const {
		config
	} = require("@/lib/config/components-conf.js");

	export default {
		props: {
			item: {
				type: Object,
				default: () => {
					return {}
				}
			},
			row: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		watch: {
			item(news) {
				this.items = news;
			},
			row(news) {
				this.rows = news;
			}
		},
		data() {
			return {
				items: this.item,
				rows: this.row,
				tableConfig: config.tableConfig,
			}
		},
		methods: {
			/**
			 * 获取html
			 * @param {Object} col
			 * @param {Object} row
			 */
			getHtmlResult(col, row) {
				try {
					return col['html'](row[col.prop]);
				} catch (e) {
					throw "获取html数据出错！";
				}
			},
			/**
			 * 格式化数据
			 * @param {Object} col
			 * @param {Object} row
			 */
			getFormatResult(col, row) {
				try {
					return col['format'](row[col.prop]);
				} catch (e) {
					throw "格式化数据出错！" + e;
				}
			},
			/**
			 * 出现null字符串是处理
			 * @param {Object} val
			 */
			getNullReplaceEmptyVal(val) {
				return typeof val !== 'string' ? val : this.tableConfig.isReplaceNull ? val.replace(/^\s?null\s?$/gi, "") :
					val;
			},
		}
	}
</script>

<style>
</style>
