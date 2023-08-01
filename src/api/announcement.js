import request from "@/utils/request";
import { getPlayerId } from "@/utils/cookie";
import { agentac } from "@/utils/getAgent";
import { useStore } from "@/store/index";
// 取得公告
export const getAnnouncementApi = () => {
  const { useAuth } = useStore();
  const authStore = useAuth();

  let urls = "";
  if (getPlayerId() === undefined) {
    urls = `/member/announcement/?agent=${agentac ?? "kentest"}`;
  } else {
    urls = `/member/announcement/?agent=${
      agentac ?? authStore.userInfo.agent_name
    }&u9=${getPlayerId()}`;
  }

  return request()({
    url: urls,
    method: "get",
  });
};

// 讀取公告
export const readAnnouncementApi = (id) => {
  return request()({
    url: `/member/announcement/${id}`,
    method: "put",
  });
};

// 取得公告用圖片
export const getAnoucementImg = (pictureID) => {
  return request()({
    url: `/member/announcement/${pictureID}`,
    method: "get",
    responseType: "blob",
  });
};

// 取得首頁輪播圖片
export const getBannersApi = () => {
  return request()({
    url: `/banners/?agent=${agentac ?? "kentest"}`,
    method: "get",
    // responseType: "blob",
  });
};

// 取得待領活動
export const getBonusListApi = (account) => {
  return request()({
    url: `/event/${account}`,
    method: "get",
  });
};

// 領取活動
export const claimBonusApi = (claimId, type) => {
  return request()({
    url: `/event/claim/${getPlayerId()}/${type}/${claimId}`,
    method: "get",
  });
};
