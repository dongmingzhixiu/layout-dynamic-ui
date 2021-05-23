<template>
	<div style="f-s">
		<div @click="setStyleProp('pink')">粉色恋人</div>
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
				if (Object.keys(_skins).length <= 0) {
					return;
				}
				Object.keys(_skins).map(key => {
					if (key == 'file') {
						require(`./ld-skins-${_skins[key]}`) ;
						// let cs=document.querySelector('#custom-style');
						// if(!cs){
						// 	document.querySelector("#app").innerHTML+=`<style id="custom-style">${ _skins[key]['html']}</style>`;
						// }else{
						// 	document.querySelector('#custom-style').innerHTML= _skins[key]['html'];
						// }

						return;
					}
					let el = key == 'root' ? document.documentElement : document.querySelector(key);
					let lists = _skins[key];
					Object.keys(lists).map(li => {
						el.style.setProperty(li, lists[li]);
					});
				})
			}
		}
	}
</script>

<style>
</style>
