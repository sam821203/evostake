<template>
  <div class="marquee">
    <div class="msg" ref="move">{{ $t(`歡迎來到後台`) }}</div>
    <div class="now">{{ $t(`巴西時間`) }}: {{ now }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue-demi'
import { convertTimeZone } from '@/utils/useConvertTimeZone'

const now = ref('')

const updateNow = () => {
  const { hours, minutes, seconds } = convertTimeZone(new Date(), -3)
  now.value = `${hours}:${minutes}:${seconds}`
}

setInterval(updateNow, 1000)
</script>

<style lang="scss" scoped>
.marquee {
  position: relative;
  width: calc(100% - 16px);
  height: 30px;
  margin: 8px 8px 0 8px;
  background: $light;
  border-radius: 5px;
  // box-shadow: 0 0 3px rgb(51, 51, 51);
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 20px;
  .msg {
    color: $dark;
    position: absolute;
    height: inherit;
    line-height: 30px;
    left: 1%;
    // color: rgb(255, 0, 43);
    font-weight: bold;
    // transform: translateX(-100%);
    white-space: nowrap;
    // animation: move 3s infinite linear;
    @keyframes move {
      0% {
        left: 0%;
        transform: translateX(-100%);
      }
      100% {
        left: 100%;
        transform: translateX(0%);
      }
    }
  }
  .now {
    color: $dark;
    background: $light;
    height: 100%;
    padding-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }
}
</style>
