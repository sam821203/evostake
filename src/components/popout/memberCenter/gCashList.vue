<template>
  <ModalLayout>
    <template #title>
      <p class="title">{{ $t("stored.selectGCash") }}</p>
    </template>
    <template #default>
      <div class="list-wrap">
        <div
          class="item"
          v-for="(item, index) in pixList"
          :key="index"
          @click="
            handleGCashSelect(item.taxid, item.phone, item.pixtype, item.pixkey)
          "
        >
          <span>{{ item.pixtype }}</span>
          <span v-slicePixKey:[16]="item.pixkey"></span>
        </div>
      </div>
      <div class="btn" @click="addPIX">
        <span class="icon">＋</span><span>{{ $t("stored.addGCash") }}</span>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import ModalLayout from "@/components/modal/layout";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useModal } from "@/store/modalStore";
import { getGCashApi } from "@/api/deposit";
import { useDeposit } from "@/store/depositStore";

const depositStore = useDeposit();
const modalStore = useModal();
const { toggleModal } = modalStore;
const router = useRouter();
const pixList = ref([]);
const addPIX = () => {
  toggleModal(false);
  router.push("/deposit/addPIX");
};

const getGCash = async () => {
  try {
    const res = await getGCashApi();
    if (res.data.code === 0) {
      pixList.value = res.data.data?.bank_account?.brapay_addresses;
      console.log(pixList.value);
    }
  } catch (error) {
    console.log(error);
  }
};
getGCash();

const handleGCashSelect = (taxid, phone, pixtype, pixkey) => {
  depositStore.$patch({
    taxId: taxid,
    phone: phone,
    type: pixtype,
    pixKey: pixkey,
  });
  toggleModal(false);
};
</script>

<style lang="scss" scoped>
.list-wrap {
  margin-top: 5%;
  border: 1px solid gray;
  border-radius: 5px;
  color: rgb(49, 79, 118);
  max-height: 75%;
  overflow-y: scroll;
  background-color: rgb(216, 223, 248);
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
    width: 96%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 5%;
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
  }
}
.btn {
  color: #fff;
  background: rgb(230, 127, 43);
  width: 100%;
  margin: 0 auto;
  padding: 5%;
  margin-top: 5%;
  border-radius: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .icon {
    color: rgb(230, 127, 43);
    background: white;
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
  }
}
</style>
