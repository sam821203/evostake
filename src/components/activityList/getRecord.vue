<template>
  <!-- 紅利狀態 -->
  <!-- <div class="stateGroup">
    <div
      :class="[
        'option',
        { child: index > 0 },
        { selected: selected === option.id },
      ]"
      v-for="(option, index) in optionList"
      :key="index"
      @click="selectState(option.id)"
    >
      {{ $t(option.option) }}
    </div>
  </div> -->
  <div class="statusGroup" v-if="showList">
    <div class="curStatus" @click="showStatus">{{ $t(curStatus) }}</div>
    <div :class="['arrow', { openArrow: statusList }]"></div>

    <div v-if="statusList" class="optionList">
      <div
        class="statusOption"
        v-for="(option, index) in optionList"
        :key="index"
        @click="selectState(option.id, option.option)"
      >
        <p>{{ $t(option.option) }}</p>
      </div>
    </div>
  </div>
  <div class="noData" v-else>{{ $t("No Data") }}</div>

  <!-- 紅利細節 -->
  <div
    class="bonusSection"
    @click="openBonusDetail(index)"
    v-for="(bonus, index) in showList"
    :key="index"
  >
    <div class="topContent">
      <p>{{ bonus.name }}</p>
      <div class="bonusContent">
        <span>{{ $t("Bonus") }}</span>
        <span>R$ {{ bonus.bonus / 10000 }} </span>
      </div>
    </div>
    <div :class="['downContent', { openDownContent: bonusDetail === index }]">
      <div
        class="claimDeadline"
        v-if="bonus.status === 0 && bonus.countDownTime !== '00:00:00'"
      >
        <span>{{ $t("Claim Deadline") }}: </span
        ><span :class="[{ red: bonus.smallThanOneDay }]">{{
          bonus.countDownTime
        }}</span>
      </div>
      <div class="claimDeadline" v-else></div>
      <div v-if="bonusDetail === index">
        <div class="line">
          <span>{{ $t("completion Deadline") }}: </span
          ><span v-time="bonus.achieve_time"></span>
        </div>
        <div class="line">
          <span>{{ $t("Redeem Threshold") }}: </span
          ><span>{{ bonus.threshold / 10000 }}</span>
        </div>
        <div class="line">
          <span>{{ $t("Post-Redeem Threshold") }}: </span
          ><span>{{ (userRedeem + bonus.threshold) / 10000 }}</span>
        </div>
        <button
          class="claim"
          @click.prevent="claim(bonus.id, bonus.type)"
          v-if="bonus.status === 0 && bonus.countDownTime !== '00:00:00'"
        >
          {{ $t("CLAIM") }}
        </button>
        <div class="blank" v-else></div>
        <p v-if="bonus.status === 3" class="similar">
          {{ $t("Already received similar bonuses") }}
        </p>
      </div>
      <div :class="['arrow', { openArrow: bonusDetail === index }]"></div>
    </div>
    <!-- 領取狀態印章 -->
    <div
      :class="['expiredStamp', { openStamp: bonusDetail === index }]"
      v-if="
        bonus.status === 2 ||
        (bonus.countDownTime === '00:00:00' &&
          bonus.status !== 3 &&
          bonus.status !== 1)
      "
    >
      {{ $t("Expired") }}
    </div>
    <div
      :class="['claimStamp', { openStamp: bonusDetail === index }]"
      v-if="bonus.status === 1"
    >
      {{ $t("Claimed") }}
    </div>
    <div
      :class="['cancelStamp', { openStamp: bonusDetail === index }]"
      v-if="bonus.status === 3"
    >
      {{ $t("Canceled") }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from "vue";
import { useStore } from "@/store/index";
import { useRouter } from "vue-router";
import { getBonusListApi, claimBonusApi } from "@/api/announcement.js";
import { getPlayerId } from "@/utils/cookie";
import { storeToRefs } from "pinia";
import { displayTimeLeft } from "@/utils/timer";
const { useMessage, useAuth } = useStore();
const authStore = useAuth();
const { userInfo } = storeToRefs(authStore);
const userRedeem = ref(userInfo.value.wallets[0].cash_out_gateway);
const { openMsg } = useMessage();
const router = useRouter();

const selected = ref(4);
const optionList = reactive([
  { option: "全部", id: 4 },
  { option: "可領取", id: 0 },
  { option: "已領取", id: 1 },
  { option: "已過期", id: 2 },
  { option: "已取消", id: 3 },
]);

const bonusDetail = ref(-1);

const totalList = ref(null);
const showList = ref(null);

const curStatus = ref("全部");
const statusList = ref(true);
const showStatus = () => {
  statusList.value = !statusList.value;
};

const openBonusDetail = (index) => {
  if (bonusDetail.value === index) {
    bonusDetail.value = -1;
    open.value = -1;
  } else {
    bonusDetail.value = index;
    open.value = index;
  }
};

const claim = (id, type) => {
  console.log("claim");
  openMsg({
    content: "Você tem certeza de que deseja resgatar o bônus da atividade?",
    hasCancel: true,
  }).then(() => {
    claimBonus(id, type);
  });
};

const claimBonus = async (id, type) => {
  const claimRes = await claimBonusApi(id, type);
  if (claimRes.data.code === 0) {
    selectState(selected.value, curStatus.value);
    statusList.value = false;
    console.log(claimRes);
  }
};

//取得列表，預設顯示全部 Bonus
const selectState = async (id, option) => {
  selected.value = id;
  curStatus.value = option;
  statusList.value = !statusList.value;
  bonusDetail.value = -1;
  if (getPlayerId() === undefined) {
    openMsg({ content: "請先登入 / 註冊" }).then(() => {
      router.push("/home");
    });
    return;
  } else {
    const bonusListRes = await getBonusListApi(userInfo.value.account);
    totalList.value = bonusListRes.data.data.data;
    if (id === 4) {
      showList.value = totalList.value;
    } else {
      showList.value = totalList.value.filter((item) => item.status === id);
      console.log(showList.value);
    }
    if (id === 4 || id === 0) {
      console.log(id);
      for (let i in showList.value) {
        showList.value[i].countDownTime = "";
        showList.value[i].smallThanOneDay = false;
        showList.value[i].timeExpired = false;
        if (showList.value[i]?.status === 0) {
          countdown(i);
        }
        console.log(i);
      }
    }
  }
};
selectState(4, "全部");

let intervalTimer = ref({});
const countdown = (i) => {
  intervalTimer.value[i] = setInterval(() => {
    const deadline = new Date(showList.value[i]?.expire_time).getTime();
    const start = new Date().getTime();
    showList.value[i].countDownTime = deadline - start;
    // showList.value[i].countDownTime = deadline - start;
    console.log(showList.value[i]?.countDownTime);
    if (
      showList.value[i]?.countDownTime <= 0 ||
      showList.value[i]?.countDownTime === "00:00:00"
    ) {
      showList.value[i].countDownTime = "0";
      showList.value[i].timeExpired = true;
      clearInterval(intervalTimer.value[i]);
      // return;
    }
    if (showList.value[i]?.countDownTime > 86400000) {
      showList.value[i].countDownTime = `${Math.floor(
        showList.value[i].countDownTime / 86400000
      )} Dias`;
      clearInterval(intervalTimer.value[i]);
    } else {
      showList.value[i].smallThanOneDay = true;
      showList.value[i].countDownTime = displayTimeLeft(
        Math.floor(showList.value[i]?.countDownTime / 1000)
      );
    }
  }, 1000);
};

onBeforeUnmount(() => {
  for (let k in intervalTimer.value) {
    clearInterval(intervalTimer.value[k]);
  }
});
</script>
<style lang="scss">
.statusGroup {
  width: 80%;
  height: 2rem;
  border: 1px solid gray;
  margin: 5% auto 0;
  border-radius: 5px;
  text-align: center;
  line-height: 2rem;
  background: #470c85;
  position: relative;
  z-index: 1;
  .arrow {
    width: 12px;
    height: 12px;
    border: 1px solid gray;
    border-width: 1px 1px 0 0;
    transform: rotate(135deg);
    margin-bottom: 10px;
    position: absolute;
    top: 20%;
    right: 5%;
  }
  .openArrow {
    position: absolute;
    top: 40%;
    right: 5%;
    transform: rotate(-45deg);
  }
}
.noData {
  text-align: center;
  margin-top: 30%;
  font-size: 1.5rem;
  color: gray;
}
.optionList {
  margin: 0 auto;
  text-align: center;
  border: 1px solid gray;
  border-radius: 5px;
  background: rgb(35, 3, 61);
  .statusOption {
    line-height: 2rem;
    height: 2rem;
  }
}

.bonusSection {
  border: 1px solid gray;
  width: 90%;
  margin: 0 auto;
  border-radius: 15px;
  margin-top: 3%;
  position: relative;
  .topContent {
    background: #470c85;
    border-radius: 15px 15px 0 0;
    padding: 3%;
    .bonusContent {
      display: flex;
      justify-content: space-between;
      margin-top: 2%;
    }
  }
  .downContent {
    background: #18134c;
    border-radius: 0 0 15px 15px;
    padding: 3%;
    display: flex;
    justify-content: space-between;
    min-height: 2rem;
    .arrow {
      width: 12px;
      height: 12px;
      border: 1px solid gray;
      border-width: 1px 1px 0 0;
      transform: rotate(135deg);
      margin-bottom: 10px;
    }
    .line {
      margin-bottom: 3%;
    }
    .claimDeadline {
      .red {
        color: red;
      }
    }
  }
  .openDownContent {
    display: flex;
    flex-direction: column;
    position: relative;
    .claimDeadline {
      margin-bottom: 3%;
    }
    .line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3%;
      border-bottom: 1px solid gray;
      padding-bottom: 1%;
    }
    .claim {
      height: 2rem;
      width: 45%;
      color: white;
      border-radius: 10px;
      margin-left: 25%;
      background: #6b0285;
    }
    .blank {
      height: 1.2rem;
      width: 45%;
    }
    .similar {
      text-align: center;
      color: red;
      font-weight: 600;
      margin-top: -5%;
    }
    .openArrow {
      position: absolute;
      bottom: 2%;
      right: 5%;
      transform: rotate(-45deg);
    }
  }
}
.expiredStamp,
.claimStamp,
.cancelStamp {
  width: 35%;
  font-weight: 600;
  text-align: center;
  border-radius: 5px;
  padding: 2%;
  position: absolute;
  top: 50%;
  left: 6%;
  transform: rotate(-8deg);
}
.expiredStamp {
  color: #d43030;
  border: 2px solid #d43030;
}

.claimStamp {
  color: #ff8d1a;
  border: 2px solid #ff8d1a;
}
.cancelStamp {
  color: gray;
  border: 2px solid gray;
}
.openStamp {
  top: 25%;
}
</style>
