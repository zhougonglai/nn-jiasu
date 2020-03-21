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

	async geetest() {
		return await this.request.post('tools/captcha/geetest/config');
	}
}
