<template>
  <!-- <div class="announcement">
    <swiper
      :pagination="true"
      :modules="bannerModules"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      class="swiper"
      :loop="true"
    >
      <swiper-slide v-for="(banner, i) in bannerAry" :key="i">
        <img :src="dealPic(banner.picture_id)" alt="" />
      </swiper-slide>
    </swiper>
  </div> -->
  <div class="announcement">
    <swiper
      :pagination="true"
      :modules="bannerModules"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      class="swiper"
      :loop="true"
    >
      <swiper-slide v-for="(banner, i) in bannerAry" :key="i">
        <img :src="banner.img" alt="" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { computed } from "vue";
// import { useStore } from "@/store/index";
// import { storeToRefs } from "pinia";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper";
import { useLanguage } from "@/store/languageStore";
import { storeToRefs } from "pinia";
// import { useRouter } from "vue-router";
// import { getBannersApi } from "@/api/announcement";
// const router = useRouter();
import "swiper/css";
import "swiper/css/navigation";
import "swiper/scss/pagination";

const bannerModules = [Pagination, Autoplay];
// const bannerAry = ref(null);

// // 取得 banner 資料
// const getBanners = async () => {
//   const getBannersRes = await getBannersApi();
//   console.log(getBannersRes);
//   if (getBannersRes.data.code === 0) {
//     bannerAry.value = getBannersRes.data.data;
//   }
// };
// getBanners();

// // 跳轉
// const goBannerDetail = (url) => {
//   if (url) {
//     window.open(url);
//   }
// };

// // 網址處理
// const dealPic = (id) => {
//   var url = process.env.VUE_APP_GETBANNER;
//   if (id == "") {
//     return;
//   } else {
//     return url + id;
//   }
// };

// const gotoPromotionDetail = (i) => {
//   if (i !== 5) {
//     let url = `/activity/detailpromotionActivity?key=${i}`;
//     console.log(url);
//     router.push(url);
//   } else {
//     window.open("https://t.me/Lucky888CS");
//   }
// };

const languageStore = useLanguage();
const { curLang } = storeToRefs(languageStore);
const bannerAry = computed(() => {
  const ary = [];
  const allBannerCount = 5;
  for (let i = 1; i <= allBannerCount; i++) {
    ary.push({
      img: require(`@/assets/images/i18n/${curLang.value.name}/banner_${i}.jpg`),
    });
  }
  return ary;
});
</script>

<style lang="scss" scoped>
.announcement .swiper {
  height: 100%;
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      object-fit: contain;
    }
    .slide-wrap {
      width: 100%;
    }
  }
}
</style>
