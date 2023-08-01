<template>
  <div class="iframe_Div" v-if="isOpenGame">
    <iframe frameborder="0" :src="iframeurl" v-if="iframeurl"></iframe>
  </div>
  <div class="miniGames" v-if="isStart">
    <div class="main">
      <Transition>
        <img
          v-show="isOpenList"
          :src="require(`@/assets/images/minigame/main/${bgOpen}.png`)"
          style="right: 20%; width: 170px"
        />
      </Transition>
      <!-- <chestPixi v-show="isOpenList" /> -->
      <div class="icon">
        <Dot class="activity" v-show="isCanPlay"></Dot>
        <!-- <img :src="require(`@/assets/images/minigame/main/${bgType}.png`)" /> -->
        <chestPixi @touchstart="openList()" @click="openList()" />
      </div>
      <!--遊戲名稱需對應(name) & 活動有啟動(is_alive)-->
      <div
        v-for="(game, mindex) in gameList"
        :key="game.name"
        style="pointer-event: auto"
      >
        <Transition>
          <LunkyJar
            v-if="game.name == 'patrick' && game.is_alive == true"
            v-show="isOpenList"
            :time="game.cooldown_seconds"
            :index="mindex"
            @opengame="openGame"
            @resetgame="resetGame"
            :style="{
              right: 150 + 'px',
              /* eslint-disable */
              display: isOpenList ? 'block' : 'none'
            }"
          />
        </Transition>
        <Transition>
          <SevensDay
            v-if="game.name == 'seven-days' && game.is_alive == true"
            v-show="isOpenList"
            :time="game.cooldown_seconds"
            :index="mindex"
            @opengame="openGame"
            @resetgame="resetGame"
            :style="{
              left: 160 + 'px',
              /* eslint-disable */
              display: isOpenList ? 'block' : 'none'
            }"
          />
        </Transition>
        <!-- <Transition>
          <goldenEgg
            v-if="game.name == 'goldenegg' && game.is_alive == true"
            v-show="isOpenList"
            :time="game.cooldown_seconds"
            :index="mindex"
            @opengame="openGame"
            @resetgame="resetGame"
            :style="{
              left: (mindex + 1.5) * distance + '%',
              display: isOpenList ? 'block' : 'none',
            }"
          />
        </Transition> -->
        <!--之後遊戲Component加在這裡-->
      </div>
      <button class="back" v-if="isOpenList" @click="openList()"></button>
    </div>
  </div>
</template>

<script setup>
import LunkyJar from "@/views/minigame/luckyJar";
import SevensDay from "@/views/minigame/sevensday";
// import goldenEgg from "@/views/minigame/goldenegg";
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { getPlayerId } from "@/utils/cookie";
import { useStore } from "@/store/index";
import Dot from "@/components/alertDot.vue";
// 引入PIXI
import chestPixi from "@/views/minigame/modal/chest.vue";
const { useMinigame, useAuth, useSounds } = useStore();
const soundsStore = useSounds();
const { bgmSound } = storeToRefs(soundsStore);
const authStore = useAuth();
const { token, userInfo } = storeToRefs(authStore);
const minigameStore = useMinigame();
const { getMiniGame } = minigameStore;
const { gameList, isSuccess, isCanPlay, openGamesCount } =
  storeToRefs(minigameStore);
/**遊戲網址 */
const iframeurl = ref("");
/**是否開啟遊戲 */
const isOpenGame = ref(false);
/**是否開啟列表 */
const isOpenList = ref(false);
const isStart = ref(false);
// const distance = ref(15);
/**圖片格式*/
let bgType = ref("activity_button_1");
let bgOpen = ref("activity_box");

onMounted(async () => {
  /**判斷玩家是否有登入*/
  if (getPlayerId() == undefined) {
    isStart.value = false;
  }
  bgType.value = isCanPlay.value ? "activity_button_2" : "activity_button_1";
});

/**開啟列表 */
const openList = () => {
  isOpenList.value = !isOpenList.value;
  if (isCanPlay.value) {
    bgType.value = isOpenList.value ? "activity_expand_2" : "activity_button_2";
  } else {
    bgType.value = isOpenList.value ? "activity_expand_1" : "activity_button_1";
  }
};

/**開啟遊戲 */
const openGame = (url) => {
  isOpenGame.value = true;
  iframeurl.value = url;
  soundsStore.$patch({ forceCloseBgm: true });

  openList();
};

/**重設狀態 */
const resetGame = () => {
  iframeurl.value = "";
  isOpenGame.value = false;
  if (bgmSound.value === true) {
    soundsStore.$patch({ forceCloseBgm: false });
  }
};

onBeforeUnmount(() => {
  //遊戲數歸零
  openGamesCount.value = 0;
  if (bgmSound.value === true) {
    soundsStore.$patch({ forceCloseBgm: false });
  }
});

watch(
  [() => token.value, userInfo],
  async (val) => {
    isStart.value = val[0] && userInfo.value?.is_test == false;
    if (isStart.value) {
      await getMiniGame();
      if (isSuccess) {
        isStart.value = true;
      }
    }
  },
  { immediate: true }
);

watch(isCanPlay, () => {
  if (isOpenList.value) {
    bgType.value = isCanPlay.value ? "activity_expand_2" : "activity_expand_1";
  } else {
    bgType.value = isCanPlay.value ? "activity_button_2" : "activity_button_1";
  }
});

// watch(userInfo, (val) => {console.log("userInfo:" + val); });
</script>

<style lang="scss" scoped>
//Mobile
@media (min-width: 330px) {
  .iframe_Div {
    position: fixed;
  }
}

//PC
@media (min-width: 992px) {
  .iframe_Div {
    position: fixed;
  }

  .main {
    width: 440px;
  }
}

.iframe_Div {
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  width: 100%;
  top: 0;
  z-index: $minigame-index;
  left: 0;
  height: 100%;
}

iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 90%;
  transform: translate(-50%, -50%);
}

.miniGames {
  pointer-events: none;
  display: block;
  height: 4rem;
  width: 100%;
  position: fixed;
  bottom: calc((var(--vh, 1vh) * 1) + ($downBar-height * 0.8) + 1rem);
  z-index: 100;
  max-width: 470px;
  .icon {
    pointer-events: auto;
    position: absolute;
    width: 6rem;
    // height: 3.5rem;
    background-color: transparent;
    right: 5%;
    // bottom: -10%;
    :deep(.dot) {
      position: absolute;
      top: 20%;
      &.activity {
        right: 5px;
      }
    }
    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }

  .main {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > img {
      width: 100%;
      height: 100%;
      position: absolute;
      right: 0%;
      pointer-events: auto;
      // margin-left: 15%;
      // object-fit: contain;
    }
  }
}

.back {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 2%;
  background: transparent;
}

//動畫效果
.v-leave-active,
.v-enter-active {
  transition: all 0.9s ease;
}

.v-enter-from {
  transform: translateX(50%);
  opacity: 0;
}

.v-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
