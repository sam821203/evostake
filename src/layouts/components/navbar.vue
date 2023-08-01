<template>
  <div
    class="navBar"
    :class="
      ({ notLogin: !token },
      { showPwa: showPwa === true && route.name === 'home' })
    "
  >
    <div class="navList" :class="{ notLogin: !token }">
      <div class="left-item" @click="goHome">
        <!-- <div class="pixiWrap">
          <LogoPixi class="free88" />
          <div
            class="link"
            @click="openWebsite('https://t.me/Lucky888CS')"
          ></div>
        </div> -->
        <img
          :src="require(`@/assets/images/i18n/${curLang.name}/homeLogo.png`)"
          alt="logo"
          class="logo"
        />
      </div>
      <!-- <img
        :src="require(`@/assets/images/i18n/${curLang.name}/homeLogo.png`)"
        alt="logo"
        class="logo"
      /> -->
      <ul class="nav-items-list" v-if="!token">
        <li class="button" @click="callAuth">
          <!-- <router-link to="/auth/login">
            {{ $t("register.registerPage") }}
          </router-link> -->
          <!-- {{ $t("register.registerPage") }} -->
          {{ $t("註冊登入") }}
        </li>
        <!-- <li class="button">
          <router-link to="/auth/register">
            {{ $t("register.registration") }}
          </router-link>
        </li> -->
      </ul>
      <ul class="link-list" v-else>
        <div v-if="token">
          <p class="account">HI,{{ userInfo?.account }},</p>
          <p class="balance" v-if="token">
            <!-- <span></span> -->
            <img
              src="@/assets/images/COIN1.png"
              style="
                display: inline-block;
                height: 1rem;
                object-fit: contain;
                vertical-align: middle;
              "
            />
            <span
              v-price="balanceData[walletType]?.balance"
              style="vertical-align: middle"
            ></span>
          </p>
          <p class="balance" v-else>
            <img
              src="@/assets/images/COIN1.png"
              style="
                display: inline-block;
                height: 1rem;
                object-fit: contain;
                vertical-align: middle;
              "
            />
            <span style="vertical-align: middle">0</span>
          </p>
        </div>

        <router-link to="/operation/vip" class="icon-link" v-if="token">
          <img src="@/assets/images/lobby/vip_icon.png" alt="vip" class="vip" />
          <!-- <span class="vipLv">VIP{{ userInfo?.vip_level }}</span> -->
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { usectrlLogin } from "@/store/ctrlLogin";
// import LogoPixi from "@/components/pixi/LogoPixi.vue";
// const { setserviceConectData } = serviceConect();
import { useRouter, useRoute } from "vue-router";
// import { useDeposit } from "@/store/depositStore";
const router = useRouter();
const route = useRoute();
const { useAuth, useLanguage, useSsevent } = useStore();
const authStore = useAuth();

const lang = useLanguage();
const { curLang } = storeToRefs(lang);
const sseStore = useSsevent();
const { balanceData } = storeToRefs(sseStore);
const { token, userInfo, walletType, showPwa } = storeToRefs(authStore);
// const { loginpageStatus } = storeToRefs(usectrlLogin);
const callAuth = () => {
  usectrlLogin().$patch({
    loginpageStatus: true,
  });
  // console.log(123);
};

const goHome = () => {
  router.push("/home");
};
</script>

<style lang="scss" scoped>
.navBar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  z-index: $topBar-index;
  height: 3.5rem;
  background-image: url("@/assets/images/lobby/top_bar_frame.png");
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  &.notLogin {
    height: $notLogin-topBar-height;
  }
  @include breakpoint-up("lg") {
    max-width: 470px;
  }
  .navList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3.5rem;
    position: relative;
    &.notLogin {
      align-items: center;
    }
    .left-item {
      height: 100%;
      display: flex;
      align-items: center;
      // justify-content: space-evenly;
      width: 30%;
      .service {
        width: 50%;
      }
      .pixiWrap {
        position: relative;
        .free88 {
          width: 100%;
        }
        .link {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 999;
        }
      }
    }
    .logo {
      // position: absolute;
      // left: 50%;
      // transform: translateX(-50%);
      height: 1.5em;
      object-fit: contain;
    }
    .link-list {
      display: flex;
      width: 60%;
      // color: white;
      align-items: center;
      justify-content: flex-end;
      li {
        img {
          width: 40px;
        }
      }
      .account {
        font-size: 0.8rem;
        font-weight: bold;
      }
      .balance {
        font-size: 0.9rem;
      }
      a {
        // background: red;
        // height: 3em;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: white;
        border-radius: 50%;
        margin-left: 0.5em;
        img {
          width: 75%;
          object-fit: contain;
        }
      }
    }
    @keyframes topAni {
      0% {
        transform: scale(100%);
      }
      40% {
        transform: scale(96%);
      }
      // 80% {
      //   transform: scale(110%);
      // }
      100% {
        transform: scale(100%);
      }
    }
    @keyframes bottomAni {
      0% {
        transform: scale(100%);
        box-shadow: 0 0 5px 5px rgba(rgb(99, 99, 99), $alpha: 0);
      }
      40% {
        transform: scale(96%);
        box-shadow: 0 0 5px 5px rgba(rgb(69, 69, 69), $alpha: 0.5);
      }
      100% {
        transform: scale(100%);
        box-shadow: 0 0 5px 5px rgba(rgb(99, 99, 99), $alpha: 0);
      }
    }
    // animation: activity 2s infinite ease;
    .nav-items-list {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .button {
        // width: 7%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        border-radius: 16px;
        margin-right: -0.5%;
        text-decoration: none;
        padding: 5px 15px;
        color: #fff;
        position: relative;
        animation-name: topAni;
        animation-duration: 1s;
        // animation-delay: 5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        // transform: scale(0.5);
        &:first-child {
          background-image: linear-gradient(to top right, #8400b0, #a903d2);
          a {
            color: #fff;
          }
        }
        &:nth-child(2) {
          background: #fff;
        }
        a {
          text-decoration: none;
          padding: 5px 15px;
        }
        &:after {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: -1;
          content: "";
          border-radius: 16px;

          animation-name: bottomAni;
          animation-duration: 1s;
          // animation-delay: 5s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      }
      &.lang {
        width: 1rem;
      }
      display: flex;
      &.isLogin {
        width: 11rem;
        height: 3rem;
        background-image: url("~@/assets/images/layouts/coin_bar1.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        .balanceWrap {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px 0 10px;
          .balance {
            color: #fff;
            font-size: 20px;
          }
          .coinImg {
            width: 31px;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }
    :deep(.curlang) {
      width: 35px;
      height: 35px;
    }
  }
}
.showPwa {
  position: relative;
  top: 3.5rem;
}
</style>
