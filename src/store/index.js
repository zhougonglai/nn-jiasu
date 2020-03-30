import Vue from 'vue';
import Vuex from 'vuex';
import sign from './modules/sign';
import recharge from './modules/recharge';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		sign,
		recharge,
	},
});
