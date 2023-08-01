<template>
  <div class="home">
    <Announcement />
    <MiddleBar />
    <div class="allLobbyWrap">
      <div class="aside">
        <div
          class="aside-items"
          :class="[route.name == k ? 'border' : '']"
          @click="router.push(`gamelobby/${k}`)"
          v-for="(v, k) in itemList"
          :key="k"
        >
          <img :src="require(`@/assets/images/lobby/filiter/${k}_a.png`)" />
          <span>{{ t(`entryType.${v}`) }}</span>
          <!-- <span>{{ route.name }}</span> -->
        </div>
      </div>
      <main class="main">
        <div class="hot">
          <!-- 123456 -->
          <div class="title">{{ t("熱門") }}</div>
          <div class="hotpage">
            <div v-for="(v, k) in hotgamedata" :key="k" class="icon">
              <img
                :src="v.icon_path"
                @click="
                  enterGame({
                    gameId: v.studio_game_id,
                    studio: v.studio,
                    forbind: {
                      maintence: v.maintence,
                      test: userInfo.is_test && !v.tester_can_play,
                    },
                  })
                "
              />
            </div>
          </div>
        </div>
        <ul class="entryWrap">
          <li
            class="entry"
            v-for="(entry, i) in entries"
            :key="i"
            @click="entryHandler(entry)"
            :style="{
              backgroundImage: `url(${require(`@/assets/images/icon/${entry}.png`)})`,
            }"
          >
            <img
              :src="require(`@/assets/images/icon/${entry}_1.png`)"
              alt=""
              class="name"
              :style="{ right: picPos(i) }"
            />
            <img
              :src="require(`@/assets/images/icon/${entry}_2.png`)"
              alt=""
              class="button"
            />
          </li>
        </ul>
        <div class="gameStatement">
          <img
            :src="require(`@/assets/images/statement/${k}.png`)"
            v-for="(v, k) in 8"
            :key="k"
          />
          <hr />
          <div class="statement_word">
            O jogo pode ser viciante. Por favor, jogue com responsabilidade.
          </div>
          <div class="statement_word">
            © 2023 - 2025 Evostake.com All rights reserved.
          </div>
        </div>
      </main>
    </div>
    <!-- <div class="copyright">© 2023 - 2025 Evostake.com All rights reserved.</div> -->
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import Announcement from "./components/announcement.vue";
import MiddleBar from "./components/middleBar.vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
import { useRouter, useRoute } from "vue-router";
import { usehotgameStore } from "@/store/hotgame";
import { useI18n } from "vue-i18n";
import { usectrlLogin } from "@/store/ctrlLogin";
import { getGameUrlApi, checkWallet } from "@/api/game";

const { useGame, useModal, useAuth, useMessage, useSounds, useSsevent } =
  useStore();
const sseStore = useSsevent();
const { balanceData } = storeToRefs(sseStore);
const authStore = useAuth();
const { getUserInfo } = authStore;
const { token, userInfo, walletType } = storeToRefs(authStore);
const { openMsg } = useMessage();
const { hotgamedata } = storeToRefs(usehotgameStore());
const { t } = useI18n();
console.log(userInfo.value);

const itemList = {
  crash: "crash",
  slot: "slot",
  fishing: "fishing",
  casino: "casino",
  blockchain: "blockchain",
  bingo: "bingo",
  live: "live",
  poker: "poker",
};
const router = useRouter();
const route = useRoute();
const soundStore = useSounds();
const { bgmSound, SeButtonValue } = storeToRefs(soundStore);
const game = useGame();
const { allGamesType } = storeToRefs(game);
const entries = ref([...allGamesType.value]);
const modalStore = useModal();
const { toggleModal, modalType } = modalStore;
const entryHandler = (entry) => {
  console.log(entry);
  game.$patch({
    category: entry,
  });
  router.push(`/gameLobby/${entry}`);
};

const categoryType = computed(() => route.params.category);
const studioType = computed(() => route.params.studio);
const target = ref({
  category: categoryType.value,
  studio: studioType.value,
});

watch(categoryType.value, (val) => {
  if (val) {
    game.$patch({
      category: categoryType.value,
    });
  }
});

