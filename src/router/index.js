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
		],
	},
	{
		path: '/sign',
		component: () =>
			import(/* webpackChunkName: 'layout.Sign' */ '@layouts/Sign.vue'),
		children: [
			{
				path: ':type',
				props: true,
				name: 'Sign',
				component: () =>
					import(/* webpackChunkName: 'page.sign' */ '@pages/Sign.vue'),
			},
		],
	},
	{
		path: '/speechSound',
		component: () => import('@/pages/SpeechSound.vue'),
	},
	{
		path: '/recharge',
		component: () => import('@/pages/Recharge.vue'),
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
