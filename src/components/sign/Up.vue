<template lang="pug">
#sign-up
	small.error(v-if="error.status" v-text="error.msg")
	form.form.border(novalidate)
		.form-contrl.with-before
			label(for="phone")
				svg-icon.form-icon(name="phone")
			country-code.form-contrl__before(v-model="sign.country_code")
			input#phone.form-input(type="tel" autocomplete="tel" placeholder="手机号" v-model.number.trim="sign.mobile_num")
			i.form-clear.el-icon-error(v-if="sign.mobile_num" @click="sign.mobile_num = ''")
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
			input#pwd.form-input(type="password" autocomplete="current-password" placeholder="密码" v-model="sign.password")
			i.form-clear.el-icon-error(@click="sign.password = ''")
	.flex.full-width.mt-3
		el-checkbox(v-model="confirm") 已阅读并同意
		small.inline-flex.pointer.primary 《用户服务条款》
	button.mt-1.btn.block 注册
	.flex.align-items-center.justify-content-center.mt-2
		small.text-lightgray.mr-1 已有账号
		router-link.text-primary(:to="{name: 'Sign', params: { type: 'in'}}") 去登录
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
			error: {
				status: false,
				msg: '',
			},
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
	components: {
		CountryCode: () => import('./CountryCode'),
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
<style lang="scss" scoped>
small {
	line-height: 20px;
	&.error {
		color: red;
		position: absolute;
		left: 50%;
		bottom: 100%;
		transform: translateX(-50%);
	}
}
#sign-up {
	position: relative;
}
</style>
