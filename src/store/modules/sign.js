import { unionBy } from 'lodash';
import JiaSuService from '@services/jiasu';

const jiasuService = new JiaSuService();

const types = chat => Symbol(`SIGN_${chat}`).toString();

const state = {
	top_country: [],
	list_country: [],
	geoip: {},
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
		const { data } = await jiasuService.countryCodes();
		commit(types('COUNTRY_CODE'), data);
		return data;
	},
	async getGeoip({ commit }) {
		const { data } = await jiasuService.geoip();
		commit(types('GEO_IP'), data);
		return data;
	},
};

const mutations = {
	[types('COUNTRY_CODE')](state, { top_country, list_country }) {
		state.top_country = top_country;
		state.list_country = list_country;
	},
	[types('GEO_IP')](state, data) {
		state.geoip = data;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
