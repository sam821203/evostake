<template>
  <div>
    <p :class="['Ver', { showPwa: showPwa === true }]">{{ version }}</p>
  </div>
</template>

<script setup>
const version = process.env.VUE_APP_VERSION;
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
const { useAuth } = useStore();
const authStore = useAuth();
const { showPwa } = storeToRefs(authStore);
</script>

<style lang="scss" scoped>
.Ver {
  z-index: 200;
  color: white;
  position: fixed;
  right: 0px;
  top: 0px;
  font-size: 10px;
  text-shadow: 1px 1px 2px black;
}

//PC
@media (min-width: 992px) {
  .Ver {
    left: 50%;
    transform: translateX(200px);
  }
}
</style>
