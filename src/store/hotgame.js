import { defineStore } from "pinia";
import { gethotGame } from "@/api/game";

export const usehotgameStore = defineStore("hotgameStore", {
  state: () => ({
    hotgamedata: [],
  }),
  actions: {
    /**
     * 取得所有小遊戲狀態
     */
    async gethotGame() {
      const { data } = await gethotGame();
      if (data.code === 0) {
        console.log(data.data);
        this.hotgamedata = data.data;
        // this.isSuccess = true;
      } else {
        // this.isSuccess = false;
      }
    },
  },
});
