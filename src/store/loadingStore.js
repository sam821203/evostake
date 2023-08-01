import { defineStore } from "pinia";

export const useLoading = defineStore("loadingStore", {
  state: () => ({
    loadingStatus: false,
  }),
});
