import Request from '@utils/request';

export default class SignService {
	constructor() {
		this.request = new Request(process.env.VUE_APP_BASE);
	}

	async login(sign) {
		await this.request.post('api/login', sign);
	}

	async register(sign) {
		await this.request.post('api/register', sign);
	}
}
