import { defineStore } from "pinia";
import { minigameApi, minigameDataApi } from "@/api/minigame";

export const useMinigame = defineStore("minigameStore", {
  state: () => ({
    isSuccess: false,
    isAvailable: false,
    isCanPlay: false,
    openGamesCount: 0,
    cooldown_seconds: 0,
    result: [],
    gameList: [],
  }),

  actions: {
    /**
     * 取得所有小遊戲狀態
     */
    async getMiniGame() {
      const { data } = await minigameApi();
      if (data.code === 0) {
        this.gameList = data.data;
        this.isSuccess = true;
      } else {
        this.isSuccess = false;
      }
    },
    /**
     * 取得對應小遊戲資料
     * @param game 遊戲類別
     */
    async getMiniGameData(game) {
      const { data } = await minigameDataApi(game);
      if (data.code === 0) {
        console.log(data.data);
        let cash = [];
        cash.push(data.data.level); //玩家VIP等級
        if (game === "patrick") {
          data.data.result.forEach((num) => {
            cash.push((num = num / 10000));
          });
        } else {
          cash.push(data.data.stage); //玩家第幾天登入
          cash.push(data.data.reward / 10000); //金額
        }

        console.log(cash);
        this.result = cash;
        this.isSuccess = true;
      } else {
        this.isSuccess = false;
      }
    },
    /**
     * 設定小遊戲Icon狀態
     */
    setMiniGameState(state) {
      this.openGamesCount = state
        ? ++this.openGamesCount
        : --this.openGamesCount;
      this.isCanPlay = this.openGamesCount > 1; //7日遊戲開啟後，要改>0
    },
  },
});
