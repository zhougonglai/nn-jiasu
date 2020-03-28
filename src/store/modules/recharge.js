const state = {
  rechargeDialog: false,
  rechargeSuccessDialog: false,
  rechargeFailDialog: false,
  cdkDialog: false,
  isLoading: false,
  account_token: "",
  userInfoObj: {},
  isOverdueToken: false // token 是否过期
};

const getters = {
  getRechargeDialog: state => state.rechargeDialog,
  getRechargeSuccessDialog: state => state.rechargeSuccessDialog,
  getRechargeFailDialog: state => state.rechargeFailDialog,
  getCdkDialo: state => state.cdkDialog,
  getIsLoading: state => state.isLoading,
  getAccountToken: state => state.account_token,
  getUserInfoObj: state => state.userInfoObj,
  getIsOverdueToken: state => state.isOverdueToken
};

const mutations = {
  RECHARGEDIALOG(state, data) {
    state.rechargeDialog = data;
  },
  RECHARGESUCCESSDIALOG(state, data) {
    state.rechargeSuccessDialog = data;
  },
  RECHARGEFailDIALOG(state, data) {
    state.rechargeFailDialog = data;
  },
  CDKDIALOG(state, data) {
    state.cdkDialog = data;
  },
  ISLOADING(state, data) {
    state.isLoading = data;
  },
  ACCOUNTTOKEN(state, data) {
    state.account_token = data;
  },
  USERINFOOBJ(state, data) {
    state.userInfoObj = data;
  },
  ISOVERDUETOKEN(state, data) {
    state.isOverdueToken = data;
  }
};

const actions = {
  RechargeDialog({ commit }, params) {
    commit("RECHARGEDIALOG", params);
  },
  RechargeSuccessDialog({ commit }, params) {
    commit("RECHARGESUCCESSDIALOG", params);
  },
  RechargeFailDialog({ commit }, params) {
    commit("RECHARGEFailDIALOG", params);
  },
  CdkDialog({ commit }, params) {
    commit("CDKDIALOG", params);
  },
  IsLoading({ commit }, params) {
    commit("ISLOADING", params);
  },
  AccountToken({ commit }, params) {
    commit("ACCOUNTTOKEN", params);
  },
  UserInfoObj({ commit }, params) {
    commit("USERINFOOBJ", params);
  },
  IsOverdueToken({ commit }, params) {
    commit("ISOVERDUETOKEN", params);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
