<template lang="pug">
#sign-up
  form.form.border(novalidate)
    .form-contrl
      label(for="phone")
        svg-icon.form-icon(name="phone")
      input#phone.form-input(type="tel" autocomplete="tel" placeholder="手机号" v-model.number.trim="sign.mobile_num")
      i.form-clear.el-icon-error(@click="sign.mobile_num = ''")
    .form-contrl.with-after
      label(for="smscode")
        svg-icon.form-icon(name="safe")
      input#smscode.form-input(type="tel" autocomplete="off" placeholder="验证码" v-model.trim="sign.smscode")
      el-button.mr-1(type="text" size="mini") 发送验证码
    .form-contrl
      label(for="pwd")
        svg-icon.form-icon(name="lock")
      input#pwd.form-input(type="password" autocomplete="current-password" placeholder="密码" v-model="sign.password")
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
		const {
			success,
			gt,
			challenge,
			server_status,
		} = await signService.geetest();
		if (success) {
			this.geetester.initGeetest(
				{
					gt,
					challenge,
					offline: !success,
					product: 'bind',
				},
				captcha => {
					this.captcha = captcha;
					this.sign.server_status = server_status;
					this.captcha.onSuccess(() => {
						this.verifyed = true;
						this.geetest = this.captcha.getValidate();
					});
				},
			);
		}
	},
	created() {
		this.geetester = require('@/utils/gt').default;
	},
};
</script>
