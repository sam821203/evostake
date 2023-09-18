<template>
    <el-dialog :model-value="fastgivenBonusModal" :width="fastgivenBonusModalWidth" @close="closefastgivenBonusModal" :destroy-on-close="true">
    <template #header>
      <h2 :class="textStyle">{{ $t(`快派紅利`) }}</h2>
    </template>
    {{totalData}}
    <!-- <CashInOutInfo :totalData="totalData" :cashInOutStatus="cashInOutStatus" v-model:cashData="cashData" :check="false" /> -->
    <div class="save">
      <el-button @click="checkInfo(true)" :type="checkInfo(false) ? 'primary' : 'warning'">{{ $t('確認') }}</el-button>
    </div>
  </el-dialog>
  </template>

<script setup>
// import { storeToRefs } from 'pinia'
import { ref, toRefs, inject, computed, watch } from 'vue-demi'

// import useStore from '@/store/index'
// import CashInOutInfo from './CashInOutInfo'
// import { useI18n } from 'vue-i18n'

// const { t } = useI18n()

const emit = defineEmits(['update:fastgivenBonusModal', 'updatePlayer'])
const props = defineProps({
  fastgivenBonusModal: Boolean,
  totalData: Object
})
const { fastgivenBonusModal, totalData } = toRefs(props)

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

// const cashInOutInfo = ref(false)
// const { msgStore } = useStore()
// const { openMsg } = msgStore

const num = 0 // 防止連點觸發
// 確認可否操作開洗分、特殊扣款、紅利、門檻
const checkInfo = (status) => {
  console.log(status)
  console.log(num)
  console.log(totalData.value)
}

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const fastgivenBonusModalWidth = computed(() => (wh.value === 'xl' ? '800px' : '95%'))

// modal 開關
// 管理員列表 modal
const closefastgivenBonusModal = () => {
  emit('update:fastgivenBonusModal', false)
}
watch(fastgivenBonusModal, () => {
  if (fastgivenBonusModal.value) {
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
