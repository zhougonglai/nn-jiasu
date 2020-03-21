const pkg = require('./package');
const webpack = require('webpack');
const path = require('path');

const isProd = () => {
	return process.env.NODE_ENV === 'production';
};

const resolve = dir => {
	return path.join(__dirname, './', dir);
};

const plugins = [];

if (isProd()) {
	const banner = new webpack.BannerPlugin({
		banner: `Current version ${
			pkg.version
		} and build time ${new Date().toString()}`,
	});
	plugins.push(banner, prerender);
}

module.exports = {
	transpileDependencies: ['vuetify'],

	devServer: {
		proxy: {
			'/baseUrl': {
				target: 'https://yuewanapi.nn.com/',
			},
		},
	},

	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: isProd(),
		// 开启 CSS source maps?
		sourceMap: isProd(),
	},

	configureWebpack: {
		resolve: {
			alias: {
				'@': resolve('src'),
				'@environments': resolve('src/environments.js'),
				'@share': resolve('src/share'),
				'@components': resolve('src/components'),
				'@layouts': resolve('src/layouts'),
				'@pages': resolve('src/pages'),
				'@plugins': resolve('src/plugins'),
				'@store': resolve('src/store'),
				'@router': resolve('src/router'),
				'@assets': resolve('src/assets'),
				'@styles': resolve('src/styles'),
				'@services': resolve('src/services'),
				'@utils': resolve('src/utils'),
			},
		},
		optimization: {
			splitChunks: {
				chunks: 'async',
				minSize: 30000,
				maxSize: 0,
				minChunks: 1,
				maxAsyncRequests: 5,
				maxInitialRequests: 3,
				automaticNameDelimiter: '~',
				name: true,
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
					},
					commons: {
						name: 'chunk-commons',
						test: resolve('src/components'), // 可自定义拓展你的规则
						minChunks: 3, // 最小公用次数
						priority: -15,
						reuseExistingChunk: true,
					},
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			},
		},
		plugins,
	},

	pwa: {
		name: '雷神加速器',
	},

	chainWebpack: config => {
		config.module
			.rule('svg-sprite')
			.use('svgo-loader')
			.loader('svgo-loader');
	},

	pluginOptions: {
		svgSprite: {
			dir: 'src/assets/icons',
			test: /\.svg$/,
			loaderOptions: {
				extract: true,
				spriteFilename: 'img/icons.[hash:8].svg', // or 'img/icons.svg' if filenameHashing == false
			},
			pluginOptions: {
				plainSprite: true,
			},
		},
	},
};
