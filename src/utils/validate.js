import { string, ref as yupRef } from "yup";

// 暱稱
export const nicknameValidate = string()
  .matches(
    /^[a-zA-Z0-9\u4E00-\u9FA5\uf900-\ufa2d]*$/,
    "register.nicknameConfirm"
  )
  .min(2, "register.nicknameConfirm")
  .max(25, "register.nicknameConfirm")
  .required("login.incomplete");

// 帳號
export const loginAcValidate = string()
  .matches(/^[a-zA-Z0-9]{6,12}$/, "register.accountConfirm")
  .required("login.incomplete");

// 密碼
export const passwordValidate = string()
  .matches(/^[a-zA-Z0-9]{6,12}$/, "register.passwordLimit")
  .required("login.incomplete");

// 確認密碼
export const confirmPwdValidate = (yup) =>
  string()
    .matches(/^[a-zA-Z0-9]{6,12}$/, "register.passwordLimit")
    .required("login.incomplete")
    .oneOf([yupRef(yup), null], "register.passwordHint");

// 交易碼
export const tradePasswordValidate = string()
  .matches(/^[a-zA-Z0-9]{4,6}$/, "register.tradePwdLimit")
  .required("login.incomplete");

export const confirmTradePwdValidate = string()
  .matches(/^[a-zA-Z0-9]{4,6}$/, "register.checktradePwdLimit")
  .required("login.incomplete")
  .oneOf([yupRef("secpwd"), null], "register.passwordHint");
