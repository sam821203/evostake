<template>
  <el-dialog :model-value="reviewDetailModal" width="60%" :show-close="true" @close="closeModal(ruleFormRef)" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t('詳細資訊') }}</h2>
    </template>
    <div v-if="detailData.type !== 'detail'" class="process">
      <div class="review">
        <div class="box finish" style="margin-left: 0">
          <!-- <i class="bi bi-check2"></i> -->
          <!-- 提款確認 -->
          <i v-if="isReview" class="bi bi-check2"></i>
          <div v-else>1</div>
          <p :class="{ isEn }">{{ $t('審核') }}</p>
        </div>
      </div>
      <div class="review">
        <div class="box" :class="{ finish: isReview }">
          <!-- <i v-if="isReview" class="bi bi-check2"></i> -->
          <!-- <div v-else>2</div> -->
          <div>2</div>
          <!-- 提款審核 -->
          <p :class="{ isEn }">{{ $t('確認') }}</p>
        </div>
      </div>
      <div class="line" :class="{ finish: isReview }"></div>
    </div>
    <h3>{{ $t('提款明細') }}</h3>
    <ul>
      <li>
        <p>{{ $t('提款單號') }}:</p>
        <p>{{ detailData.oid }}</p>
      </li>
      <li>
        <p>{{ $t('申請時間') }}:</p>
        <p v-time="detailData.created_at"></p>
      </li>
      <li>
        <p>{{ $t('所屬代理') }}:</p>
        <p>{{ detailData.agent }}</p>
      </li>
      <li>
        <p>{{ $t('玩家帳號') }}:</p>
        <p @click="jumpControl" class="jumpLink">{{ detailData.account }}</p>
      </li>
      <li>
        <p>{{ $t('真實姓名') }}:</p>
        <p>{{ detailData.real_name }}</p>
      </li>
      <li>
        <p>{{ $t('玩家餘額') }}:</p>
        <p v-money="detailData.balance / 10000"></p>
      </li>
      <li>
        <p>{{ $t('今日已提款筆數') }}:</p>
        <p>{{ detailData.today_consign }}</p>
      </li>
      <li>
        <p>{{ $t('提款方式') }}:</p>
        <p>{{ detailData.tx_type_name }}</p>
      </li>
      <li>
        <p>{{ $t('提款類型') }}:</p>
        <p>{{ detailData.tx_type }}</p>
      </li>
      <li>
        <p>{{ $t('提款金額') }}:</p>
        <p v-money="detailData.amount / 10000"></p>
      </li>
    </ul>

    <!-- <div class="avatar">
      <p v-show="!images.avatar">{{ $t('活動圖片') }}</p>
      <img :src="images.avatar ? images.avatar : require('@/assets/add.png')" alt="" :class="{ add: !images.avatar }" />
      <input type="file" accept="image/png" @change="changeImage($event, 'avatar')" class="uppic" />
    </div> -->
    <div style="display: flex; justify-content: center">
      <getPic
        :getPIC="getplayerPIC_(detailData.u9)"
        :title="'玩家頭像'"
        v-model:returnPic="sendplayerPIC[0]"
        :inputStatus="detailData.type !== 'detail'"
      />
      <getPic
        :getPIC="getplayerIDPIC_(detailData.u9, 'front')"
        :title="'身分證正面'"
        v-model:returnPic="sendplayerPIC[1]"
        :inputStatus="detailData.type !== 'detail'"
      />
      <getPic
        :getPIC="getplayerIDPIC_(detailData.u9, 'back')"
        :title="'身分證反面'"
        v-model:returnPic="sendplayerPIC[2]"
        :inputStatus="detailData.type !== 'detail'"
      />
    </div>
    <div style="margin-top: 1rem">
      <el-button type="primary" @click="gameLogModal = true">{{ $t('遊戲紀錄') }}</el-button>
      <el-button type="primary" @click="accountChangeModal = true">{{ $t('帳變明細') }}</el-button>
    </div>
    <h3 style="margin-top: 1rem">{{ $t('提款訊息') }}</h3>
    <ul>
      <li>
        <p>
          {{ $t('風控等級') }}:
          <span class="success" v-if="withdrawalData.risk_level <= 0"></span>
          <span class="warning" v-if="withdrawalData.risk_level > 0 && withdrawalData.risk_level < 4"></span>
          <span class="danger" v-if="withdrawalData.risk_level >= 4"></span>
        </p>
        <p></p>
      </li>
      <li>
        <p>{{ $t('密碼重複帳號') }}:</p>
        <p
          :class="(withdrawalData.duplicate_pwd != null ? withdrawalData.duplicate_pwd.length : 0) > 0 ? 'redjumpLink' : ''"
          @click="
            ctrlDetailStatus(
              withdrawalData.duplicate_pwd != null ? withdrawalData.duplicate_pwd.length : 0,
              '密碼重複帳號',
              withdrawalData.pwd,
              withdrawalData.duplicate_pwd
            )
          "
        >
          {{ withdrawalData.duplicate_pwd != null ? withdrawalData.duplicate_pwd.length : '0' }}
        </p>
      </li>
      <li>
        <p>{{ $t('交易密碼重複帳號') }}:</p>
        <p
          :class="(withdrawalData.duplicate_sec_pwd != null ? withdrawalData.duplicate_sec_pwd.length : 0) > 0 ? 'redjumpLink' : ''"
          @click="
            ctrlDetailStatus(
              withdrawalData.duplicate_sec_pwd != null ? withdrawalData.duplicate_sec_pwd.length : 0,
              '交易密碼重複帳號',
              withdrawalData.sec_pwd,
              withdrawalData.duplicate_sec_pwd
            )
          "
        >
          {{ withdrawalData.duplicate_sec_pwd != null ? withdrawalData.duplicate_sec_pwd.length : '0' }}
        </p>
      </li>
      <li>
        <p>{{ $t('註冊IP重複帳號') }}:</p>
        <p
          :class="(withdrawalData.duplicate_ip != null ? withdrawalData.duplicate_ip.length : 0) > 0 ? 'redjumpLink' : ''"
          @click="
            ctrlDetailStatus(
              withdrawalData.duplicate_ip != null ? withdrawalData.duplicate_ip.length : 0,
              '交易密碼重複帳號',
              withdrawalData.ip,
              withdrawalData.duplicate_ip
            )
          "
        >
          {{ withdrawalData.duplicate_ip != null ? withdrawalData.duplicate_ip.length : '0' }}
        </p>
      </li>
      <li>
        <p>{{ $t('密碼與帳號相同') }}:</p>
        <p>
          <span v-if="withdrawalData.account_password_match" style="color: #d43030">{{ $t('相同') }}</span>
          <span v-else> {{ $t('不同') }}</span>
        </p>
      </li>
      <li v-if="detailData.type !== 'check'">
        <p>{{ $t('審核備註') }}:</p>
        <p>{{ detailData.memo1 || $t('無') }}</p>
      </li>
      <li v-if="detailData.type === 'detail'">
        <p>{{ $t('確認備註') }}:</p>
        <p>{{ detailData.memo2 || $t('無') }}</p>
      </li>
    </ul>
    <template v-if="detailData.type !== 'detail'">
      <el-form-item :label="$t('備註')" class="memo">
        <el-input v-model="info" type="textarea" :rows="4" maxlength="200" :placeholder="$t('請輸入內容，上限200中英數')" />
      </el-form-item>
      <div class="btnGroup">
        <el-button type="primary" class="danger" @click="handleReview('reject')">{{ $t('拒絕') }}</el-button>
        <el-button type="primary" @click="handleReview('pass')">{{ $t('通過') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <controldetailmodelDetail
    :title="detailTitle"
    :fix="detailfix"
    :detailData="detaildetailData"
    :meAccount="withdrawalData.account"
    v-if="controldetailmodelDetailStatus"
    v-model:controldetailmodelDetailStatus="controldetailmodelDetailStatus"
  />
  <!-- 遊戲紀錄 -->
  <GameLogModal
    v-model:gameLogModal="gameLogModal"
    :totalData="{
      pid: detailData.u9,
      account: withdrawalData.account
    }"
  />
  <AccountChangeModal
    v-model:accountChangeModal="accountChangeModal"
    :totalData="{
      pid: detailData.u9,
      formal: true,
      account: withdrawalData.account,
      twd_balance: detailData.balance,
      nickname: detailData.nickname
    }"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch, computed, reactive } from 'vue-demi'
