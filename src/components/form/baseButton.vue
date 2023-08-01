<template>
  <button class="button" :disabled="disabled">
    <img :src="require(`@/assets/images/form/${bgType}.png`)" alt="" />
    <p class="btnText">
      <slot></slot>
    </p>
  </button>
</template>

<script setup>
// import { storeToRefs } from 'pinia';

defineProps({
  // disabledBtn, confirmBtn
  bgType: {
    type: String,
    default: "confirmBtn",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// const { bgType, disabled } = storeToRefs(props);
const send = (cb) => {
  cb();
};

defineExpose({
  send,
});
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  cursor: pointer;
  background-color: transparent;
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .btnText {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    color: #fff;
    line-height: 1.3;
  }
}
</style>
