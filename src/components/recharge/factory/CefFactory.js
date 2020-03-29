/**
 * 内嵌页面调用接口工厂
 */
export class CefFactory {
  constructor() {
    this.instance;
    // this.macE = new CefMacFactory();
    this.winE = new CefWindowsFactory();
    // this.winNewE = new CefNewWindowsFactory();
  }

  /**
   * 单例获取
   */
  getInstance() {
    if (this.instance == null) {
      this.instance = new CefFactory();
    }
    return this.instance;
  }

  /**
   *
   * @param platform 参考: AppModel类说明
   */
  getFactory(platform) {
    console.log("platform:==>", platform);
    let factory;
    switch (platform) {
      case 0:
        factory = this.winE;
        break;
      case 1:
        factory = this.macE;
        break;
      case 5:
        factory = this.winNewE;
        break;
      default:
        factory = this.winE;
        break;
    }
    return factory;
  }
}

export class CefWindowsFactory {
  // token 过期处理
  loginExpire(message) {
    try {
      window.NimCefWebInstance.call(
        "loginExpire",
        { message },
        (error, result) => {
          console.log(result);
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  // 充值成功
  rechargeSuccess(message) {
    window.NimCefWebInstance.call(
      "rechargeSuccess",
      { message },
      (error, result) => {
        console.log(result);
      }
    );
  }

  // 唤起登录窗口
  openLogin(message) {
    console.log("打开登录弹窗:", message);
    window.NimCefWebInstance.call("openLogin", { message }, (error, result) => {
      console.log(result);
    });
  }
}
