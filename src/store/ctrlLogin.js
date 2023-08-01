import { defineStore } from "pinia";
export const usectrlLogin = defineStore("ctrlLogin", {
  state: () => ({
    loginpageStatus: false,
    // inviteFriendid: "",
  }),
  actions: {
    changeloginpageStatus(bool) {
      this.loginpageStatus = bool;
      if (!bool) {
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    },
  },
});
