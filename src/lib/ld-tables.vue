<template>
	<div class="PageHelper box-b" :style="{'height':height?height:`calc(100vh + ${addHeight}px)`}">
		<!-- 普通table -->
		<el-table :id="id" @selection-change="changeCheckBoxValue" @select="rowSelect" @select-all="selectAll" :class="{'checkbox':(tableType=='checkbox'&&elTableType=='')||(tableType==''&&elTableType=='expand'),'checkbox-expand':tableType=='checkbox'&&elTableType=='expand'}"
		 v-if="layouts&&layouts.length>0" row-key="id" ref="elTable" empty-text="没有找到相关数据" fit border :height="height?height:!addHeight?`calc(100vh - 65px)`:`calc(100vh + ${addHeight-65}px)`"
		 :style="{'width':'100%','height':height?height:!addHeight?`calc(100vh - 65px)`:`calc(100vh + ${addHeight-65}px)`,'box-sizing': 'border-box'}"
		 v-loading="loading" :data="listData" :row-style="rowClass" @row-click="rowClick" style="width: 100%">
			<el-table-column v-if="tableType=='checkbox'" width="55" type="selection">
				<!-- <el-checkbox @click="checkBox"></el-checkbox> -->
			</el-table-column>

			<el-table-column type="expand" v-if="elTableType=='expand'">
				<template slot-scope="scope">
					<slot name="expand-info" :data="scope.row"></slot>
				</template>
			</el-table-column>

			<el-table-column v-if="(col.visabled==undefined||col.visabled==true)&&layouts&&layouts.length>0&&col&&col.prop&&col.label"
			 v-for="(col,index) in layouts" :prop="col.prop" :label="col.label" :width="col.width?col.width:defaults.width" :key="index">
				<template slot-scope="scope">
					<div v-if="typeof col.getHtml=='function'" v-html="getHtmlResult(col,scope.row)"></div>
					<div v-else-if="typeof col.format=='function'">{{getFormatResult(col,scope.row)}}</div>
					<div v-else class="ellipsis" :style="{'width':col.width}">
						<template v-if="scope.row[col.prop]">{{getNullReplaceEmptyVal(scope.row[col.prop])}}</template>
					</div>
				</template>
			</el-table-column>


			<el-table-column v-for="(to ,i) in tools" :key="'col'+i" :fixed="to.fixed" :label="to.label" :width="to.width">
				<div slot-scope="scope" class="f-c">
					<div :title="b.title" v-for="(b ,j) in to.btn" :key="j">
						<el-button v-if="b.icon&&!b.text" :title="b.title" :style="{'color':color[b.btnType]}" :type="btnType[b.btnType]"
						 class="f-c r" style="width: 30px;height: 30px;" size="small" @click="btnClick(b,scope.row)">
							<i :class="b.icon"></i>
						</el-button>
						<el-button :title="b.title" v-else :icon="b.icon" :style="{'color':color[b.btnType]}" :type="btnType[b.btnType]"
						 size="small" @click="btnClick(b,scope.row)">{{b.text}}</el-button>
					</div>
					<slot name="tools-btn" :data="scope.row"></slot>
				</div>
			</el-table-column>
			<!-- <slot name="tools"></slot> -->
		</el-table>



		<el-pagination v-if="layouts&&layouts.length>0&&showPageHelpers" align="right" background @size-change="handleSizeChange"
		 @current-change="handleCurrentChange" :current-page="currPage" :page-sizes="pageSizesList" layout="total, sizes, prev, pager, next, jumper"
		 :total="total"></el-pagination>
		<div v-else-if="showPageHelpers&&(!layouts||layouts.length<=0)" class="f-c h-240 color8">没有访问权限或暂未找到相关的配置信息！</div>
	</div>
</template>

