<template>
  <div class="friendsView">
    <div class="search">
      <div class="select" @click="openSelect = !openSelect">
        <ul :class="{ open: openSelect }">
          <li>{{ vip === "all" ? $t("friends.allLevels") : `VIP ${vip}` }}</li>
          <li @click="vip = 'all'" v-if="vip !== 'all'" class="option">
            {{ $t("friends.allLevels") }}
          </li>
          <li
            v-for="(num, index) in 6"
            :key="num"
            @click="vip = index"
            class="option"
          >
            VIP {{ index }}
          </li>
        </ul>
        <img
          src="@/assets/images/modal/list_open1.png"
          :class="{ open: openSelect }"
        />
      </div>
      <div class="input">
        <input
          type="text"
          v-model="account"
          maxlength="3"
          :placeholder="$t('friends.enterAccount')"
        />
        <img src="@/assets/images/modal/search.png" @click="searchFriend" />
      </div>
    </div>
    <div class="content">
      <div class="leftItem">
        <div class="amount">
          <span>Depósito de amigos: </span
          ><span v-price="depositFriends * 10000"></span>
        </div>
      </div>
    </div>
    <table v-if="newfriendsData.length">
      <tr>
        <td class="account">Conta de amigos</td>
        <td>Depósito total</td>
        <td>Apostas válidas</td>
        <td>Reembolso recebido</td>
      </tr>
      <tr v-for="item in newfriendsData" :key="item.account">
        <td class="vip">
          <div class="iconWrap">
            <img
              src="@/assets/images/lobby/vip_icon.png"
              alt="vip"
              class="crown"
            />
            <img
              :src="require(`@/assets/images/lobby/vip_${item.vip}.png`)"
              alt="vip"
              class="word"
            />
          </div>

          <span class="acc">{{ item.account }}</span>
        </td>
        <td v-price="item.history_charge"></td>
        <td v-price="item.flow"></td>
        <td v-price="item.rebate"></td>
      </tr>
    </table>
    <div v-else class="noData">
      <p>{{ $t("friends.noFriend") }}</p>
      <img src="@/assets/images/Cryingface.png" alt="Cryingface" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue-demi";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { getFriendsApi } from "@/api/friends";

const { useAuth } = useStore();

// const modalStore = useModal();
// const { toggleModal, modalType } = modalStore;

const authStore = useAuth();
const { loginData } = storeToRefs(authStore);

// const openQRcode = () => {
//   toggleModal(true);
//   modalType("FriendQRcode", "longContent");
// };

const vip = ref("all");
const openSelect = ref(false);

const friendsData = ref("");
const newfriendsData = ref([]);
const depositFriends = ref(0);
const chargedAry = ref([]);
const sortAry = ref([]);
const getData = async () => {
  const { data } = await getFriendsApi(loginData.value.user_id);
  if (data.code !== 0) return;
  friendsData.value = data.data ?? [];
  friendsData.value.forEach((item) => {
    if (item.history_charge > 0) {
      depositFriends.value++;
    }
  });
  chargedAry.value = friendsData.value //總存款 > 0 的名單
    .filter((item) => item.history_charge > 0)
    .sort((a, b) => b.history_charge - a.history_charge);

  sortAry.value = friendsData.value.filter((item) => item.history_charge === 0);
  function customSort(a, b) {
    // 先判斷a、b哪個名稱以英文字母開頭
    const aStartsWithLetter = isNaN(parseInt(a.account.charAt(0)));
    const bStartsWithLetter = isNaN(parseInt(b.account.charAt(0)));

    // 如果a、b都是以英文字母開頭，或者都不是以英文字母開頭，就直接比較名稱和數字
    if (aStartsWithLetter === bStartsWithLetter) {
      // 先比較名稱，如果名稱相同再比較數字
      if (a.account === b.account) {
        return a.account - b.account;
      } else {
        return a.account.localeCompare(b.account);
      }
    }

    // 如果a是以英文字母開頭，就讓a排在b前面
    if (aStartsWithLetter) {
      return -1;
    }

    // 如果b是以英文字母開頭，就讓b排在a前面
    return 1;
  }
  // 使用sort()方法排序
  sortAry.value.sort(customSort);
  newfriendsData.value = chargedAry.value.concat(sortAry.value);
  console.log(newfriendsData.value);
};
getData();

