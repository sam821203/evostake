<template>
  <div class="operationWrap">
    <div class="navbar">
      <img
        src="@/assets/images/modal/list_open2.png"
        alt=""
        class="back"
        @click="router.go(-1)"
      />
      <h2 class="title">{{ $t(routeName) }}</h2>
    </div>
    <main class="main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Footer from "./components/footer.vue";

const route = useRoute();
const router = useRouter();

const routeName = computed(() => route.meta.name);
</script>

<style lang="scss" scoped>
.operationWrap {
  .navbar {
    height: 4rem;
    line-height: 4rem;
    position: fixed;
    @include breakpoint-up("lg") {
      max-width: 470px;
    }
    top: 0;
    width: 100%;
    // background: $primary;
    background-image: url("@/assets/images/lobby/top_bar_frame.png");
    background-repeat: no-repeat;
    z-index: 10;
    .title {
      text-align: center;
      color: #fff;
      margin: 0;
    }
    .back {
      position: absolute;
      width: 6%;
      top: 45%;
      left: 4%;
      transform: rotate(90deg) translateY(-50%);
    }
  }
  .main {
    margin-top: 4rem;
    // margin-bottom: 6rem;
    padding-bottom: 6rem;
    // padding: 2rem 1.5rem;
    // height: calc((var(--vh, 1vh) * 100) - 4rem);
  }
}
</style>
