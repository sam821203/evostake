<template>
  <div class="memberCenter">
    <div class="info">
      <div class="user-info">
        <img
          class="user-icon"
          src="@/assets/images/memberCenter/user_icon.png"
          alt=""
        />
        <div class="user-content">
          <div class="account-info">
            <p class="account">
              {{ $t("login.account") }}：<span>{{ userInfo?.account }}</span>
            </p>
          </div>
          <div class="add-friends">
            Convidar:
            <img
              v-show="!userInfo.is_test"
              src="@/assets/images/add.png"
              alt="add"
              @click="openQRcode"
            />
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="email-wrap">
          <img
            v-if="isShowUnread === true"
            class="notify"
            src="@/assets/images/new.png"
            alt="new"
          />
          <img
            src="@/assets/images/memberCenter/email.png"
            alt=""
            class="email"
            @click="buttonSwitch('email')"
          />
        </div>

        <img
          src="@/assets/images/memberCenter/setup.png"
          alt=""
          class="setting"
          @click="buttonSwitch('setting')"
        />
      </div>
    </div>
    <!-- 存提 -->
    <div class="content">
      <p class="title">{{ $t("player.bank") }}</p>
      <div class="line">
        <div class="deposit item" @click="buttonSwitch('deposit')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/deposit_2.png"
            alt=""
          />
          <div>{{ $t("player.deposit") }}</div>
        </div>
        <div class="withdraw item" @click="buttonSwitch('withdraw')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/DrawMoney.png"
            alt=""
          />
          <div>{{ $t("player.withdraw") }}</div>
        </div>
        <div class="trade-records item" @click="buttonSwitch('tradeRecord')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/TransactionRecord.png"
            alt=""
          />
          <div>{{ $t("player.transactions") }}</div>
        </div>
        <!-- <div class="manage item" @click="buttonSwitch('drawMoneySetting')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/DrawMoney_manage.png"
            alt=""
          />
          <div>{{ $t("player.setting") }}</div>
        </div> -->
        <div
          class="security item"
          @click="buttonSwitch('detailpromotionActivity')"
        >
          <img
            class="icon"
            src="@/assets/images/memberCenter/SecuritySettings.png"
            alt=""
          />
          <div>{{ $t("player.security") }}</div>
        </div>
      </div>
    </div>
    <!-- 遊戲 -->
    <div class="content">
      <p class="title">{{ $t("player.game") }}</p>
      <div class="line">
        <div class="betting-records item" @click="buttonSwitch('gameRecord')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/BetRecord.png"
            alt=""
          />
          <div>{{ $t("player.data") }}</div>
        </div>
        <div class="receive-records item" @click="buttonSwitch('promotions')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/record.png"
            alt=""
          />
          <div>{{ $t("player.participation") }}</div>
        </div>
        <div class="invite item" @click="buttonSwitch('friends')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/InviteFriends.png"
            alt=""
          />
          <div>{{ $t("player.friends") }}</div>
        </div>
        <div class="vip item" @click="buttonSwitch('vip')">
          <img class="icon" src="@/assets/images/memberCenter/Vip.png" alt="" />
          <div>VIP</div>
        </div>
      </div>
    </div>
    <!-- 資訊 -->
    <div class="content">
      <p class="title">{{ $t("player.info") }}</p>

      <div class="line" style="flex-wrap: wrap">
        <div class="basic-info item" @click="router.push('/info/announcement')">
          <Dot
            class="member"
            v-show="hasAct('normal') && token"
            style="position: absolute; top: -5%; right: 10%"
          ></Dot>
          <img
            class="icon"
            src="@/assets/images/memberCenter/Aviso.png"
            alt=""
          />
          <div>{{ $t("footer.notice") }}</div>
        </div>

        <div class="basic-info item" @click="buttonSwitch('/info/userInfo')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/BasicInformation.png"
            alt=""
          />
          <div>{{ $t("player.profile") }}</div>
        </div>
        <div class="Q&A item" @click="buttonSwitch('QA')">
          <img class="icon" src="@/assets/images/memberCenter/QA.png" alt="" />
          <div>{{ $t("player.qa") }}</div>
        </div>
        <div class="platformRule item" @click="buttonSwitch('platformRule')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/TermsConditions.png"
            alt=""
          />
          <div>{{ $t("player.rules") }}</div>
        </div>
        <div class="telegram item" @click="buttonSwitch('telegram')">
          <img
            class="icon"
            src="@/assets/images/memberCenter/Telegram.png"
            alt=""
          />
          <div>Telegrama</div>
        </div>
        <div class="fb item" @click="buttonSwitch('fb')">
          <img class="icon" src="@/assets/images/memberCenter/fb.png" alt="" />
          <div>Facebook</div>
        </div>
        <div class="customer-service item" @click="setserviceConectData(true)">
          <img
            class="icon"
            src="@/assets/images/memberCenter/CustomerService.png"
            alt=""
          />
          <div>{{ $t("player.support") }}</div>
        </div>
      </div>
    </div>
    <div class="log-out" @click="buttonSwitch('logOut')">
      {{ $t("player.logOut") }}
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMail } from "@/store/mailStore";
import { useStore } from "@/store/index";
import i18n from "@/utils/i18n";
import { serviceConect } from "@/store/serviceConnet";
import Dot from "@/components/alertDot.vue";
import { usectrlLogin } from "@/store/ctrlLogin";
const { t } = i18n.global;
// import { useDeposit } from "@/store/depositStore";
const { changeloginpageStatus } = usectrlLogin();
const { setserviceConectData } = serviceConect();

