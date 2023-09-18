<template>
  <el-dialog :model-value="controlDetailModal" width="60%" :show-close="true" @close="closeModal(ruleFormRef)" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t('風控詳細') }}</h2>
    </template>
    <ul>
      <li>
        <p>{{ $t('玩家帳號') }}:</p>
        <p>{{ newDetailsData.account }}</p>
      </li>
      <li>
        <p>{{ $t('玩家暱稱') }}:</p>
        <p>{{ newDetailsData.nickname }}</p>
      </li>
      <li>
        <p>{{ $t('所屬代理帳號') }}:</p>
        <p>{{ newDetailsData.agent_account }}</p>
      </li>
      <li class="level">
        <p>{{ $t('風控等級') }}:</p>
        <span class="success" v-if="newDetailsData.risk_level <= 0"></span>
        <span class="warning" v-if="newDetailsData.risk_level > 0 && newDetailsData.risk_level < 4"></span>
        <span class="danger" v-if="newDetailsData.risk_level >= 4"></span>
      </li>
      <li>
        <p>{{ $t('真實姓名') }}:</p>
        <p>{{ newDetailsData.real_name }}</p>
      </li>
      <li>
        <p>
          {{ $t('帳號狀態') }}:
          <el-button style="display: none" type="primary" @click="handlefreeze">{{
            newDetailsData.status ? $t('解凍') : $t('凍結')
          }}</el-button>
        </p>
        <p :style="{ color: newDetailsData.status ? 'red' : 'green' }">
          {{ newDetailsData.status ? $t('凍結') : $t('正常') }}
        </p>
      </li>
      <li>
        <p>RTP (%):</p>
        <p v-rtp="newDetailsData.rtp"></p>
      </li>
      <li>
        <p>{{ $t('玩家餘額') }}:</p>
        <p v-money="newDetailsData.balance / 10000"></p>
      </li>
      <li>
        <p>{{ $t('歷史總輸贏') }}:</p>
        <p v-money="newDetailsData.win_lose / 10000"></p>
      </li>

      <li>
        <p>{{ $t('歷史總存款') }}:</p>
        <p v-money="newDetailsData.charge / 10000"></p>
      </li>

      <li>
        <p>{{ $t('歷史總提款') }}:</p>
        <p v-money="newDetailsData.consign / 10000"></p>
      </li>
      <!-- <li>
        <p>{{ $t('IP位址') }}:</p>
        <p :class="{ repeat: isRepeatIP(ip) }" v-for="(ip, index) in newDetailsData.ip" :key="index">
          {{ ip }}
          <span v-show="isRepeatIP(ip)">({{ $t('重複') }})</span>
        </p>
      </li> -->
      <li>
        <p>{{ $t('密碼重複帳號') }}:</p>
        <p
          :class="duppwd > 0 ? 'jumpLink' : ''"
          @click="ctrlDetailStatus(duppwd, '密碼重複帳號', newDetailsData.pwd, newDetailsData.duplicate_pwd)"
        >
          {{ duppwd }}
        </p>
      </li>
      <li>
        <p>{{ $t('交易密碼重複帳號') }}:</p>
        <p
          :class="dupsecpwd > 0 ? 'jumpLink' : ''"
          @click="ctrlDetailStatus(dupsecpwd, '交易密碼重複帳號', newDetailsData.sec_pwd, newDetailsData.duplicate_sec_pwd)"
        >
          {{ dupsecpwd }}
        </p>
      </li>
      <li>
        <p>{{ $t('註冊IP重複帳號') }}:</p>
        <p
          :class="dupIP > 0 ? 'jumpLink' : ''"
          @click="ctrlDetailStatus(dupIP, '註冊IP重複帳號', newDetailsData.ip, newDetailsData.duplicate_ip)"
        >
          {{ dupIP }}
        </p>
      </li>
      <li v-if="false">
        <p>{{ $t('無存款申請提款') }}:</p>
        <div>
          <p v-if="newDetailsData.consign_before_charge">{{ $t('是') }}</p>
          <p v-else>{{ $t('否') }}</p>
        </div>
      </li>
      <li>
        <p>{{ $t('密碼與帳號相同') }}:</p>
        <div>
          <p v-if="newDetailsData.account_password_match">{{ $t('相同') }}</p>
          <p v-else>{{ $t('不同') }}</p>
        </div>
      </li>
    </ul>
  </el-dialog>
  <controldetailmodelDetail
    :title="detailTitle"
    :fix="detailfix"
    :detailData="detaildetailData"
    :meAccount="newDetailsData.account"
    v-if="controldetailmodelDetailStatus"
    v-model:controldetailmodelDetailStatus="controldetailmodelDetailStatus"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch, toRefs, computed } from 'vue-demi'
