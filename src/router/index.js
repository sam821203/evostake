import { ref } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import layout from "@/layouts/default";
import { useStore } from "@/store/index";
const { useAnnouncement } = useStore();
const { setPromotionScrollTop } = useAnnouncement();

import { storeToRefs } from "pinia";
import i18n from "@/utils/i18n";
const { t } = i18n.global;
import { getEditNum, setUuid, removeUuid } from "@/utils/cookie";
// import { upgradeUserApi } from "@/api/user";
import { usectrlLogin } from "@/store/ctrlLogin";

const { useMessage, useAuth, useDeposit, useModal } = useStore();
const { openMsg } = useMessage();

const authStore = useAuth();
const { logout } = authStore;
const { token, userInfo } = storeToRefs(authStore);

const depositStore = useDeposit();
const { orderNum } = storeToRefs(depositStore);

const modalStore = useModal();
const { toggleModal, modalType } = modalStore;

const Uuid = ref(null);

const routes = [
  {
    path: "/",
    name: "home",
    component: layout,
    redirect: "/home",
    children: [
      {
        path: "home/:id?",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: {
          auth: false,
          name: "首頁",
        },
      },
      {
        path: "gameLobby/:category/:studio?",
        name: "gameLobby",
        component: () => import("@/views/home/gameLobby"),
        meta: {
          auth: false,
          name: "遊戲房間",
        },
      },
    ],
  },
  {
    path: "/member",
    name: "member",
    component: () => import("@/layouts/operation"),
    meta: {
      auth: true,
    },
    children: [
      {
        path: "memberCenter",
        name: "memberCenter",
        meta: {
          auth: true,
          name: "我的",
        },
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/member/memberCenterView"
          ),
      },
    ],
  },
  {
    path: "/deposit",
    component: () => import("@/layouts/operation"),
    meta: {
      auth: true,
    },
    children: [
      {
        path: "deposit",
        name: "deposit",
        meta: {
          auth: true,
          name: "存款",
        },
        component: () =>
          import(/* webpackChunkName: "deposit" */ "../views/deposit/deposit"),
      },
      // {
      //   path: "depositForm",
      //   name: "depositForm",
      //   meta: {
      //     auth: true,
      //     name: "存款確認",
      //   },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "depositForm" */ "../views/deposit/depositForm"
      //     ),
      // },
      {
        path: "withdraw",
        name: "withdraw",
        meta: {
          auth: true,
          name: "提款",
        },
        component: () =>
          import(
            /* webpackChunkName: "withdraw" */ "../views/deposit/withdraw"
          ),
      },
      {
        path: "tradeRecord",
        name: "tradeRecord",
        meta: {
          auth: true,
          name: "交易紀錄",
        },
        component: () =>
          import(
            /* webpackChunkName: "tradeRecord" */ "../views/deposit/tradeRecord"
          ),
      },

      // {
      //   path: "addBankCard",
      //   name: "addBankCard",
      //   meta: {
      //     auth: true,
      //     name: "新增銀行卡",
      //   },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "about" */ "../views/deposit/addBankCard"
      //     ),
      // },
      {
        path: "withdrawForm",
        name: "withdrawForm",
        meta: {
          auth: true,
          name: "提款確認",
        },
        component: () =>
          import(
            /* webpackChunkName: "withdrawForm" */ "../views/deposit/withdrawForm"
          ),
      },
      {
        path: "addPIX",
        name: "addPIX",
        meta: {
          auth: true,
          name: "新增PIX",
        },
        component: () =>
          import(/* webpackChunkName: "addGCash" */ "../views/deposit/addPIX"),
      },
      // {
      //   path: "gCashSetting",
      //   name: "gCashSetting",
      //   meta: {
      //     auth: true,
      //     name: "提款管理",
      //   },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "gCashSetting" */ "../views/deposit/gCashSetting"
      //     ),
      // },
      {
        path: "editGCash",
        name: "editGCash",
        meta: {
          auth: true,
          name: "編輯GCash",
        },
        component: () =>
          import(
            /* webpackChunkName: "editGCash" */ "../views/deposit/editGCash"
          ),
      },
      {
        path: "safeSetting",
        name: "safeSetting",
        meta: {
          auth: true,
          name: "安全設置",
        },
        component: () => import("../views/deposit/safe"),
      },
    ],
  },
  {
    path: "/info",
    component: () => import("@/layouts/operation"),
    redirect: "/info/announcement",
    meta: {
      auth: true,
    },
    children: [
      {
        path: "announcement",
        name: "announcement",
        meta: {
          auth: false,
          name: "公告",
        },
        component: () => import("../views/operation/announcementView"),
      },
      {
        path: "platformRule",
        name: "platformRule",
        meta: {
          auth: false,
          name: "平台規章",
        },
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/info/platformRule"),
      },
      {
        path: "Q&A",
        name: "Q&A",
        meta: {
          auth: false,
          name: "常見問題",
        },
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/info/q&a"),
      },
      {
        path: "userInfo",
        name: "userInfo",
        meta: {
          auth: true,
          name: "我的",
        },
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/info/userInfo"),
      },
      {
        path: "leaderBoard",
        name: "排行榜",
        meta: {
          auth: false,
          name: t("排行榜"),
        },
        component: () => import("../views/info/leaderBoard"),
      },
    ],
  },
  {
    path: "/operation",
    name: "operation",
    component: () => import("@/layouts/operation"),
    meta: {
      auth: true,
    },
    children: [
      {
        path: "gameRecord",
        name: "gameRecord",
        meta: {
          auth: true,
          name: "投注紀錄",
        },
        component: () => import("../views/operation/gameRecord"),
      },
      {
        path: "friends",
        name: "friends",
        meta: {
          auth: true,
          name: "邀請好友",
        },
        component: () => import("../views/operation/friendsView"),
      },
      {
        path: "vip",
        name: "vip",
        meta: {
          auth: true,
          name: "VIP",
        },
        component: () => import("../views/operation/vip"),
      },
    ],
  },
  {
    path: "/activity",
    name: "activity",
    component: () => import("@/layouts/operation"),
    redirect: "/activity/activityList",
    children: [
      {
        path: "activityList",
        name: "activityList",
        meta: {
          auth: false,
          name: t("活動"), //活動
        },
        component: () => import("../views/operation/activityList"),
      },
      {
        path: "detailpromotionActivity",
        name: "detailpromotionActivity",
        meta: {
          auth: false,
          name: t("詳細活動"),
        },
        component: () => import("../views/operation/detailpromotionActivity"),
      },
    ],
  },
  // {
  //   path: "/auth",
  //   name: "auth",
  //   component: () => import("@/layouts/authLayout"),
  //   meta: {
  //     auth: false,
  //   },
  //   children: [
  //     {
  //       path: "login/:id?",
  //       name: "login",
  //       meta: {
  //         name: "登入",
  //       },
  //       component: () => import("@/views/auth/login"),
  //     },
  //     {
  //       path: "register/:id?",
  //       name: "register",
  //       meta: {
  //         name: "註冊",
  //       },
  //       component: () => import("@/views/auth/register/index"),
  //     },
  //   ],
  // },
  {
    path: "/setting",
    name: "setting",
    component: () => import("@/layouts/operation"),
    children: [
      {
        path: "sound",
        name: "sound",
        meta: {
          auth: false,
          name: "設定",
        },
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/setting/sound"),
      },
    ],
  },
  {
    path: "/gameRoom/:category/:studio?",
    name: "gameRoom",
    component: () => import("@/views/game"),
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("@/views/404"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(from, to) {
    // scrollBehavior() {
    if (
      !(
        (from.name == "detailpromotionActivity" && to.name == "activityList") ||
        (from.name == "activityList" && to.name == "detailpromotionActivity")
      )
    ) {
      setPromotionScrollTop(0);
    }
    // always scroll to top
    return { top: 0 };
  },
});

