<template>
	<div class="position-relative">
		<div class="">
			<div class="el-input el-input__inner f-b" @click="dialog=!dialog" @blur="changeEvent" @focus="changeEvent">
				<div class="ellipsis align-items-center">
					<div v-if="icon" class="fs20 p-18 " :class="icon"></div>
					<div class="color8 fs14">{{!icon?'点击选择图标':icon}}</div>
				</div>
				<div v-if="clearable">
					<i class="el-icon-circle-close color9" @click.stop="icon=''"></i>
				</div>
			</div>
		</div>
		<el-dialog class="id-dialog" title="选择图标" :visible.sync="dialog" width="800px" :append-to-body="true">
			<div class="w over-h-y h box-b" style="height: calc(100% - 40px);">
				<div class="tip-p b-p1 w h-40 box-b f-s a-i-c">
					<div class="f-n-c-w c8">鼠标单击选中，双击选择并退出！</div>
					<el-input v-model="search" placeholder="输入内容快速检索" clearable size="small" style="min-width: 200px;">
						<template slot="prepend">
							<i class="el-icon-search"></i>
						</template>
					</el-input>
					<div class="f-n-c-w w-300 f-s a-i-c">
						<span v-if="icon" class="f-b-w c10 fs24 m4">|</span>
						<div v-if="icon" class=" b-d2 r2 f-s a-i-c p2 p-l4 p-r4">
							<i class="icon-item fs20 p-r2" :class="icon"></i>
							<span class="fs color6 icon-item p0" style="height: 10px;line-height: 10px;">{{icon}}</span>
						</div>
					</div>
				</div>
				<div class="w f-s-w over-a-y box-b over-h-x" style="max-height: calc(100% - 40px);">
					<div v-if="item.indexOf(search)>=0" v-for="(item,i) in iconList" :key="i"
						@dblclick.stop="dialog=!dialog" @click="checkIcon(item)" class="m8 icon-item"
						style="width: auto;cursor: pointer;">
						<div class="t-c l-h40" style="min-width: 40px;height: 40px;"><i class="fs24" :class="item"></i>
						</div>
						<div class="fs color6 icon-item p0" style="height: 10px;line-height: 10px;">{{item}}</div>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'ld-icon',
		props: {
			readonly: {
				type: Boolean,
				default: false,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			value: {
				type: String,
				default: ''
			},
			showDialog: {
				type: Boolean,
				default: false,
			},
			clearable: {
				type: Boolean,
				default: true,
			}
		},
		watch: {
			value(news) {
				this.icon = news;
			},
			showDialog(news) {
				this.dialog = news;
			},

		},
		data() {
			return {
				search: '',
				dialog: this.showDialog,
				icon: this.value,
				iconList: this.$ld.resource.iconList.resource.concat("el-xxxx")
			}
		},
		methods: {
			changeEvent() {
				debugger
				this.$emit("change", this.icon);
			},
			checkIcon(item) {
				this.icon = item;
				this.$emit("icon", this.icon);
			}
		}
	}
</script>

<style>
	.icon-item:hover {
		color: #03A9F4;
	}

	.icon-dialog {
		min-width: 500px!important;
	}
</style>
