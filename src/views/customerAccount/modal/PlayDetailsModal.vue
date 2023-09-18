<template>
  <el-dialog :model-value="playDetailsModal" :width="listModalWidth" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t('詳細資訊') }}</h2>
    </template>
    <div class="searchGroup">
      <DateChoose @getDate="getDate" :newDate="newDate">
        <template #search>
          <el-button :type="dateExist ? 'primary' : 'warning'" @click="search">{{ $t('搜尋') }}</el-button>
        </template>
      </DateChoose>
    </div>
    <ul class="playerInfo">
      <li>
        {{ $t('玩家帳號') }} :
        <span class="jumpLink" @click="jumpPlayerDataReport(totalData)">{{ totalData.account }}</span>
      </li>
      <li>
        {{ $t('玩家暱稱') }} : <span>{{ totalData.nickname }}</span>
      </li>
      <li>
        {{ $t('玩家ID') }} : <span>{{ totalData.pid }}</span>
      </li>
      <li>{{ $t('總存款') }} : <span v-money="detailsData.charge / 10000"></span></li>
      <li>{{ $t('總提款') }} : <span v-money="detailsData.consign / 10000">{{}}</span></li>
      <li>{{ $t('總紅利') }} : <span v-money="detailsData.bonus / 10000">{{}}</span></li>

      <li>{{ $t('有效投注') }} : <span v-money="detailsData.effective / 10000"></span></li>
      <li>{{ $t('總贏分') }} : <span v-money="detailsData.win / 10000"></span></li>
      <li>{{ $t('總輸贏') }} : <span v-money="detailsData.betwin / 10000"></span></li>

      <!-- <li>{{ $t('總投注') }} : <span v-money="detailsData.bet / 10000"></span></li> -->

      <li>
        {{ $t('邀請好友數') }} :
        <span v-if="friendsData.detail" class="jumpLink" @click="friendsModal = true">{{ friendsData.friend_count }}</span>
        <span v-else>0</span>
        <!-- <span @click="friendsModal = true" class="jumpLink">{{ friendsData.friend_count }}</span> -->
      </li>

      <!--  -->
      <li>
        <span>{{ $t('好友首存人數') }} : {{ friendsData.first_charge_ppl }}</span>
      </li>
      <li>
        <span> {{ $t('好友續存人數') }} : {{ friendsData.continuing_charge_ppl }}</span>
      </li>
      <li>
        <span>{{ $t('好友首存金額') }} : <span v-money="friendsData.total_first_charge / 10000"></span></span>
      </li>
      <li>
        <span>{{ $t('好友續存金額') }} :<span v-money="friendsData.total_continuing_charge / 10000"> </span></span>
      </li>
      <li>
        <span>
          {{ $t('好友總流水') }} :
          <span v-money="friendsData.total_flow / 10000"> </span>
        </span>
      </li>

      <!--  -->
      <!--  -->
      <li v-if="isMobile"></li>
      <li v-if="totalData.formal" class="isMobile">{{ $t('玩家餘額') }} : <span v-money="totalData.twd_balance / 10000"></span></li>
      <li v-else>
        {{ $t('玩家餘額') }} :
        <span v-money="totalData.wallet?.TEST.balance / 10000"></span>
      </li>
      <li>
        {{ $t('推薦玩家帳號') }} :
        <span :class="{ jumpLink: totalData.inviter }" @click="jumpInviter(totalData.inviter)">{{ totalData.inviter || '' }}</span>
        <el-button type="primary" @click="editReferralPlayerAccount" v-if="!totalData.inviter" v-show="false">{{ $t('編輯') }}</el-button>
      </li>
      <li></li>
      <!--  -->
      <!--  -->

      <li>
        {{ $t('VIP等級') }} : <span>{{ totalData.vip_level }}</span>
      </li>
      <li></li>
      <li></li>
      <li :class="{ achieve: totalData.history?.history.charge / 10000 >= depositLV(totalData.vip_level) }">
        {{ $t('總存款') }} : <span v-money="totalData.history?.history.charge / 10000"></span>
        <span
          >/
          {{ depositLV(totalData.vip_level) }}
        </span>
      </li>
      <li
        :class="{ achieve: totalData.history_valid_bet_win / 10000 >= vipInfo.totalValid[totalData.vip_level] && totalData.vip_level > 0 }"
      >
        <template v-if="true">
          <!-- totalData.vip_level > 0 -->
          {{ $t('總流水') }} : <span v-money="totalData.history_valid_bet_win / 10000"></span> /<span
            v-money="vipInfo.totalValid[totalData.vip_level]"
          ></span>
        </template>
      </li>
      <li :class="{ achieve: friendsData.friend_count >= vipInfo.friendsNum[totalData.vip_level] }">
        <template v-if="totalData.vip_level != 0">
          {{ $t('目前已邀請好友') }} : <span>{{ friendsData.friend_count }}</span>
          <!-- / {{ vipInfo.friendsNum[totalData.vip_level] }} -->
        </template>
      </li>

      <!-- <li></li> -->
      <!-- <li v-if="isMobile"></li> -->
      <li class="isMobile" style="flex-direction: column">
        {{ $t('最後登入時間') }} :
        <div><span v-time="totalData.updatetime"></span></div>
      </li>
      <li class="isMobile" style="flex-direction: column">
        {{ $t('註冊時間') }} :
        <div v-time="totalData.createtime"></div>
      </li>
      <li class="isMobile" style="flex-direction: column">
        {{ $t('成為正式帳號時間') }} :
        <div v-time="totalData.formal_time"></div>
      </li>
      <li></li>
      <li></li>
    </ul>
  </el-dialog>
  <FriendsModal
    v-model:friendsModal="friendsModal"
    :playerAccount="totalData.account"
    :id="totalData.pid"
    :friendsData="friendsData"
    :account="totalData.account"
    :first_charge_ppl="friendsData.first_charge_ppl"
    :continuing_charge_ppl="friendsData.continuing_charge_ppl"
    :date="date"
  />
  <ReferralPlayerAccount
    v-model:editReferralPlayerAccountModal="editReferralPlayerAccountStatus"
    @editReferralPlayerAccountStatus="closeReferralPlayerAccount"
    :agentid="props.totalData.agent_id"
    :u9="props.totalData.pid"
  />
