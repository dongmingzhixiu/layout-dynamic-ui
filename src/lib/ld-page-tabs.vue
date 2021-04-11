<template>
	<el-tabs v-model="tabsValue" type="border-card" class="h box-b ld-page-tabs">
		<el-tab-pane v-for="(item, index) in pageTabs" :key="index" :label="item.label" :name="item.prop">
			<span slot="label" class="a-i-c">
				<span @click="itemClick(item)">
					<i v-if="item['icon']" :class="item['icon']"></i>
					<span>{{item['label']}}</span>
				</span>
				<i class="el-icon-refresh-right m-l6" @click="refreshTab(item)"></i>
				<i class="el-icon-close" @click.stop="removeTab(item)"></i>
			</span>
			<component class="w h" :is="item.page" :query="item"></component>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	export default {
		name: 'ld-page-tabs',
		props: {
			/**
			 * 关闭标签页是否显示关闭按钮
			 */
			showConfirm: {
				type: Boolean,
				default: true,
			},
			/**
			 * tabs参数
			 */
			tabs: {
				type: Array,
				default: () => {
					return [];
				}
			},
			/**
			 * 关闭标签页之前事件 ，通过返回值true，false控制是否继续执行关闭
			 */
			closeBefore: {
				type: Function,
				default: (item) => {
					return true;
				}
			},
			/**
			 * 刷新标签页之前事件 ，通过返回值true，false控制是否继续执行关闭
			 */
			refreshTabBefore: {
				type: Function,
				default: (item) => {
					return true;
				}
			},




		},
		data() {
			return {
				loading: false,
				pageTabs: this.tabs,
				tabsValue: '1',
			};
		},
		watch: {
			tabs(news) {
				this.pageTabs = news;
			}
		},
		methods: {
			/**
			 * 点击事件
			 * @param {Object} item
			 */
			itemClick(item) {
				this.tabsValue = item.prop;
				this.$emit("click", item);
			},
			/**
			 * 刷新
			 * @param {Object} item
			 */
			refreshTab(item) {
				let flg = true;
				if (typeof this.closeBefore == "function") {
					if (!this.refreshTabBefore(item)) {
						return;
					}
				}
				let index = this.pageTabs.indexOf(item);
				let page = item['page'] + "";
				this.$set(this.pageTabs[index], 'page', 'ld-page-loading');
				setTimeout(() => {
					this.$set(this.pageTabs[index], 'page', page);
					this.$emit("refresh", item);
				}, 286);
			},
			/**
			 * 移除选项卡
			 * @param {Object} item
			 */
			removeTab(item) {
				let tempValue = this.tabsValue;
				let flg = true;
				if (typeof this.closeBefore == "function") {
					if (!this.closeBefore(item)) {
						return;
					}
				}


				let fn = () => {
					this.pageTabs = this.pageTabs.filter(tab => tab != item);
					if (item['prop'] == tempValue) {
						this.$nextTick(() => {
							this.selectTabs(this.pageTabs.length - 1);
						});
					} else {
						this.tabsValue = tempValue;
					}
					this.$emit("close", item);
				}

				if (this.showConfirm) {
					this.$confirm(`确定关闭【${item['label']}】窗口吗？`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'danger'
					}).then(() => {
						fn();
					}).catch(() => {});
					return;
				}
				fn();
				this.$emit("close", item);
			},
			/**
			 * 选中标签页
			 * @param {Object} index
			 */
			selectTabs(index) {
				if (this.pageTabs.length > 0) {
					this.tabsValue = this.pageTabs[index]['prop']
				}
			}
		},
		created(e) {
			this.selectTabs(0);
		}
	}
</script>

<style>
	.ld-page-tabs .el-tabs__item .el-icon-close:hover,
	.ld-page-tabs.el-tabs__item .el-icon-refresh-right:hover {
		background-color: #C0C4CC;
		color: #FFF;
		border-radius: 50%;
	}

	.ld-page-tabs .el-tabs__content {
		box-sizing: border-box;
		height: calc(100% - 50px) !important;
	}

	.ld-page-tabs .el-tab-pane {
		box-sizing: border-box;
		height: 100% !important;
	}

	.ld-page-tabs .el-tabs__nav-next,
	.ld-page-tabs .el-tabs__nav-prev {
		line-height: 40px !important;
	}
</style>
