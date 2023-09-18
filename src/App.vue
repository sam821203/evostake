<template>
  <router-view></router-view>
  <Transition>
    <a @click.prevent="handleTop" class="top fs-2" href="#" v-show="top && clientWidth === 'sm'"
      ><i class="bi bi-arrow-up-square-fill"></i
    ></a>
  </Transition>
  <div class="turnGif" v-if="orientation">
    <img :src="require('./assets/orientation.gif')" class="orientation" />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import useStore from '@/store/index'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useCookie from '@/utils/cookie'

const router = useRouter()
const route = useRoute()
const { setToken, removeToken } = useCookie()

const { msgStore } = useStore()

// 確認登入
const checkLogin = async () => {
  if (route.name === 'register') return
  const token = JSON.parse(localStorage.getItem('login'))?.token
  if (!token) return
  setToken(token)
  router.push('/home')
}
watch(
  () => route.name,
  () => {
    if (route.name === 'login') checkLogin()
  }
)

// 閒置時間踢回登入
const { openMsg } = msgStore
let kickTimeout
const { t } = useI18n()
const tempTimeout = () => {
  return setTimeout(() => {
    if (route.path === '/login' || route.path === '/') return
    openMsg({ content: t('閒置過久，請重整瀏覽器並重新登入') })
    removeToken()
    localStorage.removeItem('login')
    router.push('/login')
  }, 86400000) // 24小時
}
const kick = () => {
  kickTimeout = tempTimeout()
}
window.addEventListener('click', () => {
  clearTimeout(kickTimeout)
  kick()
})
kick()

// 回到頂部
const handleTop = () => {
  document.documentElement.scrollTop = 0
}
const top = ref(false)
const handleScroll = () => {
  top.value = document.documentElement.scrollTop > 200
}

// 判斷畫面解析
const clientWidth = ref('')
provide('clientWidth', { clientWidth })
const setWidth = () => {
  const width = document.documentElement.clientWidth
  clientWidth.value = width > 1200 ? 'xl' : width > 576 ? 'lg' : 'sm'
}
window.onresize = () => setWidth()
setWidth()

// 手機版轉向圖
const orientation = ref(false)
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('orientationchange', () => {
    switch (window.orientation) {
      case 90:
        orientation.value = true
        break
      case -90:
        orientation.value = true
        break
      case 0:
        orientation.value = false
        break
    }
  })
})

if (localStorage.getItem('locale') === 'EN') {
  // document.title = 'Lucky888 Backend'
  document.title = 'Evostake Backend'
}

const localFont = localStorage.getItem('locale') === 'zh-CN' ? 'initial' : 'Noto Sans TC'
</script>

<style lang="scss">
#app {
  background: white;
  overflow: hidden;
  font-family: Microsoft JhengHei, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  @include breakpoint-up('sm') {
    background: $dark;
  }
}

.el-button {
  font-family: v-bind(localFont) !important;
}

table th {
  font-family: v-bind(localFont) !important;
}

.turnGif {
  background: black;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99999;
  top: 0;
  img {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    transform: translate(-50%, -50%);
    object-fit: contain;
  }
}

.top {
  position: fixed;
  bottom: 50px;
  display: flex;
  justify-content: end;
  right: 15px;
  z-index: 1;
  font-size: 40px;
  color: rgba(0, 0, 0, 0.6);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
