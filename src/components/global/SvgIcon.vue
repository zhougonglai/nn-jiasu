<template lang="pug">
	svg(:class="className")
		title(v-if="title") {{ title }}
		use(:xlink:href="iconPath")
</template>
<script>
export default {
	name: 'svg-icon',

	props: {
		name: {
			type: String,
			required: true,
		},

		title: {
			type: String,
			default: null,
		},
	},

	computed: {
		iconPath() {
			// return require(`@assets/icons/${this.name}.svg`).default;
			let icon = require(`@assets/icons/${this.name}.svg`);
			if (Object.prototype.hasOwnProperty.call(icon, 'default')) {
				icon = icon.default;
			}
			return icon.url;
		},
		className() {
			return 'svg-icon svg-icon--' + this.name;
		},
	},
};
</script>

<style>
.svg-icon {
	fill: currentColor;
	height: 24px;
	width: 24px;
}
</style>
