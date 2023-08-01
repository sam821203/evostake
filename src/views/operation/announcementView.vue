<template>
  <div class="announcement">
    <ul v-if="normalData.length">
      <li
        v-for="item in normalData"
        :key="item.title"
        @click="openAnnouncement(item)"
      >
        <p class="title">
          {{ item.title }}
          <img
            v-if="!readedData.includes(String(item.id)) && getPlayerId()"
            src="@/assets/images/new.png"
            alt="new"
          />
        </p>
        <p v-time="item.start_time" class="time"></p>
      </li>
    </ul>
    <p v-else class="noData">Sem Anúncio</p>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
import { readAnnouncementApi } from "@/api/announcement";
import { getPlayerId } from "@/utils/cookie";

const { useModal, useAnnouncement } = useStore();

const modalStore = useModal();
const { toggleModal, modalType } = modalStore;

const announcementStore = useAnnouncement();
const { setNormalDetailData, getAnnouncementData } = announcementStore;
const { normalData, readedData } = storeToRefs(announcementStore);

// 開啟詳細公告
const openAnnouncement = async (detail) => {
  setNormalDetailData(detail);
  toggleModal(true);
  if (getPlayerId()) await readAnnouncementApi(detail.id);
  modalType("AnnouncementDetail", "longContent");
  getAnnouncementData();
};
</script>

<style lang="scss" scoped>
.announcement {
  width: 100%;
  // word-break: break-all;
  ul {
    margin: 0;
    padding: 12px;
    li {
      border: 2px solid #97a6c3;
      border-radius: 10px;
      margin-bottom: 12px;
      padding: 20px 12px;
      cursor: pointer;
      color: $primary;
      background: #d6e0f9;
      .title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        color: black;
        img {
          width: 35px;
          object-fit: contain;
        }
      }
      .time {
        font-size: 14px;
        color: #3a6b99;
        text-align: end;
      }
    }
  }
  .noData {
    text-align: center;
    padding-top: 20%;
    color: $primary;
  }
}
</style>
