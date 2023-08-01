import request from "@/utils/request";
export const getFriendsApi = (id) => {
  return request()({
    url: `/players?direct_under=${id}`,
    method: "get",
  });
};

export const getRebateApi = (start, end) => {
  return request()({
    url: `/players/rebate?start_time=${start}&end_time=${end}`,
    method: "get",
  });
};
