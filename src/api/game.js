import request from "@/utils/request";

// RG joygames
// HK goldenwind
// PG pg
// JILI jili
// FC facai
export const getGameListApi = ({
  category = 1,
  limit = 50,
  offset = 0,
  studio = "joygames",
}) => {
  return request()({
    url: `/games?category=${category}&limit=${limit}&offset=${offset}&studio=${studio}`,
    // url: `/games?limit=${limit}&offset=${offset}`,
    method: "get",
  });
};

export const getGameUrlApi = (studio, gameId, data) =>
  request()({
    url: `/games/${studio}/gameplays/${gameId}`,
    method: "post",
    data,
  });

export const checkWallet = () =>
  request()({
    url: "/games/check_tx_wallet",
    method: "post",
  });

export const gethotGame = () =>
  request()({
    url: "/games/hot",
    method: "get",
  });
