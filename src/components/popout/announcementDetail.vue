<template>
  <ModalLayout>
    <template #title>
      <p class="title">{{ normalDetailData.title }}</p>
    </template>
    <template #default>
      <p v-html="normalDetailData.data" class="detailcontent"></p>
    </template>
  </ModalLayout>
</template>

<script setup>
import { onMounted } from "vue";
import ModalLayout from "@/components/modal/layout.vue";
import { useAnnouncement } from "@/store/announcementStore";
import { storeToRefs } from "pinia";

const announcementStore = useAnnouncement();
const { normalDetailData } = storeToRefs(announcementStore);

onMounted(() => {
  document.querySelectorAll("div[dir]").forEach((item) => {
    item.style.overflow = "scroll";
  });
});
</script>
<style scoped>
.detailcontent {
  color: black;
}
</style>
