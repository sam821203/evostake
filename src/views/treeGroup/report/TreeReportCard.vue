<template>
  <template v-for="(item, index) in data" :key="item">
    <Teleport to="#app" :disabled="targetIndex !== index">
      <div @click="targetCard(index, 'closure')" :class="{ overlay: targetIndex === index }"></div>
      <div @click.stop="targetCard(index, 'open')" class="mobileCard" :class="{ open: status && targetIndex === index }">
        <div class="header">
          <h2 class="title">
            {{ agentName(item.from_agent_id) }}
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
        <!-- 小計 -->
        <ul>
          <template v-if="isTreeGroupPath">
            <li class="title">{{ $t('小計') }} :</li>
            <li>
              <p>{{ $t('本級分潤') }}</p>
              <!-- 本級總分潤：所有遊戲總淨利 - 所有遊戲上繳 -->
              <p v-money="item.total_net_win / 10000 - item.total_amount / 10000"></p>
            </li>
            <li v-if="tableType === 'detail'"></li>
            <template v-if="tableType === 'total'">
              <li>
                <p>{{ $t('下級返水') }}</p>
                <p v-money="item.last_bonus / 10000"></p>
              </li>
              <li>
                <p>{{ $t('下級分潤') }}</p>
                <p v-money="item.last_profit / 10000"></p>
              </li>
              <li>
                <p>{{ $t('我的獲利') }}</p>
                <!-- 我的獲利：本級玩家上繳 + 下級上繳 - 上繳 -->
                <p v-money="item.mine_profit / 10000"></p>
              </li>
              <li v-if="tableType !== 'total'"></li>
            </template>
          </template>
          <template v-else>
            <li class="title">{{ $t('小計') }} :</li>
            <li>
              <p>{{ $t('總投注') }}</p>
              <p v-money="item.total_bet / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總贏分') }}</p>
              <p v-money="item.total_win / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總輸贏') }}</p>
              <p v-money="item.total_winlose / 10000"></p>
            </li>
            <li>
              <p>{{ $t('有效投注') }}</p>
              <p v-money="item.total_rt / 10000"></p>
            </li>
            <li>
              <p>{{ $t('返水') }}</p>
              <p v-money="item.total_bonus / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總淨利') }}</p>
              <p v-money="item.total_net_win / 10000"></p>
            </li>
          </template>
        </ul>
        <!-- 各遊戲 -->
        <ul v-for="(detail, key, index) of item.game_detail" :key="index">
          <li class="title">
            <div><span v-game="key"></span><span> :</span></div>
          </li>
          <li>
            <p>{{ $t('總投注') }}</p>
            <p v-money="detail.bet / 10000"></p>
          </li>
          <li v-if="!isTreeGroupPath">
            <p>{{ $t('總贏分') }}</p>
            <p v-money="detail.win / 10000"></p>
          </li>
          <li>
            <p>{{ $t('總輸贏') }}</p>
            <p v-money="detail.winlose / 10000"></p>
          </li>
          <template v-if="key === 'goldenwind_pk' && isTreeGroupPath">
            <li>
              <p>{{ $t('贏分服務費') }}</p>
              <p v-money="detail.service_charge / 10000"></p>
            </li>
            <li>
              <p>{{ $t('佔成%') }}</p>
              <p>{{ detail.percent / 1000 }}</p>
            </li>
          </template>
          <template v-else-if="key !== 'goldenwind_pk' || isTreeGroupPath">
            <li>
              <p>{{ $t('有效投注') }}</p>
              <p v-money="detail.rt / 10000"></p>
            </li>
            <li>
              <p>{{ $t('返水‰') }}</p>
              <p>{{ detail.rt_percent / 100 }}</p>
            </li>
            <li>
              <p>{{ $t('返水') }}</p>
              <p v-money="detail.bonus / 10000"></p>
            </li>
          </template>
          <li v-if="key !== 'goldenwind_pk' || !isTreeGroupPath">
            <p>{{ $t('總淨利') }}</p>
            <p v-money="detail.net_win / 10000"></p>
          </li>
          <template v-if="isTreeGroupPath">
            <li v-if="key !== 'goldenwind_pk'">
              <p>{{ $t('分潤') }}%</p>
              <p>{{ detail.percent / 1000 }}</p>
            </li>
            <li>
              <p>分潤</p>
              <!-- 分潤: 總淨利 - 上繳 -->
              <p v-money="detail.net_win / 10000 - detail.amount / 10000"></p>
            </li>
          </template>
          <!-- 代理數據報表補線 -->
          <li v-if="key !== 'goldenwind_pk' && !isTreeGroupPath"></li>
        </ul>
      </div>
    </Teleport>
  </template>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch } from 'vue-demi'
import useStore from '@/store/index'
import { useRoute } from 'vue-router'

const props = defineProps({
  tableType: String,
  data: Array
})
const { data } = toRefs(props)

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

const { treeStore } = useStore()
const { treeTotal } = storeToRefs(treeStore)
const agentName = (id) => treeTotal.value.filter((item) => item.agent_id === id)[0]?.name
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
