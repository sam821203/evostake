<template>
  <div class="promotion" ref="promo">
    <div
      v-for="(v, k) in eventData"
      :key="k"
      class="detail"
      @click="detailPromotion(k)"
    >
      <img :src="AnouceMentimgg(v.picture_id)" class="picture_id" />
      <!-- http://192.168.88.217/picture/announcement/0798952a6d694ff5a959da9bd5e8513a -->
      <!-- http://192.168.88.217/picture/announcement/22dbf61d2c8e48c8b2da13268564b5f7 -->
      <!-- <img :src=`http://192.168.88.217/picture/announcement/${k}` alt="" srcset="" /> -->

      <!-- v-if="!readedData.includes(String(item.id)) && getPlayerId()" -->
      <div class="title">
        <span>{{ v.title }}</span>
        <img
          src="@/assets/images/new.png"
          alt="new"
          class="new"
          v-if="!readedData.includes(String(v.id)) && getPlayerId()"
        />
      </div>
      <div class="time">
        {{ $t("activityList.promotionTime") }}:
        {{ new Date(v.start_time).toLocaleDateString("en-GB") }}
        ~
        {{ new Date(v.end_time).toLocaleDateString("en-GB") }}
      </div>
    </div>

    <img
      src="@/assets/images/activityList/up_button.png"
      class="topbtn"
      @click="scrolltoTop"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
// import { getAnoucementImg } from "@/api/announcement"; //getAnoucementImg
import { useRouter } from "vue-router";
import { useStore } from "@/store/index";
import { getPlayerId } from "@/utils/cookie";
import { storeToRefs } from "pinia";

const { useAnnouncement } = useStore();
const { setPromotionScrollTop } = useAnnouncement();
const { eventData, readedData, promotionScrollTop } = storeToRefs(
  useAnnouncement()
);
const router = useRouter();
const AnouceMentimgg = (pid) => {
  var url = process.env.VUE_APP_GETEVENTIMG;
  return url + pid;
};
const scrolltoTop = function () {
  promo.value.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

const promo = ref(null);
const detailPromotion = function (k) {
  setPromotionScrollTop(promo.value.scrollTop);
  router.push(`/activity/detailpromotionActivity?key=${k}`);
};

const setActivityData = async () => {
  for (let i = 0; i < eventData.value.length; i++) {
    // const el = eventData.value[i];
    return;
  }
};

const promotionHeight = ref("");
const adjustHeight = async () => {
  promotionHeight.value = `calc(${window.innerHeight}px - 13.5rem)`;
};
watch(eventData, () => {
  if (getPlayerId() != undefined) {
    setActivityData();
  }
});
onMounted(async () => {
  // console.log(getPlayerId());
  await adjustHeight();
  window.addEventListener("resize", () => {
    adjustHeight();
  });
  // setTimeout(() => {
  // console.log(router.options.history.state.);
  await promo.value.scrollTo({
    top: promotionScrollTop.value,
    left: 0,
    behavior: "auto",
  });
  // }, 10);
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.promotion {
  width: 100%;
  height: v-bind(promotionHeight);
  overflow: auto;
  position: relative;
  margin-top: 20px;
  padding: 0 1rem;
  div {
    // width: calc(100% - 2rem);
    // text-align: center;
    .picture_id {
      width: 100%;
      object-fit: contain;
    }
    .new {
      float: right;
      height: 1rem;
    }
    .title {
      font-size: 1.2rem;
      // color: black;
      // word-break: break-all;
      font-weight: bolder;
    }
    .time {
      font-size: 1rem;
      color: gray;
    }
  }
  .topbtn {
    position: sticky;
    width: 10%;
    object-fit: contain;
    bottom: 10%;
    left: 85%;
    display: inline-block;
    // background: gray;
  }
  .detail {
    margin-bottom: 20px;
  }
}
</style>
