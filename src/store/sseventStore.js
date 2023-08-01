import { EventSourcePolyfill } from "event-source-polyfill";
import { defineStore } from "pinia";
import { useMessage } from "@/store/msgStore";
import { useMail } from "@/store/mailStore";
import { useStore } from "@/store/index";
const router = () => import("@/router/index");
import { getToken } from "@/utils/cookie";

const msg = useMessage();
const { openMsg } = msg;

const mailStore = useMail();
const { getMailNotification } = mailStore;

const EventSource = EventSourcePolyfill;

export const useSsevent = defineStore("sseventStore", {
  state: () => ({
    sseventInstance: null,
    balanceData: {
      TWD: {
        balance: 0,
      },
      TEST: {
        balance: 0,
      },
      USDT: {
        balance: 0,
      },
    },
    marqueeData: [],
    mail: [],
    errorSataus: false,
  }),
  actions: {
    openSsevent() {
      this.sseventInstance = new EventSource(
        `${process.env.VUE_APP_SEEVENT}/core/ssevent`,
        {
          headers: { Authorization: getToken() },
        }
      );
      this._discounnect();
      this._updateBalance();
      this._getMarquee();
      this._getNewMail();
      this._getError();
    },
    async _discounnectListener(e) {
      if (e.data) {
        this.closeSsevent();
        const store = useStore();
        const { useAuth } = store;
        const { logout } = useAuth();
        logout();
        console.log(123, e.data);
        try {
          await openMsg({
            content: e.data,
          });
          await router().then((res) => {
            res.default.push("/");
          });
        } catch (error) {
          await router().then((res) => {
            res.default.push("/");
          });
        }
      }
    },
    async _updateBalanceListener(e) {
      console.log(JSON.parse(e.data), "-----balance-----");
      const currency = JSON.parse(e.data)?.currency;
      this.balanceData[currency].balance = JSON.parse(e.data)?.balance;
    },
    async _getMarqueeListener(e) {
      if (this.errorSataus) {
        return setTimeout(() => (this.errorSataus = false), 1000);
      }
      this.marqueeData = JSON.parse(e.data);
    },
    async _getNewMailListener(e) {
      if (this.errorSataus) {
        return setTimeout(() => (this.errorSataus = false), 1000);
      }
      if (e.data) {
        getMailNotification();
      }
    },
    _getErrorListener(e) {
      this.errorSataus = true;
      console.log(e);
    },
    _discounnect() {
      this.sseventInstance.addEventListener(
        "disconnect",
        this._discounnectListener
      );
    },
    _updateBalance() {
      this.sseventInstance.addEventListener(
        "update_balance",
        this._updateBalanceListener
      );
    },
    _getMarquee() {
      this.sseventInstance.addEventListener(
        "new_newsticker",
        this._getMarqueeListener
      );
    },
    _getNewMail() {
      this.sseventInstance.addEventListener(
        "new_mail",
        this._getNewMailListener
      );
    },
    _getError() {
      this.sseventInstance.addEventListener("error", this._getErrorListener);
    },
    _closeEventListener() {
      this.sseventInstance.removeEventListener(
        "disconnect",
        this._discounnectListener
      );
      this.sseventInstance.removeEventListener(
        "update_balance",
        this._updateBalanceListener
      );
      this.sseventInstance.removeEventListener(
        "new_newsticker",
        this._getMarqueeListener
      );
      this.sseventInstance.removeEventListener(
        "new_mail",
        this._getNewMailListener
      );
      this.sseventInstance.removeEventListener("error", this._getErrorListener);
    },
    closeSsevent() {
      this.sseventInstance?.close();
      if (this.sseventInstance) {
        this._closeEventListener();
      }
    },
  },
});
