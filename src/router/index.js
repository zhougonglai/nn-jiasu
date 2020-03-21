import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		component: () =>
			import(/* webpackChunkName: 'layout.default' */ '@layouts/default.vue'),
		children: [
			{
				path: '',
				name: 'Home',
				component: () =>
					import(/* webpackChunkName: 'page.home' */ '@pages/Home.vue'),
			},
			{
				path: 'sign/:type',
				name: 'Sign',
				props: true,
				component: () =>
					import(/* webpackChunkName: 'page.Sign' */ '@pages/Sign.vue'),
			},
		],
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
