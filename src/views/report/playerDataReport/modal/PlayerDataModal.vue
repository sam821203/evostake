<template>
  <el-dialog :model-value="playerDataModal" :width="listModalWidth" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t('玩家詳細資訊') }}</h2>
    </template>
    <ul class="playerInfo">
      <li>
        <span>{{ $t('玩家帳號') }}</span> :
        <span class="jumpLink" @click="jumpCustomerAccount(detailData.pid)">{{ detailData.account }}</span>
      </li>
      <li>
        <span>{{ $t('玩家暱稱') }}</span> :
        <span>{{ detailData.nickname }}</span>
      </li>
      <li class="line">
        <span>{{ $t('所屬代理') }}</span> : <span>{{ detailData.agent_name }}</span>
      </li>
      <li class="line">
        <span>{{ $t('是否活躍') }}</span> :
        <span :style="{ green: isActive ? '#3ec173' : 'red' }">{{ isActive ? '是' : '否' }}</span>
      </li>
      <li>
        <span>{{ $t('總投注') }}</span> :
        <span v-money="detailData.bet / 10000"></span>
      </li>
      <li>
        <span>{{ $t('總贏分') }}</span> :
        <span v-money="detailData.win / 10000"></span>
      </li>
      <li>
        <span>{{ $t('有效投注') }}</span> :
        <span v-money="detailData.valid_bet / 10000"></span>
      </li>
      <li>
        <span>{{ $t('歷史總有效投注') }}</span> :
        <span v-money="historyData.valid_bet / 10000"></span>
      </li>
      <li class="line">
        <span>{{ $t('總輸贏') }}</span> :
        <span :class="{ green: detailData.win_lose > 0 }" v-money="detailData.win_lose / 10000"></span>
      </li>
      <li class="line">
        <span>{{ $t('歷史總輸贏') }}</span> :
        <span :class="{ green: historyData.win_lose > 0 }" v-money="historyData.win_lose / 10000"></span>
      </li>
      <li>
        <span>{{ $t('存款') }}</span> :
        <span v-money="detailData.range.in / 10000"></span>
      </li>
      <li>
        <span>{{ $t('歷史總存款') }}</span> :
        <span v-if="!historyData.in">0</span>
        <span v-else v-money="historyData.in / 10000"></span>
      </li>
      <li>
        <span>{{ $t('提款') }}</span> :
        <span v-money="detailData.range.out / 10000"></span>
      </li>
      <li>
        <span>{{ $t('歷史總提款') }}</span> :
        <span v-if="!historyData.out">0</span>
        <span v-else v-money="historyData.out / 10000"></span>
      </li>
      <li>
        <span>{{ $t('紅利') }}</span> :
        <span v-money="detailData.range.special / 10000"></span>
      </li>
      <li>
        <span>{{ $t('歷史總紅利') }}</span> :
        <span v-if="!historyData.special">0</span>
        <span v-else v-money="historyData.special / 10000"></span>
      </li>
      <li class="line">
        <span>{{ $t('玩家餘額') }}</span> :
        <span v-money="detailData.range.balance / 10000"></span>
      </li>
      <li class="line" v-if="!mobileWidth"></li>
      <li>
        <span>{{ $t('最後登入時間') }}</span> :
        <span v-time="detailData.sing_in"></span>
      </li>
      <li>
        <span>{{ $t('最後登入IP') }}</span> :
        <span>{{ detailData.ip || '-' }}</span>
      </li>
      <li>
        <span>{{ $t('註冊時間') }}</span> :
        <span v-time="detailData.sing_up"></span>
      </li>
    </ul>
  </el-dialog>
</template>

<script setup>
import { ref, toRefs, inject, computed, watch } from 'vue-demi'
import { useRouter } from 'vue-router'
import { getPlayerTotalDataReportApi } from '@/api/report'
import useStore from '@/store/index'

const { jumpPlayerStore } = useStore()

const props = defineProps({
  playerDataModal: Boolean,
  detailData: Object
})
const { playerDataModal, detailData } = toRefs(props)

const detailsData = ref({})

// 取的歷史資料
const historyData = ref({})
const getData = async () => {
  const { data } = await getPlayerTotalDataReportApi(detailData.value.pid)
  if (data.code !== 200) return
  historyData.value = data.data.data
}

// 是否活躍
const isActive = computed(() => {
  const { range, bet } = JSON.parse(JSON.stringify(detailData.value))
  Object.keys(range).forEach((item) => {
    delete range[item].valid_bet
    delete range[item].win_lose
    delete range[item].balance
  })
  const tempData = [...Object.values(range), bet]
  return tempData.some((e) => e > 0)
})

// 跳轉玩家資訊
const router = useRouter()
const jumpCustomerAccount = (id) => {
  jumpPlayerStore.setPid(id)
  router.push('/customerAccount')
}

watch(
  () => detailData.value.pid,
  () => getData()
)

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const listModalWidth = computed(() => (wh.value === 'xl' ? '800px' : '95%'))
const mobileWidth = computed(() => wh.value === 'sm')

// modal 開關
const emit = defineEmits(['update:playerDataModal'])
const closeModal = () => {
  detailsData.value = {}
  emit('update:playerDataModal', false)
}
</script>

<style lang="scss" scoped>
.playerInfo {
  color: $dark;
  display: flex;
  font-size: 18px;
  flex-wrap: wrap;
  li {
    display: flex;
    width: 50%;
    padding: 15px 0;
    @include breakpoint-up('sm') {
      width: 100%;
    }
    span {
      &.green {
        color: #3ec173 !important;
      }
      &:first-child {
        width: 140px;
        display: inline-block;
      }
      &:last-child {
        margin-left: 10px;
      }
      > div {
        display: flex;
        align-items: center;
      }
    }
    &.line {
      border-bottom: 1px solid $dark;
      padding-bottom: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
