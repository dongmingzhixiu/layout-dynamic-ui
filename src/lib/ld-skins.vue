<template>
	<div>
		<div @click="setStyleProp('blue')">蓝色</div>
		<div @click="setStyleProp('dark')">深色</div>
	</div>
</template>

<script>
	export default {
		name: 'ld-skin',
		props: {
			visabled: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				visableds: this.visabled,
			}
		},
		methods: {
			setStyleProp(type) {
				let _skins = require(`./ld-skins-${type}`).default;
				if(Object.keys(_skins).length<=0){
					return;
				}
				Object.keys(_skins).map(key=>{
					 let el=key=='root'?document.documentElement:document.querySelector(key);
					 let lists=_skins[key];
					 Object.keys(lists).map(li=>{
						 el.style.setProperty(li,lists[li]);
					 });
				})
			}
		}
	}
</script>

<style>
</style>
