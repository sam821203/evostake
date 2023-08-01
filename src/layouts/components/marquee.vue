<template>
  <div class="marquee">
    <div class="imgWrap">
      <img src="@/assets/images/layouts/sound_on.png" alt="" class="switch" />
    </div>
    <div ref="marqueeWrap" class="marqueeWrap">
      <span ref="marqueeDom">{{ marqueeText }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useSsevent } from "@/store/sseventStore";
import gsap from "gsap";
import { useStore } from "@/store";

// 跑馬燈
const ssevent = useSsevent();
const { marqueeData } = storeToRefs(ssevent);
const marqueeText = ref("");
const marqueeDom = ref(null); // 跑馬燈文字 dom
const marqueeWrap = ref(null);
let marqueeAry = [];
const contentQueue = ref([]);
const getCurMarquee = ref({});
const { useAuth } = useStore();
const authStore = useAuth();
const { token } = storeToRefs(authStore);

const queueTimer = [];

const pushQueue = (marquee) => {
  queueTimer.push(
    setTimeout(() => {
      contentQueue.value.push(marquee);
      if (!tl?.isActive()) {
        marqueeHandler();
      }
    }, marquee.frequency)
  );
};
const marqueeHandler = () => {
  if (token.value) {
    if (marqueeAry?.length > 0) {
      // 初始的跑馬燈資料
      getCurMarquee.value = marqueeAry.shift();
      marqueeText.value = "";
      marqueeText.value = getCurMarquee.value?.content;
    } else {
      if (contentQueue.value?.length < 1) return;
      getCurMarquee.value = contentQueue.value?.shift();
      marqueeText.value = "";
      marqueeText.value = getCurMarquee.value?.content;
    }
  } else {
    marqueeText.value = "Bem-vindo à Evostake~ Grande inauguração!";
  }
  if (marqueeText.value) {
    marqueeAnimation();
  }
};

const getDuration = () => {
  let duration = 0;
  const textWidth = marqueeDom.value?.offsetWidth; // 跑馬燈文字長度
  const marqueeWidth = marqueeWrap.value?.offsetWidth; // 跑馬燈外框長度
  const distance = textWidth + marqueeWidth; // 總距離
  const rate = 70; // 速率
  duration = distance / rate; // 時間 = 距離 / 速率

  return duration;
};

let tl = null;
// 跑馬燈動畫
const marqueeAnimation = () => {
  nextTick(() => {
    const duration = getDuration();
    const textWidth = marqueeDom.value?.offsetWidth; // 跑馬燈文字長度
    const marqueeWidth = marqueeWrap.value?.offsetWidth; // 跑馬燈外框長度
    tl.fromTo(
      marqueeDom.value,
      { x: marqueeWidth },
      { duration, ease: "linear", x: textWidth * -1 }
    )
      .call(marqueeHandler, [])
      .call(pushQueue, [getCurMarquee.value]);
  });
};

const resetMarquee = () => {
  if (tl) {
    tl?.kill();
    tl = null;
  }
  queueTimer.forEach((timer) => {
    clearTimeout(timer);
  });
  contentQueue.value = [];
  marqueeText.value = "";
  getCurMarquee.value = {};
  marqueeAry = [];
};

watch(marqueeData, (val) => {
  resetMarquee();
  if (!val?.length) return;
  marqueeAry = JSON.parse(JSON.stringify(marqueeData.value));
  if (!tl?.isActive()) {
    tl = gsap.timeline();
    marqueeHandler();
  }
});

onMounted(() => {
  marqueeHandler();
  marqueeAry = JSON.parse(JSON.stringify(marqueeData.value));
  tl = gsap.timeline();
  if (marqueeAry?.length > 0) {
    marqueeHandler();
  }
});

onBeforeUnmount(() => {
  resetMarquee();
});
// 跑馬燈
</script>

<style lang="scss">
.marquee {
  position: relative;
  width: 100%;
  height: 2rem;
  // background-image: url("@/assets/images/lobby/top_bar_frame.png");
  display: flex;
  align-items: center;
  color: white;
  font-size: 20px;
  margin-left: 5%;
  .marqueeWrap {
    width: 100%;
    overflow: hidden;
    background: #434e64;
    height: 1.5rem;
    border-radius: 10px;
    // margin: 0 6px;
  }
  .imgWrap {
    width: 20%;
    height: 1.5rem;
    position: absolute;
    background: #434e64;
    border-radius: 15px 0 0 15px;
    margin-left: -2%;
    z-index: 20;
    .switch {
      width: 18px;
      object-fit: contain;
      z-index: 10;
      background: #434e64;
      border-radius: 15px;
      margin-left: 5px;
      margin-top: 4px;
    }
  }

  span {
    display: inline-block;
    position: relative;
    left: 0;
    font-size: 1.2rem;
    white-space: nowrap;
  }

  // background-image: url("@/assets/images/lobby/top_bar_frame.png");
  // .marqueeAnimation{
  //   animation: marquee 5s linear;
  // }
}
</style>
