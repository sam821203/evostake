<template>
  <div class="deposit-wrapper">
    <!-- 存款方式 -->
    <div class="deposit-way">
      <div class="title">{{ $t("stored.depositType") }}</div>
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
          <img
            :src="bank.icon"
            alt=""
            :class="['icon', { maintainIcon: bank.maintain }]"
          />
          <p class="name">{{ bank.bank_display_name }}</p>
        </button>
      </div>
    </div>
    <!-- 存款金額 -->
    <div class="deposit-amount">
      <div class="default">
        <input
          type="number"
          :placeholder="$t('stored.depositPlaceholder')"
          class="amount"
          v-model="depositAmount"
          @keyup.enter="throttleSave"
          @keyup="handleInput"
          inputmode="numeric"
          min="0"
          :disabled="disabled"
        />
        <img
          v-if="Number.isInteger(depositAmount) || depositAmount >= 20"
          class="clear"
          @click="clear"
          src="@/assets/images/memberCenter/cancel.png"
          alt=""
        />
        <i class="bi bi-keyboard-fill" v-else></i>
      </div>
      <div class="options">
        <button
          class="option"
          v-for="(option, index) in optionList"
          :key="index"
          @click="addAmount(option.amount)"
          :disabled="disabled"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
    <button
      :class="[
        'confirm',
        {
          disabled:
            !depositAmount || !depositWay || depositAmount < 20 || disabled,
        },
      ]"
      @click.prevent="throttleSave"
      :disabled="
        !depositAmount || !depositWay || depositAmount < 20 || disabled
      "
    >
      {{ $t("stored.OK") }}
    </button>
    <!-- <div class="firstDepositCheck container" v-if="!userInfo.is_deposit">
      <input
        type="checkbox"
        id="firstDeposit"
        v-model="firstDeposit"
        value="1"
      />

      <label for="firstDeposit"></label>
      <span :class="{ selectFirstDeposit: firstDeposit }"
        >I want to participate in this promotional campaign.</span
      >
    </div>
    <p v-if="!userInfo.is_deposit">
      Only the first deposit after the registration.
    </p>
    <table border="1" v-if="!userInfo.is_deposit">
      <tr class="head">
        <td>Exact Deposit</td>
        <td>Cash Back</td>
        <td>Valid Bets to Withdraw</td>
      </tr>
      <tr>
        <td>200-50,000</td>
        <td>10%</td>
        <td>1X</td>
      </tr>
    </table>
    <div class="everydayCashBack container">
      <input
        type="checkbox"
        id="everydayCashBack"
        v-model="everydayCashBack"
        value="2"
      />
      <label for="everydayCashBack"></label>
      <span :class="{ selectEverydayCashBack: everydayCashBack }"
        >I want to participate in this promotional campaign.</span
      >
    </div>
    <p>Everyday cash back.</p>
    <table border="1">
      <tr class="head">
        <td>Deposit</td>
        <td>Cash Back</td>
        <td>Valid Bets to Withdraw</td>
      </tr>
      <tr>
        <td>100-50,000</td>
        <td>3%</td>
        <td>1X</td>
      </tr>
    </table> -->
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useMessage } from "@/store/msgStore";
// import { useRouter } from "vue-router";
import {
  getBankApi,
  chargeApi,
  getOrderApi,
  getAllOrderApi,
} from "@/api/deposit";
import throttle from "@/utils/throttle";
import { useDeposit } from "@/store/depositStore";
import { useLoading } from "@/store/loadingStore";
import { useModal } from "@/store/modalStore";
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
const { useAuth } = useStore();
const authStore = useAuth();
const { userInfo } = storeToRefs(authStore);
const { getUserInfo } = authStore;
const depositStore = useDeposit();
const { orderNum } = storeToRefs(depositStore);
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
// const router = useRouter();
const msg = useMessage();
const { openMsg } = msg;
const selected = ref(0);
const depositWay = ref(5);
const depositAmount = ref(null);
const bankList = ref([]);
const loadingStore = useLoading();
const modalStore = useModal();
const { toggleModal, modalType } = modalStore;
const disabled = ref(false);
// const firstDeposit = ref(true);
// const everydayCashBack = ref(false);
const campaignId = ref(1);
const bankId = ref(null);

