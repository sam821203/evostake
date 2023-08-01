<template>
  <div class="footer">
    <ul class="listWrap">
      <li class="list-item" @click="goPage('/home')">
        <img src="@/assets/images/layouts/footer/default/home.png" alt="home" />
        <p>{{ $t("footer.home") }}</p>
      </li>
      <!-- <li class="list-item dotCenterWrap" >
        <Dot class="normal" v-show="hasAct('normal') && token"></Dot>
        <img src="" alt="announce" />
        <p>{{ $t("") }}</p>
      </li> -->
      <li class="list-item dotCenterWrap" @click="goPage('/activity')">
        <Dot class="activity" v-show="hasAct('event') && token"></Dot>
        <img
          src="@/assets/images/layouts/footer/default/activity.png"
          alt="activity"
        />
        <p>{{ $t("footer.promotions") }}</p>
      </li>

      <li class="list-item dotCenterWrap" @click="setserviceConectData(true)">
        <!-- <Dot class="activity" v-show="hasAct('event') && token"></Dot> -->
        <img
          src="@/assets/images/layouts/footer/default/service.png"
          alt="service"
          class="service"
        />
        <p>{{ $t("footer.service") }}</p>
      </li>

      <li class="list-item addFriends" @click="goPage('/operation/friends')">
        <img
          src="@/assets/images/memberCenter/InviteFriends2.png"
          alt="deposit"
        />
        <p class="Amigos">Amigos</p>
      </li>
      <li
        class="list-item dotCenterWrap"
        @click="goPage('/member/memberCenter')"
      >
        <Dot
          class="member"
          v-show="hasAct('normal') && token"
          style="z-index: 5"
        ></Dot>
        <Dot class="member" v-show="hasNew && token"></Dot>
        <img
          src="@/assets/images/layouts/footer/default/member.png"
          alt="user"
        />
        <p>{{ $t("footer.player") }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from "vue";
import Dot from "@/components/alertDot.vue";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
// import { useDeposit } from "@/store/depositStore";
import { getPlayerId } from "@/utils/cookie";
import { serviceConect } from "@/store/serviceConnet";
const { setserviceConectData } = serviceConect();
const router = useRouter();
const route = useRoute();

const { useMail, useAuth, useAnnouncement, useSsevent } = useStore();
const mailStore = useMail();
const { isShowUnread } = storeToRefs(mailStore);
const hasNew = computed(() => isShowUnread.value);
const authStore = useAuth();
const { token, userInfo } = storeToRefs(authStore);

const announcementStore = useAnnouncement();
const { getAnnouncementData, hasAct } = announcementStore;

const sseStore = useSsevent();
const { openSsevent } = sseStore;
const { sseventInstance } = storeToRefs(sseStore);
// const modalStore = useModal();
// const { toggleModal, modalType } = modalStore;
if (
  sseventInstance.value?.readyState !== 1 &&
  token.value &&
  !route.path.includes("gamelobby")
) {
  openSsevent();
}

if (token.value) {
  const { getMailNotification } = mailStore;
  getMailNotification();
}

const goPage = async (path) => {
  router.push(path);
  // if (path === "addFriends") {
  //   toggleModal(true);
  //   modalType("FriendQRcode", "longContent");
  // } else {
  //   router.push(path);
  // }

  if (path === "/home") {
    setTimeout(() => {
      // location.reload();
    }, 100);
  }
};

const interval = setInterval(() => {
  getAnnouncementData();
}, 60000);

onBeforeUnmount(() => {
  //在Vue被摧毀前
  clearInterval(interval);
});

// 非開發環境和非 217 環境直接取得公告
const url = new URL(window.location.href);
const isDev = process.env.NODE_ENV === "development";
const isTest = url.protocol !== "http:";
if (!getPlayerId() || (!isDev && !isTest)) {
  getAnnouncementData();
}

// 開發環境或 217 環境需等候 userInfo 取得 agent_name 否則取得公告時會找不到代理
watch(
  () => userInfo.value.agent_name,
  (val) => {
    if (val && (isDev || isTest)) {
      getAnnouncementData();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: $downBar-index;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  height: 3.5rem;
  width: 100%;
  // background: black;
  // background-image: url("@/assets/images/lobby/down_bar_frame.png");
  background: #343a40;
  background-repeat: no-repeat;
  padding: 0 1%;
  // padding-top: 1.5rem;
  @include breakpoint-up("lg") {
    max-width: 470px;
  }
  .listWrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .list-item {
      position: relative;
      text-align: center;
      width: 20%;
      height: 70%;
      .service {
        width: 40%;
      }
      img {
        width: 35%;
        object-fit: contain;
      }
      p {
        color: #ede9ef;
        text-align: center;
        font-size: 0.8rem;
      }
      .Amigos {
        color: rgb(75, 206, 127);
      }
      &.dotCenterWrap {
        position: relative;
        :deep(.dot) {
          position: absolute;
          top: -1%;
          &.member {
            right: 15%;
            top: 0;
          }
          &.activity {
            right: 10px;
          }
          &.normal {
            right: 10px;
          }
        }
      }
    }
    .addFriends {
      img {
        width: 50%;
      }
    }
  }
}
</style>
