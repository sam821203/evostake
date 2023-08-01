<template>
  <div class="withdraw-wrapper">
    <div class="wallet-info">
      <div class="item">
        <p class="title">{{ $t("stored.balance") }}</p>
        <div class="coin-wrap">
          <img src="@/assets/images/COIN1.png" alt="" class="coin" />
          <p class="content" v-price="balanceData[walletType]?.balance"></p>
        </div>
      </div>
      <div class="item">
        <p class="title">{{ $t("stored.validBets") }}</p>
        <p class="content" v-price="wallet[0].flow"></p>
      </div>
      <div class="item">
        <p class="title">{{ $t("stored.threshold") }}</p>
        <p class="content" v-price="wallet[0].cash_out_gateway"></p>
      </div>
    </div>
    <!-- 提款方式 -->
    <div class="withdraw-way">
      <div class="title">{{ $t("提款方式") }}</div>
      <div class="content">
        <button
          v-for="(bank, index) in bankList"
          :key="bank.bank_id"
          :class="[
            'item',
            { selected: selected === index },
            { maintain: bank.maintain },
          ]"
          @click="selectWay(bank.bank_id, index)"
          :disabled="bank.maintain"
        >
          <p v-if="bank.maintain" class="maintainWords">
            <span>Em </span>
            <span>Manutenção</span>
          </p>
          <img :src="bank.icon" alt="" class="icon" />
          <p class="name">{{ bank.bank_display_name }}</p>
        </button>
      </div>
    </div>
    <!-- 提款金額 -->
    <div class="withdraw-amount">
      <div class="default" @click="inputFocus">
        <input
          type="number"
          :placeholder="$t('stored.withdrawAmount')"
          class="amount"
          v-model="withdrawAmount"
          @keyup.enter="throttleSave"
          @keyup="handleInput"
          inputmode="numeric"
          :disabled="disabled"
          min="0"
        />
        <img
          v-if="Number.isInteger(withdrawAmount) || withdrawAmount >= 100"
          class="clear"
          @click="clear"
          src="@/assets/images/memberCenter/cancel.png"
          alt=""
        />
        <i class="bi bi-keyboard-fill" v-else></i>
      </div>
      <div class="options">
        <div
          class="option"
          v-for="(option, index) in optionList"
          :key="index"
          @click="addAmount(option.amount, option.label)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
    <div></div>
    <!-- <p class="remind">Saques restantes: {{ withdrawTime }}</p> -->
    <button
      :class="[
        'confirm',
        {
          disabled:
            !withdrawAmount ||
            withdrawAmount < 20 ||
            withdrawTime === 0 ||
            disabled,
        },
      ]"
      @click.prevent="throttleSave"
      :disabled="
        !withdrawAmount || withdrawAmount < 20 || withdrawTime === 0 || disabled
      "
    >
      {{ $t("stored.OK") }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useMessage } from "@/store/msgStore";
import { useStore } from "@/store/index";
import { useRouter } from "vue-router";
import { getBankApi } from "@/api/deposit";
import throttle from "@/utils/throttle";
import { useDeposit } from "@/store/depositStore";
import { storeToRefs } from "pinia";
import {
  setWithdrawWay,
  setWithdrawAm,
  setTaxId,
  setPhoneNum,
  setPixType,
  setPixKey,
  setBankId,
  removeBankNum,
  removeBankName,
  removeTaxId,
  removePhoneNum,
  removePixType,
  removePixKey,
  // setWithdrawType,
} from "@/utils/cookie";
import i18n from "@/utils/i18n";
const { t } = i18n.global;
const optionList = ref([
  { label: "20", amount: 20 },
  { label: "50", amount: 50 },
  { label: "100", amount: 100 },
  { label: "200", amount: 200 },
  { label: "500", amount: 500 },
  { label: "1,000", amount: 1000 },
  { label: "2,000", amount: 2000 },
  { label: "5,000", amount: 5000 },
]);
const depositStore = useDeposit();
const { taxId, phone, type, pixKey } = storeToRefs(depositStore);
const { useModal, useAuth, useSsevent } = useStore();

const authStore = useAuth();
const { getUserInfo } = authStore;
getUserInfo();
const { userInfo, walletType } = storeToRefs(authStore);
// const maxAm = ref(userInfo.value.tixian_max_amount);
const maxAm = ref(20000);
const withdrawTime = ref(
  userInfo.value.tixian_max_times - userInfo.value.tixian_times
);
console.log(userInfo.value);

