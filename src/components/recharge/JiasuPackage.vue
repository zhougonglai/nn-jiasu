<template>
  <!-- 加速套餐组件 -->
  <div class="jiasu-recharge-package">
    <div
      class="recharge-package-wrap pointer transition"
      @click="packageClick(item, index, package_id)"
      :class="{ active: active == index }"
      v-for="(item, index) in priceList"
      :key="index"
      @mouseenter="packageEnter(index)"
      @mouseleave="packageLeave(index)"
    >
      <div class="nn-jiasu-logo" v-if="active == index">
        <img :src="nn_jiasu_logo" alt="" />
      </div>
      <div class="package-wrap-hours">
        <h1>{{ item.price_title }}<span>小时</span></h1>
      </div>
      <div class="package-wrap-content">
        <p>{{ item.price_desc }}</p>
        <p>优惠价: ¥{{ item.price_num }}</p>
        <p>原价:{{ item.price_short_desc }}</p>
      </div>
      <el-button class="package-buy">立即购买</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import RechargeService from "@services/recharge";
const rechargeService = new RechargeService();
import LocalStorageUtil from "@components/recharge/js/LocalStorageUtil";
const localStorageUtil = new LocalStorageUtil();
import GlobalConfig from "@components/recharge/js/globalConfig";
const globalConfig = new GlobalConfig();
import Request from "@utils/request";
const request = new Request();
import RechargeUtils from "@components/recharge/js/rechargeUtils";
const rechargeUtils = new RechargeUtils();
import AppParamModel from "@components/recharge/models/AppModel";
const appParamModel = new AppParamModel();
const appParam = appParamModel.getInstace(
  localStorageUtil.getRegionCodes(),
  localStorageUtil.getLanguage()
);
import { CefFactory } from "@components/recharge/factory/CefFactory";
const cefFactory = new CefFactory();
export default {
  data() {
    return {
      active: 0,
      packageData: [],
      czTypeIndex: 1, // 1:海外会员 2;国内记时 3:路由器开发套餐
      package_id: Number, // 套餐id
      rechargeJson: null, // 未登录的套餐信息
      priceList: [], // 套餐详情
      nn_jiasu_logo: require("@/assets/img/activity/nn_jiasu_logo.png"),
      package_level: 0, // 用户套餐级别
      packageList: [], //套餐类型集合
      choosePrice: "0", //选择的价格
      userDiscountList: [], //请求回的全部折扣码列表
      discountList: [], //页面显示的折扣码列表
      zheCodeCopy: "",
      zheCode: "",
      is_change_price: 0 // 是否首单特惠
    };
  },
  computed: {
    ...mapState("recharge", ["isLoading", "userInfoObj", "isOverdueToken"]),
    ...mapGetters("recharge", [
      "getAccountToken",
      "getUserInfoObj",
      "getIsOverdueToken"
    ]),
    region_code() {
      return (
        localStorageUtil.getRegionCodes() ||
        this.getUserInfoObj.region_code ||
        1
      ); //地区:1 国内 0 国际
    }
  },
  async mounted() {
    // await this.$emit("getUserInfo");
    await this.getUserPackage();
    await this.getUserDiscount(); //需要首先获取用户折扣码，在请求用户套餐，防止出现用户
    // console.log("appParam:", appParam);
    // console.log("getter=>account_token:", this.getAccountToken);
  },
  methods: {
    ...mapActions("recharge", ["RechargeDialog", "IsLoading"]),
    /**
     * 套餐选择click
     */
    packageClick(item, index) {
      let token =
        this.getAccountToken || localStorageUtil.getUserToken().account_token;
      if (token == "" || token == undefined) {
        console.log("打开登录弹窗||获取token");
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
      // if (!rechargeUtils.getUrlParam("account_token")) {
      //   const factory = cefFactory.getFactory(appParam.platform);
      //   factory.openLogin();
      //   console.log("打开登录弹窗||获取token");
      //   return;
      // }
      this.active = index;
      this.RechargeDialog(true);
      this.$emit("packageSelected", item, this.package_id);
      // console.log("所选套餐:", item);
    },
    /**
     * 套餐hover
     */
    packageEnter(index) {
      // this.active = index;
    },
    /**
     * 套餐leave
     */
    packageLeave(index) {
      // this.active = index;
    },
    /**
     * 获取用户套餐
     */
    async getUserPackage() {
      this.IsLoading(true);
      let token =
        this.getAccountToken || localStorageUtil.getUserToken().account_token;
      // console.log(token)
      // console.log("token是否过期:", this.getIsOverdueToken);
      if (token == "" || this.getIsOverdueToken) {
        await this.getTemPriceList();
        return;
      }
      let params = {
        account_token: token,
        region_code: this.region_code,
        lang: "zh_CN"
      };
      let packageObj = await rechargeService.userPackage(params);
      this.IsLoading(false);
      if (packageObj.code == 0) {
        this.getUserPackageSuccess();
        this.packageList = packageObj.data;
        this.czTypeIndex = packageObj.data.length - 1;
        // this.packageData = packageObj.data[this.czTypeIndex];
        // this.priceList = this.packageData.price;
        // this.priceList.reverse();
        // this.priceList.sort((itemA, itemB) => {
        //   return itemB.price_is_recommend - itemA.price_is_recommend;
        // });
        // this.package_id = this.packageData.package_id;
      }
    },
    /**
     * 获取用户折扣码
     */
    async getUserDiscount() {
      let token =
        this.getAccountToken || localStorageUtil.getUserToken().account_token;
      let params = {
        account_token: token,
        region_code: this.region_code
      };
      this.backData = await rechargeService.userDiscount(params);
      if (this.backData.code == rechargeService.HTTP_SUCCESS_NET_CODE) {
        this.userDiscountList = this.backData.data;
        this.userDiscountList = this.userDiscountList.sort((a, b) => {
          let value1 = a.discount_value;
          let value2 = b.discount_value;
          return value2 - value1;
        });
        this.discountList = this.userDiscountList;
        // this.discountList = [{ value: "123" }, { value: "456" }];
        this.$emit("getDiscountList", this.discountList, this.zheCode);
        this.getUserDiscountSuccess();
      } else if (this.backData.code == rechargeService.HTTP_TOKEN_EXPIRE) {
        this.$emit("tokenExpired");
      } else {
        this.getUserDiscountError();
      }
      console.log("用户折扣码:", this.discountList);
    },
    /**
     * 用户套餐级别
     */
    checkUserType() {
      this.package_level = localStorageUtil.getUserInfo().package_level;
    },
    /**
     * 没有登录的时候，获取套餐信息
     */
    async getTemPriceList() {
      // console.log("token是否过期:", this.getIsOverdueToken);
      let lang = localStorageUtil.getLanguage();
      let pacakgeJson = await this.getRechargeJson(
        globalConfig.getWebBaseUrl()
      );
      this.IsLoading(false);
      console.log("this.region_code:", this.region_code);
      this.priceList = pacakgeJson[this.region_code + "__" + lang].price;
      this.priceList.reverse();
      this.priceList.sort((itemA, itemB) => {
        return itemB.price_is_recommend - itemA.price_is_recommend;
      });
      this.packageData.price = this.priceList;
      // console.log("未登录时的套餐信息:", this.priceList);
      console.log("未登录时的套餐信息:", this.packageData);
    },
    /**
     * 下载配置文件
     */
    async getRechargeJson(urlHead) {
      if (this.rechargeJson == null) {
        let url = urlHead + "/" + globalConfig.RECHARGE_JSON;
        let params = {};
        try {
          this.rechargeJson = await fetch(url, params, {
            method: "GET"
          }).then(res => res.json());
          return this.rechargeJson;
        } catch (e) {
          return null;
        }
      } else {
        return this.rechargeJson;
      }
    },
    /**
     * 获取套餐成功
     */
    getUserPackageSuccess() {
      if (this.getUserInfoObj.is_switch_package == 0) {
        this.onChoosePackageTypeA(null);
      } else {
        for (var i = 0; i < this.packageList.length; i++) {
          if (
            this.packageList[i].include_region_codes ==
            this.appParam.region_code + ""
          ) {
            this.onChoosePackageTypeA(i);
          }
        }
      }
    },
    /**
     * 选择套餐类型
     */
    onChoosePackageTypeA(type = null) {
      if (this.packageList.length <= 0) return;
      this.onChoosePackageType(type);
    },
    /**
     * 选择套餐类型
     */
    async onChoosePackageType(type) {
      if (type == null) {
        type = this.czTypeIndex;
        for (let i = 0; i < this.packageList.length; i++) {
          if (
            this.packageList[i].package_id == this.getUserInfoObj.package_id
          ) {
            type = i;
            this.czTypeUserIndex = i;
            this.czTypeIndex = i;
            this.isShow = 0;
            break;
          }
        }
      } else {
        this.czTypeIndex = type;
        this.isShow = 0;
      }
      //需要判断用户购买的套餐，屏蔽其它套餐的购买is_switch_package = 1可以都购买
      if (this.getUserInfoObj.is_switch_package == 0) {
        this.czTypeIndex = type;
        if (this.czTypeUserIndex == type) {
          this.isShow = 0;
        } else {
          this.isShow = 1;
        }
      }
      //
      this.package_id = this.packageList[this.czTypeIndex].package_id; // 套餐id
      this.priceList = this.packageList[this.czTypeIndex].price;
      this.priceList.sort((itemA, itemB) => {
        return itemB.price_is_recommend - itemA.price_is_recommend;
      });
      this.is_change_price = this.packageList[this.czTypeIndex].is_change_price;
      //
      for (let i = 0; i < this.priceList.length; i++) {
        if (this.priceList[i].price_is_recommend == 1) {
          this.priceIndex = i;
          this.priceHoverIndex = i; //套餐hover的index
          break;
        }
      }
      let package_index = rechargeUtils.getUrlParam("package_index");
      if (package_index != "") {
        this.priceIndex = parseInt(package_index);
      }
      this.onChoosePrice();
    },
    /**
     * 获取优惠券成功
     */
    getUserDiscountSuccess() {
      // console.log("this.priceIndex1:", this.priceIndex);
      this.onChoosePrice(this.priceIndex);
    },
    /**
     * 获取优惠券失败
     */
    getUserDiscountError() {},
    /**
     * 选择套餐
     * @param type
     */
    async onChoosePrice(type = null) {
      if (type == null) type = this.priceIndex;
      this.priceIndex = type;
      // console.log("this.priceIndex2:", this.priceIndex);
      if (this.priceIndex == undefined) return;
      this.choosePrice = this.priceList[this.priceIndex].price_num;
      this.discountList = [];
      for (let qq = 0; qq < this.userDiscountList.length; qq++) {
        if (
          this.userDiscountList[qq].price_ids.indexOf(
            this.priceList[this.priceIndex].price_id
          ) != -1
        ) {
          this.discountList.push({
            label: this.userDiscountList[qq].discount_code,
            value: this.userDiscountList[qq].title
          });
        }
      }
      this.processZhekou();
    },
    /**
     * 根据选择的套餐自动加载，优惠力度最大的优惠劵
     * 重载的具体方法
     */
    processZhekou() {
      if (this.discountList.length != 0) {
        this.zheCodeCopy = this.discountList[0].value;
        this.zheCode = this.discountList[0].label;
      } else {
        this.zheCodeCopy = "";
        this.zheCode == "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 0 !important;
}
.jiasu-recharge-package {
  width: 100%;
  height: 245px;
  display: flex;
  justify-content: space-between;
  margin-top: 165px;
  .recharge-package-wrap {
    width: 180px;
    height: 245px;
    background: rgba(255, 255, 255, 1);
    opacity: 1;
    border-radius: 5px;
    position: relative;
    border: 1px solid rgba(45, 45, 48, 1);
    text-align: center;
    .nn-jiasu-logo {
      position: absolute;
      left: 0;
      top: -40px;
    }
    .package-wrap-hours {
      width: 176px;
      height: 66px;
      background: #5a34e4;
      opacity: 1;
      border-radius: 5px 5px 0px 0px;
      margin: auto;
      h1 {
        font-size: 30px;
        font-weight: 400;
        line-height: 66px;
        color: #ffffff;
        opacity: 1;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        margin-top: 1px !important;
        span {
          font-size: 15px;
          font-weight: 500;
          line-height: 21px;
          color: #ffffff;
        }
      }
    }
    .package-wrap-content {
      width: 100%;
      padding-top: 20px;
      p {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: rgba(75, 76, 83, 1);
        opacity: 1;
        text-align: center;
        padding-top: 8px;
        &:last-child {
          text-decoration: line-through;
        }
      }
    }
    .package-buy {
      position: relative;
      top: 20px;
      margin: auto;
      width: 130px;
      height: 35px;
      background: #ffffff;
      opacity: 1;
      border-radius: 20px;
      font-size: 16px;
      font-weight: bold;
      line-height: 5px;
      color: #5a34e4;
      &.active {
        transition: all 0.3s linear;
        box-shadow: 0px 3px 15px rgba(255, 192, 67, 0.5);
        background: linear-gradient(
          151deg,
          rgba(255, 210, 46, 1) 0%,
          rgba(248, 192, 79, 1) 100%
        );
        color: #7a491e;
      }
    }
    &.active {
      //   box-shadow: 0 0 0 1px #f0bd48;
      border: 1px solid rgba(252, 196, 0, 1);
      transition: all 0.3s linear;
      .package-wrap-hours {
        width: 178px;
        background: linear-gradient(
          151deg,
          rgba(255, 210, 46, 1) 0%,
          rgba(248, 192, 79, 1) 100%
        );
        transition: all 0.3s linear;
        h1 {
          color: #7a491e;
          margin-top: 0;
        }
        span {
          color: #7a491e;
        }
      }
      .package-buy {
        background: linear-gradient(
          151deg,
          rgba(255, 210, 46, 1) 0%,
          rgba(248, 192, 79, 1) 100%
        );
        box-shadow: 0px 3px 15px rgba(255, 192, 67, 0.5);
        color: #7a491e;
      }
    }
    &:hover {
      border: 1px solid rgba(252, 196, 0, 1);
      .package-wrap-hours {
        transition: all 0.3s linear;
        width: 178px;
        background: linear-gradient(
          151deg,
          rgba(255, 210, 46, 1) 0%,
          rgba(248, 192, 79, 1) 100%
        );
        h1 {
          transition: all 0.3s linear;
          color: #7a491e;
          margin-top: 0 !important;
        }
        span {
          color: #7a491e;
        }
      }
      .package-buy {
        background: linear-gradient(
          151deg,
          rgba(255, 210, 46, 1) 0%,
          rgba(248, 192, 79, 1) 100%
        );
        box-shadow: 0px 3px 15px rgba(255, 192, 67, 0.5);
        color: #7a491e;
      }
    }
  }
}
</style>
