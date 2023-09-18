<template>
  <el-dialog
    :model-value="fastgivenBonusModal"
    :width="fastgivenBonusModalWidth"
    @close="closefastgivenBonusModal"
    :destroy-on-close="true"
  >
    <template #header>
      <h2 :class="textStyle">{{ $t(`快派紅利`) }}</h2>
    </template>
    <el-form :label-width="mobileWidth ? '120px' : '150px'" label-position="top">
      <div class="row" style="grid-template-columns: repeat(3, minmax(0, 1fr))">
        <el-form-item :label="$t('玩家帳號')">
          <p class="jumpLink" @click="jumpPlayerDataReport(totalData)">{{ totalData.account }}</p>
          <!-- /{{ totalData.nickname }} -->
        </el-form-item>
        <el-form-item :label="$t('所屬代理')">
          <p class="jumpLink" @click="jumptreeGroup(totalData)">{{ totalData.agentAccount }}</p>
        </el-form-item>
        <el-form-item :label="$t('玩家餘額')">
          <p v-money="totalData.twd_balance / 10000"></p>
        </el-form-item>
      </div>
      <div style="font-size: 1.5rem; margin-bottom: 0.5rem; color: orange">{{ $t('本次派發紅利') }}</div>
      <div class="row" style="grid-template-columns: repeat(3, minmax(0, 1fr))">
        <el-form-item :label="$t('快派群組')">
          <p>{{ thisFastBonus.group_name }}</p>
        </el-form-item>
        <el-form-item :label="$t('派發紅利')">
          <p v-money="Number(thisFastBonus.bonus) / 10000"></p>
        </el-form-item>
        <el-form-item :label="$t('提款門檻')">
          <p>
            <span v-if="thisFastBonus.threshold_type == 0" v-money="thisFastBonus.threshold / 10000"></span>
            <!-- thisFastBonus.bonus +  -->
            <span v-else-if="thisFastBonus.threshold_type == 1" v-money="(thisFastBonus.bonus / 10000) * thisFastBonus.threshold"> </span>
          </p>
        </el-form-item>
        <el-form-item :label="$t('備註')">
          <p>{{ thisFastBonus.memo }}</p>
        </el-form-item>
      </div>
    </el-form>
    <!-- <CashInOutInfo :totalData="totalData" :cashInOutStatus="cashInOutStatus" v-model:cashData="cashData" :check="false" /> -->
    <div class="save">
      <el-button @click="settingFastGivenBonusData(true)" type="primary" class="in">{{ $t('設定快派') }}</el-button>
      <el-button @click="checkInfo(true)" :type="thisFastBonus.group_name ? 'primary' : 'warning'">{{ $t('確認') }}</el-button>
    </div>
  </el-dialog>
  <settingFastGivenBonus
    v-model:settingBonusModal="settingBonusModal"
    :fastbonusGroup="props.fastbonusGroup"
    @refreshAllgroup="settingFastGivenBonusData"
    :agentID="agentID"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, toRefs, inject, computed, watch } from 'vue-demi'
import settingFastGivenBonus from './settingFastGiveBonus.vue'
import { useRouter } from 'vue-router'
import useStore from '@/store/index'
// const { jumpTotree } = storeToRefs(fastgivenbonus)
// import { editFastBonusgroup } from '@/api/fastBonus'
import { useI18n } from 'vue-i18n'
import { cashInOutApi, cashThresholdApi, cashInNextApi } from '@/api/player'
const { fastgivenbonus, msgStore } = useStore()
const { changejumpTotree } = fastgivenbonus
const { thisFastBonus } = storeToRefs(fastgivenbonus)

const { openMsg } = msgStore
const { t } = useI18n()

