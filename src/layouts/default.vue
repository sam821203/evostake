<template>
  <div class="wrap">
    <Navbar />
    <main class="main" :class="{ notLogin: !token }">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "./components/navbar.vue";
import Footer from "./components/footer.vue";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";

const { useAuth } = useStore();
const authStore = useAuth();
const { token } = storeToRefs(authStore);
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  margin: 3.5rem 0 $downBar-height 0;
  // background: $primary;
  &.notLogin {
    margin: $notLogin-topBar-height 0 $downBar-height 0;
  }
}
</style>
