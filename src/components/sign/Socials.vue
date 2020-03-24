<template lang="pug">
#socials
  svg-icon.pointer(name="QQ")
  svg-icon.pointer.mx-2(name="wechat" @click.native="signByWeChat")
  svg-icon.pointer.fill-red(name="weibo")
</template>
<script>
export default {
	name: 'socials',
	methods: {
		signByWeChat() {
			const uri = 'http://dev-api-box.nn.com/api/open/wx';
			const url = new URL(
				`https://open.weixin.qq.com/connect/qrconnect?appid=wx7d4318874157b0ea&redirect_uri=${uri}&response_type=code&scope=snsapi_login&state=1_1_0_1&connect_redirect=1#wechat_redirect`,
			);
			window.open(url, '_self');
		},
	},
};
</script>
<style lang="scss" scoped>
#socials {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
