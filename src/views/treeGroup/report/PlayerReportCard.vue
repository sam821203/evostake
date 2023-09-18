<template>
  <template v-for="(item, index) in data" :key="item">
    <Teleport to="#app" :disabled="targetIndex !== index">
      <div @click="targetCard(index, 'closure')" :class="{ overlay: targetIndex === index }"></div>
      <div @click.stop="targetCard(index, 'open')" class="mobileCard" :class="{ open: status && targetIndex === index }">
        <div class="header">
          <h2 class="title">
            {{ item.player_nickname }}
          </h2>
          <div class="icon" v-if="targetIndex !== index">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="icon closure" @click.stop="targetCard(index, 'closure')" v-else>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <ul>
          <li class="title">{{ $t('小計') }} :</li>
          <li>
            <p>{{ isTreeGroupPath ? $t('應收付') : $t('總淨利') }}</p>
            <p v-money="item.result / 10000"></p>
          </li>
          <li></li>
          <template v-for="(detail, key, index) of item.game_detail" :key="index">
            <li class="title">
              <div><span v-game="key"></span><span> :</span></div>
            </li>
            <li>
              <p>{{ $t('玩家帳號/暱稱') }}</p>
              <p>{{ item.player_account }}/{{ item.player_nickname }}</p>
            </li>
            <li>
              <p>{{ $t('總投注') }}</p>
              <p v-money="detail.bet / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總贏分') }}</p>
              <p v-money="detail.win / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總輸贏') }}</p>
              <p v-money="detail.win_lose / 10000"></p>
            </li>
            <template v-if="key !== 'goldenwind_pk'">
              <li>
                <p>{{ $t('有效投注') }}</p>
                <p v-money="detail.rw / 10000"></p>
              </li>
              <li>
                <p>{{ $t('返水‰') }}</p>
                <p>{{ detail.rw_percent / 100 }}</p>
              </li>
              <li>
                <p>{{ $t('返水') }}</p>
                <p v-money="detail.rw_value / 10000"></p>
              </li>
              <li></li>
            </template>
          </template>
        </ul>
      </div>
    </Teleport>
  </template>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue-demi'

defineProps({
  data: Array
})

const route = useRoute()
const isTreeGroupPath = computed(() => route.path === '/treeGroup')

const targetIndex = ref('')
const status = ref(false)
const targetCard = (index, val) => {
  status.value = val === 'open'
  targetIndex.value = val === 'open' ? index : ''
}

// 手機版 card 展開鎖定body
watch(status, () => {
  document.documentElement.style.overflowY = status.value ? 'hidden' : 'initial'
})
</script>

<style lang="scss" scoped>
.mobileCard {
  height: 14rem;
  &.open {
    height: calc(100vh - 150px);
    overflow-y: scroll;
  }
}
</style>