// 判斷玩家是否為體驗帳號以帶入錢包
const wallet = ref(
  Object.values(userInfo.value.wallets).filter(
    (item) => item.currency === walletType.value
  )
);

const sseStore = useSsevent();
const { balanceData } = storeToRefs(sseStore);
const flow = ref(wallet.value[0].flow);
const gateway = ref(wallet.value[0].cash_out_gateway);
const modalStore = useModal();
const { toggleModal, modalType } = modalStore;
const router = useRouter();
const msg = useMessage();
const { openMsg } = msg;
const withdrawWay = ref("PIX");
const withdrawAmount = ref(null);
const bankList = ref([]);
const selected = ref(0);

const getBank = async () => {
  const data = await getBankApi();
  bankList.value = data.data.data.banks.filter(
    (bank) => bank.open === true && bank.type === "tixian"
  );
  if (bankList.value[0].maintain === true) {
    selected.value = -1;
  }

  console.log(bankList.value);
};

onMounted(() => {
  getBank();
  if (phone.value !== null) {
    selected.value = 0;
    setBankId(10);
  }
});

onBeforeUnmount(() => {
  depositStore.$patch({
    taxId: null,
    phone: null,
    type: null,
    pixKey: null,
    orderNum: null,
  });
});

const selectWay = (id, index) => {
  console.log(id);
  if (
    bankList.value[0].maintain === true &&
    bankList.value[1].maintain === true
  ) {
    selected.value = -1;
    disabled.value = true;
  } else {
    setBankId(id);
    selected.value = index;
  }
};
const addAmount = (amount, label) => {
  if (bankList.value[0].maintain === true) {
    return;
  }

  let balance = balanceData.value[walletType.value].balance / 10000;
  if (!taxId.value && !phone.value && !type.value && !pixKey.value) {
    withdrawAmount.value = null;
    toggleModal(true);
    modalType("GCashList", "longContent");
  } else {
    if (label === "max") {
      disabled.value = false;
      if (balance < maxAm.value) {
        withdrawAmount.value = Math.floor(balance);
      } else {
        withdrawAmount.value = maxAm.value;
      }
    }

    if (withdrawAmount.value + amount > balance) {
      console.log("aaa");
      disabled.value = false;
      withdrawAmount.value = Math.floor(balance);
    } else {
      disabled.value = false;
      if (withdrawAmount.value + amount < maxAm.value) {
        withdrawAmount.value += amount;
      } else {
        withdrawAmount.value = maxAm.value;
      }
    }
  }
};

const disabled = ref(true);
const inputFocus = () => {
  if (
    bankList.value[0].maintain === true &&
    bankList.value[1].maintain === true
  ) {
    return;
  }
  if (!taxId.value && !phone.value && !type.value && !pixKey.value) {
    disabled.value = true;
    withdrawAmount.value = null;
    toggleModal(true);
    modalType("GCashList", "longContent");
  } else {
    disabled.value = false;
  }
};

const handleInput = (e) => {
  if (e.key === "Backspace") {
    return;
  }
  let balance = balanceData.value[walletType.value].balance / 10000;
  if (withdrawAmount.value <= maxAm.value) {
    if (withdrawAmount.value > balance) {
      withdrawAmount.value = Math.floor(balance);
    } else {
      withdrawAmount.value = Number(
        withdrawAmount.value.toString().replace(/[^0-9]/g, "")
      );
    }
  } else {
    withdrawAmount.value = maxAm.value;
  }
  if (withdrawAmount.value === 0) {
    withdrawAmount.value = null;
  }
  console.log(typeof withdrawAmount.value);
};

const clear = () => {
  withdrawAmount.value = null;
};

const handleWithdraw = () => {
  if (flow.value < gateway.value) {
    openMsg({
      content: t("有效投注不足"),
    })
      .then(() => {
        withdrawWay.value = "";
        selected.value = -1;
        withdrawAmount.value = null;
        removeBankNum();
        removeBankName();
        removeTaxId();
        removePhoneNum();
        removePixType();
        removePixKey();
        depositStore.$patch({
          taxId: null,
          phone: null,
          type: null,
          pixKey: null,
          orderNum: null,
        });
      })
      .catch(() => {
        withdrawWay.value = "";
        selected.value = -1;
        withdrawAmount.value = null;
        removeBankNum();
        removeBankName();
        removeTaxId();
        removePhoneNum();
        removePixType();
        removePixKey();
        depositStore.$patch({
          taxId: null,
          phone: null,
          type: null,
          pixKey: null,
          orderNum: null,
        });
      });
  } else {
    setWithdrawWay(withdrawWay.value);
    setWithdrawAm(withdrawAmount.value);
    setTaxId(taxId.value);
    setPhoneNum(phone.value);
    setPixType(type.value);
    setPixKey(pixKey.value);
    // setWithdrawType(withdrawType.value);
    router.push("/deposit/withdrawForm");
  }
};
const throttleSave = throttle(handleWithdraw, 3000, true);
</script>

