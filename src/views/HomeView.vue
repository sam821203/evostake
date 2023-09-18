<template>
  <section v-if="!groupData.level">
    <h2>{{ $t('歡迎來到後台') }}</h2>
  </section>
  <section v-else>
    <h2>{{ $t('代理公告') }}</h2>
    <ul>
      <li v-for="(item, index) in announcementData" :key="item.content">
        <p>{{ index + 1 }}.</p>
        <p v-html="item.content"></p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue-demi'
import useStore from '@/store/index'
import { handleAgentAnnouncementApi } from '@/api/setting'
import { useRoute } from 'vue-router'

const route = useRoute()
const { treeStore } = useStore()
const { groupData } = storeToRefs(treeStore)

// 取得代理公告
const announcementData = ref([])
const getData = async () => {
  const { data } = await handleAgentAnnouncementApi('get')
  if (data.code !== 200) return
  announcementData.value = data.data.data
}

// 判斷是否為首頁和登入權限為代理時取得公告
watch(
  groupData,
  () => {
    if (route.path === '/home' && groupData.value.level > 0) getData()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
ul {
  li {
    color: white;
    white-space: pre-line;
    margin-bottom: 20px;
    display: flex;
    p {
      font-size: 16px;
      margin-right: 5px;
    }
    &:last-child {
      margin: 0;
    }
  }
}

section {
  @include breakpoint-up('sm') {
    margin: 0 10px !important;
    ul {
      background: #fbe5d6;
      border-radius: 5px;
      padding: 10px;
      li {
        color: black;
        p {
          color: black;
        }
      }
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
      background: #fbe5d6;
      border-radius: 5px;
      padding: 10px;
    }
  }
}
</style>
