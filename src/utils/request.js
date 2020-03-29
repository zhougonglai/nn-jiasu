import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

export default class Request {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}

	get(path, params, config) {
		return fetch(
			this.baseUrl + path + '?' + new URLSearchParams(params).toString(),
			config,
		).then(this.check);
	}

	post(path, body, config) {
		const { signal } = this.controller;
		return fetch(this.baseUrl + path, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json', // application/x-www-form-urlencoded
			},
			...config,
		}).then(this.check);
	}

	put(path, formData, config) {
		return fetch(this.baseUrl + path, {
			method: 'PUT',
			body: formData,
			...config,
		}).then(this.check);
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
