<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue-demi";
import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
import { useLanguage } from "@/store/languageStore";
import { storeToRefs } from "pinia";

let app = null;
const canvas = ref(null);
const animationSkin = ref("");
const animationInst = ref(null);

const createPixi = () => {
  app = new PIXI.Application({
    view: canvas.value,
    transparent: true,
    antialias: true,
    resolution: 1,
    width: 130,
    height: 130,
  });
  app.loader
    .add("spineCharacter", "./logo/free88.json")
    .load((loader, resources) => {
      animationInst.value = new Spine(resources.spineCharacter.spineData);
      app.stage.addChild(animationInst.value);
      animationInst.value.state.setAnimation(0, animationSkin.value, true);
      const localRect = animationInst.value.getLocalBounds();
      // animationInst.value.position.set(-localRect.x, -localRect.y);
      // console.log(localRect
      animationInst.value.position.set(-localRect.x / 0.8, -localRect.y / 0.6);
      app.start();
    });
};

const clearPixiCache = () => {
  Object.keys(PIXI.utils.BaseTextureCache).forEach((item) => {
    PIXI.utils.BaseTextureCache[item].textureCacheIds = [];
    PIXI.utils.BaseTextureCache[item].textureCacheIds = null;
    delete PIXI.utils.BaseTextureCache[item];
  });

  Object.keys(PIXI.utils.TextureCache).forEach((item) => {
    PIXI.utils.TextureCache[item].textureCacheIds = [];
    PIXI.utils.TextureCache[item].textureCacheIds = null;
    delete PIXI.utils.TextureCache[item];
  });
  // PIXI.utils.clearTextureCache()

  app.destroy(true);
  app = null;
};

const languageStore = useLanguage();
const { curLang } = storeToRefs(languageStore);

watch(curLang, () => {
  // if (curLang.value.name === "zhtw" || curLang.value.name === "ch") {
  //   animationInst.value.state.setAnimation(0, "login", true);
  // } else {
  //   animationInst.value.state.setAnimation(0, "login_EN_VN_PH", true);
  // }
});

onMounted(() => {
  // if (curLang.value.name === "zhtw" || curLang.value.name === "ch") {
  //   animationSkin.value = "login";
  // } else {
  //   animationSkin.value = "login_EN_VN_PH";
  // }
  animationSkin.value = "free88";
  createPixi();
});

onBeforeUnmount(() => {
  clearPixiCache();
  animationInst.value = null;
  // app.destroy(true)
  // app = null
});
</script>

<style></style>
