import Request from '@utils/request';

export default class SpeechSoundService {
	constructor() {
		this.request = new Request(
			process.env.VUE_APP_NN_API + process.env.VUE_APP_NN_NAMESPACE,
		);
	}

	async getConfig() {
		return await this.request.post('/yuewan/config');
	}
}