</template>

<script setup>
import { ref, toRefs, inject, computed, watch, onMounted } from 'vue-demi'
import { useRouter } from 'vue-router'
import { getPlayerDetailsApi, getFriendsApi } from '@/api/player'
// import useStore from '@/store/index'
import FriendsModal from './FriendsModal.vue'
import ReferralPlayerAccount from './editReferralPlayerAccount.vue'
import DateChoose from '@/components/date/DateChoose'
// const moment = require('moment')
const newDate = ref()
const date = ref('今日')
const editReferralPlayerAccountStatus = ref(false)
const editReferralPlayerAccount = () => {
  editReferralPlayerAccountStatus.value = true
}
const getDate = (edate) => {
  date.value = edate
  // searchDateData.value = date
}
const closeReferralPlayerAccount = () => {
  editReferralPlayerAccountStatus.value = false
  closeModal()
  emit('refreshSearch')
  // 0419
}
const dateExist = ref(false)
watch(date, (val) => {
  if (Object.keys(date.value).length > 0) {
    dateExist.value = true
  } else {
    dateExist.value = false
  }
})
onMounted(() => {
  console.log(123)
})

const emit = defineEmits(['update:playDetailsModal', 'jumpInviter', 'refreshSearch'])
const props = defineProps({
  playDetailsModal: Boolean,
  totalData: Object,
  date: Object
})
const { playDetailsModal, totalData } = toRefs(props)
watch(
  () => props.playDetailsModal,
  (v) => {
    console.log(v)
    date.value = '今日'
    dateExist.value = false
  }
)
// VIP條件
const vipInfo = {
  friendsNum: {
    0: 3,
    1: 9,
    2: 10,
    3: 10,
    4: 10,
    5: 10
  },
  totalValid: {
    0: 500,
    1: 10000,
    2: 50000,
    3: 150000,
    4: 500000,
    5: 500000
  }
}

// 好友彈窗
const friendsModal = ref(false)

