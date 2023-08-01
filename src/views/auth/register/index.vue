<template>
  <div>
    <!-- <nav class="nav">
      <div class="nav-item" @click="nextStep('StepOne')">
        <img src="@/assets/images/auth/p1_2.png" alt="" />
        <p>{{ $t("register.settingAcPwd") }}</p>
      </div>
      <div
        :class="['nav-item', { isLight: curStep === StepTwo }]"
        @click="nextStep('StepTwo')"
      >
        <img
          :src="
            require(`@/assets/images/auth/p2_${
              curStep === StepTwo ? 2 : 1
            }.png`)
          "
          alt=""
        />
        <p>{{ $t("register.setInfo") }}</p>
      </div>
    </nav> -->
    <main>
      <keep-alive :max="2">
        <component
          :is="curStep"
          @send="nextStep"
          @stepOneDone="isStepOneDone = true"
        />
      </keep-alive>
    </main>
  </div>
</template>

<script setup>
// import { ref } from "vue";
import StepOne from "./stepOne.vue";
// import StepTwo from "./stepTwo.vue";

// const compAry = {
//   StepOne,
//   StepTwo,
// };

// const isStepOneDone = ref(false);

// const nextStep = (comp) => {
//   if (!isStepOneDone.value) {
//     return;
//   }
//   curStep.value = compAry[comp];
// };

const curStep = StepOne;

// import { useRouter } from "vue-router";

// const router = useRouter();
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  .nav-item {
    position: relative;
    p {
      white-space: nowrap;
      text-align: center;
    }
    &:first-child {
      width: 10%;
      img {
        width: 100%;
        object-fit: contain;
        margin-bottom: 10px;
      }
      p {
        position: absolute;
        transform: translateX(-25%);
        width: 10ch;
        white-space: normal;
      }
    }
    &:nth-child(2) {
      width: 43%;
      img {
        width: 100%;
        object-fit: contain;
        margin-bottom: 10px;
      }
      p {
        position: absolute;
        right: -8%;
      }
    }
  }
}
</style>
