<template lang="pug">
#sign-account
  form.form.border
    .form-contrl
      label(for="username")
        svg-icon.form-icon(name="user")
      input#username.form-input(type="email" autocomplete="emall" placeholder="NN号/邮箱号" v-model.trim="sign.username")
    .form-contrl
      label(for="pwd")
        svg-icon.form-icon(name="lock")
      input#pwd.form-input(type="password" autocomplete="current-password" placeholder="密码" v-model="sign.password")
  .flex.full-width.my-2
    el-checkbox(v-model="remember") 记住我
    .spacer
    el-checkbox(v-model="autologin") 自动登录
  button.btn.block(@click="login") 立即登录
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
        router-link.dropdown-menu(:to="{name:'Sign', params: { type: 'in'}, query: $route.query}") 手机号登录
        router-link.dropdown-menu(:to="{name:'Sign', params: { type: 'by_verify'}, query: $route.query}") 短信验证登录
</template>
<script>
import SignService from '@/services/sign';
import md5 from 'js-md5';
const signService = new SignService();

export default {
	name: 'SignAccount',
	data() {
		return {
			remember: true,
			autologin: true,
			dropdown: 0,
			sign: {
				username: '',
				password: '',
			},
		};
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
			await signService.login({
				...this.sign,
				password: md5(this.sign.password),
			});
		},
	},
};
</script>
<style lang="scss" scoped>
#sign-account {
}
</style>
