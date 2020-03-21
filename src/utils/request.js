import md5 from 'js-md5';
const S4 = () =>
	(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
const guid2 = () =>
	S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();

const createSign = data => {
	const TIMESTAMP = Date.now();
	const NONCE = guid2();
	const SIGN = md5(
		md5(data + TIMESTAMP + NONCE) +
			`#${process.env.VUE_APP_API_SALT}#${TIMESTAMP}#${NONCE}`,
	);
	return {
		TIMESTAMP,
		NONCE,
		SIGN,
	};
};

export default class Request {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
		this.controller = new AbortController();
	}

	get(path, params) {
		const { signal } = this.controller;
		const { TIMESTAMP, NONCE, SIGN } = createSign(JSON.stringify(params));
		return fetch(
			this.baseUrl + path + '?' + new URLSearchParams(params).toString(),
			{
				signal,
				credentials: 'include',
				redirect: 'follow',
				headers: {
					'X-TIMESTAMP': TIMESTAMP,
					'X-NONCE': NONCE,
					'X-SIGN': SIGN,
				},
			},
		).then(this.check);
	}

	post(path, body) {
		const { signal } = this.controller;
		// const { TIMESTAMP, NONCE, SIGN } = createSign(JSON.stringify(body));
		return fetch(this.baseUrl + path, {
			method: 'POST',
			body: JSON.stringify(body),
			credentials: 'include',
			redirect: 'follow',
			headers: {
				'Content-Type': 'application/json', // application/x-www-form-urlencoded
				// 'X-TIMESTAMP': TIMESTAMP,
				// 'X-NONCE': NONCE,
				// 'X-SIGN': SIGN,
			},
			signal,
		}).then(this.check);
	}

	put(path, formData) {
		const { signal } = this.controller;
		const { TIMESTAMP, NONCE, SIGN } = createSign();
		return fetch(this.baseUrl + path, {
			method: 'PUT',
			body: formData,
			headers: {
				'X-TIMESTAMP': TIMESTAMP,
				'X-NONCE': NONCE,
				'X-SIGN': SIGN,
			},
			signal,
		}).then(this.check);
	}

	abort() {
		return this.controller.abort();
	}

	transform({ rtnCode, rtnInfo }) {
		if (rtnCode === '000') {
			return rtnInfo;
		} else {
			// bad response from server
		}
	}

	check(response) {
		if (response.ok) {
			return response.json();
		} else {
			// bad response
			const error = new Error(response.statusText);
			error.response = response;
			throw error;
		}
	}
}
