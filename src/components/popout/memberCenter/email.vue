<template>
  <ModalLayout>
    <template #title>
      <p class="title">{{ $t("email.email") }}</p>
    </template>
    <template #default>
      <!-- <div class="deleteGroup">
        <img
          src="@/assets/images/modal/remind_box.png"
          alt=""
          @click="isSelectAll"
          v-show="selectAll === false"
          class="checkbox"
        />
        <img
          src="@/assets/images/modal/remind_tick.png"
          alt=""
          @click="cancelSelectAll"
          v-show="selectAll === true"
          class="checkbox"
        />
        <span>全選</span>
        <img
          src="@/assets/images/modal/trash_can.png"
          alt=""
          :class="['trashCan', { trashCanDisable: !selectList.length }]"
          @click="deleteMails(selectList)"
        />
      </div> -->
      <ul>
        <li
          v-for="(mail, index) in allMailData"
          :key="mail.id"
          @click="readMail(index, mail.id, mail.is_read)"
        >
          <div class="mail-wrap">
            <!-- <img
              src="@/assets/images/modal/remind_box.png"
              alt=""
              @click.stop="selectMail(index, mail.id)"
              v-show="!selectList.includes(mail.id)"
              class="checkbox"
            />
            <img
              src="@/assets/images/modal/remind_tick.png"
              alt=""
              @click.stop="cancelSelectMail(index, mail.id)"
              v-show="selectList.includes(mail.id)"
              class="checkbox selected"
            /> -->
            <div :class="['mail-item', { openTitle: showContent === index }]">
              <p class="mail-title">{{ $t(mail.title) }}</p>
              <p v-time="mail.send_at" class="mail-date"></p>
            </div>

            <div class="icon-wrap">
              <img
                v-show="mail.is_read === false"
                class="bell"
                src="@/assets/images/new.png"
                alt="new"
              />
              <img
                src="@/assets/images/modal/list_open2.png"
                alt=""
                class="opened"
                v-if="showContent === index"
              />
              <img
                src="@/assets/images/modal/list_open1.png"
                alt=""
                class="notOpen"
                v-else
              />
            </div>
          </div>

          <div class="content" :id="mail.id" v-show="showContent === index">
            <p class="mail-content">
              {{ $t(mail.content) }}
            </p>
          </div>
        </li>
      </ul>

      <div class="pagination">
        <div class="pre-button" @click="previousPage">
          <span>{{ $t("email.pre") }}</span>
        </div>
        <div class="pageNum">
          <p class="current-page">
            {{ totalPage === currentPage ? totalPage : currentPage }}
          </p>
          <p class="divider">/</p>
          <p class="total-page">{{ totalPage }}</p>
        </div>

        <div class="next-button" @click="nextPage">
          <span>{{ $t("email.next") }}</span>
        </div>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import ModalLayout from "@/components/modal/layout";
import { ref } from "vue";
import { mailApi, readMailApi } from "@/api/mail";
// import moment from "moment";
// import { useMessage } from "@/store/msgStore";
import { useMail } from "@/store/mailStore";
const mailStore = useMail();
const { getMailNotification } = mailStore;
// const msg = useMessage();
// const { openMsg } = msg;
const showContent = ref(-1);
const allMailData = ref();
const currentPage = ref("1");
const totalPage = ref("");
const currentIdList = ref([]);
const selectList = ref([]);
const selectAll = ref(false);

// 取得當前頁面所有信件
const getAllMail = async () => {
  const { data } = await mailApi(currentPage.value, 10);
  if (data.data.total_page >= 1) {
    totalPage.value = data.data.total_page;
  } else {
    totalPage.value = 1;
  }

  if (data.code === 0) {
    allMailData.value = data.data.mails;
    currentIdList.value = allMailData.value?.map((mail) => mail.id);

    // allMailData.value = data.data.mails
    // currentIdList.value = allMailData.value.map((mail) => mail.id)
  }
};
getAllMail();

// 信件已讀
const readMail = async (index, id) => {
  if (showContent.value === index) {
    showContent.value = -1;
  } else {
    showContent.value = index;
    await readMailApi(id, { is_read: "true" });
    allMailData.value[index].is_read = true;
    getMailNotification();
  }
};

// // 勾選信件
// const selectMail = (index, id) => {
//   selectList.value.push(id);
// };

// // 取消勾選
// const cancelSelectMail = (index, id) => {
//   selectAll.value = false;
//   selectList.value.splice(selectList.value.indexOf(id), 1);
// };

