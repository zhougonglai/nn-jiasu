<template lang="pug">
#sign-up
  form.form.border(novalidate)
    .form-contrl
      label(for="phone")
        svg-icon.form-icon(name="phone")
      input#phone.form-input.with-pre(type="tel" placeholder="手机号" v-model.number.trim="sign.mobile_num")
      i.form-clear.el-icon-error(@click="sign.mobile_num = ''")
    .form-contrl
      label(for="pwd")
        svg-icon.form-icon(name="lock")
      input#pwd.form-input.with-pre(type="tel" placeholder="密码" v-model.trim="sign.password")
      i.form-clear.el-icon-error(@click="sign.password = ''")
  el-button(type="primary" class="mt-2 full-width") 注册
</template>
<script>
import SignService from '@/services/sign';

const signService = new SignService();

export default {
	name: 'SignUp',
	data() {
		return {
			confirm: true,
			verifyed: false,
			sign: {
				country_code: 86,
				mobile_num: '',
				state: 2,
				password: '',
				server_status: '',
				smscode: '',
				smscode_key: '',
			},
			geetest: {
				geetest_challenge: '',
				geetest_validate: '',
				geetest_seccode: '',
			},
		};
	},
	async mounted() {
		const { data } = await signService.geetest();
		console.log(data);
	},
	created() {
		this.geetest = require('@/utils/gt');
	},
};
</script>
