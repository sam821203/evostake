<template>
  <div class="deposit-form">
    <!-- <div class="count-down">
      <div class="title">{{ $t("stored.depositDeadline") }}</div>
      <div class="content">
        <vue-countdown
          :time="time"
          :transform="transformSlotProps"
          v-slot="{ hours, minutes, seconds }"
        >
          <p class="hours">
            <span>{{ Math.floor(hours / 10) }}</span>
            <span>{{ Math.floor(hours % 10) }}</span>
          </p>
          :
          <p class="minutes">
            <span>{{ Math.floor(minutes / 10) }}</span>
            <span>{{ Math.floor(minutes % 10) }}</span>
          </p>
          :
          <p class="seconds">
            <span>{{ Math.floor(seconds / 10) }}</span>
            <span>{{ Math.floor(seconds % 10) }}</span>
          </p>
        </vue-countdown>
      </div>
    </div> -->
    <!-- <div class="title">{{ $t("stored.depositDetail") }}</div> -->
    <div class="content">
      <div class="item amount">
        <img src="@/assets/images/memberCenter/GCash_box.png" alt="" />
        <!-- <div class="subtitle">{{ $t("stored.depositAmount") }}：</div> -->
        <div
          :class="['detail', 'price', { longContent: amount >= 1000 }]"
          v-price="amount * 10000"
        ></div>
      </div>

      <div class="item">
        <div class="url" @click="openCharge(chargeUrl)">
          <img src="@/assets/images/memberCenter/GOAPP_button.png" alt="" />
        </div>
      </div>
      <!-- <img
          src="@/assets/images/memberCenter/copy_button.png"
          alt=""
          class="copy"
          @click="copy(chargeUrl)"
        /> -->

      <div class="delete" @click="deleteForm">
        <img src="@/assets/images/memberCenter/cancel_button.png" alt="" />
      </div>
    </div>

    <p>
      Deposit will be temporary paused if the deal is cancelled more than 2
      times in 10 minutes.
    </p>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import i18n from "@/utils/i18n";
import { storeToRefs } from "pinia";
// import useClipboard from "vue-clipboard3";
import { useMessage } from "@/store/msgStore";
import { useDeposit } from "@/store/depositStore";
import { useRouter } from "vue-router";
import { getOrderApi, deleteOrderApi } from "@/api/deposit";
import { useLoading } from "@/store/loadingStore";
const loadingStore = useLoading();

const { t } = i18n.global;
const router = useRouter();
const depositStore = useDeposit();
const { handleDepositPath } = depositStore;
const { orderNum } = storeToRefs(depositStore);
const msg = useMessage();
const { openMsg } = msg;
// const { toClipboard } = useClipboard();
const time = ref(null);
const chargeUrl = ref("");
const failedTime = ref(null);
const amount = ref(null);

onMounted(async () => {
  await handleDepositPath();
  if (orderNum.value) {
    getOrderData();
  }
});
const getOrderData = async () => {
  const res = await getOrderApi(orderNum.value);

  console.log(res);
  loadingStore.$patch({
    loadingStatus: false,
  });
  chargeUrl.value = res.data.data.order.content.charge_url;
  failedTime.value = res.data.data.order.maybe_expired_at;
  amount.value = res.data.data.order.tx_amount;
  time.value =
    new Date(failedTime.value).getTime() - new Date().getTime() - 55000;
};

// const copy = (value) => {
//   toClipboard(value);
// };
const deleteForm = () => {
  openMsg({
    slot: t("stored.deleteRemind"),
    hasBtn: true,
    hasCancel: true,
  }).then(async () => {
    const res = await deleteOrderApi(orderNum.value);
    console.log(res);
    if (res.data.code === 0) {
      depositStore.$patch({
        orderNum: null,
        validOrder: null,
      });
      router.push("/deposit/deposit");
    }
  });
};

// const transformSlotProps = (props) => {
//   const formattedProps = {};

//   Object.entries(props).forEach(([key, value]) => {
//     formattedProps[key] = value < 10 ? `0${value}` : String(value);
//   });

//   return formattedProps;
// };

const openCharge = (url) => {
  window.open(url);
};
</script>

<style lang="scss" scoped>
.deposit-form {
  height: 100%;
  position: relative;
  color: $primary;
  padding-bottom: 10%;
  padding-top: 3%;
  .count-down {
    width: 100%;
    .title {
      text-align: center;
      margin-bottom: 5%;
      color: rgb(100, 240, 253);
      background-color: rgb(99, 129, 161);
      height: 2.5rem;
      line-height: 2.5rem;
    }
    .content {
      display: flex;
      justify-content: center;
      text-align: center;
      height: 3.5rem;
      line-height: 3.5rem;
      font-size: 2.5rem;
      margin-top: 5%;
      span {
        display: flex;
        width: 80%;
        justify-content: space-evenly;
        margin: 0 auto;
        p {
          width: 30%;
          display: flex;
          color: red;
          span {
            background-image: url("@/assets/images/memberCenter/timebox1.png");
            background-size: 100% 100%;
            width: 45%;
          }
        }
      }
    }
  }
  .title {
    text-align: center;
    margin-bottom: 5%;
    color: rgb(100, 240, 253);
    background-color: rgb(99, 129, 161);
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .content {
    width: 90%;
    margin: 0 auto;
    font-size: 0.9rem;
    position: relative;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 6%;
      .subtitle {
        color: rgb(50, 112, 164);
        width: 50%;
      }
      .detail {
        text-align: end;
        width: 50%;
        overflow-wrap: break-word;
        height: 2rem;
      }
      .url {
        width: 80%;
        margin: 8% auto;
      }
      img {
        width: 100%;
      }
    }
    .amount {
      position: relative;
    }
    .price {
      position: absolute;
      color: rgb(22, 128, 248);
      position: absolute;
      font-size: 1.5rem;
      bottom: 14%;
      left: 50%;
      transform: translate(-80%);
      font-weight: 600;
    }
    .longContent {
      transform: translate(-70%);
    }
    .copy {
      width: 5%;
      position: absolute;
      right: 0;
      bottom: 40%;
    }

    .delete {
      width: 80%;
      margin: 5% auto;
      img {
        width: 100%;
      }
    }
  }

  p {
    width: 68%;
    margin: 5% auto;
  }
}
</style>
