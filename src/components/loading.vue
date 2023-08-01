<template>
  <div class="loading">
    <svg width="100" height="100" class="svg">
      <circle
        r="25"
        cx="50"
        cy="50"
        fill="#fff"
        stroke="#eee"
        stroke-width="8"
        stroke-dasharray="157 99999"
        stroke-dashoffset="0"
      ></circle>
      <circle
        r="25"
        cx="50"
        cy="50"
        fill="transparent"
        stroke="#aaa"
        stroke-width="8"
        stroke-dasharray="50 99999"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  text-align: center;
  background: lightgray;
  z-index: 999;
  position: absolute;
  width: 100%;
  height: 120vh;
  margin-top: -20%;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  .svg {
    animation: loading 1s linear infinite;
    margin-top: 50%;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
// svg circle{
//   stroke-dashoffset: 0;
//   transition: stroke-dashoffset 1s linear;
//   stroke: #fff;
//   stroke-width: 1em;
// }
// .progress-circle__rail {
//   width: 100%;
//   stroke: #eee;
// }
</style>
