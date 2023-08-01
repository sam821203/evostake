<template>
  <!-- 排行榜 -->
  <div class="leaderBoard">
    <div class="btnGroup">
      <div
        :class="[mode == 'invite' ? 'L1' : 'L2']"
        @click="changeBoard('invite')"
      >
        {{ $t("board.bestFriend") }}
      </div>
      <div
        :class="[mode == 'flow' ? 'R1' : 'R2']"
        @click="changeBoard('flow')"
        style="font-size: 1.1rem"
      >
        Melhor Jogadores
      </div>
      <div
        :class="[mode == '123' ? 'M1' : 'M2']"
        @click="changeBoard('123')"
        v-if="false"
      >
        {{ $t("board.promotion") }}
      </div>
    </div>
    <div
      :class="['rankContent', `rankContent${v.top_n}`]"
      v-for="(v, k) in boardData"
      :key="k"
    >
      <div class="first">
        <div class="rank">
          <img
            :src="
              require(`@/assets/images/leaderBoard/award/rank_n${v.top_n}.png`)
            "
            v-if="v.top_n < 4"
          />
          <span v-else>{{ v.top_n }}</span>
        </div>
        <!-- <span>{{ v.nickname }}</span> -->
        <span
          v-sliceAccount:[3]="v.account"
          v-if="v.nickname !== userInfo.nickname"
        ></span>
        <span v-else>{{ v.account }}</span>
      </div>
      <div class="second">
        {{ mode === "invite" ? v.socre / 10000 : (v.socre / 10000).toFixed(2) }}
      </div>
    </div>
    <div class="rankContent" style="visibility: hidden"></div>
    <div class="rankContentbottom" v-if="personalData != null">
      <!-- &&getPlayerId() != undefined -->
      <div class="first">
        <div class="rankWord">
          <span>{{ $t("board.myRanking") }}:</span>
        </div>
        <span>{{ personalData.top_n == -1 ? "-" : personalData.top_n }}</span>
      </div>
      <div class="second">
        <!-- {{ personalData.top_n == -1 ? "-" : personalData.socre / 10000 }} -->
        {{ (personalData.socre / 10000).toFixed(2) }}
      </div>
    </div>
    <!-- <div
      class="rankContentbottom"
      v-if="getPlayerId() == undefined"
      style="justify-content: center"
    >
      {{ $t("未登入時排行榜沒有資料") }}
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/store";
// import { useRouter } from "vue-router";
// const router = useRouter();
import { leaderBoardApi } from "@/api/info";
import { getNormalUser } from "@/utils/cookie";
import { getPlayerId } from "@/utils/cookie";
const { useAuth } = useStore();
const authStore = useAuth();
const { userInfo } = storeToRefs(authStore);
console.log(userInfo.value);
const boardData = ref([]);
const personalData = ref([]);
const mode = ref("invite"); //balance 富豪/win賭神  // invite 推薦
// http://192.168.88.217:9000/core/ranks?type=balance
const getbalanceData = async () => {
  const { data } = await leaderBoardApi(
    mode.value,
    getNormalUser() ? JSON.parse(getNormalUser()).user_id : ""
  );
  personalData.value = data.data.caller_rank;
  // personalData.value = {
  //   top_n: 1,
  //   player_id: 10485,
  //   nickname: "公海賭王陳金城",
  //   socre: 658332510,
  // };
  boardData.value = data.data.rank;
  console.log(boardData.value);
};
const changeBoard = (e) => {
  if (e == 123) {
    return;
  }
  mode.value = e;

  getbalanceData();
};

onMounted(() => {
  // changeBoard("balance");
  console.log(getPlayerId());
  getbalanceData();
  // if (getPlayerId()) {
  //   getbalanceData();
  // }
});
</script>

<style lang="scss">
.leaderBoard {
  width: 100%;
  height: 100%;

  position: relative;
  .btnGroup {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      padding: 0.5rem 0rem;
      width: 100%;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      color: white;
      display: inline-block;
      word-break: keep-all;
      text-align: center;
      font-size: 1.2rem;
    }

    .L1 {
      // background-image: url("@/assets/images/leaderBoard/topBtn/paging_L_1.png");
      background: rgb(20, 117, 225);
      border-radius: 10px 0 0 10px;
    }
    .L2 {
      background: #0d1b38;
      border-radius: 10px 0 0 10px;
    }
    .M1 {
      background-image: url("@/assets/images/leaderBoard/topBtn/paging_M_1.png");
    }
    .M2 {
      background-image: url("@/assets/images/leaderBoard/topBtn/paging_M_2.png");
    }
    .R1 {
      // background-image: url("@/assets/images/leaderBoard/topBtn/paging_R_1.png");
      background: rgb(20, 117, 225);
      border-radius: 0 10px 10px 0;
    }
    .R2 {
      // background-image: url("@/assets/images/leaderBoard/topBtn/paging_R_2.png");
      background: #0d1b38;
      border-radius: 0 10px 10px 0;
    }
  }
  .rankContentbottom {
    // display: none;
    width: calc(100%);
    max-width: 470px;
    height: 70px;
    padding: 0.5rem 1.5rem 0.5rem 0;
    position: fixed;
    bottom: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: #2d4c76;
    color: #5eeeff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .first {
      width: 65%;
      height: 100%;
      display: flex;
      align-items: center;
      .rank {
        width: 25%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 100%;
          object-fit: contain;
        }
      }
      .rankWord {
        margin: 0 1rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        // background: blue;
      }
    }
  }
  .rankContent {
    margin: 0.25rem;
    width: calc(100% - 1rem);
    padding: 0.5rem 0.5rem 0.5rem 0;
    height: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-size: 100% 100%;
    background-position: center;
    // color: black;
    border-radius: 0.5rem;
    border: 1px solid #2d4c76;
    // word-break: break-all;
    // background-image: url("@/assets/images/leaderBoard/rankingBox/box.png");
    .first {
      width: 65%;
      height: 100%;
      display: flex;
      align-items: center;
      .rank {
        width: 25%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 100%;
          object-fit: contain;
        }
        span {
          // color: #2d4c76;
          font-size: 1rem;
        }
      }
      > span {
        width: 75%;
      }
      .rankWord {
        margin: 0 1rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        // background: blue;
      }
    }
  }
  .rankContent1,
  .rankContent2,
  .rankContent3 {
    border: none;
    background-image: url("@/assets/images/leaderBoard/rankingBox/box.png");
    border-radius: 0px;
    color: black;
  }
}
</style>
