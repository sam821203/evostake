<template>
  <div class="content">
    <h3 class="subtitle">{{ $t("friendQrcode.title") }}</h3>
    <div>
      <div class="QRcode">
        <QrcodeVue :value="link" :size="150" />
      </div>
    </div>
    <p class="link">{{ link }}</p>
    <div class="copy" @click="copy">
      <img src="@/assets/images/modal/copy_button.png" alt="copy" />
      <p>{{ $t("friendQrcode.copy") }}</p>
    </div>
    <p>Regras da atividade:</p>
    <p>
      1. Forneça o código QR ou URL de registro para seus amigos digitalizarem.
      Quando seu amigo se registrar com sucesso, você se tornará o primeiro
      nível de seu amigo. Sempre que seu amigo cumprir as condições, você poderá
      obter o bônus correspondente.
    </p>
    <p>
      2. Se seus amigos convidarem outras pessoas para se registrarem, então os
      amigos dos seus amigos se tornarão seus jogadores de nível 2, e assim por
      diante.
    </p>
    <p>3. Os bônus que podem ser obtidos são os seguintes:</p>
    <table border="1">
      <tr>
        <td class="tableTitle">Nível de convite</td>
        <td class="tableTitle">Comissão de Apostas Válidas dos seus amigos</td>
      </tr>
      <tr>
        <td>Level 1</td>
        <td>0.5%</td>
      </tr>
      <tr>
        <td>Level 2</td>
        <td>0.25%</td>
      </tr>
      <tr>
        <td>Level 3</td>
        <td>0.1%</td>
      </tr>
      <tr>
        <td>Level 4</td>
        <td>0.05%</td>
      </tr>
      <tr>
        <td>Level 5</td>
        <td>0.02%</td>
      </tr>
    </table>
    <p>
      4. Reembolso é resgatável sem quaisquer restrições, mas se houver outros
      requisitos de apostas, é necessário cumprir esses requisitos antes de
      resgatar.
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue-demi";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import QrcodeVue from "qrcode.vue";
import useClipboard from "vue-clipboard3";

const { useAuth } = useStore();
const authStore = useAuth();
const { loginData, userInfo } = storeToRefs(authStore);
const { toClipboard } = useClipboard();

const agentName = userInfo.value.agent_name;
const api = process.env.VUE_APP_LOBBYAPI;

const link = ref("");
const dev = `http://192.168.88.212/lobby-brazil/?agent=${agentName}`;
const uat = `https://${agentName}.evostake00.com/lobby`;
const prod = `https://${agentName}.evostake.com/lobby`;
const url = api.includes("192") ? dev : api.includes("evostake00") ? uat : prod;
console.log(url);
link.value = `${url}#/home/${loginData.value.user_uuid}`;

const copy = () => {
  toClipboard(link.value);
};
</script>

<style lang="scss" scoped>
:deep(.page) {
  padding: 10px 15px 0px 15px !important;
}
.title {
  color: orange;
}

.subtitle {
  color: #fff;
  font-size: 14px;
  // margin-bottom: 16px;
}

.QRcode {
  border: 5px solid gray;
  border-radius: 20px;
  width: fit-content;
  margin: 0 auto;
  padding: 8px;
}

.content {
  text-align: center;
  width: 95%;
  margin: 0 auto;
  // padding-top: 30px;
}

button {
  border: 2px solid $primary;
  background: white;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.copy {
  position: relative;
  width: 120px;
  margin: 0 auto;
  img {
    width: 80%;
  }
  p {
    position: absolute;
    color: white;
    top: 45%;
    left: 55%;
    transform: translate(-50%, -50%);
    font-size: 14px;
  }
}

.link {
  margin: 5px 0 5px;
  width: 100%;
  color: white;
  text-align: center;
  // word-break: break-all;
}

.hideTextarea {
  opacity: 0;
  position: absolute;
  bottom: 0;
}
p {
  color: #fff;
  text-align: start;
  font-size: 10px;
  word-break: break-word;
  margin-bottom: 2%;
}
table {
  color: #fff;
  font-size: 10px;
  border-collapse: collapse;
  margin-bottom: 2%;
  tr {
    .tableTitle {
      background: #8c17c2;
      color: #fff;
    }
  }
}
</style>
