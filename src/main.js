import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import '@plugins/index';
import '@styles/global.scss';

Vue.config.productionTip = false;

new Vue({
	data() {
		return {
			production: process.env.NODE_ENV === 'production',
		};
	},
	router,
	store,
	render: h => h(App),
}).$mount('#app');