const enterGame = async ({ gameId, studio = "", forbind }) => {
  getUserInfo();
  if (!token.value) {
    openMsg({ content: t("registerFirst") }).then(() => {
      usectrlLogin().$patch({
        loginpageStatus: true,
      });
    });
    return;
  }
  console.log(balanceData[walletType]?.balance);
  if (userInfo.value.wallets[0].balance / 10000 <= 0.1) {
    console.log("餘額不足");
    game.$patch({
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
        router.push("deposit/deposit");
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

    const res = await getGameUrlApi(studio, gameId, data);

    game.$patch({
      gameUrl: res.data.data.url,
    });

    router.push({
      path: `/gameRoom/${category}/${targetStudio}`,
      query: { hasHomeBtn: studio !== "joygames" && studio !== "goldenwind" },
    });
  }
};
onMounted(() => {
  if (token.value) {
    checkWallet();
  }
  //開關模組
  toggleModal(true);
  //打開組件，可參考modalStore.js
  modalType("AnnouncementBrief");
  usehotgameStore().gethotGame();
});
// const target = ref("");
// const changeSort = (gameType) => {
//   let targetKey = entries.value.indexOf(gameType);
//   target.value = entries.value.splice(targetKey, 1)[0];
//   entries.value.unshift(target.value);
// };
// 特規位置
const picPos = (k) => {
  let r = "0%";
  switch (k) {
    case 2:
      r = "-3%";
      break;
    case 3:
      r = "-8.5%";
      break;
    case 4:
      r = "-4%";
      break;
    case 5:
      r = "-9.5%";
      break;
    case 6:
      r = "-8.5%";
      break;
    case 7:
      r = "-8.5%";
      break;
    default:
      r = "";
      break;
  }
  r = "";
  return r;
};
</script>

<style lang="scss" scoped>
.home {
  padding-bottom: 0.5rem;
  .allLobbyWrap {
    display: flex;
    .aside {
      top: 0;
      left: 0;
      width: 20%;
      height: calc(100vh - 6.5rem - 144px - 5rem);
      .aside-items {
        width: calc(100% - 10px);
        height: calc(70px);
        margin: 0rem auto calc(0.5rem + 7px) 5px;
        box-sizing: content-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        word-break: keep-all;
        text-align: center;
        background: linear-gradient(180deg, #43324e 0%, #2e213b 100%);
        border-radius: 5px;
        &.border {
          border: 1px solid #b24ae2;
        }

        img {
          margin-top: 5px;
          height: 25px;
          object-fit: contain;
        }
        span {
          font-size: 1rem;
          height: 37px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ede9ef;
        }
      }
    }
    .main {
      width: 80%;
      .hot {
        width: 100%;
        padding-bottom: 5px;
        .title {
          font-size: 0.8rem;
        }
        .hotpage {
          height: 160px;
          display: flex;
          flex-wrap: wrap;
          .icon {
            width: 25%;
            text-align: center;
            img {
              height: 70px;
              object-fit: contain;
              border-radius: 8px;
            }
          }
        }
      }
      .entryWrap {
        .entry {
          height: 100px;
          background-size: 100% 100%;
          background-position: 0 0;
          color: #ffffff;
          background-repeat: no-repeat;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 7px;
          overflow: hidden;
          position: relative;
          .name {
            height: 40%;
            object-fit: contain;
            position: absolute;
            right: -6%;
            top: 10%;
          }
          .button {
            height: 60%;
            object-fit: contain;
            position: absolute;
            right: 5%;
            top: 30%;
          }
        }
      }
      .gameStatement {
        color: white;
        padding-bottom: 1px;
        width: 100%;
        margin-top: 5%;
        color: #a6a6a6;
        img {
          width: 25%;
          padding: 0 0 1px 0;
          object-fit: contain;
        }
        hr {
          background-color: rgba(255, 255, 255, 0.2);
          height: 1px;
          border: none;
          margin: 0 0 8px 0;
        }
        .statement_word {
          font-size: 0.8rem;
        }
      }
    }
  }
  .copyright {
    color: #a6a6a6;
    text-align: center;
    font-size: 12px;
    margin-top: 3%;
  }
}
</style>
