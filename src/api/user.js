import request from "@/utils/request";
export const registerApi = (data) => {
  return request("bs")({
    url: "/player",
    method: "post",
    data,
  });
};
export const loginApi = (data) => {
  return request()({
    url: "/member/login",
    method: "post",
    data,
  });
};

export const coinApi = () => {
  return request()({
    url: "/member/balance",
    method: "get",
  });
};

export const userInfoApi = (time) => {
  const url = time
    ? `/member/info?start_time=${time.start_time}&end_time=${time.end_time}`
    : "/member/info";
  return request()({
    url,
    method: "get",
  });
};

export const editNicknameApi = (data) => {
  return request()({
    url: "/member/nickname",
    method: "put",
    data,
  });
};

export const editRealNameApi = (data) => {
  return request()({
    url: "/member/real_name",
    method: "put",
    data,
  });
};

export const editPasswordApi = (data) => {
  return request()({
    url: "member/pwd",
    method: "put",
    data,
  });
};

export const checkAccountApi = (data) => {
  return request("bs")({
    url: "/check/ac",
    method: "post",
    data,
  });
};

export const checkNicknameApi = (data) => {
  return request("bs")({
    url: "/check/nickname",
    method: "post",
    data,
  });
};

export const checkPhoneApi = (data) => {
  return request("bs")({
    url: "/psms",
    method: "post",
    data,
  });
};

export const checkVersionApi = () => {
  return request()({
    url: "/x/version_check",
    method: "get",
  });
};

export const upgradeUserApi = () => {
  return request()({
    url: "/member/full_member",
    method: "post",
  });
};

export const testWalletApi = () => {
  return request()({
    url: "/member/test_balance",
    method: "get",
  });
};
