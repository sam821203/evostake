<template>
  <div class="popout_page">
    <div class="bg" @click="clickBg"></div>
    <div class="close" @click="closePopoutFunc" v-if="closeBtn" />
    <div class="page">
      <div class="content">
        <!-- style="word-break: break-all" -->
        <!-- <TagGroup v-if="tags.length > 1" /> -->
        <!-- <img
          src="@/assets/images/modal/back.png"
          class="backBtn"
          v-show="goHomePage"
          @click="goBack"
        /> -->
        <slot name="title" />
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useModal } from "@/store/modalStore";
const modalStore = useModal();
const { closeBtn } = storeToRefs(modalStore);
const { toggleModal } = modalStore;
// const { childView } = storeToRefs(modalStore);
// const modalType = {
//   longContent: require("@/assets/images/modal/pop_box4.png"),
// };
// const { styleType } = storeToRefs(modalStore);
// const curStyle = computed(() => modalType[styleType.value]);
const clickBg = () => {
  // toggleModal(false);
  return;
};
const closePopoutFunc = () => {
  toggleModal(false);
};
</script>