import { getFengkongDetailLogApi } from '@/api/record'
import { freezeAccountApi, unfreezeAccountApi } from '@/api/player'
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'
import controldetailmodelDetail from './controldetailModal_detail.vue'

const controldetailmodelDetailStatus = ref(false)
const detailTitle = ref()
const detailfix = ref()
const detaildetailData = ref({})
const ctrlDetailStatus = (num, e, f, g) => {
  if (num <= 0) return
  controldetailmodelDetailStatus.value = true
  detailTitle.value = e
  detailfix.value = f
  detaildetailData.value = g
}
const { t } = useI18n()
const { msgStore } = useStore()

const emit = defineEmits(['update:controlDetailModal', 'updateReport'])

const duppwd = computed(() => (newDetailsData.value.duplicate_pwd ? newDetailsData.value.duplicate_pwd.length : 0))
const dupsecpwd = computed(() => (newDetailsData.value.duplicate_sec_pwd ? newDetailsData.value.duplicate_sec_pwd.length : 0))
const dupIP = computed(() => (newDetailsData.value.duplicate_ip ? newDetailsData.value.duplicate_ip.length : 0))

const props = defineProps({
  me: String,
  controlDetailModal: Boolean,
  detailData: Object
})

const { controlDetailModal, detailData } = toRefs(props)

const newDetailsData = ref({})

const search = async () => {
  const { data } = await getFengkongDetailLogApi(detailData.value.u9)
  if (data.code !== 200) return
  newDetailsData.value = {
    ...detailData.value,
    ...data.data.data
  }
}

watch(controlDetailModal, () => {
  if (controlDetailModal.value) search()
})

// 凍結or解凍玩
const { openMsg } = msgStore
const { implement, type } = storeToRefs(msgStore)
const freezeText = computed(() => (newDetailsData.value?.status ? t('解凍') : t('凍結')))
const handlefreeze = () => openMsg({ content: `確定要${freezeText.value}此玩家?`, type: 'freeze' })
watch(implement, async () => {
  if (type.value === 'freeze' && implement.value) {
    const freezeStatus = newDetailsData.value.status ? unfreezeAccountApi : freezeAccountApi
    await freezeStatus({ pid: newDetailsData.value.u9 })
    emit('updateReport', newDetailsData.value.u9)
    emit('update:controlDetailModal', false)
    msgStore.$patch({ type: '' })
  }
})

// 重複IP
// const isRepeatIP = (ip) => {
//   if (!newDetailsData.value.duplicate_ip) return false
//   return newDetailsData.value.duplicate_ip.includes(ip)
// }

// modal 開關
const closeModal = () => {
  emit('update:controlDetailModal', false)
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;
  li {
    width: calc(100% / 4);
    margin-bottom: 20px;
    p {
      font-size: 18px;
      margin-bottom: 5px;
      &.repeat {
        color: red !important;
      }
    }
    &.level {
      display: flex;
      p {
        margin-bottom: 0;
      }
      span {
        margin: 3px 0 0 10px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        display: inline-block;
        &.success {
          background: #128b12;
        }
        &.warning {
          background: #ffc300;
        }
        &.danger {
          background: #d43030;
        }
      }
    }
  }
}

.line {
  border-bottom: 1px solid $info;
  margin-bottom: 20px;
}

.el-button {
  position: absolute;
  max-height: 80px !important;
  margin-left: 20px !important;
}
</style>