// 計算上線和離線人數
// const calculatePeople = (type) => {
//   const data = newfriendsData.value.filter(({ online }) =>
//     type === "online" ? online : !online
//   );
//   return data.length;
// };

// VIP 資料
const vipData = () => {
  if (vip.value === "all") return friendsData.value;
  return friendsData.value.filter(({ vip: level }) => level === +vip.value);
};

// 搜尋玩家
const account = ref("");
const searchFriend = () => {
  if (!account.value) {
    newfriendsData.value = vipData();
    return;
  }

  newfriendsData.value = vipData().filter((item) =>
    item.account.match(account.value)
  );
};

// 切換 VIP 等級
watch(vip, () => {
  account.value = "";
  newfriendsData.value = vipData();
});
</script>

<style lang="scss" scoped>
::placeholder {
  color: $text-secondary;
  font-weight: 600;
}

.friendsView {
  // padding: 16px 12px 0;
  .select ul,
  input {
    border: 1px solid $border-primary;
    border-radius: 6px;
    padding: 8px;
    width: 100%;
    height: 100%;
    font-size: 14px;
  }
  .search {
    display: flex;
    width: 95%;
    margin: 2% auto;
    .input {
      position: relative;
      width: 60%;
      img {
        position: absolute;
        right: 6px;
        top: 25%;
        cursor: pointer;
        width: 20px;
      }
    }
    .select {
      width: 40%;
      position: relative;
      margin-right: 16px;
      cursor: pointer;
      ul {
        background: white;
        font-weight: 600;
        position: absolute;
        z-index: 1;
        overflow: hidden;
        color: black;
        font-size: 13px;

        &.open {
          height: auto;
        }
        li {
          margin-bottom: 10px;
          &.option {
            color: gray;
            border-bottom: 1px solid transparent;
            width: fit-content;
            &:hover {
              color: $text-secondary;
              border-bottom: 1px solid $border-primary;
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      img {
        position: absolute;
        z-index: 2;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
        width: 12px;
        &.open {
          transform: translateY(-50%) scaleY(-1);
        }
      }
    }
  }
  .content {
    text-align: center;
    margin: 2%;
    font-weight: 600;
    img {
      cursor: pointer;
      width: 50px;
      margin: 5px 5px 0 0;
    }
  }

  .quantity {
    display: flex;
    color: $text-secondary;
    margin-bottom: 2%;
    span {
      display: flex;
      align-items: center;
      margin-left: 2px;
    }
    .total {
      margin: 0 8px;
    }
    .online {
      margin: 0 24px;
      &::before {
        content: "";
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #00c900;
        margin-right: 4px;
      }
    }
    .offline {
      &::before {
        content: "";
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: gray;
        margin-right: 4px;
      }
    }
  }
  table {
    border-style: none;
    border-collapse: collapse;
    text-align: center;
    // width: 98%;
    margin: 0 2%;
    @include breakpoint-up("lg") {
      margin: 0 auto;
    }

    tr {
      height: 1.5rem;
      color: gray;
      td {
        vertical-align: bottom;
        .crown {
          width: 35px;
        }
        .word {
          width: 30px;
          margin-top: 1px;
        }
        span {
          color: red;
          font-size: 10px;
          padding-top: 13%;
        }
        .acc {
          color: gray;
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 14px;
        }
      }
      .account {
        text-align: center;
      }
      .vip {
        display: flex;
        justify-content: center;
        align-items: center;
        .iconWrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 2px;
          margin-top: 8%;
        }
      }
      &:first-child {
        background-color: #6380a2;
        color: white;
        font-size: 13px;
        font-weight: 600;
        height: 2.5rem;
        td {
          padding: 0;
          vertical-align: middle;
          @include breakpoint-up("lg") {
            width: 20%;
          }
        }
      }
    }
  }
  .noData {
    text-align: center;
    margin-top: 60px;
    color: gray;
    font-weight: 600;
    font-size: 20px;
    img {
      margin-top: 60px;
      width: 100px;
    }
  }
}
</style>