const authCheck = (to) => {
  const isAuth = to.meta.auth;
  if (isAuth && !token.value) {
    return true;
  }
};

const testPlayerValid = (to) => {
  return (
    userInfo.value.is_test &&
    (to.meta?.name?.includes("存款") ||
      to.meta?.name?.includes("提款") ||
      to.meta?.name?.includes("GCash"))
  );
};

const kick = (to) => {
  // 沒token登入需要token的頁面就踢掉
  const isAuth = to.meta.auth;
  if (isAuth && !token.value) {
    logout();
    // router.push("/auth/login");
    usectrlLogin().$patch({
      loginpageStatus: true,
    });
  }
};

const isLoginGuard = (to) =>
  token.value && (to.name === "login" || to.name === "register"); // 登入不能回登入註冊頁

const isDepositOrder = (to, from) =>
  orderNum.value && to.name === "deposit" && from.name === "depositForm";

const isDeleteOrder = (to, from) =>
  !orderNum.value && from.name === "deposit" && to.name === "depositForm";

const isEditGcash = (to) => {
  if (to.name === "editGCash" && !getEditNum("edit_phone")) {
    return true;
  }
};

const isLogin = (from) => {
  token.value && from.name === "login";
};

const isRegister = (to, from) => {
  if ((to.name === "register" || to.name === "login") && from.name !== "home") {
    return true;
  }
};

const isLogOut = (to, from) => {
  if ((to.name === "register" || to.name === "login") && from.name === "home") {
    return true;
  }
};

router.beforeEach((to, from, next) => {
  const loginGuard = isLoginGuard(to);
  if (loginGuard) {
    next({ name: from.name });
    return;
  }

  const unAuth = authCheck(to);
  if (unAuth) {
    openMsg({ content: t("registerFirst") }).then(() => {
      kick(to);
      next({ name: "home" });
    });

    return;
  }

  const isTestPlayer = testPlayerValid(to);
  if (isTestPlayer) {
    toggleModal(true);
    modalType("UpgradeAccount");

    return;
  }

  const enterOrder = isDepositOrder(to, from);
  if (enterOrder) {
    router.push("/member/memberCenter");
    return;
  }

  const afterDeleteOrder = isDeleteOrder(to, from);
  if (afterDeleteOrder) {
    router.push("/member/memberCenter");
    return;
  }

  const afterEditGcash = isEditGcash(to, from);
  if (afterEditGcash) {
    router.push("/member/memberCenter");
    return;
  }

  const getRegisterUuid = isRegister(to, from);
  if (getRegisterUuid) {
    const url = window.location.href;
    const segments = url.split("/");
    const lastSegment = segments.pop();
    if (lastSegment !== "home") {
      Uuid.value = lastSegment;
      setUuid(Uuid.value);
    }

    console.log(lastSegment);
  }

  const removeRegisterUuid = isLogOut(to, from);
  if (removeRegisterUuid) {
    removeUuid("uuid");
  }

  const removeLoginUuid = isLogin(to, from);
  if (removeLoginUuid) {
    removeUuid("uuid");
  }
  next();
});

export default router;
