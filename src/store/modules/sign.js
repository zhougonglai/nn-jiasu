import { unionBy } from 'lodash';
import Request from '@utils/request';

const types = chat => Symbol(`SIGN_${chat}`).toString();

const state = {
	top_country: [],
	list_country: [],
};

const getters = {
	countryGroups: state =>
		unionBy(state.list_country, 'group').map(country => country.group),
	countryByGroup: state => group => keyword =>
		state.list_country
			.filter(country => country.group === group)
			.filter(
				country =>
					new String(country.code).includes(keyword) ||
					country.group === keyword.toUpperCase() ||
					country.iso_code.includes(keyword.toLocaleLowerCase()) ||
					country.name.includes(keyword),
			),
	filterTopCountry: state => keyword =>
		state.top_country.filter(
			country =>
				new String(country.code).includes(keyword) ||
				country.group === keyword.toUpperCase() ||
				country.iso_code.includes(keyword.toLocaleLowerCase()) ||
				country.name.includes(keyword),
		),
};

const actions = {
	async getCountryCodes({ commit }) {
		const request = new Request('https://jiasu.nn.com/');
		const { data } = await request.get('geoip2/country_codes.json', {
			lang: navigator.language,
		});
		commit(types('COUNTRY_CODE'), data);
		return data;
	},
};

const mutations = {
	[types('COUNTRY_CODE')](state, { top_country, list_country }) {
		state.top_country = top_country;
		state.list_country = list_country;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
