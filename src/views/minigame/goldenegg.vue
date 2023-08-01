<template>
  <div class="game">
    <button @click="openGame()" class="btn" :disabled="isBtnOff">
      <img :src="require(`@/assets/images/minigame/goldenegg/${bgType}.png`)" />
      <img class="goldegg" :class="{ active: isActive }" />
    </button>
    <p class="state">{{ state }}</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useMinigame } from "@/store/minigameStore";
import { displayTimeLeft } from "@/utils/timer";
const minigameStore = useMinigame();
const { getMiniGame, getMiniGameData, setMiniGameState } = minigameStore;
const { result, isSuccess, gameList } = storeToRefs(minigameStore);
const gameName = "goldenegg";
/**按鈕開關 true關 false開*/
let isBtnOff = ref(true);
/**圖片格式*/
let bgType = ref("egg");
let eggGold = ref("egg_1");
/**是否啟動*/
let isActive = ref(false);

const props = defineProps({
  time: {
    type: Number,
    default: 0,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["opengame", "resetgame"]);
/**圖片格式*/
const mImage = reactive({
  index: 0,
  name: ["egg_1", "egg_2"],
});
/**壺罐狀態 */
let state = ref("");

/**開啟遊戲 */
const openGame = async () => {
  if (isActive.value) {
    await getMiniGameData(gameName);
    if (isSuccess) {
      isBtnOff.value = true;
      let url = `${process.env.VUE_APP_GAME}/Activity_GoldenEgg?result=`;
      url = url + result.value;
      emit("opengame", url);
    }
  } else {
    return;
  }
};

/**依據剩餘秒數設定圖片 */
function setImage(seconds) {
  if (seconds > 0) {
    mImage.index = 0;
  } else {
    mImage.index = 1;
  }

  eggGold.value = mImage.name[mImage.index];
}
//計時器
let intervalTimer = ref();
/**設定倒數 */
function setTime(seconds) {
  clearInterval(intervalTimer);
  timer(seconds);
  setImage(seconds);
}
function timer(seconds) {
  if (seconds > 0) {
    isBtnOff.value = true;
    const now = Date.now();
    const end = now + seconds * 1000;
    state.value = displayTimeLeft(seconds);
    countdown(end);
  } else {
    state.value = "GoldenEgg";
    isBtnOff.value = false;
    isActive.value = true;
    setMiniGameState(true); //設置遊戲狀態+1
    return;
  }
}
//初始化
setTime(props.time);

//倒數計時
function countdown(end) {
  // this.initialTime = this.selectedTime;
  intervalTimer = setInterval(() => {
    const secondsLeft = Math.round((end - Date.now()) / 1000);
    setImage(secondsLeft);
    //倒數結束
    if (secondsLeft === 0) {
      state.value = "GoldenEgg";
      isActive.value = true;
      isBtnOff.value = false;
      setMiniGameState(true); //設置遊戲狀態+1
      return;
    }
    //關閉計時
    if (secondsLeft < 0) {
      clearInterval(intervalTimer);
      return;
    }
    state.value = displayTimeLeft(secondsLeft);
  }, 1000);
}

const resetGame = async (e) => {
  if (e.data == "closeWindow") {
    emit("resetgame");
    isActive.value = false;
    isBtnOff.value = true;
    setMiniGameState(false); //設置遊戲狀態-1
    await getMiniGame();
    if (isSuccess) {
      setTime(Math.abs(gameList.value[props.index].cooldown_seconds));
    }
  }
};

onMounted(() => {
  window.addEventListener("message", resetGame);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", resetGame);
  clearInterval(intervalTimer);
});
</script>

<style lang="scss" scoped>
.game {
  position: absolute;
  bottom: 10%;
  width: 4rem;
  height: 4rem;
  // display: none;
}

.btn {
  position: relative;
  border: 0;
  cursor: pointer;
  background-color: transparent;
  top: 10%;
  font-size: 50%;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }

  .goldegg {
    position: absolute;
    width: 45%;
    left: 0;
    margin-left: 28%;
    content: url("@/assets/images/minigame/goldenegg/egg_1.png");
    &.active {
      animation: activity 2s infinite ease;
    }
  }

  &:active {
    transform: scale(0.95);
    transition: all 100ms;
  }

  @keyframes activity {
    10% {
      transform: scaleY(0.8);
    }
    21% {
      content: url("@/assets/images/minigame/goldenegg/egg_2.png");
    }
    20% {
      transform: translateY(-15%);
    }
    25% {
      transform: scaleY(1.1);
    }
    30% {
      transform: scaleY(0.9);
    }
    45% {
      transform: translateY(0%);
    }
    60% {
      transform-origin: bottom;
      transform: rotate(-10deg);
    }
    80% {
      transform-origin: bottom;
      transform: rotate(5deg);
    }
    90% {
      transform-origin: bottom;
      transform: rotate(-5deg);
    }
    95% {
      transform-origin: bottom;
      transform: rotate(3deg);
    }
  }
}

.state {
  background-color: transparent;
  color: white;
  text-shadow: 1px 0 0.3em #000, 1px 0 0.3em #000, 1px 0 0.3em #000,
    1px 0 0.3em #000;
  position: absolute;
  font-weight: bold;
  font-size: 11px;
  text-align: center;
  bottom: 5%;
  white-space: nowrap;
  width: 100%;
  background-image: url("@/assets/images/minigame/main/time_box.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
