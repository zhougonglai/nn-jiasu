<template lang="pug">
#verify
	small.error(v-if="error.status" v-text="error.msg")
	form.form.border(novalidate)
		.form-contrl
			label(for="phone")
				svg-icon.form-icon(name="phone")
			country-code.form-contrl__before(v-model="sign.country_code")
			input#phone.form-input(type="tel" placeholder="手机号" v-model.number.trim="sign.mobile_num")
		.form-contrl.with-after
			label(for="smscode")
				svg-icon.form-icon(name="safe")
			input#smscode.form-input(type="tel" autocomplete="off" placeholder="验证码" v-model.trim="sign.smscode")
			el-button.mr-1(type="text" size="mini" @click="sendContrl" :disabled="!!sendCodeContrl.timer")
				| {{ sendCodeContrl.timer ? `(${sendCodeContrl.time})` : '发送验证码' }}
			.verify.pointer(v-if="!verifyed" @click="verify")
				.bubble
				| 点击按钮进行验证
	button.btn.block.mt-4(@click="login") 登陆
	.flex.full-width
		router-link.tap(:to="{name:'Sign', params: { type: 'forget_password'}}") 忘记密码
		.spacer
		router-link.tap(:to="{name:'Sign', params: { type: 'up'}}") 立即注册
	.flex.justify-content-center.my-2
		small.dropdown-link.text-lightgray(
			@click="showDropdown"
			@mouseover="showDropdown"
			@mouseleave="hideDropdown"
			v-click-outside="hideDropdownIm"
		) 其他登录方式 >
			.dropdown-menus.top(v-if="dropdown")
				router-link.dropdown-menu(:to="{name:'Sign', params: { type: 'in'}}") 手机号登录
				router-link.dropdown-menu(:to="{name:'Sign', params: { type: 'account'}}") NN号/邮箱号登录
</template>
<script>
import SignService from '@/services/sign';

const signService = new SignService();

export default {
	name: 'SignVerify',
	components: {
		CountryCode: () => import('@components/sign/CountryCode.vue'),
	},
	data() {
		return {
			dropdown: 0,
			verifyed: false,
			error: {
				status: false,
				msg: '',
			},
			sendCodeContrl: {
				sending: false,
				time: 60,
				timer: 0,
			},
			sign: {
				country_code: 86,
				mobile_num: '',
				state: 1,
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
	methods: {
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
		sendContrl() {
			if (!this.sendCodeContrl.timer) {
				this.sendCodeContrl.timer = setInterval(() => {
					if (this.sendCodeContrl.time > 0) {
						this.sendCodeContrl.time -= 1;
					} else {
						clearInterval(this.sendCodeContrl.timer);
						this.sendCodeContrl.timer = 0;
					}
				}, 1000);
				this.sendSmscode();
			}
		},
		verify() {
			this.captcha.verify();
		},
		async login() {
			await signService.loginByCode(this.sign);
		},
		showDropdown() {
			if (!this.dropdown) {
				this.dropdown = 1;
			} else {
				clearTimeout(this.dropdown);
			}
		},
		hideDropdown() {
			this.dropdown = setTimeout(this.hideDropdownIm, 650);
		},
		hideDropdownIm() {
			this.dropdown = 0;
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
#verify {
	position: relative;
}
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
</style>
