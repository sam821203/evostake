<template>
  <div class="add-GCash">
    <div class="item">
      <p class="title">{{ $t("stored.name") }}</p>
      <input type="text" v-model="name" maxlength="60" />
    </div>
    <div class="item">
      <p class="title">{{ $t("stored.phone") }}</p>
      <p>{{ phone }}</p>
    </div>
    <button class="confirm" @click="throttleSave">
      {{ $t("stored.OK") }}
    </button>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import throttle from "@/utils/throttle";
import { addGCashApi } from "@/api/deposit";
import {
  getEditName,
  getEditNum,
  removeEditName,
  removeEditNum,
} from "@/utils/cookie";

import { useRouter } from "vue-router";
const router = useRouter();
const phone = ref(getEditNum("edit_phone"));
const name = ref(getEditName("edit_name"));
console.log(phone.value);
const handleWithdraw = async () => {
  const addGCashRes = await addGCashApi(phone.value, {
    name: name.value,
  });
  console.log(addGCashRes);
  if (addGCashRes.data.code === 0) {
    removeEditName();
    removeEditNum();
    router.push("/deposit/gCashSetting");
  }
};

onBeforeUnmount(() => {
  removeEditName();
  removeEditNum();
});

const throttleSave = throttle(handleWithdraw, 1500);
</script>

<style lang="scss" scoped>
.add-GCash {
  padding: 5%;
  .item {
    width: 98%;
    margin: 3% auto 8%;
    .title {
      color: #000;
    }
    .remind {
      font-size: 0.8rem;
      margin-left: 2%;
      color: red;
    }
    input {
      width: 100%;
      border: 1px solid gray;
      border-radius: 5px;
      height: 3rem;
      line-height: 3rem;
      margin-top: 1%;
      border-radius: 5px;
      &::-webkit-input-placeholder {
        color: lightgray;
      }
    }
    p {
      margin-bottom: 2%;
    }
  }
  .confirm {
    width: 100%;
    margin: 0 auto;
    color: #fff;
    text-align: center;
    padding: 3%;
    border-radius: 10px;
    background-color: rgb(230, 127, 43);
  }
  .disabled {
    background-color: lightgray;
  }
}
</style>
