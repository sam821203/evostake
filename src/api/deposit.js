import request from "@/utils/request";
export const getBankApi = () => {
  return request()({
    url: "/bank",
    method: "get",
  });
};

export const chargeApi = (id, route, data) => {
  return request()({
    url: `/bank/${id}/${route}`,
    method: "post",
    data,
  });
};

export const getOrderApi = (order) => {
  return request()({
    url: `/bank_orders/${order}`,
    method: "get",
  });
};
export const getAllOrderApi = () => {
  return request()({
    url: "/bank_orders",
    method: "get",
  });
};

export const deleteOrderApi = (order) => {
  return request()({
    url: `/bank_orders/${order}`,
    method: "delete",
  });
};

export const getGCashApi = () => {
  return request()({
    url: "/bank_account",
    method: "get",
  });
};

export const addGCashApi = (phone, data) => {
  return request()({
    url: `/bank_account/brapay/${phone}/name`,
    method: "put",
    data,
  });
};
