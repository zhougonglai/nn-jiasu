import Request from '@utils/request';

export default class JiaSuService {
	constructor() {
		this.requset = new Request('https://jiasu.nn.com/geoip2/');
	}

	async geoip() {
		return await this.requset.get('index.php', {
			lang: navigator.language,
		});
	}

	async countryCodes() {
		return await this.requset.get('country_codes.json', {
			lang: navigator.language,
		});
	}
}
