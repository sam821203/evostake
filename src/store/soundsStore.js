import { defineStore } from "pinia";
// import {
//   setSeState,
//   setBgmState,
//   // getSeState,
//   // getBgmState,
// } from "@/utils/cookie";
import { switchSoundApi } from "@/api/info";

export const useSounds = defineStore("soundsStore", {
  state: () => ({
    bgmSound: false,
    forceCloseBgm: false, // 進遊戲強制關閉音效
    // bgmButtonValue: "on",
    SeButtonValue: "off",
    settingSound: null,
    cancelBtnSound: null,
  }),
  actions: {
    async switchBgm() {
      if (this.bgmSound) {
        this.bgmSound = false;
        const res = await switchSoundApi({
          music: false,
          sound_fx: this.SeButtonValue === "off" ? false : true,
        });
        console.log(res);
      } else if (!this.bgmSound) {
        this.bgmSound = true;
        const res = await switchSoundApi({
          music: true,
          sound_fx: this.SeButtonValue === "off" ? false : true,
        });
        console.log(res);
      }
    },
    async switchSe() {
      if (this.SeButtonValue === "on") {
        this.SeButtonValue = "off";
        const res = await switchSoundApi({
          music: this.bgmSound === false ? false : true,
          sound_fx: false,
        });
        console.log(res);
        console.log(this.SeButtonValue);
      } else if (this.SeButtonValue === "off") {
        this.SeButtonValue = "on";
        const res = await switchSoundApi({
          music: this.bgmSound === false ? false : true,
          sound_fx: true,
        });
        console.log(res);
      }
      // getUserInfo();
      // setSeState(this.SeButtonValue);
    },
    // getBgmSetting() {
    //   console.log(getBgmState("bgmState"));
    //   if (this.bgmSound === false || !getBgmState("bgmState")) {
    //     setBgmState(this.bgmSound);
    //   } else {
    //     this.bgmSound = getBgmState("bgmState");
    //     if (this.bgmSound === false) {
    //       this.bgmButtonValue === "off";
    //     }
    //   }
    // },
  },
});
