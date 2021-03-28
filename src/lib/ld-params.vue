<template>
	<div>
		<div class="c10 a-i-c f-s p2 el-input__inner">
      <el-button type="primary" plain size="mini" @click="addItem">添加一行</el-button>
		</div>
		<div class="box-b p2">
			<template v-if="Array.isArray(params)">
				<template v-for="(item ,i) in  params">
					<input v-model="params[i]" class="el-input__inner color3 fs14 over-h-y" placeholder="请输入参数值"
						placeholder-class="c10" :key="i" @input="confirmItem" @change="confirmItem" />
				</template>
			</template>
			<template v-else>
				<template v-for="(item,i) in  keyList">
					<div class="f-s m-b2" :key="i">
						<el-input v-model="keyList[i]"
							class=" color3 fs14 over-h-y w-200" placeholder="请输入键"
							placeholder-class="c10" @input="confirmItem" @change="confirmItem"  />
						<el-input v-model="valueList[i]" class="color3 fs14 over-h-y" placeholder="请输入参数值"
							placeholder-class="c10" @input="confirmItem" @change="confirmItem"  />
					</div>
				</template>
			</template>
		</div>
	</div>
</template>

<script>
	export default {
		name:'ld-params',
		props: {
			type: {
				type: String,
				default: 'array'
			},
			param: {
				type: [Object, Array,String],
				default: () => {
					return [];
				}
			},

		},
		watch: {
			param(news) {
				this.params = news;
			},
			type(news) {
				if (news.toLowerCase() == 'array') {
					this.param = !this.param ? [] : this.param;
				} else {
					this.param = !this.param ? {} : this.param;
				}
			}
		},
		data() {
			return {
				params: this.param,
				keyList:Object.keys(this.param)||[],
				valueList:Object.values(this.param)||[],
			};
		},
		methods: {
			getParams() {
				if ((this.params && Array.isArray(this.params) && this.params.length > 0) || (this.params && !Array
						.isArray(this.params) && Object.keys(this.params).length > 0)) {
					return true; //JSON.stringify(this.params);
				}
				return false; // '暂未设计数据'
			},
			addItem() {
				if (this.type.toLowerCase() == 'array') {
					this.params = this.params || [];
					this.$set(this.params, this.params.length, null);
				} else {
					this.$set(this.keyList, this.keyList.length, null);
					this.$set(this.valueList, this.valueList.length, null);
				}
			},
			confirmItem() {
				let params = this.params;
				if (this.type.toLowerCase() == 'array') {
					params = params.filter(item => item);
				}else{
					for(let i=0;i<this.keyList.length;i++){
						this.$set(this.params,this.keyList[i],this.valueList[i])
					}
				}
				this.$emit("params", params);
			}
		}
	}
</script>

<style>

</style>
