<template lang="pug">
  #sign-in
    form.form.border(novalidate)
      .form-contrl
        label(for="phone")
          svg-icon.form-icon(name="phone")
        input#phone.form-input.with-pre(type="tel" placehodle="手机号" v-model.number.trim="sign.mobile_num")
        i.form-clear.el-icon-error(@click="sign.mobile_num = ''")
      .form-contrl
        label(for="pwd")
          svg-icon.form-icon(name="lock")
        input#pwd.form-input.with-pre(type="tel" placehodle="密码" v-model.trim="sign.password")
        i.form-clear.el-icon-error(@click="sign.password = ''")
</template>
<script>
export default {
	name: 'SignIn',
	data() {
		return {
			remember: true,
			autologin: true,
			sign: {
				country_code: 86,
				mobile_num: '',
				password: '',
			},
			dropdown: 0,
		};
	},
	mounted() {
		console.log(process.env);
	},
};
</script>
