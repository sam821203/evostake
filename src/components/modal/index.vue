<template>
  <div>
    <component :is="dyComp"></component>
    <!-- <Declare v-if="curModal === 'Declare'" /> -->
  </div>
</template>

<script setup>
import Email from "@/components/popout/memberCenter/email.vue";
import GCashList from "@/components/popout/memberCenter/gCashList";
import AnnouncementDetail from "@/components/popout/announcementDetail";
import FriendQRcode from "@/components/popout/friendQRcode";
import UpgradeAccount from "@/components/popout/upgradeAccount";
import depositPopout from "@/components/popout/depositPopout";
import { onBeforeUnmount, computed } from "vue";
import { storeToRefs } from "pinia";
import { useModal } from "@/store/modalStore";
import AnnouncementBrief from "@/components/popout/announcementBrief";
const modalStore = useModal();
const { curModal } = storeToRefs(modalStore);
const modal = {
  Email,
  AnnouncementDetail,
  FriendQRcode,
  GCashList,
  AnnouncementBrief,
  UpgradeAccount,
  depositPopout,
};
onBeforeUnmount(() => {
  modalStore.$reset();
});
const dyComp = computed(() => modal[curModal.value]);
</script>
