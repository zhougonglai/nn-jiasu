<template lang="pug">
	#app
		keep-alive
			router-view(v-if="$route.meta.keepAlive")
		router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
export default {
	name: 'App',
};
</script>
<style lang="scss" scoped></style>
