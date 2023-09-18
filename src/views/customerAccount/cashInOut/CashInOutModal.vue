<template>
  <el-dialog :model-value="cashInOutModal" :width="cashInOutModalWidth" @close="closeCashInOutModal" :destroy-on-close="true">
    <template #header>
      <h2 :class="textStyle">{{ $t(`${title}作業`) }}</h2>
    </template>
    <CashInOutInfo :totalData="totalData" :cashInOutStatus="cashInOutStatus" v-model:cashData="cashData" :check="false" />
    <div class="save">
      <el-button @click="checkInfo(true)" :type="checkInfo(false) ? 'primary' : 'warning'">{{ $t('確認') }}</el-button>
    </div>
  </el-dialog>
  <el-dialog :model-value="cashInOutInfo" :width="cashInOutModalWidth" @close="cashInOutInfo = false" :destroy-on-close="true">
    <template #header>
      <h2 :class="textStyle">
        <span v-if="!resultInfo">{{ $t('確認') }}</span
        >{{ $t(`${title}資訊`) }}
      </h2>
    </template>
    <CashInOutInfo :totalData="totalData" :cashInOutStatus="cashInOutStatus" v-model:cashData="cashData" :check="true" />
    <div class="center">
      <template v-if="resultInfo">
        <p v-for="item in resultList" :class="textStyle" :key="item">{{ $t(`${item}成功`) }}</p>
      </template>
      <el-button @click="cashInOutInfo = false" type="primary" v-if="resultInfo">{{ $t('確認') }}</el-button>
      <el-button @click="save()" type="primary" v-else>{{ $t('確認') }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, toRefs, inject, computed, watch } from 'vue-demi'
import { cashInOutApi, cashInNextApi, cashThresholdApi } from '@/api/player'
import useStore from '@/store/index'
import CashInOutInfo from './CashInOutInfo'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:cashInOutModal', 'updatePlayer'])
const props = defineProps({
  cashInOutModal: Boolean,
  cashInOutStatus: String,
  totalData: Object
})
const { cashInOutModal, totalData, cashInOutStatus } = toRefs(props)

const cashData = ref({
  handleType: '',
  thresholdType: '',
  currencyType: 'TWD',
  points: 0,
  bonus: 0,
  threshold: 0,
  newThreshold: 0,
  info: ''
})
const tempCashData = ref({ ...cashData.value })
const resultInfo = ref(false)
const resultList = ref([])

const title = computed(() => (cashInOutStatus.value === 'in' ? '開分' : '洗分'))
const textStyle = computed(() => (cashInOutStatus.value === 'in' ? 'cashInTitle' : 'cashOutTitle'))

const cashInOutInfo = ref(false)
const { msgStore } = useStore()
const { openMsg } = msgStore
const { implement, type } = storeToRefs(msgStore)

// 確認可否操作開洗分、特殊扣款、紅利、門檻
const checkInfo = (status) => {
  const { handleType, points, bonus, threshold, thresholdType } = cashData.value
  if (!handleType) return false
  if (points === 0 && handleType === 1) return false
  if (bonus === 0 && cashInOutStatus.value === 'in' && handleType === 2) return false
  if (points === 0 && cashInOutStatus.value === 'out' && handleType === 2) return false
  if (threshold === 0 && thresholdType !== 3 && handleType === 3) return false
  if (status) {
    // 紅利必須填入提款門檻，增加分數、增加倍數需有數值
    if (
      (bonus > 0 && threshold === 0) ||
      ((thresholdType === 1 || thresholdType === 2) && threshold === 0 && cashInOutStatus.value === 'in')
    ) {
      return openMsg({ content: t('請輸入提款門檻') })
    }

    // 強制提款確認
    const wallet = totalData.value.wallet[cashData.value.currencyType]
    if (wallet.threshold > wallet.flow && cashInOutStatus.value === 'out' && cashData.value.points > 0 && cashData.value.handleType === 1) {
      openMsg({
        content: [
          {
            text: `${t('玩家帳號/暱稱')}: ${totalData.value.account}/${totalData.value.nickname}`,
            color: 'black'
          },
          {
            text: t('有效投注未達提款門檻，是否要強制提款？'),
            color: 'black'
          }
        ],
        type: 'cashOut'
      })
      return
    }

    cashInOutInfo.value = true
  }
  return true
}

