import request from "@/utils/request";
// import { getPlayerId } from "@/utils/cookie";
// import { agentac } from "@/utils/getAgent";
/**取得所有小遊戲 */
var urls = `/mini_games`;
export const minigameApi = () => {
  return request()({
    url: urls,
    method: "get",
  });
};

/**取得小遊戲中獎 */
export const minigameDataApi = (game) => {
  return request()({
    url: `${urls}/${game}`,
    method: "post",
  });
};
