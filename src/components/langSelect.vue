<template>
  <div class="language-wrap">
    <!-- <img
      src="@/assets/images/login/lang_box1.png"
      class="langOptionBg"
      v-show="toggleSelect"
    /> -->
    <!-- @click="select" -->
    <img :src="curLang.img" alt="" class="curlang" />
    <div class="language-option" v-show="toggleSelect">
      <div
        v-for="item in allLanguage"
        :key="item.name"
        class="option"
        v-show="curLang.lang !== item.lang"
        @click="selectLang(item)"
      >
        <p class="lang-name">{{ item.id }}</p>
        <img :src="item.img" alt="" class="optionLang" />
      </div>
      <!-- <div
        class="option"
        v-for="(item, i) in disabledLang"
        :key="i"
        @click="notOpenLang"
      >
        <img
          class="optionLang disabledIcon"
          :src="require(`@/assets/images/language/${item.img}.png`)"
          alt=""
        />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useLanguage } from "@/store/languageStore";
import { useI18n } from "vue-i18n";
const languageStore = useLanguage();
const { allLanguage, curLang } = storeToRefs(languageStore);
const { changeLang } = languageStore;

const toggleSelect = ref(false);
// const select = () => {
//   if (toggleSelect.value === true) {
//     toggleSelect.value = false;
//   } else {
//     toggleSelect.value = true;
//   }
// };
const i18n = useI18n();
const selectLang = (item) => {
  changeLang(item);
  i18n.locale.value = item.name;
  toggleSelect.value = false;
};
</script>

<style lang="scss" scoped>
.language-wrap {
  display: flex;
  flex-direction: column;
  z-index: 1;
  align-items: end;
  .curlang {
    z-index: 90;
    width: 2.5rem;
    margin-bottom: 4%;
  }

  .language-option {
    width: 32%;
    z-index: 80;
    position: absolute;
    top: 4.2em;
    padding: 3% 1% 0;
    background-image: url("@/assets/images/language_box.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5%;
    }
  }

  .optionLang {
    width: 2.5rem;
    z-index: 99;
  }
  // .disabledIcon {
  //   filter: grayscale(1);
  // }
}
</style>
