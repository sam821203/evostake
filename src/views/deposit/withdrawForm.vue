<template>
  <loading class="loading" v-if="isLoading" />
  <div class="withdraw-form" v-else>
    <div class="title">{{ $t("stored.withdrawDetail") }}</div>
    <div class="confirm-content">
      <div class="content">
        <div class="item">
          <div class="subtitle">{{ $t("stored.withdrawWay") }}</div>
          <div class="detail">{{ withdrawWay }}</div>
        </div>
        <!-- <div class="item">
          <div class="subtitle">{{ $t("stored.withdrawAdd") }}</div>
          <div class="detail">{{ bankAccNum }}</div>
        </div> -->
        <div class="item">
          <div class="subtitle">{{ $t("stored.amount") }}</div>
          <div class="detail" v-price="withdrawAm * 10000"></div>
        </div>
        <div class="item">
          <div class="subtitle">{{ $t("stored.balance") }}</div>
          <div class="detail" v-price="balanceData[walletType]?.balance"></div>
        </div>
      </div>
    </div>
    <div class="trade-code">
      <div class="title">{{ $t("stored.tradePwd") }}</div>
      <div class="input">
        <input @keyup.enter="throttleSave" v-model="pwd" />
      </div>
    </div>
    <button
      :class="['confirm', { disabled: !pwd }]"
      @click="throttleSave"
      :disabled="!pwd"
    >
      {{ $t("stored.withdrawConfirm") }}
    </button>
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "@/store/msgStore";
import { useStore } from "@/store/index";
import throttle from "@/utils/throttle";
import { chargeApi, addGCashApi } from "@/api/deposit";
import { useDeposit } from "@/store/depositStore";
import { storeToRefs } from "pinia";
import i18n from "@/utils/i18n";
import {
  getWithdrawWay,
  getWithdrawAm,
  // getBankAccNum,
  // getBankAccName,
  getTaxId,
  getPhoneNum,
  getPixType,
  getPixKey,
  // getBankId,
  removeBankNum,
  removeBankName,
  removeWithdrawAm,
  removeWithdrawWay,
  removeBankId,
  removeTaxId,
  removePhoneNum,
  removePixType,
  removePixKey,
  // getWithdrawType,
} from "@/utils/cookie";
import { useLoading } from "@/store/loadingStore";
const loadingStore = useLoading();

const { useAuth, useSsevent } = useStore();
const authStore = useAuth();
const sseStore = useSsevent();
const { balanceData } = storeToRefs(sseStore);

const { walletType } = storeToRefs(authStore);
const { t } = i18n.global;
const depositStore = useDeposit();
// const { gCashNum, gCashName } = storeToRefs(depositStore);
const msg = useMessage();
const router = useRouter();
const { openMsg } = msg;
const withdrawWay = ref(getWithdrawWay("withdraw_way"));
const withdrawAm = ref(getWithdrawAm("withdraw_am"));
const taxId = ref(getTaxId("taxid"));
const phoneNum = ref(getPhoneNum("phoneNum"));
const pixType = ref(getPixType("PixType"));
const pixKey = ref(getPixKey("PixKey"));

// const bankId = ref(getBankId("bank_id"));

const pwd = ref(null);

const handleWithdraw = async () => {
  loadingStore.$patch({
    loadingStatus: true,
  });
  const res = await chargeApi(10, "brapay_pix_tx", {
    tx_amount: Number(withdrawAm.value),
    phone: phoneNum.value,
    taxid: taxId.value,
    pixkey: pixKey.value,
    pixtype: pixType.value,
    second_password: pwd.value,
  });
  console.log(res);

  if (res.data.code === 0) {
    loadingStore.$patch({
      loadingStatus: false,
    });
    const addGCashRes = await addGCashApi(phoneNum.value, {
      taxid: taxId.value,
      pixkey: pixKey.value,
      pixtype: pixType.value,
    });
    console.log(addGCashRes);
    openMsg({
      slot: t("withdrawPopout"),
      hasBtn: true,
    }).then(() => {
      depositStore.$patch({
        gCashNum: null,
        gCashName: null,
      });
      removeBankNum();
      removeBankName();
      removeWithdrawAm();
      removeWithdrawWay();
      removeTaxId();
      removePhoneNum();
      removePixType();
      removePixKey();
      router.push("/deposit/tradeRecord");
    });
  }
};

onBeforeUnmount(() => {
  removeBankNum();
  removeBankName();
  removeWithdrawAm();
  removeWithdrawWay();
  removeBankId();
  removeTaxId();
  removePhoneNum();
  removePixType();
  removePixKey();
});

const throttleSave = throttle(handleWithdraw, 3000, true);
</script>

<style lang="scss" scoped>
.withdraw-form {
  height: 100%;
  position: relative;
  color: $primary;
  padding-bottom: 10%;
  .title {
    text-align: center;
    margin-bottom: 5%;
    color: #fff;
    background-color: #8c17c2;
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .confirm-content {
    padding-left: 5%;
    padding-right: 5%;
    .content {
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8%;
        .subtitle {
          width: 80%;
        }
        .detail {
          text-align: end;
          width: 70%;
          color: #fff;
        }
      }
    }
  }
  .trade-code {
    margin-top: 5%;

    .title {
      text-align: center;
      margin-bottom: 5%;
      color: #fff;
      background-color: #8c17c2;
      height: 2.5rem;
      line-height: 2.5rem;
    }
    .input {
      width: 60%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border: 2px solid #f7e4ff;
      border-radius: 5px;
      input {
        width: 100%;
        text-align: center;
        outline: none;
        background: none;
        color: #fff;
      }
    }
  }

  .confirm {
    width: 90%;
    height: 2.5rem;
    background-color: #8c17c2;
    margin: 0 auto;
    text-align: center;
    line-height: 2.5rem;
    border-radius: 10px;
    margin-top: 10%;
    color: #fff;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .disabled {
    background-color: lightgray;
  }
}
</style>
