<template>
  <div class="dot" :style="{ backgroundColor }"></div>
</template>

<script setup>
defineProps({
  backgroundColor: {
    type: String,
    default: "red",
  },
});
</script>

<style lang="scss">
.dot {
  border-radius: 50%;
  width: 10px;
  height: 10px;
}
</style>