import { useRouter } from 'vue-router'
import { handleOrderApi, getplayerPIC, getplayerIDPIC, updateplayerPIC, updateplayerIDPIC } from '@/api/record'
//
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'
import getPic from '@/components/getPic.vue'
import GameLogModal from '@/views/customerAccount/modal/GameLogModal'
import controldetailmodelDetail from '@/views/record/control/modal/controldetailModal_detail.vue'
import AccountChangeModal from '@/views/customerAccount/modal/AccountChangeModal'

const { t } = useI18n()
const isEn = localStorage.getItem('locale') === 'EN'

const { msgStore } = useStore()
const gameLogModal = ref(false)
const accountChangeModal = ref(false)
const emit = defineEmits(['update:reviewDetailModal', 'updateReport'])

const props = defineProps({
  reviewDetailModal: Boolean,
  detailData: Object,
  withdrawalData: Array
})

const sendplayerPIC = reactive([]) // 玩家頭像/身分證正面/身分證反面
watch(sendplayerPIC, () => {
  // console.log(sendplayerPIC[0].avatar)
})
const isReview = computed(() => props.detailData.type === 'review')

const info = ref('')

let tempStatus = ''
const handleOrder = async () => {
  const { oid, status: state } = props.detailData
  // 確認中轉換審核為6
  // 審核中轉換已派單為2
  if (tempStatus === 'pass') {
    const status = state === '1' ? 6 : 2
    // console.log(sendplayerPIC[0].avatarFile.size / 1024 / 1024) // (MB) // 2/5/5
    let isOverLength = false
    sendplayerPIC.forEach((el) => {
      if (el.avatarFile.size / 1024 / 1024 > 2) {
        isOverLength = true
      }
    })
    if (isOverLength) {
      openMsg({
        title: '圖片超出大小',
        type: 'info',
        content: '圖片超出大小'
      })
      return
    }
    //
    let typeWrong = true
    if (sendplayerPIC.length > 0) {
      sendplayerPIC.forEach((el) => {
        console.log(el.avatarFile.type)
        if (el.avatarFile.type !== 'image/png' && el.avatarFile.type !== 'image/jpeg' && el.avatarFile.type !== 'image/jpg') {
          typeWrong = false
        }
      })
    }
    console.log(sendplayerPIC.length)
    if (!typeWrong) {
      openMsg({
        title: '格式錯誤',
        type: 'info',
        content: '格式錯誤'
      })
      return
    }
    // 0518
    if (sendplayerPIC[0]) {
      const playerPICdata = new FormData()
      playerPICdata.append('avatar', sendplayerPIC[0].avatarFile)
      playerPICdata.append('U9', props.detailData.u9)
      await updateplayerPIC(playerPICdata)
    }
    console.log(sendplayerPIC[1])
    if (sendplayerPIC[1]) {
      const playerICPICdataFront = new FormData()
      playerICPICdataFront.append('idcard', sendplayerPIC[1].avatarFile)
      playerICPICdataFront.append('u9', props.detailData.u9)
      playerICPICdataFront.append('type', 'front')
      await updateplayerIDPIC(playerICPICdataFront)
    }
    if (sendplayerPIC[2]) {
      const playerICPICdataBack = new FormData()
      playerICPICdataBack.append('idcard', sendplayerPIC[2].avatarFile)
      playerICPICdataBack.append('u9', props.detailData.u9)
      playerICPICdataBack.append('type', 'back')
      await updateplayerIDPIC(playerICPICdataBack)
    }
    // if (status) {
    //   return
    // }
    await handleOrderApi({ oids: [oid], memo: info.value, status })
    //
  }

  if (tempStatus === 'reject') {
    await handleOrderApi({ oids: [oid], memo: info.value, subject: rejectTitle.value, content: rejectContent.value, status: 8 })
    // await handleOrderApi({ oids: [oid], memo: rejectTitle, subject: rejectContent, status: 8 })
  }
  emit('updateReport')
  emit('update:reviewDetailModal', false)
}