getUserInfo();
console.log(userInfo.value);

onMounted(() => {
  getAllOrder();
  // if (userInfo.value.is_deposit) {
  //   everydayCashBack.value = true;
  //   firstDeposit.value = false;
  //   campaignId.value = 2;
  // }
  getUserInfo();
  getBank();
});

// watch(everydayCashBack, (val) => {
//   if (!userInfo.value.is_deposit && val) {
//     firstDeposit.value = false;
//     everydayCashBack.value = true;
//     campaignId.value = 2;
//   }
//   if (userInfo.value.is_deposit && val && !firstDeposit.value) {
//     campaignId.value = 2;
//   }
//   if (val === false) {
//     campaignId.value = 0;
//   }
// });

// watch(firstDeposit, (val) => {
//   if (val === false && !everydayCashBack.value) {
//     firstDeposit.value = false;
//     everydayCashBack.value = false;
//     campaignId.value = 0;
//   }
//   if (val === true) {
//     firstDeposit.value = true;
//     everydayCashBack.value = false;
//     campaignId.value = 1;
//   }
// });

// 驗證有無有效存款單
const isValidOrder = () => {
  if (validOrder.value.length) {
    disabled.value = true;
    depositAmount.value = null;
    console.log("---VALIDORDER---");
    depositStore.$patch({
      orderNum: validOrder.value[0].merch_order_no,
    });
    toggleModal(true);
    modalType("depositPopout", "longContent");
  }
};

// 檢查有無有效存款單，若有則顯示彈窗
const validOrder = ref(null);
const getAllOrder = async () => {
  const res = await getAllOrderApi();
  // console.log(res);
  validOrder.value = res.data.data.orders.filter(
    (order) =>
      order.status === 2 &&
      new Date(order.maybe_expired_at).getTime() > new Date().getTime()
  );

  isValidOrder();
};

// 三方清單
const getBank = async () => {
  const data = await getBankApi();
  bankList.value = data.data.data.banks.filter(
    (bank) => bank.open === true && bank.type === "charge"
  );
  bankId.value = bankList.value[0].bank_id;
  console.log(bankId.value);
  // if (bankList.value[0].maintain === true) {
  //   selected.value = 1;
  //   bankId.value = 7;
  // }
  // if (
  //   bankList.value[0].maintain === true &&
  //   bankList.value[1].maintain === true
  // ) {
  //   selected.value = -1;
  //   disabled.value = true;
  // }
  console.log(bankList.value);
};

// 存款方式
const selectWay = (id, index) => {
  if (
    bankList.value[0].maintain === true &&
    bankList.value[1].maintain === true
  ) {
    selected.value = -1;
    bankId.value = -1;
    return;
  }
  console.log(id);
  bankId.value = id;
  selected.value = index;
};

// 儲值金額按鈕
const addAmount = (value) => {
  isValidOrder();

  if (!depositWay.value) {
    openMsg({
      content: "請先選擇存款方式",
    });
    return;
  }
  depositAmount.value += value;
  //  else {
  //   depositAmount.value = 20000;
  // }
};

// 儲值input驗證為正整數
const handleInput = (e) => {
  isValidOrder();
  if (e.key === "Backspace") {
    return;
  }
  depositAmount.value = Number(
    depositAmount.value.toString().replace(/[^0-9]/g, "")
  );
  if (depositAmount.value === 0) {
    depositAmount.value = null;
  }
  if (depositAmount.value > 20000) {
    depositAmount.value = 20000;
  }

  // console.log(typeof depositAmount.value);
};

// 清除input
const clear = () => {
  depositAmount.value = null;
};

// 建立存款單
const handleDeposit = async () => {
  isValidOrder();

  loadingStore.$patch({
    loadingStatus: true,
  });
  const res = await chargeApi(bankId.value, "brapay_pay", {
    tx_amount: Number(depositAmount.value),
    campaign_id: campaignId.value,
    // is_deposit: userInfo.value.is_deposit,
  });
  // if (res) {
  //   return;
  // }
  if (res.data.code === 0) {
    loadingStore.$patch({ loadingStatus: false });
    depositStore.$patch({
      orderNum: res.data.data.merch_order_no,
    });
    // router.push("/deposit/depositForm");
    getOrderPath();
  }
};

