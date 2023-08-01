<template>
  <div class="gameLobby" ref="gameLobbyss">
    <div class="optionBar">
      <ul class="gameTypeWrap typeWrap">
        <li
          v-for="(gameType, i) in allGamesType"
          :key="i"
          @click="changeType(gameType, 'category')"
          class="gameTypeItem"
        >
          <img
            :src="
              require(`@/assets/images/game/${gameType}_${
                target.category === gameType ? '1' : '2'
              }.png`)
            "
            alt=""
          />
        </li>
      </ul>
      <ul class="firmWrap typeWrap">
        <li
          :class="['firmItem', { selected: target.studio === '' }]"
          @click="changeType('', 'studio')"
        >
          <img
            src="@/assets/images/game/all.png"
            alt="firm icon"
            class="studioIcon"
          />
        </li>
        <li
          v-for="(studio, i) in studioAry"
          :key="i"
          :class="['firmItem', { selected: target.studio === studio }]"
          @click="changeType(studio, 'studio')"
        >
          <img
            :src="require(`@/assets/images/game/${studio}.png`)"
            alt="firm icon"
            class="studioIcon"
          />
        </li>
      </ul>
    </div>
    <ul class="gameWrap">
      <li
        class="gameItem"
        @click="
          enterGame({
            gameId: gameEntry.studio_game_id,
            studio: gameEntry.studio,
            forbind: {
              maintence: gameEntry.maintence,
              test: userInfo.is_test && !gameEntry.tester_can_play,
            },
            comingsoon: gameEntry.is_comming_soon,
          })
        "
        v-for="gameEntry in gameList"
        :key="gameEntry.studio_game_id"
        v-show="gameEntry.show && !gameEntry.maintence"
      >
        <img
          src="@/assets/images/game/hot.png"
          alt="hot"
          class="hotIcon"
          v-show="gameEntry.hot"
        />
        <img
          src="@/assets/images/game/new.png"
          alt="hot"
          class="newIcon"
          v-show="
            gameEntry.new && target.studio != 'evo' && target.studio != 'funky'
          "
        />
        <img
          :src="gameEntry.icon_path"
          :alt="gameEntry?.game_name?.en"
          :class="['gameIcon', { disableIcon: gameEntry.maintence === true }]"
        />
        <div class="tipWrap" v-show="gameEntry.maintence === true">
          <p class="tipText">{{ $t("gameLobby.maintence") }}</p>
        </div>
        <div
          class="tipWrap"
          v-show="
            userInfo.is_test &&
            !gameEntry.maintence &&
            !gameEntry.tester_can_play
          "
        >
          <p class="tipText">{{ $t("gameLobby.testNotOpen") }}</p>
        </div>
      </li>
      <loading class="loading" v-if="isLoading" />
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive } from "vue";
import { getGameListApi, getGameUrlApi, checkWallet } from "@/api/game";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import throttle from "@/utils/throttle";
import loading from "@/components/loading";
import { useI18n } from "vue-i18n";
import { usectrlLogin } from "@/store/ctrlLogin";

const { t } = useI18n();

const { useGame, useAuth, useMessage, useSounds } = useStore();
const authStore = useAuth();
const { getUserInfo } = authStore;
const { token, userInfo } = storeToRefs(authStore);

const soundStore = useSounds();
const { bgmSound, SeButtonValue } = storeToRefs(soundStore);

const gameStore = useGame();
const { allGamesType } = storeToRefs(gameStore);

const { openMsg } = useMessage();

const route = useRoute();
const router = useRouter();

const gameList = ref([]);

const categoryType = computed(() => route.params.category);
const studioType = computed(() => route.params.studio);

