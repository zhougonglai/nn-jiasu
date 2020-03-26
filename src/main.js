import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import '@plugins/index';
import '@styles/global.scss';
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
	render: h => h(App),
}).$mount('#app');
