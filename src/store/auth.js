import { defineStore } from "pinia";
import {
  getToken,
  getNormalUser,
  getWalletTypeCookie,
  setAccount,
  removeAccount,
  setMemoryAc,
  setNormalUser,
  setPlayerId,
  setToken,
  removeAuthCookie,
  setWalletTypeCookie,
  getAccount,
  getUserInfoCookie,
  setUserInfoCookie,
} from "@/utils/cookie";
import { userInfoApi, loginApi } from "@/api/user";
import { useSsevent } from "./sseventStore";
// import { resetPinia } from "./index";

const sseStore = useSsevent();
const { closeSsevent } = sseStore;

const initState = {
  token: getToken() || "",
  userInfo: getUserInfoCookie() ? JSON.parse(getUserInfoCookie()) : {},
  userUuid: "",
  loginData: getNormalUser() ? JSON.parse(getNormalUser()) : {},
  wallet_id: {},
  registerData: {},
  walletType: getWalletTypeCookie() || "TWD",
  showPwa: false,
  // coinType: getWalletTypeCookie() || "TWD",
  // googleAuth: {},
  // googleToken: "",
};

export const useAuth = defineStore("userStore", {
  state: () => initState,
  actions: {
    // async getCoin() {
    //   const coinApiRes = await coinApi();
    //   console.log(coinApiRes.data.data);
    //   // coinApiRes.data?.data?.wallet?.filter((item) => item.currency === curCoinType)
    //   // this.wallet_id = coinApiRes.data.data.wallet.filter(
    //   //   (item) => item.currency === curCoinType
    //   // )[0].wallet_id;
    // },
    async login({ account, password, memoryAc }) {
      try {
        const res = await loginApi({ account, password });

        this.loginData = res;
        if (res.data.code === 0) {
          this._setLoginData(this.loginData, "login", account, memoryAc);
        }

        return res;
      } catch (error) {
        console.log(error, "loginError");
      }
    },
    logout() {
      this._setLoginData(null, "logout");
      console.log("logout!!!!!!!!!!!!");
    },
    // 設定登入資料到 Pinia、cookie
    _setLoginData(apiRes, option = "login", account, memoryAc) {
      if (option === "login") {
        this.userUuid = apiRes?.data?.data?.user_uuid;
        this.token = apiRes?.data?.data?.token;
        this.loginData = apiRes?.data?.data;

        setNormalUser(JSON.stringify(apiRes.data.data));
        setPlayerId(this.userUuid);
        setToken(this.token);
        setMemoryAc(memoryAc);
        if (memoryAc) {
          setAccount(account);
        } else if (memoryAc === false && getAccount()) {
          removeAccount();
        }
      } else {
        removeAuthCookie();
        closeSsevent();
        this.$reset();
        this.token = "";
        this.userInfo = "";
      }
    },
    async getUserInfo(start_time, end_time) {
      this.isloading = true;

      const userInfoRes = await userInfoApi(start_time, end_time);

      this.userInfo = userInfoRes.data.data;
      console.log(this.userInfo);
      setUserInfoCookie(JSON.stringify(userInfoRes.data.data));

      this.walletType = this.userInfo.is_test ? "TEST" : "TWD";
      this.setWalletType(this.walletType);

      this.isloading = false;
      // this.wallets.twd = this.userInfo.wallets.filter(
      //   (item) => item.currency === "TWD"
      // )[0];
      // this.wallets.usdt = this.userInfo.wallets.filter(
      //   (item) => item.currency === "USDT"
      // )[0];
      // this.isCredit = userInfoRes.data.data.player_type === "credit";
    },
    async GoogleLoginState(isSignIned) {
      this.isGoogleLogin = isSignIned;
    },
    getGoogleAuth(auth) {
      this.googleAuth = auth;
    },
    setWalletType(type) {
      this.walletType = type;
      setWalletTypeCookie(type);
    },
  },
  getters: {
    twdReturnTotal: (state) => {
      const total = state.wallets?.twd?.game
        ? state.wallets.twd?.game.goldenwind?.rebate +
          state.wallets.twd?.game.joygames?.rebate
        : 0;

      return total;
    },
    // usdtReturnTotal: (state) => {
    //   const total = state.wallets.usdt.game
    //     ? state.wallets.usdt?.game.goldenwind?.rebate +
    //       state.wallets.usdt?.game.joygames?.rebate
    //     : 0;

    //   return total;
    // },
  },
});
