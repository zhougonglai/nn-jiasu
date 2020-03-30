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
		account: () => import('@components/sign/Account.vue'),
		bind: () => import('@components/sign/Bind.vue'),
		forget_password: () => import('@components/sign/ForgetPassword.vue'),
		by_verify: () => import('@components/sign/Verify.vue'),
	},
	mounted() {
		console.log(this.$route.query);
	},
};
</script>
<style lang="scss" scoped>
#sign-form {
}
</style>
