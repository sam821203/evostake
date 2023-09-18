<template>
  <section>
    <h2 v-if="!mobileWidth">{{ route.params.type === 'lobby' ? $t('玩家掃描') : $t('下級代理掃描') }}</h2>
    <div class="qrcode">
      <p>{{ groupData.name }}</p>
      <QrcodeVue :value="link" :size="300" />
      <div class="link">
        <a :href="link" target="_blank">{{ link }}</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch, inject, computed } from 'vue-demi'
import useStore from '@/store/index'
import QrcodeVue from 'qrcode.vue'
import { useRoute } from 'vue-router'

const { treeStore } = useStore()

const route = useRoute()

const { groupData } = storeToRefs(treeStore)

const link = ref(`${process.env.VUE_APP_LINK}`)
const api = process.env.VUE_APP_LINK

watch(
  [() => route.params.type, groupData],
  () => {
    const { level, name } = groupData.value
    const params = route.params.type
    if (params === 'lobby') {
      const url = api.includes('192') ? api : `${api.slice(0, 8)}${name}.${api.slice(8)}`
      link.value = `${url}/${api.includes('192') ? 'lobby-brazil' : 'lobby'}/${api.includes('192') ? `?agent=${name}` : ''}#/home`
    } else {
      const lang = localStorage.getItem('locale') ?? 'zh-TW'
      link.value = `${api}/${api.includes('192') ? 'backend_brazil' : 'backend'}/#/register/${level}/${name}/${lang}`
      // link.value = `${api}/${api.includes('192') ? 'backend_phil' : 'backend'}/#/home/${level}/${name}/${lang}`
    }
  },
  { immediate: true }
)

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
</script>

<style lang="scss" scoped>
.qrcode {
  display: flex;
  align-items: center;
  flex-direction: column;
  canvas {
    background-color: white;
    padding: 12px;
    margin-bottom: 10px;
  }
  p {
    font-size: 26px;
    margin-bottom: 10px;
    text-align: center;
    color: white;
  }
  a {
    text-decoration: underline;
    color: blue;
  }
}

.link {
  @include breakpoint-up('sm') {
    width: 90%;
    a {
      word-wrap: break-word;
    }
  }
}
</style>
