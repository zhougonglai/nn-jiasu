import Request from '@utils/request';

export default class SignService {
	constructor() {
		// TODO: env 被服务器ignore了
		this.request = new Request(
			process.env.NODE_ENV === 'production'
				? 'http://dev-api1.leigod.com'
				: process.env.VUE_APP_NN_API + process.env.VUE_APP_NN_NAMESPACE,
		);
	}

	async login(sign) {
		return await this.request.encrypt('/client/login', sign);
	}

	async register(sign) {
		return await this.request.post('/api/auth/register', sign);
	}

	async package(sign) {
		return await this.request.post('/api/auth/register/package', sign);
	}

	async smscode(data) {
		return await this.request.post('/tools/smscode', data);
	}

	async validate(data) {
		return await this.request.post('/tools/validate/sms', data);
	}

	async loginByCode(sign) {
		return await this.request.post('/api/login/mobile', sign);
	}

	async signBind(sign) {
		return await this.request.post('/api/open/bind', sign);
	}

	async forgotPassword(sign) {
		return await this.request.post('/api/password/forgot', sign);
	}

	async geetest() {
		return await this.request
			.post('/tools/captcha/geetest/config')
			.then(res => res.data);
	}
}
