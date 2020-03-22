export default class Request {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
		this.controller = new AbortController();
	}

	get(path, params, config) {
		const { signal } = this.controller;
		return fetch(
			this.baseUrl + path + '?' + new URLSearchParams(params).toString(),
			{
				signal,
				...config,
			},
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
			signal,
			...config,
		}).then(this.check);
	}

	put(path, formData, config) {
		const { signal } = this.controller;
		return fetch(this.baseUrl + path, {
			method: 'PUT',
			body: formData,
			signal,
			...config,
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
