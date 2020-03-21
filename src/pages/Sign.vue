<template lang="pug">
keep-alive
	component(:is="type")
</template>
<script>
export default {
	name: 'Sign',
	props: ['type'],
	components: {
		in: () => import('@components/sign/In.vue'),
		up: () => import('@components/sign/Up.vue'),
	},
};
</script>
<style lang="scss" scoped>
#sign-form {
}
</style>
