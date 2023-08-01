import { defineStore } from "pinia";

export const serviceConect = defineStore("serviceConnet", {
  state: () => ({
    serviceConectStatus: false,
  }),

  actions: {
    setserviceConectData(d) {
      this.serviceConectStatus = d;
    },
  },
});