const emit = defineEmits(['update:fastgivenBonusModal', 'updatePlayer', 'refreshFastBonusGroup', 'refreshPlayerdata'])
const props = defineProps({
  fastgivenBonusModal: Boolean,
  totalData: Object,
  fastbonusGroup: Array,
  agentID: String
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

const num = 0 // 防止連點觸發
// 確認可否操作開洗分、特殊扣款、紅利、門檻
const checkInfo = async (status) => {
  console.log(num)
  if (!thisFastBonus.value.group_name) {
    return
  }
  // if (status !== 0) {
  //   return
  // }
  if (status) {
    // const sdatas = {
    //   group_name: thisFastBonus.value.group_name,
    //   bonus: thisFastBonus.value.bonus / 10000,
    //   threshold_type: thisFastBonus.value.threshold_type,
    //   threshold: thisFastBonus.value.threshold / 10000,
    //   memo: thisFastBonus.value.memo
    // }
    // await editFastBonusgroup(sdatas) // 先儲存此次修改
    // 在開分
    const sdataCashIN = {
      currency: 'TWD', //
      info: thisFastBonus.value.memo, //
      pid: totalData.value.pid, //
      score: Number(thisFastBonus.value.bonus), //
      special: true, //
      is_instant_bonus: true
    }
    const sdataThreshold = {
      currency: 'TWD', //
      info: thisFastBonus.value.memo, //
      pid: totalData.value.pid, //
      score: '', //
      special: false, //
      is_instant_bonus: true
    }
    if (Number(thisFastBonus.value.threshold_type) === 0) {
      sdataThreshold.score = Number(thisFastBonus.value.threshold)
    } else if (Number(thisFastBonus.value.threshold_type) === 1) {
      sdataThreshold.score = (Number(thisFastBonus.value.threshold) * Number(thisFastBonus.value.bonus))
    }

    await cashInOutApi(sdataCashIN, 'in')
    await cashInNextApi()
    await cashThresholdApi(sdataThreshold)

    // const { datab } =
    // console.log(datab)
    handlePwd() // 開啟視窗提示
  }
  //   emit('refreshAllgroup')
}
const handlePwd = () =>
  openMsg({
    title: '', // 彈窗標題
    titleDanger: false, // 彈窗標題是否為警告，當為 true 時，標題字為紅色
    content: `${t('紅利派發成功')}`,
    type: 'info', // 彈窗類別
    hasCancel: false, // 彈窗開關
    hasBtn: true, // 是否顯示按鈕
    implement: closefastgivenBonusModal() //  彈窗確認執行
  })

// 設定快派
// const fastbonusGroup = ref([])
const settingBonusModal = ref(false)
const settingFastGivenBonusData = async (status) => {
  settingBonusModal.value = true
  emit('refreshFastBonusGroup')
  // const { data } = await getFastBonusgroup()
  // fastbonusGroup.value = data.data.instant_groups
  // console.log(fastbonusGroup.value)
}
// 斷點
const { clientWidth: wh } = inject('clientWidth')
const fastgivenBonusModalWidth = computed(() => (wh.value === 'xl' ? '800px' : '95%'))

// modal 開關
// 管理員列表 modal
const closefastgivenBonusModal = () => {
  emit('update:fastgivenBonusModal', false) // 關閉快派頁面
  // 重新搜尋資料
  emit('refreshPlayerdata')
}
watch(fastgivenBonusModal, () => {
  if (fastgivenBonusModal.value) {
    cashData.value = { ...tempCashData.value }
    resultList.value = []
    resultInfo.value = false
  }
})
const router = useRouter()
const jumpPlayerDataReport = (data) => {
  setTimeout(() => {
    const { href } = router.resolve({
      name: 'playerDataReport',
      params: {
        jumpParam: data.account
      }
    })
    window.open(href, '_blank') // 打开新的窗口
  }, 0)
}
const jumptreeGroup = (data) => {
  setTimeout(() => {
    // router.push(`/treeGroups/${data.agentAccount}`)
    router.push('treeGroup')
    console.log(data)
    changejumpTotree(data.agentAccount)
    // const { href } = router.resolve({
    //   name: 'treeGroup',
    //   params: {
    //     jumpParam: data.agentAccount
    //   }
    // })
    // window.open(href, '_blank') // 打开新的窗口
  }, 0)
}
</script>

<style lang="scss" scoped>
.save {
  //   text-align: center;
  display: flex;
  justify-content: space-around;
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