// const depositStore = useDeposit();
// const { handleDepositPath } = depositStore;

const { useModal, useMessage, useAuth, useAnnouncement } = useStore();
const announcementStore = useAnnouncement();
const { hasAct } = announcementStore;
const { token } = storeToRefs(useAuth());

const router = useRouter();
const modalStore = useModal();
const { toggleModal, modalType } = modalStore;

const msg = useMessage();
const { openMsg } = msg;
const mailStore = useMail();
const { isShowUnread } = storeToRefs(mailStore);

const auth = useAuth();
const { logout } = auth;
const { userInfo } = storeToRefs(auth);

const { getMailNotification } = mailStore;

getMailNotification();
// console.log(userInfo.value);

const buttonSwitch = (type) => {
  switch (type) {
    case "email":
      toggleModal(true);
      modalType("Email", "longContent");
      break;
    case "setting":
      router.push("/setting/sound");
      break;
    case "deposit":
      router.push("/deposit/deposit");
      break;
    case "withdraw":
      conditionVerify();
      // router.push("/deposit/withdraw");
      break;
    // case "drawMoneySetting":
    //   router.push("/deposit/gCashSetting");
    //   break;
    case "tradeRecord":
      router.push("/deposit/tradeRecord");
      break;
    case "gameRecord":
      router.push("/operation/gameRecord");
      break;
    case "promotions":
      router.push({
        path: "/activity/activityList",
        query: { selected: "getRecord" },
      });
      break;
    case "friends":
      router.push("/operation/friends");
      break;
    case "vip":
      router.push("/operation/vip");
      break;
    case "QA":
      router.push("/info/Q&A");
      break;
    case "fb":
      window.open("https://www.facebook.com/profile.php?id=100095419832273");
      break;
    case "telegram":
      window.open("https://t.me/evostake00");
      break;
    case "platformRule":
      router.push("/info/platformRule");
      break;
    case "/info/userInfo":
      router.push(type);
      break;
    case "logOut":
      openMsg({
        content: t("logoutMsg"),
        hasBtn: true,
        hasCancel: true,
      }).then(() => {
        logout();
        router.push("/home");
        // usectrlLogin().$patch({
        //   loginpageStatus: true,
        // });
        // if (type) {
        //   return;
        // }
        changeloginpageStatus(true);
      });
      break;
    case "detailpromotionActivity":
      router.push("/deposit/safeSetting");
      break;
  }
};

//邀請好友
const openQRcode = () => {
  toggleModal(true);
  modalType("FriendQRcode", "longContent");
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
</script>

<style lang="scss" scoped>
.memberCenter {
  width: 100%;
  height: 120%;
  padding: 2%;
  color: $primary;
  .info {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    // color: rgb(54, 111, 160);
    color: white;
    .user-info {
      display: flex;
      align-items: center;
      .user-icon {
        width: 30%;
      }
      .user-content {
        display: flex;
        flex-direction: column;
        margin-left: 5%;

        .account-info {
          font-size: 1rem;
          height: 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          // @media screen and (min-width: 820px) {
          //   font-size: 1.8rem;
          //   height: 5.5rem;
          // }
        }
        .add-friends {
          display: flex;
          align-items: center;
          img {
            width: 20%;
            margin-left: 5%;
          }
        }
      }
    }
    .setting-section {
      width: 40%;
      display: flex;
      align-items: baseline;
      justify-content: space-evenly;
      margin-top: 4%;

      .email-wrap {
        width: 30%;
        position: relative;
        .email {
          width: 100%;
        }
        .notify {
          width: 100%;
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .setting {
        width: 30%;
      }
    }
  }
  .content {
    margin-top: 5%;
    padding: 1%;
    // overflow-x: scroll;
    .title {
      color: $title;
      font-weight: bold;
      font-size: 1.2rem;
      font-weight: 600;
      @media screen and (min-width: 820px) {
        font-size: 2.2rem;
      }
    }
    .line {
      // display: flex;
      // flex-direction: row;
      // align-items: flex-start;
      // justify-content: flex-start;
      width: 100%;
      padding-top: 3%;
      margin-top: 1%;
      border-top: 1px solid rgb(38, 73, 87);
      overflow-x: scroll;
      overflow-y: hidden;
      // white-space: nowrap;
      // text-align: center;
      font-size: 0.9rem;
      // @media screen and (min-width: 820px) {
      //   font-size: 1.2rem;
      // }
      .item {
        width: calc(25% - 5px);
        margin-right: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        display: inline-block;
        text-align: center;
        vertical-align: top;
        position: relative;
        .icon {
          width: 60%;
          // height: 60%;
          margin-bottom: 5%;
        }
        div:not(.dot) {
          margin: auto;
          width: 100%;
          margin-bottom: 5px;
          // word-break: keep-all;
        }
      }
    }
  }
  .log-out {
    width: 50%;
    padding: 2%;
    text-align: center;
    color: #fff;
    background-color: rgb(142, 168, 197);
    margin: 0 auto;
    margin-top: 10%;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 500;
  }
}
</style>