<script>
	export default {

		name: "PageHelper",
		props: {
			id: {
				type: String,
				default: ''
			},
			height: {
				type: String,
				default: ''
			},
			tableType: {
				type: String,
				default: ''
			},
			elTableType: {
				type: String,
				default: ''
			},
			addHeight: {
				type: Number,
				default: 16
			},
			columns: {
				type: Array,
				default: function() {
					return [];
				}
			},
			layout: {
				type: Array,
				default: function() {
					return [];
				}
			},
			tools: {
				type: Array,
				default: function() {
					return [];
				}
			},
			isInitData: {
				type: Boolean,
				default: true
			},
			apiName: {
				type: String,
				default: ""
			},
			apiData: {
				type: Object,
				default: function() {
					return {};
				}
			},
			nullReplaceEmpty: {
				type: Boolean,
				default: true
			},
			changeList: {
				type: Function,
				default: (val) => {
					return val;
				}
			},
			checkList: {
				type: Array,
				default: () => {
					return [];
				}
			},
			showPageHelper: {
				type: Boolean,
				default: true
			},
			//外部传入数据，只在特殊的业务需要时使用
			list: {
				type: Array,
				default: () => {
					return [];
				}
			},
		},
		watch: {
			showPageHelper(news){
				this.showPageHelpers=news;
			},
			list(news) {
				if (news && news.length > 0) {
					this.listData = news;
					this.selectChecBox();
					//计算select所直线的后台服务数据
					this.$nextTick(() => {
						this.getSelectAfterList();
					})
					if (typeof this.changeList == "function") {
						this.listData = this.changeList(this.listData);
					}
					setTimeout(() => {
						this.doLayout();
					}, 200);
				}
			},
			apiData(news, old) {
				this.getPageData();
			},
			columns(news) {
				this.layouts = news;
				if (news && news.length > 0) {
					this.getPageData();
				}
			},
			layout(news) {
				this.layouts = news;
				if (news && news.length > 0) {
					this.getPageData();
				}
			},
			checkList(news) {
				this.selectChecBox();
			}
		},
		data() {
			return {
				showPageHelpers:this.showPageHelper,
				layouts: !this.columns || this.columns.length <= 0 ? this.layout : this.columns,
				listData: [],
				defaults: {
					width: "auto"
				},
				loading: false,
				currPage: 1,
				methodResult: {},
				total: 0,
				pageSize: 10,
				pageSizesList: [10],
				color: {
					1: '#ffffff',
					2: '#ffffff',
					3: '#ffffff',
					4: '#ffffff',
					5: '#909399',
					6: '#409EFF',
					7: '#f56c6c',
					8: '#85ce61',
					9: '#cf9236',
				},
				btnType: {
					1: 'success',
					2: 'primary',
					3: 'warning',
					4: 'danger',
					5: 'info',
					6: 'text',
					7: 'text',
					8: 'text',
					9: 'text'
				},
				selectRow: null,
			};
		},
		methods: {
			// @selection-change="changeCheckBoxValue" 

			/**
			 * 选中行样式
			 */
			rowClass(e) {
				let {
					row,
					rowIndex
				} = e;
				let arr = this.selIndex || []
				if (this.selectRow == row) {
					return {
						background: '#e1e9f1'
					}
				}
			},
			/**
			 * 选中行事件
			 */
			rowClick(row, column, event) {
				this.selectRow = row;
			},
			/**
			 * 出现null字符串是处理
			 * @param {Object} val
			 */
			getNullReplaceEmptyVal(val) {
				return typeof val !== 'string' ? val : this.nullReplaceEmpty ? val.replace(/^\s?null\s?$/gi, "") : val;
			},
			/**
			 * 格式化数据
			 * @param {Object} col
			 * @param {Object} row
			 */
			getFormatResult(col, row) {
				try {
					return col.format(row[col.prop]);
				} catch (e) {
					throw "格式化数据出错！" + e;
				}
			},
			/**
			 * 获取html
			 * @param {Object} col
			 * @param {Object} row
			 */
			getHtmlResult(col, row) {
				try {
					return col.getHtml(row[col.prop]);
				} catch (e) {
					throw "获取html数据出错！";
				}
			},
			// /**
			//  * 获取table高度
			//  */
			// getTabHeight() {
			// 	return document.body.clientHeight - 80 + "";
			// },
			/**
			 * 每页条数变化时发生
			 * @param {Object} val
			 */
			handleSizeChange(val) {
				this.pageSize = val;
				this.$nextTick(() => {
					this.getPageData();
				})

			},
			/**
			 * 当前页变化时发生
			 * @param {Object} val
			 */
			handleCurrentChange(val) {
				this.currPage = val;
				this.$nextTick(() => {
					this.getPageData();
				})
			},
			/**
			 * 请求处理获取后台数据
			 * @param {Object} action
			 * @param {Object} data
			 * @param {Object} colName
			 * @param {Object} index
			 * @param {Object} key
			 * @param {Object} tempKey
			 */
			getSelectData(action, data, colName, index, key, tempKey) {
				this.$api[action](data).then(res => {
					try {
						let val = res.data[colName];
						val = this.getNullReplaceEmptyVal(val);
						this.$set(this.listData[index], key, val);
						this.methodResult[tempKey] = val;
					} catch (e) {
					}
				});
			},
			/**
			 * 获取处理后的list
			 */
			getSelectAfterList() {
				try {
					let columns = this.layouts.filter(r => r.select);
					let temp = {};
					columns.map(r => {
						let key = r['prop'];
						let param = this.$util.urlToObj(r['select']);
						temp[key] = param;
						temp[key]['key'] = key;
					})
					if (!this.listData) {
						return;
					}
					for (let i = 0; i < this.listData.length; i++) {
						let r = this.listData[i];
						Object.keys(temp).map(t => {
							let d = {};
							if (r[t] && r[t].trim() != 'null') {
								d[temp[t]['inColumn']] = r[t];
								let k = `${t}_${r[t]}`;
								if (this.methodResult[k]) {
									console.log(this.methodResult);
									this.$set(this.listData[i], t, this.methodResult[k]);
								} else {
									this.getSelectData(temp[t]['action'], d, temp[t]['outColumn'], i, t, k);
								}
							}
						});
					}
				} catch (e) {
					//TODO handle the exception
					throw '使用select字段查询出错！'
				}
			},
			/**
			 * 获取数据
			 */
			getPageData() {
				this.loading = true;
				try {
					var data = this.apiData;
					data["pageNumber"] = this.currPage
					data["pageSize"] = this.pageSize;
					this.pageInfo = {};
					this.$api[this.apiName](data).then(res => {
						if (res.data == undefined) {
							return;
						}
						res = res.data;
						this.showPageHelpers = !(res instanceof Array);
						if (this.showPageHelpers) {
							this.currPage = res.pageNum;
							this.total = res.total;
							this.listData = res.list;
						} else {
							this.listData = res;
						}
						this.selectChecBox();
						//计算select所直线的后台服务数据
						this.$nextTick(() => {
							this.getSelectAfterList();
						})
						if (typeof this.changeList == "function") {
							this.listData = this.changeList(this.listData);
						}
						this.loading = false;
						setTimeout(() => {
							this.doLayout();
						}, 200);
						this.$nextTick(() => {
							try {
								this.$refs.elTable.doLayout()
							} catch (e) {
								//TODO handle the exception
							}
						})
					});
				} catch (e) {
					//TODO handle the exception
					this.listData = [];
					this.loading = false;
				}
			},
			btnClick(e, query) {
				e.query = query;
				this.$emit("btnClick", e);
			},
			doLayout() {
				this.$nextTick(() => {
					try {
						this.$refs.elTable.doLayout()
					} catch (e) {
						//TODO handle the exception
					}
				})
			},
			setListData(form) {
				this.listData = form;
			},
			/**
			 * 设置checkBox选中值
			 */
			selectChecBox() {
				if (this.tableType != 'checkbox') {
					return;
				}
				if (this.checkList && this.checkList.length > 0) {
					this.$refs.elTable.data.map(r => {
						this.checkList.map(item => {
							if (r.id == item.id) {
								this.$refs.elTable.toggleRowSelection(r, true);
							}
						});
						if (r.children && r.children.length > 0) {
							r.children.map(ch => {
								this.checkList.map(item => {
									if (ch.id == item.id) {
										this.$refs.elTable.toggleRowSelection(ch, true);
									}
								});
							})
						}
					})
				} else {
					this.$refs.elTable.data.forEach(item => {
						//如果数据中的paid == 1的话 让这一列选中
						this.$refs.elTable.toggleRowSelection(item, false);
						if (item.children && item.children.length > 0) {
							item.children.map(ch => {
								this.$refs.elTable.toggleRowSelection(ch, false);
							})
						}
					})
				}
			},
			/**
			 * 计算选中数据
			 * @param {Object} val
			 */
			changeCheckBoxValue(val) {
				this.$emit("checkbox", {
					data: this.$refs.elTable.data,
					selection: this.$refs.elTable.selection
				});
			},
			/*注意在获取初始数据时，所有节点（包括子节点）都增加一个isChecked 标志参数*/
			rowSelect(selection, row) {
				if (row.children) { //只对有子节点的行响应
					if (!row.isChecked) { //由行数据中的元素isChecked判断当前是否被选中
						row.children.map((item) => { //遍历所有子节点
							this.$refs.elTable.toggleRowSelection(item, true); //切换该子节点选中状态
							/*
							方法名                    说明                                      参数
							                     用于多选表格，切换某一行的选中状态，         row, selected
							toggleRowSelection   如果使用了第二个参数，则是设置这一行
							                     选中与否（selected 为 true 则选中）
							 */
							item.isChecked = true;
						});
						row.isChecked = true; //当前行isChecked标志元素切换为false
					} else {
						row.children.map((item) => {
							this.$refs.elTable.toggleRowSelection(item, false);
							item.isChecked = false;
						});
						row.isChecked = false;
					}
				}
				// this.$emit("checkbox", this.$refs.elTable.selection);
			},
			selectAll(selection) {
				// selection 是选中的数据集合
				this.$refs.elTable.data.map((items) => { //使用$ref获取注册的子组件信息，用data获取所有行，并用map函数遍历行
					if (items.children) {
						if (!items.isChecked) { //若遍历出来的行未选中
							this.$refs.elTable.toggleRowSelection(items, true); //行变为选中状态
							items.isChecked = true; //更新标志参数
							items.children.map((item) => { //遍历子节点并改变状态与标志参数
								this.$refs.elTable.toggleRowSelection(item, true);
								item.isChecked = true;
							});
						} else { //选中状态同理
							this.$refs.elTable.toggleRowSelection(items, false);
							items.isChecked = false;
							items.children.map((item) => {
								this.$refs.elTable.toggleRowSelection(item, false);
								item.isChecked = false;
							});
						}
					} else {
						if (!items.isChecked) items.isChecked = true;
						else items.isChecked = false;
					}
				});
				// this.$emit("checkbox", this.$refs.elTable.selection);
			}

		},
		created() {
			if (this.isInitData) {
				this.$nextTick(() => {
					window.doLayout = this.doLayout;
					this.getPageData();
				})
				window.getPageData = this.getPageData;
			}
			setTimeout(() => {

			}, 1000);
			//
		}
	};
</script>
<style>
	.el-table td,
	.el-table th {
		width: auto !important;
	}

	.el-table td:first-child .cell,
	.el-table--border td:first-child .cell,
	.el-table--border th:first-child .cell {
		padding-left: 10px;
		display: flex !important;
		justify-content: flex-start !important;
	}

	.el-table.checkbox .el-table__body td:nth-child(2) .cell {
		padding-left: 10px;
		display: flex !important;
		justify-content: flex-start !important;
	}

	.el-table.checkbox-expand .el-table__body td:nth-child(3) .cell {
		padding-left: 10px;
		display: flex !important;
		justify-content: flex-start !important;
	}


	.el-table--striped .el-table__body tr.el-table__row--striped td {
		background: #FAFAFA
	}
</style>
