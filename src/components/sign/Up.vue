<template lang="pug">
#sign-up
	small.error(v-if="error.status" v-text="error.msg")
	form.form.border(novalidate)
		.form-contrl.with-before
			label(for="phone")
				svg-icon.form-icon(name="phone")
			country-code.form-contrl__before(v-model="sign.country_code")
			input#phone.form-input(type="tel" name="phone" autocomplete="tel" placeholder="手机号" v-model.number.trim="sign.phone")
			i.form-clear.el-icon-error(v-if="sign.mobile_num" @click="sign.mobile_num = ''")
		.form-contrl.with-after
			label(for="smscode")
				svg-icon.form-icon(name="safe")
			input#smscode.form-input(type="tel" name="code" autocomplete="off" placeholder="验证码" v-model.trim="sign.smscode")
			el-button.mr-1(type="text" size="mini" @click="sendContrl" :disabled="!!sendCodeContrl.timer")
				| {{ sendCodeContrl.timer ? `(${sendCodeContrl.time})` : '发送验证码' }}
			.verify.pointer(v-if="!verifyed" @click="verify")
				.bubble
				| 点击按钮进行验证
		template(v-if="verifyed")
			.form-contrl
				label(for="pwd")
					svg-icon.form-icon(name="lock")
				input#pwd.form-input(type="password" name="pwd" autocomplete="current-password" placeholder="密码" v-model="sign.password")
				i.form-clear.el-icon-error(@click="sign.password = ''")
			.form-contrl
				label(for="refer")
					i.el-icon-s-ticket.form-icon
				input#refer.form-input(type="text" name="refer_code" autocomplete='off' placeholder="推荐码(可为空)" v-model="sign.refer_code")
	.flex.full-width.mt-3
		el-checkbox(v-model="confirm") 已阅读并同意
		small.inline-flex.pointer.primary 《用户服务条款》
	button.mt-1.btn.block(@click="register") 注册
	.flex.align-items-center.justify-content-center.mt-2
		small.text-lightgray.mr-1 已有账号
		router-link.text-primary(:to="{name: 'Sign', params: { type: 'in'}, query: $route.query}") 去登录
</template>
<script>
import SignService from '@/services/sign';
import md5 from 'js-md5';
const signService = new SignService();
import { mapActions } from 'vuex';

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
			sendCodeContrl: {
				sending: false,
				time: 60,
				timer: 0,
			},
			sign: {
				country_code: 86,
				phone: '',
				state: 2,
				password: '',
				server_status: '',
				refer_code: '',
				smscode: '',
				smscode_key: '',
				package_id: '',
				price_id: '',
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
		async register() {
			const { code, msg } = await signService.register({
				register_type: this.sign.country_code === 86 ? 1 : 2,
				...this.sign,
				password: md5(this.sign.password),
			});
			if (code) {
				this.error.msg = msg;
				this.error.status = code;
			} else {
				this.$router.push({ name: 'Sign', params: { type: 'in' } });
			}
		},
		...mapActions('sign', ['getGeoip']),
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
	async created() {
		this.geetester = require('@/utils/gt').default;
		const { region_code } = await this.getGeoip();
		const { data } = await signService.package({ region_code, user_type: 0 });
		this.sign.package_id = data[0].package_id;
		this.sign.price_id = data[0].price[0].price_id;
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
