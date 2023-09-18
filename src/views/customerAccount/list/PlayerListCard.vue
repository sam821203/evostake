<template>
  <template v-for="(item, index) in playerData" :key="item">
    <Teleport to="#app" :disabled="targetIndex !== index">
      <div @click="targetCard(index, 'closure')" :class="{ overlay: targetIndex === index }"></div>
      <div @click.stop="targetCard(index, 'open', item)" class="mobileCard" :class="{ open: status && targetIndex === index }">
        <div class="header">
          <h2 class="title">
            {{ item.nickname }}
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
        <ul ref="card">
          <li>
            <p>{{ $t('狀態') }}</p>
            <p v-status="item.isfreeze"></p>
          </li>
          <li>
            <p>{{ $t('玩家ID') }}</p>
            <p>{{ item.pid }}</p>
          </li>
          <li>
            <p>{{ $t('真實姓名') }}</p>
            <p>{{ item.realname }}</p>
          </li>
          <li>
            <p>{{ $t('帳號') }}</p>
            <p>{{ item.account }}</p>
          </li>
          <li>
            <p>{{ $t('玩家暱稱') }}</p>
            <p>{{ item.nickname }}</p>
          </li>
          <li>
            <p>
              {{ $t('今日有效投注') }}
              <BetPopover :detailsData="detailsData" type="today" />
            </p>
            <p v-money="item.todayBet / 10000"></p>
          </li>
          <li>
            <p>
              {{ $t('歷史有效投注') }}
              <BetPopover :detailsData="detailsData" type="period" />
            </p>
            <p v-money="item.periodBet / 10000"></p>
          </li>
          <li v-if="item.formal">
            <p>{{ $t('玩家餘額') }}</p>
            <p v-money="item.twd_balance / 10000"></p>
          </li>
          <li v-else>
            <p>{{ $t('玩家餘額') }}</p>
            <p v-money="item.wallet?.TEST.balance / 10000"></p>
          </li>
          <template v-if="item.type === 'cash'">
            <li>
              <p>{{ $t('今日存款') }}</p>
              <p v-money="item.history?.today.charge / 10000"></p>
            </li>
            <li>
              <p>{{ $t('今日提款') }}</p>
              <p v-money="item.history?.today.consign / 10000"></p>
            </li>
            <li>
              <p>{{ $t('歷史總存款') }}</p>
              <p v-money="item.history?.history.charge / 10000"></p>
            </li>
            <li>
              <p>{{ $t('歷史總提款') }}</p>
              <p v-money="item.history?.history.consign / 10000"></p>
            </li>
            <li>
              <p>{{ $t('歷史總紅利') }}</p>
              <p v-money="item.history?.history.special / 10000"></p>
            </li>
          </template>
          <!-- <li>
            <p>{{ $t('手機') }}</p>
            <p>{{ item.phone || '無' }}</p>
          </li> -->
          <li>
            <p>{{ $t('所屬代理帳號') }}</p>
            <p>{{ item.agentAccount }}</p>
          </li>
          <li>
            <p>{{ $t('所屬代理暱稱') }}</p>
            <p>{{ item.agentNickname }}</p>
          </li>
          <li>
            <p>{{ $t('身分證') }}</p>
            <p>{{ item.idnumber || '無' }}</p>
          </li>
          <li v-if="timeStatus">
            <p>{{ $t('註冊時間') }}</p>
            <p v-time="item.createtime"></p>
          </li>
          <li v-else>
            <p>{{ $t('最後登入時間') }}</p>
            <p v-time="item.updatetime"></p>
          </li>
          <li>
            <p>{{ $t('備註') }}</p>
            <p v-if="item.memo" v-omitLast="item.memo"></p>
            <p v-else></p>
          </li>
          <li v-if="item.type === 'cash'">
            <p>{{ $t('錢包地址') }}</p>
            <p v-if="item.wallet_address" v-omitFirst="item.wallet_address"></p>
            <p v-else></p>
          </li>
          <template v-for="list in slotData" :key="list">
            <slot :name="list"></slot>
          </template>
        </ul>
      </div>
    </Teleport>
  </template>
</template>

<script setup>
import { ref, toRefs, watch } from 'vue-demi'
import BetPopover from '@/components/BetPopover'

const props = defineProps({
  playerData: Array,
  slotData: Array,
  detailsData: Object,
  timeStatus: Boolean
})
const emit = defineEmits(['update:detailsData'])
const { playerData, slotData, detailsData } = toRefs(props)

const targetIndex = ref('')
const status = ref(false)
const targetCard = (index, val, data) => {
  if (val === 'open') emit('update:detailsData', data)
  status.value = val === 'open'
  targetIndex.value = val === 'open' ? index : ''
}

const resetTarget = () => {
  targetIndex.value = ''
  status.value = false
}

defineExpose({
  resetTargetIndex() {
    resetTarget()
  }
})

// 手機版 card 展開鎖定body
watch(status, () => {
  document.documentElement.style.overflowY = status.value ? 'hidden' : 'initial'
})

watch(playerData, () => resetTarget())
</script>

<style lang="scss" scoped>
.mobileCard {
  height: 195px;
  &.open {
    height: calc(100vh - 150px);
    overflow-y: scroll;
  }
  p {
    display: flex;
    align-items: center;
  }
}
</style>
