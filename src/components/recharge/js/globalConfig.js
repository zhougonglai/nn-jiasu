export default class GlobalConfig {
	constructor() {
		/**
		 * 配置文件路径
		 */
		this.RECHARGE_JSON = 'config/package.json' + '?t=' + new Date().valueOf();
	}
	getWebBaseUrl() {
		const isProd = () => process.env.NODE_ENV === 'production';
		// this.server_type = this.checkEnv();
		// if (this.server_type === 1) {
		//   // 开发环境
		//   return "http://dev-jiasu.nn.com";
		// } else if (this.server_type === 2) {
		//   // 测试环境
		//   return "http://test-www.leigod.com";
		// } else if (this.server_type === 3) {
		//   // 生产环境
		//   return "https://jiasu.nn.com";
		// } else if (this.server_type === 4) {
		//   // 验证环境
		//   return "https://vf-jiasu.nn.com";
		// } else {
		//   return "";
		// }
		if (!isProd()) {
			return 'http://dev-jiasu.nn.com';
		} else {
			return 'https://vf-jiasu.nn.com';
		}
	}
}