// 執行強制提款
watch(implement, async () => {
  if (implement.value) {
    if (type.value === 'cashOut') cashInOutInfo.value = true
  }
})

let num = 0 // 防止連點觸發
const save = async () => {
  num++
  if (num > 1) return

  const obj = {
    pid: totalData.value.pid,
    currency: cashData.value.currencyType,
    info: cashData.value.info
  }
  const isCashIn = cashInOutStatus.value === 'in'

  // 開洗分
  if (cashData.value.handleType === 1) {
    obj.score = cashData.value.currencyType === 'TWD' ? cashData.value.points * 10000 : cashData.value.points * 3000000
    obj.special = false
    const { data } = await cashInOutApi(obj, cashInOutStatus.value)
    if (data.code !== 200) {
      return openMsg({
        content: [
          {
            text: `玩家帳號 ${totalData.value.account}`,
            color: 'black'
          },
          {
            text: `${title.value}失敗，請重新操作!`,
            color: 'black'
          }
        ]
      })
    }
    resultList.value.push(title.value)
  }

  // 開啟連續操作紅利(後端有阻擋玩家連續發API，需要發此API關閉此機制)
  if (cashData.value.bonus > 0 && cashData.value.points > 0) await cashInNextApi()

  // 紅利、特殊扣款
  if (cashData.value.handleType === 2 || cashData.value.bonus > 0) {
    if (isCashIn && cashData.value.bonus === 0) return
    obj.score = cashData.value[isCashIn ? 'bonus' : 'points'] * (cashData.value.currencyType === 'TWD' ? 10000 : 3000000)
    obj.special = true
    await cashInOutApi(obj, cashInOutStatus.value)
    resultList.value.unshift(isCashIn ? '紅利' : '特殊扣款')
  }

  // 提款門檻
  if (isCashIn || (cashData.value.handleType !== 2 && !isCashIn)) {
    // 開啟連續操作提款(後端有阻擋玩家連續發API，需要發此API關閉此機制)
    await cashInNextApi()

    // 增加/減少提款門檻
    if ((isCashIn && cashData.value.thresholdType !== 3) || (!isCashIn && cashData.value.thresholdType === 1)) {
      obj.score = cashData.value.newThreshold * 10000 - totalData.value.wallet[cashData.value.currencyType].threshold
      if (cashData.value.handleType === 3) resultList.value.push(isCashIn ? '增加提款門檻' : '減少提款門檻')
    }

    // 直接指定
    if (cashData.value.thresholdType === 3) {
      obj.score = cashData.value.newThreshold * 10000
      resultList.value.unshift('直接指定提款門檻')
    }

    const outStatus = cashData.value.handleType === 1 && !isCashIn
    // 洗分 提款門檻歸0
    if (outStatus) {
      obj.score = 0
    }
    obj.special = cashData.value.thresholdType === 3 || outStatus
    await cashThresholdApi(obj)
  }

  emit('update:cashInOutModal', false)
  emit('updatePlayer')
  resultInfo.value = true
  num = 0
}

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const cashInOutModalWidth = computed(() => (wh.value === 'xl' ? '800px' : '95%'))

// modal 開關
// 管理員列表 modal
const closeCashInOutModal = () => {
  emit('update:cashInOutModal', false)
}
watch(cashInOutModal, () => {
  if (cashInOutModal.value) {
    cashData.value = { ...tempCashData.value }
    resultList.value = []
    resultInfo.value = false
  }
})
</script>

<style lang="scss" scoped>
.save {
  text-align: center;
}

.cashInTitle {
  color: #c89800 !important;
}

.cashOutTitle {
  color: #ff4b4b !important;
}

.center {
  text-align: center !important;
  p {
    margin-bottom: 10px;
    font-weight: 900;
  }
}
</style>
