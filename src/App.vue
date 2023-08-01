<template>
  <Loading class="loading" v-if="loadingStatus" />
  <div class="iosPopBg" @click="closeIosPop" v-show="showIosImg"></div>
  <div class="iosImg" v-show="showIosImg">
    <img src="@/assets/images/layouts/ios_setting.png" alt="" class="mainPic" />
    <img
      src="@/assets/images/modal/closurel_button.png"
      alt=""
      class="close"
      @click="closeIosPop"
    />
  </div>

  <div
    :class="{ installPWA: showInstallButton }"
    v-if="
      showInstallButton && route.name === 'home' && route.name !== 'gameLobby'
    "
  >
    <div class="left">
      <div class="close" @click="closeDownload">✕</div>
      <img src="@/assets/images/layouts/180x180.png" alt="" />
      <p>Evostake</p>
    </div>
    <div class="right" @click="installPWA">
      <span style="user-select: none">Baixar App</span>
    </div>
  </div>
  <Version />
  <audio ref="lobbyBgm" :src="require('@/assets/sound/lobby.mp3')" loop></audio>
  <audio
    :src="require('@/assets/sound/cancel.mp3')"
    ref="cancelBtnSound"
  ></audio>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <MessageComp v-if="content || slot" />
  <Teleport to="#app">
    <Modal v-if="isModalOpen" />
  </Teleport>
  <transition name="slide">
    <div
      class="slideDiv"
      ref="pageRef"
      v-if="loginpageStatus"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <authLayout />
    </div>
  </transition>

  <router-view />

  <!--小遊戲-->
  <div v-if="routeName === 'home'">
    <MiniGame />
  </div>
  <div class="serviceiframe" v-if="serviceConectStatus">
    <img
      src="@/assets/images/modal/closurel_button.png"
      class="closeBtn"
      @click="setserviceConectData(false)"
    />
    <!--        -->
    <!-- 測試站 -->
    <!-- <iframe
      :src="`./service.html?userIdentity=${getPlayerId()}`"
      frameborder="0"
      ref="iframe"
      allow="autoplay"
    ></iframe> -->
    <!-- 正式站 -->
    <iframe
      src="https://direct.lc.chat/15657093/"
      frameborder="0"
      ref="iframe"
      allow="autoplay"
    ></iframe>

    <!-- <div id="chat"></div> -->
  </div>
