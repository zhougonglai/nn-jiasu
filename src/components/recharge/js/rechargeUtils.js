export default class RechargeUtils {
	constructor() {
		/**
		 * 注：新增一种语言，需要同时修改
		 * i18n.config.json和language.config.json
		 */
		this.ZH_CN = 'zh_CN';
		this.EN = 'en';
		this.CN = 'cn'; //地址栏用的
	}
	/**
	 * 读取地址栏参数
	 * @param name
	 */
	getUrlParam(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg); //匹配目标参数
		if (r != null) return unescape(r[2]);
		return '';
	}

	/**
	 * 获取浏览器的语言
	 */
	getExplorerbLang() {
		var lang = navigator.language;
		if (lang == null) return null;
		lang = lang.substr(0, 2);
		if (lang == 'zh') {
			return this.ZH_CN;
		} else {
			return this.EN;
		}
	}

	/**
	 * 获取dommain，格式示例：.leigod.com
	 */
	getDomain() {
		const hostname = window.location.hostname;
		const hostList = hostname.split('.');
		let domain = '';
		for (let i = 1; i < hostList.length; i++) {
			domain = domain + '.' + hostList[i];
		}
		return domain;
	}
}
