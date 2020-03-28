import Request from '@utils/request';

export default class SignService {
	constructor() {
		this.request = new Request(
			process.env.VUE_APP_BASE + process.env.VUE_APP_JIASU_NAMESPACE,
		);
	}

	async login(sign) {
		return await this.request.post('/api/auth/login', sign);
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
