<template>
  <!-- cdk兑换 组件 -->
  <div class="jiasu-exchange pointer" @click="cdkClick">
    <img :src="cdk_logo" alt />
    <p>CDKEY兑换</p>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import LocalStorageUtil from "@components/recharge/js/LocalStorageUtil";
const localStorageUtil = new LocalStorageUtil();
import { CefFactory } from "@components/recharge/factory/CefFactory";
const cefFactory = new CefFactory();
import AppParamModel from "@components/recharge/models/AppModel";
const appParamModel = new AppParamModel();
const appParam = appParamModel.getInstace(
  localStorageUtil.getRegionCodes(),
  localStorageUtil.getLanguage()
);
export default {
  data() {
    return {
      cdk_logo: require("@/assets/img/activity/cdk_logo.png")
    };
  },
  computed: {
    ...mapState("recharge", ["rechargeDialog", "account_token"]),
    ...mapGetters("recharge", [
      "getCdkDialo",
      "getAccountToken",
      "getUserInfoObj",
      "getIsOverdueToken"
    ])
  },
  methods: {
    ...mapActions("recharge", ["CdkDialog", "AccountToken"]),
    cdkClick() {
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
      this.CdkDialog(true);
    }
  }
};
</script>

<style lang="scss" scoped>
.jiasu-exchange {
  position: absolute;
  width: 131px;
  height: 35px;
  background: linear-gradient(
    151deg,
    rgba(255, 210, 46, 1) 0%,
    rgba(248, 192, 79, 1) 100%
  );
  box-shadow: 0px 3px 15px rgba(255, 192, 67, 0.5);
  opacity: 1;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 24px;
  top: 28px;
  transition: all 0.3s linear;
  &:hover {
    box-shadow: 0px 3px 15px rgba(255, 192, 67, 0.5);
  }
  img {
    width: 16px;
    height: 16px;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(122, 73, 30, 1);
    margin-left: 2px;
  }
}
</style>
