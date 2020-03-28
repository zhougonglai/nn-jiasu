import RechargeUtils from "@components/recharge/js/rechargeUtils";
const rechargeUtils = new RechargeUtils();
export default class LocalStorageUtil {
  constructor() {
    this.STORAGES_REGION_CODE = "region_code"; // 地区
    this.STORAGES_LANGUAGE_TYPE = "language_type"; //语言
    /**
     * 注：新增一种语言，需要同时修改
     * i18n.config.json和language.config.json
     */
    this.ZH_CN = "zh_CN";
    this.EN = "en";
    this.CN = "cn"; //地址栏用的

    /**
     * 来源
     */
    this.FROM_GUANWANG = "guanwang";

    this.REGION_CODE_0 = 0; // 国际
    this.REGION_CODE_1 = 1; // 国内
    this.REGION_CODE_INTL = "intl"; // 国际 英文简称

    /**
     * 会员
     */
    this.PACKAGE_LEVEL_0 = 0; // 黄金会员
    this.PACKAGE_LEVEL_1 = 1; // 铂金会员
    this.PACKAGE_LEVEL_2 = 2; // 钻石会员
    this.PACKAGE_LEVEL_100 = 100; // 计时
    this.PACKAGE_LEVEL_101 = 101; // 包月
    this.PACKAGE_LEVEL_200 = 200; // 超级会员
    this.PACKAGE_LEVEL_201 = 201; // 海外会员
    this.PACKAGE_LEVEL_202 = 202; // 网吧会员
    /**
     * localstorage
     */
    this.STORAGES_TOKEN = "account_token";
    this.STORAGES_OS_TYPE = "storages_os_type";
    this.STORAGES_THIRDBIND_URL_TYPE = "third_bind_url_type"; //第三方绑定来源页面 0用户中心  1登录页
    this.SRC_CHANNEL = "src_channel";
    this.STORAGES_USER_INFO = "user_info";
    this.UserToken = {
      account_token: "",
      expiry_time: ""
    };
  }
  /**
   * 保存用户token
   */
  addUserToken(token) {
    if (token.account_token == "") return;
    if (token.account_token == null || token.account_token == undefined)
      throw new Error("保存的token错误!");
    localStorage.setItem("account_token", JSON.stringify(token));
    this.setCookie(this.STORAGES_TOKEN, JSON.stringify(token), 2, true);
  }
  
  /**
   * 获取用户的token
   */
  getUserToken() {
    let token;
    token = this.getCookie(this.STORAGES_TOKEN);
    if (token == "") return this.UserToken;
    let userToken = JSON.parse(token);
    return userToken;
  }
  /**
   * 保存用户信息
   * @param userInfo
   */
  addUserInfo(userInfo) {
    localStorage.setItem(this.STORAGES_USER_INFO, JSON.stringify(userInfo));
    this.setCookie(this.STORAGES_USER_INFO, JSON.stringify(userInfo), -1, true);
  }

  /**
   * 获取保存的userInfo
   */
  getUserInfo() {
    let info;
    info =
      this.getCookie(this.STORAGES_USER_INFO) ||
      localStorage.getItem(this.STORAGES_USER_INFO);
    if (info == "") return null;
    let userInfo = JSON.parse(info);
    return userInfo;
  }
  /**
   * 保存地区信息
   */
  addRegionCode(code) {
    localStorage.setItem(this.STORAGES_REGION_CODE, code + "");
    this.setCookie(this.STORAGES_REGION_CODE, code + "", 24 * 7, true);
  }

  /**
   * 获取地区信息
   */
  getRegionCodes() {
    let code = localStorage.getItem(this.STORAGES_REGION_CODE);
    if (code == "" || code == null) {
      //读取cookie
      code = this.getCookie(this.STORAGES_REGION_CODE);
    }
    if (code == "" || code == null) {
      code = this.REGION_CODE_0;
    }
    return parseInt(code);
  }

  /**
   * 存储语言
   */
  addLanguage(lng) {
    localStorage.setItem(this.STORAGES_LANGUAGE_TYPE, lng);
    this.setCookie(this.STORAGES_LANGUAGE_TYPE, lng, 24 * 7, true);
  }

  /**
   * 获取保存的lange
   */
  getLanguage() {
    let ln = localStorage.getItem(this.STORAGES_LANGUAGE_TYPE);
    if (ln == null || ln == undefined) {
      //读取cookie
      ln = this.getCookie(this.STORAGES_LANGUAGE_TYPE);
      ln = this.ZH_CN;
    }
    if (ln == "") {
      ln = this.ZH_CN;
    }
    return ln;
  }

  /**
   * 保存来源
   */
  addSrcChannel(src_channel) {
    if (src_channel == "") throw new Error("保存的src_channel错误!");
    // const temp = LocalStorageUtil.getSrcChannel();
    // if(temp == '') {
    this.setCookie(this.SRC_CHANNEL, src_channel, -1, true);
    // }
  }

  /**
   * 获取来源
   */
  getSrcChannel() {
    const src_channel = this.getCookie(this.SRC_CHANNEL);

    return src_channel;
  }

  /**
   * 退出登录
   */
  loginOut() {
    console.log("退出登录");
    // localStorage.removeItem(this.STORAGES_USER_INFO);
    // localStorage.removeItem(this.STORAGES_TOKEN);
    localStorage.setItem(this.STORAGES_TOKEN, null);
    this.removeCookie(this.STORAGES_USER_INFO, true);
    this.removeCookie(this.STORAGES_TOKEN, true);
  }

  /**
   * 设置cookie
   * @param key
   * @param cvalue
   * @param value 单位小时
   * @param isDomain 是否设置domain，解决跨域访问
   */
  setCookie(key, value, exdays = -1, isDomain = false) {
    let cstr = key + "=" + value;
    // 时间
    if (exdays > 0) {
      const d = new Date();
      d.setTime(d.getTime() + exdays * 60 * 60 * 1000);
      const expires = "; expires=" + d.toUTCString();
      cstr = cstr + expires;
    }
    const hostname = window.location.hostname;
    let reg = /^((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))(\.((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))){3}$/;
    if (!(hostname == "localhost" || reg.test(hostname))) {
      // 域名
      if (isDomain) {
        const domain = rechargeUtils.getDomain();
        // ProjectConfig.log('cookie设置的域名:' + domain);
        cstr = cstr + "; domain=" + domain;
      }
    }
    //path
    cstr = cstr + "; path=/";
    document.cookie = cstr;
  }

  /**
   * 读取cookie
   * @param key
   * @param isDomain 是否读取跨域cookie
   */
  getCookie(key, isDomain = false) {
    var arr,
      reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2]);
    }
    return "";
  }

  /**
   * 删除cookie
   * @param name
   */
  removeCookie(key, isDomain = false) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(key);
    if (cval != null && cval != "") {
      let cstr = key + "=" + cval + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      const hostname = window.location.hostname;
      let reg = /^((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))(\.((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))){3}$/;
      if (!(hostname == "localhost" || reg.test(hostname))) {
        // 域名
        if (isDomain) {
          const domain = rechargeUtils.getDomain();
          cstr = cstr + "; domain=" + domain;
        }
      }
      cstr = cstr + "; path=/";
      document.cookie = cstr;
    }
  }
}
