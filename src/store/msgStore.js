import { defineStore } from "pinia";
export const useMessage = defineStore("msgStore", {
  state: () => ({
    title: "",
    content: "",
    hasBtn: true,
    type: "normal",
    resolve: null,
    reject: null,
    contentVal: null,
    slot: "",
    hasCancel: false,
    deposit: false,
    entryGame: false,
    joinGame: false,
  }),
  actions: {
    /**
     * 開啟彈跳訊息函式
     * @param {Object} message - 訊息需要的內容
     * @param {string} employee.title - 標題
     * @param {string} employee.content - 內容
     * @param {boolean} employee.hasBtn - 有無確定按鈕
     * @param {"normal" | "error" | "warning"} employee.type - 彈跳訊息種類
     */
    openMsg({
      title = "",
      content,
      hasBtn = true,
      type = "normal",
      contentVal,
      slot,
      hasCancel,
      deposit,
      entryGame,
      joinGame,
    }) {
      this.title = title;
      this.content = content;
      this.hasBtn = hasBtn;
      this.type = type;
      this.contentVal = contentVal;
      this.slot = slot;
      this.hasCancel = hasCancel;
      this.deposit = deposit;
      this.entryGame = entryGame;
      this.joinGame = joinGame;

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    beforeClose(action) {
      if (action === "confirm") {
        this.resolve();
      } else if (action === "cancel") {
        this.reject();
      }
    },
  },
});