// 開分頁到 Pix
const chargeUrl = ref("");
const getOrderPath = async () => {
  const res = await getOrderApi(orderNum.value);
  // console.log(res);
  if (res.data.code === 0) {
    chargeUrl.value = res.data.data.order.content.charge_url;
    window.open(chargeUrl.value);
    nextTick(() => {
      location.reload();
    });
  }
};

// 防止連點
const throttleSave = throttle(handleDeposit, 3000, true);
</script>

<style lang="scss" scoped>
.deposit-wrapper {
  color: $primary;
  .deposit-way {
    .title {
      text-align: center;
      margin-bottom: 5%;
      color: #fff;
      background-color: #8c17c2;
      height: 2.5rem;
      line-height: 2.5rem;
    }
    .content {
      width: 60%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      .item {
        padding: 2%;
        background: none;
        .icon {
          width: 80px;
          height: 80px;
        }

        .name {
          text-align: center;
          margin-top: 5%;
          font-size: 0.9rem;
          color: #fff;
        }
      }
      .selected {
        padding: 3%;
        border: 5px solid #f7e4ff;
        border-radius: 10px;
        // background-image: url("@/assets/images/memberCenter/choose.png");
        // background-size: 100% 100%;
        // background-repeat: no-repeat;
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
  .deposit-type {
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
      color: #fff;
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
      // color: rgb(49, 79, 118);
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
  .deposit-amount {
    margin-top: 5%;
    .default {
      width: 90%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border: 2px solid #8c17c2;
      border-radius: 5px;
      position: relative;
      input {
        background: none;
      }
      .amount {
        font-weight: bold;
        width: 100%;
        // background-color: #fff;
        text-align: center;
        outline: none;
        color: white;
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
        width: calc(23%);
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

  .confirm {
    width: 90%;
    height: 2.5rem;
    background-color: #8c17c2;
    margin: 0 auto;
    text-align: center;
    line-height: 2.5rem;
    border-radius: 10px;
    margin-top: 5%;
    color: #fff;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .disabled {
    // background-color: #f7e4ff;
    filter: grayscale(0.7);
    color: gray;
  }
  .container {
    margin: 4% 2% 1%;
    position: relative;
    display: flex;
    input {
      margin-right: 2%;
    }
    label {
      /* 主外框 */
      position: relative;
      display: inline-block;
      width: 22px;
      height: 20px;
      cursor: pointer;
      border: 2px solid #ff8d1a;
      border-radius: 5px;
      -moz-transition: background-color 0.2s ease-in;
      -webkit-transition: background-color 0.2s ease-in;
      -o-transition: background-color 0.2s ease-in;
      transition: background-color 0.2s ease-in;
    }
    span {
      margin-left: 2%;

      font-weight: 600;
    }
    .selectFirstDeposit,
    .selectEverydayCashBack {
      color: #d97816;
    }

    label::before,
    label::after {
      /* 上面的打勾 */
      content: "";
      position: absolute;
      width: 3px;
      background-color: white;
      -moz-transition: opacity 0.2s ease-in;
      -webkit-transition: opacity 0.2s ease-in;
      -o-transition: opacity 0.2s ease-in;
      transition: opacity 0.2s ease-in;
      opacity: 0;
    }

    label::before {
      /* 打勾左邊的線 */
      height: 9px;
      top: 7px;
      left: 3px;
      -moz-transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }

    label::after {
      /* 打勾右邊的線 */
      height: 13px;
      top: 2px;
      left: 10px;
      -moz-transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }

    input:checked + label {
      /* 當check時 按鈕顏色改變 */
      background-color: #ff8d1a;
    }

    input:checked + label::before,
    input:checked + label::after {
      /* 當check時 打勾消失 */
      opacity: 1;
    }

    input {
      display: none;
    }
  }

  p {
    width: 97%;
    margin: 0 2%;
  }
  .line2 {
    margin: 0 auto;
    color: red;
  }
  table {
    border-collapse: collapse;
    width: 97%;
    margin: 0 auto;
    text-align: center;
    font-size: 0.8rem;
    margin-bottom: 2%;
    .head {
      background-color: rgb(99, 129, 161);
      color: rgb(100, 240, 253);
    }
  }
}
</style>
