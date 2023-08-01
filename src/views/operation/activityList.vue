<template>
  <div class="activityList">
    <div class="all">
      <div
        :class="[activitySelected == 'promotion' ? 'selectedL' : '']"
        @click="changeAct('promotion')"
      >
        {{ $t("activityList.promotion") }}
      </div>
      <div
        :class="[activitySelected == 'getRecord' ? 'selectedR' : '']"
        @click="changeAct('getRecord')"
      >
        {{ $t("activityList.participation") }}
      </div>
    </div>
    <div class="detail">
      <promotion v-if="activitySelected == 'promotion'" />
      <getRecord v-if="activitySelected == 'getRecord'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import promotion from "@/components/activityList/promotion.vue";
import getRecord from "@/components/activityList/getRecord.vue";
import { getPlayerId } from "@/utils/cookie";
import { useStore } from "@/store/index";
import { usectrlLogin } from "@/store/ctrlLogin";

const route = useRoute();
const router = useRouter();

const activitySelected = ref("promotion");
if (route.query?.selected) {
  activitySelected.value = "getRecord";
}

const { useMessage } = useStore();
const { openMsg } = useMessage();

const changeAct = (e) => {
  switch (e) {
    case "promotion":
      break;
    case "getRecord":
      break;
  }
  if (getPlayerId() == undefined) {
    openMsg({ content: "請先登入 / 註冊" }).then(() => {
      router.push("/home");
      usectrlLogin().$patch({
        loginpageStatus: true,
      });
    });
    return;
  }
  activitySelected.value = e;
};
</script>

<style lang="scss" scoped>
.activityList {
  width: 100%;
  height: calc(100%);
  // background-color: antiquewhite;
  display: flex;
  flex-direction: column;
  .all {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;

    div {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      width: 45%;
      background-size: 100% 100%;
      word-break: keep-all;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    > div:nth-child(1) {
      background-image: url("@/assets/images/activityList/paging_L_1.png");
    }
    > div:nth-child(2) {
      background-image: url("@/assets/images/activityList/paging_R_1.png");
    }
    .selectedL {
      background-image: url("@/assets/images/activityList/paging_L_2.png") !important;
    }
    .selectedR {
      background-image: url("@/assets/images/activityList/paging_R_2.png") !important;
    }
  }
  .detail {
    height: calc(100% - 2.8rem);
    // background: blue;
  }
}
</style>
