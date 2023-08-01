/* eslint-disable no-unused-vars */
import axios from "axios";
import { getToken } from "./cookie";
import pinia from "@/store/pinia";
import { useMessage } from "@/store/msgStore";
import { useAuth } from "@/store/auth";
import i18n from "./i18n";
import { useLoading } from "@/store/loadingStore";
import { usectrlLogin } from "@/store/ctrlLogin";
const loadingStore = useLoading();

const router = () => import("@/router/index");
const { t } = i18n.global;
const msg = useMessage(pinia);
const { openMsg } = msg;
const { logout } = useAuth();
// const kickout = () => {
//   const { logout } = useAuth();
//   logout();
// };

export default (server = "gs") => {
  const instanceConfig =
    server === "gs"
      ? {
          baseURL: process.env.VUE_APP_LOBBYAPI,
        }
      : {
          baseURL: process.env.VUE_APP_SIGNUPAPI,
        };
  const service = axios.create(instanceConfig);

  service.interceptors.request.use(
    (config) => {
      config.headers.Authorization = getToken();
      config.headers["Version-Check"] = process.env.VUE_APP_VERSION;
      config.headers["Accept-Language"] = "pt-BR";

      return config;
    },
    (error) => {
      return error;
    }
  );

  service.interceptors.response.use(
    async (response) => {
      if (response.data.code !== 0 && response.data.code !== 403016) {
        openMsg({
          title: "",
          content: response.data.msg,
          type: "error",
          hasBtn: true,
        });
      }
      if (response.data.code === 400) {
        const name = response.data.msg.split(" ");
        if (name[1] === "已經被使用") {
          openMsg({
            content: `${name[0]} has been used.`,
          });
        }
      }
      if (response.data.code === 200003) {
        logout();
        openMsg({
          title: "",
          content: response.data.msg,
          type: "error",
        })
          .then(() => {
            router().then((res) => {
              console.log("res", res);
              // res.default.push("/auth/login");
              usectrlLogin().$patch({
                loginpageStatus: true,
              });
            });
          })
          .catch((err) => {
            console.log(err);
            router().then((res) => {
              // res.default.push("/auth/login");
              usectrlLogin().$patch({
                loginpageStatus: true,
              });
            });
          });
        return;
        // logout();
        // try {
        //   await openMsg({
        //     title: "",
        //     content: t("此帳號已從別處登入"),
        //     type: "error",
        //   }).then(() => {
        //     router().then((res) => {
        //       console.log("res", res);
        //       res.default.push("/auth/login");
        //     });
        //   });
        // } catch (error) {
        //   router().then((res) => {
        //     res.default.push("/auth/login");
        //   });
        // }
      }
      return response;
    },
    (error) => {
      loadingStore.$patch({
        loadingStatus: false,
      });
      if (error.response.data.code === 700004) {
        console.log(error);
        return;
      }
      // 提款次數錯誤處理
      if (error.response.data.code === 700006) {
        const time = error.response.data.data;
        openMsg({
          content: "error.tradeTime",
          contentVal: { time },
        });
        return;
      }
      if (
        error.response.data.code === 200004 ||
        error.response.data.code === 300001 ||
        error.response.data.code === 700003
      ) {
        // kickout();
        // 回主頁
        openMsg({
          title: "",
          content: error.response.data.msg,
          type: "error",
        })
          .then(() => {
            router().then((res) => {
              console.log("res", res);
              res.default.push("/");
            });
          })
          .catch((err) => {
            console.log(err);
            router().then((res) => {
              res.default.push("/");
            });
          });
        return;
      }
      if (error.response.data.code === 200003) {
        // kickout();
        // 回主頁
        logout();
        openMsg({
          title: "",
          content: error.response.data.msg,
          type: "error",
        })
          .then(() => {
            router().then((res) => {
              console.log("res", res);
              // res.default.push("/auth/login");
              usectrlLogin().$patch({
                loginpageStatus: true,
              });
            });
          })
          .catch((err) => {
            console.log(err);
            router().then((res) => {
              // res.default.push("/auth/login");
              usectrlLogin().$patch({
                loginpageStatus: true,
              });
            });
          });
        return;
      }

      if (error.response.data.code === 7777777) {
        openMsg({
          title: "",
          content: t("系統維護中"),
          type: "error",
        });
        return;
        // kickout();
      }

      if (error.response.data.code === 100002) {
        // kickout();
        openMsg({
          title: "",
          content: error.response.data.msg,
          type: "error",
        })
          .then(() => {
            router().then((res) => {
              res.default.push("/");
            });
          })
          .catch((err) => {
            console.log(err);
            router().then((res) => {
              res.default.push("/");
            });
          });
        return;
      }

      if (error.response.data.code === 8888888) {
        // expected version is 1.0.67
        openMsg({
          content: t("openMsg.versionUpdate"),
          type: "error",
        })
          .then(() => {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
              registrations.forEach((registration) => {
                registration.unregister();
              });
              // kickout();
              location.reload();
            });
          })
          .catch((err) => {
            console.log(err);
            navigator.serviceWorker.getRegistrations().then((registrations) => {
              registrations.forEach((registration) => {
                registration.unregister();
              });
              // kickout();
              location.reload();
            });
          });
        return;
      }

      // 其它 code 錯誤訊息
      openMsg({
        content: error.response.data.msg,
      });

      return new Promise(error);
    }
  );
  return service;
};
