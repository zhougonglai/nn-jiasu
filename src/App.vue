<template lang="pug">
	#app
		keep-alive
			router-view(v-if="$route.meta.keepAlive")
		router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
export default {
	name: 'App',
	created() {
		/* eslint-disable */
		console.log(this.$root.version, this.$root.date);
	},
};
</script>
<style lang="scss" scoped></style>
