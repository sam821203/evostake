<template>
  <div class="list-wrap" v-if="gCashList">
    <div class="item" v-for="(item, index) in gCashList" :key="index">
      <div class="content-wrap">
        <span>{{ item.name }}</span>
        <span>{{ item.address }}</span>
      </div>
      <div class="icon-wrap" @click="edit(item.name, item.address)">
        <i class="bi bi-pencil-square"></i>
      </div>
    </div>
  </div>
  <div class="noData" v-else>{{ $t("stored.noData") }}</div>
</template>

<script setup>
import { getGCashApi } from "@/api/deposit";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setEditName, setEditNum } from "@/utils/cookie";
const router = useRouter();
const gCashList = ref([]);

const getGCash = async () => {
  const res = await getGCashApi();
  gCashList.value = res.data.data?.bank_account?.gcash_addresses;
  console.log(gCashList.value);
};
getGCash();

const edit = (name, address) => {
  setEditName(name);
  setEditNum(address);
  router.push("/deposit/editGCash");
  console.log(name, address);
};
</script>

<style lang="scss" scoped>
.list-wrap {
  margin: 20% 5% 0;
  border: 1px solid gray;
  border-radius: 5px;
  color: rgb(49, 79, 118);
  max-height: 80%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(31, 120, 224);
    border-radius: 20px;
  }
  &::-webkit-scrollbar-button {
    background: transparent;
  }
  .item {
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid rgb(147, 162, 189);
    &:last-child {
      border: none;
    }
    span {
      display: inline-block;
    }
    &:active {
      background-color: #fff;
    }
    .content-wrap {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-left: 10%;
    }
    .icon-wrap {
      width: 15%;
      text-align: center;
    }
  }
}
.noData {
  font-size: 1.5rem;
  text-align: center;
  line-height: 3.5;
}
</style>
