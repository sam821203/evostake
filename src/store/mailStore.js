import { defineStore } from "pinia";
import { mailNotificationApi } from "@/api/mail";

export const useMail = defineStore("mailStore", {
  state: () => ({
    isShowUnread: false,
  }),

  actions: {
    async getMailNotification() {
      const { data } = await mailNotificationApi();
      const unread = data.data.mail_unread;
      if (data.code === 0) {
        if (unread > 0) {
          this.isShowUnread = true;
        } else {
          this.isShowUnread = false;
        }
      }
    },
  },
});
