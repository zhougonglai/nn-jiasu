import Request from "@utils/request";

export default class RechargeService {
  constructor() {
    this.HTTP_SUCCESS_NET_CODE = 0; // 成功的请求
    // 错误code
    this.HTTP_ERROR_NEW_CODE = -50000; // 网络错误
    this.HTTP_TOKEN_EXPIRE = 400006; // token过期
    this.request = new Request(
      process.env.VUE_APP_BASE + process.env.VUE_APP_JIASU_NAMESPACE
    );
  }

  // 获取用户信息
  async getUserInfo(recharge) {
    return await this.request.post("/api/user/info", recharge);
  }

  // 付款二维码
  async packageBuy(recharge) {
    return await this.request.post("/api/user/package/buy", recharge);
  }

  // 检验订单状态
  async invoiceState(recharge) {
    return await this.request.post("/api/user/invoice/state", recharge);
  }

  // 获取用户可能看到的套餐
  async userPackage(recharge) {
    return await this.request.post("/api/user/package", recharge);
  }

  // 获取用户用户私有折扣码
  async userDiscount(recharge) {
    return await this.request.post("/api/user/discount", recharge);
  }

  // 获取礼品中奖纪录
  async activityPresent(recharge) {
    return await this.request.post("/api/activity/present", recharge);
  }

  // cdkey充值
  async userCardCdkey(recharge) {
    return await this.request.post("/api/user/card/cdkey", recharge);
  }

  // 用户活动 - 随机抽奖
  async activityDraw(recharge) {
    return await this.request.post("/api/activity/draw", recharge);
  }

  // 获取活动详情
  async activityDetail(recharge) {
    return await this.request.get(`/api/activity/${recharge.id}`, recharge);
  }
}