const categoryTans = (type) => {
  let category = "";
  switch (type) {
    case "fishing":
      category = 1;
      break;
    case "slot":
      category = 2;
      break;
    case "blockchain":
      category = 4;
      break;
    case "bingo":
      category = 16;
      break;
    case "poker":
      category = 8;
      break;
    case "casino":
      category = 32;
      break;
    case "crash":
      category = 128;
      break;
    case "live":
      category = 256;
      break;
    default:
      category = 1;
      break;
  }

  return category;
};

const target = ref({
  category: categoryType.value,
  studio: studioType.value,
});

const totalStudios = ref([
  "funky",
  "evo",
  "joygames",
  "goldenwind",
  "pg",
  "facai",
  "jili",
]);
const studioAry = ref([
  "funky",
  "evo",
  "joygames",
  "goldenwind",
  "pg",
  "facai",
  "jili",
]);

const gameListParams = {
  category: categoryTans(target.value.category),
  limit: 50,
  offset: 0,
  studio: target.value.studio,
};

let listTotal = 1;
const isLoading = ref(true);
const gameListRes = ref(null);
const getGameListHanlder = async (gameListParams, filter) => {
  if (gameList.value.length >= listTotal && listTotal > 0) return;
  isLoading.value = true;
  let { category, limit, offset, studio } = gameListParams;
  gameListRes.value = await getGameListApi({ category, limit, offset, studio });
  console.log(gameListRes);
  listTotal = gameListRes.value.data.data.total;
  gameList.value.push(...gameListRes.value.data.data.games);
  isLoading.value = false;
  if (filter) {
    changeStudioList();
  }
};

const changeStudioList = () => {
  const studios = gameListRes.value.data.data.games.map((game) => game.studio);
  console.log(studios);
  console.log(totalStudios.value);
  studioAry.value = totalStudios.value.filter((item) => studios.includes(item));
};

const filter = ref(true);

const changeType = (type, key = "") => {
  if (allGamesType.value.includes(type)) {
    target.value["studio"] = "";
    gameListParams["studio"] = "";
  }
  target.value[key] = type;
  gameList.value = [];
  gameListParams[key] = key === "category" || "" ? categoryTans(type) : type;
  gameListParams.offset = 0;
  if (key === "category") {
    filter.value = true;
    gameStore.$patch({
      category: type,
    });
  } else {
    filter.value = false;
  }
  getGameListHanlder(gameListParams, filter.value);
};

const gameLobbyss = ref(null);

const lazyloadingHandler = reactive({
  html: document.querySelector("html"),
  handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = this.html;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      gameListParams.offset += gameListParams.limit;
      getGameListHanlder(gameListParams);
    }
  },
  openListener() {
    gameLobbyss.value.addEventListener("scroll", throttleScroll);
  },
  removeListener() {
    gameLobbyss.value.removeEventListener("scroll", throttleScroll);
    this.html = null;
  },
});

const throttleScroll = throttle(
  lazyloadingHandler.handleScroll.bind(lazyloadingHandler),
  300
);

onMounted(() => {
  if (token.value) {
    checkWallet();
  }
  lazyloadingHandler.openListener();
  gameListParams["studio"] = "";
  target.value.studio = "";
  getGameListHanlder(gameListParams, filter.value);
});

onBeforeUnmount(() => {
  lazyloadingHandler.removeListener();
  onBeforeUnmount(() => {
    gameStore.$patch({
      category: null,
    });
  });
});

