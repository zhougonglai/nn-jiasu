import Vue from 'vue';
const componentFiles = require.context('@components/global', true, /\.vue$/);
componentFiles.keys().forEach(file => {
	let componentName = file
		.replace(/^\.\/(.*)(\.vue)$/, '$1')
		.replace(/[A-Z]/g, (matchStr, i) => {
			let lowerStr = matchStr.toLowerCase();
			i && (lowerStr = '-' + lowerStr);
			return lowerStr;
		});
	let component = componentFiles(file);
	Vue.component(componentName, component.default || component);
});