const detailsData = ref({})
const search = async () => {
  // const dateRange = {}
  // console.log(date.value)
  // switch (date.value) {
  //   case '今日':
  //     dateRange.time1 = moment().startOf('day').hour(0).format('YYYY-MM-DD HH:mm:ss')
  //     dateRange.time2 = moment().endOf('day').add(0, 'day').hour(23).format('YYYY-MM-DD HH:mm:ss')
  //     break
  //   case '最近3天':
  //     dateRange.time1 = moment().subtract(3, 'd').startOf('day').hour(0).format('YYYY-MM-DD HH:mm:ss')
  //     dateRange.time2 = moment().endOf('day').add(0, 'day').hour(23).format('YYYY-MM-DD HH:mm:ss')
  //     break
  //   case '最近7天':
  //     dateRange.time1 = moment().subtract(1, 'weeks').startOf('day').hour(0).format('YYYY-MM-DD HH:mm:ss')
  //     dateRange.time2 = moment().endOf('day').add(0, 'day').hour(23).format('YYYY-MM-DD HH:mm:ss')
  //     break
  //   case '最近1個月':
  //     dateRange.time1 = moment().subtract(1, 'month').startOf('day').hour(0).format('YYYY-MM-DD HH:mm:ss')
  //     dateRange.time2 = moment().endOf('day').add(0, 'day').hour(23).format('YYYY-MM-DD HH:mm:ss')
  //     break
  //   default:
  //     break
  // }
  // dateRange.time1 = new Date(dateRange.time1.replace(' ', 'T')).toISOString()
  // dateRange.time2 = new Date(dateRange.time2.replace(' ', 'T')).toISOString()
  detailsData.value = {}
  console.log(date.value)
  const { data } = await getPlayerDetailsApi(totalData.value.pid, date.value)
  if (data.code !== 200) return
  detailsData.value = data.data.data
  console.log(detailsData)
  console.log(totalData.value.pid)
  // const data2 = await getFriendsApi(totalData.value.pid, date.value)
  getFriends(date.value)
  // console.log(data2.data.data.data)
}

const friendsData = ref({})
const getFriends = async (datas = '') => {
  const { data } = await getFriendsApi(totalData.value.pid, datas)
  console.log(data)
  if (data.code !== 200) return
  friendsData.value = data.data.data
  if (friendsData.value.detail) {
    friendsData.value.detail.forEach((item, index) => {
      friendsData.value.detail[index].dividend = 0
    })
  }
}
watch(playDetailsModal, (val) => {
  if (val) {
    setTimeout(() => getFriends())
    newDate.value = null
    date.value = '今日'

    // setTimeout(() => search())
  }
})

// 跳轉玩家數據報表
const router = useRouter()
// const { jumpPlayerStore } = useStore()
const jumpPlayerDataReport = (data) => {
  setTimeout(() => {
    console.log(router)
    const { href } = router.resolve({
      name: 'playerDataReport',
      params: {
        jumpParam: data.account
      }
    })
    // query: {
    //   // 要传的参数
    //   jumpParam: data.account
    // },
    window.open(href, '_blank') // 打开新的窗口
    // router.push(`/playerDataReport/${data.account}`)
  }, 0)
}

// 跳轉邀請人
const jumpInviter = (account) => {
  if (account) emit('jumpInviter', account)
}

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const listModalWidth = computed(() => (wh.value === 'xl' ? '800px' : '95%'))
const isMobile = computed(() => wh.value === 'sm')

const depositLV = (e) => {
  let a = 300
  switch (e) {
    case 0:
      a = 100
      break
    case 1:
      a = 1000
      break
    case 2:
      a = 5000
      break
    case 3:
      a = 15000
      break
    case 4:
      a = 50000
      break
    case 5:
      a = 50000
      break
  }
  return a
}
// modal 開關
const closeModal = () => {
  detailsData.value = {}
  emit('update:playDetailsModal', false)
}
</script>

<style lang="scss" scoped>
.playerInfo {
  border: 1px solid $dark;
  border-radius: 5px;
  margin: 10px 0;
  color: $dark;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  li {
    width: 33%;
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid $dark;
    display: flex;
    align-items: center;
    justify-content: center;
    &.achieve {
      color: rgb(150, 150, 150);
    }
    span {
      margin-left: 5px;
    }
    &.isMobile {
      @include breakpoint-up('sm') {
        width: 100%;
      }
    }
  }
}
</style>
