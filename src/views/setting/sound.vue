<template>
  <div class="sound-section">
    <div class="sound-setting-content">
      <div class="bgm">
        <div class="bgm-title">{{ $t("sound.bgm") }}</div>
        <div
          :class="['bgm-control on', { off: !bgmSound }]"
          @click="switchBGM"
        ></div>
      </div>
      <div class="se">
        <div class="se-title">{{ $t("sound.se") }}</div>
        <div
          :class="['se-control on', { off: SeButtonValue === 'off' }]"
          @click="switchSE"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { storeToRefs } from "pinia";
import { useSounds } from "@/store/soundsStore";

const soundsStore = useSounds();
const { switchBgm, switchSe } = soundsStore;

const { SeButtonValue, bgmSound } = storeToRefs(soundsStore);
import { useAuth } from "@/store/auth";
const authStore = useAuth();
const { userInfo } = storeToRefs(authStore);
console.log(userInfo.value);

const switchBGM = () => {
  switchBgm();
};

const switchSE = () => {
  switchSe();
  console.log(userInfo.value.sound_fx);
};
</script>

<style lang="scss" scoped>
:deep(.page) {
  background-position: center;
}

.sound-section {
  // margin-top: 30%;
  padding-top: 10%;
  .sound-setting-title {
    // color: #000;
    font-size: 2rem;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10%;
  }

  .sound-setting-content {
    margin: 10% auto 0;
    display: contents;
    .bgm {
      width: 80%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8%;

      .bgm-title {
        font-size: 1.2rem;
        // color: #000;
      }

      .bgm-control {
        width: 60px;
        height: 25px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        &.on {
          background-image: url("@/assets/images/modal/ON.png");
        }
        &.off {
          background-image: url("@/assets/images/modal/OFF.png");
        }
      }
    }
    .se {
      width: 80%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .se-title {
        font-size: 1.2rem;
        // color: #000;
        white-space: break-spaces;
      }
      .se-control {
        width: 60px;
        height: 25px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        &.on {
          background-image: url("@/assets/images/modal/ON.png");
        }
        &.off {
          background-image: url("@/assets/images/modal/OFF.png");
        }
      }
    }
  }
}
.lang-section {
  .lang-setting-title {
    color: #fff;
    font-size: 3rem;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10%;
    margin-bottom: 20%;
  }
  .lang-setting-content {
    &.hide {
      background-color: transparent;
      border: none;
    }
    width: 100%;
    padding: 1% 0;
    border: 3px solid #3548b8;
    border-radius: 8px;
    background-color: #172062;
    width: 100%;
    .select {
      position: relative;
      padding: 2% 0;
      border: 3px solid #3548b8;
      border-radius: 8px;
      background-color: #172062;
      width: 100%;
      display: flex;
      .area {
        display: flex;
        align-items: center;
        .icon {
          width: 22%;
          margin: 0 15px;
        }
        p {
          font-size: 1.5rem;
        }
      }

      .open-list {
        position: absolute;
        right: 3%;
        top: 50%;
        transform: translateY(-50%);
        width: 8%;
        height: 31%;
      }
    }
    .options {
      .area {
        padding: 2% 0;
        display: flex;
        align-items: center;
        .icon {
          width: 12%;
          margin: 0 15px;
        }
        p {
          font-size: 1.5rem;
          // color: #0ec0fb;
        }
      }
      .open-list {
        width: 10%;
        height: 10%;
      }
    }
  }
}
</style>
