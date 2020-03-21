import Request from '@utils/request';

export default class SignService {
	constructor() {
		this.request = new Request(process.env.BABEL_ENV);
	}
}
