<template>
  <div class="game" v-if="false">
    <div :class="{ lightOn: isActive, lightOff: !isActive }">
      <img src="@/assets/images/minigame/luckyJar/light.png" alt="" />
    </div>
    <button @click="openGame()" class="btn" :disabled="isBtnOff">
      <img :src="require(`@/assets/images/minigame/sevensDay/${bgType}.png`)" />
    </button>
    <p class="state">{{ state }}</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useMinigame } from "@/store/minigameStore";
import { displayTimeLeft } from "@/utils/timer";
import { useSounds } from "@/store/soundsStore";
const soundsStore = useSounds();
const { bgmSound } = storeToRefs(soundsStore);
const minigameStore = useMinigame();
const { getMiniGame, getMiniGameData, setMiniGameState } = minigameStore;
const { result, isSuccess, gameList } = storeToRefs(minigameStore);
const gameName = "seven-days";
/**按鈕開關 true關 false開*/
let isBtnOff = ref(true);
/**圖片格式*/
let bgType = ref("jar_0");
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
  name: ["jar_0", "jar_1", "jar_2", "jar_3", "jar_4"],
});
/**壺罐狀態 */
let state = ref("");

/**開啟遊戲 */
const openGame = async () => {
  if (isActive.value) {
    await getMiniGameData(gameName);
    if (isSuccess) {
      isBtnOff.value = true;
      const bgm = ref(bgmSound.value);
      let url = `${process.env.VUE_APP_GAME}/Activity_SevensDay?result=${result.value}&sound=${bgm.value}`;
      // url = url + result.value;
      console.log(url, "url");
      emit("opengame", url);
    }
  } else {
    if (bgmSound.value === true) {
      soundsStore.$patch({ forceCloseBgm: false });
    }
    return;
  }
};

/**依據剩餘秒數設定圖片 */
function setImage(seconds) {
  if (seconds <= 28800 && seconds > 21600) {
    mImage.index = 0;
  } else if (seconds <= 21600 && seconds > 14400) {
    mImage.index = 1;
  } else if (seconds <= 14400 && seconds > 7200) {
    mImage.index = 2;
  } else if (seconds <= 7200 && seconds > 0) {
    mImage.index = 3;
  } else {
    mImage.index = 4;
  }

  bgType.value = mImage.name[mImage.index];
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
    state.value = "BÔNUS DE 7 DIAS";
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
      state.value = "BÔNUS DE 7 DIAS";
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
  pointer-events: auto;
  // display: none;
}

.lightOn {
  position: absolute;
  display: block;
  img {
    @keyframes rotation {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(359deg);
      }
    }
    object-fit: contain;
    width: 100%;
    height: 100%;
    animation: rotation 3s infinite linear;
  }
}

.lightOff {
  display: none;
}

.btn {
  position: absolute;
  top: 10%;
  border: 0;
  cursor: pointer;
  background-color: transparent;
  font-size: 50%;
  img {
    object-fit: contain;
    width: 90%;
    height: 90%;
  }

  &:active {
    transform: scale(0.95);
    transition: all 100ms;
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