<style lang="scss" scoped>
.withdraw-wrapper {
  color: $primary;
  padding-bottom: 10%;
  .wallet-info {
    display: flex;
    justify-content: space-evenly;
    height: 5rem;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding-left: 2%;
    white-space: break-spaces;
    .item {
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      flex: 1;
      .coin-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        .coin {
          width: 24%;
        }
      }
    }
  }
  .withdraw-way {
    .title {
      text-align: center;
      margin-bottom: 5%;
      color: #fff;
      background-color: #8c17c2;
      height: 2.5rem;
      line-height: 2.5rem;
    }
    .content {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      .item {
        padding: 2%;
        text-align: center;
        background: none;
        .icon {
          width: 80px;
          height: 80px;
        }

        .name {
          text-align: center;
          margin-top: 5%;
          color: #fff;
        }
      }
      .selected {
        padding: 3%;
        border: 5px solid #f7e4ff;
        border-radius: 10px;
      }
      .maintain {
        background: gray;
        border-radius: 10px;
        position: relative;
        img {
          filter: brightness(0.5);
        }
      }
      .maintainWords {
        position: absolute;
        top: 30%;
        font-weight: 600;
        color: #fff;
        font-size: 0.8rem;
        right: 0;
        filter: drop-shadow(2px 4px 6px black);
        z-index: 999;
        span {
          display: inline-block;
        }
      }
    }
  }
  .withdraw-type {
    width: 90%;
    margin: 0 auto;
    margin-top: 5%;
    .expand-default {
      width: 100%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      position: relative;
      color: rgb(49, 79, 118);
      .expandListOpen {
        position: absolute;
        right: 1%;
        top: 35%;
        width: 6%;
        transform: rotate(180deg);
      }
    }
    .typeSelectedColor {
      color: $primary;
    }
    .default {
      width: 100%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border: 2px solid rgb(54, 100, 131);
      border-radius: 5px;

      .list-open {
        position: absolute;
        right: 1%;
        top: 35%;
        width: 6%;
      }
    }
    .options {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 1%;
      .option {
        height: 2rem;
        line-height: 2rem;
      }
    }
  }
  .expand {
    border: 2px solid rgb(54, 100, 131);
    border-radius: 5px;
  }
  .withdraw-amount {
    margin-top: 5%;
    .default {
      width: 90%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border: 2px solid rgb(54, 100, 131);
      border-radius: 5px;
      position: relative;
      .amount {
        font-weight: bold;
        width: 100%;
        text-align: center;
        outline: none;
        background: none;
        color: #fff;
        &::-webkit-input-placeholder {
          text-align: center;
          color: #f7e4ff;
        }
      }
      .clear {
        width: 20px;
        position: absolute;
        right: 5%;
        top: 25%;
        font-weight: 600;
        filter: contrast(0);
        opacity: 0.6;
      }
      i {
        font-size: 2.5rem;
        position: absolute;
        right: 5%;
        top: -12%;
        font-weight: 600;
        filter: contrast(0);
        opacity: 0.6;
      }
    }
    .options {
      width: 95%;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 3%;
      .option {
        width: 23%;
        height: 2rem;
        text-align: center;
        line-height: 2rem;
        border-radius: 10px;
        background-color: #8c17c2;
        margin: 1%;
        color: #fff;
        font-weight: 600;
      }
    }
  }
  .withdraw-address {
    margin-top: 5%;
    .default {
      width: 90%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border: 2px solid rgb(54, 100, 131);
      border-radius: 5px;
      .address {
        width: 100%;
        text-align: center;
        outline: none;
        &::-webkit-input-placeholder {
          text-align: center;
          color: rgb(49, 79, 118);
        }
      }
    }
  }
  .remind {
    text-align: center;
    margin: 10% 0 5%;
  }
  .confirm {
    width: 90%;
    height: 2.5rem;
    background-color: #8c17c2;
    margin: 0 auto;
    text-align: center;
    line-height: 2.5rem;
    border-radius: 10px;
    color: #fff;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .disabled {
    filter: grayscale(0.7);
    color: gray;
  }
}
</style>
