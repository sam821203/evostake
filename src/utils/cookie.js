import Cookies from "js-cookie";
import { isBoolean } from "./transType";

export const getCookie = (key) => Cookies.get(key);
export const setCookie = (key, value) => Cookies.set(key, value);
export const removeCookie = (key) => Cookies.remove(key);
export const setCookieByExpire = (key, value, date) => {
  let attr = { expires: date };
  Cookies.set(key, value, attr);
};

export const setCookieExpireDays = (key, value, days) => {
  let date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setDate(date.getUTCDate() + days);
  setCookieByExpire(key, value, date);
};
// token 管理
export const getToken = () => getCookie("hash_token_phil");
export const setToken = (token) =>
  setCookie("hash_token_phil", `Bearer ${token}`);
export const removeToken = () => removeCookie("hash_token_phil");

// 一般登入用戶管理
export const getNormalUser = () => getCookie("hash_normal_user");
export const setNormalUser = (user) => setCookie("hash_normal_user", user);
export const removeNormalUser = () => removeCookie("hash_normal_user");
export const setUuid = (id) => setCookie("uuid", id);
export const getUuid = () => getCookie("uuid");
export const removeUuid = () => removeCookie("uuid");

// google 用戶管理
export const getGoogleUser = () => getCookie("hash_google_user");
export const setGoogleUser = (user) => setCookie("hash_google_user", user);
export const removeGoogleUser = () => removeCookie("hash_google_user");
export const getPlayerId = () => getCookie("playerId");
export const setPlayerId = (id) => setCookie("playerId", id);
export const removePlayerId = () => removeCookie("playerId");
// 記住帳號
export const getMemoryAc = () => isBoolean(getCookie("memoryAc"));
export const setMemoryAc = (memoryAc = false) =>
  setCookie("memoryAc", memoryAc);

// userInfo
export const getUserInfoCookie = () => getCookie("userInfo");
export const setUserInfoCookie = (userInfo) => setCookie("userInfo", userInfo);
export const removeUserInfoCookie = () => removeCookie("userInfo");

export const getAccount = () => getCookie("user_account");
export const setAccount = (account) => setCookie("user_account", account);
export const removeAccount = () => removeCookie("user_account");

// 記住選擇幣種
export const getWalletTypeCookie = () => getCookie("walletType");
export const setWalletTypeCookie = (walletType) =>
  setCookie("walletType", walletType);
export const removeWalletTypeCookie = () => removeCookie("walletType");

// 設定開遊戲專用token
export const getGwToken = () => getCookie("gwToken");
export const setGwToken = (gwToken) => setCookie("gwToken", gwToken);
export const removeGwToken = () => removeCookie("gwToken");

// 判斷玩家屬性
export const getTmpl = () => getCookie("tmpl");
export const removeTmpl = () => removeCookie("tmpl");

// 聲音切換管理
export const setSeState = (SeButtonValue) =>
  setCookie("seState", SeButtonValue);
export const setBgmState = (bgmSound) => setCookie("bgmState", bgmSound);
export const getSeState = () => getCookie("seState");
export const getBgmState = () => getCookie("bgmState");
export const removeSe = () => removeCookie("seState");
export const removeBgm = () => removeCookie("bgmState");

// 確認是否為首次登入玩家
export const getisNewPlayer = () => getCookie("isNewPlayer");
export const setisNewPlayer = (isNew) => setCookie("isNewPlayer", isNew);
export const removeisNewPlayer = () => removeCookie("isNewPlayer");

// 語系管理
export const setLang = (curLang) => setCookie("language", curLang);
export const getLang = () => getCookie("language");

// oldPassword
export const getOldPassword = () => getCookie("oldPassword");
export const setOldPassword = (oldPassword) =>
  setCookie("oldPassword", oldPassword);
export const removeOldPassword = () => removeCookie("oldPassword");

// 存款訂單時間
export const setFailedTime = (time) => setCookie("deposit_form_failed", time);
export const getFailedTime = () => getCookie("deposit_form_failed");

// 存款訂單資訊
export const setEditName = (name) => setCookie("edit_name", name);
export const setEditNum = (phone) => setCookie("edit_phone", phone);
export const getEditName = () => getCookie("edit_name");
export const getEditNum = () => getCookie("edit_phone");
export const removeEditName = () => removeCookie("edit_name");
export const removeEditNum = () => removeCookie("edit_phone");

// 提款
export const setWithdrawWay = (withdrawWay) =>
  setCookie("withdraw_way", withdrawWay);
export const setWithdrawAm = (withdrawAm) =>
  setCookie("withdraw_am", withdrawAm);
export const setBankAccNum = (bankAccNum) =>
  setCookie("bank_acc_num", bankAccNum);
export const setBankAccName = (bankAccName) =>
  setCookie("bank_acc_name", bankAccName);
export const setTaxId = (taxid) => setCookie("taxid", taxid);
export const setPhoneNum = (phoneNum) => setCookie("phoneNum", phoneNum);
export const setPixType = (PIXType) => setCookie("PixType", PIXType);
export const setPixKey = (PIXKey) => setCookie("PixKey", PIXKey);
export const setWithdrawType = (withdrawType) =>
  setCookie("withdraw_type", withdrawType);
export const setBankId = (id) => setCookie("bank_id", id);

export const getWithdrawWay = () => getCookie("withdraw_way");
export const getWithdrawAm = () => getCookie("withdraw_am");
export const getBankAccNum = () => getCookie("bank_acc_num");
export const getBankAccName = () => getCookie("bank_acc_name");
export const getTaxId = () => getCookie("taxid");
export const getPhoneNum = () => getCookie("phoneNum");
export const getPixType = () => getCookie("PixType");
export const getPixKey = () => getCookie("PixKey");
export const getWithdrawType = () => getCookie("withdraw_type");
export const getBankId = () => getCookie("bank_id");

export const removeBankNum = () => removeCookie("bank_acc_num");
export const removeBankName = () => removeCookie("bank_acc_name");
export const removeWithdrawAm = () => removeCookie("withdraw_am");
export const removeWithdrawWay = () => removeCookie("withdraw_way");
export const removeBankId = () => removeCookie("bank_id");
export const removeTaxId = () => removeCookie("taxid");
export const removePhoneNum = () => removeCookie("phoneNum");
export const removePixType = () => removeCookie("PixType");
export const removePixKey = () => removeCookie("PixKey");

// 登出移除玩家資訊
export const removeAuthCookie = () => {
  removeToken();
  removeNormalUser();
  removePlayerId();
  removeUserInfoCookie();
  removeUuid();
};
