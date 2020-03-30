<template>
	<!-- 温馨提示模块组件 -->
	<div class="recharge-warm-prompt">
		<div class="wrap-prompt-content">
			<h1>温馨提示</h1>
			<p>1.雷神NN加速器账号可在电脑、手机同时登录，且手机端可免费使用；</p>
			<p>
				2.用户可根据自己游戏时间安排，通过电脑客户端使用加速器时间暂停和恢复功能；
			</p>
			<p>
				3.因地区、宽带运营商、用户本地网络波动等不可抗因素，雷神无法保证每个加速器用户网络延迟时间一致，请测试确认后再购买,因此雷神不支持退款。
			</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	created() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.recharge-warm-prompt {
	width: 100%;
	padding: 20px 0;
	.wrap-prompt-content {
		h1,
		p {
			font-size: 12px;
			font-family: Source Han Sans CN;
			font-weight: 400;
			line-height: 20px;
			color: rgba(255, 255, 255, 1);
			opacity: 0.6;
		}
	}
}
</style>
