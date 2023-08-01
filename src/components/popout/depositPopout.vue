<template>
  <ModalLayout>
    <template #default>
      <p>
        Seu depósito anterior ainda não foi concluído, por favor, conclua-o
        primeiro.
      </p>
      <div class="btnWrap">
        <button class="gcash" @click="getOrderPath">
          Ir para o aplicativo PIX
        </button>
        <button class="return" @click="goBack">Retornar</button>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref } from "vue";
import ModalLayout from "@/components/modal/layout";
import { useRouter } from "vue-router";
import { getOrderApi } from "@/api/deposit";
import { useDeposit } from "@/store/depositStore";
import { storeToRefs } from "pinia";
import { useModal } from "@/store/modalStore";
const router = useRouter();
const depositStore = useDeposit();
const { orderNum } = storeToRefs(depositStore);
const chargeUrl = ref("");
const modalStore = useModal();
const { toggleModal } = modalStore;

const getOrderPath = async () => {
  const res = await getOrderApi(orderNum.value);
  console.log(res);
  if (res.data.code === 0) {
    chargeUrl.value = res.data.data.order.content.charge_url;
    window.open(chargeUrl.value);
  }
};

const goBack = () => {
  toggleModal(false);
  router.go(-1);
};
</script>

<style lang="scss" scoped>
:deep(.close) {
  display: none;
}
:deep(.page) {
  height: 50% !important;
}
p {
  color: black;
  word-break: break-word;
  font-size: 1.2rem;
  text-align: left;
  padding: 0 5% 0 5%;
  margin-bottom: 20%;
}
.btnWrap {
  display: flex;
  flex-direction: column;
  // margin-top: 20%;
  height: 40%;
  justify-content: space-between;
  align-items: center;
  .gcash {
    background-color: rgb(230, 127, 43);
    color: #fff;
    height: 3.5rem;
    border-radius: 20px;
    width: 90%;
  }
  .return {
    background-color: rgb(28, 138, 30);
    color: #fff;
    height: 3.5rem;
    border-radius: 20px;
    width: 40%;
  }
}
</style>
