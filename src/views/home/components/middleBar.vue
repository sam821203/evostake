<template>
  <div class="middleBar">
    <div class="top">
      <div class="top-item left">
        <Marquee />
      </div>
      <div class="top-item right">
        <div class="deposit item" @click="buttonSwitch('deposit')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/deposit_3.png"
            alt=""
          />
          <p>{{ $t("player.deposit") }}</p>
          <Dot class="depositAlert"></Dot>
        </div>

        <div class="withdraw item" @click="buttonSwitch('withdraw')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/DrawMoney2.png"
            alt=""
          />
          <p>{{ $t("player.withdraw") }}</p>
        </div>
        <div class="invite item" @click="buttonSwitch('friends')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/InviteFriends2.png"
            alt=""
          />
          <p class="Amigos">{{ $t("player.friends") }}</p>
        </div>
      </div>
    </div>
    <div :class="['flipSection', { clicked: clicked }]">
      <div class="flipWrap">
        <router-link to="/info/leaderBoard" class="icon-leaderBoard">
          <img
            src="@/assets/images/lobby/leaderboard.png"
            alt="rank"
            class="rank"
          />
        </router-link>
        <Transition
          appear
          @after-enter="jpType = 'competition'"
          :duration="jpDuration"
        >
          <div v-if="jpType === 'friends'" class="jpWrap">
            <router-link to="/info/leaderBoard" class="gotoPromotion">
              <div class="gotoPromotion"></div>
            </router-link>
            <div class="content-wrap">
              <p>{{ $t("home.friendsJP") }}</p>
              <div class="jp">
                <p>7,770</p>
              </div>
            </div>
            <img
              src="@/assets/images/lobby/notify.png"
              alt="jp"
              class="questionMark"
              @click="openJpMsg"
            />
          </div>
        </Transition>
        <Transition @after-enter="jpType = 'friends'" :duration="jpDuration">
          <div v-if="jpType === 'competition'" class="competitionJP">
            <router-link to="/info/leaderBoard" class="gotoPromotion">
              <div class="gotoPromotion"></div>
            </router-link>
            <div class="content-wrap">
              <p>{{ t("賭神獎池彩金") }}</p>
              <div class="jp">
                <p>77,770</p>
              </div>
            </div>

            <img
              src="@/assets/images/lobby/notify.png"
              alt="jp"
              class="questionMark"
              @click="competitionJP"
            />
          </div>
        </Transition>
        <!-- <Transition @after-enter="jpType = 'friends'" :duration="jpDuration">
          <div v-if="jpType === 'competition'" class="competitionJP">
            <router-link to="/info/leaderBoard" class="gotoPromotion">
              <div class="gotoPromotion"></div>
            </router-link>
            <p>{{ $t("home.TPJP") }}</p>
            <img
              src="@/assets/images/lobby/notify.png"
              alt="jp"
              class="questionMark"
              @click="competitionJP"
            />
          </div>
        </Transition> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { jpPrizePoolApi } from "@/api/info";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import Marquee from "@/layouts/components/marquee.vue";
import { useRouter } from "vue-router";
import Dot from "@/components/alertDot.vue";

const router = useRouter();

const { t } = useI18n();

const jpType = ref("friends");
const jpDuration = 5000;

const { useAuth, useMessage } = useStore();

const msgStore = useMessage();

const { openMsg } = msgStore;

// const modalStore = useModal();
// const { toggleModal, modalType } = modalStore;

const authStore = useAuth();

const { getUserInfo } = authStore;

const { token, userInfo } = storeToRefs(authStore);

const jpPrice = ref(0);
const getJpPrice = async () => {
  const jpPriceRes = await jpPrizePoolApi();
  jpPrice.value = jpPriceRes.data.data.main;
};
const openJpMsg = () => {
  openMsg({
    content: t("openMsg.jpMsg"),
  });
};

const competitionJP = () => {
  openMsg({
    content: t("openMsg.competitionJP"),
  });
};

const buttonSwitch = (type) => {
  switch (type) {
    case "deposit":
      router.push("/deposit/deposit");
      break;
    case "withdraw":
      conditionVerify();
      // router.push("/deposit/withdraw");
      break;
    case "friends":
      router.push("/operation/friends");
      // toggleModal(true);
      // modalType("FriendQRcode", "longContent");
      break;
  }
};

// 提款驗證
const conditionVerify = () => {
  if (userInfo.value.real_name && userInfo.value.is_deposit) {
    router.push("/deposit/withdraw");
  }
  if (!userInfo.value.real_name) {
    //有無寫姓名
    openMsg({
      content: t("請先填寫您的真實姓名"),
    }).then(() => {
      router.push("/info/userInfo");
    });
    return;
  }
  if (!userInfo.value.is_deposit) {
    //有無存款過
    openMsg({
      content: t("請先進行存款"),
    }).then(() => {
      router.push("/deposit/deposit");
    });
    return;
  }
};

let getJpTimer = null;

onMounted(() => {
  getJpPrice();
  if (token.value) {
    getUserInfo();
  }

  getJpTimer = setInterval(() => {
    getJpPrice();
  }, 20000);
});

onBeforeUnmount(() => {
  clearInterval(getJpTimer);
  getJpTimer = null;
});
</script>

<style lang="scss" scoped>
.middleBar {
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1% 0 -2% 0;
    // padding: 0 20px;
    .top-item {
      &.left {
        width: 45%;
        .registerText {
          font-size: 14px;
          @include breakpoint-up("lg") {
            font-size: 16px;
          }
        }
      }
      &.right {
        width: 50%;
        margin: 0 1% 0 2%;
        display: flex;
        justify-content: space-evenly;
        .item {
          text-align: center;
          background-image: url("@/assets/images/memberCenter/iconbox1.png");
          background-size: 100% 100%;
          width: 40%;
          height: 55px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .invite {
          width: 50%;
        }
        .deposit {
          position: relative;
          .depositAlert {
            position: absolute;
            top: 12%;
            right: 12%;
          }
        }

        img {
          width: 45%;
          object-fit: contain;
          margin-top: -12%;
        }
        p {
          font-size: 10px;
        }
        .Amigos {
          color: rgb(75, 206, 127);
        }
      }
    }
  }
  .flipSection {
    position: relative;
    height: 2rem;
    margin-bottom: 0.5rem;
    .flipWrap {
      overflow: hidden;
      height: 98%;
      width: 98%;
      margin: auto;
      // color: white;
      border-radius: 10px;
      background: #343a40;
      border: 2px solid #495057;
      .icon-leaderBoard {
        margin-left: 0.5rem;
        height: 100%;
        img {
          height: 100%;
          object-fit: contain;
        }
      }
      .jpWrap,
      .competitionJP {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px 0 15%;
        // padding: 8px 15px 8px 18%;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        .gotoPromotion {
          position: absolute;
          width: 40%;
          // background: red;
          left: 0;
          height: 100%;
        }
        .questionMark {
          width: 22px;
        }

        .jp {
          width: 30%;
          p {
            text-align: end;
            font-size: 18px;
          }
        }
        .content-wrap {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-right: 5%;
        }
      }
    }
    .down {
      width: 6%;
      position: absolute;
      right: 2%;
      top: 20%;
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: 2s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
