<template>
  <nav v-if="notPc" class="mobileTopBar">
    <div class="topbar-title" v-if="!notLoginPath">
      <!-- <h1 @click="home" :class="{ en: locale === 'EN' }">Lucky888</h1> -->
      <h1 @click="home" :class="{ en: locale === 'EN' }">Evostake</h1>
      <nav>
        <select class="lang" :class="{ en: locale === 'EN' }" v-model="locale">
          <option value="zh-TW">{{ $t('繁中') }}</option>
          <!-- <option value="zh-CN">{{ $t('簡體') }}</option> -->
          <option value="EN">{{ $t('英文') }}</option>
        </select>
      </nav>
    </div>
    <template v-else>
      <div class="menu" @click="openMemu">
        <i class="fas fa-solid fa-bars"></i>
      </div>
      <div class="container">
        <div class="wrap">
          <!-- <h1 @click="home" :class="{ en: locale === 'EN' }">Lucky888</h1> -->
          <h1 @click="home" :class="{ en: locale === 'EN' }">Evostake</h1>
        </div>
        <div class="wrap">
          <p class="title" :class="{ en: locale === 'EN' }">{{ $t(route.meta.name) }}</p>
        </div>
      </div>
    </template>
  </nav>
  <nav class="topBar" v-else>
    <div class="stationInfo">
      <!-- <img @click="home" src="@/assets/topbar_logo.png" alt="logo" /> -->
      <!-- <h1 @click="home">Lucky888</h1> -->
      <h1 @click="home">Evostake</h1>
      <p>{{ version }} / {{ $t(route.meta.name) }}</p>
    </div>
    <div class="userInfo">
      <div>
        <el-button type="info" v-if="notLoginPath">
          {{ $t(treeStore.levelText(treeStore.groupData.level, loginStore.loginData.userData?.role_name)) }}
        </el-button>
        <el-button type="info">
          {{ notLoginPath ? `Hi,${loginStore.loginData.userData?.account}` : $t('請先登入') }}
        </el-button>
      </div>
      <nav>
        <select class="lang" :class="{ en: locale === 'EN' }" v-model="locale">
          <option value="zh-TW">{{ $t('繁中') }}</option>
          <!-- <option value="zh-CN">{{ $t('簡體') }}</option> -->
          <option value="EN">{{ $t('英文') }}</option>
        </select>
      </nav>
    </div>
  </nav>
  <p class="version" v-if="notPc">{{ version }}</p>
</template>

<script setup>
import { ref, defineEmits, inject, computed, watch } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'

// 路由
const router = useRouter()
const route = useRoute()
const notLoginPath = computed(() => route.path !== '/login')

const { loginStore, treeStore } = useStore()

const { locale } = useI18n()
watch(locale, (newlocale) => {
  localStorage.setItem('locale', newlocale)
  router.go(0)
})

// 可使用 addEventListener 監聽 localStorage locale
// const setItem = localStorage.setItem
// localStorage.setItem = function (name, value) {
//   setItem.apply(this, arguments)
//   const event = new Event('locale')
//   event.key = name
//   event.value = value
//   window.dispatchEvent(event)
// }

// 回點擊logo公告頁
const home = () => {
  if (notLoginPath.value) router.push('/home')
}

// sidebar開關收闔
const emit = defineEmits(['openMemu'])
const toggleMenu = ref(false)
const openMemu = () => {
  toggleMenu.value = !toggleMenu.value
  emit('openMemu', toggleMenu.value)
}

// 斷點
const { clientWidth } = inject('clientWidth')
const notPc = computed(() => clientWidth.value !== 'xl')

// 版號
const version = process.env.VUE_APP_VERSION
</script>

<style lang="scss" scoped>
h1 {
  color: $info;
  font-style: italic;
  margin: 0;
  cursor: pointer;
}
.topBar {
  background-color: $light;
  height: 56px;
  padding-left: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    cursor: pointer;
    margin-right: 5px;
  }
  .stationInfo {
    display: flex;
    align-items: center;
    h1 {
      margin-right: 15px;
    }
  }
  .userInfo {
    display: flex;
    align-items: center;
    height: 100%;
  }
  span,
  p {
    font-size: 20px;
    color: $dark;
    font-weight: 600;
  }
}
.lang {
  background: $light;
  color: $dark;
  height: 56px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  &.en {
    width: 120px;
  }
}
.menu {
  z-index: 100;
  position: absolute;
  background: $secondary;
  left: -60px;
  top: -46px;
  width: 120px;
  height: 120px;
  color: #ffffff;
  font-size: 30px;
  border-radius: 50%;
  z-index: 110;
  i {
    position: absolute;
    top: 45%;
    left: 57%;
    font-size: 35px;
  }
}
.mobileTopBar {
  background: $light;
  width: 100%;
  height: 50px;
  overflow: hidden;
  h1 {
    z-index: 10;
    &.en {
      white-space: nowrap;
      font-size: 16px !important;
    }
  }
  .topbar-title {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .lang {
      position: absolute;
      top: 0;
      right: 0;
      height: 50px;
      width: 70px;
      padding: 0 0 0 10px;
      &.en {
        width: 90px;
      }
    }
  }
  .container {
    display: flex;
    height: 100%;
    justify-content: space-between;
    .wrap {
      width: 50%;
      position: relative;
      display: flex;
      align-items: center;
      background: $secondary;
      h1 {
        margin-left: 40px;
        @include breakpoint-up('sm') {
          font-size: 20px;
        }
      }
      .mobileLogo {
        @include breakpoint-up('xl') {
          margin-left: 40px;
        }
        @include breakpoint-up('sm') {
          margin-left: 32px;
          width: 60%;
          position: relative;
          z-index: 110;
        }
      }
      .title {
        font-size: 24px;
        font-weight: bold;
        &.en {
          font-size: 12px !important;
        }
      }
      &:first-of-type {
        position: relative;
        padding-left: 80px;
        @include breakpoint-up('xl') {
          padding-left: 20px;
        }
        .title {
          margin-left: 32px;
          z-index: 130;
        }
        &::after {
          content: '';
          background: $info;
          position: absolute;
          right: -19px;
          top: -50px;
          width: 32px;
          height: 200px;
          transform: rotateZ(15deg);
          z-index: 2;
        }
      }
      &:nth-of-type(2) {
        padding-right: 5px;
        background-color: $info;
        justify-content: flex-end;
        .back {
          margin-right: 3px;
          margin-bottom: 5px;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
        }
        p {
          margin: 0;
          padding-right: 5px;
          text-align: right;
          color: #000000;
        }
      }
    }
  }
}

.version {
  position: absolute;
  z-index: 10;
  right: 5px;
  top: 53px;
  font-size: 16px;
}
</style>
