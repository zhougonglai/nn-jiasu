import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import '@plugins/index';
import '@styles/global.scss';
import i18n from './i18n';
const pkg = require('../package');

Vue.config.productionTip = false;

new Vue({
	data() {
		return {
			production: process.env.NODE_ENV === 'production',
			version: pkg.version,
			date: new Date().toString(),
		};
	},

	router,
	store,
	i18n,
	render: h => h(App),
}).$mount('#app');
