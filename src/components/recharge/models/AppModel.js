/**
 * 参数
 */
import LocalStorageUtil from "@components/recharge/js/LocalStorageUtil";
const localStorageUtil = new LocalStorageUtil();
import RechargeUtils from "@components/recharge/js/rechargeUtils";
const rechargeUtils = new RechargeUtils();
export default class AppParamModel {
  instace;
  language = ""; // 语言
  region_code = null; // 地区code
  account_token = ""; // token
  id = 0; // 详情id
  platform = 0; //0window 1mac 2android 3ios 4微信公众号 5window带内核新版
  src_channel = ""; //来源 内嵌用此字段
  from = ""; //来源 官网用此字段
  infrom = 0; // 0默认 1 ios（
  os_type = 1; //来源

  /**
   * 单例
   */
  getInstace(
    region_code = localStorageUtil.getRegionCodes(),
    language = localStorageUtil.getLanguage()
  ) {
    if (this.instace == null)
      this.instace = new AppParamModel(region_code, language);

    return this.instace;
  }

  constructor(region_code, language) {
    this.region_code = region_code;
    this.language = language;
    this.getAppParam();
  }

  /**
   * app端页面参数
   */
  getAppParam() {
    //兼容IE10问题
    if (!window.location.origin) {
      window.location.origin =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "");
    }

    this.id = parseInt(rechargeUtils.getUrlParam("id"));
    if (isNaN(this.id)) {
      this.id = 0;
    }

    const region_code = parseInt(rechargeUtils.getUrlParam("region_code"));
    if (!isNaN(region_code)) {
      this.region_code = region_code;
    }

    let language = rechargeUtils.getUrlParam("language");
    if (language === "") {
      //读取浏览器中的语言
      language = rechargeUtils.getExplorerbLang();
      if (
        language != "" &&
        language != null &&
        language != "undefined" &&
        language != "null"
      ) {
        this.language = language;
      }
    } else {
      this.language = language;
    }

    this.account_token = rechargeUtils.getUrlParam("account_token");
    if (this.account_token == "") {
      try {
        this.account_token = localStorageUtil.getUserToken().account_token;
      } catch (e) {
        this.account_token = "";
      }
    }

    this.platform = parseInt(rechargeUtils.getUrlParam("platform"));
    if (isNaN(this.platform)) {
      this.platform = 0;
    }

    this.os_type = Number(rechargeUtils.getUrlParam("os_type"));
    if (isNaN(this.os_type)) {
      this.os_type = 1;
    }
    localStorage.setItem(localStorageUtil.STORAGES_OS_TYPE, this.os_type + "");

    //是否是ios地址
    let hostname = window.location.hostname;
    if (hostname.indexOf("ios.") != -1) {
      this.language = localStorageUtil.EN;
      this.region_code = localStorageUtil.REGION_CODE_1;
      this.infrom = 1;
    }

    //pc来源
    let from = rechargeUtils.getUrlParam("from");
    if (from == "") {
      from = rechargeUtils.getUrlParam("src_channel");
    }
    if (from == "") {
      this.from = localStorageUtil.FROM_GUANWANG;
      this.src_channel = localStorageUtil.FROM_GUANWANG;
    } else {
      this.from = from;
      this.src_channel = from;
    }

    //保存来源
    localStorageUtil.addSrcChannel(this.src_channel);
    //保存token
    const userInfo = {
      account_token: ""
    };
    userInfo.account_token = this.account_token;
    localStorageUtil.addUserToken(userInfo);
    //保存语言
    localStorageUtil.addLanguage(this.language);
    //保存地区
    localStorageUtil.addRegionCode(this.region_code);
  }
}
