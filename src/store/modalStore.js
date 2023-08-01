import { defineStore } from "pinia";

export const useModal = defineStore("modalStore", {
  state: () => ({
    curModal: "",
    childView: "",
    tags: [],
    curTag: "",
    isModalOpen: false,
    styleType: "",
    closeBtn: true,
  }),
  actions: {
    insertTag(data) {
      this.tags = data;
    },
    findTag(target) {
      this.curTag = target;
    },
    modalType(components, styleType, childName = "") {
      // components: 開啟組件名稱，styleType: 彈跳視窗樣式(search: 查詢類、form: 操作類、error: 錯誤)
      this.curModal = components;
      this.styleType = styleType;
      this.childView = childName;
    },
    toggleModal(boolean) {
      this.isModalOpen = boolean;
      if (!boolean) {
        this.curModal = "";
        this.styleType = "";
        this.childView = "";
      }
    },
  },
});