const { openMsg } = msgStore
const { implement, type, rejectTitle, rejectContent } = storeToRefs(msgStore)
const lastStatus = ref()
const handleReview = (status) => {
  // 0517
  lastStatus.value = status
  const checkOrPass = !isReview.value ? '審核' : '通過'
  const statusText = status === 'pass' ? checkOrPass : '拒絕'
  let content = `確認要${statusText} ${props.detailData.account} 的提款嗎?`
  if (isEn) {
    if (statusText === '審核' || statusText === '通過') content = 'Will you confirm the Withdrawal?'
    if (statusText === '拒絕') content = 'Confirm the rejection of the withdrawal request for ' + props.detailData.account + '?'
  }

  let sendTitle = ''
  if (statusText === '拒絕') {
    sendTitle = '確認拒絕'
  } else if (statusText === '通過') {
    sendTitle = '確認通過'
  } else if (statusText === '審核') {
    sendTitle = '審核通過'
  }
  // isReview.value ? t(`確認${statusText}`) : t(`確認${statusText}`)
  // isReview
  console.log(isReview.value)
  openMsg({
    title: t(sendTitle),
    titleDanger: status === 'reject',
    content,
    type: 'review',
    rejectWithdraw: status !== 'pass'
  })
  tempStatus = status
}
watch(implement, () => {
  // console.log(type.value)
  // console.log(implement)
  // console.log(lastStatus.value) reject/pass
  if (type.value === 'review' && implement.value) {
    handleOrder()
    msgStore.$patch({ type: '' })
  }
})

