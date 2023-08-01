<template>
  <div class="authWrap">
    <div class="navbar">
      <!-- <img src="@/assets/images/language/flag_zhtw.png" alt="" class="lang" /> -->
      <div
        class="logo"
        @click="
          usectrlLogin().$patch({
            loginpageStatus: false,
          })
        "
      >
        <img
          :src="require(`@/assets/images/i18n/${curLang.name}/logo.png`)"
          alt=""
        />
      </div>
      <div class="select" v-show="false">
        <ul class="link-list">
          <li @click="openWebsite('https://t.me/evostake00')">
            <img src="@/assets/images/lobby/Telegram.png" alt="" class="tg" />
          </li>
          <li
            @click="
              openWebsite(
                'https://www.facebook.com/profile.php?id=100095419832273'
              )
            "
          >
            <img src="@/assets/images/lobby/Facebook.png" alt="" class="fb" />
          </li>
        </ul>
      </div>
    </div>
    <div class="main">
      <ul class="link-wrap">
        <li :class="['link-item']" @click="changeRoute('login')">
          <img
            :src="
              require(`@/assets/images/auth/paging_R_${
                authStatus === 'login' ? 2 : 1
              }.png`)
            "
            alt=""
          />
          <p>{{ $t("register.registerPage") }}</p>
        </li>
        <li :class="['link-item']" @click="changeRoute('register')">
          <img
            :src="
              require(`@/assets/images/auth/paging_R_${
                authStatus === 'register' ? 2 : 1
              }.png`)
            "
            alt=""
          />
          <p style="font-size: 1rem; width: 100%">
            {{ $t("register.registration") }}
          </p>
        </li>
      </ul>
      <!-- <router-view></router-view> -->
      <login v-if="authStatus === 'login'" />
      <register v-if="authStatus === 'register'" />
      <div class="footerbtn">
        <img
          src="@/assets/images/service.png"
          @click="setserviceConectData(true)"
        />
        <img
          src="@/assets/images/lobby/Telegram.png"
          @click="openWebsite('https://t.me/evostake00')"
        />

        <img
          src="@/assets/images/lobby/Facebook.png"
          @click="
            openWebsite(
              'https://www.facebook.com/profile.php?id=100095419832273'
            )
          "
        />
        <img
          src="@/assets/images/lobby/messenger.png"
          @click="openWebsite('https://m.me/100095419832273')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { computed } from "@vue/reactivity";
// import { useRoute, useRouter } from "vue-router";
import { getUuid } from "@/utils/cookie";
// import langSelect from "@/components/langSelect.vue";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { serviceConect } from "@/store/serviceConnet";
import login from "@/views/auth/login.vue";
import register from "@/views/auth/register/index.vue";

import { useRoute } from "vue-router";
import { usectrlLogin } from "@/store/ctrlLogin";
const route = useRoute();
const uuid = getUuid("uuid") !== undefined ? getUuid("uuid") : "";
console.log("uuid", uuid);

const { setserviceConectData } = serviceConect();
const { useLanguage } = useStore();
const langStore = useLanguage();
const { curLang } = storeToRefs(langStore);

// const { inviteFriendid } = storeToRefs(usectrlLogin());
// const route = useRoute();
// const router = useRouter();
// const curRouteName = computed(() => route.meta.name);

const authStatus = ref("login");

const changeRoute = (route) => {
  // router.push(route);
  authStatus.value = route;
};

const openWebsite = (url) => {
  // return;
  window.open(url);
};
onMounted(() => {
  // console.log(inviteFriendid.value);
  if (route.params.id) {
    authStatus.value = "register";
  }
});
</script>

<style lang="scss" scoped>
.link-list {
  li {
    img {
      width: 45px;
    }
  }
}
.footerbtn {
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  justify-content: space-around;
  // align-items: center;
  img {
    height: 100%;
    object-fit: contain;
  }
}
</style>
