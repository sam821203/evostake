<template>
  <div class="message-wrap" @click="handleAction('cancelAction')"></div>
  <div :class="['message', type]">
    <div class="container">
      <div class="text">
        <div
          :class="['content slot', textSize(slot?.length)]"
          v-html="slot"
          v-if="slot"
        ></div>
        <p
          :class="[
            'content normal',
            { nowrap: content.length < 10 },
            textSize($t(content, { contentVal })),
          ]"
          style="text-align: center; width: 100%"
          v-else
          ref="normalContent"
        >
          {{ $t(content, { ...contentVal }) }}
        </p>
      </div>
      <div class="button-group" v-if="hasBtn">
        <baseButton
          :bgType="cancelBtn"
          @click="handleAction('cancel')"
          class="save"
          v-if="hasCancel"
          >{{ entryGame ? "Espere" : $t("openMsg.cancel") }}
        </baseButton>
        <baseButton @click="handleAction('confirm')" class="save">{{
          deposit ? "Depósito" : $t("openMsg.confirm")
        }}</baseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMessage } from "@/store/msgStore";
import { storeToRefs } from "pinia";
import { useLanguage } from "@/store/languageStore";
import baseButton from "@/components/form/baseButton";
import { getGameUrlApi } from "@/api/game";
import { useStore } from "@/store/index";
import { useRouter } from "vue-router";
const router = useRouter();
// const route = useRoute();
const { useGame, useSounds } = useStore();
const game = useGame();
const { studio, gameId, category } = storeToRefs(game);
const soundStore = useSounds();
const { bgmSound, SeButtonValue } = storeToRefs(soundStore);
const cancelBtn = ref("cancelBtn");
const msg = useMessage();
const { beforeClose } = msg;
const {
  content,
  hasBtn,
  type,
  contentVal,
  slot,
  hasCancel,
  entryGame,
  deposit,
  joinGame,
} = storeToRefs(msg);
const langStore = useLanguage();
const { curLang } = storeToRefs(langStore);
const textSize = (len) => {
  return (len > 30 && (curLang.value !== "ch" || curLang.value !== "zhtw")) ||
    (len > 13 && (curLang.value === "ch" || curLang.value === "zhtw"))
    ? "smallText"
    : "bigText";
};

const handleAction = (action) => {
  if (action === "confirm") {
    save();
    console.log("1");
  } else if (
    action === "cancel" &&
    entryGame.value === true &&
    joinGame.value === false
  ) {
    close();
    console.log("2");
  } else if (action === "cancel" && joinGame.value === true) {
    enterGame();
  } else {
    close();
    console.log(action);
    console.log(joinGame.value);
    console.log(entryGame.value);

    console.log("4");
  }
  msg.$patch({
    title: "",
    content: "",
    slot: "",
  });
};

const close = () => {
  beforeClose("cancel");
};

const save = () => {
  beforeClose("confirm");
};

const enterGame = async () => {
  const data = {
    sound: SeButtonValue.value === "on" ? true : false,
    bgm: bgmSound.value,
    lang: "en-US",
  };
  // const { category, studio: targetStudio } = target.value;

  const Studio = studio.value;
  const GameId = gameId.value;
  // const Category = category.value;
  const res = await getGameUrlApi(Studio, GameId, data);
  console.log(category.value);

  game.$patch({
    gameUrl: res.data.data.url,
  });
  console.log(res.data.data.url);

  router.push({
    path: `/gameRoom/${category.value}/${Studio}`,
    query: { hasHomeBtn: studio !== "joygames" && studio !== "goldenwind" },
  });
};
</script>