// 跳轉風控
const router = useRouter()
const jumpControl = () => {
  const { href } = router.resolve({
    name: 'controlLog',
    params: {
      jumpParam: props.detailData.account
    }
  })
  window.open(href, '_blank') // 打开新的窗口

  // 0406
  // jumpPlayerStore.setAccount(props.detailData.account)
  // router.push('/controlLog')
}

// 獲取玩家頭像-0516
const getplayerPIC_ = async (u9) => {
  const { data } = await getplayerPIC(u9)
  if (data.type === 'image/png' || data.type === 'image/jpeg' || data.type === 'image/jpg') {
    return data
  } else {
    return { nodata: true }
  }
}
// detailData
const getplayerIDPIC_ = async (u9, type) => {
  const { data } = await getplayerIDPIC(u9, type)
  // console.log()
  if (data.type === 'image/png' || data.type === 'image/jpeg' || data.type === 'image/jpg') {
    return data
  } else {
    return { nodata: true }
  }
}

// modal 開關
const closeModal = () => {
  emit('update:reviewDetailModal', false)
}

watch(
  () => props.reviewDetailModal,
  () => {
    info.value = ''
  }
)
const detailTitle = ref()
const detailfix = ref()
const detaildetailData = ref({})
const controldetailmodelDetailStatus = ref(false)
const ctrlDetailStatus = (num, e, f, g) => {
  if (num <= 0) return
  controldetailmodelDetailStatus.value = true
  detailTitle.value = e
  detailfix.value = f
  detaildetailData.value = g
}
</script>

<style lang="scss" scoped>
h3 {
  font-size: 20px;
  color: $info;
  margin: 0 0 10px;
}

ul {
  display: flex;
  flex-wrap: wrap;
  li {
    width: calc(100% / 3 - 20px);
    margin: 0 20px 20px 0;
    p {
      font-size: 18px;
      margin-bottom: 5px;
    }
  }
}

.process {
  display: flex;
  justify-content: center;
  position: relative;
  width: fit-content;
  margin: 0 auto 30px;
  .check,
  .review {
    .box {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: white;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
      p {
        position: absolute;
        width: fit-content;
        bottom: -30px;
        // left: -50%;
        color: black;
        font-size: 20px;
        white-space: nowrap;
        &.isEn {
          left: -150%;
        }
      }
    }
  }
  .review {
    text-align: right;
    .box {
      margin-left: 200px;
      background: gray;
    }
  }
  .line {
    position: absolute;
    height: 6px;
    width: 90%;
    top: 30%;
    background: gray;
    z-index: -1;
  }
  .finish {
    background: #43cf7c !important;
  }
}

.success {
  margin: 3px 0 0 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
  background: #128b12;
}
.warning {
  margin: 3px 0 0 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
  background: #ffc300;
}
.redjumpLink {
  color: red !important;
  text-decoration: underline;
}
.danger {
  margin: 3px 0 0 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
  background: #d43030;
}
</style>