// 進入遊戲
const enterGame = async ({ gameId, studio = "", forbind, comingsoon }) => {
  getUserInfo();
  // studio 傳給後端的值，targetStudio為route參數，因targetStudio可能為空值(all)所以需要拆分兩個
  if (comingsoon) {
    return;
  }
  if (!token.value) {
    openMsg({ content: t("registerFirst") }).then(() => {
      // router.push("/auth/login");
      usectrlLogin().$patch({
        loginpageStatus: true,
      });
    });
    return;
  }

  if (userInfo.value.wallets[0].balance / 10000 <= 0.1) {
    console.log("餘額不足");
    gameStore.$patch({
      studio: studio,
      gameId: gameId,
    });
    openMsg({
      content: "Saldo insuficiente na carteira.",
      hasCancel: true,
      deposit: true,
      entryGame: true,
      joinGame: true,
    })
      .then(() => {
        router.push("/deposit/deposit");
      })
      .catch(() => {
        console.log("繼續遊戲");
      });
  } else {
    if (forbind.maintence) {
      openMsg({ content: t("gameLobby.maintence") });
      return;
    } else if (forbind.test) {
      openMsg({ content: t("gameLobby.testNotOpen") });
      return;
    }

    const data = {
      sound: SeButtonValue.value === "on" ? true : false,
      bgm: bgmSound.value,
      lang: "en-US",
    };
    const { category, studio: targetStudio } = target.value;
    // if (target.value) {
    //   console.log(forbind);
    //   return;
    // }
    const res = await getGameUrlApi(studio, gameId, data);

    gameStore.$patch({
      gameUrl: res.data.data.url,
    });

    router.push({
      path: `/gameRoom/${category}/${targetStudio}`,
      query: { hasHomeBtn: studio !== "joygames" && studio !== "goldenwind" },
    });
  }
};
</script>

<style lang="scss" scoped>
.gameLobby {
  position: relative;
  height: calc(100vh - 7rem);
  overflow-y: auto;
  .typeWrap {
    position: sticky;
    top: 0;
    left: 0;
  }
  .optionBar {
    position: sticky;
    top: 0rem;
    left: 0;
    z-index: 10;
    // background: #fff;
    background: #23003e;
    // &.notLogin {
    //   top: $notLogin-topBar-height;
    // }

    .gameTypeWrap {
      height: 100%;
      display: flex;
      overflow: auto;
      padding: 5px 15px;

      @media (min-width: 768px) {
        &::-webkit-scrollbar {
          display: block;
          // width: 5px;
          height: 10px;
        }
        &::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.9);
        }
        &::-webkit-scrollbar-thumb {
          // background: rgb(31, 120, 224);
          background: rgba(255, 255, 255, 0.5);
          border-radius: 20px;
        }
      }

      // &::-webkit-scrollbar-button {
      //   // background: yellow;
      // }
      .gameTypeItem {
        margin-right: 5px;
        img {
          width: 90px;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
  .firmWrap {
    width: 100%;
    height: 50px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 5px 0 5px 10px;
    overflow-x: auto;
    white-space: nowrap;
    .firmItem {
      display: inline-block;
      position: relative;
      margin-right: 5px;
      background-size: 100% 100%;
      background-position: center;
      padding: 5px 7px;
      height: 100%;
      &.selected {
        background-image: url("@/assets/images/game/select_box.png");
      }
      .studioIcon {
        // width: 100%;
        height: 100%;
        object-fit: contain;
        // visibility: hidden;
      }
    }
  }
  .gameWrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px 5px 20px;
    margin-top: 10px;
    @include breakpoint-up("lg") {
      padding: 0;
      justify-content: start;
      margin-left: 13px;
    }

    .gameItem {
      width: calc(33.3vw - 20px);
      height: calc(33.3vw - 20px);
      margin-bottom: 10px;
      margin-right: 10px;
      position: relative;
      @include breakpoint-up("lg") {
        width: 30%;
        height: 30%;
      }
      .tipWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        .tipText {
          text-align: center;
          color: #fff;
        }
      }
      .gameIcon {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .disableIcon {
        filter: grayscale(1);
      }
      .newIcon {
        width: 40%;
        position: absolute;
        top: 0;
        left: -5%;
      }
      .hotIcon {
        width: 40%;
        position: absolute;
        top: 0;
        right: -5%;
      }
    }
  }
  .loading {
    z-index: $downBar-index;
    background: transparent;
    position: fixed;
    left: 50%;
    width: 40%;
    top: 50%;
    transform: translateX(-50%);
  }
}
</style>
