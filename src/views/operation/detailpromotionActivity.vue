<template>
  <div class="detailpromotionActivity">
    <img :src="AnouceMentimgg(data.picture_id)" alt="picture_id" />
    <p>
      {{ $t("activityList.promotionTime") }}:
      {{ new Date(data.start_time).toLocaleDateString("pt-BR") }}
      ~
      {{ new Date(data.end_time).toLocaleDateString("pt-BR") }}
    </p>
    <div v-html="data.data" class="content"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getPlayerId } from "@/utils/cookie";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { readAnnouncementApi } from "@/api/announcement";
const { useAnnouncement } = useStore();
const { getAnnouncementData } = useAnnouncement();
const { eventData } = storeToRefs(useAnnouncement());
const route = useRoute();
const router = useRouter();
const data = ref({ picture_id: "", start_time: "", end_time: "", data: "" });
const AnouceMentimgg = (pid) => {
  var url = process.env.VUE_APP_GETEVENTIMG;
  if (pid == "") {
    return;
  } else {
    return url + pid;
  }
};

onMounted(async () => {
  if (eventData.value.length == 0) {
    router.push("/activity/activityList");
  } else {
    data.value = eventData.value[route.query.key];
  }
  if (getPlayerId()) await readAnnouncementApi(data.value.id);
  getAnnouncementData();
  if (eventData.value[route.query.key] == undefined) {
    router.push("/activity/activityList");
  }
  document.querySelectorAll("div[dir]").forEach((item) => {
    item.style.overflow = "scroll";
  });
  // console.log(document.querySelectorAll("div[dir]"));
});
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.detailpromotionActivity {
  width: 100%;
  height: 100%; //要設高度
  // overflow: scroll;
  // overflow: auto;
  // background: blue;
  // border: 1px solid black;
  // position: fixed;
  // z-index: 100;
  top: 0;
  left: 0;
  padding: 0 12px;
  p {
    font-size: 0.9rem;
    color: white;
    padding-top: 5px;
  }
  img {
    padding-top: 20px;
    width: 100%;
    object-fit: contain;
  }
  .content {
    margin-top: 0.5rem;
    width: 100%;
    word-break: break-word;
  }
}
</style>