// // // 全選
// const isSelectAll = () => {
//   selectAll.value = true;
//   selectList.value = [...currentIdList.value];
// };

// // 取消全選
// const cancelSelectAll = () => {
//   selectAll.value = false;
//   selectList.value = [];
// };

// 切換分頁
const nextPage = () => {
  if (currentPage.value < totalPage.value) {
    currentPage.value++;
    selectList.value = [];
    getAllMail();
    selectAll.value = false;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    selectList.value = [];
    getAllMail();
    selectAll.value = false;
  }
};

// // 刪除信件
// const deleteMails = (mailId) => {
//   if (selectList.value.length) {
//     openMsg({
//       content: "openMsg.deleteConfirm",
//       hasBtn: true,
//       hasCancel: true,
//     }).then(async () => {
//       const { data } = await deleteMailApi(JSON.stringify({ id: mailId }));
//       if (data.code === 0) {
//         await getAllMail();
//         await getMailNotification();
//         selectList.value = [];
//         selectAll.value = false;
//         showContent.value = -1;
//         if (
//           currentPage.value >= totalPage.value &&
//           currentPage.value > 1 &&
//           !currentIdList.value
//         ) {
//           currentPage.value--;
//           getAllMail();
//         }
//       }
//     });
//   }
//   getAllMail();
// };

// const formatTime = (data) => {
//   return moment(data).tz("Asia/Taipei").format("YYYY/MM/DD HH:mm:ss");
// };
</script>

<style lang="scss" scoped>
// .checkbox {
//   width: 10%;
//   height: 10%;
//   margin-right: 4%;
// }
// .deleteGroup {
//   display: flex;
//   align-items: center;
//   span {
//     font-size: 1.2rem;
//     font-weight: bold;
//     color: rgb(60, 255, 220);
//   }
//   .trashCan {
//     margin-left: 8%;
//     width: 10%;
//     object-fit: contain;
//   }
//   .trashCanDisable {
//     filter: grayscale(1);
//   }
// }
.title {
  color: $title;
}
ul {
  margin: 3% 0;
  height: 80%;
  overflow: scroll;
  color: $primary;
  li {
    width: 100%;
    height: auto;
    border-bottom: 1px solid rgb(33, 56, 66);
    margin-bottom: 5%;

    padding-bottom: 5%;
    .mail-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      align-items: center;
      .icon-wrap {
        width: 30%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .bell {
          width: 50%;
          margin-right: 5%;
          &::before {
            content: "NEW";
            position: absolute;
            z-index: -1;
            -webkit-text-stroke: 3px red;
          }
        }
        .opened {
          width: 25%;
          height: 25%;
        }
        .notOpen {
          width: 25%;
          height: 25%;
          transform: rotate(-90deg);
        }
      }

      .mail-item {
        color: $title;
        padding-left: 4%;

        .mail-title {
          color: rgb(41, 73, 87);
          margin: 2% 0;
          padding-bottom: 2%;
          font-size: 1.1rem;
          flex: 1;
        }
        .mail-date {
          color: #b0b0b0;
          font-size: 0.9rem;
        }
      }
      .openTitle {
        color: $title;
      }
    }
    .mail-content {
      padding: 4% 0 0 4%;
      font-size: 1rem;
      margin: 0 auto;
      line-height: 1.2rem;
      color: #000;
    }
  }
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: sticky;
  bottom: 0;
  margin-top: 10%;
  img {
    width: 6%;
  }
  .pre-button,
  .next-button {
    background-size: 100% 100%;
    width: 40%;
    height: 2rem;
    line-height: 2rem;
    border-radius: 20px;
    color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 50px;
    display: flex;
    align-items: center;
    font-weight: 600;
  }
  .pre-button {
    background-image: url("@/assets/images/modal/vip_button_L.png");
    span {
      display: inline-block;
      padding-left: 35%;
      font-size: 0.8rem;
    }
  }
  .next-button {
    background-image: url("@/assets/images/modal/vip_button_R.png");
    justify-content: flex-end;
    span {
      display: inline-block;
      padding-right: 40%;
      font-size: 0.8rem;
    }
  }
  .pageNum {
    width: 15%;
    display: flex;
    justify-content: space-between;
    color: #000;
    .current-page {
      margin-right: -18%;
    }
    .total-page {
      margin-left: -18%;
    }
  }
}
</style>
