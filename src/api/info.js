import request from "@/utils/request.js";

export const leaderBoardApi = (balance, player_id) => {
  var urls = `/ranks/0?type=${balance}`;
  if (player_id != "") {
    urls += `&player_id=${player_id}`;
  }
  return request()({
    url: urls,
    method: "get",
  });
};

export const jpPrizePoolApi = () => {
  return request()({
    url: "/prizes",
    method: "get",
  });
};

export const vipApi = () => {
  return request()({
    url: "/vip_info",
    method: "get",
  });
};

export const switchSoundApi = (data) => {
  return request()({
    url: "/member/sound",
    method: "put",
    data,
  });
};
