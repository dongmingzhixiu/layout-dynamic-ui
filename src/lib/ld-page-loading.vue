<template>
	<div class="w h box-b" style="position: relative;"
		:style="{'z-index':loading?zIndex:1}">
		<template v-if="!$slots.loading">
			<div v-if="loadings" class="w h f-c align-items-center b-f" style="position: absolute;"
				:style="{'z-index':zIndex}">
				<div>
					<div class="w f-c el-icon-loading fs26 c-p"></div>
					<div class="p-t10 c-p" :style="{'opacity':`0.${opacity}`}">{{loadingTexts}}</div>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="box-b w h f-c align-items-center" style="position: absolute;top: 0;left: 0;">
				<slot name="loading"></slot>
			</div>
		</template>
		<div class="w h">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ld-page-loading',
		props: {
			/**
			 * css z-index的值
			 */
			zIndex: {
				type: Number,
				default: 1002
			},
			/**
			 * 是否加载
			 */
			loading: {
				type: Boolean,
				default: true
			},
			/**
			 * 加载文字
			 */
			loadingText: {
				type: String,
				default: '加载中......'
			}
		},
		watch: {
			loading(news) {
				this.loadings = news;
			},
			loadingText(news) {
				this.loadingTexts = news;
				this.createTextAnimal();
			}
		},
		data() {
			return {
				loadingTexts: this.loadingText,
				loadings: this.loading,
				textAnimal: null,
				opacity: 1,
			};
		},
		methods: {
			createTextAnimal() {
				let isAdd = true;
				if (!this.textAnimal && this.loadings) {
					this.textAnimal = setInterval(() => {
						this.opacity = isAdd ? (this.opacity + 1) : (this.opacity - 1);
						if (this.opacity >= 99) {
							isAdd = false;
						}
						if (this.opacity <= 1) {
							isAdd = true;
						}
					}, 20);
					return;
				}
				try {
					if (this.textAnimal)
						clearInterval(this.textAnimal);
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		created() {
			this.createTextAnimal();
		}
	}
</script>

<style>

</style>
