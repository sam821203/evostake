<template>
  <TopBar @openMemu="openMemu" />
  <Marquee v-show="width" />
  <main :class="notLoginPath ? 'login' : 'main'">
    <Sidebar
      ref="sidebar"
      v-if="notLoginPath"
      @closureSidebar="toggleMenu = true"
      @resetView="resetView"
      :class="['sidebar-wrap', { isSidebarOpen: toggleMenu }]"
    />
    <div class="container" :class="{ box: notLoginPath }">
      <router-view :key="reset" />
    </div>
  </main>
  <MessageComp />
  <div @click="toggleMenu = true" :class="{ overlay: !toggleMenu && notLoginPath && !width }"></div>
</template>

<script setup>
import TopBar from './layoutComp/Topbar'
import Marquee from './layoutComp/Marquee'
import MessageComp from './layoutComp/MessageComp'
import Sidebar from './layoutComp/Sidebar'
import { ref, computed, inject, watch, nextTick } from 'vue-demi'
import { useRoute } from 'vue-router'

const route = useRoute()

const toggleMenu = ref(false)
const sidebar = ref(null)
const openMemu = (e) => {
  toggleMenu.value = e
  if (!e && route.path === '/treeGroup') {
    nextTick(() => {
      sidebar.value.handleTree()
    })
  }
}

// 重置玩家資訊
const reset = ref(0)
const resetView = () => reset.value++

// 手機版 sidebar 展開鎖定body
const lockSlide = () => {
  document.documentElement.style.overflowY = toggleMenu.value || width.value ? 'initial' : 'hidden'
}

// 斷點
const { clientWidth } = inject('clientWidth')
const width = computed(() => clientWidth.value === 'xl')

watch(width, () => {
  toggleMenu.value = !width
  lockSlide()
})
watch(toggleMenu, () => lockSlide())

const notLoginPath = computed(() => route.path !== '/login')
</script>

<style lang="scss" scoped>
.overlay {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100vw;
  position: fixed;
  top: 50px;
  left: 0;
  z-index: 1;
}

:deep .el-menu {
  height: 100%;
  overflow: hidden;
  background: $light;
  span,
  a {
    display: flex;
    align-items: center;
    font-size: 16px !important;
    color: black;
    img {
      width: 25px;
      margin-right: 15px;
    }
  }
  .is-active {
    background: $secondary;
    > a {
      color: white;
    }
  }
  .el-sub-menu__title {
    background: $light !important;
    &:hover {
      background: $secondary !important;
      a,
      span {
        color: white !important;
      }
    }
    i {
      color: black;
    }
  }
  .el-menu-item:hover {
    background: $secondary;
    a,
    span {
      color: white;
    }
  }
  .custom-tree-node {
    padding-right: 20px;
    span {
      font-size: 16px;
    }
  }
}

main {
  display: flex;
  width: 100%;
  .container {
    width: 100%;
    &.box {
      width: calc(100vw - 300px);
      @include breakpoint-up('xl') {
        margin-top: 10px;
        width: calc(100vw - 16px);
      }
    }
  }
  &.login {
    min-height: calc(100vh - 110px);
  }
  &.main {
    height: calc(100vh - 110px);
  }
  padding: 8px 8px 0 12px;
  @include breakpoint-up('sm') {
    padding: 24px 8px 8px;
  }
  .sidebar-wrap {
    height: 100%;
    z-index: 100;
    transition: 1s;
    min-height: calc(100vh - 110px);
    border-radius: 5px;
    background: $light;
    padding: 0 !important;
    width: 100% !important;
    min-width: 280px;
    max-width: fit-content;
    margin-right: 10px;
    @include breakpoint-up('xl') {
      position: absolute !important;
      margin: -8px 0 0 -13px;
      width: 0;
      height: auto;
    }
    @include breakpoint-up('sm') {
      margin: -24px 0 0 -8px;
    }
  }
  .isSidebarOpen {
    transform: translate(-100%);
  }
}
</style>
