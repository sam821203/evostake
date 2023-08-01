<template>
  <ModalLayout>
    <template #default>
      <div class="content-wrap step1" v-if="step === 'step1'">
        <p class="upgrade-title">
          Before deposit, you need to turn your Trial Account into Regular
          Account.
        </p>
        <div class="conditions">
          <p>You need to accomplish these conditions for the Bonus：</p>
          <ul>
            <li>・Free Trial Valid Bets ： 250</li>
            <li>・Free Trial Balance ：50 or more</li>
          </ul>
        </div>
      </div>
      <div class="content-wrap step2" v-else>
        <p>You need to accomplish these conditions for the Bonus：</p>
        <ul class="section1">
          <li>・Free Trial Valid Bets ： 250</li>
          <li>・Free Trial Balance ：50 or more</li>
        </ul>
        <p>Your current Trial Account details</p>
        <ul class="section2">
          <li>・Your Free Trial Valid Bets ： <span v-price="flow"></span></li>
          <li>・Your Free Trial Balance ： <span v-price="balance"></span></li>
        </ul>
      </div>
      <div class="button-wrap">
        <button class="keep" @click="close">
          I will keep playing for the Bonus 50P.
        </button>
        <button class="count" v-if="countdown">
          {{ count }}
        </button>
        <div class="noBonusInput" v-if="!countdown && step === 'step3'">
          <p>Please enter NO and click</p>
          <input
            :class="['input', { inputValid: input !== null }]"
            type="text"
            placeholder="Please enter「NO」 "
            v-model.trim="input"
            @keyup="noBonus"
          />
        </div>
        <button
          :class="['upgrade', { btnDisable: disable }]"
          @click="upgrade"
          v-if="!countdown"
          :disabled="disable"
        >
          <span
            >No, I don't need the Bonus 50P.<br />Please clear my Trial Account
            and turn me into Regular Account.</span
          >
        </button>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, watch } from "vue";
import ModalLayout from "@/components/modal/layout";
import { useStore } from "@/store/index";
import { upgradeUserApi, testWalletApi } from "@/api/user";
const { useModal, useMessage, useAuth } = useStore();
const modalStore = useModal();
const { openMsg } = useMessage();
const authStore = useAuth();
const { getUserInfo } = authStore;
const step = ref("step1");
const countdown = ref(false);
const input = ref(null);
const disable = ref(false);
const balance = ref(0);
const flow = ref(0);
let count = ref(9);
const { toggleModal } = modalStore;
modalStore.$patch({
  closeBtn: false,
});

const getTestwallet = async () => {
  const testWalletRes = await testWalletApi();
  balance.value = testWalletRes.data.data.balance;
  flow.value = testWalletRes.data.data.flow;
  console.log(testWalletRes);
};
getTestwallet();

const close = () => {
  toggleModal(false);
};

const upgrade = async () => {
  if (step.value === "step1") {
    step.value = "step2";
    disable.value = true;
    countdown.value = true;
  }
  if (
    step.value === "step3" &&
    input.value.replace(/\s+/g, "").toUpperCase() === "NO"
  ) {
    console.log("upgrade");
    const upgradeRes = await upgradeUserApi();
    console.log(upgradeRes);
    if (upgradeRes) {
      openMsg({
        content: "Congratulation!\nYou are now a Regular Account",
        hasBtn: true,
      }).then(() => {
        toggleModal(false);
        getUserInfo();
      });
    }
  }
};

watch(countdown, (val) => {
  if (val) {
    const interval = setInterval(() => {
      if (count.value > 1) {
        count.value--;
      } else {
        countdown.value = false;
        step.value = "step3";
        clearInterval(interval);
      }
    }, 1000);
  }
});

const noBonus = () => {
  if (input.value.replace(/\s+/g, "").toUpperCase() === "NO") {
    disable.value = false;
  } else {
    disable.value = true;
  }
};
</script>

<style lang="scss" scoped>
.content-wrap {
  margin-bottom: 5%;
  p {
    word-break: break-word;
  }
  .upgrade-title {
    color: #3d6e99;
    font-weight: 600;
    font-size: 1.2rem;
    text-align: center;
  }
  .conditions {
    font-size: 0.9rem;
    width: 100%;
    background-image: url("@/assets/images/memberCenter/box_1.png");
    background-size: 100% 100%;
    padding: 5% 5% 10%;
    margin-top: 8%;
    p {
      font-weight: 600;
    }
    ul {
      color: #fff;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      padding: 2%;
    }
  }
}
.step2 {
  background-image: url("@/assets/images/memberCenter/box_2.png");
  background-size: 100% 100%;
  padding: 5% 5% 10%;
  font-size: 0.9rem;
  p {
    font-weight: 600;
  }
  ul {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.16);
    border-radius: 5px;
    padding: 2%;
    .section {
      margin-bottom: 5%;
    }
  }
}
.button-wrap {
  button {
    font-size: 0.9rem;
    margin-bottom: 10%;
    word-break: break-word;
    border-radius: 20px;
    color: #fff;
    width: 100%;
    height: 70px;
  }
  .keep {
    background-color: #2fb869;
    font-size: 1.5rem;
    line-height: 1.3;
  }
  .noBonusInput {
    margin-bottom: 5%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      color: #3d6e99;
      font-weight: 600;
      font-size: 0.9rem;
      text-align: center;
    }
    .input {
      border: 1px solid lightgray;
      padding: 3%;
      margin-top: 3%;
      width: 80%;
      border-radius: 8px;
      &::-webkit-input-placeholder {
        text-align: center;
      }
    }
    .inputValid {
      border: 1px solid #000;
    }
  }
  .count {
    background-color: gray;
    padding: 10%;
  }
  .upgrade {
    background-color: #a5220d;
  }
  .btnDisable {
    background-color: gray;
  }
}
</style>
