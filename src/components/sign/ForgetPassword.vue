<template lang="pug">
#forget-password
  form.form.border(novalidate)
    .form-contrl.with-before
      label(for="phone")
        svg-icon.form-icon(name="phone")
      country-code.form-contrl__before(v-model="sign.country_code")
      input#phone.form-input(type="tel" placeholder="手机号" v-model.number.trim="sign.mobile_num")
      i.form-clear.el-icon-error(@click="sign.mobile_num = ''")
    .form-contrl.with-after
      label(for="smscode")
        svg-icon.form-icon(name="safe")
      input#smscode.form-input(type="tel" autocomplete="off" placeholder="验证码" v-model.trim="sign.smscode")
      el-button.mr-1(type="text" size="mini" @click="sendSmscode") 发送验证码
      .verify.pointer(v-if="!verifyed" @click="verify")
        .bubble
        | 点击按钮进行验证
    .form-contrl(v-if="verifyed")
      label(for="pwd")
        svg-icon.form-icon(name="lock")
      input#pwd.form-input(type="password" placeholder="密码" v-model.trim="sign.password")
      i.form-clear.el-icon-error(@click="sign.password = ''")
  button.btn.block.mt-4(@click="reset") 重置密码
  .full-width.text-center.mt-2
    router-link.tap(:to="{name:'Sign', params: { type: 'in'}}") 返回登录
</template>
<script>
import SignService from '@/services/sign';
import md5 from 'js-md5';
const signService = new SignService();

export default {
	name: 'ForgetPassword',
	components: {
		CountryCode: () => import('./CountryCode'),
	},
	data() {
		return {
			verifyed: false,
			sign: {
				country_code: 86,
				mobile_num: '',
				state: 1,
				smscode: '',
				smscode_key: '',
				password: '',
				server_status: '',
			},
			sendCodeContrl: {
				sending: false,
				time: 60,
				timer: 0,
			},
			geetest: {
				geetest_challenge: '',
				geetest_validate: '',
				geetest_seccode: '',
			},
		};
	},
	methods: {
		verify() {
			this.captcha.verify();
		},
		async sendSmscode() {
			const { code, msg, data } = await signService.smscode({
				...this.sign,
				...this.geetest,
			});
			if (code) {
				this.error.msg = msg;
				this.error.status = code;
			} else {
				this.sign.smscode_key = data.smscode_key;
			}
		},
		async reset() {
			await signService.forgotPassword({
				...this.sign,
				password: md5(this.sign.password),
			});
		},
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