</template>
<script setup>
import { ref, onMounted, provide, watch, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import Modal from "@/components/modal/index.vue";
import MessageComp from "@/components/popout/messageComp.vue";
import authLayout from "./layouts/authLayout.vue";
import { useModal } from "@/store/modalStore";
import { useMessage } from "@/store/msgStore";
import { useSounds } from "@/store/soundsStore";

import { serviceConect } from "@/store/serviceConnet";
import mitt from "mitt";
// import { getBgmState, getSeState, setBgmState } from "@/utils/cookie";
import reseizeWindow from "@/utils/reseizeWindow";
import device from "current-device";
import forbidScale from "@/utils/forbidScale";
import Version from "@/views/Version";
import Loading from "@/components/loading";
import { useLoading } from "@/store/loadingStore";
import MiniGame from "@/views/minigame/minigame";
import { useRoute } from "vue-router";
import { getPlayerId } from "@/utils/cookie";
import { usectrlLogin } from "@/store/ctrlLogin";
const loadingStore = useLoading();
const { loadingStatus } = storeToRefs(loadingStore);
const route = useRoute();

import { useStore } from "@/store";

// import { useDeposit } from "@/store/depositStore";
// const depositStore = useDeposit();
// const { getTime } = depositStore;
// getTime();
const modalStore = useModal();
const messageStore = useMessage();
const { isModalOpen } = storeToRefs(modalStore);
const { content, slot } = storeToRefs(messageStore);
const { setserviceConectData } = serviceConect();
const { serviceConectStatus } = storeToRefs(serviceConect());
const soundsStore = useSounds();
const { bgmSound, SeButtonValue, forceCloseBgm } = storeToRefs(soundsStore);
const lobbyBgm = ref(null);
const cancelBtnSound = ref(null);
const emitter = mitt();
const { useAuth } = useStore();

const { loginpageStatus } = storeToRefs(usectrlLogin());

const authStore = useAuth();
const { getUserInfo } = authStore;
const { token, userInfo } = storeToRefs(authStore);

// const { getBgmSetting } = soundsStore;
provide("emitter", emitter);
// 禁止放大瀏覽器
forbidScale();
// getBgmSetting();
const deferredPrompt = ref(null);
const showInstallButton = ref(false);
const showIosImg = ref(false);
const closeIosPop = () => {
  showIosImg.value = false;
};

window.addEventListener("scroll", function () {
  if (showIosImg.value === false) {
    const html = document.querySelector("html");
    const { scrollTop } = html;
    if (scrollTop > 60) {
      showInstallButton.value = false;
      authStore.$patch({
        showPwa: false,
      });
    }
  }
});

window.addEventListener("beforeunload", function () {
  showInstallButton.value = false;
  authStore.$patch({
    showPwa: false,
  });
});

const closeDownload = () => {
  showInstallButton.value = false;
  authStore.$patch({
    showPwa: false,
  });
};
const installPWA = () => {
  // 觸發安裝提示

  if (
    detectBrowser.isIOs() ||
    detectBrowser.isIpad() ||
    detectBrowser.isMac()
  ) {
    console.log("ios安裝");
    showIosImg.value = true;
  } else {
    console.log("安卓安裝");
    deferredPrompt.value.prompt();
    deferredPrompt.value.userChoice.then((choiceResult) => {
      // 使用者做出了安裝選擇
      if (choiceResult.outcome === "accepted") {
        console.log("使用者安裝了 PWA。");
      } else {
        console.log("使用者拒絕了安裝 PWA。");
      }
      // 重置 deferredPrompt，以便下次觸發時能夠再次彈出安裝提示
      deferredPrompt.value = null;
    });
    showInstallButton.value = false;
    authStore.$patch({
      showPwa: false,
    });
  }
};

// 要單獨處理

const detectBrowser = {
  isIOs: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
  isIpad: () => {
    if (/iPad/i.test(navigator.userAgent)) {
      return true;
    }
    if (/Macintosh/i.test(navigator.userAgent)) {
      try {
        document.createEvent("TouchEvent");
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  },
  isMac: () => {
    return /Macintosh|Mac OS X/i.test(navigator.userAgent);
  },
};
onMounted(async () => {
  // let script = document.createElement("script");
  // script.type = "text/javascript";
  // script.src = "https://chat.d8.run/dist/js/widget.js";
  // document.body.appendChild(script);
  // const userIdentity = "0000-1111-2222-3333";

  // window.onload = () => {
  //   window.d8Chat.init("#chat", userIdentity);
  // };
  reseizeWindow();
  window.addEventListener("resize", () => {
    if (device.mobile()) {
      reseizeWindow();
    }
  });
  // getSoundsCookie();

  console.log(token.value);
  if (token.value) {
    await getUserInfo();
    nextTick(() => {
      if (token.value) {
        console.log(userInfo.value.music);
        if (userInfo.value.music === true) {
          const clickToPlayBGM = () => {
            lobbyBgm.value.play();
            // setBgmState(true);
            soundsStore.$patch({
              bgmSound: true,
            });
            window.removeEventListener("click", clickToPlayBGM);
          };
          window.addEventListener("click", clickToPlayBGM);
        } else {
          lobbyBgm.value.pause();
          soundsStore.$patch({
            bgmSound: false,
          });
        }
        if (userInfo.value.sound_fx === true) {
          soundsStore.$patch({
            SeButtonValue: "on",
          });
          cancelBtnSound.value.play();
        } else {
          soundsStore.$patch({
            SeButtonValue: "off",
          });
          cancelBtnSound.value.pause();
        }
      }
    });
  }
  if (
    detectBrowser.isIOs() ||
    detectBrowser.isIpad() ||
    detectBrowser.isMac()
  ) {
    console.log("判斷是否在IOS運行PWA");
    if (window.navigator.standalone) {
      // 使用者可能在 PWA 模式下運行
      showInstallButton.value = false;
      authStore.$patch({ showPwa: false });
    } else {
      showInstallButton.value = true;
      authStore.$patch({ showPwa: true });
    }
  } else {
    console.log("判斷是否在安卓運行PWA");
    // 監聽 beforeinstallprompt 事件
    window.addEventListener("beforeinstallprompt", (event) => {
      console.log(event);
      event.preventDefault(); // 阻止瀏覽器預設的安裝提示
      deferredPrompt.value = event; // 保存事件實例，以便稍後觸發安裝提示
      showInstallButton.value = true; // 顯示安裝按鈕
    });
    console.log(deferredPrompt.value);
    // 檢查是否已經安裝 PWA，且用PWA開啟，如果已經安裝，隱藏安裝按鈕
    // if (window.matchMedia("(display-mode: standalone)").matches) {
    //   console.log("安卓有安裝PWA1");
    //   showInstallButton.value = false;
    //   authStore.$patch({ showPwa: false });
    // } else {
    //   console.log("安卓沒安裝PWA2");
    //   showInstallButton.value = true;
    //   authStore.$patch({ showPwa: true });
    // }
    showInstallButton.value = false;
    authStore.$patch({ showPwa: false });
  }
});

watch(deferredPrompt, (v) => {
  if (v != null) {
    if (
      deferredPrompt.value !== null &&
      !window.matchMedia("(display-mode: standalone)").matches
    ) {
      console.log("安卓沒安裝PWA3");
      showInstallButton.value = true;
      authStore.$patch({ showPwa: true });
    } else {
      console.log("安卓有安裝PWA4");
      showInstallButton.value = false;
      authStore.$patch({ showPwa: false });
    }
  }
});

watch(route, (v) => {
  if (v.params.id) {
    // 若有在網址後面攜帶 id
    usectrlLogin().$patch({
      loginpageStatus: true,
      // inviteFriendid: v.params.id,
    });
  }
});

const routeName = computed(() => route.name);
watch(
  bgmSound,
  (val) => {
    nextTick(() => {
      if (val) {
        lobbyBgm.value.play();
        soundsStore.$patch({
          bgmSound: true,
        });
      } else {
        lobbyBgm.value.pause();
        soundsStore.$patch({
          bgmSound: false,
        });
      }
    });
  },
  {
    immediate: true,
  }
);

// watch(
//   SeButtonValue,
//   (val) => {
//     nextTick(() => {
//       if (val) {
//         cancelBtnSound.value.play();
//         soundsStore.$patch({
//           SeButtonValue: "on",
//         });
//       } else {
//         cancelBtnSound.value.pause();
//         soundsStore.$patch({
//           SeButtonValue: "off",
//         });
//       }
//     });
//   },
//   {
//     immediate: true,
//   }
// );

watch(token, (val) => {
  if (!val) {
    soundsStore.$patch({
      forceCloseBgm: true,
    });
  }
});

watch(forceCloseBgm, (isClose) => {
  isClose ? lobbyBgm.value.pause() : lobbyBgm.value.play();
});

watch(isModalOpen, (val) => {
  if (!val) {
    nextTick(() => {
      if (SeButtonValue.value === "on") {
        cancelBtnSound.value.play();
      } else if (SeButtonValue.value === "off") {
        cancelBtnSound.value.pause();
      }
    });
  }
});

// const getSoundsCookie = () => {
//   if (getBgmState("bgmState") !== "false") {
//     const clickToPlayBGM = () => {
//       lobbyBgm.value.play();
//       setBgmState(true);
//       soundsStore.$patch({
//         bgmSound: true,
//       });
//       window.removeEventListener("click", clickToPlayBGM);
//     };
//     window.addEventListener("click", clickToPlayBGM);
//   } else if (getBgmState("bgmState") === "false") {
//     lobbyBgm.value.pause();
//     soundsStore.$patch({
//       bgmSound: false,
//     });
//   }
//   if (getSeState("seState") === "off") {
//     soundsStore.$patch({
//       SeButtonValue: "off",
//     });
//     cancelBtnSound.value.pause();
//   }
// };
const servieIframeHeight = ref("");
const adjustHeight = async () => {
  servieIframeHeight.value = window.innerHeight + "px";
};
onMounted(async () => {
  console.log(getPlayerId());
  await adjustHeight();
  window.addEventListener("resize", () => {
    adjustHeight();
  });
});
//
const startX = ref(0); // 拖拉起始位置X坐標
const endX = ref(0); // 拖拉結束位置X坐標
const threshold = 50; // 拖拉閾值，超過該值才判斷為有效拖拉
const pageRef = ref(); // 創建響應式引用
const posX_LeaveBegin = ref("0%");
const onTouchStart = (event) => {
  startX.value = event.touches[0].clientX; // 紀錄拖拉起始位置X坐標
  posX_LeaveBegin.value = "0%";
};

const onTouchMove = (event) => {
  // event.preventDefault(); //避免 mouse 和 touch 事件衝突
  endX.value = event.touches[0].clientX; // 紀錄拖拉結束位置X坐標

  if (loginpageStatus.value) {
    let distance = endX.value - startX.value; // 計算拖拉距離
    let pageElement = pageRef.value; // 獲取頁面元素的引用
    let pagePosition = pageElement.getBoundingClientRect(); // 獲取頁面元素的位置信息

    //防呆
    if (pageElement == null) {
      return;
    }

    //不能超過畫面左側x=0，distance>0避免一開始往左拉而出現白邊
    if (pagePosition.x >= 0 && distance > 0) {
      pageElement.style.transform = `translateX(${distance}px)`; // 更新頁面元素的平移效果
      posX_LeaveBegin.value = `${
        (pagePosition.x / pageRef.value.clientWidth) * 100
      }%`;
      // requestAnimationFrame(onTouchMove);
      //console.log(`pagePosition.x = ${pagePosition.x}, distance = ${distance}`);
    }
  }
  // console.log(`touchMove`);
};

const onTouchEnd = () => {
  let distance = endX.value - startX.value; // 計算拖拉距離
  let pageElement = pageRef.value; // 獲取頁面元素的引用

  //防呆
  if (pageElement == null) {
    return;
  }

  pageElement.style.transform = ""; // 清除拖拉而綁定的style.transform參數

  if (Math.abs(distance) > threshold) {
    // 右滑關閉頁面
    if (distance > 0 && loginpageStatus.value) {
      loginpageStatus.value = false;
    }
    // 左滑打開頁面
    else if (distance < 0 && !loginpageStatus.value) {
      loginpageStatus.value = true;
    }
  }

  startX.value = 0;
  endX.value = 0;
};
</script>
<style lang="scss">
html {
  background-image: url("@/assets/images/lobby_bg.jpg");
  background-size: 100%;
}
html,
body {
  margin: 0;
  // 做電腦版時移除
  /* width: 100vw; */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
#app {
  font-family: Arial, Microsoft JhengHei, sans-serif;
  // width: 470px;
  margin: 0 auto;
  position: relative;
  // padding: 0.25rem;
  width: 100%;
  min-height: calc(100vh);
  // overflow-x: hidden;
  // word-break: keep-all;
  word-wrap: break-word;
  overflow-wrap: break-word;
  @include breakpoint-up("lg") {
    max-width: 470px;
    // max-height: 1080px;
  }
  // background-image: url("@/assets/images/bg.jpg");
  // background-position: 0 0;
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  background: #23003e;
  color: $primary;
  .serviceiframe {
    position: fixed;
    z-index: 201;
    width: 470px;
    @include breakpoint-up("lg") {
      max-width: 470px;
    }
    width: 100%;
    top: 0;
    height: v-bind(servieIframeHeight);
    iframe {
      width: 100%;
      height: 100%;
    }
    // #chat {
    //   width: 100%;
    //   height: 100%;
    // }
    .closeBtn {
      position: absolute;
      z-index: 2147483002;
      width: 10%;
      object-fit: contain;
      right: 0.5rem;
      top: 0.5rem;
    }
  }
}
.slideDiv {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 103;
  // max-width: 470px;
  background: #23003e;
  overflow-y: auto;
  // width: 100%;
  // min-height: calc(100vh);
  overflow-x: hidden;
  @include breakpoint-up("lg") {
    max-width: 470px;
  }
}
.slide-enter-active {
  transform: translateX(100%);
}
// posX_LeaveBegin
.slide-enter-to {
  //定義元素在進場「結束時」的樣式
  transition: transform 0s ease;
  // transform: translateX(0%); // 頁面進入時的平滑左滑效果
  transform: translateX(100%);
}

.slide-leave-to {
  //定義元素在退場「結束時」的樣式。
  transform: translateX(100%); // 頁面離開時的平滑右滑效果
  transition: transform 0s ease;
}
.slide-leave-from {
  //定義元素在退場「結束時」的樣式。
  // transform: translateX(v-bind(posX_LeaveBegin)); // 頁面離開時的平滑右滑效果
  transform: translateX(100%);
  transition: transform 0s ease;
}

.iosImg {
  width: 100%;
  height: 100vh;
  position: absolute;
  .mainPic {
    position: absolute;

    z-index: 999;
    top: 4rem;
    left: 50%;
    transform: translate(-50%);
    width: 90%;
  }
  .close {
    position: absolute;
    z-index: 9999;
    right: 4%;
    top: 7%;
    width: 10%;
  }
}

.iosPopBg {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 998;
}

.installPWA {
  width: 100%;
  height: 55px;
  // margin-top: 3.5rem;
  margin-bottom: -3.5rem;
  background-color: rgb(47, 47, 47);
  display: flex;
  justify-content: space-around;
  align-items: center;

  .left {
    display: flex;
    align-items: center;
    margin-left: 1%;
    .close {
      margin-left: 5%;
      margin-right: 5%;
    }
    img {
      width: 8%;
    }
    p {
      margin-left: 2%;
      font-size: 18px;
    }
  }
  .right {
    width: 30%;
    text-align: center;
    background: rgb(221, 221, 221);
    color: black;
    margin-right: 3%;
    padding: 1.5% 1%;
    border-radius: 30px;
    font-size: 15px;
  }
}
</style>
