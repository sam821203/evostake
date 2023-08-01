<template>
  <div class="add-GCash">
    <div class="item">
      <span class="title">TAX ID</span>
      <input type="text" :placeholder="$t('請輸入TAXID')" v-model="taxId" />
    </div>
    <div class="item">
      <span class="title">{{ $t("手機號碼") }}</span>
      <input
        :placeholder="$t('請輸入手機號碼')"
        v-model="phone"
        inputmode="numeric"
        @keyup.enter="confirm"
      />
    </div>
    <div class="item">
      <span class="title">PIX Type</span>
      <div class="chooseType" @click="showOption = !showOption">
        <p :class="['placeholder', { type: choseType }]">
          {{ !choseType ? $t("請選擇Type") : choseType }}
        </p>
      </div>
      <img
        src="@/assets/images/modal/list_open1.png"
        :class="['notOpen', { open: showOption }]"
      />

      <div class="typeOptions" v-show="showOption">
        <ul v-for="(option, index) in pxTypeOptions" :key="index">
          <li class="option" @click="chooseType(option.option, option.abbr)">
            {{ option.option }}
          </li>
        </ul>
      </div>
    </div>

    <div class="item">
      <span class="title">PIX Key</span>
      <input
        :placeholder="$t('請輸入PIXKey')"
        v-model="pixKey"
        inputmode="numeric"
        @keyup.enter="confirm"
      />
    </div>

    <button
      :class="[
        'confirm',
        {
          disabled:
            taxId === null ||
            phone === null ||
            type === null ||
            pixKey === null,
        },
      ]"
      @click="confirm"
      :disabled="
        taxId === null || phone === null || type === null || pixKey === null
      "
    >
      {{ $t("stored.OK") }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useDeposit } from "@/store/depositStore";
import { useRouter } from "vue-router";
const router = useRouter();
const depositStore = useDeposit();
const taxId = ref(null);
const phone = ref(null);
const choseType = ref(null);
const type = ref(null);
const pixKey = ref(null);
const showOption = ref(false);
const pxTypeOptions = reactive([
  { option: "CPF：Cadastro de Pessoas Físicas", abbr: "CPF" },
  { option: "CNPJ：Cadastro Nacional da Pessoa Jurídica", abbr: "CNPJ" },
  { option: "EMAIL：Endereço de e-mail", abbr: "EMAIL" },
  { option: "PHONE：Número de telefone", abbr: "PHONE" },
  { option: "EVP：Chave aleatória", abbr: "EVP" },
]);

const chooseType = (option, abbr) => {
  choseType.value = option;
  type.value = abbr;
  showOption.value = !showOption.value;
};

const confirm = () => {
  depositStore.$patch({
    taxId: taxId.value,
    phone: phone.value,
    type: type.value,
    pixKey: pixKey.value,
  });
  router.push("/deposit/withdraw");
};
</script>

<style lang="scss" scoped>
.add-GCash {
  padding: 5%;
  .item {
    width: 98%;
    margin: 3% auto 8%;
    position: relative;
    .title {
      color: #fff;
    }
    .remind {
      font-size: 0.8rem;
      margin-left: 2%;
      color: red;
    }
    input {
      width: 100%;
      border: 1px solid #f7e4ff;
      border-radius: 5px;
      height: 3rem;
      line-height: 3rem;
      margin-top: 1%;
      border-radius: 5px;
      &::-webkit-input-placeholder {
        color: lightgray;
      }
    }
    .chooseType {
      width: 100%;
      border: 1px solid #f7e4ff;
      border-radius: 5px;
      height: 3rem;
      line-height: 3rem;
      margin-top: 1%;
      border-radius: 5px;
      overflow: auto;
      background: #fff;
      .placeholder {
        color: lightgray;
      }
      .type {
        color: #000;
      }
    }
    .notOpen {
      position: absolute;
      top: 60%;
      width: 6%;
      right: 3%;
      &.open {
        position: absolute;
        top: 20%;
        transform: translateY(-50%) scaleY(-1);
      }
    }
    .typeOptions {
      border: 1px solid;
      border-radius: 10px;
      ul {
        li {
          padding: 2%;
        }
      }
    }
  }
  .confirm {
    width: 100%;
    margin: 0 auto;
    background-color: #8c17c2;
    color: #fff;
    text-align: center;
    padding: 3%;
    border-radius: 10px;
  }
  .disabled {
    background-color: lightgray;
  }
}
</style>
