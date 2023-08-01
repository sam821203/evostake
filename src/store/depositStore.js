import { defineStore } from "pinia";

export const useDeposit = defineStore("depositStore", {
  state: () => ({
    taxId: null,
    phone: null,
    type: null,
    pixKey: null,
    orderNum: null,
  }),
});
