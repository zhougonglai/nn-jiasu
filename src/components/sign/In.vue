<template lang="pug">
#sign-in
  form.form.border(novalidate)
    .form-contrl
      label(for="phone")
        svg-icon.form-icon(name="phone")
      country-code.form-contrl__before(v-model="sign.country_code")
      input#phone.form-input(type="tel" placeholder="手机号" v-model.number.trim="sign.mobile_num")
      i.form-clear.el-icon-error(@click="sign.mobile_num = ''")
    .form-contrl
      label(for="pwd")
        svg-icon.form-icon(name="lock")
      input#pwd.form-input(type="tel" placeholder="密码" v-model.trim="sign.password")
      i.form-clear.el-icon-error(@click="sign.password = ''")
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
        router-link.dropdown-menu(:to="{name:'Sign', params: { type: 'by_verify'}}") 短信验证登录
        router-link.dropdown-menu(:to="{name:'Sign', params: { type: 'account'}}") NN号/邮箱号登录
</template>
<script>
import SignService from '@services/sign';

const signService = new SignService();

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
	components: {
		CountryCode: () => import('@components/sign/CountryCode.vue'),
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
			await signService.login(this.sign);
		},
	},
};
</script>
