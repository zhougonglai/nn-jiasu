import Request from '@utils/request';

export default class SignService {
	constructor() {
		this.request = new Request(process.env.VUE_APP_BASE);
	}

	async login(sign) {
		return await this.request.post('api/login', sign);
	}

	async register(sign) {
		return await this.request.post('api/register', sign);
	}

	async smscode(data) {
		return await this.request.post('tools/send/smscode', data);
	}

	async validate(data) {
		return await this.request.post('tools/validate/sms', data);
	}

	async loginByCode(sign) {
		return await this.request.post('api/login/mobile', sign);
	}

	async signBind(sign) {
		return await this.request.post('api/open/bind', sign);
	}

	async forgotPassword(sign) {
		return await this.request.post('api/password/forgot', sign);
	}

	async geetest() {
		return await this.request
			.post('tools/captcha/geetest/config')
			.then(res => res.data);
	}
}
