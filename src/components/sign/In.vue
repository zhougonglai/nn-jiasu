<template lang="pug">
#sign-in
  small.error(v-if="error.status" v-text="error.msg")
  form.form.border(novalidate)
    .form-contrl
      label(for="phone")
        svg-icon.form-icon(name="phone")
      country-code.form-contrl__before(v-model="sign.country_code")
      input#phone.form-input(type="tel" placeholder="手机号" v-model.number.trim="sign.username")
      i.form-clear.el-icon-error(v-if="sign.username" @click="sign.username = ''")
    .form-contrl
      label(for="pwd")
        svg-icon.form-icon(name="lock")
      input#pwd.form-input(type="password" placeholder="密码" v-model.trim="sign.password")
      i.form-clear.el-icon-error(v-if="sign.password" @click="sign.password = ''")
  .flex.full-width.my-2
    el-checkbox(v-model="remember") 记住我
    .spacer
    el-checkbox(v-model="autologin") 自动登录
  button.btn.block(@click="login") 登陆
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
        router-link.dropdown-menu(:to="{name:'Sign', params: { type: 'by_verify'}, query: $route.query}") 短信验证登录
        router-link.dropdown-menu(:to="{name:'Sign', params: { type: 'account'}, query: $route.query}") NN号/邮箱号登录
  Socials
</template>
<script>
import SignService from '@services/sign';
import md5 from 'js-md5';
const signService = new SignService();

export default {
	name: 'SignIn',
	data() {
		return {
			remember: true,
			autologin: true,
			error: {
				status: false,
				msg: '',
			},
			sign: {
				country_code: 86,
				user_type: 0,
				username: '',
				password: '',
			},
			dropdown: 0,
		};
	},
	components: {
		CountryCode: () => import('@components/sign/CountryCode.vue'),
		Socials: () => import('./Socials.vue'),
	},
	methods: {
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
		async login() {
			const { code, msg, data } = await signService.login({
				...this.sign,
				username: this.sign.username.toString(),
				password: md5(this.sign.password),
			});
			if (code) {
				this.error.msg = msg;
				this.error.status = code;
			} else {
				localStorage.config = JSON.stringify({
					autologin: this.autologin,
					remember: this.remember,
				});
				if (this.remember) {
					if (window.PasswordCredential) {
						const { nickname, avatar } = data.user_info;
						const passwordCredential = await navigator.credentials.create({
							password: {
								id: this.sign.username,
								name: nickname,
								iconURL: 'https:' + avatar,
								password: this.sign.password,
							},
						});
						navigator.credentials.store(passwordCredential);
					} else {
						localStorage.sign = JSON.stringify(this.sign);
					}
				}
				if (this.$root.production) {
					const message = {
						operation: 'afterlogin',
						data,
					};
					window.NimCefWebInstance.call('CallNativeFun', { message }, () => {
						window.NimCefWebInstance.call('CallNativeFun', {
							message: {
								operation: 'close',
							},
						});
					});
				}
			}
		},
	},
	async created() {
		if (localStorage.config) {
			const { autologin, remember } = JSON.parse(localStorage.config);
			if (remember) {
				if (window.PasswordCredential) {
					const { id, password } = await navigator.credentials.get({
						password: true,
					});
					this.sign.username = id;
					this.sign.password = password;
				} else {
					const { country_code, username, password } = JSON.parse(
						localStorage.sign,
					);
					this.sign.country_code = country_code;
					this.sign.username = username;
					this.sign.password = password;
				}

				if (autologin) {
					this.login();
				}
			}
		}
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
#sign-in {
	position: relative;
}
</style>
