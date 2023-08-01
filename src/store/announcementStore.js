import { defineStore } from "pinia";
import { getAnnouncementApi } from "@/api/announcement";

export const useAnnouncement = defineStore("announcementStore", {
  state: () => ({
    readedData: [],
    eventData: [],
    normalData: [],
    normalDetailData: {},
    promotionScrollTop: 0,
  }),

  actions: {
    async getAnnouncementData() {
      const { data } = await getAnnouncementApi();
      this.readedData = data.data.readed;
      this.eventData = data.data.event;
      this.normalData = data.data.normal;
    },
    hasAct(type) {
      const data = type === "event" ? this.eventData : this.normalData;
      let tempData = [...data];
      data.forEach(({ id }) => {
        if (this.readedData.includes(String(id))) {
          tempData = tempData.filter((item) => item.id !== id);
        }
      });
      return tempData.length > 0;
    },
    setNormalDetailData(data) {
      this.normalDetailData = data;
    },
    setPromotionScrollTop(d) {
      this.promotionScrollTop = d;
    },
  },
});
