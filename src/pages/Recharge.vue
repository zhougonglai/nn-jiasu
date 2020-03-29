<template>
  <div
    class="container unselect"
    v-loading="isLoading"
    element-loading-custom-class="container-loading"
  >
    <!-- 充值页 -->
    <div class="jiasu-recharge">
      <!-- cdk 兑换组件 -->
      <CdkExchange></CdkExchange>
      <div class="jiasu-recharge-main">
        <!-- 加速期套餐组件 -->
        <JiasuPackage
          @packageSelected="packageSelected"
          @tokenExpired="tokenExpired"
          @getUserInfo="getUserInfo"
          @getDiscountList="getDiscountList"
          ref="jiasu_package"
        ></JiasuPackage>
        <div class="jiasu-package-title">
          <h1>充值有壕礼 iPhone送不停</h1>
          <p>购买1888小时套餐，可抽奖4次</p>
        </div>
        <!-- 九宫格抽奖组件 -->
        <JiuGongGe @tokenExpired="tokenExpired"></JiuGongGe>
        <!-- 中奖纪录 -->
        <WinnerRecord></WinnerRecord>
        <!-- 温馨提示组件 -->
        <WarmPrompt></WarmPrompt>
      </div>
      <!-- 充值弹窗 -->
      <payDialog
        ref="pay_dialog"
        :zheCode="zheCode"
        :discountlist="discountList"
        @payDialogClose="payDialogClose"
        @payBackData="payBackData"
        @onCleanInvoiceState="onCleanInvoiceState"
        :token="token"
      ></payDialog>
      <!-- 充值-支付成功弹窗 -->
      <el-dialog
        title="支付提示"
        :close-on-click-moda="true"
        :visible.sync="dialogRechargeSuccess"
        width="60%"
        :before-close="rechargeSuccessClose"
        style="height:696px"
      >
        <div class="pay-success">
          <div class="pay-success-title">
            <img :src="pay_success_logo" alt="" />
            <h1>支付成功</h1>
          </div>
          <div class="pay-success-content">
            <div class="pay-success-content-info">
              <div class="pay-info-wrap">
                <p>套餐类型:</p>
                <p>{{ payBackList.package_title }}</p>
              </div>
              <div class="pay-info-wrap">
                <p>订单编号:</p>
                <p>{{ payBackList.order_no }}</p>
              </div>
              <div class="pay-info-wrap">
                <p>支付金额:</p>
                <p>¥{{ payBackList.amount }}</p>
              </div>
              <div class="pay-info-wrap">
                <p>是否开通:</p>
                <p>已开通</p>
              </div>
            </div>
          </div>
          <div class="pay-success-btn">
            <el-button class="go-jiasu" @click="goJiaSu">去加速</el-button>
            <el-button class="go-luckydraw" @click="goLuckydraw"
              >去抽奖</el-button
            >
          </div>
        </div>
      </el-dialog>
      <!-- 充值-支付失败弹窗 -->
      <el-dialog
        title="支付提示"
        :close-on-click-moda="true"
        :visible.sync="dialogRechargeFail"
        width="60%"
        :before-close="rechargeFailClose"
        style="height:696px"
      >
        <div class="pay-success">
          <div class="pay-success-title">
            <img :src="pay_fail_logo" alt="" />
            <h1>支付失败</h1>
          </div>
          <div class="pay-success-content">
            <div class="pay-success-content-info">
              <div class="pay-info-wrap">
                <p>套餐类型:</p>
                <p class="ellipsis">{{ payBackObj.package_title }}</p>
              </div>
              <div class="pay-info-wrap">
                <p>订单编号:</p>
                <p class="ellipsis">{{ payBackObj.order_no }}</p>
              </div>
              <div class="pay-info-wrap">
                <p>支付金额:</p>
                <p class="ellipsis">¥{{ payBackObj.amount }}</p>
              </div>
              <div class="pay-info-wrap">
                <p>是否开通:</p>
                <p class="ellipsis">已开通</p>
              </div>
            </div>
          </div>
          <div class="pay-success-btn">
            <el-button class="go-jiasu" @click="ctCustomer">联系客服</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- cdk兑换-弹窗 -->
      <el-dialog
        title="CDKEY兑换"
        :close-on-click-moda="true"
        :visible.sync="dialogCdk"
        custom-class="cdk_dialog"
        width="60%"
        :before-close="cdkClose"
        style="height:696px"
      >
        <div class="pay-success">
          <div class="pay-cdk">
            <el-input
              v-model.trim="cdk_input"
              placeholder="请输入CDKEY码"
              maxlength="18"
              minlength="16"
              class=""
            ></el-input>
            <p>
              CDKEY是由16-18位字符组成的序列码，将您获得的序列码输入到文本框,点击【确定】即可使用
            </p>
          </div>
          <div class="pay-success-btn">
            <el-button class="go-luckydraw" @click="cdkExchange" plain
              >确定</el-button
            >
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import "@components/recharge/style/recharge.scss";
import { mapState, mapGetters, mapActions } from "vuex";
import RechargeService from "@services/recharge";
const rechargeService = new RechargeService();
import LocalStorageUtil from "@components/recharge/js/LocalStorageUtil";
const localStorageUtil = new LocalStorageUtil();
import RechargeUtils from "@components/recharge/js/rechargeUtils";
const rechargeUtils = new RechargeUtils();
import AppParamModel from "@components/recharge/models/AppModel";
const appParam = new AppParamModel();
import { CefFactory } from "@components/recharge/factory/CefFactory";
const cefFactory = new CefFactory();
export default {
  data() {
    return {
      pay_success_logo: require("@/assets/img/activity/pay_success_logo.png"),
      pay_fail_logo: require("@/assets/img/activity/pay_fail_logo.png"),
      cdk_input: "", // cdk
      payBackObj: {},
      zheCode: "",
      discountList: [], //需要显示的折扣码列表
      payBackList: {
        package_title: "",
        order_no: "",
        amount: ""
      },
      isUpdateInvoice: false, //是否可以刷新订单
      updateInvoiceTimer: null,
      invoiceNum: 3, //间隔时间，单位: 秒
      // FH1rl5ejUowRxU5Im0Jix0S2hDjbjamhF8WBOfWRBNBTMXCqu1T53EY0KYhT8iGL
      token: {
        account_token: ""
      },
      //默认支付方式
      defaultPayCode: {
        pay_type: 2,
        qr_type: "ali_qr",
        code_type: "支付宝"
      }
    };
  },
  computed: {
    ...mapState("recharge", [
      "cdkDialog",
      "rechargeDialog",
      "rechargeSuccessDialog",
      "rechargeFailDialog",
      "isLoading",
      "account_token",
      "userInfoObj",
      "isOverdueToken"
    ]),
    ...mapGetters("recharge", [
      "getAccountToken",
      "getUserInfoObj",
      "getIsOverdueToken"
    ]),
    account_token() {
      return (
        rechargeUtils.getUrlParam("account_token") ||
        localStorageUtil.getUserToken().account_token
      );
    },
    /**
     * 充值成功弹窗
     */
    dialogRechargeSuccess: {
      get: function() {
        return this.rechargeSuccessDialog;
      },
      set: function() {
        this.RechargeSuccessDialog(false);
      }
    },
    /**
     * 充值失败弹窗
     */
    dialogRechargeFail: {
      get: function() {
        return this.rechargeFailDialog;
      },
      set: function() {
        this.RechargeFailDialog(false);
      }
    },
    /**
     * cdk弹窗
     */
    dialogCdk: {
      get: function() {
        return this.cdkDialog;
      },
      set: function() {
        this.CdkDialog(false);
      }
    }
  },
  components: {
    JiuGongGe: () =>
      import("@/components/recharge/luckydraw/JiuGongGeLuckyDraw"),
    payDialog: () => import("@/components/recharge/rechargeDialog/payDialog"),
    JiasuPackage: () => import("@/components/recharge/JiasuPackage"),
    WinnerRecord: () => import("@/components/recharge/WinnerRecord"),
    WarmPrompt: () => import("@/components/recharge/WarmPrompt"),
    CdkExchange: () => import("@/components/recharge/CdkExchange")
  },
  async mounted() {
    // this.init();
    console.log("production:===>", this.$root.production);
    await this.AccountToken(this.account_token);
    // console.log("getter=>account_token:", this.getAccountToken);
    await this.getUserInfo();
    await this.setAccountToken(this.account_token);
  },
  methods: {
    ...mapActions("recharge", [
      "CdkDialog",
      "RechargeDialog",
      "RechargeSuccessDialog",
      "RechargeFailDialog",
      "IsLoading",
      "AccountToken",
      "UserInfoObj",
      "IsOverdueToken"
    ]),
    /**
     * 保存token
     */
    async setAccountToken(account_token) {
      await this.AccountToken(account_token);
    },
    //关闭cdk兑换弹窗
    cdkClose(done) {
      done();
    },
    // 关闭支付成功弹窗
    rechargeSuccessClose(done) {
      done();
    },
    // 关闭支付失败弹窗
    rechargeFailClose(done) {
      done();
    },
    /**
     * 去加速
     */
    goJiaSu() {
      this.RechargeSuccessDialog(false);
    },
    /**
     * 去抽奖
     */
    goLuckydraw() {
      this.RechargeSuccessDialog(false);
    },
    /**
     * 获取用户信息
     */
    async getUserInfo() {
      try {
        let token =
          this.getAccountToken || localStorageUtil.getUserToken().account_token;
        console.log("token:", token);
        await this.setAccountToken(token);
        if (token == "") {
          this.tokenExpired();
        } else {
          const params = {
            account_token: token
          };
          this.userBackData = await rechargeService.getUserInfo(params);
          if (this.userBackData.code == rechargeService.HTTP_SUCCESS_NET_CODE) {
            this.userInfo = this.userBackData.data;
            this.getUserinfoSuccess();
          } else if (
            this.userBackData.code == rechargeService.HTTP_TOKEN_EXPIRE
          ) {
            this.IsOverdueToken(true);
            this.tokenExpired();
          } else {
            this.getUserinfoFail();
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取用户信息失败
     */
    getUserinfoFail() {
      console.log("获取用户信息失败");
      this.tokenExpired();
    },
    /**
     * function: getUserDiscount 用户折扣码
     * 成功用户信息以后；获取用户套餐
     */
    async getUserinfoSuccess() {
      this.UserInfoObj(this.userInfo);
      this.IsOverdueToken(false);
      // await this.$refs.jiasu_package.getUserDiscount(); //需要首先获取用户折扣码，在请求用户套餐，防止出现用户
      await this.$refs.jiasu_package.getUserPackage(); // 获取用户套餐
    },
    /**
     * 支付弹窗右上角关闭
     */
    payDialogClose(done) {
      done();
      this.onCleanInvoiceState();
    },
    /**
     * 联系客服
     */
    ctCustomer() {
      this.RechargeFailDialog(false);
    },
    /**
     * cdkey兑换
     */
    async cdkExchange() {
      let token =
        this.getAccountToken || localStorageUtil.getUserToken().account_token;
      if (token == "" || token == null || token == undefined) {
        console.log("请先登录");
        return;
      }
      // if (this.cdk_input == "" || this.cdk_input.length < 16) {
      //   console.log("cdk长度错误");
      //   return;
      // }
      let params = {
        account_token: token,
        cd_key: this.cdk_input.toString()
      };
      let ckkeyBackData = await rechargeService.userCardCdkey(params);
      if (ckkeyBackData.code == rechargeService.HTTP_SUCCESS_NET_CODE) {
        this.$message.success(ckkeyBackData.msg);
      } else {
        this.$message.warning(ckkeyBackData.msg);
      }
    },
    /**
     * 选择套餐
     * 默认打开支付宝付款码
     */
    async packageSelected(packageCheck, package_id) {
      // let zheCode = this.zheCode; // 折扣码
      // let discountList = this.discountList; // 折扣码列表
      this.$refs.pay_dialog.getBuyCode(
        this.defaultPayCode.pay_type,
        this.defaultPayCode.qr_type,
        this.defaultPayCode.code_type,
        packageCheck,
        package_id
      );
      let isActive = 0; // 重置支付方式change tabs
      this.$refs.pay_dialog.payStatus(isActive);
    },
    /**
     * 获取的收款码info
     */
    payBackData(payBack) {
      this.payBackObj = payBack;
      this.payBackList = payBack.data;
      this.init();
    },
    /**
     * 初始化
     * 定时刷新器
     */
    init() {
      this.timingUpdateInvoiceState();
    },
    /**
     * 定时刷新，检测订单状态
     */
    timingUpdateInvoiceState() {
      this.isUpdateInvoice = true;
      const sefl = this;
      this.updateInvoiceTimer = setInterval(function() {
        sefl.startUpdateInvoiceState();
      }, this.invoiceNum * 1000);
    },
    /**
     * 开始执行
     */
    startUpdateInvoiceState() {
      if (!this.isUpdateInvoice) return;
      this.updateInvoiceState();
    },
    /**
     * 查询订单状态
     */
    async updateInvoiceState() {
      let token =
        this.getAccountToken || localStorageUtil.getUserToken().account_token;
      let params = {
        account_token: token,
        invoice_id: this.payBackObj.data.invoice_id
      };
      this.invoiceData = await rechargeService.invoiceState(params);
      if (this.invoiceData.code == rechargeService.HTTP_SUCCESS_NET_CODE) {
        // 支付成功
        if (this.invoiceData.data.status == 1) {
          this.onCleanInvoiceState();
          this.paySuccess();
        } else {
          // this.payFaild();
        }
      } else if (this.invoiceData.code == rechargeService.HTTP_TOKEN_EXPIRE) {
        // token 过期
        this.tokenExpired();
      }
      console.log("查询订单状态:", this.invoiceData.data);
    },
    /**
     * 支付成功
     */
    paySuccess() {
      this.payBackList = this.payBackObj.data;
      this.RechargeDialog(false);
      this.RechargeSuccessDialog(true);
    },
    /**
     * 支付失败
     */
    payFaild() {
      this.RechargeDialog(false);
      this.RechargeFailDialog(true);
    },
    /**
     * 停止计时器
     */
    onCleanInvoiceState() {
      this.isUpdateInvoice = false;
      clearInterval(this.updateInvoiceTimer);
    },
    /**
     * 打开登录窗口
     */
    async openTheLogin() {
      let token =
        this.getAccountToken || localStorageUtil.getUserToken().account_token;
      if (token == "" || this.getIsOverdueToken) {
        if (this.$root.production) {
          let message = {
            operation: "test"
          };
          const factory = cefFactory
            .getInstance()
            .getFactory(appParam.platform);
          factory.openLogin(message);
        }
        return;
      }
    },
    /**
     * 用户token过期、用户没有token、获取用户信息失败都会调用改方法
     */
    async tokenExpired() {
      await this.logout();
      let token =
        this.getAccountToken || localStorageUtil.getUserToken().account_token;
      if (!this.getIsOverdueToken) {
        await this.$refs.jiasu_package.getUserPackage();
      }
      if (this.getIsOverdueToken && token !== "") {
        await this.$refs.jiasu_package.getTemPriceList();
      }
      await this.setAccountToken(null);
    },
    /**
     * 用户折扣码列表
     */
    getDiscountList(discountList, zheCode) {
      this.zheCode = zheCode;
      this.discountList = discountList;
    },
    async logout() {
      await localStorageUtil.loginOut();
      this.IsOverdueToken(true);
      localStorage.setItem(localStorageUtil.STORAGES_TOKEN, null);
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #26136b;
  overflow: auto;
  overflow-x: hidden;
  ::v-deep .container-loading {
    z-index: 9999;
    .el-loading-spinner {
      top: 30%;
    }
  }
  .jiasu-recharge {
    width: 100%;
    min-height: 100%;
    margin: auto;
    .jiasu-recharge-main {
      width: 810px;
      height: 100%;
      margin: auto;
      .jiasu-package-title {
        width: 100%;
        text-align: center;
        padding: 20px 0;
        h1 {
          font-size: 29px;
          font-weight: 400;
          line-height: 33px;
          color: rgba(255, 255, 255, 1);
          opacity: 1;
        }
        p {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: #fff6ff;
          opacity: 1;
        }
      }
    }
    ::v-deep .el-dialog {
      width: 773px !important;
      height: 496px;
      border-radius: 5px;
      margin-top: 10vh !important;
      .el-dialog__header {
        background: url("../assets/img/activity/dialog_head_bg.png") no-repeat
          center;
        background-size: cover;
        padding: 8px 0px 11px 20px;
        height: 39px;
        .el-dialog__title {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          line-height: 24px;
          color: rgba(255, 255, 255, 1);
        }
        .el-dialog__headerbtn {
          top: 12px;
          right: 10px;
        }
      }
    }
    .pay-success {
      width: 456px;
      height: 100%;
      margin: auto;
      .pay-success-title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
        h1 {
          font-size: 18px;
          font-weight: bold;
          line-height: 25px;
          color: rgba(71, 73, 76, 1);
          opacity: 1;
          text-align: center;
          padding-left: 10px;
        }
      }
      .pay-cdk {
        width: 456px;
        margin: auto;
        padding-top: 90px;
        margin-bottom: 60px;
        ::v-deep .el-input__inner {
          width: 456px;
          height: 36px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(226, 226, 226, 1);
          opacity: 1;
          border-radius: 18px;
          &::placeholder {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 24px;
            color: #80838a;
          }
        }
        p {
          width: 456px;
          height: 38px;
          margin-top: 20px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 24px;
          color: rgba(128, 131, 138, 1);
        }
      }
      .pay-success-content {
        width: 100%;
        height: 131px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(226, 226, 226, 1);
        opacity: 1;
        margin-top: 28px;
        .pay-success-content-info {
          padding: 24px 29px 20px 32px;
          width: 441px;
          height: 100%;
          .pay-info-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 6px;
            p {
              height: 17px;
              font-size: 12px;
              font-weight: 400;
              line-height: 17px;
              color: rgba(71, 73, 76, 1);
              opacity: 1;
              &:last-child {
                width: 278px;
                text-align: right;
              }
            }
            &:first-child {
              margin-top: 0;
            }
          }
        }
      }
      .pay-success-btn {
        width: 441px;
        margin: auto;
        display: flex;
        justify-content: center;
        padding-top: 27px;
        .el-button {
          width: 130px;
          height: 40px;
          opacity: 1;
          border-radius: 20px;
          font-size: 16px;
          font-weight: 400;
          line-height: 12px;
          color: rgba(71, 73, 76, 1);
          margin-left: 18px;
          &:first-child {
            margin-left: 0;
          }
        }
        .go-jiasu {
          background: rgba(241, 243, 245, 1);
        }
        .go-luckydraw {
          background: linear-gradient(
            151deg,
            rgba(255, 210, 46, 1) 0%,
            rgba(248, 192, 79, 1) 100%
          );
          transition: all 0.3s linear;
          &:hover {
            box-shadow: 0px 3px 15px rgba(255, 192, 67, 0.5);
          }
        }
      }
    }
  }
}
</style>
